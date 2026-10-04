#!/usr/bin/env python3
"""
Audio Accelerator for 1-Minute Educational Videos.
Enforces the mandatory rule: TTS voices must be accelerated by 1.15x (pitch-neutral)
using ffmpeg atempo filter to match modern learner attention spans.
"""
import os
import sys
import subprocess
import argparse

def accelerate_audio(input_file, output_file, speed=1.15):
    if not os.path.exists(input_file):
        print(f"[-] Input file does not exist: {input_file}")
        sys.exit(1)

    os.makedirs(os.path.dirname(os.path.abspath(output_file)), exist_ok=True)
    print(f"[*] Accelerating audio by {speed}x (pitch-neutral atempo)...")

    # Command: ffmpeg -y -i input -filter:a "atempo=1.15" -b:a 128k output
    cmd = [
        "ffmpeg",
        "-y",
        "-i", input_file,
        "-filter:a", f"atempo={speed}",
        "-c:a", "libmp3lame" if output_file.endswith(".mp3") else "aac",
        "-b:a", "128k",
        output_file
    ]

    result = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    if result.returncode != 0:
        print(f"[-] ffmpeg error: {result.stderr.decode('utf-8')}")
        sys.exit(1)

    print(f"[+] Accelerated audio created: {output_file}")
    return output_file

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Accelerate audio using ffmpeg atempo")
    parser.add_argument("--input", required=True, help="Input audio file")
    parser.add_argument("--output", required=True, help="Output audio file")
    parser.add_argument("--speed", type=float, default=1.15, help="Speed factor (default: 1.15)")
    args = parser.parse_args()

    accelerate_audio(args.input, args.output, args.speed)
