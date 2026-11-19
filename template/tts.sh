#!/bin/bash
# Voice + word timing from script.py: ./tts.sh [voice] [speed]  -> audio/vo_final.wav, audio/timing.json, web/timing.js, hearing check.
# Then always run ./vo_proc.sh. (Kokoro runs in ~/.venvs/tts, made by ../../setup.sh.)
cd "$(dirname "$0")"; exec "$HOME/.venvs/tts/bin/python" tts_build.py "${1:-bm_george}" "${2:-0.94}"
