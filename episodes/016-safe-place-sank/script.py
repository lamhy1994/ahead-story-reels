# The Safe Place That Sank  (gold falls to about $3,600 an ounce on Tue 24 Nov 2026, its lowest in more than a year and about a third below
# its record of nearly $5,600 on 29 Jan 2026: about $14 trillion of paper value of all the world's above-ground gold gone (World Gold Council
# stock x price), through a year of war in the Gulf. Why: gold pays no interest while US 10-year bonds pay about 5%; the war lifted oil and
# prices, the Fed raised rates on 16 Sep 2026 and a December hike is nearly fully priced; margin calls in the AI-stock sell-off made some
# traders sell gold (Commerzbank, Capital.com); analysts note gold tended to fall when the fighting escalated and rise when it eased,
# because oil feeds rate-hike bets. The next Fed decision is 9 Dec 2026. The story isn't over yet.)
# Each sentence: (spoken text for the voice, keywords shown in an amber box in the captions)
# Paragraphs are synthesized together so that every sentence start is articulated clearly.
S = [
 ("The world's gold lost about 14 trillion dollars, during a war.", ["gold", "trillion"]),
 ("Gold is where scared money hides.", ["scared", "hides."]),
 ("So why did the safe place sink?", ["safe", "sink?"]),
 ("Start with gold's weak spot: it pays no interest.", ["weak", "interest."]),
 ("US bonds now pay about 5 percent, and gold pays zero.", ["5", "zero."]),
 ("And what pushed rates up? Partly, the war.", ["rates", "war."]),
 ("The fighting pushed oil and prices up, so America's central bank raised rates.", ["oil", "raised"]),
 ("Then AI stocks crashed, and traders on borrowed money needed cash fast.", ["borrowed", "cash"]),
 ("Analysts say some sold the easiest thing: their gold.", ["easiest", "gold."]),
 ("Here's the twist: when the fighting got worse, gold often fell.", ["twist:", "fell."]),
 ("When it calmed, gold rose.", ["calmed,", "rose."]),
 ("On Tuesday, gold slid to about 3,600 dollars, its lowest in over a year.", ["3,600", "lowest"]),
 ("The next rate decision is December 9th. The story isn't over yet.", ["December", "isn't"]),
 ("The story of gold in 2026: safe doesn't mean it can't fall.", ["safe", "fall."]),
 ("Would you sell your gold, or hold it? Comment: SELL, or HOLD.", ["SELL,", "HOLD."]),
]
PARAS = [[0], [1, 2], [3, 4], [5, 6], [7, 8], [9, 10], [11, 12], [13], [14]]   # sentence indices spoken in one breath
PAUSE = [0.20, 0.24, 0.22, 0.24, 0.22, 0.24, 0.22, 0.22, 0.0]                  # silence after each paragraph (s): 0.18-0.3
# Hook card on the first frame (also the cover): the hook sentence's contrast in <= 7 words, 2 lines, *one* amber word; subline = subject and date
HOOK = ["The safe place", "*sank* in a war."]
HOOK_SUB = "Gold · Nov 2026"
# Big number at 1.5-3 s: (value, what, when). Money first: lost / wiped out / liquidated / paid, in billions or trillions; a percentage only when it is huge
BIG = ("−$14 TRILLION", "paper value of all the world's gold\nlost since its January record", "as of 24 Nov 2026", "down")   # optional 4th: "down" (red, diving) or "up" (amber, climbing)
BIG_WORD = "trillion"     # the word of sentence 1 that says the number (tts.sh checks it falls at 1.2-3 s)
import re
def plain(s): return re.sub(r"\[([^\]]+)\]\([^)]*\)", r"\1", s)
if __name__ == "__main__":
    print(sum(len(plain(s).split()) for s, _ in S), "words")