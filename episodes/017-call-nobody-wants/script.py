# The Call Nobody Wants  (week to Fri 20 Nov 2026: Taiwan's TAIEX falls 17.5%, 7,641.83 points, its worst week in more than 30 years
# (Reuters: since 1990; Bloomberg: 35 years); the main board's market value falls NT$24.97 trillion, from NT$143.07tn to NT$118.10tn
# (TWSE figures via Next Apple, TVBS, Commercial Times), about US$760 billion at NT$32.94 per US$. Borrowed money made it worse: in Taiwan
# an investor can buy a listed stock with 40% of their own money and 60% lent by the broker; when the stock falls to 78% of the price
# (a maintenance ratio of 130%) the broker sends a margin call: top up within two business days or the shares are sold (forced sale).
# Margin calls hit a record 6,462 accounts on 20 Nov (719 on 18 Nov); forced sales and the one-day fall in margin loans were records too.
# TWSE then lowered the line to 120% from Tue 24 Nov and cancelled earlier calls. Mon 23 Nov (US) Nvidia reinstated Jensen Huang;
# Tue 24 Nov the TAIEX rose 3,310.46 points (+8.99%), its biggest one-day point gain on record; Wed 25 Nov it fell as much as 3,440.45
# points (8.6%) during the day, its second-largest intraday point loss, and closed 1,926.92 points (4.8%) lower at 38,195.43.)
# Each sentence: (spoken text for the voice, keywords shown in an amber box in the captions)
# Paragraphs are synthesized together so that every sentence start is articulated clearly.
S = [
 ("Taiwan lost 760 billion dollars of stock value in one week.", ["760", "billion"]),
 ("Its worst week in over 30 years, and thousands got a call nobody wants.", ["worst", "call"]),
 ("So who was calling?", ["calling?"]),
 ("Their broker.", ["broker."]),
 ("In Taiwan, many buy shares with borrowed money: put in 40 dollars, the broker lends 60.", ["borrowed", "40", "60."]),
 ("But if the shares lose about a fifth, the broker calls.", ["fifth,", "calls."]),
 ("Pay more in two days, or it sells your shares for you.", ["two", "sells"]),
 ("This month, AI fears sank chip stocks, and the calls went out.", ["AI", "calls"]),
 ("Forced sales pushed prices lower, and lower prices sent more calls.", ["Forced", "more"]),
 ("So the stock exchange moved the line, and cancelled the calls already sent.", ["moved", "cancelled"]),
 ("Then Nvidia took its founder back, and Taiwan jumped 9 percent.", ["founder", "9"]),
 ("The next day, it plunged again.", ["plunged"]),
 ("The story isn't over yet.", ["over"]),
 ("The story of the call nobody wants: borrowed money can pick when you sell.", ["borrowed", "when"]),
 ("Would you pay, or let them sell? Comment PAY, or SELL.", ["PAY,", "SELL."]),
]
PARAS = [[0], [1, 2, 3], [4, 5, 6], [7, 8], [9], [10, 11, 12], [13], [14]]   # sentence indices spoken in one breath
PAUSE = [0.20, 0.24, 0.24, 0.22, 0.22, 0.24, 0.22, 0.0]                      # silence after each paragraph (s): 0.18-0.3
# Hook card on the first frame (also the cover): the contrast in <= 7 words, 2 lines, *one* amber word; subline = subject and date
HOOK = ["They didn't sell.", "Their *broker* did."]
HOOK_SUB = "Taiwan · Nov 2026"
# Big number at 1.5-3 s: (value, what, when). Money first: lost / wiped out / liquidated / paid, in billions or trillions; a percentage only when it is huge
BIG = ("−$760 BILLION", "Taiwan's stock market value\nlost in one week", "week to Fri 20 Nov 2026", "down")   # optional 4th: "down" (red, diving) or "up" (amber, climbing)
BIG_WORD = "billion"     # the word of sentence 1 that says the number (tts.sh checks it falls at 1.2-3 s)
import re
def plain(s): return re.sub(r"\[([^\]]+)\]\([^)]*\)", r"\1", s)
if __name__ == "__main__":
    print(sum(len(plain(s).split()) for s, _ in S), "words")
