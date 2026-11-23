# The Day the Founder Came Back  (Mon 23 Nov 2026: Nvidia's board reinstates Jensen Huang as CEO, less than two weeks after he resigned.
# Nvidia closes at $165.05, up 31.5% from Friday's $125.53, adding about $954 billion of market value, the biggest one-day gain in value
# for any company on record (more than double Microsoft's roughly $450 billion of 30 Jul 2026). Even so, a share is still about 5% below
# the $173.73 close of 11 Nov, the last before he left: a fall of more than a quarter needs a rise of more than a third to undo it.)
# Each sentence: (spoken text for the voice, keywords shown in an amber box in the captions)
# Paragraphs are synthesized together so that every sentence start is articulated clearly.
S = [
 ("Nvidia gained almost a trillion dollars the day its founder came back.", ["trillion", "founder"]),
 ("That's more than double the old one-day record for any company.", ["double", "record"]),
 ("So how can one man be worth that much?", ["one", "man"]),
 ("Jensen Huang co-founded Nvidia 33 years ago.", ["Jensen", "Huang", "33"]),
 ("This month, he quit.", ["quit."]),
 ("While he was gone, the shares fell more than a quarter.", ["gone,", "quarter."]),
 ("On Monday, the board voted him back in.", ["board", "back"]),
 ("The shares jumped almost a third.", ["jumped", "third."]),
 ("Same chips. Same sales forecast. Just one vote.", ["chips.", "forecast.", "vote."]),
 ("A share price is a guess about the future, and investors guess about people, too.", ["guess", "people,"]),
 ("But here's the twist: even after that record day, a share costs less than before he quit.", ["twist:", "less"]),
 ("A fall needs a bigger rise to undo it.", ["fall", "bigger"]),
 ("The story isn't over yet.", ["over"]),
 ("The story of the founder who came back: even a record day didn't undo the fall.", ["founder", "undo"]),
 ("Would you have sold when he quit, or held? Comment: SELL, or HOLD.", ["SELL,", "HOLD."]),
]
PARAS = [[0], [1, 2], [3, 4, 5], [6, 7], [8, 9], [10, 11], [12], [13], [14]]   # sentence indices spoken in one breath
PAUSE = [0.20, 0.24, 0.22, 0.22, 0.24, 0.24, 0.22, 0.22, 0.0]                   # silence after each paragraph (s): 0.18-0.3
# Hook card on the first frame (also the cover): the contrast in <= 7 words, 2 lines, *one* amber word; subline = subject and date
HOOK = ["The founder quit.", "Then he came *back*."]
HOOK_SUB = "Nvidia · 23 Nov 2026"
# Big number at 1.5-3 s: (value, what, when). Money first: lost / wiped out / liquidated / paid, in billions or trillions; a percentage only when it is huge
BIG = ("+$954 BILLION", "Nvidia's value added\nin one day", "Mon 23 Nov 2026 · a record", "up")   # optional 4th: "down" (red, diving) or "up" (amber, climbing)
BIG_WORD = "trillion"     # the word of sentence 1 that says the number (tts.sh checks it falls at 1.2-3 s)
import re
def plain(s): return re.sub(r"\[([^\]]+)\]\([^)]*\)", r"\1", s)
if __name__ == "__main__":
    print(sum(len(plain(s).split()) for s, _ in S), "words")
