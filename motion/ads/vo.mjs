// Voices each ad's meta.vo lines ([[t, "text"], …]) with Cartesia (sonic-3, the owner's chosen narrator), once:
// motion/vo/<ID>/<n>.wav + index.json ({ t, text, file, dur }). Lines already voiced with the same text and voice are
// reused. The key comes from CARTESIA_API_KEY or motion/.cartesia-key (git-ignored; never commit it).
//
//   node vo.mjs e01 e02     (ad prefixes)        → prints each line's duration so timing can be fitted
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const require = createRequire(import.meta.url);
const puppeteer = require('puppeteer-core');
const here = path.dirname(fileURLToPath(import.meta.url));
const VOICE = '26403c37-80c1-4a1a-8692-540551ca2ae5'; // Marian — Poised Narrator (chosen by the owner, 2026-10-21)
const KEY = process.env.CARTESIA_API_KEY || readFileSync(path.join(here, '..', '.cartesia-key'), 'utf8').trim();
const CHROME = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const ids = process.argv.slice(2);
const files = readdirSync(here).filter((f) => /^[a-z]\d\d-.*\.html$/.test(f) && (!ids.length || ids.some((i) => f.startsWith(i))));
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--allow-file-access-from-files'] });
const wavDur = (buf) => (buf.length - 44) / (48000 * 2);
try {
  for (const f of files) {
    const page = await browser.newPage();
    await page.goto(pathToFileURL(path.join(here, f)).href + '?f=9x16', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.__meta, { timeout: 30000 });
    const meta = await page.evaluate(() => window.__meta);
    await page.close();
    if (!meta.vo || !meta.vo.length) continue;
    const dir = path.join(here, '..', 'vo', meta.id);
    mkdirSync(dir, { recursive: true });
    const old = existsSync(path.join(dir, 'index.json')) ? JSON.parse(readFileSync(path.join(dir, 'index.json'), 'utf8')) : [];
    const out = [];
    for (const [i, [t, text, speed]] of meta.vo.entries()) {
      const hash = createHash('sha1').update(VOICE + '|' + (speed || 1) + '|' + text).digest('hex').slice(0, 10);
      const file = `${String(i + 1).padStart(2, '0')}-${hash}.wav`;
      const p = path.join(dir, file);
      if (!existsSync(p)) {
        const res = await fetch('https://api.cartesia.ai/tts/bytes', { method: 'POST',
          headers: { 'X-API-Key': KEY, 'Cartesia-Version': '2025-04-16', 'Content-Type': 'application/json' },
          body: JSON.stringify({ model_id: 'sonic-3', transcript: text, voice: { mode: 'id', id: VOICE }, language: 'en',
            ...(speed ? { generation_config: { speed } } : {}),
            output_format: { container: 'wav', encoding: 'pcm_s16le', sample_rate: 48000 } }) });
        if (!res.ok) throw new Error(`${meta.id} line ${i + 1}: Cartesia ${res.status} ${await res.text()}`);
        writeFileSync(p, Buffer.from(await res.arrayBuffer()));
      }
      const dur = +wavDur(readFileSync(p)).toFixed(2);
      out.push({ t, text, file, dur });
      console.log(`${meta.id}  ${String(t).padStart(5)} s  ${dur.toFixed(2)} s  ends ${(t + dur).toFixed(2)}  ${text}`);
    }
    // Drop takes no longer used.
    for (const o of old) if (!out.some((x) => x.file === o.file) && existsSync(path.join(dir, o.file))) (await import('node:fs')).unlinkSync(path.join(dir, o.file));
    writeFileSync(path.join(dir, 'index.json'), JSON.stringify(out, null, 1));
  }
} finally { await browser.close(); }
