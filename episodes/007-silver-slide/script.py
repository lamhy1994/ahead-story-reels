# The Silver Slide  (silver's record of about $121 an ounce on 29 Jan 2026, the record one-day fall on 30 Jan,
# and the slide to about $41 on 20 Nov 2026, its lowest in more than a year; gold down more than a third from its own record)
# Each sentence: (spoken text for the voice, keywords shown in an amber box in the captions)
# Paragraphs are synthesized together so that every sentence start is articulated clearly.
S = [
 ("In January 2026, silver hit its highest price ever.", ["silver", "ever."]),
 ("Ten months later, two thirds of that price is gone.", ["two", "thirds"]),
 ("Meet silver: the metal of old coins, and of solar panels.", ["silver:", "solar"]),
 ("At the start of 2025, one ounce cost about $30.", ["$30."]),
 ("Then factories wanted more, and traders piled in.", ["factories", "traders"]),
 ("On the twenty-ninth of January, it touched a record: $121.", ["record:", "$121."]),
 ("About four times as much, in about a year.", ["four"]),
 ("The very next day, it crashed.", ["crashed."]),
 ("More than a quarter of its price, gone in one day.", ["quarter"]),
 ("And month after month, it slid further.", ["slid"]),
 ("Why? Silver pays no interest.", ["interest."]),
 ("And markets now expect higher interest rates.", ["higher"]),
 ("When savings pay more, a metal that pays nothing looks less shiny.", ["savings", "nothing"]),
 ("When stocks fall, some investors sell metal to cover losses.", ["stocks", "losses."]),
 ("Picture one ounce, bought at the top for $121.", ["ounce,", "$121."]),
 ("As of November the twentieth, it's worth about $41.", ["$41."]),
 ("Its lowest in more than a year.", ["lowest"]),
 ("Even gold, the old safe place, is down more than a third.", ["gold,", "third."]),
 ("The story isn't over yet.", ["over"]),
 ("That's the story of the silver slide. What shines can still fall.", ["slide.", "fall."]),
 ("You decide. Would you have sold, or held? Comment: SELL, or HOLD.", ["SELL,", "HOLD."]),
]
PARAS = [[0], [1], [2], [3, 4], [5, 6], [7, 8], [9], [10, 11], [12], [13], [14, 15], [16], [17], [18], [19], [20]]   # sentence indices spoken in one breath
PAUSE = [0.32, 0.45, 0.38, 0.38, 0.45, 0.42, 0.50, 0.36, 0.40, 0.50, 0.36, 0.40, 0.50, 0.48, 0.42, 0.0]                  # silence after each paragraph (s)
import re
def plain(s): return re.sub(r"\[([^\]]+)\]\([^)]*\)", r"\1", s)
if __name__ == "__main__":
    print(sum(len(plain(s).split()) for s, _ in S), "words")
