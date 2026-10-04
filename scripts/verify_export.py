#!/usr/bin/env python3
"""
Endprüfung der exportierten Videos (Prompt 05, Schritt 4) + Review-Standbilder.

Prüft je dist/final_<slug>_<lang>_<format>.mp4:
  Dauer (= Timeline-Länge aus src/cues.js), Auflösung, FPS, Tonspur, A/V-Startversatz,
  Lautheit (-16 LUFS ±1.5, True Peak ≤ -1 dBTP), Dateigröße (Ideal 8–25 MB).
Schreibt zu jeder Szene ein Standbild nach dist/review/ (für die visuelle Kontrolle).
"""
import glob, json, os, re, subprocess, sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
os.chdir(ROOT)
slug = json.load(open('video.config.json'))['topicSlug']
cues = json.loads(re.search(r'=\s*(\{.*\});', open('src/cues.js', encoding='utf-8').read(), re.S).group(1))
SIZES = {'9x16': (1080, 1920), '16x9': (1920, 1080)}


def probe(path):
    out = subprocess.run(['ffprobe', '-v', 'error', '-show_entries',
                          'format=duration,size:stream=codec_type,width,height,avg_frame_rate,start_time',
                          '-of', 'json', path], capture_output=True, text=True, check=True).stdout
    return json.loads(out)


def loudness(path):
    log = subprocess.run(['ffmpeg', '-hide_banner', '-i', path, '-af', 'ebur128=peak=true', '-f', 'null', '-'],
                         capture_output=True, text=True).stderr
    summary = log[log.rfind('Summary:'):]
    i = re.search(r'I:\s+(-?[\d.]+) LUFS', summary)
    tp = re.search(r'Peak:\s+(-?[\d.]+) dBFS', summary)
    return (float(i.group(1)) if i else None, float(tp.group(1)) if tp else None)


files = sorted(glob.glob(f'dist/final_{slug}_*_*.mp4'))
if not files:
    sys.exit(f'❌ Keine Exporte gefunden (dist/final_{slug}_*.mp4) – zuerst npm run export')

os.makedirs('dist/review', exist_ok=True)
problems = 0
print(f"{'Datei':44} {'Dauer':>8} {'Soll':>7} {'Auflösung':>11} {'FPS':>4} {'LUFS':>6} {'TP':>6} {'MB':>6}  Status")
for f in files:
    m = re.search(rf'final_{slug}_(de|en)_(9x16|16x9)\.mp4$', f)
    if not m:
        continue
    lang, fmt = m.groups()
    info = probe(f)
    v = next(s for s in info['streams'] if s['codec_type'] == 'video')
    a = next((s for s in info['streams'] if s['codec_type'] == 'audio'), None)
    dur = float(info['format']['duration'])
    size = int(info['format']['size']) / 1e6
    num, den = map(int, v['avg_frame_rate'].split('/'))
    fps = num / den if den else 0
    want = cues['languages'][lang]['total']
    lufs, tp = loudness(f)
    issues = []
    if abs(dur - want) > 0.25: issues.append(f'Dauer ≠ {want}s')
    if (v['width'], v['height']) != SIZES[fmt]: issues.append('Auflösung')
    if not a: issues.append('keine Tonspur')
    elif abs(float(a.get('start_time', 0)) - float(v.get('start_time', 0))) > 0.04: issues.append('A/V-Versatz')
    if lufs is None or abs(lufs + 16) > 1.5: issues.append('Lautheit')
    if tp is not None and tp > -1.0: issues.append('True Peak')
    if not 8 <= size <= 25: issues.append(f'Größe {size:.0f} MB (Ideal 8–25)')
    hard = [i for i in issues if not i.startswith('Größe')]
    problems += len(hard)
    status = '✅' if not issues else ('⚠️  ' if not hard else '❌ ') + ', '.join(issues)
    print(f"{os.path.basename(f):44} {dur:7.2f}s {want:6.2f}s {v['width']:>5}x{v['height']:<5} {fps:4.0f} "
          f"{(lufs if lufs is not None else float('nan')):6.1f} {(tp if tp is not None else float('nan')):6.1f} {size:6.1f}  {status}")

    # Review-Standbilder: kurz vor jedem Szenenwechsel (= Endzustand der Szene)
    c = cues['languages'][lang]['cues']
    shots = {'1-hook': c['scene2'], '2a-versions': c['scene2b'], '2b-reactive': c['p1'], '3-p1': c['p2'],
             '3-p2': c['p3'], '3-p3': c['p4'], '3-p4': c['scene4'], '4-action': c['scene5'], '5-outro': want}
    for name, t in shots.items():
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', f'{max(0, t - 0.2):.2f}', '-i', f, '-frames:v', '1',
                        '-q:v', '3', f'dist/review/{lang}_{fmt}_{name}.jpg'], check=False)

print(f'\nReview-Standbilder: dist/review/  ·  ' + ('Alles ok ✅' if not problems else f'{problems} Problem(e) ❌'))
sys.exit(1 if problems else 0)
