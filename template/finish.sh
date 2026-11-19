#!/bin/bash
# Joins the segments, adds the mastered soundtrack, writes out/<name>.mp4 and runs the numeric checks.
# Usage: ./finish.sh <name>
set -e; cd "$(dirname "$0")"; NAME=${1:-episode}
NF=$(python3 -c "import json,math; print(math.ceil((json.load(open('audio/timing.json'))['duration']+1.25)*30))")
NS=$(( (NF + 239) / 240 )); rm -f render/list.txt
for ((i=0;i<NS;i++)); do f=$(printf "seg_%02d.mp4" $i); [ -f render/$f ] || { echo "missing render/$f"; exit 1; }; echo "file '$f'" >> render/list.txt; done
ffmpeg -hide_banner -loglevel error -y -f concat -safe 0 -i render/list.txt -c copy -movflags +faststart render/video_only.mp4
mkdir -p out
ffmpeg -hide_banner -loglevel error -y -i render/video_only.mp4 -i audio/final_mix.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -ar 48000 -movflags +faststart out/$NAME.tmp.mp4
mv out/$NAME.tmp.mp4 out/$NAME.mp4
python3 qa.py out/$NAME.mp4 $NF
