// The Doubters' Worst Day — low-poly storybook scene (deterministic: window.renderAt(t) draws the frame for time t)
// Mon 23 Nov 2026: Nvidia's board brings Jensen Huang back; the stock jumps 31.5% ($125.53 → $165.05). The people betting on a fall
// (short sellers, "the doubters") lose about $12 billion on paper in one day, nearly all they had made since he quit (S3 Partners; ORTEX via
// Reuters). A European fund built to lose 3% for every 1% Nvidia rises falls about 91% and trading is halted (WSJ; Bloomberg data).
// The giant tower's height is Nvidia's share price (11 Nov close $173.73 = full height). The amber coin pile is the doubters' paper gains.
import * as THREE from 'three';
import { SKIN, MAT, GOLD, rng, GB, person, cloud, bushTree, tower, car, lamp, CHIP, CERT, CASH, BIGCOIN, WIN_LIT, GLASS_M, boardTable, hand, pavilion, kiosk, bank, savingsJar, house, cathedral } from './kit.js';

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
  doubters1: wt(1, 'doubters') - 0.1, billion: wt(1, 'billion') - 0.1, day1: wt(1, 'day') - 0.1,
  b2: S(2) - 0.05, worst: wt(2, 'worst') - 0.1, seven: wt(2, 'seven') - 0.1, years: wt(2, 'years') - 0.1,
  b3: S(3) - 0.05, how: wt(3, 'how') - 0.1, lose: wt(3, 'lose') - 0.1, much: wt(3, 'much') - 0.1, fast: wt(3, 'fast') - 0.1,
  b4: S(4) - 0.05, short: wt(4, 'short') - 0.1, borrows: wt(4, 'borrows') - 0.1, shares4: wt(4, 'shares') - 0.1, sells: wt(4, 'sells') - 0.1, hoping: wt(4, 'hoping') - 0.1, buy: wt(4, 'buy') - 0.1, cheaper: wt(4, 'cheaper') - 0.1,
  b5: S(5) - 0.05, jensen: wt(5, 'Jensen') - 0.1, quit: wt(5, 'quit') - 0.1, fell: wt(5, 'fell') - 0.1, week: wt(5, 'week') - 0.1, bet5: wt(5, 'bet') - 0.1, paid: wt(5, 'paid') - 0.1, billions: wt(5, 'billions') - 0.1,
  b6: S(6) - 0.05, monday: wt(6, 'Monday') - 0.1, board: wt(6, 'board') - 0.1, brought: wt(6, 'brought') - 0.1, back6: wt(6, 'back') - 0.1, jumped: wt(6, 'jumped') - 0.1, third: wt(6, 'third') - 0.1,
  b7: S(7) - 0.05, one7: wt(7, 'one') - 0.1, doubters7: wt(7, 'doubters') - 0.1, gave: wt(7, 'gave') - 0.1, all7: wt(7, 'all') - 0.1, that7: wt(7, 'that') - 0.1,
  b8: S(8) - 0.05, catch: wt(8, 'catch') - 0.1, share8: wt(8, 'share') - 0.1, fall8: wt(8, 'fall') - 0.1, zero: wt(8, 'zero') - 0.1, but8: wt(8, 'but') - 0.1, rise8: wt(8, 'rise') - 0.1, limit: wt(8, 'limit') - 0.1,
  b9: S(9) - 0.05, bigger: wt(9, 'bigger') - 0.1, funds: wt(9, 'funds') - 0.1, lose9: wt(9, 'lose') - 0.1, p3: wt(9, '3%') - 0.1, every: wt(9, 'every') - 0.1, p1: wt(9, '1%') - 0.1, rise9: wt(9, 'rise') - 0.1,
  b10: S(10) - 0.05, europe: wt(10, 'Europe') - 0.1, lost10: wt(10, 'lost') - 0.1, p90: wt(10, '90%') - 0.1, trading: wt(10, 'trading') - 0.1, halted: wt(10, 'halted') - 0.1,
  b11: S(11) - 0.05, overall: wt(11, 'Overall') - 0.1, still: wt(11, 'still') - 0.1, ahead: wt(11, 'ahead') - 0.1, story11: wt(11, 'story') - 0.1, over: wt(11, 'over') - 0.1,
  b12: S(12) - 0.05, story: wt(12, 'story') - 0.15, doubters12: wt(12, 'doubters') - 0.1, right: wt(12, 'right') - 0.1, wrong: wt(12, 'wrong') - 0.1, day12: wt(12, 'day') - 0.1,
  cta: S(13) - 0.1, would: wt(13, 'Would') - 0.1, ever: wt(13, 'ever') - 0.1, stock13: wt(13, 'stock') - 0.1, falling: wt(13, 'falling') - 0.1, comment: wt(13, 'Comment') - 0.15, yes: wt(13, 'YES') - 0.2, no: wt(13, 'NO') - 0.1,
};
T.riseA = [T.bigIn + 0.1, T.bigIn + 1.0];                     // flash-forward under the big number: Monday's jump
T.rewind = [T.b4 - 0.15, T.b4 + 0.9];                        // back to before he quit (11 Nov)
T.walkOut = [T.quit - 0.55, T.week + 0.3];                    // he leaves through the plaza
T.sink = [T.fell - 0.1, T.week + 0.5];                       // more than a quarter lower in a week (−28%)
T.hands = i => T.brought - 0.15 + i * 0.06;                  // the board's hands, one after another
T.walkIn = [T.b6 + 0.5, T.back6 + 0.6];                      // he walks back to the doors
T.riseB = [T.jumped - 0.15, T.third + 0.4];                  // almost a third higher (+31.5%)
T.drain = [T.lost10 - 0.05, T.p90 + 0.75];                   // the 3× short fund loses about 91%
T.postA = T.yes + 0.62; T.postB = T.no + 0.62;
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
const SKY = [[0, 'MORN'], [T.b4 - 0.2, 'MORN'], [T.b4 + 0.5, 'DAY'], [T.quit - 0.2, 'DAY'], [T.quit + 0.5, 'SUNSET'], [T.fell + 0.3, 'DUSK'], [T.week + 0.5, 'NIGHT'], [T.b6 + 0.15, 'NIGHT'], [T.b6 + 0.55, 'DAWN'], [T.board + 0.3, 'MORN'],
  [T.jumped + 0.4, 'DAY'], [T.b9, 'DAY'], [T.funds - 0.1, 'GOLDEN'], [T.b11 + 0.2, 'GOLDEN'], [T.ahead, 'SUNSET'], [T.b12 + 0.2, 'SUNSET'], [T.right + 0.2, 'DUSK'], [T.cta + 0.4, 'NIGHT'], [DUR + 2, 'NIGHT']];
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
const TEXS = [];   // canvas textures with text: drawn again once the fonts are in
function textTex(w, h, draw) { const cv = document.createElement('canvas'); cv.width = w; cv.height = h; const g = cv.getContext('2d'); draw(g, w, h); const tx = new THREE.CanvasTexture(cv); tx.colorSpace = THREE.SRGBColorSpace; tx.anisotropy = 4; TEXS.push(() => { g.clearRect(0, 0, w, h); draw(g, w, h); tx.needsUpdate = true; }); return tx; }

// ───────────────────────── ground, avenues, plaza
const ground = new THREE.Mesh(new THREE.PlaneGeometry(1600, 1600).rotateX(-Math.PI / 2), new THREE.MeshLambertMaterial({ color: 0xC9C2AE })); ground.receiveShadow = true; scene.add(ground);
const flat = new GB();
flat.box(8, 0.04, 300, 0x4A4E56, 44, 0.02, -90); flat.box(8, 0.04, 300, 0x4A4E56, -44, 0.021, -90);           // two avenues north-south
flat.box(1400, 0.04, 8, 0x4A4E56, 0, 0.022, -112); flat.box(1400, 0.04, 8, 0x4A4E56, 0, 0.023, -6);           // two east-west
for (const z of [-112, -6]) for (let x = -690; x < 690; x += 6) flat.box(2.6, 0.05, 0.22, 0xF2EEE2, x, 0.045, z);
flat.box(66, 0.07, 44, 0xE6DFD0, 0, 0.035, -42);                                                             // the plaza
for (let i = 0; i < 12; i++) flat.box(66, 0.075, 0.12, 0xD6CEBC, 0, 0.037, -62 + i * 3.6);
flat.box(16, 0.08, 14, 0x7FA86A, -22, 0.04, -30); flat.box(16, 0.08, 14, 0x7FA86A, 22, 0.041, -30);           // lawns
flat.cyl(8.4, 8.4, 0.09, 28, 0xD8CDB6, 0.5, 0.045, -28.6); flat.cyl(7.9, 7.9, 0.1, 28, 0xEFE7D6, 0.5, 0.05, -28.6);   // the round stage: the doubters' camp
{ const rr = rng(909); for (let i = 0; i < 70; i++) { const x = (rr() - 0.5) * 520, z = -230 + rr() * 300; if (Math.abs(x) < 40 && z > -100 && z < 0) continue; flat.box(6 + rr() * 14, 0.06, 6 + rr() * 14, rr() < 0.5 ? 0x8DAE74 : 0x9DB884, x, 0.03, z); } }
// the European street (the 3× fund): cobbles and pavements along z at x = EU[0]
const EU = [300, -60];
flat.box(12, 0.06, 120, 0x9A9488, EU[0], 0.03, EU[1] - 10); for (let i = 0; i < 40; i++) flat.box(11.6, 0.065, 0.1, 0x8A847A, EU[0], 0.033, EU[1] - 68 + i * 3);
flat.box(3, 0.09, 120, 0xCFC7B6, EU[0] - 7.5, 0.045, EU[1] - 10); flat.box(3, 0.09, 120, 0xCFC7B6, EU[0] + 7.5, 0.046, EU[1] - 10);
flat.box(40, 0.08, 22, 0xD9D0BC, EU[0], 0.04, EU[1] - 38);                                                   // the square in front of the fund
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
// the entrance building in front of it: glass doors, canopy, steps
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
// dashed boxes (the catch): the floor (a share can only fall to zero) and the open sky above (it can rise without limit)
function dashedBox(gw, gh, col) {
  const grp = new THREE.Group(), bx = new THREE.BoxGeometry(gw, gh, gw);
  const fill = new THREE.Mesh(bx, new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.2, depthWrite: false, fog: false }));
  const eb = new GB(), th = 0.55, dash = 1.8, gap = 1.1;
  const run = (L, f) => { for (let a = -L / 2; a < L / 2; a += dash + gap) { const b = Math.min(L / 2, a + dash); f((a + b) / 2, b - a); } };
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) run(gh, (c, l) => eb.box(th, l, th, 0xFFFFFF, sx * gw / 2, c, sz * gw / 2));
  for (const sy of [-1, 1]) for (const s2 of [-1, 1]) { run(gw, (c, l) => eb.box(l, th, th, 0xFFFFFF, c, sy * gh / 2, s2 * gw / 2)); run(gw, (c, l) => eb.box(th, th, l, 0xFFFFFF, s2 * gw / 2, sy * gh / 2, c)); }
  const edges = new THREE.Mesh(eb.geo(), new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.9, fog: false, toneMapped: false }));
  grp.add(fill, edges); grp.userData = { fill, edges, gh }; grp.visible = false; scene.add(grp); return grp;
}
const floorBox = dashedBox(23.4, NVH * R1, 0xFF6B5B);                     // from Monday's top down to the ground: the most a share can fall
const skyBox = dashedBox(23.4, 260, 0xFFC84A);                            // above the top: no ceiling
const floorPlate = new THREE.Mesh(new THREE.PlaneGeometry(40, 40).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: 0xFF6B5B, transparent: true, opacity: 0, depthWrite: false, fog: false }));
floorPlate.position.set(NV[0], 0.2, NV[1] + 6); floorPlate.renderOrder = 3; scene.add(floorPlate);
// the price screen on its pylon
const pylon = new THREE.Group(); { const b = new GB(); b.box(4.6, 40, 3.6, 0x3A4048, 0, 20, -2.6); b.box(13.2, 14.8, 1.2, 0x23272E, 0, SCR[1], 0.3); b.box(13.8, 0.5, 1.6, 0x8A8F96, 0, SCR[1] + 7.6, 0.3); b.box(13.8, 0.5, 1.6, 0x8A8F96, 0, SCR[1] - 7.6, 0.3); b.box(5.6, 1.2, 4.6, 0x8A8F96, 0, 0.6, -2.6); pylon.add(b.mesh()); }
pylon.position.set(SCR[0], 0, SCR[2]); pylon.rotation.y = SCR_RY; scene.add(pylon);
const scrCv = document.createElement('canvas'); scrCv.width = 720; scrCv.height = 810; const scrTx = new THREE.CanvasTexture(scrCv); scrTx.colorSpace = THREE.SRGBColorSpace; scrTx.anisotropy = 4;
const screen = new THREE.Mesh(new THREE.PlaneGeometry(12.4, 13.95), new THREE.MeshBasicMaterial({ map: scrTx, toneMapped: false })); screen.position.set(0, SCR[1], 0.95); pylon.add(screen);
stat.push([SCR[0] - 7, SCR[0] + 7, SCR[2] - 6, SCR[2] + 6, 41, 'screen']);
// the board's glass room on the plaza: a long table, eight members
const PV = [-11, -51];
const pav = pavilion(11, 8, 3.6); pav.position.set(PV[0], 0, PV[1]); scene.add(pav); stat.push([PV[0] - 6, PV[0] + 6, PV[1] - 4.6, PV[1] + 4.6, 4.8, 'pavilion']);
const TBL = boardTable(4); TBL.rotation.y = Math.PI / 2; TBL.position.set(PV[0], 0.34, PV[1]); scene.add(TBL);
const SEATS = TBL.userData.seats.map(([x, z, ry]) => [PV[0] + z, PV[1] - x, ry + Math.PI / 2]);
const modern = (i, extra = {}) => ({ robe: [0x34405A, 0x6A2E3E, 0x3F6A5A, 0x5A5A66, 0x7A5A3A, 0x2F4A6A, 0x8A3A3A, 0x3B6FA8, 0xB0603A, 0x4E7A3E][i % 10], skin: SKIN[i % 5], short: [0x231C18, 0x5A3E28, 0xC9A27A, 0x3A2A1E, 0x8A8A8A][i % 5], shirt: i % 2 ? 0xF4F2EC : undefined, ...extra });
const boardP = SEATS.slice(1).map(([x, z, ry], i) => { const o = modern(i + 2, { s: 0.98 }); const m = person(o); m.position.set(x - Math.cos(ry) * 0.15, 0, z + Math.sin(ry) * 0.15); m.rotation.y = ry; scene.add(m);
  const hd = hand(o.robe, o.skin); hd.position.set(0.02, 1.08, -0.36); hd.rotation.x = -0.22; hd.scale.set(1, 0.01, 1); m.add(hd); return { m, hd }; });
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

// ───────────────────────── the doubters' camp on the round stage: eight short sellers, a red banner, their pile of paper gains
const ST = [0.5, -28.6];
const DPOS = [[-3.4, -27.0], [-1.2, -26.6], [1.0, -26.6], [3.2, -27.0], [-2.4, -29.4], [-0.2, -29.8], [2.0, -29.8], [4.2, -29.4]];
const PILE = [0.3, -23.4];
const doubters = DPOS.map(([x, z], i) => { const m = person(modern(i + 1, { tie: 0xD9483B, shirt: 0xF4F2EC, s: 1.02 })); m.position.set(x, 0.1, z); m.rotation.y = -Math.PI / 2; scene.add(m); return m; });   // facing south, the giant behind them
const LEAD = 0;                                                                                     // the one who borrows (front left)
{ const b = new GB(); for (const x of [-3.6, 4.6]) { b.cyl(0.08, 0.1, 4.2, 6, 0x5A5F66, x, 2.1, -31.4); b.ball(0.14, 0, 0xE2B24A, x, 4.25, -31.4); } const m = b.mesh(); scene.add(m); stat.push([-3.8, 4.8, -31.6, -31.2, 4.4, 'banner']); }
const flagTx = textTex(1000, 180, (g, w, h) => { g.fillStyle = '#D9483B'; g.fillRect(0, 0, w, h); g.strokeStyle = '#F6F2EA'; g.lineWidth = 8; g.strokeRect(10, 10, w - 20, h - 20); g.fillStyle = '#fff'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = '900 104px Figtree'; g.fillText('▼  SHORT  ▼', w / 2, h / 2 + 6); });
const flag = new THREE.Mesh(new THREE.PlaneGeometry(8.0, 1.44, 12, 1), new THREE.MeshLambertMaterial({ map: flagTx, side: THREE.DoubleSide })); flag.position.set(0.5, 3.35, -31.35); scene.add(flag);
const flagP0 = flag.geometry.attributes.position.array.slice();
stat.push([-7.9, 8.9, -37.2, -20.2, 2.4, 'stage']);
// the pile of paper gains: amber coins in stacks in front of the doubters
const NC = 72, KEEP = 8;                                       // KEEP: what is left after Monday (they are still ahead overall)
const coinG = BIGCOIN(0.42, 0.15), coins = new THREE.InstancedMesh(coinG, GOLD, NC); coins.castShadow = true; coins.frustumCulled = false; scene.add(coins);   // instances fly far from the pile
const HOME = []; { const cols = [[-1.6, -23.6], [-0.4, -23.3], [0.8, -23.3], [2.0, -23.6], [-1.0, -22.4], [0.2, -22.2], [1.4, -22.4], [-0.4, -24.6], [0.8, -24.6]];
  const per = Math.ceil(NC / cols.length); for (let i = 0; i < NC; i++) { const c = cols[i % cols.length], k = Math.floor(i / cols.length); HOME.push([c[0] + (R() - 0.5) * 0.08, 0.15 + k * 0.16, c[1] + (R() - 0.5) * 0.08, R() * 6]); } }
const ORDER = Array.from({ length: NC }, (_, i) => i);          // pile order: index = height order, so coins come and go from the top
const tEarn = i => lerp(T.fell + 0.6, T.billions + 0.3, i / (NC - 1));   // landing times; each coin flies 1.2 s from the giant
const tGive = j => lerp(T.gave - 0.2, T.that7 + 0.25, j / (NC - KEEP - 1));   // j = 0 is the top coin
const tFlash = j => lerp(T.bigIn + 0.15, T.bigIn + 1.05, j / (NC - KEEP - 1));
const _m4 = new THREE.Matrix4(), _q = new THREE.Quaternion(), _e = new THREE.Euler(), _p = new THREE.Vector3(), _s = new THREE.Vector3();
const GIVE_TO = [0, 9, -71];                                                    // the coins fly back toward the giant
function coinState(i, t) {         // [x, y, z, scale, spin]
  const [hxx, hy, hz, ph] = HOME[i], top = NC - 1 - i;                          // top = 0 for the highest coin
  const gone = (a, b) => { const u = seg(t, a, b); return u; };
  // 0 → rewind: full pile, minus the flash-forward (coins above KEEP shrink away under the big number)
  if (t < T.rewind[0]) { if (i >= KEEP) { const u = gone(tFlash(top), tFlash(top) + 0.25); return [hxx, hy + u * 0.6, hz, 1 - u, ph + u * 4]; } return [hxx, hy, hz, 1, ph]; }
  // rewind: the rest shrink away (before he quit there was nothing to win yet)
  if (t < T.fell - 0.7) { if (i >= KEEP) return [hxx, hy, hz, 0, ph]; const u = seg(t, T.rewind[0], T.rewind[0] + 0.5); return [hxx, hy, hz, 1 - u, ph]; }
  // the week after he quit: coins drop onto the pile
  if (t < T.b7) { const a = tEarn(i), u = seg(t, a - 1.2, a); if (u <= 0) return [hxx, hy, hz, 0, ph]; if (u >= 1) return [hxx, hy, hz, 1, ph];
    const sx = NV[0] + ((i * 37) % 13 - 6) * 0.9, sy = NVH * ratioAt(a - 1.2) + 1, sz = NV[1] + 12, v = u;
    return [lerp(sx, hxx, v), lerp(sy, hy, v) + Math.sin(v * Math.PI) * 14, lerp(sz, hz, v), 1 + 1.6 * Math.sin(v * Math.PI), ph + (1 - v) * 8]; }
  // Monday: everything above KEEP flies back to the giant
  if (i < KEEP) return [hxx, hy, hz, 1, ph];
  const a = tGive(top), u = seg(t, a, a + 0.75); if (u <= 0) return [hxx, hy, hz, 1, ph];
  if (u >= 1) return [hxx, hy, hz, 0, ph];
  const x = lerp(hxx, GIVE_TO[0], u), z = lerp(hz, GIVE_TO[2], u), y = lerp(hy, GIVE_TO[1], u) + Math.sin(u * Math.PI) * 9;
  return [x, y, z, 1 - 0.6 * u, ph + u * 9];
}
function updateCoins(t) {
  for (let i = 0; i < NC; i++) { const [x, y, z, s, sp] = coinState(i, t); _p.set(x, y, z); _q.setFromEuler(_e.set(0.1 * Math.sin(sp), sp, 0.08 * Math.cos(sp))); _s.setScalar(Math.max(0.001, s)); _m4.compose(_p, _q, _s); coins.setMatrixAt(i, _m4); }
  coins.instanceMatrix.needsUpdate = true;
}
const pileH = t => { let n = 0; for (let i = 0; i < NC; i++) if (coinState(i, t)[3] > 0.5) n++; return n; };
// the lender's kiosk (shares to borrow) and a buyer on the plaza
const KI = [-16.6, -25.5], SEL = [-13.2, -25.5];
const ki = kiosk(); ki.position.set(KI[0], 0, KI[1]); scene.add(ki); stat.push([KI[0] - 1.7, KI[0] + 2.4, KI[1] - 2.0, KI[1] + 2.0, 4.1, 'kiosk']);
const lender = person(modern(7, { s: 1.0 })); lender.position.set(KI[0] - 0.4, 0, KI[1]); lender.rotation.y = 0; scene.add(lender);
const BUY = [-9.9, -25.5];
const buyer = person(modern(4, { badge: true, s: 1.02 })); buyer.position.set(BUY[0], 0, BUY[1]); buyer.rotation.y = Math.PI - 0.25; scene.add(buyer);
const seller = person(modern(6, { tie: 0xD9483B, shirt: 0xF4F2EC, s: 1.02 })); seller.position.set(SEL[0], 0, SEL[1]); scene.add(seller);
const CERTS = Array.from({ length: 5 }, () => { const m = new THREE.Mesh(CERT, MAT); m.scale.setScalar(0.9); m.castShadow = true; m.visible = false; scene.add(m); return m; });
const CASHM = Array.from({ length: 3 }, () => { const m = new THREE.Mesh(CASH, MAT); m.scale.setScalar(0.7); m.castShadow = true; m.visible = false; scene.add(m); return m; });
const LEADP = () => SEL;

// ───────────────────────── Europe: a street of old houses, a cathedral, and the 3× short fund with its value in a glass jar
const EUB = [EU[0], -112];                                                        // the fund building (faces +z, down the street)
{ const hr = rng(1720), COLS = [0xB8644A, 0xD9C3A0, 0xC98A5A, 0xE2D6BE, 0x9A5A48, 0xCFB28A];
  for (const side of [-1, 1]) for (let k = 0; k < 6; k++) { const w = 9 + hr() * 3, h = 9 + hr() * 6, d = 9;
    const m = house(w, h, d, { rand: hr, color: COLS[Math.floor(hr() * COLS.length)], front: 1, shop: k % 3 === 1 }); m.position.set(EU[0] + side * 15, 0, EU[1] + 52 - k * 12.5); m.rotation.y = side < 0 ? Math.PI / 2 : -Math.PI / 2; m.castShadow = true; m.receiveShadow = true; scene.add(m);
    stat.push([EU[0] + side * 15 - 5.5, EU[0] + side * 15 + 5.5, EU[1] + 52 - k * 12.5 - 7, EU[1] + 52 - k * 12.5 + 7, h + 4, 'house']); }
  const cat = cathedral(); cat.position.set(EU[0] + 34, 0, -190); cat.rotation.y = -Math.PI / 2; scene.add(cat); stat.push([EU[0] + 14, EU[0] + 54, -210, -170, 35, 'cathedral']);
  for (const [dx, dz] of [[-26, -96], [26, -92], [-30, -120], [30, -124]]) { const m = bushTree(6 + hr() * 2, hr); m.position.set(EU[0] + dx, 0, dz); scene.add(m); } }
const fund = bank(); fund.position.set(EUB[0], 0, EUB[1]); scene.add(fund); stat.push([EUB[0] - 13, EUB[0] + 13, EUB[1] - 9, EUB[1] + 12, 16, 'fund']);
const fundSign = new THREE.Mesh(new THREE.PlaneGeometry(20, 2.1), new THREE.MeshBasicMaterial({ map: textTex(1400, 148, (g, w, h) => { g.fillStyle = '#EDE6D6'; g.fillRect(0, 0, w, h); g.fillStyle = '#3A2E24'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = '900 92px Fraunces'; g.fillText('3× SHORT FUND', w / 2, 80); }), toneMapped: false }));
fundSign.position.set(EUB[0], fund.userData.signY, EUB[1] + fund.userData.signZ + 0.05); scene.add(fundSign);
const JAR = [EUB[0] + 8.5, -90.5];
const jar = savingsJar(1.4, 2.8, 1.2); jar.scale.setScalar(2.3); jar.position.set(JAR[0], 0, JAR[1]); scene.add(jar); jar.children[1].material = new THREE.MeshLambertMaterial({ color: 0xDDF2FF, transparent: true, opacity: 0.34, depthWrite: false });
{ const b = new GB(); for (let i = 0; i <= 10; i++) b.box(i % 5 ? 0.35 : 0.7, 0.06, 0.06, 0x2A2F38, -1.5, 1.32 + i * 0.263, 0); jar.add(b.mesh()); }   // a scale on the glass, 0-100% stat.push([JAR[0] - 4.4, JAR[0] + 4.4, JAR[1] - 4.4, JAR[1] + 4.4, 12, 'jar']);
const liqM = new THREE.MeshLambertMaterial({ color: 0xF7B500, emissive: 0xA86A00, emissiveIntensity: 0.5 });
const liq = new THREE.Mesh(new THREE.CylinderGeometry(1.32, 1.32, 1, 16).translate(0, 0.5, 0), liqM); liq.position.y = jar.userData.floorY; jar.add(liq);
const LIQH = jar.userData.H * 0.94;
// the barrier that drops when trading is halted, at the foot of the fund's steps
const BAR = [EUB[0] - 2.2, -97.2];
{ const b = new GB(); b.box(0.5, 2.0, 0.5, 0x4A4E54, 0, 1.0, 0); b.box(0.8, 0.3, 0.8, 0x4A4E54, 0, 0.15, 0); const m = b.mesh(); m.position.set(BAR[0], 0, BAR[1]); scene.add(m); }
const barArm = new THREE.Group(); { const b = new GB(); for (let i = 0; i < 6; i++) b.box(0.3, 1.3, 0.3, i % 2 ? 0xF6F2EA : 0xD9483B, 0, 0.65 + i * 1.3, 0); barArm.add(b.mesh()); }
barArm.position.set(BAR[0], 1.9, BAR[1]); scene.add(barArm);
const haltTx = textTex(560, 160, (g, w, h) => { g.fillStyle = '#D9483B'; g.fillRect(0, 0, w, h); g.strokeStyle = '#fff'; g.lineWidth = 10; g.strokeRect(10, 10, w - 20, h - 20); g.fillStyle = '#fff'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = '900 76px Figtree'; g.fillText('HALTED', w / 2, h / 2 + 4); });
const haltSign = new THREE.Mesh(new THREE.PlaneGeometry(7, 2), new THREE.MeshBasicMaterial({ map: haltTx, toneMapped: false, transparent: true, opacity: 0 })); haltSign.position.set(EUB[0], 9.2, EUB[1] + 8.8); scene.add(haltSign);
const EUP = [[-2.6, -88.2], [-0.8, -87.4], [1.4, -88.0], [3.4, -87.2], [-4.4, -86.6]].map(([dx, z], i) => { const m = person(modern(i + 5, { s: 1.0 })); m.position.set(EU[0] + dx + 2, 0, z); m.rotation.y = Math.PI / 2 - 0.3 + i * 0.12; scene.add(m); return m; });
const EUW = [[-4.5, -20, 0, -40], [4.5, -50, 0, 30], [-4, 0, 1, -30]].map(([dx, z, s, L], i) => { const m = person(modern(i + 2, { s: 1.0 })); scene.add(m); return { m, x: EU[0] + dx, z, L, ph: i * 0.3 }; });

// street life: lamps, trees, cars, people on the plaza
const lampHeads = new GB();
for (const z of [-24, -40, -56]) for (const s of [-1, 1]) { const l = lamp(6.2); l.position.set(s * 34, 0, z); l.rotation.y = s > 0 ? Math.PI : 0; scene.add(l); lampHeads.box(0.6, 0.12, 0.36, 0xFFFFFF, s * 34 - s * 1.25, 6.02, z); }
for (const z of [-20, -44, -68]) for (const s of [-1, 1]) { const l = lamp(5.4); l.position.set(EU[0] + s * 8.6, 0, z); l.rotation.y = s > 0 ? Math.PI : 0; scene.add(l); lampHeads.box(0.6, 0.12, 0.36, 0xFFFFFF, EU[0] + s * 8.6 - s * 1.25, 5.22, z); }
const lampM = new THREE.MeshLambertMaterial({ color: 0xFFF1C8, emissive: 0xFFD27A, emissiveIntensity: 0 }); scene.add(new THREE.Mesh(lampHeads.geo(), lampM));
for (const [x, z] of [[-40, 6], [36, 10], [-20, 28], [22, 40], [-48, 46], [46, 58], [-8, 62], [10, 20], [27, -24], [27, -62], [17, -17], [-31, -64], [-52, -14], [54, -16], [62, -32], [-62, -24]]) { const m = bushTree(5.5 + R() * 2, R); m.position.set(x, 0, z); scene.add(m); stat.push([x - 2, x + 2, z - 2, z + 2, 8, 'tree']); }
const CARS = [[0xC8423A, -108.5, 1, 8, 0], [0x2F6FB8, -115.5, -1, 9, 40], [0xE9C46A, -2.5, 1, 7, 150], [0x4C9A62, -9.5, -1, 8, 230], [0xEDEDED, -108.5, 1, 8.6, 300], [0x7A4FA0, -9.5, -1, 7, 90], [0xD9664A, -2.5, 1, 9, 420]].map(([col, z, dir, v, off]) => { const m = car(col, { boxy: true }); scene.add(m); return { m, z, dir, v, off }; });
const WALK = [[-26, -40, 12, -6], [14, -44, -6, 4], [-22, -54, 8, 4], [22, -36, -6, -5], [-28, -24, 10, 6]].map(([x, z, dx, dz], i) => { const m = person(modern(i, { badge: i % 3 === 0 })); scene.add(m); return { m, a: [x, z], b: [x + dx, z + dz], sp: 0.06 + i * 0.011, ph: i * 0.27 }; });

// ───────────────────────── sky clutter: clouds, birds, sparkles
const clouds = []; { const cr = rng(5150); for (let i = 0; i < 12; i++) { const m = cloud(cr); m.position.set(-640 + i * 110 + cr() * 40, 150 + cr() * 50, -720 - cr() * 160); m.scale.setScalar(2.4 + cr() * 1.6); m.userData.x0 = m.position.x; scene.add(m); clouds.push(m); } }
const birdMat = new THREE.MeshBasicMaterial({ color: 0x2A2430, side: THREE.DoubleSide });
const wingG = new THREE.BufferGeometry(); wingG.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0.1, 1.6, 0, -0.3, 1.5, 0, 0.5], 3));
const FLOCK = [{ t0: 0, t1: T.b3 + 0.5, a: [-50, 30, -40], b: [40, 40, -90] }, { t0: T.b9 + 1.0, t1: T.b10 + 2.5, a: [EU[0] - 40, 26, -40], b: [EU[0] + 40, 34, -120] }];
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
  if (t < T.rewind[0]) return lerp(RL, R1, eio(seg(t, T.riseA[0], T.riseA[1])));      // Friday's close, then (flash-forward) Monday's
  if (t < T.sink[0]) return lerp(R1, 1, sm(T.rewind[0], T.rewind[1], t));              // back to before he quit
  if (t < T.riseB[0]) return lerp(1, RL, eio(seg(t, T.sink[0], T.sink[1])));
  return lerp(RL, R1, eio(seg(t, T.riseB[0], T.riseB[1])));
}
const topY = t => NVH * ratioAt(t);

// ───────────────────────── the price screen: one canvas, redrawn only when what it shows changes
const F = (w, px, fam) => `${w} ${px}px ${fam}`;
let scrKey = '';
function scrMode(t) {
  if (t < T.bigIn) return ['fri', 1, 1];
  if (t < T.b4 - 0.2) return ['jump', seg(t, T.riseA[0], T.riseA[1]), 1];
  if (t < T.b5 - 0.2) return ['before', seg(t, T.b4, T.b4 + 0.6), 0];
  if (t < T.b6 + 0.2) return ['fall', seg(t, T.sink[0], T.sink[1]), seg(t, T.week - 0.1, T.week + 0.2)];
  if (t < T.b8 - 0.1) return ['jump', seg(t, T.riseB[0], T.riseB[1]), seg(t, T.third - 0.1, T.third + 0.2)];
  if (t < T.b11 - 0.1) return ['limit', seg(t, T.fall8 - 0.1, T.zero + 0.3), seg(t, T.rise8 - 0.1, T.limit + 0.4)];
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
  const yP = p => lerp(600, 190, (p - 120) / (180 - 120));     // price → screen y ($120 … $180)
  const FALL = [[60, yP(173.73)], [150, yP(166.19)], [240, yP(162.85)], [330, yP(156.14)], [420, yP(155.46)], [510, yP(150.96)], [590, yP(145.98)], [670, yP(125.53)]];
  if (mode === 'fri') {
    g.fillStyle = '#FFD27A'; g.font = F(800, 42, 'Inter'); g.fillText('NVDA · FRI 20 NOV 2026', 360, 60);
    line(FALL, '#FF6B5B', 16);
    g.font = F(900, 128, 'JBM'); g.fillStyle = '#FF6B5B'; g.fillText('▼28%', 360, 690);
    g.fillStyle = 'rgba(255,255,255,0.7)'; g.font = F(700, 32, 'Inter'); g.fillText('SINCE HE QUIT · CLOSE $125.53', 360, 775);
  } else if (mode === 'jump') {
    g.fillStyle = '#FFD27A'; g.font = F(800, 42, 'Inter'); g.fillText('NVDA · MON 23 NOV 2026', 360, 60);
    const pts = [[60, yP(125.53)], [160, yP(131)], [250, yP(139)], [330, yP(146)], [420, yP(152)], [510, yP(160)], [590, yP(158)], [670, yP(165.05)]];
    line(partial(pts, lerp(0.12, 1, eo(a))), '#F7B500', 16);
    g.font = F(900, 128, 'JBM'); g.fillStyle = b > 0.3 ? '#FFC84A' : 'rgba(255,255,255,0.15)'; g.fillText('▲31.5%', 360, 690);
    g.fillStyle = 'rgba(255,255,255,0.7)'; g.font = F(700, 32, 'Inter'); g.fillText('$125.53 → $165.05 · CLOSE', 360, 775);
  } else if (mode === 'before') {
    g.fillStyle = '#FFD27A'; g.font = F(800, 40, 'Inter'); g.fillText('NVDA · WED 11 NOV 2026', 360, 60);
    g.globalAlpha = 0.3 + 0.7 * a; g.fillStyle = '#FFFFFF'; g.font = F(900, 150, 'JBM'); g.fillText('$173.73', 360, 380); g.globalAlpha = 1;
    g.fillStyle = 'rgba(255,255,255,0.75)'; g.font = F(700, 34, 'Inter'); g.fillText('LAST CLOSE BEFORE HE QUIT', 360, 560);
  } else if (mode === 'fall') {
    g.fillStyle = '#FFD27A'; g.font = F(800, 42, 'Inter'); g.fillText('NVDA · 11 → 20 NOV 2026', 360, 60);
    line(partial(FALL, lerp(0.1, 1, eo(a))), a > 0.3 ? '#FF6B5B' : '#F7B500', 16);
    g.font = F(900, 128, 'JBM'); g.fillStyle = b > 0.3 ? '#FF6B5B' : 'rgba(255,255,255,0.15)'; g.fillText('▼28%', 360, 690);
    g.fillStyle = 'rgba(255,255,255,0.7)'; g.font = F(700, 32, 'Inter'); g.fillText('$173.73 → $125.53 · CLOSE', 360, 775);
  } else if (mode === 'limit') {
    g.fillStyle = '#FFD27A'; g.font = F(800, 40, 'Inter'); g.fillText('A SHARE CAN…', 360, 60);
    g.globalAlpha = 0.25 + 0.75 * a; g.fillStyle = '#FF8A7A'; g.font = F(900, 74, 'Figtree'); g.fillText('FALL TO $0', 360, 560); g.font = F(700, 34, 'Inter'); g.fillText('AT MOST', 360, 625);
    g.strokeStyle = '#FF8A7A'; g.lineWidth = 8; g.beginPath(); g.moveTo(120, 700); g.lineTo(600, 700); g.stroke();
    g.globalAlpha = 0.25 + 0.75 * b; g.fillStyle = '#FFC84A'; g.font = F(900, 74, 'Figtree'); g.fillText('RISE', 360, 250); g.font = F(700, 34, 'Inter'); g.fillText('WITH NO CEILING', 360, 315);
    g.beginPath(); g.moveTo(360, 200); g.lineTo(360, 120); g.strokeStyle = '#FFC84A'; g.stroke(); g.beginPath(); g.moveTo(330, 145); g.lineTo(360, 110); g.lineTo(390, 145); g.stroke(); g.globalAlpha = 1;
  } else if (mode === 'today') {
    g.fillStyle = '#FFD27A'; g.font = F(800, 40, 'Inter'); g.fillText('NVDA · AS OF 23 NOV 2026', 360, 60);
    g.fillStyle = '#FFFFFF'; g.font = F(900, 150, 'JBM'); g.fillText('$165.05', 360, 360);
    g.fillStyle = 'rgba(255,255,255,0.75)'; g.font = F(700, 34, 'Inter'); g.fillText('CLOSE · STORY NOT OVER', 360, 540);
  } else if (mode === 'cta') {
    g.font = F(900, 170, 'Figtree'); g.fillStyle = '#F7B500'; g.fillText('YES', 360, 220); g.fillStyle = '#6FD0C0'; g.fillText('NO', 360, 560);
    g.fillStyle = '#FFFFFF'; g.font = F(800, 60, 'Inter'); g.fillText('or', 360, 390); g.font = F(700, 38, 'Inter'); g.fillStyle = 'rgba(255,255,255,0.8)'; g.fillText('YOU DECIDE', 360, 720);
  }
  scrTx.needsUpdate = true;
}

// ───────────────────────── camera path (spherical keys around a target; `up` tilts the view so the subject sits lower in the frame)
const SCRF = (dx = 0, dy = 0) => [SCR[0] + dx, SCR[1] + dy, SCR[2]];
const FDT = [FD[0], 1.7, FD[1]];
const EUT = (dx = 0, dy = 0, dz = 0) => [EU[0] + dx, dy, dz];
const CAM = [
  { t: 0, tg: [0.4, 2.6, -40], d: 34.8, az: -4, el: 0, up: 0.016 },                                 // the cover: the doubters' camp, the giant behind them, Monday morning
  { t: T.bigOut, tg: [0.4, 2.5, -38], d: 30, az: -6, el: 1, up: 0.02, mv: 1 },
  { t: T.worst + 0.2, tg: [0.4, 1.6, -28], d: 13, az: -10, el: 5, up: 0.05, mv: 1 },                 // their worst day: the slumped doubters
  { t: T.fast + 0.3, tg: [0.6, 1.7, -28], d: 12, az: -4, el: 5, up: 0.05 },
  { t: T.borrows + 0.3, tg: [-15.0, 1.5, -25.5], d: 19, az: -6, el: 7, up: 0.05, mv: 1 },            // borrow: the lender's kiosk and the short seller
  { t: T.sells + 0.35, tg: [-11.7, 1.5, -25.5], d: 19, az: 4, el: 7, up: 0.05, mv: 1 },              // sell: the short seller and the buyer
  { t: T.cheaper + 0.3, tg: [-12.6, 1.5, -25.5], d: 22, az: 0, el: 7, up: 0.05, mv: 1 },
  { t: T.quit + 0.05, tg: [2.5, 2.0, -59.5], d: 21, az: 24, el: 14, up: 0.1, mv: 1 },               // he walks out
  { t: T.fell + 0.8, tg: [1, 26, -66], d: 120, az: 6, el: 10, up: 0.0, mv: 1 },                      // pull back: the giant sinks all week, money streams to the doubters
  { t: T.billions + 0.5, tg: [1, 23, -66], d: 112, az: 0, el: 10, up: 0.0 },
  { t: T.b6 + 0.35, tg: [-14, 150, -62], d: 40, az: 8, el: -32, up: 0, mv: 1 },                      // sky wipe: night → Monday dawn
  { t: T.board + 0.25, tg: [PV[0] + 0.3, 1.2, PV[1]], d: 21, az: 20, el: 40, up: 0.03, mv: 3 },      // the board's glass room
  { t: T.back6 + 0.5, tg: [-2.5, 1.8, -58.5], d: 24, az: 14, el: 22, up: 0.08, mv: 1 },              // he walks back to the doors
  { t: T.third + 0.3, tg: [2, 34, -76], d: 160, az: 8, el: 9, up: 0.05, mv: 1 },                     // the giant jumps almost a third
  { t: T.gave + 0.1, tg: [0.4, 3.0, -40], d: 33, az: -6, el: 1, up: 0.05, mv: 1 },                   // the pile flies back to the giant, over their heads
  { t: T.that7 + 0.5, tg: [0.4, 3.2, -40], d: 31, az: -2, el: 1, up: 0.06 },
  { t: T.share8 + 0.2, tg: [0, 34, NV[1]], d: 150, az: 6, el: 6, up: 0.04, mv: 1 },                  // the catch: the floor…
  { t: T.zero + 0.5, tg: [0, 30, NV[1]], d: 146, az: 8, el: 6, up: 0.04 },
  { t: T.limit + 0.4, tg: [0, 130, NV[1]], d: 200, az: 10, el: 2, up: 0.06, mv: 1 },                // …and no ceiling: tilt up the open sky
  { t: T.bigger + 0.25, tg: [140, 300, -70], d: 60, az: 40, el: -30, up: 0, mv: 2 },                // sky wipe → Europe
  { t: T.funds + 0.45, tg: EUT(0, 9, -100), d: 70, az: 0, el: 9, up: 0.03, mv: 3 },                  // the street and the fund
  { t: T.rise9 + 0.3, tg: EUT(0, 8.6, -101), d: 64, az: -3, el: 9, up: 0.03 },
  { t: T.lost10 + 0.1, tg: EUT(6.5, 5.2, -91), d: 34, az: -12, el: 6, up: 0.04, mv: 1 },             // the jar drains
  { t: T.p90 + 0.6, tg: EUT(6.8, 5.2, -91), d: 32, az: -16, el: 6, up: 0.04 },
  { t: T.halted + 0.3, tg: EUT(0, 5.0, -99), d: 34, az: 0, el: 6, up: 0.02, mv: 1 },               // halted: the sign, the door, the barrier
  { t: T.overall + 0.25, tg: [160, 260, -60], d: 60, az: -40, el: -30, up: 0, mv: 2 },              // sky wipe → back to the plaza
  { t: T.ahead + 0.3, tg: [0.4, 2.8, -40], d: 33, az: -2, el: 1, up: 0.04, mv: 3 },                   // still ahead overall
  { t: T.over + 0.45, tg: [6, 22, -60], d: 150, az: 14, el: 12, up: 0.06, mv: 1 },                   // wide: the story isn't over
  { t: T.right + 0.4, tg: [0, 22, -62], d: 290, az: 20, el: 21, up: 0.16, mv: 3 },                  // crane up over the city at dusk
  { t: T.cta + 0.1, tg: [0, 20, -60], d: 280, az: 16, el: 21, up: 0.16 },
  { t: T.comment, tg: SCRF(0, -1.0), d: 62, az: -26, el: 9, up: 0.0, mv: 1 },                       // the screen: yes or no
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
.card{font:700 30px/1.3 'Figtree',sans-serif;color:#fff;background:rgba(8,10,26,.88);border:2px solid rgba(255,225,160,.65);padding:16px 24px;border-radius:20px;text-align:left;white-space:pre;box-shadow:0 12px 34px rgba(5,7,20,.5);}
.card em{font-style:normal;color:#FFC84A;} .card s{text-decoration:none;color:#FF8A7A;} .card u{text-decoration:none;color:#9BE0A8;} .card i{font-style:normal;opacity:.35;}
.cmp{width:820px;padding:26px 34px 22px;box-sizing:border-box;background:rgba(8,10,26,.88);border:2px solid rgba(255,225,160,.6);border-radius:30px;box-shadow:0 18px 50px rgba(5,7,20,.5);}
.cmp .t{font:700 22px/1 'Inter',sans-serif;letter-spacing:.28em;text-transform:uppercase;color:#FFD27A;text-align:center;margin-bottom:8px;}
.cmp .r{margin-top:18px;}
.cmp .n{font:700 25px/1 'Inter',sans-serif;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.85);}
.cmp .b{margin-top:10px;height:66px;border-radius:14px;display:flex;align-items:center;justify-content:flex-end;padding-right:18px;box-sizing:border-box;font:800 38px/1 'JBM',monospace;white-space:nowrap;overflow:hidden;}
.cmp .b.am{background:#F7A600;color:#1C1300;} .cmp .b.rd{background:#D9483B;color:#fff;}
.cmp .s{margin-top:16px;font:500 18px/1 'Inter',sans-serif;letter-spacing:.04em;color:rgba(255,255,255,.6);text-align:center;}
.tag.dn{color:#fff;background:#D9483B;border-color:#D9483B;} .tag.dn b{color:#fff;}
.tag.gn{color:#0A2A12;background:#9BE0A8;border-color:#3FAE6A;} .tag.gn b{color:#0A2A12;}
.bub{font:800 44px/1 'Figtree',sans-serif;color:#1C1300;background:#FFE7A6;border:2px solid #F7A600;padding:8px 18px 9px;border-radius:18px;box-shadow:0 6px 18px rgba(5,7,20,.35);}
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
const tagCamp = mk('tag', 'short sellers · betting on a <b>fall</b>');
const tagWorst = mk('tag dn', 'worst day since at least <b>2019</b>');
const bubHow = mk('bub', 'how?!');
const steps = mk('card', '');
const tagLender = mk('tag grey', 'lender'), tagBuyer = mk('tag grey', 'buyer'), tagSeller = mk('tag dn', 'short <b>seller</b>'), tagMan = mk('tag', 'Jensen Huang <b>quits</b>');
const tagFall = mk('tag dn', '$173.73 → $125.53 · <b>−28%</b>'), tagJump = mk('tag am', '$125.53 → $165.05 · <b>+31.5%</b>');
const tagGain = mk('tag am', '+ billions <b>on paper</b>');
const tagBoard = mk('tag am', 'the board brings him <b>back</b>');
const tagGave = mk('tag dn', 'about <b>−$12 B</b> in one day');
const tagFloor = mk('tag dn', 'the floor · <b>$0</b>'), tagCeil = mk('tag am', 'no ceiling <b>↑</b>');
const cmp = mk('cmp', `<div class="t">a 3× short fund · each day</div><div class="r"><div class="n">Nvidia rises</div><div class="b am" style="width:0px">+1%</div></div><div class="r"><div class="n">the fund falls</div><div class="b rd" style="width:0px">−3%</div></div><div class="s">built to move three times the other way</div>`);
const cmpB = cmp.querySelectorAll('.b');
const tagJar = mk('tag dn', 'about <b>−91%</b> · Mon 23 Nov 2026'), tagValue = mk('tag am', 'the fund’s <b>value</b>');
const tagHalt = mk('tag dn', 'trading <b>halted</b>');
const tagAhead = mk('tag gn', 'still <b>ahead</b> overall');
const title = mk('title', '<div class="s">THE STORY OF</div><div class="n">The Doubters’\n<em>Worst</em> Day</div>');
const lesson = mk('lesson', 'Right for a week.\nWrong for a <em>day</em>.');
const ctaChip = mk('chip am', 'you decide');
const boxes = [0, 1].map(() => { const e = mk('cbox', '<span class="in"></span><span class="post">Post</span>'); return { e, inn: e.querySelector('.in'), post: e.querySelector('.post') }; });
const foot = document.getElementById('foot');
const FOOT_A = 'Sources: Reuters (ORTEX data), S3 Partners via Stocktwits, Bloomberg, SBS · 23 Nov 2026\nshort sellers’ paper loss ≈ $12 bn (S3); $11.2–12.2 bn (ORTEX) · worst since at least 2019 · not advice';
const FOOT_B = 'How a short sale works: SEC Investor Bulletin, “An Introduction to Short Sales”\na short’s losses have no ceiling: a share can keep rising · the drawing is an example · not advice';
const FOOT_C = 'Sources: Nvidia (12 & 23 Nov 2026), Motley Fool, Yahoo Finance · closes $173.73 (11 Nov) → $125.53 (20 Nov)\nshorts’ gains after he quit: ≈ $13.7 bn in 7 sessions (S3), > $10.5 bn last week (ORTEX)';
const FOOT_D = 'Sources: WSJ (via PANews), Bloomberg (Eric Balchunas), ETF Stream, BigGo Finance · 23 Nov 2026\na −3× Nvidia fund listed in Europe fell about 91% and was halted; a US 2× short fund fell 63%';
const FOOT_E = 'Sources: Reuters (ORTEX data), S3 Partners via Stocktwits · as of the close, Mon 23 Nov 2026\nstill ahead: ≈ $14 bn since 29 Oct (ORTEX), ≈ $4 bn in 2026 (S3) · not advice';
const setTxt = (e, s) => { if (e.textContent !== s) e.textContent = s; };
const setHTML = (e, s) => { if (e._h !== s) { e._h = s; e.innerHTML = s; } };

function updateUI(t) {
  updateCaption(t);
  setTxt(foot, t > T.b4 - 0.1 && t < T.b5 - 0.1 ? FOOT_B : t > T.b5 - 0.1 && t < T.b6 ? FOOT_C : t > T.b8 - 0.1 && t < T.b9 - 0.1 ? FOOT_B : t > T.b9 - 0.1 && t < T.b11 ? FOOT_D : t > T.b11 && t < T.cta ? FOOT_E : FOOT_A);
  foot.style.opacity = (0.95 * seg(t, 3.0, 3.6) * (1 - seg(t, T.cta, T.cta + 0.3) * 0.45)).toFixed(3);
  // 1 — the hook card (0-1.5 s, the cover), then the big number (1.5-3 s)
  if (hookEl) { const out = seg(t, T.hookEnd, T.hookEnd + (TIM.big ? 0.22 : 0.3)); put(hookEl, W / 2, 640 - 40 * eo(out), 1 - out, 1 + 0.035 * seg(t, 0, T.hookEnd) + 0.06 * out); }
  if (bigEl) { const o = win(t, T.bigIn, T.bigOut - 0.05, 0.15, 0.25), u = eo(seg(t, T.bigIn + 0.05, T.bigIn + 0.7)), land = seg(t, T.bigIn + 0.7, T.bigIn + 1.0), sh = (1 - land) * (land > 0 ? 1 : 0);
    bigBg.style.opacity = (0.92 * o).toFixed(3); setHTML(BIGN.v, bigText(u)); BIGN.line.style.strokeDashoffset = (BIGN.len * (1 - eo(seg(t, T.bigIn, T.bigIn + 0.9)))).toFixed(1);
    put(bigEl, W / 2 + Math.sin(t * 90) * 7 * sh, 860 + Math.cos(t * 77) * 5 * sh, o, pop(t, T.bigIn, 0.4) * (1 + 0.05 * Math.sin(Math.PI * land))); }
  // chips (one line at the top that says where we are)
  let ct = '', co = 0, cp = 0;
  const CH = [[T.bigOut + 0.05, T.b4 - 0.1, 'Nvidia’s short sellers · Mon 23 Nov 2026'], [T.b4 + 0.05, T.b5 - 0.1, 'how a short sale works'], [T.b5 + 0.05, T.b6 - 0.1, '12 → 20 Nov 2026 · after he quit'],
    [T.b6 + 0.4, T.b7 - 0.1, 'Mon 23 Nov 2026 · before the open'], [T.b7 + 0.05, T.b8 - 0.1, 'Mon 23 Nov 2026 · at the close'], [T.b8 + 0.05, T.b9 - 0.1, 'the catch'],
    [T.funds - 0.1, T.b10 - 0.1, 'funds that bet three times over'], [T.b10 + 0.05, T.b11 - 0.1, 'a fund listed in Europe · Mon 23 Nov 2026'], [T.ahead - 0.2, T.b12 - 0.1, 'as of the close · Mon 23 Nov 2026']];
  for (const [a, b, s] of CH) { const o = win(t, a, b, 0.22, 0.22); if (o > co) { co = o; ct = s; cp = pop(t, a); } }
  if (ct) setTxt(chip, ct); put(chip, W / 2, 472, co, cp);
  // 1–3 — the camp; their worst day; how?
  { const p = proj(ST[0], 4.2, ST[1] - 1); put(tagCamp, clampX(p[0], 260), clampY(p[1] - 30, 620, 1400), p[2] ? win(t, T.bigOut + 0.05, T.b2 + 0.1, 0.3, 0.25) : 0, pop(t, T.bigOut + 0.05)); }
  { const p = proj(ST[0], 5.0, ST[1] - 1.5); put(tagWorst, clampX(p[0], 260), clampY(p[1] - 30, 620, 1400), p[2] ? win(t, T.worst - 0.05, T.b3 + 0.2, 0.25, 0.25) : 0, pop(t, T.worst - 0.05)); }
  { const d = doubters[2].position, p = proj(d.x, 2.9, d.z); put(bubHow, clampX(p[0] + 40, 160), clampY(p[1] - 40, 620, 1400), p[2] ? win(t, T.how - 0.05, T.b4 - 0.1, 0.2, 0.2) : 0, pop(t, T.how - 0.05) * (1 + 0.06 * win(t, T.fast - 0.1, T.fast + 0.2, 0.08, 0.2))); }
  // 4 — how a short sale works
  { const l1 = t > T.borrows - 0.1, l2 = t > T.sells - 0.1, l3 = t > T.buy - 0.1;
    setHTML(steps, `<em>①</em> borrow shares` + `\n${l2 ? '' : '<i>'}<em>②</em> sell them now${l2 ? '' : '</i>'}` + `\n${l3 ? '' : '<i>'}<em>③</em> buy back cheaper?${l3 ? '' : '</i>'}`);
    put(steps, W / 2, 1200, l1 ? win(t, T.borrows - 0.1, T.b5 - 0.15, 0.2, 0.25) : 0, pop(t, T.borrows - 0.1) * (1 + 0.05 * win(t, T.sells - 0.1, T.sells + 0.2, 0.08, 0.2) + 0.05 * win(t, T.buy - 0.1, T.buy + 0.2, 0.08, 0.2))); }
  { const p = proj(KI[0], 4.3, KI[1]); put(tagLender, clampX(p[0], 120), clampY(p[1] - 20, 620, 1400), p[2] ? win(t, T.borrows - 0.15, T.b5 - 0.2, 0.2, 0.2) : 0, pop(t, T.borrows - 0.15)); }
  { const p = proj(SEL[0], 2.7, SEL[1]); put(tagSeller, clampX(p[0], 150), clampY(p[1] - 22, 620, 1400), p[2] ? win(t, T.short - 0.1, T.b5 - 0.2, 0.2, 0.2) : 0, pop(t, T.short - 0.1)); }
  { const f = founderAt(t), p = proj(f[0], 2.9, f[1]); put(tagMan, clampX(p[0], 220), clampY(p[1] - 26, 620, 1400), p[2] ? win(t, T.jensen - 0.1, T.fell, 0.2, 0.25) : 0, pop(t, T.jensen - 0.1)); }
  { const p = proj(BUY[0], 2.6, BUY[1]); put(tagBuyer, clampX(p[0], 120), clampY(p[1] - 22, 620, 1400), p[2] ? win(t, T.sells - 0.1, T.b5 - 0.2, 0.2, 0.2) : 0, pop(t, T.sells - 0.1)); }
  // 5–6 — the price on the giant: down more than a quarter, then up almost a third; the gains pile; the board
  { const p = proj(NV[0], topY(t) + 9, NV[1]); put(tagFall, clampX(p[0], 260), clampY(p[1] - 24, 600, 1400), p[2] ? win(t, T.fell - 0.1, T.paid - 0.2, 0.25, 0.2) : 0, pop(t, T.fell - 0.1));
    put(tagJump, clampX(p[0], 260), clampY(p[1] - 24, 600, 1400), p[2] ? win(t, T.jumped, T.b7 - 0.2, 0.25, 0.25) : 0, pop(t, T.jumped)); }
  put(tagGain, W / 2, 1230, win(t, T.paid - 0.15, T.billions + 0.75, 0.25, 0.25), pop(t, T.paid - 0.15));
  { const p = proj(PV[0], 5.4, PV[1]); put(tagBoard, clampX(p[0], 260), clampY(p[1] - 20, 620, 1400), p[2] ? win(t, T.board - 0.05, T.back6 + 0.6, 0.25, 0.25) : 0, pop(t, T.board - 0.05)); }
  // 7 — they give it back
  { const p = proj(ST[0], 4.4, ST[1] - 3); put(tagGave, clampX(p[0], 240), clampY(p[1] - 30, 620, 1400), p[2] ? win(t, T.one7 - 0.05, T.b8 - 0.1, 0.25, 0.25) : 0, pop(t, T.one7 - 0.05)); }
  // 8 — the floor and the open sky
  { const p1 = proj(NV[0] + 12, 2, NV[1] + 12), p2 = proj(NV[0], topY(t) + 30 + 70 * eo(seg(t, T.rise8, T.limit + 0.6)), NV[1]);
    put(tagFloor, clampX(p1[0] + 60, 220), clampY(p1[1] + 10, 620, 1420), p1[2] ? win(t, T.zero - 0.05, T.rise8 - 0.1, 0.25, 0.25) : 0, pop(t, T.zero - 0.05));
    put(tagCeil, clampX(p2[0], 220), clampY(p2[1], 700, 1300), p2[2] ? win(t, T.rise8 - 0.05, T.b9 + 0.1, 0.25, 0.25) : 0, pop(t, T.rise8 - 0.05)); }
  // 9 — three times the other way
  { const o = win(t, T.lose9 - 0.25, T.b10 - 0.1, 0.3, 0.25), u1 = eo(seg(t, T.lose9 - 0.2, T.lose9 + 0.3)), u2 = eo(seg(t, T.p3 - 0.1, T.p3 + 0.5));
    cmpB[0].style.width = (190 * u1).toFixed(1) + 'px'; cmpB[1].style.width = (570 * u2).toFixed(1) + 'px'; cmpB[0].style.opacity = u1 > 0.05 ? 1 : 0; cmpB[1].style.opacity = u2 > 0.05 ? 1 : 0; put(cmp, W / 2, 1300, o, pop(t, T.lose9 - 0.25)); }
  // 10 — the jar drains; halted
  { const p = proj(JAR[0], 11.8, JAR[1]); put(tagValue, clampX(p[0], 220), clampY(p[1] - 20, 620, 1400), p[2] ? win(t, T.europe - 0.1, T.p90 - 0.1, 0.2, 0.2) : 0, pop(t, T.europe - 0.1));
    put(tagJar, clampX(p[0], 260), clampY(p[1] - 20, 620, 1400), p[2] ? win(t, T.p90 - 0.05, T.halted - 0.15, 0.25, 0.25) : 0, pop(t, T.p90 - 0.05)); }
  { const p = proj(EUB[0], 11.5, EUB[1] + 9); put(tagHalt, clampX(p[0], 220), clampY(p[1] - 40, 620, 1400), p[2] ? win(t, T.halted - 0.05, T.b11 + 0.4, 0.2, 0.25) : 0, pop(t, T.halted - 0.05)); }
  // 11 — still ahead
  { const p = proj(PILE[0], 2.6, PILE[1]); put(tagAhead, clampX(p[0], 240), clampY(p[1] - 30, 620, 1400), p[2] ? win(t, T.still - 0.05, T.story11 + 0.6, 0.25, 0.25) : 0, pop(t, T.still - 0.05)); }
  // 12 — title and lesson; 13 — you decide
  put(title, W / 2, 640, win(t, T.story, T.cta - 0.1, 0.4, 0.3), 0.94 + 0.06 * eo(seg(t, T.story, T.story + 0.6)));
  put(lesson, W / 2, 1180, win(t, T.right - 0.1, T.cta - 0.15, 0.3, 0.25), pop(t, T.right - 0.1));
  put(ctaChip, W / 2, 472, seg(t, T.would, T.would + 0.3), pop(t, T.would));
  [[T.yes, 'YES', T.postA], [T.no, 'NO', T.postB]].forEach(([t0, word, tp], i) => {
    const L = word.length, n = Math.min(L, Math.floor(c01((t - t0) / (0.11 * L + 0.01)) * (L + 0.001))), typed = word.slice(0, n), caret = (n < L || Math.floor(t * 2.4) % 2) && t < tp ? '<i></i>' : '';
    const bx = boxes[i];
    setHTML(bx.inn, typed ? `<b>${typed}</b>${caret}` : `<em>Add a comment…</em>${caret}`); const sent = t > tp; const pc = sent ? 'post on sent' : n === L ? 'post on' : 'post'; if (bx.post.className !== pc) bx.post.className = pc; setTxt(bx.post, sent ? 'Posted ✓' : 'Post');
    const ts = i ? T.no - 0.3 : T.comment; put(bx.e, W / 2, 1330 + i * 132, seg(t, ts, ts + 0.3), pop(t, ts) * (1 + 0.06 * win(t, tp, tp + 0.3, 0.08, 0.2)));
  });
}

// ───────────────────────── one frame
const hopY = (hops, t, h = 0.5) => { let y = 0; for (const t0 of hops) { const u = (t - t0) / 0.38; if (u > 0 && u < 1) y = Math.max(y, Math.sin(u * Math.PI) * h); } return y; };
const slumpAt = t => Math.max(win(t, T.bigIn + 0.5, T.b4 - 0.3, 0.4, 0.4), win(t, T.gave - 0.2, T.b11, 0.4, 0.5) * 0.9);   // heads down: the flash-forward, then Monday
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
    nvG.position.y = -NVH * (1 - k); nvG.rotation.z = Math.sin(t * 23) * 0.004 * sh; nvG.rotation.x = Math.sin(t * 19 + 1) * 0.003 * sh; crown.rotation.y = t * 0.25; }
  // the catch: the floor box (top → ground) and the sky column (above the top)
  { const fo = win(t, T.fall8 - 0.15, T.b9 - 0.2, 0.35, 0.4), gh = NVH * R1, u = eo(seg(t, T.fall8 - 0.1, T.zero + 0.35));
    floorBox.visible = fo > 0.01; floorBox.scale.y = Math.max(0.01, u); floorBox.position.set(NV[0], gh - gh * u / 2, NV[1]); floorBox.userData.fill.material.opacity = 0.2 * fo; floorBox.userData.edges.material.opacity = 0.9 * fo;
    floorPlate.material.opacity = 0.35 * fo * u;
    const so = win(t, T.rise8 - 0.15, T.bigger + 0.6, 0.3, 0.5), v = eo(seg(t, T.rise8 - 0.1, T.limit + 0.6)), H2 = skyBox.userData.gh;
    skyBox.visible = so > 0.01; skyBox.scale.y = Math.max(0.01, v); skyBox.position.set(NV[0], topY(t) + 1.5 + H2 * v / 2, NV[1]); skyBox.userData.fill.material.opacity = 0.18 * so; skyBox.userData.edges.material.opacity = 0.9 * so; }
  doorGlowM.opacity = 0.55 * night + 0.35 * win(t, T.back6 - 0.2, T.b7 + 0.4, 0.2, 0.5);
  // the founder
  { const f = founderAt(t); founder.visible = f[4]; founder.scale.setScalar(1.12 * Math.max(0.01, t > T.walkIn[0] && t < T.walkIn[0] + 0.4 ? back(seg(t, T.walkIn[0], T.walkIn[0] + 0.35)) : 1)); founder.position.set(f[0], f[3] ? Math.abs(Math.sin(t * 9)) * 0.08 : 0, f[1]); founder.rotation.y = f[2]; }
  // the board: hands go up one after another
  boardP.forEach(({ m, hd }, i) => { const u = back(seg(t, T.hands(i), T.hands(i) + 0.3)) * (1 - seg(t, T.b7 + 1.0, T.b7 + 1.5)); hd.scale.set(1, Math.max(0.01, u), 1); m.position.y = hopY([T.hands(i) + 0.05], t, 0.06); });
  // the doubters: cheer while winning, slump when it turns; the lead doubter turns to the kiosk to borrow
  { const sl = slumpAt(t);
    doubters.forEach((m, i) => { const cheer = hopY([0.15 + i * 0.09, 0.75 + i * 0.07, T.paid + i * 0.06, T.billions + 0.1 + i * 0.05], t, 0.32);
      m.position.y = 0.1 + cheer * (1 - sl); m.rotation.z = -0.16 * sl * (i % 2 ? 1 : 0.8); m.scale.set(1.02, 1.02 * (1 - 0.06 * sl), 1.02);
      m.rotation.y = -Math.PI / 2 + Math.sin(t * 0.7 + i) * 0.05; }); }
  seller.rotation.y = lerp(Math.PI - 0.2, 0.2, sm(T.sells - 0.35, T.sells + 0.05, t)); seller.position.y = hopY([T.borrows + 0.5, T.sells + 1.0], t, 0.12);
  // the flag waves
  { const p = flag.geometry.attributes.position; for (let i = 0; i < p.count; i++) { const x0 = flagP0[i * 3], u = Math.sin(Math.PI * (x0 + 4) / 8); p.setZ(i, Math.sin(t * 3.2 + x0 * 1.1) * 0.12 * u); p.setY(i, flagP0[i * 3 + 1] - 0.05 * u * (1 + Math.sin(t * 2.1 + x0))); } p.needsUpdate = true; }
  // the pile of paper gains
  updateCoins(t);
  // borrow: certificates from the kiosk to the doubter; sell: on to the buyer, cash back
  { const [lx, lz] = LEADP(), A = [KI[0] + 1.3, 1.3, KI[1]], B = [lx - 0.3, 1.45, lz], C = [BUY[0] + 0.3, 1.4, BUY[1]];
    CERTS.forEach((m, i) => { const t1 = T.borrows + 0.05 + i * 0.07, t2 = T.sells + 0.05 + i * 0.07, u1 = seg(t, t1, t1 + 0.55), u2 = seg(t, t2, t2 + 0.55);
      const on = t > t1 && t < T.b5 - 0.1; m.visible = on; if (!on) return;
      let x, y, z; if (u2 <= 0) { x = lerp(A[0], B[0], u1); z = lerp(A[2], B[2], u1) + (i - 2) * 0.12; y = lerp(A[1], B[1], u1) + Math.sin(u1 * Math.PI) * 1.6 + i * 0.03; }
      else { x = lerp(B[0], C[0], u2); z = lerp(B[2], C[2], u2) + (i - 2) * 0.12; y = lerp(B[1], C[1], u2) + Math.sin(u2 * Math.PI) * 1.8 + i * 0.03; }
      m.position.set(x, y, z); m.rotation.set(0.3 * Math.sin(t * 4 + i), t * 2 + i, 0.2); });
    CASHM.forEach((m, i) => { const t3 = T.sells + 0.45 + i * 0.1, u = seg(t, t3, t3 + 0.6), on = t > t3 && t < T.b5 - 0.1; m.visible = on; if (!on) return;
      m.position.set(lerp(C[0], B[0] + 0.5, u), lerp(C[1], 0.25 + i * 0.44, u) + Math.sin(u * Math.PI) * 1.5, lerp(C[2], B[2] - 0.9, u)); m.rotation.set(0, 0.4 + i * 0.3 + (1 - u) * 3, 0); }); }
  buyer.position.y = hopY([T.sells + 0.6], t, 0.12); lender.position.y = hopY([T.borrows + 0.05], t, 0.1);
  // Europe: the jar drains, the barrier drops, people slump
  { const u = eio(seg(t, T.drain[0], T.drain[1])), lvl = lerp(1, 0.09, u) * (1 + 0.03 * Math.sin(t * 9) * win(t, T.drain[0], T.drain[1], 0.1, 0.3));
    liq.scale.set(1, Math.max(0.01, LIQH * lvl), 1); liqM.emissiveIntensity = 0.5 - 0.3 * u; liqM.color.setHex(u > 0.6 ? 0xE0483B : 0xF7B500);
    const bu = back(seg(t, T.halted - 0.15, T.halted + 0.35)); barArm.rotation.z = lerp(0, -Math.PI / 2, Math.min(1.05, bu));
    haltSign.material.opacity = seg(t, T.halted - 0.1, T.halted + 0.2);
    EUP.forEach((m, i) => { m.position.y = hopY([T.p90 + 0.1 + i * 0.07], t, 0.16); m.rotation.z = -0.14 * seg(t, T.p90 + 0.2, T.p90 + 0.8); }); }
  EUW.forEach((w, i) => { const u = ((t * 0.07 + w.ph) % 1); w.m.position.set(w.x, Math.abs(Math.sin(t * 7 + i)) * 0.06, w.z + w.L * u); w.m.rotation.y = w.L > 0 ? -Math.PI / 2 : Math.PI / 2; });
  // cars and people
  for (const c of CARS) { const L = 700, x = ((c.off + t * c.v) % L) - L / 2; c.m.position.set(c.dir * x, 0, c.z); c.m.rotation.y = c.dir > 0 ? 0 : Math.PI; }
  WALK.forEach((w, i) => { const u = (Math.sin((t * w.sp + w.ph) * Math.PI * 2) + 1) / 2, dir = Math.cos((t * w.sp + w.ph) * Math.PI * 2) > 0 ? 1 : -1; const x = lerp(w.a[0], w.b[0], u), z = lerp(w.a[1], w.b[1], u); w.m.position.set(x, Math.abs(Math.sin(t * 7 + i)) * 0.06, z); w.m.rotation.y = Math.atan2(-(w.b[1] - w.a[1]) * dir, (w.b[0] - w.a[0]) * dir); });
  // clouds
  for (const c of clouds) { c.position.x = c.userData.x0 + t * 1.2; c.material.opacity = 0.9 - 0.5 * night; const k = lerp(1, 0.45, night); c.material.color.setRGB(lerp(s.hor[0], 1, 0.55) * k, lerp(s.hor[1], 1, 0.55) * k, lerp(s.hor[2], 1, 0.55) * k * 1.05); }
  // sparkles: the giant's top as it jumps (twice); the pile while it grows; the final comment
  { let k = 0; const put3 = (x, y, z, sz, on) => { const sp = sparks[k++]; if (!sp) return; const tw = Math.pow(Math.abs(Math.sin(t * sp.userData.w + sp.userData.ph)), 3); sp.position.set(x, y, z); sp.scale.setScalar(sz * (0.25 + tw)); sp.material.opacity = on * (0.3 + 0.7 * tw); sp.visible = on > 0.01; };
    const s1 = win(t, T.riseA[0], T.riseA[1] + 1.0, 0.2, 0.8) + win(t, T.riseB[0], T.riseB[1] + 1.0, 0.2, 0.8), top = topY(t); for (let i = 0; i < 40; i++) { const sp = sparks[i].userData, ph = (t * 0.5 + sp.k) % 1; put3(NV[0] + sp.dx * 12, top + 2 + ph * 26, NV[1] + sp.dz * 12, 1.8 + 1.6 * (1 - ph), Math.min(1, s1) * Math.sin(ph * Math.PI)); }
    const s2 = win(t, 0, 1.4, 0.01, 0.3); for (let i = 0; i < 16; i++) { const ph = (t * 0.6 + i / 16) % 1, a = i * 2.4; put3(PILE[0] + Math.cos(a) * 2.2, 0.6 + ph * 3.4, PILE[1] + Math.sin(a) * 1.6, 0.55, Math.min(1, s2) * Math.sin(ph * Math.PI)); }
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
  riseA: T.riseA, rewind: T.rewind, walkOut: T.walkOut, sink: T.sink, walkIn: T.walkIn, riseB: T.riseB, drain: T.drain,
  hands: boardP.map((_, i) => +T.hands(i).toFixed(3)),
  earn: Array.from({ length: 12 }, (_, i) => +tEarn(Math.round(i * (NC - 1) / 11)).toFixed(3)), give: Array.from({ length: 12 }, (_, j) => +tGive(Math.round(j * (NC - KEEP - 1) / 11)).toFixed(3)),
  flash: Array.from({ length: 8 }, (_, j) => +tFlash(Math.round(j * (NC - KEEP - 1) / 7)).toFixed(3)),
  certs: [T.borrows + 0.05, T.sells + 0.05].map(x => +x.toFixed(3)), cash: [0, 1, 2].map(i => +(T.sells + 0.45 + i * 0.1).toFixed(3)),
  typingA: [0, 1, 2].map(i => +(T.yes + (i + 0.5) * 0.11).toFixed(3)), typingB: [0, 1].map(i => +(T.no + (i + 0.5) * 0.11).toFixed(3)),
  postA: +T.postA.toFixed(3), postB: +T.postB.toFixed(3),
};
document.fonts.ready.then(() => Promise.all(['700 64px Figtree', '900 190px Fraunces', '800 30px JBM', '700 22px Inter', '700 78px Fraunces', '800 54px Figtree', '600 34px Figtree', '500 18px Inter', '900 128px JBM', '800 46px Inter', '900 150px Figtree', '900 112px Fraunces', '800 172px JBM', '700 34px Figtree', '900 118px Figtree', '800 44px JBM', '900 96px Figtree', '800 42px Inter', '900 92px Fraunces', '900 76px Figtree', '900 74px Figtree', '900 170px Figtree'].map(f => document.fonts.load(f)))).then(() => { TEXS.forEach(f => f()); fitHook(); renderAt(0); window.__ready = true; });
