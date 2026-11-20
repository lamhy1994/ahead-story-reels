# Storybook soundtrack for "The Island of Stone Money": soft island music + sea, storm and village sounds, all synthesized.
# Reads audio/cues.json (exported from the scene) so every sound sits on the picture.
import json, numpy as np, soundfile as sf
from scipy import signal
SR = 48000
CU = json.load(open("audio/cues.json")); T = CU["T"]; DUR = CU["DUR"]; N = int(DUR * SR)
rng = np.random.default_rng(1903)
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
bp = lambda x, lo, hi, o=2: signal.sosfilt(signal.butter(o, [lo, hi], btype="band", fs=SR, output="sos"), x)
lp = lambda x, f, o=2: signal.sosfilt(signal.butter(o, f, btype="low", fs=SR, output="sos"), x)
hp = lambda x, f, o=2: signal.sosfilt(signal.butter(o, f, btype="high", fs=SR, output="sos"), x)

# ───────── instruments
NOTE = {n: i for i, n in enumerate(["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"])}; NOTE["Bb"] = 10; NOTE["Eb"] = 3
def hz(name): n, o = name[:-1], int(name[-1]); return 440.0 * 2 ** ((NOTE[n] - 9) / 12 + (o - 4))
def pluck(f, dur=1.9, bright=1.0):          # soft harp
    n = int(dur * SR); t = np.arange(n) / SR; x = np.zeros(n)
    for k in range(1, 11):
        if f * k > 9000: break
        x += (bright ** (k - 1)) / k ** 1.15 * np.sin(2 * np.pi * f * k * (1 + 0.0004 * k * k) * t) * np.exp(-t * (1.7 + 0.85 * k))
    a = int(0.003 * SR); x[:a] *= np.linspace(0, 1, a); return x * 0.6
def kalimba(f, dur=1.3):                    # music-box sparkle
    n = int(dur * SR); t = np.arange(n) / SR
    x = np.sin(2 * np.pi * f * t) * np.exp(-t / 0.32) + 0.3 * np.sin(2 * np.pi * f * 3.01 * t) * np.exp(-t / 0.07) + 0.12 * np.sin(2 * np.pi * f * 5.4 * t) * np.exp(-t / 0.03)
    a = int(0.002 * SR); x[:a] *= np.linspace(0, 1, a); return x * 0.5
def marimba(f, dur=0.9):                    # soft wooden mallet (island colour)
    n = int(dur * SR); t = np.arange(n) / SR
    x = np.sin(2 * np.pi * f * t) * np.exp(-t / 0.22) + 0.35 * np.sin(2 * np.pi * f * 3.93 * t) * np.exp(-t / 0.04) + 0.12 * np.sin(2 * np.pi * f * 9.2 * t) * np.exp(-t / 0.012)
    a = int(0.0015 * SR); x[:a] *= np.linspace(0, 1, a); return x * 0.55
def pad(freqs, dur, att=0.9, rel=1.4):      # warm chord bed, slightly wide
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
def logdrum(f=210):                          # slit drum: woody knock with a short pitch drop
    n = int(0.3 * SR); t = np.arange(n) / SR; ff = f * (1 + 0.25 * np.exp(-t / 0.012))
    x = np.sin(2 * np.pi * np.cumsum(ff) / SR) * env_exp(n, 0.07, 0.001) + 0.4 * np.sin(2 * np.pi * np.cumsum(ff * 2.7) / SR) * env_exp(n, 0.02, 0.001)
    return x * 0.6
def shaker(dur=0.06):
    n = int(dur * SR); return bp(rng.standard_normal(n), 4000, 11000) * np.sin(np.pi * np.arange(n) / n) ** 2 * 0.6
def tick(f=3200, dur=0.02, noise=0.6):
    n = int(dur * SR); t = np.arange(n) / SR; x = np.sin(2 * np.pi * f * t) * (1 - noise) + noise * rng.standard_normal(n) * 0.7
    return bp(x, max(300, f * 0.5), min(f * 2.2, 20000)) * env_exp(n, dur / 4, 0.0006)
def blip(f, dur=0.12, bend=0.0, h2=0.25):
    n = int(dur * SR); t = np.arange(n) / SR; ph = 2 * np.pi * np.cumsum(f * (1 + bend * t / dur)) / SR; return (np.sin(ph) + h2 * np.sin(2 * ph)) * env_exp(n, dur / 3.2, 0.004)
def ding(freqs, dur=0.9):
    n = int(dur * SR); t = np.arange(n) / SR; x = np.zeros(n)
    for k, f in enumerate(freqs): x += np.sin(2 * np.pi * f * t) * np.exp(-t / (dur / (3.0 + k * 0.8))) + 0.1 * np.sin(2 * np.pi * f * 2.76 * t) * np.exp(-t / (dur / 9))
    a = int(0.004 * SR); x[:a] *= np.linspace(0, 1, a); return x / len(freqs)
def thud(f0=85, f1=42, dur=0.42):
    n = int(dur * SR); t = np.arange(n) / SR; ff = f1 + (f0 - f1) * np.exp(-t / 0.06); return np.sin(2 * np.pi * np.cumsum(ff) / SR) * env_exp(n, dur / 3.5, 0.004)
def clack():                                 # a stone slab set down
    n = int(0.16 * SR); t = np.arange(n) / SR; f = rng.uniform(700, 1100)
    x = (np.sin(2 * np.pi * f * t) + 0.5 * np.sin(2 * np.pi * f * 2.3 * t)) * env_exp(n, 0.018, 0.0005) + 0.5 * bp(rng.standard_normal(n), 1500, 6000) * env_exp(n, 0.008, 0.0003)
    return x * 0.6 + np.pad(thud(140, 80, 0.12), (0, n - int(0.12 * SR))) * 0.5
def whoosh(dur=1.2, f_lo=300, f_hi=3200):
    n = int(dur * SR); t = np.arange(n) / SR; u = t / dur; fc = f_lo * (f_hi / f_lo) ** (np.sin(np.pi * u) ** 1.2)
    nl = lp(rng.standard_normal(n), 600); nr = lp(rng.standard_normal(n), 600)
    ph = 2 * np.pi * np.cumsum(fc) / SR; e = np.sin(np.pi * u) ** 1.6; return nl * np.sin(ph) * e * 3.0, nr * np.sin(ph + 0.9) * e * 3.0
def noise_bed(dur, lo, hi, lfo=0.13, depth=0.5, fade=1.0):
    n = int(dur * SR); t = np.arange(n) / SR; out = []
    for ch in range(2):
        x = bp(rng.standard_normal(n), lo, hi)
        e = 1 - depth + depth * (0.5 + 0.5 * np.sin(2 * np.pi * lfo * t + rng.uniform(0, 6.28))) * (0.6 + 0.4 * np.sin(2 * np.pi * lfo * 2.7 * t + rng.uniform(0, 6.28)))
        e *= np.minimum(1, t / fade) * np.minimum(1, (dur - t) / fade); out.append(x * e)
    return out[0], out[1]
def surf(dur, period=6.5, gain=1.0):         # small waves on the beach: slow swells with a soft hiss on each break
    n = int(dur * SR); t = np.arange(n) / SR; out = []
    for ch in range(2):
        ph = rng.uniform(0, 6.28); sw = (0.5 + 0.5 * np.sin(2 * np.pi * t / period + ph)) ** 3
        x = lp(rng.standard_normal(n), 900) * (0.35 + 0.65 * sw) + hp(rng.standard_normal(n), 2500) * sw ** 2 * 0.35
        out.append(x * np.minimum(1, t / 1.2) * np.minimum(1, (dur - t) / 1.2) * gain)
    return out[0], out[1]
def murmur(dur, swell=None):                 # village voices
    n = int(dur * SR); t = np.arange(n) / SR; out = []
    for ch in range(2):
        x = bp(rng.standard_normal(n), 260, 1700)
        am = lp(np.abs(rng.standard_normal(n)), 6); am = am / (am.max() + 1e-9)
        g = np.minimum(1, t / 0.8) * np.minimum(1, (dur - t) / 0.8) * (swell(t / dur) if swell else 1)
        out.append(x * (0.35 + 0.65 * am) * g)
    return out[0], out[1]
def cheer(dur=0.9):
    n = int(dur * SR); t = np.arange(n) / SR; x = bp(rng.standard_normal(n), 500, 2600) * (0.6 + 0.4 * np.sin(2 * np.pi * 7 * t + rng.uniform(0, 6)))
    return x * np.sin(np.pi * np.minimum(1, t / dur)) ** 0.7 * 1.6
def gull():                                  # far sea bird
    f = rng.uniform(1700, 2300); return blip(f, 0.16, 0.35, 0.4) * 0.6 + np.pad(blip(f * 1.12, 0.12, -0.3, 0.4), (int(0.09 * SR), 0))[:int(0.16 * SR)] * 0.4
def flutter(dur=0.35):                       # paper rustle
    n = int(dur * SR); t = np.arange(n) / SR; x = bp(rng.standard_normal(n), 1800, 7000)
    am = 0.4 + 0.6 * np.abs(np.sin(2 * np.pi * rng.uniform(14, 24) * t)); return x * am * np.sin(np.pi * t / dur) ** 1.5 * 1.4
def brush(dur=0.2):                          # paint stroke
    n = int(dur * SR); t = np.arange(n) / SR; x = bp(rng.standard_normal(n), 900, 5000)
    return x * (0.6 + 0.4 * np.sin(2 * np.pi * rng.uniform(25, 40) * t)) * np.sin(np.pi * t / dur) ** 0.8 * 1.1
def rub(dur=0.45):                           # cloth wiping stone
    n = int(dur * SR); t = np.arange(n) / SR; x = bp(rng.standard_normal(n), 600, 3500)
    return x * (0.5 + 0.5 * np.abs(np.sin(2 * np.pi * 6 * t))) * np.sin(np.pi * t / dur) * 1.2
def scrape(dur=0.9):                         # canoe dragged over sand
    n = int(dur * SR); t = np.arange(n) / SR; x = bp(rng.standard_normal(n), 300, 2400)
    return x * (0.55 + 0.45 * np.abs(np.sin(2 * np.pi * 3.2 * t))) * np.sin(np.pi * t / dur) ** 0.6
def splash(dur=1.1):
    n = int(dur * SR); t = np.arange(n) / SR
    x = bp(rng.standard_normal(n), 400, 6000) * (np.exp(-t / 0.12) + 0.35 * np.exp(-t / 0.5))
    return x * 1.3 + np.pad(thud(70, 34, 0.6), (0, n - int(0.6 * SR))) * 0.9
def bubble(f=None):
    f = f or rng.uniform(500, 1100); n = int(0.07 * SR); t = np.arange(n) / SR; return np.sin(2 * np.pi * np.cumsum(f * (1 + 1.6 * t / 0.07)) / SR) * env_exp(n, 0.02, 0.002) * 0.5
def thunder(dur=3.2):
    n = int(dur * SR); t = np.arange(n) / SR
    rum = lp(rng.standard_normal(n), 220, 3) * (np.exp(-t / 1.1) * (0.6 + 0.4 * np.abs(np.sin(2 * np.pi * 1.7 * t))))
    crack = hp(rng.standard_normal(n), 1200) * np.exp(-t / 0.05) * 0.5
    return (rum * 3.2 + crack) * np.minimum(1, t / 0.01)
def snap():                                  # rope cut: a twang and a crack
    n = int(0.5 * SR); t = np.arange(n) / SR; f = 180 * (1 + 0.5 * np.exp(-t / 0.03))
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env_exp(n, 0.12, 0.001) * 0.6 + hp(rng.standard_normal(n), 2000) * np.exp(-t / 0.015) * 0.8
def crickets(dur):
    n = int(dur * SR); x = np.zeros(n); t0 = 0.0
    while t0 < dur - 0.2:
        f = rng.uniform(4200, 5200); m = int(0.12 * SR); tt = np.arange(m) / SR; i = int(t0 * SR)
        ch = np.sin(2 * np.pi * f * tt) * (0.5 + 0.5 * np.sign(np.sin(2 * np.pi * 38 * tt))) * np.sin(np.pi * tt / 0.12)
        x[i:i + m] += ch[:max(0, min(m, n - i))]; t0 += rng.uniform(0.25, 0.6)
    return x * np.minimum(1, np.arange(n) / SR / 0.8) * np.minimum(1, (dur - np.arange(n) / SR) / 0.8) * 0.25

# ───────── music: D minor storybook with island colour (marimba, slit drum), 84 BPM
BEAT = 60 / 84
CH = {"Dm": ["D", "F", "A"], "Dm9": ["D", "F", "A", "E"], "Bb": ["Bb", "D", "F"], "Bb7": ["Bb", "D", "F", "A"], "F": ["F", "A", "C"], "Fadd9": ["F", "A", "C", "G"], "C": ["C", "E", "G"], "Gm": ["G", "Bb", "D"], "A": ["A", "C#", "E"], "As": ["A", "D", "E"]}
ROOT = {"Dm": "D2", "Dm9": "D2", "Bb": "Bb1", "Bb7": "Bb1", "F": "F2", "Fadd9": "F2", "C": "C2", "Gm": "G1", "A": "A1", "As": "A1"}
PROG = [(0, "Dm9"), (T["rich1"], "Bb7"), (T["b2"] - 0.3, "F"), (T["b3"], "C"), (T["twelve"], "Dm"), (T["b4"], "Bb"), (T["raft4"], "F"), (T["b5"], "F"), (T["stone5"], "C"), (T["never"], "Dm"), (T["everyone"], "Bb"), (T["owner"], "C"),
        (T["b6"], "Gm"), (T["great"], "As"), (T["wipe1"] + 0.9, "Dm"), (T["storm"], "Bb"), (T["b8"], "Gm"), (T["cut"], "A"), (T["stone8"], "Dm"), (T["wipe2"] + 0.9, "F"), (T["magnificent"], "C"), (T["agreed"], "Bb"), (T["counted"], "F"),
        (T["b10"], "Dm"), (T["generations"], "Fadd9"), (T["wipe3"] + 0.9, "Dm"), (T["ignored"], "Gm"), (T["paths11"], "As"), (T["b12"], "Dm"), (T["paint"], "Gm"), (T["crosses"], "A"), (T["b13"], "Dm"), (T["fixed"], "Bb"), (T["b14"], "C"), (T["rich14"], "F"),
        (T["b15"] + 0.2, "Bb"), (T["money2"], "F"), (T["agree"], "C"), (T["cta"], "Dm9"), (T["something"], "Fadd9"), (DUR, "Fadd9")]
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
    if T["wipe1"] <= t0 < T["wipe2"]: lvl = 1.1
    fr = [hz(f"{n}{3 if n in ('D', 'E', 'F', 'C', 'C#') else 2}") * (2 if n in ("G", "A", "Bb") else 1) for n in CH[c]]
    mus(pad(fr, d), t0 - 0.25, 0, 0.9 * lvl); mus(pad([f * 2 for f in fr[:3]], d, 1.4), t0 - 0.25, 0, 0.26 * lvl); mus(bass(hz(ROOT[c]), d), t0, 0, 0.55 * lvl)
def arp(t0, t1, step, pat, lo, gain, kind=pluck, sw=0.0):
    k = 0; t = t0
    while t < t1 - 0.05:
        ts = tones(chord_at(t + 0.02), lo); f = ts[pat[k % len(pat)] % len(ts)]
        mus(kind(f), t + (sw if k % 2 else 0), 0.35 * np.sin(k * 1.9), gain * (1.0 if k % 2 == 0 else 0.72)); k += 1; t += step
def drums(t0, t1, gain):                     # slit drum + shaker, a gentle island lilt
    t = t0; k = 0
    while t < t1 - 0.1:
        b = k % 8
        if b in (0, 3, 6): mus(logdrum(196 if b == 0 else 262), t, -0.15 if b else 0, gain * (1.0 if b == 0 else 0.7))
        if b in (2, 5, 7): mus(shaker(), t, 0.3, gain * 0.5)
        k += 1; t += BEAT / 2
arp(0.0, T["b2"] - 0.2, BEAT / 2, [5, 3, 4, 2, 5, 4, 3, 1], 5, 0.12, kalimba)                    # under the sea: music-box shimmer
for k in range(9): mus(pluck(hz(["D4", "F4", "G4", "A4", "C5", "D5", "F5", "G5", "A5"][k]), 1.4), T["sea"] - 0.2 + k * 0.08, -0.5 + k / 8, 0.32)     # harp run up to the island
arp(T["b2"], T["b6"] - 0.2, BEAT / 2, [0, 2, 3, 2, 4, 3, 2, 1], 3, 0.36, marimba)               # the island
arp(T["b3"] + 0.2, T["b6"] - 0.3, BEAT, [3, 4, 5, 4], 4, 0.16, kalimba)
drums(T["b4"] - 0.4, T["b6"] - 0.4, 0.3)
arp(T["b6"], T["wipe1"] - 0.1, BEAT, [0, 2, 1, 3], 3, 0.3)                                        # sunset: a friend's story
arp(T["wipe1"] + 0.9, T["wipe2"] - 0.1, BEAT / 3, [0, 1, 2, 3, 2, 1], 2, 0.3)                   # the storm: restless triplets
for k in range(8): mus(pluck(hz(["A5", "F5", "D5", "A4", "F4", "D4", "A3", "D3"][k]), 1.6), T["stone8"] + 0.3 + k * 0.11, 0.4 - k / 10, 0.34)   # the stone sinks
arp(T["wipe2"] + 0.9, T["wipe3"] - 0.2, BEAT / 2, [0, 2, 4, 2, 3, 5, 4, 2], 3, 0.36, marimba)    # back home
arp(T["b10"], T["wipe3"] - 0.2, BEAT * 2, [5, 4, 3], 5, 0.14, kalimba)
arp(T["wipe3"] + 0.9, T["b13"] - 0.1, BEAT / 2, [0, 2, 1, 3, 0, 2, 1, 4], 3, 0.32, pluck)       # German rule: plucky, a little sly
drums(T["wipe3"] + 0.9, T["b13"] - 0.3, 0.22)
arp(T["b13"], T["b14"] - 0.1, BEAT / 3, [0, 1, 2, 3, 4, 5], 3, 0.32, marimba)                    # everyone fixes the paths
arp(T["b14"], T["b15"] - 0.1, BEAT / 2, [0, 2, 4, 5, 4, 2, 3, 1], 3, 0.36, marimba)
drums(T["b13"], T["b15"] - 0.2, 0.3)
arp(T["b15"] + 0.2, T["cta"] - 0.2, BEAT / 2, [0, 2, 3, 2, 4, 3, 2, 1], 3, 0.34)                # the story's close
MEL = ["A4", "F4", "D4", None, "F4", "G4", "A4", None, "C5", "A4", "G4", "F4"]
for k, n in enumerate(MEL):
    if n: mus(kalimba(hz(n) * 2, 1.6), T["b15"] + 0.6 + k * BEAT, 0.2, 0.2)
for k, n in enumerate(["D5", "A5", "D6", "F6", "A6"]): mus(kalimba(hz(n), 1.8), T["cta"] + 0.4 + k * 0.33, -0.3 + k * 0.15, 0.16)
arp(T["something"], DUR - 0.6, BEAT / 2, [0, 2, 4, 5, 4, 2], 4, 0.14, kalimba)
t = np.arange(N) / SR; fo = np.minimum(1, (DUR - t) / 1.3) ** 1.2
for ch in MUS: ch *= fo

# ───────── sound effects
cues = []
def cue(name, t): cues.append((round(t, 2), name))
# ambience: under the sea, the lagoon, the storm, the village
sfx(noise_bed(T["sea"] + 0.4, 80, 500, 0.2, 0.5, 0.8), 0.0, 0, db(-31)); cue("under the sea", 0.0)
for i in range(18): sfx(bubble(), rng.uniform(0.3, T["sea"] - 0.2), rng.uniform(-0.5, 0.5), db(-33 + rng.uniform(-3, 2)))
sfx(surf(T["wipe1"] - T["sea"] + 1.0, 6.0), T["sea"] - 0.6, 0, db(-31)); cue("lagoon waves", T["sea"])
sfx(surf(T["wipe3"] - T["wipe2"] + 0.4, 6.5), T["wipe2"] + 0.6, 0, db(-32)); sfx(surf(DUR - T["wipe3"] - 0.6, 7.0), T["wipe3"] + 0.6, 0, db(-33))
for tg in list(np.arange(T["b2"] + 0.5, T["b6"] - 0.5, 2.7)) + list(np.arange(T["wipe2"] + 1.4, T["b10"] + 1.5, 3.1)): sfx(gull(), tg + rng.uniform(0, 0.8), rng.uniform(-0.7, 0.7), db(-37 + rng.uniform(-3, 2)))
cue("sea birds", T["b2"] + 0.5)
sfx(crickets(T["wipe1"] - T["b6"] + 0.6), T["b6"] - 0.3, 0.2, db(-38)); cue("evening crickets", T["b6"])
st0, st1 = T["wipe1"] + 0.6, T["wipe2"] + 0.8
sfx(noise_bed(st1 - st0, 3000, 12000, 0.6, 0.3, 0.6), st0, 0, db(-31)); sfx(noise_bed(st1 - st0, 150, 900, 0.17, 0.7, 0.6), st0, 0, db(-27)); cue("rain + wind", st0)
sfx(surf(st1 - st0, 3.2, 1.6), st0, 0, db(-29)); cue("big waves", st0)
for i, tb in enumerate(CU["bolts"]): sfx(thunder(3.0 + i * 0.3), tb + 0.08, [-0.3, 0.3, 0.0][i], db(-21)); cue("thunder", tb)
sfx(murmur(T["b6"] - T["b5"] + 0.4, lambda u: 0.6 + 0.4 * np.sin(np.pi * u)), T["b5"] - 0.2, 0, db(-37)); cue("village murmur", T["b5"])
sfx(murmur(T["b10"] - T["wipe2"] - 0.5, lambda u: 0.5 + 0.5 * np.sin(np.pi * u)), T["wipe2"] + 0.8, 0, db(-37))
sfx(murmur(T["b15"] - T["wipe3"], lambda u: 0.55 + 0.45 * np.sin(np.pi * u)), T["wipe3"] + 0.9, 0, db(-37))
# 1 — the year rolls back; the sunken stone glints
for k in range(15): u = k / 14; sfx(tick(2600 - 1300 * u, 0.02, 0.35), 0.06 + 1.18 * (1 - (1 - u) ** 2), 0.3 * np.sin(k), db(-29))
sfx(ding([1174.7, 1760], 0.9), 1.27, 0, db(-25)); cue("year lands on 1903", 1.27)
for k in range(6): sfx(kalimba(1760 * 2 ** (k * 2 / 12), 0.6), T["rich1"] + k * 0.07, -0.2 + k * 0.08, db(-31))
cue("the stone glints", T["rich1"])
sfx(blip(784, 0.12), T["rich1"] + 0.35, 0.2, db(-29)); cue("their money ↓", T["rich1"] + 0.35)
sfx(whoosh(1.3, 250, 2200), T["sea"] - 0.4, 0, db(-27)); cue("rise to the island", T["sea"] - 0.4)
sfx(ding([1174.7, 1760, 2349], 1.0), T["name"], 0, db(-25)); cue("name card", T["name"])
# 3 — twelve feet; 4 — Palau to Yap
for k in range(7): sfx(blip(523 * 2 ** (k * 2 / 12), 0.1), T["twelve"] - 0.05 + k * 0.06, 0, db(-30))
sfx(ding([1318.5, 1975.5], 0.8), T["twelve"] + 0.4, 0, db(-27)); cue("12 ft", T["twelve"])
sfx(blip(659, 0.1), T["b4"] + 0.15, -0.3, db(-29)); sfx(ding([1046.5, 1568], 0.8), T["raft4"] + 0.35, 0.3, db(-28)); cue("route: Palau → Yap", T["b4"] + 0.15)
for k in range(5): sfx(splash(0.6), T["b4"] - 0.6 + k * 0.9, 0.3, db(-41)); cue("paddles", T["b4"])
# 5 — a canoe for a stone; everyone remembers
sfx(blip(587, 0.1), T["b5"] + 0.25, 0, db(-29)); cue("owner tag", T["b5"] + 0.25)
sfx(scrape(0.95), T["stone5"] + 0.25, -0.2, db(-27)); cue("the canoe changes hands", T["stone5"] + 0.25)
sfx(ding([880, 1318.5], 0.7), T["never"] + 0.15, 0, db(-27)); cue("owner switches", T["never"] + 0.15)
for i, tb in enumerate(CU["bubbles"]): sfx(blip(784 * 2 ** (i * 2 / 12), 0.1, 0.1), tb, rng.uniform(-0.5, 0.5), db(-29))
cue("✓ bubbles (everyone remembers)", CU["bubbles"][0])
# 6 — the friend's story; 7 — the storm
sfx(blip(523, 0.14), T["friend"] + 0.35, -0.2, db(-30))
for tw, dur, g in ((T["wipe1"] - 0.05, 1.3, -22), (T["wipe2"] - 0.05, 1.2, -23), (T["wipe3"] - 0.05, 1.2, -23)): sfx(whoosh(dur), tw, 0, db(g)); cue("sky wipe", tw)
sfx(snap(), CU["cut"], -0.2, db(-22)); cue("rope cut", CU["cut"])
sfx(thud(60, 30, 0.9), CU["tip"] + 0.05, 0, db(-26)); sfx(noise_bed(0.6, 80, 400, 2.0, 0.6, 0.15), CU["tip"], 0, db(-28)); cue("the stone rolls", CU["tip"])
sfx(splash(1.2), CU["splash"], -0.3, db(-20)); cue("splash", CU["splash"])
for i in range(16): sfx(bubble(rng.uniform(380, 800)), CU["splash"] + 0.2 + i * 0.07, rng.uniform(-0.4, 0.2), db(-31))
# 9 — they swore; it still counts; 10 — generations
for k in range(8): sfx(kalimba(1318.5 * 2 ** (k * 2 / 12), 0.7), T["magnificent"] + k * 0.06, -0.3 + k * 0.08, db(-31))
sfx(blip(698, 0.12), T["magnificent"] + 0.05, -0.3, db(-29)); cue("“magnificent!” + the stone they remember", T["magnificent"])
for i in range(6): sfx(blip(392 + i * 20, 0.08, -0.15), T["agreed"] + i * 0.09, rng.uniform(-0.5, 0.5), db(-34))
sfx(ding([1046.5, 1568, 2093], 1.0), T["counted"], 0, db(-26)); cue("still counts ✓", T["counted"])
for i, tg in enumerate(CU["gens"]): sfx(marimba(hz(["D5", "F5", "A5"][i]), 0.8), tg, -0.2 + i * 0.2, db(-27))
cue("generations", CU["gens"][0])
# 11 — German rule: the station, the orders, ignored
sfx(thud(120, 60, 0.3), CU["station"], -0.3, db(-27)); sfx(blip(523, 0.1), CU["station"] + 0.1, -0.3, db(-30)); cue("station pops up", CU["station"])
for tp in CU["papers"]: sfx(flutter(0.4), tp - 0.5, 0.1, db(-28))
cue("orders", CU["papers"][0] - 0.5)
for tg in (T["ignored"] + 0.5, T["paths11"] + 0.35): sfx(blip(330, 0.18, -0.3), tg, 0, db(-28))
cue("ignored", T["ignored"] + 0.5)
# 12 — black crosses
for tb in CU["crosses"]: sfx(brush(0.22), tb, 0.1, db(-25))
cue("brush strokes", CU["crosses"][0])
sfx(thud(90, 45, 0.45), T["stones12"] + 0.05, 0, db(-26)); sfx(blip(294, 0.25, -0.2), T["stones12"] + 0.1, 0, db(-28)); cue("claimed", T["stones12"])
# 13 — suddenly poor; the paths fixed
for i in range(4): sfx(blip(587 * 2 ** (-i * 3 / 12), 0.14), T["poor"] - 0.1 + i * 0.12, 0, db(-29))
cue("suddenly poor", T["poor"])
for i, ts in enumerate(CU["slabs"]): sfx(clack(), ts, -0.4 + 0.8 * i / max(1, len(CU["slabs"]) - 1), db(-31))
cue("slabs set back", CU["slabs"][0])
sfx(ding([1174.7, 1760], 0.8), T["fixed"] + 0.9, 0, db(-27)); cue("paths fixed ✓", T["fixed"] + 0.9)
# 14 — wiped; rich again
for i in range(3): sfx(rub(0.4), T["wiped"] - 0.05 + i * 0.12, -0.2 + i * 0.2, db(-27))
for k in range(8): sfx(kalimba(2093 * 2 ** (-k / 12), 0.5), T["wiped"] + 0.1 + k * 0.05, 0.3, db(-32))
cue("crosses wiped", T["wiped"])
sfx(ding([1318.5, 1975.5, 2637], 1.0), T["wiped"] + 0.35, 0, db(-27)); cue("fine paid ✓", T["wiped"] + 0.35)
for i in range(3): sfx(cheer(0.9 + rng.uniform(0, 0.3)), T["rich14"] + i * 0.15, rng.uniform(-0.4, 0.4), db(-31))
cue("rich again (cheer)", T["rich14"])
# 15 — title; 16 — legend
sfx(ding([587.3, 880, 1174.7], 1.5), T["story"], 0, db(-23)); cue("title", T["story"])
sfx(blip(698, 0.12), T["money2"], 0, db(-27))
sfx(ding([1318.5, 1975.5], 0.8), T["cta"] + 0.1, 0, db(-30)); cue("legend chip", T["cta"] + 0.1)
for i, tk in enumerate(CU["typing"]): sfx(tick(2600 + i * 120, 0.018, 0.5), tk, 0, db(-28))
cue("typing STONE", CU["typing"][0])
sfx(blip(1046.5, 0.09), T["posted"], 0, db(-27)); sfx(blip(1568, 0.11), T["posted"] + 0.1, 0, db(-28)); cue("posted", T["posted"])
r0, r1, h0, h1 = CU["rise"]
sfx(whoosh(r1 - r0 + 0.6, 120, 1400), r0, 0, db(-25)); sfx(splash(1.0), r1 - 0.25, 0, db(-27)); cue("the stone rises", r0)
for k in range(12): sfx(kalimba(hz(["D5", "F5", "A5", "C6", "D6", "F6"][k % 6]) * (2 if k >= 6 else 1), 0.8), r0 + k * 0.11, -0.4 + k * 0.07, db(-30))
sfx(whoosh(h1 - h0 + 0.3, 400, 2600), h0, 0.2, db(-27)); sfx(thud(110, 55, 0.4), h1, 0, db(-25)); sfx(ding([1174.7, 1760, 2349], 1.2), h1 + 0.05, 0, db(-26)); cue("home", h1)
sfx(blip(784, 0.12, -0.08), T["just"], 0.2, db(-28)); cue("just not twelve feet wide", T["just"])

# ───────── mix: voice in the middle, bed ~14 dB under it, effects on top; the bed ducks a little under the voice
vo, sr = sf.read("audio/vo_proc.wav"); assert sr == SR
V = np.zeros(N); V[:min(N, len(vo))] = vo[:N]
rms = lambda x: float(np.sqrt(np.mean(np.square(x)) + 1e-12))
spk = np.abs(V) > 0.02; vr = rms(V[spk])
envv = lp(np.abs(V), 6); envv = envv / (envv.max() + 1e-9)
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
