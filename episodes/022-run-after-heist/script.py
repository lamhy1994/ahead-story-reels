# The Run After the Heist  (the October 2026 Binance hack from the customers' side, and how it compares with Mt. Gox and FTX)
# Thu 29 Oct 2026: about $6.3bn taken from Binance's hot wallets, the biggest crypto theft on record (CoinDesk, CNBC, Reuters; the FBI blames
# North Korea, which denies it). Withdrawals halted; Sun 1 Nov 2026 from 06:00 UTC they reopen in phases and in the first nine and a half hours
# (06:00-15:30 UTC) customers withdraw $4.65bn and deposit $1.01bn: a net $3.64bn, about 2.1% of the $171bn Binance held (28 Oct proof of
# reserves). Binance's own figures, reported by Reuters (via Devdiscourse), The Block, Bitcoin.com News, SCMP. Binance says it replaced the
# stolen assets with company money (treasury, its user-protection fund SAFU, a bitcoin reserve, its futures insurance fund; Reuters via Khaleej
# Times, Bitcoin.com News, Al Jazeera, The Guardian). Thu 26 Nov 2026: Binance says its withdrawal recovery is complete and the withdrawal
# suspension fully lifted (Reuters via WIFC, TNW); about $2.85bn was frozen by issuers, the rest is in circulation, and more than $600m has
# passed through THORChain, flows stepping up in recent days (Reuters via BNN Bloomberg, citing Chainalysis and Elliptic).
# The past: Mt. Gox paused bitcoin withdrawals in early Feb 2014 and filed for bankruptcy protection on 28 Feb 2014 saying 850,000 bitcoins
# were missing, 750,000 of them customers' (TechCrunch, AP); repayments began on 5 Jul 2024 (The Block; Bloomberg: "after decade of waiting").
# FTX paused withdrawals on 8 Nov 2022 and filed for bankruptcy on 11 Nov 2022, facing an up to $8bn shortfall after lending customer deposits
# to Alameda Research (The Block's timeline citing Bloomberg and the WSJ; ABC News); repayments began in 2025.
# Each sentence: (spoken text for the voice, keywords shown in an amber box in the captions)
# Paragraphs are synthesized together so that every sentence start is articulated clearly.
S = [
 ("Customers pulled 3.6 billion dollars out of one exchange in under ten hours.", ["billion", "hours."]),
 ("It was Binance, reopening two days after crypto's biggest theft.", ["Binance,", "theft."]),
 ("So was the money still there?", ["money", "there?"]),
 ("When [Mt.](/mˈWnt/) [Gox](/ɡˈɑks/) and FTX locked their doors, it wasn't, and customers waited years.", ["Gox", "FTX", "years."]),
 ("Picture 100 customers, each owed one coin.", ["100", "coin."]),
 ("If all 100 are in the vault, a run is just a long line.", ["vault,", "line."]),
 ("If only 60 are, the last 40 get nothing.", ["60", "nothing."]),
 ("Binance says it refilled the stolen billions with its own money.", ["refilled", "own"]),
 ("By its count, the rush took about two coins in every 100.", ["two", "100."]),
 ("On Thursday, four weeks after the theft, it said the last lock is off.", ["Thursday,", "lock"]),
 ("But more than half the stolen money was never frozen, and it's still moving.", ["half", "moving."]),
 ("The story isn't over yet.", ["over"]),
 ("The story of the run: a promise is only as good as the vault.", ["promise", "vault."]),
 ("Would you have pulled your money out, or waited? Comment PULL, or WAIT.", ["PULL,", "WAIT."]),
]
PARAS = [[0], [1, 2], [3], [4, 5, 6], [7, 8], [9, 10, 11], [12], [13]]   # sentence indices spoken in one breath
PAUSE = [0.20, 0.24, 0.22, 0.24, 0.22, 0.24, 0.22, 0.0]                  # silence after each paragraph (s): 0.18-0.3
# Hook card on the first frame (also the cover): the contrast in <= 7 words, 2 lines, *one* amber word; subline = subject and date
HOOK = ["First the theft.", "Then the *run*."]
HOOK_SUB = "Binance · 1 Nov 2026"
# Big number at 1.5-3 s: (value, what, when). Money first: lost / wiped out / liquidated / paid, in billions or trillions; a percentage only when it is huge
BIG = ("$3.64 BILLION", "pulled out of Binance\nin under ten hours", "1 Nov 2026 · net of deposits", "down")   # optional 4th: "down" (red, diving) or "up" (amber, climbing)
BIG_WORD = "billion"     # the word of sentence 1 that says the number (tts.sh checks it falls at 1.2-3 s)
import re
def plain(s): return re.sub(r"\[([^\]]+)\]\([^)]*\)", r"\1", s)
if __name__ == "__main__":
    print(sum(len(plain(s).split()) for s, _ in S), "words")
