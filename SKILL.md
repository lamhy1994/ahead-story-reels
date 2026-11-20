---
name: ahead-story-video
description: Make every Ahead video. A 60–90 s English 9:16 bedtime story about one real money event, told in a moving low-poly 3D world with a warm narrator and a playful legend CTA, checked and posted to Instagram @ahead.learn. Replaces kinetic-explainer-video.
---

# Ahead story video

Keith's house format for every video (approved 19 Nov 2026 on episode 1, "The King With Too Much Gold"). Use it for any video he asks for, and for the scheduled daily runs. It replaces `kinetic-explainer-video`. Where `ai-reel-formula` disagrees about length, look, CTA or sound, this skill wins; its 底线 still hold (never say or show Bybit, no income promises, no logos or real app screens, facts need a source).

Code, fonts and the worked example live in the GitHub repo **lamhy1994/ahead-story-reels** (attach it with add_repo, push access; this file is its SKILL.md and is the newest version). Report to Keith in short Chinese; the video, captions and post are English only.

## 1. The format
- One true money story with a date, the people involved, what happened and how it ended (for news: where it stands today). Newest hot news first, older history only when no news qualifies (§2).
- 9:16, 1080×1920, 30 fps, 60–90 s (episode 1: 75.9 s, 199 words). Tone: a bedtime story told by a calm narrator, not a news report or a lecture.
- Picture: a low-poly, flat-shaded, warm-coloured 3D world built in code (people as simple figures, camels, buildings, boats, coins). The camera tours the world like a guide walking the viewer through it. Something new moves or appears every 2–3 s.
- One take: no hard cuts. Change place with a sky wipe (camera tilts up into the sky, the sky changes, camera comes down somewhere new) or a crane move over the roofs.

## 2. Picking the story: hottest recent news first (Keith, 20 Nov 2026)
1. Topics: crypto, stocks and companies, macro (rates, inflation, gold, currencies, trade as market news), scams and trader stories. English-language news from anywhere in the world.
2. Search the windows in this order and take the hottest qualifying story from the first window that has one: last 14 days → 1 month → 3 months → 1 year → 5 years → 20 years → older history (`ideas.md`).
3. "Hot" means all of: (a) covered by at least 3 major outlets (Reuters, Bloomberg, AP, FT, WSJ, CNBC, BBC; for crypto also CoinDesk, The Block); (b) clearly discussed: high-view YouTube videos, Reddit threads or X posts found by search; (c) one `vidiq_instagram_tiktok_outlier_search` per run (about 5 credits; check `vidiq_balance` first and skip it when under 40 credits) to see which of the candidates short videos are already pulling views. Rank the candidates and note the evidence in `sources.md`.
4. Skip: stories mainly about politicians, elections or government policy fights (Instagram does not recommend political content to non-followers by default, and posting it can make the account ineligible for recommendations); anything involving Bybit; stories with only rumours or a single outlet behind them; anything where real victims would end up as a punchline.
5. A story that is still hot can get a new episode every run, but each episode needs a new angle and new facts (what happened · one person's story · the mechanism · how it compares with a past event · the latest twist). Record `story`, `angle` and `window` in episodes.json and never repeat a story + angle pair.
6. Facts. News: every number and claim from at least two independent reliable sources, primary where possible (company filings and statements, exchange or on-chain data, court records, official statistics; the CoinGecko connector for crypto prices). Prices and totals carry "as of <date>" on screen. Allegations stay allegations ("accused", "charged", "says"). History: primary or scholarly sources; where historians disagree the narrator attributes it ("one writer in Cairo said", "some old accounts say") and the footnote says the point is debated. Never present a legend, rumour or disputed number as fact. Note title, URL and date of every source in `sources.md` (WebSearch, then WebFetch the original page, not snippets).
7. Unfinished news: tell it up to today and end on "the story isn't over yet" with the date. Never predict a price or an outcome.

## 3. Script (script.py)
Beats, roughly: hook with the year and a paradox (0–7 s) → who (name card) → the setting and journey → the key event, shown in steps → the mechanism with one tiny concrete example (episode 1: one coin buys 5 loaves, then 4) → the number moment (a price board, a counter) → the twist ending (news: where it stands today, dated) → title card "The story of …" with a one-line lesson → legend CTA.
- 180–210 words, short spoken sentences, ~170 wpm. Each sentence lists 1–3 keywords; they show boxed in amber. A keyword written in capitals in the list ("GOLD,") shows in capitals.
- Force pronunciations with `[Mansa](/mˈɑnsə/)`. Group sentences into paragraphs (PARAS): each paragraph is synthesized in one breath, which keeps sentence starts clear.

## 4. CTA (always the last 6–9 s)
News (events of the last 12 months): a simple either-or question tied to the story, answered with one word: "Would you have sold, or held? Comment SELL or HOLD." Both keywords in capitals; the comment box types one of them. No advice and no hint that one answer is right.

History (older events): a playful, clearly made-up "legend" tied to the story's object, asking for a one-word comment, then a wink:
"Legend in Cairo says, comment gold, and someone close to you gets rich this year. Just not too rich."
- Absurd and obviously folklore, never a promise; no follow/DM/link talk until Keith says so (planned at 1,000 followers). Keyword in capitals, 3–6 letters, from the story.
- Picture: chip "an old … legend", a comment box types the word, "Posted ✓", then something magical happens in the world (gold rain), and the wink line as a small tag.
- Instagram's recommendation guidelines name engagement bait, and articles quoting Instagram give "comment a specific word" as an example; repeated use can make the account ineligible for recommendations. Watch non-follower reach in insights; if it falls, switch some episodes to a question CTA.

## 5. Voice and sound
- Kokoro voice `bm_george`, speed 0.94 (British male, ~139 Hz, warm). `tts_build.py` writes audio/vo_final.wav + timing.json (word times) and transcribes it with faster-whisper: every caption word must be heard. Then `./vo_proc.sh` (always re-run after any voice change).
- Kokoro needs Python ≤ 3.12: `setup.sh` puts it in ~/.venvs/tts; run the voice with `./tts.sh`. Whisper writes spoken numbers as digits ("£20,000"), so check hearing with `~/.venvs/tts/bin/python hearcheck.py <wav>`, which expands them. Where the American G2P misleads the British voice, force the vowel: `[stock](/stˈɒk/)` (heard as "stark" otherwise).
- `audio_build.py`: D-minor storybook bed (pads, plucked harp/oud arpeggios, kalimba, soft doum/tek drum in travel and market scenes), ambience (desert wind, market murmur, camel bells), a sound for every visual event (coins, pops, dings, whooshes on sky wipes). Bed about 14.5 dB under the voice with ducking. `./master.sh`: −14 LUFS, peak ≤ −2 dBFS.

## 6. Building the world (web/scene.js)
Start every episode with `./new_episode.sh NNN-slug` (copies `template/` = episode 1) and rewrite the story parts of `scene.js`; keep the engine parts.
- `kit.js`: `GB` merges primitives into one vertex-coloured mesh; ready models: person, camel, building, minaret, stall, palace, pyramid, tent, palm, boat, cloud, coins. Add new models to kit.js the same way (box/cyl/cone/ball, origin at ground centre, facing +x) and copy them back to template/.
- Story clock `T`: every event hangs off word times (`wt(sentence, 'word')`), never fixed seconds.
- Sky presets (night, dawn, morning, day, golden, sunset, dusk) keyed to the story; night adds stars, lit windows, lanterns, glow.
- Camera: spherical keys `{t, tg, d, az, el, up, mv}`; `tg` can follow a moving subject. Always slightly moving. Use a lift-over key when moving between places so the path never goes through buildings.
- Overlay: captions at top 300 px (≤3 words, said words dim, keyword amber); one context chip at y 472 ("July 1324 · by the pyramids"); stamps for years, names, numbers; a two-line source footnote at y 1556. Keep text out of Instagram's UI: bottom 330 px and the right 130 px from y 1000 down.
- Modern stories need modern sets (city blocks, trading floors, screens and phones as simple shapes, server rooms, charts as 3D lines). Build them in kit.js like the rest and copy them back to template/. Never draw a real logo, a real app or website screen, or a real person's likeness; names appear as text.
- Separate random streams (`rng(seed)`) for anything added late, so the rest of the world keeps its layout.

## 7. Checks (all before posting)
1. `node cues.mjs check` → CAMERA NEAR/INSIDE SOLIDS must be `[]`.
2. Render 20–35 keyframes across the story (`node render.mjs keys t1,t2,… frames/k`, `python3 sheet.py frames/k check/k 6 250`) and look at every sheet: subject in frame, nothing unreadable, labels not over faces or each other, no frame empty. Look at a few full-size, and at moments mid-transition. Fix and re-check.
3. `node cues.mjs` (export cue times) → `python3 audio_build.py` → `./master.sh`.
4. `./render_full.sh` (two workers, ~10–15 min), wait for both WORKER_DONE, `./finish.sh <name>` → qa.py must print PASS (size, frame count, −14 LUFS, peak, no cuts, no jumps at segment joins, no frozen or flat frames).
5. Transcribe the final mix (`hearcheck.py audio/final_mix.wav`): every caption word heard near its time.
6. Contact sheet of the finished file (one frame every ~1.5 s) and look at it.
If a check fails and you cannot fix it, do not post: report to Keith what failed.

## 8. Caption and posting (@ahead.learn)
- Caption (the description under the Reel; Keith, 20 Nov 2026): no plot summary. The video tells the story; the caption makes the viewer feel it is about them.
  1. One or two resonance lines in plain English, chosen per story from three styles: ask whether they've lived it ("Ever sold too early, then bought back at the top? So did Isaac Newton."), name the pain ("Being smart doesn't protect you from FOMO. It didn't protect Newton."), or tell them the story is about them ("If you've ever chased a pump, this 300-year-old story is about you."). Stay true to the story; no advice, no income talk, no price predictions.
  2. Sources line (history: "Told from …. Historians still debate …" when relevant; news: "Sources: Reuters, CoinDesk … · as of <date>").
  3. The CTA line (history: "Legend says: comment KEYWORD 👇"; news: the question + "Comment SELL or HOLD 👇").
  4. 3–5 hashtags (#moneyhistory or #moneynews + topic). English only, never Bybit.
- Host: `./host_video.sh <file>` (upload copy on the repo's `media` branch) → `vidiq_video_upload(url=…)` → `vidiq_instagram_publish_reel(platformAccountId="29736220745970319", videoUrl=<vidIQ videoUrl>, caption=…)`, follow its containerId / mcpJobId continuation until PUBLISHED, record the permalink → `./clear_media.sh`.
- Regular Reel; leave `isAiGenerated` out unless Keith asks for the label. Never retry a failed publish automatically: report it.
- Update `episodes.json` (slug, title, event, keyword, made, posted, permalink, sources) and commit the episode's script.py, scene.js, audio_build.py, sources.md and caption.txt (no renders) to main.

## 9. Scheduled runs (Keith, 19 Nov 2026)
- Three runs a day, one episode each. Keith chose 3 a day knowing it may hit his plan's usage limit; if a run cannot finish, stop cleanly and report.
- No review: post automatically as soon as every check passes, and send Keith the video and permalink afterwards (Keith, 20 Nov 2026: "不用等我回覆（发）, 请自动发到ig 上"). Just before posting, fetch main and make sure the event is not already marked posted.
- Never post if a check failed, if a fact could not be confirmed, or if the same event was already posted.

## 10. Report to Keith (Chinese, short)
Title + one line on the story, the permalink and the video file, the 2–3 facts that carry the episode with their sources, anything uncertain, check results in one line.
