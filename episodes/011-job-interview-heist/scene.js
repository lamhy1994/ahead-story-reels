// The $6 Billion Job Interview — low-poly storybook scene (deterministic: window.renderAt(t) draws the frame for time t)
// 29 Oct 2026: about $6.3 billion leaves Binance's hot wallets in under four hours. Binance says the way in was a fake job interview: fake recruiters,
// a fake CEO, a coding test that hid malware; from that laptop to the systems that approve payments. Almost half frozen within hours; Binance covers the
// losses; the FBI blames North Korea, which denies it. 18 Nov 2026: an Abu Dhabi court's worldwide freezing order, which can be served on the blockchain.
import * as THREE from 'three';
import { SKIN, MAT, GOLD, rng, GB, person, cloud, bushTree, tower, car, lamp, house, bank, palm, vaultDoor, BIGCOIN, WIN_LIT } from './kit.js';

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
const R = rng(20261029);

// ───────────────────────── story clock (everything hangs off the narration)
const T = {
  hookEnd: TIM.big ? 1.5 : TIM.hook ? E(1) + 0.15 : 0,  // the hook card (script.py HOOK): 0-1.5 s when there is a big number, else until the hook sentence ends
  bigIn: TIM.big ? 1.5 : 0, bigOut: TIM.big ? 3.0 : 0,   // the big number (script.py BIG): 1.5-3 s (Keith, 22 Nov 2026)
  fake1: wt(1, 'fake') - 0.1, job1: wt(1, 'job') - 0.1, interview1: wt(1, 'interview') - 0.1,
  b2: S(2) - 0.05, biggest2: wt(2, 'biggest') - 0.1, theft: wt(2, 'theft') - 0.1, record: wt(2, 'record') - 0.1,
  b3: S(3) - 0.05, how: wt(3, 'how') - 0.1, interview3: wt(3, 'interview') - 0.1, empty: wt(3, 'empty') - 0.1, wallets3: wt(3, 'wallets') - 0.1,
  b4: S(4) - 0.05, recruiters: wt(4, 'recruiters') - 0.1, won: wt(4, 'won') - 0.1, engineer: wt(4, "engineer's") - 0.1, trust4: wt(4, 'trust') - 0.1,
  b5: S(5) - 0.05, ceo: wt(5, 'CEO') - 0.1, sent: wt(5, 'sent') - 0.1, coding: wt(5, 'coding') - 0.1, test2: wt(5, 'test', 1) - 0.1, hid: wt(5, 'hid') - 0.1, malware: wt(5, 'malware') - 0.1,
  b6: S(6) - 0.05, laptop: wt(6, 'laptop') - 0.1, reached: wt(6, 'reached') - 0.1, systems: wt(6, 'systems') - 0.1, approve: wt(6, 'approve') - 0.1, payments: wt(6, 'payments') - 0.1,
  b7: S(7) - 0.05, nine: wt(7, 'Nine') - 0.1, later: wt(7, 'later') - 0.1, own: wt(7, 'own') - 0.1, wallets7: wt(7, 'wallets') - 0.1, paying: wt(7, 'paying') - 0.1, thieves7: wt(7, 'thieves') - 0.1,
  b8: S(8) - 0.05, four: wt(8, 'four') - 0.1, hours8: wt(8, 'hours') - 0.1, money: wt(8, 'money') - 0.1, gone: wt(8, 'gone') - 0.1,
  b9: S(9) - 0.05, within: wt(9, 'within') - 0.1, half9: wt(9, 'half') - 0.1, frozen: wt(9, 'frozen') - 0.1,
  b10: S(10) - 0.05, covered: wt(10, 'covered') - 0.1, losses: wt(10, 'losses') - 0.1, itself: wt(10, 'itself') - 0.1,
  b11: S(11) - 0.05, fbi: wt(11, 'FBI') - 0.1, blames: wt(11, 'blames') - 0.1, korea: wt(11, 'Korea') - 0.1, denies: wt(11, 'denies') - 0.1,
  b12: S(12) - 0.05, court: wt(12, 'court') - 0.1, abu: wt(12, 'Abu') - 0.1, froze: wt(12, 'froze') - 0.1, loot: wt(12, 'loot') - 0.1, worldwide: wt(12, 'worldwide') - 0.1,
  b13: S(13) - 0.05, order: wt(13, 'order') - 0.1, delivered: wt(13, 'delivered') - 0.1, thieves13: wt(13, "thieves'") - 0.1, wallets13: wt(13, 'wallets') - 0.1,
  b14: S(14) - 0.05, more: wt(14, 'More') - 0.1, half14: wt(14, 'half') - 0.1, missing: wt(14, 'missing') - 0.1, story14: wt(14, 'story') - 0.1, over: wt(14, 'over') - 0.1,
  b15: S(15) - 0.05, story: wt(15, 'story') - 0.15, heist: wt(15, 'heist') - 0.1, started: wt(15, 'started') - 0.1, trust15: wt(15, 'trust') - 0.1,
  cta: S(16) - 0.1, would: wt(16, 'Would') - 0.1, spotted: wt(16, 'spotted') - 0.1, fake16: wt(16, 'fake') - 0.1, comment: wt(16, 'Comment') - 0.15, yes: wt(16, 'YES') - 0.2, no: wt(16, 'NO') - 0.1,
};
T.doorShut = T.b3 + 0.2; T.doorOpen = T.paying - 0.45;                  // the vault door: open on the cover (the theft in one picture), shut while we go back, open again at "paying"
T.coverEnd = T.record + 0.3;                                             // the cover's coin stream stops departing here
T.theftA = T.paying - 0.1; T.theftB = T.gone + 0.6;                      // the real stream: departures between these
T.freeze = T.frozen - 0.15;                                              // four wallets of nine turn to ice (about 45%)
T.refillA = T.covered; T.refillB = T.itself + 0.6;                       // coins from Binance's own reserve back into the vault
T.gavel = T.froze - 0.12; T.ringA = T.froze + 0.05;                      // the gavel and the frost ring that spreads worldwide
T.chainA = T.order - 0.1; T.envA = T.delivered - 0.05; T.envB = T.wallets13 + 0.35;
T.postA = T.yes + 0.75; T.postB = T.no + 0.7;
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
const SKY = [[0, 'DUSK'], [T.b3, 'DUSK'], [T.b4 + 0.4, 'GOLDEN'], [T.b6 + 0.6, 'GOLDEN'], [T.b7 + 0.6, 'NIGHT'], [T.b10 - 0.2, 'NIGHT'], [T.b10 + 0.8, 'DUSK'],
  [T.b11, 'DUSK'], [T.blames, 'NIGHT'], [T.b12 + 0.2, 'NIGHT'], [T.court + 0.1, 'DAY'], [T.b14, 'DAY'], [T.missing + 0.3, 'SUNSET'], [T.b15 - 0.3, 'SUNSET'],
  [T.story + 1.2, 'NIGHT'], [DUR + 2, 'NIGHT']];
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
const V = [0, -90], VF = -76;                 // the vault (Binance) and its front face
const DOOR = [0, 12.5, VF + 0.75], DR = 8.2;  // the round vault door on the front face
const HM = [60, 22];                           // the engineer's home office (a cut-away room, open to +z)
const C1 = [44, -10], C2 = [30, -44];          // two colleagues' desks on the way
const PB = [24, -72];                          // the cabinet that approves payments, on the vault's front-right corner
const TW = [-20, -240];                        // the thieves' wallets: dark cases floating high behind the vault, under a storm cloud
const RC = [-27, -66];                         // Binance's own reserve chest
const CT = [330, -70];                         // the court in Abu Dhabi, far to the east
const DW = [362, 44, -96];                    // a thieves' wallet floating above the court district
const stat = [];

// ───────────────────────── ground, streets, plaza
const ground = new THREE.Mesh(new THREE.PlaneGeometry(2400, 2400).rotateX(-Math.PI / 2), new THREE.MeshLambertMaterial({ color: 0xC9C2AE })); ground.receiveShadow = true; scene.add(ground);
const flat = new GB();
flat.box(9, 0.04, 360, 0x4A4E56, 86, 0.02, -60); flat.box(9, 0.04, 360, 0x4A4E56, -46, 0.021, -60);              // avenues north-south
flat.box(520, 0.04, 9, 0x4A4E56, 20, 0.022, -124); flat.box(520, 0.04, 9, 0x4A4E56, 20, 0.023, 44);              // east-west
for (const z of [-124, 44]) for (let x = -230; x < 270; x += 6) flat.box(2.6, 0.05, 0.22, 0xF2EEE2, x, 0.045, z);
flat.box(70, 0.07, 50, 0xE6DFD0, 0, 0.035, -50);                                                                  // the plaza in front of the vault
for (let i = 0; i < 12; i++) flat.box(70, 0.075, 0.12, 0xD6CEBC, 0, 0.037, -73 + i * 4);
flat.box(26, 0.08, 22, 0x7FA86A, HM[0], 0.04, HM[1] + 2);                                                        // the garden around the home office
flat.box(5, 0.09, 30, 0xD8CDB6, HM[0] - 4, 0.045, HM[1] - 20);                                                    // its path to the plaza
flat.box(170, 0.06, 150, 0xE8D6A8, CT[0], 0.03, CT[1] + 4);                                                       // Abu Dhabi: sand, a boulevard, the sea
flat.box(14, 0.07, 150, 0x8A8F96, CT[0], 0.04, CT[1] + 4); flat.box(40, 0.08, 30, 0xEFE7D6, CT[0], 0.045, CT[1] + 16);
flat.box(360, 0.05, 90, 0x3E8FC0, CT[0], 0.05, -200);
{ const rr = rng(909); for (let i = 0; i < 60; i++) { const x = -260 + rr() * 480, z = -230 + rr() * 300; if (Math.abs(x) < 50 && z > -110 && z < -20) continue; if (Math.hypot(x - HM[0], z - HM[1]) < 22) continue; flat.box(6 + rr() * 14, 0.06, 6 + rr() * 14, rr() < 0.5 ? 0x8DAE74 : 0x9DB884, x, 0.03, z); } }
const flatM = flat.mesh(); flatM.castShadow = false; scene.add(flatM);

// ───────────────────────── the city
const DEST = (x, z) => (Math.abs(x) < 40 && z < -24 && z > -112) || (x > -80 && x < 14 && z > -30 && z < 80) || (Math.abs(x - TW[0]) < 60 && z < -196) || (x > 14 && x < 82 && z > -62 && z < 50) || Math.hypot(x - TW[0], z - TW[1]) < 60 || x > 240 || Math.abs(z + 124) < 9 || Math.abs(z - 44) < 9 || Math.abs(x - 86) < 9 || Math.abs(x + 46) < 9 || Math.hypot(x - RC[0], z - RC[1]) < 12;
{
  const tr = rng(2026), PAL = [[0xD9D3C6, 0x5E7F9A], [0x6D97AA, 0x3F6A80], [0xE4DED2, 0x4E7C93], [0xC9C2B4, 0x55748C], [0x8FB3C2, 0x426E86], [0xEFE9DC, 0x6A8AA4], [0xB7C4C9, 0x3E6378], [0xE8D9C0, 0x5A7A90]];
  for (let gx = -230; gx <= 230; gx += 22) for (let gz = -260; gz <= 90; gz += 22) {
    const x = gx + (tr() - .5) * 7, z = gz + (tr() - .5) * 7; if (DEST(x, z) || tr() < 0.12) continue;
    const dp = Math.hypot(x, z + 60), far = dp > 120, w = 9 + tr() * 7, d = 9 + tr() * 7;
    const h = (dp < 80 ? 12 + tr() * 16 : 18 + tr() * (far ? 44 : 28)) * (z > 20 ? 0.6 : 1);
    const pal = PAL[Math.floor(tr() * PAL.length)];
    const g = tower(w, h, d, { rand: tr, color: pal[0], glass: pal[1], floor: far ? 4.2 : 3.4, litP: 0.55, crown: h > 46 && tr() < 0.5 });
    g.position.set(x, 0, z); g.rotation.y = (tr() < 0.5 ? 0 : Math.PI / 2); g.children.forEach(c => { c.castShadow = dp < 140; c.receiveShadow = true; }); scene.add(g);
    stat.push([x - Math.max(w, d) / 2, x + Math.max(w, d) / 2, z - Math.max(w, d) / 2, z + Math.max(w, d) / 2, h + 4, 'tower']);
  }
}
// the vault: a steel-and-stone strongroom with a round door and a glowing heap of coins behind it
const vault = new THREE.Group(); scene.add(vault);
{ const b = new GB(), st = 0x6E7480, st2 = 0x8A909C, trim = 0xD9D3C6, dk = 0x2C3038;
  b.box(46, 1.2, 34, 0xCFC8BA, V[0], 0.6, V[1] + 1);                                        // plinth
  b.box(40, 30, 28, st, V[0], 15, V[1]);                                                    // the body
  b.box(42, 1.6, 30, trim, V[0], 30.6, V[1]); b.box(30, 4, 20, st2, V[0], 33, V[1] - 1);      // roof and top block
  for (const x of [-19, -13, 13, 19]) b.box(2.2, 28, 1.2, st2, x, 15, VF + 0.6);             // pilasters
  b.box(40, 2.0, 1.4, trim, V[0], 27.5, VF + 0.7);                                          // cornice band
  b.cyl(DR + 1.4, DR + 1.4, 0.6, 32, dk, DOOR[0], DOOR[1], VF + 0.3, Math.PI / 2, 0, 0);     // the door's dark frame ring
  for (let i = 0; i < 3; i++) b.box(16 - i * 3, 0.5, 2.2, trim, 0, 1.45 + i * 0.5, VF + 2.6 - i * 0.8);   // steps
  b.box(5, 8, 5, 0x3A4048, PB[0], 4, PB[1]); b.box(5.4, 0.5, 5.4, 0x8A8F96, PB[0], 8.2, PB[1]);       // the payments cabinet
  vault.add(b.mesh());
  const lw = new GB(); for (let k = 0; k < 6; k++) for (const s of [-1, 1]) lw.box(0.15, 3.2, 3.2, 0xFFFFFF, s * 20.1, 8 + k * 3.6, V[1] - 6 + (k % 2) * 6);
  const lm = new THREE.Mesh(lw.geo(), WIN_LIT); vault.add(lm);
  stat.push([V[0] - 21, V[0] + 21, V[1] - 15, V[1] + 15, 37, 'vault'], [PB[0] - 3, PB[0] + 3, PB[1] - 3, PB[1] + 3, 9.5, 'cabinet']); }
// the coins behind the door (a glowing round heap); it empties in the theft and fills again from the reserve
const heapBg = new THREE.Mesh(new THREE.CircleGeometry(DR + 0.2, 32), new THREE.MeshBasicMaterial({ color: 0x1A1408, toneMapped: false })); heapBg.position.set(DOOR[0], DOOR[1], VF + 0.62); scene.add(heapBg);
const heapM = new THREE.MeshBasicMaterial({ map: radial('rgba(255,214,90,1)', 'rgba(150,90,10,0.0)'), transparent: true, toneMapped: false, depthWrite: false });
const heap = new THREE.Mesh(new THREE.CircleGeometry(DR, 32), heapM); heap.position.set(DOOR[0], DOOR[1], VF + 0.66); scene.add(heap);
const heapCoins = (() => { const b = new GB(), rr = rng(77); for (let i = 0; i < 70; i++) { const a = rr() * 6.28, r = Math.sqrt(rr()) * DR * 0.85; b.cyl(0.9, 0.9, 0.06, 10, 0xFFFFFF, Math.cos(a) * r, Math.sin(a) * r * 0.9 - 1.5, rr() * 0.02, Math.PI / 2, 0, rr()); } const m = new THREE.Mesh(b.geo(), GOLD); m.position.set(DOOR[0], DOOR[1], VF + 0.68); return m; })(); scene.add(heapCoins);
const door = vaultDoor(DR); door.position.set(DOOR[0], DOOR[1], DOOR[2]); door.children.forEach(c => { c.castShadow = true; }); scene.add(door);
// Binance's own reserve: a big chest beside the vault
const chest = new THREE.Group(); { const b = new GB(); b.box(7, 4, 4.6, 0x3E6A5A, 0, 2, 0); b.box(7.3, 0.5, 4.9, 0xC9A23A, 0, 4.1, 0); b.box(7.3, 0.5, 0.4, 0xC9A23A, 0, 2, 2.35); b.box(1.2, 1.4, 0.3, 0xC9A23A, 0, 2.6, 2.45); chest.add(b.mesh());
  const lid = new GB(); lid.box(7.1, 1.1, 4.7, 0x34584B, 0, 0.55, 2.35); lid.box(7.3, 0.3, 0.3, 0xC9A23A, 0, 1.1, 4.6); const lm = lid.mesh(); const lp = new THREE.Group(); lp.position.set(0, 4.35, -2.35); lp.add(lm); chest.add(lp); chest.userData.lid = lp; }
chest.position.set(RC[0], 0, RC[1]); chest.rotation.y = 0.5; scene.add(chest); stat.push([RC[0] - 5, RC[0] + 5, RC[1] - 5, RC[1] + 5, 6.5, 'chest']);

// ───────────────────────── the home office: a cut-away room with a desk, a big laptop and the engineer
const room = new THREE.Group(); room.position.set(HM[0], 0, HM[1]); scene.add(room);
{ const b = new GB(), wall = 0xE9DCC0, wood = 0x6B4226;
  b.box(8, 0.3, 7, 0x9A6B48, 0, 0.15, 0); b.box(8, 4.2, 0.3, wall, 0, 2.25, -3.35); b.box(0.3, 4.2, 7, wall, -3.85, 2.25, 0);   // floor, back and left walls
  b.box(8.4, 0.3, 0.6, 0xD8C9A8, 0, 4.4, -3.35); b.box(0.6, 0.3, 7.2, 0xD8C9A8, -3.85, 4.4, 0);
  b.box(1.9, 1.3, 0.1, 0xF3E9D6, 2.1, 2.6, -3.17); b.box(1.7, 1.1, 0.12, 0x7FB8E0, 2.1, 2.6, -3.16);                          // a window
  b.box(1.4, 1.0, 0.08, 0x2F6FB8, -1.8, 2.9, -3.18); b.box(1.2, 0.8, 0.09, 0xF2D27A, -1.8, 2.9, -3.17);                           // a poster
  b.box(3.4, 0.14, 1.5, wood, 0, 1.06, -1.9); for (const [x, z] of [[-1.55, -2.5], [1.55, -2.5], [-1.55, -1.3], [1.55, -1.3]]) b.box(0.12, 1.0, 0.12, wood, x, 0.55, z);   // the desk
  b.box(0.9, 0.12, 0.9, 0x2E3440, 2.5, 0.66, -0.9); b.box(0.12, 1.0, 0.9, 0x2E3440, 2.95, 1.2, -0.9); b.cyl(0.08, 0.08, 0.6, 6, 0x5A5F66, 2.5, 0.33, -0.9);   // chair, pushed aside
  b.cyl(0.35, 0.28, 0.6, 8, 0xC8423A, 3.2, 0.45, -2.7); b.ball(0.6, 1, 0x4C9A62, 3.2, 1.2, -2.7);                               // a plant
  b.cyl(0.12, 0.1, 0.22, 8, 0xFAF6EE, 1.35, 1.24, -1.6);                                                                       // a mug
  room.add(b.mesh()); }
const lap = new THREE.Group(); lap.position.set(0.1, 1.13, -1.95); room.add(lap);
{ const b = new GB(); b.box(1.9, 0.07, 1.25, 0x9AA2AE, 0, 0.035, 0); b.box(1.6, 0.02, 0.6, 0x5A606A, 0, 0.075, -0.12); lap.add(b.mesh());
  const lid = new GB(); lid.box(1.9, 1.24, 0.06, 0x8A929E, 0, 0.62, 0); const lm = lid.mesh(); const hinge = new THREE.Group(); hinge.position.set(0, 0.06, -0.6); hinge.rotation.x = -0.16; hinge.add(lm); lap.add(hinge); lap.userData.hinge = hinge; }
const lapCv = document.createElement('canvas'); lapCv.width = 640; lapCv.height = 420; const lapTx = new THREE.CanvasTexture(lapCv); lapTx.colorSpace = THREE.SRGBColorSpace; lapTx.anisotropy = 4;
const lapScr = new THREE.Mesh(new THREE.PlaneGeometry(1.76, 1.14), new THREE.MeshBasicMaterial({ map: lapTx, toneMapped: false })); lapScr.position.set(0, 0.62, 0.035); lap.userData.hinge.add(lapScr);
room.updateMatrixWorld(true);
const LAPW = () => { const v = new THREE.Vector3(0, 0.62, 0.04); lapScr.parent.localToWorld(v.set(0, 0.62, 0.04)); return v; };
const modern = (i, extra = {}) => ({ robe: [0x34405A, 0x6A2E3E, 0x3F6A5A, 0x5A5A66, 0x7A5A3A, 0x2F4A6A, 0x8A3A3A, 0x3B6FA8, 0xB0603A, 0x4E7A3E][i % 10], skin: SKIN[i % 5], short: [0x231C18, 0x5A3E28, 0xC9A27A, 0x3A2A1E, 0x8A8A8A][i % 5], shirt: i % 2 ? 0xF4F2EC : undefined, ...extra });
const eng = person(modern(1, { robe: 0x3B6FA8, s: 1.05 })); eng.position.set(-1.45, 0.3, -0.9); eng.rotation.y = 0.55; room.add(eng);
stat.push([HM[0] - 4.2, HM[0] + 4.2, HM[1] - 3.7, HM[1] - 3.0, 4.7, 'room wall'], [HM[0] - 4.2, HM[0] - 3.5, HM[1] - 3.7, HM[1] + 3.6, 4.7, 'room wall']);
// neighbours: small houses around the garden
{ const hr = rng(31); for (const [x, z, ry] of [[42, 34, 0], [80, 30, 0], [78, 8, -Math.PI / 2], [42, 10, Math.PI / 2], [72, -18, -Math.PI / 2]]) { const m = house(9 + hr() * 3, 5.5 + hr() * 2, 8, { rand: hr, color: [0xB8644A, 0xD9C39A, 0x8FB3C2, 0xE4DED2][Math.floor(hr() * 4)] }); m.position.set(x, 0, z); m.rotation.y = ry; scene.add(m); stat.push([x - 6, x + 6, z - 6, z + 6, 10, 'house']); } }
// the two colleagues' desks (open-plan pods) and the trail the malware takes
function pod(i) { const g = new THREE.Group(), b = new GB(); b.box(3.6, 0.12, 1.8, 0xE6E1D6, 0, 1.06, 0); for (const [x, z] of [[-1.6, -0.7], [1.6, -0.7], [-1.6, 0.7], [1.6, 0.7]]) b.box(0.1, 1.0, 0.1, 0x8A8F96, x, 0.53, z); b.box(4, 1.6, 0.1, 0xA9C6D8, 0, 0.8, -1.0); b.box(0.2, 0.5, 0.2, 0x3A3F48, 0, 1.35, -0.4); g.add(b.mesh());
  const mon = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.1, 0.08), new THREE.MeshBasicMaterial({ color: 0x7FD3FF, toneMapped: false })); mon.position.set(0, 2.05, -0.4); g.add(mon); g.userData.mon = mon;
  const fr = new THREE.Mesh(new THREE.BoxGeometry(1.95, 1.25, 0.06), MAT); fr.position.set(0, 2.05, -0.46); g.add(fr);
  const p = person(modern(i + 4, { s: 1.0, badge: true })); p.position.set(0, 0, 1.25); p.rotation.y = Math.PI / 2; g.add(p); g.userData.p = p; return g; }
const pods = [C1, C2].map(([x, z], i) => { const g = pod(i); g.position.set(x, 0, z); g.rotation.y = 0.45; scene.add(g); stat.push([x - 3, x + 3, z - 3, z + 3, 3.4, 'pod']); return g; });
const TRAIL = [[HM[0] + 0.1, 1.2, HM[1] - 1.7], [HM[0] + 1.2, 0.12, HM[1] - 1.2], [HM[0] + 1.2, 0.12, HM[1] + 4.0], [HM[0] - 4, 0.12, HM[1] + 4.5], [HM[0] - 4, 0.12, HM[1] - 12], [C1[0] + 1.2, 0.12, C1[1] + 1.5], [C1[0], 1.2, C1[1]],
  [C1[0] - 1.5, 0.12, C1[1] - 2], [C2[0] + 1.6, 0.12, C2[1] + 1.8], [C2[0], 1.2, C2[1]], [C2[0] - 1.2, 0.12, C2[1] - 2.2], [PB[0], 0.12, PB[1] + 6], [PB[0], 0.12, PB[1] + 2.7]];
const trailPts = []; { for (let i = 0; i < TRAIL.length - 1; i++) { const a = TRAIL[i], b = TRAIL[i + 1], L = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]), n = Math.max(1, Math.round(L / 0.55)); for (let k = 0; k < n; k++) { const u = k / n; trailPts.push([lerp(a[0], b[0], u), lerp(a[1], b[1], u), lerp(a[2], b[2], u)]); } } trailPts.push(TRAIL[TRAIL.length - 1]); }
const trailM = new THREE.MeshBasicMaterial({ color: 0xFF4A3A, toneMapped: false });
const trail = new THREE.InstancedMesh(new THREE.BoxGeometry(1.0, 0.22, 1.0), trailM, trailPts.length); { const m4 = new THREE.Matrix4(); trailPts.forEach((p, i) => { m4.makeTranslation(p[0], p[1], p[2]); trail.setMatrixAt(i, m4); }); trail.count = 0; } trail.frustumCulled = false; scene.add(trail);
const trailK = [C1, C2].map(c => { let best = 0, bd = 1e9; trailPts.forEach((p, i) => { const d = Math.hypot(p[0] - c[0], p[2] - c[1]) + Math.abs(p[1] - 1.2); if (d < bd) { bd = d; best = i; } }); return best / trailPts.length; });
// the malware: a red bug that runs at the head of the trail
const BUG = (() => { const b = new GB(); b.ball(0.32, 1, 0xE0362A, 0, 0.3, 0, 1.35, 0.7, 1); b.ball(0.18, 1, 0x7A1410, 0.42, 0.32, 0); for (const s of [-1, 1]) for (let k = 0; k < 3; k++) b.box(0.05, 0.05, 0.42, 0x3A0A08, -0.25 + k * 0.25, 0.2, s * 0.32, 0, 0, 0); b.box(0.04, 0.04, 0.3, 0x3A0A08, 0.6, 0.45, 0.1, 0, 0.6, 0.4); b.box(0.04, 0.04, 0.3, 0x3A0A08, 0.6, 0.45, -0.1, 0, -0.6, 0.4); return b.geo(); })();
const bug = new THREE.Mesh(BUG, MAT); bug.castShadow = true; scene.add(bug);
const fileBox = new THREE.Group(); { const b = new GB(); b.box(0.9, 0.62, 0.12, 0xF2C14A, 0, 0, 0); b.box(0.42, 0.14, 0.13, 0xE0A93A, -0.24, 0.36, 0); b.box(0.6, 0.06, 0.14, 0xFFF4D0, 0, 0.05, 0.01); b.box(0.5, 0.06, 0.14, 0xFFF4D0, -0.05, -0.12, 0.01); fileBox.add(b.mesh()); } fileBox.visible = false; scene.add(fileBox);

// ───────────────────────── the thieves' wallets (dark cases under a storm cloud), the coins, the ice
const NWAL = 9, FROZ = [0, 2, 5, 7];             // four of nine freeze (about 45%)
const WPOS = Array.from({ length: NWAL }, (_, i) => { const rr = rng(500 + i); return [TW[0] + (i % 3 - 1) * 16 + (rr() - .5) * 5, 52 + Math.floor(i / 3) * 8 + rr() * 3, TW[1] + (Math.floor(i / 3) - 1) * 8 + (rr() - .5) * 6]; });
const WALG = (() => { const b = new GB(); b.box(5.2, 3.6, 1.6, 0x23262E, 0, 0, 0); b.box(5.3, 0.5, 1.7, 0x3A3F4A, 0, 1.2, 0); b.box(1.6, 0.4, 1.75, 0xFF4A3A, 0, 0.3, 0); b.box(0.5, 0.9, 1.72, 0x15171C, -2.1, -0.4, 0); return b.geo(); })();
const slotM = new THREE.MeshBasicMaterial({ color: 0xFF5A3A, toneMapped: false });
const wallets = WPOS.map((p, i) => { const g = new THREE.Group(), m = new THREE.Mesh(WALG, MAT); m.castShadow = true; g.add(m); const sl = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.42, 1.8), slotM); sl.position.y = 0.3; g.add(sl); g.position.set(...p); g.rotation.y = 0.15 + (i % 3) * 0.12; g.scale.setScalar(1.6); scene.add(g); return g; });
const iceM = new THREE.MeshLambertMaterial({ color: 0xBFEFFF, emissive: 0x2A6A8A, emissiveIntensity: 0.35, transparent: true, opacity: 0.62, depthWrite: false });
const ices = FROZ.map(i => { const m = new THREE.Mesh(new THREE.IcosahedronGeometry(6.8, 0), iceM); m.position.set(...WPOS[i]); m.scale.setScalar(0.01); m.visible = false; m.renderOrder = 3; scene.add(m); return m; });
stat.push([TW[0] - 32, TW[0] + 32, TW[1] - 24, TW[1] + 24, 80, 'wallets']);
const storm = []; for (let i = 0; i < 4; i++) { const m = cloud(R); m.position.set(TW[0] - 24 + i * 16, 92 + R() * 5, TW[1] - 6 + R() * 10); m.scale.setScalar(3.4); m.userData.x0 = m.position.x; scene.add(m); storm.push(m); }
const beamM = new THREE.MeshBasicMaterial({ color: 0xFFF1C0, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false, side: THREE.DoubleSide });
const beam = new THREE.Mesh(new THREE.ConeGeometry(9, 80, 20, 1, true).translate(0, -40, 0), beamM); beam.position.set(TW[0] + 34, 2, TW[1] + 64); scene.add(beam);
// coins: one stream on the cover, the real one at "paying"; four in nine are stablecoins (teal) that freeze later; a third stream refills the vault from the reserve
const NC = 150, COING = BIGCOIN(0.95, 0.3);
const TEAL = new THREE.MeshLambertMaterial({ color: 0x3FC8B4, emissive: 0x0E6A5E, emissiveIntensity: 0.5 });
const coinsG = new THREE.InstancedMesh(COING, GOLD, NC), coinsT = new THREE.InstancedMesh(COING, TEAL, NC); coinsG.castShadow = coinsT.castShadow = true; coinsG.frustumCulled = coinsT.frustumCulled = false; scene.add(coinsG, coinsT);
const CR = Array.from({ length: NC }, (_, i) => { const rr = rng(900 + i); return { w: Math.floor(rr() * NWAL), h: 30 + rr() * 22, j: rr(), sx: (rr() - .5) * 2, sy: (rr() - .5) * 2, sp: 4 + rr() * 6, ph: rr() * 6 }; });
const NR = 40, coinsR = new THREE.InstancedMesh(COING, GOLD, NR); coinsR.castShadow = true; coinsR.frustumCulled = false; scene.add(coinsR);
const _m4 = new THREE.Matrix4(), _q = new THREE.Quaternion(), _e = new THREE.Euler(), _p = new THREE.Vector3(), _s = new THREE.Vector3();
const FLY = 2.6;
function coinAt(i, t) {   // [x, y, z, visible] of coin i at time t
  const c = CR[i]; let td;
  if (t < T.b4) td = -FLY + (i / NC) * (T.coverEnd + FLY) + c.j * 0.15;
  else td = T.theftA + (i / NC) * (T.theftB - T.theftA) + c.j * 0.12;
  const u = (t - td) / FLY; if (u < 0 || u > 1) return null;
  const w = WPOS[c.w], p0 = [DOOR[0] + c.sx * 3, DOOR[1] + c.sy * 3, DOOR[2] + 1.5], p1 = [p0[0] + c.sx * 8, p0[1] + 22, p0[2] + 24 + c.sy * 4], p2 = [lerp(p0[0], w[0], 0.6), Math.max(w[1], 45) + c.h * 0.6, lerp(p0[2], w[2], 0.42)];
  const a = (1 - u) ** 3, b = 3 * (1 - u) ** 2 * u, d = 3 * (1 - u) * u * u, e = u ** 3;
  return [a * p0[0] + b * p1[0] + d * p2[0] + e * w[0], a * p0[1] + b * p1[1] + d * p2[1] + e * w[1], a * p0[2] + b * p1[2] + d * p2[2] + e * w[2]];
}
function setCoins(t) {
  let ng = 0, nt = 0;
  for (let i = 0; i < NC; i++) {
    const p = coinAt(i, t); if (!p) continue; const teal = FROZ.includes(CR[i].w), c = CR[i];
    _e.set(t * c.sp + c.ph, c.ph, t * c.sp * 0.7); _q.setFromEuler(_e); _p.set(p[0], p[1], p[2]); _s.setScalar(1);
    _m4.compose(_p, _q, _s); if (teal) coinsT.setMatrixAt(nt++, _m4); else coinsG.setMatrixAt(ng++, _m4);
  }
  coinsG.count = ng; coinsT.count = nt; coinsG.instanceMatrix.needsUpdate = coinsT.instanceMatrix.needsUpdate = true;
  let nr = 0;
  for (let i = 0; i < NR; i++) { const td = T.refillA + (i / NR) * (T.refillB - T.refillA - 1.2), u = (t - td) / 1.2; if (u < 0 || u > 1) continue;
    const s = [RC[0], 4.6, RC[1]], e = [DOOR[0] + Math.sin(i * 2.4) * 3, DOOR[1] + Math.cos(i * 1.7) * 3, DOOR[2] + 0.5];
    _e.set(t * 6 + i, i, t * 4); _q.setFromEuler(_e); _p.set(lerp(s[0], e[0], u), lerp(s[1], e[1], u) + Math.sin(u * Math.PI) * 14, lerp(s[2], e[2], u)); _s.setScalar(1); _m4.compose(_p, _q, _s); coinsR.setMatrixAt(nr++, _m4); }
  coinsR.count = nr; coinsR.instanceMatrix.needsUpdate = true;
}

// ───────────────────────── Abu Dhabi: the court, palms, white towers by the sea, the gavel, the frost ring, the blockchain and the order
const court = bank(); court.position.set(CT[0], 0, CT[1]); court.children.forEach(c => { c.castShadow = true; c.receiveShadow = true; }); scene.add(court); stat.push([CT[0] - 14, CT[0] + 14, CT[1] - 10, CT[1] + 12, 19, 'court']);
{ const pr = rng(66); for (const [x, z] of [[-24, 12], [-24, 26], [24, 12], [24, 26], [-40, 0], [40, 0], [-40, 30], [40, 30], [-12, 40], [12, 40], [-56, 18], [56, 18]]) { const m = palm(6 + pr() * 2.5, pr); m.position.set(CT[0] + x, 0, CT[1] + z); m.rotation.y = pr() * 6; m.scale.setScalar(1.6); scene.add(m); } }
{ const tr = rng(71); for (let i = 0; i < 9; i++) { const x = CT[0] - 90 + i * 22 + (tr() - .5) * 6, z = CT[1] - 110 - (i % 3) * 16, h = 30 + tr() * 46; const g = tower(10 + tr() * 4, h, 10 + tr() * 4, { rand: tr, color: [0xF2EEE6, 0xE4E8EC, 0xD8E4EA][i % 3], glass: [0x6AA6C8, 0x4E8FB0, 0x8FC2DA][i % 3], floor: 4, litP: 0.4, crown: tr() < 0.5 }); g.position.set(x, 0, z); scene.add(g); stat.push([x - 8, x + 8, z - 8, z + 8, h + 4, 'tower AD']); } }
const GBLOCK = [CT[0] + 15, CT[1] + 22];
const gavel = new THREE.Group(); { const b = new GB(); b.cyl(1.7, 1.7, 6.5, 16, 0x6B3F22, 0, 0, 0); b.cyl(1.85, 1.85, 0.8, 16, 0xC9A23A, 0, -2.6, 0); b.cyl(1.85, 1.85, 0.8, 16, 0xC9A23A, 0, 2.6, 0); b.cyl(0.42, 0.5, 11, 10, 0x7A4A28, 7.2, 0, 0, 0, 0, Math.PI / 2); gavel.add(b.mesh()); }
gavel.position.set(GBLOCK[0], 12, GBLOCK[1]); gavel.rotation.y = -0.5; scene.add(gavel);
{ const b = new GB(); b.cyl(3.6, 3.9, 2.2, 18, 0x6B3F22, 0, 1.1, 0); b.cyl(3.7, 3.7, 0.25, 18, 0xC9A23A, 0, 2.2, 0); const m = b.mesh(); m.position.set(GBLOCK[0], 0, GBLOCK[1]); scene.add(m); stat.push([GBLOCK[0] - 5, GBLOCK[0] + 5, GBLOCK[1] - 5, GBLOCK[1] + 5, 16, 'gavel']); }
const ringMs = [0, 1, 2].map(() => new THREE.MeshBasicMaterial({ color: 0x8FDFFF, transparent: true, opacity: 0, depthWrite: false, toneMapped: false, side: THREE.DoubleSide }));
const rings = ringMs.map(m => { const r = new THREE.Mesh(new THREE.RingGeometry(0.72, 1, 64).rotateX(-Math.PI / 2), m); r.position.set(GBLOCK[0], 0.3, GBLOCK[1]); r.renderOrder = 2; scene.add(r); return r; });
const frostM = new THREE.MeshBasicMaterial({ color: 0xA8E6FF, transparent: true, opacity: 0, depthWrite: false, toneMapped: false });
const frost = new THREE.Mesh(new THREE.CircleGeometry(1, 64).rotateX(-Math.PI / 2), frostM); frost.position.set(GBLOCK[0], 0.25, GBLOCK[1]); frost.renderOrder = 1; scene.add(frost);
const CHN = 8, chainA = [GBLOCK[0] - 1, 5, GBLOCK[1] - 6], chainB = [DW[0] - 3, DW[1] - 1, DW[2] + 3];
const chainPos = Array.from({ length: CHN }, (_, i) => { const u = i / (CHN - 1); return [lerp(chainA[0], chainB[0], u), lerp(chainA[1], chainB[1], u) + Math.sin(u * Math.PI) * 6, lerp(chainA[2], chainB[2], u)]; });
const blockM = new THREE.MeshLambertMaterial({ color: 0x7FD3FF, emissive: 0x2A8ABF, emissiveIntensity: 0.9 });
const blocks = chainPos.map(p => { const m = new THREE.Mesh(new THREE.BoxGeometry(2.2, 2.2, 2.2), blockM); m.position.set(...p); m.scale.setScalar(0.01); m.visible = false; scene.add(m); return m; });
const links = chainPos.slice(1).map((p, i) => { const a = chainPos[i], m = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 1, 6), blockM); const d = new THREE.Vector3(p[0] - a[0], p[1] - a[1], p[2] - a[2]); m.position.set((p[0] + a[0]) / 2, (p[1] + a[1]) / 2, (p[2] + a[2]) / 2); m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.clone().normalize()); m.scale.set(1, d.length(), 1); m.userData.L = d.length(); m.visible = false; scene.add(m); return m; });
const dwal = new THREE.Mesh(WALG, MAT); dwal.position.set(...DW); dwal.rotation.y = -0.5; dwal.scale.setScalar(1.15); dwal.castShadow = true; scene.add(dwal);
const env = new THREE.Group(); { const b = new GB(); b.box(2.6, 0.1, 1.7, 0xFBF6E8, 0, 0, 0); b.box(2.5, 0.12, 0.08, 0xE6DCC4, 0, 0.01, 0.3, 0, 0.55, 0); b.box(2.5, 0.12, 0.08, 0xE6DCC4, 0, 0.01, 0.3, 0, -0.55, 0); b.cyl(0.34, 0.34, 0.16, 12, 0xC8282C, 0, 0.06, 0.15); env.add(new THREE.Mesh(b.geo(), new THREE.MeshBasicMaterial({ vertexColors: true, toneMapped: false }))); } env.visible = false; scene.add(env);

// ───────────────────────── street life, clouds, sparkles
const lampHeads = new GB();
for (const z of [-30, -46, -62]) for (const s of [-1, 1]) { const l = lamp(6.2); l.position.set(s * 36, 0, z); l.rotation.y = s > 0 ? Math.PI : 0; scene.add(l); lampHeads.box(0.6, 0.12, 0.36, 0xFFFFFF, s * 36 - s * 1.25, 6.02, z); }
const lampM = new THREE.MeshLambertMaterial({ color: 0xFFF1C8, emissive: 0xFFD27A, emissiveIntensity: 0 }); scene.add(new THREE.Mesh(lampHeads.geo(), lampM));
for (const [x, z] of [[-30, -28], [28, -26], [-34, -58], [-14, -26], [14, -28], [50, 40], [70, 40], [66, -2], [34, 12], [-40, -80], [40, -96]]) { const m = bushTree(5.5 + R() * 2, R); m.position.set(x, 0, z); scene.add(m); }
const CARS = [[0xC8423A, -126, 1, 8, 0], [0x2F6FB8, -121, -1, 9, 40], [0xE9C46A, 42, 1, 7, 150], [0x4C9A62, 46, -1, 8, 230], [0xEDEDED, -126, 1, 8.6, 300], [0x7A4FA0, 46, -1, 7, 90]].map(([col, z, dir, v, off]) => { const m = car(col, { boxy: true }); scene.add(m); return { m, z, dir, v, off }; });
const WALK = [[-24, -40, 14, -6], [10, -48, -12, 4], [-8, -34, 10, -6], [20, -38, -14, -5], [-28, -50, 12, 6]].map(([x, z, dx, dz], i) => { const m = person(modern(i, { badge: i % 3 === 0 })); scene.add(m); return { m, a: [x, z], b: [x + dx, z + dz], sp: 0.06 + i * 0.011, ph: i * 0.27 }; });
const guards = [[-9, VF + 5], [9, VF + 5]].map(([x, z], i) => { const m = person(modern(i + 6, { robe: 0x2B2F3A })); m.position.set(x, 0, z); m.rotation.y = -Math.PI / 2; scene.add(m); return m; });
const clouds = []; for (let i = 0; i < 18; i++) { const m = cloud(R); const far = i >= 10; m.position.set(far ? -500 + R() * 1100 : -260 + i * 60 + R() * 20, 80 + R() * 40, far ? -560 + R() * 200 : -340 + R() * 300); m.scale.setScalar(2.0 + R() * 2.2); m.userData.x0 = m.position.x; scene.add(m); clouds.push(m); }
const sparkT = (() => { const cv = document.createElement('canvas'); cv.width = cv.height = 64; const g = cv.getContext('2d'); g.translate(32, 32); g.fillStyle = '#fff'; for (let k = 0; k < 2; k++) { g.rotate(Math.PI / 2 * k); g.beginPath(); g.moveTo(0, -30); g.quadraticCurveTo(3, -3, 30, 0); g.quadraticCurveTo(3, 3, 0, 30); g.quadraticCurveTo(-3, 3, -30, 0); g.quadraticCurveTo(-3, -3, 0, -30); g.fill(); } const tx = new THREE.CanvasTexture(cv); tx.colorSpace = THREE.SRGBColorSpace; return tx; })();
const sparks = []; for (let i = 0; i < 90; i++) { const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: sparkT, color: 0xFFE9A8, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false })); sp.userData = { ph: R() * 6.28, w: 3 + R() * 4, dx: (R() - 0.5) * 2, dz: (R() - 0.5) * 2, k: R() }; scene.add(sp); sparks.push(sp); }

// ───────────────────────── the laptop screen: one canvas, redrawn only when what it shows changes
const F = (w, px, fam) => `${w} ${px}px ${fam}`;
let lapKey = '';
function lapMode(t) {
  if (t >= T.cta - 0.2) return ['cta', seg(t, T.spotted - 0.2, T.spotted + 0.4)];
  if (t >= T.hid) return ['bug', seg(t, T.hid, T.malware + 0.3)];
  if (t >= T.b5 - 0.1) return ['ceo', seg(t, T.sent, T.coding + 0.2)];
  if (t >= T.b4 - 0.6) return ['call', seg(t, T.won, T.trust4 + 0.2)];
  return ['idle', 0];
}
function drawLaptop(t) {
  const [mode, a] = lapMode(t), blink = Math.floor(t * 2) % 2, key = mode + Math.round(a * 20) + (mode === 'bug' || mode === 'call' ? blink : '');
  if (key === lapKey) return; lapKey = key;
  const g = lapCv.getContext('2d'), w = 640, h = 420; g.textAlign = 'center'; g.textBaseline = 'middle';
  const avatar = (x, y, r, col, head) => { g.fillStyle = col; g.fillRect(x - r * 1.6, y - r * 1.4, r * 3.2, r * 3.0); g.fillStyle = head; g.beginPath(); g.arc(x, y - r * 0.25, r * 0.55, 0, 7); g.fill(); g.beginPath(); g.ellipse(x, y + r * 1.15, r * 1.05, r * 0.75, 0, Math.PI, 0); g.fill(); };
  if (mode === 'idle') { g.fillStyle = '#1B2338'; g.fillRect(0, 0, w, h); g.fillStyle = '#7FB8E0'; g.font = F(800, 44, 'Inter'); g.fillText('JOBS · NEW MESSAGE', w / 2, h / 2); }
  else if (mode === 'call') {
    g.fillStyle = '#10182A'; g.fillRect(0, 0, w, h);
    avatar(w / 2, 175, 92, '#2F6A8A', '#D9E6EE');
    g.fillStyle = '#FFFFFF'; g.font = F(800, 38, 'Inter'); g.fillText('"HR" · recruiter', w / 2, 362);
    g.fillStyle = blink ? '#FF4A3A' : '#7A2A24'; g.beginPath(); g.arc(46, 40, 13, 0, 7); g.fill(); g.fillStyle = '#FFFFFF'; g.font = F(800, 26, 'Inter'); g.textAlign = 'left'; g.fillText('VIDEO CALL', 68, 41); g.textAlign = 'center';
    g.fillStyle = '#3A4458'; g.fillRect(w - 150, h - 120, 128, 100); avatar(w - 86, h - 66, 24, '#3A4458', '#C99466');
    if (a > 0) { g.globalAlpha = c01(a * 2); g.fillStyle = '#3FAE6A'; g.beginPath(); g.arc(w / 2 + 120, 120, 44, 0, 7); g.fill(); g.strokeStyle = '#fff'; g.lineWidth = 12; g.lineCap = 'round'; g.beginPath(); g.moveTo(w / 2 + 98, 120); g.lineTo(w / 2 + 114, 138); g.lineTo(w / 2 + 144, 102); g.stroke(); g.globalAlpha = 1; }
  } else if (mode === 'ceo') {
    g.fillStyle = '#10182A'; g.fillRect(0, 0, w, h);
    avatar(70, 78, 30, '#6A4A8A', '#E4D6EE'); g.textAlign = 'left'; g.fillStyle = '#FFFFFF'; g.font = F(800, 34, 'Inter'); g.fillText('"CEO"', 130, 70); g.fillStyle = 'rgba(255,255,255,.6)'; g.font = F(600, 22, 'Inter'); g.fillText('new company', 130, 100);
    g.fillStyle = '#2A3550'; g.beginPath(); g.roundRect(40, 140, 560, 90, 22); g.fill(); g.fillStyle = '#FFFFFF'; g.font = F(700, 32, 'Inter'); g.fillText('Please do this coding test', 66, 186);
    if (a > 0) { g.globalAlpha = c01(a * 1.6); g.fillStyle = '#F2C14A'; g.beginPath(); g.roundRect(40, 260, 560, 120, 22); g.fill(); g.fillStyle = '#2A1E00'; g.font = F(800, 38, 'JBM'); g.fillText('coding_test.zip', 70, 320); g.strokeStyle = '#2A1E00'; g.lineWidth = 10; g.lineCap = 'round'; g.beginPath(); g.moveTo(545, 290); g.lineTo(545, 345); g.moveTo(522, 322); g.lineTo(545, 347); g.lineTo(568, 322); g.stroke(); g.globalAlpha = 1; }
    g.textAlign = 'center';
  } else if (mode === 'bug') {
    g.fillStyle = blink ? '#5A0E0A' : '#3A0806'; g.fillRect(0, 0, w, h);
    g.strokeStyle = 'rgba(255,90,70,.35)'; g.lineWidth = 3; for (let i = 0; i < 9; i++) { g.beginPath(); g.moveTo(0, 30 + i * 46); g.lineTo(w, 30 + i * 46 + (i % 2 ? 6 : -6)); g.stroke(); }
    const s = 0.6 + 0.4 * c01(a * 1.5); g.save(); g.translate(w / 2, 165); g.scale(s, s); g.fillStyle = '#FF4A3A'; g.beginPath(); g.ellipse(0, 0, 70, 95, 0, 0, 7); g.fill(); g.beginPath(); g.arc(0, -110, 40, 0, 7); g.fill();
    g.strokeStyle = '#FF4A3A'; g.lineWidth = 12; for (const sx of [-1, 1]) for (let k = 0; k < 3; k++) { g.beginPath(); g.moveTo(sx * 60, -40 + k * 40); g.lineTo(sx * 120, -70 + k * 50); g.stroke(); } g.restore();
    g.fillStyle = '#FFFFFF'; g.font = F(900, 60, 'JBM'); g.fillText('MALWARE', w / 2, 360);
  } else if (mode === 'cta') {
    g.fillStyle = '#10182A'; g.fillRect(0, 0, w, h); g.fillStyle = '#FFFFFF'; g.font = F(800, 46, 'Inter'); g.fillText('Spot the fake?', w / 2, 110);
    g.fillStyle = '#F7A600'; g.beginPath(); g.roundRect(70, 200, 230, 130, 26); g.fill(); g.fillStyle = '#6FD0C0'; g.beginPath(); g.roundRect(340, 200, 230, 130, 26); g.fill();
    g.fillStyle = '#1C1300'; g.font = F(900, 64, 'Inter'); g.fillText('YES', 185, 268); g.fillStyle = '#062A24'; g.fillText('NO', 455, 268);
  }
  lapTx.needsUpdate = true;
}

// ───────────────────────── camera path (spherical keys around a target; `up` tilts the view so the subject sits lower in the frame)
const LAP = [HM[0] + 0.1, 1.75, HM[1] - 1.95];
const VDOOR = [DOOR[0], DOOR[1] - 1, DOOR[2]];
const CAM = [
  { t: 0, tg: [6, 30, -112], d: 212, az: -12, el: 7, up: 0.04 },                                    // the cover: the vault in the city at dusk, coins pouring out to the thieves
  { t: T.bigOut, tg: [2, 33, -118], d: 200, az: -10, el: 7, up: 0.04, mv: 1 },
  { t: T.record + 0.5, tg: [-8, 44, -168], d: 205, az: -6, el: 5, up: 0.03, mv: 1 },
  { t: T.interview3, tg: [20, 22, -40], d: 130, az: 20, el: 24, up: 0.03, mv: 1 },                   // crane toward the suburb
  { t: T.wallets3 + 0.5, tg: [LAP[0], 2, LAP[2] + 2], d: 30, az: 12, el: 24, up: 0.02, mv: 1 },     // down into the home office
  { t: T.recruiters + 0.3, tg: LAP, d: 8.6, az: 6, el: 11, up: 0.02, mv: 1 },
  { t: T.trust4 + 0.4, tg: LAP, d: 8.0, az: 12, el: 11, up: 0.02 },
  { t: T.coding + 0.2, tg: LAP, d: 6.8, az: 4, el: 9, up: 0.02, mv: 1 },
  { t: T.malware + 0.6, tg: LAP, d: 6.2, az: -4, el: 9, up: 0.02 },
  { t: T.laptop + 0.35, tg: [HM[0], 1.5, HM[1] - 1], d: 16, az: 24, el: 42, up: 0.0, mv: 1 },       // rise out of the room
  { t: T.reached + 0.3, tg: [C1[0] + 4, 1, C1[1] + 6], d: 58, az: 30, el: 30, up: 0.0, mv: 1 },     // the trail runs out of the house to the colleagues
  { t: T.systems + 0.3, tg: [C2[0] + 2, 1, C2[1] + 4], d: 66, az: 34, el: 28, up: 0.0, mv: 1 },
  { t: T.payments + 0.4, tg: [PB[0] - 6, 6, PB[1] + 4], d: 72, az: 44, el: 22, up: 0.02, mv: 1 },  // to the payments cabinet at the vault
  { t: T.later + 0.2, tg: VDOOR, d: 62, az: 22, el: 10, up: 0.04, mv: 1 },                          // nine days later: the vault door
  { t: T.paying + 0.2, tg: VDOOR, d: 58, az: 14, el: 10, up: 0.04 },
  { t: T.thieves7 + 0.6, tg: [-8, 38, -150], d: 185, az: -10, el: 7, up: 0.04, mv: 1 },            // wide: the coins arc to the thieves' wallets
  { t: T.gone + 0.4, tg: [-10, 40, -155], d: 178, az: -14, el: 7, up: 0.04 },
  { t: T.half9 + 0.1, tg: [TW[0], 60, TW[1]], d: 84, az: 10, el: 4, up: 0.02, mv: 1 },              // the wallets: four freeze
  { t: T.frozen + 0.7, tg: [TW[0], 60, TW[1]], d: 78, az: 2, el: 4, up: 0.02 },
  { t: T.losses, tg: [-14, 9, -70], d: 78, az: -38, el: 14, up: 0.03, mv: 1 },                      // back at the vault: the reserve refills it
  { t: T.itself + 0.5, tg: [-14, 9, -70], d: 74, az: -44, el: 14, up: 0.03 },
  { t: T.blames, tg: [TW[0], 62, TW[1]], d: 96, az: 26, el: 3, up: 0.03, mv: 1 },                  // who did it? the wallets under the storm
  { t: T.denies + 0.5, tg: [TW[0], 62, TW[1]], d: 90, az: 18, el: 3, up: 0.03 },
  { t: T.b12 + 0.55, tg: [TW[0] + 60, 200, TW[1] + 40], d: 40, az: 30, el: -42, up: 0, mv: 1 },    // sky wipe east
  { t: T.court - 0.05, tg: [CT[0] - 60, 150, CT[1] + 20], d: 40, az: 10, el: -30, up: 0, mv: 1 },
  { t: T.abu + 0.4, tg: [CT[0] + 4, 9, CT[1] + 14], d: 80, az: 14, el: 10, up: 0.04, mv: 1 },       // down to the court in Abu Dhabi
  { t: T.froze + 0.2, tg: [GBLOCK[0], 6, GBLOCK[1]], d: 64, az: 20, el: 12, up: 0.03, mv: 1 },      // the gavel
  { t: T.worldwide + 0.5, tg: [CT[0], 2, CT[1] + 10], d: 170, az: 22, el: 30, up: 0.03, mv: 1 },    // the frost ring spreads
  { t: T.order + 0.2, tg: [CT[0] + 22, 22, CT[1] - 18], d: 100, az: 36, el: 4, up: 0.03, mv: 1 },    // the blockchain to the thieves' wallet
  { t: T.wallets13 + 0.5, tg: [DW[0] - 6, DW[1] - 8, DW[2] + 8], d: 74, az: 40, el: 2, up: 0.03, mv: 1 },
  { t: T.missing + 0.2, tg: [CT[0] + 10, 18, CT[1] - 20], d: 180, az: 26, el: 18, up: 0.06, mv: 1 },
  { t: T.over + 0.4, tg: [CT[0] + 10, 18, CT[1] - 20], d: 174, az: 22, el: 18, up: 0.06 },
  { t: T.story + 0.9, tg: [-10, 18, -80], d: 300, az: 16, el: 20, up: 0.15, mv: 3 },                // crane up over the city at night
  { t: T.cta - 0.6, tg: [-10, 18, -80], d: 288, az: 13, el: 20, up: 0.15 },
  { t: T.spotted + 0.1, tg: [LAP[0], 2, LAP[2] + 3], d: 34, az: 10, el: 32, up: 0.02, mv: 1 },      // down to the home office
  { t: T.comment + 0.15, tg: LAP, d: 7.6, az: 8, el: 10, up: 0.02, mv: 1 },                         // the laptop: spot the fake?
  { t: DUR + 0.5, tg: LAP, d: 7.0, az: 4, el: 10, up: 0.02 },
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
.tag.dn{color:#fff;background:#D9483B;border-color:#D9483B;} .tag.dn b{color:#fff;} .tag.ice{color:#062A36;background:#BFEFFF;border-color:#BFEFFF;}
.stamp{font:900 64px/1 'Figtree',sans-serif;letter-spacing:.06em;color:#FF5A4A;border:6px solid #FF5A4A;padding:8px 22px 6px;border-radius:14px;background:rgba(40,6,4,.35);text-shadow:0 0 18px rgba(255,90,70,.6);}
.stamp.ok{color:#FFC84A;border-color:#FFC84A;background:rgba(40,28,4,.35);text-shadow:0 0 18px rgba(247,166,0,.6);}
.days{text-align:center;font:800 34px/1 'Inter',sans-serif;color:#fff;background:rgba(8,10,26,.9);border:2px solid rgba(255,225,160,.65);padding:22px 30px 20px;border-radius:24px;box-shadow:0 14px 40px rgba(5,7,20,.5);}
.days .r{display:flex;align-items:center;justify-content:center;gap:22px;} .days .p{font:800 40px/1 'JBM',monospace;background:#F4F2EC;color:#1C1300;border-radius:12px;padding:12px 16px;} .days .p.hot{background:#FF6B5B;color:#fff;}
.days .a{color:#FFC84A;font:800 40px/1 'Figtree',sans-serif;} .days .n{margin-top:16px;font:900 52px/1 'JBM',monospace;color:#FFC84A;letter-spacing:.02em;}
.clk{width:640px;text-align:center;background:rgba(8,10,26,.9);border:2px solid rgba(255,225,160,.65);padding:22px 0 24px;border-radius:26px;box-shadow:0 14px 40px rgba(5,7,20,.5);}
.clk .t{font:700 22px/1 'Inter',sans-serif;letter-spacing:.28em;color:#FFD27A;} .clk .v{margin-top:14px;font:800 92px/1 'JBM',monospace;color:#fff;letter-spacing:-2px;} .clk .v b{color:#FF6B5B;}
.clk .bar{margin:18px auto 0;width:540px;height:22px;border-radius:11px;background:rgba(255,255,255,.12);overflow:hidden;} .clk .fill{height:22px;background:#FF6B5B;} .clk .s{margin-top:12px;font:500 18px/1 'Inter',sans-serif;color:rgba(255,255,255,.6);}
.fz{width:720px;padding:26px 34px 22px;box-sizing:border-box;background:rgba(8,10,26,.9);border:2px solid rgba(255,225,160,.6);border-radius:30px;box-shadow:0 18px 50px rgba(5,7,20,.5);}
.fz .t{font:700 22px/1 'Inter',sans-serif;letter-spacing:.26em;text-transform:uppercase;color:#FFD27A;text-align:center;}
.fz .bar{margin-top:18px;height:70px;border-radius:16px;display:flex;overflow:hidden;background:rgba(255,255,255,.08);}
.fz .ice{background:#8FD8F0;color:#062A36;display:flex;align-items:center;justify-content:center;font:800 30px/1 'JBM',monospace;white-space:nowrap;overflow:hidden;}
.fz .gone{background:repeating-linear-gradient(45deg,#D9483B 0 14px,#B3342A 14px 28px);color:#fff;display:flex;align-items:center;justify-content:center;font:800 30px/1 'JBM',monospace;white-space:nowrap;overflow:hidden;}
.fz .k{margin-top:14px;display:flex;justify-content:space-between;font:700 24px/1 'Figtree',sans-serif;color:#fff;} .fz .k u{text-decoration:none;color:#8FD8F0;} .fz .k s{text-decoration:none;color:#FF8A7A;}
.fz .s{margin-top:12px;font:500 17px/1 'Inter',sans-serif;color:rgba(255,255,255,.6);text-align:center;}
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
const tagVault = mk('tag', 'BINANCE'), tagRecord = mk('tag am', 'biggest crypto theft <b>on record</b>'), tagHome = mk('tag', 'one engineer · one job interview?');
const tagRec = mk('tag dn', 'fake recruiter'), tagCeo = mk('tag dn', 'a fake <b>CEO</b>'), tagFile = mk('tag am', 'coding test');
const tagPods = [mk('tag grey', 'colleague 1'), mk('tag grey', 'colleague 2')], tagPay = mk('tag', 'approves payments');
const days = mk('days', `<div class="r"><span class="p">20 OCT</span><span class="a">→</span><span class="p hot">29 OCT</span></div><div class="n">+9 DAYS</div>`);
const clk = mk('clk', `<div class="t">29 OCT 2026 · UTC</div><div class="v"></div><div class="bar"><div class="fill"></div></div><div class="s">Elliptic: 20:05 → 23:56 UTC</div>`);
const clkV = clk.querySelector('.v'), clkF = clk.querySelector('.fill');
const tagThief = mk('tag dn', "the thieves' wallets");
const fz = mk('fz', `<div class="t">the $6.3 billion · as of 18 Nov 2026</div><div class="bar"><div class="ice" style="width:0px">45%</div><div class="gone" style="width:0px">55%</div></div><div class="k"><u>■ frozen · about $2.85 bn</u><s>■ not frozen</s></div><div class="s">The Block, CoinDesk, Elliptic (18–20 Nov 2026)</div>`);
const fzI = fz.querySelector('.ice'), fzG = fz.querySelector('.gone');
const tagIce = mk('tag ice', 'frozen: Tether, Circle & others'), tagChest = mk('tag am', "Binance's own funds"), cardCover = mk('card', `Binance says it covered\ncustomers' losses <em>itself</em><small>CoinDesk, Decrypt · 19 Nov 2026</small>`);
const cardFbi = mk('card', `FBI: <em>North Korea</em> is responsible<small>FBI alert · 31 Oct 2026</small>`), cardNk = mk('card', `North Korea: <s>denies it</s><small>3 Nov 2026</small>`);
const tagCourt = mk('tag', 'ADGM Courts · Abu Dhabi'), cardOrder = mk('card', `<em>$6.5 billion</em> worldwide\nfreezing order<small>18 Nov 2026 · The Block, CoinDesk</small>`);
const tagChain = mk('tag', 'can be served via the blockchain'), tagEnv = mk('tag am', 'court order'), tagDw = mk('tag dn', "a thieves' wallet");
const title = mk('title', '<div class="s">THE STORY OF</div><div class="n">The Biggest\n<em>Crypto Heist</em></div>');
const lesson = mk('lesson', `It didn't start with code.\nIt started with <em>trust</em>.`);
const ctaChip = mk('chip am', 'what about you?');
const boxes = [0, 1].map(() => { const e = mk('cbox', '<span class="in"></span><span class="post">Post</span>'); return { e, inn: e.querySelector('.in'), post: e.querySelector('.post') }; });
const foot = document.getElementById('foot');
foot.textContent = "Sources: Binance via Yahoo Finance, ITdaily (3–4 Nov) · Elliptic, CoinDesk, The Block (18–20 Nov 2026)\n$6.3 bn is Binance's figure (trackers: $6.34–6.43 bn) · FBI attribution denied by North Korea · not advice";
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
  const CH = [[T.bigOut + 0.05, T.b3 - 0.1, 'Binance · 29 Oct 2026'], [T.b4 + 0.05, T.b6 - 0.1, "as Binance tells it"], [T.b6 + 0.05, T.b7 - 0.1, 'from 20 Oct 2026'],
    [T.b7 + 0.05, T.b9 - 0.1, 'Binance · 29 Oct 2026'], [T.b9 + 0.05, T.b10 - 0.1, 'within hours of the theft'], [T.b10 + 0.05, T.b11 - 0.1, 'Binance says'], [T.b11 + 0.05, T.b12 - 0.1, 'who did it?'],
    [T.b12 + 0.6, T.b14 - 0.1, '18 Nov 2026 · Abu Dhabi'], [T.b14 + 0.05, T.b15 - 0.1, 'as of 23 Nov 2026']];
  for (const [a, b, s] of CH) { const o = win(t, a, b, 0.22, 0.22); if (o > co) { co = o; ct = s; cp = pop(t, a); } }
  if (ct) setTxt(chip, ct); put(chip, W / 2, 472, co, cp);
  // 1–3 — the vault, the record, the home office
  { const p = p3([V[0], 39, V[1]], win(t, T.bigOut, T.b3 + 0.2, 0.3, 0.3)); put(tagVault, clampX(p[0]), clampY(p[1], 560, 1400), p[2], pop(t, T.bigOut)); }
  { const p = p3([TW[0], 84, TW[1]], win(t, T.biggest2, T.b3 + 0.1, 0.25, 0.25)); put(tagRecord, clampX(p[0], 300), clampY(p[1], 620, 1380), p[2], pop(t, T.biggest2)); }
  { const p = p3([HM[0], 7.5, HM[1]], win(t, T.empty, T.b4 + 0.2, 0.3, 0.25)); put(tagHome, clampX(p[0], 300), clampY(p[1], 620, 1380), p[2], pop(t, T.empty)); }
  // 4–5 — the fake recruiter, the fake CEO, the coding test, the malware
  { const p = p3([LAP[0], LAP[1] + 1.15, LAP[2]], win(t, T.recruiters, T.b5 - 0.05, 0.25, 0.2)); put(tagRec, clampX(p[0]), clampY(p[1] - 10, 600, 1400), p[2], pop(t, T.recruiters)); }
  { const p = p3([LAP[0], LAP[1] + 1.15, LAP[2]], win(t, T.ceo, T.hid - 0.05, 0.25, 0.2)); put(tagCeo, clampX(p[0]), clampY(p[1] - 10, 600, 1400), p[2], pop(t, T.ceo)); }
  { const f = fileAt(t), p = p3([f[0], f[1] + 0.6, f[2]], win(t, T.coding, T.hid, 0.2, 0.2)); put(tagFile, clampX(p[0] + 40), clampY(p[1] - 30, 600, 1420), p[2], pop(t, T.coding)); }
  // 6 — the trail: the colleagues' desks, the payments cabinet
  [C1, C2].forEach((c, i) => { const p = p3([c[0], 4.4, c[1]], win(t, T.laptop + 0.4 + i * 0.6, T.b7 - 0.1, 0.25, 0.25)); put(tagPods[i], clampX(p[0]), clampY(p[1], 600, 1400), p[2], pop(t, T.laptop + 0.4 + i * 0.6)); });
  { const p = p3([PB[0], 11.5, PB[1]], win(t, T.approve - 0.1, T.b7 - 0.05, 0.25, 0.25)); put(tagPay, clampX(p[0]), clampY(p[1], 600, 1400), p[2], pop(t, T.approve - 0.1) * (1 + 0.08 * win(t, T.payments, T.payments + 0.3, 0.1, 0.2))); if (t > T.payments) tagPay.className = 'abs tag dn'; else tagPay.className = 'abs tag'; }
  // 7–8 — nine days later; under four hours
  put(days, W / 2, 1180, win(t, T.nine - 0.05, T.paying + 0.2, 0.25, 0.25), pop(t, T.nine - 0.05));
  { const o = win(t, T.four - 0.15, T.b9 - 0.05, 0.25, 0.25), u = eo(seg(t, T.four - 0.1, T.gone + 0.2)), mins = Math.round(lerp(20 * 60 + 5, 23 * 60 + 56, u)); setHTML(clkV, `${String(Math.floor(mins / 60)).padStart(2, '0')}:${String(mins % 60).padStart(2, '0')} <b>UTC</b>`); clkF.style.width = (540 * u).toFixed(1) + 'px'; put(clk, W / 2, 1190, o, pop(t, T.four - 0.15)); }
  { const c = WPOS[4], p = p3([c[0], c[1] + 12, c[2]], win(t, T.thieves7, T.b9, 0.25, 0.25)); put(tagThief, clampX(p[0]), clampY(p[1], 600, 1400), p[2], pop(t, T.thieves7)); }
  // 9 — almost half frozen; 14 — more than half still missing
  { const o = Math.max(win(t, T.half9 - 0.1, T.b10 - 0.05, 0.25, 0.25), win(t, T.more - 0.1, T.b15 - 0.1, 0.25, 0.25)), u1 = eo(seg(t, T.frozen - 0.2, T.frozen + 0.5)) + (t > T.b14 ? 1 : 0), u2 = t > T.b14 ? eo(seg(t, T.half14 - 0.1, T.missing + 0.3)) : 0;
    fzI.style.width = (652 * 0.45 * Math.min(1, u1)).toFixed(1) + 'px'; fzG.style.width = (652 * 0.55 * u2).toFixed(1) + 'px'; put(fz, W / 2, 1200, o, pop(t, t > T.b14 ? T.more - 0.1 : T.half9 - 0.1) * (1 + 0.05 * win(t, T.missing, T.missing + 0.35, 0.1, 0.2))); }
  { const c = WPOS[FROZ[1]], p = p3([c[0], c[1] + 9, c[2]], win(t, T.frozen, T.b10 - 0.05, 0.2, 0.25)); put(tagIce, clampX(p[0], 260), clampY(p[1], 620, 1080), p[2], pop(t, T.frozen)); }
  // 10 — Binance covers the losses from its own reserve
  { const p = p3([RC[0], 8.5, RC[1]], win(t, T.covered - 0.1, T.b11 - 0.05, 0.25, 0.25)); put(tagChest, clampX(p[0], 250), clampY(p[1], 600, 1400), p[2], pop(t, T.covered - 0.1)); }
  put(cardCover, W / 2, 1400, win(t, T.b10 + 0.1, T.b11 - 0.05, 0.25, 0.25), pop(t, T.b10 + 0.1));
  // 11 — the FBI's attribution and North Korea's denial
  put(cardFbi, W / 2, 1120, win(t, T.fbi - 0.05, T.b12 - 0.05, 0.25, 0.25), pop(t, T.fbi - 0.05));
  put(cardNk, W / 2, 1270, win(t, T.denies - 0.1, T.b12 - 0.05, 0.25, 0.25), pop(t, T.denies - 0.1));
  // 12–13 — the court, the freezing order, the blockchain, the order served
  { const p = p3([CT[0], 22, CT[1]], win(t, T.abu, T.b13, 0.3, 0.25)); put(tagCourt, clampX(p[0]), clampY(p[1], 600, 1400), p[2], pop(t, T.abu)); }
  put(cardOrder, W / 2, 1200, win(t, T.froze, T.b13 + 0.1, 0.25, 0.25), pop(t, T.froze) * (1 + 0.05 * win(t, T.worldwide, T.worldwide + 0.3, 0.1, 0.2)));
  { const c = chainPos[3], p = p3([c[0], c[1] + 3.5, c[2]], win(t, T.order + 0.1, T.b14 - 0.1, 0.25, 0.25)); put(tagChain, clampX(p[0], 300), clampY(p[1], 600, 1400), p[2], pop(t, T.order + 0.1)); }
  { const e = envAt(t), p = p3([e[0], e[1] + 2.4, e[2]], win(t, T.envA, T.envB - 0.1, 0.2, 0.2)); put(tagEnv, clampX(p[0]), clampY(p[1], 600, 1400), p[2] * (1 - seg(t, T.envB - 0.7, T.envB - 0.4)), pop(t, T.envA)); }
  { const p = p3([DW[0], DW[1] + 5.5, DW[2]], win(t, T.thieves13 - 0.1, T.b14 + 0.6, 0.2, 0.3)); put(tagDw, clampX(p[0], 220), clampY(p[1], 620, 1300), p[2], pop(t, T.thieves13 - 0.1) * (1 + 0.08 * win(t, T.envB, T.envB + 0.3, 0.1, 0.2))); }
  // 15 — title and lesson; 16 — the question
  put(title, W / 2, 640, win(t, T.story, T.cta - 0.1, 0.4, 0.3), 0.94 + 0.06 * eo(seg(t, T.story, T.story + 0.6)));
  put(lesson, W / 2, 1180, win(t, T.heist, T.cta - 0.15, 0.3, 0.25), pop(t, T.heist));
  put(ctaChip, W / 2, 472, seg(t, T.would, T.would + 0.3), pop(t, T.would));
  [[T.yes, 'YES', T.postA], [T.no, 'NO', T.postB]].forEach(([t0, word, tp], i) => {
    const bx = boxes[i], L = word.length, n = Math.min(L, Math.floor(c01((t - t0) / (0.12 * L)) * (L + 0.001))), typed = word.slice(0, n), caret = (n < L || Math.floor(t * 2.4) % 2) && t < tp ? '<i></i>' : '';
    setHTML(bx.inn, typed ? `<b>${typed}</b>${caret}` : `<em>Add a comment…</em>${caret}`); const sent = t > tp; const pc = sent ? 'post on sent' : n === L ? 'post on' : 'post'; if (bx.post.className !== pc) bx.post.className = pc; setTxt(bx.post, sent ? 'Posted ✓' : 'Post');
    const ts = i ? T.no - 0.35 : T.comment; put(bx.e, W / 2, 1330 + i * 132, seg(t, ts, ts + 0.3), pop(t, ts) * (1 + 0.06 * win(t, tp, tp + 0.3, 0.08, 0.2)));
  });
}

// ───────────────────────── one frame
const hopY = (hops, t, h = 0.5) => { let y = 0; for (const t0 of hops) { const u = (t - t0) / 0.38; if (u > 0 && u < 1) y = Math.max(y, Math.sin(u * Math.PI) * h); } return y; };
const doorU = t => t < T.b4 ? 1 - eio(seg(t, T.doorShut, T.doorShut + 0.9)) : eio(seg(t, T.doorOpen, T.doorOpen + 1.0));
const heapK = t => t < T.b4 ? 0.75 : t < T.refillA ? 1 - 0.85 * eio(seg(t, T.theftA + 0.3, T.gone + 0.6)) : 0.15 + 0.85 * eio(seg(t, T.refillA + 0.4, T.refillB));
function fileAt(t) {   // the coding test: out of the screen, onto the desk, then it cracks open
  const s = LAPW(), u = eo(seg(t, T.coding - 0.05, T.test2 - 0.05)), e = [HM[0] + 0.95, 1.3, HM[1] - 1.25];
  return [lerp(s.x, e[0], u), lerp(s.y, e[1], u) + Math.sin(u * Math.PI) * 0.9, lerp(s.z + 0.3, e[2], u)];
}
function envAt(t) {   // the court order travels along the blockchain into the thieves' wallet
  const u = eio(seg(t, T.envA, T.envB)), k = u * (CHN - 1), i = Math.min(CHN - 2, Math.floor(k)), v = k - i, a = chainPos[i], b = chainPos[i + 1];
  if (t < T.envA) return [chainA[0], chainA[1], chainA[2]];
  return [lerp(a[0], b[0], v), lerp(a[1], b[1], v) + 2.0, lerp(a[2], b[2], v)];
}
const trailU = t => eio(seg(t, T.laptop - 0.05, T.payments + 0.1));
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
  // the vault door, the heap of coins, the payments cabinet's alarm
  { const u = doorU(t); door.userData.pivot.rotation.y = -1.75 * u; const k = heapK(t); heapCoins.scale.set(Math.max(0.05, k), Math.max(0.05, k), 1); heapCoins.position.y = DOOR[1] - (1 - k) * DR * 0.55; heapCoins.visible = k > 0.06; heapM.opacity = 0.3 + 0.7 * k; }
  // the coins (cover stream, the theft, the refill)
  setCoins(t);
  // the thieves' wallets bob; four freeze; the storm and the searchlight
  wallets.forEach((m, i) => { const f = FROZ.indexOf(i), fz = f >= 0 ? seg(t, T.freeze + f * 0.09, T.freeze + 0.45 + f * 0.09) : 0, bob = Math.sin(t * 1.3 + i) * 0.6 * (1 - fz); m.position.y = WPOS[i][1] + bob; m.rotation.z = Math.sin(t * 0.9 + i * 2) * 0.05 * (1 - fz); });
  ices.forEach((m, k) => { const i = FROZ[k], u = seg(t, T.freeze + k * 0.09, T.freeze + 0.45 + k * 0.09); m.visible = u > 0.001; m.scale.setScalar(Math.max(0.01, back(u) * 1.0)); m.position.y = WPOS[i][1]; m.rotation.set(0.3, k + t * 0.05, 0.2); });
  storm.forEach((m, i) => { m.position.x = m.userData.x0 + Math.sin(t * 0.3 + i) * 3; m.material.color.setRGB(0.42, 0.42, 0.5); m.material.opacity = 0.95; });
  { const o = win(t, T.b11 - 0.3, T.b12 + 0.2, 0.4, 0.4); beamM.opacity = 0.16 * o; beam.visible = o > 0.01; beam.rotation.set(Math.PI - 0.45 + Math.sin(t * 1.1) * 0.12, 0, 0.35 + Math.sin(t * 0.8) * 0.2); }
  // the home office: the engineer reacts; the laptop; the file; the bug; the trail; the colleagues' screens
  eng.position.y = 0.3 + hopY([T.trust4 + 0.05, T.malware + 0.05], t, 0.12); eng.rotation.y = 0.55 + 0.25 * win(t, T.malware, T.b6 + 0.3, 0.1, 0.3);
  drawLaptop(t);
  { const on = t > T.coding - 0.1 && t < T.b6 + 0.4, f = fileAt(t), crack = seg(t, T.hid, T.hid + 0.25); fileBox.visible = on; fileBox.position.set(f[0], f[1], f[2]); fileBox.rotation.set(-0.2 + crack * 0.6, 0.3 + t * 0.5 * (1 - crack), crack * 0.4); fileBox.scale.setScalar(on ? 1 + 0.15 * crack : 1); }
  { const u = trailU(t), n = Math.floor(u * trailPts.length); trail.count = t > T.b10 ? 0 : n; trailM.color.setRGB(1, 0.29 + 0.1 * Math.sin(t * 9), 0.23);
    const vis = t > T.hid + 0.1 && t < T.b7 + 0.5; bug.visible = vis;
    if (vis) { const k = Math.max(0, Math.min(trailPts.length - 1, n)), p = t < T.laptop ? [HM[0] + 1.25, 1.14 + 0.04 * Math.abs(Math.sin(t * 20)), HM[1] - 1.55] : trailPts[k], q = trailPts[Math.min(trailPts.length - 1, k + 2)];
      bug.position.set(p[0], p[1] + 0.05, p[2]); bug.rotation.y = Math.atan2(-(q[2] - p[2]), q[0] - p[0] || 0.001); bug.scale.setScalar(t < T.laptop ? 0.55 : 0.55 + 2.65 * seg(k / trailPts.length, 0.03, 0.22)); } }
  pods.forEach((g, i) => { const hit = trailU(t) > trailK[i] && t < T.b10; g.userData.mon.material.color.setHex(hit ? (Math.floor(t * 6) % 2 ? 0xFF4A3A : 0xB3241A) : 0x7FD3FF); g.userData.p.position.y = hopY([T.laptop + 0.5 + i * 0.6], t, 0.2); });
  // cars, walkers, guards
  for (const c of CARS) { const L = 700, x = ((c.off + t * c.v) % L) - L / 2; c.m.position.set(c.dir * x, 0, c.z); c.m.rotation.y = c.dir > 0 ? 0 : Math.PI; }
  WALK.forEach((w, i) => { const u = (Math.sin((t * w.sp + w.ph) * Math.PI * 2) + 1) / 2, dir = Math.cos((t * w.sp + w.ph) * Math.PI * 2) > 0 ? 1 : -1; const x = lerp(w.a[0], w.b[0], u), z = lerp(w.a[1], w.b[1], u); w.m.position.set(x, Math.abs(Math.sin(t * 7 + i)) * 0.06, z); w.m.rotation.y = Math.atan2(-(w.b[1] - w.a[1]) * dir, (w.b[0] - w.a[0]) * dir); });
  guards.forEach((m, i) => { m.position.y = hopY([T.paying + 0.1 + i * 0.08, T.covered + 0.6 + i * 0.08], t, 0.25); m.rotation.y = -Math.PI / 2 + 0.6 * win(t, T.paying, T.gone + 0.5, 0.2, 0.4) * (i ? -1 : 1); });
  // the reserve chest opens and refills the vault
  chest.userData.lid.rotation.x = -1.2 * win(t, T.refillA - 0.3, T.b11 + 0.4, 0.4, 0.5);
  // Abu Dhabi: the gavel, the frost rings, the blockchain, the order
  { const up = eo(seg(t, T.gavel - 0.6, T.gavel - 0.12)), down = seg(t, T.gavel - 0.12, T.gavel), bounce = Math.sin(seg(t, T.gavel, T.gavel + 0.45) * Math.PI) * (t > T.gavel ? 1 : 0);
    gavel.position.y = t < T.gavel ? lerp(12 + 3 * up, 5.65, down * down) : 5.65 + 1.4 * bounce * (1 - seg(t, T.gavel + 0.45, T.gavel + 1.2)) + 4 * seg(t, T.gavel + 0.8, T.gavel + 1.6); gavel.rotation.z = 0.25 * up * (1 - down) - 0.05 * bounce; }
  rings.forEach((r, k) => { const t0 = T.ringA + k * 0.35, u = seg(t, t0, t0 + 2.6); r.visible = u > 0 && u < 1; r.scale.setScalar(3 + eo(u) * 130); ringMs[k].opacity = 0.95 * (1 - u * u * u); });
  { const u = seg(t, T.ringA, T.ringA + 2.2), o = c01(u * 3) * (1 - seg(t, T.b14, T.b14 + 1.0)); frostM.opacity = 0.42 * o; frost.visible = o > 0.01; frost.scale.setScalar(3 + eo(u) * 110); }
  blocks.forEach((m, i) => { const u = seg(t, T.chainA + i * 0.09, T.chainA + 0.3 + i * 0.09), o = t < T.b15 ? 1 : 1 - seg(t, T.b15, T.b15 + 0.5); m.visible = u > 0 && o > 0.01; m.scale.setScalar(Math.max(0.01, back(u) * o)); m.rotation.y = t * 0.6 + i; });
  links.forEach((m, i) => { const u = seg(t, T.chainA + (i + 1) * 0.09, T.chainA + 0.3 + (i + 1) * 0.09); m.visible = u > 0.5 && t < T.b15 + 0.5; });
  blockM.emissiveIntensity = 0.7 + 0.3 * Math.sin(t * 5);
  { const on = t > T.envA - 0.05 && t < T.envB + 0.15, e = envAt(t); env.visible = on; env.position.set(e[0], e[1], e[2]); env.rotation.set(0.25 * Math.sin(t * 6), t * 1.5, 0.15); env.scale.setScalar(2.8 * (1 - seg(t, T.envB - 0.05, T.envB + 0.12) * 0.9)); }
  dwal.position.y = DW[1] + Math.sin(t * 1.2) * 0.5 + hopY([T.envB], t, 1.4);
  // clouds
  for (const c of clouds) { c.position.x = c.userData.x0 + t * 1.2; c.material.opacity = 0.9 - 0.5 * night; const k = lerp(1, 0.45, night); c.material.color.setRGB(lerp(s.hor[0], 1, 0.55) * k, lerp(s.hor[1], 1, 0.55) * k, lerp(s.hor[2], 1, 0.55) * k * 1.05); }
  // sparkles: frost on the frozen wallets; the refill; the order served; the final question
  { let k = 0; const put3 = (x, y, z, sz, on, col) => { const sp = sparks[k++]; if (!sp) return; const tw = Math.pow(Math.abs(Math.sin(t * sp.userData.w + sp.userData.ph)), 3); sp.position.set(x, y, z); sp.scale.setScalar(sz * (0.25 + tw)); sp.material.opacity = on * (0.3 + 0.7 * tw); sp.material.color.setHex(col); sp.visible = on > 0.01; };
    const s1 = win(t, T.freeze, T.b10 + 0.3, 0.2, 0.5); for (let i = 0; i < 28; i++) { const sp = sparks[i].userData, w = WPOS[FROZ[i % 4]]; put3(w[0] + sp.dx * 5, w[1] + sp.dz * 4, w[2] + 3.5, 2.4, s1, 0xCFF4FF); }
    const s2 = win(t, T.refillA + 0.3, T.b11, 0.3, 0.4); for (let i = 0; i < 16; i++) { const a = i * 0.39 + t * 0.8; put3(DOOR[0] + Math.cos(a) * 8, DOOR[1] + Math.sin(a) * 8, DOOR[2] + 1.2, 2.2, s2, 0xFFE9A8); }
    const s3 = win(t, T.envB - 0.05, T.b14 + 0.8, 0.1, 0.5); for (let i = 0; i < 18; i++) { const a = i * 0.35, r = 3 + 6 * seg(t, T.envB, T.envB + 0.8); put3(DW[0] + Math.cos(a) * r, DW[1] + Math.sin(a) * r, DW[2] + 2, 2.0, s3, 0xFFE9A8); }
    const s4 = win(t, T.postA, DUR + 1, 0.4, 0.1); for (let i = 0; i < 16; i++) { const ph = (t * 0.35 + i / 16) % 1, a = i * 2.4; put3(LAP[0] + Math.cos(a) * (1.2 + ph), LAP[1] + 0.2 + ph * 2.2, LAP[2] + 0.6 + Math.sin(a) * 0.6, 0.12 + 0.08 * (1 - ph), s4 * Math.sin(ph * Math.PI), 0xFFE9A8); }
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
  typingA: [0, 1, 2].map(i => +(T.yes + (i + 0.5) * 0.12).toFixed(3)), typingB: [0, 1].map(i => +(T.no + (i + 0.5) * 0.12).toFixed(3)),
  freezes: FROZ.map((_, k) => +(T.freeze + k * 0.09).toFixed(3)), blocks: chainPos.map((_, i) => +(T.chainA + i * 0.09).toFixed(3)),
  rings: [0, 1, 2].map(k => +(T.ringA + k * 0.35).toFixed(3)), pods: trailK.map(k => { for (let t = T.laptop - 0.05; t < T.payments + 0.2; t += 0.01) if (trailU(t) > k) return +t.toFixed(3); return +T.payments.toFixed(3); }),
  postA: +T.postA.toFixed(3), postB: +T.postB.toFixed(3),
};
document.fonts.ready.then(() => Promise.all(['700 64px Figtree', '900 190px Fraunces', '800 30px JBM', '700 22px Inter', '700 78px Fraunces', '800 54px Figtree', '600 34px Figtree', '500 18px Inter', '900 128px JBM', '800 46px Inter', '900 150px Figtree', '900 112px Fraunces', '800 172px JBM', '700 34px Figtree', '800 92px JBM', '900 64px Figtree'].map(f => document.fonts.load(f)))).then(() => { fitHook(); renderAt(0); window.__ready = true; });
