# Nothing at the Front (episode 28, 28 Nov 2026, turn format)

**Mechanism both halves share: feedback. Every reaction is a little bigger than its cause,** so a tap on the brakes (or a small dip) grows into a
jam (or a drop) that nobody started on purpose and no news explains. A driver brakes because the car ahead braked; you sell because the price ahead fell.

Everyday thing: you crawl through a traffic jam and at the front there is nothing (a "phantom" jam). Trading behaviour: selling because the price is
falling, which makes it fall further, and taking a big drop as proof that somebody knows something. Picked from `ideas.md` (Turn ideas: "A traffic jam
with no accident → a crash with no news"). Not the same as episode 27 (copying the queue: buying what others buy because their choices look like
information); this one is the reaction itself growing as it passes from one person to the next.

## Opening (`python3 hooklab.py pick` for episode 28): you / captions / action / event / turn, CTA arm N. Built as picked.
- words = you: "You crawl through a traffic jam, and at the front, there's nothing." (12 words, said to you, no money in it yet).
- text = captions: no headline box; the first words are captions from frame 0, `HOOK_SUB = "the phantom-jam problem"` as the small chip under them (0-2.7 s).
- picture = action: frame 0 is the ring road in daylight from behind and above you (the amber convertible with its ring and tag), the queue of stopped
  cars curving away, traffic coming the other way, people at a bus stop and on the pavements; the camera is already gliding (frame-0 rule: place, 3+
  figures, you, movement).
- beat2 = event: at 1.5 s a red wave of brake lights runs back down the queue, with three brake squeals.
- lock = turn: "You make the same jam when you trade. Here's why." (starts at 4.2 s); a price tower rises in the middle of the park, its chart turning down.

## Facts
1. "In one test, twenty-two drivers tried to circle a track at one speed. Nothing blocked the track. A jam appeared anyway."
   - Yuki Sugiyama, Minoru Fukui, Macoto Kikuchi, Katsuya Hasebe, Akihiro Nakayama, Katsuhiro Nishinari, Shin-ichi Tadaki and Satoshi Yukawa,
     "Traffic jams without bottlenecks: experimental evidence for the physical mechanism of the formation of a jam", New Journal of Physics 10 (2008)
     033001. Abstract read at https://iopscience.iop.org/article/10.1088/1367-2630/10/3/033001 : "We have performed an experiment on a circuit to show
     the emergence of a jam with no bottleneck"; "a jam cluster appears and propagates backward like a solitary wave"; "Even a tiny fluctuation grows
     larger and then the homogeneous movement cannot be maintained"; "a bottleneck is only a trigger and not the essential origin of a traffic jam".
   - Institute of Physics press release, 4 Mar 2008, as published by ScienceDaily (https://sciencedaily.com/releases/2008/03/080304075707.htm) and
     Phys.org (https://phys.org/news/2008-03-accident-bottleneck-traffic.pdf): "a circular track with a circumference of 230m"; "They put 22 cars on the
     road and asked the drivers to go steadily at 30km/h around the track"; "the effect of a driver altering his speed reverberated around the track and
     led to brief standstills"; "the cumulative effect of gentle braking rushes back over drivers like a wave".
2. "Each driver brakes a little harder than the one ahead." The mechanism in plain words: "Even a tiny fluctuation grows larger" (the paper) and "the
   cumulative effect of gentle braking rushes back over drivers like a wave" (the press release). On screen the tags "a little", "a little more" and
   "harder" are an illustration of that sentence, not measurements.
3. "And the same happens to prices. A dip makes you sell. Your sale makes it dip more." The same mechanism said to "you" as a picture of a habit (selling
   pushes a price down; a lower price is the next person's reason to sell). No claim about how many traders do it.
4. "But a drop that big feels like somebody knows something. Often, nobody does. Many of the market's fifty biggest days had no big news."
   - David M. Cutler, James M. Poterba and Lawrence H. Summers, "What Moves Stock Prices?", NBER Working Paper 2538 (March 1988); Journal of Portfolio
     Management 15(3), Spring 1989, pp. 4-12. Abstract (https://nber.org/papers/w2538): "evidence that large market moves often occur on days without
     any identifiable major news releases"; the paper (MIT scan, https://dspace.mit.edu/bitstream/handle/1721.1/64351/whatmovesstockpr00cutl.pdf):
     "Table 4 lists the fifty largest one-day returns on the Standard & Poor's Composite Stock Index since 1946"; "[M]any of the largest market
     movements in recent years have occurred on days when there were no major news events" (the scan drops the first letter); "On several of the
     days, the New York Times actually reported that there were no apparent explanations"; "On most of the sizable return days, however, the
     information that the press cites as the cause of the market move is not particularly important" (scan partly garbled); "It is difficult to link
     major market moves to release of economic or other information." Re-read by a separate check before posting: "many" is a fair, slightly
     cautious summary (the paper says "most" of the sizable days and gives no count).
   - Second, independent source for the same finding: Ray C. Fair, "Events That Shook the Market", Journal of Business 75(4), 2002, pp. 713-732
     (abstract, https://fairmodel.econ.yale.edu/rayfair/pdf/2000a.htm and https://ideas.repec.org/a/ucp/jnlbus/v75y2002i4p713-732.html): tick data on
     S&P 500 futures, 1982-1999, "Sixty-nine events that led to large stock price changes are identified"; "Many large stock price changes have no
     events associated with them." The full paper (how many large changes in all) could not be read, so the video gives no count from it.
   - "The market's fifty biggest days" includes up days as well as down days (the footnote and the board say "S&P index, 1946-1987").
5. The last two sentences are the ending, not facts ("You'd sit twenty minutes in a jam nobody caused. But twenty minutes of red, and you're sure someone
   knows." "Maybe nobody knew more than you. Maybe everyone was just braking."). "Twenty minutes" is a figure of speech on both sides. The last card's
   check: "Before you sell: is there news, or only the drop?" A question to ask, not a rule: no buy, sell or hold, no promise, no prediction, no platform,
   no coin, no Bybit.

## On screen
- The traffic is our own model (`web/jam.js`, the same code as `odds.py`): 22 cars on a 230 m lane, each driver following the car ahead (the
  optimal-velocity model of Bando et al., Physical Review E 51, 1995, with the velocity-difference term of Jiang, Wu and Zhu, Physical Review E 64, 2001,
  so no car touches another). No obstacle anywhere; `odds.py` shows that from 22 equally spaced cars and one 0.5 m wobble a car comes to a standstill
  after about 21 s and the jam moves backwards round the ring (about 26 km/h in the model). The video plays the model at about half speed, so that you are
  in the jam on frame 0, reach its back again on "a dip makes you sell" and sit in it for "twenty minutes". The footnote says the traffic is a model.
- Chip "the test · 22 cars · 230 m", "all told · one speed" (the drivers were asked to drive steadily at 30 km/h), "no obstacle", "a jam anyway".
- The price tower's chart: a picture, not data. Its first eight candles are drawn by hand; each car that brakes at the back of the jam adds a red candle,
  each a bigger step down.
- The 50 pillars and the 50 dots: a count of the days in Cutler, Poterba and Summers' Table 4, not their sizes; "often: no big news" is their abstract's word.
- Footnote: "Jam test: Sugiyama et al., New Journal of Physics, 2008 (22 cars, 230 m track). Biggest days: Cutler, Poterba & Summers, 1989. / The traffic
  on screen is a model of drivers following the car ahead. Not financial advice."

## Checks
- `./tts.sh`: 46.8 s, 124 words, 165 wpm (speed 1.08); lock-in at 4.2 s, rehook at 24.5 s (52%), lesson at 33.1 s; turns at sentences 3, 7, 9.
- Hearing: every caption word heard. Whisper writes "brakes"/"braking" as "breaks"/"breaking" (same sound): `hearcheck.py` now treats brake and break
  as the same word.
- `python3 staycheck.py --check`: OK. The two "dense" rows (0-3 s and 15-18 s) keep their words: each is one short sentence and the picture changes
  twice inside it (the red wave at 1.5 s; two cars braking, each with a tag and a spark).

## Engine changes in this episode
- `web/jam.js` (copied to template/web/): the car-following model, with `simulate()` and `carAt()`; `odds.py` is its Python twin.
- `staycheck.py` (copied to template/): the end-card row (no words) is keyed by "(no words)", so a filled-in end-card row is kept and `--check` can pass.
- `hearcheck.py` (copied to template/): brake/break, brakes/breaks, braking/breaking count as heard.
- `web/index.html` (copied to template/): `.strip.two.m20`, two rows of 20 small dots.
- `scene.js`: the camera's near plane grows with its distance (far views of flat ground layers no longer z-fight: radial streaks on the grass).

## Not sure
- Whether a road scene holds viewers as well as the supermarket of episode 26: one more turn Reel, scored at 12 h in trends/hooklab.md.
- "Many" of the fifty biggest days: the abstract says "often" and the text "most of the sizable return days"; Fair's separate study says "many". No
  study gives a count we could check, so the video says "many" and the board says "often".
