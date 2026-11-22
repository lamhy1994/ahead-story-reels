# Where Did the Money Go?  (6 Oct - 20 Nov 2026: Nvidia loses about $2.7 trillion of market value, more than the whole crypto market is worth;
# Friday 20 Nov: -14%, yet only about 2.6% of its shares change hands. A company's value is its last price times every share: the trillions were a price, not cash)
# Each sentence: (spoken text for the voice, keywords shown in an amber box in the captions)
# Paragraphs are synthesized together so that every sentence start is articulated clearly.
S = [
 ("Nvidia lost 2.7 trillion dollars, and nobody spent a cent.", ["trillion", "cent."]),
 ("That's more than the whole crypto market is worth.", ["whole", "crypto"]),
 ("So where did the money go?", ["where", "go?"]),
 ("It was never cash. A company's value is its last price, times every share.", ["never", "cash.", "every"]),
 ("Picture ten friends, each with a share worth a hundred dollars.", ["ten", "hundred"]),
 ("One panics and sells his for eighty.", ["panics", "eighty."]),
 ("Now all ten are marked at eighty, but only one was sold.", ["all", "one"]),
 ("On Friday, Nvidia fell 14%.", ["Friday,", "14%."]),
 ("Yet under three in a hundred of its shares were sold.", ["three", "sold."]),
 ("So who lost real cash? Those who bought high and sold low.", ["real", "high", "low."]),
 ("Their cash went to whoever sold to them at a higher price.", ["whoever", "higher"]),
 ("Everyone else holds a paper loss that can grow, or shrink.", ["paper", "grow,", "shrink."]),
 ("Nvidia ended Friday almost half below its record.", ["half", "record."]),
 ("The story isn't over yet.", ["over"]),
 ("The story of a wipe-out: the trillions were a price, not a pile of cash.", ["price,", "cash."]),
 ("Would you sell or hold? Comment: SELL, or HOLD.", ["SELL,", "HOLD."]),
]
PARAS = [[0], [1, 2], [3, 4, 5, 6], [7, 8], [9, 10, 11], [12, 13], [14], [15]]   # sentence indices spoken in one breath
PAUSE = [0.20, 0.22, 0.24, 0.22, 0.24, 0.24, 0.22, 0.0]                         # silence after each paragraph (s): 0.18-0.3
# Hook card on the first frame (also the cover): the hook sentence's contrast in <= 7 words, 2 lines, *one* amber word; subline = subject and date
HOOK = ["Nvidia lost $2.7 trillion.", "Nobody *spent* it."]
HOOK_SUB = "Nvidia · Oct–Nov 2026"
# Big number at 1.5-3 s: (value, what, when). Money first: lost / wiped out / liquidated / paid, in billions or trillions; a percentage only when it is huge
BIG = ("−$2.7 TRILLION", "Nvidia's value lost\nin six weeks", "6 Oct → 20 Nov 2026", "down")   # optional 4th: "down" (red, diving) or "up" (amber, climbing)
BIG_WORD = "trillion"     # the word of sentence 1 that says the number (tts.sh checks it falls at 1.2-3 s)
import re
def plain(s): return re.sub(r"\[([^\]]+)\]\([^)]*\)", r"\1", s)
if __name__ == "__main__":
    print(sum(len(plain(s).split()) for s, _ in S), "words")
