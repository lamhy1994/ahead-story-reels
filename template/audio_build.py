# Storybook soundtrack for "The King With Too Much Gold": soft music + gentle sound effects, all synthesized.
# Reads audio/cues.json (exported from the scene) so every sound sits on the picture.
import json, numpy as np, soundfile as sf
from scipy import signal
SR = 48000
CU = json.load(open("audio/cues.json")); T = CU["T"]; DUR = CU["DUR"]; N = int(DUR * SR)
OPEN = CU.get("open", {}); ARM = CU.get("arm", "K")          # the opening from the hook lab and the CTA arm (scene.js exports them)
rng = np.random.default_rng(1324)
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

# ───────── music: D minor storybook, 84 BPM
BEAT = 60 / 84
CH = {"Dm": ["D", "F", "A"], "Dm9": ["D", "F", "A", "E"], "Bb": ["Bb", "D", "F"], "Bb7": ["Bb", "D", "F", "A"], "F": ["F", "A", "C"], "C": ["C", "E", "G"], "Gm": ["G", "Bb", "D"], "A": ["A", "C#", "E"], "As": ["A", "D", "E"]}
ROOT = {"Dm": "D2", "Dm9": "D2", "Bb": "Bb1", "Bb7": "Bb1", "F": "F2", "C": "C2", "Gm": "G1", "A": "A1", "As": "A1"}
PROG = [(0, "Dm9"), (3.6, "Bb7"), (T["wipe1"] + 1.35, "Dm"), (T["lock"] + 0.1, "Bb"), (T["b3"] + 0.1, "F"), (T["b3"] + 2.4, "C"), (T["b4"], "Gm"), (T["days"] + 0.3, "As"), (T["wipe2"] + 0.8, "Dm"), (T["generous"], "Bb"), (T["markets"] - 0.3, "F"), (T["official"] + 0.6, "C"),
        (T["b6"], "Gm"), (T["piece"], "A"), (T["b7"], "Bb"), (T["price"] + 0.4, "As"), (T["rehook"], "A"), (T["twelve"] - 0.1, "Dm"), (T["twelve"] + 1.8, "Gm"), (T["wipe3"] + 0.78, "Dm"), (T["b9"], "Gm"), (T["interest"] + 0.9, "Bb"), (T["never"], "A"),
        (T["b10"], "Dm"), (T["lesson"] + 1.8, "Bb"), (T["even"] + 0.2, "F"), (T["use"] + 0.3, "C"), (T["cta"], "Dm9"), (DUR, "Dm9")]
def chord_at(t):
    c = PROG[0][1]
    for tt, cc in PROG:
        if t >= tt - 1e-6: c = cc
    return c
def tones(c, lo_oct):      # chord tones over two octaves, low to high
    out = []
    for o in (lo_oct, lo_oct + 1):
        for n in CH[c][:3]: out.append(hz(f"{n}{o}"))
    out.sort(); return out
SOFT = {"Dm9": 0.9, "Bb7": 0.9}
for (t0, c), (t1, _) in zip(PROG[:-1], PROG[1:]):
    d = t1 - t0; lvl = 1.0
    if T["b4"] <= t0 < T["wipe2"] or T["wipe3"] <= t0 < T["b10"]: lvl = 0.85
    fr = [hz(f"{n}{3 if n in ('D', 'E', 'F', 'C', 'C#') else 2}") * (2 if n in ("G", "A", "Bb") else 1) for n in CH[c]]
    mus(pad(fr, d), t0 - 0.25, 0, 0.9 * lvl); mus(pad([f * 2 for f in fr[:3]], d, 1.4), t0 - 0.25, 0, 0.28 * lvl); mus(bass(hz(ROOT[c]), d), t0, 0, 0.55 * lvl)
# arpeggios / drum by section: (start, end, kind)
def arp(t0, t1, step, pat, lo, gain, kind=pluck, sw=0.0):
    k = 0; t = t0
    while t < t1 - 0.05:
        ts = tones(chord_at(t + 0.02), lo); f = ts[pat[k % len(pat)] % len(ts)]
        acc = 1.0 if k % 2 == 0 else 0.72
        mus(kind(f), t + (sw if k % 2 else 0), 0.35 * np.sin(k * 1.9), gain * acc); k += 1; t += step
def drums(t0, t1, gain):
    t = t0; k = 0
    while t < t1 - 0.1:
        b = k % 8
        if b in (0, 5): mus(doum(), t, 0, gain)
        if b in (2, 3, 6): mus(tek(1900 if b != 3 else 2300), t, 0.25 if b == 3 else -0.2, gain * (0.34 if b == 3 else 0.42))
        k += 1; t += BEAT / 2
arp(0.0, T["wipe1"], BEAT / 2, [5, 3, 4, 2, 5, 4, 3, 1], 5, 0.13, kalimba)                        # night sparkle
for k in range(9): mus(pluck(hz(["D4", "F4", "G4", "A4", "C5", "D5", "F5", "G5", "A5"][k]), 1.4), T["wipe1"] + 0.1 + k * 0.085, -0.5 + k / 8, 0.34)    # harp run into the dawn
arp(T["wipe1"] + 1.35, T["b4"] - 0.2, BEAT / 2, [0, 2, 3, 2, 1, 3, 4, 3], 3, 0.42)              # the journey
drums(T["wipe1"] + 1.35 + BEAT * 4, T["b4"] - 0.3, 0.26)
arp(T["b4"] + 0.3, T["wipe2"] - 0.2, BEAT * 1.5, [0, 3, 2, 4], 3, 0.36)                            # camp at night
arp(T["wipe2"] + 0.8, T["b6"] - 0.2, BEAT / 2, [0, 2, 4, 2, 3, 5, 4, 2], 3, 0.44)                # Cairo
drums(T["wipe2"] + 0.8, T["b6"] - 0.3, 0.3)
arp(T["b5"] + 0.4, T["b6"] - 0.3, BEAT * 2, [5, 4, 3, 5, 4, 2], 5, 0.14, kalimba)
arp(T["b6"] + 0.2, T["b7"] - 0.2, BEAT, [0, 2, 1, 3], 3, 0.36)                                     # too much gold
arp(T["b7"] + 0.2, T["rehook"] - 0.15, BEAT, [4, 3, 2, 1, 3, 2, 1, 0], 3, 0.32)                     # the price slides down (the music holds its breath on the rehook)
arp(T["twelve"], T["wipe3"] - 0.3, BEAT, [0, 0, 2, 0], 4, 0.2, kalimba)                            # years ticking by
arp(T["wipe3"] + 0.9, T["b10"] - 0.3, BEAT * 2, [0, 2, 1, 3], 3, 0.34)                             # the way home
arp(T["b10"] + 0.2, T["cta"] - 0.2, BEAT / 2, [0, 2, 3, 2, 4, 3, 2, 1], 3, 0.36)                 # the story's close
MEL = ["A4", "F4", "D4", None, "F4", "G4", "A4", None, "C5", "A4", "G4", "F4", "D4", None, "F4", "D4"]
for k, n in enumerate(MEL):
    if n: mus(kalimba(hz(n) * 2, 1.6), T["b10"] + 0.55 + k * BEAT, 0.2, 0.2)
for k, n in enumerate(["D5", "A5", "D6", "F6", "A6"]): mus(kalimba(hz(n), 1.8), T["cta"] + 0.5 + k * 0.33, -0.3 + k * 0.15, 0.16)
# fades
t = np.arange(N) / SR; fo = np.minimum(1, (DUR - t) / 1.3) ** 1.2
for ch in MUS: ch *= fo

# ───────── sound effects
cues = []
def cue(name, t): cues.append((round(t, 2), name))
# frame 0: a soft hit (with a hook card: louder; captions only: the picture carries it), a light whoosh when the card lifts away
sfx(thud(85, 42, 0.42), 0.0, 0, db(-21 if T.get("hookEnd") else -25)); sfx(ding([587.3, 880, 1174.7], 1.3), 0.0, 0, db(-25)); cue("first frame", 0.0)
if T.get("hookEnd"): sfx(whoosh(0.6, 500, 3600), T["hookEnd"] - 0.05, 0, db(-27)); cue("hook card lifts", T["hookEnd"])
if T.get("bigIn"):                                                     # the big number (1.5-3 s)
    sfx(thud(70, 34, 0.6), T["bigIn"] + 0.02, 0, db(-19)); sfx(whoosh(0.5, 3200, 400), T["bigIn"] - 0.15, 0, db(-26)); cue("big number", T["bigIn"])
    for k in range(10): sfx(tick(1800 + k * 140, 0.016, 0.4), T["bigIn"] + 0.06 + k * 0.064, 0.3 * np.sin(k), db(-31))
    sfx(ding([587.3, 880, 1174.7], 1.0), T["bigIn"] + 0.72, 0, db(-25)); sfx(whoosh(0.5, 600, 3000), T["bigOut"] - 0.1, 0, db(-29))
land = sorted(CU["land"])
for i, tl in enumerate(land):                                                                                                                # coins landing
    if tl < T["wipe1"] and i % 4 == 0: sfx(coin(), tl, rng.uniform(-0.7, 0.7), db(-31 + rng.uniform(-3, 2)))
    if T["b5"] < tl < T["cta"] and i % 2 == 0: sfx(coin(), tl, rng.uniform(-0.7, 0.7), db(-29 + rng.uniform(-3, 2)))
cue("coins rain (night street)", 0.3); cue("coins to the crowd", T["generous"])
for tw, dur, g in ((T["wipe1"] - 0.05, 1.45, -22), (T["wipe2"] - 0.05, 0.95, -23), (T["wipe3"] - 0.05, 0.9, -23)): sfx(whoosh(dur), tw, 0, db(g)); cue("sky wipe", tw)
sfx(noise_bed(T["wipe2"] - T["wipe1"] - 0.6, 180, 900, 0.11, 0.6, 1.5), T["wipe1"] + 0.9, 0, db(-33)); cue("desert wind", T["wipe1"] + 0.9)
sfx(noise_bed(DUR - T["wipe3"] - 0.6, 160, 800, 0.1, 0.6, 1.5), T["wipe3"] + 0.6, 0, db(-36))
tb = T["wipe1"] + 1.5; k = 0
while tb < T["b4"] + 1.6: sfx(bell(1480 if k % 2 else 1245), tb, -0.5 if k % 2 else 0.5, db(-32)); tb += 0.93 + rng.uniform(-0.05, 0.05); k += 1                   # camel bells
tb = T["wipe3"] + 0.9
while tb < T["b9"] + 0.6: sfx(bell(1245 if k % 2 else 1108), tb, -0.5 if k % 2 else 0.5, db(-34)); tb += 1.3; k += 1
tb = T["interest"] + 2.7
while tb < T["b10"] + 2: sfx(bell(1108 if k % 2 else 988), tb, -0.4 if k % 2 else 0.4, db(-36)); tb += 1.2; k += 1
sfx(ding([1174.7, 1760, 2349], 1.0), T["name"], 0, db(-25)); cue("name card", T["name"])
sfx(ding([2093, 3136], 0.7), T["rich"], 0.2, db(-29)); sfx(blip(784, 0.1), T["b3"] + 0.9, 0, db(-27))
sfx(ding([2349, 3520], 0.7), T["gold3"] + 0.45, 0.1, db(-27)); sfx(coin(), T["gold3"] + 0.5, -0.2, db(-27)); cue("gold on the camels", T["gold3"] + 0.45)
for i, tt in enumerate(CU["tents"]): sfx(blip(392 * 2 ** (i * 2 / 12), 0.09), tt, -0.6 + i * 0.17, db(-28))
cue("tents pop up", CU["tents"][0])
for i in range(3): sfx(blip([659, 740, 880][i], 0.12), T["days"] + 0.05 + i * 0.5, 0, db(-27))
for i in range(60): sfx(tick(rng.uniform(1500, 4500), 0.008, 0.9), T["b4"] + 1.4 + rng.uniform(0, T["wipe2"] - T["b4"] - 1.3), -0.2, db(-38 + rng.uniform(-3, 3)))    # camp fire
sfx(creak(0.7), T["wipe2"] + 0.45, 0, db(-28)); sfx(thud(90, 50, 0.35), T["wipe2"] + 1.1, 0, db(-23)); cue("gate opens", T["wipe2"] + 0.45)
sfx(murmur(T["b7"] - T["wipe2"] - 0.4), T["wipe2"] + 0.6, 0, db(-34)); cue("market murmur", T["wipe2"] + 0.6)
sfx(murmur(T["never"] - T["b9"] + 1.0), T["b9"] - 0.3, 0, db(-39))
for i in range(3): sfx(blip([587, 698, 880][i], 0.1), T["months"] + 0.4 * (i + 1), 0, db(-28))
for i, tg in enumerate(CU["gifts"]): sfx(thud(130, 70, 0.2), tg, -0.4 + i * 0.16, db(-23)); sfx(coin(), tg + 0.03, -0.4 + i * 0.16, db(-28)); sfx(coin(), tg + 0.09, -0.4 + i * 0.16, db(-31))
cue("a sack for each official", CU["gifts"][0])
PENT = [293.7, 349.2, 392, 440, 523.3, 587.3, 698.5, 784, 880, 1046.5, 1174.7]
for i, th in enumerate(CU["heaps"]): sfx(blip(PENT[min(len(PENT) - 1, int(i / len(CU["heaps"]) * len(PENT)))] * 2, 0.08), th, rng.uniform(-0.6, 0.6), db(-31))
sfx(ding([1760, 2637, 3520], 1.1), T["fills"] + 1.35, 0, db(-27)); cue("city fills with gold", T["fills"])
sfx(ding([2093, 3136], 0.8), T["piece"] + 0.95, -0.2, db(-25)); cue("one coin at the bakery", T["piece"] + 0.95)
for i in range(5): sfx(tick(1800 + i * 150, 0.02, 0.4), T["piece"] + 1.0 + i * 0.07, -0.4 + i * 0.2, db(-30))
sfx(puff(), T["less"], 0.3, db(-25)); sfx(blip(523, 0.2, -0.35), T["less"] + 0.02, 0.3, db(-25)); cue("one loaf fewer", T["less"])
sfx(blip(784, 0.1), T["price"] - 0.15, 0, db(-26))
for i in range(3): sfx(blip([880, 784, 698][i], 0.12, -0.05), T["tenth"] - 0.9 + i * 0.33, 0, db(-25))
sfx(blip(523, 0.24, -0.3), T["tenth"], 0, db(-23)); cue("price 25 -> 22", T["tenth"] - 0.9)
for i in range(12): sfx(tick(2100, 0.018, 0.3), T["twelve"] + (i + 0.5) / 12 * 1.7, -0.5 + i / 11, db(-29))
cue("twelve years tick by", T["twelve"])
for i in range(7): sfx(blip(659 * 2 ** (-i * 2 / 12), 0.11), T["home"] - 0.2 + i * (T["ran"] + 0.2 - T["home"]) / 7, 0, db(-29))
sfx(thud(75, 40, 0.5), T["ran"] + 0.05, 0, db(-19)); sfx(puff(0.35), T["ran"] + 0.05, 0, db(-28)); cue("the gold runs out", T["ran"] + 0.05)
for j, tl in enumerate(CU["loans"]): sfx(tick(900, 0.05, 0.9), tl - 0.75, 0.5 - j * 0.3, db(-30)); sfx(thud(120, 70, 0.2), tl, -0.3 + j * 0.2, db(-24)); sfx(coin(), tl + 0.04, -0.3 + j * 0.2, db(-27)); sfx(blip(880 + j * 110, 0.09), tl - 0.75, 0.4, db(-28))
cue("three loans", CU["loans"][0] - 0.75)
sfx(blip(622, 0.14), T["interest"], 0, db(-25)); sfx(blip(659, 0.14), T["interest"] + 0.12, 0, db(-25)); cue("interest", T["interest"])
sfx(blip(392, 0.3, -0.12), T["never"] + 0.2, 0, db(-23)); sfx(blip(294, 0.36, -0.1), T["never"] + 0.42, 0, db(-24)); cue("unpaid?", T["never"] + 0.2)
# beat2 "event": the second thing that happens at 1.5 s gets its own hit
if OPEN.get("beat2") == "event":
    sfx(thud(72, 36, 0.55), T["beat2"], 0, db(-20)); sfx(whoosh(0.5, 400, 3000), T["beat2"] - 0.12, 0, db(-27)); cue("beat 2 (event)", T["beat2"])
    for k in range(12): sfx(coin(), T["beat2"] + 0.9 + k * 0.05, rng.uniform(-0.8, 0.8), db(-30 + rng.uniform(-3, 2)))
# the lock-in: a small bell on the promise to the viewer
sfx(ding([880, 1318.5], 0.8), T["yours"], 0.15, db(-28)); cue("lock-in promise", T["lock"])
# the rehook: the music stops for a breath, a low hit and a rising whoosh, then the answer
sfx(thud(64, 32, 0.6), T["rehook"] + 0.05, 0, db(-20)); sfx(whoosh(0.7, 300, 2600), T["rehook"] + 0.1, 0, db(-25)); sfx(ding([880, 1318.5], 0.9), T["twelve"], 0, db(-25)); cue("rehook", T["rehook"])
# the lesson card: a clear bell when it lands, a softer one for the line the viewer can use
sfx(ding([587.3, 880, 1174.7], 1.5), T["lesson"], 0, db(-23)); cue("lesson card", T["lesson"])
for k in range(8): sfx(kalimba(3520 * 2 ** (-k / 12), 0.5), T["b10"] + 3.6 + k * 0.05, 0.3 + k * 0.06, db(-33))
sfx(blip(698, 0.12), T["even"], 0, db(-26)); sfx(ding([784, 1174.7], 0.9), T["use"] + 0.05, 0, db(-26)); cue("the check to use", T["use"])
# the CTA: arm K types the keyword, posts it, and our reply pops up; arm O points at the comments and asks
sfx(ding([1318.5, 1975.5], 0.8), T["cta"] + 0.1, 0, db(-30)); cue("CTA chip", T["cta"] + 0.1)
if ARM == "K":
    for i, tk in enumerate(CU["typing"]): sfx(tick(2600 + i * 120, 0.018, 0.5), tk, 0, db(-28))
    cue("typing the keyword", CU["typing"][0])
    sfx(blip(1046.5, 0.09), T["reply"] - 0.1, 0, db(-27)); sfx(blip(1568, 0.11), T["reply"], 0, db(-28)); cue("posted", T["reply"] - 0.1)
    sfx(blip(880, 0.09), T["reply"] + 0.3, 0.2, db(-26)); sfx(blip(1318.5, 0.14), T["reply"] + 0.4, 0.2, db(-26)); cue("our reply", T["reply"] + 0.3)
else:
    sfx(blip(880, 0.09), T["ctaC"], 0.2, db(-27)); sfx(ding([1174.7, 1760], 0.9), T["ask"], 0, db(-25)); cue("the question", T["ask"])
for i, tl in enumerate(CU["rain"]):
    if i % 3 == 0: sfx(coin(), tl, rng.uniform(-0.8, 0.8), db(-36 + rng.uniform(-3, 2)))
for k in range(8): sfx(kalimba(1760 * 2 ** (k * 2 / 12), 0.5), T["rain0"] + k * 0.11, -0.5 + k * 0.1, db(-33))
cue("a little gold rain", T["rain0"])
sfx(ding([1174.7, 1760], 0.8), T["borrowed"] + 0.0, 0, db(-60))   # (placeholder kept silent)

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
