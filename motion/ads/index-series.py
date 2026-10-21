"""Writes INDEX.md for the rendered series from each ad's manifest.json and CAPTIONS.md.

    python3 index-series.py "<series folder>"
"""
import json
import os
import sys

root = sys.argv[1]
rows = []
for d in sorted(os.listdir(root)):
    m = os.path.join(root, d, 'manifest.json')
    if not os.path.isfile(m):
        continue
    man = json.load(open(m))
    cap = open(os.path.join(root, d, 'CAPTIONS.md')).read()
    short = cap.split('**Short:**', 1)[1].split('\n', 1)[0].strip() if '**Short:**' in cap else ''
    ok = all(v['ok'] for v in man['videos'])
    files = ', '.join(v['format'] for v in man['videos'])
    rows.append((man['series'], man['title'], short, man.get('technique', ''), files, ok))

lines = [
    '# MakeAndList · Yeni ekranlardan reklam serisi (R02, 2026-10-21)',
    '',
    f'{len(rows)} reklam, her biri 15 saniye; 9:16 (Reels · TikTok · Shorts) ve 4:5 (Instagram / Facebook akışı), ayrı yerleşimle.',
    'Kaynak: v2 canvas ekranları, uygulamanın kendisinden 21 Ekim\'de çekilen gerçek ekranlar (demo çalışma alanı) ve sahibin ürünleri.',
    'Her klasörde MP4, kapak, manifest.json (kalite kontrolü) ve CAPTIONS.md (paylaşım metni) var. Ses: her reklama özel sentez müzik ve efekt,',
    '-14 LUFS / -1 dBTP. Seslendirme yok; mesaj ekrandaki yazıda. Teknikler ve promptlar: ARASTIRMA-VE-PROMPTLAR.md.',
    '',
    '| # | Reklam | Tek cümle | Teknik | Formatlar | QC |',
    '|---|---|---|---|---|---|',
]
for sid, title, short, tech, files, ok in rows:
    lines.append(f'| {sid} | {title} | {short} | {tech} | {files} | {"✓" if ok else "✗"} |')
lines += [
    '',
    '## Önerilen test sırası',
    '',
    '- Kanca testi (ilk 2 saniye): B18 Spotlight, B09 Shape Match Cuts, B04 Thermal Receipt, B15 Counter-Marquee.',
    '- Ürün anlatımı: B01 Metro Line, B08 One-Take Scroll, B07 Highlighter Brief, B13 You / The App.',
    '- Güven ("senin onayın"): B13, B04, B01.',
    '- Baskı (print on demand): B03 Riso, B11 Blueprint, B12 One Design Three Things.',
    '- Zanaat / marka: B02 Paper Workshop, B05 Overhead Desk, B06 Loupe, B14 Rack Focus, B16 Scanner, B17 Polaroid, B10 Unboxing.',
    '',
    'Yeniden üretmek: github.com/dmrcnylmz/makeandlist-ad-renders (motion/ads, BRIEF-R02.md).',
]
open(os.path.join(root, 'INDEX.md'), 'w').write('\n'.join(lines) + '\n')
print(len(rows), 'ads indexed')
