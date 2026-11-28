// Nothing at the Front — episode 28 (turn format). Low-poly storybook scene, deterministic: window.renderAt(t) draws the frame for time t.
// One place for the whole video: a ring road round a park, 22 cars on a 230 m lane (the numbers of the 2008 test), no obstacle anywhere.
// The cars follow a car-following model (jam.js, odds.py), so the jam is real in the model: it has nothing at the front and it moves backwards.
// At the turn a price tower rises in the middle of the park; then every car that brakes at the back of the jam sends a red spark up to its screen
// and a red candle appears, each a bigger step down. Fifty pillars rise round the park for the fifty biggest days; the light goes, the jam lets you go.
import * as THREE from 'three';
import { SKIN, MAT, rng, GB, person, bushTree, tower, house, lamp, WIN_LIT } from './kit.js';
import { simulate, carAt, JAM } from './jam.js';

// ───────────────────────── basics
const W = 1080, H = 1920, QP = new URLSearchParams(location.search);
const TIM = window.TIMING;
const S = i => TIM.sentences[i - 1].s, E = i => TIM.sentences[i - 1].e;
const strip = s => s.replace(/[.,?!]/g, '').toLowerCase();
function wt(si, text, nth = 0) { const ws = TIM.words.filter(w => w.si === si && strip(w.t) === strip(text)); if (!ws[nth]) throw new Error('no word ' + si + ' ' + text); return ws[nth].s; }
const DUR = TIM.duration + 1.25; window.DUR = DUR;
const c01 = x => x < 0 ? 0 : x > 1 ? 1 : x, lerp = (a, b, u) => a + (b - a) * u;
const sm = (a, b, x) => { const u = c01((x - a) / (b - a)); return u * u * (3 - 2 * u); };
const eio = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2, eo = x => 1 - Math.pow(1 - x, 3);
const back = x => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };
const seg = (t, a, b) => c01((t - a) / (b - a));
const win = (t, a, b, fi = .25, fo = .25) => Math.min(seg(t, a, a + fi), 1 - seg(t, b, b + fo));
const R = rng(20261128 + 28);
const OPEN = Object.assign({ words: 'you', text: 'captions', picture: 'action', beat2: 'event', lock: 'turn' }, TIM.open || {});
const BAN = TIM.banner || null, SH = BAN ? 160 : 0;

// ───────────────────────── story clock (everything hangs off the narration)
const T = {
  beat2: 1.5,                                               // the second event: a red wave of brake lights runs back down the queue
  jam: wt(1, 'jam,') - 0.1, front: wt(1, 'front,') - 0.1, nothing: wt(1, 'nothing.') - 0.1,
  turn: S(2) - 0.05, same: wt(2, 'same') - 0.1, trade: wt(2, 'trade.') - 0.15,
  why: S(3) - 0.05,
  b4: S(4) - 0.05, test: wt(4, 'test,') - 0.1, n22: wt(4, 'twenty-two') - 0.1, circle: wt(4, 'circle') - 0.1, speed: wt(4, 'speed.') - 0.1,
  b5: S(5) - 0.05, blocked: wt(5, 'blocked') - 0.1, jam2: wt(5, 'jam') - 0.1, anyway: wt(5, 'anyway.') - 0.1,
  b6: S(6) - 0.05, brakes: wt(6, 'brakes') - 0.1, harder: wt(6, 'harder') - 0.1, ahead: wt(6, 'ahead.') - 0.1,
  b7: S(7) - 0.05, prices: wt(7, 'prices.') - 0.15,
  b8: S(8) - 0.05, dip: wt(8, 'dip', 0) - 0.1, sell: wt(8, 'sell.') - 0.1, sale: wt(8, 'sale') - 0.1, more: wt(8, 'more.') - 0.1,
  rehook: S(9) - 0.05, drop: wt(9, 'drop') - 0.1, knows: wt(9, 'knows') - 0.1,
  b10: S(10) - 0.05, nobody: wt(10, 'nobody') - 0.1, many: wt(10, 'Many') - 0.1, fifty: wt(10, 'fifty') - 0.1, days: wt(10, 'days') - 0.1, news: wt(10, 'news.') - 0.1,
  b11: S(11) - 0.05, twenty1: wt(11, 'twenty', 0) - 0.1, jam3: wt(11, 'jam') - 0.1, caused: wt(11, 'caused.') - 0.1, but: wt(11, 'But') - 0.05, twenty2: wt(11, 'twenty', 1) - 0.1, red: wt(11, 'red,') - 0.1, knows2: wt(11, 'knows.') - 0.1,
  b12: S(12) - 0.05, maybe1: wt(12, 'Maybe', 0) - 0.1, maybe2: wt(12, 'Maybe', 1) - 0.1, braking: wt(12, 'braking.') - 0.1,
  end: E(12),
};
T.use = T.end + 0.3;
window.T = T;

// ───────────────────────── the traffic (jam.js): video time t -> model time tau. The model plays at about half speed, so that "you" are
// in the jam on frame 0, reach the back of it again on "a dip makes you sell" and sit in it for "you'd sit twenty minutes"
const SIM = simulate(100, 0.5, 'jam'), YOU = 9, BEHIND = (YOU - 1 + JAM.N) % JAM.N;
const TK = [[3.2, 72.9], [21.0, 81.0], [39.4, 90.3]];
const r01 = (TK[1][1] - TK[0][1]) / (TK[1][0] - TK[0][0]), r12 = (TK[2][1] - TK[1][1]) / (TK[2][0] - TK[1][0]);
const tau = t => t <= TK[1][0] ? TK[0][1] + (t - TK[0][0]) * r01 : TK[1][1] + (t - TK[1][0]) * r12;
const RL = JAM.L / (2 * Math.PI), RO = 41.4;                           // our lane (230 m round), the other carriageway
const TH0 = -Math.PI / 2 - 2 * Math.PI * carAt(SIM, YOU, tau(0))[0] / JAM.L;      // turn the ring so that you start at the bottom of the map (z = -RL)
const carS = (i, t) => { const [d, v, a] = carAt(SIM, i, tau(t)); return { th: TH0 + 2 * Math.PI * d / JAM.L, v, a }; };
const P = (th, r = RL, y = 0) => [r * Math.cos(th), y, r * Math.sin(th)];
const deg = th => th * 180 / Math.PI;
const behindAz = th => 180 - deg(th);                                  // camera azimuth that sits behind a car at angle th (cars drive towards +th)
const outsideAz = th => 90 - deg(th);                                  // ... beside it, outside the ring, looking in (cars then drive right to left)
// the cars that reach the back of the jam while the narration explains it: each hangs a candle (video time it starts braking)
const CH = [];
{ const brk = {}; for (let i = 0; i < JAM.N; i++) { let free = false; for (let t = 12; t < 30; t += 0.02) { const s = carS(i, t); if (s.v > 7) free = true; if (free && s.a < -1.2) { brk[i] = t; break; } } }
  for (const i in brk) if (brk[i] > T.b6 - 0.6 && brk[i] < T.drop + 0.6) CH.push({ i: +i, tb: brk[i] });
  CH.sort((a, b) => a.tb - b.tb);
  const raw = CH.map((c, k) => 0.62 + 0.24 * k), tot = raw.reduce((a, b) => a + b, 0), f = Math.min(1, 7.2 / tot);      // the staircase ends above the roofs
  let top = 9.6; CH.forEach((c, k) => { c.k = k; c.d = raw[k] * f; c.top = top; top -= c.d; }); }
const kYou = CH.findIndex(c => c.i === YOU), kBehind = CH.findIndex(c => c.i === BEHIND);
if (kYou < 0 || kBehind < 0) throw new Error('you or the car behind you never reach the back of the jam in time: ' + JSON.stringify(CH));
const TAIL_FIX = carS(YOU, T.sell).th;                                 // the spot where you brake
const CHTH = CH.map(c => carS(c.i, c.tb).th);
const tailSm = t => { if (t <= CH[0].tb) return CHTH[0] + (CHTH[0] - CHTH[1]) * (CH[0].tb - t) / (CH[1].tb - CH[0].tb); for (let k = 0; k + 1 < CH.length; k++) if (t < CH[k + 1].tb) return lerp(CHTH[k], CHTH[k + 1], (t - CH[k].tb) / (CH[k + 1].tb - CH[k].tb)); const n = CH.length; return CHTH[n - 1] + (CHTH[n - 1] - CHTH[n - 2]) * (t - CH[n - 1].tb) / (CH[n - 1].tb - CH[n - 2].tb); };

// ───────────────────────── renderer, sky, light
const canvas = document.getElementById('gl');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: QP.get('aa') !== '0', preserveDrawingBuffer: true });
renderer.setPixelRatio(1); renderer.setSize(W, H, false);
renderer.toneMapping = THREE.NeutralToneMapping; renderer.toneMappingExposure = 1.06;
renderer.shadowMap.enabled = QP.get('sh') !== '0'; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
const scene = new THREE.Scene(); scene.fog = new THREE.Fog(0xffffff, 260, 1100);
const camera = new THREE.PerspectiveCamera(35, W / H, 0.5, 3000);
const hemi = new THREE.HemisphereLight(0xffffff, 0x886644, 1.5); scene.add(hemi);
const sun = new THREE.DirectionalLight(0xffffff, 3); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); sun.shadow.bias = -0.0005; sun.shadow.normalBias = 0.3; sun.shadow.camera.near = 1; sun.shadow.camera.far = 900; scene.add(sun, sun.target);
const hx = h => { const c = new THREE.Color(h); return [c.r, c.g, c.b]; };
const PS = (top, mid, hor, fog, sunC, sunI, hemS, hemG, hemI, star, glow, az, el, orb, orbS) => ({ top: hx(top), mid: hx(mid), hor: hx(hor), fog: hx(fog), sunC: hx(sunC), sunI, hemS: hx(hemS), hemG: hx(hemG), hemI, star, glow, az, el, orb: hx(orb), orbS });
const PRE = {
  NIGHT: PS(0x070B24, 0x141C4B, 0x30326A, 0x262A5E, 0xB4C2FF, 2.0, 0x5567C4, 0x3A3048, 1.5, 1, 1, 250, 42, 0xFFF4D6, 30),
  DAY: PS(0x2F8FDA, 0x86C6EE, 0xF6E7C4, 0xEEDFC0, 0xFFF1D6, 3.6, 0xCFE8FF, 0xD2AE7C, 1.8, 0, 0, 236, 62, 0xFFF8E0, 38),
  GOLDEN: PS(0x3C7FCB, 0xF2C58A, 0xFFD79A, 0xF6CF9A, 0xFFC878, 3.2, 0xE8D2B0, 0xC08A55, 1.5, 0, 0.1, 246, 26, 0xFFE0A0, 44),
  SUNSET: PS(0x2E2F72, 0xE0707A, 0xFFB25E, 0xEE9A6A, 0xFF9050, 2.6, 0xA98AC0, 0x8A5A44, 1.2, 0.12, 0.5, 256, 10, 0xFFB060, 50),
  DUSK: PS(0x141A4C, 0x4A3F86, 0xC06A78, 0x6A4A78, 0x93A4F4, 1.7, 0x5A62B0, 0x3A2A40, 1.15, 0.65, 0.85, 252, 36, 0xFFF4D6, 30),
};
// one afternoon on the ring road: bright in the jam, golden while the candles fall, sunset on "twenty minutes", dusk on the last line
const SKY = [[0, 'DAY'], [T.b7, 'DAY'], [T.rehook + 1.5, 'GOLDEN'], [T.b11 - 0.5, 'GOLDEN'], [T.b11 + 2.5, 'SUNSET'], [T.b12 - 0.2, 'SUNSET'], [T.b12 + 1.6, 'DUSK'], [T.end + 0.6, 'NIGHT'], [DUR + 1, 'NIGHT']];
const sky = {};
function skyAt(t) {
  let i = 0; while (i < SKY.length - 2 && t >= SKY[i + 1][0]) i++;
  const a = PRE[SKY[i][1]], b = PRE[SKY[i + 1][1]], u = sm(SKY[i][0], SKY[i + 1][0], t);
  for (const k in a) sky[k] = Array.isArray(a[k]) ? [lerp(a[k][0], b[k][0], u), lerp(a[k][1], b[k][1], u), lerp(a[k][2], b[k][2], u)] : lerp(a[k], b[k], u);
  return sky;
}
const domeG = new THREE.SphereGeometry(2400, 24, 14); domeG.setAttribute('color', new THREE.Float32BufferAttribute(new Float32Array(domeG.attributes.position.count * 3), 3));
const dome = new THREE.Mesh(domeG, new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide, fog: false, depthWrite: false, toneMapped: false })); dome.renderOrder = -10; scene.add(dome);
function paintSky(s) {
  const p = domeG.attributes.position, c = domeG.attributes.color;
  for (let i = 0; i < p.count; i++) {
    const y = p.getY(i) / 2400; let r, g, b;
    if (y <= 0) { r = s.hor[0]; g = s.hor[1]; b = s.hor[2]; }
    else if (y < 0.25) { const u = y / 0.25; r = lerp(s.hor[0], s.mid[0], u); g = lerp(s.hor[1], s.mid[1], u); b = lerp(s.hor[2], s.mid[2], u); }
    else { const u = Math.min(1, (y - 0.25) / 0.6); r = lerp(s.mid[0], s.top[0], u); g = lerp(s.mid[1], s.top[1], u); b = lerp(s.mid[2], s.top[2], u); }
    c.setXYZ(i, r, g, b);
  }
  c.needsUpdate = true;
}
const starG = new THREE.BufferGeometry(); { const a = []; for (let i = 0; i < 700; i++) { const u = R(), th = R() * Math.PI * 2, y = 0.04 + 0.96 * u, r = Math.sqrt(1 - y * y); a.push(r * Math.cos(th) * 2200, y * 2200, r * Math.sin(th) * 2200); } starG.setAttribute('position', new THREE.Float32BufferAttribute(a, 3)); }
const starM = new THREE.PointsMaterial({ color: 0xffffff, size: 2.6, sizeAttenuation: false, transparent: true, fog: false, depthWrite: false, toneMapped: false });
const stars = new THREE.Points(starG, starM); scene.add(stars);
function radial(inner, outer) { const cv = document.createElement('canvas'); cv.width = cv.height = 128; const g = cv.getContext('2d'); const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, inner); gr.addColorStop(1, outer); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); const tx = new THREE.CanvasTexture(cv); tx.colorSpace = THREE.SRGBColorSpace; return tx; }
const orbM = new THREE.MeshBasicMaterial({ color: 0xffffff, fog: false, toneMapped: false, depthWrite: false });
const orb = new THREE.Mesh(new THREE.CircleGeometry(1, 28), orbM); scene.add(orb);
const haloM = new THREE.MeshBasicMaterial({ map: radial('rgba(255,255,255,0.55)', 'rgba(255,255,255,0)'), transparent: true, fog: false, toneMapped: false, depthWrite: false, blending: THREE.AdditiveBlending });
const halo = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), haloM); scene.add(halo);
const GLOWTX = radial('rgba(255,255,255,0.9)', 'rgba(255,255,255,0)');

// ───────────────────────── the place: a ring road round a park (our lane 230 m round, the other carriageway outside it), pavements, a plaza, towers
const ground = new THREE.Mesh(new THREE.PlaneGeometry(4000, 4000).rotateX(-Math.PI / 2), new THREE.MeshLambertMaterial({ color: 0xBFC7A6 })); ground.receiveShadow = true; scene.add(ground);
const ringM = (r0, r1, col, y) => { const m = new THREE.Mesh(new THREE.RingGeometry(r0, r1, 160, 1).rotateX(-Math.PI / 2), new THREE.MeshLambertMaterial({ color: col })); m.position.y = y; m.receiveShadow = true; scene.add(m); return m; };
{ const park = new THREE.Mesh(new THREE.RingGeometry(0.01, 31.2, 128, 14).rotateX(-Math.PI / 2), new THREE.MeshLambertMaterial({ color: 0x8CC266 })); park.position.y = 0.02; park.receiveShadow = true; scene.add(park); }
ringM(31.2, 34.8, 0xDCD5C6, 0.07);                 // inner pavement
ringM(34.8, 43.2, 0x4D525E, 0.03);                 // the road
ringM(38.3, 39.7, 0x7DB35A, 0.12); ringM(38.2, 38.35, 0xEDE6D6, 0.13); ringM(39.65, 39.8, 0xEDE6D6, 0.13);     // median with its kerbs
ringM(43.2, 48.5, 0xDCD5C6, 0.07);                 // outer pavement
ringM(48.5, 96, 0xD8CFBC, 0.05);                   // plaza
for (const r of [35.05, 42.95]) ringM(r, r + 0.14, 0xF4F1EA, 0.05);                 // edge lines
{ const g = new GB(); for (let k = 0; k < 64; k++) { const th = k / 64 * Math.PI * 2; g.box(2.2, 0.02, 0.14, 0xF4F1EA, 0, 0, 0); } }   // (no dashes: one lane each way, like the test track)
// paving joints, benches, a bus stop on the outer pavement, lamps, trees
const world = new GB();
for (let k = 0; k < 120; k++) { const th = k / 120 * Math.PI * 2, [x, , z] = P(th, 33.0); world.box(3.6, 0.02, 0.06, 0xC9C1B0, x, 0.085, z, 0, -th, 0); const [x2, , z2] = P(th, 45.85); world.box(5.3, 0.02, 0.06, 0xC9C1B0, x2, 0.085, z2, 0, -th, 0); }
const BENCH = th => { const [x, , z] = P(th, 30.2); world.box(0.5, 0.45, 2.0, 0x8A5A34, x, 0.45, z, 0, -th, 0); world.box(0.12, 0.5, 2.0, 0x8A5A34, x - 0.3 * Math.cos(th), 0.85, z - 0.3 * Math.sin(th), 0, -th, 0); };
for (let k = 0; k < 10; k++) BENCH(k / 10 * Math.PI * 2 + 0.2);
const BUS_TH = TH0 + 2 * Math.PI * (carAt(SIM, YOU, tau(0))[0] + 14) / JAM.L;      // the bus stop sits just ahead of you, on the outer pavement
{ const [x, , z] = P(BUS_TH, 45.7), a = -BUS_TH; world.box(0.18, 2.6, 0.18, 0x5A5F66, x - 1.6 * Math.sin(BUS_TH), 1.3, z + 1.6 * Math.cos(BUS_TH)); world.box(0.18, 2.6, 0.18, 0x5A5F66, x + 1.6 * Math.sin(BUS_TH), 1.3, z - 1.6 * Math.cos(BUS_TH));
  const [xr, , zr] = P(BUS_TH, 46.4); world.box(1.2, 0.1, 3.8, 0x2F6FD8, xr, 2.62, zr, 0, a, 0); world.box(0.08, 2.0, 3.6, 0xBFE3F2, xr + 0.5 * Math.cos(BUS_TH), 1.5, zr + 0.5 * Math.sin(BUS_TH), 0, a, 0); }
scene.add(world.mesh());
const LAMP_GLOW = [];
for (let k = 0; k < 10; k++) { const th = TH0 + 0.5 + k / 10 * Math.PI * 2, m = lamp(6.5), [x, , z] = P(th, 34.0); m.position.set(x, 0, z); m.rotation.y = -th; scene.add(m);
  const hp = P(th, 34.0 + 1.25, 6.35); const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: GLOWTX, color: 0xFFD9A0, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0 })); sp.position.set(...hp); sp.scale.setScalar(5); scene.add(sp); LAMP_GLOW.push(sp); }
const TREES = [];
{ const tr = rng(5); for (let k = 0; k < 24; k++) { const th = tr() * Math.PI * 2, r = 11.5 + tr() * 13; TREES.push([th, r, 4.5 + tr() * 3]); }
  for (let k = 0; k < 22; k++) TREES.push([(k + 0.3) / 22 * Math.PI * 2, 57 + (k % 2) * 2.5, 5 + tr() * 2]);
  for (const [th, r, h] of TREES) { const m = bushTree(h, tr); const [x, , z] = P(th, r); m.position.set(x, 0, z); scene.add(m); } }
const TOWERS = [];
{ const tr = rng(11); const PAL = [[0xE8E1D2, 0x6F8FA8], [0xD9C9B0, 0x5E7F9A], [0xC9D3D9, 0x4E6E8A], [0xE3D0B8, 0x7A8F9F], [0xD6D9DD, 0x55708C], [0xEADFCF, 0x8AA0B2]];
  for (let k = 0; k < 22; k++) { const th = (k + tr() * 0.5) / 22 * Math.PI * 2, r = 106 + tr() * 24, w = 12 + tr() * 10, d = 12 + tr() * 8, h = 18 + tr() * 34, pal = PAL[Math.floor(tr() * PAL.length)];
    const g = tower(w, h, d, { rand: tr, color: pal[0], glass: pal[1], floor: 3.4, litP: 0.55, crown: h > 44 && tr() < 0.5 }); const [x, , z] = P(th, r); g.position.set(x, 0, z); g.rotation.y = -th; scene.add(g); TOWERS.push([x, z, Math.max(w, d) / 2 + 1, h]); }
  for (let k = 0; k < 14; k++) { const th = (k + 0.5) / 14 * Math.PI * 2 + 0.05, w = 9 + tr() * 3, h = 6 + tr() * 3, d = 7; const m = house(w, h, d, { rand: tr, color: [0xB8644A, 0xC98556, 0xD9A45F, 0x9C6B5A, 0xE6D3B0][k % 5], front: 1 }); const [x, , z] = P(th, 88); m.position.set(x, 0, z); m.rotation.y = -Math.PI / 2 - th; scene.add(m); TOWERS.push([x, z, 6.5, h + 3]); } }

// ───────────────────────── cars: one builder, facing +x, origin on the ground. Drivers sit in an open frame so you can see them; yours has no roof
const CAR_COL = [0x3B6FB8, 0xC8423A, 0x2FA39A, 0xE8E2D0, 0x5E6B7A, 0x7A4FA0, 0x4C9A62, 0xD9664A, 0x2A2E3A, 0x9CC7D8, 0xB8383B, 0xF2EFE8];
const TAILM = []; const HEADM = new THREE.MeshBasicMaterial({ color: 0xFFF4D0, toneMapped: false });
function mkCar(col, o = {}) {
  const g = new THREE.Group(), b = new GB(), dk = 0x262B33, L = 4.3;
  b.box(L, 0.66, 1.8, col, 0, 0.66, 0); b.box(L * 0.22, 0.1, 1.7, col, L * 0.33, 1.02, 0);                                   // body, bonnet
  b.box(0.1, 0.22, 1.82, dk, L / 2 + 0.02, 0.5, 0); b.box(0.1, 0.22, 1.82, dk, -L / 2 - 0.02, 0.5, 0);                      // bumpers
  for (const x of [L * 0.31, -L * 0.31]) for (const z of [0.86, -0.86]) b.cyl(0.36, 0.36, 0.26, 10, 0x1E2226, x, 0.36, z, Math.PI / 2, 0, 0);
  if (!o.open) { b.box(2.0, 0.12, 1.62, col, -0.3, 1.72, 0); for (const x of [0.62, -1.22]) for (const z of [0.76, -0.76]) b.box(0.14, 0.72, 0.12, col, x, 1.34, z); b.box(0.08, 0.5, 1.5, 0xBFE3F2, 0.66, 1.33, 0, 0, 0, -0.35); }
  else { b.box(0.08, 0.42, 1.6, 0xBFE3F2, 0.7, 1.22, 0, 0, 0, -0.45); b.box(0.5, 0.36, 1.66, col, -1.75, 1.15, 0); b.box(0.08, 0.36, 1.6, 0x3A3F48, -0.1, 1.15, 0); }
  b.box(0.06, 0.16, 0.34, 0xFFF4D0, L / 2 + 0.06, 0.82, 0.6); b.box(0.06, 0.16, 0.34, 0xFFF4D0, L / 2 + 0.06, 0.82, -0.6);
  const body = b.mesh(o.mat || MAT); g.add(body);
  const hl = new GB(); hl.box(0.05, 0.16, 0.36, 0xffffff, L / 2 + 0.1, 0.82, 0.6); hl.box(0.05, 0.16, 0.36, 0xffffff, L / 2 + 0.1, 0.82, -0.6); g.add(new THREE.Mesh(hl.geo(), HEADM));
  const tl = new GB(); tl.box(0.06, 0.2, 0.42, 0xffffff, -L / 2 - 0.08, 0.84, 0.6); tl.box(0.06, 0.2, 0.42, 0xffffff, -L / 2 - 0.08, 0.84, -0.6);
  const tm = new THREE.MeshBasicMaterial({ color: 0x5A1010, toneMapped: false }); TAILM.push(tm); g.add(new THREE.Mesh(tl.geo(), tm));
  const d = person(o.driver || { robe: [0x3B6FB8, 0xE8E2D0, 0x2FA39A, 0x5E6B7A, 0xD94F70, 0x4C9A62][Math.floor(R() * 6)], skin: SKIN[Math.floor(R() * SKIN.length)], short: [0x2A1E16, 0x4A3222, 0x1C1C22, 0x6B4A2E][Math.floor(R() * 4)] });
  d.scale.setScalar(0.92); d.position.set(-0.25, 0.08, 0.38); g.add(d);
  const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: GLOWTX, color: 0xFF3020, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0 })); glow.position.set(-L / 2 - 0.6, 0.9, 0); glow.scale.set(3.2, 2.0, 1); g.add(glow);
  g.userData = { tm, glow }; scene.add(g); return g;
}
const YOU_MAT = new THREE.MeshLambertMaterial({ vertexColors: true, emissive: 0xF7A600, emissiveIntensity: 0.1 });
const CARS = [];
for (let i = 0; i < JAM.N; i++) CARS.push(i === YOU ? mkCar(0xF7A600, { open: true, mat: YOU_MAT, driver: { robe: 0xF7A600, skin: SKIN[3], short: 0x2A1E16, shirt: 0xFFFDF5 } }) : mkCar(CAR_COL[(i * 5) % CAR_COL.length]));
// the other carriageway: free-flowing traffic the other way (it is not part of the test, it just keeps the street alive)
const OPP = []; for (let k = 0; k < 13; k++) { const g = mkCar(CAR_COL[(k * 7 + 3) % CAR_COL.length]); OPP.push({ g, th0: TH0 + 0.16 + k / 13 * Math.PI * 2 + 0.12 * Math.sin(k * 2.3), v: 9.5 + (k % 3) * 0.8 }); }   // one of them passes you on frame 0
const oppAt = (o, t) => o.th0 - o.v * t / RO;
const JAMG = new THREE.MeshBasicMaterial({ color: 0xFF3A2A, transparent: true, opacity: 0, depthWrite: false, toneMapped: false });
const JAMQ = CARS.map(() => { const m = new THREE.Mesh(new THREE.PlaneGeometry(6.4, 3.4).rotateX(-Math.PI / 2), JAMG); m.renderOrder = 1; scene.add(m); return m; });
const youRing = new THREE.Mesh(new THREE.RingGeometry(2.75, 3.0, 40).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: 0xF7A600, transparent: true, opacity: 0.9, toneMapped: false, depthWrite: false })); youRing.renderOrder = 2; scene.add(youRing);
const youLight = new THREE.PointLight(0xFFD9A0, 0, 18, 1.3); scene.add(youLight);

// ───────────────────────── people on the pavements (walking), at the bus stop and in the park
const PEOPLE = [];
{ const pr = rng(9), TOPS = [0x3B6FB8, 0xB8383B, 0x2FA39A, 0x7A4FA0, 0x4C9A62, 0xD9664A, 0x3B4A9A, 0xE8E2D0, 0x5E6B7A, 0xD94F70];
  const mkP = (r, th0, v, stand = false) => { const m = person({ robe: TOPS[Math.floor(pr() * TOPS.length)], skin: SKIN[Math.floor(pr() * SKIN.length)], short: [0x2A1E16, 0x4A3222, 0x1C1C22, 0x6B4A2E, 0x9A9FA6][Math.floor(pr() * 5)], s: 0.92 + pr() * 0.14 }); scene.add(m); PEOPLE.push({ m, r, th0, v, stand, ph: pr() * 6.28 }); };
  for (let k = 0; k < 16; k++) mkP(33.0 + (pr() - 0.5) * 1.6, pr() * Math.PI * 2, (pr() < 0.5 ? -1 : 1) * (1.1 + pr() * 0.5));
  for (let k = 0; k < 16; k++) mkP(45.5 + (pr() - 0.5) * 2.0, pr() * Math.PI * 2, (pr() < 0.5 ? -1 : 1) * (1.1 + pr() * 0.5));
  for (let k = 0; k < 3; k++) mkP(46.0 - k * 0.2, BUS_TH + (k - 1) * 0.04, 0, true);                 // waiting for the bus, just ahead of you
  for (let k = 0; k < 3; k++) mkP(33.4, TH0 + (0.05 + 0.03 * k), (k % 2 ? 1 : -1) * 1.2);           // walking past you on the inner pavement
  for (let k = 0; k < 8; k++) mkP(12 + pr() * 14, pr() * Math.PI * 2, (pr() < 0.5 ? -1 : 1) * (0.9 + pr() * 0.4)); }

// ───────────────────────── the price tower in the middle of the park (it rises at the turn): a screen on four sides, the same chart on each.
// Every car of the chain that brakes at the back of the jam sends a red spark up to it and a red candle appears: the jam is a falling chart.
const GREEN = new THREE.Color(0x2FD27F), RED = new THREE.Color(0xFF4A3E);
const SW = 13, SY = 13.6, SHH = 7.2;                                       // screen width (each face), its centre height, its height
const tower0 = new THREE.Group(); { const b = new GB(); b.box(2.6, 10.2, 2.6, 0x9AA3B5, 0, 5.1, 0); b.cyl(3.0, 3.4, 0.6, 8, 0xC9C1B0, 0, 0.3, 0); b.box(SW + 0.5, SHH + 0.5, SW + 0.5, 0x5A6274, 0, SY, 0); b.box(SW + 0.9, 0.35, SW + 0.9, 0x3A4156, 0, SY + SHH / 2 + 0.42, 0); b.box(SW + 0.95, 0.16, SW + 0.95, 0xF7A600, 0, SY + SHH / 2 + 0.2, 0); b.box(SW + 0.9, 0.3, SW + 0.9, 0x5A6274, 0, SY - SHH / 2 - 0.4, 0); tower0.add(b.mesh()); }
{ const cv = document.createElement('canvas'); cv.width = 1024; cv.height = 576; const g = cv.getContext('2d'); g.fillStyle = '#121A30'; g.fillRect(0, 0, 1024, 576); g.strokeStyle = 'rgba(255,255,255,0.10)'; g.lineWidth = 3;
  for (let y = 96; y < 576; y += 80) { g.beginPath(); g.moveTo(0, y); g.lineTo(1024, y); g.stroke(); } for (let x = 64; x < 1024; x += 128) { g.beginPath(); g.moveTo(x, 70); g.lineTo(x, 576); g.stroke(); }
  g.fillStyle = '#F7A600'; g.font = '800 46px Figtree, Inter, sans-serif'; g.textBaseline = 'top'; g.fillText('PRICE', 34, 18); g.fillStyle = 'rgba(255,255,255,0.55)'; g.font = '700 32px Inter, sans-serif'; g.fillText('LIVE', 210, 26);
  const tx = new THREE.CanvasTexture(cv); tx.colorSpace = THREE.SRGBColorSpace; const sm_ = new THREE.MeshBasicMaterial({ map: tx, toneMapped: false }), pl = new THREE.MeshBasicMaterial({ color: 0x121A30, toneMapped: false });
  const scr = new THREE.Mesh(new THREE.BoxGeometry(SW + 0.12, SHH - 0.3, SW + 0.12), [sm_, sm_, pl, pl, sm_, sm_]); scr.position.y = SY; tower0.add(scr); }
scene.add(tower0);
const TROT = -(TAIL_FIX + 0.02); tower0.rotation.y = TROT;                  // one face looks straight at the camera beside the back of the jam
const toW = q => [q[0] * Math.cos(TROT) + q[2] * Math.sin(TROT), q[1], -q[0] * Math.sin(TROT) + q[2] * Math.cos(TROT)];
const FACE = [0, 1, 2, 3].map(f => { const ph = f * Math.PI / 2, n = [Math.cos(ph), 0, Math.sin(ph)], rt = [Math.sin(ph), 0, -Math.cos(ph)]; return { n, rt }; });
const BASE = [14.7, 15.6, 15.15, 16.1, 15.75, 14.9, 15.3, 14.55];                 // the chart before the jam: a little up, a little down
const NSLOT = BASE.length + 6, SLOT = k => -5.7 + k * (11.4 / (NSLOT - 1));
const CANDLES = [];                                                         // per face: the boxes for every slot
for (const F of FACE) { const row = []; for (let k = 0; k < NSLOT; k++) { const mat = new THREE.MeshBasicMaterial({ color: 0x2FD27F, toneMapped: false }); const body = new THREE.Mesh(new THREE.BoxGeometry(0.74, 1, 0.74), mat), wick = new THREE.Mesh(new THREE.BoxGeometry(0.14, 1, 0.14), mat); tower0.add(body, wick);
    let fr = null; if (k === BASE.length + 3) { fr = new THREE.Mesh(new THREE.BoxGeometry(0.98, 1, 0.98), new THREE.MeshBasicMaterial({ color: 0xF7A600, toneMapped: false })); tower0.add(fr); }
    row.push({ body, wick, mat, fr }); } CANDLES.push(row); }
const facePos = (f, k, y) => { const F = FACE[f], x = SLOT(k), o = SW / 2 + 0.36; return [F.n[0] * o + F.rt[0] * x, y, F.n[2] * o + F.rt[2] * x]; };
const visFace = () => { const c = camera.position; let best = 0, bv = -9; FACE.forEach((F, f) => { const n = toW(F.n), v = (n[0] * c.x + n[2] * c.z) / Math.hypot(c.x, c.z); if (v > bv) { bv = v; best = f; } }); return best; };
const faceW = (f, k, y) => { const q = toW(facePos(f, k, y)); q[1] += tower0.position.y; return q; };
const SPARK = CH.map(() => { const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: GLOWTX, color: 0xFF5040, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0 })); sp.scale.setScalar(2.2); scene.add(sp); return sp; });
// the chain's candles: each one a bigger step down than the last
{ let close = BASE[BASE.length - 1]; const raw = CH.map((c, k) => 0.45 + 0.18 * k), f = Math.min(0.85, 4.25 / raw.reduce((a, b) => a + b, 0)); CH.forEach((c, k) => { c.open = close; close -= raw[k] * f; c.close = close; c.slot = BASE.length + k; }); }
// fifty pillars round the park: the fifty biggest days (a count, not their sizes)
const PIL = new THREE.InstancedMesh(new THREE.BoxGeometry(1.5, 1, 1.5).translate(0, 0.5, 0), new THREE.MeshLambertMaterial({ color: 0xFFFFFF }), 50); PIL.castShadow = true; scene.add(PIL);
const PILT = new THREE.InstancedMesh(new THREE.BoxGeometry(1.7, 0.5, 1.7), new THREE.MeshBasicMaterial({ color: 0xFFFFFF, toneMapped: false }), 50); scene.add(PILT);
const _m4 = new THREE.Matrix4(), _p = new THREE.Vector3(), _q = new THREE.Quaternion(), _s = new THREE.Vector3(), _c = new THREE.Color();
const PIL_TH = k => TH0 + 2.4 + k / 50 * Math.PI * 2, PIL_T = k => T.many + 0.15 + k * (T.days - T.many + 0.1) / 49;

// ───────────────────────── where things are at time t
const youAt = t => carS(YOU, t);
const youP = (t, dy = 0, ahead = 0) => P(youAt(t).th + ahead / RL, RL, dy);
// the back of the jam: where the cars of the candle chain brake (it creeps backwards round the ring)
const tailTh = t => { let best = null; for (const c of CH) { const s = carS(c.i, Math.max(t, c.tb)); if (c.tb <= t + 0.8) best = s.th; } return best ?? carS(CH[0].i, CH[0].tb).th; };

// ───────────────────────── camera path (spherical keys around a target; az/d/el may be functions of t)
const CAM = [
  { t: 0, tg: t => youP(t, 1.0, 3), d: 30, az: t => behindAz(youAt(t).th) - 14, el: 27, dn: 0 },                 // frame 0: behind you in the jam, the queue curving away to the right
  { t: 1.4, tg: t => youP(t, 1.0, 4), d: 28, az: t => behindAz(youAt(t).th) - 12, el: 25, dn: 0, mv: 1 },
  { t: 2.15, tg: t => youP(t, 1.0, 8), d: 30, az: t => behindAz(youAt(t).th) - 12, el: 30, dn: 1 },
  { t: 3.3, tg: t => youP(t, 0.5, 20), d: 34, az: t => behindAz(youAt(t).th + 0.35) - 30, el: 44, dn: 2, mv: 1 },     // "at the front, there's nothing": the end of the queue and the empty road
  { t: 3.95, tg: t => youP(t, 0.5, 21), d: 35, az: t => behindAz(youAt(t).th + 0.36) - 32, el: 45, dn: 2 },
  { t: T.same + 0.75, tg: [0, 10, 0], d: 66, az: outsideAz(TH0) - 28, el: 16, dn: 2, mv: 1 },     // one smooth swing (a faster one reads as a cut)                       // the turn: the price tower rises in the middle of the park
  { t: T.why - 0.1, tg: [0, 11, 0], d: 63, az: outsideAz(TH0) - 33, el: 16, dn: 2 },
  { t: T.why + 1.0, tg: [0, 0, 0], d: 300, az: outsideAz(TH0) - 45, el: 64, dn: 2, mv: 1 },                       // "here's why": up over the whole ring
  { t: T.n22 + 0.3, tg: [0, 0, 0], d: 290, az: outsideAz(TH0) - 55, el: 74, dn: 2 },
  { t: T.b5, tg: [0, 0, 0], d: 280, az: outsideAz(TH0) - 66, el: 76, dn: 2 },
  { t: T.anyway + 0.2, tg: t => P(tailSm(t) + 0.45, RL * 0.45, 0), d: 205, az: outsideAz(TH0) - 72, el: 68, dn: 2, mv: 1 },     // "a jam appeared anyway": closer, over the jam
  { t: T.b6 + 0.3, tg: t => P(tailSm(t) + 0.3, RL * 0.55, 0), d: 190, az: outsideAz(TH0) - 76, el: 64, dn: 2 },
  { t: T.harder + 0.2, tg: t => P(tailSm(t) + 0.03, 20, 8), d: 51, az: t => outsideAz(tailSm(t) + 0.03), el: 11.5, dn: -4, mv: 1 },     // down: the back of the jam in front, the tower behind
  { t: T.b8, tg: t => P(tailSm(t) + 0.02, 20, 8), d: 50, az: t => outsideAz(tailSm(t) + 0.02) + 2, el: 11.5, dn: -4 },
  { t: T.more + 0.45, tg: t => P(tailSm(t) + 0.02, 20, 8.3), d: 51, az: t => outsideAz(tailSm(t) + 0.02) + 3, el: 11.5, dn: -4 },
  { t: T.drop + 0.6, tg: [...P(TAIL_FIX, 8, 8)], d: 78, az: outsideAz(TAIL_FIX) - 12, el: 21, dn: 0, mv: 1 },       // rehook: the whole staircase on the tower, the jam under it
  { t: T.b10 + 0.2, tg: [...P(TAIL_FIX, 8, 8.5)], d: 82, az: outsideAz(TAIL_FIX) - 16, el: 23, dn: 0 },
  { t: T.many + 0.6, tg: [0, 4, 0], d: 205, az: outsideAz(TAIL_FIX) - 30, el: 50, dn: -3, mv: 1 },                       // fifty pillars round the park
  { t: T.b11 - 0.3, tg: [0, 4, 0], d: 195, az: outsideAz(TAIL_FIX) - 46, el: 54, dn: -3 },
  { t: T.b11 + 0.9, tg: t => youP(t, 1.3, 1), d: 16, az: t => behindAz(youAt(t).th) - 34, el: 19, dn: 7, mv: 1 },          // back down to you, sitting in it
  { t: T.but, tg: t => youP(t, 1.3, 1), d: 15, az: t => behindAz(youAt(t).th) - 42, el: 18, dn: 7 },
  { t: T.b12 - 0.2, tg: t => youP(t, 1.3, 1), d: 14.5, az: t => behindAz(youAt(t).th) - 48, el: 18, dn: 7 },
  { t: T.b12 + 1.6, tg: t => youP(t, 0, -8), d: 92, az: t => behindAz(youAt(t).th) - 36, el: 42, dn: 4, mv: 1 },             // dusk: the jam lets you go; the ring of lights
  { t: DUR + 0.4, tg: t => youP(t, 0, -14), d: 104, az: t => behindAz(youAt(t).th) - 28, el: 47, dn: 5 },
];
const val = (v, t) => typeof v === 'function' ? v(t) : v;
const camTg = new THREE.Vector3(); let camD = 30;
function setCamera(t) {
  let i = 0; while (i < CAM.length - 2 && t >= CAM[i + 1].t) i++;
  const a = CAM[i], b = CAM[i + 1]; let u = seg(t, a.t, b.t); if (b.mv === 1) u = eio(u); else if (b.mv === 2) u = u * u; else if (b.mv === 3) u = 1 - (1 - u) * (1 - u);
  const ta = val(a.tg, t), tb = val(b.tg, t), tg = [lerp(ta[0], tb[0], u), lerp(ta[1], tb[1], u), lerp(ta[2], tb[2], u)];
  let aza = val(a.az, t), azb = val(b.az, t); while (azb - aza > 180) azb -= 360; while (azb - aza < -180) azb += 360;
  const d = lerp(val(a.d, t), val(b.d, t), u), az = lerp(aza, azb, u) * Math.PI / 180, el = lerp(val(a.el, t), val(b.el, t), u) * Math.PI / 180;
  const dn = lerp(a.dn ?? 4, b.dn ?? 4, u) * Math.PI / 180, up = Math.sin(el) - Math.cos(el) * Math.tan(el - dn);
  const wob = [Math.sin(t * 0.9) * 0.008 * d, Math.sin(t * 1.3 + 1) * 0.005 * d];
  camera.position.set(tg[0] + d * Math.cos(el) * Math.sin(az) + wob[0] * Math.cos(az), Math.max(tg[1] + d * Math.sin(el) + wob[1], 1.4), tg[2] + d * Math.cos(el) * Math.cos(az) - wob[0] * Math.sin(az));
  camera.near = Math.max(0.5, Math.min(18, d * 0.06)); camera.updateProjectionMatrix();      // far views: a larger near plane, so the flat layers of the ground never z-fight
  camera.lookAt(tg[0], tg[1] + up * d, tg[2]); camera.updateMatrixWorld();
  camTg.set(tg[0], tg[1], tg[2]); camD = d;
}

// ───────────────────────── overlay (captions, chips, labels, the last card)
const ui = document.getElementById('ui'); const _v = new THREE.Vector3();
function proj(x, y, z) { _v.set(x, y, z).project(camera); return [(_v.x * 0.5 + 0.5) * W, (-_v.y * 0.5 + 0.5) * H, _v.z < 1]; }
function mk(cls, html = '') { const e = document.createElement('div'); e.className = 'abs ' + cls; e.innerHTML = html; e.style.opacity = 0; ui.appendChild(e); return e; }
function place(e, x, y, o = 1, sc = 1, ax = '-50%', ay = '-50%') { e.style.opacity = o.toFixed(3); if (o <= 0.001) return; e.style.transform = `translate(${x.toFixed(1)}px,${y.toFixed(1)}px) translate(${ax},${ay}) scale(${sc.toFixed(3)})`; }
const put = (e, x, y, o = 1, sc = 1, ax = '-50%', ay = '-50%') => place(e, x, y, o, sc, ax, ay);
const YMIN = 540;
const putW = (e, p, o, sc = 1, ymin = YMIN, ymax = 1540) => place(e, c01((p[0] - 150) / 780) * 780 + 150, Math.min(ymax, Math.max(ymin, p[1])), p[2] && p[0] > -30 && p[0] < 1110 ? o : 0, sc);   // hidden when its point is off screen
const pop = (t, t0, d = 0.32) => t < t0 ? 0 : 0.82 + 0.18 * back(seg(t, t0, t0 + d));
const chunks = [];
{
  let clause = []; let si = 0;
  const flush = () => { const n = clause.length; if (!n) return; const k = Math.ceil(n / 3); let i = 0; for (let c = 0; c < k; c++) { const size = Math.ceil((n - i) / (k - c)); chunks.push({ ws: clause.slice(i, i + size) }); i += size; } clause = []; };
  for (const w of TIM.words) { if (w.si !== si) { flush(); si = w.si; } clause.push(w); if (/[.,?!:]$/.test(w.t)) flush(); }
  flush();
  chunks.forEach(c => { c.s = c.ws[0].s - 0.07; c.e = c.ws[c.ws.length - 1].e; });
  chunks[0].s = -1;                                              // the first words are on the cover frame (OPEN text = captions)
  chunks.forEach((c, i) => { const nx = chunks[i + 1]; c.hide = nx ? Math.min(nx.s, c.e + 0.5) : c.e + 0.8; });
}
const capEl = document.getElementById('cap'); let capIdx = -2;
function updateCaption(t) {
  let idx = -1; for (let i = 0; i < chunks.length; i++) if (t >= chunks[i].s && t < chunks[i].hide) { idx = i; break; }
  if (idx !== capIdx) { capIdx = idx; capEl.innerHTML = idx < 0 ? '' : chunks[idx].ws.map(w => `<span class="w${w.kw ? ' kw' : ''}">${w.t.replace(/&/g, '&amp;')}</span>`).join(''); }
  if (idx < 0) return;
  const c = chunks[idx], spans = capEl.children, cover = idx === 0 && t < c.ws[0].s - 0.05;
  const rv = w => { const r = w.s - 0.05, j = Math.round(r / 8) * 8; return j > 0 && r > j - 1 / 30 && r <= j ? j - 1 / 30 - 0.001 : r; };   // a word that would pop on the first frame of an 8 s render segment pops one frame earlier (qa.py reads a pop there as a bad join)
  c.ws.forEach((w, i) => { const nx = c.ws[i + 1]; const st = cover ? 'cur' : t < rv(w) ? 'fut' : (nx && t >= rv(nx)) ? 'said' : 'cur'; const cl = 'w' + (w.kw ? ' kw' : '') + (st === 'cur' ? '' : ' ' + st); if (spans[i].className !== cl) spans[i].className = cl; });
}
const mark = l => l.replace(/\*([^*]+)\*/g, '<em>$1</em>');
const subChip = TIM.sub ? mk('chip', TIM.sub) : null;
const chip = mk('chip', ''), chipA = mk('chip am', 'same jam · when you trade');
const youTag = mk('tag am', 'you'), nothingTag = mk('tag grey', 'nothing here'), frontTag = mk('tag', 'the front');
const numTags = []; for (let i = 0; i < JAM.N; i++) numTags.push(mk(i === YOU ? 'tag am' : 'tag', ''));      // your number is amber
const NUM_ORDER0 = (() => { const th0 = youAt(T.n22).th; return [...Array(JAM.N).keys()].sort((a, b) => ((carS(a, T.n22).th - th0) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI) - ((carS(b, T.n22).th - th0) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI)); })();
const NUM_ORDER = NUM_ORDER0; NUM_ORDER.forEach((i, k) => { numTags[i].innerHTML = `<b>${k + 1}</b>`; });
const jamTag = mk('tag', 'jam'), clearTag = mk('tag grey', 'nothing in the way');
const chainTags = ['a little', 'a little more', 'harder'].map(s => mk('tag', s));
const sellTag = mk('tag am', 'you sell'), moreTag = mk('tag', 'dips <b>more</b>'), priceTag = mk('tag', 'price ↓');
const rehookChip = mk('chip am', 'it must be news');
const DAYS = mk('dots days', '<div class="t">the market’s <b>50</b> biggest days</div><div class="g">' + '<i></i>'.repeat(50) + '</div><div class="f">often: <b>no big news</b></div><div class="src">S&amp;P index, 1946–1987 · Cutler, Poterba &amp; Summers, 1989</div>');
const dDots = [...DAYS.querySelectorAll('.g i')], dF = DAYS.querySelector('.f'), dSrc = DAYS.querySelector('.src');
const minEl = mk('strip two m20', '<div class="rw"><span>20 minutes · in a jam nobody caused</span><div class="d">' + '<i></i>'.repeat(20) + '</div></div><div class="rw"><span>20 minutes · of red</span><div class="d">' + '<i></i>'.repeat(20) + '</div></div><div class="f">“someone <b>knows</b> something”</div>');
const mRows = [...minEl.querySelectorAll('.d')].map(d => [...d.children]), mF = minEl.querySelector('.f');
const LS = TIM.lesson, lcard = LS ? mk('lcard', `<div class="k">${LS.label || 'The lesson'}</div><div class="n"><span>${mark(LS.lines[0])}</span>\n<span>${mark(LS.lines[1] || '')}</span></div>` + (LS.use ? `<div class="u">${LS.use}</div>` : '')) : null, lUse = lcard ? lcard.querySelector('.u') : null, lL2 = lcard ? lcard.querySelectorAll('.n span')[1] : null;
function fitHook() {
  if (lcard) { const n = lcard.querySelector('.n'); if (n.scrollWidth > 812) n.style.fontSize = (80 * 812 / n.scrollWidth).toFixed(1) + 'px'; if (lUse && lUse.scrollWidth > 812) lUse.style.fontSize = (38 * 812 / lUse.scrollWidth).toFixed(1) + 'px'; }
  const f = document.getElementById('foot'); if (f.scrollWidth > 1010) f.style.fontSize = (18.5 * 1010 / f.scrollWidth).toFixed(2) + 'px';
}
const foot = document.getElementById('foot');
foot.textContent = 'Jam test: Sugiyama et al., New Journal of Physics, 2008 (22 cars, 230 m track). Biggest days: Cutler, Poterba & Summers, 1989.\nThe traffic on screen is a model of drivers following the car ahead. Not financial advice.';
const setTxt = (e, s) => { if (e.textContent !== s) e.textContent = s; };
const setCls = (e, c) => { if (e.className !== c) e.className = c; };

function updateUI(t) {
  updateCaption(t);
  foot.style.opacity = (0.9 * seg(t, 0.8, 1.4) * (1 - 0.5 * seg(t, T.maybe1, T.maybe1 + 0.4))).toFixed(3);
  if (subChip) put(subChip, W / 2, 472, win(t, -1, 2.7, 0.01, 0.3), 1);
  const y = youAt(t);
  // you, the front of the jam, the empty road
  putW(youTag, proj(...P(y.th - 0.6 / RL, RL, 2.25)), Math.max(win(t, -1, T.turn + 0.3, 0.01, 0.2), win(t, T.dip - 0.3, T.rehook + 0.2, 0.2, 0.2), win(t, T.b11 + 0.7, T.b12 + 0.6, 0.25, 0.3)), 1);
  putW(nothingTag, proj(...P(y.th + 21 / RL, RL, 0.6)), win(t, T.nothing, T.turn + 0.6, 0.15, 0.2), pop(t, T.nothing));
  // the turn: a chip as it is said
  put(chipA, W / 2, 472, win(t, T.same + 0.05, T.why - 0.1, 0.2, 0.2), pop(t, T.same + 0.05));
  // the test: 22 cars counted round the ring
  NUM_ORDER.forEach((i, k) => { const t0 = T.n22 + 0.02 + k * 0.035, s = carS(i, t); putW(numTags[i], proj(...P(s.th, RL, 3.2)), win(t, t0, T.b5 - 0.1, 0.08, 0.25), 0.8 * pop(t, t0, 0.2), 380, 1600); });
  let ct = '', co = 0, cp = 0;
  for (const [a, b, s] of [[T.test, T.speed - 0.15, 'the test · 22 cars · 230 m'], [T.speed - 0.1, T.b5 - 0.1, 'all told · one speed'], [T.blocked, T.jam2 - 0.1, 'no obstacle'], [T.jam2, T.b6 - 0.1, 'a jam anyway'], [T.b7 + 0.1, T.dip - 0.2, 'same thing · in prices'], [T.nobody - 0.1, T.many - 0.1, 'often · nobody knows']]) { const o = win(t, a, b, 0.2, 0.2); if (o > co) { co = o; ct = s; cp = pop(t, a); } }
  if (ct) setTxt(chip, ct); setCls(chip, ct === 'a jam anyway' || ct === 'same thing · in prices' ? 'abs chip am' : 'abs chip'); put(chip, W / 2, 472, co, cp);
  { const th = tailTh(t); putW(jamTag, proj(...P(th + 0.32, RL, 4.0)), win(t, T.jam2, T.b6 + 0.2, 0.2, 0.25), pop(t, T.jam2)); putW(clearTag, proj(...P(th + Math.PI, RL, 3.0)), win(t, T.blocked, T.jam2 + 0.2, 0.2, 0.25), pop(t, T.blocked)); }
  // the chain: each driver brakes a little harder than the one ahead; then the bars are candles: a price going down
  CH.forEach((C, k) => { if (k < 3) { const st = carS(C.i, t); putW(chainTags[k], proj(...P(st.th, RL, 3.4)), win(t, C.tb + 0.1, T.b8 - 0.1, 0.15, 0.25), pop(t, C.tb + 0.1)); } });
  { const vf = visFace(), cy = CH[kYou], cb = CH[kBehind], c0 = CH[0];
    putW(sellTag, proj(...faceW(vf, cy.slot, cy.close - 0.75)), win(t, T.sell - 0.05, T.rehook + 0.4, 0.15, 0.25), pop(t, T.sell - 0.05));
    putW(moreTag, proj(...faceW(vf, cb.slot, cb.close - 0.75)), win(t, T.more - 0.15, T.rehook + 0.4, 0.15, 0.25), pop(t, T.more - 0.15));
    putW(priceTag, proj(...faceW(vf, c0.slot, c0.open + 1.0)), win(t, T.prices - 0.1, T.dip - 0.1, 0.15, 0.2), pop(t, T.prices - 0.1)); }
  put(rehookChip, W / 2, 412, win(t, T.drop, T.b10 + 0.3, 0.18, 0.2), pop(t, T.drop));
  // the fifty biggest days
  { const o = win(t, T.many - 0.1, T.b11 - 0.1, 0.25, 0.3); dDots.forEach((e, k) => setCls(e, t >= PIL_T(k) ? 'h' : '')); dF.style.opacity = seg(t, T.news - 0.15, T.news + 0.15).toFixed(2); dSrc.style.opacity = seg(t, T.news + 0.2, T.news + 0.5).toFixed(2); put(DAYS, W / 2, 1240, o, pop(t, T.many - 0.1)); }
  // twenty minutes in a jam, twenty minutes of red
  { const o = win(t, T.twenty1 - 0.12, T.b12 - 0.2, 0.22, 0.25), n1 = Math.floor(c01((t - T.twenty1) / (T.caused + 0.3 - T.twenty1)) * 20.001), n2 = Math.floor(c01((t - T.twenty2) / (T.red + 0.2 - T.twenty2)) * 20.001);
    mRows[0].forEach((e, i) => setCls(e, i < n1 ? 'a' : '')); mRows[1].forEach((e, i) => setCls(e, i < n2 ? 'r' : '')); mF.style.opacity = seg(t, T.knows2 - 0.3, T.knows2).toFixed(2);
    place(minEl, W / 2, 760, o, pop(t, T.twenty1 - 0.12)); }
  if (lcard) { lL2.style.opacity = seg(t, T.maybe2, T.maybe2 + 0.3).toFixed(3); const u = seg(t, T.use, T.use + 0.35); lUse.style.opacity = u.toFixed(3); lUse.style.transform = `translateY(${((1 - eo(u)) * 16).toFixed(1)}px)`; put(lcard, W / 2, 1000, seg(t, T.maybe1, T.maybe1 + 0.3), pop(t, T.maybe1)); }
}

// ───────────────────────── one frame
function brakeOf(s) { return Math.max(c01(-s.a / 2.2), s.v < 0.4 ? 0.75 : 0); }
function renderAt(t) {
  const s = skyAt(t), night = s.glow;
  paintSky(s); scene.fog.color.setRGB(s.fog[0], s.fog[1], s.fog[2]);
  hemi.color.setRGB(...s.hemS); hemi.groundColor.setRGB(...s.hemG); hemi.intensity = s.hemI;
  sun.color.setRGB(...s.sunC); sun.intensity = s.sunI;
  const az = s.az * Math.PI / 180, el = s.el * Math.PI / 180, sd = [Math.cos(el) * Math.sin(az), Math.sin(el), Math.cos(el) * Math.cos(az)];
  starM.opacity = s.star * 0.9; stars.visible = s.star > 0.01; WIN_LIT.emissiveIntensity = Math.max(0, night * 1.05);
  HEADM.color.setRGB(lerp(0.85, 1, night), lerp(0.82, 0.97, night), lerp(0.7, 0.85, night));
  // beat 2: a red wave runs back down the queue (1.5 s), the brake lights flaring one after another
  const yTh = youAt(t).th;
  for (let i = 0; i < JAM.N; i++) {
    const st = carS(i, t), g = CARS[i], [x, , z] = P(st.th); g.position.set(x, 0.0, z); g.rotation.y = -(Math.PI / 2 + st.th);
    g.rotation.z = c01(-st.a / 6) * 0.025 - c01(st.a / 3) * 0.012;                                               // the nose dips under braking
    let br = brakeOf(st); const behind = ((yTh + 15 / RL - st.th) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI) * RL;        // metres behind a point just ahead of you
    const wave = t > T.beat2 - 0.1 && behind < 95 ? win(t, T.beat2 + behind / 55 - 0.05, T.beat2 + behind / 55 + 0.35, 0.06, 0.3) : 0;
    br = Math.max(br, wave); const tail = 0.18 + 0.42 * night;
    const k = Math.max(br, tail); g.userData.tm.color.setRGB(lerp(0.35, 1.0, k), lerp(0.05, 0.08 + 0.06 * br, k), lerp(0.05, 0.07, k));
    g.userData.glow.material.opacity = c01(br * (0.55 + 0.6 * night) + night * 0.25 + wave * 0.6); g.userData.glow.scale.set(3.0 + 1.6 * br, 1.9 + 0.8 * br, 1);
    const q = JAMQ[i]; q.visible = st.v < 2.2; q.position.set(x, 0.06, z); q.rotation.y = -(Math.PI / 2 + st.th);
  }
  JAMG.opacity = 0.55 * Math.max(win(t, T.why + 0.6, T.b6 + 1.2, 0.5, 0.6), 0.6 * win(t, T.many, T.b11, 0.5, 0.5));
  for (const o of OPP) { const th = oppAt(o, t), [x, , z] = P(th, RO); o.g.position.set(x, 0, z); o.g.rotation.y = Math.PI / 2 - th; o.g.userData.tm.color.setRGB(0.35 + 0.4 * night, 0.06, 0.05); o.g.userData.glow.material.opacity = night * 0.35; }
  { const [x, , z] = P(yTh); youRing.position.set(x, 0.09, z); youRing.scale.setScalar(1 + 0.06 * Math.sin(t * 5)); youRing.material.opacity = 0.9; YOU_MAT.emissiveIntensity = 0.1 + 0.45 * night; youLight.position.set(x, 4, z); youLight.intensity = 30 * night; }
  for (const p of PEOPLE) { const th = p.stand ? p.th0 : p.th0 + p.v * t / p.r, [x, , z] = P(th, p.r); p.m.position.set(x, p.stand ? 0 : Math.abs(Math.sin(t * 6.5 + p.ph)) * 0.06, z); p.m.rotation.y = p.stand ? -BUS_TH : (p.v > 0 ? -(Math.PI / 2 + th) : Math.PI / 2 - th); p.m.rotation.z = p.stand ? 0 : Math.sin(t * 6.5 + p.ph) * 0.04; }
  for (const sp of LAMP_GLOW) sp.material.opacity = 0.9 * night;
  // the price tower rises at the turn; the chart on its four faces; the chain's sparks and candles
  { const up = back(seg(t, T.same - 0.2, T.same + 0.7)); tower0.visible = t > T.same - 0.2; tower0.position.y = -(1 - up) * 18.5;
    const vf = tower0.visible ? visFace() : 0;
    for (let f = 0; f < 4; f++) {
      let open = 14.2; CANDLES[f].forEach((c, k) => {
        let close, t0, isChain = k >= BASE.length; if (!isChain) { close = BASE[k]; t0 = T.same + 0.5 + k * 0.1; } else { const C = CH[k - BASE.length]; if (!C) { c.body.visible = c.wick.visible = false; if (c.fr) c.fr.visible = false; return; } open = C.open; close = C.close; t0 = C.tb + 0.45; }
        const sc = t >= t0 ? back(seg(t, t0, t0 + 0.25)) : 0, h = Math.max(0.1, Math.abs(close - open)), [x, , z] = facePos(f, k, 0), y = (open + close) / 2;
        c.body.visible = c.wick.visible = sc > 0.01; c.mat.color.copy(close >= open ? GREEN : RED); c.body.position.set(x, y, z); c.body.scale.set(1, h * sc, 1); c.wick.position.set(x, y, z); c.wick.scale.set(1, (h + 0.55) * sc, 1);
        if (c.fr) { c.fr.visible = sc > 0.01; c.fr.position.set(x - FACE[f].n[0] * 0.08, y, z - FACE[f].n[2] * 0.08); c.fr.scale.set(1, h * sc + 0.3, 1); }
        open = close; }); }
    CH.forEach((C, k) => { const sp = SPARK[k], u = seg(t, C.tb, C.tb + 0.5); sp.visible = t > C.tb && t < C.tb + 0.62; if (!sp.visible) return; const st = carS(C.i, C.tb), a0 = P(st.th - 2.4 / RL, RL, 0.9), b0 = faceW(vf, C.slot, (C.open + C.close) / 2);
      const e = eio(u); sp.position.set(lerp(a0[0], b0[0], e), lerp(a0[1], b0[1], e) + Math.sin(Math.PI * u) * 7, lerp(a0[2], b0[2], e)); sp.material.opacity = 0.95 * (1 - seg(t, C.tb + 0.45, C.tb + 0.62)); sp.scale.setScalar(2.0 + 1.2 * Math.sin(Math.PI * u)); }); }
  // the fifty pillars
  { const sink = 1 - eio(seg(t, T.b11 - 0.3, T.b11 + 0.9)); for (let k = 0; k < 50; k++) { const th = PIL_TH(k), sc = t >= PIL_T(k) ? back(seg(t, PIL_T(k), PIL_T(k) + 0.35)) * sink : 0, hgt = 7.5 * sc, [x, , z] = P(th, 28.6);
      _p.set(x, 0, z); _s.set(sc > 0 ? 1 : 0, Math.max(0.001, hgt), sc > 0 ? 1 : 0); PIL.setMatrixAt(k, _m4.compose(_p, _q, _s)); _p.set(x, hgt + 0.25, z); _s.set(sc > 0 ? 1 : 0, sc > 0 ? 1 : 0, sc > 0 ? 1 : 0); PILT.setMatrixAt(k, _m4.compose(_p, _q, _s));
      PIL.setColorAt(k, _c.setRGB(0.95, 0.9, 0.81)); PILT.setColorAt(k, _c.setRGB(1, 0.66 + 0.1 * night, 0.1)); }
    PIL.instanceMatrix.needsUpdate = true; PILT.instanceMatrix.needsUpdate = true; PIL.instanceColor.needsUpdate = true; PILT.instanceColor.needsUpdate = true; PIL.visible = PILT.visible = t > T.many && t < T.b11 + 0.95; }

  setCamera(t);
  dome.position.copy(camera.position); stars.position.copy(camera.position);
  orb.position.set(camera.position.x + sd[0] * 2000, camera.position.y + sd[1] * 2000, camera.position.z + sd[2] * 2000); orb.scale.setScalar(s.orbS * 2.5); orb.lookAt(camera.position); orbM.color.setRGB(...s.orb);
  halo.position.copy(orb.position); halo.scale.setScalar(s.orbS * 16); halo.lookAt(camera.position); haloM.color.setRGB(...s.orb); haloM.opacity = 0.75;
  const S2 = Math.min(80, Math.max(22, camD * 0.85));                  // a tight shadow box: wide ones streak the grass
  sun.target.position.copy(camTg); sun.position.set(camTg.x + sd[0] * 400, camTg.y + sd[1] * 400, camTg.z + sd[2] * 400);
  const sc = sun.shadow.camera; sc.left = -S2; sc.right = S2; sc.top = S2; sc.bottom = -S2; sc.updateProjectionMatrix(); sun.shadow.bias = camD > 150 ? -0.002 : -0.0005; sun.shadow.normalBias = camD > 150 ? 0.9 : 0.3;
  renderer.render(scene, camera);
  updateUI(t);
}
window.camCheck = () => {
  const out = []; let cur = null;
  for (let f = 0; f < Math.ceil(DUR * 30); f++) {
    const t = f / 30; setCamera(t); const c = camera.position; let hit = null;
    for (const [x, z, r, h] of TOWERS) if (Math.hypot(c.x - x, c.z - z) < r + 1 && c.y < h + 1) { hit = 'building'; break; }
    for (const [th, r, h] of TREES) { const [x, , z] = P(th, r); if (Math.hypot(c.x - x, c.z - z) < 2.6 && c.y < h + 1.5) { hit = 'tree'; break; } }
    if (!hit && Math.hypot(c.x, c.z) < 10.5 && c.y < 18.5 && t > T.same) hit = 'tower';
    if (!hit && t > T.many && t < T.b11 + 0.9 && Math.abs(Math.hypot(c.x, c.z) - 28.6) < 1.8 && c.y < 8.6) hit = 'pillar';
    if (!hit) for (let i = 0; i < JAM.N; i++) { const [x, , z] = P(carS(i, t).th); if (Math.hypot(c.x - x, c.z - z) < 3.2 && c.y < 2.6) { hit = 'car ' + i; break; } }
    if (hit) { if (cur && cur[2] === hit && f - cur[1] <= 1) cur[1] = f; else { cur = [f, f, hit]; out.push(cur); } }
  }
  return out.map(([a, b, n]) => `${(a / 30).toFixed(2)}-${(b / 30).toFixed(2)}s ${n}`);
};
window.renderAt = renderAt;
const r3 = x => +x.toFixed(3);
// sound cues: when each car of the chain starts braking, the 22 count tags, the pillars, when you stop and go
const youStops = []; { let st = youAt(0).v < 1; for (let t = 0; t < DUR; t += 0.05) { const v = youAt(t).v; if (!st && v < 0.6) { youStops.push(r3(t)); st = true; } if (st && v > 1.5) st = false; } }
window.CUES = { T, DUR, open: OPEN, arm: 'N', chain: CH.map(c => [r3(c.tb), c.i === YOU ? 'you' : c.i === BEHIND ? 'behind' : 'car']), count: NUM_ORDER.map((i, k) => r3(T.n22 + 0.02 + k * 0.035)),
  pillars: [...Array(50).keys()].map(k => r3(PIL_T(k))), board: BASE.map((_, k) => r3(T.same + 0.5 + k * 0.1)), sparks: CH.map(c => [r3(c.tb), r3(c.tb + 0.45)]), youStops, sent: TIM.sentences.map(s => s.s) };
document.fonts.ready.then(() => Promise.all(['700 64px Figtree', '800 72px Figtree', '800 30px JBM', '800 118px JBM', '700 22px Inter', '500 18px Inter', '900 80px Fraunces', '700 38px Figtree', '700 30px Figtree', '600 34px Figtree'].map(f => document.fonts.load(f)))).then(() => { fitHook(); renderAt(0); window.__ready = true; });
