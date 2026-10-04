#!/usr/bin/env bash
# Audio-Pipeline (Prompt 03) für ein Skript-Slug, DE + EN.
# Aufruf: npm run audio  (Slug aus video.config.json)  oder  npm run audio -- <slug>
# Schritte: TTS → atempo 1.15 → Pausen kürzen → Whisper → src/cues.js.
# Bricht hart ab, wenn ElevenLabs-Key oder Whisper fehlen (statt Sinuston-/Platzhalter-Fallback).
set -euo pipefail
cd "$(dirname "$0")/.."
# Slug: 1. Argument, sonst "topicSlug" aus video.config.json
SLUG="${1:-$(python3 -c "import json; print(json.load(open('video.config.json')).get('topicSlug',''))")}"
[ -n "$SLUG" ] || { echo "❌ Kein Slug: Argument angeben oder topicSlug in video.config.json setzen."; exit 1; }

# CA-Bundle für Python (python.org-Python auf macOS: CERTIFICATE_VERIFY_FAILED) – gilt für TTS und Whisper-Download
if [ -z "${SSL_CERT_FILE:-}" ]; then
  CA=$(python3 -c "import certifi; print(certifi.where())" 2>/dev/null || true)
  [ -z "$CA" ] && [ -f /etc/ssl/cert.pem ] && CA=/etc/ssl/cert.pem
  [ -n "$CA" ] && export SSL_CERT_FILE="$CA"
fi

if ! { [ -f .env ] && grep -Eq '^ELEVENLABS_API_KEY=.+' .env && ! grep -q 'dein_key_hier' .env; }; then
  echo "❌ Kein ElevenLabs-Key: cp .env.example .env und ELEVENLABS_API_KEY eintragen."; exit 1; fi
python3 -c "import whisper" 2>/dev/null || { echo "❌ Whisper fehlt: npm run setup:whisper"; exit 1; }

for L in de en; do
  UP=$(echo "$L" | tr a-z A-Z)
  TXT="assets/scripts_text/${SLUG}_${L}.txt"
  RAW="assets/audio/${SLUG}_vo_${L}.mp3"
  FAST="assets/audio/${SLUG}_vo_${L}_fast.mp3"
  TS="assets/audio/${SLUG}_timestamps_${L}.json"
  echo "── $UP: $(wc -w < "$TXT" | tr -d ' ') Wörter ──"
  python3 scripts/tts_generator.py --text-file "$TXT" --output "$RAW" --lang "$L"
  python3 scripts/audio_accelerator.py --input "$RAW" --output "$FAST" --speed 1.15
  # Lange TTS-Pausen kürzen (DE-Stimme pausiert deutlich länger) – vor Whisper, damit Timestamps passen
  if [ "$L" = de ]; then MAXP=0.40; else MAXP=0.55; fi
  python3 scripts/pause_trim.py --input "$FAST" --output "$FAST" --max-pause "$MAXP"
  python3 scripts/whisper_transcribe.py --audio "$FAST" --output "$TS" --lang "$L"
  DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$FAST")
  printf "✅ %s: %.1f s  →  %s\n" "$UP" "$DUR" "$FAST"
  awk -v d="$DUR" 'BEGIN{ if (d<57) print "   ⚠️ unter 57 s"; else if (d>62) print "   ⚠️ über 62 s – Skript kürzen"; else print "   👍 Zielkorridor 57–61 s" }'
done

# Beat-Sync-Cues für die GSAP-Timeline aktualisieren
node scripts/build_cues.js "$SLUG"
