#!/bin/bash
# One-time setup in a fresh workspace (idempotent). Usage: ./setup.sh
set -e; cd "$(dirname "$0")"
python3 - <<'PY' || pip install --break-system-packages -q "kokoro==0.7.16" "misaki[en]==0.7.4" phonemizer-fork espeakng-loader soundfile scipy "faster-whisper==1.2.1" matplotlib pillow
import kokoro, misaki, phonemizer, espeakng_loader, soundfile, scipy, faster_whisper, matplotlib, PIL
PY
[ -d template/web/node_modules/three ] || (cd template/web && npm init -y >/dev/null && npm install --no-audit --no-fund three@0.170.0 >/dev/null)
[ -f /opt/npm-tools/node_modules/playwright/index.mjs ] || { echo "Playwright not found at /opt/npm-tools: run  npm i -g playwright && npx playwright install chromium  and change the import path in render.mjs / cues.mjs"; exit 1; }
[ -x /usr/bin/google-chrome ] || echo "WARNING: /usr/bin/google-chrome missing; set executablePath in render.mjs to Playwright's chromium"
command -v ffmpeg >/dev/null || { echo "ffmpeg missing"; exit 1; }
echo "setup OK"
