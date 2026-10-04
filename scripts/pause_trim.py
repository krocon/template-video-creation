#!/usr/bin/env python3
"""
Kürzt lange Sprechpausen im Voiceover auf eine Maximallänge (ohne Wörter anzufassen).
Läuft NACH atempo=1.15 und VOR Whisper, damit die Zeitstempel zum finalen Audio passen.
Aufruf: python3 scripts/pause_trim.py --input vo_fast.mp3 --output vo_fast.mp3 --max-pause 0.4
"""
import argparse, os, re, subprocess, tempfile, shutil


def duration(path):
    out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                          "-of", "csv=p=0", path], capture_output=True, text=True, check=True)
    return float(out.stdout.strip())


def silences(path, threshold_db, min_len):
    log = subprocess.run(["ffmpeg", "-hide_banner", "-i", path, "-af",
                          f"silencedetect=n={threshold_db}dB:d={min_len}", "-f", "null", "-"],
                         capture_output=True, text=True).stderr
    starts = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", log)]
    ends = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", log)]
    if len(ends) < len(starts):
        ends.append(duration(path))
    return list(zip(starts, ends))


def trim(inp, outp, max_pause, threshold_db=-35):
    before = duration(inp)
    cuts = [(s + max_pause / 2, e - max_pause / 2)
            for s, e in silences(inp, threshold_db, max_pause) if e - s > max_pause]
    if not cuts:
        if os.path.abspath(inp) != os.path.abspath(outp):
            shutil.copyfile(inp, outp)
        print(f"[*] Keine Pausen > {max_pause}s – unverändert ({before:.1f}s)")
        return
    expr = "+".join(f"between(t,{a:.3f},{b:.3f})" for a, b in cuts)
    fd, tmp = tempfile.mkstemp(suffix=os.path.splitext(outp)[1] or ".mp3")
    os.close(fd)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", inp, "-af",
                    f"aselect='not({expr})',asetpts=N/SR/TB", "-b:a", "128k", tmp], check=True)
    shutil.move(tmp, outp)
    print(f"[+] {len(cuts)} Pausen auf {max_pause}s gekürzt: {before:.1f}s → {duration(outp):.1f}s")


if __name__ == "__main__":
    p = argparse.ArgumentParser(description="Lange Sprechpausen kürzen")
    p.add_argument("--input", required=True)
    p.add_argument("--output", required=True)
    p.add_argument("--max-pause", type=float, default=0.45, help="Maximale Pausenlänge in s")
    p.add_argument("--threshold", type=float, default=-35, help="Stille-Schwelle in dB")
    a = p.parse_args()
    trim(a.input, a.output, a.max_pause, a.threshold)
