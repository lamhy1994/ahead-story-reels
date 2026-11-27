// The 12-Second Trap — low-poly storybook scene (deterministic: window.renderAt(t) draws the frame for time t)
// April 2023: Ethereum "sandwich" trading robots lose about $25m in one block. Prosecutors say two MIT-educated brothers baited them, used a flaw
// in relay software (MEV-Boost) to see the block before it was sealed, and swapped the bait for their own sells, in about 12 seconds.
// Charged May 2024; mistrial Nov 2025 (the jury couldn't agree); Mon 16 Nov 2026 Judge Jessica Clarke acquits them: no material misrepresentation
// was proven, the question is "not whether ... right or moral". The case is closed. The world: a block station (every 12 s a block car is packed
// with waiting trades and sealed under a gantry), the robots, the brothers' desk, and the federal court across the plaza.
import * as THREE from 'three';
import { SKIN, MAT, GOLD, rng, GB, person, cloud, bushTree, tower, car, lamp, bank, balance, pedestal, conveyor, magnifier, BIGCOIN, WIN_LIT,
  robot, blockCar, rails, gantry, deskMonitors, CHAIR, gavelHead, gavelBlock } from './kit.js';

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
const R = rng(20261116);

// ───────────────────────── story clock (everything hangs off the narration)
const T = {
  hookEnd: TIM.big ? 1.5 : TIM.hook ? E(1) + 0.15 : 0,
  bigIn: TIM.big ? 1.5 : 0, bigOut: TIM.big ? 3.0 : 0,
  robots1: wt(1, 'robots') - 0.1, twelve1: wt(1, '12') - 0.1, seconds1: wt(1, 'seconds') - 0.1,
  b2: S(2) - 0.05, first2: wt(2, 'first') - 0.1, kind: wt(2, 'kind') - 0.1,
  b3: S(3) - 0.05, month: wt(3, 'month') - 0.1, judge3: wt(3, 'judge') - 0.1, cleared: wt(3, 'cleared') - 0.1,
  b4: S(4) - 0.05, millions: wt(4, 'millions') - 0.1, twelve4: wt(4, '12') - 0.1, walk: wt(4, 'walk') - 0.1, free: wt(4, 'free') - 0.1,
  b5: S(5) - 0.05, twelve5: wt(5, '12') - 0.1, ethereum: wt(5, 'Ethereum') - 0.1, packs: wt(5, 'packs') - 0.1, waiting: wt(5, 'waiting') - 0.1, newB: wt(5, 'new') - 0.1, block5: wt(5, 'block') - 0.1,
  b6: S(6) - 0.05, robot6: wt(6, 'Robot') - 0.1, spot: wt(6, 'spot') - 0.1, big6: wt(6, 'big') - 0.1, jump: wt(6, 'jump') - 0.1, before6: wt(6, 'before') - 0.1, sell6: wt(6, 'sell') - 0.1, after6: wt(6, 'after') - 0.1,
  b7: S(7) - 0.05, brothers: wt(7, 'brothers') - 0.1, studied: wt(7, 'studied') - 0.1, months: wt(7, 'months') - 0.1, fed: wt(7, 'fed') - 0.1, bait7: wt(7, 'bait') - 0.1,
  b8: S(8) - 0.05, software: wt(8, 'software') - 0.1, flaw: wt(8, 'flaw') - 0.1, peek: wt(8, 'peek') - 0.1, block8: wt(8, 'block') - 0.1, sealed: wt(8, 'sealed') - 0.1,
  b9: S(9) - 0.05, swapped: wt(9, 'swapped') - 0.1, sells: wt(9, 'sells') - 0.1, robots9: wt(9, "robots'") - 0.1, money9: wt(9, 'money') - 0.1, flowed: wt(9, 'flowed') - 0.1, them9: wt(9, 'them') - 0.1,
  b10: S(10) - 0.05, prosecutors: wt(10, 'Prosecutors') - 0.1, fraud: wt(10, 'fraud') - 0.1,
  b11: S(11) - 0.05, jury: wt(11, 'jury') - 0.1, agree: wt(11, 'agree') - 0.1,
  b12: S(12) - 0.05, clarke: wt(12, 'Clarke') - 0.1, lie: wt(12, 'lie') - 0.1, proven: wt(12, 'proven') - 0.1,
  b13: S(13) - 0.05, question: wt(13, 'question') - 0.1, right: wt(13, 'right') - 0.1, moral: wt(13, 'moral') - 0.1,
  b14: S(14) - 0.05, closed: wt(14, 'closed') - 0.1,
  b15: S(15) - 0.05, story: wt(15, 'story') - 0.15, trap: wt(15, 'trap') - 0.1, code: wt(15, 'code') - 0.1, fast: wt(15, 'fast') - 0.1, law: wt(15, 'law') - 0.1, slow: wt(15, 'slow') - 0.1,
  cta: S(16) - 0.1, crime0: wt(16, 'crime') - 0.1, fair0: wt(16, 'fair') - 0.1, comment: wt(16, 'Comment') - 0.15, crime: wt(16, 'crime', 1) - 0.2, fair: wt(16, 'fair', 1) - 0.1,
};
// the block clock: a car leaves the gantry every 12 s; the trap block is the one packed from "So the brothers…" to just after "…flowed to them"
const depOf = j => T.b7 - 0.1 + 12 * (j - 2);                          // departure of car j (any j)
T.dep = [0, 1, 2, 3, 4, 5].map(depOf);                                 // departures of cars 0..5 (car 3 is the trap block)
T.gavels = [T.cleared + 0.05, T.proven + 0.05, T.closed + 0.05];      // the gavel comes down
T.throwG = T.jump + 0.05; T.throwR = T.sell6 + 0.05;                   // the sandwich robot: buy just before, sell just after
T.baitT = [0, 1, 2].map(i => T.fed + 0.05 + i * 0.16);                 // the brothers throw three baits
T.biteT = [0, 1, 2].map(i => T.bait7 + 0.45 + i * 0.2);                // three robots bite (their buys go in front)
T.lidHalf = T.software - 0.1; T.glitch = T.flaw; T.lidUp = T.peek;     // the lid starts to come down, the flaw, the peek
T.swapOut = [0, 1, 2].map(i => T.swapped + 0.02 + i * 0.12);          // the baits fly out …
T.swapIn = [0, 1, 2].map(i => T.sells - 0.12 + i * 0.12);             // … and the brothers' sells drop in
T.flowA = T.money9 - 0.25; T.flowB = T.them9 + 0.35;                   // the robots' money flows to the brothers
T.trapSeal = T.them9 + 0.25;                                           // the trap block is sealed, then leaves at T.dep[3]
T.postA = T.crime + 0.85; T.postB = T.fair + 0.75;
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
  NIGHT: P(0x070B24, 0x141C4B, 0x30326A, 0x22265A, 0xB4C2FF, 2.0, 0x5567C4, 0x3A3048, 1.55, 1, 1, -35, 42, 0xFFF4D6, 30, 80, 560),
  GOLDEN: P(0x3C7FCB, 0xF2C58A, 0xFFD79A, 0xF6CF9A, 0xFFC878, 3.2, 0xE8D2B0, 0xA88A60, 1.5, 0, 0.12, -68, 20, 0xFFE0A0, 44, 100, 680),
  SUNSET: P(0x2E2F72, 0xE0707A, 0xFFB25E, 0xEE9A6A, 0xFF9050, 2.9, 0xB49AC8, 0x86685A, 1.45, 0.12, 0.6, -70, 11, 0xFFB060, 50, 90, 620),
  DUSK: P(0x141A4C, 0x4A3F86, 0xC06A78, 0x6A4A78, 0x93A4F4, 1.7, 0x5A62B0, 0x3A2A40, 1.2, 0.65, 0.92, -40, 36, 0xFFF4D6, 30, 80, 600),
};
const SKY = [[0, 'SUNSET'], [T.b2 + 0.3, 'SUNSET'], [T.b4 + 0.4, 'SUNSET'], [T.b5 + 0.2, 'NIGHT'], [T.b10 + 0.2, 'NIGHT'], [T.b10 + 1.0, 'GOLDEN'],
  [T.b14 + 0.2, 'GOLDEN'], [T.story + 0.8, 'SUNSET'], [T.cta + 0.5, 'DUSK'], [DUR + 2, 'DUSK']];
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
const signTex = (txt, bg, fg, w = 1024, h = 118, font = "800 66px Figtree") => textTex(w, h, (g, w, h) => { g.fillStyle = bg; g.fillRect(0, 0, w, h); g.fillStyle = fg; g.font = font; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(txt, w / 2, h / 2 + 4); });

// ───────────────────────── places
const LX = 4, SP = 7.6;                 // the loading spot under the gantry (track along x at z = 0); spacing of the block cars
const PY = 1.0;                         // platform top (south of the track)
const CS = -12, CE = 1.0, CZ = 5.6;     // the waiting line: a conveyor on the platform from x = CS to CE at z = CZ, top at y = PY + 1
const CY = PY + 1.0 + 0.65;             // a crate's centre on the conveyor
const RB = [[-11.0, 2.9], [-8.0, 2.9], [-5.0, 2.9], [-2.0, 2.9]];   // the trading robots (on the platform, facing +z)
const DK = [11.5, 8.4];                 // the brothers' desk (front toward +x: they look west at their screens, the line beyond)
const RING = [-12, -26], RR = 4.6, RH = 25;   // the 12-second ring clock on its pylon (faces +z)
const CT = [0, -112];                   // the federal court (faces +z)
const JB = [-15, -84], GV = [15, -84], SC = [0, -80];   // jury box, gavel, scales on the court plaza
const stat = [];

// ───────────────────────── ground, streets, plaza
const ground = new THREE.Mesh(new THREE.PlaneGeometry(2400, 2400).rotateX(-Math.PI / 2), new THREE.MeshLambertMaterial({ color: 0xC9C2AE })); ground.receiveShadow = true; scene.add(ground);
const flat = new GB();
flat.box(400, 0.05, 14, 0x5A5550, 0, 0.025, 0);                                                     // the rail bed
flat.box(9, 0.04, 400, 0x4A4E56, 58, 0.02, -60); flat.box(9, 0.04, 400, 0x4A4E56, -58, 0.021, -60);    // avenues
flat.box(520, 0.04, 9, 0x4A4E56, 0, 0.022, 30); flat.box(520, 0.04, 9, 0x4A4E56, 0, 0.023, -146);
for (const z of [30, -146]) for (let x = -250; x < 260; x += 6) flat.box(2.6, 0.05, 0.22, 0xF2EEE2, x, 0.045, z);
flat.box(84, 0.07, 66, 0xE6DFD0, 0, 0.035, -78);                                                     // the court plaza
for (let i = 0; i < 16; i++) flat.box(84, 0.075, 0.12, 0xD6CEBC, 0, 0.037, -109 + i * 4);
flat.box(12, 0.08, 66, 0xD9CFBA, 0, 0.042, -78);
for (const x of [-52, 52]) flat.box(14, 0.06, 60, 0x86AE6E, x, 0.03, -80);
flat.box(70, 0.06, 26, 0x8DAE74, 0, 0.03, -30);
{ const rr = rng(909); for (let i = 0; i < 50; i++) { const x = -260 + rr() * 520, z = -260 + rr() * 300; if (Math.abs(x) < 70 && z > -150 && z < 40) continue; flat.box(6 + rr() * 14, 0.06, 6 + rr() * 14, rr() < 0.5 ? 0x8DAE74 : 0x9DB884, x, 0.03, z); } }
const flatM = flat.mesh(); flatM.castShadow = false; scene.add(flatM);

// ───────────────────────── the city
const DEST = (x, z) => (Math.abs(x) < 62 && z > -150 && z < 130) || Math.abs(z) < 16 || Math.abs(z - 30) < 9 || Math.abs(z + 146) < 9 || Math.abs(x - 58) < 9 || Math.abs(x + 58) < 9;
{
  const tr = rng(2026), PAL = [[0xD9D3C6, 0x5E7F9A], [0x6D97AA, 0x3F6A80], [0xE4DED2, 0x4E7C93], [0xC9C2B4, 0x55748C], [0x8FB3C2, 0x426E86], [0xEFE9DC, 0x6A8AA4], [0xB7C4C9, 0x3E6378], [0xE8D9C0, 0x5A7A90]];
  for (let gx = -250; gx <= 250; gx += 22) for (let gz = -280; gz <= 110; gz += 22) {
    const x = gx + (tr() - .5) * 7, z = gz + (tr() - .5) * 7; if (DEST(x, z) || tr() < 0.12) continue;
    const dp = Math.hypot(x, z + 50), far = dp > 140, w = 9 + tr() * 7, d = 9 + tr() * 7;
    const nearCourt = Math.hypot(x - CT[0], z - CT[1]) < 80;
    const h = nearCourt ? 9 + tr() * 8 : dp < 90 ? 14 + tr() * 18 : 18 + tr() * (far ? 46 : 30);
    const pal = nearCourt ? [[0xEFE9DC, 0x6A8AA4], [0xE4DED2, 0x4E7C93], [0xE8D9C0, 0x5A7A90]][Math.floor(tr() * 3)] : PAL[Math.floor(tr() * PAL.length)];
    const g = tower(w, h, d, { rand: tr, color: pal[0], glass: pal[1], floor: far ? 4.2 : 3.4, litP: 0.6, crown: h > 46 && tr() < 0.5 });
    g.position.set(x, 0, z); g.rotation.y = (tr() < 0.5 ? 0 : Math.PI / 2); g.children.forEach(c => { c.castShadow = dp < 150; c.receiveShadow = true; }); scene.add(g);
    stat.push([x - Math.max(w, d) / 2, x + Math.max(w, d) / 2, z - Math.max(w, d) / 2, z + Math.max(w, d) / 2, h + 4, 'tower']);
  }
}

// ───────────────────────── the block station: rails, platform, the waiting line, the gantry, the ring clock, the sign
scene.add(rails(400, 2.8));
{ const b = new GB(); b.box(36, PY, 10.4, 0xBFB8AA, 0, PY / 2, 7.4); b.box(36, 0.12, 0.5, 0xF2B233, 0, PY + 0.02, 2.45);   // platform with a yellow edge line
  for (let x = -16; x <= 16; x += 8) b.box(0.5, 0.06, 10.2, 0xA9A294, x, PY + 0.03, 7.4);
  const m = b.mesh(); scene.add(m); stat.push([-18.5, 18.5, 2, 12.8, PY + 0.5, 'platform']); }
{ const cv = conveyor(CE - CS + 1.6); cv.position.set((CS + CE) / 2, PY, CZ); scene.add(cv); }
const beltStripes = []; { const m = new THREE.MeshBasicMaterial({ color: 0xF2B233, toneMapped: false }); for (let i = 0; i < 18; i++) { const s = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.03, 1.2), m); s.position.set(0, PY + 1.1, CZ); scene.add(s); beltStripes.push(s); } }
const gan = gantry(7.6, 7.4, { one: true }); gan.position.set(LX, 0, 0); scene.add(gan); stat.push([LX - 1.2, LX + 1.2, -4.6, 4.6, 8.8, 'gantry']);
const ganLightM = new THREE.MeshBasicMaterial({ color: 0x7FE8FF, toneMapped: false }); const ganLight = new THREE.Mesh(new THREE.BoxGeometry(1.64, 0.22, 7.0), ganLightM); ganLight.position.set(LX, 7.0, 0); scene.add(ganLight);
const ringPy = (() => { const b = new GB(); b.box(1.6, RH - RR - 0.4, 1.4, 0x3A4250, RING[0], (RH - RR - 0.4) / 2, RING[1]); b.box(3.4, 0.6, 3.0, 0x2A2E36, RING[0], 0.3, RING[1]); b.cyl(RR + 0.75, RR + 0.75, 0.9, 32, 0x2A2F3A, RING[0], RH, RING[1] - 0.3, Math.PI / 2, 0, 0); return b.mesh(); })();
scene.add(ringPy); stat.push([RING[0] - 5.5, RING[0] + 5.5, RING[1] - 2, RING[1] + 2, RH + RR + 1.5, 'ring']);
const ringFace = new THREE.Mesh(new THREE.CircleGeometry(RR - 0.9, 32), new THREE.MeshBasicMaterial({ color: 0x10142A, toneMapped: false })); ringFace.position.set(RING[0], RH, RING[1] + 0.2); scene.add(ringFace);
const ringNum = new THREE.Mesh(new THREE.PlaneGeometry(5.6, 2.8), new THREE.MeshBasicMaterial({ map: textTex(512, 256, (g, w, h) => { g.clearRect(0, 0, w, h); g.fillStyle = '#FFD27A'; g.font = "900 150px Figtree"; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('12 s', w / 2, h / 2 + 6); }), transparent: true, toneMapped: false, depthWrite: false, fog: false })); ringNum.position.set(RING[0], RH, RING[1] + 0.25); scene.add(ringNum);
const SEGN = 12, segG = new THREE.BoxGeometry(1.75, 0.85, 0.5), segM = new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false, fog: false });
const segs = new THREE.InstancedMesh(segG, segM, SEGN); segs.frustumCulled = false; scene.add(segs);
{ const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(); for (let i = 0; i < SEGN; i++) { const a = Math.PI / 2 - (i + 0.5) / SEGN * Math.PI * 2; q.setFromEuler(new THREE.Euler(0, 0, a + Math.PI / 2)); m4.compose(new THREE.Vector3(RING[0] + Math.cos(a) * RR, RH + Math.sin(a) * RR, RING[1] + 0.25), q, new THREE.Vector3(1, 1, 1)); segs.setMatrixAt(i, m4); segs.setColorAt(i, new THREE.Color(0x2A3050)); } segs.instanceMatrix.needsUpdate = true; }
const stSign = new THREE.Mesh(new THREE.PlaneGeometry(16, 1.9), new THREE.MeshBasicMaterial({ map: signTex('ETHEREUM · BLOCK STATION', '#1A1E3A', '#BFC8FF', 1280, 150, "800 76px Figtree"), toneMapped: false }));
{ const b = new GB(); for (const x of [9, 25]) b.box(0.5, 8.2, 0.5, 0x3A4250, x, 4.1, -6.5); b.box(17, 2.3, 0.6, 0x2A2E36, 17, 8.6, -6.7); scene.add(b.mesh()); stat.push([8, 26, -7.5, -5.5, 10, 'sign']); }
stSign.position.set(17, 8.6, -6.35); scene.add(stSign);
const lampHeads = new GB();
for (const x of [-18, -10, 14, 22]) { const l = lamp(6.4); l.position.set(x, 0, -4.2); l.rotation.y = -Math.PI / 2; scene.add(l); lampHeads.box(0.36, 0.12, 0.6, 0xFFFFFF, x, 6.22, -4.2 + 1.25); }
const lampM = new THREE.MeshLambertMaterial({ color: 0xFFF1C8, emissive: 0xFFD27A, emissiveIntensity: 0 }); scene.add(new THREE.Mesh(lampHeads.geo(), lampM));

// ───────────────────────── block cars (a train that moves one car length every 12 s) and their lids
const NCAR = 11, K0 = -3;               // cars k = -3 … 7; car k sits under the gantry between departures k-1 and k
const depFrac = t => { let p = 0; for (const d of T.dep) p += eio(seg(t, d, d + 1.4)); return p; };
const carX = (k, t) => LX + SP * (depFrac(t) - k);
const carFrameM = new THREE.MeshLambertMaterial({ vertexColors: true, emissive: 0x2A3AB0, emissiveIntensity: 0 });
const cars = []; for (let i = 0; i < NCAR; i++) { const k = K0 + i, m = blockCar(6.4, 3.4, 2.4, { frame: k === 3 ? 0xB07AF0 : 0x6B7BF0 }); m.material = carFrameM; scene.add(m); cars.push({ k, m }); }
const glassM = new THREE.MeshLambertMaterial({ color: 0xB8C4FF, emissive: 0x3A48C0, emissiveIntensity: 0.25, transparent: true, opacity: 0.16, depthWrite: false, side: THREE.DoubleSide });
const glassG = (() => { const b = new GB(); b.box(6.3, 2.3, 0.04, 0xFFFFFF, 0, 2.3, 1.68); b.box(6.3, 2.3, 0.04, 0xFFFFFF, 0, 2.3, -1.68); b.box(0.04, 2.3, 3.3, 0xFFFFFF, 3.18, 2.3, 0); b.box(0.04, 2.3, 3.3, 0xFFFFFF, -3.18, 2.3, 0); return b.geo(); })();
const glasses = cars.map(c => { const m = new THREE.Mesh(glassG, glassM); m.renderOrder = 2; scene.add(m); return m; });
const lidM = new THREE.MeshLambertMaterial({ color: 0x9AA6FF, emissive: 0x3A48C0, emissiveIntensity: 0.35 });
const lidG = (() => { const b = new GB(); b.box(6.7, 0.34, 3.7, 0xFFFFFF, 0, 0, 0); b.box(6.0, 0.18, 3.0, 0xDDE2FF, 0, 0.24, 0); b.box(1.6, 0.2, 1.6, 0xF2B233, 0, 0.36, 0); return b.geo(); })();
const lids = cars.map(c => { const m = new THREE.Mesh(lidG, lidM); m.castShadow = true; scene.add(m); return m; });
const LID_UP = 6.55, LID_DN = 1.06 + 2.4 + 0.2;
function lidY(k, t) {
  if (k === 3) {   // the trap block: halfway down, the flaw, back up for the peek, sealed only after the swap and the money
    const half = lerp(LID_UP, 4.9, eo(seg(t, T.lidHalf, T.lidHalf + 0.45))), up = eo(seg(t, T.lidUp, T.lidUp + 0.35)), dn = eio(seg(t, T.trapSeal, T.trapSeal + 0.4));
    const y = lerp(lerp(LID_UP, half, 1), LID_UP + 0.4, up); return lerp(y, LID_DN, dn) + (t > T.glitch && t < T.lidUp ? Math.sin(t * 60) * 0.12 : 0);
  }
  const d = T.dep[k] ?? (k < 0 ? -99 : 99); return lerp(LID_UP, LID_DN, eio(seg(t, d - 0.6, d - 0.15)));
}
const lidX = (k, t) => { const d = (k === 3 ? T.trapSeal + 0.05 : (T.dep[k] ?? (k < 0 ? -99 : 99)) - 0.4); return t < d ? LX : carX(k, t); };
const lidOn = (k, t) => k <= 0 || t > (T.dep[k - 1] ?? -99) + 1.2;
// the light from the open trap block (the peek) and the flaw's red flash
const beamM = new THREE.MeshBasicMaterial({ color: 0xFFF1C0, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false, side: THREE.DoubleSide });
const beam = new THREE.Mesh(new THREE.CylinderGeometry(4.2, 2.8, 9, 24, 1, true).translate(0, 4.5, 0), beamM); beam.position.set(LX, 3.4, 0); scene.add(beam);
const glitchM = new THREE.MeshBasicMaterial({ color: 0xFF4A3A, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false });
const glitch = new THREE.Mesh(new THREE.BoxGeometry(2.0, 1.4, 8.4), glitchM); glitch.position.set(LX, 7.9, 0); scene.add(glitch);
const mag = magnifier(); mag.scale.setScalar(1.25); mag.visible = false; scene.add(mag);

// ───────────────────────── crates (trades): normal, the big buy, the robots' buys and sells, the bait, the brothers' sells
const CRATEG = (() => { const b = new GB(); b.box(1.3, 1.3, 1.3, 0xFFFFFF, 0, 0, 0); b.box(1.34, 0.16, 1.34, 0xD6D6D6, 0, 0.36, 0); b.box(1.34, 0.16, 1.34, 0xD6D6D6, 0, -0.36, 0); return b.geo(); })();
const KINDS = {
  n: new THREE.MeshLambertMaterial({ vertexColors: true }),
  gold: GOLD,
  green: new THREE.MeshLambertMaterial({ color: 0x3FD27A, emissive: 0x0E6A30, emissiveIntensity: 0.45 }),
  red: new THREE.MeshLambertMaterial({ color: 0xF2584A, emissive: 0x8A1A10, emissiveIntensity: 0.45 }),
  bait: new THREE.MeshLambertMaterial({ color: 0xFF6FD8, emissive: 0xB0208A, emissiveIntensity: 0.7 }),
  sell: new THREE.MeshLambertMaterial({ color: 0xE8343A, emissive: 0x901018, emissiveIntensity: 0.6 }),
};
const CMESH = {}; for (const [k, m] of Object.entries(KINDS)) { const im = new THREE.InstancedMesh(CRATEG, m, 64); im.castShadow = true; im.frustumCulled = false; im.count = 0; scene.add(im); CMESH[k] = im; }
const NCOL = [0x5EC8E8, 0xE9EEF4, 0x8FA2FF, 0xF2B26A, 0x7FDCC0, 0xC9B6FF];
const SLX = [2.1, 0, -2.1], SLZ = [-0.8, 0.8];
const slotP = (k, s) => t => [carX(k, t) + SLX[s % 3], 1.06 + 0.66 + Math.floor(s / 6) * 1.32, SLZ[Math.floor(s / 3) % 2]];
const CRATES = [];   // { kind, col, path: [[t0, t1, from, to, arcH]], tA (appears), tZ (gone), sc }
const P3 = p => typeof p === 'function' ? p : () => p;
function addCrate(kind, col, path, tA, tZ = 1e9, sc = 1) { CRATES.push({ kind, col, path: path.map(([a, b, f, to, h]) => [a, b, P3(f), P3(to), h ?? 0]), tA, tZ, sc }); }
const VC = 2.6;   // conveyor speed (m/s)
function normalCrate(k, slot, tHop, col) { const t0 = tHop - (CE - CS) / VC; addCrate('n', col, [[t0, tHop, [CS, CY, CZ], [CE, CY, CZ], 0], [tHop, tHop + 0.55, [CE, CY, CZ], slotP(k, slot), 2.6]], t0); }
{ const rr = rng(4242);
  for (let k = K0; k <= 7; k++) {
    if (k === 3) continue;
    const a = depOf(k - 1) + 1.6, slots = k === 2 ? [0, 1, 2] : [0, 1, 2, 3, 4];
    const hops = k === 2 ? [T.packs + 0.1, T.waiting + 0.25, T.newB + 0.15] : slots.map((_, i) => a + 1.0 + i * 1.9 + rr() * 0.4);
    slots.forEach((s, i) => normalCrate(k, s, hops[i], NCOL[Math.floor(rr() * NCOL.length)]));
  }
}
// the sandwich (car 2): a big buy waits at the end of the line; the robot buys just before it and sells just after; all three go in
const SW = RB[2], SWH = [SW[0], PY + 2.4, SW[1]];
const goldAt = [CE - 1.3, CY, CZ], frontAt = [CE + 0.2, CY, CZ], behindAt = [CE - 2.8, CY, CZ];
addCrate('gold', 0, [[T.big6 - 0.5, T.big6 + 1.2, [CS + 3, CY, CZ], goldAt, 0], [T.after6 + 0.25, T.after6 + 0.75, goldAt, slotP(2, 4), 2.2]], T.big6 - 0.5, 1e9, 1.15);
addCrate('green', 0, [[T.throwG, T.throwG + 0.55, SWH, frontAt, 2.6], [T.after6 + 0.1, T.after6 + 0.6, frontAt, slotP(2, 3), 2.2]], T.throwG);
addCrate('red', 0, [[T.throwR, T.throwR + 0.55, SWH, behindAt, 2.6], [T.after6 + 0.4, T.after6 + 0.9, behindAt, slotP(2, 5), 2.2]], T.throwR);
// the trap block (car 3): three baits from the brothers' desk, three robots' buys in front of them; the baits fly out, the brothers' sells drop in
const DKH = [DK[0] + 0.6, PY + 2.5, DK[1]];
T.baitT.forEach((tb, i) => addCrate('bait', 0, [[tb, tb + 0.6, DKH, [CE - 1.0 - i * 1.6, CY, CZ], 3.2], [T.bait7 + 0.55 + i * 0.16, T.bait7 + 1.05 + i * 0.16, [CE - 1.0 - i * 1.6, CY, CZ], slotP(3, 3 + i), 2.4],
  [T.swapOut[i], T.swapOut[i] + 0.6, slotP(3, 3 + i), [DK[0] + 0.4, PY + 2.6, DK[1] - 1.2 + i * 1.2], 5.0]], tb, T.swapOut[i] + 0.6));
T.biteT.forEach((tb, i) => { const r = RB[i], h = [r[0], PY + 2.4, r[1]]; addCrate('green', 0, [[tb, tb + 0.6, h, slotP(3, i), 3.0]], tb); });
T.swapIn.forEach((ts, i) => addCrate('sell', 0, [[ts, ts + 0.6, [DK[0] + 0.4, PY + 2.6, DK[1] - 1.2 + i * 1.2], slotP(3, 3 + i), 5.0]], ts));
// coins: a few to the sandwich robot (the middle trader pays); the stream from the robots' buys to the brothers (the money flowed to them)
const COING = BIGCOIN(0.42, 0.13);
const coinMesh = new THREE.InstancedMesh(COING, GOLD, 160); coinMesh.castShadow = true; coinMesh.frustumCulled = false; coinMesh.count = 0; scene.add(coinMesh);
const COINS = [];
for (let i = 0; i < 6; i++) COINS.push({ t0: T.after6 - 0.05 + i * 0.07, d: 0.6, a: () => [CE - 1.3, CY + 0.8, CZ], b: () => [SW[0] + (i % 2 ? 0.4 : -0.4), PY + 2.3, SW[1] + 0.3], h: 2.2, sp: R() * 6 });
for (let i = 0; i < 110; i++) { const rr = rng(6100 + i), s = i % 3, t0 = T.flowA + (T.flowB - T.flowA - 0.8) * rr(); COINS.push({ t0, d: 0.8 + rr() * 0.25, a: t => { const p = slotP(3, s)(t); return [p[0] + (rr() - .5) * 0.2, p[1] + 0.7, p[2]]; }, b: () => [DK[0] + 0.3 + (rng(7100 + i)() - .5) * 0.8, PY + 1.3, DK[1] + (rng(7300 + i)() - .5) * 2.6], h: 2.2 + rr() * 1.3, sp: rr() * 6 }); }
const heapG = new THREE.ConeGeometry(1, 1, 8).translate(0, 0.5, 0), coinHeap = new THREE.Mesh(heapG, GOLD); coinHeap.position.set(DK[0] + 0.3, PY + 1.18, DK[1]); coinHeap.castShadow = true; scene.add(coinHeap);

// ───────────────────────── the robots and the brothers' desk
const eyeMs = RB.map(() => new THREE.MeshBasicMaterial({ color: 0x7FE8FF, toneMapped: false }));
const robots = RB.map(([x, z], i) => { const m = robot({ eyeMat: eyeMs[i], body: [0xB8C0CC, 0xC9CED8, 0xA8B4C4, 0xBFC6D2][i], acc: [0xE0A23A, 0x3FC8B4, 0xE0A23A, 0x8C93E6][i] }); m.position.set(x, PY, z); m.rotation.y = -Math.PI / 2 + 0.45; m.scale.setScalar(1.15); scene.add(m); return m; });
stat.push([-12.5, -0.6, 2.0, 4.0, PY + 3.5, 'robots']);
const desk = deskMonitors(); desk.position.set(DK[0], PY, DK[1]); desk.rotation.y = Math.PI / 2; desk.scale.setScalar(1.1); scene.add(desk);
const modern = (i, extra = {}) => ({ robe: [0x34405A, 0x6A2E3E, 0x3F6A5A, 0x5A5A66, 0x7A5A3A, 0x2F4A6A, 0x8A3A3A, 0x3B6FA8, 0xB0603A, 0x4E7A3E][i % 10], skin: SKIN[i % 5], short: [0x231C18, 0x5A3E28, 0xC9A27A, 0x3A2A1E, 0x8A8A8A][i % 5], shirt: i % 2 ? 0xF4F2EC : undefined, ...extra });
const bros = [0, 1].map(i => { const m = person({ robe: [0x2B3346, 0x3A3046][i], skin: SKIN[[3, 2][i]], short: [0x2A1E16, 0x3A2A1E][i], s: 1.15 }); m.position.set(DK[0] + 1.5, PY, DK[1] + (i ? 0.8 : -0.8)); m.rotation.y = Math.PI; scene.add(m); return m; });
stat.push([DK[0] - 1.2, DK[0] + 2.4, DK[1] - 2.4, DK[1] + 2.4, PY + 3.2, 'desk']);
const travelers = [[-15, 8.4, 8, 0], [16, 4.8, -4, 0], [-14, 10.8, 6, 0], [15, 11.0, 0, -2.5]].map(([x, z, dx, dz], i) => { const m = person(modern(i + 2, { badge: i % 2 === 0 })); m.position.set(x, PY, z); scene.add(m); return { m, a: [x, z], b: [x + dx, z + dz], sp: 0.05 + i * 0.012, ph: i * 0.31 }; });

// ───────────────────────── the court: the building, the jury box, the gavel, the scales
const court = bank(); court.position.set(CT[0], 0, CT[1]); court.scale.setScalar(1.25); court.children.forEach(c => { c.castShadow = true; c.receiveShadow = true; }); scene.add(court); stat.push([CT[0] - 17, CT[0] + 17, CT[1] - 11, CT[1] + 15, 23, 'court']);
const courtSign = new THREE.Mesh(new THREE.PlaneGeometry(17.5, 2.0), new THREE.MeshBasicMaterial({ map: signTex('UNITED STATES COURT', '#E9E1CF', '#4A3A2A'), toneMapped: false }));
courtSign.position.set(CT[0], court.userData.signY * 1.25, CT[1] + court.userData.signZ * 1.25 + 0.05); scene.add(courtSign);
for (const [x, z] of [[-30, -100], [-30, -86], [-30, -72], [30, -100], [30, -86], [30, -72], [-40, -60], [40, -60], [-44, -110], [44, -110]]) { const m = bushTree(6 + R() * 2, R); m.position.set(x, 0, z); scene.add(m); }
{ const tr = rng(311); for (const [x, z, w, h, d] of [[-34, -128, 16, 10, 14], [34, -128, 16, 11, 14], [-40, -40, 14, 9, 12], [40, -40, 14, 9, 12]]) { const g = tower(w, h, d, { rand: tr, color: 0xF0EBDF, glass: 0x6A8AA4, floor: 3.4, litP: 0.6, bare: true }); g.position.set(x, 0, z); scene.add(g); stat.push([x - w / 2 - 1, x + w / 2 + 1, z - d / 2 - 1, z + d / 2 + 1, h + 3, 'white']); } }
for (const z of [-96, -80, -64]) for (const s of [-1, 1]) { const l = lamp(6.2); l.position.set(s * 24, 0, z); l.rotation.y = s > 0 ? Math.PI : 0; scene.add(l); }
// jury box: a low stand, two rows of six chairs facing +z, a juror in each
{ const b = new GB(); b.box(11, 0.6, 5.4, 0x8A5A34, JB[0], 0.3, JB[1]); b.box(11, 0.6, 2.6, 0x7A4E2C, JB[0], 0.9, JB[1] - 1.4); b.box(11.2, 1.2, 0.3, 0x6B4A30, JB[0], 1.2, JB[1] + 2.75); scene.add(b.mesh()); stat.push([JB[0] - 6, JB[0] + 6, JB[1] - 3.2, JB[1] + 3.2, 5, 'jury']); }
const chairM = new THREE.MeshLambertMaterial({ vertexColors: true }), chairs = new THREE.InstancedMesh(CHAIR, chairM, 12); chairs.castShadow = true; scene.add(chairs);
const JUR = []; for (let i = 0; i < 12; i++) { const row = Math.floor(i / 6), x = JB[0] - 4.5 + (i % 6) * 1.8, z = JB[1] + (row ? -1.4 : 1.2), y = row ? 1.2 : 0.6; JUR.push({ x, y, z, side: (i * 7) % 12 < 6 ? 1 : -1 });
  const m4 = new THREE.Matrix4().compose(new THREE.Vector3(x, y, z), new THREE.Quaternion().setFromEuler(new THREE.Euler(0, -Math.PI / 2, 0)), new THREE.Vector3(0.95, 0.8, 0.95)); chairs.setMatrixAt(i, m4); chairs.setColorAt(i, new THREE.Color(0x8A6A4A));
  const p = person(modern(i, { s: 1.0 })); p.position.set(x, y + 0.42, z + 0.1); p.rotation.y = -Math.PI / 2; p.scale.set(1.05, 0.95, 1.05); scene.add(p); JUR[i].p = p; }
const gBlock = gavelBlock(1.0); gBlock.position.set(GV[0], 0, GV[1]); scene.add(gBlock); stat.push([GV[0] - 4, GV[0] + 4, GV[1] - 4, GV[1] + 4, 14, 'gavel']);
const gavel = gavelHead(1.0); gavel.position.set(GV[0], 4.0, GV[1]); gavel.rotation.y = 0.5; scene.add(gavel);
const scales = balance(1.25); scales.position.set(SC[0], 1.3, SC[1]); scene.add(scales);
{ const b = new GB(); b.cyl(2.4, 2.7, 1.3, 16, 0xD6CEBC, SC[0], 0.65, SC[1]); scene.add(b.mesh()); stat.push([SC[0] - 6, SC[0] + 6, SC[1] - 3, SC[1] + 3, 11, 'scales']); }
const panTags = [['CRIME', '#F2584A'], ['FAIR', '#3FD27A']].map(([txt, col]) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 1.1), new THREE.MeshBasicMaterial({ map: signTex(txt, 'rgba(8,10,26,0.88)', col, 512, 160, "900 104px Figtree"), transparent: true, toneMapped: false, depthWrite: false })); m.visible = false; scene.add(m); return m; });

// ───────────────────────── clouds, sparkles
const clouds = []; for (let i = 0; i < 18; i++) { const m = cloud(R); const far = i >= 10; m.position.set(far ? -500 + R() * 1100 : -260 + i * 60 + R() * 20, 80 + R() * 40, far ? -560 + R() * 200 : -340 + R() * 300); m.scale.setScalar(2.0 + R() * 2.2); m.userData.x0 = m.position.x; scene.add(m); clouds.push(m); }
const sparkT = (() => { const cv = document.createElement('canvas'); cv.width = cv.height = 64; const g = cv.getContext('2d'); g.translate(32, 32); g.fillStyle = '#fff'; for (let k = 0; k < 2; k++) { g.rotate(Math.PI / 2 * k); g.beginPath(); g.moveTo(0, -30); g.quadraticCurveTo(3, -3, 30, 0); g.quadraticCurveTo(3, 3, 0, 30); g.quadraticCurveTo(-3, 3, -30, 0); g.quadraticCurveTo(-3, -3, 0, -30); g.fill(); } const tx = new THREE.CanvasTexture(cv); tx.colorSpace = THREE.SRGBColorSpace; return tx; })();
const sparks = []; for (let i = 0; i < 80; i++) { const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: sparkT, color: 0xFFE9A8, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false })); sp.userData = { ph: R() * 6.28, w: 3 + R() * 4, dx: (R() - 0.5) * 2, dz: (R() - 0.5) * 2, k: R() }; scene.add(sp); sparks.push(sp); }

// ───────────────────────── camera path (spherical keys around a target; `up` tilts the view so the subject sits lower in the frame)
const CAM = [
  { t: 0, tg: [-0.5, 3.0, 2], d: 40, az: 30, el: 8, up: 0.13 },                                         // the cover: the block station at sunset
  { t: T.bigOut, tg: [-1.0, 3.0, 2], d: 37, az: 28, el: 8, up: 0.12, mv: 1 },
  { t: T.robots1 + 0.5, tg: [-6.5, 3.4, 3], d: 30, az: 22, el: 10, up: 0.06, mv: 1 },                  // the trading robots
  { t: T.b2 - 0.1, tg: [-7, 9.0, -9], d: 50, az: 18, el: 9, up: 0.07, mv: 1 },                         // the ring clock comes round
  { t: T.first2 + 0.3, tg: [0, 14, -50], d: 120, az: 10, el: 24, up: 0.05, mv: 1 },                    // crane up over the station: the court across the plaza
  { t: T.cleared - 0.3, tg: [3, 8, -90], d: 78, az: 5, el: 13, up: 0.06, mv: 1 },                      // the court, the gavel comes down
  { t: T.b4 + 0.4, tg: [3, 8, -90], d: 74, az: 7, el: 13, up: 0.06 },
  { t: T.twelve4 + 0.2, tg: [RING[0] + 2, RH - 4, RING[1] + 4], d: 46, az: 22, el: 5, up: 0.03, mv: 1 },     // back down to the ring clock
  { t: T.free + 0.6, tg: [RING[0] + 2, RH - 4.5, RING[1] + 4], d: 42, az: 28, el: 4, up: 0.03 },
  { t: T.ethereum + 0.3, tg: [-2, 3.2, 2], d: 36, az: 26, el: 18, up: 0.05, mv: 1 },                    // the station: the line, the car, the gantry
  { t: T.block5 + 0.3, tg: [2.5, 2.9, 1.5], d: 28, az: 30, el: 16, up: 0.05, mv: 1 },
  { t: T.robot6 + 0.4, tg: [-6.5, 3.2, 4], d: 24, az: 20, el: 11, up: 0.05, mv: 1 },                    // the robots and the waiting line
  { t: T.before6 + 0.2, tg: [-3, 3.0, 4.4], d: 22, az: 24, el: 13, up: 0.05, mv: 1 },
  { t: T.after6 + 0.6, tg: [1.5, 2.8, 2.6], d: 24, az: 30, el: 16, up: 0.05, mv: 1 },                   // the sandwich goes into the block
  { t: T.brothers + 0.2, tg: [DK[0] - 1, 3.0, DK[1] - 0.5], d: 15, az: 70, el: 14, up: 0.04, mv: 1 },   // over the brothers' shoulders: their screens, the line beyond
  { t: T.months + 0.6, tg: [DK[0] - 1.5, 3.0, DK[1] - 0.8], d: 16, az: 62, el: 15, up: 0.04 },
  { t: T.bait7 + 0.3, tg: [-2.5, 3.0, 4.5], d: 30, az: 40, el: 18, up: 0.05, mv: 1 },                   // the bait goes into the line; the robots bite
  { t: T.flaw + 0.1, tg: [LX - 0.5, 4.4, 1], d: 22, az: 30, el: 22, up: 0.04, mv: 1 },                  // the gantry: the flaw, the peek
  { t: T.sealed + 0.3, tg: [LX, 4.2, 0.5], d: 19, az: 20, el: 30, up: 0.03, mv: 1 },
  { t: T.sells + 0.6, tg: [6, 4.0, 4], d: 32, az: 40, el: 22, up: 0.04, mv: 1 },                        // the swap and the money: car → desk
  { t: T.them9 + 0.4, tg: [5, 4.0, 3.5], d: 36, az: 34, el: 20, up: 0.04, mv: 1 },
  { t: T.b10 + 0.45, tg: [0, 70, -35], d: 40, az: 20, el: -38, up: 0, mv: 1 },                          // sky wipe: up into the sky …
  { t: T.b10 + 1.05, tg: [2, 8, -88], d: 74, az: 4, el: 12, up: 0.06, mv: 1 },                          // … and down on the court
  { t: T.jury - 0.05, tg: [JB[0], 3.2, JB[1]], d: 22, az: -10, el: 13, up: 0.05, mv: 1 },              // the jury box
  { t: T.agree + 0.6, tg: [JB[0], 3.2, JB[1]], d: 20, az: -4, el: 13, up: 0.05 },
  { t: T.clarke + 0.1, tg: [GV[0] - 2, 5.6, GV[1]], d: 32, az: 14, el: 11, up: 0.05, mv: 1 },          // the gavel
  { t: T.proven + 0.5, tg: [GV[0] - 2, 5.6, GV[1]], d: 30, az: 8, el: 11, up: 0.05 },
  { t: T.question + 0.3, tg: [SC[0], 7.4, SC[1]], d: 36, az: 2, el: 9, up: 0.05, mv: 1 },              // the scales
  { t: T.moral + 0.5, tg: [SC[0], 7.4, SC[1]], d: 33, az: -4, el: 9, up: 0.05 },
  { t: T.closed + 0.2, tg: [CT[0], 9, CT[1] + 12], d: 60, az: 0, el: 8, up: 0.06, mv: 1 },             // the court: case closed
  { t: T.story + 0.9, tg: [0, 8, -50], d: 170, az: 14, el: 17, up: 0.05, mv: 1 },                       // wide: the court and the station at sunset
  { t: T.cta - 0.2, tg: [0, 8, -52], d: 160, az: 16, el: 17, up: 0.05 },
  { t: T.comment, tg: [SC[0], 7.6, SC[1]], d: 44, az: 0, el: 10, up: 0.07, mv: 1 },                     // the scales for the question
  { t: DUR + 0.5, tg: [SC[0], 7.6, SC[1]], d: 41, az: 3, el: 10, up: 0.07 },
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
.card em{font-style:normal;color:#FFC84A;} .card s{text-decoration:none;color:#FF8A7A;} .card u{text-decoration:none;color:#7FE8A8;} .card small{display:block;margin-top:8px;font:600 18px/1 'Inter',sans-serif;letter-spacing:.08em;color:rgba(255,255,255,.6);}
.tag.grn{color:#062A12;background:#3FD27A;border-color:#3FD27A;} .tag.red{color:#fff;background:#E8433A;border-color:#E8433A;} .tag.pink{color:#fff;background:#D93FA8;border-color:#D93FA8;} .tag.gold{color:#2A1A00;background:#F7B500;border-color:#F7B500;} .tag.blue{color:#fff;background:#5A6CF0;border-color:#5A6CF0;}
.stamp{font:900 64px/1 'Figtree',sans-serif;letter-spacing:.06em;color:#FF5A4A;border:6px solid #FF5A4A;padding:8px 22px 6px;border-radius:14px;background:rgba(40,6,4,.35);text-shadow:0 0 18px rgba(255,90,70,.6);}
.stamp.am{color:#FFC84A;border-color:#FFC84A;background:rgba(40,28,4,.4);text-shadow:0 0 18px rgba(255,200,80,.6);}
.cnt{text-align:center;background:rgba(8,10,26,.9);border:2px solid rgba(255,225,160,.65);padding:22px 40px 20px;border-radius:26px;box-shadow:0 14px 40px rgba(5,7,20,.5);}
.cnt .v{font:800 96px/1 'JBM',monospace;letter-spacing:-3px;color:#FFC84A;} .cnt .l{margin-top:12px;font:700 30px/1.25 'Figtree',sans-serif;color:#fff;white-space:pre;} .cnt .s{margin-top:12px;font:600 18px/1 'Inter',sans-serif;letter-spacing:.08em;color:rgba(255,255,255,.6);}
.quote{max-width:900px;} .quote .q{white-space:pre;font-size:42px;}
.lesson small{display:block;margin-top:12px;font:600 20px/1 'Inter',sans-serif;letter-spacing:.1em;color:rgba(255,255,255,.62);}
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
const tagRobots = mk('tag', 'trading <b>robots</b>'), tagRing = mk('tag am', 'a new block every <b>12 s</b>');
const cardFirst = mk('card', `the US government's <em>first</em>\ncriminal case of its kind\n<small>US JUSTICE DEPT · MAY 2024 · COINDESK</small>`);
const tagCleared = mk('tag am', 'cleared · <b>all 3</b> charges');
const tagLine = mk('tag', 'waiting trades'), tagBlock = mk('tag blue', 'a <b>block</b>');
const tagBig = mk('tag gold', 'a big buy'), tagFront = mk('tag grn', 'robot buys first'), tagBehind = mk('tag red', 'then sells to it'), tagSand = mk('tag am', 'a “sandwich”');
const nameBro = mk('name', '<div class="n" style="font-size:54px">Anton &amp; James Peraire-Bueno</div><div class="r">MIT-educated brothers · charged May 2024</div>');
const tagMonths = mk('tag', 'months of planning · <b>per prosecutors</b>'), tagBait = mk('tag pink', 'bait');
const tagFlaw = mk('tag red', 'a flaw in relay software'), tagPeek = mk('tag am', 'a peek <b>before</b> the seal');
const tagSwap = mk('tag pink', 'bait <b>→</b> sells');
const cnt25 = mk('cnt', `<div class="v"></div><div class="l">from the robots' buys\nto the brothers</div><div class="s">ABOUT $25M · PROSECUTORS · THE BLOCK · REUTERS</div>`); const cnt25v = cnt25.querySelector('.v');
const cardCharge = mk('card', `charged May 2024: <em>wire fraud</em>,\nconspiracy, money laundering\n<small>UP TO 20 YEARS EACH · US JUSTICE DEPT</small>`);
const tagFraud = mk('tag red', 'prosecutors: <b>fraud</b>');
const tagJury = mk('tag grey', 'mistrial · <b>Nov 2025</b>');
const qLie = mk('quote', `<div class="q">“The Government failed to prove\nthat the Peraire-Buenos made\nany <em>material misrepresentations</em>”</div><div class="s">Judge Jessica Clarke · 16 Nov 2026</div>`);
const qMoral = mk('quote', `<div class="q">“The question before the court\nis <em>not</em> whether the Peraire-Buenos'\nconduct was <em>right or moral</em>”</div><div class="s">Judge Jessica Clarke · 16 Nov 2026</div>`);
const cardTerms = mk('card', `Ethereum: “a trustless, highly adversarial\nenvironment with <em>no terms of use</em>”\n<small>THE RULING, VIA COINDESK · DECRYPT</small>`);
const stampClosed = mk('stamp am', 'CASE CLOSED');
const title = mk('title', '<div class="s">THE STORY OF</div><div class="n">The 12-Second\n<em>Trap</em></div>');
const lesson = mk('lesson', `Code is <em>fast</em>. The law is <em>slow</em>.<small>12 SECONDS · APR 2023 → NOV 2026</small>`);
const ctaChip = mk('chip am', 'what do you think?');
const boxes = [0, 1].map(() => { const e = mk('cbox', '<span class="in"></span><span class="post">Post</span>'); return { e, inn: e.querySelector('.in'), post: e.querySelector('.post') }; });
const foot = document.getElementById('foot');
foot.textContent = "Sources: US Justice Dept (May 2024) · Reuters, Bloomberg, The Block, CoinDesk, Decrypt (Nov 2025; 16–18 Nov 2026)\nThe trades as described by prosecutors and the court · the brothers were acquitted · not advice";
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
  const CH = [[T.bigOut + 0.05, T.b2 - 0.1, 'Ethereum · April 2023'], [T.month - 0.1, T.b4 - 0.1, '16 Nov 2026 · federal court, Manhattan'], [T.b5 + 0.05, T.b6 - 0.1, 'how Ethereum works'],
    [T.b6 + 0.05, T.b7 - 0.1, 'robot traders'], [T.b7 + 0.05, T.b8 - 0.1, 'Ethereum · April 2023'], [T.b8 + 0.05, T.b10 - 0.1, 'TRAP_TIMER'], [T.b10 + 0.4, T.b12 - 0.1, 'Manhattan federal court'],
    [T.b12 + 0.05, T.b14 - 0.1, 'the ruling · 16 Nov 2026'], [T.closed - 0.05, T.story - 0.1, 'no second trial']];
  for (const [a, b, s] of CH) { const o = win(t, a, b, 0.22, 0.22); if (o > co) { co = o; ct = s; cp = pop(t, a); } }
  if (ct === 'TRAP_TIMER') ct = `one block · ${Math.min(12, Math.max(1, Math.ceil(t - T.dep[2])))} s of 12`;
  if (ct) setTxt(chip, ct); put(chip, W / 2, 472, co, cp);
  // 1 — robots; the ring clock
  { const p = p3([RB[1][0] + 1.6, PY + 4.6, RB[1][1]], win(t, T.robots1, T.b2 - 0.1, 0.25, 0.25)); put(tagRobots, clampX(p[0], 220), clampY(p[1], 620, 1300), p[2], pop(t, T.robots1)); }
  put(tagRing, W / 2, 1340, Math.max(win(t, T.twelve4, T.b5 - 0.1, 0.25, 0.25), win(t, T.twelve5, T.ethereum + 0.4, 0.25, 0.25)), pop(t, t > T.b5 ? T.twelve5 : T.twelve4));
  // 2–3 — the first case of its kind; cleared
  put(cardFirst, W / 2, 1210, win(t, T.first2 - 0.05, T.b3 - 0.05, 0.25, 0.25), pop(t, T.first2 - 0.05));
  { const p = p3([GV[0], 13, GV[1]], win(t, T.cleared, T.b4 + 0.3, 0.2, 0.25)); put(tagCleared, clampX(p[0], 270), clampY(p[1], 640, 1300), p[2], pop(t, T.cleared)); }
  // 5 — the line and the block
  { const p = p3([(CS + CE) / 2 - 2, PY + 3.4, CZ], win(t, T.waiting, T.b6 - 0.05, 0.25, 0.25)); put(tagLine, clampX(p[0], 200), clampY(p[1], 640, 1350), p[2], pop(t, T.waiting)); }
  { const p = p3([carX(2, t), 5.4, 0], win(t, T.block5, T.b6 + 0.6, 0.2, 0.25)); put(tagBlock, clampX(p[0], 180), clampY(p[1], 640, 1350), p[2], pop(t, T.block5)); }
  // 6 — the sandwich
  { const p = p3([goldAt[0], CY + 1.6, CZ], win(t, T.big6, T.after6 + 0.2, 0.2, 0.2)); put(tagBig, clampX(p[0], 190), clampY(p[1], 640, 1400), p[2], pop(t, T.big6)); }
  { const p = p3([frontAt[0] + 0.6, CY + 2.6, CZ], win(t, T.before6, T.after6 + 0.2, 0.2, 0.2)); put(tagFront, clampX(p[0] + 40, 230), clampY(p[1], 640, 1400), p[2], pop(t, T.before6)); }
  { const p = p3([behindAt[0] - 0.6, CY + 2.6, CZ], win(t, T.after6 - 0.1, T.after6 + 0.6, 0.2, 0.2)); put(tagBehind, clampX(p[0] - 40, 230), clampY(p[1], 640, 1400), p[2], pop(t, T.after6 - 0.1)); }
  { const p = p3([carX(2, t), 5.4, 0], win(t, T.after6 + 0.75, T.b7 + 0.25, 0.2, 0.25)); put(tagSand, clampX(p[0], 200), clampY(p[1], 640, 1350), p[2], pop(t, T.after6 + 0.75)); }
  // 7 — the brothers; the bait
  { const p = p3([DK[0] + 1.5, PY + 3.4, DK[1]], win(t, T.brothers, T.fed - 0.1, 0.3, 0.25)); put(nameBro, W / 2, clampY(p[1] - 60, 640, 1250), p[2], pop(t, T.brothers)); }
  put(tagMonths, W / 2, 1300, win(t, T.months - 0.1, T.fed - 0.05, 0.25, 0.25), pop(t, T.months - 0.1));
  { const p = p3([CE - 2.6, CY + 2.2, CZ], win(t, T.bait7 - 0.05, T.b8 + 0.1, 0.2, 0.25)); put(tagBait, clampX(p[0], 160), clampY(p[1], 640, 1350), p[2], pop(t, T.bait7 - 0.05)); }
  // 8 — the flaw and the peek
  { const p = p3([LX, 9.6, 0], win(t, T.flaw, T.peek - 0.05, 0.15, 0.2)); put(tagFlaw, clampX(p[0], 260), clampY(p[1], 640, 1300), p[2], pop(t, T.flaw)); }
  { const p = p3([LX, 9.6, 0], win(t, T.peek, T.b9 - 0.05, 0.2, 0.25)); put(tagPeek, clampX(p[0], 260), clampY(p[1], 640, 1300), p[2], pop(t, T.peek)); }
  // 9 — the swap and the money
  { const p = p3([LX, 8.0, 0], win(t, T.swapped, T.money9 - 0.2, 0.2, 0.25)); put(tagSwap, clampX(p[0], 200), clampY(p[1], 640, 1300), p[2], pop(t, T.swapped)); }
  { const o = win(t, T.money9 - 0.15, T.b10 - 0.3, 0.25, 0.25), u = eo(seg(t, T.money9, T.them9 + 0.3)); setHTML(cnt25v, `$${Math.round(25 * u)}M`); put(cnt25, W / 2, 1410, o, pop(t, T.money9 - 0.15)); }
  // 10–14 — the court
  put(cardCharge, W / 2, 1220, win(t, T.prosecutors + 0.3, T.b11 - 0.05, 0.25, 0.25), pop(t, T.prosecutors + 0.3));
  { const p = p3([CT[0], 25, CT[1] + 6], win(t, T.fraud, T.b11 - 0.05, 0.15, 0.2)); put(tagFraud, clampX(p[0], 220), clampY(p[1], 620, 1100), p[2], pop(t, T.fraud)); }
  { const p = p3([JB[0], 5.6, JB[1]], win(t, T.agree - 0.05, T.b12 - 0.05, 0.2, 0.25)); put(tagJury, clampX(p[0], 220), clampY(p[1], 620, 1250), p[2], pop(t, T.agree - 0.05)); }
  put(qLie, W / 2, 1230, win(t, T.clarke - 0.05, T.b13 - 0.3, 0.25, 0.22), pop(t, T.clarke - 0.05));
  put(qMoral, W / 2, 1230, win(t, T.question + 0.05, T.moral + 0.55, 0.25, 0.25), pop(t, T.question + 0.05));
  put(cardTerms, W / 2, 1240, win(t, T.moral + 0.6, T.b14 + 0.25, 0.2, 0.2), pop(t, T.moral + 0.6));
  put(stampClosed, W / 2, 1220, win(t, T.closed, T.story - 0.1, 0.12, 0.25), pop(t, T.closed, 0.25)); stampClosed.style.rotate = '-6deg';
  // 15 — title and lesson; 16 — the question
  put(title, W / 2, 640, win(t, T.story, T.cta - 0.1, 0.4, 0.3), 0.94 + 0.06 * eo(seg(t, T.story, T.story + 0.6)));
  put(lesson, W / 2, 1180, win(t, T.code, T.cta - 0.15, 0.3, 0.25), pop(t, T.code));
  put(ctaChip, W / 2, 472, seg(t, T.cta + 0.05, T.cta + 0.35), pop(t, T.cta + 0.05));
  [[T.crime, 'CRIME', T.postA], [T.fair, 'FAIR', T.postB]].forEach(([t0, word, tp], i) => {
    const bx = boxes[i], L = word.length, n = Math.min(L, Math.floor(c01((t - t0) / (0.1 * L)) * (L + 0.001))), typed = word.slice(0, n), caret = (n < L || Math.floor(t * 2.4) % 2) && t < tp ? '<i></i>' : '';
    setHTML(bx.inn, typed ? `<b>${typed}</b>${caret}` : `<em>Add a comment…</em>${caret}`); const sent = t > tp; const pc = sent ? 'post on sent' : n === L ? 'post on' : 'post'; if (bx.post.className !== pc) bx.post.className = pc; setTxt(bx.post, sent ? 'Posted ✓' : 'Post');
    const ts = i ? T.fair - 0.35 : T.comment; put(bx.e, W / 2, 1180 + i * 132, seg(t, ts, ts + 0.3), pop(t, ts) * (1 + 0.06 * win(t, tp, tp + 0.3, 0.08, 0.2)));
  });
}

// ───────────────────────── one frame
const hopY = (hops, t, h = 0.5) => { let y = 0; for (const t0 of hops) { const u = (t - t0) / 0.38; if (u > 0 && u < 1) y = Math.max(y, Math.sin(u * Math.PI) * h); } return y; };
const _m4 = new THREE.Matrix4(), _q = new THREE.Quaternion(), _e = new THREE.Euler(), _p = new THREE.Vector3(), _s = new THREE.Vector3(), _c = new THREE.Color();
function cratePos(c, t) {   // position (and whether it is shown) of crate c at time t
  if (t < c.tA || t > c.tZ) return null;
  const ph = c.path; let i = 0; while (i < ph.length - 1 && t >= ph[i + 1][0]) i++;
  const [a, b, f, to, h] = ph[i];
  if (t < a) { const p = f(t); return [p[0], p[1], p[2], 0]; }
  if (t <= b) { const u = seg(t, a, b), p0 = f(t), p1 = to(t), e = h > 0 ? u : u; return [lerp(p0[0], p1[0], e), lerp(p0[1], p1[1], e) + h * 4 * u * (1 - u), lerp(p0[2], p1[2], e), h > 0 ? u : 0]; }
  const p = to(t); return [p[0], p[1], p[2], 0];
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
  WIN_LIT.emissiveIntensity = Math.max(0, night * 1.05);
  lampM.emissiveIntensity = night * 1.4;
  carFrameM.emissiveIntensity = 0.15 + night * 0.55; glassM.emissiveIntensity = 0.2 + night * 0.4; lidM.emissiveIntensity = 0.3 + night * 0.4;
  // the ring clock: one segment a second, all twelve flash as a block leaves
  { let last = -1e9; for (const d of T.dep) if (d <= t) last = d; if (last < -1e8) last = T.dep[0] - 12;
    const el2 = t - last, n = Math.floor(el2 % 12 + 1e-6), flash = win(t, last, last + 0.5, 0.02, 0.3), trap = t > T.dep[2] && t < T.dep[3];
    for (let i = 0; i < SEGN; i++) { const on = i < n; _c.setHex(on ? (trap ? 0xFF6FD8 : 0xFFC84A) : 0x2A3050); if (flash > 0.01) _c.lerp(new THREE.Color(0xFFFFFF), flash * 0.8); segs.setColorAt(i, _c); }
    segs.instanceColor.needsUpdate = true; ringNum.scale.setScalar(1 + 0.08 * Math.max(win(t, T.twelve4, T.twelve4 + 0.6, 0.1, 0.3), win(t, T.twelve5, T.twelve5 + 0.6, 0.1, 0.3), flash)); }
  // the gantry light: cyan, red at the flaw
  { const g = win(t, T.glitch - 0.05, T.lidUp + 0.2, 0.05, 0.25); ganLightM.color.setRGB(lerp(0.5, 1, g), lerp(0.91, 0.3, g), lerp(1, 0.25, g)); glitchM.opacity = g * (0.35 + 0.35 * Math.abs(Math.sin(t * 40))); glitch.visible = g > 0.01; }
  // block cars, glass, lids
  cars.forEach((c, i) => { const x = carX(c.k, t); c.m.position.set(x, 0, 0); glasses[i].position.set(x, 0, 0); const vis = Math.abs(x - LX) < 120; c.m.visible = glasses[i].visible = vis;
    const L = lids[i], on = lidOn(c.k, t); L.visible = on && vis; if (on) L.position.set(lidX(c.k, t), lidY(c.k, t), 0); });
  { const o = win(t, T.lidUp, T.sealed + 0.45, 0.2, 0.4) + 0.5 * win(t, T.swapped, T.trapSeal, 0.2, 0.3); beamM.opacity = 0.2 * Math.min(1, o); beam.visible = o > 0.01; beam.position.x = carX(3, t); }
  { const o = win(t, T.peek - 0.1, T.swapped + 0.1, 0.25, 0.3); mag.visible = o > 0.01; mag.position.set(LX - 1.0, 9.4 + Math.sin(t * 2.2) * 0.25, 2.2); mag.rotation.set(-0.9, 0, 0.35 + Math.sin(t * 1.6) * 0.08); mag.scale.setScalar(0.8 * o); }
  // crates
  { const cnt = {}; for (const k in CMESH) cnt[k] = 0;
    for (const c of CRATES) { const p = cratePos(c, t); if (!p) continue; const k = c.kind, im = CMESH[k]; if (cnt[k] >= 64) continue;
      const appear = c.kind === 'n' ? 1 : (t < c.tA + 0.2 ? back(seg(t, c.tA, c.tA + 0.2)) : 1), gone = c.tZ < 1e8 ? 1 - seg(t, c.tZ - 0.15, c.tZ) : 1, sc = c.sc * Math.max(0.001, appear * gone);
      if (c.kind === 'n' && p[0] < CS + 0.4) continue;
      _e.set(p[3] * 1.6, p[3] * 0.8, 0); _q.setFromEuler(_e); _p.set(p[0], p[1], p[2]); _s.setScalar(sc); _m4.compose(_p, _q, _s); im.setMatrixAt(cnt[k], _m4); if (k === 'n') { _c.setHex(c.col); im.setColorAt(cnt[k], _c); } cnt[k]++; }
    for (const k in CMESH) { CMESH[k].count = cnt[k]; CMESH[k].instanceMatrix.needsUpdate = true; if (CMESH[k].instanceColor) CMESH[k].instanceColor.needsUpdate = true; } }
  // the conveyor's belt stripes move
  beltStripes.forEach((m, i) => { const L = CE - CS + 1.4, x = CS - 0.7 + ((i / beltStripes.length) * L + t * VC) % L; m.position.x = x; });
  // coins
  { let n = 0; for (const c of COINS) { const u = (t - c.t0) / c.d; if (u <= 0 || u >= 1 || n >= 160) continue; const a = c.a(t), b = c.b(t); _e.set(t * 9 + c.sp, c.sp, t * 6); _q.setFromEuler(_e); _p.set(lerp(a[0], b[0], u), lerp(a[1], b[1], u) + c.h * 4 * u * (1 - u), lerp(a[2], b[2], u)); _s.setScalar(1); _m4.compose(_p, _q, _s); coinMesh.setMatrixAt(n++, _m4); } coinMesh.count = n; coinMesh.instanceMatrix.needsUpdate = true; }
  { const k = eo(seg(t, T.flowA + 0.6, T.flowB + 0.4)); coinHeap.visible = k > 0.02; coinHeap.scale.set(1.0 * k + 0.01, 0.75 * k + 0.01, 1.0 * k + 0.01); }
  // robots: idle bob, eyes amber when they spot a buy or the bait, red when the money flows away; throws
  robots.forEach((r, i) => { const thr = i === 2 ? [T.throwG - 0.15, T.throwR - 0.15, T.biteT[2] - 0.15] : i < 3 ? [T.biteT[i] - 0.15] : [];
    r.position.y = PY + hopY(thr, t, 0.35) + Math.abs(Math.sin(t * 3 + i)) * 0.04; r.rotation.z = -0.25 * Math.max(...thr.map(x => win(t, x, x + 0.25, 0.08, 0.2)), 0);
    const spot = Math.max(win(t, T.spot, T.after6 + 0.4, 0.15, 0.4), win(t, T.bait7, T.biteT[2] + 0.6, 0.15, 0.4)), lost = win(t, T.money9 - 0.1, DUR + 2, 0.2, 0.1) * (i < 3 ? 1 : 0);
    eyeMs[i].color.setRGB(lerp(lerp(0.5, 1, spot), 1, lost), lerp(lerp(0.91, 0.78, spot), 0.3, lost), lerp(lerp(1, 0.3, spot), 0.25, lost)); });
  // the brothers: a small nod while they study; turn to the line for the bait; a hop when the money arrives
  bros.forEach((b, i) => { b.position.y = PY + hopY([T.baitT[i] - 0.15, T.flowB - 0.3 + i * 0.1], t, 0.3); b.rotation.y = Math.PI + 0.35 * win(t, T.fed - 0.2, T.bait7 + 0.8, 0.25, 0.4) + Math.sin(t * 1.3 + i) * 0.04; });
  desk.userData.screens.material.color.setRGB(0.56 + 0.1 * Math.sin(t * 2.1), 0.86, 1);
  travelers.forEach((w, i) => { const u = (Math.sin((t * w.sp + w.ph) * Math.PI * 2) + 1) / 2, dir = Math.cos((t * w.sp + w.ph) * Math.PI * 2) > 0 ? 1 : -1; const x = lerp(w.a[0], w.b[0], u), z = lerp(w.a[1], w.b[1], u); w.m.position.set(x, PY + Math.abs(Math.sin(t * 7 + i)) * 0.06, z); w.m.rotation.y = Math.atan2(-(w.b[1] - w.a[1]) * dir, (w.b[0] - w.a[0]) * dir); });
  // the court: the gavel, the jury (split at "couldn't agree"), the scales
  { let y = 6.2, rz = 0; T.gavels.forEach((g, j) => { if (t < g - 0.6) return; const last = j === T.gavels.length - 1, up = eo(seg(t, g - 0.6, g - 0.22)), dn = seg(t, g - 0.14, g), ret = last ? 0 : eo(seg(t, g + 0.3, g + 0.8));
      if (t < g + 0.8 || last) { y = lerp(lerp(lerp(6.2, 9.6, up), 4.15, dn * dn), 6.2, ret) + (t > g ? Math.sin(c01((t - g) / 0.3) * Math.PI) * 0.45 : 0); rz = 0.45 * up * (1 - dn); } });
    gavel.position.y = y; gavel.rotation.z = rz; }
  { const split = win(t, T.agree - 0.1, T.b12 + 1.0, 0.25, 0.5); JUR.forEach((j, i) => { _c.setHex(0x8A6A4A); if (split > 0.01) _c.lerp(new THREE.Color(j.side > 0 ? 0x3FD27A : 0xF2584A), split); chairs.setColorAt(i, _c); j.p.position.y = j.y + 0.42 + hopY([T.agree + 0.05 + (i % 6) * 0.04], t, 0.25); j.p.rotation.y = -Math.PI / 2 + Math.sin(t * 2 + i) * 0.15 * split; }); chairs.instanceColor.needsUpdate = true; }
  { const q = win(t, T.question, T.moral + 0.8, 0.3, 0.5), wob = Math.sin((t - T.question) * 2.6) * 0.22 * q;
    const cA = win(t, T.postA - 0.05, T.fair - 0.1, 0.25, 0.3), cB = seg(t, T.postB - 0.05, T.postB + 0.3), cta = -0.24 * cA + 0.24 * cB;
    const bm = scales.userData.beam; bm.rotation.z = wob + cta + Math.sin(t * 1.1) * 0.02; scales.userData.pans.forEach((p, i) => { p.rotation.z = -bm.rotation.z; });
    scales.updateMatrixWorld(true); const show = seg(t, T.cta + 0.2, T.cta + 0.6);
    panTags.forEach((m, i) => { const pw = new THREE.Vector3(); scales.userData.pans[i].getWorldPosition(pw); m.visible = show > 0.01; m.position.set(pw.x, pw.y + 1.5, pw.z + 0.6); m.scale.setScalar(Math.max(0.01, back(show))); m.quaternion.copy(camera.quaternion); }); }
  // clouds
  for (const c of clouds) { c.position.x = c.userData.x0 + t * 1.2; c.material.opacity = 0.9 - 0.5 * night; const k = lerp(1, 0.45, night); c.material.color.setRGB(lerp(s.hor[0], 1, 0.55) * k, lerp(s.hor[1], 1, 0.55) * k, lerp(s.hor[2], 1, 0.55) * k * 1.05); }
  // sparkles: the bait; the money heap; the posted answers
  { let k = 0; const put3 = (x, y, z, sz, on, col) => { const sp = sparks[k++]; if (!sp) return; const tw = Math.pow(Math.abs(Math.sin(t * sp.userData.w + sp.userData.ph)), 3); sp.position.set(x, y, z); sp.scale.setScalar(sz * (0.25 + tw)); sp.material.opacity = on * (0.3 + 0.7 * tw); sp.material.color.setHex(col); sp.visible = on > 0.01; };
    const s1 = win(t, T.bait7, T.swapOut[2] + 0.6, 0.2, 0.3); for (let i = 0; i < 18; i++) { const sp = sparks[i].userData, x = t < T.bait7 + 0.6 ? CE - 2.6 : carX(3, t); put3(x + sp.dx * 2.4, CY + 0.6 + sp.k * 1.6, (t < T.bait7 + 0.6 ? CZ : 0.8) + sp.dz * 0.8, 0.9, s1, 0xFFB8EA); }
    const s2 = win(t, T.flowA + 0.8, T.b10 + 0.8, 0.3, 0.4); for (let i = 0; i < 16; i++) { const sp = sparks[i + 20].userData; put3(DK[0] + 0.8 + sp.dx * 1.5, PY + 1.3 + sp.k * 1.4, DK[1] - 1.9 + sp.dz * 0.8, 0.9, s2, 0xFFE9A8); }
    const s3 = win(t, T.postA, DUR + 1, 0.3, 0.1); for (let i = 0; i < 20; i++) { const ph = (t * 0.35 + i / 20) % 1, a = i * 2.4; put3(SC[0] + Math.cos(a) * (3 + ph * 3), 4 + ph * 6, SC[1] + Math.sin(a) * (1.4 + ph), 0.8 + 0.3 * (1 - ph), s3 * Math.sin(ph * Math.PI), 0xFFE9A8); }
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
    if (!hit && Math.abs(c.z) < 2.4 && c.y < 4.2) hit = 'cars';
    if (hit) { if (cur && cur[2] === hit && f - cur[1] <= 1) cur[1] = f; else { cur = [f, f, hit]; out.push(cur); } }
  }
  return out.map(([a, b, n]) => `${(a / 30).toFixed(2)}-${(b / 30).toFixed(2)}s ${n}`);
};
window.renderAt = renderAt;
const crateLand = []; for (const c of CRATES) for (const [a, b, , , h] of c.path) if (h > 0 && b > 0 && b < DUR) crateLand.push(+b.toFixed(3));
window.CUES = {
  T: Object.fromEntries(Object.entries(T).filter(([, v]) => typeof v === 'number')), DUR, sent: TIM.sentences.map(s => s.s),
  dep: T.dep.filter(d => d > 0 && d < DUR).map(d => +d.toFixed(3)), seal: T.dep.map((d, k) => k === 3 ? T.trapSeal + 0.4 : d - 0.15).filter(d => d > 0 && d < DUR).map(d => +d.toFixed(3)),
  ticks: Array.from({ length: Math.ceil(DUR) + 2 }, (_, i) => +(T.dep[0] - 12 + i).toFixed(3)).filter(x => x > 0 && x < DUR),
  land: crateLand.sort((a, b) => a - b), gavels: T.gavels.map(x => +x.toFixed(3)),
  coinsIn: COINS.map(c => +(c.t0 + c.d).toFixed(3)).sort((a, b) => a - b),
  typingA: [0, 1, 2, 3, 4].map(i => +(T.crime + (i + 0.5) * 0.1).toFixed(3)), typingB: [0, 1, 2, 3].map(i => +(T.fair + (i + 0.5) * 0.1).toFixed(3)),
  postA: +T.postA.toFixed(3), postB: +T.postB.toFixed(3),
};
document.fonts.ready.then(() => Promise.all(['700 64px Figtree', '900 190px Fraunces', '800 30px JBM', '700 22px Inter', '700 78px Fraunces', '800 54px Figtree', '600 34px Figtree', '500 18px Inter', '900 128px JBM', '800 46px Inter', '900 150px Figtree', '900 112px Fraunces', '800 172px JBM', '700 34px Figtree', '800 92px JBM', '900 64px Figtree', '800 96px JBM', '800 66px Figtree', '800 76px Figtree', '900 104px Figtree', '700 44px Fraunces'].map(f => document.fonts.load(f)))).then(() => { TEXS.forEach(f => f()); fitHook(); renderAt(0); window.__ready = true; });
