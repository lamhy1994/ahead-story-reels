# Storybook soundtrack for "Silver Thursday": a soft D-minor bed (a modern pulse for 2026, plucked strings and a soft drum for 1979–80), city and prairie sounds,
# metal clanks for every silver bar, coins, cash, old telephone bells, all synthesized.
# Reads audio/cues.json (exported from the scene) so every sound sits on the picture.
import json, numpy as np, soundfile as sf
from scipy import signal
SR = 48000
CU = json.load(open("audio/cues.json")); T = CU["T"]; DUR = CU["DUR"]; N = int(DUR * SR)
rng = np.random.default_rng(20261122)
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

def clank(f=900.0, dur=0.5, body=1.0):       # a metal bar set down or landing: inharmonic ring with a quick decay and a soft knock
    n = int(dur * SR); t = np.arange(n) / SR; x = np.zeros(n)
    for k, (r, a, tau) in enumerate([(1.0, 1.0, 0.16), (2.76, 0.55, 0.09), (5.40, 0.32, 0.05), (8.93, 0.18, 0.03)]): x += a * np.sin(2 * np.pi * f * r * t + k) * np.exp(-t / tau)
    x += body * 0.8 * lp(rng.standard_normal(n), 900) * np.exp(-t / 0.025) + body * 0.6 * np.sin(2 * np.pi * (110 + 60 * np.exp(-t / 0.03)) * t) * np.exp(-t / 0.08)
    a = int(0.002 * SR); x[:a] *= np.linspace(0, 1, a); return x * 0.45
def slidescrape(dur=0.4):                     # a bar sliding over another: a short metallic scrape
    n = int(dur * SR); t = np.arange(n) / SR
    x = bp(rng.standard_normal(n), 1800, 5200) * (0.6 + 0.4 * np.sin(2 * np.pi * 37 * t)) + 0.2 * np.sin(2 * np.pi * (1400 + 500 * t / dur) * t)
    return x * np.sin(np.pi * np.clip(t / dur, 0, 1)) ** 0.7 * 0.5

def bellring(dur=0.42):                      # an old telephone bell: a hammer between two bells
    n = int(dur * SR); t = np.arange(n) / SR
    x = (np.sin(2 * np.pi * 1950 * t) + 0.7 * np.sin(2 * np.pi * 2630 * t) + 0.25 * np.sin(2 * np.pi * 3900 * t)) * (0.55 + 0.45 * np.sign(np.sin(2 * np.pi * 24 * t)))
    return x * np.minimum(1, t / 0.01) * np.minimum(1, (dur - t) / 0.03) * 0.35
def creak(dur=0.7):                          # a pumpjack's slow creak
    n = int(dur * SR); t = np.arange(n) / SR; f = 210 + 60 * np.sin(np.pi * t / dur)
    x = bp(rng.standard_normal(n), 250, 1300) * (0.5 + 0.5 * np.abs(np.sin(2 * np.pi * np.cumsum(f) / SR / 6))) + 0.25 * np.sin(2 * np.pi * np.cumsum(f) / SR)
    return x * np.sin(np.pi * t / dur) ** 1.2 * 0.5

# ───────── music: D minor storybook, 88 BPM — a soft city pulse in 2026, plucked strings and a soft drum in 1979–80
BEAT = 60 / 88
CH = {"Dm": ["D", "F", "A"], "Dm9": ["D", "F", "A", "E"], "Bb": ["Bb", "D", "F"], "Bb7": ["Bb", "D", "F", "A"], "F": ["F", "A", "C"], "Fadd9": ["F", "A", "C", "G"], "C": ["C", "E", "G"], "Gm": ["G", "Bb", "D"], "A": ["A", "C#", "E"], "As": ["A", "D", "E"], "Eb": ["Eb", "G", "Bb"]}
ROOT = {"Dm": "D2", "Dm9": "D2", "Bb": "Bb1", "Bb7": "Bb1", "F": "F2", "Fadd9": "F2", "C": "C2", "Gm": "G1", "A": "A1", "As": "A1", "Eb": "Eb2"}
PROG = [(0, "Dm9"), (T["silver1"], "Bb7"), (T["crashed"], "Eb"), (T["third"], "As"), (T["b2"], "Gm"), (T["y1980"], "Dm"), (T["brothers2"], "Bb"), (T["corner"], "As"),
        (T["wipe1"] + 0.9, "F"), (T["bunker"], "C"), (T["billionaire"], "Dm"), (T["texas"], "Bb"),
        (T["b4"], "F"), (T["lose"], "Gm"), (T["bought"], "C"), (T["b5"], "F"), (T["borrowed5"], "Bb"), (T["money5"], "C"),
        (T["b6"], "Dm"), (T["ounce6"], "Bb"), (T["p6"], "F"), (T["b7"], "C"), (T["p50"], "F"),
        (T["b8"], "Dm"), (T["rules"], "Gm"), (T["selling"], "As"), (T["b9"], "Dm"), (T["slide"], "Eb"),
        (T["b10"], "Dm"), (T["p90"], "Bb"), (T["percent"], "Gm"), (T["wipes"], "As"), (T["b11"], "Dm"), (T["margin"], "Eb"),
        (T["b12"], "Gm"), (T["march"], "Dm"), (T["couldnt"], "As"), (T["b13"], "Dm"), (T["hit"], "Eb"), (T["eighty"], "As"),
        (T["b14"], "Dm"), (T["thursday14"], "Bb"), (T["b15"], "Gm"), (T["p17"], "Dm"), (T["bankrupt"], "As"),
        (T["wipe2"] + 0.9, "Dm"), (T["rhymed"], "Bb"), (T["record"], "F"), (T["borrowed16"], "C"), (T["crash16"], "Eb"),
        (T["b17"], "Gm"), (T["p41"], "As"), (T["b18"], "Dm"), (T["over"], "Bb"), (T["b19"], "F"), (T["thursday19"], "C"), (T["borrowed19"], "Dm"), (T["faster"], "Bb"),
        (T["cta"], "Dm9"), (T["comment"], "Fadd9"), (DUR, "Fadd9")]
assert all(a[0] <= b[0] for a, b in zip(PROG, PROG[1:])), "chord times out of order"
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
def drum(t0, t1, gain):                      # a soft travelling drum for 1979–80 (wooden knock on 1, lighter on 3, shaker between)
    t = t0; k = 0
    while t < t1 - 0.1:
        if k % 4 == 0: mus(logdrum(150), t, -0.1, gain)
        elif k % 4 == 2: mus(logdrum(210), t, 0.1, gain * 0.6)
        mus(shaker(), t + BEAT / 2, 0.3, gain * 0.3); k += 1; t += BEAT
arp(0.0, T["b2"] - 0.1, BEAT / 2, [0, 2, 4, 2, 3, 5, 4, 2], 4, 0.26, epiano)              # 2026, night: the tower at its record
pulse(0.3, T["crashed"] - 0.1, 0.26)
arp(T["b2"], T["wipe1"] - 0.1, BEAT, [5, 4, 3, 2], 3, 0.24, pluck)                          # its worst day since 1980
arp(T["wipe1"] + 0.9, T["b6"] - 0.1, BEAT / 2, [0, 2, 1, 3, 2, 4, 3, 5], 3, 0.27, pluck)    # Texas, the 1970s
drum(T["wipe1"] + 0.9, T["b6"] - 0.2, 0.24)
arp(T["b5"], T["b6"] - 0.1, BEAT / 2, [0, 2, 4, 5, 4, 2], 4, 0.18, kalimba)                 # the silver mountain glitters
arp(T["b6"], T["b8"] - 0.1, BEAT / 3, [0, 1, 2, 3, 4, 5], 3, 0.27, marimba)                 # the climb to $50
drum(T["b6"] + 0.4, T["b8"] - 0.2, 0.28)
arp(T["b8"], T["b10"] - 0.1, BEAT, [5, 3, 1, 0], 3, 0.24, pluck)                             # the rules change; the slide
arp(T["b10"], T["b12"] - 0.1, BEAT / 2, [0, 2, 1, 3, 0, 2, 1, 4], 4, 0.2, kalimba)          # a picture of borrowed money
arp(T["b12"], T["b14"] - 0.1, BEAT, [0, 3, 1, 4], 3, 0.24, pluck)                            # Thursday
arp(T["b14"], T["wipe2"] - 0.1, BEAT, [5, 4, 3, 2, 1, 0], 3, 0.22, pluck)                    # the loss
arp(T["wipe2"] + 0.9, T["b18"] - 0.1, BEAT / 2, [0, 2, 4, 2, 3, 1, 2, 0], 4, 0.26, epiano) # 2026: it rhymed
pulse(T["wipe2"] + 0.9, T["crash16"] - 0.1, 0.26)
arp(T["b18"], T["b19"] - 0.1, BEAT, [3, 2, 1, 0], 3, 0.26, epiano)                           # not over yet
arp(T["b19"] + 0.2, T["cta"] - 0.2, BEAT / 2, [0, 2, 3, 2, 4, 3, 2, 1], 3, 0.3)             # the story's close
for k, n in enumerate(["D5", "F5", "A5", None, "C6", "A5", "F5", "D5"]):
    if n: mus(kalimba(hz(n) * 2, 1.6), T["b19"] + 0.5 + k * BEAT * 0.75, 0.2, 0.2)
for k, n in enumerate(["D5", "A5", "D6", "F6", "A6"]): mus(kalimba(hz(n), 1.8), T["cta"] + 0.4 + k * 0.33, -0.3 + k * 0.15, 0.16)
arp(T["comment"], DUR - 0.6, BEAT / 2, [0, 2, 4, 5, 4, 2], 4, 0.14, kalimba)

# ───────── sound effects
cues = []
def cue(name, t): cues.append((round(t, 2), name))
sfx(noise_bed(T["wipe1"] + 1.4, 90, 700, 0.15, 0.4, 0.8), 0.0, 0, db(-33)); cue("night city hum (2026)", 0.0)
sfx(noise_bed(T["b6"] - T["wipe1"] + 0.2, 160, 1400, 0.09, 0.6, 1.0), T["wipe1"] + 0.8, 0, db(-34)); cue("prairie wind (Texas)", T["wipe1"] + 0.8)
for k in range(int((T["b6"] - T["wipe1"] - 1.2) / 1.96)): sfx(creak(0.7), T["wipe1"] + 1.1 + k * 1.96, -0.35 + 0.2 * (k % 3), db(-39))
cue("pumpjacks creak", T["wipe1"] + 1.1)
sfx(murmur(T["wipe2"] - T["b6"] + 0.2, lambda u: 0.65 + 0.35 * np.sin(np.pi * u)), T["b6"] + 0.4, 0, db(-37)); cue("1980 street murmur", T["b6"] + 0.4)
sfx(noise_bed(DUR - T["wipe2"], 90, 700, 0.15, 0.4, 0.8), T["wipe2"] + 0.8, 0, db(-34)); sfx(crickets(DUR - T["b19"] - 0.2), T["b19"], 0.2, db(-39)); cue("2026 hum + crickets", T["wipe2"] + 0.8)
for tc in [1.2, 4.6, T["wipe2"] + 1.6, T["b17"] + 0.4, T["comment"] - 1.0]: sfx(carpass(2.2), tc, 0, db(-38))
# 1 — 2026: the record tower at night; the crash
for k in range(6): sfx(kalimba(hz(["A5", "D6", "F6", "A6", "D7", "F6"][k]), 1.2), 0.5 + k * 0.22, -0.3 + k * 0.12, db(-33))
cue("night shimmer over the tower", 0.5)
sfx(ding([1046.5, 1568], 0.8), T["silver1"], 0, db(-30)); cue("record board", T["silver1"])
sfx(whoosh(1.2, 220, 2600), T["crashed"] - 0.15, 0, db(-23)); sfx(sweep(1.3, 900, 180), T["crashed"], 0, db(-28)); sfx(thud(70, 32, 0.6), T["crashed"] + 0.05, 0, db(-25)); cue("the crash (2026)", T["crashed"])
for k, tc in enumerate(CU["crashLandA"]): sfx(clank(600 + 37 * (k % 7), 0.55, 1.0), tc, 0.6 * np.sin(k * 2.1), db(-29))
sfx(murmur(1.2, lambda u: np.sin(np.pi * u)), T["crashed"] + 0.2, 0, db(-34))
sfx(thud(120, 60, 0.3), T["third"], 0, db(-27)); sfx(blip(220, 0.25, -0.2), T["third"] + 0.02, 0, db(-29)); cue("−31% board", T["third"])
# 2 — worst since 1980
sfx(ding([392, 587.3, 784], 1.4), T["y1980"], 0, db(-27)); cue("1980 stamp", T["y1980"])
for tw in (T["wipe1"], T["wipe2"]): sfx(whoosh(1.3), tw - 0.05, 0, db(-22)); cue("sky wipe", tw)
# 3 — the brothers
sfx(ding([880, 1318.5], 0.9), T["bunker"], 0, db(-28)); cue("name card: the Hunt brothers", T["bunker"])
# 4 — paper money loses value; they buy silver
sfx(flutter(0.4), T["paper"] - 0.2, 0, db(-30)); sfx(sweep(1.0, 900, 260), T["lose"], 0, db(-31)); sfx(blip(330, 0.2, -0.2), T["value"] + 0.1, 0, db(-31)); cue("the banknote shrinks", T["lose"])
sfx(clank(1500, 0.5, 0.3), T["silver4"], 0, db(-30)); sfx(ding([1318.5, 1975.5], 0.8), T["silver4"] + 0.05, 0, db(-31)); cue("a silver bar", T["silver4"])
# 5 — mountains of it; borrowed money
for k, tc in enumerate(CU["pileArrive"]): sfx(clank(900 + 25 * (k % 9), 0.4, 0.7), tc, -0.4 + 0.02 * k, db(-34))
cue("40 bars land on the mountain", CU["pileArrive"][0])
for k, tc in enumerate(CU["cash"]): sfx(flutter(0.3), tc + 0.2, 0.4 - 0.08 * k, db(-32))
sfx(blip(587, 0.12), T["borrowed5"], 0.3, db(-29)); cue("cash flies from the bank", CU["cash"][0])
# 6–7 — $6 → $50
sfx(blip(523, 0.12), T["p6"], 0, db(-28)); cue("$6", T["p6"])
for k, tc in enumerate(CU["drops80"]): sfx(clank(820 + 22 * k, 0.5, 0.9), tc, 0.15 * np.sin(k), db(-31 + 3 * k / len(CU["drops80"])))
cue("22 layers drop on (1979 → Jan 1980)", CU["drops80"][0])
sfx(ding([1174.7, 1568, 2349.3], 1.3), T["p50"], 0, db(-26)); sfx(cheer(1.1), T["p50"] + 0.05, 0, db(-31)); cue("$50! cheer", T["p50"])
# 8 — the rules change: no new buying; 9 — the slide
sfx(thud(110, 55, 0.35), T["rules"], 0, db(-27)); cue("the new rule", T["rules"])
sfx(blip(196, 0.3, -0.1), T["buying"], 0, db(-28)); sfx(ding([659.3, 987.8], 0.7), T["selling"], 0, db(-30)); cue("BUY ✕ / SELL ONLY", T["buying"])
for k, tc in enumerate(CU["slide80Start"]): sfx(slidescrape(0.38), tc, -0.3, db(-31))
for k, tc in enumerate(CU["slide80Land"]): sfx(clank(700 + 30 * (k % 5), 0.45, 0.7), tc, -0.4, db(-32))
cue("9 layers slide off", CU["slide80Start"][0])
# 10–11 — ten of your own, ninety borrowed; a ten percent fall; the margin call
for k, tc in enumerate(CU["coins"]): sfx(coin(2300 + 60 * k), tc, 0.2, db(-32 if k < 9 else -29))
cue("coins stack (9 blue, 1 gold)", CU["coins"][0])
sfx(sweep(0.8, 700, 250), T["percent"], 0, db(-30)); cue("−10%", T["percent"])
sfx(whoosh(0.6, 600, 3000), T["wipes"], 0.1, db(-30)); sfx(blip(880, 0.15, 0.4), T["wipes"] + 0.05, 0.1, db(-31)); sfx(thud(100, 50, 0.3), T["wipes"] + 0.4, 0, db(-30)); cue("your ten is gone", T["wipes"])
def rings(a, b, pan, g):
    t = a
    while t < b - 0.1: sfx(bellring(min(0.42, b - t)), t, pan, g); t += 0.7
rings(CU["ring1"][0], CU["ring1"][1], 0.3, db(-31)); cue("the lender's telephone rings", CU["ring1"][0])
sfx(ding([1046.5, 1318.5], 0.7), T["margin"], 0.2, db(-30)); cue("margin call tag", T["margin"])
# 12 — the brothers can't pay
rings(CU["ring2"][0], CU["ring2"][1], -0.3, db(-31)); cue("the brothers' telephone rings", CU["ring2"][0])
sfx(blip(220, 0.3, -0.15), T["couldnt"], 0, db(-28)); cue("couldn't pay", T["couldnt"])
# 13–14 — their silver is sold; the price hits $10.80; Silver Thursday
for k, tc in enumerate(CU["pileSold"]):
    if k % 3 == 0: sfx(whoosh(0.7, 500, 2600), tc, -0.3 + 0.02 * k, db(-33))
    sfx(clank(1200 + 30 * (k % 6), 0.3, 0.2), tc, -0.2, db(-38))
cue("28 bars fly off to be sold", CU["pileSold"][0])
sfx(whoosh(1.2, 220, 2600), T["hit"] - 0.15, 0, db(-23)); sfx(sweep(1.3, 900, 160), T["hit"], 0, db(-27)); sfx(thud(70, 32, 0.6), T["hit"] + 0.05, 0, db(-24)); cue("the 1980 crash", T["hit"])
for k, tc in enumerate(CU["crash80Land"]): sfx(clank(560 + 33 * (k % 7), 0.55, 1.0), tc, 0.5 * np.sin(k * 1.7), db(-29))
sfx(murmur(1.6, lambda u: np.sin(np.pi * u)), T["hit"] + 0.2, 0, db(-32)); cue("traders scatter", T["hit"] + 0.2)
sfx(thud(120, 60, 0.3), T["eighty"], 0, db(-27)); sfx(blip(196, 0.3, -0.2), T["eighty"] + 0.02, 0, db(-29)); cue("$10.80 board", T["eighty"])
sfx(ding([293.7, 440, 587.3], 1.8), T["silver14"], 0, db(-24)); cue("SILVER THURSDAY stamp", T["silver14"])
# 15 — the loss
sfx(sweep(1.4, 600, 150), T["lost"], 0, db(-30)); sfx(thud(90, 45, 0.5), T["p17"] + 0.1, 0, db(-28)); sfx(blip(174.6, 0.35, -0.2), T["bankrupt"], 0, db(-29)); cue("the loss; bankrupt", T["lost"])
# 16 — 2026: a January record again, borrowed money, a crash
sfx(ding([1174.7, 1568, 2349.3], 1.3), T["record"], 0, db(-27)); sfx(cheer(1.1), T["record"] + 0.05, 0, db(-32)); cue("record again", T["record"])
for k in range(14): sfx(step(), T["years"] + 0.4 + k * 0.13, 0.4 * np.sin(k * 1.3), db(-35))
sfx(blip(659, 0.1), T["lots"], 0.2, db(-30)); cue("borrowed money tag", T["lots"])
sfx(whoosh(1.2, 220, 2600), T["crash16"] - 0.15, 0, db(-23)); sfx(sweep(1.3, 900, 180), T["crash16"], 0, db(-28)); sfx(thud(70, 32, 0.6), T["crash16"] + 0.05, 0, db(-25)); cue("the crash (2026, again)", T["crash16"])
for k, tc in enumerate(CU["crashLandB"]): sfx(clank(620 + 35 * (k % 7), 0.55, 1.0), tc, 0.6 * np.sin(k * 2.3), db(-29))
sfx(murmur(1.2, lambda u: np.sin(np.pi * u)), T["crash16"] + 0.2, 0, db(-34))
# 17 — the slide to $41
for k, tc in enumerate(CU["slideStart"]): sfx(slidescrape(0.38), tc, 0.4, db(-31))
for k, tc in enumerate(CU["slideLand"]): sfx(clank(700 + 30 * (k % 5), 0.45, 0.7), tc, 0.5, db(-33))
cue("9 layers slide off (2026)", CU["slideStart"][0])
for k in range(4): sfx(blip(659 * 2 ** (-k * 3 / 12), 0.12), T["p41"] + k * 0.11, 0, db(-30))
cue("$121 → $41", T["p41"])
# 18 — not over; 19 — title; 20 — you decide
sfx(whoosh(1.6, 300, 2200), T["over"] - 0.2, 0, db(-29)); cue("crane up", T["over"])
sfx(ding([587.3, 880, 1174.7], 1.5), T["story"], 0, db(-23)); cue("title", T["story"])
sfx(blip(698, 0.12), T["borrowed19"], 0, db(-27)); cue("lesson", T["borrowed19"])
sfx(ding([1318.5, 1975.5], 0.8), T["would"], 0, db(-30)); cue("you decide chip", T["would"])
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
