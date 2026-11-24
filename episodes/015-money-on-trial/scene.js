// The Money on Trial — low-poly storybook scene (deterministic: window.renderAt(t) draws the frame for time t)
// 23 Nov 2026: the US Justice Department files a civil forfeiture complaint in Washington, D.C. against about $1.17bn of USDC stolen in the 29 Oct 2026
// Binance hack (about $6.3bn, the biggest crypto theft on record; the FBI blames North Korea, which denies it). In such a case the money is the defendant.
// Circle froze the USDC but can't move the original tokens, so it agreed to issue new ones to the US if a judge says yes. Bitcoin and ether can't be
// frozen: the rest went to 27,000+ wallets and home-made meme coins; trackers say over $2bn is still in wallets tied to the theft (Elliptic, 23 Nov 2026).
import * as THREE from 'three';
import { SKIN, MAT, GOLD, rng, GB, person, cloud, bushTree, tower, car, lamp, bank, press, pedestal, bigButton, vaultDoor, BIGCOIN, WIN_LIT } from './kit.js';

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
const R = rng(20261123);

// ───────────────────────── story clock (everything hangs off the narration)
const T = {
  hookEnd: TIM.big ? 1.5 : TIM.hook ? E(1) + 0.15 : 0,  // the hook card (script.py HOOK): 0-1.5 s when there is a big number, else until the hook sentence ends
  bigIn: TIM.big ? 1.5 : 0, bigOut: TIM.big ? 3.0 : 0,   // the big number (script.py BIG): 1.5-3 s (Keith, 22 Nov 2026)
  america1: wt(1, 'America') - 0.1, suing: wt(1, 'suing') - 0.1, money1: wt(1, 'money') - 0.1, itself1: wt(1, 'itself') - 0.1,
  b2: S(2) - 0.05, binance: wt(2, 'Binance') - 0.1, hack: wt(2, 'hack') - 0.1, biggest: wt(2, 'biggest') - 0.1, theft2: wt(2, 'theft') - 0.1, record: wt(2, 'record') - 0.1,
  b3: S(3) - 0.05, why: wt(3, 'why') - 0.1, money3: wt(3, 'money') - 0.1, thieves3: wt(3, 'thieves') - 0.1,
  b4: S(4) - 0.05, fbi: wt(4, 'FBI') - 0.1, blames: wt(4, 'blames') - 0.1, korea: wt(4, 'Korea') - 0.1, denies: wt(4, 'denies') - 0.1,
  b5: S(5) - 0.05, kind: wt(5, 'kind') - 0.1, case5: wt(5, 'case') - 0.1, money5: wt(5, 'money') - 0.1, defendant: wt(5, 'defendant') - 0.1,
  b6: S(6) - 0.05, court6: wt(6, 'court') - 0.1, billion6: wt(6, 'billion') - 0.1, frozen6: wt(6, 'frozen') - 0.1, digital: wt(6, 'digital') - 0.1, usdc: wt(6, 'USDC') - 0.1,
  b7: S(7) - 0.05, frozen7: wt(7, 'frozen') - 0.1, cant: wt(7, "can't") - 0.1, move: wt(7, 'move') - 0.1, even: wt(7, 'even') - 0.1, maker: wt(7, 'maker') - 0.1,
  b8: S(8) - 0.05, agreed: wt(8, 'agreed') - 0.1, make: wt(8, 'make') - 0.1, newW: wt(8, 'new') - 0.1, ones: wt(8, 'ones') - 0.1, america8: wt(8, 'America') - 0.1, judge: wt(8, 'judge') - 0.1, yes8: wt(8, 'yes') - 0.1,
  b9: S(9) - 0.05, rest: wt(9, 'rest') - 0.1, bitcoin: wt(9, 'Bitcoin') - 0.1, ether: wt(9, 'ether') - 0.1, company: wt(9, 'company') - 0.1, freeze9: wt(9, 'freeze') - 0.1,
  b10: S(10) - 0.05, spread: wt(10, 'spread') - 0.1, n27: wt(10, '27000') - 0.1, wallets10: wt(10, 'wallets') - 0.1, made: wt(10, 'made') - 0.1, meme: wt(10, 'meme') - 0.1, coins10: wt(10, 'coins') - 0.1,
  b11: S(11) - 0.05, trackers: wt(11, 'Trackers') - 0.1, two: wt(11, '2') - 0.1, billion11: wt(11, 'billion') - 0.1, still: wt(11, 'still') - 0.1, theft11: wt(11, 'theft') - 0.1,
  b12: S(12) - 0.05, over12: wt(12, 'over') - 0.1,
  b13: S(13) - 0.05, story: wt(13, 'story') - 0.15, trial: wt(13, 'trial') - 0.1, frozen13: wt(13, 'frozen') - 0.1, returned: wt(13, 'returned') - 0.1,
  cta: S(14) - 0.1, should: wt(14, 'Should') - 0.1, freeze14: wt(14, 'freeze') - 0.1, button: wt(14, 'button') - 0.1, comment: wt(14, 'Comment') - 0.15, yes: wt(14, 'YES') - 0.2, no: wt(14, 'NO') - 0.1,
};
T.doorOpen = T.b2 + 0.15;                                                   // the vault door swings open: the theft, replayed
T.theftA = T.binance + 0.05; T.theftB = T.record + 0.5;                     // coins leave the vault between these
T.ice6 = T.frozen6 - 0.1;                                                   // frost runs over the block at "frozen"
T.pushA = T.b7 + 0.05; T.pushB = T.b8 + 0.3;                                // the maker pushes; the block doesn't budge
T.stamps = [T.make, T.newW + 0.05, T.ones + 0.12, T.america8 + 0.2];       // the press stamps four new coins
T.gavelUp = T.judge - 0.35;                                                 // the gavel lifts and waits ("if a judge says yes")
T.freezeTry = T.freeze9 - 0.2; T.shatter = T.freeze9 + 0.42;                // a freeze beam at the wallets; the ice can't hold and shatters
T.swarmA = T.spread - 0.05; T.swarmB = T.wallets10 + 0.75;                  // the wallets split into a swarm
T.memeA = T.meme - 0.12;                                                    // home-made meme coins pop out of the swarm
T.postA = T.yes + 0.75; T.postB = T.no + 0.7;
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
  MORN: P(0x4E9FDC, 0x9FD0EA, 0xFBE6BC, 0xE6E4D6, 0xFFE2B0, 3.2, 0xBFDFFF, 0x9A9A80, 1.6, 0, 0, 55, 30, 0xFFF0C8, 40, 100, 680),
  DAY: P(0x2F8FDA, 0x86C6EE, 0xEAF0EE, 0xDCE6EA, 0xFFF1D6, 3.5, 0xCFE8FF, 0x9AA088, 1.7, 0, 0, 22, 52, 0xFFF8E0, 38, 110, 720),
  GOLDEN: P(0x3C7FCB, 0xF2C58A, 0xFFD79A, 0xF6CF9A, 0xFFC878, 3.2, 0xE8D2B0, 0xA88A60, 1.5, 0, 0.12, -68, 20, 0xFFE0A0, 44, 100, 680),
  SUNSET: P(0x2E2F72, 0xE0707A, 0xFFB25E, 0xEE9A6A, 0xFF9050, 2.9, 0xB49AC8, 0x86685A, 1.45, 0.12, 0.6, -70, 11, 0xFFB060, 50, 90, 620),
  DUSK: P(0x141A4C, 0x4A3F86, 0xC06A78, 0x6A4A78, 0x93A4F4, 1.7, 0x5A62B0, 0x3A2A40, 1.2, 0.65, 0.92, -40, 36, 0xFFF4D6, 30, 80, 600),
};
const SKY = [[0, 'SUNSET'], [T.b2 + 0.1, 'SUNSET'], [T.b2 + 0.8, 'NIGHT'], [T.b5 + 0.25, 'NIGHT'], [T.b5 + 0.85, 'GOLDEN'], [T.b9 + 0.05, 'GOLDEN'], [T.b9 + 0.65, 'NIGHT'],
  [T.b12 - 0.05, 'NIGHT'], [T.b12 + 0.7, 'SUNSET'], [T.b13 + 1.0, 'SUNSET'], [T.cta + 0.3, 'DUSK'], [DUR + 2, 'DUSK']];
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

// ───────────────────────── places
const V = [0, -90], VF = -76;                 // Binance's vault and its front face
const DOOR = [0, 12.5, VF + 0.75], DR = 8.2;  // the round vault door on the front face
const TW = [-20, -240];                        // the thieves' wallets: dark cases floating high behind the vault, under a storm cloud
const CT = [48, 2];                            // the federal court in Washington, D.C. (faces +z)
const DEF = [48, 27], IB = 8;                  // the defendant: a block of ice full of frozen USDC on a low plinth in front of the court
const MINT = [31.5, 19], CASE = [38.5, 22];    // Circle's coin press and the glass case where the new coins wait (behind the block's front line, so the front views stay clear)
const GV = [57.2, 20.5];                       // the judge's gavel over its block
const BTN = [48, 39];                          // the freeze button (the question at the end)
const stat = [];

// ───────────────────────── ground, streets, plaza
const ground = new THREE.Mesh(new THREE.PlaneGeometry(2400, 2400).rotateX(-Math.PI / 2), new THREE.MeshLambertMaterial({ color: 0xC9C2AE })); ground.receiveShadow = true; scene.add(ground);
const flat = new GB();
flat.box(9, 0.04, 360, 0x4A4E56, 92, 0.02, -60); flat.box(9, 0.04, 360, 0x4A4E56, -46, 0.021, -60);              // avenues north-south
flat.box(520, 0.04, 9, 0x4A4E56, 20, 0.022, -124); flat.box(520, 0.04, 9, 0x4A4E56, 20, 0.023, 52);              // east-west
for (const z of [-124, 52]) for (let x = -230; x < 270; x += 6) flat.box(2.6, 0.05, 0.22, 0xF2EEE2, x, 0.045, z);
flat.box(70, 0.07, 50, 0xE6DFD0, 0, 0.035, -50);                                                                  // the plaza in front of the vault
for (let i = 0; i < 12; i++) flat.box(70, 0.075, 0.12, 0xD6CEBC, 0, 0.037, -73 + i * 4);
flat.box(64, 0.07, 36, 0xECE6D8, CT[0], 0.036, 30);                                                               // the court's plaza
for (let i = 0; i < 9; i++) flat.box(64, 0.075, 0.12, 0xD9D1C0, CT[0], 0.038, 14 + i * 4);
flat.box(12, 0.08, 36, 0xD9CFBA, CT[0], 0.042, 30);                                                               // the walk up the middle
for (const x of [CT[0] - 40, CT[0] + 40]) flat.box(16, 0.06, 60, 0x86AE6E, x, 0.03, 18);                         // lawns either side
flat.box(40, 0.06, 30, 0x8DAE74, -8, 0.03, 26); flat.box(30, 0.06, 26, 0x9DB884, 110, 0.03, 20);
{ const rr = rng(909); for (let i = 0; i < 60; i++) { const x = -260 + rr() * 480, z = -230 + rr() * 300; if (Math.abs(x) < 50 && z > -110 && z < -20) continue; if (x > 10 && x < 90 && z > -16 && z < 60) continue; flat.box(6 + rr() * 14, 0.06, 6 + rr() * 14, rr() < 0.5 ? 0x8DAE74 : 0x9DB884, x, 0.03, z); } }
const flatM = flat.mesh(); flatM.castShadow = false; scene.add(flatM);

// ───────────────────────── the city
const DEST = (x, z) => (Math.abs(x) < 40 && z < -24 && z > -112) || (x > -80 && x < 14 && z > -30 && z < 80) || (Math.abs(x - TW[0]) < 60 && z < -196) || (x > 10 && x < 88 && z > -18 && z < 60) || z > 46 || Math.hypot(x - TW[0], z - TW[1]) < 60 || Math.abs(z + 124) < 9 || Math.abs(x - 92) < 9 || Math.abs(x + 46) < 9;
{
  const tr = rng(2026), PAL = [[0xD9D3C6, 0x5E7F9A], [0x6D97AA, 0x3F6A80], [0xE4DED2, 0x4E7C93], [0xC9C2B4, 0x55748C], [0x8FB3C2, 0x426E86], [0xEFE9DC, 0x6A8AA4], [0xB7C4C9, 0x3E6378], [0xE8D9C0, 0x5A7A90]];
  for (let gx = -230; gx <= 230; gx += 22) for (let gz = -260; gz <= 90; gz += 22) {
    const x = gx + (tr() - .5) * 7, z = gz + (tr() - .5) * 7; if (DEST(x, z) || tr() < 0.12) continue;
    const dp = Math.hypot(x, z + 60), far = dp > 120, w = 9 + tr() * 7, d = 9 + tr() * 7;
    const nearCourt = Math.hypot(x - CT[0], z - CT[1]) < 70;
    const h = (nearCourt ? 9 + tr() * 8 : dp < 80 ? 12 + tr() * 16 : 18 + tr() * (far ? 44 : 28));
    const pal = nearCourt ? [[0xEFE9DC, 0x6A8AA4], [0xE4DED2, 0x4E7C93], [0xE8D9C0, 0x5A7A90]][Math.floor(tr() * 3)] : PAL[Math.floor(tr() * PAL.length)];
    const g = tower(w, h, d, { rand: tr, color: pal[0], glass: pal[1], floor: far ? 4.2 : 3.4, litP: 0.55, crown: h > 46 && tr() < 0.5 });
    g.position.set(x, 0, z); g.rotation.y = (tr() < 0.5 ? 0 : Math.PI / 2); g.children.forEach(c => { c.castShadow = dp < 140; c.receiveShadow = true; }); scene.add(g);
    stat.push([x - Math.max(w, d) / 2, x + Math.max(w, d) / 2, z - Math.max(w, d) / 2, z + Math.max(w, d) / 2, h + 4, 'tower']);
  }
}
// the vault: a steel-and-stone strongroom with a round door and a glowing heap of coins behind it
const vault = new THREE.Group(); scene.add(vault);
{ const b = new GB(), st = 0x6E7480, st2 = 0x8A909C, trim = 0xD9D3C6, dk = 0x2C3038;
  b.box(46, 1.2, 34, 0xCFC8BA, V[0], 0.6, V[1] + 1);
  b.box(40, 30, 28, st, V[0], 15, V[1]);
  b.box(42, 1.6, 30, trim, V[0], 30.6, V[1]); b.box(30, 4, 20, st2, V[0], 33, V[1] - 1);
  for (const x of [-19, -13, 13, 19]) b.box(2.2, 28, 1.2, st2, x, 15, VF + 0.6);
  b.box(40, 2.0, 1.4, trim, V[0], 27.5, VF + 0.7);
  b.cyl(DR + 1.4, DR + 1.4, 0.6, 32, dk, DOOR[0], DOOR[1], VF + 0.3, Math.PI / 2, 0, 0);
  for (let i = 0; i < 3; i++) b.box(16 - i * 3, 0.5, 2.2, trim, 0, 1.45 + i * 0.5, VF + 2.6 - i * 0.8);
  vault.add(b.mesh());
  const lw = new GB(); for (let k = 0; k < 6; k++) for (const s of [-1, 1]) lw.box(0.15, 3.2, 3.2, 0xFFFFFF, s * 20.1, 8 + k * 3.6, V[1] - 6 + (k % 2) * 6);
  vault.add(new THREE.Mesh(lw.geo(), WIN_LIT));
  stat.push([V[0] - 21, V[0] + 21, V[1] - 15, V[1] + 15, 37, 'vault']); }
const heapBg = new THREE.Mesh(new THREE.CircleGeometry(DR + 0.2, 32), new THREE.MeshBasicMaterial({ color: 0x1A1408, toneMapped: false })); heapBg.position.set(DOOR[0], DOOR[1], VF + 0.62); scene.add(heapBg);
const heapM = new THREE.MeshBasicMaterial({ map: radial('rgba(255,214,90,1)', 'rgba(150,90,10,0.0)'), transparent: true, toneMapped: false, depthWrite: false });
const heap = new THREE.Mesh(new THREE.CircleGeometry(DR, 32), heapM); heap.position.set(DOOR[0], DOOR[1], VF + 0.66); scene.add(heap);
const heapCoins = (() => { const b = new GB(), rr = rng(77); for (let i = 0; i < 70; i++) { const a = rr() * 6.28, r = Math.sqrt(rr()) * DR * 0.85; b.cyl(0.9, 0.9, 0.06, 10, 0xFFFFFF, Math.cos(a) * r, Math.sin(a) * r * 0.9 - 1.5, rr() * 0.02, Math.PI / 2, 0, rr()); } const m = new THREE.Mesh(b.geo(), GOLD); m.position.set(DOOR[0], DOOR[1], VF + 0.68); return m; })(); scene.add(heapCoins);
const door = vaultDoor(DR); door.position.set(DOOR[0], DOOR[1], DOOR[2]); door.children.forEach(c => { c.castShadow = true; }); scene.add(door);

// ───────────────────────── the thieves' wallets (dark cases under a storm cloud), bitcoin and ether, the failed freeze, the swarm, the meme coins
const NWAL = 9;
const WPOS = Array.from({ length: NWAL }, (_, i) => { const rr = rng(500 + i); return [TW[0] + (i % 3 - 1) * 16 + (rr() - .5) * 5, 52 + Math.floor(i / 3) * 8 + rr() * 3, TW[1] + (Math.floor(i / 3) - 1) * 8 + (rr() - .5) * 6]; });
const WALG = (() => { const b = new GB(); b.box(5.2, 3.6, 1.6, 0x23262E, 0, 0, 0); b.box(5.3, 0.5, 1.7, 0x3A3F4A, 0, 1.2, 0); b.box(1.6, 0.4, 1.75, 0xFF4A3A, 0, 0.3, 0); b.box(0.5, 0.9, 1.72, 0x15171C, -2.1, -0.4, 0); return b.geo(); })();
const slotM = new THREE.MeshBasicMaterial({ color: 0xFF5A3A, toneMapped: false });
const wallets = WPOS.map((p, i) => { const g = new THREE.Group(), m = new THREE.Mesh(WALG, MAT); m.castShadow = true; g.add(m); const sl = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.42, 1.8), slotM); sl.position.y = 0.3; g.add(sl); g.position.set(...p); g.rotation.y = 0.15 + (i % 3) * 0.12; g.scale.setScalar(1.6); scene.add(g); return g; });
const iceM = new THREE.MeshLambertMaterial({ color: 0xBFEFFF, emissive: 0x2A6A8A, emissiveIntensity: 0.35, transparent: true, opacity: 0.62, depthWrite: false });
const tryIce = WPOS.map(p => { const m = new THREE.Mesh(new THREE.IcosahedronGeometry(6.4, 0), iceM.clone()); m.position.set(...p); m.scale.setScalar(0.01); m.visible = false; m.renderOrder = 3; scene.add(m); return m; });
stat.push([TW[0] - 32, TW[0] + 32, TW[1] - 24, TW[1] + 24, 80, 'wallets']);
const storm = []; for (let i = 0; i < 4; i++) { const m = cloud(R); m.position.set(TW[0] - 24 + i * 16, 92 + R() * 5, TW[1] - 6 + R() * 10); m.scale.setScalar(3.4); m.userData.x0 = m.position.x; scene.add(m); storm.push(m); }
const beamM = new THREE.MeshBasicMaterial({ color: 0xFFF1C0, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false, side: THREE.DoubleSide });
const beam = new THREE.Mesh(new THREE.ConeGeometry(9, 80, 20, 1, true).translate(0, -40, 0), beamM); beam.position.set(TW[0] + 34, 2, TW[1] + 64); scene.add(beam);
const fbeamM = new THREE.MeshBasicMaterial({ color: 0x9FE6FF, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false, side: THREE.DoubleSide });
const fbeam = new THREE.Mesh(new THREE.CylinderGeometry(30, 6, 56, 24, 1, true).translate(0, 28, 0), fbeamM); fbeam.position.set(TW[0], 4, TW[1]); scene.add(fbeam);
// ice shards when the freeze fails
const NSH = 90, shardG = new THREE.TetrahedronGeometry(1.1, 0), shards = new THREE.InstancedMesh(shardG, new THREE.MeshLambertMaterial({ color: 0xCFF4FF, emissive: 0x3A8AAA, emissiveIntensity: 0.6 }), NSH); shards.frustumCulled = false; shards.count = 0; scene.add(shards);
const SHD = Array.from({ length: NSH }, (_, i) => { const rr = rng(4100 + i), th = rr() * 6.28, ph = (rr() - 0.3) * 1.6; return { w: i % NWAL, v: [Math.cos(th) * Math.cos(ph), Math.sin(ph), Math.sin(th) * Math.cos(ph)], sp: 10 + rr() * 14, r: rr() * 6 }; });
// coins: the theft (gold) from the vault to the wallets; bitcoin (orange) and ether (violet) circling the wallets
const NC = 150, COING = BIGCOIN(0.95, 0.3);
const TEAL = new THREE.MeshLambertMaterial({ color: 0x3FC8B4, emissive: 0x0E6A5E, emissiveIntensity: 0.5 });
const BTCM = new THREE.MeshLambertMaterial({ color: 0xF2A23A, emissive: 0x8A4A08, emissiveIntensity: 0.55 }), ETHM = new THREE.MeshLambertMaterial({ color: 0x8C93E6, emissive: 0x30368A, emissiveIntensity: 0.55 });
const coinsG = new THREE.InstancedMesh(COING, GOLD, NC); coinsG.castShadow = true; coinsG.frustumCulled = false; scene.add(coinsG);
const CR = Array.from({ length: NC }, (_, i) => { const rr = rng(900 + i); return { w: Math.floor(rr() * NWAL), h: 30 + rr() * 22, j: rr(), sx: (rr() - .5) * 2, sy: (rr() - .5) * 2, sp: 4 + rr() * 6, ph: rr() * 6 }; });
const NO = 36, orbB = new THREE.InstancedMesh(COING, BTCM, NO), orbE = new THREE.InstancedMesh(COING, ETHM, NO); orbB.frustumCulled = orbE.frustumCulled = false; scene.add(orbB, orbE);
const _m4 = new THREE.Matrix4(), _q = new THREE.Quaternion(), _e = new THREE.Euler(), _p = new THREE.Vector3(), _s = new THREE.Vector3();
const FLY = 2.6;
function coinAt(i, t) {   // the theft: coin i leaves the vault door and arcs up to a thieves' wallet
  const c = CR[i], td = T.theftA + (i / NC) * (T.theftB - T.theftA) + c.j * 0.12, u = (t - td) / FLY; if (u < 0 || u > 1) return null;
  const w = WPOS[c.w], p0 = [DOOR[0] + c.sx * 3, DOOR[1] + c.sy * 3, DOOR[2] + 1.5], p1 = [p0[0] + c.sx * 8, p0[1] + 22, p0[2] + 24 + c.sy * 4], p2 = [lerp(p0[0], w[0], 0.6), Math.max(w[1], 45) + c.h * 0.6, lerp(p0[2], w[2], 0.42)];
  const a = (1 - u) ** 3, b = 3 * (1 - u) ** 2 * u, d = 3 * (1 - u) * u * u, e = u ** 3;
  return [a * p0[0] + b * p1[0] + d * p2[0] + e * w[0], a * p0[1] + b * p1[1] + d * p2[1] + e * w[1], a * p0[2] + b * p1[2] + d * p2[2] + e * w[2]];
}
// the swarm: the nine wallets split into hundreds of small ones spread across the sky
const NS = 640, swarm = new THREE.InstancedMesh(WALG, MAT, NS); swarm.frustumCulled = false; swarm.count = 0; swarm.castShadow = false; scene.add(swarm);
const SW = Array.from({ length: NS }, (_, i) => { const rr = rng(7000 + i), r = 26 + Math.pow(rr(), 0.7) * 190, a = rr() * 6.28; return { p: i % NWAL, to: [TW[0] + Math.cos(a) * r, 26 + rr() * 104, TW[1] + Math.sin(a) * r * 0.75], td: T.swarmA + Math.pow(rr(), 0.8) * (T.swarmB - T.swarmA - 0.9), ry: rr() * 6.28, ph: rr() * 6.28, sc: 0.42 + rr() * 0.3 }; });
// meme coins: pink sprites with a silly face, popping out of the swarm
const memeTex = (() => { const cv = document.createElement('canvas'); cv.width = cv.height = 128; const g = cv.getContext('2d');
  g.fillStyle = '#C2387A'; g.beginPath(); g.arc(64, 64, 60, 0, 7); g.fill(); g.fillStyle = '#FF7AB8'; g.beginPath(); g.arc(64, 64, 50, 0, 7); g.fill();
  g.fillStyle = '#2A0A1A'; g.beginPath(); g.arc(46, 52, 8, 0, 7); g.arc(82, 52, 8, 0, 7); g.fill(); g.fillStyle = '#fff'; g.beginPath(); g.arc(48, 50, 3, 0, 7); g.arc(84, 50, 3, 0, 7); g.fill();
  g.strokeStyle = '#2A0A1A'; g.lineWidth = 7; g.lineCap = 'round'; g.beginPath(); g.arc(64, 70, 22, 0.15 * Math.PI, 0.85 * Math.PI); g.stroke(); g.fillStyle = '#E2335A'; g.beginPath(); g.ellipse(70, 93, 7, 9, 0, 0, 7); g.fill();
  const tx = new THREE.CanvasTexture(cv); tx.colorSpace = THREE.SRGBColorSpace; return tx; })();
const NM = 26, memes = Array.from({ length: NM }, (_, i) => { const rr = rng(8100 + i), s = SW[Math.floor(rr() * NS)]; const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: memeTex, transparent: true, depthWrite: false, toneMapped: false })); sp.userData = { s, t0: T.memeA + i * 0.04 + rr() * 0.25, dy: 5 + rr() * 6, ph: rr() * 6 }; sp.visible = false; scene.add(sp); return sp; });

// ───────────────────────── Washington, D.C.: the court, the defendant (frozen USDC in ice), Circle's coin press, the gavel, the freeze button
const court = bank(); court.position.set(CT[0], 0, CT[1]); court.children.forEach(c => { c.castShadow = true; c.receiveShadow = true; }); scene.add(court); stat.push([CT[0] - 14, CT[0] + 14, CT[1] - 9, CT[1] + 12, 19, 'court']);
const courtSign = new THREE.Mesh(new THREE.PlaneGeometry(14, 1.6), new THREE.MeshBasicMaterial({ map: textTex(1024, 118, (g, w, h) => { g.fillStyle = '#E9E1CF'; g.fillRect(0, 0, w, h); g.fillStyle = '#4A3A2A'; g.font = "800 66px Figtree"; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('UNITED STATES COURT', w / 2, h / 2 + 4); }), toneMapped: false }));
courtSign.position.set(CT[0], court.userData.signY, CT[1] + court.userData.signZ + 0.05); scene.add(courtSign);
// low white buildings and trees around the court
{ const tr = rng(311); for (const [x, z, w, h, d] of [[6, 4, 16, 9, 12], [92 - 2, 6, 14, 10, 14], [16, -24, 18, 12, 12], [82, -26, 16, 11, 14], [110, 30, 16, 8, 12]]) { const g = tower(w, h, d, { rand: tr, color: 0xF0EBDF, glass: 0x6A8AA4, floor: 3.4, litP: 0.6, bare: true }); g.position.set(x, 0, z); scene.add(g); stat.push([x - w / 2 - 1, x + w / 2 + 1, z - d / 2 - 1, z + d / 2 + 1, h + 3, 'white']); } }
for (const [x, z] of [[18, 16], [18, 26], [18, 36], [78, 16], [78, 26], [78, 36], [-6, 20], [-14, 32], [104, 16], [104, 40], [0, 40], [118, 22]]) { const m = bushTree(6 + R() * 2, R); m.position.set(x, 0, z); scene.add(m); }
const lampHeads = new GB();
for (const z of [18, 30, 42]) for (const s of [-1, 1]) { const l = lamp(6.2); l.position.set(CT[0] + s * 26, 0, z); l.rotation.y = s > 0 ? Math.PI : 0; scene.add(l); lampHeads.box(0.6, 0.12, 0.36, 0xFFFFFF, CT[0] + s * 26 - s * 1.25, 6.02, z); }
const lampM = new THREE.MeshLambertMaterial({ color: 0xFFF1C8, emissive: 0xFFD27A, emissiveIntensity: 0 }); scene.add(new THREE.Mesh(lampHeads.geo(), lampM));
// the defendant: a plinth, a placard, a giant block of ice with stacks of teal coins (USDC) inside
{ const b = new GB(); b.box(IB + 3, 1.0, IB + 3, 0xD6CEBC, DEF[0], 0.5, DEF[1]); b.box(IB + 2.4, 0.3, IB + 2.4, 0xE9E3D6, DEF[0], 1.15, DEF[1]); const m = b.mesh(); scene.add(m); stat.push([DEF[0] - IB / 2 - 2, DEF[0] + IB / 2 + 2, DEF[1] - IB / 2 - 2, DEF[1] + IB / 2 + 2, IB + 3, 'ice block']); }
const placard = new THREE.Mesh(new THREE.PlaneGeometry(6.4, 0.95), new THREE.MeshBasicMaterial({ map: textTex(768, 114, (g, w, h) => { g.fillStyle = '#2A2F3A'; g.fillRect(0, 0, w, h); g.strokeStyle = '#E2B24A'; g.lineWidth = 6; g.strokeRect(6, 6, w - 12, h - 12); g.fillStyle = '#FFD27A'; g.font = "800 62px Figtree"; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('THE DEFENDANT', w / 2, h / 2 + 3); }), toneMapped: false }));
placard.position.set(DEF[0], 0.55, DEF[1] + IB / 2 + 1.52); scene.add(placard);
const iceBlock = new THREE.Group(); iceBlock.position.set(DEF[0], 1.3, DEF[1]); scene.add(iceBlock);
{ const cb = new GB(), rr = rng(55); for (let s = 0; s < 7; s++) { const a = s * 0.9 + rr(), r = s ? 2.2 : 0, x = Math.cos(a) * r, z = Math.sin(a) * r * 0.9, n = 7 + Math.floor(rr() * 5); for (let k = 0; k < n; k++) cb.cyl(1.0, 1.0, 0.3, 14, 0xFFFFFF, x + (rr() - .5) * 0.15, 0.35 + k * 0.36, z + (rr() - .5) * 0.15, 0, rr(), 0); }
  for (let i = 0; i < 9; i++) cb.cyl(1.0, 1.0, 0.3, 14, 0xFFFFFF, (rr() - .5) * 5.4, 0.3 + rr() * 6, (rr() - .5) * 5.4, rr() * 2, rr(), rr() * 2);
  const coins = new THREE.Mesh(cb.geo(), TEAL); iceBlock.add(coins); }
const blockM = new THREE.MeshLambertMaterial({ color: 0xC8F1FF, emissive: 0x2A7A9A, emissiveIntensity: 0.32, transparent: true, opacity: 0.55, depthWrite: false });
const blockMesh = new THREE.Mesh(new THREE.BoxGeometry(IB, IB, IB), blockM); blockMesh.position.y = IB / 2; blockMesh.renderOrder = 3; iceBlock.add(blockMesh);
const edgeM = new THREE.LineBasicMaterial({ color: 0xEFFBFF, transparent: true, opacity: 0.9 }); const edges = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(IB, IB, IB)), edgeM); edges.position.y = IB / 2; iceBlock.add(edges);
const frostTop = (() => { const b = new GB(), rr = rng(19); for (let i = 0; i < 16; i++) b.ball(0.5 + rr() * 0.7, 0, 0xFFFFFF, (rr() - .5) * (IB - 1), IB + 0.1, (rr() - .5) * (IB - 1), 1, 0.35, 1); const m = new THREE.Mesh(b.geo(), new THREE.MeshLambertMaterial({ color: 0xF2FCFF, emissive: 0x6AB8D8, emissiveIntensity: 0.4 })); iceBlock.add(m); return m; })();
// Circle's worker who tries to push it
const modern = (i, extra = {}) => ({ robe: [0x34405A, 0x6A2E3E, 0x3F6A5A, 0x5A5A66, 0x7A5A3A, 0x2F4A6A, 0x8A3A3A, 0x3B6FA8, 0xB0603A, 0x4E7A3E][i % 10], skin: SKIN[i % 5], short: [0x231C18, 0x5A3E28, 0xC9A27A, 0x3A2A1E, 0x8A8A8A][i % 5], shirt: i % 2 ? 0xF4F2EC : undefined, ...extra });
const worker = person(modern(7, { robe: 0x2F6FB8, badge: true, s: 1.25 })); worker.position.set(DEF[0] - IB / 2 - 0.75, 1.3, DEF[1] + 1); scene.add(worker);
// the coin press and the glass case for the new coins
const mint = press(); mint.position.set(MINT[0], 0, MINT[1]); mint.scale.setScalar(2.4); mint.rotation.y = -0.3; scene.add(mint); mint.updateMatrixWorld(true); stat.push([MINT[0] - 3.5, MINT[0] + 3.5, MINT[1] - 3, MINT[1] + 3, 10, 'press']);
const ram = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.7, 1.0), new THREE.MeshLambertMaterial({ color: 0x8A8F99 })); ram.castShadow = true; scene.add(ram);
const MINTTOP = new THREE.Vector3(0, 0.75, 0).applyMatrix4(new THREE.Matrix4().compose(new THREE.Vector3(MINT[0], 0, MINT[1]), new THREE.Quaternion().setFromEuler(new THREE.Euler(0, -0.3, 0)), new THREE.Vector3(2.4, 2.4, 2.4)));
const caseG = new THREE.Group(); caseG.position.set(CASE[0], 0, CASE[1]); scene.add(caseG);
{ const b = new GB(); b.box(5.2, 1.0, 5.2, 0xD9D3C6, 0, 0.5, 0); b.box(5.4, 0.3, 5.4, 0xC9A23A, 0, 6.15, 0); for (const [x, z] of [[-2.5, -2.5], [2.5, -2.5], [-2.5, 2.5], [2.5, 2.5]]) b.box(0.24, 5.2, 0.24, 0xC9A23A, x, 3.5, z); caseG.add(b.mesh());
  const gl = new THREE.Mesh(new THREE.BoxGeometry(5.0, 5.0, 5.0), new THREE.MeshLambertMaterial({ color: 0xDFF4FF, emissive: 0x3A6A80, emissiveIntensity: 0.3, transparent: true, opacity: 0.24, depthWrite: false })); gl.position.y = 3.5; gl.renderOrder = 2; caseG.add(gl);
  const ge = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(5.0, 5.0, 5.0)), new THREE.LineBasicMaterial({ color: 0xF4FBFF, transparent: true, opacity: 0.8 })); ge.position.y = 3.5; caseG.add(ge); }
stat.push([CASE[0] - 3, CASE[0] + 3, CASE[1] - 3, CASE[1] + 3, 7, 'case']);
const NNEW = 4, newCoins = Array.from({ length: NNEW }, (_, i) => { const m = new THREE.Mesh(COING, TEAL); m.castShadow = true; m.visible = false; scene.add(m); return m; });
const lockG = new THREE.Group(); { const b = new GB(); b.box(1.4, 1.1, 0.4, 0xE2B24A, 0, 0, 0); b.add(new THREE.TorusGeometry(0.45, 0.13, 6, 12, Math.PI), 0xB8BEC8, new THREE.Matrix4().makeTranslation(0, 0.55, 0)); lockG.add(b.mesh()); } lockG.position.set(CASE[0], 4.0, CASE[1] + 2.75); lockG.visible = false; scene.add(lockG);
// the gavel over its block
const gavel = new THREE.Group(); { const b = new GB(); b.cyl(1.2, 1.2, 4.6, 16, 0x6B3F22, 0, 0, 0); b.cyl(1.3, 1.3, 0.55, 16, 0xC9A23A, 0, -1.85, 0); b.cyl(1.3, 1.3, 0.55, 16, 0xC9A23A, 0, 1.85, 0); b.cyl(0.3, 0.36, 7.8, 10, 0x7A4A28, 5.1, 0, 0, 0, 0, Math.PI / 2); gavel.add(b.mesh()); }
gavel.position.set(GV[0], 6.2, GV[1]); gavel.rotation.y = 0.55; scene.add(gavel);
{ const b = new GB(); b.cyl(2.6, 2.8, 1.6, 18, 0x6B3F22, 0, 0.8, 0); b.cyl(2.7, 2.7, 0.2, 18, 0xC9A23A, 0, 1.6, 0); const m = b.mesh(); m.position.set(GV[0], 0, GV[1]); scene.add(m); stat.push([GV[0] - 4, GV[0] + 4, GV[1] - 4, GV[1] + 4, 12, 'gavel']); }
// the freeze button (the question at the end) and its frost rings
const btn = bigButton(); btn.position.set(BTN[0], 0, BTN[1]); btn.scale.setScalar(2.3); scene.add(btn); btn.visible = false;
btn.userData.cap.material.color.setHex(0x7FD8FF); btn.userData.cap.material.emissive.setHex(0x1A6A9A); btn.userData.glow.material.color.setHex(0x9FE6FF);
const ringMs = [0, 1, 2].map(() => new THREE.MeshBasicMaterial({ color: 0x8FDFFF, transparent: true, opacity: 0, depthWrite: false, toneMapped: false, side: THREE.DoubleSide }));
const rings = ringMs.map(m => { const r = new THREE.Mesh(new THREE.RingGeometry(0.72, 1, 64).rotateX(-Math.PI / 2), m); r.position.set(BTN[0], 0.3, BTN[1]); r.renderOrder = 2; scene.add(r); return r; });
const frostM = new THREE.MeshBasicMaterial({ color: 0xA8E6FF, transparent: true, opacity: 0, depthWrite: false, toneMapped: false });
const frost = new THREE.Mesh(new THREE.CircleGeometry(1, 64).rotateX(-Math.PI / 2), frostM); frost.position.set(BTN[0], 0.25, BTN[1]); frost.renderOrder = 1; scene.add(frost);
const spotM = new THREE.MeshBasicMaterial({ color: 0xFFF4D0, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false, side: THREE.DoubleSide });
const spot = new THREE.Mesh(new THREE.ConeGeometry(8.5, 30, 24, 1, true).translate(0, -15, 0), spotM); spot.position.set(DEF[0], 31, DEF[1]); scene.add(spot);

// ───────────────────────── street life, clouds, sparkles
const CARS = [[0xC8423A, 52, 1, 8, 0], [0x2F6FB8, 52, -1, 9, 40], [0xE9C46A, -124, 1, 7, 150], [0x4C9A62, -124, -1, 8, 230], [0xEDEDED, 52, 1, 8.6, 300], [0x7A4FA0, -124, -1, 7, 90]].map(([col, z, dir, v, off]) => { const m = car(col, { boxy: true }); scene.add(m); return { m, z: z + dir * 2, dir, v, off }; });
const WALK = [[26, 44, 14, -2], [68, 45, -12, -2], [20, 26, 0, 12], [77, 22, 0, 12], [34, 48, 18, 0], [-20, -40, 14, -6], [10, -48, -12, 4]].map(([x, z, dx, dz], i) => { const m = person(modern(i, { badge: i % 3 === 0 })); scene.add(m); return { m, a: [x, z], b: [x + dx, z + dz], sp: 0.05 + i * 0.011, ph: i * 0.27 }; });
const guards = [[-9, VF + 5], [9, VF + 5]].map(([x, z], i) => { const m = person(modern(i + 6, { robe: 0x2B2F3A })); m.position.set(x, 0, z); m.rotation.y = -Math.PI / 2; scene.add(m); return m; });
const clouds = []; for (let i = 0; i < 18; i++) { const m = cloud(R); const far = i >= 10; m.position.set(far ? -500 + R() * 1100 : -260 + i * 60 + R() * 20, 80 + R() * 40, far ? -560 + R() * 200 : -340 + R() * 300); m.scale.setScalar(2.0 + R() * 2.2); m.userData.x0 = m.position.x; scene.add(m); clouds.push(m); }
const sparkT = (() => { const cv = document.createElement('canvas'); cv.width = cv.height = 64; const g = cv.getContext('2d'); g.translate(32, 32); g.fillStyle = '#fff'; for (let k = 0; k < 2; k++) { g.rotate(Math.PI / 2 * k); g.beginPath(); g.moveTo(0, -30); g.quadraticCurveTo(3, -3, 30, 0); g.quadraticCurveTo(3, 3, 0, 30); g.quadraticCurveTo(-3, 3, -30, 0); g.quadraticCurveTo(-3, -3, 0, -30); g.fill(); } const tx = new THREE.CanvasTexture(cv); tx.colorSpace = THREE.SRGBColorSpace; return tx; })();
const sparks = []; for (let i = 0; i < 100; i++) { const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: sparkT, color: 0xFFE9A8, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false })); sp.userData = { ph: R() * 6.28, w: 3 + R() * 4, dx: (R() - 0.5) * 2, dz: (R() - 0.5) * 2, k: R() }; scene.add(sp); sparks.push(sp); }

// ───────────────────────── camera path (spherical keys around a target; `up` tilts the view so the subject sits lower in the frame)
const DEFT = [DEF[0], 5.2, DEF[1]];
const CAM = [
  { t: 0, tg: [48, 9, 16], d: 96, az: 13, el: 6, up: 0.075 },                                       // the cover: the court at dusk, the money in ice on trial in front
  { t: T.bigOut, tg: [48, 8.5, 18], d: 80, az: 10, el: 6.5, up: 0.07, mv: 1 },
  { t: T.itself1 + 0.55, tg: DEFT, d: 42, az: 6, el: 9, up: 0.05, mv: 1 },                            // push in to the defendant
  { t: T.b2 + 0.55, tg: [24, 54, -30], d: 150, az: 4, el: 26, up: 0.02, mv: 1 },                      // crane over the roofs to the vault
  { t: T.hack + 0.45, tg: [6, 30, -112], d: 208, az: -12, el: 7, up: 0.04, mv: 1 },                   // Binance's vault: the coins pour out to the thieves
  { t: T.record + 0.45, tg: [-8, 44, -168], d: 200, az: -8, el: 6, up: 0.03, mv: 1 },
  { t: T.thieves3 + 0.3, tg: [TW[0], 62, TW[1]], d: 100, az: 22, el: 3, up: 0.03, mv: 1 },            // the thieves' wallets under the storm
  { t: T.denies + 0.5, tg: [TW[0], 62, TW[1]], d: 92, az: 14, el: 3, up: 0.03 },
  { t: T.b5 + 0.5, tg: [TW[0] + 40, 210, TW[1] + 150], d: 40, az: 20, el: -42, up: 0, mv: 1 },        // sky wipe back to the court
  { t: T.kind + 0.25, tg: [DEF[0] - 10, 160, DEF[1] + 40], d: 40, az: 10, el: -30, up: 0, mv: 1 },
  { t: T.money5 + 0.3, tg: DEFT, d: 46, az: -14, el: 11, up: 0.05, mv: 1 },                          // down to the defendant
  { t: T.defendant + 0.6, tg: DEFT, d: 42, az: -8, el: 10, up: 0.05 },
  { t: T.billion6 + 0.2, tg: [DEF[0], 5.4, DEF[1]], d: 36, az: 6, el: 8, up: 0.05, mv: 1 },            // close: the teal coins in the ice
  { t: T.usdc + 0.6, tg: [DEF[0], 5.4, DEF[1]], d: 33, az: 12, el: 8, up: 0.05 },
  { t: T.cant + 0.15, tg: [DEF[0] - 2.5, 4.6, DEF[1] + 1], d: 32, az: -40, el: 9, up: 0.05, mv: 1 },   // the maker pushes: it won't budge
  { t: T.maker + 0.5, tg: [DEF[0] - 2.5, 4.6, DEF[1] + 1], d: 30, az: -48, el: 9, up: 0.05 },
  { t: T.newW + 0.2, tg: [(MINT[0] + CASE[0]) / 2, 4.5, 21], d: 30, az: -12, el: 11, up: 0.05, mv: 1 },  // the press makes new coins into the case
  { t: T.judge, tg: [47.8, 5.5, 25], d: 74, az: -2, el: 12, up: 0.06, mv: 1 },                       // pull back: the case, the block, the gavel waiting
  { t: T.yes8 + 0.45, tg: [47.8, 5.5, 25], d: 71, az: 2, el: 12, up: 0.06 },
  { t: T.b9 + 0.75, tg: [10, 60, -70], d: 175, az: 6, el: 24, up: 0.03, mv: 1 },                     // crane up over the city
  { t: T.bitcoin + 0.2, tg: [TW[0], 62, TW[1]], d: 92, az: -10, el: 4, up: 0.03, mv: 1 },            // the wallets: bitcoin and ether, the freeze that fails
  { t: T.freeze9 + 0.7, tg: [TW[0], 62, TW[1]], d: 86, az: -2, el: 4, up: 0.03 },
  { t: T.wallets10 + 0.6, tg: [TW[0], 74, TW[1] + 10], d: 250, az: 10, el: 9, up: 0.03, mv: 1 },     // the swarm: 27,000 wallets, meme coins
  { t: T.coins10 + 0.4, tg: [TW[0], 74, TW[1] + 10], d: 228, az: 17, el: 9, up: 0.03 },
  { t: T.theft11 + 0.3, tg: [TW[0], 70, TW[1]], d: 206, az: 30, el: 8, up: 0.03, mv: 1 },
  { t: T.b12 + 0.55, tg: [40, 150, -60], d: 50, az: 10, el: -24, up: 0, mv: 1 },                     // crane back over the city
  { t: T.over12 + 0.45, tg: [48, 9, 16], d: 112, az: 15, el: 9, up: 0.075, mv: 1 },                   // the court at sunset
  { t: T.story + 0.9, tg: [48, 9, 16], d: 104, az: 12, el: 8, up: 0.075 },
  { t: T.cta - 0.4, tg: [48, 8, 20], d: 96, az: 9, el: 8, up: 0.07 },
  { t: T.button + 0.1, tg: [BTN[0], 3.4, BTN[1]], d: 30, az: 6, el: 23, up: -0.04, mv: 1 },           // the freeze button (looking down, so the court's sign stays above the captions)
  { t: DUR + 0.5, tg: [BTN[0], 3.4, BTN[1]], d: 27, az: 2, el: 23, up: -0.04 },
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
.card em{font-style:normal;color:#FFC84A;} .card s{text-decoration:none;color:#FF8A7A;} .card u{text-decoration:none;color:#9BE0F0;} .card small{display:block;margin-top:8px;font:600 18px/1 'Inter',sans-serif;letter-spacing:.08em;color:rgba(255,255,255,.6);}
.tag.dn{color:#fff;background:#D9483B;border-color:#D9483B;} .tag.dn b{color:#fff;} .tag.ice{color:#062A36;background:#BFEFFF;border-color:#BFEFFF;} .tag.btc{color:#2A1600;background:#F2A23A;border-color:#F2A23A;} .tag.eth{color:#fff;background:#6C74D8;border-color:#6C74D8;} .tag.meme{color:#fff;background:#D9478A;border-color:#D9478A;}
.stamp{font:900 64px/1 'Figtree',sans-serif;letter-spacing:.06em;color:#FF5A4A;border:6px solid #FF5A4A;padding:8px 22px 6px;border-radius:14px;background:rgba(40,6,4,.35);text-shadow:0 0 18px rgba(255,90,70,.6);}
.stamp.ice{color:#BFEFFF;border-color:#BFEFFF;background:rgba(4,30,40,.35);text-shadow:0 0 18px rgba(140,220,255,.7);}
.cnt{text-align:center;background:rgba(8,10,26,.9);border:2px solid rgba(255,225,160,.65);padding:22px 40px 20px;border-radius:26px;box-shadow:0 14px 40px rgba(5,7,20,.5);}
.cnt .v{font:800 96px/1 'JBM',monospace;letter-spacing:-3px;color:#FFC84A;} .cnt .v.r{color:#FF6B5B;} .cnt .l{margin-top:12px;font:700 30px/1.25 'Figtree',sans-serif;color:#fff;white-space:pre;} .cnt .s{margin-top:12px;font:600 18px/1 'Inter',sans-serif;letter-spacing:.08em;color:rgba(255,255,255,.6);}
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
const tagCourt = mk('tag', 'US federal court · Washington, D.C.'), tagDef = mk('tag am', 'on trial: <b>the money</b>');
const tagVault = mk('tag', 'BINANCE'), tagRecord = mk('tag am', 'biggest crypto theft <b>on record</b>'), tagThief = mk('tag dn', "the thieves' wallets");
const cardFbi = mk('card', `FBI: <em>North Korea</em> is responsible<small>FBI alert · 31 Oct 2026</small>`), cardNk = mk('card', `North Korea: <s>denies it</s><small>3 Nov 2026</small>`);
const cardRem = mk('card', `Civil forfeiture: the case is\nagainst the <em>property</em>, not a person\n<small>US Justice Department · FBI</small>`);
const cardUsdc = mk('card', `<em>$1.1 billion+</em> in USDC\nin 36 wallets on 18 blockchains\n<small>The Block · Fox Business · Gulf News · 23–24 Nov 2026</small>`);
const tagIce = mk('tag ice', 'USDC · frozen by Circle'), tagWorker = mk('tag', 'Circle · makes USDC'), stampMove = mk('stamp', "CAN'T MOVE");
const cardNew = mk('card', `Circle agreed to issue <em>new</em> USDC\nto the US, if the court orders it\n<small>The Block · Gulf News · 24 Nov 2026</small>`);
const tagCase = mk('tag ice', 'promised · new USDC'), tagJudge = mk('tag am', 'waiting for <b>the judge</b>');
const tagBtc = mk('tag btc', 'bitcoin'), tagEth = mk('tag eth', 'ether'), stampNo = mk('stamp ice', 'NO FREEZE BUTTON');
const cnt27 = mk('cnt', `<div class="v"></div><div class="l">wallets, on 16+ blockchains</div><div class="s">ELLIPTIC · 23 NOV 2026</div>`); const cnt27v = cnt27.querySelector('.v');
const tagMeme = mk('tag meme', 'home-made meme coins');
const cnt2 = mk('cnt', `<div class="v r"></div><div class="l">still in wallets\ntied to the theft</div><div class="s">ELLIPTIC ESTIMATE · 23 NOV 2026</div>`); const cnt2v = cnt2.querySelector('.v');
const title = mk('title', '<div class="s">THE STORY OF</div><div class="n">The Money\n<em>on Trial</em></div>');
const lesson = mk('lesson', `Frozen isn't <em>returned</em>.`);
const ctaChip = mk('chip am', 'what do you think?'), tagBtn = mk('tag ice', 'a freeze button <b>for every coin?</b>');
const boxes = [0, 1].map(() => { const e = mk('cbox', '<span class="in"></span><span class="post">Post</span>'); return { e, inn: e.querySelector('.in'), post: e.querySelector('.post') }; });
const foot = document.getElementById('foot');
foot.textContent = "Sources: Reuters, The Block, Fox Business, Gulf News (23–24 Nov 2026) · AP (12 Nov) · Elliptic (23 Nov) · US DOJ, FBI\n$6.3 bn is Binance's figure · FBI attribution denied by North Korea · the court has not ruled · not advice";
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
  const CH = [[T.bigOut + 0.05, T.b2 - 0.1, 'Washington, D.C. · 23 Nov 2026'], [T.b2 + 0.5, T.b3 - 0.1, 'Binance · 29 Oct 2026'], [T.b3 + 0.05, T.b5 - 0.1, 'who did it?'],
    [T.kind + 0.3, T.b6 - 0.1, 'how this kind of case works'], [T.b6 + 0.05, T.b8 - 0.1, 'the case, filed 23 Nov 2026'], [T.b8 + 0.05, T.b9 - 0.1, 'Circle, the maker of USDC'],
    [T.bitcoin - 0.2, T.b11 - 0.1, 'the rest of the money'], [T.b11 + 0.05, T.b12 - 0.1, 'as of 23 Nov 2026'], [T.over12 - 0.2, T.b13 - 0.1, 'as of 24 Nov 2026']];
  for (const [a, b, s] of CH) { const o = win(t, a, b, 0.22, 0.22); if (o > co) { co = o; ct = s; cp = pop(t, a); } }
  if (ct) setTxt(chip, ct); put(chip, W / 2, 472, co, cp);
  // 1 — the court and the defendant
  { const p = p3([CT[0], 17, CT[1]], win(t, T.bigOut, T.b2 - 0.1, 0.3, 0.25)); put(tagCourt, clampX(p[0], 300), clampY(p[1], 600, 1400), p[2], pop(t, T.bigOut)); }
  { const p = p3([DEF[0] + IB / 2, 1.3 + IB * 0.62, DEF[1] + IB / 2], Math.max(win(t, T.suing, T.b2 - 0.05, 0.25, 0.25), win(t, T.defendant, T.b6 - 0.05, 0.25, 0.25))); put(tagDef, clampX(p[0] + 70, 230), clampY(p[1], 620, 1380), p[2], pop(t, t > T.b5 ? T.defendant : T.suing)); }
  // 2–4 — the vault, the record, the thieves, the FBI and North Korea
  { const p = p3([V[0], 39, V[1]], win(t, T.binance, T.b3, 0.3, 0.3)); put(tagVault, clampX(p[0]), clampY(p[1], 560, 1400), p[2], pop(t, T.binance)); }
  { const p = p3([TW[0], 84, TW[1]], win(t, T.biggest, T.b3 + 0.1, 0.25, 0.25)); put(tagRecord, clampX(p[0], 300), clampY(p[1], 620, 1380), p[2], pop(t, T.biggest)); }
  { const c = WPOS[4], p = p3([c[0], c[1] + 12, c[2]], win(t, T.thieves3, T.b5 - 0.05, 0.25, 0.25)); put(tagThief, clampX(p[0]), clampY(p[1], 620, 1100), p[2], pop(t, T.thieves3)); }
  put(cardFbi, W / 2, 1180, win(t, T.fbi - 0.05, T.b5 - 0.05, 0.25, 0.25), pop(t, T.fbi - 0.05));
  put(cardNk, W / 2, 1330, win(t, T.denies - 0.1, T.b5 - 0.05, 0.25, 0.25), pop(t, T.denies - 0.1));
  // 5 — civil forfeiture: the property is the defendant
  put(cardRem, W / 2, 1300, win(t, T.money5, T.b6 - 0.05, 0.25, 0.25), pop(t, T.money5));
  // 6 — the money in court: over $1.1bn of USDC, frozen
  put(cardUsdc, W / 2, 1300, win(t, T.billion6 - 0.05, T.b7 - 0.05, 0.25, 0.25), pop(t, T.billion6 - 0.05));
  { const p = p3([DEF[0] - 3.5, 7.5, DEF[1] + 4], win(t, T.frozen6, T.b7 - 0.05, 0.25, 0.25)); put(tagIce, clampX(p[0], 220), clampY(p[1], 620, 1150), p[2], pop(t, T.frozen6)); }
  // 7 — the maker can't move it
  { const p = p3([worker.position.x, 4.4, worker.position.z], win(t, T.frozen7, T.b8 - 0.05, 0.25, 0.25)); put(tagWorker, clampX(p[0], 220), clampY(p[1] - 30, 620, 1300), p[2], pop(t, T.frozen7)); }
  put(stampMove, W / 2, 1220, win(t, T.move, T.b8 - 0.05, 0.12, 0.25), pop(t, T.move, 0.25) * 1.0, '-50%', '-50%'); stampMove.style.rotate = '-6deg';
  // 8 — new coins, on hold for the judge
  put(cardNew, W / 2, 1320, win(t, T.agreed, T.b9 - 0.05, 0.25, 0.25), pop(t, T.agreed));
  { const p = p3([CASE[0], 8.2, CASE[1]], win(t, T.ones, T.b9 - 0.05, 0.25, 0.25)); put(tagCase, clampX(p[0], 220), clampY(p[1], 620, 1150), p[2], pop(t, T.ones)); }
  { const p = p3([GV[0], 12.5, GV[1]], win(t, T.judge - 0.05, T.b9 - 0.05, 0.25, 0.25)); put(tagJudge, clampX(p[0], 250), clampY(p[1], 620, 1150), p[2], pop(t, T.judge - 0.05)); }
  // 9 — bitcoin and ether: no freeze button
  { const c = WPOS[3], p = p3([c[0] - 6, c[1] + 9, c[2]], win(t, T.bitcoin, T.b10 - 0.05, 0.2, 0.25)); put(tagBtc, clampX(p[0], 200), clampY(p[1], 640, 1150), p[2], pop(t, T.bitcoin)); }
  { const c = WPOS[5], p = p3([c[0] + 6, c[1] + 11, c[2]], win(t, T.ether, T.b10 - 0.05, 0.2, 0.25)); put(tagEth, clampX(p[0], 200), clampY(p[1], 640, 1150), p[2], pop(t, T.ether)); }
  put(stampNo, W / 2, 1240, win(t, T.freeze9 + 0.25, T.b10 + 0.2, 0.12, 0.25), pop(t, T.freeze9 + 0.25, 0.25)); stampNo.style.rotate = '-5deg';
  // 10 — 27,000 wallets; meme coins
  { const o = win(t, T.n27 - 0.1, T.b11 - 0.05, 0.25, 0.25), u = eo(seg(t, T.n27 - 0.05, T.wallets10 + 0.3)); setHTML(cnt27v, (Math.round(27000 * u / 100) * 100).toLocaleString('en-US') + (u > 0.999 ? '+' : '')); put(cnt27, W / 2, 1250, o, pop(t, T.n27 - 0.1)); }
  { const s = memes[3].userData.s, p = p3([s.to[0], s.to[1] + 16, s.to[2]], win(t, T.meme, T.b11 - 0.05, 0.2, 0.25)); put(tagMeme, clampX(p[0], 250), clampY(p[1], 640, 1100), p[2], pop(t, T.meme)); }
  // 11 — over $2 billion still in wallets tied to the theft
  { const o = win(t, T.two - 0.1, T.b12 - 0.05, 0.25, 0.25), u = eo(seg(t, T.two - 0.05, T.billion11 + 0.4)); setHTML(cnt2v, `$${(2.2 * u).toFixed(1)} bn`); put(cnt2, W / 2, 1250, o, pop(t, T.two - 0.1) * (1 + 0.04 * win(t, T.still, T.still + 0.3, 0.1, 0.2))); }
  // 13 — title and lesson; 14 — the question
  put(title, W / 2, 640, win(t, T.story, T.cta - 0.1, 0.4, 0.3), 0.94 + 0.06 * eo(seg(t, T.story, T.story + 0.6)));
  put(lesson, W / 2, 1180, win(t, T.frozen13, T.cta - 0.15, 0.3, 0.25), pop(t, T.frozen13));
  put(ctaChip, W / 2, 472, seg(t, T.should, T.should + 0.3), pop(t, T.should));
  { const p = p3([BTN[0], 6.2, BTN[1]], seg(t, T.button, T.button + 0.3)); put(tagBtn, clampX(p[0], 300), clampY(p[1], 620, 1150), p[2], pop(t, T.button)); }
  [[T.yes, 'YES', T.postA], [T.no, 'NO', T.postB]].forEach(([t0, word, tp], i) => {
    const bx = boxes[i], L = word.length, n = Math.min(L, Math.floor(c01((t - t0) / (0.12 * L)) * (L + 0.001))), typed = word.slice(0, n), caret = (n < L || Math.floor(t * 2.4) % 2) && t < tp ? '<i></i>' : '';
    setHTML(bx.inn, typed ? `<b>${typed}</b>${caret}` : `<em>Add a comment…</em>${caret}`); const sent = t > tp; const pc = sent ? 'post on sent' : n === L ? 'post on' : 'post'; if (bx.post.className !== pc) bx.post.className = pc; setTxt(bx.post, sent ? 'Posted ✓' : 'Post');
    const ts = i ? T.no - 0.35 : T.comment; put(bx.e, W / 2, 1330 + i * 132, seg(t, ts, ts + 0.3), pop(t, ts) * (1 + 0.06 * win(t, tp, tp + 0.3, 0.08, 0.2)));
  });
}

// ───────────────────────── one frame
const hopY = (hops, t, h = 0.5) => { let y = 0; for (const t0 of hops) { const u = (t - t0) / 0.38; if (u > 0 && u < 1) y = Math.max(y, Math.sin(u * Math.PI) * h); } return y; };
const doorU = t => eio(seg(t, T.doorOpen, T.doorOpen + 1.0));
const heapK = t => t < T.theftA ? 1 : 1 - 0.85 * eio(seg(t, T.theftA + 0.3, T.theftB + 0.6));
function newCoinAt(i, t) {   // a new coin pops out of the press and arcs into the glass case
  const t0 = T.stamps[i] + 0.12, u = seg(t, t0, t0 + 0.75); if (t < t0) return null;
  const s = [MINTTOP.x, MINTTOP.y + 0.6, MINTTOP.z], e = [CASE[0] + (i % 2 - 0.5) * 1.6, 1.4 + Math.floor(i / 2) * 0.75, CASE[1] + (i < 2 ? -0.6 : 0.6)];
  return [lerp(s[0], e[0], eo(u)), lerp(s[1], e[1], u) + Math.sin(u * Math.PI) * 5.5, lerp(s[2], e[2], eo(u)), u];
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
  // the vault door opens for the theft; the heap empties
  { const u = doorU(t); door.userData.pivot.rotation.y = -1.75 * u; const k = heapK(t); heapCoins.scale.set(Math.max(0.05, k), Math.max(0.05, k), 1); heapCoins.position.y = DOOR[1] - (1 - k) * DR * 0.55; heapCoins.visible = k > 0.06; heapM.opacity = 0.3 + 0.7 * k; }
  // the theft: gold coins from the vault to the wallets
  { let n = 0; for (let i = 0; i < NC; i++) { const p = coinAt(i, t); if (!p) continue; const c = CR[i]; _e.set(t * c.sp + c.ph, c.ph, t * c.sp * 0.7); _q.setFromEuler(_e); _p.set(p[0], p[1], p[2]); _s.setScalar(1); _m4.compose(_p, _q, _s); coinsG.setMatrixAt(n++, _m4); } coinsG.count = n; coinsG.instanceMatrix.needsUpdate = true; }
  // the wallets bob; bitcoin and ether circle them; the freeze beam; the ice that can't hold; the storm and the searchlight
  const shat = seg(t, T.shatter, T.shatter + 0.15);
  wallets.forEach((m, i) => { m.position.y = WPOS[i][1] + Math.sin(t * 1.3 + i) * 0.6; m.rotation.z = Math.sin(t * 0.9 + i * 2) * 0.05; m.visible = true; });
  { const o = win(t, T.b9 + 0.6, T.swarmB, 0.4, 0.5); let nb = 0, ne = 0;
    if (o > 0.01) for (let k = 0; k < NO * 2; k++) { const i = k % NWAL, w = WPOS[i], a = t * 1.6 + k * 2.399, r = 5.5 + (k % 3) * 0.9, sc = o * (1 + 0.25 * Math.sin(t * 5 + k));
      _e.set(Math.PI / 2, a, 0.3); _q.setFromEuler(_e); _p.set(w[0] + Math.cos(a) * r, w[1] + Math.sin(t * 1.3 + i) * 0.6 + Math.sin(a * 2) * 1.2, w[2] + Math.sin(a) * r); _s.setScalar(0.8 * sc); _m4.compose(_p, _q, _s);
      if (k % 2) { if (ne < NO) orbE.setMatrixAt(ne++, _m4); } else if (nb < NO) orbB.setMatrixAt(nb++, _m4); }
    orbB.count = nb; orbE.count = ne; orbB.instanceMatrix.needsUpdate = orbE.instanceMatrix.needsUpdate = true; }
  { const o = win(t, T.freezeTry, T.shatter + 0.1, 0.15, 0.35); fbeamM.opacity = 0.28 * o; fbeam.visible = o > 0.01; fbeam.scale.set(1, 0.2 + 0.8 * eo(seg(t, T.freezeTry, T.freezeTry + 0.35)), 1); }
  tryIce.forEach((m, i) => { const u = seg(t, T.freezeTry + 0.15 + i * 0.03, T.freezeTry + 0.5 + i * 0.03), k = Math.max(0.01, back(u) * 0.85 * (1 - shat)); m.visible = u > 0.001 && shat < 1; m.scale.setScalar(k); m.position.y = WPOS[i][1] + Math.sin(t * 1.3 + i) * 0.6; m.rotation.set(0.3, i + t * 0.4, 0.2 + Math.sin(t * 30 + i) * 0.04 * u); });
  { const u = seg(t, T.shatter, T.shatter + 1.1); let n = 0; if (u > 0 && u < 1) for (let k = 0; k < NSH; k++) { const sd2 = SHD[k], w = WPOS[sd2.w], d = sd2.sp * u * (1 - 0.35 * u); _e.set(t * 4 + sd2.r, t * 3 + sd2.r, 0); _q.setFromEuler(_e); _p.set(w[0] + sd2.v[0] * d, w[1] + sd2.v[1] * d - 9 * u * u, w[2] + sd2.v[2] * d); _s.setScalar(1.1 * (1 - u)); _m4.compose(_p, _q, _s); shards.setMatrixAt(n++, _m4); } shards.count = n; shards.instanceMatrix.needsUpdate = true; }
  storm.forEach((m, i) => { m.position.x = m.userData.x0 + Math.sin(t * 0.3 + i) * 3; m.material.color.setRGB(0.42, 0.42, 0.5); m.material.opacity = 0.95; });
  { const o = win(t, T.b4 - 0.3, T.b5 + 0.2, 0.4, 0.4); beamM.opacity = 0.16 * o; beam.visible = o > 0.01; beam.rotation.set(Math.PI - 0.45 + Math.sin(t * 1.1) * 0.12, 0, 0.35 + Math.sin(t * 0.8) * 0.2); }
  slotM.color.setRGB(1, 0.35 + 0.15 * Math.sin(t * 6), 0.23).multiplyScalar(1 + 0.6 * win(t, T.b11, T.b12, 0.3, 0.3) * (0.5 + 0.5 * Math.sin(t * 8)));
  // the swarm and the meme coins
  { let n = 0; for (let i = 0; i < NS; i++) { const q = SW[i], u = seg(t, q.td, q.td + 0.9); if (u <= 0) continue; const a = WPOS[q.p], e2 = eo(u);
      _e.set(0, q.ry + t * 0.2, Math.sin(t + q.ph) * 0.08); _q.setFromEuler(_e); _p.set(lerp(a[0], q.to[0], e2), lerp(a[1], q.to[1], e2) + Math.sin(u * Math.PI) * 10 + Math.sin(t * 1.2 + q.ph) * 0.8 * u, lerp(a[2], q.to[2], e2)); _s.setScalar(q.sc * (0.4 + 0.6 * e2) * 1.6); _m4.compose(_p, _q, _s); swarm.setMatrixAt(n++, _m4); }
    swarm.count = n; swarm.instanceMatrix.needsUpdate = true; }
  memes.forEach((sp, i) => { const d = sp.userData, u = seg(t, d.t0, d.t0 + 0.4), o = u * (1 - seg(t, T.b12 + 0.4, T.b12 + 0.9)); sp.visible = o > 0.01; if (!sp.visible) return; sp.position.set(d.s.to[0], d.s.to[1] + d.dy * eo(u) + Math.sin(t * 2 + d.ph) * 0.8, d.s.to[2]); sp.scale.setScalar(9 * back(u)); sp.material.opacity = o; sp.material.rotation = Math.sin(t * 3 + d.ph) * 0.25; });
  // the court: the defendant's block (frost at "frozen", a shake when pushed), the spotlight, the worker, the press, the case, the gavel
  { const pu = win(t, T.pushA + 0.3, T.pushB, 0.2, 0.3); iceBlock.position.x = DEF[0] + Math.sin(t * 38) * 0.035 * pu; frostTop.scale.setScalar(0.6 + 0.4 * eo(seg(t, T.ice6, T.ice6 + 0.6))); blockM.emissiveIntensity = 0.32 + 0.35 * win(t, T.ice6, T.b7, 0.2, 0.5); }
  { const o = Math.max(win(t, T.defendant - 0.3, T.b6 + 0.2, 0.3, 0.4), 0.55 * win(t, T.story, DUR + 1, 0.6, 0.1)); spotM.opacity = 0.13 * o; spot.visible = o > 0.01; }
  { const pu = win(t, T.pushA, T.pushB, 0.25, 0.35), shove = Math.max(0, Math.sin((t - T.pushA) * 7.5)) * pu; worker.position.x = DEF[0] - IB / 2 - 0.75 - 0.25 * (1 - pu) + 0.12 * shove; worker.rotation.z = -0.42 * pu; worker.position.y = 1.3 + hopY([T.move + 0.05, T.maker + 0.05], t, 0.18); worker.visible = t > T.b6 - 1.0 && t < T.b9 + 0.6 || t < T.b2; }
  { let ry = 3.35; for (const t0 of T.stamps) { const u = seg(t, t0 - 0.18, t0 + 0.3); if (u > 0 && u < 1) ry = Math.min(ry, u < 0.38 ? lerp(3.35, 1.05, u / 0.38) : lerp(1.05, 3.35, (u - 0.38) / 0.62)); }
    const v = new THREE.Vector3(0, ry, 0).applyMatrix4(mint.matrixWorld); ram.position.copy(v); ram.rotation.y = -0.3; }
  newCoins.forEach((m, i) => { const p = newCoinAt(i, t); m.visible = !!p; if (!p) return; m.position.set(p[0], p[1], p[2]); m.rotation.set(p[3] < 1 ? t * 9 + i : 0, 0, p[3] < 1 ? t * 5 : 0); });
  lockG.visible = t > T.judge - 0.2; lockG.scale.setScalar(pop(t, T.judge - 0.2, 0.3) || 0.01);
  { const up = eo(seg(t, T.gavelUp, T.gavelUp + 0.5)); gavel.position.y = 6.2 + 3.4 * up + Math.sin(t * 2.2) * 0.25 * up; gavel.rotation.z = 0.55 * up + Math.sin(t * 1.7) * 0.05 * up; }
  // the freeze button (the question): it appears, glows, and is pressed when YES and NO are posted; frost rings spread over the plaza
  btn.visible = t > T.cta - 0.6; btn.scale.setScalar(2.3 * (t > T.cta - 0.6 ? pop(t, T.freeze14 - 0.2, 0.35) || 0.01 : 0.01));
  { const press1 = win(t, T.postA - 0.05, T.postA + 0.25, 0.08, 0.2), press2 = win(t, T.postB - 0.05, T.postB + 0.25, 0.08, 0.2); btn.userData.cap.position.y = btn.userData.capY - 0.28 * Math.max(press1, press2); btn.userData.glow.material.opacity = 0.35 + 0.35 * Math.sin(t * 6); }
  rings.forEach((r, k) => { const t0 = (k < 2 ? T.postA : T.postB) + k * 0.3, u = seg(t, t0, t0 + 2.4); r.visible = u > 0 && u < 1; r.scale.setScalar(2 + eo(u) * 40); ringMs[k].opacity = 0.9 * (1 - u * u * u); });
  { const u = seg(t, T.postA, T.postA + 2.0), o = c01(u * 3); frostM.opacity = 0.38 * o; frost.visible = o > 0.01; frost.scale.setScalar(2 + eo(u) * 26); }
  // cars, walkers, guards
  for (const c of CARS) { const L = 700, x = ((c.off + t * c.v) % L) - L / 2; c.m.position.set(c.dir * x, 0, c.z); c.m.rotation.y = c.dir > 0 ? 0 : Math.PI; }
  WALK.forEach((w, i) => { const u = (Math.sin((t * w.sp + w.ph) * Math.PI * 2) + 1) / 2, dir = Math.cos((t * w.sp + w.ph) * Math.PI * 2) > 0 ? 1 : -1; const x = lerp(w.a[0], w.b[0], u), z = lerp(w.a[1], w.b[1], u); w.m.position.set(x, Math.abs(Math.sin(t * 7 + i)) * 0.06, z); w.m.rotation.y = Math.atan2(-(w.b[1] - w.a[1]) * dir, (w.b[0] - w.a[0]) * dir); });
  guards.forEach((m, i) => { m.position.y = hopY([T.binance + 0.3 + i * 0.08], t, 0.25); m.rotation.y = -Math.PI / 2 + 0.6 * win(t, T.binance, T.record + 0.5, 0.2, 0.4) * (i ? -1 : 1); });
  // clouds
  for (const c of clouds) { c.position.x = c.userData.x0 + t * 1.2; c.material.opacity = 0.9 - 0.5 * night; const k = lerp(1, 0.45, night); c.material.color.setRGB(lerp(s.hor[0], 1, 0.55) * k, lerp(s.hor[1], 1, 0.55) * k, lerp(s.hor[2], 1, 0.55) * k * 1.05); }
  // sparkles: frost on the block; the new coins; the shattered ice; the meme coins; the posted answer
  { let k = 0; const put3 = (x, y, z, sz, on, col) => { const sp = sparks[k++]; if (!sp) return; const tw = Math.pow(Math.abs(Math.sin(t * sp.userData.w + sp.userData.ph)), 3); sp.position.set(x, y, z); sp.scale.setScalar(sz * (0.25 + tw)); sp.material.opacity = on * (0.3 + 0.7 * tw); sp.material.color.setHex(col); sp.visible = on > 0.01; };
    const s1 = win(t, T.ice6, T.b7 + 0.4, 0.2, 0.5); for (let i = 0; i < 24; i++) { const sp = sparks[i].userData; put3(DEF[0] + sp.dx * IB * 0.55, 1.3 + IB * (0.15 + 0.85 * sp.k), DEF[1] + IB / 2 + 0.3, 1.1, s1, 0xCFF4FF); }
    const s2 = win(t, T.stamps[0] + 0.5, T.b9, 0.3, 0.4); for (let i = 0; i < 14; i++) { const a = i * 0.45 + t * 0.8; put3(CASE[0] + Math.cos(a) * 3.2, 3.5 + Math.sin(a * 1.7) * 2.2, CASE[1] + 2.8, 0.9, s2, 0xBFF6EC); }
    const s3 = win(t, T.shatter, T.b10 + 0.2, 0.05, 0.5); for (let i = 0; i < 20; i++) { const sp = sparks[i + 40].userData, w = WPOS[i % NWAL]; put3(w[0] + sp.dx * 7, w[1] + sp.dz * 6, w[2] + 3, 2.2, s3, 0xCFF4FF); }
    const s4 = win(t, T.memeA, T.b11, 0.1, 0.4); for (let i = 0; i < 18; i++) { const d = memes[i].userData; put3(d.s.to[0] + sparks[i + 60].userData.dx * 5, d.s.to[1] + d.dy + 3, d.s.to[2], 3.0, s4 * seg(t, d.t0, d.t0 + 0.2), 0xFFB8DA); }
    const s5 = win(t, T.postA, DUR + 1, 0.3, 0.1); for (let i = 0; i < 16; i++) { const ph = (t * 0.35 + i / 16) % 1, a = i * 2.4; put3(BTN[0] + Math.cos(a) * (2 + ph * 2), 3 + ph * 4, BTN[1] + Math.sin(a) * (1.4 + ph), 0.6 + 0.3 * (1 - ph), s5 * Math.sin(ph * Math.PI), 0xCFF4FF); }
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
  stamps: T.stamps.map(x => +x.toFixed(3)), coinsIn: T.stamps.map(x => +(x + 0.87).toFixed(3)),
  typingA: [0, 1, 2].map(i => +(T.yes + (i + 0.5) * 0.12).toFixed(3)), typingB: [0, 1].map(i => +(T.no + (i + 0.5) * 0.12).toFixed(3)),
  ices: WPOS.map((_, i) => +(T.freezeTry + 0.15 + i * 0.03).toFixed(3)), memes: memes.map(m => +m.userData.t0.toFixed(3)),
  rings: [0, 1, 2].map(k => +((k < 2 ? T.postA : T.postB) + k * 0.3).toFixed(3)), postA: +T.postA.toFixed(3), postB: +T.postB.toFixed(3),
};
document.fonts.ready.then(() => Promise.all(['700 64px Figtree', '900 190px Fraunces', '800 30px JBM', '700 22px Inter', '700 78px Fraunces', '800 54px Figtree', '600 34px Figtree', '500 18px Inter', '900 128px JBM', '800 46px Inter', '900 150px Figtree', '900 112px Fraunces', '800 172px JBM', '700 34px Figtree', '800 92px JBM', '900 64px Figtree', '800 96px JBM', '800 66px Figtree', '800 62px Figtree'].map(f => document.fonts.load(f)))).then(() => { TEXS.forEach(f => f()); fitHook(); renderAt(0); window.__ready = true; });
