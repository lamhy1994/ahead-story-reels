# Numbers per episode and per format (SKILL.md §9). They come from vidiq_instagram_owner_insights (mode "reels", 0 credits).
#   python3 insights.py set <<'EOF'      one line per Reel, copied from the tool result (any order, any number of Reels):
#   shortcode,timestamp,playCount,avgWatchTimeMs,avgWatchedPct,skipRate,likeCount,commentCount,shares,saves
#   EOF                                  -> updates trends/insights.csv (one row per Reel, newest numbers; a missing value keeps the old one)
#   python3 insights.py followers 9      -> adds a line to trends/account.csv (followersCount from the same tool result)
#   python3 insights.py                  -> writes trends/insights.md
# Then `python3 hooklab.py` scores the openings (trends/hooklab.md). Only Reels at least 24 h old count in the averages here.
import csv, json, sys, datetime as dt, os
os.chdir(os.path.dirname(os.path.abspath(__file__)))      # works from the repo root or from an episode folder (python3 ../../insights.py)
COLS = ["shortcode", "posted_utc", "as_of_utc", "plays", "avg_watch_s", "watched_pct", "skip_pct", "likes", "comments", "shares", "saves"]
P = lambda s: dt.datetime.fromisoformat(s.replace("Z", "+00:00"))
now = lambda: dt.datetime.now(dt.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
def read():
    try: return {r["shortcode"]: r for r in csv.DictReader(open("trends/insights.csv"))}
    except FileNotFoundError: return {}
def write(rows):
    w = csv.DictWriter(open("trends/insights.csv", "w", newline=""), COLS, extrasaction="ignore"); w.writeheader()
    for r in sorted(rows.values(), key=lambda r: r["posted_utc"]): w.writerow({k: r.get(k, "") for k in COLS})
ok = lambda v: v not in ("", "null", "None", None)

if len(sys.argv) > 1 and sys.argv[1] == "set":
    rows = read(); t = now(); n = 0
    for line in sys.stdin:
        f = [x.strip() for x in line.strip().split(",")]
        if len(f) < 6 or f[0].lower() == "shortcode": continue
        f += [""] * (10 - len(f)); r = rows.setdefault(f[0], {"shortcode": f[0]})
        r["posted_utc"] = P(f[1]).strftime("%Y-%m-%dT%H:%M:%SZ"); r["as_of_utc"] = t
        if ok(f[2]): r["plays"] = str(int(float(f[2])))
        if ok(f[3]): r["avg_watch_s"] = f"{float(f[3]) / 1000:.1f}"
        if ok(f[4]): r["watched_pct"] = f"{float(f[4]):.1f}"
        if ok(f[5]): r["skip_pct"] = f"{float(f[5]):.1f}"
        for k, v in zip(("likes", "comments", "shares", "saves"), f[6:10]):
            if ok(v): r[k] = str(int(float(v)))
        n += 1
    write({k: r for k, r in rows.items() if ok(r.get("plays")) and ok(r.get("skip_pct")) and ok(r.get("avg_watch_s"))}); print(f"{n} Reels updated, {len(rows)} in trends/insights.csv"); sys.exit(0)
if len(sys.argv) > 2 and sys.argv[1] == "followers":
    new = not os.path.exists("trends/account.csv"); plays = sum(int(float(r["plays"])) for r in read().values())
    with open("trends/account.csv", "a", newline="") as f:
        w = csv.writer(f)
        if new: w.writerow(["as_of_utc", "followers", "plays_all_reels"])
        w.writerow([now(), int(sys.argv[2]), plays])
    print("followers", sys.argv[2], "plays", plays); sys.exit(0)

from hooklab import r10
EP = {e["permalink"].rstrip("/").split("/")[-1]: e for e in json.load(open("episodes.json")) if e.get("permalink")}
rows = list(read().values()); num = lambda r, k: float(r[k]) if ok(r.get(k)) else 0.0
out = ["# Numbers by episode (Instagram owner insights, free)", "",
       "Format v1 = episodes 1-8 (60-90 s); v2 = from 22 Nov 2026 (hook card, 45-60 s, about 160 wpm); v3 = from 28 Nov 2026 (hook lab opening, lesson card, cheat-sheet CTA). Averages count Reels at least 24 h old. \"At 10 s\" is an estimate (hooklab.py).", "",
       "| ep | title | fmt | len s | plays | avg watch s | watched % | skip % | at 10 s | likes | comments | shares+saves | age h |", "|---|---|---|---|---|---|---|---|---|---|---|---|---|"]
agg = {}
for r in sorted(rows, key=lambda r: EP.get(r["shortcode"], {}).get("n", 999)):
    e = EP.get(r["shortcode"], {}); fmt = e.get("format", "v1" if e.get("n", 99) <= 8 else "v2")
    age = (P(r["as_of_utc"]) - P(r["posted_utc"])).total_seconds() / 3600
    w, p, s = float(r["avg_watch_s"]), float(r["watched_pct"]), float(r["skip_pct"]); t10 = r10(s, w, float(e["length_s"])) if e.get("length_s") else 0
    out.append(f"| {e.get('n', '?')} | {e.get('title', r['shortcode'])} | {fmt} | {e.get('length_s', '')} | {r['plays']} | {w:.1f} | {p:.1f} | {s:.1f} | {t10:.0f}% | {num(r, 'likes'):.0f} | {num(r, 'comments'):.0f} | {num(r, 'shares') + num(r, 'saves'):.0f} | {age:.0f}{'' if age >= 24 else ' (too new)'} |")
    if age >= 24: agg.setdefault(fmt, []).append((w, p, s, int(float(r["plays"])), t10, num(r, "likes"), num(r, "comments"), num(r, "shares") + num(r, "saves")))
out += ["", "| format | Reels counted | avg watch s | watched % | skip % | at 10 s | plays (median) | likes | comments | shares+saves |", "|---|---|---|---|---|---|---|---|---|---|"]
for fmt, v in sorted(agg.items()):
    n = len(v); med = sorted(x[3] for x in v)[n // 2]; a = lambda i: sum(x[i] for x in v) / n
    out.append(f"| {fmt} | {n} | {a(0):.1f} | {a(1):.1f} | {a(2):.1f} | {a(4):.0f}% | {med} | {sum(x[5] for x in v):.0f} | {sum(x[6] for x in v):.0f} | {sum(x[7] for x in v):.0f} |")
asof = max(P(r["as_of_utc"]) for r in rows) + dt.timedelta(hours=8)
out += ["", f"As of {asof:%d %b %Y %H:%M} Malaysia time. Each Reel is shown to about 130 people at first, so one Reel's numbers swing by several points: read trends over 5+ Reels. Openings are compared in trends/hooklab.md."]

# Where viewers leave (Keith, 28 Nov 2026: fix every second where people swipe away, not only the hook). Instagram's API gives two
# numbers a Reel (skip rate, average watch time) and no curve, so these are read off the same fitted curve as "at 10 s":
# estimates of the shape, not measurements. The real curve is the Retention chart in the Instagram app (trends/retention.md).
def leave(r, e):
    L = float(e["length_s"]); s, w = float(r["skip_pct"]), float(r["avg_watch_s"]); at = lambda t: r10(s, w, L, at=t)
    half = next((t / 2 for t in range(6, int(L * 2) + 1) if at(t / 2) <= (100 - s) / 2), L)      # when half of those who stayed past 3 s are gone
    per_s = 100 * (1 - (at(min(20.0, L)) / (100 - s)) ** (1 / (min(20.0, L) - 3)))                # share of the remaining viewers lost each second, 3-20 s
    return [100 - s, at(10), at(min(20.0, L)), at(min(30.0, L)), at(L), half, per_s]
lv = [(EP[r["shortcode"]], leave(r, EP[r["shortcode"]])) for r in rows if EP.get(r["shortcode"], {}).get("length_s") and float(r["plays"]) >= 60]
if lv:
    lv.sort(key=lambda x: x[0]["n"]); fm = lambda e: e.get("format", "v1" if e["n"] <= 8 else "v2")
    out += ["", "## Where viewers leave (estimates)", "",
            "Share of plays still watching at each point, read off the fitted curve (not measured). `leak` is the share of the viewers still there who leave each second between 3 and 20 s; `half gone` is when half of those who stayed past 3 s have left. The hook decides the first column; the script and the picture decide the rest.", "",
            "| Reels | past 3 s | at 10 s | at 20 s | at 30 s | at the end | half gone by | leak a second |", "|---|---|---|---|---|---|---|---|"]
    row = lambda name, v: f"| {name} | {v[0]:.0f}% | {v[1]:.0f}% | {v[2]:.0f}% | {v[3]:.0f}% | {v[4]:.0f}% | {v[5]:.0f} s | {v[6]:.1f}% |"
    for f in sorted({fm(e) for e, _ in lv}):
        g = [v for e, v in lv if fm(e) == f]; out.append(row(f"{f} (average of {len(g)})", [sum(x[i] for x in g) / len(g) for i in range(7)]))
    for e, v in lv[-6:]: out.append(row(f"ep {e['n']} {e['title']} ({fm(e)}, {e['length_s']:.0f} s)", v))
open("trends/insights.md", "w").write("\n".join(out) + "\n"); print("\n".join(out))
