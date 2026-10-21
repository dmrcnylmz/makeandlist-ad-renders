// Renders the ad series: every frame seeked (no wall clock), piped to ffmpeg, then an original synthesised score
// mixed to -14 LUFS / -1.5 dBTP, a cover still, and a manifest with QC per file.
//
//   node render-ads.mjs [ids…] [--f=9x16,4x5] [--out=<dir>]
//
// Output: <out>/<Axx Title>/MakeAndList-Axx-<format>-EN.mp4 (+ cover, manifest.json, CAPTIONS.md).
import puppeteer from 'puppeteer-core';
import { spawn } from 'node:child_process';
import { mkdir, readdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const CHROME = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const args = process.argv.slice(2);
const opt = (k, d) => (args.find((a) => a.startsWith(`--${k}=`)) || `--${k}=${d}`).split('=')[1];
const FORMATS = opt('f', '9x16,4x5').split(',');
const OUT = opt('out', 'out');
const SIZE = { '9x16': [1080, 1920], '4x5': [1080, 1350], '16x9': [1920, 1080], '1x1': [1080, 1080] };
const USE = { '9x16': 'Reels · TikTok · Stories · Shorts', '4x5': 'Instagram / Facebook feed', '16x9': 'YouTube · web · landing', '1x1': 'Feed · LinkedIn' };
const FPS = 30;
const TMP = path.join(os.tmpdir(), 'mkl-ads');

function run(cmd, a, input, capture) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, a, { stdio: [input ? 'pipe' : 'ignore', capture ? 'pipe' : 'ignore', 'pipe'] });
    let err = '', out = '';
    p.stderr.on('data', (d) => { err += d; if (err.length > 60000) err = err.slice(-60000); });
    if (capture) p.stdout.on('data', (d) => { out += d; });
    p.on('error', reject);
    p.on('close', (code) => (code === 0 ? resolve({ out, err }) : reject(new Error(cmd + ' exited ' + code + '\n' + err.slice(-3000)))));
    if (input) input(p.stdin);
  });
}

async function compositions() {
  const ids = args.filter((a) => !a.startsWith('--'));
  const files = (await readdir(here)).filter((f) => /^[ab]\d\d-.*\.html$/.test(f)).sort();
  return files.filter((f) => !ids.length || ids.some((id) => f.startsWith(id)));
}

async function renderOne(browser, file, format) {
  const [w, h] = SIZE[format];
  const page = await browser.newPage();
  await page.setViewport({ width: w, height: h, deviceScaleFactor: 1 });
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.goto(pathToFileURL(path.join(here, file)).href + '?f=' + format, { waitUntil: 'networkidle0', timeout: 90000 });
  const ready = await page.evaluate(() => window.__ready);
  const meta = await page.evaluate(() => window.__meta);
  if (!ready.fonts.playfair || !ready.fonts.archivo || !ready.fonts.mono) throw new Error(file + ': fonts ' + JSON.stringify(ready.fonts));
  if (ready.broken.length) throw new Error(file + ': broken images ' + ready.broken.join(', '));
  if (errors.length) throw new Error(file + ': page errors ' + errors.join(' | '));
  const id = meta.id;
  const folder = path.join(OUT, `${id} ${meta.title}`);
  await mkdir(folder, { recursive: true });
  await mkdir(TMP, { recursive: true });
  const base = `MakeAndList-${id}-${format}-EN`;
  const silent = path.join(TMP, base + '.silent.mp4');
  const frames = Math.round(meta.dur * FPS);
  const t0 = Date.now();
  await run('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '17', '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-r', String(FPS), '-movflags', '+faststart', silent], async (stdin) => {
    for (let i = 0; i < frames; i++) {
      await page.evaluate((t) => window.__seek(t), i / FPS);
      const jpg = await page.screenshot({ type: 'jpeg', quality: 96 });
      if (!stdin.write(jpg)) await new Promise((r) => stdin.once('drain', r));
    }
    stdin.end();
  });
  // Cover
  await page.evaluate((t) => window.__seek(t), meta.cover ?? Math.min(meta.dur - 0.5, 2.2));
  const cover = path.join(folder, base + '-cover.jpg');
  await page.screenshot({ type: 'jpeg', quality: 90, path: cover });
  await page.close();

  // Score, then loudness: measure, then apply (two-pass loudnorm).
  const metaFile = path.join(TMP, base + '.json');
  await writeFile(metaFile, JSON.stringify(meta));
  const wav = path.join(TMP, base + '.wav');
  await run('python3', [path.join(here, 'score.py'), metaFile, wav]);
  const m = await run('ffmpeg', ['-hide_banner', '-i', wav, '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json', '-f', 'null', '-'], null, false);
  const js = JSON.parse(m.err.slice(m.err.lastIndexOf('{'), m.err.lastIndexOf('}') + 1));
  const final = path.join(folder, base + '.mp4');
  // The AAC encoder can spike past the limiter on a single transient (seen once on Linux ffmpeg: two samples at +1 dBFS);
  // a failed true peak is re-muxed with a tighter ceiling, then another bitrate and coder.
  let qc;
  for (const [limit, rate, coder] of [[0.63, '192k', 'twoloop'], [0.5, '192k', 'twoloop'], [0.5, '256k', 'fast'], [0.4, '256k', 'fast']]) {
    const ln = `loudnorm=I=-14:TP=-1.5:LRA=11:measured_I=${js.input_i}:measured_TP=${js.input_tp}:measured_LRA=${js.input_lra}:measured_thresh=${js.input_thresh}:offset=${js.target_offset}:linear=true,aresample=192000,alimiter=limit=${limit}:attack=1:release=60:level=false,aresample=48000`;
    await run('ffmpeg', ['-y', '-loglevel', 'error', '-i', silent, '-i', wav, '-map', '0:v', '-map', '1:a', '-c:v', 'copy',
      '-af', ln, '-c:a', 'aac', '-aac_coder', coder, '-b:a', rate, '-ar', '48000', '-shortest', '-movflags', '+faststart', final]);
    qc = await qcOf(final, meta.dur, w, h);
    if (qc.find((c) => c.name.startsWith('true peak')).ok) break;
  }
  await rm(silent); await rm(wav); await rm(metaFile);
  const bytes = (await stat(final)).size;
  console.log(`✓ ${base}  ${frames}f  ${((Date.now() - t0) / 1000).toFixed(0)}s  ${(bytes / 1048576).toFixed(1)} MB  ${qc.every((c) => c.ok) ? 'QC ok' : 'QC FAIL ' + JSON.stringify(qc.filter((c) => !c.ok))}`);
  return { meta, folder, entry: { file: base + '.mp4', cover: base + '-cover.jpg', format, use: USE[format], lang: 'en', bytes, durationSec: meta.dur, width: w, height: h, fps: `${FPS}/1`, hasAudio: true, qc, ok: qc.every((c) => c.ok) } };
}

async function qcOf(file, dur, w, h) {
  const p = await run('ffprobe', ['-v', 'error', '-show_entries', 'stream=codec_type,width,height,r_frame_rate,sample_rate', '-show_entries', 'format=duration', '-of', 'json', file], null, true);
  const j = JSON.parse(p.out);
  const v = j.streams.find((s) => s.codec_type === 'video');
  const a = j.streams.find((s) => s.codec_type === 'audio');
  const d = Number(j.format.duration);
  const e = await run('ffmpeg', ['-hide_banner', '-i', file, '-af', 'ebur128=peak=true', '-f', 'null', '-'], null, false);
  const I = Number((e.err.match(/I:\s+(-?[\d.]+) LUFS/g) || []).pop()?.match(/-?[\d.]+/)[0]);
  const TP = Number((e.err.match(/Peak:\s+(-?[\d.]+) dBFS/g) || []).pop()?.match(/-?[\d.]+/)[0]);
  return [
    { name: 'duration', ok: Math.abs(d - dur) < 0.1, detail: d.toFixed(2) + 's' },
    { name: 'resolution', ok: v.width === w && v.height === h, detail: `${v.width}x${v.height}` },
    { name: 'fps', ok: v.r_frame_rate === `${FPS}/1`, detail: v.r_frame_rate },
    { name: 'audio track', ok: !!a && a.sample_rate === '48000', detail: a ? 'AAC 48 kHz' : 'none' },
    { name: 'loudness -14 LUFS ±1', ok: Math.abs(I + 14) <= 1, detail: I + ' LUFS' },
    { name: 'true peak ≤ -1 dBTP', ok: TP <= -1, detail: TP + ' dBTP' },
  ];
}

async function writeDocs(meta, folder, entries) {
  await writeFile(path.join(folder, 'manifest.json'), JSON.stringify({ product: 'MakeAndList', series: meta.id, title: meta.title,
    generatedAt: new Date().toISOString(), source: 'marketplace-listing-saas motion/ads (frame-exact HTML compositions, real app screens)',
    technique: meta.technique, videos: entries }, null, 2));
  const rows = entries.map((e) => `| ${e.file} | ${e.format} | ${e.use} |`).join('\n');
  await writeFile(path.join(folder, 'CAPTIONS.md'), `# MakeAndList · ${meta.id} ${meta.title}\n\n**Technique:** ${meta.technique}\n\n| File | Format | Use |\n|---|---|---|\n${rows}\n\n## Caption (EN)\n\n${meta.caption}\n\n**Short:** ${meta.short}\n\n${meta.tags || '#MakeAndList #Printables #DigitalDownloads #PrintOnDemand #SmallBusiness'}\n\n## On-screen story\n\n${(meta.beats || []).map((b) => `- ${b}`).join('\n')}\n\nAudio: original score and effects synthesised for this brand (no samples, no licence needed), mixed to -14 LUFS / -1.5 dBTP. No voice-over.\nScreens are the real MakeAndList app with its demo workspace (sample data), labelled on screen.\n`);
}

const files = await compositions();
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--allow-file-access-from-files', '--hide-scrollbars', '--force-color-profile=srgb', ...(process.env.CI ? ['--no-sandbox', '--disable-dev-shm-usage'] : [])] });
try {
  for (const file of files) {
    if (args.includes('--resume')) {
      const id = file.slice(0, 3).toUpperCase();
      const dirs = (await readdir(OUT).catch(() => [])).filter((d) => d.startsWith(id + ' '));
      const man = dirs.length ? await readFile(path.join(OUT, dirs[0], 'manifest.json'), 'utf8').then(JSON.parse).catch(() => null) : null;
      if (man && FORMATS.every((f) => man.videos.some((v) => v.format === f && v.ok))) { console.log('= ' + id + ' already rendered'); continue; }
    }
    const entries = [];
    let meta, folder;
    for (const f of FORMATS) {
      let r;
      for (let attempt = 1; ; attempt++) {
        try { r = await renderOne(browser, file, f); break; }
        catch (e) {
          // A lost page (memory pressure, a crashed renderer) is retried from the first frame, twice at most.
          console.log(`! ${file} ${f} attempt ${attempt}: ${String(e.message || e).split('\n')[0]}`);
          if (attempt >= 3) throw e;
        }
      }
      entries.push(r.entry); meta = r.meta; folder = r.folder;
    }
    await writeDocs(meta, folder, entries);
  }
} finally {
  await browser.close();
}
