// The Silver Slide — low-poly storybook scene (deterministic: window.renderAt(t) draws the frame for time t)
import * as THREE from 'three';
import { SKIN, MAT, rng, GB, person, cloud, bushTree, tower, lamp, car, WIN_LIT, kiosk, BIGCOIN, CASH, pedestal, bank, conveyor, INGOT, solarPanel, factory, savingsJar } from './kit.js';

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
const R = rng(20261122);

// ───────────────────────── story clock (everything hangs off the narration)
const T = {
  jan: wt(1, 'January') - 0.1, y2026: wt(1, '2026') - 0.1, silver1: wt(1, 'silver') - 0.1, highest: wt(1, 'highest') - 0.1, ever: wt(1, 'ever') - 0.1,
  b2: S(2) - 0.05, later: wt(2, 'later') - 0.1, two: wt(2, 'two') - 0.1, gone2: wt(2, 'gone') - 0.1,
  b3: S(3) - 0.05, meet: wt(3, 'Meet') - 0.1, silver3: wt(3, 'silver') - 0.1, coins: wt(3, 'coins') - 0.1, solar: wt(3, 'solar') - 0.1, panels: wt(3, 'panels') - 0.1,
  b4: S(4) - 0.05, start: wt(4, 'start') - 0.1, y2025: wt(4, '2025') - 0.1, ounce4: wt(4, 'ounce') - 0.1, p30: wt(4, '$30') - 0.1,
  b5: S(5) - 0.05, factories: wt(5, 'factories') - 0.1, more5: wt(5, 'more') - 0.1, traders: wt(5, 'traders') - 0.1, piled: wt(5, 'piled') - 0.1,
  b6: S(6) - 0.05, ninth: wt(6, 'twenty-ninth') - 0.1, january6: wt(6, 'January') - 0.1, touched: wt(6, 'touched') - 0.1, record: wt(6, 'record') - 0.1, p121: wt(6, '$121') - 0.1,
  b7: S(7) - 0.05, four: wt(7, 'four') - 0.1, year7: wt(7, 'year') - 0.1,
  b8: S(8) - 0.05, next: wt(8, 'next') - 0.1, crashed: wt(8, 'crashed') - 0.1,
  b9: S(9) - 0.05, quarter: wt(9, 'quarter') - 0.1, gone9: wt(9, 'gone') - 0.1, day9: wt(9, 'day') - 0.1,
  b10: S(10) - 0.05, month: wt(10, 'month') - 0.1, slid: wt(10, 'slid') - 0.1, further: wt(10, 'further') - 0.1,
  wipe1: S(11) - 0.85, why: wt(11, 'Why') - 0.1, pays11: wt(11, 'pays') - 0.1, interest11: wt(11, 'interest') - 0.1,
  b12: S(12) - 0.05, markets: wt(12, 'markets') - 0.1, higher: wt(12, 'higher') - 0.1, rates: wt(12, 'rates') - 0.1,
  b13: S(13) - 0.05, savings: wt(13, 'savings') - 0.1, more13: wt(13, 'more') - 0.1, metal13: wt(13, 'metal') - 0.1, nothing: wt(13, 'nothing') - 0.1, shiny: wt(13, 'shiny') - 0.1,
  b14: S(14) - 0.05, stocks: wt(14, 'stocks') - 0.1, fall14: wt(14, 'fall') - 0.1, investors: wt(14, 'investors') - 0.1, sell14: wt(14, 'sell') - 0.1, cover: wt(14, 'cover') - 0.1, losses: wt(14, 'losses') - 0.1,
  wipe2: S(15) - 0.75, picture: wt(15, 'Picture') - 0.1, ounce15: wt(15, 'ounce') - 0.1, top: wt(15, 'top') - 0.1, p121b: wt(15, '$121') - 0.1,
  b16: S(16) - 0.05, nov: wt(16, 'November') - 0.1, worth16: wt(16, 'worth') - 0.1, p41: wt(16, '$41') - 0.1,
  b17: S(17) - 0.05, lowest: wt(17, 'lowest') - 0.1, year17: wt(17, 'year') - 0.1,
  b18: S(18) - 0.05, gold: wt(18, 'gold') - 0.1, safe: wt(18, 'safe') - 0.1, down18: wt(18, 'down') - 0.1, third: wt(18, 'third') - 0.1,
  b19: S(19) - 0.05, over: wt(19, 'over') - 0.1,
  b20: S(20) - 0.05, story: wt(20, 'story') - 0.15, slide: wt(20, 'slide') - 0.1, shines: wt(20, 'shines') - 0.1, fall20: wt(20, 'fall') - 0.1,
  cta: S(21) - 0.1, decide: wt(21, 'decide') - 0.1, would: wt(21, 'Would') - 0.1, sold: wt(21, 'sold') - 0.1, held: wt(21, 'held') - 0.1, comment: wt(21, 'Comment') - 0.15, sell: wt(21, 'SELL') - 0.2, hold: wt(21, 'HOLD') - 0.1,
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
  DAWN: P(0x2C3E7E, 0xD9788A, 0xFFC27A, 0xF0B48A, 0xFFB070, 2.6, 0x9AAEE6, 0x9A8466, 1.3, 0.15, 0.25, 75, 10, 0xFFD9A0, 44, 90, 620),
  MORN: P(0x4E9FDC, 0x9FD0EA, 0xFBE6BC, 0xE6E4D6, 0xFFE2B0, 3.2, 0xBFDFFF, 0x9A9A80, 1.6, 0, 0, 55, 30, 0xFFF0C8, 40, 100, 680),
  DAY: P(0x2F8FDA, 0x86C6EE, 0xEAF0EE, 0xDCE6EA, 0xFFF1D6, 3.5, 0xCFE8FF, 0x9AA088, 1.7, 0, 0, 22, 52, 0xFFF8E0, 38, 110, 720),
  GOLDEN: P(0x3C7FCB, 0xF2C58A, 0xFFD79A, 0xF6CF9A, 0xFFC878, 3.2, 0xE8D2B0, 0xA88A60, 1.5, 0, 0.12, -68, 20, 0xFFE0A0, 44, 100, 680),
  SUNSET: P(0x2E2F72, 0xE0707A, 0xFFB25E, 0xEE9A6A, 0xFF9050, 2.9, 0xB49AC8, 0x86685A, 1.45, 0.12, 0.6, -70, 11, 0xFFB060, 50, 90, 620),
  DUSK: P(0x141A4C, 0x4A3F86, 0xC06A78, 0x6A4A78, 0x93A4F4, 1.7, 0x5A62B0, 0x3A2A40, 1.2, 0.65, 0.92, -40, 36, 0xFFF4D6, 30, 80, 600),
};
// January 2026 night (the record) → a morning to meet silver → 2025 days → golden record → sunset crash → months pass → the bank street by day → evening back at the tower → night
const SKY = [[0, 'NIGHT'], [T.b3 - 0.1, 'NIGHT'], [T.b3 + 1.2, 'MORN'], [T.b4, 'DAY'], [T.b6, 'DAY'], [T.record, 'GOLDEN'], [T.crashed - 0.3, 'GOLDEN'], [T.crashed + 0.6, 'SUNSET'], [T.b10, 'DUSK'],
  [T.b10 + 0.9, 'MORN'], [T.slid + 0.3, 'DAY'], [T.further + 0.6, 'GOLDEN'], [T.wipe1 + 0.15, 'GOLDEN'], [T.wipe1 + 1.0, 'DAY'], [T.b14, 'DAY'], [T.stocks + 0.6, 'GOLDEN'], [T.wipe2 + 0.15, 'GOLDEN'], [T.wipe2 + 1.0, 'SUNSET'],
  [T.b18, 'SUNSET'], [T.b19, 'DUSK'], [T.over + 0.8, 'NIGHT'], [T.cta + 0.4, 'NIGHT'], [T.cta + 2.2, 'DUSK'], [DUR + 2, 'DUSK']];
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

// ───────────────────────── ground, roads, plazas
const ground = new THREE.Mesh(new THREE.PlaneGeometry(1400, 1400).rotateX(-Math.PI / 2), new THREE.MeshLambertMaterial({ color: 0xBFC2A8 })); ground.receiveShadow = true; scene.add(ground);
const flat = new GB();
flat.box(1400, 0.04, 8, 0x4A4E56, 0, 0.02, 40); flat.box(1400, 0.04, 8, 0x4A4E56, 0, 0.021, -40);
for (let x = -690; x < 690; x += 6) { flat.box(2.6, 0.05, 0.22, 0xF2EEE2, x, 0.045, 40); flat.box(2.6, 0.05, 0.22, 0xF2EEE2, x, 0.046, -40); }
flat.box(8, 0.04, 66, 0x4A4E56, 0, 0.022, 77);                                                    // the street from the square to the bank
flat.box(84, 0.06, 66, 0xE6DFD0, 0, 0.03, 0);                                                      // Silver Square
for (let i = 0; i < 17; i++) flat.box(84, 0.065, 0.12, 0xD6CEBC, 0, 0.034, -32 + i * 4);
flat.box(40, 0.05, 50, 0xCFC9B8, 34, 0.028, -1);                                                   // the east yard: solar panels and the factory
flat.box(70, 0.06, 60, 0xE6DFD0, 0, 0.03, 140);                                                    // the bank street
for (let i = 0; i < 15; i++) flat.box(70, 0.065, 0.12, 0xD6CEBC, 0, 0.034, 112 + i * 4);
{ const rr = rng(404); for (let i = 0; i < 60; i++) { const x = (rr() - 0.5) * 520, z = -220 + rr() * 460; if ((Math.abs(x) < 46 && z > -36 && z < 36) || (x > 12 && x < 56 && z > -28 && z < 30) || (Math.abs(x) < 38 && z > 106 && z < 174) || (Math.abs(x) < 8 && z > 36 && z < 112)) continue; flat.box(6 + rr() * 14, 0.06, 6 + rr() * 14, rr() < 0.5 ? 0x8DAE74 : 0x9DB884, x, 0.03, z); } }
const flatM = flat.mesh(); flatM.castShadow = false; scene.add(flatM);

// ───────────────────────── the silver tower: layers of two bars; each layer stands for about $5 an ounce (6 layers = $30, 24 = $121, 8 = $41)
const TW = [0, 0, 0], PLH = 0.8, BL = 2.6, BH = 0.66, BW = 1.2, NL = 24;
const plinthMesh = () => { const b = new GB(); b.box(5.4, 0.2, 5.4, 0xCFC7B6, 0, 0.1, 0); b.box(4.6, PLH, 4.6, 0xD8D0BE, 0, PLH / 2, 0); b.box(4.9, 0.14, 4.9, 0xEDE6D6, 0, PLH - 0.05, 0); return b.mesh(); };
{ const m = plinthMesh(); m.position.set(TW[0], 0, TW[2]); scene.add(m); }
stat.push([TW[0] - 2.8, TW[0] + 2.8, TW[2] - 2.8, TW[2] + 2.8, PLH + NL * BH + 0.8, 'silver tower']);
const ingotG = INGOT(BL, BH, BW);
const silverM = new THREE.MeshLambertMaterial({ color: 0xE8ECF2, emissive: 0x8C96A8, emissiveIntensity: 0.3 });
const ghostM = new THREE.MeshBasicMaterial({ color: 0xCFE0FF, transparent: true, opacity: 0.0, depthWrite: false, toneMapped: false });
const goldBarM = new THREE.MeshLambertMaterial({ color: 0xF2B21C, emissive: 0x9A6200, emissiveIntensity: 0.45 });
const silverI = new THREE.InstancedMesh(ingotG, silverM, NL * 2); silverI.castShadow = true; silverI.receiveShadow = true; silverI.frustumCulled = false; scene.add(silverI);
const ghostI = new THREE.InstancedMesh(ingotG, ghostM, NL * 2); ghostI.frustumCulled = false; ghostI.renderOrder = 3; scene.add(ghostI);
const slot = (base, i, k) => { const off = (k ? 1 : -1) * (BW / 2 + 0.03), odd = i % 2; return [base[0] + (odd ? off : 0), PLH + BH * (i + 0.5), base[2] + (odd ? 0 : off), odd ? Math.PI / 2 : 0]; };
// when each layer arrives (2025 → 29 Jan 2026), topples (30 Jan) or slides off (the months after)
const dropT = i => T.factories - 0.1 + (T.p121 - 0.45 - (T.factories - 0.1)) * Math.pow((i - 6) / 17, 0.8);
const slideT = i => T.month - 0.15 + (16 - i) * 0.27;
const _ax = new THREE.Vector3(), _qa = new THREE.Quaternion(), _qb = new THREE.Quaternion();
const YAX = new THREE.Vector3(0, 1, 0);
function mkFall(t0, base, i, k, o) {
  const a = o.dir ?? R() * Math.PI * 2, v = o.v[0] + R() * (o.v[1] - o.v[0]), vy = o.vy[0] + R() * (o.vy[1] - o.vy[0]);
  const dx = Math.cos(a), dz = Math.sin(a);
  return { t0, dx, dz, v, vy, flips: o.flips ?? (1 + Math.floor(R() * 2)), axis: [-dz, 0, dx], dyaw: (R() - 0.5) * (o.yaw ?? 2.4), push: o.push ?? 0, sd: o.sd ?? 0 };
}
const G = 24;
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
const SBARS = [];
for (let i = 0; i < NL; i++) for (let k = 0; k < 2; k++) {
  const s = slot(TW, i, k), b = { i, k, s, drop: i >= 6 ? dropT(i) + k * 0.05 : null, fall: null };
  if (i >= 17) b.fall = mkFall(T.crashed - 0.02 + (23 - i) * 0.05 + k * 0.03, TW, i, k, { v: [3.5, 7.5], vy: [2.5, 6.5] });
  else if (i >= 8) b.fall = mkFall(slideT(i) + k * 0.06, TW, i, k, { dir: (R() - 0.5) * 0.35, v: [4.2, 6.0], vy: [0.4, 1.2], flips: 1, yaw: 0.5, push: 2.2, sd: 0.32 });
  SBARS.push(b);
}
const CRASHLAND = SBARS.filter(b => b.i >= 17).map(b => { const f = b.fall, tau = (f.vy + Math.sqrt(f.vy * f.vy + 2 * G * (b.s[1] - BH / 2))) / G; return f.t0 + tau; });
const SLIDELAND = SBARS.filter(b => b.i >= 8 && b.i < 17).map(b => { const f = b.fall, tau = (f.vy + Math.sqrt(f.vy * f.vy + 2 * G * (b.s[1] - BH / 2))) / G; return f.t0 + f.sd + tau; });
// how many layers stand, and what price the board shows while they arrive
const layersAt = t => { let n = 6; for (let i = 6; i < NL; i++) if (t >= dropT(i) + 0.4) n = i + 1; return n; };

// ───────────────────────── the gold tower (rises at "even gold"; its own scale: 20 layers = its record)
const GT = [6.5, 0, -3.2], NG = 20;
const gPlinth = plinthMesh(); gPlinth.position.set(GT[0], 0, GT[2]); scene.add(gPlinth);
stat.push([GT[0] - 2.8, GT[0] + 2.8, GT[2] - 2.8, GT[2] + 2.8, PLH + NG * BH + 0.8, 'gold tower']);
const goldI = new THREE.InstancedMesh(ingotG, goldBarM, NG * 2); goldI.castShadow = true; goldI.receiveShadow = true; goldI.frustumCulled = false; scene.add(goldI);
const GBARS = [];
for (let i = 0; i < NG; i++) for (let k = 0; k < 2; k++) {
  const s = slot(GT, i, k), b = { i, k, s, rise: T.gold - 0.35 + i * 0.035, fall: null };
  if (i >= 13) b.fall = mkFall(T.third - 0.25 + (19 - i) * 0.05 + k * 0.03, GT, i, k, { dir: -0.4 + (R() - 0.5) * 2.2, v: [2.5, 5.0], vy: [2.0, 4.5] });
  GBARS.push(b);
}
const GOLDLAND = GBARS.filter(b => b.fall).map(b => { const f = b.fall, tau = (f.vy + Math.sqrt(f.vy * f.vy + 2 * G * (b.s[1] - BH / 2))) / G; return f.t0 + tau; });

// ───────────────────────── the price board (pylon screen) beside the tower
const SCR = [-14, 0, 4], SCR_RY = 0.6, SCRH = 9.5;
const pylonMesh = () => { const g = new THREE.Group(), b = new GB(); b.box(1.6, SCRH, 1.4, 0x3A4048, 0, SCRH / 2, -0.9); b.box(9.4, 7.2, 0.7, 0x23272E, 0, SCRH + 2.4, 0); b.box(9.8, 0.4, 1.0, 0x8A8F96, 0, SCRH + 6.1, 0); b.box(9.8, 0.4, 1.0, 0x8A8F96, 0, SCRH - 1.3, 0); g.add(b.mesh()); return g; };
function screenOn(group, w = 720, h = 560) { const cv = document.createElement('canvas'); cv.width = w; cv.height = h; const tx = new THREE.CanvasTexture(cv); tx.colorSpace = THREE.SRGBColorSpace; tx.anisotropy = 4; const m = new THREE.Mesh(new THREE.PlaneGeometry(8.8, 6.84), new THREE.MeshBasicMaterial({ map: tx, toneMapped: false })); m.position.set(0, SCRH + 2.4, 0.37); group.add(m); return { cv, tx }; }
const pylon = pylonMesh(); pylon.position.set(SCR[0], SCR[1], SCR[2]); pylon.rotation.y = SCR_RY; scene.add(pylon);
const scr = screenOn(pylon);
const SCRW = (base, ry, dy = 0) => { const c = Math.cos(ry), s = Math.sin(ry); return [base[0] + 0.37 * s, base[1] + SCRH + 2.4 + dy, base[2] + 0.37 * c]; };
stat.push([SCR[0] - 5, SCR[0] + 5, SCR[2] - 3.5, SCR[2] + 3.5, SCRH + 6.4, 'screen']);

// ───────────────────────── "meet silver": old coins on a pedestal, the solar yard, the factory
const CO = [8, 0, 9];
{ const p = pedestal(1.3, 1.05); p.position.set(CO[0], 0, CO[2]); scene.add(p); stat.push([CO[0] - 1.4, CO[0] + 1.4, CO[2] - 1.4, CO[2] + 1.4, 2.6, 'coins pedestal']); }
const coinSM = new THREE.MeshLambertMaterial({ color: 0xE2E6EC, emissive: 0x6A7486, emissiveIntensity: 0.35 });
const coinG = BIGCOIN(0.34, 0.1);
const OLDC = []; { const rr = rng(4747); for (const [sx, sz, n] of [[-0.45, -0.2, 7], [0.35, -0.35, 5], [0.05, 0.42, 9]]) for (let j = 0; j < n; j++) OLDC.push([CO[0] + sx + (rr() - 0.5) * 0.06, 1.3 + 0.05 + j * 0.105, CO[2] + sz + (rr() - 0.5) * 0.06, 0, rr() * 6, 0]); for (let j = 0; j < 6; j++) { const a = rr() * 6.28, r = 0.55 + rr() * 0.35; OLDC.push([CO[0] + Math.cos(a) * r, 1.3 + 0.07, CO[2] + Math.sin(a) * r, 0.12 * (rr() - 0.5), rr() * 6, 0.12 * (rr() - 0.5)]); } }
const oldCoins = new THREE.InstancedMesh(coinG, coinSM, OLDC.length); oldCoins.castShadow = true; scene.add(oldCoins);
{ const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(); OLDC.forEach((c, i) => { e.set(c[3], c[4], c[5]); q.setFromEuler(e); oldCoins.setMatrixAt(i, m4.compose(new THREE.Vector3(c[0], c[1], c[2]), q, new THREE.Vector3(1, 1, 1))); }); oldCoins.instanceMatrix.needsUpdate = true; }
const PANELS = []; for (let ix = 0; ix < 4; ix++) for (let iz = 0; iz < 4; iz++) { const m = solarPanel(3.4, 2.0); const x = 30 + ix * 5.5, z = -21 + iz * 5.2; m.position.set(x, 0, z); m.rotation.y = Math.PI; scene.add(m); PANELS.push([x, z]); stat.push([x - 1.3, x + 1.3, z - 1.9, z + 1.9, 3.0, 'panel']); }
const FA = [42, 0, 17];
const fac = factory(16, 12, 6); fac.position.set(FA[0], 0, FA[2]); fac.rotation.y = Math.PI; scene.add(fac); stat.push([FA[0] - 9, FA[0] + 9, FA[2] - 7, FA[2] + 7, 16, 'factory']);
const DOORX = FA[0] - 8.2, CVX0 = 21.5, CVL = DOORX - CVX0;
{ const cv = conveyor(CVL); cv.position.set(CVX0 + CVL / 2, 0, FA[2]); scene.add(cv); stat.push([CVX0, DOORX, FA[2] - 1, FA[2] + 1, 1.6, 'conveyor']); }
{ const b = new GB(); b.box(3.0, 1.5, 2.4, 0x9A7A52, 0, 0.75, 0); for (const y of [0.3, 0.75, 1.2]) b.box(3.1, 0.14, 2.5, 0x7A5A3A, 0, y, 0); const m = b.mesh(); m.position.set(CVX0 - 1.6, 0, FA[2]); scene.add(m); }
const NCV = 7, cvI = new THREE.InstancedMesh(ingotG, silverM, NCV); cvI.castShadow = true; cvI.frustumCulled = false; scene.add(cvI);
const puffM = new THREE.MeshLambertMaterial({ color: 0xE8E4DC, transparent: true, opacity: 0.7, depthWrite: false });
const NPUFF = 7, puffI = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, 1), puffM, NPUFF); puffI.frustumCulled = false; scene.add(puffI);
const CHIM = [FA[0] + 8 - 2.2, 6 + 9.2, FA[2] + 6 - 2.2];   // chimney top (the factory is turned to face -x)
// traders with phones: they arrive while the price climbs and scatter when it crashes
const NTR = 12, TRAD = Array.from({ length: NTR }, (_, k) => {
  const m = person({ robe: [0x34405A, 0x6A2E3E, 0x3F6A5A, 0x5A5A66, 0x7A5A3A, 0x2F6FB8][k % 6], skin: SKIN[(k + 1) % 5], short: [0x231C18, 0x5A3E28, 0xC9A27A, 0x3A2A1E, 0x8A8A8A][k % 5], shirt: k % 2 ? 0xF4F2EC : undefined, phone: true, s: 0.98 });
  const a = -1.2 + (k / (NTR - 1)) * 2.4, r = 6.0 + (k % 3) * 1.3;
  const from = [-26 + k * 4.6 + (R() - 0.5) * 2, 0, 36 + R() * 4], to = [TW[0] + Math.sin(a) * r, 0, TW[2] + Math.cos(a) * r], away = [TW[0] + Math.sin(a) * 26, 0, TW[2] + Math.cos(a) * 26];
  scene.add(m); m.visible = false; return { m, from, to, away, t0: T.traders - 0.35 + k * 0.06 + R() * 0.1, ph: R() * 6 };
});

// ───────────────────────── the bank street: savings that pay interest, a bar that pays nothing, rates, stocks, a buyer's kiosk
const BK = [0, 0, 120];
const bnk = bank(); bnk.position.set(BK[0], 0, BK[2]); scene.add(bnk); stat.push([BK[0] - 13, BK[0] + 13, BK[2] - 9, BK[2] + 11, 16, 'bank']);
const signM = (txt, bg, fg, w = 1024, h = 160, px = 100) => { const cv = document.createElement('canvas'); cv.width = w; cv.height = h; const tx = new THREE.CanvasTexture(cv); tx.colorSpace = THREE.SRGBColorSpace; const draw = () => { const g = cv.getContext('2d'); g.fillStyle = bg; g.fillRect(0, 0, w, h); g.fillStyle = fg; g.font = `900 ${px}px Figtree`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(txt, w / 2, h / 2 + 6); tx.needsUpdate = true; }; return { cv, tx, draw }; };   // drawn once the fonts are loaded
let signsDrawn = false; const SIGNS = [];
{ const s = signM('SAVINGS BANK', '#2E3A52', '#FFF6E6'); SIGNS.push(s); const m = new THREE.Mesh(new THREE.PlaneGeometry(15, 2.3), new THREE.MeshBasicMaterial({ map: s.tx, toneMapped: false })); m.position.set(BK[0], bnk.userData.signY, BK[2] + bnk.userData.signZ + 0.02); scene.add(m); }
const JAR = [5.2, 0, 142];
const jar = savingsJar(1.4, 2.8, 1.2); jar.position.set(JAR[0], 0, JAR[2]); scene.add(jar); stat.push([JAR[0] - 2, JAR[0] + 2, JAR[2] - 2, JAR[2] + 2, 4.6, 'jar']);
const NJ = 44, JFLOOR = jar.userData.floorY;
const jcoinM = new THREE.MeshLambertMaterial({ color: 0xF7B500, emissive: 0xA86A00, emissiveIntensity: 0.45 });
const jcoinG = BIGCOIN(0.36, 0.11), jcI = new THREE.InstancedMesh(jcoinG, jcoinM, NJ + 12); jcI.castShadow = true; jcI.frustumCulled = false; scene.add(jcI);
const JPRE = 12;   // coins already in the jar
const JT = []; { let t = T.why - 0.2; for (let j = 0; j < NJ; j++) { JT.push(t); t += t < T.savings ? 0.62 : 0.17; } }
const jslot = j => { const L = Math.floor(j / 5), a = (j % 5) * 1.2566 + L * 0.6; return [JAR[0] + Math.cos(a) * 0.62, JFLOOR + 0.07 + L * 0.115, JAR[2] + Math.sin(a) * 0.62, 0.15 * Math.sin(j * 1.7), j * 0.7]; };
const DOOR = [BK[0], 3.2, BK[2] + 7.4];
const SP = [-5.2, 0, 142];
{ const p = pedestal(1.3, 1.15); p.position.set(SP[0], 0, SP[2]); scene.add(p); stat.push([SP[0] - 1.6, SP[0] + 1.6, SP[2] - 1.6, SP[2] + 1.6, 2.8, 'bar pedestal']); }
const spM = new THREE.MeshLambertMaterial({ color: 0xDCE1E8, emissive: 0x6A7486, emissiveIntensity: 0.45 });
const spBar = new THREE.Mesh(ingotG, spM); spBar.castShadow = true; spBar.position.set(SP[0], 1.3 + BH / 2, SP[2]); spBar.rotation.y = 0.35; scene.add(spBar);
const RB = [19, 0, 131], RB_RY = -0.55;
const rpy = pylonMesh(); rpy.position.set(RB[0], 0, RB[2]); rpy.rotation.y = RB_RY; scene.add(rpy); const rscr = screenOn(rpy); stat.push([RB[0] - 5, RB[0] + 5, RB[2] - 3.5, RB[2] + 3.5, SCRH + 6.4, 'rate board']);
const SB = [-19, 0, 131], SB_RY = 0.55;
const spy = pylonMesh(); spy.position.set(SB[0], 0, SB[2]); spy.rotation.y = SB_RY; scene.add(spy); const sscr = screenOn(spy); stat.push([SB[0] - 5, SB[0] + 5, SB[2] - 3.5, SB[2] + 3.5, SCRH + 6.4, 'stock board']);
const KS = [-16, 0, 152];
const ksk = kiosk(); ksk.position.set(KS[0], 0, KS[2]); scene.add(ksk); stat.push([KS[0] - 2.4, KS[0] + 2.4, KS[2] - 2.4, KS[2] + 2.4, 4.4, 'kiosk']);
{ const s = signM('WE BUY SILVER', '#2F3A55', '#FFF6E6', 512, 128, 52); SIGNS.push(s); const b = new GB(); b.box(0.25, 2.2, 0.25, 0x5A5F66, KS[0] + 1.0, 4.2, KS[2] - 1.9); b.box(0.25, 2.2, 0.25, 0x5A5F66, KS[0] + 1.0, 4.2, KS[2] + 1.9); b.box(0.2, 1.3, 4.6, 0x3A3F48, KS[0] + 0.9, 5.4, KS[2]); scene.add(b.mesh()); const pl = new THREE.Mesh(new THREE.PlaneGeometry(4.3, 1.05), new THREE.MeshLambertMaterial({ map: s.tx })); pl.position.set(KS[0] + 1.02, 5.4, KS[2]); pl.rotation.y = Math.PI / 2; scene.add(pl); }
const clerk = person({ robe: 0x2F3A55, skin: SKIN[2], short: 0x2A2020, shirt: 0xF4F2EC, tie: 0xE09A2B, s: 1.0 }); clerk.position.set(KS[0] - 0.4, 0, KS[2]); scene.add(clerk);
const INV0 = [-2.5, 0, 147.5], INV1 = [KS[0] + 2.6, 0, KS[2] - 0.2];
const inv = person({ robe: 0x5A4A7A, skin: SKIN[3], short: 0x3A2A1E, shirt: 0xF4F2EC, tie: 0x2F6FB8, s: 1.0 }); scene.add(inv);
const invBar = new THREE.Mesh(ingotG, silverM); invBar.scale.setScalar(0.32); invBar.castShadow = true; scene.add(invBar);
const NCASH = 5, cashI = new THREE.InstancedMesh(CASH, MAT, NCASH); cashI.castShadow = true; cashI.frustumCulled = false; scene.add(cashI);
const CASHT = Array.from({ length: NCASH }, (_, i) => T.cover - 0.25 + i * 0.09);

// ───────────────────────── "picture one ounce": a small bar on a pedestal in front of the tower
const PED = [-6.5, 0, 10];
{ const p = pedestal(1.3, 0.95); p.position.set(PED[0], 0, PED[2]); scene.add(p); stat.push([PED[0] - 1.3, PED[0] + 1.3, PED[2] - 1.3, PED[2] + 1.3, 2.9, 'pedestal']); }
const ozM = new THREE.MeshLambertMaterial({ color: 0xDCE1E8, emissive: 0x6A7486, emissiveIntensity: 0.5 });
const oz = new THREE.Mesh(ingotG, ozM); oz.castShadow = true; oz.scale.setScalar(0.62); scene.add(oz);

// ───────────────────────── the city: towers all around (the square, the east yard, the street and the bank street stay clear)
{
  const tr = rng(2026), PALS = [[0xD9D3C6, 0x5E7F9A], [0x6D97AA, 0x3F6A80], [0xE4DED2, 0x4E7C93], [0xC9C2B4, 0x55748C], [0x8FB3C2, 0x426E86], [0xEFE9DC, 0x6A8AA4], [0xB7C4C9, 0x3E6378], [0xE8D9C0, 0x5A7A90]];
  const clear = (x, z) => (Math.abs(x) < 46 && z > -38 && z < 36) || (x > 12 && x < 58 && z > -30 && z < 32) || (Math.abs(x) < 38 && z > 100 && z < 178) || (Math.abs(x) < 12 && z > 30 && z < 110) || Math.abs(z - 40) < 8 || Math.abs(z + 40) < 8;
  for (let gx = -210; gx <= 210; gx += 22) for (let gz = -200; gz <= 260; gz += 22) {
    const x = gx + (tr() - .5) * 7, z = gz + (tr() - .5) * 7; if (clear(x, z) || tr() < 0.12) continue;
    const w = 9 + tr() * 7, d = 9 + tr() * 7, dp = Math.min(Math.hypot(x, z), Math.hypot(x, z - 140)), far = dp > 140;
    const h = (dp < 90 ? 16 + tr() * 22 : 24 + tr() * (far ? 50 : 36));
    const pal = PALS[Math.floor(tr() * PALS.length)];
    const g = tower(w, h, d, { rand: tr, color: pal[0], glass: pal[1], floor: far ? 4.2 : 3.4, litP: 0.5, crown: h > 50 && tr() < 0.5 });
    g.position.set(x, 0, z); g.rotation.y = (tr() < 0.5 ? 0 : Math.PI / 2); g.children.forEach(c => { c.castShadow = dp < 150; c.receiveShadow = true; }); scene.add(g);
    stat.push([x - Math.max(w, d) / 2, x + Math.max(w, d) / 2, z - Math.max(w, d) / 2, z + Math.max(w, d) / 2, h + 4, 'tower']);
  }
}
const lampHeads = new GB();
for (let x = -36; x <= 36; x += 12) for (const z of [33.2, -33.2]) { const l = lamp(6.2); l.position.set(x, 0, z); l.rotation.y = z > 0 ? -Math.PI / 2 : Math.PI / 2; scene.add(l); lampHeads.box(0.5, 0.08, 0.3, 0xFFFFFF, x, 5.98, z + (z > 0 ? 1.25 : -1.25)); }
for (const [x, z] of [[-30, 116], [30, 116], [-30, 164], [30, 164], [-31, 140], [31, 140]]) { const l = lamp(6.2); l.position.set(x, 0, z); l.rotation.y = x > 0 ? Math.PI : 0; scene.add(l); lampHeads.box(0.3, 0.08, 0.5, 0xFFFFFF, x + (x > 0 ? -1.25 : 1.25), 5.98, z); }
const lampM = new THREE.MeshLambertMaterial({ color: 0xFFF1C8, emissive: 0xFFD27A, emissiveIntensity: 0 }); scene.add(new THREE.Mesh(lampHeads.geo(), lampM));
const CARS = [[0xC8423A, 38, 1, 7.5, 0], [0x2F6FB8, 42, -1, 9.0, 40], [0xE9C46A, -42, 1, 6.2, 150], [0x4C9A62, -38, -1, 8.0, 230], [0xEDEDED, 38, 1, 8.6, 300], [0x7A4FA0, -42, -1, 7.0, 90]].map(([col, z, dir, v, off]) => { const m = car(col); scene.add(m); return { m, z, dir, v, off }; });
for (const [x, z] of [[-38, 22], [-38, -8], [-30, -26], [-26, 124], [26, 124], [-34, 156], [34, 156], [-40, 30], [-20, -28]]) { const m = bushTree(5.5 + R() * 2, R); m.position.set(x, 0, z); scene.add(m); }
const walkers = [[-20, 26, 0.6], [14, 27, -1.1], [-30, 14, 0.3], [-5, 158, 2.2], [12, 160, -0.6], [24, 150, 1.4]].map(([x, z, ry], k) => { const m = person({ robe: [0x34405A, 0x6A2E3E, 0x3F6A5A, 0x5A5A66, 0x7A5A3A, 0x2F6FB8][k], skin: SKIN[(k + 2) % 5], short: [0x231C18, 0x5A3E28, 0xC9A27A, 0x3A2A1E, 0x8A8A8A, 0x5A3E28][k], shirt: k % 2 ? 0xF4F2EC : undefined, s: 0.98 }); m.position.set(x, 0, z); m.rotation.y = ry; scene.add(m); return { m, x, z, ry }; });

// ───────────────────────── sky clutter: clouds, birds, sparkles
const clouds = []; for (let i = 0; i < 18; i++) { const m = cloud(R); const far = i >= 10; m.position.set(far ? -500 + R() * 1000 : -220 + i * 52 + R() * 20, 70 + R() * 40, far ? -520 + R() * 200 : -320 + R() * 300); m.scale.setScalar(2.0 + R() * 2.2); m.userData.x0 = m.position.x; scene.add(m); clouds.push(m); }
for (const [x, y, z, k] of [[20, 74, 160, 2.4], [-30, 80, 210, 2.8]]) { const m = cloud(R); m.position.set(x, y, z); m.scale.setScalar(k); m.userData.x0 = x; scene.add(m); clouds.push(m); }
const birdMat = new THREE.MeshBasicMaterial({ color: 0x2A2430, side: THREE.DoubleSide });
const wingG = new THREE.BufferGeometry(); wingG.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0.1, 1.6, 0, -0.3, 1.5, 0, 0.5], 3));
const FLOCK = [{ t0: T.b4, t1: T.b6, a: [-60, 26, 30], b: [50, 34, -20] }, { t0: T.wipe1 + 1.0, t1: T.b13 + 2, a: [-50, 30, 170], b: [50, 36, 120] }, { t0: S(15) + 0.75, t1: T.b18, a: [40, 28, 30], b: [-50, 34, -20] }];
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

// ───────────────────────── canvases: the price board, the rate board, the stock board
const F = (w, px, fam) => `${w} ${px}px ${fam}`;
const fmt = n => '$' + Math.round(n).toLocaleString('en-US');
function scrMode(t) {
  if (t < T.b2) return ['record', 0];
  if (t < T.b4 - 0.2) return ['hook', seg(t, T.two, T.gone2 + 0.3)];
  if (t < T.p121 - 0.2) return ['rise', 0];
  if (t < T.crashed - 0.1) return ['rec', 0];
  if (t < T.b10) return ['crash', seg(t, T.crashed, T.crashed + 0.5)];
  if (t < T.wipe1 + 1) return ['slide', seg(t, T.month, T.further + 0.6)];
  if (t < T.b18) return ['now', seg(t, T.lowest - 0.1, T.lowest + 0.3)];
  if (t < T.cta) return ['gold', seg(t, T.third - 0.2, T.third + 0.4)];
  return ['cta', 0];
}
let scrKey = '';
function drawScreen(t) {
  const [mode, a] = scrMode(t); let extra = '';
  if (mode === 'rise') extra = layersAt(t);
  const key = mode + Math.round(a * 40) + extra; if (key === scrKey) return; scrKey = key;
  const g = scr.cv.getContext('2d'), w = 720, h = 560;
  g.fillStyle = '#0B1020'; g.fillRect(0, 0, w, h);
  g.strokeStyle = 'rgba(255,255,255,0.07)'; g.lineWidth = 2; for (let i = 1; i < 6; i++) { g.beginPath(); g.moveTo(0, i * h / 6); g.lineTo(w, i * h / 6); g.stroke(); }
  g.textAlign = 'center'; g.textBaseline = 'middle';
  const head = s => { g.fillStyle = '#C9D6EE'; g.font = F(800, 38, 'Inter'); g.fillText(s, 360, 56); };
  const big = (s, col = '#FFFFFF', px = 130, y = 236) => { g.fillStyle = col; g.font = F(800, px, 'JBM'); g.fillText(s, 360, y); };
  const small = (s, col = 'rgba(255,255,255,0.78)', y = 350, px = 34) => { g.fillStyle = col; g.font = F(700, px, 'Inter'); g.fillText(s, 360, y); };
  const foot = s => { g.fillStyle = 'rgba(255,255,255,0.5)'; g.font = F(700, 26, 'Inter'); g.fillText(s, 360, 500); };
  if (mode === 'record' || mode === 'rec') { head('SILVER · ONE OUNCE'); big('$121', '#FFE27A'); small('RECORD · 29 JAN 2026', '#FFD27A'); foot('IN US DOLLARS'); }
  else if (mode === 'hook') { head('SILVER · ONE OUNCE'); big(a > 0.5 ? '$41' : '$121', a > 0.5 ? '#FF8A6B' : '#FFE27A'); small(a > 0.5 ? '20 NOV 2026' : '29 JAN 2026'); foot(a > 0.5 ? '≈ −66% FROM THE RECORD' : 'RECORD'); }
  else if (mode === 'rise') { const n = extra; head(n <= 6 ? 'SILVER · START OF 2025' : n >= 24 ? 'SILVER · 29 JAN 2026' : 'SILVER · 2025 → 2026'); big(n >= 24 ? '$121' : n <= 6 ? '$30' : fmt(30 + (121 - 30) * (n - 6) / 18), n >= 24 ? '#FFE27A' : '#7FD08A'); small(n >= 24 ? 'RECORD' : 'ONE OUNCE · RISING', n >= 24 ? '#FFD27A' : 'rgba(255,255,255,0.78)'); }
  else if (mode === 'crash') { head('30 JAN 2026 · ONE DAY'); big('−26%', '#FF6B5B', 140); small('MORE THAN A QUARTER', '#FFB0A0'); foot('A RECORD ONE-DAY FALL'); }
  else if (mode === 'slide') { head('FEB → NOV 2026'); g.fillStyle = '#FF8A6B'; g.font = F(900, 170, 'Figtree'); g.fillText('↓', 360, 230); small('MONTH AFTER MONTH'); }
  else if (mode === 'now') { head('SILVER · 20 NOV 2026'); big('$41', '#FF8A6B'); small(a > 0.5 ? 'LOWEST SINCE SEP 2025' : 'ONE OUNCE', a > 0.5 ? '#FFB0A0' : 'rgba(255,255,255,0.78)'); foot('RECORD WAS $121'); }
  else if (mode === 'gold') { head('GOLD · ONE OUNCE'); big(a > 0.5 ? '$3,538' : '$5,595', a > 0.5 ? '#FF8A6B' : '#FFE27A', 112); small(a > 0.5 ? '20 NOV 2026 · −37%' : 'RECORD · 29 JAN 2026', a > 0.5 ? '#FFB0A0' : '#FFD27A'); }
  else { g.font = F(900, 150, 'Figtree'); g.fillStyle = '#F7B500'; g.fillText('SELL', 360, 150); g.fillStyle = '#6FD0C0'; g.fillText('HOLD', 360, 420); g.fillStyle = '#FFFFFF'; g.font = F(800, 60, 'Inter'); g.fillText('or', 360, 285); }
  scr.tx.needsUpdate = true;
}
let boardsDrawn = false;
function drawBoards() {
  { const g = rscr.cv.getContext('2d'), w = 720, h = 560; g.fillStyle = '#0B1020'; g.fillRect(0, 0, w, h); g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillStyle = '#C9D6EE'; g.font = F(800, 38, 'Inter'); g.fillText('US INTEREST RATES', 360, 60);
    g.fillStyle = '#7FD08A'; g.font = F(900, 220, 'Figtree'); g.fillText('↑', 360, 250);
    g.fillStyle = 'rgba(255,255,255,0.8)'; g.font = F(700, 34, 'Inter'); g.fillText('A HIKE EXPECTED IN DECEMBER', 360, 420); g.fillStyle = 'rgba(255,255,255,0.5)'; g.font = F(700, 26, 'Inter'); g.fillText('MARKET ODDS · NOV 2026', 360, 490); rscr.tx.needsUpdate = true; }
  { const g = sscr.cv.getContext('2d'), w = 720, h = 560; g.fillStyle = '#0B1020'; g.fillRect(0, 0, w, h); g.textAlign = 'center'; g.textBaseline = 'middle';
    g.strokeStyle = 'rgba(255,255,255,0.07)'; g.lineWidth = 2; for (let i = 1; i < 6; i++) { g.beginPath(); g.moveTo(0, i * h / 6); g.lineTo(w, i * h / 6); g.stroke(); }
    g.fillStyle = '#C9D6EE'; g.font = F(800, 38, 'Inter'); g.fillText('STOCKS · THIS WEEK', 360, 56);
    const rr = rng(99); g.strokeStyle = '#FF6B5B'; g.lineWidth = 10; g.lineJoin = 'round'; g.lineCap = 'round'; g.beginPath(); for (let i = 0; i <= 24; i++) { const x = 60 + i * 25, y = 150 + i * 9.5 + (rr() - 0.5) * 34; if (i) g.lineTo(x, y); else g.moveTo(x, y); } g.stroke();
    g.fillStyle = '#FFB0A0'; g.font = F(700, 32, 'Inter'); g.fillText('S&P 500 · IN CORRECTION', 360, 470); sscr.tx.needsUpdate = true; }
}

// ───────────────────────── camera path (spherical keys around a target; `up` tilts the view so the subject sits lower in the frame)
const TC = y => [TW[0], y, TW[2]];
const CAM = [
  { t: 0, tg: TC(9), d: 118, az: 4, el: 34, up: 0.06 },                                                   // January night: high over the city, the silver tower glowing
  { t: T.silver1 + 0.5, tg: TC(9.0), d: 56, az: 14, el: 11, up: -0.02, mv: 1 },                             // down to the tower at its record
  { t: T.b2, tg: TC(8.6), d: 54, az: 16, el: 10, up: -0.04 },
  { t: T.gone2 + 0.3, tg: TC(8.2), d: 54, az: 10, el: 10, up: -0.06, mv: 1 },                                // two thirds turn to ghosts
  { t: T.meet + 0.55, tg: [CO[0], 1.9, CO[2]], d: 12.5, az: 28, el: 10, up: 0.02, mv: 1 },                   // meet silver: old coins
  { t: T.coins + 0.5, tg: [CO[0] + 0.2, 1.9, CO[2]], d: 12, az: 36, el: 10, up: 0.02 },
  { t: T.solar + 0.35, tg: [37, 2.4, -12], d: 30, az: -64, el: 16, up: 0.03, mv: 1 },                        // …and solar panels
  { t: T.b4 - 0.2, tg: [37, 2.4, -12], d: 32, az: -60, el: 17, up: 0.03 },
  { t: T.y2025 + 0.4, tg: TC(4.0), d: 28, az: 18, el: 11, up: 0.04, mv: 1 },                                // 2025: a short tower, $30
  { t: T.b5 - 0.1, tg: TC(4.2), d: 29, az: 22, el: 11, up: 0.04 },
  { t: T.factories + 0.45, tg: [DOORX - 3, 3.0, FA[2] - 1], d: 31, az: -52, el: 13, up: 0.03, mv: 1 },           // factories want more
  { t: T.traders - 0.25, tg: [DOORX - 4, 3.0, FA[2] - 1], d: 32, az: -46, el: 13, up: 0.03 },
  { t: T.piled + 0.3, tg: TC(5.5), d: 44, az: 14, el: 13, up: 0.02, mv: 1 },                                // traders pile in; the tower climbs
  { t: T.ninth, tg: TC(7.0), d: 50, az: 8, el: 11, up: 0.0 },
  { t: T.p121 + 0.2, tg: TC(9.2), d: 54, az: -24, el: 8, up: 0.0, mv: 1 },                                   // the record
  { t: T.b8 - 0.1, tg: TC(9.2), d: 55, az: -27, el: 9, up: 0.0 },
  { t: T.crashed + 0.6, tg: TC(7.5), d: 62, az: -40, el: 12, up: -0.04, mv: 1 },                               // the crash
  { t: T.b10 - 0.2, tg: TC(6.0), d: 54, az: -36, el: 12, up: -0.02 },
  { t: T.slid, tg: TC(5.6), d: 42, az: -28, el: 12, up: 0.05, mv: 1 },                                      // month after month, it slides
  { t: T.wipe1 - 0.3, tg: TC(5.2), d: 42, az: -32, el: 13, up: 0.12 },
  { t: T.wipe1 + 0.4, tg: TC(5.2), d: 42, az: -32, el: 13, up: 1.4, mv: 1 },                                // sky wipe: tilt up…
  { t: T.wipe1 + 0.7, tg: [0, 50, 40], d: 60, az: 12, el: 40, up: 1.4 },                                     // …travel high over the street…
  { t: T.wipe1 + 1.0, tg: [0, 50, 118], d: 60, az: 0, el: 40, up: 1.4 },
  { t: T.why + 0.75, tg: [0, 5.2, 138], d: 46, az: 0, el: 7, up: 0.08, mv: 1 },                             // …and come down at the bank street
  { t: T.interest11 + 0.1, tg: [SP[0] + 0.6, 1.9, SP[2]], d: 15, az: -6, el: 9, up: 0.02, mv: 1 },             // a bar pays nothing
  { t: T.b12 - 0.05, tg: [SP[0] + 0.6, 1.9, SP[2]], d: 15.5, az: -3, el: 9, up: 0.02 },
  { t: T.higher + 0.1, tg: SCRW(RB, RB_RY, -0.4), d: 32, az: -34, el: 4, up: -0.08, mv: 1 },                  // rates up
  { t: T.b13 - 0.05, tg: SCRW(RB, RB_RY, -0.4), d: 32, az: -32, el: 4, up: -0.08 },
  { t: T.more13 + 0.2, tg: [JAR[0] - 1.5, 2.6, JAR[2]], d: 17, az: 14, el: 9, up: 0.03, mv: 1 },           // savings pay more…
  { t: T.metal13, tg: [JAR[0] - 2.5, 2.6, JAR[2]], d: 18, az: 10, el: 9, up: 0.03 },
  { t: T.nothing + 0.2, tg: [0, 2.6, 142], d: 40, az: 0, el: 8, up: 0.02, mv: 1 },                         // …a metal that pays nothing looks less shiny
  { t: T.b14 - 0.1, tg: [-0.5, 2.6, 142], d: 41, az: -3, el: 8, up: 0.02 },
  { t: T.fall14 + 0.3, tg: SCRW(SB, SB_RY, -0.8), d: 30, az: 30, el: 5, up: 0.0, mv: 1 },                  // stocks fall
  { t: T.investors + 0.2, tg: [-13.5, 2.3, 151], d: 23, az: 52, el: 9, up: 0.02, mv: 1 },                     // an investor sells metal
  { t: T.wipe2 - 0.3, tg: [-14, 2.4, 151], d: 24, az: 58, el: 10, up: 0.12 },
  { t: T.wipe2 + 0.4, tg: [-14, 2.4, 151], d: 24, az: 58, el: 10, up: 1.3, mv: 1 },                         // sky wipe back to the tower
  { t: T.wipe2 + 0.65, tg: [0, 50, 100], d: 60, az: 20, el: 40, up: 1.3 },
  { t: T.wipe2 + 0.9, tg: [0, 50, 24], d: 60, az: -10, el: 40, up: 1.3 },
  { t: T.ounce15 + 0.3, tg: [PED[0], 2.2, PED[2]], d: 13, az: -26, el: 9, up: 0.0, mv: 1 },                  // picture one ounce
  { t: T.b16, tg: [PED[0] + 0.2, 2.3, PED[2]], d: 14, az: -20, el: 9, up: 0.0 },
  { t: T.p41 + 0.4, tg: SCRW(SCR, SCR_RY, -2.2), d: 34, az: 38, el: 6, up: 0.07, mv: 1 },                             // the tower and the board: $41
  { t: T.b18 - 0.1, tg: SCRW(SCR, SCR_RY, -2.2), d: 35, az: 33, el: 6, up: 0.07 },
  { t: T.gold + 0.5, tg: [3.25, 7.4, -1.6], d: 44, az: 6, el: 9, up: -0.04, mv: 1 },                          // even gold
  { t: T.b19 - 0.1, tg: [3.25, 7.0, -1.6], d: 45, az: 10, el: 10, up: -0.04 },
  { t: T.over + 0.7, tg: [2, 8, 0], d: 110, az: 6, el: 30, up: 0.08, mv: 3 },                              // crane up: night falls over the city
  { t: T.cta + 0.1, tg: [2, 8, 0], d: 116, az: 3, el: 30, up: 0.16 },
  { t: T.comment, tg: SCRW(SCR, SCR_RY, -1.0), d: 32, az: 42, el: 6, up: 0.03, mv: 1 },                     // the board: SELL or HOLD
  { t: DUR + 0.5, tg: SCRW(SCR, SCR_RY, -1.0), d: 29, az: 39, el: 6, up: 0.03 },
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
const chip = mk('chip', '');
const hookBoard = mk('board', '<div class="t">Silver · one ounce</div><div class="row"><b style="min-width:0;font-size:104px">$121</b><span style="font:700 60px Figtree;color:rgba(255,255,255,.6)">→</span><b class="v2" style="min-width:0;font-size:104px;color:#FF8A6B">$41</b></div><div class="d">−66% · 29 Jan → 20 Nov 2026</div>'), hookV2 = hookBoard.querySelector('.v2'), hookD = hookBoard.querySelector('.d');
const nameSilver = mk('name', '<div class="n">Silver</div><div class="r">chemical symbol Ag · element 47</div>');
const y2025El = mk('year', '2025'), y2025Sub = mk('sub', 'the start of the year');
const tag30 = mk('tag am', '<b>$30</b> an ounce');
const tagFac = mk('tag', 'factories: solar panels, electronics'), tagTrd = mk('tag', 'traders');
const recBoard = mk('board', '<div class="t">Silver · record high</div><div class="row"><b>$121</b></div><div class="d">29 Jan 2026 · an ounce</div><div class="src">in US dollars, not adjusted for inflation</div>');
const tag4 = mk('tag am', '<b>×4</b> in about a year');
const crashBoard = mk('board', '<div class="t">30 January 2026 · one day</div><div class="row"><b style="color:#FF6B5B;text-shadow:0 0 30px rgba(255,80,60,.5)">−26%</b></div><div class="d">more than a quarter, gone</div><div class="src">a record one-day fall · Bloomberg</div>');
const tag0 = mk('tag grey', 'silver · pays <b style="color:#fff">0%</b> interest');
const rateBoard = mk('board', '<div class="t">US interest rates · December</div><div class="row"><b>99%</b></div><div class="d">market odds of a hike</div><div class="src">CME FedWatch via Reuters · 20 Nov 2026</div>');
const tagSav = mk('tag am', 'savings: + interest'), tagNot = mk('tag grey', 'silver: + nothing');
const tagStk = mk('tag', 'stocks ↓ · S&P 500 in correction'), tagSel = mk('tag am', 'sell metal → cash');
const worth = mk('worth', '<div class="t">Picture · one ounce</div><div class="row"><span class="v1">$121</span><span class="arr">→</span><span class="v2">$121</span></div><div class="bar"><div class="fill"></div><div class="gone"></div></div><div class="d">−$80 · as of 20 Nov 2026</div>'), wFill = worth.querySelector('.fill'), wGone = worth.querySelector('.gone'), wD = worth.querySelector('.d'), wV2 = worth.querySelector('.v2');
const goldW = mk('worth', '<div class="t">Gold · one ounce</div><div class="row"><span class="v1">$5,595</span><span class="arr">→</span><span class="v2">$5,595</span></div><div class="bar"><div class="fill"></div><div class="gone"></div></div><div class="d">−37% · record 29 Jan → 20 Nov 2026</div>'), gFill = goldW.querySelector('.fill'), gGone = goldW.querySelector('.gone'), gD = goldW.querySelector('.d'), gV2 = goldW.querySelector('.v2');
const title = mk('title', '<div class="s">THE STORY OF</div><div class="n">The Silver\n<em>Slide</em></div>');
const lesson = mk('lesson', 'What shines\n<em>can still fall.</em>');
const ctaChip = mk('chip am', 'you decide');
const boxes = [0, 1].map(() => { const e = mk('cbox', '<span class="in"></span><span class="post">Post</span>'); return { e, inn: e.querySelector('.in'), post: e.querySelector('.post') }; });
const foot = document.getElementById('foot');
foot.textContent = 'Sources: Reuters, Bloomberg, Forbes, Euronews, Kitco, USA TODAY, Business Today, Trading Economics\nspot prices in US dollars an ounce · story as of 20 Nov 2026 · not advice';
const setTxt = (e, s) => { if (e.textContent !== s) e.textContent = s; };
const setHTML = (e, s) => { if (e._h !== s) { e._h = s; e.innerHTML = s; } };

function updateUI(t) {
  updateCaption(t);
  foot.style.opacity = (0.95 * seg(t, 0.8, 1.4) * (1 - seg(t, T.cta, T.cta + 0.3) * 0.45)).toFixed(3);
  // 1–2 — January 2026, the record; two thirds gone
  { const o = win(t, -1, T.silver1 - 0.1, 0.5, 0.3); put(yearEl, W / 2, 640, o); put(subEl, W / 2, 780, o * seg(t, 0.4, 0.9)); }
  put(recBoard, W / 2, 1360, Math.max(win(t, T.highest - 0.2, T.b2 + 0.4, 0.3, 0.25), win(t, T.record - 0.1, T.b8 - 0.1, 0.3, 0.25)), Math.max(pop(t, T.highest - 0.2) * (t < T.b3 ? 1 : 0), pop(t, T.record - 0.1)));
  { const u = seg(t, T.two, T.gone2 + 0.2); hookV2.style.opacity = u.toFixed(3); hookD.style.opacity = seg(t, T.gone2 - 0.1, T.gone2 + 0.3).toFixed(3); put(hookBoard, W / 2, 690, win(t, T.b2 + 0.4, T.b3 - 0.1, 0.3, 0.25), pop(t, T.b2 + 0.4)); }
  // 3 — meet silver
  put(nameSilver, W / 2, 700, win(t, T.silver3, T.b4 - 0.15, 0.25, 0.25), pop(t, T.silver3));
  // 4 — 2025, $30
  { const o = win(t, T.y2025 - 0.1, T.b5 - 0.1, 0.3, 0.3); put(y2025El, W / 2, 680, o, pop(t, T.y2025 - 0.1)); put(y2025Sub, W / 2, 815, o); }
  { const p = proj(TW[0], PLH + 6 * BH + 1.6, TW[2]); put(tag30, clampX(p[0], 220), clampY(p[1] - 30, 620, 1000), p[2] ? win(t, T.p30 - 0.1, T.b5 - 0.1, 0.2, 0.25) : 0, pop(t, T.p30 - 0.1)); }
  // 5 — factories, traders
  { const p = proj(DOORX + 1, 9.5, FA[2]); put(tagFac, clampX(p[0], 300), clampY(p[1] - 20, 620, 1100), p[2] ? win(t, T.factories, T.traders - 0.2, 0.2, 0.25) : 0, pop(t, T.factories)); }
  { const p = proj(TW[0], 2.8, TW[2] + 7.5); put(tagTrd, clampX(p[0], 200), clampY(p[1] + 60, 620, 1350), p[2] ? win(t, T.traders + 0.3, T.b6 + 0.4, 0.2, 0.25) : 0, pop(t, T.traders + 0.3)); }
  // 7 — four times
  { const p = proj(TW[0], PLH + NL * BH + 1.6, TW[2]); put(tag4, clampX(p[0], 220), clampY(p[1] - 30, 600, 1000), p[2] ? win(t, T.four - 0.1, T.b8 - 0.1, 0.2, 0.25) : 0, pop(t, T.four - 0.1)); }
  // 8–9 — the crash
  put(crashBoard, W / 2, 1380, win(t, T.quarter - 0.2, T.b10 - 0.05, 0.25, 0.25), pop(t, T.quarter - 0.2));
  // chips
  let ct = '', co = 0, cp = 0;
  const CH = [[T.jan, T.b2 - 0.2, 'January 2026'], [T.b2 + 0.05, T.b3 - 0.15, 'ten months later'], [T.b3 + 0.05, T.b4 - 0.15, 'meet the metal'], [T.b4 + 0.05, T.b5 - 0.15, 'January 2025'],
    [T.b5 + 0.05, T.b6 - 0.15, '2025 → January 2026'], [T.b6 + 0.05, T.b8 - 0.15, '29 January 2026'], [T.b8 + 0.05, T.b10 - 0.15, '30 January 2026'], [T.b10 + 0.05, T.wipe1 + 0.2, 'February → November 2026'],
    [T.wipe1 + 0.9, T.b12 - 0.15, 'why it kept falling'], [T.b12 + 0.05, T.b14 - 0.15, 'November 2026 · USA'], [T.b14 + 0.05, T.wipe2 + 0.2, 'the week to 20 Nov 2026'],
    [T.wipe2 + 0.9, T.b16 - 0.15, 'picture · one ounce'], [T.b16 + 0.05, T.b18 - 0.15, 'as of 20 Nov 2026'], [T.b18 + 0.05, T.b19 - 0.15, 'gold · 29 Jan → 20 Nov 2026'], [T.b19 + 0.05, T.b20 - 0.1, 'as of 20 Nov 2026']];
  for (const [a, b, s] of CH) { const o = win(t, a, b, 0.22, 0.22); if (o > co) { co = o; ct = s; cp = pop(t, a); } }
  if (ct) setTxt(chip, ct); put(chip, W / 2, 472, co, cp);
  // 11–13 — no interest; rates; savings vs nothing
  { const p = proj(SP[0], 3.2, SP[2]); put(tag0, clampX(p[0], 230), clampY(p[1] - 40, 600, 1200), p[2] ? win(t, T.pays11, T.b12 + 0.3, 0.2, 0.25) : 0, pop(t, T.pays11)); }
  put(rateBoard, W / 2, 1360, win(t, T.higher - 0.1, T.b13 + 0.2, 0.25, 0.25), pop(t, T.higher - 0.1));
  { const p = proj(JAR[0], 5.4, JAR[2]); put(tagSav, clampX(p[0], 200), clampY(p[1] - 30, 600, 1200), p[2] ? win(t, T.savings - 0.1, T.b14 - 0.1, 0.2, 0.25) : 0, pop(t, T.savings - 0.1)); }
  { const p = proj(SP[0], 3.0, SP[2]); put(tagNot, clampX(p[0], 200), clampY(p[1] - 30, 600, 1200), p[2] ? win(t, T.nothing - 0.1, T.b14 - 0.1, 0.2, 0.25) : 0, pop(t, T.nothing - 0.1)); }
  // 14 — stocks fall; sell metal
  { const p = proj(SB[0], SCRH - 2.2, SB[2]); put(tagStk, clampX(p[0], 300), clampY(p[1] + 40, 620, 1300), p[2] ? win(t, T.stocks, T.investors + 0.1, 0.2, 0.25) : 0, pop(t, T.stocks)); }
  { const p = proj(KS[0] + 1.5, 6.6, KS[2]); put(tagSel, clampX(p[0], 220), clampY(p[1] - 30, 620, 1200), p[2] ? win(t, T.sell14 - 0.1, T.wipe2 - 0.45, 0.2, 0.2) : 0, pop(t, T.sell14 - 0.1)); }
  // 15–16 — picture one ounce: $121 → $41
  { const u = eo(seg(t, T.worth16 - 0.1, T.p41 + 0.4)), f = lerp(1, 41 / 121, u); wFill.style.width = (560 * f).toFixed(0) + 'px'; wGone.style.width = (560 * (1 - f)).toFixed(0) + 'px'; setTxt(wV2, u > 0.5 ? '$41' : '$121'); wV2.style.color = u > 0.5 ? '#FF8A6B' : ''; wD.style.opacity = seg(t, T.p41 + 0.2, T.p41 + 0.5).toFixed(3); put(worth, W / 2, 1370, win(t, T.ounce15 - 0.1, T.b17 + 0.1, 0.25, 0.25), pop(t, T.ounce15 - 0.1)); }
  // 17 — lowest in more than a year
  // 18 — gold down more than a third
  { const u = eo(seg(t, T.down18 - 0.1, T.third + 0.4)), f = lerp(1, 3538 / 5595, u); gFill.style.width = (560 * f).toFixed(0) + 'px'; gGone.style.width = (560 * (1 - f)).toFixed(0) + 'px'; setTxt(gV2, u > 0.5 ? '$3,538' : '$5,595'); gV2.style.color = u > 0.5 ? '#FF8A6B' : ''; gD.style.opacity = seg(t, T.third + 0.1, T.third + 0.4).toFixed(3); put(goldW, W / 2, 1380, win(t, T.gold + 0.2, T.b19 + 0.2, 0.25, 0.25), pop(t, T.gold + 0.2)); }
  // 20 — title and lesson; 21 — you decide
  put(title, W / 2, 640, win(t, T.story, T.cta - 0.1, 0.4, 0.3), 0.94 + 0.06 * eo(seg(t, T.story, T.story + 0.6)));
  put(lesson, W / 2, 1180, win(t, T.shines - 0.1, T.cta - 0.15, 0.3, 0.25), pop(t, T.shines - 0.1));
  put(ctaChip, W / 2, 472, seg(t, T.decide, T.decide + 0.3), pop(t, T.decide));
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
const REWIND = [T.y2025 - 0.75, T.y2025 - 0.2];
function silverBar(b, t) {   // returns [matrix, ghost?] or null
  const { i, s } = b;
  if (i >= 6 && t >= REWIND[0] && (b.drop === null || t < b.drop)) {   // rewind to 2025: the upper layers lift away; later they fall back on, one by one
    if (t < REWIND[1] + 0.3) { const u = seg(t, REWIND[0] + (23 - i) * 0.012, REWIND[1]); if (u >= 1) return null; return [atSlot(s, eo(u) * 2.5, 1 - u), i >= 8]; }
    return null;
  }
  if (i >= 6 && t >= b.drop && t < b.drop + 0.4) { const u = seg(t, b.drop, b.drop + 0.4); return [atSlot(s, (1 - u * u) * 7.5), false]; }
  if (b.fall && t >= b.fall.t0) { if (t > T.wipe1 + 0.6) return null; const r = fallPose(s, b.fall, t); _p.set(r[0], r[1], r[2]); _s.setScalar(1); return [_m4.compose(_p, r[3], _s), false]; }
  const ghost = i >= 8 && t >= T.two + 0.15 && t < REWIND[1];
  const land = i >= 6 && b.drop !== null && t >= b.drop + 0.4 && t < b.drop + 0.62 ? Math.sin(seg(t, b.drop + 0.4, b.drop + 0.62) * Math.PI) * 0.12 : 0;
  return [atSlot(s, land), ghost];
}
function goldBar(b, t) {
  const { i, s } = b; if (t < b.rise) return null;
  if (t < b.rise + 0.3) { const u = seg(t, b.rise, b.rise + 0.3); return atSlot(s, -(1 - eo(u)) * 0.6, 0.2 + 0.8 * eo(u)); }
  if (b.fall && t >= b.fall.t0) { const r = fallPose(s, b.fall, t); _p.set(r[0], r[1], r[2]); _s.setScalar(1); return _m4.compose(_p, r[3], _s); }
  return atSlot(s);
}
let inited = false;
function renderAt(t) {
  if (!inited) { drawBoards(); for (const s of SIGNS) s.draw(); inited = true; }
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
  // the silver tower (solid and ghost layers)
  let ns = 0, ng = 0;
  for (const b of SBARS) { const r = silverBar(b, t); if (!r) continue; if (r[1]) ghostI.setMatrixAt(ng++, r[0]); else silverI.setMatrixAt(ns++, r[0]); }
  for (let j = ns; j < NL * 2; j++) silverI.setMatrixAt(j, HIDE); for (let j = ng; j < NL * 2; j++) ghostI.setMatrixAt(j, HIDE);
  silverI.instanceMatrix.needsUpdate = true; ghostI.instanceMatrix.needsUpdate = true;
  ghostM.opacity = 0.2 * seg(t, T.two, T.two + 0.4) * (1 - seg(t, REWIND[0], REWIND[1]));
  const shine = (0.32 + 0.35 * night) * (t > T.crashed && t < T.wipe2 ? 0.75 : 1) * (1 + 0.6 * win(t, T.record - 0.3, T.crashed, 0.4, 0.3));
  silverM.emissiveIntensity = shine;
  towerGlow.visible = night > 0.05 || (t > T.record - 0.2 && t < T.crashed + 0.3); towerGlow.position.set(TW[0], PLH + 8, TW[2]); towerGlow.scale.setScalar(30); towerGlow.lookAt(camera.position); glowM.opacity = Math.max(0.55 * night * (t < T.b3 ? 1 : 0.6), 0.35 * win(t, T.record - 0.2, T.crashed, 0.3, 0.3));
  // the gold tower
  let n2 = 0; for (const b of GBARS) { const m = goldBar(b, t); if (m) goldI.setMatrixAt(n2++, m); } for (let j = n2; j < NG * 2; j++) goldI.setMatrixAt(j, HIDE); goldI.instanceMatrix.needsUpdate = true;
  gPlinth.visible = t > T.gold - 0.6; gPlinth.scale.setScalar(Math.max(0.001, eo(seg(t, T.gold - 0.6, T.gold - 0.3))));
  goldBarM.emissiveIntensity = 0.4 + 0.35 * night;
  // the conveyor into the factory, smoke from the chimney
  { const on = t > T.b5 - 1.2 && t < T.b7; for (let j = 0; j < NCV; j++) { if (!on) { cvI.setMatrixAt(j, HIDE); continue; } const x = CVX0 + ((t * 2.0 + j * (CVL / NCV)) % CVL); _q.setFromAxisAngle(YAX, Math.PI / 2); _p.set(x, 1.08 + 0.66 * 0.42 / 2, FA[2]); _s.setScalar(x > DOORX - 0.6 ? Math.max(0.001, (DOORX - x) / 0.6) * 0.42 : 0.42); cvI.setMatrixAt(j, _m4.compose(_p, _q, _s)); } cvI.instanceMatrix.needsUpdate = true; }
  for (let j = 0; j < NPUFF; j++) { const ph = (t * 0.22 + j / NPUFF) % 1; _p.set(CHIM[0] + ph * 4, CHIM[1] + ph * 9, CHIM[2] - ph * 2); _q.identity(); _s.setScalar(0.6 + ph * 2.2); puffI.setMatrixAt(j, _m4.compose(_p, _q, _s)); } puffI.instanceMatrix.needsUpdate = true; puffM.opacity = 0.55;
  // traders: run in, hop at the record, scatter at the crash
  for (const tr of TRAD) {
    const vis = t > T.b5 && t < T.wipe1 + 0.5; tr.m.visible = vis; if (!vis) continue;
    let p, face;
    if (t < T.crashed) { const u = eio(seg(t, tr.t0, tr.t0 + 1.7)); p = [lerp(tr.from[0], tr.to[0], u), 0, lerp(tr.from[2], tr.to[2], u)]; face = u < 0.98 ? Math.atan2(tr.to[2] - tr.from[2], tr.to[0] - tr.from[0]) : Math.atan2(TW[2] - p[2], TW[0] - p[0]); }
    else { const u = eo(seg(t, T.crashed + 0.15, T.crashed + 2.6)); p = [lerp(tr.to[0], tr.away[0], u), 0, lerp(tr.to[2], tr.away[2], u)]; face = Math.atan2(tr.away[2] - tr.to[2], tr.away[0] - tr.to[0]); }
    const run = t < T.crashed ? win(t, tr.t0, tr.t0 + 1.7, 0.1, 0.1) : win(t, T.crashed + 0.15, T.crashed + 2.6, 0.1, 0.2);
    tr.m.position.set(p[0], Math.abs(Math.sin(t * 9 + tr.ph)) * 0.18 * run + hopY([T.p121 + 0.1 + (tr.ph % 0.3), T.record + 0.05], t, 0.45), p[2]); tr.m.rotation.y = -face;
  }
  // the bank street: interest coins fly into the jar; the bar dims; the investor sells a bar; cash goes to cover losses
  { for (let j = 0; j < JPRE; j++) { const q = jslot(j); _e.set(q[3], q[4], 0); _q.setFromEuler(_e); _p.set(q[0], q[1], q[2]); _s.setScalar(1); jcI.setMatrixAt(j, _m4.compose(_p, _q, _s)); }
    for (let j = 0; j < NJ; j++) { const t0 = JT[j], u = seg(t, t0, t0 + 0.8), q = jslot(JPRE + j); let m = HIDE;
      if (t >= t0 && u < 1) { const a = arc(DOOR, [JAR[0], JFLOOR + 3.3, JAR[2]], eio(Math.min(1, u / 0.85)), 3.2), y = u > 0.85 ? lerp(JFLOOR + 3.3, q[1], seg(u, 0.85, 1)) : a[1]; _e.set(u * 7, u * 3, 0); _q.setFromEuler(_e); _p.set(u > 0.85 ? q[0] : a[0], y, u > 0.85 ? q[2] : a[2]); _s.setScalar(1); m = _m4.compose(_p, _q, _s); }
      else if (t >= t0 + 0.8) { _e.set(q[3], q[4], 0); _q.setFromEuler(_e); _p.set(q[0], q[1], q[2]); _s.setScalar(1); m = _m4.compose(_p, _q, _s); }
      jcI.setMatrixAt(JPRE + j, m); }
    jcI.instanceMatrix.needsUpdate = true; }
  spM.emissiveIntensity = lerp(0.45 + 0.2 * night, 0.03, seg(t, T.nothing, T.shiny + 0.4)); spM.color.setRGB(lerp(0.86, 0.62, seg(t, T.nothing, T.shiny + 0.4)), lerp(0.88, 0.63, seg(t, T.nothing, T.shiny + 0.4)), lerp(0.91, 0.66, seg(t, T.nothing, T.shiny + 0.4)));
  spBar.rotation.y = 0.35 + 0.15 * Math.sin(t * 0.6);
  { const u = eio(seg(t, T.stocks - 0.2, T.sell14 - 0.15)), walk = win(t, T.stocks - 0.2, T.sell14 - 0.15, 0.1, 0.1); inv.position.set(lerp(INV0[0], INV1[0], u), Math.abs(Math.sin(t * 8)) * 0.1 * walk + hopY([T.losses + 0.2], t, 0.2), lerp(INV0[2], INV1[2], u)); inv.rotation.y = -Math.atan2(INV1[2] - INV0[2], INV1[0] - INV0[0]) + (u >= 1 ? 0 : 0);
    const hand = [inv.position.x + Math.cos(-inv.rotation.y) * 0.45, 1.05 + inv.position.y, inv.position.z + Math.sin(-inv.rotation.y) * 0.45];
    const ub = seg(t, T.sell14, T.sell14 + 0.6); invBar.visible = ub < 1 && t > T.wipe1; const q = ub > 0 ? arc(hand, [KS[0] + 0.9, 1.3, KS[2]], eio(ub), 1.6) : hand; invBar.position.set(q[0], q[1], q[2]); invBar.rotation.set(0, -inv.rotation.y + ub * 3, ub * 2); }
  for (let i = 0; i < NCASH; i++) { const t0 = CASHT[i], u1 = seg(t, t0, t0 + 0.55), u2 = seg(t, T.losses + 0.15 + i * 0.07, T.losses + 1.15 + i * 0.07); let m = HIDE;
    if (t >= t0 && u2 < 1) { const a = [KS[0] + 1.2, 1.4, KS[2] + (i - 2) * 0.2], b = [inv.position.x + 0.3, 1.6 + i * 0.08, inv.position.z], c = SCRW(SB, SB_RY, -2.5), q = u2 > 0 ? arc(b, c, eio(u2), 4) : arc(a, b, eio(u1), 1.2); _e.set(u1 * 3 + u2 * 6, u2 * 4 + i, 0); _q.setFromEuler(_e); _p.set(q[0], q[1], q[2]); _s.setScalar(0.8 * (u2 > 0.85 ? (1 - u2) / 0.15 : 1)); m = _m4.compose(_p, _q, _s); }
    cashI.setMatrixAt(i, m); }
  cashI.instanceMatrix.needsUpdate = true;
  clerk.position.y = hopY([T.sell14 + 0.6], t, 0.2);
  // one ounce on its pedestal (only while the story looks at it)
  { const show = t > T.wipe2 && t < T.b19; oz.visible = show; oz.position.set(PED[0], 1.3 + 0.66 * 0.62 / 2 + 0.25 + 0.06 * Math.sin(t * 2), PED[2]); oz.rotation.set(0, t * 0.6, 0); ozM.emissiveIntensity = lerp(0.55, 0.2, seg(t, T.worth16, T.p41 + 0.4)) + 0.2 * night; }
  // boards
  drawScreen(t);
  walkers.forEach((w, k) => { const ph_ = t * 0.5 + k * 1.7; w.m.position.set(w.x + Math.sin(ph_) * 1.6 * Math.cos(w.ry), Math.abs(Math.sin(t * 6 + k)) * 0.05, w.z - Math.sin(ph_) * 1.6 * Math.sin(w.ry)); });
  for (const c of CARS) { const L = 700, x = ((c.off + t * c.v) % L) - L / 2; c.m.position.set(c.dir * x, 0, c.z); c.m.rotation.y = c.dir > 0 ? 0 : Math.PI; }
  for (const c of clouds) { const cw = c.userData.win ? win(t, c.userData.win[0], c.userData.win[1], 0.4, 0.4) : 1; c.visible = cw > 0.001; c.position.x = c.userData.x0 + t * 1.2; c.material.opacity = (0.9 - 0.5 * night) * cw; const k = lerp(1, 0.45, night); c.material.color.setRGB(lerp(s.hor[0], 1, 0.55) * k, lerp(s.hor[1], 1, 0.55) * k, lerp(s.hor[2], 1, 0.55) * k * 1.05); c.material.emissive.setRGB(c.material.color.r * 0.35, c.material.color.g * 0.35, c.material.color.b * 0.35); }
  // sparkles: the record tower at night, the old coins, the solar panels, the record, the bar before it dulls, the board at the end
  { let k = 0; const put3 = (x, y, z, sz, on) => { const sp = sparks[k++]; if (!sp) return; const tw = Math.pow(Math.abs(Math.sin(t * sp.userData.w + sp.userData.ph)), 3); sp.position.set(x, y, z); sp.scale.setScalar(sz * (0.25 + tw)); sp.material.opacity = on * (0.25 + 0.75 * tw); sp.visible = on > 0.01; };
    const s1 = Math.max(win(t, -1, T.b2 + 0.5, 0.1, 0.5) * night, win(t, T.p121 - 0.1, T.crashed, 0.2, 0.2)); for (let i = 0; i < 12; i++) { const a = i * 2.4 + t * 0.4; put3(TW[0] + Math.cos(a) * 2.6, PLH + 2 + (i % 6) * 2.4, TW[2] + Math.sin(a) * 2.6, 0.9, s1); }
    const s2 = win(t, T.coins - 0.2, T.solar + 0.2, 0.2, 0.3); for (let i = 0; i < 6; i++) { const a = i * 1.05 + t * 0.9; put3(CO[0] + Math.cos(a) * 0.9, 1.6 + (i % 3) * 0.35, CO[2] + Math.sin(a) * 0.9, 0.5, s2); }
    const s3 = win(t, T.solar, T.b4 + 0.3, 0.2, 0.3); for (let i = 0; i < 8; i++) { const P_ = PANELS[(i * 5) % PANELS.length]; put3(P_[0] - 0.6, 2.4, P_[1] + 0.4 * Math.sin(i), 1.1, s3); }
    const s4 = win(t, T.wipe1 + 0.8, T.nothing + 0.1, 0.3, 0.4); for (let i = 0; i < 8; i++) { const a = i * 0.785 + t * 0.9; put3(SP[0] + Math.cos(a) * 1.5, 1.7 + (i % 4) * 0.3, SP[2] + Math.sin(a) * 1.1, 0.5, s4); }
    const s5 = win(t, T.postA, DUR + 1, 0.4, 0.1); for (let i = 0; i < 16; i++) { const ph_ = (t * 0.35 + i / 16) % 1, a = i * 2.4; const c = SCRW(SCR, SCR_RY); put3(c[0] + Math.cos(a) * (3 + ph_ * 4), 2 + ph_ * 12, c[2] + 4 + Math.sin(a) * (2 + ph_ * 3), 0.9 + 0.6 * (1 - ph_), s5 * Math.sin(ph_ * Math.PI)); }
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
window.CUES = {
  T, DUR, sent: TIM.sentences.map(s => s.s),
  typingA: [0, 1, 2, 3].map(i => +(T.sell + (i + 0.5) * 0.11).toFixed(3)), typingB: [0, 1, 2, 3].map(i => +(T.hold + (i + 0.5) * 0.11).toFixed(3)),
  drops: Array.from({ length: NL - 6 }, (_, j) => +(dropT(j + 6) + 0.4).toFixed(3)),
  crashLand: CRASHLAND.map(x => +x.toFixed(3)), slideStart: Array.from({ length: 9 }, (_, j) => +slideT(16 - j).toFixed(3)), slideLand: SLIDELAND.map(x => +x.toFixed(3)),
  goldRise: GBARS.filter(b => b.k === 0).map(b => +b.rise.toFixed(3)), goldLand: GOLDLAND.map(x => +x.toFixed(3)),
  jar: JT.map(x => +(x + 0.8).toFixed(3)), cash: CASHT.map(x => +x.toFixed(3)), rewind: REWIND.map(x => +x.toFixed(3)),
  postA: +T.postA.toFixed(3), postB: +T.postB.toFixed(3),
};
document.fonts.ready.then(() => Promise.all(['700 64px Figtree', '900 190px Fraunces', '800 30px JBM', '700 22px Inter', '700 78px Fraunces', '800 54px Figtree', '600 34px Figtree', '500 18px Inter', '900 92px Fraunces', '800 120px JBM', '800 46px Inter', '900 150px Figtree', '900 72px Figtree', '900 58px Fraunces', '700 44px Fraunces', '900 100px Figtree'].map(f => document.fonts.load(f)))).then(() => { renderAt(0); window.__ready = true; });
