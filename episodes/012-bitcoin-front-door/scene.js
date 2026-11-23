// Bitcoin's Front Door — low-poly storybook scene (deterministic: window.renderAt(t) draws the frame for time t)
// US spot bitcoin funds lose about $3.6 billion in November 2026 (to 20 Nov, Farside data); BlackRock's IBIT has its biggest one-day outflow ever
// ($541.1 million, Thu 19 Nov); the average fund buyer paid more than $80,000 a coin. Sat 21 Nov: bitcoin falls to about $55,250, its lowest in
// two years (Reuters); Mon 23 Nov: back above $61,000 (CoinDesk). The fund is a grand building with a front door; the bitcoin sits in a glass vault behind it.
import * as THREE from 'three';
import { SKIN, MAT, GOLD, rng, GB, person, cloud, bushTree, tower, car, lamp, bank, kiosk, BIGCOIN, glassVault, CASH, WIN_LIT } from './kit.js';

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
  hookEnd: TIM.big ? 1.5 : TIM.hook ? TIM.sentences[0].e + 0.15 : 0,
  bigIn: TIM.big ? 1.5 : 0, bigOut: TIM.big ? 3.0 : 0,
  pulled: wt(1, 'pulled') - 0.1, billion1: wt(1, 'billion') - 0.1, out1: wt(1, 'out') - 0.1, easiest: wt(1, 'easiest') - 0.1, door1: wt(1, 'door') - 0.1,
  b2: S(2) - 0.05, saturday: wt(2, 'Saturday') - 0.1, fell: wt(2, 'fell') - 0.1, p55: wt(2, '$55,000') - 0.1, lowest: wt(2, 'lowest') - 0.1, two: wt(2, 'two') - 0.1,
  b3: S(3) - 0.05, who: wt(3, 'who') - 0.1, walking: wt(3, 'walking') - 0.1, why: wt(3, 'why') - 0.1,
  b4: S(4) - 0.05, door4: wt(4, 'door') - 0.1, fund4: wt(4, 'fund') - 0.1, share: wt(4, 'share') - 0.1, buy4: wt(4, 'buy') - 0.1, stock: wt(4, 'stock') - 0.1,
  b5: S(5) - 0.05, behind: wt(5, 'Behind') - 0.1, real: wt(5, 'real') - 0.1, locked: wt(5, 'locked') - 0.1, vault5: wt(5, 'vault') - 0.1,
  b6: S(6) - 0.05, sell6: wt(6, 'sell') - 0.1, leaves: wt(6, 'leaves') - 0.1, often: wt(6, 'often') - 0.1, sold: wt(6, 'sold') - 0.1,
  b7: S(7) - 0.05, thursday: wt(7, 'Thursday') - 0.1, blackrock: wt(7, "BlackRock's") - 0.1, biggest: wt(7, 'biggest') - 0.1, exit: wt(7, 'exit') - 0.1, half: wt(7, 'half') - 0.1, billion7: wt(7, 'billion') - 0.1,
  b8: S(8) - 0.05, pain: wt(8, 'pain') - 0.1, average: wt(8, 'average') - 0.1, paid: wt(8, 'paid') - 0.1, p80: wt(8, '$80,000') - 0.1, coin8: wt(8, 'coin') - 0.1,
  b9: S(9) - 0.05, today: wt(9, "today's") - 0.1, losing: wt(9, 'losing') - 0.1, money: wt(9, 'money') - 0.1,
  b10: S(10) - 0.05, monday: wt(10, 'Monday') - 0.1, back: wt(10, 'back') - 0.1, p61: wt(10, '$61,000') - 0.1, story10: wt(10, 'story') - 0.1, over: wt(10, 'over') - 0.1,
  b11: S(11) - 0.05, story: wt(11, 'story') - 0.15, door11: wt(11, 'door') - 0.1, opens: wt(11, 'opens') - 0.1, both: wt(11, 'both') - 0.1,
  cta: S(12) - 0.1, would: wt(12, 'Would') - 0.1, sell12: wt(12, 'sell') - 0.1, hold12: wt(12, 'hold') - 0.1, comment: wt(12, 'Comment') - 0.15, SELLw: wt(12, 'SELL', 1) - 0.2, HOLDw: wt(12, 'HOLD', 1) - 0.1,
};
T.inA = T.share - 0.3; T.inB = T.vault5 + 0.5;          // bought: coins drop into the vault
T.outA = T.leaves - 0.15; T.outB = T.b8 - 1.4;            // sold: coins leave the vault for the market
T.postA = T.SELLw + 0.75; T.postB = T.HOLDw + 0.7;
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
  NIGHT: P(0x070B24, 0x141C4B, 0x30326A, 0x22265A, 0xB4C2FF, 2.0, 0x5567C4, 0x3A3048, 1.5, 1, 1, -35, 42, 0xFFF4D6, 30, 80, 560),
  MORN: P(0x4E9FDC, 0x9FD0EA, 0xFBE6BC, 0xE6E4D6, 0xFFE2B0, 3.2, 0xBFDFFF, 0x9A9A80, 1.6, 0, 0, 55, 30, 0xFFF0C8, 40, 100, 680),
  DAY: P(0x2F8FDA, 0x86C6EE, 0xEAF0EE, 0xDCE6EA, 0xFFF1D6, 3.5, 0xCFE8FF, 0x9AA088, 1.7, 0, 0, 22, 52, 0xFFF8E0, 38, 110, 720),
  GOLDEN: P(0x3C7FCB, 0xF2C58A, 0xFFD79A, 0xF6CF9A, 0xFFC878, 3.2, 0xE8D2B0, 0xA88A60, 1.5, 0, 0.12, -68, 20, 0xFFE0A0, 44, 100, 680),
  SUNSET: P(0x2E2F72, 0xE0707A, 0xFFB25E, 0xEE9A6A, 0xFF9050, 2.9, 0xB49AC8, 0x86685A, 1.45, 0.12, 0.6, -70, 11, 0xFFB060, 50, 90, 620),
  DUSK: P(0x141A4C, 0x4A3F86, 0xC06A78, 0x6A4A78, 0x93A4F4, 1.7, 0x5A62B0, 0x3A2A40, 1.2, 0.65, 0.92, -40, 36, 0xFFF4D6, 30, 80, 600),
};
const SKY = [[0, 'GOLDEN'], [T.door1, 'GOLDEN'], [T.b2 + 0.4, 'DUSK'], [T.fell + 0.5, 'NIGHT'], [T.b3 + 0.3, 'NIGHT'], [T.b4 + 0.1, 'MORN'], [T.fund4 + 0.6, 'DAY'], [T.b7 - 0.1, 'DAY'], [T.blackrock + 0.4, 'GOLDEN'],
  [T.b8 - 0.1, 'GOLDEN'], [T.average + 0.6, 'SUNSET'], [T.b10 - 0.2, 'SUNSET'], [T.p61 - 0.2, 'MORN'], [T.b11 - 0.2, 'MORN'], [T.opens + 0.4, 'DUSK'], [T.cta + 0.2, 'DUSK'], [T.hold12 + 0.6, 'NIGHT'], [DUR + 2, 'NIGHT']];
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
const FB = [0, -100], K = 1.7;                 // the fund building (a classical bank, scaled), facing +z
const DOORZ = FB[1] + 6.15 * K;                // the dark doorway's face (z ≈ -89.5)
const STEPZ = FB[1] + 10.2 * K;                // the foot of the steps (z ≈ -82.7)
const FLOORY = 1.0 * K;                        // the portico floor (top of the plinth)
const VLT = [0, -137], VS = 1.6;               // the glass vault behind the building (scaled)
const PBP = [-50, -58], PBRY = 0.72, KB = 1.8; // the price board (a pylon screen) turned to face the plaza
const MK = [-40, -142];                        // the market stall where coins are sold (west of the vault)
const AB = [34, -62];                          // the average fund buyer (east side of the plaza)
const stat = [];

// ───────────────────────── ground, streets, plaza
const ground = new THREE.Mesh(new THREE.PlaneGeometry(2400, 2400).rotateX(-Math.PI / 2), new THREE.MeshLambertMaterial({ color: 0xC9C2AE })); ground.receiveShadow = true; scene.add(ground);
const flat = new GB();
flat.box(9, 0.04, 420, 0x4A4E56, 70, 0.02, -60); flat.box(9, 0.04, 420, 0x4A4E56, -74, 0.021, -60);               // avenues north-south
flat.box(560, 0.04, 9, 0x4A4E56, 0, 0.022, -6); flat.box(560, 0.04, 9, 0x4A4E56, 0, 0.023, -172);                  // east-west
for (const z of [-6, -172]) for (let x = -270; x < 270; x += 6) flat.box(2.6, 0.05, 0.22, 0xF2EEE2, x, 0.045, z);
flat.box(120, 0.07, 76, 0xE6DFD0, -6, 0.035, -48);                                                                 // the plaza in front of the fund
for (let i = 0; i < 18; i++) flat.box(120, 0.075, 0.12, 0xD6CEBC, -6, 0.037, -84 + i * 4);
flat.box(54, 0.07, 52, 0xD9D2C2, 0, 0.034, -134);                                                                  // the courtyard behind it
flat.box(24, 0.08, 22, 0xE0D6C2, MK[0], 0.04, MK[1]);                                                              // the market square
{ const rr = rng(909); for (let i = 0; i < 70; i++) { const x = -260 + rr() * 520, z = -240 + rr() * 300; if (x > -72 && x < 64 && z > -165 && z < -8) continue; flat.box(6 + rr() * 14, 0.06, 6 + rr() * 14, rr() < 0.5 ? 0x8DAE74 : 0x9DB884, x, 0.03, z); } }
const flatM = flat.mesh(); flatM.castShadow = false; scene.add(flatM);

// ───────────────────────── the city around the plaza
const DEST = (x, z) => (x > -80 && x < 76 && z > -250 && z < 60) || Math.abs(z + 6) < 9 || Math.abs(z + 172) < 9 || Math.abs(x - 70) < 9 || Math.abs(x + 74) < 9;
{
  const tr = rng(2026), PAL = [[0xD9D3C6, 0x5E7F9A], [0x6D97AA, 0x3F6A80], [0xE4DED2, 0x4E7C93], [0xC9C2B4, 0x55748C], [0x8FB3C2, 0x426E86], [0xEFE9DC, 0x6A8AA4], [0xB7C4C9, 0x3E6378], [0xE8D9C0, 0x5A7A90]];
  for (let gx = -250; gx <= 250; gx += 22) for (let gz = -300; gz <= 120; gz += 22) {
    const x = gx + (tr() - .5) * 7, z = gz + (tr() - .5) * 7; if (DEST(x, z) || tr() < 0.12) continue;
    const dp = Math.hypot(x, z + 80), far = dp > 140, w = 9 + tr() * 7, d = 9 + tr() * 7;
    const h = (dp < 110 ? 14 + tr() * 18 : 20 + tr() * (far ? 46 : 30)) * (z > 10 ? 0.55 : 1);
    const pal = PAL[Math.floor(tr() * PAL.length)];
    const g = tower(w, h, d, { rand: tr, color: pal[0], glass: pal[1], floor: far ? 4.2 : 3.4, litP: 0.55, crown: h > 46 && tr() < 0.5 });
    g.position.set(x, 0, z); g.rotation.y = (tr() < 0.5 ? 0 : Math.PI / 2); g.children.forEach(c => { c.castShadow = dp < 160; c.receiveShadow = true; }); scene.add(g);
    stat.push([x - Math.max(w, d) / 2, x + Math.max(w, d) / 2, z - Math.max(w, d) / 2, z + Math.max(w, d) / 2, h + 4, 'tower']);
  }
}

// ───────────────────────── the fund: a classical building with a glowing front door and a sign
const fund = bank(); fund.scale.setScalar(K); fund.position.set(FB[0], 0, FB[1]); fund.children.forEach(c => { c.castShadow = true; c.receiveShadow = true; }); scene.add(fund);
stat.push([-22.5, 22.5, FB[1] - 14, FB[1] + 12.6, 27, 'fund'], [-22.5, 22.5, FB[1] + 12.6, FB[1] + 18.8, 2.4, 'steps']);
const doorGlowM = new THREE.MeshBasicMaterial({ color: 0xFFC872, transparent: true, opacity: 0.9, toneMapped: false });
const doorGlow = new THREE.Mesh(new THREE.PlaneGeometry(6.6, 8.6), doorGlowM); doorGlow.position.set(0, FLOORY + 4.35, DOORZ + 0.5); scene.add(doorGlow);
const spillM = new THREE.MeshBasicMaterial({ map: radial('rgba(255,200,110,0.75)', 'rgba(255,200,110,0)'), transparent: true, depthWrite: false, toneMapped: false, blending: THREE.AdditiveBlending });
const spill = new THREE.Mesh(new THREE.PlaneGeometry(30, 26).rotateX(-Math.PI / 2), spillM); spill.position.set(0, 0.12, STEPZ + 6); spill.renderOrder = 1; scene.add(spill);
const signCv = document.createElement('canvas'); signCv.width = 1024; signCv.height = 128;
{ const g = signCv.getContext('2d'); g.clearRect(0, 0, 1024, 128); g.font = '900 92px Fraunces'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#6A4A1A'; g.fillText('BITCOIN  FUND', 512, 72); g.fillStyle = '#E9B23A'; g.fillText('BITCOIN  FUND', 509, 68); }
const signTx = new THREE.CanvasTexture(signCv); signTx.colorSpace = THREE.SRGBColorSpace;
const sign = new THREE.Mesh(new THREE.PlaneGeometry(30, 3.75), new THREE.MeshBasicMaterial({ map: signTx, transparent: true, toneMapped: false })); sign.position.set(0, (1 + 11 - 1.3) * K, FB[1] + 8.72 * K + 0.06); scene.add(sign);
const redrawSign = () => { const g = signCv.getContext('2d'); g.clearRect(0, 0, 1024, 128); g.font = '900 92px Fraunces'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#6A4A1A'; g.fillText('BITCOIN  FUND', 512, 72); g.fillStyle = '#E9B23A'; g.fillText('BITCOIN  FUND', 509, 68); signTx.needsUpdate = true; };
// lanterns on the portico
const lanternM = new THREE.MeshLambertMaterial({ color: 0xFFF1C8, emissive: 0xFFC46A, emissiveIntensity: 0 });
for (const x of [-6.2, 6.2]) { const b = new GB(); b.box(0.9, 1.4, 0.9, 0x3A3F48, 0, 0, 0); const m = b.mesh(); m.position.set(x, FLOORY + 8.2, DOORZ + 1.0); scene.add(m); const l = new THREE.Mesh(new THREE.BoxGeometry(0.7, 1.0, 0.7), lanternM); l.position.set(x, FLOORY + 8.2, DOORZ + 1.05); scene.add(l); }

// ───────────────────────── the vault behind it: a glass box with a heap of gold coins (real bitcoin)
const vlt = glassVault(16, 12, 9); vlt.scale.setScalar(VS); vlt.position.set(VLT[0], 0, VLT[1]); vlt.children.forEach(c => { c.castShadow = true; c.receiveShadow = true; }); scene.add(vlt);
const VFY = vlt.userData.floorY * VS, VTOP = (0.6 + 9) * VS;
stat.push([VLT[0] - 14.2, VLT[0] + 14.2, VLT[1] - 11, VLT[1] + 11, VTOP + 2.2, 'vault']);
const moundG = (() => { const g = new THREE.SphereGeometry(1, 18, 7, 0, Math.PI * 2, 0, Math.PI / 2).toNonIndexed(); g.computeVertexNormals(); return g; })();
const pileM = new THREE.MeshLambertMaterial({ color: 0xE9A814, emissive: 0x8A5200, emissiveIntensity: 0.35 });
const mound = new THREE.Mesh(moundG, pileM); mound.castShadow = true; mound.receiveShadow = true; mound.position.set(VLT[0], VFY, VLT[1]); scene.add(mound);
const PA = 10.5, PB = 7.4, PH = 8.6;
const pcoinG = BIGCOIN(0.62, 0.18);
const NPC = 300, PC = [];
{ const rr = rng(6061); for (let i = 0; i < NPC; i++) { const a = rr() * Math.PI * 2, r = Math.sqrt(rr()) * 0.96; PC.push({ u: Math.cos(a) * r, v: Math.sin(a) * r, rx: (rr() - 0.5) * 1.1, ry: rr() * 6.28, rz: (rr() - 0.5) * 1.1 }); } }
const pileCoins = new THREE.InstancedMesh(pcoinG, GOLD, NPC); pileCoins.castShadow = true; pileCoins.frustumCulled = false; scene.add(pileCoins);
function fillAt(t) {   // how full the vault is: buyers add coins (sentences 4-5); sellers take them out (6-7)
  return 0.86 + 0.14 * eio(seg(t, T.inA + 0.6, T.inB + 0.6)) - 0.3 * eio(seg(t, T.outA + 0.8, T.outB + 1.6));
}
// a little courtyard: two guards and trees
const guards = [[-15, VLT[1] + 13], [15, VLT[1] + 13]].map(([x, z], i) => { const m = person({ robe: 0x2B2F3A, skin: SKIN[i + 2], short: 0x231C18, s: 1.25 }); m.position.set(x, 0, z); m.rotation.y = -Math.PI / 2; scene.add(m); return m; });

// ───────────────────────── the price board (a pylon screen at the plaza's west side)
const SCRH = 9.5;
const pylon = new THREE.Group(); { const b = new GB(); b.box(1.6, SCRH, 1.4, 0x3A4048, 0, SCRH / 2, -0.9); b.box(9.4, 7.2, 0.7, 0x23272E, 0, SCRH + 2.4, 0); b.box(9.8, 0.4, 1.0, 0x8A8F96, 0, SCRH + 6.1, 0); b.box(9.8, 0.4, 1.0, 0x8A8F96, 0, SCRH - 1.3, 0); b.box(4.6, 0.5, 3.4, 0x8A8F96, 0, 0.25, -0.9); pylon.add(b.mesh()); }
pylon.scale.setScalar(KB); pylon.position.set(PBP[0], 0, PBP[1]); pylon.rotation.y = PBRY; pylon.children.forEach(c => { c.castShadow = true; c.receiveShadow = true; }); scene.add(pylon);
const scrCv = document.createElement('canvas'); scrCv.width = 720; scrCv.height = 560; const scrTx = new THREE.CanvasTexture(scrCv); scrTx.colorSpace = THREE.SRGBColorSpace; scrTx.anisotropy = 4;
const screen = new THREE.Mesh(new THREE.PlaneGeometry(8.8, 6.84), new THREE.MeshBasicMaterial({ map: scrTx, toneMapped: false })); screen.position.set(0, SCRH + 2.4, 0.37); pylon.add(screen);
const SCRW = (dy = 0) => { const c = Math.cos(PBRY), s = Math.sin(PBRY); return [PBP[0] + 0.37 * KB * s, (SCRH + 2.4) * KB + dy, PBP[1] + 0.37 * KB * c]; };
stat.push([PBP[0] - 9, PBP[0] + 9, PBP[1] - 7, PBP[1] + 7, (SCRH + 6.4) * KB, 'board']);
// bitcoin in US dollars (thousands), CoinGecko 365-day series read 23 Nov 2026: 24 Nov 2025 ... 20 Nov 2026, then the 21 Nov low and 23 Nov
const PX = [86.7, 90.5, 90.8, 91.3, 89.3, 90.6, 92.5, 88.2, 85.5, 88.7, 87.6, 87.9, 88.4, 90.0, 93.9, 91.0, 90.9, 96.9, 94.8, 88.4, 89.5, 88.2, 84.6, 78.7, 62.8, 70.4, 67.1, 69.8, 67.6, 68.0, 64.7, 67.5, 65.8, 72.8, 67.3, 69.8, 70.8, 74.7, 70.5, 71.0, 68.7, 65.9, 68.0, 67.1, 71.7, 72.9, 74.5, 75.1, 73.8, 78.2, 77.6, 76.3, 78.2, 80.9, 80.2, 81.6, 81.1, 77.4, 77.5, 76.7, 75.9, 73.5, 71.3, 63.8, 63.3, 61.5, 64.4, 64.4, 64.3, 62.7, 60.0, 60.2, 61.5, 63.6, 62.2, 63.8, 65.0, 63.9, 65.2, 65.1, 65.3, 63.9, 63.5, 64.6, 64.9, 63.5, 63.0, 64.5, 73.0, 77.7, 79.0, 78.2, 77.4, 79.7, 79.1, 76.6, 76.8, 76.4, 81.2, 84.4, 84.4, 83.6, 84.5, 85.8, 81.7, 83.7, 81.6, 81.4, 82.9, 81.1, 80.0, 77.8, 76.7, 76.0, 74.7, 74.0, 64.1, 64.9, 58.8];
const XLOW = 0.9930, YLOW = 55.25, XNOW = 0.9996, YNOW = 61.13;
let scrKey = '';
function scrMode(t) {
  if (t >= T.cta - 0.3) return ['cta', seg(t, T.would - 0.2, T.would + 0.4)];
  if (t >= T.back - 0.15) return ['bounce', seg(t, T.back - 0.1, T.p61 + 0.5)];
  if (t >= T.fell - 0.2) return ['dive', seg(t, T.fell - 0.1, T.p55 + 0.6)];
  return ['base', 0];
}
function drawScreen(t) {
  const [mode, a] = scrMode(t), blink = Math.floor(t * 3) % 2, key = mode + Math.round(a * 30) + (mode === 'dive' && t > T.lowest ? 'L' + blink : '') + (mode === 'bounce' ? blink : '');
  if (key === scrKey) return; scrKey = key;
  const g = scrCv.getContext('2d'), w = 720, h = 560;
  g.fillStyle = '#0E1430'; g.fillRect(0, 0, w, h);
  g.textBaseline = 'middle';
  if (mode === 'cta') {
    g.textAlign = 'center'; g.fillStyle = 'rgba(255,255,255,.7)'; g.font = '700 30px Inter'; g.fillText('BITCOIN · 23 NOV 2026', w / 2, 90);
    const s = 0.8 + 0.2 * eo(a); g.save(); g.translate(w / 2, 280); g.scale(s, s);
    g.font = '900 120px Figtree'; g.fillStyle = '#FF6B5B'; g.fillText('SELL', 0, -70); g.fillStyle = 'rgba(255,255,255,.75)'; g.font = '800 54px Figtree'; g.fillText('or', 0, 12); g.font = '900 120px Figtree'; g.fillStyle = '#FFC84A'; g.fillText('HOLD?', 0, 100); g.restore();
    scrTx.needsUpdate = true; return;
  }
  const L = 70, Rt = 640, Tp = 110, Bt = 470, y0 = 50, y1 = 100;
  const X = u => L + (Rt - L) * u, Y = v => Bt - (Bt - Tp) * (v - y0) / (y1 - y0);
  g.textAlign = 'left'; g.fillStyle = '#FFD27A'; g.font = '700 26px Inter'; g.fillText('BITCOIN  ·  US$  ·  ONE YEAR', L, 52);
  g.strokeStyle = 'rgba(255,255,255,.13)'; g.lineWidth = 2; g.fillStyle = 'rgba(255,255,255,.5)'; g.font = '600 20px Inter'; g.textAlign = 'right';
  for (const v of [60, 80, 100]) { g.beginPath(); g.moveTo(L, Y(v)); g.lineTo(Rt, Y(v)); g.stroke(); g.fillText('$' + v + 'K', L - 10, Y(v)); }
  g.textAlign = 'center'; g.fillStyle = 'rgba(255,255,255,.55)'; g.font = '700 19px Inter'; g.fillText('NOV 2025', X(0.04), 534); g.fillText('MAY 2026', X(0.5), 534); g.fillText('NOV 2026', X(0.93), 534);
  // the year, then the last days
  g.lineJoin = 'round'; g.lineCap = 'round'; g.strokeStyle = '#F7A600'; g.lineWidth = 6; g.shadowColor = 'rgba(247,166,0,.7)'; g.shadowBlur = 10;
  g.beginPath(); PX.forEach((v, i) => { const x = X(i / 119), y = Y(v); i ? g.lineTo(x, y) : g.moveTo(x, y); }); g.stroke(); g.shadowBlur = 0;
  let hx_ = X(118 / 119), hy = Y(58.8), col = '#F7A600';
  if (mode === 'dive' || mode === 'bounce') {
    const u = mode === 'dive' ? eo(a) : 1, ex = lerp(X(118 / 119), X(XLOW), u), ey = lerp(Y(58.8), Y(YLOW), u);
    g.strokeStyle = '#FF5A4A'; g.lineWidth = 7; g.shadowColor = 'rgba(255,90,70,.9)'; g.shadowBlur = 14; g.beginPath(); g.moveTo(X(118 / 119), Y(58.8)); g.lineTo(ex, ey); g.stroke(); g.shadowBlur = 0;
    hx_ = ex; hy = ey; col = '#FF5A4A';
    g.strokeStyle = 'rgba(255,255,255,.45)'; g.setLineDash([10, 10]); g.lineWidth = 3; g.beginPath(); g.moveTo(L, Y(YLOW)); g.lineTo(Rt, Y(YLOW)); g.stroke(); g.setLineDash([]);
    if (mode === 'dive' && a > 0.6 || mode === 'bounce') { g.textAlign = 'right'; g.fillStyle = '#FF8A7A'; g.font = '800 38px JBM'; g.fillText('$55,251', X(XLOW) - 24, Y(YLOW) + 28); g.font = '700 19px Inter'; g.fillStyle = 'rgba(255,255,255,.75)'; g.fillText('LOW · SAT 21 NOV · REUTERS', X(XLOW) - 24, Y(YLOW) + 58); }
  }
  if (mode === 'bounce') {
    const u = eo(a), ex = lerp(X(XLOW), X(XNOW), u), ey = lerp(Y(YLOW), Y(YNOW), u);
    g.strokeStyle = '#7FE08A'; g.lineWidth = 7; g.shadowColor = 'rgba(127,224,138,.9)'; g.shadowBlur = 14; g.beginPath(); g.moveTo(X(XLOW), Y(YLOW)); g.lineTo(ex, ey); g.stroke(); g.shadowBlur = 0;
    hx_ = ex; hy = ey; col = '#7FE08A';
    if (a > 0.5) { g.textAlign = 'right'; g.fillStyle = '#9BEFA4'; g.font = '800 40px JBM'; g.fillText('$61,129', X(XNOW) - 26, Y(YNOW) - 40); g.font = '700 19px Inter'; g.fillStyle = 'rgba(255,255,255,.75)'; g.fillText('MON 23 NOV · COINGECKO', X(XNOW) - 26, Y(YNOW) - 74); }
  }
  g.fillStyle = '#fff'; g.strokeStyle = col; g.lineWidth = 6; g.beginPath(); g.arc(hx_, hy, 11 + (blink && mode !== 'base' ? 3 : 0), 0, 7); g.fill(); g.stroke();
  scrTx.needsUpdate = true;
}

// ───────────────────────── the market stall where coins are sold
const mk = kiosk(); mk.scale.setScalar(1.9); mk.position.set(MK[0], 0, MK[1]); mk.rotation.y = 0.69; mk.children.forEach(c => { c.castShadow = true; }); scene.add(mk);
stat.push([MK[0] - 6, MK[0] + 6, MK[1] - 6, MK[1] + 6, 8.5, 'market']);
const mkCv = document.createElement('canvas'); mkCv.width = 512; mkCv.height = 128;
{ const g = mkCv.getContext('2d'); g.fillStyle = '#C8423A'; g.fillRect(0, 0, 512, 128); g.fillStyle = '#FFF6E6'; g.font = '900 78px Figtree'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('MARKET', 256, 68); }
const mkTx = new THREE.CanvasTexture(mkCv); mkTx.colorSpace = THREE.SRGBColorSpace;
const mkSign = new THREE.Mesh(new THREE.PlaneGeometry(7.6, 1.9), new THREE.MeshBasicMaterial({ map: mkTx, toneMapped: false })); scene.add(mkSign);
{ const c = Math.cos(0.69), s = Math.sin(0.69); mkSign.position.set(MK[0] + 3.4 * c, 8.6, MK[1] - 3.4 * s); mkSign.rotation.y = 0.69 + Math.PI / 2; }
const traders = [0, 1, 2].map(i => { const m = person({ robe: [0x8A3A3A, 0x3F6A5A, 0x5A5A66][i], skin: SKIN[(i + 1) % 5], short: [0x231C18, 0x5A3E28, 0x3A2A1E][i], shirt: 0xF4F2EC, s: 1.25 }); const a = 0.69 + (i - 1) * 0.55; m.position.set(MK[0] + Math.cos(a) * 9, 0, MK[1] - Math.sin(a) * 9); m.rotation.y = a + Math.PI; scene.add(m); return m; });

// ───────────────────────── people: streams out of (and into) the front door
const modern = (i, extra = {}) => ({ robe: [0x34405A, 0x6A2E3E, 0x3F6A5A, 0x5A5A66, 0x7A5A3A, 0x2F4A6A, 0x8A3A3A, 0x3B6FA8, 0xB0603A, 0x4E7A3E][i % 10], skin: SKIN[i % 5], short: [0x231C18, 0x5A3E28, 0xC9A27A, 0x3A2A1E, 0x8A8A8A][i % 5], shirt: i % 2 ? 0xF4F2EC : undefined, ...extra });
const TRIPS = [];
function addTrips(dir, a, b, n, seed) {
  const rr = rng(seed);
  for (let i = 0; i < n; i++) {
    const ang = -1.25 + rr() * 1.75, far = 22 + rr() * 30, ex = Math.sin(ang) * far * 1.15, ez = STEPZ + Math.cos(ang) * far;
    TRIPS.push({ dir, t0: lerp(a, b, (i + rr() * 0.7) / n), lane: (rr() - 0.5) * 2.0, ex, ez, sp: 4.2 + rr() * 1.4, k: TRIPS.length });
  }
}
addTrips(+1, -15, T.b4 - 0.8, 42, 11);                 // cover, sentences 1-3: a stream out of the door
addTrips(-1, T.b4 - 7.0, T.b6 - 3.0, 18, 12);          // 4-5: buyers walk in
addTrips(+1, T.b6 - 4.0, T.b7 - 1.0, 9, 13);            // 6: more out than in
addTrips(+1, T.b7 - 5.0, T.b8 - 2.0, 26, 14);           // 7: the rush out
addTrips(+1, T.b8 - 2.0, T.b11 - 4, 6, 15); addTrips(-1, T.b8 - 6.0, T.b11 - 8, 4, 16);   // 8-10: a trickle
addTrips(+1, T.b11 - 8, DUR, 12, 17); addTrips(-1, T.b11 - 12, DUR - 4, 12, 18);          // 11-12: both ways
function tripPath(tr) {   // out: inside the door -> between the middle columns -> down the steps -> across the plaza
  const p0 = [tr.lane * 0.55, FLOORY, DOORZ - 0.6], p1 = [tr.lane * 0.6, FLOORY, FB[1] + 7.7 * K], p2 = [tr.lane * 2.2, 0.0, STEPZ + 1.5], p3 = [tr.ex, 0, tr.ez];
  const pts = [p0, p1, p2, p3], L = [0]; for (let i = 1; i < 4; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][2] - pts[i - 1][2]));
  return { pts, L, total: L[3] };
}
TRIPS.forEach(tr => { tr.path = tripPath(tr); tr.dur = tr.path.total / tr.sp; });
const crowd = TRIPS.map((tr, i) => { const g = new THREE.Group(), p = person(modern(i, { s: 1.6, badge: i % 7 === 0 })); g.add(p);
  const cash = new THREE.Mesh(CASH, MAT); cash.scale.setScalar(0.8); cash.position.set(0.56, 0.95 * 1.6, 0.4); cash.rotation.y = 0.4; g.add(cash); g.visible = false; scene.add(g); return g; });
function walkerAt(tr, t) {   // [x, y, z, heading, visible]
  let u = (t - tr.t0) / tr.dur; if (u < 0 || u > 1) return null;
  const { pts, L, total } = tr.path; let s = (tr.dir > 0 ? u : 1 - u) * total, i = 1; while (i < 3 && s > L[i]) i++;
  const a = pts[i - 1], b = pts[i], v = (s - L[i - 1]) / Math.max(1e-6, L[i] - L[i - 1]);
  const x = lerp(a[0], b[0], v), z = lerp(a[2], b[2], v); let y = lerp(a[1], b[1], v);
  if (i === 3 && v < 0.12) y = FLOORY * (1 - v / 0.12) * 0;      // stepped down already
  const dx = (b[0] - a[0]) * tr.dir, dz = (b[2] - a[2]) * tr.dir;
  return [x, i < 3 ? y : 0, z, Math.atan2(-dz, dx), u];
}
// the average fund buyer: one person in the plaza, looking at a phone
const buyer = person(modern(7, { robe: 0x2F6FB8, phone: true, s: 1.5 })); buyer.position.set(AB[0], 0, AB[1]); buyer.rotation.y = -0.2; scene.add(buyer);
const buyerCoin = new THREE.Mesh(BIGCOIN(0.42, 0.12), GOLD); buyerCoin.rotation.x = Math.PI / 2; scene.add(buyerCoin);

// ───────────────────────── coins: bought (drop into the vault), sold (fly to the market)
const coinG = BIGCOIN(0.9, 0.26);
const NIN = 34, NOUT = 64;
const coinsIn = new THREE.InstancedMesh(coinG, GOLD, NIN), coinsOut = new THREE.InstancedMesh(coinG, GOLD, NOUT); coinsIn.castShadow = coinsOut.castShadow = true; coinsIn.frustumCulled = coinsOut.frustumCulled = false; scene.add(coinsIn, coinsOut);
const CIN = Array.from({ length: NIN }, (_, i) => { const rr = rng(700 + i); return { t0: lerp(T.inA, T.inB - 1.2, i / NIN) + rr() * 0.1, x: (rr() - 0.5) * 18, hx: (rr() - 0.5) * 3.0, hz: (rr() - 0.5) * 3.0, sp: 4 + rr() * 5, ph: rr() * 6 }; });
const COUT = Array.from({ length: NOUT }, (_, i) => { const rr = rng(800 + i); const dense = i >= NOUT * 0.4; return { t0: dense ? lerp(T.b7 - 0.3, T.outB, (i - NOUT * 0.4) / (NOUT * 0.6)) : lerp(T.outA, T.b7 - 0.4, i / (NOUT * 0.4)), hx: (rr() - 0.5) * 3.2, hz: (rr() - 0.5) * 3.2, lx: (rr() - 0.5) * 4, lz: (rr() - 0.5) * 4, h: 14 + rr() * 10, sp: 4 + rr() * 6, ph: rr() * 6 }; });
const FLYIN = 1.5, FLYOUT = 2.1;
const _m4 = new THREE.Matrix4(), _q = new THREE.Quaternion(), _e = new THREE.Euler(), _p = new THREE.Vector3(), _s = new THREE.Vector3();
const bez = (p0, p1, p2, p3, u) => { const a = (1 - u) ** 3, b = 3 * (1 - u) ** 2 * u, c = 3 * (1 - u) * u * u, d = u ** 3; return [a * p0[0] + b * p1[0] + c * p2[0] + d * p3[0], a * p0[1] + b * p1[1] + c * p2[1] + d * p3[1], a * p0[2] + b * p1[2] + c * p2[2] + d * p3[2]]; };
function coinInAt(c, t) { const u = (t - c.t0) / FLYIN; if (u < 0 || u > 1) return null; const top = VTOP + 1.0;
  return bez([c.x, 34, FB[1] + 6], [c.x * 0.6, 44, FB[1] - 14], [VLT[0] + c.hx, top + 14, VLT[1] + c.hz], [VLT[0] + c.hx, VFY + PH * 0.7, VLT[1] + c.hz], eio(u)); }
function coinOutAt(c, t) { const u = (t - c.t0) / FLYOUT; if (u < 0 || u > 1) return null; const top = VTOP + 1.0;
  return bez([VLT[0] + c.hx, VFY + PH * 0.8, VLT[1] + c.hz], [VLT[0] + c.hx, top + c.h + 8, VLT[1] + c.hz + 4], [MK[0] + c.lx + 14, top + c.h, MK[1] + c.lz - 6], [MK[0] + c.lx * 0.5, 6.5, MK[1] + c.lz * 0.5], u); }
function setCoins(t) {
  let n = 0; for (const c of CIN) { const p = coinInAt(c, t); if (!p) continue; _e.set(t * c.sp + c.ph, c.ph, t * c.sp * 0.7); _q.setFromEuler(_e); _p.set(p[0], p[1], p[2]); _s.setScalar(1); _m4.compose(_p, _q, _s); coinsIn.setMatrixAt(n++, _m4); }
  coinsIn.count = n; coinsIn.instanceMatrix.needsUpdate = true;
  n = 0; for (const c of COUT) { const p = coinOutAt(c, t); if (!p) continue; _e.set(t * c.sp + c.ph, c.ph, t * c.sp * 0.7); _q.setFromEuler(_e); _p.set(p[0], p[1], p[2]); _s.setScalar(1); _m4.compose(_p, _q, _s); coinsOut.setMatrixAt(n++, _m4); }
  coinsOut.count = n; coinsOut.instanceMatrix.needsUpdate = true;
}

// ───────────────────────── street life, clouds, sparkles
const lampHeads = new GB();
for (const z of [-30, -48, -66]) for (const s of [-1, 1]) { const x = s * 44 - 6; const l = lamp(6.2); l.position.set(x, 0, z); l.rotation.y = s > 0 ? Math.PI : 0; scene.add(l); lampHeads.box(0.6, 0.12, 0.36, 0xFFFFFF, x - s * 1.25, 6.02, z); }
const lampM = new THREE.MeshLambertMaterial({ color: 0xFFF1C8, emissive: 0xFFD27A, emissiveIntensity: 0 }); scene.add(new THREE.Mesh(lampHeads.geo(), lampM));
for (const [x, z] of [[-32, -24], [30, -22], [-30, -74], [32, -74], [-58, -30], [52, -40], [-62, -90], [56, -100], [-24, -150], [24, -152], [42, -128], [-40, -134], [8, -20], [-18, -20]]) { const m = bushTree(5.5 + R() * 2, R); m.position.set(x, 0, z); scene.add(m); }
const CARS = [[0xC8423A, -6, 1, 9, 0], [0x2F6FB8, -2, -1, 10, 40], [0xE9C46A, -172, 1, 7, 150], [0x4C9A62, -168, -1, 8, 230], [0xEDEDED, -6, 1, 8.6, 300], [0x7A4FA0, -2, -1, 7, 90], [0xD9664A, -6, 1, 7.5, 520]].map(([col, z, dir, v, off]) => { const m = car(col, { boxy: true }); scene.add(m); return { m, z, dir, v, off }; });
const clouds = []; for (let i = 0; i < 18; i++) { const m = cloud(R); const far = i >= 10; m.position.set(far ? -500 + R() * 1100 : -260 + i * 60 + R() * 20, 80 + R() * 40, far ? -560 + R() * 200 : -340 + R() * 300); m.scale.setScalar(2.0 + R() * 2.2); m.userData.x0 = m.position.x; scene.add(m); clouds.push(m); }
const sparkT = (() => { const cv = document.createElement('canvas'); cv.width = cv.height = 64; const g = cv.getContext('2d'); g.translate(32, 32); g.fillStyle = '#fff'; for (let k = 0; k < 2; k++) { g.rotate(Math.PI / 2 * k); g.beginPath(); g.moveTo(0, -30); g.quadraticCurveTo(3, -3, 30, 0); g.quadraticCurveTo(3, 3, 0, 30); g.quadraticCurveTo(-3, 3, -30, 0); g.quadraticCurveTo(-3, -3, 0, -30); g.fill(); } const tx = new THREE.CanvasTexture(cv); tx.colorSpace = THREE.SRGBColorSpace; return tx; })();
const sparks = []; for (let i = 0; i < 90; i++) { const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: sparkT, color: 0xFFE9A8, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false })); sp.userData = { ph: R() * 6.28, w: 3 + R() * 4, dx: (R() - 0.5) * 2, dz: (R() - 0.5) * 2, k: R() }; scene.add(sp); sparks.push(sp); }

// ───────────────────────── camera path (spherical keys around a target; `up` tilts the view so the subject sits lower in the frame)
const CAM = [
  { t: 0, tg: [0, 10, -86], d: 102, az: -12, el: 7, up: 0.06 },                                    // the cover: the fund at sunset, a stream of people out of its glowing door
  { t: T.bigOut, tg: [0, 9.5, -85], d: 92, az: -9, el: 7, up: 0.05, mv: 1 },
  { t: T.door1 + 0.4, tg: [-2, 9, -84], d: 84, az: -4, el: 7, up: 0.05, mv: 1 },
  { t: T.fell + 0.3, tg: SCRW(), d: 44, az: 41, el: 4, up: 0.0, mv: 1 },                           // Saturday night: the price board dives
  { t: T.lowest + 0.3, tg: SCRW(-1.2), d: 38, az: 38, el: 3, up: 0.0, mv: 1 },
  { t: T.b3 + 0.2, tg: SCRW(-1.2), d: 37, az: 36, el: 3, up: 0.0 },
  { t: T.why + 0.1, tg: [0, 8, -82], d: 78, az: 12, el: 8, up: 0.03, mv: 1 },                       // back to the door: who is walking out?
  { t: T.fund4, tg: [0, 11, -86], d: 76, az: 6, el: 7, up: 0.03, mv: 1 },                           // morning: the fund, a share
  { t: T.stock + 0.2, tg: [0, 10, -86], d: 70, az: -4, el: 7, up: 0.03, mv: 1 },
  { t: T.behind + 0.3, tg: [6, 10, -128], d: 80, az: 52, el: 42, up: 0.0, mv: 1 },                 // crane up and round the east side...
  { t: T.vault5 + 0.3, tg: [0, 8, VLT[1]], d: 58, az: 66, el: 30, up: 0.02, mv: 1 },                 // ...to the glass vault behind it
  { t: T.leaves + 0.5, tg: [-20, 8, VLT[1] - 2], d: 100, az: 140, el: 34, up: 0.02, mv: 1 },        // bitcoin leaves the vault for the market
  { t: T.sold + 0.6, tg: [-22, 8, VLT[1] - 3], d: 94, az: 146, el: 32, up: 0.02 },
  { t: T.blackrock + 0.2, tg: [0, 4, -78], d: 92, az: -16, el: 11, up: 0.02, mv: 1 },               // Thursday: the rush out
  { t: T.half + 0.3, tg: [0, 4, -78], d: 84, az: -10, el: 10, up: 0.02 },
  { t: T.average + 0.2, tg: [AB[0], 1.5, AB[1]], d: 17, az: 75, el: 6, up: 0.0, mv: 1 },             // the average buyer
  { t: T.coin8 + 0.2, tg: [AB[0], 1.5, AB[1]], d: 15.5, az: 66, el: 6, up: 0.0 },
  { t: T.money + 0.5, tg: [AB[0], 1.6, AB[1]], d: 19, az: 56, el: 7, up: 0.0, mv: 1 },              // losing money: he slumps
  { t: T.back + 0.2, tg: SCRW(), d: 46, az: 41, el: 4, up: 0.0, mv: 1 },                            // Monday: the board climbs back
  { t: T.over + 0.4, tg: SCRW(0.5), d: 42, az: 38, el: 4, up: 0.0 },
  { t: T.opens + 0.3, tg: [0, 10, -82], d: 236, az: 12, el: 22, up: 0.12, mv: 3 },                  // crane up: the door opens both ways
  { t: T.cta - 0.3, tg: [0, 10, -82], d: 226, az: 9, el: 22, up: 0.12 },
  { t: T.hold12 + 0.2, tg: [0, 7, -84], d: 88, az: 4, el: 10, up: 0.06, mv: 1 },                    // down to the door: SELL or HOLD
  { t: DUR + 0.5, tg: [0, 7, -84], d: 82, az: 2, el: 10, up: 0.06 },
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
.card em{font-style:normal;color:#FFC84A;} .card s{text-decoration:none;color:#FF8A7A;} .card small{display:block;margin-top:8px;font:600 18px/1 'Inter',sans-serif;letter-spacing:.08em;color:rgba(255,255,255,.6);}
.card .big7{display:block;margin:8px 0 4px;font:800 76px/1 'JBM',monospace;letter-spacing:-3px;color:#FF6B5B;text-shadow:0 0 26px rgba(255,90,70,.45);}
.tag.dn{color:#fff;background:#D9483B;border-color:#D9483B;} .tag.dn b{color:#fff;} .tag.gn{color:#06240E;background:#7FE08A;border-color:#7FE08A;}
.stamp{font:900 60px/1 'Figtree',sans-serif;letter-spacing:.06em;color:#FF5A4A;border:6px solid #FF5A4A;padding:10px 22px 8px;border-radius:14px;background:rgba(40,6,4,.45);text-shadow:0 0 18px rgba(255,90,70,.6);}
.pay{width:740px;padding:26px 30px 22px;box-sizing:border-box;background:rgba(8,10,26,.9);border:2px solid rgba(255,225,160,.6);border-radius:30px;box-shadow:0 18px 50px rgba(5,7,20,.5);text-align:center;white-space:normal;}
.pay .t{font:700 22px/1 'Inter',sans-serif;letter-spacing:.26em;text-transform:uppercase;color:#FFD27A;}
.pay .r{display:flex;justify-content:space-around;align-items:flex-end;margin-top:20px;}
.pay .c .k{font:700 20px/1 'Inter',sans-serif;letter-spacing:.2em;text-transform:uppercase;color:rgba(255,255,255,.7);}
.pay .c .v{margin-top:12px;font:800 66px/1 'JBM',monospace;color:#FFC84A;letter-spacing:-2px;} .pay .c .v.r{color:#FF6B5B;}
.pay .ar{font:800 50px/1 'Figtree',sans-serif;color:rgba(255,255,255,.55);padding-bottom:8px;}
.pay .bar{margin:22px auto 0;height:28px;border-radius:14px;background:rgba(255,255,255,.1);display:flex;overflow:hidden;width:620px;}
.pay .fill{height:28px;background:#F7A600;} .pay .loss{height:28px;background:repeating-linear-gradient(45deg,#D9483B 0 12px,#B3342A 12px 24px);}
.pay .lb{display:inline-block;margin-top:16px;font:800 26px/1 'Inter',sans-serif;letter-spacing:.08em;color:#fff;background:#D9483B;padding:10px 18px;border-radius:12px;}
.pay .s{margin-top:14px;font:500 17px/1.35 'Inter',sans-serif;color:rgba(255,255,255,.6);}
`; document.head.appendChild(st); }
const ui = document.getElementById('ui'); const _v = new THREE.Vector3();
function proj(x, y, z) { _v.set(x, y, z).project(camera); return [(_v.x * 0.5 + 0.5) * W, (-_v.y * 0.5 + 0.5) * H, _v.z < 1]; }
function mk_(cls, html = '') { const e = document.createElement('div'); e.className = 'abs ' + cls; e.innerHTML = html; e.style.opacity = 0; ui.appendChild(e); return e; }
function put(e, x, y, o = 1, sc = 1, ax = '-50%', ay = '-50%') { e.style.opacity = o.toFixed(3); if (o <= 0.001) return; e.style.transform = `translate(${x.toFixed(1)}px,${y.toFixed(1)}px) translate(${ax},${ay}) scale(${sc.toFixed(3)})`; }
const pop = (t, t0, d = 0.32) => t < t0 ? 0 : 0.82 + 0.18 * back(seg(t, t0, t0 + d));
const clampX = (x, m = 200) => Math.min(W - m, Math.max(m, x));
const clampY = (y, a = 600, b = 1450) => Math.min(b, Math.max(a, y));
const chunks = [];
{
  let clause = []; let si = 0;
  const flush = () => { const n = clause.length; if (!n) return; const k = Math.ceil(n / 3); let i = 0; for (let c = 0; c < k; c++) { const size = Math.ceil((n - i) / (k - c)); chunks.push({ ws: clause.slice(i, i + size) }); i += size; } clause = []; };
  for (const w of TIM.words) { if (TIM.hook && w.si === 1 && w.s < (TIM.big ? T.bigOut + 0.1 : 1e9)) continue; if (w.si !== si) { flush(); si = w.si; } clause.push(w); if (/[.,?!:]$/.test(w.t)) flush(); }
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
const HK = TIM.hook, hookEl = HK ? mk_('hook', `<div class="n">${HK.lines.map(l => l.replace(/\*([^*]+)\*/g, '<em>$1</em>')).join('\n')}</div>` + (HK.sub ? `<div class="s">${HK.sub}</div>` : '')) : null;
function fitHook() { if (!hookEl) return; const n = hookEl.querySelector('.n'), w = n.scrollWidth; if (w > 940) n.style.fontSize = (112 * 940 / w).toFixed(1) + 'px'; if (bigEl) { const v = bigEl.querySelector('.v'), bw = v.scrollWidth; if (bw > 960) v.style.fontSize = (172 * 960 / bw).toFixed(1) + 'px'; } }
// big number: 1.5-3 s, the most shocking number of the story counting up over a dark screen, a chart line diving (or climbing) behind it
const BG = TIM.big, bigBg = BG ? mk_('bigbg', '') : null, bigEl = BG ? mk_('big' + (/^[^\d]*[−-]/.test(BG.value) || BG.dir === 'down' ? '' : ' up'), '') : null, BIGN = {};
if (BG) { const m = BG.value.match(/^([^\d]*)(\d[\d,]*(?:\.\d+)?)(.*)$/) || ['', '', '0', BG.value]; Object.assign(BIGN, { pre: m[1], num: parseFloat(m[2].replace(/,/g, '')), dec: (m[2].split('.')[1] || '').length, comma: m[2].includes(','), post: m[3] });
  const down = !bigEl.classList.contains('up'), pts = (down ? [[0, 20], [90, 34], [160, 18], [240, 60], [320, 48], [420, 100], [520, 86], [620, 140], [760, 160]] : [[0, 160], [90, 140], [170, 150], [260, 104], [350, 116], [450, 66], [540, 80], [640, 30], [760, 12]]);
  BIGN.len = pts.slice(1).reduce((a, q, i) => a + Math.hypot(q[0] - pts[i][0], q[1] - pts[i][1]), 0);
  bigEl.innerHTML = `<svg width="760" height="170" viewBox="0 0 760 170"><polyline points="${pts.map(q => q.join(',')).join(' ')}" stroke-dasharray="${BIGN.len.toFixed(1)}"/></svg><div class="v"></div><div class="l">${BG.label || ''}</div>` + (BG.when ? `<div class="d">${BG.when}</div>` : '');
  BIGN.line = bigEl.querySelector('polyline'); BIGN.v = bigEl.querySelector('.v'); }
const bigText = u => { const x = BIGN.num * u; let n = x.toFixed(BIGN.dec); if (BIGN.comma) n = Number(n).toLocaleString('en-US', { minimumFractionDigits: BIGN.dec, maximumFractionDigits: BIGN.dec }); const unit = BIGN.post.trim(); return BIGN.pre + n + (unit ? (/^[A-Za-z]/.test(unit) ? `<small>${unit}</small>` : BIGN.post) : ''); };
const chip = mk_('chip', '');
const tagDoor = mk_('tag am', 'the front door'), tagOut = mk_('tag dn', 'money <b>out</b>'), tagIn = mk_('tag gn', 'money in');
const tagFund = mk_('tag', 'a spot bitcoin ETF'), tagShare = mk_('tag am', 'one fund share');
const tagReal = mk_('tag am', 'real bitcoin'), tagSold = mk_('tag dn', 'sold');
const stamp2y = mk_('stamp', 'LOWEST IN 2 YEARS');
const card7 = mk_('card', `BlackRock's bitcoin fund (IBIT)<span class="big7">−$541 MILLION</span>in one day: its biggest exit ever<small>Thu 19 Nov 2026 · Farside data via CryptoSlate, TFTC</small>`);
const pay = mk_('pay', `<div class="t">the average fund buyer</div><div class="r"><div class="c"><div class="k">paid</div><div class="v">$80K+</div></div><div class="ar">→</div><div class="c tc"><div class="k">23 Nov</div><div class="v r">$61K</div></div></div><div class="bar"><div class="fill" style="width:620px"></div><div class="loss" style="width:0px"></div></div><div class="lb">losing money</div><div class="s">cost estimates differ: $80,070–$84,000 (Bitfinex, CryptoETF.today, EdaFace · 18–22 Nov 2026)</div>`);
const payTc = pay.querySelector('.tc'), payFill = pay.querySelector('.fill'), payLoss = pay.querySelector('.loss'), payLb = pay.querySelector('.lb');
const tagBuyer = mk_('tag', 'one fund buyer');
const title = mk_('title', `<div class="s">THE STORY OF</div><div class="n">Bitcoin's\n<em>Front Door</em></div>`);
const lesson = mk_('lesson', `It opens <em>both ways</em>.`);
const ctaChip = mk_('chip am', 'what about you?');
const boxes = [0, 1].map(() => { const e = mk_('cbox', '<span class="in"></span><span class="post">Post</span>'); return { e, inn: e.querySelector('.in'), post: e.querySelector('.post') }; });
const foot = document.getElementById('foot');
foot.textContent = "Sources: Reuters, CoinDesk (21–23 Nov 2026) · Farside data via CryptoSlate, TFTC, StartupFortune\nThe Block (how fund flows work) · buyer cost: Bitfinex, CryptoETF.today, EdaFace · not advice";
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
  // the chip: one line at the top that says where and when we are
  let ct = '', co = 0, cp = 0;
  const CH = [[T.bigOut + 0.05, T.b2 - 0.1, 'US bitcoin funds · Nov 2026'], [T.b2 + 0.05, T.b3 - 0.1, 'Saturday · 21 Nov 2026'], [T.b3 + 0.05, T.b4 - 0.1, 'US bitcoin funds · Nov 2026'],
    [T.b4 + 0.05, T.b6 - 0.1, 'how a bitcoin fund works'], [T.b6 + 0.05, T.b7 - 0.1, 'when money leaves'], [T.b7 + 0.05, T.b8 - 0.1, 'Thursday · 19 Nov 2026'],
    [T.b8 + 0.05, T.b10 - 0.1, 'estimates · 18–22 Nov 2026'], [T.b10 + 0.05, T.b11 - 0.1, 'as of Mon 23 Nov 2026']];
  for (const [a, b, s] of CH) { const o = win(t, a, b, 0.22, 0.22); if (o > co) { co = o; ct = s; cp = pop(t, a); } }
  if (ct) setTxt(chip, ct); put(chip, W / 2, 472, co, cp);
  // 1 + 3 — the front door, money out
  { const p = p3([0, FLOORY + 10.4, DOORZ + 3], Math.max(win(t, T.door1 - 0.1, T.b2, 0.25, 0.25), win(t, T.why + 0.1, T.b4 + 0.2, 0.25, 0.25))); put(tagDoor, clampX(p[0]), clampY(p[1], 620, 1380), p[2], pop(t, t < T.b3 ? T.door1 - 0.1 : T.why + 0.1)); }
  { const p = p3([10, 6.5, STEPZ + 10], Math.max(win(t, T.out1, T.b2, 0.25, 0.25), win(t, T.why + 0.3, T.b4 - 0.1, 0.25, 0.25), win(t, T.exit - 0.2, T.b8 - 0.2, 0.25, 0.25))); put(tagOut, clampX(p[0], 240), clampY(p[1], 640, 1360), p[2], pop(t, t < T.b3 ? T.out1 : t < T.b7 ? T.why + 0.3 : T.exit - 0.2)); }
  // 2 — the low
  put(stamp2y, W / 2, 1395, win(t, T.lowest, T.b3 - 0.05, 0.2, 0.25), pop(t, T.lowest, 0.4) * (1 + 0.06 * win(t, T.lowest + 0.3, T.lowest + 0.6, 0.1, 0.2)));
  // 4–5 — a fund, a share, money in, real bitcoin in the vault
  { const p = p3([0, (1 + 11 - 1.3) * K - 3.4, FB[1] + 8.72 * K], win(t, T.fund4, T.b5, 0.25, 0.25)); put(tagFund, clampX(p[0]), clampY(p[1], 620, 1380), p[2], pop(t, T.fund4)); }
  { const p = p3([-6, 4.5, STEPZ + 4], win(t, T.share, T.b5 + 0.2, 0.25, 0.25)); put(tagShare, clampX(p[0], 240), clampY(p[1], 640, 1380), p[2], pop(t, T.share)); }
  { const p = p3([8, 4.0, STEPZ + 9], win(t, T.buy4, T.b5 - 0.1, 0.25, 0.25)); put(tagIn, clampX(p[0], 240), clampY(p[1], 640, 1380), p[2], pop(t, T.buy4)); }
  { const p = p3([VLT[0], VFY + PH + 5.5, VLT[1]], win(t, T.real, T.b6 + 0.4, 0.25, 0.25)); put(tagReal, clampX(p[0]), clampY(p[1], 620, 1380), p[2], pop(t, T.real)); }
  // 6 — sold at the market
  { const p = p3([MK[0], 13.5, MK[1]], win(t, T.sold - 0.1, T.b7 + 0.2, 0.2, 0.25)); put(tagSold, clampX(p[0], 220), clampY(p[1], 620, 1380), p[2], pop(t, T.sold - 0.1)); }
  // 7 — BlackRock's record day
  put(card7, W / 2, 1390, win(t, T.blackrock, T.b8 - 0.1, 0.25, 0.25), pop(t, T.blackrock) * (1 + 0.05 * win(t, T.half, T.half + 0.35, 0.1, 0.2)));
  // 8–9 — the average buyer: paid more than $80,000; on 23 Nov about $61,000
  { const p = p3([AB[0], 5.0, AB[1]], win(t, T.average, T.b9 - 0.05, 0.25, 0.2)); put(tagBuyer, clampX(p[0]), clampY(p[1], 620, 1040), p[2], pop(t, T.average)); }
  { const o = win(t, T.paid - 0.15, T.b10 - 0.1, 0.25, 0.25), u = eo(seg(t, T.losing - 0.2, T.money + 0.3)); payTc.style.opacity = seg(t, T.today - 0.1, T.today + 0.2).toFixed(3);
    payFill.style.width = (620 * (1 - 0.24 * u)).toFixed(1) + 'px'; payLoss.style.width = (620 * 0.24 * u).toFixed(1) + 'px'; payLb.style.opacity = seg(t, T.losing, T.losing + 0.25).toFixed(3);
    put(pay, W / 2, 1300, o, pop(t, T.paid - 0.15) * (1 + 0.05 * win(t, T.losing, T.losing + 0.35, 0.1, 0.2))); }
  // 11 — title and lesson; 12 — the question
  put(title, W / 2, 640, win(t, T.story, T.cta - 0.1, 0.4, 0.3), 0.94 + 0.06 * eo(seg(t, T.story, T.story + 0.6)));
  put(lesson, W / 2, 1180, win(t, T.opens - 0.1, T.cta - 0.15, 0.3, 0.25), pop(t, T.opens - 0.1));
  put(ctaChip, W / 2, 472, seg(t, T.would, T.would + 0.3), pop(t, T.would));
  [[T.SELLw, 'SELL', T.postA], [T.HOLDw, 'HOLD', T.postB]].forEach(([t0, word, tp], i) => {
    const bx = boxes[i], L = word.length, n = Math.min(L, Math.floor(c01((t - t0) / (0.12 * L)) * (L + 0.001))), typed = word.slice(0, n), caret = (n < L || Math.floor(t * 2.4) % 2) && t < tp ? '<i></i>' : '';
    setHTML(bx.inn, typed ? `<b>${typed}</b>${caret}` : `<em>Add a comment…</em>${caret}`); const sent = t > tp; const pc = sent ? 'post on sent' : n === L ? 'post on' : 'post'; if (bx.post.className !== pc) bx.post.className = pc; setTxt(bx.post, sent ? 'Posted ✓' : 'Post');
    const ts = i ? T.HOLDw - 0.35 : T.comment; put(bx.e, W / 2, 1330 + i * 132, seg(t, ts, ts + 0.3), pop(t, ts) * (1 + 0.06 * win(t, tp, tp + 0.3, 0.08, 0.2)));
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
  WIN_LIT.emissiveIntensity = Math.max(0, night * 1.05);
  lampM.emissiveIntensity = night * 1.4; lanternM.emissiveIntensity = 0.3 + night * 1.2;
  // the front door glows; brighter when people stream through it
  { const busy = Math.max(win(t, -1, T.b4 - 0.5, 0.1, 0.6), win(t, T.b7 - 0.2, T.b8, 0.4, 0.6), win(t, T.b11 - 0.5, DUR + 1, 0.4, 0.1)); doorGlowM.opacity = 0.55 + 0.3 * night + 0.15 * busy; spillM.opacity = 0.25 + 0.6 * night; }
  // the vault: the heap of coins grows with buyers, shrinks with sellers
  { const f = fillAt(t), k = 0.32 + 0.68 * Math.sqrt(f); mound.scale.set(PA * k, PH * Math.sqrt(f), PB * k);
    for (let i = 0; i < NPC; i++) { const c = PC[i], r2 = c.u * c.u + c.v * c.v, y = VFY + PH * Math.sqrt(f) * Math.sqrt(Math.max(0, 1 - r2)) + 0.05;
      _e.set(c.rx, c.ry, c.rz); _q.setFromEuler(_e); _p.set(VLT[0] + c.u * PA * k, y, VLT[1] + c.v * PB * k); _s.setScalar(1); _m4.compose(_p, _q, _s); pileCoins.setMatrixAt(i, _m4); }
    pileCoins.instanceMatrix.needsUpdate = true; }
  setCoins(t);
  drawScreen(t);
  // the crowd
  TRIPS.forEach((tr, i) => { const g = crowd[i], w = walkerAt(tr, t); if (!w) { g.visible = false; return; } g.visible = true;
    const edge = tr.dir > 0 ? seg(w[4], 0, 0.05) : seg(1 - w[4], 0, 0.05), fade = tr.dir > 0 ? 1 - seg(w[4], 0.9, 1) : 1 - seg(1 - w[4], 0.9, 1);
    g.position.set(w[0], w[1] + Math.abs(Math.sin(t * 8 + i)) * 0.09, w[2]); g.rotation.y = w[3]; g.scale.setScalar(Math.max(0.01, Math.min(edge, fade) * 0.4 + 0.6 * Math.min(1, Math.min(edge, fade) * 4))); });
  // the average buyer looks at the phone, then slumps
  { const sl = eo(seg(t, T.losing - 0.1, T.losing + 0.5)) * (1 - seg(t, T.b11, T.b11 + 0.8)); buyer.rotation.z = -0.16 * sl; buyer.position.y = hopY([T.p80 + 0.05], t, 0.18) - 0.06 * sl; buyer.rotation.y = -0.2 + 0.1 * Math.sin(t * 0.7);
    const show = win(t, T.paid - 0.4, T.b10, 0.2, 0.3); buyerCoin.visible = show > 0.01; buyerCoin.scale.setScalar(Math.max(0.01, show));
    buyerCoin.position.set(AB[0] + 0.3, 3.5 + 0.12 * Math.sin(t * 2.2) - 0.25 * sl, AB[1] + 1.3); buyerCoin.rotation.set(Math.PI / 2, 0, t * 1.6); }
  guards.forEach((m, i) => { m.position.y = hopY([T.leaves + 0.1 + i * 0.08], t, 0.25); m.rotation.y = -Math.PI / 2 + 0.5 * win(t, T.leaves, T.b7, 0.2, 0.4) * (i ? -1 : 1); });
  traders.forEach((m, i) => { m.position.y = hopY([T.sold + 0.1 + i * 0.1, T.billion7 + i * 0.1], t, 0.2); });
  // cars, clouds
  for (const c of CARS) { const L = 700, x = ((c.off + t * c.v) % L) - L / 2; c.m.position.set(c.dir * x, 0, c.z); c.m.rotation.y = c.dir > 0 ? 0 : Math.PI; }
  for (const c of clouds) { c.position.x = c.userData.x0 + t * 1.2; c.material.opacity = 0.9 - 0.5 * night; const k = lerp(1, 0.45, night); c.material.color.setRGB(lerp(s.hor[0], 1, 0.55) * k, lerp(s.hor[1], 1, 0.55) * k, lerp(s.hor[2], 1, 0.55) * k * 1.05); }
  // sparkles: over the vault when coins come in; at the market when coins are sold; the final question at the door
  { let k = 0; const put3 = (x, y, z, sz, on, col) => { const sp = sparks[k++]; if (!sp) return; const tw = Math.pow(Math.abs(Math.sin(t * sp.userData.w + sp.userData.ph)), 3); sp.position.set(x, y, z); sp.scale.setScalar(sz * (0.25 + tw)); sp.material.opacity = on * (0.3 + 0.7 * tw); sp.material.color.setHex(col); sp.visible = on > 0.01; };
    const s1 = win(t, T.inA + 0.8, T.b6, 0.3, 0.5); for (let i = 0; i < 22; i++) { const sp = sparks[i].userData; put3(VLT[0] + sp.dx * 9, VFY + PH + 1 + sp.k * 4, VLT[1] + sp.dz * 6, 3.0, s1, 0xFFE9A8); }
    const s2 = win(t, T.outA + 1.6, T.b8 - 0.5, 0.3, 0.5); for (let i = 22; i < 44; i++) { const sp = sparks[i].userData; put3(MK[0] + sp.dx * 5, 7 + sp.k * 4, MK[1] + sp.dz * 5, 2.6, s2, 0xFFB0A0); }
    const s3 = win(t, T.postA, DUR + 1, 0.4, 0.1); for (let i = 44; i < 62; i++) { const sp = sparks[i].userData, ph = (t * 0.35 + sp.k) % 1; put3(sp.dx * 6, FLOORY + 2 + ph * 9, DOORZ + 3 + sp.dz * 2, 1.6, s3 * Math.sin(ph * Math.PI), 0xFFE9A8); }
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
  typingA: [0, 1, 2, 3].map(i => +(T.SELLw + (i + 0.5) * 0.12).toFixed(3)), typingB: [0, 1, 2, 3].map(i => +(T.HOLDw + (i + 0.5) * 0.12).toFixed(3)),
  coinsIn: CIN.map(c => +(c.t0 + FLYIN).toFixed(3)), coinsOut: COUT.map(c => +c.t0.toFixed(3)), coinsSold: COUT.map(c => +(c.t0 + FLYOUT).toFixed(3)),
  postA: +T.postA.toFixed(3), postB: +T.postB.toFixed(3),
};
document.fonts.ready.then(() => Promise.all(['700 64px Figtree', '900 190px Fraunces', '800 30px JBM', '700 22px Inter', '700 78px Fraunces', '800 54px Figtree', '600 34px Figtree', '500 18px Inter', '900 128px JBM', '800 46px Inter', '900 150px Figtree', '900 112px Fraunces', '800 172px JBM', '700 34px Figtree', '800 92px JBM', '900 64px Figtree', '900 92px Fraunces', '900 78px Figtree', '900 120px Figtree', '700 26px Inter', '700 19px Inter', '800 38px JBM', '600 20px Inter'].map(f => document.fonts.load(f)))).then(() => { redrawSign(); fitHook(); scrKey = ''; renderAt(0); window.__ready = true; });
