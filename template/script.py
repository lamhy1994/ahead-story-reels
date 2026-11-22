# The King With Too Much Gold  (Mansa Musa, Cairo, 1324)
# Each sentence: (spoken text for the voice, keywords shown in an amber box in the captions)
# Paragraphs are synthesized together so that every sentence start is articulated clearly.
S = [
 ("A king gave away so much gold, gold got cheaper.", ["gold", "cheaper."]),
 ("His name was [Mansa](/mˈɑnsə/) [Musa](/mˈusə/), king of Mali. People still call him the richest man in history.", ["Mansa", "Musa,", "richest"]),
 ("In 1324, he crossed the Sahara on a pilgrimage to Mecca, and his caravan carried gold.", ["Sahara", "gold."]),
 ("In July, he camped three days by the pyramids, then entered Cairo.", ["pyramids,", "Cairo."]),
 ("He stayed three months, and he was generous. He gave gold freely. He spent gold in the markets. And every official at court received a whole load of it.", ["generous.", "load"]),
 ("But when a city fills with gold, each piece buys a little less.", ["less."]),
 ("One writer in Cairo said the price of gold fell by more than a tenth, and twelve years later it still had not recovered.", ["tenth,", "twelve"]),
 ("And the king? On the way home, his own gold ran out.", ["ran", "out."]),
 ("He borrowed from Cairo's merchants at high interest, and some old accounts say they were never fully repaid.", ["borrowed", "interest,", "never"]),
 ("That is the story of the king with too much gold. Even gold is worth less when there is too much of it.", ["too", "much"]),
 ("Legend in Cairo says, comment gold, and someone close to you gets rich this year. Just not too rich.", ["GOLD,", "rich"]),
]
PARAS = [[0], [1, 2], [3, 4], [5, 6], [7, 8], [9], [10]]          # sentence indices spoken in one breath
PAUSE = [0.20, 0.22, 0.22, 0.22, 0.22, 0.24, 0.0]                 # silence after each paragraph (s): 0.18-0.3
# Hook card on the first frame (also the cover): the hook sentence's contrast in <= 7 words, 2 lines, *one* amber word; subline = subject and date
HOOK = ["He gave away gold.", "Gold got *cheaper*."]
HOOK_SUB = "Cairo · 1324 · a true story"
# Big number at 1.5-3 s: (value, what, when). Money first: lost / wiped out / liquidated / paid, in billions or trillions; a percentage only when it is huge
BIG = ("12 YEARS", "and gold in Cairo was still cheap", "al-Umari, c. 1337", "down")   # optional 4th: "down" (red, diving) or "up" (amber, climbing)
# BIG_WORD = "trillion"     # the word of sentence 1 that says the number (tts.sh checks it falls at 1.2-3 s)
# LONG = "why this story needs more than 75 s"      # only when it really does (never over 120 s)
import re
def plain(s): return re.sub(r"\[([^\]]+)\]\([^)]*\)", r"\1", s)
if __name__ == "__main__":
    print(sum(len(plain(s).split()) for s, _ in S), "words")
