# How often does a strategy that wins p of its trades lose k in a row within n trades? Exact (Markov chain) + a simulation as a cross-check.
import random
def exact(p_win, k, n):
    q = 1 - p_win; st = [1.0] + [0.0] * (k - 1); hit = 0.0      # st[j] = P(current losing run = j, no run of k yet)
    for _ in range(n):
        ns = [0.0] * k; 
        for j, pr in enumerate(st):
            ns[0] += pr * p_win
            if j + 1 == k: hit += pr * q
            else: ns[j + 1] += pr * q
        st = ns
    return hit
def sim(p_win, k, n, N=200000, seed=7):
    r = random.Random(seed); c = 0
    for _ in range(N):
        run = 0
        for _ in range(n):
            if r.random() < p_win: run = 0
            else:
                run += 1
                if run >= k: c += 1; break
    return c / N
def mean_wait(p_win, k):    # expected number of trades until the first run of k losses
    q = 1 - p_win; return (1 - q ** k) / (p_win * q ** k)
for p in (0.5, 0.55, 0.6, 0.65, 0.7):
    print(f"win {p:.0%}: " + "  ".join(f"n={n}: {exact(p,3,n):.1%} (sim {sim(p,3,n):.1%})" for n in (10, 20, 30, 50)) + f"  | mean wait {mean_wait(p,3):.1f} trades")
# lines: with N equally fast lines, how often is yours the fastest?  (and what switching to the back of a moving line does)
def lines(N=3, trials=200000, seed=3, people=6):
    r = random.Random(seed); best = 0
    for _ in range(trials):
        t = [sum(r.expovariate(1.0) for _ in range(people)) for _ in range(N)]
        if t[0] == min(t): best += 1
    return best / trials
print("3 equal lines, yours is the fastest:", f"{lines(3):.1%}", "| 5 lines:", f"{lines(5):.1%}")
def switcher(trials=100000, seed=5, people=6, N=3):
    """You stand behind `people` shoppers in line 0; each shopper takes an exponential(1) time. Stay: wait for your own line.
    Switch: whenever another line serves someone before yours does, you move to the back of that line (its length then: its remaining + you)."""
    r = random.Random(seed); stay = 0.0; sw = 0.0
    for _ in range(trials):
        # stay
        stay += sum(r.expovariate(1.0) for _ in range(people))
        # switch rule: lines all start with `people` ahead of you; new shoppers keep every other line at `people` long behind the till (a busy store)
        t = 0.0; ahead = people; moves = 0
        while ahead > 0:
            # next service completion among N lines (each rate 1): which line?
            t += r.expovariate(N); k = r.randrange(N)
            if k == 0: ahead -= 1                     # your line moved
            elif moves < 50: ahead = people; moves += 1     # another line moved: you jump to its back (it is `people` long again)
        sw += t
    return stay / trials, sw / trials
s, w = switcher(); print(f"mean wait: stay {s:.2f} service times, switch to whichever line just moved {w:.2f}")
