# The Slow Billions  (Warren Buffett's Thanksgiving 2026 gift: what happened, and the mechanism behind a fortune that big)
# Mon 16 Nov 2026: Buffett, 96, converted 6,150 Class A Berkshire Hathaway shares into 9,225,000 Class B shares and gave them to four family
# foundations: about $5.5 billion (CBS News, AP via US News, CNBC, Yahoo Finance, CEOWORLD; Fortune: $5.4 billion at its price), about four times
# his Thanksgiving 2025 gift (CBS News; Yahoo Finance: "more than four times"; CNBC: "quadruples"). He still holds 182,140 A and 1,162 B shares,
# more than $160 billion (Fortune, Yahoo Finance, CEOWORLD; CBS: $162 billion), which his July 2026 plan sends to the four foundations by
# 31 Dec 2034 (Fortune; Yahoo Finance; CEOWORLD). His letter: kindness "compounds, and at a better rate than anything Charlie and I ever bought"
# (Yahoo Finance, Fortune, CEOWORLD, CBS). First stock at 11 (Benzinga 2022, AARP, Entrepreneur). Berkshire keeps its profits (no dividend since
# 1967). Its per-share market value: 19.9% a year 1965-2024, overall gain 5,502,284% 1964-2024 (Berkshire's 2024 letter; ctol, Seeking Alpha):
# $1,000 -> about $55.0 million. 19.9% a year doubles in about 3.8 years on average, so each later doubling adds more than all earlier ones.
# Each sentence: (spoken text for the voice, keywords shown in an amber box in the captions)
# Paragraphs are synthesized together so that every sentence start is articulated clearly.
S = [
 ("He gave away five and a half billion dollars, and that's the small part.", ["billion", "small"]),
 ("More than 160 billion dollars is set to follow by 2034.", ["160", "2034."]),
 ("So how does one person end up with that much to give?", ["how", "give?"]),
 ("Warren [Buffett](/bˈʌfɪt/) bought his first stock at 11, and he's 96 now.", ["11,", "96"]),
 ("His company kept its profits and used them to earn more, year after year.", ["kept", "more,"]),
 ("A thousand dollars put in when he took charge grew to about 55 million.", ["thousand", "55", "million."]),
 ("That's compounding: growth on top of growth.", ["compounding:", "growth."]),
 ("On average it doubled about every four years, so the biggest gains came last.", ["doubled", "last."]),
 ("And now he's giving it all away.", ["giving", "away."]),
 ("His Thanksgiving letter says kindness compounds too, faster than anything he ever bought.", ["kindness", "compounds"]),
 ("The story isn't over yet.", ["over"]),
 ("The story of [Buffett's](/bˈʌfɪts/) billions: time did the heavy lifting.", ["time", "lifting."]),
 ("If it were yours, would you give it, or keep it? Comment: GIVE, or KEEP.", ["GIVE,", "KEEP."]),
]
PARAS = [[0], [1, 2], [3, 4, 5], [6, 7], [8, 9, 10], [11], [12]]   # sentence indices spoken in one breath
PAUSE = [0.20, 0.24, 0.22, 0.24, 0.24, 0.22, 0.0]                  # silence after each paragraph (s): 0.18-0.3
# Hook card on the first frame (also the cover): the contrast in <= 7 words, 2 lines, *one* amber word; subline = subject and date
HOOK = ["$5.5 billion, given away.", "*$160B* to go."]
HOOK_SUB = "Warren Buffett · 16 Nov 2026"
# Big number at 1.5-3 s: (value, what, when). Money first: lost / wiped out / liquidated / paid, in billions or trillions; a percentage only when it is huge
BIG = ("$5.5 BILLION", "given away by Warren Buffett\nfor Thanksgiving", "16 Nov 2026", "up")   # optional 4th: "down" (red, diving) or "up" (amber, climbing)
BIG_WORD = "billion"     # the word of sentence 1 that says the number (tts.sh checks it falls at 1.2-3 s)
import re
def plain(s): return re.sub(r"\[([^\]]+)\]\([^)]*\)", r"\1", s)
if __name__ == "__main__":
    print(sum(len(plain(s).split()) for s, _ in S), "words")
