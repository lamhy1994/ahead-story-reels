# The Bitcoin Dominoes  (bitcoin's November 2026 slide: about $2 billion of crypto bets closed by force in one day, 14-15 Nov; below $60,000 on 20 Nov, first time since July)
# Each sentence: (spoken text for the voice, keywords shown in an amber box in the captions)
# Paragraphs are synthesized together so that every sentence start is articulated clearly.
S = [
 ("In November 2026, about $2 billion of crypto bets were closed in a single day, and their owners never pressed a button.", ["billion", "button."]),
 ("In early October, one bitcoin cost about $85,000.", ["$85,000."]),
 ("Many traders were betting it would keep rising, with borrowed money.", ["rising,", "borrowed"]),
 ("Picture one of them, with $100.", ["$100."]),
 ("She borrows $900, and buys $1,000 of bitcoin.", ["$900,", "$1,000"]),
 ("If the price falls 10%, her $100 is gone.", ["10%,", "gone."]),
 ("So the lender sells her bitcoin for her, automatically.", ["sells", "automatically."]),
 ("That sale pushes the price lower, so the next bet is closed too.", ["lower,", "next"]),
 ("Like dominoes.", ["dominoes."]),
 ("In November, A.I. stocks slid, and billions left bitcoin funds.", ["A.I.", "billions"]),
 ("On the weekend of November the fourteenth, the dominoes fell.", ["weekend", "fell."]),
 ("Bitcoin sank to about $62,000, its lowest since July.", ["$62,000,", "July."]),
 ("On Friday, November the twentieth, it fell below $60,000.", ["below", "$60,000."]),
 ("Nearly 30% down in a month.", ["30%"]),
 ("People who bought without borrowing still had every coin, just worth less.", ["without", "less."]),
 ("The story isn't over yet.", ["over"]),
 ("That's the story of the bitcoin dominoes. Borrowed bets fall first.", ["dominoes.", "first."]),
 ("You decide. Would you have sold, or held? Comment: SELL, or HOLD.", ["SELL,", "HOLD."]),
]
PARAS = [[0], [1, 2], [3, 4, 5], [6, 7, 8], [9], [10, 11], [12, 13], [14, 15], [16], [17]]   # sentence indices spoken in one breath
PAUSE = [0.45, 0.42, 0.42, 0.50, 0.40, 0.42, 0.45, 0.50, 0.50, 0.0]                         # silence after each paragraph (s)
import re
def plain(s): return re.sub(r"\[([^\]]+)\]\([^)]*\)", r"\1", s)
if __name__ == "__main__":
    print(sum(len(plain(s).split()) for s, _ in S), "words")
