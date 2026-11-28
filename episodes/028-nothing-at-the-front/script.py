# Nothing at the Front  (episode 28, turn format, SKILL.md §0: something odd from ordinary life -> a jump to trading -> the logic that joins them -> an ending that is felt)
# Mechanism both halves share: feedback. Every reaction is a little bigger than its cause, so a tap on the brakes (or a small dip) grows into a jam
# (or a drop) that nobody started on purpose and no news explains. A driver brakes because the car ahead braked; you sell because the price ahead fell.
# Each sentence: (spoken text for the voice, keywords shown in an amber box in the captions)

# `python3 ../../hooklab.py pick` printed FORMAT, OPEN and CTA_ARM for episode 28.
FORMAT = "turn"        # no CTA: the video ends on its last line (CTA_ARM "N"); the last card carries the closing line
OPEN = {"words": "you", "text": "captions", "picture": "action", "beat2": "event", "lock": "turn"}
CTA_ARM = "N"

S = [
 ("You crawl through a traffic jam, and at the front, there's nothing.", ["jam,", "front,", "nothing."]),            # 1  hook: the odd thing everybody has met, said to you
 ("You make the same jam when you trade.", ["same", "trade."]),                                                     # 2  the turn: a jump to trading that makes no sense yet
 ("Here's why.", ["why."]),                                                                                         # 3
 ("In one test, twenty-two drivers tried to circle a track at one speed.", ["twenty-two", "one"]),                  # 4  the reason behind the odd thing, with its number (Sugiyama et al. 2008)
 ("Nothing blocked the track. A jam appeared anyway.", ["Nothing", "anyway."]),                                     # 5
 ("Each driver brakes a little harder than the one ahead.", ["harder", "ahead."]),                                  # 6  the mechanism: every reaction a little bigger than its cause
 ("And the same happens to prices.", ["same", "prices."]),                                                          # 7  the same mechanism in trading, one step a sentence
 ("A dip makes you sell. Your sale makes it dip more.", ["dip", "sell.", "more."]),                                 # 8
 ("But a drop that big feels like somebody knows something.", ["drop", "knows"]),                                   # 9  rehook: the thing that feels like proof and is not
 ("Often, nobody does. Many of the market's fifty biggest days had no big news.", ["nobody", "fifty", "news."]),     # 10 the number that teaches (Cutler, Poterba and Summers 1989)
 ("You'd sit twenty minutes in a jam nobody caused. But twenty minutes of red, and you're sure someone knows.", ["minutes", "red,", "knows."]),   # 11 the ending: the same number on both sides
 ("Maybe nobody knew more than you. Maybe everyone was just braking.", ["nobody", "braking."]),                     # 12 the line that is felt
]
PARAS = [[0], [1], [2, 3], [4, 5], [6, 7], [8, 9], [10], [11]]       # sentence indices spoken in one breath
PAUSE = [0.22, 0.30, 0.24, 0.26, 0.26, 0.30, 0.45, 0.0]              # silence after each paragraph (s); longer before the last line
TAIL = 2.9                                                           # seconds held after the last word: the last card needs time to be read
PARTS = {"hook": [0], "lock": [1, 2], "body1": [3, 4, 5, 6, 7], "rehook": [8], "body2": [9], "lesson": [10, 11]}

# OPEN text = captions: no headline box. The first sentence shows as captions from frame 0; HOOK_SUB is the small chip under them.
HOOK_SUB = "the phantom-jam problem"

# The last card: the closing line, then the check the viewer can use. Never buy, sell or hold.
LESSON_LABEL = "Maybe"
LESSON = ["Nobody knew more than you.", "Everyone was just *braking*."]
LESSON_USE = "Before you sell: is there news, or only the drop?"

import re
def plain(s): return re.sub(r"\[([^\]]+)\]\([^)]*\)", r"\1", s)
if __name__ == "__main__":
    print(sum(len(plain(s).split()) for s, _ in S), "words")
