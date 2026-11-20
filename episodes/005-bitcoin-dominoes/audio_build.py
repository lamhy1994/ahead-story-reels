# Storybook soundtrack for "The Bitcoin Dominoes": a soft D-minor bed with a modern pulse, city sounds and domino clacks, all synthesized.
# Reads audio/cues.json (exported from the scene) so every sound sits on the picture.
import json, numpy as np, soundfile as sf
from scipy import signal
SR = 48000
CU = json.load(open("audio/cues.json")); T = CU["T"]; DUR = CU["DUR"]; N = int(DUR * SR)
rng = np.random.default_rng(20261120)
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


def dclack(f=None, gain=1.0):                # a domino tipping onto the next: a hard, short wooden click with a little body
    n = int(0.12 * SR); t = np.arange(n) / SR; f = f or rng.uniform(1500, 2300)
    x = (np.sin(2 * np.pi * f * t) + 0.6 * np.sin(2 * np.pi * f * 1.52 * t)) * env_exp(n, 0.012, 0.0004) + 0.7 * bp(rng.standard_normal(n), 2000, 7000) * env_exp(n, 0.006, 0.0002)
    return (x * 0.55 + np.pad(thud(220, 120, 0.08), (0, n - int(0.08 * SR))) * 0.35) * gain
def coin(f=None):                            # a coin landing: bright ring with a short rattle
    n = int(0.5 * SR); t = np.arange(n) / SR; f = f or rng.uniform(2400, 3000)
    x = sum(a * np.sin(2 * np.pi * f * k * t) * np.exp(-t / (0.16 / k)) for k, a in ((1, 1.0), (1.47, 0.5), (2.21, 0.3)))
    return x * 0.28 + 0.15 * bp(rng.standard_normal(n), 3000, 9000) * env_exp(n, 0.01, 0.0003)
def motor(dur=1.0):                          # the lender's arm sliding out
    n = int(dur * SR); t = np.arange(n) / SR; f = 90 + 40 * t / dur
    x = np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)) * 0.2 + 0.3 * bp(rng.standard_normal(n), 400, 1800)
    return lp(x, 1600) * np.sin(np.pi * np.clip(t / dur, 0, 1)) ** 0.5 * 0.6

# ───────── music: D minor storybook, a soft city pulse, 88 BPM
BEAT = 60 / 88
CH = {"Dm": ["D", "F", "A"], "Dm9": ["D", "F", "A", "E"], "Bb": ["Bb", "D", "F"], "Bb7": ["Bb", "D", "F", "A"], "F": ["F", "A", "C"], "Fadd9": ["F", "A", "C", "G"], "C": ["C", "E", "G"], "Gm": ["G", "Bb", "D"], "A": ["A", "C#", "E"], "As": ["A", "D", "E"], "Eb": ["Eb", "G", "Bb"]}
ROOT = {"Dm": "D2", "Dm9": "D2", "Bb": "Bb1", "Bb7": "Bb1", "F": "F2", "Fadd9": "F2", "C": "C2", "Gm": "G1", "A": "A1", "As": "A1", "Eb": "Eb2"}
PROG = [(0, "Dm9"), (T["billion"], "Bb7"), (T["never"], "Gm"), (T["button"], "As"), (T["b2"] + 0.4, "F"), (T["p85"], "C"), (T["b3"], "Dm"), (T["borrowed3"], "Bb"),
        (T["b4"], "F"), (T["p100a"], "C"), (T["b5"], "Dm"), (T["p900"], "Bb"), (T["p1000"], "F"), (T["b6"], "Gm"), (T["p10"], "As"), (T["gone"], "Dm"),
        (T["b7"], "Bb"), (T["auto"], "Gm"), (T["b8"], "Dm"), (T["next"], "As"), (T["b9"], "Dm"), (T["wipe1"] + 0.9, "Gm"), (T["billions"], "Eb"), (T["funds"], "As"),
        (T["wipe2"] + 0.9, "Dm"), (T["dom11"], "Bb"), (T["b12"], "Gm"), (T["p62"], "As"), (T["b13"], "Dm"), (T["below"], "Bb"), (T["b14"], "Gm"), (T["month"], "As"),
        (T["b15"], "F"), (T["every"], "C"), (T["less"], "Dm"), (T["b16"], "Bb"), (T["over"], "As"), (T["b17"], "Dm"), (T["dom17"], "Bb"), (T["borrowed17"], "F"), (T["first"], "C"),
        (T["cta"], "Dm9"), (T["comment"], "Fadd9"), (DUR, "Fadd9")]
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
arp(0.0, T["b2"] - 0.1, BEAT / 2, [0, 2, 4, 2, 3, 5, 4, 2], 4, 0.26, epiano)              # the hook: night, the wave
pulse(0.3, T["b2"] - 0.2, 0.3)
for k in range(10): mus(pluck(hz(["D4", "F4", "A4", "C5", "D5", "F5", "A5", "C6", "D6", "F6"][k]), 1.4), T["b2"] + 0.1 + k * 0.12, -0.5 + k / 10, 0.3)   # the rewind: a harp run up
arp(T["b2"] + 0.4, T["b4"] - 0.1, BEAT / 2, [0, 2, 1, 3, 2, 4, 3, 5], 3, 0.3, pluck)        # October: bright
arp(T["b2"] + 0.6, T["b4"] - 0.2, BEAT * 2, [5, 4, 3], 5, 0.13, kalimba)
pulse(T["b3"], T["b4"] - 0.2, 0.22)
arp(T["b4"], T["b7"] - 0.1, BEAT / 2, [0, 2, 4, 2, 3, 1, 2, 0], 4, 0.3, kalimba)          # picture: a music-box tune
arp(T["b4"], T["b7"] - 0.1, BEAT, [0, 2, 1, 2], 3, 0.24, pluck)
arp(T["b7"], T["wipe1"] - 0.1, BEAT / 2, [0, 2, 1, 3, 0, 2, 1, 4], 3, 0.3, marimba)        # the forced sale, the next bet
pulse(T["b7"] + 0.1, T["wipe1"] - 0.3, 0.26)
arp(T["wipe1"] + 0.9, T["wipe2"] - 0.1, BEAT / 2, [0, 2, 1, 3, 0, 2, 1, 4], 3, 0.28, epiano)   # the plaza
pulse(T["wipe1"] + 0.9, T["wipe2"] - 0.3, 0.24)
arp(T["wipe2"] + 0.9, T["b13"] - 0.1, BEAT / 3, [0, 1, 2, 3, 4, 5], 3, 0.28, pluck)          # the weekend: the wave runs
pulse(T["wipe2"] + 0.9, T["b13"] - 0.3, 0.3)
arp(T["b13"], T["b15"] - 0.1, BEAT, [3, 2, 1, 0], 3, 0.28, epiano)                          # Friday
arp(T["b15"], T["b17"] - 0.1, BEAT / 2, [0, 2, 3, 2, 4, 3, 2, 1], 3, 0.3)                    # every coin, worth less
arp(T["b17"] + 0.2, T["cta"] - 0.2, BEAT / 2, [0, 2, 3, 2, 4, 3, 2, 1], 3, 0.32)           # the story's close
for k, n in enumerate(["D5", "F5", "A5", None, "C6", "A5", "F5", "D5"]):
    if n: mus(kalimba(hz(n) * 2, 1.6), T["b17"] + 0.5 + k * BEAT * 0.75, 0.2, 0.2)
for k, n in enumerate(["D5", "A5", "D6", "F6", "A6"]): mus(kalimba(hz(n), 1.8), T["cta"] + 0.4 + k * 0.33, -0.3 + k * 0.15, 0.16)
arp(T["comment"], DUR - 0.6, BEAT / 2, [0, 2, 4, 5, 4, 2], 4, 0.14, kalimba)

# ───────── sound effects
cues = []
def cue(name, t): cues.append((round(t, 2), name))
sfx(noise_bed(T["b2"] + 1.4, 90, 700, 0.15, 0.4, 0.8), 0.0, 0, db(-33)); cue("night city hum", 0.0)
sfx(noise_bed(T["wipe1"] - T["b2"], 90, 800, 0.12, 0.4, 0.8), T["b2"] + 1.0, 0, db(-34)); cue("day city hum (hilltop)", T["b2"] + 1.0)
sfx(noise_bed(T["b8"] - T["b4"] + 0.5, 300, 2500, 0.35, 0.6, 0.5), T["b4"] - 0.2, 0, db(-39)); cue("wind on the hilltop", T["b4"])
sfx(murmur(T["wipe2"] - T["wipe1"] - 0.4, lambda u: 0.6 + 0.4 * np.sin(np.pi * u)), T["wipe1"] + 0.8, 0, db(-37)); cue("plaza murmur", T["wipe1"] + 0.8)
sfx(noise_bed(T["b13"] - T["wipe2"], 90, 700, 0.15, 0.4, 0.8), T["wipe2"] + 0.8, 0, db(-34)); sfx(crickets(T["b13"] - T["wipe2"] - 0.6), T["wipe2"] + 0.9, 0.2, db(-38)); cue("night: hum + crickets", T["wipe2"] + 0.8)
sfx(noise_bed(T["cta"] - T["b13"] + 0.5, 90, 800, 0.12, 0.4, 0.8), T["b13"], 0, db(-34)); cue("morning city hum", T["b13"])
sfx(crickets(DUR - T["comment"] + 0.5), T["comment"] - 0.5, -0.2, db(-39)); cue("evening crickets", T["comment"])
for tc in [1.5, 5.0, T["p85"] + 0.3, T["traders"], T["b13"] + 0.4, T["b15"] + 0.6, T["comment"] - 1.0]: sfx(carpass(2.2), tc, 0, db(-38))
# 1 — the hook: the wave of dominoes; $2.02B; the button nobody pressed
for i, tc in enumerate(CU["hookFalls"]): sfx(dclack(gain=0.75 + 0.25 * np.sin(i)), tc, -0.4 + 0.8 * i / len(CU["hookFalls"]), db(-27 - 3 * i / len(CU["hookFalls"])))
cue("hook: 43 dominoes fall", CU["hookFalls"][0])
for k in range(10): sfx(blip(392 * 2 ** (k * 2 / 12), 0.07), T["billion"] + k * 0.06, 0.1, db(-31))
sfx(ding([1046.5, 1568], 0.8), T["billion"] + 0.65, 0, db(-28)); cue("$2.02B board", T["billion"])
sfx(blip(220, 0.25, -0.15), T["never"] + 0.05, -0.2, db(-27)); sfx(hum(1.6, 110), T["never"], -0.2, db(-40)); cue("the SELL button: never pressed", T["never"])
# 2 — rewind to October; $85,000
sfx(whoosh(1.6, 260, 2600), T["b2"] - 0.1, 0, db(-23)); sfx(sweep(1.3, 220, 1300), T["b2"] + 0.1, 0, db(-31)); cue("rewind whoosh", T["b2"])
for k in range(14): sfx(dclack(1200 + 60 * k, 0.5), T["b2"] + 0.15 + 1.1 * k / 13, 0.3 * np.sin(k), db(-33))
cue("dominoes stand back up", T["b2"] + 0.15)
sfx(ding([1318.5, 1975.5], 0.8), T["p85"] + 0.05, 0.1, db(-28)); cue("≈ $85,000", T["p85"])
# 3 — many traders, borrowed money
for k in range(6): sfx(blip(659 * 2 ** (k * 2 / 12), 0.06), T["rising"] + k * 0.07, 0.3 * np.sin(k), db(-32))
for k in range(3): sfx(blip(587, 0.1), T["borrowed3"] + k * 0.18, -0.3 + 0.3 * k, db(-30))
cue("borrowed tags", T["borrowed3"])
# 4–5 — her $100, nine borrowed coins, $1,000
for k in range(6): sfx(step(), T["b4"] - 0.2 + k * 0.38, -0.2, db(-33))
sfx(kalimba(hz("A5") * 2, 0.9), T["picture"] + 0.2, 0, db(-30)); sfx(coin(2700), CU["herCoin"], 0.1, db(-27)); cue("her $100 coin", T["p100a"])
for k, tc in enumerate(CU["blue"]): sfx(coin(2200 + 90 * k), tc, 0.2, db(-29))
cue("9 borrowed coins land", CU["blue"][0])
sfx(ding([1046.5, 1318.5, 1568], 1.0), T["p1000"] + 0.1, 0.2, db(-27)); cue("$1,000 of bitcoin", T["p1000"])
# 6 — the price falls 10%; her $100 is gone
sfx(sweep(1.0, 880, 300), T["falls6"], 0.1, db(-27)); sfx(thud(70, 34, 0.5), T["p10"] + 0.5, 0, db(-26)); cue("−10%", T["falls6"])
sfx(blip(330, 0.3, -0.2), T["gone"], 0, db(-27)); cue("her $100 is gone", T["gone"])
# 7–9 — the lender's arm; her bet falls; the next; like dominoes
sfx(motor(T["auto"] + 0.35 - T["sells"] + 0.1), T["sells"] - 0.1, -0.3, db(-31)); cue("the arm slides out", T["sells"])
sfx(thud(120, 60, 0.3), T["auto"] + 0.3, 0, db(-27)); cue("push", T["auto"] + 0.3)
sfx(dclack(1400, 1.4), CU["falls"][0], 0, db(-22)); sfx(thud(90, 45, 0.4), CU["falls"][0] + 0.02, 0, db(-26)); cue("her bet falls", CU["falls"][0])
sfx(dclack(1650, 1.2), CU["falls"][1], 0.15, db(-23)); cue("the next bet", CU["falls"][1])
for k in range(2, 6): sfx(dclack(gain=1.0), CU["falls"][k], 0.1 + 0.08 * k, db(-25 - k))
cue("like dominoes", CU["falls"][2])
# sky wipes
for tw in (T["wipe1"], T["wipe2"]): sfx(whoosh(1.3), tw - 0.05, 0, db(-22)); cue("sky wipe", tw)
# 10 — A.I. stocks slide; money leaves the bitcoin funds
sfx(sweep(1.0, 700, 260), T["slid"] - 0.05, 0.3, db(-28)); cue("A.I. stocks ▼", T["slid"])
for k, tc in enumerate(CU["fly"][::3]): sfx(coin(), tc + 0.3, 0.4 * np.sin(k), db(-31))
cue("coins fly out of the fund building", CU["fly"][0])
# 11–12 — the weekend: the wave runs down the hill; ≈ $62,000
for i in range(6, 38): tc = CU["falls"][i]; sfx(dclack(gain=0.8 + 0.2 * np.sin(i * 1.3)), tc, -0.4 + 0.8 * (i - 6) / 32, db(-26 - 2 * np.sin(i * 0.7) ** 2))
for i in range(6, 38, 8): sfx(thud(80, 40, 0.35), CU["falls"][i], 0, db(-30))
cue("weekend: 32 dominoes", CU["falls"][6])
sfx(blip(392, 0.12), T["fourteenth"], 0, db(-30)); cue("mostly bets on a rise", T["fourteenth"])
sfx(ding([587.3, 880], 1.0), T["p62"], 0.2, db(-27)); cue("≈ $62,000 · lowest since July", T["p62"])
# 13–14 — Friday: below $60,000; −28% in a month
for i in range(38, 44): sfx(dclack(gain=0.9), CU["falls"][i], 0.2, db(-26))
cue("Friday: the last six", CU["falls"][38])
sfx(sweep(0.9, 660, 240), T["below"], 0.1, db(-27)); sfx(thud(70, 34, 0.5), T["p60"] + 0.3, 0, db(-26)); sfx(ding([1174.7, 1760], 0.9), T["p60"] + 0.1, 0, db(-28)); cue("below $60,000 board", T["p60"])
sfx(blip(523, 0.12), T["p30"], 0, db(-29)); cue("−28% tag", T["p30"])
# 15 — every coin, worth less
for k in range(6): sfx(kalimba(hz(["D5", "F5", "A5", "D6", "F6", "A6"][k]), 0.9), T["every"] + k * 0.08, -0.3 + k * 0.12, db(-31))
cue("every coin ✓", T["every"])
for k in range(3): sfx(blip(523 * 2 ** (-k * 3 / 12), 0.12), T["less"] + k * 0.12, 0, db(-30))
cue("worth less", T["less"])
# 16 — not over; 17 — title; 18 — you decide
sfx(whoosh(1.6, 300, 2200), T["over"] - 0.2, 0, db(-29)); cue("crane up", T["over"])
sfx(ding([587.3, 880, 1174.7], 1.5), T["story"], 0, db(-23)); cue("title", T["story"])
sfx(blip(698, 0.12), T["borrowed17"], 0, db(-27)); cue("lesson", T["borrowed17"])
sfx(ding([1318.5, 1975.5], 0.8), T["decide"], 0, db(-30)); cue("you decide chip", T["decide"])
for i, tk in enumerate(CU["typingA"] + CU["typingB"]): sfx(tick(2600 + (i % 4) * 120, 0.018, 0.5), tk, 0, db(-28))
cue("typing SELL / HOLD", CU["typingA"][0])
for tp in (CU["postA"], CU["postB"]): sfx(blip(1046.5, 0.09), tp, 0, db(-27)); sfx(blip(1568, 0.11), tp + 0.1, 0, db(-28))
cue("posted ×2", CU["postA"])
for k in range(12): sfx(kalimba(hz(["D5", "F5", "A5", "C6", "D6", "F6"][k % 6]) * (2 if k >= 6 else 1), 0.8), CU["postA"] + 0.1 + k * 0.11, -0.4 + k * 0.07, db(-31))
cue("sparkles over the board", CU["postA"] + 0.1)

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

