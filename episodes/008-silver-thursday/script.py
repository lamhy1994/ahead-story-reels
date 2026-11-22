# Silver Thursday  (silver's 30 Jan 2026 crash, its sharpest one-day fall since March 1980, and the story of March 1980:
# the Hunt brothers' silver, bought largely with borrowed money, the exchange's "liquidation only" rule, the margin calls and
# Silver Thursday, 27 Mar 1980; then 2026: a new record of about $121 in January, a crash, about $41 as of 20 Nov 2026)
# Each sentence: (spoken text for the voice, keywords shown in an amber box in the captions)
# Paragraphs are synthesized together so that every sentence start is articulated clearly.
S = [
 ("In January 2026, silver crashed almost a third in one day.", ["silver", "third"]),
 ("Its worst fall since 1980, when two brothers tried to corner it.", ["1980,", "brothers"]),
 ("Meet Bunker and Herbert Hunt, billionaire sons of a Texas oilman.", ["Bunker", "Herbert", "Texas"]),
 ("Afraid paper money would lose value, they bought silver.", ["paper", "silver."]),
 ("Mountains of it, much with borrowed money.", ["Mountains", "borrowed"]),
 ("In early 1979, an ounce cost about $6.", ["1979,", "$6."]),
 ("By January 1980, about $50.", ["$50."]),
 ("Then the exchange changed its rules: no new buying, only selling.", ["rules:", "selling."]),
 ("The price began to slide.", ["slide."]),
 ("With $10 of your own and $90 borrowed, a ten percent fall wipes out your ten.", ["$10", "$90", "wipes"]),
 ("The lender wants more cash: a margin call.", ["cash:", "margin", "call."]),
 ("On Thursday, March twenty-seventh, the brothers couldn't pay.", ["Thursday,", "couldn't"]),
 ("Their silver was sold. The price hit ten dollars eighty.", ["ten", "dollars", "eighty."]),
 ("They called it Silver Thursday.", ["Silver", "Thursday."]),
 ("They lost about $1.7 billion, and later went bankrupt.", ["$1.7", "bankrupt."]),
 ("Forty-six years later, it rhymed: a January record, lots of borrowed money, then a crash.", ["rhymed:", "January", "crash."]),
 ("As of November twentieth, it's about $41.", ["$41."]),
 ("The story isn't over yet.", ["over"]),
 ("The story of Silver Thursday: borrowed money makes falls faster.", ["Thursday:", "faster."]),
 ("Would you have sold, or held? Comment: SELL, or HOLD.", ["SELL,", "HOLD."]),
]
PARAS = [[0, 1], [2], [3, 4], [5, 6], [7, 8], [9, 10], [11, 12, 13], [14], [15], [16], [17], [18], [19]]   # sentence indices spoken in one breath
PAUSE = [0.36, 0.32, 0.36, 0.34, 0.38, 0.38, 0.40, 0.36, 0.32, 0.42, 0.40, 0.36, 0.0]                              # silence after each paragraph (s)
import re
def plain(s): return re.sub(r"\[([^\]]+)\]\([^)]*\)", r"\1", s)
if __name__ == "__main__":
    print(sum(len(plain(s).split()) for s, _ in S), "words")
