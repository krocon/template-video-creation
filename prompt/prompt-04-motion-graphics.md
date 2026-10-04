# Prompt 04: Motion Graphics & GSAP Choreografie (HyperFrames)

## Zweck
Führe diesen Prompt mit Claude aus, um die visuellen Szenen, UI-Komponenten und die GSAP-Timeline beat-synchron zu den Whisper-Zeitstempeln zu programmieren.

---

## Auszuführender Prompt für Claude

```text
Du bist mein Senior Motion Graphics Developer und HyperFrames-Spezialist.
Programmiere die visuellen Komponenten und die GSAP-Animation für das 1-Minute-Lernvideo.

Voraussetzungen:
- Zeitstempel liegen vor in: assets/audio/timestamps_[lang].json
- Thema & Texte sind definiert in: video.config.json

Führe folgende Programmier-Schritte durch:

1. KOMPONENTEN & SZENEN ANPASSEN:
   - Passe die HTML/CSS/JS-Komponenten in 'src/components/' an das Thema an:
     * Header-Tag & Fortschrittsbalken ('header-badge.js')
     * Mockup-Fenster / Demo-Screen ('mock-mail.js' oder themenspezifisches UI-Mockup)
     * 5 Kernpunkte-Karten ('checklist-card.js')
     * Handlungs-Banner ('action-banner.js')
     * Outro-Punchline ('outro-cta.js')

2. BEAT-SYNC IN DER GSAP-TIMELINE ('src/timeline.js'):
   - Binde die Animationen framegenau an die Cues aus der Zeitstempel-Datei:
     * Hook (0.0s): Reiz-Element erscheint, Audio-Signal optisch verstärken.
     * Problem (ab ca. 5.3s): Problem-Visualisierung, Warn-Highlighting.
     * Kernpunkte 1 bis 5 (ab 15.0s): Jeder Punkt erscheint GENAU in der Millisekunde, in der die Stimme das Schlagwort ausspricht!
     * Handlung (ab ca. 45.0s): 3 Aktions-Elemente sliden nacheinander herein.
     * Outro (ab ca. 55.0s): Schlagkräftige Punchline skaliert mit elastischem Easing.

3. HYPERFRAMES-KONTRAKT STRENG EINHALTEN:
   - Initialzustände VOR der Timeline mit 'gsap.set()' definieren (niemals tl.set bei t=0).
   - Genau EINE pausierte Timeline auf 'window.__timelines["one-minute-lesson"]'.
   - Keine CSS transitions ('transition: all ...' ist verboten, alles muss über GSAP gesteuert werden).
   - Keine Endlos-Loops ('repeat: -1'), kein undeterministischer Zufall.

4. AUTOMATISCHER LINT & PRÜFUNG:
   - Führe nach der Anpassung sofort den HyperFrames-Linter aus:
     npx -y hyperframes lint
   - Behebe eventuelle Fehler, bis das Ergebnis lautet:
     "0 errors, 0 warnings"

Zeige mir nach erfolgreichem Lint die finalen Cues der Timeline.
```
