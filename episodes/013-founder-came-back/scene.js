// The Day the Founder Came Back — low-poly storybook scene (deterministic: window.renderAt(t) draws the frame for time t)
// Mon 23 Nov 2026: Nvidia's board votes Jensen Huang back in as CEO; the stock jumps 31.5% ($125.53 → $165.05), about $954 billion,
// more than double the old one-day record. The giant tower's height is the share price (11 Nov close $173.73 = full height).
// Even after the record day it is still about 5% short of where it stood before he quit: a fall needs a bigger rise to undo it.
import * as THREE from 'three';
import { SKIN, MAT, rng, GB, person, cloud, bushTree, tower, car, lamp, CHIP, WIN_LIT, GLASS_M, boardTable, hand, pavilion } from './kit.js';

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
const R = rng(20261124);

// ───────────────────────── story clock (everything hangs off the narration)
const T = {
  hookEnd: TIM.big ? 1.5 : TIM.hook ? E(1) + 0.15 : 0,  // the hook card (script.py HOOK): 0-1.5 s when there is a big number, else until the hook sentence ends
  bigIn: TIM.big ? 1.5 : 0, bigOut: TIM.big ? 3.0 : 0,   // the big number (script.py BIG): 1.5-3 s (Keith, 22 Nov 2026)
  trillion: wt(1, 'trillion') - 0.1, day1: wt(1, 'day') - 0.1, founder1: wt(1, 'founder') - 0.1, back1: wt(1, 'back') - 0.1,
  b2: S(2) - 0.05, double: wt(2, 'double') - 0.1, record2: wt(2, 'record') - 0.1, company: wt(2, 'company') - 0.1,
  b3: S(3) - 0.05, how: wt(3, 'how') - 0.1, one3: wt(3, 'one') - 0.1, man: wt(3, 'man') - 0.1, worth: wt(3, 'worth') - 0.1, much: wt(3, 'much') - 0.1,
  b4: S(4) - 0.05, jensen: wt(4, 'Jensen') - 0.1, cofounded: wt(4, 'co-founded') - 0.1, y33: wt(4, '33') - 0.1, ago: wt(4, 'ago') - 0.1,
  b5: S(5) - 0.05, month: wt(5, 'month') - 0.1, quit5: wt(5, 'quit') - 0.1,
  b6: S(6) - 0.05, gone: wt(6, 'gone') - 0.1, fell: wt(6, 'fell') - 0.1, quarter: wt(6, 'quarter') - 0.1,
  b7: S(7) - 0.05, monday: wt(7, 'Monday') - 0.1, board: wt(7, 'board') - 0.1, voted: wt(7, 'voted') - 0.1, back7: wt(7, 'back') - 0.1, in7: wt(7, 'in') - 0.1,
  b8: S(8) - 0.05, jumped: wt(8, 'jumped') - 0.1, third: wt(8, 'third') - 0.1,
  b9: S(9) - 0.05, chips: wt(9, 'chips') - 0.1, same2: wt(9, 'Same', 1) - 0.1, forecast: wt(9, 'forecast') - 0.1, just: wt(9, 'Just') - 0.1, vote: wt(9, 'vote') - 0.1,
  b10: S(10) - 0.05, price10: wt(10, 'price') - 0.1, guess: wt(10, 'guess') - 0.1, future: wt(10, 'future') - 0.1, investors: wt(10, 'investors') - 0.1, people: wt(10, 'people') - 0.1, too: wt(10, 'too') - 0.1,
  b11: S(11) - 0.05, twist: wt(11, 'twist') - 0.1, even11: wt(11, 'even') - 0.1, record11: wt(11, 'record') - 0.1, costs: wt(11, 'costs') - 0.1, less: wt(11, 'less') - 0.1, before: wt(11, 'before') - 0.1, quit11: wt(11, 'quit') - 0.1,
  b12: S(12) - 0.05, fall12: wt(12, 'fall') - 0.1, bigger: wt(12, 'bigger') - 0.1, rise: wt(12, 'rise') - 0.1, undo12: wt(12, 'undo') - 0.1,
  b13: S(13) - 0.05, over: wt(13, 'over') - 0.1,
  b14: S(14) - 0.05, story: wt(14, 'story') - 0.15, founder14: wt(14, 'founder') - 0.1, even14: wt(14, 'even') - 0.1, record14: wt(14, 'record') - 0.1, undo14: wt(14, 'undo') - 0.1,
  cta: S(15) - 0.1, would: wt(15, 'Would') - 0.1, sold: wt(15, 'sold') - 0.1, held: wt(15, 'held') - 0.1, comment: wt(15, 'Comment') - 0.15, sell: wt(15, 'SELL') - 0.2, hold: wt(15, 'HOLD') - 0.1,
};
T.riseA = [T.bigIn + 0.1, T.founder1 + 0.6];                 // flash-forward: Monday's jump, under the big number
T.rewind = [T.b4 + 0.1, T.b4 + 1.7];                         // back to before he quit (the camera is at the door; the top is out of frame)
T.walkOut = [T.quit5 - 0.25, T.quarter + 0.2];               // he leaves through the plaza
T.sink = [T.gone - 0.05, T.quarter + 0.45];                  // more than a quarter lower (−27.7%)
T.hands = i => T.voted + 0.02 + i * 0.07;                    // the board's hands, one after another (unanimous)
T.walkIn = [T.b7 + 0.2, T.in7 + 0.65];                       // he walks back to the doors
T.riseB = [T.jumped - 0.12, T.third + 0.45];                 // almost a third higher (+31.5%)
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
  DAWN: P(0x2C3E7E, 0xD9788A, 0xFFC27A, 0xF0B48A, 0xFFB070, 2.7, 0x9AAEE6, 0x8A7460, 1.3, 0.15, 0.25, 70, 9, 0xFFD9A0, 44, 90, 620),
  MORN: P(0x4E9FDC, 0x9FD0EA, 0xFBE6BC, 0xE6E4D6, 0xFFE2B0, 3.2, 0xBFDFFF, 0x9A9A80, 1.6, 0, 0, 55, 30, 0xFFF0C8, 40, 100, 680),
  DAY: P(0x2F8FDA, 0x86C6EE, 0xEAF0EE, 0xDCE6EA, 0xFFF1D6, 3.5, 0xCFE8FF, 0x9AA088, 1.7, 0, 0, 22, 52, 0xFFF8E0, 38, 110, 720),
  GOLDEN: P(0x3C7FCB, 0xF2C58A, 0xFFD79A, 0xF6CF9A, 0xFFC878, 3.2, 0xE8D2B0, 0xA88A60, 1.5, 0, 0.12, -68, 20, 0xFFE0A0, 44, 100, 680),
  SUNSET: P(0x2E2F72, 0xE0707A, 0xFFB25E, 0xEE9A6A, 0xFF9050, 2.9, 0xB49AC8, 0x86685A, 1.45, 0.12, 0.6, -70, 11, 0xFFB060, 50, 90, 620),
  DUSK: P(0x141A4C, 0x4A3F86, 0xC06A78, 0x6A4A78, 0x93A4F4, 1.7, 0x5A62B0, 0x3A2A40, 1.2, 0.65, 0.92, -40, 36, 0xFFF4D6, 30, 80, 600),
};
const SKY = [[0, 'MORN'], [T.b5 - 0.1, 'MORN'], [T.quit5 + 0.3, 'SUNSET'], [T.fell - 0.3, 'SUNSET'], [T.fell + 0.6, 'DUSK'], [T.quarter + 0.5, 'NIGHT'], [T.b7 + 0.2, 'NIGHT'], [T.b7 + 0.55, 'DAWN'], [T.voted + 0.6, 'MORN'],
  [T.jumped + 0.6, 'DAY'], [T.b11 - 0.3, 'DAY'], [T.twist + 0.8, 'GOLDEN'], [T.b13, 'GOLDEN'], [T.over + 0.4, 'SUNSET'], [T.story + 0.6, 'DUSK'], [T.even14 + 0.6, 'NIGHT'], [T.cta, 'NIGHT'], [T.cta + 1.4, 'DUSK'], [DUR + 2, 'DUSK']];
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
flat.cyl(8.4, 8.4, 0.09, 28, 0xD8CDB6, 0.5, 0.045, -28.6); flat.cyl(7.9, 7.9, 0.1, 28, 0xEFE7D6, 0.5, 0.05, -28.6);   // the round stage
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
// the giant: a dark tower with a chip for a crown. Its height is Nvidia's share price: full height = the 11 Nov close ($173.73, the last before he left)
const NVH = 80, P0 = 173.73, PL = 125.53, P1 = 165.05, RL = PL / P0, R1 = P1 / P0;
const nvT = tower(22, NVH, 22, { rand: rng(4), color: 0x2E3440, glass: 0x4E8F86, frame: 0x4A5260, floor: 3.6, litP: 0.62, bare: true });
const nvG = new THREE.Group(); nvG.add(nvT); nvG.position.set(NV[0], 0, NV[1]); nvT.children.forEach(c => { c.castShadow = true; c.receiveShadow = true; }); scene.add(nvG);
const crown = new THREE.Mesh(CHIP, MAT); crown.scale.set(15, 9, 15); crown.position.set(0, NVH + 0.55, 0); crown.castShadow = true; nvG.add(crown);
stat.push([NV[0] - 12, NV[0] + 12, NV[1] - 12, NV[1] + 12, NVH + 6, 'giant']);
// the entrance building in front of it (stays put while the tower rises and sinks behind it): glass doors, canopy, steps
const FD = [0, -62.6];                                                    // where the founder stands, in front of the doors
{ const b = new GB(), fr = 0xF1EDE4, Z0 = -74.5, Z1 = -66.5, HP = 5.6;
  b.box(32, HP, Z1 - Z0, 0xE4DED2, 0, HP / 2, (Z0 + Z1) / 2); b.box(32.6, 0.5, Z1 - Z0 + 0.6, fr, 0, HP + 0.25, (Z0 + Z1) / 2);
  for (let i = 0; i < 6; i++) for (const s of [-1, 1]) b.box(2.6, 2.1, 0.12, 0x4E8F86, s * (6.4 + i * 1.6 + 0.8) , 3.3, Z1 + 0.03);
  b.box(8.4, 3.6, 0.2, 0x26404F, 0, 1.8, Z1 + 0.06); for (let i = -2; i <= 2; i++) b.box(0.14, 3.6, 0.3, fr, i * 2.05, 1.8, Z1 + 0.12);
  b.box(13, 0.35, 3.6, fr, 0, 4.15, Z1 + 1.8); for (const x of [-6, 6]) b.box(0.3, 4.0, 0.3, fr, x, 2.0, Z1 + 3.4);
  for (let i = 0; i < 3; i++) b.box(14 - i * 0.6, 0.12, 1.0, 0xCFC7B6, 0, 0.06 + i * 0.12, Z1 + 4.3 - i * 0.5);
  const m = b.mesh(); scene.add(m); stat.push([-16.5, 16.5, Z0 - 0.5, Z1 + 4.5, HP + 1.2, 'entrance']); }
const doorGlowM = new THREE.MeshBasicMaterial({ color: 0xFFE2A0, transparent: true, opacity: 0, toneMapped: false, depthWrite: false });
const doorGlow = new THREE.Mesh(new THREE.PlaneGeometry(8.0, 3.4), doorGlowM); doorGlow.position.set(0, 1.8, -66.3); scene.add(doorGlow);
// the ghost: where the top stood before he quit, in amber lines (shown in the twist)
const ghost = new THREE.Group(); { const gh = NVH * (1 - R1) + 1.2, gw = 23.2, bx = new THREE.BoxGeometry(gw, gh, gw);
  const fill = new THREE.Mesh(bx, new THREE.MeshBasicMaterial({ color: 0xFFC84A, transparent: true, opacity: 0.2, depthWrite: false, fog: false }));
  const eb = new GB(), th = 0.5, dash = 1.6, gap = 1.0;
  const run = (L, f) => { for (let a = -L / 2; a < L / 2; a += dash + gap) { const b = Math.min(L / 2, a + dash); f((a + b) / 2, b - a); } };
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) run(gh, (c, l) => eb.box(th, l, th, 0xFFFFFF, sx * gw / 2, c, sz * gw / 2));
  for (const sy of [-1, 1]) for (const s2 of [-1, 1]) { run(gw, (c, l) => eb.box(l, th, th, 0xFFFFFF, c, sy * gh / 2, s2 * gw / 2)); run(gw, (c, l) => eb.box(th, th, l, 0xFFFFFF, s2 * gw / 2, sy * gh / 2, c)); }
  const edges = new THREE.Mesh(eb.geo(), new THREE.MeshBasicMaterial({ color: 0xFFC84A, transparent: true, opacity: 0.9, fog: false, toneMapped: false }));
  ghost.add(fill, edges); ghost.position.set(NV[0], NVH * R1 + gh / 2 + 0.3, NV[1]); ghost.userData = { fill, edges }; ghost.visible = false; scene.add(ghost); }
// the price screen on its pylon
const pylon = new THREE.Group(); { const b = new GB(); b.box(4.6, 40, 3.6, 0x3A4048, 0, 20, -2.6); b.box(13.2, 14.8, 1.2, 0x23272E, 0, SCR[1], 0.3); b.box(13.8, 0.5, 1.6, 0x8A8F96, 0, SCR[1] + 7.6, 0.3); b.box(13.8, 0.5, 1.6, 0x8A8F96, 0, SCR[1] - 7.6, 0.3); b.box(5.6, 1.2, 4.6, 0x8A8F96, 0, 0.6, -2.6); pylon.add(b.mesh()); }
pylon.position.set(SCR[0], 0, SCR[2]); pylon.rotation.y = SCR_RY; scene.add(pylon);
const scrCv = document.createElement('canvas'); scrCv.width = 720; scrCv.height = 810; const scrTx = new THREE.CanvasTexture(scrCv); scrTx.colorSpace = THREE.SRGBColorSpace; scrTx.anisotropy = 4;
const screen = new THREE.Mesh(new THREE.PlaneGeometry(12.4, 13.95), new THREE.MeshBasicMaterial({ map: scrTx, toneMapped: false })); screen.position.set(0, SCR[1], 0.95); pylon.add(screen);
stat.push([SCR[0] - 7, SCR[0] + 7, SCR[2] - 6, SCR[2] + 6, 41, 'screen']);
// the board's glass room on the plaza: a long table, eight members, the empty chair at the head
const PV = [-11, -51];
const pav = pavilion(11, 8, 3.6); pav.position.set(PV[0], 0, PV[1]); scene.add(pav); stat.push([PV[0] - 6, PV[0] + 6, PV[1] - 4.6, PV[1] + 4.6, 4.8, 'pavilion']);
const TBL = boardTable(4); TBL.rotation.y = Math.PI / 2; TBL.position.set(PV[0], 0.34, PV[1]); scene.add(TBL);
const SEATS = TBL.userData.seats.map(([x, z, ry]) => [PV[0] + z, PV[1] - x, ry + Math.PI / 2]);   // table turned a quarter: its head (seat 0) faces east
const modern = (i, extra = {}) => ({ robe: [0x34405A, 0x6A2E3E, 0x3F6A5A, 0x5A5A66, 0x7A5A3A, 0x2F4A6A, 0x8A3A3A, 0x3B6FA8, 0xB0603A, 0x4E7A3E][i % 10], skin: SKIN[i % 5], short: [0x231C18, 0x5A3E28, 0xC9A27A, 0x3A2A1E, 0x8A8A8A][i % 5], shirt: i % 2 ? 0xF4F2EC : undefined, ...extra });
const boardP = SEATS.slice(1).map(([x, z, ry], i) => { const o = modern(i + 2, { s: 0.98 }); const m = person(o); m.position.set(x - Math.cos(ry) * 0.15, 0.34 - 0.34, z + Math.sin(ry) * 0.15); m.rotation.y = ry; scene.add(m);
  const hd = hand(o.robe, o.skin); hd.position.set(0.02, 1.08, -0.36); hd.rotation.x = -0.22; hd.scale.set(1, 0.01, 1); m.add(hd); return { m, hd }; });
const spotM = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false, toneMapped: false, blending: THREE.AdditiveBlending });
spotM.map = radial('rgba(255,236,190,0.9)', 'rgba(255,220,150,0)'); const spot = new THREE.Mesh(new THREE.PlaneGeometry(4, 4).rotateX(-Math.PI / 2), spotM); spot.position.set(FD[0], 0.12, FD[1]); spot.renderOrder = 2; scene.add(spot);
// the founder (a plain figure, no likeness): stands at the doors; leaves on 12 Nov; walks back on Monday
const founder = person(modern(0, { robe: 0x2B2F3A, skin: SKIN[3], short: 0x2A2A2A, shirt: 0xF4F2EC, s: 1.12 })); scene.add(founder);
const OUT = [[FD[0], FD[1]], [5, -56], [12, -50], [22, -44], [34, -38]], BACK = [[8, -55.5], [3.5, -59.5], [FD[0], FD[1]]];
function pathAt(pts, u) { const n = pts.length - 1, k = Math.min(n - 1, Math.floor(u * n)), v = u * n - k; return [lerp(pts[k][0], pts[k + 1][0], v), lerp(pts[k][1], pts[k + 1][1], v), Math.atan2(-(pts[k + 1][1] - pts[k][1]), pts[k + 1][0] - pts[k][0])]; }
function founderAt(t) {     // [x, z, ry, walking, visible]
  const face = -Math.PI / 2;
  if (t < T.walkOut[0]) return [FD[0], FD[1], face, false, true];
  if (t < T.walkOut[1]) { const u = seg(t, T.walkOut[0], T.walkOut[1]); const p = pathAt(OUT, u * u * 0.999); return [p[0], p[1], p[2], true, true]; }
  if (t < T.walkIn[0]) return [34, -38, 0, false, false];
  if (t < T.walkIn[1]) { const u = seg(t, T.walkIn[0], T.walkIn[1]); const p = pathAt(BACK, sm(0, 1, u) * 0.999); return [p[0], p[1], u > 0.96 ? face : p[2], u < 0.96, true]; }
  return [FD[0], FD[1], face, false, true];
}
// street life: lamps, trees, cars, people on the plaza
const lampHeads = new GB();
for (const z of [-24, -40, -56]) for (const s of [-1, 1]) { const l = lamp(6.2); l.position.set(s * 34, 0, z); l.rotation.y = s > 0 ? Math.PI : 0; scene.add(l); lampHeads.box(0.6, 0.12, 0.36, 0xFFFFFF, s * 34 - s * 1.25, 6.02, z); }
const lampM = new THREE.MeshLambertMaterial({ color: 0xFFF1C8, emissive: 0xFFD27A, emissiveIntensity: 0 }); scene.add(new THREE.Mesh(lampHeads.geo(), lampM));
for (const [x, z] of [[-40, 6], [36, 10], [-20, 28], [22, 40], [-48, 46], [46, 58], [-8, 62], [10, 20], [-16, -16], [27, -24], [27, -62], [17, -17], [-31, -64], [-52, -14], [54, -16], [62, -32], [-62, -24]]) { const m = bushTree(5.5 + R() * 2, R); m.position.set(x, 0, z); scene.add(m); stat.push([x - 2, x + 2, z - 2, z + 2, 8, 'tree']); }
const CARS = [[0xC8423A, -108.5, 1, 8, 0], [0x2F6FB8, -115.5, -1, 9, 40], [0xE9C46A, -2.5, 1, 7, 150], [0x4C9A62, -9.5, -1, 8, 230], [0xEDEDED, -108.5, 1, 8.6, 300], [0x7A4FA0, -9.5, -1, 7, 90], [0xD9664A, -2.5, 1, 9, 420]].map(([col, z, dir, v, off]) => { const m = car(col, { boxy: true }); scene.add(m); return { m, z, dir, v, off }; });
const WALK = [[-26, -40, 12, -6], [14, -28, -6, 4], [-10, -30, -8, -6], [22, -36, -14, -5], [-28, -30, 12, 6]].map(([x, z, dx, dz], i) => { const m = person(modern(i, { badge: i % 3 === 0 })); scene.add(m); return { m, a: [x, z], b: [x + dx, z + dz], sp: 0.06 + i * 0.011, ph: i * 0.27 }; });
// the investors: a crowd on the plaza looking up at the giant, each with a guess
const CROWD = [[-1.5, -37], [1.6, -38], [-2.8, -39.5], [2.9, -40.5], [-1.7, -42], [1.8, -43], [-3.4, -44.5], [3.3, -45.5], [-2.2, -47.5], [2.3, -48.5], [-3.8, -50], [3.9, -51]];   // two rows along an aisle to the doors (the frame is tall and narrow)
const crowd = CROWD.map(([x, z], i) => { const m = person(modern(i + 4, { s: 1.0 })); m.position.set(x, 0, z); m.rotation.y = Math.PI / 2 - x * 0.03; scene.add(m); return m; });
const GUESS = ['$150?', '$200?', '$140?', '$180?', '$165?', '$120?', '$210?'];

// ───────────────────────── sky clutter: clouds, birds, sparkles
const clouds = []; { const cr = rng(5150); for (let i = 0; i < 12; i++) { const m = cloud(cr); m.position.set(-640 + i * 110 + cr() * 40, 150 + cr() * 50, -720 - cr() * 160); m.scale.setScalar(2.4 + cr() * 1.6); m.userData.x0 = m.position.x; scene.add(m); clouds.push(m); } }   // far and high: none hangs in front of the giant
const birdMat = new THREE.MeshBasicMaterial({ color: 0x2A2430, side: THREE.DoubleSide });
const wingG = new THREE.BufferGeometry(); wingG.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0.1, 1.6, 0, -0.3, 1.5, 0, 0.5], 3));
const FLOCK = [{ t0: 0, t1: T.b3 + 0.5, a: [-60, 34, -40], b: [40, 42, -90] }, { t0: T.b8, t1: T.b10, a: [-40, 30, -60], b: [40, 44, -100] }];
const birds = []; for (let i = 0; i < 9; i++) { const g = new THREE.Group(), l = new THREE.Mesh(wingG, birdMat), r = new THREE.Mesh(wingG, birdMat); r.scale.x = -1; g.add(l, r); g.userData = { l, r, ph: R() * 6 }; g.visible = false; g.scale.setScalar(1.1); scene.add(g); birds.push(g); }
function updateBirds(t) {
  const f = FLOCK.find(f => t >= f.t0 && t <= f.t1); for (const b of birds) b.visible = !!f; if (!f) return;
  const u = seg(t, f.t0, f.t1), dx = f.b[0] - f.a[0], dz = f.b[2] - f.a[2], L = Math.hypot(dx, dz), ux = dx / L, uz = dz / L;
  birds.forEach((b, i) => { const row = Math.ceil(i / 2), sd = i % 2 ? 1 : -1; b.position.set(lerp(f.a[0], f.b[0], u) - ux * row * 2.4 + uz * sd * row * 1.7, lerp(f.a[1], f.b[1], u) + Math.sin(t * 2 + b.userData.ph) * 0.5, lerp(f.a[2], f.b[2], u) - uz * row * 2.4 - ux * sd * row * 1.7); b.rotation.y = Math.atan2(ux, uz); const fl = Math.sin(t * 10 + b.userData.ph) * 0.65; b.userData.l.rotation.z = fl; b.userData.r.rotation.z = -fl; });
}
const sparkT = (() => { const cv = document.createElement('canvas'); cv.width = cv.height = 64; const g = cv.getContext('2d'); g.translate(32, 32); g.fillStyle = '#fff'; for (let k = 0; k < 2; k++) { g.rotate(Math.PI / 2 * k); g.beginPath(); g.moveTo(0, -30); g.quadraticCurveTo(3, -3, 30, 0); g.quadraticCurveTo(3, 3, 0, 30); g.quadraticCurveTo(-3, 3, -30, 0); g.quadraticCurveTo(-3, -3, 0, -30); g.fill(); } const tx = new THREE.CanvasTexture(cv); tx.colorSpace = THREE.SRGBColorSpace; return tx; })();
const sparks = []; for (let i = 0; i < 90; i++) { const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: sparkT, color: 0xFFE9A8, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false })); sp.userData = { ph: R() * 6.28, w: 3 + R() * 4, dx: (R() - 0.5) * 2, dz: (R() - 0.5) * 2, k: R() }; scene.add(sp); sparks.push(sp); }

// ───────────────────────── the tower's height = the share price
function ratioAt(t) {
  if (t < T.rewind[0]) return lerp(RL, R1, eio(seg(t, T.riseA[0], T.riseA[1])));
  if (t < T.sink[0]) return lerp(R1, 1, sm(T.rewind[0], T.rewind[1], t));
  if (t < T.riseB[0]) return lerp(1, RL, eio(seg(t, T.sink[0], T.sink[1])));
  return lerp(RL, R1, eio(seg(t, T.riseB[0], T.riseB[1])));
}
const topY = t => NVH * ratioAt(t);

// ───────────────────────── the price screen: one canvas, redrawn only when what it shows changes
const F = (w, px, fam) => `${w} ${px}px ${fam}`;
let scrKey = '';
function scrMode(t) {
  if (t < T.b4 - 0.3) return ['jump', seg(t, T.riseA[0], T.riseA[1]), 1];
  if (t < T.b6 - 0.2) return ['before', seg(t, T.b4, T.b4 + 0.6), 0];
  if (t < T.b7 + 0.2) return ['fall', seg(t, T.sink[0], T.sink[1]), seg(t, T.quarter - 0.1, T.quarter + 0.2)];
  if (t < T.b9 - 0.2) return ['jump', seg(t, T.riseB[0], T.riseB[1]), seg(t, T.third - 0.1, T.third + 0.2)];
  if (t < T.b10 - 0.1) return ['forecast', seg(t, T.same2 - 0.1, T.forecast + 0.2), 0];
  if (t < T.b11 - 0.1) return ['guess', seg(t, T.guess - 0.1, T.guess + 0.3), seg(t, T.future - 0.1, T.future + 0.3)];
  if (t < T.b12 - 0.15) return ['twist', seg(t, T.twist - 0.2, T.costs), seg(t, T.less - 0.15, T.less + 0.2)];
  if (t < T.b13 - 0.1) return ['blocks', seg(t, T.fall12 - 0.05, T.fall12 + 0.45), seg(t, T.bigger - 0.05, T.rise + 0.25)];
  if (t < T.cta) return ['today', 1, 0];
  return ['cta', seg(t, T.would, T.would + 0.6), 0];
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
  const dash = (y, lbl) => { g.strokeStyle = 'rgba(255,255,255,0.55)'; g.setLineDash([12, 12]); g.lineWidth = 4; g.beginPath(); g.moveTo(60, y); g.lineTo(670, y); g.stroke(); g.setLineDash([]); g.fillStyle = 'rgba(255,255,255,0.8)'; g.font = F(700, 28, 'Inter'); g.textAlign = 'left'; g.fillText(lbl, 60, y - 30); g.textAlign = 'center'; };
  const yP = p => lerp(600, 190, (p - 120) / (180 - 120));     // price → screen y ($120 … $180)
  if (mode === 'jump') {
    g.fillStyle = '#FFD27A'; g.font = F(800, 42, 'Inter'); g.fillText('NVDA · MON 23 NOV 2026', 360, 60);
    const pts = [[60, yP(125.53)], [160, yP(131)], [250, yP(139)], [330, yP(146)], [420, yP(152)], [510, yP(160)], [590, yP(158)], [670, yP(165.05)]];
    line(partial(pts, lerp(0.12, 1, eo(a))), '#F7B500', 16);
    g.font = F(900, 128, 'JBM'); g.fillStyle = b > 0.3 ? '#FFC84A' : 'rgba(255,255,255,0.15)'; g.fillText('▲31.5%', 360, 690);
    g.fillStyle = 'rgba(255,255,255,0.7)'; g.font = F(700, 32, 'Inter'); g.fillText('$125.53 → $165.05 · CLOSE', 360, 775);
  } else if (mode === 'before') {
    g.fillStyle = '#FFD27A'; g.font = F(800, 40, 'Inter'); g.fillText('NVDA · WED 11 NOV 2026', 360, 60);
    g.globalAlpha = 0.3 + 0.7 * a; g.fillStyle = '#FFFFFF'; g.font = F(900, 150, 'JBM'); g.fillText('$173.73', 360, 380); g.globalAlpha = 1;
    g.fillStyle = 'rgba(255,255,255,0.75)'; g.font = F(700, 34, 'Inter'); g.fillText('LAST CLOSE BEFORE HE LEFT', 360, 560);
  } else if (mode === 'fall') {
    g.fillStyle = '#FFD27A'; g.font = F(800, 42, 'Inter'); g.fillText('NVDA · 11 → 20 NOV 2026', 360, 60);
    dash(yP(173.73), '$173.73 · 11 NOV');
    const pts = [[60, yP(173.73)], [150, yP(166.19)], [240, yP(162.85)], [330, yP(156.14)], [420, yP(155.46)], [510, yP(150.96)], [590, yP(145.98)], [670, yP(125.53)]];
    line(partial(pts, lerp(0.1, 1, eo(a))), a > 0.3 ? '#FF6B5B' : '#F7B500', 16);
    g.font = F(900, 128, 'JBM'); g.fillStyle = b > 0.3 ? '#FF6B5B' : 'rgba(255,255,255,0.15)'; g.fillText('▼28%', 360, 690);
    g.fillStyle = 'rgba(255,255,255,0.7)'; g.font = F(700, 32, 'Inter'); g.fillText('$173.73 → $125.53 · CLOSE', 360, 775);
  } else if (mode === 'forecast') {
    g.fillStyle = '#FFD27A'; g.font = F(800, 40, 'Inter'); g.fillText('NVIDIA · MON 23 NOV 2026', 360, 60);
    g.fillStyle = 'rgba(255,255,255,0.8)'; g.font = F(800, 52, 'Inter'); g.fillText('SALES FORECAST', 360, 250);
    g.globalAlpha = 0.25 + 0.75 * a; g.fillStyle = '#9BE0A8'; g.font = F(900, 118, 'Figtree'); g.fillText('UNCHANGED', 360, 420); g.globalAlpha = 1;
    g.fillStyle = 'rgba(255,255,255,0.6)'; g.font = F(700, 32, 'Inter'); g.fillText('NO NEW NUMBERS THAT DAY', 360, 600);
  } else if (mode === 'guess') {
    g.fillStyle = '#FFFFFF'; g.font = F(900, 92, 'Figtree'); g.fillText('A PRICE IS', 360, 200);
    g.globalAlpha = 0.2 + 0.8 * a; g.fillStyle = '#FFC84A'; g.font = F(900, 150, 'Figtree'); g.fillText('A GUESS', 360, 370); g.globalAlpha = 0.2 + 0.8 * b;
    g.fillStyle = '#FFFFFF'; g.font = F(800, 64, 'Figtree'); g.fillText('ABOUT THE FUTURE', 360, 540); g.globalAlpha = 1;
  } else if (mode === 'twist') {
    g.fillStyle = '#FFD27A'; g.font = F(800, 40, 'Inter'); g.fillText('NVDA · 11 NOV → 23 NOV', 360, 60);
    dash(yP(173.73), 'BEFORE HE QUIT · $173.73');
    const pts = [[60, yP(173.73)], [200, yP(162)], [340, yP(152)], [450, yP(125.53)], [560, yP(150)], [670, yP(165.05)]];
    line(partial(pts, lerp(0.15, 1, eo(a))), '#F7B500', 14);
    if (a > 0.95) { g.strokeStyle = '#FF6B5B'; g.lineWidth = 6; g.beginPath(); g.moveTo(670, yP(173.73) + 8); g.lineTo(670, yP(165.05) - 12); g.stroke(); }
    g.font = F(900, 112, 'JBM'); g.fillStyle = b > 0.3 ? '#FF6B5B' : 'rgba(255,255,255,0.15)'; g.fillText('STILL −5%', 360, 690);
    g.fillStyle = 'rgba(255,255,255,0.7)'; g.font = F(700, 30, 'Inter'); g.fillText('$165.05 · CLOSE MON 23 NOV 2026', 360, 775);
  } else if (mode === 'blocks') {
    g.fillStyle = '#FFD27A'; g.font = F(800, 38, 'Inter'); g.fillText('AN EXAMPLE · FOUR BLOCKS', 360, 60);
    const bw = 220, bh = 92, cx = 230, base = 700, box = (x, y, col, edge, rot = 0, al = 1) => { g.save(); g.globalAlpha = al; g.translate(x, y); g.rotate(rot); g.fillStyle = col; g.fillRect(-bw / 2, -bh / 2, bw, bh); g.strokeStyle = edge; g.lineWidth = 6; g.strokeRect(-bw / 2 + 3, -bh / 2 + 3, bw - 6, bh - 6); g.restore(); };
    g.strokeStyle = 'rgba(255,255,255,0.5)'; g.lineWidth = 4; g.beginPath(); g.moveTo(60, base); g.lineTo(670, base); g.stroke();
    for (let i = 0; i < 3; i++) box(cx, base - bh / 2 - 4 - i * (bh + 8), '#F7A600', '#FFD27A');
    const fu = eo(a), ytop = base - bh / 2 - 4 - 3 * (bh + 8);
    if (b < 0.02) box(cx + 300 * fu, lerp(ytop, base - bh / 2 - 4, fu * fu), fu > 0.05 ? '#E0483B' : '#F7A600', fu > 0.05 ? '#FF8A7A' : '#FFD27A', 0.5 * fu, 1);
    else { box(cx + 300, base - bh / 2 - 4, '#E0483B', '#FF8A7A', 0.5, 0.35); const ru = back(c01(b)); box(cx, lerp(base + 60, ytop, Math.min(1.08, ru)), '#3FAE6A', '#9BE0A8'); }
    g.textAlign = 'left'; if (fu > 0.3) { g.globalAlpha = c01((fu - 0.3) / 0.3); g.fillStyle = '#FF8A7A'; g.font = F(900, 64, 'JBM'); g.fillText('−1/4', 430, 420); g.font = F(700, 28, 'Inter'); g.fillText('4 → 3 BLOCKS', 430, 470); g.globalAlpha = 1; }
    if (b > 0.3) { g.globalAlpha = c01((b - 0.3) / 0.3); g.fillStyle = '#9BE0A8'; g.font = F(900, 64, 'JBM'); g.fillText('+1/3', 430, 200); g.font = F(700, 28, 'Inter'); g.fillText('3 → 4 BLOCKS', 430, 250); g.globalAlpha = 1; }
    g.textAlign = 'center'; g.fillStyle = 'rgba(255,255,255,0.8)'; g.font = F(800, 34, 'Inter'); g.fillText(b > 0.9 ? 'BACK TO 4: A BIGGER RISE' : 'ONE BLOCK DOWN…', 360, 770);
  } else if (mode === 'today') {
    g.fillStyle = '#FFD27A'; g.font = F(800, 40, 'Inter'); g.fillText('NVDA · AS OF 23 NOV 2026', 360, 60);
    g.fillStyle = '#FFFFFF'; g.font = F(900, 150, 'JBM'); g.fillText('$165.05', 360, 360);
    g.fillStyle = 'rgba(255,255,255,0.75)'; g.font = F(700, 34, 'Inter'); g.fillText('CLOSE · STORY NOT OVER', 360, 540);
  } else if (mode === 'cta') {
    g.font = F(900, 150, 'Figtree'); g.fillStyle = '#F7B500'; g.fillText('SELL', 360, 220); g.fillStyle = '#6FD0C0'; g.fillText('HOLD', 360, 560);
    g.fillStyle = '#FFFFFF'; g.font = F(800, 60, 'Inter'); g.fillText('or', 360, 390); g.font = F(700, 38, 'Inter'); g.fillStyle = 'rgba(255,255,255,0.8)'; g.fillText('YOU DECIDE', 360, 720);
  }
  scrTx.needsUpdate = true;
}

// ───────────────────────── camera path (spherical keys around a target; `up` tilts the view so the subject sits lower in the frame)
const SCRF = (dx = 0, dy = 0) => [SCR[0] + dx, SCR[1] + dy, SCR[2]];
const FDT = [FD[0], 1.7, FD[1]];
const fTg = (dy = 1.6) => t => { const f = founderAt(t); return [f[0], dy, f[1]]; };
const CAM = [
  { t: 0, tg: [5, 30, -66], d: 205, az: -5, el: 13, up: 0.05 },                                      // the cover: the giant at the head of the plaza, Monday morning
  { t: T.bigOut, tg: [3, 33, -70], d: 188, az: -2, el: 12, up: 0.05, mv: 1 },
  { t: T.back1 + 0.5, tg: [0, 38, NV[1]], d: 165, az: 4, el: 9, up: 0.05, mv: 1 },                   // the giant rises
  { t: T.company + 0.3, tg: [0, 42, NV[1]], d: 156, az: 10, el: 9, up: 0.05, mv: 1 },
  { t: T.man + 0.35, tg: FDT, d: 13, az: 10, el: 4, up: 0.0, mv: 1 },                                 // down to one man at the doors
  { t: T.ago + 0.2, tg: FDT, d: 12, az: -6, el: 4, up: 0.0 },
  { t: T.quit5 + 0.3, tg: [3, 2.0, -59], d: 19, az: 25, el: 9, up: 0.1, mv: 1 },                      // he walks out
  { t: T.gone + 0.35, tg: [2, 9, -64], d: 72, az: 6, el: 14, up: 0.06, mv: 2 },                      // pull back over the plaza (slow enough for no whip)
  { t: T.fell + 0.85, tg: [0, 34, NV[1]], d: 160, az: -4, el: 8, up: 0.05, mv: 3 },                   // the giant sinks
  { t: T.quarter + 0.5, tg: [0, 30, NV[1]], d: 152, az: -7, el: 8, up: 0.05, mv: 1 },
  { t: T.b7 + 0.3, tg: [-14, 150, -62], d: 40, az: 8, el: -32, up: 0, mv: 1 },                        // sky wipe: night → Monday dawn
  { t: T.voted + 0.45, tg: [PV[0] + 0.3, 1.2, PV[1]], d: 20.5, az: 20, el: 42, up: 0.03, mv: 1 },      // down to the board's glass room
  { t: T.in7 + 0.45, tg: [-3, 1.8, -58.5], d: 24, az: 14, el: 22, up: 0.08, mv: 1 },                  // he walks back to the doors
  { t: T.third + 0.6, tg: [2, 36, -80], d: 165, az: 8, el: 9, up: 0.05, mv: 1 },                      // the giant jumps almost a third
  { t: T.chips + 0.25, tg: [0, 77, NV[1]], d: 62, az: 6, el: 16, up: 0.02, mv: 1 },                    // same chips (the crown) · same forecast · one vote
  { t: T.just, tg: [0, 77, NV[1]], d: 58, az: 14, el: 16, up: 0.02 },
  { t: T.vote + 0.55, tg: [-4, 20, -60], d: 120, az: 0, el: 12, up: 0.05, mv: 2 },                    // just one vote: pull back over the plaza
  { t: T.guess + 0.35, tg: [0, 2.2, -48], d: 19, az: -4, el: 2.5, up: 0.02, mv: 3 },                  // low, behind the investors: their guesses
  { t: T.too + 0.3, tg: [0, 2.2, -49], d: 18, az: 3, el: 2.5, up: 0.02 },
  { t: T.b11 + 0.3, tg: [0, 36, -70], d: 125, az: 6, el: 6, up: 0.03, mv: 2 },                        // up from the crowd
  { t: T.twist + 0.6, tg: [0, NVH * 0.93, NV[1]], d: 112, az: 12, el: 5, up: 0.0, mv: 3 },            // the twist: the ghost of the old top
  { t: T.record11 + 0.7, tg: [0, NVH * 0.93, NV[1]], d: 108, az: 16, el: 5, up: 0.0 },
  { t: T.costs + 0.45, tg: SCRF(0, -0.8), d: 50, az: -28, el: 6, up: 0.04, mv: 1 },                    // the screen: still below; then four blocks
  { t: T.undo12 + 0.5, tg: SCRF(0, -0.8), d: 47, az: -34, el: 6, up: 0.04 },
  { t: T.over + 0.5, tg: [4, 30, -70], d: 215, az: 14, el: 13, up: 0.06, mv: 1 },                     // wide: the story isn't over
  { t: T.even14 + 0.6, tg: [0, 22, -64], d: 300, az: 22, el: 22, up: 0.16, mv: 3 },                   // crane up over the city at night
  { t: T.cta + 0.1, tg: [0, 20, -60], d: 285, az: 16, el: 22, up: 0.16 },
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
.cmp{width:820px;padding:26px 34px 22px;box-sizing:border-box;background:rgba(8,10,26,.88);border:2px solid rgba(255,225,160,.6);border-radius:30px;box-shadow:0 18px 50px rgba(5,7,20,.5);}
.cmp .t{font:700 22px/1 'Inter',sans-serif;letter-spacing:.28em;text-transform:uppercase;color:#FFD27A;text-align:center;margin-bottom:8px;}
.cmp .r{margin-top:18px;}
.cmp .n{font:700 25px/1 'Inter',sans-serif;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.85);}
.cmp .b{margin-top:10px;height:66px;border-radius:14px;display:flex;align-items:center;justify-content:flex-end;padding-right:18px;box-sizing:border-box;font:800 38px/1 'JBM',monospace;white-space:nowrap;overflow:hidden;}
.cmp .b.am{background:#F7A600;color:#1C1300;} .cmp .b.gr{background:#6A7088;color:#fff;}
.cmp .s{margin-top:16px;font:500 18px/1 'Inter',sans-serif;letter-spacing:.04em;color:rgba(255,255,255,.6);text-align:center;}
.card{font:700 30px/1.3 'Figtree',sans-serif;color:#fff;background:rgba(8,10,26,.88);border:2px solid rgba(255,225,160,.65);padding:16px 24px;border-radius:20px;text-align:center;white-space:pre;box-shadow:0 12px 34px rgba(5,7,20,.5);}
.card em{font-style:normal;color:#FFC84A;} .card s{text-decoration:none;color:#FF8A7A;} .card u{text-decoration:none;color:#9BE0A8;}
.bub{font:800 30px/1 'JBM',monospace;color:#1C1300;background:#FFE7A6;border:2px solid #F7A600;padding:9px 13px 8px;border-radius:16px;box-shadow:0 6px 18px rgba(5,7,20,.35);}
.tag.dn{color:#fff;background:#D9483B;border-color:#D9483B;} .tag.dn b{color:#fff;}
.tag.gn{color:#0A2A12;background:#9BE0A8;border-color:#3FAE6A;} .tag.gn b{color:#0A2A12;}
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
const tagGiant = mk('tag am', '+$954 billion · one day');
const cmp = mk('cmp', `<div class="t">biggest one-day gains in value</div><div class="r"><div class="n">Nvidia · Mon 23 Nov 2026</div><div class="b am" style="width:0px">+$954 B</div></div><div class="r"><div class="n">the old record · Microsoft · 30 Jul 2026</div><div class="b gr" style="width:0px">≈ +$450 B</div></div><div class="s">Kiplinger, 24/7 Wall St (Reuters/LSEG count), Seeking Alpha · 23 Nov 2026</div>`);
const cmpB = cmp.querySelectorAll('.b');
const tagMan = mk('tag', '');
const tagBoard = mk('tag am', 'the board <b>votes</b>');
const tagBack = mk('tag am', 'back as CEO');
const tagChips = mk('tag', 'same chips'), chk = mk('card', '');
const tagFall = mk('tag dn', '$173.73 → $125.53 · <b>−28%</b>'), tagJump = mk('tag am', '$125.53 → $165.05 · <b>+31.5%</b>');
const BUBI = [2, 3, 4, 5, 6, 7, 8];                               // who shows a guess (not the two nearest the camera)
const bubs = BUBI.map((_, i) => mk('bub', GUESS[i]));
const tagPeople = mk('tag am', 'a bet on <b>one</b> person');
const tagGhost = mk('tag am', 'before he quit · <b>$173.73</b>'), tagNow = mk('tag', 'Monday’s close · <b>$165.05</b>'), tagGap = mk('tag dn', 'still <b>−5%</b>');
const title = mk('title', '<div class="s">THE STORY OF</div><div class="n">The Founder\nWho Came <em>Back</em></div>');
const lesson = mk('lesson', 'Even a <em>record day</em>\ndidn’t undo the fall.');
const ctaChip = mk('chip am', 'you decide');
const boxes = [0, 1].map(() => { const e = mk('cbox', '<span class="in"></span><span class="post">Post</span>'); return { e, inn: e.querySelector('.in'), post: e.querySelector('.post') }; });
const foot = document.getElementById('foot');
const FOOT_A = 'Sources: Nvidia (23 Nov 2026), Kiplinger, Motley Fool, 24/7 Wall St, ABC News (23 Nov 2026)\nNvidia closes: $173.73 (11 Nov), $125.53 (20 Nov), $165.05 (23 Nov 2026) · not advice';
const FOOT_B = 'Sources: Nvidia (12 Nov 2026), Motley Fool (23 Nov 2026), Yahoo Finance, stockanalysis.com\nthe fall came during a wider tech sell-off · closes $173.73 (11 Nov) → $125.53 (20 Nov 2026)';
const FOOT_C = 'Sources: Nvidia (23 Nov 2026), Kiplinger, Motley Fool, 24/7 Wall St, ABC News (23 Nov 2026)\nthe guesses and the four blocks are examples · Nvidia close $165.05 on 23 Nov 2026 · not advice';
const setTxt = (e, s) => { if (e.textContent !== s) e.textContent = s; };
const setHTML = (e, s) => { if (e._h !== s) { e._h = s; e.innerHTML = s; } };

function updateUI(t) {
  updateCaption(t);
  setTxt(foot, t > T.b5 - 0.1 && t < T.b7 ? FOOT_B : t > T.b10 - 0.1 && t < T.b13 ? FOOT_C : FOOT_A);
  foot.style.opacity = (0.95 * seg(t, 3.0, 3.6) * (1 - seg(t, T.cta, T.cta + 0.3) * 0.45)).toFixed(3);
  // 1 — the hook card (0-1.5 s, the cover), then the big number (1.5-3 s)
  if (hookEl) { const out = seg(t, T.hookEnd, T.hookEnd + (TIM.big ? 0.22 : 0.3)); put(hookEl, W / 2, 640 - 40 * eo(out), 1 - out, 1 + 0.035 * seg(t, 0, T.hookEnd) + 0.06 * out); }
  if (bigEl) { const o = win(t, T.bigIn, T.bigOut - 0.05, 0.15, 0.25), u = eo(seg(t, T.bigIn + 0.05, T.bigIn + 0.7)), land = seg(t, T.bigIn + 0.7, T.bigIn + 1.0), sh = (1 - land) * (land > 0 ? 1 : 0);
    bigBg.style.opacity = (0.92 * o).toFixed(3); setHTML(BIGN.v, bigText(u)); BIGN.line.style.strokeDashoffset = (BIGN.len * (1 - eo(seg(t, T.bigIn, T.bigIn + 0.9)))).toFixed(1);
    put(bigEl, W / 2 + Math.sin(t * 90) * 7 * sh, 860 + Math.cos(t * 77) * 5 * sh, o, pop(t, T.bigIn, 0.4) * (1 + 0.05 * Math.sin(Math.PI * land))); }
  // chips (one line at the top that says where we are)
  let ct = '', co = 0, cp = 0;
  const CH = [[T.bigOut + 0.05, T.b3 - 0.1, 'Nvidia · Mon 23 Nov 2026'], [T.b4 + 0.05, T.b5 - 0.1, 'Nvidia · co-founded in 1993'], [T.b5 + 0.05, T.b6 - 0.1, 'Thu 12 Nov 2026 · he resigns'],
    [T.b6 + 0.05, T.b7 - 0.1, '12 → 20 Nov 2026 · while he was gone'], [T.b7 + 0.05, T.b8 - 0.1, 'Mon 23 Nov 2026 · before the market opens'], [T.b8 + 0.05, T.b9 - 0.1, 'Mon 23 Nov 2026 · at the close'], [T.b9 + 0.05, T.b10 - 0.1, 'Mon 23 Nov 2026 · what changed?'],
    [T.b10 + 0.05, T.b11 - 0.1, 'what a share price is'], [T.b11 + 0.05, T.b12 - 0.1, 'as of the close · Mon 23 Nov 2026'], [T.b12 + 0.05, T.b13 - 0.1, 'why: an example'], [T.b13 + 0.05, T.b14 - 0.1, 'as of 23 Nov 2026']];
  for (const [a, b, s] of CH) { const o = win(t, a, b, 0.22, 0.22); if (o > co) { co = o; ct = s; cp = pop(t, a); } }
  if (ct) setTxt(chip, ct); put(chip, W / 2, 472, co, cp);
  // 1–2 — the giant jumps; the old record
  { const p = proj(NV[0], topY(t) + 12, NV[1]); put(tagGiant, clampX(p[0], 260), clampY(p[1] - 20, 560, 1400), p[2] ? win(t, T.bigOut + 0.05, T.b3 - 0.2, 0.3, 0.25) : 0, pop(t, T.bigOut + 0.05)); }
  { const o = win(t, T.double - 0.25, T.b3 + 0.15, 0.3, 0.25), u1 = eo(seg(t, T.double - 0.15, T.double + 0.45)), u2 = eo(seg(t, T.record2 - 0.15, T.record2 + 0.45));
    cmpB[0].style.width = (600 * u1).toFixed(1) + 'px'; cmpB[1].style.width = (600 * 450 / 954 * u2).toFixed(1) + 'px'; put(cmp, W / 2, 1190, o, pop(t, T.double - 0.25)); }
  // 3–5 — one man; who he is; he quits
  { const f = founderAt(t), p = proj(f[0], 2.75, f[1]); const s = t < T.b4 ? 'one man?' : 'Jensen Huang · co-founder';
    setHTML(tagMan, s); put(tagMan, clampX(p[0], 230), clampY(p[1] - 26, 600, 1400), p[2] ? win(t, T.one3, T.b5 - 0.05, 0.25, 0.25) : 0, pop(t, t < T.b4 ? T.one3 : T.jensen)); }
  // 7 — the board votes; he is back
  { const p = proj(PV[0], 5.4, PV[1]); put(tagBoard, clampX(p[0], 230), clampY(p[1] - 20, 600, 1400), p[2] ? win(t, T.board - 0.05, T.in7 + 0.2, 0.25, 0.25) : 0, pop(t, T.board - 0.05)); }
  { const f = founderAt(t), p = proj(f[0], 2.8, f[1]); put(tagBack, clampX(p[0] + 30, 200), clampY(p[1] - 26, 600, 1400), p[2] ? win(t, T.in7 - 0.1, T.b8 + 0.4, 0.2, 0.25) : 0, pop(t, T.in7 - 0.1)); }
  // 9 — same chips, same forecast, one vote
  { const p1 = proj(NV[0], topY(t) + 7, NV[1]); put(tagChips, clampX(p1[0], 200), clampY(p1[1] - 24, 560, 1400), p1[2] ? win(t, T.chips - 0.15, T.b10 - 0.1, 0.2, 0.25) : 0, pop(t, T.chips - 0.15));
    const l1 = t > T.chips - 0.15, l2 = t > T.same2 - 0.1, l3 = t > T.just - 0.1;
    setHTML(chk, `<u>✓</u> same chips` + (l2 ? `\n<u>✓</u> same sales forecast` : '') + (l3 ? `\n<em>just one vote</em>` : ''));
    put(chk, W / 2, 1190, l1 ? win(t, T.chips - 0.15, T.b10 - 0.1, 0.2, 0.25) : 0, pop(t, T.chips - 0.15) * (1 + 0.05 * win(t, T.same2 - 0.1, T.same2 + 0.2, 0.08, 0.2) + 0.05 * win(t, T.just - 0.1, T.just + 0.2, 0.08, 0.2))); }
  // 6 and 8 — the price on the giant: down more than a quarter, then up almost a third
  { const p = proj(NV[0], topY(t) + 9, NV[1]); put(tagFall, clampX(p[0], 260), clampY(p[1] - 24, 560, 1400), p[2] ? win(t, T.fell - 0.1, T.quarter + 0.45, 0.25, 0.2) : 0, pop(t, T.fell - 0.1));
    put(tagJump, clampX(p[0], 260), clampY(p[1] - 24, 560, 1400), p[2] ? win(t, T.jumped, T.b9 - 0.2, 0.25, 0.25) : 0, pop(t, T.jumped)); }
  // 10 — the investors' guesses; a bet on one person
  bubs.forEach((e, i) => { const [x, z] = CROWD[BUBI[i]], p = proj(x, 1.95, z); put(e, clampX(p[0], 90), p[1] - 46 - (i % 2) * 34, p[2] ? win(t, T.guess + 0.05 + i * 0.07, T.b11 - 0.15, 0.2, 0.25) * (1 - 0.55 * seg(t, T.people - 0.1, T.people + 0.3)) : 0, pop(t, T.guess + 0.05 + i * 0.07)); });
  { const p = proj(FD[0], 3.1, FD[1]); put(tagPeople, clampX(p[0], 260), clampY(p[1] - 26, 600, 1400), p[2] ? win(t, T.people - 0.1, T.b11 - 0.1, 0.2, 0.25) : 0, pop(t, T.people - 0.1)); }
  // 11 — the twist: the old top, Monday's top, the gap
  { const g = win(t, T.twist - 0.1, T.record11 + 0.75, 0.3, 0.25), pg = proj(NV[0] - 12.5, NVH + 1.5, NV[1] + 11.5), pn = proj(NV[0] + 12.5, topY(t) - 2, NV[1] + 11.5), pm = proj(NV[0] + 13, NVH * (1 + R1) / 2, NV[1] + 11.5);
    put(tagGhost, clampX(pg[0], 280), clampY(pg[1] - 34, 560, 1400), pg[2] ? g * seg(t, T.twist + 0.1, T.twist + 0.4) : 0, pop(t, T.twist + 0.1));
    put(tagNow, clampX(pn[0], 280), clampY(pn[1] + 34, 560, 1400), pn[2] ? g * seg(t, T.even11, T.even11 + 0.3) : 0, pop(t, T.even11));
    put(tagGap, clampX(pm[0] + 40, 200), clampY(pm[1], 560, 1400), pm[2] ? g * seg(t, T.record11, T.record11 + 0.3) : 0, pop(t, T.record11)); }
  // 14 — title and lesson; 15 — you decide
  put(title, W / 2, 640, win(t, T.story, T.cta - 0.1, 0.4, 0.3), 0.94 + 0.06 * eo(seg(t, T.story, T.story + 0.6)));
  put(lesson, W / 2, 1180, win(t, T.even14 - 0.1, T.cta - 0.15, 0.3, 0.25), pop(t, T.even14 - 0.1));
  put(ctaChip, W / 2, 472, seg(t, T.would, T.would + 0.3), pop(t, T.would));
  [[T.sell, 'SELL', T.postA], [T.hold, 'HOLD', T.postB]].forEach(([t0, word, tp], i) => {
    const bx = boxes[i], n = Math.min(4, Math.floor(c01((t - t0) / 0.45) * 4.001)), typed = word.slice(0, n), caret = (n < 4 || Math.floor(t * 2.4) % 2) && t < tp ? '<i></i>' : '';
    setHTML(bx.inn, typed ? `<b>${typed}</b>${caret}` : `<em>Add a comment…</em>${caret}`); const sent = t > tp; const pc = sent ? 'post on sent' : n === 4 ? 'post on' : 'post'; if (bx.post.className !== pc) bx.post.className = pc; setTxt(bx.post, sent ? 'Posted ✓' : 'Post');
    const ts = i ? T.hold - 0.35 : T.comment; put(bx.e, W / 2, 1330 + i * 132, seg(t, ts, ts + 0.3), pop(t, ts) * (1 + 0.06 * win(t, tp, tp + 0.3, 0.08, 0.2)));
  });
}

// ───────────────────────── one frame
const hopY = (hops, t, h = 0.5) => { let y = 0; for (const t0 of hops) { const u = (t - t0) / 0.38; if (u > 0 && u < 1) y = Math.max(y, Math.sin(u * Math.PI) * h); } return y; };
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
  // the giant: its height is the price; it shudders as it sinks, jolts as it jumps
  { const k = ratioAt(t), sh = win(t, T.sink[0], T.sink[1], 0.1, 0.3) * 0.8 + win(t, T.riseA[0], T.riseA[1], 0.1, 0.3) * 0.5 + win(t, T.riseB[0], T.riseB[1], 0.1, 0.3) * 0.5;
    nvG.position.y = -NVH * (1 - k); nvG.rotation.z = Math.sin(t * 23) * 0.004 * sh; nvG.rotation.x = Math.sin(t * 19 + 1) * 0.003 * sh; crown.rotation.y = t * 0.25;
    const go = win(t, T.twist - 0.2, T.costs + 0.3, 0.4, 0.5); ghost.visible = go > 0.01; ghost.userData.fill.material.opacity = 0.2 * go; ghost.userData.edges.material.opacity = 0.9 * go; }
  doorGlowM.opacity = 0.55 * night + 0.35 * win(t, T.in7 - 0.2, T.b8 + 0.6, 0.2, 0.5);
  // the founder
  { const f = founderAt(t); founder.visible = f[4]; founder.scale.setScalar(1.12 * Math.max(0.01, t > T.walkIn[0] && t < T.walkIn[0] + 0.4 ? back(seg(t, T.walkIn[0], T.walkIn[0] + 0.35)) : 1)); founder.position.set(f[0], f[3] ? Math.abs(Math.sin(t * 9)) * 0.08 : hopY([T.in7 + 0.7], t, 0.12), f[1]); founder.rotation.y = f[2];
    spot.position.set(f[0], 0.12, f[1]); spotM.opacity = 0.7 * (win(t, T.one3 - 0.2, T.quit5, 0.3, 0.3) + win(t, T.in7 + 0.2, T.b8 + 0.4, 0.2, 0.4) + win(t, T.people - 0.2, T.b11 - 0.1, 0.2, 0.3)); }
  // the board: hands go up one after another
  boardP.forEach(({ m, hd }, i) => { const u = back(seg(t, T.hands(i), T.hands(i) + 0.3)) * (1 - seg(t, T.b9 + 1.0, T.b9 + 1.5)); hd.scale.set(1, Math.max(0.01, u), 1); m.position.y = hopY([T.hands(i) + 0.05], t, 0.06); });
  // cars and people
  for (const c of CARS) { const L = 700, x = ((c.off + t * c.v) % L) - L / 2; c.m.position.set(c.dir * x, 0, c.z); c.m.rotation.y = c.dir > 0 ? 0 : Math.PI; }
  WALK.forEach((w, i) => { const u = (Math.sin((t * w.sp + w.ph) * Math.PI * 2) + 1) / 2, dir = Math.cos((t * w.sp + w.ph) * Math.PI * 2) > 0 ? 1 : -1; const x = lerp(w.a[0], w.b[0], u), z = lerp(w.a[1], w.b[1], u); w.m.position.set(x, Math.abs(Math.sin(t * 7 + i)) * 0.06, z); w.m.rotation.y = Math.atan2(-(w.b[1] - w.a[1]) * dir, (w.b[0] - w.a[0]) * dir); });
  crowd.forEach((m, i) => { m.position.y = hopY([T.riseA[0] + 0.6 + i * 0.05, T.third - 0.1 + i * 0.05, T.guess + 0.05 + i * 0.07], t, 0.18) * (i % 3 === 2 ? 0.6 : 1); });
  // clouds
  for (const c of clouds) { c.position.x = c.userData.x0 + t * 1.2; c.material.opacity = 0.9 - 0.5 * night; const k = lerp(1, 0.45, night); c.material.color.setRGB(lerp(s.hor[0], 1, 0.55) * k, lerp(s.hor[1], 1, 0.55) * k, lerp(s.hor[2], 1, 0.55) * k * 1.05); }
  // sparkles: the giant's top as it jumps (twice); the board's room on the vote; the final wish
  { let k = 0; const put3 = (x, y, z, sz, on) => { const sp = sparks[k++]; if (!sp) return; const tw = Math.pow(Math.abs(Math.sin(t * sp.userData.w + sp.userData.ph)), 3); sp.position.set(x, y, z); sp.scale.setScalar(sz * (0.25 + tw)); sp.material.opacity = on * (0.3 + 0.7 * tw); sp.visible = on > 0.01; };
    const s1 = win(t, T.riseA[0], T.riseA[1] + 1.0, 0.2, 0.8) + win(t, T.riseB[0], T.riseB[1] + 1.0, 0.2, 0.8), top = topY(t); for (let i = 0; i < 44; i++) { const sp = sparks[i].userData, ph = (t * 0.5 + sp.k) % 1; put3(NV[0] + sp.dx * 12, top + 2 + ph * 26, NV[1] + sp.dz * 12, 1.8 + 1.6 * (1 - ph), Math.min(1, s1) * Math.sin(ph * Math.PI)); }
    const s2 = win(t, T.voted, T.in7 + 0.4, 0.2, 0.4); for (let i = 0; i < 12; i++) { const a = i * 0.52 + t * 1.1; put3(PV[0] + Math.cos(a) * 4.2, 3.0 + (i % 4) * 0.4, PV[1] + Math.sin(a) * 3.2, 0.7, s2); }
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
  riseA: T.riseA, rewind: T.rewind, walkOut: T.walkOut, sink: T.sink, walkIn: T.walkIn, riseB: T.riseB,
  hands: boardP.map((_, i) => +T.hands(i).toFixed(3)), guesses: GUESS.map((_, i) => +(T.guess + 0.05 + i * 0.07).toFixed(3)),
  typingA: [0, 1, 2, 3].map(i => +(T.sell + (i + 0.5) * 0.11).toFixed(3)), typingB: [0, 1, 2, 3].map(i => +(T.hold + (i + 0.5) * 0.11).toFixed(3)),
  postA: +T.postA.toFixed(3), postB: +T.postB.toFixed(3),
};
document.fonts.ready.then(() => Promise.all(['700 64px Figtree', '900 190px Fraunces', '800 30px JBM', '700 22px Inter', '700 78px Fraunces', '800 54px Figtree', '600 34px Figtree', '500 18px Inter', '900 128px JBM', '800 46px Inter', '900 150px Figtree', '900 112px Fraunces', '800 172px JBM', '700 34px Figtree', '900 118px Figtree', '800 44px JBM'].map(f => document.fonts.load(f)))).then(() => { fitHook(); renderAt(0); window.__ready = true; });
