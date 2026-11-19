#!/bin/bash
# Puts a finished episode on a public URL that vidIQ can import: an upload copy (smaller, same picture)
# force-pushed as the only file on the repo's "media" branch. Prints the raw URL.
# Usage: ./host_video.sh episodes/002-x/out/x.mp4
set -e; cd "$(dirname "$0")"; SRC=$(realpath "$1"); NAME=$(basename "$SRC" .mp4)-$(date -u +%Y%m%d%H%M)
ORIGIN=$(git remote get-url origin); SLUG=$(echo "$ORIGIN" | sed -E 's#.*github.com[/:]##; s#\.git$##')
W=$(mktemp -d); ffmpeg -v error -y -i "$SRC" -c:v libx264 -preset medium -crf 21 -pix_fmt yuv420p -profile:v high -c:a aac -b:a 160k -movflags +faststart "$W/$NAME.mp4"
SZ=$(stat -c %s "$W/$NAME.mp4"); [ $SZ -lt 95000000 ] || { echo "upload copy too big: $SZ bytes"; exit 1; }
cd "$W" && git init -q && git checkout -q -b media && git add "$NAME.mp4" && git -c user.name="Ahead bot" -c user.email="bot@aheadlearn.app" commit -qm "media: $NAME" && git remote add origin "$ORIGIN" && git push -q -f origin media
echo "https://raw.githubusercontent.com/$SLUG/media/$NAME.mp4"
