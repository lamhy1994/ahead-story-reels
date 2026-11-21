// The Bitcoin Vault — low-poly storybook scene (deterministic: window.renderAt(t) draws the frame for time t)
import * as THREE from 'three';
import { SKIN, MAT, rng, GB, person, cloud, bushTree, tower, hq, lamp, car, WIN_LIT, kiosk, bigButton, BIGCOIN, glassVault, vaultDoor, CASH, CERT, listSlab, pedestal } from './kit.js';

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
const R = rng(20261121);

// ───────────────────────── story clock (everything hangs off the narration)
const T = {
  nov: wt(1, 'November') - 0.1, mountain: wt(1, 'mountain') - 0.1, worth1: wt(1, 'worth') - 0.1, less: wt(1, 'less') - 0.1,
  b2: S(2) - 0.05, strategy2: wt(2, 'Strategy') - 0.1,
  b3: S(3) - 0.05, y2020: wt(3, '2020') - 0.1, boss: wt(3, 'boss') - 0.1, saylor: wt(3, 'Saylor') - 0.1, superior: wt(3, 'superior') - 0.1, cash3: wt(3, 'cash') - 0.1,
  b4: S(4) - 0.05, swapped: wt(4, 'swapped') - 0.1, p250: wt(4, '$250') - 0.1, bitcoin4: wt(4, 'bitcoin') - 0.1,
  b5: S(5) - 0.05, kept: wt(5, 'kept') - 0.1, shares5: wt(5, 'shares') - 0.1, loans: wt(5, 'loans') - 0.1,
  b6: S(6) - 0.05, average: wt(6, 'average') - 0.1, p75: wt(6, '$75,000') - 0.1, coin6: wt(6, 'coin') - 0.1,
  b7: S(7) - 0.05, fell: wt(7, 'fell') - 0.1, p60: wt(7, '$60,000') - 0.1,
  b8: S(8) - 0.05, picture: wt(8, 'Picture') - 0.1, bought8: wt(8, 'bought') - 0.1, now8: wt(8, 'now') - 0.1, p59: wt(8, '$59,000') - 0.1,
  b9: S(9) - 0.05, p16: wt(9, '$16,000') - 0.1, paper: wt(9, 'paper') - 0.1, unless: wt(9, 'unless') - 0.1, sold9: wt(9, 'sold') - 0.1,
  b10: S(10) - 0.05, whole: wt(10, 'whole') - 0.1, p64: wt(10, '$64') - 0.1, worth10: wt(10, 'worth') - 0.1, p50: wt(10, '$50') - 0.1,
  wipe1: S(11) - 0.45, second: wt(11, 'second') - 0.1, blow: wt(11, 'blow') - 0.1,
  b12: S(12) - 0.05, msci: wt(12, 'MSCI') - 0.1, lists: wt(12, 'lists') - 0.1, funds12: wt(12, 'funds') - 0.1, copy: wt(12, 'copy') - 0.1, assets: wt(12, 'assets') - 0.1, belong: wt(12, 'belong') - 0.1,
  b13: S(13) - 0.05, thirtieth: wt(13, 'thirtieth') - 0.1, out: wt(13, 'out') - 0.1, funds13: wt(13, 'funds') - 0.1, sell13: wt(13, 'sell') - 0.1, shares13: wt(13, 'shares') - 0.1,
  wipe2: S(14) - 0.45, news: wt(14, 'news') - 0.1, still: wt(14, 'still') - 0.1, p485: wt(14, '485') - 0.1, coins14: wt(14, 'coins') - 0.1,
  b15: S(15) - 0.05, over: wt(15, 'over') - 0.1,
  b16: S(16) - 0.05, story: wt(16, 'story') - 0.15, vault16: wt(16, 'vault') - 0.1, biggest: wt(16, 'biggest') - 0.1, price: wt(16, 'price') - 0.1,
  cta: S(17) - 0.1, decide: wt(17, 'decide') - 0.1, would: wt(17, 'Would') - 0.1, sold: wt(17, 'sold') - 0.1, held: wt(17, 'held') - 0.1, comment: wt(17, 'Comment') - 0.15, sell: wt(17, 'SELL') - 0.2, hold: wt(17, 'HOLD') - 0.1,
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
const SKY = [[0, 'NIGHT'], [T.b3 - 0.1, 'NIGHT'], [T.b3 + 1.1, 'MORN'], [T.b5, 'DAY'], [T.b6, 'DAY'], [T.b6 + 1.6, 'GOLDEN'], [T.fell, 'GOLDEN'], [T.p60 + 0.4, 'SUNSET'], [T.b8 + 1.0, 'DUSK'],
  [T.wipe1 + 0.15, 'DUSK'], [T.wipe1 + 1.0, 'MORN'], [T.b13, 'DAY'], [T.wipe2 + 0.15, 'DAY'], [T.wipe2 + 1.0, 'SUNSET'], [T.b15, 'SUNSET'], [T.over + 0.8, 'NIGHT'], [T.cta + 0.4, 'NIGHT'], [T.cta + 2.2, 'DUSK'], [DUR + 2, 'DUSK']];
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
flat.box(8, 0.04, 500, 0x4A4E56, -48, 0.022, 40); flat.box(8, 0.04, 500, 0x4A4E56, 48, 0.023, 40);
flat.box(80, 0.06, 66, 0xE6DFD0, 0, 0.03, 3);                                                      // the vault plaza
for (let i = 0; i < 16; i++) flat.box(80, 0.065, 0.12, 0xD6CEBC, 0, 0.034, -29 + i * 4);
flat.box(70, 0.06, 56, 0xE6DFD0, 0, 0.03, 144);                                                    // the list plaza
for (let i = 0; i < 13; i++) flat.box(70, 0.065, 0.12, 0xD6CEBC, 0, 0.034, 118 + i * 4);
{ const rr = rng(404); for (let i = 0; i < 60; i++) { const x = (rr() - 0.5) * 520, z = -220 + rr() * 460; if ((Math.abs(x) < 44 && z > -36 && z < 36) || (Math.abs(x) < 40 && z > 112 && z < 176) || (Math.abs(x) < 30 && z > 30 && z < 112)) continue; flat.box(6 + rr() * 14, 0.06, 6 + rr() * 14, rr() < 0.5 ? 0x8DAE74 : 0x9DB884, x, 0.03, z); } }
const flatM = flat.mesh(); flatM.castShadow = false; scene.add(flatM);

// ───────────────────────── the vault: a glass box full of gold coins in front of the company's headquarters
const V = [0, 0, 10], VW = 16, VD = 12, VH = 9;
const vlt = glassVault(VW, VD, VH); vlt.position.set(V[0], 0, V[2]); scene.add(vlt); vlt.children.forEach(c => { c.castShadow = true; c.receiveShadow = true; });
const FY = vlt.userData.floorY;
stat.push([V[0] - VW / 2 - 0.9, V[0] + VW / 2 + 0.9, V[2] - VD / 2 - 0.9, V[2] + VD / 2 + 0.9, VH + 1.4, 'vault']);
const door = vaultDoor(2.6); door.position.set(V[0] + VW / 2 + 0.1, FY + 2.9, V[2]); door.rotation.y = Math.PI / 2; door.userData.pivot.rotation.y = -1.75; scene.add(door);
// the pile: a faceted gold mound that grows, with coins lying on its surface
const PA = 6.9, PB = 5.0, PH = 5.6;
const moundG = (() => { const g = new THREE.SphereGeometry(1, 18, 7, 0, Math.PI * 2, 0, Math.PI / 2).toNonIndexed(); g.computeVertexNormals(); return g; })();
const pileM = new THREE.MeshLambertMaterial({ color: 0xE9A814, emissive: 0x8A5200, emissiveIntensity: 0.35 });
const mound = new THREE.Mesh(moundG, pileM); mound.castShadow = true; mound.receiveShadow = true; mound.position.set(V[0], FY, V[2]); scene.add(mound);
const coinGeo = BIGCOIN(0.45, 0.14);
const coinM = new THREE.MeshLambertMaterial({ color: 0xF7B500, emissive: 0xA86A00, emissiveIntensity: 0.5 });
const NPC = 420, PC = [];
{ const rr = rng(6061); for (let i = 0; i < NPC; i++) { const a = rr() * Math.PI * 2, r = Math.sqrt(rr()) * 0.97; PC.push({ u: Math.cos(a) * r, v: Math.sin(a) * r, b: Math.min(0.999, Math.pow(i / NPC, 1.15) * 0.96 + rr() * 0.04), rx: (rr() - 0.5) * 1.1, ry: rr() * 6.28, rz: (rr() - 0.5) * 1.1 }); } PC.sort((p, q) => (p.u * p.u + p.v * p.v) - (q.u * q.u + q.v * q.v)); PC.forEach((p, i) => { p.b = Math.min(0.999, Math.pow(i / NPC, 1.3)); }); }
const pileCoins = new THREE.InstancedMesh(coinGeo, coinM, NPC); pileCoins.castShadow = true; pileCoins.frustumCulled = false; scene.add(pileCoins);
// how full the vault is (1 = 850,849 coins): full in November 2026; rewinds to empty in 2020; $250M buys the first 2.5%; then it fills, week after week
function fillAt(t) {
  if (t < T.y2020) return 1;
  if (t < T.swapped) return 1 - eio(seg(t, T.y2020, T.y2020 + 1.1));
  if (t < T.kept) return 0.025 * eo(seg(t, T.swapped + 0.6, T.bitcoin4 + 0.5));
  return lerp(0.025, 1, eio(seg(t, T.kept + 0.2, T.average - 0.1)));
}
const pileScale = f => 0.32 + 0.68 * Math.sqrt(f);
const pileTop = t => FY + PH * Math.sqrt(fillAt(t));
// the headquarters behind the vault (its sign changes name: MicroStrategy in 2020, Strategy today)
const HQ = [0, 0, -18];
const hqm = hq({ rand: rng(3030), ah: 24 }); hqm.position.set(HQ[0], 0, HQ[2]); hqm.children.forEach(c => { c.castShadow = true; c.receiveShadow = true; }); scene.add(hqm);
stat.push([HQ[0] - 26, HQ[0] + 26, HQ[2] - 12, HQ[2] + 12.5, 28, 'hq']);
const hqCv = document.createElement('canvas'); hqCv.width = 1024; hqCv.height = 192; const hqTx = new THREE.CanvasTexture(hqCv); hqTx.colorSpace = THREE.SRGBColorSpace;
const hqSign = new THREE.Mesh(new THREE.PlaneGeometry(15, 2.8), new THREE.MeshBasicMaterial({ map: hqTx, toneMapped: false, transparent: true })); hqSign.position.set(HQ[0], 20.2, HQ[2] + 8 + 0.2); scene.add(hqSign);
// two kiosks feed the vault with money: one sells new shares, one lends
const KL = [-16, 0, 13], KR = [16, 0, 13];
const kl = kiosk(); kl.position.set(KL[0], 0, KL[2]); scene.add(kl);
const kr = kiosk(); kr.position.set(KR[0], 0, KR[2]); kr.rotation.y = Math.PI; scene.add(kr);
const signM = (txt, bg, fg) => { const cv = document.createElement('canvas'); cv.width = 512; cv.height = 128; const g = cv.getContext('2d'); g.fillStyle = bg; g.fillRect(0, 0, 512, 128); g.fillStyle = fg; g.font = '900 72px Figtree'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(txt, 256, 68); const tx = new THREE.CanvasTexture(cv); tx.colorSpace = THREE.SRGBColorSpace; return [new THREE.MeshLambertMaterial({ map: tx }), cv, g, tx]; };
const kioskSigns = [];
for (const [K, txt, bg] of [[KL, 'NEW SHARES', '#2F3A55'], [KR, 'LOANS', '#6A2E3E']]) {
  const b = new GB(); b.box(0.25, 2.2, 0.25, 0x5A5F66, K[0] - 1.9, 4.2, K[2] + 1.0); b.box(0.25, 2.2, 0.25, 0x5A5F66, K[0] + 1.9, 4.2, K[2] + 1.0); b.box(4.6, 1.3, 0.2, 0x3A3F48, K[0], 5.4, K[2] + 0.9); scene.add(b.mesh());
  const [m, cv, g, tx] = signM(txt, bg, '#FFF6E6'); const pl = new THREE.Mesh(new THREE.PlaneGeometry(4.3, 1.05), m); pl.position.set(K[0], 5.4, K[2] + 1.02); scene.add(pl); kioskSigns.push({ cv, g, tx, txt, bg });
  stat.push([K[0] - 2.4, K[0] + 2.4, K[2] - 2.4, K[2] + 2.4, 6.4, 'kiosk']);
}
const clerks = [[KL, 1], [KR, -1]].map(([K, s], k) => { const m = person({ robe: k ? 0x6A2E3E : 0x2F3A55, skin: SKIN[k ? 1 : 3], short: 0x2A2020, shirt: 0xF4F2EC, tie: k ? 0xE09A2B : 0x2F6FB8, s: 1.0 }); m.position.set(K[0] - s * 0.5, 0, K[2]); m.rotation.y = s > 0 ? 0 : Math.PI; scene.add(m); return m; });
// cash: the 2020 pallet beside the boss, and the streams from the two kiosks (bundles fly into the hatch in the roof)
const cashM = MAT;
const HATCH = [V[0], FY + VH + 0.6, V[2]];
const SY = [-5.2, 0, 25.2], CP = [-0.4, 0, 26.8];
const boss = person({ robe: 0x23283A, skin: SKIN[4], short: 0xA8A49C, shirt: 0xF4F2EC, tie: 0x2F6FB8, s: 1.06 }); boss.position.set(SY[0], 0, SY[2]); boss.rotation.y = -0.9; scene.add(boss);
const pallet = (() => { const b = new GB(); b.box(3.4, 0.3, 2.2, 0x9A7A52, 0, 0.15, 0); for (const x of [-1.4, 0, 1.4]) b.box(0.2, 0.3, 2.2, 0x7A5A3A, x, 0.15, 0); return b.mesh(); })(); pallet.position.set(CP[0], 0, CP[2]); scene.add(pallet);
const NPAL = 18, PALP = Array.from({ length: NPAL }, (_, i) => { const lx = i % 3, lz = Math.floor(i / 3) % 2, ly = Math.floor(i / 6); return [CP[0] - 1.05 + lx * 1.05, 0.3 + 0.21 + ly * 0.43, CP[2] - 0.32 + lz * 0.64]; });
const NSTREAM = 56, STREAM = Array.from({ length: NSTREAM }, (_, i) => ({ k: i % 2, t0: T.kept + 0.1 + (i >> 1) * ((T.average - 1.3 - T.kept) / (NSTREAM / 2)) + R() * 0.08, sp: R() * 6.28, dz: (R() - 0.5) * 2.4 }));
const NCASH = NPAL + NSTREAM;
const cashI = new THREE.InstancedMesh(CASH, cashM, NCASH); cashI.castShadow = true; cashI.frustumCulled = false; scene.add(cashI);
const PALT = i => T.swapped + 0.05 + i * 0.07;                    // when each 2020 bundle leaves the pallet
// the price board (pylon screen) beside the headquarters
const SCR = [-21, 0, 1], SCR_RY = 0.62, SCRH = 9.5;
const pylon = new THREE.Group(); { const b = new GB(); b.box(1.6, SCRH, 1.4, 0x3A4048, 0, SCRH / 2, -0.9); b.box(9.4, 7.2, 0.7, 0x23272E, 0, SCRH + 2.4, 0); b.box(9.8, 0.4, 1.0, 0x8A8F96, 0, SCRH + 6.1, 0); b.box(9.8, 0.4, 1.0, 0x8A8F96, 0, SCRH - 1.3, 0); pylon.add(b.mesh()); }
pylon.position.set(SCR[0], SCR[1], SCR[2]); pylon.rotation.y = SCR_RY; scene.add(pylon);
const scrCv = document.createElement('canvas'); scrCv.width = 720; scrCv.height = 560; const scrTx = new THREE.CanvasTexture(scrCv); scrTx.colorSpace = THREE.SRGBColorSpace; scrTx.anisotropy = 4;
const screen = new THREE.Mesh(new THREE.PlaneGeometry(8.8, 6.84), new THREE.MeshBasicMaterial({ map: scrTx, toneMapped: false })); screen.position.set(0, SCRH + 2.4, 0.37); pylon.add(screen);
const SCRW = (dy = 0) => { const c = Math.cos(SCR_RY), s = Math.sin(SCR_RY); return [SCR[0] + 0.37 * s, SCR[1] + SCRH + 2.4 + dy, SCR[2] + 0.37 * c]; };
stat.push([SCR[0] - 5, SCR[0] + 5, SCR[2] - 3.5, SCR[2] + 3.5, SCRH + 6.4, 'screen']);
// picture one coin: a pedestal with one big coin, a sheet of paper that floats up, and a SELL button nobody pressed
const PED = [13, 0, 25];
const ped = pedestal(1.3, 0.95); ped.position.set(PED[0], 0, PED[2]); scene.add(ped);
stat.push([PED[0] - 1.3, PED[0] + 1.3, PED[2] - 1.3, PED[2] + 1.3, 2.9, 'pedestal']);
const bigCoinM = new THREE.MeshLambertMaterial({ color: 0xF7B500, emissive: 0xA86A00, emissiveIntensity: 0.5 });
const bigCoin = new THREE.Mesh(BIGCOIN(1.15, 0.3), bigCoinM); bigCoin.castShadow = true; scene.add(bigCoin);
const paperCv = document.createElement('canvas'); paperCv.width = 512; paperCv.height = 340; const paperTx = new THREE.CanvasTexture(paperCv); paperTx.colorSpace = THREE.SRGBColorSpace;
const paper = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 1.73), new THREE.MeshLambertMaterial({ map: paperTx, side: THREE.DoubleSide })); paper.castShadow = true; scene.add(paper);
const BTN = [15.3, 0, 23.6];
const btn = bigButton(); btn.position.set(BTN[0], 0, BTN[2]); scene.add(btn);
// ───────────────────────── the list plaza: a tall slab with the index list, the funds that copy it, a crate for sold shares
const PL = [0, 0, 144], SL = [0, 0, 131], SLW = 13, SLH = 18;
const slab = listSlab(SLW, SLH); slab.position.set(SL[0], 0, SL[2]); scene.add(slab);
stat.push([SL[0] - 8.5, SL[0] + 8.5, SL[2] - 2.5, SL[2] + 2.5, SLH + 2.4, 'slab']);
const listCv = document.createElement('canvas'); listCv.width = 640; listCv.height = 900; const listTx = new THREE.CanvasTexture(listCv); listTx.colorSpace = THREE.SRGBColorSpace; listTx.anisotropy = 4;
const listP = new THREE.Mesh(new THREE.PlaneGeometry(SLW - 1.2, SLH - 1.4), new THREE.MeshLambertMaterial({ map: listTx, emissive: 0xffffff, emissiveIntensity: 0.12, emissiveMap: listTx })); listP.position.set(SL[0], 1 + SLH / 2, SL[2] + 0.62); scene.add(listP);
{ const tw = tower(26, 38, 12, { rand: rng(88), color: 0xE4DED2, glass: 0x4E7C93, litP: 0.5 }); tw.position.set(0, 0, 114); tw.children.forEach(c => { c.castShadow = true; c.receiveShadow = true; }); scene.add(tw); stat.push([-14, 14, 107, 121, 42, 'msci tower']); }
const msciCv = document.createElement('canvas'); msciCv.width = 512; msciCv.height = 160; const msciTx = new THREE.CanvasTexture(msciCv); msciTx.colorSpace = THREE.SRGBColorSpace;
const msciSign = new THREE.Mesh(new THREE.PlaneGeometry(9, 2.8), new THREE.MeshBasicMaterial({ map: msciTx, toneMapped: false })); msciSign.position.set(0, 24.5, 120.15); scene.add(msciSign);
const NF = 8, FUNDS = Array.from({ length: NF }, (_, k) => { const m = person({ robe: 0x2F4F86, skin: SKIN[k % 5], short: [0x231C18, 0x5A3E28, 0xC9A27A, 0x3A2A1E, 0x8A8A8A][k % 5], shirt: 0xF4F2EC, tie: 0xF7B500, paper: true, s: 0.98 }); const x = -10.5 + k * 3; m.position.set(x, 0, 142 + (k % 2) * 1.2); m.rotation.y = -Math.PI / 2 + (x < 0 ? -0.18 : 0.18); scene.add(m); return { m, x, z: 142 + (k % 2) * 1.2 }; });
const CR = [17.5, 0, 148];
const crate = (() => { const b = new GB(); b.box(3.2, 1.6, 2.4, 0x9A7A52, 0, 0.8, 0); for (const y of [0.3, 0.8, 1.3]) b.box(3.3, 0.16, 2.5, 0x7A5A3A, 0, y, 0); return b.mesh(); })(); crate.position.set(CR[0], 0, CR[2]); scene.add(crate);
stat.push([CR[0] - 2, CR[0] + 2, CR[2] - 1.6, CR[2] + 1.6, 2.2, 'crate']);
const NCERT = NF * 3, CERTS = Array.from({ length: NCERT }, (_, i) => ({ f: i % NF, t0: 0, sp: R() * 6.28, dx: (R() - 0.5) * 1.2, dz: (R() - 0.5) * 1.0 }));
const certI = new THREE.InstancedMesh(CERT, MAT, NCERT); certI.castShadow = true; certI.frustumCulled = false; scene.add(certI);
// the week the news came: 485 more coins drop through the hatch
const NDROP = 26, DROP = Array.from({ length: NDROP }, (_, i) => ({ t0: 0, x: (R() - 0.5) * 2.6, z: (R() - 0.5) * 2.6, sp: R() * 6.28 }));
const dropI = new THREE.InstancedMesh(coinGeo, coinM, NDROP); dropI.castShadow = true; dropI.frustumCulled = false; scene.add(dropI);

// ───────────────────────── the city: towers all around (the two plazas and the road between them stay clear)
{
  const tr = rng(2026), PALS = [[0xD9D3C6, 0x5E7F9A], [0x6D97AA, 0x3F6A80], [0xE4DED2, 0x4E7C93], [0xC9C2B4, 0x55748C], [0x8FB3C2, 0x426E86], [0xEFE9DC, 0x6A8AA4], [0xB7C4C9, 0x3E6378], [0xE8D9C0, 0x5A7A90]];
  const clear = (x, z) => (Math.abs(x) < 42 && z > -38 && z < 34) || (Math.abs(x) < 40 && z > 100 && z < 210) || (Math.abs(x) < 32 && z > 30 && z < 104) || Math.abs(z - 40) < 8 || Math.abs(z + 40) < 8 || Math.abs(x + 48) < 8 || Math.abs(x - 48) < 8;
  for (let gx = -210; gx <= 210; gx += 22) for (let gz = -200; gz <= 240; gz += 22) {
    const x = gx + (tr() - .5) * 7, z = gz + (tr() - .5) * 7; if (clear(x, z) || tr() < 0.12) continue;
    const w = 9 + tr() * 7, d = 9 + tr() * 7, dp = Math.hypot(x, z - 40), far = dp > 140;
    const h = (dp < 90 ? 16 + tr() * 22 : 24 + tr() * (far ? 50 : 36));
    const pal = PALS[Math.floor(tr() * PALS.length)];
    const g = tower(w, h, d, { rand: tr, color: pal[0], glass: pal[1], floor: far ? 4.2 : 3.4, litP: 0.5, crown: h > 50 && tr() < 0.5 });
    g.position.set(x, 0, z); g.rotation.y = (tr() < 0.5 ? 0 : Math.PI / 2); g.children.forEach(c => { c.castShadow = dp < 150; c.receiveShadow = true; }); scene.add(g);
    stat.push([x - Math.max(w, d) / 2, x + Math.max(w, d) / 2, z - Math.max(w, d) / 2, z + Math.max(w, d) / 2, h + 4, 'tower']);
  }
}
const lampHeads = new GB();
for (let x = -36; x <= 36; x += 12) for (const z of [35.2, -35.2]) { const l = lamp(6.2); l.position.set(x, 0, z); l.rotation.y = z > 0 ? -Math.PI / 2 : Math.PI / 2; scene.add(l); lampHeads.box(0.5, 0.08, 0.3, 0xFFFFFF, x, 5.98, z + (z > 0 ? 1.25 : -1.25)); }
for (const [x, z] of [[-30, 120], [30, 120], [-30, 166], [30, 166], [-30, 143], [30, 143]]) { const l = lamp(6.2); l.position.set(x, 0, z); l.rotation.y = x > 0 ? Math.PI : 0; scene.add(l); lampHeads.box(0.3, 0.08, 0.5, 0xFFFFFF, x + (x > 0 ? -1.25 : 1.25), 5.98, z); }
const lampM = new THREE.MeshLambertMaterial({ color: 0xFFF1C8, emissive: 0xFFD27A, emissiveIntensity: 0 }); scene.add(new THREE.Mesh(lampHeads.geo(), lampM));
const CARS = [[0xC8423A, 38, 1, 7.5, 0], [0x2F6FB8, 42, -1, 9.0, 40], [0xE9C46A, -42, 1, 6.2, 150], [0x4C9A62, -38, -1, 8.0, 230], [0xEDEDED, 38, 1, 8.6, 300], [0x7A4FA0, -42, -1, 7.0, 90]].map(([col, z, dir, v, off]) => { const m = car(col); scene.add(m); return { m, z, dir, v, off }; });
for (const [x, z] of [[-34, 22], [34, 22], [-34, -6], [34, -6], [-30, 168], [30, 168], [-26, 124], [26, 124], [-38, 31], [38, 31], [-38, 8], [38, 8]]) { const m = bushTree(5.5 + R() * 2, R); m.position.set(x, 0, z); scene.add(m); }
// a few passers-by on the vault plaza
const walkers = [[-12, 30, 0.6], [6, 31, -1.1], [-26, 24, 0.3], [27, 27, -0.6], [-15, 33, 2.2]].map(([x, z, ry], k) => { const m = person({ robe: [0x34405A, 0x6A2E3E, 0x3F6A5A, 0x5A5A66, 0x7A5A3A][k], skin: SKIN[(k + 2) % 5], short: [0x231C18, 0x5A3E28, 0xC9A27A, 0x3A2A1E, 0x8A8A8A][k], shirt: k % 2 ? 0xF4F2EC : undefined, s: 0.98 }); m.position.set(x, 0, z); m.rotation.y = ry; scene.add(m); return { m, x, z, ry }; });

// ───────────────────────── sky clutter: clouds, birds, sparkles
const clouds = []; for (let i = 0; i < 18; i++) { const m = cloud(R); const far = i >= 10; m.position.set(far ? -500 + R() * 1000 : -220 + i * 52 + R() * 20, 70 + R() * 40, far ? -520 + R() * 200 : -320 + R() * 300); m.scale.setScalar(2.0 + R() * 2.2); m.userData.x0 = m.position.x; scene.add(m); clouds.push(m); }
for (const [x, y, z, k] of [[20, 74, 160, 2.4], [-30, 80, 210, 2.8]]) { const m = cloud(R); m.position.set(x, y, z); m.scale.setScalar(k); m.userData.x0 = x; scene.add(m); clouds.push(m); }
const birdMat = new THREE.MeshBasicMaterial({ color: 0x2A2430, side: THREE.DoubleSide });
const wingG = new THREE.BufferGeometry(); wingG.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0.1, 1.6, 0, -0.3, 1.5, 0, 0.5], 3));
const FLOCK = [{ t0: T.b4, t1: T.b6, a: [-60, 26, 40], b: [50, 34, -10] }, { t0: T.wipe1 + 1.0, t1: T.b13 + 2, a: [-50, 30, 170], b: [50, 36, 130] }, { t0: T.wipe2 + 1.2, t1: T.b15, a: [40, 28, 40], b: [-50, 34, -10] }];
const birds = []; for (let i = 0; i < 9; i++) { const g = new THREE.Group(), l = new THREE.Mesh(wingG, birdMat), r = new THREE.Mesh(wingG, birdMat); r.scale.x = -1; g.add(l, r); g.userData = { l, r, ph: R() * 6 }; g.visible = false; g.scale.setScalar(1.1); scene.add(g); birds.push(g); }
function updateBirds(t) {
  const f = FLOCK.find(f => t >= f.t0 && t <= f.t1); for (const b of birds) b.visible = !!f; if (!f) return;
  const u = seg(t, f.t0, f.t1), dx = f.b[0] - f.a[0], dz = f.b[2] - f.a[2], L = Math.hypot(dx, dz), ux = dx / L, uz = dz / L;
  birds.forEach((b, i) => { const row = Math.ceil(i / 2), sd = i % 2 ? 1 : -1; b.position.set(lerp(f.a[0], f.b[0], u) - ux * row * 2.4 + uz * sd * row * 1.7, lerp(f.a[1], f.b[1], u) + Math.sin(t * 2 + b.userData.ph) * 0.5, lerp(f.a[2], f.b[2], u) - uz * row * 2.4 - ux * sd * row * 1.7); b.rotation.y = Math.atan2(ux, uz); const fl = Math.sin(t * 10 + b.userData.ph) * 0.65; b.userData.l.rotation.z = fl; b.userData.r.rotation.z = -fl; });
}
const sparkT = (() => { const cv = document.createElement('canvas'); cv.width = cv.height = 64; const g = cv.getContext('2d'); g.translate(32, 32); g.fillStyle = '#fff'; for (let k = 0; k < 2; k++) { g.rotate(Math.PI / 2 * k); g.beginPath(); g.moveTo(0, -30); g.quadraticCurveTo(3, -3, 30, 0); g.quadraticCurveTo(3, 3, 0, 30); g.quadraticCurveTo(-3, 3, -30, 0); g.quadraticCurveTo(-3, -3, 0, -30); g.fill(); } const tx = new THREE.CanvasTexture(cv); tx.colorSpace = THREE.SRGBColorSpace; return tx; })();
const sparks = []; for (let i = 0; i < 44; i++) { const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: sparkT, color: 0xFFE9A8, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false })); sp.userData = { ph: R() * 6.28, w: 3 + R() * 4 }; scene.add(sp); sparks.push(sp); }
const glowM = new THREE.MeshBasicMaterial({ map: radial('rgba(255,200,90,0.55)', 'rgba(255,200,90,0)'), transparent: true, depthWrite: false, toneMapped: false, blending: THREE.AdditiveBlending });
const pileGlow = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), glowM); scene.add(pileGlow);

// ───────────────────────── canvases
const F = (w, px, fam) => `${w} ${px}px ${fam}`;
let hqKey = '';
function drawHQ(t) {
  const old = t > T.y2020 + 0.3 && t < T.kept + 1.5, key = old ? 'old' : 'new'; if (key === hqKey) return; hqKey = key;
  const g = hqCv.getContext('2d'); g.clearRect(0, 0, 1024, 192); g.fillStyle = 'rgba(24,30,44,0.92)'; g.fillRect(0, 26, 1024, 140);
  g.fillStyle = '#FFF6E6'; g.font = F(900, old ? 92 : 112, 'Figtree'); g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(old ? 'MICROSTRATEGY' : 'STRATEGY', 512, 100); hqTx.needsUpdate = true;
}
function drawStatic() {
  { const g = msciCv.getContext('2d'); g.fillStyle = 'rgba(24,30,44,0.92)'; g.fillRect(0, 0, 512, 160); g.fillStyle = '#FFF6E6'; g.font = F(900, 104, 'Figtree'); g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('MSCI', 256, 86); msciTx.needsUpdate = true; }
  { const g = paperCv.getContext('2d'); g.fillStyle = '#FBF6E8'; g.fillRect(0, 0, 512, 340); g.strokeStyle = '#C9BFA6'; g.lineWidth = 6; g.strokeRect(14, 14, 484, 312);
    g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#8A6A3A'; g.font = F(700, 34, 'Inter'); g.fillText('ONE COIN · ON PAPER', 256, 70);
    g.fillStyle = '#C8423A'; g.font = F(800, 112, 'JBM'); g.fillText('−$16,000', 256, 180); g.fillStyle = '#6A5030'; g.font = F(700, 30, 'Inter'); g.fillText('not sold · not cash', 256, 270); paperTx.needsUpdate = true; }
}
// the list on the slab: grey bars stand for the other names; Strategy's line is struck out on Nov 30
let listKey = '';
function drawList(t) {
  const strike = seg(t, T.out - 0.1, T.out + 0.5), key = 'l' + Math.round(strike * 20); if (key === listKey) return; listKey = key;
  const g = listCv.getContext('2d'), w = 640, h = 900; g.fillStyle = '#F7F1E3'; g.fillRect(0, 0, w, h);
  g.fillStyle = '#2E3A52'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = F(900, 58, 'Fraunces'); g.fillText('THE INDEX LIST', 320, 72);
  g.fillStyle = '#8A6A3A'; g.font = F(700, 24, 'Inter'); g.fillText('NOVEMBER 2026 REVIEW', 320, 122);
  const rr = rng(77); g.textAlign = 'left';
  for (let i = 0; i < 13; i++) {
    const y = 180 + i * 54;
    if (i === 6) { g.fillStyle = 'rgba(247,166,0,0.28)'; g.fillRect(40, y - 26, 560, 52); g.fillStyle = '#1C1300'; g.font = F(800, 40, 'JBM'); g.fillText('STRATEGY', 70, y + 2);
      if (strike > 0) { g.strokeStyle = '#D8342A'; g.lineWidth = 10; g.lineCap = 'round'; g.beginPath(); g.moveTo(56, y + 2); g.lineTo(56 + 500 * strike, y + 2); g.stroke(); }
      if (strike > 0.9) { g.save(); g.translate(500, y); g.rotate(-0.12); g.strokeStyle = '#D8342A'; g.lineWidth = 6; g.strokeRect(-70, -26, 140, 52); g.fillStyle = '#D8342A'; g.font = F(900, 36, 'Figtree'); g.textAlign = 'center'; g.fillText('OUT', 0, 3); g.restore(); g.textAlign = 'left'; }
      continue; }
    g.fillStyle = '#C9C1AE'; g.fillRect(70, y - 10, 160 + rr() * 260, 20); g.fillStyle = '#DDD5C2'; g.fillRect(500, y - 10, 70, 20);
  }
  listTx.needsUpdate = true;
}
// the price board: one canvas, redrawn only when what it shows changes
// real CoinGecko prices, 22 Oct → 21 Nov 2026 (every 6 hours; read 21 Nov 2026 01:45 UTC), thinned to every second point
const BTC = [83385, 81674, 81258, 81894, 80858, 80142, 80844, 80560, 79490, 80268, 79709, 80267, 80843, 80506, 79885, 81692, 78062, 77487, 77085, 77538, 77751, 77924, 78557, 77417, 76829, 77672, 77324, 80491, 80477, 76339, 75708, 75914, 75838, 75696, 75777, 75683, 74415, 74728, 74740, 73210, 73860, 74451, 73520, 71849, 68062, 68931, 67327, 65518, 64438, 64689, 64693, 64998, 64500, 64727, 64030, 62783, 63978, 61494, 61818, 58860];
let scrKey = '';
const fmt = n => '$' + Math.round(n).toLocaleString('en-US');
function scrMode(t) {
  if (t < T.y2020 + 0.4) return ['now', 0];
  if (t < T.kept) return ['2020', seg(t, T.swapped, T.bitcoin4 + 0.4)];
  if (t < T.b6) return ['weeks', seg(t, T.kept, T.b6)];
  if (t < T.b7) return ['avg', seg(t, T.average, T.p75 + 0.4)];
  if (t < T.b8) return ['chart', seg(t, T.fell - 0.3, T.p60 + 0.6)];
  if (t < T.cta) return ['picture', seg(t, T.now8, T.p59 + 0.4)];
  return ['cta', 0];
}
function drawScreen(t) {
  const [mode, a] = scrMode(t), key = mode + Math.round(a * 40); if (key === scrKey) return; scrKey = key;
  const g = scrCv.getContext('2d'), w = 720, h = 560;
  g.fillStyle = '#0B1020'; g.fillRect(0, 0, w, h);
  g.strokeStyle = 'rgba(255,255,255,0.07)'; g.lineWidth = 2; for (let i = 1; i < 6; i++) { g.beginPath(); g.moveTo(0, i * h / 6); g.lineTo(w, i * h / 6); g.stroke(); }
  g.textAlign = 'center'; g.textBaseline = 'middle';
  const head = s => { g.fillStyle = '#FFD27A'; g.font = F(800, 38, 'Inter'); g.fillText(s, 360, 54); };
  const big = (s, col = '#FFFFFF', px = 120, y = 230) => { g.fillStyle = col; g.font = F(800, px, 'JBM'); g.fillText(s, 360, y); };
  const small = (s, col = 'rgba(255,255,255,0.75)', y = 340) => { g.fillStyle = col; g.font = F(700, 34, 'Inter'); g.fillText(s, 360, y); };
  if (mode === 'now') { head('BITCOIN · 21 NOV 2026'); big('≈ $58,800', '#FFFFFF', 104); small('ONE COIN · COINGECKO'); }
  else if (mode === '2020') { head('AUGUST 2020'); big('$250M', '#7FD08A', 120); small(a > 0.4 ? '→ 21,454 BITCOIN' : 'OF CASH', a > 0.4 ? '#FFD27A' : 'rgba(255,255,255,0.75)'); }
  else if (mode === 'weeks') { head('WEEK AFTER WEEK'); g.font = F(900, 150, 'Figtree'); g.fillStyle = '#7FD08A'; g.fillText('+', 360, 220); small('NEW SHARES · LOANS → BITCOIN'); }
  else if (mode === 'avg') { head('AVERAGE PAID · PER COIN'); if (a > 0.05) big('$75,452', '#FFC84A', 112); small('AS OF 15 NOV 2026 · STRATEGY'); }
  else if (mode === 'chart') {
    head('BITCOIN · 22 OCT → 21 NOV 2026');
    const X0 = 50, X1 = 680, Y = p => 140 + (85000 - p) / (85000 - 55000) * 360, n = BTC.length - 1, k = Math.min(n, Math.max(1, Math.round(a * n)));
    for (const [p, lab, col, right] of [[75452, 'AVG PAID $75,452', '#FFD27A', true], [60000, '$60,000', '#FF8A6B', false]]) { g.setLineDash([14, 12]); g.strokeStyle = col; g.lineWidth = 4; g.beginPath(); g.moveTo(X0, Y(p)); g.lineTo(X1, Y(p)); g.stroke(); g.setLineDash([]); g.fillStyle = col; g.font = F(800, 26, 'Inter'); g.textAlign = right ? 'right' : 'left'; g.fillText(lab, right ? X1 - 6 : X0 + 6, Y(p) - 20); g.textAlign = 'center'; }
    g.strokeStyle = a > 0.75 ? '#FF6B5B' : '#F7B500'; g.lineWidth = 9; g.lineJoin = 'round'; g.lineCap = 'round'; g.beginPath();
    for (let i = 0; i <= k; i++) { const x = X0 + (X1 - X0) * i / n, y = Y(BTC[i]); if (i) g.lineTo(x, y); else g.moveTo(x, y); } g.stroke();
    if (a > 0.97) { g.fillStyle = '#FF8A6B'; g.font = F(800, 40, 'JBM'); g.textAlign = 'right'; g.fillText('≈ $58,860', X1, Y(58860) + 36); g.textAlign = 'center'; }
  }
  else if (mode === 'picture') { head('PICTURE · ONE COIN'); big(a > 0.5 ? '$59,000' : '$75,000', a > 0.5 ? '#FF8A6B' : '#FFC84A', 112); small(a > 0.5 ? 'BOUGHT AT $75,000' : 'BOUGHT FOR', 'rgba(255,255,255,0.75)'); }
  else { g.font = F(900, 150, 'Figtree'); g.fillStyle = '#F7B500'; g.fillText('SELL', 360, 150); g.fillStyle = '#6FD0C0'; g.fillText('HOLD', 360, 420); g.fillStyle = '#FFFFFF'; g.font = F(800, 60, 'Inter'); g.fillText('or', 360, 285); }
  scrTx.needsUpdate = true;
}

// ───────────────────────── camera path (spherical keys around a target; `up` tilts the view so the subject sits lower in the frame)
const VC = (dy = 4.4) => [V[0], dy, V[2]];
const CAM = [
  { t: 0, tg: [0, 6, 6], d: 120, az: 26, el: 36, up: 0.06 },                                          // night: high over the city, the vault glowing below
  { t: T.mountain + 0.3, tg: VC(4.6), d: 56, az: 22, el: 20, up: 0.05, mv: 1 },                        // down to the mountain of gold
  { t: T.b2 - 0.2, tg: VC(4.4), d: 42, az: 18, el: 15, up: 0.05, mv: 1 },
  { t: T.strategy2 + 0.5, tg: [0, 14, -8], d: 58, az: 12, el: 4, up: 0.0, mv: 1 },                      // the name on the headquarters
  { t: T.b3 + 0.4, tg: [0, 14, -8], d: 56, az: 14, el: 5, up: 0.0 },
  { t: T.saylor + 0.2, tg: [SY[0] + 1.0, 1.2, SY[2] + 0.6], d: 13.5, az: 34, el: 7, up: 0.03, mv: 1 },     // 2020: the boss and his cash
  { t: T.cash3 + 0.3, tg: [SY[0] + 1.6, 1.3, SY[2] + 0.8], d: 13, az: 28, el: 7, up: 0.03 },
  { t: T.swapped + 0.5, tg: [-1.2, 5.2, 17], d: 33, az: 34, el: 14, up: 0.03, mv: 1 },                  // the cash flies into the vault
  { t: T.b5 + 0.1, tg: [-0.6, 5.0, 14], d: 37, az: 28, el: 15, up: 0.03 },
  { t: T.shares5 - 0.3, tg: [-10.5, 4.4, 12.5], d: 38, az: -18, el: 14, up: 0.03, mv: 1 },             // new shares (left kiosk)…
  { t: T.b6 + 0.1, tg: [10.5, 4.4, 12.5], d: 38, az: 18, el: 14, up: 0.03, mv: 1 },                      // …and loans (right kiosk)
  { t: T.average + 0.5, tg: VC(4.6), d: 31, az: -26, el: 15, up: 0.04, mv: 1 },                         // the full pile; what it paid per coin
  { t: T.b7 + 0.1, tg: VC(4.6), d: 31, az: -30, el: 14, up: 0.04 },
  { t: T.fell + 0.6, tg: SCRW(-0.2), d: 29, az: 36, el: 4, up: 0.0, mv: 1 },                             // the price board: the fall
  { t: T.b8 - 0.1, tg: SCRW(-0.2), d: 27.5, az: 34, el: 4, up: 0.0 },
  { t: T.picture + 0.6, tg: [PED[0], 2.4, PED[2]], d: 14, az: 34, el: 8, up: -0.01, mv: 1 },             // one coin on its pedestal
  { t: T.b9 + 0.2, tg: [PED[0] - 0.2, 2.6, PED[2] + 0.1], d: 15, az: 32, el: 9, up: -0.01 },
  { t: T.paper + 0.3, tg: [PED[0] - 0.3, 2.9, PED[2] + 0.2], d: 16.5, az: 30, el: 10, up: 0.0, mv: 1 },
  { t: T.b10 + 0.2, tg: [PED[0] - 0.3, 2.9, PED[2] + 0.2], d: 17.5, az: 30, el: 10, up: 0.0 },
  { t: T.p64 + 0.3, tg: VC(5), d: 50, az: 30, el: 19, up: 0.04, mv: 1 },                               // the whole vault
  { t: T.wipe1 - 0.3, tg: VC(5), d: 52, az: 32, el: 20, up: 0.12 },
  { t: T.wipe1 + 0.4, tg: VC(5), d: 52, az: 32, el: 20, up: 1.4, mv: 1 },                               // sky wipe: tilt up into the sky…
  { t: T.wipe1 + 0.7, tg: [0, 50, 40], d: 60, az: 12, el: 40, up: 1.4 },                                  // …travel high through the clouds…
  { t: T.wipe1 + 1.0, tg: [0, 50, 124], d: 60, az: 0, el: 40, up: 1.4 },
  { t: T.msci + 0.3, tg: [0, 10, 136], d: 54, az: 0, el: 8, up: 0.12, mv: 1 },                           // …and come down at the list
  { t: T.funds12 + 0.2, tg: [0, 5.5, 140], d: 40, az: 6, el: 8, up: 0.12, mv: 1 },
  { t: T.b13 - 0.2, tg: [0, 6, 139], d: 38, az: 9, el: 8, up: 0.1 },
  { t: T.out + 0.3, tg: [0, 8.8, 133], d: 26, az: 8, el: 3, up: -0.04, mv: 1 },                           // Strategy's line is struck out
  { t: T.funds13 + 0.2, tg: [7, 3.6, 144], d: 36, az: 30, el: 12, up: 0.05, mv: 1 },                     // the funds hand its shares to the crate
  { t: T.wipe2 - 0.3, tg: [7, 3.6, 144], d: 37, az: 33, el: 13, up: 0.12 },
  { t: T.wipe2 + 0.4, tg: [7, 3.6, 144], d: 37, az: 33, el: 13, up: 1.3, mv: 1 },                        // sky wipe back to the vault
  { t: T.wipe2 + 0.65, tg: [0, 50, 104], d: 60, az: 20, el: 40, up: 1.3 },
  { t: T.wipe2 + 0.9, tg: [0, 50, 24], d: 60, az: -10, el: 40, up: 1.3 },
  { t: T.still, tg: VC(6.6), d: 31, az: -20, el: 18, up: 0.04, mv: 1 },                                  // coins still drop in
  { t: T.b15, tg: VC(6.4), d: 33, az: -26, el: 18, up: 0.04 },
  { t: T.over + 0.7, tg: [0, 8, 4], d: 112, az: -26, el: 30, up: 0.08, mv: 3 },                           // crane up: night falls over the city
  { t: T.cta + 0.1, tg: [0, 8, 4], d: 118, az: -32, el: 30, up: 0.16 },
  { t: T.comment, tg: SCRW(-1.0), d: 32, az: 38, el: 6, up: 0.03, mv: 1 },                               // the board: SELL or HOLD
  { t: DUR + 0.5, tg: SCRW(-1.0), d: 29, az: 35, el: 6, up: 0.03 },
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
const hookBoard = mk('board', '<div class="t">One company’s bitcoin · Nov 2026</div><div class="row"><b>850,849</b></div><div class="d">worth less than it paid</div><div class="src">holdings as of 15 Nov 2026 · Strategy’s SEC filing</div>');
const nameCo = mk('name', '<div class="n">Strategy</div><div class="r">once MicroStrategy · Virginia, USA</div>');
const y2020El = mk('year', '2020'), y2020Sub = mk('sub', 'August');
const nameBoss = mk('name', '<div class="n">Michael Saylor</div><div class="r">CEO in 2020 · executive chairman now</div>');
const quote = mk('quote', '<div class="q">“…a legitimate investment asset<br>that can be <em>superior to cash</em>…”</div><div class="s">Michael Saylor · MicroStrategy press release · 11 Aug 2020</div>');
const tag250 = mk('tag am', '<b>$250M</b> → 21,454 BTC');
const tagShares = mk('tag', 'selling new shares'), tagLoans = mk('tag', 'borrowing');
const countBoard = mk('board', '<div class="t">Bitcoin in the vault</div><div class="row"><b class="cnt">21,454</b></div><div class="d">Aug 2020 → 15 Nov 2026</div>'), cntEl = countBoard.querySelector('.cnt');
const tagAvg = mk('tag am', 'avg paid <b>$75,452</b> a coin');
const worth = mk('worth', '<div class="t">Picture · one coin</div><div class="row"><span class="v1">$75,000</span><span class="arr">→</span><span class="v2">$75,000</span></div><div class="bar"><div class="fill"></div><div class="gone"></div></div><div class="d">−$16,000 · on paper</div>'), wFill = worth.querySelector('.fill'), wGone = worth.querySelector('.gone'), wD = worth.querySelector('.d'), wV2 = worth.querySelector('.v2');
const tagBtn = mk('tag grey', 'SELL · not pressed');
const vaultBoard = mk('board', '<div class="t">The whole vault · 21 Nov 2026</div><div class="row">paid <b>$64.2B</b></div><div class="row w2">worth <b>≈$50B</b></div><div class="src">850,849 BTC × ≈$58,800 (CoinGecko) · cost: Strategy 8-K</div>'), vbRow2 = vaultBoard.querySelector('.w2');
const tagFunds = mk('tag', 'index funds copy the list');
const tagRule = mk('tag am', 'new rule · “non-operating companies”');
const tagSell13 = mk('tag', '≈ 13 million shares to sell · estimates');
const tag485 = mk('tag am', '<b>+485</b> BTC · 9–15 Nov');
const title = mk('title', '<div class="s">THE STORY OF</div><div class="n">The Bitcoin\n<em>Vault</em></div>');
const lesson = mk('lesson', 'The biggest pile\n<em>still moves with the price.</em>');
const ctaChip = mk('chip am', 'you decide');
const boxes = [0, 1].map(() => { const e = mk('cbox', '<span class="in"></span><span class="post">Post</span>'); return { e, inn: e.querySelector('.in'), post: e.querySelector('.post') }; });
const foot = document.getElementById('foot');
foot.textContent = 'Sources: Strategy SEC filings (Aug 2020, Nov 2026), MSCI (11 Nov 2026), The Block, CoinDesk\nBitcoin Magazine, Cointelegraph · prices: CoinGecko · story as of 21 Nov 2026 · not advice';
const setTxt = (e, s) => { if (e.textContent !== s) e.textContent = s; };
const setHTML = (e, s) => { if (e._h !== s) { e._h = s; e.innerHTML = s; } };

function updateUI(t) {
  updateCaption(t);
  foot.style.opacity = (0.95 * seg(t, 0.8, 1.4) * (1 - seg(t, T.cta, T.cta + 0.3) * 0.45)).toFixed(3);
  // 1 — November 2026; the pile; 850,849
  { const o = win(t, -1, T.mountain - 0.1, 0.5, 0.3); put(yearEl, W / 2, 640, o); put(subEl, W / 2, 780, o * seg(t, 0.4, 0.9)); }
  put(hookBoard, W / 2, 1080, win(t, T.worth1 - 0.2, T.b2 - 0.1, 0.3, 0.25), pop(t, T.worth1 - 0.2));
  // 2 — Strategy
  put(nameCo, W / 2, 1150, win(t, T.strategy2, T.b3 - 0.05, 0.25, 0.25), pop(t, T.strategy2));
  // 3 — 2020, the boss, superior to cash
  { const o = win(t, T.y2020, T.saylor - 0.1, 0.3, 0.3); put(y2020El, W / 2, 1020, o, pop(t, T.y2020)); put(y2020Sub, W / 2, 1160, o); }
  put(nameBoss, W / 2, 700, win(t, T.saylor, T.superior - 0.25, 0.25, 0.25), pop(t, T.saylor));
  put(quote, W / 2, 1330, win(t, T.superior - 0.25, T.b4 + 0.3, 0.25, 0.25), pop(t, T.superior - 0.25));
  // 4–5 — $250M, then week after week
  put(tag250, W / 2, 1180, win(t, T.p250, T.b5 - 0.1, 0.2, 0.25), pop(t, T.p250));
  { const p = proj(KL[0], 7.2, KL[2] + 1); put(tagShares, clampX(p[0], 190), clampY(p[1] - 10), p[2] ? win(t, T.shares5 - 0.1, T.b6 + 0.4, 0.2, 0.25) : 0, pop(t, T.shares5 - 0.1)); }
  { const p = proj(KR[0], 7.2, KR[2] + 1); put(tagLoans, clampX(p[0], 160), clampY(p[1] - 10), p[2] ? win(t, T.loans - 0.1, T.b6 + 0.4, 0.2, 0.25) : 0, pop(t, T.loans - 0.1)); }
  { const f = fillAt(t), n = f >= 0.9995 ? 850849 : Math.round(lerp(21454, 850849, c01((f - 0.025) / 0.975))); setTxt(cntEl, n.toLocaleString('en-US')); put(countBoard, W / 2, 1330, win(t, T.kept + 0.1, T.b7 - 0.1, 0.25, 0.25), pop(t, T.kept + 0.1)); }
  { const p = proj(V[0] - 3.2, pileTop(t) + 1.4, V[2] + 2); put(tagAvg, clampX(p[0], 260), clampY(p[1] - 20, 620, 900), p[2] ? win(t, T.p75 - 0.1, T.b7 - 0.1, 0.2, 0.25) : 0, pop(t, T.p75 - 0.1)); }
  // chips
  let ct = '', co = 0, cp = 0;
  const CH = [[T.nov, T.b2 - 0.2, 'November 2026'], [T.b2 + 0.05, T.b3 - 0.15, 'the headquarters · Virginia'], [T.boss, T.b4 - 0.15, 'August 2020'], [T.b4 + 0.05, T.b5 - 0.15, 'August 2020 · the first buy'],
    [T.b5 + 0.05, T.b6 - 0.15, '2020 → 2026 · week after week'], [T.b6 + 0.05, T.b7 - 0.15, 'as of 15 Nov 2026'], [T.b7 + 0.05, T.b8 - 0.15, 'bitcoin · Oct → Nov 2026'], [T.b8 + 0.05, T.b10 - 0.15, 'picture · one coin'],
    [T.b10 + 0.05, T.wipe1 + 0.2, 'as of 21 Nov 2026'], [T.wipe1 + 0.9, T.b13 - 0.15, '11 Nov 2026 · MSCI’s final list'], [T.b13 + 0.05, T.wipe2 + 0.2, '30 Nov 2026 · the exit date'],
    [T.wipe2 + 0.9, T.b15 - 0.15, 'the same week · 9–15 Nov 2026'], [T.b15 + 0.05, T.b16 - 0.1, 'as of 21 Nov 2026']];
  for (const [a, b, s] of CH) { const o = win(t, a, b, 0.22, 0.22); if (o > co) { co = o; ct = s; cp = pop(t, a); } }
  if (ct) setTxt(chip, ct); put(chip, W / 2, 472, co, cp);
  // 8–9 — picture one coin; on paper; not sold
  { const u = eo(seg(t, T.now8, T.p59 + 0.4)), f = lerp(1, 59 / 75, u); wFill.style.width = (560 * f).toFixed(0) + 'px'; wGone.style.width = (560 * (1 - f)).toFixed(0) + 'px'; setTxt(wV2, u > 0.5 ? '$59,000' : '$75,000'); wD.style.opacity = seg(t, T.p16 - 0.1, T.p16 + 0.2).toFixed(3); put(worth, W / 2, 1340, win(t, T.bought8 - 0.1, T.b10 - 0.1, 0.25, 0.25), pop(t, T.bought8 - 0.1)); }
  { const p = proj(BTN[0], 2.6, BTN[2]); put(tagBtn, clampX(p[0], 220), clampY(p[1] - 30, 600, 1150), p[2] ? win(t, T.unless, T.b10 + 0.2, 0.2, 0.25) : 0, pop(t, T.unless)); }
  // 10 — the whole vault
  vbRow2.style.opacity = seg(t, T.worth10 - 0.1, T.worth10 + 0.2).toFixed(3);
  put(vaultBoard, W / 2, 1090, win(t, T.p64 - 0.1, T.wipe1 + 0.2, 0.25, 0.25), pop(t, T.p64 - 0.1));
  // 12–13 — the list, the rule, the funds
  { const p = proj(0, 4.2, 143); put(tagFunds, clampX(p[0], 260), clampY(p[1] - 10), p[2] ? win(t, T.funds12 - 0.1, T.b13 - 0.1, 0.2, 0.25) : 0, pop(t, T.funds12 - 0.1)); }
  put(tagRule, W / 2, 1230, win(t, T.assets - 0.1, T.b13 - 0.1, 0.2, 0.25), pop(t, T.assets - 0.1));
  put(tagSell13, W / 2, 1230, win(t, T.sell13 - 0.1, T.wipe2 + 0.1, 0.2, 0.25), pop(t, T.sell13 - 0.1));
  // 14 — 485 more coins
  { const p = proj(V[0], FY + VH + 3, V[2]); put(tag485, clampX(p[0], 220), clampY(p[1] - 30, 620, 1000), p[2] ? win(t, T.p485 - 0.1, T.b15 + 0.2, 0.2, 0.25) : 0, pop(t, T.p485 - 0.1)); }
  // 16 — title and lesson; 17 — you decide
  put(title, W / 2, 640, win(t, T.story, T.cta - 0.1, 0.4, 0.3), 0.94 + 0.06 * eo(seg(t, T.story, T.story + 0.6)));
  put(lesson, W / 2, 1180, win(t, T.biggest - 0.1, T.cta - 0.15, 0.3, 0.25), pop(t, T.biggest - 0.1));
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
// the 2020 pallet bundles, the kiosk streams, the certificates and the 485 drop: their timing (CUES export these)
const STREAMLAND = STREAM.map(s => s.t0 + 1.25);
CERTS.forEach((c, i) => { c.t0 = T.funds13 + 0.1 + (i % NF) * 0.09 + Math.floor(i / NF) * 0.28 + R() * 0.05; });
DROP.forEach((d, i) => { d.t0 = T.p485 - 0.35 + i * 0.055 + R() * 0.04; });
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
  // the pile: grows with the fill; its glow dims while the price falls (the same coins, worth less), and warms again at night
  const f = fillAt(t), sc = pileScale(f), ph = PH * Math.sqrt(f), val = lerp(1, 0.55, seg(t, T.fell, T.p60 + 0.6)) * (t > T.wipe2 ? lerp(1, 1.25, seg(t, T.b15, T.over + 1)) : 1);
  mound.visible = f > 0.002; mound.scale.set(PA * sc, Math.max(0.01, ph), PB * sc);
  pileM.emissiveIntensity = (0.22 + 0.35 * night) * val; coinM.emissiveIntensity = (0.35 + 0.4 * night) * val;
  pileM.color.setRGB(lerp(0.62, 0.91, val > 1 ? 1 : val), lerp(0.48, 0.66, val > 1 ? 1 : val), lerp(0.3, 0.08, val > 1 ? 1 : val));
  for (let i = 0; i < NPC; i++) {
    const p = PC[i]; if (f < p.b || f < 0.004) { pileCoins.setMatrixAt(i, HIDE); continue; }
    const rho2 = p.u * p.u + p.v * p.v, y = FY + ph * Math.sqrt(Math.max(0, 1 - rho2)) + 0.04;
    _e.set(p.rx * (1 - rho2 * 0.3), p.ry, p.rz); _q.setFromEuler(_e); _p.set(V[0] + p.u * PA * sc, y, V[2] + p.v * PB * sc); _s.setScalar(c01((f - p.b) * 40));
    pileCoins.setMatrixAt(i, _m4.compose(_p, _q, _s));
  }
  pileCoins.instanceMatrix.needsUpdate = true;
  pileGlow.visible = f > 0.05; pileGlow.position.set(V[0], FY + ph * 0.5, V[2]); pileGlow.scale.setScalar(26 * sc); pileGlow.lookAt(camera.position); glowM.opacity = (0.25 + 0.6 * night) * Math.min(1, val);
  // cash: the pallet bundles fly into the hatch in 2020; afterwards the kiosks send bundle after bundle
  for (let i = 0; i < NCASH; i++) {
    let m = null;
    if (i < NPAL) { const p0 = PALP[i], t0 = PALT(i), u = seg(t, t0, t0 + 1.1);
      if (t > T.y2020 + 0.6 && t < t0 + 1.1) { const q = arc(p0, HATCH, eio(u), 7); _e.set(u * 5, u * 3 + i, 0); _q.setFromEuler(_e); _p.set(q[0], q[1], q[2]); _s.setScalar(u > 0.92 ? (1 - u) / 0.08 : 1); m = _m4.compose(_p, _q, _s); } }
    else { const sI = STREAM[i - NPAL], u = seg(t, sI.t0, sI.t0 + 1.25);
      if (u > 0 && u < 1) { const K = sI.k ? KR : KL, a = [K[0] + (sI.k ? -1.6 : 1.6), 2.4, K[2] + sI.dz * 0.3], q = arc(a, [HATCH[0] + sI.dz * 0.4, HATCH[1], HATCH[2] + sI.dz * 0.3], u, 7.5); _e.set(u * 6 + sI.sp, u * 4, 0); _q.setFromEuler(_e); _p.set(q[0], q[1], q[2]); _s.setScalar(u > 0.9 ? (1 - u) / 0.1 : 1); m = _m4.compose(_p, _q, _s); } }
    cashI.setMatrixAt(i, m ?? HIDE);
  }
  cashI.instanceMatrix.needsUpdate = true;
  pallet.visible = t > T.y2020 + 0.4 && t < T.b6;
  boss.visible = t > T.y2020 + 0.2 && t < T.b6; boss.position.y = hopY([T.superior + 0.2, T.p250], t, 0.18);
  clerks.forEach((m, k) => { m.position.y = hopY([k ? T.loans : T.shares5], t, 0.22); });
  // the price board, the headquarters' name, the list
  drawScreen(t); drawHQ(t); drawList(t);
  // one coin on the pedestal; the paper rises; the button glows
  { const show = t > T.b8 - 0.6 && t < T.wipe1 + 0.4; bigCoin.visible = show; bigCoin.position.set(PED[0], 1.3 + 1.25 + 0.06 * Math.sin(t * 2), PED[2]); bigCoin.rotation.set(Math.PI / 2, 0, t * 0.8);
    bigCoinM.emissiveIntensity = lerp(0.5, 0.2, seg(t, T.now8, T.p59 + 0.4)) + 0.25 * night;
    const pu = eo(seg(t, T.p16 - 0.2, T.paper + 0.2)); paper.visible = show && pu > 0.001; paper.position.set(PED[0] - 1.5 * pu, 1.6 + 3.0 * pu + 0.12 * Math.sin(t * 1.7), PED[2] + 0.9 * pu); paper.rotation.set(0.05 * Math.sin(t * 1.3), 0.52 + 0.1 * Math.sin(t), 0.06 * Math.sin(t * 1.9)); paper.scale.setScalar(Math.max(0.001, pu));
    btn.visible = show; btn.userData.glow.material.opacity = 0.45 + 0.3 * Math.sin(t * 5); }
  // the list plaza: funds hop when they copy, then throw Strategy's shares into the crate
  FUNDS.forEach((F_, k) => { F_.m.position.y = hopY([T.copy - 0.1 + k * 0.05, T.funds13 + k * 0.09], t, 0.2); });
  for (let i = 0; i < NCERT; i++) { const c = CERTS[i], F_ = FUNDS[c.f], u = seg(t, c.t0, c.t0 + 1.1);
    if (u <= 0 || u >= 1) { certI.setMatrixAt(i, HIDE); continue; }
    const q = arc([F_.x + 0.4, 1.9, F_.z], [CR[0] + c.dx, 1.7, CR[2] + c.dz], eio(u), 4.5 + (c.f % 3)); _e.set(u * 4 + c.sp, u * 6, u * 2); _q.setFromEuler(_e); _p.set(q[0], q[1], q[2]); _s.setScalar(1.3 * (u > 0.9 ? (1 - u) / 0.1 : 1)); certI.setMatrixAt(i, _m4.compose(_p, _q, _s)); }
  certI.instanceMatrix.needsUpdate = true;
  // 485 more coins drop through the hatch
  for (let i = 0; i < NDROP; i++) { const d = DROP[i], u = seg(t, d.t0, d.t0 + 0.9);
    if (u <= 0 || u >= 1) { dropI.setMatrixAt(i, HIDE); continue; }
    _p.set(V[0] + d.x, lerp(FY + VH + 7, FY + PH - 0.2, u * u), V[2] + d.z); _e.set(u * 6 + d.sp, d.sp, u * 3); _q.setFromEuler(_e); _s.setScalar(u > 0.93 ? (1 - u) / 0.07 : 1); dropI.setMatrixAt(i, _m4.compose(_p, _q, _s)); }
  dropI.instanceMatrix.needsUpdate = true;
  walkers.forEach((w, k) => { const ph_ = t * 0.5 + k * 1.7; w.m.position.set(w.x + Math.sin(ph_) * 1.6 * Math.cos(w.ry), Math.abs(Math.sin(t * 6 + k)) * 0.05, w.z - Math.sin(ph_) * 1.6 * Math.sin(w.ry)); });
  // cars, clouds
  for (const c of CARS) { const L = 700, x = ((c.off + t * c.v) % L) - L / 2; c.m.position.set(c.dir * x, 0, c.z); c.m.rotation.y = c.dir > 0 ? 0 : Math.PI; }
  for (const c of clouds) { const cw = c.userData.win ? win(t, c.userData.win[0], c.userData.win[1], 0.4, 0.4) : 1; c.visible = cw > 0.001; c.position.x = c.userData.x0 + t * 1.2; c.material.opacity = (0.9 - 0.5 * night) * cw; const k = lerp(1, 0.45, night); c.material.color.setRGB(lerp(s.hor[0], 1, 0.55) * k, lerp(s.hor[1], 1, 0.55) * k, lerp(s.hor[2], 1, 0.55) * k * 1.05); c.material.emissive.setRGB(c.material.color.r * 0.35, c.material.color.g * 0.35, c.material.color.b * 0.35); }
  // sparkles: over the pile at night, the first coins in 2020, the 485, the final wish over the board
  { let k = 0; const put3 = (x, y, z, sz, on) => { const sp = sparks[k++]; if (!sp) return; const tw = Math.pow(Math.abs(Math.sin(t * sp.userData.w + sp.userData.ph)), 3); sp.position.set(x, y, z); sp.scale.setScalar(sz * (0.25 + tw)); sp.material.opacity = on * (0.25 + 0.75 * tw); sp.visible = on > 0.01; };
    const s1 = Math.max(win(t, -1, T.b3, 0.1, 0.5), win(t, T.b15, T.cta + 1, 0.5, 0.5)) * night; for (let i = 0; i < 12; i++) { const a = i * 2.4 + t * 0.4; put3(V[0] + Math.cos(a) * 5.5, FY + 1.5 + (i % 4) * 1.3, V[2] + Math.sin(a) * 4, 0.55, s1); }
    const s2 = win(t, T.p250, T.b5, 0.2, 0.4); for (let i = 0; i < 8; i++) { const a = i * 0.785 + t * 0.9; put3(V[0] + Math.cos(a) * 2.2, FY + 0.8 + (i % 4) * 0.4, V[2] + Math.sin(a) * 1.6, 0.4, s2); }
    const s3 = win(t, T.p485, T.b15 + 0.5, 0.2, 0.4); for (let i = 0; i < 8; i++) { const a = i * 0.785 - t * 0.9; put3(V[0] + Math.cos(a) * 2.6, FY + PH + 0.5 + (i % 4) * 0.5, V[2] + Math.sin(a) * 2.0, 0.45, s3); }
    const s4 = win(t, T.postA, DUR + 1, 0.4, 0.1); for (let i = 0; i < 16; i++) { const ph_ = (t * 0.35 + i / 16) % 1, a = i * 2.4; const c = SCRW(); put3(c[0] + Math.cos(a) * (3 + ph_ * 4), 2 + ph_ * 12, c[2] + 4 + Math.sin(a) * (2 + ph_ * 3), 0.9 + 0.6 * (1 - ph_), s4 * Math.sin(ph_ * Math.PI)); }
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
  return out.map(([a, b, n]) => `${(a / 30).toFixed(2)}-${(b / 30).toFixed(2)}s ${n}`);
};
window.renderAt = renderAt; window.__dbg = { camera, fillAt };
window.CUES = {
  T, DUR, sent: TIM.sentences.map(s => s.s),
  typingA: [0, 1, 2, 3].map(i => +(T.sell + (i + 0.5) * 0.11).toFixed(3)), typingB: [0, 1, 2, 3].map(i => +(T.hold + (i + 0.5) * 0.11).toFixed(3)),
  pallet: Array.from({ length: NPAL }, (_, i) => +(PALT(i) + 1.0).toFixed(3)), stream: STREAMLAND.map(x => +x.toFixed(3)), streamSide: STREAM.map(s => s.k),
  certs: CERTS.map(c => +(c.t0).toFixed(3)), certLand: CERTS.map(c => +(c.t0 + 1.0).toFixed(3)), drop: DROP.map(d => +(d.t0 + 0.85).toFixed(3)),
  postA: +T.postA.toFixed(3), postB: +T.postB.toFixed(3),
};
document.fonts.ready.then(() => Promise.all(['700 64px Figtree', '900 190px Fraunces', '800 30px JBM', '700 22px Inter', '700 78px Fraunces', '800 54px Figtree', '600 34px Figtree', '500 18px Inter', '900 92px Fraunces', '800 120px JBM', '800 46px Inter', '900 150px Figtree', '900 72px Figtree', '900 58px Fraunces', '700 44px Fraunces'].map(f => document.fonts.load(f)))).then(() => { renderAt(0); window.__ready = true; });
