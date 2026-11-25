# Transcribes a wav and checks that every caption word is heard near its time (number-aware:
# Whisper writes "twenty thousand pounds" as "£20,000", so heard numerals are expanded into words).
# Usage: python hearcheck.py <wav> [audio/timing.json]
import sys, re, json, numpy as np, soundfile as sf
from scipy.signal import resample_poly
from num2words import num2words
from faster_whisper import WhisperModel
norm = lambda s: re.sub(r"[^a-z0-9]", "", s.lower())
HOMO = [("2", "too"), ("two", "too"), ("to", "too"), ("collette", "colette"), ("dominos", "dominoes"), ("corweave", "coreweave"), ("corweaves", "coreweaves")]
wav = sys.argv[1]; T = json.load(open(sys.argv[2] if len(sys.argv) > 2 else "audio/timing.json"))
a, sr = sf.read(wav)
if a.ndim > 1: a = a.mean(axis=1)
a = resample_poly(a, 16000, sr).astype(np.float32)
wm = WhisperModel("small.en", device="cpu", compute_type="int8")
segs, _ = wm.transcribe(a, language="en", beam_size=5, word_timestamps=True)
heard = []; ws = []; glued = []
for s in segs:
    for w in s.words:
        orig = w.word.strip()
        if re.search(r"[a-z][A-Z]|[A-Z]{2}[a-z]", orig): glued += [(x.lower(), w.start) for x in re.findall(r"[A-Z]+(?![a-z])|[A-Z][a-z]+|[a-z]+|\d+", orig)]   # "AITheNext" -> ai, the, next
        raw = orig.lower()
        if ws and re.fullmatch(r"[,.]?\d{3}[.,!?]?", raw) and re.search(r"\d$", ws[-1][0].rstrip(".,!?")):
            ws[-1] = (ws[-1][0].rstrip(".,!?") + raw, ws[-1][1]); continue           # Whisper splits "20,000" into "20" + ",000"
        if ws and re.fullmatch(r"\.\d{1,2}[.,!?%]?", raw) and re.search(r"\d$", ws[-1][0]):
            ws[-1] = (ws[-1][0] + raw, ws[-1][1]); continue                           # … and "$115.8" into "$115" + ".8"
        ws.append((raw, w.start))
MULT = ("thousand", "million", "billion", "trillion")
for j, (raw, st) in enumerate(ws):
    heard.append((norm(raw), st))
    digits = re.sub(r"[^0-9]", "", raw)
    dm = re.search(r"(\d[\d,]*)\.(\d+)", raw)                     # "$3.5" is said "three and a half dollars" ("three point five")
    if dm:
        digits = dm.group(1).replace(",", "")
        if dm.group(2).rstrip("0") == "5": heard.extend([("and", st), ("a", st), ("half", st)])
        heard.append(("point", st)); heard.extend((num2words(int(d)), st) for d in dm.group(2))
    if "$" in raw and j + 1 < len(ws) and norm(ws[j + 1][0]) in MULT: heard.append(("dollars", ws[j + 1][1] + 0.4))   # "$466 billion": "dollars" is said after "billion"
    if digits:                                                       # keep the digits and add the words (1720 also gives "one thousand …", which is harmless)
        n = int(digits)
        for x in re.sub(r"[^a-z ]", " ", num2words(n).replace("-", " ")).split():
            if x != "and": heard.append((x, st))
        if n >= 1000 and str(n).startswith("1"): heard.append(("a", st))
    if "£" in raw: heard.append(("pounds", st))
    if "$" in raw: heard.append(("dollars", st))
    if "%" in raw: heard.append(("percent", st))
    m = re.fullmatch(r"(\d+)(st|nd|rd|th)[.,!?]?", raw)                      # "12th" -> "twelfth" (the script writes ordinals as words)
    if m: heard.append((norm(num2words(int(m.group(1)), to="ordinal")), st)); heard.append(("the", st))   # "November the twentieth" is written "November 20th"
    for a, b in HOMO:                                                         # same sound, other spelling ("too" heard as "2")
        if norm(raw) == a: heard.append((b, st))
heard += [(norm(ws[j][0]) + norm(ws[j + 1][0]), ws[j][1]) for j in range(len(ws) - 1)]
for raw, st in ws:                                                           # Whisper may glue words ("AI-the-next") or write "dot com" as ".com"
    if re.search(r"[a-z][-.][a-z]", raw) or raw.startswith("."): heard.extend((norm(x), st) for x in re.split(r"[-.]", raw) if norm(x)); heard.extend([("dot", st), ("dotcom", st)] if ".com" in raw else [])   # a hyphenated caption word ("dot-com") is heard as two ("dot com")
heard += glued
print("HEARD:", " ".join(h[0] for h in heard))
miss = [(w["t"], w["s"]) for w in T["words"] if not any(h[0] == norm(w["t"]) and abs(h[1] - w["s"]) < 1.5 for h in heard)]
print("caption words not heard near their time:", miss)
sys.exit(1 if miss else 0)
