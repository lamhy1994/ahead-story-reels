# Bitcoin's Front Door  (US spot bitcoin ETFs, the funds that let people buy bitcoin like a stock, lose about $3.6 billion in November 2026
# through 20 Nov (Farside data); BlackRock's IBIT has its biggest one-day outflow ever, $541.1 million, on Thu 19 Nov. Their average buyer
# paid more than $80,000 a coin. Sat 21 Nov 2026: bitcoin falls to about $55,250, its lowest in two years (Reuters); by Mon 23 Nov it is
# back above $61,000 (CoinDesk, CoinGecko). The story isn't over yet.)
# Each sentence: (spoken text for the voice, keywords shown in an amber box in the captions)
# Paragraphs are synthesized together so that every sentence start is articulated clearly.
S = [
 ("Investors have pulled 3.6 billion dollars out of bitcoin's easiest front door.", ["billion", "door."]),
 ("And on Saturday, bitcoin fell to about $55,000, its lowest in two years.", ["$55,000,", "two"]),
 ("So who is walking out, and why now?", ["who", "now?"]),
 ("The front door is a bitcoin fund: a share you buy like any stock.", ["fund:", "stock."]),
 ("Behind it, the fund keeps real bitcoin locked in a vault.", ["real", "vault."]),
 ("When more people sell than buy, bitcoin leaves the vault, and often gets sold.", ["sell", "sold."]),
 ("On Thursday, BlackRock's fund saw its biggest one-day exit ever: over half a billion dollars.", ["biggest", "billion"]),
 ("Here's the pain: the average fund buyer paid more than $80,000 a coin.", ["pain:", "$80,000"]),
 ("So at today's price, that buyer is losing money.", ["losing"]),
 ("By Monday, bitcoin was back above $61,000. The story isn't over yet.", ["$61,000.", "over"]),
 ("The story of bitcoin's front door: it opens both ways.", ["door:", "both"]),
 ("Would you sell now, or hold? Comment SELL, or HOLD.", ["SELL,", "HOLD."]),
]
PARAS = [[0], [1, 2], [3, 4], [5], [6], [7, 8], [9], [10], [11]]   # sentence indices spoken in one breath
PAUSE = [0.22, 0.24, 0.22, 0.22, 0.24, 0.24, 0.24, 0.22, 0.0]      # silence after each paragraph (s): 0.18-0.3
# Hook card on the first frame (also the cover): the contrast in <= 7 words, 2 lines, *one* amber word; subline = subject and date
HOOK = ["They piled in.", "Now they're *leaving*."]
HOOK_SUB = "Bitcoin funds · Nov 2026"
# Big number at 1.5-3 s: (value, what, when). Money first: lost / wiped out / liquidated / paid, in billions or trillions; a percentage only when it is huge
BIG = ("−$3.6 BILLION", "pulled out of US bitcoin funds\nin November", "as of 20 Nov 2026", "down")   # optional 4th: "down" (red, diving) or "up" (amber, climbing)
BIG_WORD = "billion"     # the word of sentence 1 that says the number (tts.sh checks it falls at 1.2-3 s)
import re
def plain(s): return re.sub(r"\[([^\]]+)\]\([^)]*\)", r"\1", s)
if __name__ == "__main__":
    print(sum(len(plain(s).split()) for s, _ in S), "words")
