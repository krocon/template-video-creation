# Prompt 05: Visueller Review, Muxing & Export (9:16 und 16:9)

## Zweck
Führe diesen Prompt mit Claude aus, um gerenderte Frames visuell zu verifizieren, Ton & Bild mit Audio-Ducking zusammenzusetzen und beide Videoformate (Shorts & E-Learning) zu exportieren.

---

## Auszuführender Prompt für Claude

```text
Du bist mein Video-Produzent und Finishing-Experte.
Führe den visuellen Review, das finale Rendering und den Export der Videos durch.

Schritte:

1. VISUELLE QUALITÄTSKONTROLLE (Snapshots & Inspection):
   - Erzeuge Screenshots der Schlüssel-Momente der Komposition:
     npx -y hyperframes snapshot --frames 5
   - Die Frames liegen in 'snapshots/' (z.B. bei 0s, 15s, 30s, 45s, 58s).
   - Prüfe die Snapshots (oder beschreibe sie):
     * Gibt es abgeschnittene Texte oder unschöne Zeilenumbrüche?
     * Ist der Farbkontrast nach WCAG hoch genug?
     * Sind alle Karten und Icons gut lesbar?
   - Falls Korrekturbedarf besteht: Passe CSS oder Typografie an und wiederhole den Snapshot.

2. VIDEO RENDERN (HyperFrames Engine):
   - Rendere die Video-Spur für das gewünschte Format (Standard: 9:16 Vertikal):
     node scripts/render_pipeline.js --format 9x16 --lang [lang] --output dist/raw_[lang]_9x16.mp4
   - Optional auch für 16:9 Horizontal (LMS / E-Learning):
     node scripts/render_pipeline.js --format 16x9 --lang [lang] --output dist/raw_[lang]_16x9.mp4

3. AUDIO-DUCKING & MUXING (ffmpeg):
   - Mische das beschleunigte Voiceover mit der Hintergrundmusik:
     Die Hintergrundmusik muss um ca. -20 dB geduckt werden, sobald die Stimme spricht.
   - Führe den Muxer aus:
     python3 scripts/mux_video.py \
       --video dist/raw_[lang]_9x16.mp4 \
       --voice assets/audio/vo_[lang]_fast.mp3 \
       --music assets/audio/music/vadim_makes_sound-tech-explainer-background-loop-551261.mp3 \
       --output dist/final_[thema]_[lang]_9x16.mp4

4. FINALE PRÜFUNG & BEREITSTELLUNG:
   - Prüfe die finale MP4-Datei:
     * Videodauer (sollte ca. 59-60s sein)
     * Bild- und Ton-Synchronität
     * Dateigröße (Ideal: 8 bis 25 MB für 60s 1080p)
   - Gib mir den absoluten Pfad zur fertigen Datei in 'dist/' an.
```
