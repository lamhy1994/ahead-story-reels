#!/usr/bin/env python3
# The stay check (Keith, 28 Nov 2026: "最好是不只是hook，而是每个video 人家滑走的那个秒就可能需要进步").
# One row for every 3 seconds of the video: what is said, what changes on screen, and why a viewer stays.
#   python3 staycheck.py            after ./tts.sh: prints the rows and writes stay.md (words and warnings filled in;
#                                   `picture`, `stay` and `note` are yours to fill in by editing stay.md)
#   python3 staycheck.py --check    before posting: exit 2 while a row still has "?" in `picture` or `stay`,
#                                   or a warning with an empty `note`
# Run it again after any script change: rows whose words did not change keep what you wrote.
# Why 3 seconds: Instagram counts a view at 3 s, and our Reels lose about 4% of the viewers who are left every second after
# that (trends/insights.md, "Where viewers leave"), so a 3 s stretch with nothing new costs about one viewer in nine.
import json, os, re, sys

WIN = 3.0
NUMW = set("zero one two three four five six seven eight nine ten eleven twelve twenty thirty forty fifty sixty seventy eighty "
           "ninety hundred thousand million billion percent half third quarter twice double".split())
T = json.load(open("audio/timing.json"))
words, parts, sents, dur = T["words"], T.get("parts", {}), T.get("sentences", []), float(T["duration"])
last_word = max(w["e"] for w in words)
norm = lambda s: re.sub(r"[^a-z0-9%$]+", " ", s.lower()).strip()

def part_at(t):
    names = [k for k, p in parts.items() if p["s"] - 0.3 <= t < p["e"] + 0.3]
    return names[0] if names else ("end card" if t >= last_word else "")

old = {}
if os.path.exists("stay.md"):
    for line in open("stay.md"):
        c = [x.strip() for x in line.strip().strip("|").split("|")]
        if len(c) >= 7 and re.match(r"^\d+(\.\d+)?–", c[0]): old[norm(c[2])] = c[4:7]

rows, prev_kw, n = [], True, int(-(-dur // WIN))
for i in range(n):
    a, b = i * WIN, min((i + 1) * WIN, dur)
    ws = [w for w in words if a <= w["s"] < b]
    said = " ".join(w["t"] for w in ws); kw = any(w.get("kw") for w in ws)
    warn = []
    if a < last_word - 0.5:                                   # the end card is allowed to be quiet
        if len(ws) < 4: warn.append("quiet (%d words)" % len(ws))
        if len(ws) > 10: warn.append("dense (%d words)" % len(ws))
        if not kw and not prev_kw: warn.append("6 s without a keyword")
        if sum(1 for w in ws if re.search(r"\d", w["t"]) or norm(w["t"]) in NUMW) >= 3: warn.append("3+ numbers")
        for s in sents:
            if s["e"] - s["s"] > 7.5 and s["s"] <= a and s["e"] >= b: warn.append("inside a %.0f s sentence" % (s["e"] - s["s"]))
    prev_kw = kw
    keep = old.get(norm(said), ["?", "?", ""])
    rows.append([f"{a:.0f}–{b:.0f} s", part_at(a + 0.01), said or "(no words)", "; ".join(warn), *keep])

head = ["time", "part", "said", "warning", "picture: what visibly changes", "stay: the question still open, or the payoff that lands", "note: what you changed, or why the warning is fine"]
md = ["# Stay check", "",
      "Fill `picture` and `stay` for every row while looking at the keyframe sheet (two frames a row: the times are below).",
      "A row where nothing visibly changes, or where no question is open and nothing lands, is where a viewer swipes: rewrite, cut or move something until it has both.",
      "Every warning needs a fix or a reason in `note`. `python3 staycheck.py --check` must print OK before posting.", "",
      "| " + " | ".join(head) + " |", "|" + "---|" * len(head)] + ["| " + " | ".join(r) + " |" for r in rows]
keys = sorted(set([0, 0.5, 1.0, 1.6, 2.3, 3.2] + [round(x * 1.5, 1) for x in range(3, int(dur / 1.5) + 1)]))
md += ["", "Keyframes for the sheet: `node render.mjs keys " + ",".join(f"{k:g}" for k in keys) + " frames/k`"]

if "--check" in sys.argv:
    bad = []
    if not old: bad.append("stay.md is missing or empty: run python3 staycheck.py and fill it in")
    for r in rows:
        if "?" in (r[4], r[5]) or not r[4] or not r[5]: bad.append(f"{r[0]}: picture or stay not filled in")
        if r[3] and not r[6]: bad.append(f"{r[0]}: warning without a note ({r[3]})")
    print("STAY CHECK: " + ("OK, every 3 s has a picture change and a reason to stay" if not bad else "FIX BEFORE POSTING\n  " + "\n  ".join(bad)))
    sys.exit(2 if bad else 0)
open("stay.md", "w").write("\n".join(md) + "\n"); print("\n".join(md))
