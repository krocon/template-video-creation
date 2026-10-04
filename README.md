# 🎬 1-Minute-Lernvideos Template-Projekt (DE & EN)

> **Professionelle, KI-unterstützte 1-Minute-Lernvideos auf Deutsch und Englisch – vollautomatisiert, deterministisch und beat-synchron durch Code-First Motion Graphics.**

Dieses Projekt ist eine schlüsselfertige Vorlage zur schnellen Erzeugung von 60-Sekunden-Erklärvideos und Lern-Shorts für Social Media (**9:16**: YouTube Shorts, Instagram Reels, TikTok, LinkedIn) sowie E-Learning Plattformen (**16:9**: LMS, Unternehmensschulungen, YouTube).

---

## 📌 1. Leitidee & Erkenntnisse aus dem Referenz-Video

Das Konzept basiert auf der Analyse des Leitfadens von **Julian Ivanov** (*„Claude Code ist unglaublich gut in Motion Graphics! (Opus 5.5)“*):

### 💡 Warum Code-First Motion Graphics statt reiner KI-Videomodelle?
Klassische Diffusionsmodelle (wie Sora, Runway oder Kling) erzeugen oft unleserliche Texte, halluzinierte Artefakte, verwaschene Markenlogos und kosten pro Generierung erhebliche Credits. 

In diesem Workflow baut die KI eine **HTML5-, CSS- und GSAP-Webkomposition**:
1. **Gestochen scharfe Vektoren & Typografie**: Text, Icons, Fenster und Farbflächen werden nativ im Browser gerendert – unabhängig von Sprache und Auflösung gestochen scharf.
2. **100 % deterministisch & editierbar**: Jedes Element, jedes Timing, jede Schriftgröße und Markenfarbe ist regulärer Code im Git-Repository. Eine Farbänderung oder Textkorrektur kostet **0 Credits**.
3. **Beat-Sync per Whisper-Zeitstempeln**: Visuelle Elemente ploppen exakt auf die Millisekunde genau auf, in der das entsprechende Wort im Voiceover gesprochen wird.
4. **Visuelle Qualitätskontrolle**: Der Agent kann per `hyperframes snapshot` Schlüssel-Frames rendern und vor dem finalen Export automatisiert auf Kontrast, Überlappungen und Zeilenumbrüche prüfen.
5. **Authentisches Sound-Design**: Hochwertige ElevenLabs-Sprachmodelle kombiniert mit echten Soundeffekten und automatischer Lautstärkeabsenkung (Audio-Ducking) der Hintergrundmusik per ffmpeg.

---

## 📚 2. Kernregeln aus den Projekt-Dokumenten (`/docs/`)

Aus [SKILL-schulung.md](file:///Users/marckronberg/WebstormProjects/template-video-creation/docs/SKILL-schulung.md) und [seedance-2-5-prompts.html](file:///Users/marckronberg/WebstormProjects/template-video-creation/docs/seedance-2-5-prompts.html) stammen die folgenden unverrückbaren Architekturregeln:

### 2.1 Der 2-Phasen-Workflow & das ⛔ Freigabe-Gate
| Phase | Inhalt | Kosten |
|---|---|---|
| **Phase 1: Curriculum & Skript** | Thema recherchieren, 5-Szenen-Spannungsbogen definieren, Wortzahl prüfen (135–155 Wörter). | **0 Credits** |
| **⛔ FREIGABE-GATE** | **Explizites „Go“ des Users abwarten!** Vor der Freigabe wird kein API-Call und kein Rendering gestartet. | |
| **Phase 2: Produktion** | ElevenLabs TTS -> ffmpeg Beschleunigung -> Whisper Beat-Sync -> Motion Graphics -> Muxing. | Rechenzeit / API |

### 2.2 Die Tempo-Pflicht (`atempo=1.15`)
Standard-TTS-Stimmen (ElevenLabs, OpenAI) sprechen für moderne mobile Lernformate zu langsam (~130 WPM). 
- **Zwingende Regel**: Jedes Voiceover wird mit `ffmpeg -filter:a "atempo=1.15"` tonhöhenneutral beschleunigt.
- Richtwert: **ca. 2,4 Wörter pro Sekunde** (für 60 Sekunden Video = 135–155 Wörter).

### 2.3 Zweisprachigkeit: Deutsch vs. Englisch
- **Deutsch**: Deutsche Komposita (*„Sicherheitsüberprüfung“*, *„Zwei-Faktor-Authentifizierung“*) brauchen mehr Platz. CSS nutzt `hyphens: auto`, `text-wrap: pretty`, flexible Kartenbreiten und typografische Anführungszeichen (`„...“`).
- **Englisch**: Straffere Formulierungen, typografische Anführungszeichen (`“...”`).
- **KI-Prompts (für Vektoren/Bilder/Videos)**: Immer auf Englisch mit dem Negativ-Prompt: `"no readable text, no captions, no watermarks"`.

---

## ⏱️ 3. Die 60-Sekunden-Dramaturgie

Jedes Video folgt einer didaktisch erprobten 5-Szenen-Struktur:

```
[00:00 - 00:05]   SZENE 1: HOOK (Akustischer Reiz "Pling!", Neugier/Alarm)
       ↓
[00:05 - 00:15]   SZENE 2: PROBLEM (Gefahr visualisieren, "Genauso sieht Phishing aus!")
       ↓
[00:15 - 00:45]   SZENE 3: DIE 5 WARNZEICHEN (Beat-synchrone Checkliste: Absender, Anrede, Zeitdruck...)
       ↓
[00:45 - 00:55]   SZENE 4: HANDLUNGSEMPFEHLUNG (3 klare Schritte: Nicht klicken, nachfragen, melden)
       ↓
[00:55 - 01:00]   SZENE 5: MERKSATZ & OUTRO ("Kurz prüfen, nicht anbeißen! / Don't take the bait!")
```

---

## 🚀 4. Schnellstart & Installation

### Voraussetzungen
- **Node.js** (v18+) & **npm**
- **ffmpeg** (im System-Pfad, z. B. per `brew install ffmpeg`)
- **Python 3**
- *(Optional)* **ElevenLabs API-Key** für eigene Stimmen (ohne Key erzeugt das Projekt automatisch Test-Audiospuren).

### Installation
```bash
# 1. Repository klonen oder im Projektordner öffnen
cd template-video-creation

# 2. Abhängigkeiten installieren
npm install

# 3. System-Prüfung ausführen
npm run doctor
```

### Live-Vorschau im Browser
```bash
npm run dev
```
Öffnet die interaktive HyperFrames-Vorschau. Du kannst:
- Das Video mit **Play / Pause** abspielen und die GSAP-Timeline framegenau scrubben.
- Mit dem **DE / EN**-Button sofort zwischen der deutschen und englischen Version umschalten.
- Mit dem **9:16 / 16:9**-Button zwischen Hochkant (Shorts/Reels) und Breitbild (LMS/Desktop) wechseln.

---

## 🤖 5. Schritt-für-Schritt Prompts für Claude

Im Ordner [`prompt/`](file:///Users/marckronberg/WebstormProjects/template-video-creation/prompt/) findest du vorgefertigte Prompts, die Claude Code (oder Antigravity) autonom ausführen kann:

| Datei | Zweck |
|---|---|
| [prompt-01-service-setup.md](file:///Users/marckronberg/WebstormProjects/template-video-creation/prompt/prompt-01-service-setup.md) | **Setup & Diagnose**: Prüft Node, ffmpeg, Whisper und hilft beim Hinterlegen des ElevenLabs-Keys. |
| [prompt-02-curriculum-skript.md](file:///Users/marckronberg/WebstormProjects/template-video-creation/prompt/prompt-02-curriculum-skript.md) | **Skripterstellung**: Erzeugt für jedes beliebige Thema ein 60s-Skript (DE & EN) mit Wortzahl-Gate. |
| [prompt-03-audio-pipeline.md](file:///Users/marckronberg/WebstormProjects/template-video-creation/prompt/prompt-03-audio-pipeline.md) | **Audio-Produktion**: Generiert Voiceover, beschleunigt per `atempo=1.15` und extrahiert Whisper-Cues. |
| [prompt-04-motion-graphics.md](file:///Users/marckronberg/WebstormProjects/template-video-creation/prompt/prompt-04-motion-graphics.md) | **GSAP & HyperFrames**: Baut die visuellen Szenen passgenau auf die Whisper-Zeitstempel auf. |
| [prompt-05-review-und-export.md](file:///Users/marckronberg/WebstormProjects/template-video-creation/prompt/prompt-05-review-und-export.md) | **Finishing**: Erzeugt Frame-Snapshots, prüft WCAG-Kontraste und muxed mit Audio-Ducking. |
| [prompt-06-batch-de-en.md](file:///Users/marckronberg/WebstormProjects/template-video-creation/prompt/prompt-06-batch-de-en.md) | **Batch-Produktion**: Generiert aus einem Thema vollautomatisch sowohl die deutsche als auch die englische Version. |

---

## 🛠️ 6. Toolchain & CLI-Befehle

```bash
# Linter & WCAG-Kontrastprüfung ausführen (muss 0 errors, 0 warnings melden)
npm run check

# Snapshots von Schlüssel-Frames zur visuellen Begutachtung rendern
npm run snapshot

# Kompletten automatisierten Build durchführen (DE, 9:16)
node scripts/build_all.js --lang de --format 9x16

# Kompletten automatisierten Build durchführen (EN, 16:9)
node scripts/build_all.js --lang en --format 16x9
```

---

## 📂 7. Projektstruktur

```
template-video-creation/
├── AGENTS.md                  # Zentraler Leitfaden für KI-Agenten & Coding-Regeln
├── CLAUDE.md                  # Quick-Referenz für Claude Code Sessions
├── README.md                  # Dieses Handbuch
├── package.json               # Node-Abhängigkeiten & Build-Scripts
├── video.config.json          # Zentrale Konfiguration (Sprache, Stimmen, Farben, Formate)
│
├── index.html                 # HyperFrames Master-Komposition (Entrypoint)
├── src/
│   ├── timeline.js            # Master GSAP-Timeline & Zeitstempel-Steuerung
│   ├── styles/
│   │   ├── tokens.css         # CSS-Variablen, Farben, Dimensionen (9:16 & 16:9)
│   │   └── main.css           # Styling für Karten, Mockups, Typografie
│   └── components/
│       ├── header-badge.js    # Oberer Themen-Badge & Fortschrittsbalken
│       ├── mock-mail.js       # E-Mail-Fenster Mockup (Hook & Problem)
│       ├── checklist-card.js  # Die 5 Warnzeichen-Karten
│       ├── action-banner.js   # Verhaltensregeln-Banner
│       └── outro-cta.js       # Merksatz & Takeaway-Badge
│
├── assets/
│   ├── audio/
│   │   ├── timestamps_de.json # Sub-sekundengenaue Cue-Points (Deutsch)
│   │   ├── timestamps_en.json # Sub-sekundengenaue Cue-Points (Englisch)
│   │   ├── music/             # Hintergrundmusik mit Audio-Ducking
│   │   └── sfx/               # UI-Soundeffekte (Pling, Whoosh)
│   └── scripts_text/
│       ├── phishing_de.txt    # Fertiges deutsches 60s-Lernskript (~147 Wörter)
│       └── phishing_en.txt    # Fertiges englisches 60s-Lernskript (~148 Wörter)
│
├── scripts/
│   ├── tts_generator.py       # ElevenLabs API-Anbindung (mit Test-Fallback)
│   ├── audio_accelerator.py   # ffmpeg atempo=1.15 Tempo-Beschleuniger
│   ├── whisper_transcribe.py  # Extrahiert Wort- und Segment-Zeitstempel
│   ├── render_pipeline.js     # HyperFrames Video-Renderer
│   ├── mux_video.py           # ffmpeg Muxer mit automatischem Musik-Ducking (-20 dB)
│   └── build_all.js           # Vollautomatisierte End-to-End Build-Pipeline
│
├── prompt/                    # Ausführbare Prompts für Claude Code
└── dist/                      # Finale gerenderte MP4-Videodateien
```

---

## 🎚️ 8. Audio-Ducking (ffmpeg Sidechain-Kompressor)

Wenn Sprecher und Musik gleichzeitig laufen, darf die Musik das Gesprochene nicht übertönen. In `scripts/mux_video.py` ist dafür ein professioneller **ffmpeg Sidechain-Kompressor** integriert:

```text
[1:a] (Voiceover) ──────┬───────────────────────────→ [Main Audio]
                        ↓ (Sidechain Signal)
[2:a] (Musik) ────→ [SidechainCompress: -20 dB] ───→ [Ducked Musik]
                                                            ↓
                                                      [amix] → [Finale Tonspur]
```
Sobald der Sprecher ansetzt, wird die Hintergrundmusik weich um **20 dB** abgesenkt. In Sprechpausen hebt sich die Musik dezent an.

---

## ⚖️ Lizenz
MIT License. Frei verwendbar für kommerzielle und private Lernvideos, Social Media Clips und Schulungen.
