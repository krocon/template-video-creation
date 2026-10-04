#!/usr/bin/env bash
# System-Diagnose für das Video-Template. Aufruf: bash scripts/setup_check.sh
cd "$(dirname "$0")/.." || exit 1
ok(){ printf "✅ %-14s %s\n" "$1" "$2"; }
no(){ printf "❌ %-14s %s\n" "$1" "$2"; FAIL=1; }
FAIL=0

if command -v node >/dev/null; then
  v=$(node -v); major=${v#v}; major=${major%%.*}
  [ "$major" -ge 18 ] && ok "Node.js" "$v" || no "Node.js" "$v (>= 18 nötig: brew install node)"
else no "Node.js" "fehlt → brew install node"; fi
command -v npm >/dev/null && ok "npm" "$(npm -v)" || no "npm" "fehlt (kommt mit Node.js)"
command -v ffmpeg >/dev/null && ok "ffmpeg" "$(ffmpeg -version | head -1 | awk '{print $3}')" || no "ffmpeg" "fehlt → brew install ffmpeg"
command -v python3 >/dev/null && ok "python3" "$(python3 --version 2>&1)" || no "python3" "fehlt → brew install python"
python3 -m pip --version >/dev/null 2>&1 && ok "pip" "$(python3 -m pip --version | awk '{print $2}')" || no "pip" "fehlt → python3 -m ensurepip"
python3 -c "import whisper" 2>/dev/null && ok "whisper" "importierbar" || no "whisper" "fehlt → python3 -m pip install -U openai-whisper"

if [ -f .env ] && grep -Eq '^ELEVENLABS_API_KEY=.+' .env && ! grep -q 'dein_key_hier' .env; then
  ok "ElevenLabs" "Key in .env gesetzt"
else no "ElevenLabs" "Key fehlt → in .env eintragen (Vorlage: .env.example)"; fi

n=$(ls assets/audio/music/*.mp3 2>/dev/null | wc -l | tr -d ' ')
[ "$n" -gt 0 ] && ok "Musik" "$n Track(s) in assets/audio/music/" || no "Musik" "keine Tracks → pixabay.com/music"

echo; echo "── hyperframes doctor ──"
npx -y hyperframes doctor 2>&1 | grep -E '✓|✗|◇'
echo
[ $FAIL -eq 0 ] && echo "Alles bereit." || echo "Bitte die ❌-Punkte beheben und erneut ausführen."
