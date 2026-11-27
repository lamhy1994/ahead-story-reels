// The Boss Who Wasn't There — low-poly storybook scene (deterministic: window.renderAt(t) draws the frame for time t)
// Charges made public Thu 5 Nov 2026 (US Justice Dept, SDNY): prosecutors say three men used AI to copy companies' CEOs (the voice, sometimes the
// face) on calls about a "confidential financial transaction", then posed as lawyers at big law firms (a handwritten "Lawyer Call" script told staff
// not to discuss it with colleagues) and got finance staff to wire about $129 million to accounts in nine countries, then turned it into crypto.
// Arrested in Spain and the UK (Jun-Sep 2026); extradition pending; presumed innocent. The world: a city at sunset; the finance team's office
// (a doll's-house floor) with a big call screen; the fakers' back room (a robot with a mask); a law firm; nine banks behind the headquarters; the court.
import * as THREE from 'three';
import { SKIN, MAT, GOLD, rng, GB, person, cloud, bushTree, tower, car, lamp, bank, factory, BIGCOIN, CASH, WIN_LIT,
  robot, deskMonitors, CHAIR, gavelHead, gavelBlock, callScreen, faceMask, policeCar, ENVELOPE, redCross } from './kit.js';

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
const R = rng(20261105);

// ───────────────────────── story clock (everything hangs off the narration)
const T = {
  hookEnd: TIM.big ? 1.5 : TIM.hook ? E(1) + 0.15 : 0,
  bigIn: TIM.big ? 1.5 : 0, bigOut: TIM.big ? 3.0 : 0,
  fake1: wt(1, 'fake') - 0.1, boss1: wt(1, 'boss') - 0.1, pros1: wt(1, 'prosecutors') - 0.1,
  b2: S(2) - 0.05, thousands: wt(2, 'Thousands') - 0.1, targeted: wt(2, 'targeted') - 0.1, hospitals: wt(2, 'hospitals') - 0.1, pet: wt(2, 'pet') - 0.1,
  b3: S(3) - 0.05, how: wt(3, 'how') - 0.1, fake3: wt(3, 'fake') - 0.1, millions3: wt(3, 'millions') - 0.1,
  b4: S(4) - 0.05, writes: wt(4, 'writes') - 0.1, secret: wt(4, 'secret') - 0.1, help: wt(4, 'help') - 0.1,
  b5: S(5) - 0.05, calls: wt(5, 'calls') - 0.1, voice: wt(5, 'voice') - 0.1, face: wt(5, 'face') - 0.1, copied: wt(5, 'copied') - 0.1, ai: wt(5, 'AI') - 0.1,
  b6: S(6) - 0.05, money6: wt(6, 'money') - 0.1, someone: wt(6, 'someone') - 0.1, lawyer6: wt(6, 'lawyer') - 0.1, firm: wt(6, 'firm') - 0.1,
  b7: S(7) - 0.05, fake7: wt(7, 'fake') - 0.1, pros7: wt(7, 'prosecutors') - 0.1, script: wt(7, 'script') - 0.1, tell: wt(7, 'tell') - 0.1, work: wt(7, 'work') - 0.1,
  b8: S(8) - 0.05, british: wt(8, 'British') - 0.1, sent: wt(8, 'sent') - 0.1, eleven: wt(8, '11') - 0.1, dollars8: wt(8, 'dollars') - 0.1,
  b9: S(9) - 0.05, bank9: wt(9, 'bank') - 0.1, nine: wt(9, 'nine') - 0.1, countries: wt(9, 'countries') - 0.1, crypto: wt(9, 'crypto') - 0.1,
  b10: S(10) - 0.05, arrested: wt(10, 'arrested') - 0.1, spain: wt(10, 'Spain') - 0.1, britain: wt(10, 'Britain') - 0.1, charged: wt(10, 'charged') - 0.1, york: wt(10, 'York') - 0.1,
  b11: S(11) - 0.05, innocent: wt(11, 'innocent') - 0.1, over: wt(11, 'over') - 0.1,
  b12: S(12) - 0.05, story: wt(12, 'story') - 0.15, voice12: wt(12, 'voice') - 0.1, proof: wt(12, 'proof') - 0.1,
  cta: S(13) - 0.1, spotted: wt(13, 'spotted') - 0.1, comment: wt(13, 'Comment') - 0.15, yes: wt(13, 'yes') - 0.2, no: wt(13, 'no') - 0.1,
};
T.mailFly = T.writes - 0.2; T.mailIn = T.writes + 0.75;                // the email flies from the back room to the worker's screen
T.ring = T.calls - 0.15;                                               // the call rings
T.maskDown = T.ai + 0.75; T.maskUp = T.b6 + 0.1;                        // the robot lowers the boss's face for a moment
T.swap = T.fake7 + 0.02;                                               // the 'lawyer' turns out to be a robot
T.cashA = T.sent - 0.25; T.cashN = 27; T.cashStep = 0.115;             // 27 bundles leave the office, 3 for each of the nine banks
T.cashUp = 1.0; T.cashFly = 2.0;                                       // straight up out of the office, then over to the bank
T.land = [...Array(9)].map((_, b) => T.cashA + (b * 3) * T.cashStep + T.cashUp + T.cashFly);   // first bundle lands at bank b
T.tokens = T.crypto + 0.05;                                            // the money turns into crypto and flies off
T.gavel = T.charged + 0.1;
T.postA = T.yes + 0.75; T.postB = T.no + 0.65;
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
  NIGHT: P(0x070B24, 0x141C4B, 0x30326A, 0x22265A, 0xB4C2FF, 2.0, 0x5567C4, 0x3A3048, 1.6, 1, 1, -35, 42, 0xFFF4D6, 30, 80, 560),
  GOLDEN: P(0x3C7FCB, 0xF2C58A, 0xFFD79A, 0xF6CF9A, 0xFFC878, 3.2, 0xE8D2B0, 0xA88A60, 1.5, 0, 0.12, -68, 20, 0xFFE0A0, 44, 100, 680),
  SUNSET: P(0x2E2F72, 0xE0707A, 0xFFB25E, 0xEE9A6A, 0xFF9050, 2.9, 0xB49AC8, 0x86685A, 1.45, 0.12, 0.6, -70, 11, 0xFFB060, 50, 90, 620),
  DUSK: P(0x141A4C, 0x4A3F86, 0xC06A78, 0x6A4A78, 0x93A4F4, 1.7, 0x5A62B0, 0x3A2A40, 1.25, 0.65, 0.92, -40, 36, 0xFFF4D6, 30, 80, 600),
};
const SKY = [[0, 'SUNSET'], [T.b2 + 0.4, 'SUNSET'], [T.b3 + 0.2, 'DUSK'], [T.b4 + 0.2, 'NIGHT'], [T.b9 + 0.5, 'NIGHT'], [T.b10 + 0.2, 'NIGHT'], [T.b10 + 1.0, 'GOLDEN'],
  [T.b11 + 1.4, 'GOLDEN'], [T.story + 0.8, 'SUNSET'], [T.cta + 0.5, 'DUSK'], [DUR + 2, 'DUSK']];
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
const PY = 1.0;                                    // the office floor (top)
const DK = [1.5, 1.2], WK = [1.5, 2.7];            // the finance worker's desk and seat (facing -z, toward the call screen)
const SCR = [1.5, -3.4], SCW = 7.2, SCH = 4.2, SCY0 = 2.3;   // the call screen on its stand (glass facing +z)
const COL = [[-5.4, 2.4], [-5.4, -1.6]];           // two colleagues' desks

const AIR = [-25, 2], APY = 0.8, RA = [-25, 1.2];  // the fakers' back room (open toward +z), its floor top, robot A (the fake boss)
const LF = [31, -11], LFS = 0.85, LW = [31, 4.6];  // the law firm (faces +z); the 'lawyer' on its plaza
const HP = [-46, -40], PF = [48, -44];             // a hospital, a pet food maker
const BK = [0, -120], BR = 48;                     // nine banks in an arc behind the headquarters
const BANKA = [...Array(9)].map((_, i) => (-64 + i * 16) * Math.PI / 180);
const BPOS = BANKA.map(a => [BK[0] + Math.sin(a) * BR, BK[1] + Math.cos(a) * BR]);
const COUNTRIES = ['US', 'Spain', 'Portugal', 'Greece', 'UAE', 'Singapore', 'Austria', 'Slovakia', 'China'];
const CT = [-112, -70], GV = [-95, -50];           // the court (faces +z); the gavel on its plaza
const stat = [];

// ───────────────────────── ground, streets, plazas
const ground = new THREE.Mesh(new THREE.PlaneGeometry(2400, 2400).rotateX(-Math.PI / 2), new THREE.MeshLambertMaterial({ color: 0xC9C2AE })); ground.receiveShadow = true; scene.add(ground);
const flat = new GB();
flat.box(9, 0.04, 400, 0x4A4E56, -15, 0.02, -60); flat.box(9, 0.04, 400, 0x4A4E56, 15.5, 0.021, -60);   // avenues either side of the office
flat.box(640, 0.04, 9, 0x4A4E56, 0, 0.022, 13); for (let x = -310; x < 320; x += 6) flat.box(2.6, 0.05, 0.22, 0xF2EEE2, x, 0.045, 13);   // the street in front
flat.box(640, 0.04, 9, 0x4A4E56, 0, 0.023, -58);
flat.box(84, 0.07, 66, 0xE6DFD0, BK[0], 0.035, BK[1] + 12); for (let i = 0; i < 14; i++) flat.box(84, 0.075, 0.12, 0xD6CEBC, BK[0], 0.037, BK[1] - 19 + i * 4.6);
flat.box(70, 0.07, 52, 0xE6DFD0, CT[0], 0.035, CT[1] + 12); flat.box(12, 0.08, 40, 0xD9CFBA, CT[0], 0.042, CT[1] + 22);
flat.box(26, 0.06, 14, 0xD9CFBA, LF[0], 0.03, LF[1] + 15);
flat.box(14, 0.06, 10, 0x2A2C32, AIR[0], 0.03, AIR[1] + 7);
{ const rr = rng(909); for (let i = 0; i < 60; i++) { const x = -300 + rr() * 600, z = -300 + rr() * 320; flat.box(6 + rr() * 14, 0.06, 6 + rr() * 14, rr() < 0.5 ? 0x8DAE74 : 0x9DB884, x, 0.03, z); } }
const flatM = flat.mesh(); flatM.castShadow = false; scene.add(flatM);

// ───────────────────────── the city (tower tops remembered for the 'targeted' pins)
const ZONES = [[-14, 14, -33, 9], [-32, -17, -4, 10], [17, 46, -20, 12], [HP[0] - 10, HP[0] + 10, HP[1] - 10, HP[1] + 10], [PF[0] - 12, PF[0] + 12, PF[1] - 10, PF[1] + 10],
  [BK[0] - 56, BK[0] + 56, BK[1] - 20, BK[1] + 60], [CT[0] - 36, CT[0] + 36, CT[1] - 14, 30]];
const DEST = (x, z) => ZONES.some(([a, b, c, d]) => x > a - 6 && x < b + 6 && z > c - 6 && z < d + 6) || Math.abs(z - 13) < 9 || Math.abs(z + 58) < 9 || Math.abs(x + 15) < 9 || Math.abs(x - 15.5) < 9 || (z > 26 && Math.abs(x) < 150);
const TOPS = [];
{
  const tr = rng(2026), PAL = [[0xD9D3C6, 0x5E7F9A], [0x6D97AA, 0x3F6A80], [0xE4DED2, 0x4E7C93], [0xC9C2B4, 0x55748C], [0x8FB3C2, 0x426E86], [0xEFE9DC, 0x6A8AA4], [0xB7C4C9, 0x3E6378], [0xE8D9C0, 0x5A7A90]];
  for (let gx = -260; gx <= 260; gx += 22) for (let gz = -300; gz <= 110; gz += 22) {
    const x = gx + (tr() - .5) * 7, z = gz + (tr() - .5) * 7; if (DEST(x, z) || tr() < 0.12) continue;
    const dp = Math.hypot(x, z + 40), far = dp > 150, w = 9 + tr() * 7, d = 9 + tr() * 7;
    const h = dp < 80 ? 12 + tr() * 16 : 16 + tr() * (far ? 44 : 28);
    const pal = PAL[Math.floor(tr() * PAL.length)];
    const g = tower(w, h, d, { rand: tr, color: pal[0], glass: pal[1], floor: far ? 4.2 : 3.4, litP: 0.6, crown: h > 46 && tr() < 0.5 });
    g.position.set(x, 0, z); g.rotation.y = (tr() < 0.5 ? 0 : Math.PI / 2); g.children.forEach(c => { c.castShadow = dp < 160; c.receiveShadow = true; }); scene.add(g);
    stat.push([x - Math.max(w, d) / 2, x + Math.max(w, d) / 2, z - Math.max(w, d) / 2, z + Math.max(w, d) / 2, h + 4, 'tower']);
    if (dp < 210 && z < 20) TOPS.push([x, h + (h > 46 ? 5 : 1.5), z, dp]);
  }
}
// a hospital (white tower, red crosses) and a pet food maker (a factory with a sign)
{ const g = tower(16, 24, 14, { rand: rng(31), color: 0xF2EFE8, glass: 0x7FA8C0, floor: 3.4, litP: 0.6, bare: true }); g.position.set(HP[0], 0, HP[1]); scene.add(g);
  const c1 = redCross(1.3); c1.position.set(HP[0], 19.5, HP[1] + 7.2); scene.add(c1); const c2 = redCross(1.1); c2.position.set(HP[0], 26.6, HP[1]); scene.add(c2);
  stat.push([HP[0] - 8.5, HP[0] + 8.5, HP[1] - 7.5, HP[1] + 7.8, 30, 'hospital']); TOPS.push([HP[0], 31, HP[1], 2]); }
{ const f = factory(18, 12, 6); f.position.set(PF[0], 0, PF[1]); f.rotation.y = -Math.PI / 2; scene.add(f); stat.push([PF[0] - 6.5, PF[0] + 6.5, PF[1] - 9.5, PF[1] + 9.5, 17, 'pet food']);
  const s = new THREE.Mesh(new THREE.PlaneGeometry(9, 1.6), new THREE.MeshBasicMaterial({ map: signTex('PET FOOD CO.', '#F4E6C8', '#7A3A1E', 1024, 180, "900 110px Figtree"), toneMapped: false }));
  s.position.set(PF[0], 7.6, PF[1] + 9.3); scene.add(s); TOPS.push([PF[0], 17, PF[1], 3]); }

// ───────────────────────── the office: a doll's-house floor (open toward +z), the worker, the call screen, two colleagues
{ const b = new GB(); b.box(20.6, PY, 12.6, 0xBFB8AA, 0, PY / 2, 0); b.box(20, 0.06, 12, 0xD9D2C2, 0, PY + 0.03, 0);
  b.box(20.6, 5.4, 0.4, 0xE9E4D8, 0, PY + 2.7, -6.1); b.box(0.4, 5.4, 12.6, 0xE9E4D8, -10.1, PY + 2.7, 0); b.box(20.8, 0.35, 0.6, 0xCFC8BA, 0, PY + 5.55, -6.1);
  for (let i = 0; i < 4; i++) b.box(3.0, 2.0, 0.1, 0x6A8AA4, -8.2 + i * 2.0 * (i > 1 ? 3.6 : 1.9), PY + 2.4, -5.88);
  b.box(1.2, 1.9, 0.6, 0xA8AEB8, 8.6, PY + 0.95, -4.8); b.box(1.2, 1.9, 0.6, 0xA8AEB8, 7.2, PY + 0.95, -4.8);   // filing cabinets
  scene.add(b.mesh()); stat.push([-10.5, 10.5, -6.5, 6.5, PY + 0.5, 'office floor'], [-10.5, 10.5, -6.6, -5.6, PY + 5.9, 'back wall'], [-10.6, -9.6, -6.5, 6.5, PY + 5.9, 'left wall']); }
const offL = new THREE.PointLight(0xFFE2B8, 90, 34, 1.3); offL.position.set(0, PY + 7.5, 4.5); scene.add(offL);
const finSign = new THREE.Mesh(new THREE.PlaneGeometry(6.4, 1.0), new THREE.MeshBasicMaterial({ map: signTex('FINANCE TEAM', '#2A3346', '#E9EEF6', 1024, 160, "800 92px Figtree"), toneMapped: false }));
finSign.position.set(-5.6, PY + 4.5, -5.86); scene.add(finSign);
const desk = deskMonitors(); desk.position.set(DK[0], PY, DK[1]); scene.add(desk);
const chairM = new THREE.MeshLambertMaterial({ vertexColors: true }), chairs = new THREE.InstancedMesh(CHAIR, chairM, 3); chairs.castShadow = true; scene.add(chairs);
const SEATS = [WK, [COL[0][0], COL[0][1] + 1.5], [COL[1][0], COL[1][1] + 1.5]];
SEATS.forEach(([x, z], i) => { chairs.setMatrixAt(i, new THREE.Matrix4().compose(new THREE.Vector3(x, PY, z), new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI / 2, 0)), new THREE.Vector3(0.8, 0.8, 0.8))); chairs.setColorAt(i, new THREE.Color([0x3A4E6A, 0x5A5A66, 0x5A5A66][i])); });
const worker = person({ robe: 0x3B6FA8, skin: SKIN[2], short: 0x2A1E16, shirt: 0xF4F2EC, s: 1.15 }); worker.position.set(WK[0], PY + 0.25, WK[1]); worker.rotation.y = Math.PI / 2; worker.scale.set(1.15, 1.05, 1.15); scene.add(worker);
const colDesks = COL.map(([x, z]) => { const d = deskMonitors(); d.position.set(x, PY, z); d.scale.setScalar(0.92); scene.add(d); return d; });
const colleagues = COL.map(([x, z], i) => { const p = person({ robe: [0x6A2E3E, 0x3F6A5A][i], skin: SKIN[[4, 1][i]], short: [0x5A3E28, 0x231C18][i], shirt: 0xF4F2EC, s: 1.1 }); p.position.set(x, PY + 0.25, z + 1.5); p.rotation.y = Math.PI / 2; p.scale.set(1.1, 1.0, 1.1); scene.add(p); return p; });
stat.push([DK[0] - 2.2, DK[0] + 2.2, DK[1] - 1, WK[1] + 0.8, PY + 3.2, 'desk']);
for (const [x, z] of [[8.8, 4.6], [-8.8, 4.8]]) { const m = bushTree(2.4, R); m.position.set(x, PY, z); scene.add(m); }
const cscr = callScreen(SCW, SCH, SCY0); cscr.position.set(SCR[0], PY, SCR[1]); scene.add(cscr); stat.push([SCR[0] - 4.2, SCR[0] + 4.2, SCR[1] - 1, SCR[1] + 1, PY + SCY0 + SCH + 0.6, 'call screen']);
// the privacy bubble ("tell no one at work")
const bubbleM = new THREE.MeshLambertMaterial({ color: 0xBFE8FF, emissive: 0x3A7AB0, emissiveIntensity: 0.4, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide });
const bubble = new THREE.Mesh(new THREE.SphereGeometry(3.6, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), bubbleM); bubble.position.set(DK[0], PY, (DK[1] + WK[1]) / 2); bubble.renderOrder = 3; scene.add(bubble);

// ───────────────────────── the call screen's pictures (plain illustrations, no real app): a dashboard, an email, the 'boss', the 'lawyer', a robot, a sent wire
function portrait(g, w, h, kind) {
  const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#16204A'); gr.addColorStop(1, '#0B1130'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
  g.fillStyle = 'rgba(255,255,255,0.05)'; for (let i = 0; i < 8; i++) g.fillRect(0, i * h / 8, w, 2);
  const cx = w / 2, cy = h * 0.47, bot = kind === 'robot' || kind === 'robot2';
  if (!bot) {
    const suit = kind === 'lawyer' ? '#3A3046' : '#2B3346';
    g.fillStyle = suit; g.beginPath(); g.moveTo(cx - 250, h); g.quadraticCurveTo(cx - 230, cy + 120, cx - 90, cy + 110); g.lineTo(cx + 90, cy + 110); g.quadraticCurveTo(cx + 230, cy + 120, cx + 250, h); g.fill();
    g.fillStyle = '#F4F2EC'; g.beginPath(); g.moveTo(cx - 60, cy + 108); g.lineTo(cx, cy + 230); g.lineTo(cx + 60, cy + 108); g.fill();
    g.fillStyle = kind === 'lawyer' ? '#2F4A6A' : '#8A2A2A'; g.beginPath(); g.moveTo(cx - 16, cy + 120); g.lineTo(cx + 16, cy + 120); g.lineTo(cx + 22, cy + 215); g.lineTo(cx, cy + 238); g.lineTo(cx - 22, cy + 215); g.fill();
    g.fillStyle = '#C99466'; g.fillRect(cx - 34, cy + 50, 68, 70);
    g.fillStyle = '#E0B48C'; g.beginPath(); g.ellipse(cx, cy - 8, 92, 112, 0, 0, Math.PI * 2); g.fill();
    g.fillStyle = kind === 'lawyer' ? '#B8B8B8' : '#3A2A1E'; g.beginPath(); g.ellipse(cx, cy - 92, 98, 50, 0, Math.PI, Math.PI * 2); g.fill(); g.fillRect(cx - 98, cy - 92, 22, 60); g.fillRect(cx + 76, cy - 92, 22, 60);
    g.fillStyle = '#1E2229'; for (const s of [-1, 1]) { g.beginPath(); g.arc(cx + s * 36, cy - 14, 9, 0, Math.PI * 2); g.fill(); g.fillRect(cx + s * 36 - 20, cy - 44, 40, 7); }
    if (kind === 'lawyer') { g.strokeStyle = '#1E2229'; g.lineWidth = 6; for (const s of [-1, 1]) { g.beginPath(); g.arc(cx + s * 36, cy - 14, 26, 0, Math.PI * 2); g.stroke(); } g.beginPath(); g.moveTo(cx - 10, cy - 16); g.lineTo(cx + 10, cy - 16); g.stroke(); }
    g.strokeStyle = '#9A3A3A'; g.lineWidth = 7; g.beginPath(); g.arc(cx, cy + 26, 34, 0.15 * Math.PI, 0.85 * Math.PI); g.stroke();
  } else {
    g.fillStyle = '#3E4A5A'; g.fillRect(cx - 70, cy + 110, 140, 40); g.fillStyle = '#9AA6B8'; g.fillRect(cx - 230, cy + 150, 460, h - cy - 150);
    g.fillStyle = '#B8C0CC'; g.beginPath(); g.roundRect(cx - 120, cy - 120, 240, 230, 26); g.fill();
    g.fillStyle = '#141821'; g.beginPath(); g.roundRect(cx - 98, cy - 52, 196, 74, 18); g.fill();
    g.fillStyle = '#7FE8FF'; g.shadowColor = '#7FE8FF'; g.shadowBlur = 24; for (const s of [-1, 1]) g.fillRect(cx + s * 44 - 16, cy - 26, 32, 24); g.shadowBlur = 0;
    g.fillStyle = '#3E4A5A'; g.fillRect(cx - 4, cy - 170, 8, 50); g.fillStyle = '#E0A23A'; g.beginPath(); g.arc(cx, cy - 176, 13, 0, Math.PI * 2); g.fill();
  }
  // a name plate and a live dot (generic, no brand)
  const name = { boss: 'CEO', lawyer: 'LAWYER · LAW FIRM', robot: 'CEO?', robot2: 'LAWYER?' }[kind];
  g.font = "800 40px Figtree"; const tw = g.measureText(name).width; g.fillStyle = 'rgba(8,10,26,0.78)'; g.beginPath(); g.roundRect(28, h - 92, tw + 48, 64, 14); g.fill(); g.fillStyle = '#fff'; g.textBaseline = 'middle'; g.fillText(name, 52, h - 59);
  g.fillStyle = 'rgba(8,10,26,0.7)'; g.beginPath(); g.roundRect(w - 200, 26, 172, 56, 28); g.fill(); g.fillStyle = '#FF4A3A'; g.beginPath(); g.arc(w - 168, 54, 11, 0, Math.PI * 2); g.fill(); g.fillStyle = '#fff'; g.font = "800 30px Inter"; g.fillText('LIVE', w - 146, 55);
}
const scrTex = {
  boss: textTex(1024, 600, (g, w, h) => portrait(g, w, h, 'boss')),
  lawyer: textTex(1024, 600, (g, w, h) => portrait(g, w, h, 'lawyer')),
  robot: textTex(1024, 600, (g, w, h) => portrait(g, w, h, 'robot')),
  robot2: textTex(1024, 600, (g, w, h) => portrait(g, w, h, 'robot2')),
  idle: textTex(1024, 600, (g, w, h) => { g.fillStyle = '#0E1838'; g.fillRect(0, 0, w, h); g.fillStyle = '#9FB2D8'; g.font = "800 44px Figtree"; g.fillText('FINANCE · Q4', 60, 90);
    const hs = [180, 250, 210, 300, 270, 340, 310]; hs.forEach((v, i) => { g.fillStyle = i === 6 ? '#F7B500' : '#3F6AB8'; g.fillRect(80 + i * 128, 540 - v, 80, v); }); }),
  email: textTex(1024, 600, (g, w, h) => { g.fillStyle = '#0E1838'; g.fillRect(0, 0, w, h); g.fillStyle = '#F8F6F0'; g.beginPath(); g.roundRect(70, 60, w - 140, h - 120, 24); g.fill();
    g.fillStyle = '#2F6FB8'; g.beginPath(); g.roundRect(70, 60, w - 140, 84, [24, 24, 0, 0]); g.fill(); g.fillStyle = '#fff'; g.font = "800 40px Figtree"; g.textBaseline = 'middle'; g.fillText('NEW EMAIL', 110, 103);
    g.fillStyle = '#2A2E36'; g.font = "700 40px Inter"; g.fillText('From:  the CEO', 110, 200); g.fillText('Subject:  confidential', 110, 262); g.fillText('financial transaction', 110, 316);
    g.fillStyle = '#5A6070'; g.font = "600 34px Inter"; g.fillText('I need your help with this.', 110, 400); g.fillText('Please sign the NDA.', 110, 448); }),
  sent: textTex(1024, 600, (g, w, h) => { g.fillStyle = '#0E2A1E'; g.fillRect(0, 0, w, h); g.fillStyle = '#3FD27A'; g.beginPath(); g.arc(w / 2, 200, 96, 0, Math.PI * 2); g.fill();
    g.strokeStyle = '#0E2A1E'; g.lineWidth = 22; g.lineCap = 'round'; g.beginPath(); g.moveTo(w / 2 - 44, 202); g.lineTo(w / 2 - 8, 238); g.lineTo(w / 2 + 50, 166); g.stroke();
    g.fillStyle = '#fff'; g.textAlign = 'center'; g.font = "900 60px Figtree"; g.fillText('WIRE SENT', w / 2, 380); g.fillStyle = '#7FF0A8'; g.font = "800 66px JBM"; g.fillText('$11,578,474', w / 2, 470); }),
};
const scrM = new THREE.MeshBasicMaterial({ map: scrTex.boss, toneMapped: false });
const scrPlane = new THREE.Mesh(new THREE.PlaneGeometry(SCW, SCH), scrM); { const s = cscr.userData.screen; scrPlane.position.set(SCR[0] + s[0], PY + s[1], SCR[1] + s[2]); } scene.add(scrPlane);
const glM = new THREE.MeshBasicMaterial({ color: 0xFF3A6A, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false });
const glPlane = new THREE.Mesh(new THREE.PlaneGeometry(SCW, SCH * 0.18), glM); glPlane.position.copy(scrPlane.position); glPlane.position.z += 0.03; scene.add(glPlane);

// ───────────────────────── the fakers' back room: robot A holds the boss's face; a microphone; a desk with red screens
{ const b = new GB(); b.box(10, APY, 8.6, 0x2E3038, AIR[0], APY / 2, AIR[1]); b.box(10, 4.8, 0.4, 0x24262E, AIR[0], APY + 2.4, AIR[1] - 4.3);
  b.box(0.4, 4.8, 8.6, 0x24262E, AIR[0] - 5, APY + 2.4, AIR[1]); b.box(0.4, 4.8, 8.6, 0x24262E, AIR[0] + 5, APY + 2.4, AIR[1]);
  b.cyl(0.05, 0.06, 2.0, 5, 0x3A3F48, RA[0] + 0.9, APY + 1.0, RA[1] + 1.4); b.box(0.7, 0.06, 0.7, 0x3A3F48, RA[0] + 0.9, APY + 0.03, RA[1] + 1.4); b.ball(0.16, 1, 0x2A2E36, RA[0] + 0.75, APY + 2.05, RA[1] + 1.4, 1, 1.3, 1);
  scene.add(b.mesh()); stat.push([AIR[0] - 5.4, AIR[0] + 5.4, AIR[1] - 4.6, AIR[1] + 4.4, APY + 5.2, 'back room']); }
const redLightM = new THREE.MeshBasicMaterial({ color: 0xFF3A50, toneMapped: false }); { const m = new THREE.Mesh(new THREE.BoxGeometry(8.4, 0.16, 0.1), redLightM); m.position.set(AIR[0], APY + 4.2, AIR[1] - 4.05); scene.add(m); }
const deskA = deskMonitors(); deskA.position.set(AIR[0] - 2.8, APY, AIR[1] - 2.0); deskA.userData.screens.material = new THREE.MeshBasicMaterial({ color: 0xFF5A6A, toneMapped: false }); scene.add(deskA);
const eyeA = new THREE.MeshBasicMaterial({ color: 0x7FE8FF, toneMapped: false }), eyeB = new THREE.MeshBasicMaterial({ color: 0x7FE8FF, toneMapped: false });
const robA = robot({ eyeMat: eyeA, body: 0x9AA6B8, acc: 0xE0A23A }); robA.position.set(RA[0], APY, RA[1]); robA.rotation.y = -Math.PI / 2; robA.scale.setScalar(1.2); scene.add(robA);
const maskA = faceMask({ s: 0.95 }); scene.add(maskA);
const crate = (() => { const b = new GB(); b.box(1.2, 0.9, 1.0, 0x6A5848, AIR[0] + 3.4, APY + 0.45, AIR[1] - 2.8); b.box(1.0, 0.7, 0.9, 0x7A6858, AIR[0] + 3.3, APY + 1.25, AIR[1] - 2.7); return b.mesh(); })(); scene.add(crate);
// the signal: glowing dots from the back room (or the law firm) to the call screen while a fake is talking
const sigM = new THREE.MeshBasicMaterial({ color: 0xFF6A8A, toneMapped: false, transparent: true, opacity: 1 }), sigN = 40;
const sig = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(0.22, 0), sigM, sigN); sig.frustumCulled = false; sig.count = 0; scene.add(sig);
const scrEdge = [SCR[0] - 3.4, PY + SCY0 + SCH / 2, SCR[1] + 0.4], scrEdgeR = [SCR[0] + 3.4, PY + SCY0 + SCH / 2, SCR[1] + 0.4];
const curve = (a, b, h) => u => [lerp(a[0], b[0], u), lerp(a[1], b[1], u) + h * 4 * u * (1 - u), lerp(a[2], b[2], u)];
const SIG_A = curve([RA[0] + 0.6, APY + 2.5, RA[1] + 1.2], scrEdge, 9), SIG_B = curve([LW[0], 3.4, LW[1] + 0.8], scrEdgeR, 11);
// the email: from the back room to the worker's screen
const mail = new THREE.Mesh(ENVELOPE, MAT); mail.castShadow = true; scene.add(mail);

// ───────────────────────── the law firm and its 'lawyer' (a person who turns out to be robot B with a mask and a script)
const law = bank(); law.position.set(LF[0], 0, LF[1]); law.scale.setScalar(LFS); law.children.forEach(c => { c.castShadow = true; c.receiveShadow = true; }); scene.add(law);
stat.push([LF[0] - 11.5, LF[0] + 11.5, LF[1] - 7.5, LF[1] + 9.8, 14.5, 'law firm']);
const lawSign = new THREE.Mesh(new THREE.PlaneGeometry(15, 1.8), new THREE.MeshBasicMaterial({ map: signTex('LAW FIRM', '#E9E1CF', '#4A3A2A'), toneMapped: false }));
lawSign.position.set(LF[0], law.userData.signY * LFS, LF[1] + law.userData.signZ * LFS + 0.05); scene.add(lawSign);
for (const [x, z] of [[LF[0] - 15, LF[1] + 12], [LF[0] + 15, LF[1] + 12]]) { const m = bushTree(5.5, R); m.position.set(x, 0, z); scene.add(m); }
const lawyerP = person({ robe: 0x2B2F3A, shirt: 0xF4F2EC, tie: 0x2F4A6A, short: 0xB8B8B8, skin: SKIN[4], s: 1.35 }); lawyerP.position.set(LW[0], 0, LW[1]); lawyerP.rotation.y = -Math.PI / 2; scene.add(lawyerP);
const robB = robot({ eyeMat: eyeB, body: 0xA8B4C4, acc: 0x8C93E6 }); robB.position.set(LW[0], 0, LW[1]); robB.rotation.y = -Math.PI / 2; robB.scale.setScalar(1.2); scene.add(robB);
const maskB = faceMask({ s: 0.95, glasses: true, hair: 0xB8B8B8, skin: 0xD9A57E }); scene.add(maskB);
const scriptM = new THREE.MeshBasicMaterial({ map: textTex(512, 680, (g, w, h) => { g.fillStyle = '#FBF6E8'; g.fillRect(0, 0, w, h); g.fillStyle = '#2E2014'; g.font = "700 64px Fraunces"; g.textAlign = 'center'; g.fillText('Lawyer Call', w / 2, 100);
  g.strokeStyle = '#8A7A6A'; g.lineWidth = 5; for (let i = 0; i < 8; i++) { const y = 170 + i * 62, L = [380, 340, 400, 300, 360, 320, 380, 250][i]; g.beginPath(); g.moveTo(66, y); for (let x = 66; x < 66 + L; x += 24) g.lineTo(x, y + Math.sin(x * 0.11 + i) * 5); g.stroke(); } }), side: THREE.DoubleSide, toneMapped: false });
const scriptP = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 1.33), scriptM); scene.add(scriptP);
stat.push([LW[0] - 1.5, LW[0] + 1.5, LW[1] - 1.5, LW[1] + 1.5, 4.5, 'lawyer']);

// ───────────────────────── the banks behind the headquarters, the cash, the crypto
const banks = BPOS.map(([x, z], i) => { const g = bank(); g.position.set(x, 0, z); g.rotation.y = BANKA[i]; g.scale.setScalar(0.5); g.children.forEach(c => { c.castShadow = true; c.receiveShadow = true; }); scene.add(g); stat.push([x - 7, x + 7, z - 7, z + 7, 9, 'bank']); return g; });
const bankGlowM = new THREE.MeshBasicMaterial({ color: 0xFFC84A, toneMapped: false }); { const b = new GB(); BPOS.forEach(([x, z], i) => b.add(new THREE.BoxGeometry(12.4, 0.5, 0.4), 0xFFFFFF, new THREE.Matrix4().makeRotationY(BANKA[i]).premultiply(new THREE.Matrix4().makeTranslation(x + Math.sin(BANKA[i]) * 5.1, 7.4, z + Math.cos(BANKA[i]) * 5.1)))); scene.add(new THREE.Mesh(b.geo(), bankGlowM)); }
const bankDoor = i => [BPOS[i][0] + Math.sin(BANKA[i]) * 5.0, 2.8, BPOS[i][1] + Math.cos(BANKA[i]) * 5.0];
const cashM = new THREE.InstancedMesh(CASH, MAT, 40); cashM.castShadow = true; cashM.frustumCulled = false; cashM.count = 0; scene.add(cashM);
const CASHF = [...Array(T.cashN)].map((_, k) => { const b = Math.floor(k / 3), j = k % 3, rr = rng(500 + k); return { b, t0: T.cashA + (b * 3 + j) * T.cashStep, sx: DK[0] + (rr() - 0.5) * 1.4, sz: DK[1] + (rr() - 0.5) * 0.8, ux: DK[0] + (rr() - 0.5) * 8, uz: DK[1] + 2 + (rr() - 0.5) * 5, ph: rr() * 6, d: [bankDoor(b)[0] + (rr() - 0.5) * 2, bankDoor(b)[1] + j * 0.5, bankDoor(b)[2] + (rr() - 0.5) * 2] }; });
const cryptoMat = new THREE.MeshLambertMaterial({ color: 0x5FE8FF, emissive: 0x1A8AB0, emissiveIntensity: 0.9 });
const tokM = new THREE.InstancedMesh(BIGCOIN(1.5, 0.32), cryptoMat, 54); tokM.frustumCulled = false; tokM.count = 0; scene.add(tokM);
const TOKS = [...Array(54)].map((_, k) => { const b = k % 9, rr = rng(900 + k); return { b, t0: T.tokens + Math.floor(k / 9) * 0.12 + rr() * 0.15, dx: (rr() - 0.5) * 30 + Math.sin(BANKA[b]) * 20, dz: (rr() - 0.5) * 20 - 40, h: 28 + rr() * 20, ph: rr() * 6 }; });

// ───────────────────────── the court: the building, police cars with lights, the gavel
const court = bank(); court.position.set(CT[0], 0, CT[1]); court.scale.setScalar(1.2); court.children.forEach(c => { c.castShadow = true; c.receiveShadow = true; }); scene.add(court); stat.push([CT[0] - 16, CT[0] + 16, CT[1] - 11, CT[1] + 14.5, 22, 'court']);
const courtSign = new THREE.Mesh(new THREE.PlaneGeometry(17.5, 2.0), new THREE.MeshBasicMaterial({ map: signTex('UNITED STATES COURT', '#E9E1CF', '#4A3A2A'), toneMapped: false }));
courtSign.position.set(CT[0], court.userData.signY * 1.2, CT[1] + court.userData.signZ * 1.2 + 0.05); scene.add(courtSign);
for (const [x, z] of [[CT[0] - 26, CT[1] + 4], [CT[0] + 26, CT[1] + 4], [CT[0] - 30, CT[1] + 26], [CT[0] + 30, CT[1] + 26]]) { const m = bushTree(6 + R() * 2, R); m.position.set(x, 0, z); scene.add(m); }
const redM = new THREE.MeshBasicMaterial({ color: 0xFF3A30, toneMapped: false }), blueM = new THREE.MeshBasicMaterial({ color: 0x3A6AFF, toneMapped: false });
const cops = [[CT[0] - 9, CT[1] + 20, 0.5], [CT[0] + 1, CT[1] + 23, -0.15], [CT[0] + 11, CT[1] + 19.5, -0.6]].map(([x, z, r]) => { const c = policeCar({ redMat: redM, blueMat: blueM }); c.position.set(x, 0, z); c.rotation.y = r; c.scale.setScalar(1.6); scene.add(c); return c; });
const gBlock = gavelBlock(0.9); gBlock.position.set(GV[0], 0, GV[1]); scene.add(gBlock); stat.push([GV[0] - 4, GV[0] + 4, GV[1] - 4, GV[1] + 4, 13, 'gavel']);
const gavel = gavelHead(0.9); gavel.position.set(GV[0], 3.6, GV[1]); gavel.rotation.y = 0.5; scene.add(gavel);

// ───────────────────────── the street: cars, walkers, lamps
const CARS = [[0xC8423A, 11.2, 1, 0.0], [0xF2F2F2, 11.2, 1, 0.37], [0x2F6FB8, 14.8, -1, 0.15], [0xE0A23A, 14.8, -1, 0.62], [0x4C9A62, 11.2, 1, 0.71], [0x3A3F48, 14.8, -1, 0.88]].map(([c, z, dir, ph]) => { const m = car(c); m.rotation.y = dir > 0 ? 0 : Math.PI; scene.add(m); return { m, z, dir, ph }; });
const modern = (i, extra = {}) => ({ robe: [0x34405A, 0x6A2E3E, 0x3F6A5A, 0x5A5A66, 0x7A5A3A, 0x2F4A6A, 0x8A3A3A, 0x3B6FA8][i % 8], skin: SKIN[i % 5], short: [0x231C18, 0x5A3E28, 0xC9A27A, 0x3A2A1E, 0x8A8A8A][i % 5], shirt: i % 2 ? 0xF4F2EC : undefined, ...extra });
const walkers = [[-12, 8.2, 9, 0], [12, 8.0, -8, 0], [-34, 8.4, 6, 0], [24, 8.6, 7, 0], [-6, 17.6, 10, 0]].map(([x, z, dx, dz], i) => { const m = person(modern(i, { badge: i % 2 === 0 })); m.position.set(x, 0, z); scene.add(m); return { m, a: [x, z], b: [x + dx, z + dz], sp: 0.05 + i * 0.011, ph: i * 0.29 }; });
const lampHeads = new GB();
for (const x of [-34, -20, 8, 22, 40]) { const l = lamp(6.4); l.position.set(x, 0, 8.0); l.rotation.y = Math.PI / 2; scene.add(l); lampHeads.box(0.36, 0.12, 0.6, 0xFFFFFF, x, 6.22, 8.0 - 1.25); }
const lampM = new THREE.MeshLambertMaterial({ color: 0xFFF1C8, emissive: 0xFFD27A, emissiveIntensity: 0 }); scene.add(new THREE.Mesh(lampHeads.geo(), lampM));

// ───────────────────────── 'targeted' pins over the city's companies (rippling out from the office)
const pinG = (() => { const b = new GB(); b.cone(1.0, 2.4, 8, 0xFFFFFF, 0, 1.2, 0, Math.PI, 0, 0); b.ball(0.9, 1, 0xFFFFFF, 0, 2.6, 0); return b.geo(); })();
const pinM = new THREE.MeshLambertMaterial({ color: 0xFF5A4A, emissive: 0xA0201A, emissiveIntensity: 0.6 });
const PINS = TOPS.sort((a, b) => a[3] - b[3]).slice(0, 70); const pins = new THREE.InstancedMesh(pinG, pinM, PINS.length); pins.frustumCulled = false; scene.add(pins);
PINS.forEach((p, i) => { p.t0 = T.thousands + 0.05 + (i / PINS.length) * (T.targeted + 0.7 - T.thousands); });

// ───────────────────────── clouds, sparkles
const clouds = []; for (let i = 0; i < 18; i++) { const m = cloud(R); const far = i >= 10; m.position.set(far ? -500 + R() * 1100 : -260 + i * 60 + R() * 20, 84 + R() * 40, far ? -560 + R() * 200 : -340 + R() * 300); m.scale.setScalar(2.0 + R() * 2.2); m.userData.x0 = m.position.x; scene.add(m); clouds.push(m); }
const sparkT = (() => { const cv = document.createElement('canvas'); cv.width = cv.height = 64; const g = cv.getContext('2d'); g.translate(32, 32); g.fillStyle = '#fff'; for (let k = 0; k < 2; k++) { g.rotate(Math.PI / 2 * k); g.beginPath(); g.moveTo(0, -30); g.quadraticCurveTo(3, -3, 30, 0); g.quadraticCurveTo(3, 3, 0, 30); g.quadraticCurveTo(-3, 3, -30, 0); g.quadraticCurveTo(-3, -3, 0, -30); g.fill(); } const tx = new THREE.CanvasTexture(cv); tx.colorSpace = THREE.SRGBColorSpace; return tx; })();
const sparks = []; for (let i = 0; i < 80; i++) { const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: sparkT, color: 0xFFE9A8, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false })); sp.userData = { ph: R() * 6.28, w: 3 + R() * 4, dx: (R() - 0.5) * 2, dz: (R() - 0.5) * 2, k: R() }; scene.add(sp); sparks.push(sp); }
const flashM = new THREE.SpriteMaterial({ map: radial('rgba(255,255,255,1)', 'rgba(255,255,255,0)'), color: 0xFFFFFF, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false, opacity: 0 });
const flash = new THREE.Sprite(flashM); flash.position.set(LW[0], 2.6, LW[1] + 0.6); scene.add(flash);

// ───────────────────────── camera path (spherical keys around a target; `up` tilts the view so the subject sits lower in the frame)
const CAM = [
  { t: 0, tg: [1, 5.2, -4], d: 46, az: 18, el: 7, up: 0.12 },                                            // the cover: the office and its call screen at sunset
  { t: T.bigOut, tg: [1.2, 5.2, -3.8], d: 40, az: 15, el: 7, up: 0.1, mv: 1 },
  { t: T.pros1 + 0.4, tg: [1.5, 5.0, -3.2], d: 30, az: 8, el: 7, up: 0.07, mv: 1 },                     // the 'boss' on the screen
  { t: T.b2 + 0.3, tg: [0, 10, -24], d: 90, az: 12, el: 24, up: 0.05, mv: 1 },
  { t: T.targeted + 0.6, tg: [0, 8, -50], d: 235, az: 8, el: 38, up: 0.03, mv: 1 },                     // crane up: pins on the city's companies
  { t: T.pet + 0.7, tg: [0, 8, -52], d: 240, az: 4, el: 38, up: 0.03 },
  { t: T.how + 0.5, tg: [1.5, 4.8, -2], d: 26, az: 8, el: 14, up: 0.04, mv: 1 },                        // down into the office, over the worker's shoulder
  { t: T.b4 - 0.05, tg: [1.5, 5.0, -2.6], d: 22, az: 6, el: 11, up: 0.04, mv: 1 },
  { t: T.help + 0.4, tg: [1.5, 5.2, -3.0], d: 21, az: 4, el: 8, up: 0.04, mv: 1 },                       // the email on the screen
  { t: T.face + 0.3, tg: [1.5, 5.4, -3.2], d: 18, az: -3, el: 7, up: 0.04, mv: 1 },                      // the call: the boss's face
  { t: T.ai + 0.15, tg: [-13, 3.6, 0], d: 42, az: -4, el: 12, up: 0.05, mv: 1 },                         // pan west: from the screen to the back room
  { t: T.ai + 0.75, tg: [RA[0], APY + 2.0, RA[1]], d: 15, az: 10, el: 11, up: 0.06, mv: 1 },             // the robot holding the boss's face
  { t: T.b6 - 0.05, tg: [RA[0], APY + 2.0, RA[1]], d: 14, az: 16, el: 11, up: 0.06 },
  { t: (T.b6 + T.someone) / 2 + 0.2, tg: [-9, 6, -1], d: 42, az: 6, el: 26, up: 0.04, mv: 1 },            // up and over the office wall …
  { t: T.someone + 0.2, tg: [1.5, 5.4, -3.2], d: 22, az: 4, el: 9, up: 0.05, mv: 1 },                    // … back to the screen: someone else calls
  { t: T.lawyer6 + 0.3, tg: [LF[0], 6, LF[1] + 8], d: 54, az: 12, el: 10, up: 0.06, mv: 1 },             // across town: the law firm
  { t: T.b7 + 0.2, tg: [LW[0], 2.2, LW[1]], d: 16, az: 10, el: 9, up: 0.06, mv: 1 },                     // the 'lawyer'
  { t: T.script + 0.5, tg: [LW[0] + 0.4, 2.2, LW[1]], d: 13, az: 4, el: 9, up: 0.06, mv: 1 },
  { t: (T.script + T.tell) / 2 + 0.55, tg: [12, 8, 0], d: 46, az: 18, el: 30, up: 0.03, mv: 1 },          // up over the street …
  { t: T.tell + 0.25, tg: [-1.5, 3.2, 0.5], d: 27, az: 22, el: 24, up: 0.04, mv: 1 },                    // … the office: colleagues, the bubble
  { t: T.b8 + 0.1, tg: [-1, 3.2, 0.5], d: 25, az: 18, el: 24, up: 0.04 },
  { t: T.sent + 0.4, tg: [1.5, 9, -1], d: 44, az: 16, el: 14, up: 0.06, mv: 1 },                         // the money goes up and out
  { t: T.dollars8 + 0.4, tg: [1.5, 16, -6], d: 62, az: 14, el: 18, up: 0.05, mv: 1 },
  { t: T.nine - 0.1, tg: [0, 5, -70], d: 118, az: 6, el: 30, up: 0.02, mv: 1 },                         // crane up: the banks
  { t: T.crypto + 0.1, tg: [0, 6, -78], d: 104, az: 2, el: 26, up: 0.03, mv: 1 },
  { t: T.b10 - 0.05, tg: [0, 14, -84], d: 110, az: -2, el: 24, up: 0.05, mv: 1 },                        // into crypto, up and away
  { t: T.b10 + 0.5, tg: [CT[0] + 40, 90, CT[1] + 10], d: 40, az: 20, el: -38, up: 0, mv: 1 },            // sky wipe: up into the sky …
  { t: T.b10 + 1.1, tg: [CT[0] + 4, 5, CT[1] + 22], d: 80, az: 8, el: 13, up: 0.035, mv: 1 },             // … and down on the court
  { t: T.charged + 0.2, tg: [CT[0] + 8, 4.5, CT[1] + 25], d: 66, az: 14, el: 13, up: 0.035, mv: 1 },
  { t: T.b11 + 0.3, tg: [GV[0] - 4, 4.5, GV[1] + 2], d: 40, az: 16, el: 12, up: 0.06, mv: 1 },           // the gavel
  { t: T.over + 0.6, tg: [CT[0] + 2, 5, CT[1] + 20], d: 82, az: 6, el: 12, up: 0.035, mv: 1 },
  { t: T.story + 0.3, tg: [-50, 40, -40], d: 120, az: 20, el: 30, up: 0.04, mv: 1 },                     // crane up over the roofs …
  { t: T.voice12 + 0.2, tg: [0, 10, -24], d: 178, az: 12, el: 16, up: 0.05, mv: 1 },                     // … wide: the city at sunset
  { t: T.cta - 0.2, tg: [0, 10, -24], d: 168, az: 14, el: 16, up: 0.05 },
  { t: T.comment, tg: [1.5, 5.4, -3.2], d: 30, az: 6, el: 8, up: 0.1, mv: 1 },                           // the call screen for the question
  { t: DUR + 0.5, tg: [1.5, 5.4, -3.2], d: 27, az: 8, el: 8, up: 0.1 },
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
.tag.grn{color:#062A12;background:#3FD27A;border-color:#3FD27A;} .tag.red{color:#fff;background:#E8433A;border-color:#E8433A;} .tag.pink{color:#fff;background:#D93FA8;border-color:#D93FA8;} .tag.cyan{color:#06222A;background:#5FE8FF;border-color:#5FE8FF;} .tag.blue{color:#fff;background:#5A6CF0;border-color:#5A6CF0;}
.tag.cty{font-size:22px;padding:9px 13px 8px;letter-spacing:.12em;} .tag.cyan b{color:#06222A;}
.stamp{font:900 64px/1 'Figtree',sans-serif;letter-spacing:.06em;color:#FF5A4A;border:6px solid #FF5A4A;padding:8px 22px 6px;border-radius:14px;background:rgba(40,6,4,.35);text-shadow:0 0 18px rgba(255,90,70,.6);}
.stamp.am{color:#FFC84A;border-color:#FFC84A;background:rgba(40,28,4,.4);text-shadow:0 0 18px rgba(255,200,80,.6);}
.cnt{text-align:center;background:rgba(8,10,26,.9);border:2px solid rgba(255,225,160,.65);padding:22px 40px 20px;border-radius:26px;box-shadow:0 14px 40px rgba(5,7,20,.5);}
.cnt .v{font:800 96px/1 'JBM',monospace;letter-spacing:-3px;color:#FFC84A;} .cnt .l{margin-top:12px;font:700 30px/1.25 'Figtree',sans-serif;color:#fff;white-space:pre;} .cnt .s{margin-top:12px;font:600 18px/1 'Inter',sans-serif;letter-spacing:.08em;color:rgba(255,255,255,.6);}
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
const tagBoss = mk('tag red', 'the “boss” · <b>AI</b>-made, per prosecutors');
const cardThousands = mk('card', `<em>thousands</em> of companies targeted\n<small>PER PROSECUTORS · AP · CYBERSCOOP</small>`);
const tagHosp = mk('tag', 'hospital systems'), tagPet = mk('tag', 'a pet food company');
const tagEmail = mk('tag am', 'an email “from the CEO”');
const cardSecret = mk('card', `“a <em>confidential</em> financial transaction”\n<small>WHAT THE FAKE CEO ASKED FOR HELP WITH · US JUSTICE DEPT · AP</small>`);
const tagVoice = mk('tag pink', 'the <b>voice</b>: an AI copy'), tagFace = mk('tag pink', 'sometimes the <b>face</b> too');
const cardAI = mk('card', `AI copied the CEO's <em>voice</em>,\nand sometimes the <em>face</em>\n<small>PER PROSECUTORS · AP · CYBERSCOOP</small>`);
const tagLawyer = mk('tag am', 'a lawyer at a big law firm');
const stampFake = mk('stamp', 'FAKE TOO');
const cardScript = mk('card', `a handwritten script, “Lawyer Call”:\n<em>don't discuss it with colleagues</em>\n<small>AS DESCRIBED BY US PROSECUTORS</small>`);
const tagSecret = mk('tag cyan', 'tell no one at work');
const cnt11 = mk('cnt', `<div class="v"></div><div class="l">wired by one British\nfintech company</div><div class="s">US JUSTICE DEPT · CYBERSCOOP</div>`); const cnt11v = cnt11.querySelector('.v');
const tagCty = COUNTRIES.map(c => mk('tag cty', c));
const tagCrypto = mk('tag cyan', 'then turned into <b>crypto</b> · per prosecutors');
const cardArrest = mk('card', `arrested: <em>Spain</em> (17 Jun, 5 Aug 2026)\nand <em>Britain</em> (7 Sep 2026)\n<small>US JUSTICE DEPT · AP · CYBERSCOOP</small>`);
const cardCharged = mk('card', `charged in <em>New York</em>: wire fraud,\nidentity theft, money laundering\n<small>UP TO 20 YEARS PER COUNT · MADE PUBLIC 5 NOV 2026</small>`);
const cardInnocent = mk('card', `<em>presumed innocent</em> unless proven guilty:\nthe charges are accusations\n<small>US JUSTICE DEPT · AP</small>`);
const stampOver = mk('stamp am', 'NOT OVER YET');
const title = mk('title', '<div class="s">THE STORY OF</div><div class="n">The Boss Who\n<em>Wasn\'t There</em></div>');
const lesson = mk('lesson', `A familiar <em>voice</em> is no longer <em>proof</em>.<small>AN AI FRAUD CASE · 2024 → 2026</small>`);
const ctaChip = mk('chip am', 'what do you think?');
const boxes = [0, 1].map(() => { const e = mk('cbox', '<span class="in"></span><span class="post">Post</span>'); return { e, inn: e.querySelector('.in'), post: e.querySelector('.post') }; });
const foot = document.getElementById('foot');
foot.textContent = "Sources: US Justice Dept (SDNY, 5–6 Nov 2026) · AP · CyberScoop · SCMP · American Banker (Nov 2026)\nAccusations, not convictions: the three men are presumed innocent · the calls as described by prosecutors";
const setTxt = (e, s) => { if (e.textContent !== s) e.textContent = s; };
const setHTML = (e, s) => { if (e._h !== s) { e._h = s; e.innerHTML = s; } };
const p3 = (p, o = 1) => { const q = proj(p[0], p[1], p[2]); return [q[0], q[1], q[2] ? o : 0]; };
const SCRTOP = [SCR[0], PY + SCY0 + SCH + 0.9, SCR[1]];

function updateUI(t) {
  updateCaption(t);
  foot.style.opacity = (0.95 * seg(t, 3.0, 3.6) * (1 - seg(t, T.cta, T.cta + 0.3) * 0.45)).toFixed(3);
  // the hook card (0-1.5 s, the cover), then the big number (1.5-3 s)
  if (hookEl) { const out = seg(t, T.hookEnd, T.hookEnd + (TIM.big ? 0.22 : 0.3)); put(hookEl, W / 2, 640 - 40 * eo(out), 1 - out, 1 + 0.035 * seg(t, 0, T.hookEnd) + 0.06 * out); }
  if (bigEl) { const o = win(t, T.bigIn, T.bigOut - 0.05, 0.15, 0.25), u = eo(seg(t, T.bigIn + 0.05, T.bigIn + 0.7)), land = seg(t, T.bigIn + 0.7, T.bigIn + 1.0), sh = (1 - land) * (land > 0 ? 1 : 0);
    bigBg.style.opacity = (0.92 * o).toFixed(3); setHTML(BIGN.v, bigText(u)); BIGN.line.style.strokeDashoffset = (BIGN.len * (1 - eo(seg(t, T.bigIn, T.bigIn + 0.9)))).toFixed(1);
    put(bigEl, W / 2 + Math.sin(t * 90) * 7 * sh, 860 + Math.cos(t * 77) * 5 * sh, o, pop(t, T.bigIn, 0.4) * (1 + 0.05 * Math.sin(Math.PI * land))); }
  // the chip (one line at the top that says where we are)
  let ct = '', co = 0, cp = 0;
  const CH = [[T.bigOut + 0.05, T.b2 - 0.1, 'charges made public · 5 Nov 2026'], [T.b2 + 0.1, T.b3 - 0.1, 'July 2024 → Feb 2026 · per prosecutors'], [T.b4 + 0.05, T.b5 - 0.1, 'step 1 · an email'],
    [T.b5 + 0.05, T.copied - 0.1, 'step 2 · a call'], [T.copied, T.b6 - 0.1, 'behind the call'], [T.b6 + 0.05, T.b8 - 0.1, 'step 3 · a lawyer'], [T.b8 + 0.05, T.b9 - 0.1, 'step 4 · the wire'],
    [T.b9 + 0.05, T.b10 - 0.1, 'accounts in nine countries'], [T.b10 + 0.5, T.b11 - 0.1, 'Manhattan · US Justice Dept'], [T.b11 + 0.05, T.story - 0.1, 'as of 27 Nov 2026']];
  for (const [a, b, s] of CH) { const o = win(t, a, b, 0.22, 0.22); if (o > co) { co = o; ct = s; cp = pop(t, a); } }
  if (ct) setTxt(chip, ct); put(chip, W / 2, 472, co, cp);
  // 1 — the 'boss' on the screen
  { const p = p3(SCRTOP, win(t, T.fake1, T.b2 - 0.1, 0.2, 0.25)); put(tagBoss, clampX(p[0], 300), clampY(p[1], 640, 1300), p[2], pop(t, T.fake1)); }
  // 2 — thousands of companies; a hospital, a pet food maker
  put(cardThousands, W / 2, 1250, win(t, T.thousands, T.b3 - 0.1, 0.25, 0.25), pop(t, T.thousands));
  { const p = p3([HP[0], 33, HP[1]], win(t, T.hospitals, T.b3 - 0.1, 0.2, 0.25)); put(tagHosp, clampX(p[0], 200), clampY(p[1], 640, 1150), p[2], pop(t, T.hospitals)); }
  { const p = p3([PF[0], 19, PF[1]], win(t, T.pet, T.b3 - 0.1, 0.2, 0.25)); put(tagPet, clampX(p[0], 220), clampY(p[1], 640, 1150), p[2], pop(t, T.pet)); }
  // 4 — the email; the secret deal
  { const p = p3(SCRTOP, win(t, T.mailIn, T.b5 - 0.1, 0.2, 0.25)); put(tagEmail, clampX(p[0], 260), clampY(p[1], 640, 1250), p[2], pop(t, T.mailIn)); }
  put(cardSecret, W / 2, 1430, win(t, T.secret, T.b5 + 0.2, 0.25, 0.25), pop(t, T.secret));
  // 5 — voice, face; AI behind the call
  { const p = p3(SCRTOP, win(t, T.voice, T.face - 0.05, 0.15, 0.15)); put(tagVoice, clampX(p[0], 260), clampY(p[1], 640, 1250), p[2], pop(t, T.voice)); }
  { const p = p3(SCRTOP, win(t, T.face, T.copied + 0.1, 0.15, 0.2)); put(tagFace, clampX(p[0], 260), clampY(p[1], 640, 1250), p[2], pop(t, T.face)); }
  put(cardAI, W / 2, 1430, win(t, T.ai + 0.3, T.b6 + 0.05, 0.25, 0.25), pop(t, T.ai + 0.3));
  // 6–7 — the lawyer; fake too; the script; tell no one at work
  { const p = p3([LW[0], 6.2, LW[1]], win(t, T.lawyer6 + 0.2, T.fake7 - 0.05, 0.2, 0.15)); put(tagLawyer, clampX(p[0], 250), clampY(p[1], 640, 1250), p[2], pop(t, T.lawyer6 + 0.2)); }
  { const p = p3([LW[0], 6.6, LW[1]], win(t, T.fake7, T.script - 0.05, 0.1, 0.2)); put(stampFake, clampX(p[0], 260), clampY(p[1], 640, 1250), p[2], pop(t, T.fake7, 0.25)); stampFake.style.rotate = '-6deg'; }
  put(cardScript, W / 2, 1430, win(t, T.script, T.tell + 0.2, 0.25, 0.25), pop(t, T.script));
  { const p = p3([DK[0], PY + 7.0, DK[1] + 0.8], win(t, T.tell + 0.1, T.b8 - 0.05, 0.2, 0.25)); put(tagSecret, clampX(p[0], 220), clampY(p[1], 640, 1300), p[2], pop(t, T.tell + 0.1)); }
  // 8 — the wire: $11.6M from one British fintech
  { const o = win(t, T.british, T.b9 - 0.15, 0.25, 0.25), u = eo(seg(t, T.sent, T.dollars8 + 0.4)); setHTML(cnt11v, `$${(11.6 * u).toFixed(1)}M`); put(cnt11, W / 2, 1330, o, pop(t, T.british)); }
  // 9 — nine countries; crypto
  tagCty.forEach((e, i) => { const d = bankDoor(i), p = p3([d[0], 9.5, d[2]], win(t, T.land[i] - 0.05, T.b10 - 0.1, 0.15, 0.2)); put(e, clampX(p[0], 90), clampY(p[1] - (i % 2) * 46, 640, 1350), p[2], pop(t, T.land[i] - 0.05)); });
  put(tagCrypto, W / 2, 1360, win(t, T.crypto, T.b10 - 0.05, 0.2, 0.2), pop(t, T.crypto));
  // 10–11 — arrests, charges, presumed innocent, not over yet
  put(cardArrest, W / 2, 1420, win(t, T.arrested, T.charged - 0.1, 0.25, 0.22), pop(t, T.arrested));
  put(cardCharged, W / 2, 1420, win(t, T.charged, T.b11 - 0.05, 0.22, 0.22), pop(t, T.charged));
  put(cardInnocent, W / 2, 1420, win(t, T.b11 + 0.05, T.over - 0.1, 0.22, 0.22), pop(t, T.b11 + 0.05));
  put(stampOver, W / 2, 1250, win(t, T.over, T.story - 0.1, 0.12, 0.25), pop(t, T.over, 0.25)); stampOver.style.rotate = '-6deg';
  // 12 — title and lesson; 13 — the question
  put(title, W / 2, 640, win(t, T.story, T.cta - 0.1, 0.4, 0.3), 0.94 + 0.06 * eo(seg(t, T.story, T.story + 0.6)));
  put(lesson, W / 2, 1190, win(t, T.voice12 - 0.1, T.cta - 0.15, 0.3, 0.25), pop(t, T.voice12 - 0.1));
  put(ctaChip, W / 2, 472, seg(t, T.cta + 0.05, T.cta + 0.35), pop(t, T.cta + 0.05));
  [[T.yes, 'YES', T.postA], [T.no, 'NO', T.postB]].forEach(([t0, word, tp], i) => {
    const bx = boxes[i], L = word.length, n = Math.min(L, Math.floor(c01((t - t0) / (0.1 * L)) * (L + 0.001))), typed = word.slice(0, n), caret = (n < L || Math.floor(t * 2.4) % 2) && t < tp ? '<i></i>' : '';
    setHTML(bx.inn, typed ? `<b>${typed}</b>${caret}` : `<em>Add a comment…</em>${caret}`); const sent = t > tp; const pc = sent ? 'post on sent' : n === L ? 'post on' : 'post'; if (bx.post.className !== pc) bx.post.className = pc; setTxt(bx.post, sent ? 'Posted ✓' : 'Post');
    const ts = i ? T.no - 0.35 : T.comment; put(bx.e, W / 2, 1180 + i * 132, seg(t, ts, ts + 0.3), pop(t, ts) * (1 + 0.06 * win(t, tp, tp + 0.3, 0.08, 0.2)));
  });
}

// ───────────────────────── one frame
const hopY = (hops, t, h = 0.5) => { let y = 0; for (const t0 of hops) { const u = (t - t0) / 0.38; if (u > 0 && u < 1) y = Math.max(y, Math.sin(u * Math.PI) * h); } return y; };
const _m4 = new THREE.Matrix4(), _q = new THREE.Quaternion(), _e = new THREE.Euler(), _p = new THREE.Vector3(), _s = new THREE.Vector3(), _c = new THREE.Color();
const hash = n => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
function screenState(t) {   // which picture is on the call screen, and how much it glitches
  const f = Math.floor(t * 30);
  const g1 = win(t, T.fake1, T.fake1 + 0.9, 0.05, 0.2), g2 = win(t, T.ai - 0.05, T.ai + 0.9, 0.05, 0.2), g3 = win(t, T.fake7 - 0.05, T.fake7 + 1.0, 0.05, 0.2), g4 = win(t, T.proof - 0.1, T.proof + 0.8, 0.05, 0.2) + win(t, T.spotted, T.spotted + 0.7, 0.05, 0.2);
  const g = Math.max(g1, g2, g3, g4), flick = g > 0.05 && hash(f) < 0.45 * g + 0.15;
  let k = 'boss';
  if (t >= T.b2 + 0.6 && t < T.mailIn) k = 'idle';
  else if (t >= T.mailIn && t < T.calls) k = 'email';
  else if (t >= T.someone - 0.05 && t < T.b8 + 0.3) k = 'lawyer';
  else if (t >= T.b8 + 0.3 && t < T.b11) k = 'sent';
  if (flick) k = k === 'lawyer' ? 'robot2' : 'robot';
  return { k, g, jit: g > 0.05 ? (hash(f + 7) - 0.5) * 0.5 * g : 0 };
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
  // the call screen: picture, glitch bar, voice pulse
  { const st = screenState(t); if (scrM.map !== scrTex[st.k]) { scrM.map = scrTex[st.k]; scrM.needsUpdate = true; }
    const talk = (st.k === 'boss' || st.k === 'lawyer') && t > T.calls ? 0.08 * Math.abs(Math.sin(t * 11)) : 0; scrM.color.setScalar(0.92 + talk);
    scrPlane.position.x = SCR[0] + st.jit; glM.opacity = st.g * (0.25 + 0.5 * hash(Math.floor(t * 30) + 3)); glPlane.position.y = scrPlane.position.y + (hash(Math.floor(t * 30) + 11) - 0.5) * SCH * 0.8; glPlane.visible = st.g > 0.02; }
  desk.userData.screens.material.color.setRGB(0.56 + 0.1 * Math.sin(t * 2.1), 0.86, 1);
  // the worker: turns to the screen when it rings, a small start at the glitches; colleagues working
  worker.rotation.y = Math.PI / 2 + 0.06 * Math.sin(t * 1.1) + 0.25 * win(t, T.tell, T.b8, 0.3, 0.4); worker.position.y = PY + 0.25 + hopY([T.ring, T.sent - 0.2], t, 0.18);
  colleagues.forEach((c, i) => { c.rotation.y = Math.PI / 2 + Math.sin(t * 1.4 + i * 2) * 0.12; c.position.y = PY + 0.25 + Math.abs(Math.sin(t * 2.2 + i)) * 0.03; });
  { const o = win(t, T.tell, T.b8 + 0.6, 0.35, 0.4); bubbleM.opacity = 0.32 * o; bubble.visible = o > 0.01; bubble.scale.setScalar(0.3 + 0.7 * eo(seg(t, T.tell, T.tell + 0.5))); }
  // the back room: robot A holds the boss's face up to its head (lowered for a moment after "AI")
  { const down = win(t, T.maskDown, T.maskUp, 0.3, 0.35), bob = Math.sin(t * 2.3) * 0.04;
    maskA.position.set(RA[0] + 0.05, APY + 1.0 - 1.1 * down + bob, RA[1] + 0.8 + 0.3 * down); maskA.rotation.set(-0.9 * down, 0, 0.2 * down);
    robA.position.y = APY + Math.abs(Math.sin(t * 3)) * 0.03; eyeA.color.setRGB(lerp(0.5, 1, down), lerp(0.91, 0.3, down), lerp(1, 0.4, down)); }
  redLightM.color.setRGB(1, 0.23 + 0.1 * Math.sin(t * 4), 0.31);
  // the signal from a fake to the screen
  { let n = 0; const on1 = win(t, T.calls, T.someone + 0.2, 0.3, 0.3), on2 = win(t, T.someone, T.b8 + 0.2, 0.3, 0.3);
    for (const [on, f] of [[on1, SIG_A], [on2, SIG_B]]) { if (on < 0.02) continue; for (let i = 0; i < sigN / 2; i++) { const u = ((i / (sigN / 2)) + t * 0.35) % 1, p = f(u); _p.set(p[0], p[1], p[2]); _s.setScalar(on * (0.6 + 0.4 * Math.sin(u * Math.PI))); _q.identity(); _m4.compose(_p, _q, _s); sig.setMatrixAt(n++, _m4); } }
    sig.count = n; sig.instanceMatrix.needsUpdate = true; }
  // the email flies from the back room to the screen
  { const u = seg(t, T.mailFly, T.mailIn), on = t > T.mailFly && t < T.mailIn + 0.15; mail.visible = on;
    if (on) { const a = [RA[0] + 1, APY + 2.6, RA[1] + 1], b = [SCR[0], PY + SCY0 + SCH / 2, SCR[1] + 0.5], e = eio(u); mail.position.set(lerp(a[0], b[0], e), lerp(a[1], b[1], e) + 8 * 4 * e * (1 - e), lerp(a[2], b[2], e)); mail.rotation.set(0, -0.4 + 0.4 * e, Math.sin(t * 8) * 0.2); mail.scale.setScalar(1.3 * (1 - seg(t, T.mailIn - 0.05, T.mailIn + 0.15))); } }
  // the law firm's 'lawyer': a person until "fake too", then robot B with the lawyer's face and the script
  { const isBot = t >= T.swap; lawyerP.visible = !isBot; robB.visible = isBot; maskB.visible = isBot; scriptP.visible = isBot;
    const pf = pop(t, T.swap, 0.35); robB.scale.setScalar(1.2 * (isBot ? pf : 1)); robB.position.y = Math.abs(Math.sin(t * 3)) * 0.03;
    maskB.position.set(LW[0] + 0.05, 1.0 + Math.sin(t * 2.1) * 0.03, LW[1] + 0.8); maskB.rotation.set(0, 0, 0); maskB.scale.setScalar(isBot ? pf : 1);
    const sl = seg(t, T.script - 0.2, T.script + 0.3); scriptP.position.set(LW[0] + 1.05, 1.7 + 0.5 * eo(sl), LW[1] + 0.9); scriptP.rotation.set(-0.15, -0.35, 0.1 + 0.05 * Math.sin(t * 2)); scriptP.scale.setScalar(Math.max(0.01, eo(sl)) * 1.1);
    eyeB.color.setRGB(1, 0.78, 0.3); lawyerP.rotation.y = -Math.PI / 2 + Math.sin(t * 1.2) * 0.08;
    const fo = win(t, T.swap - 0.1, T.swap + 0.4, 0.12, 0.3); flashM.opacity = 0.5 * fo; flash.visible = fo > 0.01; flash.scale.setScalar(5.5 * fo + 0.1); }
  // the money: straight up out of the office, then over the city to the nine banks
  { let n = 0; for (const c of CASHF) { const t1 = c.t0 + T.cashUp, t2 = t1 + T.cashFly; if (t < c.t0 || t > t2 + 0.25) continue;
      let p; if (t < t1) { const u = eo(seg(t, c.t0, t1)); p = [lerp(c.sx, c.ux, u), lerp(PY + 1.3, 40, u), lerp(c.sz, c.uz, u)]; }
      else { const u = eio(seg(t, t1, t2)); p = [lerp(c.ux, c.d[0], u), lerp(40, c.d[1], u) + 10 * 4 * u * (1 - u), lerp(c.uz, c.d[2], u)]; }
      const sc = 2.6 * (1 - seg(t, t2, t2 + 0.25)); _e.set(t * 3 + c.ph, t * 2 + c.ph, 0); _q.setFromEuler(_e); _p.set(p[0], p[1], p[2]); _s.setScalar(Math.max(0.01, sc)); _m4.compose(_p, _q, _s); cashM.setMatrixAt(n++, _m4); }
    cashM.count = n; cashM.instanceMatrix.needsUpdate = true; }
  // the crypto: each bank sends out glowing coins that fly up and away
  { let n = 0; for (const k of TOKS) { const u = (t - k.t0) / 2.2; if (u <= 0 || u >= 1) continue; const d = bankDoor(k.b); _p.set(d[0] + k.dx * eo(u), d[1] + 2 + k.h * eo(u), d[2] + k.dz * eo(u)); _e.set(Math.PI / 2, t * 4 + k.ph, 0); _q.setFromEuler(_e); _s.setScalar(Math.max(0.01, (0.4 + 1.6 * Math.sin(Math.PI * Math.min(1, u * 1.6))) * (1 - u * u))); _m4.compose(_p, _q, _s); tokM.setMatrixAt(n++, _m4); }
    tokM.count = n; tokM.instanceMatrix.needsUpdate = true; cryptoMat.emissiveIntensity = 0.7 + 0.3 * Math.sin(t * 9); }
  // pins on the targeted companies
  { const out = 1 - seg(t, T.b3 + 0.2, T.b3 + 0.8); PINS.forEach((p, i) => { const k = pop(t, p.t0, 0.3) * out; _p.set(p[0], p[1] + 1.2 + Math.sin(t * 3 + i) * 0.4, p[2]); _q.identity(); _s.setScalar(Math.max(0.001, k * (p[3] < 5 ? 4.6 : 4.0))); _m4.compose(_p, _q, _s); pins.setMatrixAt(i, _m4); }); pins.instanceMatrix.needsUpdate = true; pins.visible = t > T.thousands - 0.1 && out > 0.001; }
  // the street: cars, walkers
  CARS.forEach((c, i) => { const L = 260, x = ((c.ph * L + t * 7.5) % L) - L / 2; c.m.position.set(c.dir > 0 ? x : -x, 0, c.z); });
  walkers.forEach((w, i) => { const u = (Math.sin((t * w.sp + w.ph) * Math.PI * 2) + 1) / 2, dir = Math.cos((t * w.sp + w.ph) * Math.PI * 2) > 0 ? 1 : -1; const x = lerp(w.a[0], w.b[0], u), z = lerp(w.a[1], w.b[1], u); w.m.position.set(x, Math.abs(Math.sin(t * 7 + i)) * 0.06, z); w.m.rotation.y = Math.atan2(-(w.b[1] - w.a[1]) * dir, (w.b[0] - w.a[0]) * dir); });
  // the court: police lights, the gavel
  { const ph = Math.floor(t * 6) % 2; redM.color.setRGB(ph ? 1 : 0.25, ph ? 0.23 : 0.06, ph ? 0.19 : 0.05); blueM.color.setRGB(ph ? 0.06 : 0.23, ph ? 0.1 : 0.42, ph ? 0.25 : 1); }
  { const g = T.gavel; let y = 5.6, rz = 0; if (t > g - 0.6) { const up = eo(seg(t, g - 0.6, g - 0.22)), dn = seg(t, g - 0.14, g); y = lerp(lerp(5.6, 8.6, up), 3.75, dn * dn) + (t > g ? Math.sin(c01((t - g) / 0.3) * Math.PI) * 0.4 : 0); rz = 0.45 * up * (1 - dn); } gavel.position.y = y; gavel.rotation.z = rz; }
  // clouds
  for (const c of clouds) { c.position.x = c.userData.x0 + t * 1.2; c.material.opacity = 0.9 - 0.5 * night; const k = lerp(1, 0.45, night); c.material.color.setRGB(lerp(s.hor[0], 1, 0.55) * k, lerp(s.hor[1], 1, 0.55) * k, lerp(s.hor[2], 1, 0.55) * k * 1.05); }
  // sparkles: the cash landing at the banks; the crypto; the posted answers
  { let k = 0; const put3 = (x, y, z, sz, on, col) => { const sp = sparks[k++]; if (!sp) return; const tw = Math.pow(Math.abs(Math.sin(t * sp.userData.w + sp.userData.ph)), 3); sp.position.set(x, y, z); sp.scale.setScalar(sz * (0.25 + tw)); sp.material.opacity = on * (0.3 + 0.7 * tw); sp.material.color.setHex(col); sp.visible = on > 0.01; };
    for (let b = 0; b < 9; b++) { const d = bankDoor(b), on = win(t, T.land[b] - 0.1, T.land[b] + 1.6, 0.1, 0.5); for (let i = 0; i < 3; i++) { const sp = sparks[b * 3 + i].userData; put3(d[0] + sp.dx * 2.5, d[1] + 1 + sp.k * 3, d[2] + sp.dz * 2.5, 2.4, on, 0xC8FFB0); } }
    const s3 = win(t, T.postA, DUR + 1, 0.3, 0.1); for (let i = 0; i < 20; i++) { const ph = (t * 0.35 + i / 20) % 1, a = i * 2.4; put3(SCR[0] + Math.cos(a) * (3 + ph * 3), PY + 3 + ph * 6, SCR[1] + 1.5 + Math.sin(a) * (1.2 + ph), 0.8 + 0.3 * (1 - ph), s3 * Math.sin(ph * Math.PI), 0xFFE9A8); }
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
  land: T.land.map(x => +x.toFixed(3)), cashOut: CASHF.map(c => +c.t0.toFixed(3)), pins: PINS.map(p => +p.t0.toFixed(3)),
  glitch: [T.fake1, T.ai - 0.05, T.fake7 - 0.05, T.proof - 0.1, T.spotted].map(x => +x.toFixed(3)),
  typingA: [0, 1, 2].map(i => +(T.yes + (i + 0.5) * 0.1).toFixed(3)), typingB: [0, 1].map(i => +(T.no + (i + 0.5) * 0.1).toFixed(3)),
  postA: +T.postA.toFixed(3), postB: +T.postB.toFixed(3),
};
document.fonts.ready.then(() => Promise.all(['700 64px Figtree', '900 190px Fraunces', '800 30px JBM', '700 22px Inter', '700 78px Fraunces', '800 54px Figtree', '600 34px Figtree', '500 18px Inter', '900 128px JBM', '800 46px Inter', '900 150px Figtree', '900 112px Fraunces', '800 172px JBM', '700 34px Figtree', '800 92px JBM', '900 64px Figtree', '800 96px JBM', '800 66px Figtree', '800 40px Figtree', '700 40px Inter', '600 34px Inter', '800 30px Inter', '900 60px Figtree', '800 66px JBM', '800 44px Figtree', '700 64px Fraunces', '900 110px Figtree', '800 92px Figtree'].map(f => document.fonts.load(f)))).then(() => { TEXS.forEach(f => f()); fitHook(); renderAt(0); window.__ready = true; });
