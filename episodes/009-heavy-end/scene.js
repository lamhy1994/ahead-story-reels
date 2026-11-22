// The Heavy End — low-poly storybook scene (deterministic: window.renderAt(t) draws the frame for time t)
// 12 Nov 2026: Nvidia's boss resigns, its rivals rise, the S&P 500 still falls. Why: the index counts companies by size.
import * as THREE from 'three';
import { SKIN, MAT, GOLD, rng, M, GB, person, cloud, bushTree, tower, car, lamp, CHIP, COIN, WIN_LIT } from './kit.js';

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
const R = rng(20261122);

// ───────────────────────── story clock (everything hangs off the narration)
const T = {
  hookEnd: TIM.hook ? E(1) + 0.15 : 0,                 // the hook card (script.py HOOK) stays until the hook sentence ends
  rivals: wt(1, 'rivals') - 0.1, up1: wt(1, 'up') - 0.1, market1: wt(1, 'market') - 0.1, down1: wt(1, 'down') - 0.1,
  b2: S(2) - 0.05, boss: wt(2, 'boss') - 0.1, jensen: wt(2, 'Jensen') - 0.1, resigned: wt(2, 'resigned') - 0.1, fell2: wt(2, 'fell') - 0.1, p4: wt(2, '4%') - 0.1,
  b3: S(3) - 0.05, one3: wt(3, 'one') - 0.1, drag: wt(3, 'drag') - 0.1, n500: wt(3, '500') - 0.1,
  b4: S(4) - 0.05, size: wt(4, 'size') - 0.1, vote: wt(4, 'vote') - 0.1,
  b5: S(5) - 0.05, ten: wt(5, 'ten') - 0.1, p40: wt(5, '40%') - 0.1, heaviest: wt(5, 'heaviest') - 0.1, nvidia5: wt(5, 'Nvidia') - 0.1,
  wipe1: S(6) - 0.45, picture: wt(6, 'Picture') - 0.1, two: wt(6, 'two') - 0.1, giant6: wt(6, 'giant') - 0.1, nine: wt(6, 'nine') - 0.1, small6: wt(6, 'small') - 0.1, one6: wt(6, 'one', 1) - 0.1,
  b7: S(7) - 0.05, doubles: wt(7, 'doubles') - 0.1, giant7: wt(7, 'giant') - 0.1, fifth: wt(7, 'fifth') - 0.1, falls: wt(7, 'falls') - 0.1,
  wipe2: S(8) - 0.45, slipping: wt(8, 'slipping') - 0.1, november: wt(8, 'November') - 0.1, six: wt(8, 'six') - 0.1, row: wt(8, 'row') - 0.1,
  b9: S(9) - 0.05, longest: wt(9, 'longest') - 0.1, p8: wt(9, '8%') - 0.1, record: wt(9, 'record') - 0.1,
  b10: S(10) - 0.05, over: wt(10, 'over') - 0.1,
  b11: S(11) - 0.05, story: wt(11, 'story') - 0.15, heavy: wt(11, 'heavy') - 0.1, buy: wt(11, 'buy') - 0.1, four: wt(11, 'four') - 0.1, giants11: wt(11, 'giants') - 0.1,
  cta: S(12) - 0.1, would: wt(12, 'Would') - 0.1, sold: wt(12, 'sold') - 0.1, held: wt(12, 'held') - 0.1, comment: wt(12, 'Comment') - 0.15, sell: wt(12, 'SELL') - 0.2, hold: wt(12, 'HOLD') - 0.1,
};
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
const SKY = [[0, 'MORN'], [T.b3, 'MORN'], [T.b4 + 0.5, 'DAY'], [T.wipe1 + 0.1, 'DAY'], [T.wipe1 + 0.9, 'GOLDEN'], [T.wipe2 + 0.1, 'GOLDEN'], [T.wipe2 + 0.9, 'SUNSET'],
  [T.six + 0.3, 'SUNSET'], [T.b9 + 1.5, 'DUSK'], [T.b10 + 0.3, 'DUSK'], [T.b11 + 0.4, 'NIGHT'], [T.cta, 'NIGHT'], [T.cta + 1.4, 'DUSK'], [DUR + 2, 'DUSK']];
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
{ const rr = rng(909); for (let i = 0; i < 70; i++) { const x = (rr() - 0.5) * 520, z = -230 + rr() * 300; if (Math.abs(x) < 40 && z > -100 && z < 0) continue; flat.box(6 + rr() * 14, 0.06, 6 + rr() * 14, rr() < 0.5 ? 0x8DAE74 : 0x9DB884, x, 0.03, z); } }
const flatM = flat.mesh(); flatM.castShadow = false; scene.add(flatM);

// ───────────────────────── the city: one tower per company; the giant (Nvidia) at the head of the plaza
const TOWERS = [], stat = [];
const NV = [0, -84], SCR = [31, 28.5, -46], SCR_RY = -0.64, RIV = [[-38, -60, 'AMD'], [-30, -100, 'Broadcom']];
const DEST = (x, z) => (Math.abs(x) < 38 && z < -14 && z > -100) || (Math.abs(x) < 56 && z > -20 && z < 90) || Math.hypot(x - SCR[0], z - SCR[2]) < 15 || Math.abs(z + 112) < 9 || Math.abs(z + 6) < 9 || Math.abs(Math.abs(x) - 44) < 9 || RIV.some(([rx, rz]) => Math.hypot(x - rx, z - rz) < 14);
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
// the rivals (their names only as text tags)
RIV.forEach(([x, z, nm], i) => { const h = [44, 50][i]; const g = tower(14, h, 14, { rand: rng(31 + i), color: [0xE4DED2, 0xC9C2B4][i], glass: [0x8A4A4A, 0x4E6A8A][i], floor: 3.4, litP: 0.5, crown: true }); g.position.set(x, 0, z); scene.add(g);
  TOWERS.push({ g, x, z, h, w: 14, dp: Math.hypot(x, z + 50), rival: nm }); stat.push([x - 7, x + 7, z - 7, z + 7, h + 9, 'rival', TOWERS.length - 1]); });
// the giant: a dark tower with a chip for a crown
const NVH = 80;
const nvT = tower(22, NVH, 22, { rand: rng(4), color: 0x2E3440, glass: 0x4E8F86, frame: 0x4A5260, floor: 3.6, litP: 0.62, bare: true, lobby: true });
const nvG = new THREE.Group(); nvG.add(nvT); nvG.position.set(NV[0], 0, NV[1]); nvT.children.forEach(c => { c.castShadow = true; c.receiveShadow = true; }); scene.add(nvG);
const crown = new THREE.Mesh(CHIP, MAT); crown.scale.set(15, 9, 15); crown.position.set(0, NVH + 0.55, 0); crown.castShadow = true; nvG.add(crown);
TOWERS.push({ g: nvG, x: NV[0], z: NV[1], h: NVH + 4, w: 22, dp: 34, giant: true }); stat.push([NV[0] - 12, NV[0] + 12, NV[1] - 12, NV[1] + 12, NVH + 6, 'giant']);
// the ten biggest: the giant + the nine tallest towers near the centre get a glowing amber roof
const capM = new THREE.MeshLambertMaterial({ color: 0xF7B500, emissive: 0xF7A600, emissiveIntensity: 0 });
const TOP = [TOWERS[TOWERS.length - 1], ...TOWERS.filter(w => !w.giant && !w.rival && w.dp < 125).sort((a, b) => b.h - a.h).slice(0, 9)];
TOP.forEach((w, i) => { const c = new THREE.Mesh(new THREE.BoxGeometry(w.w + 1.2, 1.1, w.w + 1.2), capM); c.position.set(w.x, w.h + (w.giant ? -5.5 : 1.0), w.z); c.visible = false; scene.add(c); w.cap = c; w.k = i; });
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
const trees = []; for (const [x, z] of [[-40, 6], [36, 10], [-20, 28], [22, 40], [-48, 46], [46, 58], [-8, 62], [10, 20], [-8, -20], [27, -24], [27, -60], [-14, -18], [14, -18], [-30, -62], [24, -66], [-52, -14], [54, -16], [62, -32], [-62, -24]]) { const m = bushTree(5.5 + R() * 2, R); m.position.set(x, 0, z); scene.add(m); trees.push(m); }
const CARS = [[0xC8423A, -108.5, 1, 8, 0], [0x2F6FB8, -115.5, -1, 9, 40], [0xE9C46A, -2.5, 1, 7, 150], [0x4C9A62, -9.5, -1, 8, 230], [0xEDEDED, -108.5, 1, 8.6, 300], [0x7A4FA0, -9.5, -1, 7, 90], [0xD9664A, -2.5, 1, 9, 420]].map(([col, z, dir, v, off]) => { const m = car(col, { boxy: true }); scene.add(m); return { m, z, dir, v, off }; });
const modern = (i, extra = {}) => ({ robe: [0x34405A, 0x6A2E3E, 0x3F6A5A, 0x5A5A66, 0x7A5A3A, 0x2F4A6A, 0x8A3A3A][i % 7], skin: SKIN[i % 5], short: [0x231C18, 0x5A3E28, 0xC9A27A, 0x3A2A1E, 0x8A8A8A][i % 5], shirt: i % 2 ? 0xF4F2EC : undefined, ...extra });
const WALK = [[-16, -46, 14, 6], [10, -34, -12, -4], [-6, -28, 10, -8], [18, -48, -14, 5], [-20, -30, 12, -6], [4, -54, -10, 6], [-10, -38, 8, 7], [22, -36, -9, -5]].map(([x, z, dx, dz], i) => { const m = person(modern(i, { badge: i % 3 === 0 })); scene.add(m); return { m, a: [x, z], b: [x + dx, z + dz], sp: 0.06 + i * 0.011, ph: i * 0.27 }; });
const watchers = [[-6, -66], [-2, -67.5], [3, -66.5], [7, -67], [-9, -64.5]].map(([x, z], i) => { const m = person(modern(i + 2)); m.position.set(x, 0, z); m.rotation.y = -Math.PI / 2 - 0.3 + i * 0.15; scene.add(m); return m; });

// ───────────────────────── the coin garden: an imaginary market of two companies (far away, its own little park)
const CP = [420, 0, 40];
const park = new GB(); park.cyl(15, 15, 0.12, 24, 0xE6DFD0, CP[0], 0.06, CP[2]); park.cyl(16.5, 16.5, 0.08, 24, 0x7FA86A, CP[0], 0.04, CP[2]);
for (const [dx, w, col] of [[-3.6, 4.8, 0xB89A6A], [3.6, 3.0, 0xB89A6A]]) { park.box(w, 0.9, w, col, CP[0] + dx, 0.45, CP[2]); park.box(w + 0.4, 0.14, w + 0.4, 0xD9C49A, CP[0] + dx, 0.95, CP[2]); }
const parkM = park.mesh(); parkM.castShadow = true; parkM.receiveShadow = true; scene.add(parkM);
const parkTrees = []; for (let i = 0; i < 9; i++) { const a = Math.PI * (1.08 + i / 8 * 0.84), m = bushTree(5 + R() * 2.2, R); m.position.set(CP[0] + Math.cos(a) * 19, 0, CP[2] + Math.sin(a) * 15 - 3); scene.add(m); parkTrees.push(m); }
const kids = [[-9, -6], [-6.5, -7.5], [7, -7], [9.5, -5.5]].map(([dx, dz], i) => { const m = person(modern(i + 4)); m.position.set(CP[0] + dx, 0, CP[2] + dz); m.rotation.y = Math.atan2(dz, -dx); scene.add(m); return m; });
// columns of coins: the giant has 9 columns (3 x 3), the small one 1 (a 2nd drops in when it doubles); 6 coins = 1 "coin" of value
const CS = 3.2, CH = 0.05 * CS, NPER = 10;
const COLS = []; for (let i = 0; i < 9; i++) COLS.push({ x: CP[0] - 3.6 + (i % 3 - 1) * 1.3, z: CP[2] + (Math.floor(i / 3) - 1) * 1.3, big: true }); COLS.push({ x: CP[0] + 3.6 - 0.62, z: CP[2], big: false }); COLS.push({ x: CP[0] + 3.6 + 0.62, z: CP[2], big: false, extra: true });
const NC = COLS.length * NPER, coinsM = new THREE.InstancedMesh(COIN, GOLD, NC); coinsM.castShadow = true; coinsM.frustumCulled = false; scene.add(coinsM);
// the fifth the giant loses: the top 2 coins of each of its 9 columns (18 of 90 coins = a fifth) fly away
const LOST = []; for (let c = 0; c < 9; c++) for (let k = NPER - 1; k >= NPER - 2; k--) LOST.push(c * NPER + k);
const lostT = idx => T.fifth - 0.05 + LOST.indexOf(idx) * 0.03, dropT = k => T.doubles - 0.05 + k * 0.05;
stat.push([CP[0] - 6.5, CP[0] + 5.5, CP[2] - 3, CP[2] + 3, 4, 'coin pedestals']);

// ───────────────────────── sky clutter: clouds, birds, sparkles
const clouds = []; for (let i = 0; i < 18; i++) { const m = cloud(R); const far = i >= 10; m.position.set(far ? -500 + R() * 1000 : -260 + i * 52 + R() * 20, 70 + R() * 40, far ? -560 + R() * 200 : -340 + R() * 300); m.scale.setScalar(2.0 + R() * 2.2); m.userData.x0 = m.position.x; scene.add(m); clouds.push(m); }
for (const [x, y, z, k] of [[CP[0] - 30, 60, CP[2] - 60, 2.2], [CP[0] + 40, 66, CP[2] - 90, 2.6], [CP[0], 74, CP[2] - 130, 3.0]]) { const m = cloud(R); m.position.set(x, y, z); m.scale.setScalar(k); m.userData.x0 = x; scene.add(m); clouds.push(m); }
const birdMat = new THREE.MeshBasicMaterial({ color: 0x2A2430, side: THREE.DoubleSide });
const wingG = new THREE.BufferGeometry(); wingG.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0.1, 1.6, 0, -0.3, 1.5, 0, 0.5], 3));
const FLOCK = [{ t0: 0, t1: T.b3 + 0.5, a: [-60, 30, -40], b: [40, 38, -90] }, { t0: T.wipe1 + 1.0, t1: T.wipe2 - 0.2, a: [CP[0] - 30, 16, CP[2] - 10], b: [CP[0] + 30, 20, CP[2] - 30] }];
const birds = []; for (let i = 0; i < 9; i++) { const g = new THREE.Group(), l = new THREE.Mesh(wingG, birdMat), r = new THREE.Mesh(wingG, birdMat); r.scale.x = -1; g.add(l, r); g.userData = { l, r, ph: R() * 6 }; g.visible = false; g.scale.setScalar(1.1); scene.add(g); birds.push(g); }
function updateBirds(t) {
  const f = FLOCK.find(f => t >= f.t0 && t <= f.t1); for (const b of birds) b.visible = !!f; if (!f) return;
  const u = seg(t, f.t0, f.t1), dx = f.b[0] - f.a[0], dz = f.b[2] - f.a[2], L = Math.hypot(dx, dz), ux = dx / L, uz = dz / L;
  birds.forEach((b, i) => { const row = Math.ceil(i / 2), sd = i % 2 ? 1 : -1; b.position.set(lerp(f.a[0], f.b[0], u) - ux * row * 2.4 + uz * sd * row * 1.7, lerp(f.a[1], f.b[1], u) + Math.sin(t * 2 + b.userData.ph) * 0.5, lerp(f.a[2], f.b[2], u) - uz * row * 2.4 - ux * sd * row * 1.7); b.rotation.y = Math.atan2(ux, uz); const fl = Math.sin(t * 10 + b.userData.ph) * 0.65; b.userData.l.rotation.z = fl; b.userData.r.rotation.z = -fl; });
}
const sparkT = (() => { const cv = document.createElement('canvas'); cv.width = cv.height = 64; const g = cv.getContext('2d'); g.translate(32, 32); g.fillStyle = '#fff'; for (let k = 0; k < 2; k++) { g.rotate(Math.PI / 2 * k); g.beginPath(); g.moveTo(0, -30); g.quadraticCurveTo(3, -3, 30, 0); g.quadraticCurveTo(3, 3, 0, 30); g.quadraticCurveTo(-3, 3, -30, 0); g.quadraticCurveTo(-3, -3, 0, -30); g.fill(); } const tx = new THREE.CanvasTexture(cv); tx.colorSpace = THREE.SRGBColorSpace; return tx; })();
const sparks = []; for (let i = 0; i < 60; i++) { const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: sparkT, color: 0xFFE9A8, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false })); sp.userData = { ph: R() * 6.28, w: 3 + R() * 4 }; scene.add(sp); sparks.push(sp); }

// ───────────────────────── the price screen: one canvas, redrawn only when what it shows changes
const F = (w, px, fam) => `${w} ${px}px ${fam}`;
let scrKey = '';
function scrMode(t) {
  if (t < T.b2 + 0.3) return ['hook', seg(t, T.up1 - 0.3, T.up1 + 0.6), seg(t, T.down1 - 0.4, T.down1 + 0.6)];
  if (t < T.b4) return ['nvda', seg(t, T.fell2 - 0.2, T.p4 + 0.4), 0];
  if (t > T.wipe2 && t < T.b11) return ['slide', seg(t, T.november - 0.3, T.row + 0.4), seg(t, T.p8 - 0.3, T.record + 0.4)];
  if (t > T.cta) return ['cta', seg(t, T.would, T.would + 0.6), 0];
  return ['idle', 0, 0];
}
function drawScreen(t) {
  const [mode, a, b] = scrMode(t), q = mode === 'slide' ? 120 : 30, key = mode + Math.round(a * q) + '_' + Math.round(b * q);
  if (key === scrKey) return; scrKey = key;
  const g = scrCv.getContext('2d'), w = 720, h = 810;
  g.fillStyle = '#0B1020'; g.fillRect(0, 0, w, h);
  g.strokeStyle = 'rgba(255,255,255,0.07)'; g.lineWidth = 2; for (let i = 1; i < 8; i++) { g.beginPath(); g.moveTo(0, i * h / 8); g.lineTo(w, i * h / 8); g.stroke(); }
  g.textAlign = 'center'; g.textBaseline = 'middle';
  const line = (pts, col, wd = 14) => { g.strokeStyle = col; g.lineWidth = wd; g.lineJoin = 'round'; g.lineCap = 'round'; g.beginPath(); pts.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.stroke(); };
  const partial = (pts, u) => { const out = [pts[0]]; const n = pts.length - 1, k = Math.min(n - 1, Math.floor(u * n)), v = u * n - k; for (let i = 1; i <= k; i++) out.push(pts[i]); const A = pts[k], B = pts[k + 1]; out.push([lerp(A[0], B[0], v), lerp(A[1], B[1], v)]); return out; };
  if (mode === 'hook') {
    g.fillStyle = '#FFD27A'; g.font = F(800, 42, 'Inter'); g.fillText('12 NOV 2026', 360, 56);
    g.font = F(800, 46, 'Inter'); g.fillStyle = '#7FD08A'; g.fillText('AMD ▲', 200, 160); g.fillText('AVGO ▲', 520, 160);
    g.fillStyle = 'rgba(255,255,255,0.2)'; g.fillRect(40, 250, 640, 3);
    g.fillStyle = '#FFFFFF'; g.font = F(800, 50, 'Inter'); g.fillText('S&P 500', 360, 330);
    const pts = [[70, 520], [170, 500], [260, 512], [350, 498], [440, 530], [540, 560], [650, 590]]; line(partial(pts, lerp(0.35, 1, eo(b))), b > 0.3 ? '#FF6B5B' : '#F7B500', 16);
    if (b > 0.55) { g.fillStyle = '#FF6B5B'; g.font = F(900, 100, 'JBM'); g.fillText('▼0.35%', 360, 700); }
  } else if (mode === 'nvda') {
    g.fillStyle = '#FFD27A'; g.font = F(800, 40, 'Inter'); g.fillText('NVDA · 12 NOV 2026', 360, 56);
    const pts = [[60, 380], [180, 372], [300, 390], [400, 520], [500, 470], [620, 455]]; line(partial(pts, lerp(0.3, 1, eo(a))), a > 0.4 ? '#FF6B5B' : '#F7B500', 16);
    g.font = F(900, 128, 'JBM'); g.fillStyle = a > 0.6 ? '#FF6B5B' : 'rgba(255,255,255,0.15)'; g.fillText('▼4.3%', 360, 680);
    g.fillStyle = 'rgba(255,255,255,0.7)'; g.font = F(700, 32, 'Inter'); g.fillText('CLOSE · AFTER THE CEO RESIGNED', 360, 770);
  } else if (mode === 'slide') {
    g.fillStyle = '#FFD27A'; g.font = F(800, 40, 'Inter'); g.fillText('S&P 500 · DOWN DAYS', 360, 56);
    for (let i = 0; i < 6; i++) { const x = 95 + i * 106, v = eo(c01(a * 6.001 - i)); g.fillStyle = 'rgba(255,255,255,0.12)'; g.fillRect(x - 34, 170, 68, 90); if (v > 0) { g.fillStyle = '#FF6B5B'; g.fillRect(x - 34, 170 + 90 * (1 - v), 68, 90 * v); } g.fillStyle = `rgba(255,255,255,${(0.25 + 0.6 * v).toFixed(3)})`; g.font = F(700, 26, 'Inter'); g.fillText(['12', '13', '16', '17', '18', '19'][i], x, 150); }
    { const tv = c01((a - 0.88) / 0.12); if (tv > 0) { g.globalAlpha = tv; g.fillStyle = '#FFFFFF'; g.font = F(800, 40, 'Inter'); g.fillText('6 DOWN DAYS IN A ROW', 360, 380); g.globalAlpha = 1; } }
    const pts = [[60, 470], [200, 450], [330, 520], [460, 560], [560, 610], [660, 680]]; if (b > 0) { line(partial(pts, eo(b)), '#FF6B5B', 12); g.strokeStyle = 'rgba(255,255,255,0.5)'; g.setLineDash([12, 12]); g.lineWidth = 4; g.beginPath(); g.moveTo(60, 470); g.lineTo(670, 470); g.stroke(); g.setLineDash([]); }
    if (b > 0.5) { g.fillStyle = '#FF6B5B'; g.font = F(900, 88, 'JBM'); g.fillText('−8.2%', 470, 700); g.fillStyle = 'rgba(255,255,255,0.75)'; g.font = F(700, 26, 'Inter'); g.fillText('RECORD 6 OCT', 150, 440); g.fillText('FROM THE RECORD · AS OF 19 NOV 2026', 360, 780); }
  } else if (mode === 'cta') {
    g.font = F(900, 150, 'Figtree'); g.fillStyle = '#F7B500'; g.fillText('SELL', 360, 220); g.fillStyle = '#6FD0C0'; g.fillText('HOLD', 360, 560);
    g.fillStyle = '#FFFFFF'; g.font = F(800, 60, 'Inter'); g.fillText('or', 360, 390); g.font = F(700, 38, 'Inter'); g.fillStyle = 'rgba(255,255,255,0.8)'; g.fillText('YOU DECIDE', 360, 720);
  } else {
    g.fillStyle = 'rgba(255,210,122,0.85)'; g.font = F(800, 52, 'Inter'); g.fillText('S&P 500', 360, 120);
    line([[60, 480], [180, 470], [300, 482], [420, 474], [540, 480], [660, 476]], 'rgba(247,181,0,0.6)', 10);
  }
  scrTx.needsUpdate = true;
}

// ───────────────────────── camera path (spherical keys around a target; `up` tilts the view so the subject sits lower in the frame)
const SCRF = (dx = 0, dy = 0) => [SCR[0] + dx, SCR[1] + dy, SCR[2]];
const CAM = [
  { t: 0, tg: [2, 30, -62], d: 215, az: -10, el: 15, up: 0.04 },                                    // morning: the giant at the head of the plaza, its rivals, the screen
  { t: T.down1 + 0.2, tg: [3, 30, -64], d: 198, az: -16, el: 15, up: 0.04, mv: 1 },
  { t: T.b2 + 0.8, tg: [0, 42, NV[1]], d: 150, az: -6, el: 7, up: 0.02, mv: 1 },                      // the giant: its boss resigns
  { t: T.p4 - 0.5, tg: [0, 44, NV[1]], d: 140, az: 4, el: 6, up: 0.02, mv: 1 },
  { t: T.p4 + 0.7, tg: SCRF(0, -0.8), d: 46, az: -34, el: 5, up: 0.04, mv: 1 },                     // the screen: ▼4.3%
  { t: T.b3 + 0.2, tg: SCRF(0, -0.8), d: 44, az: -38, el: 5, up: 0.04 },
  { t: T.n500 + 0.4, tg: [0, 0, -70], d: 430, az: 12, el: 58, up: 0.0, mv: 3 },                     // crane up: a market of 500
  { t: T.vote + 0.3, tg: [0, 10, -70], d: 380, az: 24, el: 40, up: 0.0, mv: 1 },
  { t: T.ten + 0.2, tg: [0, 20, -70], d: 330, az: 16, el: 26, up: 0.02, mv: 1 },                    // the ten biggest light up
  { t: T.heaviest, tg: [0, 30, -76], d: 300, az: 10, el: 22, up: 0.02, mv: 1 },
  { t: T.nvidia5 + 0.3, tg: [0, 46, NV[1]], d: 150, az: 2, el: 8, up: 0.03, mv: 1 },                // the heaviest
  { t: T.wipe1 - 0.2, tg: [0, 50, NV[1]], d: 146, az: 0, el: 8, up: 0.1 },
  { t: T.wipe1 + 0.55, tg: [0, 230, NV[1]], d: 40, az: 6, el: -42, up: 0, mv: 1 },                 // sky wipe → the coin garden
  { t: T.wipe1 + 1.05, tg: [CP[0], 140, CP[2] + 20], d: 40, az: 8, el: -25, up: 0, mv: 1 },
  { t: T.giant6 + 0.1, tg: [CP[0] - 0.5, 1.6, CP[2]], d: 40, az: 0, el: 17, up: 0.05, mv: 1 },
  { t: T.one6 + 0.3, tg: [CP[0] - 0.5, 1.6, CP[2]], d: 38, az: 5, el: 17, up: 0.05 },
  { t: T.doubles + 0.4, tg: [CP[0] + 3.6, 1.8, CP[2]], d: 22, az: 14, el: 16, up: 0.06, mv: 1 },     // the small one doubles
  { t: T.fifth + 0.4, tg: [CP[0] - 3.6, 2.0, CP[2]], d: 24, az: -10, el: 18, up: 0.06, mv: 1 },     // the giant loses a fifth
  { t: T.falls + 0.5, tg: [CP[0] - 0.5, 1.6, CP[2]], d: 38, az: -2, el: 17, up: 0.06, mv: 1 },
  { t: T.wipe2 - 0.2, tg: [CP[0] - 0.5, 2.0, CP[2]], d: 38, az: 0, el: 18, up: 0.12 },
  { t: T.wipe2 + 0.55, tg: [CP[0], 140, CP[2]], d: 40, az: -10, el: -42, up: 0, mv: 1 },            // sky wipe → back to the city at sunset
  { t: T.wipe2 + 1.05, tg: [SCR[0] - 40, 120, SCR[2] + 40], d: 40, az: -30, el: -25, up: 0, mv: 1 },
  { t: T.six + 0.1, tg: SCRF(0, -0.8), d: 50, az: -30, el: 5, up: 0.04, mv: 1 },                    // the screen: six days down
  { t: T.p8 + 0.3, tg: SCRF(0, -0.8), d: 46, az: -36, el: 5, up: 0.04, mv: 1 },
  { t: T.b10 + 0.3, tg: SCRF(0, -0.8), d: 45, az: -38, el: 5, up: 0.04 },
  { t: T.b11 + 0.8, tg: [0, 14, -64], d: 300, az: 20, el: 22, up: 0.16, mv: 3 },                    // crane up over the city at night
  { t: T.cta + 0.1, tg: [0, 12, -60], d: 285, az: 14, el: 22, up: 0.16 },
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

// ───────────────────────── overlay (captions, stamps, labels)
{ const st = document.createElement('style'); st.textContent = `
.wbar{width:820px;padding:26px 30px 24px;box-sizing:border-box;text-align:center;background:rgba(8,10,26,.86);border:2px solid rgba(255,225,160,.6);border-radius:30px;box-shadow:0 18px 50px rgba(5,7,20,.5);}
.wbar .t{font:700 22px/1 'Inter',sans-serif;letter-spacing:.3em;text-transform:uppercase;color:#FFD27A;}
.wbar .bar{margin:22px auto 0;width:740px;height:64px;border-radius:16px;overflow:hidden;display:flex;background:rgba(255,255,255,.08);}
.wbar .a{height:64px;background:#F7A600;display:flex;align-items:center;justify-content:center;font:800 30px/1 'JBM',monospace;color:#1C1300;white-space:nowrap;overflow:hidden;}
.wbar .b{height:64px;flex:1;background:repeating-linear-gradient(45deg,#7A7E90 0 10px,#6A6E80 10px 20px);display:flex;align-items:center;justify-content:center;font:800 26px/1 'JBM',monospace;color:#fff;white-space:nowrap;}
.wbar .l{margin-top:16px;display:flex;justify-content:space-between;font:700 21px/1 'Inter',sans-serif;letter-spacing:.14em;text-transform:uppercase;color:rgba(255,255,255,.8);}
.wbar .s{margin-top:16px;font:500 18px/1 'Inter',sans-serif;letter-spacing:.06em;color:rgba(255,255,255,.6);}
.vote{font:700 34px/1.5 'Figtree',sans-serif;color:#fff;background:rgba(8,10,26,.84);border:2px solid rgba(255,225,160,.6);padding:20px 34px;border-radius:26px;text-align:center;white-space:pre;box-shadow:0 14px 40px rgba(5,7,20,.5);}
.vote s{color:rgba(255,255,255,.55);text-decoration-color:#FF6B5B;text-decoration-thickness:4px;}
.vote em{font-style:normal;color:#FFC84A;}
.tag.up{color:#0E2A16;background:#7FD08A;border-color:#7FD08A;} .tag.up b{color:#0E2A16;}
.tag.dn{color:#fff;background:#D9483B;border-color:#D9483B;} .tag.dn b{color:#fff;}
.mkt{font:800 30px/1 'Inter',sans-serif;letter-spacing:.06em;color:#fff;background:rgba(8,10,26,.86);border:2px solid rgba(255,225,160,.7);padding:18px 26px;border-radius:20px;box-shadow:0 12px 34px rgba(5,7,20,.5);}
.mkt b{font:800 52px/1 'JBM',monospace;color:#FFC84A;margin:0 10px;vertical-align:-6px;} .mkt i{font-style:normal;color:#FF6B5B;}
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
  for (const w of TIM.words) { if (TIM.hook && w.si === 1) continue; if (w.si !== si) { flush(); si = w.si; } clause.push(w); if (/[.,?!:]$/.test(w.t)) flush(); }   // the hook card shows sentence 1
  flush();
  chunks.forEach(c => { c.s = c.ws[0].s - 0.07; c.e = c.ws[c.ws.length - 1].e; });
  if (!TIM.hook) chunks[0].s = -1;
  chunks.forEach((c, i) => { const nx = chunks[i + 1]; c.hide = nx ? Math.min(nx.s, c.e + 0.5) : c.e + 0.8; });
}
const capEl = document.getElementById('cap'); let capIdx = -2;
function updateCaption(t) {
  let idx = -1; for (let i = 0; i < chunks.length; i++) if (t >= chunks[i].s && t < chunks[i].hide) { idx = i; break; }
  if (idx !== capIdx) { capIdx = idx; capEl.innerHTML = idx < 0 ? '' : chunks[idx].ws.map(w => `<span class="w${w.kw ? ' kw' : ''}">${w.t.replace(/[:]$/, '').replace(/&/g, '&amp;')}</span>`).join(''); }
  if (idx < 0) return;
  const c = chunks[idx], spans = capEl.children;
  c.ws.forEach((w, i) => { const nx = c.ws[i + 1]; const st = t < w.s - 0.05 ? 'fut' : (nx && t >= nx.s - 0.05) ? 'said' : 'cur'; const cl = 'w' + (w.kw ? ' kw' : '') + (st === 'cur' ? '' : ' ' + st); if (spans[i].className !== cl) spans[i].className = cl; });
}
// hook card: on the very first frame (it is also the Reel's cover) until the hook sentence ends; lines from script.py HOOK, *word* = amber
const HK = TIM.hook, hookEl = HK ? mk('hook', `<div class="n">${HK.lines.map(l => l.replace(/\*([^*]+)\*/g, '<em>$1</em>')).join('\n')}</div>` + (HK.sub ? `<div class="s">${HK.sub}</div>` : '')) : null;
function fitHook() { if (!hookEl) return; const n = hookEl.querySelector('.n'), w = n.scrollWidth; if (w > 940) n.style.fontSize = (112 * 940 / w).toFixed(1) + 'px'; }
const chip = mk('chip', '');
const tagRiv = RIV.map(([, , nm]) => mk('tag up', `${nm} <b>▲</b>`));
const tagNV = mk('tag dn', 'Nvidia <b>▼4.3%</b>'), tagGiant = mk('tag', 'NVIDIA');
const nameJ = mk('name', '<div class="n">Jensen Huang</div><div class="r">Nvidia CEO · resigned 12 Nov 2026</div>');
const vote = mk('vote', '<s>one company = one vote</s>\n<em>bigger company = bigger weight</em>');
const wbar = mk('wbar', '<div class="t">Share of the S&P 500</div><div class="bar"><div class="a" style="width:0px">TOP 10 · 40%</div><div class="b">OTHER 490 · 60%</div></div><div class="l"><span>10 biggest</span><span>490 others</span></div><div class="s">about 40% · S&P Dow Jones Indices, 2026</div>');
const wbarA = wbar.querySelector('.a');
const tagHeavy = mk('tag am', 'the heaviest: <b>Nvidia</b>');
const tagBig = mk('tag', 'giant · <b>9</b>'), tagSmall = mk('tag', 'small · <b>1</b>');
const mkt = mk('mkt', 'market <b>10</b>');
const title = mk('title', '<div class="s">THE STORY OF</div><div class="n">The Market\'s\n<em>Heavy End</em></div>');
const lesson = mk('lesson', 'Buy the index:\n<em>$4 of every $10</em> go to 10 giants.');
const ctaChip = mk('chip am', 'you decide');
const boxes = [0, 1].map(() => { const e = mk('cbox', '<span class="in"></span><span class="post">Post</span>'); return { e, inn: e.querySelector('.in'), post: e.querySelector('.post') }; });
const foot = document.getElementById('foot');
foot.textContent = 'Sources: Reuters, AP (12–19 Nov 2026), S&P Dow Jones Indices · coins: an example\nS&P 500 −8.2% from its 6 Oct record close, as of 19 Nov 2026 · not advice';
const setTxt = (e, s) => { if (e.textContent !== s) e.textContent = s; };
const setHTML = (e, s) => { if (e._h !== s) { e._h = s; e.innerHTML = s; } };
const fmt1 = v => (Math.round(v * 10) / 10).toFixed(1).replace(/\.0$/, '');

function updateUI(t) {
  updateCaption(t);
  foot.style.opacity = (0.95 * seg(t, 0.8, 1.4) * (1 - seg(t, T.cta, T.cta + 0.3) * 0.45)).toFixed(3);
  // 1 — the hook card: full from frame 0, a slow push-in while the hook is spoken, then it lifts away
  if (hookEl) { const out = seg(t, T.hookEnd, T.hookEnd + 0.3); put(hookEl, W / 2, 640, 1 - out, 1 + 0.035 * seg(t, 0, T.hookEnd) + 0.06 * out); }
  // chips (one line at the top that says where we are)
  let ct = '', co = 0, cp = 0;
  const CH = [[T.b2 + 0.05, T.b3 - 0.15, '12 Nov 2026 · Wall Street'], [T.n500 - 0.2, T.b4 - 0.1, 'the S&P 500 · 500 companies'], [T.b4 + 0.1, T.b5 - 0.15, 'how the index counts'],
    [T.picture, T.b7 - 0.1, 'an imaginary market of two'], [T.b7 + 0.05, T.wipe2 + 0.2, 'same idea, tiny numbers'], [T.wipe2 + 0.9, T.b9 - 0.1, '12 → 19 Nov 2026'], [T.b9 + 0.05, T.b10 + 0.6, 'longest losing streak since 2024'], [T.b10 + 0.6, T.b11 - 0.1, 'as of 19 Nov 2026']];
  for (const [a, b, s] of CH) { const o = win(t, a, b, 0.22, 0.22); if (o > co) { co = o; ct = s; cp = pop(t, a); } }
  if (ct) setTxt(chip, ct); put(chip, W / 2, 472, co, cp);
  // 1 — the rivals rise (shown under the hook card)
  RIV.forEach(([x, z], i) => { const w = TOWERS.find(w => w.rival === RIV[i][2]), p = proj(x, w.h * 0.62, z); const t0 = T.rivals + 0.25 + i * 0.2; put(tagRiv[i], clampX(p[0], 180), clampY(p[1] + i * 96, 900, 1400), p[2] ? win(t, t0, T.b2 + 1.0, 0.2, 0.3) : 0, pop(t, t0)); });
  // 2 — the giant, its boss
  { const p = proj(NV[0], NVH + 9, NV[1]); put(tagGiant, clampX(p[0]), clampY(p[1] - 20, 560, 1400), p[2] ? win(t, T.hookEnd + 0.1, T.b3 - 0.2, 0.3, 0.25) : 0, 1); }
  put(nameJ, W / 2, 1180, win(t, T.jensen, T.p4 + 0.1, 0.3, 0.25), pop(t, T.jensen));
  { const p = proj(NV[0] + 8, NVH * 0.7, NV[1] + 11); put(tagNV, clampX(p[0], 240), clampY(p[1], 700, 1400), p[2] ? win(t, T.p4, T.b3 + 0.2, 0.2, 0.25) : 0, pop(t, T.p4)); }
  // 4 — by size, not one vote each
  put(vote, W / 2, 1150, win(t, T.size - 0.1, T.b5 + 0.1, 0.25, 0.25), pop(t, T.size - 0.1));
  // 5 — the ten biggest: about 40%
  { const o = win(t, T.p40 - 0.25, T.heaviest + 0.2, 0.3, 0.25); wbarA.style.width = (740 * 0.4 * eo(seg(t, T.p40 - 0.2, T.p40 + 0.5))).toFixed(1) + 'px'; put(wbar, W / 2, 1180, o, pop(t, T.p40 - 0.25)); }
  { const p = proj(NV[0], NVH + 10, NV[1]); put(tagHeavy, clampX(p[0], 260), clampY(p[1] - 30, 600, 1350), win(t, T.heaviest, T.wipe1 + 0.15, 0.2, 0.2), pop(t, T.heaviest)); }
  // 6–7 — the two companies, in coins
  { const big = 9 - 1.8 * eo(seg(t, T.fifth - 0.05, T.fifth + 0.55)), small = 1 + eo(seg(t, T.doubles - 0.05, T.doubles + 0.55));
    setHTML(tagBig, `giant · <b>${fmt1(big)}</b>` + (t > T.fifth + 0.3 ? ' <i style="font-style:normal;color:#FF8A7A">−⅕</i>' : '')); setHTML(tagSmall, `small · <b>${fmt1(small)}</b>` + (t > T.doubles + 0.3 ? ' <i style="font-style:normal;color:#7FD08A">×2</i>' : ''));
    const pb = proj(CP[0] - 3.6, 4.6, CP[2]), ps = proj(CP[0] + 3.6, 4.0, CP[2]), on = t > T.wipe1 + 1.2 && t < T.wipe2 + 0.1;
    put(tagBig, clampX(pb[0], 200), clampY(pb[1] - 30, 700, 1400), on ? win(t, T.nine, T.wipe2 - 0.1, 0.2, 0.25) : 0, pop(t, T.nine) * (1 + 0.08 * win(t, T.fifth, T.fifth + 0.4, 0.1, 0.2)));
    put(tagSmall, clampX(ps[0], 200), clampY(ps[1] - 30, 700, 1400), on ? win(t, T.one6, T.wipe2 - 0.1, 0.2, 0.25) : 0, pop(t, T.one6) * (1 + 0.08 * win(t, T.doubles, T.doubles + 0.4, 0.1, 0.2)));
    const tot = big + small; setHTML(mkt, `market <b>${fmt1(tot)}</b>` + (t > T.falls ? '<i>▼</i>' : ''));
    put(mkt, W / 2, 1290, win(t, T.two, T.wipe2 - 0.1, 0.25, 0.25), pop(t, T.two) * (1 + 0.1 * win(t, T.falls, T.falls + 0.4, 0.1, 0.2))); }
  // 11 — title and lesson; 12 — you decide
  put(title, W / 2, 640, win(t, T.story, T.cta - 0.1, 0.4, 0.3), 0.94 + 0.06 * eo(seg(t, T.story, T.story + 0.6)));
  put(lesson, W / 2, 1180, win(t, T.buy, T.cta - 0.15, 0.3, 0.25), pop(t, T.buy));
  put(ctaChip, W / 2, 472, seg(t, T.would, T.would + 0.3), pop(t, T.would));
  [[T.sell, 'SELL', T.postA], [T.hold, 'HOLD', T.postB]].forEach(([t0, word, tp], i) => {
    const bx = boxes[i], n = Math.min(4, Math.floor(c01((t - t0) / 0.45) * 4.001)), typed = word.slice(0, n), caret = (n < 4 || Math.floor(t * 2.4) % 2) && t < tp ? '<i></i>' : '';
    setHTML(bx.inn, typed ? `<b>${typed}</b>${caret}` : `<em>Add a comment…</em>${caret}`); const sent = t > tp; const pc = sent ? 'post on sent' : n === 4 ? 'post on' : 'post'; if (bx.post.className !== pc) bx.post.className = pc; setTxt(bx.post, sent ? 'Posted ✓' : 'Post');
    const ts = i ? T.held + 0.1 : T.comment; put(bx.e, W / 2, 1330 + i * 132, seg(t, ts, ts + 0.3), pop(t, ts) * (1 + 0.06 * win(t, tp, tp + 0.3, 0.08, 0.2)));
  });
}

// ───────────────────────── one frame
const hopY = (hops, t, h = 0.5) => { let y = 0; for (const t0 of hops) { const u = (t - t0) / 0.38; if (u > 0 && u < 1) y = Math.max(y, Math.sin(u * Math.PI) * h); } return y; };
const _m4 = new THREE.Matrix4(), _q = new THREE.Quaternion(), _e = new THREE.Euler(), _p = new THREE.Vector3(), _s = new THREE.Vector3();
const topK = (w, t) => back(seg(t, T.ten + 0.05 + w.k * 0.12, T.ten + 0.45 + w.k * 0.12));
function renderAt(t) {
  const s = skyAt(t), night = s.glow;
  paintSky(s);
  scene.fog.color.setRGB(...s.fog); scene.fog.near = s.fn; scene.fog.far = s.ff;
  hemi.color.setRGB(...s.hemS); hemi.groundColor.setRGB(...s.hemG); hemi.intensity = s.hemI;
  sun.color.setRGB(...s.sunC); sun.intensity = s.sunI;
  const az = s.az * Math.PI / 180, el = s.el * Math.PI / 180, sd = [Math.cos(el) * Math.sin(az), Math.sin(el), Math.cos(el) * Math.cos(az)];
  starM.opacity = s.star * 0.9; stars.visible = s.star > 0.01;
  setCamera(t);
  // lights at night
  WIN_LIT.emissiveIntensity = Math.max(0, night * 1.05 + (t > T.cta ? 0.15 * Math.sin(t * 3.1) : 0));
  lampM.emissiveIntensity = night * 1.4;
  // the rivals hop up as they rise; the giant shudders and sinks a little when its stock falls
  RIV.forEach((r, i) => { const w = TOWERS.find(w => w.rival === r[2]); const k = 1 + 0.06 * Math.sin(Math.PI * seg(t, T.rivals + 0.2 + i * 0.2, T.rivals + 0.75 + i * 0.2)); w.g.scale.set(1, k, 1); });
  { const sh = win(t, T.fell2, T.p4 + 0.8, 0.1, 0.4), sink = 1 - 0.043 * eo(seg(t, T.fell2, T.p4 + 0.4)) * (1 - seg(t, T.b5, T.b5 + 0.8));
    nvG.scale.set(1, sink, 1); nvG.rotation.z = Math.sin(t * 23) * 0.006 * sh; nvG.rotation.x = Math.sin(t * 19 + 1) * 0.004 * sh; crown.rotation.y = t * 0.25; }
  // the ten biggest light up
  const capOn = win(t, T.ten, T.wipe1 + 0.4, 0.3, 0.3);
  capM.emissiveIntensity = 0.55 + 0.45 * capOn;
  for (const w of TOP) { const k = topK(w, t) * (1 - seg(t, T.wipe1 + 0.2, T.wipe1 + 0.6)); w.cap.visible = k > 0.01 && t < T.wipe1 + 0.6; w.cap.scale.set(1, Math.max(0.01, k), 1); }
  // cars and people
  for (const c of CARS) { const L = 700, x = ((c.off + t * c.v) % L) - L / 2; c.m.position.set(c.dir * x, 0, c.z); c.m.rotation.y = c.dir > 0 ? 0 : Math.PI; }
  WALK.forEach((w, i) => { const u = (Math.sin((t * w.sp + w.ph) * Math.PI * 2) + 1) / 2, dir = Math.cos((t * w.sp + w.ph) * Math.PI * 2) > 0 ? 1 : -1; const x = lerp(w.a[0], w.b[0], u), z = lerp(w.a[1], w.b[1], u); w.m.position.set(x, Math.abs(Math.sin(t * 7 + i)) * 0.06, z); w.m.rotation.y = Math.atan2(-(w.b[1] - w.a[1]) * dir, (w.b[0] - w.a[0]) * dir); });
  watchers.forEach((m, i) => { m.position.y = hopY([T.down1 + 0.1 + i * 0.07, T.p4 + 0.1 + i * 0.06], t, 0.16); });
  kids.forEach((m, i) => { m.position.y = hopY([T.doubles + 0.5 + i * 0.07, T.falls + 0.1 + i * 0.07], t, 0.2); });
  // the coins
  for (let c = 0; c < COLS.length; c++) for (let k = 0; k < NPER; k++) {
    const idx = c * NPER + k, col = COLS[c]; let x = col.x, y = 1.02 + CH * (k + 0.5), z = col.z, sc = CS, rx = 0, rz = 0;
    if (col.extra) { const t0 = dropT(k), u = seg(t, t0, t0 + 0.32); if (t < t0) sc = 0.0001; else { y = lerp(y + 7, y, u * u); rx = (1 - u) * 2.2; } }
    if (col.big) { const li = LOST.indexOf(idx); if (li >= 0) { const t0 = lostT(idx), u = seg(t, t0, t0 + 0.9); if (u > 0) { y += 7 * u + Math.sin(u * Math.PI) * 1.2; x += (li % 2 ? 1 : -1) * 2.4 * u - 1.5 * u; z -= 3 * u; rx = u * 6; sc = u >= 1 ? 0.0001 : CS * (1 - 0.5 * u); } } }
    const vis = t > T.wipe1 + 0.6 && t < T.wipe2 + 0.8; if (!vis) sc = 0.0001;
    _e.set(rx, 0, rz); _q.setFromEuler(_e); _p.set(x, y, z); _s.set(sc, sc, sc); coinsM.setMatrixAt(idx, _m4.compose(_p, _q, _s));
  }
  coinsM.instanceMatrix.needsUpdate = true;
  // palms of the wind, clouds
  for (const c of clouds) { c.position.x = c.userData.x0 + t * 1.2; c.material.opacity = 0.9 - 0.5 * night; const k = lerp(1, 0.45, night); c.material.color.setRGB(lerp(s.hor[0], 1, 0.55) * k, lerp(s.hor[1], 1, 0.55) * k, lerp(s.hor[2], 1, 0.55) * k * 1.05); }
  // sparkles: the ten roofs, the coins, the final wish
  { let k = 0; const put3 = (x, y, z, sz, on) => { const sp = sparks[k++]; if (!sp) return; const tw = Math.pow(Math.abs(Math.sin(t * sp.userData.w + sp.userData.ph)), 3); sp.position.set(x, y, z); sp.scale.setScalar(sz * (0.25 + tw)); sp.material.opacity = on * (0.3 + 0.7 * tw); sp.visible = on > 0.01; };
    for (const w of TOP) put3(w.x, w.h + 3.5, w.z, 7, capOn * topK(w, t));
    const s2 = win(t, T.doubles, T.wipe2 - 0.2, 0.3, 0.4); for (let i = 0; i < 8; i++) { const a = i * 0.785 + t * 0.9; put3(CP[0] + 3.6 + Math.cos(a) * 1.8, 1.4 + (i % 4) * 0.45, CP[2] + Math.sin(a) * 1.8, 0.8, s2); }
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
  T, DUR, sent: TIM.sentences.map(s => s.s),
  typingA: [0, 1, 2, 3].map(i => +(T.sell + (i + 0.5) * 0.11).toFixed(3)), typingB: [0, 1, 2, 3].map(i => +(T.hold + (i + 0.5) * 0.11).toFixed(3)),
  rivals: [0, 1].map(i => +(T.rivals + 0.25 + i * 0.2).toFixed(3)), caps: TOP.map(w => +(T.ten + 0.05 + w.k * 0.12).toFixed(3)),
  drops: Array.from({ length: NPER }, (_, k) => +(dropT(k) + 0.32).toFixed(3)), lost: LOST.map(i => +lostT(i).toFixed(3)),
  postA: +T.postA.toFixed(3), postB: +T.postB.toFixed(3),
};
document.fonts.ready.then(() => Promise.all(['700 64px Figtree', '900 190px Fraunces', '800 30px JBM', '700 22px Inter', '700 78px Fraunces', '800 54px Figtree', '600 34px Figtree', '500 18px Inter', '900 128px JBM', '800 46px Inter', '900 150px Figtree', '900 112px Fraunces'].map(f => document.fonts.load(f)))).then(() => { fitHook(); renderAt(0); window.__ready = true; });
