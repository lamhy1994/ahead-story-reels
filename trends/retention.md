# Retention charts: where real viewers left

Instagram's API gives two numbers a Reel (skip rate, average watch time). The second-by-second line exists only in the Instagram app: open the Reel → **View insights** → the **Retention** chart. Keith sends a screenshot now and then (asked for on 28 Nov 2026: episode 26 first, then any Reel over 300 plays, and one ordinary Reel a week for comparison).

When a screenshot arrives (in a chat, not in a scheduled run):
1. Read the line off the picture: the share still watching at 0, 3, 5, 10, 15, 20, 30 s and at the end, and every place where it falls faster than the stretch before it (a step), to the nearest second.
2. Put each step next to what the video was doing at that second: the words (`audio/timing.json` after `./tts.sh`, or the episode's `stay.md`) and the picture (the keyframe sheet).
3. Add a row below. Write what kind of moment it was (a number, a long sentence, the camera holding still, the turn, the bridge, a new place) so that steps can be compared across Reels.
4. Three Reels with a step at the same kind of moment: write the rule into SKILL.md §0 (the stay check) and say so in the report.
5. Use the measured points to correct the guess in `hooklab.py` (`K_SHAPE`, the curve behind "at 10 s" and "Where viewers leave").

| ep | plays when read | past 3 s | 10 s | 20 s | end | steps: second → what was on screen and being said | what we changed |
|---|---|---|---|---|---|---|---|
| (none yet) | | | | | | | |
