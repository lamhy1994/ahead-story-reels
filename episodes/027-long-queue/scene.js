// The Long Queue — episode 27 (turn format, SKILL.md §0). Low-poly storybook scene, deterministic: window.renderAt(t) draws the frame for time t.
// One place for the whole video: an evening street with two noodle shops side by side, a long zigzag queue outside one, nobody next door.
// The picture changes meaning, not place: at the turn price boards rise over the roofs (the queue's board climbs as people join),
// then every head gets a hunch (almost all of them point next door), and night falls on the queue.
import * as THREE from 'three';
import { SKIN, rng, GB, person, WIN_LIT, GLASS_M } from './kit.js';

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
const R = rng(20261127);
const OPEN = Object.assign({ words: 'question', text: 'banner', picture: 'object', beat2: 'event', lock: 'turn' }, TIM.open || {});
const BAN = TIM.banner || null, SH = BAN ? 160 : 0;

// ───────────────────────── story clock (everything hangs off the narration)
const T = {
  beat2: wt(1, 'queue,') + 0.1,                                            // ≈1.5 s: the second event (pull back: the whole queue, and nobody next door)
  next1: wt(1, 'next') - 0.1, empty: wt(1, 'empty?') - 0.1,
  turn: S(2) - 0.05, trades: wt(2, 'trades') - 0.1, same: wt(2, 'same') - 0.1,
  why: S(3) - 0.05,
  b4: S(4) - 0.05, q4: wt(4, 'queue') - 0.1, know: wt(4, 'know') - 0.1,
  b5: S(5) - 0.05, two: wt(5, 'two') - 0.1, goin: wt(5, 'go') - 0.1, nxt: wt(5, 'next') - 0.1, ignores: wt(5, 'ignores') - 0.1, hunch: wt(5, 'hunch') - 0.1,
  b6: S(6) - 0.05, rising: wt(6, 'rising') - 0.1, q6: wt(6, 'queue') - 0.1, every: wt(6, 'every') - 0.1, buyer: wt(6, 'buyer') - 0.1, vote: wt(6, 'vote') - 0.1,
  b7: S(7) - 0.05, buy: wt(7, 'buy') - 0.1, become: wt(7, 'become') - 0.1, q7: wt(7, 'queue') - 0.1,
  rehook: S(8) - 0.05, rlong: wt(8, 'long') - 0.1, proof: wt(8, 'proof') - 0.1,
  b9: S(9) - 0.05, isnt: wt(9, "isn't") - 0.1, famous: wt(9, 'famous') - 0.1, n99: wt(9, 'ninety-nine') - 0.1, h9: wt(9, 'hundred') - 0.1, nd9: wt(9, 'next') - 0.1, better: wt(9, 'better') - 0.1,
  b10: S(10) - 0.05, one10: wt(10, 'one') - 0.1, first10: wt(10, 'first') - 0.1, so10: wt(10, 'so') - 0.05, all10: wt(10, 'all') - 0.1, here10: wt(10, 'here') - 0.1,
  b11: S(11) - 0.05, one11: wt(11, 'one', 0) - 0.1, dinner: wt(11, 'dinner') - 0.1, but11: wt(11, 'but') - 0.05, str11b: wt(11, 'stranger', 1) - 0.1, trade11: wt(11, 'trade') - 0.1,
  b12: S(12) - 0.05, maybe1: wt(12, 'maybe', 0) - 0.1, crowd: wt(12, 'crowd') - 0.1, maybe2: wt(12, 'maybe', 1) - 0.1, first12: wt(12, 'first') - 0.1,
  end: E(12),
};
T.use = T.end + 0.3;
window.T = T;

// ───────────────────────── renderer, sky, light
const canvas = document.getElementById('gl');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: QP.get('aa') !== '0', preserveDrawingBuffer: true });
renderer.setPixelRatio(1); renderer.setSize(W, H, false);
renderer.toneMapping = THREE.NeutralToneMapping; renderer.toneMappingExposure = 1.0;
renderer.shadowMap.enabled = QP.get('sh') !== '0'; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
const scene = new THREE.Scene(); scene.fog = new THREE.Fog(0xffffff, 90, 620);
const camera = new THREE.PerspectiveCamera(35, W / H, 0.3, 2400);
const hemi = new THREE.HemisphereLight(0xffffff, 0x886644, 1.5); scene.add(hemi);
const sun = new THREE.DirectionalLight(0xffffff, 3); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); sun.shadow.bias = -0.0005; sun.shadow.normalBias = 0.3; sun.shadow.camera.near = 1; sun.shadow.camera.far = 760; scene.add(sun, sun.target);

const hx = h => { const c = new THREE.Color(h); return [c.r, c.g, c.b]; };
const P = (top, mid, hor, fog, sunC, sunI, hemS, hemG, hemI, star, glow, az, el, orb, orbS) => ({ top: hx(top), mid: hx(mid), hor: hx(hor), fog: hx(fog), sunC: hx(sunC), sunI, hemS: hx(hemS), hemG: hx(hemG), hemI, star, glow, az, el, orb: hx(orb), orbS });
const PRE = {
  NIGHT: P(0x070B24, 0x141C4B, 0x30326A, 0x262A5E, 0xB4C2FF, 2.0, 0x5567C4, 0x3A3048, 1.5, 1, 1, 200, 42, 0xFFF4D6, 30),
  GOLDEN: P(0x3C7FCB, 0xF2C58A, 0xFFD79A, 0xF6CF9A, 0xFFC878, 3.2, 0xE8D2B0, 0xC08A55, 1.5, 0, 0.25, 214, 24, 0xFFE0A0, 44),
  SUNSET: P(0x2E2F72, 0xE0707A, 0xFFB25E, 0xEE9A6A, 0xFF9050, 2.6, 0xA98AC0, 0x8A5A44, 1.25, 0.12, 0.55, 206, 10, 0xFFB060, 50),
  DUSK: P(0x141A4C, 0x4A3F86, 0xC06A78, 0x6A4A78, 0x93A4F4, 1.8, 0x5A62B0, 0x3A2A40, 1.2, 0.65, 0.85, 204, 36, 0xFFF4D6, 30),
};
// one evening on the street: golden while the queue grows, sunset from the rehook, night for the last line
const SKY = [[0, 'GOLDEN'], [T.b6, 'GOLDEN'], [T.rehook + 1.0, 'SUNSET'], [T.b10, 'SUNSET'], [T.b11 + 0.6, 'DUSK'], [T.b12 + 1.2, 'NIGHT'], [DUR + 1, 'NIGHT']];
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
// canvas textures drawn once the fonts are in (signs, the ticket, the hunch bubbles)
const TEX = [];
function canvasTex(w, h, draw) { const cv = document.createElement('canvas'); cv.width = w; cv.height = h; const tx = new THREE.CanvasTexture(cv); tx.colorSpace = THREE.SRGBColorSpace; tx.anisotropy = 4; TEX.push(() => { draw(cv.getContext('2d'), w, h); tx.needsUpdate = true; }); return tx; }
function rrect(g, x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }

// ───────────────────────── the street: two noodle shops side by side, fronts on z = 0 facing +z. A (here) on the left, B (next door) on the right.
const floor = new THREE.Mesh(new THREE.PlaneGeometry(3000, 3000).rotateX(-Math.PI / 2), new THREE.MeshLambertMaterial({ color: 0xCDBFA8 })); floor.receiveShadow = true; scene.add(floor);
const world = new GB(), litB = new GB();
for (let i = -40; i <= 40; i++) world.box(0.05, 0.02, 14.2, 0xBDAF97, i * 1.6, 0.01, 7.1);
for (let j = 0; j <= 9; j++) world.box(130, 0.02, 0.05, 0xBDAF97, 0, 0.01, j * 1.6);
world.box(200, 0.18, 0.5, 0xE4DACA, 0, 0.09, 14.45); world.box(200, 0.03, 8, 0x55585F, 0, 0.015, 18.7);                     // kerb and road
for (let i = -30; i <= 30; i++) world.box(2.2, 0.035, 0.18, 0xEDE6D6, i * 4.4, 0.03, 18.7);
world.box(200, 0.18, 3.0, 0xD9CDB8, 0, 0.09, 24.2);                                                                         // far pavement
const SHOP = { A: { cx: -5.5, door: -1.8, wall: 0xF3E0BD, aw: 0xC8423A, aw2: 0xF4EAD8, sign: '#C8423A', inside: 0xF7D9A2 }, B: { cx: 5.5, door: 1.8, wall: 0xE7EAE3, aw: 0x2FA39A, aw2: 0xEAF4F1, sign: '#2A8F87', inside: 0xDCE8E4 } };
const SW = 10, IH = 3.4, ID = 3.6, UH = 7.4;
for (const k of ['A', 'B']) {
  const s = SHOP[k], x0 = s.cx - SW / 2, x1 = s.cx + SW / 2, dw = 1.3, dh = 2.45;
  world.box(SW, UH - IH, 8, s.wall, s.cx, IH + (UH - IH) / 2, -4);                                                          // upper floors
  world.box(SW + 0.4, 0.35, 8.4, 0xB9A88A, s.cx, UH + 0.17, -4);                                                           // roof edge
  world.box(SW, IH, 8 - ID, s.wall, s.cx, IH / 2, -ID - (8 - ID) / 2);                                                    // the back of the ground floor
  world.box(SW - 0.3, 0.12, ID, k === 'A' ? 0xB8743E : 0x9FB5AE, s.cx, 0.06, -ID / 2);                                     // inside floor
  world.box(SW - 0.3, IH, 0.12, s.inside, s.cx, IH / 2, -ID + 0.06);                                                       // inside back wall (lit)
  for (const sx of [-1, 1]) world.box(0.3, IH, ID, s.wall, s.cx + sx * (SW / 2 - 0.15), IH / 2, -ID / 2);                 // side walls
  // front at z = 0: piers, sill, header; a door at s.door; glass in between
  const dl = s.door - dw / 2, dr = s.door + dw / 2;
  world.box(0.5, IH, 0.3, s.wall, x0 + 0.25, IH / 2, 0); world.box(0.5, IH, 0.3, s.wall, x1 - 0.25, IH / 2, 0);
  world.box(0.3, IH, 0.3, s.wall, k === 'A' ? dl - 0.15 : dr + 0.15, IH / 2, 0);
  world.box(SW, 0.7, 0.3, s.wall, s.cx, IH - 0.35, 0);
  const gx0 = k === 'A' ? x0 + 0.5 : dr + 0.3, gx1 = k === 'A' ? dl - 0.3 : x1 - 0.5;
  world.box(gx1 - gx0, 0.6, 0.3, s.wall, (gx0 + gx1) / 2, 0.3, 0);
  if (k === 'A') world.box(x1 - 0.5 - dr, IH - 0.7, 0.3, s.wall, (dr + x1 - 0.5) / 2, (IH - 0.7) / 2, 0); else world.box(dl - x0 - 0.5, IH - 0.7, 0.3, s.wall, (x0 + 0.5 + dl) / 2, (IH - 0.7) / 2, 0);
  world.box(dw + 0.3, IH - 0.7 - dh, 0.3, s.wall, s.door, dh + (IH - 0.7 - dh) / 2, 0);
  for (let i = 1; i < 4; i++) world.box(0.08, IH - 1.3, 0.12, 0x5A4636, gx0 + i * (gx1 - gx0) / 4, 0.6 + (IH - 1.3) / 2, 0.08);  // mullions
  s.glass = [gx0, gx1];
  // awning: stripes, sloping out over the pavement
  for (let i = 0; i < 12; i++) world.box(SW / 12, 0.08, 1.5, i % 2 ? s.aw2 : s.aw, x0 + (i + 0.5) * SW / 12, IH + 0.1, 0.72, -0.32, 0, 0);
  world.box(SW, 0.32, 0.06, s.aw, s.cx, IH - 0.18, 1.45);
  // upper windows (lit at night)
  for (let i = 0; i < 4; i++) for (let j = 0; j < 2; j++) { const wx = x0 + 1.4 + i * 2.4, wy = IH + 2.1 + j * 1.7; if (j === 0 && i > 0 && i < 3) continue; litB.box(1.2, 1.0, 0.08, 0x5E7F9A, wx, wy, 0.05); world.box(1.4, 0.12, 0.2, 0xEDE3CF, wx, wy - 0.58, 0.1); }
}
// inside A: full tables (diners); inside B: the same tables, empty
const TABLES = [-1.9, 0.1, 2.1];
for (const k of ['A', 'B']) {
  const s = SHOP[k];
  for (const tx of TABLES) {
    const x = s.cx + (k === 'A' ? tx - 0.9 : tx + 0.9), z = -1.7;
    world.box(1.3, 0.08, 0.9, 0xE8DCC4, x, 0.85, z); world.cyl(0.07, 0.09, 0.8, 6, 0x5A4636, x, 0.42, z);
    for (const dz of [-0.75, 0.75]) { world.box(0.5, 0.06, 0.5, k === 'A' ? 0xA0522D : 0x6E8C86, x, 0.5, z + dz); world.box(0.5, 0.6, 0.06, k === 'A' ? 0xA0522D : 0x6E8C86, x, 0.8, z + dz * 1.4); }
    if (k === 'A') for (const dx of [-0.28, 0.28]) { world.cyl(0.16, 0.12, 0.1, 8, 0xF6F1E6, x + dx, 0.94, z + 0.1); world.cyl(0.14, 0.14, 0.03, 8, 0xE0A33A, x + dx, 0.99, z + 0.1); }
  }
}
// rope barriers for the zigzag queue (posts and red ropes between the rows)
const DOOR_X = SHOP.A.door, ROW0 = 1.9, RS = 1.25, XR = -1.8, XL = -10.2, TR = RS / 2, SP = 0.8, NROW = 12;
for (let r = 0; r < 9; r++) {
  const z = ROW0 + (r + 0.5) * RS, leftGap = r % 2 === 0;            // the rope leaves a gap where the queue turns
  const xa = leftGap ? XL + 0.2 : XL - 0.6, xb = leftGap ? XR + 0.6 : XR - 0.2;
  const n = Math.round((xb - xa) / 2.1);
  for (let i = 0; i <= n; i++) { const x = xa + i * (xb - xa) / n; world.cyl(0.05, 0.07, 0.95, 6, 0xC9A64A, x, 0.475, z); world.cyl(0.13, 0.15, 0.06, 8, 0x8E7A3A, x, 0.03, z); world.ball(0.07, 0, 0xE3C25E, x, 0.98, z); }
  world.box(xb - xa, 0.06, 0.06, 0xA8323A, (xa + xb) / 2, 0.82, z);
}
// B's front: a menu board, two empty tables outside
world.box(0.06, 1.0, 0.62, 0x3A3F48, 2.9, 0.5, 1.2, 0, 0, 0.16); world.box(0.04, 0.8, 0.52, 0x2A8F87, 2.95, 0.52, 1.2, 0, 0, 0.16);
for (const tx of [5.6, 8.4]) { world.cyl(0.45, 0.45, 0.06, 10, 0xEAF4F1, tx, 0.78, 2.4); world.cyl(0.05, 0.07, 0.75, 6, 0x5A5F66, tx, 0.38, 2.4); for (const dx of [-0.75, 0.75]) world.box(0.42, 0.05, 0.42, 0x6E8C86, tx + dx, 0.48, 2.4); }
// the rest of the street: neighbours left and right, houses across the road
const NB = rng(77);
for (const [cx, w, h, col] of [[-15.5, 10, 8.6, 0xE3D3B4], [-25, 9, 6.2, 0xD9C2A0], [-34, 9, 9.4, 0xE8DCC6], [15.5, 10, 6.8, 0xD6C9B2], [25, 9, 9.0, 0xE9D9BC], [34, 9, 7.0, 0xDCCDB6]]) {
  world.box(w, h, 8, col, cx, h / 2, -4); world.box(w + 0.3, 0.3, 8.3, 0xB9A88A, cx, h + 0.15, -4); world.box(w, 0.3, 1.0, [0x3B6FB8, 0xD9664A, 0x4C9A62, 0x7A4FA0][Math.floor(NB() * 4)], cx, 3.0, 0.5, -0.3, 0, 0);
  for (let i = 0; i < Math.floor(w / 2.4); i++) for (let j = 0; j < Math.floor((h - 1) / 2.4); j++) { const tgt = NB() < 0.55 ? litB : world; tgt.box(1.1, 1.2, 0.08, 0x5E7F9A, cx - w / 2 + 1.3 + i * 2.4, 1.6 + j * 2.4, 0.05); }
}
for (let i = -6; i <= 6; i++) { const w = 7 + NB() * 3, h = 5 + NB() * 6; world.box(w, h, 7, [0xE3D3B4, 0xD9C2A0, 0xE8DCC6, 0xD6C9B2][i & 3], i * 10.5, h / 2, 46); for (let j = 0; j < 3; j++) (NB() < 0.5 ? litB : world).box(1.2, 1.2, 0.08, 0x5E7F9A, i * 10.5 - 2.5 + j * 2.5, 2 + NB() * (h - 3), 42.45); }
for (let i = -14; i <= 14; i++) { const x = i * 4.6 + (NB() - 0.5) * 2, z = 30 + NB() * 8, h = 2.4 + NB() * 2; world.cyl(0.14, 0.2, h * 0.55, 6, 0x8B6B43, x, h * 0.27, z); world.ball(h * 0.32, 1, [0x3F8F57, 0x4C9A62, 0x357F4C][Math.floor(NB() * 3)], x, h * 0.72, z); }
world.box(200, 0.04, 16, 0x9DB07A, 0, 0.02, 34.5);
scene.add(world.mesh());
const litMesh = new THREE.Mesh(litB.geo(), WIN_LIT); scene.add(litMesh);
// glass in the shop fronts, and a warm light inside each
for (const k of ['A', 'B']) { const [g0, g1] = SHOP[k].glass; const gm = new THREE.Mesh(new THREE.PlaneGeometry(g1 - g0, IH - 1.3), GLASS_M); gm.position.set((g0 + g1) / 2, 0.6 + (IH - 1.3) / 2, 0.06); gm.renderOrder = 2; scene.add(gm); }
const inLight = { A: new THREE.PointLight(0xFFC27A, 0, 14, 1.4), B: new THREE.PointLight(0xCFE8FF, 0, 14, 1.4) };
inLight.A.position.set(SHOP.A.cx, 2.8, -1.4); inLight.B.position.set(SHOP.B.cx, 2.8, -1.4); scene.add(inLight.A, inLight.B);
// the signs: the same word on both
const signTex = k => canvasTex(1024, 220, (g, w, h) => { g.fillStyle = SHOP[k].sign; rrect(g, 0, 0, w, h, 34); g.fill(); g.strokeStyle = 'rgba(255,245,220,.9)'; g.lineWidth = 10; rrect(g, 14, 14, w - 28, h - 28, 26); g.stroke(); g.fillStyle = '#FFF4DC'; g.font = '900 150px Fraunces'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('NOODLES', w / 2, h / 2 + 8); });
const signs = {};
for (const k of ['A', 'B']) { const m = new THREE.Mesh(new THREE.PlaneGeometry(6.2, 1.33), new THREE.MeshBasicMaterial({ map: signTex(k), toneMapped: false })); m.position.set(SHOP[k].cx, IH + 1.05, 0.16); scene.add(m); signs[k] = m; }
// paper lanterns along A's awning (they glow from the start: it is evening); two plain lamps at B
const lanternM = new THREE.MeshLambertMaterial({ color: 0xE8443A, emissive: 0xFF5A30, emissiveIntensity: 0.6 }), lampM = new THREE.MeshBasicMaterial({ color: 0xFFF3D6, toneMapped: false });
const lanternG = new GB(); for (let i = 0; i < 7; i++) { const x = SHOP.A.cx - 4.3 + i * 1.43; lanternG.ball(0.27, 1, 0xFFFFFF, x, IH - 0.72, 1.45, 1, 1.15, 1); lanternG.cyl(0.12, 0.12, 0.08, 8, 0x222222, x, IH - 0.38, 1.45); }
scene.add(new THREE.Mesh(lanternG.geo(), lanternM));
const lampsB = new THREE.Mesh(new GB().ball(0.18, 1, 0xFFFFFF, SHOP.B.cx - 2.6, IH - 0.55, 1.4).ball(0.18, 1, 0xFFFFFF, SHOP.B.cx + 2.6, IH - 0.55, 1.4).geo(), lampM); scene.add(lampsB);
const glowSpr = (x, y, z, col, s) => { const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: radial(col, 'rgba(255,255,255,0)'), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0 })); sp.position.set(x, y, z); sp.scale.setScalar(s); scene.add(sp); return sp; };
const glowA = [...Array(7)].map((_, i) => glowSpr(SHOP.A.cx - 4.3 + i * 1.43, IH - 0.72, 1.6, 'rgba(255,120,70,0.9)', 2.2));
const glowB = [glowSpr(SHOP.B.cx - 2.6, IH - 0.55, 1.5, 'rgba(255,240,210,0.9)', 1.8), glowSpr(SHOP.B.cx + 2.6, IH - 0.55, 1.5, 'rgba(255,240,210,0.9)', 1.8)];

// ───────────────────────── people
const HAIR = [0x2A1E16, 0x4A3222, 0x1C1C22, 0x6B4A2E, 0x9A9FA6, 0xC98A3C];
const TOPS = [0x3B6FB8, 0xB8383B, 0x2FA39A, 0x7A4FA0, 0x4C9A62, 0xD9664A, 0x3B4A9A, 0xE8E2D0, 0x5E6B7A, 0xD94F70];
const YOU_MAT = new THREE.MeshLambertMaterial({ vertexColors: true, emissive: 0xF7A600, emissiveIntensity: 0.12 });
// diners inside A (seated: lowered behind the tables)
for (const tx of TABLES) for (const dz of [-0.75, 0.75]) { const m = person({ robe: TOPS[Math.floor(R() * TOPS.length)], skin: SKIN[Math.floor(R() * SKIN.length)], short: HAIR[Math.floor(R() * HAIR.length)], s: 0.95 }); m.position.set(SHOP.A.cx + tx - 0.9, -0.38, -1.7 + dz * 1.05); m.rotation.y = dz < 0 ? -Math.PI / 2 : Math.PI / 2; scene.add(m); }
// B's waiter, at his door with nobody to serve
const waiter = person({ robe: 0x2A8F87, skin: SKIN[2], short: 0x1C1C22, apron: true }); waiter.position.set(2.75, 0, 0.95); waiter.rotation.y = -Math.PI / 2; scene.add(waiter);

// the queue's path: from A's door, then rows along x that zigzag away from the shop (s = 0 at the front, growing toward the back)
const PSEG = []; let PLEN = 0;
const addLine = (a, b) => { const L = Math.hypot(b[0] - a[0], b[1] - a[1]); PSEG.push({ k: 0, a, b, L, s0: PLEN }); PLEN += L; };
const addArc = (cx, cz, dir) => { const L = Math.PI * TR; PSEG.push({ k: 1, cx, cz, dir, L, s0: PLEN }); PLEN += L; };
addLine([DOOR_X, 0.9], [DOOR_X, ROW0]);
for (let r = 0; r < NROW; r++) { const z = ROW0 + r * RS, ev = r % 2 === 0; addLine(ev ? [XR, z] : [XL, z], ev ? [XL, z] : [XR, z]); addArc(ev ? XL : XR, z + TR, ev ? -1 : 1); }
function pathXZ(s) {
  if (s <= 0) return [DOOR_X, 0.9 + s * 0.9];                                    // beyond the front: into the shop
  let g = PSEG[PSEG.length - 1]; for (const q of PSEG) if (s < q.s0 + q.L) { g = q; break; }
  const u = c01((s - g.s0) / g.L);
  if (g.k === 0) return [lerp(g.a[0], g.b[0], u), lerp(g.a[1], g.b[1], u)];
  const th = -Math.PI / 2 + g.dir * u * Math.PI; return [g.cx + TR * Math.cos(th), g.cz + TR * Math.sin(th)];
}
function pathDir(s) { const a = pathXZ(s - 0.12), b = pathXZ(s + 0.12); return Math.atan2(-(a[1] - b[1]), a[0] - b[0]); }   // facing the front (rotation.y for a model that faces +x)
// queue members: 0..99 at frame 0 (you are number 100: index 99), then people who join behind you
const NQ = 100, YOU = 99;
const ADM = [T.goin + 0.05, T.goin + 0.6];                                       // "once two people go in": the front two are let in
const JOIN = [T.q6 - 0.15, T.every - 0.05, T.buyer + 0.1, T.vote, T.become - 0.1, T.rlong, T.proof, T.isnt + 0.1];      // every buyer looks like a vote
const MEM = [];
for (let k = 0; k < NQ + JOIN.length; k++) {
  const you = k === YOU, rr = R;
  const m = you ? person({ robe: 0xF7A600, skin: SKIN[3], short: 0x2A1E16, shirt: 0xFFFDF5 }) : person({ robe: TOPS[Math.floor(rr() * TOPS.length)], skin: SKIN[Math.floor(rr() * SKIN.length)], short: HAIR[Math.floor(rr() * HAIR.length)], s: 0.92 + rr() * 0.14 });
  if (you) m.material = YOU_MAT;
  const g = new THREE.Group(); g.add(m); scene.add(g);
  MEM.push({ k, g, ph: rr() * 6.28, tJ: k >= NQ ? JOIN[k - NQ] : null, look: (rr() - 0.5) * 0.5, spawn: [-0.5 + rr() * 3, 15.5 + rr() * 1.5] });
}
const slotOf = (m, t) => { let s = m.k; for (const a of ADM) { const d = a + 0.018 * m.k; s -= eio(seg(t, d, d + 0.55)); } return s; };
const youOpenTurn = t => 1 - eio(seg(t, T.why + 0.2, T.why + 1.0));               // the opening: you face the shop with your ticket, then turn back into line
function memPos(m, t) {   // [x, z, rotY, visible, walking]
  const sl = slotOf(m, t), s = sl * SP, [x, z] = pathXZ(s); let ry = pathDir(Math.max(s, 0.05)), vis = s < -0.5 ? c01(1 - (-0.5 - s) / 0.5) : 1, walk = 0;
  if (s < 0) ry = Math.PI / 2;                                                    // walking in: facing -z
  { const sl2 = slotOf(m, t - 0.06); walk = c01(Math.abs(sl - sl2) * SP / 0.06 / 1.0); }
  if (m.tJ != null) {
    if (t < m.tJ - 1.6) return [0, 0, 0, 0, 0];
    if (t < m.tJ) { const u = eo(seg(t, m.tJ - 1.6, m.tJ)), px = lerp(m.spawn[0], x, u), pz = lerp(m.spawn[1], z, u); return [px, pz, Math.atan2(-(z - m.spawn[1]), x - m.spawn[0]), Math.min(1, (t - m.tJ + 1.6) * 3), 1]; }
  }
  if (m.k === YOU) ry = lerp(ry, Math.PI / 2, youOpenTurn(t));
  return [x, z, ry + m.look * (m.k === YOU ? 0 : 1) * 0.6, vis, walk];
}
const youM = MEM[YOU];
const youRing = new THREE.Mesh(new THREE.RingGeometry(0.5, 0.7, 28).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: 0xF7A600, transparent: true, opacity: 0.85, toneMapped: false })); scene.add(youRing);
const youLight = new THREE.PointLight(0xFFD9A0, 0, 12, 1.3); scene.add(youLight);
// your queue ticket (frame 0 is the cover: the ticket, close, in your hand) and the arm that holds it
const ticketTex = canvasTex(720, 1000, (g, w, h) => {
  g.fillStyle = '#FFF6E2'; rrect(g, 0, 0, w, h, 40); g.fill();
  g.fillStyle = '#F7A600'; rrect(g, 0, 0, w, 190, 40); g.fill(); g.fillRect(0, 120, w, 70);
  g.fillStyle = '#1C1300'; g.font = '700 54px Inter'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('QUEUE  TICKET', w / 2, 98);
  g.fillStyle = '#7A6A50'; g.font = '700 64px Figtree'; g.fillText('your number', w / 2, 300);
  g.fillStyle = '#12131C'; g.font = '900 320px Fraunces'; g.fillText('100', w / 2, 560);
  g.strokeStyle = 'rgba(18,19,28,.25)'; g.setLineDash([18, 16]); g.lineWidth = 6; g.beginPath(); g.moveTo(50, 800); g.lineTo(w - 50, 800); g.stroke(); g.setLineDash([]);
  g.fillStyle = '#7A6A50'; g.font = '700 52px Figtree'; g.fillText('please wait', w / 2, 890);
  g.fillStyle = 'rgba(0,0,0,.08)'; for (let i = 0; i < 9; i++) { g.beginPath(); g.arc(40 + i * 80, h - 2, 14, 0, Math.PI * 2); g.fill(); }
});
const ticket = new THREE.Group();
{ const f = new THREE.Mesh(new THREE.PlaneGeometry(0.44, 0.62), new THREE.MeshBasicMaterial({ map: ticketTex, toneMapped: false, transparent: true })); f.position.z = 0.004; const bk = new THREE.Mesh(new THREE.PlaneGeometry(0.44, 0.62), new THREE.MeshLambertMaterial({ color: 0xEFE4CC })); bk.rotation.y = Math.PI; ticket.add(f, bk); }
const arm = new GB(); arm.cyl(0.075, 0.09, 0.62, 6, 0xF7A600, 0, 0, 0); arm.ball(0.09, 1, SKIN[3], 0, -0.34, 0);
const armM = new THREE.Mesh(arm.geo(), YOU_MAT); scene.add(ticket, armM);

// ───────────────────────── the price boards over the roofs (they rise at the turn): A's climbs a candle for every person who joins; B's stays flat
const NC = 15, GREEN = new THREE.Color(0x2FD27F), GREY = new THREE.Color(0x8E95A3), AMB = new THREE.Color(0xF7A600);
const BY = 11.2, BZ = -1.2, BX = { A: -3.0, B: 3.0 }, BW = 5.4;
const boards = {};
for (const k of ['A', 'B']) {
  const g = new THREE.Group(), b = new GB(), cx = BX[k];
  b.box(BW, 4.0, 0.2, 0x1A2134, cx, BY, BZ); b.box(BW + 0.24, 0.14, 0.26, 0x3A4156, cx, BY + 2.03, BZ); b.box(BW + 0.24, 0.14, 0.26, 0x3A4156, cx, BY - 2.03, BZ);
  for (const sx of [-1, 1]) { b.box(0.14, 4.2, 0.26, 0x3A4156, cx + sx * (BW / 2 + 0.05), BY, BZ); b.cyl(0.1, 0.12, 4.0, 6, 0x5A5F66, cx + sx * 2.0, BY - 3.9, BZ - 0.2); }
  for (let i = 1; i < 4; i++) b.box(BW - 0.4, 0.025, 0.05, 0x2A3144, cx, BY - 2 + i, BZ + 0.11);
  g.add(b.mesh());
  const cs = []; for (let i = 0; i < NC; i++) { const mat = new THREE.MeshBasicMaterial({ color: 0x2FD27F, toneMapped: false }); const body = new THREE.Mesh(new THREE.BoxGeometry(0.27, 1, 0.08), mat), wick = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1, 0.06), mat); body.position.set(cx - 2.38 + i * 0.34, BY, BZ + 0.16); wick.position.copy(body.position); g.add(body, wick); cs.push({ body, wick, mat }); }
  scene.add(g); boards[k] = { g, cs };
}
// candle ticks: A's first seven pop at the turn (a rising queue), then one for every person who joins; B's are flat
const TKA = []; { let v = -1.75; for (let i = 0; i < 7; i++) { const v0 = v; v += 0.22 + 0.06 * Math.sin(i * 2.1); TKA.push({ t: T.trades + 0.5 + i * 0.1, v0, v1: v, c: GREEN }); } for (const tj of JOIN) { const v0 = v; v += 0.19; TKA.push({ t: tj + 0.05, v0, v1: v, c: GREEN }); } }
const TKB = []; for (let i = 0; i < NC; i++) { const v = -1.2 + 0.03 * Math.sin(i * 1.7); TKB.push({ t: T.trades + 0.6 + i * 0.05, v0: v - 0.015, v1: v + 0.015, c: GREY }); }

// ───────────────────────── hunch bubbles over the heads: ✓ (they know something / this place), → (next door is better), grey → (ignored)
const bubbleTex = (bg, fg, ch, ring) => canvasTex(128, 128, (g, w, h) => { g.fillStyle = bg; g.beginPath(); g.arc(64, 58, 50, 0, Math.PI * 2); g.fill(); g.beginPath(); g.moveTo(50, 100); g.lineTo(64, 124); g.lineTo(78, 100); g.fill(); if (ring) { g.strokeStyle = ring; g.lineWidth = 6; g.beginPath(); g.arc(64, 58, 47, 0, Math.PI * 2); g.stroke(); } g.fillStyle = fg; g.font = '800 66px Figtree'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(ch, 64, 62); });
const BT = { know: bubbleTex('#F7A600', '#1C1300', '✓'), next: bubbleTex('#2FA39A', '#FFFFFF', '→'), here: bubbleTex('#F7A600', '#1C1300', '✓', '#FFFFFF'), grey: bubbleTex('#8E95A3', '#E9ECF2', '→') };
for (const m of MEM) { const mk2 = () => { const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: BT.know, transparent: true, depthWrite: false, toneMapped: false })); sp.visible = false; scene.add(sp); return sp; }; m.bub = mk2(); }
const FRONT = 2;                                   // after the first two go in, member 2 stands at the door: "the one who didn't" (her hunch: this place)
const HUND = MEM.filter(m => m.k >= FRONT && m.k < FRONT + 100);     // the hundred of the example
const tKnow = m => T.q4 + 0.05 + m.k * (T.know + 0.25 - T.q4) / (NQ + JOIN.length);
const tNext = m => T.n99 + 0.02 + (m.k - FRONT) * (T.h9 + 0.35 - T.n99) / 100;

// ───────────────────────── camera path (spherical keys around a target; `dn` = degrees below the middle of the frame for the target)
const youTg = (dx = 0, dy = 0, dz = 0) => t => { const p = memPos(youM, t); return [p[0] + dx, dy, p[1] + dz]; };
const tkTg = t => { const p = ticketPose(t); return [p[0], p[1], p[2]]; };
const CAM = [
  { t: 0, tg: tkTg, d: 1.85, az: 18, el: 6, dn: 2.6 },                                                 // frame 0 (the cover): your ticket, number 100, close
  { t: T.beat2 - 0.05, tg: tkTg, d: 1.78, az: 27, el: 7, dn: 2.6 },                                    // slowly circling
  { t: T.beat2 + 1.0, tg: [-1.2, 0.8, 5.0], d: 28, az: 12, el: 34, dn: 4.0, mv: 1 },                  // beat 2: pull back: the whole queue, and nobody next door
  { t: T.empty - 0.05, tg: [-0.8, 0.8, 4.6], d: 26.5, az: 14, el: 33, dn: 4.0 },
  { t: T.empty + 0.4, tg: [3.9, 1.6, 0.3], d: 13.5, az: 8, el: 8, dn: 3.0, mv: 3 },                    // "empty": next door, the waiter, the empty tables
  { t: T.turn - 0.05, tg: [3.7, 1.6, 0.3], d: 13, az: 6, el: 8, dn: 3.0 },
  { t: T.turn + 0.5, tg: [0, 3.6, -1.2], d: 31, az: 2, el: 6, dn: 1.0, mv: 3 },                        // the turn: both shops, side by side
  { t: T.trades + 0.05, tg: [0, 3.9, -1.2], d: 30.5, az: 1, el: 6, dn: 1.0 },
  { t: T.trades + 0.55, tg: [0, 10.4, -1.2], d: 35, az: 0, el: 5, dn: 1.2, mv: 3 },                    // ... and price boards rise over both roofs
  { t: T.same + 0.3, tg: [0, 10.4, -1.2], d: 34, az: 0, el: 5, dn: 1.2 },
  { t: T.same + 0.85, tg: [3.0, 10.8, -1.2], d: 16.5, az: -1, el: 3, dn: 2.0, mv: 3 },                  // ... next door's board: flat
  { t: T.why - 0.1, tg: [3.0, 10.8, -1.2], d: 16, az: -3, el: 3, dn: 2.0 },
  { t: T.why + 0.45, tg: [-6, 0, 6.2], d: 25, az: 2, el: 72, dn: 3, mv: 3 },                           // "here's why": above the queue
  { t: T.know - 0.2, tg: [-6, 0, 6.2], d: 22.5, az: 6, el: 66, dn: 3 },
  { t: T.know + 0.35, tg: [-5.5, 0.6, 5.8], d: 18.5, az: 10, el: 46, dn: 3.5, mv: 3 },                  // "know something": closer, every head ticked
  { t: T.b5 - 0.05, tg: [-5.4, 0.6, 5.6], d: 18, az: 12, el: 44, dn: 3.5 },
  { t: T.b5 + 0.45, tg: [-1.9, 2.0, 0.8], d: 5.8, az: 54, el: 12, dn: -1.0, mv: 3 },                   // "once two people go in": A's door
  { t: T.hunch + 0.3, tg: [-1.9, 2.0, 0.9], d: 5.5, az: 58, el: 12, dn: -1.0 },
  { t: T.b6 + 0.4, tg: [-3.0, 10.8, -1.2], d: 16.5, az: -2, el: 3, dn: 2.0, mv: 3 },                    // "a rising price is a queue": A's board
  { t: T.every - 0.05, tg: [-3.0, 10.6, -1.2], d: 16, az: 0, el: 3, dn: 2.0 },
  { t: T.every + 0.4, tg: [-3.2, 1.0, 11.0], d: 13, az: 32, el: 22, dn: 1.0, mv: 3 },                   // "every buyer looks like a vote": the back of the queue
  { t: T.b7 - 0.05, tg: [-3.4, 1.0, 11.0], d: 12.5, az: 30, el: 22, dn: 1.0 },
  { t: T.b7 + 0.4, tg: youTg(0.6, 1.0, 0.2), d: 10, az: 40, el: 24, dn: 2.5, mv: 3 },                   // "so you buy": you
  { t: T.rehook - 0.05, tg: youTg(0.8, 1.0, 0.2), d: 10.5, az: 46, el: 24, dn: 2.5 },
  { t: T.rehook + 0.8, tg: [-4.5, 0, 6.5], d: 48, az: 14, el: 60, dn: 3.5, mv: 1 },                     // rehook: the crane goes up, the queue is huge
  { t: T.isnt + 0.3, tg: [-4.5, 0, 6.5], d: 45, az: 16, el: 60, dn: 3.5 },
  { t: T.famous + 0.1, tg: [-4.6, 0.5, 6.0], d: 30, az: 12, el: 46, dn: -1.5, mv: 1 },                  // the hundred, and their hunches (the dots card sits under them)
  { t: T.b10 - 0.05, tg: [-4.6, 0.5, 5.8], d: 29, az: 14, el: 46, dn: -1.5 },
  { t: T.b10 + 0.45, tg: [-1.9, 2.0, 0.9], d: 6.4, az: 54, el: 13, dn: -1.2, mv: 3 },                    // "the one who didn't came first": the front of the queue
  { t: T.so10 - 0.05, tg: [-1.9, 2.0, 1.0], d: 6.1, az: 58, el: 13, dn: -1.2 },
  { t: T.all10 + 0.4, tg: [-4.6, 0.5, 5.6], d: 29, az: 18, el: 44, dn: -1.5, mv: 3 },                   // "so all hundred queued here"
  { t: T.b11 - 0.05, tg: [-4.6, 0.5, 5.6], d: 28, az: 20, el: 44, dn: -1.5 },
  { t: T.b11 + 0.45, tg: [-1.9, 1.9, 0.9], d: 5.4, az: 50, el: 10, dn: 0.5, mv: 3 },                     // "one stranger ... your dinner"
  { t: T.but11 - 0.45, tg: [-1.9, 1.9, 0.9], d: 5.2, az: 52, el: 10, dn: 0.5 },
  { t: T.but11 + 1.3, tg: [-3.0, 10.6, -1.2], d: 16.5, az: 2, el: 3, dn: 2.0, mv: 1 },                  // "... your trade": the first candle on A's board
  { t: T.b12 - 0.1, tg: [-3.0, 10.6, -1.2], d: 16, az: 4, el: 3, dn: 2.0 },
  { t: T.b12 + 0.9, tg: youTg(0, 0.9, 0), d: 19, az: -36, el: 26, dn: 7.5, mv: 1 },                     // night: you in the queue, next door going dark behind; the last card above
  { t: DUR + 0.4, tg: youTg(0, 0.9, 0), d: 22, az: -30, el: 28, dn: 8.0 },
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
  camera.position.set(tg[0] + d * Math.cos(el) * Math.sin(az) + wob[0] * Math.cos(az), Math.max(tg[1] + d * Math.sin(el) + wob[1], 0.9), tg[2] + d * Math.cos(el) * Math.cos(az) - wob[0] * Math.sin(az));
  camera.lookAt(tg[0], tg[1] + up * d, tg[2]); camera.updateMatrixWorld();
  camTg.set(tg[0], tg[1], tg[2]); camD = d;
}
// where your ticket is: up in front of your face for the opening, then down at your side
function ticketPose(t) {
  const p = memPos(youM, t), ry = p[2], fx = Math.cos(ry), fz = -Math.sin(ry), rx = -fz, rz = fx;      // facing (fx, fz), right hand side (rx, rz)
  const up = 1 - eio(seg(t, T.why + 0.1, T.why + 0.9));
  const x = p[0] + fx * lerp(0.22, 0.3, up) + rx * lerp(0.36, 0.52, up), z = p[1] + fz * lerp(0.22, 0.3, up) + rz * lerp(0.36, 0.52, up), y = lerp(0.95, 1.3, up);
  return [x, y, z, ry, up];
}

// ───────────────────────── overlay (captions, banner, labels)
const ui = document.getElementById('ui'); const _v = new THREE.Vector3();
function proj(x, y, z) { _v.set(x, y, z).project(camera); return [(_v.x * 0.5 + 0.5) * W, (-_v.y * 0.5 + 0.5) * H, _v.z < 1]; }
function mk(cls, html = '') { const e = document.createElement('div'); e.className = 'abs ' + cls; e.innerHTML = html; e.style.opacity = 0; ui.appendChild(e); return e; }
let banEl = null;
function place(e, x, y, o = 1, sc = 1, ax = '-50%', ay = '-50%') { e.style.opacity = o.toFixed(3); if (o <= 0.001) return; e.style.transform = `translate(${x.toFixed(1)}px,${y.toFixed(1)}px) translate(${ax},${ay}) scale(${sc.toFixed(3)})`; }
function put(e, x, y, o = 1, sc = 1, ax = '-50%', ay = '-50%') { if (SH && e !== banEl) y += SH * c01((900 - y) / 300); place(e, x, y, o, sc, ax, ay); }
const YMIN = SH ? 700 : 540;
const putW = (e, p, o, sc = 1, ymin = YMIN, ymax = 1560) => place(e, c01((p[0] - 170) / 740) * 740 + 170, Math.min(ymax, Math.max(ymin, p[1])), p[2] ? o : 0, sc);
const pop = (t, t0, d = 0.32) => t < t0 ? 0 : 0.82 + 0.18 * back(seg(t, t0, t0 + d));
const chunks = [];
{
  let clause = []; let si = 0;
  const flush = () => { const n = clause.length; if (!n) return; const k = Math.ceil(n / 3); let i = 0; for (let c = 0; c < k; c++) { const size = Math.ceil((n - i) / (k - c)); chunks.push({ ws: clause.slice(i, i + size) }); i += size; } clause = []; };
  for (const w of TIM.words) { if (w.si !== si) { flush(); si = w.si; } clause.push(w); if (/[.,?!:]$/.test(w.t)) flush(); }
  flush();
  chunks.forEach(c => { c.s = c.ws[0].s - 0.07; c.e = c.ws[c.ws.length - 1].e; });
  chunks[0].s = -1;
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
const youTag = mk('tag am', 'you'), waitTag = mk('tag', '<b>100</b> waiting'), noWait = mk('tag gr', 'no wait'), boardA = mk('tag am', 'the queue'), boardB = mk('tag grey', 'next door');
const inTags = [mk('tag am', '<b>1</b> in'), mk('tag am', '<b>2</b> in')], hunchTag = mk('tag', 'her hunch: next door');
const b2 = mk('board', '<div class="t">the queue effect</div><div class="row">after<b>2</b>people</div><div class="y src2">the next one ignores her own hunch</div><div class="src">Bikhchandani, Hirshleifer &amp; Welch, 1992</div>');
const voteTags = JOIN.map(() => mk('tag gr', '+1 vote')), youVote = mk('tag am', 'you · <b>+1</b>');
const dots = mk('dots', '<div class="t">a famous example · <b>100</b> people</div><div class="g">' + '<i></i>'.repeat(100) + '</div><div class="f"><span class="f1"><b>99</b> heard next door was better</span><span class="f2">all <b>100</b> queued here</span></div><div class="src">A. Banerjee, 1992</div>');
const dI = [...dots.querySelectorAll('.g i')], dF1 = dots.querySelector('.f1'), dF2 = dots.querySelector('.f2'), dSrc = dots.querySelector('.src');
const firstTag = mk('tag am', 'came first'), strTag = mk('tag am', '<b>1</b> stranger · your dinner'), strTag2 = mk('tag am', '<b>1</b> stranger · your trade');
const LS = TIM.lesson, lcard = LS ? mk('lcard', `<div class="k">${LS.label || 'The lesson'}</div><div class="n"><span>${mark(LS.lines[0])}</span>\n<span>${mark(LS.lines[1] || '')}</span></div>` + (LS.use ? `<div class="u">${LS.use}</div>` : '')) : null, lUse = lcard ? lcard.querySelector('.u') : null, lL2 = lcard ? lcard.querySelectorAll('.n span')[1] : null;
function fitHook() {
  if (banEl) { const n = banEl.querySelector('.n'), w = n.offsetWidth; if (w > 980) n.style.fontSize = (72 * 980 / w).toFixed(1) + 'px'; }
  if (lcard) { const n = lcard.querySelector('.n'); if (n.scrollWidth > 812) n.style.fontSize = (80 * 812 / n.scrollWidth).toFixed(1) + 'px'; if (lUse && lUse.scrollWidth > 812) lUse.style.fontSize = (38 * 812 / lUse.scrollWidth).toFixed(1) + 'px'; }
}
const foot = document.getElementById('foot');
foot.textContent = 'The 99-in-100 example: A. Banerjee, Quarterly Journal of Economics, 1992 (a model).\nAfter two people: Bikhchandani, Hirshleifer & Welch, 1992. Not financial advice.';
let dotsO = 0;
const setTxt = (e, s) => { if (e.textContent !== s) e.textContent = s; };
const setCls = (e, c) => { if (e.className !== c) e.className = c; };
const headP = (m, t, dy = 2.2) => { const p = memPos(m, t); return proj(p[0], dy, p[1]); };

function updateUI(t) {
  updateCaption(t);
  foot.style.opacity = (0.9 * seg(t, 0.8, 1.4) * (1 - 0.5 * seg(t, T.maybe1, T.maybe1 + 0.4)) * (1 - 0.85 * win(t, T.famous + 0.1, T.b11 - 0.15, 0.3, 0.25))).toFixed(3);
  if (banEl) put(banEl, W / 2, 205, 1, 1, '-50%', '0%');
  if (subChip) put(subChip, W / 2, 472, win(t, -1, 2.7, 0.01, 0.3), 1);
  // you
  putW(youTag, headP(youM, t, 2.25), Math.max(win(t, T.beat2 + 0.5, T.turn - 0.1, 0.2, 0.2), win(t, T.know + 0.3, T.b5 - 0.05, 0.2, 0.15), win(t, T.rehook + 0.6, T.b10 - 0.1, 0.25, 0.2), win(t, T.all10 + 0.3, T.b11 - 0.1, 0.2, 0.2), win(t, T.b12 + 0.9, DUR + 1, 0.3, 0.2)), 1);
  // beat 2: the whole queue, and nobody next door
  putW(waitTag, proj(-6.0, 2.7, 6.2), win(t, T.beat2 + 0.55, T.turn + 0.1, 0.2, 0.2), pop(t, T.beat2 + 0.55));
  putW(noWait, proj(2.75, 2.75, 0.95), win(t, T.beat2 + 0.35, T.turn + 0.2, 0.15, 0.2), pop(t, T.beat2 + 0.35) * (1 + 0.06 * win(t, T.empty + 0.3, T.empty + 0.7, 0.1, 0.2)));
  put(chipA, W / 2, 472, win(t, T.trades, T.why - 0.1, 0.2, 0.2), pop(t, T.trades));
  putW(boardA, proj(BX.A, BY - 2.7, BZ), win(t, T.trades + 0.3, T.same + 0.75, 0.15, 0.15), pop(t, T.trades + 0.3), 640);
  putW(boardB, proj(BX.B, BY - 2.7, BZ), win(t, T.trades + 0.4, T.why - 0.05, 0.15, 0.2), pop(t, T.trades + 0.4), 640);
  // one line at the top that says where we are
  let ct = '', co = 0, cp = 0;
  for (const [a, b, s] of [[T.q4, T.b5 - 0.15, 'they must know something'], [T.rising, T.every - 0.1, 'a rising price · a queue'], [T.rlong, T.isnt - 0.05, 'it feels like proof']]) { const o = win(t, a, b, 0.22, 0.22); if (o > co) { co = o; ct = s; cp = pop(t, a); } }
  if (ct) setTxt(chip, ct); put(chip, W / 2, 472, co, cp);
  // "once two people go in": 1 in, 2 in; the next one's hunch says next door, and she stays
  ADM.forEach((a, i) => putW(inTags[i], headP(MEM[i], t, 2.3), win(t, T.two + i * 0.25, a + 0.45, 0.15, 0.2), pop(t, T.two + i * 0.25), 640));
  putW(hunchTag, headP(MEM[FRONT], t, 2.95), win(t, T.nxt + 0.05, T.hunch + 0.5, 0.18, 0.2), pop(t, T.nxt + 0.05), 640);
  put(b2, W / 2, 1400, win(t, T.two + 0.1, T.b6 + 0.15, 0.25, 0.25), pop(t, T.two + 0.1));
  b2.querySelector('.src2').style.opacity = seg(t, T.ignores, T.ignores + 0.3).toFixed(2);
  // every buyer looks like a vote: a tag on each person as they join
  JOIN.forEach((tj, i) => { const m = MEM[NQ + i], hp = headP(m, t, 2.3), on = hp[2] && hp[0] > 60 && hp[0] < 1020 && hp[1] > 620 && hp[1] < 1540 ? 1 : 0; putW(voteTags[i], hp, win(t, tj + 0.05, tj + 1.0, 0.12, 0.25) * (i < 5 ? on : 0), pop(t, tj + 0.05)); });
  putW(youVote, headP(youM, t, 2.85), win(t, T.buy, T.rehook + 0.2, 0.15, 0.2), pop(t, T.buy) * (1 + 0.07 * win(t, T.become, T.become + 0.35, 0.08, 0.2)), 700);
  setTxt(youVote.firstChild, 'you');
  youVote.innerHTML = t < T.become ? 'you · <b>+1</b> vote' : 'you · part of the queue';
  // the famous example: 100 dots, 99 next door, 1 here; then all 100 queued here
  { const o = win(t, T.famous + 0.1, T.b11 - 0.15, 0.3, 0.25);
    dI.forEach((e, i) => { const tp = T.n99 + 0.05 + i * (T.h9 + 0.3 - T.n99) / 100; setCls(e, t < tp ? '' : (i === 0 ? 'h' : 'n') + (t >= T.all10 + 0.04 * (i % 10) + 0.012 * i ? ' q' : '') + (i === 0 && t >= T.one10 && t < T.so10 ? ' hl' : '')); });
    dF1.style.opacity = (seg(t, T.nd9, T.nd9 + 0.3) * (1 - seg(t, T.all10, T.all10 + 0.25))).toFixed(2); dF2.style.opacity = seg(t, T.all10 + 0.2, T.all10 + 0.5).toFixed(2); dSrc.style.opacity = seg(t, T.better, T.better + 0.3).toFixed(2);
    put(dots, W / 2, 1290, o, pop(t, T.famous + 0.1)); dotsO = o; }
  putW(firstTag, headP(MEM[FRONT], t, 3.0), win(t, T.first10 - 0.1, T.so10 + 0.3, 0.18, 0.2), pop(t, T.first10 - 0.1), 640);
  putW(strTag, headP(MEM[FRONT], t, 2.6), win(t, T.one11 + 0.1, T.but11 - 0.35, 0.18, 0.15), pop(t, T.one11 + 0.1), 640);
  { const p = proj(BX.A - 2.38, BY - 1.75 + 0.5, BZ + 0.2); place(strTag2, Math.max(250, p[0] + 120), Math.min(1500, Math.max(700, p[1] - 70)), p[2] ? win(t, T.but11 + 1.05, T.b12 - 0.1, 0.18, 0.2) : 0, pop(t, T.but11 + 1.05)); }
  if (lcard) { lL2.style.opacity = seg(t, T.maybe2, T.maybe2 + 0.3).toFixed(3); const u = seg(t, T.use, T.use + 0.35); lUse.style.opacity = u.toFixed(3); lUse.style.transform = `translateY(${((1 - eo(u)) * 16).toFixed(1)}px)`; put(lcard, W / 2, 940, seg(t, T.maybe1, T.maybe1 + 0.3), pop(t, T.maybe1)); }
}

// ───────────────────────── one frame
function renderAt(t) {
  const s = skyAt(t), night = s.glow;
  paintSky(s); scene.fog.color.setRGB(s.fog[0], s.fog[1], s.fog[2]);
  setCamera(t);
  hemi.color.setRGB(...s.hemS); hemi.groundColor.setRGB(...s.hemG); hemi.intensity = s.hemI;
  sun.color.setRGB(...s.sunC); sun.intensity = s.sunI;
  const az = s.az * Math.PI / 180, el = s.el * Math.PI / 180, sd = [Math.cos(el) * Math.sin(az), Math.sin(el), Math.cos(el) * Math.cos(az)];
  starM.opacity = s.star * 0.9; stars.visible = s.star > 0.01;
  // the shops: A warm and full; B lit but empty, and it goes dark on the last line
  const bOff = seg(t, T.maybe2 + 0.2, T.maybe2 + 1.2);
  WIN_LIT.emissiveIntensity = 0.15 + 0.85 * night; lanternM.emissiveIntensity = 0.55 + 0.9 * night;
  inLight.A.intensity = 10 + 22 * night; inLight.B.intensity = (8 + 16 * night) * (1 - bOff);
  glowA.forEach(g => g.material.opacity = 0.25 + 0.6 * night); glowB.forEach(g => g.material.opacity = (0.15 + 0.5 * night) * (1 - bOff)); lampM.color.setScalar(lerp(1, 0.25, bOff));
  signs.B.material.color.setScalar(lerp(1, 0.35, bOff));
  // the waiter: at beat 2 he steps forward and looks over at the queue; at the end he goes inside
  { const hop = Math.abs(Math.sin(Math.PI * seg(t, T.beat2 + 0.3, T.beat2 + 0.75))) * 0.22, fwd = 0.35 * eio(seg(t, T.beat2 + 0.3, T.beat2 + 0.9)), inn = eio(seg(t, T.maybe2, T.maybe2 + 1.0));
    waiter.position.set(2.75 - 0.9 * inn, hop, 0.95 + fwd - 1.9 * inn); waiter.rotation.y = lerp(-Math.PI / 2, -Math.PI / 2 - 0.9, eio(seg(t, T.beat2 + 0.5, T.beat2 + 1.1)) * (1 - inn)) + inn * Math.PI; waiter.visible = inn < 0.98; }
  // the queue
  for (const m of MEM) {
    const p = memPos(m, t); m.g.visible = p[3] > 0.01; if (!m.g.visible) { m.bub.visible = false; continue; }
    m.g.position.set(p[0], Math.abs(Math.sin(t * 9 + m.ph)) * 0.07 * p[4], p[1]); m.g.rotation.y = p[2] + 0.04 * Math.sin(t * 0.7 + m.ph) * (1 - p[4]); m.g.scale.setScalar(p[3]);
    // bubbles
    let tex = null, sc = 0;
    { const tk = tKnow(m), a = win(t, tk, T.b5 - 0.1, 0.0, 0.3); if (a > 0.01 && m.tJ == null) { tex = BT.know; sc = a * (t < tk ? 0 : back(seg(t, tk, tk + 0.25))); } }
    if (m.k === FRONT) { const a = win(t, T.nxt + 0.05, T.ignores + 0.25, 0.0, 0.25); if (a > 0.01) { tex = BT.next; sc = a * back(seg(t, T.nxt + 0.05, T.nxt + 0.3)) * (1 + 0.15 * win(t, T.ignores - 0.1, T.ignores + 0.1, 0.05, 0.1)); } }
    if (m.k >= FRONT && m.k < FRONT + 100) {
      if (m.k === FRONT) { if (t >= T.one10 - 0.05 && t < T.but11 + 0.5) { tex = BT.here; sc = back(seg(t, T.one10 - 0.05, T.one10 + 0.25)) * (1 - seg(t, T.but11 + 0.2, T.but11 + 0.5)) * (1 + 0.2 * win(t, T.first10, T.first10 + 0.3, 0.08, 0.2)); } }
      else { const tn = tNext(m); if (t >= tn && t < T.b11 + 0.2) { const g = t >= T.all10 + 0.012 * (m.k - FRONT); tex = g ? BT.grey : BT.next; sc = back(seg(t, tn, tn + 0.25)) * (1 - seg(t, T.b11 - 0.1, T.b11 + 0.2)) * (g ? 0.82 : 1); } }
    }
    m.bub.visible = !!tex && sc > 0.01; if (m.bub.visible) { if (m.bub.material.map !== tex) { m.bub.material.map = tex; m.bub.material.needsUpdate = true; } m.bub.position.set(p[0], 2.35 + 0.04 * Math.sin(t * 3 + m.ph), p[1]); m.bub.scale.setScalar(0.62 * sc * (m.k === FRONT ? 1.25 : 1) * Math.min(1, Math.hypot(camera.position.x - p[0], camera.position.y - 2.35, camera.position.z - p[1]) / 9)); }
  }
  // you: the ring, the ticket and the arm that holds it
  { const p = memPos(youM, t); youRing.position.set(p[0], 0.05, p[1]); youRing.scale.setScalar(1.25 + 0.08 * Math.sin(t * 5) + 0.35 * win(t, T.buy, T.buy + 0.4, 0.08, 0.3)); youRing.material.opacity = 0.85;
    YOU_MAT.emissiveIntensity = 0.12 + 0.5 * night; youLight.position.set(p[0] + 0.3, 3.2, p[1] + 0.6); youLight.intensity = 18 * night;
    const tp = ticketPose(t); ticket.position.set(tp[0], tp[1], tp[2]); ticket.rotation.set(0, tp[3] + Math.PI / 2 + Math.PI + 0.12 * tp[4], 0.05 * tp[4]); ticket.rotateX(-0.12 * tp[4]); ticket.scale.setScalar(lerp(0.5, 1, tp[4]));
    const sh = [p[0] + Math.sin(tp[3] + Math.PI / 2) * 0.0, 1.12, p[1]]; armM.position.set((sh[0] + tp[0]) / 2, (sh[1] + tp[1] - 0.2) / 2 + 0.05, (sh[2] + tp[2]) / 2); armM.lookAt(tp[0], tp[1] - 0.22, tp[2]); armM.rotateX(Math.PI / 2); armM.visible = false; }
  // price boards: they rise at the turn; candles pop as people join
  for (const k of ['A', 'B']) {
    const B = boards[k], up = back(seg(t, T.trades - 0.05 + (k === 'B' ? 0.12 : 0), T.trades + 0.5 + (k === 'B' ? 0.12 : 0))), TK = k === 'A' ? TKA : TKB;
    B.g.visible = t > T.trades - 0.05; B.g.position.y = -(1 - up) * 6.6;
    B.cs.forEach((c, i) => { const q = TK[i]; const sc = q && t >= q.t ? back(seg(t, q.t, q.t + 0.22)) : 0; c.body.visible = c.wick.visible = sc > 0.01; if (!sc) return;
      const first = k === 'A' && i === 0 && t >= T.but11 + 1.05, you = k === 'A' && i === TKA.findIndex(x => x.t > T.buy) ;
      c.mat.color.copy(first ? AMB : q.c); const hgt = Math.max(0.06, Math.abs(q.v1 - q.v0)); c.body.scale.set(1 + 0.4 * (first ? win(t, T.but11 + 1.05, T.but11 + 1.45, 0.08, 0.3) : 0), hgt * sc, 1); c.body.position.y = BY + (q.v0 + q.v1) / 2; c.wick.scale.set(1, (hgt + 0.28) * sc, 1); c.wick.position.y = BY + (q.v0 + q.v1) / 2; });
  }
  dome.position.copy(camera.position); stars.position.copy(camera.position);
  orb.position.set(camera.position.x + sd[0] * 1600, camera.position.y + sd[1] * 1600, camera.position.z + sd[2] * 1600); orb.scale.setScalar(s.orbS * 2); orb.lookAt(camera.position); orbM.color.setRGB(...s.orb);
  halo.position.copy(orb.position); halo.scale.setScalar(s.orbS * 13); halo.lookAt(camera.position); haloM.color.setRGB(...s.orb); haloM.opacity = 0.75;
  const S2 = Math.min(150, Math.max(14, camD * 0.85));
  sun.target.position.copy(camTg); sun.position.set(camTg.x + sd[0] * 340, camTg.y + sd[1] * 340, camTg.z + sd[2] * 340);
  const sc = sun.shadow.camera; sc.left = -S2; sc.right = S2; sc.top = S2; sc.bottom = -S2; sc.updateProjectionMatrix();
  renderer.render(scene, camera);
  updateUI(t);
}
window.camCheck = () => {
  const boxes = [];
  for (const k of ['A', 'B']) { const cx = SHOP[k].cx; boxes.push([cx - 5, cx + 5, -8, -ID, 0, IH, 'shop back ' + k], [cx - 5, cx + 5, -8, 0.2, IH, UH + 0.4, 'shop upper ' + k], [BX[k] - 3.1, BX[k] + 3.1, BZ - 0.2, BZ + 0.3, BY - 2.2, BY + 2.2, 'board ' + k], [cx - 5, cx + 5, 0, 1.5, IH - 0.4, IH + 0.4, 'awning ' + k]); }
  for (const [cx, w, h] of [[-15.5, 10, 8.6], [-25, 9, 6.2], [-34, 9, 9.4], [15.5, 10, 6.8], [25, 9, 9.0], [34, 9, 7.0]]) boxes.push([cx - w / 2, cx + w / 2, -8, 0, 0, h, 'neighbour']);
  boxes.push([-80, 80, 42.5, 49.5, 0, 11, 'houses across the road']);
  const out = []; let cur = null;
  for (let f = 0; f < Math.ceil(DUR * 30); f++) {
    const t = f / 30; setCamera(t); const c = camera.position; let hit = null;
    for (const [x0, x1, z0, z1, y0, y1, nm] of boxes) if (c.x > x0 - 0.5 && c.x < x1 + 0.5 && c.z > z0 - 0.5 && c.z < z1 + 0.5 && c.y > y0 - 0.5 && c.y < y1 + 0.5) { hit = nm; break; }
    if (!hit) for (const m of MEM) { const p = memPos(m, t); if (p[3] > 0.1 && Math.hypot(c.x - p[0], c.z - p[1]) < 0.45 && c.y < 2.0) { hit = 'person ' + m.k; break; } }
    if (hit) { if (cur && cur[2] === hit && f - cur[1] <= 1) cur[1] = f; else { cur = [f, f, hit]; out.push(cur); } }
  }
  return out.map(([a, b, n]) => `${(a / 30).toFixed(2)}-${(b / 30).toFixed(2)}s ${n}`);
};
window.renderAt = renderAt;
const r3 = x => +x.toFixed(3);
window.CUES = { T, DUR, open: OPEN, arm: 'N', adm: ADM.map(r3), joins: JOIN.map(r3), know: MEM.filter(m => m.tJ == null).map(m => r3(tKnow(m))).filter((x, i) => i % 6 === 0),
  next: HUND.filter(m => m.k !== FRONT).map(m => r3(tNext(m))).filter((x, i) => i % 5 === 0), candlesA: TKA.map(q => r3(q.t)), sent: TIM.sentences.map(s => s.s) };
document.fonts.ready.then(() => Promise.all(['700 64px Figtree', '800 72px Figtree', '800 30px JBM', '800 118px JBM', '700 22px Inter', '500 18px Inter', '900 80px Fraunces', '700 38px Figtree', '700 30px Figtree', '600 34px Figtree', '700 54px Inter', '800 66px Figtree', '900 150px Fraunces'].map(f => document.fonts.load(f)))).then(() => { TEX.forEach(f => f()); fitHook(); renderAt(0); window.__ready = true; });
