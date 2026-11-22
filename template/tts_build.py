# Builds audio/vo_final.wav + audio/timing.json (+ web/timing.js) from script.py
# Pace (Keith, 22 Nov 2026): about 160 words a minute over the whole video. Pauses inside a paragraph are capped at CAP s,
# PAUSE (script.py) is the silence between paragraphs. Length: 45-60 s by default; over 75 s only with LONG = "reason" in script.py.
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
    hook = getattr(script, "HOOK", None)          # the hook card: 2 short lines (*word* = amber) + a small subline with subject and date
    if hook: T["hook"] = {"lines": list(hook), "sub": getattr(script, "HOOK_SUB", "")}
    return a, T
def pace_report(T):
    """Video length and pace; returns a list of problems that must be fixed before rendering."""
    nw = len(T["words"]); L = T["duration"] + 1.25; wpm = nw / L * 60; long_ok = getattr(script, "LONG", None); bad = []
    print(f"VIDEO {L:.1f} s, {nw} words, {wpm:.0f} wpm overall (target about 160; 45-60 s by default)")
    if L < 30 or L > 120: bad.append(f"length {L:.1f} s is outside 30-120 s")
    elif L > 75 and not long_ok: bad.append(f"length {L:.1f} s is over 75 s: cut the script, or set LONG = \"<reason>\" in script.py if the story really needs it")
    elif L > 60: print(f"note: {L:.1f} s is over the 60 s default" + (f" (LONG: {long_ok})" if long_ok else ": keep it only if every sentence earns its place"))
    if wpm < 150: print(f"WARN: {wpm:.0f} wpm is slow: fewer commas and full stops, longer paragraphs (fewer PAUSEs), shorter number phrases; speed at most 1.2")
    if not getattr(script, "HOOK", None): bad.append("no HOOK in script.py (the hook card on the first frame)")
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
    bad = pace_report(T)
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
