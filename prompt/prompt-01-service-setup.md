# Prompt 01: Service-Setup & API-Konfiguration

## Zweck
Führe diesen Prompt mit Claude Code (oder Antigravity) aus, um alle benötigten Services, API-Keys und lokalen System-Abhängigkeiten einzurichten und zu verifizieren.

---

## Auszuführender Prompt für Claude

```text
Du bist mein Produktions-Assistent für KI-gestützte 1-Minute-Lernvideos.
Bitte führe mich Schritt für Schritt durch das Setup aller benötigten Services und Tools für dieses Projekt oder richte sie direkt ein.

Überprüfe und erledige folgende Punkte nacheinander:

1. SYSTEM-DIAGNOSE:
   - Prüfe im Terminal, ob folgende Tools vorhanden sind:
     * Node.js (Version >= 18)
     * npm
     * ffmpeg (Pflicht für atempo-Beschleunigung und Video-Muxing)
     * python3 (inkl. pip)
     * hyperframes (per 'npx -y hyperframes doctor')
   - Gib mir eine kompakte Statusübersicht (✅ vorhanden / ❌ fehlt) und erkläre kurz, wie fehlende Tools installiert werden.

2. SERVICE-ACCOUNTS & API-SCHLÜSSEL:
   Gehe mit mir die folgenden Services durch:
   
   A) ElevenLabs (für ultra-realistische Voiceovers):
      - URL: https://elevenlabs.io
      - Benötigt: Kostenloser oder Starter-Account, API-Key unter Profile -> API Keys.
      - Stimmen-Empfehlung:
        * Deutsch: "Alex" (21m00Tcm4TlvDq8ikWAM) oder "Ines" (023ebf5e-1970-40d8-825c-a5ef6a1dd4ff)
        * Englisch: "Adam" (pNInz6obpgDQGcFmaJgB)
      - Speichere den Key in einer lokalen '.env'-Datei: ELEVENLABS_API_KEY=dein_key_hier

   B) HyperFrames (Open-Source Video-Engine von HeyGen):
      - Open-Source & lokal kostenfrei!
      - Teste die Funktionsfähigkeit im Projekt per:
        npx -y hyperframes doctor

   C) Whisper (für framegenaue Audio-Zeitstempel / Beat-Sync):
      - Lokale Installation: pip install openai-whisper
      - Teste, ob Whisper via Python importierbar ist.

   D) Pixabay Audio (für lizenzfreie Hintergrundmusik und SFX):
      - URL: https://pixabay.com/music / https://pixabay.com/sound-effects
      - Lege empfohlene Ambient-Tracks unter assets/audio/music/ ab.

   E) Optional: Higgsfield / Seedance 2.5 (nur bei Bedarf an cineastischen Diffusions-Filmen):
      - Falls emotionale Realfilm-Szenen gewünscht sind (gemäß /docs/SKILL-schulung.md).

3. SMOKE-TEST:
   - Führe einen kurzen End-to-End-Test der Audio-Pipeline durch:
     python3 scripts/tts_generator.py --text-file assets/scripts_text/phishing_de.txt --output assets/audio/test_vo.mp3 --lang de
     python3 scripts/audio_accelerator.py --input assets/audio/test_vo.mp3 --output assets/audio/test_vo_fast.mp3 --speed 1.15
   - Melde mir den Vollzug, sobald alle Prüfungen bestanden sind.
```
