# The Boss Who Wasn't There  (the $129 million AI CEO-impersonation case; charges made public Thu 5 Nov 2026, US time)
# US DOJ SDNY press release 26-317 (updated 6 Nov 2026): three men charged with wire fraud, aggravated identity theft and money laundering; between
# 2024 and 2026 (July 2024 - Feb 2026: CyberScoop, court records) they allegedly used AI ("SI", super intelligence) to mimic CEOs' voices and/or images,
# asked finance staff for help with a "confidential financial transaction", then posed as lawyers at large international law firms (a handwritten
# "Lawyer Call" script with language "designed to convince victim employees not to discuss their communications with fellow employees") and had them
# wire money to accounts in the US, Spain, Portugal, Greece, UAE, Singapore, Austria, Slovakia and China; proceeds converted to crypto. About $129M.
# Victims include hospital systems in Missouri and California, a Rhode Island bank, a UK fintech ($11,578,474), a Massachusetts mutual fund company
# and a Florida pet food company. Arrested in Spain (17 Jun, 5 Aug 2026) and the UK (7 Sep 2026); extradition pending; presumed innocent.
# AP (via ITV, KSAT, Fox stations; SCMP): "about $129 million", "targeted thousands of companies across the world", an email from the CEO, then a
# phone or video call where AI mimicked "the voice and sometimes the image of the CEO", then an impersonated attorney at a major law firm; crypto.
# CyberScoop (6 Nov 2026), American Banker (9 Nov 2026: an NDA and "a request to keep the deal from colleagues").
# Each sentence: (spoken text for the voice, keywords shown in an amber box in the captions)
# Paragraphs are synthesized together so that every sentence start is articulated clearly.
S = [
 ("129 million dollars went out because a fake boss asked, prosecutors say.", ["million", "fake"]),
 ("Thousands of companies worldwide were targeted, from hospitals to a pet food maker.", ["Thousands", "hospitals"]),
 ("So how do you fake a boss well enough to move millions?", ["fake", "millions?"]),
 ("First, the boss writes: a secret deal, and he needs your help.", ["secret", "help."]),
 ("Then he calls, with his voice, and sometimes his face, copied by AI.", ["voice,", "face,", "AI."]),
 ("But the money request comes from someone else: a lawyer at a big law firm.", ["lawyer", "firm."]),
 ("He's fake too, prosecutors say, reading a script that says: tell no one at work.", ["fake", "script", "work."]),
 ("One British company alone sent more than 11 million dollars.", ["British", "million"]),
 ("It went to bank accounts in nine countries, then into crypto.", ["nine", "crypto."]),
 ("Three men were arrested in Spain and Britain, and charged in New York.", ["arrested", "charged"]),
 ("They're presumed innocent, and the story isn't over yet.", ["innocent,", "yet."]),
 ("The story of the boss who wasn't there: a voice is no longer proof.", ["voice", "proof."]),
 ("Would you have spotted the fake? Comment YES, or NO.", ["YES,", "NO."]),
]
PARAS = [[0], [1, 2], [3, 4], [5, 6], [7, 8], [9, 10], [11], [12]]     # sentence indices spoken in one breath
PAUSE = [0.20, 0.24, 0.22, 0.24, 0.22, 0.24, 0.22, 0.0]                # silence after each paragraph (s): 0.18-0.3
# Hook card on the first frame (also the cover): the contrast in <= 7 words, 2 lines, *one* amber word; subline = subject and date
HOOK = ["The boss on the call", "was *fake*."]
HOOK_SUB = "An AI fraud case · New York · Nov 2026"
# Big number at 1.5-3 s: (value, what, when). Money first: lost / wiped out / liquidated / paid, in billions or trillions; a percentage only when it is huge
BIG = ("$129 MILLION", "wired out on orders from\nAI-faked bosses", "per US prosecutors · charges made public 5 Nov 2026", "down")   # optional 4th: "down" (red, diving) or "up" (amber, climbing)
BIG_WORD = "million"     # the word of sentence 1 that says the number (tts.sh checks it falls at 1.2-3 s)
import re
def plain(s): return re.sub(r"\[([^\]]+)\]\([^)]*\)", r"\1", s)
if __name__ == "__main__":
    print(sum(len(plain(s).split()) for s, _ in S), "words")
