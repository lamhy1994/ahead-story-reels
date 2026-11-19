# Storybook soundtrack for "The Genius Who Bought the Top": soft baroque-ish music + gentle sound effects, all synthesized.
# Reads audio/cues.json (exported from the scene) so every sound sits on the picture.
import json, numpy as np, soundfile as sf
from scipy import signal
SR = 48000
CU = json.load(open("audio/cues.json")); T = CU["T"]; DUR = CU["DUR"]; N = int(DUR * SR)
rng = np.random.default_rng(1720)
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
def pluck(f, dur=1.9, bright=1.0):          # soft harp
    n = int(dur * SR); t = np.arange(n) / SR; x = np.zeros(n)
    for k in range(1, 11):
        if f * k > 9000: break
        x += (bright ** (k - 1)) / k ** 1.15 * np.sin(2 * np.pi * f * k * (1 + 0.0004 * k * k) * t) * np.exp(-t * (1.7 + 0.85 * k))
    a = int(0.003 * SR); x[:a] *= np.linspace(0, 1, a); return x * 0.6
def harpsi(f, dur=1.1):                     # harpsichord-like: bright, quick decay, a little quill click
    n = int(dur * SR); t = np.arange(n) / SR; x = np.zeros(n)
    for k in range(1, 16):
        if f * k > 11000: break
        x += (0.9 if k % 2 else 0.6) / k ** 0.8 * np.sin(2 * np.pi * f * k * (1 + 0.00025 * k * k) * t + k) * np.exp(-t * (2.6 + 0.9 * k))
    c = int(0.004 * SR); x[:c] += rng.standard_normal(c) * 0.25 * np.linspace(1, 0, c)
    a = int(0.0015 * SR); x[:a] *= np.linspace(0, 1, a); return x * 0.42
def kalimba(f, dur=1.3):                    # music-box sparkle
    n = int(dur * SR); t = np.arange(n) / SR
    x = np.sin(2 * np.pi * f * t) * np.exp(-t / 0.32) + 0.3 * np.sin(2 * np.pi * f * 3.01 * t) * np.exp(-t / 0.07) + 0.12 * np.sin(2 * np.pi * f * 5.4 * t) * np.exp(-t / 0.03)
    a = int(0.002 * SR); x[:a] *= np.linspace(0, 1, a); return x * 0.5
def pad(freqs, dur, att=0.9, rel=1.4):      # warm string bed, slightly wide
    n = int((dur + rel) * SR); t = np.arange(n) / SR; l = np.zeros(n); r = np.zeros(n)
    for f in freqs:
        for det, w in ((-0.004, 1), (0.003, 1), (0, 0.8)):
            ph = rng.uniform(0, 6.28); s = np.sin(2 * np.pi * f * (1 + det) * t + ph) + 0.22 * np.sin(2 * np.pi * 2 * f * (1 + det) * t + ph * 1.7) + 0.08 * np.sin(2 * np.pi * 3 * f * (1 + det) * t)
            l += s * w * (1 if det <= 0 else 0.55); r += s * w * (1 if det >= 0 else 0.55)
    e = np.minimum(1, t / att) * np.minimum(1, np.maximum(0, (dur + rel - t) / rel)); e = e ** 1.3 * (0.86 + 0.14 * np.sin(2 * np.pi * 0.21 * t))
    return l * e / len(freqs) * 0.36, r * e / len(freqs) * 0.36
def bass(f, dur):
    n = int((dur + 0.5) * SR); t = np.arange(n) / SR; e = np.minimum(1, t / 0.12) * np.minimum(1, np.maximum(0, (dur + 0.5 - t) / 0.5))
    return (np.sin(2 * np.pi * f * t) + 0.18 * np.sin(2 * np.pi * 2 * f * t)) * e * 0.5
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
def clank():                                 # the coin press strikes: iron + thump
    n = int(0.5 * SR); t = np.arange(n) / SR; x = np.zeros(n)
    for f, a, d in ((410, 1, 0.12), (1130, 0.6, 0.06), (1870, 0.4, 0.04), (2950, 0.25, 0.025)): x += a * np.sin(2 * np.pi * f * t + rng.uniform(0, 6)) * np.exp(-t / d)
    a = int(0.001 * SR); x[:a] *= np.linspace(0, 1, a); return x * 0.45 + np.pad(thud(110, 55, 0.3), (0, n - int(0.3 * SR))) * 0.8
def churchbell(f=196):                       # a far-off cathedral bell (inharmonic partials, long ring)
    n = int(4.5 * SR); t = np.arange(n) / SR; x = np.zeros(n)
    for m, a, d in ((0.5, 0.5, 2.6), (1, 1, 2.0), (1.19, 0.5, 1.3), (1.5, 0.35, 1.1), (2.0, 0.45, 0.9), (2.51, 0.2, 0.6), (3.0, 0.15, 0.4)): x += a * np.sin(2 * np.pi * f * m * t + rng.uniform(0, 6)) * np.exp(-t / d)
    a = int(0.003 * SR); x[:a] *= np.linspace(0, 1, a); return x * 0.3
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
def murmur(dur, swell=None):                 # crowd in the alley (swell: gain curve 0..1 over the clip)
    n = int(dur * SR); t = np.arange(n) / SR; out = []
    for ch in range(2):
        x = rng.standard_normal(n); x = signal.sosfilt(signal.butter(2, [260, 1700], btype="band", fs=SR, output="sos"), x)
        am = signal.sosfilt(signal.butter(2, 6, btype="low", fs=SR, output="sos"), np.abs(rng.standard_normal(n))); am = am / (am.max() + 1e-9)
        g = np.minimum(1, t / 0.8) * np.minimum(1, (dur - t) / 0.8) * (swell(t / dur) if swell else 1)
        out.append(x * (0.35 + 0.65 * am) * g)
    return out[0], out[1]
def cheer(dur=0.9):                          # a short crowd cheer
    n = int(dur * SR); t = np.arange(n) / SR; x = rng.standard_normal(n)
    x = signal.sosfilt(signal.butter(2, [500, 2600], btype="band", fs=SR, output="sos"), x) * (0.6 + 0.4 * np.sin(2 * np.pi * 7 * t + rng.uniform(0, 6)))
    return x * np.sin(np.pi * np.minimum(1, t / dur)) ** 0.7 * 1.6
def flutter(dur=0.35):                       # paper rustle
    n = int(dur * SR); t = np.arange(n) / SR; x = signal.sosfilt(signal.butter(2, [1800, 7000], btype="band", fs=SR, output="sos"), rng.standard_normal(n))
    am = 0.4 + 0.6 * np.abs(np.sin(2 * np.pi * rng.uniform(14, 24) * t)); return x * am * np.sin(np.pi * t / dur) ** 1.5 * 1.4
def bonk(f=None):                            # an apple lands
    f = f or rng.uniform(170, 260); n = int(0.16 * SR); t = np.arange(n) / SR; ff = f * (1 + 0.6 * np.exp(-t / 0.01))
    x = np.sin(2 * np.pi * np.cumsum(ff) / SR) * env_exp(n, 0.035, 0.001) + 0.3 * rng.standard_normal(n) * env_exp(n, 0.004, 0.0005); return x * 0.8
def scratch(dur=0.22):                       # quill on paper
    n = int(dur * SR); t = np.arange(n) / SR; x = signal.sosfilt(signal.butter(2, [2500, 8000], btype="band", fs=SR, output="sos"), rng.standard_normal(n))
    return x * (0.5 + 0.5 * np.sin(2 * np.pi * rng.uniform(20, 40) * t)) * np.sin(np.pi * t / dur) * 0.9
def puff(dur=0.28):
    n = int(dur * SR); x = signal.sosfilt(signal.butter(2, 1400, btype="low", fs=SR, output="sos"), rng.standard_normal(n)); return x * env_exp(n, dur / 3, 0.01) * 2.2

# ───────── music: D minor storybook, 84 BPM
BEAT = 60 / 84
CH = {"Dm": ["D", "F", "A"], "Dm9": ["D", "F", "A", "E"], "Bb": ["Bb", "D", "F"], "Bb7": ["Bb", "D", "F", "A"], "F": ["F", "A", "C"], "C": ["C", "E", "G"], "Gm": ["G", "Bb", "D"], "A": ["A", "C#", "E"], "As": ["A", "D", "E"]}
ROOT = {"Dm": "D2", "Dm9": "D2", "Bb": "Bb1", "Bb7": "Bb1", "F": "F2", "C": "C2", "Gm": "G1", "A": "A1", "As": "A1"}
PROG = [(0, "Dm9"), (2.9, "Bb7"), (T["falling"] - 0.2, "As"), (T["wipe1"] + 1.35, "Dm"), (T["mint"], "Bb"), (T["b3"], "F"), (T["b4"], "C"), (T["b5"], "Dm"), (T["sold"], "Bb"), (T["richer"] - 0.4, "F"),
        (T["b6"], "C"), (T["b7"], "Dm"), (T["buying"], "F"), (T["higher"], "Gm"), (T["b8"], "Bb"), (T["madness"], "As"), (T["b9"], "Dm"), (T["thousand"], "F"), (T["b10"], "C"), (T["top"], "A"),
        (T["b11"], "Bb"), (T["all"], "A"), (T["b12"], "Gm"), (T["fell1"], "Dm"), (T["fell2"], "A"), (T["b13"], "Bb"), (T["less"], "Gm"), (T["b14"], "Dm"), (T["third"], "Bb7"),
        (T["wipe3"] + 0.7, "Dm"), (T["very"], "Gm"), (T["b16"], "Dm"), (T["storyT"] + 1.8, "Bb"), (T["even"] + 0.2, "F"), (T["even"] + 2.2, "C"), (T["cta"], "Dm9"), (DUR, "Dm9")]
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
    d = t1 - t0; lvl = 1.0
    if T["b13"] <= t0 < T["b16"]: lvl = 0.8
    fr = [hz(f"{n}{3 if n in ('D', 'E', 'F', 'C', 'C#') else 2}") * (2 if n in ("G", "A", "Bb") else 1) for n in CH[c]]
    mus(pad(fr, d), t0 - 0.25, 0, 0.9 * lvl); mus(pad([f * 2 for f in fr[:3]], d, 1.4), t0 - 0.25, 0, 0.26 * lvl); mus(bass(hz(ROOT[c]), d), t0, 0, 0.55 * lvl)
def arp(t0, t1, step, pat, lo, gain, kind=harpsi, sw=0.0):
    k = 0; t = t0
    while t < t1 - 0.05:
        ts = tones(chord_at(t + 0.02), lo); f = ts[pat[k % len(pat)] % len(ts)]
        acc = 1.0 if k % 2 == 0 else 0.72
        mus(kind(f), t + (sw if k % 2 else 0), 0.35 * np.sin(k * 1.9), gain * acc); k += 1; t += step
arp(0.0, T["falling"] - 0.3, BEAT / 2, [5, 3, 4, 2, 5, 4, 3, 1], 5, 0.13, kalimba)                                  # night sparkle
for k in range(9): mus(pluck(hz(["A5", "G5", "F5", "E5", "D5", "C5", "A4", "F4", "D4"][k]), 1.5), T["falling"] - 0.1 + k * 0.1, 0.5 - k / 8, 0.34)   # the price falls
for k in range(9): mus(pluck(hz(["D4", "F4", "G4", "A4", "C5", "D5", "F5", "G5", "A5"][k]), 1.4), T["wipe1"] + 0.1 + k * 0.085, -0.5 + k / 8, 0.32)  # harp run into the morning
arp(T["wipe1"] + 1.35, T["b3"] - 0.1, BEAT / 2, [0, 2, 3, 2, 1, 3, 4, 3], 3, 0.36)                                    # the Mint
arp(T["b3"] + 0.8, T["b6"] - 0.2, BEAT / 2, [0, 2, 4, 2, 3, 5, 4, 2], 3, 0.4)                                         # Exchange Alley
arp(T["b6"], T["b9"] - 0.1, BEAT / 3, [0, 1, 2, 3, 4, 5], 3, 0.36)                                                    # the price climbs (triplets, rising)
arp(T["b7"], T["b9"] - 0.2, BEAT, [3, 4, 5, 5], 5, 0.12, kalimba)
arp(T["b9"], T["b12"] - 0.2, BEAT / 2, [0, 2, 4, 5, 4, 2, 3, 1], 3, 0.42)                                             # summer, the top
arp(T["b12"], T["b13"] + 0.6, BEAT / 2, [5, 4, 3, 2, 1, 0, 2, 1], 3, 0.38)                                            # the fall
arp(T["b13"] + 0.6, T["wipe3"] - 0.3, BEAT * 1.5, [0, 2, 1, 3], 3, 0.26, kalimba)                                     # winter, alone
arp(T["wipe3"] + 0.7, T["b16"] - 0.3, BEAT, [0, 2, 1, 3, 2, 4], 3, 0.28, pluck)                                       # the letter
arp(T["b16"] + 0.2, T["cta"] - 0.2, BEAT / 2, [0, 2, 3, 2, 4, 3, 2, 1], 3, 0.34)                                      # the story's close
MEL = ["A4", "F4", "D4", None, "F4", "G4", "A4", None, "C5", "A4", "G4", "F4", "D4", None, "F4", "D4"]
for k, n in enumerate(MEL):
    if n: mus(kalimba(hz(n) * 2, 1.6), T["b16"] + 0.55 + k * BEAT, 0.2, 0.2)
for k, n in enumerate(["D5", "A5", "D6", "F6", "A6"]): mus(kalimba(hz(n), 1.8), T["cta"] + 0.5 + k * 0.33, -0.3 + k * 0.15, 0.16)
t = np.arange(N) / SR; fo = np.minimum(1, (DUR - t) / 1.3) ** 1.2
for ch in MUS: ch *= fo

# ───────── sound effects
cues = []
def cue(name, t): cues.append((round(t, 2), name))
for k in range(15): u = k / 14; sfx(tick(2600 - 1300 * u, 0.02, 0.35), 0.06 + 1.18 * (1 - (1 - u) ** 2), 0.3 * np.sin(k), db(-29))          # the year rolls back
sfx(ding([1174.7, 1760], 0.9), 1.27, 0, db(-25)); cue("year lands on 1720", 1.27)
for i in range(30): sfx(flutter(0.25 + rng.uniform(0, 0.2)), rng.uniform(0.2, T["wipe1"] - 0.3), rng.uniform(-0.8, 0.8), db(-37 + rng.uniform(-3, 2)))   # papers falling in the night street
cue("papers fall (night)", 0.3)
sfx(noise_bed(T["wipe1"] + 0.2, 180, 900, 0.11, 0.6, 1.0), 0.0, 0, db(-36))
sfx(blip(392, 0.32, -0.25), T["falling"] + 0.05, 0, db(-24)); sfx(blip(294, 0.4, -0.2), T["falling"] + 0.35, 0, db(-25)); sfx(thud(70, 38, 0.5), T["falling"] + 0.75, 0, db(-24)); cue("the line plunges", T["falling"])
for tw, dur, g in ((T["wipe1"] - 0.05, 1.45, -22), (T["wipe3"] - 0.05, 1.0, -23)): sfx(whoosh(dur), tw, 0, db(g)); cue("sky wipe", tw)
for i, ts in enumerate(CU["strike"]): sfx(clank(), ts, -0.2, db(-24)); [sfx(coin(), ts + 0.15 + k * 0.06, rng.uniform(-0.4, 0.4), db(-29)) for k in range(2)]
cue("the press strikes", CU["strike"][0])
sfx(ding([1174.7, 1760, 2349], 1.0), T["name"], 0, db(-25)); cue("name card", T["name"])
sfx(churchbell(196), T["b3"] + 0.9, -0.3, db(-27)); sfx(churchbell(196), T["b3"] + 3.3, -0.3, db(-29)); cue("St Paul's bell", T["b3"] + 0.9)
def sw_early(u): return 0.55
sfx(murmur(T["b6"] - T["b3"] - 0.6, sw_early), T["b3"] + 0.9, 0, db(-35)); cue("alley murmur", T["b3"] + 0.9)
sfx(murmur(T["fell1"] - T["b6"] + 0.6, lambda u: 0.55 + 0.45 * np.minimum(1, u * 1.6)), T["b6"] - 0.3, 0, db(-33)); cue("the crowd grows", T["b6"])
sfx(murmur(T["b13"] - T["fell1"] + 0.8, lambda u: np.maximum(0.0, 1 - u) ** 1.5), T["fell1"] - 0.2, 0, db(-34))
sfx(blip(784, 0.1), T["jan"], 0, db(-27)); sfx(ding([1568, 2349], 0.6), T["p128"] + 0.05, 0.2, db(-28)); cue("chart: £128", T["p128"])
for i in range(3): sfx(flutter(0.3), T["sold"] + 0.1 + i * 0.16, -0.3, db(-30))
sfx(blip(659, 0.12), T["april"] + 0.45, 0, db(-27)); sfx(blip(880, 0.12), T["april"] + 0.6, 0, db(-27)); cue("SOLD", T["april"] + 0.45)
for i, tl in enumerate(CU["sell"]): sfx(thud(130, 70, 0.2), tl, -0.4 + i * 0.1, db(-23)); sfx(coin(), tl + 0.03, -0.4, db(-28)); sfx(coin(), tl + 0.09, -0.3, db(-31))
sfx(ding([1760, 2637, 3520], 1.1), T["richer"] - 0.1, -0.2, db(-26)); cue("+ about £20,000", T["richer"] - 0.1)
for i, tk in enumerate([T["climbing"], T["buy"], T["buying"], T["higher"], T["b8"] + 0.2]): sfx(blip(523 * 2 ** (i * 2 / 12), 0.1), tk, 0.3, db(-26))
cue("price ticks up", T["climbing"])
for tc in CU["cheer"]: sfx(cheer(0.9 + rng.uniform(0, 0.3)), tc + 0.05, rng.uniform(-0.3, 0.3), db(-33))
cue("cheers", CU["cheer"][0])
for tci in CU["crowdIn"]: sfx(blip(rng.choice([587, 698, 784, 880, 1047]), 0.07), tci, rng.uniform(-0.6, 0.6), db(-36))
for i in range(40): sfx(flutter(0.3), rng.uniform(T["b6"] + 0.4, T["b9"] + 1.5), rng.uniform(-0.7, 0.7), db(-36 + rng.uniform(-3, 2)))
sfx(blip(698, 0.12), T["buy"] - 0.1, 0, db(-27)); cue("loop pill", T["buy"] - 0.1)
sfx(ding([880, 1318.5], 1.2), T["story"] + 0.2, 0, db(-27)); cue("the madness quote", T["story"] + 0.2)
sfx(ding([1318.5, 1975.5], 0.8), T["thousand"], 0.2, db(-27)); cue("~£1,050", T["thousand"])
sfx(blip(784, 0.12), T["june"] + 0.1, 0, db(-27)); sfx(blip(988, 0.12), T["june"] + 0.25, 0, db(-27)); cue("BOUGHT BACK", T["june"] + 0.1)
for i, tb in enumerate(CU["buys"]): sfx(thud(130, 70, 0.2), tb, 0.4 - i * 0.1, db(-24)); sfx(coin(), tb + 0.03, 0.3, db(-29))
for i, tsk in enumerate(CU["stack"]): sfx(flutter(0.22), tsk - 0.1, -0.2, db(-31))
for i in range(12): sfx(tick(1800 + i * 90, 0.02, 0.4), T["back"] + i * (T["all"] + 0.6 - T["back"]) / 12, 0, db(-31))
sfx(ding([1046.5, 1568], 0.7), T["all"] + 0.1, 0, db(-27)); cue("almost all", T["all"] + 0.1)
sfx(whoosh(1.4, 200, 2400), T["fell1"] - 0.3, 0, db(-24)); sfx(noise_bed(T["b13"] + 1.5 - T["sept"], 150, 1200, 0.5, 0.7, 0.5), T["sept"], 0, db(-31)); cue("autumn wind", T["sept"])
for i in range(7): sfx(blip(880 * 2 ** (-i * 2 / 12), 0.12), T["fell1"] - 0.1 + i * 0.12, 0, db(-27))
sfx(thud(80, 40, 0.5), T["fell1"] + 0.3, 0, db(-25)); sfx(thud(70, 36, 0.55), T["fell2"] + 0.3, 0, db(-25)); cue("the price falls, and falls", T["fell1"])
for i in range(50): sfx(flutter(0.3), rng.uniform(T["fell1"] - 0.2, T["b13"] + 1.4), rng.uniform(-0.8, 0.8), db(-34 + rng.uniform(-3, 2)))
for tco in CU["crowdOut"][::3]: sfx(blip(rng.choice([523, 440, 392]), 0.08, -0.2), tco, rng.uniform(-0.6, 0.6), db(-38))
sfx(blip(392, 0.3, -0.12), T["less"], 0, db(-24)); sfx(blip(294, 0.36, -0.1), T["less"] + 0.22, 0, db(-25)); cue("less than January", T["less"])
for k in range(6): sfx(kalimba(2637 * 2 ** (-k / 12), 0.6), T["dec"] + 0.2 + k * 0.09, 0.2, db(-34)); cue("snow", T["dec"])
sfx(noise_bed(T["wipe3"] - T["b13"], 200, 900, 0.1, 0.6, 1.0), T["b13"], 0, db(-36))
for i in range(4): sfx(blip(659 * 2 ** (-i * 3 / 12), 0.14), T["third"] - 0.2 + i * 0.15, 0, db(-27))
cue("a third gone", T["third"])
tt = T["wipe3"] + 0.9; k = 0
while tt < T["b16"] - 0.2: sfx(tick(1500 if k % 2 else 1900, 0.025, 0.3), tt, 0.15, db(-33)); tt += 0.5; k += 1             # a clock in the study
cue("clock", T["wipe3"] + 0.9)
tt = T["wrote"] + 0.35
while tt < T["very"] + 1.4: sfx(scratch(0.16 + rng.uniform(0, 0.12)), tt, -0.1, db(-31)); tt += 0.2 + rng.uniform(0, 0.15)
cue("quill", T["wrote"] + 0.35)
sfx(ding([587.3, 880, 1174.7], 1.5), T["storyT"], 0, db(-23)); cue("title", T["storyT"])
for k in range(8): sfx(kalimba(3520 * 2 ** (-k / 12), 0.5), T["b16"] + 3.2 + k * 0.05, 0.3 + k * 0.06, db(-33))
sfx(blip(698, 0.12), T["even"], 0, db(-26))
sfx(ding([1318.5, 1975.5], 0.8), T["cta"] + 0.1, 0, db(-30)); cue("legend chip", T["cta"] + 0.1)
for i, tk in enumerate(CU["typing"]): sfx(tick(2600 + i * 120, 0.018, 0.5), tk, 0, db(-28))
cue("typing APPLE", CU["typing"][0])
sfx(blip(1046.5, 0.09), T["rain0"] - 0.25, 0, db(-27)); sfx(blip(1568, 0.11), T["rain0"] - 0.15, 0, db(-28)); cue("posted", T["rain0"] - 0.25)
for i, tl in enumerate(CU["rain"]):
    if i % 2 == 0: sfx(bonk(), tl, rng.uniform(-0.8, 0.8), db(-33 + rng.uniform(-3, 2)))
for k in range(10): sfx(kalimba(1760 * 2 ** (k * 2 / 12), 0.5), T["rain0"] + k * 0.11, -0.5 + k * 0.1, db(-33))
cue("apple rain", T["rain0"])
sfx(blip(784, 0.12, -0.08), T["notTip"], 0.2, db(-28)); cue("just not a stock tip", T["notTip"])

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
