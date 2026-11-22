# The Heavy End  (12 Nov 2026: Jensen Huang resigns, Nvidia closes ~4% lower while rival chip stocks rise, the S&P 500 still falls;
# why: the index is weighted by size, the top 10 carry ~40%, Nvidia the heaviest; then the slide to 19 Nov 2026, six losses in a row, ~8% below the October record)
# Each sentence: (spoken text for the voice, keywords shown in an amber box in the captions)
# Paragraphs are synthesized together so that every sentence start is articulated clearly.
S = [
 ("Nvidia's rivals went up. The whole market still went down.", ["rivals", "down."]),
 ("That day, Nvidia's boss, Jensen Huang, resigned, and its stock fell about 4%.", ["Huang,", "resigned,", "4%."]),
 ("So how can one stock drag down a market of 500?", ["one", "500?"]),
 ("Because the index counts companies by size, not one vote each.", ["size,", "vote"]),
 ("The ten biggest carry about 40% of its weight, and the heaviest was Nvidia.", ["ten", "40%", "Nvidia."]),
 ("Picture a market of two companies: a giant worth nine coins, and a small one worth one.", ["two", "nine", "one."]),
 ("The small one doubles. The giant loses a fifth. The market still falls.", ["doubles.", "fifth.", "falls."]),
 ("And the giants kept slipping. By November the nineteenth, the index had fallen six days in a row.", ["slipping.", "six"]),
 ("Its longest losing streak in two and a half years, about 8% below its October record.", ["longest", "8%"]),
 ("The story isn't over yet.", ["over"]),
 ("The story of the heavy end: buy the index, and four of every ten dollars go to ten giants.", ["heavy", "four", "giants."]),
 ("Would you have sold, or held? Comment: SELL, or HOLD.", ["SELL,", "HOLD."]),
]
PARAS = [[0], [1, 2], [3, 4], [5, 6], [7, 8, 9], [10], [11]]      # sentence indices spoken in one breath
PAUSE = [0.20, 0.22, 0.24, 0.24, 0.26, 0.24, 0.0]                # silence after each paragraph (s): 0.18-0.3
# Hook card on the first frame (also the cover): the hook sentence's contrast in <= 7 words, 2 lines, *one* amber word; subline = subject and date
HOOK = ["Nvidia's rivals rose.", "The market *fell*."]
HOOK_SUB = "S&P 500 · 12 Nov 2026"
import re
def plain(s): return re.sub(r"\[([^\]]+)\]\([^)]*\)", r"\1", s)
if __name__ == "__main__":
    print(sum(len(plain(s).split()) for s, _ in S), "words")
