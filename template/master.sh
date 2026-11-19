#!/bin/bash
# two-pass loudnorm (linear) to -14 LUFS, then a safety limiter at -2 dBFS (leaves room for AAC overshoot) (no auto-level)
IN=${1:-audio/mix_raw.wav}; OUT=${2:-audio/final_mix.wav}
M=$(ffmpeg -hide_banner -nostats -i "$IN" -af loudnorm=I=-14:TP=-1.5:LRA=7:print_format=json -f null - 2>&1 | sed -n '/^{/,/^}/p')
set -- $(echo "$M" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d['input_i'], d['input_tp'], d['input_lra'], d['input_thresh'], d['target_offset'])")
ffmpeg -v error -y -i "$IN" -af "loudnorm=I=-14:TP=-1.5:LRA=7:measured_I=$1:measured_TP=$2:measured_LRA=$3:measured_thresh=$4:offset=$5:linear=true,alimiter=limit=0.794:level=false:attack=2:release=50" -ar 48000 "$OUT"
echo "in: I=$1 LUFS TP=$2 dBTP LRA=$3"
ffmpeg -hide_banner -nostats -i "$OUT" -af ebur128=peak=true:framelog=quiet -f null - 2>&1 | grep -A12 "Summary" | grep -E "I:|LRA:|Peak:" | tr -s ' ' | tr '\n' ';'; echo
