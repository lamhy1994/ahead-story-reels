// Silver Thursday — low-poly storybook scene (deterministic: window.renderAt(t) draws the frame for time t)
// 2026 silver square (the crash, then the rhyme) → sky wipe → 1979–80: Texas oil field, the brothers, their silver mountain,
// the lender's bank, the exchange, the 1980 price tower, a margin call → Silver Thursday → sky wipe → 2026 → $41, the end
import * as THREE from 'three';
import { SKIN, MAT, rng, GB, person, cloud, bushTree, tower, lamp, car, WIN_LIT, BIGCOIN, CASH, pedestal, bank, INGOT, derrick, pumpjack, deskPhone, BILL, building } from './kit.js';

// ───────────────────────── basics
const W = 1080, H = 1920, QP = new URLSearchParams(location.search);
const TIM = window.TIMING;
const S = i => TIM.sentences[i - 1].s;
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
  jan: wt(1, 'January') - 0.1, silver1: wt(1, 'silver') - 0.1, crashed: wt(1, 'crashed') - 0.1, third: wt(1, 'third') - 0.1, day1: wt(1, 'day') - 0.1,
  b2: S(2) - 0.05, worst: wt(2, 'worst') - 0.1, y1980: wt(2, '1980') - 0.1, brothers2: wt(2, 'brothers') - 0.1, corner: wt(2, 'corner') - 0.1,
  wipe1: S(3) - 0.85, meet: wt(3, 'Meet') - 0.1, bunker: wt(3, 'Bunker') - 0.1, herbert: wt(3, 'Herbert') - 0.1, billionaire: wt(3, 'billionaire') - 0.1, texas: wt(3, 'Texas') - 0.1, oilman: wt(3, 'oilman') - 0.1,
  b4: S(4) - 0.05, paper: wt(4, 'paper') - 0.1, lose: wt(4, 'lose') - 0.1, value: wt(4, 'value') - 0.1, bought: wt(4, 'bought') - 0.1, silver4: wt(4, 'silver') - 0.1,
  b5: S(5) - 0.05, mountains: wt(5, 'Mountains') - 0.1, much: wt(5, 'much') - 0.1, borrowed5: wt(5, 'borrowed') - 0.1, money5: wt(5, 'money') - 0.1,
  b6: S(6) - 0.05, early: wt(6, 'early') - 0.1, y1979: wt(6, '1979') - 0.1, ounce6: wt(6, 'ounce') - 0.1, p6: wt(6, '$6') - 0.1,
  b7: S(7) - 0.05, january7: wt(7, 'January') - 0.1, p50: wt(7, '$50') - 0.1,
  b8: S(8) - 0.05, exchange: wt(8, 'exchange') - 0.1, rules: wt(8, 'rules') - 0.1, buying: wt(8, 'buying') - 0.1, selling: wt(8, 'selling') - 0.1,
  b9: S(9) - 0.05, price9: wt(9, 'price') - 0.1, slide: wt(9, 'slide') - 0.1,
  b10: S(10) - 0.05, p10: wt(10, '$10') - 0.1, p90: wt(10, '$90') - 0.1, percent: wt(10, 'percent') - 0.1, wipes: wt(10, 'wipes') - 0.1, ten2: wt(10, 'ten', 1) - 0.1,
  b11: S(11) - 0.05, lender: wt(11, 'lender') - 0.1, cash11: wt(11, 'cash') - 0.1, margin: wt(11, 'margin') - 0.1, call: wt(11, 'call') - 0.1,
  b12: S(12) - 0.05, thursday12: wt(12, 'Thursday') - 0.1, march: wt(12, 'March') - 0.1, couldnt: wt(12, "couldn't") - 0.1, pay: wt(12, 'pay') - 0.1,
  b13: S(13) - 0.05, sold: wt(13, 'sold') - 0.1, price13: wt(13, 'price') - 0.1, hit: wt(13, 'hit') - 0.1, eighty: wt(13, 'eighty') - 0.1,
  b14: S(14) - 0.05, silver14: wt(14, 'Silver') - 0.1, thursday14: wt(14, 'Thursday') - 0.1,
  b15: S(15) - 0.05, lost: wt(15, 'lost') - 0.1, p17: wt(15, '$1.7') - 0.1, later15: wt(15, 'later') - 0.1, bankrupt: wt(15, 'bankrupt') - 0.1,
  wipe2: S(16) - 0.8, years: wt(16, 'years') - 0.1, rhymed: wt(16, 'rhymed') - 0.1, january16: wt(16, 'January') - 0.1, record: wt(16, 'record') - 0.1, lots: wt(16, 'lots') - 0.1, borrowed16: wt(16, 'borrowed') - 0.1, crash16: wt(16, 'crash') - 0.1,
  b17: S(17) - 0.05, nov: wt(17, 'November') - 0.1, p41: wt(17, '$41') - 0.1,
  b18: S(18) - 0.05, over: wt(18, 'over') - 0.1,
  b19: S(19) - 0.05, story: wt(19, 'story') - 0.15, thursday19: wt(19, 'Thursday') - 0.1, borrowed19: wt(19, 'borrowed') - 0.1, faster: wt(19, 'faster') - 0.1,
  cta: S(20) - 0.1, would: wt(20, 'Would') - 0.1, sold20: wt(20, 'sold') - 0.1, held: wt(20, 'held') - 0.1, comment: wt(20, 'Comment') - 0.15, sell: wt(20, 'SELL') - 0.2, hold: wt(20, 'HOLD') - 0.1,
};
T.postA = T.sell + 0.75; T.postB = T.hold + 0.7;
window.T = T;
const IN80 = t => t > T.wipe1 + 0.55 && t < T.wipe2 + 0.55;   // the 1979–80 part of the story

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
  DAWN: P(0x2C3E7E, 0xD9788A, 0xFFC27A, 0xF0B48A, 0xFFB070, 2.6, 0x9AAEE6, 0x9A8466, 1.3, 0.15, 0.25, 75, 10, 0xFFD9A0, 44, 90, 620),
  MORN: P(0x4E9FDC, 0x9FD0EA, 0xFBE6BC, 0xE6E4D6, 0xFFE2B0, 3.2, 0xBFDFFF, 0x9A9A80, 1.6, 0, 0, 55, 30, 0xFFF0C8, 40, 100, 680),
  DAY: P(0x2F8FDA, 0x86C6EE, 0xEAF0EE, 0xDCE6EA, 0xFFF1D6, 3.5, 0xCFE8FF, 0x9AA088, 1.7, 0, 0, 22, 52, 0xFFF8E0, 38, 110, 720),
  GOLDEN: P(0x3C7FCB, 0xF2C58A, 0xFFD79A, 0xF6CF9A, 0xFFC878, 3.2, 0xE8D2B0, 0xA88A60, 1.5, 0, 0.12, -68, 20, 0xFFE0A0, 44, 100, 680),
  SUNSET: P(0x2E2F72, 0xE0707A, 0xFFB25E, 0xEE9A6A, 0xFF9050, 2.9, 0xB49AC8, 0x86685A, 1.45, 0.12, 0.6, -70, 11, 0xFFB060, 50, 90, 620),
  DUSK: P(0x141A4C, 0x4A3F86, 0xC06A78, 0x6A4A78, 0x93A4F4, 1.7, 0x5A62B0, 0x3A2A40, 1.2, 0.65, 0.92, -40, 36, 0xFFF4D6, 30, 80, 600),
};
// January 2026 night (the crash) → 1979 golden Texas → New York days → Silver Thursday sunset → dusk → 2026 day → sunset → night
const SKY = [[0, 'NIGHT'], [T.wipe1 + 0.15, 'NIGHT'], [T.wipe1 + 1.0, 'GOLDEN'], [T.b6 - 0.3, 'GOLDEN'], [T.b6 + 0.8, 'MORN'], [T.b8, 'DAY'], [T.b12 - 0.4, 'DAY'], [T.b12 + 0.9, 'GOLDEN'],
  [T.b13 + 0.5, 'SUNSET'], [T.b15, 'SUNSET'], [T.b15 + 2.6, 'DUSK'], [T.wipe2 + 0.15, 'DUSK'], [T.wipe2 + 1.0, 'MORN'], [T.january16, 'DAY'], [T.crash16 - 0.2, 'DAY'], [T.crash16 + 0.7, 'GOLDEN'],
  [T.b17 + 1.4, 'SUNSET'], [T.b18, 'SUNSET'], [T.over + 0.8, 'NIGHT'], [T.cta + 0.4, 'NIGHT'], [T.cta + 2.2, 'DUSK'], [DUR + 2, 'DUSK']];
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
const stat = [];

// ───────────────────────── ground: the 2026 square, the street north, the 1980 plaza, the Texas sand
const ground = new THREE.Mesh(new THREE.PlaneGeometry(1400, 1400).rotateX(-Math.PI / 2), new THREE.MeshLambertMaterial({ color: 0xBFC2A8 })); ground.receiveShadow = true; scene.add(ground);
const flat = new GB();
flat.box(1400, 0.04, 8, 0x4A4E56, 0, 0.02, 40); flat.box(1400, 0.04, 8, 0x4A4E56, 0, 0.021, -40);
for (let x = -690; x < 690; x += 6) { flat.box(2.6, 0.05, 0.22, 0xF2EEE2, x, 0.045, 40); flat.box(2.6, 0.05, 0.22, 0xF2EEE2, x, 0.046, -40); }
flat.box(84, 0.06, 66, 0xE6DFD0, 0, 0.03, 0);                                                      // Silver Square (2026)
for (let i = 0; i < 17; i++) flat.box(84, 0.065, 0.12, 0xD6CEBC, 0, 0.034, -32 + i * 4);
flat.box(8, 0.04, 62, 0x4A4E56, 0, 0.022, 71);                                                     // the street north
flat.box(72, 0.06, 52, 0xDCD3C0, 0, 0.03, 133);                                                    // the 1980 plaza in front of the exchange
for (let i = 0; i < 13; i++) flat.box(72, 0.065, 0.12, 0xC9BFA8, 0, 0.034, 109 + i * 4);
flat.box(160, 0.05, 110, 0xD9B47A, 0, 0.026, 214);                                                 // Texas: sand and scrub
{ const rr = rng(1979); for (let i = 0; i < 40; i++) flat.box(4 + rr() * 9, 0.055, 3 + rr() * 7, rr() < 0.5 ? 0xC9A266 : 0xE2C08A, (rr() - 0.5) * 150, 0.03, 162 + rr() * 104); }
{ const rr = rng(404); for (let i = 0; i < 60; i++) { const x = (rr() - 0.5) * 520, z = -220 + rr() * 460; if ((Math.abs(x) < 46 && z > -36 && z < 36) || (Math.abs(x) < 82 && z > 100 && z < 272) || (Math.abs(x) < 8 && z > 36 && z < 104)) continue; flat.box(6 + rr() * 14, 0.06, 6 + rr() * 14, rr() < 0.5 ? 0x8DAE74 : 0x9DB884, x, 0.03, z); } }
const flatM = flat.mesh(); flatM.castShadow = false; scene.add(flatM);
// far mesas to the north (Texas horizon)
{ const b = new GB(), rr = rng(77); for (let i = 0; i < 9; i++) { const x = -420 + i * 105 + (rr() - 0.5) * 40, z = 430 + rr() * 140, r = 30 + rr() * 34, h = 16 + rr() * 26; b.cyl(r * 0.78, r, h, 7, i % 2 ? 0xC08A5A : 0xB47A4E, x, h / 2, z); b.cyl(r * 0.8, r * 0.8, 1.2, 7, 0xD39C68, x, h + 0.2, z); } const m = b.mesh(); m.castShadow = false; scene.add(m); }

// ───────────────────────── towers of silver bars: each layer two bars. 2026: a layer ≈ $5 an ounce (24 = $121). 1980: a layer = $2 (3 = $6, 25 = $50, 5 ≈ $10)
const PLH = 0.8, BL = 2.6, BH = 0.66, BW = 1.2, G = 24;
const plinthMesh = () => { const b = new GB(); b.box(5.4, 0.2, 5.4, 0xCFC7B6, 0, 0.1, 0); b.box(4.6, PLH, 4.6, 0xD8D0BE, 0, PLH / 2, 0); b.box(4.9, 0.14, 4.9, 0xEDE6D6, 0, PLH - 0.05, 0); return b.mesh(); };
const ingotG = INGOT(BL, BH, BW);
const silverM = new THREE.MeshLambertMaterial({ color: 0xE8ECF2, emissive: 0x8C96A8, emissiveIntensity: 0.3 });
const slot = (base, i, k) => { const off = (k ? 1 : -1) * (BW / 2 + 0.03), odd = i % 2; return [base[0] + (odd ? off : 0), PLH + BH * (i + 0.5), base[2] + (odd ? 0 : off), odd ? Math.PI / 2 : 0]; };
const _ax = new THREE.Vector3(), _qa = new THREE.Quaternion(), _qb = new THREE.Quaternion(), YAX = new THREE.Vector3(0, 1, 0);
function mkFall(t0, o) {
  const a = o.dir ?? R() * Math.PI * 2, v = o.v[0] + R() * (o.v[1] - o.v[0]), vy = o.vy[0] + R() * (o.vy[1] - o.vy[0]);
  const dx = Math.cos(a), dz = Math.sin(a);
  return { t0, dx, dz, v, vy, flips: o.flips ?? (1 + Math.floor(R() * 2)), axis: [-dz, 0, dx], dyaw: (R() - 0.5) * (o.yaw ?? 2.4), push: o.push ?? 0, sd: o.sd ?? 0 };
}
// pose of a falling bar: optional slide to the edge, then a ballistic arc that ends lying flat on the ground (a whole number of half-turns)
function fallPose(s, f, t) {
  const dt = t - f.t0; if (dt < 0) return null;
  let x0 = s[0], z0 = s[2]; const y0 = s[1];
  if (f.sd > 0) { if (dt < f.sd) { const u = dt / f.sd, p = f.push * u * u; _qa.setFromAxisAngle(YAX, s[3]); return [x0 + f.dx * p, y0, z0 + f.dz * p, _qa, false]; } x0 += f.dx * f.push; z0 += f.dz * f.push; }
  const td = dt - f.sd, yG = BH / 2, tau = (f.vy + Math.sqrt(f.vy * f.vy + 2 * G * Math.max(0, y0 - yG))) / G, tt = Math.min(td, tau), u = tt / tau;
  const x = x0 + f.dx * f.v * tt, z = z0 + f.dz * f.v * tt, y = Math.max(yG, y0 + f.vy * tt - 0.5 * G * tt * tt);
  _ax.set(f.axis[0], 0, f.axis[2]).normalize(); _qa.setFromAxisAngle(_ax, f.flips * Math.PI * u); _qb.setFromAxisAngle(YAX, s[3] + f.dyaw * u); _qa.multiply(_qb);
  return [x, y, z, _qa, td >= tau];
}
const landT = (b, f) => f.t0 + f.sd + (f.vy + Math.sqrt(f.vy * f.vy + 2 * G * (b.s[1] - BH / 2))) / G;

// 2026 tower on Silver Square: record at the start; the top seven layers tumble (−31%); rebuilt for the rhyme, tumble again, then slide to $41
const TW = [0, 0, 0], NL = 24;
{ const m = plinthMesh(); m.position.set(TW[0], 0, TW[2]); scene.add(m); }
stat.push([TW[0] - 2.8, TW[0] + 2.8, TW[2] - 2.8, TW[2] + 2.8, PLH + NL * BH + 0.8, 'silver tower']);
const silverI = new THREE.InstancedMesh(ingotG, silverM, NL * 2); silverI.castShadow = true; silverI.receiveShadow = true; silverI.frustumCulled = false; scene.add(silverI);
const slideT = i => T.b17 - 0.1 + (16 - i) * ((T.p41 + 0.25 - (T.b17 - 0.1)) / 9);
const SBARS = [];
for (let i = 0; i < NL; i++) for (let k = 0; k < 2; k++) {
  const b = { i, k, s: slot(TW, i, k), fallA: null, fallB: null, slide: null };
  if (i >= 17) { b.fallA = mkFall(T.crashed - 0.02 + (23 - i) * 0.05 + k * 0.03, { v: [3.5, 7.5], vy: [2.5, 6.5] }); b.fallB = mkFall(T.crash16 - 0.02 + (23 - i) * 0.05 + k * 0.03, { v: [3.5, 7.5], vy: [2.5, 6.5] }); }
  else if (i >= 8) b.slide = mkFall(slideT(i) + k * 0.06, { dir: (R() - 0.5) * 0.35, v: [4.2, 6.0], vy: [0.4, 1.2], flips: 1, yaw: 0.5, push: 2.2, sd: 0.32 });
  SBARS.push(b);
}
// 2026 price board (pylon screen) beside the tower
const SCR = [-14, 0, 4], SCR_RY = 0.6, SCRH = 9.5;
const pylonMesh = (body = 0x3A4048, frame = 0x8A8F96) => { const g = new THREE.Group(), b = new GB(); b.box(1.6, SCRH, 1.4, body, 0, SCRH / 2, -0.9); b.box(9.4, 7.2, 0.7, 0x23272E, 0, SCRH + 2.4, 0); b.box(9.8, 0.4, 1.0, frame, 0, SCRH + 6.1, 0); b.box(9.8, 0.4, 1.0, frame, 0, SCRH - 1.3, 0); g.add(b.mesh()); return g; };
function screenOn(group, w = 720, h = 560) { const cv = document.createElement('canvas'); cv.width = w; cv.height = h; const tx = new THREE.CanvasTexture(cv); tx.colorSpace = THREE.SRGBColorSpace; tx.anisotropy = 4; const m = new THREE.Mesh(new THREE.PlaneGeometry(8.8, 6.84), new THREE.MeshBasicMaterial({ map: tx, toneMapped: false })); m.position.set(0, SCRH + 2.4, 0.37); group.add(m); return { cv, tx }; }
const pylon = pylonMesh(); pylon.position.set(SCR[0], SCR[1], SCR[2]); pylon.rotation.y = SCR_RY; scene.add(pylon);
const scr = screenOn(pylon);
const SCRW = (base, ry, dy = 0) => { const c = Math.cos(ry), s = Math.sin(ry); return [base[0] + 0.37 * s, base[1] + SCRH + 2.4 + dy, base[2] + 0.37 * c]; };
stat.push([SCR[0] - 5, SCR[0] + 5, SCR[2] - 3.5, SCR[2] + 3.5, SCRH + 6.4, 'screen']);
// 2026 traders with phones: around the tower at the start; scatter at the crash; back for the rhyme; scatter again
const NTR = 12, TRAD = Array.from({ length: NTR }, (_, k) => {
  const m = person({ robe: [0x34405A, 0x6A2E3E, 0x3F6A5A, 0x5A5A66, 0x7A5A3A, 0x2F6FB8][k % 6], skin: SKIN[(k + 1) % 5], short: [0x231C18, 0x5A3E28, 0xC9A27A, 0x3A2A1E, 0x8A8A8A][k % 5], shirt: k % 2 ? 0xF4F2EC : undefined, phone: true, s: 0.98 });
  const a = -1.2 + (k / (NTR - 1)) * 2.4, r = 6.0 + (k % 3) * 1.3;
  const from = [-26 + k * 4.6 + (R() - 0.5) * 2, 0, 36 + R() * 4], to = [TW[0] + Math.sin(a) * r, 0, TW[2] + Math.cos(a) * r], away = [TW[0] + Math.sin(a) * 26, 0, TW[2] + Math.cos(a) * 26];
  scene.add(m); m.visible = false; return { m, from, to, away, t1: T.years + k * 0.07 + R() * 0.1, ph: R() * 6 };
});

// ───────────────────────── 1980: the exchange, the price tower and its board, a lender's desk, the brothers, their silver, the bank, the oil field
const EX = [0, 0, 104];
const exch = bank(); exch.position.set(EX[0], 0, EX[2]); scene.add(exch); stat.push([EX[0] - 13, EX[0] + 13, EX[2] - 8.5, EX[2] + 11, 16, 'exchange']);
const EXDOOR = [EX[0], 3.2, EX[2] + exch.userData.door + 0.6];
const signM = (txt, bg, fg, w = 1024, h = 160, px = 100) => { const cv = document.createElement('canvas'); cv.width = w; cv.height = h; const tx = new THREE.CanvasTexture(cv); tx.colorSpace = THREE.SRGBColorSpace; const draw = () => { const g = cv.getContext('2d'); g.fillStyle = bg; g.fillRect(0, 0, w, h); g.fillStyle = fg; g.font = `900 ${px}px Figtree`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(txt, w / 2, h / 2 + 6); tx.needsUpdate = true; }; return { cv, tx, draw }; };   // drawn once the fonts are loaded
const SIGNS = [];
{ const s = signM('THE EXCHANGE', '#3A2E24', '#FFF1D6'); SIGNS.push(s); const m = new THREE.Mesh(new THREE.PlaneGeometry(15, 2.3), new THREE.MeshBasicMaterial({ map: s.tx, toneMapped: false })); m.position.set(EX[0], exch.userData.signY, EX[2] + exch.userData.signZ + 0.02); scene.add(m); }
// the 1980 tower
const TW80 = [-12, 0, 128], NL80 = 25;
{ const m = plinthMesh(); m.position.set(TW80[0], 0, TW80[2]); scene.add(m); }
stat.push([TW80[0] - 2.8, TW80[0] + 2.8, TW80[2] - 2.8, TW80[2] + 2.8, PLH + NL80 * BH + 0.8, '1980 tower']);
const tw80I = new THREE.InstancedMesh(ingotG, silverM, NL80 * 2); tw80I.castShadow = true; tw80I.receiveShadow = true; tw80I.frustumCulled = false; scene.add(tw80I);
const drop80 = i => T.b7 - 0.1 + (T.p50 - 0.35 - (T.b7 - 0.1)) * Math.pow((i - 3) / 21, 0.85);
const slide80 = i => T.b9 - 0.3 + (24 - i) * ((T.b10 - 0.2 - (T.b9 - 0.3)) / 9);
const BARS80 = [];
for (let i = 0; i < NL80; i++) for (let k = 0; k < 2; k++) {
  const b = { i, k, s: slot(TW80, i, k), drop: i >= 3 ? drop80(i) + k * 0.04 : null, fall: null };
  if (i >= 16) b.fall = mkFall(slide80(i) + k * 0.06, { dir: Math.PI / 2 + (R() - 0.5) * 0.4, v: [4.0, 5.6], vy: [0.4, 1.1], flips: 1, yaw: 0.5, push: 2.2, sd: 0.3 });
  else if (i >= 5) b.fall = mkFall(T.hit - 0.05 + (15 - i) * 0.06 + k * 0.03, { v: [3.5, 7.5], vy: [2.5, 6.0] });
  BARS80.push(b);
}
const SLIDE80 = BARS80.filter(b => b.i >= 16), CRASH80 = BARS80.filter(b => b.i >= 5 && b.i < 16);
const layers80At = t => { let n = 3; for (let i = 3; i < NL80; i++) if (t >= drop80(i) + 0.4) n = i + 1; return n; };
// the 1980 board: an old amber board on a brown pylon
const SCR80 = [-3, 0, 124], RY80 = -0.45;
const py80 = pylonMesh(0x5A4632, 0xA88A60); py80.position.set(SCR80[0], 0, SCR80[2]); py80.rotation.y = RY80; scene.add(py80); const scr80 = screenOn(py80);
stat.push([SCR80[0] - 5, SCR80[0] + 5, SCR80[2] - 3.5, SCR80[2] + 3.5, SCRH + 6.4, '1980 board']);
// a picture of borrowed money: nine blue coins (borrowed) and one gold coin (your own) on a pedestal; the lender's desk with a telephone
const MC = [12, 0, 126];
{ const p = pedestal(1.3, 1.0); p.position.set(MC[0], 0, MC[2]); scene.add(p); stat.push([MC[0] - 1.4, MC[0] + 1.4, MC[2] - 1.4, MC[2] + 1.4, 2.6, 'pedestal']); }
const coinGeo = BIGCOIN(0.66, 0.17);
const blueCM = new THREE.MeshLambertMaterial({ color: 0x4F7FD0, emissive: 0x1A2E60, emissiveIntensity: 0.4 });
const goldCM = new THREE.MeshLambertMaterial({ color: 0xF7B500, emissive: 0xA86A00, emissiveIntensity: 0.55, transparent: true });
const blueC = new THREE.InstancedMesh(coinGeo, blueCM, 9); blueC.castShadow = true; blueC.frustumCulled = false; scene.add(blueC);
const goldC = new THREE.Mesh(coinGeo, goldCM); goldC.castShadow = true; scene.add(goldC);
const coinY = j => 1.3 + 0.1 + j * 0.2;
const coinT = j => T.p10 + 0.25 + j * 0.05;
const DESK = [16.6, 0, 126];
{ const b = new GB(); b.box(2.6, 0.12, 1.4, 0x7A5A3A, 0, 1.0, 0); for (const [x, z] of [[-1.15, -0.55], [1.15, -0.55], [-1.15, 0.55], [1.15, 0.55]]) b.box(0.12, 1.0, 0.12, 0x5A3E28, x, 0.5, z); b.box(2.2, 0.5, 0.06, 0x6A4A2E, 0, 0.62, 0.6); const m = b.mesh(); m.position.set(DESK[0], 0, DESK[2]); scene.add(m); stat.push([DESK[0] - 1.4, DESK[0] + 1.4, DESK[2] - 0.8, DESK[2] + 0.8, 1.4, 'desk']); }
const phone1 = deskPhone(0xC8423A); phone1.scale.setScalar(0.62); phone1.position.set(DESK[0] + 0.3, 1.06, DESK[2] + 0.1); phone1.rotation.y = -Math.PI / 2; scene.add(phone1);
const broker = person({ robe: 0x3A4A6A, skin: SKIN[3], short: 0x5A3E28, shirt: 0xF4F2EC, tie: 0xC8423A, s: 1.0 }); broker.position.set(DESK[0] - 0.3, 0, DESK[2] - 1.3); broker.rotation.y = -Math.PI / 2; scene.add(broker);
// the brothers (simple figures, no likeness), a side table with their telephone, the banknote, and their silver mountain
const BR = [0, 0, 158];
const bro1 = person({ robe: 0x6A4E36, skin: SKIN[4], shirt: 0xF4F2EC, tie: 0x8A2A2A, cowboy: 0xEDE2C8, s: 1.18 }); bro1.position.set(BR[0] - 0.95, 0, BR[2] - 0.6); bro1.rotation.y = Math.PI / 2; scene.add(bro1);
const bro2 = person({ robe: 0x4A5568, skin: SKIN[3], shirt: 0xF4F2EC, tie: 0x2F4F8F, cowboy: 0x7A5A3A, band: 0xE8DCC0, s: 1.1 }); bro2.position.set(BR[0] + 0.95, 0, BR[2] + 0.6); bro2.rotation.y = Math.PI / 2; scene.add(bro2);
stat.push([BR[0] - 1.8, BR[0] + 3.0, BR[2] - 0.8, BR[2] + 0.8, 2.4, 'brothers']);
{ const b = new GB(); b.box(1.1, 0.08, 0.9, 0x7A5A3A, 0, 0.95, 0); b.cyl(0.08, 0.1, 0.92, 6, 0x5A3E28, 0, 0.46, 0); b.cyl(0.4, 0.45, 0.06, 8, 0x5A3E28, 0, 0.03, 0); const m = b.mesh(); m.position.set(BR[0] + 2.4, 0, BR[2] + 0.1); scene.add(m); }
const phone2 = deskPhone(0x2A2A2E); phone2.scale.setScalar(0.62); phone2.position.set(BR[0] + 2.4, 0.99, BR[2] + 0.1); phone2.rotation.y = Math.PI / 2; scene.add(phone2);
const billM = new THREE.MeshLambertMaterial({ vertexColors: true, transparent: true });
const bill = new THREE.Mesh(BILL, billM); bill.rotation.x = -Math.PI / 2 + 0.12; scene.add(bill);
const oz = new THREE.Mesh(ingotG, silverM); oz.castShadow = true; scene.add(oz);
const PILE = [-13, 0, 161], PS = 0.85;
const pileM = new THREE.MeshLambertMaterial({ color: 0xE8ECF2, emissive: 0x8C96A8, emissiveIntensity: 0.32 });
const PSL = []; [[5, 4], [4, 3], [3, 2], [2, 1]].forEach(([nx, nz], l) => { for (let a = 0; a < nx; a++) for (let c = 0; c < nz; c++) PSL.push([PILE[0] + (a - (nx - 1) / 2) * 2.32 * PS, BH * PS * (l + 0.5), PILE[2] + (c - (nz - 1) / 2) * 1.1 * PS]); });
const NP = PSL.length, pileI = new THREE.InstancedMesh(ingotG, pileM, NP); pileI.castShadow = true; pileI.receiveShadow = true; pileI.frustumCulled = false; scene.add(pileI);
stat.push([PILE[0] - 6.5, PILE[0] + 6.5, PILE[2] - 2.6, PILE[2] + 2.6, 3.2, 'silver mountain']);
const arrT = j => T.silver4 + 0.15 + j * ((T.money5 + 0.25 - (T.silver4 + 0.15)) / NP);
const NSOLD = 28, soldT = j => T.sold - 0.2 + (NP - 1 - j) * 0.07;            // bars j = 39 … 12 are sold (flown to the exchange); 12 stay
// the lender's bank (faces -x, toward the brothers): cash bundles fly to the brothers while they buy
const LB = [20, 0, 162];
const lbank = bank(); lbank.scale.setScalar(0.6); lbank.position.set(LB[0], 0, LB[2]); lbank.rotation.y = -Math.PI / 2; scene.add(lbank); stat.push([LB[0] - 6.6, LB[0] + 4.8, LB[2] - 7.8, LB[2] + 7.8, 9.6, 'lender bank']);
{ const s = signM('BANK', '#2E3A52', '#FFF6E6', 512, 160, 110); SIGNS.push(s); const m = new THREE.Mesh(new THREE.PlaneGeometry(6, 1.38), new THREE.MeshBasicMaterial({ map: s.tx, toneMapped: false })); m.position.set(LB[0] - lbank.userData.signZ * 0.6 - 0.03, lbank.userData.signY * 0.6, LB[2]); m.rotation.y = -Math.PI / 2; scene.add(m); }
const LBDOOR = [LB[0] - 4.6, 2.2, LB[2]];
const NCASH = 10, cashI = new THREE.InstancedMesh(CASH, MAT, NCASH); cashI.castShadow = true; cashI.frustumCulled = false; scene.add(cashI);
const CASHT = Array.from({ length: NCASH }, (_, i) => T.borrowed5 - 0.45 + i * 0.13);
// Texas: oil derricks, pumpjacks, a ranch house
for (const [x, z, h] of [[-30, 196, 15], [-10, 206, 17], [12, 200, 14], [32, 212, 16], [-46, 214, 13], [0, 228, 15], [24, 232, 13], [-24, 230, 14], [48, 196, 12], [-60, 200, 12]]) { const m = derrick(h, 3.4); m.position.set(x, 0, z); m.rotation.y = (x * 0.37) % 1.2; scene.add(m); stat.push([x - 3.2, x + 4.6, z - 3.2, z + 3.2, h + 1.2, 'derrick']); }
const JACKS = [[-18, 184, 0.3], [7, 186, -0.2], [34, 186, 0.5], [-42, 190, 0.1]].map(([x, z, ry], k) => { const m = pumpjack(); m.position.set(x, 0, z); m.rotation.y = ry; scene.add(m); stat.push([x - 3.8, x + 3.8, z - 2, z + 2, 5.5, 'pumpjack']); return { m, ph: k * 1.3 }; });
{ const h = building(11, 5.2, 8, { color: 0xEAD9B8, roof: 0x9A5A3A, front: -1, rand: rng(5) }); h.position.set(-52, 0, 182); scene.add(h); stat.push([-58, -46, 177.5, 186.5, 7, 'ranch']); }
// 1980 traders (coloured jackets, papers): gather while the price climbs, hop at $50, scatter on Silver Thursday
const JK = [0xC8423A, 0x2F6FB8, 0xE09A2B, 0x3F8F57, 0x7A4FA0, 0xF2EEE2, 0x2FA39A, 0xD9664A, 0x2F6FB8, 0xC8423A];
const TR80 = JK.map((col, k) => {
  const m = person({ robe: col, skin: SKIN[(k + 2) % 5], short: [0x231C18, 0x5A3E28, 0xC9A27A, 0x3A2A1E, 0x8A8A8A][k % 5], shirt: 0xF4F2EC, paper: k % 2 === 0, s: 0.98 });
  const a = -1.15 + (k / 9) * 2.3, r = 6.2 + (k % 3) * 1.2;
  const from = [-8 + k * 2.4, 0, 113 + R() * 3], to = [TW80[0] + Math.sin(a) * r, 0, TW80[2] + Math.cos(a) * r], away = [TW80[0] + Math.sin(a) * 22, 0, TW80[2] + Math.cos(a) * 22];
  scene.add(m); m.visible = false; return { m, from, to, away, t0: T.y1979 - 0.2 + k * 0.08, ph: R() * 6 };
});

// ───────────────────────── the city around the square (the street north, the 1980 plaza and Texas stay clear)
{
  const tr = rng(2026), PALS = [[0xD9D3C6, 0x5E7F9A], [0x6D97AA, 0x3F6A80], [0xE4DED2, 0x4E7C93], [0xC9C2B4, 0x55748C], [0x8FB3C2, 0x426E86], [0xEFE9DC, 0x6A8AA4], [0xB7C4C9, 0x3E6378], [0xE8D9C0, 0x5A7A90]];
  const clear = (x, z) => (Math.abs(x) < 46 && z > -38 && z < 36) || (Math.abs(x) < 22 && z > 30 && z < 110) || (Math.abs(x) < 84 && z > 88 && z < 272) || Math.abs(z - 40) < 8 || Math.abs(z + 40) < 8;
  for (let gx = -210; gx <= 210; gx += 22) for (let gz = -200; gz <= 260; gz += 22) {
    const x = gx + (tr() - .5) * 7, z = gz + (tr() - .5) * 7; if (clear(x, z) || tr() < 0.12) continue;
    const w = 9 + tr() * 7, d = 9 + tr() * 7, dp = Math.hypot(x, z), far = dp > 140;
    const h = (dp < 90 ? 16 + tr() * 22 : 24 + tr() * (far ? 50 : 36));
    const pal = PALS[Math.floor(tr() * PALS.length)];
    const g = tower(w, h, d, { rand: tr, color: pal[0], glass: pal[1], floor: far ? 4.2 : 3.4, litP: 0.5, crown: h > 50 && tr() < 0.5 });
    g.position.set(x, 0, z); g.rotation.y = (tr() < 0.5 ? 0 : Math.PI / 2); g.children.forEach(c => { c.castShadow = dp < 150; c.receiveShadow = true; }); scene.add(g);
    stat.push([x - Math.max(w, d) / 2, x + Math.max(w, d) / 2, z - Math.max(w, d) / 2, z + Math.max(w, d) / 2, h + 4, 'tower']);
  }
}
const lampHeads = new GB();
for (let x = -36; x <= 36; x += 12) for (const z of [33.2, -33.2]) { const l = lamp(6.2); l.position.set(x, 0, z); l.rotation.y = z > 0 ? -Math.PI / 2 : Math.PI / 2; scene.add(l); lampHeads.box(0.5, 0.08, 0.3, 0xFFFFFF, x, 5.98, z + (z > 0 ? 1.25 : -1.25)); }
for (const [x, z] of [[-33, 116], [33, 116], [-33, 150], [33, 146]]) { const l = lamp(6.2); l.position.set(x, 0, z); l.rotation.y = x > 0 ? Math.PI : 0; scene.add(l); lampHeads.box(0.3, 0.08, 0.5, 0xFFFFFF, x + (x > 0 ? -1.25 : 1.25), 5.98, z); }
const lampM = new THREE.MeshLambertMaterial({ color: 0xFFF1C8, emissive: 0xFFD27A, emissiveIntensity: 0 }); scene.add(new THREE.Mesh(lampHeads.geo(), lampM));
const CARS = [[0xC8423A, 38, 1, 7.5, 0], [0x2F6FB8, 42, -1, 9.0, 40], [0xE9C46A, -42, 1, 6.2, 150], [0x4C9A62, -38, -1, 8.0, 230], [0xEDEDED, 38, 1, 8.6, 300], [0x7A4FA0, -42, -1, 7.0, 90]].map(([col, z, dir, v, off]) => { const m = car(col); scene.add(m); return { m, z, dir, v, off }; });
for (const [x, z] of [[-38, 22], [-38, -8], [-30, -26], [-40, 30], [-20, -28], [-30, 112], [30, 156], [-58, 176], [56, 178]]) { const m = bushTree(5.5 + R() * 2, R); m.position.set(x, 0, z); scene.add(m); }
const walkers = [[-20, 26, 0.6], [14, 27, -1.1], [-30, 14, 0.3], [24, 120, 1.4], [-22, 116, -0.6]].map(([x, z, ry], k) => { const m = person({ robe: [0x34405A, 0x6A2E3E, 0x3F6A5A, 0x5A5A66, 0x7A5A3A][k], skin: SKIN[(k + 2) % 5], short: [0x231C18, 0x5A3E28, 0xC9A27A, 0x3A2A1E, 0x8A8A8A][k], shirt: k % 2 ? 0xF4F2EC : undefined, s: 0.98 }); m.position.set(x, 0, z); m.rotation.y = ry; scene.add(m); return { m, x, z, ry }; });

// ───────────────────────── sky clutter: clouds, birds, sparkles
const clouds = []; for (let i = 0; i < 20; i++) { const m = cloud(R); const far = i >= 10; m.position.set(far ? -500 + R() * 1000 : -220 + i * 52 + R() * 20, 70 + R() * 40, far ? -520 + R() * 200 : -320 + R() * 300); m.scale.setScalar(2.0 + R() * 2.2); m.userData.x0 = m.position.x; scene.add(m); clouds.push(m); }
for (const [x, y, z, k] of [[20, 74, 230, 2.4], [-40, 80, 290, 2.8], [60, 70, 330, 2.6]]) { const m = cloud(R); m.position.set(x, y, z); m.scale.setScalar(k); m.userData.x0 = x; scene.add(m); clouds.push(m); }
const birdMat = new THREE.MeshBasicMaterial({ color: 0x2A2430, side: THREE.DoubleSide });
const wingG = new THREE.BufferGeometry(); wingG.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0.1, 1.6, 0, -0.3, 1.5, 0, 0.5], 3));
const FLOCK = [{ t0: T.wipe1 + 1.0, t1: T.b5 + 1, a: [-50, 26, 200], b: [50, 34, 170] }, { t0: T.b8, t1: T.b10, a: [-40, 30, 120], b: [40, 36, 100] }, { t0: T.wipe2 + 1.0, t1: T.b18, a: [40, 28, 30], b: [-50, 34, -20] }];
const birds = []; for (let i = 0; i < 9; i++) { const g = new THREE.Group(), l = new THREE.Mesh(wingG, birdMat), r = new THREE.Mesh(wingG, birdMat); r.scale.x = -1; g.add(l, r); g.userData = { l, r, ph: R() * 6 }; g.visible = false; g.scale.setScalar(1.1); scene.add(g); birds.push(g); }
function updateBirds(t) {
  const f = FLOCK.find(f => t >= f.t0 && t <= f.t1); for (const b of birds) b.visible = !!f; if (!f) return;
  const u = seg(t, f.t0, f.t1), dx = f.b[0] - f.a[0], dz = f.b[2] - f.a[2], L = Math.hypot(dx, dz), ux = dx / L, uz = dz / L;
  birds.forEach((b, i) => { const row = Math.ceil(i / 2), sd = i % 2 ? 1 : -1; b.position.set(lerp(f.a[0], f.b[0], u) - ux * row * 2.4 + uz * sd * row * 1.7, lerp(f.a[1], f.b[1], u) + Math.sin(t * 2 + b.userData.ph) * 0.5, lerp(f.a[2], f.b[2], u) - uz * row * 2.4 - ux * sd * row * 1.7); b.rotation.y = Math.atan2(ux, uz); const fl = Math.sin(t * 10 + b.userData.ph) * 0.65; b.userData.l.rotation.z = fl; b.userData.r.rotation.z = -fl; });
}
const sparkT = (() => { const cv = document.createElement('canvas'); cv.width = cv.height = 64; const g = cv.getContext('2d'); g.translate(32, 32); g.fillStyle = '#fff'; for (let k = 0; k < 2; k++) { g.rotate(Math.PI / 2 * k); g.beginPath(); g.moveTo(0, -30); g.quadraticCurveTo(3, -3, 30, 0); g.quadraticCurveTo(3, 3, 0, 30); g.quadraticCurveTo(-3, 3, -30, 0); g.quadraticCurveTo(-3, -3, 0, -30); g.fill(); } const tx = new THREE.CanvasTexture(cv); tx.colorSpace = THREE.SRGBColorSpace; return tx; })();
const sparks = []; for (let i = 0; i < 52; i++) { const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: sparkT, color: 0xE8F0FF, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false })); sp.userData = { ph: R() * 6.28, w: 3 + R() * 4 }; scene.add(sp); sparks.push(sp); }
const glowM = new THREE.MeshBasicMaterial({ map: radial('rgba(200,220,255,0.55)', 'rgba(200,220,255,0)'), transparent: true, depthWrite: false, toneMapped: false, blending: THREE.AdditiveBlending });
const towerGlow = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), glowM); scene.add(towerGlow);

// ───────────────────────── the two boards
const F = (w, px, fam) => `${w} ${px}px ${fam}`;
const fmt = n => '$' + Math.round(n).toLocaleString('en-US');
function boardBase(g, w, h, bg, grid) { g.fillStyle = bg; g.fillRect(0, 0, w, h); g.strokeStyle = grid; g.lineWidth = 2; for (let i = 1; i < 6; i++) { g.beginPath(); g.moveTo(0, i * h / 6); g.lineTo(w, i * h / 6); g.stroke(); } g.textAlign = 'center'; g.textBaseline = 'middle'; }
function scrMode(t) {
  if (t < T.crashed) return ['rec', 0];
  if (t < T.wipe2 + 0.3) return ['crash', seg(t, T.y1980 - 0.1, T.y1980 + 0.3)];
  if (t < T.crash16) return ['rec', 0];
  if (t < T.b17) return ['crash', 0];
  if (t < T.cta) return ['now', seg(t, T.p41 - 0.1, T.p41 + 0.3)];
  return ['cta', 0];
}
let scrKey = '';
function drawScreen(t) {
  const [mode, a] = scrMode(t), key = mode + Math.round(a * 20); if (key === scrKey) return; scrKey = key;
  const g = scr.cv.getContext('2d'); boardBase(g, 720, 560, '#0B1020', 'rgba(255,255,255,0.07)');
  const head = s => { g.fillStyle = '#C9D6EE'; g.font = F(800, 38, 'Inter'); g.fillText(s, 360, 56); };
  const big = (s, col = '#FFFFFF', px = 130, y = 236) => { g.fillStyle = col; g.font = F(800, px, 'JBM'); g.fillText(s, 360, y); };
  const small = (s, col = 'rgba(255,255,255,0.78)', y = 350, px = 34) => { g.fillStyle = col; g.font = F(700, px, 'Inter'); g.fillText(s, 360, y); };
  const foot = s => { g.fillStyle = 'rgba(255,255,255,0.5)'; g.font = F(700, 26, 'Inter'); g.fillText(s, 360, 500); };
  if (mode === 'rec') { head('SILVER · ONE OUNCE'); big('$121', '#FFE27A'); small('RECORD · 29 JAN 2026', '#FFD27A'); foot('IN US DOLLARS'); }
  else if (mode === 'crash') { head('30 JAN 2026 · ONE DAY'); big('−31%', '#FF6B5B', 140); small(a > 0.5 ? 'WORST DAY SINCE 1980' : 'SILVER FUTURES', '#FFB0A0'); foot('ALMOST A THIRD, GONE'); }
  else if (mode === 'now') { head('SILVER · 20 NOV 2026'); big(a > 0.5 ? '$41' : '$121', a > 0.5 ? '#FF8A6B' : '#FFE27A'); small(a > 0.5 ? 'ONE OUNCE' : 'RECORD · JAN 2026'); foot('RECORD WAS $121'); }
  else { g.font = F(900, 150, 'Figtree'); g.fillStyle = '#F7B500'; g.fillText('SELL', 360, 150); g.fillStyle = '#6FD0C0'; g.fillText('HOLD', 360, 420); g.fillStyle = '#FFFFFF'; g.font = F(800, 60, 'Inter'); g.fillText('or', 360, 285); }
  scr.tx.needsUpdate = true;
}
function scr80Mode(t) {
  if (t < T.b7) return ['p6', 0];
  if (t < T.rules - 0.1) return ['rise', layers80At(t)];
  if (t < T.b9) return ['rule', seg(t, T.buying - 0.1, T.buying + 0.2) + seg(t, T.selling - 0.1, T.selling + 0.2)];
  if (t < T.hit) return ['slide', 0];
  return ['thu', 0];
}
let scr80Key = '';
function drawScreen80(t) {
  const [mode, a] = scr80Mode(t), key = mode + (mode === 'rise' ? a : Math.round(a * 10)); if (key === scr80Key) return; scr80Key = key;
  const g = scr80.cv.getContext('2d'); boardBase(g, 720, 560, '#120C06', 'rgba(255,190,90,0.07)');
  const am = '#FFB347', head = s => { g.fillStyle = '#E8C89A'; g.font = F(800, 38, 'Inter'); g.fillText(s, 360, 56); };
  const big = (s, col = am, px = 150, y = 240) => { g.fillStyle = col; g.font = F(800, px, 'JBM'); g.fillText(s, 360, y); };
  const small = (s, col = 'rgba(255,225,180,0.85)', y = 360, px = 34) => { g.fillStyle = col; g.font = F(700, px, 'Inter'); g.fillText(s, 360, y); };
  if (mode === 'p6') { head('SILVER · ONE OUNCE'); big('$6'); small('EARLY 1979'); }
  else if (mode === 'rise') { const n = a; head(n >= 25 ? 'SILVER · JANUARY 1980' : 'SILVER · 1979'); big(n >= 25 ? '$50' : fmt(6 + 44 * (n - 3) / 22), n >= 25 ? '#FFE27A' : '#9FE08A'); small(n >= 25 ? 'ABOUT $50 AN OUNCE' : 'RISING'); }
  else if (mode === 'rule') { head('SILVER · NEW RULE · 21 JAN 1980'); g.font = F(900, 92, 'Figtree'); g.fillStyle = a >= 0.5 ? 'rgba(255,255,255,0.32)' : '#FFFFFF'; g.fillText('BUY', 360, 185); if (a >= 0.5) { g.strokeStyle = '#FF6B5B'; g.lineWidth = 14; g.beginPath(); g.moveTo(250, 185); g.lineTo(470, 185); g.stroke(); } g.fillStyle = a >= 1.5 ? '#FFB347' : 'rgba(255,179,71,0.3)'; g.fillText('SELL ONLY', 360, 330); small('NO NEW BUYING', 'rgba(255,225,180,0.85)', 460); }
  else if (mode === 'slide') { head('SILVER · FEB → MAR 1980'); g.fillStyle = '#FF8A6B'; g.font = F(900, 170, 'Figtree'); g.fillText('↓', 360, 230); small('SLIDING'); }
  else { head('SILVER · 27 MARCH 1980'); big('$10.80', '#FF8A6B', 132); small('SILVER THURSDAY', '#FFB0A0'); }
  scr80.tx.needsUpdate = true;
}

// ───────────────────────── camera path (spherical keys around a target; `up` tilts the view so the subject sits lower in the frame)
const TC = y => [TW[0], y, TW[2]];
const CAM = [
  { t: 0, tg: TC(9), d: 118, az: 4, el: 34, up: 0.06 },                                                    // January 2026, night: high over the city, the tower glowing
  { t: T.silver1 + 0.25, tg: TC(9.0), d: 58, az: 14, el: 11, up: -0.02, mv: 1 },                             // down to the tower at its record
  { t: T.crashed + 0.75, tg: TC(7.5), d: 62, az: -30, el: 12, up: -0.04, mv: 1 },                            // the crash
  { t: T.b2 + 0.2, tg: TC(7.0), d: 58, az: -34, el: 12, up: -0.02 },
  { t: T.brothers2, tg: TC(6.5), d: 50, az: -42, el: 13, up: 0.04, mv: 1 },
  { t: T.wipe1 - 0.3, tg: TC(6.5), d: 50, az: -44, el: 13, up: 0.12 },
  { t: T.wipe1 + 0.4, tg: TC(6.5), d: 50, az: -44, el: 13, up: 1.4, mv: 1 },                                 // sky wipe: tilt up…
  { t: T.wipe1 + 0.7, tg: [0, 50, 90], d: 60, az: 120, el: 40, up: 1.4 },                                     // …travel north, high…
  { t: T.wipe1 + 1.0, tg: [0, 50, 150], d: 60, az: 180, el: 40, up: 1.4 },
  { t: T.bunker + 0.25, tg: [BR[0], 1.4, BR[2]], d: 11, az: 180, el: 6, up: 0.05, mv: 1 },                       // …come down in Texas: the brothers, derricks behind
  { t: T.oilman + 0.2, tg: [BR[0], 1.6, BR[2] + 1], d: 13, az: 174, el: 7, up: 0.06 },
  { t: T.paper + 0.25, tg: [BR[0], 2.6, BR[2]], d: 12, az: 184, el: 6, up: 0.08, mv: 1 },                          // paper money loses value
  { t: T.silver4 + 0.3, tg: [BR[0] - 0.5, 2.6, BR[2]], d: 12.5, az: 190, el: 7, up: 0.07 },
  { t: T.mountains + 0.35, tg: [-13, 1.0, 161], d: 18, az: 266, el: 13, up: 0.0, mv: 1 },                          // from the west: the silver mountain…
  { t: T.borrowed5 + 0.3, tg: [-2, 1.6, 160], d: 31, az: 268, el: 10, up: -0.03, mv: 1 },                           // …the brothers, the bank behind: cash flies in
  { t: T.b6, tg: [-2, 1.6, 160], d: 32, az: 269, el: 10, up: -0.03 },
  { t: T.ounce6 + 0.2, tg: [TW80[0], 1.8, TW80[2]], d: 20, az: 345, el: 8, up: 0.03, mv: 1 },                      // New York: the 1980 tower at $6
  { t: T.b7, tg: [TW80[0], 2.0, TW80[2]], d: 21, az: 342, el: 8, up: 0.04 },
  { t: T.p50 + 0.2, tg: [-9, 8.5, 127], d: 46, az: 335, el: 8, up: 0.0, mv: 1 },                                   // the climb to $50, the board beside it
  { t: T.b8, tg: [-9, 8.6, 127], d: 47, az: 333, el: 8, up: 0.0 },
  { t: T.rules + 0.1, tg: [0, 7.5, 108], d: 44, az: 380, el: 9, up: 0.02, mv: 1 },                                 // the exchange changes the rules
  { t: T.b9, tg: [0, 7.5, 108], d: 45, az: 378, el: 9, up: 0.02 },
  { t: T.slide + 0.4, tg: [TW80[0] + 1, 6.5, TW80[2]], d: 32, az: 330, el: 10, up: 0.04, mv: 1 },                  // the price slides
  { t: T.p10 + 0.4, tg: [MC[0], 2.1, MC[2]], d: 9, az: 356, el: 8, up: 0.0, mv: 1 },                               // ten of your own, ninety borrowed
  { t: T.wipes + 0.4, tg: [MC[0], 2.1, MC[2]], d: 8.6, az: 360, el: 8, up: 0.0 },
  { t: T.margin, tg: [DESK[0], 1.6, DESK[2]], d: 8.5, az: 365, el: 10, up: 0.03, mv: 1 },                          // the lender calls: a margin call
  { t: T.b12, tg: [DESK[0], 1.6, DESK[2]], d: 8.8, az: 367, el: 10, up: 0.03 },
  { t: T.march + 0.3, tg: [BR[0] + 0.6, 1.5, BR[2]], d: 13, az: 540, el: 6, up: 0.06, mv: 1 },                     // the brothers can't pay
  { t: T.b13, tg: [BR[0] + 0.6, 1.5, BR[2]], d: 13.5, az: 542, el: 6, up: 0.06 },
  { t: T.sold + 0.6, tg: [-12, 5, 140], d: 56, az: 720, el: 18, up: 0.0, mv: 1 },                                  // from the north: their silver flies to the exchange; the tower falls
  { t: T.eighty, tg: [-12, 5, 133], d: 48, az: 722, el: 15, up: 0.0 },
  { t: T.silver14 + 0.2, tg: [-12, 5.5, 128], d: 30, az: 730, el: 9, up: 0.03, mv: 1 },                            // Silver Thursday
  { t: T.b15, tg: [-12, 5.2, 128], d: 30, az: 732, el: 9, up: 0.03 },
  { t: T.p17 + 0.3, tg: [-6, 1.2, 160], d: 24, az: 628, el: 9, up: -0.05, mv: 1 },                                  // from the west: the brothers and what is left
  { t: T.wipe2 - 0.3, tg: [-6, 1.2, 160], d: 25, az: 630, el: 9, up: 0.0 },
  { t: T.wipe2 + 0.4, tg: [-6, 1.2, 160], d: 25, az: 630, el: 9, up: 1.4, mv: 1 },                                 // sky wipe back to 2026
  { t: T.wipe2 + 0.7, tg: [-5, 50, 170], d: 60, az: 620, el: 40, up: 1.4 },
  { t: T.wipe2 + 1.0, tg: [0, 50, 24], d: 60, az: 380, el: 40, up: 1.4 },
  { t: T.january16 + 0.3, tg: TC(9.2), d: 56, az: 374, el: 10, up: 0.0, mv: 1 },                               // a January record again
  { t: T.lots + 0.2, tg: TC(8.4), d: 50, az: 380, el: 11, up: 0.0 },
  { t: T.crash16 + 0.7, tg: TC(7.5), d: 62, az: 330, el: 12, up: -0.04, mv: 1 },                               // then a crash
  { t: T.b17 + 0.2, tg: TC(6.5), d: 56, az: 336, el: 12, up: -0.02 },
  { t: T.p41 + 0.4, tg: SCRW(SCR, SCR_RY, -2.2), d: 34, az: 398, el: 6, up: 0.07, mv: 1 },                     // $41 as of 20 Nov
  { t: T.b18 - 0.1, tg: SCRW(SCR, SCR_RY, -2.2), d: 35, az: 394, el: 6, up: 0.07 },
  { t: T.over + 0.7, tg: [2, 8, 0], d: 110, az: 366, el: 30, up: 0.08, mv: 3 },                                 // crane up: night falls over the city
  { t: T.cta + 0.1, tg: [2, 8, 0], d: 116, az: 363, el: 30, up: 0.16 },
  { t: T.comment, tg: SCRW(SCR, SCR_RY, -1.0), d: 32, az: 402, el: 6, up: 0.03, mv: 1 },                       // the board: SELL or HOLD
  { t: DUR + 0.5, tg: SCRW(SCR, SCR_RY, -1.0), d: 29, az: 399, el: 6, up: 0.03 },
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
{ const RC = rng(555), f = new THREE.Vector3(), r = new THREE.Vector3(), u = new THREE.Vector3(), Y = new THREE.Vector3(0, 1, 0);
  for (const tw of [T.wipe1, T.wipe2]) [[0.5, -1, 44, 0.9], [0.7, 1, 50, 1.1], [0.9, -1, 48, 1.0], [1.1, 1, 56, 0.9], [1.3, -1, 60, 0.8], [0.6, 0, 40, 1.3], [0.8, 0.5, 42, 1.4], [1.0, -0.4, 44, 1.3]].forEach(([dt, side, dist, sc]) => {
    setCamera(tw + dt); camera.getWorldDirection(f); r.crossVectors(f, Y).normalize(); u.crossVectors(r, f).normalize();
    const m = cloud(RC); m.position.copy(camera.position).addScaledVector(f, dist).addScaledVector(r, side * 10).addScaledVector(u, -2); m.scale.setScalar(sc);
    m.userData.x0 = m.position.x - (tw + dt) * 1.2; m.userData.win = [tw - 0.9, tw + 2.3]; scene.add(m); clouds.push(m); }); }

// ───────────────────────── overlay (captions, stamps, labels)
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
  for (const w of TIM.words) { if (w.si !== si) { flush(); si = w.si; } clause.push(w); if (/[.,?!:]$/.test(w.t)) flush(); }
  flush();
  chunks.forEach(c => { c.s = c.ws[0].s - 0.07; c.e = c.ws[c.ws.length - 1].e; });
  chunks[0].s = -1;
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
const yearEl = mk('year', '2026'), subEl = mk('sub', 'a true money story');
const y1980El = mk('year', '1980'), y1980Sub = mk('sub', 'the last time');
const chip = mk('chip', '');
const crashBoard = mk('board', '<div class="t">30 January 2026 · one day</div><div class="row"><b style="color:#FF6B5B;text-shadow:0 0 30px rgba(255,80,60,.5)">−31%</b></div><div class="d">silver&rsquo;s worst day since March 1980</div><div class="src">silver futures · WSJ, Dow Jones, Business Today</div>');
const nameBro = mk('name', '<div class="n">Bunker &amp; Herbert Hunt</div><div class="r">sons of Texas oilman H. L. Hunt</div>');
const tagPaper = mk('tag grey', 'paper money · losing value'), tagSilver = mk('tag am', 'silver');
const tagMount = mk('tag am', 'est. <b>100 million+</b> ounces'), tagBorrow = mk('tag', 'borrowed money');
const riseBoard = mk('board', '<div class="t">Silver · one ounce</div><div class="row"><b style="min-width:0;font-size:104px">$6</b><span style="font:700 60px Figtree;color:rgba(255,255,255,.6)">→</span><b class="v2" style="min-width:0;font-size:104px">$50</b></div><div class="d">early 1979 → January 1980</div><div class="src">about $49.45 on 17–18 Jan 1980 · Britannica, ABA Journal</div>'), riseV2 = riseBoard.querySelector('.v2'), riseD = riseBoard.querySelector('.d');
const ruleBoard = mk('board', '<div class="t">21 January 1980 · the exchange</div><div class="row"><b style="font-size:96px;letter-spacing:-2px">SELL ONLY</b></div><div class="d">no new buying of silver</div><div class="src">"liquidation only" · SEC staff report, Fortune (1980)</div>');
const tagSlide = mk('tag', 'price sliding <b>↓</b>');
const tagYours = mk('tag am', '<b>$10</b> yours'), tagBorr = mk('tag', '<b>$90</b> borrowed'), tagFall = mk('tag', 'price <b style="color:#FF8A6B">−10%</b>'), tagZero = mk('tag grey', 'yours: <b>$0</b>');
const tagCall = mk('tag am', 'margin call'), tagCall2 = mk('tag grey', 'pay more cash, or we sell');
const tagCant = mk('tag grey', "couldn't pay");
const tagSold = mk('tag', 'their silver · sold');
const thuBoard = mk('board', '<div class="t">Silver · 27 March 1980</div><div class="row"><b style="color:#FF8A6B">$10.80</b></div><div class="d">from about $50 in January</div><div class="src">Britannica · ABA Journal · Fortune (1980)</div>');
const stampThu = mk('title', '<div class="s">THEY CALLED IT</div><div class="n">Silver\n<em>Thursday</em></div>');
const lostBoard = mk('board', '<div class="t">The brothers</div><div class="row"><b style="font-size:96px">≈$1.7B</b></div><div class="d">lost · later, bankrupt</div><div class="src">Britannica · Fortune (1980) · Marketplace · estimates differ</div>');
const y2026b = mk('year', '2026'), y2026Sub = mk('sub', 'forty-six years later');
const tagRec = mk('tag am', '<b>$121</b> record · 29 Jan'), tagLev = mk('tag', 'lots of borrowed money'), tagCrash2 = mk('tag', '30 Jan · <b style="color:#FF8A6B">−31%</b>');
const worth = mk('worth', '<div class="t">Silver · one ounce</div><div class="row"><span class="v1">$121</span><span class="arr">→</span><span class="v2">$121</span></div><div class="bar"><div class="fill"></div><div class="gone"></div></div><div class="d">as of 20 Nov 2026</div>'), wFill = worth.querySelector('.fill'), wGone = worth.querySelector('.gone'), wD = worth.querySelector('.d'), wV2 = worth.querySelector('.v2');
const title = mk('title', '<div class="s">THE STORY OF</div><div class="n">Silver\n<em>Thursday</em></div>');
const lesson = mk('lesson', 'Borrowed money\n<em>makes falls faster.</em>');
const ctaChip = mk('chip am', 'you decide');
const boxes = [0, 1].map(() => { const e = mk('cbox', '<span class="in"></span><span class="post">Post</span>'); return { e, inn: e.querySelector('.in'), post: e.querySelector('.post') }; });
const foot = document.getElementById('foot');
foot.textContent = 'Sources: WSJ, Dow Jones, Britannica, ABA Journal, Fortune and Christian Science Monitor (1980), Marketplace, Kitco, USA TODAY\nUS dollars an ounce · 1980 figures as reported · story as of 20 Nov 2026 · not advice';
const setTxt = (e, s) => { if (e.textContent !== s) e.textContent = s; };
const setHTML = (e, s) => { if (e._h !== s) { e._h = s; e.innerHTML = s; } };

function updateUI(t) {
  updateCaption(t);
  foot.style.opacity = (0.95 * seg(t, 0.8, 1.4) * (1 - seg(t, T.cta, T.cta + 0.3) * 0.45)).toFixed(3);
  // 1–2 — 2026: the crash; worst since 1980
  { const o = win(t, -1, T.silver1 - 0.1, 0.5, 0.3); put(yearEl, W / 2, 640, o); put(subEl, W / 2, 780, o * seg(t, 0.4, 0.9)); }
  put(crashBoard, W / 2, 1370, win(t, T.third - 0.2, T.wipe1 - 0.35, 0.25, 0.25), pop(t, T.third - 0.2));
  { const o = win(t, T.y1980 - 0.1, T.wipe1 + 0.1, 0.3, 0.3); put(y1980El, W / 2, 660, o, pop(t, T.y1980 - 0.1)); put(y1980Sub, W / 2, 795, o); }
  // 3 — the brothers
  put(nameBro, W / 2, 700, win(t, T.bunker, T.b4 - 0.15, 0.25, 0.25), pop(t, T.bunker));
  // 4–5 — paper money; silver; the mountain; borrowed money
  { const p = proj(BR[0], 5.5, BR[2]); put(tagPaper, clampX(p[0], 260), clampY(p[1] - 30, 620, 1200), p[2] ? win(t, T.paper, T.silver4 - 0.1, 0.2, 0.2) : 0, pop(t, T.paper)); }
  { const p = proj(BR[0] - 1.5, 5.0, BR[2]); put(tagSilver, clampX(p[0], 200), clampY(p[1] - 30, 620, 1200), p[2] ? win(t, T.silver4, T.mountains - 0.1, 0.2, 0.2) : 0, pop(t, T.silver4)); }
  { const p = proj(PILE[0], 4.6, PILE[2]); put(tagMount, clampX(p[0], 260), clampY(p[1] - 30, 620, 1250), p[2] ? win(t, T.mountains + 0.1, T.b6 - 0.1, 0.2, 0.25) : 0, pop(t, T.mountains + 0.1)); }
  { const p = proj(LB[0] - 5, 6.5, LB[2]); put(tagBorrow, clampX(p[0], 230), clampY(p[1] - 30, 620, 1250), p[2] ? win(t, T.borrowed5, T.b6 + 0.1, 0.2, 0.25) : 0, pop(t, T.borrowed5)); }
  // 6–7 — $6 → $50
  { const u = seg(t, T.p50 - 0.1, T.p50 + 0.2); riseV2.style.opacity = u.toFixed(3); riseD.style.opacity = u.toFixed(3); put(riseBoard, W / 2, 1360, win(t, T.p6 - 0.1, T.b8 - 0.1, 0.25, 0.25), pop(t, T.p6 - 0.1)); }
  // 8 — the rule; 9 — sliding
  put(ruleBoard, W / 2, 1360, win(t, T.rules - 0.05, T.b9 + 0.35, 0.25, 0.25), pop(t, T.rules - 0.05));
  { const p = proj(TW80[0], PLH + 18 * BH + 1.5, TW80[2]); put(tagSlide, clampX(p[0], 220), clampY(p[1] - 30, 620, 1100), p[2] ? win(t, T.slide - 0.1, T.b10 + 0.2, 0.2, 0.25) : 0, pop(t, T.slide - 0.1)); }
  // 10–11 — ten of your own, ninety borrowed; a ten percent fall; the margin call
  { const p = proj(MC[0], coinY(9) + 0.5, MC[2]); put(tagYours, clampX(p[0] - 150, 200), clampY(p[1] - 40, 620, 1300), p[2] ? win(t, coinT(9) + 0.1, T.wipes + 0.15, 0.2, 0.2) : 0, pop(t, coinT(9) + 0.1)); }
  { const p = proj(MC[0], coinY(4), MC[2]); put(tagBorr, clampX(p[0] - 200, 200), clampY(p[1], 620, 1350), p[2] ? win(t, T.p90, T.lender + 0.1, 0.2, 0.25) : 0, pop(t, T.p90)); }
  { const p = proj(MC[0], coinY(9) + 1.3, MC[2]); put(tagFall, clampX(p[0] + 60, 200), clampY(p[1] - 60, 620, 1200), p[2] ? win(t, T.percent, T.b11, 0.2, 0.25) : 0, pop(t, T.percent)); }
  { const p = proj(MC[0], coinY(9) + 0.4, MC[2]); put(tagZero, clampX(p[0] - 150, 200), clampY(p[1] - 40, 620, 1300), p[2] ? win(t, T.wipes + 0.35, T.lender + 0.1, 0.2, 0.25) : 0, pop(t, T.wipes + 0.35)); }
  { const p = proj(DESK[0] + 0.3, 2.4, DESK[2] + 0.1); put(tagCall, clampX(p[0], 200), clampY(p[1] - 70, 620, 1250), p[2] ? win(t, T.margin - 0.1, T.b12 - 0.1, 0.2, 0.25) : 0, pop(t, T.margin - 0.1)); put(tagCall2, clampX(p[0], 260), clampY(p[1] - 10, 680, 1310), p[2] ? win(t, T.call + 0.1, T.b12 - 0.1, 0.2, 0.25) : 0, pop(t, T.call + 0.1)); }
  // 12 — the brothers couldn't pay
  { const p = proj(BR[0] + 2.4, 3.6, BR[2]); put(tagCant, clampX(p[0], 200), clampY(p[1] - 30, 620, 1250), p[2] ? win(t, T.couldnt - 0.05, T.b13 - 0.1, 0.2, 0.25) : 0, pop(t, T.couldnt - 0.05)); }
  // 13–14 — sold; $10.80; Silver Thursday
  { const p = proj(PILE[0], 5.5, PILE[2]); put(tagSold, clampX(p[0], 230), clampY(p[1] - 30, 620, 1200), p[2] ? win(t, T.sold, T.price13 + 0.4, 0.2, 0.25) : 0, pop(t, T.sold)); }
  put(thuBoard, W / 2, 1370, win(t, T.hit, T.b15 - 0.05, 0.25, 0.25), pop(t, T.hit));
  put(stampThu, W / 2, 660, win(t, T.silver14 - 0.1, T.b15 - 0.05, 0.3, 0.3), 0.94 + 0.06 * eo(seg(t, T.silver14 - 0.1, T.silver14 + 0.5)));
  // 15 — the loss
  put(lostBoard, W / 2, 1370, win(t, T.lost - 0.05, T.wipe2 + 0.1, 0.25, 0.25), pop(t, T.lost - 0.05));
  // 16 — 2026, the rhyme
  { const o = win(t, T.years - 0.2, T.rhymed + 0.5, 0.3, 0.3); put(y2026b, W / 2, 660, o, pop(t, T.years - 0.2)); put(y2026Sub, W / 2, 795, o); }
  { const p = proj(TW[0], PLH + NL * BH + 1.6, TW[2]); put(tagRec, clampX(p[0], 230), clampY(p[1] - 30, 600, 1000), p[2] ? win(t, T.record - 0.1, T.crash16 - 0.1, 0.2, 0.2) : 0, pop(t, T.record - 0.1)); }
  { const p = proj(TW[0], 3.2, TW[2] + 8); put(tagLev, clampX(p[0], 250), clampY(p[1] + 40, 700, 1350), p[2] ? win(t, T.lots - 0.05, T.crash16 + 0.4, 0.2, 0.25) : 0, pop(t, T.lots - 0.05)); }
  { const p = proj(TW[0], PLH + 17 * BH + 1.8, TW[2]); put(tagCrash2, clampX(p[0], 200), clampY(p[1] - 30, 600, 1100), p[2] ? win(t, T.crash16 + 0.2, T.b17 + 0.3, 0.2, 0.25) : 0, pop(t, T.crash16 + 0.2)); }
  // 17 — $121 → $41 as of 20 Nov 2026
  { const u = eo(seg(t, T.nov, T.p41 + 0.4)), f = lerp(1, 41 / 121, u); wFill.style.width = (560 * f).toFixed(0) + 'px'; wGone.style.width = (560 * (1 - f)).toFixed(0) + 'px'; setTxt(wV2, u > 0.5 ? '$41' : '$121'); wV2.style.color = u > 0.5 ? '#FF8A6B' : ''; wD.style.opacity = seg(t, T.p41 + 0.2, T.p41 + 0.5).toFixed(3); put(worth, W / 2, 1370, win(t, T.b17 + 0.1, T.b18 + 0.3, 0.25, 0.25), pop(t, T.b17 + 0.1)); }
  // chips
  let ct = '', co = 0, cp = 0;
  const CH = [[T.jan, T.b2 - 0.2, 'January 2026'], [T.b2 + 0.05, T.wipe1 + 0.2, 'silver futures · one day'], [T.wipe1 + 0.95, T.b4 - 0.15, 'Texas · the 1970s'], [T.b4 + 0.05, T.b6 - 0.15, '1979 · prices rising fast'],
    [T.b6 + 0.05, T.b8 - 0.15, '1979 → January 1980'], [T.b8 + 0.05, T.b9 - 0.1, '21 January 1980'], [T.b9 + 0.05, T.b10 - 0.15, 'February → March 1980'], [T.b10 + 0.05, T.b12 - 0.15, 'how borrowed money works'],
    [T.b12 + 0.05, T.b15 - 0.15, 'Thursday · 27 March 1980'], [T.b15 + 0.05, T.wipe2 + 0.2, '1980 · and after'], [T.wipe2 + 0.95, T.b17 - 0.15, 'January 2026'], [T.b17 + 0.05, T.b19 - 0.1, 'as of 20 Nov 2026']];
  for (const [a, b, s] of CH) { const o = win(t, a, b, 0.22, 0.22); if (o > co) { co = o; ct = s; cp = pop(t, a); } }
  if (ct) setTxt(chip, ct); put(chip, W / 2, 472, co, cp);
  // 19 — title and lesson; 20 — you decide
  put(title, W / 2, 640, win(t, T.story, T.cta - 0.1, 0.4, 0.3), 0.94 + 0.06 * eo(seg(t, T.story, T.story + 0.6)));
  put(lesson, W / 2, 1180, win(t, T.borrowed19 - 0.1, T.cta - 0.15, 0.3, 0.25), pop(t, T.borrowed19 - 0.1));
  put(ctaChip, W / 2, 472, seg(t, T.would, T.would + 0.3), pop(t, T.would));
  [[T.sell, 'SELL', T.postA], [T.hold, 'HOLD', T.postB]].forEach(([t0, word, tp], i) => {
    const bx = boxes[i], n = Math.min(4, Math.floor(c01((t - t0) / 0.45) * 4.001)), typed = word.slice(0, n), caret = (n < 4 || Math.floor(t * 2.4) % 2) && t < tp ? '<i></i>' : '';
    setHTML(bx.inn, typed ? `<b>${typed}</b>${caret}` : `<em>Add a comment…</em>${caret}`); const sent = t > tp; const pc = sent ? 'post on sent' : n === 4 ? 'post on' : 'post'; if (bx.post.className !== pc) bx.post.className = pc; setTxt(bx.post, sent ? 'Posted ✓' : 'Post');
    const ts = i ? T.held + 0.1 : T.comment; put(bx.e, W / 2, 1330 + i * 132, seg(t, ts, ts + 0.3), pop(t, ts) * (1 + 0.06 * win(t, tp, tp + 0.3, 0.08, 0.2)));
  });
}

// ───────────────────────── one frame
const hopY = (hops, t, h = 0.5) => { let y = 0; for (const t0 of hops) { const u = (t - t0) / 0.38; if (u > 0 && u < 1) y = Math.max(y, Math.sin(u * Math.PI) * h); } return y; };
const _m4 = new THREE.Matrix4(), _q = new THREE.Quaternion(), _e = new THREE.Euler(), _p = new THREE.Vector3(), _s = new THREE.Vector3(), HIDE = new THREE.Matrix4().makeScale(0, 0, 0);
const arc = (a, b, u, hgt) => [lerp(a[0], b[0], u), lerp(a[1], b[1], u) + Math.sin(u * Math.PI) * hgt, lerp(a[2], b[2], u)];
const atSlot = (s, dy = 0, sc = 1) => { _q.setFromAxisAngle(YAX, s[3]); _p.set(s[0], s[1] + dy, s[2]); _s.setScalar(sc); return _m4.compose(_p, _q, _s); };
const fromPose = r => { _p.set(r[0], r[1], r[2]); _s.setScalar(1); return _m4.compose(_p, r[3], _s); };
function bar2026(b, t) {
  if (t < T.wipe2 + 0.2) { if (b.fallA && t >= b.fallA.t0) return t > T.wipe1 + 0.6 ? null : fromPose(fallPose(b.s, b.fallA, t)); return atSlot(b.s); }
  if (b.fallB && t >= b.fallB.t0) return fromPose(fallPose(b.s, b.fallB, t));
  if (b.slide && t >= b.slide.t0) return fromPose(fallPose(b.s, b.slide, t));
  return atSlot(b.s);
}
function bar80(b, t) {
  if (b.drop !== null && t < b.drop) return null;
  if (b.drop !== null && t < b.drop + 0.4) { const u = seg(t, b.drop, b.drop + 0.4); return atSlot(b.s, (1 - u * u) * 7.5); }
  if (b.fall && t >= b.fall.t0) return fromPose(fallPose(b.s, b.fall, t));
  const land = b.drop !== null && t < b.drop + 0.62 ? Math.sin(seg(t, b.drop + 0.4, b.drop + 0.62) * Math.PI) * 0.12 : 0;
  return atSlot(b.s, land);
}
function pileBar(j, t) {
  const q = PSL[j], t0 = arrT(j); if (t < t0) return null;
  _q.setFromAxisAngle(YAX, 0); _s.setScalar(PS);
  if (t < t0 + 0.35) { const u = seg(t, t0, t0 + 0.35); _p.set(q[0], q[1] + (1 - u * u) * 8, q[2]); return _m4.compose(_p, _q, _s); }
  if (j >= NP - NSOLD && t >= soldT(j)) { const u = seg(t, soldT(j), soldT(j) + 1.15); if (u >= 1) return null; const a = arc([q[0], q[1], q[2]], EXDOOR, eio(u), 9); _p.set(a[0], a[1], a[2]); _e.set(u * 2, u * 5, 0); _q.setFromEuler(_e); _s.setScalar(PS * (u > 0.85 ? (1 - u) / 0.15 : 1)); return _m4.compose(_p, _q, _s); }
  _p.set(q[0], q[1], q[2]); return _m4.compose(_p, _q, _s);
}
let inited = false;
function renderAt(t) {
  if (!inited) { for (const s of SIGNS) s.draw(); inited = true; }
  const s = skyAt(t), night = s.glow;
  paintSky(s);
  scene.fog.color.setRGB(...s.fog); scene.fog.near = s.fn; scene.fog.far = s.ff;
  hemi.color.setRGB(...s.hemS); hemi.groundColor.setRGB(...s.hemG); hemi.intensity = s.hemI;
  sun.color.setRGB(...s.sunC); sun.intensity = s.sunI;
  const az = s.az * Math.PI / 180, el = s.el * Math.PI / 180, sd = [Math.cos(el) * Math.sin(az), Math.sin(el), Math.cos(el) * Math.cos(az)];
  starM.opacity = s.star * 0.9; stars.visible = s.star > 0.01;
  setCamera(t);
  WIN_LIT.emissiveIntensity = Math.max(0, night * 1.05);
  lampM.emissiveIntensity = night * 1.4;
  // an old-photo warmth for 1979–80
  { const k = win(t, T.wipe1 + 0.45, T.wipe2 + 0.45, 0.6, 0.6); canvas.style.filter = k > 0.005 ? `sepia(${(0.36 * k).toFixed(3)}) saturate(${(1 - 0.08 * k).toFixed(3)})` : ''; }
  // the 2026 tower (hidden while the story is in 1980)
  pylon.visible = silverI.visible = !IN80(t);
  let n = 0; for (const b of SBARS) { const m = bar2026(b, t); if (m) silverI.setMatrixAt(n++, m); } for (let j = n; j < NL * 2; j++) silverI.setMatrixAt(j, HIDE); silverI.instanceMatrix.needsUpdate = true;
  silverM.emissiveIntensity = (0.32 + 0.35 * night) * (1 + 0.5 * win(t, T.record - 0.3, T.crash16, 0.4, 0.3));
  towerGlow.visible = (night > 0.05 && !IN80(t)) || (t > T.record - 0.2 && t < T.crash16 + 0.3); towerGlow.position.set(TW[0], PLH + 8, TW[2]); towerGlow.scale.setScalar(30); towerGlow.lookAt(camera.position); glowM.opacity = Math.max(0.55 * night * (t < T.crashed ? 1 : 0.6), 0.35 * win(t, T.record - 0.2, T.crash16, 0.3, 0.3));
  // the 1980 tower
  n = 0; for (const b of BARS80) { const m = bar80(b, t); if (m) tw80I.setMatrixAt(n++, m); } for (let j = n; j < NL80 * 2; j++) tw80I.setMatrixAt(j, HIDE); tw80I.instanceMatrix.needsUpdate = true;
  // the brothers' silver mountain
  n = 0; for (let j = 0; j < NP; j++) { const m = pileBar(j, t); if (m) pileI.setMatrixAt(n++, m); } for (let j = n; j < NP; j++) pileI.setMatrixAt(j, HIDE); pileI.instanceMatrix.needsUpdate = true;
  { const d = seg(t, T.lost, T.p17 + 0.6); pileM.color.setRGB(lerp(0.91, 0.55, d), lerp(0.93, 0.56, d), lerp(0.95, 0.6, d)); pileM.emissiveIntensity = lerp(0.32 + 0.3 * night, 0.02, d); }
  // the banknote shrinks and fades; a silver bar takes its place
  { const u = seg(t, T.lose - 0.1, T.value + 0.35), show = t > T.paper - 0.25 && t < T.silver4 + 0.2; bill.visible = show; bill.position.set(BR[0], 4.5 + 0.12 * Math.sin(t * 2), BR[2] - 0.4); bill.scale.setScalar(Math.max(0.001, pop(t, T.paper - 0.25) * lerp(0.8, 0.3, eo(u)))); billM.opacity = 1 - 0.55 * u;
    billM.color.setRGB(lerp(1, 0.6, u), lerp(1, 0.62, u), lerp(1, 0.58, u));
    const showOz = t > T.silver4 - 0.15 && t < T.mountains + 0.35; oz.visible = showOz; const fly = seg(t, T.mountains - 0.1, T.mountains + 0.35), q = arc([BR[0] - 0.4, 4.3, BR[2] - 0.4], PSL[NP - 1], eio(fly), 2.5);
    oz.position.set(q[0], q[1] + 0.12 * Math.sin(t * 2.4) * (1 - fly), q[2]); oz.rotation.set(0.3 * (1 - fly), t * 1.4 * (1 - fly), 0); oz.scale.setScalar(Math.max(0.001, pop(t, T.silver4 - 0.15) * lerp(0.55, PS, fly))); }
  // cash from the bank to the brothers
  for (let i = 0; i < NCASH; i++) { const t0 = CASHT[i], u = seg(t, t0, t0 + 1.0); let m = HIDE;
    if (t >= t0 && u < 1) { const q = arc(LBDOOR, [BR[0] - 2.2 - (i % 3) * 0.5, 1.6, BR[2] + 1.2], eio(u), 4); _e.set(u * 4, u * 3 + i, 0); _q.setFromEuler(_e); _p.set(q[0], q[1], q[2]); _s.setScalar(0.85 * (u > 0.8 ? (1 - u) / 0.2 : 1)); m = _m4.compose(_p, _q, _s); }
    cashI.setMatrixAt(i, m); }
  cashI.instanceMatrix.needsUpdate = true;
  // the coins: nine borrowed, one your own; the 10% fall wipes out yours
  { for (let j = 0; j < 9; j++) { const t0 = coinT(j), u = seg(t, t0, t0 + 0.25); let m = HIDE; if (t >= t0 && t < T.wipe2) { _q.setFromAxisAngle(YAX, j * 0.4); _p.set(MC[0], coinY(j) + (1 - u * u) * 2.5, MC[2]); _s.setScalar(1); m = _m4.compose(_p, _q, _s); } blueC.setMatrixAt(j, m); } blueC.instanceMatrix.needsUpdate = true;
    const t0 = coinT(9), u = seg(t, t0, t0 + 0.25), w = seg(t, T.wipes, T.wipes + 0.55); goldC.visible = t >= t0 && w < 1 && t < T.wipe2; goldC.position.set(MC[0] + w * 0.6, coinY(9) + (1 - u * u) * 2.5 + w * 2.2, MC[2]); goldC.rotation.set(w * 2.5, w * 4, w * 1.2); goldC.scale.setScalar(Math.max(0.001, 1 - w * 0.7)); goldCM.opacity = 1 - w;
    blueCM.emissiveIntensity = 0.4 + 0.5 * win(t, T.percent, T.wipes + 0.4, 0.15, 0.3); }
  // telephones ring
  const ring = (t, a, b) => (t > a && t < b && (t - a) % 0.7 < 0.42) ? Math.sin(t * 60) : 0;
  { const r1 = ring(t, T.lender, T.b12 - 0.2), r2 = ring(t, T.b12 - 0.1, T.couldnt + 0.2); phone1.userData.handset.position.y = 0.66 + Math.abs(r1) * 0.12; phone1.rotation.z = r1 * 0.04; phone2.userData.handset.position.y = 0.66 + Math.abs(r2) * 0.12; phone2.rotation.z = r2 * 0.04; }
  // the brothers: shake their heads when they can't pay; slump after the loss
  { const shake = win(t, T.couldnt - 0.1, T.pay + 0.6, 0.1, 0.2) * Math.sin(t * 14) * 0.35, slump = seg(t, T.lost, T.p17 + 0.8);
    const west = Math.max(win(t, T.bought, T.b6 + 0.4, 0.5, 0.6), win(t, T.lost - 0.6, T.wipe2 + 1, 0.6, 0.3)) * Math.PI / 2;
    bro1.rotation.y = Math.PI / 2 + west + shake; bro2.rotation.y = Math.PI / 2 + west - shake * 0.9; bro1.rotation.x = slump * 0.12; bro2.rotation.x = slump * 0.1;
  }
  broker.position.y = hopY([T.margin, T.call + 0.1], t, 0.18);
  // pumpjacks nod
  for (const j of JACKS) j.m.userData.beam.rotation.z = 0.22 * Math.sin(t * 1.6 + j.ph);
  // the boards
  drawScreen(t); drawScreen80(t);
  // 2026 traders: there at the start, scatter at the crash; back for the rhyme, scatter again
  for (const tr of TRAD) {
    let p, face, run = 0; const ph1 = t < T.wipe1 + 0.5, ph2 = t > T.wipe2 + 0.5; tr.m.visible = ph1 || ph2; if (!tr.m.visible) continue;
    const c0 = ph1 ? T.crashed : T.crash16;
    if (ph2 && t < tr.t1 + 1.7) { const u = eio(seg(t, tr.t1, tr.t1 + 1.7)); p = [lerp(tr.from[0], tr.to[0], u), 0, lerp(tr.from[2], tr.to[2], u)]; face = Math.atan2(tr.to[2] - tr.from[2], tr.to[0] - tr.from[0]); run = win(t, tr.t1, tr.t1 + 1.7, 0.1, 0.1); }
    else if (t < c0 + 0.15) { p = tr.to; face = Math.atan2(TW[2] - p[2], TW[0] - p[0]); }
    else { const u = eo(seg(t, c0 + 0.15, c0 + 2.6)); p = [lerp(tr.to[0], tr.away[0], u), 0, lerp(tr.to[2], tr.away[2], u)]; face = Math.atan2(tr.away[2] - tr.to[2], tr.away[0] - tr.to[0]); run = win(t, c0 + 0.15, c0 + 2.6, 0.1, 0.2); }
    tr.m.position.set(p[0], Math.abs(Math.sin(t * 9 + tr.ph)) * 0.18 * run + hopY([T.record + 0.05 + (tr.ph % 0.3)], t, 0.4), p[2]); tr.m.rotation.y = -face;
  }
  // 1980 traders: gather, hop at $50, scatter on Silver Thursday
  for (const tr of TR80) {
    const vis = t > T.wipe1 + 0.5 && t < T.wipe2 + 0.5; tr.m.visible = vis; if (!vis) continue;
    let p, face, run;
    if (t < T.hit) { const u = eio(seg(t, tr.t0, tr.t0 + 1.8)); p = [lerp(tr.from[0], tr.to[0], u), 0, lerp(tr.from[2], tr.to[2], u)]; face = u < 0.98 ? Math.atan2(tr.to[2] - tr.from[2], tr.to[0] - tr.from[0]) : Math.atan2(TW80[2] - p[2], TW80[0] - p[0]); run = win(t, tr.t0, tr.t0 + 1.8, 0.1, 0.1); }
    else { const u = eo(seg(t, T.hit + 0.1, T.hit + 2.6)); p = [lerp(tr.to[0], tr.away[0], u), 0, lerp(tr.to[2], tr.away[2], u)]; face = Math.atan2(tr.away[2] - tr.to[2], tr.away[0] - tr.to[0]); run = win(t, T.hit + 0.1, T.hit + 2.6, 0.1, 0.2); }
    tr.m.position.set(p[0], Math.abs(Math.sin(t * 9 + tr.ph)) * 0.18 * run + hopY([T.p50 + 0.15 + (tr.ph % 0.3)], t, 0.45), p[2]); tr.m.rotation.y = -face;
  }
  walkers.forEach((w, k) => { const ph_ = t * 0.5 + k * 1.7; w.m.position.set(w.x + Math.sin(ph_) * 1.6 * Math.cos(w.ry), Math.abs(Math.sin(t * 6 + k)) * 0.05, w.z - Math.sin(ph_) * 1.6 * Math.sin(w.ry)); });
  for (const c of CARS) { const L = 700, x = ((c.off + t * c.v) % L) - L / 2; c.m.position.set(c.dir * x, 0, c.z); c.m.rotation.y = c.dir > 0 ? 0 : Math.PI; }
  for (const c of clouds) { const cw = c.userData.win ? win(t, c.userData.win[0], c.userData.win[1], 0.4, 0.4) : 1; c.visible = cw > 0.001; c.position.x = c.userData.x0 + t * 1.2; c.material.opacity = (0.9 - 0.5 * night) * cw; const k = lerp(1, 0.45, night); c.material.color.setRGB(lerp(s.hor[0], 1, 0.55) * k, lerp(s.hor[1], 1, 0.55) * k, lerp(s.hor[2], 1, 0.55) * k * 1.05); c.material.emissive.setRGB(c.material.color.r * 0.35, c.material.color.g * 0.35, c.material.color.b * 0.35); }
  // sparkles: the tower at night, the silver bar, the mountain, the $50 top, the record again, the board at the end
  { let k = 0; const put3 = (x, y, z, sz, on) => { const sp = sparks[k++]; if (!sp) return; const tw = Math.pow(Math.abs(Math.sin(t * sp.userData.w + sp.userData.ph)), 3); sp.position.set(x, y, z); sp.scale.setScalar(sz * (0.25 + tw)); sp.material.opacity = on * (0.25 + 0.75 * tw); sp.visible = on > 0.01; };
    const s1 = Math.max(win(t, -1, T.crashed, 0.1, 0.4) * night, win(t, T.record - 0.1, T.crash16, 0.2, 0.2)); for (let i = 0; i < 12; i++) { const a = i * 2.4 + t * 0.4; put3(TW[0] + Math.cos(a) * 2.6, PLH + 2 + (i % 6) * 2.4, TW[2] + Math.sin(a) * 2.6, 0.9, s1); }
    const s2 = win(t, T.silver4 - 0.1, T.mountains + 0.2, 0.2, 0.3); for (let i = 0; i < 6; i++) { const a = i * 1.05 + t * 0.9; put3(BR[0] - 0.4 + Math.cos(a) * 1.1, 4.3 + (i % 3) * 0.3, BR[2] - 0.4 + Math.sin(a) * 1.1, 0.45, s2); }
    const s3 = win(t, T.mountains + 0.4, T.b6 + 0.2, 0.3, 0.3); for (let i = 0; i < 10; i++) { const q = PSL[(i * 7) % NP]; put3(q[0], q[1] + 0.5, q[2] + 0.4, 0.8, s3); }
    const s4 = win(t, T.p50 - 0.2, T.b8 + 0.2, 0.2, 0.3); for (let i = 0; i < 8; i++) { const a = i * 0.785 + t * 0.9; put3(TW80[0] + Math.cos(a) * 2.4, PLH + 14 + (i % 4) * 0.8, TW80[2] + Math.sin(a) * 2.4, 0.8, s4); }
    const s5 = win(t, T.postA, DUR + 1, 0.4, 0.1); for (let i = 0; i < 14; i++) { const ph_ = (t * 0.35 + i / 14) % 1, a = i * 2.4; const c = SCRW(SCR, SCR_RY); put3(c[0] + Math.cos(a) * (3 + ph_ * 4), 2 + ph_ * 12, c[2] + 4 + Math.sin(a) * (2 + ph_ * 3), 0.9 + 0.6 * (1 - ph_), s5 * Math.sin(ph_ * Math.PI)); }
    while (k < sparks.length) sparks[k++].visible = false; }
  updateBirds(t);
  dome.position.copy(camera.position); stars.position.copy(camera.position);
  orb.visible = halo.visible = s.orbS > 0.5 && s.star < 0.9;
  orb.position.set(camera.position.x + sd[0] * 1800, camera.position.y + sd[1] * 1800, camera.position.z + sd[2] * 1800); orb.scale.setScalar(s.orbS * 2); orb.lookAt(camera.position); orbM.color.setRGB(...s.orb);
  halo.position.copy(orb.position); halo.scale.setScalar(s.orbS * 13); halo.lookAt(camera.position); haloM.color.setRGB(...s.orb); haloM.opacity = 0.75;
  const S2 = Math.min(170, Math.max(18, camD * 0.85));
  sun.target.position.copy(camTg); sun.position.set(camTg.x + sd[0] * 400, camTg.y + sd[1] * 400, camTg.z + sd[2] * 400);
  const shc = sun.shadow.camera; shc.left = -S2; shc.right = S2; shc.top = S2; shc.bottom = -S2; shc.updateProjectionMatrix();
  renderer.render(scene, camera);
  updateUI(t);
}
window.camCheck = () => {
  const out = []; let cur = null;
  for (let f = 0; f < Math.ceil(DUR * 30); f++) {
    const t = f / 30; setCamera(t); const c = camera.position; let hit = null;
    for (const [x0, x1, z0, z1, y1, nm] of stat) { if (c.x > x0 - 0.9 && c.x < x1 + 0.9 && c.z > z0 - 0.9 && c.z < z1 + 0.9 && c.y < y1 + 0.9) { hit = nm + '@' + x0.toFixed(0) + ',' + z0.toFixed(0); break; } }
    if (!hit && c.y < 1.2) hit = 'ground';
    if (hit) { if (cur && cur[2] === hit && f - cur[1] <= 1) cur[1] = f; else { cur = [f, f, hit]; out.push(cur); } }
  }
  const order = CAM.slice(1).map((k, i) => k.t < CAM[i].t + 0.05 ? `ORDER key ${i + 1} at ${k.t.toFixed(2)}s is not after key ${i} at ${CAM[i].t.toFixed(2)}s` : null).filter(Boolean);
  return order.concat(out.map(([a, b, n]) => `${(a / 30).toFixed(2)}-${(b / 30).toFixed(2)}s ${n}`));
};
window.renderAt = renderAt; window.__dbg = { camera };
const r3 = x => +x.toFixed(3);
window.CUES = {
  T, DUR, sent: TIM.sentences.map(s => s.s),
  typingA: [0, 1, 2, 3].map(i => r3(T.sell + (i + 0.5) * 0.11)), typingB: [0, 1, 2, 3].map(i => r3(T.hold + (i + 0.5) * 0.11)),
  crashLandA: SBARS.filter(b => b.fallA).map(b => r3(landT(b, b.fallA))), crashLandB: SBARS.filter(b => b.fallB).map(b => r3(landT(b, b.fallB))),
  slideStart: SBARS.filter(b => b.slide && b.k === 0).map(b => r3(b.slide.t0)), slideLand: SBARS.filter(b => b.slide).map(b => r3(landT(b, b.slide))),
  drops80: BARS80.filter(b => b.drop !== null && b.k === 0).map(b => r3(b.drop + 0.4)), slide80Start: SLIDE80.filter(b => b.k === 0).map(b => r3(b.fall.t0)), slide80Land: SLIDE80.map(b => r3(landT(b, b.fall))), crash80Land: CRASH80.map(b => r3(landT(b, b.fall))),
  pileArrive: PSL.map((_, j) => r3(arrT(j) + 0.35)), pileSold: Array.from({ length: NSOLD }, (_, i) => r3(soldT(NP - 1 - i))), cash: CASHT.map(r3),
  coins: Array.from({ length: 10 }, (_, j) => r3(coinT(j) + 0.25)), ring1: [T.lender, T.b12 - 0.2].map(r3), ring2: [T.b12 - 0.1, T.couldnt + 0.2].map(r3),
  postA: r3(T.postA), postB: r3(T.postB),
};
document.fonts.ready.then(() => Promise.all(['700 64px Figtree', '900 190px Fraunces', '800 30px JBM', '700 22px Inter', '700 78px Fraunces', '800 54px Figtree', '600 34px Figtree', '500 18px Inter', '900 92px Fraunces', '800 120px JBM', '800 46px Inter', '900 150px Figtree', '900 72px Figtree', '900 58px Fraunces', '700 44px Fraunces', '900 100px Figtree'].map(f => document.fonts.load(f)))).then(() => { renderAt(0); window.__ready = true; });
