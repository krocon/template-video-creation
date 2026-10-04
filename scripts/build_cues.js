#!/usr/bin/env node
/**
 * Cue-Generator (Beat-Sync): liest die Whisper-Wortzeitstempel beider Sprachen
 * und schreibt src/cues.js mit Szenenschnitten und Stichwort-Cues für die GSAP-Timeline.
 *
 * Aufruf:  node scripts/build_cues.js [slug]      (Slug sonst aus video.config.json → topicSlug)
 *
 * Jeder Cue wird als Wortmuster definiert und NACH dem vorherigen Cue gesucht (sequenziell),
 * damit wiederkehrende Wörter („Signal“, „Form“) immer die richtige Stelle treffen.
 * Whisper schreibt Fachbegriffe gern anders („Form -Grupps“, „M -Ine“) – die Muster fangen das ab.
 */
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const config = JSON.parse(fs.readFileSync(path.join(root, 'video.config.json'), 'utf8'));
const slug = process.argv[2] || config.topicSlug;
if (!slug) { console.error('❌ Kein Slug (Argument oder topicSlug in video.config.json).'); process.exit(1); }

const TAIL = 0.8;   // Nachlauf nach dem letzten Wort (s)
const LEAD = 0.12;  // Schnitte/Einblendungen minimal vor dem Wort, damit das Bild „steht“, wenn es gesprochen wird

// id: [Muster DE, Muster EN]  – Reihenfolge = Sprechreihenfolge
const SPEC = [
  ['hook_greet',       /^hallo$/,              /^hey$/],
  ['hook_question',    /^dein$/,               /^does$/],
  ['hook_subs',        /^subscriptions$/,      /^subscriptions$/],
  ['hook_fields',      /^eingabefelder$/,      /^fields$/],
  ['scene2',           /^zeit$/,               /^time$/],
  ['s2_v22',           /^22$/,                 /^22$/],
  ['s2_stable',        /^stabil$/,             /^stable$/],
  ['s2_prod',          /^produktionsreif$/,    /^production$/],
  ['scene2b',          /^reactive$/,           /^reactive$/],
  ['s2b_groups',       /^form$/,               /^form$/],
  ['s2b_value',        /^value/,               /^value/],
  ['s2b_types',        /^typen$/,              /^types$/],
  ['s2b_boiler',       /^boilerplate$/,        /^boilerplate$/],
  ['s2b_bugs',         /^fehlerquelle$/,       /^bugs$/],
  ['p1',               /^erstens$/,            /^first$/],
  ['p1_signal',        /^signal$/,             /^signal$/],
  ['p1_form',          /^funktion$/,           /^function$/],
  ['p2',               /^zweitens$/,           /^second$/],
  ['p2_field',         /^form$/,               /^form$/],
  ['p2_input',         /^input$/,              /^input$/],
  ['p2_sync',          /^synchron$/,           /^sync$/],
  ['p3',               /^drittens$/,           /^third$/],
  ['p3_required',      /^required$/,           /^required$/],
  ['p3_email',         /^(e|email|mail)$/,     /^(e|email|mail)$/],
  ['p3_min',           /^(min|m)$/,            /^(min|m)$/],
  ['p3_message',       /^fehler/,              /^error$/],
  ['p4',               /^viertens$/,           /^fourth$/],
  ['p4_valid',         /^valid$/,              /^valid$/],
  ['p4_touched',       /^touched$/,            /^touched$/],
  ['p4_errors',        /^errors$/,             /^errors$/],
  ['p4_nosub',         /^subscribe$/,          /^subscribe$/],
  ['scene4',           /^und$/,                /^so$/],
  ['a_pick',           /^nimm$/,               /^pick$/],
  ['a_import',         /^importiere$/,         /^import$/],
  ['a_model',          /^(signalmodell|signal)$/, /^signal$/],
  ['a_migrate',        /^(bestehende|migrierst)$/, /^(then|migrate)$/],
  ['scene5',           /^also$/,               /^remember$/],
  ['o_signal',         /^signal$/,             /^signal$/],
  ['o_form',           /^formular$/,           /^follows$/],
];

const norm = (w) => w.toLowerCase().replace(/[^a-z0-9äöüß]/g, '');

function audioDuration(file, fallback) {
  try {
    return parseFloat(execSync(`ffprobe -v error -show_entries format=duration -of csv=p=0 "${file}"`).toString());
  } catch { return fallback; }
}

const out = { slug, generated: 'scripts/build_cues.js', languages: {} };
let failed = false;

for (const [li, lang] of ['de', 'en'].entries()) {
  const tsFile = path.join(root, `assets/audio/${slug}_timestamps_${lang}.json`);
  const audioFile = `assets/audio/${slug}_vo_${lang}_fast.mp3`;
  if (!fs.existsSync(tsFile)) { console.error(`❌ ${tsFile} fehlt – zuerst npm run audio`); failed = true; continue; }
  const ts = JSON.parse(fs.readFileSync(tsFile, 'utf8'));
  const words = ts.segments.flatMap((s) => s.words || []).map((w) => ({ ...w, n: norm(w.word) }));
  const lastEnd = words[words.length - 1].end;
  const audioDur = audioDuration(path.join(root, audioFile), ts.duration);

  const cues = {};
  let i = 0;
  for (const [id, deRe, enRe] of SPEC) {
    const re = li === 0 ? deRe : enRe;
    let j = i;
    while (j < words.length && !re.test(words[j].n)) j++;
    if (j === words.length) { console.error(`❌ ${lang.toUpperCase()}: Cue „${id}“ (${re}) nicht gefunden`); failed = true; continue; }
    cues[id] = Math.max(0, +(words[j].start - LEAD).toFixed(2));
    i = j + 1;
  }
  cues.hook_greet = 0;               // Video startet mit dem ersten Bild
  cues.end_speech = +lastEnd.toFixed(2);
  const total = +(Math.max(audioDur, lastEnd) + TAIL).toFixed(2);

  out.languages[lang] = { audio: audioFile, audioDuration: +audioDur.toFixed(2), total, cues };
  console.log(`✅ ${lang.toUpperCase()}: ${Object.keys(cues).length} Cues, Audio ${audioDur.toFixed(2)} s → Video ${total} s`);
}

if (failed) process.exit(1);

const js = `/* AUTO-GENERIERT von scripts/build_cues.js – nicht von Hand bearbeiten (npm run cues). */
window.__LESSON_CUES = ${JSON.stringify(out, null, 2)};
`;
fs.writeFileSync(path.join(root, 'src/cues.js'), js);
console.log('→ src/cues.js geschrieben');
