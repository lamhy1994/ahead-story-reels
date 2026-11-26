# Storybook soundtrack for "The Slow Billions": a warm F-major bed with a music-box colour for the autumn town, a soft pulse while the coin towers rise,
# an autumn breeze, coins, a rewind, a paper share, thuds as the towers double, the letter typing and trees sprouting, all synthesized.
# Reads audio/cues.json (exported from the scene) so every sound sits on the picture.
import json, numpy as np, soundfile as sf
from scipy import signal
SR = 48000
CU = json.load(open("audio/cues.json")); T = CU["T"]; DUR = CU["DUR"]; N = int(DUR * SR)
rng = np.random.default_rng(20261116)
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

def chirp():                                 # a small winter bird
    f = rng.uniform(2800, 3600); return blip(f, 0.07, 0.4, 0.2) * 0.6 + np.pad(blip(f * 1.15, 0.06, -0.3, 0.2), (int(0.08 * SR), 0))[:int(0.07 * SR)] * 0.5
def snowstep():                              # a footstep in snow: a soft crunch
    n = int(0.16 * SR); t = np.arange(n) / SR; x = bp(rng.standard_normal(n), 500, 4200) * (np.exp(-t / 0.05) * (0.6 + 0.4 * np.abs(np.sin(2 * np.pi * 60 * t))))
    return x * 0.8
def dieclack():                              # a die hitting glass and wood
    n = int(0.09 * SR); t = np.arange(n) / SR; f = rng.uniform(1700, 2600)
    return (np.sin(2 * np.pi * f * t) * np.exp(-t / 0.012) + 0.5 * bp(rng.standard_normal(n), 2500, 9000) * np.exp(-t / 0.006)) * 0.55 + np.pad(thud(260, 170, 0.06), (0, n - int(0.06 * SR))) * 0.35


# ───────── music: a warm F-major storybook bed (the D-minor family's relative major), a music box for the town, a soft pulse while the towers rise, 84 BPM
BEAT = 60 / 84
CH = {"Dm": ["D", "F", "A"], "Dm9": ["D", "F", "A", "E"], "Bb": ["Bb", "D", "F"], "F": ["F", "A", "C"], "C": ["C", "E", "G"], "Gm": ["G", "Bb", "D"], "As": ["A", "D", "E"]}
ROOT = {"Dm": "D2", "Dm9": "D2", "Bb": "Bb1", "F": "F2", "C": "C2", "Gm": "G1", "As": "A1"}
PROG = [(0, "F"), (T["small"], "C"), (T["b2"], "Dm"), (T["follow"], "Bb"), (T["b3"], "Gm"), (T["give3"], "C"), (T["b4"], "Bb"), (T["first"], "Gm"), (T["n96"], "C"),
        (T["b5"], "F"), (T["used"], "C"), (T["b6"], "Dm"), (T["grew"], "Bb"), (T["million"], "F"), (T["b7"], "C"), (T["top"], "Dm"), (T["b8"], "Bb"), (T["four"], "F"),
        (T["biggest"], "C"), (T["wipe"] + 0.3, "F"), (T["b10"], "Bb"), (T["compounds"], "F"), (T["faster"], "C"), (T["b11"], "Dm"), (T["b12"], "Bb"), (T["time12"], "F"),
        (T["cta"], "C"), (T["comment"], "F"), (DUR, "F")]
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
def pulse(t0, t1, gain):                     # soft pulse: kick on 1 and 3, hats on the off-beats
    t = t0; k = 0
    while t < t1 - 0.1:
        if k % 4 in (0, 2): mus(kick(), t, 0, gain)
        mus(hat(), t + BEAT / 2, 0.25, gain * 0.35); k += 1; t += BEAT
arp(0.0, T["b3"] - 0.1, BEAT / 2, [0, 2, 4, 2, 3, 5, 4, 2], 4, 0.26, kalimba)              # the town at golden hour, the coins pouring: a music box
arp(0.0, T["b3"] - 0.1, BEAT, [0, 2, 1, 2], 3, 0.2, epiano)
arp(T["b3"], T["b4"] - 0.1, BEAT, [0, 1, 0, 2], 3, 0.26, pluck)                          # how? (slower)
arp(T["b4"], T["b5"] - 0.1, BEAT, [4, 2, 3, 1], 4, 0.2, kalimba)                         # 1942: a memory
arp(T["b5"], T["b6"] - 0.1, BEAT / 2, [0, 2, 1, 3, 2, 4, 3, 5], 3, 0.24, marimba)        # his company: busy, patient
arp(T["b6"], T["wipe"] - 0.05, BEAT / 2, [0, 1, 2, 3, 4, 5, 4, 3], 3, 0.26, pluck)        # the towers rise: climbing
arp(T["grew"], T["wipe"] - 0.05, BEAT / 2, [2, 4, 5, 4], 4, 0.14, kalimba)
pulse(T["grew"] - 0.2, T["wipe"] - 0.3, 0.3)
arp(T["wipe"] + 0.5, T["b11"] - 0.1, BEAT / 2, [0, 2, 3, 2, 4, 3, 2, 1], 3, 0.26, pluck)  # this Thanksgiving: giving
arp(T["wipe"] + 0.5, T["b11"] - 0.1, BEAT, [4, 2, 5, 3], 4, 0.15, kalimba)
arp(T["b11"], T["cta"] - 0.2, BEAT / 2, [0, 2, 3, 2, 4, 3, 2, 1], 3, 0.3)                  # the story's close
MEL = ["C5", "A4", "F4", None, "A4", "Bb4", "C5", None, "D5", "C5", "Bb4", "A4"]
for k, n in enumerate(MEL):
    if n: mus(kalimba(hz(n) * 2, 1.6), T["b12"] + 0.4 + k * BEAT * 0.75, 0.2, 0.2)
for k, n in enumerate(["F5", "A5", "C6", "F6", "A6"]): mus(kalimba(hz(n), 1.8), T["cta"] + 0.4 + k * 0.33, -0.3 + k * 0.15, 0.16)
arp(T["comment"], DUR - 0.6, BEAT / 2, [0, 2, 4, 5, 4, 2], 4, 0.14, kalimba)
t = np.arange(N) / SR; fo = np.minimum(1, (DUR - t) / 1.3) ** 1.2
for ch in MUS: ch *= fo

# ───────── sound effects
cues = []
def cue(name, t): cues.append((round(t, 2), name))
def coins_rain(t0, t1, rate, gain, pan=0.0):
    t = t0
    while t < t1:
        sfx(coin(), t, pan + rng.uniform(-0.5, 0.5), gain * rng.uniform(0.6, 1.0)); t += rng.exponential(1 / rate)
sfx(noise_bed(DUR, 140, 1300, 0.09, 0.5, 1.0), 0.0, 0, db(-38)); cue("autumn breeze", 0.0)
for tb in (T["b2"] + 1.0, T["kept"] + 0.8, T["b6"] + 1.2, T["b7"] + 0.6, T["average"] + 0.3, T["b10"] + 0.9, T["b11"] + 0.4): sfx(chirp(), tb, 0.4, db(-33))
cue("birds", T["b2"] + 1.0)
# 0–3 s — the hook card, then the big number
sfx(thud(85, 42, 0.42), 0.0, 0, db(-21)); sfx(ding([698.5, 1046.5, 1396.9], 1.3), 0.0, 0, db(-25)); cue("hook card", 0.0)
if T.get("hookEnd"): sfx(whoosh(0.6, 500, 3600), T["hookEnd"] - 0.05, 0, db(-27)); cue("hook card lifts", T["hookEnd"])
if T.get("bigIn"):
    sfx(thud(70, 34, 0.6), T["bigIn"] + 0.02, 0, db(-19)); sfx(whoosh(0.5, 3200, 400), T["bigIn"] - 0.15, 0, db(-26)); cue("big number", T["bigIn"])
    for k in range(10): sfx(tick(1800 + k * 140, 0.016, 0.4), T["bigIn"] + 0.06 + k * 0.064, 0.3 * np.sin(k), db(-31))
    sfx(ding([698.5, 1046.5, 1396.9], 1.0), T["bigIn"] + 0.72, 0, db(-25)); sfx(whoosh(0.5, 600, 3000), T["bigOut"] - 0.1, 0, db(-29))
# 1–2 — the coin fountain to the foundations; the small part; more than $160 billion; by 2034
coins_rain(0.1, T["bigIn"] - 0.1, 9, db(-33)); coins_rain(T["bigOut"], T["b3"] + 0.6, 10, db(-32)); cue("coins pour to the foundations (cover)", 0.1)
sfx(blip(784, 0.1), T["small"], -0.3, db(-30)); sfx(blip(523.3, 0.16), T["part"], 0.3, db(-30)); cue("this gift / the rest tags", T["small"])
sfx(whoosh(1.2, 300, 2400), T["part"] + 0.2, 0, db(-29)); cue("up the giant tower", T["part"] + 0.2)
sfx(ding([1046.5, 1568], 1.0), T["n160"] + 0.1, 0, db(-27))
for k in range(6): sfx(kalimba(hz(["F6", "A6", "C7", "F7", "C7", "A6"][k]), 0.6), T["n160"] + 0.2 + k * 0.09, -0.3 + k * 0.12, db(-34))
cue("$160B+ sparkle", T["n160"])
sfx(flutter(0.4), T["y2034"] - 0.1, 0, db(-29)); sfx(tick(2200, 0.03, 0.4), T["y2034"] + 0.05, 0, db(-28)); sfx(tick(2600, 0.03, 0.4), T["y2034"] + 0.2, 0, db(-28)); cue("plan card: by 2034", T["y2034"])
sfx(blip(659.3, 0.1), T["follow"], 0, db(-31)); cue("4 foundations tag", T["follow"])
# 3 — his house: how?
sfx(whoosh(1.3, 2400, 300), T["b3"] - 0.3, 0, db(-28)); cue("down to his house", T["b3"] - 0.3)
sfx(blip(523.3, 0.14), T["how"], 0, db(-30)); sfx(blip(659.3, 0.18, 0.15), T["how"] + 0.16, 0, db(-30)); cue("the question mark pops", T["how"])
# 4 — Warren Buffett; the boy of 1942 and his first share; 11 -> 96
sfx(ding([880, 1318.5], 0.9), T["warren"] + 0.05, 0.2, db(-29)); cue("name card", T["warren"])
sfx(sweep(0.7, 900, 300), T["first"] - 0.25, 0, db(-31)); cue("rewind to 1942 (sepia)", T["first"] - 0.25)
sfx(blip(784, 0.1), T["boy"] + 0.05, -0.2, db(-30)); sfx(flutter(0.45), T["stock"], -0.2, db(-27)); sfx(ding([1318.5, 1975.5], 0.8), T["stock"] + 0.1, -0.2, db(-29)); cue("the boy and his first share", T["stock"])
sfx(sweep(1.1, 300, 900), T["n11"] + 0.05, 0, db(-33)); cue("the years run 11 -> 96", T["n11"])
sfx(ding([698.5, 1046.5], 1.0), T["n96"] + 0.05, 0.2, db(-28)); cue("96", T["n96"])
# 5 — crane to his company; profits fly up and fall back in; the company grows
sfx(whoosh(1.5, 300, 2200), T["b5"] - 0.2, 0, db(-27)); cue("crane over the roofs", T["b5"] - 0.2)
t = T["kept"]
while t < T["b6"]: sfx(coin(), t, rng.uniform(-0.4, 0.4), db(-33) * rng.uniform(0.6, 1.0)); t += rng.uniform(0.12, 0.26)
cue("the profits loop", T["kept"])
sfx(sweep(1.4, 220, 440), T["used"], 0, db(-31)); sfx(clack(), T["year5"] + 0.4, 0, db(-31)); cue("the company grows", T["used"])
# 6 — one coin: $1,000; the towers rise, doubling, the counter runs to about $55 million
sfx(coin(), T["thousand"] - 0.1, 0, db(-24)); sfx(ding([1046.5, 1568, 2093], 1.1), T["thousand"], 0, db(-27)); cue("the first $1,000", T["thousand"])
for i, tr in enumerate(CU["rise"]):
    sfx(thud(120 - i * 4, 60 - i * 2, 0.25 + i * 0.02), tr + 0.05, -0.5 + i / 15, db(-33 + i * 0.6)); sfx(blip(392 * 2 ** (i / 12), 0.06), tr + 0.08, -0.5 + i / 15, db(-36))
cue("16 towers rise (pitch climbs)", CU["rise"][0])
t = T["riseA"]
while t < T["million"] + 0.1: sfx(tick(1500 + (t - T["riseA"]) * 400, 0.016, 0.3), t, 0.2, db(-33)); t += 0.09
cue("counter ticks to $55M", T["riseA"])
sfx(thud(70, 34, 0.6), T["million"] + 0.05, 0, db(-24)); sfx(ding([698.5, 1046.5, 1396.9], 1.4), T["million"] + 0.1, 0, db(-25)); cue("about $55 million", T["million"])
# 7 — growth on top of growth: a copy drops onto a tower
sfx(whoosh(1.0, 3000, 500), T["ghostA"], 0.2, db(-29)); sfx(thud(95, 48, 0.4), T["ghostB"], 0.2, db(-25)); sfx(clack(), T["ghostB"] + 0.02, 0.2, db(-29)); sfx(ding([1046.5, 1568], 0.8), T["ghostB"] + 0.1, 0.2, db(-29))
cue("a copy lands on top", T["ghostB"])
# 8 — ×2 every four years; the giant: the biggest gains came last
for i, tx in enumerate(CU["x2"]): sfx(blip(523.3 * 2 ** (i * 2 / 12), 0.07), tx + 0.05, -0.4 + i / 12, db(-32))
cue("×2 pops", CU["x2"][0])
sfx(whoosh(1.3, 400, 2600), T["biggest"] - 0.2, 0, db(-29)); cue("up the giant", T["biggest"] - 0.2)
sfx(ding([1396.9, 2093, 2793.8], 1.4), T["last"] + 0.05, 0, db(-27))
for k in range(8): sfx(kalimba(hz(["F6", "A6", "C7", "F7"][k % 4]) * (2 if k >= 4 else 1), 0.6), T["last"] + 0.15 + k * 0.07, -0.4 + k * 0.1, db(-35))
cue("the giant sparkles", T["last"])
# 9 — sky wipe to this Thanksgiving; the gift streams again
sfx(whoosh(1.4), T["wipe"], 0, db(-23)); cue("sky wipe: the past -> this Thanksgiving", T["wipe"])
coins_rain(T["streamOn"] + 0.2, T["b11"] + 0.5, 9, db(-33)); coins_rain(T["b11"] + 0.5, DUR - 0.5, 4, db(-36)); cue("coins pour again", T["streamOn"] + 0.2)
# 10 — the letter types; kindness compounds: trees sprout in doubling waves
sfx(flutter(0.5), T["letter"] - 0.1, 0, db(-28)); cue("the letter", T["letter"])
for k, tl in enumerate(CU["letter"]): sfx(tick(2600 + (k % 4) * 120, 0.018, 0.5), tl, 0, db(-31))
for w, tw in enumerate(CU["trees"]):
    n = min(2 ** w, 6)
    for j in range(n): sfx(bubble(330 * 2 ** ((w + j * 0.5) / 6)), tw + j * 0.05, -0.5 + j * 0.2, db(-33))
    sfx(kalimba(hz(["F5", "A5", "C6", "F6", "A6", "C7", "F7", "A7"][w]), 0.7), tw + 0.02, 0.2, db(-31))
cue("trees sprout ×2", CU["trees"][0])
# 11–12 — not over yet; the title
sfx(ding([698.5, 1046.5], 1.2), T["over"] + 0.2, 0, db(-29)); cue("not over yet", T["over"])
sfx(whoosh(1.6, 300, 2000), T["b12"] - 0.1, 0, db(-29)); sfx(ding([698.5, 1046.5, 1396.9], 1.5), T["story"], 0, db(-23)); cue("title", T["story"])
sfx(blip(698, 0.12), T["time12"], 0, db(-28)); cue("lesson", T["time12"])
# 13 — the question
sfx(whoosh(1.3, 2400, 300), T["would"] - 0.6, 0, db(-29)); sfx(ding([1318.5, 1975.5], 0.8), T["would"], 0, db(-30)); cue("what about you? chip", T["would"])
for i, tk in enumerate(CU["typingA"] + CU["typingB"]): sfx(tick(2600 + (i % 4) * 120, 0.018, 0.5), tk, 0, db(-28))
cue("typing GIVE / KEEP", CU["typingA"][0])
for tp in (CU["postA"], CU["postB"]): sfx(blip(1046.5, 0.09), tp, 0, db(-27)); sfx(blip(1568, 0.11), tp + 0.1, 0, db(-28))
cue("posted ×2", CU["postA"])
for k in range(12): sfx(kalimba(hz(["F5", "A5", "C6", "E6", "F6", "A6"][k % 6]) * (2 if k >= 6 else 1), 0.8), CU["postA"] + 0.1 + k * 0.11, -0.4 + k * 0.07, db(-31))
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
