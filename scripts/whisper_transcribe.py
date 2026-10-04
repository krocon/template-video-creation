#!/usr/bin/env python3
"""
Whisper Transcriber for 1-Minute Educational Videos.
Extracts segment and word-level timestamps from accelerated audio files.
"""
import os
import sys
import json
import argparse
import subprocess

def transcribe_audio(audio_path, output_json, lang=None):
    if not os.path.exists(audio_path):
        print(f"[-] Audio file not found: {audio_path}")
        sys.exit(1)

    print(f"[*] Checking for Whisper engine...")
    whisper_available = False
    try:
        import whisper
        whisper_available = True
        print("[+] openai-whisper python library detected.")
    except ImportError:
        pass

    if whisper_available:
        print("[*] Running Whisper model (base)...")
        model = whisper.load_model("base")
        options = {"word_timestamps": True}
        if lang:
            options["language"] = lang
        result = model.transcribe(audio_path, **options)

        segments = []
        for s in result.get("segments", []):
            seg_data = {
                "id": s.get("id"),
                "start": round(s.get("start", 0), 2),
                "end": round(s.get("end", 0), 2),
                "text": s.get("text", "").strip(),
                "words": [
                    {
                        "word": w.get("word", "").strip(),
                        "start": round(w.get("start", 0), 2),
                        "end": round(w.get("end", 0), 2)
                    }
                    for w in s.get("words", [])
                ]
            }
            segments.append(seg_data)

        output_data = {
            "audio_file": audio_path,
            "language": result.get("language", lang),
            "duration": round(segments[-1]["end"] if segments else 60.0, 2),
            "segments": segments
        }
    else:
        print("[!] openai-whisper python library not installed in current environment.")
        print("[*] Checking for whisper CLI tool...")
        which_whisper = subprocess.run(["which", "whisper"], stdout=subprocess.PIPE).stdout.decode().strip()
        if which_whisper:
            print(f"[+] Found whisper CLI at {which_whisper}. Running...")
            out_dir = os.path.dirname(os.path.abspath(output_json))
            cmd = ["whisper", audio_path, "--output_format", "json", "--output_dir", out_dir]
            if lang:
                cmd.extend(["--language", lang])
            subprocess.run(cmd, check=True)
            print(f"[+] Whisper CLI transcription completed in {out_dir}")
            return
        else:
            print("[!] Neither whisper library nor whisper CLI found.")
            print("[*] Using pre-computed cue points or template fallback.")
            if os.path.exists(output_json):
                print(f"[+] Existing timestamps file {output_json} preserved.")
                return
            output_data = {
                "audio_file": audio_path,
                "language": lang or "de",
                "duration": 60.0,
                "note": "Fallback timestamps. Run pip install openai-whisper to generate real timestamps."
            }

    os.makedirs(os.path.dirname(os.path.abspath(output_json)), exist_ok=True)
    with open(output_json, "w", encoding="utf-8") as f:
        json.dump(output_data, f, indent=2, ensure_ascii=False)

    print(f"[+] Timestamps written to: {output_json}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Transcribe audio to timestamps JSON using Whisper")
    parser.add_argument("--audio", required=True, help="Input audio file")
    parser.add_argument("--output", required=True, help="Output JSON path")
    parser.add_argument("--lang", choices=["de", "en"], help="Language hint")
    args = parser.parse_args()

    transcribe_audio(args.audio, args.output, args.lang)
