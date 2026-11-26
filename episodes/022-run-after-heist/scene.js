// The Run After the Heist — low-poly storybook scene (deterministic: window.renderAt(t) draws the frame for time t)
// Thu 29 Oct 2026: about $6.3bn taken from Binance (the biggest crypto theft on record). Withdrawals halted; Sun 1 Nov 2026 they reopen in phases
// and in the first nine and a half hours customers take out $4.65bn and put in $1.01bn: a net $3.64bn, about 2.1% of the $171bn it held (Binance's
// figures via Reuters, The Block). Binance says it replaced the stolen assets with company money. Thu 26 Nov 2026: the withdrawal suspension fully
// lifted (Reuters); about $2.85bn frozen, the rest in circulation, $600m+ through THORChain (Reuters, Chainalysis, Elliptic). The past: Mt. Gox
// (Feb 2014, about 850,000 bitcoins missing, repayments from July 2024) and FTX (Nov 2022, up to $8bn short, repayments from Feb 2025).
// The world: Binance's vault on a city plaza (a round door, a run of customers carrying coins out, a bar of locks over the door), two old vaults to
// the west in sepia (Mt. Gox, FTX), a "picture this" model to the east (100 customers, 100 coins, then 60), the thieves' wallets under a storm.
import * as THREE from 'three';
import { SKIN, MAT, GOLD, rng, GB, person, cloud, bushTree, tower, car, lamp, vaultDoor, glassVault, BIGCOIN, WIN_LIT } from './kit.js';

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
const R = rng(20261101);

// ───────────────────────── story clock (everything hangs off the narration)
const T = {
  hookEnd: TIM.big ? 1.5 : TIM.hook ? E(1) + 0.15 : 0,  // the hook card (script.py HOOK): 0-1.5 s when there is a big number, else until the hook sentence ends
  bigIn: TIM.big ? 1.5 : 0, bigOut: TIM.big ? 3.0 : 0,   // the big number (script.py BIG): 1.5-3 s (Keith, 22 Nov 2026)
  pulled: wt(1, 'pulled') - 0.1, exchange1: wt(1, 'exchange') - 0.1, hours1: wt(1, 'hours') - 0.1,
  b2: S(2) - 0.05, binance2: wt(2, 'Binance') - 0.1, reopening: wt(2, 'reopening') - 0.1, days2: wt(2, 'days') - 0.1, biggest2: wt(2, 'biggest') - 0.1, theft2: wt(2, 'theft') - 0.1,
  b3: S(3) - 0.05, money3: wt(3, 'money') - 0.1, there3: wt(3, 'there') - 0.1,
  b4: S(4) - 0.05, gox: wt(4, 'Gox') - 0.1, ftx: wt(4, 'FTX') - 0.1, locked: wt(4, 'locked') - 0.1, doors4: wt(4, 'doors') - 0.1, wasnt: wt(4, "wasn't") - 0.1, customers4: wt(4, 'customers') - 0.1, waited: wt(4, 'waited') - 0.1, years: wt(4, 'years') - 0.1,
  b5: S(5) - 0.05, picture: wt(5, 'Picture') - 0.1, n100a: wt(5, '100') - 0.1, owed: wt(5, 'owed') - 0.1, coin5: wt(5, 'coin') - 0.1,
  b6: S(6) - 0.05, all6: wt(6, 'all') - 0.1, vault6: wt(6, 'vault') - 0.1, run6: wt(6, 'run') - 0.1, long6: wt(6, 'long') - 0.1, line6: wt(6, 'line') - 0.1,
  b7: S(7) - 0.05, only7: wt(7, 'only') - 0.1, n60: wt(7, '60') - 0.1, last7: wt(7, 'last') - 0.1, n40: wt(7, '40') - 0.1, nothing: wt(7, 'nothing') - 0.1,
  b8: S(8) - 0.05, binance8: wt(8, 'Binance') - 0.1, refilled: wt(8, 'refilled') - 0.1, own: wt(8, 'own') - 0.1, money8: wt(8, 'money') - 0.1,
  b9: S(9) - 0.05, count: wt(9, 'count') - 0.1, rush: wt(9, 'rush') - 0.1, two: wt(9, 'two') - 0.1, n100c: wt(9, '100') - 0.1,
  b10: S(10) - 0.05, thursday: wt(10, 'Thursday') - 0.1, four: wt(10, 'four') - 0.1, weeks: wt(10, 'weeks') - 0.1, said10: wt(10, 'said') - 0.1, lock: wt(10, 'lock') - 0.1, off: wt(10, 'off') - 0.1,
  b11: S(11) - 0.05, half: wt(11, 'half') - 0.1, never: wt(11, 'never') - 0.1, frozen: wt(11, 'frozen') - 0.1, still11: wt(11, 'still') - 0.1, moving: wt(11, 'moving') - 0.1,
  b12: S(12) - 0.05, over: wt(12, 'over') - 0.1,
  b13: S(13) - 0.05, story: wt(13, 'story') - 0.15, run13: wt(13, 'run') - 0.1, promise: wt(13, 'promise') - 0.1, vault13: wt(13, 'vault') - 0.1,
  cta: S(14) - 0.1, would: wt(14, 'Would') - 0.1, comment: wt(14, 'Comment') - 0.15, pullW: wt(14, 'PULL') - 0.2, waitW: wt(14, 'WAIT') - 0.1,
};
T.serveA = T.all6; T.serveB = T.line6 + 0.15;                 // all 100 customers get their coin, row by row
T.reset = T.only7 - 0.05; T.serve2A = T.n60 + 0.05; T.serve2B = T.last7 + 0.25; T.noX = T.nothing - 0.05;   // only 60 coins: the last 40 get nothing
T.refillA = T.refilled; T.refillB = T.money8 + 0.7;          // coins from Binance's own reserve chest back into the vault
T.lockWaveA = T.four; T.lockWaveB = T.said10 + 0.1; T.lockLast = T.lock + 0.05;   // the remaining locks open over four weeks; the last one on Thursday
T.openPast = T.wasnt - 0.05;                                 // the old vaults' doors swing open: empty
T.lapseA = T.customers4; T.lapseB = T.years + 0.7;           // years pass (a time-lapse of days)
T.freeze = T.frozen - 0.1;
T.postA = T.pullW + 0.75; T.postB = T.waitW + 0.7;
window.T = T;

// ───────────────────────── renderer, sky, light
const canvas = document.getElementById('gl');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: QP.get('aa') !== '0', preserveDrawingBuffer: true });
renderer.setPixelRatio(1); renderer.setSize(W, H, false);
renderer.toneMapping = THREE.NeutralToneMapping; renderer.toneMappingExposure = 1.0;
renderer.shadowMap.enabled = QP.get('sh') !== '0'; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
const scene = new THREE.Scene(); scene.fog = new THREE.Fog(0xffffff, 90, 640);
const camera = new THREE.PerspectiveCamera(35, W / H, 0.3, 2600);
const hemi = new THREE.HemisphereLight(0xffffff, 0x886644, 1.5); scene.add(hemi);
const sun = new THREE.DirectionalLight(0xffffff, 3); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); sun.shadow.bias = -0.0005; sun.shadow.normalBias = 0.3; sun.shadow.camera.near = 1; sun.shadow.camera.far = 900; scene.add(sun, sun.target);

const hx = h => { const c = new THREE.Color(h); return [c.r, c.g, c.b]; };
const P = (top, mid, hor, fog, sunC, sunI, hemS, hemG, hemI, star, glow, az, el, orb, orbS, fn, ff) => ({ top: hx(top), mid: hx(mid), hor: hx(hor), fog: hx(fog), sunC: hx(sunC), sunI, hemS: hx(hemS), hemG: hx(hemG), hemI, star, glow, az, el, orb: hx(orb), orbS, fn, ff });
const PRE = {
  MORN: P(0x4E9FDC, 0x9FD0EA, 0xFBE6BC, 0xE6E4D6, 0xFFE2B0, 3.2, 0xBFDFFF, 0x9A9A80, 1.6, 0, 0, 55, 26, 0xFFF0C8, 40, 110, 700),
  DAY: P(0x2F8FDA, 0x86C6EE, 0xEAF0EE, 0xDCE6EA, 0xFFF1D6, 3.4, 0xCFE8FF, 0x9AA088, 1.7, 0, 0, 22, 52, 0xFFF8E0, 38, 110, 720),
  SEPIA: P(0x6E5640, 0xC9A274, 0xF0D6A6, 0xDCC096, 0xFFE2B4, 2.4, 0xF4E0BC, 0x8A6A4A, 1.45, 0, 0.05, -40, 30, 0xFFF0D2, 38, 120, 760),
  GOLDEN: P(0x3C7FCB, 0xF2C58A, 0xFFD79A, 0xF6CF9A, 0xFFC878, 3.1, 0xE8D2B0, 0xA88A60, 1.5, 0, 0.12, -68, 20, 0xFFE0A0, 44, 100, 680),
  NIGHT: P(0x070B24, 0x141C4B, 0x30326A, 0x22265A, 0xB4C2FF, 2.0, 0x5567C4, 0x3A3048, 1.5, 1, 1, -35, 42, 0xFFF4D6, 30, 90, 600),
  DUSK: P(0x141A4C, 0x4A3F86, 0xC06A78, 0x6A4A78, 0x93A4F4, 1.7, 0x5A62B0, 0x3A2A40, 1.25, 0.65, 0.92, -40, 36, 0xFFF4D6, 30, 90, 640),
};
const SKY = [[0, 'MORN'], [T.b4 - 0.2, 'MORN'], [T.ftx + 0.3, 'SEPIA'], [T.years + 0.5, 'SEPIA'], [T.b5 + 0.3, 'DAY'],
  [T.b11 + 0.1, 'DAY'], [T.b11 + 1.2, 'NIGHT'], [T.b12 + 0.6, 'NIGHT'], [T.b13 + 1.2, 'DUSK'], [T.cta + 0.6, 'DUSK'], [DUR + 2, 'NIGHT']];
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

// ───────────────────────── places
const V = [0, -90], VF = -76;                 // Binance's vault and its front face (facing +z, the plaza)
const DOOR = [0, 9.4, VF + 0.75], DR = 8.2;   // the round door (open: customers walk out through it)
const RC = [-27, -66];                         // Binance's own reserve chest
const MG = [-128, -96], FX = [-100, -96];      // the old vaults of 2014 (Mt. Gox) and 2022 (FTX), to the west
const DM = [64, -40];                          // "picture this": the model with 100 customers and a glass vault, to the east
const TW = [-20, -240];                        // the thieves' wallets: dark cases floating high behind the vault, under a storm
const RING = [TW[0] + 6, 90, TW[1] + 4];       // the swap service: a glowing ring above the wallets that the stolen coins pass through
const stat = [];
const _m4 = new THREE.Matrix4(), _q = new THREE.Quaternion(), _e = new THREE.Euler(), _p = new THREE.Vector3(), _s = new THREE.Vector3();

// ───────────────────────── ground, streets, plaza
const ground = new THREE.Mesh(new THREE.PlaneGeometry(2400, 2400).rotateX(-Math.PI / 2), new THREE.MeshLambertMaterial({ color: 0xC9C2AE })); ground.receiveShadow = true; scene.add(ground);
const flat = new GB();
flat.box(9, 0.04, 360, 0x4A4E56, 96, 0.02, -60); flat.box(9, 0.04, 360, 0x4A4E56, -46, 0.021, -60);              // avenues north-south
flat.box(560, 0.04, 9, 0x4A4E56, 0, 0.022, -134); flat.box(560, 0.04, 9, 0x4A4E56, 0, 0.023, 6);                 // east-west
for (const z of [-134, 6]) for (let x = -270; x < 270; x += 6) flat.box(2.6, 0.05, 0.22, 0xF2EEE2, x, 0.045, z);
flat.box(76, 0.07, 66, 0xE6DFD0, 0, 0.035, -42);                                                                  // the plaza in front of the vault
for (let i = 0; i < 16; i++) flat.box(76, 0.075, 0.12, 0xD6CEBC, 0, 0.037, -73 + i * 4);
flat.box(70, 0.07, 56, 0xCDB894, (MG[0] + FX[0]) / 2, 0.034, MG[1] + 18);                                        // the old square (2014-2022)
for (let i = 0; i < 12; i++) flat.box(70, 0.075, 0.14, 0xB9A47E, (MG[0] + FX[0]) / 2, 0.036, MG[1] - 6 + i * 4.4);
{ const rr = rng(909); for (let i = 0; i < 64; i++) { const x = -260 + rr() * 520, z = -240 + rr() * 300; if (Math.abs(x) < 50 && z > -110 && z < 0) continue; if (x > 36 && x < 92 && z > -70 && z < -8) continue; if (x < -66 && x > -168 && z > -130 && z < -40) continue; flat.box(6 + rr() * 14, 0.06, 6 + rr() * 14, rr() < 0.5 ? 0x8DAE74 : 0x9DB884, x, 0.03, z); } }
const flatM = flat.mesh(); flatM.castShadow = false; scene.add(flatM);

// ───────────────────────── the city
const DEST = (x, z) => (Math.abs(x) < 44 && z < -22 && z > -114) || (x > -96 && x < 74 && z > -30 && z < 120) || (x > -200 && x < -86 && z > -44 && z < 80) || Math.abs(z) < 11 && x > -60 && x < 110 || (x > 34 && x < 92 && z > -74 && z < -4) || (x < -64 && x > -170 && z > -132 && z < -44)
  || Math.hypot(x - TW[0], z - TW[1]) < 64 || (x > -84 && x < 90 && z > -214 && z < -108) || (Math.abs(x - TW[0]) < 60 && z < -196) || Math.abs(z + 134) < 9 || Math.abs(z - 6) < 9 || Math.abs(x - 96) < 9 || Math.abs(x + 46) < 9 || Math.hypot(x - RC[0], z - RC[1]) < 12;
{
  const tr = rng(2026), PAL = [[0xD9D3C6, 0x5E7F9A], [0x6D97AA, 0x3F6A80], [0xE4DED2, 0x4E7C93], [0xC9C2B4, 0x55748C], [0x8FB3C2, 0x426E86], [0xEFE9DC, 0x6A8AA4], [0xB7C4C9, 0x3E6378], [0xE8D9C0, 0x5A7A90]];
  for (let gx = -260; gx <= 240; gx += 22) for (let gz = -270; gz <= 90; gz += 22) {
    const x = gx + (tr() - .5) * 7, z = gz + (tr() - .5) * 7; if (DEST(x, z) || tr() < 0.12) continue;
    const dp = Math.hypot(x, z + 60), far = dp > 120, w = 9 + tr() * 7, d = 9 + tr() * 7;
    const h = (dp < 80 ? 12 + tr() * 16 : 18 + tr() * (far ? 44 : 28)) * (z > 20 ? 0.6 : 1) * (x < -120 ? 0.55 : 1);
    const pal = PAL[Math.floor(tr() * PAL.length)];
    const g = tower(w, h, d, { rand: tr, color: pal[0], glass: pal[1], floor: far ? 4.2 : 3.4, litP: 0.55, crown: h > 46 && tr() < 0.5 });
    g.position.set(x, 0, z); g.rotation.y = (tr() < 0.5 ? 0 : Math.PI / 2); g.children.forEach(c => { c.castShadow = dp < 140; c.receiveShadow = true; }); scene.add(g);
    stat.push([x - Math.max(w, d) / 2, x + Math.max(w, d) / 2, z - Math.max(w, d) / 2, z + Math.max(w, d) / 2, h + 4, 'tower']);
  }
}

// ───────────────────────── vaults: a steel-and-stone strongroom with a round door (Binance's, and two smaller old ones)
function vaultBody(cx, cz, k, o = {}) {
  const b = new GB(), st = o.st ?? 0x6E7480, st2 = o.st2 ?? 0x8A909C, trim = o.trim ?? 0xD9D3C6, dk = 0x2C3038, fz = cz + 14 * k;
  b.box(46 * k, 1.2, 34 * k, 0xCFC8BA, cx, 0.6, cz + 1 * k);
  b.box(40 * k, 30 * k, 28 * k, st, cx, 15 * k, cz);
  b.box(42 * k, 1.6 * k, 30 * k, trim, cx, 30.6 * k, cz); b.box(30 * k, 4 * k, 20 * k, st2, cx, 33 * k, cz - 1 * k);
  for (const x of [-19, -13, 13, 19]) b.box(2.2 * k, 28 * k, 1.2 * k, st2, cx + x * k, 15 * k, fz + 0.6 * k);
  b.box(40 * k, 2.0 * k, 1.4 * k, trim, cx, 27.5 * k, fz + 0.7 * k);
  const dr = DR * k, dy = 1.2 + dr;
  b.cyl(dr + 1.4 * k, dr + 1.4 * k, 0.6, 32, dk, cx, dy, fz + 0.3, Math.PI / 2, 0, 0);
  for (let i = 0; i < 3; i++) b.box(18 * k, 0.9 - i * 0.3, 1.4, trim, cx, (0.9 - i * 0.3) / 2, cz + 18 * k + 0.7 + i * 1.4);   // steps down from the plinth
  const m = b.mesh(); m.castShadow = true; m.receiveShadow = true; scene.add(m);
  stat.push([cx - 21 * k, cx + 21 * k, cz - 15 * k, cz + 15 * k, 37 * k, o.name ?? 'vault']);
  return { fz, dy, dr };
}
const MAINV = vaultBody(V[0], V[1], 1, { name: 'vault' });
{ const lw = new GB(); for (let k = 0; k < 6; k++) for (const s of [-1, 1]) lw.box(0.15, 3.2, 3.2, 0xFFFFFF, s * 20.1, 8 + k * 3.6, V[1] - 6 + (k % 2) * 6); scene.add(new THREE.Mesh(lw.geo(), WIN_LIT)); }
// the coins behind the round door (a glowing heap seen through the open doorway); it brightens when the reserve refills it
const heapBg = new THREE.Mesh(new THREE.CircleGeometry(DR + 0.2, 32), new THREE.MeshBasicMaterial({ color: 0x1A1408, toneMapped: false })); heapBg.position.set(DOOR[0], DOOR[1], VF + 0.62); scene.add(heapBg);
const heapM = new THREE.MeshBasicMaterial({ map: radial('rgba(255,214,90,1)', 'rgba(150,90,10,0.0)'), transparent: true, toneMapped: false, depthWrite: false });
const heap = new THREE.Mesh(new THREE.CircleGeometry(DR, 32), heapM); heap.position.set(DOOR[0], DOOR[1], VF + 0.66); scene.add(heap);
const heapCoins = (() => { const b = new GB(), rr = rng(77); for (let i = 0; i < 70; i++) { const a = rr() * 6.28, r = Math.sqrt(rr()) * DR * 0.85; b.cyl(0.9, 0.9, 0.06, 10, 0xFFFFFF, Math.cos(a) * r, Math.sin(a) * r * 0.9 + 1.5, rr() * 0.02, Math.PI / 2, 0, rr()); } const m = new THREE.Mesh(b.geo(), GOLD); m.position.set(DOOR[0], DOOR[1], VF + 0.68); return m; })(); scene.add(heapCoins);
const door = vaultDoor(DR); door.position.set(DOOR[0], DOOR[1], DOOR[2]); door.children.forEach(c => { c.castShadow = true; }); door.userData.pivot.rotation.y = -1.75; scene.add(door);
const doorGlow = new THREE.Mesh(new THREE.PlaneGeometry(40, 30).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ map: radial('rgba(255,200,110,0.7)', 'rgba(255,200,110,0)'), transparent: true, depthWrite: false, toneMapped: false, blending: THREE.AdditiveBlending, opacity: 0.5 })); doorGlow.position.set(0, 0.1, VF + 12); doorGlow.renderOrder = 1; scene.add(doorGlow);
// the bar of locks over the door: one lock per group of coins; 4 open on 1 Nov, the rest over four weeks, the last on 26 Nov
const NL = 12, LOCKS = [], LBY = 22.6, LBZ = VF + 1.25;
{ const b = new GB(); b.box(37, 3.4, 0.6, 0x3A3F48, 0, LBY, LBZ - 0.4); b.box(37.6, 0.35, 0.8, 0xD9D3C6, 0, LBY + 1.85, LBZ - 0.3); b.box(37.6, 0.35, 0.8, 0xD9D3C6, 0, LBY - 1.85, LBZ - 0.3); scene.add(b.mesh()); }
const shackleG = new THREE.TorusGeometry(0.42, 0.11, 6, 14, Math.PI), lockBodyG = new THREE.BoxGeometry(1.25, 1.1, 0.55);
const shackleM = new THREE.MeshLambertMaterial({ color: 0xC9CED6 });
for (let i = 0; i < NL; i++) {
  const g = new THREE.Group(), mat = new THREE.MeshLambertMaterial({ color: 0xD9483B, emissive: 0x6A1A12, emissiveIntensity: 0.4 });
  const body = new THREE.Mesh(lockBodyG, mat); g.add(body);
  const piv = new THREE.Group(); piv.position.set(0.42, 0.5, 0); const sh = new THREE.Mesh(shackleG, shackleM); sh.position.set(-0.42, 0, 0); piv.add(sh); g.add(piv);
  const x = -16.5 + i * 3.0; g.position.set(x, LBY - 0.25, LBZ + 0.1); g.scale.setScalar(i < 4 ? 1.35 : 1.0); scene.add(g);
  const tOpen = i < 4 ? -1 : i < NL - 1 ? T.lockWaveA + (i - 4) / (NL - 5) * (T.lockWaveB - T.lockWaveA) : T.lockLast;
  LOCKS.push({ g, mat, piv, x, tOpen });
}
// Binance's own reserve: a big chest beside the vault
const chest = new THREE.Group(); { const b = new GB(); b.box(7, 4, 4.6, 0x3E6A5A, 0, 2, 0); b.box(7.3, 0.5, 4.9, 0xC9A23A, 0, 4.1, 0); b.box(7.3, 0.5, 0.4, 0xC9A23A, 0, 2, 2.35); b.box(1.2, 1.4, 0.3, 0xC9A23A, 0, 2.6, 2.45); chest.add(b.mesh());
  const lid = new GB(); lid.box(7.1, 1.1, 4.7, 0x34584B, 0, 0.55, 2.35); lid.box(7.3, 0.3, 0.3, 0xC9A23A, 0, 1.1, 4.6); const lm = lid.mesh(); const lp = new THREE.Group(); lp.position.set(0, 4.35, -2.35); lp.add(lm); chest.add(lp); chest.userData.lid = lp; }
chest.position.set(RC[0], 0, RC[1]); chest.rotation.y = 0.5; scene.add(chest); stat.push([RC[0] - 5, RC[0] + 5, RC[1] - 5, RC[1] + 5, 6.5, 'chest']);

// the two old vaults (2014, 2022): smaller, shut with chains; when the doors open there is almost nothing inside
const OLD = [MG, FX].map(([x, z], i) => {
  const k = 0.5, v = vaultBody(x, z, k, { st: 0x7A746C, st2: 0x948C80, trim: 0xD6CCB8, name: i ? 'old vault FTX' : 'old vault Mt. Gox' });
  const bg = new THREE.Mesh(new THREE.CircleGeometry(v.dr + 0.1, 28), new THREE.MeshBasicMaterial({ color: 0x0E0C0A, toneMapped: false })); bg.position.set(x, v.dy, v.fz + 0.62); scene.add(bg);
  const few = (() => { const b = new GB(), rr = rng(300 + i); for (let j = 0; j < 4; j++) { const a = rr() * 6.28, r = Math.sqrt(rr()) * v.dr * 0.6; b.cyl(0.5, 0.5, 0.05, 10, 0xFFFFFF, Math.cos(a) * r, -v.dr * 0.7 + rr() * 0.6, 0.02, Math.PI / 2, 0, rr()); } return new THREE.Mesh(b.geo(), new THREE.MeshLambertMaterial({ color: 0x8A7A50 })); })(); few.position.set(x, v.dy, v.fz + 0.66); scene.add(few);
  const d = vaultDoor(v.dr); d.position.set(x, v.dy, v.fz + 0.75); d.children.forEach(c => { c.castShadow = true; }); scene.add(d);
  const chain = new THREE.Group(); { const b = new GB(); b.box(v.dr * 2.4, 0.5, 0.5, 0x3A3A3A, 0, 0, 0, 0, 0, 0.62); b.box(v.dr * 2.4, 0.5, 0.5, 0x3A3A3A, 0, 0, 0, 0, 0, -0.62); b.box(1.6, 1.4, 0.7, 0xB03A30, 0, 0, 0.4); chain.add(b.mesh()); }
  chain.position.set(x, v.dy, v.fz + 1.9); scene.add(chain);
  return { x, z, v, door: d, chain };
});
// old shopfronts around the old square
{ const b = new GB(), rr = rng(4040); for (let i = 0; i < 7; i++) for (const sd of [-1]) { const x = (MG[0] + FX[0]) / 2 - 33 + i * 11, z = MG[1] - 22; if (x > MG[0] - 14 && x < FX[0] + 14) continue; const h = 7 + rr() * 6; b.box(9.6, h, 8, [0xB8A68A, 0xA89478, 0xC4B08E, 0x9C8A70][i % 4], x, h / 2, z); b.box(10, 0.6, 8.4, 0x7A6A54, x, h + 0.3, z); }
  const m = b.mesh(); m.castShadow = true; m.receiveShadow = true; scene.add(m); }

// ───────────────────────── people (instanced: a few clothing variants)
const modern = (i, extra = {}) => ({ robe: [0x34405A, 0x6A2E3E, 0x3F6A5A, 0x5A5A66, 0x7A5A3A, 0x2F4A6A, 0x8A3A3A, 0x3B6FA8, 0xB0603A, 0x4E7A3E][i % 10], skin: SKIN[i % 5], short: [0x231C18, 0x5A3E28, 0xC9A27A, 0x3A2A1E, 0x8A8A8A][i % 5], shirt: i % 2 ? 0xF4F2EC : undefined, ...extra });
const PG = Array.from({ length: 10 }, (_, i) => person(modern(i, i % 3 === 0 ? { badge: true } : {})).geometry);
class Crowd {
  constructor(n, mat = MAT, shadow = true) { this.ims = PG.map(g => { const m = new THREE.InstancedMesh(g, mat, n); m.castShadow = shadow; m.receiveShadow = false; m.frustumCulled = false; m.count = 0; scene.add(m); return m; }); this.cnt = PG.map(() => 0); this.n = n; }
  begin() { this.cnt.fill(0); }
  add(v, x, y, z, ry, s = 1, sy = 1) { const k = v % this.ims.length; if (this.cnt[k] >= this.n) return; _e.set(0, ry, 0); _q.setFromEuler(_e); _p.set(x, y, z); _s.set(s, s * sy, s); this.ims[k].setMatrixAt(this.cnt[k]++, _m4.compose(_p, _q, _s)); }
  end() { this.ims.forEach((m, k) => { m.count = this.cnt[k]; m.instanceMatrix.needsUpdate = true; }); }
}
const crowd = new Crowd(120), greyCrowd = new Crowd(40, new THREE.MeshLambertMaterial({ color: 0x8C9098 }));
const NHC = 260, headCoins = new THREE.InstancedMesh(BIGCOIN(0.34, 0.1), GOLD, NHC); headCoins.frustumCulled = false; headCoins.castShadow = true; scene.add(headCoins);
// the run: customers come out of the round door with a coin each and walk off across the plaza; a queue snakes in from the plaza
const NEX = 64, LOOP = 15;
const EXIT = Array.from({ length: NEX }, (_, i) => { const rr = rng(1200 + i), sd = rr() < 0.5 ? -1 : 1, far = rr(); return { v: i, t0: i / NEX * LOOP, end: [sd * (14 + far * 26), 0, -12 - rr() * 32], sp: 3.4 + rr() * 1.2, jx: (rr() - 0.5) * 3, ph: rr() * 6 }; });
const QPATH = [[-5, VF + 9], [-5, VF + 13], [-24, VF + 13], [-24, VF + 19], [24, VF + 19], [24, VF + 25], [-24, VF + 25], [-24, VF + 31], [24, VF + 31], [24, VF + 37], [-24, VF + 37]];   // from the foot of the steps, snaking back across the plaza
const QLEN = QPATH.slice(1).reduce((a, q, i) => a + Math.hypot(q[0] - QPATH[i][0], q[1] - QPATH[i][1]), 0);
function qAt(d) {   /* [x, z, heading]: facing back along the path, toward the door */ d = Math.max(0, Math.min(QLEN - 0.01, d)); for (let i = 0; i < QPATH.length - 1; i++) { const a = QPATH[i], b = QPATH[i + 1], L = Math.hypot(b[0] - a[0], b[1] - a[1]); if (d <= L) { const u = d / L; return [lerp(a[0], b[0], u), lerp(a[1], b[1], u), Math.atan2(b[1] - a[1], a[0] - b[0])]; } d -= L; } return [QPATH[0][0], QPATH[0][1], 0]; }
const NQ = Math.floor(QLEN / 1.25);
function exitPos(e, t) {   // a customer leaving with a coin: out of the door, down the steps, off across the plaza
  const k = ((t - e.t0) % LOOP + LOOP) % LOOP, a = [e.jx * 0.5, 1.2, VF + 1.2], b = [e.jx, 0, VF + 8.5], c = e.end;
  const L1 = Math.hypot(b[0] - a[0], b[2] - a[2]) + 1, L2 = Math.hypot(c[0] - b[0], c[2] - b[2]), d = k * e.sp;
  if (d > L1 + L2) return null;
  let x, y, z, dx, dz; if (d < L1) { const u = d / L1; x = lerp(a[0], b[0], u); y = lerp(a[1], 0, u); z = lerp(a[2], b[2], u); dx = b[0] - a[0]; dz = b[2] - a[2]; } else { const u = (d - L1) / L2; x = lerp(b[0], c[0], u); y = 0; z = lerp(b[2], c[2], u); dx = c[0] - b[0]; dz = c[2] - b[2]; }
  const fade = c01((L1 + L2 - d) / 3);
  return [x, y, z, Math.atan2(-dz, dx), fade];
}
// the old square: customers waiting outside the shut doors (they sit down as the years pass)
const PASTC = []; for (const o of OLD) { const rr = rng(o.x * -7); for (let i = 0; i < 24; i++) { const row = Math.floor(i / 6), col = i % 6; PASTC.push({ v: (i * 3 + row) % 10, x: o.x - 6 + col * 2.4 + (rr() - 0.5) * 1.0, z: o.v.fz + 6 + row * 2.8 + (rr() - 0.5) * 1.0, ry: Math.PI / 2 + (rr() - 0.5) * 0.6, d: rr() }); } }

// ───────────────────────── "picture this": 100 customers, each owed one coin, and a glass vault that holds 100 coins (then only 60)
const DPY = 0.3;
{ const b = new GB(); b.box(38, DPY, 34, 0xF1ECE2, DM[0], DPY / 2, DM[1]); b.box(38.6, 0.12, 34.6, 0xD6CEBC, DM[0], 0.06, DM[1]); for (let i = 0; i < 10; i++) b.box(0.08, 0.02, 15, 0xDDD4C4, DM[0] - 6.75 + i * 1.5, DPY + 0.01, DM[1] + 4); const m = b.mesh(); m.receiveShadow = true; scene.add(m); }
const gv = glassVault(14, 9, 5.2); gv.position.set(DM[0], DPY, DM[1] - 11); gv.children.forEach(c => { c.castShadow = true; c.receiveShadow = true; }); scene.add(gv);
stat.push([DM[0] - 8, DM[0] + 8, DM[1] - 16.5, DM[1] - 5.5, DPY + 7, 'glass vault']);
const GVY = DPY + gv.userData.floorY + 0.1;
const DCOIN = (i) => [DM[0] - 5.85 + (i % 10) * 1.3, GVY, DM[1] - 11 + 3.4 - Math.floor(i / 10) * 0.75];   // row 0 nearest the front glass
const DPER = (i) => [DM[0] - 6.75 + (i % 10) * 1.5, DPY, DM[1] - 3 + Math.floor(i / 10) * 1.6];            // row 0 nearest the vault
const vcoins = new THREE.InstancedMesh(BIGCOIN(0.48, 0.16), GOLD, 100); vcoins.frustumCulled = false; vcoins.castShadow = true; scene.add(vcoins);
const XG = (() => { const b = new GB(); b.box(0.9, 0.2, 0.06, 0xFFFFFF, 0, 0, 0, 0, 0, Math.PI / 4); b.box(0.9, 0.2, 0.06, 0xFFFFFF, 0, 0, 0, 0, 0, -Math.PI / 4); return b.geo(); })();
const xMarks = new THREE.InstancedMesh(XG, new THREE.MeshBasicMaterial({ color: 0xFF5A4A, toneMapped: false }), 40); xMarks.frustumCulled = false; scene.add(xMarks);
const serveT = i => lerp(T.serveA, T.serveB, Math.floor(i / 10) / 10 + (i % 10) * 0.004);
const serve2T = i => i < 60 ? lerp(T.serve2A, T.serve2B, Math.floor(i / 10) / 6 + (i % 10) * 0.006) : 1e9;
const popIn = (t, i) => back(seg(t, T.n100a + Math.floor(i / 10) * 0.07 + (i % 10) * 0.012, T.n100a + 0.3 + Math.floor(i / 10) * 0.07 + (i % 10) * 0.012));

// ───────────────────────── the thieves' wallets (dark cases under a storm), the ice, the coins still moving, the swap ring
const NWAL = 9, FROZ = [0, 2, 5, 7];             // four of nine frozen (about 45%)
const WPOS = Array.from({ length: NWAL }, (_, i) => { const rr = rng(500 + i); return [TW[0] + (i % 3 - 1) * 13 + (rr() - .5) * 3, 50 + Math.floor(i / 3) * 9 + rr() * 2, TW[1] + (Math.floor(i / 3) - 1) * 6 + (rr() - .5) * 4]; });
const WALG = (() => { const b = new GB(); b.box(5.2, 3.6, 1.6, 0x23262E, 0, 0, 0); b.box(5.3, 0.5, 1.7, 0x3A3F4A, 0, 1.2, 0); b.box(1.6, 0.4, 1.75, 0xFF4A3A, 0, 0.3, 0); b.box(0.5, 0.9, 1.72, 0x15171C, -2.1, -0.4, 0); return b.geo(); })();
const slotM = new THREE.MeshBasicMaterial({ color: 0xFF5A3A, toneMapped: false });
const wallets = WPOS.map((p, i) => { const g = new THREE.Group(), m = new THREE.Mesh(WALG, MAT); m.castShadow = true; g.add(m); const sl = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.42, 1.8), slotM); sl.position.y = 0.3; g.add(sl); g.position.set(...p); g.rotation.y = 0.15 + (i % 3) * 0.12; g.scale.setScalar(1.6); scene.add(g); return g; });
const iceM = new THREE.MeshLambertMaterial({ color: 0xBFEFFF, emissive: 0x2A6A8A, emissiveIntensity: 0.35, transparent: true, opacity: 0.62, depthWrite: false });
const ices = FROZ.map(i => { const m = new THREE.Mesh(new THREE.IcosahedronGeometry(6.8, 0), iceM); m.position.set(...WPOS[i]); m.scale.setScalar(0.01); m.visible = false; m.renderOrder = 3; scene.add(m); return m; });
stat.push([TW[0] - 28, TW[0] + 28, TW[1] - 20, TW[1] + 20, 100, 'wallets']);
const storm = []; for (let i = 0; i < 4; i++) { const m = cloud(R); m.position.set(TW[0] - 30 + i * 20, 104 + R() * 6, TW[1] - 40 + R() * 10); m.scale.setScalar(3.4); m.userData.x0 = m.position.x; scene.add(m); storm.push(m); }
const ringM = new THREE.MeshBasicMaterial({ color: 0x9A7BFF, transparent: true, opacity: 0.9, toneMapped: false });
const ring = new THREE.Mesh(new THREE.TorusGeometry(9, 0.9, 10, 40), ringM); ring.position.set(...RING); scene.add(ring);
const ringGlow = new THREE.Mesh(new THREE.CircleGeometry(8.6, 32), new THREE.MeshBasicMaterial({ map: radial('rgba(170,140,255,0.85)', 'rgba(120,90,255,0)'), transparent: true, depthWrite: false, toneMapped: false, blending: THREE.AdditiveBlending })); ringGlow.position.copy(ring.position); scene.add(ringGlow);
const NMV = 90, COING = BIGCOIN(0.95, 0.3);
const PURPLE = new THREE.MeshLambertMaterial({ color: 0xA98BFF, emissive: 0x4A2AAA, emissiveIntensity: 0.6 });
const coinsMv = new THREE.InstancedMesh(COING, GOLD, NMV), coinsOut = new THREE.InstancedMesh(COING, PURPLE, NMV); coinsMv.frustumCulled = coinsOut.frustumCulled = false; scene.add(coinsMv, coinsOut);
const FREE = [1, 3, 4, 6, 8];
const NR = 40, coinsR = new THREE.InstancedMesh(COING, GOLD, NR); coinsR.castShadow = true; coinsR.frustumCulled = false; scene.add(coinsR);

// ───────────────────────── street life, clouds, sparkles
const lampHeads = new GB();
for (const z of [-30, -46, -62]) for (const s of [-1, 1]) { const l = lamp(6.2); l.position.set(s * 38, 0, z); l.rotation.y = s > 0 ? Math.PI : 0; scene.add(l); lampHeads.box(0.6, 0.12, 0.36, 0xFFFFFF, s * 38 - s * 1.25, 6.02, z); }
const lampM = new THREE.MeshLambertMaterial({ color: 0xFFF1C8, emissive: 0xFFD27A, emissiveIntensity: 0 }); scene.add(new THREE.Mesh(lampHeads.geo(), lampM));
for (const [x, z] of [[-41, -14], [41, -12], [-41, -70], [41, -72], [-60, -40], [-120, -60], [-130, -110], [104, -80], [104, -20], [-140, -30], [30, 24], [-30, 26]]) { const m = bushTree(5.5 + R() * 2, R); m.position.set(x, 0, z); scene.add(m); }
const CARS = [[0xC8423A, -134, 1, 8, 0], [0x2F6FB8, -130, -1, 9, 40], [0xE9C46A, 4, 1, 7, 150], [0x4C9A62, 8, -1, 8, 230], [0xEDEDED, -134, 1, 8.6, 300], [0x7A4FA0, 8, -1, 7, 90]].map(([col, z, dir, v, off]) => { const m = car(col, { boxy: true }); scene.add(m); return { m, z, dir, v, off }; });
const guards = [[-10, VF + 4.2], [10, VF + 4.2]].map(([x, z], i) => { const m = person(modern(i + 6, { robe: 0x2B2F3A })); m.position.set(x, 1.2, z); m.rotation.y = -Math.PI / 2; scene.add(m); return m; });
const clouds = []; for (let i = 0; i < 18; i++) { const m = cloud(R); const far = i >= 10; m.position.set(far ? -500 + R() * 1100 : -260 + i * 60 + R() * 20, 80 + R() * 40, far ? -560 + R() * 200 : -340 + R() * 300); m.scale.setScalar(2.0 + R() * 2.2); m.userData.x0 = m.position.x; scene.add(m); clouds.push(m); }
const sparkT = (() => { const cv = document.createElement('canvas'); cv.width = cv.height = 64; const g = cv.getContext('2d'); g.translate(32, 32); g.fillStyle = '#fff'; for (let k = 0; k < 2; k++) { g.rotate(Math.PI / 2 * k); g.beginPath(); g.moveTo(0, -30); g.quadraticCurveTo(3, -3, 30, 0); g.quadraticCurveTo(3, 3, 0, 30); g.quadraticCurveTo(-3, 3, -30, 0); g.quadraticCurveTo(-3, -3, 0, -30); g.fill(); } const tx = new THREE.CanvasTexture(cv); tx.colorSpace = THREE.SRGBColorSpace; return tx; })();
const sparks = []; for (let i = 0; i < 70; i++) { const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: sparkT, color: 0xFFE9A8, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false })); sp.userData = { ph: R() * 6.28, w: 3 + R() * 4, dx: (R() - 0.5) * 2, dz: (R() - 0.5) * 2, k: R() }; scene.add(sp); sparks.push(sp); }

// ───────────────────────── camera path (spherical keys around a target; `up` tilts the view so the subject sits lower in the frame)
const LOCKV = [0, LBY - 1, LBZ];
const CAM = [
  { t: 0, tg: [0, 9, -62], d: 124, az: -16, el: 15, up: 0.1 },                                          // the cover: the vault, the queue, customers walking off with coins
  { t: T.bigOut, tg: [0, 8, -62], d: 112, az: -13, el: 13, up: 0.09, mv: 1 },
  { t: T.hours1 + 0.2, tg: [0, 6, -60], d: 76, az: -6, el: 12, up: 0.07, mv: 1 },                       // closer: the stream out of the round door
  { t: T.reopening + 0.25, tg: [0, 15, -72], d: 70, az: 8, el: 9, up: 0.05, mv: 1 },                    // the locks over the door: four open
  { t: T.theft2 + 0.3, tg: [0, 15, -72], d: 64, az: 14, el: 9, up: 0.05 },
  { t: T.there3, tg: [0, 14, -72], d: 60, az: 10, el: 10, up: 0.05 },                                     // was the money there? (a question mark over the door)
  { t: T.b4 + 0.2, tg: [-50, 22, -86], d: 100, az: -16, el: 24, up: 0.03, mv: 1 },                      // crane west over the roofs, into the past
  { t: T.gox + 0.2, tg: [(MG[0] + FX[0]) / 2, 9, -80], d: 124, az: -3, el: 13, up: 0.06, mv: 1 },      // the old square: two shut vaults
  { t: T.wasnt + 0.4, tg: [(MG[0] + FX[0]) / 2, 8, -79], d: 112, az: 0, el: 12, up: 0.06, mv: 1 },
  { t: T.years + 0.45, tg: [(MG[0] + FX[0]) / 2, 8, -79], d: 106, az: 4, el: 12, up: 0.06 },
  { t: T.b5 + 0.15, tg: [-80, 150, -60], d: 40, az: 24, el: -40, up: 0, mv: 1 },                        // sky wipe east
  { t: T.n100a + 0.1, tg: [DM[0] + 10, 130, DM[1]], d: 40, az: 30, el: -34, up: 0, mv: 1 },
  { t: T.owed + 0.3, tg: [DM[0], 2.4, DM[1] - 3], d: 48, az: 24, el: 30, up: 0.04, mv: 1 },            // down to the model: 100 customers, 100 coins
  { t: T.line6 + 0.4, tg: [DM[0], 2.4, DM[1] - 3], d: 45, az: 16, el: 32, up: 0.04 },
  { t: T.nothing + 0.6, tg: [DM[0], 2.4, DM[1] - 2], d: 43, az: 6, el: 34, up: 0.04 },
  { t: T.refilled + 0.35, tg: [-12, 9, -70], d: 84, az: -30, el: 14, up: 0.04, mv: 1 },                // back to Binance's vault: the reserve chest refills it
  { t: T.money8 + 0.55, tg: [-12, 9, -70], d: 80, az: -36, el: 14, up: 0.04 },
  { t: T.rush + 0.2, tg: [0, 8, -64], d: 104, az: -12, el: 15, up: 0.1, mv: 1 },                       // wide: the run, about two in every 100
  { t: T.n100c + 0.4, tg: [0, 8, -64], d: 98, az: -6, el: 15, up: 0.1 },
  { t: T.four + 0.2, tg: [0, 21, -75], d: 64, az: 8, el: 9, up: -0.03, mv: 1 },                         // the bar of locks: the rest open, then the last
  { t: T.off + 0.35, tg: [0, 21, -75], d: 58, az: -5, el: 9, up: -0.03 },
  { t: T.half + 0.2, tg: [-10, 62, -170], d: 118, az: -2, el: 20, up: 0.02, mv: 1 },                    // up over the vault to the thieves' wallets at night
  { t: T.frozen + 0.35, tg: [TW[0] + 2, 68, TW[1]], d: 124, az: 9, el: 6, up: 0.02, mv: 1 },
  { t: T.over + 0.5, tg: [TW[0] + 2, 68, TW[1]], d: 114, az: 3, el: 6, up: 0.02 },
  { t: T.story + 0.9, tg: [0, 14, -84], d: 262, az: 18, el: 18, up: 0.14, mv: 3 },                     // wide over the city at dusk
  { t: T.cta - 0.4, tg: [0, 14, -84], d: 250, az: 14, el: 18, up: 0.14 },
  { t: T.comment + 0.2, tg: [0, 8, -62], d: 96, az: -10, el: 12, up: 0.09, mv: 1 },                    // back down to the plaza: the run
  { t: DUR + 0.5, tg: [0, 8, -62], d: 90, az: -15, el: 12, up: 0.09 },
];
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
.card{font:700 32px/1.3 'Figtree',sans-serif;color:#fff;background:rgba(8,10,26,.88);border:2px solid rgba(255,225,160,.65);padding:18px 28px;border-radius:22px;text-align:center;white-space:pre;box-shadow:0 12px 34px rgba(5,7,20,.5);}
.card em{font-style:normal;color:#FFC84A;} .card small{display:block;margin-top:10px;font:600 18px/1 'Inter',sans-serif;letter-spacing:.08em;color:rgba(255,255,255,.6);}
.qm{font:900 190px/1 'Fraunces',serif;color:#FFC84A;text-shadow:0 0 34px rgba(5,7,20,.85),0 6px 0 rgba(5,7,20,.6);}
.tag.ice{color:#0B3444;background:#BFEFFF;border-color:#BFEFFF;} .tag.ice b{color:#0B3444;}
.tag.red{color:#fff;background:#D9483B;border-color:#D9483B;} .tag.red b{color:#fff;}
.pc{text-align:center;background:rgba(8,10,26,.9);border:2px solid rgba(255,225,160,.65);padding:24px 30px 20px;border-radius:26px;box-shadow:0 14px 40px rgba(5,7,20,.5);}
.pc .g{display:grid;grid-template-columns:repeat(10,26px);gap:9px;justify-content:center;}
.pc .g i{width:26px;height:26px;border-radius:50%;background:#F7A600;box-shadow:0 0 8px rgba(247,166,0,.55);}
.pc .g i.out{background:#FF6B5B;box-shadow:0 0 14px rgba(255,90,70,.95);}
.pc .t{margin-top:16px;font:800 40px/1 'Figtree',sans-serif;color:#fff;} .pc .t em{font-style:normal;color:#FF6B5B;}
.pc .s{margin-top:12px;font:600 18px/1.35 'Inter',sans-serif;letter-spacing:.05em;color:rgba(255,255,255,.62);white-space:pre;}
.hookbg{width:1080px;height:820px;background:radial-gradient(ellipse 62% 44% at 50% 50%,rgba(12,8,20,.72) 0%,rgba(12,8,20,.52) 55%,rgba(12,8,20,0) 100%);}
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
const hookBg = TIM.hook ? mk('hookbg', '') : null;
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
const cardRun = mk('card', `first 9½ hours · 1 Nov 2026\n<em>$4.65B</em> out · <em>$1.01B</em> in<small>BINANCE'S FIGURES · REUTERS, THE BLOCK</small>`);
const tagBin = mk('name', '<div class="n">Binance</div><div class="r">crypto exchange</div>'), tagOpen = mk('tag am', 'reopening · 1 Nov'), tagTheft = mk('tag red', 'biggest crypto theft · <b>$6.3B</b> · 29 Oct');
const qm = mk('qm', '?');
const tagGox = mk('tag', 'MT. GOX · 2014'), tagFtx = mk('tag', 'FTX · 2022');
const tagGoxE = mk('tag red', 'about <b>850,000</b> bitcoins missing'), tagFtxE = mk('tag red', 'up to <b>$8B</b> short');
const yrGox = mk('tag grey', ''), yrFtx = mk('tag grey', '');
const tagOwed = mk('tag am', 'owed · <b>100</b> coins'), tagIn = mk('tag', ''), tagAll = mk('tag am', 'everyone paid ✓'), tagNo = mk('tag red', '<b>40</b> get nothing');
const tagChest = mk('tag am', "Binance's own money"), cardRefill = mk('card', `refilled with company money:\ntreasury, user fund, insurance fund<small>BINANCE · VIA REUTERS · 1 NOV 2026</small>`);
const pc = mk('pc', `<div class="g">${Array.from({ length: 100 }, (_, i) => `<i${i >= 98 ? ' class="out"' : ''}></i>`).join('')}</div><div class="t">about <em>2</em> in every 100</div><div class="s">net $3.64B out of $171B held · 1 Nov 2026\nBinance's figures, via Reuters and The Block</div>`);
const pcDots = Array.from(pc.querySelectorAll('.g i'));
const tagLast = mk('tag am', 'the last lock'), cardLift = mk('card', `withdrawal suspension\n<em>fully lifted</em><small>BINANCE · VIA REUTERS · THU 26 NOV 2026</small>`);
const tagIce = mk('tag ice', 'frozen · about <b>$2.85B</b>'), tagMove = mk('tag am', 'never frozen · still moving'), tagSwap = mk('tag', '<b>$600M+</b> through one swap service');
const title = mk('title', '<div class="s">THE STORY OF</div><div class="n">The Run After\nthe <em>Heist</em></div>');
const lesson = mk('lesson', `A promise is only as good\nas the <em>vault</em>.`);
const ctaChip = mk('chip am', 'what about you?');
const boxes = [0, 1].map(() => { const e = mk('cbox', '<span class="in"></span><span class="post">Post</span>'); return { e, inn: e.querySelector('.in'), post: e.querySelector('.post') }; });
const foot = document.getElementById('foot');
foot.textContent = "1 Nov 2026: $4.65B out, $1.01B in (net $3.64B of $171B), Binance's figures via Reuters, The Block\nMt. Gox: TechCrunch, AP, Bloomberg · FTX: The Block, ABC, Bloomberg · as of 27 Nov 2026 · not advice";
const setTxt = (e, s) => { if (e.textContent !== s) e.textContent = s; };
const setHTML = (e, s) => { if (e._h !== s) { e._h = s; e.innerHTML = s; } };
const p3 = (p, o = 1) => { const q = proj(p[0], p[1], p[2]); return [q[0], q[1], q[2] ? o : 0]; };

function updateUI(t) {
  updateCaption(t);
  foot.style.opacity = (0.95 * seg(t, 3.0, 3.6) * (1 - seg(t, T.cta, T.cta + 0.3) * 0.45)).toFixed(3);
  // 1 — the hook card (0-1.5 s, the cover), then the big number (1.5-3 s)
  if (hookBg) put(hookBg, W / 2, 640, 1 - seg(t, T.hookEnd - 0.05, T.hookEnd + 0.2));
  if (hookEl) { const out = seg(t, T.hookEnd, T.hookEnd + (TIM.big ? 0.22 : 0.3)); put(hookEl, W / 2, 640 - 40 * eo(out), 1 - out, 1 + 0.035 * seg(t, 0, T.hookEnd) + 0.06 * out); }
  if (bigEl) { const o = win(t, T.bigIn, T.bigOut - 0.05, 0.15, 0.25), u = eo(seg(t, T.bigIn + 0.05, T.bigIn + 0.7)), land = seg(t, T.bigIn + 0.7, T.bigIn + 1.0), sh = (1 - land) * (land > 0 ? 1 : 0);
    bigBg.style.opacity = (0.92 * o).toFixed(3); setHTML(BIGN.v, bigText(u)); BIGN.line.style.strokeDashoffset = (BIGN.len * (1 - eo(seg(t, T.bigIn, T.bigIn + 0.9)))).toFixed(1);
    put(bigEl, W / 2 + Math.sin(t * 90) * 7 * sh, 860 + Math.cos(t * 77) * 5 * sh, o, pop(t, T.bigIn, 0.4) * (1 + 0.05 * Math.sin(Math.PI * land))); }
  // chips (one line at the top that says where we are)
  let ct = '', co = 0, cp = 0;
  const CH = [[T.bigOut + 0.05, T.b2 - 0.1, 'Binance · Sun 1 Nov 2026'], [T.b2 + 0.05, T.b3 - 0.1, 'two days after the theft'], [T.b3 + 0.05, T.b4 - 0.1, 'Binance · 1 Nov 2026'],
    [T.b4 + 0.6, T.b5 - 0.2, 'the last times · 2014 & 2022'], [T.b5 + 0.5, T.b8 - 0.1, 'picture this'], [T.b8 + 0.05, T.b9 - 0.1, 'Binance says'], [T.b9 + 0.05, T.b10 - 0.1, "Binance's figures · 1 Nov"],
    [T.b10 + 0.05, T.b11 - 0.1, 'Thu 26 Nov 2026'], [T.b11 + 0.6, T.b12 - 0.1, 'the stolen money'], [T.b12 + 0.05, T.b13 - 0.1, 'as of 27 Nov 2026']];
  for (const [a, b, s] of CH) { const o = win(t, a, b, 0.22, 0.22); if (o > co) { co = o; ct = s; cp = pop(t, a); } }
  if (ct) setTxt(chip, ct); put(chip, W / 2, 472, co, cp);
  // 1 — gross and net of the first nine and a half hours
  put(cardRun, W / 2, 1330, win(t, T.bigOut + 0.15, T.b2 - 0.05, 0.3, 0.3), pop(t, T.bigOut + 0.15));
  // 2 — Binance; four locks open; the theft two days before
  { const p = p3([0, 40, V[1]], win(t, T.binance2, T.b3 + 0.2, 0.25, 0.3)); put(tagBin, clampX(p[0], 260), clampY(p[1], 640, 1200), p[2], pop(t, T.binance2)); }
  { const p = p3([-12, LBY + 3.2, LBZ], win(t, T.reopening, T.b3 - 0.1, 0.25, 0.3)); put(tagOpen, clampX(p[0], 200), clampY(p[1], 640, 1300), p[2], pop(t, T.reopening)); }
  put(tagTheft, W / 2, 1330, win(t, T.biggest2, T.b3 + 0.3, 0.25, 0.3), pop(t, T.biggest2));
  // 3 — was the money still there?
  { const p = p3([DOOR[0], DOOR[1] + 2, DOOR[2] + 2], win(t, T.money3 - 0.05, T.there3 + 0.3, 0.2, 0.25)); put(qm, clampX(p[0], 160), clampY(p[1], 640, 1300), p[2], pop(t, T.money3 - 0.05, 0.4) * (1 + 0.05 * Math.sin(t * 6))); }
  // 4 — Mt. Gox and FTX: shut, empty, and the years of waiting
  OLD.forEach((o, i) => { const tn = i ? T.ftx : T.gox, top = [o.x, 21, o.z + 4];
    { const p = p3(top, win(t, tn, T.b5 - 0.25, 0.25, 0.25)); put(i ? tagFtx : tagGox, clampX(p[0], 170), clampY(p[1], 640, 1300), p[2], pop(t, tn)); }
    { const p = p3([o.x, o.v.dy - 2.5, o.v.fz + 6], win(t, T.wasnt + i * 0.12, T.waited - 0.1, 0.25, 0.25)); put(i ? tagFtxE : tagGoxE, clampX(p[0], i ? 200 : 300), clampY(p[1] + (i ? 60 : -60), 760, 1400), p[2], pop(t, T.wasnt + i * 0.12)); }
    { const y0 = i ? 2022 : 2014, y1 = i ? 2025 : 2024, u = eio(seg(t, T.lapseA + 0.1, T.years + 0.4)), yr = Math.round(lerp(y0, y1, u)), e = i ? yrFtx : yrGox;
      setHTML(e, `${y0} → <b>${yr}</b>`); const p = p3([o.x, o.v.dy - 2.5, o.v.fz + 6], win(t, T.waited - 0.05, T.b5 - 0.2, 0.25, 0.25)); put(e, clampX(p[0], 200), clampY(p[1] + (i ? 60 : -60), 760, 1400), p[2], pop(t, T.waited - 0.05)); } });
  // 5-7 — the model: owed 100, in the vault 100 (then 60), everyone paid, 40 get nothing
  { const p = p3([DM[0] + 7.5, 4.4, DM[1] + 8], win(t, T.owed - 0.05, T.b8 - 0.15, 0.25, 0.25)); put(tagOwed, clampX(p[0], 220), clampY(p[1], 640, 1300), p[2], pop(t, T.owed - 0.05)); }
  { const sixty = t >= T.reset; setHTML(tagIn, `in the vault · <b>${sixty ? 60 : 100}</b>`); const p = p3([DM[0], DPY + 7.6, DM[1] - 11], win(t, T.coin5 - 0.05, T.b8 - 0.15, 0.25, 0.25)); put(tagIn, clampX(p[0], 200), clampY(p[1], 640, 1300), p[2], pop(t, sixty ? T.reset : T.coin5 - 0.05)); }
  { const p = p3([DM[0] + 8.5, 4.5, DM[1] + 4], win(t, T.line6 - 0.1, T.reset - 0.05, 0.25, 0.15)); put(tagAll, clampX(p[0], 200), clampY(p[1], 640, 1380), p[2], pop(t, T.line6 - 0.1)); }
  { const p = p3([DM[0] - 3, 3.6, DM[1] + 12.5], win(t, T.nothing - 0.05, T.b8 - 0.1, 0.25, 0.25)); put(tagNo, clampX(p[0], 220), clampY(p[1] + 40, 1340, 1440), p[2], pop(t, T.nothing - 0.05)); }
  // 8 — the reserve chest refills the vault
  { const p = p3([RC[0], 8.5, RC[1]], win(t, T.own - 0.05, T.b9 - 0.1, 0.25, 0.25)); put(tagChest, clampX(p[0], 200), clampY(p[1], 640, 1300), p[2], pop(t, T.own - 0.05)); }
  put(cardRefill, W / 2, 1340, win(t, T.refilled + 0.1, T.b9 - 0.1, 0.3, 0.3), pop(t, T.refilled + 0.1));
  // 9 — about two in every 100
  { const o = win(t, T.rush - 0.05, T.b10 - 0.1, 0.3, 0.3), u = seg(t, T.two, T.two + 0.5); pcDots.forEach((d, i) => { if (i >= 98) { d.style.opacity = (1 - 0.65 * u).toFixed(2); d.style.transform = `translateY(${(-26 * eo(u)).toFixed(1)}px)`; } }); put(pc, W / 2, 1220, o, pop(t, T.rush - 0.05)); }
  // 10 — the last lock; the suspension fully lifted
  { const L = LOCKS[NL - 1], p = p3([L.x, LBY + 3.2, LBZ], win(t, T.lock - 0.3, T.b11 - 0.1, 0.25, 0.3)); put(tagLast, clampX(p[0], 200), clampY(p[1], 640, 1300), p[2], pop(t, T.lock - 0.3)); }
  put(cardLift, W / 2, 1330, win(t, T.lockLast + 0.15, T.b11 - 0.05, 0.3, 0.3), pop(t, T.lockLast + 0.15));
  // 11 — frozen vs still moving; the swap service
  { const p = p3([WPOS[2][0] - 6, WPOS[2][1] + 9, WPOS[2][2]], win(t, T.frozen, T.b13 - 0.2, 0.25, 0.3)); put(tagIce, clampX(p[0], 260), clampY(p[1], 640, 1300), p[2], pop(t, T.frozen)); }
  { const p = p3([WPOS[4][0], WPOS[4][1] - 9, WPOS[4][2]], win(t, T.still11 - 0.05, T.b13 - 0.2, 0.25, 0.3)); put(tagMove, clampX(p[0], 300), clampY(p[1], 700, 1380), p[2], pop(t, T.still11 - 0.05)); }
  { const p = p3([RING[0] + 2, RING[1] + 14, RING[2]], win(t, T.moving, T.b13 - 0.2, 0.25, 0.3)); put(tagSwap, clampX(p[0], 340), clampY(p[1], 640, 1300), p[2], pop(t, T.moving)); }
  // 13 — title and lesson; 14 — the question
  put(title, W / 2, 640, win(t, T.story, T.cta - 0.1, 0.4, 0.3), 0.94 + 0.06 * eo(seg(t, T.story, T.story + 0.6)));
  put(lesson, W / 2, 1180, win(t, T.promise, T.cta - 0.15, 0.3, 0.25), pop(t, T.promise));
  put(ctaChip, W / 2, 472, seg(t, T.would, T.would + 0.3), pop(t, T.would));
  [[T.pullW, 'PULL', T.postA], [T.waitW, 'WAIT', T.postB]].forEach(([t0, word, tp], i) => {
    const bx = boxes[i], L = word.length, n = Math.min(L, Math.floor(c01((t - t0) / (0.1 * L)) * (L + 0.001))), typed = word.slice(0, n), caret = (n < L || Math.floor(t * 2.4) % 2) && t < tp ? '<i></i>' : '';
    setHTML(bx.inn, typed ? `<b>${typed}</b>${caret}` : `<em>Add a comment…</em>${caret}`); const sent = t > tp; const pcl = sent ? 'post on sent' : n === L ? 'post on' : 'post'; if (bx.post.className !== pcl) bx.post.className = pcl; setTxt(bx.post, sent ? 'Posted ✓' : 'Post');
    const ts = i ? T.waitW - 0.35 : T.comment; put(bx.e, W / 2, 1300 + i * 132, seg(t, ts, ts + 0.3), pop(t, ts) * (1 + 0.06 * win(t, tp, tp + 0.3, 0.08, 0.2)));
  });
}

// ───────────────────────── one frame
const hopY = (hops, t, h = 0.5) => { let y = 0; for (const t0 of hops) { const u = (t - t0) / 0.38; if (u > 0 && u < 1) y = Math.max(y, Math.sin(u * Math.PI) * h); } return y; };
const lockU = (L, t) => L.tOpen < 0 ? 1 : seg(t, L.tOpen, L.tOpen + 0.35);
function renderAt(t) {
  const s = skyAt(t), night = s.glow;
  paintSky(s);
  scene.fog.color.setRGB(...s.fog); scene.fog.near = s.fn; scene.fog.far = s.ff;
  // years pass (a time-lapse of days over the old square): the light pulses and the sun swings round
  const lapse = win(t, T.lapseA, T.lapseB, 0.3, 0.4), pulse = lapse * (0.5 - 0.5 * Math.cos((t - T.lapseA) * Math.PI * 2 * 1.4));
  hemi.color.setRGB(...s.hemS); hemi.groundColor.setRGB(...s.hemG); hemi.intensity = s.hemI * (1 - 0.45 * pulse);
  sun.color.setRGB(...s.sunC); sun.intensity = s.sunI * (1 - 0.7 * pulse);
  const az = (s.az + 540 * eio(seg(t, T.lapseA, T.lapseB))) * Math.PI / 180, el = s.el * Math.PI / 180, sd = [Math.cos(el) * Math.sin(az), Math.sin(el), Math.cos(el) * Math.cos(az)];
  starM.opacity = Math.max(s.star, pulse * 0.6) * 0.9; stars.visible = starM.opacity > 0.01;
  setCamera(t);
  lampM.emissiveIntensity = night * 1.4; WIN_LIT.emissiveIntensity = night * 0.9;
  // the vault: its heap glows (brighter when the reserve refills it); the locks over the door
  { const k = 0.75 + 0.25 * eio(seg(t, T.refillA + 0.4, T.refillB)); heapM.opacity = k; heapCoins.scale.setScalar(0.92 + 0.08 * k); doorGlow.material.opacity = 0.35 + 0.35 * night + 0.2 * k; }
  for (const L of LOCKS) { const u = lockU(L, t), hop = L.tOpen > 0 ? hopY([L.tOpen], t, 0.6) : hopY([T.reopening + 0.08 * LOCKS.indexOf(L)], t, 0.45);
    L.piv.position.y = 0.5 + 0.38 * eo(u); L.piv.rotation.y = 1.3 * eo(u); L.mat.color.setRGB(lerp(0.85, 0.25, u), lerp(0.28, 0.68, u), lerp(0.23, 0.42, u)); L.mat.emissive.setRGB(lerp(0.42, 0.08, u), lerp(0.1, 0.35, u), lerp(0.07, 0.16, u));
    L.g.position.y = LBY - 0.25 + hop; }
  // the reserve chest opens while it refills the vault
  chest.userData.lid.rotation.x = -1.2 * eio(win(t, T.refillA - 0.3, T.refillB, 0.4, 0.5));
  // the old vaults: chained shut, then open on nothing; the crowd sits down as the years pass
  OLD.forEach((o, i) => { const u = eio(seg(t, T.openPast + i * 0.12, T.openPast + 0.9 + i * 0.12)); o.door.userData.pivot.rotation.y = -1.6 * u; o.chain.position.y = o.v.dy - 14 * u * u; o.chain.rotation.z = 0.9 * u; o.chain.visible = u < 0.98; });
  // people
  crowd.begin(); greyCrowd.begin(); let nh = 0;
  const addCoin = (x, y, z, sc = 1, spin = 0) => { if (nh >= NHC) return; _e.set(Math.PI / 2, spin, 0, 'YXZ'); _q.setFromEuler(_e); _p.set(x, y, z); _s.setScalar(sc); headCoins.setMatrixAt(nh++, _m4.compose(_p, _q, _s)); };
  {
    for (const e of EXIT) { const q = exitPos(e, t); if (!q) continue; const bob = Math.abs(Math.sin(t * 7 + e.ph)) * 0.12; crowd.add(e.v, q[0], q[1] + bob, q[2], q[3], 1.0 * Math.max(0.02, q[4])); addCoin(q[0], q[1] + 2.25 + bob, q[2], Math.max(0.02, q[4]), t * 3 + e.ph); }
    const qoff = (t * 0.55) % 1.25;
    for (let i = 0; i < NQ; i++) { const q = qAt(i * 1.25 - qoff + 0.6); crowd.add(i * 7, q[0], Math.abs(Math.sin(t * 2 + i)) * 0.03, q[1], q[2], 1.0); }
  }
  for (const c of PASTC) { const sit = eio(seg(t, T.lapseA + c.d * 0.8, T.lapseA + 0.6 + c.d * 0.8)); crowd.add(c.v, c.x, -0.35 * sit, c.z, c.ry, 1.0, 1 - 0.3 * sit); }
  { let nx = 0;
    for (let i = 0; i < 100; i++) { const k = popIn(t, i); if (k <= 0.001) continue; const [x, y, z] = DPER(i), lost = i >= 60 && t >= T.noX + (i - 60) * 0.008, hop = hopY([serveT(i) + 0.45, serve2T(i) + 0.45], t, 0.35);
      if (lost) greyCrowd.add(i, x, y, z, Math.PI / 2, 0.9 * k, 0.94); else crowd.add(i * 3, x, y + hop, z, Math.PI / 2, 0.9 * k);
      // the head coin: flies from the vault at serve time (first round: everyone; second round: the first 60)
      const ts = t < T.reset ? serveT(i) : serve2T(i);
      if (t >= ts) { const u = c01((t - ts) / 0.45), a = DCOIN(i), hy = y + 2.05 + hop, sc = (t < T.reset ? 1 - seg(t, T.reset - 0.15, T.reset) : 1) * 1.0;
        if (sc > 0.02) addCoin(lerp(a[0], x, u), lerp(a[1], hy, u) + Math.sin(u * Math.PI) * 3, lerp(a[2], z, u), sc, t * 3 + i); }
      if (lost && nx < 40) { const xs = back(seg(t, T.noX + (i - 60) * 0.008, T.noX + 0.25 + (i - 60) * 0.008)); _p.set(x, 2.7, z); _s.setScalar(Math.max(0.001, xs) * 1.1); xMarks.setMatrixAt(nx++, _m4.compose(_p, camera.quaternion, _s)); } }
    xMarks.count = nx; xMarks.instanceMatrix.needsUpdate = true;
    // the vault's coins: 100 pop in; they leave as each customer is paid; 60 come back for the second picture
    let nv = 0; for (let i = 0; i < 100; i++) { const [x, y, z] = DCOIN(i); let k;
      if (t < T.reset) k = back(seg(t, T.coin5 + i * 0.006, T.coin5 + 0.3 + i * 0.006)) * (t < serveT(i) ? 1 : 0);
      else k = i < 60 ? back(seg(t, T.reset + i * 0.004, T.reset + 0.3 + i * 0.004)) * (t < serve2T(i) ? 1 : 0) : 0;
      if (k <= 0.001) continue; _e.set(0, i * 0.7, 0); _q.setFromEuler(_e); _p.set(x, y + 0.08, z); _s.setScalar(k); vcoins.setMatrixAt(nv++, _m4.compose(_p, _q, _s)); }
    vcoins.count = nv; vcoins.instanceMatrix.needsUpdate = true;
  }
  crowd.end(); greyCrowd.end(); headCoins.count = nh; headCoins.instanceMatrix.needsUpdate = true;
  // the thieves' wallets: four freeze; coins keep moving between the others and through the swap ring (coming out a different colour); hidden until we go there
  const thv = t > T.b11 - 0.6 && t < T.cta, tk = eo(seg(t, T.b11 - 0.6, T.b11 + 0.3)); wallets.forEach(w => { w.visible = thv; w.scale.setScalar(1.6 * Math.max(0.01, tk)); }); ring.scale.setScalar(Math.max(0.01, tk)); ring.visible = ringGlow.visible = coinsMv.visible = coinsOut.visible = thv; storm.forEach(c => { c.visible = thv; });
  { let nm = 0, no = 0;
    ices.forEach((m, k) => { const u = back(seg(t, T.freeze + k * 0.12, T.freeze + 0.5 + k * 0.12)); m.visible = thv && u > 0.01; m.scale.setScalar(Math.max(0.01, u)); m.rotation.set(t * 0.1 + k, t * 0.15, 0); });
    wallets.forEach((w, i) => { const fr = FROZ.includes(i) && t > T.freeze + 0.3; w.position.y = WPOS[i][1] + (fr ? 0 : Math.sin(t * 1.3 + i) * 0.8); w.rotation.y = 0.15 + (i % 3) * 0.12 + (fr ? 0 : Math.sin(t * 0.7 + i) * 0.15); });
    for (let j = 0; j < NMV; j++) { const a = FREE[j % FREE.length], b = j % 3 === 0 ? -1 : FREE[(j * 7 + 2) % FREE.length]; const u = ((t * 0.42 + j / NMV * 3.7) % 1);
      const A = WPOS[a], B = b < 0 ? [RING[0], RING[1], RING[2]] : WPOS[b === a ? FREE[(j + 1) % FREE.length] : b];
      _e.set(t * 4 + j, j, t * 3); _q.setFromEuler(_e); _s.setScalar(0.8);
      if (b < 0 && u > 0.6) { const v = (u - 0.6) / 0.4, sp = (j % 5 - 2) * 0.5; _p.set(RING[0] + sp * 6 + v * (14 + sp * 10), RING[1] + 4 + v * 26, RING[2] - v * 10); coinsOut.setMatrixAt(no++, _m4.compose(_p, _q, _s)); }
      else { const v = b < 0 ? u / 0.6 : u; _p.set(lerp(A[0], B[0], v), lerp(A[1], B[1], v) + Math.sin(v * Math.PI) * 7, lerp(A[2], B[2], v)); coinsMv.setMatrixAt(nm++, _m4.compose(_p, _q, _s)); } }
    coinsMv.count = nm; coinsOut.count = no; coinsMv.instanceMatrix.needsUpdate = coinsOut.instanceMatrix.needsUpdate = true;
    ring.rotation.z = t * 0.8; ringM.opacity = 0.75 + 0.25 * Math.sin(t * 4); ringGlow.material.opacity = 0.6 + 0.3 * Math.sin(t * 3); }
  // the reserve refills the vault: coins arc from the chest into the round doorway
  { let nr = 0; for (let i = 0; i < NR; i++) { const td = T.refillA + (i / NR) * (T.refillB - T.refillA - 1.1), u = (t - td) / 1.1; if (u < 0 || u > 1) continue;
      const s0 = [RC[0], 4.6, RC[1]], e = [DOOR[0] + Math.sin(i * 2.4) * 3, DOOR[1] + Math.cos(i * 1.7) * 3, DOOR[2] + 0.5];
      _e.set(t * 6 + i, i, t * 4); _q.setFromEuler(_e); _p.set(lerp(s0[0], e[0], u), lerp(s0[1], e[1], u) + Math.sin(u * Math.PI) * 14, lerp(s0[2], e[2], u)); _s.setScalar(0.8); _m4.compose(_p, _q, _s); coinsR.setMatrixAt(nr++, _m4); }
    coinsR.count = nr; coinsR.instanceMatrix.needsUpdate = true; }
  for (const c of CARS) { const L = 540, x = ((c.off + t * c.v * c.dir) % L + L) % L - 270; c.m.position.set(c.dir > 0 ? x : -x, 0, c.z); c.m.rotation.y = c.dir > 0 ? 0 : Math.PI; }
  for (const c of clouds) { c.position.x = c.userData.x0 + t * 1.2; c.material.opacity = 0.85 - 0.45 * night; const k = lerp(1.0, 0.5, night); c.material.color.setRGB(lerp(s.hor[0], 1, 0.75) * k, lerp(s.hor[1], 1, 0.75) * k, lerp(s.hor[2], 1, 0.75) * k * 1.04); c.material.emissive.setRGB(c.material.color.r * 0.55, c.material.color.g * 0.55, c.material.color.b * 0.55); }
  for (const c of storm) { c.position.x = c.userData.x0 + Math.sin(t * 0.3) * 3; c.material.color.setRGB(0.32, 0.34, 0.42); c.material.emissive.setRGB(0.05, 0.05, 0.08); }
  // sparkles: in the round doorway, on the last lock, on the posted comments
  { let k = 0; const put3 = (x, y, z, sz, on, col) => { const sp = sparks[k++]; if (!sp) return; const tw = Math.pow(Math.abs(Math.sin(t * sp.userData.w + sp.userData.ph)), 3); sp.position.set(x, y, z); sp.scale.setScalar(sz * (0.25 + tw)); sp.material.opacity = on * (0.3 + 0.7 * tw); sp.material.color.setHex(col); sp.visible = on > 0.01; };
    const s1 = Math.max(win(t, -1, T.b4, 0.1, 0.4), win(t, T.refillA, T.b10 + 0.5, 0.3, 0.4), win(t, T.cta, DUR + 1, 0.4, 0.1)); for (let i = 0; i < 24; i++) { const sp = sparks[i].userData; put3(DOOR[0] + sp.dx * DR * 0.8, DOOR[1] + sp.dz * DR * 0.8, DOOR[2] + 1.2, 1.6, s1, 0xFFE9A8); }
    const s2 = win(t, T.lockLast, T.b11, 0.1, 0.4); const L = LOCKS[NL - 1]; for (let i = 0; i < 12; i++) { const sp = sparks[24 + i].userData; put3(L.x + sp.dx * 2.2, LBY + sp.dz * 2.2, LBZ + 1, 1.0, s2, 0xD8FFE0); }
    const s3 = win(t, T.serveA, T.reset, 0.2, 0.2); for (let i = 0; i < 14; i++) { const sp = sparks[36 + i].userData; put3(DM[0] + sp.dx * 8, 3.4 + Math.abs(sp.dz) * 1.5, DM[1] + 4 + sp.dz * 7, 1.0, s3, 0xFFE9A8); }
    while (k < sparks.length) sparks[k++].visible = false; }
  dome.position.copy(camera.position); stars.position.copy(camera.position);
  orb.visible = halo.visible = s.orbS > 0.5 && s.star < 0.9;
  orb.position.set(camera.position.x + sd[0] * 1800, camera.position.y + sd[1] * 1800, camera.position.z + sd[2] * 1800); orb.scale.setScalar(s.orbS * 2); orb.lookAt(camera.position); orbM.color.setRGB(...s.orb);
  halo.position.copy(orb.position); halo.scale.setScalar(s.orbS * 13); halo.lookAt(camera.position); haloM.color.setRGB(...s.orb); haloM.opacity = 0.75;
  const S2 = Math.min(190, Math.max(14, camD * 0.85));
  sun.target.position.copy(camTg); sun.position.set(camTg.x + sd[0] * 400, camTg.y + Math.max(0.25, sd[1]) * 400, camTg.z + sd[2] * 400);
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
  locks: LOCKS.filter(L => L.tOpen > 0).map(L => +L.tOpen.toFixed(3)),
  serve: Array.from({ length: 10 }, (_, r) => +serveT(r * 10).toFixed(3)), serve2: Array.from({ length: 6 }, (_, r) => +serve2T(r * 10).toFixed(3)),
  typingA: [0, 1, 2, 3].map(i => +(T.pullW + (i + 0.5) * 0.1).toFixed(3)), typingB: [0, 1, 2, 3].map(i => +(T.waitW + (i + 0.5) * 0.1).toFixed(3)),
  postA: +T.postA.toFixed(3), postB: +T.postB.toFixed(3),
};
document.fonts.ready.then(() => Promise.all(['700 64px Figtree', '900 190px Fraunces', '800 30px JBM', '700 22px Inter', '700 78px Fraunces', '800 54px Figtree', '600 34px Figtree', '500 18px Inter', '900 128px JBM', '800 46px Inter', '900 150px Figtree', '900 112px Fraunces', '800 172px JBM', '700 34px Figtree', '800 92px JBM', '900 64px Figtree', '800 70px JBM', '800 54px JBM', '800 28px JBM', '800 34px Inter', '900 96px JBM', '700 50px Fraunces', '900 40px JBM', '800 36px JBM', '900 50px JBM', '800 40px Figtree', '700 32px Figtree', '600 18px Inter', '900 92px Fraunces'].map(f => document.fonts.load(f)))).then(() => { fitHook(); renderAt(0); window.__ready = true; });
