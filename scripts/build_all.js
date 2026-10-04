#!/usr/bin/env node
/**
 * Master Build Pipeline for 1-Minute Educational Videos.
 * Automates: Voiceover -> Acceleration -> Transcribe -> Render -> Mux -> Deliverable MP4
 */
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const args = process.argv.slice(2);
let lang = 'de';
let format = '9x16';

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--lang' && args[i + 1]) lang = args[i + 1];
  if (args[i] === '--format' && args[i + 1]) format = args[i + 1];
}

console.log(`=======================================================`);
console.log(`🚀 1-MINUTE VIDEO BUILD PIPELINE`);
console.log(`   Language: ${lang.toUpperCase()} | Format: ${format}`);
console.log(`=======================================================\n`);

const scriptText = `assets/scripts_text/phishing_${lang}.txt`;
const rawAudio = `assets/audio/vo_${lang}.mp3`;
const fastAudio = `assets/audio/vo_${lang}_fast.mp3`;
const timestampsJson = `assets/audio/timestamps_${lang}.json`;
const rawVideo = `dist/raw_${lang}_${format}.mp4`;
const finalVideo = `dist/final_phishing_${lang}_${format}.mp4`;
const bgMusic = `assets/audio/music/ambient_beat.mp3`;

function runStep(name, cmd) {
  console.log(`\n▶ [STEP] ${name}`);
  console.log(`  $ ${cmd}`);
  try {
    execSync(cmd, { stdio: 'inherit' });
  } catch (err) {
    console.error(`❌ Failed at step: ${name}`);
    process.exit(1);
  }
}

// 1. Audio Generation (if not already present)
if (!fs.existsSync(rawAudio)) {
  runStep('Generate TTS Voiceover', `python3 scripts/tts_generator.py --text-file "${scriptText}" --output "${rawAudio}" --lang "${lang}"`);
} else {
  console.log(`ℹ️ [SKIP] Using existing raw audio: ${rawAudio}`);
}

// 2. Audio Acceleration (atempo=1.15)
runStep('Accelerate Voiceover (atempo=1.15)', `python3 scripts/audio_accelerator.py --input "${rawAudio}" --output "${fastAudio}" --speed 1.15`);

// 3. Whisper Transcription & Cue Timestamps
runStep('Transcribe Audio to Timestamps', `python3 scripts/whisper_transcribe.py --audio "${fastAudio}" --output "${timestampsJson}" --lang "${lang}"`);

// 4. Render Motion Graphics Composition
runStep('Render Video Frames via HyperFrames', `node scripts/render_pipeline.js --format "${format}" --lang "${lang}" --output "${rawVideo}"`);

// 5. Mux Video + Accelerated Voice + Background Music with Ducking
const musicArg = fs.existsSync(bgMusic) ? `--music "${bgMusic}"` : '';
runStep('Mux Audio & Video with Sidechain Ducking', `python3 scripts/mux_video.py --video "${rawVideo}" --voice "${fastAudio}" --output "${finalVideo}" ${musicArg}`);

console.log(`\n=======================================================`);
console.log(`🎉 BUILD FINISHED! Deliverable ready:`);
console.log(`   ▶ ${finalVideo}`);
console.log(`=======================================================\n`);
