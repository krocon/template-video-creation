#!/usr/bin/env bash
# Prompt 05: Lint → Render → Mux → Endprüfung für alle Varianten (DE/EN × 9:16/16:9).
#   npm run export                     # alle 4 Varianten, mit Hintergrundmusik
#   npm run export -- --no-music       # nur Voiceover
#   LANGS="de" FORMATS="9x16" npm run export   # Auswahl
set -euo pipefail
cd "$(dirname "$0")/.."
LANGS="${LANGS:-de en}"
FORMATS="${FORMATS:-9x16 16x9}"
EXTRA="${1:-}"

echo "── Chrome für HyperFrames sicherstellen ──"; npx -y hyperframes browser ensure
echo "── Lint ──"; npx -y hyperframes lint
for L in $LANGS; do
  for F in $FORMATS; do
    node scripts/build_all.js --lang "$L" --format "$F" $EXTRA
  done
done
echo "── Endprüfung ──"; python3 scripts/verify_export.py
