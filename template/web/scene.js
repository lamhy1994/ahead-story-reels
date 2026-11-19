// The King With Too Much Gold — low-poly storybook scene (deterministic: window.renderAt(t) draws the frame for time t)
import * as THREE from 'three';
import { C, SKIN, ROBES, MAT, GOLD, SACK, SACK_EMPTY, rng, M, GB, person, camel, building, minaret, stall, palace, pyramid, tent, palm, boat, cloud, COIN, LOAF, SACKG } from './kit.js';

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
const R = rng(13240719);

// ───────────────────────── story clock (everything hangs off the narration)
const T = {
  wipe1: S(2) - 0.42, name: wt(2, 'Mansa') - 0.12, rich: wt(2, 'richest') - 0.15,
  b3: S(3) - 0.1, gold3: wt(3, 'gold') - 0.35,
  b4: S(4) - 0.1, days: wt(4, 'three') - 0.1, wipe2: wt(4, 'entered') - 0.42,
  b5: S(5) - 0.05, months: wt(5, 'three') - 0.1, generous: wt(5, 'generous') - 0.2, freely: wt(5, 'freely') - 0.6, markets: wt(5, 'markets') - 0.7, official: wt(5, 'official') - 0.3,
  b6: S(6) - 0.05, fills: wt(6, 'fills') - 0.3, piece: wt(6, 'piece') - 0.2, less: wt(6, 'less') - 0.15,
  b7: S(7) - 0.05, price: wt(7, 'price') - 0.2, tenth: wt(7, 'tenth') - 0.2, twelve: wt(7, 'twelve') - 0.15,
  wipe3: S(8) - 0.42, home: wt(8, 'home') - 0.2, ran: wt(8, 'ran') - 0.1,
  b9: S(9) - 0.05, borrowed: wt(9, 'borrowed'), interest: wt(9, 'interest') - 0.2, never: wt(9, 'never') - 0.15,
  b10: S(10) - 0.05, story: wt(10, 'story') - 0.2, even: wt(10, 'Even') - 0.15, cta: S(11) - 0.1,
  ctaC: wt(11, 'comment') - 0.15, gold: wt(11, 'GOLD') - 0.3, rain0: wt(11, 'someone') - 0.15, rain1: wt(11, 'Just') - 0.05, notToo: wt(11, 'too', 0) - 0.1,
};
window.T = T;

// ───────────────────────── renderer, sky, light
const canvas = document.getElementById('gl');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: QP.get('aa') !== '0', preserveDrawingBuffer: true });
renderer.setPixelRatio(1); renderer.setSize(W, H, false);
renderer.toneMapping = THREE.NeutralToneMapping; renderer.toneMappingExposure = 1.0;
renderer.shadowMap.enabled = QP.get('sh') !== '0'; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
const scene = new THREE.Scene(); scene.fog = new THREE.Fog(0xffffff, 70, 520);
const camera = new THREE.PerspectiveCamera(35, W / H, 0.5, 2400);
const hemi = new THREE.HemisphereLight(0xffffff, 0x886644, 1.5); scene.add(hemi);
const sun = new THREE.DirectionalLight(0xffffff, 3); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); sun.shadow.bias = -0.0005; sun.shadow.normalBias = 0.3; sun.shadow.camera.near = 1; sun.shadow.camera.far = 760; scene.add(sun, sun.target);

const hx = h => { const c = new THREE.Color(h); return [c.r, c.g, c.b]; };
const P = (top, mid, hor, fog, sunC, sunI, hemS, hemG, hemI, star, glow, az, el, orb, orbS) => ({ top: hx(top), mid: hx(mid), hor: hx(hor), fog: hx(fog), sunC: hx(sunC), sunI, hemS: hx(hemS), hemG: hx(hemG), hemI, star, glow, az, el, orb: hx(orb), orbS });
const PRE = {
  NG: P(0x070B24, 0x141C4B, 0x3A2F63, 0x1F2050, 0xA9B8FF, 1.5, 0x4455AA, 0x4A3320, 1.25, 1, 1, 300, 42, 0xFFF4D6, 30),
  NIGHT: P(0x070B24, 0x141C4B, 0x30326A, 0x262A5E, 0xB4C2FF, 2.1, 0x5567C4, 0x3A3048, 1.55, 1, 1, 300, 42, 0xFFF4D6, 30),
  DAWN: P(0x2C3E7E, 0xD9788A, 0xFFC27A, 0xF0B48A, 0xFFB070, 2.6, 0x9AAEE6, 0xA8744A, 1.25, 0.15, 0.2, 100, 9, 0xFFD9A0, 44),
  MORN: P(0x4E9FDC, 0x9FD0EA, 0xFBE6BC, 0xF3DDB6, 0xFFE2B0, 3.2, 0xBFDFFF, 0xC9A070, 1.6, 0, 0, 122, 32, 0xFFF0C8, 40),
  DAY: P(0x2F8FDA, 0x86C6EE, 0xF6E7C4, 0xEEDFC0, 0xFFF1D6, 3.5, 0xCFE8FF, 0xD2AE7C, 1.7, 0, 0, 160, 54, 0xFFF8E0, 38),
  GOLDEN: P(0x3C7FCB, 0xF2C58A, 0xFFD79A, 0xF6CF9A, 0xFFC878, 3.2, 0xE8D2B0, 0xC08A55, 1.5, 0, 0.1, 246, 22, 0xFFE0A0, 44),
  SUNSET: P(0x2E2F72, 0xE0707A, 0xFFB25E, 0xEE9A6A, 0xFF9050, 2.6, 0xA98AC0, 0x8A5A44, 1.2, 0.12, 0.55, 262, 8, 0xFFB060, 50),
  DUSK: P(0x141A4C, 0x4A3F86, 0xC06A78, 0x6A4A78, 0x93A4F4, 1.6, 0x5A62B0, 0x3A2A40, 1.1, 0.65, 0.9, 296, 36, 0xFFF4D6, 30),
};
const SKY = [[0, 'NG'], [T.wipe1 + 0.1, 'NG'], [T.wipe1 + 1.2, 'DAWN'], [11.4, 'MORN'], [S(3) + 0.6, 'DAY'], [T.b4 - 0.4, 'DAY'], [T.b4 + 1.0, 'SUNSET'], [T.days + 0.9, 'NIGHT'], [T.wipe2, 'NIGHT'], [T.wipe2 + 0.75, 'MORN'],
  [T.b5 + 1.5, 'DAY'], [T.b6, 'DAY'], [T.b7 + 0.8, 'GOLDEN'], [T.wipe3, 'GOLDEN'], [T.wipe3 + 0.8, 'SUNSET'], [T.b9 + 0.3, 'SUNSET'], [T.b9 + 3.8, 'DUSK'], [T.b10 + 0.2, 'NIGHT'], [DUR + 1, 'NIGHT']];
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
// stars + sun/moon
const starG = new THREE.BufferGeometry(); { const a = []; for (let i = 0; i < 700; i++) { const u = R(), th = R() * Math.PI * 2, y = 0.04 + 0.96 * u, r = Math.sqrt(1 - y * y); a.push(r * Math.cos(th) * 1700, y * 1700, r * Math.sin(th) * 1700); } starG.setAttribute('position', new THREE.Float32BufferAttribute(a, 3)); }
const starM = new THREE.PointsMaterial({ color: 0xffffff, size: 2.6, sizeAttenuation: false, transparent: true, fog: false, depthWrite: false, toneMapped: false });
const stars = new THREE.Points(starG, starM); scene.add(stars);
const starG2 = new THREE.BufferGeometry(); { const a = []; for (let i = 0; i < 90; i++) { const u = R(), th = R() * Math.PI * 2, y = 0.1 + 0.9 * u, r = Math.sqrt(1 - y * y); a.push(r * Math.cos(th) * 1700, y * 1700, r * Math.sin(th) * 1700); } starG2.setAttribute('position', new THREE.Float32BufferAttribute(a, 3)); }
const starM2 = new THREE.PointsMaterial({ color: 0xFFF2CC, size: 5, sizeAttenuation: false, transparent: true, fog: false, depthWrite: false, toneMapped: false });
const stars2 = new THREE.Points(starG2, starM2); scene.add(stars2);
function radial(inner, outer) { const cv = document.createElement('canvas'); cv.width = cv.height = 128; const g = cv.getContext('2d'); const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, inner); gr.addColorStop(1, outer); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); const tx = new THREE.CanvasTexture(cv); tx.colorSpace = THREE.SRGBColorSpace; return tx; }
const orbM = new THREE.MeshBasicMaterial({ color: 0xffffff, fog: false, toneMapped: false, depthWrite: false });
const orb = new THREE.Mesh(new THREE.CircleGeometry(1, 28), orbM); scene.add(orb);
const haloM = new THREE.MeshBasicMaterial({ map: radial('rgba(255,255,255,0.55)', 'rgba(255,255,255,0)'), transparent: true, fog: false, toneMapped: false, depthWrite: false, blending: THREE.AdditiveBlending });
const halo = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), haloM); scene.add(halo);

// ───────────────────────── the road and the land
const WAY = [[-205, 9], [-172, -6], [-142, 6], [-112, -5], [-84, 4], [-60, -1], [-42, 0], [-26, 0], [-19, 0], [-7, 0], [0, 0], [20, 0], [46, 0]];
const curve = new THREE.CatmullRomCurve3(WAY.map(([x, z]) => new THREE.Vector3(x, 0, z))); curve.arcLengthDivisions = 2000;
const LEN = curve.getLength(), NS = 1400, CX = new Float32Array(NS + 1), CZ = new Float32Array(NS + 1);
for (let i = 0; i <= NS; i++) { const p = curve.getPointAt(i / NS); CX[i] = p.x; CZ[i] = p.z; }
function uAtX(x) { let lo = 0, hi = NS; while (hi - lo > 1) { const m = (lo + hi) >> 1; if (CX[m] < x) lo = m; else hi = m; } return (lo + c01((x - CX[lo]) / Math.max(1e-6, CX[hi] - CX[lo]))) / NS; }
const zAtX = x => { const u = uAtX(x) * NS, i = Math.min(NS - 1, Math.floor(u)); return lerp(CZ[i], CZ[i + 1], u - i); };
const dAtX = x => uAtX(x) * LEN;
function onPath(d) { const u = c01(d / LEN) * NS, i = Math.min(NS - 1, Math.floor(u)), f = u - i; return [lerp(CX[i], CX[i + 1], f), lerp(CZ[i], CZ[i + 1], f), Math.atan2(-(CZ[i + 1] - CZ[i]), CX[i + 1] - CX[i])]; }
const PYR = [[-92, -84, 30, 36], [-128, -102, 24, 29], [-62, -108, 16, 19]];
function terrainY(x, z) {
  const des = sm(-30, -52, x);
  let dune = 2.6 * Math.sin(x * 0.05 + 1.2 * Math.sin(z * 0.021)) + 1.8 * Math.sin(z * 0.055 + x * 0.017) + 0.8 * Math.sin((x * 0.8 + z) * 0.12);
  dune = dune * 0.55 + 1.7;
  const off = Math.abs(z - zAtX(Math.max(-205, Math.min(46, x))));
  let y = des * dune * (0.14 + 0.86 * sm(3, 18, off)) * (1 + 1.5 * sm(70, 170, Math.abs(z)));
  for (const [px, pz, pr] of PYR) y = lerp(0.5, y, sm(pr * 0.95, pr * 1.6, Math.hypot(x - px, z - pz)));
  const riv = sm(-21.5, -19.2, x) * (1 - sm(-6.8, -4.5, x));
  return lerp(y, -1.4, riv);
}
function groundY(x, z) { const deck = 0.62 * sm(-21.2, -19.4, x) * (1 - sm(-6.6, -4.8, x)); return Math.max(terrainY(x, z), Math.abs(z) < 2.6 ? deck : -9); }
{
  const g = new THREE.PlaneGeometry(600, 520, 170, 140).rotateX(-Math.PI / 2).translate(-70, 0, 0).toNonIndexed();
  const p = g.attributes.position, col = new Float32Array(p.count * 3), cA = new THREE.Color(), cB = new THREE.Color();
  for (let i = 0; i < p.count; i += 3) {
    let mx = 0, mz = 0, my = 0;
    for (let k = 0; k < 3; k++) { const x = p.getX(i + k), z = p.getZ(i + k), y = terrainY(x, z); p.setY(i + k, y); mx += x / 3; mz += z / 3; my += y / 3; }
    const n = R();
    if (mx > -4.2) { cA.set(Math.abs(mz) < 4.2 && mx < 43 ? 0xD6C298 : 0xE4D4AE); cA.offsetHSL(0, 0, (n - 0.5) * 0.03); }
    else if (mx > -23 && mx < -3) { cA.set(my < -0.9 ? 0x8E7B50 : 0xA9B872); cA.offsetHSL(0, 0, (n - 0.5) * 0.05); }
    else { cA.set(C.sandLo); cB.set(C.sandHi); cA.lerp(cB, c01(my / 5.5 + (n - 0.5) * 0.07)); }
    for (let k = 0; k < 3; k++) { col[(i + k) * 3] = cA.r; col[(i + k) * 3 + 1] = cA.g; col[(i + k) * 3 + 2] = cA.b; }
  }
  g.setAttribute('color', new THREE.BufferAttribute(col, 3)); g.computeVertexNormals();
  const land = new THREE.Mesh(g, MAT); land.receiveShadow = true; scene.add(land);
}
const water = new THREE.Mesh(new THREE.PlaneGeometry(17, 520).rotateX(-Math.PI / 2), new THREE.MeshLambertMaterial({ color: C.water, emissive: 0x0C3A52, emissiveIntensity: 0.6 })); water.position.set(-13, -0.72, 0); scene.add(water);
const glints = []; { const gm = new THREE.MeshBasicMaterial({ color: 0xDFF6FF, transparent: true, opacity: 0.5 }); for (let i = 0; i < 26; i++) { const m = new THREE.Mesh(new THREE.BoxGeometry(0.9 + R() * 1.4, 0.02, 0.1), gm); m.userData = { x: -19 + R() * 12, z: (R() - 0.5) * 150, v: 0.6 + R() * 0.8 }; scene.add(m); glints.push(m); } }

// static scenery merged into a few meshes
const world = new GB();
// bridge
world.box(15.2, 0.5, 5.4, C.stone2, -13, 0.37, 0); for (const z of [-2.6, 2.6]) { world.box(15.2, 0.6, 0.3, C.stone, -13, 0.9, z); for (let i = 0; i < 6; i++) world.box(0.4, 0.9, 0.4, C.stone, -20 + i * 2.8, 1.1, z); }
for (const x of [-17.5, -13, -8.5]) world.box(1.1, 2.4, 5.0, C.stone, x, -0.9, 0);
// city wall with a gate at z = 0
const wallRun = (x0, z0, x1, z1) => { const len = Math.hypot(x1 - x0, z1 - z0), ry = Math.atan2(-(z1 - z0), x1 - x0), n = Math.floor(len / 1.7); world.box(len, 5.6, 1.6, C.stone2, (x0 + x1) / 2, 2.8, (z0 + z1) / 2, 0, ry, 0); for (let i = 0; i <= n; i++) { const u = i / n; world.box(0.85, 0.75, 1.7, C.stone, lerp(x0, x1, u), 5.95, lerp(z0, z1, u), 0, ry, 0); } };
wallRun(0, -50, 0, -3.4); wallRun(0, 3.4, 0, 50); wallRun(0, -50, 88, -50); wallRun(0, 50, 88, 50); wallRun(88, -50, 88, 50);
for (const z of [-4.9, 4.9]) { world.box(3.4, 8.6, 3.2, C.stone, 0, 4.3, z); for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) if (i || j) world.box(0.8, 0.8, 0.8, C.stone2, i * 1.3, 9.0, z + j * 1.2); }
world.box(1.9, 1.7, 6.8, C.stone, 0, 6.6, 0); world.box(2.1, 0.5, 7.2, C.crimson, 0, 5.6, 0); world.cone(0.9, 1.3, 4, C.teal, 0, 8.1, 0, 0, Math.PI / 4, 0);
scene.add(world.mesh());
const doors = [-1, 1].map(sg => { const piv = new THREE.Group(); piv.position.set(0, 0, sg * 3.3); const d = new GB().box(0.3, 4.9, 3.25, C.wood, 0, 2.45, -sg * 1.62).box(0.34, 0.3, 3.25, C.dark, 0, 1.2, -sg * 1.62).box(0.34, 0.3, 3.25, C.dark, 0, 3.6, -sg * 1.62).mesh(); piv.add(d); piv.userData.sg = sg; scene.add(piv); return piv; });

// ───────────────────────── Cairo
const town = [];          // pop-up pieces: { m, x, tall }
const glowB = new GB();   // lit windows + lanterns (shown at night)
const clearZone = (x, z) => (x > 40 && x < 68 && Math.abs(z) < 15) || (x > 25 && x < 41 && z > 15 && z < 36);
const ROOFS = [];
function addBuilding(x, z, w, h, d, o = {}) {
  if (!o.dome) ROOFS.push([x, h + 0.34, z, w, d]);
  const m = building(w, h, d, { rand: R, ...o }); m.position.set(x, 0, z); scene.add(m);
  for (const [wx, wy, wz] of m.userData.win) if (R() < 0.62) glowB.box(0.5, 0.74, 0.05, 0xFFC866, x + wx, wy, z + wz);
  town.push({ m, x, tall: h > 7.2 }); return m;
}
const BCOL = [C.stone, C.stone2, C.ochre, C.white, 0xE3C59A, 0xD8B98C];
for (let i = 0; i < 7; i++) for (const sd of [-1, 1]) {
  const x = 6.2 + i * 5.5 + (sd > 0 ? 1.2 : 0);
  if (sd > 0 && i === 5) continue;
  addBuilding(x, sd * 12.6, 4.6 + R() * 0.6, 3.8 + R() * 2.3, 6, { front: -sd, color: BCOL[Math.floor(R() * BCOL.length)], awning: R() < 0.5 ? [C.crimson, C.teal, C.indigo][Math.floor(R() * 3)] : 0 });
}
const writerHouse = addBuilding(33.4, 13.2, 6.2, 6.3, 7.2, { front: -1, color: C.white, awning: C.teal });
for (const zr of [21, 30, 40]) for (const sd of [-1, 1]) for (let x = 6; x < 84; x += 6.4 + R() * 2.2) {
  const z = sd * (zr + (R() - 0.5) * 2.5); if (clearZone(x, z)) continue;
  const h = 4 + R() * (zr > 25 ? 6.2 : 4.4), dm = R() < 0.24;
  addBuilding(x, z, 4.8 + R() * 1.6, h, 5 + R() * 2, { front: -sd, color: BCOL[Math.floor(R() * BCOL.length)], dome: dm ? 1.6 + R() * 0.8 : 0, domeColor: [C.teal, C.white, 0xD9A441][Math.floor(R() * 3)] });
}
for (let x = 70; x < 86; x += 6.5) for (const z of [-9, 0, 9]) addBuilding(x, z + (R() - .5) * 2, 5, 5 + R() * 4, 5.5, { front: -1, color: BCOL[Math.floor(R() * BCOL.length)] });
for (const [x, z, h] of [[11, -21, 17], [26.5, 24.5, 15.5], [39, -27, 19], [61, 27, 17], [72, -20, 16]]) { const m = minaret(h); m.position.set(x, 0, z); scene.add(m); town.push({ m, x, tall: true }); }
const pal = palace(); pal.position.set(43, 0, 0); scene.add(pal); town.push({ m: pal, x: 43, tall: true });
// market stalls (north side counters face +z, south side face -z); stall 4 on the north side is the bakery
const STALLS = [];
const AWN = [[C.crimson, C.white], [C.teal, C.white], [C.indigo, 0xE9C46A], [0xE09A2B, C.white], [C.crimson, 0xE9C46A], [C.green, C.white]];
const GOODS = [[0xE4572E, 0xF2B134, 0x8FB339], [0x7A4FA0, 0xE9C46A, 0xD94F70], [0xF4A259, 0x5B8E7D, 0xBC4B51]];
for (let i = 0; i < 6; i++) for (const sd of [-1, 1]) {
  const x = 7 + i * 5 + (sd > 0 ? 2.5 : 0), bakery = sd < 0 && i === 4;
  const m = stall(...AWN[(i + (sd > 0 ? 3 : 0)) % 6], bakery ? [] : GOODS[(i + (sd > 0 ? 1 : 0)) % 3]); m.position.set(x, 0, sd * 6.5); if (sd > 0) m.rotation.y = Math.PI; scene.add(m);
  town.push({ m, x, tall: false }); STALLS.push({ x, z: sd * 6.5, sd, bakery });
}
// lantern posts along the street
const lamps = new GB(); for (let i = 0; i < 7; i++) for (const sd of [-1, 1]) { const x = 4.5 + i * 5.6, z = sd * 4.35; if (sd < 0 && x > 23.5 && x < 31) continue; lamps.cyl(0.07, 0.09, 2.9, 5, C.dark, x, 1.45, z); lamps.box(0.36, 0.44, 0.36, 0x6B4A2A, x, 3.05, z); glowB.box(0.3, 0.36, 0.3, 0xFFD27A, x, 3.05, z); }
scene.add(lamps.mesh());
const glowMat = new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, opacity: 0, toneMapped: false });
const glowMesh = new THREE.Mesh(glowB.geo(), glowMat); scene.add(glowMesh);
const cityGlow = new THREE.Mesh(new THREE.PlaneGeometry(96, 64).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ map: radial('rgba(255,190,90,0.55)', 'rgba(255,170,60,0)'), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false, opacity: 0 })); cityGlow.position.set(24, 0.12, 0); scene.add(cityGlow);

// trees, pyramids, camp, boats, clouds
const palms = []; const addPalm = (x, z, h) => { const m = palm(h, R); m.position.set(x, terrainY(x, z) - 0.1, z); m.rotation.y = R() * 6.28; m.userData.ph = R() * 6.28; scene.add(m); palms.push(m); };
for (let i = 0; i < 16; i++) { const z = (R() - 0.5) * 130; if (Math.abs(z) < 27) continue; addPalm(R() < 0.5 ? -22.6 - R() * 2.5 : -4.0 + R() * 1.6, z, 4.2 + R() * 1.8); }
for (const [x, z] of [[17, -17], [29, 18], [52, -19], [47, 17.5], [8, 18], [66, -15], [-74, -19], [-80, -22], [-70, -24], [-99, 9]]) addPalm(x, z, 4.4 + R() * 1.6);
for (const [x, z, r, h] of PYR) { const m = pyramid(r, h); m.position.set(x, 0.5, z); scene.add(m); }
const tents = []; { const TC = [C.crimson, C.indigo, C.teal, 0xE09A2B]; let k = 0; for (const [x, z] of [[-70, -9], [-76, -13], [-82, -8.5], [-88, -13.5], [-94, -9.5], [-100, -14], [-79, -19], [-91, -20]]) { const m = tent(TC[k % 4]); m.position.set(x, terrainY(x, z) - 0.05, z); m.rotation.y = R() * 6.28; scene.add(m); tents.push(m); k++; } }
const fire = new THREE.Mesh(new THREE.IcosahedronGeometry(0.5, 0), new THREE.MeshBasicMaterial({ color: 0xFFA23A, toneMapped: false })); fire.position.set(-84, terrainY(-84, -6) + 0.45, -6); scene.add(fire);
const fireGlow = new THREE.Mesh(new THREE.PlaneGeometry(26, 26).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ map: radial('rgba(255,150,60,0.7)', 'rgba(255,120,40,0)'), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false, opacity: 0 })); fireGlow.position.set(-84, terrainY(-84, -6) + 0.5, -8); scene.add(fireGlow);
const boats = [[-11, -30, 1], [-15.5, 22, -1], [-12.5, 58, 1], [-14.5, -66, -1]].map(([x, z, dir]) => { const m = boat(); m.position.set(x, -0.62, z); m.rotation.y = dir > 0 ? Math.PI / 2 : -Math.PI / 2; m.userData = { z, dir, ph: R() * 6 }; scene.add(m); return m; });
const clouds = []; for (let i = 0; i < 9; i++) { const m = cloud(R); m.position.set(-190 + i * 44 + R() * 20, 48 + R() * 26, -150 + R() * 300); m.scale.setScalar(1.6 + R() * 1.6); m.userData.x0 = m.position.x; scene.add(m); clouds.push(m); }

// ───────────────────────── people of Cairo
const CIT = [];
for (let i = 0; i < 28; i++) {
  const sd = i % 2 ? 1 : -1, x = 4.6 + i * 1.27 + (R() - 0.5) * 0.5, z = sd * (4.7 + R() * 0.8);
  if (sd < 0 && x > 24.2 && x < 29.8) continue;      // keep the view of the bakery clear
  const m = person({ robe: ROBES[Math.floor(R() * ROBES.length)], skin: SKIN[1 + Math.floor(R() * 4)], hat: R() < 0.6 ? C.white : ROBES[Math.floor(R() * ROBES.length)], s: 0.92 + R() * 0.14 });
  m.position.set(x, 0, z); scene.add(m); CIT.push({ m, x, z, hops: [], ph: R() * 6.28 });
}
const OFF = []; for (let i = 0; i < 6; i++) { const z = -5 + i * 2, m = person({ robe: [C.teal, C.indigo, 0x7A4FA0][i % 3], skin: SKIN[2 + (i % 3)], bigHat: true, hat: C.white, sash: C.gold, s: 1.06 }); m.position.set(43.4, 0.84, z); scene.add(m); OFF.push({ m, x: 43.4, z, y: 0.84, t: T.official + 0.3 + i * 0.36 }); }
const MER = [[-4.0, 3.3], [-5.3, 4.5], [-3.1, 5.6]].map(([x, z], i) => { const m = person({ robe: [0x7A4FA0, C.teal, C.crimson][i], skin: SKIN[2 + i], bigHat: true, hat: [0xE9C46A, C.white, 0xE9C46A][i], sash: C.gold, s: 1.08 }); scene.add(m); return { m, x, z }; });
const loanT = j => T.borrowed + 1.3 + j * 0.4, loanTo = j => j === 1 ? ENT[0] : CAMELS[j === 0 ? 0 : 1];
const writer = person({ robe: C.indigo, skin: SKIN[3], hat: C.white, scroll: true, s: 1.0 }); writer.position.set(33.2, 6.64, 10.6); writer.scale.set(1, 0.82, 1); writer.rotation.y = Math.PI * 0.62; scene.add(writer);
{ const b = new GB(); b.box(1.5, 0.22, 1.1, C.crimson, 33.2, 6.75, 10.6).box(0.9, 0.5, 0.6, C.wood, 34.0, 6.9, 11.0); scene.add(b.mesh()); }

// ───────────────────────── the caravan
const ENT = [];   // { g, o, lat, kind }
const king = camel({ color: 0xF2E7D0, cloth: C.crimson, trim: true }); {
  const rb = new GB(); const rider = person({ robe: 0xFAF4E6, sash: C.gold, skin: SKIN[1], crown: true });
  rider.position.set(-0.12, 2.26, 0); rider.scale.setScalar(1.02); king.add(rider);
  rb.cyl(0.045, 0.045, 2.9, 5, C.dark, -0.95, 3.7, 0).cone(1.45, 0.6, 8, C.crimson, -0.25, 5.35, 0).cyl(1.47, 1.47, 0.12, 8, C.gold, -0.25, 5.06, 0).ball(0.13, 0, C.gold, -0.25, 5.72, 0).box(0.75, 0.05, 0.05, C.dark, -0.6, 5.0, 0);
  king.add(rb.mesh());
  const kh = new THREE.Sprite(new THREE.SpriteMaterial({ map: radial('rgba(255,200,90,0.75)', 'rgba(255,180,60,0)'), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false, opacity: 0.5 })); kh.position.set(0, 2.8, 0); kh.scale.set(8, 8, 1); king.add(kh); king.userData.halo = kh;
}
scene.add(king); ENT.push({ g: king, o: 0, lat: 0, kind: 'king' });
for (const sg of [-1, 1]) {   // two heralds with banners walk ahead
  const b = new GB(); const h = person({ robe: C.crimson, skin: SKIN[0], hat: C.gold }); const g = new THREE.Group(); g.add(h);
  b.cyl(0.04, 0.04, 3.6, 5, C.dark, 0.3, 1.8, 0).box(1.15, 0.62, 0.04, sg > 0 ? C.gold : C.teal, -0.3, 3.25, 0); g.add(b.mesh()); scene.add(g); ENT.push({ g, o: -2.8, lat: sg * 1.15, kind: 'walk' });
}
const CLOTH = [C.indigo, C.teal, C.crimson, 0xE09A2B, 0x7A4FA0, C.green];
for (let i = 0; i < 11; i++) { const g = camel({ color: i % 3 ? C.camel : C.camel2, cloth: CLOTH[i % CLOTH.length] }); scene.add(g); ENT.push({ g, o: 4.4 + i * 3.75, lat: i % 2 ? 0.55 : -0.55, kind: 'camel', i }); }
for (let i = 0; i < 14; i++) { const g = person({ robe: ROBES[i % ROBES.length], skin: SKIN[i % 3], hat: i % 3 ? C.white : 0xE9C46A, s: 0.95 + R() * 0.1 }); scene.add(g); ENT.push({ g, o: 2.6 + i * 3.0, lat: (i % 2 ? 1 : -1) * (1.55 + R() * 0.3), kind: 'walk', ph: R() * 6 }); }
const CAMELS = ENT.filter(e => e.kind === 'camel');

function key(K, t) {   // piecewise position keys [t, x, ease]
  if (t <= K[0][0]) return K[0][1];
  for (let i = 0; i < K.length - 1; i++) if (t < K[i + 1][0]) { let u = (t - K[i][0]) / (K[i + 1][0] - K[i][0]); const e = K[i + 1][2]; if (e === 'out') u = 1 - (1 - u) * (1 - u); else if (e === 'in') u = u * u; return lerp(K[i][1], K[i + 1][1], u); }
  return K[K.length - 1][1];
}
const XA = [[T.wipe1 + 0.5, -121], [T.b4 - 0.1, -72.5], [T.b4 + 1.9, -68.7, 'out']];
const XB = [[T.wipe2 + 0.3, -11], [T.b5 - 0.05, -4.5], [T.official - 0.2, 35.5], [T.official + 0.5, 37, 'out']];
const XC = [[T.wipe3 + 0.3, -2.5], [T.b9 + 0.2, -10.5], [T.b9 + 0.9, -11.3, 'out'], [T.interest + 1.6, -11.3], [T.interest + 2.6, -12.8, 'in'], [DUR + 1, -12.8 - 3.0 * (DUR + 1 - T.interest - 2.6)]];
function trip(t) {
  if (t < T.wipe1 + 0.5) return { D: dAtX(22), rev: false };
  if (t < T.wipe2 + 0.3) return { D: dAtX(key(XA, t)), rev: false };
  if (t < T.wipe3 + 0.3) return { D: dAtX(key(XB, t)), rev: false };
  return { D: dAtX(key(XC, t)), rev: true };
}
function entPos(e, t, tr = trip(t)) {
  const d = tr.rev ? tr.D + e.o : tr.D - e.o; let [x, z, h] = onPath(d);
  x += e.lat * Math.sin(h); z += e.lat * Math.cos(h);
  return [x, groundY(x, z), z, tr.rev ? h + Math.PI : h, d];
}
const K = (dx = 0, dy = 0, dz = 0) => t => { const p = entPos(ENT[0], t); return [p[0] + dx, p[1] + dy, p[2] + dz]; };
const EN = (i, dx = 0, dy = 0, dz = 0) => t => { const p = entPos(CAMELS[i], t); return [p[0] + dx, p[1] + dy, p[2] + dz]; };
const kingAt = t => entPos(ENT[0], t);
function tAtKingX(x) { let lo = XB[0][0], hi = XB[XB.length - 1][0]; for (let i = 0; i < 30; i++) { const m = (lo + hi) / 2; if (key(XB, m) < x) lo = m; else hi = m; } return lo; }

// how full a camel's sacks are: 1 = full of gold … 0 = empty
function sackFill(i, t) {
  if (t < T.wipe1 + 0.5) return 1;
  let f = lerp(1, 0.74, sm(T.generous, T.b6, t));
  const tE = i < 0 ? T.ran + 0.05 : T.home + 0.25 + i * 0.1; f = lerp(f, 0, seg(t, tE, tE + 0.35));
  const tL = i < 0 ? loanT(1) + 0.75 : i === 0 ? loanT(0) + 0.75 : i === 1 ? loanT(2) + 0.75 : 1e9; if (t >= tL) f = lerp(0, 0.9, back(seg(t, tL, tL + 0.3)));
  return f;
}

// ───────────────────────── gold: flying coins, piles, sacks, bread
const FL = [];
const addF = (t0, d, a, b, h, sc = 1.25, rr = R) => FL.push({ t0, d, a, b, h, sc, sp: rr() * 6.28, w: 6 + rr() * 8 });
for (let i = 0; i < 175; i++) {   // flash-forward: the king throws gold over the night street
  const t0 = 0.1 + 6.95 * Math.pow(R(), 0.85), d = 0.95 + R() * 0.5, c = CIT[Math.floor(R() * CIT.length)], hit = R() < 0.5;
  addF(t0, d, [22 + (R() - .5), 3.6, (R() - .5) * 0.6], hit ? [c.x, 1.3, c.z] : [3 + R() * 37, 0.08, (R() - 0.5) * 8.4], 3 + R() * 3.6); if (hit) c.hops.push(t0 + d);
}
for (const c of CIT) { const tk = tAtKingX(c.x - 2.6); for (let j = 0; j < 2; j++) { const t0 = tk + j * 0.32 + R() * 0.1, d = 0.62 + R() * 0.2, k = kingAt(t0); addF(t0, d, [k[0], k[1] + 3.5, k[2]], [c.x, 1.3, c.z], 2.2 + R() * 1.4); c.hops.push(t0 + d); } }
const RAIN = [];
{ const R = rng(70412); for (let i = 0; i < 230; i++) { const t0 = T.rain0 + (T.rain1 - T.rain0 - 0.9) * R(), x = 4 + R() * 38, z = (R() - 0.5) * 22, d = 1.0 + R() * 0.5; addF(t0, d, [x, 26 + R() * 6, z], [x + (R() - .5), 0.15, z + (R() - .5)], 0, 2.1 + R() * 0.7, R); RAIN.push(+(t0 + d).toFixed(3)); } }   // own random stream: the rest of the world keeps its layout
const PILE = [];
for (const s of STALLS) {
  const t0 = T.markets + 0.05 + (s.x - 7) / 27.5 * 1.15, px = s.x + (s.bakery ? 1.75 : 0.2), pz = s.z - s.sd * 1.35;
  for (let j = 0; j < 5; j++) addF(t0 + j * 0.11, 0.6, [s.x - 1.5 + R() * 3, 2.9, (R() - .5) * 1.2], [px, 0.2, pz], 2 + R());
  PILE.push({ x: px, y: 0, z: pz, n: 16, t0: t0 + 0.6, r: 0.5 });
}
for (let i = 0; i < 16; i++) { const x = 3 + R() * 38; PILE.push({ x, y: 0, z: (R() < .5 ? -1 : 1) * (2.4 + R() * 1.3), n: 12 + Math.floor(R() * 14), t0: T.fills + 0.1 + x / 42 * 1.15 + R() * 0.2, r: 0.6 }); }
for (const b of town) if (!b.tall && b.m.geometry.boundingBox === null && R() < 0.42 && b.x < 44 && Math.abs(b.m.position.z) > 9) { b.m.geometry.computeBoundingBox(); const top = b.m.geometry.boundingBox.max.y - 0.5; PILE.push({ x: b.x + (R() - .5) * 1.5, y: top, z: b.m.position.z + (R() - .5) * 2, n: 14 + Math.floor(R() * 12), t0: T.fills + 0.15 + b.x / 60 * 1.2 + R() * 0.25, r: 0.7 }); }
for (let i = 0; i < 6; i++) PILE.push({ x: 40.8, y: 0, z: -5 + i * 2, n: 10, t0: T.fills + 0.9 + i * 0.05, r: 0.45 });
const HEAP = [];
for (const [x, y, z, w, d] of ROOFS) if (x < 70 && R() < 0.62) HEAP.push({ x: x + (R() - .5) * (w - 2.6), y, z: z + (R() - .5) * (d - 2.6), r: 0.75 + R() * 0.5 });
for (let i = 0; i < 12; i++) HEAP.push({ x: 2.5 + R() * 37, y: 0, z: (R() < .5 ? -1 : 1) * (2.9 + R() * 0.8), r: 0.55 + R() * 0.4 });
for (const h of HEAP) h.t0 = T.fills + 0.05 + c01(h.x / 70) * 1.25 + R() * 0.25;
const heapMesh = new THREE.InstancedMesh(new THREE.ConeGeometry(1, 1, 6).translate(0, 0.5, 0), GOLD, HEAP.length); heapMesh.frustumCulled = false; scene.add(heapMesh);
let NPC = 0; for (const p of PILE) { p.i0 = NPC; p.c = []; for (let k = 0; k < p.n; k++) { const ly = Math.floor(Math.sqrt(k * 0.9)), rr = p.r * (1 - ly * 0.16) * Math.sqrt(R()), a = R() * 6.28; p.c.push([Math.cos(a) * rr, 0.04 + ly * 0.075, Math.sin(a) * rr, (R() - .5) * 0.5, (R() - .5) * 0.5]); } NPC += p.n; }
const pileMesh = new THREE.InstancedMesh(COIN, GOLD, NPC); pileMesh.frustumCulled = false; scene.add(pileMesh);
const flyMesh = new THREE.InstancedMesh(COIN, GOLD, 420); flyMesh.frustumCulled = false; scene.add(flyMesh);
const _m4 = new THREE.Matrix4(), _q = new THREE.Quaternion(), _e = new THREE.Euler(), _p = new THREE.Vector3(), _s = new THREE.Vector3();
// gift sacks for the officials + loan sacks from the merchants
const gifts = OFF.map(o => { const m = new THREE.Mesh(SACKG, SACK); m.castShadow = true; scene.add(m); return m; });
const loans = MER.map(() => { const m = new THREE.Mesh(SACKG, SACK); m.castShadow = true; scene.add(m); return m; });
// the bakery: one coin, five loaves … then four
const BK = STALLS.find(s => s.bakery);
const loafMat = new THREE.MeshLambertMaterial({ color: 0xDFA552 });
{ const b = new GB(); b.box(2.74, 0.07, 1.14, 0xF4EAD6, BK.x, 1.085, BK.z).box(2.74, 0.5, 0.05, 0xF4EAD6, BK.x, 0.84, BK.z + 0.58); scene.add(b.mesh()); }
const bkLight = new THREE.PointLight(0xFFE2B0, 0, 14, 1.2); bkLight.position.set(BK.x + 0.4, 2.0, BK.z + 3.4); scene.add(bkLight);
const loaves = [0, 1, 2, 3, 4].map(i => { const m = new THREE.Mesh(LOAF, loafMat); m.position.set(BK.x - 1.04 + i * 0.52, 1.3, BK.z + 0.1); m.castShadow = true; scene.add(m); return m; });
const bigCoin = new THREE.Mesh(COIN, GOLD); bigCoin.rotation.order = 'YXZ'; scene.add(bigCoin);
const puff = new THREE.Sprite(new THREE.SpriteMaterial({ map: radial('rgba(255,255,255,0.9)', 'rgba(255,255,255,0)'), transparent: true, depthWrite: false, opacity: 0 })); scene.add(puff);
// sparkles on gold
const sparkT = (() => { const cv = document.createElement('canvas'); cv.width = cv.height = 64; const g = cv.getContext('2d'); g.translate(32, 32); g.fillStyle = '#fff'; for (let k = 0; k < 2; k++) { g.rotate(Math.PI / 2 * k); g.beginPath(); g.moveTo(0, -30); g.quadraticCurveTo(3, -3, 30, 0); g.quadraticCurveTo(3, 3, 0, 30); g.quadraticCurveTo(-3, 3, -30, 0); g.quadraticCurveTo(-3, -3, 0, -30); g.fill(); } const tx = new THREE.CanvasTexture(cv); tx.colorSpace = THREE.SRGBColorSpace; return tx; })();
const sparks = []; for (let i = 0; i < 46; i++) { const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: sparkT, color: 0xFFE9A8, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false })); sp.userData = { ph: R() * 6.28, w: 3 + R() * 4, k: i }; scene.add(sp); sparks.push(sp); }
// dust at the caravan's feet
const dustG = new THREE.BufferGeometry(); dustG.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(160 * 3), 3));
const dust = new THREE.Points(dustG, new THREE.PointsMaterial({ color: 0xF6E2B4, size: 0.5, transparent: true, opacity: 0.42, depthWrite: false, map: radial('rgba(255,255,255,1)', 'rgba(255,255,255,0)') })); dust.frustumCulled = false; scene.add(dust);
const DU = []; for (let i = 0; i < 160; i++) DU.push([R(), R(), R(), R()]);

// birds (two flocks) and a shooting star
const birdMat = new THREE.MeshBasicMaterial({ color: 0x2A2430, side: THREE.DoubleSide });
const wingG = new THREE.BufferGeometry(); wingG.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0.1, 1.6, 0, -0.3, 1.5, 0, 0.5], 3));
const FLOCK = [{ t0: T.b3 + 0.3, t1: T.b4 + 0.5, a: [-170, 23, -26], b: [-52, 27, 6] }, { t0: T.b7 + 0.2, t1: T.wipe3 + 0.3, a: [64, 17, -8], b: [14, 21, 26] }, { t0: T.b5 + 0.2, t1: T.b5 + 4.4, a: [44, 17, -10], b: [-4, 14, 8] }];
const birds = []; for (let i = 0; i < 9; i++) { const g = new THREE.Group(), l = new THREE.Mesh(wingG, birdMat), r = new THREE.Mesh(wingG, birdMat); r.scale.x = -1; g.add(l, r); g.userData = { l, r, ph: R() * 6 }; g.visible = false; g.scale.setScalar(0.85); scene.add(g); birds.push(g); }
function updateBirds(t) {
  const f = FLOCK.find(f => t >= f.t0 && t <= f.t1); for (const b of birds) b.visible = !!f; if (!f) return;
  const u = seg(t, f.t0, f.t1), dx = f.b[0] - f.a[0], dz = f.b[2] - f.a[2], L = Math.hypot(dx, dz), ux = dx / L, uz = dz / L;
  birds.forEach((b, i) => { const row = Math.ceil(i / 2), sd = i % 2 ? 1 : -1; b.position.set(lerp(f.a[0], f.b[0], u) - ux * row * 2.4 + uz * sd * row * 1.7, lerp(f.a[1], f.b[1], u) + Math.sin(t * 2 + b.userData.ph) * 0.5, lerp(f.a[2], f.b[2], u) - uz * row * 2.4 - ux * sd * row * 1.7); b.rotation.y = Math.atan2(ux, uz); const fl = Math.sin(t * 10 + b.userData.ph) * 0.65; b.userData.l.rotation.z = fl; b.userData.r.rotation.z = -fl; });
}

// ───────────────────────── camera path (spherical keys around a target; `up` tilts the view so the subject sits lower in the frame)
const CTA_U = (T.cta - (T.b10 + 2.3)) / (73.72 - (T.b10 + 2.3));   // 73.72 = end of the first cut; keeps every frame before the call to action unchanged
const CAM = [
  { t: 0, tg: [24, 3, 0], d: 108, az: -90, el: 18, up: 0.17 },
  { t: 3.3, tg: [23, 2.6, 0], d: 60, az: -80, el: 27, up: 0.1, mv: 1 },
  { t: T.wipe1, tg: [22, 2.2, 0], d: 31, az: -60, el: 16 },
  { t: T.wipe1 + 0.5, tg: [-45, 80, 0], d: 40, az: -10, el: -40, up: 0, mv: 1 },
  { t: T.wipe1 + 1.35, tg: K(0, 2.6, 0), d: 15, az: 60, el: 8, mv: 1 },
  { t: T.rich - 0.2, tg: K(0, 2.6, 0), d: 17, az: 30, el: 10 },
  { t: T.b3, tg: K(-8, 2.0, 0), d: 38, az: 76, el: 20, up: 0.06, mv: 1 },
  { t: T.gold3 - 0.3, tg: K(-13, 1.0, 0), d: 60, az: 84, el: 27, up: 0.055 },
  { t: T.gold3 + 0.5, tg: EN(3, 0, 2.1, 0), d: 12, az: 26, el: 11, mv: 1 },
  { t: T.b4, tg: EN(3, 0, 2.1, 0), d: 10.5, az: 14, el: 11 },
  { t: T.b4 + 1.1, tg: [-86, 3.5, -24], d: 84, az: 12, el: 12, up: 0.05, mv: 1 },
  { t: T.wipe2, tg: [-87, 3.5, -24], d: 74, az: 3, el: 11, up: 0.05 },
  { t: T.wipe2 + 0.3, tg: [-50, 80, 0], d: 40, az: -60, el: -40, up: 0, mv: 1 },
  { t: T.wipe2 + 0.8, tg: [-0.5, 3.0, 0], d: 25, az: 82, el: 13, mv: 1 },
  { t: T.b5 + 0.7, tg: K(2, 2.8, 0), d: 20, az: 84, el: 12 },                       // in the street, in front of the king
  { t: T.freely, tg: K(2, 1.5, 0), d: 25, az: 100, el: 36, up: 0.03, mv: 1 },        // crane up: gifts flying to the crowd
  { t: T.markets, tg: K(1, 1.2, 0), d: 22, az: 0, el: 48, up: 0.02, mv: 1 },         // high over the south roofs: the market stalls
  { t: T.official - 0.1, tg: K(-2, 2.3, 0), d: 23, az: -106, el: 21, mv: 1 },
  { t: T.official + 0.7, tg: [39.8, 2.7, 0.3], d: 21, az: -68, el: 15, mv: 1 },
  { t: T.b6 - 0.1, tg: [40.4, 2.6, 0.3], d: 18, az: -71, el: 13 },
  { t: T.fills + 1.0, tg: [22, 2, 0], d: 84, az: -72, el: 40, up: 0.03, mv: 1 },
  { t: T.piece, tg: [22, 2, 0], d: 78, az: -66, el: 42, up: 0.03 },
  { t: T.piece + 0.4, tg: [BK.x, 2, -2], d: 22, az: 4, el: 36, up: 0.02, mv: 2 },                  // come down along the street, not through the houses
  { t: T.piece + 0.8, tg: [BK.x, 1.55, BK.z + 0.3], d: 8.6, az: 10, el: 14, up: 0.0, mv: 3 },
  { t: T.b7 - 0.1, tg: [BK.x, 1.55, BK.z + 0.3], d: 7.6, az: 2, el: 13, up: 0.0 },
  { t: T.b7 + 0.36, tg: [30, 4, 4], d: 14, az: -10, el: 42, up: 0.03, mv: 2 },                // lift over the roofs…
  { t: T.b7 + 0.9, tg: [33.2, 7.5, 10.8], d: 12.5, az: -34, el: 11, mv: 3 },                    // …and settle on the writer's roof
  { t: T.tenth, tg: [33.2, 7.5, 10.8], d: 12.5, az: -8, el: 10 },
  { t: T.wipe3, tg: [32, 7.6, 9], d: 25, az: 16, el: 15 },
  { t: T.wipe3 + 0.3, tg: [10, 80, 0], d: 40, az: 0, el: -40, up: 0, mv: 1 },
  { t: T.wipe3 + 0.78, tg: [-7, 3, 0], d: 27, az: -22, el: 12, mv: 1 },
  { t: T.ran + 0.5, tg: K(1.6, 2.5, 0), d: 15.5, az: 6, el: 11 },
  { t: T.b9 + 0.8, tg: [-7.6, 1.5, 3.2], d: 31, az: -7, el: 14, up: 0.03, mv: 1 },
  { t: T.interest + 1.2, tg: [-7.6, 1.5, 3.2], d: 29, az: 2, el: 13, up: 0.03 },
  { t: T.never, tg: [-7.2, 1.5, 3.4], d: 30, az: 7, el: 12, up: 0.03, mv: 1 },
  { t: T.b10 - 0.1, tg: [-7.0, 1.5, 3.4], d: 27, az: 9, el: 11, up: 0.03 },
  { t: T.b10 + 0.55, tg: [-6, 1.5, 3], d: 36, az: 16, el: 24, up: 0.05, mv: 2 },               // rise clear of the wall first
  { t: T.b10 + 2.3, tg: [4, 0, -6], d: 150, az: 57, el: 25, up: 0.2, mv: 3 },
  { t: T.cta, tg: [lerp(4, 2, CTA_U), 0, lerp(-6, -8, CTA_U)], d: lerp(150, 172, CTA_U), az: lerp(57, 50, CTA_U), el: lerp(25, 26, CTA_U), up: 0.2 },   // exactly where the old path was at this moment
  { t: T.rain0 + 0.4, tg: [21, 2, 0], d: 68, az: 80, el: 39, up: 0.06, mv: 1 },
  { t: DUR + 0.5, tg: [22, 2, 0], d: 61, az: 86, el: 37, up: 0.06 },
];
const tgOf = (k, t) => typeof k.tg === 'function' ? k.tg(t) : k.tg;
const camTg = new THREE.Vector3(); let camD = 30;
function setCamera(t) {
  let i = 0; while (i < CAM.length - 2 && t >= CAM[i + 1].t) i++;
  const a = CAM[i], b = CAM[i + 1]; let u = seg(t, a.t, b.t); if (b.mv === 1) u = eio(u); else if (b.mv === 2) u = u * u; else if (b.mv === 3) u = 1 - (1 - u) * (1 - u);
  const ta = tgOf(a, t), tb = tgOf(b, t), tg = [lerp(ta[0], tb[0], u), lerp(ta[1], tb[1], u), lerp(ta[2], tb[2], u)];
  const d = lerp(a.d, b.d, u), az = lerp(a.az, b.az, u) * Math.PI / 180, el = lerp(a.el, b.el, u) * Math.PI / 180, up = lerp(a.up ?? 0.07, b.up ?? 0.07, u);
  const wob = [Math.sin(t * 0.9) * 0.012 * d, Math.sin(t * 1.3 + 1) * 0.008 * d];
  camera.position.set(tg[0] + d * Math.cos(el) * Math.sin(az) + wob[0] * Math.cos(az), Math.max(tg[1] + d * Math.sin(el) + wob[1], groundY(tg[0] + d * Math.cos(el) * Math.sin(az), tg[2] + d * Math.cos(el) * Math.cos(az)) + 1.2), tg[2] + d * Math.cos(el) * Math.cos(az) - wob[0] * Math.sin(az));
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
  for (const w of TIM.words) { if (w.si !== si) { flush(); si = w.si; } clause.push(w); if (/[.,?!]$/.test(w.t)) flush(); }
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
const yearEl = mk('year', '2026'), subEl = mk('sub', 'Cairo · a true money story');
const chip = mk('chip', ''), chip2 = mk('chip am', '');
const nameEl = mk('name', '<div class="n">Mansa Musa</div><div class="r">King of Mali</div>');
const route = mk('route', '<div class="line"></div><div class="fill"></div><div class="nd" style="left:40px"></div><div class="nd" style="left:500px"></div><div class="nd" style="left:720px"></div><div class="dot"></div><div class="lb" style="left:40px">MALI</div><div class="lb" style="left:500px">CAIRO</div><div class="lb" style="left:720px">MECCA</div>');
const routeFill = route.querySelector('.fill'), routeDot = route.querySelector('.dot');
const goldTag = mk('tag am', 'gold');
const days = mk('pips', 'Day <i></i><i></i><i></i>'), months = mk('pips', '<i></i><i></i><i></i> &nbsp;3 months in Cairo');
const loafTag = mk('tag', 'buys <b>5</b> loaves'); const loafB = loafTag.querySelector('b');
const writerTag = mk('tag', 'al-Umari · wrote it down c. 1337');
const board = mk('board', '<div class="t">The price of gold in Cairo</div><div class="row">1 mithqal =<b>25</b>silver dirhams</div><div class="d">▼ more than 10% lower</div><div class="y pips small"><span></span></div><div class="src">as reported by al-Umari, c. 1337</div>');
const boardB = board.querySelector('b'), boardD = board.querySelector('.d'), boardY = board.querySelector('.y');
boardY.innerHTML = '12 years later &nbsp;' + '<i></i>'.repeat(12) + ' &nbsp;still low';
const emptyTag = mk('tag grey', 'gold: <b style="color:#fff">0</b>');
const meter = mk('meter', '<span>gold left</span><div class="bar"><div class="fill"></div></div>'); const meterFill = meter.querySelector('.fill');
const iou = MER.map(() => mk('tag am', 'loan'));
const intTag = mk('chip', 'borrowed · at <b>high</b> interest');
const title = mk('title', '<div class="s">THE STORY OF</div><div class="n">The King With\n<em>Too Much Gold</em></div>');
const lesson = mk('lesson', 'Too much of anything, <em>even gold</em>,\nand each piece is worth less.');
const legend = mk('chip', 'an old Cairo legend');
const cbox = mk('cbox', '<span class="in"></span><span class="post">Post</span>'); const cIn = cbox.querySelector('.in'), cPost = cbox.querySelector('.post');
const quip = mk('tag am', 'just not too rich');
const shoot = mk('shoot', '');
const foot = document.getElementById('foot');
foot.textContent = 'Told from 14th-century accounts (al-Umari, Ibn Khaldun) · gold: 25 → 22 dirhams per mithqal\nHistorians debate how big and how long the price drop was. Not financial advice.';
const setTxt = (e, s) => { if (e.textContent !== s) e.textContent = s; };
const setHTML = (e, s) => { if (e._h !== s) { e._h = s; e.innerHTML = s; } };

function updateUI(t) {
  updateCaption(t);
  foot.style.opacity = (0.95 * seg(t, 0.8, 1.4) * (1 - seg(t, T.cta, T.cta + 0.3) * 0.45)).toFixed(3);
  { let on = 0; for (const [t0, x0, y0] of [[2.0, 760, 150], [T.b10 + 3.6, 300, 120]]) { const u = (t - t0) / 0.55; if (u > 0 && u < 1) { put(shoot, x0 + u * 330, y0 + u * 120, Math.sin(u * Math.PI), 1); on = 1; } } if (!on) put(shoot, 0, 0, 0); }
  // 1 — the year rolls back
  { const u = eo(seg(t, 0.05, 1.25)); setTxt(yearEl, String(Math.round(lerp(2026, 1324, u)))); const o = win(t, -1, T.wipe1 - 0.25, 0.5, 0.3); put(yearEl, W / 2, 565, o, 1 + 0.06 * (1 - u)); put(subEl, W / 2, 705, o * seg(t, 0.9, 1.3)); }
  // 2 — the king
  { const k = kingAt(t), p = proj(k[0], k[1] + 6.6, k[2]); put(nameEl, c01((p[0] - 250) / 580) * 580 + 250, Math.max(585, p[1]), win(t, T.name, T.b3 - 0.25, 0.3, 0.3), pop(t, T.name)); }
  put(chip2, W / 2, 472, 0);
  // chips (one line at the top that says where we are)
  let ct = '', co = 0, cp = 0;
  const CH = [[T.rich, T.b3 - 0.15, '“the richest man in history”'], [T.b4 + 0.25, T.wipe2 - 0.05, 'July 1324 · by the pyramids'], [T.wipe2 + 0.55, T.months - 0.25, '19 July 1324 · Cairo'], [T.freely + 0.35, T.markets + 0.55, 'gifts of gold'], [T.markets + 0.7, T.official - 0.05, 'gold in every market'], [T.official + 0.1, T.b6 - 0.15, 'a load of gold for every official'], [T.fills, T.piece + 0.3, 'a city full of gold'], [S(8) + 0.05, T.b9 - 0.1, 'the way home'], [T.never + 0.25, T.b10 - 0.2, 'never fully repaid?']];
  for (const [a, b, s] of CH) { const o = win(t, a, b, 0.22, 0.22); if (o > co) { co = o; ct = s; cp = pop(t, a); } }
  if (ct) setTxt(chip, ct); put(chip, W / 2, 472, co, cp);
  // 3 — the route
  { const o = win(t, T.b3 + 0.9, T.b4 - 0.2, 0.3, 0.25), u = lerp(0.12, 0.8, seg(t, T.b3 + 0.9, T.b4)); routeFill.style.width = (460 * u).toFixed(1) + 'px'; routeDot.style.left = (40 + 460 * u).toFixed(1) + 'px'; put(route, W / 2, 500, o, 1); }
  { const p = entPos(CAMELS[3], t), q = proj(p[0], p[1] + 3.9, p[2]); put(goldTag, q[0], q[1], win(t, T.gold3 + 0.45, T.b4 + 0.2, 0.2, 0.2), pop(t, T.gold3 + 0.45)); }
  // 4 — three days; 5 — three months
  { const n = t < T.days + 0.05 ? 0 : t < T.days + 0.55 ? 1 : t < T.days + 1.05 ? 2 : 3; [...days.children].forEach((e, i) => { const c = i < n ? 'on' : ''; if (e.className !== c) e.className = c; }); put(days, W / 2, 552, win(t, T.days - 0.25, T.wipe2 - 0.05, 0.2, 0.2), 1); }
  { const n = Math.floor(c01((t - T.months) / 1.2) * 3.001); [...months.querySelectorAll('i')].forEach((e, i) => { const c = i < n ? 'on' : ''; if (e.className !== c) e.className = c; }); put(months, W / 2, 472, win(t, T.months - 0.2, T.freely + 0.2, 0.2, 0.2), pop(t, T.months - 0.2)); }
  // 6 — what one coin buys
  { const p = proj(BK.x + 0.42, 2.0, BK.z + 0.75); setTxt(loafB, t < T.less ? '5' : '4'); put(loafTag, p[0], p[1], win(t, T.piece + 0.85, T.b7 - 0.05, 0.2, 0.2), pop(t, T.piece + 0.85) * (1 + 0.1 * win(t, T.less, T.less + 0.25, 0.08, 0.2))); }
  // 7 — the price board
  { const o = win(t, T.price - 0.15, T.wipe3 - 0.1, 0.3, 0.25); const v = Math.round(lerp(25, 22, eo(seg(t, T.tenth - 0.9, T.tenth + 0.1)))); setTxt(boardB, String(v));
    boardD.style.opacity = seg(t, T.tenth, T.tenth + 0.25).toFixed(2); boardD.style.transform = `scale(${pop(t, T.tenth).toFixed(3)})`;
    boardY.style.opacity = seg(t, T.twelve - 0.1, T.twelve + 0.2).toFixed(2); const n = Math.floor(c01((t - T.twelve) / 1.7) * 12.001); [...boardY.querySelectorAll('i')].forEach((e, i) => { const c = i < n ? 'on' : ''; if (e.className !== c) e.className = c; });
    put(board, W / 2, 650, o, pop(t, T.price - 0.15));
    const p = proj(33.2, 8.9, 10.6); put(writerTag, c01((p[0] - 270) / 540) * 540 + 270, Math.max(900, p[1]), win(t, T.b7 + 0.9, T.wipe3 - 0.1, 0.25, 0.25), pop(t, T.b7 + 0.9)); }
  { const u = 1 - seg(t, T.home - 0.2, T.ran + 0.25); meterFill.style.width = (300 * u * 0.42).toFixed(1) + 'px'; meterFill.style.background = u < 0.02 ? '#888' : '#F7A600'; put(meter, W / 2, 552, win(t, S(8) + 0.3, T.b9 + 0.4, 0.25, 0.25), 1); }
  // 8 — empty; 9 — loans
  { const k = kingAt(t), p = proj(k[0] + 1.5, k[1] + 3.9, k[2]); put(emptyTag, p[0], p[1], win(t, T.ran + 0.3, T.b9 + 0.5, 0.2, 0.25), pop(t, T.ran + 0.3), '0%', '-50%'); }
  MER.forEach((m, j) => { const tl = loanT(j), p = proj(m.m.position.x, m.m.position.y + 2.55, m.m.position.z); const late = t > T.never + 0.2; setTxt(iou[j], late ? 'unpaid?' : 'loan'); const cl = 'abs tag ' + (late ? 'grey' : 'am'); if (iou[j].className !== cl) iou[j].className = cl; put(iou[j], p[0], p[1], p[2] ? win(t, tl, T.b10 - 0.2, 0.2, 0.25) : 0, pop(t, tl) * (late ? pop(t, T.never + 0.2) : 1)); });
  put(intTag, W / 2, 472, win(t, T.interest, T.never + 0.1, 0.22, 0.22), pop(t, T.interest));
  // 10 — title and lesson; 11 — like
  put(title, W / 2, 610, win(t, T.story, T.cta - 0.1, 0.4, 0.3), 0.94 + 0.06 * eo(seg(t, T.story, T.story + 0.6)));
  put(lesson, W / 2, 1150, win(t, T.even, T.cta - 0.15, 0.3, 0.25), pop(t, T.even));
  put(legend, W / 2, 472, seg(t, T.cta + 0.1, T.cta + 0.4), pop(t, T.cta + 0.1));
  { const n = Math.min(4, Math.floor(c01((t - T.gold) / 0.48) * 4.001)), typed = 'GOLD'.slice(0, n), caret = (n < 4 || Math.floor(t * 2.4) % 2) && t < T.rain0 ? '<i></i>' : '';
    setHTML(cIn, typed ? `<b>${typed}</b>${caret}` : `<em>Add a comment…</em>${caret}`); const sent = t > T.rain0 - 0.25; const pc = sent ? 'post on sent' : n === 4 ? 'post on' : 'post'; if (cPost.className !== pc) cPost.className = pc; setTxt(cPost, sent ? 'Posted ✓' : 'Post');
    put(cbox, W / 2, 1210, seg(t, T.ctaC, T.ctaC + 0.3), pop(t, T.ctaC) * (1 + 0.06 * win(t, T.rain0 - 0.25, T.rain0 + 0.05, 0.08, 0.2))); }
  put(quip, W / 2, 1330, seg(t, T.notToo, T.notToo + 0.2), pop(t, T.notToo));
}

// ───────────────────────── one frame
const hopY = (hops, t) => { let y = 0; for (const h of hops) { const u = (t - h) / 0.38; if (u > 0 && u < 1) y = Math.max(y, Math.sin(u * Math.PI) * 0.55); } return y; };
function renderAt(t) {
  const s = skyAt(t), night = s.glow;
  paintSky(s); scene.fog.color.setRGB(s.fog[0], s.fog[1], s.fog[2]);
  hemi.color.setRGB(...s.hemS); hemi.groundColor.setRGB(...s.hemG); hemi.intensity = s.hemI;
  sun.color.setRGB(...s.sunC); sun.intensity = s.sunI;
  const az = (s.az + 720 * eio(seg(t, T.twelve, T.twelve + 1.9))) * Math.PI / 180, el = s.el * Math.PI / 180, sd = [Math.cos(el) * Math.sin(az), Math.sin(el), Math.cos(el) * Math.cos(az)];
  starM.opacity = s.star * 0.9; starM2.opacity = s.star * (0.65 + 0.35 * Math.sin(t * 3.1)); stars.visible = stars2.visible = s.star > 0.01;
  glowMat.opacity = c01(night * 1.1); cityGlow.material.opacity = night * 0.85; GOLD.emissiveIntensity = 0.5 + night * 0.9; SACK.emissiveIntensity = 0.4 + night * 0.6;

  // caravan
  const tr = trip(t), tr2 = trip(t + 0.04), v = Math.abs(tr2.D - tr.D) / 0.04, amp = 0.5 * c01(v / 1.6);
  for (const e of ENT) {
    const p = entPos(e, t, tr), ph = p[4] * 1.75;
    if (e.kind === 'walk') { e.g.position.set(p[0], p[1] + Math.abs(Math.sin(ph * 1.6 + (e.ph ?? 0))) * 0.09 * (amp * 2), p[2]); e.g.rotation.y = p[3]; continue; }
    e.g.position.set(p[0], p[1] + Math.sin(ph * 2) * 0.05 * amp * 2, p[2]); e.g.rotation.y = p[3];
    for (const l of e.g.userData.legs) l.rotation.z = Math.sin(ph + l.userData.ph) * amp;
    const f = sackFill(e.kind === 'king' ? -1 : e.i, t);
    for (const sk of e.g.userData.sacks) { const k = 0.3 + 0.7 * f; sk.scale.set(k, 0.9 * (0.25 + 0.75 * f), 0.82 * k); sk.material = f < 0.12 ? SACK_EMPTY : SACK; sk.position.y = 1.86 - (1 - f) * 0.22; }
  }
  king.userData.halo.material.opacity = 0.28 + 0.3 * night + 0.06 * Math.sin(t * 4);
  // townsfolk
  for (const c of CIT) c.m.position.y = hopY(c.hops, t) + (t < T.wipe1 ? Math.abs(Math.sin(t * 5 + c.ph)) * 0.05 : 0);
  OFF.forEach((o, i) => { const land = o.t + 0.75; o.m.position.y = o.y + (t > land ? Math.sin(c01((t - land) / 0.4) * Math.PI) * 0.45 : 0); const u = (t - o.t) / 0.75, g = gifts[i], k = kingAt(o.t);
    if (u <= 0) { g.visible = false; return; } g.visible = true; const uu = c01(u), a = [k[0], k[1] + 3.3, k[2]], b = [o.x - 1.05, 0.8, o.z];
    g.position.set(lerp(a[0], b[0], uu), lerp(a[1], b[1], uu) + 3.4 * 4 * uu * (1 - uu) + (u > 1 ? Math.abs(Math.sin((u - 1) * 7)) * 0.25 * Math.exp(-(u - 1) * 4) : 0), lerp(a[2], b[2], uu)); g.scale.set(1, 0.85, 0.9); });
  MER.forEach((m, j) => { const w = eio(seg(t, T.b9 - 0.55 + j * 0.12, T.b9 + 0.95 + j * 0.12)), w1 = c01(w * 2), w2 = c01(w * 2 - 1), mx = lerp(lerp(2.4, -2.2, w1), m.x, w2), mz = lerp(lerp(2.3, 2.5, w1), m.z, w2);
    m.m.position.set(mx, Math.max(0, terrainY(mx, mz)) + Math.abs(Math.sin(w * 18)) * 0.07 * (w < 1 ? 1 : 0), mz); m.m.visible = t > T.wipe3 + 0.3;
    const t0 = loanT(j), u = (t - t0) / 0.75, g = loans[j]; if (u <= 0 || u >= 1) { g.visible = false; return; } g.visible = true; const b = entPos(loanTo(j), t0 + 0.75), a = [m.x, 1.5, m.z];
    g.position.set(lerp(a[0], b[0], u), lerp(a[1], b[1] + 2, u) + 2.6 * 4 * u * (1 - u), lerp(a[2], b[2], u)); });
  writer.rotation.z = Math.sin(t * 2.2) * 0.04; writer.visible = true;
  // gate, town pop-up, palms, boats, clouds, water
  { const open = t < T.wipe1 + 0.5 ? 1 : eio(seg(t, T.wipe2 + 0.45, T.wipe2 + 1.1)); for (const d of doors) d.rotation.y = d.userData.sg * open * 1.75; }
  for (const b of town) { let k = 1; if (!b.tall && t > T.wipe1 + 0.5) { const t0 = T.b5 - 0.55 + b.x / 44 * 5.4 + Math.abs(b.m.position.z) * 0.012; k = t < t0 ? 0.001 : back(seg(t, t0, t0 + 0.42)); } b.m.scale.set(1, k, 1); b.m.visible = k > 0.002; }
  for (const p of palms) p.rotation.z = Math.sin(t * 1.25 + p.userData.ph) * 0.045;
  tents.forEach((m, i) => { const t0 = T.b4 + 0.75 + i * 0.16, k = t < T.wipe1 + 0.5 ? 0.001 : t < t0 ? 0.001 : back(seg(t, t0, t0 + 0.4)); m.scale.setScalar(k); m.visible = k > 0.002; });
  { const fk = win(t, T.b4 + 1.3, T.wipe2 + 0.3, 0.4, 0.2); fire.visible = fk > 0.01; fire.scale.setScalar(fk * (0.8 + 0.25 * Math.sin(t * 17) + 0.15 * Math.sin(t * 29))); fire.rotation.y = t * 3; fireGlow.material.opacity = fk * night * (0.75 + 0.15 * Math.sin(t * 13)); }
  for (const b of boats) { b.position.z = b.userData.z + b.userData.dir * t * 0.75; b.position.y = -0.62 + Math.sin(t * 1.4 + b.userData.ph) * 0.06; b.rotation.x = Math.sin(t * 1.1 + b.userData.ph) * 0.04; }
  for (const c of clouds) { c.position.x = c.userData.x0 + t * 1.1; c.material.opacity = 0.9 - 0.62 * night; c.material.color.setRGB(lerp(s.hor[0], 1, 0.55) * (0.45 + 0.55 * (1 - night * 0.75)), lerp(s.hor[1], 1, 0.55) * (0.45 + 0.55 * (1 - night * 0.75)), lerp(s.hor[2], 1, 0.55) * (0.5 + 0.5 * (1 - night * 0.6))); }
  for (const g of glints) { g.position.set(g.userData.x, -0.69, ((g.userData.z + t * g.userData.v * 2 + 75) % 150) - 75); g.scale.x = 0.5 + 0.5 * Math.abs(Math.sin(t * 1.7 + g.userData.z)); }
  // flying coins
  let n = 0;
  for (const f of FL) { const u = (t - f.t0) / f.d; if (u <= 0 || u >= 1 || n >= 420) continue; _p.set(lerp(f.a[0], f.b[0], u), lerp(f.a[1], f.b[1], u) + f.h * 4 * u * (1 - u), lerp(f.a[2], f.b[2], u)); _e.set(f.sp + t * f.w, f.sp * 2, t * f.w * 0.7); _q.setFromEuler(_e); _s.setScalar(f.sc); flyMesh.setMatrixAt(n++, _m4.compose(_p, _q, _s)); }
  flyMesh.count = n; flyMesh.instanceMatrix.needsUpdate = true;
  // piles
  const flash = t < T.wipe1 + 0.5;
  for (const p of PILE) for (let k = 0; k < p.n; k++) { const tk = p.t0 + k * 0.035, sc = flash ? 1 : (t < tk ? 0 : back(seg(t, tk, tk + 0.22))); const c = p.c[k]; _p.set(p.x + c[0], p.y + c[1], p.z + c[2]); _e.set(c[3], 0, c[4]); _q.setFromEuler(_e); _s.setScalar(Math.max(sc, 0.0001) * 1.15); pileMesh.setMatrixAt(p.i0 + k, _m4.compose(_p, _q, _s)); }
  pileMesh.instanceMatrix.needsUpdate = true;
  HEAP.forEach((h, i) => { const sc = flash ? 1 : (t < h.t0 ? 0 : back(seg(t, h.t0, h.t0 + 0.3))); _p.set(h.x, h.y, h.z); _q.identity(); _s.set(h.r * Math.max(sc, 0.0001), h.r * 0.72 * Math.max(sc, 0.0001), h.r * Math.max(sc, 0.0001)); heapMesh.setMatrixAt(i, _m4.compose(_p, _q, _s)); });
  heapMesh.instanceMatrix.needsUpdate = true;
  // bakery
  bkLight.intensity = 13 * win(t, T.piece + 0.2, T.b7 + 0.3, 0.5, 0.4);
  { const gone = seg(t, T.less, T.less + 0.3); loaves.forEach((m, i) => { const hop = Math.sin(c01((t - (T.piece + 1.0 + i * 0.07)) / 0.3) * Math.PI) * 0.16; m.scale.set(1.22, 0.82, 1.2); m.position.y = 1.28 + hop; if (i === 4) { m.scale.multiplyScalar(1 - gone); m.position.y += gone * 0.7; m.visible = gone < 0.98; } });
    const drop = seg(t, T.piece + 0.55, T.piece + 0.95); bigCoin.visible = t > T.piece + 0.5 || flash; bigCoin.position.set(BK.x - 0.72, 2.0 + (1 - eo(drop)) * 1.2 + 0.04 * Math.sin(t * 3), BK.z + 0.75); bigCoin.rotation.set(Math.PI / 2, 0.5 * Math.sin(t * 2.2), 0); bigCoin.scale.setScalar(1.7);
    const pu = seg(t, T.less, T.less + 0.45); puff.position.set(BK.x + 1.04, 1.5, BK.z + 0.2); puff.scale.setScalar(0.4 + pu * 1.6); puff.material.opacity = pu > 0 && pu < 1 ? (1 - pu) * 0.9 : 0; }
  // sparkles + dust
  { let k = 0; const put3 = (x, y, z, sz, on) => { const sp = sparks[k++]; if (!sp) return; const tw = Math.pow(Math.abs(Math.sin(t * sp.userData.w + sp.userData.ph)), 3); sp.position.set(x, y, z); sp.scale.setScalar(sz * (0.25 + tw)); sp.material.opacity = on * (0.25 + 0.75 * tw); sp.visible = on > 0.01; };
    for (let i = 0; i < CAMELS.length; i++) { const p = CAMELS[i].g.position, f = sackFill(i, t); put3(p.x, p.y + 2.5 + (i % 2) * 0.3, p.z + (i % 2 ? 0.7 : -0.7), 0.9, f > 0.4 ? 1 : 0); }
    { const p = king.position; put3(p.x, p.y + 4.35, p.z, 1.0, 1); }
    for (let i = 0; i < PILE.length && k < sparks.length; i += 1) { const p = PILE[i]; put3(p.x, p.y + 0.6, p.z, 0.8, flash || t > p.t0 + 0.4 ? 1 : 0); }
    while (k < sparks.length) sparks[k++].visible = false; }
  { const a = dustG.attributes.position, kk = king.position, on = amp > 0.05 && kk.x < -22 ? 1 : 0; for (let i = 0; i < 160; i++) { const d = DU[i], life = (t * (0.45 + d[3] * 0.4) + d[0]) % 1, e = ENT[1 + (i % (ENT.length - 1))].g.position; a.setXYZ(i, e.x - life * 1.4 + (d[1] - .5) * 1.2, e.y + 0.1 + life * (0.5 + d[2] * 0.9), e.z + (d[2] - .5) * 1.6); } a.needsUpdate = true; dust.material.opacity = 0.4 * on * (1 - night * 0.6); dust.visible = on > 0; }

  updateBirds(t);
  setCamera(t);
  dome.position.copy(camera.position); stars.position.copy(camera.position); stars2.position.copy(camera.position);
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
  for (const b of town) { b.m.geometry.computeBoundingBox(); const bb = b.m.geometry.boundingBox, p = b.m.position, r = b.m.rotation.y ? -1 : 1; boxes.push([p.x + Math.min(bb.min.x * r, bb.max.x * r), p.x + Math.max(bb.min.x * r, bb.max.x * r), p.z + Math.min(bb.min.z * r, bb.max.z * r), p.z + Math.max(bb.min.z * r, bb.max.z * r), bb.max.y, 'town@' + p.x.toFixed(0) + ',' + p.z.toFixed(0)]); }
  boxes.push([-0.8, 0.8, -50, -3.4, 6.4, 'wall'], [-0.8, 0.8, 3.4, 50, 6.4, 'wall'], [-1.7, 1.7, 3.3, 6.5, 9.5, 'tower'], [-1.7, 1.7, -6.5, -3.3, 9.5, 'tower'], [0, 88, -50.8, -49.2, 6.4, 'wall'], [0, 88, 49.2, 50.8, 6.4, 'wall']);
  const out = []; let cur = null;
  for (let f = 0; f < Math.ceil(DUR * 30); f++) {
    const t = f / 30; setCamera(t); const c = camera.position; let hit = null;
    for (const [x0, x1, z0, z1, y1, nm] of boxes) if (c.x > x0 - 0.9 && c.x < x1 + 0.9 && c.z > z0 - 0.9 && c.z < z1 + 0.9 && c.y < y1 + 0.9) { hit = nm; break; }
    if (!hit && c.x > -1.4 && c.x < 1.4 && Math.abs(c.z) < 3.4 && c.y > 4.6 && c.y < 9.2) hit = 'gate-lintel';
    for (const [px, pz, R0, h] of PYR) { const m = Math.max(Math.abs(c.x - px), Math.abs(c.z - pz)) / (R0 / Math.SQRT2); if (c.y < h * (1 - m) + 1.5) hit = 'pyramid'; }
    if (hit) { if (cur && cur[2] === hit && f - cur[1] <= 1) cur[1] = f; else { cur = [f, f, hit]; out.push(cur); } }
  }
  return out.map(([a, b, n]) => `${(a / 30).toFixed(2)}-${(b / 30).toFixed(2)}s ${n}`);
};
window.renderAt = renderAt;
window.CUES = { T, DUR, rain: RAIN.sort((a, b) => a - b), typing: [0, 1, 2, 3].map(i => +(T.gold + (i + 0.5) * 0.12).toFixed(3)), land: FL.map(f => +(f.t0 + f.d).toFixed(3)), gifts: OFF.map(o => +(o.t + 0.75).toFixed(3)), loans: MER.map((m, j) => +(loanT(j) + 0.75).toFixed(3)), tents: tents.map((m, i) => +(T.b4 + 0.75 + i * 0.16).toFixed(3)), heaps: HEAP.map(h => +h.t0.toFixed(3)).sort((a, b) => a - b), sent: TIM.sentences.map(s => s.s) };
document.fonts.ready.then(() => Promise.all(['700 64px Figtree', '900 190px Fraunces', '800 30px JBM', '700 22px Inter', '700 78px Fraunces', '800 54px Figtree', '600 34px Figtree', '500 18px Inter'].map(f => document.fonts.load(f)))).then(() => { renderAt(0); window.__ready = true; });
