// The Bitcoin Dominoes — low-poly storybook scene (deterministic: window.renderAt(t) draws the frame for time t)
import * as THREE from 'three';
import { C, SKIN, MAT, rng, M, GB, person, cloud, bushTree, tower, lamp, car, WIN_LIT, GLASS_M, domino, kiosk, bank, bigButton, BIGCOIN } from './kit.js';

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
const R = rng(20261120);

// ───────────────────────── story clock (everything hangs off the narration)
const T = {
  nov: wt(1, 'November') - 0.1, billion: wt(1, 'billion') - 0.1, closed1: wt(1, 'closed') - 0.1, day1: wt(1, 'day') - 0.1, never: wt(1, 'never') - 0.1, pressed: wt(1, 'pressed') - 0.1, button: wt(1, 'button') - 0.1,
  b2: S(2) - 0.05, october: wt(2, 'October') - 0.1, p85: wt(2, '$85,000') - 0.1,
  b3: S(3) - 0.05, traders: wt(3, 'traders') - 0.1, rising: wt(3, 'rising') - 0.1, borrowed3: wt(3, 'borrowed') - 0.1, money3: wt(3, 'money') - 0.1,
  b4: S(4) - 0.05, picture: wt(4, 'Picture') - 0.1, p100a: wt(4, '$100') - 0.1,
  b5: S(5) - 0.05, borrows: wt(5, 'borrows') - 0.1, p900: wt(5, '$900') - 0.1, buys: wt(5, 'buys') - 0.1, p1000: wt(5, '$1,000') - 0.1,
  b6: S(6) - 0.05, falls6: wt(6, 'falls') - 0.1, p10: wt(6, '10%') - 0.1, p100b: wt(6, '$100') - 0.1, gone: wt(6, 'gone') - 0.1,
  b7: S(7) - 0.05, lender: wt(7, 'lender') - 0.1, sells: wt(7, 'sells') - 0.1, auto: wt(7, 'automatically') - 0.1,
  b8: S(8) - 0.05, sale: wt(8, 'sale') - 0.1, lower: wt(8, 'lower') - 0.1, next: wt(8, 'next') - 0.1, closed8: wt(8, 'closed') - 0.1,
  b9: S(9) - 0.05, dom9: wt(9, 'dominoes') - 0.1,
  wipe1: S(10) - 0.45, ai: wt(10, 'A.I.') - 0.1, slid: wt(10, 'slid') - 0.1, billions: wt(10, 'billions') - 0.1, left: wt(10, 'left') - 0.1, funds: wt(10, 'funds') - 0.1,
  wipe2: S(11) - 0.45, weekend: wt(11, 'weekend') - 0.1, fourteenth: wt(11, 'fourteenth') - 0.1, dom11: wt(11, 'dominoes') - 0.1, fell11: wt(11, 'fell') - 0.1,
  b12: S(12) - 0.05, sank: wt(12, 'sank') - 0.1, p62: wt(12, '$62,000') - 0.1, july: wt(12, 'July') - 0.1,
  b13: S(13) - 0.05, friday: wt(13, 'Friday') - 0.1, twentieth: wt(13, 'twentieth') - 0.1, below: wt(13, 'below') - 0.1, p60: wt(13, '$60,000') - 0.1,
  b14: S(14) - 0.05, p30: wt(14, '30%') - 0.1, month: wt(14, 'month') - 0.1,
  b15: S(15) - 0.05, without: wt(15, 'without') - 0.1, every: wt(15, 'every') - 0.1, coin15: wt(15, 'coin') - 0.1, less: wt(15, 'less') - 0.1,
  b16: S(16) - 0.05, over: wt(16, 'over') - 0.1,
  b17: S(17) - 0.05, story: wt(17, 'story') - 0.15, dom17: wt(17, 'dominoes') - 0.1, borrowed17: wt(17, 'Borrowed') - 0.1, first: wt(17, 'first') - 0.1,
  cta: S(18) - 0.1, decide: wt(18, 'decide') - 0.1, would: wt(18, 'Would') - 0.1, sold: wt(18, 'sold') - 0.1, held: wt(18, 'held') - 0.1, comment: wt(18, 'Comment') - 0.15, sell: wt(18, 'SELL') - 0.2, hold: wt(18, 'HOLD') - 0.1,
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
const SKY = [[0, 'NIGHT'], [T.b2 + 0.1, 'NIGHT'], [T.b2 + 1.3, 'GOLDEN'], [T.b3 + 0.8, 'MORN'], [T.b4 + 0.4, 'MORN'], [T.b5, 'DAY'], [T.wipe1 + 0.15, 'DAY'], [T.wipe1 + 1.0, 'SUNSET'],
  [T.wipe2 + 0.15, 'SUNSET'], [T.wipe2 + 1.0, 'NIGHT'], [T.july + 0.2, 'NIGHT'], [T.friday, 'DAWN'], [T.p60, 'MORN'], [T.b15, 'DAY'], [T.b16 - 0.2, 'DAY'], [T.b17 + 0.6, 'GOLDEN'], [T.cta - 0.2, 'SUNSET'], [T.cta + 1.6, 'DUSK'], [DUR + 2, 'DUSK']];
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

// ───────────────────────── ground, roads
const ground = new THREE.Mesh(new THREE.PlaneGeometry(1400, 1400).rotateX(-Math.PI / 2), new THREE.MeshLambertMaterial({ color: 0xBFC2A8 })); ground.receiveShadow = true; scene.add(ground);
const flat = new GB();
flat.box(1400, 0.04, 8, 0x4A4E56, 0, 0.02, 34); flat.box(1400, 0.04, 8, 0x4A4E56, 0, 0.021, -34);   // avenues along the hill
for (let x = -690; x < 690; x += 6) { flat.box(2.6, 0.05, 0.22, 0xF2EEE2, x, 0.045, 34); flat.box(2.6, 0.05, 0.22, 0xF2EEE2, x, 0.046, -34); }
flat.box(8, 0.04, 400, 0x4A4E56, -40, 0.022, 60); flat.box(8, 0.04, 400, 0x4A4E56, 124, 0.023, 60);
flat.box(70, 0.06, 50, 0xE6DFD0, 0, 0.03, 112);                                                   // the plaza in front of the funds building
for (let i = 0; i < 12; i++) flat.box(70, 0.065, 0.12, 0xD6CEBC, 0, 0.034, 90 + i * 4);
flat.box(150, 0.05, 30, 0x8DAE74, 50, 0.025, 0);                                                  // grass under the hill
{ const rr = rng(404); for (let i = 0; i < 60; i++) { const x = (rr() - 0.5) * 520, z = -200 + rr() * 420; if ((x > -36 && x < 140 && Math.abs(z) < 30) || (Math.abs(x) < 40 && z > 82 && z < 140)) continue; flat.box(6 + rr() * 14, 0.06, 6 + rr() * 14, rr() < 0.5 ? 0x8DAE74 : 0x9DB884, x, 0.03, z); } }
const flatM = flat.mesh(); flatM.castShadow = false; scene.add(flatM);

// ───────────────────────── the hill: a platform on top, then a long stepped slope down to the street (the domino run)
const HT = 14, RL = 96, HW = 12;
const yAt = x => x <= 0 ? HT : x >= RL ? 0 : HT * (1 - (Math.floor(x / 2) * 2 + 1) / RL);   // top of the step under x
const zAt = x => x <= 0 ? 0 : 5.2 * Math.sin(x / RL * Math.PI * 1.35);
const stat = [];
{
  const g = new GB();
  g.box(20, HT, HW * 2, 0xD6CDB8, -10, HT / 2, 0); g.box(20.4, 0.4, HW * 2 + 0.4, 0xEDE6D6, -10, HT + 0.2 - 0.38, 0);
  for (let k = 0; k < RL / 2; k++) { const y = HT * (1 - (2 * k + 1) / RL); g.box(2.02, y, HW * 2, k % 2 ? 0xD9D1BE : 0xD0C7B2, 2 * k + 1, y / 2, 0); g.box(2.02, 0.12, HW * 2 + 0.3, 0xEFE8D8, 2 * k + 1, y - 0.04, 0); }
  for (const s of [-1, 1]) for (let k = 0; k < 12; k++) g.box(0.3, 0.9, 0.3, 0xBDB39E, -19 + k * 1.6, HT + 0.45, s * (HW - 0.2));   // railing posts on the platform
  const m = g.mesh(); scene.add(m);
  stat.push([-20, 0, -HW, HW, HT, 'platform']); for (let x = 0; x < RL; x += 8) stat.push([x, x + 8, -HW, HW, yAt(x), 'slope']);
}
// price lines painted across the slope (they glow at night)
const lineM = new THREE.MeshLambertMaterial({ color: 0xFFE2A0, emissive: 0xF7A600, emissiveIntensity: 0.4 });
const XD = i => i === 0 ? -1.4 : 0.9 + (i - 1) * 2.1;              // domino positions along the run
const LINES = [{ p: '≈ $62,000 · lowest since July', x: XD(37) + 1.05, low: true }, { p: '$60,000', x: XD(40) + 1.05 }];
LINES.forEach(L => { const m = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.08, HW * 2 - 0.6), lineM); m.position.set(L.x, yAt(L.x) + 0.02, 0); scene.add(m); });

// ───────────────────────── the dominoes: every one is a bet made with borrowed money (gold foot = the trader's own 10%, blue = borrowed 90%)
const ND = 43, DH = 3.4, DT = 0.5;
const DOM = new THREE.InstancedMesh(domino(), MAT, ND); DOM.castShadow = true; DOM.receiveShadow = true; DOM.frustumCulled = false; scene.add(DOM);
const DIR = i => { const x = XD(i), d = 0.6; return Math.atan2(zAt(x + d) - zAt(x - d), 2 * d); };
const TH = Array.from({ length: ND + 1 }, () => 0);
// fall times: the hook (a flash-forward of the whole run), then the story (her bet, the next, the weekend, Friday)
const HOOK0 = 1.0, HOOKDT = (T.b2 - 1.6 - HOOK0) / ND;
const K62 = 37;
const tFall = i => i === 0 ? T.auto + 0.35 : i === 1 ? T.next + 0.1 : i <= 5 ? T.dom9 - 0.35 + (i - 2) * 0.22 : i <= K62 ? T.dom11 - 0.15 + (i - 6) * (T.july + 0.3 - T.dom11) / (K62 - 6) : T.below - 0.7 + (i - K62 - 1) * 0.3;
const FALLD = 0.42, MAXA = 1.25;
function fallA(u, last) { return (last ? 1.5 : MAXA) * u * u; }
function angleOf(i, t) {
  if (t < T.b2 + 1.3 && i > 0) {                                   // the flash-forward, then the rewind (they stand back up)
    const th = HOOK0 + (i - 1) * HOOKDT, a = fallA(seg(t, th, th + FALLD), i === ND);
    return t < T.b2 ? a : a * (1 - eio(seg(t, T.b2 + 0.05, T.b2 + 1.25)));
  }
  return fallA(seg(t, tFall(i), tFall(i) + FALLD), i === ND);
}
const _m = new THREE.Matrix4(), _r = new THREE.Matrix4(), _t = new THREE.Matrix4();
function domMatrix(i, a, out) { const x = XD(i), y = yAt(x), z = zAt(x); out.makeTranslation(x, y, z).multiply(_r.makeRotationY(-DIR(i))).multiply(_t.makeTranslation(DT / 2, 0, 0)).multiply(_r.makeRotationZ(-a)).multiply(_t.makeTranslation(-DT / 2, 0, 0)); return out; }
const domTop = (i, t) => { const a = angleOf(i, t), x = XD(i); return [x + Math.sin(a) * DH * 0.6, yAt(x) + Math.cos(a) * DH * 0.6, zAt(x)]; };
for (let i = 1; i <= ND; i++) stat.push([XD(i) - 0.5, XD(i) + 0.5, zAt(XD(i)) - 1.2, zAt(XD(i)) + 1.2, yAt(XD(i)) + DH, 'domino']);
// front of the falling wave (for the camera)
function waveX(t) { let k = 1; for (let i = 1; i <= ND; i++) if (angleOf(i, t) > 0.05) k = i; return XD(k); }

// her domino (index 0): built in front of us — her gold $100 first, then nine borrowed blue coins on top
const HER = XD(0);
const herDom = new THREE.Group(); scene.add(herDom);
const herGoldM = new THREE.MeshLambertMaterial({ color: 0xF2B53A, emissive: 0x7A4A00, emissiveIntensity: 0.35 });
const herGold = new THREE.Mesh(new THREE.BoxGeometry(DT, DH * 0.1, 2.0).translate(0, DH * 0.05, 0), herGoldM); herGold.castShadow = true;
const herBlue = new THREE.Mesh(domino({ blueOnly: true }), MAT); herBlue.castShadow = true;
const herPiv = new THREE.Group(); herPiv.position.set(DT / 2, 0, 0); const herIn = new THREE.Group(); herIn.position.set(-DT / 2, 0, 0); herPiv.add(herIn); herIn.add(herGold, herBlue); herDom.add(herPiv);
herDom.position.set(HER, HT, 0);
const coinGeo = BIGCOIN(0.5, 0.16);
const goldCoinM = new THREE.MeshLambertMaterial({ color: 0xF7B500, emissive: 0xA86A00, emissiveIntensity: 0.5 });
const blueCoinM = new THREE.MeshLambertMaterial({ color: 0x4F86D9, emissive: 0x1A3A80, emissiveIntensity: 0.45 });
const herCoin = new THREE.Mesh(coinGeo, goldCoinM); herCoin.castShadow = true; scene.add(herCoin);
const blueCoins = Array.from({ length: 9 }, () => { const m = new THREE.Mesh(coinGeo, blueCoinM); m.castShadow = true; scene.add(m); return m; });
// her, the lender's kiosk with its arm, the big SELL button nobody pressed
const her = person({ robe: 0xC8423A, skin: SKIN[3], hair: 0x3A2418, shirt: 0xF4F2EC, dress: true, s: 1.05 }); scene.add(her);
const HERP = [HER - 1.6, HT, 2.3];
const KI = [-9.5, HT, -0.2];
const kio = kiosk(); kio.position.set(KI[0], KI[1], KI[2]); scene.add(kio);
const kioCv = document.createElement('canvas'); kioCv.width = 512; kioCv.height = 140; const kioTx = new THREE.CanvasTexture(kioCv); kioTx.colorSpace = THREE.SRGBColorSpace;
const kioSign = new THREE.Mesh(new THREE.PlaneGeometry(2.8, 0.76), new THREE.MeshLambertMaterial({ map: kioTx })); kioSign.position.set(KI[0] + 1.58, HT + 3.45, KI[2]); kioSign.rotation.y = Math.PI / 2; scene.add(kioSign);
const lenderP = person({ robe: 0x2F3A55, skin: SKIN[1], short: 0x2A2020, shirt: 0xF4F2EC, tie: 0x2F6FB8, s: 1.0 }); lenderP.position.set(KI[0] - 0.6, HT, KI[2]); scene.add(lenderP);
const armM = new THREE.MeshLambertMaterial({ color: 0x8A8F96 });
const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 1, 8).rotateZ(Math.PI / 2).translate(0.5, 0, 0), armM); arm.castShadow = true; scene.add(arm);
const paw = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.9, 0.9), new THREE.MeshLambertMaterial({ color: 0xC8423A })); paw.castShadow = true; scene.add(paw);
const BTN = [-4.2, HT, 4.6];
const btn = bigButton(); btn.position.set(BTN[0], BTN[1], BTN[2]); scene.add(btn);
stat.push([KI[0] - 2, KI[0] + 2, KI[2] - 1.8, KI[2] + 1.8, HT + 3.8, 'kiosk']);
// traders along the run, each beside a domino; they jump when theirs falls
const TR_I = [3, 8, 12, 17, 21, 25, 30, 34, 39, 42];
const traders = TR_I.map((i, k) => { const m = person({ robe: [0x34405A, 0x6A2E3E, 0x3F6A5A, 0x5A5A66, 0x7A5A3A, 0x2F4A6A, 0x8A3A3A][k % 7], skin: SKIN[k % 5], short: [0x231C18, 0x5A3E28, 0xC9A27A, 0x3A2A1E, 0x8A8A8A][k % 5], shirt: k % 2 ? 0xF4F2EC : undefined, s: 0.95 }); scene.add(m); const x = XD(i) - 0.6, side = k % 2 ? 1 : -1; return { m, i, x, z: zAt(x) + side * 2.1, side }; });
// the price board on the platform
const SCR = [-13.5, HT, -8.5], SCR_RY = 0.42, SCRH = 9.5;
const pylon = new THREE.Group(); { const b = new GB(); b.box(1.6, SCRH, 1.4, 0x3A4048, 0, SCRH / 2, -0.9); b.box(9.4, 7.2, 0.7, 0x23272E, 0, SCRH + 2.4, 0); b.box(9.8, 0.4, 1.0, 0x8A8F96, 0, SCRH + 6.1, 0); b.box(9.8, 0.4, 1.0, 0x8A8F96, 0, SCRH - 1.3, 0); pylon.add(b.mesh()); }
pylon.position.set(SCR[0], SCR[1], SCR[2]); pylon.rotation.y = SCR_RY; scene.add(pylon);
const scrCv = document.createElement('canvas'); scrCv.width = 720; scrCv.height = 560; const scrTx = new THREE.CanvasTexture(scrCv); scrTx.colorSpace = THREE.SRGBColorSpace; scrTx.anisotropy = 4;
const screen = new THREE.Mesh(new THREE.PlaneGeometry(8.8, 6.84), new THREE.MeshBasicMaterial({ map: scrTx, toneMapped: false })); screen.position.set(0, SCRH + 2.4, 0.37); pylon.add(screen);
const SCRW = (dy = 0) => { const c = Math.cos(SCR_RY), s = Math.sin(SCR_RY); return [SCR[0] + 0.37 * s, SCR[1] + SCRH + 2.4 + dy, SCR[2] + 0.37 * c]; };
stat.push([SCR[0] - 5, SCR[0] + 5, SCR[2] - 3, SCR[2] + 3, HT + SCRH + 6.4, 'screen']);
// people who bought without borrowing: they hold their own gold coins at the foot of the hill
const HOLD = [[100.5, 0, 7.2], [102.4, 0, 9.0], [104.6, 0, 7.6]];
const holders = HOLD.map(([x, y, z], k) => { const m = person({ robe: [0x4C9A62, 0x7A4FA0, 0xE09A2B][k], skin: SKIN[[2, 4, 1][k]], short: k === 1 ? undefined : 0x3A2A1E, hair: k === 1 ? 0x5A3A22 : undefined, dress: k === 1, s: [1.0, 0.98, 0.78][k] }); m.position.set(x, y, z); m.rotation.y = -0.45 - k * 0.12; scene.add(m); return m; });
const holdCoins = HOLD.map(() => { const m = new THREE.Mesh(coinGeo, goldCoinM.clone()); m.castShadow = true; scene.add(m); return m; });

// ───────────────────────── the city: towers all around (the hill and the plaza stay clear)
const TOWERS = [];
{
  const tr = rng(2026), PAL = [[0xD9D3C6, 0x5E7F9A], [0x6D97AA, 0x3F6A80], [0xE4DED2, 0x4E7C93], [0xC9C2B4, 0x55748C], [0x8FB3C2, 0x426E86], [0xEFE9DC, 0x6A8AA4], [0xB7C4C9, 0x3E6378], [0xE8D9C0, 0x5A7A90]];
  const clear = (x, z) => (x > -34 && x < 132 && Math.abs(z) < 30) || (Math.abs(x) < 42 && z > 58 && z < 178) || Math.abs(z - 34) < 8 || Math.abs(z + 34) < 8 || Math.abs(x + 40) < 8 || Math.abs(x - 124) < 8;
  for (let gx = -190; gx <= 250; gx += 22) for (let gz = -200; gz <= 200; gz += 22) {
    const x = gx + (tr() - .5) * 7, z = gz + (tr() - .5) * 7; if (clear(x, z) || tr() < 0.12) continue;
    const w = 9 + tr() * 7, d = 9 + tr() * 7, dp = Math.hypot(x - 40, z), far = dp > 140;
    const h = (dp < 90 ? 16 + tr() * 22 : 24 + tr() * (far ? 50 : 36));
    const pal = PAL[Math.floor(tr() * PAL.length)];
    const g = tower(w, h, d, { rand: tr, color: pal[0], glass: pal[1], floor: far ? 4.2 : 3.4, litP: 0.5, crown: h > 50 && tr() < 0.5 });
    g.position.set(x, 0, z); g.rotation.y = (tr() < 0.5 ? 0 : Math.PI / 2); g.children.forEach(c => { c.castShadow = dp < 150; c.receiveShadow = true; }); scene.add(g);
    TOWERS.push(g); stat.push([x - Math.max(w, d) / 2, x + Math.max(w, d) / 2, z - Math.max(w, d) / 2, z + Math.max(w, d) / 2, h + 4, 'tower']);
  }
}
const lampHeads = new GB();
for (let x = -30; x <= 130; x += 16) for (const z of [29.2, -29.2]) { const l = lamp(6.2); l.position.set(x, 0, z); l.rotation.y = z > 0 ? -Math.PI / 2 : Math.PI / 2; scene.add(l); lampHeads.box(0.5, 0.08, 0.3, 0xFFFFFF, x, 5.98, z + (z > 0 ? 1.25 : -1.25)); }
const lampM = new THREE.MeshLambertMaterial({ color: 0xFFF1C8, emissive: 0xFFD27A, emissiveIntensity: 0 }); scene.add(new THREE.Mesh(lampHeads.geo(), lampM));
const CARS = [[0xC8423A, 32, 1, 7.5, 0], [0x2F6FB8, 36, -1, 9.0, 40], [0xE9C46A, -36, 1, 6.2, 150], [0x4C9A62, -32, -1, 8.0, 230], [0xEDEDED, 32, 1, 8.6, 300], [0x7A4FA0, -36, -1, 7.0, 90]].map(([col, z, dir, v, off]) => { const m = car(col); scene.add(m); return { m, z, dir, v, off }; });
const trees = []; for (const [x, z] of [[-26, 18], [-28, -16], [121, 23], [116, -14], [-30, 94], [30, 96], [-30, 128], [30, 128], [70, 22], [40, -22], [10, 22], [86, -21]]) { const m = bushTree(5.5 + R() * 2, R); m.position.set(x, 0, z); scene.add(m); trees.push(m); }

// ───────────────────────── the plaza: a fund building that money walks out of; a tower screen with the A.I. stocks
const PL = [0, 0, 100];
const bk = bank(); bk.position.set(PL[0], 0, PL[2]); scene.add(bk);
stat.push([PL[0] - 13, PL[0] + 13, PL[2] - 8, PL[2] + 8, 15, 'bank']);
const bankCv = document.createElement('canvas'); bankCv.width = 1024; bankCv.height = 128; const bankTx = new THREE.CanvasTexture(bankCv); bankTx.colorSpace = THREE.SRGBColorSpace;
const bankSign = new THREE.Mesh(new THREE.PlaneGeometry(16, 2.5 * 0.8), new THREE.MeshLambertMaterial({ map: bankTx })); bankSign.position.set(PL[0], bk.userData.signY, PL[2] + bk.userData.signZ); scene.add(bankSign);
const NCF = 70, flyCoins = new THREE.InstancedMesh(coinGeo, goldCoinM, NCF); flyCoins.castShadow = true; flyCoins.frustumCulled = false; scene.add(flyCoins);
const FLY = Array.from({ length: NCF }, (_, i) => ({ t0: T.billions - 0.5 + i * 0.045 + R() * 0.1, a: (R() - 0.5) * 1.6, v: 9 + R() * 6, up: 7 + R() * 6, sp: R() * 6.28 }));
const AIS = [PL[0] + 8, 21, PL[2] - 24];
const aiCv = document.createElement('canvas'); aiCv.width = 512; aiCv.height = 384; const aiTx = new THREE.CanvasTexture(aiCv); aiTx.colorSpace = THREE.SRGBColorSpace;
{ const tw = tower(12, 27, 12, { rand: rng(77), color: 0x6D97AA, glass: 0x3F6A80, litP: 0.5 }); tw.position.set(AIS[0], 0, AIS[2] - 6.4); scene.add(tw); stat.push([AIS[0] - 7, AIS[0] + 7, AIS[2] - 13, AIS[2] + 1, 31, 'ai tower']); }
const aiScr = new THREE.Mesh(new THREE.PlaneGeometry(10, 7.5), new THREE.MeshBasicMaterial({ map: aiTx, toneMapped: false })); aiScr.position.set(AIS[0], AIS[1], AIS[2] + 0.1); scene.add(aiScr);
const crowd = [[-8, 116], [-4, 118], [5, 117], [9, 115], [-12, 120], [13, 119]].map(([dx, dz], k) => { const m = person({ robe: [0x34405A, 0x6A2E3E, 0x3F6A5A, 0x5A5A66, 0x7A5A3A, 0x2F4A6A][k], skin: SKIN[k % 5], short: [0x231C18, 0x5A3E28, 0xC9A27A, 0x3A2A1E, 0x8A8A8A][k % 5], s: 0.98 }); m.position.set(PL[0] + dx, 0, dz); m.rotation.y = Math.PI / 2 + (R() - 0.5) * 0.6; scene.add(m); return m; });

// ───────────────────────── sky clutter: clouds, birds, sparkles
const clouds = []; for (let i = 0; i < 18; i++) { const m = cloud(R); const far = i >= 10; m.position.set(far ? -500 + R() * 1000 : -220 + i * 52 + R() * 20, 70 + R() * 40, far ? -520 + R() * 200 : -320 + R() * 300); m.scale.setScalar(2.0 + R() * 2.2); m.userData.x0 = m.position.x; scene.add(m); clouds.push(m); }
for (const [x, y, z, k] of [[20, 74, 160, 2.4], [-30, 80, 210, 2.8]]) { const m = cloud(R); m.position.set(x, y, z); m.scale.setScalar(k); m.userData.x0 = x; scene.add(m); clouds.push(m); }
const birdMat = new THREE.MeshBasicMaterial({ color: 0x2A2430, side: THREE.DoubleSide });
const wingG = new THREE.BufferGeometry(); wingG.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0.1, 1.6, 0, -0.3, 1.5, 0, 0.5], 3));
const FLOCK = [{ t0: T.b2 + 1.0, t1: T.b4, a: [-40, 30, 30], b: [60, 36, -30] }, { t0: T.wipe1 + 1.0, t1: T.wipe2 - 0.2, a: [-40, 22, 120], b: [40, 30, 80] }, { t0: T.b15 - 0.5, t1: T.cta, a: [60, 30, 30], b: [140, 40, -40] }];
const birds = []; for (let i = 0; i < 9; i++) { const g = new THREE.Group(), l = new THREE.Mesh(wingG, birdMat), r = new THREE.Mesh(wingG, birdMat); r.scale.x = -1; g.add(l, r); g.userData = { l, r, ph: R() * 6 }; g.visible = false; g.scale.setScalar(1.1); scene.add(g); birds.push(g); }
function updateBirds(t) {
  const f = FLOCK.find(f => t >= f.t0 && t <= f.t1); for (const b of birds) b.visible = !!f; if (!f) return;
  const u = seg(t, f.t0, f.t1), dx = f.b[0] - f.a[0], dz = f.b[2] - f.a[2], L = Math.hypot(dx, dz), ux = dx / L, uz = dz / L;
  birds.forEach((b, i) => { const row = Math.ceil(i / 2), sd = i % 2 ? 1 : -1; b.position.set(lerp(f.a[0], f.b[0], u) - ux * row * 2.4 + uz * sd * row * 1.7, lerp(f.a[1], f.b[1], u) + Math.sin(t * 2 + b.userData.ph) * 0.5, lerp(f.a[2], f.b[2], u) - uz * row * 2.4 - ux * sd * row * 1.7); b.rotation.y = Math.atan2(ux, uz); const fl = Math.sin(t * 10 + b.userData.ph) * 0.65; b.userData.l.rotation.z = fl; b.userData.r.rotation.z = -fl; });
}
const sparkT = (() => { const cv = document.createElement('canvas'); cv.width = cv.height = 64; const g = cv.getContext('2d'); g.translate(32, 32); g.fillStyle = '#fff'; for (let k = 0; k < 2; k++) { g.rotate(Math.PI / 2 * k); g.beginPath(); g.moveTo(0, -30); g.quadraticCurveTo(3, -3, 30, 0); g.quadraticCurveTo(3, 3, 0, 30); g.quadraticCurveTo(-3, 3, -30, 0); g.quadraticCurveTo(-3, -3, 0, -30); g.fill(); } const tx = new THREE.CanvasTexture(cv); tx.colorSpace = THREE.SRGBColorSpace; return tx; })();
const sparks = []; for (let i = 0; i < 40; i++) { const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: sparkT, color: 0xFFE9A8, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false })); sp.userData = { ph: R() * 6.28, w: 3 + R() * 4 }; scene.add(sp); sparks.push(sp); }
const dust = []; for (let i = 0; i < 26; i++) { const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: radial('rgba(240,232,214,0.75)', 'rgba(240,232,214,0)'), transparent: true, depthWrite: false, toneMapped: false })); sp.visible = false; scene.add(sp); dust.push(sp); }

// ───────────────────────── canvases
const F = (w, px, fam) => `${w} ${px}px ${fam}`;
function drawStatic() {
  { const g = kioCv.getContext('2d'); g.fillStyle = '#2F3A55'; g.fillRect(0, 0, 512, 140); g.fillStyle = '#FFF6E6'; g.font = F(900, 92, 'Figtree'); g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('LENDER', 256, 74); kioTx.needsUpdate = true; }
  { const g = bankCv.getContext('2d'); g.fillStyle = '#F2EAD8'; g.fillRect(0, 0, 1024, 128); g.fillStyle = '#2E3A52'; g.font = F(900, 84, 'Fraunces'); g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('BITCOIN FUNDS', 512, 68); bankTx.needsUpdate = true; }
}
let aiKey = '';
function drawAI(t) {
  const u = seg(t, T.ai, T.slid + 0.8), key = 'a' + Math.round(u * 30); if (key === aiKey) return; aiKey = key;
  const g = aiCv.getContext('2d'); g.fillStyle = '#0B1020'; g.fillRect(0, 0, 512, 384);
  g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#FFD27A'; g.font = F(800, 46, 'Inter'); g.fillText('A.I. STOCKS', 256, 56);
  const pts = [[40, 150], [120, 140], [190, 165], [260, 150], [330, 230], [400, 270], [470, 330]], n = pts.length - 1, k = Math.min(n - 1, Math.floor(lerp(0.4, 1, u) * n)), v = lerp(0.4, 1, u) * n - k;
  g.strokeStyle = u > 0.4 ? '#FF6B5B' : '#F7B500'; g.lineWidth = 12; g.lineJoin = 'round'; g.lineCap = 'round'; g.beginPath(); g.moveTo(...pts[0]); for (let i = 1; i <= k; i++) g.lineTo(...pts[i]); g.lineTo(lerp(pts[k][0], pts[k + 1][0], v), lerp(pts[k][1], pts[k + 1][1], v)); g.stroke();
  if (u > 0.6) { g.fillStyle = '#FF6B5B'; g.font = F(900, 90, 'Figtree'); g.fillText('▼', 430, 150); }
  aiTx.needsUpdate = true;
}
// the price board on the platform: one canvas, redrawn only when what it shows changes
let scrKey = '';
const fmt = n => '$' + Math.round(n).toLocaleString('en-US');
function scrMode(t) {   // (the 'night' and 'fri' modes switch on word times, so their key includes them)
  if (t < T.b2 - 0.1) return ['hook', seg(t, 0.8, T.day1 + 0.5), 0];
  if (t < T.b6) return ['oct', seg(t, T.b2 + 0.6, T.p85 + 0.4), 0];
  if (t < T.b8) return ['drop', seg(t, T.falls6 - 0.1, T.p10 + 0.6), 0];
  if (t < T.wipe1 + 0.5) return ['lower', seg(t, T.sale, T.next + 0.5), 0];
  if (t < T.b13) return ['night', seg(t, T.dom11, T.p62 + 0.4), 0];
  if (t < T.cta) return ['fri', seg(t, T.below - 0.2, T.p60 + 0.4), 0];
  return ['cta', seg(t, T.would, T.would + 0.6), 0];
}
function drawScreen(t) {
  const [mode, a] = scrMode(t), key = mode + Math.round(a * 30) + (t > T.p62 - 0.1 ? 'p' : '') + (t > T.below ? 'b' : '');
  if (key === scrKey) return; scrKey = key;
  const g = scrCv.getContext('2d'), w = 720, h = 560;
  g.fillStyle = '#0B1020'; g.fillRect(0, 0, w, h);
  g.strokeStyle = 'rgba(255,255,255,0.07)'; g.lineWidth = 2; for (let i = 1; i < 6; i++) { g.beginPath(); g.moveTo(0, i * h / 6); g.lineTo(w, i * h / 6); g.stroke(); }
  g.textAlign = 'center'; g.textBaseline = 'middle';
  const head = s => { g.fillStyle = '#FFD27A'; g.font = F(800, 38, 'Inter'); g.fillText(s, 360, 54); };
  const big = (s, col = '#FFFFFF', px = 120) => { g.fillStyle = col; g.font = F(800, px, 'JBM'); g.fillText(s, 360, 230); };
  const small = (s, col = 'rgba(255,255,255,0.75)') => { g.fillStyle = col; g.font = F(700, 34, 'Inter'); g.fillText(s, 360, 340); };
  const line = (pts, u, col) => { const n = pts.length - 1, k = Math.min(n - 1, Math.floor(u * n)), v = u * n - k; g.strokeStyle = col; g.lineWidth = 12; g.lineJoin = 'round'; g.lineCap = 'round'; g.beginPath(); g.moveTo(...pts[0]); for (let i = 1; i <= k; i++) g.lineTo(...pts[i]); g.lineTo(lerp(pts[k][0], pts[k + 1][0], v), lerp(pts[k][1], pts[k + 1][1], v)); g.stroke(); };
  if (mode === 'hook') { head('ONE DAY · NOV 2026'); big('$' + (2.02 * eo(a)).toFixed(2) + 'B', '#FF8A6B', 116); small('BETS CLOSED BY FORCE'); line([[60, 420], [200, 440], [340, 470], [480, 500], [660, 540]], 0.15 + 0.85 * a, '#FF6B5B'); }
  else if (mode === 'oct') { head('BITCOIN · ONE COIN'); if (a > 0.05) big('≈ $85,000', '#FFFFFF', 104); small('EARLY OCTOBER 2026'); line([[60, 500], [200, 470], [340, 450], [480, 430], [660, 410]], 1, '#7FD08A'); }
  else if (mode === 'drop') { head('PICTURE · −10%'); big(fmt(lerp(85000, 76500, eo(a))), a > 0.5 ? '#FF6B5B' : '#FFFFFF'); small(a > 0.5 ? '−10% · HER $100 IS GONE' : 'SHE BOUGHT AT $85,000', a > 0.5 ? '#FF8A6B' : 'rgba(255,255,255,0.75)'); line([[60, 420], [260, 430], [460, 470], [660, 520]], 0.2 + 0.8 * a, a > 0.5 ? '#FF6B5B' : '#F7B500'); }
  else if (mode === 'lower') { head('PICTURE · FORCED SALES'); g.fillStyle = '#FF6B5B'; g.font = F(900, 150, 'Figtree'); g.fillText('▼', 360, 220); small('EACH SALE PUSHES IT LOWER', '#FF8A6B'); line([[60, 400], [200, 430], [340, 470], [480, 500], [660, 540]], 0.3 + 0.7 * a, '#FF6B5B'); }
  else if (mode === 'night') { head('BITCOIN · 14–15 NOV 2026'); if (t > T.p62 - 0.1) { big('≈ $62,000', '#FF8A6B', 104); small('LOWEST SINCE JULY'); } else { g.fillStyle = '#FF6B5B'; g.font = F(900, 150, 'Figtree'); g.fillText('▼', 360, 220); small('THE WEEKEND'); } }
  else if (mode === 'fri') { head('BITCOIN · FRI 20 NOV 2026'); if (t > T.below) { big('< $60,000', '#FF8A6B', 104); small('LOW ≈ $58,800 · FIRST SINCE JULY'); } else { big('≈ $62,000', '#FFFFFF', 104); small('EARLY ON FRIDAY'); } }
  else { g.font = F(900, 150, 'Figtree'); g.fillStyle = '#F7B500'; g.fillText('SELL', 360, 150); g.fillStyle = '#6FD0C0'; g.fillText('HOLD', 360, 420); g.fillStyle = '#FFFFFF'; g.font = F(800, 60, 'Inter'); g.fillText('or', 360, 285); }
  scrTx.needsUpdate = true;
}

// ───────────────────────── camera path (spherical keys around a target; `up` tilts the view so the subject sits lower in the frame)
const WAVE = (dy = 1.5, dx = 0) => t => { const x = waveX(t) + dx; return [x, yAt(x) + dy, zAt(x)]; };
const HERF = [HER - 0.6, HT + 1.7, 0.8];
const CAM = [
  { t: 0, tg: [6, HT - 1, 0], d: 46, az: -64, el: 26, up: 0.03 },                                      // night: the run, seen from behind the top (the SELL button in front)
  { t: T.b2 - 0.6, tg: [11, HT - 2, 0], d: 44, az: -62, el: 24, up: 0.03, mv: 1 },                        // a slow push while the wave runs away down the hill
  { t: T.b2 + 1.3, tg: SCRW(0), d: 30, az: 24, el: 10, up: 0.0, mv: 1 },                                  // rewind to October: the price board
  { t: T.p85 + 0.6, tg: SCRW(-0.3), d: 28, az: 22, el: 9, up: 0.0 },
  { t: T.b3 + 0.9, tg: [34, HT - 4, 0], d: 58, az: 58, el: 22, up: 0.03, mv: 1 },                        // many traders, many borrowed bets
  { t: T.b4 - 0.1, tg: [30, HT - 4, 0], d: 56, az: 50, el: 21, up: 0.03 },
  { t: T.p100a + 0.2, tg: [-3.4, HT + 1.7, 1.4], d: 13, az: 62, el: 9, up: 0.04, mv: 1 },                 // picture one of them
  { t: T.b5 + 0.2, tg: [-4.0, HT + 1.8, 0.8], d: 15, az: 64, el: 10, up: 0.04 },
  { t: T.p1000 + 0.3, tg: [-3.6, HT + 2.2, 0.6], d: 16, az: 60, el: 11, up: 0.04, mv: 1 },
  { t: T.falls6 - 0.1, tg: [-2.2, HT + 1.6, 0.8], d: 12.5, az: 50, el: 9, up: 0.03, mv: 1 },               // the gold foot drains
  { t: T.gone + 0.3, tg: [-2.0, HT + 1.5, 0.8], d: 12, az: 48, el: 9, up: 0.03 },
  { t: T.lender + 0.1, tg: [-5.0, HT + 2.0, 0], d: 21, az: 18, el: 10, up: 0.03, mv: 1 },                   // the lender's arm pushes (side view: kiosk left, her bet right)
  { t: T.auto + 0.6, tg: [-3.5, HT + 2.0, 0], d: 20.5, az: 20, el: 10, up: 0.03 },
  { t: T.next + 0.1, tg: [0.8, HT + 1.2, 0], d: 15, az: 22, el: 13, up: 0.04, mv: 1 },                      // …into the next one
  { t: T.dom9 + 0.1, tg: [7, HT - 1.2, 0], d: 28, az: 38, el: 18, up: 0.04, mv: 1 },                        // like dominoes
  { t: T.wipe1 - 0.7, tg: [8, HT - 1.4, 0], d: 29, az: 40, el: 19, up: 0.12 },
  { t: T.wipe1 + 0.4, tg: [8, HT - 1.4, 0], d: 29, az: 40, el: 19, up: 1.4, mv: 1 },                        // sky wipe → the plaza: tilt up into the sky…
  { t: T.wipe1 + 0.7, tg: [8, 50, 40], d: 60, az: 20, el: 40, up: 1.4 },                                      // …rise and travel high through the clouds…
  { t: T.wipe1 + 1.0, tg: [PL[0], 50, PL[2] - 20], d: 60, az: -4, el: 40, up: 1.4 },
  { t: T.slid, tg: [PL[0] + 2, 13, PL[2]], d: 56, az: -4, el: 8, up: 0.05, mv: 1 },                           // …and come down over the plaza
  { t: T.billions, tg: [PL[0], 10, PL[2] + 4], d: 52, az: -2, el: 9, up: 0.05, mv: 1 },
  { t: T.wipe2 - 0.6, tg: [PL[0], 10, PL[2] + 4], d: 50, az: 0, el: 10, up: 0.12 },
  { t: T.wipe2 + 0.4, tg: [PL[0], 10, PL[2] + 4], d: 50, az: 0, el: 10, up: 1.3, mv: 1 },                     // sky wipe → the hill at night (tilt up, travel high, come down)
  { t: T.wipe2 + 0.65, tg: [PL[0], 50, PL[2] - 40], d: 60, az: 10, el: 40, up: 1.3 },
  { t: T.wipe2 + 0.85, tg: [20, 50, 10], d: 60, az: 36, el: 40, up: 1.3 },
  { t: T.fourteenth + 0.2, tg: WAVE(1.0, 3), d: 34, az: 36, el: 24, up: 0.03, mv: 1 },                           // the weekend: the wave runs down the hill
  { t: T.july + 0.3, tg: WAVE(1.0, 3), d: 36, az: 44, el: 22, up: 0.03 },
  { t: T.friday + 0.2, tg: [XD(40), 2.4, zAt(XD(40))], d: 30, az: 34, el: 18, up: 0.04, mv: 1 },               // Friday: over the $60,000 line
  { t: T.p30, tg: [XD(41), 2.4, zAt(XD(41))], d: 33, az: 40, el: 18, up: 0.04 },
  { t: T.without - 0.1, tg: [102, 2.0, 8.4], d: 14, az: 58, el: 9, up: 0.05, mv: 1 },                          // the people who did not borrow
  { t: T.less + 0.2, tg: [102, 2.0, 8.4], d: 13.5, az: 66, el: 9, up: 0.05 },
  { t: T.over + 0.6, tg: [48, 12, 0], d: 120, az: 44, el: 32, up: 0.1, mv: 3 },                                // crane up over the hill and the city
  { t: T.cta + 0.1, tg: [40, 12, 0], d: 130, az: 38, el: 31, up: 0.16 },
  { t: T.comment, tg: SCRW(-1.0), d: 32, az: 30, el: 6, up: 0.03, mv: 1 },                                     // the board: SELL or HOLD
  { t: DUR + 0.5, tg: SCRW(-1.0), d: 29, az: 26, el: 6, up: 0.03 },
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
  for (const tw of [T.wipe1, T.wipe2]) [[0.5, -1, 44, 0.9], [0.7, 1, 50, 1.1], [0.9, -1, 48, 1.0], [1.1, 1, 56, 0.9], [1.3, -1, 60, 0.8]].concat(tw === T.wipe2 ? [[0.6, 0, 40, 1.3], [0.8, 0.5, 42, 1.4], [1.0, -0.4, 44, 1.3], [0.75, 0.2, 38, 1.4]] : []).forEach(([dt, side, dist, sc]) => {
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
const hookBoard = mk('board', '<div class="t">Crypto bets closed by force</div><div class="row"><b>$2.02B</b></div><div class="d">in 24 hours · 14–15 Nov 2026</div><div class="src">CoinGlass data via investingLive and The Straits Times</div>');
const tagBtn = mk('tag grey', 'SELL · never pressed');
const tagBorrowed = [0, 1, 2].map(() => mk('tag', 'borrowed'));
const tagHers = mk('tag am', '<b>$100</b> hers'), tagBor = mk('tag', '<b>$900</b> borrowed'), tagBet = mk('tag am', '<b>$1,000</b> of bitcoin');
const worth = mk('worth', '<div class="t">Picture · her bet</div><div class="row"><span class="v1">$1,000</span><span class="arr">→</span><span class="v2">$900</span></div><div class="bar"><div class="fill"></div><div class="gone"></div></div><div class="d">−10% · her $100 is gone</div>'), wFill = worth.querySelector('.fill'), wGone = worth.querySelector('.gone'), wD = worth.querySelector('.d'), wV2 = worth.querySelector('.v2');
const tagAuto = mk('tag am', 'sold for her · automatically'), tagNext = mk('tag', 'next bet closed');
const tagAI = mk('tag', 'A.I. stocks ▼'), tagOut = mk('tag am', 'billions out of bitcoin funds');
const tagLine = LINES.map(L => mk('tag' + (L.low ? ' am' : ''), L.p));
const tagMost = mk('tag grey', 'mostly bets on a rise');
const board = mk('board', '<div class="t">Bitcoin · 20 Nov 2026</div><div class="row"><b>$59,000</b></div><div class="d">below $60,000 · first time since July</div><div class="src">about $59,000 as of 20 Nov · Reuters, FT, CoinGecko</div>');
const tag30 = mk('tag am', '<b>−28%</b> 20 Oct → 20 Nov');
const tagEvery = mk('tag am', 'every coin <b>✓</b>'), tagLess = mk('tag grey', 'worth less');
const title = mk('title', '<div class="s">THE STORY OF</div><div class="n">The Bitcoin\n<em>Dominoes</em></div>');
const lesson = mk('lesson', 'Borrowed bets\n<em>fall first.</em>');
const ctaChip = mk('chip am', 'you decide');
const boxes = [0, 1].map(() => { const e = mk('cbox', '<span class="in"></span><span class="post">Post</span>'); return { e, inn: e.querySelector('.in'), post: e.querySelector('.post') }; });
const foot = document.getElementById('foot');
foot.textContent = 'Sources: Reuters, Financial Times, Cointelegraph, The Straits Times, investingLive, crypto.news\nPrices: CoinGecko · liquidations: CoinGlass · story as of 20 Nov 2026 · not advice';
const setTxt = (e, s) => { if (e.textContent !== s) e.textContent = s; };
const setHTML = (e, s) => { if (e._h !== s) { e._h = s; e.innerHTML = s; } };

function updateUI(t) {
  updateCaption(t);
  foot.style.opacity = (0.95 * seg(t, 0.8, 1.4) * (1 - seg(t, T.cta, T.cta + 0.3) * 0.45)).toFixed(3);
  // 1 — November 2026; $2.02B; never pressed
  { const o = win(t, -1, T.billion - 0.2, 0.5, 0.3); put(yearEl, W / 2, 640, o); put(subEl, W / 2, 780, o * seg(t, 0.4, 0.9)); }
  put(hookBoard, W / 2, 1060, win(t, T.billion, T.never - 0.1, 0.3, 0.25), pop(t, T.billion));
  { const p = proj(BTN[0], BTN[1] + 2.4, BTN[2]); put(tagBtn, clampX(p[0], 230), clampY(p[1] - 20, 600, 1400), p[2] ? win(t, T.never, T.b2 - 0.1, 0.2, 0.25) : 0, pop(t, T.never)); }
  // chips
  let ct = '', co = 0, cp = 0;
  const CH = [[T.nov, T.b2 - 0.2, 'November 2026 · one day'], [T.b2 + 0.4, T.b3 - 0.15, 'early October 2026'], [T.b3 + 0.05, T.b4 - 0.15, 'bets with borrowed money'], [T.b4 + 0.05, T.b6 - 0.15, 'picture a trader'],
    [T.b6 + 0.05, T.b7 - 0.15, 'picture · the price falls 10%'], [T.b7 + 0.05, T.b9 - 0.1, 'a forced sale'], [T.wipe1 + 0.8, T.wipe2 + 0.2, 'November 2026'], [T.wipe2 + 0.8, T.b13 - 0.15, '14–15 Nov 2026 · the weekend'],
    [T.b13 + 0.05, T.b15 - 0.15, 'Friday · 20 Nov 2026'], [T.b15 + 0.05, T.b16 - 0.1, 'bought without borrowing'], [T.b16 + 0.05, T.b17 - 0.1, 'as of 20 Nov 2026']];
  for (const [a, b, s] of CH) { const o = win(t, a, b, 0.22, 0.22); if (o > co) { co = o; ct = s; cp = pop(t, a); } }
  if (ct) setTxt(chip, ct); put(chip, W / 2, 472, co, cp);
  // 3 — borrowed
  [TR_I[1], TR_I[3], TR_I[5]].forEach((i, k) => { const x = XD(i), p = proj(x, yAt(x) + DH + 0.9, zAt(x)); const t0 = T.borrowed3 + k * 0.18; put(tagBorrowed[k], clampX(p[0], 150), clampY(p[1] - 20), p[2] ? win(t, t0, T.b4 - 0.1, 0.15, 0.2) : 0, pop(t, t0)); });
  // 4–8 — her bet
  { const p = proj(HER, HT + 0.4, 1.2); put(tagHers, clampX(p[0], 160), clampY(p[1] + 40), win(t, T.p100a, T.b6 - 0.2, 0.2, 0.25), pop(t, T.p100a)); }
  { const p = proj(KI[0] + 1.2, HT + 4.2, KI[2]); put(tagBor, clampX(p[0], 220), clampY(p[1] - 20), win(t, T.p900, T.b6 - 0.2, 0.2, 0.25), pop(t, T.p900)); }
  { const p = proj(HER, HT + DH + 1.0, 0); put(tagBet, clampX(p[0], 270), clampY(p[1] - 20), win(t, T.p1000, T.b6 - 0.2, 0.2, 0.25), pop(t, T.p1000)); }
  { const u = eo(seg(t, T.falls6, T.p10 + 0.5)); wFill.style.width = (560 * lerp(1, 0.9, u)).toFixed(0) + 'px'; wGone.style.width = (560 * 0.1 * u).toFixed(0) + 'px'; setTxt(wV2, u > 0.5 ? '$900' : '$1,000'); wD.style.opacity = seg(t, T.gone - 0.1, T.gone + 0.2).toFixed(3); put(worth, W / 2, 1150, win(t, T.falls6 - 0.1, T.b7 + 0.2, 0.25, 0.25), pop(t, T.falls6 - 0.1)); }
  { const p = proj(HER - 2.5, HT + 3.6, 0); put(tagAuto, clampX(p[0], 260), clampY(p[1] - 20), win(t, T.auto, T.b8 + 0.4, 0.2, 0.25), pop(t, T.auto)); }
  { const p = proj(XD(1), HT + 3.8, zAt(XD(1))); put(tagNext, clampX(p[0], 220), clampY(p[1] - 20), win(t, T.next + 0.1, T.b9 + 0.2, 0.2, 0.25), pop(t, T.next + 0.1)); }
  // 10 — the plaza
  { const p = proj(AIS[0], AIS[1] + 5, AIS[2]); put(tagAI, clampX(p[0], 200), clampY(p[1] - 10), win(t, T.slid - 0.1, T.wipe2 - 0.6, 0.2, 0.2), pop(t, T.slid - 0.1)); }
  { const p = proj(PL[0], 7.6, PL[2] + 9); put(tagOut, clampX(p[0], 300), clampY(p[1] - 10), win(t, T.billions, T.wipe2 - 0.6, 0.2, 0.2), pop(t, T.billions)); }
  // 11–13 — the weekend and Friday: the price lines on the slope
  LINES.forEach((L, k) => { const p = proj(L.x, yAt(L.x) + 0.6, -HW + 1.5), t0 = k === 0 ? T.p62 : T.below, t1 = k === 0 ? T.b13 + 0.3 : T.b15 - 0.2; put(tagLine[k], clampX(p[0], 260), clampY(p[1]), p[2] ? win(t, t0, t1, 0.2, 0.25) : 0, pop(t, t0)); });
  put(tagMost, W / 2, 1210, win(t, T.fourteenth, T.b12 + 0.4, 0.25, 0.25), pop(t, T.fourteenth));
  put(board, W / 2, 1060, win(t, T.p60, T.b15 - 0.1, 0.3, 0.25), pop(t, T.p60));
  put(tag30, W / 2, 1290, win(t, T.p30, T.b15 - 0.1, 0.2, 0.25), pop(t, T.p30));
  // 15 — every coin, worth less
  { const p = proj(HOLD[1][0], 3.6, HOLD[1][2]); put(tagEvery, W / 2 - 150, 1220, win(t, T.every, T.b16 + 0.3, 0.2, 0.25), pop(t, T.every)); put(tagLess, W / 2 + 150, 1220, win(t, T.less, T.b16 + 0.3, 0.2, 0.25), pop(t, T.less)); }
  // 17 — title and lesson; 18 — you decide
  put(title, W / 2, 640, win(t, T.story, T.cta - 0.1, 0.4, 0.3), 0.94 + 0.06 * eo(seg(t, T.story, T.story + 0.6)));
  put(lesson, W / 2, 1180, win(t, T.borrowed17, T.cta - 0.15, 0.3, 0.25), pop(t, T.borrowed17));
  put(ctaChip, W / 2, 472, seg(t, T.decide, T.decide + 0.3), pop(t, T.decide));
  [[T.sell, 'SELL', T.postA], [T.hold, 'HOLD', T.postB]].forEach(([t0, word, tp], i) => {
    const bx = boxes[i], n = Math.min(4, Math.floor(c01((t - t0) / 0.45) * 4.001)), typed = word.slice(0, n), caret = (n < 4 || Math.floor(t * 2.4) % 2) && t < tp ? '<i></i>' : '';
    setHTML(bx.inn, typed ? `<b>${typed}</b>${caret}` : `<em>Add a comment…</em>${caret}`); const sent = t > tp; const pc = sent ? 'post on sent' : n === 4 ? 'post on' : 'post'; if (bx.post.className !== pc) bx.post.className = pc; setTxt(bx.post, sent ? 'Posted ✓' : 'Post');
    const ts = i ? T.held + 0.1 : T.comment; put(bx.e, W / 2, 1330 + i * 132, seg(t, ts, ts + 0.3), pop(t, ts) * (1 + 0.06 * win(t, tp, tp + 0.3, 0.08, 0.2)));
  });
}

// ───────────────────────── one frame
const hopY = (hops, t, h = 0.5) => { let y = 0; for (const t0 of hops) { const u = (t - t0) / 0.38; if (u > 0 && u < 1) y = Math.max(y, Math.sin(u * Math.PI) * h); } return y; };
const _m4 = new THREE.Matrix4(), _q = new THREE.Quaternion(), _e = new THREE.Euler(), _p = new THREE.Vector3(), _s = new THREE.Vector3();
let inited = false;
function renderAt(t) {
  if (!inited) { drawStatic(); inited = true; }
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
  lineM.emissiveIntensity = 0.25 + night * 0.9;
  // the dominoes
  for (let i = 1; i <= ND; i++) { const a = angleOf(i, t); TH[i] = a; DOM.setMatrixAt(i - 1, domMatrix(i, a, _m)); }
  DOM.instanceMatrix.needsUpdate = true;
  // her domino: hidden until she arrives; gold $100, nine blue coins fly in from the lender, then the gold drains and the arm pushes
  { const show = t > T.b4 - 0.2; herDom.visible = show;
    const g = back(seg(t, T.p100a + 0.4, T.p100a + 0.8)); herGold.scale.set(1, Math.max(0.001, g), 1);
    const fill = seg(t, T.p900 - 0.1, T.p1000 + 0.2); herBlue.scale.set(1, Math.max(0.001, fill), 1); herBlue.position.y = DH * 0.1; herBlue.visible = fill > 0.002;
    const drain = seg(t, T.p100b, T.gone + 0.3); herGoldM.color.setRGB(lerp(0.95, 0.42, drain), lerp(0.71, 0.42, drain), lerp(0.23, 0.46, drain)); herGoldM.emissiveIntensity = 0.35 * (1 - drain);
    herPiv.rotation.z = -fallA(seg(t, tFall(0), tFall(0) + FALLD), false); herDom.rotation.y = -DIR(1); }
  // her coin: rises from her hand, then drops into the foot of the domino
  { const up = seg(t, T.picture, T.p100a), into = seg(t, T.p100a + 0.15, T.p100a + 0.55); herCoin.visible = t > T.picture - 0.1 && into < 1;
    herCoin.position.set(lerp(HERP[0] + 0.3, HER, into), lerp(HT + 1.4 + 1.5 * eo(up), HT + 0.4, into * into) + 0.08 * Math.sin(t * 3), lerp(HERP[2] - 0.5, 0, into)); herCoin.rotation.set(Math.PI / 2, 0, t * 2); }
  // nine blue coins fly from the lender's window and stack up the domino
  blueCoins.forEach((m, k) => { const t0 = T.p900 - 0.2 + k * 0.1, u = seg(t, t0, t0 + 0.55); m.visible = u > 0 && u < 1; if (!m.visible) return; const a = [KI[0] + 1.6, HT + 2.2, KI[2]], b = [HER, HT + DH * (0.12 + 0.09 * k), 0]; m.position.set(lerp(a[0], b[0], u), lerp(a[1], b[1], u) + Math.sin(u * Math.PI) * 2.2, lerp(a[2], b[2], u)); m.rotation.set(Math.PI / 2 + u * 6, 0, u * 4); });
  // the arm: out of the kiosk, pushes, goes back
  { const out = eio(seg(t, T.sells - 0.1, T.auto + 0.35)) * (1 - eio(seg(t, T.b8 + 0.2, T.b8 + 0.9))), x0 = KI[0] + 1.4, x1 = HER - DT / 2 - 0.15, len = Math.max(0.05, lerp(0.05, x1 - x0, out));
    arm.visible = paw.visible = t > T.b7 - 0.3 && t < T.b9; arm.position.set(x0, HT + 2.3, 0); arm.scale.set(len, 1, 1); paw.position.set(x0 + len, HT + 2.3, 0); }
  // people on the hill
  { const walk = seg(t, T.b4 - 0.2, T.picture + 0.3); her.position.set(lerp(HERP[0] - 4, HERP[0], eo(walk)), HT + (walk > 0 && walk < 1 ? Math.abs(Math.sin(t * 7.5)) * 0.07 : hopY([T.gone - 0.1, T.auto + 0.4], t, 0.22)), HERP[2]); her.rotation.y = walk < 1 ? 0 : -0.5; her.visible = t > T.b4 - 0.3 && t < T.wipe1 + 0.5; }
  lenderP.rotation.y = 0; lenderP.position.y = HT + hopY([T.p900 - 0.2, T.lender], t, 0.12);
  traders.forEach(tr => { const a = TH[tr.i], fell = a > 0.6; tr.m.position.set(tr.x, yAt(tr.x) + hopY([tFall(tr.i) + 0.15], t, 0.4) * (t > T.b2 + 1.3 ? 1 : 0) + hopY([T.rising + tr.i * 0.02, T.borrowed3 + 0.1 + tr.i * 0.02], t, 0.28), tr.z); tr.m.rotation.y = fell ? (tr.side > 0 ? -Math.PI / 2 : Math.PI / 2) * 0.9 : (tr.side > 0 ? -0.6 : 0.6); });
  btn.visible = t < T.b3; btn.userData.cap.position.y = btn.userData.capY; btn.userData.glow.material.opacity = 0.5 + 0.3 * Math.sin(t * 5);
  holders.forEach((m, k) => { m.position.y = hopY([T.every + k * 0.1], t, 0.2); });
  holdCoins.forEach((c, k) => { const m = holders[k], s = [1, 0.98, 0.78][k], w = seg(t, T.less - 0.1, T.less + 0.6); c.position.set(m.position.x + 0.2, m.position.y + 2.45 * s + 0.1 * Math.sin(t * 2 + k), m.position.z); c.rotation.set(Math.PI / 2, 0, t * 1.5 + k); const k2 = lerp(1, 0.72, w); c.scale.setScalar(k2); c.material.emissiveIntensity = lerp(0.5, 0.15, w); });
  // the plaza: coins leave the fund building
  for (let i = 0; i < NCF; i++) { const f = FLY[i], u = (t - f.t0) / 2.2; if (u <= 0 || u >= 1 || t > T.wipe2 + 0.6) { flyCoins.setMatrixAt(i, _m4.compose(_p.set(0, -50, 0), _q.identity(), _s.set(0, 0, 0))); continue; }
    _p.set(PL[0] + Math.sin(f.a) * f.v * u * 1.4, 2.2 + f.up * Math.sin(u * Math.PI * 0.6) + u * u * 14, PL[2] + bk.userData.door + Math.cos(f.a) * f.v * u * 2.2); _e.set(Math.PI / 2 + u * 7 + f.sp, 0, u * 5); _q.setFromEuler(_e); _s.setScalar(1.0); flyCoins.setMatrixAt(i, _m4.compose(_p, _q, _s)); }
  flyCoins.instanceMatrix.needsUpdate = true;
  crowd.forEach((m, k) => { m.position.y = hopY([T.billions + 0.3 + k * 0.12], t, 0.18); });
  // dust puffs where dominoes land
  { let k = 0; for (let i = 1; i <= ND && k < dust.length; i++) { const tf = t < T.b2 ? HOOK0 + (i - 1) * HOOKDT : tFall(i), u = (t - tf - FALLD * 0.8) / 0.9; if (u > 0 && u < 1 && (t < T.b2 || t > T.b2 + 1.3)) { const d = dust[k++], x = XD(i) + DH * 0.7; d.visible = true; d.position.set(x, yAt(x) + 0.5 + u * 0.8, zAt(x)); d.scale.setScalar(1.5 + u * 3); d.material.opacity = 0.6 * (1 - u); } } while (k < dust.length) dust[k++].visible = false; }
  // cars, clouds
  for (const c of CARS) { const L = 700, x = ((c.off + t * c.v) % L) - L / 2; c.m.position.set(c.dir * x, 0, c.z); c.m.rotation.y = c.dir > 0 ? 0 : Math.PI; }
  for (const c of clouds) { const cw = c.userData.win ? win(t, c.userData.win[0], c.userData.win[1], 0.4, 0.4) : 1; c.visible = cw > 0.001; c.position.x = c.userData.x0 + t * 1.2; c.material.opacity = (0.9 - 0.5 * night) * cw; const k = lerp(1, 0.45, night); c.material.color.setRGB(lerp(s.hor[0], 1, 0.55) * k, lerp(s.hor[1], 1, 0.55) * k, lerp(s.hor[2], 1, 0.55) * k * 1.05); c.material.emissive.setRGB(c.material.color.r * 0.35, c.material.color.g * 0.35, c.material.color.b * 0.35); }
  // sparkles: her $1,000 bet, the holders' coins, the final wish
  { let k = 0; const put3 = (x, y, z, sz, on) => { const sp = sparks[k++]; if (!sp) return; const tw = Math.pow(Math.abs(Math.sin(t * sp.userData.w + sp.userData.ph)), 3); sp.position.set(x, y, z); sp.scale.setScalar(sz * (0.25 + tw)); sp.material.opacity = on * (0.25 + 0.75 * tw); sp.visible = on > 0.01; };
    const s1 = win(t, T.p1000, T.b6, 0.2, 0.3); for (let i = 0; i < 8; i++) { const a = i * 0.785 + t * 0.9; put3(HER + Math.cos(a) * 1.4, HT + 1 + (i % 4) * 0.7, Math.sin(a) * 1.4, 0.35, s1); }
    const s2 = win(t, T.every, T.b16 + 0.3, 0.3, 0.4); for (let i = 0; i < 12; i++) { const h = HOLD[i % 3], a = i * 1.7 + t; put3(h[0] + Math.cos(a) * 0.8, 2.6 + (i % 4) * 0.25, h[2] + Math.sin(a) * 0.8, 0.3, s2); }
    const s3 = win(t, T.postA, DUR + 1, 0.4, 0.1); for (let i = 0; i < 18; i++) { const ph = (t * 0.35 + i / 18) % 1, a = i * 2.4; const c = SCRW(); put3(c[0] + Math.cos(a) * (3 + ph * 4), HT + 2 + ph * 12, c[2] + 4 + Math.sin(a) * (2 + ph * 3), 0.9 + 0.6 * (1 - ph), s3 * Math.sin(ph * Math.PI)); }
    while (k < sparks.length) sparks[k++].visible = false; }
  drawScreen(t); drawAI(t);
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
    for (const [x0, x1, z0, z1, y1, nm] of stat) { if (c.x > x0 - 0.9 && c.x < x1 + 0.9 && c.z > z0 - 0.9 && c.z < z1 + 0.9 && c.y < y1 + 0.9) { hit = nm + '@' + x0.toFixed(0) + ',' + z0.toFixed(0); break; } }
    if (!hit && c.y < 1.2) hit = 'ground';
    if (hit) { if (cur && cur[2] === hit && f - cur[1] <= 1) cur[1] = f; else { cur = [f, f, hit]; out.push(cur); } }
  }
  return out.map(([a, b, n]) => `${(a / 30).toFixed(2)}-${(b / 30).toFixed(2)}s ${n}`);
};
window.renderAt = renderAt; window.__dbg = { camera, waveX, angleOf };
window.CUES = {
  T, DUR, sent: TIM.sentences.map(s => s.s),
  typingA: [0, 1, 2, 3].map(i => +(T.sell + (i + 0.5) * 0.11).toFixed(3)), typingB: [0, 1, 2, 3].map(i => +(T.hold + (i + 0.5) * 0.11).toFixed(3)),
  hookFalls: Array.from({ length: ND }, (_, i) => +(HOOK0 + i * HOOKDT + FALLD).toFixed(3)),
  falls: Array.from({ length: ND + 1 }, (_, i) => +(tFall(i) + FALLD).toFixed(3)),
  blue: Array.from({ length: 9 }, (_, k) => +(T.p900 - 0.2 + k * 0.1 + 0.55).toFixed(3)), herCoin: +(T.p100a + 0.55).toFixed(3),
  fly: FLY.map(f => +f.t0.toFixed(3)), postA: +T.postA.toFixed(3), postB: +T.postB.toFixed(3),
};
document.fonts.ready.then(() => Promise.all(['700 64px Figtree', '900 190px Fraunces', '800 30px JBM', '700 22px Inter', '700 78px Fraunces', '800 54px Figtree', '600 34px Figtree', '500 18px Inter', '900 92px Fraunces', '800 120px JBM', '800 46px Inter', '900 150px Figtree'].map(f => document.fonts.load(f)))).then(() => { renderAt(0); window.__ready = true; });
