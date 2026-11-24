# The Money on Trial  (Mon 23 Nov 2026: the US Justice Department files a civil forfeiture complaint in a Washington, D.C., federal court against about
# $1.17bn of USDC stolen in the 29 Oct 2026 Binance hack, about $6.3bn, the biggest crypto theft on record; the FBI blames North Korea, which denies it.
# In such a case the property itself is the defendant. Circle has frozen the USDC but cannot move the original tokens, so it agreed to issue new USDC
# to the US if the court orders forfeiture. Bitcoin and ether have no issuer that can freeze them: the rest was spread over 27,000+ wallets and even
# home-made meme coins; trackers say more than $2bn still sits in wallets tied to the theft (Elliptic, 23 Nov 2026). The story isn't over yet.)
# Each sentence: (spoken text for the voice, keywords shown in an amber box in the captions)
# Paragraphs are synthesized together so that every sentence start is articulated clearly.
S = [
 ("Hackers stole 6.3 billion dollars, and now America is suing the money itself.", ["billion", "suing"]),
 ("It's the Binance hack, the biggest crypto theft on record.", ["Binance", "biggest"]),
 ("So why sue the money, not the thieves?", ["money,", "thieves?"]),
 ("The FBI blames North Korea, which denies it.", ["FBI", "denies"]),
 ("But in this kind of case, the money itself is the defendant.", ["money", "defendant."]),
 ("The money in court: over a billion in frozen digital dollars, called USDC.", ["frozen", "USDC."]),
 ("But frozen coins can't move, not even for their maker.", ["can't", "maker."]),
 ("So it agreed to make new ones for America, if a judge says yes.", ["new", "judge"]),
 ("And the rest? Bitcoin and ether have no company that can freeze them.", ["rest?", "freeze"]),
 ("So the thieves spread it over 27,000 wallets, and made their own meme coins.", ["27,000", "meme"]),
 ("Trackers say over 2 billion is still in wallets tied to the theft.", ["2", "billion"]),
 ("The story isn't over yet.", ["isn't", "over"]),
 ("The story of the money on trial: frozen isn't returned.", ["frozen", "returned."]),
 ("Should every coin have a freeze button? Comment YES, or NO.", ["YES,", "NO."]),
]
PARAS = [[0], [1, 2], [3, 4], [5, 6, 7], [8, 9], [10, 11], [12], [13]]   # sentence indices spoken in one breath
PAUSE = [0.20, 0.24, 0.22, 0.24, 0.22, 0.24, 0.22, 0.0]                  # silence after each paragraph (s): 0.18-0.3
# Hook card on the first frame (also the cover): the hook sentence's contrast in <= 7 words, 2 lines, *one* amber word; subline = subject and date
HOOK = ["America is suing", "the *money* itself."]
HOOK_SUB = "Binance hack · 23 Nov 2026"
# Big number at 1.5-3 s: (value, what, when). Money first: lost / wiped out / liquidated / paid, in billions or trillions; a percentage only when it is huge
BIG = ("$6.3 BILLION", "crypto stolen from Binance\nin under four hours", "29 Oct 2026", "down")   # optional 4th: "down" (red, diving) or "up" (amber, climbing)
BIG_WORD = "billion"     # the word of sentence 1 that says the number (tts.sh checks it falls at 1.2-3 s)
import re
def plain(s): return re.sub(r"\[([^\]]+)\]\([^)]*\)", r"\1", s)
if __name__ == "__main__":
    print(sum(len(plain(s).split()) for s, _ in S), "words")
