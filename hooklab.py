# Hook lab (Keith, 28 Nov 2026: "test 100 kinds of openings until people watch to 10 seconds; remember the formula").
# The first 10 seconds of every episode are built from five parts (hooklab/library.json). This script
#   python3 hooklab.py pick [N]   -> the opening and the CTA arm for episode N (default: the next number). Same N, same answer.
#   python3 hooklab.py            -> scores every posted Reel and writes trends/hooklab.md (the formula so far)
# Score = estimated share of viewers still watching at 10 s, worked out from Instagram's skip rate (left in the first 3 s),
# average watch time and the video's length. Instagram's API gives no retention curve, so this is an estimate (see r10).
# Picking: every level is tried at least twice first (least-tried first), then Thompson sampling: levels that score better
# are picked more often, the others still get a turn now and then.
import csv, json, math, random, sys, datetime as dt, os
os.chdir(os.path.dirname(os.path.abspath(__file__)))      # works from the repo root or from an episode folder (python3 ../../hooklab.py)

LIB = json.load(open("hooklab/library.json")); OLD = json.load(open("hooklab/labels.json"))["episodes"]
FACTORS = list(LIB["factors"]); K_SHAPE = 0.7; MIN_AGE_H = 12; MIN_PLAYS = 60
P = lambda s: dt.datetime.fromisoformat(s.replace("Z", "+00:00"))
num = lambda r, k, d=0.0: float(r[k]) if r.get(k) not in (None, "") else d

def r10(skip_pct, avg_watch_s, length_s, at=10.0, k=K_SHAPE):
    """Estimated % of plays still watching at `at` seconds.
    Skippers (skip_pct) leave in the first 3 s, after about 1.5 s on average. For the rest, the time watched after 3 s is taken
    to follow a Weibull curve with shape k (< 1: people leave fastest early on), cut off at the end of the video, whose mean
    matches Instagram's average watch time. k = 0.7 is a guess until Keith sends retention screenshots to calibrate it; the
    ranking of Reels hardly changes with k."""
    s = min(max(skip_pct / 100.0, 0.0), 0.98); T = max(length_s - 3.0, 5.0)
    m = min(max((avg_watch_s - s * 1.5) / (1.0 - s) - 3.0, 0.2), T * 0.985)
    def mean_cut(th, n=240):                      # Simpson: integral of the survival curve from 0 to T
        h = T / n; f = lambda t: math.exp(-((t / th) ** k)) if t > 0 else 1.0
        return h / 3 * (f(0) + f(T) + sum((4 if i % 2 else 2) * f(i * h) for i in range(1, n)))
    lo, hi = 0.01, 1e6
    for _ in range(70):
        mid = math.sqrt(lo * hi)
        if mean_cut(mid) < m: lo = mid
        else: hi = mid
    return 100.0 * (1.0 - s) * math.exp(-(((at - 3.0) / math.sqrt(lo * hi)) ** k))

def load():
    eps = json.load(open("episodes.json")); eps = eps if isinstance(eps, list) else eps["episodes"]
    ins = {}
    for r in csv.DictReader(open("trends/insights.csv")): ins[r["shortcode"]] = r          # one row per Reel, newest numbers
    out = []; every = []
    for e in eps:
        n = e.get("n"); op = e.get("open") or OLD.get(str(n)) or {}
        row = {"n": n, "title": e.get("title", ""), "fmt": e.get("format", "v2"), "open": {f: op.get(f) for f in FACTORS}, "cta": e.get("cta"), "lab": bool(e.get("open")), "scored": False}
        sc = (e.get("permalink") or "").rstrip("/").split("/")[-1]; r = ins.get(sc)
        if r and e.get("length_s"):
            age = (P(r["as_of_utc"]) - P(r["posted_utc"])).total_seconds() / 3600; plays = int(float(r["plays"]))
            row.update(plays=plays, age=age, skip=num(r, "skip_pct"), watch=num(r, "avg_watch_s"), likes=num(r, "likes"), comments=num(r, "comments"), shares=num(r, "shares"), saves=num(r, "saves"))
            if age >= MIN_AGE_H and plays >= MIN_PLAYS:
                row["scored"] = True; row["r10"] = r10(row["skip"], row["watch"], float(e["length_s"])); row["hold3"] = 100 - row["skip"]
        every.append(row)
        if op: out.append(row)                     # only episodes with a known opening take part in the lab
    return eps, ins, out, every

def centred(rows):
    """Score minus the average of its format (v2, v3 ...), so a change of format does not look like a better opening."""
    sc = [r for r in rows if r["scored"]]
    if not sc: return sc, 0.0, 6.0
    allm = sum(r["r10"] for r in sc) / len(sc); fm = {}
    for f in {r["fmt"] for r in sc}:
        v = [r["r10"] for r in sc if r["fmt"] == f]; fm[f] = (sum(v) + 3 * allm) / (len(v) + 3)     # small groups lean on the overall average
    for r in sc: r["yc"] = r["r10"] - fm[r["fmt"]]
    sd = math.sqrt(sum(r["yc"] ** 2 for r in sc) / max(1, len(sc) - 1)) if len(sc) > 2 else 6.0
    return sc, allm, max(4.0, sd)

def active(f): return [l["id"] for l in LIB["factors"][f]["levels"] if l.get("status", "active") == "active"]

def stats(rows):
    sc, allm, sd = centred(rows); st = {}
    for f in FACTORS:
        st[f] = {}
        for l in [x["id"] for x in LIB["factors"][f]["levels"]]:
            v = [r for r in sc if r["open"].get(f) == l]; tried = sum(1 for r in rows if r["open"].get(f) == l)
            n = len(v); m = sum(r["yc"] for r in v) / n if n else 0.0
            st[f][l] = {"tried": tried, "n": n, "eff": m, "post_m": n * m / (n + 1), "post_sd": sd / math.sqrt(n + 1),
                        "r10": sum(r["r10"] for r in v) / n if n else None, "hold3": sum(r["hold3"] for r in v) / n if n else None}
        rnd = random.Random(7); act = [l for l in active(f) if st[f][l]["n"] >= 1]; wins = {l: 0 for l in act}
        for _ in range(4000 if len(act) > 1 else 0):
            best = max(act, key=lambda l: rnd.gauss(st[f][l]["post_m"], st[f][l]["post_sd"])); wins[best] += 1
        for l in st[f]: st[f][l]["p_best"] = wins[l] / 4000 if l in wins and len(act) > 1 else None      # None: nothing to compare with yet
        tested = [l for l in active(f) if st[f][l]["n"] >= 3]
        for l in st[f]: st[f][l]["retire"] = bool(l in tested and len(tested) >= 3 and st[f][l]["n"] >= LIB["retire"]["min_scored"] and st[f][l]["p_best"] is not None and st[f][l]["p_best"] < LIB["retire"]["p_best_below"])
    return st, sc, allm, sd

def pick(n, rows, st):
    rnd = random.Random(20261128 + 7919 * n); out = {}; why = {}
    for f in FACTORS:
        act = active(f); low = [l for l in act if st[f][l]["tried"] < LIB["min_tries"]]
        if low:
            out[f] = rnd.choices(low, weights=[(LIB["min_tries"] - st[f][l]["tried"]) ** 2 for l in low])[0]; why[f] = f"new: tried {st[f][out[f]]['tried']} time(s) so far"
        else:
            out[f] = max(act, key=lambda l: rnd.gauss(st[f][l]["post_m"], st[f][l]["post_sd"])); why[f] = "picked by score (" + (f"{100 * st[f][out[f]]['p_best']:.0f}% chance of being the best" if st[f][out[f]]["p_best"] is not None else "no score yet") + ")"
    return out, why

def cmd_pick(argv):
    eps, ins, rows, _ = load(); st, *_ = stats(rows)
    n = int(argv[0]) if argv else max(e["n"] for e in eps) + 1
    have = next((e for e in eps if e.get("n") == n and e.get("open")), None)
    if have: op, why, arm = have["open"], {f: "already claimed" for f in FACTORS}, have.get("cta") or ("K" if n % 2 == 0 else "O")
    else: (op, why), arm = pick(n, [r for r in rows if r["n"] != n], st), ("K" if n % 2 == 0 else "O")
    print(f"EPISODE {n}: build the first 10 seconds like this (SKILL.md §3.1). Put these two lines in script.py and the same values in the episode's episodes.json entry (open, cta):")
    print("OPEN = " + json.dumps(op)); print(f'CTA_ARM = "{arm}"'); print()
    for f in FACTORS:
        lv = next(l for l in LIB["factors"][f]["levels"] if l["id"] == op[f])
        print(f"- {f} = {op[f]}  ({why[f]})\n    {LIB['factors'][f]['what']}\n    How: {lv['how']}" + (f"\n    Example: {lv['example']}" if lv.get("example") else "") + (f"\n    Checked: {lv['check']}" if lv.get("check") else ""))
    print(f"- CTA arm {arm}: " + ("keyword. \"Comment WORD and I'll reply with <the cheat sheet>.\" (SKILL.md §4)" if arm == "K" else "no keyword. \"<The cheat sheet> is in the comments.\" + one open question about the lesson (SKILL.md §4)"))
    print("\nIf one level truly cannot fit this story, change that one part to another active level, say why in sources.md, and record what you really built.")

def cmd_report():
    eps, ins, rows, every = load(); st, sc, allm, sd = stats(rows); g = LIB["goal"]; L = []
    asof = max((P(r["as_of_utc"]) for r in ins.values()), default=dt.datetime.now(dt.timezone.utc)) + dt.timedelta(hours=8)
    last = sorted(sc, key=lambda r: r["n"])[-g["window"]:]
    cur = sum(r["r10"] for r in last) / len(last) if last else 0; curh = sum(r["hold3"] for r in last) / len(last) if last else 0
    lab = [r for r in rows if r["lab"]]; combos = {tuple(r["open"].get(f) for f in FACTORS) for r in lab}
    L += ["# Hook lab: which opening keeps people to 10 seconds", "",
          f"As of {asof:%d %b %Y %H:%M} Malaysia time. {len(sc)} Reels scored ({len(lab)} made by the lab, {len(combos)} different openings tried out of 600).", "",
          f"**Goal: {g['r10']}% of viewers still watching at 10 s, averaged over the last {g['window']} scored Reels. Now: {cur:.0f}%** (estimated; {curh:.0f}% get past 3 s, measured).", ""]
    L += ["## The formula so far", "", "| part | best so far | est. at 10 s | lead over the average | sure? |", "|---|---|---|---|---|"]
    for f in FACTORS:
        ok = [l for l in active(f) if st[f][l]["n"] >= 3]
        if len(ok) < 2: L.append(f"| {f} | still testing | | | {sum(1 for l in active(f) if st[f][l]['n'] >= 3)} of {len(active(f))} levels have 3+ scored Reels |"); continue
        b = max(ok, key=lambda l: st[f][l]["post_m"]); s = st[f][b]
        L.append(f"| {f} | **{b}** | {s['r10']:.0f}% | {s['eff']:+.1f} pts | {100 * (s['p_best'] or 0):.0f}% chance it is the best ({s['n']} Reels) |")
    L += ["", "A lead under about 5 points with fewer than 6 Reels a level is still mostly luck: each Reel is shown to only about 130 people.", ""]
    for f in FACTORS:
        L += [f"## {f}", "", LIB["factors"][f]["what"], "", "| level | tried | scored | est. at 10 s | past 3 s | vs average | chance best | |", "|---|---|---|---|---|---|---|---|"]
        for lv in LIB["factors"][f]["levels"]:
            s = st[f][lv["id"]]; a = lv.get("status", "active") == "active"
            flag = "retired" if not a else ("RETIRE?" if s["retire"] else "")
            L.append(f"| {lv['id']} | {s['tried']} | {s['n']} | " + (f"{s['r10']:.0f}% | {s['hold3']:.0f}% | {s['eff']:+.1f}" if s["n"] else "– | – | –") + " | " + (f"{100 * s['p_best']:.0f}%" if s["p_best"] is not None else "–") + f" | {flag} |")
        L.append("")
    L += ["## CTA test (Keith, 28 Nov 2026: alternate the two for about two weeks)", "", "K = \"Comment WORD and I'll reply with the cheat sheet\" (even episodes). O = the cheat sheet is our own first comment + an open question (odd episodes).", "",
          "| arm | Reels | plays (median) | comments | per 1,000 plays | shares + saves |", "|---|---|---|---|---|---|"]
    for arm in ("K", "O", None):
        v = [r for r in every if r.get("cta") == arm and "plays" in r] if arm else [r for r in every if not r.get("cta") and "plays" in r]
        if not v: L.append(f"| {arm or 'before (one-word poll)'} | 0 | | | | |"); continue
        pl = sorted(r["plays"] for r in v); tot = sum(pl); cm = sum(r["comments"] for r in v)
        L.append(f"| {arm or 'before (one-word poll)'} | {len(v)} | {pl[len(pl) // 2]} | {cm:.0f} | {1000 * cm / tot:.2f} | {sum(r['shares'] + r['saves'] for r in v):.0f} |")
    L += ["", "Likes, comments, shares and saves are 0 for Reels whose row in insights.csv has no such columns yet.", ""]
    # the long road (Keith's goal: 100 million views and 100,000 followers)
    plays_all = sum(int(float(r["plays"])) for r in ins.values()); fol = None
    try:
        acc = list(csv.DictReader(open("trends/account.csv"))); fol = int(acc[-1]["followers"]) if acc else None
    except Exception: pass
    recent = sorted((int(float(r["plays"])) for r in sorted(ins.values(), key=lambda r: r["posted_utc"])[-12:-3]), reverse=False)
    med = recent[len(recent) // 2] if recent else 0
    stages = [150, 500, 2000, 10000, 100000]; stage = sum(1 for s in stages if med >= s)
    L += ["## The long road", "", f"- Views so far: {plays_all:,} of 100,000,000. Followers: {fol if fol is not None else '?'} of 100,000.",
          f"- Typical Reel now: {med} plays (median of the 9 Reels before the newest 3). Steps to pass: 150 → 500 → 2,000 → 10,000 → 100,000 plays a Reel. Passed: {stage} of 5.",
          "- At 3 Reels a day, 100 million views in a year needs about 91,000 views a Reel. So the job is not more Reels: it is Reels that Instagram keeps showing, and that starts with the first 10 seconds.", ""]
    ret = [(f, l) for f in FACTORS for l in active(f) if st[f][l]["retire"]]
    L += ["## To do for the next run", ""]
    L += [f"- RETIRE {f} = {l}: {st[f][l]['n']} scored Reels and under {100 * LIB['retire']['p_best_below']:.0f}% chance of being the best among the levels tested. Set its status to \"retired\" in hooklab/library.json and add one new level from the ideas list (SKILL.md §3.1)." for f, l in ret] or ["- Nothing to retire yet."]
    L += ["", "## Every opening so far", "", "| ep | " + " | ".join(FACTORS) + " | cta | plays | past 3 s | est. at 10 s |", "|---|" + "---|" * (len(FACTORS) + 4)]
    for r in sorted(rows, key=lambda r: r["n"]):
        L.append(f"| {r['n']}{'' if r['lab'] else '*'} | " + " | ".join(str(r["open"].get(f) or "?") for f in FACTORS) + f" | {r.get('cta') or ''} | {r.get('plays', '')} | " + (f"{r['hold3']:.0f}% | {r['r10']:.0f}% |" if r["scored"] else "too new | |"))
    L += ["", "\\* labelled by hand afterwards (hooklab/labels.json): a hint, not a test.", "",
          f"How the 10 s number is made: Instagram reports the share who leave in the first 3 s and the average watch time, but no curve. We fit a curve (Weibull, shape {K_SHAPE}) to those two numbers and read it at 10 s. Each Reel is scored once it is {MIN_AGE_H} h old with {MIN_PLAYS}+ plays, and compared with the average of its own format (v2, v3)."]
    open("trends/hooklab.md", "w").write("\n".join(L) + "\n"); print("\n".join(L[:14])); print(f"... trends/hooklab.md written ({len(L)} lines)")

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "pick": cmd_pick(sys.argv[2:])
    else: cmd_report()
