#!/usr/bin/env node
/**
 * Gesamt-Pipeline: (Audio falls fehlend) → Cues → Render → Mux (Voice + gedämpfte Musik).
 *   node scripts/build_all.js --lang de --format 9x16 [--no-music]
 * Thema/Dateinamen kommen aus video.config.json → topicSlug.
 */
import { execSync } from 'child_process';
import fs from 'fs';

const args = process.argv.slice(2);
const opt = (name, def) => { const i = args.indexOf(`--${name}`); return i >= 0 && args[i + 1] ? args[i + 1] : def; };
const lang = opt('lang', 'de');
const format = opt('format', '9x16');
const config = JSON.parse(fs.readFileSync('video.config.json', 'utf8'));
const slug = config.topicSlug;

const fastAudio = `assets/audio/${slug}_vo_${lang}_fast.mp3`;
const rawVideo = `dist/raw_${slug}_${lang}_${format}.mp4`;
const finalVideo = `dist/final_${slug}_${lang}_${format}.mp4`;
const bgMusic = config.audio?.music || '';   // Hintergrundmusik: video.config.json → audio.music

const run = (name, cmd) => {
  console.log(`\n▶ ${name}\n  $ ${cmd}`);
  try { execSync(cmd, { stdio: 'inherit' }); } catch { console.error(`❌ Abbruch bei: ${name}`); process.exit(1); }
};

console.log(`🚀 BUILD ${slug} · ${lang.toUpperCase()} · ${format}`);
if (!fs.existsSync(fastAudio)) run('Audio-Pipeline (TTS → atempo → Pausen → Whisper → Cues)', `bash scripts/run_audio.sh ${slug}`);
else run('Beat-Sync-Cues aktualisieren', `node scripts/build_cues.js ${slug}`);
run('Motion Graphics rendern (HyperFrames)', `node scripts/render_pipeline.js --lang ${lang} --format ${format} --output "${rawVideo}"`);
const noMusic = args.includes('--no-music');
if (!noMusic && bgMusic && !fs.existsSync(bgMusic)) { console.error(`❌ Musik nicht gefunden: ${bgMusic} (video.config.json → audio.music)`); process.exit(1); }
const music = !noMusic && bgMusic ? `--music "${bgMusic}"` : '';
run('Muxen: Voice + Musik mit Ducking', `python3 scripts/mux_video.py --video "${rawVideo}" --voice "${fastAudio}" --output "${finalVideo}" ${music} --ducking-db ${config.audio?.musicDuckingVolumeDb ?? -20}`);
console.log(`\n🎉 Fertig: ${finalVideo}`);
