// Where Did the Money Go? — low-poly storybook scene (deterministic: window.renderAt(t) draws the frame for time t)
// 6 Oct – 20 Nov 2026: Nvidia loses about $2.7 trillion of market value. A company's value is its last price times every share:
// on Friday 20 Nov it fell 14% while under 3 in 100 of its shares changed hands. The trillions were a price, not a pile of cash.
import * as THREE from 'three';
import { SKIN, MAT, rng, GB, person, cloud, bushTree, tower, car, lamp, CHIP, WIN_LIT, CERT, CASH } from './kit.js';

// ───────────────────────── basics
const W = 1080, H = 1920, QP = new URLSearchParams(location.search);
const TIM = window.TIMING;
const S = i => TIM.sentences[i - 1].s, E = i => TIM.sentences[i - 1].e;
const strip = s => s.replace(/[.,?!:]/g, '').toLowerCase();
function wt(si, text, nth = 0) { const ws = TIM.words.filter(w => w.si === si && strip(w.t) === strip(text)); if (!ws[nth]) throw new Error('no word ' + si + ' ' + text); return ws[nth].s; }
const DUR = TIM.duration + 1.25; window.DUR = DUR;
const c01 = x => x < 0 ? 0 : x > 1 ? 1 : x, lerp = (a, b, u) => a + (b - a) * u;
const sm = (a, b, x) => { const u = c01((x - a) / (b - a)); return u * u * (3 - 2 * u); };
const eio = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2, eo = x => 1 - Math.pow(1 - x, 3);
const back = x => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };
const seg = (t, a, b) => c01((t - a) / (b - a));
const win = (t, a, b, fi = .25, fo = .25) => Math.min(seg(t, a, a + fi), 1 - seg(t, b, b + fo));
const R = rng(20261123);

// ───────────────────────── story clock (everything hangs off the narration)
const T = {
  hookEnd: TIM.big ? 1.5 : TIM.hook ? E(1) + 0.15 : 0,  // the hook card (script.py HOOK): 0-1.5 s when there is a big number, else until the hook sentence ends
  bigIn: TIM.big ? 1.5 : 0, bigOut: TIM.big ? 3.0 : 0,   // the big number (script.py BIG): 1.5-3 s (Keith, 22 Nov 2026)
  nobody: wt(1, 'nobody') - 0.1, spent: wt(1, 'spent') - 0.1, cent: wt(1, 'cent') - 0.1,
  b2: S(2) - 0.05, more: wt(2, 'more') - 0.1, whole: wt(2, 'whole') - 0.1, crypto: wt(2, 'crypto') - 0.1, worth: wt(2, 'worth') - 0.1,
  b3: S(3) - 0.05, where: wt(3, 'where') - 0.1, money3: wt(3, 'money') - 0.1, go: wt(3, 'go') - 0.1,
  b4: S(4) - 0.05, never: wt(4, 'never') - 0.1, cash4: wt(4, 'cash') - 0.1, value: wt(4, 'value') - 0.1, last: wt(4, 'last') - 0.1, times: wt(4, 'times') - 0.1, every: wt(4, 'every') - 0.1, share4: wt(4, 'share') - 0.1,
  b5: S(5) - 0.05, ten5: wt(5, 'ten') - 0.1, friends: wt(5, 'friends') - 0.1, share5: wt(5, 'share') - 0.1, hundred5: wt(5, 'hundred') - 0.1,
  b6: S(6) - 0.05, panics: wt(6, 'panics') - 0.1, sells: wt(6, 'sells') - 0.1, eighty6: wt(6, 'eighty') - 0.1,
  b7: S(7) - 0.05, all7: wt(7, 'all') - 0.1, marked: wt(7, 'marked') - 0.1, eighty7: wt(7, 'eighty') - 0.1, only: wt(7, 'only') - 0.1, one7: wt(7, 'one') - 0.1, sold7: wt(7, 'sold') - 0.1,
  b8: S(8) - 0.05, friday: wt(8, 'Friday') - 0.1, fell: wt(8, 'fell') - 0.1, p14: wt(8, '14%') - 0.1,
  b9: S(9) - 0.05, three: wt(9, 'three') - 0.1, hundred9: wt(9, 'hundred') - 0.1, shares9: wt(9, 'shares') - 0.1, sold9: wt(9, 'sold') - 0.1,
  b10: S(10) - 0.05, real: wt(10, 'real') - 0.1, those: wt(10, 'Those') - 0.1, bought: wt(10, 'bought') - 0.1, high: wt(10, 'high') - 0.1, low: wt(10, 'low') - 0.1,
  b11: S(11) - 0.05, whoever: wt(11, 'whoever') - 0.1, higher: wt(11, 'higher') - 0.1, price11: wt(11, 'price') - 0.1,
  b12: S(12) - 0.05, everyone: wt(12, 'Everyone') - 0.1, paper: wt(12, 'paper') - 0.1, grow: wt(12, 'grow') - 0.1, shrink: wt(12, 'shrink') - 0.1,
  b13: S(13) - 0.05, ended: wt(13, 'ended') - 0.1, half: wt(13, 'half') - 0.1, record: wt(13, 'record') - 0.1,
  b14: S(14) - 0.05, over: wt(14, 'over') - 0.1,
  b15: S(15) - 0.05, story: wt(15, 'story') - 0.15, wipe: wt(15, 'wipe-out') - 0.1, trillions: wt(15, 'trillions') - 0.1, price15: wt(15, 'price') - 0.1, pile: wt(15, 'pile') - 0.1,
  cta: S(16) - 0.1, would: wt(16, 'Would') - 0.1, comment: wt(16, 'Comment') - 0.15, sell: wt(16, 'SELL', 1) - 0.2, hold: wt(16, 'HOLD', 1) - 0.1,
};
T.sinkA = Math.max(T.bigOut + 0.05, T.nobody - 0.1); T.sinkB = T.cent + 0.55;        // the giant sinks to about half its height (−47.5%)
T.buyIn = T.b6 - 0.75; T.certA = T.sells + 0.05; T.cashA = T.eighty6 - 0.1;           // the sale: the buyer walks in, the share goes one way, the cash the other
T.flip = k => T.eighty7 - 0.2 + k * 0.05;                                              // all ten price tags turn to $80, one after another
T.earlyIn = T.b11 - 0.55;                                                              // the earlier seller walks in with the $100
T.postA = T.sell + 0.75; T.postB = T.hold + 0.7;
window.T = T;

// ───────────────────────── renderer, sky, light
const canvas = document.getElementById('gl');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: QP.get('aa') !== '0', preserveDrawingBuffer: true });
renderer.setPixelRatio(1); renderer.setSize(W, H, false);
renderer.toneMapping = THREE.NeutralToneMapping; renderer.toneMappingExposure = 1.0;
renderer.shadowMap.enabled = QP.get('sh') !== '0'; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
const scene = new THREE.Scene(); scene.fog = new THREE.Fog(0xffffff, 90, 640);
const camera = new THREE.PerspectiveCamera(35, W / H, 0.4, 2600);
const hemi = new THREE.HemisphereLight(0xffffff, 0x886644, 1.5); scene.add(hemi);
const sun = new THREE.DirectionalLight(0xffffff, 3); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); sun.shadow.bias = -0.0005; sun.shadow.normalBias = 0.3; sun.shadow.camera.near = 1; sun.shadow.camera.far = 900; scene.add(sun, sun.target);

const hx = h => { const c = new THREE.Color(h); return [c.r, c.g, c.b]; };
const P = (top, mid, hor, fog, sunC, sunI, hemS, hemG, hemI, star, glow, az, el, orb, orbS, fn, ff) => ({ top: hx(top), mid: hx(mid), hor: hx(hor), fog: hx(fog), sunC: hx(sunC), sunI, hemS: hx(hemS), hemG: hx(hemG), hemI, star, glow, az, el, orb: hx(orb), orbS, fn, ff });
const PRE = {
  NIGHT: P(0x070B24, 0x141C4B, 0x30326A, 0x22265A, 0xB4C2FF, 2.0, 0x5567C4, 0x3A3048, 1.5, 1, 1, -35, 42, 0xFFF4D6, 30, 80, 560),
  MORN: P(0x4E9FDC, 0x9FD0EA, 0xFBE6BC, 0xE6E4D6, 0xFFE2B0, 3.2, 0xBFDFFF, 0x9A9A80, 1.6, 0, 0, 55, 30, 0xFFF0C8, 40, 100, 680),
  DAY: P(0x2F8FDA, 0x86C6EE, 0xEAF0EE, 0xDCE6EA, 0xFFF1D6, 3.5, 0xCFE8FF, 0x9AA088, 1.7, 0, 0, 22, 52, 0xFFF8E0, 38, 110, 720),
  GOLDEN: P(0x3C7FCB, 0xF2C58A, 0xFFD79A, 0xF6CF9A, 0xFFC878, 3.2, 0xE8D2B0, 0xA88A60, 1.5, 0, 0.12, -68, 20, 0xFFE0A0, 44, 100, 680),
  SUNSET: P(0x2E2F72, 0xE0707A, 0xFFB25E, 0xEE9A6A, 0xFF9050, 2.9, 0xB49AC8, 0x86685A, 1.45, 0.12, 0.6, -70, 11, 0xFFB060, 50, 90, 620),
  DUSK: P(0x141A4C, 0x4A3F86, 0xC06A78, 0x6A4A78, 0x93A4F4, 1.7, 0x5A62B0, 0x3A2A40, 1.2, 0.65, 0.92, -40, 36, 0xFFF4D6, 30, 80, 600),
};
const SKY = [[0, 'MORN'], [T.b3, 'MORN'], [T.value, 'DAY'], [T.b5 + 0.2, 'DAY'], [T.ten5 + 1.2, 'GOLDEN'], [T.b13 - 0.2, 'GOLDEN'], [T.ended + 0.4, 'SUNSET'],
  [T.half + 0.2, 'SUNSET'], [T.record + 0.6, 'DUSK'], [T.b15, 'DUSK'], [T.story + 1.2, 'NIGHT'], [T.cta, 'NIGHT'], [T.cta + 1.4, 'DUSK'], [DUR + 2, 'DUSK']];
const sky = {};
function skyAt(t) {
  let i = 0; while (i < SKY.length - 2 && t >= SKY[i + 1][0]) i++;
  const a = PRE[SKY[i][1]], b = PRE[SKY[i + 1][1]], u = sm(SKY[i][0], SKY[i + 1][0], t);
  for (const k in a) sky[k] = Array.isArray(a[k]) ? [lerp(a[k][0], b[k][0], u), lerp(a[k][1], b[k][1], u), lerp(a[k][2], b[k][2], u)] : lerp(a[k], b[k], u);
  return sky;
}
const domeG = new THREE.SphereGeometry(2100, 24, 14); domeG.setAttribute('color', new THREE.Float32BufferAttribute(new Float32Array(domeG.attributes.position.count * 3), 3));
const dome = new THREE.Mesh(domeG, new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide, fog: false, depthWrite: false, toneMapped: false })); dome.renderOrder = -10; scene.add(dome);
function paintSky(s) {
  const p = domeG.attributes.position, c = domeG.attributes.color;
  for (let i = 0; i < p.count; i++) {
    const y = p.getY(i) / 2100; let r, g, b;
    if (y <= 0) { r = s.hor[0]; g = s.hor[1]; b = s.hor[2]; }
    else if (y < 0.25) { const u = y / 0.25; r = lerp(s.hor[0], s.mid[0], u); g = lerp(s.hor[1], s.mid[1], u); b = lerp(s.hor[2], s.mid[2], u); }
    else { const u = Math.min(1, (y - 0.25) / 0.6); r = lerp(s.mid[0], s.top[0], u); g = lerp(s.mid[1], s.top[1], u); b = lerp(s.mid[2], s.top[2], u); }
    c.setXYZ(i, r, g, b);
  }
  c.needsUpdate = true;
}
const starG = new THREE.BufferGeometry(); { const a = []; for (let i = 0; i < 800; i++) { const u = R(), th = R() * Math.PI * 2, y = 0.05 + 0.95 * u, r = Math.sqrt(1 - y * y); a.push(r * Math.cos(th) * 1900, y * 1900, r * Math.sin(th) * 1900); } starG.setAttribute('position', new THREE.Float32BufferAttribute(a, 3)); }
const starM = new THREE.PointsMaterial({ color: 0xffffff, size: 2.6, sizeAttenuation: false, transparent: true, fog: false, depthWrite: false, toneMapped: false });
const stars = new THREE.Points(starG, starM); scene.add(stars);
function radial(inner, outer) { const cv = document.createElement('canvas'); cv.width = cv.height = 128; const g = cv.getContext('2d'); const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, inner); gr.addColorStop(1, outer); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); const tx = new THREE.CanvasTexture(cv); tx.colorSpace = THREE.SRGBColorSpace; return tx; }
const orbM = new THREE.MeshBasicMaterial({ color: 0xffffff, fog: false, toneMapped: false, depthWrite: false });
const orb = new THREE.Mesh(new THREE.CircleGeometry(1, 28), orbM); scene.add(orb);
const haloM = new THREE.MeshBasicMaterial({ map: radial('rgba(255,255,255,0.55)', 'rgba(255,255,255,0)'), transparent: true, fog: false, toneMapped: false, depthWrite: false, blending: THREE.AdditiveBlending });
const halo = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), haloM); scene.add(halo);

// ───────────────────────── ground, avenues, plaza
const ground = new THREE.Mesh(new THREE.PlaneGeometry(1600, 1600).rotateX(-Math.PI / 2), new THREE.MeshLambertMaterial({ color: 0xC9C2AE })); ground.receiveShadow = true; scene.add(ground);
const flat = new GB();
flat.box(8, 0.04, 300, 0x4A4E56, 44, 0.02, -90); flat.box(8, 0.04, 300, 0x4A4E56, -44, 0.021, -90);           // two avenues north-south
flat.box(1400, 0.04, 8, 0x4A4E56, 0, 0.022, -112); flat.box(1400, 0.04, 8, 0x4A4E56, 0, 0.023, -6);           // two east-west
for (const z of [-112, -6]) for (let x = -690; x < 690; x += 6) flat.box(2.6, 0.05, 0.22, 0xF2EEE2, x, 0.045, z);
flat.box(66, 0.07, 44, 0xE6DFD0, 0, 0.035, -42);                                                             // the plaza
for (let i = 0; i < 12; i++) flat.box(66, 0.075, 0.12, 0xD6CEBC, 0, 0.037, -62 + i * 3.6);
flat.box(16, 0.08, 14, 0x7FA86A, -22, 0.04, -30); flat.box(16, 0.08, 14, 0x7FA86A, 22, 0.041, -30);           // lawns
flat.cyl(8.4, 8.4, 0.09, 28, 0xD8CDB6, 0.5, 0.045, -28.6); flat.cyl(7.9, 7.9, 0.1, 28, 0xEFE7D6, 0.5, 0.05, -28.6);   // the round stage where the ten friends stand
{ const rr = rng(909); for (let i = 0; i < 70; i++) { const x = (rr() - 0.5) * 520, z = -230 + rr() * 300; if (Math.abs(x) < 40 && z > -100 && z < 0) continue; flat.box(6 + rr() * 14, 0.06, 6 + rr() * 14, rr() < 0.5 ? 0x8DAE74 : 0x9DB884, x, 0.03, z); } }
const flatM = flat.mesh(); flatM.castShadow = false; scene.add(flatM);

// ───────────────────────── the city: one tower per company; the giant (Nvidia) at the head of the plaza
const TOWERS = [], stat = [];
const NV = [0, -84], SCR = [31, 28.5, -46], SCR_RY = -0.64;
const DEST = (x, z) => (Math.abs(x) < 38 && z < -14 && z > -100) || (Math.abs(x) < 56 && z > -20 && z < 90) || Math.hypot(x - SCR[0], z - SCR[2]) < 15 || Math.abs(z + 112) < 9 || Math.abs(z + 6) < 9 || Math.abs(Math.abs(x) - 44) < 9;
{
  const tr = rng(2026), PAL = [[0xD9D3C6, 0x5E7F9A], [0x6D97AA, 0x3F6A80], [0xE4DED2, 0x4E7C93], [0xC9C2B4, 0x55748C], [0x8FB3C2, 0x426E86], [0xEFE9DC, 0x6A8AA4], [0xB7C4C9, 0x3E6378], [0xE8D9C0, 0x5A7A90]];
  for (let gx = -176; gx <= 176; gx += 22) for (let gz = -240; gz <= 60; gz += 22) {
    const x = gx + (tr() - .5) * 7, z = gz + (tr() - .5) * 7; if (DEST(x, z) || tr() < 0.1) continue;
    const dp = Math.hypot(x, z + 50), far = dp > 110, w = 9 + tr() * 7, d = 9 + tr() * 7;
    const h = (dp < 70 ? 14 + tr() * 22 : 20 + tr() * (far ? 46 : 32)) * (Math.abs(x) > 130 ? 0.8 : 1);
    const pal = PAL[Math.floor(tr() * PAL.length)];
    const g = tower(w, h, d, { rand: tr, color: pal[0], glass: pal[1], floor: far ? 4.2 : 3.4, litP: 0.5, crown: h > 46 && tr() < 0.5 });
    g.position.set(x, 0, z); g.rotation.y = (tr() < 0.5 ? 0 : Math.PI / 2); g.children.forEach(c => { c.castShadow = dp < 130; c.receiveShadow = true; }); scene.add(g);
    TOWERS.push({ g, x, z, h, w: Math.max(w, d), dp }); stat.push([x - Math.max(w, d) / 2, x + Math.max(w, d) / 2, z - Math.max(w, d) / 2, z + Math.max(w, d) / 2, h + 4, 'tower', TOWERS.length - 1]);
  }
}
// the giant: a dark tower with a chip for a crown; it sinks into the ground as its value falls (to about half: −47.5%)
const NVH = 80, LOSS = 0.475;
const nvT = tower(22, NVH, 22, { rand: rng(4), color: 0x2E3440, glass: 0x4E8F86, frame: 0x4A5260, floor: 3.6, litP: 0.62, bare: true, lobby: true });
const nvG = new THREE.Group(); nvG.add(nvT); nvG.position.set(NV[0], 0, NV[1]); nvT.children.forEach(c => { c.castShadow = true; c.receiveShadow = true; }); scene.add(nvG);
const crown = new THREE.Mesh(CHIP, MAT); crown.scale.set(15, 9, 15); crown.position.set(0, NVH + 0.55, 0); crown.castShadow = true; nvG.add(crown);
stat.push([NV[0] - 12, NV[0] + 12, NV[1] - 12, NV[1] + 12, NVH + 6, 'giant']);
// its ghost: the missing top, drawn in amber lines where the tower used to reach
const ghost = new THREE.Group(); { const gh = NVH * LOSS + 2.6, gw = 23, bx = new THREE.BoxGeometry(gw, gh, gw);
  const fill = new THREE.Mesh(bx, new THREE.MeshBasicMaterial({ color: 0xFFC84A, transparent: true, opacity: 0.16, depthWrite: false, fog: false }));
  const eb = new GB(), th = 0.55, dash = 2.6, gap = 1.6;
  const run = (L, f) => { for (let a = -L / 2; a < L / 2; a += dash + gap) { const b = Math.min(L / 2, a + dash); f((a + b) / 2, b - a); } };
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) run(gh, (c, l) => eb.box(th, l, th, 0xFFFFFF, sx * gw / 2, c, sz * gw / 2));
  for (const sy of [-1, 1]) for (const s2 of [-1, 1]) { run(gw, (c, l) => eb.box(l, th, th, 0xFFFFFF, c, sy * gh / 2, s2 * gw / 2)); run(gw, (c, l) => eb.box(th, th, l, 0xFFFFFF, s2 * gw / 2, sy * gh / 2, c)); }
  const edges = new THREE.Mesh(eb.geo(), new THREE.MeshBasicMaterial({ color: 0xFFC84A, transparent: true, opacity: 0.9, fog: false, toneMapped: false }));
  ghost.add(fill, edges); ghost.position.set(NV[0], NVH * (1 - LOSS) + gh / 2, NV[1]); ghost.userData = { fill, edges }; ghost.visible = false; scene.add(ghost); }
// the price screen on its pylon
const pylon = new THREE.Group(); { const b = new GB(); b.box(4.6, 40, 3.6, 0x3A4048, 0, 20, -2.6); b.box(13.2, 14.8, 1.2, 0x23272E, 0, SCR[1], 0.3); b.box(13.8, 0.5, 1.6, 0x8A8F96, 0, SCR[1] + 7.6, 0.3); b.box(13.8, 0.5, 1.6, 0x8A8F96, 0, SCR[1] - 7.6, 0.3); b.box(5.6, 1.2, 4.6, 0x8A8F96, 0, 0.6, -2.6); pylon.add(b.mesh()); }
pylon.position.set(SCR[0], 0, SCR[2]); pylon.rotation.y = SCR_RY; scene.add(pylon);
const scrCv = document.createElement('canvas'); scrCv.width = 720; scrCv.height = 810; const scrTx = new THREE.CanvasTexture(scrCv); scrTx.colorSpace = THREE.SRGBColorSpace; scrTx.anisotropy = 4;
const screen = new THREE.Mesh(new THREE.PlaneGeometry(12.4, 13.95), new THREE.MeshBasicMaterial({ map: scrTx, toneMapped: false })); screen.position.set(0, SCR[1], 0.95); pylon.add(screen);
stat.push([SCR[0] - 7, SCR[0] + 7, SCR[2] - 6, SCR[2] + 6, 41, 'screen']);
// street life: lamps, trees, cars, people on the plaza
const lampHeads = new GB();
for (const z of [-24, -40, -56]) for (const s of [-1, 1]) { const l = lamp(6.2); l.position.set(s * 34, 0, z); l.rotation.y = s > 0 ? Math.PI : 0; scene.add(l); lampHeads.box(0.6, 0.12, 0.36, 0xFFFFFF, s * 34 - s * 1.25, 6.02, z); }
const lampM = new THREE.MeshLambertMaterial({ color: 0xFFF1C8, emissive: 0xFFD27A, emissiveIntensity: 0 }); scene.add(new THREE.Mesh(lampHeads.geo(), lampM));
for (const [x, z] of [[-40, 6], [36, 10], [-20, 28], [22, 40], [-48, 46], [46, 58], [-8, 62], [10, 20], [-16, -16], [27, -24], [27, -60], [17, -17], [-30, -62], [24, -66], [-52, -14], [54, -16], [62, -32], [-62, -24]]) { const m = bushTree(5.5 + R() * 2, R); m.position.set(x, 0, z); scene.add(m); }
const CARS = [[0xC8423A, -108.5, 1, 8, 0], [0x2F6FB8, -115.5, -1, 9, 40], [0xE9C46A, -2.5, 1, 7, 150], [0x4C9A62, -9.5, -1, 8, 230], [0xEDEDED, -108.5, 1, 8.6, 300], [0x7A4FA0, -9.5, -1, 7, 90], [0xD9664A, -2.5, 1, 9, 420]].map(([col, z, dir, v, off]) => { const m = car(col, { boxy: true }); scene.add(m); return { m, z, dir, v, off }; });
const modern = (i, extra = {}) => ({ robe: [0x34405A, 0x6A2E3E, 0x3F6A5A, 0x5A5A66, 0x7A5A3A, 0x2F4A6A, 0x8A3A3A, 0x3B6FA8, 0xB0603A, 0x4E7A3E][i % 10], skin: SKIN[i % 5], short: [0x231C18, 0x5A3E28, 0xC9A27A, 0x3A2A1E, 0x8A8A8A][i % 5], shirt: i % 2 ? 0xF4F2EC : undefined, ...extra });
const WALK = [[-24, -50, 14, -6], [10, -58, -12, 4], [-8, -54, 10, -6], [20, -48, -14, -5], [-28, -60, 12, 6], [4, -62, -10, 3]].map(([x, z, dx, dz], i) => { const m = person(modern(i, { badge: i % 3 === 0 })); scene.add(m); return { m, a: [x, z], b: [x + dx, z + dz], sp: 0.06 + i * 0.011, ph: i * 0.27 }; });
const watchers = [[-6, -66], [-2, -67.5], [3, -66.5], [7, -67], [-9, -64.5]].map(([x, z], i) => { const m = person(modern(i + 2)); m.position.set(x, 0, z); m.rotation.y = -Math.PI / 2 - 0.3 + i * 0.15; scene.add(m); return m; });

// ───────────────────────── the ten friends on the round stage (an example): one share each, a price tag above every share
const FR = [[-3.2, -27], [-1.6, -27], [0, -27], [1.6, -27], [3.2, -27], [-2.4, -29.6], [-0.8, -29.6], [0.8, -29.6], [2.4, -29.6], [4.0, -29.6]];
const PK = 3;                                                     // the one who panics (front row, right of centre)
const friends = FR.map(([x, z], i) => { const m = person(modern(i + 3, { s: 1.05 })); m.position.set(x, 0, z); m.rotation.y = -Math.PI / 2; m.visible = false; scene.add(m); return m; });
const buyer = person(modern(11, { robe: 0x2B2F3A, shirt: 0xF4F2EC, tie: 0xC8423A, s: 1.05 })); buyer.visible = false; scene.add(buyer);
const BUY0 = [10.5, -25.2], BUY1 = [2.8, -25.6];
const early = person(modern(13, { robe: 0x6A4A2A, shirt: 0xF4F2EC, s: 1.05 })); early.visible = false; scene.add(early);
const EAR0 = [-12.5, -24.6], EAR1 = [-4.3, -25.0];
const certs = FR.map(() => { const m = new THREE.Mesh(CERT, MAT); m.rotation.x = Math.PI / 2; m.scale.setScalar(0.62); m.castShadow = true; m.visible = false; scene.add(m); return m; });
const cashB = new THREE.Mesh(CASH, MAT); cashB.scale.setScalar(0.62); cashB.castShadow = true; cashB.visible = false; scene.add(cashB);   // the $80 the buyer pays
const cashE = new THREE.Mesh(CASH, MAT); cashE.scale.setScalar(0.72); cashE.castShadow = true; cashE.visible = false; scene.add(cashE);   // the $100 the earlier seller was paid
const CERT_Y = 1.02;
const ringM = [0, 1].map(() => new THREE.MeshBasicMaterial({ color: 0xFFC84A, transparent: true, opacity: 0, depthWrite: false, toneMapped: false }));
const rings = ringM.map(m => { const r = new THREE.Mesh(new THREE.RingGeometry(0.72, 0.95, 32).rotateX(-Math.PI / 2), m); r.position.y = 0.12; r.renderOrder = 2; scene.add(r); return r; });
stat.push([-5.5, 5.5, -31, -25, 3.6, 'friends']);
// where each share is at time t (the sold one moves from the seller to the buyer)
const buyerAt = t => { const u = eio(seg(t, T.buyIn, T.sells - 0.05)); return [lerp(BUY0[0], BUY1[0], u), lerp(BUY0[1], BUY1[1], u), u > 0 && u < 1]; };
const earlyAt = t => { const u = eio(seg(t, T.earlyIn, T.whoever + 0.15)); return [lerp(EAR0[0], EAR1[0], u), lerp(EAR0[1], EAR1[1], u), u > 0 && u < 1]; };
function certPos(i, t) {
  const bob = Math.sin(t * 2.2 + i * 1.3) * 0.03;
  if (i !== PK) return [FR[i][0], CERT_Y + bob, FR[i][1] + 0.5];
  const u = eo(seg(t, T.certA, T.certA + 0.55)), b = buyerAt(t);
  return [lerp(FR[i][0], b[0] - 0.1, u), CERT_Y + bob + Math.sin(u * Math.PI) * 1.1, lerp(FR[i][1] + 0.5, b[1] + 0.5, u)];
}
const friendsOn = t => t > T.b5 - 0.2 && t < T.b13 + 0.5;
const friendIn = (i, t) => back(seg(t, T.friends - 0.2 + i * 0.06, T.friends + 0.15 + i * 0.06));

// ───────────────────────── sky clutter: clouds, birds, sparkles
const clouds = []; for (let i = 0; i < 18; i++) { const m = cloud(R); const far = i >= 10; m.position.set(far ? -500 + R() * 1000 : -260 + i * 52 + R() * 20, 70 + R() * 40, far ? -560 + R() * 200 : -340 + R() * 300); m.scale.setScalar(2.0 + R() * 2.2); m.userData.x0 = m.position.x; scene.add(m); clouds.push(m); }
const birdMat = new THREE.MeshBasicMaterial({ color: 0x2A2430, side: THREE.DoubleSide });
const wingG = new THREE.BufferGeometry(); wingG.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0.1, 1.6, 0, -0.3, 1.5, 0, 0.5], 3));
const FLOCK = [{ t0: 0, t1: T.b3 + 0.5, a: [-60, 34, -40], b: [40, 42, -90] }, { t0: T.b5, t1: T.b8, a: [-30, 16, -50], b: [30, 20, -40] }];
const birds = []; for (let i = 0; i < 9; i++) { const g = new THREE.Group(), l = new THREE.Mesh(wingG, birdMat), r = new THREE.Mesh(wingG, birdMat); r.scale.x = -1; g.add(l, r); g.userData = { l, r, ph: R() * 6 }; g.visible = false; g.scale.setScalar(1.1); scene.add(g); birds.push(g); }
function updateBirds(t) {
  const f = FLOCK.find(f => t >= f.t0 && t <= f.t1); for (const b of birds) b.visible = !!f; if (!f) return;
  const u = seg(t, f.t0, f.t1), dx = f.b[0] - f.a[0], dz = f.b[2] - f.a[2], L = Math.hypot(dx, dz), ux = dx / L, uz = dz / L;
  birds.forEach((b, i) => { const row = Math.ceil(i / 2), sd = i % 2 ? 1 : -1; b.position.set(lerp(f.a[0], f.b[0], u) - ux * row * 2.4 + uz * sd * row * 1.7, lerp(f.a[1], f.b[1], u) + Math.sin(t * 2 + b.userData.ph) * 0.5, lerp(f.a[2], f.b[2], u) - uz * row * 2.4 - ux * sd * row * 1.7); b.rotation.y = Math.atan2(ux, uz); const fl = Math.sin(t * 10 + b.userData.ph) * 0.65; b.userData.l.rotation.z = fl; b.userData.r.rotation.z = -fl; });
}
const sparkT = (() => { const cv = document.createElement('canvas'); cv.width = cv.height = 64; const g = cv.getContext('2d'); g.translate(32, 32); g.fillStyle = '#fff'; for (let k = 0; k < 2; k++) { g.rotate(Math.PI / 2 * k); g.beginPath(); g.moveTo(0, -30); g.quadraticCurveTo(3, -3, 30, 0); g.quadraticCurveTo(3, 3, 0, 30); g.quadraticCurveTo(-3, 3, -30, 0); g.quadraticCurveTo(-3, -3, 0, -30); g.fill(); } const tx = new THREE.CanvasTexture(cv); tx.colorSpace = THREE.SRGBColorSpace; return tx; })();
const sparks = []; for (let i = 0; i < 80; i++) { const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: sparkT, color: 0xFFE9A8, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false })); sp.userData = { ph: R() * 6.28, w: 3 + R() * 4, dx: (R() - 0.5) * 2, dz: (R() - 0.5) * 2, k: R() }; scene.add(sp); sparks.push(sp); }

// ───────────────────────── the price screen: one canvas, redrawn only when what it shows changes
const F = (w, px, fam) => `${w} ${px}px ${fam}`;
let scrKey = '';
function scrMode(t) {
  if (t > T.b4 - 0.3 && t < T.b5 + 0.6) return ['value', seg(t, T.never - 0.1, T.never + 0.4) * (1 - seg(t, T.value - 0.3, T.value)), seg(t, T.last - 0.1, T.last + 0.3) + seg(t, T.times - 0.1, T.times + 0.3) + seg(t, T.share4 - 0.15, T.share4 + 0.3)];
  if (t > T.b8 - 0.5 && t < T.b10) return ['friday', seg(t, T.fell - 0.3, T.p14 + 0.4), seg(t, T.p14 - 0.1, T.p14 + 0.2)];
  if (t > T.b13 - 0.5 && t < T.b15 + 0.5) return ['today', seg(t, T.ended - 0.2, T.half + 0.2), seg(t, T.half - 0.1, T.half + 0.3)];
  if (t > T.cta) return ['cta', seg(t, T.would, T.would + 0.6), 0];
  return ['drop', c01(t / 1.4), 0];
}
function drawScreen(t) {
  const [mode, a, b] = scrMode(t), q = 30, key = mode + Math.round(a * q) + '_' + Math.round(b * q);
  if (key === scrKey) return; scrKey = key;
  const g = scrCv.getContext('2d'), w = 720, h = 810;
  g.fillStyle = '#0B1020'; g.fillRect(0, 0, w, h);
  g.strokeStyle = 'rgba(255,255,255,0.07)'; g.lineWidth = 2; for (let i = 1; i < 8; i++) { g.beginPath(); g.moveTo(0, i * h / 8); g.lineTo(w, i * h / 8); g.stroke(); }
  g.textAlign = 'center'; g.textBaseline = 'middle';
  const line = (pts, col, wd = 14) => { g.strokeStyle = col; g.lineWidth = wd; g.lineJoin = 'round'; g.lineCap = 'round'; g.beginPath(); pts.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.stroke(); };
  const partial = (pts, u) => { const out = [pts[0]]; const n = pts.length - 1, k = Math.min(n - 1, Math.floor(u * n)), v = u * n - k; for (let i = 1; i <= k; i++) out.push(pts[i]); const A = pts[k], B = pts[k + 1]; out.push([lerp(A[0], B[0], v), lerp(A[1], B[1], v)]); return out; };
  const SLIDE = [[60, 200], [150, 215], [230, 300], [300, 280], [380, 380], [460, 430], [540, 420], [620, 520], [670, 600]];
  if (mode === 'drop') {
    g.fillStyle = '#FFD27A'; g.font = F(800, 42, 'Inter'); g.fillText('NVDA · 6 OCT → 20 NOV', 360, 60);
    line(partial(SLIDE, lerp(0.25, 1, eo(a))), '#FF6B5B', 16);
    g.fillStyle = '#FF6B5B'; g.font = F(900, 110, 'JBM'); g.fillText('−47.5%', 360, 710);
  } else if (mode === 'value') {
    g.fillStyle = '#FFD27A'; g.font = F(800, 38, 'Inter'); g.fillText('NVDA · CLOSE 20 NOV 2026', 360, 56);
    if (b < 0.05) { g.globalAlpha = 0.3 + 0.7 * a; g.font = F(900, 120, 'Figtree'); g.fillStyle = '#FFFFFF'; g.fillText('NOT', 360, 330); g.fillText('CASH', 360, 470); if (a > 0.5) { line([[150, 560], [570, 240]], '#FF6B5B', 18); } g.globalAlpha = 1; }
    else {
      const r1 = c01(b), r2 = c01(b - 1), r3 = c01(b - 2);
      g.globalAlpha = r1; g.fillStyle = 'rgba(255,255,255,0.75)'; g.font = F(700, 34, 'Inter'); g.fillText('LAST PRICE', 360, 150); g.fillStyle = '#FFFFFF'; g.font = F(900, 100, 'JBM'); g.fillText('$125.53', 360, 240);
      g.globalAlpha = r2; g.fillStyle = '#FFC84A'; g.font = F(900, 70, 'JBM'); g.fillText('× 24.1 BN', 360, 380); g.fillStyle = 'rgba(255,255,255,0.75)'; g.font = F(700, 34, 'Inter'); g.fillText('SHARES', 360, 445);
      g.globalAlpha = r3; g.fillStyle = 'rgba(255,255,255,0.25)'; g.fillRect(80, 505, 560, 4); g.fillStyle = '#FFFFFF'; g.font = F(900, 96, 'JBM'); g.fillText('= $3.0 T', 360, 600); g.fillStyle = 'rgba(255,255,255,0.75)'; g.font = F(700, 30, 'Inter'); g.fillText('MARKET VALUE · NOT CASH', 360, 690);
      g.globalAlpha = 1;
    }
  } else if (mode === 'friday') {
    g.fillStyle = '#FFD27A'; g.font = F(800, 40, 'Inter'); g.fillText('NVDA · FRI 20 NOV 2026', 360, 56);
    const pts = [[60, 230], [170, 222], [270, 240], [360, 300], [450, 420], [560, 480], [660, 560]]; line(partial(pts, lerp(0.2, 1, eo(a))), a > 0.35 ? '#FF6B5B' : '#F7B500', 16);
    g.font = F(900, 128, 'JBM'); g.fillStyle = b > 0.3 ? '#FF6B5B' : 'rgba(255,255,255,0.15)'; g.fillText('▼14%', 360, 680);
    g.fillStyle = 'rgba(255,255,255,0.7)'; g.font = F(700, 32, 'Inter'); g.fillText('$145.98 → $125.53 · CLOSE', 360, 770);
  } else if (mode === 'today') {
    g.fillStyle = '#FFD27A'; g.font = F(800, 40, 'Inter'); g.fillText('NVDA · RECORD → NOW', 360, 56);
    g.strokeStyle = 'rgba(255,255,255,0.5)'; g.setLineDash([12, 12]); g.lineWidth = 4; g.beginPath(); g.moveTo(60, 190); g.lineTo(670, 190); g.stroke(); g.setLineDash([]);
    line(partial(SLIDE.map(([x, y]) => [x, y - 10]), lerp(0.05, 1, eo(a))), '#FF6B5B', 14);
    g.fillStyle = 'rgba(255,255,255,0.8)'; g.font = F(700, 28, 'Inter'); g.textAlign = 'left'; g.fillText('RECORD $239.24 · 6 OCT', 60, 150); g.textAlign = 'right'; if (a > 0.85) g.fillText('$125.53 · 20 NOV', 670, 650); g.textAlign = 'center';
    if (b > 0.3) { g.fillStyle = '#FF6B5B'; g.font = F(900, 110, 'JBM'); g.fillText('−47.5%', 330, 450); }
    g.fillStyle = 'rgba(255,255,255,0.75)'; g.font = F(700, 30, 'Inter'); g.fillText('AS OF 20 NOV 2026', 360, 760);
  } else if (mode === 'cta') {
    g.font = F(900, 150, 'Figtree'); g.fillStyle = '#F7B500'; g.fillText('SELL', 360, 220); g.fillStyle = '#6FD0C0'; g.fillText('HOLD', 360, 560);
    g.fillStyle = '#FFFFFF'; g.font = F(800, 60, 'Inter'); g.fillText('or', 360, 390); g.font = F(700, 38, 'Inter'); g.fillStyle = 'rgba(255,255,255,0.8)'; g.fillText('YOU DECIDE', 360, 720);
  }
  scrTx.needsUpdate = true;
}

// ───────────────────────── camera path (spherical keys around a target; `up` tilts the view so the subject sits lower in the frame)
const SCRF = (dx = 0, dy = 0) => [SCR[0] + dx, SCR[1] + dy, SCR[2]];
const ST = [0.4, 1.0, -28.3];                                    // the round stage
const CAM = [
  { t: 0, tg: [2, 30, -62], d: 215, az: -10, el: 15, up: 0.04 },                                    // the cover: the giant at the head of the plaza
  { t: T.bigOut, tg: [2, 32, -66], d: 196, az: -6, el: 14, up: 0.04, mv: 1 },
  { t: T.cent + 0.6, tg: [0, 30, NV[1]], d: 160, az: 4, el: 9, up: 0.05, mv: 1 },                    // the giant sinks to half its height
  { t: T.worth + 0.2, tg: [0, 32, NV[1]], d: 150, az: 10, el: 9, up: 0.05, mv: 1 },
  { t: T.go + 0.3, tg: [0, 56, NV[1]], d: 132, az: 15, el: 13, up: 0.06, mv: 1 },                    // where did it go? the ghost of the missing half
  { t: T.cash4 + 0.25, tg: [0, 55, NV[1]], d: 128, az: 19, el: 13, up: 0.06 },
  { t: T.value + 0.3, tg: SCRF(0, -0.8), d: 48, az: -30, el: 5, up: 0.04, mv: 1 },                  // the screen: last price × every share
  { t: T.share4 + 0.15, tg: SCRF(0, -0.8), d: 45, az: -35, el: 5, up: 0.04 },
  { t: T.share4 + 0.72, tg: [24, 170, -42], d: 40, az: -24, el: -42, up: 0, mv: 1 },                // sky wipe → the plaza
  { t: T.share4 + 1.0, tg: [1, 110, -10], d: 40, az: -2, el: -25, up: 0, mv: 1 },
  { t: T.friends + 0.95, tg: ST, d: 24, az: 0, el: 20, up: 0.03, mv: 1 },                              // down to the plaza: ten friends
  { t: T.hundred5 + 0.3, tg: ST, d: 23, az: -3, el: 20, up: 0.03 },
  { t: T.sells, tg: [2.1, 1.1, -26.4], d: 13.5, az: 8, el: 15, up: 0.03, mv: 1 },                    // the sale
  { t: T.eighty6 + 0.45, tg: [2.1, 1.1, -26.4], d: 13, az: 12, el: 15, up: 0.03 },
  { t: T.marked + 0.1, tg: ST, d: 23.5, az: 3, el: 20, up: 0.03, mv: 1 },                           // all ten repriced
  { t: T.sold7 + 0.45, tg: ST, d: 22.5, az: 0, el: 20, up: 0.03 },
  { t: T.friday + 0.45, tg: SCRF(0, -0.8), d: 52, az: -26, el: 6, up: 0.04, mv: 1 },                // up to the screen: Friday −14%
  { t: T.p14 + 0.5, tg: SCRF(0, -0.8), d: 47, az: -32, el: 6, up: 0.04, mv: 1 },
  { t: T.sold9 + 0.3, tg: SCRF(0, -0.8), d: 45, az: -36, el: 6, up: 0.04 },
  { t: T.real + 0.3, tg: [1.7, 1.1, -26.4], d: 13.5, az: 4, el: 15, up: 0.03, mv: 1 },               // back down: the one who sold low
  { t: T.low + 0.3, tg: [1.7, 1.1, -26.4], d: 13, az: 8, el: 15, up: 0.03 },
  { t: T.whoever + 0.25, tg: [-1.3, 1.1, -26.0], d: 22, az: -6, el: 16, up: 0.03, mv: 1 },          // the earlier seller, with the $100
  { t: T.price11 + 0.3, tg: [-1.4, 1.1, -26.0], d: 21.5, az: -9, el: 16, up: 0.03 },
  { t: T.paper, tg: ST, d: 24, az: -4, el: 20, up: 0.03, mv: 1 },                                     // everyone else: a paper loss
  { t: T.shrink + 0.4, tg: ST, d: 23, az: 2, el: 20, up: 0.03 },
  { t: T.ended + 0.25, tg: SCRF(0, -0.8), d: 50, az: -30, el: 6, up: 0.04, mv: 1 },                 // dusk: almost half below the record
  { t: T.over + 0.3, tg: SCRF(0, -0.8), d: 46, az: -36, el: 6, up: 0.04 },
  { t: T.story + 0.9, tg: [0, 22, -64], d: 300, az: 20, el: 22, up: 0.16, mv: 3 },                  // crane up over the city at night
  { t: T.cta + 0.1, tg: [0, 20, -60], d: 285, az: 14, el: 22, up: 0.16 },
  { t: T.comment, tg: SCRF(0, -1.0), d: 62, az: -26, el: 9, up: 0.0, mv: 1 },                       // the screen: sell or hold
  { t: DUR + 0.5, tg: SCRF(0, -1.0), d: 58, az: -30, el: 9, up: 0.0 },
];
const tgOf = (k, t) => typeof k.tg === 'function' ? k.tg(t) : k.tg;
const camTg = new THREE.Vector3(); let camD = 30;
function setCamera(t) {
  let i = 0; while (i < CAM.length - 2 && t >= CAM[i + 1].t) i++;
  const a = CAM[i], b = CAM[i + 1]; let u = seg(t, a.t, b.t); if (b.mv === 1) u = eio(u); else if (b.mv === 2) u = u * u; else if (b.mv === 3) u = 1 - (1 - u) * (1 - u);
  const ta = tgOf(a, t), tb = tgOf(b, t), tg = [lerp(ta[0], tb[0], u), lerp(ta[1], tb[1], u), lerp(ta[2], tb[2], u)];
  const d = lerp(a.d, b.d, u), az = lerp(a.az, b.az, u) * Math.PI / 180, el = lerp(a.el, b.el, u) * Math.PI / 180, up = lerp(a.up ?? 0.07, b.up ?? 0.07, u);
  const wob = [Math.sin(t * 0.9) * 0.012 * d, Math.sin(t * 1.3 + 1) * 0.008 * d];
  const cx = tg[0] + d * Math.cos(el) * Math.sin(az) + wob[0] * Math.cos(az), cz = tg[2] + d * Math.cos(el) * Math.cos(az) - wob[0] * Math.sin(az);
  camera.position.set(cx, Math.max(tg[1] + d * Math.sin(el) + wob[1], 1.4), cz);
  camera.lookAt(tg[0], tg[1] + up * d, tg[2]); camera.updateMatrixWorld();
  camTg.set(tg[0], tg[1], tg[2]); camD = d;
}

// ───────────────────────── overlay (captions, hook, big number, panels, labels)
{ const st = document.createElement('style'); st.textContent = `
.cmp{width:860px;padding:26px 34px 22px;box-sizing:border-box;background:rgba(8,10,26,.88);border:2px solid rgba(255,225,160,.6);border-radius:30px;box-shadow:0 18px 50px rgba(5,7,20,.5);}
.cmp .t{font:700 22px/1 'Inter',sans-serif;letter-spacing:.28em;text-transform:uppercase;color:#FFD27A;text-align:center;margin-bottom:8px;}
.cmp .r{margin-top:18px;}
.cmp .n{font:700 25px/1 'Inter',sans-serif;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.85);}
.cmp .b{margin-top:10px;height:66px;border-radius:14px;display:flex;align-items:center;justify-content:flex-end;padding-right:18px;box-sizing:border-box;font:800 38px/1 'JBM',monospace;white-space:nowrap;overflow:hidden;}
.cmp .b.red{background:#E0483B;color:#fff;} .cmp .b.am{background:#F7A600;color:#1C1300;}
.cmp .s{margin-top:16px;font:500 18px/1 'Inter',sans-serif;letter-spacing:.04em;color:rgba(255,255,255,.6);text-align:center;}
.ptag{font:800 31px/1 'JBM',monospace;color:#1C1300;background:#FFE7A6;border:2px solid #F7A600;padding:9px 12px 8px;border-radius:12px;box-shadow:0 6px 18px rgba(5,7,20,.35);}
.ptag.dn{background:#FF8A7A;border-color:#E0483B;color:#2A0A06;} .ptag.up{background:#9BE0A8;border-color:#3FAE6A;color:#0A2A12;} .ptag.sold{background:#3FAE6A;border-color:#3FAE6A;color:#fff;}
.mkt{font:800 28px/1 'Inter',sans-serif;letter-spacing:.04em;color:#fff;background:rgba(8,10,26,.86);border:2px solid rgba(255,225,160,.7);padding:18px 26px;border-radius:20px;box-shadow:0 12px 34px rgba(5,7,20,.5);}
.mkt b{font:800 46px/1 'JBM',monospace;color:#FFC84A;margin:0 8px;vertical-align:-5px;} .mkt i{font-style:normal;font:800 40px/1 'JBM',monospace;color:#FF8A7A;margin-left:10px;vertical-align:-4px;}
.grid{width:640px;padding:24px 30px 20px;box-sizing:border-box;background:rgba(8,10,26,.9);border:2px solid rgba(255,225,160,.6);border-radius:30px;box-shadow:0 18px 50px rgba(5,7,20,.5);text-align:center;}
.grid .t{font:700 22px/1 'Inter',sans-serif;letter-spacing:.24em;text-transform:uppercase;color:#FFD27A;}
.grid .g{margin:20px auto 0;width:520px;display:grid;grid-template-columns:repeat(10,44px);gap:8px;}
.grid .c{width:44px;height:44px;border-radius:8px;background:#3A4052;}
.grid .c.on{background:#F7A600;box-shadow:0 0 16px rgba(247,166,0,.8);} .grid .c.rp{background:#8A3E3A;}
.grid .c.on.part{background:linear-gradient(90deg,#F7A600 0 60%,#3A4052 60% 100%);box-shadow:none;} .grid .c.on.part.rp{background:linear-gradient(90deg,#F7A600 0 60%,#8A3E3A 60% 100%);}
.grid .l{margin-top:18px;font:700 25px/1.35 'Figtree',sans-serif;color:#fff;white-space:pre;}
.grid .l em{font-style:normal;color:#FFC84A;} .grid .l s{text-decoration:none;color:#FF8A7A;}
.grid .s{margin-top:10px;font:500 17px/1 'Inter',sans-serif;color:rgba(255,255,255,.6);}
.card{font:700 30px/1.3 'Figtree',sans-serif;color:#fff;background:rgba(8,10,26,.88);border:2px solid rgba(255,225,160,.65);padding:16px 24px;border-radius:20px;text-align:center;white-space:pre;box-shadow:0 12px 34px rgba(5,7,20,.5);}
.card em{font-style:normal;color:#FFC84A;} .card s{text-decoration:none;color:#FF8A7A;} .card u{text-decoration:none;color:#9BE0A8;}
.tag.dn{color:#fff;background:#D9483B;border-color:#D9483B;} .tag.dn b{color:#fff;}
`; document.head.appendChild(st); }
const ui = document.getElementById('ui'); const _v = new THREE.Vector3();
function proj(x, y, z) { _v.set(x, y, z).project(camera); return [(_v.x * 0.5 + 0.5) * W, (-_v.y * 0.5 + 0.5) * H, _v.z < 1]; }
function mk(cls, html = '') { const e = document.createElement('div'); e.className = 'abs ' + cls; e.innerHTML = html; e.style.opacity = 0; ui.appendChild(e); return e; }
function put(e, x, y, o = 1, sc = 1, ax = '-50%', ay = '-50%') { e.style.opacity = o.toFixed(3); if (o <= 0.001) return; e.style.transform = `translate(${x.toFixed(1)}px,${y.toFixed(1)}px) translate(${ax},${ay}) scale(${sc.toFixed(3)})`; }
const pop = (t, t0, d = 0.32) => t < t0 ? 0 : 0.82 + 0.18 * back(seg(t, t0, t0 + d));
const clampX = (x, m = 200) => Math.min(W - m, Math.max(m, x));
const clampY = (y, a = 600, b = 1450) => Math.min(b, Math.max(a, y));
const chunks = [];
{
  let clause = []; let si = 0;
  const flush = () => { const n = clause.length; if (!n) return; const k = Math.ceil(n / 3); let i = 0; for (let c = 0; c < k; c++) { const size = Math.ceil((n - i) / (k - c)); chunks.push({ ws: clause.slice(i, i + size) }); i += size; } clause = []; };
  for (const w of TIM.words) { if (TIM.hook && w.si === 1 && w.s < (TIM.big ? T.bigOut + 0.1 : 1e9)) continue; if (w.si !== si) { flush(); si = w.si; } clause.push(w); if (/[.,?!:]$/.test(w.t)) flush(); }   // the hook card and the big number show sentence 1
  flush();
  chunks.forEach(c => { c.s = c.ws[0].s - 0.07; c.e = c.ws[c.ws.length - 1].e; });
  if (!TIM.hook) chunks[0].s = -1;
  chunks.forEach((c, i) => { const nx = chunks[i + 1]; c.hide = nx ? Math.min(nx.s, c.e + 0.5) : c.e + 0.8; });
}
const capEl = document.getElementById('cap'); let capIdx = -2;
function updateCaption(t) {
  capEl.style.opacity = TIM.big ? seg(t, T.bigOut - 0.05, T.bigOut + 0.2).toFixed(3) : '1';
  let idx = -1; for (let i = 0; i < chunks.length; i++) if (t >= chunks[i].s && t < chunks[i].hide) { idx = i; break; }
  if (idx !== capIdx) { capIdx = idx; capEl.innerHTML = idx < 0 ? '' : chunks[idx].ws.map(w => `<span class="w${w.kw ? ' kw' : ''}">${w.t.replace(/[:]$/, '').replace(/&/g, '&amp;')}</span>`).join(''); }
  if (idx < 0) return;
  const c = chunks[idx], spans = capEl.children;
  c.ws.forEach((w, i) => { const nx = c.ws[i + 1]; const st = t < w.s - 0.05 ? 'fut' : (nx && t >= nx.s - 0.05) ? 'said' : 'cur'; const cl = 'w' + (w.kw ? ' kw' : '') + (st === 'cur' ? '' : ' ' + st); if (spans[i].className !== cl) spans[i].className = cl; });
}
// hook card: on the very first frame (it is also the Reel's cover); lines from script.py HOOK, *word* = amber
const HK = TIM.hook, hookEl = HK ? mk('hook', `<div class="n">${HK.lines.map(l => l.replace(/\*([^*]+)\*/g, '<em>$1</em>')).join('\n')}</div>` + (HK.sub ? `<div class="s">${HK.sub}</div>` : '')) : null;
function fitHook() { if (!hookEl) return; const n = hookEl.querySelector('.n'), w = n.scrollWidth; if (w > 940) n.style.fontSize = (112 * 940 / w).toFixed(1) + 'px'; if (bigEl) { const v = bigEl.querySelector('.v'), bw = v.scrollWidth; if (bw > 960) v.style.fontSize = (172 * 960 / bw).toFixed(1) + 'px'; } }
// big number: 1.5-3 s, the most shocking number of the story counting up over a dark screen, a chart line diving (or climbing) behind it
const BG = TIM.big, bigBg = BG ? mk('bigbg', '') : null, bigEl = BG ? mk('big' + (/^[^\d]*[−-]/.test(BG.value) || BG.dir === 'down' ? '' : ' up'), '') : null, BIGN = {};
if (BG) { const m = BG.value.match(/^([^\d]*)(\d[\d,]*(?:\.\d+)?)(.*)$/) || ['', '', '0', BG.value]; Object.assign(BIGN, { pre: m[1], num: parseFloat(m[2].replace(/,/g, '')), dec: (m[2].split('.')[1] || '').length, comma: m[2].includes(','), post: m[3] });
  const down = !bigEl.classList.contains('up'), pts = (down ? [[0, 20], [90, 34], [160, 18], [240, 60], [320, 48], [420, 100], [520, 86], [620, 140], [760, 160]] : [[0, 160], [90, 140], [170, 150], [260, 104], [350, 116], [450, 66], [540, 80], [640, 30], [760, 12]]);
  BIGN.len = pts.slice(1).reduce((a, q, i) => a + Math.hypot(q[0] - pts[i][0], q[1] - pts[i][1]), 0);
  bigEl.innerHTML = `<svg width="760" height="170" viewBox="0 0 760 170"><polyline points="${pts.map(q => q.join(',')).join(' ')}" stroke-dasharray="${BIGN.len.toFixed(1)}"/></svg><div class="v"></div><div class="l">${BG.label || ''}</div>` + (BG.when ? `<div class="d">${BG.when}</div>` : '');
  BIGN.line = bigEl.querySelector('polyline'); BIGN.v = bigEl.querySelector('.v'); }
const bigText = u => { const x = BIGN.num * u; let n = x.toFixed(BIGN.dec); if (BIGN.comma) n = Number(n).toLocaleString('en-US', { minimumFractionDigits: BIGN.dec, maximumFractionDigits: BIGN.dec }); const unit = BIGN.post.trim(); return BIGN.pre + n + (unit ? (/^[A-Za-z]/.test(unit) ? `<small>${unit}</small>` : BIGN.post) : ''); };
const chip = mk('chip', '');
const tagGiant = mk('tag', 'NVIDIA'), tagGhost = mk('tag am', '');
const cmp = mk('cmp', `<div class="t">six weeks of Nvidia vs. all crypto</div><div class="r"><div class="n">Nvidia's loss · 6 Oct → 20 Nov</div><div class="b red" style="width:0px">$2.7 T</div></div><div class="r"><div class="n">the whole crypto market · 22 Nov</div><div class="b am" style="width:0px">$2.1 T</div></div><div class="s">Yahoo Finance, Bitcoin.com (21 Nov) · CoinGecko (22 Nov 2026)</div>`);
const cmpB = cmp.querySelectorAll('.b');
const ptags = FR.map(() => mk('ptag', '$100'));
const tagSold = mk('tag am', 'sold for <b>$80</b>'), tagBuyer = mk('tag', 'a buyer');
const mkt = mk('mkt', '');
const tagOne = mk('card', '<em>1 share sold</em>\n9 just got a new price');
const grid = mk('grid', `<div class="t">Nvidia shares · Fri 20 Nov 2026</div><div class="g">${Array.from({ length: 100 }, () => '<div class="c"></div>').join('')}</div><div class="l"><em>■ 2.6 in 100 changed hands</em>\n<s>■ the rest: repriced −14%, never sold</s></div><div class="s">633 million of about 24.1 billion shares · stockanalysis.com, Nvidia</div>`);
const cells = [...grid.querySelectorAll('.c')];
const cardSeller = mk('card', 'bought at <em>$100</em> · sold at <em>$80</em>\n<s>−$20 of real cash</s>');
const tagEarly = mk('tag am', 'sold it to him for <b>$100</b>');
const cardPaper = mk('card', '');
const title = mk('title', '<div class="s">THE STORY OF</div><div class="n">A <em>Wipe-Out</em></div>');
const lesson = mk('lesson', 'The trillions were <em>a price</em>,\nnot a pile of cash.');
const ctaChip = mk('chip am', 'you decide');
const boxes = [0, 1].map(() => { const e = mk('cbox', '<span class="in"></span><span class="post">Post</span>'); return { e, inn: e.querySelector('.in'), post: e.querySelector('.post') }; });
const foot = document.getElementById('foot');
foot.textContent = 'Sources: Yahoo Finance, Motley Fool, Bitcoin.com (20–21 Nov 2026), stockanalysis.com, CoinGecko (22 Nov 2026)\nNvidia close $125.53 on 20 Nov 2026, record $239.24 on 6 Oct · the ten friends: an example · not advice';
const setTxt = (e, s) => { if (e.textContent !== s) e.textContent = s; };
const setHTML = (e, s) => { if (e._h !== s) { e._h = s; e.innerHTML = s; } };
// what each price tag says at time t (the example: $100, then $80; in sentence 12 the price wobbles: a paper loss can grow or shrink)
function tagState(i, t) {
  if (t < T.flip(i)) return ['$100', ''];
  if (t > T.grow && t < T.shrink - 0.05) return ['$70', 'dn'];
  if (t >= T.shrink - 0.05 && t < T.b13) return ['$90', 'up'];
  return ['$80', 'dn'];
}

function updateUI(t) {
  updateCaption(t);
  foot.style.opacity = (0.95 * seg(t, 3.0, 3.6) * (1 - seg(t, T.cta, T.cta + 0.3) * 0.45)).toFixed(3);
  // 1 — the hook card (0-1.5 s, the cover), then the big number (1.5-3 s)
  if (hookEl) { const out = seg(t, T.hookEnd, T.hookEnd + (TIM.big ? 0.22 : 0.3)); put(hookEl, W / 2, 640 - 40 * eo(out), 1 - out, 1 + 0.035 * seg(t, 0, T.hookEnd) + 0.06 * out); }
  if (bigEl) { const o = win(t, T.bigIn, T.bigOut - 0.05, 0.15, 0.25), u = eo(seg(t, T.bigIn + 0.05, T.bigIn + 0.7)), land = seg(t, T.bigIn + 0.7, T.bigIn + 1.0), sh = (1 - land) * (land > 0 ? 1 : 0);
    bigBg.style.opacity = (0.92 * o).toFixed(3); setHTML(BIGN.v, bigText(u)); BIGN.line.style.strokeDashoffset = (BIGN.len * (1 - eo(seg(t, T.bigIn, T.bigIn + 0.9)))).toFixed(1);
    put(bigEl, W / 2 + Math.sin(t * 90) * 7 * sh, 860 + Math.cos(t * 77) * 5 * sh, o, pop(t, T.bigIn, 0.4) * (1 + 0.05 * Math.sin(Math.PI * land))); }
  // chips (one line at the top that says where we are)
  let ct = '', co = 0, cp = 0;
  const CH = [[T.bigOut + 0.05, T.b2 - 0.1, 'Nvidia · 6 Oct → 20 Nov 2026'], [T.b4 + 0.05, T.b5 - 0.15, 'how a company is valued'], [T.b5 + 0.05, T.b8 - 0.15, 'an example · ten friends, one share each'],
    [T.b8 + 0.05, T.b10 - 0.15, 'Friday 20 Nov 2026 · Nvidia'], [T.b10 + 0.05, T.b13 - 0.15, 'back to the example'], [T.b13 + 0.05, T.b15 - 0.1, 'as of 20 Nov 2026']];
  for (const [a, b, s] of CH) { const o = win(t, a, b, 0.22, 0.22); if (o > co) { co = o; ct = s; cp = pop(t, a); } }
  if (ct) setTxt(chip, ct); put(chip, W / 2, 472, co, cp);
  // 1–2 — the giant, its missing half, the comparison with all crypto
  { const p = proj(NV[0], NVH * (1 - LOSS * sinkU(t)) + 9, NV[1]); put(tagGiant, clampX(p[0]), clampY(p[1] - 20, 560, 1400), p[2] ? win(t, T.bigOut, T.b3 - 0.2, 0.3, 0.25) : 0, 1); }
  { const p = proj(NV[0], NVH + 6, NV[1]); setTxt(tagGhost, t < T.never ? '−$2.7 trillion · where?' : 'a price · never cash');
    put(tagGhost, clampX(p[0], 260), clampY(p[1] - 30, 600, 1350), p[2] ? win(t, T.where, T.value - 0.1, 0.25, 0.25) : 0, pop(t, t < T.never ? T.where : T.never)); }
  { const o = win(t, T.more - 0.2, T.b3 + 0.1, 0.3, 0.25), u1 = eo(seg(t, T.more - 0.1, T.more + 0.5)), u2 = eo(seg(t, T.crypto - 0.1, T.crypto + 0.5));
    cmpB[0].style.width = (600 * u1).toFixed(1) + 'px'; cmpB[1].style.width = (600 * 2.08 / 2.7 * u2).toFixed(1) + 'px'; put(cmp, W / 2, 1190, o, pop(t, T.more - 0.2)); }
  // 5–7 — the ten friends: price tags, the sale, all ten repriced
  const fo = friendsOn(t) && t < T.friday + 0.2 || t > T.real - 0.4 && t < T.b13 + 0.2;
  for (let i = 0; i < FR.length; i++) { const c = certPos(i, t), p = proj(c[0], c[1] + 1.42 + (c[1] - CERT_Y), c[2] - 0.5); const [txt, cl] = tagState(i, t), cls = 'abs ptag' + (cl ? ' ' + cl : '');
    setTxt(ptags[i], txt); if (ptags[i].className !== cls) ptags[i].className = cls;
    const flipK = 1 + 0.18 * win(t, T.flip(i), T.flip(i) + 0.25, 0.08, 0.2) + 0.15 * win(t, T.grow, T.grow + 0.25, 0.08, 0.2) + 0.15 * win(t, T.shrink - 0.05, T.shrink + 0.2, 0.08, 0.2);
    put(ptags[i], p[0], p[1], fo && p[2] ? win(t, T.hundred5 - 0.15 + i * 0.03, T.b13, 0.2, 0.3) : 0, pop(t, T.hundred5 - 0.15 + i * 0.03) * flipK); }
  { const sp = proj(FR[PK][0], 2.45, FR[PK][1]), b = buyerAt(t), bp = proj(b[0], 2.9, b[1]);
    put(tagSold, clampX(sp[0], 180), clampY(sp[1], 600, 1400), win(t, T.eighty6, T.b7 + 0.6, 0.2, 0.25), pop(t, T.eighty6));
    put(tagBuyer, clampX(bp[0] + 40, 180), clampY(bp[1] - 20, 600, 1400), win(t, T.buyIn + 0.3, T.sells + 0.3, 0.25, 0.25), pop(t, T.buyIn + 0.3)); }
  { const after = t > T.eighty7, v = after ? '$800' : '$1,000'; setHTML(mkt, `10 shares × <b>${after ? '$80' : '$100'}</b> = <b>${v}</b>` + (after ? '<i>−$200</i>' : ''));
    put(mkt, W / 2, 1440, win(t, T.hundred5 + 0.2, T.only - 0.1, 0.25, 0.25), pop(t, T.hundred5 + 0.2) * (1 + 0.08 * win(t, T.eighty7, T.eighty7 + 0.35, 0.1, 0.2))); }
  put(tagOne, W / 2, 1440, win(t, T.only, T.b8 - 0.1, 0.25, 0.25), pop(t, T.only));
  // 8–9 — Friday: under 3 in 100 shares changed hands
  { const o = win(t, T.b9 - 0.05, T.b10 - 0.1, 0.25, 0.25); if (o > 0) cells.forEach((c, i) => { const on = i < 3 && t > T.three + i * 0.12, rp = i >= 2 && t > T.sold9 - 0.35 + (i % 10) * 0.012 + Math.floor(i / 10) * 0.02; const cl = 'c' + (on ? ' on' : '') + (i === 2 ? ' part' : '') + (rp ? ' rp' : ''); if (c.className !== cl) c.className = cl; });
    put(grid, W / 2, 1150, o, pop(t, T.b9 - 0.05)); }
  // 10–12 — who lost real cash; where that cash went; everyone else
  { put(cardSeller, W / 2, 1440, win(t, T.bought - 0.1, T.b11 + 0.2, 0.25, 0.25), pop(t, T.bought - 0.1)); }
  { const e = earlyAt(t), p = proj(e[0], 2.6, e[1]); put(tagEarly, clampX(p[0] + 60, 250), clampY(p[1], 600, 1400), win(t, T.whoever, T.b12 + 0.3, 0.25, 0.25), pop(t, T.whoever)); }
  { const s = t < T.grow ? 'everyone else: <s>−$20 each</s>, on paper' : t < T.shrink - 0.05 ? 'the price falls: <s>−$30 each</s>, on paper' : 'the price climbs: <u>−$10 each</u>, on paper'; setHTML(cardPaper, s);
    put(cardPaper, W / 2, 1440, win(t, T.paper - 0.1, T.b13 - 0.05, 0.25, 0.25), pop(t, T.paper - 0.1) * (1 + 0.06 * win(t, T.grow, T.grow + 0.3, 0.1, 0.2) + 0.06 * win(t, T.shrink - 0.05, T.shrink + 0.25, 0.1, 0.2))); }
  // 15 — title and lesson; 16 — you decide
  put(title, W / 2, 640, win(t, T.story, T.cta - 0.1, 0.4, 0.3), 0.94 + 0.06 * eo(seg(t, T.story, T.story + 0.6)));
  put(lesson, W / 2, 1180, win(t, T.trillions, T.cta - 0.15, 0.3, 0.25), pop(t, T.trillions));
  put(ctaChip, W / 2, 472, seg(t, T.would, T.would + 0.3), pop(t, T.would));
  [[T.sell, 'SELL', T.postA], [T.hold, 'HOLD', T.postB]].forEach(([t0, word, tp], i) => {
    const bx = boxes[i], n = Math.min(4, Math.floor(c01((t - t0) / 0.45) * 4.001)), typed = word.slice(0, n), caret = (n < 4 || Math.floor(t * 2.4) % 2) && t < tp ? '<i></i>' : '';
    setHTML(bx.inn, typed ? `<b>${typed}</b>${caret}` : `<em>Add a comment…</em>${caret}`); const sent = t > tp; const pc = sent ? 'post on sent' : n === 4 ? 'post on' : 'post'; if (bx.post.className !== pc) bx.post.className = pc; setTxt(bx.post, sent ? 'Posted ✓' : 'Post');
    const ts = i ? T.hold - 0.35 : T.comment; put(bx.e, W / 2, 1330 + i * 132, seg(t, ts, ts + 0.3), pop(t, ts) * (1 + 0.06 * win(t, tp, tp + 0.3, 0.08, 0.2)));
  });
}

// ───────────────────────── one frame
const hopY = (hops, t, h = 0.5) => { let y = 0; for (const t0 of hops) { const u = (t - t0) / 0.38; if (u > 0 && u < 1) y = Math.max(y, Math.sin(u * Math.PI) * h); } return y; };
const sinkU = t => eio(seg(t, T.sinkA, T.sinkB));
function renderAt(t) {
  const s = skyAt(t), night = s.glow;
  paintSky(s);
  scene.fog.color.setRGB(...s.fog); scene.fog.near = s.fn; scene.fog.far = s.ff;
  hemi.color.setRGB(...s.hemS); hemi.groundColor.setRGB(...s.hemG); hemi.intensity = s.hemI;
  sun.color.setRGB(...s.sunC); sun.intensity = s.sunI;
  const az = s.az * Math.PI / 180, el = s.el * Math.PI / 180, sd = [Math.cos(el) * Math.sin(az), Math.sin(el), Math.cos(el) * Math.cos(az)];
  starM.opacity = s.star * 0.9; stars.visible = s.star > 0.01;
  setCamera(t);
  WIN_LIT.emissiveIntensity = Math.max(0, night * 1.05 + (t > T.cta ? 0.15 * Math.sin(t * 3.1) : 0));
  lampM.emissiveIntensity = night * 1.4;
  // the giant sinks (its value falls by about half); it shudders on Friday's −14%
  { const k = sinkU(t), sh = win(t, T.sinkA, T.sinkB, 0.1, 0.3) + win(t, T.fell, T.p14 + 0.8, 0.1, 0.4);
    nvG.position.y = -NVH * LOSS * k; nvG.rotation.z = Math.sin(t * 23) * 0.005 * sh; nvG.rotation.x = Math.sin(t * 19 + 1) * 0.004 * sh; crown.rotation.y = t * 0.25;
    const go = win(t, T.where - 0.1, T.b5 + 0.4, 0.4, 0.5) + win(t, T.b13, T.b15 + 0.3, 0.4, 0.5) * 0.8; ghost.visible = go > 0.01; ghost.userData.fill.material.opacity = 0.16 * go; ghost.userData.edges.material.opacity = 0.9 * go; }
  // cars and people
  for (const c of CARS) { const L = 700, x = ((c.off + t * c.v) % L) - L / 2; c.m.position.set(c.dir * x, 0, c.z); c.m.rotation.y = c.dir > 0 ? 0 : Math.PI; }
  WALK.forEach((w, i) => { const u = (Math.sin((t * w.sp + w.ph) * Math.PI * 2) + 1) / 2, dir = Math.cos((t * w.sp + w.ph) * Math.PI * 2) > 0 ? 1 : -1; const x = lerp(w.a[0], w.b[0], u), z = lerp(w.a[1], w.b[1], u); w.m.position.set(x, Math.abs(Math.sin(t * 7 + i)) * 0.06, z); w.m.rotation.y = Math.atan2(-(w.b[1] - w.a[1]) * dir, (w.b[0] - w.a[0]) * dir); });
  watchers.forEach((m, i) => { m.position.y = hopY([T.nobody + 0.2 + i * 0.07, T.where + 0.1 + i * 0.06, T.p14 + 0.1 + i * 0.06], t, 0.16); });
  // the ten friends, the buyer, the earlier seller, the shares and the cash
  const on = friendsOn(t);
  friends.forEach((m, i) => { const k = friendIn(i, t); m.visible = on && k > 0.01; m.scale.setScalar(1.05 * Math.max(0.01, k));
    let y = hopY([T.flip(i) + 0.05], t, 0.14), rz = 0, ry = -Math.PI / 2;
    if (i === PK) { const pn = win(t, T.panics - 0.05, T.sells + 0.1, 0.08, 0.15); y += Math.abs(Math.sin(t * 26)) * 0.12 * pn; rz = Math.sin(t * 31) * 0.06 * pn; ry = lerp(-Math.PI / 2, -0.25, eo(seg(t, T.sells - 0.3, T.sells + 0.1)) * (1 - seg(t, T.b7 + 0.3, T.b7 + 0.8))); }
    if (i !== PK) y += hopY([T.grow + 0.05 + i * 0.03, T.shrink + i * 0.03], t, 0.1);
    m.position.y = y; m.rotation.set(0, ry, rz); });
  { const b = buyerAt(t); buyer.visible = on && t > T.buyIn - 0.1; buyer.position.set(b[0], b[2] ? Math.abs(Math.sin(t * 9)) * 0.08 : 0, b[1]); buyer.rotation.y = b[2] ? Math.PI : lerp(Math.PI, Math.PI + 0.6, seg(t, T.sells - 0.1, T.sells + 0.3)); }
  { const e = earlyAt(t); early.visible = on && t > T.earlyIn - 0.1; early.position.set(e[0], e[2] ? Math.abs(Math.sin(t * 9)) * 0.08 : hopY([T.whoever + 0.25], t, 0.2), e[1]); early.rotation.y = e[2] ? 0 : lerp(0, -0.9, seg(t, T.whoever, T.whoever + 0.4));
    cashE.visible = early.visible; cashE.position.set(e[0] + 0.15, 1.02 + 0.04 * Math.sin(t * 3), e[1] + 0.55); cashE.rotation.set(0.25, t * 0.6, 0); }
  { rings[0].position.x = FR[PK][0]; rings[0].position.z = FR[PK][1]; ringM[0].opacity = 0.9 * win(t, T.b10 + 0.1, T.b12 - 0.1, 0.25, 0.3); const e = earlyAt(t); rings[1].position.x = e[0]; rings[1].position.z = e[1]; ringM[1].opacity = 0.9 * win(t, T.whoever, T.b12 + 0.2, 0.25, 0.3);
    for (const r of rings) r.scale.setScalar(1 + 0.06 * Math.sin(t * 5)); }
  certs.forEach((m, i) => { const c = certPos(i, t), k = friendIn(i, t) * seg(t, T.share5 - 0.2, T.share5 + 0.15); m.visible = on && k > 0.01; m.position.set(c[0], c[1], c[2]); m.scale.setScalar(0.62 * Math.max(0.01, back(k)));
    m.rotation.set(Math.PI / 2, 0, Math.sin(t * 1.7 + i) * 0.08 + (i === PK ? 6.28 * eo(seg(t, T.certA, T.certA + 0.55)) : 0)); });
  { const b = buyerAt(t), u = eo(seg(t, T.cashA, T.cashA + 0.5)), x = lerp(b[0] + 0.25, FR[PK][0] + 0.1, u), z = lerp(b[1] + 0.55, FR[PK][1] + 0.55, u);
    cashB.visible = on && t > T.buyIn - 0.1; cashB.position.set(x, 1.0 + Math.sin(u * Math.PI) * 1.0, z); cashB.rotation.set(0.2, u * 6.28 + 0.3, 0); }
  // clouds
  for (const c of clouds) { c.position.x = c.userData.x0 + t * 1.2; c.material.opacity = 0.9 - 0.5 * night; const k = lerp(1, 0.45, night); c.material.color.setRGB(lerp(s.hor[0], 1, 0.55) * k, lerp(s.hor[1], 1, 0.55) * k, lerp(s.hor[2], 1, 0.55) * k * 1.05); }
  // sparkles: the giant's top melting away into the air; the cash changing hands; the final wish
  { let k = 0; const put3 = (x, y, z, sz, on) => { const sp = sparks[k++]; if (!sp) return; const tw = Math.pow(Math.abs(Math.sin(t * sp.userData.w + sp.userData.ph)), 3); sp.position.set(x, y, z); sp.scale.setScalar(sz * (0.25 + tw)); sp.material.opacity = on * (0.3 + 0.7 * tw); sp.visible = on > 0.01; };
    const s1 = win(t, T.sinkA, T.sinkB + 0.9, 0.2, 0.8), top = NVH * (1 - LOSS * sinkU(t)); for (let i = 0; i < 40; i++) { const sp = sparks[i].userData, ph = (t * 0.45 + sp.k) % 1; put3(NV[0] + sp.dx * 11, top + 1 + ph * 30, NV[1] + sp.dz * 11, 1.6 + 1.6 * (1 - ph), s1 * Math.sin(ph * Math.PI)); }
    const s2 = win(t, T.cashA + 0.4, T.b7 + 0.3, 0.2, 0.4); for (let i = 0; i < 8; i++) { const a = i * 0.785 + t * 1.4; put3(FR[PK][0] + 0.35 + Math.cos(a) * 0.8, 1.2 + (i % 4) * 0.3, FR[PK][1] + 0.5 + Math.sin(a) * 0.8, 0.45, s2); }
    const s3 = win(t, T.postA, DUR + 1, 0.4, 0.1); for (let i = 0; i < 18; i++) { const ph = (t * 0.35 + i / 18) % 1, a = i * 2.4; put3(SCR[0] - 14 + Math.cos(a) * (6 + ph * 8), 2 + ph * 30, SCR[2] + 10 + Math.sin(a) * (4 + ph * 6), 2.4 + 1.4 * (1 - ph), s3 * Math.sin(ph * Math.PI)); }
    while (k < sparks.length) sparks[k++].visible = false; }
  drawScreen(t);
  updateBirds(t);
  dome.position.copy(camera.position); stars.position.copy(camera.position);
  orb.visible = halo.visible = s.orbS > 0.5 && s.star < 0.9;
  orb.position.set(camera.position.x + sd[0] * 1800, camera.position.y + sd[1] * 1800, camera.position.z + sd[2] * 1800); orb.scale.setScalar(s.orbS * 2); orb.lookAt(camera.position); orbM.color.setRGB(...s.orb);
  halo.position.copy(orb.position); halo.scale.setScalar(s.orbS * 13); halo.lookAt(camera.position); haloM.color.setRGB(...s.orb); haloM.opacity = 0.75;
  const S2 = Math.min(170, Math.max(18, camD * 0.85));
  sun.target.position.copy(camTg); sun.position.set(camTg.x + sd[0] * 400, camTg.y + sd[1] * 400, camTg.z + sd[2] * 400);
  const sc = sun.shadow.camera; sc.left = -S2; sc.right = S2; sc.top = S2; sc.bottom = -S2; sc.updateProjectionMatrix();
  renderer.render(scene, camera);
  updateUI(t);
}
window.camCheck = () => {
  const out = []; let cur = null;
  for (let f = 0; f < Math.ceil(DUR * 30); f++) {
    const t = f / 30; setCamera(t); const c = camera.position; let hit = null;
    for (const [x0, x1, z0, z1, y1, nm] of stat) if (c.x > x0 - 0.9 && c.x < x1 + 0.9 && c.z > z0 - 0.9 && c.z < z1 + 0.9 && c.y < y1 + 0.9) { hit = nm; break; }
    if (!hit && c.y < 1.2) hit = 'ground';
    if (hit) { if (cur && cur[2] === hit && f - cur[1] <= 1) cur[1] = f; else { cur = [f, f, hit]; out.push(cur); } }
  }
  return out.map(([a, b, n]) => `${(a / 30).toFixed(2)}-${(b / 30).toFixed(2)}s ${n}`);
};
window.renderAt = renderAt;
window.CUES = {
  T: Object.fromEntries(Object.entries(T).filter(([, v]) => typeof v === 'number')), DUR, sent: TIM.sentences.map(s => s.s),
  typingA: [0, 1, 2, 3].map(i => +(T.sell + (i + 0.5) * 0.11).toFixed(3)), typingB: [0, 1, 2, 3].map(i => +(T.hold + (i + 0.5) * 0.11).toFixed(3)),
  friendsIn: FR.map((_, i) => +(T.friends - 0.2 + i * 0.06).toFixed(3)), flips: FR.map((_, i) => +T.flip(i).toFixed(3)),
  grid3: [0, 1, 2].map(i => +(T.three + i * 0.12).toFixed(3)),
  postA: +T.postA.toFixed(3), postB: +T.postB.toFixed(3),
};
document.fonts.ready.then(() => Promise.all(['700 64px Figtree', '900 190px Fraunces', '800 30px JBM', '700 22px Inter', '700 78px Fraunces', '800 54px Figtree', '600 34px Figtree', '500 18px Inter', '900 128px JBM', '800 46px Inter', '900 150px Figtree', '900 112px Fraunces', '800 172px JBM', '700 34px Figtree'].map(f => document.fonts.load(f)))).then(() => { fitHook(); renderAt(0); window.__ready = true; });
