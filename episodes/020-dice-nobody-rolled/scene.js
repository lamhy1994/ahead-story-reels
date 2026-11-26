// The Dice Nobody Rolled — low-poly storybook scene (deterministic: window.renderAt(t) draws the frame for time t)
// Coldcard hardware wallets are "cold" wallets: the secret keys stay offline. From firmware of March 2021 to 30 Jul 2026 a hidden firmware setting switched
// off the chip's random number generator for new wallet secrets (seeds); they came from a predictable software generator instead (Coinkite's postmortem,
// 23-24 Nov 2026). Thieves rebuilt the keys on their own computers; on 30 Jul 2026 about 594 BTC left about 500 wallets in 25 minutes (TRM Labs, CoinDesk);
// in all 1,778.84 BTC from 8,600+ addresses (Galaxy Research). At least 15 reviews missed it: the checks confirmed the hardware generator was there, never
// that the seeds used it. No decision yet on repaying owners. 1,778.84 BTC x $60,743 (CoinGecko, 26 Nov 2026) = about $108 million.
import * as THREE from 'three';
import { SKIN, MAT, GOLD, rng, GB, person, cloud, house, lamp, BIGCOIN, GLASS_M, glassVault, rack, magnifier, hwWallet, dieGeo, recipeBook, keyGeo, balance } from './kit.js';

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
const R = rng(20260730);

// ───────────────────────── story clock (everything hangs off the narration)
const T = {
  hookEnd: TIM.big ? 1.5 : TIM.hook ? E(1) + 0.15 : 0,  // the hook card (script.py HOOK): 0-1.5 s when there is a big number, else until the hook sentence ends
  bigIn: TIM.big ? 1.5 : 0, bigOut: TIM.big ? 3.0 : 0,   // the big number (script.py BIG): 1.5-3 s (Keith, 22 Nov 2026)
  b2: S(2) - 0.05, safest: wt(2, 'safest') - 0.1, hiding: wt(2, 'hiding') - 0.1,
  b3: S(3) - 0.05, rob: wt(3, 'rob') - 0.1, never: wt(3, 'never') - 0.1, online3: wt(3, 'online') - 0.1,
  b4: S(4) - 0.05, touch: wt(4, 'touch') - 0.1, guess4: wt(4, 'guess') - 0.1, secret4: wt(4, 'secret') - 0.1,
  b5: S(5) - 0.05, chance: wt(5, 'chance') - 0.1, rolling: wt(5, 'rolling') - 0.1, dice5: wt(5, 'dice') - 0.1,
  b6: S(6) - 0.05, five: wt(6, 'five') - 0.1, hidden: wt(6, 'hidden') - 0.1, swapped: wt(6, 'swapped') - 0.1, recipe6: wt(6, 'recipe') - 0.1,
  b7: S(7) - 0.05, easier: wt(7, 'easier') - 0.1, guess7: wt(7, 'guess') - 0.1,
  b8: S(8) - 0.05, thieves: wt(8, 'thieves') - 0.1, rebuilt: wt(8, 'rebuilt') - 0.1, computers: wt(8, 'computers') - 0.1,
  b9: S(9) - 0.05, m25: wt(9, '25') - 0.1, hundreds: wt(9, 'hundreds') - 0.1, empty: wt(9, 'empty') - 0.1,
  b10: S(10) - 0.05, nobody: wt(10, 'nobody') - 0.1, notice: wt(10, 'notice') - 0.1,
  b11: S(11) - 0.05, week: wt(11, 'week') - 0.1, maker: wt(11, 'maker') - 0.1, n15: wt(11, '15') - 0.1, reviews: wt(11, 'reviews') - 0.1, missed: wt(11, 'missed') - 0.1,
  b12: S(12) - 0.05, every: wt(12, 'every') - 0.1, box: wt(12, 'box') - 0.1, none: wt(12, 'none') - 0.1, rolled: wt(12, 'rolled') - 0.1,
  b13: S(13) - 0.05, almost: wt(13, 'almost') - 0.1, n1800: wt(13, '1,800') - 0.1, gone: wt(13, 'gone') - 0.1, repaying: wt(13, 'repaying') - 0.1, undecided: wt(13, 'undecided') - 0.1,
  b14: S(14) - 0.05, over: wt(14, 'over') - 0.1,
  b15: S(15) - 0.05, story: wt(15, 'story') - 0.15, safe: wt(15, 'safe') - 0.1, strong: wt(15, 'strong') - 0.1,
  cta: S(16) - 0.1, would: wt(16, 'would') - 0.1, cold: wt(16, 'cold') - 0.1, comment: wt(16, 'comment') - 0.15, trustW: wt(16, 'trust', 1) - 0.2, doubtW: wt(16, 'doubt') - 0.1,
};
T.rollA = T.chance - 0.35; T.rollB = T.dice5 + 0.75;       // the dice tumble (pure chance)
T.swap = T.swapped;                                         // the lever flips: the dice cable goes dark, the recipe takes over
T.bookIn = T.recipe6 - 0.1;                                 // the recipe book pops up
T.copyA = T.easier - 0.5; T.copyB = T.b8 + 0.3;            // a copy of the recipe flies out to the thieves' den
T.keysA = T.rebuilt; T.keysB = T.b9 + 0.25;                 // keys pop out of the thieves' computers and fly to the houses
T.theftA = T.m25 - 0.3; T.theftB = T.empty + 0.45;          // coins stream from the houses to the den
T.wipe = S(11) - 0.55;                                      // sky wipe: July night -> November day
T.insp = T.n15 - 0.45;                                      // the 15 reviewers appear around the vault
T.postA = T.trustW + 0.75; T.postB = T.doubtW + 0.7;
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
  NIGHT: P(0x060A22, 0x121A48, 0x2C3366, 0x1E2456, 0xB4C2FF, 1.5, 0x4E60B8, 0x2E3550, 1.25, 1, 1, -35, 42, 0xFFF4D6, 30, 90, 620),
  DAY: P(0x2F86D2, 0x8CC4EA, 0xE6EEF2, 0xD8E2EA, 0xFFF1DC, 2.4, 0xCFE4FF, 0x9AA6B4, 1.45, 0, 0, 30, 40, 0xFFF8E0, 38, 120, 760),
  SUNSET: P(0x2E2F72, 0xE0707A, 0xFFB25E, 0xEE9A6A, 0xFF9050, 2.4, 0xB49AC8, 0x7A6A7A, 1.3, 0.12, 0.6, -70, 11, 0xFFB060, 50, 90, 620),
  DUSK: P(0x10184A, 0x3E3A86, 0xB0687E, 0x5E4A7A, 0x93A4F4, 1.6, 0x5A66B8, 0x3A3A56, 1.2, 0.65, 0.92, -40, 36, 0xFFF4D6, 30, 90, 620),
};
const SKY = [[0, 'DUSK'], [T.b3 - 0.3, 'DUSK'], [T.b3 + 1.2, 'NIGHT'], [T.wipe + 0.3, 'NIGHT'], [T.wipe + 0.75, 'DAY'], [T.b14 + 0.3, 'DAY'], [T.b15 + 0.3, 'SUNSET'], [T.cta + 0.4, 'DUSK'], [DUR + 2, 'DUSK']];
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
const VC = [0, -2];                     // the glass vault in the town square (the cold wallet)
const WAL = [0, -4.6];                  // the hardware wallet inside it
const DB = [-4.7, -3.0];                // the dice box (true chance) on the left
const BK = [4.7, -3.0];                 // the recipe book (the predictable generator) on the right
const DEN = [30, -262];                 // the thieves' den, far behind the town
const BAL = [15, 8];                    // the balance scale on the square
const stat = [];

// ───────────────────────── snow, the square, the streets
const ground = new THREE.Mesh(new THREE.PlaneGeometry(2400, 2400).rotateX(-Math.PI / 2), new THREE.MeshLambertMaterial({ color: 0xE9EEF3 })); ground.receiveShadow = true; scene.add(ground);
const flat = new GB();
flat.cyl(25, 25, 0.06, 40, 0xCDD5DE, VC[0], 0.03, VC[1] + 2);                                                       // the cleared square
for (let i = 0; i < 40; i++) { const a = i / 40 * Math.PI * 2; flat.box(1.2, 0.07, 0.4, 0xB9C3CE, VC[0] + Math.cos(a) * 24.4, 0.035, VC[1] + 2 + Math.sin(a) * 24.4, 0, -a, 0); }
flat.box(9, 0.05, 160, 0xD2D9E1, 2, 0.025, 100); flat.box(260, 0.05, 8, 0xD2D9E1, 0, 0.026, -40); flat.box(8, 0.05, 220, 0xD2D9E1, 30, 0.027, -150);   // the streets, and the road out to the den
const flatM = flat.mesh(); flatM.castShadow = false; scene.add(flatM);

// ───────────────────────── the town: snowy houses with lit windows; 24 of them are robbed
const PINE = (h, rr) => { const b = new GB(); b.cyl(0.25, 0.35, h * 0.3, 6, 0x5A3A26, 0, h * 0.15, 0); for (let k = 0; k < 3; k++) { const r = h * (0.36 - k * 0.09), y = h * (0.3 + k * 0.2); b.cone(r, h * 0.34, 7, [0x2E6A4E, 0x34775A, 0x2A5E46][k], 0, y + h * 0.17, 0); b.cone(r * 0.55, h * 0.12, 7, 0xF4F7FA, 0, y + h * 0.29, 0); } return b.mesh(); };
const LANE = (x, z) => (x > -24 && x < 28 && z > -6 && z < 95) || Math.hypot(x - VC[0], z - VC[1] - 2) < 30 || Math.hypot(x - DEN[0], z - DEN[1]) < 60 || (Math.abs(x - 30) < 10 && z < -40 && z > -210);
const HOUSES = [];
{
  const hr = rng(2021), COL = [0xB8644A, 0xD9C39A, 0x8FB3C2, 0xE4DED2, 0x6A8AA4, 0xC98A5A, 0xA4604E, 0xD8B07A];
  for (const r of [36, 48, 61, 75, 90, 106, 124]) {
    const n = Math.floor(2 * Math.PI * r / 15);
    for (let k = 0; k < n; k++) {
      const a = (k + hr() * 0.4) / n * Math.PI * 2, rr = r + (hr() - 0.5) * 5, x = VC[0] + Math.cos(a) * rr, z = VC[1] + Math.sin(a) * rr;
      if (LANE(x, z) || hr() < 0.1) continue;
      const w = 7 + hr() * 3, h = 4.6 + hr() * 2.6, d = 6.5 + hr() * 2;
      const m = house(w, h, d, { rand: hr, color: COL[Math.floor(hr() * COL.length)], roof: 0xF2F5F9, trim: 0xF6F1E6, chim: 0x8C5A46 });
      m.position.set(x, 0, z); m.rotation.y = Math.atan2(-(x - VC[0]), -(z - VC[1])); scene.add(m); m.updateMatrixWorld(true);
      HOUSES.push({ m, x, z, r, w, h, d }); stat.push([x - 6, x + 6, z - 6, z + 6, h + 4, 'house']);
    }
  }
  for (let i = 0; i < 150; i++) { const a = hr() * Math.PI * 2, r = 30 + hr() * 150, x = Math.cos(a) * r, z = Math.sin(a) * r - 2; if (LANE(x, z) || HOUSES.some(h => Math.hypot(h.x - x, h.z - z) < 8)) continue; const m = PINE(6 + hr() * 5, hr); m.position.set(x, 0, z); scene.add(m); }
  for (let i = 0; i < 60; i++) { const x = DEN[0] - 120 + hr() * 240, z = DEN[1] - 60 + hr() * 70; if (Math.hypot(x - DEN[0], z - DEN[1]) < 30) continue; const m = PINE(7 + hr() * 6, hr); m.position.set(x, 0, z); scene.add(m); }
}
// robbed houses: the 24 nearest the den side of town (their coins arc away from the camera to the den)
const ROB = HOUSES.filter(h => h.r <= 75 && h.z < 10).sort((a, b) => a.z - b.z).slice(0, 24);
const NROB = ROB.length;
const glowMat = new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, opacity: 0, toneMapped: false });
{ const g = new GB(), v = new THREE.Vector3(); const hr = rng(77);
  for (const h of HOUSES) { if (ROB.includes(h)) continue; for (const [wx, wy, wz] of h.m.userData.win) if (hr() < 0.6) { h.m.localToWorld(v.set(wx, wy, wz + 0.02)); g.box(0.56, 0.86, 0.06, 0xFFC866, v.x, v.y, v.z, 0, h.m.rotation.y, 0); } }
  scene.add(new THREE.Mesh(g.geo(), glowMat)); }
const robGlowM = ROB.map(() => new THREE.MeshBasicMaterial({ color: 0xFFC866, transparent: true, opacity: 0, toneMapped: false }));
ROB.forEach((h, i) => { const g = new GB(), v = new THREE.Vector3(); for (const [wx, wy, wz] of h.m.userData.win) { h.m.localToWorld(v.set(wx, wy, wz + 0.02)); g.box(0.56, 0.86, 0.06, 0xFFFFFF, v.x, v.y, v.z, 0, h.m.rotation.y, 0); } h.glow = new THREE.Mesh(g.geo(), robGlowM[i]); scene.add(h.glow);
  const dv = new THREE.Vector3(0, 2.4, h.d / 2 + 0.6); h.m.localToWorld(dv); h.door = [dv.x, dv.y, dv.z]; const tv = new THREE.Vector3(0, h.h + 1.5, 0); h.m.localToWorld(tv); h.top = [tv.x, tv.y, tv.z]; });
const lampHeads = new GB();
for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2 + 0.3; if (a > 0.6 && a < 1.9) continue; const x = VC[0] + Math.cos(a) * 26.5, z = VC[1] + 2 + Math.sin(a) * 26.5; const l = lamp(6.2); l.position.set(x, 0, z); l.rotation.y = -a + Math.PI; scene.add(l); const hv = new THREE.Vector3(1.25, 6.02, 0); l.updateMatrixWorld(true); l.localToWorld(hv); lampHeads.box(0.6, 0.12, 0.36, 0xFFFFFF, hv.x, hv.y, hv.z); }
const lampM = new THREE.MeshLambertMaterial({ color: 0xFFF1C8, emissive: 0xFFD27A, emissiveIntensity: 0 }); scene.add(new THREE.Mesh(lampHeads.geo(), lampM));

// ───────────────────────── the glass vault: the hardware wallet on a pedestal, the dice box, the recipe book, the cables, a heap of bitcoin
const vault = glassVault(18, 13, 11); vault.position.set(VC[0], 0, VC[1]); vault.children.forEach(c => { c.castShadow = true; c.receiveShadow = true; }); scene.add(vault);
stat.push([VC[0] - 9.8, VC[0] + 9.8, VC[1] - 7.3, VC[1] + 7.3, 12.6, 'vault']);
const FY = 0.66;
{ const b = new GB(); b.box(5.4, 1.0, 2.6, 0xD6CEBC, WAL[0], FY + 0.5, WAL[1]); b.box(5.7, 0.14, 2.9, 0xEDE6D6, WAL[0], FY + 1.03, WAL[1]);                                // pedestal
  b.box(2.4, 2.2, 2.4, 0x5A606A, DB[0], FY + 1.1, DB[1]); b.box(2.7, 0.16, 2.7, 0x7E848E, DB[0], FY + 2.24, DB[1]);                                                   // dice stand
  b.box(1.4, 2.4, 1.2, 0x6B4226, BK[0], FY + 1.2, BK[1]); b.box(2.4, 0.16, 1.9, 0x7A4E2E, BK[0], FY + 2.45, BK[1], 0.25, 0, 0);                                         // lectern
  const m = b.mesh(); scene.add(m); }
const wallet = hwWallet(); wallet.position.set(WAL[0], FY + 1.1, WAL[1]); scene.add(wallet);
const scrCv = document.createElement('canvas'); scrCv.width = 512; scrCv.height = 256; const scrTx = new THREE.CanvasTexture(scrCv); scrTx.colorSpace = THREE.SRGBColorSpace; scrTx.anisotropy = 4;
{ const [sx, sy, sz, sw, sh] = wallet.userData.screen; const scr = new THREE.Mesh(new THREE.PlaneGeometry(sw, sh), new THREE.MeshBasicMaterial({ map: scrTx, toneMapped: false })); scr.position.set(sx, sy, sz); wallet.add(scr); }
const SCR = [WAL[0], FY + 1.1 + wallet.userData.screen[1], WAL[1] + 0.6];
// the dice box: glass cube, metal frame, three dice, a lever on the front of the stand
const DBY = FY + 2.32;                   // floor of the glass cube
{ const b = new GB(), st = 0x3E444E, e = 2.6, y0 = DBY, cx = DB[0], cz = DB[1];
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) b.box(0.14, e, 0.14, st, cx + sx * e / 2, y0 + e / 2, cz + sz * e / 2);
  for (const y of [y0, y0 + e]) { b.box(e, 0.14, 0.14, st, cx, y, cz - e / 2); b.box(e, 0.14, 0.14, st, cx, y, cz + e / 2); b.box(0.14, 0.14, e, st, cx - e / 2, y, cz); b.box(0.14, 0.14, e, st, cx + e / 2, y, cz); }
  scene.add(b.mesh()); const gl = new GB(); gl.box(e, e, e, 0xffffff, cx, y0 + e / 2, cz); const gm = new THREE.Mesh(gl.geo(), GLASS_M); gm.renderOrder = 2; scene.add(gm); }
const DIEM = new THREE.MeshLambertMaterial({ vertexColors: true }), DIEG = dieGeo(0.78);
const DICE = [[-0.6, 0.35, 0.4], [0.55, 0.4, -0.2], [0.05, 0.38, 0.75]].map(([x, s, z], i) => { const m = new THREE.Mesh(DIEG, DIEM); m.castShadow = true; m.userData = { x: DB[0] + x, z: DB[1] + z, ph: i * 2.1, rest: [[0.0, 0.3, 0], [Math.PI / 2, 1.1, 0], [0, 2.2, Math.PI / 2]][i] }; scene.add(m); return m; });
const lever = new THREE.Group(); lever.position.set(DB[0] + 0.7, FY + 1.3, DB[1] + 1.22); scene.add(lever);
{ const b = new GB(); b.box(0.5, 0.5, 0.12, 0x2A2E36, 0, 0, -0.04); b.cyl(0.06, 0.06, 0.9, 6, 0xC9CED6, 0, 0.45, 0.08); b.ball(0.17, 1, 0xD9483B, 0, 0.92, 0.08); const m = b.mesh(); lever.add(m); }
// the recipe book (scaled 0 until the swap); its copy flies out to the den
const book = recipeBook(0.62); book.position.set(BK[0], FY + 2.62, BK[1]); book.rotation.x = 0.25; scene.add(book);
const bookCopy = recipeBook(2.2); bookCopy.visible = false; scene.add(bookCopy);
const copyGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: radial('rgba(255,190,110,0.9)', 'rgba(255,150,60,0)'), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false, opacity: 0.8 })); copyGlow.visible = false; scene.add(copyGlow);
// cables from the dice box and from the book into the wallet; packets run along the one that is switched on
const curveD = new THREE.CatmullRomCurve3([new THREE.Vector3(DB[0] + 1.2, FY + 1.0, DB[1] - 0.3), new THREE.Vector3(DB[0] + 2.1, FY + 0.2, DB[1] - 0.9), new THREE.Vector3(WAL[0] - 2.6, FY + 0.2, WAL[1] + 0.2), new THREE.Vector3(WAL[0] - 2.7, FY + 0.7, WAL[1])]);
const curveB = new THREE.CatmullRomCurve3([new THREE.Vector3(BK[0] - 0.7, FY + 1.0, BK[1] - 0.3), new THREE.Vector3(BK[0] - 2.1, FY + 0.2, BK[1] - 0.9), new THREE.Vector3(WAL[0] + 2.6, FY + 0.2, WAL[1] + 0.2), new THREE.Vector3(WAL[0] + 2.7, FY + 0.7, WAL[1])]);
const cabDM = new THREE.MeshBasicMaterial({ color: 0x3A3F4A, toneMapped: false }), cabBM = new THREE.MeshBasicMaterial({ color: 0x3A3F4A, toneMapped: false });
scene.add(new THREE.Mesh(new THREE.TubeGeometry(curveD, 40, 0.13, 6), cabDM), new THREE.Mesh(new THREE.TubeGeometry(curveB, 40, 0.13, 6), cabBM));
const pktM = new THREE.MeshBasicMaterial({ color: 0xFFE27A, toneMapped: false });
const pkts = Array.from({ length: 10 }, () => { const m = new THREE.Mesh(new THREE.IcosahedronGeometry(0.2, 0), pktM); m.visible = false; scene.add(m); return m; });
// a heap of bitcoin (orange-gold coins) in front of the wallet: it drains in the theft
const BTCM = new THREE.MeshLambertMaterial({ color: 0xF2A23A, emissive: 0xB86A10, emissiveIntensity: 0.7 });
const pcoinG = BIGCOIN(0.5, 0.14);
const PILE = []; { const pr = rng(11); for (let i = 0; i < 90; i++) { const ly = Math.floor(Math.sqrt(i * 0.8)), r = 2.4 * (1 - ly * 0.13) * Math.sqrt(pr()), a = pr() * 6.28; PILE.push([WAL[0] + Math.cos(a) * r * 1.3, FY + 0.08 + ly * 0.13, WAL[1] + 2.4 + Math.sin(a) * r * 0.55, (pr() - .5) * 0.6, (pr() - .5) * 0.6]); } }
const pileMesh = new THREE.InstancedMesh(pcoinG, BTCM, PILE.length); pileMesh.castShadow = true; pileMesh.frustumCulled = false; scene.add(pileMesh);

// ───────────────────────── the thief outside the vault (sentences 3-4)
const modern = (i, extra = {}) => ({ robe: [0x34405A, 0x6A2E3E, 0x3F6A5A, 0x5A5A66, 0x7A5A3A, 0x2F4A6A, 0x8A3A3A, 0x3B6FA8, 0xB0603A, 0x4E7A3E][i % 10], skin: SKIN[i % 5], short: [0x231C18, 0x5A3E28, 0xC9A27A, 0x3A2A1E, 0x8A8A8A][i % 5], ...extra });
const thief = person({ robe: 0x22262E, skin: SKIN[2], bigHat: true, hat: 0x1A1C22, s: 1.15 }); scene.add(thief);
const TH0 = [6.5, 9.5], TH1 = [17, 2];

// ───────────────────────── the thieves' den: a dark hideout with three screens, a server rack, two thieves, a growing heap of coins
const den = new THREE.Group(); den.position.set(DEN[0], 0, DEN[1]); scene.add(den);
{ const b = new GB(), wall = 0x2E323C, fl = 0x3A3E48;
  b.box(16, 0.3, 11, fl, 0, 0.15, 0); b.box(16, 5.2, 0.4, wall, 0, 2.75, -5.3); b.box(0.4, 5.2, 11, wall, -7.8, 2.75, 0); b.box(0.4, 5.2, 11, wall, 7.8, 2.75, 0);
  b.box(30, 16, 12, 0x252932, 0, 8, -12.5); b.box(31, 0.8, 13, 0x3A3F4A, 0, 16.2, -12.5); b.box(1.2, 6, 1.2, 0x3A3F4A, 9, 19, -12); b.box(4, 3, 4, 0x30343E, -8, 17.6, -14);   // the warehouse behind
  b.box(9.5, 0.18, 1.8, 0x4A3A2E, -1.2, 1.15, -3.6); for (const x of [-5.7, 3.3]) for (const z of [-4.3, -2.9]) b.box(0.14, 1.0, 0.14, 0x4A3A2E, x, 0.62, z);              // the desk
  b.box(1.2, 0.5, 1.0, 0x5A3A26, 5.8, 0.4, 2.6); b.box(1.0, 0.9, 0.9, 0x7A5A3A, 5.8, 0.95, 2.6);                                                                           // a sack
  den.add(b.mesh()); }
stat.push([DEN[0] - 16, DEN[0] + 16, DEN[1] - 19, DEN[1] + 6, 20, 'den']);
const monCv = document.createElement('canvas'); monCv.width = 512; monCv.height = 320; const monTx = new THREE.CanvasTexture(monCv); monTx.colorSpace = THREE.SRGBColorSpace;
const monM = new THREE.MeshBasicMaterial({ map: monTx, toneMapped: false });
const MONS = [-4.4, -1.2, 2.0].map((x, i) => { const g = new THREE.Group(); g.position.set(x, 1.25, -3.9); g.rotation.y = (1 - i) * 0.18; const fr = new GB(); fr.box(2.9, 1.9, 0.16, 0x15171C, 0, 1.15, -0.05); fr.box(0.2, 0.5, 0.2, 0x2A2E36, 0, 0.2, -0.05); g.add(fr.mesh()); const s = new THREE.Mesh(new THREE.PlaneGeometry(2.62, 1.64), monM); s.position.set(0, 1.15, 0.04); g.add(s); den.add(g); return g; });
{ const [g1, g2] = rack(); for (const x of [-6.4, -5.4]) { const m = new THREE.Mesh(g1, MAT); m.position.set(x, 0.3, -4.4); den.add(m); const l = new THREE.Mesh(g2, new THREE.MeshBasicMaterial({ color: 0xFF5A4A, toneMapped: false })); l.position.set(x, 0.3, -4.4); den.add(l); } }
const crooks = [[-2.8, -2.2, 0.15], [0.6, -2.1, -0.1]].map(([x, z, ry], i) => { const p = person({ robe: [0x23262E, 0x2E2A26][i], skin: SKIN[i + 1], bigHat: true, hat: 0x15171C, s: 1.05 }); p.position.set(x, 0.3, z); p.rotation.y = Math.PI / 2 + ry; den.add(p); return p; });
const denLight = new THREE.PointLight(0xFF7A5A, 0, 34, 1.2); denLight.position.set(DEN[0] - 1, 5.0, DEN[1] + 3); scene.add(denLight);
const beacon = new THREE.Mesh(new THREE.IcosahedronGeometry(0.9, 1), new THREE.MeshBasicMaterial({ color: 0xFF4A3A, toneMapped: false })); beacon.position.set(DEN[0] + 9, 22.6, DEN[1] - 12); scene.add(beacon);
const beaconGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: radial('rgba(255,80,60,0.85)', 'rgba(255,60,40,0)'), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false })); beaconGlow.position.copy(beacon.position); beaconGlow.scale.set(14, 14, 1); scene.add(beaconGlow);
const storm = []; for (let i = 0; i < 4; i++) { const m = cloud(R); m.position.set(DEN[0] - 26 + i * 17, 48 + R() * 6, DEN[1] - 22 + R() * 10); m.scale.setScalar(3.0); m.userData.x0 = m.position.x; scene.add(m); storm.push(m); }
// the den's heap: coins arriving pile up
const DPILE = []; { const pr = rng(12); for (let i = 0; i < 120; i++) { const ly = Math.floor(Math.sqrt(i * 0.7)), r = 2.6 * (1 - ly * 0.11) * Math.sqrt(pr()), a = pr() * 6.28; DPILE.push([DEN[0] + 3.0 + Math.cos(a) * r, 0.36 + ly * 0.13, DEN[1] + 1.2 + Math.sin(a) * r * 0.8, (pr() - .5) * 0.6, (pr() - .5) * 0.6]); } }
const dpileMesh = new THREE.InstancedMesh(pcoinG, BTCM, DPILE.length); dpileMesh.castShadow = true; dpileMesh.frustumCulled = false; scene.add(dpileMesh);

// ───────────────────────── keys (the rebuilt secrets) fly from the den to the robbed houses; coins fly from the houses to the den
const KEYG = keyGeo(0.9), keysM = new THREE.InstancedMesh(KEYG, GOLD, NROB); keysM.frustumCulled = false; scene.add(keysM);
const COING = BIGCOIN(0.95, 0.3), NC = 300;
const coins = new THREE.InstancedMesh(COING, BTCM, NC); coins.castShadow = true; coins.frustumCulled = false; scene.add(coins);
const CR = Array.from({ length: NC }, (_, i) => { const rr = rng(900 + i); return { h: i % NROB, k: Math.floor(i / NROB), up: 20 + rr() * 18, top: 70 + rr() * 26, jx: (rr() - .5) * 5, jz: (rr() - .5) * 4, sp: 4 + rr() * 6, ph: rr() * 6 }; });
const NPER = Math.ceil(NC / NROB);
const _m4 = new THREE.Matrix4(), _q = new THREE.Quaternion(), _e = new THREE.Euler(), _p = new THREE.Vector3(), _s = new THREE.Vector3();
const FLY = 3.0, DENIN = [DEN[0] + 3, 3.5, DEN[1] + 1.5];
const robWin = i => { const a = T.theftA + (i / NROB) * (T.theftB - T.theftA - 0.9); return [a, a + 0.9]; };   // when house i's coins leave (sentence 9)
function bez(p0, p1, p2, p3, u) { const a = (1 - u) ** 3, b = 3 * (1 - u) ** 2 * u, d = 3 * (1 - u) * u * u, e = u ** 3; return [a * p0[0] + b * p1[0] + d * p2[0] + e * p3[0], a * p0[1] + b * p1[1] + d * p2[1] + e * p3[1], a * p0[2] + b * p1[2] + d * p2[2] + e * p3[2]]; }
function coinAt(i, t) {
  const c = CR[i], h = ROB[c.h]; let td;
  if (t < T.b3) td = -FLY + (i / NC) * (T.b2 + 0.4 + FLY) + (c.ph / 6) * 0.2;                  // the cover: the theft in one picture
  else { const [a, b] = robWin(c.h); td = lerp(a, b, c.k / NPER) + (c.ph / 6) * 0.08; }
  const u = (t - td) / FLY; if (u < 0 || u > 1) return null;
  const p0 = h.top, p1 = [p0[0] + c.jx, p0[1] + c.up, p0[2] + c.jz], p3 = [DENIN[0] + c.jx * 0.3, DENIN[1], DENIN[2] + c.jz * 0.3], p2 = [lerp(p0[0], p3[0], 0.55), c.top, lerp(p0[2], p3[2], 0.55)];
  return bez(p0, p1, p2, p3, u);
}
function keyAt(i, t) {
  const h = ROB[i], td = T.keysA + (i / NROB) * (T.keysB - T.keysA - 1.7), u = (t - td) / 1.7; if (u < 0 || u > 1) return null;
  const mon = MONS[i % 3].position, p0 = [DEN[0] + mon.x, 2.4, DEN[1] + mon.z + 0.6], p3 = h.door, p1 = [p0[0], 34, p0[2] - 2], p2 = [p3[0], 46, p3[2] - 14];
  return bez(p0, p1, p2, p3, eio(u));
}

// ───────────────────────── November: the 15 reviewers around the vault, each with a magnifier and a check mark; the balance scale
const INSP = Array.from({ length: 15 }, (_, i) => { const row = i < 8 ? 0 : 1, j = row ? i - 8 : i, x = row ? -6.3 + j * 2.1 : -7.35 + j * 2.1, z = row ? 10.9 : 8.2;
  const p = person(modern(i, { badge: true, s: 1.05 })); p.position.set(x, 0, z); p.rotation.y = Math.atan2(-(VC[1] - z), (VC[0] - x) * 0.25); const mg = magnifier(); mg.scale.setScalar(0.26); mg.position.set(0.55, 1.2, 0.15); mg.rotation.y = Math.PI / 2; p.add(mg); p.visible = false; scene.add(p);
  const ck = new GB(); ck.box(0.32, 0.9, 0.18, 0xFFFFFF, -0.2, -0.08, 0, 0, 0, 0.75); ck.box(0.32, 1.6, 0.18, 0xFFFFFF, 0.3, 0.22, 0, 0, 0, -0.62); const cm = new THREE.Mesh(ck.geo(), new THREE.MeshBasicMaterial({ color: 0x4CC46A, toneMapped: false })); cm.visible = false; scene.add(cm);
  return { p, cm, x, z, t: T.insp + i * 0.075, tc: T.reviews + 0.05 + i * 0.05 }; });
const lead = person(modern(3, { badge: true, s: 1.1 })); lead.position.set(DB[0] - 4.2, 0, VC[1] + 8.4); lead.rotation.y = Math.atan2(-(DB[1] - lead.position.z), DB[0] - lead.position.x); { const mg = magnifier(); mg.scale.setScalar(0.42); mg.position.set(0.7, 1.55, 0.1); mg.rotation.y = Math.PI / 2; lead.add(mg); } lead.visible = false; scene.add(lead);
const bigMag = magnifier(); bigMag.scale.setScalar(0.85); bigMag.visible = false; scene.add(bigMag);
const bal = balance(1.25); bal.position.set(BAL[0], 0, BAL[1]); bal.rotation.y = -0.35; scene.add(bal); stat.push([BAL[0] - 5.5, BAL[0] + 5.5, BAL[1] - 3, BAL[1] + 3, 9, 'balance']);
const qM = new THREE.MeshBasicMaterial({ color: 0xFFC84A, toneMapped: false }), qMesh = (() => { const b = new GB(); b.add(new THREE.TorusGeometry(0.42, 0.13, 6, 14, Math.PI * 1.35), 0xFFFFFF, new THREE.Matrix4().makeRotationZ(-0.65).setPosition(0, 0.55, 0)); b.box(0.24, 0.42, 0.2, 0xFFFFFF, 0.02, -0.05, 0); b.box(0.26, 0.26, 0.2, 0xFFFFFF, 0.02, -0.55, 0); return new THREE.Mesh(b.geo(), qM); })(); scene.add(qMesh);

// ───────────────────────── falling snow, clouds, sparkles
const NSN = 1400, snowG = new THREE.BufferGeometry(); snowG.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(NSN * 3), 3));
const snow = new THREE.Points(snowG, new THREE.PointsMaterial({ color: 0xFFFFFF, size: 0.55, transparent: true, opacity: 0.85, depthWrite: false, map: radial('rgba(255,255,255,1)', 'rgba(255,255,255,0)') })); snow.frustumCulled = false; scene.add(snow);
const SN = []; { const sr = rng(4242); for (let i = 0; i < NSN; i++) SN.push([sr(), sr(), sr(), 0.6 + sr() * 0.8, sr() * 6.28]); }
const clouds = []; for (let i = 0; i < 16; i++) { const m = cloud(R); m.position.set(-420 + R() * 840, 85 + R() * 40, -520 + R() * 380); m.scale.setScalar(2.2 + R() * 2.2); m.userData.x0 = m.position.x; scene.add(m); clouds.push(m); }
const sparkT = (() => { const cv = document.createElement('canvas'); cv.width = cv.height = 64; const g = cv.getContext('2d'); g.translate(32, 32); g.fillStyle = '#fff'; for (let k = 0; k < 2; k++) { g.rotate(Math.PI / 2 * k); g.beginPath(); g.moveTo(0, -30); g.quadraticCurveTo(3, -3, 30, 0); g.quadraticCurveTo(3, 3, 0, 30); g.quadraticCurveTo(-3, 3, -30, 0); g.quadraticCurveTo(-3, -3, 0, -30); g.fill(); } const tx = new THREE.CanvasTexture(cv); tx.colorSpace = THREE.SRGBColorSpace; return tx; })();
const sparks = []; for (let i = 0; i < 70; i++) { const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: sparkT, color: 0xFFE9A8, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false })); sp.userData = { ph: R() * 6.28, w: 3 + R() * 4, dx: (R() - 0.5) * 2, dz: (R() - 0.5) * 2 }; scene.add(sp); sparks.push(sp); }

// ───────────────────────── the screens: the wallet's (the secret) and the thieves' (the guessing), redrawn only when what they show changes
const F = (w, px, fam) => `${w} ${px}px ${fam}`;
function face(g, x, y, s, n, col = '#1B1F27', bg = '#F6F2EA') {   // a die face drawn on a canvas
  g.fillStyle = bg; g.beginPath(); g.roundRect(x - s / 2, y - s / 2, s, s, s * 0.18); g.fill(); g.fillStyle = col; const P = s * 0.26, r = s * 0.09;
  const pts = { 1: [[0, 0]], 2: [[-1, -1], [1, 1]], 3: [[-1, -1], [0, 0], [1, 1]], 4: [[-1, -1], [1, -1], [-1, 1], [1, 1]], 5: [[-1, -1], [1, -1], [0, 0], [-1, 1], [1, 1]], 6: [[-1, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [1, 1]] }[n];
  for (const [u, v] of pts) { g.beginPath(); g.arc(x + u * P, y + v * P, r, 0, 7); g.fill(); }
}
const RND = (i, k) => 1 + Math.floor(rng(31 * i + 7 * k + 5)() * 6);
let scrKey = '';
function drawScreen(t) {
  const mode = t >= T.cta ? 'off' : t >= T.b11 ? 'off' : t >= T.hundreds ? 'zero' : t >= T.swap ? 'recipe' : t >= T.rollA ? 'dice' : t >= T.secret4 - 0.1 ? 'hidden' : 'off';
  const k = mode === 'dice' ? Math.floor(Math.min(t, T.rollB) * 9) : mode === 'recipe' ? Math.floor(t * 3) : 0, key = mode + k;
  if (key === scrKey) return; scrKey = key;
  const g = scrCv.getContext('2d'), w = 512, h = 256; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillStyle = '#0E1218'; g.fillRect(0, 0, w, h);
  if (mode === 'off') { g.fillStyle = '#7FD3FF'; g.font = F(800, 54, 'JBM'); g.fillText('OFFLINE', w / 2, 104); g.fillStyle = 'rgba(127,211,255,.6)'; g.font = F(700, 26, 'Inter'); g.fillText('no internet · keys stay inside', w / 2, 176); }
  else if (mode === 'zero') { g.fillStyle = '#FF6B5B'; g.font = F(800, 70, 'JBM'); g.fillText('0.00 BTC', w / 2, 118); g.fillStyle = 'rgba(255,255,255,.6)'; g.font = F(700, 26, 'Inter'); g.fillText('balance', w / 2, 186); }
  else {
    g.fillStyle = '#FFE27A'; g.font = F(800, 30, 'Inter'); g.fillText(mode === 'recipe' ? 'SECRET · FROM A RECIPE' : 'SECRET', w / 2, 34);
    for (let i = 0; i < 12; i++) { const x = 64 + (i % 6) * 77, y = 108 + Math.floor(i / 6) * 86;
      if (mode === 'hidden') { g.fillStyle = '#2A303C'; g.beginPath(); g.roundRect(x - 31, y - 31, 62, 62, 11); g.fill(); g.fillStyle = '#7A8494'; g.font = F(800, 38, 'JBM'); g.fillText('?', x, y + 2); }
      else if (mode === 'dice') face(g, x, y, 62, RND(i, k));
      else face(g, x, y, 62, [1, 2, 3][(i + k) % 3], '#5A3A1E', '#F3D9A8'); }
  }
  scrTx.needsUpdate = true;
}
let monKey = '';
function drawMon(t) {
  const mode = t >= T.b10 ? 'idle' : t >= T.b9 ? 'sweep' : t >= T.b8 - 0.4 ? 'guess' : 'idle';
  const k = mode === 'guess' ? Math.floor(t * 8) : mode === 'sweep' ? Math.floor(t * 10) : 0, key = mode + k;
  if (key === monKey) return; monKey = key;
  const g = monCv.getContext('2d'), w = 512, h = 320; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillStyle = '#120708'; g.fillRect(0, 0, w, h);
  if (mode === 'idle') { g.fillStyle = 'rgba(255,90,70,.5)'; g.font = F(800, 40, 'JBM'); g.fillText('_', w / 2, h / 2); }
  else if (mode === 'guess') {
    const done = Math.floor(c01((t - T.b8) / (T.b9 - T.b8 - 0.3)) * 4.001);
    g.fillStyle = '#FF8A7A'; g.font = F(800, 28, 'JBM'); g.fillText('REBUILDING SECRETS', w / 2, 30);
    for (let r = 0; r < 4; r++) for (let i = 0; i < 6; i++) { const x = 56 + i * 64, y = 84 + r * 62; face(g, x, y, 48, r < done ? [1, 2, 3][(i + r) % 3] : RND(i + r * 6, k), '#5A3A1E', r < done ? '#9BE39F' : '#F3D9A8'); }
    for (let r = 0; r < done; r++) { g.fillStyle = '#4CC46A'; g.font = F(800, 30, 'JBM'); g.textAlign = 'left'; g.fillText('MATCH', 432, 84 + r * 62); g.textAlign = 'center'; }
  } else { const n = Math.round(594 * eo(c01((t - T.b9) / (T.b10 - T.b9 - 0.3)))); g.fillStyle = '#FFC84A'; g.font = F(800, 92, 'JBM'); g.fillText('+' + n, w / 2, 140); g.fillStyle = 'rgba(255,255,255,.75)'; g.font = F(800, 34, 'Inter'); g.fillText('BTC SWEPT', w / 2, 236); }
  monTx.needsUpdate = true;
}

// ───────────────────────── camera path (spherical keys around a target; `up` tilts the view so the subject sits lower in the frame)
const DBC = [DB[0], DBY + 1.0, DB[1]];
const CAM = [
  { t: 0, tg: [4, 9, -30], d: 172, az: -5, el: 11, up: 0.03 },                                     // the cover: the snowy town at dusk, coins pouring out of the houses to the den
  { t: T.bigOut, tg: [4, 9, -36], d: 164, az: -4, el: 11, up: 0.04, mv: 1 },
  { t: T.safest, tg: [0, 6, -2], d: 46, az: 8, el: 12, up: 0.03, mv: 1 },                           // down to the glass vault in the square
  { t: T.hiding + 0.5, tg: [0, 5.6, -2], d: 41, az: 14, el: 11, up: 0.03 },
  { t: T.rob + 0.1, tg: [4, 3.2, 3], d: 31, az: 34, el: 9, up: 0.03, mv: 1 },                       // the thief outside
  { t: T.online3 + 0.3, tg: [4.5, 3.2, 3.5], d: 28, az: 28, el: 9, up: 0.03 },
  { t: T.touch + 0.25, tg: [5.5, 2.4, 7], d: 17, az: 34, el: 8, up: 0.02, mv: 1 },
  { t: T.secret4 + 0.1, tg: [SCR[0], SCR[1], SCR[2]], d: 13, az: 4, el: 3, up: 0.0, mv: 1 },         // the wallet's screen: the secret
  { t: T.chance + 0.1, tg: DBC, d: 11.5, az: -10, el: 9, up: 0.0, mv: 1 },                           // the dice box
  { t: T.dice5 + 0.5, tg: DBC, d: 10.5, az: -5, el: 8, up: 0.0 },
  { t: T.hidden + 0.1, tg: [0, 4.6, -3.2], d: 33, az: 0, el: 9, up: 0.0, mv: 1 },                    // the whole set: dice, wallet, recipe
  { t: T.recipe6 + 0.6, tg: [0.6, 4.4, -3.2], d: 30, az: 5, el: 9, up: 0.0 },
  { t: T.copyA + 0.45, tg: t => copyAt(t), d: 30, az: 8, el: 12, up: 0.0, mv: 1 },                   // follow the copy out through the roof...
  { t: T.guess7 + 0.2, tg: t => copyAt(t), d: 58, az: -10, el: 12, up: 0.0 },                        // ...over the town to the den
  { t: T.thieves + 0.55, tg: [DEN[0] - 0.5, 3.2, DEN[1] - 1], d: 25, az: 8, el: 16, up: 0.02, mv: 1 }, // inside the den: the computers
  { t: T.computers + 0.45, tg: [DEN[0] - 0.5, 3.0, DEN[1] - 1], d: 22, az: -6, el: 15, up: 0.02 },
  { t: T.m25 + 0.35, tg: [12, 16, -110], d: 240, az: -6, el: 22, up: 0.05, mv: 1 },                  // wide: the keys reach the houses, the coins pour out
  { t: T.empty + 0.5, tg: [12, 16, -110], d: 226, az: -3, el: 21, up: 0.05 },
  { t: T.nobody + 0.15, tg: [0, 6, -2], d: 60, az: 6, el: 14, up: 0.04, mv: 1 },                    // back at the vault: how did nobody notice?
  { t: T.wipe, tg: [0, 6, -2], d: 55, az: 8, el: 14, up: 0.04 },
  { t: T.wipe + 0.4, tg: [0, 90, -40], d: 40, az: 10, el: -40, up: 0, mv: 1 },                       // sky wipe: July night -> this week
  { t: T.wipe + 1.3, tg: [0, 3.6, 5], d: 47, az: 10, el: 23, up: 0.0, mv: 3 },                     // down in daylight: the 15 reviewers around the vault
  { t: T.missed + 0.35, tg: [0, 3.6, 5], d: 44, az: 4, el: 22, up: 0.0 },
  { t: T.every + 0.35, tg: DBC, d: 13.5, az: -8, el: 8, up: 0.0, mv: 1 },                            // the dice in the box, through the magnifier
  { t: T.rolled + 0.55, tg: DBC, d: 12, az: -3, el: 8, up: 0.0 },
  { t: T.almost + 0.4, tg: [BAL[0], 4.6, BAL[1]], d: 34, az: 10, el: 11, up: 0.05, mv: 1 },     // the balance: repaying owners, undecided
  { t: T.undecided + 0.55, tg: [BAL[0] - 0.5, 4.6, BAL[1]], d: 37, az: 4, el: 12, up: 0.05 },
  { t: T.over + 0.45, tg: [0, 8, -10], d: 105, az: 4, el: 22, up: 0.05, mv: 1 },                     // crane up
  { t: T.story + 1.0, tg: [4, 9, -30], d: 176, az: -5, el: 11, up: 0.05, mv: 3 },                    // the town at sunset: the title
  { t: T.cta - 0.2, tg: [4, 9, -30], d: 168, az: -3, el: 11, up: 0.05 },
  { t: T.cold + 0.35, tg: [0, 5.6, -2], d: 42, az: 4, el: 11, up: 0.03, mv: 1 },                     // down to the vault: would you still trust it?
  { t: DUR + 0.5, tg: [0, 5.6, -2], d: 37, az: 0, el: 10, up: 0.03 },
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
.card{font:700 30px/1.3 'Figtree',sans-serif;color:#fff;background:rgba(8,10,26,.88);border:2px solid rgba(255,225,160,.65);padding:16px 24px;border-radius:20px;text-align:center;white-space:pre;box-shadow:0 12px 34px rgba(5,7,20,.5);}
.card em{font-style:normal;color:#FFC84A;} .card s{text-decoration:none;color:#FF8A7A;} .card u{text-decoration:none;color:#9BE39F;} .card small{display:block;margin-top:8px;font:600 18px/1 'Inter',sans-serif;letter-spacing:.08em;color:rgba(255,255,255,.6);}
.tag.dn{color:#fff;background:#D9483B;border-color:#D9483B;} .tag.dn b{color:#fff;} .tag.ok{color:#062A10;background:#7FD89A;border-color:#7FD89A;} .tag.ok b{color:#062A10;} .tag.ice{color:#062A36;background:#BFEFFF;border-color:#BFEFFF;}
.stamp{font:900 64px/1 'Figtree',sans-serif;letter-spacing:.06em;color:#FF5A4A;border:6px solid #FF5A4A;padding:8px 22px 6px;border-radius:14px;background:rgba(40,6,4,.35);text-shadow:0 0 18px rgba(255,90,70,.6);}
.days{text-align:center;font:800 34px/1 'Inter',sans-serif;color:#fff;background:rgba(8,10,26,.9);border:2px solid rgba(255,225,160,.65);padding:22px 30px 20px;border-radius:24px;box-shadow:0 14px 40px rgba(5,7,20,.5);}
.days .r{display:flex;align-items:center;justify-content:center;gap:22px;} .days .p{font:800 40px/1 'JBM',monospace;background:#F4F2EC;color:#1C1300;border-radius:12px;padding:12px 16px;} .days .p.hot{background:#FF6B5B;color:#fff;}
.days .a{color:#FFC84A;font:800 40px/1 'Figtree',sans-serif;} .days .n{margin-top:16px;font:900 52px/1 'JBM',monospace;color:#FFC84A;letter-spacing:.02em;}
.clk{width:640px;text-align:center;background:rgba(8,10,26,.9);border:2px solid rgba(255,225,160,.65);padding:22px 0 24px;border-radius:26px;box-shadow:0 14px 40px rgba(5,7,20,.5);}
.clk .t{font:700 22px/1 'Inter',sans-serif;letter-spacing:.28em;color:#FFD27A;} .clk .v{margin-top:14px;font:800 92px/1 'JBM',monospace;color:#fff;letter-spacing:-2px;} .clk .v b{font-size:.5em;color:#FF6B5B;letter-spacing:0;margin-left:10px;}
.clk .bar{margin:18px auto 0;width:540px;height:22px;border-radius:11px;background:rgba(255,255,255,.12);overflow:hidden;} .clk .fill{height:22px;background:#FF6B5B;} .clk .s{margin-top:12px;font:500 18px/1 'Inter',sans-serif;color:rgba(255,255,255,.6);}
.cnt{text-align:center;font:800 30px/1 'Inter',sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#fff;background:rgba(8,10,26,.9);border:2px solid rgba(255,225,160,.65);padding:20px 30px 18px;border-radius:24px;box-shadow:0 14px 40px rgba(5,7,20,.5);}
.cnt b{display:block;font:900 96px/1 'JBM',monospace;letter-spacing:-2px;color:#7FD89A;margin-bottom:10px;} .cnt s{text-decoration:none;color:#FF8A7A;} .cnt small{display:block;margin-top:12px;font:600 17px/1 'Inter',sans-serif;letter-spacing:.06em;text-transform:none;color:rgba(255,255,255,.6);}
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
const tagVault = mk('tag', 'a cold wallet · <b>offline</b>'), tagThief = mk('tag dn', 'a thief'), tagSecret = mk('tag am', 'its secret');
const tagDice = mk('tag', 'pure chance'), tagLever = mk('tag dn', 'a hidden setting'), tagBook = mk('tag am', 'a recipe'), tagCopy = mk('tag dn', 'easier to guess');
const years = mk('days', `<div class="r"><span class="p">MAR 2021</span><span class="a">→</span><span class="p hot">JUL 2026</span></div><div class="n">5 YEARS</div>`);
const tagComp = mk('tag dn', "the thieves' computers"), tagKeys = mk('tag am', 'rebuilt keys');
const clk = mk('clk', `<div class="t">30 JUL 2026 · ONE SWEEP</div><div class="v"></div><div class="bar"><div class="fill"></div></div><div class="s">about 594 BTC from about 500 wallets · TRM Labs, CoinDesk</div>`);
const clkV = clk.querySelector('.v'), clkF = clk.querySelector('.fill');
const cnt = mk('cnt', `<b>0</b>security reviews · <s>all missed it</s><small>Coinkite's own report, 23 Nov 2026 · via Bitcoin Magazine, Bitcoin.com</small>`); const cntB = cnt.querySelector('b');
const tagIn = mk('tag ok', 'dice in the box <b>✓</b>'), tagRolled = mk('tag dn', 'rolled? <b>✗</b>');
const cardGone = mk('card', `<em>1,778.84 BTC</em> gone\nfrom 8,600+ addresses<small>Galaxy Research count, in Coinkite's postmortem</small>`);
const tagBal = mk('tag am', 'repaying owners: <b>?</b>'), tagBal2 = mk('tag grey', 'no decision yet');
const title = mk('title', '<div class="s">THE STORY OF</div><div class="n">The Dice\n<em>Nobody Rolled</em></div>');
const lesson = mk('lesson', `A safe is only as strong\nas its <em>secret</em>.`);
const ctaChip = mk('chip am', 'what about you?');
const boxes = [0, 1].map(() => { const e = mk('cbox', '<span class="in"></span><span class="post">Post</span>'); return { e, inn: e.querySelector('.in'), post: e.querySelector('.post') }; });
const foot = document.getElementById('foot');
foot.textContent = "Coinkite postmortem (23 Nov 2026) via Bitcoin Magazine, Bitcoin.com · CoinDesk · TRM Labs · Bloomberg\n$108M = 1,778.84 BTC (Galaxy Research) × $60,743 (CoinGecko, 26 Nov 2026) · simplified · not advice";
const setTxt = (e, s) => { if (e.textContent !== s) e.textContent = s; };
const setHTML = (e, s) => { if (e._h !== s) { e._h = s; e.innerHTML = s; } };
const p3 = (p, o = 1) => { const q = proj(p[0], p[1], p[2]); return [q[0], q[1], q[2] ? o : 0]; };

function updateUI(t) {
  updateCaption(t);
  foot.style.opacity = (0.95 * seg(t, 3.0, 3.6) * (1 - seg(t, T.cta, T.cta + 0.3) * 0.45)).toFixed(3);
  // 1 — the hook card (0-1.5 s, the cover), then the big number (1.5-3 s)
  if (hookEl) { const out = seg(t, T.hookEnd, T.hookEnd + (TIM.big ? 0.22 : 0.3)); put(hookEl, W / 2, 640 - 40 * eo(out), 1 - out, 1 + 0.035 * seg(t, 0, T.hookEnd) + 0.06 * out); }
  if (bigEl) { const o = win(t, T.bigIn, T.bigOut - 0.05, 0.15, 0.25), u = eo(seg(t, T.bigIn + 0.05, T.bigIn + 0.7)), land = seg(t, T.bigIn + 0.7, T.bigIn + 1.0), sh = (1 - land) * (land > 0 ? 1 : 0);
    bigBg.style.opacity = (0.92 * o).toFixed(3); setHTML(BIGN.v, bigText(u)); BIGN.line.style.strokeDashoffset = (BIGN.len * (1 - eo(seg(t, T.bigIn, T.bigIn + 0.9)))).toFixed(1);
    put(bigEl, W / 2 + Math.sin(t * 90) * 7 * sh, 860 + Math.cos(t * 77) * 5 * sh, o, pop(t, T.bigIn, 0.4) * (1 + 0.05 * Math.sin(Math.PI * land))); }
  // chips (one line at the top that says where we are)
  let ct = '', co = 0, cp = 0;
  const CH = [[T.bigOut + 0.05, T.b3 - 0.1, 'Coldcard hardware wallets'], [T.b3 + 0.05, T.b5 - 0.1, 'keys kept offline'], [T.b5 + 0.05, T.b6 - 0.1, 'how a wallet makes its secret'],
    [T.b7 + 0.05, T.b8 - 0.1, 'a recipe can be repeated'], [T.b8 + 0.05, T.b9 - 0.1, "the thieves' den"], [T.b9 + 0.05, T.b10 - 0.1, '30 July 2026'], [T.b10 + 0.05, T.wipe + 0.2, 'how did nobody notice?'],
    [T.wipe + 0.9, T.b12 - 0.1, 'this week · 24 Nov 2026'], [T.b12 + 0.05, T.b13 - 0.1, 'what the checks missed'], [T.b13 + 0.05, T.b14 - 0.1, "Coinkite's report · 23 Nov 2026"], [T.b14 + 0.05, T.b15 - 0.1, 'as of 26 Nov 2026']];
  for (const [a, b, s] of CH) { const o = win(t, a, b, 0.22, 0.22); if (o > co) { co = o; ct = s; cp = pop(t, a); } }
  if (ct) setTxt(chip, ct); put(chip, W / 2, 472, co, cp);
  // 2-4 — the vault, the thief, the secret
  { const p = p3([VC[0], 13.2, VC[1]], win(t, T.safest, T.b3 + 0.1, 0.3, 0.3)); put(tagVault, clampX(p[0]), clampY(p[1], 620, 1380), p[2], pop(t, T.safest)); }
  { const q = thief.position, p = p3([q.x, 2.9, q.z], win(t, T.rob - 0.05, T.guess4, 0.25, 0.2)); put(tagThief, clampX(p[0]), clampY(p[1], 620, 1420), p[2], pop(t, T.rob - 0.05)); }
  { const p = p3([SCR[0], SCR[1] + 1.4, SCR[2]], win(t, T.secret4, T.b5 - 0.05, 0.2, 0.2)); put(tagSecret, clampX(p[0]), clampY(p[1], 620, 1400), p[2], pop(t, T.secret4)); }
  // 5-7 — the dice, the hidden setting, the recipe, the copy
  { const p = p3([DB[0], DBY + 3.3, DB[1]], win(t, T.chance, T.b7 - 0.1, 0.25, 0.25)); const off = t > T.swap + 0.1; setHTML(tagDice, off ? 'dice: <b>off</b>' : 'pure chance'); const cl = 'abs tag' + (off ? ' grey' : ''); if (tagDice.className !== cl) tagDice.className = cl; put(tagDice, clampX(p[0]), clampY(p[1], 620, 1400), p[2], pop(t, T.chance) * (off ? pop(t, T.swap + 0.1) : 1)); }
  { const q = lever.position, p = p3([q.x, q.y + 0.2, q.z + 0.4], win(t, T.hidden, T.b7 - 0.1, 0.2, 0.25)); put(tagLever, clampX(p[0]), clampY(p[1] + 60, 620, 1420), p[2], pop(t, T.hidden)); }
  { const p = p3([BK[0], FY + 4.2, BK[1]], win(t, T.bookIn + 0.1, T.b7 + 0.2, 0.2, 0.25)); put(tagBook, clampX(p[0], 270), clampY(p[1], 620, 1400), p[2], pop(t, T.bookIn + 0.1)); }
  put(years, W / 2, 1392, win(t, T.five - 0.1, T.b7 - 0.15, 0.25, 0.25), pop(t, T.five - 0.1));
  { const c = copyAt(t), p = p3([c[0], c[1] + 2.4, c[2]], win(t, T.easier, T.b8 - 0.2, 0.2, 0.25)); put(tagCopy, clampX(p[0]), clampY(p[1], 620, 1400), p[2], pop(t, T.easier)); }
  // 8-9 — the den, the keys, the sweep
  { const p = p3([DEN[0] - 1.2, 5.6, DEN[1] - 3.8], win(t, T.thieves + 0.3, T.b9 - 0.1, 0.25, 0.25)); put(tagComp, clampX(p[0]), clampY(p[1], 620, 1400), p[2], pop(t, T.thieves + 0.3)); }
  { const k = keyAt(Math.floor(NROB / 2), t) || [DEN[0], 3, DEN[1]], p = p3([k[0], k[1] + 2.2, k[2]], win(t, T.computers, T.b9 - 0.1, 0.2, 0.2)); put(tagKeys, clampX(p[0]), clampY(p[1], 620, 1400), p[2], pop(t, T.computers)); }
  { const o = win(t, T.m25 - 0.15, T.b10 - 0.05, 0.25, 0.25), u = eo(seg(t, T.m25 - 0.1, T.empty + 0.3)), m = Math.round(25 * u); setHTML(clkV, `${m}<b>MIN</b>`); clkF.style.width = (540 * u).toFixed(1) + 'px'; put(clk, W / 2, 1200, o, pop(t, T.m25 - 0.15)); }
  // 11-12 — the report, the 15 reviews, the dice in the box
  { const n = Math.min(15, Math.floor(c01((t - T.insp) / (15 * 0.075 + 0.05)) * 15.001)); setTxt(cntB, String(n)); put(cnt, W / 2, 1418, win(t, T.n15 - 0.1, T.b12 - 0.1, 0.25, 0.25), pop(t, T.n15 - 0.1) * (1 + 0.06 * win(t, T.missed, T.missed + 0.3, 0.1, 0.2))); }
  { const p = p3([DB[0], DBY + 3.3, DB[1]], win(t, T.box - 0.25, T.b13 - 0.1, 0.2, 0.25)); put(tagIn, clampX(p[0]), clampY(p[1], 620, 1400), p[2], pop(t, T.box - 0.25)); }
  { const p = p3([DB[0], DBY - 0.9, DB[1] + 1.4], win(t, T.rolled - 0.1, T.b13 - 0.1, 0.2, 0.25)); put(tagRolled, clampX(p[0]), clampY(p[1] + 40, 640, 1420), p[2], pop(t, T.rolled - 0.1)); }
  // 13 — gone; repaying undecided
  put(cardGone, W / 2, 1440, win(t, T.almost, T.b14 - 0.1, 0.25, 0.25), pop(t, T.almost));
  { const p = p3([BAL[0], 10.2, BAL[1]], win(t, T.repaying, T.b14 + 0.2, 0.25, 0.25)); put(tagBal, clampX(p[0], 260), clampY(p[1], 620, 1080), p[2], pop(t, T.repaying)); }
  { const p = p3([BAL[0], 10.2, BAL[1]], win(t, T.undecided, T.b14 + 0.2, 0.25, 0.25)); put(tagBal2, clampX(p[0], 260), clampY(p[1] + 70, 680, 1150), p[2], pop(t, T.undecided)); }
  // 15 — title and lesson; 16 — the question
  put(title, W / 2, 640, win(t, T.story, T.cta - 0.1, 0.4, 0.3), 0.94 + 0.06 * eo(seg(t, T.story, T.story + 0.6)));
  put(lesson, W / 2, 1180, win(t, T.safe, T.cta - 0.15, 0.3, 0.25), pop(t, T.safe));
  put(ctaChip, W / 2, 472, seg(t, T.would, T.would + 0.3), pop(t, T.would));
  [[T.trustW, 'TRUST', T.postA], [T.doubtW, 'DOUBT', T.postB]].forEach(([t0, word, tp], i) => {
    const bx = boxes[i], L = word.length, n = Math.min(L, Math.floor(c01((t - t0) / (0.1 * L)) * (L + 0.001))), typed = word.slice(0, n), caret = (n < L || Math.floor(t * 2.4) % 2) && t < tp ? '<i></i>' : '';
    setHTML(bx.inn, typed ? `<b>${typed}</b>${caret}` : `<em>Add a comment…</em>${caret}`); const sent = t > tp; const pc = sent ? 'post on sent' : n === L ? 'post on' : 'post'; if (bx.post.className !== pc) bx.post.className = pc; setTxt(bx.post, sent ? 'Posted ✓' : 'Post');
    const ts = i ? T.doubtW - 0.35 : T.comment; put(bx.e, W / 2, 1300 + i * 132, seg(t, ts, ts + 0.3), pop(t, ts) * (1 + 0.06 * win(t, tp, tp + 0.3, 0.08, 0.2)));
  });
}

// ───────────────────────── one frame
const hopY = (hops, t, h = 0.5) => { let y = 0; for (const t0 of hops) { const u = (t - t0) / 0.38; if (u > 0 && u < 1) y = Math.max(y, Math.sin(u * Math.PI) * h); } return y; };
function copyAt(t) {   // the copied recipe: out through the vault's roof hatch, up over the town, down into the den
  const u = 0.5 - 0.5 * Math.cos(Math.PI * seg(t, T.copyA, T.copyB)), p0 = [VC[0] + 0.5, 13.0, VC[1]], p1 = [VC[0] + 4, 36, VC[1] - 22], p2 = [DEN[0], 58, DEN[1] + 70], p3 = [DEN[0] - 1, 3.2, DEN[1] - 2.6];
  return bez(p0, p1, p2, p3, u);
}
function renderAt(t) {
  const s = skyAt(t), night = s.glow;
  paintSky(s);
  scene.fog.color.setRGB(...s.fog); scene.fog.near = s.fn; scene.fog.far = s.ff;
  hemi.color.setRGB(...s.hemS); hemi.groundColor.setRGB(...s.hemG); hemi.intensity = s.hemI;
  sun.color.setRGB(...s.sunC); sun.intensity = s.sunI;
  const az = s.az * Math.PI / 180, el = s.el * Math.PI / 180, sd = [Math.cos(el) * Math.sin(az), Math.sin(el), Math.cos(el) * Math.cos(az)];
  starM.opacity = s.star * 0.9; stars.visible = s.star > 0.01;
  setCamera(t);
  glowMat.opacity = c01(night * 1.1); lampM.emissiveIntensity = night * 1.4; BTCM.emissiveIntensity = 0.7 + 0.55 * night;
  ROB.forEach((h, i) => { const [a, b] = robWin(i), off = t > T.b3 && t > b - 0.2 && t < T.wipe + 0.3 ? 0 : 1; robGlowM[i].opacity = c01(night * 1.1) * off; });
  // the vault: the pile drains in the theft and stays empty
  { const k = t < T.hundreds ? 1 : t < T.wipe ? 1 - eio(seg(t, T.hundreds, T.empty + 0.3)) : 0;
    PILE.forEach((c, i) => { const sc = c01(k * 1.6 - (i / PILE.length) * 0.6); _p.set(c[0], c[1], c[2]); _e.set(c[3], 0, c[4]); _q.setFromEuler(_e); _s.setScalar(Math.max(sc, 0.0001)); pileMesh.setMatrixAt(i, _m4.compose(_p, _q, _s)); }); pileMesh.instanceMatrix.needsUpdate = true; }
  // the dice tumble during "pure chance", then lie still (and stay still for five years)
  DICE.forEach((m, i) => { const ud = m.userData, roll = win(t, T.rollA, T.rollB, 0.05, 0.25) * (t < T.swap ? 1 : 0), ph = t * 7 + ud.ph;
    const y = DBY + 0.42 + roll * Math.abs(Math.sin(ph * 1.3)) * 1.2; m.position.set(ud.x + roll * Math.sin(ph) * 0.35, y, ud.z + roll * Math.cos(ph * 0.8) * 0.3);
    const r = ud.rest; m.rotation.set(r[0] + roll * ph * 1.1, r[1] + roll * ph * 0.7, r[2] + roll * ph * 0.9); });
  DIEM.color.setHex(t > T.swap + 0.3 && t < T.wipe ? 0x8C929C : 0xFFFFFF);
  lever.rotation.z = lerp(0.6, -0.6, eio(seg(t, T.swap - 0.25, T.swap + 0.15)));
  { const k = back(seg(t, T.bookIn, T.bookIn + 0.4)); book.scale.setScalar(Math.max(0.001, k)); book.visible = k > 0.002; }
  // cables: the dice cable glows while the dice roll; after the swap the book's cable glows; packets run along the live one
  { const dOn = t < T.swap && t > T.rollA - 0.2 ? 1 : 0, bOn = t > T.bookIn + 0.3 && t < T.b8 ? 1 : (t > T.wipe + 0.6 && t < T.b13 ? 0.6 : 0);
    cabDM.color.setHex(dOn ? 0xFFB84A : 0x3A3F4A); cabBM.color.setHex(bOn ? 0xFF8A4A : 0x3A3F4A);
    pkts.forEach((m, i) => { const cv = dOn ? curveD : bOn ? curveB : null; m.visible = !!cv; if (!cv) return; const u = ((t * 0.9 + i / pkts.length) % 1); m.position.copy(cv.getPointAt(u)); });
    pktM.color.setHex(dOn ? 0xFFE27A : 0xFFA26A); }
  { const on = t > T.copyA && t < T.copyB + 0.1, c = copyAt(t), k = back(seg(t, T.copyA, T.copyA + 0.35)) * (1 - 0.6 * seg(t, T.copyB - 0.4, T.copyB)); bookCopy.visible = on; bookCopy.position.set(c[0], c[1], c[2]); bookCopy.rotation.set(0.4 * Math.sin(t * 3), t * 1.4, 0.2); bookCopy.scale.setScalar(Math.max(0.001, k)); copyGlow.visible = on; copyGlow.position.set(c[0], c[1] + 0.6, c[2]); copyGlow.scale.setScalar(12 * k); }
  // the thief: watches the vault, shrugs at "touch", then walks off
  { const u = eio(seg(t, T.guess4 - 0.1, T.b5 + 0.4)), x = lerp(TH0[0], TH1[0], u), z = lerp(TH0[1], TH1[1], u); thief.position.set(x, hopY([T.touch + 0.05], t, 0.25) + (u > 0 && u < 1 ? Math.abs(Math.sin(t * 9)) * 0.08 : 0), z);
    thief.rotation.y = u > 0.02 ? Math.atan2(-(TH1[1] - TH0[1]), TH1[0] - TH0[0]) : Math.atan2(-(VC[1] - TH0[1]), VC[0] - TH0[0]); thief.visible = t > T.b2 && t < T.b6; }
  // the den: screens, red light, crooks, keys, coins, the den's heap
  drawScreen(t); drawMon(t);
  denLight.intensity = 60 * win(t, T.b7, T.b10 + 0.5, 0.6, 0.6); beacon.scale.setScalar(0.7 + 0.3 * Math.abs(Math.sin(t * 3))); beaconGlow.material.opacity = 0.5 + 0.4 * Math.abs(Math.sin(t * 3));
  crooks.forEach((p, i) => { p.position.y = 0.3 + hopY([T.rebuilt + 0.2 + i * 0.15, T.computers + 0.3 + i * 0.1, T.empty + i * 0.1], t, 0.3); });
  { let n = 0; for (let i = 0; i < NROB; i++) { const k = keyAt(i, t); if (!k) continue; _p.set(k[0], k[1], k[2]); _e.set(0.3 * Math.sin(t * 4 + i), t * 3 + i, 0.2); _q.setFromEuler(_e); _p.set(k[0], k[1], k[2]); _s.setScalar(1.1 + 1.6 * c01((camera.position.distanceTo(_p) - 45) / 140)); keysM.setMatrixAt(n++, _m4.compose(_p, _q, _s)); } keysM.count = n; keysM.instanceMatrix.needsUpdate = true; }
  { let n = 0; for (let i = 0; i < NC; i++) { const p = coinAt(i, t); if (!p) continue; const c = CR[i]; _e.set(t * c.sp + c.ph, c.ph, t * c.sp * 0.7); _q.setFromEuler(_e); _p.set(p[0], p[1], p[2]); _s.setScalar(1 + 1.7 * c01((camera.position.distanceTo(_p) - 45) / 140)); coins.setMatrixAt(n++, _m4.compose(_p, _q, _s)); } coins.count = n; coins.instanceMatrix.needsUpdate = true; }
  { const k = t < T.b3 ? 0.55 : t < T.theftA ? 0.1 : 0.1 + 0.9 * eio(seg(t, T.theftA + 1.5, T.theftB + 2.5));
    DPILE.forEach((c, i) => { const sc = c01(k * 1.5 - (i / DPILE.length) * 0.5); _p.set(c[0], c[1], c[2]); _e.set(c[3], 0, c[4]); _q.setFromEuler(_e); _s.setScalar(Math.max(sc, 0.0001)); dpileMesh.setMatrixAt(i, _m4.compose(_p, _q, _s)); }); dpileMesh.instanceMatrix.needsUpdate = true; }
  storm.forEach((m, i) => { m.position.x = m.userData.x0 + Math.sin(t * 0.3 + i) * 3; m.material.color.setRGB(0.36, 0.36, 0.44); m.material.opacity = 0.95; });
  // November: the reviewers arrive, each check pops; the lead reviewer's magnifier at the dice box; the balance rocks
  INSP.forEach((q, i) => { const on = t > T.wipe + 0.5 && t < T.b14 + 0.6, k = on ? back(seg(t, q.t, q.t + 0.35)) : 0; q.p.visible = k > 0.002; q.p.scale.setScalar(Math.max(0.001, k) * 1.05);
    const c = on && t > q.tc && t < T.b13 - 0.1 ? back(seg(t, q.tc, q.tc + 0.3)) : 0; q.cm.visible = c > 0.002; q.cm.position.set(q.x, 3.3 + 0.1 * Math.sin(t * 3 + i), q.z); q.cm.quaternion.copy(camera.quaternion); q.cm.scale.setScalar(Math.max(0.001, c)); });
  { const on = t > T.wipe + 0.5 && t < T.b14 + 0.6; lead.visible = on; lead.position.y = hopY([T.box - 0.1], t, 0.18); }
  { const k = win(t, T.every - 0.15, T.b13 - 0.2, 0.35, 0.3); bigMag.visible = k > 0.01; bigMag.scale.setScalar(0.7 * Math.max(0.001, back(c01(k)))); bigMag.position.set(DB[0] + 0.15 + 0.2 * Math.sin(t * 1.3), DBY + 1.1 + 0.15 * Math.sin(t * 1.7), 1.0); bigMag.rotation.set(0, -0.14, 0.5 + 0.06 * Math.sin(t)); }
  { const k = back(seg(t, T.almost - 0.5, T.almost - 0.1)); bal.visible = t > T.almost - 0.5 && t < T.b15 + 0.5; bal.scale.setScalar(Math.max(0.001, k)); }
  { const rock = t > T.almost - 0.3 && t < T.b15 ? Math.sin((t - T.almost) * 2.6) * 0.22 * win(t, T.almost - 0.3, T.b15, 0.5, 0.6) : 0; bal.userData.beam.rotation.z = rock; bal.userData.pans.forEach(p => { p.rotation.z = -rock; });
    const qo = win(t, T.repaying, T.b14 + 0.4, 0.3, 0.3); qMesh.visible = qo > 0.01; const pp = new THREE.Vector3(); bal.userData.pans[1].getWorldPosition(pp); qMesh.position.set(pp.x, pp.y - 1.6 + 0.12 * Math.sin(t * 3), pp.z); qMesh.quaternion.copy(camera.quaternion); qMesh.scale.setScalar(Math.max(0.001, qo * back(seg(t, T.repaying, T.repaying + 0.35))) * 1.6); }
  // snow falls around wherever the camera looks
  { const a = snowG.attributes.position, span = Math.max(60, Math.min(260, camD * 1.4)), cx = camTg.x, cz = camTg.z, cy = camTg.y;
    for (let i = 0; i < NSN; i++) { const q = SN[i], fall = ((q[1] - t * 0.05 * q[3]) % 1 + 1) % 1; a.setXYZ(i, cx + (q[0] - 0.5) * span + Math.sin(t * 0.7 + q[4]) * 0.8, cy - span * 0.25 + fall * span * 0.6, cz + (q[2] - 0.5) * span); }
    a.needsUpdate = true; snow.material.size = 0.35 + camD * 0.006; }
  for (const c of clouds) { c.position.x = c.userData.x0 + t * 1.2; c.material.opacity = 0.9 - 0.5 * night; const k = lerp(1, 0.45, night); c.material.color.setRGB(lerp(s.hor[0], 1, 0.55) * k, lerp(s.hor[1], 1, 0.55) * k, lerp(s.hor[2], 1, 0.55) * k * 1.05); }
  // sparkles: on the coins in the den; on the posted comments
  { let k = 0; const put3 = (x, y, z, sz, on, col) => { const sp = sparks[k++]; if (!sp) return; const tw = Math.pow(Math.abs(Math.sin(t * sp.userData.w + sp.userData.ph)), 3); sp.position.set(x, y, z); sp.scale.setScalar(sz * (0.25 + tw)); sp.material.opacity = on * (0.3 + 0.7 * tw); sp.material.color.setHex(col); sp.visible = on > 0.01; };
    const s1 = win(t, T.theftA + 1.5, T.b10 + 0.3, 0.4, 0.5); for (let i = 0; i < 18; i++) { const sp = sparks[i].userData; put3(DEN[0] + 3 + sp.dx * 2.4, 1.6 + Math.abs(sp.dz) * 1.2, DEN[1] + 1.2 + sp.dz * 1.8, 1.2, s1, 0xFFE9A8); }
    const s2 = win(t, T.b2, T.b3, 0.3, 0.4); for (let i = 0; i < 18; i++) { const sp = sparks[18 + i].userData; put3(WAL[0] + sp.dx * 2.5, FY + 0.8 + Math.abs(sp.dz), WAL[1] + 2.4 + sp.dz, 0.9, s2, 0xFFE9A8); }
    const s4 = win(t, T.postA, DUR + 1, 0.4, 0.1); for (let i = 0; i < 16; i++) { const ph = (t * 0.35 + i / 16) % 1, a = i * 2.4; put3(WAL[0] + Math.cos(a) * (3 + ph * 2), FY + 2 + ph * 7, WAL[1] + 3 + Math.sin(a) * 1.2, 0.5 + 0.3 * (1 - ph), s4 * Math.sin(ph * Math.PI), 0xFFE9A8); }
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
  keys: ROB.map((_, i) => +(T.keysA + (i / NROB) * (T.keysB - T.keysA - 1.7) + 1.7).toFixed(3)),
  houses: ROB.map((_, i) => +robWin(i)[0].toFixed(3)),
  insp: INSP.map(q => +q.t.toFixed(3)), checks: INSP.map(q => +q.tc.toFixed(3)),
  typingA: [0, 1, 2, 3, 4].map(i => +(T.trustW + (i + 0.5) * 0.1).toFixed(3)), typingB: [0, 1, 2, 3, 4].map(i => +(T.doubtW + (i + 0.5) * 0.1).toFixed(3)),
  postA: +T.postA.toFixed(3), postB: +T.postB.toFixed(3),
};
document.fonts.ready.then(() => Promise.all(['700 64px Figtree', '900 190px Fraunces', '800 30px JBM', '700 22px Inter', '700 78px Fraunces', '800 54px Figtree', '600 34px Figtree', '500 18px Inter', '900 128px JBM', '800 46px Inter', '900 150px Figtree', '900 112px Fraunces', '800 172px JBM', '700 34px Figtree', '800 92px JBM', '900 64px Figtree', '800 70px JBM', '800 54px JBM', '800 28px JBM', '800 34px Inter', '900 96px JBM'].map(f => document.fonts.load(f)))).then(() => { fitHook(); renderAt(0); window.__ready = true; });
