# The King With Too Much Gold  (Mansa Musa, Cairo, 1324): the worked example of format v3 (SKILL.md §3)
# Each sentence: (spoken text for the voice, keywords shown in an amber box in the captions)
# Paragraphs are synthesized together so that every sentence start is articulated clearly.

# The first 10 seconds come from the hook lab: `python3 ../../hooklab.py pick` prints these two lines for the next episode.
OPEN = {"words": "contrast", "text": "card", "picture": "place", "beat2": "dark", "lock": "lesson"}
CTA_ARM = "K"          # "K": comment a keyword, we reply with the cheat sheet. "O": the cheat sheet is our own comment + an open question.

CTA_K = ("Comment GOLD, and I'll reply with three questions to ask first.", ["GOLD,", "reply"])
CTA_O = ("The three questions to ask are in the comments. What's the rarest thing you ever bought?", ["comments.", "rarest"])
S = [
 ("A king gave away so much gold, gold got cheaper.", ["gold", "cheaper."]),                                                   # 1  hook
 ("His name was [Mansa](/mˈɑnsə/) [Musa](/mˈusə/), the richest man in history.", ["Mansa", "Musa,", "richest"]),              # 2  lock-in
 ("And what he did to Cairo can still happen to your money.", ["your", "money."]),                                            # 3  lock-in: what the viewer gets
 ("In 1324, he crossed the Sahara with a caravan of gold.", ["Sahara", "gold."]),                                              # 4  body 1: what happened
 ("In July, he camped three days by the pyramids, then entered Cairo.", ["pyramids,", "Cairo."]),
 ("He stayed three months, and he was generous. He gave gold freely, spent it in the markets, and sent every official a whole load.", ["generous.", "load."]),
 ("But when a city fills with gold, each piece buys a little less.", ["less."]),                                               # 7  surprise 1
 ("One writer in Cairo said the price of gold fell by more than a tenth.", ["tenth."]),
 ("But here's the part nobody expects.", ["nobody"]),                                                                          # 9  rehook
 ("Twelve years later, gold still had not recovered.", ["Twelve", "not"]),                                                     # 10 body 2: surprise 2
 ("And the king? On the way home, his own gold ran out.", ["ran", "out."]),
 ("He borrowed from Cairo's merchants at high interest, and some say they were never fully repaid.", ["borrowed", "interest,", "never"]),
 ("The lesson: when there's suddenly more of something, each piece is worth less. Even gold.", ["lesson:", "less."]),          # 13 the lesson
 ("So before you buy anything rare, ask how much more is coming.", ["ask", "more"]),                                           # 14 what the viewer can do with it (a check, never buy or sell)
 CTA_K if CTA_ARM == "K" else CTA_O,                                                                                           # 15 CTA
]
PARAS = [[0], [1, 2], [3, 4], [5], [6, 7], [8, 9], [10, 11], [12, 13], [14]]     # sentence indices spoken in one breath
PAUSE = [0.20, 0.22, 0.22, 0.22, 0.20, 0.22, 0.24, 0.22, 0.0]                    # silence after each paragraph (s): 0.18-0.3
# The parts of the script (0-based sentence indices, in order, every sentence in exactly one part). tts.sh prints when each part starts and checks them.
PARTS = {"hook": [0], "lock": [1, 2], "body1": [3, 4, 5, 6, 7], "rehook": [8], "body2": [9, 10, 11], "lesson": [12, 13], "cta": [14]}

# Hook card on the first frame (also the cover) when OPEN["text"] is "card": at most 7 words on 2 lines, *one* amber word. Leave HOOK out for "captions".
HOOK = ["He gave away gold.", "Gold got *cheaper*."]
HOOK_SUB = "Cairo · 1324 · a true story"       # subject and date: under the card, or as a small chip when there is no card
# Big number at 1.5-3 s when OPEN["beat2"] is "dark" or "world": (value, what, when, "down" red / "up" amber). Leave BIG out for "event".
# Money first: lost / wiped out / liquidated / paid, in billions or trillions; a percentage only when it is huge.
BIG = ("12 YEARS", "and gold in Cairo was still cheap", "al-Umari, c. 1337", "down")
# BIG_WORD = "trillion"     # the word of sentence 1 that says the number (tts.sh checks it falls at 1.2-3 s)

# The lesson card (shown while the lesson is spoken): 2 short lines, *one* amber word, 12 words at most; then the check the viewer can use.
LESSON = ["More of something,", "*less* for each piece."]
LESSON_USE = "Before you buy: how much more is coming?"
# The cheat sheet: what a commenter gets (arm K: our reply; arm O: our own first comment). Plain text, at most 700 characters, no links, no advice.
CTA = {"word": "GOLD", "get": "3 questions to ask first", "ask": "What's the rarest thing you ever bought?"}
SHEET = """3 questions to ask before you buy anything "rare":
1. How much of it exists today?
2. How much more can be made, and how fast?
3. Who holds a lot of it, and could sell all at once?
Mansa Musa's gold was real. There was just suddenly much more of it. (A story, not advice.)"""
# LONG = "why this story needs more than 75 s"      # only when it really does (never over 120 s)
import re
def plain(s): return re.sub(r"\[([^\]]+)\]\([^)]*\)", r"\1", s)
if __name__ == "__main__":
    print(sum(len(plain(s).split()) for s, _ in S), "words")
