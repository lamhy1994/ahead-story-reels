// The 25-Year Wait — low-poly storybook scene (deterministic: window.renderAt(t) draws the frame for time t)
// Cisco sold the routers and switches the internet ran on. On 27 Mar 2000 it became the world's most valuable company ($555.5bn at the
// close, AP; Reuters: briefly topped Microsoft). Buyers paid about 200 times its yearly profit (AJ Bell; Wccftech: P/E 201). When the
// dot-com boom ended it lost roughly $400bn of value by 2002 (CNN Money; Fortune: $425bn) and almost 90% of its price ($80.06 → $8.12,
// Oct 2002). Its sales kept growing ($18.9bn in fiscal 2002, CNN Money; $56.7bn in fiscal 2025, Cisco), but its stock only closed back
// above $80.06 on 10 Dec 2025 (Bloomberg, Sherwood, Nasdaq). Nvidia sells the chips the AI boom runs on: $239.24 record close on
// 6 Oct 2026, $149.30 on 25 Nov 2026 (Yahoo Finance, Motley Fool), 37.6% lower.
// The world: the 2000 internet city (south: Cisco's tower, .com start-ups wired to it, a price board, the plaza with the price column,
// the profit coin and the sales columns) and the 2026 AI city (north: Nvidia's tower, data centres, chips, its price line).
import * as THREE from 'three';
import { SKIN, MAT, GOLD, rng, GB, person, cloud, bushTree, tower, car, lamp, CHIP, CASH, BIGCOIN, pedestal, dataCenter, WIN_LIT } from './kit.js';

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
const R = rng(20261127);

// ───────────────────────── story clock (everything hangs off the narration)
const T = {
  hookEnd: TIM.big ? 1.5 : TIM.hook ? E(1) + 0.15 : 0,
  bigIn: TIM.big ? 1.5 : 0, bigOut: TIM.big ? 3.0 : 0,
  dollars1: wt(1, 'dollars') - 0.1, internet1: wt(1, 'internet') - 0.1, won1: wt(1, 'won') - 0.1,
  b2: S(2) - 0.05, ai2: wt(2, 'ai') - 0.1, trillions: wt(2, 'trillions') - 0.1, people: wt(2, 'people') - 0.1, ask: wt(2, 'ask') - 0.1, y2000: wt(2, '2000') - 0.1, again: wt(2, 'again') - 0.1,
  b3: S(3) - 0.05, winner: wt(3, 'winner') - 0.1, lose: wt(3, 'lose') - 0.1,
  b4: S(4) - 0.05, march: wt(4, 'march') - 0.1, cisco4: wt(4, 'cisco') - 0.1, sold: wt(4, 'sold') - 0.1, boxes: wt(4, 'boxes') - 0.1, ran: wt(4, 'ran') - 0.1, internet4: wt(4, 'internet') - 0.1,
  b5: S(5) - 0.05, briefly: wt(5, 'briefly') - 0.1, worth: wt(5, 'worth') - 0.1, any: wt(5, 'any') - 0.1, earth: wt(5, 'earth') - 0.1,
  b6: S(6) - 0.05, buyers: wt(6, 'buyers') - 0.1, paid: wt(6, 'paid') - 0.1, d200: wt(6, '200') - 0.1, every: wt(6, 'every') - 0.1, dollar6: wt(6, 'dollar') - 0.1, earned: wt(6, 'earned') - 0.1, year6: wt(6, 'year') - 0.1,
  b7: S(7) - 0.05, boom: wt(7, 'boom') - 0.1, ended: wt(7, 'ended') - 0.1, lost7: wt(7, 'lost') - 0.1, n90: wt(7, '90') - 0.1, percent7: wt(7, 'percent') - 0.1,
  b8: S(8) - 0.05, twist: wt(8, 'twist') - 0.1, internet8: wt(8, 'internet') - 0.1, growing: wt(8, 'growing') - 0.1, did8: wt(8, 'did') - 0.1, sales: wt(8, 'sales') - 0.1,
  b9: S(9) - 0.05, stock9: wt(9, 'stock') - 0.1, needed: wt(9, 'needed') - 0.1, n25: wt(9, '25') - 0.1, years9: wt(9, 'years') - 0.1, back9: wt(9, 'back') - 0.1,
  b10: S(10) - 0.05, nvidia: wt(10, 'nvidia') - 0.1, chips: wt(10, 'chips') - 0.1, ai10: wt(10, 'ai') - 0.1,
  b11: S(11) - 0.05, week: wt(11, 'week') - 0.1, n40: wt(11, '40') - 0.1, below: wt(11, 'below') - 0.1, october: wt(11, 'october') - 0.1, record11: wt(11, 'record') - 0.1,
  b12: S(12) - 0.05, different: wt(12, 'different') - 0.1,
  b13: S(13) - 0.05, over13: wt(13, 'over') - 0.1, yet: wt(13, 'yet') - 0.1,
  b14: S(14) - 0.05, story: wt(14, 'story') - 0.15, cisco14: wt(14, 'cisco') - 0.1, right: wt(14, 'right') - 0.1, future: wt(14, 'future') - 0.1, overpay: wt(14, 'overpay') - 0.1,
  cta: S(15) - 0.1, next: wt(15, 'next') - 0.1, dotcom: wt(15, 'dot-com') - 0.1, comment: wt(15, 'comment') - 0.15, yesK: wt(15, 'YES') - 0.2, noK: wt(15, 'NO') - 0.1,
};
T.crownA = T.briefly + 0.35;                               // the crown pops over Cisco's tower
T.colA = T.d200 - 0.05; T.coinA = T.dollar6;              // the price column rises to "200"; the profit coin
T.signsOff = T.boom + 0.1; T.crownFall = T.ended;         // the boom ends: the .com signs go dark, the crown falls
T.crashA = T.lost7 - 0.05; T.crashB = T.percent7 + 0.45;  // Cisco's line crashes on the board; the price column shrinks
T.growA = T.growing - 0.15;                               // new towers and cables: the internet keeps growing
T.sal02 = T.did8 - 0.05; T.sal25 = T.sales - 0.15;        // the two sales columns: fiscal 2002, fiscal 2025 (three times taller)
T.crawlA = T.stock9 - 0.1; T.crawlB = T.back9 + 0.1;      // the line crawls back to the 2000 record (25 years)
T.nvA = T.week - 0.25; T.nvB = T.n40 + 0.05;              // Nvidia's line: from the October record down to 25 Nov
T.postA = T.yesK + 0.7; T.postB = T.noK + 0.65;
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
  MORN: P(0x4E9FDC, 0x9FD0EA, 0xFBE6BC, 0xE6E4D6, 0xFFE2B0, 3.2, 0xBFDFFF, 0x9A9A80, 1.6, 0, 0, 35, 30, 0xFFF0C8, 40, 100, 680),
  DAY: P(0x2F8FDA, 0x86C6EE, 0xEAF0EE, 0xDCE6EA, 0xFFF1D6, 3.5, 0xCFE8FF, 0x9AA088, 1.7, 0, 0, 22, 52, 0xFFF8E0, 38, 110, 720),
  GOLDEN: P(0x4A86D0, 0xA9C8E6, 0xFFD9A0, 0xF6CF9A, 0xFFC878, 3.2, 0xE8D2B0, 0xA88A60, 1.5, 0, 0.12, -28, 20, 0xFFE0A0, 44, 100, 680),
  STORM: P(0x353B4C, 0x5E6676, 0x9298A4, 0x868C98, 0xD4D8E4, 1.9, 0x9AA2B4, 0x5A5A62, 1.35, 0, 0.35, -20, 32, 0xE0E4F0, 26, 80, 560),
  SUNSET: P(0x2E2F72, 0xE0707A, 0xFFB25E, 0xEE9A6A, 0xFF9050, 2.9, 0xB49AC8, 0x86685A, 1.45, 0.12, 0.6, -30, 10, 0xFFB060, 50, 90, 620),
  DUSK: P(0x141A4C, 0x4A3F86, 0xC06A78, 0x6A4A78, 0x93A4F4, 1.7, 0x5A62B0, 0x3A2A40, 1.2, 0.65, 0.92, -40, 36, 0xFFF4D6, 30, 80, 600),
};
// golden boom → storm (the crash) → years flicking by (day, dusk, day, dusk) → sky wipe into the 2026 dusk → sunset title → night
const SKY = [[0, 'MORN'], [T.b4, 'MORN'], [T.briefly + 0.4, 'GOLDEN'], [T.b6, 'GOLDEN'], [T.boom, 'GOLDEN'], [T.ended + 0.5, 'STORM'], [T.b8 - 0.2, 'STORM'], [T.growing, 'DAY'], [T.crawlA, 'DAY'], [T.crawlA + 0.45, 'DUSK'],
  [T.crawlA + 0.9, 'DAY'], [T.crawlA + 1.35, 'DUSK'], [T.crawlA + 1.8, 'DAY'], [T.back9 + 0.2, 'MORN'], [T.b10 + 0.2, 'MORN'], [T.b10 + 0.55, 'DUSK'], [T.b14 - 0.3, 'DUSK'],
  [T.story + 0.6, 'SUNSET'], [T.cta + 0.2, 'SUNSET'], [T.cta + 1.3, 'NIGHT'], [DUR + 2, 'NIGHT']];
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
const signTex = (txt, bg, fg, w = 1024, h = 140, size = 80, font = 'Figtree') => textTex(w, h, (g, W2, H2) => { g.fillStyle = bg; g.fillRect(0, 0, W2, H2); g.fillStyle = fg; g.font = `800 ${size}px ${font}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(txt, W2 / 2, H2 / 2 + 4); });
const signPlane = (txt, bg, fg, w, h, tw = 1024, th = 140, size = 80, font) => new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: signTex(txt, bg, fg, tw, th, size, font), toneMapped: false }));
const sparkT = (() => { const cv = document.createElement('canvas'); cv.width = cv.height = 64; const g = cv.getContext('2d'); g.translate(32, 32); g.fillStyle = '#fff'; for (let k = 0; k < 2; k++) { g.rotate(Math.PI / 2 * k); g.beginPath(); g.moveTo(0, -30); g.quadraticCurveTo(3, -3, 30, 0); g.quadraticCurveTo(3, 3, 0, 30); g.quadraticCurveTo(-3, 3, -30, 0); g.quadraticCurveTo(-3, -3, 0, -30); g.fill(); } const tx = new THREE.CanvasTexture(cv); tx.colorSpace = THREE.SRGBColorSpace; return tx; })();

// ───────────────────────── places
const CT = [0, -26], CW_ = 22, CH_ = 92;                  // Cisco's tower (2000)
const RT = [20, -4];                                       // the row of routers (the boxes Cisco sold)
const BD = [-12, 25, 8];                                   // the price board: centre x, centre y, z (faces +z)
const PR = [-16, 22], PF = [-8, 22];                       // the price column (about 200 coins) and the profit coin (1) on pedestals
const SC = [[9, 22], [16, 22]];                            // the sales columns: fiscal 2002, fiscal 2025
const NV = [44, -182];                                     // Nvidia's tower (2026)
const DCH = [20, -150];                                    // the data centre with the floating chips
const SU = [[-40, 6, 10, 0x8E6CC8, 0x4A3A7A], [-36, 42, 8, 0xE9894A, 0x6A3A20], [42, 10, 12, 0x3FB5A6, 0x1E5A54], [38, 44, 9, 0xD9C24A, 0x6A5A1E], [-44, -42, 12, 0x5A9AD8, 0x1E3A6A],
  [44, -46, 10, 0xD8607A, 0x6A1E30], [-22, -66, 9, 0x7AC27A, 0x2A5A2A], [24, -70, 11, 0xC88A4A, 0x5A3A1E]];   // the .com start-ups: x, z, height, colour, sign colour
const stat = [];

// ───────────────────────── ground, streets, plaza, hills
const ground = new THREE.Mesh(new THREE.PlaneGeometry(2400, 2400).rotateX(-Math.PI / 2), new THREE.MeshLambertMaterial({ color: 0xC9C2AE })); ground.receiveShadow = true; scene.add(ground);
const flat = new GB();
flat.box(9, 0.04, 520, 0x4A4E56, 66, 0.02, -60); flat.box(9, 0.04, 520, 0x4A4E56, -66, 0.021, -60);
flat.box(560, 0.04, 9, 0x4A4E56, 0, 0.022, 62); flat.box(560, 0.04, 9, 0x4A4E56, 0, 0.023, -112);
for (const z of [62, -112]) for (let x = -270; x < 270; x += 6) flat.box(2.6, 0.05, 0.22, 0xF2EEE2, x, 0.045, z);
flat.box(112, 0.07, 60, 0xE6DFD0, -2, 0.035, 24);                                    // the plaza in front of Cisco's tower
for (let i = 0; i < 15; i++) flat.box(112, 0.075, 0.12, 0xD6CEBC, -2, 0.037, -4 + i * 4);
flat.box(150, 0.06, 90, 0xB8B4A8, 40, 0.031, -180);                                  // the 2026 data-centre yard
for (const [x, z, w, d] of [[-52, 50, 12, 18], [54, 52, 14, 14], [0, 56, 30, 8]]) flat.box(w, 0.06, d, 0x8DAE74, x, 0.03, z);
const flatM = flat.mesh(); flatM.castShadow = false; scene.add(flatM);
{ const b = new GB(), hr = rng(5150); for (let i = 0; i < 26; i++) { const a = -1.15 + i * 0.09 + (hr() - .5) * 0.05, r = 640 + hr() * 160, x = Math.sin(a) * r, z = -Math.cos(a) * r, h = 90 + hr() * 120, rad = 110 + hr() * 90; b.cone(rad, h, 6, [0x5E8A6A, 0x6E9A72, 0x55806A][i % 3], x, h / 2 - 4, z, 0, hr() * 3, 0); }
  for (let i = 0; i < 10; i++) { const a = -0.9 + i * 0.2 + (hr() - .5) * 0.1, r = 500 + hr() * 60, x = Math.sin(a) * r, z = -Math.cos(a) * r, h = 50 + hr() * 50; b.cone(80 + hr() * 50, h, 6, 0x7FA27E, x, h / 2 - 4, z, 0, hr() * 3, 0); }
  const m = b.mesh(); m.castShadow = false; scene.add(m); }

// ───────────────────────── the city around (warm concrete near the 2000 district, glass near the 2026 one)
const DEST = (x, z) => (Math.abs(x) < 60 && z > -92 && z < 60) || (x > -44 && x < 122 && z > -232 && z < -132) || z > 58 || Math.abs(x - 66) < 9 || Math.abs(x + 66) < 9 || Math.abs(z + 112) < 9;
const GROW = [];   // towers that rise during "the internet kept growing"
{
  const tr = rng(2611), OLD = [[0xE4D6BC, 0x6A7F8E], [0xD9CBB0, 0x55748C], [0xEFE4CF, 0x7A8A96], [0xCDBFA4, 0x4E6A7E]], NEW = [[0x6D97AA, 0x3F6A80], [0x8FB3C2, 0x426E86], [0xB7C4C9, 0x3E6378], [0x2E3A3E, 0x6FC0A0]];
  for (let gx = -280; gx <= 280; gx += 22) for (let gz = -320; gz <= 220; gz += 22) {
    const x = gx + (tr() - .5) * 7, z = gz + (tr() - .5) * 7; if (DEST(x, z) || tr() < 0.12) continue;
    const dp = Math.hypot(x, z + 60), far = dp > 190, w = 9 + tr() * 7, d = 9 + tr() * 7;
    const h = dp < 130 ? 12 + tr() * 16 : 18 + tr() * (far ? 40 : 28);
    const pal = (z < -110 ? NEW : OLD)[Math.floor(tr() * 4)];
    const g = tower(w, h, d, { rand: tr, color: pal[0], glass: pal[1], floor: far ? 4.2 : 3.4, litP: 0.55, crown: h > 44 && tr() < 0.5 });
    g.position.set(x, 0, z); g.children.forEach(c => { c.castShadow = dp < 200; c.receiveShadow = true; }); scene.add(g);
    stat.push([x - w / 2, x + w / 2, z - d / 2, z + d / 2, h + 4, 'tower']);
  }
  // new towers inside the 2000 district that rise as the internet keeps growing (scale.y 0 → 1)
  for (const [x, z, h, i] of [[-24, -40, 26, 0], [26, -34, 30, 1], [-50, -14, 22, 2], [52, -18, 24, 3], [-6, -76, 28, 4]]) {
    const g = tower(10, h, 10, { rand: rng(70 + i), color: NEW[i % 4][0], glass: NEW[i % 4][1], litP: 0.6 }); g.position.set(x, 0, z); g.scale.y = 0.001; g.visible = false; g.children.forEach(c => { c.castShadow = true; c.receiveShadow = true; }); scene.add(g);
    GROW.push({ g, i }); stat.push([x - 6, x + 6, z - 6, z + 6, h + 3, 'new tower']);
  }
}
for (const [x, z] of [[-56, 54], [-56, 44], [56, 54], [52, 44], [-20, 56], [24, 56], [0, 50]]) { const m = bushTree(6 + R() * 2, R); m.position.set(x, 0, z); scene.add(m); }
const lampHeads = new GB();
for (const x of [-40, -14, 14, 40]) for (const s of [-1, 1]) { const l = lamp(6.2); l.position.set(x, 0, 24 + s * 28); l.rotation.y = s > 0 ? -Math.PI / 2 : Math.PI / 2; scene.add(l); lampHeads.box(0.36, 0.12, 0.6, 0xFFFFFF, x, 6.02, 24 + s * 28 - s * 1.25); }
const lampM = new THREE.MeshLambertMaterial({ color: 0xFFF1C8, emissive: 0xFFD27A, emissiveIntensity: 0 }); scene.add(new THREE.Mesh(lampHeads.geo(), lampM));

// ───────────────────────── Cisco's tower (2000), its name, the crown
const ct = tower(CW_, CH_, CW_, { rand: rng(2000), color: 0x34516E, glass: 0x9FD3EE, frame: 0xE9E2D2, floor: 3.8, litP: 0.6, crown: true, lobby: true });
ct.position.set(CT[0], 0, CT[1]); ct.children.forEach(c => { c.castShadow = true; c.receiveShadow = true; }); scene.add(ct);
stat.push([CT[0] - CW_ / 2 - 0.5, CT[0] + CW_ / 2 + 0.5, CT[1] - CW_ / 2 - 0.5, CT[1] + CW_ / 2 + 2.5, CH_ + 6, 'cisco tower']);
const ctSign = signPlane('CISCO', '#13314A', '#CFEFFF', 16, 3.2, 1024, 205, 150); ctSign.position.set(CT[0], 84, CT[1] + CW_ / 2 + 0.12); scene.add(ctSign);
const CTOP = CH_ + 5.4;
const crown = (() => { const b = new GB(); b.cyl(5.2, 5.0, 2.0, 16, 0xFFFFFF, 0, 1.0, 0); for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2; b.cone(1.0, 2.8, 4, 0xFFFFFF, Math.cos(a) * 4.6, 3.3, Math.sin(a) * 4.6); b.ball(0.45, 0, 0xFFFFFF, Math.cos(a) * 4.6, 4.8, Math.sin(a) * 4.6); } const m = new THREE.Mesh(b.geo(), GOLD); m.castShadow = true; return m; })();
crown.position.set(CT[0], CTOP, CT[1]); crown.visible = false; scene.add(crown);
const crownGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: radial('rgba(255,210,120,0.9)', 'rgba(255,210,120,0)'), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false, fog: false })); crownGlow.scale.set(26, 26, 1); scene.add(crownGlow);

// ───────────────────────── the routers (the boxes Cisco sold): two rows of boxes with blinking lights
const routerG = (() => { const b = new GB(); b.box(3.0, 1.0, 2.0, 0x2E3F58, 0, 0.5, 0); b.box(3.04, 0.12, 2.04, 0x5A6E8A, 0, 0.94, 0); for (let i = 0; i < 4; i++) b.box(0.08, 0.5, 0.08, 0x8A9AB0, -1.2 + i * 0.8, 1.25, -0.8); return b.geo(); })();
const ledG = (() => { const b = new GB(); for (let i = 0; i < 8; i++) b.box(0.14, 0.12, 0.04, 0xFFFFFF, -1.2 + i * 0.34, 0.55, 1.02); return b.geo(); })();
const ledM = new THREE.MeshBasicMaterial({ color: 0x7CFFB0, toneMapped: false }), ledM2 = new THREE.MeshBasicMaterial({ color: 0xFFC84A, toneMapped: false });
const ROUTERS = [];
for (let i = 0; i < 4; i++) for (let k = 0; k < 2; k++) { const x = RT[0] - 5 + i * 3.3, y = k * 1.05, z = RT[1]; const m = new THREE.Mesh(routerG, MAT); m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true; scene.add(m); const l = new THREE.Mesh(ledG, (i + k) % 2 ? ledM : ledM2); l.position.set(x, y, z); scene.add(l); ROUTERS.push(l); }
{ const b = new GB(); b.box(14.6, 0.3, 3.4, 0xB8B2A6, RT[0], 0.15, RT[1]); scene.add(b.mesh()); }
stat.push([RT[0] - 8, RT[0] + 8, RT[1] - 2, RT[1] + 2, 3.2, 'routers']);

// ───────────────────────── the .com start-ups: low bright buildings, a ".com" sign and a router on every roof
const SIGNS = [], ROOFR = [];
SU.forEach(([x, z, h, col, sc], i) => {
  const g = tower(11, h, 11, { rand: rng(300 + i), color: col, glass: 0x2E4458, frame: 0xF7F2E8, litP: 0.5, bare: true }); g.position.set(x, 0, z); g.children.forEach(c => { c.castShadow = true; c.receiveShadow = true; }); scene.add(g);
  stat.push([x - 6, x + 6, z - 6, z + 6, h + 5, 'start-up']);
  { const b = new GB(); b.box(0.25, 2.6, 0.25, 0x8A8F96, x - 3.2, h + 1.3, z + 2); b.box(0.25, 2.6, 0.25, 0x8A8F96, x + 3.2, h + 1.3, z + 2); scene.add(b.mesh()); }
  const s = signPlane('.com', '#' + sc.toString(16).padStart(6, '0'), '#FFF6D8', 8.2, 2.6, 640, 203, 150); s.position.set(x, h + 3.4, z + 2.15); scene.add(s); SIGNS.push({ s, i, y0: h + 3.4 });
  const r = new THREE.Mesh(routerG, MAT); r.position.set(x + 2.4, h + 0.55, z - 2.2); r.scale.setScalar(0.8); scene.add(r);
  ROOFR.push([x + 2.4, h + 1.5, z - 2.2]);
});

// ───────────────────────── cables from the start-ups (and later from the whole city) to Cisco's tower; packets running along them
const cableM = new THREE.MeshBasicMaterial({ color: 0x7FE8FF, transparent: true, opacity: 0.85, toneMapped: false, depthWrite: false });
const CABLES = [];
function addCable(a, b, extra) {
  const d = new THREE.Vector3(b[0] - a[0], b[1] - a[1], b[2] - a[2]), L = d.length();
  const m = new THREE.Mesh(new THREE.CylinderGeometry(extra ? 0.24 : 0.18, extra ? 0.24 : 0.18, 1, 5).translate(0, 0.5, 0), extra ? cableM.clone() : cableM);
  m.position.set(...a); m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize()); m.scale.set(1, L, 1); m.renderOrder = 3; scene.add(m);
  CABLES.push({ m, a, b, L, extra }); return m;
}
const towerPt = (p, y) => [Math.max(CT[0] - CW_ / 2 - 0.3, Math.min(CT[0] + CW_ / 2 + 0.3, p[0])), y, Math.max(CT[1] - CW_ / 2 - 0.3, Math.min(CT[1] + CW_ / 2 + 0.3, p[2]))];
ROOFR.forEach((p, i) => addCable(p, towerPt(p, 34 + (i % 4) * 7), false));
addCable([RT[0] - 6, 2.2, RT[1]], towerPt([RT[0], 0, RT[1]], 12), false);
const EXTRA = [[-120, 30, -60], [-110, 26, 40], [-150, 34, -10], [-90, 30, 90], [-130, 34, 70], [40, 32, 112], [-40, 30, 120], [-160, 30, 30], [-76, 36, -74], [8, 30, 124]];
const EXTRA_C = EXTRA.map((p, i) => ({ c: addCable(p, towerPt(p, 46 + (i % 3) * 8), true), i }));
const pktG = new THREE.BoxGeometry(1.1, 1.1, 1.1), pktM = new THREE.MeshBasicMaterial({ color: 0xFFF2C0, toneMapped: false }), pktM2 = new THREE.MeshBasicMaterial({ color: 0x9BFFCF, toneMapped: false });
const PKTS = []; CABLES.forEach((c, ci) => { for (let k = 0; k < (c.extra ? 5 : 3); k++) { const m = new THREE.Mesh(pktG, k % 2 ? pktM2 : pktM); scene.add(m); PKTS.push({ m, c, ph: k / (c.extra ? 5 : 3) + ci * 0.137, sp: 0.35 + (ci % 3) * 0.08, dir: k === 1 ? -1 : 1 }); } });

// ───────────────────────── the price board: Cisco's share price, 1995-2026 (a sketch between the marked points)
const BW = 26, BH = 17, CX0 = BD[0] - 11, CX1 = BD[0] + 11, YL0 = BD[1] - 6.5, YL1 = BD[1] + 6.0;
const px = yr => CX0 + (yr - 1995) * (CX1 - CX0) / 31, py = p => YL0 + p * (YL1 - YL0) / 90;
const boardTex = textTex(1024, 670, (g, w, h) => {
  const U = w / BW, toX = x => (x - (BD[0] - BW / 2)) * U, toY = y => (BD[1] + BH / 2 - y) * U;
  g.fillStyle = '#0B1220'; g.fillRect(0, 0, w, h);
  g.fillStyle = 'rgba(255,255,255,0.78)'; g.font = '700 30px Inter'; g.textAlign = 'left'; g.textBaseline = 'alphabetic'; g.fillText('CISCO · SHARE PRICE', 30, 46);
  g.fillStyle = 'rgba(255,255,255,0.45)'; g.font = '600 22px Inter'; g.textAlign = 'right'; g.fillText('sketch between the marked points', w - 28, 46);
  g.strokeStyle = 'rgba(255,255,255,0.12)'; g.lineWidth = 2; g.font = '700 22px JBM'; g.fillStyle = 'rgba(255,255,255,0.55)'; g.textAlign = 'right'; g.textBaseline = 'middle';
  for (const p of [20, 40, 60, 80]) { const y = toY(py(p)); g.beginPath(); g.moveTo(toX(CX0), y); g.lineTo(toX(CX1), y); g.stroke(); g.fillText('$' + p, toX(CX0) - 10, y); }
  g.textAlign = 'center'; g.textBaseline = 'top';
  for (const yr of [1995, 2000, 2005, 2010, 2015, 2020, 2025]) { const x = toX(px(yr)); g.beginPath(); g.moveTo(x, toY(YL0)); g.lineTo(x, toY(YL0) + 10); g.stroke(); g.fillText(String(yr), x, toY(YL0) + 14); }
  g.strokeStyle = 'rgba(255,255,255,0.4)'; g.beginPath(); g.moveTo(toX(CX0), toY(YL0)); g.lineTo(toX(CX1), toY(YL0)); g.stroke(); });
{ const b = new GB(); b.box(0.7, BD[1] - BH / 2, 0.7, 0x4A4E56, BD[0] - BW / 2 + 2, (BD[1] - BH / 2) / 2, BD[2] - 0.6); b.box(0.7, BD[1] - BH / 2, 0.7, 0x4A4E56, BD[0] + BW / 2 - 2, (BD[1] - BH / 2) / 2, BD[2] - 0.6); b.box(BW + 0.8, BH + 0.8, 0.7, 0x22262E, BD[0], BD[1], BD[2] - 0.45); scene.add(b.mesh()); }
stat.push([BD[0] - BW / 2 - 1, BD[0] + BW / 2 + 1, BD[2] - 1.5, BD[2] + 0.6, BD[1] + BH / 2 + 2, 'board']);
const board = new THREE.Mesh(new THREE.PlaneGeometry(BW, BH), new THREE.MeshBasicMaterial({ map: boardTex, toneMapped: false })); board.position.set(BD[0], BD[1], BD[2]); scene.add(board);
// the line: rising (amber) to the March 2000 record, the crash (red) to Oct 2002, then 23 years of ups and downs back to the record (10 Dec 2025)
const CS = [[1995.0, 2], [1996.5, 6], [1997.8, 9], [1998.7, 16], [1999.4, 30], [1999.9, 52], [2000.24, 80.06], [2000.55, 66], [2000.9, 50], [2001.3, 14], [2001.7, 19], [2002.2, 15], [2002.77, 8.12],
  [2003.9, 24], [2004.1, 29], [2005.6, 17], [2007.8, 34], [2009.2, 14], [2010.3, 27], [2011.7, 14], [2014.0, 22], [2015.3, 29], [2016.1, 23], [2018.0, 38], [2019.6, 58], [2020.2, 33], [2021.9, 64],
  [2022.8, 39], [2023.6, 57], [2024.6, 46], [2025.4, 62], [2025.94, 80.25]];
const LZ = BD[2] + 0.32, upM = new THREE.MeshBasicMaterial({ color: 0xFFC84A, toneMapped: false }), dnM = new THREE.MeshBasicMaterial({ color: 0xFF5A4A, toneMapped: false });
const cSegs = CS.slice(1).map((q, i) => { const p = CS[i], a = [px(p[0]), py(p[1])], b = [px(q[0]), py(q[1])], L = Math.hypot(b[0] - a[0], b[1] - a[1]); const m = new THREE.Mesh(new THREE.BoxGeometry(1, 0.42, 0.3).translate(0.5, 0, 0), q[1] < p[1] ? dnM : upM); m.position.set(a[0], a[1], LZ); m.rotation.z = Math.atan2(b[1] - a[1], b[0] - a[0]); m.userData = { L, y0: p[0], y1: q[0], a, b }; scene.add(m); return m; });
const recM = new THREE.MeshBasicMaterial({ color: 0xFFE7A0, transparent: true, opacity: 0, toneMapped: false, depthWrite: false });
const recDash = []; for (let x = px(2000.24) + 0.4; x < px(2026) - 0.2; x += 1.0) { const m = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.16, 0.2), recM); m.position.set(x + 0.27, py(80.06), LZ - 0.05); scene.add(m); recDash.push(m); }
const tipDot = new THREE.Mesh(new THREE.SphereGeometry(0.42, 12, 8), new THREE.MeshBasicMaterial({ color: 0xFFFFFF, toneMapped: false })); scene.add(tipDot);
const tipGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: radial('rgba(255,220,150,0.85)', 'rgba(255,220,150,0)'), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false, fog: false })); tipGlow.scale.set(4.5, 4.5, 1); scene.add(tipGlow);
// how far the line is drawn (in years) at time t
const cYear = t => t < T.crashA ? 2000.24 : t < T.crawlA ? lerp(2000.24, 2002.77, eio(seg(t, T.crashA, T.crashB))) : lerp(2002.77, 2025.94, seg(t, T.crawlA, T.crawlB));
function cAt(yr) { for (let i = 0; i < CS.length - 1; i++) if (yr <= CS[i + 1][0]) { const p = CS[i], q = CS[i + 1], u = (yr - p[0]) / (q[0] - p[0]); return [px(yr), py(lerp(p[1], q[1], c01(u)))]; } return [px(CS[CS.length - 1][0]), py(CS[CS.length - 1][1])]; }

// ───────────────────────── the plaza: the price column (about 200 coins) and the profit coin (1 a year); buyers; the two sales columns
const pedPR = pedestal(1.3, 1.9); pedPR.position.set(PR[0], 0, PR[1]); scene.add(pedPR); stat.push([PR[0] - 2.6, PR[0] + 2.6, PR[1] - 2.6, PR[1] + 2.6, 17, 'price column']);
const pedPF = pedestal(1.3, 1.9); pedPF.position.set(PF[0], 0, PF[1]); scene.add(pedPF); stat.push([PF[0] - 2.6, PF[0] + 2.6, PF[1] - 2.6, PF[1] + 2.6, 4, 'profit coin']);
const coinM = new THREE.MeshLambertMaterial({ color: 0xF7B500, emissive: 0xA86A00, emissiveIntensity: 0.5 });
const STACK_H = 13.5, stackG = (() => { const b = new GB(), r = rng(808); const n = 60; for (let i = 0; i < n; i++) b.cyl(1.45, 1.45, STACK_H / n * 0.86, 16, 0xFFFFFF, (r() - .5) * 0.14, (i + 0.5) * STACK_H / n, (r() - .5) * 0.14); return b.geo(); })();
const stack = new THREE.Mesh(stackG, coinM); stack.castShadow = true; stack.position.set(PR[0], 1.3, PR[1]); stack.scale.y = 0.001; scene.add(stack);
const oneCoin = new THREE.Mesh(BIGCOIN(1.45, 0.34), coinM); oneCoin.castShadow = true; oneCoin.position.set(PF[0], 1.3 + 0.17, PF[1]); oneCoin.visible = false; scene.add(oneCoin);
const coinGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: radial('rgba(255,220,120,0.9)', 'rgba(255,220,120,0)'), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false, fog: false })); coinGlow.scale.set(5, 5, 1); coinGlow.position.set(PF[0], 2.2, PF[1]); coinGlow.visible = false; scene.add(coinGlow);
const FALL = []; for (let i = 0; i < 16; i++) { const m = new THREE.Mesh(BIGCOIN(0.9, 0.22), coinM); m.castShadow = true; m.visible = false; scene.add(m); const r = rng(910 + i); FALL.push({ m, a: r() * 6.28, sp: 4 + r() * 5, up: 4 + r() * 5, t0: T.crashA + 0.1 + r() * 0.8, y0: 2 + r() * 11 }); }
const modern = (i, extra = {}) => ({ robe: [0x34405A, 0x6A2E3E, 0x3F6A5A, 0x5A5A66, 0x7A5A3A, 0x2F4A6A, 0x8A3A3A, 0x3B6FA8, 0xB0603A, 0x4E7A3E][i % 10], skin: SKIN[i % 5], short: [0x231C18, 0x5A3E28, 0xC9A27A, 0x3A2A1E, 0x8A8A8A][i % 5], shirt: i % 2 ? 0xF4F2EC : undefined, ...extra });
const BUYERS = [[-26, 30], [-23.5, 32.5], [-14.5, 31], [-12, 33.5], [-17.5, 34.5], [-9, 31.5], [-28, 34], [-3.5, 32]].map(([x, z], i) => { const m = person(modern(i, { tie: i % 3 === 0 ? 0xC8423A : undefined, s: 1.3 })); m.scale.setScalar(1.3); m.position.set(x, 0, z); m.rotation.y = Math.PI / 2 + (i % 2 ? 0.25 : -0.25); scene.add(m); return { m, x, z, ph: i * 0.9 }; });
const CWc = 5.0, CHc = 16, FH = 15.0, BASE = 0.9;
const colGlassG = new THREE.BoxGeometry(CWc, CHc, CWc), colFrameG = (() => { const b = new GB(), f = 0xE9E3D6; for (const sx of [-1, 1]) for (const sz of [-1, 1]) b.box(0.22, CHc, 0.22, f, sx * CWc / 2, CHc / 2, sz * CWc / 2); for (const y of [0, CHc]) { b.box(CWc + 0.22, 0.22, 0.22, f, 0, y, CWc / 2); b.box(CWc + 0.22, 0.22, 0.22, f, 0, y, -CWc / 2); b.box(0.22, 0.22, CWc + 0.22, f, CWc / 2, y, 0); b.box(0.22, 0.22, CWc + 0.22, f, -CWc / 2, y, 0); } b.box(CWc + 1.4, BASE, CWc + 1.4, 0xD6CEBC, 0, BASE / 2, 0); return b.geo(); })();
const GLASS = new THREE.MeshLambertMaterial({ color: 0xBFE3F2, transparent: true, opacity: 0.18, depthWrite: false });
const cashM = new THREE.MeshLambertMaterial({ color: 0x6FB06A, emissive: 0x1E4A1E, emissiveIntensity: 0.35 });
const bandG = (() => { const b = new GB(); for (let k = 0; k < 12; k++) b.box(CWc - 0.42, 0.08, CWc - 0.42, 0xF2EEE2, 0, 0.5 + k * 1.24, 0); return b.geo(); })();
const fillG = new THREE.BoxGeometry(CWc - 0.5, 1, CWc - 0.5).translate(0, 0.5, 0);
const COLV = [18.9, 56.7];
const COLS = SC.map(([x, z], i) => {
  const g = new THREE.Group(); g.position.set(x, 0, z); g.visible = false; scene.add(g);
  const fr = new THREE.Mesh(colFrameG, MAT); fr.castShadow = true; fr.receiveShadow = true; g.add(fr);
  const gl = new THREE.Mesh(colGlassG, GLASS); gl.position.y = CHc / 2; gl.renderOrder = 2; g.add(gl);
  const fill = new THREE.Mesh(fillG, cashM); fill.castShadow = true; fill.position.y = BASE; g.add(fill);
  const bands = new THREE.Mesh(bandG, MAT); bands.position.y = BASE; g.add(bands);
  stat.push([x - CWc / 2 - 0.7, x + CWc / 2 + 0.7, z - CWc / 2 - 0.7, z + CWc / 2 + 0.7, CHc + 1.5, 'sales column']);
  return { g, fill, bands, v: COLV[i] };
});
const FYc = v => FH * v / 56.7;

// ───────────────────────── 2026: Nvidia's tower, the data centres, the chips, the price line
const nv = tower(20, 84, 20, { rand: rng(31), color: 0x2E3A2E, glass: 0x7FD08A, floor: 4.0, litP: 0.7, crown: true }); nv.position.set(NV[0], 0, NV[1]); nv.children.forEach(c => { c.castShadow = true; c.receiveShadow = true; }); scene.add(nv);
stat.push([NV[0] - 11, NV[0] + 11, NV[1] - 11, NV[1] + 11, 92, 'nvidia tower']);
const nvSign = signPlane('NVIDIA', '#1C2A1C', '#9BF0A8', 18, 3.0, 1024, 170, 120); nvSign.position.set(NV[0], 76, NV[1] + 10.12); scene.add(nvSign);
const DCS = [DCH, [-24, -194], [96, -160], [98, -204]].map((p, i) => { const m = dataCenter(30, 16, 7, { strip: i === 0 ? 0x3FD08A : 0x3E8FD0 }); m.position.set(p[0], 0, p[1]); scene.add(m); stat.push([p[0] - 18, p[0] + 18, p[1] - 9, p[1] + 9, 11, 'data centre']); return m; });
const chipM = new THREE.MeshLambertMaterial({ vertexColors: true, emissive: 0x3FD08A, emissiveIntensity: 0.25 });
const CHY = 40, CHZ = NV[1] + 24; const CHIPS = [-11, 0, 11].map((dx, i) => { const c = new THREE.Mesh(CHIP, chipM); c.scale.setScalar(8.0); c.rotation.x = 0.9; c.position.set(NV[0] + dx, CHY, CHZ); c.castShadow = true; scene.add(c); return c; });
const chipGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: radial('rgba(120,255,180,0.7)', 'rgba(120,255,180,0)'), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false, fog: false })); chipGlow.scale.set(52, 26, 1); chipGlow.position.set(NV[0], CHY, CHZ - 1); scene.add(chipGlow);
// Nvidia's price line beside the tower: 6 Oct 2026 record → 25 Nov 2026 (days 0-50; y = 10 + (price - 100) * 0.3; a sketch between the marked points)
const NVP = [[0, 239.24], [7, 228], [14, 220], [21, 206], [28, 196], [33, 184], [37, 170], [44, 145.98], [45, 125.53], [48, 165.05], [49, 155.38], [50, 149.30]];
const nx = d => NV[0] + 18.5 + d * 0.5, ny = p => 10 + (p - 100) * 0.3, NZ = NV[1] + 14;
const nSegs = NVP.slice(1).map((q, i) => { const p = NVP[i], a = [nx(p[0]), ny(p[1])], b = [nx(q[0]), ny(q[1])], L = Math.hypot(b[0] - a[0], b[1] - a[1]); const m = new THREE.Mesh(new THREE.BoxGeometry(1, 0.9, 0.9).translate(0.5, 0, 0), q[1] < p[1] ? dnM : upM); m.position.set(a[0], a[1], NZ); m.rotation.z = Math.atan2(b[1] - a[1], b[0] - a[0]); m.userData = { L, d0: p[0], d1: q[0] }; m.visible = false; scene.add(m); return m; });
const NB = [nx(25), 35, NZ - 0.45], NBW = 32, NBH = 44;
const nBoardTex = textTex(640, 880, (g, w, h) => { const U = w / NBW, toX = x => (x - (NB[0] - NBW / 2)) * U, toY = y => (NB[1] + NBH / 2 - y) * U;
  g.fillStyle = '#0B1220'; g.fillRect(0, 0, w, h); g.fillStyle = 'rgba(255,255,255,0.8)'; g.font = '700 30px Inter'; g.textAlign = 'left'; g.textBaseline = 'alphabetic'; g.fillText('NVIDIA · SHARE PRICE', 26, 48);
  g.strokeStyle = 'rgba(255,255,255,0.12)'; g.lineWidth = 2; g.fillStyle = 'rgba(255,255,255,0.55)'; g.font = '700 24px JBM'; g.textAlign = 'left'; g.textBaseline = 'bottom';
  for (const p of [120, 160, 200, 240]) { const y = toY(ny(p)); g.beginPath(); g.moveTo(toX(nx(0)) - 6, y); g.lineTo(toX(nx(50)) + 6, y); g.stroke(); g.fillText('$' + p, 18, y - 4); }
  g.textAlign = 'center'; g.textBaseline = 'top'; g.font = '700 24px Inter'; g.fillText('6 Oct', toX(nx(0)), toY(13.6)); g.fillText('25 Nov 2026', toX(nx(50)) - 30, toY(13.6)); });
{ const b = new GB(); b.box(0.7, NB[1] - NBH / 2, 0.7, 0x4A4E56, NB[0] - NBW / 2 + 2, (NB[1] - NBH / 2) / 2, NB[2] - 0.5); b.box(0.7, NB[1] - NBH / 2, 0.7, 0x4A4E56, NB[0] + NBW / 2 - 2, (NB[1] - NBH / 2) / 2, NB[2] - 0.5); b.box(NBW + 0.8, NBH + 0.8, 0.6, 0x22262E, NB[0], NB[1], NB[2] - 0.4); scene.add(b.mesh()); }
stat.push([NB[0] - NBW / 2 - 1, NB[0] + NBW / 2 + 1, NB[2] - 1.5, NB[2] + 0.6, NB[1] + NBH / 2 + 2, 'nvidia board']);
const nBoard = new THREE.Mesh(new THREE.PlaneGeometry(NBW, NBH), new THREE.MeshBasicMaterial({ map: nBoardTex, toneMapped: false })); nBoard.position.set(...NB); scene.add(nBoard);
const nRecM = new THREE.MeshBasicMaterial({ color: 0x9BF0A8, transparent: true, opacity: 0, toneMapped: false, depthWrite: false });
const nRec = []; for (let x = nx(0); x < nx(50) + 0.5; x += 1.6) { const m = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.3, 0.3), nRecM); m.position.set(x + 0.45, ny(239.24), NZ - 0.1); scene.add(m); nRec.push(m); }
const nTip = new THREE.Mesh(new THREE.SphereGeometry(0.9, 12, 8), new THREE.MeshBasicMaterial({ color: 0xFFFFFF, toneMapped: false })); nTip.visible = false; scene.add(nTip);
const nDay = t => 50 * eio(seg(t, T.nvA, T.nvB));
function nAt(d) { for (let i = 0; i < NVP.length - 1; i++) if (d <= NVP[i + 1][0]) { const p = NVP[i], q = NVP[i + 1], u = (d - p[0]) / (q[0] - p[0]); return [nx(d), ny(lerp(p[1], q[1], c01(u)))]; } return [nx(50), ny(149.30)]; }
// red arrows over the AI city ("AI stocks have lost trillions")
const arrowT = textTex(128, 160, (g) => { g.fillStyle = '#FF5A4A'; g.beginPath(); g.moveTo(40, 6); g.lineTo(88, 6); g.lineTo(88, 82); g.lineTo(120, 82); g.lineTo(64, 154); g.lineTo(8, 82); g.lineTo(40, 82); g.closePath(); g.fill(); g.strokeStyle = 'rgba(255,255,255,0.9)'; g.lineWidth = 6; g.stroke(); });
const ARROWS = [[NV[0], 99, NV[1]], [DCH[0] - 6, 30, DCH[1]], [DCH[0] + 10, 30, DCH[1] - 2], [NV[0] + 22, 64, NV[1] + 6], [NV[0] - 22, 56, NV[1] - 6]].map((p, i) => { const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: arrowT, transparent: true, depthWrite: false, toneMapped: false, fog: false })); sp.position.set(...p); sp.visible = false; sp.renderOrder = 6; scene.add(sp); return { sp, p, i }; });
// question marks
const qT = textTex(128, 128, (g) => { g.fillStyle = 'rgba(70,76,94,0.92)'; g.beginPath(); g.arc(64, 64, 56, 0, 7); g.fill(); g.fillStyle = '#fff'; g.font = '900 92px Figtree'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('?', 64, 70); });
const bigQ = new THREE.Sprite(new THREE.SpriteMaterial({ map: qT, transparent: true, depthWrite: false, toneMapped: false, fog: false })); bigQ.renderOrder = 6; bigQ.visible = false; scene.add(bigQ);
const towerQ = new THREE.Sprite(new THREE.SpriteMaterial({ map: qT, transparent: true, depthWrite: false, toneMapped: false, fog: false })); towerQ.renderOrder = 6; towerQ.visible = false; scene.add(towerQ);

// ───────────────────────── street life
const CARS = [[0xC8423A, 62, 1, 8, 0], [0x2F6FB8, 62, -1, 9, 40], [0xE9C46A, -112, 1, 7, 150], [0x4C9A62, -112, -1, 8, 230], [0xEDEDED, 62, 1, 8.6, 300], [0x7A4FA0, -112, -1, 7, 90]].map(([col, z, dir, v, off]) => { const m = car(col, { boxy: true }); scene.add(m); return { m, z: z + dir * 2, dir, v, off }; });
const WALK = []; for (let i = 0; i < 10; i++) { const rr = rng(40 + i), m = person(modern(i + 3, { phone: i % 4 === 1 })); m.scale.setScalar(1.25); scene.add(m); const x0 = 18 + rr() * 26, z0 = 34 + rr() * 14; WALK.push({ m, x0, z0, sp: 0.6 + rr() * 0.6, ph: rr() * 6 }); }
const clouds = []; for (let i = 0; i < 16; i++) { const m = cloud(R); const far = i >= 9; m.position.set(far ? -500 + R() * 1000 : -240 + i * 56 + R() * 20, 160 + R() * 40, far ? -560 + R() * 160 : -330 + R() * 260); m.scale.setScalar(2.0 + R() * 2.2); m.userData.x0 = m.position.x; scene.add(m); clouds.push(m); }
const sparks = []; for (let i = 0; i < 40; i++) { const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: sparkT, color: 0xFFE9A8, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false })); sp.userData = { ph: R() * 6.28, w: 3 + R() * 4, k: R() }; scene.add(sp); sparks.push(sp); }

// ───────────────────────── camera path (spherical keys around a target; `up` tilts the view so the subject sits lower in the frame)
const BDT = [BD[0], BD[1] - 1, BD[2]];
const CAM = [
  { t: 0, tg: [-2, 40, -12], d: 232, az: 14, el: 9, up: 0.04 },                                         // the cover: Cisco's tower, the .com start-ups wired to it, the board with the boom
  { t: T.bigOut, tg: [-2, 40, -12], d: 222, az: 13, el: 9, up: 0.04, mv: 1 },
  { t: T.won1 + 0.35, tg: [6, 10, -4], d: 150, az: 22, el: 28, up: 0.02, mv: 1 },                       // high over the network: cables and packets ("the internet still won")
  { t: T.b2 + 0.1, tg: [6, 10, -4], d: 146, az: 25, el: 28, up: 0.02 },
  { t: T.trillions + 0.35, tg: [32, 44, -168], d: 168, az: 18, el: 10, up: 0.03, mv: 1 },               // crane over to the AI city: red arrows
  { t: T.people + 0.2, tg: [32, 44, -168], d: 162, az: 15, el: 10, up: 0.03 },
  { t: T.again + 0.3, tg: [14, 34, -100], d: 410, az: 15, el: 14, up: 0.03, mv: 1 },                     // wide: 2000 in front, 2026 behind: is this 2000 again?
  { t: T.b3 + 0.15, tg: [14, 34, -100], d: 400, az: 13, el: 14, up: 0.03 },
  { t: T.lose + 0.35, tg: [3, 44, CT[1] + 2], d: 178, az: 14, el: 8, up: 0.04, mv: 1 },                     // back to Cisco's tower: how does a winner lose?
  { t: T.b4 - 0.3, tg: [3, 43, CT[1] + 2], d: 172, az: 16, el: 8, up: 0.04 },
  { t: T.cisco4 + 0.45, tg: [RT[0], 16, RT[1]], d: 112, az: 24, el: 15, up: 0.02, mv: 1 },              // over to the routers (a wide arc, away from the tower)
  { t: T.boxes + 0.25, tg: [RT[0], 2.6, RT[1]], d: 26, az: 18, el: 13, up: 0.02, mv: 1 },                // the routers
  { t: T.internet4 + 0.3, tg: [RT[0] + 6, 16, RT[1] + 4], d: 74, az: 26, el: 15, up: 0.02, mv: 1 },     // the cables to the start-ups
  { t: T.briefly + 0.8, tg: [CT[0], CTOP + 2, CT[1]], d: 108, az: 14, el: 5, up: 0.02, mv: 1 },          // up the tower: the crown
  { t: T.earth - 0.1, tg: [CT[0], CTOP + 2, CT[1]], d: 102, az: 18, el: 6, up: 0.02 },
  { t: T.paid - 0.1, tg: [-4, 40, 2], d: 132, az: 10, el: 12, up: 0.02, mv: 1 },                          // back and down: the tower, the plaza
  { t: T.d200 + 0.15, tg: [(PR[0] + PF[0]) / 2, 6.5, 22], d: 46, az: 4, el: 17, up: -0.02, mv: 1 },          // the plaza: the price column (200) and the profit coin (1)
  { t: T.year6 + 0.3, tg: [(PR[0] + PF[0]) / 2, 6.5, 22], d: 44, az: 0, el: 17, up: -0.02 },
  { t: T.ended + 0.15, tg: [2, 44, -12], d: 176, az: 16, el: 12, up: 0.04, mv: 1 },                       // the boom ends: the .com signs go dark, the crown falls
  { t: T.lost7 + 0.25, tg: [BD[0], BD[1] - 3, BD[2]], d: 82, az: 6, el: 5, up: 0.02, mv: 1 },            // the board: the line crashes; the price column shrinks below it
  { t: T.b8 + 0.05, tg: [BD[0], BD[1] - 3, BD[2]], d: 80, az: 2, el: 5, up: 0.02 },
  { t: T.growing + 0.25, tg: [4, 12, -18], d: 190, az: 20, el: 32, up: 0.02, mv: 1 },                     // high over the city: new towers, more cables
  { t: T.sales + 0.35, tg: [12.5, 8.5, 22], d: 52, az: 12, el: 9, up: 0.06, mv: 1 },                       // the sales columns: three times
  { t: T.stock9 + 0.05, tg: [12.5, 8.5, 22], d: 50, az: 8, el: 9, up: 0.06 },
  { t: T.needed + 0.35, tg: [BD[0], BD[1] - 1, BD[2]], d: 80, az: 2, el: 4, up: 0.02, mv: 1 },             // the board: the line crawls back to the record, 25 years
  { t: T.back9 + 0.45, tg: [BD[0], BD[1] - 1, BD[2]], d: 78, az: -2, el: 4, up: 0.02 },
  { t: T.b10 + 0.3, tg: [-14, 150, 40], d: 40, az: -2, el: -32, up: 0, mv: 1 },                           // sky wipe: up into the sky … down into 2026
  { t: T.chips + 0.3, tg: [NV[0], 56, NV[1] + 12], d: 132, az: 6, el: 8, up: 0.02, mv: 1 },                      // Nvidia's tower and the data centre with the chips
  { t: T.ai10 + 0.35, tg: [NV[0], 56, NV[1] + 12], d: 126, az: 3, el: 8, up: 0.02 },
  { t: T.week + 0.25, tg: [NB[0] - 3, NB[1], NZ], d: 116, az: 2, el: 3, up: 0.0, mv: 1 },                   // Nvidia's line: the record, down to 25 Nov
  { t: T.record11 + 0.4, tg: [NB[0] - 3, NB[1], NZ], d: 112, az: -2, el: 3, up: 0.0 },
  { t: T.different + 0.2, tg: [14, 34, -100], d: 410, az: 15, el: 14, up: 0.03, mv: 1 },                  // wide again: 2000 and 2026, side by side
  { t: T.yet + 0.4, tg: [14, 34, -100], d: 400, az: 12, el: 14, up: 0.03 },
  { t: T.story + 0.7, tg: [-2, 40, -12], d: 236, az: 15, el: 9, up: 0.05, mv: 1 },                       // the title: the internet city at sunset, the whole line on the board
  { t: T.cta - 0.2, tg: [-2, 40, -12], d: 226, az: 13, el: 9, up: 0.05 },
  { t: T.comment + 0.1, tg: [-4, 34, -8], d: 190, az: 14, el: 10, up: 0.05, mv: 1 },
  { t: DUR + 0.5, tg: [-4, 34, -8], d: 182, az: 16, el: 10, up: 0.05 },
];
if (QP.get('c0')) { const o = JSON.parse(QP.get('c0')); Object.assign(CAM[0], o); Object.assign(CAM[1], o, { t: T.bigOut, mv: 1 }); }
const tgOf = (k, t) => typeof k.tg === 'function' ? k.tg(t) : k.tg;
const camTg = new THREE.Vector3(); let camD = 30;
function setCamera(t) {
  let i = 0; while (i < CAM.length - 2 && t >= CAM[i + 1].t) i++;
  const a = CAM[i], b = CAM[i + 1]; let u = seg(t, a.t, b.t); if (b.mv === 1) u = eio(u); else if (b.mv === 2) u = u * u; else if (b.mv === 3) u = 1 - (1 - u) * (1 - u);
  const ta = tgOf(a, t), tb = tgOf(b, t), tg = [lerp(ta[0], tb[0], u), lerp(ta[1], tb[1], u), lerp(ta[2], tb[2], u)];
  const d = Math.exp(lerp(Math.log(a.d), Math.log(b.d), u)), az = lerp(a.az, b.az, u) * Math.PI / 180, el = lerp(a.el, b.el, u) * Math.PI / 180, up = lerp(a.up ?? 0.07, b.up ?? 0.07, u);
  const wob = [Math.sin(t * 0.9) * 0.012 * d, Math.sin(t * 1.3 + 1) * 0.008 * d];
  const cx = tg[0] + d * Math.cos(el) * Math.sin(az) + wob[0] * Math.cos(az), cz = tg[2] + d * Math.cos(el) * Math.cos(az) - wob[0] * Math.sin(az);
  camera.position.set(cx, Math.max(tg[1] + d * Math.sin(el) + wob[1], 1.4), cz);
  camera.lookAt(tg[0], tg[1] + up * d, tg[2]); camera.updateMatrixWorld();
  camTg.set(tg[0], tg[1], tg[2]); camD = d;
}

// ───────────────────────── overlay (captions, hook, big number, cards, labels)
{ const st = document.createElement('style'); st.textContent = `
.card{font:700 30px/1.3 'Figtree',sans-serif;color:#fff;background:rgba(8,10,26,.88);border:2px solid rgba(255,225,160,.65);padding:16px 24px;border-radius:20px;text-align:center;white-space:pre;box-shadow:0 12px 34px rgba(5,7,20,.5);}
.card em{font-style:normal;color:#FFC84A;} .card s{text-decoration:none;color:#FF8A7A;} .card u{text-decoration:none;color:#9BE0F0;} .card small{display:block;margin-top:8px;font:600 18px/1 'Inter',sans-serif;letter-spacing:.08em;color:rgba(255,255,255,.6);}
.tag.dn{color:#fff;background:#D9483B;border-color:#D9483B;} .tag.dn b{color:#fff;} .tag.ok{color:#08231A;background:#3FD08A;border-color:#3FD08A;} .tag.ok b{color:#08231A;} .tag.cash{color:#fff;background:#3E7A3A;border-color:#6FB06A;} .tag.cash b{color:#fff;}
.tag.yr{font:800 44px/1 'Figtree',sans-serif;letter-spacing:.04em;padding:12px 22px 10px;}
.stamp{font:900 64px/1 'Figtree',sans-serif;letter-spacing:.06em;color:#FF5A4A;border:6px solid #FF5A4A;padding:8px 22px 6px;border-radius:14px;background:rgba(40,6,4,.35);text-shadow:0 0 18px rgba(255,90,70,.6);}
.stamp.ok{color:#3FD08A;border-color:#3FD08A;background:rgba(4,30,16,.4);text-shadow:0 0 18px rgba(63,208,138,.6);}
.stamp.am{color:#FFC84A;border-color:#FFC84A;background:rgba(40,26,4,.4);text-shadow:0 0 18px rgba(247,166,0,.6);}
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
  for (const w of TIM.words) { if (TIM.hook && w.si === 1 && w.s < (TIM.big ? T.bigOut + 0.3 : 1e9)) continue; if (w.si !== si) { flush(); si = w.si; } clause.push(w); if (/[.,?!:]$/.test(w.t)) flush(); }
  flush();
  chunks.forEach(c => { c.s = c.ws[0].s - 0.07; c.e = c.ws[c.ws.length - 1].e; });
  if (!TIM.hook) chunks[0].s = -1;
  chunks.forEach((c, i) => { const nx2 = chunks[i + 1]; c.hide = nx2 ? Math.min(nx2.s, c.e + 0.5) : c.e + 0.8; });
}
const capEl = document.getElementById('cap'); let capIdx = -2;
function updateCaption(t) {
  capEl.style.opacity = TIM.big ? seg(t, T.bigOut - 0.05, T.bigOut + 0.2).toFixed(3) : '1';
  let idx = -1; for (let i = 0; i < chunks.length; i++) if (t >= chunks[i].s && t < chunks[i].hide) { idx = i; break; }
  if (idx !== capIdx) { capIdx = idx; capEl.innerHTML = idx < 0 ? '' : chunks[idx].ws.map(w => `<span class="w${w.kw ? ' kw' : ''}">${w.t.replace(/[:]$/, '').replace(/&/g, '&amp;')}</span>`).join(''); }
  if (idx < 0) return;
  const c = chunks[idx], spans = capEl.children;
  c.ws.forEach((w, i) => { const nx2 = c.ws[i + 1]; const st = t < w.s - 0.05 ? 'fut' : (nx2 && t >= nx2.s - 0.05) ? 'said' : 'cur'; const cl = 'w' + (w.kw ? ' kw' : '') + (st === 'cur' ? '' : ' ' + st); if (spans[i].className !== cl) spans[i].className = cl; });
}
const HK = TIM.hook, hookEl = HK ? mk('hook', `<div class="n">${HK.lines.map(l => l.replace(/\*([^*]+)\*/g, '<em>$1</em>')).join('\n')}</div>` + (HK.sub ? `<div class="s">${HK.sub}</div>` : '')) : null;
function fitHook() { if (!hookEl) return; const n = hookEl.querySelector('.n'), w = n.scrollWidth; if (w > 940) n.style.fontSize = (112 * 940 / w).toFixed(1) + 'px'; if (bigEl) { const v = bigEl.querySelector('.v'), bw = v.scrollWidth; if (bw > 960) v.style.fontSize = (172 * 960 / bw).toFixed(1) + 'px'; } }
const BG = TIM.big, bigBg = BG ? mk('bigbg', '') : null, bigEl = BG ? mk('big' + (/^[^\d]*[−-]/.test(BG.value) || BG.dir === 'down' ? '' : ' up'), '') : null, BIGN = {};
if (BG) { const m = BG.value.match(/^([^\d]*)(\d[\d,]*(?:\.\d+)?)(.*)$/) || ['', '', '0', BG.value]; Object.assign(BIGN, { pre: m[1], num: parseFloat(m[2].replace(/,/g, '')), dec: (m[2].split('.')[1] || '').length, comma: m[2].includes(','), post: m[3] });
  const down = !bigEl.classList.contains('up'), pts = (down ? [[0, 20], [90, 34], [160, 18], [240, 60], [320, 48], [420, 100], [520, 86], [620, 140], [760, 160]] : [[0, 160], [90, 140], [170, 150], [260, 104], [350, 116], [450, 66], [540, 80], [640, 30], [760, 12]]);
  BIGN.len = pts.slice(1).reduce((a, q, i) => a + Math.hypot(q[0] - pts[i][0], q[1] - pts[i][1]), 0);
  bigEl.innerHTML = `<svg width="760" height="170" viewBox="0 0 760 170"><polyline points="${pts.map(q => q.join(',')).join(' ')}" stroke-dasharray="${BIGN.len.toFixed(1)}"/></svg><div class="v"></div><div class="l">${BG.label || ''}</div>` + (BG.when ? `<div class="d">${BG.when}</div>` : '');
  BIGN.line = bigEl.querySelector('polyline'); BIGN.v = bigEl.querySelector('.v'); }
const bigText = u => { const x = BIGN.num * u; let n = x.toFixed(BIGN.dec); if (BIGN.comma) n = Number(n).toLocaleString('en-US', { minimumFractionDigits: BIGN.dec, maximumFractionDigits: BIGN.dec }); const unit = BIGN.post.trim(); return BIGN.pre + n + (unit ? (/^[A-Za-z]/.test(unit) ? `<small>${unit}</small>` : BIGN.post) : ''); };
const chip = mk('chip', '');
const tagNet = mk('tag am', 'the internet · <b>still growing</b>');
const tagAI = mk('tag dn', 'Nvidia <b>−$2.7T</b> · 6 Oct → 20 Nov 2026');
const tag2000 = mk('tag yr', '2000'), tag2026 = mk('tag yr', '2026');
const tagRouters = mk('tag am', 'routers &amp; <b>switches</b>');
const tagStartups = mk('tag', '<b>.com</b> start-ups');
const stampNo1 = mk('stamp am', 'No. 1');
const cardNo1 = mk('card', `Mon 27 Mar 2000: Cisco <em>$555.5 billion</em>, Microsoft $541.6 billion\nthe most valuable company on Earth, briefly\n<small>AP · Reuters · 2000</small>`);
const tagPrice = mk('tag am', 'price <b>$200</b>'), tagProfit = mk('tag cash', 'profit <b>$1</b> a year');
const cardPE = mk('card', `Cisco’s price in March 2000: about <em>200 times</em>\nthe profit it earned in a year\n<small>AJ Bell · Wccftech</small>`);
const stamp90 = mk('stamp', '−90%');
const tagLow = mk('tag dn', 'Oct 2002 · low <b>$8.12</b>');
const tagPeak = mk('tag am', '27 Mar 2000 · <b>$80.06</b>');
const cardCrash = mk('card', `Cisco’s share price: <em>$80.06</em> (27 Mar 2000) → <s>$8.12</s> (Oct 2002)\nabout <s>$400 billion</s> of value gone by 2002\n<small>AP · Sherwood · CNN Money · Fortune</small>`);
const tagS02 = mk('tag grey', 'fiscal 2002 <b>$18.9bn</b>'), tagS25 = mk('tag cash', 'fiscal 2025 <b>$56.7bn</b>');
const cardSales = mk('card', `Cisco’s yearly sales: about <u>$19 billion</u> (2002) → <em>$56.7 billion</em> (2025)\n<small>CNN Money 2002 · Wccftech · Cisco, Aug 2025</small>`);
const tagYear = mk('tag yr', '2002');
const stampBack = mk('stamp ok', 'BACK');
const cardBack = mk('card', `Wed 10 Dec 2025: Cisco closes above <em>$80.06</em>\nfor the first time since 27 Mar 2000 · price only, before dividends\n<small>Bloomberg · Sherwood · Nasdaq (MarketBeat)</small>`);
const tagChips = mk('tag ok', '<b>AI</b> chips');
const tagNvRec = mk('tag ok', '6 Oct · record <b>$239.24</b>'), tagNvNow = mk('tag dn', '25 Nov · <b>$149.30</b>');
const stamp38 = mk('stamp', '−38%');
const cardNv = mk('card', `Nvidia: <em>$239.24</em> record close (6 Oct) → <s>$149.30</s> (Wed 25 Nov 2026)\n<small>StockAnalysis · Yahoo Finance · Motley Fool</small>`);
const title = mk('title', '<div class="s">THE STORY OF</div><div class="n">The 25-Year\n<em>Wait</em></div>');
const lesson = mk('lesson', `You can be right about the future\n<em>and still overpay</em>.`);
const ctaChip = mk('chip am', 'what do you think?');
const boxes = [0, 1].map(() => { const e = mk('cbox', '<span class="in"></span><span class="post">Post</span>'); return { e, inn: e.querySelector('.in'), post: e.querySelector('.post') }; });
const foot = document.getElementById('foot');
foot.textContent = "Sources: AP, Reuters (2000) · CNN Money (2002) · Fortune · AJ Bell · Bloomberg, Sherwood (Dec 2025) · Cisco · Yahoo Finance · Motley Fool\nprice lines: sketches between the marked points · as of 25 Nov 2026 · not advice";
const setTxt = (e, s) => { if (e.textContent !== s) e.textContent = s; };
const setHTML = (e, s) => { if (e._h !== s) { e._h = s; e.innerHTML = s; } };
const p3 = (p, o = 1) => { const q = proj(p[0], p[1], p[2]); return [q[0], q[1], q[2] ? o : 0]; };

function updateUI(t) {
  updateCaption(t);
  foot.style.opacity = (0.95 * seg(t, 3.0, 3.6) * (1 - seg(t, T.cta, T.cta + 0.3) * 0.45)).toFixed(3);
  // the hook card (0-1.5 s, the cover), then the big number (1.5-3 s)
  if (hookEl) { const out = seg(t, T.hookEnd, T.hookEnd + (TIM.big ? 0.22 : 0.3)); put(hookEl, W / 2, 640 - 40 * eo(out), 1 - out, 1 + 0.035 * seg(t, 0, T.hookEnd) + 0.06 * out); }
  if (bigEl) { const o = win(t, T.bigIn, T.bigOut - 0.05, 0.15, 0.25), u = eo(seg(t, T.bigIn + 0.05, T.bigIn + 0.7)), land = seg(t, T.bigIn + 0.7, T.bigIn + 1.0), sh = (1 - land) * (land > 0 ? 1 : 0);
    bigBg.style.opacity = (0.92 * o).toFixed(3); setHTML(BIGN.v, bigText(u)); BIGN.line.style.strokeDashoffset = (BIGN.len * (1 - eo(seg(t, T.bigIn, T.bigIn + 0.9)))).toFixed(1);
    put(bigEl, W / 2 + Math.sin(t * 90) * 7 * sh, 860 + Math.cos(t * 77) * 5 * sh, o, pop(t, T.bigIn, 0.4) * (1 + 0.05 * Math.sin(Math.PI * land))); }
  // the chip: where and when we are
  let ct = '', co = 0, cp = 0;
  const CHP = [[T.bigOut + 0.05, T.b2 - 0.1, 'Cisco · March 2000'], [T.b2 + 0.05, T.again + 0.1, 'AI stocks · Oct–Nov 2026'], [T.again + 0.2, T.b4 - 0.1, '2000 again?'], [T.b4 + 0.05, T.b6 - 0.1, 'March 2000 · the dot-com boom'],
    [T.b6 + 0.05, T.b7 - 0.1, 'what buyers paid'], [T.b7 + 0.05, T.b8 - 0.1, '2000 → 2002'], [T.b8 + 0.05, T.b9 - 0.1, '2002 → 2025'], [T.b9 + 0.05, T.b10 - 0.1, 'the 25-year wait'],
    [T.b10 + 0.6, T.b11 - 0.1, '2026 · the AI boom'], [T.b11 + 0.05, T.b12 - 0.1, 'Nvidia · as of 25 Nov 2026'], [T.b12 + 0.05, T.b13 - 0.1, '2000 vs 2026'], [T.b13 + 0.05, T.b14 - 0.1, 'as of 26 Nov 2026']];
  for (const [a, b, s] of CHP) { const o = win(t, a, b, 0.22, 0.22); if (o > co) { co = o; ct = s; cp = pop(t, a); } }
  if (ct) setTxt(chip, ct); put(chip, W / 2, 472, co, cp);
  // 1 — the internet still won
  { const p = p3([CT[0] + 14, 52, CT[1] + 6], win(t, T.won1, T.b2 + 0.2, 0.2, 0.25)); put(tagNet, clampX(p[0], 260), clampY(p[1], 620, 1300), p[2], pop(t, T.won1)); }
  // 2 — AI stocks: −trillions; 2000 vs 2026
  { const p = p3([NV[0], 96, NV[1]], win(t, T.trillions + 0.3, T.again - 0.1, 0.2, 0.25)); put(tagAI, clampX(p[0], 330), clampY(p[1] - 80, 620, 1300), p[2], pop(t, T.trillions + 0.3)); }
  const yrs = Math.max(win(t, T.again + 0.1, T.b3 + 0.4, 0.25, 0.25), win(t, T.b12 + 0.3, T.b14 - 0.1, 0.25, 0.25));
  { const p = p3([CT[0], CTOP + 18, CT[1]], yrs); put(tag2000, clampX(p[0], 120), clampY(p[1], 620, 1300), p[2], 1); }
  { const p = p3([NV[0], 106, NV[1]], yrs); put(tag2026, clampX(p[0], 120), clampY(p[1], 620, 1300), p[2], 1); }
  // 4 — routers; the start-ups
  { const p = p3([RT[0], 4.6, RT[1]], win(t, T.boxes + 0.25, T.internet4 + 0.3, 0.2, 0.25)); put(tagRouters, clampX(p[0], 220), clampY(p[1] - 40, 620, 1300), p[2], pop(t, T.boxes + 0.25)); }
  { const p = p3([SU[2][0], SU[2][2] + 9, SU[2][1]], 0); const q = p3([SU[2][0], SU[2][2] + 7.6, SU[2][1]], win(t, T.internet4 + 0.35, T.b5 + 0.2, 0.2, 0.25)); put(tagStartups, clampX(q[0], 220), clampY(q[1] - 50, 620, 1300), q[2], pop(t, T.internet4 + 0.35)); }
  // 5 — No. 1
  { const p = p3([CT[0], CTOP + 9, CT[1]], win(t, T.worth, T.b6 - 0.1, 0.12, 0.25)); put(stampNo1, clampX(p[0], 220), clampY(p[1] - 20, 640, 1250), p[2], pop(t, T.worth, 0.25)); stampNo1.style.rotate = '-6deg'; }
  put(cardNo1, W / 2, 1400, win(t, T.any - 0.1, T.b6 - 0.1, 0.25, 0.25), pop(t, T.any - 0.1));
  // 6 — price $200, profit $1
  { const h = 1.3 + STACK_H * stack.scale.y; const p = p3([PR[0], h + 1.8, PR[1]], win(t, T.d200 + 0.35, T.b7 + 0.2, 0.2, 0.25)); put(tagPrice, clampX(p[0], 240), clampY(p[1] - 30, 620, 1350), p[2], pop(t, T.d200 + 0.35)); }
  { const p = p3([PF[0], 3.4, PF[1]], win(t, T.coinA + 0.25, T.b7 + 0.2, 0.2, 0.25)); put(tagProfit, clampX(p[0], 300), clampY(p[1] - 40, 620, 1350), p[2], pop(t, T.coinA + 0.25)); }
  put(cardPE, W / 2, 1400, win(t, T.every, T.b7 - 0.1, 0.25, 0.25), pop(t, T.every));
  // 7 — the crash
  { const p = p3([px(2001.4), py(62), LZ], win(t, T.n90, T.b8 + 0.2, 0.12, 0.25)); put(stamp90, clampX(p[0], 200), clampY(p[1], 640, 1250), p[2], pop(t, T.n90, 0.25)); stamp90.style.rotate = '-6deg'; }
  { const p = p3([px(2002.77) + 2.2, py(8.12) - 1.4, LZ], win(t, T.crashB - 0.1, T.b8 + 0.2, 0.2, 0.25)); put(tagLow, clampX(p[0] + 60, 300), clampY(p[1] + 20, 640, 1350), p[2], pop(t, T.crashB - 0.1)); }
  { const p = p3([px(2000.24) + 1, py(80.06) + 1.6, LZ], Math.max(win(t, T.lost7 + 0.1, T.b8 + 0.2, 0.2, 0.25), win(t, T.needed, T.b10, 0.2, 0.25))); put(tagPeak, clampX(p[0] + 40, 300), clampY(p[1] - 20, 640, 1350), p[2], 1); }
  put(cardCrash, W / 2, 1400, win(t, T.n90 + 0.2, T.b8 - 0.05, 0.25, 0.25), pop(t, T.n90 + 0.2));
  // 8 — the sales columns
  { const p = p3([SC[0][0], BASE + FYc(18.9) + 2.4, SC[0][1] + CWc / 2], win(t, T.sal02 + 0.35, T.b9 + 0.3, 0.2, 0.25)); put(tagS02, clampX(p[0] - 30, 300), clampY(p[1], 620, 1300), p[2], pop(t, T.sal02 + 0.35)); }
  { const p = p3([SC[1][0], BASE + FYc(56.7) + 2.0, SC[1][1] + CWc / 2], win(t, T.sal25 + 0.9, T.b9 + 0.3, 0.2, 0.25)); put(tagS25, clampX(p[0] + 30, 300), clampY(p[1], 620, 1300), p[2], pop(t, T.sal25 + 0.9)); }
  put(cardSales, W / 2, 700, win(t, T.sales, T.b9 + 0.2, 0.25, 0.25), pop(t, T.sales));
  // 9 — the crawl back: a year counter riding the tip; BACK
  { const yr = cYear(t), [x, y] = cAt(yr), o = win(t, T.crawlA + 0.15, T.back9 + 0.25, 0.15, 0.2); setTxt(tagYear, String(Math.min(2025, Math.floor(yr)))); const p = p3([x, y + 2.2, LZ], o); put(tagYear, clampX(p[0], 160), clampY(p[1] - 20, 620, 1300), p[2], 1); }
  { const p = p3([px(2024), py(80.06) + 2.6, LZ], win(t, T.back9 + 0.05, T.b10 + 0.2, 0.12, 0.25)); put(stampBack, clampX(p[0], 200), clampY(p[1] - 10, 640, 1250), p[2], pop(t, T.back9 + 0.05, 0.25)); stampBack.style.rotate = '-6deg'; }
  put(cardBack, W / 2, 1400, win(t, T.years9 + 0.1, T.b10 + 0.2, 0.25, 0.25), pop(t, T.years9 + 0.1));
  // 10 — chips; 11 — Nvidia's line
  { const p = p3([NV[0], CHY + 7, CHZ], win(t, T.chips + 0.2, T.b11 - 0.1, 0.2, 0.25)); put(tagChips, clampX(p[0], 200), clampY(p[1] - 30, 620, 1300), p[2], pop(t, T.chips + 0.2)); }
  { const p = p3([nx(0) + 1, ny(239.24) + 3.2, NZ], win(t, T.week, T.b12 + 0.1, 0.2, 0.25)); put(tagNvRec, clampX(p[0] + 40, 300), clampY(p[1] - 10, 620, 1300), p[2], pop(t, T.week) * (1 + 0.08 * win(t, T.october, T.record11 + 0.5, 0.1, 0.2))); }
  { const p = p3([nx(50) - 1, ny(149.3) - 3.4, NZ], win(t, T.nvB - 0.05, T.b12 + 0.1, 0.2, 0.25)); put(tagNvNow, clampX(p[0] - 30, 260), clampY(p[1] + 20, 620, 1350), p[2], pop(t, T.nvB - 0.05)); }
  { const p = p3([nx(36), ny(212), NZ], win(t, T.n40, T.b12 + 0.1, 0.12, 0.25)); put(stamp38, clampX(p[0], 200), clampY(p[1], 640, 1250), p[2], pop(t, T.n40, 0.25)); stamp38.style.rotate = '-6deg'; }
  put(cardNv, W / 2, 1400, win(t, T.below, T.b12 - 0.05, 0.25, 0.25), pop(t, T.below));
  // 14 — title and lesson; 15 — the question
  put(title, W / 2, 640, win(t, T.story, T.cta - 0.1, 0.4, 0.3), 0.94 + 0.06 * eo(seg(t, T.story, T.story + 0.6)));
  put(lesson, W / 2, 1180, win(t, T.right - 0.2, T.cta - 0.15, 0.3, 0.25), pop(t, T.right - 0.2));
  put(ctaChip, W / 2, 472, seg(t, T.next, T.next + 0.3), pop(t, T.next));
  [[T.yesK, 'YES', T.postA], [T.noK, 'NO', T.postB]].forEach(([t0, word, tp], i) => {
    const bx = boxes[i], L = word.length, n = Math.min(L, Math.floor(c01((t - t0) / (0.12 * L)) * (L + 0.001))), typed = word.slice(0, n), caret = (n < L || Math.floor(t * 2.4) % 2) && t < tp ? '<i></i>' : '';
    setHTML(bx.inn, typed ? `<b>${typed}</b>${caret}` : `<em>Add a comment…</em>${caret}`); const sent = t > tp; const pc = sent ? 'post on sent' : n === L ? 'post on' : 'post'; if (bx.post.className !== pc) bx.post.className = pc; setTxt(bx.post, sent ? 'Posted ✓' : 'Post');
    const ts = i ? T.noK - 0.35 : T.comment; put(bx.e, W / 2, 1330 + i * 132, seg(t, ts, ts + 0.3), pop(t, ts) * (1 + 0.06 * win(t, tp, tp + 0.3, 0.08, 0.2)));
  });
}

// ───────────────────────── one frame
function renderAt(t) {
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
  // the boom (0 → 1 until the crash, 0 after it, back to 1 as the internet keeps growing)
  const crash = seg(t, T.signsOff, T.signsOff + 0.9), regrow = seg(t, T.growA, T.growA + 1.2);
  // packets along the cables (fewer and slower during the crash; the extra city cables join as the internet keeps growing)
  PKTS.forEach((k, i) => { const c = k.c, on = c.extra ? regrow : 1 - 0.65 * crash * (1 - regrow); k.m.visible = on > 0.02; if (!k.m.visible) return; let ph = (k.ph + t * k.sp * (1 + regrow * 0.6)) % 1; if (k.dir < 0) ph = 1 - ph;
    k.m.position.set(lerp(c.a[0], c.b[0], ph), lerp(c.a[1], c.b[1], ph), lerp(c.a[2], c.b[2], ph)); k.m.scale.setScalar(Math.max(0.01, on * (0.8 + 0.3 * Math.sin(t * 6 + i)))); k.m.rotation.set(t * 2 + i, t * 3, 0); });
  CABLES.forEach(c => { if (c.extra) { const k = EXTRA_C.find(e => e.c === c.m).i, u = seg(t, T.growA + k * 0.08, T.growA + 0.5 + k * 0.08); c.m.visible = u > 0.01; c.m.material.opacity = 0.85 * u; c.m.scale.set(1, c.L * Math.max(0.001, eo(u)), 1); } else c.m.material.opacity = 0.85 - 0.45 * crash * (1 - regrow); });
  ROUTERS.forEach((l, i) => { l.visible = Math.sin(t * (7 + i) + i * 1.7) > -0.4; });
  // the new towers rise as the internet keeps growing
  GROW.forEach(({ g, i }) => { const u = eo(seg(t, T.growA + i * 0.12, T.growA + 0.9 + i * 0.12)); g.visible = u > 0.001; g.scale.y = Math.max(0.001, u); });
  // the .com signs go dark and tip over when the boom ends; they stay dark
  SIGNS.forEach(({ s, i, y0 }) => { const u = seg(t, T.signsOff + i * 0.07, T.signsOff + 0.35 + i * 0.07), fl = u > 0 && u < 1 ? (Math.sin(t * 60 + i) > 0 ? 1 : 0.4) : 1, k = (1 - u * 0.72) * fl; s.material.color.setRGB(k, k, k); s.rotation.x = -0.55 * eio(u); s.position.y = y0 - 0.6 * eio(u); });
  // the crown: pops on "Briefly", falls when the boom ends
  { const u = back(seg(t, T.crownA, T.crownA + 0.45)), f = seg(t, T.crownFall, T.crownFall + 1.0); crown.visible = u > 0.01 && f < 1; crown.scale.setScalar(Math.max(0.01, Math.min(1.1, u))); crown.position.set(CT[0] + 6 * f, CTOP + 0.6 * Math.sin(t * 2) * (1 - f) - 60 * f * f, CT[1] + 4 * f); crown.rotation.set(f * 1.6, t * 0.6, f * 0.8);
    crownGlow.visible = crown.visible; crownGlow.position.copy(crown.position).y += 3; crownGlow.material.opacity = 0.75 * Math.min(1, u) * (1 - f); }
  // the price column: rises to ~200 coins on "200", shrinks by nine tenths in the crash; coins tumble off
  { const up = eio(seg(t, T.colA, T.colA + 0.9)), dn = eio(seg(t, T.crashA, T.crashB)); stack.scale.y = Math.max(0.001, up * (1 - 0.9 * dn)); stack.visible = up > 0.001; }
  { const u = back(seg(t, T.coinA, T.coinA + 0.4)); oneCoin.visible = u > 0.01; oneCoin.scale.setScalar(Math.max(0.01, Math.min(1.15, u))); oneCoin.rotation.y = t * 0.8; coinGlow.visible = u > 0.01 && t < T.b8; coinGlow.material.opacity = 0.8 * Math.min(1, u) * (0.75 + 0.25 * Math.sin(t * 5)); }
  FALL.forEach(f => { const u = t - f.t0; f.m.visible = u > 0 && u < 2.2 && t < T.b9; if (!f.m.visible) return; const x = PR[0] + Math.cos(f.a) * f.sp * u, z = PR[1] + Math.sin(f.a) * f.sp * u * 0.6, y = Math.max(0.15, 1.3 + f.y0 + f.up * u - 14 * u * u); f.m.position.set(x, y, z); f.m.rotation.set(u * 7, u * 3, u * 5); });
  // buyers hop when the column rises, slump in the crash
  BUYERS.forEach((b, i) => { const hop = win(t, T.colA + 0.2, T.coinA, 0.2, 0.3), slump = seg(t, T.crashA + 0.3, T.crashB); b.m.position.y = Math.abs(Math.sin(t * 8 + b.ph)) * 0.6 * hop; b.m.rotation.z = -0.25 * slump; b.m.rotation.y = Math.PI / 2 + (i % 2 ? 0.25 : -0.25) + Math.sin(t * 0.7 + b.ph) * 0.15; });
  // the sales columns rise: fiscal 2002, then fiscal 2025 (three times taller)
  COLS.forEach((c, i) => { const ap = back(seg(t, T.sal02 - 0.6 + i * 0.1, T.sal02 - 0.15 + i * 0.1)); c.g.visible = ap > 0.01; c.g.scale.setScalar(Math.max(0.01, Math.min(1.1, ap))); });
  COLS.forEach((c, i) => { const u = i === 0 ? eo(seg(t, T.sal02, T.sal02 + 0.6)) : eio(seg(t, T.sal25, T.sal25 + 1.1)); const h = Math.max(0.001, FYc(c.v) * u); c.fill.scale.y = h; c.fill.visible = h > 0.01; c.bands.scale.y = Math.max(0.001, h / FH); c.bands.visible = h > 0.4; });
  // Cisco's line on the board
  { const yr = cYear(t); let tip = cAt(Math.min(yr, 2025.94)); cSegs.forEach(m => { const k = c01((yr - m.userData.y0) / (m.userData.y1 - m.userData.y0)); m.visible = k > 0.001; m.scale.set(Math.max(0.001, k * m.userData.L), 1, 1); });
    tipDot.position.set(tip[0], tip[1], LZ + 0.1); tipDot.scale.setScalar(1 + 0.2 * Math.sin(t * 8)); tipGlow.position.set(tip[0], tip[1], LZ + 0.2);
    recM.opacity = 0.9 * Math.max(seg(t, T.crashB - 0.2, T.crashB + 0.3), 0); }
  // Nvidia's line beside its tower
  { const d = nDay(t), on = t > T.nvA - 0.05 && t < T.story; nSegs.forEach(m => { const k = c01((d - m.userData.d0) / (m.userData.d1 - m.userData.d0)); m.visible = on && k > 0.001; m.scale.set(Math.max(0.001, k * m.userData.L), 1, 1); });
    const [x, y] = nAt(d); nTip.visible = on; nTip.position.set(x, y, NZ + 0.2); nTip.scale.setScalar(1 + 0.25 * Math.sin(t * 8) + 0.3 * win(t, T.b13, T.b14, 0.2, 0.3) * Math.abs(Math.sin(t * 5))); nRecM.opacity = 0.85 * win(t, T.nvA - 0.3, T.story, 0.3, 0.4); }
  // the chips glow and bob
  chipM.emissiveIntensity = 0.25 + 0.8 * win(t, T.chips - 0.1, T.b12, 0.2, 0.5) * (0.7 + 0.3 * Math.sin(t * 7));
  CHIPS.forEach((c, i) => { const k = back(seg(t, T.chips + i * 0.1, T.chips + 0.4 + i * 0.1)); c.visible = t > T.b10; c.scale.setScalar(8.0 * Math.max(0.01, Math.min(1.15, 0.35 + 0.65 * k))); c.position.y = CHY + Math.sin(t * 2 + i) * 0.6; c.rotation.set(0.9 + Math.sin(t * 0.8 + i) * 0.1, t * 0.4 + i, 0); });
  chipGlow.material.opacity = 0.5 * win(t, T.chips - 0.1, T.b12, 0.2, 0.5);
  // red arrows over the AI city
  ARROWS.forEach(a => { const u = back(seg(t, T.trillions + 0.15 + a.i * 0.1, T.trillions + 0.5 + a.i * 0.1)), o = 1 - seg(t, T.again, T.again + 0.4); a.sp.visible = u > 0.01 && o > 0.01; a.sp.material.opacity = o; const s2 = (a.i === 0 || a.i === 4 ? 12 : 8) * Math.max(0.01, Math.min(1.1, u)); a.sp.scale.set(s2 * 0.8, s2, 1); a.sp.position.set(a.p[0], a.p[1] - 2.5 * ((t * 1.2 + a.i * 0.3) % 1), a.p[2]); });
  // question marks: between 2000 and 2026, then over Cisco's tower
  { const o = Math.max(win(t, T.again + 0.1, T.b3 + 0.3, 0.2, 0.3), win(t, T.b12 + 0.2, T.b13 + 0.4, 0.2, 0.3)); bigQ.visible = o > 0.01; bigQ.material.opacity = o; bigQ.position.set(24, 70 + Math.sin(t * 2) * 2, -100); bigQ.scale.setScalar(30 * (0.85 + 0.15 * back(seg(t, T.again + 0.1, T.again + 0.5)))); }
  { const o = win(t, T.winner - 0.1, T.b4 + 0.4, 0.2, 0.3); towerQ.visible = o > 0.01; towerQ.material.opacity = o; towerQ.position.set(CT[0] + 15, 80 + Math.sin(t * 3) * 1.2, CT[1] + 14); towerQ.scale.setScalar(12 * (0.8 + 0.2 * back(seg(t, T.winner - 0.1, T.winner + 0.3)))); }
  // cars, people
  for (const c of CARS) { const L = 700, x = ((c.off + t * c.v) % L) - L / 2; c.m.position.set(c.dir * x, 0, c.z); c.m.rotation.y = c.dir > 0 ? 0 : Math.PI; }
  WALK.forEach((w, i) => { const x = w.x0 + Math.sin(t * 0.3 * w.sp + w.ph) * 3, z = w.z0 + Math.cos(t * 0.3 * w.sp + w.ph) * 2; w.m.position.set(x, Math.abs(Math.sin(t * 6 * w.sp + i)) * 0.06, z); w.m.rotation.y = w.ph + Math.sin(t * 0.2 + i) * 0.4; });
  for (const c of clouds) { c.position.x = c.userData.x0 + t * 1.2; c.material.opacity = 0.9 - 0.5 * night; const k = lerp(1, 0.45, night); c.material.color.setRGB(lerp(s.hor[0], 1, 0.55) * k, lerp(s.hor[1], 1, 0.55) * k, lerp(s.hor[2], 1, 0.55) * k * 1.05); c.material.emissive.setRGB(lerp(s.hor[0], 1, 0.4) * 0.55 * k, lerp(s.hor[1], 1, 0.4) * 0.55 * k, lerp(s.hor[2], 1, 0.4) * 0.58 * k); }
  // sparkles: the crown; the record line when the price gets back; the posted answers
  { let k = 0; const put3 = (x, y, z, sz, on, col) => { const sp = sparks[k++]; if (!sp) return; const tw2 = Math.pow(Math.abs(Math.sin(t * sp.userData.w + sp.userData.ph)), 3); sp.position.set(x, y, z); sp.scale.setScalar(sz * (0.25 + tw2)); sp.material.opacity = on * (0.3 + 0.7 * tw2); sp.material.color.setHex(col); sp.visible = on > 0.01; };
    const s1 = win(t, T.crownA + 0.3, T.crownFall, 0.3, 0.3); for (let i = 0; i < 12; i++) { const a = i * 0.52 + t * 0.9; put3(CT[0] + Math.cos(a) * 7, CTOP + 3 + (i % 4) * 1.4, CT[1] + Math.sin(a) * 7, 3.2, s1, 0xFFE9A8); }
    const s2 = win(t, T.back9, T.b10 + 0.3, 0.2, 0.4); for (let i = 0; i < 12; i++) { const x = px(2020) + i * 0.45; put3(x, py(80.06) + Math.sin(i * 2.1) * 0.8, LZ + 0.3, 1.1, s2, 0x9BF0C0); }
    const s4 = win(t, T.postA, DUR + 1, 0.3, 0.1); for (let i = 0; i < 14; i++) { const ph = (t * 0.35 + i / 14) % 1, a = i * 2.4; put3(CT[0] + Math.cos(a) * 16, 6 + ph * 40, CT[1] + 14 + Math.sin(a) * 6, 2.4 + 0.6 * (1 - ph), s4 * Math.sin(ph * Math.PI), 0xFFE9A8); }
    while (k < sparks.length) sparks[k++].visible = false; }
  dome.position.copy(camera.position); stars.position.copy(camera.position);
  orb.visible = halo.visible = s.orbS > 0.5 && s.star < 0.9;
  orb.position.set(camera.position.x + sd[0] * 1800, camera.position.y + sd[1] * 1800, camera.position.z + sd[2] * 1800); orb.scale.setScalar(s.orbS * 2); orb.lookAt(camera.position); orbM.color.setRGB(...s.orb);
  halo.position.copy(orb.position); halo.scale.setScalar(s.orbS * 13); halo.lookAt(camera.position); haloM.color.setRGB(...s.orb); haloM.opacity = 0.75;
  const S2 = Math.min(170, Math.max(14, camD * 0.85));
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
  signs: SIGNS.map(({ i }) => +(T.signsOff + i * 0.07).toFixed(3)), grow: GROW.map(({ i }) => +(T.growA + i * 0.12).toFixed(3)), fall: FALL.map(f => +(f.t0 + 0.6).toFixed(3)).sort((a, b) => a - b),
  arrows: ARROWS.map(a => +(T.trillions + 0.15 + a.i * 0.1).toFixed(3)),
  typingA: [0, 1, 2].map(i => +(T.yesK + (i + 0.5) * 0.12).toFixed(3)), typingB: [0, 1].map(i => +(T.noK + (i + 0.5) * 0.12).toFixed(3)),
  postA: +T.postA.toFixed(3), postB: +T.postB.toFixed(3),
};
document.fonts.ready.then(() => Promise.all(['700 64px Figtree', '900 190px Fraunces', '800 30px JBM', '700 22px Inter', '700 78px Fraunces', '800 54px Figtree', '600 34px Figtree', '500 18px Inter', '900 128px JBM', '800 46px Inter', '900 150px Figtree', '900 112px Fraunces', '800 172px JBM', '700 34px Figtree', '800 92px JBM', '900 64px Figtree', '800 96px JBM', '800 80px Figtree', '800 72px Figtree', '800 78px Figtree', '700 38px Inter', '800 64px Figtree', '800 110px JBM', '700 30px Inter', '700 34px Inter', '900 92px Figtree', '800 104px Figtree', '800 120px Figtree', '800 150px Figtree', '800 44px Figtree', '700 22px JBM', '600 22px Inter'].map(f => document.fonts.load(f)))).then(() => { TEXS.forEach(f => f()); fitHook(); renderAt(0); window.__ready = true; });
