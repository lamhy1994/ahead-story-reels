# The $6 Billion Job Interview  (29 Oct 2026: hackers take about $6.3 billion from Binance's hot wallets in under four hours, the biggest crypto theft on record.
# Binance says the way in was a fake job interview: fake recruiters won an engineer's trust, a fake CEO sent a coding test that hid malware; nine days after
# reaching colleagues' computers, the wallets paid out. About $2.85 billion frozen; Binance says it covered the losses; the FBI blames North Korea, which denies it.
# 18-19 Nov 2026: an Abu Dhabi court's $6.5 billion worldwide freezing order, which can be served on the blockchain. The story isn't over yet.)
# Each sentence: (spoken text for the voice, keywords shown in an amber box in the captions)
# Paragraphs are synthesized together so that every sentence start is articulated clearly.
S = [
 ("Hackers stole 6.3 billion dollars, and they got in with a fake job interview.", ["billion", "job"]),
 ("It's the biggest crypto theft on record.", ["biggest", "record."]),
 ("So how does one interview empty Binance's wallets?", ["interview", "wallets?"]),
 ("Binance says fake recruiters won one engineer's trust.", ["recruiters", "trust."]),
 ("Then a fake CEO sent him a coding test, and the test hid malware.", ["coding", "malware."]),
 ("From his laptop, they reached the systems that approve payments.", ["laptop,", "payments."]),
 ("Nine days later, Binance's own wallets began paying the thieves.", ["Nine", "thieves."]),
 ("In under four hours, the money was gone.", ["four", "gone."]),
 ("But within hours, almost half was frozen.", ["half", "frozen."]),
 ("Binance says it covered its customers' losses itself.", ["covered", "itself."]),
 ("The FBI blames North Korea, which denies it.", ["FBI", "denies"]),
 ("Last week, a court in Abu Dhabi froze the loot worldwide.", ["court", "worldwide."]),
 ("Its order can even be delivered to the thieves' wallets.", ["order", "wallets."]),
 ("More than half is still missing. The story isn't over yet.", ["missing.", "over"]),
 ("The story of the biggest crypto heist: it started with trust.", ["heist:", "trust."]),
 ("Would you have spotted the fake? Comment YES, or NO.", ["YES,", "NO."]),
]
PARAS = [[0], [1, 2], [3, 4, 5], [6, 7], [8, 9, 10], [11, 12, 13], [14], [15]]   # sentence indices spoken in one breath
PAUSE = [0.20, 0.24, 0.22, 0.24, 0.22, 0.24, 0.22, 0.0]                         # silence after each paragraph (s): 0.18-0.3
# Hook card on the first frame (also the cover): the hook sentence's contrast in <= 7 words, 2 lines, *one* amber word; subline = subject and date
HOOK = ["One fake *job* interview.", "$6.3 billion gone."]
HOOK_SUB = "Binance · 29 Oct 2026"
# Big number at 1.5-3 s: (value, what, when). Money first: lost / wiped out / liquidated / paid, in billions or trillions; a percentage only when it is huge
BIG = ("$6.3 BILLION", "crypto stolen from Binance\nin under four hours", "29 Oct 2026", "down")   # optional 4th: "down" (red, diving) or "up" (amber, climbing)
BIG_WORD = "billion"     # the word of sentence 1 that says the number (tts.sh checks it falls at 1.2-3 s)
import re
def plain(s): return re.sub(r"\[([^\]]+)\]\([^)]*\)", r"\1", s)
if __name__ == "__main__":
    print(sum(len(plain(s).split()) for s, _ in S), "words")
