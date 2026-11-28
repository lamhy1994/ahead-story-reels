# Stay check

Fill `picture` and `stay` for every row while looking at the keyframe sheet (two frames a row: the times are below).
A row where nothing visibly changes, or where no question is open and nothing lands, is where a viewer swipes: rewrite, cut or move something until it has both.
Every warning needs a fix or a reason in `note`. `python3 staycheck.py --check` must print OK before posting.

| time | part | said | warning | picture: what visibly changes | stay: the question still open, or the payoff that lands | note: what you changed, or why the warning is fine |
|---|---|---|---|---|---|---|
| 0–3 s | hook | You crawl through a traffic jam, and at the front, there's | dense (11 words) | behind you in the jam, the queue curving away; at 1.5 s a red wave of brake lights runs back down the queue; the camera glides forward | why is there a jam at all? the front is coming | dense: 12 words in 4 s is one breath at 165 wpm, and the picture changes twice inside it (the red wave at 1.5 s, the glide to the front at 2.3 s) |
| 3–6 s | hook | nothing. You make the same jam when you trade. |  | the end of the queue and the empty road with 'nothing here'; the camera swings to a price tower rising in the park, its chart turning down | 'you make the same jam when you trade' makes no sense yet: why? |  |
| 6–9 s | lock | Here's why. In one test, twenty-two |  | up over the whole ring, the tower in the middle; numbers 1 to 22 pop round the cars | 'here's why': the explanation is promised |  |
| 9–12 s | body1 | drivers tried to circle a track at one speed. |  | the ring from above, all 22 cars counted; chip 'all told · one speed' | if they all drove at one speed, where does a jam come from? |  |
| 12–15 s | body1 | Nothing blocked the track. A jam appeared |  | 'no obstacle' on the empty side; the stuck cars glow red; 'jam' tag; the camera moves in over it | a jam from nothing: how? |  |
| 15–18 s | body1 | anyway. Each driver brakes a little harder than the one ahead. | dense (11 words) | down beside the back of the jam: cars arrive and brake, 'a little', 'a little more'; red sparks fly up to the screen and candles appear | payoff: each driver brakes harder; and what has it got to do with trading? | dense: one short sentence; two cars brake in these 3 s, each with its tag and spark, so the words are shown as they are said |
| 18–21 s | body1 | And the same happens to prices. A |  | 'harder'; the screen's candles step down; chip 'same thing · in prices', 'price ↓' on the chart | payoff: the jam is a falling chart; where are you in it? |  |
| 21–24 s | body1 | dip makes you sell. Your sale makes it dip more. |  | you arrive in the amber car and brake: your amber candle, 'you sell'; the car behind brakes: 'dips more' | you are part of it: how far does it go? |  |
| 24–27 s | body1 | But a drop that big feels like somebody knows something. |  | the camera pulls back to the whole red staircase on the tower; chip 'it must be news' | rehook: surely somebody knows something? |  |
| 27–30 s | rehook | Often, nobody does. Many of the market's |  | up over the park: fifty pillars rise round it one by one; the board of 50 dots fills | 'often, nobody does': what did they find? |  |
| 30–33 s | body2 | fifty biggest days had no big news. |  | all fifty pillars up; 'often: no big news' and the source appear on the board | payoff: the number that teaches |  |
| 33–36 s | body2 | You'd sit twenty minutes in a jam nobody caused. |  | back down to you, sitting in the jam at sunset; the first row of 20 dots fills amber | where does this leave me? |  |
| 36–39 s | lesson | But twenty minutes of red, and you're sure someone knows. |  | the second row fills red; 'someone knows something' appears | the contrast lands: you wait out one, not the other |  |
| 39–42 s | lesson | Maybe nobody knew more than you. Maybe |  | the jam lets you go: you drive off as dusk falls; the last card's first line | the felt line lands |  |
| 42–45 s | lesson | everyone was just braking. |  | night: a ring of brake lights; line two, 'everyone was just braking', then the check line | the check to take away |  |
| 45–46 s | end card | (no words) |  | the last card holds with its check line over the lit ring | time to read it and screenshot it |  |

Keyframes for the sheet: `node render.mjs keys 0,0.5,1,1.6,2.3,3.2,4.5,6,7.5,9,10.5,12,13.5,15,16.5,18,19.5,21,22.5,24,25.5,27,28.5,30,31.5,33,34.5,36,37.5,39,40.5,42,43.5,45 frames/k`
