// The Other Line — sample of the "turn" format (Keith, 28 Nov 2026). Low-poly storybook scene, deterministic: window.renderAt(t) draws the frame for time t.
// One place for the whole video, a supermarket checkout. The picture changes meaning, not place: at the turn the tills get chart boards,
// then the back wall rises into a wall of thousands of tiles (every tile a line you could be standing in), and night falls on the shop.
import * as THREE from 'three';
import { SKIN, MAT, rng, GB, person } from './kit.js';

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
const hash = x => { const s = Math.sin(x * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
const R = rng(20261128);
const OPEN = Object.assign({ words: 'you', text: 'banner', picture: 'action', beat2: 'event', lock: 'yours' }, TIM.open || {});
// text: banner → the headline sits at y 205-430 for the whole video; everything else in the top band moves down by SH so nothing sits under it.
const BAN = TIM.banner || null, SH = BAN ? 160 : 0;

// ───────────────────────── story clock (everything hangs off the narration)
const T = {
  h1a: -0.45, h1b: 0.45,                                    // the first switch is already in the air on frame 0 (picture: action)
  beat2: 0.9,                                               // the second event: the line you left starts to move
  left: wt(1, 'left') - 0.1, moving: wt(1, 'moving') - 0.15,
  turn: S(2) - 0.05, same: wt(2, 'same') - 0.1, trade: wt(2, 'trade') - 0.15,          // the turn: a jump to trading
  why: S(3) - 0.05, three: wt(4, 'three') - 0.1, fastest: wt(4, 'fastest') - 0.15, one: wt(4, 'one') - 0.12,
  b5: S(5) - 0.05, arent: wt(5, "aren't") - 0.1, thousands: wt(5, 'thousands') - 0.25,
  b6: S(6) - 0.05, always: wt(6, 'always') - 0.1, faster: wt(6, 'faster') - 0.1,
  b7: S(7) - 0.05, sw1: wt(7, 'switch', 0) - 0.12, sw2: wt(7, 'switch', 1) - 0.12, back: wt(7, 'back') - 0.15,
  rehook: S(8) - 0.05, r3: wt(8, 'three') - 0.1, proof: wt(8, 'proof') - 0.15,
  b9: S(9) - 0.05, isnt: wt(9, "isn't") - 0.1, strat: wt(9, 'strategy') - 0.15, six: wt(9, 'six') - 0.1, l3: wt(9, 'three') - 0.1, sooner: wt(9, 'sooner') - 0.1,
  b10: S(10) - 0.05, ten1: wt(10, 'ten', 0) - 0.1, milk: wt(10, 'milk') - 0.15, but: wt(10, 'But') - 0.05, ten2: wt(10, 'ten', 1) - 0.1, trades: wt(10, 'trades') - 0.1,
  b11: S(11) - 0.05, maybe1: wt(11, 'Maybe', 0) - 0.1, wrong: wt(11, 'wrong') - 0.1, maybe2: wt(11, 'Maybe', 1) - 0.1, stayed: wt(11, 'stayed') - 0.1,
  end: E(11),                                               // the last word ends here; the rest is the hold on the last card
};
T.h4 = T.but + 0.15; T.use = T.end + 0.3;
window.T = T;

// ───────────────────────── renderer, sky, light
const canvas = document.getElementById('gl');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: QP.get('aa') !== '0', preserveDrawingBuffer: true });
renderer.setPixelRatio(1); renderer.setSize(W, H, false);
renderer.toneMapping = THREE.NeutralToneMapping; renderer.toneMappingExposure = 1.0;
renderer.shadowMap.enabled = QP.get('sh') !== '0'; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
const scene = new THREE.Scene(); scene.fog = new THREE.Fog(0xffffff, 90, 620);
const camera = new THREE.PerspectiveCamera(35, W / H, 0.5, 2400);
const hemi = new THREE.HemisphereLight(0xffffff, 0x886644, 1.5); scene.add(hemi);
const sun = new THREE.DirectionalLight(0xffffff, 3); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); sun.shadow.bias = -0.0005; sun.shadow.normalBias = 0.3; sun.shadow.camera.near = 1; sun.shadow.camera.far = 760; scene.add(sun, sun.target);

const hx = h => { const c = new THREE.Color(h); return [c.r, c.g, c.b]; };
const P = (top, mid, hor, fog, sunC, sunI, hemS, hemG, hemI, star, glow, az, el, orb, orbS) => ({ top: hx(top), mid: hx(mid), hor: hx(hor), fog: hx(fog), sunC: hx(sunC), sunI, hemS: hx(hemS), hemG: hx(hemG), hemI, star, glow, az, el, orb: hx(orb), orbS });
const PRE = {
  NIGHT: P(0x070B24, 0x141C4B, 0x30326A, 0x262A5E, 0xB4C2FF, 2.1, 0x5567C4, 0x3A3048, 1.55, 1, 1, 250, 42, 0xFFF4D6, 30),
  DAY: P(0x2F8FDA, 0x86C6EE, 0xF6E7C4, 0xEEDFC0, 0xFFF1D6, 3.5, 0xCFE8FF, 0xD2AE7C, 1.7, 0, 0, 236, 54, 0xFFF8E0, 38),
  GOLDEN: P(0x3C7FCB, 0xF2C58A, 0xFFD79A, 0xF6CF9A, 0xFFC878, 3.2, 0xE8D2B0, 0xC08A55, 1.5, 0, 0.1, 246, 26, 0xFFE0A0, 44),
  SUNSET: P(0x2E2F72, 0xE0707A, 0xFFB25E, 0xEE9A6A, 0xFF9050, 2.6, 0xA98AC0, 0x8A5A44, 1.2, 0.12, 0.5, 256, 10, 0xFFB060, 50),
  DUSK: P(0x141A4C, 0x4A3F86, 0xC06A78, 0x6A4A78, 0x93A4F4, 1.7, 0x5A62B0, 0x3A2A40, 1.15, 0.65, 0.85, 252, 36, 0xFFF4D6, 30),
};
// one long day in the shop: bright when you walk in, golden while you chase the faster line, night when everybody who stayed has gone home
const SKY = [[0, 'DAY'], [T.b5, 'DAY'], [T.thousands + 1.6, 'GOLDEN'], [T.back, 'GOLDEN'], [T.rehook + 1.2, 'SUNSET'], [T.but - 0.2, 'SUNSET'], [T.b11 - 0.3, 'DUSK'], [T.b11 + 1.6, 'NIGHT'], [DUR + 1, 'NIGHT']];
const sky = {};
function skyAt(t) {
  let i = 0; while (i < SKY.length - 2 && t >= SKY[i + 1][0]) i++;
  const a = PRE[SKY[i][1]], b = PRE[SKY[i + 1][1]], u = sm(SKY[i][0], SKY[i + 1][0], t);
  for (const k in a) sky[k] = Array.isArray(a[k]) ? [lerp(a[k][0], b[k][0], u), lerp(a[k][1], b[k][1], u), lerp(a[k][2], b[k][2], u)] : lerp(a[k], b[k], u);
  return sky;
}
const domeG = new THREE.SphereGeometry(1900, 24, 14); domeG.setAttribute('color', new THREE.Float32BufferAttribute(new Float32Array(domeG.attributes.position.count * 3), 3));
const dome = new THREE.Mesh(domeG, new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide, fog: false, depthWrite: false, toneMapped: false })); dome.renderOrder = -10; scene.add(dome);
function paintSky(s) {
  const p = domeG.attributes.position, c = domeG.attributes.color;
  for (let i = 0; i < p.count; i++) {
    const y = p.getY(i) / 1900; let r, g, b;
    if (y <= 0) { r = s.hor[0]; g = s.hor[1]; b = s.hor[2]; }
    else if (y < 0.25) { const u = y / 0.25; r = lerp(s.hor[0], s.mid[0], u); g = lerp(s.hor[1], s.mid[1], u); b = lerp(s.hor[2], s.mid[2], u); }
    else { const u = Math.min(1, (y - 0.25) / 0.6); r = lerp(s.mid[0], s.top[0], u); g = lerp(s.mid[1], s.top[1], u); b = lerp(s.mid[2], s.top[2], u); }
    c.setXYZ(i, r, g, b);
  }
  c.needsUpdate = true;
}
const starG = new THREE.BufferGeometry(); { const a = []; for (let i = 0; i < 700; i++) { const u = R(), th = R() * Math.PI * 2, y = 0.04 + 0.96 * u, r = Math.sqrt(1 - y * y); a.push(r * Math.cos(th) * 1700, y * 1700, r * Math.sin(th) * 1700); } starG.setAttribute('position', new THREE.Float32BufferAttribute(a, 3)); }
const starM = new THREE.PointsMaterial({ color: 0xffffff, size: 2.6, sizeAttenuation: false, transparent: true, fog: false, depthWrite: false, toneMapped: false });
const stars = new THREE.Points(starG, starM); scene.add(stars);
function radial(inner, outer) { const cv = document.createElement('canvas'); cv.width = cv.height = 128; const g = cv.getContext('2d'); const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, inner); gr.addColorStop(1, outer); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); const tx = new THREE.CanvasTexture(cv); tx.colorSpace = THREE.SRGBColorSpace; return tx; }
const orbM = new THREE.MeshBasicMaterial({ color: 0xffffff, fog: false, toneMapped: false, depthWrite: false });
const orb = new THREE.Mesh(new THREE.CircleGeometry(1, 28), orbM); scene.add(orb);
const haloM = new THREE.MeshBasicMaterial({ map: radial('rgba(255,255,255,0.55)', 'rgba(255,255,255,0)'), transparent: true, fog: false, toneMapped: false, depthWrite: false, blending: THREE.AdditiveBlending });
const halo = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), haloM); scene.add(halo);

// ───────────────────────── the shop: three checkout lanes along +x (the tills at the far end), lane l at z = l * DZ
const DZ = 4.4, X0 = 3.0, DX = 1.55, LANES = [-1, 0, 1];
const slotX = k => X0 - k * DX;
const floor = new THREE.Mesh(new THREE.PlaneGeometry(3000, 3000).rotateX(-Math.PI / 2), new THREE.MeshLambertMaterial({ color: 0xE6D8BE })); floor.receiveShadow = true; scene.add(floor);
const world = new GB();
for (let i = -30; i <= 30; i++) { world.box(0.07, 0.02, 132, 0xD4C4A6, i * 2.2 - 6, 0.01, 0); world.box(132, 0.02, 0.07, 0xD4C4A6, -6, 0.01, i * 2.2); }      // floor tiles
const LCOL = { '-1': 0x2FA39A, 0: 0x3B6FB8, 1: 0xC8423A };
for (const l of LANES) {
  const z = l * DZ;
  world.box(17.5, 0.03, 1.5, 0xF4EBDA, -3.2, 0.02, z);                                                       // the runner you queue on
  world.box(3.4, 0.95, 1.0, 0xF4F1EA, X0 + 1.0, 0.475, z - 1.3); world.box(3.44, 0.3, 1.04, LCOL[l], X0 + 1.0, 0.2, z - 1.3);      // counter
  world.box(2.3, 0.06, 0.7, 0x2C2F35, X0 + 0.55, 0.98, z - 1.3);                                             // belt
  world.box(0.5, 0.42, 0.5, 0x3A3F48, X0 + 2.25, 1.17, z - 1.3); world.box(0.06, 0.3, 0.4, 0x8FDCFF, X0 + 1.98, 1.2, z - 1.3);       // till + its screen
  world.box(0.5, 0.5, 0.5, 0xC9A46A, X0 - 0.4, 1.23, z - 1.3); world.box(0.3, 0.36, 0.3, 0x8FB339, X0 + 0.3, 1.16, z - 1.25); world.box(0.26, 0.26, 0.26, 0xE4572E, X0 + 0.9, 1.11, z - 1.38);   // shopping on the belt
  world.cyl(0.07, 0.09, 2.2, 6, 0x8A8F96, X0 + 2.7, 1.1, z - 1.3);                                           // lamp pole
}
// the shop front behind the tills, shelves on both sides
world.box(0.6, 6.0, 132, 0xF2E6CF, 16.3, 3.0, 0); world.box(0.7, 0.9, 132, 0xC8423A, 16.2, 5.1, 0); world.box(0.66, 0.5, 132, 0xE6DCC4, 16.25, 0.25, 0);
for (let i = -9; i <= 9; i++) world.box(0.66, 2.6, 4.6, i % 3 === 0 ? 0x5E8FA8 : 0x9CC7D8, 16.02, 2.3, i * 6.6);
for (const sd of [-1, 1]) for (const [x0, len] of [[-14.5, 15], [3.5, 9]]) {
  const z = sd * 15.2; world.box(len, 2.9, 1.3, 0xE9DFC8, x0 + len / 2, 1.45, z); world.box(len + 0.2, 0.14, 1.5, 0xC9BFA6, x0 + len / 2, 2.97, z);
  for (let lv = 0; lv < 3; lv++) for (let k = 0; k < len / 0.62 - 1; k++) { const hgt = 0.34 + R() * 0.3; world.box(0.46, hgt, 0.2, [0xE4572E, 0xF2B134, 0x8FB339, 0x7A4FA0, 0x2FA39A, 0xD94F70, 0xF6EFE2, 0x3B6FB8][Math.floor(R() * 8)], x0 + 0.5 + k * 0.62, 0.42 + lv * 0.86 + hgt / 2, z - sd * 0.68); }
}
scene.add(world.mesh());
// lane lamps: a lit box with the lane number (green when the line moves, red when it is stuck, dark when the till has closed)
const seg7 = (b, d, x, y, z, s, col) => { const on = { 1: 'bc', 2: 'abged', 3: 'abgcd' }[d], th = 0.16 * s; const SG = { a: [0, 0.5, 1], b: [0.25, 0.25, 0], c: [0.25, -0.25, 0], d: [0, -0.5, 1], e: [-0.25, -0.25, 0], f: [-0.25, 0.25, 0], g: [0, 0, 1] };
  for (const k of on) { const [dz, dy, hz] = SG[k]; b.box(0.06, hz ? th : 0.5 * s + th, hz ? 0.5 * s + th : th, col, x, y + dy * s, z + dz * s); } };
const lamps = {}, digits = new GB();
for (const l of LANES) { const m = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.86, 1.0), new THREE.MeshBasicMaterial({ color: 0xFFE9B0, toneMapped: false })); m.position.set(X0 + 2.7, 2.62, l * DZ - 1.3); scene.add(m); lamps[l] = m; seg7(digits, l + 2, X0 + 2.17, 2.62, l * DZ - 1.3, 0.5, 0x12131C); }
scene.add(new THREE.Mesh(digits.geo(), new THREE.MeshBasicMaterial({ vertexColors: true, toneMapped: false })));
const lampGlow = LANES.map(l => { const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: radial('rgba(255,255,255,0.8)', 'rgba(255,255,255,0)'), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0 })); sp.position.set(X0 + 2.5, 2.62, l * DZ - 1.3); sp.scale.setScalar(5.5); scene.add(sp); return sp; });
// cashiers
const cashiers = {}; for (const l of LANES) { const m = person({ robe: LCOL[l], skin: SKIN[(l + 3) % 5], short: [0x2A1E16, 0x6B4A2E, 0x1C1C22][l + 1], apron: true }); m.position.set(X0 + 1.1, 0, l * DZ - 2.25); m.rotation.y = -Math.PI / 2; scene.add(m); cashiers[l] = m; }

// ───────────────────────── the chart boards over the tills (they rise at the turn): every time a line moves, a green candle; every wait, a red one
const XB = X0 + 4.6, YB = 4.35, NC = 9;
const GREEN = new THREE.Color(0x2FD27F), RED = new THREE.Color(0xFF5A4E);
const boards = {};
for (const l of LANES) {
  const g = new THREE.Group(), b = new GB(); b.box(0.2, 2.3, 3.7, 0x141826, XB, YB, l * DZ - 0.3); b.box(0.24, 2.46, 0.12, 0x3A4156, XB, YB, l * DZ - 0.3 - 1.9); b.box(0.24, 2.46, 0.12, 0x3A4156, XB, YB, l * DZ - 0.3 + 1.9); b.box(0.24, 0.12, 3.9, 0x3A4156, XB, YB + 1.2, l * DZ - 0.3); b.box(0.24, 0.12, 3.9, 0x3A4156, XB, YB - 1.2, l * DZ - 0.3); for (const zz of [-1.75, 1.75]) b.cyl(0.08, 0.1, 3.3, 6, 0x5A5F66, XB + 0.12, 1.65, l * DZ - 0.3 + zz);
  const pm = b.mesh(); pm.castShadow = false; g.add(pm);
  const cs = []; for (let i = 0; i < NC; i++) { const mat = new THREE.MeshBasicMaterial({ color: 0x2FD27F, toneMapped: false }); const body = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1, 0.24), mat), wick = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1, 0.05), mat); body.position.set(XB - 0.16, YB, l * DZ - 0.3 - 1.44 + i * 0.36); wick.position.copy(body.position); g.add(body, wick); cs.push({ body, wick, mat }); }
  scene.add(g); boards[l] = { g, cs };
}

// ───────────────────────── the queues
const HAIR = [0x2A1E16, 0x4A3222, 0x1C1C22, 0x6B4A2E, 0x9A9FA6, 0xC98A3C];
const TOPS = [0x3B6FB8, 0xB8383B, 0x2FA39A, 0x7A4FA0, 0x4C9A62, 0xD9664A, 0x3B4A9A, 0xE8E2D0, 0x5E6B7A, 0xD94F70];
const GOODS = [0xE4572E, 0xF2B134, 0x8FB339, 0x7A4FA0, 0x2FA39A, 0xD94F70, 0xF6EFE2, 0x3B6FB8];
const YOU_MAT = new THREE.MeshLambertMaterial({ vertexColors: true, emissive: 0xF7A600, emissiveIntensity: 0.12 });
function cartMesh(rr, milk) {
  const b = new GB(), fr = 0xB9C0CA;
  b.box(0.96, 0.05, 0.62, fr, 0, 0.62, 0); for (const z of [-0.3, 0.3]) b.box(0.96, 0.4, 0.04, fr, 0, 0.82, z); for (const x of [-0.47, 0.47]) b.box(0.04, 0.4, 0.62, fr, x, 0.82, 0);
  b.box(0.9, 0.04, 0.56, 0x8A8F96, 0, 0.3, 0);
  for (const x of [-0.42, 0.42]) for (const z of [-0.27, 0.27]) { b.box(0.05, 0.5, 0.05, 0x8A8F96, x, 0.36, z); b.cyl(0.08, 0.08, 0.07, 6, 0x2A2E36, x, 0.08, z, Math.PI / 2, 0, 0); }
  b.box(0.06, 0.06, 0.7, 0xD94F3A, -0.6, 1.12, 0); for (const z of [-0.3, 0.3]) b.box(0.16, 0.06, 0.05, 0x8A8F96, -0.53, 1.1, z);
  if (milk) { }       // you: a carton of milk
  else { const n = 2 + Math.floor(rr() * 3); for (let i = 0; i < n; i++) { const hgt = 0.22 + rr() * 0.26; b.box(0.2 + rr() * 0.1, hgt, 0.2 + rr() * 0.1, GOODS[Math.floor(rr() * GOODS.length)], -0.3 + i * 0.25, 0.86 + hgt / 2, (rr() - 0.5) * 0.3); } }
  return b.mesh();
}
function shopper(rr, you = false) {
  const g = new THREE.Group();
  const p = you ? person({ robe: 0xF7A600, skin: SKIN[3], short: 0x2A1E16, shirt: 0xFFFDF5 }) : person({ robe: TOPS[Math.floor(rr() * TOPS.length)], skin: SKIN[Math.floor(rr() * SKIN.length)], short: HAIR[Math.floor(rr() * HAIR.length)], s: 0.93 + rr() * 0.12 });
  if (you) p.material = YOU_MAT;
  const c = cartMesh(rr, you); c.position.x = 1.02; g.add(p, c);
  if (you) { const k = new GB(); k.box(0.38, 0.7, 0.38, 0xFFFFFF, 1.12, 1.19, 0); k.box(0.39, 0.16, 0.39, 0x2F6FD8, 1.12, 1.62, 0); k.box(0.39, 0.2, 0.39, 0x2F6FD8, 1.12, 1.0, 0); k.cone(0.2, 0.14, 4, 0x2F6FD8, 1.12, 1.77, 0, 0, Math.PI / 4, 0); g.add(new THREE.Mesh(k.geo(), new THREE.MeshBasicMaterial({ vertexColors: true, toneMapped: false }))); } g.userData = { ph: rr() * 6.28 }; scene.add(g); return g;
}
const LANE = {}; for (const l of LANES) LANE[l] = { l, z: l * DZ, serve: [], mem: [] };
const mkMem = (l, tIn, o = {}) => { const m = Object.assign({ l, tIn, tOut: null, tServe: null }, o); LANE[l].mem.push(m); return m; };
for (const l of LANES) for (let i = 0; i < (l === 0 ? 4 : 5); i++) mkMem(l, -10 + i * 0.01);
// you: five stays, four switches. Every switch lands at the back of the new line.
const YOU = [mkMem(0, -9.95, { you: 1, tOut: T.h1a }), mkMem(1, T.h1b, { you: 1, tOut: T.sw1 }), mkMem(0, T.sw1 + 0.8, { you: 1, tOut: T.sw2 }), mkMem(-1, T.sw2 + 0.8, { you: 1, tOut: T.h4 }), mkMem(1, T.h4 + 1.0, { you: 1 })];
mkMem(0, -9.94);
// when the shopper at the front is done. The line you leave always starts to move; the line you stand in waits.
LANE[0].serve = [0.9, 1.6, 2.3, 3.0, 3.7, 4.4, 6.4, T.fastest + 0.05, 13.4, 15.9, 18.3, T.sw2 + 0.95, T.sw2 + 1.7, 25.6, 28.2, 30.6, 33.0];
LANE[1].serve = [T.one + 0.05, 16.2, T.sw1 + 0.95, T.sw1 + 1.65, 24.4, 27.4, 30.2, 33.4, 36.2];
LANE[-1].serve = [2.9, T.three + 0.3, 12.9, 15.3, 17.9, 20.3, T.six + 0.1, T.sooner + 0.1];
for (const l of LANES) { const stop = l === 1 ? T.h4 : T.b10; for (const ts of LANE[l].serve) if (ts < stop) mkMem(l, ts + 1.0); }     // someone new joins the back
for (let k = 0; k < 9; k++) { LANE[0].serve.push(T.b10 + 0.5 + k * 0.62); LANE[-1].serve.push(T.h4 + 0.9 + k * 0.55); }                 // evening: the two lines you left empty out
for (const l of LANES) {
  const L = LANE[l], ev = []; L.mem.forEach(m => { ev.push([m.tIn, 1, m]); if (m.tOut != null) ev.push([m.tOut, 2, m]); }); L.serve.forEach(t => ev.push([t, 0, null])); ev.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const q = []; L.done = []; L.len = [];
  for (const [t, kind, m] of ev) {
    if (kind === 1) { q.push(m); m.slots = [[t, q.length - 1]]; }
    else { if (kind === 2) q.splice(q.indexOf(m), 1); else { const f = q.shift(); if (f) { if (f.you) throw new Error('you would be served at ' + t); f.tServe = t; L.done.push(t); } }
      q.forEach((x, i) => { if (x.slots[x.slots.length - 1][1] !== i) x.slots.push([t, i]); }); }
    L.len.push([t, q.length]);
  }
  L.tEmpty = q.length ? Infinity : L.done[L.done.length - 1];
  for (const m of L.mem) if (!m.you) m.g = shopper(R);
}
const youG = shopper(R, true);
const lenAt = (l, t) => { let n = 0; for (const [tt, k] of LANE[l].len) { if (tt > t) break; n = k; } return n; };
const lastDone = (l, t) => { let x = -10; for (const tt of LANE[l].done) { if (tt > t) break; x = tt; } return x; };
function slotAt(m, t) { let s = m.slots[0][1]; for (let i = 1; i < m.slots.length; i++) { const [te, ns] = m.slots[i], t0 = te + 0.07 * ns; if (t <= t0) break; s = lerp(s, ns, eio(seg(t, t0, t0 + 0.42))); } return s; }
// where a member stands at time t: [x, z, visible]
function memPos(m, t) {
  const z = LANE[m.l].z;
  if (m.tServe != null && t >= m.tServe + 0.25) { const u = t - m.tServe - 0.25, x = X0 + 2.6 * eo(c01(u / 0.7)) + Math.max(0, u - 0.7) * 3.4; return [x, z, x < 13.2 ? 1 : Math.max(0, 1 - (x - 13.2) / 0.9)]; }
  if (t < m.tIn) { const u = (t - (m.tIn - 1.8)) / 1.8; return u <= 0 ? [0, z, 0] : [lerp(slotX(m.slots[0][1]) - 9, slotX(m.slots[0][1]), eo(u)), z, Math.min(1, u * 4)]; }
  return [slotX(slotAt(m, t)), z, 1];
}
// you: standing in a line, or in the air between two
function youAt(t) {
  let i = 0; while (i < YOU.length - 1 && t >= YOU[i].tOut) i++;
  const cur = YOU[i];
  if (t >= cur.tIn || i === 0) { const p = memPos(cur, Math.max(t, cur.tIn)); return [p[0], 0, p[1], 0]; }
  const prev = YOU[i - 1], a = memPos(prev, prev.tOut), b = memPos(cur, cur.tIn), u = seg(t, prev.tOut, cur.tIn), e = eio(u), far = Math.abs(b[1] - a[1]) > DZ * 1.5;
  return [lerp(a[0], b[0], e), Math.sin(Math.PI * u) * (far ? 2.3 : 1.45), lerp(a[1], b[1], e), u];
}
const HOPS = YOU.slice(1).map((m, i) => [YOU[i].tOut, m.tIn]);
const youTg = (dx = 0, dy = 0, dz = 0) => t => { const p = youAt(t); return [p[0] + dx, dy + p[1] * 0.5, p[2] + dz]; };
const youRing = new THREE.Mesh(new THREE.RingGeometry(0.62, 0.86, 28).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: 0xF7A600, transparent: true, opacity: 0.85, toneMapped: false })); scene.add(youRing);
const youLight = new THREE.PointLight(0xFFD9A0, 0, 15, 1.3); scene.add(youLight);
const tillLight = new THREE.PointLight(0xFF8A70, 0, 18, 1.3); tillLight.position.set(X0 + 1.5, 3.4, DZ - 0.4); scene.add(tillLight);
// board ticks: a green candle for every shopper served, a red one for every 1.5 s of waiting. A page holds 9 candles.
for (const l of LANES) {
  const L = LANE[l], tk = L.done.map(t => [t, 1]); let last = -1.2, i = 0; const quiet = l === -1 ? [T.sw2, T.six] : null;
  for (let t = 0.3; t < Math.min(DUR, L.tEmpty); t += 0.05) { while (i < L.done.length && L.done[i] <= t) last = L.done[i++]; if (t - last >= 1.5 && !(quiet && t > quiet[0] && t < quiet[1])) { tk.push([t, 0]); last = t; } }
  if (l === -1) for (let k = 0; k < 3; k++) tk.push([T.r3 + k * 0.4, 0]);                // "three losses in a row" on the board of the line you are in
  tk.sort((a, b) => a[0] - b[0]);
  L.pages = []; let pg = null; const brk = l === -1 ? T.sw2 + 0.8 : -1;
  for (const [t, up] of tk) { if (!pg || pg.tk.length === NC || (brk > 0 && pg.t0 < brk && t >= brk)) { pg = { t0: t, tk: [], v: -0.6 }; L.pages.push(pg); } const v0 = pg.v; pg.v = Math.max(-0.82, Math.min(0.82, pg.v + (up ? 0.19 : -0.15))); pg.tk.push({ t, up, v0, v1: pg.v }); }
}

// ───────────────────────── the wall of thousands: every tile is a line you could be standing in
const NCOL = 50, NROW = 40, TW = 2.4, TH = 1.75, WX = 19.6, WY0 = 7.6;
const wall = new THREE.InstancedMesh(new THREE.BoxGeometry(0.3, TH * 0.84, TW * 0.9), new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false }), NCOL * NROW); wall.frustumCulled = false; scene.add(wall);
const TILE = []; for (let r = 0; r < NROW; r++) for (let c = 0; c < NCOL; c++) TILE.push({ r, c, y: WY0 + r * TH, z: (c - (NCOL - 1) / 2) * TW, ph: R(), rate: 0.7 + R() * 1.5, tin: T.arent + 0.05 + r * 0.045 + Math.abs(c - 25) * 0.007 });
const wallBack = new THREE.Mesh(new THREE.BoxGeometry(0.5, NROW * TH + 1.0, NCOL * TW + 1.2), new THREE.MeshBasicMaterial({ color: 0x0E1220, toneMapped: false })); scene.add(wallBack);
const MINE = 14 * NCOL + 25;                                                           // your tile: it sits still while others flash
const HOT = []; { const rr = rng(77); for (let t = T.b6 + 0.1, k = 0; t < T.b7 - 0.7; t += 0.34, k++) { let i; do { i = (9 + Math.floor(rr() * 14)) * NCOL + 18 + Math.floor(rr() * 15); } while (i === MINE || HOT.some(h => h.i === i)); HOT.push({ i, t0: t }); } }
const _m4 = new THREE.Matrix4(), _p = new THREE.Vector3(), _q = new THREE.Quaternion(), _s = new THREE.Vector3(), _c = new THREE.Color();
for (let i = 0; i < TILE.length; i++) { wall.setMatrixAt(i, _m4.makeScale(0, 0, 0)); wall.setColorAt(i, _c.setRGB(0, 0, 0)); }

// ───────────────────────── camera path (spherical keys around a target; `up` tilts the view so the subject sits lower in the frame)
// The first 10 seconds change picture about every 1.5 s: a quick move (mv 3) on a word.
const CAM = [
  { t: 0, tg: [-0.6, 0.9, 2.2], d: 19.5, az: -88, el: 27, dn: 4.5 },                                   // frame 0: two queues from behind and above, you in the air between them
  { t: 1.3, tg: [-0.8, 0.9, 2.3], d: 17.5, az: -85, el: 25, dn: 4, mv: 1 },
  { t: T.left - 0.3, tg: [-0.6, 0.9, 2.2], d: 16.8, az: -83, el: 24, dn: 4 },
  { t: T.left + 0.1, tg: [1.5, 1.0, 0.3], d: 14.9, az: -62.7, el: 10, dn: 3, mv: 3 },                  // "the line you left": over your shoulder, watching it go
  { t: T.turn, tg: [2.0, 1.0, 0.2], d: 14.2, az: -61, el: 10, dn: 3 },
  { t: T.same + 0.12, tg: [XB, YB - 0.2, -0.3], d: 12, az: -90, el: 2, dn: 2, mv: 3 },                 // the turn: the chart board over the line you left (green)
  { t: T.trade - 0.05, tg: [XB, YB - 0.2, -0.3], d: 11.6, az: -90, el: 2, dn: 2 },
  { t: T.trade + 0.3, tg: [XB, YB - 0.2, DZ - 0.3], d: 12, az: -90, el: 2, dn: 2, mv: 3 },             // ... and the one over yours (red)
  { t: T.why - 0.1, tg: [XB, YB - 0.2, DZ - 0.3], d: 11.6, az: -90, el: 2, dn: 2 },
  { t: T.why + 0.4, tg: [-0.2, 0, 0], d: 35, az: -90, el: 58, dn: 3.5, mv: 3 },                        // "here's why": straight above the three lines
  { t: T.fastest, tg: [-0.2, 0, 0], d: 33.5, az: -90, el: 58, dn: 3.5 },
  { t: T.one + 0.25, tg: [-0.2, 0, 0.8], d: 30, az: -89, el: 57, dn: 3.5, mv: 3 },                     // "one time in three": closer
  { t: T.b5 - 0.05, tg: [-0.2, 0, 0.8], d: 29.5, az: -89, el: 57, dn: 3.5 },
  { t: T.arent + 0.2, tg: [WX, 15, 0], d: 62, az: -90, el: 3, up: 0.04, mv: 1 },                        // tilt up: the wall rises
  { t: T.thousands + 0.7, tg: [WX, 40, 0], d: 124, az: -90, el: -6, up: 0.0, mv: 1 },                   // "thousands": the whole wall
  { t: T.b6, tg: [WX, 38, 0], d: 112, az: -91, el: -6, up: 0.0 },
  { t: T.always + 0.2, tg: [WX, 33, 0.5], d: 72, az: -90, el: -5, up: 0.0, mv: 3 },                     // "always moving faster": closer, tiles flashing all round yours
  { t: T.b7 - 0.15, tg: [WX, 32.5, 0.8], d: 64, az: -88, el: -5, up: 0.0 },
  { t: T.b7 + 0.3, tg: [-2.6, 0.8, 0], d: 28, az: -84, el: 24, dn: 4, mv: 3 },                          // back down: all three lines, and you switch twice
  { t: T.sw2 + 0.9, tg: [-2.8, 0.8, -0.6], d: 26, az: -88, el: 23, dn: 4 },
  { t: T.back + 0.45, tg: youTg(0.5, 0.9, 0), d: 11.5, az: -100, el: 14, dn: 4, mv: 3 },                // "the back of a new line"
  { t: T.rehook - 0.05, tg: youTg(0.5, 0.9, 0), d: 10.8, az: -103, el: 14, dn: 4 },
  { t: T.rehook + 0.4, tg: [XB, YB - 0.35, -DZ - 1.3], d: 7.2, az: -90, el: 2, dn: 2, mv: 3 },          // rehook: the board over your line, three red candles
  { t: T.b9 - 0.05, tg: [XB, YB - 0.35, -DZ - 1.3], d: 6.6, az: -90, el: 2, dn: 2 },
  { t: T.b9 + 0.45, tg: youTg(1.0, 0.9, 0), d: 13, az: -110, el: 16, dn: 7, mv: 3 },                    // 20 trades: you, waiting, as the light goes (the strip sits above)
  { t: T.sooner, tg: youTg(1.0, 0.9, 0), d: 12.5, az: -118, el: 16, dn: 7 },
  { t: T.b10 - 0.05, tg: youTg(1.0, 0.9, 0), d: 12.3, az: -122, el: 16, dn: 7 },
  { t: T.b10 + 0.4, tg: youTg(0.55, 0.95, 0), d: 8.4, az: -172, el: 7, dn: 5, mv: 3 },                  // ten minutes for milk: you and the carton, from the side
  { t: T.but, tg: youTg(0.55, 0.95, 0), d: 7.9, az: -176, el: 7, dn: 5 },
  { t: T.h4 + 1.0, tg: [-2.4, 0.8, 0.6], d: 27, az: -86, el: 24, dn: 5, mv: 1 },                        // ... and you switch again, right across the shop
  { t: T.b11, tg: [-2.4, 0.6, 0.8], d: 27.5, az: -88, el: 25, dn: 6 },
  { t: T.b11 + 0.9, tg: [-2.6, 0, 2.4], d: 31, az: -86, el: 33, dn: 5.3, mv: 1 },                       // night: two empty lines and yours
  { t: DUR + 0.4, tg: [-3.0, 0, 3.3], d: 26, az: -88, el: 31, dn: 6.5 },
];
for (const k of CAM) if (k.dn != null) { const e = k.el * Math.PI / 180; k.up = Math.sin(e) - Math.cos(e) * Math.tan(e - k.dn * Math.PI / 180); }
const tgOf = (k, t) => typeof k.tg === 'function' ? k.tg(t) : k.tg;
const camTg = new THREE.Vector3(); let camD = 30;
function setCamera(t) {
  let i = 0; while (i < CAM.length - 2 && t >= CAM[i + 1].t) i++;
  const a = CAM[i], b = CAM[i + 1]; let u = seg(t, a.t, b.t); if (b.mv === 1) u = eio(u); else if (b.mv === 2) u = u * u; else if (b.mv === 3) u = 1 - (1 - u) * (1 - u);
  const ta = tgOf(a, t), tb = tgOf(b, t), tg = [lerp(ta[0], tb[0], u), lerp(ta[1], tb[1], u), lerp(ta[2], tb[2], u)];
  const d = lerp(a.d, b.d, u), az = lerp(a.az, b.az, u) * Math.PI / 180, el = lerp(a.el, b.el, u) * Math.PI / 180, up = lerp(a.up ?? 0.07, b.up ?? 0.07, u);
  const wob = [Math.sin(t * 0.9) * 0.012 * d, Math.sin(t * 1.3 + 1) * 0.008 * d];
  camera.position.set(tg[0] + d * Math.cos(el) * Math.sin(az) + wob[0] * Math.cos(az), Math.max(tg[1] + d * Math.sin(el) + wob[1], 1.2), tg[2] + d * Math.cos(el) * Math.cos(az) - wob[0] * Math.sin(az));
  camera.lookAt(tg[0], tg[1] + up * d, tg[2]); camera.updateMatrixWorld();
  camTg.set(tg[0], tg[1], tg[2]); camD = d;
}

// ───────────────────────── overlay (captions, banner, labels)
const ui = document.getElementById('ui'); const _v = new THREE.Vector3();
function proj(x, y, z) { _v.set(x, y, z).project(camera); return [(_v.x * 0.5 + 0.5) * W, (-_v.y * 0.5 + 0.5) * H, _v.z < 1]; }
function mk(cls, html = '') { const e = document.createElement('div'); e.className = 'abs ' + cls; e.innerHTML = html; e.style.opacity = 0; ui.appendChild(e); return e; }
let banEl = null;
function place(e, x, y, o = 1, sc = 1, ax = '-50%', ay = '-50%') { e.style.opacity = o.toFixed(3); if (o <= 0.001) return; e.style.transform = `translate(${x.toFixed(1)}px,${y.toFixed(1)}px) translate(${ax},${ay}) scale(${sc.toFixed(3)})`; }
function put(e, x, y, o = 1, sc = 1, ax = '-50%', ay = '-50%') { if (SH && e !== banEl) y += SH * c01((900 - y) / 300); place(e, x, y, o, sc, ax, ay); }      // screen positions are written as if there were no banner
const YMIN = SH ? 700 : 540;
const putW = (e, p, o, sc = 1, ymin = YMIN, ymax = 1560) => place(e, c01((p[0] - 170) / 740) * 740 + 170, Math.min(ymax, Math.max(ymin, p[1])), p[2] ? o : 0, sc);   // a label pinned to a point in the world (never under the banner or the captions)
const pop = (t, t0, d = 0.32) => t < t0 ? 0 : 0.82 + 0.18 * back(seg(t, t0, t0 + d));
const chunks = [];
{
  let clause = []; let si = 0;
  const flush = () => { const n = clause.length; if (!n) return; const k = Math.ceil(n / 3); let i = 0; for (let c = 0; c < k; c++) { const size = Math.ceil((n - i) / (k - c)); chunks.push({ ws: clause.slice(i, i + size) }); i += size; } clause = []; };
  for (const w of TIM.words) { if (w.si !== si) { flush(); si = w.si; } clause.push(w); if (/[.,?!:]$/.test(w.t)) flush(); }
  flush();
  chunks.forEach(c => { c.s = c.ws[0].s - 0.07; c.e = c.ws[c.ws.length - 1].e; });
  chunks[0].s = -1;                                              // the first words are on the cover frame
  chunks.forEach((c, i) => { const nx = chunks[i + 1]; c.hide = nx ? Math.min(nx.s, c.e + 0.5) : c.e + 0.8; });
}
const capEl = document.getElementById('cap'); let capIdx = -2; if (SH) capEl.style.top = (300 + SH) + 'px';
function updateCaption(t) {
  let idx = -1; for (let i = 0; i < chunks.length; i++) if (t >= chunks[i].s && t < chunks[i].hide) { idx = i; break; }
  if (idx !== capIdx) { capIdx = idx; capEl.innerHTML = idx < 0 ? '' : chunks[idx].ws.map(w => `<span class="w${w.kw ? ' kw' : ''}">${w.t.replace(/&/g, '&amp;')}</span>`).join(''); }
  if (idx < 0) return;
  const c = chunks[idx], spans = capEl.children, cover = idx === 0 && t < c.ws[0].s - 0.05;
  c.ws.forEach((w, i) => { const nx = c.ws[i + 1]; const st = cover ? 'cur' : t < w.s - 0.05 ? 'fut' : (nx && t >= nx.s - 0.05) ? 'said' : 'cur'; const cl = 'w' + (w.kw ? ' kw' : '') + (st === 'cur' ? '' : ' ' + st); if (spans[i].className !== cl) spans[i].className = cl; });
}
const mark = l => l.replace(/\*([^*]+)\*/g, '<em>$1</em>');
banEl = BAN ? mk('ban', (BAN.sub ? `<div class="s">${BAN.sub}</div>` : '') + `<div class="n">${BAN.lines.map(mark).join('\n')}</div>`) : null;
const subChip = !BAN && TIM.sub ? mk('chip', TIM.sub) : null;
const chip = mk('chip', ''), chipA = mk('chip am', 'same thing · when you trade');
const youTag = mk('tag am', 'you'), leftTag = mk('tag gr', 'the line you left'), stuckTag = mk('tag grey', 'price check…'), mineB = mk('tag am', 'your line');
const b13 = mk('board', '<div class="t">3 lines · same speed on average</div><div class="row"><b>1</b>time in<b>3</b></div><div class="y pips"><i></i><i></i><i></i></div><div class="src">how often your line is the fastest</div>');
const b13p = [...b13.querySelectorAll('i')];
const hotTags = [0, 1, 2].map(() => mk('tag gr', '▲ faster')), mineTag = mk('tag am', 'yours');
const placeTag = mk('tag am', 'back of the line · <b>6th</b>');
const rehookChip = mk('chip am', 'three losses in a row');
// 20 trades of a strategy that wins 6 in 10: 12 wins, 8 losses, and three of the losses in a row (trades 9-11)
const SEQ = 'GRGGRGGGRRRGGRGGRGGR';
const stripEl = mk('strip', '<div class="t">a strategy that wins <b>6</b> trades in <b>10</b></div><div class="d">' + [...SEQ].map((c, i) => `<i data-c="${c}"></i>` + (i === 9 ? '<br>' : '')).join('') + '</div><div class="f">3 losses in a row within 20 trades: <b>56%</b> of the time</div><div class="src">exact odds for independent trades · within 50 trades: 89%</div>');
const sDots = [...stripEl.querySelectorAll('i')], sF = stripEl.querySelector('.f'), sSrc = stripEl.querySelector('.src');
const DOT_T = [...SEQ].map((c, i) => T.strat + 0.2 + i * (T.l3 - 0.3 - T.strat - 0.2) / 19);
const milkEl = mk('strip two', '<div class="rw"><span>10 minutes · for milk</span><div class="d">' + '<i></i>'.repeat(10) + '</div></div><div class="rw"><span>10 trades · for a strategy</span><div class="d">' + '<i></i>'.repeat(10) + '</div></div><div class="f">gone after <b>3</b></div>');
const mRows = [...milkEl.querySelectorAll('.d')].map(d => [...d.children]), mF = milkEl.querySelector('.f');
const homeTag = mk('tag grey', 'the line you left · everyone’s home'), milkTag = mk('tag', 'milk');
const LS = TIM.lesson, lcard = LS ? mk('lcard', `<div class="k">${LS.label || 'The lesson'}</div><div class="n"><span>${mark(LS.lines[0])}</span>\n<span>${mark(LS.lines[1] || '')}</span></div>` + (LS.use ? `<div class="u">${LS.use}</div>` : '')) : null, lUse = lcard ? lcard.querySelector('.u') : null, lL2 = lcard ? lcard.querySelectorAll('.n span')[1] : null;
function fitHook() {
  if (banEl) { const n = banEl.querySelector('.n'), w = n.offsetWidth; if (w > 980) n.style.fontSize = (72 * 980 / w).toFixed(1) + 'px'; }
  if (lcard) { const n = lcard.querySelector('.n'); if (n.scrollWidth > 812) n.style.fontSize = (80 * 812 / n.scrollWidth).toFixed(1) + 'px'; if (lUse && lUse.scrollWidth > 812) lUse.style.fontSize = (38 * 812 / lUse.scrollWidth).toFixed(1) + 'px'; }
}
const foot = document.getElementById('foot');
foot.textContent = 'Three equally fast lines: yours is the fastest 1 time in 3. Streak odds: exact, for a 60% win rate and independent trades.\nAn illustration of how chance works, not a trading rule. Not financial advice.';
const setTxt = (e, s) => { if (e.textContent !== s) e.textContent = s; };
const setCls = (e, c) => { if (e.className !== c) e.className = c; };

function updateUI(t) {
  updateCaption(t);
  foot.style.opacity = (0.9 * seg(t, 0.8, 1.4) * (1 - 0.5 * seg(t, T.maybe1, T.maybe1 + 0.4))).toFixed(3);
  if (banEl) put(banEl, W / 2, 205, 1, 1, '-50%', '0%');
  if (subChip) put(subChip, W / 2, 472, win(t, -1, 2.7, 0.01, 0.3), 1);
  const y = youAt(t), night = sky.glow || 0;
  // you (the amber one), the line you left, the line that is stuck
  putW(youTag, proj(y[0], y[1] + 2.15, y[2]), Math.max(win(t, -1, T.same - 0.1, 0.01, 0.2), win(t, T.b7 + 0.5, T.back - 0.05, 0.2, 0.15), win(t, T.b9 + 0.7, T.b11 + 0.3, 0.25, 0.3)), 1);
  putW(leftTag, t < T.same ? proj(0.2, 2.7, 0) : proj(XB - 0.3, YB + 1.55, -0.3 - 0.8), win(t, T.left - 0.05, T.trade + 0.15, 0.2, 0.15), pop(t, T.left - 0.05) * (t < T.same ? 1 : pop(t, T.same + 0.3)));
  putW(mineB, proj(XB - 0.3, YB + 1.55, DZ - 0.3 - 0.9), win(t, T.trade + 0.5, T.why + 0.1, 0.18, 0.15), pop(t, T.trade + 0.5));
  putW(stuckTag, proj(X0 + 0.6, 2.6, DZ), win(t, 0.75, T.left - 0.35, 0.2, 0.2), pop(t, 0.75));
  put(chipA, W / 2, 472, win(t, T.same + 0.1, T.why - 0.1, 0.2, 0.2), pop(t, T.same + 0.1));                 // the turn, on screen as it is said
  // "one time in three": three rounds, one lamp wins each; the third is yours
  { const o = win(t, T.three - 0.1, T.b5 - 0.1, 0.25, 0.25), RT = [T.three + 0.3, T.fastest + 0.05, T.one + 0.05];
    b13p.forEach((e, i) => setCls(e, t < RT[i] ? '' : i === 2 ? 'on' : 'lo')); put(b13, W / 2, 1080, o, pop(t, T.three - 0.1) * (1 + 0.05 * win(t, T.one, T.one + 0.3, 0.08, 0.2))); }
  // chips (one line that says where we are)
  let ct = '', co = 0, cp = 0;
  for (const [a, b, s] of [[T.arent, T.thousands - 0.15, 'not three lines'], [T.thousands, T.b7 - 0.2, 'thousands of coins and stocks'], [T.sw2 + 0.25, T.rehook - 0.2, 'every switch · back of the line'], [T.proof + 0.1, T.strat - 0.3, 'it feels like proof']]) { const o = win(t, a, b, 0.22, 0.22); if (o > co) { co = o; ct = s; cp = pop(t, a); } }
  if (ct) setTxt(chip, ct); put(chip, W / 2, 472, co, cp);
  // the wall: tiles that flash, and yours
  hotTags.forEach((e, j) => { let h = null; HOT.forEach((x, k) => { if (k % 2 === 0 && (k / 2) % 3 === j && t >= x.t0 && t < x.t0 + 0.95) h = x; }); if (!h) return place(e, 0, 0, 0); const tl = TILE[h.i]; putW(e, proj(WX - 1, tl.y + 2.0, tl.z), win(t, h.t0 + 0.05, h.t0 + 0.8, 0.1, 0.15), pop(t, h.t0 + 0.05)); });
  { const tl = TILE[MINE]; putW(mineTag, proj(WX - 1, tl.y - 1.5, tl.z), win(t, T.thousands + 0.9, T.b7 - 0.05, 0.25, 0.2), pop(t, T.thousands + 0.9)); }
  // every switch: the back of the line
  putW(placeTag, proj(y[0], y[1] + 2.6, y[2]), win(t, T.back, T.rehook - 0.1, 0.18, 0.2), pop(t, T.back) * (1 + 0.08 * win(t, T.back, T.back + 0.3, 0.08, 0.2)));
  put(rehookChip, W / 2, 412, win(t, T.r3, T.proof + 0.05, 0.18, 0.2), pop(t, T.r3));
  // 20 trades
  { const o = win(t, T.strat - 0.05, T.b10 - 0.15, 0.25, 0.25); sDots.forEach((e, i) => setCls(e, t < DOT_T[i] ? '' : (SEQ[i] === 'G' ? 'g' : 'r') + (t >= T.l3 && i >= 8 && i <= 10 ? ' hl' : '')));
    sF.style.opacity = seg(t, T.l3 + 0.25, T.l3 + 0.55).toFixed(2); sSrc.style.opacity = seg(t, T.sooner, T.sooner + 0.3).toFixed(2); put(stripEl, W / 2, 1010, o, pop(t, T.strat - 0.05)); }
  // ten minutes for milk, ten trades for a strategy
  { const o = win(t, T.ten1 - 0.12, T.b11 - 0.2, 0.22, 0.25), n1 = Math.floor(c01((t - T.ten1) / 1.0) * 10.001), n2 = Math.min(3, Math.floor(c01((t - T.ten2) / 0.45) * 3.001));
    mRows[0].forEach((e, i) => setCls(e, i < n1 ? 'a' : '')); mRows[1].forEach((e, i) => setCls(e, i < n2 ? 'r' : t > T.trades + 0.25 ? 'x' : '')); mF.style.opacity = seg(t, T.trades + 0.25, T.trades + 0.5).toFixed(2);
    place(milkEl, W / 2, 748, o, pop(t, T.ten1 - 0.12)); }                    // high up, so you and the carton stay in view under it
  putW(milkTag, proj(y[0] + 1.12, y[1] + 2.12, y[2]), win(t, T.b10 + 0.6, T.but + 0.1, 0.2, 0.15), pop(t, T.b10 + 0.6), 915);
  // the end: the line you left has gone home; the last card
  { const p = proj(-4.2, 0.3, 0); place(homeTag, Math.min(800, Math.max(270, p[0])), Math.min(1560, Math.max(1150, p[1])), seg(t, T.b11 + 1.0, T.b11 + 1.3), pop(t, T.b11 + 1.0)); }
  if (lcard) { lL2.style.opacity = seg(t, T.maybe2, T.maybe2 + 0.3).toFixed(3); const u = seg(t, T.use, T.use + 0.35); lUse.style.opacity = u.toFixed(3); lUse.style.transform = `translateY(${((1 - eo(u)) * 16).toFixed(1)}px)`; put(lcard, W / 2, 940, seg(t, T.maybe1, T.maybe1 + 0.3), pop(t, T.maybe1)); }
}

// ───────────────────────── one frame
function lampState(l, t) {   // 0 dark · 1 waiting (red) · 2 just moved (green) · 3 plain
  const L = LANE[l]; if (t > L.tEmpty + 0.6) return [0, 0];
  const ld = lastDone(l, t); if (t - ld < 0.75) return [2, 1 - (t - ld) / 0.75];
  return t - ld > 1.8 ? [1, 0.75 + 0.25 * Math.sin(t * 5)] : [3, 1];
}
function renderAt(t) {
  const s = skyAt(t), night = s.glow;
  paintSky(s); scene.fog.color.setRGB(s.fog[0], s.fog[1], s.fog[2]);
  hemi.color.setRGB(...s.hemS); hemi.groundColor.setRGB(...s.hemG); hemi.intensity = s.hemI;
  sun.color.setRGB(...s.sunC); sun.intensity = s.sunI;
  const az = s.az * Math.PI / 180, el = s.el * Math.PI / 180, sd = [Math.cos(el) * Math.sin(az), Math.sin(el), Math.cos(el) * Math.cos(az)];
  starM.opacity = s.star * 0.9; stars.visible = s.star > 0.01;

  // the queues
  for (const l of LANES) for (const m of LANE[l].mem) { if (m.you) continue; const p = memPos(m, t), p2 = memPos(m, t - 0.05), v = Math.abs(p[0] - p2[0]) / 0.05; m.g.visible = p[2] > 0.01; if (!m.g.visible) continue; m.g.position.set(p[0], Math.abs(Math.sin(t * 9 + m.g.userData.ph)) * 0.07 * c01(v / 1.2), p[1]); m.g.scale.setScalar(p[2]); m.g.rotation.z = -0.05 * c01(v / 2.5); }
  const y = youAt(t), y2 = youAt(t - 0.05);
  youG.position.set(y[0], y[1], y[2]); youG.rotation.z = y[3] > 0 && y[3] < 1 ? Math.sin(y[3] * Math.PI * 2) * -0.16 : 0; youG.rotation.x = y[3] > 0 && y[3] < 1 ? (y[2] - y2[2]) * 0.35 : 0;
  { const land = HOPS.reduce((a, h) => Math.max(a, win(t, h[1], h[1] + 0.3, 0.06, 0.24)), 0); youG.scale.set(1 + 0.12 * land, 1 - 0.14 * land, 1 + 0.12 * land); }
  youRing.position.set(y[0] + 0.45, 0.05, y[2]); youRing.scale.setScalar(1.25 + 0.08 * Math.sin(t * 5)); youRing.material.opacity = 0.85 * (y[1] > 0.05 ? 0.45 : 1);
  YOU_MAT.emissiveIntensity = 0.12 + 0.5 * night; youLight.position.set(y[0] + 0.3, 3.6, y[2] + 0.4); youLight.intensity = 26 * night; tillLight.intensity = 16 * night;
  // lamps
  LANES.forEach((l, k) => { const [st, a] = lampState(l, t), m = lamps[l]; if (st === 0) m.material.color.setRGB(0.10, 0.11, 0.14); else if (st === 2) m.material.color.setRGB(lerp(1, 0.25, a), lerp(0.91, 1, a), lerp(0.69, 0.55, a)); else if (st === 1) m.material.color.setRGB(1, 0.36 * a, 0.3 * a); else m.material.color.setRGB(1, 0.91, 0.69);
    m.scale.setScalar(st === 2 ? 1 + 0.16 * a : 1); { const gone = seg(t, LANE[l].tEmpty + 1.0, LANE[l].tEmpty + 1.3); cashiers[l].scale.setScalar(1 - gone); cashiers[l].visible = gone < 0.99; } const g = lampGlow[k]; g.material.color.copy(m.material.color); g.material.opacity = st === 0 ? 0 : (0.12 + 0.5 * night) * (st === 2 ? 1 : 0.8); });
  // chart boards: they rise at the turn; candles pop as their line moves or waits
  for (const l of LANES) {
    const B = boards[l], L = LANE[l], up = back(seg(t, T.same - 0.05 + (l + 1) * 0.09, T.same + 0.45 + (l + 1) * 0.09)), dark = t > L.tEmpty + 0.6;
    B.g.visible = t > T.same - 0.05; B.g.position.y = -(1 - up) * 6.2;
    let pg = null; for (const p of L.pages) if (p.t0 <= t) pg = p;
    B.cs.forEach((c, i) => { const k = pg && pg.tk[i]; const sc = k && t >= k.t && !dark ? back(seg(t, k.t, k.t + 0.22)) : 0; c.body.visible = c.wick.visible = sc > 0.01; if (!sc) return;
      const h = 0.3; c.mat.color.copy(k.up ? GREEN : RED); c.body.scale.set(1, h * sc, 1); c.body.position.y = YB + (k.v0 + k.v1) / 2; c.wick.scale.set(1, (h + 0.26) * sc, 1); c.wick.position.y = YB + (k.v0 + k.v1) / 2; });
  }
  // the wall of thousands
  { const on = t > T.arent, k = eo(seg(t, T.arent, T.arent + 1.9)); wallBack.visible = on; wall.visible = on;
    if (on) { const hh = NROW * TH + 1.0; wallBack.scale.y = Math.max(0.001, k); wallBack.position.set(WX + 0.45, WY0 - TH / 2 - 0.3 + k * hh / 2, 0);
      const dim = 1 - 0.72 * night, hot = {}; for (const h of HOT) { const a = win(t, h.t0, h.t0 + 0.8, 0.08, 0.3); if (a > 0.01) hot[h.i] = a; }
      for (let i = 0; i < TILE.length; i++) { const tl = TILE[i], sc = t < tl.tin ? 0 : back(seg(t, tl.tin, tl.tin + 0.3)), a = hot[i] || 0; _p.set(WX, tl.y, tl.z - 0); _s.set(1 + 2 * a, sc * (1 + 0.5 * a), sc * (1 + 0.5 * a)); if (i === MINE) _s.set(2.4, sc * 1.25, sc * 1.25); wall.setMatrixAt(i, _m4.compose(_p, _q, _s));
        const kk = Math.floor(t * tl.rate + tl.ph * 10), g = hash(i * 7.13 + kk * 3.77) < 0.5, br = (0.26 + 0.34 * hash(i * 1.7 + kk * 9.1)) * dim;
        if (i === MINE) _c.setRGB(0.97, 0.65, 0.0); else if (a) _c.setRGB(lerp(0.1 * br, 0.4, a), lerp(0.8 * br, 1, a), lerp(0.45 * br, 0.65, a)); else if (g) _c.setRGB(0.10 * br, 0.80 * br, 0.45 * br); else _c.setRGB(1.0 * br, 0.30 * br, 0.27 * br); wall.setColorAt(i, _c); }
      wall.instanceMatrix.needsUpdate = true; wall.instanceColor.needsUpdate = true; } }

  setCamera(t);
  dome.position.copy(camera.position); stars.position.copy(camera.position);
  orb.position.set(camera.position.x + sd[0] * 1600, camera.position.y + sd[1] * 1600, camera.position.z + sd[2] * 1600); orb.scale.setScalar(s.orbS * 2); orb.lookAt(camera.position); orbM.color.setRGB(...s.orb);
  halo.position.copy(orb.position); halo.scale.setScalar(s.orbS * 13); halo.lookAt(camera.position); haloM.color.setRGB(...s.orb); haloM.opacity = 0.75;
  const S2 = Math.min(150, Math.max(18, camD * 0.85));
  sun.target.position.copy(camTg); sun.position.set(camTg.x + sd[0] * 340, camTg.y + sd[1] * 340, camTg.z + sd[2] * 340);
  const sc = sun.shadow.camera; sc.left = -S2; sc.right = S2; sc.top = S2; sc.bottom = -S2; sc.updateProjectionMatrix();
  renderer.render(scene, camera);
  updateUI(t);
}
window.camCheck = () => {
  const boxes = [[16.0, 16.6, -66, 66, 0, 6.1, 'shop front'], [WX - 0.3, WX + 0.8, -61, 61, 6.5, 80, 'wall']];
  for (const l of LANES) { boxes.push([X0 - 0.7, X0 + 2.9, l * DZ - 1.8, l * DZ - 0.8, 0, 1.5, 'counter ' + l], [XB - 0.3, XB + 0.3, l * DZ - 2.3, l * DZ + 1.7, YB - 1.3, YB + 1.3, 'board ' + l], [X0 + 2.1, X0 + 3.3, l * DZ - 1.9, l * DZ - 0.7, 0, 3.1, 'lamp ' + l], [-11.5, X0 + 1.3, l * DZ - 0.6, l * DZ + 0.6, 0, 1.9, 'queue ' + l]); }
  for (const sd of [-1, 1]) boxes.push([-14.5, 12.5, sd * 15.2 - 0.75, sd * 15.2 + 0.75, 0, 3.1, 'shelf']);
  const out = []; let cur = null;
  for (let f = 0; f < Math.ceil(DUR * 30); f++) {
    const t = f / 30; setCamera(t); const c = camera.position; let hit = null;
    for (const [x0, x1, z0, z1, y0, y1, nm] of boxes) if (c.x > x0 - 0.7 && c.x < x1 + 0.7 && c.z > z0 - 0.7 && c.z < z1 + 0.7 && c.y > y0 - 0.7 && c.y < y1 + 0.7) { hit = nm; break; }
    if (hit) { if (cur && cur[2] === hit && f - cur[1] <= 1) cur[1] = f; else { cur = [f, f, hit]; out.push(cur); } }
  }
  return out.map(([a, b, n]) => `${(a / 30).toFixed(2)}-${(b / 30).toFixed(2)}s ${n}`);
};
window.renderAt = renderAt;
const r3 = x => +x.toFixed(3);
window.CUES = { T, DUR, open: OPEN, arm: 'N', hops: HOPS.map(h => h.map(r3)), serves: LANES.flatMap(l => LANE[l].done.map(t => [r3(t), l])).sort((a, b) => a[0] - b[0]), joins: LANES.flatMap(l => LANE[l].mem.filter(m => !m.you && m.tIn > 0).map(m => r3(m.tIn))).sort((a, b) => a - b),
  red3: [0, 1, 2].map(k => r3(T.r3 + k * 0.4)), hot: HOT.map(h => r3(h.t0)), dots: DOT_T.map((t, i) => [r3(t), SEQ[i]]), off: LANES.filter(l => LANE[l].tEmpty < Infinity).map(l => [r3(LANE[l].tEmpty + 0.6), l]), rounds: [T.three + 0.3, T.fastest + 0.05, T.one + 0.05].map(r3), sent: TIM.sentences.map(s => s.s) };
document.fonts.ready.then(() => Promise.all(['700 64px Figtree', '800 72px Figtree', '800 30px JBM', '800 118px JBM', '700 22px Inter', '500 18px Inter', '900 80px Fraunces', '700 38px Figtree', '700 30px Figtree', '600 34px Figtree'].map(f => document.fonts.load(f)))).then(() => { fitHook(); renderAt(0); window.__ready = true; });
