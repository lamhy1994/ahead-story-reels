#!/bin/bash
# One-time setup in a fresh workspace (idempotent). Usage: ./setup.sh
# The voice (Kokoro) needs Python <= 3.12, so it lives in its own venv at ~/.venvs/tts (made with uv).
# Use it through ./tts.sh (voice + timing) and `~/.venvs/tts/bin/python hearcheck.py <wav>` (hearing check).
set -e; cd "$(dirname "$0")"
V=$HOME/.venvs/tts
if ! "$V/bin/python" -c "import kokoro, misaki, phonemizer, espeakng_loader, soundfile, scipy, faster_whisper, num2words, en_core_web_sm" 2>/dev/null; then
  PY=$(command -v python3.12 || command -v python3.11 || true); [ -n "$PY" ] || { echo "need python3.12 or python3.11 for kokoro"; exit 1; }
  export PATH="$HOME/.local/bin:$PATH"; command -v uv >/dev/null || pip install --break-system-packages -q uv
  uv venv -q --seed --python "$PY" "$V"
  uv pip install -q --python "$V/bin/python" torch --index-url https://download.pytorch.org/whl/cpu
  uv pip install -q --python "$V/bin/python" "kokoro==0.9.4" "misaki[en]==0.9.4" espeakng-loader phonemizer-fork soundfile scipy "faster-whisper==1.2.1" num2words
  uv pip install -q --python "$V/bin/python" https://github.com/explosion/spacy-models/releases/download/en_core_web_sm-3.8.0/en_core_web_sm-3.8.0-py3-none-any.whl
fi
python3 -c "import soundfile, scipy, matplotlib, PIL" 2>/dev/null || pip install --break-system-packages -q soundfile scipy matplotlib pillow
[ -d template/web/node_modules/three ] || (cd template/web && npm install --no-audit --no-fund three@0.170.0 >/dev/null)
[ -f /opt/npm-tools/node_modules/playwright/index.mjs ] || { echo "Playwright not found at /opt/npm-tools: run  npm i -g playwright && npx playwright install chromium  and change the import path in render.mjs / cues.mjs"; exit 1; }
[ -x /usr/bin/google-chrome ] || echo "WARNING: /usr/bin/google-chrome missing; set executablePath in render.mjs to Playwright's chromium"
command -v ffmpeg >/dev/null || { echo "ffmpeg missing"; exit 1; }
echo "setup OK"
