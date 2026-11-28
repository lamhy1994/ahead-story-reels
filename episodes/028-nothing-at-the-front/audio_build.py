# Soundtrack for "Nothing at the Front" (episode 28, turn format): soft music + gentle sound effects, all synthesized.
# Reads audio/cues.json (exported from the scene) so every sound sits on the picture.
import json, numpy as np, soundfile as sf
from scipy import signal
SR = 48000
CU = json.load(open("audio/cues.json")); T = CU["T"]; DUR = CU["DUR"]; N = int(DUR * SR)
OPEN = CU.get("open", {}); ARM = CU.get("arm", "K")          # the opening from the hook lab and the CTA arm (scene.js exports them)
rng = np.random.default_rng(1128)
db = lambda d: 10 ** (d / 20)
def env_exp(n, tau, att=0.002):
    t = np.arange(n) / SR; e = np.exp(-t / tau); a = int(att * SR)
    if a > 0: e[:a] *= np.linspace(0, 1, a)
    return e
def place(buf, t, pan, gain, tgt):
    if isinstance(buf, tuple): bl, br = buf
    else: bl = br = buf
    i = int(t * SR)
    if i >= N or i < 0: return
    n = min(len(bl), N - i); tgt[0][i:i + n] += bl[:n] * gain * np.sqrt(1 - pan); tgt[1][i:i + n] += br[:n] * gain * np.sqrt(1 + pan)
MUS = (np.zeros(N), np.zeros(N)); SFX = (np.zeros(N), np.zeros(N))
mus = lambda buf, t, pan=0.0, gain=1.0: place(buf, t, pan, gain, MUS)
sfx = lambda buf, t, pan=0.0, gain=1.0: place(buf, t, pan, gain, SFX)

# ───────── instruments
NOTE = {n: i for i, n in enumerate(["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"])}; NOTE["Bb"] = 10; NOTE["Eb"] = 3
def hz(name): n, o = name[:-1], int(name[-1]); return 440.0 * 2 ** ((NOTE[n] - 9) / 12 + (o - 4))
def pluck(f, dur=1.9, bright=1.0):          # soft harp / oud-like string
    n = int(dur * SR); t = np.arange(n) / SR; x = np.zeros(n)
    for k in range(1, 11):
        if f * k > 9000: break
        x += (bright ** (k - 1)) / k ** 1.15 * np.sin(2 * np.pi * f * k * (1 + 0.0004 * k * k) * t) * np.exp(-t * (1.7 + 0.85 * k))
    a = int(0.003 * SR); x[:a] *= np.linspace(0, 1, a); return x * 0.6
def kalimba(f, dur=1.3):                    # music-box sparkle
    n = int(dur * SR); t = np.arange(n) / SR
    x = np.sin(2 * np.pi * f * t) * np.exp(-t / 0.32) + 0.3 * np.sin(2 * np.pi * f * 3.01 * t) * np.exp(-t / 0.07) + 0.12 * np.sin(2 * np.pi * f * 5.4 * t) * np.exp(-t / 0.03)
    a = int(0.002 * SR); x[:a] *= np.linspace(0, 1, a); return x * 0.5
def pad(freqs, dur, att=0.9, rel=1.4):      # warm chord bed, slightly wide
    n = int((dur + rel) * SR); t = np.arange(n) / SR; l = np.zeros(n); r = np.zeros(n)
    for f in freqs:
        for det, w in ((-0.004, 1), (0.003, 1), (0, 0.8)):
            ph = rng.uniform(0, 6.28); s = np.sin(2 * np.pi * f * (1 + det) * t + ph) + 0.22 * np.sin(2 * np.pi * 2 * f * (1 + det) * t + ph * 1.7)
            l += s * w * (1 if det <= 0 else 0.55); r += s * w * (1 if det >= 0 else 0.55)
    e = np.minimum(1, t / att) * np.minimum(1, np.maximum(0, (dur + rel - t) / rel)); e = e ** 1.3 * (0.86 + 0.14 * np.sin(2 * np.pi * 0.21 * t))
    return l * e / len(freqs) * 0.36, r * e / len(freqs) * 0.36
def bass(f, dur):
    n = int((dur + 0.5) * SR); t = np.arange(n) / SR; e = np.minimum(1, t / 0.12) * np.minimum(1, np.maximum(0, (dur + 0.5 - t) / 0.5))
    return (np.sin(2 * np.pi * f * t) + 0.18 * np.sin(2 * np.pi * 2 * f * t)) * e * 0.5
def doum(): n = int(0.42 * SR); t = np.arange(n) / SR; ff = 52 + 44 * np.exp(-t / 0.05); return np.sin(2 * np.pi * np.cumsum(ff) / SR) * env_exp(n, 0.11, 0.004)
def tek(f=2600):
    n = int(0.07 * SR); x = rng.standard_normal(n); sos = signal.butter(2, [f * 0.6, f * 1.9], btype="band", fs=SR, output="sos"); return signal.sosfilt(sos, x) * env_exp(n, 0.014, 0.0008)
def tick(f=3200, dur=0.02, noise=0.6):
    n = int(dur * SR); t = np.arange(n) / SR; x = np.sin(2 * np.pi * f * t) * (1 - noise) + noise * rng.standard_normal(n) * 0.7
    sos = signal.butter(2, [max(300, f * 0.5), min(f * 2.2, 20000)], btype="band", fs=SR, output="sos"); return signal.sosfilt(sos, x) * env_exp(n, dur / 4, 0.0006)
def blip(f, dur=0.12, bend=0.0, h2=0.25):
    n = int(dur * SR); t = np.arange(n) / SR; ph = 2 * np.pi * np.cumsum(f * (1 + bend * t / dur)) / SR; return (np.sin(ph) + h2 * np.sin(2 * ph)) * env_exp(n, dur / 3.2, 0.004)
def ding(freqs, dur=0.9):
    n = int(dur * SR); t = np.arange(n) / SR; x = np.zeros(n)
    for k, f in enumerate(freqs): x += np.sin(2 * np.pi * f * t) * np.exp(-t / (dur / (3.0 + k * 0.8))) + 0.1 * np.sin(2 * np.pi * f * 2.76 * t) * np.exp(-t / (dur / 9))
    a = int(0.004 * SR); x[:a] *= np.linspace(0, 1, a); return x / len(freqs)
def thud(f0=85, f1=42, dur=0.42):
    n = int(dur * SR); t = np.arange(n) / SR; ff = f1 + (f0 - f1) * np.exp(-t / 0.06); return np.sin(2 * np.pi * np.cumsum(ff) / SR) * env_exp(n, dur / 3.5, 0.004)
def coin():                                  # small bright clink
    f = rng.uniform(2300, 3900); n = int(0.26 * SR); t = np.arange(n) / SR; x = np.zeros(n)
    for m, a, d in ((1, 1, 0.07), (1.47, 0.6, 0.05), (2.36, 0.4, 0.035), (3.3, 0.22, 0.02)): x += a * np.sin(2 * np.pi * f * m * t) * np.exp(-t / d)
    a = int(0.0008 * SR); x[:a] *= np.linspace(0, 1, a); return x * 0.5
def bell(f):                                 # camel bell
    n = int(0.7 * SR); t = np.arange(n) / SR; x = np.zeros(n)
    for m, a, d in ((1, 1, 0.22), (2.76, 0.45, 0.12), (5.4, 0.22, 0.06)): x += a * np.sin(2 * np.pi * f * m * t) * np.exp(-t / d)
    a = int(0.002 * SR); x[:a] *= np.linspace(0, 1, a); return x * 0.5
def whoosh(dur=1.2, f_lo=300, f_hi=3200):
    n = int(dur * SR); t = np.arange(n) / SR; u = t / dur; fc = f_lo * (f_hi / f_lo) ** (np.sin(np.pi * u) ** 1.2)
    sos = signal.butter(2, 600, btype="low", fs=SR, output="sos"); nl = signal.sosfilt(sos, rng.standard_normal(n)); nr = signal.sosfilt(sos, rng.standard_normal(n))
    ph = 2 * np.pi * np.cumsum(fc) / SR; e = np.sin(np.pi * u) ** 1.6; return nl * np.sin(ph) * e * 3.0, nr * np.sin(ph + 0.9) * e * 3.0
def noise_bed(dur, lo, hi, lfo=0.13, depth=0.5, fade=1.0):
    n = int(dur * SR); t = np.arange(n) / SR; out = []
    for ch in range(2):
        x = rng.standard_normal(n); sos = signal.butter(2, [lo, hi], btype="band", fs=SR, output="sos"); x = signal.sosfilt(sos, x)
        e = 1 - depth + depth * (0.5 + 0.5 * np.sin(2 * np.pi * lfo * t + rng.uniform(0, 6.28))) * (0.6 + 0.4 * np.sin(2 * np.pi * lfo * 2.7 * t + rng.uniform(0, 6.28)))
        e *= np.minimum(1, t / fade) * np.minimum(1, (dur - t) / fade); out.append(x * e)
    return out[0], out[1]
def murmur(dur):                             # far-off market crowd
    n = int(dur * SR); t = np.arange(n) / SR; out = []
    for ch in range(2):
        x = rng.standard_normal(n); x = signal.sosfilt(signal.butter(2, [280, 1500], btype="band", fs=SR, output="sos"), x)
        am = signal.sosfilt(signal.butter(2, 5, btype="low", fs=SR, output="sos"), np.abs(rng.standard_normal(n))); am = am / (am.max() + 1e-9)
        out.append(x * (0.35 + 0.65 * am) * np.minimum(1, t / 0.8) * np.minimum(1, (dur - t) / 0.8))
    return out[0], out[1]
def puff(dur=0.28):
    n = int(dur * SR); x = signal.sosfilt(signal.butter(2, 1400, btype="low", fs=SR, output="sos"), rng.standard_normal(n)); return x * env_exp(n, dur / 3, 0.01) * 2.2
def creak(dur=0.7):
    n = int(dur * SR); t = np.arange(n) / SR; f = 95 + 30 * np.sin(2 * np.pi * 2.3 * t) + 12 * signal.sosfilt(signal.butter(1, 30, btype="low", fs=SR, output="sos"), rng.standard_normal(n))
    x = signal.sawtooth(2 * np.pi * np.cumsum(f) / SR) * (0.6 + 0.4 * rng.standard_normal(n) * 0.2); x = signal.sosfilt(signal.butter(2, [180, 1100], btype="band", fs=SR, output="sos"), x)
    return x * np.sin(np.pi * t / dur) ** 0.8 * 0.6

def squeak(dur=0.32, f0=2400, f1=1500):      # a brake squeal, short and soft
    n = int(dur * SR); t = np.arange(n) / SR; f = f1 + (f0 - f1) * np.exp(-t / (dur / 2.5)); x = np.sin(2 * np.pi * np.cumsum(f) / SR) + 0.3 * np.sin(4 * np.pi * np.cumsum(f) / SR)
    x = x * (0.75 + 0.25 * np.sin(2 * np.pi * 31 * t)); return x * np.sin(np.pi * np.minimum(1, t / dur)) ** 0.7 * 0.35
def zip_(dur=0.45, f0=500, f1=1800):         # the spark flying up to the screen
    n = int(dur * SR); t = np.arange(n) / SR; f = f0 * (f1 / f0) ** (t / dur); x = np.sin(2 * np.pi * np.cumsum(f) / SR); return x * np.sin(np.pi * t / dur) ** 1.5 * 0.4

# ───────── music: D minor, 84 BPM. Light and quick on the street, a low hit on the turn, a breath on the rehook, a few slow notes at the end.
BEAT = 60 / 84
CH = {"Dm": ["D", "F", "A"], "Dm9": ["D", "F", "A", "E"], "Bb": ["Bb", "D", "F"], "Bb7": ["Bb", "D", "F", "A"], "F": ["F", "A", "C"], "C": ["C", "E", "G"], "Gm": ["G", "Bb", "D"], "A": ["A", "C#", "E"], "As": ["A", "D", "E"]}
ROOT = {"Dm": "D2", "Dm9": "D2", "Bb": "Bb1", "Bb7": "Bb1", "F": "F2", "C": "C2", "Gm": "G1", "A": "A1", "As": "A1"}
PROG = [(0, "Dm9"), (T["jam"], "Bb7"), (T["nothing"], "Gm"), (T["turn"], "As"), (T["trade"], "F"), (T["why"] + 0.4, "Dm"), (T["n22"], "Bb"), (T["speed"], "C"), (T["b5"], "Gm"), (T["anyway"], "A"),
        (T["b6"], "Dm"), (T["harder"], "Bb"), (T["b7"], "Gm"), (T["dip"], "As"), (T["more"], "Dm"), (T["rehook"], "As"), (T["b10"], "F"), (T["fifty"], "C"), (T["news"], "Bb"),
        (T["b11"], "Dm9"), (T["caused"], "Bb7"), (T["but"], "Gm"), (T["red"], "A"), (T["b12"], "Dm9"), (T["maybe2"], "Bb7"), (T["end"] + 0.4, "Dm9"), (DUR, "Dm9")]
def chord_at(t):
    c = PROG[0][1]
    for tt, cc in PROG:
        if t >= tt - 1e-6: c = cc
    return c
def tones(c, lo_oct):
    out = []
    for o in (lo_oct, lo_oct + 1):
        for n in CH[c][:3]: out.append(hz(f"{n}{o}"))
    out.sort(); return out
for (t0, c), (t1, _) in zip(PROG[:-1], PROG[1:]):
    d = t1 - t0; lvl = 0.8 if t0 >= T["b12"] - 0.1 else 1.12 if T["b6"] <= t0 < T["rehook"] else 1.0
    fr = [hz(f"{n}{3 if n in ('D', 'E', 'F', 'C', 'C#') else 2}") * (2 if n in ("G", "A", "Bb") else 1) for n in CH[c]]
    mus(pad(fr, d), t0 - 0.25, 0, 0.9 * lvl); mus(pad([f * 2 for f in fr[:3]], d, 1.4), t0 - 0.25, 0, 0.28 * lvl); mus(bass(hz(ROOT[c]), d), t0, 0, 0.55 * lvl)
def arp(t0, t1, step, pat, lo, gain, kind=pluck, sw=0.0):
    k = 0; t = t0
    while t < t1 - 0.05:
        ts = tones(chord_at(t + 0.02), lo); f = ts[pat[k % len(pat)] % len(ts)]
        mus(kind(f), t + (sw if k % 2 else 0), 0.35 * np.sin(k * 1.9), gain * (1.0 if k % 2 == 0 else 0.72)); k += 1; t += step
def drums(t0, t1, gain):
    t = t0; k = 0
    while t < t1 - 0.1:
        b = k % 8
        if b in (0, 5): mus(doum(), t, 0, gain)
        if b in (2, 3, 6): mus(tek(1900 if b != 3 else 2300), t, 0.25 if b == 3 else -0.2, gain * (0.34 if b == 3 else 0.42))
        k += 1; t += BEAT / 2
arp(0.0, T["turn"] - 0.1, BEAT / 2, [0, 2, 4, 2, 3, 5, 4, 2], 4, 0.3, kalimba)                    # the street: light and quick
arp(T["same"] + 0.3, T["why"] - 0.1, BEAT, [0, 2, 1, 3], 3, 0.34)                                 # the turn: slower, lower
arp(T["why"] + 0.5, T["b6"] - 0.2, BEAT / 2, [0, 2, 3, 2, 4, 3, 2, 1], 3, 0.36)                   # the test
drums(T["why"] + 0.5, T["b6"] - 0.3, 0.18)
arp(T["b6"], T["rehook"] - 0.15, BEAT / 2, [0, 2, 4, 2, 3, 5, 4, 2], 3, 0.4)                      # the chain: brakes and candles (the music holds its breath on the rehook)
drums(T["b6"], T["rehook"] - 0.2, 0.26)
arp(T["b10"] + 0.3, T["b11"] - 0.3, BEAT / 2, [0, 1, 2, 3, 4, 5, 4, 3], 3, 0.36)                  # fifty pillars
arp(T["b11"] + 0.2, T["b12"] - 0.5, BEAT, [5, 3, 4, 2], 4, 0.2, kalimba)                           # twenty minutes
MEL = ["A4", None, "F4", "D4", None, "F4", "E4", None, "D4", None, None, "A3"]                       # the last line: a few slow notes, then quiet
for k, n in enumerate(MEL):
    if n: mus(kalimba(hz(n) * 2, 2.2), T["b12"] + 0.3 + k * BEAT, 0.15, 0.22)
t = np.arange(N) / SR; fo = np.minimum(1, (DUR - t) / 1.6) ** 1.2
for ch in MUS: ch *= fo

# ───────── sound effects
cues = []
def cue(name, t): cues.append((round(t, 2), name))
sfx(thud(85, 42, 0.42), 0.0, 0, db(-24)); sfx(ding([587.3, 880, 1174.7], 1.3), 0.0, 0, db(-26)); cue("first frame", 0.0)
sfx(noise_bed(DUR, 60, 420, 0.11, 0.5, 1.0), 0.0, 0, db(-33)); sfx(murmur(T["b11"]), 0.0, 0, db(-41)); cue("traffic hum all along", 0.0)
# beat 2: the red wave runs back down the queue: three brake squeals one after another, and a whoosh
for k in range(3): sfx(squeak(0.3, 2500 - k * 220, 1500 - k * 120), T["beat2"] + k * 0.22, -0.3 + k * 0.3, db(-27 + k))
sfx(whoosh(0.8, 300, 2400), T["beat2"] - 0.05, 0, db(-27)); cue("the red wave (brake squeals)", T["beat2"])
sfx(ding([1318.5, 1975.5], 0.8), T["nothing"] + 0.05, 0.1, db(-27)); cue("nothing at the front", T["nothing"])
# the turn: a low hit, the tower rises, its candles pop (up for green, down for red)
sfx(thud(64, 32, 0.6), T["same"] + 0.05, 0, db(-18)); sfx(whoosh(0.9, 200, 2200), T["same"] - 0.25, 0, db(-23)); sfx(creak(0.7), T["same"] + 0.05, 0, db(-30)); cue("the turn: the tower rises", T["same"])
prev = 14.2
for k, tb in enumerate(CU["board"]):
    up = k in (0, 1, 3, 6); sfx(blip(523.3 * 2 ** ((2 if up else -2) * (k % 3) / 12) * (1.0 if up else 0.84), 0.08), tb, -0.3 + k * 0.08, db(-28))
sfx(whoosh(0.7, 400, 3200), T["why"] + 0.1, 0, db(-25)); cue("up over the ring", T["why"] + 0.4)
for k, tc in enumerate(CU["count"]): sfx(tick(1800 + k * 40, 0.016, 0.4), tc, 0.5 * np.sin(k), db(-29))
cue("22 cars counted", CU["count"][0])
sfx(ding([784, 1174.7], 0.9), T["blocked"] + 0.05, -0.2, db(-27)); sfx(thud(90, 45, 0.4), T["jam2"] + 0.05, 0.1, db(-22)); sfx(blip(220, 0.25, -0.2), T["jam2"] + 0.08, 0.1, db(-26)); cue("a jam anyway", T["jam2"])
sfx(whoosh(0.9, 2200, 300), T["harder"] - 0.6, 0, db(-26)); cue("down beside the jam", T["harder"] - 0.4)
# the chain: each car brakes (a squeal), a spark flies up (a zip), a candle lands (a pop); yours with a bell
for (tb, kind), (s0, s1) in zip(CU["chain"], CU["sparks"]):
    g = 2 if kind in ("you", "behind") else 0
    sfx(squeak(0.34, 2300, 1400), tb, -0.2, db(-27 + g)); sfx(zip_(0.45), s0 + 0.02, 0.1, db(-29 + g)); sfx(thud(110, 50, 0.28), s1, 0.15, db(-21 + g)); sfx(blip(392 if kind != "you" else 440, 0.14, -0.2), s1 + 0.02, 0.15, db(-25 + g))
    if kind == "you": sfx(ding([880, 1318.5], 1.0), s1 + 0.05, 0, db(-24))
    cue(f"{kind} brakes, its candle lands", s1)
# the rehook: the music stops, a low hit, the whole staircase
sfx(thud(64, 32, 0.7), T["rehook"] + 0.05, 0, db(-20)); sfx(whoosh(0.8, 300, 2400), T["rehook"] + 0.1, 0, db(-26)); cue("rehook", T["rehook"])
sfx(ding([587.3, 880], 1.0), T["nobody"], 0, db(-26))
for k, tp in enumerate(CU["pillars"]): sfx(tick(900 + k * 26, 0.02, 0.45), tp, 0.7 * np.sin(k * 0.4), db(-30))
cue("fifty pillars", CU["pillars"][0])
sfx(ding([392, 587.3], 1.0), T["news"], 0, db(-23)); sfx(ding([880, 1318.5], 1.0), T["news"] + 0.3, 0, db(-27)); cue("no big news", T["news"])
sfx(whoosh(0.9, 1800, 300), T["b11"] - 0.1, 0, db(-26)); cue("down to you", T["b11"])
n1 = max(1e-3, T["caused"] + 0.3 - T["twenty1"]); n2 = max(1e-3, T["red"] + 0.2 - T["twenty2"])
for k in range(20): sfx(tick(2100 + k * 30, 0.016, 0.35), T["twenty1"] + (k + 0.5) * n1 / 20, -0.4 + k * 0.04, db(-30))
for k in range(20): sfx(blip(330 - k * 4, 0.06, -0.1), T["twenty2"] + (k + 0.5) * n2 / 20, 0.4 - k * 0.04, db(-29))
cue("twenty minutes / twenty minutes of red", T["twenty1"])
for ts in CU["youStops"]:
    if ts > T["b12"] - 2: pass
sfx(whoosh(1.2, 200, 1400), T["b12"] + 0.4, -0.2, db(-29)); cue("the jam lets you go", T["b12"] + 0.4)
sfx(noise_bed(DUR - T["b12"], 150, 700, 0.1, 0.6, 1.5), T["b12"], 0, db(-36)); cue("evening", T["b12"])
# the last card: a clear bell, a softer one for the second line, a small one for the check
sfx(ding([587.3, 880, 1174.7], 1.6), T["maybe1"], 0, db(-23)); sfx(ding([523.3, 784], 1.4), T["maybe2"], 0, db(-25)); sfx(ding([784, 1174.7], 1.2), T["use"], 0, db(-27)); cue("last card", T["maybe1"])

# ───────── mix: voice in the middle, bed ~14 dB under it, effects on top; the bed ducks a little under the voice
vo, sr = sf.read("audio/vo_proc.wav"); assert sr == SR
V = np.zeros(N); V[:min(N, len(vo))] = vo[:N]
rms = lambda x: float(np.sqrt(np.mean(np.square(x)) + 1e-12))
spk = np.abs(V) > 0.02; vr = rms(V[spk])
envv = signal.sosfilt(signal.butter(2, 6, btype="low", fs=SR, output="sos"), np.abs(V)); envv = envv / (envv.max() + 1e-9)
duck = 1 - 0.32 * np.clip(envv * 3, 0, 1)
mr = rms((MUS[0] + MUS[1]) / 2); mg = vr * db(-11.5) / mr
ML, MR = MUS[0] * mg * duck, MUS[1] * mg * duck
sg = db(8.0); SL, SR_ = SFX[0] * sg, SFX[1] * sg
outL = V + ML + SL; outR = V + MR + SR_
pk = max(np.abs(outL).max(), np.abs(outR).max())
if pk > 0.98: outL /= pk / 0.98; outR /= pk / 0.98
sf.write("audio/mix_raw.wav", np.stack([outL, outR], 1), SR); sf.write("audio/music_only.wav", np.stack([ML, MR], 1), SR); sf.write("audio/sfx_only.wav", np.stack([SL, SR_], 1), SR)
json.dump(sorted(cues), open("audio/cue_list.json", "w"), indent=1)
bed = rms(((ML + MR) / 2)[spk]); sx = (SL + SR_) / 2
print(f"DUR {DUR:.2f}s | voice RMS {20*np.log10(vr):.1f} dBFS | bed under voice {20*np.log10(bed/vr):.1f} dB | sfx peak {20*np.log10(np.abs(sx).max()+1e-9):.1f} dBFS, RMS {20*np.log10(rms(sx)):.1f} | mix peak {pk:.2f}")
