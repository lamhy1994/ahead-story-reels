// The Genius Who Bought the Top — low-poly storybook scene (deterministic: window.renderAt(t) draws the frame for time t)
import * as THREE from 'three';
import { C, MAT, GOLD, SACK, SACK_EMPTY, rng, M, GB, person, boat, cloud, COIN, SACKG, prismGeo, house, ship, cathedral, keep, press, pressBar, treeTrunk, canopyGeo, study, PAPER, APPLE } from './kit.js';

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
const R = rng(17200419);

// ───────────────────────── story clock (everything hangs off the narration)
const T = {
  gravity: wt(1, 'gravity'), falling: wt(1, 'falling'),
  wipe1: S(2) - 0.42, name: wt(2, 'Isaac') - 0.12, mint: wt(2, 'Mint') - 0.1,
  b3: S(3) - 0.1, wild: wt(3, 'wild') - 0.1, south: wt(3, 'South') - 0.15,
  b4: S(4) - 0.1, jan: wt(4, 'January') - 0.15, p128: wt(4, '128') - 0.1,
  b5: S(5) - 0.05, records: wt(5, 'records') - 0.1, sold: wt(5, 'sold') - 0.1, april: wt(5, 'April') - 0.15, richer: wt(5, 'richer') - 0.15,
  b6: S(6) - 0.05, climbing: wt(6, 'climbing') - 0.1,
  b7: S(7) - 0.05, buy: wt(7, 'buy') - 0.1, buying: wt(7, 'buying') - 0.1, higher: wt(7, 'higher') - 0.1,
  b8: S(8) - 0.05, story: wt(8, 'story') - 0.1, madness: wt(8, 'madness') - 0.15,
  b9: S(9) - 0.05, summer: wt(9, 'summer') - 0.1, thousand: wt(9, 'thousand') - 0.15,
  b10: S(10) - 0.05, june: wt(10, 'June') - 0.1, back: wt(10, 'back') - 0.1, top: wt(10, 'top') - 0.15,
  b11: S(11) - 0.05, kept: wt(11, 'kept') - 0.1, all: wt(11, 'all') - 0.1,
  b12: S(12) - 0.05, sept: wt(12, 'September') - 0.15, fell1: wt(12, 'fell', 0) - 0.1, fell2: wt(12, 'fell', 1) - 0.1,
  b13: S(13) - 0.05, dec: wt(13, 'December') - 0.15, p124: wt(13, '124') - 0.1, less: wt(13, 'less') - 0.1,
  b14: S(14) - 0.05, lost: wt(14, 'lost') - 0.1, third: wt(14, 'third') - 0.15,
  wipe3: S(15) - 0.55, wrote: wt(15, 'wrote') - 0.1, very: wt(15, 'very') - 0.1,
  b16: S(16) - 0.05, storyT: wt(16, 'story') - 0.2, even: wt(16, 'Even') - 0.15,
  cta: S(17) - 0.1, ctaC: wt(17, 'comment') - 0.15, apple: wt(17, 'APPLE') - 0.3, rain0: wt(17, 'brilliant') - 0.15, rain1: wt(17, 'Just') - 0.05, notTip: wt(17, 'not') - 0.1,
};
window.T = T;

// ───────────────────────── renderer, sky, light
const canvas = document.getElementById('gl');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: QP.get('aa') !== '0', preserveDrawingBuffer: true });
renderer.setPixelRatio(1); renderer.setSize(W, H, false);
renderer.toneMapping = THREE.NeutralToneMapping; renderer.toneMappingExposure = 1.0;
renderer.shadowMap.enabled = QP.get('sh') !== '0'; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
const scene = new THREE.Scene(); scene.fog = new THREE.Fog(0xffffff, 80, 560);
const camera = new THREE.PerspectiveCamera(35, W / H, 0.5, 2400);
const hemi = new THREE.HemisphereLight(0xffffff, 0x886644, 1.5); scene.add(hemi);
const sun = new THREE.DirectionalLight(0xffffff, 3); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); sun.shadow.bias = -0.0005; sun.shadow.normalBias = 0.3; sun.shadow.camera.near = 1; sun.shadow.camera.far = 760; scene.add(sun, sun.target);

const hx = h => { const c = new THREE.Color(h); return [c.r, c.g, c.b]; };
const P = (top, mid, hor, fog, sunC, sunI, hemS, hemG, hemI, star, glow, az, el, orb, orbS) => ({ top: hx(top), mid: hx(mid), hor: hx(hor), fog: hx(fog), sunC: hx(sunC), sunI, hemS: hx(hemS), hemG: hx(hemG), hemI, star, glow, az, el, orb: hx(orb), orbS });
const PRE = {
  NIGHT: P(0x070B24, 0x141C4B, 0x30326A, 0x262A5E, 0xB4C2FF, 2.1, 0x5567C4, 0x3A3048, 1.55, 1, 1, 5, 42, 0xFFF4D6, 30),
  WINT: P(0x6E9CC4, 0xB9CFE2, 0xEAF0F2, 0xDCE5EA, 0xFFF0DC, 2.7, 0xDCE8F5, 0x9C968C, 1.65, 0, 0, 20, 18, 0xFFF6E6, 34),
  MORN: P(0x4E9FDC, 0x9FD0EA, 0xFBE6BC, 0xF3DDB6, 0xFFE2B0, 3.2, 0xBFDFFF, 0xB8A27E, 1.6, 0, 0, 55, 30, 0xFFF0C8, 40),
  DAY: P(0x2F8FDA, 0x86C6EE, 0xF6E7C4, 0xEEDFC0, 0xFFF1D6, 3.5, 0xCFE8FF, 0xC2A982, 1.7, 0, 0, 15, 54, 0xFFF8E0, 38),
  GOLDEN: P(0x3C7FCB, 0xF2C58A, 0xFFD79A, 0xF6CF9A, 0xFFC878, 3.2, 0xE8D2B0, 0xB08A5E, 1.5, 0, 0.1, -35, 26, 0xFFE0A0, 44),
  AUTUMN: P(0x3A5F9A, 0xE3A27A, 0xF7C98E, 0xE8B98E, 0xFFAE68, 2.8, 0xC8A890, 0x8A6448, 1.35, 0, 0.25, -60, 14, 0xFFC27A, 48),
  DUSK: P(0x141A4C, 0x4A3F86, 0xC06A78, 0x6A4A78, 0x93A4F4, 1.6, 0x5A62B0, 0x3A2A40, 1.1, 0.65, 0.9, 5, 36, 0xFFF4D6, 30),
};
const SKY = [[0, 'NIGHT'], [T.wipe1 + 0.1, 'NIGHT'], [T.wipe1 + 1.2, 'MORN'], [T.b3 + 1.2, 'MORN'], [T.b3 + 2.4, 'WINT'], [T.b5 + 0.4, 'WINT'], [T.april + 0.6, 'MORN'], [T.b6 + 1.0, 'DAY'],
  [T.b8 + 2.0, 'DAY'], [T.b9 + 0.8, 'GOLDEN'], [T.b11 + 2.0, 'GOLDEN'], [T.sept + 0.6, 'AUTUMN'], [T.b13 + 0.2, 'AUTUMN'], [T.dec + 1.0, 'WINT'], [T.b14 - 0.1, 'WINT'], [T.b14 + 1.6, 'DUSK'], [T.wipe3 + 0.2, 'DUSK'], [T.wipe3 + 0.9, 'NIGHT'], [DUR + 1, 'NIGHT']];
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
const starG2 = new THREE.BufferGeometry(); { const a = []; for (let i = 0; i < 90; i++) { const u = R(), th = R() * Math.PI * 2, y = 0.1 + 0.9 * u, r = Math.sqrt(1 - y * y); a.push(r * Math.cos(th) * 1700, y * 1700, r * Math.sin(th) * 1700); } starG2.setAttribute('position', new THREE.Float32BufferAttribute(a, 3)); }
const starM2 = new THREE.PointsMaterial({ color: 0xFFF2CC, size: 5, sizeAttenuation: false, transparent: true, fog: false, depthWrite: false, toneMapped: false });
const stars2 = new THREE.Points(starG2, starM2); scene.add(stars2);
const starG3 = new THREE.BufferGeometry(); { const sr = rng(31415), a = []; for (let i = 0; i < 1400; i++) { const u = sr(), th = sr() * Math.PI * 2, y = 0.08 + 0.92 * u, r = Math.sqrt(1 - y * y); a.push(r * Math.cos(th) * 1700, y * 1700, r * Math.sin(th) * 1700); } starG3.setAttribute('position', new THREE.Float32BufferAttribute(a, 3)); }   // own random stream (added late)
const stars3 = new THREE.Points(starG3, starM); scene.add(stars3);
function radial(inner, outer) { const cv = document.createElement('canvas'); cv.width = cv.height = 128; const g = cv.getContext('2d'); const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, inner); gr.addColorStop(1, outer); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); const tx = new THREE.CanvasTexture(cv); tx.colorSpace = THREE.SRGBColorSpace; return tx; }
const orbM = new THREE.MeshBasicMaterial({ color: 0xffffff, fog: false, toneMapped: false, depthWrite: false });
const orb = new THREE.Mesh(new THREE.CircleGeometry(1, 28), orbM); scene.add(orb);
const haloM = new THREE.MeshBasicMaterial({ map: radial('rgba(255,255,255,0.55)', 'rgba(255,255,255,0)'), transparent: true, fog: false, toneMapped: false, depthWrite: false, blending: THREE.AdditiveBlending });
const halo = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), haloM); scene.add(halo);

// ───────────────────────── seasons (0…1 levels driven by the story)
const snowAt = t => Math.max(win(t, T.b3 + 1.0, T.april - 0.3, 1.0, 0.9), win(t, T.dec - 0.3, T.wipe3 - 0.1, 1.3, 0.4));
const LEAF = [[0, 0xE08A3A, 1], [T.wipe1 + 0.4, 0xE08A3A, 0], [T.april - 0.4, 0xF4B6C8, 0], [T.april + 0.5, 0xF2A9C0, 1], [T.b6 + 1.0, 0x8CC468, 1], [T.b9 + 0.5, 0x4F9A52, 1],
  [T.b11 + 2.0, 0x5A9A4E, 1], [T.sept + 0.6, 0xE8933A, 1], [T.b13 - 0.2, 0xD8742E, 1], [T.dec + 0.6, 0xC86A2E, 0], [T.wipe3 + 0.4, 0xC86A2E, 0], [T.wipe3 + 0.8, 0xD98A3A, 1], [DUR + 1, 0xD98A3A, 1]];
const _ca = new THREE.Color(), _cb = new THREE.Color();
function leafAt(t) { let i = 0; while (i < LEAF.length - 2 && t >= LEAF[i + 1][0]) i++; const a = LEAF[i], b = LEAF[i + 1], u = sm(a[0], b[0], t); _ca.set(a[1]); _cb.set(b[1]); _ca.lerp(_cb, u); return [_ca, lerp(a[2], b[2], u)]; }

// ───────────────────────── the land and the river (the Thames runs along x, south of the city)
const terrainY = (x, z) => -2.3 * sm(36.8, 38.6, z) * (1 - sm(74, 76.5, z));
const SPC = [-86, -20];           // the cathedral
const TOW = [80, 18];             // the Tower (the Royal Mint was inside its walls)
{
  const g = new THREE.PlaneGeometry(900, 900, 180, 180).rotateX(-Math.PI / 2).toNonIndexed();
  const p = g.attributes.position, col = new Float32Array(p.count * 3), cA = new THREE.Color();
  for (let i = 0; i < p.count; i += 3) {
    let mx = 0, mz = 0, my = 0;
    for (let k = 0; k < 3; k++) { const x = p.getX(i + k), z = p.getZ(i + k), y = terrainY(x, z); p.setY(i + k, y); mx += x / 3; mz += z / 3; my += y / 3; }
    const n = R();
    if (my < -0.5) cA.set(0x6D6A55);
    else if (mz > 76 || mz < -95 || mx < -150 || mx > 150) cA.set(0x93AD6E);
    else if (Math.hypot(mx - SPC[0], (mz - SPC[1]) * 0.8) < 30) cA.set(0x8FAA68);
    else if (Math.abs(mz) < 5.1 && mx > -36 && mx < 36) cA.set(0xD3C9B5);
    else cA.set(0xB7AD9A);
    cA.offsetHSL(0, 0, (n - 0.5) * 0.045);
    for (let k = 0; k < 3; k++) { col[(i + k) * 3] = cA.r; col[(i + k) * 3 + 1] = cA.g; col[(i + k) * 3 + 2] = cA.b; }
  }
  g.setAttribute('color', new THREE.BufferAttribute(col, 3)); g.computeVertexNormals();
  const land = new THREE.Mesh(g, MAT); land.receiveShadow = true; scene.add(land);
}
const water = new THREE.Mesh(new THREE.PlaneGeometry(900, 40).rotateX(-Math.PI / 2), new THREE.MeshLambertMaterial({ color: 0x4A7E96, emissive: 0x0E3346, emissiveIntensity: 0.55 })); water.position.set(0, -0.95, 56.5); scene.add(water);
const glints = []; { const gm = new THREE.MeshBasicMaterial({ color: 0xDFF6FF, transparent: true, opacity: 0.45 }); for (let i = 0; i < 40; i++) { const m = new THREE.Mesh(new THREE.BoxGeometry(1.4 + R() * 2, 0.02, 0.12), gm); m.userData = { x: (R() - 0.5) * 300, z: 39 + R() * 35, v: 0.6 + R() * 0.8 }; scene.add(m); glints.push(m); } }

// ───────────────────────── London
const world = new GB();
world.box(900, 2.6, 1.2, 0x9C9282, 0, -1.0, 37.2);                                     // the river wall
for (let x = -120; x < 120; x += 9) world.cyl(0.25, 0.3, 0.9, 6, 0x4A4038, x, 0.45, 36.4);   // mooring posts
const HOUSES = [];
const roofSnow = new GB(), glowB = new GB();
const BCOL = [0xB8644A, 0xA0503C, 0xC98F6A, 0xE8DCC2, 0xD8C3A0, 0x9C5A48, 0xC77B58, 0xE2D2B4], RCOL = [0x5A5E6C, 0x9C4A36, 0x4A4E5A, 0x6A6E7A];
function addHouse(x, z, w, h, d, o = {}) {
  const m = house(w, h, d, { rand: R, color: BCOL[Math.floor(R() * BCOL.length)], roof: RCOL[Math.floor(R() * RCOL.length)], ...o }); m.position.set(x, 0, z); scene.add(m);
  roofSnow.add(prismGeo(w + 0.56, d / 2 + 0.46, m.userData.rh + 0.1), 0xFFFFFF, M(x, h + 0.04, z));
  for (const [wx, wy, wz] of m.userData.win) if (R() < 0.8) glowB.box(0.5, 0.74, 0.05, 0xFFC866, x + wx, wy, z + wz);
  HOUSES.push({ m, x, z, w, h, d, rh: m.userData.rh }); return m;
}
// the alley: houses face the street (z = 0); Jonathan's coffee house on the north side at x ≈ 4; Newton's study on the south side at x ≈ -20
const COFFEE = [4, -8.6], STUDY = [-20, 8.6];
for (const sd of [-1, 1]) {
  let x = -38;
  while (x < 56) {
    let w = 5 + R() * 2;
    if (sd < 0 && x < 7.4 && x + w > 0.6) { if (x < 0.6) { w = 0.6 - x; } else { x = 7.4; continue; } }
    if (sd > 0 && x < -16.6 && x + w > -23.4) { if (x < -23.4) { w = -23.4 - x; } else { x = -16.6; continue; } }
    if (w > 3.2) addHouse(x + w / 2, sd * 8.6, w - 0.15, 7.6 + R() * 3.6, 7, { front: -sd, shop: R() < 0.3 });
    x += w;
  }
}
addHouse(COFFEE[0], COFFEE[1], 6.6, 9.2, 7, { front: 1, color: 0x9C5A48, roof: 0x4A4E5A, sign: 0x2E3A4F, shop: true, door: 0x2F5A3A });
for (const [z0, f] of [[-22, 1], [-36, 1], [-50, 1], [22, -1], [30, 1]]) {
  let x = -62;
  while (x < 56) {
    const w = 5 + R() * 2.4;
    if (!(z0 === 30 && x > 54)) addHouse(x + w / 2, z0, w - 0.15, (z0 === 30 ? 6.5 : 8) + R() * 4.2, z0 === 30 ? 6 : 7, { front: f, shop: z0 === 30 && R() < 0.5 });
    x += w + (R() < 0.12 ? 3 : 0);
  }
}
for (let x = -62; x < -38; x += 6) for (const sd of [-1, 1]) addHouse(x + 3, sd * 8.6, 5.9, 8 + R() * 3, 7, { front: -sd });
// the study house (open at street level, so we can look inside)
const studyM = study(); studyM.position.set(STUDY[0], 0, STUDY[1]); scene.add(studyM);
{ const b = new GB(); b.box(6.8, 4.9, 5.8, 0xE2D2B4, 0, 6.45, 0); b.box(6.92, 0.26, 5.92, 0xF3E9D6, 0, 8.77, 0); b.add(prismGeo(7.2, 3.25, 2.5), 0x5A5E6C, M(0, 8.9, 0));
  for (const x of [-2, 0, 2]) { b.box(0.74, 1.04, 0.08, 0xF3E9D6, x, 6.1, -2.92); b.box(0.56, 0.86, 0.1, 0x2B3140, x, 6.1, -2.94); glowB.box(0.5, 0.74, 0.05, 0xFFC866, STUDY[0] + x, 6.1, STUDY[1] - 2.99); }
  b.box(0.5, 4.1, 0.5, 0xE2D2B4, -3.15, 2.05, -2.7); b.box(0.5, 4.1, 0.5, 0xE2D2B4, 3.15, 2.05, -2.7); b.box(6.8, 0.5, 0.5, 0xF3E9D6, 0, 3.95, -2.7);
  const m = b.mesh(); m.position.set(STUDY[0], 0, STUDY[1]); scene.add(m); roofSnow.add(prismGeo(7.36, 3.36, 2.6), 0xFFFFFF, M(STUDY[0], 8.94, STUDY[1])); HOUSES.push({ m, x: STUDY[0], z: STUDY[1], w: 6.8, h: 8.9, d: 5.8, rh: 2.5, study: true }); }
// the coffee-house table on the street, where shares change hands
{ const b = new GB(); b.box(2.6, 0.12, 1.2, 0x6B4226, 4, 1.0, -3.1); for (const [x, z] of [[2.9, -3.6], [5.1, -3.6], [2.9, -2.6], [5.1, -2.6]]) b.box(0.12, 1.0, 0.12, 0x5A3820, x, 0.5, z);
  b.box(2.4, 0.1, 0.5, 0x5A3820, 4, 0.55, -4.35); for (let i = 0; i < 5; i++) b.box(0.42, 0.02 + i * 0.012, 0.3, 0xFBF6E8, 4.9, 1.07 + i * 0.012, -3.3);
  b.cyl(0.09, 0.08, 0.16, 6, 0xF3E9D6, 4.9, 1.14, -2.9); b.cyl(0.09, 0.08, 0.16, 6, 0xF3E9D6, 3.6, 1.14, -2.8); scene.add(b.mesh()); }
// lantern posts along the alley
for (let x = -30; x <= 30; x += 7.5) for (const sd of [-1, 1]) { if (sd < 0 && x > 0 && x < 8) continue; world.cyl(0.07, 0.09, 3.0, 5, C.dark, x, 1.5, sd * 4.85); world.box(0.36, 0.46, 0.36, 0x3A3A40, x, 3.15, sd * 4.85); glowB.box(0.28, 0.34, 0.28, 0xFFD27A, x, 3.15, sd * 4.85); }

// St Paul's (west) and the Tower with the Mint (east)
const spc = cathedral(); spc.position.set(SPC[0], 0, SPC[1]); scene.add(spc);
const kp = keep(); kp.position.set(TOW[0] + 8, 0, TOW[1]); scene.add(kp);
const WALL = [[60, 0, 100, 0], [60, 34, 100, 34], [100, 0, 100, 34], [60, 0, 60, 9.5], [60, 26.5, 60, 34]];
const wallRun = (x0, z0, x1, z1) => { const len = Math.hypot(x1 - x0, z1 - z0), ry = Math.atan2(-(z1 - z0), x1 - x0), n = Math.floor(len / 1.7); world.box(len, 6, 1.6, 0xDDD5C2, (x0 + x1) / 2, 3, (z0 + z1) / 2, 0, ry, 0); for (let i = 0; i <= n; i++) { const u = i / n; world.box(0.85, 0.75, 1.7, 0xCFC6B0, lerp(x0, x1, u), 6.35, lerp(z0, z1, u), 0, ry, 0); } };
for (const w of WALL) wallRun(...w);
for (const [x, z] of [[60, 0], [100, 0], [60, 34], [100, 34], [60, 8.0], [60, 28.0]]) { world.cyl(2.5, 2.7, 8.4, 10, 0xDDD5C2, x, 4.2, z); for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2; world.box(0.8, 0.8, 0.8, 0xCFC6B0, x + Math.cos(a) * 2.2, 8.8, z + Math.sin(a) * 2.2); } }
const mintB = addHouse(73, 6.2, 17, 6.8, 6.4, { front: 1, color: 0xD8C3A0, roof: 0x4A4E5A, shop: true });
scene.add(world.mesh());
const glowMat = new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, opacity: 0, toneMapped: false });
const glowMesh = new THREE.Mesh(glowB.geo(), glowMat); scene.add(glowMesh);
const snowMat = new THREE.MeshLambertMaterial({ vertexColors: true, transparent: true, opacity: 0 });
const snowRoofs = new THREE.Mesh(roofSnow.geo(), snowMat); scene.add(snowRoofs);
const snowGround = new THREE.Mesh(new THREE.PlaneGeometry(260, 150).rotateX(-Math.PI / 2), new THREE.MeshLambertMaterial({ color: 0xF4F7FA, transparent: true, opacity: 0, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 })); snowGround.position.set(0, 0.04, -38); scene.add(snowGround);
const cityGlow = new THREE.Mesh(new THREE.PlaneGeometry(120, 60).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ map: radial('rgba(255,190,90,0.5)', 'rgba(255,170,60,0)'), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false, opacity: 0 })); cityGlow.position.set(0, 0.12, 0); scene.add(cityGlow);

// trees (bare trunks + seasonal canopies)
const CANOPY = new THREE.MeshLambertMaterial({ vertexColors: true, color: 0x5DA060 });
const trees = [];
for (const [x, z, h] of [[-25, -4.4, 6.4], [-17, -4.6, 5.8], [13.5, -4.4, 6.2], [24, -4.4, 6.6], [31, -4.4, 5.6], [-33, -4.4, 6.0], [96, 28, 6.5], [95, 5.5, 6.2], [66, 31, 5.6],
  ...Array.from({ length: 9 }, (_, i) => { const a = i / 9 * Math.PI * 2; return [SPC[0] + Math.cos(a) * 21.5, SPC[1] + Math.sin(a) * 18, 6 + R() * 1.4]; }), ...Array.from({ length: 12 }, (_, i) => [-120 + i * 22 + R() * 6, 82 + R() * 6, 6 + R() * 2])]) {
  const tr = treeTrunk(h); tr.position.set(x, terrainY(x, z), z); tr.rotation.y = R() * 6.28; scene.add(tr);
  const cn = new THREE.Mesh(canopyGeo(h, R), CANOPY); cn.castShadow = true; cn.position.copy(tr.position); cn.rotation.y = tr.rotation.y; scene.add(cn); trees.push({ tr, cn, x, z, h, ph: R() * 6.28 });
}

// the river: tall ships moored along the quay, two under sail, small boats
const ships = [[-58, 43.5, 0, 0x5E3A22], [-24, 43.5, 0, 0x4A3020], [16, 43.5, 0, 0x5E3A22], [46, 43.5, 0, 0x6B4428], [-86, 61, 1, 0x4A3020], [30, 66, -1, 0x5E3A22]].map(([x, z, mv, hull]) => { const m = ship({ hull, flag: [C.crimson, 0x2F5A8A, 0xE9C46A][Math.floor(R() * 3)] }); m.position.set(x, -0.95, z); if (mv < 0) m.rotation.y = Math.PI; m.userData = { x, mv, ph: R() * 6 }; scene.add(m); return m; });
const boats = [[-40, 52, 1], [8, 58, -1], [60, 50, 1], [-100, 55, -1]].map(([x, z, dir]) => { const m = boat(); m.position.set(x, -0.82, z); m.rotation.y = dir > 0 ? 0 : Math.PI; m.userData = { x, dir, ph: R() * 6 }; scene.add(m); return m; });
const clouds = [];
{ const cr = rng(4411); for (const [x0, y, z, sc] of [[-101, 92, 20, 3.0], [-85, 104, 36, 2.6], [-118, 112, 30, 2.2], [-91, 83, 132, 4.2], [-66, 72, 150, 3.6], [-64, 151, 6, 4.2], [-40, 172, -30, 3.4], [150, 157, -19, 4.2], [120, 176, 10, 3.4], [-96, 110, 150, 4.4], [-60, 125, 175, 3.6]]) { const m = cloud(cr); m.position.set(x0, y, z); m.scale.setScalar(sc); m.userData.x0 = x0; scene.add(m); clouds.push(m); } }   // seen while the camera looks up during the two sky wipes
for (let i = 0; i < 10; i++) { const m = cloud(R); m.position.set(-220 + i * 48 + R() * 20, 52 + R() * 26, -180 + R() * 260); m.scale.setScalar(1.6 + R() * 1.6); m.userData.x0 = m.position.x; scene.add(m); clouds.push(m); }

// ───────────────────────── people
const SKINL = [0xF1CFAE, 0xE8BE98, 0xD9A77E, 0xC98F66, 0xF5D6B8];
const COATS = [0x2E3550, 0x5A2E2A, 0x3D4A36, 0x6B4E2E, 0x7A2E3A, 0x2F4F5F, 0x4A3A5A, 0x8A6A3A], DRESS = [0x9C4A6A, 0x3E6E8A, 0xC9A35A, 0x7A8A4A, 0xB8644A, 0x6A5A8A, 0xD98AA0];
const WIGS = [0xEDE8DC, 0xD9D0BE, 0x9A8A70, 0x5A4632];
function londoner(rr, paper) {
  if (rr() < 0.32) return person({ dress: true, robe: DRESS[Math.floor(rr() * DRESS.length)], skin: SKINL[Math.floor(rr() * 5)], bonnet: rr() < 0.5 ? 0xF4EEDF : 0xE8D8C8, paper, s: 0.9 + rr() * 0.1 });
  return person({ robe: COATS[Math.floor(rr() * COATS.length)], skin: SKINL[Math.floor(rr() * 5)], wig: rr() < 0.75 ? WIGS[Math.floor(rr() * 4)] : 0, tricorn: rr() < 0.6 ? [0x23262E, 0x3A2E26][Math.floor(rr() * 2)] : 0, collar: 0xF6F1E6, paper, s: 0.95 + rr() * 0.12 });
}
const NEWTON = { robe: 0x3A2F4E, skin: 0xEFC9A6, wig: 0xEFEBE2, collar: 0xF8F4EA, s: 1.06 };
// at the Mint (scene 2)
const PRESS = [73.5, 13];
const newtonMint = person(NEWTON); newtonMint.position.set(75.6, 0, 15.4); newtonMint.rotation.y = Math.PI - 0.25; scene.add(newtonMint);
const pressM = press(); pressM.position.set(PRESS[0], 0, PRESS[1]); scene.add(pressM);
const bar = pressBar(); scene.add(bar);
const workers = [[73.4, 11.5, -Math.PI / 2], [71.9, 13.6, -0.2]].map(([x, z, ry]) => { const m = person({ robe: [0x6B4E2E, 0x2F4F5F][x > 74 ? 0 : 1], skin: SKINL[2], hat: 0xE8D8C8, s: 0.98 }); m.position.set(x, 0, z); m.rotation.y = ry; scene.add(m); return m; });
// in the alley
const newton = person(NEWTON); newton.position.set(1.9, 0, -2.5); newton.rotation.y = 0.12; scene.add(newton);
const broker = person({ robe: 0x23262E, skin: SKINL[1], wig: WIGS[1], tricorn: 0x23262E, collar: 0xF6F1E6, s: 1.02 }); broker.position.set(5.75, 0, -3.3); broker.rotation.y = Math.PI; scene.add(broker);
const newtonStudy = person(NEWTON); newtonStudy.position.set(STUDY[0], 0.05, STUDY[1] + 1.45); newtonStudy.rotation.y = Math.PI / 2; newtonStudy.scale.set(1.06, 0.86, 1.06); scene.add(newtonStudy);
// the crowd in the alley: some there from January, more arrive as the price climbs, all leave in the crash
const CROWD = [];
{ const cr = rng(9311);
  const spot = () => { for (let k = 0; k < 60; k++) { const x = -27 + cr() * 54, z = (cr() - 0.5) * 7.4; if (x > -0.4 && x < 15 && z < 2.2) continue; if (Math.hypot(x - 1.6, z + 0.9) < 1.7) continue; if (CROWD.some(c => Math.hypot(c.x - x, c.z - z) < 1.15)) continue; return [x, z]; } return [-27 + cr() * 54, (cr() - 0.5) * 7.4]; };
  for (let i = 0; i < 64; i++) {
    const [x, z] = spot(), early = i < 20, paper = cr() < (early ? 0.4 : 0.75);
    const m = londoner(cr, paper); m.position.set(x, 0, z); m.rotation.y = Math.atan2(-(-3.1 - z), 4 - x) + (cr() - 0.5) * 1.6; scene.add(m);
    const tIn = early ? -1 : lerp(T.b6 - 0.2, T.thousand + 0.3, Math.pow((i - 20) / 44, 0.9)) + cr() * 0.3;
    const tOut = lerp(T.fell1 - 0.1, T.p124 + 0.2, cr()) ;
    CROWD.push({ m, x, z, tIn, tOut, ph: cr() * 6.28, sc: m.scale.x, hop: cr() * 0.25 });
  }
}

// ───────────────────────── objects that fly: papers (share certificates), coins, sacks, leaves, apples
const FP = [];   // flying papers
const addP = (t0, d, a, b, h, sp = 1, rr = R) => FP.push({ t0, d, a, b, h, ph: rr() * 6.28, w: 3 + rr() * 5, sp });
{ const pr = rng(5150);
  for (let i = 0; i < 150; i++) { const t0 = -0.6 + 6.4 * pr(), x = -30 + pr() * 60, z = -14 + pr() * 28; addP(t0, 3.2 + pr() * 1.6, [x, 24 + pr() * 8, z], [x + 2 + pr() * 3, 0.06, z + (pr() - 0.5) * 2], 0, 1, pr); }          // the night of the crash (flash-forward)
  for (let i = 0; i < 70; i++) { const c = CROWD[Math.floor(pr() * CROWD.length)], t0 = Math.max(c.tIn + 0.4, lerp(T.b6 + 0.4, T.b9 + 1.5, pr())); addP(t0, 1.0 + pr() * 0.4, [c.x, 1.9, c.z], [c.x + (pr() - 0.5) * 2, 1.7, c.z + (pr() - 0.5) * 2], 2.2 + pr() * 1.6, 1, pr); }   // tossed in the air
  for (let i = 0; i < 120; i++) { const x = -26 + pr() * 52, z = (pr() - 0.5) * 8, t0 = lerp(T.fell1 - 0.2, T.b13 + 0.6, pr()); addP(t0, 2.0 + pr() * 1.0, [x, 1.4 + pr() * 1.2, z], [x + 14 + pr() * 16, 9 + pr() * 12, z + (pr() - 0.5) * 10], 3, 1, pr); }       // blown away in the crash
}
const NEWT = [1.9, 1.35, -2.5], BRK = [5.6, 1.5, -3.3], NPILE = [1.3, 0, -1.0], STK = [2.75, 1.08, -2.95];
for (let i = 0; i < 3; i++) addP(T.sold + 0.1 + i * 0.16, 0.6, [NEWT[0] + 0.4, 1.55, NEWT[2]], [4.9 + i * 0.05, 1.14 + i * 0.03, -3.3], 0.8, 0);          // Newton sells his shares…
const SELL = [0, 1, 2, 3].map(i => T.richer - 1.0 + i * 0.2), BUYS = [0, 1, 2, 3].map(i => T.back - 0.25 + i * 0.22);
const STACKT = Array.from({ length: 14 }, (_, i) => i < 6 ? T.back + 0.2 + i * 0.22 : T.kept + (i - 6) * 0.38);
for (const [i, t0] of STACKT.entries()) addP(t0 - 0.5, 0.5, [4.9, 1.2, -3.3], [STK[0], STK[1] + i * 0.03, STK[2]], 0.9, 0);                 // …and buys them back
const SACKS = [0, 1, 2, 3].map(i => { const m = new THREE.Mesh(SACKG, SACK); m.castShadow = true; scene.add(m); return { m, p: [NPILE[0] + (i % 2) * 0.6, 0.3 + Math.floor(i / 2) * 0.44, NPILE[2] + (i % 2 ? 0.25 : -0.15)] }; });
const paperMat = new THREE.MeshLambertMaterial({ color: 0xFBF6E8, side: THREE.DoubleSide });
const paperMesh = new THREE.InstancedMesh(PAPER, paperMat, 480); paperMesh.frustumCulled = false; scene.add(paperMesh);
const stackMat = new THREE.MeshLambertMaterial({ color: 0xFBF6E8 });
const stackMesh = new THREE.InstancedMesh(PAPER, stackMat, STACKT.length); stackMesh.frustumCulled = false; stackMesh.castShadow = true; scene.add(stackMesh);
// coins at the Mint: the press strikes, a coin jumps onto the pile
const STRIKE = []; for (let t = T.wipe1 + 1.1; t < T.b3 + 0.6; t += 0.62) STRIKE.push(t);
const FL = [];
STRIKE.forEach((t0, i) => { for (let k = 0; k < 3; k++) FL.push({ t0: t0 + 0.12 + k * 0.05, d: 0.5, a: [PRESS[0] + 0.1, 0.8, PRESS[1]], b: [PRESS[0] + 1.6 + (R() - 0.5) * 0.7, 0.12, PRESS[1] + 1.3 + (R() - 0.5) * 0.7], h: 1.0 + R() * 0.6, sp: R() * 6, w: 8 + R() * 6 }); });
const MPILE = { x: PRESS[0] + 1.6, z: PRESS[1] + 1.3, c: [] }; for (let k = 0; k < 70; k++) { const ly = Math.floor(Math.sqrt(k * 0.9)), rr = 0.62 * (1 - ly * 0.15) * Math.sqrt(R()), a = R() * 6.28; MPILE.c.push([Math.cos(a) * rr, 0.04 + ly * 0.075, Math.sin(a) * rr, (R() - .5) * 0.5, (R() - .5) * 0.5]); }
const coinMesh = new THREE.InstancedMesh(COIN, GOLD, 70 + 120); coinMesh.frustumCulled = false; scene.add(coinMesh);
// leaves in September
const LEAVES = []; { const lr = rng(901); for (let i = 0; i < 160; i++) { const tr = trees[Math.floor(lr() * 6)]; LEAVES.push({ x: tr.x + (lr() - 0.5) * 3, z: tr.z + (lr() - 0.5) * 3, y0: tr.h * 0.85, t0: lerp(T.sept - 0.6, T.b13 + 0.4, lr()), d: 2.4 + lr() * 1.6, dx: 3 + lr() * 6, ph: lr() * 6.28, c: lr() }); } }
const leafMesh = new THREE.InstancedMesh(new THREE.PlaneGeometry(0.34, 0.24), new THREE.MeshLambertMaterial({ color: 0xE07A2A, side: THREE.DoubleSide }), LEAVES.length); leafMesh.frustumCulled = false; scene.add(leafMesh);
// apples for the legend
const RAIN = [], APL = [];
{ const ar = rng(1687); for (let i = 0; i < 170; i++) { const t0 = T.rain0 + (T.rain1 + 1.6 - T.rain0) * ar(), x = -30 + ar() * 60, z = -14 + ar() * 28, d = 1.0 + ar() * 0.45; let gy = 0.3; for (const h of HOUSES) if (Math.abs(x - h.x) < h.w / 2 && Math.abs(z - h.z) < h.d / 2) gy = h.h + h.rh * (1 - Math.abs(z - h.z) / (h.d / 2 + 0.35)) + 0.3; APL.push({ t0, d, x, z, y0: 24 + ar() * 8, gy, ph: ar() * 6.28 }); RAIN.push(+(t0 + d).toFixed(3)); } }
const APPLE_MAT = new THREE.MeshLambertMaterial({ vertexColors: true, emissive: 0x7A1010, emissiveIntensity: 0.6 }); const appleMesh = new THREE.InstancedMesh(APPLE, APPLE_MAT, APL.length); appleMesh.frustumCulled = false; appleMesh.castShadow = true; scene.add(appleMesh);
// the share price, 1720, month by month (UK National Archives / Britannica figures; in between, straight lines)
const PRICE = [[0.5, 128], [4.0, 350], [5.0, 600], [6.0, 950], [7.0, 1050], [7.6, 1000], [9.0, 190], [11.5, 124]];
// sparkles, smoke from the Mint chimneys
const sparkT = (() => { const cv = document.createElement('canvas'); cv.width = cv.height = 64; const g = cv.getContext('2d'); g.translate(32, 32); g.fillStyle = '#fff'; for (let k = 0; k < 2; k++) { g.rotate(Math.PI / 2 * k); g.beginPath(); g.moveTo(0, -30); g.quadraticCurveTo(3, -3, 30, 0); g.quadraticCurveTo(3, 3, 0, 30); g.quadraticCurveTo(-3, 3, -30, 0); g.quadraticCurveTo(-3, -3, 0, -30); g.fill(); } const tx = new THREE.CanvasTexture(cv); tx.colorSpace = THREE.SRGBColorSpace; return tx; })();
const sparks = []; for (let i = 0; i < 24; i++) { const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: sparkT, color: 0xFFE9A8, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false })); sp.userData = { ph: R() * 6.28, w: 3 + R() * 4 }; scene.add(sp); sparks.push(sp); }
const smokeT = radial('rgba(235,235,240,0.9)', 'rgba(235,235,240,0)');
const smoke = []; for (let i = 0; i < 14; i++) { const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: smokeT, transparent: true, depthWrite: false })); sp.userData = { ph: i / 14, x: 73 + (i % 2 ? 7.6 : -7.6), z: 6.2 }; scene.add(sp); smoke.push(sp); }
// snowflakes (around the camera's subject)
const SNN = 900, snowG = new THREE.BufferGeometry(); snowG.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(SNN * 3), 3));
const flakes = new THREE.Points(snowG, new THREE.PointsMaterial({ color: 0xFFFFFF, size: 0.22, transparent: true, opacity: 0, depthWrite: false, map: radial('rgba(255,255,255,1)', 'rgba(255,255,255,0)') })); flakes.frustumCulled = false; scene.add(flakes);
const SNF = []; for (let i = 0; i < SNN; i++) SNF.push([R(), R(), R(), R()]);
// candle in the study
const candleF = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.24, 6), new THREE.MeshBasicMaterial({ color: 0xFFD27A, toneMapped: false })); candleF.position.set(STUDY[0] + 0.85, 1.62, STUDY[1] + 0.25); scene.add(candleF);
const candleL = new THREE.PointLight(0xFFC27A, 0, 12, 1.4); candleL.position.set(STUDY[0] + 0.85, 2.0, STUDY[1] - 0.4); scene.add(candleL);
const candleGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: radial('rgba(255,200,110,0.85)', 'rgba(255,170,60,0)'), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false })); candleGlow.position.copy(candleF.position); candleGlow.scale.set(2.4, 2.4, 1); scene.add(candleGlow);
const quill = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.62, 4), new THREE.MeshLambertMaterial({ color: 0xFFFFFF })); scene.add(quill);
// birds
const birdMat = new THREE.MeshBasicMaterial({ color: 0x2A2430, side: THREE.DoubleSide });
const wingG = new THREE.BufferGeometry(); wingG.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0.1, 1.6, 0, -0.3, 1.5, 0, 0.5], 3));
const FLOCK = [{ t0: T.wipe1 + 1.2, t1: T.b3 + 2.4, a: [100, 26, 30], b: [40, 30, -10] }, { t0: T.b6, t1: T.b8 + 0.5, a: [-40, 18, -10], b: [36, 24, 8] }, { t0: T.b9 + 0.2, t1: T.b11, a: [40, 20, 10], b: [-20, 26, -16] }];
const birds = []; for (let i = 0; i < 9; i++) { const g = new THREE.Group(), l = new THREE.Mesh(wingG, birdMat), r = new THREE.Mesh(wingG, birdMat); r.scale.x = -1; g.add(l, r); g.userData = { l, r, ph: R() * 6 }; g.visible = false; g.scale.setScalar(0.85); scene.add(g); birds.push(g); }
function updateBirds(t) {
  const f = FLOCK.find(f => t >= f.t0 && t <= f.t1); for (const b of birds) b.visible = !!f; if (!f) return;
  const u = seg(t, f.t0, f.t1), dx = f.b[0] - f.a[0], dz = f.b[2] - f.a[2], L = Math.hypot(dx, dz), ux = dx / L, uz = dz / L;
  birds.forEach((b, i) => { const row = Math.ceil(i / 2), sd = i % 2 ? 1 : -1; b.position.set(lerp(f.a[0], f.b[0], u) - ux * row * 2.4 + uz * sd * row * 1.7, lerp(f.a[1], f.b[1], u) + Math.sin(t * 2 + b.userData.ph) * 0.5, lerp(f.a[2], f.b[2], u) - uz * row * 2.4 - ux * sd * row * 1.7); b.rotation.y = Math.atan2(ux, uz); const fl = Math.sin(t * 10 + b.userData.ph) * 0.65; b.userData.l.rotation.z = fl; b.userData.r.rotation.z = -fl; });
}

// ───────────────────────── camera path (spherical keys around a target; `up` tilts the view so the subject sits lower in the frame)
const CAM = [
  { t: 0, tg: [-14, 7, 0], d: 60, az: 90, el: 13, up: 0.1 },                                                      // night, the alley from its east end
  { t: T.falling + 0.6, tg: [-14, 5, 0], d: 44, az: 90, el: 9, up: 0.1, mv: 1 },
  { t: T.wipe1, tg: [-10, 4, 0], d: 36, az: 91, el: 8, up: 0.1 },
  { t: T.wipe1 + 0.42, tg: [40, 80, 0], d: 40, az: 90, el: -40, up: 0, mv: 1 },                                   // sky wipe → morning at the Mint
  { t: T.wipe1 + 0.65, tg: [75, 80, 18], d: 40, az: -66, el: -40, up: 0, mv: 1 },                                  // (turn while looking at the sky)
  { t: T.wipe1 + 1.45, tg: [75.0, 1.8, 15.0], d: 10, az: -66, el: 12, mv: 1 },                                     // come straight down into the courtyard
  { t: T.mint + 0.3, tg: [74.8, 1.8, 14.8], d: 9.5, az: -76, el: 13 },
  { t: T.b3 + 0.2, tg: [74, 3, 14.5], d: 14, az: -60, el: 22, up: 0.05, mv: 1 },
  { t: T.b3 + 1.5, tg: [40, 6, 0], d: 30, az: 70, el: 40, up: 0.04, mv: 2 },                                      // crane up over the walls…
  { t: T.south, tg: [24, 2, 0], d: 40, az: 86, el: 28, up: 0.04, mv: 1 },                                          // …over the roofs…
  { t: T.b4 - 0.3, tg: [10, 2, 0], d: 44, az: 90, el: 16, up: 0.05, mv: 1 },                                      // …and down into the alley from its east end
  { t: T.b4 + 0.4, tg: [2, 1.8, 0], d: 30, az: 88, el: 14, up: 0.06, mv: 3 },
  { t: T.p128 + 0.5, tg: [4, 1.6, -0.5], d: 26, az: 84, el: 15, up: 0.06 },
  { t: T.b5 + 0.6, tg: [2.6, 1.5, -2.4], d: 11, az: 74, el: 14, up: 0.03, mv: 1 },                                // Newton at the coffee-house table
  { t: T.richer + 0.3, tg: [2.2, 1.3, -1.9], d: 9.5, az: 68, el: 15, up: 0.03 },
  { t: T.b6 + 0.3, tg: [2.4, 1.3, -1.8], d: 10.5, az: 80, el: 16, up: 0.03 },
  { t: T.b7 + 0.3, tg: [2, 2, 0], d: 36, az: 88, el: 34, up: 0.03, mv: 1 },                                        // the crowd grows
  { t: T.b8 + 0.4, tg: [0, 2, 0], d: 38, az: 100, el: 31, up: 0.03, mv: 1 },
  { t: T.b9 + 0.2, tg: [-2, 2, 0], d: 42, az: 96, el: 36, up: 0.03 },
  { t: T.thousand + 0.6, tg: [2, 2, 0], d: 40, az: 90, el: 30, up: 0.03, mv: 1 },
  { t: T.b10 + 0.6, tg: [2.6, 1.4, -2.4], d: 11, az: 82, el: 13, up: 0.03, mv: 3 },                               // Newton buys back in
  { t: T.top + 0.4, tg: [2.4, 1.3, -2.2], d: 9.5, az: 74, el: 14, up: 0.03 },
  { t: T.b11 + 0.2, tg: [2.5, 1.3, -2.3], d: 8.8, az: 66, el: 18, up: 0.03 },
  { t: T.b12, tg: [2.5, 1.3, -2.3], d: 10, az: 72, el: 19, up: 0.03 },
  { t: T.fell1 + 0.4, tg: [3, 2.5, 0], d: 34, az: 90, el: 28, up: 0.04, mv: 1 },                                   // the crash: pull back along the street
  { t: T.b13 + 0.6, tg: [2, 2, 0], d: 46, az: 130, el: 52, up: 0.04, mv: 1 },                                      // over the roofs…
  { t: T.dec + 1.2, tg: [2, 2, 0], d: 46, az: 220, el: 52, up: 0.04 },
  { t: T.b14 - 0.6, tg: [0, 2, 0], d: 40, az: 268, el: 36, up: 0.04, mv: 1 },                                      // …to the west end of the street
  { t: T.b14 + 0.5, tg: [2.0, 1.4, -2.3], d: 13, az: 272, el: 13, up: 0.02, mv: 3 },                             // Newton alone
  { t: T.wipe3, tg: [2.0, 1.5, -2.3], d: 10.5, az: 276, el: 12, up: 0.02 },
  { t: T.wipe3 + 0.45, tg: [STUDY[0], 80, STUDY[1]], d: 40, az: 186, el: -40, up: 0, mv: 2 },                    // sky wipe → night, 1724
  { t: T.wipe3 + 0.8, tg: [STUDY[0], 4, STUDY[1] + 0.6], d: 14, az: 186, el: 30, up: 0.03, mv: 1 },               // come down over the street…
  { t: T.wipe3 + 1.12, tg: [STUDY[0], 1.9, STUDY[1] + 0.6], d: 11.5, az: 186, el: 10, mv: 3 },                    // …in front of the study
  { t: T.b16 - 0.2, tg: [STUDY[0], 1.8, STUDY[1] + 0.8], d: 9.5, az: 176, el: 9 },
  { t: T.b16 + 0.9, tg: [STUDY[0], 2, STUDY[1] + 0.4], d: 15.5, az: 180, el: 47, up: 0.04, mv: 2 },              // rise straight up above the roofs
  { t: T.b16 + 2.6, tg: [0, 4, 6], d: 120, az: 196, el: 32, up: 0.2, mv: 3 },
  { t: T.cta, tg: [0, 4, 6], d: 128, az: 200, el: 30, up: 0.2 },
  { t: T.rain0 + 0.4, tg: [0, 2, 0], d: 48, az: 212, el: 31, up: 0.07, mv: 1 },
  { t: DUR + 0.5, tg: [0, 2, 0], d: 42, az: 220, el: 29, up: 0.07 },
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
  camera.position.set(cx, Math.max(tg[1] + d * Math.sin(el) + wob[1], terrainY(cx, cz) + 1.2), cz);
  camera.lookAt(tg[0], tg[1] + up * d, tg[2]); camera.updateMatrixWorld();
  camTg.set(tg[0], tg[1], tg[2]); camD = d;
}

// ───────────────────────── overlay (captions, stamps, labels)
const ui = document.getElementById('ui'); const _v = new THREE.Vector3();
function proj(x, y, z) { _v.set(x, y, z).project(camera); return [(_v.x * 0.5 + 0.5) * W, (-_v.y * 0.5 + 0.5) * H, _v.z < 1]; }
function mk(cls, html = '') { const e = document.createElement('div'); e.className = 'abs ' + cls; e.innerHTML = html; e.style.opacity = 0; ui.appendChild(e); return e; }
function put(e, x, y, o = 1, sc = 1, ax = '-50%', ay = '-50%') { e.style.opacity = o.toFixed(3); if (o <= 0.001) return; e.style.transform = `translate(${x.toFixed(1)}px,${y.toFixed(1)}px) translate(${ax},${ay}) scale(${sc.toFixed(3)})`; }
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
const capEl = document.getElementById('cap'); let capIdx = -2;
function updateCaption(t) {
  let idx = -1; for (let i = 0; i < chunks.length; i++) if (t >= chunks[i].s && t < chunks[i].hide) { idx = i; break; }
  if (idx !== capIdx) { capIdx = idx; capEl.innerHTML = idx < 0 ? '' : chunks[idx].ws.map(w => `<span class="w${w.kw ? ' kw' : ''}">${w.t.replace(/&/g, '&amp;')}</span>`).join(''); }
  if (idx < 0) return;
  const c = chunks[idx], spans = capEl.children;
  c.ws.forEach((w, i) => { const nx = c.ws[i + 1]; const st = t < w.s - 0.05 ? 'fut' : (nx && t >= nx.s - 0.05) ? 'said' : 'cur'; const cl = 'w' + (w.kw ? ' kw' : '') + (st === 'cur' ? '' : ' ' + st); if (spans[i].className !== cl) spans[i].className = cl; });
}
const yearEl = mk('year', '2026'), subEl = mk('sub', 'London · a true money story');
const chip = mk('chip', '');
const nameEl = mk('name', '<div class="n">Isaac Newton</div><div class="r">Master of the Royal Mint</div>');
// the price chart (South Sea shares, 1720): drawn a little further at each step of the story
const CW = 860, CH = 470, PX = m => 70 + m / 12 * 750, PY = p => 392 - p / 1100 * 300;
const chart = mk('chart', `<div class="t">South Sea share price · 1720</div><svg width="${CW}" height="${CH - 60}" viewBox="0 60 ${CW} ${CH - 60}">
  ${[0, 500, 1000].map(p => `<line x1="70" x2="820" y1="${PY(p)}" y2="${PY(p)}" class="grid"/><text x="58" y="${PY(p) + 7}" class="ax" text-anchor="end">£${p.toLocaleString('en-GB')}</text>`).join('')}
  ${'JFMAMJJASOND'.split('').map((c, i) => `<text x="${PX(i + 0.5)}" y="428" class="mo" text-anchor="middle">${c}</text>`).join('')}
  <line class="ref" x1="${PX(0.5)}" x2="${PX(11.5)}" y1="${PY(128)}" y2="${PY(128)}"/>
  <polyline class="ln" points=""/><circle class="hd" r="11"/>
  <g class="mk sell"><circle cx="${PX(4)}" cy="${PY(350)}" r="13"/><text x="${PX(4)}" y="${PY(350) + 50}" text-anchor="middle">SOLD</text></g>
  <g class="mk buy"><circle cx="${PX(6)}" cy="${PY(950)}" r="13"/><text x="${PX(6) - 26}" y="${PY(950) + 8}" text-anchor="end">BOUGHT BACK</text></g>
  <text class="lb l128" x="${PX(0.5) + 6}" y="${PY(128) - 18}">£128</text><text class="lb l350" x="${PX(4) - 18}" y="${PY(350) - 20}" text-anchor="end">£350</text>
  <text class="lb l1050" x="${PX(7)}" y="${PY(1050) - 20}" text-anchor="middle">~£1,050</text><text class="lb l124" x="${PX(11.5)}" y="${PY(124) - 22}" text-anchor="middle">£124</text>
  <text class="lb lless" x="${PX(9.6)}" y="${PY(128) + 46}" text-anchor="middle">less than January</text></svg>`);
const cLine = chart.querySelector('.ln'), cHead = chart.querySelector('.hd'), cSell = chart.querySelector('.sell'), cBuy = chart.querySelector('.buy'), cRef = chart.querySelector('.ref');
const cLab = { l128: chart.querySelector('.l128'), l350: chart.querySelector('.l350'), l1050: chart.querySelector('.l1050'), l124: chart.querySelector('.l124'), lless: chart.querySelector('.lless') };
function priceAt(m) { if (m <= PRICE[0][0]) return PRICE[0][1]; for (let i = 0; i < PRICE.length - 1; i++) if (m <= PRICE[i + 1][0]) return lerp(PRICE[i][1], PRICE[i + 1][1], (m - PRICE[i][0]) / (PRICE[i + 1][0] - PRICE[i][0])); return PRICE[PRICE.length - 1][1]; }
function monthAt(t) { return 0.5 + 3.5 * eio(seg(t, T.sold - 0.1, T.april + 0.7)) + 3.1 * eio(seg(t, T.summer, T.thousand + 0.5)) + 1.9 * eio(seg(t, T.sept - 0.1, T.fell2 + 0.5)) + 2.5 * eio(seg(t, T.dec - 0.1, T.p124 + 0.3)); }
const spark = mk('spark', '<svg width="800" height="330" viewBox="0 0 800 330"><polyline class="sl" points=""/><circle class="sh" r="13"/></svg><div class="lbl">South Sea shares · 1720</div>');
const sLine = spark.querySelector('.sl'), sHead = spark.querySelector('.sh'), SXo = m => 40 + (m - 0.5) / 11 * 720, SYo = p => 300 - p / 1100 * 270;
const richTag = mk('tag am', '+ about <b style="color:#1C1300">£20,000</b>');
const ticker = mk('tag', 'one share <b>£350</b>'); const tickB = ticker.querySelector('b');
const loop = mk('loopc', '<span class="a">people buy</span><span class="arr">→</span><span class="a">price rises</span><span class="arr">↺</span>');
const quote = mk('quote', '<div class="q">He could not calculate<br><em>“the madness of the people.”</em></div><div class="s">an old story, as told to Joseph Spence</div>');
const meter = mk('meter', '<span>his money in South Sea</span><div class="bar"><div class="fill"></div></div><b>0%</b>'); const meterFill = meter.querySelector('.fill'), meterB = meter.querySelector('b');
const almost = mk('tag am', 'almost all');
const worth = mk('worth', '<div class="t">Newton’s fortune (estimate)</div><div class="row"><span class="v0">£30,000</span><span class="arr">→</span><span class="v1">£20,000</span></div><div class="bar"><div class="fill"></div><div class="gone"></div></div><div class="d">a third gone</div>');
const worthFill = worth.querySelector('.fill'), worthGone = worth.querySelector('.gone'), worthD = worth.querySelector('.d');
const letter = mk('letter', '<div class="h">14 September 1724</div><div class="tx"></div><div class="sg">— Isaac Newton, in a letter to a friend</div>'); const letterTx = letter.querySelector('.tx');
const LETTER = '“I lost very much by the South Sea company…”';
const title = mk('title', '<div class="s">THE STORY OF</div><div class="n">The Genius\n<em>Who Bought the Top</em></div>');
const lesson = mk('lesson', 'Even great minds\n<em>can follow a crowd.</em>');
const cbox = mk('cbox', '<span class="in"></span><span class="post">Post</span>'); const cIn = cbox.querySelector('.in'), cPost = cbox.querySelector('.post');
const quip = mk('tag am', 'just not a stock tip');
const shoot = mk('shoot', '');
const foot = document.getElementById('foot');
foot.textContent = 'Newton’s trades: A. Odlyzko (2019), Bank of England records · prices: Britannica\nHistorians debate how much Newton lost. Not financial advice.';
const setTxt = (e, s) => { if (e.textContent !== s) e.textContent = s; };
const setHTML = (e, s) => { if (e._h !== s) { e._h = s; e.innerHTML = s; } };
const setOp = (e, o) => { const s = o.toFixed(3); if (e._o !== s) { e._o = s; e.style.opacity = s; } };

function updateUI(t) {
  updateCaption(t);
  foot.style.opacity = (0.95 * seg(t, 0.8, 1.4) * (1 - seg(t, T.cta, T.cta + 0.3) * 0.45)).toFixed(3);
  { let on = 0; for (const [t0, x0, y0] of [[2.4, 700, 160], [T.b16 + 3.2, 300, 120]]) { const u = (t - t0) / 0.55; if (u > 0 && u < 1) { put(shoot, x0 + u * 330, y0 + u * 120, Math.sin(u * Math.PI), 1); on = 1; } } if (!on) put(shoot, 0, 0, 0); }
  // 1 — the year rolls back
  { const u = eo(seg(t, 0.05, 1.25)); setTxt(yearEl, String(Math.round(lerp(2026, 1720, u)))); const o = win(t, -1, T.wipe1 - 0.25, 0.5, 0.3); put(yearEl, W / 2, 545, o, 1 + 0.06 * (1 - u)); put(subEl, W / 2, 680, o * seg(t, 0.9, 1.3)); }
  { const o = win(t, 0.35, T.wipe1 - 0.3, 0.4, 0.3);
    if (o > 0.001) { const m = t < T.falling - 0.2 ? lerp(0.5, 7.0, eo(seg(t, 0.4, T.falling - 0.2))) : lerp(7.0, 11.5, eio(seg(t, T.falling - 0.2, T.falling + 0.9)));
      const pts = PRICE.filter(p => p[0] < m).map(p => `${SXo(p[0]).toFixed(1)},${SYo(p[1]).toFixed(1)}`), hp = [SXo(m), SYo(priceAt(m))]; pts.push(`${hp[0].toFixed(1)},${hp[1].toFixed(1)}`);
      sLine.setAttribute('points', pts.join(' ')); sHead.setAttribute('cx', hp[0].toFixed(1)); sHead.setAttribute('cy', hp[1].toFixed(1)); }
    put(spark, W / 2, 960, o, 1); }
  // 2 — Newton at the Mint
  { const p = proj(newtonMint.position.x, 2.55, newtonMint.position.z); put(nameEl, Math.min(760, Math.max(300, p[0])), Math.min(980, Math.max(640, p[1] - 80)), win(t, Math.max(T.name, T.wipe1 + 1.3), T.b3 + 0.4, 0.3, 0.3), pop(t, Math.max(T.name, T.wipe1 + 1.3))); }
  // context chips (one line at the top that says where and when we are)
  let ct = '', co = 0, cp = 0;
  const CH2 = [[T.wipe1 + 0.9, T.name - 0.1, 'London · the Royal Mint'], [T.b3 + 0.2, T.jan - 0.15, '1720 · Exchange Alley, London'], [T.jan, T.b5 + 0.4, 'January 1720'], [T.april - 0.2, T.b6 - 0.1, 'April 1720'],
    [T.b7 + 0.1, T.b8 - 0.15, 'the price keeps climbing'], [T.story, T.b9 - 0.15, 'an old story says'], [T.summer - 0.1, T.b10 - 0.1, 'summer 1720'], [T.june, T.b11 - 0.1, 'June 1720 · buying back'],
    [T.sept - 0.1, T.b13 - 0.1, 'September 1720'], [T.dec - 0.1, T.b14 - 0.15, 'December 1720'], [T.wipe3 + 0.85, T.b16 - 0.2, '1724 · four years later']];
  for (const [a, b, s] of CH2) { const o = win(t, a, b, 0.22, 0.22); if (o > co) { co = o; ct = s; cp = pop(t, a); } }
  if (ct) setTxt(chip, ct); put(chip, W / 2, 472, co, cp);
  // the chart, three times: January → April, summer → June, September → December
  { const o = Math.max(win(t, T.jan - 0.1, T.b6 + 0.15, 0.3, 0.3), win(t, T.summer - 0.3, T.b11 + 0.1, 0.3, 0.3), win(t, T.sept - 0.3, T.b14 - 0.25, 0.3, 0.3));
    if (o > 0.001) {
      const m = monthAt(t), pts = PRICE.filter(p => p[0] < m).map(p => `${PX(p[0]).toFixed(1)},${PY(p[1]).toFixed(1)}`); const hp = [PX(m), PY(priceAt(m))]; pts.push(`${hp[0].toFixed(1)},${hp[1].toFixed(1)}`);
      setOp(cLine, 1); cLine.setAttribute('points', pts.join(' ')); cHead.setAttribute('cx', hp[0].toFixed(1)); cHead.setAttribute('cy', hp[1].toFixed(1));
      setOp(cSell, seg(t, T.april + 0.4, T.april + 0.7)); setOp(cBuy, seg(t, T.june + 0.1, T.june + 0.4)); setOp(cRef, seg(t, T.less - 0.2, T.less + 0.2) * 0.9);
      setOp(cLab.l128, seg(t, T.p128, T.p128 + 0.3)); setOp(cLab.l350, seg(t, T.april + 0.5, T.april + 0.8)); setOp(cLab.l1050, seg(t, T.thousand, T.thousand + 0.3)); setOp(cLab.l124, seg(t, T.p124 + 0.1, T.p124 + 0.4)); setOp(cLab.lless, seg(t, T.less, T.less + 0.3));
    }
    put(chart, W / 2, 735, o, 0.96 + 0.04 * o); }
  // 5 — Newton sells, 20,000 richer
  { const p = proj(NPILE[0] + 0.3, 1.3, NPILE[2]); put(richTag, Math.max(250, p[0]), Math.max(1030, p[1] - 40), win(t, T.richer - 0.15, T.b6 + 1.0, 0.2, 0.25) * (p[2] ? 1 : 0), pop(t, T.richer - 0.15)); }
  // 6–7 — the price climbs: a ticker over the coffee house, and the loop
  { const ticks = [T.climbing, T.buy, T.buying, T.higher, T.b8 + 0.2], vals = [350, 420, 500, 600, 750, 950]; let k = 0; for (const tk of ticks) if (t >= tk) k++; setHTML(tickB, '£' + vals[k]);
    const p = proj(COFFEE[0] + 1.5, 4.4, -4.0); put(ticker, p[0], p[1], win(t, T.climbing - 0.1, T.b8 + 0.9, 0.2, 0.25) * (p[2] ? 1 : 0), pop(t, T.climbing - 0.1) * (1 + 0.08 * Math.max(...ticks.map(tk => win(t, tk, tk + 0.12, 0.05, 0.2))))); }
  { put(loop, W / 2, 600, win(t, T.buy - 0.1, T.b8 - 0.1, 0.25, 0.25), pop(t, T.buy - 0.1)); const sp = loop.querySelectorAll('.a'); setOp(sp[0], 0.45 + 0.55 * Math.max(win(t, T.buy - 0.1, T.buy + 0.6, 0.1, 0.2), win(t, T.buying - 0.1, T.buying + 0.6, 0.1, 0.2))); setOp(sp[1], 0.45 + 0.55 * Math.max(win(t, T.buy + 0.5, T.buying, 0.1, 0.2), win(t, T.higher - 0.1, T.higher + 0.8, 0.1, 0.2))); }
  // 8 — the madness of the people
  put(quote, W / 2, 680, win(t, T.story + 0.2, T.b9 - 0.2, 0.3, 0.25), pop(t, T.story + 0.2));
  // 11 — almost all his money
  { const v = c01(0.62 * eo(seg(t, T.back - 0.2, T.top + 0.2)) + 0.22 * eo(seg(t, T.kept, T.kept + 0.9)) + 0.13 * eo(seg(t, T.all - 0.2, T.all + 0.6))); meterFill.style.width = (300 * v).toFixed(1) + 'px'; setTxt(meterB, Math.round(v * 100) + '%');
    put(meter, W / 2, 560, win(t, T.b11 - 0.1, T.b12 - 0.05, 0.25, 0.25), 1); const p = proj(STK[0], 2.0, STK[2]); put(almost, p[0], p[1] - 40, win(t, T.all + 0.1, T.b12 - 0.05, 0.2, 0.2) * (p[2] ? 1 : 0), pop(t, T.all + 0.1)); }
  // 14 — a third of everything he had
  { const u = eo(seg(t, T.lost + 0.2, T.third + 0.3)); worthFill.style.width = (560 * (1 - u / 3)).toFixed(1) + 'px'; worthGone.style.width = (560 * u / 3).toFixed(1) + 'px'; setOp(worthD, seg(t, T.third, T.third + 0.25));
    put(worth, W / 2, 640, win(t, T.b14 + 0.1, T.wipe3 - 0.05, 0.3, 0.25), pop(t, T.b14 + 0.1)); }
  // 15 — the letter
  { const n = Math.round(LETTER.length * seg(t, T.wrote + 0.35, T.very + 1.3)); setHTML(letterTx, LETTER.slice(0, n) + (n < LETTER.length && n > 0 ? '<i></i>' : '')); put(letter, W / 2, 700, win(t, T.wrote, T.b16 - 0.15, 0.3, 0.25), pop(t, T.wrote)); }
  // 16 — title and lesson; 17 — the legend
  put(title, W / 2, 610, win(t, T.storyT, T.cta - 0.1, 0.4, 0.3), 0.94 + 0.06 * eo(seg(t, T.storyT, T.storyT + 0.6)));
  put(lesson, W / 2, 1150, win(t, T.even, T.cta - 0.15, 0.3, 0.25), pop(t, T.even));
  { const o = seg(t, T.cta + 0.1, T.cta + 0.4); if (o > 0) { setTxt(chip, 'an old London legend'); put(chip, W / 2, 472, o, pop(t, T.cta + 0.1)); } }
  { const n = Math.min(5, Math.floor(c01((t - T.apple) / 0.55) * 5.001)), typed = 'APPLE'.slice(0, n), caret = (n < 5 || Math.floor(t * 2.4) % 2) && t < T.rain0 ? '<i></i>' : '';
    setHTML(cIn, typed ? `<b>${typed}</b>${caret}` : `<em>Add a comment…</em>${caret}`); const sent = t > T.rain0 - 0.25; const pc = sent ? 'post on sent' : n === 5 ? 'post on' : 'post'; if (cPost.className !== pc) cPost.className = pc; setTxt(cPost, sent ? 'Posted ✓' : 'Post');
    put(cbox, W / 2, 1210, seg(t, T.ctaC, T.ctaC + 0.3), pop(t, T.ctaC) * (1 + 0.06 * win(t, T.rain0 - 0.25, T.rain0 + 0.05, 0.08, 0.2))); }
  put(quip, W / 2, 1330, seg(t, T.notTip, T.notTip + 0.2), pop(t, T.notTip));
}

// ───────────────────────── one frame
const _m4 = new THREE.Matrix4(), _q = new THREE.Quaternion(), _e = new THREE.Euler(), _p = new THREE.Vector3(), _s = new THREE.Vector3();
const hopsAt = (t, list, ph) => { let y = 0; for (const h of list) { const u = (t - h - ph) / 0.42; if (u > 0 && u < 1) y = Math.max(y, Math.sin(u * Math.PI) * 0.5); } return y; };
const CHEER = [T.climbing, T.buy, T.buying, T.higher, T.madness + 0.4, T.thousand, T.top];
function renderAt(t) {
  const s = skyAt(t), night = s.glow;
  paintSky(s); scene.fog.color.setRGB(s.fog[0], s.fog[1], s.fog[2]);
  hemi.color.setRGB(...s.hemS); hemi.groundColor.setRGB(...s.hemG); hemi.intensity = s.hemI;
  sun.color.setRGB(...s.sunC); sun.intensity = s.sunI;
  const az = s.az * Math.PI / 180, el = s.el * Math.PI / 180, sd = [Math.cos(el) * Math.sin(az), Math.sin(el), Math.cos(el) * Math.cos(az)];
  starM.opacity = s.star * 0.9; starM2.opacity = s.star * (0.65 + 0.35 * Math.sin(t * 3.1)); stars.visible = stars2.visible = stars3.visible = s.star > 0.01;
  glowMat.opacity = c01(night * 1.1); cityGlow.material.opacity = night * 0.7; GOLD.emissiveIntensity = 0.5 + night * 0.9; SACK.emissiveIntensity = 0.4 + night * 0.6;
  // seasons
  const sn = snowAt(t); snowMat.opacity = sn; snowRoofs.visible = sn > 0.01; snowGround.material.opacity = sn * 0.85; snowGround.visible = sn > 0.01;
  const [lc, lk] = leafAt(t); CANOPY.color.copy(lc);
  for (const tr of trees) { const k = Math.max(0.001, lk); tr.cn.scale.setScalar(k * (1 + 0.025 * Math.sin(t * 1.3 + tr.ph))); tr.cn.visible = lk > 0.01; tr.cn.rotation.z = Math.sin(t * 1.1 + tr.ph) * 0.02; }
  // the Mint: the press turns and strikes
  { let k = -1; for (let i = 0; i < STRIKE.length; i++) if (t >= STRIKE[i] - 0.45) k = i; const u = k < 0 ? 0 : seg(t, STRIKE[k] - 0.45, STRIKE[k]); const down = k < 0 ? 0 : (u < 1 ? u * u : 1 - seg(t, STRIKE[k], STRIKE[k] + 0.25));
    bar.position.set(PRESS[0], 3.0 - 0.35 * down, PRESS[1]); bar.rotation.y = (k + u) * Math.PI * 0.9; }
  workers[0].rotation.y = Math.PI + Math.sin(t * 5) * 0.15; workers[1].position.y = Math.abs(Math.sin(t * 3.2)) * 0.04;
  newtonMint.rotation.y = Math.PI - 0.25 + 0.12 * Math.sin(t * 0.8); newtonMint.visible = t < T.b4;
  // the crowd: arrives, cheers, leaves
  for (const c of CROWD) {
    const kin = c.tIn < 0 ? 1 : (t < c.tIn ? 0 : back(seg(t, c.tIn, c.tIn + 0.4))), kout = 1 - eio(seg(t, c.tOut, c.tOut + 0.45)), k = Math.max(0.001, kin * kout);
    const vis = t > T.wipe1 - 0.4 && k > 0.01; c.m.visible = vis || (t < T.wipe1 - 0.3);
    c.m.scale.set(c.sc * k, c.sc * k, c.sc * k);
    c.m.position.y = (t < T.wipe1 ? 0 : hopsAt(t, CHEER, c.hop)) + Math.abs(Math.sin(t * 4 + c.ph)) * 0.04 * (t > T.b6 && t < T.fell1 ? 1 : 0.3);
    c.m.rotation.z = t > T.b6 && t < T.fell1 ? Math.sin(t * 3 + c.ph) * 0.05 : 0;
  }
  // Newton and the broker in the alley
  { const inAlley = t > T.b4 - 0.5 && t < T.wipe3 + 0.3; newton.visible = inAlley; broker.visible = inAlley && t < T.b14 - 0.2 ? true : inAlley && t < T.b14 + 0.4;
    newton.position.y = hopsAt(t, [T.richer - 0.1], 0) * 0.6; newton.rotation.y = 0.12 + (Math.PI - 0.32) * eio(seg(t, T.b14 - 0.2, T.b14 + 0.9)) + (t > T.b14 ? Math.sin(t * 0.7) * 0.06 : 0);
    broker.rotation.y = Math.PI + Math.sin(t * 1.7) * 0.08; broker.scale.setScalar(1.02 * Math.max(0.001, 1 - eio(seg(t, T.b14 - 0.2, T.b14 + 0.3)))); }
  newtonStudy.visible = t > T.wipe3 + 0.2; newtonStudy.rotation.z = Math.sin(t * 2.4) * 0.03;
  { const w = t > T.wipe3; quill.visible = w; quill.position.set(STUDY[0] - 0.15 + Math.sin(t * 7) * 0.12, 1.38, STUDY[1] + 0.32 + Math.sin(t * 3.1) * 0.05); quill.rotation.set(0.5, 0, -0.35 + Math.sin(t * 7) * 0.08);
    const fk = seg(t, T.wipe3 + 0.2, T.wipe3 + 0.6); candleF.visible = candleGlow.visible = fk > 0.01; candleF.scale.set(1, 0.85 + 0.15 * Math.sin(t * 13) + 0.1 * Math.sin(t * 29), 1); candleL.intensity = fk * (9 + Math.sin(t * 11)); candleGlow.material.opacity = fk * 0.8; }
  // sacks of gold: paid to Newton in April, paid back in June
  SACKS.forEach((sk, i) => { const tA = SELL[i], tB = BUYS[i]; let pos = null;
    if (t >= tA && t < tA + 0.6) { const u = (t - tA) / 0.6; pos = [lerp(BRK[0], sk.p[0], u), lerp(BRK[1], sk.p[1], u) + 2.2 * 4 * u * (1 - u), lerp(BRK[2], sk.p[2], u)]; }
    else if (t >= tA + 0.6 && t < tB) pos = sk.p;
    else if (t >= tB && t < tB + 0.6) { const u = (t - tB) / 0.6; pos = [lerp(sk.p[0], BRK[0], u), lerp(sk.p[1], BRK[1], u) + 2.2 * 4 * u * (1 - u), lerp(sk.p[2], BRK[2], u)]; }
    sk.m.visible = !!pos; if (pos) { sk.m.position.set(...pos); sk.m.scale.set(0.72, 0.62, 0.66); } });
  // the paper stack beside Newton (his shares), greying and blowing away in the crash
  { const grey = seg(t, T.fell1, T.p124); stackMat.color.setRGB(lerp(0.98, 0.6, grey), lerp(0.96, 0.58, grey), lerp(0.91, 0.56, grey)); let n = 0;
    STACKT.forEach((t0, i) => { const gone = t > T.fell2 + i * 0.12 && i > 4; if (t < t0 || gone || t > T.wipe3 + 0.3) return; _p.set(STK[0] + Math.sin(i * 2.3) * 0.04, STK[1] + i * 0.03, STK[2]); _e.set(0, i * 0.5, 0); _q.setFromEuler(_e); _s.set(1, 1, 1); stackMesh.setMatrixAt(n++, _m4.compose(_p, _q, _s)); });
    stackMesh.count = n; stackMesh.instanceMatrix.needsUpdate = true; }
  // flying papers
  { let n = 0; for (const f of FP) { const u = (t - f.t0) / f.d; if (u <= 0 || u >= 1 || n >= 480) continue; if (f.sp && f.h === 0 && t > T.wipe1 - 0.2) continue;
      const fl = f.sp ? Math.sin(t * f.w + f.ph) : 0; _p.set(lerp(f.a[0], f.b[0], u) + fl * 0.4, lerp(f.a[1], f.b[1], f.h === 0 ? u : u) + f.h * 4 * u * (1 - u), lerp(f.a[2], f.b[2], u) + Math.cos(t * f.w * 0.7 + f.ph) * 0.3 * (f.sp ? 1 : 0));
      _e.set(fl * 0.9, f.ph + t * 1.5 * (f.sp ? 1 : 0.2), Math.cos(t * f.w + f.ph) * 0.7 * (f.sp ? 1 : 0.2)); _q.setFromEuler(_e); _s.setScalar(f.sp ? 1.6 : 1.3); paperMesh.setMatrixAt(n++, _m4.compose(_p, _q, _s)); }
    paperMesh.count = n; paperMesh.instanceMatrix.needsUpdate = true; }
  // coins at the Mint (pile + flying)
  { let n = 0; const shown = Math.min(70, STRIKE.filter(s0 => t >= s0 + 0.62).length * 3 + 8);
    if (t > T.wipe1 - 0.2 && t < T.b5) { for (let k = 0; k < shown; k++) { const c = MPILE.c[k]; _p.set(MPILE.x + c[0], c[1], MPILE.z + c[2]); _e.set(c[3], 0, c[4]); _q.setFromEuler(_e); _s.setScalar(1.15); coinMesh.setMatrixAt(n++, _m4.compose(_p, _q, _s)); }
      for (const f of FL) { const u = (t - f.t0) / f.d; if (u <= 0 || u >= 1) continue; _p.set(lerp(f.a[0], f.b[0], u), lerp(f.a[1], f.b[1], u) + f.h * 4 * u * (1 - u), lerp(f.a[2], f.b[2], u)); _e.set(f.sp + t * f.w, f.sp * 2, t * f.w * 0.7); _q.setFromEuler(_e); _s.setScalar(1.25); coinMesh.setMatrixAt(n++, _m4.compose(_p, _q, _s)); } }
    coinMesh.count = n; coinMesh.instanceMatrix.needsUpdate = true; }
  // leaves
  { let n = 0; for (const l of LEAVES) { const u = (t - l.t0) / l.d; if (u <= 0 || u >= 1) continue; _p.set(l.x + l.dx * u + Math.sin(t * 2.2 + l.ph) * 0.6, lerp(l.y0, 0.05, u), l.z + Math.cos(t * 1.7 + l.ph) * 0.5); _e.set(Math.sin(t * 4 + l.ph) * 1.2, l.ph + t, Math.cos(t * 3 + l.ph)); _q.setFromEuler(_e); _s.setScalar(1.3); leafMesh.setMatrixAt(n++, _m4.compose(_p, _q, _s)); }
    leafMesh.count = n; leafMesh.instanceMatrix.needsUpdate = true; leafMesh.material.color.setHSL(0.07 + 0.02 * Math.sin(t), 0.75, 0.5); }
  // apples
  { let n = 0; for (const a of APL) { const u = (t - a.t0) / a.d; if (u <= 0) continue; let y; if (u < 1) y = lerp(a.y0, a.gy, u * u); else { const v = (t - a.t0 - a.d) / 0.5; y = a.gy + (v < 1 ? Math.sin(v * Math.PI) * 0.7 * (1 - v * 0.5) : 0); }
      _p.set(a.x, y, a.z); _e.set(0, a.ph + (u < 1 ? t * 3 : 0), u < 1 ? Math.sin(t * 5 + a.ph) * 0.4 : 0.2); _q.setFromEuler(_e); _s.setScalar(2.1); appleMesh.setMatrixAt(n++, _m4.compose(_p, _q, _s)); }
    appleMesh.count = n; appleMesh.instanceMatrix.needsUpdate = true; }
  // sparkles on the gold (Mint pile, Newton's sacks)
  { let k = 0; const put3 = (x, y, z, sz, on) => { const sp = sparks[k++]; if (!sp) return; const tw = Math.pow(Math.abs(Math.sin(t * sp.userData.w + sp.userData.ph)), 3); sp.position.set(x, y, z); sp.scale.setScalar(sz * (0.25 + tw)); sp.material.opacity = on * (0.25 + 0.75 * tw); sp.visible = on > 0.01; };
    for (let i = 0; i < 6; i++) put3(MPILE.x + Math.cos(i) * 0.5, 0.5 + (i % 3) * 0.2, MPILE.z + Math.sin(i * 2) * 0.5, 0.42, t > T.wipe1 && t < T.b5 ? 1 : 0);
    SACKS.forEach((sk, i) => put3(sk.p[0], sk.p[1] + 0.35, sk.p[2], 0.42, sk.m.visible && t > SELL[i] + 0.6 && t < BUYS[i] ? 1 : 0));
    while (k < sparks.length) sparks[k++].visible = false; }
  // smoke from the Mint's chimneys
  for (const sp of smoke) { const u = (t * 0.22 + sp.userData.ph) % 1; sp.position.set(sp.userData.x + u * 3, 11 + u * 9, sp.userData.z - u * 1.5); sp.scale.setScalar(1.2 + u * 4); sp.material.opacity = 0.5 * Math.sin(u * Math.PI) * (1 - night * 0.7); }
  for (const b of ships) { if (b.userData.mv) b.position.x = b.userData.x + b.userData.mv * t * 0.9; b.position.y = -0.95 + Math.sin(t * 1.2 + b.userData.ph) * 0.06; b.rotation.x = Math.sin(t * 0.9 + b.userData.ph) * 0.02; }
  for (const b of boats) { b.position.x = b.userData.x + b.userData.dir * t * 1.3; b.position.y = -0.82 + Math.sin(t * 1.4 + b.userData.ph) * 0.06; }
  for (const c of clouds) { c.position.x = c.userData.x0 + t * 1.1; c.material.opacity = 0.9 - 0.62 * night; c.material.color.setRGB(lerp(s.hor[0], 1, 0.55) * (0.45 + 0.55 * (1 - night * 0.75)), lerp(s.hor[1], 1, 0.55) * (0.45 + 0.55 * (1 - night * 0.75)), lerp(s.hor[2], 1, 0.55) * (0.5 + 0.5 * (1 - night * 0.6))); }
  for (const g of glints) { g.position.set(((g.userData.x + t * g.userData.v * 2 + 150) % 300) - 150, -0.93, g.userData.z); g.scale.x = 0.5 + 0.5 * Math.abs(Math.sin(t * 1.7 + g.userData.z)); }

  updateBirds(t);
  setCamera(t);
  // snowflakes fall around what the camera looks at
  { flakes.material.opacity = sn * 0.95; flakes.visible = sn > 0.01; if (flakes.visible) { const a = snowG.attributes.position, sp = Math.max(18, camD * 0.6); for (let i = 0; i < SNN; i++) { const f = SNF[i], y = ((f[1] * 30 - t * (1.4 + f[3] * 0.8)) % 30 + 30) % 30; a.setXYZ(i, camTg.x + (f[0] - 0.5) * sp * 2 + Math.sin(t * 0.8 + f[3] * 6) * 0.6, y, camTg.z + (f[2] - 0.5) * sp * 2); } a.needsUpdate = true; } }
  dome.position.copy(camera.position); stars.position.copy(camera.position); stars2.position.copy(camera.position); stars3.position.copy(camera.position);
  orb.position.set(camera.position.x + sd[0] * 1600, camera.position.y + sd[1] * 1600, camera.position.z + sd[2] * 1600); orb.scale.setScalar(s.orbS * 2); orb.lookAt(camera.position); orbM.color.setRGB(...s.orb);
  halo.position.copy(orb.position); halo.scale.setScalar(s.orbS * 13); halo.lookAt(camera.position); haloM.color.setRGB(...s.orb); haloM.opacity = 0.75;
  const S2 = Math.min(150, Math.max(18, camD * 0.85));
  sun.target.position.copy(camTg); sun.position.set(camTg.x + sd[0] * 340, camTg.y + sd[1] * 340, camTg.z + sd[2] * 340);
  const sc = sun.shadow.camera; sc.left = -S2; sc.right = S2; sc.top = S2; sc.bottom = -S2; sc.updateProjectionMatrix();
  renderer.render(scene, camera);
  updateUI(t);
}
window.camCheck = () => {
  const boxes = [];
  for (const h of HOUSES) { if (h.study) { boxes.push([h.x - 3.4, h.x + 3.4, h.z - 2.9, h.z + 2.9, h.h + h.rh, 'study-upper', 3.9]); continue; } boxes.push([h.x - h.w / 2 - 0.2, h.x + h.w / 2 + 0.2, h.z - h.d / 2 - 0.35, h.z + h.d / 2 + 0.35, h.h + h.rh + 1.7, 'house@' + h.x.toFixed(0) + ',' + h.z.toFixed(0)]); }
  boxes.push([SPC[0] - 18.5, SPC[0] + 17, SPC[1] - 5.6, SPC[1] + 5.6, 13, 'cathedral'], [SPC[0] - 3.6, SPC[0] + 7.6, SPC[1] - 15.2, SPC[1] + 15.2, 13, 'cathedral'], [SPC[0] - 6, SPC[0] + 10, SPC[1] - 8.2, SPC[1] + 8.2, 34.5, 'dome'], [SPC[0] - 18, SPC[0] - 13, SPC[1] - 6.5, SPC[1] + 6.5, 23.5, 'towers']);
  boxes.push([TOW[0] + 8 - 8.3, TOW[0] + 8 + 8.3, TOW[1] - 7.3, TOW[1] + 7.3, 23, 'keep']);
  for (const [x0, z0, x1, z1] of WALL) boxes.push([Math.min(x0, x1) - 0.9, Math.max(x0, x1) + 0.9, Math.min(z0, z1) - 0.9, Math.max(z0, z1) + 0.9, 6.8, 'wall']);
  for (const [x, z] of [[60, 0], [100, 0], [60, 34], [100, 34], [60, 8.0], [60, 28.0]]) boxes.push([x - 2.8, x + 2.8, z - 2.8, z + 2.8, 9.3, 'tower']);
  for (const tr of trees) boxes.push([tr.x - 1.6, tr.x + 1.6, tr.z - 1.6, tr.z + 1.6, tr.h + 1.2, 'tree']);
  boxes.push([PRESS[0] - 1.9, PRESS[0] + 1.9, PRESS[1] - 0.8, PRESS[1] + 0.8, 4.2, 'press']);
  const out = []; let cur = null;
  for (let f = 0; f < Math.ceil(DUR * 30); f++) {
    const t = f / 30; setCamera(t); const c = camera.position; let hit = null;
    for (const [x0, x1, z0, z1, y1, nm, y0] of boxes) if (c.x > x0 - 0.9 && c.x < x1 + 0.9 && c.z > z0 - 0.9 && c.z < z1 + 0.9 && c.y < y1 + 0.9 && c.y > (y0 ?? -99)) { hit = nm; break; }
    for (const b of ships) { const p = b.position; const ang = b.rotation.y; if (Math.abs(c.x - (b.userData.mv ? b.userData.x + b.userData.mv * t * 0.9 : p.x)) < 7.5 && Math.abs(c.z - p.z) < 2.6 && c.y < 14.5) hit = 'ship'; }
    if (hit) { if (cur && cur[2] === hit && f - cur[1] <= 1) cur[1] = f; else { cur = [f, f, hit]; out.push(cur); } }
  }
  return out.map(([a, b, n]) => `${(a / 30).toFixed(2)}-${(b / 30).toFixed(2)}s ${n}`);
};
window.renderAt = renderAt;
window.CUES = { T, DUR, strike: STRIKE.map(x => +x.toFixed(3)), rain: RAIN.sort((a, b) => a - b), typing: [0, 1, 2, 3, 4].map(i => +(T.apple + (i + 0.5) * 0.11).toFixed(3)), sell: SELL.map(x => +(x + 0.6).toFixed(3)), buys: BUYS.map(x => +(x + 0.6).toFixed(3)),
  stack: STACKT.map(x => +x.toFixed(3)), crowdIn: CROWD.filter(c => c.tIn > 0).map(c => +c.tIn.toFixed(3)).sort((a, b) => a - b), crowdOut: CROWD.map(c => +c.tOut.toFixed(3)).sort((a, b) => a - b), cheer: CHEER.map(x => +x.toFixed(3)), sent: TIM.sentences.map(s => s.s) };
document.fonts.ready.then(() => Promise.all(['700 64px Figtree', '900 190px Fraunces', '800 30px JBM', '700 22px Inter', '700 78px Fraunces', '800 54px Figtree', '600 34px Figtree', '500 18px Inter'].map(f => document.fonts.load(f)))).then(() => { renderAt(0); window.__ready = true; });
