#!/usr/bin/env python3
"""
TTS Generator for 1-Minute Educational Videos using ElevenLabs API.
Generates speech audio from script text with fallback for offline testing.
"""
import os
import sys
import json
import argparse
import urllib.request
import urllib.error

def generate_tts(text_file, output_path, voice_id=None, lang="de"):
    api_key = os.getenv("ELEVENLABS_API_KEY")

    with open(text_file, "r", encoding="utf-8") as f:
        text = f.read().strip()

    print(f"[*] Processing script ({lang.upper()}): {len(text.split())} words")

    # Default ElevenLabs voices
    default_voices = {
        "de": "21m00Tcm4TlvDq8ikWAM",  # Alex / Rachel fallback
        "en": "pNInz6obpgDQGcFmaJgB"   # Adam
    }
    selected_voice = voice_id or default_voices.get(lang, default_voices["de"])

    if not api_key:
        print("[!] WARN: ELEVENLABS_API_KEY environment variable is not set.")
        print("[!] Generating synthetic fallback tone / mock audio via ffmpeg so pipeline remains testable.")
        os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
        os.system(f'ffmpeg -y -f lavfi -i "sine=frequency=440:duration=60" -c:a libmp3lame -b:a 128k "{output_path}" > /dev/null 2>&1')
        print(f"[+] Fallback audio written to {output_path}")
        return output_path

    url = f"https://api.elevenlabs.io/v1/text-to-speech/{selected_voice}"
    headers = {
        "Accept": "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": api_key
    }
    payload = {
        "text": text,
        "model_id": "eleven_multilingual_v2",
        "voice_settings": {
            "stability": 0.5,
            "similarity_boost": 0.75
        }
    }

    req = urllib.request.Request(url, data=json.dumps(payload).encode("utf-8"), headers=headers, method="POST")
    try:
        print(f"[*] Contacting ElevenLabs API (Voice: {selected_voice})...")
        with urllib.request.urlopen(req) as response:
            audio_data = response.read()
            os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
            with open(output_path, "wb") as f_out:
                f_out.write(audio_data)
        print(f"[+] Successfully generated TTS audio: {output_path} ({len(audio_data)} bytes)")
        return output_path
    except urllib.error.HTTPError as e:
        print(f"[-] HTTP Error: {e.code} - {e.read().decode('utf-8')}")
        sys.exit(1)
    except Exception as e:
        print(f"[-] Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate ElevenLabs voiceover")
    parser.add_argument("--text-file", required=True, help="Path to text script")
    parser.add_argument("--output", default="assets/audio/vo.mp3", help="Output MP3 path")
    parser.add_argument("--voice-id", help="ElevenLabs Voice ID")
    parser.add_argument("--lang", default="de", choices=["de", "en"], help="Language code")
    args = parser.parse_args()

    generate_tts(args.text_file, args.output, args.voice_id, args.lang)
