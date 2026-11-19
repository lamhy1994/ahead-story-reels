# The Genius Who Bought the Top  (Isaac Newton and the South Sea Bubble, London, 1720)
# Each sentence: (spoken text for the voice, keywords shown in an amber box in the captions)
# Paragraphs are synthesized together so that every sentence start is articulated clearly.
S = [
 ("In 1720, the man who explained gravity lost a fortune on one falling [stock](/stˈɒk/).", ["gravity", "falling"]),
 ("His name was Isaac Newton, master of Britain's Royal Mint.", ["Isaac", "Newton,", "Mint."]),
 ("That year, London went wild for the South Sea Company.", ["South", "Sea"]),
 ("In January, one share cost about 128 pounds.", ["128"]),
 ("Old records suggest Newton sold his shares in April, about twenty thousand pounds richer.", ["April,", "richer."]),
 ("Smart. But the price kept climbing.", ["climbing."]),
 ("A rising price makes people buy, and their buying pushes it higher.", ["buy,", "higher."]),
 ("An old story says Newton called it the madness of the people.", ["madness"]),
 ("By summer, one share cost about a thousand pounds.", ["thousand"]),
 ("And Newton? In June, he bought back in, close to the very top.", ["June,", "top."]),
 ("He kept buying, until almost all his money was in it.", ["all"]),
 ("Then, in September, the price fell, and fell.", ["September,", "fell."]),
 ("By December, a share cost 124 pounds, less than in January.", ["124", "less"]),
 ("Newton lost about ten thousand pounds, a third of all he had.", ["third"]),
 ("Years later, he wrote: I lost very much by the South Sea company.", ["very", "much"]),
 ("That is the story of the genius who bought the top. Even great minds can follow a crowd.", ["genius", "crowd."]),
 ("Legend in London says, comment apple, and a brilliant idea falls on your head. Just not a [stock](/stˈɒk/) tip.", ["APPLE,", "idea"]),
]
PARAS = [[0], [1, 2], [3, 4], [5, 6, 7], [8, 9, 10], [11, 12], [13, 14], [15], [16]]   # sentence indices spoken in one breath
PAUSE = [0.50, 0.50, 0.45, 0.50, 0.50, 0.50, 0.55, 0.60, 0.0]                          # silence after each paragraph (s)
import re
def plain(s): return re.sub(r"\[([^\]]+)\]\([^)]*\)", r"\1", s)
if __name__ == "__main__":
    print(sum(len(plain(s).split()) for s, _ in S), "words")
