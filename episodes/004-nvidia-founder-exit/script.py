# The Day the Founder Left  (Jensen Huang resigns as Nvidia CEO, 12 Nov 2026; Nvidia's first results without him, 17 Nov 2026)
# Each sentence: (spoken text for the voice, keywords shown in an amber box in the captions)
# Paragraphs are synthesized together so that every sentence start is articulated clearly.
S = [
 ("In November 2026, Nvidia's sales more than doubled, and its shares fell anyway.", ["doubled,", "fell"]),
 ("It began in 1993, in a diner in San Jose.", ["1993,", "diner"]),
 ("Three engineers planned a chip to make video games look real.", ["chip", "video"]),
 ("One was Jensen Huang.", ["Jensen", "Huang."]),
 ("He ran it for 33 years, from games to A.I., until it was worth trillions.", ["33", "trillions."]),
 ("Then came news reports of affairs.", ["affairs."]),
 ("On November the twelfth, he resigned, effective immediately.", ["resigned,"]),
 ("Finance chief Colette Kress became interim boss.", ["Colette", "Kress"]),
 ("The night before he left, a share cost $174.", ["$174."]),
 ("That morning, it fell as much as 14%.", ["14%."]),
 ("Strange: the chips were the same.", ["same."]),
 ("Picture a bakery whose famous baker walks out.", ["bakery", "baker"]),
 ("Same ovens, same bread. Would you pay the same?", ["ovens,", "bread.", "pay"]),
 ("Five days later, the company opened its books.", ["books."]),
 ("$115.8 billion of sales in three months, more than double a year before.", ["$115.8", "double"]),
 ("That evening, the shares rose. The next day, they fell again.", ["rose.", "fell"]),
 ("On the eighteenth, a share closed at $151.", ["$151."]),
 ("The board says it doesn't plan to bring him back. It's looking for a new boss.", ["back.", "new"]),
 ("The story isn't over yet.", ["over"]),
 ("That's the story of the founder who left. Markets price people, too.", ["founder", "people,"]),
 ("You decide. Would you have sold, or held? Comment: SELL, or HOLD.", ["SELL,", "HOLD."]),
]
PARAS = [[0], [1, 2, 3], [4], [5, 6, 7], [8, 9], [10, 11, 12], [13, 14, 15], [16, 17, 18], [19], [20]]   # sentence indices spoken in one breath
PAUSE = [0.45, 0.42, 0.45, 0.42, 0.45, 0.45, 0.42, 0.50, 0.50, 0.0]                                      # silence after each paragraph (s)
import re
def plain(s): return re.sub(r"\[([^\]]+)\]\([^)]*\)", r"\1", s)
if __name__ == "__main__":
    print(sum(len(plain(s).split()) for s, _ in S), "words")
