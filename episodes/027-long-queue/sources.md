# The Long Queue (episode 27, 28 Nov 2026, turn format)

**Mechanism both halves share: copying looks like information (an information cascade).** Every choice you can see counts as a vote, so after two
people the next one follows the queue instead of her own hunch, and a long queue can carry the opinion of very few people. A queue outside a
restaurant and a price that keeps rising are both made of choices you can see.

Everyday thing: you join the long queue when the restaurant next door is empty. Trading behaviour: buying what is already going up because the
other buyers look like they know something. Picked from `ideas.md` (Turn ideas: "The restaurant with a queue outside must be good").

## Opening (`python3 hooklab.py pick` for episode 27): question / banner / object / event / turn, CTA arm N. Built as picked.
- words = question: "Why do you join the long queue, when next door is empty?" (12 words, a question, said to you, no money in it yet).
- text = banner: `HOOK = ["Why join the long queue", "when next door is *empty*?"]`, `HOOK_SUB = "the restaurant-queue problem"`, from frame 0 to the last frame.
- picture = object: your queue ticket ("your number 100") in your hand, more than half the frame height, camera close and slowly circling (0-1.5 s).
- beat2 = event: at 1.5 s the camera pulls back: the whole zigzag queue ("100 waiting") and next door a waiter with nobody to serve ("no wait"); his door bell rings.
- lock = turn: "You pick your trades the same way. Here's why." (starts at 4.0 s); price boards rise over both roofs on "trades".

## Facts
1. "Once two people go in, the next person ignores their own hunch."
   - Sushil Bikhchandani, David Hirshleifer and Ivo Welch, "A Theory of Fads, Fashion, Custom, and Cultural Change as Informational Cascades",
     Journal of Political Economy 100(5), 1992, pp. 992-1026. Read: https://snap.stanford.edu/class/cs224w-readings/bikhchandani92fads.pdf
     pp. 996-997: when "both predecessors have adopted (in which case even an L signal induces him to adopt and thus creates an UP cascade)";
     p. 1000: "a cascade once started will last forever, even if it is wrong"; p. 1006: "cascades aggregate the information of only a few early individuals' actions".
   - David Easley and Jon Kleinberg, Networks, Crowds, and Markets (Cambridge University Press, 2010), ch. 16 "Information Cascades".
     Read: https://www.cs.cornell.edu/home/kleinber/networks-book/networks-book-ch16.pdf . It opens with two restaurants, one empty and one nearly
     full (16.1, p. 483: "it may be rational to join the crowd at B rather than to follow your own information"); in their sequential experiment,
     "If the first two guesses have been the same ... the third student should guess this color as well" (16.2, p. 487).
   - Our check (`odds.py`): in the model with hunches right 60% of the time, the third person follows two earlier choices against her own hunch
     in 100% of runs, with either tie rule (a coin flip, as in BHW; or her own hunch, as in Easley and Kleinberg).
2. "In one famous example, ninety-nine of a hundred people heard next door was better. The one who didn't came first. So all hundred queued here."
   - Abhijit V. Banerjee, "A Simple Model of Herd Behavior", Quarterly Journal of Economics 107(3), 1992, pp. 797-817, Introduction, pp. 798-799.
     Read: https://economics.mit.edu/research/publications/simple-model-herd-behavior (serves the paper's scan). Two restaurants A and B, prior
     51% for A; "Suppose that of the 100 people, 99 have received signals that B is better", "but the one person whose signal favors A gets to
     choose first"; for the second person the two signals "effectively cancel out" and she goes by the prior, to A; "Everyone ends up at
     restaurant A even if, given the aggregate information, it is practically certain that B is better."
   - It is an example inside a model, not a queue somebody counted: the narration says "In one famous example", the footnote says "(a model)",
     the caption says "Models of how copying spreads".
   - Our check (`odds.py`): the example replayed with rational choices: 100 of 100 choose A for hunches right 55%, 60%, 75% or 90% of the time;
     with all 100 hunches pooled, the chance that A is the better place is 5.8e-18. Not on screen: with hunches right 60% of the time, a
     whole queue settles on the worse place about 31% of the time (exact 30.8%, simulation 30.9%).
3. "A rising price is a queue. Every buyer looks like a vote. So you buy, and you become the queue." The same mechanism, said to "you" as a picture
   of a habit. No claim about how many traders do it and no claim that every rise is a cascade; "one stranger *can* pick your trade".
4. The last two sentences are the ending, not facts ("You'd never let one stranger pick your dinner. But one stranger can pick your trade."
   "Maybe you never followed a crowd. Maybe you followed whoever came first."). The last card's check: "Before you join in: your reason, or just
   the queue?" No buy, sell or hold, no promise, no prediction, no platform, no coin, no Bybit.

## On screen
- "100 waiting" and "no wait": the scene's own queue, not a fact. The ticket says "your number 100": you are the hundredth.
- Board: "the queue effect · after 2 people · the next one ignores her own hunch · Bikhchandani, Hirshleifer & Welch, 1992".
- 100 dots: 99 teal (heard next door was better), 1 amber; then "all 100 queued here · A. Banerjee, 1992".
- Price boards over the roofs: the queue's board climbs one candle for every person who joins; next door's stays flat. A picture, not data.
- Footnote: "The 99-in-100 example: A. Banerjee, Quarterly Journal of Economics, 1992 (a model). After two people: Bikhchandani, Hirshleifer & Welch, 1992. Not financial advice."

## Engine changes in this episode
- `hearcheck.py` (copied to template/): a caption word that Whisper glues to its neighbour ("next door" written "nextdoor") or a hyphenated
  number word Whisper writes as digits ("ninety-nine" written "99") now counts as heard. tts.sh's own quick list still prints them.
- `web/index.html`: styles for the hundred-dots card (`.dots`) and the board's second line (`.board .src2`), copied to template/.

## Not sure
- Whether the turn format keeps beating the story format: one turn Reel so far (episode 26: 647 plays, 19.2 s average watch, skip rate 20.5% about
  1.5 h after posting, against about 130 plays for a story Reel).
- The voice reads "queue" and "hunch" clearly (Whisper heard every word).
