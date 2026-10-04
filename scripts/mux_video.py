#!/usr/bin/env python3
"""
Mux Video with Voiceover and Background Music Ducking using ffmpeg.
Mixes voiceover with background music (ducked by -20dB) and multiplexes with video.
"""
import os
import sys
import subprocess
import argparse

def mux_video(video_path, voice_path, output_path, music_path=None, ducking_db=-20):
    if not os.path.exists(video_path):
        print(f"[-] Video file not found: {video_path}")
        sys.exit(1)
    if not os.path.exists(voice_path):
        print(f"[-] Voice audio not found: {voice_path}")
        sys.exit(1)

    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
    print(f"[*] Muxing video: {video_path}")
    print(f"[*] Voice track: {voice_path}")

    if music_path and os.path.exists(music_path):
        print(f"[*] Mixing background music: {music_path} with ducking ({ducking_db} dB)...")
        # Filter complex: Voice is main, Music is ducked under voice using sidechaincompress
        filter_complex = (
            f"[1:a]asplit=2[vo_main][vo_side];"
            f"[2:a]volume=0.25[bg_music];"
            f"[bg_music][vo_side]sidechaincompress=threshold=0.08:ratio=6:attack=20:release=300[ducked_bg];"
            f"[vo_main][ducked_bg]amix=inputs=2:duration=first:dropout_transition=2[aout]"
        )
        cmd = [
            "ffmpeg", "-y",
            "-i", video_path,
            "-i", voice_path,
            "-i", music_path,
            "-filter_complex", filter_complex,
            "-map", "0:v",
            "-map", "[aout]",
            "-c:v", "libx264",
            "-crf", "23",
            "-preset", "medium",
            "-c:a", "aac",
            "-b:a", "192k",
            "-movflags", "+faststart",
            output_path
        ]
    else:
        print("[*] No background music track provided. Muxing video + voice directly.")
        cmd = [
            "ffmpeg", "-y",
            "-i", video_path,
            "-i", voice_path,
            "-map", "0:v",
            "-map", "1:a",
            "-c:v", "copy",
            "-c:a", "aac",
            "-b:a", "192k",
            "-movflags", "+faststart",
            output_path
        ]

    result = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    if result.returncode != 0:
        print(f"[-] ffmpeg mux error: {result.stderr.decode('utf-8')}")
        sys.exit(1)

    print(f"[+] Final video successfully generated: {output_path}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Mux video, voice, and background music with ducking")
    parser.add_argument("--video", required=True, help="Input video MP4")
    parser.add_argument("--voice", required=True, help="Voiceover MP3/WAV")
    parser.add_argument("--output", required=True, help="Output MP4")
    parser.add_argument("--music", help="Background music audio file")
    parser.add_argument("--ducking-db", type=int, default=-20, help="Music ducking level (default: -20)")
    args = parser.parse_args()

    mux_video(args.video, args.voice, args.output, args.music, args.ducking_db)
