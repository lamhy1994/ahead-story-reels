# Ahead story reels
45–60 s English 9:16 money stories (hot news first, then history) that each teach one lesson, drawn in code (three.js low-poly world, Kokoro narrator, synthesized music), checked, then posted to Instagram @ahead.learn.
- `setup.sh` once per workspace · `hooklab.py pick` = the opening and CTA arm for the next episode · `new_episode.sh NNN-slug` · work in `episodes/NNN-slug` · `render_full.sh` · `finish.sh name` · `host_video.sh` → vidIQ import → publish → `clear_media.sh`.
- `trends/insights.md` = numbers per episode (`insights.py`) · `trends/hooklab.md` = which opening keeps people to 10 seconds, the CTA test and the road to 100 million views (`hooklab.py`, `hooklab/library.json`).
- `template/` is episode 1 (Mansa Musa, 1324) in format v3 and the reference for every new episode. `episodes.json` is the log; `ideas.md` the backlog.
- Branch `media` only ever holds the one video being posted.
