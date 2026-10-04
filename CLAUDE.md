# CLAUDE.md — Operating Guidelines for 1-Minute Educational Videos

This project generates professional 1-minute educational motion graphics videos in German and English using HTML/CSS/GSAP and HyperFrames.

## Primary Directives & Conventions

1. **Deterministic Code Motion**:
   - Build all motion graphics in HTML/CSS/GSAP rendered via HyperFrames (`npx hyperframes render`).
   - Keep 100% of styles, timings, and typography in code — never spend credits on diffusion models for text or UI elements.

2. **The 2-Phase Rule (Crucial)**:
   - **Phase 1 (Curriculum & Script)**: 0 cost. Draft the 60-second script (DE and/or EN), calculate word count (~135-155 words total, ~2.3-2.5 words/sec), structure into 5 scenes (Hook, Problem, 3-5 Points, Action, Outro).
   - **Freigabe-Gate**: STOP and wait for explicit user approval ("Go") before triggering any TTS API or rendering.
   - **Phase 2 (Production)**: Run audio pipeline (ElevenLabs TTS -> `atempo=1.15` via ffmpeg -> Whisper transcription -> beat-synced GSAP animation -> render & mux).

3. **Audio & Beat-Sync Rules**:
   - Always accelerate TTS audio by 1.15x: `ffmpeg -i vo.mp3 -filter:a "atempo=1.15" -b:a 128k vo_fast.mp3`.
   - Transcribe the *accelerated* audio with Whisper to get word-level timestamps.
   - Bind GSAP animation entrances (`tl.from()`, `tl.to()`) strictly to the timestamp when the respective keyword is pronounced.
   - Background music must duck under the voiceover (-18dB to -22dB).

4. **Multi-Language Standards (DE & EN)**:
   - German: Use `hyphens: auto`, `text-wrap: pretty`, typographical quotes `„...“`. Account for longer compound words.
   - English: Use typographical quotes `“...”`, concise wording.
   - All AI visual prompts (images/video clips) must be in English with `"no readable text, no captions"`.

5. **Commands Quick Reference**:
   - `npm run dev`: Start preview studio
   - `npm run check`: Run HyperFrames lint, runtime validation, and contrast checks
   - `npm run build`: Render full video and mux with audio
   - `python3 scripts/audio_accelerator.py --input <in> --output <out> --speed 1.15`
   - `python3 scripts/whisper_transcribe.py --audio <audio_path> --output <json_path>`

For full architectural details, see [AGENTS.md](file:///Users/marckronberg/WebstormProjects/template-video-creation/AGENTS.md).
