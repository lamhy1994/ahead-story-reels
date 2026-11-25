// The Call Nobody Wants — low-poly storybook scene (deterministic: window.renderAt(t) draws the frame for time t)
// Week to Fri 20 Nov 2026: Taiwan's TAIEX falls 17.5%, its worst week in more than 30 years; the main board loses NT$24.97 trillion
// (about US$760 billion). Many investors had bought with borrowed money: 40% their own, 60% lent by the broker; when the shares fall to 78%
// of the price the broker calls (top up in two days or the shares are sold). Margin calls hit a record 6,462 accounts on 20 Nov; forced sales
// fed the fall. The exchange lowered the call line (130% -> 120%) from 24 Nov and cancelled earlier calls. Tue 24 Nov, after Nvidia took
// Jensen Huang back: +8.99%, the biggest one-day point gain on record; Wed 25 Nov: -4.8% (down 8.6% at one point).
// The glass columns are shares bought on margin: grey = borrowed $60, amber = your $40; the red bar is the call line.
import * as THREE from 'three';
import { SKIN, MAT, rng, GB, person, cloud, bushTree, tower, car, lamp, bank, factory, CHIP, deskPhone, stackTower, WIN_LIT, GLASS_M } from './kit.js';

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
const R = rng(20261125);

// ───────────────────────── story clock (everything hangs off the narration)
const T = {
  hookEnd: TIM.big ? 1.5 : TIM.hook ? E(1) + 0.15 : 0,
  bigIn: TIM.big ? 1.5 : 0, bigOut: TIM.big ? 3.0 : 0,
  lost: wt(1, 'lost') - 0.1, billion: wt(1, 'billion') - 0.1, week1: wt(1, 'week') - 0.1,
  b2: S(2) - 0.05, worst: wt(2, 'worst') - 0.1, years: wt(2, 'years') - 0.1, thousands: wt(2, 'thousands') - 0.1, call2: wt(2, 'call') - 0.1, wants2: wt(2, 'wants') - 0.1,
  b3: S(3) - 0.05, calling: wt(3, 'calling') - 0.1,
  b4: S(4) - 0.05, broker4: wt(4, 'broker') - 0.1,
  b5: S(5) - 0.05, many: wt(5, 'many') - 0.1, borrowed5: wt(5, 'borrowed') - 0.1, put: wt(5, 'put') - 0.1, forty: wt(5, '40') - 0.1, lends: wt(5, 'lends') - 0.1, sixty: wt(5, '60') - 0.1,
  b6: S(6) - 0.05, lose: wt(6, 'lose') - 0.1, fifth: wt(6, 'fifth') - 0.1, broker6: wt(6, 'broker') - 0.1, calls6: wt(6, 'calls') - 0.1,
  b7: S(7) - 0.05, pay7: wt(7, 'pay') - 0.1, two: wt(7, 'two') - 0.1, days: wt(7, 'days') - 0.1, sells: wt(7, 'sells') - 0.1, you7: wt(7, 'you') - 0.1,
  b8: S(8) - 0.05, ai: wt(8, 'AI') - 0.1, fears: wt(8, 'fears') - 0.1, sank: wt(8, 'sank') - 0.1, chip: wt(8, 'chip') - 0.1, calls8: wt(8, 'calls') - 0.1, out8: wt(8, 'out') - 0.1,
  b9: S(9) - 0.05, forced: wt(9, 'forced') - 0.1, pushed: wt(9, 'pushed') - 0.1, lower9: wt(9, 'lower') - 0.1, lower9b: wt(9, 'lower', 1) - 0.1, sent9: wt(9, 'sent') - 0.1, more9: wt(9, 'more') - 0.1, calls9: wt(9, 'calls') - 0.1,
  b10: S(10) - 0.05, exchange: wt(10, 'exchange') - 0.1, moved: wt(10, 'moved') - 0.1, line10: wt(10, 'line') - 0.1, cancelled: wt(10, 'cancelled') - 0.1, sent10: wt(10, 'sent') - 0.1,
  b11: S(11) - 0.05, nvidia: wt(11, 'nvidia') - 0.1, founder: wt(11, 'founder') - 0.1, back11: wt(11, 'back') - 0.1, jumped: wt(11, 'jumped') - 0.1, nine: wt(11, '9') - 0.1,
  b12: S(12) - 0.05, next12: wt(12, 'next') - 0.1, plunged: wt(12, 'plunged') - 0.1, again: wt(12, 'again') - 0.1,
  b13: S(13) - 0.05, over13: wt(13, 'over') - 0.1, yet: wt(13, 'yet') - 0.1,
  b14: S(14) - 0.05, story: wt(14, 'story') - 0.15, borrowed14: wt(14, 'borrowed') - 0.1, when14: wt(14, 'when') - 0.1,
  cta: S(15) - 0.1, pay15: wt(15, 'pay') - 0.1, sell15: wt(15, 'sell') - 0.1, comment: wt(15, 'comment') - 0.15, payK: wt(15, 'PAY', 1) - 0.2, sellK: wt(15, 'SELL', 1) - 0.1,
};
T.ringA = T.thousands; T.ringB = T.b5 + 0.4;          // wave 1 of phones over the city ("thousands got a call")
T.liftA = T.broker4;                                   // the broker lifts the handset
T.ownA = T.forty - 0.05; T.loanA = T.lends - 0.05;     // the column fills: your $40, then the broker's $60 under it
T.dropA = T.lose - 0.05;                               // the shares lose about a fifth: 100 -> 78
T.callA = T.calls6 - 0.05;                             // the call (ring above the column)
T.flyA = T.sells - 0.05;                               // the shares fly to the exchange: sold
T.stormA = T.ai - 0.2; T.sinkA = T.sank - 0.05;        // the storm over the chip fabs; the roof chips sink
T.wave2 = T.calls8 - 0.05; T.wave3 = T.more9 - 0.1;   // the calls go out, then more calls
T.loopA = T.forced - 0.3;                              // the loop: forced sales -> prices down -> more calls
T.rowA = T.lower9b - 0.2;                              // more investors' columns rise in the row
T.lineDn = T.moved - 0.05; T.cancelA = T.cancelled - 0.05;
T.jumpA = T.jumped - 0.1; T.plungeA = T.plunged - 0.1;
T.postA = T.payK + 0.75; T.postB = T.sellK + 0.7;
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
  STORM: P(0x353B4C, 0x5E6676, 0x9298A4, 0x868C98, 0xD4D8E4, 1.9, 0x9AA2B4, 0x5A5A62, 1.35, 0, 0.35, -20, 32, 0xE0E4F0, 26, 80, 560),
  SUNSET: P(0x2E2F72, 0xE0707A, 0xFFB25E, 0xEE9A6A, 0xFF9050, 2.9, 0xB49AC8, 0x86685A, 1.45, 0.12, 0.6, -30, 10, 0xFFB060, 50, 90, 620),
  DUSK: P(0x141A4C, 0x4A3F86, 0xC06A78, 0x6A4A78, 0x93A4F4, 1.7, 0x5A62B0, 0x3A2A40, 1.2, 0.65, 0.92, -40, 36, 0xFFF4D6, 30, 80, 600),
};
const SKY = [[0, 'SUNSET'], [T.b4 + 0.6, 'SUNSET'], [T.b5 + 0.9, 'DAY'], [T.b8 - 0.2, 'DAY'], [T.fears + 0.4, 'STORM'], [T.b9 + 0.4, 'STORM'], [T.calls9, 'DUSK'], [T.b10 + 0.4, 'DUSK'],
  [T.moved + 0.7, 'DAY'], [T.b11 + 0.2, 'DAY'], [T.founder + 0.4, 'DUSK'], [T.b13 + 0.4, 'DUSK'], [T.story, 'SUNSET'], [T.cta + 0.2, 'SUNSET'], [T.cta + 1.3, 'NIGHT'], [DUR + 2, 'NIGHT']];
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
const signTex = (txt, bg, fg, w = 1024, h = 140, size = 80) => textTex(w, h, (g, W2, H2) => { g.fillStyle = bg; g.fillRect(0, 0, W2, H2); g.fillStyle = fg; g.font = `800 ${size}px Figtree`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(txt, W2 / 2, H2 / 2 + 4); });

// ───────────────────────── places
const EX = [0, -18];                 // the stock exchange (faces +z), its big board on the roof
const COLZ = 40, COLX = [-36, -28, -20, -12, -4], MAIN = 2;   // a row of glass columns (shares bought on margin); the middle one is the example
const CW = 5.2, CH = 14, FH = 12.6, BASE = 0.9;              // column width and height; fill height at $100; plinth top
const BR = [26, 44];                 // the broker's desk
const FAB = [96, 2];                 // the chip fabs (east)
const TW = [-34, -112];               // the tall stacked tower
const LOOP = [0, 25, 18];            // the loop of arrows over the plaza
const stat = [];

// ───────────────────────── ground, streets, plaza, hills
const ground = new THREE.Mesh(new THREE.PlaneGeometry(2400, 2400).rotateX(-Math.PI / 2), new THREE.MeshLambertMaterial({ color: 0xC9C2AE })); ground.receiveShadow = true; scene.add(ground);
const flat = new GB();
flat.box(9, 0.04, 360, 0x4A4E56, 62, 0.02, 0); flat.box(9, 0.04, 360, 0x4A4E56, -62, 0.021, 0);
flat.box(560, 0.04, 9, 0x4A4E56, 0, 0.022, 84); flat.box(560, 0.04, 9, 0x4A4E56, 0, 0.023, -52);
for (const z of [84, -52]) for (let x = -270; x < 270; x += 6) flat.box(2.6, 0.05, 0.22, 0xF2EEE2, x, 0.045, z);
flat.box(108, 0.07, 92, 0xE6DFD0, 0, 0.035, 32);                                   // the plaza in front of the exchange
for (let i = 0; i < 22; i++) flat.box(108, 0.075, 0.12, 0xD6CEBC, 0, 0.037, -12 + i * 4);
flat.box(12, 0.08, 76, 0xD9CFBA, 0, 0.042, 40);
for (const [x, z, w, d] of [[-44, 66, 14, 18], [44, 66, 14, 18], [-46, 6, 10, 26], [46, 6, 10, 26]]) flat.box(w, 0.06, d, 0x8DAE74, x, 0.03, z);
flat.box(70, 0.06, 80, 0xB8B4A8, FAB[0], 0.031, FAB[1] + 8);                       // the fabs' yard
const flatM = flat.mesh(); flatM.castShadow = false; scene.add(flatM);
// green hills far behind the city (a basin between mountains)
{ const b = new GB(), hr = rng(5150); for (let i = 0; i < 26; i++) { const a = -1.15 + i * 0.09 + (hr() - .5) * 0.05, r = 620 + hr() * 160, x = Math.sin(a) * r, z = -Math.cos(a) * r, h = 90 + hr() * 120, rad = 110 + hr() * 90; b.cone(rad, h, 6, [0x5E8A6A, 0x6E9A72, 0x55806A][i % 3], x, h / 2 - 4, z, 0, hr() * 3, 0); }
  for (let i = 0; i < 10; i++) { const a = -0.9 + i * 0.2 + (hr() - .5) * 0.1, r = 470 + hr() * 60, x = Math.sin(a) * r, z = -Math.cos(a) * r, h = 50 + hr() * 50; b.cone(80 + hr() * 50, h, 6, 0x7FA27E, x, h / 2 - 4, z, 0, hr() * 3, 0); }
  const m = b.mesh(); m.castShadow = false; scene.add(m); }

// ───────────────────────── the city
const FRONTS = [];   // window spots on building fronts (for the phones)
const DEST = (x, z) => (Math.abs(x) < 58 && z > -44 && z < 80) || (x > 66 && x < 134 && z > -40 && z < 52) || Math.hypot(x - TW[0], z - TW[1]) < 22 || Math.abs(z - 84) < 9 || Math.abs(z + 52) < 9 || Math.abs(x - 62) < 9 || Math.abs(x + 62) < 9;
{
  const tr = rng(2611), PAL = [[0xD9D3C6, 0x5E7F9A], [0x6D97AA, 0x3F6A80], [0xE4DED2, 0x4E7C93], [0xC9C2B4, 0x55748C], [0x8FB3C2, 0x426E86], [0xEFE9DC, 0x6A8AA4], [0xB7C4C9, 0x3E6378], [0xE8D9C0, 0x5A7A90]];
  for (let gx = -260; gx <= 260; gx += 22) for (let gz = -150; gz <= 230; gz += 22) {
    const x = gx + (tr() - .5) * 7, z = gz + (tr() - .5) * 7; if (DEST(x, z) || tr() < 0.12) continue;
    const dp = Math.hypot(x, z), far = dp > 140, w = 9 + tr() * 7, d = 9 + tr() * 7;
    const h = dp < 95 ? 14 + tr() * 18 : 18 + tr() * (far ? 40 : 30);
    const pal = PAL[Math.floor(tr() * PAL.length)];
    const g = tower(w, h, d, { rand: tr, color: pal[0], glass: pal[1], floor: far ? 4.2 : 3.4, litP: 0.55, crown: h > 44 && tr() < 0.5 });
    g.position.set(x, 0, z); g.children.forEach(c => { c.castShadow = dp < 160; c.receiveShadow = true; }); scene.add(g);
    stat.push([x - w / 2, x + w / 2, z - d / 2, z + d / 2, h + 4, 'tower']);
    if (dp > 50 && dp < 190 && z < 120) FRONTS.push([x + (tr() - .5) * w * 0.5, 6 + tr() * (h - 8), z + d / 2 + 3.2, dp]);
  }
}
for (const [x, z] of [[-52, 70], [-52, 52], [52, 70], [52, 52], [-30, 76], [30, 76], [-52, 20], [52, 20], [-14, 74], [14, 74]]) { const m = bushTree(6 + R() * 2, R); m.position.set(x, 0, z); scene.add(m); }
const lampHeads = new GB();
for (const z of [14, 30, 62, 74]) for (const s of [-1, 1]) { const l = lamp(6.2); l.position.set(s * 10, 0, z); l.rotation.y = s > 0 ? Math.PI : 0; scene.add(l); lampHeads.box(0.6, 0.12, 0.36, 0xFFFFFF, s * 10 - s * 1.25, 6.02, z); }
const lampM = new THREE.MeshLambertMaterial({ color: 0xFFF1C8, emissive: 0xFFD27A, emissiveIntensity: 0 }); scene.add(new THREE.Mesh(lampHeads.geo(), lampM));

// ───────────────────────── the tall tower
const tw = stackTower(); tw.position.set(TW[0], 0, TW[1]); tw.children.forEach(c => { c.castShadow = true; c.receiveShadow = true; }); scene.add(tw);
stat.push([TW[0] - 14, TW[0] + 14, TW[1] - 14, TW[1] + 14, tw.userData.h + 4, 'big tower']);

// ───────────────────────── the stock exchange and its board
const ex = bank(); ex.scale.setScalar(1.35); ex.position.set(EX[0], 0, EX[1]); ex.children.forEach(c => { c.castShadow = true; c.receiveShadow = true; }); scene.add(ex);
stat.push([EX[0] - 18, EX[0] + 18, EX[1] - 12, EX[1] + 16, 23, 'exchange']);
const exSign = new THREE.Mesh(new THREE.PlaneGeometry(20, 2.0), new THREE.MeshBasicMaterial({ map: signTex('STOCK EXCHANGE', '#E9E1CF', '#4A3A2A'), toneMapped: false }));
exSign.position.set(EX[0], ex.userData.signY * 1.35, EX[1] + ex.userData.signZ * 1.35 + 0.08); scene.add(exSign);
const BOARD = [EX[0], 31, EX[1] - 2];
{ const b = new GB(); b.box(0.8, 12, 0.8, 0x4A4E56, BOARD[0] - 12, 21, BOARD[2] - 0.6); b.box(0.8, 12, 0.8, 0x4A4E56, BOARD[0] + 12, 21, BOARD[2] - 0.6); b.box(27, 12.6, 0.8, 0x22262E, BOARD[0], BOARD[1], BOARD[2] - 0.5); scene.add(b.mesh()); }
const boardTex = (big, sub, col, pts) => textTex(1024, 448, (g, w, h) => { g.fillStyle = '#0B1220'; g.fillRect(0, 0, w, h); g.strokeStyle = 'rgba(255,255,255,0.10)'; g.lineWidth = 2; for (let i = 1; i < 6; i++) { g.beginPath(); g.moveTo(0, i * h / 6); g.lineTo(w, i * h / 6); g.stroke(); }
  g.strokeStyle = col; g.lineWidth = 14; g.lineJoin = 'round'; g.lineCap = 'round'; g.beginPath(); pts.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.stroke();
  g.fillStyle = '#fff'; g.font = '800 64px Figtree'; g.textAlign = 'left'; g.textBaseline = 'alphabetic'; g.fillText('TAIEX', 40, 86); g.fillStyle = col; g.font = '800 96px JBM'; g.textAlign = 'right'; g.fillText(big, w - 36, 104);
  g.fillStyle = 'rgba(255,255,255,0.75)'; g.font = '700 38px Inter'; g.textAlign = 'right'; g.fillText(sub, w - 40, 160); });
const bWeek = new THREE.MeshBasicMaterial({ map: boardTex('−17.5%', 'week to 20 Nov', '#FF5A4A', [[40, 200], [200, 230], [330, 214], [470, 290], [600, 270], [740, 350], [860, 340], [990, 420]]), toneMapped: false });
const bUp = new THREE.MeshBasicMaterial({ map: boardTex('+8.99%', 'Tue 24 Nov', '#FFC84A', [[40, 400], [300, 420], [560, 380], [700, 300], [990, 190]]), toneMapped: false });
const bDn = new THREE.MeshBasicMaterial({ map: boardTex('−4.8%', 'Wed 25 Nov', '#FF5A4A', [[40, 190], [300, 230], [520, 330], [700, 400], [840, 360], [990, 330]]), toneMapped: false });
const board = new THREE.Mesh(new THREE.PlaneGeometry(26, 11.4), bWeek); board.position.set(BOARD[0], BOARD[1], BOARD[2]); scene.add(board);

// ───────────────────────── the index line in the sky (TAIEX closes, drawn to scale): 6 Oct record -> 20 Nov low; then 24 Nov up, 25 Nov down
const Y = v => 10 + (v - 34000) * 0.0052;
const LZ = -150;
const LP = [[-120, 49823], [-98, 47600], [-80, 48700], [-60, 46100], [-42, 46900], [-22, 44300], [-6, 45200], [12, 43675], [28, 40195], [38, 38427], [48, 36033], [60, 36812], [74, 40122], [88, 38195]].map(([x, v]) => [x, Y(v), LZ]);
const NWEEK = 10;   // segments 0..9 are the slide to 20 Nov (on screen from the cover); 10 = Mon 23 Nov; 11 = Tue 24 Nov (+8.99%); 12 = Wed 25 Nov (-4.8%)
const segM = { dn: new THREE.MeshBasicMaterial({ color: 0xFF4A3A, toneMapped: false, fog: false }), up: new THREE.MeshBasicMaterial({ color: 0xFFC84A, toneMapped: false, fog: false }) };
const lineSegs = LP.slice(1).map((q, i) => { const p = LP[i], L = Math.hypot(q[0] - p[0], q[1] - p[1]), m = new THREE.Mesh(new THREE.BoxGeometry(1, 2.2, 2.2).translate(0.5, 0, 0), q[1] > p[1] ? segM.up : segM.dn); m.position.set(...p); m.rotation.z = Math.atan2(q[1] - p[1], q[0] - p[0]); m.userData = { L }; scene.add(m); return m; });
const dotG = new THREE.SphereGeometry(2.4, 12, 8), dotM = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, toneMapped: false, fog: false });
const tipDot = new THREE.Mesh(dotG, dotM); scene.add(tipDot);
const lineGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: radial('rgba(255,110,90,0.8)', 'rgba(255,110,90,0)'), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false, fog: false })); lineGlow.scale.set(40, 40, 1); scene.add(lineGlow);
const segShown = (i, t) => i < NWEEK ? 1 : i === 10 ? eio(seg(t, T.jumpA - 0.5, T.jumpA)) : i === 11 ? eio(seg(t, T.jumpA, T.jumpA + 0.7)) : eio(seg(t, T.plungeA, T.plungeA + 0.6));

// ───────────────────────── the glass columns: shares bought with borrowed money (grey = the broker's $60, amber = your $40)
const colGlassG = new THREE.BoxGeometry(CW, CH, CW), colFrameG = (() => { const b = new GB(), f = 0xE9E3D6; for (const sx of [-1, 1]) for (const sz of [-1, 1]) b.box(0.22, CH, 0.22, f, sx * CW / 2, CH / 2, sz * CW / 2); for (const y of [0, CH]) { b.box(CW + 0.22, 0.22, 0.22, f, 0, y, CW / 2); b.box(CW + 0.22, 0.22, 0.22, f, 0, y, -CW / 2); b.box(0.22, 0.22, CW + 0.22, f, CW / 2, y, 0); b.box(0.22, 0.22, CW + 0.22, f, -CW / 2, y, 0); } b.box(CW + 1.4, BASE, CW + 1.4, 0xD6CEBC, 0, BASE / 2 - CH * 0 - 0.0, 0); return b.geo(); })();
const loanM = new THREE.MeshLambertMaterial({ color: 0x8C96A8 }), ownM = new THREE.MeshLambertMaterial({ color: 0xF7B500, emissive: 0xA86A00, emissiveIntensity: 0.45 });
const fillG = new THREE.BoxGeometry(CW - 0.5, 1, CW - 0.5).translate(0, 0.5, 0);
const VALS = [75, 74, 100, 76, 73];   // the other investors' shares are already near the line when they appear
const COLS = COLX.map((x, i) => {
  const g = new THREE.Group(); g.position.set(x, 0, COLZ); scene.add(g);
  const fr = new THREE.Mesh(colFrameG, MAT); fr.castShadow = true; fr.receiveShadow = true; g.add(fr);
  const gl = new THREE.Mesh(colGlassG, GLASS_M); gl.position.y = BASE + CH / 2 - 0.4; gl.renderOrder = 2; g.add(gl);
  const loan = new THREE.Mesh(fillG, loanM), own = new THREE.Mesh(fillG, ownM); loan.castShadow = own.castShadow = true; g.add(loan, own);
  stat.push([x - CW / 2 - 0.7, x + CW / 2 + 0.7, COLZ - CW / 2 - 0.7, COLZ + CW / 2 + 0.7, CH + 1.5, 'column']);
  return { g, loan, own, v: VALS[i] };
});
const FY = v => BASE + FH * v / 100;   // fill top for a value
const lineM = new THREE.MeshBasicMaterial({ color: 0xFF4A3A, transparent: true, opacity: 0, toneMapped: false, depthWrite: false });
const callLine = new THREE.Mesh(new THREE.BoxGeometry(1, 0.34, 0.34), lineM); callLine.renderOrder = 4; scene.add(callLine);
const lineV = t => lerp(78, 72, eio(seg(t, T.lineDn, T.lineDn + 1.0)));
// the example's shares fly to the exchange when they are sold
const ghostM = new THREE.MeshBasicMaterial({ color: 0x5FA8D8, transparent: true, opacity: 0, depthWrite: false }); const ghost = new THREE.Mesh(fillG, ghostM); ghost.position.set(COLX[MAIN], BASE, COLZ); ghost.scale.y = FH; ghost.renderOrder = 3; scene.add(ghost);
const flyM = new THREE.Group(); scene.add(flyM); { const a = new THREE.Mesh(fillG, loanM), b = new THREE.Mesh(fillG, ownM); flyM.add(a, b); flyM.userData = { a, b }; } flyM.visible = false;

// ───────────────────────── the broker's desk
const desk = new GB(); desk.box(4.8, 0.2, 2.4, 0x8A6A4A, BR[0], 1.25, BR[1]); for (const [x, z] of [[-2.2, -1], [2.2, -1], [-2.2, 1], [2.2, 1]]) desk.box(0.16, 1.2, 0.16, 0x5A4A3A, BR[0] + x, 0.6, BR[1] + z); desk.box(1.4, 1.0, 0.1, 0x22262E, BR[0] + 1.9, 1.85, BR[1] - 0.5, 0, -0.5, 0);
desk.box(0.25, 4.6, 0.25, 0x5A5F68, BR[0] - 3.2, 2.3, BR[1] - 1.6); desk.box(0.25, 4.6, 0.25, 0x5A5F68, BR[0] + 3.2, 2.3, BR[1] - 1.6); scene.add(desk.mesh());
const brSign = new THREE.Mesh(new THREE.PlaneGeometry(5.2, 1.1), new THREE.MeshBasicMaterial({ map: signTex('BROKER', '#2F3A55', '#FFD27A', 512, 108, 72), toneMapped: false })); brSign.position.set(BR[0], 4.3, BR[1] - 1.5); scene.add(brSign);
stat.push([BR[0] - 3.6, BR[0] + 3.6, BR[1] - 2, BR[1] + 2.2, 5, 'desk']);
const phone = deskPhone(0xC8423A); phone.scale.setScalar(1.25); phone.position.set(BR[0] - 1.0, 1.35, BR[1] + 0.2); phone.rotation.y = -0.4; scene.add(phone);
const modern = (i, extra = {}) => ({ robe: [0x34405A, 0x6A2E3E, 0x3F6A5A, 0x5A5A66, 0x7A5A3A, 0x2F4A6A, 0x8A3A3A, 0x3B6FA8, 0xB0603A, 0x4E7A3E][i % 10], skin: SKIN[i % 5], short: [0x231C18, 0x5A3E28, 0xC9A27A, 0x3A2A1E, 0x8A8A8A][i % 5], shirt: i % 2 ? 0xF4F2EC : undefined, ...extra });
const broker = person(modern(3, { robe: 0x2B2F3A, shirt: 0xF4F2EC, tie: 0xC8423A, s: 1.3 })); broker.position.set(BR[0] + 0.2, 0, BR[1] - 1.5); broker.rotation.y = -Math.PI / 2; scene.add(broker);
// people on the plaza: investors looking at their phones
const WALK = []; for (let i = 0; i < 12; i++) { const rr = rng(40 + i), m = person(modern(i, { phone: i % 3 !== 1 })); m.scale.setScalar(1.25); scene.add(m); const x0 = (rr() - 0.5) * 70, z0 = 54 + rr() * 22; WALK.push({ m, x0, z0, sp: 0.6 + rr() * 0.6, ph: rr() * 6 }); }

// ───────────────────────── the chip fabs (east) and the storm over them
const FABS = [[FAB[0], FAB[1] - 14], [FAB[0], FAB[1] + 16]].map(([x, z], i) => { const f = factory(24, 16, 8); f.position.set(x, 0, z); f.rotation.y = -Math.PI / 2; f.castShadow = true; f.receiveShadow = true; scene.add(f); stat.push([x - 9, x + 9, z - 13, z + 13, 20, 'fab']);
  const ch = new THREE.Mesh(CHIP, MAT); ch.scale.setScalar(7); ch.position.set(x - 1, 10.6, z); ch.castShadow = true; scene.add(ch); return { ch, x, z }; });
const fabSign = new THREE.Mesh(new THREE.PlaneGeometry(14, 2.0), new THREE.MeshBasicMaterial({ map: signTex('AI CHIPS', '#1F3B2E', '#BFF5D8', 768, 120, 78), toneMapped: false })); fabSign.position.set(FAB[0] - 13.2, 5.6, FAB[1] + 1); fabSign.rotation.y = -Math.PI / 2; scene.add(fabSign);
const stormG = new THREE.Group(); stormG.position.set(FAB[0] - 2, 34, FAB[1]); scene.add(stormG);
const stormM = new THREE.MeshLambertMaterial({ color: 0x4A4A58, transparent: true, opacity: 0, depthWrite: false });
for (let i = 0; i < 10; i++) { const rr = rng(610 + i), m = new THREE.Mesh(new THREE.IcosahedronGeometry(4.4 + rr() * 2.6, 1), stormM); m.position.set((rr() - .5) * 10, (rr() - .5) * 3, -20 + i * 4.4 + (rr() - .5) * 2); m.scale.set(1, 0.65, 1.3); stormG.add(m); }
const boltM = new THREE.MeshBasicMaterial({ color: 0xFFF2B0, transparent: true, opacity: 0, toneMapped: false, depthWrite: false });
const bolt = (() => { const b = new GB(); const pts = [[0, 0], [-1.4, -4], [0.6, -4.4], [-1.0, -9], [1.2, -8.6], [-0.4, -14]]; for (let i = 1; i < pts.length; i++) { const [x0, y0] = pts[i - 1], [x1, y1] = pts[i]; const L = Math.hypot(x1 - x0, y1 - y0); b.add(new THREE.BoxGeometry(0.6, L, 0.6), 0xFFFFFF, new THREE.Matrix4().makeTranslation((x0 + x1) / 2, (y0 + y1) / 2, 0).multiply(new THREE.Matrix4().makeRotationZ(Math.atan2(x1 - x0, y0 - y1) * -1))); } return new THREE.Mesh(b.geo(), boltM); })();
bolt.position.set(FAB[0] - 4, 31, FAB[1] - 4); bolt.rotation.y = -Math.PI / 2; bolt.scale.setScalar(1.4); scene.add(bolt);

// ───────────────────────── the loop: forced sales -> prices down -> more calls
const loopG = new THREE.Group(); loopG.position.set(...LOOP); scene.add(loopG);
const loopM = new THREE.MeshBasicMaterial({ color: 0xFF6A4A, transparent: true, opacity: 0, toneMapped: false, depthWrite: false });
for (let k = 0; k < 3; k++) { const arc = new THREE.Mesh(new THREE.TorusGeometry(9, 0.75, 8, 28, Math.PI * 2 / 3 - 0.5), loopM); arc.rotation.z = k * Math.PI * 2 / 3; loopG.add(arc);
  const head = new THREE.Mesh(new THREE.ConeGeometry(1.8, 3.4, 10), loopM); const a = k * Math.PI * 2 / 3 + Math.PI * 2 / 3 - 0.5; head.position.set(Math.cos(a) * 9, Math.sin(a) * 9, 0); head.rotation.z = a; loopG.add(head); }

// ───────────────────────── phones ringing over the city (calls); grey with a cross once cancelled
const phoneTex = (bg, cancel) => textTex(160, 160, (g) => { g.fillStyle = bg; g.beginPath(); g.arc(80, 80, 72, 0, Math.PI * 2); g.fill(); g.strokeStyle = 'rgba(255,255,255,0.9)'; g.lineWidth = 5; g.stroke();
  g.save(); g.translate(76, 84); g.rotate(-0.75); g.fillStyle = '#fff'; g.beginPath(); g.roundRect(-34, -9, 68, 18, 8); g.fill(); g.beginPath(); g.roundRect(-38, -6, 22, 30, 7); g.fill(); g.beginPath(); g.roundRect(16, -6, 22, 30, 7); g.fill(); g.restore();
  if (cancel) { g.strokeStyle = '#FF5A4A'; g.lineWidth = 14; g.lineCap = 'round'; g.beginPath(); g.moveTo(40, 40); g.lineTo(120, 120); g.moveTo(120, 40); g.lineTo(40, 120); g.stroke(); }
  else { g.strokeStyle = '#fff'; g.lineWidth = 7; g.lineCap = 'round'; for (const r of [18, 32]) { g.beginPath(); g.arc(108, 50, r, -1.3, 0.1); g.stroke(); } } });
const phRing = phoneTex('#E0453A', false), phOff = phoneTex('#6A7080', true);
const PHONES = [];
{ const pr = rng(919), fr = FRONTS.slice().sort((a, b) => a[3] - b[3]);
  const pick = n => { const out = []; for (let i = 0; i < n && fr.length; i++) out.push(fr.splice(Math.floor(pr() * Math.min(fr.length, 60)), 1)[0]); return out; };
  const pickIn = n => { const out = []; for (let i = 0; i < n; i++) { const c = fr.map((f, j) => [f, j]).filter(([f]) => Math.abs(f[0]) < 80 && f[2] < 20); if (!c.length) break; const [f, j] = c[Math.floor(pr() * Math.min(c.length, 40))]; out.push(f); fr.splice(j, 1); } return out; };
  pick(14).forEach((p, i) => PHONES.push({ p, t0: -1 + i * 0.03, t1: T.ringB + i * 0.01, wave: 1 }));
  pick(30).forEach((p, i) => PHONES.push({ p, t0: T.ringA + i * 0.04, t1: T.ringB + i * 0.01, wave: 1 }));
  pickIn(34).forEach((p, i) => PHONES.push({ p, t0: T.wave2 + i * 0.025, t1: null, wave: 2 }));
  pick(20).forEach((p, i) => PHONES.push({ p, t0: T.wave2 + 0.1 + i * 0.03, t1: null, wave: 2 }));
  pick(36).forEach((p, i) => PHONES.push({ p, t0: T.wave3 + i * 0.02, t1: null, wave: 3 }));
  COLX.forEach((x, i) => { if (i !== MAIN) PHONES.push({ p: [x, CH + 2.6, COLZ, 0], t0: T.rowA + 0.9 + i * 0.08, t1: null, wave: 4 }); });
  PHONES.push({ p: [COLX[MAIN] + CW / 2 + 2.0, FY(100) - 0.2, COLZ + 1.0, 0], t0: T.callA, t1: T.flyA + 0.5, wave: 0 }); }
PHONES.forEach(ph => { const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: phRing, transparent: true, depthWrite: false, depthTest: true, toneMapped: false, fog: false })); sp.renderOrder = 6; sp.visible = false; scene.add(sp); ph.sp = sp; ph.big = ph.wave === 0 ? 2.8 : ph.wave === 4 ? 3.0 : 6.5 + ph.p[3] * 0.035; });
const phoneOn = (ph, t) => { if (t < ph.t0) return 0; const offT = ph.t1 ?? (T.cancelA + (ph.wave === 4 ? 0.15 : 0.02 * (PHONES.indexOf(ph) % 30))); return t < offT ? 1 : t < offT + 0.9 ? 2 : 0; };

// ───────────────────────── fireworks (the record up day) and street life
const sparkT = (() => { const cv = document.createElement('canvas'); cv.width = cv.height = 64; const g = cv.getContext('2d'); g.translate(32, 32); g.fillStyle = '#fff'; for (let k = 0; k < 2; k++) { g.rotate(Math.PI / 2 * k); g.beginPath(); g.moveTo(0, -30); g.quadraticCurveTo(3, -3, 30, 0); g.quadraticCurveTo(3, 3, 0, 30); g.quadraticCurveTo(-3, 3, -30, 0); g.quadraticCurveTo(-3, -3, 0, -30); g.fill(); } const tx = new THREE.CanvasTexture(cv); tx.colorSpace = THREE.SRGBColorSpace; return tx; })();
const BURSTS = [[36, 92, LZ + 24, 0], [74, 104, LZ + 20, 0.3], [14, 110, LZ + 26, 0.6], [92, 84, LZ + 24, 0.9], [52, 120, LZ + 22, 1.25]];
const FW = []; BURSTS.forEach(([x, y, z, d], j) => { for (let k = 0; k < 22; k++) { const a = k / 22 * Math.PI * 2, e = (k % 2 ? 0.35 : -0.25); const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: sparkT, color: [0xFFD27A, 0xFF9A7A, 0xFFF2C0, 0x9BE0F0, 0xFFC84A][j], transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false, fog: false })); sp.visible = false; scene.add(sp); FW.push({ sp, c: [x, y, z], dir: [Math.cos(a) * Math.cos(e), Math.sin(e) + Math.sin(a) * 0.7, Math.sin(a) * 0.4], t0: T.nine + d }); } });
const CARS = [[0xC8423A, 84, 1, 8, 0], [0x2F6FB8, 84, -1, 9, 40], [0xE9C46A, -52, 1, 7, 150], [0x4C9A62, -52, -1, 8, 230], [0xEDEDED, 84, 1, 8.6, 300], [0x7A4FA0, -52, -1, 7, 90]].map(([col, z, dir, v, off]) => { const m = car(col, { boxy: true }); scene.add(m); return { m, z: z + dir * 2, dir, v, off }; });
const clouds = []; for (let i = 0; i < 16; i++) { const m = cloud(R); const far = i >= 9; m.position.set(far ? -500 + R() * 1000 : -240 + i * 56 + R() * 20, 150 + R() * 40, far ? -560 + R() * 160 : -330 + R() * 260); m.scale.setScalar(2.0 + R() * 2.2); m.userData.x0 = m.position.x; scene.add(m); clouds.push(m); }
const sparks = []; for (let i = 0; i < 40; i++) { const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: sparkT, color: 0xFFE9A8, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false })); sp.userData = { ph: R() * 6.28, w: 3 + R() * 4, k: R() }; scene.add(sp); sparks.push(sp); }

// ───────────────────────── camera path (spherical keys around a target; `up` tilts the view so the subject sits lower in the frame)
const MC = [COLX[MAIN], 0, COLZ];
const CAM = [
  { t: 0, tg: [-10, 34, -40], d: 215, az: 6, el: 10, up: 0.1 },                                         // the cover: the city at sunset, the tower, the exchange, the red line in the sky
  { t: T.bigOut, tg: [-9, 34, -42], d: 206, az: 5, el: 10, up: 0.1, mv: 1 },
  { t: T.week1 + 0.4, tg: [6, 40, -70], d: 210, az: 2, el: 6, up: 0.08, mv: 1 },                      // the line: the worst week
  { t: T.thousands + 0.3, tg: [0, 30, 10], d: 175, az: -6, el: 22, up: 0.0, mv: 1 },                     // up over the city: phones ringing in the windows
  { t: T.calling, tg: [0, 28, 10], d: 166, az: -10, el: 24, up: 0.0 },
  { t: T.broker4 + 0.25, tg: [BR[0], 3.0, BR[1] - 0.8], d: 17.5, az: 10, el: 11, up: 0.0, mv: 1 },   // swoop down to the broker's desk
  { t: T.b5 + 0.1, tg: [BR[0], 3.0, BR[1] - 0.8], d: 16.5, az: 4, el: 11, up: 0.0 },
  { t: T.many + 0.3, tg: [MC[0], 8.5, MC[2]], d: 36, az: 8, el: 9, up: -0.02, mv: 1 },             // the example column
  { t: T.sixty + 0.5, tg: [MC[0], 8.5, MC[2]], d: 35, az: 4, el: 9, up: -0.02 },
  { t: T.fifth + 0.4, tg: [MC[0], 8.5, MC[2]], d: 34, az: -4, el: 10, up: -0.02, mv: 1 },
  { t: T.days + 0.2, tg: [MC[0], 9, MC[2]], d: 35, az: -8, el: 11, up: -0.02 },
  { t: T.you7 + 0.5, tg: [MC[0] + 6, 10, MC[2] - 22], d: 74, az: -10, el: 12, up: -0.02, mv: 1 },       // pull back: the shares fly to the exchange
  { t: T.b8 + 0.3, tg: [40, 40, 20], d: 120, az: -30, el: 22, up: 0, mv: 1 },                           // lift over the roofs toward the fabs
  { t: T.fears + 0.3, tg: [FAB[0] - 4, 10, FAB[1]], d: 82, az: -62, el: 12, up: 0.02, mv: 1 },         // the chip fabs under the storm
  { t: T.chip + 0.3, tg: [FAB[0] - 4, 10, FAB[1]], d: 77, az: -65, el: 12, up: 0.02 },
  { t: T.calls8 + 0.2, tg: [6, 24, 10], d: 175, az: -12, el: 16, up: 0.0, mv: 1 },
  { t: T.forced - 0.05, tg: [6, 24, 8], d: 168, az: -10, el: 16, up: 0.0 },                        // the whole city: calls everywhere
  { t: T.pushed + 0.45, tg: [LOOP[0], LOOP[1] - 3, LOOP[2]], d: 78, az: 0, el: 6, up: 0.0, mv: 1 },        // the loop over the plaza
  { t: T.lower9b + 0.1, tg: [LOOP[0], LOOP[1] - 3, LOOP[2]], d: 74, az: 4, el: 7, up: 0.0 },
  { t: T.calls9 + 0.4, tg: [-20, 8, COLZ], d: 64, az: 50, el: 13, up: -0.02, mv: 1 },                    // the row of columns, phones above them
  { t: T.moved + 0.2, tg: [-20, 8, COLZ], d: 61, az: 47, el: 13, up: -0.02 },
  { t: T.sent10 + 0.4, tg: [-20, 8, COLZ], d: 58, az: 43, el: 13, up: -0.02 },
  { t: T.founder + 0.4, tg: [40, 60, LZ], d: 260, az: 4, el: 4, up: 0.04, mv: 1 },                     // the line in the sky: the jump, fireworks
  { t: T.nine + 0.6, tg: [48, 62, LZ], d: 250, az: 2, el: 4, up: 0.04 },
  { t: T.plunged + 0.4, tg: [70, 56, LZ], d: 230, az: -2, el: 4, up: 0.03, mv: 1 },                    // the plunge
  { t: T.yet + 0.4, tg: [60, 54, LZ], d: 236, az: -4, el: 4, up: 0.03 },
  { t: T.story + 0.7, tg: [-10, 34, -40], d: 212, az: 8, el: 10, up: 0.02, mv: 1 },                      // wide again: the title
  { t: T.cta - 0.3, tg: [-10, 34, -38], d: 204, az: 6, el: 10, up: 0.02 },
  { t: T.cta + 0.7, tg: [-2, 16, 8], d: 120, az: 12, el: 28, up: 0.0, mv: 1 },
  { t: T.comment + 0.1, tg: [4, 5, 42], d: 50, az: 20, el: 15, up: 0.02, mv: 1 },  // the broker's phone (the comment boxes go below it)
  { t: DUR + 0.5, tg: [4, 5, 42], d: 46, az: 14, el: 15, up: 0.02 },
];
if (QP.get('c0')) { const o = JSON.parse(QP.get('c0')); Object.assign(CAM[0], o); Object.assign(CAM[1], o, { t: T.bigOut, mv: 1 }); }
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
.tag.dn{color:#fff;background:#D9483B;border-color:#D9483B;} .tag.dn b{color:#fff;} .tag.ln{color:#fff;background:#24324A;border-color:#FF5A4A;} .tag.ln b{color:#FF8A7A;} .tag.ok{color:#08231A;background:#3FD08A;border-color:#3FD08A;} .tag.ok b{color:#08231A;} .tag.loan{color:#fff;background:#5E6878;border-color:#8C96A8;} .tag.loan b{color:#fff;}
.stamp{font:900 64px/1 'Figtree',sans-serif;letter-spacing:.06em;color:#FF5A4A;border:6px solid #FF5A4A;padding:8px 22px 6px;border-radius:14px;background:rgba(40,6,4,.35);text-shadow:0 0 18px rgba(255,90,70,.6);}
.stamp.ok{color:#3FD08A;border-color:#3FD08A;background:rgba(4,30,16,.4);text-shadow:0 0 18px rgba(63,208,138,.6);}
.stamp.am{color:#FFC84A;border-color:#FFC84A;background:rgba(40,26,4,.4);text-shadow:0 0 18px rgba(247,166,0,.6);}
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
const HK = TIM.hook, hookEl = HK ? mk('hook', `<div class="n">${HK.lines.map(l => l.replace(/\*([^*]+)\*/g, '<em>$1</em>')).join('\n')}</div>` + (HK.sub ? `<div class="s">${HK.sub}</div>` : '')) : null;
function fitHook() { if (!hookEl) return; const n = hookEl.querySelector('.n'), w = n.scrollWidth; if (w > 940) n.style.fontSize = (112 * 940 / w).toFixed(1) + 'px'; if (bigEl) { const v = bigEl.querySelector('.v'), bw = v.scrollWidth; if (bw > 960) v.style.fontSize = (172 * 960 / bw).toFixed(1) + 'px'; } }
const BG = TIM.big, bigBg = BG ? mk('bigbg', '') : null, bigEl = BG ? mk('big' + (/^[^\d]*[−-]/.test(BG.value) || BG.dir === 'down' ? '' : ' up'), '') : null, BIGN = {};
if (BG) { const m = BG.value.match(/^([^\d]*)(\d[\d,]*(?:\.\d+)?)(.*)$/) || ['', '', '0', BG.value]; Object.assign(BIGN, { pre: m[1], num: parseFloat(m[2].replace(/,/g, '')), dec: (m[2].split('.')[1] || '').length, comma: m[2].includes(','), post: m[3] });
  const down = !bigEl.classList.contains('up'), pts = (down ? [[0, 20], [90, 34], [160, 18], [240, 60], [320, 48], [420, 100], [520, 86], [620, 140], [760, 160]] : [[0, 160], [90, 140], [170, 150], [260, 104], [350, 116], [450, 66], [540, 80], [640, 30], [760, 12]]);
  BIGN.len = pts.slice(1).reduce((a, q, i) => a + Math.hypot(q[0] - pts[i][0], q[1] - pts[i][1]), 0);
  bigEl.innerHTML = `<svg width="760" height="170" viewBox="0 0 760 170"><polyline points="${pts.map(q => q.join(',')).join(' ')}" stroke-dasharray="${BIGN.len.toFixed(1)}"/></svg><div class="v"></div><div class="l">${BG.label || ''}</div>` + (BG.when ? `<div class="d">${BG.when}</div>` : '');
  BIGN.line = bigEl.querySelector('polyline'); BIGN.v = bigEl.querySelector('.v'); }
const bigText = u => { const x = BIGN.num * u; let n = x.toFixed(BIGN.dec); if (BIGN.comma) n = Number(n).toLocaleString('en-US', { minimumFractionDigits: BIGN.dec, maximumFractionDigits: BIGN.dec }); const unit = BIGN.post.trim(); return BIGN.pre + n + (unit ? (/^[A-Za-z]/.test(unit) ? `<small>${unit}</small>` : BIGN.post) : ''); };
const chip = mk('chip', '');
const cardWeek = mk('card', `Taiwan's main index: <s>−17.5%</s> in five days\nits worst week in more than 30 years\n<small>Reuters · Bloomberg · TWSE via CNA · 20 Nov 2026</small>`);
const tagRec = mk('tag am', '6 Oct · record'), tagLow = mk('tag dn', '20 Nov <b>−17.5%</b> in a week');
const tagBroker = mk('tag am', 'the <b>broker</b> calling');
const tagOwn = mk('tag am', 'yours <b>$40</b>'), tagLoan = mk('tag loan', 'borrowed <b>$60</b>'), tagFull = mk('tag', 'shares <b>$100</b>');
const tagLine = mk('tag ln', 'the call line <b>$78</b>'), tagLeft = mk('tag am', 'yours now <b>$18</b>');
const stampCall = mk('stamp', 'MARGIN CALL'), tagDays = mk('tag am', 'pay more within <b>2</b> days'), stampSold = mk('stamp', 'SOLD FOR YOU');
const cardRule = mk('card', `In Taiwan: buy listed shares with <em>40%</em> of your own,\nthe broker lends <u>60%</u>; at <s>78%</s> of the price it calls\n<small>TWSE rules · StockFeel · Pocket · Business Weekly</small>`);
const tagAI = mk('tag dn', 'AI fears <b>↓</b> chip stocks');
const tagL1 = mk('tag dn', 'forced sales'), tagL2 = mk('tag dn', 'prices <b>↓</b>'), tagL3 = mk('tag dn', 'more calls');
const cardRecord = mk('card', `Fri 20 Nov: <s>6,462</s> accounts got a margin call, a record\nforced sales hit a record too\n<small>TWSE data via BigGo, TVBS, LTN · Bloomberg · 2026</small>`);
const tagNew = mk('tag ok', 'new call line <b>$72</b> · from 24 Nov'), stampCancel = mk('stamp ok', 'CALLS CANCELLED');
const cardMove = mk('card', `From Tue 24 Nov the call comes at <em>120%</em>, not 130%\ncalls sent before 24 Nov were cancelled\n<small>Taiwan Stock Exchange via CNA, UDN · FSC · 2026</small>`);
const tagNv = mk('tag am', 'Nvidia takes its founder back <b>·</b> 23 Nov');
const stampUp = mk('stamp am', '+8.99%'), tagUp = mk('tag am', 'Tue 24 Nov <b>·</b> biggest point gain on record');
const stampDn = mk('stamp', '−4.8%'), tagDn = mk('tag dn', 'Wed 25 Nov <b>·</b> down 8.6% at one point');
const title = mk('title', '<div class="s">THE STORY OF</div><div class="n">The Call\n<em>Nobody Wants</em></div>');
const lesson = mk('lesson', `Borrowed money can pick <em>when you sell</em>.`);
const ctaChip = mk('chip am', 'what would you do?');
const boxes = [0, 1].map(() => { const e = mk('cbox', '<span class="in"></span><span class="post">Post</span>'); return { e, inn: e.querySelector('.in'), post: e.querySelector('.post') }; });
const foot = document.getElementById('foot');
foot.textContent = "Sources: TWSE via CNA, Next Apple, TVBS · Reuters · Bloomberg · UDN, NOWnews (Nov 2026)\n$760bn: NT$24.97tn lost by the main board 13–20 Nov, at NT$32.94 per US$ · not advice";
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
  // the chip: where and when we are
  let ct = '', co = 0, cp = 0;
  const CH = [[T.bigOut + 0.05, T.b2 - 0.1, 'Taiwan · week to 20 Nov 2026'], [T.b2 + 0.05, T.b3 - 0.1, "Taiwan's stock market · Nov 2026"], [T.b3 + 0.05, T.b5 - 0.1, 'the margin call'],
    [T.b5 + 0.05, T.b8 - 0.1, 'how buying on margin works'], [T.b8 + 0.05, T.b9 - 0.1, 'the AI chip sell-off · Nov 2026'], [T.b9 + 0.05, T.b10 - 0.1, 'Fri 20 Nov 2026'], [T.b10 + 0.05, T.b11 - 0.1, 'from Tue 24 Nov 2026'],
    [T.b11 + 0.05, T.b12 - 0.1, 'Tue 24 Nov 2026'], [T.b12 + 0.05, T.b13 - 0.1, 'Wed 25 Nov 2026'], [T.b13 + 0.05, T.b14 - 0.1, 'as of 25 Nov 2026']];
  for (const [a, b, s] of CH) { const o = win(t, a, b, 0.22, 0.22); if (o > co) { co = o; ct = s; cp = pop(t, a); } }
  if (ct) setTxt(chip, ct); put(chip, W / 2, 472, co, cp);
  // 1-2 — the line: the record, the low; the worst week
  { const p = p3([LP[0][0] + 6, LP[0][1] + 8, LZ], win(t, T.bigOut + 0.1, T.thousands, 0.25, 0.25)); put(tagRec, clampX(p[0], 170), clampY(p[1], 560, 1300), p[2], pop(t, T.bigOut + 0.1)); }
  { const q = LP[NWEEK], p = p3([q[0], q[1] - 10, LZ], win(t, T.bigOut + 0.3, T.thousands, 0.25, 0.25)); put(tagLow, clampX(p[0], 250), clampY(p[1], 560, 1300), p[2], pop(t, T.bigOut + 0.3)); }
  put(cardWeek, W / 2, 1380, win(t, T.worst, T.thousands + 0.2, 0.25, 0.25), pop(t, T.worst));
  // 3-4 — the broker
  { const p = p3([BR[0] - 0.6, 5.6, BR[1] - 1.6], win(t, T.broker4, T.b5 + 0.4, 0.2, 0.25)); put(tagBroker, clampX(p[0], 220), clampY(p[1], 600, 1250), 0, 1); }
  // 5-7 — the example column
  const mc = COLS[MAIN], vNow = exVal(t), own0 = FY(60), ownTop = FY(vNow);
  { const p = p3([MC[0] + CW / 2 + 1.0, (own0 + ownTop) / 2, MC[2]], win(t, T.forty, T.b6 + 0.1, 0.2, 0.25)); put(tagOwn, clampX(p[0] + 90, 200), clampY(p[1], 600, 1300), p[2], pop(t, T.forty)); }
  { const p = p3([MC[0] + CW / 2 + 1.0, (BASE + own0) / 2, MC[2]], win(t, T.sixty - 0.15, T.b7, 0.2, 0.25)); put(tagLoan, clampX(p[0] + 110, 200), clampY(p[1], 600, 1350), p[2], pop(t, T.sixty - 0.15)); }
  { const p = p3([MC[0] - CW / 2 - 1.0, FY(100), MC[2]], win(t, T.many + 0.3, T.lose, 0.2, 0.25)); put(tagFull, clampX(p[0] - 100, 200), clampY(p[1], 600, 1300), p[2], pop(t, T.many + 0.3)); }
  { const p = p3([MC[0] - CW / 2 - 1.0, FY(78), MC[2]], win(t, T.lose + 0.1, T.flyA, 0.2, 0.25)); put(tagLine, clampX(p[0] - 120, 220), clampY(p[1], 600, 1300), p[2], pop(t, T.lose + 0.1)); }
  { const p = p3([MC[0] + CW / 2 + 1.0, (own0 + ownTop) / 2 + 0.6, MC[2]], win(t, T.dropA + 0.9, T.flyA, 0.2, 0.25)); put(tagLeft, clampX(p[0] + 120, 200), clampY(p[1], 600, 1300), p[2], pop(t, T.dropA + 0.9)); }
  put(stampCall, W / 2, 1240, win(t, T.callA, T.b7 + 0.2, 0.12, 0.25), pop(t, T.callA, 0.25)); stampCall.style.rotate = '-6deg';
  put(tagDays, W / 2, 1360, win(t, T.two, T.sells, 0.2, 0.2), pop(t, T.two));
  put(stampSold, W / 2, 1280, win(t, T.sells + 0.1, T.b8 - 0.05, 0.12, 0.25), pop(t, T.sells + 0.1, 0.25)); stampSold.style.rotate = '-5deg';
  put(cardRule, W / 2, 1400, win(t, T.borrowed5, T.lose - 0.2, 0.25, 0.25), pop(t, T.borrowed5));
  // 8-9 — AI fears; the loop; the record
  { const p = p3([FAB[0] - 6, 32, FAB[1]], win(t, T.fears, T.calls8, 0.2, 0.25)); put(tagAI, clampX(p[0], 250), clampY(p[1], 620, 1200), p[2], pop(t, T.fears)); }
  { const L = [tagL1, tagL2, tagL3], tA = [T.forced, T.lower9, T.more9]; for (let k = 0; k < 3; k++) { const a = k * Math.PI * 2 / 3 + Math.PI / 3 + loopG.rotation.z, v = new THREE.Vector3(Math.cos(a) * 12.5, Math.sin(a) * 12.5, 0).applyEuler(loopG.rotation.clone().set(loopG.rotation.x, loopG.rotation.y, 0)).add(loopG.position), p = p3([v.x, v.y, v.z], win(t, tA[k], T.b10 + 0.1, 0.2, 0.25)); put(L[k], clampX(p[0], 170), clampY(p[1], 600, 1250), p[2], pop(t, tA[k])); } }
  put(cardRecord, W / 2, 1400, win(t, T.calls9 - 0.3, T.moved - 0.45, 0.25, 0.25), pop(t, T.calls9 - 0.3));
  // 10 — the line moves down; calls cancelled
  { const p = p3([COLX[4] + CW / 2 + 1, FY(lineV(t)), COLZ], win(t, T.line10, T.b11 - 0.1, 0.2, 0.25)); put(tagNew, clampX(p[0] + 60, 260), clampY(p[1] + 70, 600, 1250), p[2], pop(t, T.line10)); }
  put(stampCancel, W / 2, 1180, win(t, T.cancelled + 0.1, T.b11 - 0.1, 0.12, 0.25), pop(t, T.cancelled + 0.1, 0.25)); stampCancel.style.rotate = '-5deg';
  put(cardMove, W / 2, 1400, win(t, T.moved - 0.1, T.b11 - 0.1, 0.25, 0.25), pop(t, T.moved - 0.1));
  // 11-13 — the jump and the plunge
  put(tagNv, W / 2, 640, win(t, T.nvidia, T.jumped, 0.2, 0.25), pop(t, T.nvidia));
  { const q = LP[12], p = p3([q[0], q[1] + 14, LZ], win(t, T.nine, T.b12, 0.12, 0.25)); put(stampUp, clampX(p[0], 220), clampY(p[1], 620, 1250), p[2], pop(t, T.nine, 0.25)); }
  put(tagUp, W / 2, 1380, win(t, T.nine, T.b12, 0.2, 0.25), pop(t, T.nine));
  { const q = LP[13], p = p3([q[0], q[1] - 14, LZ], win(t, T.plunged + 0.2, T.b14 - 0.1, 0.12, 0.25)); put(stampDn, clampX(p[0], 220), clampY(p[1], 620, 1300), p[2], pop(t, T.plunged + 0.2, 0.25)); }
  put(tagDn, W / 2, 1380, win(t, T.plunged + 0.2, T.b14 - 0.1, 0.2, 0.25), pop(t, T.plunged + 0.2));
  // 14 — title and lesson; 15 — the question
  put(title, W / 2, 640, win(t, T.story, T.cta - 0.1, 0.4, 0.3), 0.94 + 0.06 * eo(seg(t, T.story, T.story + 0.6)));
  put(lesson, W / 2, 1180, win(t, T.borrowed14, T.cta - 0.15, 0.3, 0.25), pop(t, T.borrowed14));
  put(ctaChip, W / 2, 472, seg(t, T.pay15, T.pay15 + 0.3), pop(t, T.pay15));
  [[T.payK, 'PAY', T.postA], [T.sellK, 'SELL', T.postB]].forEach(([t0, word, tp], i) => {
    const bx = boxes[i], L = word.length, n = Math.min(L, Math.floor(c01((t - t0) / (0.12 * L)) * (L + 0.001))), typed = word.slice(0, n), caret = (n < L || Math.floor(t * 2.4) % 2) && t < tp ? '<i></i>' : '';
    setHTML(bx.inn, typed ? `<b>${typed}</b>${caret}` : `<em>Add a comment…</em>${caret}`); const sent = t > tp; const pc = sent ? 'post on sent' : n === L ? 'post on' : 'post'; if (bx.post.className !== pc) bx.post.className = pc; setTxt(bx.post, sent ? 'Posted ✓' : 'Post');
    const ts = i ? T.sellK - 0.35 : T.comment; put(bx.e, W / 2, 1330 + i * 132, seg(t, ts, ts + 0.3), pop(t, ts) * (1 + 0.06 * win(t, tp, tp + 0.3, 0.08, 0.2)));
  });
}

// ───────────────────────── the example's value over time: $100 (bought) -> $78 (about a fifth lower) -> sold
function exVal(t) { return lerp(100, 78, eio(seg(t, T.dropA, T.dropA + 1.0))); }

// ───────────────────────── one frame
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
  tw.userData.ring.emissiveIntensity = 0.25 + night * 1.2;
  // the line in the sky: the slide (from the cover), the jump on Tuesday, the plunge on Wednesday; a white dot rides the tip
  { let tip = LP[0]; lineSegs.forEach((m, i) => { const k = segShown(i, t); m.visible = k > 0.001; m.scale.set(Math.max(0.001, k * m.userData.L), 1 + 0.25 * Math.sin(t * 3 + i), 1 + 0.25 * Math.sin(t * 3 + i)); if (k > 0.001) { const p = LP[i], q = LP[i + 1]; tip = [lerp(p[0], q[0], k), lerp(p[1], q[1], k), LZ]; } });
    tipDot.position.set(...tip); tipDot.scale.setScalar(1 + 0.15 * Math.sin(t * 8)); lineGlow.position.set(tip[0], tip[1], tip[2] + 1); const upNow = t > T.jumpA && t < T.plungeA; lineGlow.material.color.setHex(upNow ? 0xFFD27A : 0xFF7A6A); }
  board.material = t > T.plungeA ? bDn : t > T.jumpA ? bUp : bWeek;
  // the example column: your $40 drops in, the broker's $60 slides under it; the value falls to $78; then the shares fly to the exchange
  COLS.forEach((c, i) => {
    let loanH, ownH, vis = 1;
    if (i === MAIN) { const own = back(seg(t, T.ownA, T.ownA + 0.45)), loan = eio(seg(t, T.loanA, T.loanA + 0.6)), v = exVal(t), gone = t > T.flyA;
      loanH = FH * 0.6 * loan; ownH = FH * Math.max(0, (v - 60)) / 100 * (own > 0.01 ? Math.min(1, own) : 0); if (gone) { loanH = ownH = 0; } c.own.position.y = BASE + loanH + (1 - Math.min(1, own)) * 8; }
    else { const up = eo(seg(t, T.rowA + i * 0.08, T.rowA + 0.7 + i * 0.08)); vis = up; loanH = FH * 0.6; ownH = FH * (c.v - 60) / 100; c.own.position.y = BASE + loanH; c.g.position.y = -(CH + 2) * (1 - up); }
    c.g.visible = vis > 0.001 || i === MAIN; c.loan.scale.y = Math.max(0.001, loanH); c.loan.position.y = BASE; c.own.scale.y = Math.max(0.001, ownH); c.loan.visible = loanH > 0.01; c.own.visible = ownH > 0.01;
  });
  { const o = Math.max(win(t, T.lose + 0.05, T.flyA + 0.4, 0.2, 0.3), win(t, T.rowA + 0.5, T.b11 - 0.1, 0.3, 0.3)), wide = seg(t, T.rowA, T.rowA + 0.8), x0 = lerp(COLX[MAIN] - CW / 2 - 0.8, COLX[0] - CW / 2 - 0.8, wide), x1 = lerp(COLX[MAIN] + CW / 2 + 0.8, COLX[4] + CW / 2 + 0.8, wide);
    lineM.opacity = o * (0.75 + 0.25 * Math.sin(t * 9)); callLine.visible = o > 0.01; callLine.scale.x = x1 - x0; callLine.position.set((x0 + x1) / 2, FY(lineV(t)), COLZ + CW / 2 + 0.35); lineM.color.setHex(t > T.lineDn + 0.6 ? 0x3FD08A : 0xFF4A3A); }
  { const u = seg(t, T.flyA, T.flyA + 1.3); flyM.visible = t > T.flyA && u < 1; if (flyM.visible) { const e = [EX[0], 12, EX[1] + 14], a = flyM.userData.a, b = flyM.userData.b; flyM.position.set(lerp(MC[0], e[0], eio(u)), BASE + Math.sin(u * Math.PI) * 14 + lerp(0, e[1] - BASE, u), lerp(MC[2], e[2], eio(u))); flyM.scale.setScalar(1 - 0.75 * u); flyM.rotation.y = u * 3;
      a.scale.y = FH * 0.6; b.scale.y = FH * 0.18; b.position.y = FH * 0.6; } }
  { const o = win(t, T.many + 0.2, T.lends + 0.5, 0.3, 0.5); ghostM.opacity = 0.45 * o * (0.85 + 0.15 * Math.sin(t * 5)); ghost.visible = o > 0.01; }
  // the broker's phone rings from "thousands" to "broker"; he lifts the handset
  { const ringing = t > T.ringA && t < T.liftA + 0.1 && (t - T.ringA) % 0.7 < 0.42, rg = ringing ? Math.sin(t * 60) : 0, lift = eio(seg(t, T.liftA, T.liftA + 0.5)) * (1 - seg(t, T.b6, T.b6 + 0.5)), ring2 = (t > T.comment && (t - T.comment) % 0.9 < 0.4) ? Math.sin(t * 60) : 0;
    phone.userData.handset.position.set(-0.08, 0.66 + Math.abs(rg + ring2) * 0.14 + lift * 0.45, 0); phone.userData.handset.rotation.x = lift * 0.5; phone.rotation.z = (rg + ring2) * 0.05; broker.rotation.y = -Math.PI / 2 - 0.35 * lift; }
  // the fabs: storm, bolt, the roof chips sink
  { const st = win(t, T.stormA, T.b9 + 0.6, 0.5, 0.8); stormM.opacity = 0.9 * st; stormG.visible = st > 0.01; stormG.position.x = FAB[0] - 2 + Math.sin(t * 0.5) * 1.5;
    const f2 = T.fears + 0.15; boltM.opacity = seg(t, f2, f2 + 0.04) * (1 - seg(t, f2 + 0.12, f2 + 0.3)) + 0.7 * seg(t, f2 + 0.36, f2 + 0.4) * (1 - seg(t, f2 + 0.46, f2 + 0.7)); bolt.visible = boltM.opacity > 0.01;
    FABS.forEach((f, i) => { const u = eio(seg(t, T.sinkA + i * 0.1, T.sinkA + 0.8 + i * 0.1)); f.ch.position.y = 10.6 - 2.4 * u + Math.sin(t * 40 + i) * 0.12 * win(t, T.sinkA, T.sinkA + 0.9, 0.05, 0.3); f.ch.rotation.z = 0.12 * u; }); }
  // the loop of arrows spins over the plaza
  { const o = win(t, T.loopA, T.b10 + 0.2, 0.35, 0.4); loopM.opacity = 0.95 * o; loopG.visible = o > 0.01; loopG.rotation.set(-0.35, 0, -t * 1.6); loopG.scale.setScalar(0.6 + 0.4 * eo(seg(t, T.loopA, T.loopA + 0.6))); }
  // phones over the city: ring, then cancelled (grey with a cross)
  PHONES.forEach((ph, i) => { const st = phoneOn(ph, t), sp = ph.sp; sp.visible = st > 0; if (!st) return; const k = back(seg(t, ph.t0, ph.t0 + 0.3)), offT = ph.t1 ?? (T.cancelA + (ph.wave === 4 ? 0.15 : 0.02 * (i % 30)));
    if (st === 1) { sp.material.map = phRing; sp.material.opacity = 1; const sh = (t - ph.t0) % 0.8 < 0.45 ? Math.sin(t * 50 + i) * 0.18 : 0; sp.material.rotation = sh; sp.scale.setScalar(ph.big * Math.min(1, k)); }
    else { const u = seg(t, offT, offT + 0.9); sp.material.map = ph.t1 ? phRing : phOff; sp.material.rotation = 0; sp.material.opacity = 1 - u; sp.scale.setScalar(ph.big * (1 - 0.3 * u)); }
    sp.position.set(ph.p[0], ph.p[1] + Math.sin(t * 2 + i) * 0.3, ph.p[2]); });
  // fireworks over the city on the record up day
  FW.forEach(f => { const u = seg(t, f.t0, f.t0 + 1.6); f.sp.visible = t > f.t0 && u < 1; if (!f.sp.visible) return; const r = 17 * eo(u); f.sp.position.set(f.c[0] + f.dir[0] * r, f.c[1] + f.dir[1] * r - 10 * u * u, f.c[2] + f.dir[2] * r); f.sp.scale.setScalar(7 * (1 - 0.5 * u)); f.sp.material.opacity = 1 - u; });
  // cars, people
  for (const c of CARS) { const L = 700, x = ((c.off + t * c.v) % L) - L / 2; c.m.position.set(c.dir * x, 0, c.z); c.m.rotation.y = c.dir > 0 ? 0 : Math.PI; }
  WALK.forEach((w, i) => { const x = w.x0 + Math.sin(t * 0.3 * w.sp + w.ph) * 3, z = w.z0 + Math.cos(t * 0.3 * w.sp + w.ph) * 2; w.m.position.set(x, Math.abs(Math.sin(t * 6 * w.sp + i)) * 0.06, z); w.m.rotation.y = w.ph + Math.sin(t * 0.2 + i) * 0.4; });
  // clouds
  for (const c of clouds) { c.position.x = c.userData.x0 + t * 1.2; c.material.opacity = 0.9 - 0.5 * night; const k = lerp(1, 0.45, night); c.material.color.setRGB(lerp(s.hor[0], 1, 0.55) * k, lerp(s.hor[1], 1, 0.55) * k, lerp(s.hor[2], 1, 0.55) * k * 1.05); c.material.emissive.setRGB(lerp(s.hor[0], 1, 0.4) * 0.55 * k, lerp(s.hor[1], 1, 0.4) * 0.55 * k, lerp(s.hor[2], 1, 0.4) * 0.58 * k); }
  // sparkles: your $40 when it drops in; the posted answers at the broker's desk
  { let k = 0; const put3 = (x, y, z, sz, on, col) => { const sp = sparks[k++]; if (!sp) return; const tw2 = Math.pow(Math.abs(Math.sin(t * sp.userData.w + sp.userData.ph)), 3); sp.position.set(x, y, z); sp.scale.setScalar(sz * (0.25 + tw2)); sp.material.opacity = on * (0.3 + 0.7 * tw2); sp.material.color.setHex(col); sp.visible = on > 0.01; };
    const s1 = win(t, T.ownA + 0.3, T.lose, 0.3, 0.4); for (let i = 0; i < 14; i++) { const a = i * 0.45 + t * 0.9; put3(MC[0] + Math.cos(a) * (CW / 2 + 0.4), FY(60) + 0.5 + (i % 5) * 0.9, MC[2] + Math.sin(a) * (CW / 2 + 0.4), 0.9, s1, 0xFFE9A8); }
    const s4 = win(t, T.postA, DUR + 1, 0.3, 0.1); for (let i = 0; i < 16; i++) { const ph = (t * 0.35 + i / 16) % 1, a = i * 2.4; put3(BR[0] - 1 + Math.cos(a) * 1.8, 1.6 + ph * 3.5, BR[1] + Math.sin(a) * 1.4, 0.7 + 0.3 * (1 - ph), s4 * Math.sin(ph * Math.PI), 0xFFE9A8); }
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
  rings: PHONES.filter((_, i) => i % 4 === 0).map(p => +p.t0.toFixed(3)), fw: BURSTS.map(b => +(T.nine + b[3]).toFixed(3)),
  typingA: [0, 1, 2].map(i => +(T.payK + (i + 0.5) * 0.12).toFixed(3)), typingB: [0, 1, 2, 3].map(i => +(T.sellK + (i + 0.5) * 0.12).toFixed(3)),
  postA: +T.postA.toFixed(3), postB: +T.postB.toFixed(3),
};
document.fonts.ready.then(() => Promise.all(['700 64px Figtree', '900 190px Fraunces', '800 30px JBM', '700 22px Inter', '700 78px Fraunces', '800 54px Figtree', '600 34px Figtree', '500 18px Inter', '900 128px JBM', '800 46px Inter', '900 150px Figtree', '900 112px Fraunces', '800 172px JBM', '700 34px Figtree', '800 92px JBM', '900 64px Figtree', '800 96px JBM', '800 80px Figtree', '800 72px Figtree', '800 78px Figtree', '700 38px Inter', '800 64px Figtree'].map(f => document.fonts.load(f)))).then(() => { TEXS.forEach(f => f()); fitHook(); renderAt(0); window.__ready = true; });
