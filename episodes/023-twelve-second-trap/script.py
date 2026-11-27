# The 12-Second Trap  (the Peraire-Bueno brothers' Ethereum MEV case, April 2023 -> 16 Nov 2026)
# 3 Apr 2023: Ethereum "sandwich" trading bots lose about $25m in one block (The Block, 3 Apr 2023). May 2024: MIT-educated brothers Anton and
# James Peraire-Bueno are charged (wire fraud, conspiracy, money laundering; up to 20 years each): prosecutors say they took about $25m in about
# 12 seconds, after months of planning: bait trades lured the bots, a flaw in MEV-Boost relay software let them see the block before they
# committed to it, and they swapped the bait for their own sells (US DOJ / IRS-CI 15 May 2024; Reuters; The Block; CoinDesk; Decrypt).
# 7 Nov 2025: mistrial, the jury deadlocked (Reuters via The Star; The Block; Decrypt; Cointelegraph). Prosecutors sought a retrial (The Block,
# 11 Nov 2025). Mon 16 Nov 2026: Judge Jessica Clarke grants a judgment of acquittal on all three counts: the government failed to prove any
# material misrepresentation; the question "is not whether the Peraire-Buenos' conduct was right or moral" (BleepingComputer, Gizmodo, Decrypt,
# Bitcoin.com); Ethereum is "a trustless, highly adversarial environment with no terms of use" (CoinDesk, Decrypt). The case is closed with no
# second trial (Decrypt; CoinDesk; Bloomberg headline). The US government's first criminal case over MEV (CoinDesk; DOJ: "first of its kind").
# Each sentence: (spoken text for the voice, keywords shown in an amber box in the captions)
# Paragraphs are synthesized together so that every sentence start is articulated clearly.
S = [
 ("Two brothers took 25 million dollars from trading robots in 12 seconds.", ["million", "seconds."]),
 ("It was America's first criminal case of its kind.", ["first", "kind."]),
 ("This month, a judge cleared them.", ["judge", "cleared"]),
 ("So how do you take millions in 12 seconds, and walk free?", ["millions", "free?"]),
 ("Every 12 seconds, Ethereum packs waiting trades into a new block.", ["Ethereum", "block."]),
 ("Robot traders spot a big buy coming, jump in just before it, and sell just after.", ["Robot", "before", "after."]),
 ("So the brothers studied them for months, then fed them bait.", ["months,", "bait."]),
 ("Then a software flaw let them peek inside the block before it was sealed.", ["flaw", "peek"]),
 ("They swapped the bait for sells, and the robots' money flowed to them.", ["swapped", "money"]),
 ("Prosecutors called it fraud.", ["fraud."]),
 ("The first jury couldn't agree.", ["jury", "agree."]),
 ("Judge Jessica Clarke wrote that no lie was proven.", ["Clarke", "lie"]),
 ("The question, she wrote, was not whether it was right or moral.", ["right", "moral."]),
 ("The case is closed.", ["closed."]),
 ("The story of the 12-second trap: code is fast, the law is slow.", ["fast,", "slow."]),
 ("Crime or fair play? Comment CRIME, or FAIR.", ["CRIME,", "FAIR."]),
]
PARAS = [[0], [1, 2, 3], [4, 5], [6, 7, 8], [9, 10, 11, 12], [13, 14], [15]]     # sentence indices spoken in one breath
PAUSE = [0.20, 0.24, 0.22, 0.24, 0.24, 0.22, 0.0]                              # silence after each paragraph (s): 0.18-0.3
# Hook card on the first frame (also the cover): the contrast in <= 7 words, 2 lines, *one* amber word; subline = subject and date
HOOK = ["$25M in 12 seconds.", "Then walked *free*."]
HOOK_SUB = "Two brothers vs. trading robots · Nov 2026"
# Big number at 1.5-3 s: (value, what, when). Money first: lost / wiped out / liquidated / paid, in billions or trillions; a percentage only when it is huge
BIG = ("$25 MILLION", "taken from trading robots\nin about 12 seconds", "Ethereum · April 2023 · per prosecutors", "down")   # optional 4th: "down" (red, diving) or "up" (amber, climbing)
BIG_WORD = "million"     # the word of sentence 1 that says the number (tts.sh checks it falls at 1.2-3 s)
import re
def plain(s): return re.sub(r"\[([^\]]+)\]\([^)]*\)", r"\1", s)
if __name__ == "__main__":
    print(sum(len(plain(s).split()) for s, _ in S), "words")
