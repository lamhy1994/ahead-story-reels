# Story backlog (every fact must be re-checked against sources before use)
Pick one not in episodes.json. Prefer: a clear year, a named person, a surprising ending, a picture you can build in low-poly 3D.
- 1637 Tulip mania (Netherlands): a single bulb for the price of a house? (check: modern research says the crash was smaller than legend)
- 1720 South Sea Bubble: Isaac Newton lost a fortune ("I can calculate the motions of the heavenly bodies…" quote is disputed) (taken: episode 2)
- 1720 John Law and the Mississippi Bubble: paper money in France
- 1602 Dutch East India Company: the first shares anyone could buy
- 1260s Kublai Khan's paper money (Marco Polo's account)
- Potosí silver (1545 on): a mountain of silver and Spain's price revolution
- Rai stones of Yap: money too big to move
- 1869 Black Friday: Jay Gould and James Fisk try to corner gold
- 1907 panic: J.P. Morgan locks bankers in his library
- 1920 Charles Ponzi and the postal reply coupons
- 1923 Weimar hyperinflation: wallpaper and wheelbarrows of marks
- 1929 Black Tuesday; Jesse Livermore's short
- 1971 Nixon ends the gold link (Bretton Woods)
- 1980 Hunt brothers corner silver
- 1992 Black Wednesday: George Soros and the pound
- 1995 Nick Leeson breaks Barings Bank
- 1998 LTCM: Nobel winners' fund collapses
- 2008 Zimbabwe 100-trillion-dollar note
- 2008 Volkswagen short squeeze: briefly the world's most valuable company
- 2010 Bitcoin pizza day: 10,000 BTC for two pizzas
- 2010 Flash Crash
- 2012 Knight Capital loses $440 million in 45 minutes
- 2013 James Howells throws away a hard drive with bitcoin
- 2014 Mt. Gox
- 2015 Swiss franc unpegged in minutes
- 2021 GameStop squeeze
- 2021 Archegos
- 2022 Terra/Luna; FTX

# Turn ideas (SKILL.md §0; every fact must be checked against sources before use)
One line each: the everyday thing → the trading behaviour · the mechanism both share · what to check. Take one whose `story` is not in episodes.json, or find a new one that passes the mapping test.
- (taken: episode 26) The other checkout line always moves faster → switching strategies · chance and selection · three equal lines: yours is fastest 1 time in 3
- The lift that always seems to go the wrong way first → "the price turns the moment I sell" · where you stand decides what you see first · Gamow and Stern's elevator paradox (1958), Knuth (1969)
- Buses come in threes → big price days come in bunches · a delay feeds itself · bus bunching; volatility clustering (Mandelbrot 1963, Engle 1982)
- A traffic jam with no accident → a crash with no news · every reaction is a little bigger than its cause · Sugiyama et al. 2008 (22 cars on a ring); forced selling and liquidation cascades (find a documented case)
- Toast lands butter side down → the trade that was lost before it began · the set-up decides, not luck · Matthews 1995 (table height gives half a turn); with 10x leverage a move of about 10% against you ends the position (work it out, say "about")
- 23 people in a room, two share a birthday → "this chart looks exactly like that one before it pumped" · many pairs make coincidences certain · the birthday problem (50.7% at 23); odds.py for charts
- Flip a coin ten times in a hall of a thousand people and somebody gets ten heads → the trader with ten wins in a row · among thousands, some win by luck alone · 1 in 1,024; survivorship. Name no platform and no leaderboard.
- A watched pot never boils → checking the price every few minutes · more looks, more losses seen · Benartzi and Thaler 1995; Thaler, Tversky, Kahneman and Schwartz 1997 (people shown results more often took less risk and earned less)
- The shortcut every map app suggests becomes the jam → the crowded trade · an edge everyone uses stops being one · Braess's paradox (1968); Khandani and Lo on August 2007
- You finish a bad film because you paid for the ticket → holding a loser to get back to even · the price you paid is not information · Arkes and Blumer 1985; Odean 1998 (winners sold more readily than losers: check the figures)
- Fold a sheet of paper 42 times and it reaches the moon → compounding, both ways · growth on growth · 0.1 mm x 2^42 is about 440,000 km; a 50% loss needs a 100% gain
- (taken: episode 27) The restaurant with a queue outside must be good → buying because it is going up · copying looks like information · Bikhchandani, Hirshleifer and Welch 1992 (information cascades)
- The shower that is always too hot or too cold → overtrading after every candle · reacting to a delayed signal makes it worse · Milton Friedman's "fool in the shower"; find a study on overreaction
- Three doors, one prize: switching wins 2 times in 3 → when changing your mind is right · new information is not the same as noise · the Monty Hall problem (the other side of episode 26)
- The planes that came back full of holes → the success stories you copy · you only see the ones that survived · Abraham Wald's wartime memo (check what he really wrote: retellings embellish)
- Losing a 50 note hurts more than finding one feels good → cutting winners early and letting losers run · losses weigh about twice as much · Kahneman and Tversky 1979; Tversky and Kahneman 1992

Second batch, added 28 Nov 2026. Written from memory and not yet opened at the source: every paper, date and figure below (above all the ones marked "check") must be confirmed on the original page before use, like the rest of this list.
- Shuffle plays the same artist twice in a row and feels broken → "this chart has a pattern" · real randomness comes in clumps, and we expect it to be spread evenly · Spotify's engineering post on why it changed shuffle (2014, "How to shuffle songs?"); Steve Jobs presenting "smart shuffle" in 2005 (check the wording: "less random to make it feel more random"); odds.py: the chance of the same artist back to back in a playlist, and a coin-flip chart that looks like a trend
- The "close door" button in the lift and the button at the crossing that do nothing → moving the stop and watching the screen feel like control · doing something feels like steering even when it changes nothing · New York Times 2004 (most of New York's walk buttons no longer worked: check "more than 2,500 of 3,250") and 2016 (door-close buttons); Langer 1975 (people who chose their own lottery ticket asked far more to give it up: check $8.67 against $1.96); Fenton-O'Creevy and others 2003 (traders at London banks: more illusion of control, worse results)
- Never shop hungry: you come home with things you did not want → trading straight after a loss · the state you are in sets the size of the bet · Xu, Schwarz and Wyer 2015 (hungry shoppers spent about 64% more: check); Coval and Shumway 2005 (Chicago traders with a losing morning took more risk in the afternoon); Thaler and Johnson 1990 (the break-even effect)
- "30% chance of rain", it rains, and the forecast "was wrong" → judging a trade by how it ended · one result cannot grade a probability · the US National Weather Service on what a chance of rain means; Baron and Hershey 1988 (outcome bias). Not the losing-streak angle of episode 26: this one is about grading one decision
- The ten-day forecast keeps changing, tomorrow's does not → price targets a year away · small errors grow with every step · NOAA SciJinks (a 5-day forecast is right about 90% of the time, a 7-day about 80%, a 10-day about half: check); Lorenz 1963; odds.py: the spread of a random walk grows with the square root of time. Never a price forecast of our own
- "Was 200, now 99": the first number makes the second look cheap → "it is 60% below its high, so it is cheap" · the first number you see becomes the ruler · Tversky and Kahneman 1974 (a wheel that stopped at 10 or 65 moved people's guesses to 25% and 45%: check); George and Hwang 2004 (the 52-week high as an anchor)
- Almost everyone says they drive better than average → trading more because you are sure · most of us put ourselves above the middle, and the surer we are the more we do · Svenson 1981 (93% of the US drivers asked put themselves in the better half: check); Barber and Odean 2000 (the households that traded most earned 11.4% a year against 17.9% for the market, 1991-1996: check)
- The mug you own is worth more than the same mug in the shop → "I would not buy it today, but I will not sell it" · owning a thing raises its price in your head · Kahneman, Knetsch and Thaler 1990 (owners wanted about $7 for a mug buyers would pay about $3 for: check $7.12 and $2.87). End on a question (would you buy it today?), never on advice to sell. Not the bad-film idea above: this is about owning, not about what you paid
- The grass really is greener next door → everybody else's trades look better than yours · you see theirs from the side and yours from above · Pomerantz 1983, "The grass is always greener: an ecological analysis of an old aphorism", Perception (check that it says what retellings say: at a low angle the blades hide the bare soil); Han, Hirshleifer and Walden 2022 (people pass on their wins more than their losses). Name no platform and no leaderboard
- The claw machine drops the toy at the last second → the trade that "almost" reached your target · an almost-win is a loss that feels like progress · Clark and others 2009 (near-misses raised the urge to keep playing: check); how owners set the claw's grip (Vox 2015 and the machines' manuals: check). The market is not a claw machine: say only that "almost" does the same thing to you
- You finish the bag of crisps whatever its size → "this coin costs a cent, so it has room to grow" · we count units, not the size of the whole · Geier, Rozin and Doros 2006 (unit bias: a bigger scoop, and people took more); Birru and Wang 2016 (nominal price illusion: investors expect more from low-priced shares). Name no coin
- Your friends have more friends than you do → "everyone I follow is making money" · the people you can see are not the average: the big ones are in more people's lists · Feld 1991; Ugander and others 2011 (on Facebook a user had 190 friends on average and their friends 635: check)
- The bus you wait for is always the late one → you always seem to buy just before the long wait · you are more likely to arrive in a long gap, because long gaps take up more of the time · the waiting-time (inspection) paradox: with buses arriving at random, 10 minutes apart on average, the average wait is 10 minutes, not 5 (odds.py); odds.py: how little of the time a random walk sits at a new high. Not "buses come in threes"
- After the match everybody knew who would win → "the top was obvious" on an old chart · once you know the ending, memory rewrites what you expected · Fischhoff 1975 (people told how it ended rated that ending as far more likely beforehand: check the figures)
- The last day ruins the whole holiday → one bad trade at the end ruins a good month · memory keeps the worst moment and the end, not the average · Kahneman, Fredrickson, Schreiber and Redelmeier 1993 (most people chose to repeat the longer cold-water trial because it ended less badly: check 69%)
- Every job at home takes twice as long as you planned → "I will make it back by Friday" · we plan from the best case and forget how long things took before · Buehler, Griffin and Ross 1994 (students expected 33.9 days for a thesis and took 55.5: check). For the trading half use how long a named index took to regain a named high, sourced; never a forecast
