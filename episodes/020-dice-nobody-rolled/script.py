# The Dice Nobody Rolled  (the Coldcard bitcoin wallet seed flaw, 2026: the mechanism and the latest twist)
# Coldcard hardware wallets (maker: Coinkite) are "cold" wallets, built to keep the secret keys offline ("Bitcoin's safest hiding place",
# Bloomberg, 3 Aug 2026). From firmware of March 2021 until 30 Jul 2026 a firmware setting silently switched off the chip's hardware random
# number generator for wallet seeds, which fell back to a predictable software generator (Coinkite postmortem dated 23 Nov, published 24 Nov 2026,
# via Bitcoin Magazine, Bitcoin.com, FinanceFeeds; CoinDesk 17 Aug 2026; TRM Labs 5 Aug 2026): about 40 bits on Mk2/Mk3, about 72 bits on
# Mk4/Mk5/Q instead of 128, so keys could be rebuilt offline by brute force ("an attack that never touched the devices", CoinDesk 1 Aug 2026).
# 30 Jul 2026: about 594 BTC (about $38m) swept from about 500 wallets in 25 minutes (TRM Labs; CoinDesk 31 Jul 2026). Total per Galaxy Research,
# cited in the postmortem: 1,778.84 BTC from more than 8,600 addresses; about 300 loss tickets from 242 accounts as of 18 Nov (likely more).
# At least 15 independent reviews missed it; the release checks confirmed the hardware generator was present, never that seed generation used it.
# No decision yet on compensation; law enforcement investigating. 1,778.84 BTC x $60,743 (CoinGecko, 26 Nov 2026) = about $108 million
# (Bitcoin Magazine, 24 Nov: "about $107 million at today's price"; Galaxy in August, at the prices when taken: above $112 million).
# Each sentence: (spoken text for the voice, keywords shown in an amber box in the captions)
# Paragraphs are synthesized together so that every sentence start is articulated clearly.
S = [
 ("Offline wallets lost 108 million dollars in bitcoin.", ["108", "million"]),
 ("They're meant to be bitcoin's safest hiding place.", ["safest", "hiding"]),
 ("So how do you rob a wallet that's never online?", ["rob", "online?"]),
 ("You don't touch it. You guess its secret.", ["touch", "guess", "secret."]),
 ("Each secret should come from pure chance, like rolling dice.", ["chance,", "dice."]),
 ("But for five years, a hidden setting swapped the dice for a recipe.", ["five", "recipe."]),
 ("And a recipe is far easier to guess.", ["easier", "guess."]),
 ("So thieves rebuilt the secrets on their own computers.", ["rebuilt", "computers."]),
 ("In 25 minutes, hundreds of wallets were empty.", ["25", "minutes,", "empty."]),
 ("How did nobody notice?", ["nobody", "notice?"]),
 ("This week, its maker said at least 15 security reviews missed it.", ["15", "missed"]),
 ("Every check saw the dice in the box. None checked anyone rolled them.", ["box.", "rolled"]),
 ("Almost 1,800 bitcoin are gone, and repaying owners is still undecided.", ["1,800", "undecided."]),
 ("The story isn't over yet.", ["over"]),
 ("The story of a safe: it's only as strong as its secret.", ["safe:", "secret."]),
 ("Would you still trust a cold wallet? Comment: TRUST, or DOUBT.", ["TRUST,", "DOUBT."]),
]
PARAS = [[0], [1, 2], [3, 4, 5, 6], [7, 8, 9], [10, 11, 12, 13], [14], [15]]   # sentence indices spoken in one breath
PAUSE = [0.20, 0.24, 0.24, 0.24, 0.24, 0.22, 0.0]                              # silence after each paragraph (s): 0.18-0.3
# Hook card on the first frame (also the cover): the contrast in <= 7 words, 2 lines, *one* amber word; subline = subject and date
HOOK = ["Kept offline.", "Still *robbed*."]
HOOK_SUB = "Coldcard bitcoin wallets · 2026"
# Big number at 1.5-3 s: (value, what, when). Money first: lost / wiped out / liquidated / paid, in billions or trillions; a percentage only when it is huge
BIG = ("−$108 MILLION", "in bitcoin stolen from\nwallets kept offline", "1,779 BTC at the 26 Nov 2026 price", "down")   # optional 4th: "down" (red, diving) or "up" (amber, climbing)
BIG_WORD = "108"         # the word of sentence 1 that says the number (tts.sh checks it falls at 1.2-3 s)
import re
def plain(s): return re.sub(r"\[([^\]]+)\]\([^)]*\)", r"\1", s)
if __name__ == "__main__":
    print(sum(len(plain(s).split()) for s, _ in S), "words")
