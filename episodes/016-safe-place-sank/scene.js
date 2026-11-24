// The Safe Place That Sank — low-poly storybook scene (deterministic: window.renderAt(t) draws the frame for time t)
// Gold falls to about $3,600 an ounce on Tue 24 Nov 2026, its lowest in more than a year and about a third below its record of nearly $5,600
// (29 Jan 2026): about $14 trillion of paper value of all the world's above-ground gold gone, through a year of war in the Gulf. Gold pays no
// interest while US bonds pay about 5%; the war lifted oil and prices and the Fed raised rates; margin calls in the AI-stock sell-off made some
// traders sell gold; gold tended to fall when the fighting got worse and rise when it calmed. The next Fed decision is 9 Dec 2026.
// The glass vault's stack of gold is the price: full height = the January record; it sinks by about a third.
import * as THREE from 'three';
import { SKIN, MAT, GOLD, rng, GB, person, cloud, bushTree, tower, car, lamp, bank, pedestal, glassVault, INGOT, CERT, CASH, BIGCOIN, CHIP, deskPhone, kiosk, WIN_LIT, GLASS_M } from './kit.js';

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
const R = rng(20261124);

// ───────────────────────── story clock (everything hangs off the narration)
const T = {
  hookEnd: TIM.big ? 1.5 : TIM.hook ? E(1) + 0.15 : 0,  // the hook card (script.py HOOK): 0-1.5 s when there is a big number, else until the hook sentence ends
  bigIn: TIM.big ? 1.5 : 0, bigOut: TIM.big ? 3.0 : 0,   // the big number (script.py BIG): 1.5-3 s (Keith, 22 Nov 2026)
  gold1: wt(1, 'gold') - 0.1, trillion: wt(1, 'trillion') - 0.1, during: wt(1, 'during') - 0.1, war1: wt(1, 'war') - 0.1,
  b2: S(2) - 0.05, scared: wt(2, 'scared') - 0.1, money2: wt(2, 'money') - 0.1, hides: wt(2, 'hides') - 0.1,
  b3: S(3) - 0.05, why: wt(3, 'why') - 0.1, safe3: wt(3, 'safe') - 0.1, sink: wt(3, 'sink') - 0.1,
  b4: S(4) - 0.05, weak: wt(4, 'weak') - 0.1, pays4: wt(4, 'pays') - 0.1, no4: wt(4, 'no') - 0.1, interest: wt(4, 'interest') - 0.1,
  b5: S(5) - 0.05, bonds: wt(5, 'bonds') - 0.1, pay5: wt(5, 'pay') - 0.1, five: wt(5, '5') - 0.1, percent: wt(5, 'percent') - 0.1, gold5: wt(5, 'gold') - 0.1, zero: wt(5, 'zero') - 0.1,
  b6: S(6) - 0.05, rates6: wt(6, 'rates') - 0.1, up6: wt(6, 'up') - 0.1, partly: wt(6, 'partly') - 0.1, war6: wt(6, 'war') - 0.1,
  b7: S(7) - 0.05, fighting7: wt(7, 'fighting') - 0.1, oil: wt(7, 'oil') - 0.1, prices: wt(7, 'prices') - 0.1, up7: wt(7, 'up') - 0.1, so7: wt(7, 'so') - 0.1, america: wt(7, "america's") - 0.1, bank: wt(7, 'bank') - 0.1, raised: wt(7, 'raised') - 0.1, rates7: wt(7, 'rates') - 0.1,
  b8: S(8) - 0.05, ai: wt(8, 'AI') - 0.1, crashed: wt(8, 'crashed') - 0.1, traders: wt(8, 'traders') - 0.1, borrowed: wt(8, 'borrowed') - 0.1, cash: wt(8, 'cash') - 0.1, fast: wt(8, 'fast') - 0.1,
  b9: S(9) - 0.05, analysts: wt(9, 'analysts') - 0.1, sold: wt(9, 'sold') - 0.1, easiest: wt(9, 'easiest') - 0.1, gold9: wt(9, 'gold') - 0.1,
  b10: S(10) - 0.05, twist: wt(10, 'twist') - 0.1, fighting10: wt(10, 'fighting') - 0.1, worse: wt(10, 'worse') - 0.1, gold10: wt(10, 'gold') - 0.1, fell: wt(10, 'fell') - 0.1,
  b11: S(11) - 0.05, calmed: wt(11, 'calmed') - 0.1, rose: wt(11, 'rose') - 0.1,
  b12: S(12) - 0.05, tuesday: wt(12, 'tuesday') - 0.1, slid: wt(12, 'slid') - 0.1, n3600: wt(12, '3600') - 0.1, lowest: wt(12, 'lowest') - 0.1, year: wt(12, 'year') - 0.1,
  b13: S(13) - 0.05, decision: wt(13, 'decision') - 0.1, december: wt(13, 'december') - 0.1, ninth: wt(13, '9th') - 0.1, story13: wt(13, 'story') - 0.1, over13: wt(13, 'over') - 0.1, yet: wt(13, 'yet') - 0.1,
  b14: S(14) - 0.05, story: wt(14, 'story') - 0.15, safe14: wt(14, 'safe') - 0.1, fall14: wt(14, 'fall') - 0.1,
  cta: S(15) - 0.1, sell15: wt(15, 'sell') - 0.1, hold15: wt(15, 'hold') - 0.1, comment: wt(15, 'comment') - 0.15, sellK: wt(15, 'SELL', 1) - 0.2, holdK: wt(15, 'HOLD', 1) - 0.1,
};
T.coinsA = T.scared - 0.35; T.coinsB = T.hides + 0.55;                      // coins pour into the vault ("scared money hides")
T.sinkA = T.sink - 0.05;                                                    // the gold stack sinks by about a third
T.payA = T.pay5; T.payB = T.b6 + 1.2;                                       // the bond pays coins
T.flash1 = T.fighting7 + 0.05;                                              // a flash on the far horizon
T.barrelA = T.oil - 0.25;                                                   // the oil line climbs, the barrel rides it
T.gaugeA = T.raised - 0.1;                                                  // the rate gauge rises
T.crashA = T.crashed - 0.05;                                                // the AI towers drop
T.flyA = T.sold - 0.1; T.flyB = T.gold9 + 0.5;                              // gold bars fly from the vault to the cash kiosk
T.storm = T.fighting10 - 0.1; T.flash2 = T.worse + 0.05;                    // the storm over the seesaw
T.tipDown = T.worse + 0.2; T.tipUp = T.rose - 0.25;                         // the seesaw: gold down, then gold up
T.slideA = T.slid - 0.05;                                                   // the stack sinks a little more
T.postA = T.sellK + 0.75; T.postB = T.holdK + 0.7;
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
  HAZE: P(0x4A4F6A, 0xB0807A, 0xF0A070, 0xC9907A, 0xFFB07A, 2.6, 0xC0A8A0, 0x7A6050, 1.4, 0, 0.3, -20, 16, 0xFFB070, 46, 90, 640),   // the harbour under a smoky sky
  SUNSET: P(0x2E2F72, 0xE0707A, 0xFFB25E, 0xEE9A6A, 0xFF9050, 2.9, 0xB49AC8, 0x86685A, 1.45, 0.12, 0.6, -30, 10, 0xFFB060, 50, 90, 620),
  DUSK: P(0x141A4C, 0x4A3F86, 0xC06A78, 0x6A4A78, 0x93A4F4, 1.7, 0x5A62B0, 0x3A2A40, 1.2, 0.65, 0.92, -40, 36, 0xFFF4D6, 30, 80, 600),
};
const SKY = [[0, 'GOLDEN'], [T.b6 + 0.4, 'GOLDEN'], [T.up6 + 0.45, 'HAZE'], [T.so7, 'HAZE'], [T.bank + 0.2, 'DAY'], [T.b8 + 0.4, 'DAY'], [T.b9 + 0.6, 'GOLDEN'],
  [T.b12 - 0.2, 'GOLDEN'], [T.slid + 0.6, 'SUNSET'], [T.b13 + 0.6, 'SUNSET'], [T.story13, 'DUSK'], [T.story + 0.6, 'DUSK'], [T.cta + 0.6, 'NIGHT'], [DUR + 2, 'NIGHT']];
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
const V = [0, 0], VW = 26, VD = 18, VH = 12;   // the glass vault of gold (front face toward +z)
const PG = [-5.5, 24], PB = [5.5, 24];          // two pedestals in front of it: a gold bar (pays nothing) and a bond (pays)
const SS = [0, 72];                             // the seesaw: oil on one end, gold on the other
const CB = [64, 16];                            // America's central bank (faces +z), its rate gauge beside it
const GA = [CB[0] - 19, CB[1] + 8];
const CAL = [50, 44];                           // the calendar page: the next rate decision
const TD = [-74, -22];                          // the AI towers
const TR = [-42, 40], K = [-26, 32];            // a trader's desk; the cash kiosk (west side of the plaza)
const SEA = -175;                               // the shore of the harbour (north)
const stat = [];

// ───────────────────────── ground, streets, plaza, the sea
const ground = new THREE.Mesh(new THREE.PlaneGeometry(2400, 2400).rotateX(-Math.PI / 2), new THREE.MeshLambertMaterial({ color: 0xC9C2AE })); ground.receiveShadow = true; scene.add(ground);
const flat = new GB();
flat.box(9, 0.04, 330, 0x4A4E56, 104, 0.02, -10); flat.box(9, 0.04, 330, 0x4A4E56, -104, 0.021, -10);            // avenues north-south
flat.box(520, 0.04, 9, 0x4A4E56, 0, 0.022, 124); flat.box(520, 0.04, 9, 0x4A4E56, 0, 0.023, -60);                 // east-west
for (const z of [124, -60]) for (let x = -250; x < 250; x += 6) flat.box(2.6, 0.05, 0.22, 0xF2EEE2, x, 0.045, z);
flat.box(84, 0.07, 106, 0xE6DFD0, 0, 0.035, 49);                                                                   // the plaza in front of the vault
for (let i = 0; i < 26; i++) flat.box(84, 0.075, 0.12, 0xD6CEBC, 0, 0.037, -2 + i * 4);
flat.box(14, 0.08, 86, 0xD9CFBA, 0, 0.042, 55);                                                                    // the walk up the middle
flat.box(44, 0.07, 44, 0xECE6D8, CB[0], 0.036, CB[1] + 18);                                                        // the bank's forecourt
for (const [x, z, w, d] of [[-34, 90, 22, 22], [34, 90, 22, 22], [-62, 52, 18, 30], [88, 52, 16, 28], [0, 112, 40, 14]]) flat.box(w, 0.06, d, 0x8DAE74, x, 0.03, z);
flat.box(400, 0.06, 26, 0xE2D2A8, 0, 0.03, SEA - 2);                                                                // the beach
flat.box(170, 0.06, 40, 0xB8B4A8, 0, 0.031, SEA + 30);                                                              // the tank farm's yard
const flatM = flat.mesh(); flatM.castShadow = false; scene.add(flatM);
const sea = new THREE.Mesh(new THREE.PlaneGeometry(2400, 1300).rotateX(-Math.PI / 2), new THREE.MeshLambertMaterial({ color: 0x3A86A8, emissive: 0x0C3A52, emissiveIntensity: 0.5 })); sea.position.set(0, 0.08, SEA - 12 - 650); sea.receiveShadow = true; scene.add(sea);
const glints = []; { const gm = new THREE.MeshBasicMaterial({ color: 0xDFF6FF, transparent: true, opacity: 0.45 }); for (let i = 0; i < 40; i++) { const m = new THREE.Mesh(new THREE.BoxGeometry(3 + R() * 6, 0.05, 0.4), gm); m.userData = { x: -260 + R() * 520, z: SEA - 30 - R() * 420, v: 0.6 + R() * 0.8 }; scene.add(m); glints.push(m); } }

// ───────────────────────── the city
const DEST = (x, z) => (Math.abs(x) < 62 && z > -28 && z < 142) || (x > 36 && x < 98 && z > -14 && z < 120) || (x < -22 && x > -98 && z > -50 && z < 84) || (Math.abs(x) < 100 && z < -40) || z < SEA + 70 || Math.abs(z - 124) < 9 || Math.abs(z + 60) < 9 || Math.abs(x - 104) < 9 || Math.abs(x + 104) < 9;
{
  const tr = rng(2611), PAL = [[0xD9D3C6, 0x5E7F9A], [0x6D97AA, 0x3F6A80], [0xE4DED2, 0x4E7C93], [0xC9C2B4, 0x55748C], [0x8FB3C2, 0x426E86], [0xEFE9DC, 0x6A8AA4], [0xB7C4C9, 0x3E6378], [0xE8D9C0, 0x5A7A90]];
  for (let gx = -250; gx <= 250; gx += 22) for (let gz = -110; gz <= 200; gz += 22) {
    const x = gx + (tr() - .5) * 7, z = gz + (tr() - .5) * 7; if (DEST(x, z) || tr() < 0.12) continue;
    const dp = Math.hypot(x, z), far = dp > 130, w = 9 + tr() * 7, d = 9 + tr() * 7;
    const h = dp < 90 ? 12 + tr() * 18 : 18 + tr() * (far ? 40 : 28);
    const pal = PAL[Math.floor(tr() * PAL.length)];
    const g = tower(w, h, d, { rand: tr, color: pal[0], glass: pal[1], floor: far ? 4.2 : 3.4, litP: 0.55, crown: h > 44 && tr() < 0.5 });
    g.position.set(x, 0, z); g.rotation.y = (tr() < 0.5 ? 0 : Math.PI / 2); g.children.forEach(c => { c.castShadow = dp < 150; c.receiveShadow = true; }); scene.add(g);
    stat.push([x - Math.max(w, d) / 2, x + Math.max(w, d) / 2, z - Math.max(w, d) / 2, z + Math.max(w, d) / 2, h + 4, 'tower']);
  }
  // a row of taller towers behind the vault (the skyline of the cover), leaving the harbour view open
  for (const [x, z, w, h] of [[-46, -34, 12, 38], [40, -54, 13, 44], [-30, -48, 10, 30], [26, -46, 11, 34]]) {
    const pal = PAL[Math.floor(tr() * PAL.length)], g = tower(w, h, w, { rand: tr, color: pal[0], glass: pal[1], floor: 3.6, litP: 0.6, crown: true }); g.position.set(x, 0, z); g.children.forEach(c => { c.castShadow = true; c.receiveShadow = true; }); scene.add(g);
    stat.push([x - w / 2, x + w / 2, z - w / 2, z + w / 2, h + 6, 'skyline']);
  }
}
// trees and lamps around the plaza
for (const [x, z] of [[-40, 10], [-40, 26], [-58, 64], [40, 10], [40, 26], [36, 60], [-30, 84], [30, 84], [-56, 96], [56, 96], [84, 60], [-86, 66], [-20, 104], [20, 104]]) { const m = bushTree(6 + R() * 2, R); m.position.set(x, 0, z); scene.add(m); }
const lampHeads = new GB();
for (const z of [8, 24, 40, 92, 106]) for (const s of [-1, 1]) { const l = lamp(6.2); l.position.set(s * 12, 0, z); l.rotation.y = s > 0 ? Math.PI : 0; scene.add(l); lampHeads.box(0.6, 0.12, 0.36, 0xFFFFFF, s * 12 - s * 1.25, 6.02, z); }
const lampM = new THREE.MeshLambertMaterial({ color: 0xFFF1C8, emissive: 0xFFD27A, emissiveIntensity: 0 }); scene.add(new THREE.Mesh(lampHeads.geo(), lampM));

// ───────────────────────── the glass vault and its stack of gold (the stack's height is the price; full = the January record)
const vault = glassVault(VW, VD, VH); vault.position.set(V[0], 0, V[1]); vault.children.forEach(c => { c.castShadow = true; c.receiveShadow = true; }); scene.add(vault);
stat.push([V[0] - VW / 2 - 1, V[0] + VW / 2 + 1, V[1] - VD / 2 - 1, V[1] + VD / 2 + 1, VH + 2, 'vault']);
{ const b = new GB(); for (let i = 0; i < 3; i++) b.box(16 - i * 3, 0.32, 1.6, 0xEDE6D6, 0, 0.16 + i * 0.32 - 0.16 * 0 , VD / 2 + 2.2 - i * 0.7); scene.add(b.mesh()); }   // steps up to the vault
const IG = INGOT(2.6, 0.66, 1.2);
const NX = 8, NZ = 5, NL = 14, STACK_H = NL * 0.68;           // ingots: 8 across, 5 deep, 14 layers (about 9.5 m: full height = the record)
const stack = new THREE.InstancedMesh(IG, GOLD, NX * NZ * NL); stack.castShadow = true; stack.receiveShadow = true; stack.frustumCulled = false; scene.add(stack);
{ let n = 0; const _m = new THREE.Matrix4(); for (let l = 0; l < NL; l++) for (let ix = 0; ix < NX; ix++) for (let iz = 0; iz < NZ; iz++) { const off = (l % 2) * 0.6, x = -NX * 2.75 / 2 + 1.37 + ix * 2.75 + off - 0.3, z = -NZ * 1.32 / 2 + 0.66 + iz * 1.32; if (x > VW / 2 - 1.5) continue; _m.makeTranslation(x, 0.66 + 0.34 + l * 0.68, z); stack.setMatrixAt(n++, _m); } stack.count = n; stack.instanceMatrix.needsUpdate = true; }
const stackY = t => -STACK_H * 0.33 * eio(seg(t, T.sinkA, T.sinkA + 0.9)) - STACK_H * 0.02 * eo(seg(t, T.slideA, T.slideA + 0.7));   // a third lower, then a little more on Tuesday
// the record line: a glowing amber bar across the vault's front at the stack's full height (the January record), shown once the stack sinks
const recM = new THREE.MeshBasicMaterial({ color: 0xFFC84A, transparent: true, opacity: 0, toneMapped: false, depthWrite: false });
const recLine = new THREE.Mesh(new THREE.BoxGeometry(VW - 1.2, 0.22, 0.22), recM); recLine.position.set(0, 0.66 + STACK_H + 0.05, VD / 2 - 0.2); recLine.renderOrder = 3; scene.add(recLine);
const vaultGlow = new THREE.Mesh(new THREE.PlaneGeometry(36, 24).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ map: radial('rgba(255,200,80,0.6)', 'rgba(255,170,40,0)'), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false })); vaultGlow.position.set(0, 0.7, 0); scene.add(vaultGlow);
// a dust ring when the stack drops
const dustM = new THREE.MeshBasicMaterial({ map: radial('rgba(255,236,200,0.85)', 'rgba(255,236,200,0)'), transparent: true, depthWrite: false, opacity: 0 });
const dust = new THREE.Mesh(new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2), dustM); dust.position.set(0, 0.9, 0); scene.add(dust);

// ───────────────────────── the two pedestals: a gold bar that pays nothing, a bond that pays
const pedG = pedestal(2.4, 1.5); pedG.position.set(PG[0], 0, PG[1]); scene.add(pedG);
const pedB = pedestal(2.4, 1.5); pedB.position.set(PB[0], 0, PB[1]); scene.add(pedB);
stat.push([PG[0] - 2.2, PG[0] + 2.2, PG[1] - 2.2, PG[1] + 2.2, 5.5, 'pedestal']); stat.push([PB[0] - 2.2, PB[0] + 2.2, PB[1] - 2.2, PB[1] + 2.2, 7, 'pedestal']);
const bar = new THREE.Group(); bar.position.set(PG[0], 2.4, PG[1]); scene.add(bar);
for (const [x, y, z] of [[0, 0.38, -0.62], [0, 0.38, 0.62], [0, 1.0, 0]]) { const m = new THREE.Mesh(IG, GOLD); m.position.set(x, y, z); m.scale.setScalar(0.95); m.castShadow = true; bar.add(m); }
const dishG = (() => { const b = new GB(); b.cyl(1.3, 1.0, 0.25, 14, 0xD6CEBC, 0, 0.12, 0); b.cyl(1.15, 1.15, 0.06, 14, 0xB8AE98, 0, 0.26, 0); return b.geo(); })();
const dishL = new THREE.Mesh(dishG, MAT); dishL.position.set(PG[0], 0, PG[1] + 3.4); scene.add(dishL);   // gold's dish: stays empty
const dishR = new THREE.Mesh(dishG, MAT); dishR.position.set(PB[0], 0, PB[1] + 3.4); scene.add(dishR);   // the bond's dish: fills with coins
const bond = new THREE.Group(); bond.position.set(PB[0], 2.4, PB[1]); scene.add(bond);
{ const cm = new THREE.Mesh(CERT, MAT); cm.scale.set(3.4, 3.4, 3.4); cm.rotation.x = Math.PI / 2 - 0.12; cm.position.set(0, 1.35, 0); cm.castShadow = true; bond.add(cm);
  const st = new GB(); st.box(2.6, 0.3, 0.9, 0x7A5A3A, 0, 0.15, 0.3); st.box(0.2, 1.0, 0.2, 0x7A5A3A, 0, 0.6, 0.6); bond.add(st.mesh());
  const lab = new THREE.Mesh(new THREE.PlaneGeometry(2.7, 0.62), new THREE.MeshBasicMaterial({ map: textTex(512, 118, (g, w, h) => { g.fillStyle = '#FBF6E8'; g.fillRect(0, 0, w, h); g.fillStyle = '#2C3A5A'; g.font = "800 64px Figtree"; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('US BOND', w / 2, h / 2 + 4); }), toneMapped: false }));
  lab.position.set(0, 2.05, 0.21); lab.rotation.x = -0.12; bond.add(lab); }
const COING = BIGCOIN(0.42, 0.12);
const NPAY = 14, payCoins = new THREE.InstancedMesh(COING, GOLD, NPAY); payCoins.frustumCulled = false; payCoins.castShadow = true; scene.add(payCoins);
const PAYT = Array.from({ length: NPAY }, (_, i) => T.payA + i * (T.payB - T.payA) / NPAY);
const PAYP = Array.from({ length: NPAY }, (_, i) => { const rr = rng(300 + i), a = rr() * 6.28, r = Math.sqrt(rr()) * 0.75; return [PB[0] + Math.cos(a) * r, 0.36 + Math.floor(i / 5) * 0.13, PB[1] + 3.4 + Math.sin(a) * r]; });

// ───────────────────────── coins from the city pour into the vault ("scared money hides")
const NIN = 70, inCoins = new THREE.InstancedMesh(COING, GOLD, NIN); inCoins.frustumCulled = false; scene.add(inCoins);
const INC = Array.from({ length: NIN }, (_, i) => { const rr = rng(1200 + i); return { t0: T.coinsA + (i / NIN) * (T.coinsB - T.coinsA - 0.9), a: [(rr() - 0.5) * 130, 16 + rr() * 20, -40 + rr() * 64], sp: 4 + rr() * 6, ph: rr() * 6 }; });
const WALK = [];   // people hurrying across the plaza toward the vault, then strolling
const modern = (i, extra = {}) => ({ robe: [0x34405A, 0x6A2E3E, 0x3F6A5A, 0x5A5A66, 0x7A5A3A, 0x2F4A6A, 0x8A3A3A, 0x3B6FA8, 0xB0603A, 0x4E7A3E][i % 10], skin: SKIN[i % 5], short: [0x231C18, 0x5A3E28, 0xC9A27A, 0x3A2A1E, 0x8A8A8A][i % 5], shirt: i % 2 ? 0xF4F2EC : undefined, ...extra });
for (let i = 0; i < 12; i++) { const rr = rng(40 + i), m = person(modern(i, { badge: i % 3 === 0 })); m.scale.setScalar(1.25); scene.add(m); const x0 = (rr() - 0.5) * 60, z0 = 36 + rr() * 14; WALK.push({ m, a: [x0, z0], b: [x0 * 0.25 + (rr() - 0.5) * 6, 14 + rr() * 4], sp: 0.9 + rr() * 0.6, ph: rr() * 6 }); }

// ───────────────────────── the harbour: tank farm, tankers, the far smoke of the war, the oil line and its barrel
const tanks = new GB();
for (let i = 0; i < 6; i++) { const x = -75 + i * 30, z = SEA + 32 + (i % 2) * 14; tanks.cyl(7, 7, 10, 18, 0xEDEBE4, x, 5, z); tanks.cyl(7.1, 7.1, 0.4, 18, 0xC8423A, x, 7.6, z); tanks.cyl(6.6, 7, 0.8, 18, 0xD9D6CE, x, 10.3, z); stat.push([x - 7, x + 7, z - 7, z + 7, 12, 'tank']); }
tanks.box(170, 0.6, 0.6, 0x8A8F96, 0, 1.2, SEA + 18); tanks.box(0.6, 0.6, 30, 0x8A8F96, 0, 1.2, SEA + 2); tanks.box(12, 1.0, 46, 0x8A7A6A, 0, 0.5, SEA - 18);   // pipes and a pier
scene.add(tanks.mesh());
const tankerG = (() => { const b = new GB(); b.box(46, 4.4, 9, 0x2E3B4E, 0, 2.2, 0); b.box(46.4, 0.5, 9.4, 0xC8423A, 0, 0.5, 0); b.box(44, 0.4, 8.4, 0x6A6E74, 0, 4.6, 0); b.box(7, 6, 8.4, 0xF1EDE4, -17, 7.6, 0); b.box(2, 3, 2, 0x2E3B4E, -18, 12, 0); b.cone(3.2, 6, 4, 0x2E3B4E, 23.5, 2.2, 0, 0, Math.PI / 4, -Math.PI / 2);
  for (let k = 0; k < 5; k++) b.cyl(0.6, 0.6, 0.6, 8, 0xC9CED6, -8 + k * 6.5, 5.1, 0); return b.geo(); })();
const TANKERS = [[-60, SEA - 70, 1, 0.9], [70, SEA - 150, -1, 0.7], [-10, SEA - 260, 1, 0.5]].map(([x, z, dir, v]) => { const m = new THREE.Mesh(tankerG, MAT); m.castShadow = true; m.position.set(x, 0, z); m.rotation.y = dir > 0 ? 0 : Math.PI; scene.add(m); return { m, x, z, dir, v }; });
// far smoke on the horizon (the war): grey puffs rising from orange glows, faded in at "war"
const SMOKE = [[-62, -600], [-14, -640], [42, -610], [96, -650]];
const smokeTex = radial('rgba(88,80,90,0.85)', 'rgba(88,80,90,0)');
const puffs = []; SMOKE.forEach(([x, z], j) => { for (let k = 0; k < 10; k++) { const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: smokeTex, transparent: true, depthWrite: false, fog: false, opacity: 0 })); sp.userData = { x, z, k, ph: j * 1.7 + k * 0.6 }; sp.visible = false; scene.add(sp); puffs.push(sp); } });
const fireM = new THREE.SpriteMaterial({ map: radial('rgba(255,150,60,0.9)', 'rgba(255,110,40,0)'), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false, opacity: 0, fog: false });
const fires = SMOKE.map(([x, z]) => { const sp = new THREE.Sprite(fireM); sp.position.set(x, 6, z + 10); sp.scale.set(46, 26, 1); scene.add(sp); return sp; });
const flashM = new THREE.SpriteMaterial({ map: radial('rgba(255,240,210,1)', 'rgba(255,200,120,0)'), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false, opacity: 0, fog: false });
const flash = new THREE.Sprite(flashM); flash.position.set(-14, 26, -620); flash.scale.set(200, 150, 1); scene.add(flash);
// the oil line: a red ribbon of segments climbing over the harbour; a barrel rides its tip
const OILP = [[-22, 8], [-16, 12], [-11, 10.5], [-6, 17], [-1, 15.5], [5, 24], [10, 22.5], [16, 32], [22, 38]].map(([x, y]) => [x, y, -300]);   // over the sea
const OILL = OILP.slice(1).reduce((a, q, i) => a + Math.hypot(q[0] - OILP[i][0], q[1] - OILP[i][1]), 0);
const oilSegM = new THREE.MeshBasicMaterial({ color: 0xFF7A3A, toneMapped: false });
const oilSegs = OILP.slice(1).map((q, i) => { const p = OILP[i], L = Math.hypot(q[0] - p[0], q[1] - p[1]), m = new THREE.Mesh(new THREE.BoxGeometry(1, 1.3, 1.3).translate(0.5, 0, 0), oilSegM); m.position.set(...p); m.rotation.z = Math.atan2(q[1] - p[1], q[0] - p[0]); m.userData = { L }; m.visible = false; scene.add(m); return m; });
const barrel = new THREE.Group(); { const b = new GB(); b.cyl(2.6, 2.6, 5.2, 16, 0x24324A, 0, 0, 0); for (const y of [-1.7, 0, 1.7]) b.cyl(2.68, 2.68, 0.36, 16, 0xC8423A, 0, y, 0); b.cyl(2.3, 2.3, 0.1, 16, 0x1A2436, 0, 2.62, 0); b.cyl(0.4, 0.4, 0.2, 8, 0x8A8F96, 1.2, 2.7, 0.4); barrel.add(b.mesh()); } barrel.visible = false; scene.add(barrel);
function oilTip(u) { let d = u * OILL; for (let i = 1; i < OILP.length; i++) { const p = OILP[i - 1], q = OILP[i], L = Math.hypot(q[0] - p[0], q[1] - p[1]); if (d <= L) return [lerp(p[0], q[0], d / L), lerp(p[1], q[1], d / L), p[2]]; d -= L; } return OILP[OILP.length - 1]; }

// ───────────────────────── America's central bank and its rate gauge; the calendar page
const cbank = bank(); cbank.position.set(CB[0], 0, CB[1]); cbank.children.forEach(c => { c.castShadow = true; c.receiveShadow = true; }); scene.add(cbank); stat.push([CB[0] - 14, CB[0] + 14, CB[1] - 9, CB[1] + 12, 19, 'bank']);
const cbSign = new THREE.Mesh(new THREE.PlaneGeometry(14, 1.6), new THREE.MeshBasicMaterial({ map: textTex(1024, 118, (g, w, h) => { g.fillStyle = '#E9E1CF'; g.fillRect(0, 0, w, h); g.fillStyle = '#4A3A2A'; g.font = "800 66px Figtree"; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('CENTRAL BANK', w / 2, h / 2 + 4); }), toneMapped: false }));
cbSign.position.set(CB[0], cbank.userData.signY, CB[1] + cbank.userData.signZ + 0.05); scene.add(cbSign);
const GH = 15;
{ const b = new GB(); b.cyl(2.6, 2.9, 1.2, 14, 0xD6CEBC, GA[0], 0.6, GA[1]); b.cyl(2.2, 2.2, 0.5, 14, 0xC9A23A, GA[0], GH + 1.45, GA[1]); for (let i = 1; i < 6; i++) b.box(0.9, 0.12, 0.12, 0x3A3F48, GA[0] - 2.1, 1.2 + i * GH / 6, GA[1] + 1.2); scene.add(b.mesh()); stat.push([GA[0] - 3, GA[0] + 3, GA[1] - 3, GA[1] + 3, GH + 3, 'gauge']); }
const tube = new THREE.Mesh(new THREE.CylinderGeometry(1.9, 1.9, GH, 18, 1, true), GLASS_M); tube.position.set(GA[0], 1.2 + GH / 2, GA[1]); tube.renderOrder = 2; scene.add(tube);
const fillM = new THREE.MeshLambertMaterial({ color: 0xF7A600, emissive: 0xA86A00, emissiveIntensity: 0.6 });
const fill = new THREE.Mesh(new THREE.CylinderGeometry(1.55, 1.55, 1, 16).translate(0, 0.5, 0), fillM); fill.position.set(GA[0], 1.2, GA[1]); scene.add(fill);
const gaugeK = t => lerp(0.38, 0.78, eo(seg(t, T.gaugeA, T.gaugeA + 0.9)));
const calG = new THREE.Group(); calG.position.set(CAL[0], 0, CAL[1]); calG.rotation.y = 0.25; scene.add(calG);
{ const b = new GB(); b.box(0.5, 6, 0.5, 0x5A5F68, -2.6, 3, -0.4); b.box(0.5, 6, 0.5, 0x5A5F68, 2.6, 3, -0.4); b.box(7.2, 0.5, 2.4, 0xD6CEBC, 0, 0.25, 0); calG.add(b.mesh());
  const pg = new THREE.Mesh(new THREE.BoxGeometry(6.4, 7.4, 0.3), [MAT, MAT, MAT, MAT, new THREE.MeshBasicMaterial({ map: textTex(512, 592, (g, w, h) => { g.fillStyle = '#FBF8F0'; g.fillRect(0, 0, w, h); g.fillStyle = '#C8423A'; g.fillRect(0, 0, w, 150); g.fillStyle = '#fff'; g.font = "800 74px Figtree"; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('DECEMBER', w / 2, 80); g.fillStyle = '#1C2030'; g.font = "900 300px Figtree"; g.fillText('9', w / 2, 345); g.fillStyle = '#5A5F68'; g.font = "700 42px Figtree"; g.fillText('rate decision', w / 2, 530); }), toneMapped: false }), MAT]);
  pg.geometry.setAttribute('color', new THREE.Float32BufferAttribute(new Float32Array(pg.geometry.attributes.position.count * 3).fill(0.93), 3)); pg.position.set(0, 7.2, 0); pg.castShadow = true; calG.add(pg); }
stat.push([CAL[0] - 5, CAL[0] + 5, CAL[1] - 3, CAL[1] + 3, 12, 'calendar']);

// ───────────────────────── the AI towers (screens turn red and the towers drop), the trader's desk and phone, the cash kiosk
const scrTex = up => textTex(256, 320, (g, w, h) => { g.fillStyle = '#0E1A2A'; g.fillRect(0, 0, w, h); g.strokeStyle = 'rgba(255,255,255,0.12)'; g.lineWidth = 2; for (let i = 1; i < 5; i++) { g.beginPath(); g.moveTo(0, i * h / 5); g.lineTo(w, i * h / 5); g.stroke(); }
  g.strokeStyle = up ? '#3FD08A' : '#FF5A4A'; g.lineWidth = 12; g.lineJoin = 'round'; g.beginPath(); const pts = up ? [[10, 270], [60, 230], [100, 250], [150, 160], [190, 180], [246, 60]] : [[10, 60], [60, 90], [100, 70], [150, 170], [190, 150], [246, 290]]; pts.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.stroke();
  g.fillStyle = '#fff'; g.font = "800 52px Figtree"; g.textAlign = 'left'; g.fillText('AI', 16, 56); });
const scrUpM = new THREE.MeshBasicMaterial({ map: scrTex(true), toneMapped: false }), scrDnM = new THREE.MeshBasicMaterial({ map: scrTex(false), toneMapped: false });
const AIT = [[-10, 6, 13, 56], [8, -6, 12, 66], [-4, -20, 12, 48], [16, 14, 11, 44], [-22, -8, 11, 40]].map(([dx, dz, w, h], i) => {
  const g = new THREE.Group(); g.position.set(TD[0] + dx, 0, TD[1] + dz); scene.add(g);
  const tw = tower(w, h, w, { rand: rng(77 + i), color: 0x2F4256, glass: 0x5FA8D0, frame: 0xBFD2E0, floor: 3.4, litP: 0.7, bare: true }); tw.children.forEach(c => { c.castShadow = true; }); g.add(tw);
  const chip = new THREE.Mesh(CHIP, MAT); chip.scale.setScalar(w * 0.55); chip.position.y = h + 0.6; g.add(chip);
  const scr = new THREE.Mesh(new THREE.PlaneGeometry(w * 0.6, w * 0.75), scrUpM); scr.position.set(0, h * 0.72, w / 2 + 0.12); g.add(scr);
  stat.push([TD[0] + dx - w / 2, TD[0] + dx + w / 2, TD[1] + dz - w / 2, TD[1] + dz + w / 2, h + 8, 'AI tower']); return { g, scr, h };
});
const desk = new GB(); desk.box(4.6, 0.2, 2.2, 0x8A6A4A, TR[0], 1.25, TR[1]); for (const [x, z] of [[-2.1, -0.9], [2.1, -0.9], [-2.1, 0.9], [2.1, 0.9]]) desk.box(0.16, 1.2, 0.16, 0x5A4A3A, TR[0] + x, 0.6, TR[1] + z); desk.box(1.5, 1.0, 0.1, 0x22262E, TR[0] + 0.8, 1.9, TR[1] - 0.6); scene.add(desk.mesh());
stat.push([TR[0] - 3, TR[0] + 3, TR[1] - 2, TR[1] + 2, 3.5, 'desk']);
const phone = deskPhone(0xC8423A); phone.scale.setScalar(1.15); phone.position.set(TR[0] - 1.0, 1.35, TR[1] + 0.2); phone.rotation.y = -0.4; scene.add(phone);
const trader = person(modern(3, { robe: 0x2B2F3A, shirt: 0xF4F2EC, tie: 0xC8423A, s: 1.3 })); trader.position.set(TR[0] - 0.4, 0, TR[1] + 1.9); trader.rotation.y = -Math.PI / 2; scene.add(trader);
const kio = kiosk(); kio.scale.setScalar(2.2); kio.position.set(K[0], 0, K[1]); kio.rotation.y = -Math.PI / 2 + 0.3; kio.children.forEach(c => { c.castShadow = true; }); scene.add(kio); stat.push([K[0] - 4.5, K[0] + 4.5, K[1] - 4.5, K[1] + 4.5, 9, 'kiosk']);
const kSign = new THREE.Mesh(new THREE.PlaneGeometry(6.2, 1.6), new THREE.MeshBasicMaterial({ map: textTex(512, 132, (g, w, h) => { g.fillStyle = '#2F3A55'; g.fillRect(0, 0, w, h); g.fillStyle = '#FFD27A'; g.font = "800 78px Figtree"; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('CASH', w / 2, h / 2 + 4); }), toneMapped: false }));
kSign.position.set(K[0] + 1.0, 7.9, K[1] + 3.6); kSign.rotation.y = 0.3; scene.add(kSign);
const NFLY = 16, flyBars = new THREE.InstancedMesh(IG, GOLD, NFLY); flyBars.frustumCulled = false; flyBars.castShadow = true; scene.add(flyBars);
const cashM = new THREE.InstancedMesh(CASH, MAT, NFLY); cashM.frustumCulled = false; cashM.castShadow = true; scene.add(cashM);
const FLYT = Array.from({ length: NFLY }, (_, i) => T.flyA + i * (T.flyB - T.flyA) / NFLY);
const CASHP = Array.from({ length: NFLY }, (_, i) => [K[0] + 4.6 + (i % 4) * 1.15, 0.24 + Math.floor(i / 8) * 0.44, K[1] + 4.2 + (Math.floor(i / 4) % 2) * 0.7]);
function flyAt(i, t) { const t0 = FLYT[i], u = seg(t, t0, t0 + 1.05); if (t < t0 || u >= 1) return null; const s = [(i % 5 - 2) * 3, 8.5, V[1] + VD / 2 - 2], e = CASHP[i]; return [lerp(s[0], e[0], u), lerp(s[1], e[1] + 1.2, u) + Math.sin(u * Math.PI) * 6, lerp(s[2], e[2], u), u]; }

// ───────────────────────── the seesaw: oil on the left, gold on the right; a storm cloud over it
const ful = new GB(); ful.add(new THREE.CylinderGeometry(0.01, 1.7, 2.6, 3, 1), 0x6A6E74, new THREE.Matrix4().makeTranslation(SS[0], 1.3, SS[1]).multiply(new THREE.Matrix4().makeRotationY(Math.PI / 2))); ful.box(5, 0.3, 3, 0xD6CEBC, SS[0], 0.15, SS[1]); scene.add(ful.mesh());
stat.push([SS[0] - 9, SS[0] + 9, SS[1] - 2.5, SS[1] + 2.5, 7, 'seesaw']);
const SE = 5.6, SY = 2.75;                      // the seesaw's ends (x = ±SE) and its pivot height
const plank = new THREE.Group(); plank.position.set(SS[0], SY, SS[1]); scene.add(plank);
{ const b = new GB(); b.box(15, 0.4, 2.6, 0xC9A27A, 0, 0, 0); b.box(15.2, 0.1, 2.7, 0xB08A5A, 0, 0.24, 0); b.box(0.7, 0.6, 2.9, 0x8A6A4A, -7.2, 0.4, 0); b.box(0.7, 0.6, 2.9, 0x8A6A4A, 7.2, 0.4, 0); plank.add(b.mesh()); }
const sBarrel = barrel.clone(); sBarrel.visible = true; sBarrel.scale.setScalar(0.5); sBarrel.position.set(-SE, 1.5, 0); plank.add(sBarrel);
const sGold = new THREE.Group(); { for (const [x, y, z] of [[0, 0.62, -0.55], [0, 0.62, 0.55], [0.1, 1.24, 0]]) { const m = new THREE.Mesh(IG, GOLD); m.scale.setScalar(0.95); m.position.set(x, y, z); m.castShadow = true; sGold.add(m); } } sGold.position.set(SE, 0, 0); plank.add(sGold);
const tilt = t => { const dn = eio(seg(t, T.tipDown, T.tipDown + 0.8)), upk = eio(seg(t, T.tipUp, T.tipUp + 0.8)), lv = eio(seg(t, T.comment, T.comment + 1.0)); return lerp(lerp(lerp(0, -0.26, dn), 0.26, upk), 0, lv) + Math.sin(t * 2.2) * 0.012 * (1 - dn + upk) ; };
const stormG = new THREE.Group(); stormG.position.set(SS[0], 10.5, SS[1] - 6); scene.add(stormG);
const stormM = new THREE.MeshLambertMaterial({ color: 0x4A4A58, transparent: true, opacity: 0, depthWrite: false });
for (let i = 0; i < 8; i++) { const rr = rng(610 + i), m = new THREE.Mesh(new THREE.IcosahedronGeometry(2.2 + rr() * 1.6, 1), stormM); m.position.set(-8.4 + i * 2.4 + (rr() - .5) * 1.4, (rr() - .5) * 1.6, (rr() - .5) * 3); m.scale.set(1.3, 0.75, 1); stormG.add(m); }
const boltM = new THREE.MeshBasicMaterial({ color: 0xFFF2B0, transparent: true, opacity: 0, toneMapped: false, depthWrite: false });
const bolt = (() => { const b = new GB(); const pts = [[0, 0], [-1.4, -4], [0.6, -4.4], [-1.0, -9], [1.2, -8.6], [-0.4, -14]]; for (let i = 1; i < pts.length; i++) { const [x0, y0] = pts[i - 1], [x1, y1] = pts[i]; const L = Math.hypot(x1 - x0, y1 - y0); b.add(new THREE.BoxGeometry(0.5, L, 0.5), 0xFFFFFF, new THREE.Matrix4().makeTranslation((x0 + x1) / 2, (y0 + y1) / 2, 0).multiply(new THREE.Matrix4().makeRotationZ(Math.atan2(x1 - x0, y0 - y1) * -1))); } return new THREE.Mesh(b.geo(), boltM); })();
bolt.position.set(SS[0] - 3, 9.6, SS[1] - 9); bolt.scale.setScalar(0.7); scene.add(bolt);
const sunbeamM = new THREE.MeshBasicMaterial({ color: 0xFFF1C0, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false, side: THREE.DoubleSide });
const sunbeam = new THREE.Mesh(new THREE.ConeGeometry(9, 30, 20, 1, true).translate(0, -15, 0), sunbeamM); sunbeam.position.set(SS[0] + SE, 24, SS[1]); scene.add(sunbeam);

// ───────────────────────── street life, clouds, sparkles
const CARS = [[0xC8423A, 124, 1, 8, 0], [0x2F6FB8, 124, -1, 9, 40], [0xE9C46A, -60, 1, 7, 150], [0x4C9A62, -60, -1, 8, 230], [0xEDEDED, 124, 1, 8.6, 300], [0x7A4FA0, -60, -1, 7, 90]].map(([col, z, dir, v, off]) => { const m = car(col, { boxy: true }); scene.add(m); return { m, z: z + dir * 2, dir, v, off }; });
const guards = [[-6, VD / 2 + 3.6], [6, VD / 2 + 3.6]].map(([x, z], i) => { const m = person(modern(i + 6, { robe: 0x2B2F3A, s: 1.25 })); m.position.set(x, 0, z); m.rotation.y = -Math.PI / 2; scene.add(m); return m; });
const clouds = []; for (let i = 0; i < 16; i++) { const m = cloud(R); const far = i >= 9; m.position.set(far ? -500 + R() * 1000 : -240 + i * 56 + R() * 20, 84 + R() * 40, far ? -520 + R() * 160 : -300 + R() * 260); m.scale.setScalar(2.0 + R() * 2.2); m.userData.x0 = m.position.x; scene.add(m); clouds.push(m); }
const sparkT = (() => { const cv = document.createElement('canvas'); cv.width = cv.height = 64; const g = cv.getContext('2d'); g.translate(32, 32); g.fillStyle = '#fff'; for (let k = 0; k < 2; k++) { g.rotate(Math.PI / 2 * k); g.beginPath(); g.moveTo(0, -30); g.quadraticCurveTo(3, -3, 30, 0); g.quadraticCurveTo(3, 3, 0, 30); g.quadraticCurveTo(-3, 3, -30, 0); g.quadraticCurveTo(-3, -3, 0, -30); g.fill(); } const tx = new THREE.CanvasTexture(cv); tx.colorSpace = THREE.SRGBColorSpace; return tx; })();
const sparks = []; for (let i = 0; i < 90; i++) { const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: sparkT, color: 0xFFE9A8, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false })); sp.userData = { ph: R() * 6.28, w: 3 + R() * 4, dx: (R() - 0.5) * 2, dz: (R() - 0.5) * 2, k: R() }; scene.add(sp); sparks.push(sp); }

const _m4 = new THREE.Matrix4(), _q = new THREE.Quaternion(), _e = new THREE.Euler(), _p = new THREE.Vector3(), _s = new THREE.Vector3();
// ───────────────────────── camera path (spherical keys around a target; `up` tilts the view so the subject sits lower in the frame)
const CAM = [
  { t: 0, tg: [0, 7, 4], d: 96, az: 12, el: 7.5, up: 0.085 },                                        // the cover: the glass vault full of gold at golden hour
  { t: T.bigOut, tg: [0, 7.5, 2], d: 92, az: 10, el: 8, up: 0.08, mv: 1 },
  { t: T.war1 + 0.7, tg: [0, 16, -70], d: 170, az: 5, el: 9, up: 0.06, mv: 1 },                       // rise: smoke on the far horizon
  { t: T.hides + 0.3, tg: [0, 6, 4], d: 92, az: 12, el: 13, up: -0.005, mv: 1 },                      // coins pour into the vault
  { t: T.sink - 0.2, tg: [0, 6, 2], d: 88, az: 6, el: 11, up: -0.017, mv: 1 },
  { t: T.sink + 0.9, tg: [0, 6, 2], d: 84, az: 3, el: 11, up: -0.017 },
  { t: T.weak + 0.15, tg: [PG[0], 3.2, PG[1] + 1.2], d: 21, az: -12, el: 14, up: -0.06, mv: 1 },      // the gold bars: pay nothing
  { t: T.interest + 0.7, tg: [PG[0], 3.2, PG[1] + 1.2], d: 19, az: -6, el: 14, up: -0.06 },
  { t: T.bonds + 0.35, tg: [PB[0], 3.8, PB[1] + 1.5], d: 18, az: 12, el: 10, up: -0.03, mv: 1 },      // the bond pays
  { t: T.percent + 0.5, tg: [PB[0], 3.8, PB[1] + 1.5], d: 16.5, az: 8, el: 10, up: -0.03 },
  { t: T.zero + 0.25, tg: [0, 3.0, PG[1] + 1.5], d: 44, az: 0, el: 9, up: -0.03, mv: 1 },             // side by side
  { t: T.b6 + 0.1, tg: [0, 3.0, PG[1] + 1.5], d: 46, az: 0, el: 9, up: -0.03 },
  { t: T.up6 + 0.3, tg: [0, 230, -40], d: 40, az: 0, el: -40, up: 0, mv: 1 },                         // sky wipe up (above the clouds)
  { t: T.war6 + 0.25, tg: [0, 20, -300], d: 150, az: 0, el: 3, up: 0, mv: 1 },                        // down over the beach: tankers, the sea, smoke on the horizon
  { t: T.up7 + 0.4, tg: [2, 22, -300], d: 156, az: 2, el: 3.5, up: 0 },
  { t: T.so7 + 0.55, tg: [30, 30, -110], d: 150, az: 8, el: 16, up: 0, mv: 1 },                       // lift over the roofs
  { t: T.bank + 0.2, tg: [56, 9, 22], d: 84, az: 14, el: 11, up: -0.03, mv: 1 },                      // the central bank and its rate gauge
  { t: T.b8 - 0.05, tg: [56, 9, 22], d: 80, az: 11, el: 11, up: -0.03 },
  { t: T.crashed + 0.35, tg: [TD[0] + 6, 26, TD[1] + 14], d: 150, az: -14, el: 8, up: 0.012, mv: 1 }, // the AI towers drop
  { t: T.borrowed + 0.2, tg: [TR[0] - 0.6, 2.6, TR[1] + 0.8], d: 17, az: -16, el: 12, up: -0.09, mv: 1 },   // the trader's phone rings
  { t: T.fast + 0.5, tg: [TR[0] - 0.6, 2.6, TR[1] + 0.8], d: 15.5, az: -8, el: 12, up: -0.09 },
  { t: T.sold + 0.3, tg: [-11, 5, 24], d: 95, az: -6, el: 12, up: -0.02, mv: 1 },                     // gold flies from the vault to the cash kiosk
  { t: T.gold9 + 0.7, tg: [-12, 5, 25], d: 90, az: -10, el: 12, up: -0.02 },
  { t: T.twist + 0.35, tg: [SS[0], 4, SS[1]], d: 52, az: 0, el: 8, up: -0.01, mv: 1 },                // the seesaw under the storm
  { t: T.rose + 0.8, tg: [SS[0], 4, SS[1]], d: 49, az: 5, el: 8, up: -0.01 },
  { t: T.tuesday + 0.7, tg: [0, 6, 2], d: 92, az: -10, el: 11, up: 0.0, mv: 1 },                      // back to the vault: lowest in over a year
  { t: T.year + 0.3, tg: [0, 6, 2], d: 86, az: -5, el: 11, up: 0.0 },
  { t: T.december + 0.25, tg: [58, 7, 32], d: 92, az: 8, el: 10, up: 0.0, mv: 1 },                   // the calendar by the central bank
  { t: T.yet + 0.4, tg: [58, 7, 32], d: 88, az: 5, el: 10, up: 0.0 },
  { t: T.story + 0.7, tg: [0, 7.5, 2], d: 100, az: 8, el: 8, up: -0.015, mv: 1 },                     // wide at dusk: the title
  { t: T.cta - 0.3, tg: [0, 7.5, 6], d: 96, az: 6, el: 8, up: -0.015 },
  { t: T.comment + 0.1, tg: [SS[0], 2.8, SS[1]], d: 46, az: 4, el: 16, up: -0.02, mv: 1 },            // the seesaw, level (the comment boxes go below it)
  { t: DUR + 0.5, tg: [SS[0], 2.8, SS[1]], d: 43, az: 0, el: 16, up: -0.02 },
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
.tag.dn{color:#fff;background:#D9483B;border-color:#D9483B;} .tag.dn b{color:#fff;} .tag.oil{color:#fff;background:#24324A;border-color:#FF7A3A;} .tag.oil b{color:#FF9A5A;} .tag.ok{color:#08231A;background:#3FD08A;border-color:#3FD08A;} .tag.ok b{color:#08231A;}
.stamp{font:900 64px/1 'Figtree',sans-serif;letter-spacing:.06em;color:#FF5A4A;border:6px solid #FF5A4A;padding:8px 22px 6px;border-radius:14px;background:rgba(40,6,4,.35);text-shadow:0 0 18px rgba(255,90,70,.6);}
.cnt{text-align:center;background:rgba(8,10,26,.9);border:2px solid rgba(255,225,160,.65);padding:22px 40px 20px;border-radius:26px;box-shadow:0 14px 40px rgba(5,7,20,.5);}
.cnt .v{font:800 96px/1 'JBM',monospace;letter-spacing:-3px;color:#FFC84A;} .cnt .v.r{color:#FF6B5B;} .cnt .l{margin-top:12px;font:700 30px/1.25 'Figtree',sans-serif;color:#fff;white-space:pre;} .cnt .s{margin-top:12px;font:600 18px/1 'Inter',sans-serif;letter-spacing:.08em;color:rgba(255,255,255,.6);}
.vs{display:flex;gap:26px;} .vs .c{width:300px;text-align:center;background:rgba(8,10,26,.9);border:2px solid rgba(255,225,160,.6);border-radius:24px;padding:18px 0 16px;box-shadow:0 14px 40px rgba(5,7,20,.5);}
.vs .k{font:700 22px/1 'Inter',sans-serif;letter-spacing:.22em;text-transform:uppercase;color:#FFD27A;} .vs .n{margin-top:10px;font:800 84px/1 'JBM',monospace;letter-spacing:-3px;color:#3FD08A;} .vs .n.z{color:#FF6B5B;} .vs .u{margin-top:8px;font:600 22px/1.2 'Figtree',sans-serif;color:rgba(255,255,255,.85);white-space:pre;}
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
const tagVault = mk('tag am', 'gold <b>·</b> the safe place'), tagWar = mk('tag dn', 'a war in the Gulf · since Feb 2026');
const cardRec = mk('card', `Gold: record near <em>$5,600</em> an ounce (29 Jan)\nabout <s>$3,600</s> on 24 Nov: down about a third\n<small>Reuters · Kitco · 2026</small>`);
const tagSink = mk('tag dn', 'about a third <b>↓</b>'), tagRec = mk('tag am', 'Jan record'), tagRec2 = mk('tag am', 'Jan record');
const tagGold0 = mk('tag', 'gold pays <b>0%</b>'), tagBond = mk('tag ok', 'US bonds pay <b>~5%</b>');
const vsBox = mk('vs', `<div class="c"><div class="k">gold</div><div class="n z">$0</div><div class="u">a year on\n$100,000</div></div><div class="c"><div class="k">US bonds</div><div class="n">~$5k</div><div class="u">a year on\n$100,000</div></div>`);
const tagOil = mk('tag oil', 'oil <b>↑</b> prices <b>↑</b>'), tagFight = mk('tag dn', 'fighting flares');
const tagRates = mk('tag am', 'US rates <b>↑</b> 16 Sep 2026');
const tagAI = mk('tag dn', 'AI stocks <b>↓</b>'), stampCall = mk('stamp', 'MARGIN CALL'), cardCall = mk('card', `Bought with <em>borrowed</em> money?\nThe lender wants cash, now.`);
const cardSold = mk('card', `Analysts: some traders sold gold\nto raise cash after tech losses\n<small>Commerzbank via Reuters, CNBC · Capital.com · Oct–Nov 2026</small>`), tagCash = mk('tag ok', 'gold <b>→</b> cash');
const tagSOil = mk('tag oil', 'oil <b>↑</b>'), tagSGoldDn = mk('tag dn', 'gold <b>↓</b>'), tagSGoldUp = mk('tag am', 'gold <b>↑</b>'), tagCalm = mk('tag', 'calmer');
const cardPattern = mk('card', `Through the war, gold tended to fall when\nfighting flared, and rise when it eased\n<small>Reuters · Kitco · investingLive (Commerzbank) · 2026</small>`);
const board = mk('board', `<div class="t">spot gold · Tue 24 Nov 2026</div><div class="row"><b class="bv">$0</b></div><div class="d">lowest in about 14 months</div><div class="src">Kitco · Reuters · an ounce</div>`); const boardV = board.querySelector('.bv');
const tagCal = mk('tag am', 'next US rate decision <b>9 Dec</b>');
const title = mk('title', '<div class="s">THE STORY OF</div><div class="n">The Safe Place\n<em>That Sank</em></div>');
const lesson = mk('lesson', `Safe doesn't mean it <em>can't fall</em>.`);
const ctaChip = mk('chip am', 'what would you do?');
const boxes = [0, 1].map(() => { const e = mk('cbox', '<span class="in"></span><span class="post">Post</span>'); return { e, inn: e.querySelector('.in'), post: e.querySelector('.post') }; });
const foot = document.getElementById('foot');
foot.textContent = "Sources: Reuters, Kitco, SCMP, AP (Nov 2026) · World Gold Council · Commerzbank, Capital.com\n$14 tn: our estimate, 224,200 t above ground × the fall from ~$5,595 (29 Jan) to ~$3,600 (24 Nov) · not advice";
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
  const CH = [[T.bigOut + 0.05, T.b2 - 0.1, 'gold · Jan → Nov 2026'], [T.b2 + 0.05, T.b4 - 0.1, 'where scared money goes'], [T.b4 + 0.05, T.b6 - 0.1, 'gold vs US bonds · Nov 2026'],
    [T.war6 + 0.05, T.so7 - 0.05, 'the Gulf · 2026'], [T.america, T.b8 - 0.1, 'the Fed · US central bank'], [T.b8 + 0.05, T.b9 - 0.1, 'the AI stock sell-off · Nov 2026'], [T.b9 + 0.05, T.b10 - 0.1, 'margin calls'],
    [T.b10 + 0.05, T.b12 - 0.1, 'the pattern in 2026'], [T.b12 + 0.05, T.b13 - 0.1, 'as of 24 Nov 2026'], [T.b13 + 0.05, T.b14 - 0.1, 'as of 25 Nov 2026']];
  for (const [a, b, s] of CH) { const o = win(t, a, b, 0.22, 0.22); if (o > co) { co = o; ct = s; cp = pop(t, a); } }
  if (ct) setTxt(chip, ct); put(chip, W / 2, 472, co, cp);
  // 1-3 — the vault, the war on the horizon, the record and the sink
  { const p = p3([0, VH + 2, 0], win(t, T.b2, T.why, 0.3, 0.25)); put(tagVault, clampX(p[0], 260), clampY(p[1], 600, 1300), p[2], pop(t, T.b2)); }
  { const p = p3([30, 70, -610], win(t, T.war1 + 0.1, T.b2 + 0.1, 0.25, 0.25)); put(tagWar, clampX(p[0], 300), clampY(p[1], 620, 1100), p[2], pop(t, T.war1 + 0.1)); }
  put(cardRec, W / 2, 1380, win(t, T.why, T.b4 - 0.05, 0.25, 0.25), pop(t, T.why));
  { const p = p3([VW / 2 - 3, 0.66 + STACK_H * 0.82, VD / 2], win(t, T.sink + 0.25, T.b4 + 0.2, 0.2, 0.25)); put(tagSink, clampX(p[0], 230), clampY(p[1], 620, 1150), p[2], pop(t, T.sink + 0.25)); }
  { const p = p3([-VW / 2 + 4, 0.66 + STACK_H + 1.6, VD / 2], win(t, T.sinkA + 0.3, T.b4 + 0.2, 0.2, 0.25)); put(tagRec, clampX(p[0], 200), clampY(p[1], 560, 1150), p[2], pop(t, T.sinkA + 0.3)); }
  { const p = p3([-VW / 2 + 4, 0.66 + STACK_H + 1.6, VD / 2], win(t, T.slideA, T.b13 - 0.05, 0.2, 0.25)); put(tagRec2, clampX(p[0], 200), clampY(p[1], 560, 1150), p[2], pop(t, T.slideA)); }
  // 4-5 — gold pays nothing, bonds pay about 5%
  { const p = p3([PG[0], 4.5, PG[1]], win(t, T.no4, T.b6 - 0.05, 0.2, 0.25)); put(tagGold0, clampX(p[0], 220), clampY(p[1], 560, 1150), p[2], pop(t, T.no4)); }
  { const p = p3([PB[0], 5.6, PB[1]], win(t, T.five, T.b6 - 0.05, 0.2, 0.25)); put(tagBond, clampX(p[0], 220), clampY(p[1], 560, 1150), p[2], pop(t, T.five)); }
  put(vsBox, W / 2, 1350, win(t, T.gold5, T.b6 + 0.2, 0.25, 0.25), pop(t, T.gold5));
  // 6-7 — the war, oil, the Fed's rates
  { const p = p3([-20, 60, -600], win(t, T.flash1, T.oil + 0.2, 0.12, 0.25)); put(tagFight, clampX(p[0], 260), clampY(p[1], 640, 1100), p[2], pop(t, T.flash1)); }
  { const tip = oilTip(1), p = p3([tip[0] - 8, tip[1] + 12, tip[2]], win(t, T.oil + 0.15, T.so7 + 0.3, 0.2, 0.25)); put(tagOil, clampX(p[0], 260), clampY(p[1], 600, 1150), p[2], pop(t, T.oil + 0.15)); }
  { const p = p3([GA[0], 1.2 + GH * 0.55, GA[1]], win(t, T.raised, T.b8 - 0.05, 0.2, 0.25)); put(tagRates, clampX(p[0] - 40, 300), clampY(p[1], 620, 1150), p[2], pop(t, T.raised)); }
  // 8-9 — the AI towers drop; the margin call; gold sold for cash
  { const p = p3([TD[0] + 8, 74, TD[1] - 6], win(t, T.crashed, T.borrowed - 0.1, 0.2, 0.25)); put(tagAI, clampX(p[0], 230), clampY(p[1], 640, 1100), p[2], pop(t, T.crashed)); }
  put(stampCall, W / 2, 1260, win(t, T.borrowed, T.b9 - 0.05, 0.12, 0.25), pop(t, T.borrowed, 0.25)); stampCall.style.rotate = '-6deg';
  put(cardCall, W / 2, 1420, win(t, T.cash, T.b9 - 0.05, 0.25, 0.25), pop(t, T.cash));
  put(cardSold, W / 2, 1380, win(t, T.analysts, T.b10 - 0.05, 0.25, 0.25), pop(t, T.analysts));
  { const p = p3([K[0] + 6, 5.4, K[1] + 4.5], win(t, T.gold9, T.b10 - 0.05, 0.2, 0.25)); put(tagCash, clampX(p[0], 220), clampY(p[1], 620, 1150), p[2], pop(t, T.gold9)); }
  // 10-11 — the twist: the seesaw
  const a = tilt(t), endL = [SS[0] - SE * Math.cos(a), SY - SE * Math.sin(a), SS[1]], endR = [SS[0] + SE * Math.cos(a), SY + SE * Math.sin(a), SS[1]];
  { const p = p3([endL[0], endL[1] + 4.4, endL[2]], win(t, T.worse, T.b11 + 0.1, 0.2, 0.2)); put(tagSOil, clampX(p[0], 200), clampY(p[1], 640, 1250), p[2], pop(t, T.worse)); }
  { const p = p3([endR[0], endR[1] + 3.6, endR[2]], win(t, T.fell, T.calmed, 0.2, 0.2)); put(tagSGoldDn, clampX(p[0], 200), clampY(p[1], 640, 1250), p[2], pop(t, T.fell)); }
  { const p = p3([endR[0], endR[1] + 3.6, endR[2]], win(t, T.rose, T.b12 - 0.05, 0.2, 0.25)); put(tagSGoldUp, clampX(p[0], 200), clampY(p[1], 640, 1250), p[2], pop(t, T.rose)); }
  { const p = p3([SS[0], 12.0, SS[1] - 6], win(t, T.calmed, T.b12 - 0.05, 0.2, 0.25)); put(tagCalm, clampX(p[0], 200), clampY(p[1], 600, 1100), p[2], pop(t, T.calmed)); }
  put(cardPattern, W / 2, 1330, win(t, T.twist, T.b12 - 0.05, 0.25, 0.25), pop(t, T.twist));
  // 12-13 — Tuesday's price; the next rate decision
  { const o = win(t, T.n3600 - 0.1, T.b13 - 0.05, 0.25, 0.25), u = eo(seg(t, T.n3600 - 0.05, T.n3600 + 0.9)); setHTML(boardV, '$' + Math.round(lerp(5595, 3602, u)).toLocaleString('en-US')); put(board, W / 2, 1340, o, pop(t, T.n3600 - 0.1) * (1 + 0.04 * win(t, T.lowest, T.lowest + 0.3, 0.1, 0.2))); }
  { const p = p3([CAL[0], 13, CAL[1]], win(t, T.december, T.b14 - 0.05, 0.2, 0.25)); put(tagCal, clampX(p[0], 300), clampY(p[1], 620, 1100), p[2], pop(t, T.december)); }
  // 14 — title and lesson; 15 — the question
  put(title, W / 2, 640, win(t, T.story, T.cta - 0.1, 0.4, 0.3), 0.94 + 0.06 * eo(seg(t, T.story, T.story + 0.6)));
  put(lesson, W / 2, 1180, win(t, T.safe14, T.cta - 0.15, 0.3, 0.25), pop(t, T.safe14));
  put(ctaChip, W / 2, 472, seg(t, T.sell15, T.sell15 + 0.3), pop(t, T.sell15));
  [[T.sellK, 'SELL', T.postA], [T.holdK, 'HOLD', T.postB]].forEach(([t0, word, tp], i) => {
    const bx = boxes[i], L = word.length, n = Math.min(L, Math.floor(c01((t - t0) / (0.12 * L)) * (L + 0.001))), typed = word.slice(0, n), caret = (n < L || Math.floor(t * 2.4) % 2) && t < tp ? '<i></i>' : '';
    setHTML(bx.inn, typed ? `<b>${typed}</b>${caret}` : `<em>Add a comment…</em>${caret}`); const sent = t > tp; const pc = sent ? 'post on sent' : n === L ? 'post on' : 'post'; if (bx.post.className !== pc) bx.post.className = pc; setTxt(bx.post, sent ? 'Posted ✓' : 'Post');
    const ts = i ? T.holdK - 0.35 : T.comment; put(bx.e, W / 2, 1330 + i * 132, seg(t, ts, ts + 0.3), pop(t, ts) * (1 + 0.06 * win(t, tp, tp + 0.3, 0.08, 0.2)));
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
  lampM.emissiveIntensity = night * 1.4;
  // the vault: the stack sinks; a dust ring when it drops; the glow underneath dims a little
  { const y = stackY(t); stack.position.y = y + Math.sin(t * 40) * 0.05 * win(t, T.sinkA, T.sinkA + 0.9, 0.05, 0.3); vaultGlow.material.opacity = 0.85 + 0.15 * Math.sin(t * 2.1) - 0.25 * seg(t, T.sinkA, T.sinkA + 0.9);
    const u = seg(t, T.sinkA + 0.3, T.sinkA + 1.5), u2 = seg(t, T.slideA + 0.2, T.slideA + 1.2); dustM.opacity = 0.75 * Math.max(u > 0 && u < 1 ? (1 - u) : 0, u2 > 0 && u2 < 1 ? 0.6 * (1 - u2) : 0); dust.scale.setScalar(10 + 26 * eo(Math.max(u, u2))); dust.visible = dustM.opacity > 0.01; }
  { const o = Math.max(win(t, T.sinkA + 0.2, T.b4 + 0.3, 0.3, 0.4), win(t, T.slideA - 0.3, T.b13 + 0.2, 0.3, 0.4)); recM.opacity = 0.95 * o * (0.8 + 0.2 * Math.sin(t * 6)); recLine.visible = o > 0.01; }
  // coins pour into the vault from the city
  { let n = 0; for (let i = 0; i < NIN; i++) { const c = INC[i], u = seg(t, c.t0, c.t0 + 0.9); if (t < c.t0 || u >= 1) continue; const e = [(i % 7 - 3) * 2.4, VH * 0.6, (i % 3 - 1) * 3];
      _e.set(t * c.sp + c.ph, c.ph, t * c.sp * 0.7); _q.setFromEuler(_e); _p.set(lerp(c.a[0], e[0], u), lerp(c.a[1], e[1], u) + Math.sin(u * Math.PI) * 14, lerp(c.a[2], e[2], u)); _s.setScalar(1.6); _m4.compose(_p, _q, _s); inCoins.setMatrixAt(n++, _m4); }
    inCoins.count = n; inCoins.instanceMatrix.needsUpdate = true; }
  // the bond pays coins into its dish; gold's dish stays empty
  { let n = 0; for (let i = 0; i < NPAY; i++) { const t0 = PAYT[i]; if (t < t0) continue; const u = seg(t, t0, t0 + 0.6), e = PAYP[i], st = [PB[0], 5.1, PB[1] + 0.4];
      _e.set(u < 1 ? t * 9 + i : Math.PI / 2 * 0.1, i, u < 1 ? t * 5 : 0); _q.setFromEuler(_e); _p.set(lerp(st[0], e[0], u), lerp(st[1], e[1], u) + Math.sin(u * Math.PI) * 2.6, lerp(st[2], e[2], u)); _s.setScalar(1); _m4.compose(_p, _q, _s); payCoins.setMatrixAt(n++, _m4); }
    payCoins.count = n; payCoins.instanceMatrix.needsUpdate = true; }
  bar.rotation.y = 0.2 + Math.sin(t * 0.8) * 0.05;
  // the harbour: tankers glide; the smoke rises on the horizon from "war"; a flash at "fighting"; the oil line climbs, the barrel rides its tip
  for (const tk of TANKERS) tk.m.position.x = tk.x + tk.dir * tk.v * t;
  { const o = Math.max(win(t, T.war1 - 0.15, T.b2 + 0.8, 0.9, 0.7), win(t, T.b6 + 0.2, T.so7 + 1.0, 0.6, 0.6)); fireM.opacity = 0.5 * o * (0.85 + 0.15 * Math.sin(t * 7)); fires.forEach(f => { f.visible = o > 0.01; });
    puffs.forEach(sp => { const d = sp.userData, ph = (t * 0.07 + d.k / 10 + d.ph * 0.05) % 1; sp.visible = o > 0.01; if (!sp.visible) return; sp.position.set(d.x + ph * 34 + Math.sin(d.ph + t * 0.4) * 3, 6 + ph * 115, d.z); const sc = 24 + ph * 70; sp.scale.set(sc, sc * 0.82, 1); sp.material.opacity = o * 0.8 * Math.min(1, ph * 5) * (1 - ph * 0.75); }); }
  flashM.opacity = 0.9 * (seg(t, T.flash1, T.flash1 + 0.06) * (1 - seg(t, T.flash1 + 0.1, T.flash1 + 0.7)) + 0.6 * seg(t, T.flash1 + 0.45, T.flash1 + 0.5) * (1 - seg(t, T.flash1 + 0.55, T.flash1 + 1.0)));
  { const u = eio(seg(t, T.barrelA, T.barrelA + 1.4)); let d = u * OILL; oilSegs.forEach(m => { const L = m.userData.L, k = c01(d / L); m.visible = k > 0.001; m.scale.set(Math.max(0.001, k * L), 1, 1); d -= L; });
    const tip = oilTip(u); barrel.visible = t > T.barrelA - 0.2 && t < T.b8 + 0.5; barrel.position.set(tip[0], tip[1] + 5.4 + Math.sin(t * 3) * 0.2, tip[2]); barrel.rotation.set(0.1, t * 0.6, -0.12); barrel.scale.setScalar(t < T.barrelA ? 0.01 : 1.6 * (0.6 + 0.4 * back(seg(t, T.barrelA - 0.2, T.barrelA + 0.2)))); }
  // the central bank's rate gauge rises
  fill.scale.y = GH * gaugeK(t); fillM.emissiveIntensity = 0.6 + 0.4 * win(t, T.raised, T.b8, 0.1, 0.5) * (0.5 + 0.5 * Math.sin(t * 9));
  calG.scale.setScalar(t < T.december - 0.2 ? 0.01 : Math.max(0.01, pop(t, T.december - 0.2, 0.4))); calG.visible = t > T.december - 0.2;
  // the AI towers: screens red and the towers drop at "crashed"
  AIT.forEach((a2, i) => { const u = eio(seg(t, T.crashA + i * 0.08, T.crashA + 0.7 + i * 0.08)); a2.g.scale.y = 1 - 0.3 * u; a2.g.position.y = Math.sin(t * 40 + i) * 0.15 * win(t, T.crashA, T.crashA + 0.8, 0.05, 0.3); a2.scr.material = u > 0.15 ? scrDnM : scrUpM; });
  // the trader's phone rings (margin call); he hurries off toward the kiosk at "fast"
  { const ring = (t > T.traders - 0.2 && t < T.fast + 0.3 && (t - T.traders) % 0.7 < 0.42) ? Math.sin(t * 60) : 0; phone.userData.handset.position.y = 0.66 + Math.abs(ring) * 0.14; phone.rotation.z = ring * 0.05;
    const go = eio(seg(t, T.fast, T.fast + 2.4)); trader.position.set(lerp(TR[0] - 0.4, K[0] - 2.5, go), Math.abs(Math.sin(t * 9)) * 0.12 * win(t, T.fast, T.fast + 2.4, 0.1, 0.2), lerp(TR[1] + 1.9, K[1] + 1.5, go)); trader.rotation.y = go > 0.01 && go < 0.99 ? Math.atan2(-(K[1] - TR[1]), K[0] - TR[0]) : -Math.PI / 2; }
  // gold bars fly out of the vault to the kiosk and become cash
  { let n = 0, m2 = 0; for (let i = 0; i < NFLY; i++) { const p = flyAt(i, t); if (p) { _e.set(t * 4 + i, t * 3, 0.3); _q.setFromEuler(_e); _p.set(p[0], p[1], p[2]); _s.setScalar(0.9); _m4.compose(_p, _q, _s); flyBars.setMatrixAt(n++, _m4); }
      if (t > FLYT[i] + 1.0) { const c = CASHP[i], k = Math.min(1, back(seg(t, FLYT[i] + 1.0, FLYT[i] + 1.3))); _q.setFromEuler(_e.set(0, 0.3 + i * 0.07, 0)); _p.set(c[0], c[1], c[2]); _s.set(1.1 * k, 1.1 * k, 1.1 * k); _m4.compose(_p, _q, _s); cashM.setMatrixAt(m2++, _m4); } }
    flyBars.count = n; cashM.count = m2; flyBars.instanceMatrix.needsUpdate = cashM.instanceMatrix.needsUpdate = true; }
  // the seesaw and its storm: darker and a bolt at "worse", clearing at "calmed", a sunbeam on gold at "rose"
  plank.rotation.z = tilt(t);
  { const st = win(t, T.storm, T.calmed + 0.3, 0.4, 0.9); stormM.opacity = 0.92 * st; stormG.visible = st > 0.01; stormG.position.x = SS[0] + Math.sin(t * 0.5) * 1.5; stormM.color.setRGB(0.3 + 0.1 * (1 - st), 0.3 + 0.1 * (1 - st), 0.36);
    boltM.opacity = seg(t, T.flash2, T.flash2 + 0.04) * (1 - seg(t, T.flash2 + 0.12, T.flash2 + 0.3)) + 0.7 * seg(t, T.flash2 + 0.36, T.flash2 + 0.4) * (1 - seg(t, T.flash2 + 0.46, T.flash2 + 0.7)); bolt.visible = boltM.opacity > 0.01;
    const sb = win(t, T.calmed + 0.1, T.b12 + 0.4, 0.4, 0.5); sunbeamM.opacity = 0.16 * sb; sunbeam.visible = sb > 0.01; }
  // cars, walkers, guards
  for (const c of CARS) { const L = 700, x = ((c.off + t * c.v) % L) - L / 2; c.m.position.set(c.dir * x, 0, c.z); c.m.rotation.y = c.dir > 0 ? 0 : Math.PI; }
  WALK.forEach((w, i) => { const hurry = eio(seg(t, T.b2 - 0.6 + i * 0.05, T.b3 + 0.4)), u = c01(hurry), x = lerp(w.a[0], w.b[0], u) + Math.sin(t * 0.3 * w.sp + w.ph) * 1.5 * (1 - u), z = lerp(w.a[1], w.b[1], u) + Math.cos(t * 0.3 * w.sp + w.ph) * 1.5 * (1 - u);
    w.m.position.set(x, Math.abs(Math.sin(t * 7 * w.sp + i)) * 0.08, z); w.m.rotation.y = u > 0.01 && u < 0.99 ? Math.atan2(-(w.b[1] - w.a[1]), w.b[0] - w.a[0]) : w.ph; });
  guards.forEach((m, i) => { m.position.y = hopY([T.sinkA + 0.4 + i * 0.08], t, 0.3); m.rotation.y = -Math.PI / 2 + 0.7 * win(t, T.sinkA, T.b4, 0.2, 0.4) * (i ? -1 : 1); });
  // clouds, sea glints
  for (const c of clouds) { c.position.x = c.userData.x0 + t * 1.2; c.material.opacity = 0.9 - 0.5 * night; const k = lerp(1, 0.45, night); c.material.color.setRGB(lerp(s.hor[0], 1, 0.55) * k, lerp(s.hor[1], 1, 0.55) * k, lerp(s.hor[2], 1, 0.55) * k * 1.05); c.material.emissive.setRGB(lerp(s.hor[0], 1, 0.4) * 0.55 * k, lerp(s.hor[1], 1, 0.4) * 0.55 * k, lerp(s.hor[2], 1, 0.4) * 0.58 * k); }
  for (const g of glints) { g.position.set(g.userData.x + Math.sin(t * g.userData.v) * 3, 0.12, g.userData.z); g.material.opacity = 0.25 + 0.25 * Math.sin(t * 2 + g.userData.x); }
  // sparkles: the vault's gold; the bond's coins; the cash; the posted answer on the seesaw
  { let k = 0; const put3 = (x, y, z, sz, on, col) => { const sp = sparks[k++]; if (!sp) return; const tw = Math.pow(Math.abs(Math.sin(t * sp.userData.w + sp.userData.ph)), 3); sp.position.set(x, y, z); sp.scale.setScalar(sz * (0.25 + tw)); sp.material.opacity = on * (0.3 + 0.7 * tw); sp.material.color.setHex(col); sp.visible = on > 0.01; };
    const sy = stackY(t), s1 = 1 - win(t, T.up6, T.b12 - 0.2, 0.3, 0.5); for (let i = 0; i < 30; i++) { const sp = sparks[i].userData; put3(sp.dx * (VW / 2 - 2), 1 + STACK_H * (0.3 + 0.7 * sp.k) + sy, VD / 2 - 2.4 + sp.dz * 0.8, 1.3, s1 * (sy + STACK_H * (0.3 + 0.7 * sp.k) > 0.6 ? 1 : 0), 0xFFE9A8); }
    const s2 = win(t, T.payA + 0.4, T.b6 + 1.5, 0.3, 0.4); for (let i = 0; i < 12; i++) { const a = i * 0.52 + t * 0.9; put3(PB[0] + Math.cos(a) * 1.2, 0.8 + Math.abs(Math.sin(a * 1.3)) * 1.1, PB[1] + 3.4 + Math.sin(a) * 1.2, 0.8, s2, 0xFFE9A8); }
    const s3 = win(t, T.flyA + 1.0, T.b10 + 0.3, 0.3, 0.4); for (let i = 0; i < 12; i++) { const a = i * 0.52 + t * 0.8; put3(K[0] + 6 + Math.cos(a) * 2.6, 1 + Math.abs(Math.sin(a * 1.7)) * 2, K[1] + 4.6 + Math.sin(a) * 1.6, 1.0, s3, 0xC8F5D8); }
    const s5 = win(t, T.b4 - 0.3, T.b6 + 0.5, 0.3, 0.4); for (let i = 0; i < 8; i++) { const sp = sparks[i + 72].userData; put3(PG[0] + sp.dx * 1.4, 2.7 + sp.k * 1.2, PG[1] + 0.9 + sp.dz * 0.4, 0.9, s5, 0xFFE9A8); }
    const s4 = win(t, T.postA, DUR + 1, 0.3, 0.1); for (let i = 0; i < 16; i++) { const ph = (t * 0.35 + i / 16) % 1, a = i * 2.4, side = i % 2 ? 1 : -1; put3(SS[0] + side * SE + Math.cos(a) * 1.4, 3 + ph * 4, SS[1] + Math.sin(a) * 1.4, 0.7 + 0.3 * (1 - ph), s4 * Math.sin(ph * Math.PI), 0xFFE9A8); }
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
  inCoins: INC.filter((_, i) => i % 5 === 0).map(c => +(c.t0 + 0.9).toFixed(3)), pay: PAYT.map(x => +(x + 0.6).toFixed(3)), fly: FLYT.map(x => +x.toFixed(3)), cash: FLYT.map(x => +(x + 1.0).toFixed(3)),
  typingA: [0, 1, 2, 3].map(i => +(T.sellK + (i + 0.5) * 0.12).toFixed(3)), typingB: [0, 1, 2, 3].map(i => +(T.holdK + (i + 0.5) * 0.12).toFixed(3)),
  postA: +T.postA.toFixed(3), postB: +T.postB.toFixed(3),
};
document.fonts.ready.then(() => Promise.all(['700 64px Figtree', '900 190px Fraunces', '800 30px JBM', '700 22px Inter', '700 78px Fraunces', '800 54px Figtree', '600 34px Figtree', '500 18px Inter', '900 128px JBM', '800 46px Inter', '900 150px Figtree', '900 112px Fraunces', '800 172px JBM', '700 34px Figtree', '800 92px JBM', '900 64px Figtree', '800 96px JBM', '800 66px Figtree', '800 62px Figtree', '800 64px Figtree', '800 78px Figtree', '900 300px Figtree', '700 42px Figtree', '800 52px Figtree', '800 84px JBM'].map(f => document.fonts.load(f)))).then(() => { TEXS.forEach(f => f()); fitHook(); renderAt(0); window.__ready = true; });
