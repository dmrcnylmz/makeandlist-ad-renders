// Contact sheet of an ad at chosen moments, for review before a full render.
//   node stills.mjs a01 9x16 0.5,2.5,5,8,11,14 [outFile]
import puppeteer from 'puppeteer-core';
import { readdir } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const [id, f = '9x16', times = '1,3,5,8,11,14', outArg] = process.argv.slice(2);
const SIZE = { '9x16': [1080, 1920], '4x5': [1080, 1350], '16x9': [1920, 1080], '1x1': [1080, 1080] };
const file = (await readdir(here)).find((n) => n.startsWith(id) && n.endsWith('.html'));
const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true, args: ['--allow-file-access-from-files', '--hide-scrollbars'] });
const page = await browser.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
await page.setViewport({ width: SIZE[f][0], height: SIZE[f][1] });
await page.goto(pathToFileURL(path.join(here, file)).href + '?f=' + f, { waitUntil: 'networkidle0', timeout: 90000 });
const ready = await page.evaluate(() => window.__ready);
if (errors.length) { console.log(JSON.stringify({ errors })); await browser.close(); process.exit(1); }
const shots = [];
const ts = times.split(',').map(Number);
for (const t of ts) {
  // Walk up to t frame by frame for the last 10 frames so frame-to-frame state (if any) matches the film.
  await page.evaluate((x) => window.__seek(x), t);
  const p = path.join(os.tmpdir(), `still-${id}-${f}-${t}.jpg`);
  await page.screenshot({ type: 'jpeg', quality: 85, path: p });
  shots.push(p);
}
await browser.close();
const out = outArg || path.join(os.tmpdir(), `sheet-${id}-${f}.jpg`);
execFileSync('python3', ['-c', `
import sys
from PIL import Image
fs=sys.argv[2:]; ims=[Image.open(x) for x in fs]
w,h=ims[0].size; s=0.36 if h>w else 0.3
tw,th=int(w*s),int(h*s)
sheet=Image.new('RGB',(tw*len(ims)+8*(len(ims)-1),th),'white')
for i,im in enumerate(ims): sheet.paste(im.resize((tw,th)),(i*(tw+8),0))
sheet.save(sys.argv[1],quality=85)`, out, ...shots]);
console.log(JSON.stringify({ out, ready, errors }));
