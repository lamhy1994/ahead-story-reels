#!/bin/bash
# Renders every segment with two workers in the background and waits for both.
cd "$(dirname "$0")"
NF=$(python3 -c "import json,math; print(math.ceil((json.load(open('audio/timing.json'))['duration']+1.25)*30))")
NS=$(( (NF + 239) / 240 )); EV=""; OD=""
for ((i=0;i<NS;i++)); do if ((i%2==0)); then EV="$EV $i"; else OD="$OD $i"; fi; done
mkdir -p render; rm -f render/wA.log render/wB.log
nohup env NF=$NF ./render_all.sh $EV > render/wA.log 2>&1 &
nohup env NF=$NF ./render_all.sh $OD > render/wB.log 2>&1 &
echo "rendering $NF frames in $NS segments"
