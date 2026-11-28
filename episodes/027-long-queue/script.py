# The Long Queue  (episode 27, turn format, SKILL.md §0: something odd from ordinary life -> a jump to trading -> the logic that joins them -> an ending that is felt)
# Mechanism both halves share: copying looks like information (an information cascade). Every choice you can see counts as a vote, so after two people
# the next one follows the queue instead of her own hunch, and a hundred people can carry the opinion of one. A queue and a rising price are both made of choices you can see.
# Each sentence: (spoken text for the voice, keywords shown in an amber box in the captions)

# `python3 ../../hooklab.py pick` printed FORMAT, OPEN and CTA_ARM for episode 27.
FORMAT = "turn"        # no CTA: the video ends on its last line (CTA_ARM "N"); the last card carries the closing line
OPEN = {"words": "question", "text": "banner", "picture": "object", "beat2": "event", "lock": "turn"}
CTA_ARM = "N"

S = [
 ("Why do you join the long queue, when next door is empty?", ["queue,", "empty?"]),                                   # 1  hook: the odd thing everybody has done (a question, said to you)
 ("You pick your trades the same way.", ["trades", "same"]),                                                            # 2  the turn: a jump to trading that makes no sense yet
 ("Here's why.", ["why."]),                                                                                             # 3
 ("A queue looks like people who know something.", ["queue", "know"]),                                                  # 4  the reason behind the odd thing ...
 ("But once two people go in, the next person ignores their own hunch.", ["two", "ignores", "hunch."]),                 # 5  ... with its number (Bikhchandani, Hirshleifer and Welch 1992)
 ("A rising price is a queue. Every buyer looks like a vote.", ["rising", "queue.", "vote."]),                         # 6  the same mechanism in trading
 ("So you buy, and you become the queue.", ["buy,", "become"]),                                                         # 7
 ("And a long queue feels like proof.", ["long", "proof."]),                                                            # 8  rehook: the thing that feels like proof and is not
 ("It isn't. In one famous example, ninety-nine of a hundred people heard next door was better.", ["isn't.", "ninety-nine", "better."]),   # 9  the number that teaches (Banerjee 1992)
 ("The one who didn't came first. So all hundred queued here.", ["first.", "hundred", "here."]),                       # 10
 ("You'd never let one stranger pick your dinner. But one stranger can pick your trade.", ["one", "dinner.", "trade."]),   # 11 the ending: the same number on both sides
 ("Maybe you never followed a crowd. Maybe you followed whoever came first.", ["crowd.", "first."]),                   # 12 the line that is felt
]
PARAS = [[0], [1], [2, 3, 4], [5, 6], [7, 8], [9], [10], [11]]       # sentence indices spoken in one breath
PAUSE = [0.22, 0.30, 0.26, 0.28, 0.24, 0.30, 0.45, 0.0]              # silence after each paragraph (s); longer before the last line
TAIL = 2.9                                                           # seconds held after the last word: the last card needs time to be read
PARTS = {"hook": [0], "lock": [1, 2], "body1": [3, 4, 5, 6], "rehook": [7], "body2": [8, 9], "lesson": [10, 11]}

# The headline that stays on screen (OPEN text = banner): 2 lines, 10 words at most, *one* amber word. HOOK_SUB is the small tag on its top edge.
HOOK = ["Why join the long queue", "when next door is *empty*?"]
HOOK_SUB = "the restaurant-queue problem"

# The last card: the closing line, then the check the viewer can use. Never buy, sell or hold.
LESSON_LABEL = "Maybe"
LESSON = ["You never followed a crowd.", "You followed whoever came *first*."]
LESSON_USE = "Before you join in: your reason, or just the queue?"

import re
def plain(s): return re.sub(r"\[([^\]]+)\]\([^)]*\)", r"\1", s)
if __name__ == "__main__":
    print(sum(len(plain(s).split()) for s, _ in S), "words")
