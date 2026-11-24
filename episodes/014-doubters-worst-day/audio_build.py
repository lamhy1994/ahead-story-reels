# Storybook soundtrack for "The Doubters' Worst Day": a soft D-minor bed with a modern pulse, plaza, coins, a European square, all synthesized.
# Reads audio/cues.json (exported from the scene) so every sound sits on the picture.
import json, numpy as np, soundfile as sf
from scipy import signal
SR = 48000
CU = json.load(open("audio/cues.json")); T = CU["T"]; DUR = CU["DUR"]; N = int(DUR * SR)
rng = np.random.default_rng(20261124)
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

def epiano(f, dur=1.6):                      # soft electric piano (FM bell): the modern city's colour
    n = int(dur * SR); t = np.arange(n) / SR; mod = 1.6 * np.exp(-t / 0.35) * np.sin(2 * np.pi * f * 2 * t)
    x = np.sin(2 * np.pi * f * t + mod) * np.exp(-t / 0.7) + 0.25 * np.sin(2 * np.pi * f * 4.01 * t) * np.exp(-t / 0.12)
    a = int(0.003 * SR); x[:a] *= np.linspace(0, 1, a); return x * 0.45
def kick(gain=1.0):                          # very soft kick for the city pulse
    n = int(0.28 * SR); t = np.arange(n) / SR; f = 48 + 70 * np.exp(-t / 0.035)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env_exp(n, 0.09, 0.002) * 0.8 * gain
def hat(dur=0.05):
    n = int(dur * SR); return hp(rng.standard_normal(n), 7000) * env_exp(n, dur / 4, 0.0005) * 0.5
def chiptune(f, dur=0.09):                   # 8-bit square blip (the pixel spaceship)
    n = int(dur * SR); t = np.arange(n) / SR; x = np.sign(np.sin(2 * np.pi * f * t)) * 0.35
    return lp(x, 6000) * env_exp(n, dur / 2.5, 0.001)
def shutter():                               # camera click
    n = int(0.09 * SR); t = np.arange(n) / SR
    x = bp(rng.standard_normal(n), 2500, 9000) * (np.exp(-t / 0.006) + 0.6 * np.exp(-np.maximum(0, t - 0.045) / 0.006) * (t > 0.045))
    return x * 1.2
def engine(dur):                             # a van rolling in
    n = int(dur * SR); t = np.arange(n) / SR; f = 38 + 6 * np.sin(2 * np.pi * 0.7 * t)
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) + 0.5 * np.sin(2 * np.pi * np.cumsum(f * 2) / SR) + 0.3 * lp(rng.standard_normal(n), 300)
    return x * np.sin(np.pi * t / dur) ** 0.8 * 0.5
def carpass(dur=2.2):                        # traffic going by on the road
    n = int(dur * SR); t = np.arange(n) / SR; u = t / dur; out = []
    for ch in range(2):
        x = bp(rng.standard_normal(n), 120, 1600) * np.exp(-((u - 0.5) / 0.22) ** 2)
        out.append(x * (0.6 + 0.4 * (u if ch else 1 - u)))
    return out[0], out[1]
def step():
    n = int(0.08 * SR); t = np.arange(n) / SR; return (bp(rng.standard_normal(n), 300, 2400) * np.exp(-t / 0.018) + 0.6 * np.sin(2 * np.pi * 95 * t) * np.exp(-t / 0.03)) * 0.6
def clink():                                 # coffee cup on a saucer
    f = rng.uniform(2400, 3200); n = int(0.35 * SR); t = np.arange(n) / SR
    return (np.sin(2 * np.pi * f * t) * np.exp(-t / 0.08) + 0.5 * np.sin(2 * np.pi * f * 2.76 * t) * np.exp(-t / 0.03)) * 0.4
def shopbell():                              # bell over a shop door
    out = np.zeros(int(1.4 * SR))
    for k, f in enumerate([2093, 2637, 2349, 2793]):
        b = ding([f, f * 1.5], 1.0); i = int(k * 0.07 * SR); out[i:i + len(b)] += b[:len(out) - i] * (1 - k * 0.15)
    return out * 0.7
def crackle(dur):
    n = int(dur * SR); x = np.zeros(n)
    for _ in range(int(dur * 22)):
        i = rng.integers(0, n - 400); m = rng.integers(60, 300); x[i:i + m] += bp(rng.standard_normal(m), 1500, 7000) * np.exp(-np.arange(m) / (m / 4)) * rng.uniform(0.3, 1)
    return x * 0.8
def hum(dur, f=60):                          # motor / sign hum
    n = int(dur * SR); t = np.arange(n) / SR
    x = np.sin(2 * np.pi * f * t) + 0.5 * np.sin(2 * np.pi * 2 * f * t) + 0.25 * np.sin(2 * np.pi * 3 * f * t)
    return x * np.minimum(1, t / 0.3) * np.minimum(1, (dur - t) / 0.3) * 0.3
def ping(f=1318.5):                          # sonar-like search ping
    n = int(1.2 * SR); t = np.arange(n) / SR; return np.sin(2 * np.pi * f * t) * np.exp(-t / 0.35) * (1 + 0.3 * np.sin(2 * np.pi * 6 * t)) * 0.5
def sweep(dur, f0, f1):                      # a tone gliding (rewind, falling price)
    n = int(dur * SR); t = np.arange(n) / SR; f = f0 * (f1 / f0) ** (t / dur)
    return (np.sin(2 * np.pi * np.cumsum(f) / SR) + 0.3 * np.sin(4 * np.pi * np.cumsum(f) / SR)) * np.sin(np.pi * t / dur) ** 0.7 * 0.5

def coin():                                  # small bright clink
    f = rng.uniform(2300, 3900); n = int(0.26 * SR); t = np.arange(n) / SR; x = np.zeros(n)
    for m, a, d in ((1, 1, 0.07), (1.47, 0.6, 0.05), (2.36, 0.4, 0.035), (3.3, 0.22, 0.02)): x += a * np.sin(2 * np.pi * f * m * t) * np.exp(-t / d)
    a = int(0.0008 * SR); x[:a] *= np.linspace(0, 1, a); return x * 0.5

def bell(f=392.0, dur=3.2):                  # a church bell far away (the European square)
    n = int(dur * SR); t = np.arange(n) / SR; x = np.zeros(n)
    for m, a, d in ((0.5, 0.5, 1.6), (1, 1, 1.2), (1.19, 0.5, 0.9), (1.5, 0.35, 0.7), (2.0, 0.3, 0.5), (2.74, 0.15, 0.3)): x += a * np.sin(2 * np.pi * f * m * t) * np.exp(-t / d)
    a = int(0.004 * SR); x[:a] *= np.linspace(0, 1, a); return lp(x, 3000) * 0.35
def alarm(dur=0.9):                          # two-tone halt chime
    out = np.zeros(int(dur * SR))
    for k in range(3):
        for j, f in enumerate((988, 740)):
            b = blip(f, 0.13, 0.0, 0.3); i = int((k * 0.3 + j * 0.14) * SR); out[i:i + len(b)] += b[:max(0, len(out) - i)]
    return out * 0.8

# ───────── music: D minor storybook, a soft city pulse, 88 BPM
BEAT = 60 / 88
CH = {"Dm": ["D", "F", "A"], "Dm9": ["D", "F", "A", "E"], "Bb": ["Bb", "D", "F"], "Bb7": ["Bb", "D", "F", "A"], "F": ["F", "A", "C"], "Fadd9": ["F", "A", "C", "G"], "C": ["C", "E", "G"], "Gm": ["G", "Bb", "D"], "A": ["A", "C#", "E"], "As": ["A", "D", "E"], "Eb": ["Eb", "G", "Bb"]}
ROOT = {"Dm": "D2", "Dm9": "D2", "Bb": "Bb1", "Bb7": "Bb1", "F": "F2", "Fadd9": "F2", "C": "C2", "Gm": "G1", "A": "A1", "As": "A1", "Eb": "Eb2"}
PROG = [(0, "Dm9"), (T["billion"], "Bb"), (T["day1"], "F"), (T["b2"], "Gm"), (T["seven"], "As"), (T["b3"], "Dm"), (T["much"], "As"),
        (T["b4"], "Dm"), (T["sells"], "F"), (T["buy"], "C"), (T["b5"], "Gm"), (T["quit"], "As"), (T["fell"], "Dm"), (T["week"], "Bb"), (T["paid"], "F"), (T["billions"], "C"),
        (T["b6"], "Bb"), (T["board"], "F"), (T["jumped"], "C"), (T["third"], "Dm"), (T["b7"], "Gm"), (T["gave"], "As"), (T["all7"], "Dm"),
        (T["b8"], "Bb"), (T["zero"], "Gm"), (T["rise8"], "F"), (T["limit"], "C"), (T["b9"], "Dm"), (T["funds"], "Bb"), (T["p3"], "Gm"), (T["rise9"], "As"),
        (T["b10"], "Dm"), (T["p90"], "Bb"), (T["halted"], "As"), (T["b11"], "F"), (T["ahead"], "C"), (T["story11"], "Dm"),
        (T["b12"], "Bb"), (T["right"], "F"), (T["wrong"], "C"), (T["cta"], "Dm9"), (DUR, "Dm9")]
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
    d = t1 - t0
    if d < 0.05: continue
    fr = [hz(f"{n}{3 if n in ('D', 'E', 'F', 'C', 'C#', 'Eb') else 2}") * (2 if n in ("G", "A", "Bb") else 1) for n in CH[c]]
    mus(pad(fr, d), t0 - 0.25, 0, 0.9); mus(pad([f * 2 for f in fr[:3]], d, 1.4), t0 - 0.25, 0, 0.24); mus(bass(hz(ROOT[c]), d), t0, 0, 0.55)
def arp(t0, t1, step, pat, lo, gain, kind=pluck, sw=0.0):
    k = 0; t = t0
    while t < t1 - 0.05:
        ts = tones(chord_at(t + 0.02), lo); f = ts[pat[k % len(pat)] % len(ts)]
        mus(kind(f), t + (sw if k % 2 else 0), 0.35 * np.sin(k * 1.9), gain * (1.0 if k % 2 == 0 else 0.72)); k += 1; t += step
def pulse(t0, t1, gain):                     # soft modern pulse: kick on 1 and 3, hats on the off-beats
    t = t0; k = 0
    while t < t1 - 0.1:
        if k % 4 in (0, 2): mus(kick(), t, 0, gain)
        mus(hat(), t + BEAT / 2, 0.25, gain * 0.35); k += 1; t += BEAT
arp(0.0, T["b2"] - 0.1, BEAT / 2, [0, 2, 4, 2, 3, 5, 4, 2], 4, 0.26, epiano)              # the doubters were winning; the big number
pulse(0.15, T["b2"] - 0.2, 0.3)
arp(T["b2"], T["b4"] - 0.1, BEAT / 2, [3, 2, 1, 0, 2, 1, 0, 1], 3, 0.26, epiano)          # their worst day; how?
arp(T["b4"], T["b5"] - 0.1, BEAT / 2, [0, 2, 4, 2, 3, 1, 2, 0], 4, 0.26, kalimba)         # how a short sale works: a music-box tune
arp(T["b5"], T["b6"] - 0.1, BEAT, [3, 2, 1, 0], 3, 0.3, epiano)                           # he quits; the giant sinks all week
arp(T["paid"] - 0.1, T["b6"] - 0.1, BEAT / 2, [0, 2, 4, 5], 4, 0.18, kalimba)             # …and the bet pays
arp(T["b6"] + 0.2, T["b7"] - 0.1, BEAT / 2, [0, 2, 3, 2, 4, 3, 5, 4], 3, 0.3, marimba)    # Monday: the board, the jump
pulse(T["b6"] + 0.4, T["b7"] - 0.2, 0.26)
arp(T["b7"], T["b8"] - 0.1, BEAT, [4, 3, 2, 1], 3, 0.3, epiano)                           # they give it back
arp(T["b8"], T["b9"] - 0.1, BEAT / 2, [0, 2, 1, 3, 2, 4, 3, 5], 4, 0.24, kalimba)         # the catch: the floor and no ceiling
arp(T["b9"] + 0.3, T["b11"] - 0.1, BEAT / 2, [0, 2, 4, 2, 3, 1, 2, 0], 3, 0.28, pluck)    # Europe: an old square, a harp
pulse(T["funds"], T["halted"] + 0.3, 0.18)
arp(T["b11"] + 0.4, T["b12"] - 0.1, BEAT / 2, [0, 2, 3, 2, 1, 3, 2, 0], 3, 0.26, epiano)  # still ahead; not over yet
arp(T["b12"], T["cta"] - 0.2, BEAT / 2, [0, 2, 3, 2, 4, 3, 2, 1], 3, 0.3)                # the story's close
MEL = ["A4", "F4", "D4", None, "F4", "G4", "A4", None, "C5", "A4", "G4", "F4"]
for k, n in enumerate(MEL):
    if n: mus(kalimba(hz(n) * 2, 1.6), T["b12"] + 0.4 + k * BEAT * 0.75, 0.2, 0.2)
for k, n in enumerate(["D5", "A5", "D6", "F6", "A6"]): mus(kalimba(hz(n), 1.8), T["cta"] + 0.4 + k * 0.33, -0.3 + k * 0.15, 0.16)
arp(T["comment"], DUR - 0.6, BEAT / 2, [0, 2, 4, 5, 4, 2], 4, 0.14, kalimba)
t = np.arange(N) / SR; fo = np.minimum(1, (DUR - t) / 1.3) ** 1.2
for ch in MUS: ch *= fo

# ───────── sound effects
cues = []
def cue(name, t): cues.append((round(t, 2), name))
sfx(noise_bed(DUR, 90, 700, 0.15, 0.4, 0.8), 0.0, 0, db(-34)); cue("city hum", 0.0)
for a, b in ((0.0, T["b4"]), (T["b11"] + 0.6, T["b12"] + 0.4)): sfx(murmur(b - a), a, 0, db(-38)); cue("plaza murmur", a)
sfx(murmur(T["b11"] - T["funds"] + 0.3), T["funds"] - 0.2, 0.1, db(-37)); cue("European square murmur", T["funds"])
sfx(crickets(T["b6"] + 0.4 - T["fell"]), T["fell"], -0.2, db(-40)); cue("night crickets (the week passes)", T["fell"])
sfx(crickets(DUR - T["right"] + 0.3), T["right"] - 0.3, -0.2, db(-39)); cue("night crickets", T["right"])
for tc in [1.2, 5.0, T["b8"] + 0.6, T["b12"] + 0.6, T["comment"] - 1.0]: sfx(carpass(2.2), tc, 0, db(-38))
cue("cars", 1.2)
# 0–3 s — the hook card (the doubters cheer by their pile), then the big number
sfx(thud(85, 42, 0.42), 0.0, 0, db(-21)); sfx(ding([587.3, 880, 1174.7], 1.3), 0.0, 0, db(-25)); cue("hook card", 0.0)
for k in range(7): sfx(coin(), 0.1 + k * 0.17, -0.3 + k * 0.1, db(-30))
sfx(cheer(1.1), 0.15, 0, db(-33)); cue("coins and a cheer (winning)", 0.1)
if T.get("hookEnd"): sfx(whoosh(0.6, 500, 3600), T["hookEnd"] - 0.05, 0, db(-27)); cue("hook card lifts", T["hookEnd"])
if T.get("bigIn"):
    sfx(thud(70, 34, 0.6), T["bigIn"] + 0.02, 0, db(-19)); sfx(whoosh(0.5, 3200, 400), T["bigIn"] - 0.15, 0, db(-26)); cue("big number", T["bigIn"])
    for k in range(10): sfx(tick(1800 + k * 140, 0.016, 0.4), T["bigIn"] + 0.06 + k * 0.064, 0.3 * np.sin(k), db(-31))
    sfx(ding([587.3, 880, 1174.7], 1.0), T["bigIn"] + 0.72, 0, db(-25)); sfx(whoosh(0.5, 600, 3000), T["bigOut"] - 0.1, 0, db(-29))
sfx(sweep(1.0, 700, 160), CU["flash"][0], 0, db(-31)); cue("the pile shrinks (flash-forward)", CU["flash"][0])
sfx(blip(659.3, 0.1), T["bigOut"] + 0.08, 0.1, db(-30)); cue("tag short sellers", T["bigOut"] + 0.08)
# 2–3 — their worst day; how?
sfx(blip(392, 0.26, -0.3), T["worst"], 0, db(-27)); sfx(thud(70, 34, 0.5), T["worst"] + 0.05, 0, db(-26)); cue("tag worst day since 2019", T["worst"])
sfx(blip(880, 0.09, 0.4), T["how"], 0.2, db(-28)); sfx(blip(1174.7, 0.09, 0.4), T["fast"], 0.2, db(-29)); cue("how?! bubble", T["how"])
# 4 — how a short sale works: borrow, sell, buy back cheaper
sfx(whoosh(1.0, 2200, 400), T["b4"] - 0.3, -0.2, db(-29)); cue("to the lender's kiosk", T["b4"] - 0.3)
sfx(flutter(0.5), CU["certs"][0], -0.3, db(-26)); sfx(blip(784, 0.08), T["borrows"], 0, db(-29)); cue("certificates: borrowed", CU["certs"][0])
sfx(flutter(0.5), CU["certs"][1], 0.2, db(-26)); sfx(blip(880, 0.08), T["sells"], 0, db(-29)); cue("certificates: sold", CU["certs"][1])
for k, tc in enumerate(CU["cash"]): sfx(brush(0.18), tc + 0.5, 0.1, db(-30))
cue("cash back", CU["cash"][0])
sfx(blip(987.8, 0.1), T["buy"], 0, db(-29)); sfx(ding([1174.7, 1760], 0.7), T["cheaper"], 0, db(-31)); cue("step 3: buy back cheaper?", T["buy"])
# 5 — he quits (12 Nov); the giant sinks all week; the bet pays: coins rain onto the pile
w0, w1 = CU["walkOut"]; sfx(sweep(1.2, 520, 260), T["b5"], 0, db(-30)); cue("the sky turns", T["b5"])
for k in range(int((w1 - w0) / 0.32)): sfx(step(), w0 + k * 0.32, 0.3, db(-33 - k * 0.6))
cue("he walks out", w0)
s0, s1 = CU["sink"]; sfx(sweep(s1 - s0 + 0.3, 260, 70), s0, 0, db(-24)); sfx(thud(60, 30, 0.8), s1 - 0.1, 0, db(-23)); cue("the giant sinks", s0)
sfx(blip(392, 0.22, -0.3), T["fell"] + 0.1, 0, db(-28)); cue("tag −28%", T["fell"])
for k, te in enumerate(CU["earn"]): sfx(coin(), te - 1.1, -0.3 + (k % 5) * 0.15, db(-29)); sfx(whoosh(0.6, 2600, 900), te - 1.0, 0, db(-38))
cue("coins stream out of the sinking giant ×72", CU["earn"][0] - 1.1)
sfx(cheer(1.2), T["paid"], 0, db(-30)); sfx(ding([1318.5, 1975.5], 0.8), T["paid"] + 0.05, 0.2, db(-29)); cue("cheer · tag + billions on paper", T["paid"])
# 6 — Monday: the board, hands up; he walks back; the giant jumps
sfx(whoosh(1.3, 300, 2400), T["b6"] - 0.1, 0, db(-27)); sfx(ding([587.3, 880], 1.0), T["monday"], 0, db(-30)); cue("sky wipe: Monday dawn", T["b6"])
for i, th in enumerate(CU["hands"]): sfx(blip([523.3, 587.3, 659.3, 698.5, 784, 880, 987.8, 1046.5][i % 8], 0.09), th + 0.05, -0.4 + i * 0.1, db(-29))
cue("hands up", CU["hands"][0])
i0, i1 = CU["walkIn"]
for k in range(int((i1 - i0) / 0.32)): sfx(step(), i0 + k * 0.32, -0.2, db(-33))
sfx(ding([880, 1318.5, 1760], 1.2), T["back6"], 0, db(-28)); cue("he is back", T["back6"])
b0, b1 = CU["riseB"]; sfx(sweep(b1 - b0 + 0.3, 80, 320), b0, 0, db(-24)); sfx(thud(80, 50, 0.5), b1 - 0.05, 0, db(-24)); cue("the giant jumps", b0)
for k in range(10): sfx(kalimba(hz(["D5", "F5", "A5", "C6", "D6"][k % 5]) * (2 if k > 6 else 1), 0.7), b0 + 0.2 + k * 0.15, -0.5 + k * 0.1, db(-33))
sfx(ding([1318.5, 1975.5], 0.8), T["jumped"] + 0.1, 0.2, db(-29)); cue("tag +31.5%", T["jumped"])
# 7 — they give it back: the coins fly to the giant
sfx(whoosh(1.4, 2400, 300), T["b7"] - 0.3, 0, db(-28)); cue("swoop down to the camp", T["b7"] - 0.3)
sfx(blip(392, 0.26, -0.3), T["one7"], 0, db(-28)); sfx(thud(70, 34, 0.5), T["one7"] + 0.05, 0, db(-27)); cue("tag about −$12 B in one day", T["one7"])
for k, tg in enumerate(CU["give"]): sfx(coin(), tg + 0.05, 0.3 - (k % 4) * 0.15, db(-29)); sfx(whoosh(0.5, 900, 2600), tg, 0, db(-37))
cue("coins fly back ×64", CU["give"][0])
sfx(sweep(1.1, 520, 180), T["all7"], 0, db(-29)); cue("almost all of it", T["all7"])
# 8 — the catch: the floor is $0; above, no ceiling
sfx(whoosh(1.2, 300, 2200), T["b8"] - 0.2, 0, db(-29)); sfx(ding([587.3, 880], 0.9), T["catch"], 0, db(-29)); cue("the catch", T["catch"])
sfx(sweep(0.8, 500, 90), T["fall8"] - 0.1, 0, db(-27)); sfx(thud(70, 34, 0.6), T["zero"] + 0.2, 0, db(-24)); cue("the floor: $0", T["zero"])
sfx(sweep(1.4, 140, 900), T["rise8"] - 0.1, 0, db(-27)); cue("the sky column rises", T["rise8"])
for k in range(10): sfx(kalimba(hz(["D5", "F5", "A5", "C6", "D6"][k % 5]) * (2 if k > 4 else 1), 0.7), T["rise8"] + 0.1 + k * 0.13, -0.5 + k * 0.1, db(-33))
sfx(ding([1318.5, 1975.5], 0.8), T["limit"], 0.2, db(-29)); cue("tag no ceiling", T["limit"])
# 9 — sky wipe to Europe; three times the other way
sfx(whoosh(1.5, 300, 2600), T["b9"] - 0.1, 0, db(-27)); cue("sky wipe: Europe", T["b9"])
sfx(bell(392.0, 3.4), T["funds"] - 0.1, -0.4, db(-27)); sfx(bell(293.7, 3.4), T["funds"] + 0.6, -0.4, db(-30)); cue("a church bell", T["funds"])
for k in range(3): sfx(gull(), T["funds"] + 0.6 + k * 0.5, 0.4, db(-37))
sfx(blip(784, 0.1, 0.3), T["lose9"] - 0.05, -0.2, db(-28)); cue("bar +1%", T["lose9"])
for k in range(3): sfx(blip(392 * 2 ** (-k * 3 / 12), 0.11, -0.2), T["p3"] - 0.05 + k * 0.1, 0.2, db(-28))
cue("bar −3%", T["p3"])
# 10 — the jar drains about 91%; trading halted
d0, d1 = CU["drain"]; sfx(sweep(d1 - d0 + 0.2, 420, 70), d0, 0.3, db(-25)); cue("the fund's jar drains", d0)
for k in range(9): sfx(bubble(rng.uniform(300, 700)), d0 + 0.1 + k * 0.12, 0.3, db(-30))
sfx(thud(60, 30, 0.7), d1 - 0.05, 0, db(-23)); sfx(blip(392, 0.24, -0.3), T["p90"] + 0.05, 0.2, db(-28)); cue("tag −91%", T["p90"])
sfx(clack(), T["halted"] + 0.12, -0.2, db(-24)); sfx(alarm(0.9), T["halted"] - 0.02, 0, db(-31)); cue("barrier drops · halted", T["halted"])
# 11 — back to the plaza: still ahead; not over yet
sfx(whoosh(1.5, 2600, 300), T["b11"] - 0.1, 0, db(-27)); cue("sky wipe: back to the plaza", T["b11"])
sfx(ding([880, 1318.5], 0.9), T["still"], 0, db(-29)); cue("tag still ahead overall", T["still"])
sfx(whoosh(1.2, 300, 2000), T["story11"] - 0.2, 0, db(-30)); sfx(ding([587.3, 880], 1.2), T["over"] + 0.2, 0, db(-29)); cue("not over yet", T["over"])
# 12 — the title and the lesson
sfx(whoosh(1.6, 300, 2000), T["b12"] - 0.1, 0, db(-29)); sfx(ding([587.3, 880, 1174.7], 1.5), T["story"], 0, db(-23)); cue("title", T["story"])
sfx(blip(698, 0.12), T["right"], 0, db(-27)); sfx(blip(523.3, 0.14, -0.2), T["wrong"], 0, db(-27)); cue("lesson card", T["right"])
# 13 — you decide
sfx(ding([1318.5, 1975.5], 0.8), T["would"], 0, db(-30)); cue("you decide chip", T["would"])
for i, tk in enumerate(CU["typingA"] + CU["typingB"]): sfx(tick(2600 + (i % 4) * 120, 0.018, 0.5), tk, 0, db(-28))
cue("typing YES / NO", CU["typingA"][0])
for tp in (CU["postA"], CU["postB"]): sfx(blip(1046.5, 0.09), tp, 0, db(-27)); sfx(blip(1568, 0.11), tp + 0.1, 0, db(-28))
cue("posted ×2", CU["postA"])
for k in range(12): sfx(kalimba(hz(["D5", "F5", "A5", "C6", "D6", "F6"][k % 6]) * (2 if k >= 6 else 1), 0.8), CU["postA"] + 0.1 + k * 0.11, -0.4 + k * 0.07, db(-31))
cue("sparkles", CU["postA"] + 0.1)
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
