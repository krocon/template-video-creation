#!/usr/bin/env node
/**
 * Render-Pipeline: rendert die HyperFrames-Komposition als MP4 – ohne Ton.
 *
 * HyperFrames liest Breite, Höhe und Dauer STATISCH aus dem HTML (vor jedem Skript).
 * Darum werden Format, Maße, Dauer (aus src/cues.js) und Voiceover-Spur für den Render kurz fest in
 * index.html eingetragen; danach wird das Original wiederhergestellt (Backup in .cache/).
 * Zusätzlich gehen lang/format als --variables an die Laufzeit (src/timeline.js).
 *
 *   node scripts/render_pipeline.js --lang en --format 16x9 [--quality draft] [--output dist/raw_en_16x9.mp4]
 */
import { execFileSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const args = process.argv.slice(2);
const opt = (name, def) => { const i = args.indexOf(`--${name}`); return i >= 0 && args[i + 1] ? args[i + 1] : def; };
const lang = opt('lang', 'de');
const format = opt('format', '9x16');
const quality = opt('quality', 'looks');   // Master: CRF 16 – finale Kompression macht mux_video.py
const output = opt('output', `dist/raw_${lang}_${format}.mp4`);

if (!['de', 'en'].includes(lang)) { console.error('❌ --lang muss de oder en sein'); process.exit(1); }
if (!['9x16', '16x9'].includes(format)) { console.error('❌ --format muss 9x16 oder 16x9 sein'); process.exit(1); }

// Variante bauen
const cuesSrc = fs.readFileSync('src/cues.js', 'utf8');
const cues = JSON.parse(cuesSrc.slice(cuesSrc.indexOf('{'), cuesSrc.lastIndexOf('}') + 1));
const L = cues.languages[lang];
const [w, h] = format === '16x9' ? [1920, 1080] : [1080, 1920];

let html = fs.readFileSync('index.html', 'utf8');
const swap = (re, to, what) => {
  if (!re.test(html)) { console.error(`❌ index.html: ${what} nicht gefunden – Variante kann nicht gebaut werden`); process.exit(1); }
  html = html.replace(re, to);
};
swap(/(<div id="composition"[\s\S]*?data-width=")\d+(")/, `$1${w}$2`, 'data-width');
swap(/(<div id="composition"[\s\S]*?data-height=")\d+(")/, `$1${h}$2`, 'data-height');
swap(/(<div id="composition"[\s\S]*?data-duration=")[\d.]+(")/, `$1${L.total}$2`, 'data-duration (Root)');
swap(/(<div id="composition"[\s\S]*?data-format=")[^"]+(")/, `$1${format}$2`, 'data-format');
swap(/(<audio id="voiceover"[^>]*?src=")[^"]+(")/, `$1${L.audio}$2`, 'Voiceover-src');
swap(/(<audio id="voiceover"[^>]*?data-duration=")[\d.]+(")/, `$1${L.total}$2`, 'Voiceover-Dauer');
swap(/("id":"lang"[^}]*"default":")[^"]+(")/, `$1${lang}$2`, 'Variable lang');
swap(/("id":"format"[^}]*"default":")[^"]+(")/, `$1${format}$2`, 'Variable format');
html = html.replace('<html lang="de"', `<html lang="${lang}"`);

// index.html kurzzeitig durch die Variante ersetzen (HyperFrames erlaubt genau EINE Root-Komposition)
// und danach garantiert wiederherstellen – auch bei Abbruch (Ctrl+C).
const BACKUP = '.cache/index.html.render-backup';
fs.mkdirSync('.cache', { recursive: true });
if (fs.existsSync(BACKUP)) {           // Rest eines abgebrochenen Laufs → erst Original zurückholen
  fs.copyFileSync(BACKUP, 'index.html');
  console.log('[i] index.html aus Backup eines abgebrochenen Renders wiederhergestellt');
  html = null;
}
if (html === null) process.exit(console.error('Bitte Befehl erneut starten.') || 1);
fs.copyFileSync('index.html', BACKUP);
const restore = () => { if (fs.existsSync(BACKUP)) { fs.copyFileSync(BACKUP, 'index.html'); fs.unlinkSync(BACKUP); } };
process.on('SIGINT', () => { restore(); process.exit(130); });
fs.writeFileSync('index.html', html);

console.log(`[*] Render: ${lang.toUpperCase()} · ${format} (${w}×${h}) · ${L.total} s → ${output}`);
fs.mkdirSync(path.dirname(path.resolve(output)), { recursive: true });
try {
  execFileSync('npx', ['-y', 'hyperframes', 'render',
    '-o', output, '-q', quality, '--strict',
    '--variables', JSON.stringify({ lang, format }),
  ], { stdio: 'inherit' });
  console.log(`[+] Fertig: ${output}`);
} catch (err) {
  console.error('[-] Render fehlgeschlagen:', err.message);
  process.exitCode = 1;
} finally {
  restore();
}
