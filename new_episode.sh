#!/bin/bash
# Starts a new episode folder: template/ (the engine, and the story-format example) with the worked example of the current format on top.
# Usage: ./new_episode.sh 027-slug [format]    format: turn (the default since 28 Nov 2026, read from hooklab/library.json "format") or v3 (the story format: template/ as it is)
set -e; cd "$(dirname "$0")"; D=episodes/$1
[ -e "$D" ] && { echo "$D exists"; exit 1; }
F=${2:-$(python3 -c "import json; print(json.load(open('hooklab/library.json')).get('format', 'v3'))")}
mkdir -p "$D"; cp -r template/. "$D/"; rm -rf "$D/web/node_modules"; ln -s "$(pwd)/template/web/node_modules" "$D/web/node_modules"
if [ -d "formats/$F" ]; then cp "formats/$F/script.py" "formats/$F/audio_build.py" "formats/$F/sources.md" "$D/"; cp "formats/$F/scene.js" "$D/web/scene.js"; [ -f "formats/$F/odds.py" ] && cp "formats/$F/odds.py" "$D/"; fi
mkdir -p "$D"/{audio,render,frames,check,out}; echo "$D ready (format $F)"
