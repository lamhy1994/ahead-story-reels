#!/bin/bash
# Starts a new episode folder from the template (the first episode, Mansa Musa, is the worked example).
# Usage: ./new_episode.sh 002-tulip-mania     -> work in episodes/002-tulip-mania
set -e; cd "$(dirname "$0")"; D=episodes/$1
[ -e "$D" ] && { echo "$D exists"; exit 1; }
mkdir -p "$D"; cp -r template/. "$D/"; rm -rf "$D/web/node_modules"; ln -s "$(pwd)/template/web/node_modules" "$D/web/node_modules"
mkdir -p "$D"/{audio,render,frames,check,out}; echo "$D ready"
