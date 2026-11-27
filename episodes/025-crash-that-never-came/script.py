# The Crash That Never Came  (Carl Icahn's fortune, 2021 - Nov 2026)
# Forbes data via the New York Post (25 Nov 2026), The Mirror (26 Nov), news.com.au, Times of India: from $24.6bn in 2021 to about $1.7bn,
# about 93%, about $23bn gone, the lowest since 1997, while US stock indexes rose. Bloomberg Billionaires Index (24 Nov 2026, via Longbridge,
# briefs.co, Yahoo Finance, Celebrity Net Worth, 24/7 Wall St.): $1.2bn on Fri 20 Nov (lowest since it began tracking him in 2012), $1.3bn on
# Mon 23 Nov, down about $21bn in five years; all his IEP units pledged for about $1.3bn of personal loans; Icahn, 90, would not comment.
# Bets on a crash: a Financial Times analysis (May 2023, via Fortune 19 May 2023, Business Insider, NZ Herald): almost $9bn lost on the bearish
# hedges of Icahn Enterprises' portfolio (about $1.8bn in 2017, about $7bn from 2018 to Q1 2023); he "believed the market was in for great
# trouble" and "Maybe I made the mistake of not adhering to my own advice".
# Hindenburg Research, 2 May 2023: a "ponzi-like" structure (an allegation; Icahn: "self-serving"); IEP fell 20% that day and by more than half
# within weeks (Fortune/Bloomberg 2 May and 10 Jul 2023, Benzinga Aug 2023). SEC, 19 Aug 2024: Icahn pledged about 51-82% of IEP's securities
# to secure personal margin loans "worth billions of dollars" (settled without admitting or denying; NBC News).
# 2026: Icahn's Investment Funds down 43.8% in the first nine months (IEP Q3 report via Institutional Investor, NY Post); IEP units $7.55 at
# end-2025, $2.57 on 25 Nov 2026 (24/7 Wall St.; Bloomberg via Longbridge: down 64% this year); IEP's 10-Q (4 Nov 2026): "no assurance" it can
# refinance about $1.4bn of 2027 notes due May 2027 "on acceptable terms or at all" (24/7 Wall St., Bloomberg via briefs.co, NY Post).
# Each sentence: (spoken text for the voice, keywords shown in an amber box in the captions)
# Paragraphs are synthesized together so that every sentence start is articulated clearly.
S = [
 ("He lost about 23 billion dollars, while the market went up.", ["billion", "up."]),
 ("Carl [Icahn](/ˈIkɑn/) was one of Wall Street's most feared investors.", ["Icahn", "feared"]),
 ("Now he's barely a billionaire.", ["barely", "billionaire."]),
 ("So how does a legend lose nine of every ten dollars?", ["nine", "ten"]),
 ("He was sure a crash was coming, so his funds bet against the market.", ["crash", "against"]),
 ("It kept rising, and those bets cost about 9 billion dollars by 2023.", ["rising,", "billion"]),
 ("Then a short seller called his company's payouts Ponzi-like.", ["short", "Ponzi-like."]),
 ("He called it self-serving, but the shares halved.", ["self-serving,", "halved."]),
 ("Almost all his money sat in those shares, with billions borrowed against them.", ["Almost", "borrowed"]),
 ("This year his bets lost again, and the shares fell about two-thirds.", ["again,", "two-thirds."]),
 ("Now his company warns it may not refinance 1.4 billion dollars due in May.", ["refinance", "May."]),
 ("He's 90, and the story isn't over yet.", ["90,", "yet."]),
 ("The story of a crash that never came: being sure isn't being right.", ["never", "right."]),
 ("Would you ever bet against the whole market? Comment YES, or NO.", ["YES,", "NO."]),
]
PARAS = [[0], [1, 2, 3], [4, 5], [6, 7, 8], [9, 10, 11], [12], [13]]     # sentence indices spoken in one breath
PAUSE = [0.20, 0.24, 0.22, 0.24, 0.24, 0.22, 0.0]                        # silence after each paragraph (s): 0.18-0.3
# Hook card on the first frame (also the cover): the contrast in <= 7 words, 2 lines, *one* amber word; subline = subject and date
HOOK = ["Bet on a crash.", "Stocks went *up*."]
HOOK_SUB = "Carl Icahn · 2021–2026"
# Big number at 1.5-3 s: (value, what, when). Money first: lost / wiped out / liquidated / paid, in billions or trillions; a percentage only when it is huge
BIG = ("−$23 BILLION", "Carl Icahn's fortune lost\nsince 2021 (Forbes data)", "Bloomberg: −$21B in 5 years · as of 25 Nov 2026", "down")   # optional 4th: "down" (red, diving) or "up" (amber, climbing)
BIG_WORD = "billion"     # the word of sentence 1 that says the number (tts.sh checks it falls at 1.2-3 s)
import re
def plain(s): return re.sub(r"\[([^\]]+)\]\([^)]*\)", r"\1", s)
if __name__ == "__main__":
    print(sum(len(plain(s).split()) for s, _ in S), "words")
