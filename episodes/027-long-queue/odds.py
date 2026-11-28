# The Long Queue: the two numbers on screen come from the papers (Banerjee 1992: 99 of 100; Bikhchandani, Hirshleifer and Welch 1992: after two people).
# This script checks both inside the models themselves, exactly and by simulation. Nothing here is a claim about real restaurants or real markets.
import math, random

def run(signals, prior_A=0.5, p=0.6, tie="coin", r=None):
    """Rational people choose in turn between A (here) and B (next door). Each has a private hunch (signal) that is right with probability p
    and sees every earlier choice. Public log-odds for A start at the prior; a choice that depended on its hunch reveals that hunch, a choice
    that did not (a cascade) reveals nothing. Ties: 'coin' = flip a coin (BHW 1992), 'own' = follow your own hunch (Easley and Kleinberg 2010)."""
    lam = math.log(p / (1 - p)); L = math.log(prior_A / (1 - prior_A)); out = []
    for s in signals:                                  # s = +1: hunch says A, -1: hunch says B
        def act(sig):
            v = L + sig * lam
            if abs(v) < 1e-12: return (1 if sig > 0 else -1) if tie == "own" else (1 if r.random() < 0.5 else -1)
            return 1 if v > 0 else -1
        a_hi, a_lo = L + lam, L - lam                   # what the choice would be with each hunch (ties count as informative here)
        informative = not ((a_hi > 1e-12 and a_lo > 1e-12) or (a_hi < -1e-12 and a_lo < -1e-12))
        a = act(s); out.append(a)
        if informative:
            if abs(a_lo) < 1e-12 or abs(a_hi) < 1e-12:     # a tie for one of the two hunches: the choice says a little (coin rule) or everything (own rule)
                if tie == "own": L += s * lam
                else:   # BHW coin rule: a tie-breaker's choice is only partly informative; update by Bayes on P(choice | state)
                    pA_A = p * (1 if a_hi > 1e-12 else 0.5) + (1 - p) * (1 if a_lo > 1e-12 else 0.5 if abs(a_lo) < 1e-12 else 0)
                    pA_B = (1 - p) * (1 if a_hi > 1e-12 else 0.5) + p * (1 if a_lo > 1e-12 else 0.5 if abs(a_lo) < 1e-12 else 0)
                    L += math.log(pA_A / pA_B) if a == 1 else math.log((1 - pA_A) / (1 - pA_B))
            else: L += s * lam
    return out

# 1. Banerjee's example (QJE 1992, pp. 798-799): prior 51% A, 100 people, 99 hunches say B, the one A-hunch chooses first.
for p in (0.55, 0.6, 0.75, 0.9):
    ch = run([+1] + [-1] * 99, prior_A=0.51, p=p, tie="own")
    print(f"Banerjee's example, hunches right {p:.0%} of the time: {ch.count(1)} of 100 choose A (here), {ch.count(-1)} choose B (next door)")
lam = math.log(0.6 / 0.4); post = 1 / (1 + math.exp(-(math.log(0.51 / 0.49) + 1 * lam - 99 * lam)))
print(f"  ... although with all 100 hunches pooled, the chance that A is the better one is {post:.1e} ('practically certain that B is better')")

# 2. After two: a prior of 50/50, the first two choose A. Does the third choose A even with a B-hunch?  (BHW 1992, pp. 996-997)
r = random.Random(1)
for tie in ("coin", "own"):
    third = [run([+1, +1, -1], 0.5, 0.6, tie, r)[2] for _ in range(1000)]
    print(f"tie rule '{tie}': first two hunches say A, the third's says B -> the third chooses A in {third.count(1) / 10:.0f}% of 1,000 runs")

# 3. How often does the whole queue settle on the worse place? hunches right p of the time, 100 people, prior 50/50.
def wrong_share(p, tie, N=100, R=40000, seed=7):
    rr = random.Random(seed); wrong = 0; casc = 0
    for _ in range(R):
        good = 1 if rr.random() < 0.5 else -1
        sig = [good if rr.random() < p else -good for _ in range(N)]
        ch = run(sig, 0.5, p, tie, rr)
        if len(set(ch[-80:])) == 1:
            casc += 1
            if ch[-1] != good: wrong += 1
    return wrong / R, casc / R
for p in (0.6, 2 / 3, 0.7, 0.8):
    exact_own = (1 - p) ** 2 / (p ** 2 + (1 - p) ** 2)       # 'own' rule: a cascade starts when one place leads by two (Easley and Kleinberg 2010)
    w, c = wrong_share(p, "own")
    print(f"hunches right {p:.0%}: the last 80 of 100 all at the worse place in {w:.1%} of runs (exact for an endless queue: {exact_own:.1%}); a settled queue in {c:.1%}")
