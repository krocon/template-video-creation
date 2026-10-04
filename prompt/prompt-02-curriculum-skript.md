# Prompt 02: Curriculum & Skript-Generator (60s Lernvideo)

## Zweck
Führe diesen Prompt mit Claude aus, um für ein beliebiges Thema ein sendefähiges 60-Sekunden-Lernvideo-Skript auf Deutsch und Englisch zu erstellen.

---

## Auszuführender Prompt für Claude

```text
Du bist mein Chef-Drehbuchautor für didaktische 1-Minute-Lernvideos.
Erstelle für folgendes Thema ein 60-Sekunden-Skript auf Deutsch und Englisch:

THEMA: [Hier Thema einfügen, z. B.: "Sichere Passwörter & 2FA" oder "DSGVO im Homeoffice"]
ZIELGRUPPE: [z. B. Neue Mitarbeitende, Schüler, Kunden, B2B-Fachkräfte]
TONALITÄT: [z. B. Modern, prägnant, aufrüttelnd, professionell]

Beachte dabei strikt folgende Regeln aus AGENTS.md:

1. DIE 60-SEKUNDEN-DRAMATURGIE (5 SZENEN):
   - Szene 1: Hook (00:00 - 00:05) -> Überraschende Frage, akustischer Reiz ("Pling!"), akute Gefahr oder Neugier.
   - Szene 2: Problem & Kontext (00:05 - 00:15) -> Warum ist das relevant? Welche Konsequenzen drohen?
   - Szene 3: Die Kernpunkte (00:15 - 00:45) -> Exakt 3 bis 5 handlungsorientierte Warnzeichen oder Regeln. Jede Regel mit einer prägnanten Überschrift und einer kurzen Erklärung.
   - Szene 4: Handlung & Lösung (00:45 - 00:55) -> Sofort umsetzbare Verhaltensanweisung ("Was tust du jetzt?").
   - Szene 5: Merksatz & Outro (00:55 - 01:00) -> Einprägsamer Slogan / Punchline zum Mitnehmen.

2. WORTZAHL-GATE (2,4 Wörter pro Sekunde):
   - Gesamtlänge Ziel: 58 bis 60 Sekunden (nach atempo=1.15 Beschleunigung).
   - Erlaubte Wortzahl: 135 bis maximal 155 Wörter.
   - Zähle für jede Sprache die Wörter und zeige die Wortanzahl explizit an.

3. SPRACH-STANDARDS:
   - Deutsch: Typografische Anführungszeichen („...“), Achtung bei langen Komposita.
   - Englisch: Typografische Anführungszeichen (“...”), idiomatische Redewendungen.
   - Visuelle Prompts: Nur auf Englisch mit "no readable text, no captions".

4. AUSGABE-STRUKTUR:
   Speichere die fertigen Skripte in:
   - assets/scripts_text/[thema_slug]_de.txt
   - assets/scripts_text/[thema_slug]_en.txt
   
5. ⛔ FREIGABE-GATE:
   Präsentiere mir die beiden Skripte nebeneinander als Tabelle (Szene | Zeit | DE-Text | EN-Text | Visual Cue).
   Warte auf mein explizites "Go!", bevor du zur Audio- oder Video-Produktion übergehst!
```
