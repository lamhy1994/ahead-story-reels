# The Other Line: sample of the "turn" format (28 Nov 2026, not posted)

Keith, 28 Nov 2026, about the Reel instagram.com/reel/DgMKBJJMeMP (a bullet fired into a round tube comes back; then trading psychology):
"可不可以做成这样，先用现实普通人会遇到的比较特别的东西做hook，然后很没逻辑的link 到trading，然后把逻辑联合起来，然后最后给人家emotional".
The shape, taken from that Reel (its structure only, none of its words or pictures): something odd from ordinary life as the hook → a jump to trading
that makes no sense yet → the logic that joins the two → an ending that is felt. No CTA. `research/hook-study-2026-11-28.md` has the notes (X2).

## What this folder is
One sample built for Keith to judge, in our own low-poly look. Nothing in the daily runs uses it yet.
- `script.py` (FORMAT = "turn", CTA_ARM = "N", TAIL, LESSON_LABEL), `scene.js`, `audio_build.py`: the three story files, as in an episode folder.
- `tts_build.py`, `index.html`: the two engine files this sample changed. If Keith adopts the format, fold these changes into `template/`:
  tts_build.py: FORMAT "turn" (PARTS without cta, CTA_ARM "N", no SHEET, its own WARN lines), TAIL (a longer hold after the last word, left out of the pace), LESSON_LABEL;
  index.html: `.tag.gr`, `.pips i.lo`, `.strip` (the row of 20 trades, the two rows of ten).
- `odds.py`: the calculation behind the numbers on screen.
- To rebuild: copy `template/` to a work folder, put these files over it (scene.js and index.html into web/), then tts.sh → vo_proc.sh → cues.mjs → audio_build.py → master.sh → render_full.sh → finish.sh.

## Facts
1. "With three lines, yours is the fastest only one time in three." Three lines that are equally fast on average: each is the quickest one time in three, so two times in three another line beats yours.
   - Bill Hammack (engineerguy), "Why the other line is likely to move faster": https://www.engineerguy.com/comm/4022.htm
   - Adam Mann, Wired, 2014, as quoted by Quartz (https://qz.com/1452655/math-explains-why-you-never-choose-the-fastest-line) and Gizmodo (https://gizmodo.com/why-do-you-always-end-up-in-the-slowest-line-1605403276)
   - Our own check: `odds.py`, 200,000 runs, three equal lines → yours is the fastest 33.5% of the time.
   - Why it also feels that way (not said in the video): Redelmeier and Tibshirani, "Why cars in the next lane seem to go faster", Nature, 2 Sep 1999: with the same average speed in both lanes, drivers spend more time being overtaken than overtaking. Nick Bostrom (Plus magazine, Nov 2001) argues part of it is real: more of the cars are in the slow lane.
2. "In trading there aren't three lines. There are thousands." The exchanges in the World Federation of Exchanges' data list over 49,054 companies (WFE press release, 27 Feb 2026: https://www.world-exchanges.org/news/articles/new-wfe-data-public-markets-post-strong-growth-2025-despite-geopolitical-instability). Coins come on top. The video gives no count.
3. "A strategy that wins six times in ten still loses three in a row, sooner or later." Our own calculation (`odds.py`: exact, a Markov chain; checked by simulation), for a 60% win rate and independent trades:
   at least one run of three losses within 10 trades 31.4% · within 20 trades 56.2% · within 30 trades 72.1% · within 50 trades 88.6%; on average the first such run arrives after 24.4 trades.
   On screen: "3 losses in a row within 20 trades: 56% of the time" and "within 50 trades: 89%". Real trades are not independent and no strategy has a fixed win rate: the footnote says it is an illustration.
4. "Every switch sends you to the back of a new line." True of a queue by definition. For trading it is a picture, not a measured fact: the script does not put a number on it.
5. The last two lines ("ten minutes to buy milk ... ten trades", "Maybe you were never in the wrong line") are the ending, not facts. "Ten trades" is a figure of speech; the card under it asks only "has it had enough trades to judge?". No advice to buy, sell or hold, no promise, no prediction, no Bybit.

## Not sure
- Whether this shape holds viewers better than our story Reels: unknown until some are posted and scored. In the 143-post list it is rare (2 posts) but one of them is the most-viewed of all.
- The voice is our narrator at his usual pace; the reference is slower and heavier over loud music. Keith decides whether to go further that way.
