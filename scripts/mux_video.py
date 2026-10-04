#!/usr/bin/env python3
"""
Muxer: Video (stumm, aus HyperFrames) + Voiceover + optional Hintergrundmusik mit Ducking.

- Voiceover wird auf -16 LUFS / -1.5 dBTP normalisiert (Social/E-Learning-Standard).
- Musik: auf Videolänge geloopt, Grundpegel ~14 dB unter der Stimme (Sprechpausen),
  per Sidechain-Kompressor beim Sprechen weiter abgesenkt → ca. -20 dB unter der Stimme.
- Video wird einmal sauber als H.264 (CRF 20, yuv420p, faststart) encodiert → ~8–25 MB pro Minute.
- Ausgabelänge = Videolänge (Nachlauf bleibt erhalten, Stimme wird mit Stille aufgefüllt).
"""
import argparse, json, os, re, subprocess, sys


def probe_duration(path):
    out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "json", path],
                         capture_output=True, text=True, check=True).stdout
    return float(json.loads(out)["format"]["duration"])


def mean_volume(path):
    log = subprocess.run(["ffmpeg", "-hide_banner", "-i", path, "-af", "volumedetect", "-f", "null", "-"],
                         capture_output=True, text=True).stderr
    m = re.search(r"mean_volume: (-?[\d.]+) dB", log)
    return float(m.group(1)) if m else -30.0


def mux_video(video_path, voice_path, output_path, music_path=None, ducking_db=-20, crf=20):
    for p, label in ((video_path, "Video"), (voice_path, "Voiceover")):
        if not os.path.exists(p):
            sys.exit(f"[-] {label} nicht gefunden: {p}")
    os.makedirs(os.path.dirname(os.path.abspath(output_path)) or ".", exist_ok=True)

    dur = probe_duration(video_path)
    voice_chain = ("[1:a]loudnorm=I=-16:TP=-1.5:LRA=11,aresample=48000,"
                   "aformat=sample_fmts=fltp:channel_layouts=stereo,apad")
    inputs = ["-i", video_path, "-i", voice_path]

    if music_path and os.path.exists(music_path):
        voice_rms = -19.0                      # ≈ RMS einer auf -16 LUFS normalisierten Sprachspur
        # Kompressor (Ratio 4, Threshold -34 dBFS) senkt beim Sprechen um ~11 dB ab (gemessen).
        # Grundpegel so wählen, dass die Musik beim Sprechen bei `ducking_db` unter der Stimme landet
        # und in Pausen dezent ~11 dB höher liegt.
        pause_gap = abs(ducking_db) - 11.0
        gain = (voice_rms - pause_gap) - mean_volume(music_path)
        print(f"[*] Musik: {music_path} | Grundpegel-Korrektur {gain:+.1f} dB | Ducking Ziel {ducking_db} dB")
        inputs += ["-stream_loop", "-1", "-i", music_path]
        fc = (
            f"{voice_chain}[vo];[vo]asplit=2[vo_main][vo_side];"
            f"[2:a]aresample=48000,aformat=sample_fmts=fltp:channel_layouts=stereo,volume={gain:.2f}dB,"
            f"afade=t=in:d=1,afade=t=out:st={max(0, dur - 1.5):.2f}:d=1.5[bg];"
            f"[bg][vo_side]sidechaincompress=threshold=0.02:ratio=4:attack=15:release=400[duck];"
            f"[vo_main][duck]amix=inputs=2:duration=first:normalize=0,alimiter=limit=0.89[aout]"
        )
    else:
        print("[*] Ohne Hintergrundmusik – nur Voiceover.")
        fc = f"{voice_chain}[aout]"

    cmd = ["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", *inputs,
           "-filter_complex", fc, "-map", "0:v:0", "-map", "[aout]", "-t", f"{dur:.3f}",
           "-c:v", "libx264", "-preset", "slow", "-crf", str(crf), "-pix_fmt", "yuv420p", "-profile:v", "high",
           "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", output_path]
    print(f"[*] Mux: {video_path} + {voice_path} → {output_path} ({dur:.2f} s)")
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        sys.exit(f"[-] ffmpeg-Fehler:\n{r.stderr}")
    size = os.path.getsize(output_path) / 1e6
    print(f"[+] Fertig: {output_path} ({size:.1f} MB)")


if __name__ == "__main__":
    ap = argparse.ArgumentParser(description="Video + Voiceover (+ Musik mit Ducking) muxen")
    ap.add_argument("--video", required=True)
    ap.add_argument("--voice", required=True)
    ap.add_argument("--output", required=True)
    ap.add_argument("--music", help="Hintergrundmusik (optional)")
    ap.add_argument("--ducking-db", type=int, default=-20, help="Musik unter der Stimme beim Sprechen (Standard -20)")
    ap.add_argument("--crf", type=int, default=20, help="H.264-Qualität (18 = sehr hoch, 23 = kleiner)")
    a = ap.parse_args()
    mux_video(a.video, a.voice, a.output, a.music, a.ducking_db, a.crf)
