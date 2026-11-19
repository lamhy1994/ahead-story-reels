#!/bin/bash
# After vidIQ has imported the video: replace the media branch with an empty commit (keeps the repo small).
set -e; cd "$(dirname "$0")"; ORIGIN=$(git remote get-url origin); W=$(mktemp -d)
cd "$W" && git init -q && git checkout -q -b media && echo "Temporary video hosting for vidIQ imports. Emptied after every post." > README.md && git add README.md && git -c user.name="Ahead bot" -c user.email="bot@aheadlearn.app" commit -qm "media: cleared" && git remote add origin "$ORIGIN" && git push -q -f origin media && echo "media branch cleared"
