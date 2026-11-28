// The traffic on the ring: 22 cars on a 230 m track (the numbers of Sugiyama et al., New Journal of Physics 2008), each driver following
// the car ahead (optimal-velocity model, Bando et al. 1995, with the velocity-difference term of Jiang, Wu and Zhu 2001 so nobody touches).
// No obstacle anywhere: one car starts 0.5 m out of place and the jam grows out of that wobble. odds.py runs the same model in Python.
export const JAM = { L: 230, N: 22, CAR: 4.3, VMAX: 14, SC: 6.5, WD: 2.0, S0: 1.5, A: 1.6, LAM: 0.35, DT: 1 / 60 };
export function simulate(T = 150, kick = 0.5, start = 'even') {
  const { L, N, CAR, VMAX, SC, WD, S0, A, LAM, DT } = JAM, K = Math.tanh((SC - S0) / WD);
  const V = s => Math.max(-2, VMAX * (Math.tanh((s - SC) / WD) + K) / (1 + K));
  const steps = Math.ceil(T / DT) + 1, X = new Float64Array(steps * N), Vv = new Float32Array(steps * N), Ac = new Float32Array(steps * N);
  const x = [], v = [], acc = new Array(N).fill(0);
  for (let i = 0; i < N; i++) { x.push(start === 'jam' ? i * (CAR + 2.4) : i * L / N); v.push(start === 'jam' ? 0 : V(L / N - CAR)); }   // 'jam': everybody bumper to bumper, as after a long wait
  if (start !== 'jam') x[0] -= kick;
  let unwrap = x.slice();                                             // distance driven (not wrapped), so cars never jump at the seam
  for (let k = 0; k < steps; k++) {
    for (let i = 0; i < N; i++) { X[k * N + i] = unwrap[i]; Vv[k * N + i] = v[i]; Ac[k * N + i] = acc[i]; }
    for (let i = 0; i < N; i++) { const j = (i + 1) % N; let h = (x[j] - x[i]) % L; if (h < 0) h += L; acc[i] = A * (V(h - CAR) - v[i]) + LAM * (v[j] - v[i]); }
    for (let i = 0; i < N; i++) { const nv = Math.max(0, v[i] + acc[i] * DT); v[i] = nv; x[i] = (x[i] + nv * DT) % L; unwrap[i] += nv * DT; }
  }
  return { X, V: Vv, A: Ac, steps, N, L, DT };
}
// state of car i at sim time tau (linear between steps): [distance driven, speed, acceleration]
export function carAt(S, i, tau) {
  const f = Math.max(0, Math.min(S.steps - 1.001, tau / S.DT)), k = Math.floor(f), u = f - k, a = k * S.N + i, b = a + S.N;
  return [S.X[a] + (S.X[b] - S.X[a]) * u, S.V[a] + (S.V[b] - S.V[a]) * u, S.A[a] + (S.A[b] - S.A[a]) * u];
}
