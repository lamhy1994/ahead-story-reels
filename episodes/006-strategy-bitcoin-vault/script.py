# The Bitcoin Vault  (Strategy, the company that turned its cash into bitcoin: 850,849 BTC at an average cost of $75,452 (8-K, 16 Nov 2026),
# worth about $50 billion at $58,832 (CoinGecko, 21 Nov 2026); MSCI drops it from its indexes at the close of 30 Nov 2026 (final list 11 Nov 2026))
# Each sentence: (spoken text for the voice, keywords shown in an amber box in the captions)
# Paragraphs are synthesized together so that every sentence start is articulated clearly.
S = [
 ("In November 2026, one company sat on a mountain of bitcoin, worth less than it paid.", ["mountain", "less"]),
 ("Its name is Strategy.", ["Strategy."]),
 ("In 2020, its boss, Michael Saylor, said bitcoin can be superior to cash.", ["Saylor,", "cash."]),
 ("So it swapped $250 million of cash for bitcoin.", ["$250", "million"]),
 ("It kept buying, with money from new shares and loans.", ["shares", "loans."]),
 ("On average, it paid about $75,000 per coin.", ["$75,000"]),
 ("Then bitcoin fell, below $60,000.", ["fell,", "$60,000."]),
 ("Picture one coin, bought for $75,000, now worth $59,000.", ["$75,000,", "$59,000."]),
 ("That's $16,000 down, but only on paper, unless it's sold.", ["paper,", "sold."]),
 ("The whole vault: paid $64 billion, worth about $50 billion.", ["$64", "$50"]),
 ("Then, a second blow.", ["second"]),
 ("MSCI, whose lists index funds copy, says companies that mostly hold assets don't belong.", ["MSCI,", "assets"]),
 ("On November the thirtieth, Strategy is out, and those funds must sell its shares.", ["thirtieth,", "out,"]),
 ("The week the news came, it still bought 485 more coins.", ["485"]),
 ("The story isn't over yet.", ["over"]),
 ("That's the story of the bitcoin vault. The biggest pile still moves with the price.", ["vault.", "price."]),
 ("You decide. Would you have sold, or held? Comment: SELL, or HOLD.", ["SELL,", "HOLD."]),
]
PARAS = [[0], [1, 2], [3, 4], [5], [6], [7, 8], [9], [10, 11], [12], [13], [14], [15], [16]]   # sentence indices spoken in one breath
PAUSE = [0.45, 0.42, 0.42, 0.40, 0.45, 0.42, 0.62, 0.42, 0.55, 0.42, 0.50, 0.50, 0.0]          # silence after each paragraph (s)
import re
def plain(s): return re.sub(r"\[([^\]]+)\]\([^)]*\)", r"\1", s)
if __name__ == "__main__":
    print(sum(len(plain(s).split()) for s, _ in S), "words")
