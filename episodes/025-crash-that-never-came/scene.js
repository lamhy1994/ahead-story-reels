// The Crash That Never Came — low-poly storybook scene (deterministic: window.renderAt(t) draws the frame for time t)
// Carl Icahn, 90, has lost most of his fortune in five years while US stocks rose: Forbes data (via the New York Post, 25 Nov 2026) put it at
// $24.6bn in 2021 and about $1.7bn now (about 93%, about $23bn, lowest since 1997); the Bloomberg Billionaires Index at about $1.3bn (24 Nov 2026).
// His funds bet on a crash (a Financial Times analysis, May 2023: almost $9bn lost on those bets from 2017 to early 2023). In May 2023 a short
// seller (Hindenburg Research) called Icahn Enterprises' structure "ponzi-like"; he called the report "self-serving"; the units more than halved in
// weeks. Almost all his money is in those units, pledged for personal loans worth billions (SEC, Aug 2024). In 2026 his funds lost 43.8% by
// September, the units fell from $7.55 to $2.57 (25 Nov), and the company's 10-Q said there is "no assurance" it can refinance about $1.4bn of
// notes due May 2027. The world: a plaza on Wall Street; his tower (Icahn Enterprises) at its head; his fortune as a coin pile; his funds' camp
// with a CRASH flag; the market as a rising amber line across the sky; the lenders' bank to the west, chained to the tower; a price screen.
import * as THREE from 'three';
import { SKIN, MAT, GOLD, rng, GB, person, cloud, bushTree, tower, car, lamp, BIGCOIN, WIN_LIT, bank, CHAIN_LINK, padlock } from './kit.js';

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
const R = rng(20261128);

// ───────────────────────── story clock (everything hangs off the narration)
const T = {
  hookEnd: TIM.big ? 1.5 : TIM.hook ? E(1) + 0.15 : 0,  // the hook card (script.py HOOK): 0-1.5 s when there is a big number, else until the hook sentence ends
  bigIn: TIM.big ? 1.5 : 0, bigOut: TIM.big ? 3.0 : 0,   // the big number (script.py BIG): 1.5-3 s (Keith, 22 Nov 2026)
  billion1: wt(1, 'billion') - 0.1, market1: wt(1, 'market') - 0.1, up1: wt(1, 'up') - 0.1,
  b2: S(2) - 0.05, icahn: wt(2, 'Icahn') - 0.1, feared: wt(2, 'feared') - 0.1, investors: wt(2, 'investors') - 0.1,
  b3: S(3) - 0.05, barely: wt(3, 'barely') - 0.1, billionaire: wt(3, 'billionaire') - 0.1,
  b4: S(4) - 0.05, how: wt(4, 'how') - 0.1, legend: wt(4, 'legend') - 0.1, nine: wt(4, 'nine') - 0.1, ten: wt(4, 'ten') - 0.1, dollars4: wt(4, 'dollars') - 0.1,
  b5: S(5) - 0.05, sure: wt(5, 'sure') - 0.1, crash5: wt(5, 'crash') - 0.1, coming: wt(5, 'coming') - 0.1, funds: wt(5, 'funds') - 0.1, bet5: wt(5, 'bet') - 0.1, against5: wt(5, 'against') - 0.1, market5: wt(5, 'market') - 0.1,
  b6: S(6) - 0.05, kept: wt(6, 'kept') - 0.1, rising: wt(6, 'rising') - 0.1, bets6: wt(6, 'bets') - 0.1, cost: wt(6, 'cost') - 0.1, n9: wt(6, '9') - 0.1, billion6: wt(6, 'billion') - 0.1, y2023: wt(6, '2023') - 0.1,
  b7: S(7) - 0.05, short7: wt(7, 'short') - 0.1, seller: wt(7, 'seller') - 0.1, called7: wt(7, 'called') - 0.1, payouts: wt(7, 'payouts') - 0.1, ponzi: wt(7, 'Ponzi-like') - 0.1,
  b8: S(8) - 0.05, self: wt(8, 'self-serving') - 0.1, but8: wt(8, 'but') - 0.1, shares8: wt(8, 'shares') - 0.1, halved: wt(8, 'halved') - 0.1,
  b9: S(9) - 0.05, almost: wt(9, 'Almost') - 0.1, money: wt(9, 'money') - 0.1, shares9: wt(9, 'shares') - 0.1, billions9: wt(9, 'billions') - 0.1, borrowed: wt(9, 'borrowed') - 0.1, them: wt(9, 'them') - 0.1,
  b10: S(10) - 0.05, year: wt(10, 'year') - 0.1, bets10: wt(10, 'bets') - 0.1, lost10: wt(10, 'lost') - 0.1, again: wt(10, 'again') - 0.1, fell10: wt(10, 'fell') - 0.1, thirds: wt(10, 'two-thirds') - 0.1,
  b11: S(11) - 0.05, warns: wt(11, 'warns') - 0.1, refinance: wt(11, 'refinance') - 0.1, n14: wt(11, '1.4') - 0.1, billion11: wt(11, 'billion') - 0.1, due: wt(11, 'due') - 0.1, may11: wt(11, 'May', 1) - 0.1,
  b12: S(12) - 0.05, ninety: wt(12, '90') - 0.1, story12: wt(12, 'story') - 0.1, over: wt(12, 'over') - 0.1, yet: wt(12, 'yet') - 0.1,
  b13: S(13) - 0.05, story: wt(13, 'story') - 0.15, never: wt(13, 'never') - 0.1, came: wt(13, 'came') - 0.1, sure13: wt(13, 'sure') - 0.1, right: wt(13, 'right') - 0.1,
  cta: S(14) - 0.1, would: wt(14, 'Would') - 0.1, ever: wt(14, 'ever') - 0.1, whole: wt(14, 'whole') - 0.1, comment: wt(14, 'Comment') - 0.15, yes: wt(14, 'YES') - 0.2, no: wt(14, 'NO') - 0.1,
};
T.rewind = [T.b5 - 0.15, T.b5 + 0.75];                       // back to before: the pile is full again, the market line shorter
T.riseA = [T.kept - 0.1, T.y2023 + 0.2];                      // the market kept rising (to 2023)
T.riseB = [T.year - 0.1, T.again + 0.4];                      // and again in 2026
T.report = [T.short7 - 0.15, T.ponzi + 0.15];                 // the short seller's report flies onto the tower
T.chain = [T.billions9 - 0.1, T.them + 0.35];                 // the units chained to the lenders' bank
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
const SKY = [[0, 'MORN'], [T.b5 - 0.2, 'MORN'], [T.b5 + 0.6, 'DAY'], [T.b7 - 0.2, 'DAY'], [T.b7 + 0.6, 'GOLDEN'], [T.b10 - 0.2, 'GOLDEN'], [T.b10 + 0.6, 'SUNSET'],
  [T.b12 + 0.4, 'SUNSET'], [T.b13 + 0.5, 'DUSK'], [T.cta + 0.4, 'NIGHT'], [DUR + 2, 'NIGHT']];
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

// ───────────────────────── ground, avenues, plaza, the lenders' square (west)
const ground = new THREE.Mesh(new THREE.PlaneGeometry(1600, 1600).rotateX(-Math.PI / 2), new THREE.MeshLambertMaterial({ color: 0xC9C2AE })); ground.receiveShadow = true; scene.add(ground);
const flat = new GB();
flat.box(8, 0.04, 300, 0x4A4E56, 44, 0.02, -90); flat.box(8, 0.04, 300, 0x4A4E56, -44, 0.021, -90);           // two avenues north-south
flat.box(1400, 0.04, 8, 0x4A4E56, 0, 0.022, -112); flat.box(1400, 0.04, 8, 0x4A4E56, 0, 0.023, -6);           // two east-west
for (const z of [-112, -6]) for (let x = -690; x < 690; x += 6) flat.box(2.6, 0.05, 0.22, 0xF2EEE2, x, 0.045, z);
flat.box(66, 0.07, 44, 0xE6DFD0, 0, 0.035, -42);                                                             // the plaza
for (let i = 0; i < 12; i++) flat.box(66, 0.075, 0.12, 0xD6CEBC, 0, 0.037, -62 + i * 3.6);
flat.box(16, 0.08, 14, 0x7FA86A, -22, 0.04, -30); flat.box(16, 0.08, 14, 0x7FA86A, 22, 0.041, -30);           // lawns
flat.cyl(8.4, 8.4, 0.09, 28, 0xD8CDB6, 0.5, 0.045, -28.6); flat.cyl(7.9, 7.9, 0.1, 28, 0xEFE7D6, 0.5, 0.05, -28.6);   // the round stage: his funds' camp
const BK = [-72, -84];                                                                                         // the lenders' bank (faces east, toward his tower)
flat.box(40, 0.07, 46, 0xE2DACA, BK[0] + 4, 0.035, BK[1]); flat.box(30, 0.08, 14, 0x8DAE74, BK[0] - 30, 0.04, BK[1] + 24); flat.box(26, 0.08, 18, 0x9DB884, -96, 0.04, -52);
{ const rr = rng(909); for (let i = 0; i < 70; i++) { const x = (rr() - 0.5) * 520, z = -230 + rr() * 300; if (Math.abs(x) < 40 && z > -100 && z < 0) continue; if (x < -48 && x > -150 && z < -36 && z > -112) continue; flat.box(6 + rr() * 14, 0.06, 6 + rr() * 14, rr() < 0.5 ? 0x8DAE74 : 0x9DB884, x, 0.03, z); } }
const flatM = flat.mesh(); flatM.castShadow = false; scene.add(flatM);

// ───────────────────────── the city: one tower per company; his tower (Icahn Enterprises) at the head of the plaza
const TOWERS = [], stat = [];
const NV = [0, -84], SCR = [31, 28.5, -46], SCR_RY = -0.64;
const DEST = (x, z) => (Math.abs(x) < 38 && z < -14 && z > -100) || (Math.abs(x) < 56 && z > -20 && z < 90) || Math.hypot(x - SCR[0], z - SCR[2]) < 15 || Math.abs(z + 112) < 9 || Math.abs(z + 6) < 9 || Math.abs(Math.abs(x) - 44) < 9
  || (x < -40 && x > -160 && z < -30 && z > -118);                                                               // the lenders' square and the open ground west of it
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
// his tower: dark stone and glass, a gold crown band
const NVH = 80;
const nvT = tower(22, NVH, 22, { rand: rng(4), color: 0x3A3440, glass: 0x8A6A3A, frame: 0x5A5260, floor: 3.6, litP: 0.62, bare: true });
const nvG = new THREE.Group(); nvG.add(nvT); nvG.position.set(NV[0], 0, NV[1]); nvT.children.forEach(c => { c.castShadow = true; c.receiveShadow = true; }); scene.add(nvG);
{ const b = new GB(); b.box(23.2, 2.2, 23.2, 0xE2B24A, 0, NVH + 1.6, 0); b.box(15, 3.4, 15, 0x3A3440, 0, NVH + 4.2, 0); b.box(15.8, 0.8, 15.8, 0xE2B24A, 0, NVH + 6.1, 0); b.cyl(0.25, 0.3, 9, 6, 0x8A8F96, 0, NVH + 10.8, 0); const m = b.mesh(); m.castShadow = true; nvG.add(m); }
stat.push([NV[0] - 12, NV[0] + 12, NV[1] - 12, NV[1] + 12, NVH + 16, 'his tower']);
// the entrance building in front of it: glass doors, canopy, steps, and the name
const FD = [0, -62.6];                                                    // where he stands, in front of the doors
{ const b = new GB(), fr = 0xF1EDE4, Z0 = -74.5, Z1 = -66.5, HP = 5.6;
  b.box(32, HP, Z1 - Z0, 0xE4DED2, 0, HP / 2, (Z0 + Z1) / 2); b.box(32.6, 0.5, Z1 - Z0 + 0.6, fr, 0, HP + 0.25, (Z0 + Z1) / 2);
  for (let i = 0; i < 6; i++) for (const s of [-1, 1]) b.box(2.6, 2.1, 0.12, 0x8A6A3A, s * (6.4 + i * 1.6 + 0.8), 3.3, Z1 + 0.03);
  b.box(8.4, 3.6, 0.2, 0x3A2E24, 0, 1.8, Z1 + 0.06); for (let i = -2; i <= 2; i++) b.box(0.14, 3.6, 0.3, fr, i * 2.05, 1.8, Z1 + 0.12);
  b.box(13, 0.35, 3.6, fr, 0, 4.15, Z1 + 1.8); for (const x of [-6, 6]) b.box(0.3, 4.0, 0.3, fr, x, 2.0, Z1 + 3.4);
  for (let i = 0; i < 3; i++) b.box(14 - i * 0.6, 0.12, 1.0, 0xCFC7B6, 0, 0.06 + i * 0.12, Z1 + 4.3 - i * 0.5);
  const m = b.mesh(); scene.add(m); stat.push([-16.5, 16.5, Z0 - 0.5, Z1 + 4.5, HP + 1.2, 'entrance']); }
const nameSign = new THREE.Mesh(new THREE.PlaneGeometry(26, 1.9), new THREE.MeshBasicMaterial({ map: textTex(1600, 118, (g, w, h) => { g.fillStyle = '#2A2430'; g.fillRect(0, 0, w, h); g.fillStyle = '#F2D08A'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = '900 84px Fraunces'; g.fillText('ICAHN  ENTERPRISES', w / 2, 64); }), toneMapped: false }));
nameSign.position.set(0, 4.75, -66.43); scene.add(nameSign);
const doorGlowM = new THREE.MeshBasicMaterial({ color: 0xFFE2A0, transparent: true, opacity: 0, toneMapped: false, depthWrite: false });
const doorGlow = new THREE.Mesh(new THREE.PlaneGeometry(8.0, 3.4), doorGlowM); doorGlow.position.set(0, 1.8, -66.3); scene.add(doorGlow);
// the price screen on its pylon
const pylon = new THREE.Group(); { const b = new GB(); b.box(4.6, 40, 3.6, 0x3A4048, 0, 20, -2.6); b.box(13.2, 14.8, 1.2, 0x23272E, 0, SCR[1], 0.3); b.box(13.8, 0.5, 1.6, 0x8A8F96, 0, SCR[1] + 7.6, 0.3); b.box(13.8, 0.5, 1.6, 0x8A8F96, 0, SCR[1] - 7.6, 0.3); b.box(5.6, 1.2, 4.6, 0x8A8F96, 0, 0.6, -2.6); pylon.add(b.mesh()); }
pylon.position.set(SCR[0], 0, SCR[2]); pylon.rotation.y = SCR_RY; scene.add(pylon);
const scrCv = document.createElement('canvas'); scrCv.width = 720; scrCv.height = 810; const scrTx = new THREE.CanvasTexture(scrCv); scrTx.colorSpace = THREE.SRGBColorSpace; scrTx.anisotropy = 4;
const screen = new THREE.Mesh(new THREE.PlaneGeometry(12.4, 13.95), new THREE.MeshBasicMaterial({ map: scrTx, toneMapped: false })); screen.position.set(0, SCR[1], 0.95); pylon.add(screen);
stat.push([SCR[0] - 7, SCR[0] + 7, SCR[2] - 6, SCR[2] + 6, 41, 'screen']);
const modern = (i, extra = {}) => ({ robe: [0x34405A, 0x6A2E3E, 0x3F6A5A, 0x5A5A66, 0x7A5A3A, 0x2F4A6A, 0x8A3A3A, 0x3B6FA8, 0xB0603A, 0x4E7A3E][i % 10], skin: SKIN[i % 5], short: [0x231C18, 0x5A3E28, 0xC9A27A, 0x3A2A1E, 0x8A8A8A][i % 5], shirt: i % 2 ? 0xF4F2EC : undefined, ...extra });
// the investor (a plain figure, no likeness): white hair, dark suit, at his doors
const founder = person(modern(0, { robe: 0x2B2F3A, skin: SKIN[4], short: 0xEDEAE4, shirt: 0xF4F2EC, tie: 0x8A3A3A, s: 1.12 })); founder.position.set(FD[0], 0, FD[1]); founder.rotation.y = -Math.PI / 2; scene.add(founder);

// ───────────────────────── the lenders' bank (west), chained to his tower
const bk = bank(); bk.position.set(BK[0], 0, BK[1]); bk.rotation.y = Math.PI / 2; scene.add(bk); stat.push([BK[0] - 10, BK[0] + 13, BK[1] - 14, BK[1] + 14, 17, 'bank']);
const bkSign = new THREE.Mesh(new THREE.PlaneGeometry(20, 2.1), new THREE.MeshBasicMaterial({ map: textTex(1400, 148, (g, w, h) => { g.fillStyle = '#EDE6D6'; g.fillRect(0, 0, w, h); g.fillStyle = '#3A2E24'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = '900 92px Fraunces'; g.fillText('THE LENDERS', w / 2, 80); }), toneMapped: false }));
bkSign.position.set(0, bk.userData.signY, bk.userData.signZ + 0.05); bk.add(bkSign);
// chains: three loops of links around his tower and a padlock on its face (his units, pledged for loans)
const LINK = CHAIN_LINK;
const chainM = new THREE.MeshLambertMaterial({ color: 0x9AA2AE, emissive: 0x2A2E36, emissiveIntensity: 0.4 });
const HS = 11.55, NL = 4 * Math.round(2 * HS / 0.9), CHAINS = [9.5, 15.5, 21.5].map((y, k) => { const pts = [], per = NL / 4;
  for (let i = 0; i < NL; i++) { const side = Math.floor(i / per), u = (i % per + 0.5) / per, a = lerp(-HS, HS, u); const [x, z, ry] = side === 0 ? [a, HS, 0] : side === 1 ? [HS, -a, Math.PI / 2] : side === 2 ? [-a, -HS, 0] : [-HS, a, Math.PI / 2]; pts.push([NV[0] + x, y + Math.sin(i * 0.9) * 0.05, NV[1] + z, ry]); }
  const order = pts.map((p, i) => i).sort((a, b) => Math.abs(((pts[a][0] - NV[0]) + 0.01)) - Math.abs(((pts[b][0] - NV[0]) + 0.01)) + (pts[a][2] - pts[b][2]) * 0.02);   // from the front middle outwards
  const im = new THREE.InstancedMesh(LINK, chainM, NL); im.castShadow = true; im.frustumCulled = false; im.count = 0; scene.add(im);
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler();
  order.forEach((idx, n) => { const p = pts[idx]; q.setFromEuler(e.set(idx % 2 ? Math.PI / 2 : 0, p[3], 0, 'YXZ')); m4.compose(new THREE.Vector3(p[0], p[1], p[2]), q, new THREE.Vector3(1, 1, 1)); im.setMatrixAt(n, m4); });
  im.instanceMatrix.needsUpdate = true; return { im, pts }; });
const LOCK = [NV[0], 15.5, NV[1] + HS + 1.2];
const lock = padlock();
lock.position.set(...LOCK); lock.visible = false; scene.add(lock);
// the bonds due in May 2027: a big certificate over the bank, and a question mark
const bondTx = textTex(900, 520, (g, w, h) => { g.fillStyle = '#FBF6E8'; g.fillRect(0, 0, w, h); g.strokeStyle = '#C9A24A'; g.lineWidth = 16; g.strokeRect(18, 18, w - 36, h - 36); g.lineWidth = 4; g.strokeRect(44, 44, w - 88, h - 88);
  g.fillStyle = '#7A5A2A'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = '800 40px Inter'; g.fillText('NOTES  ·  ICAHN ENTERPRISES', w / 2, 112);
  g.fillStyle = '#2A2430'; g.font = '900 150px Fraunces'; g.fillText('$1.4 B', w / 2, 262); g.fillStyle = '#C8423A'; g.font = '900 62px Figtree'; g.fillText('DUE  MAY  2027', w / 2, 400); });
const bond = new THREE.Mesh(new THREE.PlaneGeometry(15, 8.67), new THREE.MeshBasicMaterial({ map: bondTx, side: THREE.DoubleSide, color: 0xE6E0D2, toneMapped: false })); bond.visible = false; scene.add(bond);
const qTx = textTex(256, 320, (g, w, h) => { g.fillStyle = '#F7B500'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = '900 300px Fraunces'; g.fillText('?', w / 2, h / 2 + 14); });
const qMark = new THREE.Mesh(new THREE.PlaneGeometry(5, 6.25), new THREE.MeshBasicMaterial({ map: qTx, transparent: true, depthWrite: false, toneMapped: false, side: THREE.DoubleSide })); qMark.visible = false; scene.add(qMark);
const BOND = [BK[0] + 3, 25.5, BK[1] + 2];

// ───────────────────────── his funds' camp on the round stage: eight traders under a CRASH flag; his fortune as a coin pile in front
const ST = [0.5, -28.6];
const DPOS = [[-3.4, -27.0], [-1.2, -26.6], [1.0, -26.6], [3.2, -27.0], [-2.4, -29.4], [-0.2, -29.8], [2.0, -29.8], [4.2, -29.4]];
const PILE = [0.3, -23.4];
const traders = DPOS.map(([x, z], i) => { const m = person(modern(i + 1, { tie: 0xD9483B, shirt: 0xF4F2EC, s: 1.02 })); m.position.set(x, 0.1, z); m.rotation.y = -Math.PI / 2; scene.add(m); return m; });   // facing south
{ const b = new GB(); for (const x of [-3.6, 4.6]) { b.cyl(0.08, 0.1, 4.2, 6, 0x5A5F66, x, 2.1, -31.4); b.ball(0.14, 0, 0xE2B24A, x, 4.25, -31.4); } const m = b.mesh(); scene.add(m); stat.push([-3.8, 4.8, -31.6, -31.2, 4.4, 'banner']); }
const flagTx = textTex(1000, 180, (g, w, h) => { g.fillStyle = '#D9483B'; g.fillRect(0, 0, w, h); g.strokeStyle = '#F6F2EA'; g.lineWidth = 8; g.strokeRect(10, 10, w - 20, h - 20); g.fillStyle = '#fff'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = '900 104px Figtree'; g.fillText('▼  CRASH  ▼', w / 2, h / 2 + 6); });
const flag = new THREE.Mesh(new THREE.PlaneGeometry(8.0, 1.44, 12, 1), new THREE.MeshLambertMaterial({ map: flagTx, side: THREE.DoubleSide })); flag.position.set(0.5, 3.35, -31.35); scene.add(flag);
const flagP0 = flag.geometry.attributes.position.array.slice();
stat.push([-7.9, 8.9, -37.2, -20.2, 2.4, 'stage']);
const NC = 72, KEEP = 5;                                       // KEEP: what is left now (about 7% of the 2021 fortune)
const coinG = BIGCOIN(0.42, 0.15), coins = new THREE.InstancedMesh(coinG, GOLD, NC); coins.castShadow = true; coins.frustumCulled = false; scene.add(coins);
const HOME = []; { const cols = [[-1.6, -23.6], [-0.4, -23.3], [0.8, -23.3], [2.0, -23.6], [-1.0, -22.4], [0.2, -22.2], [1.4, -22.4], [-0.4, -24.6], [0.8, -24.6]];
  for (let i = 0; i < NC; i++) { const c = cols[i % cols.length], k = Math.floor(i / cols.length); HOME.push([c[0] + (R() - 0.5) * 0.08, 0.15 + k * 0.16, c[1] + (R() - 0.5) * 0.08, R() * 6]); } }
// coins leave from the top in three batches: the crash bets (to 2023), the halving (2023), 2026; KEEP stay
const BA = [0, 20, 46, NC - KEEP];
const tFlash = j => lerp(T.bigIn + 0.15, T.bigIn + 1.05, j / (NC - KEEP - 1));
const tBack = j => lerp(T.rewind[0] + 0.05, T.rewind[1] - 0.25, (NC - KEEP - 1 - j) / (NC - KEEP - 1));
const tGone = j => j < BA[1] ? lerp(T.cost - 0.05, T.y2023 + 0.1, j / (BA[1] - 1)) : j < BA[2] ? lerp(T.halved - 0.1, T.halved + 0.85, (j - BA[1]) / (BA[2] - BA[1] - 1)) : lerp(T.lost10 - 0.05, T.thirds + 0.35, (j - BA[2]) / (BA[3] - BA[2] - 1));
const _m4 = new THREE.Matrix4(), _q = new THREE.Quaternion(), _e = new THREE.Euler(), _p = new THREE.Vector3(), _s = new THREE.Vector3();
function coinState(i, t) {         // [x, y, z, scale, spin]
  const [hxx, hy, hz, ph] = HOME[i], j = NC - 1 - i;                          // j = 0 for the highest coin
  if (j >= NC - KEEP) return [hxx, hy, hz, 1, ph];
  if (t < T.rewind[0]) { const u = seg(t, tFlash(j), tFlash(j) + 0.25); return [hxx, hy + u * 0.6, hz, 1 - u, ph + u * 4]; }   // flash-forward: what is left now
  if (t < T.rewind[1] + 0.3) { const u = back(seg(t, tBack(j), tBack(j) + 0.3)); return [hxx, hy, hz, Math.max(0, u), ph]; }     // back then: the pile is full
  const a = tGone(j), u = seg(t, a, a + 1.0); if (u <= 0) return [hxx, hy, hz, 1, ph]; if (u >= 1) return [hxx, hy, hz, 0, ph];
  if (j >= BA[1] && j < BA[2]) { return [hxx + Math.sin(j * 2.3) * 3 * u, hy + Math.sin(u * Math.PI) * 4 + u * 3, hz + Math.cos(j * 1.7) * 3 * u, 1 - u, ph + u * 10]; }   // the halving: a burst
  const L = lineHead(a + 1.0); return [lerp(hxx, L[0], eio(u)), lerp(hy, L[1], u) + Math.sin(u * Math.PI) * 6, lerp(hz, L[2], eio(u)), 1 + 1.2 * Math.sin(u * Math.PI) - 0.9 * u, ph + u * 9];   // to the rising market
}
function updateCoins(t) {
  for (let i = 0; i < NC; i++) { const [x, y, z, s, sp] = coinState(i, t); _p.set(x, y, z); _q.setFromEuler(_e.set(0.1 * Math.sin(sp), sp, 0.08 * Math.cos(sp))); _s.setScalar(Math.max(0.001, s)); _m4.compose(_p, _q, _s); coins.setMatrixAt(i, _m4); }
  coins.instanceMatrix.needsUpdate = true;
}
// nine of every ten: ten big coins over the pile, nine go
const TEN = Array.from({ length: 10 }, (_, k) => { const m = new THREE.Mesh(BIGCOIN(0.5, 0.16), GOLD); m.rotation.x = Math.PI / 2; m.castShadow = true; m.visible = false; scene.add(m); return { m, x: PILE[0] + (k % 2 ? 0.62 : -0.62), y: 5.9 - Math.floor(k / 2) * 1.12, z: PILE[1] + 1.0 }; });
const tenIn = k => T.legend - 0.25 + k * 0.05, tenOut = k => lerp(T.nine, T.dollars4 + 0.05, k / 8);

// ───────────────────────── the market: an amber line rising across the sky behind his tower
const MK = new THREE.CatmullRomCurve3([[-8, 4.2, -42], [-6.2, 6.4, -43], [-4.6, 5.5, -44], [-2.8, 8.6, -45], [-1.0, 7.8, -46], [0.8, 11.4, -47], [2.4, 10.5, -48], [3.9, 14.6, -49], [5.2, 13.9, -50], [6.3, 18.8, -51.2], [7.1, 25, -53], [7.8, 33, -55], [8.3, 43, -57], [8.7, 55, -59], [9.0, 69, -61], [9.2, 86, -63]].map(p => new THREE.Vector3(...p)), false, 'catmullrom', 0.25);
const MKS = 260, mkGeo = new THREE.TubeGeometry(MK, MKS, 0.55, 8, false);
const mkM = new THREE.MeshBasicMaterial({ color: 0xF7B500, toneMapped: false, fog: false, transparent: true }); const mkLine = new THREE.Mesh(mkGeo, mkM); scene.add(mkLine);
const mkHead = new THREE.Mesh(new THREE.ConeGeometry(1.5, 3.2, 12), mkM); scene.add(mkHead);
const mkGlowM = new THREE.MeshBasicMaterial({ map: radial('rgba(255,210,110,0.85)', 'rgba(255,190,80,0)'), transparent: true, depthWrite: false, toneMapped: false, fog: false, blending: THREE.AdditiveBlending });
const mkGlow = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), mkGlowM); scene.add(mkGlow);
function lineGrow(t) {
  if (t < T.rewind[0]) return lerp(0.42, 0.7, eo(seg(t, 0, T.bigOut + 1.5)));
  if (t < T.riseA[0]) return lerp(0.7, 0.22, eio(seg(t, T.rewind[0], T.rewind[1])));
  if (t < T.riseB[0]) return lerp(0.22, 0.8, eio(seg(t, T.riseA[0], T.riseA[1])));
  return lerp(0.8, 1, eio(seg(t, T.riseB[0], T.riseB[1])));
}
function lineHead(t) { const p = MK.getPointAt(c01(lineGrow(t))); return [p.x, p.y, p.z]; }

// ───────────────────────── the short seller's report: a big page that flies onto his tower
const repTx = textTex(760, 1000, (g, w, h) => { g.fillStyle = '#FBF8F0'; g.fillRect(0, 0, w, h); g.fillStyle = '#2A2430'; g.textAlign = 'left'; g.textBaseline = 'middle'; g.font = '900 64px Figtree'; g.fillText('SHORT SELLER’S', 56, 92); g.fillText('REPORT', 56, 166);
  g.fillStyle = '#9A9488'; g.font = '700 30px Inter'; g.fillText('MAY 2023', 58, 226); g.fillStyle = '#D8D2C4'; for (let i = 0; i < 6; i++) g.fillRect(58, 290 + i * 46, i % 3 === 2 ? 420 : 640, 16);
  g.textAlign = 'center'; g.fillStyle = '#C8423A'; g.font = '900 112px Fraunces'; g.fillText('“Ponzi-', w / 2, 650); g.fillText('like”', w / 2, 772); g.fillStyle = '#D8D2C4'; for (let i = 0; i < 3; i++) g.fillRect(58, 870 + i * 40, i === 2 ? 380 : 640, 14); });
const report = new THREE.Mesh(new THREE.PlaneGeometry(9.5, 12.5), new THREE.MeshLambertMaterial({ map: repTx, side: THREE.DoubleSide })); report.visible = false; report.castShadow = true; scene.add(report);
const REP_A = [70, 46, -20], REP_B = [0, 13.6, -72.7];

// street life: lamps, trees, cars, people on the plaza
const lampHeads = new GB();
for (const z of [-24, -40, -56]) for (const s of [-1, 1]) { const l = lamp(6.2); l.position.set(s * 34, 0, z); l.rotation.y = s > 0 ? Math.PI : 0; scene.add(l); lampHeads.box(0.6, 0.12, 0.36, 0xFFFFFF, s * 34 - s * 1.25, 6.02, z); }
const lampM = new THREE.MeshLambertMaterial({ color: 0xFFF1C8, emissive: 0xFFD27A, emissiveIntensity: 0 }); scene.add(new THREE.Mesh(lampHeads.geo(), lampM));
for (const [x, z] of [[-40, 6], [36, 10], [-20, 28], [22, 40], [-48, 46], [46, 58], [-8, 62], [10, 20], [27, -24], [27, -62], [17, -17], [-31, -64], [-52, -14], [54, -16], [62, -32], [-62, -24], [-100, -62], [-108, -76], [-96, -98], [-120, -90], [-84, -50], [-58, -104]]) { const m = bushTree(5.5 + R() * 2, R); m.position.set(x, 0, z); scene.add(m); stat.push([x - 2, x + 2, z - 2, z + 2, 8, 'tree']); }
const CARS = [[0xC8423A, -108.5, 1, 8, 0], [0x2F6FB8, -115.5, -1, 9, 40], [0xE9C46A, -2.5, 1, 7, 150], [0x4C9A62, -9.5, -1, 8, 230], [0xEDEDED, -108.5, 1, 8.6, 300], [0x7A4FA0, -9.5, -1, 7, 90], [0xD9664A, -2.5, 1, 9, 420]].map(([col, z, dir, v, off]) => { const m = car(col, { boxy: true }); scene.add(m); return { m, z, dir, v, off }; });
const WALK = [[-26, -40, 12, -6], [14, -44, -6, 4], [-22, -54, 8, 4], [22, -36, -6, -5], [-28, -24, 10, 6], [-62, -70, 0, -24], [-58, -96, 6, 10]].map(([x, z, dx, dz], i) => { const m = person(modern(i, { badge: i % 3 === 0 })); scene.add(m); return { m, a: [x, z], b: [x + dx, z + dz], sp: 0.06 + i * 0.011, ph: i * 0.27 }; });

// ───────────────────────── sky clutter: clouds, birds, sparkles
const clouds = []; { const cr = rng(5150); for (let i = 0; i < 12; i++) { const m = cloud(cr); m.position.set(-640 + i * 110 + cr() * 40, 150 + cr() * 50, -720 - cr() * 160); m.scale.setScalar(2.4 + cr() * 1.6); m.userData.x0 = m.position.x; scene.add(m); clouds.push(m); } }
const birdMat = new THREE.MeshBasicMaterial({ color: 0x2A2430, side: THREE.DoubleSide });
const wingG = new THREE.BufferGeometry(); wingG.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0.1, 1.6, 0, -0.3, 1.5, 0, 0.5], 3));
const FLOCK = [{ t0: 0, t1: T.b3 + 0.5, a: [-50, 30, -40], b: [40, 40, -90] }, { t0: T.b11 - 0.5, t1: T.b12 + 1.0, a: [-110, 30, -60], b: [-30, 36, -120] }];
const birds = []; for (let i = 0; i < 9; i++) { const g = new THREE.Group(), l = new THREE.Mesh(wingG, birdMat), r = new THREE.Mesh(wingG, birdMat); r.scale.x = -1; g.add(l, r); g.userData = { l, r, ph: R() * 6 }; g.visible = false; g.scale.setScalar(1.1); scene.add(g); birds.push(g); }
function updateBirds(t) {
  const f = FLOCK.find(f => t >= f.t0 && t <= f.t1); for (const b of birds) b.visible = !!f; if (!f) return;
  const u = seg(t, f.t0, f.t1), dx = f.b[0] - f.a[0], dz = f.b[2] - f.a[2], L = Math.hypot(dx, dz), ux = dx / L, uz = dz / L;
  birds.forEach((b, i) => { const row = Math.ceil(i / 2), sd = i % 2 ? 1 : -1; b.position.set(lerp(f.a[0], f.b[0], u) - ux * row * 2.4 + uz * sd * row * 1.7, lerp(f.a[1], f.b[1], u) + Math.sin(t * 2 + b.userData.ph) * 0.5, lerp(f.a[2], f.b[2], u) - uz * row * 2.4 - ux * sd * row * 1.7); b.rotation.y = Math.atan2(ux, uz); const fl = Math.sin(t * 10 + b.userData.ph) * 0.65; b.userData.l.rotation.z = fl; b.userData.r.rotation.z = -fl; });
}
const sparkT = (() => { const cv = document.createElement('canvas'); cv.width = cv.height = 64; const g = cv.getContext('2d'); g.translate(32, 32); g.fillStyle = '#fff'; for (let k = 0; k < 2; k++) { g.rotate(Math.PI / 2 * k); g.beginPath(); g.moveTo(0, -30); g.quadraticCurveTo(3, -3, 30, 0); g.quadraticCurveTo(3, 3, 0, 30); g.quadraticCurveTo(-3, 3, -30, 0); g.quadraticCurveTo(-3, -3, 0, -30); g.fill(); } const tx = new THREE.CanvasTexture(cv); tx.colorSpace = THREE.SRGBColorSpace; return tx; })();
const sparks = []; for (let i = 0; i < 90; i++) { const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: sparkT, color: 0xFFE9A8, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false })); sp.userData = { ph: R() * 6.28, w: 3 + R() * 4, dx: (R() - 0.5) * 2, dz: (R() - 0.5) * 2, k: R() }; scene.add(sp); sparks.push(sp); }

// ───────────────────────── the price screen: one canvas, redrawn only when what it shows changes
const F = (w, px, fam) => `${w} ${px}px ${fam}`;
let scrKey = '';
function scrMode(t) {
  if (t < T.b5 - 0.2) return ['fortune', seg(t, 0, 1.2), 0];
  if (t < T.b7 - 0.1) return ['bet', seg(t, T.b5, T.b5 + 1.2), seg(t, T.riseA[0], T.riseA[1])];
  if (t < T.b9 - 0.1) return ['halve', seg(t, T.but8 - 0.1, T.halved + 0.5), seg(t, T.halved - 0.1, T.halved + 0.2)];
  if (t < T.b10 - 0.1) return ['loans', seg(t, T.b9, T.b9 + 0.6), 0];
  if (t < T.b11 - 0.1) return ['year', seg(t, T.fell10 - 0.1, T.thirds + 0.4), seg(t, T.thirds - 0.1, T.thirds + 0.2)];
  if (t < T.b12 - 0.1) return ['debt', seg(t, T.b11, T.b11 + 0.6), seg(t, T.may11 - 0.1, T.may11 + 0.3)];
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
  const line = (pts, col, wd = 14, dash) => { g.strokeStyle = col; g.lineWidth = wd; g.lineJoin = 'round'; g.lineCap = 'round'; g.setLineDash(dash || []); g.beginPath(); pts.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.stroke(); g.setLineDash([]); };
  const partial = (pts, u) => { const out = [pts[0]]; const n = pts.length - 1, k = Math.min(n - 1, Math.floor(u * n)), v = u * n - k; for (let i = 1; i <= k; i++) out.push(pts[i]); const A = pts[k], B = pts[k + 1]; out.push([lerp(A[0], B[0], v), lerp(A[1], B[1], v)]); return out; };
  const head = (s, y = 60) => { g.fillStyle = '#FFD27A'; g.font = F(800, 40, 'Inter'); g.fillText(s, 360, y); };
  if (mode === 'fortune') {
    head('CARL ICAHN’S FORTUNE');
    g.textAlign = 'left'; g.fillStyle = 'rgba(255,255,255,0.75)'; g.font = F(700, 34, 'Inter'); g.fillText('2021', 60, 170); g.fillText('NOW', 60, 420);
    g.fillStyle = '#F7B500'; g.fillRect(60, 210, 600 * eo(a), 90); g.fillStyle = '#E0483B'; g.fillRect(60, 460, 42, 90);
    g.font = F(900, 64, 'JBM'); g.fillStyle = '#1C1300'; if (a > 0.5) g.fillText('$24.6 B', 90, 257); g.fillStyle = '#FF8A7A'; g.fillText('≈ $1.7 B', 130, 507);
    g.textAlign = 'center'; g.fillStyle = 'rgba(255,255,255,0.7)'; g.font = F(700, 30, 'Inter'); g.fillText('FORBES DATA · BLOOMBERG: ≈ $1.3 B', 360, 660); g.fillText('AS OF 25 NOV 2026', 360, 720);
  } else if (mode === 'bet') {
    head('HIS BET VS THE MARKET');
    const up = [[60, 560], [150, 520], [240, 540], [330, 450], [420, 470], [510, 360], [590, 380], [670, 250]], dn = [[60, 560], [200, 610], [330, 660], [470, 700], [640, 740]];
    line(partial(dn, lerp(0.2, 1, eo(a))), '#FF6B5B', 10, [22, 16]); line(partial(up, lerp(0.15, 1, eo(b))), '#F7B500', 16);
    g.font = F(900, 46, 'Figtree'); g.fillStyle = '#FF8A7A'; g.fillText('HIS BET: A CRASH', 360, 150); g.fillStyle = b > 0.3 ? '#FFC84A' : 'rgba(255,255,255,0.2)'; g.fillText('THE MARKET: ▲', 360, 215);
    g.fillStyle = 'rgba(255,255,255,0.7)'; g.font = F(700, 30, 'Inter'); g.fillText('2017 → EARLY 2023 · ≈ −$9 B (FT)', 360, 785);
  } else if (mode === 'halve') {
    head('ICAHN ENTERPRISES · MAY 2023');
    const pts = [[60, 230], [150, 250], [230, 400], [310, 430], [400, 520], [490, 560], [580, 540], [670, 590]];
    line(partial(pts, lerp(0.1, 1, eo(a))), '#FF6B5B', 16);
    g.font = F(900, 110, 'JBM'); g.fillStyle = b > 0.3 ? '#FF6B5B' : 'rgba(255,255,255,0.15)'; g.fillText('▼ 50%+', 360, 690);
  } else if (mode === 'loans') {
    head('HIS UNITS, PLEDGED FOR LOANS');
    g.globalAlpha = 0.3 + 0.7 * a; g.fillStyle = '#FFFFFF'; g.font = F(900, 128, 'JBM'); g.fillText('51–82%', 360, 330); g.globalAlpha = 1;
    g.fillStyle = 'rgba(255,255,255,0.78)'; g.font = F(700, 32, 'Inter'); g.fillText('OF ICAHN ENTERPRISES’ UNITS', 360, 470); g.fillText('FOR LOANS WORTH BILLIONS', 360, 520);
    g.fillStyle = 'rgba(255,255,255,0.6)'; g.font = F(700, 28, 'Inter'); g.fillText('SEC, AUG 2024 · 2018 → 2024', 360, 640);
  } else if (mode === 'year') {
    head('ICAHN ENTERPRISES · 2026');
    const pts = [[60, 210], [140, 240], [220, 230], [300, 300], [380, 290], [460, 380], [540, 430], [610, 480], [670, 590]];
    line(partial(pts, lerp(0.1, 1, eo(a))), '#FF6B5B', 16);
    g.font = F(900, 110, 'JBM'); g.fillStyle = b > 0.3 ? '#FF6B5B' : 'rgba(255,255,255,0.15)'; g.fillText('▼ 66%', 360, 680);
    g.fillStyle = 'rgba(255,255,255,0.7)'; g.font = F(700, 30, 'Inter'); g.fillText('$7.55 (END 2025) → $2.57 (25 NOV)', 360, 775);
  } else if (mode === 'debt') {
    head('NOTES DUE MAY 2027');
    g.globalAlpha = 0.3 + 0.7 * a; g.fillStyle = '#FFFFFF'; g.font = F(900, 150, 'JBM'); g.fillText('$1.4 B', 360, 300); g.globalAlpha = 1;
    g.fillStyle = b > 0.3 ? '#FFC84A' : 'rgba(255,255,255,0.2)'; g.font = F(900, 60, 'Figtree'); g.fillText('REFINANCE?', 360, 470);
    g.fillStyle = 'rgba(255,255,255,0.7)'; g.font = F(700, 30, 'Inter'); g.fillText('“NO ASSURANCE” · 10-Q, NOV 2026', 360, 620);
  } else if (mode === 'today') {
    head('AS OF 28 NOV 2026');
    g.fillStyle = '#FFFFFF'; g.font = F(900, 96, 'JBM'); g.fillText('$1.3–1.7 B', 360, 330);
    g.fillStyle = 'rgba(255,255,255,0.75)'; g.font = F(700, 34, 'Inter'); g.fillText('HIS FORTUNE · BLOOMBERG / FORBES', 360, 470); g.fillText('STORY NOT OVER', 360, 560);
  } else if (mode === 'cta') {
    g.font = F(900, 170, 'Figtree'); g.fillStyle = '#F7B500'; g.fillText('YES', 360, 220); g.fillStyle = '#6FD0C0'; g.fillText('NO', 360, 560);
    g.fillStyle = '#FFFFFF'; g.font = F(800, 60, 'Inter'); g.fillText('or', 360, 390); g.font = F(700, 38, 'Inter'); g.fillStyle = 'rgba(255,255,255,0.8)'; g.fillText('YOU DECIDE', 360, 720);
  }
  scrTx.needsUpdate = true;
}

// ───────────────────────── camera path (spherical keys around a target; `up` tilts the view so the subject sits lower in the frame)
const SCRF = (dx = 0, dy = 0) => [SCR[0] + dx, SCR[1] + dy, SCR[2]];
const FDT = [FD[0], 1.8, FD[1]];
const CAM = [
  { t: 0, tg: [0.4, 3.2, -40], d: 36, az: -4, el: 1, up: 0.1 },                                     // the cover: the camp under its CRASH flag, his tower, the market line climbing behind
  { t: T.bigOut, tg: [0.4, 3.2, -38], d: 32, az: -6, el: 2, up: 0.12, mv: 1 },
  { t: (T.bigOut + T.icahn) / 2 + 0.1, tg: [0.3, 3, -48], d: 24, az: 4, el: 15, up: 0.08, mv: 1 },   // lift over the camp
  { t: T.icahn + 0.25, tg: FDT, d: 13.5, az: 14, el: 8, up: 0.08, mv: 1 },                         // him, at his doors
  { t: T.investors + 0.3, tg: FDT, d: 12, az: 6, el: 7, up: 0.08 },
  { t: (T.investors + T.barely) / 2 + 0.25, tg: [0.3, 2, -40], d: 14, az: -4, el: 26, up: 0.06, mv: 1 },   // lift over the camp
  { t: T.barely + 0.15, tg: [PILE[0], 0.3, PILE[1] + 0.4], d: 13.5, az: -8, el: 44, up: 0.0, mv: 1 },     // what is left: a few coins
  { t: T.billionaire + 0.4, tg: [PILE[0], 0.3, PILE[1] + 0.4], d: 12.8, az: -3, el: 44, up: 0.0 },
  { t: T.legend + 0.1, tg: [PILE[0], 3.6, PILE[1] + 1], d: 15, az: 0, el: 4, up: 0.0, mv: 1 },       // ten coins, nine go
  { t: T.dollars4 + 0.5, tg: [PILE[0], 3.6, PILE[1] + 1], d: 14, az: 3, el: 4, up: 0.0 },
  { t: T.sure + 0.2, tg: [0.6, 1.9, -28.6], d: 17, az: -10, el: 9, up: 0.06, mv: 1 },                // back then: his funds' camp, the pile full
  { t: T.against5 + 0.2, tg: [0.6, 2.0, -29], d: 15, az: -4, el: 8, up: 0.07 },
  { t: T.rising + 0.6, tg: [0, 46, -120], d: 150, az: 3, el: 4, up: 0.05, mv: 1 },                   // pull back: the market keeps rising, the coins fly off
  { t: T.y2023 + 0.3, tg: [0, 48, -120], d: 142, az: 0, el: 4, up: 0.05 },
  { t: T.seller + 0.2, tg: [0, 12.6, -72], d: 44, az: 9, el: 4, up: 0.06, mv: 1 },                     // the report flies onto his tower
  { t: T.ponzi + 0.6, tg: [0, 12.8, -72], d: 40, az: 5, el: 4, up: 0.06 },
  { t: T.self + 0.35, tg: FDT, d: 13, az: -14, el: 8, up: 0.09, mv: 1 },                              // “self-serving”
  { t: T.halved + 0.35, tg: SCRF(0, -1.0), d: 50, az: -24, el: 6, up: 0.0, mv: 1 },                // the screen: the units halve
  { t: T.money + 0.2, tg: [0, 20, -76], d: 70, az: 18, el: 9, up: 0.05, mv: 1 },                   // his tower: almost all his money
  { t: T.borrowed + 0.2, tg: [0, 16.5, -74], d: 50, az: 12, el: 7, up: 0.05, mv: 1 },               // chained and locked: pledged for loans
  { t: T.them + 0.6, tg: [0, 16.5, -74], d: 47, az: 8, el: 7, up: 0.05 },
  { t: T.lost10 + 0.2, tg: [0.4, 3.2, -40], d: 34, az: -5, el: 2, up: 0.12, mv: 1 },               // 2026: the bets lose again, the line climbs
  { t: T.fell10 + 0.4, tg: SCRF(0, -1.0), d: 50, az: -24, el: 6, up: 0.0, mv: 1 },                // the screen: about two-thirds
  { t: T.refinance + 0.1, tg: [BK[0] + 5, 22.5, BK[1] + 0.5], d: 54, az: 62, el: 7, up: 0.05, mv: 1 },      // the bank, the notes due in May
  { t: T.may11 + 0.25, tg: [BK[0] + 5, 23, BK[1] + 0.5], d: 50, az: 66, el: 7, up: 0.05 },
  { t: T.b12 + 0.1, tg: [-36, 150, -66], d: 40, az: 40, el: -32, up: 0, mv: 1 },                    // sky wipe: up into the evening sky
  { t: T.ninety + 0.8, tg: FDT, d: 15, az: 18, el: 7, up: 0.09, mv: 1 },                            // …and down at his doors at sunset: 90
  { t: T.yet + 0.4, tg: FDT, d: 13.5, az: 10, el: 7, up: 0.09 },
  { t: T.came + 0.3, tg: [0, 26, -92], d: 270, az: 14, el: 19, up: 0.15, mv: 1 },                  // crane up over the city at dusk, the line glowing
  { t: T.cta + 0.1, tg: [0, 24, -92], d: 262, az: 11, el: 19, up: 0.15 },
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

// ───────────────────────── overlay (captions, hook, big number, labels)
{ const st = document.createElement('style'); st.textContent = `
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
const tagMan = mk('tag', 'Carl Icahn · <b>investor</b>');
const tagNow = mk('tag dn', 'now ≈ <b>$1.7 B</b> (Forbes) · <b>$1.3 B</b> (Bloomberg)');
const tagNine = mk('tag dn', '<b>9</b> of every <b>10</b> gone');
const tagBet = mk('tag', 'his funds bet on a <b>crash</b>');
const tagRise = mk('tag am', 'the market kept <b>rising</b>');
const tagCost = mk('tag dn', '≈ <b>−$9 B</b> by early 2023 (FT)');
const tagReport = mk('tag', 'a short seller’s report · <b>May 2023</b>');
const bubSelf = mk('bub', '“self-serving”');
const tagHalf = mk('tag dn', 'units more than <b>halved</b> in weeks');
const tagAll = mk('tag am', 'almost <b>all</b> his money');
const tagLoan = mk('tag', 'pledged for loans worth <b>billions</b> (SEC)');
const tagYear = mk('tag dn', '2026 · his funds <b>−44%</b> by Sept');
const tagBond = mk('tag', '“no assurance” it can <b>refinance</b>');
const tagAge = mk('tag', 'Carl Icahn, <b>90</b>');
const title = mk('title', '<div class="s">THE STORY OF</div><div class="n">The Crash That\n<em>Never</em> Came</div>');
const lesson = mk('lesson', 'Being sure isn’t\nbeing <em>right</em>.');
const ctaChip = mk('chip am', 'you decide');
const boxes = [0, 1].map(() => { const e = mk('cbox', '<span class="in"></span><span class="post">Post</span>'); return { e, inn: e.querySelector('.in'), post: e.querySelector('.post') }; });
const foot = document.getElementById('foot');
const FOOT_A = 'Sources: Forbes data via New York Post (25 Nov 2026), The Mirror, news.com.au · Bloomberg Billionaires Index (24 Nov)\n$24.6 bn (2021) → ≈ $1.7 bn (Forbes); ≈ $1.3 bn, about −$21 bn in five years (Bloomberg) · not advice';
const FOOT_B = 'Sources: Financial Times analysis (May 2023) via Fortune, Business Insider, NZ Herald\nhis funds’ bets against the market lost ≈ $1.8 bn in 2017 and ≈ $7 bn from 2018 to early 2023';
const FOOT_C = 'Sources: Hindenburg Research (2 May 2023) via Fortune/Bloomberg · SEC (19 Aug 2024) · NBC News\n“Ponzi-like” was the short seller’s claim; Icahn called it “self-serving” · pledges: 51–82% of units (SEC)';
const FOOT_D = 'Sources: Icahn Enterprises Q3 2026 report and 10-Q, 24/7 Wall St., Bloomberg via Yahoo Finance, New York Post\nfunds −43.8% (Jan–Sep 2026) · units $7.55 (end 2025) → $2.57 (25 Nov 2026) · ≈ $1.4 bn of notes due May 2027';
const FOOT_E = 'As of 28 Nov 2026 · Sources: Bloomberg, Forbes via New York Post, Icahn Enterprises filings\nIcahn did not comment (Bloomberg) · the company says it has enough cash for the next 12 months · not advice';
const setTxt = (e, s) => { if (e.textContent !== s) e.textContent = s; };
const setHTML = (e, s) => { if (e._h !== s) { e._h = s; e.innerHTML = s; } };

function updateUI(t) {
  updateCaption(t);
  setTxt(foot, t > T.b5 - 0.1 && t < T.b7 - 0.1 ? FOOT_B : t > T.b7 - 0.1 && t < T.b10 - 0.1 ? FOOT_C : t > T.b10 - 0.1 && t < T.b12 - 0.1 ? FOOT_D : t > T.b12 - 0.1 ? FOOT_E : FOOT_A);
  foot.style.opacity = (0.95 * seg(t, 3.0, 3.6) * (1 - seg(t, T.cta, T.cta + 0.3) * 0.45)).toFixed(3);
  // 1 — the hook card (0-1.5 s, the cover), then the big number (1.5-3 s)
  if (hookEl) { const out = seg(t, T.hookEnd, T.hookEnd + (TIM.big ? 0.22 : 0.3)); put(hookEl, W / 2, 640 - 40 * eo(out), 1 - out, 1 + 0.035 * seg(t, 0, T.hookEnd) + 0.06 * out); }
  if (bigEl) { const o = win(t, T.bigIn, T.bigOut - 0.05, 0.15, 0.25), u = eo(seg(t, T.bigIn + 0.05, T.bigIn + 0.7)), land = seg(t, T.bigIn + 0.7, T.bigIn + 1.0), sh = (1 - land) * (land > 0 ? 1 : 0);
    bigBg.style.opacity = (0.92 * o).toFixed(3); setHTML(BIGN.v, bigText(u)); BIGN.line.style.strokeDashoffset = (BIGN.len * (1 - eo(seg(t, T.bigIn, T.bigIn + 0.9)))).toFixed(1);
    put(bigEl, W / 2 + Math.sin(t * 90) * 7 * sh, 860 + Math.cos(t * 77) * 5 * sh, o, pop(t, T.bigIn, 0.4) * (1 + 0.05 * Math.sin(Math.PI * land))); }
  // chips (one line at the top that says where we are)
  let ct = '', co = 0, cp = 0;
  const CH = [[T.bigOut + 0.05, T.b5 - 0.1, 'Carl Icahn · 2021 → Nov 2026'], [T.b5 + 0.05, T.b7 - 0.1, 'his funds · 2017 → 2023'], [T.b7 + 0.05, T.b9 - 0.1, 'May 2023'],
    [T.b9 + 0.05, T.b10 - 0.1, 'his money · Icahn Enterprises'], [T.b10 + 0.05, T.b11 - 0.1, '2026'], [T.b11 + 0.05, T.b12 - 0.1, 'his company’s debt · Nov 2026'], [T.b12 + 0.05, T.b13 - 0.1, 'as of 28 Nov 2026']];
  for (const [a, b, s] of CH) { const o = win(t, a, b, 0.22, 0.22); if (o > co) { co = o; ct = s; cp = pop(t, a); } }
  if (ct) setTxt(chip, ct); put(chip, W / 2, 472, co, cp);
  // 2–4 — the man; what is left; nine of ten
  { const p = proj(FD[0], 2.9, FD[1]); put(tagMan, clampX(p[0], 220), clampY(p[1] - 26, 620, 1400), p[2] ? win(t, T.icahn - 0.05, T.b3 - 0.1, 0.2, 0.25) : 0, pop(t, T.icahn - 0.05)); }
  { const p = proj(PILE[0], 2.2, PILE[1]); put(tagNow, W / 2, clampY(p[1] - 40, 640, 1380), p[2] ? win(t, T.barely - 0.05, T.b4 - 0.1, 0.25, 0.25) : 0, pop(t, T.barely - 0.05)); }
  put(tagNine, W / 2, 1300, win(t, T.nine + 0.6, T.b5 - 0.15, 0.25, 0.25), pop(t, T.nine + 0.6));
  // 5–6 — the bet; the market rises; the cost
  { const p = proj(ST[0], 4.6, ST[1] - 1); put(tagBet, clampX(p[0], 240), clampY(p[1] - 30, 620, 1400), p[2] ? win(t, T.funds - 0.1, T.b6 - 0.1, 0.25, 0.25) : 0, pop(t, T.funds - 0.1)); }
  { const L = lineHead(t), p = proj(L[0], L[1] + 4.5, L[2]); put(tagRise, clampX(p[0], 240), clampY(p[1] - 20, 620, 1300), p[2] ? win(t, T.rising - 0.1, T.b7 - 0.15, 0.25, 0.25) : 0, pop(t, T.rising - 0.1)); }
  put(tagCost, W / 2, 1260, win(t, T.cost - 0.05, T.b7 - 0.15, 0.25, 0.25), pop(t, T.cost - 0.05));
  // 7–8 — the report; “self-serving”; halved
  { const p = proj(REP_B[0], REP_B[1] + 8.4, REP_B[2]); put(tagReport, clampX(p[0], 260), clampY(p[1] - 20, 620, 1400), p[2] ? win(t, T.called7 - 0.05, T.b8 - 0.1, 0.25, 0.25) : 0, pop(t, T.called7 - 0.05)); }
  { const p = proj(FD[0], 2.7, FD[1]); put(bubSelf, clampX(p[0] + 90, 200), clampY(p[1] - 60, 620, 1400), p[2] ? win(t, T.self - 0.1, T.halved - 0.15, 0.2, 0.2) : 0, pop(t, T.self - 0.1)); }
  put(tagHalf, W / 2, 1300, win(t, T.halved - 0.05, T.b9 - 0.1, 0.25, 0.25), pop(t, T.halved - 0.05));
  // 9 — almost all his money; pledged for loans
  { const p = proj(NV[0], NVH + 12, NV[1]); put(tagAll, clampX(p[0], 220), clampY(p[1] - 20, 620, 1380), p[2] ? win(t, T.almost - 0.05, T.b10 - 0.1, 0.25, 0.25) : 0, pop(t, T.almost - 0.05)); }
  { const p = proj(LOCK[0], LOCK[1] - 6.5, LOCK[2]); put(tagLoan, clampX(p[0], 280), clampY(p[1] + 20, 640, 1380), p[2] ? win(t, T.borrowed - 0.05, T.b10 - 0.1, 0.25, 0.25) : 0, pop(t, T.borrowed - 0.05)); }
  // 10 — 2026
  put(tagYear, W / 2, 1300, win(t, T.bets10 - 0.05, T.fell10 - 0.35, 0.25, 0.2), pop(t, T.bets10 - 0.05));
  // 11 — the notes
  { const p = proj(BOND[0], BOND[1] - 7, BOND[2]); put(tagBond, clampX(p[0], 260), clampY(p[1] + 20, 640, 1380), p[2] ? win(t, T.may11 - 0.05, T.b12 - 0.1, 0.25, 0.25) : 0, pop(t, T.may11 - 0.05)); }
  // 12 — 90
  { const p = proj(FD[0], 2.9, FD[1]); put(tagAge, clampX(p[0], 220), clampY(p[1] - 26, 620, 1400), p[2] ? win(t, T.ninety + 0.55, T.b13 - 0.1, 0.2, 0.25) : 0, pop(t, T.ninety + 0.55)); }
  // 13 — title and lesson; 14 — you decide
  put(title, W / 2, 640, win(t, T.story, T.cta - 0.1, 0.4, 0.3), 0.94 + 0.06 * eo(seg(t, T.story, T.story + 0.6)));
  put(lesson, W / 2, 1180, win(t, T.sure13 - 0.1, T.cta - 0.15, 0.3, 0.25), pop(t, T.sure13 - 0.1));
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
const slumpAt = t => Math.max(win(t, T.bigIn + 0.4, T.b3, 0.4, 0.5) * 0.8, win(t, T.rising, T.b7, 0.5, 0.5), win(t, T.lost10 - 0.1, T.b11 + 0.5, 0.4, 0.5));
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
  doorGlowM.opacity = 0.55 * night;
  // his tower shudders when the units fall
  { const sh = win(t, T.halved - 0.1, T.halved + 0.9, 0.08, 0.4) + win(t, T.fell10, T.thirds + 0.8, 0.1, 0.4) * 0.8 + win(t, T.ponzi - 0.1, T.ponzi + 0.5, 0.05, 0.3) * 0.5;
    nvG.rotation.z = Math.sin(t * 23) * 0.004 * sh; nvG.rotation.x = Math.sin(t * 19 + 1) * 0.003 * sh; }
  // the market line grows (and rewinds to "back then")
  { const gr = c01(lineGrow(t)), idx = mkGeo.index.count; mkGeo.setDrawRange(0, Math.max(6, Math.floor(idx * gr / 6) * 6));
    const p = MK.getPointAt(gr), tn = MK.getTangentAt(gr); mkHead.position.copy(p); mkHead.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), tn); mkHead.position.addScaledVector(tn, 1.3);
    mkGlow.position.copy(p); mkGlow.lookAt(camera.position); mkGlow.scale.setScalar(9 + 2 * Math.sin(t * 3)); const fade = 1 - Math.max(win(t, T.bigOut + 0.15, T.b5 - 0.3, 0.4, 0.45), win(t, T.b7 - 0.3, T.b10 - 0.15, 0.4, 0.45), win(t, T.b12 - 0.4, T.story + 0.9, 0.3, 0.6)); mkM.opacity = fade; mkM.depthWrite = fade > 0.95; mkGlowM.opacity = 0.75 * fade; mkLine.visible = mkHead.visible = mkGlow.visible = fade > 0.02; }
  // the investor at his doors: a small nod when he speaks; he turns to the report
  founder.rotation.y = -Math.PI / 2 + 0.25 * win(t, T.short7, T.self + 0.6, 0.4, 0.5) * Math.sin(1); founder.position.y = hopY([T.self], t, 0.05);
  // his funds' traders: hopeful when they bet, slumped when the market rises
  { const sl = slumpAt(t);
    traders.forEach((m, i) => { const cheer = hopY([T.bet5 + i * 0.07, T.against5 + 0.1 + i * 0.05], t, 0.3);
      m.position.y = 0.1 + cheer * (1 - sl); m.rotation.z = -0.16 * sl * (i % 2 ? 1 : 0.8); m.scale.set(1.02, 1.02 * (1 - 0.06 * sl), 1.02);
      m.rotation.y = -Math.PI / 2 + Math.sin(t * 0.7 + i) * 0.05 + 0.5 * sl * (i % 2 ? 1 : -1) * 0.3; }); }
  // the flag waves (and droops when the bets lose)
  { const dr = slumpAt(t) * 0.6, p = flag.geometry.attributes.position; for (let i = 0; i < p.count; i++) { const x0 = flagP0[i * 3], u = Math.sin(Math.PI * (x0 + 4) / 8); p.setZ(i, Math.sin(t * 3.2 + x0 * 1.1) * 0.12 * u * (1 - dr)); p.setY(i, flagP0[i * 3 + 1] - 0.05 * u * (1 + Math.sin(t * 2.1 + x0)) - 0.5 * dr * u); } p.needsUpdate = true; }
  // his fortune
  updateCoins(t);
  // ten coins: nine go
  TEN.forEach(({ m, x, y, z }, k) => { const on = t > tenIn(k) && t < T.b5 - 0.05; m.visible = on; if (!on) return;
    const a = back(seg(t, tenIn(k), tenIn(k) + 0.3)), gone = k < 9 ? seg(t, tenOut(k), tenOut(k) + 0.45) : 0, fade = seg(t, T.b5 - 0.4, T.b5 - 0.05);
    m.position.set(x + gone * (k % 2 ? 1.5 : -1.5), y - gone * gone * 5, z + gone * 1.2); m.scale.setScalar(Math.max(0.001, a * (1 - gone) * (1 - fade) * (k === 9 ? 1 + 0.08 * Math.sin(t * 6) * seg(t, T.dollars4, T.dollars4 + 0.3) : 1)));
    m.rotation.set(Math.PI / 2 + gone * 4, 0, Math.sin(t * 2 + k) * 0.15 + gone * 3); });
  // the short seller's report flies onto the tower
  { const on = t > T.report[0]; report.visible = on && t < T.money + 0.5; if (report.visible) { const u = eio(seg(t, T.report[0], T.report[1])), fo = seg(t, T.money - 0.1, T.money + 0.5);
    report.position.set(lerp(REP_A[0], REP_B[0], u), lerp(REP_A[1], REP_B[1], u) + Math.sin(u * Math.PI) * 8, lerp(REP_A[2], REP_B[2], u)); report.rotation.set(0, (1 - u) * 2.6, (1 - u) * 0.9 + Math.sin(t * 7) * 0.02 * (1 - u)); report.scale.setScalar(Math.max(0.001, (0.6 + 0.4 * u) * (1 - fo))); } }
  // the chains and the padlock (pledged for loans)
  CHAINS.forEach(({ im }, k) => { const u = seg(t, T.chain[0] + k * 0.15, T.chain[1] + k * 0.15); im.count = t > T.b9 ? Math.floor(NL * eo(u)) : 0; });
  { const v = back(seg(t, T.borrowed - 0.1, T.borrowed + 0.25)); lock.visible = t > T.borrowed - 0.1; lock.scale.setScalar(Math.max(0.001, v)); lock.rotation.z = Math.sin(t * 2.2) * 0.05 * seg(t, T.borrowed, T.borrowed + 0.6); }
  chainM.emissiveIntensity = 0.4 + 0.3 * night;
  // the notes due in May
  { const on = t > T.refinance - 0.2; bond.visible = on; qMark.visible = t > T.may11 - 0.1;
    if (on) { const u = back(seg(t, T.refinance - 0.2, T.refinance + 0.25)); bond.position.set(BOND[0], BOND[1] + Math.sin(t * 1.6) * 0.3, BOND[2]); bond.rotation.set(0, Math.PI / 2 - 0.05 + Math.sin(t * 0.8) * 0.04, 0); bond.scale.setScalar(Math.max(0.001, u)); }
    if (qMark.visible) { const v = back(seg(t, T.may11 - 0.1, T.may11 + 0.25)); qMark.position.set(BOND[0] + 1.0, BOND[1] + 4.4 + Math.sin(t * 3) * 0.3, BOND[2] - 8.6); qMark.rotation.set(0, Math.PI / 2 - 0.05, Math.sin(t * 2.4) * 0.12); qMark.scale.setScalar(Math.max(0.001, v)); } }
  // cars and people
  for (const c of CARS) { const L = 700, x = ((c.off + t * c.v) % L) - L / 2; c.m.position.set(c.dir * x, 0, c.z); c.m.rotation.y = c.dir > 0 ? 0 : Math.PI; }
  WALK.forEach((w, i) => { const u = (Math.sin((t * w.sp + w.ph) * Math.PI * 2) + 1) / 2, dir = Math.cos((t * w.sp + w.ph) * Math.PI * 2) > 0 ? 1 : -1; const x = lerp(w.a[0], w.b[0], u), z = lerp(w.a[1], w.b[1], u); w.m.position.set(x, Math.abs(Math.sin(t * 7 + i)) * 0.06, z); w.m.rotation.y = Math.atan2(-(w.b[1] - w.a[1]) * dir, (w.b[0] - w.a[0]) * dir); });
  // clouds
  for (const c of clouds) { c.position.x = c.userData.x0 + t * 1.2; c.material.opacity = 0.9 - 0.5 * night; const k = lerp(1, 0.45, night); c.material.color.setRGB(lerp(s.hor[0], 1, 0.55) * k, lerp(s.hor[1], 1, 0.55) * k, lerp(s.hor[2], 1, 0.55) * k * 1.05); }
  // sparkles: the market line's head as it climbs; the pile on the cover; the last coin; the final comment
  { let k = 0; const put3 = (x, y, z, sz, on) => { const sp = sparks[k++]; if (!sp) return; const tw = Math.pow(Math.abs(Math.sin(t * sp.userData.w + sp.userData.ph)), 3); sp.position.set(x, y, z); sp.scale.setScalar(sz * (0.25 + tw)); sp.material.opacity = on * (0.3 + 0.7 * tw); sp.visible = on > 0.01; };
    const s1 = Math.min(1, win(t, 0, T.bigOut + 1, 0.01, 0.6) + win(t, T.riseA[0], T.riseA[1] + 0.8, 0.2, 0.6) + win(t, T.riseB[0], T.riseB[1] + 0.8, 0.2, 0.6) + win(t, T.came - 0.5, DUR + 1, 0.5, 0.1) * 0.7), L = lineHead(t);
    for (let i = 0; i < 34; i++) { const sp = sparks[i].userData, ph = (t * 0.5 + sp.k) % 1; put3(L[0] + sp.dx * 5, L[1] + 1.5 + ph * 9, L[2] + sp.dz * 4, 1.3 + 1.0 * (1 - ph), s1 * Math.sin(ph * Math.PI)); }
    const s2 = win(t, 0, 1.4, 0.01, 0.3); for (let i = 0; i < 16; i++) { const ph = (t * 0.6 + i / 16) % 1, a = i * 2.4; put3(PILE[0] + Math.cos(a) * 2.2, 0.6 + ph * 3.4, PILE[1] + Math.sin(a) * 1.6, 0.55, s2 * Math.sin(ph * Math.PI)); }
    const s4 = win(t, T.dollars4 - 0.2, T.b5 - 0.2, 0.2, 0.2); const c9 = TEN[9]; for (let i = 0; i < 10; i++) { const ph = (t * 0.7 + i / 10) % 1, a = i * 2.4; put3(c9.x + Math.cos(a) * (0.6 + ph), c9.y + Math.sin(a) * (0.6 + ph), c9.z + 0.4, 0.45, s4 * Math.sin(ph * Math.PI)); }
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
  rewind: T.rewind, riseA: T.riseA, riseB: T.riseB, report: T.report, chain: T.chain,
  flash: Array.from({ length: 8 }, (_, j) => +tFlash(Math.round(j * (NC - KEEP - 1) / 7)).toFixed(3)),
  back: Array.from({ length: 10 }, (_, j) => +tBack(Math.round(j * (NC - KEEP - 1) / 9)).toFixed(3)),
  goneA: Array.from({ length: 10 }, (_, j) => +tGone(Math.round(j * (BA[1] - 1) / 9)).toFixed(3)),
  goneB: Array.from({ length: 10 }, (_, j) => +tGone(BA[1] + Math.round(j * (BA[2] - BA[1] - 1) / 9)).toFixed(3)),
  goneC: Array.from({ length: 10 }, (_, j) => +tGone(BA[2] + Math.round(j * (BA[3] - BA[2] - 1) / 9)).toFixed(3)),
  tenIn: Array.from({ length: 10 }, (_, k) => +tenIn(k).toFixed(3)), tenOut: Array.from({ length: 9 }, (_, k) => +tenOut(k).toFixed(3)),
  typingA: [0, 1, 2].map(i => +(T.yes + (i + 0.5) * 0.11).toFixed(3)), typingB: [0, 1].map(i => +(T.no + (i + 0.5) * 0.11).toFixed(3)),
  postA: +T.postA.toFixed(3), postB: +T.postB.toFixed(3),
};
document.fonts.ready.then(() => Promise.all(['700 64px Figtree', '900 190px Fraunces', '800 30px JBM', '700 22px Inter', '700 78px Fraunces', '800 54px Figtree', '600 34px Figtree', '500 18px Inter', '900 128px JBM', '800 46px Inter', '900 150px Figtree', '900 112px Fraunces', '800 172px JBM', '700 34px Figtree', '900 118px Figtree', '800 44px JBM', '900 96px Figtree', '800 42px Inter', '900 92px Fraunces', '900 84px Fraunces', '900 104px Figtree', '900 64px Figtree', '900 46px Figtree', '900 60px Figtree', '900 62px Figtree', '800 40px Inter', '700 30px Inter', '900 150px Fraunces', '900 300px Fraunces', '900 110px JBM', '900 104px JBM', '900 96px JBM', '900 64px JBM', '900 150px JBM', '900 170px Figtree', '800 60px Inter', '700 38px Inter', '700 32px Inter', '700 28px Inter', '700 34px Inter'].map(f => document.fonts.load(f)))).then(() => { TEXS.forEach(f => f()); fitHook(); renderAt(0); window.__ready = true; });
