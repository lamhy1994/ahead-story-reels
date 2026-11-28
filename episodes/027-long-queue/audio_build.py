# Soundtrack for "The Long Queue" (episode 27, turn format): soft music + gentle sound effects, all synthesized.
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

# ───────── music: D minor, 84 BPM. Light and busy on the street, a low hit on the turn, a held breath on the rehook, a few slow notes under the last line.
BEAT = 60 / 84
CH = {"Dm": ["D", "F", "A"], "Dm9": ["D", "F", "A", "E"], "Bb": ["Bb", "D", "F"], "Bb7": ["Bb", "D", "F", "A"], "F": ["F", "A", "C"], "C": ["C", "E", "G"], "Gm": ["G", "Bb", "D"], "A": ["A", "C#", "E"], "As": ["A", "D", "E"]}
ROOT = {"Dm": "D2", "Dm9": "D2", "Bb": "Bb1", "Bb7": "Bb1", "F": "F2", "C": "C2", "Gm": "G1", "A": "A1", "As": "A1"}
PROG = [(0, "Dm9"), (T["next1"], "Bb7"), (T["turn"], "Gm"), (T["trades"], "As"), (T["why"] + 0.4, "F"), (T["b5"], "C"), (T["ignores"], "Bb"), (T["b6"], "Gm"), (T["every"], "F"),
        (T["b7"], "A"), (T["rehook"], "As"), (T["b9"], "Dm"), (T["n99"], "Gm"), (T["b10"], "Bb"), (T["all10"], "A"), (T["b11"], "F"), (T["but11"], "C"),
        (T["b12"], "Dm9"), (T["maybe2"], "Bb7"), (T["end"] + 0.4, "Dm9"), (DUR, "Dm9")]
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
    d = t1 - t0; lvl = 0.8 if t0 >= T["b12"] - 0.1 else 1.1 if T["b6"] <= t0 < T["rehook"] else 1.0
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
arp(0.0, T["turn"] - 0.1, BEAT / 2, [0, 2, 4, 2, 3, 5, 4, 2], 4, 0.3, kalimba)                     # the street: light and quick
arp(T["trades"] + 0.3, T["why"] - 0.1, BEAT, [0, 2, 1, 3], 3, 0.34)                                 # the turn: slower, lower
arp(T["why"] + 0.5, T["b6"] - 0.2, BEAT / 2, [0, 2, 3, 2, 4, 3, 2, 1], 3, 0.36)                     # the reason
drums(T["why"] + 0.5, T["b6"] - 0.3, 0.18)
arp(T["b6"], T["rehook"] - 0.15, BEAT / 2, [0, 1, 2, 3, 4, 5, 4, 3], 3, 0.4)                       # the queue as a price: climbing (the music holds its breath on the rehook)
drums(T["b6"], T["rehook"] - 0.2, 0.28)
arp(T["b9"] + 0.3, T["b11"] - 0.3, BEAT, [0, 2, 1, 3], 3, 0.33)                                     # the famous example: steady
arp(T["b11"] + 0.2, T["b12"] - 0.5, BEAT, [5, 3, 4, 2], 4, 0.2, kalimba)                            # dinner / trade
MEL = ["A4", None, "F4", "D4", None, "F4", "E4", None, "D4", None, None, "A3"]                       # the last line: a few slow notes, then quiet
for k, n in enumerate(MEL):
    if n: mus(kalimba(hz(n) * 2, 2.2), T["b12"] + 0.3 + k * BEAT, 0.15, 0.22)
t = np.arange(N) / SR; fo = np.minimum(1, (DUR - t) / 1.6) ** 1.2
for ch in MUS: ch *= fo

# ───────── sound effects
cues = []
def cue(name, t): cues.append((round(t, 2), name))
def chime(t, pan=0.0, g=-26): sfx(ding([1318.5, 1760], 0.9), t, pan, db(g)); sfx(ding([1975.5], 0.7), t + 0.09, pan, db(g - 3))     # a shop-door bell
def pop_(t, pan=0.0, g=-29, f=880): sfx(blip(f, 0.06, 0.4, 0.1), t, pan, db(g)); sfx(tick(2600, 0.012, 0.5), t, pan, db(g - 4))
sfx(thud(85, 42, 0.42), 0.0, 0, db(-24)); sfx(ding([587.3, 880, 1174.7], 1.3), 0.0, 0, db(-26)); cue("first frame", 0.0)
sfx(murmur(T["b12"] + 1.0), 0.0, 0, db(-33)); cue("street murmur", 0.0)
for k in range(6): sfx(coin(), 0.6 + k * 1.35 + rng.uniform(0, 0.3), rng.uniform(-0.6, 0.6), db(-36))                     # bowls and spoons from inside
# beat 2: the camera pulls back, the waiter next door looks up, his door bell
sfx(whoosh(0.8, 300, 2800), T["beat2"] - 0.05, 0, db(-23)); cue("pull back", T["beat2"])
chime(T["beat2"] + 0.35, 0.4, -24); cue("next door: no wait", T["beat2"] + 0.35)
sfx(blip(659.3, 0.12), T["beat2"] + 0.55, -0.3, db(-27)); cue("100 waiting", T["beat2"] + 0.55)
sfx(whoosh(0.5, 500, 3000), T["empty"] + 0.05, 0.2, db(-27)); cue("empty", T["empty"] + 0.1)
# the turn: a low hit, the boards rise, candles pop (up over the queue, flat next door)
sfx(thud(64, 32, 0.6), T["trades"] + 0.02, 0, db(-18)); sfx(whoosh(0.8, 300, 2800), T["trades"] - 0.1, 0, db(-23)); cue("the turn: boards rise", T["trades"])
for k, tc in enumerate(CU["candlesA"][:7]): sfx(blip(523.3 * 2 ** (k * 2 / 12), 0.08), tc, -0.3, db(-27))
for k in range(8): sfx(tick(700, 0.02, 0.6), T["trades"] + 0.6 + k * 0.1, 0.3, db(-30))
sfx(whoosh(0.5, 600, 2600), T["same"] + 0.6, 0.2, db(-27))
sfx(whoosh(0.6, 400, 3200), T["why"] + 0.05, 0, db(-25)); cue("above the queue", T["why"] + 0.4)
for k, tk in enumerate(CU["know"]): pop_(tk, 0.6 * np.sin(k * 1.3), -30, 988 + 40 * (k % 4))
cue("they must know something (ticks pop)", CU["know"][0])
# "once two people go in": two door bells, then her hunch pops up and is dropped
for k, ta in enumerate(CU["adm"]): chime(ta + 0.25, -0.2, -26); cue(f"{k + 1} in", ta + 0.25)
sfx(blip(784, 0.1, 0.3), T["nxt"] + 0.08, 0.2, db(-25)); cue("her hunch: next door", T["nxt"])
sfx(blip(523.3, 0.22, -0.45), T["ignores"] + 0.15, 0.2, db(-24)); cue("ignores it", T["ignores"])
sfx(ding([392, 587.3], 1.0), T["two"] + 0.1, 0, db(-27))
# a rising price is a queue: a candle for every person who joins
sfx(whoosh(0.6, 400, 3000), T["b6"] + 0.1, 0, db(-25))
for k, tj in enumerate(CU["joins"]): sfx(blip(587.3 * 2 ** (k * 2 / 12), 0.09), tj + 0.05, -0.2 + 0.05 * k, db(-25)); sfx(tick(1800, 0.02, 0.4), tj - 0.2, 0.3, db(-31))
cue("every buyer: +1", CU["joins"][0])
sfx(whoosh(0.5, 600, 2800), T["every"] + 0.2, 0.1, db(-27))
sfx(coin(), T["buy"] + 0.05, 0, db(-24)); sfx(ding([880, 1318.5], 0.8), T["buy"] + 0.1, 0, db(-26)); cue("you buy", T["buy"])
sfx(ding([698.5, 1046.5], 0.9), T["become"] + 0.1, 0.1, db(-27)); cue("you become the queue", T["become"])
# the rehook: the crane goes up, the music stops for a breath
sfx(thud(64, 32, 0.6), T["rehook"] + 0.05, 0, db(-21)); sfx(whoosh(1.3, 200, 2400), T["rehook"] + 0.1, 0, db(-24)); cue("rehook", T["rehook"])
sfx(ding([392, 587.3, 784], 1.4), T["proof"], 0, db(-25))
# the famous example: a hundred hunches pop up, dots tick in; then all hundred queue here
sfx(thud(90, 45, 0.35), T["isnt"] + 0.05, 0, db(-22)); cue("it isn't", T["isnt"])
for k, tn in enumerate(CU["next"]):
    if k % 2 == 0 and not (T["n99"] + 0.55 < tn < T["h9"] + 0.15): pop_(tn, 0.7 * np.sin(k * 1.7), -33, 740 + 30 * (k % 5))     # thinned around "of a hundred" so every word stays clear
cue("99 hunches: next door", CU["next"][0])
sfx(ding([1174.7, 1760], 1.2), T["one10"], -0.1, db(-23)); cue("the one who came first", T["one10"])
for k in range(10): sfx(blip(880 * 2 ** (-k / 12), 0.08), T["all10"] + 0.04 * k + 0.12 * k, 0.4 * np.sin(k), db(-29))
sfx(ding([293.7, 440, 587.3], 1.5), T["here10"], 0, db(-23)); cue("all hundred queued here", T["here10"])
# one stranger: your dinner, your trade
sfx(coin(), T["dinner"] + 0.05, -0.2, db(-27)); sfx(whoosh(1.4, 300, 2600), T["but11"] - 0.4, 0, db(-26))
sfx(ding([880, 1318.5], 0.9), T["but11"] + 1.1, 0, db(-24)); cue("the first candle", T["but11"] + 1.1)
# night: next door goes dark; the last card
sfx(noise_bed(DUR - T["b12"], 150, 700, 0.1, 0.6, 1.5), T["b12"], 0, db(-36)); cue("night", T["b12"])
sfx(tick(700, 0.05, 0.8), T["maybe2"] + 0.25, 0.4, db(-25)); sfx(blip(220, 0.25, -0.3), T["maybe2"] + 0.27, 0.4, db(-27)); cue("next door goes dark", T["maybe2"] + 0.25)
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
