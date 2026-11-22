# Retention per episode and per format (SKILL.md §9). Numbers come from vidiq_instagram_owner_insights
# (mode "reels", 0 credits): copy them into trends/insights.csv (one row per Reel, newest numbers), then run
#   python3 insights.py        -> writes trends/insights.md
# Only Reels at least 24 h old count in the averages (younger ones are still being shown to new people).
import csv, json, datetime as dt
EP = {e["permalink"].rstrip("/").split("/")[-1]: e for e in json.load(open("episodes.json")) if e.get("permalink")}
rows = list(csv.DictReader(open("trends/insights.csv")))
P = lambda s: dt.datetime.fromisoformat(s.replace("Z", "+00:00"))
out = ["# Retention by episode (Instagram owner insights, free)", "",
       "Format v1 = episodes 1-8 (60-90 s); v2 = from 22 Nov 2026 (hook card, 45-60 s, about 160 wpm). Averages count Reels at least 24 h old.", "",
       "| ep | title | fmt | len s | wpm | plays | avg watch s | watched % | skip % | age h |", "|---|---|---|---|---|---|---|---|---|---|"]
agg = {}
for r in sorted(rows, key=lambda r: EP.get(r["shortcode"], {}).get("n", 999)):
    e = EP.get(r["shortcode"], {}); fmt = e.get("format", "v1" if e.get("n", 99) <= 8 else "v2")
    age = (P(r["as_of_utc"]) - P(r["posted_utc"])).total_seconds() / 3600
    w, p, s = float(r["avg_watch_s"]), float(r["watched_pct"]), float(r["skip_pct"])
    out.append(f"| {e.get('n', '?')} | {e.get('title', r['shortcode'])} | {fmt} | {e.get('length_s', '')} | {e.get('wpm', '')} | {r['plays']} | {w:.1f} | {p:.1f} | {s:.1f} | {age:.0f}{'' if age >= 24 else ' (too new)'} |")
    if age >= 24: agg.setdefault(fmt, []).append((w, p, s, int(r["plays"])))
out += ["", "| format | Reels counted | avg watch s | watched % | skip % | plays (median) |", "|---|---|---|---|---|---|"]
for fmt, v in sorted(agg.items()):
    n = len(v); med = sorted(x[3] for x in v)[n // 2]
    out.append(f"| {fmt} | {n} | {sum(x[0] for x in v)/n:.1f} | {sum(x[1] for x in v)/n:.1f} | {sum(x[2] for x in v)/n:.1f} | {med} |")
asof = max(P(r["as_of_utc"]) for r in rows) + dt.timedelta(hours=8)
out += ["", f"As of {asof:%d %b %Y %H:%M} Malaysia time. Small samples: treat differences under ~5 s of watch time as noise until each format has 6+ Reels."]
open("trends/insights.md", "w").write("\n".join(out) + "\n"); print("\n".join(out))
