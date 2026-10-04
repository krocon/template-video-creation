# Prompt 03: Audio-Pipeline & Whisper-Transkription

## Zweck
Führe diesen Prompt mit Claude aus, um aus den freigegebenen Skripten fertiges, beschleunigtes Audio und word-level Zeitstempel (Beat-Sync) zu generieren.

---

## Auszuführender Prompt für Claude

```text
Du bist mein Toningenieur für KI-Lernvideos.
Führe die Audio-Produktion für die freigegebenen Skripte durch.

Eingabe-Dateien:
- assets/scripts_text/[skript]_de.txt
- assets/scripts_text/[skript]_en.txt

Ablauf für jede Zielsprache (DE und EN):

1. TTS-GENERIERUNG (ElevenLabs):
   - Führe das Skript aus:
     python3 scripts/tts_generator.py --text-file assets/scripts_text/[skript]_[lang].txt --output assets/audio/vo_[lang].mp3 --lang [lang]
   - Überprüfe die Qualität und die Dateigröße.

2. DIE TEMPO-PFLICHT (atempo=1.15):
   - TTS-Stimmen sprechen für modernes E-Learning zu langsam. Beschleunige tonhöhenneutral mit:
     python3 scripts/audio_accelerator.py --input assets/audio/vo_[lang].mp3 --output assets/audio/vo_[lang]_fast.mp3 --speed 1.15
   - Miss die Gesamtdauer mit:
     ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 assets/audio/vo_[lang]_fast.mp3
   - Liegt die Dauer zwischen 57 und 61 Sekunden? Wenn ja: perfekt. Wenn > 62s: Skript minimal kürzen.

3. WHISPER-TRANSKRIPTION (Beat-Sync Zeitstempel):
   - Transkribiere das BESCHLEUNIGTE Audio, um exakte Zeitstempel für die Cues zu erhalten:
     python3 scripts/whisper_transcribe.py --audio assets/audio/vo_[lang]_fast.mp3 --output assets/audio/timestamps_[lang].json --lang [lang]
   - Lies 'assets/audio/timestamps_[lang].json' ein und erstelle eine Cue-Point-Tabelle für die 5 Kernpunkte aus Szene 3.

4. HINTERGRUNDMUSIK-BEREITSTELLUNG:
   - Prüfe, ob 'assets/audio/music/ambient_beat.mp3' existiert.
   - Falls nicht, generiere einen dezenten Ambient-Loop oder fordere mich auf, einen Pixabay-Track abzulegen.

Gib mir nach Abschluss eine Zusammenfassung der Dauern und der wichtigsten Cue-Zeitstempel.
```
