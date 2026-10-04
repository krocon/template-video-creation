# Prompt 06: Batch-Erstellung (Deutsch & Englisch parallel)

## Zweck
Führe diesen Prompt mit Claude aus, um aus einer einzigen Themenvorgabe vollautomatisch sowohl die deutsche als auch die englische Video-Fassung zu erzeugen.

---

## Auszuführender Prompt für Claude

```text
Du bist mein Automation-Lead für mehrsprachige KI-Lernvideo-Kampagnen.
Erstelle für folgendes Thema parallel eine deutsche und eine englische Video-Version:

THEMA: [Thema eingeben, z.B. "Zwei-Faktor-Authentifizierung (2FA)"]
FORMAT: [Standard: 9x16 für Social Media oder 16x9 für LMS]

Führe die Pipeline in zwei Phasen durch:

PHASE 1: DREHBUCH & FREIGABE (0 Credits)
1. Erstelle das deutsche Skript in 'assets/scripts_text/[slug]_de.txt' (135–155 Wörter).
2. Erstelle das englische Skript in 'assets/scripts_text/[slug]_en.txt' (135–155 Wörter).
3. Zeige beide Skripte in einer übersichtlichen Gegenüberstellung.
4. STOPP: Warte auf meine Freigabe ("Go!").

PHASE 2: BATCH-PRODUKTION (nach Freigabe)
1. Führe für Deutsch aus:
   node scripts/build_all.js --lang de --format [format]
2. Führe für Englisch aus:
   node scripts/build_all.js --lang en --format [format]
3. Überprüfe die beiden resultierenden Videodateien in 'dist/':
   - dist/final_[slug]_de_[format].mp4
   - dist/final_[slug]_en_[format].mp4
4. Präsentiere mir die fertigen Video-Pfade mit Dateigrößen und Gesamtdauer.
```
