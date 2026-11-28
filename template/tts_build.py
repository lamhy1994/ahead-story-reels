# Builds audio/vo_final.wav + audio/timing.json (+ web/timing.js) from script.py
# Pace (Keith, 22 Nov 2026): about 160 words a minute over the whole video. Pauses inside a paragraph are capped at CAP s,
# PAUSE (script.py) is the silence between paragraphs. Length: 45-60 s by default; over 75 s only with LONG = "reason" in script.py.
# Format v3 (Keith, 28 Nov 2026): the opening comes from the hook lab (OPEN), the script has named parts (PARTS: hook, lock-in, body 1,
# rehook, body 2, lesson, CTA), a lesson card (LESSON, LESSON_USE) and a cheat sheet (CTA_ARM, CTA, SHEET). v3_report() checks them.
import sys, re, json, numpy as np, soundfile as sf
from ttslib import *
import script
from script import S, PARAS, PAUSE, plain
SR = 24000; CAP = 0.30
norm = lambda s: re.sub(r"[^a-z0-9]", "", s.lower())
def cap_pauses(seg, cap=CAP, db=-40.0):
    """Shorten every silence inside a paragraph to `cap` seconds. Returns the new audio and a time map old -> new (s)."""
    H = int(0.005 * SR); w = int(0.02 * SR); x = seg.astype(np.float64)
    e = np.sqrt(np.convolve(x * x, np.ones(w) / w, "same")[::H]); q = e < e.max() * 10 ** (db / 20)
    cuts = []; i = 0
    while i < len(q):
        if not q[i]: i += 1; continue
        j = i
        while j < len(q) and q[j]: j += 1
        a, b = i * H, min(j * H, len(seg))
        if a > 0 and b < len(seg) and b - a > int((cap + 0.03) * SR):
            k = int(cap * SR); cuts.append((a + k // 2, b - (k - k // 2)))
        i = j
    if not cuts: return seg, (lambda t: t)
    parts = []; prev = 0; f = int(0.004 * SR)
    for ca, cb in cuts:
        p = seg[prev:ca].copy()
        if prev and len(p) > f: p[:f] *= np.linspace(0, 1, f)
        if len(p) > f: p[-f:] *= np.linspace(1, 0, f)
        parts.append(p); prev = cb
    p = seg[prev:].copy(); p[:f] *= np.linspace(0, 1, f); parts.append(p)
    def fmap(t):
        s = int(round(t * SR)); rem = 0
        for ca, cb in cuts:
            if s >= cb: rem += cb - ca
            elif s > ca: rem += s - ca; break
            else: break
        return (s - rem) / SR
    return np.concatenate(parts).astype(np.float32), fmap
def build(voice, speed, lead=0.12, tail=1.25):
    out = [np.zeros(int(lead * SR), np.float32)]; t = lead; sentences = []; words = []
    for pi, idxs in enumerate(PARAS):
        text = " ".join(S[i][0] for i in idxs)
        a, toks = synth(text, voice, speed)
        tt = [x for x in toks if x[1] is not None and norm(x[0])]
        s0 = max(0.0, tt[0][1] - 0.04)
        e_tok = tt[-1][2]; tl = a[int(e_tok * SR):]; thr = 0.012 * np.max(np.abs(a)); idx = np.where(np.abs(tl) > thr)[0]
        e1 = min(e_tok + (idx[-1] / SR if len(idx) else 0) + 0.06, len(a) / SR)
        seg = a[int(s0 * SR):int(e1 * SR)].astype(np.float32).copy(); fi = int(0.008 * SR); seg[:fi] *= np.linspace(0, 1, fi); seg[-fi:] *= np.linspace(1, 0, fi)
        seg, fm = cap_pauses(seg)
        # tokens -> display words (a word may be split over several tokens, e.g. Cairo + 's)
        k = 0
        for i in idxs:
            dw = plain(S[i][0]).split(); kws = list(S[i][1]); first = None; last = None
            for w in dw:
                acc = ""; ws = None; we = None
                while norm(acc) != norm(w):
                    assert k < len(tt), ("ran out of tokens", w, acc)
                    acc += tt[k][0]; ws = tt[k][1] if ws is None else ws; we = tt[k][2]; k += 1
                    assert norm(w).startswith(norm(acc)), ("token mismatch", w, acc)
                m = next((k for k in kws if k.lower() == w.lower()), None)      # keyword written in capitals (e.g. "GOLD,") shows that way on screen
                if m: kws.remove(m)
                words.append({"si": i + 1, "t": m or w, "kw": bool(m), "s": round(t + fm(ws - s0), 3), "e": round(t + fm(we - s0), 3)})
                first = words[-1]["s"] if first is None else first; last = words[-1]["e"]
            assert not kws, ("keyword not found", i, kws)
            sentences.append({"i": i + 1, "s": round(first - 0.04, 3), "e": round(last, 3), "text": plain(S[i][0])})
        assert k == len(tt), ("unused tokens", [x[0] for x in tt[k:]])
        sentences[-1]["e"] = round(t + len(seg) / SR, 3)
        out.append(seg); t += len(seg) / SR
        pz = PAUSE[pi]; out.append(np.zeros(int(pz * SR), np.float32)); t += pz
    out.append(np.zeros(int(tail * SR), np.float32))
    a = np.concatenate(out); a = a / (np.max(np.abs(a)) + 1e-9) * 0.89
    T = {"duration": round(sentences[-1]["e"], 3), "sentences": sentences, "words": words}
    op = dict(getattr(script, "OPEN", None) or {}); T["open"] = op; T["sub"] = getattr(script, "HOOK_SUB", "")
    hook = getattr(script, "HOOK", None)          # the hook card: 2 short lines (*word* = amber) + a small subline with subject and date
    if hook and op.get("text", "card") == "card": T["hook"] = {"lines": list(hook), "sub": getattr(script, "HOOK_SUB", "")}
    big = getattr(script, "BIG", None)            # the big number at 1.5-3 s: (value, what, when), e.g. ("−$2.9 TRILLION", "wiped off the S&P 500 in one day", "5 Nov 2026")
    if big and op.get("beat2", "dark") != "event": T["big"] = {"value": big[0], "label": big[1] if len(big) > 1 else "", "when": big[2] if len(big) > 2 else "", "dir": big[3] if len(big) > 3 else ""}   # dir "down"/"up": red diving line or amber climbing (default: red when the value starts with a minus)
    les = getattr(script, "LESSON", None)         # the lesson card: 2 short lines (*word* = amber) + the check the viewer can use
    if les: T["lesson"] = {"lines": list(les), "use": getattr(script, "LESSON_USE", "")}
    arm = getattr(script, "CTA_ARM", None); c = getattr(script, "CTA", None) or {}
    if arm: T["cta"] = {"arm": arm, "word": c.get("word", ""), "get": c.get("get", ""), "ask": c.get("ask", "")}
    parts = getattr(script, "PARTS", None)        # when each part starts and ends, and its sentence numbers (1-based, as in scene.js)
    if parts: T["parts"] = {k: {"s": sentences[v[0]]["s"], "e": sentences[v[-1]]["e"], "i": [x + 1 for x in v]} for k, v in parts.items() if v and max(v) < len(sentences)}
    return a, T
def pace_report(T):
    """Video length and pace; returns a list of problems that must be fixed before rendering."""
    nw = len(T["words"]); L = T["duration"] + 1.25; wpm = nw / L * 60; long_ok = getattr(script, "LONG", None); bad = []
    print(f"VIDEO {L:.1f} s, {nw} words, {wpm:.0f} wpm overall (target about 160; 45-60 s by default)")
    if L < 30 or L > 120: bad.append(f"length {L:.1f} s is outside 30-120 s")
    elif L > 75 and not long_ok: bad.append(f"length {L:.1f} s is over 75 s: cut the script, or set LONG = \"<reason>\" in script.py if the story really needs it")
    elif L > 60: print(f"note: {L:.1f} s is over the 60 s default" + (f" (LONG: {long_ok})" if long_ok else ": keep it only if every sentence earns its place"))
    if wpm < 150: print(f"WARN: {wpm:.0f} wpm is slow: fewer commas and full stops, longer paragraphs (fewer PAUSEs), shorter number phrases; speed at most 1.2")
    bw = getattr(script, "BIG_WORD", None)
    if bw and T.get("big"):
        ws = [w for w in T["words"] if w["si"] == 1 and re.sub(r"[^a-z0-9]", "", w["t"].lower()) == re.sub(r"[^a-z0-9]", "", bw.lower())]
        if not ws: bad.append(f"BIG_WORD {bw!r} is not in sentence 1")
        elif not 1.2 <= ws[0]["s"] <= 3.0: print(f"WARN: the big number is said at {ws[0]['s']:.2f} s; it is on screen 1.5-3 s (move it in sentence 1)")
        else: print(f"big number said at {ws[0]['s']:.2f} s (on screen 1.5-3 s)")
    return bad
def lab_library():
    """hooklab/library.json from the repo root (the episode folder is two levels below it, template/ one)."""
    import os
    d = os.getcwd()
    for _ in range(4):
        p = os.path.join(d, "hooklab", "library.json")
        if os.path.exists(p): return json.load(open(p))
        d = os.path.dirname(d)
    return None
ADVICE = re.compile(r"\b(you should (buy|sell|hold)|buy now|sell now|must buy|must sell|guarantee[sd]?|risk[- ]free|can't lose|cannot lose|will (rise|go up|moon|double|recover)|get rich|easy money)\b", re.I)
NOLINK = re.compile(r"(https?://|www\.|\.com\b|\.app\b|link in bio|bybit|dm me|whatsapp|telegram)", re.I)
NUMW = r"\d|\b(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|hundred|thousand|million|billion|trillion|half|a third|a quarter)\b"
ORDER = ["hook", "lock", "body1", "rehook", "body2", "lesson", "cta"]
def v3_report(T):
    """Format v3 checks (SKILL.md §3-4); returns a list of problems that must be fixed before rendering."""
    bad = []; op = T.get("open") or {}; L = T["duration"] + 1.25; lib = lab_library()
    if not op: bad.append("no OPEN in script.py: run `python3 ../../hooklab.py pick` and paste its two lines (OPEN, CTA_ARM)")
    elif lib:
        for f in lib["factors"]:
            ids = [l["id"] for l in lib["factors"][f]["levels"] if l.get("status", "active") == "active"]
            if op.get(f) not in ids: bad.append(f"OPEN[{f!r}] = {op.get(f)!r} is not an active level in hooklab/library.json ({', '.join(ids)})")
    if op.get("text", "card") == "card" and not T.get("hook"): bad.append("OPEN text is card but script.py has no HOOK (the hook card on the first frame)")
    if op.get("beat2", "dark") in ("dark", "world") and not T.get("big"): bad.append(f"OPEN beat2 is {op.get('beat2', 'dark')} but script.py has no BIG (the big number at 1.5-3 s)")
    if getattr(script, "HOOK", None) and op.get("text") == "captions": print("note: HOOK is ignored (OPEN text is captions): the first sentence shows as captions from frame 0, HOOK_SUB as a small chip")
    if getattr(script, "BIG", None) and op.get("beat2") == "event": print("note: BIG is ignored (OPEN beat2 is event): something must happen in the world at 1.5 s (T.beat2 in scene.js)")
    s1 = plain(S[0][0]); w1 = s1.split(); wd = op.get("words")
    if len(w1) > 14: print(f"WARN: the first sentence has {len(w1)} words; 14 at most")
    if wd == "number" and not re.search(NUMW, " ".join(w1[:3]).lower()): print("WARN: OPEN words is number, but the first sentence does not start with the figure (first 3 words)")
    if wd == "question" and not s1.strip().endswith("?"): print("WARN: OPEN words is question, but the first sentence is not a question")
    if wd == "you" and not re.search(r"\byou(r|'re|’re)?\b", s1.lower()): print("WARN: OPEN words is you, but the first sentence does not say you or your")
    if wd == "scene" and (len(w1) > 12 or re.search(r"\d", s1)): print("WARN: OPEN words is scene: a moment in at most 12 words, no figure (the size of the story comes in sentence 2)")
    parts = getattr(script, "PARTS", None); cta_text = plain(S[-1][0])
    if not parts: bad.append("no PARTS in script.py (hook, lock, body1, rehook, body2, lesson, cta)")
    else:
        miss = [k for k in ORDER if not parts.get(k)]; flat = [i for k in ORDER for i in parts.get(k, [])]
        if miss: bad.append(f"PARTS is missing {', '.join(miss)}")
        elif flat != list(range(len(S))): bad.append("PARTS must list every sentence exactly once, in this order: hook, lock, body1, rehook, body2, lesson, cta")
        else:
            Pt = T["parts"]; cta_text = " ".join(plain(S[i][0]) for i in parts["cta"])
            print("parts: " + " · ".join(f"{k} {Pt[k]['s']:.1f} s" for k in ORDER) + f" · end {L:.1f} s")
            le = Pt["lock"]["e"]; rh = Pt["rehook"]["s"] / L; nrh = sum(len(plain(S[i][0]).split()) for i in parts["rehook"])
            if le > 12.5: bad.append(f"the lock-in ends at {le:.1f} s: it must end by 12 s (aim for 10). Shorten sentences 2-3")
            elif le > 11: print(f"WARN: the lock-in ends at {le:.1f} s; aim for 10 s")
            if not 0.30 <= rh <= 0.62: print(f"WARN: the rehook comes at {100 * rh:.0f}% of the video ({Pt['rehook']['s']:.1f} s); aim for 35-55% (about 20-30 s)")
            if nrh > 12: print(f"WARN: the rehook has {nrh} words; one short sentence, 12 words at most")
            if Pt["lesson"]["s"] / L < 0.6: print(f"WARN: the lesson starts at {100 * Pt['lesson']['s'] / L:.0f}% of the video; it belongs in the last third, after the story has paid off")
            if L - Pt["cta"]["s"] > 8.5: print(f"WARN: the CTA takes {L - Pt['cta']['s']:.1f} s; keep it to 4-7 s")
            if op.get("lock") == "lesson" and not re.search(r"\byou(r|'re|’re)?\b", " ".join(plain(S[i][0]) for i in parts["lock"]).lower()): print("WARN: OPEN lock is lesson, but sentences 2-3 do not say you or your")
    les = getattr(script, "LESSON", None)
    if not les: bad.append("no LESSON in script.py (the lesson card: 2 short lines, one *amber* word)")
    else:
        nw = sum(len(x.replace("*", "").split()) for x in les)
        if len(les) > 2 or nw > 12: print(f"WARN: LESSON has {len(les)} lines and {nw} words; 2 lines and 12 words at most")
        if not getattr(script, "LESSON_USE", None): bad.append("no LESSON_USE in script.py (the check the viewer can use: a question to ask or a number to look up, never buy or sell)")
    arm = getattr(script, "CTA_ARM", None); c = getattr(script, "CTA", None) or {}; sheet = (getattr(script, "SHEET", "") or "").strip()
    if arm not in ("K", "O"): bad.append("CTA_ARM must be \"K\" or \"O\" (hooklab.py pick prints it)")
    if not c.get("get"): bad.append("CTA has no \"get\" (what the commenter gets, a few words: \"3 questions to ask first\")")
    if arm == "K":
        w = c.get("word", "")
        if not re.fullmatch(r"[A-Z0-9]{3,7}", w): bad.append("arm K: CTA[\"word\"] must be 3-7 capital letters from the story (GOLD, MATH, TOP10)")
        elif w.lower() not in cta_text.lower(): bad.append(f"arm K: the CTA sentence does not say the keyword {w}")
        if "reply" not in cta_text.lower(): print("WARN: arm K: say what they get and how: \"Comment WORD and I'll reply with ...\"")
    if arm == "O":
        if re.search(r"\b[Cc]omment:?\s+[A-Z]{3,}\b", cta_text): bad.append("arm O must not ask for a keyword: the cheat sheet is in the comments, then one open question")
        if "?" not in cta_text or not c.get("ask"): bad.append("arm O: the CTA ends on one open question about the lesson (CTA[\"ask\"], and say it)")
        if "comments" not in cta_text.lower(): print("WARN: arm O: say where the cheat sheet is (\"... is in the comments\")")
    if not sheet: bad.append("no SHEET in script.py (the cheat sheet a commenter gets)")
    elif len(sheet) > 700: bad.append(f"SHEET has {len(sheet)} characters; 700 at most")
    for name, txt in (("SHEET", sheet), ("the script", " ".join(plain(x[0]) for x in S)), ("LESSON", " ".join(les or []) + " " + (getattr(script, "LESSON_USE", "") or ""))):
        m = ADVICE.search(txt)
        if m: bad.append(f"{name} reads like advice or a promise (\"{m.group(0)}\"): teach how it works and what to check, never what to buy or sell")
    m = NOLINK.search(sheet)
    if m: bad.append(f"SHEET must not carry links, other apps or Bybit (\"{m.group(0)}\")")
    return bad
def auto_speed(voice, target=160, lo=0.95, hi=1.2):
    """Kokoro speed that puts the whole video at about `target` words a minute (2-4 voice passes)."""
    s = 1.08; tried = []
    for _ in range(4):
        a, T = build(voice, s); w = len(T["words"]) / (T["duration"] + 1.25) * 60; tried.append((abs(w - target), s, w, a, T))
        print(f"  speed {s:.3f}: {w:.0f} wpm")
        if abs(w - target) <= 5 or (s >= hi and w < target) or (s <= lo and w > target): break
        if len(tried) == 1: ns = s * (target / w) ** 1.6
        else:
            (_, s0, w0, _, _), (_, s1, w1, _, _) = tried[-2], tried[-1]
            ns = s1 + (target - w1) * (s1 - s0) / (w1 - w0) if abs(w1 - w0) > 0.5 else s1 * (target / w1) ** 1.6
        ns = round(min(hi, max(lo, ns)), 3)
        if any(abs(ns - x[1]) < 0.004 for x in tried): break
        s = ns
    _, s, w, a, T = min(tried, key=lambda x: x[0])
    return s, a, T
if __name__ == "__main__":
    voice = sys.argv[1] if len(sys.argv) > 1 else "bm_george"; sp = sys.argv[2] if len(sys.argv) > 2 else "auto"
    if sp == "auto": speed, a, T = auto_speed(voice)
    else: speed = float(sp); a, T = build(voice, speed)
    sf.write("audio/vo_final.wav", a, SR); json.dump(T, open("audio/timing.json", "w"), indent=1)
    open("web/timing.js", "w").write("window.TIMING = " + json.dumps(T) + ";\n")
    nw = len(T["words"]); sp = sum(s["e"] - s["s"] for s in T["sentences"]); med, p10, p90 = f0_stats(a.astype(np.float64), SR)
    print(f"voice {voice} speed {speed}: {T['duration']:.2f} s, {nw} words, {nw/sp*60:.0f} wpm while speaking, pitch median {med:.0f} Hz ({p10:.0f}-{p90:.0f})")
    print("sentence starts:", " ".join(f"S{s['i']} {s['s']:.2f}" for s in T["sentences"]))
    bad = pace_report(T) + v3_report(T)
    # recognition check
    from faster_whisper import WhisperModel
    from scipy.signal import resample_poly
    wm = WhisperModel("small.en", device="cpu", compute_type="int8")
    segs, _ = wm.transcribe(resample_poly(a, 2, 3).astype(np.float32), language="en", beam_size=5, word_timestamps=True)
    heard = [(norm(w.word), w.start) for s in segs for w in s.words]
    print("HEARD:", " ".join(h[0] for h in heard))
    miss = [w["t"] for w in T["words"] if not any(h[0] == norm(w["t"]) and abs(h[1] - w["s"]) < 1.2 for h in heard)]
    print("caption words not heard near their time:", miss)
    if bad: print("FIX BEFORE RENDERING:"); [print(" -", b) for b in bad]; sys.exit(2)
