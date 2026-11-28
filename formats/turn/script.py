# The Other Line  (episode 26, the worked example of the turn format, SKILL.md §0; something odd from ordinary life -> a jump to trading -> the logic that joins them -> an ending that is felt)
# Keith, 28 Nov 2026, about the Reel instagram.com/reel/DgMKBJJMeMP: "先用现实普通人会遇到的比较特别的东西做hook，然后很没逻辑的link 到trading，然后把逻辑联合起来，然后最后给人家emotional"
# Each sentence: (spoken text for the voice, keywords shown in an amber box in the captions)

# `python3 ../../hooklab.py pick` prints FORMAT, OPEN and CTA_ARM for the next episode.
FORMAT = "turn"        # no CTA: the video ends on its last line (CTA_ARM "N"); the last card carries the closing line, not "The lesson: ..."
OPEN = {"words": "you", "text": "banner", "picture": "action", "beat2": "event", "lock": "turn"}
CTA_ARM = "N"

S = [
 ("Switch lines at the supermarket, and the line you left starts moving.", ["Switch", "left", "moving."]),                      # 1  hook: the odd thing everybody knows
 ("You do the same thing when you trade.", ["same", "trade."]),                                                                 # 2  the turn: a jump to trading that makes no sense yet
 ("Here's why.", ["why."]),                                                                                                     # 3
 ("With three lines, yours is the fastest only one time in three.", ["fastest", "one"]),                                        # 4  the logic of the odd thing
 ("In trading there aren't three lines. There are thousands.", ["thousands."]),                                                 # 5  ... carried over to trading
 ("And one of them is always moving faster than yours.", ["always", "faster"]),                                                 # 6
 ("So you switch. And every switch sends you to the back of a new line.", ["switch.", "back"]),                                 # 7  what switching costs
 ("But three losses in a row feels like proof.", ["three", "proof."]),                                                          # 8  rehook
 ("It isn't. A strategy that wins six times in ten still loses three in a row, sooner or later.", ["isn't.", "six", "three"]),  # 9  the number that teaches
 ("You'll wait ten minutes to buy milk. But you won't give a strategy ten trades.", ["minutes", "milk.", "trades."]),           # 10 the ending: the same number on both sides
 ("Maybe you were never in the wrong line. Maybe you just never stayed.", ["wrong", "stayed."]),                                # 11 the line that is felt
]
PARAS = [[0], [1], [2, 3], [4, 5], [6], [7, 8], [9], [10]]            # sentence indices spoken in one breath
PAUSE = [0.22, 0.30, 0.22, 0.24, 0.26, 0.30, 0.45, 0.0]               # silence after each paragraph (s); longer before the last line
TAIL = 2.9                                                            # seconds held after the last word (default 1.25): the last card needs time to be read
PARTS = {"hook": [0], "lock": [1, 2], "body1": [3, 4, 5, 6], "rehook": [7], "body2": [8], "lesson": [9, 10]}

# The headline that stays on screen (OPEN text = banner): 2 lines, 10 words at most, *one* amber word. HOOK_SUB is the small tag on its top edge.
HOOK = ["Why the other line", "always moves *faster*"]
HOOK_SUB = "the checkout-line problem"

# The last card: the closing line, then the check the viewer can use. Never buy, sell or hold.
LESSON_LABEL = "Maybe"
LESSON = ["It was never the wrong line.", "You just never *stayed*."]
LESSON_USE = "Before you switch: has it had enough trades to judge?"

import re
def plain(s): return re.sub(r"\[([^\]]+)\]\([^)]*\)", r"\1", s)
if __name__ == "__main__":
    print(sum(len(plain(s).split()) for s, _ in S), "words")
