# The Doubters' Worst Day  (Mon 23 Nov 2026: Nvidia's board brings Jensen Huang back and the stock jumps 31.5%. The people betting
# on a fall (short sellers) lose about $12 billion on paper in one day (S3 Partners: roughly $12 bn, nearly 90% of the ~$13.7 bn they made
# in the seven sessions after he quit; ORTEX via Reuters: $12.2 bn at the day's high, $11.2 bn at the close, their biggest one-day hit since
# at least 2019). A European fund built to give -3x Nvidia's daily move falls about 91% and trading is halted (WSJ; Bloomberg data);
# the US 2x short fund falls 63% (Bloomberg). A short's losses have no ceiling (SEC investor bulletin). They are still ahead overall.)
# Each sentence: (spoken text for the voice, keywords shown in an amber box in the captions)
# Paragraphs are synthesized together so that every sentence start is articulated clearly.
S = [
 ("Nvidia's doubters lost about 12 billion dollars in one day.", ["doubters", "billion"]),
 ("Their worst day in at least seven years.", ["worst", "seven"]),
 ("So how do you lose that much, that fast?", ["lose", "fast?"]),
 ("A short seller borrows shares and sells them, hoping to buy back cheaper.", ["borrows", "sells", "cheaper."]),
 ("When Jensen Huang quit, the shares fell all week, and that bet paid billions.", ["quit,", "fell", "billions."]),
 ("Then on Monday, the board brought him back, and the shares jumped almost a third.", ["Monday,", "back,", "third."]),
 ("In one day, the doubters gave back almost all of that.", ["one", "all"]),
 ("The catch: a share can only fall to zero, but it can rise without limit.", ["zero,", "limit."]),
 ("Some bet bigger, with funds that lose 3% for every 1% rise.", ["bigger,", "3%"]),
 ("One in Europe lost about 90%, and trading was halted.", ["90%,", "halted."]),
 ("Overall, they're still ahead. The story isn't over yet.", ["ahead.", "over"]),
 ("The story of the doubters: right for a week, wrong for a day.", ["right", "wrong"]),
 ("Would you ever bet on a stock falling? Comment YES, or NO.", ["YES,", "NO."]),
]
PARAS = [[0], [1, 2], [3, 4], [5, 6], [7], [8, 9], [10], [11], [12]]   # sentence indices spoken in one breath
PAUSE = [0.20, 0.24, 0.22, 0.24, 0.22, 0.24, 0.22, 0.22, 0.0]          # silence after each paragraph (s): 0.18-0.3
# Hook card on the first frame (also the cover): the contrast in <= 7 words, 2 lines, *one* amber word; subline = subject and date
HOOK = ["The doubters were winning.", "Then came *Monday*."]
HOOK_SUB = "Nvidia · 23 Nov 2026"
# Big number at 1.5-3 s: (value, what, when). Money first: lost / wiped out / liquidated / paid, in billions or trillions; a percentage only when it is huge
BIG = ("−$12 BILLION", "lost in one day by people\nbetting Nvidia would fall", "Mon 23 Nov 2026 · on paper", "down")   # optional 4th: "down" (red, diving) or "up" (amber, climbing)
BIG_WORD = "billion"     # the word of sentence 1 that says the number (tts.sh checks it falls at 1.2-3 s)
import re
def plain(s): return re.sub(r"\[([^\]]+)\]\([^)]*\)", r"\1", s)
if __name__ == "__main__":
    print(sum(len(plain(s).split()) for s, _ in S), "words")
