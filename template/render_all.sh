#!/bin/bash
# Render worker: renders the listed 240-frame segments one after another.
# Usage: ./render_all.sh 0 2 4 …   (run two workers in parallel: evens and odds)
cd "$(dirname "$0")"
NF=${NF:-$(python3 -c "import json,math; print(math.ceil((json.load(open('audio/timing.json'))['duration']+1.25)*30))")}
mkdir -p render
for seg in "$@"; do
  f0=$((seg*240)); f1=$((f0+240)); [ $f1 -gt $NF ] && f1=$NF
  [ $f0 -ge $NF ] && continue
  out=$(printf "render/seg_%02d.mp4" $seg)
  [ -f "$out" ] && { echo "skip $out"; continue; }
  node render.mjs seg $f0 $f1 $out 2>&1 | grep -E "SEG_|PAGEERROR"
done
echo WORKER_DONE "$@"
