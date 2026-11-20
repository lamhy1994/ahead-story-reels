// The Day the Founder Left — low-poly storybook scene (deterministic: window.renderAt(t) draws the frame for time t)
import * as THREE from 'three';
import { C, SKIN, MAT, rng, M, GB, person, palm, cloud, house, bushTree, tower, hq, diner, signPole, car, van, lamp, CHIP, rack, conveyor, hall, bakery, ledger, boardTable, magnifier, SHIP_PIX, SHIP_SMOOTH, CUP, NEWS, WIN_LIT, GLASS_M, LOAF } from './kit.js';

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
const R = rng(20261112);

// ───────────────────────── story clock (everything hangs off the narration)
const T = {
  nov: wt(1, 'November') - 0.1, nvidia: wt(1, "Nvidia's") - 0.1, sales: wt(1, 'sales') - 0.1, doubled: wt(1, 'doubled') - 0.1, shares1: wt(1, 'shares') - 0.1, fell1: wt(1, 'fell') - 0.05, anyway: wt(1, 'anyway') - 0.05,
  b2: S(2) - 0.05, y1993: wt(2, '1993') - 0.1, diner: wt(2, 'diner') - 0.1, san: wt(2, 'San') - 0.1,
  b3: S(3) - 0.05, engineers: wt(3, 'engineers') - 0.1, planned: wt(3, 'planned') - 0.1, chip: wt(3, 'chip') - 0.1, video: wt(3, 'video') - 0.1, real: wt(3, 'real') - 0.1,
  b4: S(4) - 0.05, jensen: wt(4, 'Jensen') - 0.12,
  b5: S(5) - 0.05, y33: wt(5, '33') - 0.1, games5: wt(5, 'games') - 0.1, ai: wt(5, 'A.I.') - 0.1, worth: wt(5, 'worth') - 0.1, trillions: wt(5, 'trillions') - 0.1,
  b6: S(6) - 0.05, news: wt(6, 'news') - 0.1, reports: wt(6, 'reports') - 0.1, affairs: wt(6, 'affairs') - 0.1,
  b7: S(7) - 0.05, twelfth: wt(7, 'twelfth') - 0.1, resigned: wt(7, 'resigned') - 0.1, effective: wt(7, 'effective') - 0.1, immediately: wt(7, 'immediately') - 0.1,
  b8: S(8) - 0.05, colette: wt(8, 'Colette') - 0.12, interim: wt(8, 'interim') - 0.1, boss8: wt(8, 'boss') - 0.1,
  b9: S(9) - 0.05, night9: wt(9, 'night') - 0.1, left9: wt(9, 'left') - 0.1, cost: wt(9, 'cost') - 0.1, p174: wt(9, '$174') - 0.1,
  b10: S(10) - 0.05, morning: wt(10, 'morning') - 0.1, fell10: wt(10, 'fell') - 0.1, p14: wt(10, '14%') - 0.1,
  b11: S(11) - 0.05, chips11: wt(11, 'chips') - 0.1, same11: wt(11, 'same') - 0.1,
  wipe1: S(12) - 0.45, bakery: wt(12, 'bakery') - 0.1, baker: wt(12, 'baker') - 0.1, walks: wt(12, 'walks') - 0.1, out: wt(12, 'out') - 0.1,
  b13: S(13) - 0.05, ovens: wt(13, 'ovens') - 0.1, bread: wt(13, 'bread') - 0.1, pay: wt(13, 'pay') - 0.1, same13: wt(13, 'same') - 0.1,
  wipe2: S(14) - 0.45, five: wt(14, 'Five') - 0.1, opened: wt(14, 'opened') - 0.1, books: wt(14, 'books') - 0.1,
  b15: S(15) - 0.05, billion: wt(15, 'billion') - 0.1, sales15: wt(15, 'sales') - 0.1, months: wt(15, 'months') - 0.1, double: wt(15, 'double') - 0.1, year15: wt(15, 'year') - 0.1,
  b16: S(16) - 0.05, evening: wt(16, 'evening') - 0.1, rose: wt(16, 'rose') - 0.1, next: wt(16, 'next') - 0.1, fell16: wt(16, 'fell') - 0.1,
  b17: S(17) - 0.05, eighteenth: wt(17, 'eighteenth') - 0.1, closed: wt(17, 'closed') - 0.1, p151: wt(17, '$151') - 0.1,
  b18: S(18) - 0.05, board: wt(18, 'board') - 0.1, back18: wt(18, 'back') - 0.1, looking: wt(18, 'looking') - 0.1, newb: wt(18, 'new') - 0.1,
  b19: S(19) - 0.05, over: wt(19, 'over') - 0.1,
  b20: S(20) - 0.05, story: wt(20, 'story') - 0.15, founder: wt(20, 'founder') - 0.1, markets: wt(20, 'Markets') - 0.1, people: wt(20, 'people') - 0.1,
  cta: S(21) - 0.1, decide: wt(21, 'decide') - 0.1, would: wt(21, 'Would') - 0.1, sold: wt(21, 'sold') - 0.1, held: wt(21, 'held') - 0.1, comment: wt(21, 'Comment') - 0.15, sell: wt(21, 'SELL') - 0.2, hold: wt(21, 'HOLD') - 0.1,
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
const SKY = [[0, 'DUSK'], [T.b2 + 0.2, 'DUSK'], [T.b2 + 1.6, 'NIGHT'], [T.b5 + 0.6, 'NIGHT'], [T.ai - 0.3, 'DAWN'], [T.worth, 'MORN'], [T.b6 + 0.6, 'DAY'], [T.b10, 'DAY'], [T.b11, 'MORN'],
  [T.wipe1 + 0.15, 'MORN'], [T.wipe1 + 1.0, 'MORN'], [T.wipe2 + 0.15, 'MORN'], [T.wipe2 + 1.0, 'SUNSET'], [T.evening, 'SUNSET'], [T.rose + 0.5, 'DUSK'], [T.next - 0.1, 'NIGHT'], [T.next + 0.45, 'DAWN'], [T.fell16, 'DAY'],
  [T.b20 - 0.2, 'DAY'], [T.b20 + 1.6, 'GOLDEN'], [T.cta - 0.2, 'SUNSET'], [T.cta + 1.6, 'DUSK'], [DUR + 2, 'DUSK']];
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

// ───────────────────────── ground, roads, plaza
const groundY = () => 0;
const ground = new THREE.Mesh(new THREE.PlaneGeometry(1400, 1400).rotateX(-Math.PI / 2), new THREE.MeshLambertMaterial({ color: 0xC9C2AE })); ground.receiveShadow = true; scene.add(ground);
const flat = new GB();
flat.box(1400, 0.04, 9, 0x4A4E56, 0, 0.02, 14);                                                          // the road along the diner (z 9.5–18.5)
for (let x = -690; x < 690; x += 6) flat.box(2.6, 0.05, 0.22, 0xF2EEE2, x, 0.045, 14);
flat.box(1400, 0.06, 2.0, 0xD8D2C4, 0, 0.03, 8.4); flat.box(1400, 0.06, 2.0, 0xD8D2C4, 0, 0.03, 19.6);
const flat26 = new GB(); flat26.box(8, 0.04, 260, 0x4A4E56, 44, 0.02, -100); flat26.box(8, 0.04, 260, 0x4A4E56, -44, 0.021, -100);     // two avenues north
flat26.box(1400, 0.04, 8, 0x4A4E56, 0, 0.022, -100); flat26.box(1400, 0.04, 8, 0x4A4E56, 0, 0.023, -160);
flat.box(30, 0.06, 13, 0x8E9096, 0, 0.03, 7.0);                                                          // diner parking lot
for (let i = 0; i < 8; i++) flat.box(0.14, 0.07, 3.6, 0xF2EEE2, -12 + i * 3.4, 0.035, 6.6);
flat26.box(66, 0.07, 44, 0xE6DFD0, 0, 0.035, -42);                                                         // HQ plaza
for (let i = 0; i < 12; i++) flat26.box(66, 0.075, 0.12, 0xD6CEBC, 0, 0.037, -62 + i * 3.6);
flat26.box(16, 0.08, 14, 0x7FA86A, -22, 0.04, -30); flat26.box(16, 0.08, 14, 0x7FA86A, 22, 0.041, -30);       // lawns
{ const rr = rng(404); for (let i = 0; i < 70; i++) { const x = (rr() - 0.5) * 520, z = -210 + rr() * 300; if (Math.abs(x) < 36 && z > -90 || (z > 3 && z < 31)) continue; flat26.box(6 + rr() * 14, 0.06, 6 + rr() * 14, rr() < 0.5 ? 0x8DAE74 : 0x9DB884, x, 0.03, z); } }
const flatM = flat.mesh(); flatM.castShadow = false; scene.add(flatM);
const flat26M = flat26.mesh(); flat26M.castShadow = false; scene.add(flat26M);

// ───────────────────────── the diner (1993 – today)
const DN = diner(); DN.position.set(0, 0, 0); scene.add(DN);
const BOOTH = DN.userData.booths[1];   // the middle booth [x, z]
const dinerLight = new THREE.PointLight(0xFFD9A0, 0, 16, 1.6); dinerLight.position.set(0.2, 2.5, 2.7); scene.add(dinerLight);
const pole = signPole(8.2, 4.6); pole.position.set(8.4, 0, 5.4); scene.add(pole);
const signCv = document.createElement('canvas'); signCv.width = 512; signCv.height = 224; const signTx = new THREE.CanvasTexture(signCv); signTx.colorSpace = THREE.SRGBColorSpace;
const signM = new THREE.MeshBasicMaterial({ map: signTx, toneMapped: false, color: 0xffffff });
const sign = new THREE.Mesh(new THREE.PlaneGeometry(4.6, 2.0), signM); sign.position.set(8.4, 8.2, 5.66); scene.add(sign);
const signBack = new THREE.Mesh(new THREE.BoxGeometry(4.7, 2.1, 0.3), new THREE.MeshLambertMaterial({ color: 0xF4EEE0 })); signBack.position.set(8.4, 8.2, 5.48); scene.add(signBack);
const lampHeads = new GB(); const LAMPS = [];
for (let x = -60; x <= 60; x += 16) { const l = lamp(6.2); l.position.set(x, 0, 9.2); l.rotation.y = -Math.PI / 2; scene.add(l); LAMPS.push([x, 6.0, 10.45]); lampHeads.box(0.5, 0.08, 0.3, 0xFFFFFF, x, 5.98, 10.45); }
const lampM = new THREE.MeshLambertMaterial({ color: 0xFFF1C8, emissive: 0xFFD27A, emissiveIntensity: 0 }); scene.add(new THREE.Mesh(lampHeads.geo(), lampM));
const palms = []; for (const [x, z, h] of [[-16, 22, 9], [17, 23, 11], [28, 22, 9], [-28, 23, 10], [-38, 22, 8.5], [40, 23, 10.5], [-14, -6, 8.5], [15, -6.5, 9.5]]) { const m = palm(h, R); m.position.set(x, 0, z); m.rotation.y = R() * 6.28; m.userData.ph = R() * 6.28; scene.add(m); palms.push(m); }
// cars on the road (they drive in both eras)
const CARS = [[0xC8423A, 12.0, 1, 7.5, 0], [0x2F6FB8, 16.2, -1, 9.0, 40], [0xE9C46A, 12.0, 1, 6.2, 150], [0x4C9A62, 16.2, -1, 8.0, 230], [0xEDEDED, 12.0, 1, 8.6, 300], [0x7A4FA0, 16.2, -1, 7.0, 90]].map(([col, z, dir, v, off]) => { const m = car(col, { boxy: true }); scene.add(m); return { m, z, dir, v, off }; });
const parked = [[0x8A9AA8, 4, 7.6], [0xB8383B, -6.8, 7.4], [0xE6DCC4, -10.2, 7.6]].map(([col, x, z]) => { const m = car(col, { boxy: true }); m.position.set(x, 0, z); m.rotation.y = Math.PI / 2; scene.add(m); return m; });

// the booth: three engineers, coffee, an idea
const SEAT = (o, x, z, ry) => { const m = person(o); m.position.set(x, -0.12, z); m.rotation.y = ry; scene.add(m); return m; };
const eng = [
  SEAT({ robe: 0x3B4A6A, skin: SKIN[3], short: 0x231C18, s: 1.0 }, BOOTH[0] - 0.42, 0.86, -Math.PI / 2),     // Jensen Huang (back bench, facing the window)
  SEAT({ robe: 0xB8383B, skin: SKIN[4], short: 0x6A4A2E, s: 1.0 }, BOOTH[0] + 0.45, 0.86, -Math.PI / 2),
  SEAT({ robe: 0x4C9A62, skin: SKIN[4], short: 0x3A2A1E, s: 1.0 }, BOOTH[0] + 1.32, 1.62, Math.PI),             // at the end of the table, on a stool
];
const JH = eng[0];
const stool = new GB().cyl(0.05, 0.05, 0.62, 5, 0x9A9A9A, 0, 0.31, 0).cyl(0.26, 0.24, 0.12, 8, 0xC8423A, 0, 0.64, 0).mesh(); stool.position.set(BOOTH[0] + 1.32, 0, 1.62); scene.add(stool);
const cups = new THREE.InstancedMesh(CUP, MAT, 3); [[-0.45, 1.3], [0.42, 1.32], [0.78, 1.7]].forEach(([dx, z], i) => cups.setMatrixAt(i, M(BOOTH[0] + dx, 0.86, z))); scene.add(cups);
const ideaM = new THREE.MeshLambertMaterial({ vertexColors: true, emissive: 0x7FD3FF, emissiveIntensity: 0.35 });
const shipPix = new THREE.Mesh(SHIP_PIX, ideaM), shipSmooth = new THREE.Mesh(SHIP_SMOOTH, MAT); scene.add(shipPix, shipSmooth);
const ideaChip = new THREE.Mesh(CHIP, MAT); scene.add(ideaChip);
const IDEA = [BOOTH[0] + 0.1, 1.98, 1.62];

// ───────────────────────── the city (2026) — it sinks for the rewind to 1993 and grows back over 33 years
const TOWERS = [], stat = [];
const DEST = (x, z) => (z > 3 && z < 31) || (Math.abs(x) < 25 && z > -18 && z <= 3) || (Math.abs(x) < 36 && z < -12 && z > -92) || Math.hypot(x - 31, z + 46) < 15 || (x > -60 && x < -12 && z > -56 && z < -24) || (z > 30 && Math.abs(x) < 46);
{
  const tr = rng(2026), PAL = [[0xD9D3C6, 0x5E7F9A], [0x6D97AA, 0x3F6A80], [0xE4DED2, 0x4E7C93], [0xC9C2B4, 0x55748C], [0x8FB3C2, 0x426E86], [0xEFE9DC, 0x6A8AA4], [0xB7C4C9, 0x3E6378], [0xE8D9C0, 0x5A7A90]];
  for (let gx = -168; gx <= 168; gx += 22) for (let gz = -196; gz <= 74; gz += 22) {
    const x = gx + (tr() - .5) * 7, z = gz + (tr() - .5) * 7; if (DEST(x, z) || tr() < 0.12) continue;
    const dp = Math.hypot(x, z + 40), far = dp > 95, w = 9 + tr() * 7, d = 9 + tr() * 7;
    const h = (z > 30 ? 9 + tr() * 12 : dp < 70 ? 14 + tr() * 20 : 22 + tr() * (far ? 52 : 34)) * (Math.abs(x) > 120 ? 0.8 : 1);
    const pal = PAL[Math.floor(tr() * PAL.length)];
    const g = tower(w, h, d, { rand: tr, color: pal[0], glass: pal[1], floor: far ? 4.2 : 3.4, litP: 0.5, crown: h > 50 && tr() < 0.5 });
    g.position.set(x, 0, z); g.rotation.y = (tr() < 0.5 ? 0 : Math.PI / 2); g.children.forEach(c => { c.castShadow = dp < 120; c.receiveShadow = true; }); scene.add(g);
    TOWERS.push({ g, x, z, h, dist: Math.hypot(x, z) }); stat.push([x - Math.max(w, d) / 2, x + Math.max(w, d) / 2, z - Math.max(w, d) / 2, z + Math.max(w, d) / 2, h + 4, 'tower', TOWERS.length - 1]);
  }
}
// headquarters, the price screen, the chip hall
const HQ = hq({ rand: rng(7) }); HQ.position.set(0, 0, -72); scene.add(HQ);
const ROOF = HQ.userData.roofY, DOORZ = -72 + HQ.userData.doorZ;
TOWERS.push({ g: HQ, x: 0, z: -72, h: 24, dist: 72, hq: true }); stat.push([-25, 25, -84, -62, 24, 'HQ', TOWERS.length - 1]);
const SCR = [31, 28.5, -46], SCR_RY = -0.64;
const pylon = new THREE.Group(); { const b = new GB(); b.box(4.6, 40, 3.6, 0x3A4048, 0, 20, -2.6); b.box(13.2, 14.8, 1.2, 0x23272E, 0, SCR[1], 0.3); b.box(13.8, 0.5, 1.6, 0x8A8F96, 0, SCR[1] + 7.6, 0.3); b.box(13.8, 0.5, 1.6, 0x8A8F96, 0, SCR[1] - 7.6, 0.3); b.box(5.6, 1.2, 4.6, 0x8A8F96, 0, 0.6, -2.6); pylon.add(b.mesh()); }
pylon.position.set(SCR[0], 0, SCR[2]); pylon.rotation.y = SCR_RY; scene.add(pylon);
const scrCv = document.createElement('canvas'); scrCv.width = 720; scrCv.height = 810; const scrTx = new THREE.CanvasTexture(scrCv); scrTx.colorSpace = THREE.SRGBColorSpace; scrTx.anisotropy = 4;
const scrM = new THREE.MeshBasicMaterial({ map: scrTx, toneMapped: false });
const screen = new THREE.Mesh(new THREE.PlaneGeometry(12.4, 13.95), scrM); screen.position.set(0, SCR[1], 0.95); pylon.add(screen);
TOWERS.push({ g: pylon, x: SCR[0], z: SCR[2], h: 41, dist: 55, pylon: true }); stat.push([SCR[0] - 7, SCR[0] + 7, SCR[2] - 6, SCR[2] + 6, 41, 'screen', TOWERS.length - 1]);
const HALL = [-40, -42];
const hallG = new THREE.Group(); hallG.add(hall(20, 12, 7)); hallG.position.set(HALL[0], 0, HALL[1]); scene.add(hallG);
const ledM = new THREE.MeshLambertMaterial({ vertexColors: true, emissive: 0x6FE0B0, emissiveIntensity: 0 });
{ const [rb, rl] = rack(); const n = 10; const rbM = new THREE.InstancedMesh(rb, MAT, n), rlM = new THREE.InstancedMesh(rl, ledM, n);
  for (let i = 0; i < n; i++) { const m = M(-6 + (i % 5) * 2.6, 0.2, -2.6 + Math.floor(i / 5) * 4.2, 0, Math.PI / 2, 0); rbM.setMatrixAt(i, m); rlM.setMatrixAt(i, m); } hallG.add(rbM, rlM); }
TOWERS.push({ g: hallG, x: HALL[0], z: HALL[1], h: 8, dist: 58, hall: true }); stat.push([HALL[0] - 10.5, HALL[0] + 10.5, HALL[1] - 6.5, HALL[1] + 6.5, 9, 'hall', TOWERS.length - 1]);
const CONV = { x0: -29.5, x1: -15, z: -38 };
const conv = conveyor(CONV.x1 - CONV.x0); conv.position.set((CONV.x0 + CONV.x1) / 2, 0, CONV.z); scene.add(conv);
const NCH = 9, chips = new THREE.InstancedMesh(CHIP, MAT, NCH); chips.castShadow = true; scene.add(chips);
const chipX = (i, t) => CONV.x0 + 0.6 + ((i * 1.62 + t * 1.35) % (CONV.x1 - CONV.x0 - 1.2));
// plaza trees and benches
const trees = []; for (const [x, z] of [[-8, -20], [27, -24], [27, -56], [-14, -18], [14, -18], [-30, -58], [24, -60], [-50, -14], [52, -12], [60, -30], [-62, -20]]) { const m = bushTree(5.5 + R() * 2, R); m.position.set(x, 0, z); scene.add(m); trees.push(m); }

// ───────────────────────── people on the plaza
const CAST = [];
const P0 = (o, x, z, ry, show) => { const m = person(o); m.position.set(x, 0, z); m.rotation.y = ry; scene.add(m); const c = { m, x, z, ry, show, ph: R() * 6.28 }; CAST.push(c); return c; };
const DAYP = t => t > T.b6 - 0.6 && t < T.wipe1 + 0.6;          // the plaza on 12 November
const EVEP = t => t > T.wipe2 + 0.5 && t < T.b18 + 0.2;         // the plaza on 17–18 November
const modern = (i, extra = {}) => ({ robe: [0x34405A, 0x6A2E3E, 0x3F6A5A, 0x5A5A66, 0x7A5A3A, 0x2F4A6A, 0x8A3A3A][i % 7], skin: SKIN[i % 5], short: [0x231C18, 0x5A3E28, 0xC9A27A, 0x3A2A1E, 0x8A8A8A][i % 5], shirt: i % 2 ? 0xF4F2EC : undefined, ...extra });
const founder = P0({ robe: 0x4A6386, skin: SKIN[3], short: 0x2E2A28, shirt: 0xF4F2EC, tie: 0x8A2E2E, s: 1.04 }, 0, DOORZ - 0.6, Math.PI / 2, t => t > T.twelfth - 0.2 && t < T.b9 + 0.4);
const FP = [[0, DOORZ - 0.4], [0, DOORZ + 4.8], [-3.2, DOORZ + 9.0], [-13, -36], [-24, -22]];
function founderPos(t) {
  const u = seg(t, T.twelfth, T.b8 + 2.2), n = FP.length - 1, k = Math.min(n - 1, Math.floor(u * n)), v = u * n - k, a = FP[k], b = FP[k + 1];
  const x = lerp(a[0], b[0], v), z = lerp(a[1], b[1], v); return [x, z, Math.atan2(-(b[1] - a[1]), b[0] - a[0]), u > 0 && u < 1];
}
const kress = P0({ robe: 0x6A2E3E, skin: SKIN[4], hair: 0xB98A5A, shirt: 0xF4F2EC, dress: true, s: 1.0 }, 0, DOORZ - 0.4, Math.PI / 2, t => t > T.b8 - 0.4 && t < T.b9 + 0.4);
const kressPos = t => { const u = eio(seg(t, T.b8 - 0.3, T.colette + 0.1)); return [0.6, lerp(DOORZ - 0.4, DOORZ + 3.6, u)]; };
const REP = [[-4.5, -52], [-2.2, -50.6], [1.5, -50.4], [4.4, -51.8], [6.6, -54.2], [-6.8, -54.6]].map(([x, z], i) => P0(modern(i + 1, i === 2 || i === 5 ? { cam: true } : { mic: true }), x, z, Math.atan2(-(DOORZ + 2 - z), 0 - x), DAYP));
const walkers = [[-16, -46, 0], [10, -34, 1], [-6, -28, 2], [18, -48, 3], [-20, -30, 4]].map(([x, z, i]) => P0(modern(i + 3, { badge: true }), x, z, 0, t => DAYP(t) || EVEP(t)));
const WALK = walkers.map((w, i) => ({ a: [w.x, w.z], b: [w.x + [14, -12, 10, -14, 12][i], w.z + [6, -4, -8, 5, -6][i]], sp: 0.07 + i * 0.012, ph: i * 0.27 }));
const vans = [[0x2F6FB8, 40, -27, 12, -27], [0xB8383B, -46, -26, -10, -27.5]].map(([col, x0, z0, x1, z1]) => { const m = van({ stripe: col }); scene.add(m); return { m, x0, z0, x1, z1 }; });
// newspapers flutter down onto the plaza
const newsCv = document.createElement('canvas'); newsCv.width = 128; newsCv.height = 176; const newsTx = new THREE.CanvasTexture(newsCv); newsTx.colorSpace = THREE.SRGBColorSpace;
const newsM = new THREE.MeshLambertMaterial({ map: newsTx, side: THREE.DoubleSide });
const NN = 26, papers = new THREE.InstancedMesh(NEWS, newsM, NN); papers.frustumCulled = false; scene.add(papers);
const PAP = Array.from({ length: NN }, (_, i) => ({ x: (R() - 0.5) * 22, z: -54 + R() * 16, t0: T.news - 0.6 + i * 0.075 + R() * 0.15, sp: R() * 6.28, rz: R() * 6.28, h: 18 + R() * 10 }));
// flashes from the photographers
const flashT = (() => { const cv = document.createElement('canvas'); cv.width = cv.height = 64; const g = cv.getContext('2d'); const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.25, 'rgba(255,250,235,0.8)'); gr.addColorStop(1, 'rgba(255,240,210,0)'); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); const tx = new THREE.CanvasTexture(cv); tx.colorSpace = THREE.SRGBColorSpace; return tx; })();
const flashes = Array.from({ length: 6 }, () => { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: flashT, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false })); scene.add(s); return s; });
const FLASH_T = [T.resigned + 0.05, T.resigned + 0.32, T.effective + 0.1, T.immediately - 0.1, T.immediately + 0.35, T.colette + 0.15];

// ───────────────────────── the giant ledger and the bars (17 November, sunset)
const LED = [0, -40];
const book = ledger(6.2, 8.4); book.position.set(LED[0], 0, LED[1]); book.rotation.y = 0; scene.add(book);
const barM = new THREE.MeshLambertMaterial({ color: 0xF7B500, emissive: 0xA86A00, emissiveIntensity: 0.45 });
const barG = new THREE.MeshLambertMaterial({ color: 0xA9ADB6 });
const BARS = [{ m: new THREE.Mesh(new THREE.BoxGeometry(2.2, 1, 2.2).translate(0, 0.5, 0), barM), x: 3.1, h: 9.0, t0: T.b15 + 0.05, t1: T.billion + 0.6 }, { m: new THREE.Mesh(new THREE.BoxGeometry(2.2, 1, 2.2).translate(0, 0.5, 0), barG), x: -3.1, h: 9.0 * 57.0 / 115.8, t0: T.year15 - 0.35, t1: T.year15 + 0.45 }];
BARS.forEach(b => { b.m.castShadow = true; b.m.position.set(LED[0] + b.x, 1.25, LED[1]); scene.add(b.m); });

// ───────────────────────── the roof: the board, an empty chair, the search
const TBL = boardTable(4); TBL.position.set(0, ROOF, -72); scene.add(TBL);
const SEATS = TBL.userData.seats.map(([x, z, ry]) => [x, -72 + z, ry]);
const boardP = SEATS.slice(1).map(([x, z, ry], i) => { const m = person(modern(i, { s: 0.98 })); m.position.set(x - Math.cos(ry) * 0.15, ROOF - 0.34, z); m.rotation.y = ry; scene.add(m); return m; });
const spotM = new THREE.MeshBasicMaterial({ color: 0xFFE8B0, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false, side: THREE.DoubleSide });
spotM.map = radial('rgba(255,236,190,0.9)', 'rgba(255,220,150,0)'); const spot = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 3.4).rotateX(-Math.PI / 2), spotM); spot.position.set(SEATS[0][0], ROOF + 0.03, SEATS[0][1]); scene.add(spot);
const mag = magnifier(); mag.scale.setScalar(0.85); scene.add(mag);
function magPos(t) {   // rises from the far end of the table, sweeps slowly over the skyline to the north, then comes to hover beside the empty chair
  const a = [0, ROOF + 1.2, -77], up = eio(seg(t, T.looking - 0.15, T.newb + 0.2)), sw = t - (T.newb + 0.2), v = eio(seg(t, T.b19 + 0.2, T.over + 0.9));
  const p = [lerp(a[0], 0, up), lerp(a[1], ROOF + 2.8, up), lerp(a[2], -81, up)];
  if (sw > 0) { p[0] = 2.2 * Math.sin(sw * 1.9) * sm(0, 0.5, sw); p[1] = ROOF + 2.8 + 0.25 * Math.sin(sw * 2.3); }
  const home = [SEATS[0][0] - 3.4, ROOF + 6.0, SEATS[0][1] - 3.2];
  return [lerp(p[0], home[0], v), lerp(p[1], home[1], v), lerp(p[2], home[2], v)];
}

// ───────────────────────── an imaginary bakery (far away, in its own little street)
const BK = [500, 0, -6];
const bake = bakery(); bake.position.set(BK[0], 0, BK[2]); scene.add(bake);
const bk = bake.userData, bkW = (lx, ly, lz) => [BK[0] + lx, ly, BK[2] + lz];
const street = new GB(); street.box(120, 0.05, 9, 0xBDA98C, BK[0], 0.025, BK[2] + 8.4); for (let i = 0; i < 40; i++) street.box(2.6, 0.06, 0.1, 0xA89478, BK[0] - 60 + i * 3, 0.03, BK[2] + 5 + (i % 3) * 3); street.box(120, 0.06, 1.8, 0xD9CDB6, BK[0], 0.03, BK[2] + 3.6);
scene.add(street.mesh());
for (const [dx, col, rf] of [[-11, 0xC98556, 0x5A5E6C], [11.5, 0xE6D3A3, 0x8C4A36], [-21.5, 0xA9C4B8, 0x5A5E6C], [22, 0xD9A45F, 0x5A5E6C]]) { const h = house(9, 7, 7, { color: col, roof: rf, rand: R, front: 1 }); h.position.set(BK[0] + dx, 0, BK[2] - 0.5); scene.add(h); stat.push([BK[0] + dx - 5, BK[0] + dx + 5, BK[2] - 4.5, BK[2] + 3.5, 11, 'house']); }
stat.push([BK[0] - 4.8, BK[0] + 4.8, BK[2] - 3.4, BK[2] + 3.4, 7.2, 'bakery']);
for (const [dx, dz] of [[-6.5, 13.5], [7.5, 14], [-16, 14.5], [17, 13.8]]) { const m = bushTree(5.6, R); m.position.set(BK[0] + dx, 0, BK[2] + dz); scene.add(m); }
const loafM = new THREE.MeshLambertMaterial({ color: C.bread, emissive: 0x5A2A00, emissiveIntensity: 0.15 });
const loaves = new THREE.InstancedMesh(LOAF, loafM, 18); { let k = 0; for (let r = 0; r < 3; r++) for (let i = 0; i < 6; i++) { const [x, y, z] = bkW(bk.shelf[0] - 1.35 + i * 0.54, bk.shelf[1] + 0.12 + r * 0.85, bk.shelf[2]); loaves.setMatrixAt(k++, M(x, y, z, 0, 0, 0, 1.25, 0.8, 0.9)); } } scene.add(loaves);
const ovenGlowM = new THREE.MeshBasicMaterial({ map: radial('rgba(255,170,70,0.95)', 'rgba(255,90,20,0)'), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false });
const ovenGlow = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 1.6), ovenGlowM); { const [x, y, z] = bkW(bk.oven[0], bk.oven[1], bk.oven[2] + 0.05); ovenGlow.position.set(x, y, z); } scene.add(ovenGlow);
const baker = P0({ robe: 0xF6EFE2, skin: SKIN[3], toque: true, apron: true, s: 1.05 }, 0, 0, 0, t => t > T.wipe1 + 0.4 && t < T.wipe2 + 0.4);
function bakerPos(t) { const A = bkW(0.6, 0, 0.6), B = bkW(-3.4, 0, 3.8), Cc = bkW(16, 0, 6.8); const u1 = seg(t, T.walks - 0.35, T.out + 0.35), u2 = seg(t, T.out + 0.35, T.bread + 0.9); const k = u1 < 1 ? 0 : 1, v = k ? u2 : u1, a = k ? B : A, b = k ? Cc : B; return [lerp(a[0], b[0], v), lerp(a[2], b[2], v), Math.atan2(-(b[2] - a[2]), b[0] - a[0]), v > 0 && v < 1]; }
const queue = [[4.8, 5.0], [6.4, 5.3], [8.0, 5.1], [9.4, 5.6]].map(([dx, dz], i) => P0(modern(i + 2, { s: i === 3 ? 0.72 : 1 }), BK[0] + dx, BK[2] + dz, Math.PI, t => t > T.wipe1 + 0.4 && t < T.wipe2 + 0.4));
const forSaleCv = document.createElement('canvas'); forSaleCv.width = 256; forSaleCv.height = 160; const forSaleTx = new THREE.CanvasTexture(forSaleCv); forSaleTx.colorSpace = THREE.SRGBColorSpace;
const forSale = new THREE.Group(); { const b = new GB(); b.box(0.16, 2.4, 0.16, C.wood, 0, 1.2, 0); b.box(2.3, 1.5, 0.12, 0xF6EFE2, 0, 2.6, 0.02); forSale.add(b.mesh()); const pl = new THREE.Mesh(new THREE.PlaneGeometry(2.1, 1.31), new THREE.MeshLambertMaterial({ map: forSaleTx })); pl.position.set(0, 2.6, 0.09); forSale.add(pl); }
forSale.position.set(...bkW(-0.6, 0, 4.4)); scene.add(forSale);

// ───────────────────────── sky clutter: clouds, birds, sparkles
const clouds = []; for (let i = 0; i < 18; i++) { const m = cloud(R); const far = i >= 10; m.position.set(far ? -500 + R() * 1000 : -260 + i * 52 + R() * 20, 70 + R() * 40, far ? -520 + R() * 200 : -320 + R() * 300); m.scale.setScalar(2.0 + R() * 2.2); m.userData.x0 = m.position.x; scene.add(m); clouds.push(m); }
for (const [x, y, z, k] of [[BK[0] - 30, 70, -80, 2.2], [BK[0] + 40, 76, -110, 2.6], [BK[0], 84, -150, 3.0]]) { const m = cloud(R); m.position.set(x, y, z); m.scale.setScalar(k); m.userData.x0 = x; scene.add(m); clouds.push(m); }
const birdMat = new THREE.MeshBasicMaterial({ color: 0x2A2430, side: THREE.DoubleSide });
const wingG = new THREE.BufferGeometry(); wingG.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0.1, 1.6, 0, -0.3, 1.5, 0, 0.5], 3));
const FLOCK = [{ t0: T.b6 - 0.5, t1: T.b8 + 1.5, a: [-50, 26, -30], b: [40, 32, -64] }, { t0: T.wipe1 + 1.0, t1: T.wipe2 - 0.2, a: [BK[0] - 30, 14, BK[2] + 10], b: [BK[0] + 30, 18, BK[2] - 6] }, { t0: T.b20 - 0.2, t1: T.cta + 1.0, a: [-80, 40, -20], b: [70, 46, -90] }];
const birds = []; for (let i = 0; i < 9; i++) { const g = new THREE.Group(), l = new THREE.Mesh(wingG, birdMat), r = new THREE.Mesh(wingG, birdMat); r.scale.x = -1; g.add(l, r); g.userData = { l, r, ph: R() * 6 }; g.visible = false; g.scale.setScalar(1.1); scene.add(g); birds.push(g); }
function updateBirds(t) {
  const f = FLOCK.find(f => t >= f.t0 && t <= f.t1); for (const b of birds) b.visible = !!f; if (!f) return;
  const u = seg(t, f.t0, f.t1), dx = f.b[0] - f.a[0], dz = f.b[2] - f.a[2], L = Math.hypot(dx, dz), ux = dx / L, uz = dz / L;
  birds.forEach((b, i) => { const row = Math.ceil(i / 2), sd = i % 2 ? 1 : -1; b.position.set(lerp(f.a[0], f.b[0], u) - ux * row * 2.4 + uz * sd * row * 1.7, lerp(f.a[1], f.b[1], u) + Math.sin(t * 2 + b.userData.ph) * 0.5, lerp(f.a[2], f.b[2], u) - uz * row * 2.4 - ux * sd * row * 1.7); b.rotation.y = Math.atan2(ux, uz); const fl = Math.sin(t * 10 + b.userData.ph) * 0.65; b.userData.l.rotation.z = fl; b.userData.r.rotation.z = -fl; });
}
const sparkT = (() => { const cv = document.createElement('canvas'); cv.width = cv.height = 64; const g = cv.getContext('2d'); g.translate(32, 32); g.fillStyle = '#fff'; for (let k = 0; k < 2; k++) { g.rotate(Math.PI / 2 * k); g.beginPath(); g.moveTo(0, -30); g.quadraticCurveTo(3, -3, 30, 0); g.quadraticCurveTo(3, 3, 0, 30); g.quadraticCurveTo(-3, 3, -30, 0); g.quadraticCurveTo(-3, -3, 0, -30); g.fill(); } const tx = new THREE.CanvasTexture(cv); tx.colorSpace = THREE.SRGBColorSpace; return tx; })();
const sparks = []; for (let i = 0; i < 48; i++) { const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: sparkT, color: 0xFFE9A8, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false })); sp.userData = { ph: R() * 6.28, w: 3 + R() * 4, a: R() * 6.28, r: R(), h: R() }; scene.add(sp); sparks.push(sp); }
const glowM = new THREE.MeshBasicMaterial({ map: radial('rgba(255,210,120,0.85)', 'rgba(255,170,60,0)'), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false, opacity: 0 });
const ideaGlow = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), glowM); scene.add(ideaGlow);

// ───────────────────────── canvases (drawn once the fonts are ready)
const F = (w, px, fam) => `${w} ${px}px ${fam}`;
function drawStatic() {
  { const g = signCv.getContext('2d'); g.fillStyle = '#FFF6E6'; g.fillRect(0, 0, 512, 224); g.fillStyle = '#C8423A'; g.fillRect(14, 14, 484, 196); g.fillStyle = '#FFF6E6'; g.fillRect(26, 26, 460, 172); g.fillStyle = '#C8423A'; g.font = F(900, 128, 'Fraunces'); g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('DINER', 256, 104); g.font = F(700, 30, 'Inter'); g.fillStyle = '#2B3A4A'; g.fillText('OPEN · COFFEE', 256, 178); signTx.needsUpdate = true; }
  { const g = newsCv.getContext('2d'); g.fillStyle = '#F6F2E8'; g.fillRect(0, 0, 128, 176); g.fillStyle = '#1E1E22'; g.font = F(900, 30, 'Fraunces'); g.textAlign = 'center'; g.fillText('NEWS', 64, 34); g.fillRect(8, 44, 112, 2); g.fillStyle = '#5A5A62'; g.fillRect(12, 52, 104, 9);
    g.fillStyle = '#9A9AA2'; for (let i = 0; i < 9; i++) { g.fillRect(8, 70 + i * 11, 52, 4); g.fillRect(68, 70 + i * 11, 52, 4); } g.fillStyle = '#C9CFD8'; g.fillRect(68, 70, 52, 34); newsTx.needsUpdate = true; }
  { const g = forSaleCv.getContext('2d'); g.fillStyle = '#F6EFE2'; g.fillRect(0, 0, 256, 160); g.strokeStyle = '#B8383B'; g.lineWidth = 10; g.strokeRect(8, 8, 240, 144); g.fillStyle = '#B8383B'; g.font = F(900, 52, 'Figtree'); g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('FOR', 128, 52); g.fillText('SALE', 128, 108); forSaleTx.needsUpdate = true; }
}
// the price screen: one canvas, redrawn only when what it shows changes
let scrKey = '';
const PR = { c11: 173.73, low12: 148.80, c12: 166.19, c16: 156.14, c17: 155.46, c18: 150.96 };
function scrMode(t) {
  if (t < T.b2 + 0.4) return ['hook', seg(t, T.doubled - 0.1, T.doubled + 0.7), seg(t, T.fell1 - 0.1, T.fell1 + 0.8)];
  if (t > T.b9 - 1.5 && t < T.wipe1) return ['price', seg(t, T.cost - 0.2, T.p174 + 0.3), seg(t, T.fell10 - 0.1, T.p14 + 0.4)];
  if (t > T.b16 - 1.0 && t < T.b18) return ['eve', seg(t, T.rose - 0.3, T.rose + 0.5), seg(t, T.fell16 - 0.2, T.fell16 + 0.6)];
  if (t > T.cta) return ['cta', seg(t, T.would, T.would + 0.6), 0];
  return ['idle', 0, 0];
}
function drawScreen(t) {
  const [mode, a, b] = scrMode(t), key = mode + Math.round(a * 30) + '_' + Math.round(b * 30);
  if (key === scrKey) return; scrKey = key;
  const g = scrCv.getContext('2d'), w = 720, h = 810;
  g.fillStyle = '#0B1020'; g.fillRect(0, 0, w, h);
  g.strokeStyle = 'rgba(255,255,255,0.07)'; g.lineWidth = 2; for (let i = 1; i < 8; i++) { g.beginPath(); g.moveTo(0, i * h / 8); g.lineTo(w, i * h / 8); g.stroke(); }
  g.textAlign = 'center'; g.textBaseline = 'middle';
  const line = (pts, col, wd = 14) => { g.strokeStyle = col; g.lineWidth = wd; g.lineJoin = 'round'; g.lineCap = 'round'; g.beginPath(); pts.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.stroke(); };
  const partial = (pts, u) => { const out = [pts[0]]; const n = pts.length - 1, k = Math.min(n - 1, Math.floor(u * n)), v = u * n - k; for (let i = 1; i <= k; i++) out.push(pts[i]); const A = pts[k], B = pts[k + 1]; out.push([lerp(A[0], B[0], v), lerp(A[1], B[1], v)]); return out; };
  if (mode === 'hook') {
    g.fillStyle = '#FFD27A'; g.font = F(800, 44, 'Inter'); g.fillText('SALES', 360, 52); g.fillText('SHARES', 360, 460);
    g.fillStyle = 'rgba(255,255,255,0.2)'; g.fillRect(40, 405, 640, 3);
    const hb = 150, hB = lerp(hb, hb * 2.03, eo(a)); g.fillStyle = '#7C8496'; g.fillRect(150, 380 - hb, 150, hb); g.fillStyle = '#F7B500'; g.fillRect(400, 380 - hB, 150, hB);
    if (a > 0.3) { g.fillStyle = '#FFFFFF'; g.font = F(900, 72, 'Figtree'); g.fillText('×2', 620, 380 - hB + 30); }
    const pts = [[70, 560], [170, 545], [250, 570], [330, 552], [430, 640], [520, 700], [620, 760]]; line(partial(pts, lerp(0.45, 1, eo(b))), '#FF6B5B', 16);
    if (b > 0.5) { g.fillStyle = '#FF6B5B'; g.font = F(900, 96, 'Figtree'); g.fillText('↓', 650, 640); }
  } else if (mode === 'price' || mode === 'eve') {
    g.fillStyle = '#FFD27A'; g.font = F(800, 40, 'Inter'); g.fillText('NVDA · ONE SHARE', 360, 56);
    if (mode === 'price') {
      const pts = [[60, 470], [180, 455], [300, 466], [390, 460], [430, 640], [470, 690], [560, 610], [660, 575]];
      const u = a < 1 ? lerp(0.12, 0.5, a) : lerp(0.5, 1, eo(b)); line(partial(pts, u), b > 0.2 ? '#FF6B5B' : '#F7B500', 16);
      g.font = F(800, 112, 'JBM'); if (b < 0.35) { g.fillStyle = '#FFFFFF'; if (a > 0.15) g.fillText('$173.73', 360, 200); } else { g.fillStyle = '#FF6B5B'; g.fillText('−14%', 360, 200); }
      g.fillStyle = 'rgba(255,255,255,0.7)'; g.font = F(700, 32, 'Inter'); g.fillText(b < 0.35 ? '11 NOV 2026 · CLOSE' : '12 NOV · LOW $148.80', 360, 300);
    } else {
      const up = [[60, 560], [200, 572], [360, 566], [450, 470]], down = [[450, 470], [560, 560], [660, 640]];
      line(partial(up, lerp(0.66, 1, eo(a))), '#7FD08A', 16); if (b > 0) line(partial(down, eo(b)), '#FF6B5B', 16);
      g.font = F(900, 92, 'Figtree'); if (b < 0.3) { g.fillStyle = '#7FD08A'; if (a > 0.4) g.fillText('▲', 360, 190); } else { g.fillStyle = '#FF6B5B'; g.fillText('▼', 360, 190); }
      g.fillStyle = 'rgba(255,255,255,0.75)'; g.font = F(800, 40, 'Inter'); g.fillText(b < 0.3 ? (a > 0.4 ? 'AFTER HOURS · 17 NOV' : '17 NOV · RESULTS') : 'NEXT DAY · 18 NOV', 360, 300);
      if (b > 0.6) { g.fillStyle = '#FFFFFF'; g.font = F(800, 64, 'JBM'); g.fillText('$150.96', 360, 740); }
    }
  } else if (mode === 'cta') {
    g.font = F(900, 150, 'Figtree'); g.fillStyle = '#F7B500'; g.fillText('SELL', 360, 220); g.fillStyle = '#6FD0C0'; g.fillText('HOLD', 360, 560);
    g.fillStyle = '#FFFFFF'; g.font = F(800, 60, 'Inter'); g.fillText('or', 360, 390); g.font = F(700, 38, 'Inter'); g.fillStyle = 'rgba(255,255,255,0.8)'; g.fillText('YOU DECIDE', 360, 720);
  } else {
    g.fillStyle = 'rgba(255,210,122,0.85)'; g.font = F(800, 52, 'Inter'); g.fillText('NVDA', 360, 120);
    line([[60, 480], [180, 470], [300, 482], [420, 474], [540, 480], [660, 476]], 'rgba(247,181,0,0.6)', 10);
  }
  scrTx.needsUpdate = true;
}

// ───────────────────────── camera path (spherical keys around a target; `up` tilts the view so the subject sits lower in the frame)
const SCRF = (dx = 0, dy = 0) => [SCR[0] + dx, SCR[1] + dy, SCR[2]];
const FOUND = (dy = 1.5) => t => { const p = founderPos(t); return [p[0], dy, p[1]]; };
const MAGF = (dy = 0) => t => { const p = magPos(t); return [p[0], p[1] + dy, p[2]]; };
const BAKERF = t => { const p = bakerPos(t); return [p[0], 1.6, p[1]]; };
const CAM = [
  { t: 0, tg: SCRF(-4, 9), d: 118, az: -18, el: 34, up: 0.02 },                                          // over the city at dusk, the price screen below
  { t: T.nvidia + 0.1, tg: SCRF(0, 6), d: 76, az: -28, el: 14, up: 0.03, mv: 1 },
  { t: T.fell1 + 0.3, tg: SCRF(0, -0.8), d: 42, az: -36, el: 5, up: 0.04, mv: 1 },
  { t: T.b2 + 0.15, tg: SCRF(0, -0.8), d: 41, az: -38, el: 5, up: 0.04 },
  { t: T.b2 + 1.1, tg: [6, 10, -18], d: 92, az: -6, el: 26, up: 0.02, mv: 1 },                           // the rewind: the towers sink…
  { t: T.diner + 0.25, tg: [5, 4.6, 2.5], d: 36, az: -10, el: 9, up: 0.05, mv: 1 },                       // …until only the diner is left, at night
  { t: T.b3 - 0.1, tg: [4, 4.2, 2.5], d: 31, az: -6, el: 8, up: 0.05 },
  { t: T.engineers + 0.5, tg: [BOOTH[0] + 0.3, 1.35, 1.3], d: 7.2, az: 4, el: 4, up: 0.06, mv: 1 },     // through the window: three engineers, at eye level
  { t: T.real + 0.4, tg: [BOOTH[0] + 0.3, 1.35, 1.3], d: 6.6, az: 8, el: 4, up: 0.06 },
  { t: T.jensen + 0.2, tg: [BOOTH[0] - 0.25, 1.3, 1.0], d: 5.6, az: 10, el: 4, up: 0.07, mv: 1 },
  { t: T.b5 + 0.15, tg: [BOOTH[0] - 0.25, 1.3, 1.0], d: 5.8, az: 12, el: 5, up: 0.07 },
  { t: T.games5 + 0.2, tg: [0, 6, -12], d: 64, az: 14, el: 22, up: 0.04, mv: 3 },                        // crane up: 33 years go by, the city grows
  { t: T.trillions + 0.4, tg: [0, 14, -44], d: 150, az: 18, el: 24, up: 0.03, mv: 1 },
  { t: T.b6 + 0.3, tg: [0, 3, -54], d: 34, az: 12, el: 14, up: 0.05, mv: 1 },                             // down to the plaza: the news arrives
  { t: T.affairs + 0.4, tg: [0, 2.6, -55], d: 28, az: 6, el: 15, up: 0.05 },
  { t: T.resigned, tg: FOUND(1.5), d: 16, az: 18, el: 11, up: 0.05, mv: 1 },                               // he walks out
  { t: T.immediately + 0.6, tg: FOUND(1.5), d: 15, az: 30, el: 10, up: 0.05 },
  { t: T.b8 + 0.4, tg: [0.6, 1.7, DOORZ + 3.0], d: 13.5, az: -14, el: 9, up: 0.06, mv: 1 },               // the finance chief steps in
  { t: T.boss8 + 0.4, tg: [0.6, 1.8, DOORZ + 3.2], d: 12.5, az: -20, el: 9, up: 0.06 },
  { t: T.cost, tg: SCRF(0, -0.8), d: 50, az: -34, el: 4, up: 0.04, mv: 1 },                               // the price screen
  { t: T.p14 + 0.5, tg: SCRF(0, -0.8), d: 48, az: -38, el: 4, up: 0.04 },
  { t: T.b11 + 0.3, tg: [-12, 18, -44], d: 50, az: -10, el: 32, up: 0.02, mv: 1 },                        // lift over the plaza…
  { t: T.chips11 + 0.2, tg: [-21, 1.2, CONV.z], d: 12.5, az: 28, el: 24, up: 0.05, mv: 1 },               // …to the chips on the belt
  { t: T.wipe1 - 0.25, tg: [-21.5, 1.4, CONV.z], d: 12, az: 24, el: 22, up: 0.12 },
  { t: T.wipe1 + 0.55, tg: [-21, 140, CONV.z], d: 40, az: 30, el: -42, up: 0, mv: 1 },                    // sky wipe → a bakery, somewhere
  { t: T.wipe1 + 1.05, tg: [BK[0], 135, BK[2] + 20], d: 40, az: 8, el: -25, up: 0, mv: 1 },                // (still looking up: travel above the bakery)
  { t: T.walks, tg: [BK[0] + 0.0, 2.0, BK[2] + 2.4], d: 16, az: 4, el: 9, up: 0.05, mv: 1 },               // …and come gently down to it
  { t: T.out + 0.6, tg: BAKERF, d: 15, az: -6, el: 9, up: 0.05, mv: 1 },
  { t: T.b13 + 0.2, tg: [BK[0] - 0.2, 2.0, BK[2] + 1.6], d: 17, az: 2, el: 10, up: 0.05, mv: 1 },
  { t: T.pay, tg: [BK[0] - 0.3, 2.0, BK[2] + 2.2], d: 16.5, az: 4, el: 10, up: 0.05 },
  { t: T.wipe2 - 0.25, tg: [BK[0] - 0.3, 2.2, BK[2] + 2.4], d: 16, az: 6, el: 11, up: 0.12 },
  { t: T.wipe2 + 0.55, tg: [LED[0] + 20, 150, LED[1]], d: 40, az: -60, el: -42, up: 0, mv: 1 },                  // sky wipe → back to the plaza, five days later
  { t: T.wipe2 + 1.6, tg: [LED[0], 1.4, LED[1]], d: 19, az: 6, el: 40, up: 0.05, mv: 1 },
  { t: T.books + 0.3, tg: [LED[0], 1.4, LED[1]], d: 16.5, az: 10, el: 38, up: 0.05 },
  { t: T.billion + 0.6, tg: [LED[0], 5.0, LED[1]], d: 27, az: 16, el: 12, up: 0.05, mv: 1 },
  { t: T.year15 + 0.8, tg: [LED[0], 5.0, LED[1]], d: 28, az: 6, el: 11, up: 0.05 },
  { t: T.evening + 0.3, tg: SCRF(0, -0.8), d: 50, az: -32, el: 4, up: 0.04, mv: 1 },                      // the screen that evening…
  { t: T.fell16 + 0.5, tg: SCRF(0, -0.8), d: 48, az: -38, el: 4, up: 0.04 },
  { t: T.p151 + 0.4, tg: [0, 30, -66], d: 64, az: 16, el: 9, up: 0.03, mv: 1 },
  { t: T.board + 0.2, tg: [0, ROOF + 0.9, -72], d: 13.5, az: 4, el: 36, up: 0.03, mv: 1 },               // up to the roof: behind the empty chair, down the table
  { t: T.back18 + 0.4, tg: [0, ROOF + 0.9, -72], d: 12.8, az: -4, el: 37, up: 0.03 },
  { t: T.newb + 0.2, tg: [0, ROOF + 2.2, -78], d: 15, az: 1, el: 26, up: 0.0, mv: 1 },                     // the search, over the far end of the table
  { t: T.b19 + 0.1, tg: [0, ROOF + 2.2, -78], d: 15.5, az: -1, el: 26, up: 0.0 },
  { t: T.over + 0.9, tg: [SEATS[0][0], ROOF + 1.0, SEATS[0][1] - 1.2], d: 11, az: 8, el: 42, up: 0.04, mv: 1 },
  { t: T.b20 + 0.3, tg: [SEATS[0][0], ROOF + 1.0, SEATS[0][1] - 1.2], d: 11.5, az: 4, el: 43, up: 0.04 },
  { t: T.markets, tg: [0, 12, -40], d: 165, az: 18, el: 27, up: 0.18, mv: 3 },                           // crane up over the city at golden hour
  { t: T.cta + 0.1, tg: [0, 10, -30], d: 160, az: 12, el: 25, up: 0.18 },
  { t: T.comment, tg: [4.2, 2.4, 2], d: 50, az: -10, el: 8, up: 0.0, mv: 1 },                               // back to where it began
  { t: DUR + 0.5, tg: [4.2, 2.6, 2], d: 46, az: -12, el: 8, up: 0.0 },
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

// ───────────────────────── tower growth: built (2026) → sink (rewind to 1993) → grow again over 33 years
const DMAX = Math.max(...TOWERS.map(w => w.dist));
TOWERS.forEach(w => { const k = w.dist / DMAX; w.s0 = T.b2 + 0.15 + (1 - k) * 0.25 + k * 1.1; w.g0 = w.hq ? T.worth - 0.35 : w.pylon ? T.ai - 0.2 : w.hall ? T.ai + 0.1 : T.b5 + 0.35 + k * 3.4 + (R() - 0.5) * 0.4; });
function growK(w, t) { if (t < T.b2) return 1; if (t < T.b5) return 1 - eio(seg(t, w.s0, w.s0 + 0.75)); return Math.max(0, back(seg(t, w.g0, w.g0 + 0.85))); }

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
const yearEl = mk('year', '2026'), subEl = mk('sub', 'Silicon Valley · a true money story');
const chip = mk('chip', '');
const nameJ = mk('name', '<div class="n">Jensen Huang</div><div class="r">co-founder · Nvidia · 1993</div>');
const nameK = mk('name', '<div class="n">Colette Kress</div><div class="r">finance chief → interim CEO</div>');
const tagNews = mk('tag', 'news reports');
const tagRes = mk('tag am', 'resigned · effective immediately');
const tagSame = [0, 1, 2].map(() => mk('tag', 'same <b>✓</b>'));
const tagOven = mk('tag', 'same oven <b>✓</b>'), tagBread = mk('tag', 'same bread <b>✓</b>'), tagPay = mk('tag am', 'price: <b>$ ?</b>');
const tagBaker = mk('tag grey', 'the famous baker');
const tagNew = mk('tag am', '$115.8B · 3 months'), tagOld = mk('tag grey', '$57.0B · a year before'), tagX2 = mk('tag am', '<b>×2</b>');
const board = mk('board', '<div class="t">Nvidia · one share</div><div class="row"><b>$150.96</b></div><div class="d">close · 18 Nov 2026</div><div class="src">11 Nov close: $173.73</div>');
const tagBack = mk('tag grey', 'no plans to bring him back'), tagSearch = mk('tag am', 'search: new CEO'), tagEmpty = mk('tag', 'the chair is empty');
const title = mk('title', '<div class="s">THE STORY OF</div><div class="n">The Founder\n<em>Who Left</em></div>');
const lesson = mk('lesson', 'Markets price\n<em>people</em>, too.');
const ctaChip = mk('chip am', 'you decide');
const boxes = [0, 1].map(() => { const e = mk('cbox', '<span class="in"></span><span class="post">Post</span>'); return { e, inn: e.querySelector('.in'), post: e.querySelector('.post') }; });
const foot = document.getElementById('foot');
foot.textContent = 'Sources: Nvidia statements (12 & 17 Nov 2026), Reuters, CBS News, AP, CNBC\nShare prices: Yahoo Finance, StatMuse · story as of 20 Nov 2026 · not advice';
const setTxt = (e, s) => { if (e.textContent !== s) e.textContent = s; };
const setHTML = (e, s) => { if (e._h !== s) { e._h = s; e.innerHTML = s; } };

function updateUI(t) {
  updateCaption(t);
  foot.style.opacity = (0.95 * seg(t, 0.8, 1.4) * (1 - seg(t, T.cta, T.cta + 0.3) * 0.45)).toFixed(3);
  // 1 — 2026; rewind to 1993; 33 years go by
  { let y = 2026, o = win(t, -1, T.nvidia + 0.2, 0.5, 0.3);
    if (t >= T.b2) { y = Math.round(lerp(2026, 1993, eo(seg(t, T.b2 + 0.1, T.y1993 + 0.25)))); o = win(t, T.b2, T.b3 - 0.1, 0.2, 0.3); }
    if (t >= T.b5) { y = Math.round(lerp(1993, 2026, seg(t, T.y33 - 0.1, T.trillions + 0.2))); o = win(t, T.b5 + 0.05, T.b6 - 0.1, 0.3, 0.35); }
    setTxt(yearEl, String(y)); put(yearEl, W / 2, 640, o, 1 + 0.05 * Math.sin(Math.min(1, seg(t, T.b2, T.b2 + 0.4)) * Math.PI)); put(subEl, W / 2, 780, t < T.b2 ? o * seg(t, 0.9, 1.3) : 0); }
  // chips
  let ct = '', co = 0, cp = 0;
  const CH = [[T.san - 0.1, T.b3 - 0.2, '1993 · San Jose, California'], [T.b3 + 0.05, T.b4 - 0.15, 'three engineers · one idea'], [T.games5 - 0.05, T.ai - 0.1, 'video games'], [T.ai, T.worth - 0.1, 'then A.I.'], [T.worth, T.b6 - 0.2, 'worth trillions'],
    [T.b6 + 0.05, T.b7 - 0.15, 'early November 2026'], [T.b7 + 0.05, T.b8 - 0.15, '12 Nov 2026 · Santa Clara'], [T.b9 + 0.1, T.b10 - 0.15, 'the night before · 11 Nov 2026'], [T.b10 + 0.05, T.b11 - 0.1, '12 Nov · morning low $148.80'],
    [T.b11 + 0.05, T.wipe1 + 0.2, 'nothing else changed'], [T.wipe1 + 0.8, T.b13 - 0.15, 'picture a bakery'], [T.wipe2 + 0.8, T.b15 - 0.15, '17 Nov 2026 · results'], [T.b15 + 0.05, T.b16 - 0.15, 'sales · quarter to 25 Oct 2026'],
    [T.b16 + 0.05, T.b17 - 0.2, '17 Nov evening → 18 Nov'], [T.b18 + 0.05, T.b19 - 0.15, 'the board · Nvidia'], [T.b19 + 0.05, T.b20 - 0.15, 'as of 20 Nov 2026']];
  for (const [a, b, s] of CH) { const o = win(t, a, b, 0.22, 0.22); if (o > co) { co = o; ct = s; cp = pop(t, a); } }
  if (ct) setTxt(chip, ct); put(chip, W / 2, 472, co, cp);
  // 4 — Jensen Huang; 8 — Colette Kress
  { const p = proj(JH.position.x, JH.position.y + 2.15, JH.position.z); put(nameJ, clampX(p[0], 300), clampY(p[1] - 30, 600, 1300), win(t, T.jensen, T.b5 + 0.1, 0.3, 0.25), pop(t, T.jensen)); }
  { const p = proj(kress.m.position.x, 2.6, kress.m.position.z); put(nameK, clampX(p[0], 300), clampY(p[1] - 40, 600, 1300), win(t, T.colette, T.boss8 + 0.3, 0.3, 0.25), pop(t, T.colette)); }
  // 6 — news; 7 — resigned
  { const p = proj(0, 6, -50); put(tagNews, clampX(p[0]), clampY(p[1]), win(t, T.reports, T.b7 - 0.1, 0.2, 0.25), pop(t, T.reports)); }
  { const f = founderPos(t), p = proj(f[0], 2.7, f[1]); put(tagRes, clampX(p[0], 300), clampY(p[1] - 20), win(t, T.resigned + 0.1, T.b8 - 0.1, 0.2, 0.25), pop(t, T.resigned + 0.1)); }
  // 11 — the chips are the same
  [-24.5, -21.2, -17.9].forEach((x, k) => { const p = proj(x, 2.3, CONV.z); const t0 = T.chips11 + 0.05 + k * 0.22; put(tagSame[k], clampX(p[0], 150), clampY(p[1] - 20), p[2] ? win(t, t0, T.wipe1 + 0.1, 0.15, 0.2) : 0, pop(t, t0)); });
  // 12–13 — the bakery
  { const p = bakerPos(t), q = proj(p[0], 3.0, p[1]); put(tagBaker, clampX(q[0], 220), clampY(q[1] - 20), win(t, T.baker, T.b13 - 0.05, 0.2, 0.2), pop(t, T.baker)); }
  { const [x, y, z] = bkW(bk.oven[0], 2.2, bk.oven[2]), p = proj(x, y, z); put(tagOven, clampX(p[0], 220), clampY(p[1]), win(t, T.ovens - 0.05, T.wipe2 - 0.1, 0.2, 0.2), pop(t, T.ovens - 0.05)); }
  { const [x, y, z] = bkW(bk.shelf[0], 3.4, bk.shelf[2]), p = proj(x, y, z); put(tagBread, clampX(p[0], 220), clampY(p[1]), win(t, T.bread - 0.05, T.wipe2 - 0.1, 0.2, 0.2), pop(t, T.bread - 0.05)); }
  { const p = proj(forSale.position.x, 4.2, forSale.position.z); put(tagPay, clampX(p[0], 200), clampY(p[1] - 20), win(t, T.pay, T.wipe2 - 0.1, 0.2, 0.2), pop(t, T.pay) * (1 + 0.08 * Math.sin(t * 9) * win(t, T.pay, T.wipe2, 0.2, 0.2))); }
  // 15 — the bars
  { const b = BARS[0], k = growBar(b, t), p = proj(LED[0] + b.x, 1.25 + b.h * k + 1.2, LED[1]); put(tagNew, clampX(p[0], 330), clampY(p[1] - 20), win(t, b.t0 + 0.4, T.b16 - 0.1, 0.25, 0.25), pop(t, b.t0 + 0.4)); }
  { const b = BARS[1], k = growBar(b, t), p = proj(LED[0] + b.x, 1.25 + b.h * k + 1.2, LED[1]); put(tagOld, clampX(p[0], 300), clampY(p[1] - 20), win(t, b.t0 + 0.3, T.b16 - 0.1, 0.25, 0.25), pop(t, b.t0 + 0.3)); }
  { const p = proj(LED[0], 7.6, LED[1]); put(tagX2, clampX(p[0]), clampY(p[1]), win(t, T.double, T.b16 - 0.1, 0.2, 0.25), pop(t, T.double)); }
  // 17 — one share, 18 November
  put(board, W / 2, 1080, win(t, T.eighteenth, T.b18 - 0.05, 0.3, 0.25), pop(t, T.eighteenth));
  // 18 — the board; the search; 19 — not over
  { const p = proj(SEATS[0][0], ROOF + 2.6, SEATS[0][1]); put(tagBack, clampX(p[0], 300), clampY(p[1] - 30), win(t, T.back18 - 0.2, T.looking - 0.1, 0.2, 0.25), pop(t, T.back18 - 0.2)); put(tagEmpty, clampX(p[0], 260), clampY(p[1] - 30), win(t, T.over + 0.2, T.b20 + 0.6, 0.2, 0.25), pop(t, T.over + 0.2)); }
  { const m = magPos(t), p = proj(m[0], m[1] - 2.2, m[2]); put(tagSearch, clampX(p[0], 220), clampY(p[1] - 20), win(t, T.newb, T.b19 + 0.4, 0.2, 0.25), pop(t, T.newb)); }
  // 20 — title and lesson; 21 — you decide
  put(title, W / 2, 640, win(t, T.story, T.cta - 0.1, 0.4, 0.3), 0.94 + 0.06 * eo(seg(t, T.story, T.story + 0.6)));
  put(lesson, W / 2, 1180, win(t, T.markets, T.cta - 0.15, 0.3, 0.25), pop(t, T.markets));
  put(ctaChip, W / 2, 472, seg(t, T.decide, T.decide + 0.3), pop(t, T.decide));
  [[T.sell, 'SELL', T.postA], [T.hold, 'HOLD', T.postB]].forEach(([t0, word, tp], i) => {
    const bx = boxes[i], n = Math.min(4, Math.floor(c01((t - t0) / 0.45) * 4.001)), typed = word.slice(0, n), caret = (n < 4 || Math.floor(t * 2.4) % 2) && t < tp ? '<i></i>' : '';
    setHTML(bx.inn, typed ? `<b>${typed}</b>${caret}` : `<em>Add a comment…</em>${caret}`); const sent = t > tp; const pc = sent ? 'post on sent' : n === 4 ? 'post on' : 'post'; if (bx.post.className !== pc) bx.post.className = pc; setTxt(bx.post, sent ? 'Posted ✓' : 'Post');
    const ts = i ? T.held + 0.1 : T.comment; put(bx.e, W / 2, 1330 + i * 132, seg(t, ts, ts + 0.3), pop(t, ts) * (1 + 0.06 * win(t, tp, tp + 0.3, 0.08, 0.2)));
  });
}
const growBar = (b, t) => eo(seg(t, b.t0, b.t1));

// ───────────────────────── one frame
const hopY = (hops, t, h = 0.5) => { let y = 0; for (const t0 of hops) { const u = (t - t0) / 0.38; if (u > 0 && u < 1) y = Math.max(y, Math.sin(u * Math.PI) * h); } return y; };
const _m4 = new THREE.Matrix4(), _q = new THREE.Quaternion(), _e = new THREE.Euler(), _p = new THREE.Vector3(), _s = new THREE.Vector3();
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

  // night lights: windows, lamps, the diner, the sign
  const twinkle = t > T.cta ? 0.15 * Math.sin(t * 3.1) : 0;
  WIN_LIT.emissiveIntensity = Math.max(0, night * 1.05 + twinkle);
  lampM.emissiveIntensity = night * 1.4;
  const dinerOn = Math.max(night, t > T.b2 && t < T.b5 + 1 ? 1 : 0);
  dinerLight.intensity = 22 * dinerOn; GLASS_M.opacity = 0.18 + 0.1 * dinerOn;
  { const k = 0.55 + 0.45 * Math.max(night, t > T.b2 && t < T.b5 + 1 ? 1 : 0); signM.color.setRGB(k, k, k); }
  ledM.emissiveIntensity = (t > T.ai - 0.2 ? 0.9 : 0) * (0.6 + 0.4 * Math.sin(t * 7));
  // the city: sink and grow
  for (const w of TOWERS) { const k = growK(w, t); w.g.visible = k > 0.003; if (w.g.visible) w.g.scale.set(1, Math.max(0.003, k), 1); }
  const city2026 = t < T.b2 + 1.3 || t > T.ai - 0.2; flat26M.visible = city2026; trees.forEach(m => m.visible = city2026);
  conv.visible = chips.visible = t > T.ai + 0.3 || t < T.b2 + 1.0; book.visible = t > T.wipe2 && t < T.b18 + 0.5; BARS.forEach(b => b.m.visible = book.visible);
  TBL.visible = spot.visible = t > T.p151 && t < T.cta; boardP.forEach(m => m.visible = TBL.visible); mag.visible = t > T.looking - 0.3 && t < T.b20 + 0.4;
  // cars drive along the road
  for (const c of CARS) { const L = 700, x = ((c.off + t * c.v) % L) - L / 2; c.m.position.set(c.dir * x, 0, c.z); c.m.rotation.y = c.dir > 0 ? 0 : Math.PI; }
  // the booth: an idea over the table
  { const ch = win(t, T.chip, T.b5 + 0.5, 0.35, 0.4), sp = win(t, T.video, T.real + 0.1, 0.3, 0.05), ss = win(t, T.real + 0.05, T.jensen - 0.1, 0.15, 0.35);
    ideaChip.visible = ch > 0.01; ideaChip.position.set(IDEA[0] + 0.2, IDEA[1] + 0.12 * Math.sin(t * 2.2), IDEA[2]); ideaChip.rotation.set(0.5, t * 1.4, 0.2); ideaChip.scale.setScalar(Math.max(0.01, back(seg(t, T.chip, T.chip + 0.4))) * 0.5);
    shipPix.visible = sp > 0.01; shipPix.position.set(IDEA[0] + 0.85, IDEA[1] + 0.1 + 0.08 * Math.sin(t * 3), IDEA[2]); shipPix.rotation.set(0, -Math.PI / 2 + Math.sin(t * 1.6) * 0.4, Math.PI / 2); shipPix.scale.setScalar(Math.max(0.01, sp));
    shipSmooth.visible = ss > 0.01; shipSmooth.position.set(IDEA[0] + 0.85, IDEA[1] + 0.12 + 0.08 * Math.sin(t * 3), IDEA[2]); shipSmooth.rotation.set(0, -Math.PI / 2 + Math.sin(t * 1.6) * 0.4, 0); shipSmooth.scale.setScalar(0.55 * Math.max(0.01, back(seg(t, T.real + 0.05, T.real + 0.45))) * (ss > 0 ? 1 : 0.01));
    const gk = Math.max(ch, Math.max(sp, ss)) * win(t, T.chip, T.b5 + 0.4, 0.3, 0.4); ideaGlow.visible = gk > 0.01; glowM.opacity = gk * 0.75; ideaGlow.position.set(IDEA[0] + 0.45, IDEA[1] + 0.1, IDEA[2] + 0.2); ideaGlow.scale.setScalar(2.4 + 0.2 * Math.sin(t * 4)); ideaGlow.lookAt(camera.position); }
  eng.forEach((m, i) => { m.position.y = -0.12 + hopY([T.engineers + 0.1 + i * 0.12, T.real + 0.2 + i * 0.1], t, 0.12); m.rotation.z = Math.sin(t * 1.7 + i) * 0.03; });
  // people
  for (const c of CAST) { const on = c.show(t); c.m.visible = on; if (!on) continue; c.m.position.set(c.x, 0, c.z); c.m.rotation.set(0, c.ry, 0); }
  { const f = founderPos(t); founder.m.position.set(f[0], f[3] ? Math.abs(Math.sin(t * 7.5)) * 0.07 : 0, f[1]); founder.m.rotation.y = f[2]; }
  { const k = kressPos(t), walking = t > T.b8 - 0.3 && t < T.colette + 0.1; kress.m.position.set(k[0], walking ? Math.abs(Math.sin(t * 7.5)) * 0.06 : hopY([T.interim], t, 0.12), k[1]); kress.m.rotation.y = Math.PI / 2 * -1 + (walking ? 0 : 0) + Math.PI; }
  REP.forEach((r, i) => { const f = founderPos(t); const look = t > T.resigned - 0.4 && t < T.b8 ? Math.atan2(-(f[1] - r.z), f[0] - r.x) : t >= T.b8 ? Math.atan2(-(DOORZ + 3.6 - r.z), 0.6 - r.x) : r.ry; r.m.rotation.y = look; r.m.position.y = hopY([T.resigned + 0.1 + i * 0.07], t, 0.25); });
  walkers.forEach((w, i) => { const q = WALK[i], u = (Math.sin((t * q.sp + q.ph) * Math.PI * 2) + 1) / 2, dir = Math.cos((t * q.sp + q.ph) * Math.PI * 2) > 0 ? 1 : -1; const x = lerp(q.a[0], q.b[0], u), z = lerp(q.a[1], q.b[1], u); w.m.position.set(x, Math.abs(Math.sin(t * 7 + i)) * 0.06, z); w.m.rotation.y = Math.atan2(-(q.b[1] - q.a[1]) * dir, (q.b[0] - q.a[0]) * dir); });
  vans.forEach((v, i) => { const u = eo(seg(t, T.b6 - 0.4 + i * 0.35, T.news + 0.9 + i * 0.35)); v.m.visible = DAYP(t); v.m.position.set(lerp(v.x0, v.x1, u), 0, lerp(v.z0, v.z1, u)); v.m.rotation.y = v.x1 < v.x0 ? Math.PI : 0; });
  { const b = bakerPos(t); baker.m.position.set(b[0], b[3] ? Math.abs(Math.sin(t * 7)) * 0.07 : 0, b[1]); baker.m.rotation.y = b[3] ? b[2] : Math.PI / 2 * -1 + Math.PI; }
  queue.forEach((q, i) => { const b = bakerPos(t); q.m.rotation.y = t > T.walks ? Math.atan2(-(b[1] - q.z), b[0] - q.x) : Math.PI; q.m.position.y = hopY([T.pay + 0.15 + i * 0.1], t, 0.18); });
  boardP.forEach((m, i) => { m.position.y = ROOF - 0.34 + hopY([T.back18 - 0.1 + (i % 4) * 0.08], t, 0.1); });
  // newspapers
  PAP.forEach((p, i) => { const u = (t - p.t0) / 1.7, on = DAYP(t) && u > 0 && t < T.b11; if (!on) { _s.set(0, 0, 0); papers.setMatrixAt(i, _m4.compose(_p.set(0, -50, 0), _q.identity(), _s)); return; }
    const v = c01(u), y = lerp(p.h, 0.06, eo(v)), sw = (1 - v) * 1.8; _p.set(p.x + Math.sin(t * 2.4 + p.sp) * sw, y, p.z + Math.cos(t * 2.0 + p.sp) * sw * 0.6); _e.set(v < 1 ? Math.sin(t * 5 + p.sp) * 0.9 : -Math.PI / 2, p.rz + t * (v < 1 ? 2 : 0), v < 1 ? Math.cos(t * 4 + p.sp) * 0.6 : 0); _q.setFromEuler(_e); _s.set(2.4, 2.4, 2.4); papers.setMatrixAt(i, _m4.compose(_p, _q, _s)); });
  papers.instanceMatrix.needsUpdate = true;
  // camera flashes
  flashes.forEach((f, i) => { const k = Math.exp(-Math.pow((t - FLASH_T[i]) / 0.06, 2)); f.visible = k > 0.02 && DAYP(t); const r = REP[[1, 3, 0, 4, 2, 1][i]]; f.position.set(r.m.position.x + 0.3, 1.55, r.m.position.z); f.scale.setScalar(2.6 * k); f.material.opacity = k; });
  // chips on the belt
  for (let i = 0; i < NCH; i++) { const x = chipX(i, t); chips.setMatrixAt(i, M(x, 1.1, CONV.z, 0, 0.2 * Math.sin(i), 0, 0.85, 0.85, 0.85)); } chips.instanceMatrix.needsUpdate = true;
  // the bakery
  ovenGlowM.opacity = 0.75 + 0.2 * Math.sin(t * 6) * Math.sin(t * 2.3);
  { const k = back(seg(t, T.pay - 0.15, T.pay + 0.3)); forSale.scale.set(1, Math.max(0.001, k), 1); forSale.visible = k > 0.002; forSale.rotation.z = Math.sin(t * 7) * 0.03 * win(t, T.pay, T.wipe2, 0.2, 0.2); }
  // the ledger and the bars
  { const u = eio(seg(t, T.opened - 0.25, T.books + 0.35)); book.userData.pivots.forEach(p => p.rotation.z = p.userData.s * Math.PI / 2 * 0.985 * (1 - u)); }
  BARS.forEach(b => { const k = growBar(b, t); b.m.scale.set(1, Math.max(0.001, k * b.h), 1); b.m.visible = book.visible && k > 0.001; });
  // the roof: spotlight on the empty chair; the magnifier
  spotM.opacity = 0.55 * win(t, T.board, T.b20 + 1.5, 0.4, 0.4);
  { const p = magPos(t); mag.position.set(p[0], p[1], p[2]); mag.lookAt(camera.position); mag.rotateZ(0.5 + 0.1 * Math.sin(t * 2)); }
  // palms, clouds
  for (const p of palms) p.rotation.z = Math.sin(t * 1.25 + p.userData.ph) * 0.04;
  for (const c of clouds) { c.position.x = c.userData.x0 + t * 1.2; c.material.opacity = 0.9 - 0.5 * night; const k = lerp(1, 0.45, night); c.material.color.setRGB(lerp(s.hor[0], 1, 0.55) * k, lerp(s.hor[1], 1, 0.55) * k, lerp(s.hor[2], 1, 0.55) * k * 1.05); c.material.emissive.setRGB(c.material.color.r * 0.35, c.material.color.g * 0.35, c.material.color.b * 0.35); }
  // sparkles: the idea, the new quarter, the final wish
  { let k = 0; const put3 = (x, y, z, sz, on) => { const sp = sparks[k++]; if (!sp) return; const tw = Math.pow(Math.abs(Math.sin(t * sp.userData.w + sp.userData.ph)), 3); sp.position.set(x, y, z); sp.scale.setScalar(sz * (0.25 + tw)); sp.material.opacity = on * (0.25 + 0.75 * tw); sp.visible = on > 0.01; };
    const s1 = win(t, T.chip, T.b5 + 0.3, 0.3, 0.4); for (let i = 0; i < 8; i++) { const a = i * 0.785 + t * 0.9; put3(IDEA[0] + Math.cos(a) * 0.9, IDEA[1] + 0.2 + Math.sin(a * 1.3) * 0.3, IDEA[2] + Math.sin(a) * 0.5, 0.22, s1); }
    const s2 = win(t, T.billion, T.b16 - 0.2, 0.3, 0.4); for (let i = 0; i < 10; i++) { const a = i * 0.63 + t * 0.7; put3(LED[0] + BARS[0].x + Math.cos(a) * 1.8, 1.25 + BARS[0].h * growBar(BARS[0], t) * (0.3 + (i % 5) * 0.16), LED[1] + Math.sin(a) * 1.8, 1.0, s2); }
    const s3 = win(t, T.postA, DUR + 1, 0.4, 0.1); for (let i = 0; i < 18; i++) { const ph = (t * 0.35 + i / 18) % 1, a = i * 2.4; put3(-1 + Math.cos(a) * (3 + ph * 4), 1 + ph * 14, 1 + Math.sin(a) * (2 + ph * 3), 0.9 + 0.6 * (1 - ph), s3 * Math.sin(ph * Math.PI)); }
    while (k < sparks.length) sparks[k++].visible = false; }
  drawScreen(t);
  updateBirds(t);
  dome.position.copy(camera.position); stars.position.copy(camera.position);
  orb.visible = halo.visible = s.orbS > 0.5 && s.star < 0.9;
  orb.position.set(camera.position.x + sd[0] * 1800, camera.position.y + sd[1] * 1800, camera.position.z + sd[2] * 1800); orb.scale.setScalar(s.orbS * 2); orb.lookAt(camera.position); orbM.color.setRGB(...s.orb);
  halo.position.copy(orb.position); halo.scale.setScalar(s.orbS * 13); halo.lookAt(camera.position); haloM.color.setRGB(...s.orb); haloM.opacity = 0.75;
  const S2 = Math.min(170, Math.max(18, camD * 0.85));
  sun.target.position.copy(camTg); sun.position.set(camTg.x + sd[0] * 400, camTg.y + sd[1] * 400, camTg.z + sd[2] * 400);
  const sc = sun.shadow.camera; sc.left = -S2; sc.right = S2; sc.top = S2; sc.bottom = -S2; sc.updateProjectionMatrix();
  renderer.render(scene, camera);
  updateUI(t);
}
window.camCheck = () => {
  const out = []; let cur = null;
  for (let f = 0; f < Math.ceil(DUR * 30); f++) {
    const t = f / 30; setCamera(t); const c = camera.position; let hit = null;
    for (const [x0, x1, z0, z1, y1, nm, ti] of stat) { if (ti !== undefined && growK(TOWERS[ti], t) < 0.05) continue; const yy = ti !== undefined ? y1 * Math.min(1, growK(TOWERS[ti], t)) : y1; if (c.x > x0 - 0.9 && c.x < x1 + 0.9 && c.z > z0 - 0.9 && c.z < z1 + 0.9 && c.y < yy + 0.9) { hit = nm + '@' + x0.toFixed(0) + ',' + z0.toFixed(0); break; } }
    if (!hit && c.y < 1.2) hit = 'ground';
    if (!hit && Math.abs(c.x) < 7.3 && Math.abs(c.z) < 3.4 && c.y < 4.2) hit = 'diner';
    if (hit) { if (cur && cur[2] === hit && f - cur[1] <= 1) cur[1] = f; else { cur = [f, f, hit]; out.push(cur); } }
  }
  return out.map(([a, b, n]) => `${(a / 30).toFixed(2)}-${(b / 30).toFixed(2)}s ${n}`);
};
window.renderAt = renderAt; window.__dbg = { founder, kress, camera, TOWERS, mag };
window.CUES = {
  T, DUR, sent: TIM.sentences.map(s => s.s),
  typingA: [0, 1, 2, 3].map(i => +(T.sell + (i + 0.5) * 0.11).toFixed(3)), typingB: [0, 1, 2, 3].map(i => +(T.hold + (i + 0.5) * 0.11).toFixed(3)),
  sink: [...new Set(TOWERS.map(w => +w.s0.toFixed(1)))].sort((a, b) => a - b), grow: [...new Set(TOWERS.map(w => +w.g0.toFixed(1)))].sort((a, b) => a - b),
  papers: PAP.map(p => +(p.t0 + 1.7).toFixed(2)), flashes: FLASH_T.map(x => +x.toFixed(3)), vans: [T.b6 - 0.4, T.b6 - 0.05].map(x => +x.toFixed(3)),
  bars: BARS.map(b => [+b.t0.toFixed(3), +b.t1.toFixed(3)]), postA: +T.postA.toFixed(3), postB: +T.postB.toFixed(3),
};
document.fonts.ready.then(() => Promise.all(['700 64px Figtree', '900 190px Fraunces', '800 30px JBM', '700 22px Inter', '700 78px Fraunces', '800 54px Figtree', '600 34px Figtree', '500 18px Inter', '900 128px Fraunces', '800 104px JBM', '800 46px Inter', '900 150px Figtree'].map(f => document.fonts.load(f)))).then(() => { renderAt(0); window.__ready = true; });
