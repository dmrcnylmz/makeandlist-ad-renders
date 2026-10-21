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
    '# MakeAndList · Ekranlardan reklam serisi (R01, 2026-10-20)',
    '',
    f'{len(rows)} reklam, her biri 15 saniye; 9:16 (Reels · TikTok · Shorts) ve 4:5 (Instagram / Facebook akışı).',
    'Gerçek uygulama ekranları (demo çalışma alanı) ve sahibin MakeAndList ile yaptığı gerçek ürünlerle hazırlandı;',
    'her klasörde MP4, kapak görseli, manifest.json (kalite kontrolü) ve CAPTIONS.md (paylaşım metni) var.',
    'Ses: her reklama özel sentezlenmiş müzik ve efekt, -14 LUFS / -1 dBTP. Seslendirme yok; mesaj ekrandaki yazıda.',
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
    '- Kanca testi (ilk 3 saniye): A19 Manifesto, A02 The Price First, A20 POV, A10 Speed Run.',
    '- Ürün anlatımı: A01 Idea to Listing, A09 Blank To Finished, A13 One Sentence, A03 Every Page Planned.',
    '- Güven: A07 Your Yes, A08 Approved By You, A14 Real Numbers.',
    '- Baskı (print on demand): A04 One Artwork Six Objects, A12 Try It On.',
    '- Marka / yeniden hedefleme: A17 Brand Orbit, A16 The Wall, A11 Look Inside, A15 Ideas For The Season.',
    '',
    'Yeniden üretmek: repo içinde `motion/ads` (README.md).',
]
open(os.path.join(root, 'INDEX.md'), 'w').write('\n'.join(lines) + '\n')
print(len(rows), 'ads indexed')
