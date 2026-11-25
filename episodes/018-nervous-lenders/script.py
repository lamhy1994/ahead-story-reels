# The Nervous Lenders  (AI-related borrowing reached about $466 billion in Jan-Sep 2026, more than four times the $101 billion of the same
# months of 2025: Morgan Stanley data, reported by the FT (via Coinpaper, Disruption Banking) and IO Fund. A credit default swap (CDS) is
# insurance on a loan: the buyer pays a yearly fee (the spread, per $100 insured) and is paid if the borrower defaults (Reuters, TNW).
# Mon 23 Nov 2026: Nvidia's board reinstates Jensen Huang; Nvidia closes up 31.5% (episode 13 sources; CNBC "more than 31%").
# Tue 24 Nov (US): five-year CDS spreads at Oracle, Alphabet, SpaceX and CoreWeave hit records (Reuters, S&P Global Market Intelligence):
# Oracle 356 bps, "$3.56 to insure $100 worth of Oracle debt" (Reuters; CNBC 355.68); CoreWeave 1,314 bps (Reuters; FactSet 1,332 via
# ROIC; CNBC "more than 1,200"); CoreWeave's 9.75% 2031 bond yields over 17% (CNBC via TNW, ROIC) after falling to 76.6 cents (Bloomberg).
# Microsoft, Amazon, Meta and Alphabet are on track to spend more on capital projects than their businesses generate in cash in 2026 and
# 2027 (Man Group via CNBC, 25 Nov); Meta's Q3 capex $34.91bn > $32.79bn operating cash flow, Amazon -$42.4bn free cash flow over 12
# months, Oracle FY2026 capex $55.7bn vs $32.0bn cash from operations (TIKR via Yahoo Finance, 24 Nov).)
# Each sentence: (spoken text for the voice, keywords shown in an amber box in the captions)
# Paragraphs are synthesized together so that every sentence start is articulated clearly.
S = [
 ("Tech companies borrowed 466 billion dollars for AI this year, and lenders are nervous.", ["466", "billion", "nervous."]),
 ("That's more than four times last year.", ["four", "times"]),
 ("So how do you spot a nervous lender?", ["nervous", "lender?"]),
 ("Watch the price of insurance.", ["insurance."]),
 ("Say you lend a friend 100 dollars.", ["lend", "100"]),
 ("For a small yearly fee, someone will pay you if he can't.", ["fee,", "pay"]),
 ("The more people doubt him, the higher that fee.", ["doubt", "higher"]),
 ("This week, that fee hit a record for Oracle: about three and a half dollars.", ["record", "Oracle:"]),
 ("For [CoreWeave](/kˈɔɹwˌiv/), which rents out AI chips, it's about 13 dollars.", ["CoreWeave,", "13"]),
 ("Why? Some giants now spend more building than their business brings in.", ["spend", "brings"]),
 ("So they borrow, and [CoreWeave's](/kˈɔɹwˌivz/) bond buyers want over 17 percent a year.", ["borrow,", "17"]),
 ("The twist? It came a day after Nvidia's [stock](/stˈɒk/) jumped a third.", ["twist?", "third."]),
 ("[Stocks](/stˈɒks/) cheered. Lenders didn't.", ["cheered.", "didn't."]),
 ("The story isn't over yet.", ["over"]),
 ("The story of the nervous lenders: [stocks](/stˈɒks/) can bounce while lenders worry.", ["bounce", "worry."]),
 ("Would you lend them your money? Comment LEND, or PASS.", ["LEND,", "PASS."]),
]
PARAS = [[0], [1, 2, 3], [4, 5, 6], [7, 8], [9, 10], [11, 12, 13], [14], [15]]   # sentence indices spoken in one breath
PAUSE = [0.20, 0.24, 0.24, 0.22, 0.22, 0.24, 0.22, 0.0]                         # silence after each paragraph (s): 0.18-0.3
# Hook card on the first frame (also the cover): the contrast in <= 7 words, 2 lines, *one* amber word; subline = subject and date
HOOK = ["Stocks cheered.", "Lenders *didn't*."]
HOOK_SUB = "AI debt · Nov 2026"
# Big number at 1.5-3 s: (value, what, when). Money first: lost / wiped out / liquidated / paid, in billions or trillions; a percentage only when it is huge
BIG = ("$466 BILLION", "borrowed for AI\nJan–Sep 2026", "Morgan Stanley data, via the FT", "up")   # optional 4th: "down" (red, diving) or "up" (amber, climbing)
BIG_WORD = "466"         # the word of sentence 1 that says the number (tts.sh checks it falls at 1.2-3 s)
import re
def plain(s): return re.sub(r"\[([^\]]+)\]\([^)]*\)", r"\1", s)
if __name__ == "__main__":
    print(sum(len(plain(s).split()) for s, _ in S), "words")
