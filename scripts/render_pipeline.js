#!/usr/bin/env node
/**
 * Render Pipeline for 1-Minute Educational Videos.
 * Invokes HyperFrames render engine to export MP4 from the HTML/GSAP composition.
 */
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const args = process.argv.slice(2);
let format = '9x16';
let lang = 'de';
let output = 'dist/raw_composition.mp4';

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--format' && args[i + 1]) format = args[i + 1];
  if (args[i] === '--lang' && args[i + 1]) lang = args[i + 1];
  if (args[i] === '--output' && args[i + 1]) output = args[i + 1];
}

console.log(`[*] Starting render pipeline...`);
console.log(`    Format: ${format} (${format === '9x16' ? '1080x1920' : '1920x1080'})`);
console.log(`    Language: ${lang.toUpperCase()}`);
console.log(`    Output: ${output}`);

fs.mkdirSync(path.dirname(path.resolve(output)), { recursive: true });

try {
  console.log(`[*] Executing HyperFrames render...`);
  const renderCmd = `npx -y hyperframes render -o "${output}"`;
  execSync(renderCmd, { stdio: 'inherit' });
  console.log(`[+] Render completed successfully: ${output}`);
} catch (err) {
  console.error(`[-] Render failed:`, err.message);
  process.exit(1);
}
