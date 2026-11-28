# The jam in this episode: 22 cars on a 230 m ring (the numbers of Sugiyama et al. 2008), each driver following the car ahead.
# Not a fact in the script: the video's own traffic is drawn from this model (scene.js runs the same code), so this file shows
# that it does what the narration says the real test did: no obstacle anywhere, one tiny wobble, and a jam that grows out of it.
# Model: the optimal-velocity car-following model (Bando, Hasebe, Nakayama, Shibata and Sugiyama, Physical Review E 51, 1995), with the
#   velocity-difference term of Jiang, Wu and Zhu (Physical Review E 64, 2001) so that no car runs into the one ahead:
#   dv/dt = a * (V(gap) - v) + lam * (v_ahead - v), V rising from 0 (1.5 m behind the car ahead) to vmax (open road).
#   Our own parameters: the steady speed on this ring is about 21 km/h (the real test asked for 30 km/h) and the flow is unstable, as the paper found.
import math
L, N, CAR = 230.0, 22, 4.3                 # ring length (m), cars, car length (m)
VMAX, SC, WD, S0, A, LAM = 14.0, 6.5, 2.0, 1.5, 1.6, 0.35   # top speed (m/s), gap at the middle of the curve (m), its width (m), gap where V = 0 (m), sensitivity (1/s), velocity-difference weight (1/s)
DT = 1 / 60                                # the same step as scene.js
K = math.tanh((SC - S0) / WD)
def V(s): return max(-2.0, VMAX * (math.tanh((s - SC) / WD) + K) / (1 + K))
def run(T=160.0, kick=0.5, t_kick=0.0):
    """All cars equally spaced at the steady speed; at t_kick, car 0 is moved `kick` metres back (one tiny wobble). Returns samples every 0.5 s."""
    x = [i * L / N for i in range(N)]; v = [V(L / N - CAR)] * N; out = []; t = 0.0; kicked = False
    while t < T:
        if not kicked and t >= t_kick: x[0] -= kick; kicked = True
        h = [((x[(i + 1) % N] - x[i]) % L) for i in range(N)]
        acc = [A * (V(h[i] - CAR) - v[i]) + LAM * (v[(i + 1) % N] - v[i]) for i in range(N)]
        v = [max(0.0, v[i] + acc[i] * DT) for i in range(N)]; x = [(x[i] + v[i] * DT) % L for i in range(N)]
        t += DT
        if abs(t / 0.5 - round(t / 0.5)) < DT / 1.9: out.append((round(t, 2), list(x), list(v), list(acc), h))
    return out
if __name__ == "__main__":
    h0 = L / N; s0 = h0 - CAR; print(f"ring {L:.0f} m, {N} cars: {h0:.2f} m front to front ({s0:.2f} m between cars), steady speed {V(s0) * 3.6:.0f} km/h")
    dV = (V(s0 + 1e-4) - V(s0 - 1e-4)) / 2e-4
    print(f"stability: a + 2 lam = {A + 2 * LAM:.2f} < 2 V'(gap) = {2 * dV:.2f} -> {'unstable: a small wobble grows' if A + 2 * LAM < 2 * dV else 'stable'}")
    S = run()
    for t, x, v, acc, h in S:
        if t in (5, 10, 20, 30, 40, 60, 80, 100, 120, 140, 159.5):
            print(f"t {t:5.1f} s  slowest {min(v) * 3.6:5.1f} km/h  fastest {max(v) * 3.6:5.1f} km/h  smallest gap {min(h) - CAR:5.2f} m  cars under 10 km/h: {sum(1 for u in v if u < 10 / 3.6)}")
    # how the wobble grows: the spread of speeds over time
    first_stop = next((t for t, x, v, a_, h in S if min(v) < 1 / 3.6), None)
    print("a car first comes to a standstill (under 1 km/h) at", first_stop, "s after a 0.5 m wobble")
    late = [(t, x, v) for t, x, v, a_, h in S if t > 100]
    # where the jam is: the middle of the cars under 10 km/h (a circular mean); how fast it moves round the ring (the paper: the jam "propagates backward")
    cen = []
    for t, x, v in late:
        js = [k for k in range(N) if v[k] < 10 / 3.6]
        if js: cen.append((t, math.atan2(sum(math.sin(2 * math.pi * x[k] / L) for k in js), sum(math.cos(2 * math.pi * x[k] / L) for k in js)) * L / (2 * math.pi)))
    un = [cen[0][1]]
    for (t0, a), (t1, b) in zip(cen, cen[1:]): un.append(un[-1] + ((b - a + L / 2) % L - L / 2))
    tt = [c[0] for c in cen]; mt, mu = sum(tt) / len(tt), sum(un) / len(un)
    slope = sum((a - mt) * (b - mu) for a, b in zip(tt, un)) / sum((a - mt) ** 2 for a in tt)
    print(f"the jam moves {slope * 3.6:+.0f} km/h round the ring (minus = backwards, against the traffic)")
    # how long one car spends stuck, and how often it meets the jam again
    x0 = [x for t, x, v in late]; v0 = [v for t, x, v in late]; stuck = [sum(1 for v in v0 if v[k] < 10 / 3.6) * 0.5 / (late[-1][0] - late[0][0]) for k in range(N)]
    print(f"each car spends about {100 * sum(stuck) / N:.0f}% of its time under 10 km/h")
    print("smallest gap between two cars after 100 s:", round(min(min(h) for t, x, v, a_, h in S if t > 100) - CAR, 2), "m (never touching)")
