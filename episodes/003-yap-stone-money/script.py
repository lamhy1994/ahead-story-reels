# The Island of Stone Money  (Yap, Caroline Islands; W. H. Furness's visit, 1903)
# Each sentence: (spoken text for the voice, keywords shown in an amber box in the captions)
# Paragraphs are synthesized together so that every sentence start is articulated clearly.
S = [
 ("In 1903, a doctor heard of a family who were rich, though their money lay at the bottom of the sea.", ["rich,", "bottom"]),
 ("He was William Furness, and the island was Yap.", ["William", "Furness,", "Yap."]),
 ("Big payments were made in stone wheels, up to twelve feet wide.", ["stone", "twelve"]),
 ("They came from Palau, by canoe and raft.", ["Palau,", "raft."]),
 ("Pay for a canoe with a stone, and the stone might never move. Everyone just remembers the new owner.", ["canoe", "remembers"]),
 ("A friend told him of one family's great stone.", ["family's", "great"]),
 ("Long ago, on the voyage home from Palau, a storm hit the raft.", ["storm"]),
 ("To save their lives, the crew cut the raft loose, and the stone sank.", ["cut", "sank."]),
 ("Back home, they swore it was magnificent, and the island agreed it still counted.", ["swore", "counted."]),
 ("So the family stayed rich, for generations.", ["rich,"]),
 ("Then came German rule, and the chiefs ignored orders to fix the paths.", ["German", "paths."]),
 ("So, the doctor wrote, officials made them pay with paint: black crosses on the finest stones.", ["black", "crosses"]),
 ("Suddenly poor, the people fixed the paths.", ["poor,"]),
 ("Then the crosses were wiped away, and everyone was rich again.", ["wiped", "rich"]),
 ("That is the story of the island of stone money. Money is what we all agree on.", ["stone", "agree"]),
 ("Old sailors say, comment the word stone, and something you lost comes home. Just not twelve feet wide.", ["STONE,", "home."]),
]
PARAS = [[0], [1, 2, 3], [4], [5, 6, 7], [8, 9], [10, 11], [12, 13], [14], [15]]   # sentence indices spoken in one breath
PAUSE = [0.50, 0.55, 0.55, 0.50, 0.60, 0.45, 0.60, 0.60, 0.0]                      # silence after each paragraph (s)
import re
def plain(s): return re.sub(r"\[([^\]]+)\]\([^)]*\)", r"\1", s)
if __name__ == "__main__":
    print(sum(len(plain(s).split()) for s, _ in S), "words")
