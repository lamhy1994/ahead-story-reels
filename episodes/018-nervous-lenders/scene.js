// The Nervous Lenders — low-poly storybook scene (deterministic: window.renderAt(t) draws the frame for time t)
// AI-related borrowing reached about $466 billion in Jan-Sep 2026, more than four times the $101 billion of a year earlier (Morgan Stanley
// data via the FT and IO Fund). A credit default swap is insurance on a loan: a yearly fee per $100, paid out if the borrower can't pay.
// Tue 24 Nov 2026 (the day after Nvidia jumped 31.5% on Jensen Huang's return): the price of insuring Oracle's debt hit a record, 356 bps
// ($3.56 a year per $100; Reuters/S&P Global MI, CNBC); CoreWeave about $13 (1,314 bps), its 2031 bond yielding over 17% (CNBC).
// Some giants now spend more on building than their business brings in (Man Group via CNBC), so they borrow.
// The world: the lenders' bank (west), the insurance kiosk and its price board (centre), data centres and cranes (north), a seesaw of
// spending against cash, Nvidia's tower (north-west), and a red line in the sky: the price of insuring AI debt (a sketch of its shape).
import * as THREE from 'three';
import { SKIN, MAT, rng, GB, person, cloud, bushTree, tower, car, lamp, bank, kiosk, CHIP, CASH, BILL, CERT, BIGCOIN, seesaw, pedestal, rack, crane, dataCenter, umbrella, WIN_LIT } from './kit.js';

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
const R = rng(20261126);

// ───────────────────────── story clock (everything hangs off the narration)
const T = {
  hookEnd: TIM.big ? 1.5 : TIM.hook ? E(1) + 0.15 : 0,
  bigIn: TIM.big ? 1.5 : 0, bigOut: TIM.big ? 3.0 : 0,
  for1: wt(1, 'for') - 0.1, ai1: wt(1, 'AI') - 0.1, year1: wt(1, 'year') - 0.1, lenders1: wt(1, 'lenders') - 0.1, nervous1: wt(1, 'nervous') - 0.1,
  b2: S(2) - 0.05, four: wt(2, 'four') - 0.1, times: wt(2, 'times') - 0.1, last2: wt(2, 'last') - 0.1,
  b3: S(3) - 0.05, spot: wt(3, 'spot') - 0.1, nervous3: wt(3, 'nervous') - 0.1, lender3: wt(3, 'lender') - 0.1,
  b4: S(4) - 0.05, watch: wt(4, 'watch') - 0.1, price4: wt(4, 'price') - 0.1, insurance: wt(4, 'insurance') - 0.1,
  b5: S(5) - 0.05, lend5: wt(5, 'lend') - 0.1, friend: wt(5, 'friend') - 0.1, hundred: wt(5, '100') - 0.1, dollars5: wt(5, 'dollars') - 0.1,
  b6: S(6) - 0.05, small: wt(6, 'small') - 0.1, fee6: wt(6, 'fee') - 0.1, someone: wt(6, 'someone') - 0.1, pay6: wt(6, 'pay') - 0.1, cant: wt(6, "can't") - 0.1,
  b7: S(7) - 0.05, people7: wt(7, 'people') - 0.1, doubt: wt(7, 'doubt') - 0.1, higher: wt(7, 'higher') - 0.1, fee7: wt(7, 'fee') - 0.1,
  b8: S(8) - 0.05, week8: wt(8, 'week') - 0.1, record: wt(8, 'record') - 0.1, oracle: wt(8, 'oracle') - 0.1, three: wt(8, 'three') - 0.1, half: wt(8, 'half') - 0.1,
  b9: S(9) - 0.05, coreweave: wt(9, 'coreweave') - 0.1, rents: wt(9, 'rents') - 0.1, chips: wt(9, 'chips') - 0.1, thirteen: wt(9, '13') - 0.1, dollars9: wt(9, 'dollars') - 0.1,
  b10: S(10) - 0.05, why: wt(10, 'why') - 0.1, giants: wt(10, 'giants') - 0.1, spend: wt(10, 'spend') - 0.1, building: wt(10, 'building') - 0.1, business: wt(10, 'business') - 0.1, brings: wt(10, 'brings') - 0.1,
  b11: S(11) - 0.05, borrow: wt(11, 'borrow') - 0.1, bond: wt(11, 'bond') - 0.1, buyers: wt(11, 'buyers') - 0.1, seventeen: wt(11, '17') - 0.1, year11: wt(11, 'year') - 0.1,
  b12: S(12) - 0.05, twist: wt(12, 'twist') - 0.1, day12: wt(12, 'day') - 0.1, nvidia: wt(12, "nvidia's") - 0.1, jumped: wt(12, 'jumped') - 0.1, third: wt(12, 'third') - 0.1,
  b13: S(13) - 0.05, cheered: wt(13, 'cheered') - 0.1, lenders13: wt(13, 'lenders') - 0.1, didnt: wt(13, "didn't") - 0.1,
  b14: S(14) - 0.05, over14: wt(14, 'over') - 0.1, yet: wt(14, 'yet') - 0.1,
  b15: S(15) - 0.05, story: wt(15, 'story') - 0.15, nervous15: wt(15, 'nervous') - 0.1, bounce: wt(15, 'bounce') - 0.1, worry: wt(15, 'worry') - 0.1,
  cta: S(16) - 0.1, lend16: wt(16, 'lend') - 0.1, money: wt(16, 'money') - 0.1, comment: wt(16, 'comment') - 0.15, lendK: wt(16, 'LEND', 1) - 0.2, passK: wt(16, 'PASS') - 0.1,
};
T.colA = T.four - 0.1; T.colB = T.times;                 // the two cash columns: Jan-Sep 2025, then Jan-Sep 2026 (4.6 times taller)
T.umbA = T.insurance; T.billA = T.hundred - 0.05;        // the umbrella sign opens; the $100 note flies to the friend
T.coin1 = T.fee6 + 0.05; T.cover = T.pay6 - 0.05;        // the first fee coin; the umbrella opens over you
T.doubtA = T.doubt - 0.05; T.coinUp = T.higher;          // question marks over the friend; the fee climbs 1 -> 3
T.recA = T.record; T.oraA = T.oracle - 0.05; T.halfA = T.three - 0.05;   // record; the board flips to Oracle; the stack shows $3.56
T.cwA = T.coreweave - 0.05; T.chipA = T.rents; T.c13 = T.thirteen - 0.05;   // the board flips to CoreWeave; its chips; the stack jumps to 13
T.tipA = T.spend; T.tipB = T.brings;                     // the seesaw: spending is heavier, cash rises
T.loanA = T.borrow - 0.1; T.bondA = T.bond - 0.05; T.y17 = T.seventeen - 0.05;   // borrowed crates fly in; the bond; 17%
T.jumpA = T.jumped - 0.05; T.fwA = T.third; T.recB = T.lenders13 + 0.05;    // Nvidia's line jumps; fireworks; the sky line ticks up: record
T.postA = T.lendK + 0.75; T.postB = T.passK + 0.7;
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
  DAY: P(0x2F8FDA, 0x86C6EE, 0xEAF0EE, 0xDCE6EA, 0xFFF1D6, 3.5, 0xCFE8FF, 0x9AA088, 1.7, 0, 0, 22, 52, 0xFFF8E0, 38, 110, 720),
  GOLDEN: P(0x4A86D0, 0xA9C8E6, 0xFFD9A0, 0xF6CF9A, 0xFFC878, 3.2, 0xE8D2B0, 0xA88A60, 1.5, 0, 0.12, -28, 20, 0xFFE0A0, 44, 100, 680),
  STORM: P(0x353B4C, 0x5E6676, 0x9298A4, 0x868C98, 0xD4D8E4, 1.9, 0x9AA2B4, 0x5A5A62, 1.35, 0, 0.35, -20, 32, 0xE0E4F0, 26, 80, 560),
  SUNSET: P(0x2E2F72, 0xE0707A, 0xFFB25E, 0xEE9A6A, 0xFF9050, 2.9, 0xB49AC8, 0x86685A, 1.45, 0.12, 0.6, -30, 10, 0xFFB060, 50, 90, 620),
  DUSK: P(0x141A4C, 0x4A3F86, 0xC06A78, 0x6A4A78, 0x93A4F4, 1.7, 0x5A62B0, 0x3A2A40, 1.2, 0.65, 0.92, -40, 36, 0xFFF4D6, 30, 80, 600),
};
const SKY = [[0, 'SUNSET'], [T.b3 - 0.4, 'SUNSET'], [T.b4 + 0.3, 'DAY'], [T.b7 + 0.2, 'DAY'], [T.doubt + 0.4, 'STORM'], [T.b8 + 0.2, 'STORM'], [T.oracle + 0.4, 'DAY'], [T.b10 - 0.2, 'DAY'],
  [T.b10 + 0.6, 'GOLDEN'], [T.b12 - 0.1, 'GOLDEN'], [T.nvidia, 'DUSK'], [T.b15 + 0.4, 'DUSK'], [T.story + 0.8, 'SUNSET'], [T.cta + 0.2, 'SUNSET'], [T.cta + 1.3, 'NIGHT'], [DUR + 2, 'NIGHT']];
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
const signTex = (txt, bg, fg, w = 1024, h = 140, size = 80) => textTex(w, h, (g, W2, H2) => { g.fillStyle = bg; g.fillRect(0, 0, W2, H2); g.fillStyle = fg; g.font = `800 ${size}px Figtree`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(txt, W2 / 2, H2 / 2 + 4); });
const signPlane = (txt, bg, fg, w, h, tw = 1024, th = 140, size = 80) => new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: signTex(txt, bg, fg, tw, th, size), toneMapped: false }));

// ───────────────────────── places
const BANK = [-50, 18];              // the lenders' bank (faces +z)
const COLZ = 34, COLX = [-80, -71];  // two glass columns of cash: Jan-Sep 2025 and Jan-Sep 2026
const SAW = [-20, 42];               // the seesaw: spending (west end) against cash (east end)
const KI = [10, 50];                 // the insurance kiosk (faces +z); you and your friend in front of it
const YOU = [KI[0] - 2.8, KI[1] + 6.5], FR = [KI[0] + 2.8, KI[1] + 6.5];
const STK = [KI[0] + 7.5, KI[1] + 3.5];   // the stack of fee coins on a pedestal
const BD = [6, 13, 31];              // the price board (faces +z)
const DC1 = [-10, -12], DC2 = [30, -12], SITE = [36, -48];   // Oracle's and CoreWeave's data centres; the building site with cranes
const NV = [-66, -48];               // Nvidia's tower
const stat = [];

// ───────────────────────── ground, streets, plaza, hills
const ground = new THREE.Mesh(new THREE.PlaneGeometry(2400, 2400).rotateX(-Math.PI / 2), new THREE.MeshLambertMaterial({ color: 0xC9C2AE })); ground.receiveShadow = true; scene.add(ground);
const flat = new GB();
flat.box(9, 0.04, 360, 0x4A4E56, 96, 0.02, 0); flat.box(9, 0.04, 360, 0x4A4E56, -86, 0.021, 0);
flat.box(560, 0.04, 9, 0x4A4E56, 0, 0.022, 80); flat.box(560, 0.04, 9, 0x4A4E56, 0, 0.023, 8);
for (const z of [80, 8]) for (let x = -270; x < 270; x += 6) flat.box(2.6, 0.05, 0.22, 0xF2EEE2, x, 0.045, z);
flat.box(150, 0.07, 58, 0xE6DFD0, -10, 0.035, 44);                                  // the plaza between the bank and the kiosk
for (let i = 0; i < 15; i++) flat.box(150, 0.075, 0.12, 0xD6CEBC, -10, 0.037, 16 + i * 4);
flat.box(130, 0.06, 60, 0xB8B4A8, 32, 0.031, -26);                                   // the data-centre yard
for (const [x, z, w, d] of [[-76, 64, 12, 18], [56, 64, 14, 18], [-2, 70, 20, 10]]) flat.box(w, 0.06, d, 0x8DAE74, x, 0.03, z);
const flatM = flat.mesh(); flatM.castShadow = false; scene.add(flatM);
{ const b = new GB(), hr = rng(5150); for (let i = 0; i < 26; i++) { const a = -1.15 + i * 0.09 + (hr() - .5) * 0.05, r = 620 + hr() * 160, x = Math.sin(a) * r, z = -Math.cos(a) * r, h = 90 + hr() * 120, rad = 110 + hr() * 90; b.cone(rad, h, 6, [0x5E8A6A, 0x6E9A72, 0x55806A][i % 3], x, h / 2 - 4, z, 0, hr() * 3, 0); }
  for (let i = 0; i < 10; i++) { const a = -0.9 + i * 0.2 + (hr() - .5) * 0.1, r = 470 + hr() * 60, x = Math.sin(a) * r, z = -Math.cos(a) * r, h = 50 + hr() * 50; b.cone(80 + hr() * 50, h, 6, 0x7FA27E, x, h / 2 - 4, z, 0, hr() * 3, 0); }
  const m = b.mesh(); m.castShadow = false; scene.add(m); }

// ───────────────────────── the city around
const DEST = (x, z) => (z > -72 && Math.abs(x) < 150) || z > 60 || (x < -100 && z > -40) || Math.hypot(x - NV[0], z - NV[1]) < 30 || Math.abs(x - 96) < 9 || Math.abs(x + 86) < 9;
{
  const tr = rng(2611), PAL = [[0xD9D3C6, 0x5E7F9A], [0x6D97AA, 0x3F6A80], [0xE4DED2, 0x4E7C93], [0xC9C2B4, 0x55748C], [0x8FB3C2, 0x426E86], [0xEFE9DC, 0x6A8AA4], [0xB7C4C9, 0x3E6378], [0xE8D9C0, 0x5A7A90]];
  for (let gx = -280; gx <= 280; gx += 22) for (let gz = -200; gz <= 230; gz += 22) {
    const x = gx + (tr() - .5) * 7, z = gz + (tr() - .5) * 7; if (DEST(x, z) || tr() < 0.12) continue;
    const dp = Math.hypot(x, z), far = dp > 160, w = 9 + tr() * 7, d = 9 + tr() * 7;
    const h = dp < 120 ? 12 + tr() * 16 : 18 + tr() * (far ? 40 : 28);
    const pal = PAL[Math.floor(tr() * PAL.length)];
    const g = tower(w, h, d, { rand: tr, color: pal[0], glass: pal[1], floor: far ? 4.2 : 3.4, litP: 0.55, crown: h > 44 && tr() < 0.5 });
    g.position.set(x, 0, z); g.children.forEach(c => { c.castShadow = dp < 170; c.receiveShadow = true; }); scene.add(g);
    stat.push([x - w / 2, x + w / 2, z - d / 2, z + d / 2, h + 4, 'tower']);
  }
}
for (const [x, z] of [[-104, 70], [-104, 56], [56, 70], [56, 56], [-30, 76], [40, 76], [-8, 76], [70, 30], [-96, 20]]) { const m = bushTree(6 + R() * 2, R); m.position.set(x, 0, z); scene.add(m); }
const lampHeads = new GB();
for (const x of [-34, -4, 28, 52]) for (const s of [-1, 1]) { const l = lamp(6.2); l.position.set(x, 0, 44 + s * 27); l.rotation.y = s > 0 ? -Math.PI / 2 : Math.PI / 2; scene.add(l); lampHeads.box(0.36, 0.12, 0.6, 0xFFFFFF, x, 6.02, 44 + s * 27 - s * 1.25); }
const lampM = new THREE.MeshLambertMaterial({ color: 0xFFF1C8, emissive: 0xFFD27A, emissiveIntensity: 0 }); scene.add(new THREE.Mesh(lampHeads.geo(), lampM));

// ───────────────────────── the lenders' bank, the lenders on its steps
const bk = bank(); bk.position.set(BANK[0], 0, BANK[1]); bk.children.forEach(c => { c.castShadow = true; c.receiveShadow = true; }); scene.add(bk);
stat.push([BANK[0] - 13, BANK[0] + 13, BANK[1] - 9, BANK[1] + 13, 17, 'bank']);
const bkSign = signPlane('LENDERS', '#E9E1CF', '#4A3A2A', 20, 2.0); bkSign.position.set(BANK[0], bk.userData.signY, BANK[1] + bk.userData.signZ + 0.08); scene.add(bkSign);
const modern = (i, extra = {}) => ({ robe: [0x34405A, 0x6A2E3E, 0x3F6A5A, 0x5A5A66, 0x7A5A3A, 0x2F4A6A, 0x8A3A3A, 0x3B6FA8, 0xB0603A, 0x4E7A3E][i % 10], skin: SKIN[i % 5], short: [0x231C18, 0x5A3E28, 0xC9A27A, 0x3A2A1E, 0x8A8A8A][i % 5], shirt: i % 2 ? 0xF4F2EC : undefined, ...extra });
const LENDERS = [-2.6, 0, 2.6].map((dx, i) => { const m = person(modern(i + 3, { robe: [0x2B2F3A, 0x34405A, 0x3A3F48][i], shirt: 0xF4F2EC, tie: [0xC8423A, 0x2F6FB8, 0xE09A2B][i], s: 1.35 })); m.position.set(BANK[0] + dx, 1.0, BANK[1] + 9.6); m.rotation.y = -Math.PI / 2 + 0.25 * (i - 1); scene.add(m); return m; });
// sweat drops over the lenders (nervous), and grey question marks over the friend (doubt)
const dropT = textTex(64, 96, (g) => { g.fillStyle = '#9BE0F0'; g.beginPath(); g.moveTo(32, 6); g.quadraticCurveTo(58, 52, 50, 70); g.arc(32, 66, 19, 0.2, Math.PI - 0.2); g.quadraticCurveTo(6, 52, 32, 6); g.fill(); g.fillStyle = 'rgba(255,255,255,0.8)'; g.beginPath(); g.ellipse(24, 62, 5, 9, 0.3, 0, 7); g.fill(); });
const DROPS = LENDERS.map((m, i) => { const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: dropT, transparent: true, depthWrite: false, toneMapped: false, fog: false })); sp.scale.set(0.9, 1.35, 1); sp.renderOrder = 6; scene.add(sp); return sp; });
const qT = textTex(128, 128, (g) => { g.fillStyle = 'rgba(70,76,94,0.92)'; g.beginPath(); g.arc(64, 64, 56, 0, 7); g.fill(); g.fillStyle = '#fff'; g.font = '900 92px Figtree'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('?', 64, 70); });
const QS = []; for (let i = 0; i < 6; i++) { const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: qT, transparent: true, depthWrite: false, toneMapped: false, fog: false })); sp.renderOrder = 6; sp.visible = false; scene.add(sp); QS.push({ sp, a: i * 1.05, r: 1.3 + (i % 2) * 0.5, y: 3.4 + (i % 3) * 0.55, t0: i * 0.09 }); }
const bigQ = new THREE.Sprite(new THREE.SpriteMaterial({ map: qT, transparent: true, depthWrite: false, toneMapped: false, fog: false })); bigQ.renderOrder = 6; scene.add(bigQ);

// ───────────────────────── the two cash columns (borrowed for AI, Jan-Sep): 2025 $101bn, 2026 $466bn
const CW = 6.0, CH = 17, FH = 15.4, BASE = 0.9;
const colGlassG = new THREE.BoxGeometry(CW, CH, CW), colFrameG = (() => { const b = new GB(), f = 0xE9E3D6; for (const sx of [-1, 1]) for (const sz of [-1, 1]) b.box(0.22, CH, 0.22, f, sx * CW / 2, CH / 2, sz * CW / 2); for (const y of [0, CH]) { b.box(CW + 0.22, 0.22, 0.22, f, 0, y, CW / 2); b.box(CW + 0.22, 0.22, 0.22, f, 0, y, -CW / 2); b.box(0.22, 0.22, CW + 0.22, f, CW / 2, y, 0); b.box(0.22, 0.22, CW + 0.22, f, -CW / 2, y, 0); } b.box(CW + 1.4, BASE, CW + 1.4, 0xD6CEBC, 0, BASE / 2, 0); return b.geo(); })();
const GLASS = new THREE.MeshLambertMaterial({ color: 0xBFE3F2, transparent: true, opacity: 0.18, depthWrite: false });
const cashM = new THREE.MeshLambertMaterial({ color: 0x6FB06A, emissive: 0x1E4A1E, emissiveIntensity: 0.35 });
const bandG = (() => { const b = new GB(); for (let k = 0; k < 12; k++) b.box(CW - 0.42, 0.08, CW - 0.42, 0xF2EEE2, 0, 0.5 + k * 1.28, 0); return b.geo(); })();
const fillG = new THREE.BoxGeometry(CW - 0.5, 1, CW - 0.5).translate(0, 0.5, 0);
const COLV = [101, 466];
const COLS = COLX.map((x, i) => {
  const g = new THREE.Group(); g.position.set(x, 0, COLZ); scene.add(g);
  const fr = new THREE.Mesh(colFrameG, MAT); fr.castShadow = true; fr.receiveShadow = true; g.add(fr);
  const gl = new THREE.Mesh(colGlassG, GLASS); gl.position.y = CH / 2; gl.renderOrder = 2; g.add(gl);
  const fill = new THREE.Mesh(fillG, cashM); fill.castShadow = true; fill.position.y = BASE; g.add(fill);
  const bands = new THREE.Mesh(bandG, MAT); bands.position.y = BASE; g.add(bands);
  stat.push([x - CW / 2 - 0.7, x + CW / 2 + 0.7, COLZ - CW / 2 - 0.7, COLZ + CW / 2 + 0.7, CH + 1.5, 'column']);
  return { g, fill, bands, v: COLV[i] };
});
const FYc = v => FH * v / 466;

// ───────────────────────── the insurance kiosk, the umbrella sign, you, your friend, the insurer
const ki = kiosk(); ki.position.set(KI[0], 0, KI[1]); ki.rotation.y = -Math.PI / 2; ki.children.forEach(c => { c.castShadow = true; c.receiveShadow = true; }); scene.add(ki);
stat.push([KI[0] - 2.2, KI[0] + 2.2, KI[1] - 2, KI[1] + 2.4, 4.2, 'kiosk']);
const kiSign = signPlane('LOAN INSURANCE', '#2F3A55', '#FFD27A', 3.0, 0.62, 1024, 212, 104); kiSign.position.set(KI[0], 3.45, KI[1] + 1.58); scene.add(kiSign);
const umbSign = umbrella(1.5); umbSign.position.set(KI[0], 3.0, KI[1] - 0.2); scene.add(umbSign);
const insurer = person(modern(6, { robe: 0x2F6FB8, shirt: 0xF4F2EC, s: 1.25 })); insurer.position.set(KI[0], 0, KI[1] - 0.4); insurer.rotation.y = -Math.PI / 2; scene.add(insurer);
const you = person(modern(1, { robe: 0x3B6FA8, short: 0x3A2A1E, s: 1.3 })); you.position.set(YOU[0], 0, YOU[1]); you.rotation.y = 0; scene.add(you);
const friend = person(modern(4, { robe: 0xB0603A, short: 0x231C18, shirt: 0xF4F2EC, s: 1.3 })); friend.position.set(FR[0], 0, FR[1]); friend.rotation.y = Math.PI; scene.add(friend);
const umbYou = umbrella(0.95, 0x2F6FB8, 0xF6EFE2); scene.add(umbYou);                       // opens over you: "someone will pay you if he can't"
const billM = new THREE.Mesh(BILL, MAT); billM.castShadow = true; scene.add(billM);            // the $100 note
const billGhost = new THREE.Mesh(BILL, new THREE.MeshBasicMaterial({ color: 0x9BE0F0, transparent: true, opacity: 0, depthWrite: false })); scene.add(billGhost);   // the insurer's promised payout
// the fee coins on a pedestal: $1 a year, then about $3, then Oracle's $3.56, then CoreWeave's $13
const ped = pedestal(1.3, 1.4); ped.position.set(STK[0], 0, STK[1]); scene.add(ped); stat.push([STK[0] - 2, STK[0] + 2, STK[1] - 2, STK[1] + 2, 8, 'stack']);
const coinM = new THREE.MeshLambertMaterial({ color: 0xF7B500, emissive: 0xA86A00, emissiveIntensity: 0.5 });
const COING = BIGCOIN(1.15, 0.3), HALFG = new THREE.CylinderGeometry(1.15, 1.15, 0.34, 18, 1, false, 0, Math.PI);
const COINS = []; for (let i = 0; i < 14; i++) { const m = new THREE.Mesh(i === 3 ? HALFG : COING, coinM); m.castShadow = true; m.visible = false; scene.add(m); COINS.push(m); }
const PED_TOP = 1.3;
// the doubt cloud over the friend
const dCloudM = new THREE.MeshLambertMaterial({ color: 0x6A7080, transparent: true, opacity: 0, depthWrite: false });
const dCloud = new THREE.Group(); for (let i = 0; i < 5; i++) { const rr = rng(77 + i), m = new THREE.Mesh(new THREE.IcosahedronGeometry(0.45 + rr() * 0.25, 1), dCloudM); m.position.set((i - 2) * 0.55, (rr() - .5) * 0.3, (rr() - .5) * 0.6); m.scale.set(1, 0.7, 1); dCloud.add(m); } scene.add(dCloud);
// passers-by on the plaza
const WALK = []; for (let i = 0; i < 12; i++) { const rr = rng(40 + i), m = person(modern(i, { phone: i % 3 === 1 })); m.scale.setScalar(1.25); scene.add(m); const x0 = -44 + rr() * 26, z0 = 62 + rr() * 12; WALK.push({ m, x0, z0, sp: 0.6 + rr() * 0.6, ph: rr() * 6 }); }

// ───────────────────────── the price board: the yearly fee to insure $100 of a loan
const boardTex = (who, big, sub, col, pts, rec) => textTex(1024, 470, (g, w, h) => { g.fillStyle = '#0B1220'; g.fillRect(0, 0, w, h); g.strokeStyle = 'rgba(255,255,255,0.10)'; g.lineWidth = 2; for (let i = 1; i < 6; i++) { g.beginPath(); g.moveTo(0, 120 + i * 56); g.lineTo(w, 120 + i * 56); g.stroke(); }
  g.fillStyle = 'rgba(255,255,255,0.7)'; g.font = '700 30px Inter'; g.textAlign = 'left'; g.textBaseline = 'alphabetic'; g.fillText('INSURING A $100 LOAN · FEE PER YEAR', 40, 58);
  g.fillStyle = '#fff'; g.font = '800 64px Figtree'; g.fillText(who, 40, 132); g.fillStyle = col; g.font = '800 110px JBM'; g.textAlign = 'right'; g.fillText(big, w - 36, 140);
  g.fillStyle = 'rgba(255,255,255,0.75)'; g.font = '700 34px Inter'; g.fillText(sub, w - 40, 192);
  if (pts) { g.strokeStyle = col; g.lineWidth = 12; g.lineJoin = 'round'; g.lineCap = 'round'; g.beginPath(); pts.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.stroke(); const [lx, ly] = pts[pts.length - 1]; g.fillStyle = '#fff'; g.beginPath(); g.arc(lx, ly, 13, 0, 7); g.fill(); }
  if (rec) { g.save(); g.translate(250, 330); g.rotate(-0.08); g.strokeStyle = '#FF5A4A'; g.lineWidth = 8; g.strokeRect(-150, -46, 300, 92); g.fillStyle = '#FF5A4A'; g.font = '900 64px Figtree'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(rec, 0, 4); g.restore(); } });
const bdFriend = [1, 2, 3].map(v => new THREE.MeshBasicMaterial({ map: boardTex('Your friend', `$${v}`, v === 1 ? 'people trust him' : 'people doubt him', v === 1 ? '#7FE0A8' : '#FFC84A', [[40, 400], [300, 396], [560, 388 - (v - 1) * 40], [820, 380 - (v - 1) * 70], [990, 372 - (v - 1) * 90]], null), toneMapped: false }));
const bdOracle = new THREE.MeshBasicMaterial({ map: boardTex('Oracle', '$3.56', 'Tue 24 Nov 2026', '#FF5A4A', [[40, 420], [190, 410], [330, 388], [470, 396], [600, 350], [740, 330], [860, 300], [990, 236]], 'RECORD'), toneMapped: false });
const bdCore = new THREE.MeshBasicMaterial({ map: boardTex('CoreWeave', '$13.14', 'Tue 24 Nov 2026', '#FF5A4A', [[40, 440], [200, 420], [360, 400], [500, 360], [640, 330], [780, 290], [900, 250], [990, 214]], null), toneMapped: false });
const bdBlank = new THREE.MeshBasicMaterial({ map: boardTex('', '', '', '#FFC84A', null, null), toneMapped: false });
{ const b = new GB(); b.box(0.6, BD[1] - 3.4, 0.6, 0x4A4E56, BD[0] - 7, (BD[1] - 3.4) / 2, BD[2] - 0.6); b.box(0.6, BD[1] - 3.4, 0.6, 0x4A4E56, BD[0] + 7, (BD[1] - 3.4) / 2, BD[2] - 0.6); b.box(16.8, 7.9, 0.7, 0x22262E, BD[0], BD[1], BD[2] - 0.45); scene.add(b.mesh()); }
stat.push([BD[0] - 9, BD[0] + 9, BD[2] - 1.5, BD[2] + 0.5, BD[1] + 5, 'board']);
const board = new THREE.Mesh(new THREE.PlaneGeometry(16, 7.34), bdBlank); board.position.set(BD[0], BD[1], BD[2]); scene.add(board);

// ───────────────────────── data centres (Oracle's, CoreWeave's), more behind, a building site with two cranes
const DCS = [[DC1, 'ORACLE'], [DC2, 'COREWEAVE'], [[-30, -46], ''], [[70, -12], ''], [[76, -46], '']].map(([p, nm], i) => {
  const m = dataCenter(30, 16, 7, { strip: i === 1 ? 0x3FD08A : 0x3E8FD0 }); m.position.set(p[0], 0, p[1]); scene.add(m); stat.push([p[0] - 18, p[0] + 18, p[1] - 9, p[1] + 9, 11, 'data centre']);
  if (nm) { const s = signPlane(nm, i === 1 ? '#1F3B2E' : '#3A2A24', i === 1 ? '#BFF5D8' : '#FFD9C8', 15, 2.1, 1024, 144, 96); s.position.set(p[0] - 3, 4.4, p[1] + m.userData.signZ + 0.05); scene.add(s); }
  return m; });
const chipM = new THREE.MeshLambertMaterial({ vertexColors: true, emissive: 0x3FD08A, emissiveIntensity: 0 });
const CHIPS = [-10, -2, 6].map((dx, i) => { const c = new THREE.Mesh(CHIP, chipM); c.scale.setScalar(4.2); c.position.set(DC2[0] + dx, 9.0, DC2[1] + 2); c.castShadow = true; scene.add(c); return c; });
const oraGlowM = new THREE.MeshBasicMaterial({ color: 0xFF7A5A, transparent: true, opacity: 0, depthWrite: false, toneMapped: false, blending: THREE.AdditiveBlending });
const oraGlow = new THREE.Mesh(new THREE.BoxGeometry(31, 8, 17), oraGlowM); oraGlow.position.set(DC1[0], 3.9, DC1[1]); scene.add(oraGlow);
// the building site: a steel frame going up, two cranes
{ const b = new GB(), st = 0x8C96A8; for (let x = -14; x <= 14; x += 4) for (const z of [-7, 7]) b.box(0.4, 7, 0.4, st, SITE[0] + x, 3.5, SITE[1] + z); for (const y of [3.5, 7]) for (const z of [-7, 7]) b.box(29, 0.35, 0.4, st, SITE[0], y, SITE[1] + z); for (let x = -14; x <= 14; x += 4) b.box(0.35, 0.35, 14.4, st, SITE[0] + x, 7, SITE[1]); b.box(30, 0.3, 15, 0xB8B2A6, SITE[0], 0.15, SITE[1]); scene.add(b.mesh()); }
stat.push([SITE[0] - 16, SITE[0] + 16, SITE[1] - 9, SITE[1] + 9, 9, 'site']);
const CRANES = [[SITE[0] - 18, SITE[1] + 4, 36, 24, -0.4], [SITE[0] + 17, SITE[1] - 6, 30, 20, 2.6]].map(([x, z, h, L, ry]) => { const c = crane(h, L); c.position.set(x, 0, z); c.userData.top.rotation.y = ry; c.userData.ry = ry; c.children.forEach(k => { k.castShadow = true; }); scene.add(c); stat.push([x - 2, x + 2, z - 2, z + 2, h + 6, 'crane']); return c; });

// ───────────────────────── the seesaw: what giants spend on building (heavy) against what their business brings in
const sw = seesaw(13); sw.position.set(SAW[0], 0, SAW[1]); scene.add(sw); stat.push([SAW[0] - 8, SAW[0] + 8, SAW[1] - 2, SAW[1] + 2, 6, 'seesaw']);
const spendG = new THREE.Group(); { const b = new GB(); for (let i = 0; i < 3; i++) b.box(1.7, 1.5, 1.7, 0x8C6A4A, -1.2 + i * 1.2, 0.95 + (i === 1 ? 1.5 : 0), 0, 0, i * 0.2, 0); b.box(4.6, 0.4, 0.5, 0x8C96A8, 0, 3.25, 0.2, 0, 0, 0.12); b.box(4.6, 0.4, 0.5, 0x8C96A8, 0.1, 3.6, -0.3, 0, 0, -0.06); spendG.add(b.mesh()); const rk = rack(); const r1 = new THREE.Mesh(rk[0], MAT); r1.position.set(1.9, 0.2, 0); r1.scale.setScalar(1.1); spendG.add(r1); }
sw.userData.plank.add(spendG); spendG.position.set(-4.4, 0.2, 0);
const cashPile = new THREE.Group(); for (let i = 0; i < 5; i++) { const m = new THREE.Mesh(CASH, MAT); m.position.set(-1 + (i % 3) * 1.05, 0.42 + Math.floor(i / 3) * 0.44, (i % 2) * 0.5 - 0.25); m.scale.setScalar(1.2); m.castShadow = true; cashPile.add(m); }
sw.userData.plank.add(cashPile); cashPile.position.set(4.6, 0.2, 0);
const LOANPILE = []; for (let i = 0; i < 6; i++) { const m = new THREE.Mesh(CASH, MAT); m.scale.setScalar(1.2); m.castShadow = true; m.visible = false; scene.add(m); LOANPILE.push({ m, slot: [-1.1 + (i % 3) * 1.1, 1.3 + Math.floor(i / 3) * 0.5, (i % 2) * 0.6 - 0.3], t0: T.loanA + i * 0.12 }); }
const tilt = t => { const down = eio(seg(t, T.tipA - 0.1, T.tipA + 0.8)) - eio(seg(t, T.loanA + 0.6, T.loanA + 1.8)); return 0.2 * c01(down); };    // radians: positive = west end (spending) down
// a bond certificate over the seesaw (CoreWeave's bond: buyers want over 17% a year)
const bondTex = textTex(640, 420, (g, w, h) => { g.fillStyle = '#FBF6E8'; g.fillRect(0, 0, w, h); g.strokeStyle = '#C9A24A'; g.lineWidth = 14; g.strokeRect(16, 16, w - 32, h - 32); g.lineWidth = 3; g.strokeRect(38, 38, w - 76, h - 76);
  g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#5A4020'; g.font = '900 88px Fraunces'; g.fillText('BOND', w / 2, 118); g.fillStyle = '#3A2A1A'; g.font = '800 44px Figtree'; g.fillText('CoreWeave', w / 2, 204);
  g.fillStyle = '#8A5A20'; g.font = '800 40px JBM'; g.fillText('9.75% · due 2031', w / 2, 272); g.fillStyle = '#E2A23A'; g.beginPath(); g.arc(w - 104, h - 96, 38, 0, 7); g.fill(); g.fillStyle = '#C9BFA6'; g.fillRect(90, h - 110, 260, 10); g.fillRect(90, h - 84, 200, 10); });
const bondG = new THREE.Mesh(new THREE.PlaneGeometry(6.4, 4.2), new THREE.MeshBasicMaterial({ map: bondTex, toneMapped: false, side: THREE.DoubleSide })); bondG.position.set(SAW[0] + 1, 9.2, SAW[1] + 2); bondG.visible = false; bondG.renderOrder = 5; scene.add(bondG);

// ───────────────────────── crates of borrowed cash flying from the bank (the cover: to the building site; "they borrow": to the seesaw)
const FLY = [];
for (let i = 0; i < 16; i++) { const m = new THREE.Mesh(CASH, MAT); m.scale.setScalar(5); m.castShadow = true; scene.add(m); FLY.push({ m, k: i, kind: 'site' }); }
const flyPath = (k, t) => { const per = 2.6, ph = ((t * 0.5 + k / 16) % 1), a = [BANK[0] + 4, 18, BANK[1] + 2], b = [SITE[0] - 4, 12, SITE[1] + 2]; return [lerp(a[0], b[0], ph), lerp(a[1], b[1], ph) + Math.sin(ph * Math.PI) * 36, lerp(a[2], b[2], ph), ph]; };

// ───────────────────────── Nvidia's tower; the crowd; fireworks
const nv = tower(20, 78, 20, { rand: rng(31), color: 0x2E3A2E, glass: 0x7FD08A, floor: 4.0, litP: 0.7, crown: true }); nv.position.set(NV[0], 0, NV[1]); nv.children.forEach(c => { c.castShadow = true; c.receiveShadow = true; }); scene.add(nv);
stat.push([NV[0] - 11, NV[0] + 11, NV[1] - 11, NV[1] + 11, 86, 'nvidia tower']);
const nvSign = signPlane('NVIDIA', '#1C2A1C', '#9BF0A8', 18, 3.0, 1024, 170, 120); nvSign.position.set(NV[0], 70, NV[1] + 10.12); scene.add(nvSign);
const CROWD = []; for (let i = 0; i < 16; i++) { const rr = rng(900 + i), m = person(modern(i + 2, { s: 1.3 })); m.position.set(NV[0] - 16 + rr() * 32, 0, NV[1] + 16 + rr() * 10); m.rotation.y = -Math.PI / 2 + (rr() - .5) * 0.8; scene.add(m); CROWD.push({ m, ph: rr() * 6 }); }
const sparkT = (() => { const cv = document.createElement('canvas'); cv.width = cv.height = 64; const g = cv.getContext('2d'); g.translate(32, 32); g.fillStyle = '#fff'; for (let k = 0; k < 2; k++) { g.rotate(Math.PI / 2 * k); g.beginPath(); g.moveTo(0, -30); g.quadraticCurveTo(3, -3, 30, 0); g.quadraticCurveTo(3, 3, 0, 30); g.quadraticCurveTo(-3, 3, -30, 0); g.quadraticCurveTo(-3, -3, 0, -30); g.fill(); } const tx = new THREE.CanvasTexture(cv); tx.colorSpace = THREE.SRGBColorSpace; return tx; })();
const BURSTS = [[NV[0] - 20, 96, NV[1] + 4, 0], [NV[0] + 18, 104, NV[1] - 2, 0.3], [NV[0] - 4, 114, NV[1] - 6, 0.6], [NV[0] + 30, 90, NV[1] + 8, 0.95], [NV[0] - 30, 108, NV[1] - 4, 1.25]];
const FW = []; BURSTS.forEach(([x, y, z, d], j) => { for (let k = 0; k < 22; k++) { const a = k / 22 * Math.PI * 2, e = (k % 2 ? 0.35 : -0.25); const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: sparkT, color: [0xFFD27A, 0x9BF0A8, 0xFFF2C0, 0x9BE0F0, 0xFFC84A][j], transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false, fog: false })); sp.visible = false; scene.add(sp); FW.push({ sp, c: [x, y, z], dir: [Math.cos(a) * Math.cos(e), Math.sin(e) + Math.sin(a) * 0.7, Math.sin(a) * 0.4], t0: T.fwA + d }); } });
// Nvidia's stock line beside the tower: flat, then the jump (Mon 23 Nov, +31.5%)
const NL = [[-18, 30], [-12, 28.5], [-6, 26], [0, 24.5], [6, 22.8]].map(([x, y]) => [NV[0] + 28 + x * 0.6, y, NV[1] + 14]);   // y = 10 + (price - 100) / 2: about $140 down to $125.53 (Fri 20 Nov)
const nvJump = [NV[0] + 28 + 3.6 + 7, 42.5, NV[1] + 14];                                                                 // Mon 23 Nov: $165.05 (+31.5%)

// ───────────────────────── the red line in the sky: the price of insuring AI debt (a sketch: about doubled in six months, then a record on 24 Nov)
const LZ = -175;
const LP = [[-150, 52], [-124, 56], [-100, 54], [-78, 62], [-56, 60], [-34, 72], [-12, 70], [10, 84], [32, 80], [54, 96], [74, 100], [92, 104], [104, 122]].map(([x, y]) => [x, y, LZ]);
const NPRE = LP.length - 2;   // the last segment (24 Nov) is drawn at "Lenders didn't"
const segM = new THREE.MeshBasicMaterial({ color: 0xFF4A3A, toneMapped: false, fog: false });
const lineSegs = LP.slice(1).map((q, i) => { const p = LP[i], L = Math.hypot(q[0] - p[0], q[1] - p[1]), m = new THREE.Mesh(new THREE.BoxGeometry(1, 2.4, 2.4).translate(0.5, 0, 0), segM); m.position.set(...p); m.rotation.z = Math.atan2(q[1] - p[1], q[0] - p[0]); m.userData = { L }; scene.add(m); return m; });
const dotG = new THREE.SphereGeometry(2.6, 12, 8), dotM = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, toneMapped: false, fog: false });
const tipDot = new THREE.Mesh(dotG, dotM); scene.add(tipDot);
const lineGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: radial('rgba(255,110,90,0.8)', 'rgba(255,110,90,0)'), color: 0xFF7A6A, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false, fog: false })); lineGlow.scale.set(40, 40, 1); scene.add(lineGlow);
const segShown = (i, t) => i < NPRE ? 1 : eio(seg(t, T.recB, T.recB + 0.7));

// ───────────────────────── street life
const CARS = [[0xC8423A, 80, 1, 8, 0], [0x2F6FB8, 80, -1, 9, 40], [0xE9C46A, 8, 1, 7, 150], [0x4C9A62, 8, -1, 8, 230], [0xEDEDED, 80, 1, 8.6, 300], [0x7A4FA0, 8, -1, 7, 90]].map(([col, z, dir, v, off]) => { const m = car(col, { boxy: true }); scene.add(m); return { m, z: z + dir * 2, dir, v, off }; });
const clouds = []; for (let i = 0; i < 16; i++) { const m = cloud(R); const far = i >= 9; m.position.set(far ? -500 + R() * 1000 : -240 + i * 56 + R() * 20, 150 + R() * 40, far ? -560 + R() * 160 : -330 + R() * 260); m.scale.setScalar(2.0 + R() * 2.2); m.userData.x0 = m.position.x; scene.add(m); clouds.push(m); }
const sparks = []; for (let i = 0; i < 40; i++) { const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: sparkT, color: 0xFFE9A8, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false })); sp.userData = { ph: R() * 6.28, w: 3 + R() * 4, k: R() }; scene.add(sp); sparks.push(sp); }

// ───────────────────────── camera path (spherical keys around a target; `up` tilts the view so the subject sits lower in the frame)
const MID = [(YOU[0] + FR[0]) / 2, 2.2, YOU[1]];
const CAM = [
  { t: 0, tg: [-14, 12, -6], d: 160, az: -40, el: 10, up: 0.06 },                                       // the cover: the lenders' bank, crates of cash flying to the cranes, data centres, the red line
  { t: T.bigOut, tg: [-15, 12, -6], d: 152, az: -37, el: 10, up: 0.06, mv: 1 },
  { t: T.ai1 + 0.2, tg: [BANK[0] + 8, 13, BANK[1] - 2], d: 74, az: -6, el: 12, up: 0.06, mv: 1 },        // over the bank: the crates leave for the building site
  { t: T.lenders1 + 0.15, tg: [BANK[0], 2.6, BANK[1] + 9.6], d: 19, az: 8, el: 8, up: 0.06, mv: 1 },    // the lenders on the steps
  { t: T.b2 - 0.05, tg: [BANK[0], 2.6, BANK[1] + 9.6], d: 18, az: 2, el: 8, up: 0.06 },
  { t: T.four + 0.15, tg: [(COLX[0] + COLX[1]) / 2 + 0.5, 8.5, COLZ], d: 52, az: -4, el: 8, up: 0.0, mv: 1 },  // the two columns: four times
  { t: T.b3 + 0.1, tg: [(COLX[0] + COLX[1]) / 2 + 0.5, 8.5, COLZ], d: 51, az: -8, el: 8, up: 0.0 },
  { t: T.lender3 + 0.2, tg: [BANK[0], 5.0, BANK[1] + 10], d: 30, az: -6, el: 10, up: 0.04, mv: 1 },   // the lenders again: how do you spot one?
  { t: T.watch, tg: [BANK[0], 5.0, BANK[1] + 10], d: 29, az: -2, el: 10, up: 0.04 },
  { t: T.insurance + 0.15, tg: [KI[0], 4.0, KI[1] + 2], d: 27, az: 8, el: 12, up: 0.08, mv: 1 },        // the kiosk with the umbrella sign
  { t: T.b5 + 0.1, tg: [KI[0], 3.6, KI[1] + 3], d: 25, az: 4, el: 11, up: 0.06 },
  { t: T.friend + 0.2, tg: MID, d: 22, az: 2, el: 9, up: -0.03, mv: 1 },                                // you and your friend
  { t: T.dollars5 + 0.4, tg: MID, d: 21, az: -3, el: 9, up: -0.03 },
  { t: T.fee6 + 0.2, tg: [KI[0] + 2.2, 2.8, KI[1] + 5], d: 32, az: 5, el: 10, up: -0.02, mv: 1 },       // the fee coin to the stack; the umbrella over you
  { t: T.cant + 0.3, tg: [KI[0] + 2.2, 2.9, KI[1] + 5], d: 31, az: 0, el: 10, up: -0.02 },
  { t: T.doubt + 0.3, tg: [KI[0] + 4.6, 3.0, KI[1] + 5], d: 26, az: -6, el: 10, up: -0.02, mv: 1 },     // doubt over the friend; the fee climbs
  { t: T.fee7 + 0.3, tg: [KI[0] + 4.6, 3.2, KI[1] + 5], d: 26, az: -10, el: 10, up: -0.02 },
  { t: T.record + 0.2, tg: [BD[0], 11.5, BD[2]], d: 52, az: 4, el: 6, up: 0.02, mv: 1 },             // up to the board: record, Oracle
  { t: T.half + 0.3, tg: [BD[0], 11.5, BD[2]], d: 50, az: 0, el: 6, up: 0.02 },
  { t: T.chips - 0.2, tg: [DC2[0] - 8, 8, DC2[1] + 18], d: 62, az: 10, el: 12, up: 0.02, mv: 1 },     // CoreWeave's data centre, its AI chips
  { t: T.thirteen + 0.15, tg: [STK[0] - 1.5, 4.2, STK[1]], d: 24, az: -8, el: 12, up: 0.04, mv: 1 },  // the stack jumps to 13
  { t: T.b10 + 0.05, tg: [STK[0] - 1.5, 4.2, STK[1]], d: 23, az: -12, el: 12, up: 0.04 },
  { t: T.giants + 0.3, tg: [SAW[0], 4.0, SAW[1]], d: 30, az: 24, el: 10, up: 0.04, mv: 1 },           // the seesaw: spending against cash
  { t: T.brings + 0.4, tg: [SAW[0], 4.0, SAW[1]], d: 29, az: 18, el: 10, up: 0.04 },
  { t: T.borrow + 0.3, tg: [SAW[0] - 12, 7, SAW[1] - 6], d: 58, az: 30, el: 13, up: 0.02, mv: 1 },    // borrowed crates fly in from the bank
  { t: T.bond + 0.2, tg: [SAW[0], 6.5, SAW[1]], d: 34, az: 16, el: 9, up: 0.04, mv: 1 },               // the bond: 17%
  { t: T.year11 + 0.2, tg: [SAW[0], 6.5, SAW[1]], d: 33, az: 10, el: 9, up: 0.04 },
  { t: T.nvidia + 0.2, tg: [NV[0] + 18, 40, NV[1] + 10], d: 150, az: 24, el: 8, up: 0.03, mv: 1 },     // crane over to Nvidia's tower: the jump, fireworks
  { t: T.third + 0.5, tg: [NV[0] + 18, 44, NV[1] + 10], d: 144, az: 20, el: 8, up: 0.03 },
  { t: T.lenders13 + 0.2, tg: [-20, 50, -64], d: 225, az: 12, el: 7, up: 0.04, mv: 1 },               // pull back: the red line ticks up behind
  { t: T.yet + 0.4, tg: [-16, 50, -64], d: 230, az: 10, el: 7, up: 0.04 },
  { t: T.story + 0.7, tg: [-14, 12, -6], d: 168, az: -42, el: 10, up: 0.07, mv: 1 },                  // wide again: the title
  { t: T.cta - 0.3, tg: [-14, 12, -4], d: 160, az: -38, el: 10, up: 0.07 },
  { t: T.cta + 0.7, tg: [KI[0], 10, KI[1] - 6], d: 100, az: 10, el: 22, up: 0.0, mv: 1 },
  { t: T.comment + 0.1, tg: [KI[0] + 2, 4.0, KI[1] + 3], d: 38, az: 10, el: 13, up: 0.03, mv: 1 },     // the kiosk (the comment boxes go below it)
  { t: DUR + 0.5, tg: [KI[0] + 2, 4.0, KI[1] + 3], d: 36, az: 6, el: 13, up: 0.03 },
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
const tagCrates = mk('tag cash', 'borrowed <b>$466bn</b> · Jan–Sep 2026');
const tagLenders = mk('tag am', 'the <b>lenders</b>');
const tag25 = mk('tag grey', 'Jan–Sep 2025 <b>$101bn</b>'), tag26 = mk('tag cash', 'Jan–Sep 2026 <b>$466bn</b>');
const cardFour = mk('card', `AI-related debt raised, January–September:\n<u>$101 billion</u> in 2025 · <em>$466 billion</em> in 2026\n<small>Morgan Stanley data via the FT · IO Fund · Oct 2026</small>`);
const tagIns = mk('tag am', 'insurance on a <b>loan</b>');
const tagYou = mk('tag', 'you'), tagFr = mk('tag', 'your friend'), tagBill = mk('tag cash', 'lent <b>$100</b>');
const tagFee = mk('tag am', 'fee <b>$1</b> a year'), tagCover = mk('tag ok', 'if he can’t pay, <b>you</b> get paid');
const cardCDS = mk('card', `This insurance is called a <em>credit default swap</em>:\na yearly fee per $100 lent, paid out if the borrower can’t pay\n<small>Reuters · CNBC · 2026</small>`);
const tagFee3 = mk('tag dn', 'fee <b>$3</b> a year');
const stampRec = mk('stamp', 'RECORD');
const cardOra = mk('card', `Tue 24 Nov: insuring $100 of Oracle’s debt cost <s>$3.56</s> a year\na record, about double six months earlier\n<small>Reuters (S&amp;P Global) · CNBC · FactSet · 2026</small>`);
const tagStack = mk('tag dn', 'Oracle <b>$3.56</b>'), tagStack13 = mk('tag dn', 'CoreWeave <b>$13.14</b>');
const tagChips = mk('tag ok', 'rents out <b>AI chips</b>');
const cardCore = mk('card', `CoreWeave: <s>$13.14</s> a year to insure $100 of its debt\nabove $10 is usually seen as distressed\n<small>Reuters (S&amp;P Global) · FactSet · Disruption Banking · 24 Nov 2026</small>`);
const tagSpend = mk('tag dn', 'spending on <b>building</b>'), tagCash = mk('tag cash', 'cash the <b>business</b> brings in');
const cardGiants = mk('card', `Microsoft, Amazon, Meta and Alphabet: on track to spend\nmore on building than their business brings in, <em>2026 and 2027</em>\n<small>Man Group via CNBC · company results via TIKR · Nov 2026</small>`);
const tagLoan = mk('tag cash', '<b>borrowed</b>');
const tagBond = mk('tag', 'CoreWeave bond · <b>9.75%</b> · due 2031');
const stamp17 = mk('stamp', 'OVER 17% A YEAR');
const cardBond = mk('card', `Its 2031 bond fell to about <s>77 cents</s> on the dollar,\nso a buyer today earns <em>over 17%</em> a year\n<small>CNBC · Bloomberg · 24 Nov 2026</small>`);
const tagNv = mk('tag ok', 'Mon 23 Nov · Nvidia <b>+31.5%</b>');
const stampUp = mk('stamp ok', '+31.5%');
const stampRec2 = mk('stamp', 'RECORD'), tagRec2 = mk('tag dn', 'Tue 24 Nov · insurance on AI debt <b>↑</b>');
const tagSketch = mk('tag grey', 'the price of insuring AI debt · <b>sketch</b>');
const title = mk('title', '<div class="s">THE STORY OF</div><div class="n">The Nervous\n<em>Lenders</em></div>');
const lesson = mk('lesson', `Stocks can bounce <em>while lenders worry</em>.`);
const ctaChip = mk('chip am', 'what would you do?');
const boxes = [0, 1].map(() => { const e = mk('cbox', '<span class="in"></span><span class="post">Post</span>'); return { e, inn: e.querySelector('.in'), post: e.querySelector('.post') }; });
const foot = document.getElementById('foot');
foot.textContent = "Sources: Morgan Stanley data via FT, IO Fund · Reuters (S&P Global MI) · CNBC · Bloomberg · FactSet · TIKR (Oct–Nov 2026)\nInsurance = 5-year credit default swaps, fee per $100 a year · not advice";
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
  const CHP = [[T.bigOut + 0.05, T.b2 - 0.1, 'AI borrowing · Jan–Sep 2026'], [T.b2 + 0.05, T.b3 - 0.1, 'Jan–Sep 2025 vs 2026'], [T.b3 + 0.05, T.b5 - 0.1, 'how to spot a nervous lender'],
    [T.b5 + 0.05, T.b8 - 0.1, 'how loan insurance works'], [T.b8 + 0.05, T.b10 - 0.1, 'Tue 24 Nov 2026'], [T.b10 + 0.05, T.b12 - 0.1, 'why they borrow'],
    [T.b12 + 0.05, T.lenders13 - 0.1, 'Mon 23 Nov 2026'], [T.lenders13 + 0.05, T.b14 - 0.1, 'Tue 24 Nov 2026'], [T.b14 + 0.05, T.b15 - 0.1, 'as of 25 Nov 2026']];
  for (const [a, b, s] of CHP) { const o = win(t, a, b, 0.22, 0.22); if (o > co) { co = o; ct = s; cp = pop(t, a); } }
  if (ct) setTxt(chip, ct); put(chip, W / 2, 472, co, cp);
  // 1 — the crates leave the bank; the lenders
  put(tagCrates, W / 2, 1380, win(t, T.bigOut + 0.1, T.lenders1, 0.25, 0.25), pop(t, T.bigOut + 0.1));
  { const p = p3([BANK[0], 4.6, BANK[1] + 9.6], win(t, T.lenders1 + 0.1, T.b2 + 0.2, 0.2, 0.25)); put(tagLenders, clampX(p[0], 200), clampY(p[1] - 40, 600, 1300), p[2], pop(t, T.lenders1 + 0.1)); }
  // 2 — the columns
  { const p = p3([COLX[0], BASE + FYc(101) + 2.2, COLZ + CW / 2], win(t, T.colA + 0.3, T.b3 + 0.3, 0.2, 0.25)); put(tag25, clampX(p[0] - 30, 220), clampY(p[1], 600, 1300), p[2], pop(t, T.colA + 0.3)); }
  { const p = p3([COLX[1], BASE + FYc(466) + 2.0, COLZ + CW / 2], win(t, T.colB + 0.4, T.b3 + 0.3, 0.2, 0.25)); put(tag26, clampX(p[0] + 30, 220), clampY(p[1], 600, 1300), p[2], pop(t, T.colB + 0.4)); }
  put(cardFour, W / 2, 1400, win(t, T.times + 0.2, T.b3 + 0.5, 0.25, 0.25), pop(t, T.times + 0.2));
  // 4-7 — the kiosk, you and your friend, the fee, the cover, the doubt
  { const p = p3([KI[0], 7.2, KI[1]], win(t, T.insurance + 0.1, T.b5 + 0.3, 0.2, 0.25)); put(tagIns, clampX(p[0], 220), clampY(p[1] - 30, 600, 1300), p[2], pop(t, T.insurance + 0.1)); }
  { const p = p3([YOU[0], 4.0, YOU[1]], win(t, T.lend5, T.b6 + 0.2, 0.2, 0.25)); put(tagYou, clampX(p[0], 150), clampY(p[1] - 30, 600, 1350), p[2], pop(t, T.lend5)); }
  { const p = p3([FR[0], 4.0, FR[1]], win(t, T.friend, T.b6 + 0.2, 0.2, 0.25)); put(tagFr, clampX(p[0], 180), clampY(p[1] - 30, 600, 1350), p[2], pop(t, T.friend)); }
  { const p = p3([MID[0], 3.4, MID[1]], win(t, T.billA + 0.35, T.b6 + 0.2, 0.2, 0.25)); put(tagBill, clampX(p[0], 200), clampY(p[1] - 120, 600, 1350), p[2], pop(t, T.billA + 0.35)); }
  { const p = p3([STK[0], PED_TOP + 2.4, STK[1]], win(t, T.coin1 + 0.4, T.coinUp, 0.2, 0.2)); put(tagFee, clampX(p[0] + 20, 200), clampY(p[1] - 40, 600, 1350), p[2], pop(t, T.coin1 + 0.4)); }
  { const p = p3([YOU[0], 6.2, YOU[1]], win(t, T.cover + 0.3, T.b7 + 0.1, 0.2, 0.25)); put(tagCover, clampX(p[0] + 60, 300), clampY(p[1] - 50, 600, 1300), p[2], pop(t, T.cover + 0.3)); }
  put(cardCDS, W / 2, 1400, win(t, T.cant + 0.15, T.b8 - 0.1, 0.25, 0.25), pop(t, T.cant + 0.15));
  { const p = p3([STK[0], PED_TOP + 2.6, STK[1]], win(t, T.coinUp + 0.5, T.b8 + 0.2, 0.2, 0.2)); put(tagFee3, clampX(p[0] + 20, 200), clampY(p[1] - 40, 600, 1350), p[2], pop(t, T.coinUp + 0.5)); }
  // 8-9 — record; Oracle; CoreWeave; 13
  { const p = p3([BD[0] + 6, BD[1] + 7.5, BD[2]], win(t, T.recA, T.b9 - 0.1, 0.12, 0.25)); put(stampRec, clampX(p[0], 220), clampY(p[1], 620, 1250), p[2], pop(t, T.recA, 0.25)); stampRec.style.rotate = '-6deg'; }
  put(cardOra, W / 2, 1400, win(t, T.oraA + 0.2, T.b9 - 0.1, 0.25, 0.25), pop(t, T.oraA + 0.2));
  { const p = p3([STK[0], PED_TOP + 2.6, STK[1]], win(t, T.halfA + 0.2, T.c13 - 0.1, 0.2, 0.2)); put(tagStack, clampX(p[0] + 20, 220), clampY(p[1] - 40, 600, 1350), p[2], pop(t, T.halfA + 0.2)); }
  { const p = p3([DC2[0] - 4, 13, DC2[1] + 2], win(t, T.chipA, T.thirteen - 0.2, 0.2, 0.25)); put(tagChips, clampX(p[0], 220), clampY(p[1] - 30, 600, 1300), p[2], pop(t, T.chipA)); }
  { const p = p3([STK[0], PED_TOP + 0.4 * 13 + 0.7, STK[1]], win(t, T.c13 + 0.4, T.b10 + 0.2, 0.2, 0.2)); put(tagStack13, clampX(p[0] + 20, 220), clampY(p[1], 600, 1350), p[2], pop(t, T.c13 + 0.4)); }
  put(cardCore, W / 2, 1400, win(t, T.cwA + 0.2, T.b10 - 0.1, 0.25, 0.25), pop(t, T.cwA + 0.2));
  // 10-11 — the seesaw, borrowing, the bond
  { const a = tilt(t), pl = sw.userData.plank; const L = (x, y) => [SAW[0] + x * Math.cos(a) - y * Math.sin(a), pl.position.y + x * Math.sin(a) + y * Math.cos(a)];
    { const [x, y] = L(-4.4, 5.2), p = p3([x, y, SAW[1]], win(t, T.spend, T.b11 + 0.2, 0.2, 0.25)); put(tagSpend, clampX(p[0] - 40, 220), clampY(p[1] - 20, 600, 1300), p[2], pop(t, T.spend)); }
    { const [x, y] = L(4.6, 3.4), p = p3([x, y, SAW[1]], win(t, T.brings - 0.1, T.bond - 0.1, 0.2, 0.25)); put(tagCash, clampX(p[0] + 40, 240), clampY(p[1] - 20, 600, 1300), p[2], pop(t, T.brings - 0.1)); }
    { const [x, y] = L(4.6, 2.6), p = p3([x, y, SAW[1]], win(t, T.loanA + 0.7, T.bond - 0.1, 0.2, 0.25)); put(tagLoan, clampX(p[0] + 30, 200), clampY(p[1] + 60, 600, 1350), p[2], pop(t, T.loanA + 0.7)); } }
  put(cardGiants, W / 2, 1400, win(t, T.giants - 0.1, T.b11 - 0.05, 0.25, 0.25), pop(t, T.giants - 0.1));
  { const p = p3([bondG.position.x, bondG.position.y + 2.9, bondG.position.z], win(t, T.bondA + 0.3, T.b12 - 0.1, 0.2, 0.25)); put(tagBond, clampX(p[0], 260), clampY(p[1] - 30, 600, 1300), p[2], pop(t, T.bondA + 0.3)); }
  put(stamp17, W / 2, 1150, win(t, T.y17, T.b12 - 0.05, 0.12, 0.25), pop(t, T.y17, 0.25)); stamp17.style.rotate = '-5deg';
  put(cardBond, W / 2, 1400, win(t, T.buyers, T.b12 - 0.05, 0.25, 0.25), pop(t, T.buyers));
  // 12-13 — Nvidia's jump; the record behind it
  { const p = p3([nvJump[0], nvJump[1] + 8, nvJump[2]], win(t, T.jumpA + 0.2, T.lenders13 - 0.1, 0.12, 0.25)); put(stampUp, clampX(p[0], 220), clampY(p[1], 620, 1250), p[2], pop(t, T.jumpA + 0.2, 0.25)); }
  put(tagNv, W / 2, 1380, win(t, T.nvidia, T.lenders13 - 0.1, 0.2, 0.25), pop(t, T.nvidia));
  { const q = LP[LP.length - 1], p = p3([q[0] - 6, q[1] + 16, LZ], win(t, T.recB + 0.6, T.b15 - 0.1, 0.12, 0.25)); put(stampRec2, clampX(p[0], 220), clampY(p[1], 620, 1250), p[2], pop(t, T.recB + 0.6, 0.25)); stampRec2.style.rotate = '-6deg'; }
  put(tagRec2, W / 2, 1380, win(t, T.recB + 0.5, T.b15 - 0.1, 0.2, 0.25), pop(t, T.recB + 0.5));
  { const q = LP[6], p = p3([q[0], q[1] - 16, LZ], Math.max(win(t, T.bigOut + 0.2, T.ai1, 0.25, 0.25), win(t, T.recB + 0.9, T.b15 - 0.1, 0.25, 0.25))); put(tagSketch, clampX(p[0], 330), clampY(p[1], 560, 1300), p[2], pop(t, T.bigOut + 0.2)); }
  // 15 — title and lesson; 16 — the question
  put(title, W / 2, 640, win(t, T.story, T.cta - 0.1, 0.4, 0.3), 0.94 + 0.06 * eo(seg(t, T.story, T.story + 0.6)));
  put(lesson, W / 2, 1180, win(t, T.bounce - 0.2, T.cta - 0.15, 0.3, 0.25), pop(t, T.bounce - 0.2));
  put(ctaChip, W / 2, 472, seg(t, T.lend16, T.lend16 + 0.3), pop(t, T.lend16));
  [[T.lendK, 'LEND', T.postA], [T.passK, 'PASS', T.postB]].forEach(([t0, word, tp], i) => {
    const bx = boxes[i], L = word.length, n = Math.min(L, Math.floor(c01((t - t0) / (0.12 * L)) * (L + 0.001))), typed = word.slice(0, n), caret = (n < L || Math.floor(t * 2.4) % 2) && t < tp ? '<i></i>' : '';
    setHTML(bx.inn, typed ? `<b>${typed}</b>${caret}` : `<em>Add a comment…</em>${caret}`); const sent = t > tp; const pc = sent ? 'post on sent' : n === L ? 'post on' : 'post'; if (bx.post.className !== pc) bx.post.className = pc; setTxt(bx.post, sent ? 'Posted ✓' : 'Post');
    const ts = i ? T.passK - 0.35 : T.comment; put(bx.e, W / 2, 1330 + i * 132, seg(t, ts, ts + 0.3), pop(t, ts) * (1 + 0.06 * win(t, tp, tp + 0.3, 0.08, 0.2)));
  });
}

// ───────────────────────── the fee stack over time: 0 -> $1 (fee) -> $3 (doubt) -> $3.56 (Oracle) -> $13.14 (CoreWeave)
function feeNow(t) { if (t < T.coin1) return 0; if (t < T.coinUp) return 1; if (t < T.halfA) return 1 + 2 * c01((t - T.coinUp) / 0.5); if (t < T.c13) return 3.56; return 3.56 + (13.14 - 3.56) * eio(seg(t, T.c13, T.c13 + 0.9)); }

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
  // the red line in the sky: the price of insurance climbing; its last piece (24 Nov) at "Lenders didn't"
  { let tip = LP[0]; lineSegs.forEach((m, i) => { const k = segShown(i, t); m.visible = k > 0.001; m.scale.set(Math.max(0.001, k * m.userData.L), 1 + 0.25 * Math.sin(t * 3 + i), 1 + 0.25 * Math.sin(t * 3 + i)); if (k > 0.001) { const p = LP[i], q = LP[i + 1]; tip = [lerp(p[0], q[0], k), lerp(p[1], q[1], k), LZ]; } });
    tipDot.position.set(...tip); tipDot.scale.setScalar(1 + 0.15 * Math.sin(t * 8)); lineGlow.position.set(tip[0], tip[1], tip[2] + 1); }
  // crates of borrowed cash fly from the bank to the building site (from the cover until the lenders)
  { const on = 1 - seg(t, T.lenders1 + 0.6, T.lenders1 + 1.2); FLY.forEach(f => { const [x, y, z, ph] = flyPath(f.k, t); f.m.visible = on > 0.01; f.m.position.set(x, y, z); f.m.rotation.set(ph * 3 + f.k, ph * 2, 0.3); f.m.scale.setScalar(5 * on * Math.min(1, ph * 8, (1 - ph) * 8)); }); }
  // the cranes swing slowly
  CRANES.forEach((c, i) => { c.userData.top.rotation.y = c.userData.ry + Math.sin(t * 0.25 + i * 2) * 0.35; const ly = 14 + Math.sin(t * 0.6 + i) * 3 - (c.userData.h + 0.8); c.userData.hook.position.set(c.userData.hookX, ly, 0); c.userData.cable.position.set(c.userData.hookX, ly + 0.25, 0); c.userData.cable.scale.y = Math.max(0.1, 1.9 - ly - 0.25); });
  // the lenders: sweat drops when they're nervous
  LENDERS.forEach((m, i) => { const ner = win(t, T.nervous1 - 0.2, T.b3 + 0.6, 0.3, 0.4), d = DROPS[i]; d.visible = ner > 0.01; d.material.opacity = ner; const ph = ((t * 0.8 + i * 0.37) % 1); d.position.set(m.position.x + 0.55, m.position.y + 2.9 - ph * 0.6, m.position.z + 0.3); m.position.y = 1.0 + Math.abs(Math.sin(t * 9 + i)) * 0.04 * ner; m.rotation.y = -Math.PI / 2 + 0.25 * (i - 1) + Math.sin(t * 3 + i) * 0.25 * ner; });
  { const o = win(t, T.spot, T.insurance, 0.2, 0.3); bigQ.visible = o > 0.01; bigQ.material.opacity = o; bigQ.position.set(BANK[0], 6.6 + Math.sin(t * 3) * 0.2, BANK[1] + 9.6); bigQ.scale.setScalar(2.2 * (0.8 + 0.2 * back(seg(t, T.spot, T.spot + 0.4)))); }
  // the two cash columns rise: 2025, then 2026 (4.6 times taller)
  COLS.forEach((c, i) => { const u = i === 0 ? eo(seg(t, T.colA, T.colA + 0.7)) : eio(seg(t, T.colB, T.colB + 1.2)); const h = Math.max(0.001, FYc(c.v) * u); c.fill.scale.y = h; c.fill.visible = h > 0.01; c.bands.scale.y = Math.max(0.001, h / 15.4); c.bands.visible = h > 0.4; });
  // the umbrella sign on the kiosk opens on "insurance"
  { const u = back(seg(t, T.umbA - 0.1, T.umbA + 0.5)); umbSign.scale.set(Math.max(0.05, u), 1, Math.max(0.05, u)); umbSign.rotation.y = t * 0.4; umbSign.position.y = 3.0 + 0.3 * Math.sin(t * 2); }
  // the $100 note: in your hand, flies to your friend
  { const u = eio(seg(t, T.billA, T.billA + 0.7)), on = t > T.b5 - 0.2 && t < T.b8; billM.visible = on; const a = [YOU[0] + 0.7, 2.2, YOU[1] + 0.2], b = [FR[0] - 0.7, 2.2, FR[1] + 0.2];
    billM.position.set(lerp(a[0], b[0], u), lerp(a[1], b[1], u) + Math.sin(u * Math.PI) * 2.2, lerp(a[2], b[2], u)); billM.rotation.set(-1.2 + Math.sin(t * 4) * 0.08, Math.sin(u * Math.PI) * 0.6, 0.1); billM.scale.setScalar(0.6);
    const g = win(t, T.cant - 0.05, T.b7 + 0.2, 0.2, 0.3), gu = (t - T.cant) % 1.2 / 1.2; billGhost.visible = g > 0.01; billGhost.material.opacity = g * 0.8 * (1 - gu * 0.6); billGhost.position.set(lerp(KI[0], YOU[0] + 0.5, eio(c01(gu * 1.4))), 2.6 + Math.sin(c01(gu * 1.4) * Math.PI) * 1.8, lerp(KI[1] + 1.2, YOU[1], eio(c01(gu * 1.4)))); billGhost.rotation.set(-0.3, t * 2, 0); billGhost.scale.setScalar(0.55); }
  // the umbrella over you
  { const u = back(seg(t, T.cover, T.cover + 0.5)), out = seg(t, T.b8 - 0.2, T.b8 + 0.3); umbYou.visible = u > 0.01 && out < 1; umbYou.position.set(YOU[0] + 0.3, 1.0 + 0.8 * Math.min(1, u), YOU[1]); umbYou.scale.set(Math.max(0.05, Math.min(1.2, u)) * (1 - out), 1 - out, Math.max(0.05, Math.min(1.2, u)) * (1 - out)); umbYou.rotation.z = -0.15; }
  // the insurer waves on "someone"; your friend shrugs on "can't"; doubt over the friend
  { const wv = win(t, T.someone, T.cover + 0.4, 0.15, 0.2); insurer.rotation.y = -Math.PI / 2 + Math.sin(t * 12) * 0.25 * wv; insurer.position.y = Math.abs(Math.sin(t * 10)) * 0.25 * wv; }
  { const sh = win(t, T.cant, T.b7 + 0.1, 0.1, 0.2); friend.rotation.y = Math.PI + Math.sin(t * 14) * 0.3 * sh; }
  { const o = win(t, T.doubtA, T.b8 + 0.4, 0.3, 0.4); dCloudM.opacity = 0; dCloud.visible = false; dCloud.position.set(FR[0] + Math.sin(t * 0.8) * 0.2, 5.3, FR[1]);
    QS.forEach((q, i) => { const k = back(seg(t, T.doubtA + q.t0, T.doubtA + q.t0 + 0.35)), on = Math.min(k, 1) * (1 - seg(t, T.b8, T.b8 + 0.4)); q.sp.visible = on > 0.01; q.sp.material.opacity = Math.min(1, on); const a = q.a + t * 0.6; q.sp.position.set(FR[0] + Math.cos(a) * q.r, q.y + Math.sin(t * 2 + i) * 0.2, FR[1] + Math.sin(a) * q.r * 0.6); q.sp.scale.setScalar(0.75 * Math.max(0.01, k)); }); }
  // the fee stack: coins drop in as the fee climbs
  { const f = feeNow(t), n = Math.floor(f + 1e-6), half = f - n >= 0.45; COINS.forEach((c, i) => { let on = false, y = PED_TOP + 0.17 + i * 0.34; if (i < 3) on = f >= i + 1 - 1e-6; else if (i === 3) on = f >= 3.5 && f < 4.5 && half; if (i >= 4) on = f >= i - 1e-6; if (i === 3 && f >= 4.5) on = false;
      const idx = i >= 4 ? i - 1 : i, yy = PED_TOP + 0.17 + idx * 0.34, landT = i === 0 ? T.coin1 + 0.35 : null; c.visible = on || (i === 3 && f >= 4 && false);
      if (i >= 4) c.position.set(STK[0], PED_TOP + 0.19 + (i - 1) * 0.4, STK[1]); else c.position.set(STK[0], PED_TOP + 0.19 + idx * 0.4, STK[1]);
      c.rotation.set(0, i * 0.7, 0); });
    // the first coin flies from you to the stack
    if (t > T.coin1 - 0.4 && t < T.coin1) { const u = seg(t, T.coin1 - 0.4, T.coin1), c = COINS[0]; c.visible = true; c.position.set(lerp(YOU[0] + 0.6, STK[0], u), lerp(2.4, PED_TOP + 0.17, u) + Math.sin(u * Math.PI) * 3, lerp(YOU[1], STK[1], u)); c.rotation.set(u * 6, 0, 0); } }
  // the board: blank -> your friend $1 -> $2 -> $3 -> Oracle (record) -> CoreWeave
  board.material = t < T.insurance ? bdBlank : t < T.coinUp ? bdFriend[0] : t < T.coinUp + 0.25 ? bdFriend[1] : t < T.oraA ? bdFriend[2] : t < T.cwA ? bdOracle : bdCore;
  oraGlowM.opacity = 0.35 * win(t, T.oraA, T.cwA, 0.2, 0.3) * (0.7 + 0.3 * Math.sin(t * 6));
  chipM.emissiveIntensity = 0.9 * win(t, T.chipA, T.b10 + 0.3, 0.2, 0.5) * (0.7 + 0.3 * Math.sin(t * 7));
  CHIPS.forEach((c, i) => { const k = back(seg(t, T.chipA + i * 0.1, T.chipA + 0.4 + i * 0.1)); c.position.y = 9.0 + 1.4 * Math.max(0, k) * win(t, T.chipA, T.b10 + 0.3, 0.1, 0.5) + Math.sin(t * 2 + i) * 0.15; c.rotation.y = t * 0.5 + i; });
  // the seesaw: spending is heavier; borrowed crates fly onto the cash side
  { const a = tilt(t); sw.userData.plank.rotation.z = a;
    LOANPILE.forEach((l, i) => { const u = seg(t, l.t0, l.t0 + 0.9); l.m.visible = u > 0; if (!l.m.visible) return; const pl = sw.userData.plank, lx = 4.6 + l.slot[0], ly = l.slot[1] + 0.2;
      const tx = SAW[0] + lx * Math.cos(a) - ly * Math.sin(a), ty = pl.position.y + lx * Math.sin(a) + ly * Math.cos(a), tz = SAW[1] + l.slot[2]; const s0 = [BANK[0] + 6, 14, BANK[1] + 8];
      if (u < 1) { l.m.position.set(lerp(s0[0], tx, eio(u)), lerp(s0[1], ty, u) + Math.sin(u * Math.PI) * 12, lerp(s0[2], tz, eio(u))); l.m.rotation.set(u * 5 + i, u * 3, 0); }
      else { l.m.position.set(tx, ty, tz); l.m.rotation.set(0, 0, a); } }); }
  { const u = back(seg(t, T.bondA, T.bondA + 0.5)), out = seg(t, T.b12 - 0.1, T.b12 + 0.4); bondG.visible = u > 0.01 && out < 1; bondG.scale.setScalar(Math.max(0.01, Math.min(1.15, u)) * (1 - out)); bondG.position.y = 9.2 + Math.sin(t * 2) * 0.25; bondG.quaternion.copy(camera.quaternion); bondG.rotateZ(Math.sin(t * 0.9) * 0.04); }
  // Nvidia: the crowd cheers, fireworks
  CROWD.forEach((c, i) => { const ch = win(t, T.jumped, T.lenders13 + 0.4, 0.2, 0.4); c.m.position.y = Math.abs(Math.sin(t * 7 + c.ph)) * 0.9 * ch; });
  FW.forEach(f => { const u = seg(t, f.t0, f.t0 + 1.6); f.sp.visible = t > f.t0 && u < 1; if (!f.sp.visible) return; const r = 20 * eo(u); f.sp.position.set(f.c[0] + f.dir[0] * r, f.c[1] + f.dir[1] * r - 10 * u * u, f.c[2] + f.dir[2] * r); f.sp.scale.setScalar(8 * (1 - 0.5 * u)); f.sp.material.opacity = 1 - u; });
  nvLine(t);
  // cars, people
  for (const c of CARS) { const L = 700, x = ((c.off + t * c.v) % L) - L / 2; c.m.position.set(c.dir * x, 0, c.z); c.m.rotation.y = c.dir > 0 ? 0 : Math.PI; }
  WALK.forEach((w, i) => { const x = w.x0 + Math.sin(t * 0.3 * w.sp + w.ph) * 3, z = w.z0 + Math.cos(t * 0.3 * w.sp + w.ph) * 2; w.m.position.set(x, Math.abs(Math.sin(t * 6 * w.sp + i)) * 0.06, z); w.m.rotation.y = w.ph + Math.sin(t * 0.2 + i) * 0.4; });
  for (const c of clouds) { c.position.x = c.userData.x0 + t * 1.2; c.material.opacity = 0.9 - 0.5 * night; const k = lerp(1, 0.45, night); c.material.color.setRGB(lerp(s.hor[0], 1, 0.55) * k, lerp(s.hor[1], 1, 0.55) * k, lerp(s.hor[2], 1, 0.55) * k * 1.05); c.material.emissive.setRGB(lerp(s.hor[0], 1, 0.4) * 0.55 * k, lerp(s.hor[1], 1, 0.4) * 0.55 * k, lerp(s.hor[2], 1, 0.4) * 0.58 * k); }
  // sparkles: the 2026 column when it tops out; the posted answers at the kiosk
  { let k = 0; const put3 = (x, y, z, sz, on, col) => { const sp = sparks[k++]; if (!sp) return; const tw2 = Math.pow(Math.abs(Math.sin(t * sp.userData.w + sp.userData.ph)), 3); sp.position.set(x, y, z); sp.scale.setScalar(sz * (0.25 + tw2)); sp.material.opacity = on * (0.3 + 0.7 * tw2); sp.material.color.setHex(col); sp.visible = on > 0.01; };
    const s1 = win(t, T.colB + 1.0, T.b3 + 0.4, 0.3, 0.4); for (let i = 0; i < 14; i++) { const a = i * 0.45 + t * 0.9; put3(COLX[1] + Math.cos(a) * (CW / 2 + 0.4), BASE + FYc(466) - 3 + (i % 5) * 0.9, COLZ + Math.sin(a) * (CW / 2 + 0.4), 1.0, s1, 0xFFE9A8); }
    const s4 = win(t, T.postA, DUR + 1, 0.3, 0.1); for (let i = 0; i < 16; i++) { const ph = (t * 0.35 + i / 16) % 1, a = i * 2.4; put3(KI[0] + Math.cos(a) * 3.2, 1.6 + ph * 4.5, KI[1] + 2.5 + Math.sin(a) * 1.6, 0.8 + 0.3 * (1 - ph), s4 * Math.sin(ph * Math.PI), 0xFFE9A8); }
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
// Nvidia's stock line beside the tower: flat, then the jump on "jumped"
const nvSegM = new THREE.MeshBasicMaterial({ color: 0x9BF0A8, toneMapped: false, fog: false });
const nvPts = [...NL, nvJump], nvSegs = nvPts.slice(1).map((q, i) => { const p = nvPts[i], L = Math.hypot(q[0] - p[0], q[1] - p[1]), m = new THREE.Mesh(new THREE.BoxGeometry(1, 1.3, 1.3).translate(0.5, 0, 0), nvSegM); m.position.set(...p); m.rotation.z = Math.atan2(q[1] - p[1], q[0] - p[0]); m.userData = { L }; scene.add(m); return m; });
function nvLine(t) { const on = win(t, T.b12, T.b15, 0.4, 0.5); nvSegs.forEach((m, i) => { const k = i < nvSegs.length - 1 ? on : on * eio(seg(t, T.jumpA, T.jumpA + 0.6)); m.visible = k > 0.001; m.scale.set(Math.max(0.001, k * m.userData.L), 1, 1); }); }
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
  crates: [0.4, 1.0, 1.7, 2.3, 3.4, 4.1, 4.9].map(v => +v.toFixed(3)), fw: BURSTS.map(b => +(T.fwA + b[3]).toFixed(3)),
  loans: LOANPILE.map(l => +(l.t0 + 0.9).toFixed(3)),
  typingA: [0, 1, 2, 3].map(i => +(T.lendK + (i + 0.5) * 0.12).toFixed(3)), typingB: [0, 1, 2, 3].map(i => +(T.passK + (i + 0.5) * 0.12).toFixed(3)),
  postA: +T.postA.toFixed(3), postB: +T.postB.toFixed(3),
};
document.fonts.ready.then(() => Promise.all(['700 64px Figtree', '900 190px Fraunces', '800 30px JBM', '700 22px Inter', '700 78px Fraunces', '800 54px Figtree', '600 34px Figtree', '500 18px Inter', '900 128px JBM', '800 46px Inter', '900 150px Figtree', '900 112px Fraunces', '800 172px JBM', '700 34px Figtree', '800 92px JBM', '900 64px Figtree', '800 96px JBM', '800 80px Figtree', '800 72px Figtree', '800 78px Figtree', '700 38px Inter', '800 64px Figtree', '800 110px JBM', '700 30px Inter', '700 34px Inter', '900 92px Figtree', '800 104px Figtree', '800 120px Figtree', '900 88px Fraunces', '800 44px Figtree', '800 40px JBM'].map(f => document.fonts.load(f)))).then(() => { TEXS.forEach(f => f()); fitHook(); renderAt(0); window.__ready = true; });
