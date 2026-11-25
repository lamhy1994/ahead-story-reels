# The 25-Year Wait  (the November 2026 AI stock sell-off, compared with Cisco in the dot-com crash)
# Cisco, which sold the routers and switches the internet ran on, became the world's most valuable company on Mon 27 Mar 2000: $555.5bn
# at the close vs Microsoft's $541.6bn (AP via Deseret News; Reuters 24 Mar 2000: it had briefly topped Microsoft intraday; Cisco's own
# history page: $569B at the 27 Mar high). Its price was about 200 times the profit it earned that year (AJ Bell 2025: "more than 200 times
# the net income"; Wccftech 2024: P/E 201). It then lost roughly $400 billion of market value by Sep 2002 (CNN Money, Lashinsky; Fortune 2010:
# $425bn from its $557bn peak) and almost 90% of its share price by Oct 2002 (Sherwood, Yahoo Finance; low $8.12, Crossing Wall Street).
# Its sales kept growing (about $19bn in fiscal 2002: CNN Money, Wccftech; $56.7bn in fiscal 2025: Cisco), but its stock only closed back
# above its 27 Mar 2000 record close of $80.06 on Wed 10 Dec 2025, more than 25 years later (Bloomberg, Sherwood, MarketBeat via Nasdaq).
# Nvidia: record close $239.24 on 6 Oct 2026; $149.30 on Wed 25 Nov 2026 (Yahoo Finance, Motley Fool), 37.6% lower.
# Each sentence: (spoken text for the voice, keywords shown in an amber box in the captions)
# Paragraphs are synthesized together so that every sentence start is articulated clearly.
S = [
 ("The world's biggest company lost 400 billion dollars, and the internet still won.", ["400", "billion", "won."]),
 ("Now AI [stocks](/stˈɒks/) have lost trillions, and people ask: is this 2000 again?", ["trillions,", "2000"]),
 ("So how does a winner lose?", ["winner", "lose?"]),
 ("In March 2000, Cisco sold the boxes that ran the internet.", ["Cisco", "boxes", "internet."]),
 ("Briefly, it was worth more than any company on Earth.", ["worth", "Earth."]),
 ("But buyers paid about 200 dollars for every dollar it earned in a year.", ["200", "every", "dollar"]),
 ("When the boom ended, it lost almost 90 percent.", ["boom", "90", "percent."]),
 ("The twist? The internet kept growing, and so did Cisco's sales.", ["twist?", "growing,", "sales."]),
 ("But its [stock](/stˈɒk/) needed over 25 years to get back.", ["25", "years"]),
 ("Now Nvidia sells the chips that run AI.", ["Nvidia", "chips", "AI."]),
 ("As of this week, it's almost 40 percent below its October record.", ["40", "percent", "record."]),
 ("Some say this time is different.", ["different."]),
 ("The story isn't over yet.", ["over"]),
 ("The story of Cisco: you can be right about the future and still overpay.", ["right", "future", "overpay."]),
 ("Is AI the next dot-com? Comment YES, or NO.", ["YES,", "NO."]),
]
PARAS = [[0], [1, 2], [3, 4, 5, 6], [7, 8], [9, 10, 11, 12], [13], [14]]   # sentence indices spoken in one breath
PAUSE = [0.20, 0.24, 0.24, 0.24, 0.24, 0.22, 0.0]                         # silence after each paragraph (s): 0.18-0.3
# Hook card on the first frame (also the cover): the contrast in <= 7 words, 2 lines, *one* amber word; subline = subject and date
HOOK = ["The internet *won*.", "Its giant lost $400B."]
HOOK_SUB = "Cisco 2000 · AI 2026"
# Big number at 1.5-3 s: (value, what, when). Money first: lost / wiped out / liquidated / paid, in billions or trillions; a percentage only when it is huge
BIG = ("−$400 BILLION", "Cisco's stock market value lost\nMarch 2000 → 2002", "CNN Money · Fortune", "down")   # optional 4th: "down" (red, diving) or "up" (amber, climbing)
BIG_WORD = "400"         # the word of sentence 1 that says the number (tts.sh checks it falls at 1.2-3 s)
import re
def plain(s): return re.sub(r"\[([^\]]+)\]\([^)]*\)", r"\1", s)
if __name__ == "__main__":
    print(sum(len(plain(s).split()) for s, _ in S), "words")
