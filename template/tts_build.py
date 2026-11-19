# Builds audio/vo_final.wav + audio/timing.json (+ web/timing.js) from script.py
import sys, re, json, numpy as np, soundfile as sf
from ttslib import *
from script import S, PARAS, PAUSE, plain
SR = 24000
norm = lambda s: re.sub(r"[^a-z0-9]", "", s.lower())
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
                words.append({"si": i + 1, "t": m or w, "kw": bool(m), "s": round(t + ws - s0, 3), "e": round(t + we - s0, 3)})
                first = words[-1]["s"] if first is None else first; last = words[-1]["e"]
            assert not kws, ("keyword not found", i, kws)
            sentences.append({"i": i + 1, "s": round(first - 0.04, 3), "e": round(last, 3), "text": plain(S[i][0])})
        assert k == len(tt), ("unused tokens", [x[0] for x in tt[k:]])
        sentences[-1]["e"] = round(t + len(seg) / SR, 3)
        out.append(seg); t += len(seg) / SR
        pz = PAUSE[pi]; out.append(np.zeros(int(pz * SR), np.float32)); t += pz
    out.append(np.zeros(int(tail * SR), np.float32))
    a = np.concatenate(out); a = a / (np.max(np.abs(a)) + 1e-9) * 0.89
    return a, {"duration": round(sentences[-1]["e"], 3), "sentences": sentences, "words": words}
if __name__ == "__main__":
    voice = sys.argv[1] if len(sys.argv) > 1 else "bm_george"; speed = float(sys.argv[2]) if len(sys.argv) > 2 else 1.0
    a, T = build(voice, speed)
    sf.write("audio/vo_final.wav", a, SR); json.dump(T, open("audio/timing.json", "w"), indent=1)
    open("web/timing.js", "w").write("window.TIMING = " + json.dumps(T) + ";\n")
    nw = len(T["words"]); sp = sum(s["e"] - s["s"] for s in T["sentences"]); med, p10, p90 = f0_stats(a.astype(np.float64), SR)
    print(f"voice {voice} speed {speed}: {T['duration']:.2f} s, {nw} words, {nw/sp*60:.0f} wpm while speaking, pitch median {med:.0f} Hz ({p10:.0f}-{p90:.0f})")
    print("sentence starts:", " ".join(f"S{s['i']} {s['s']:.2f}" for s in T["sentences"]))
    # recognition check
    from faster_whisper import WhisperModel
    from scipy.signal import resample_poly
    wm = WhisperModel("small.en", device="cpu", compute_type="int8")
    segs, _ = wm.transcribe(resample_poly(a, 2, 3).astype(np.float32), language="en", beam_size=5, word_timestamps=True)
    heard = [(norm(w.word), w.start) for s in segs for w in s.words]
    print("HEARD:", " ".join(h[0] for h in heard))
    num = {"1324": "1324"}
    miss = [w["t"] for w in T["words"] if not any(h[0] == norm(w["t"]) and abs(h[1] - w["s"]) < 1.2 for h in heard)]
    print("caption words not heard near their time:", miss)
