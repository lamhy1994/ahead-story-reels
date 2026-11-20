// The Island of Stone Money — low-poly storybook scene (deterministic: window.renderAt(t) draws the frame for time t)
import * as THREE from 'three';
import { C, SKIN, MAT, rng, M, GB, person, palm, cloud, house, feiGeo, feiFace, fei, canoe, raft, hut, rockIsle, bushTree, FISH } from './kit.js';

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
const R = rng(19030614);

// ───────────────────────── story clock (everything hangs off the narration)
const T = {
  rich1: wt(1, 'rich') - 0.1, bottom: wt(1, 'bottom') - 0.15, sea: wt(1, 'sea') - 0.1,
  b2: S(2) - 0.05, name: wt(2, 'William') - 0.12, yap: wt(2, 'Yap') - 0.1,
  b3: S(3) - 0.05, stone3: wt(3, 'stone') - 0.15, twelve: wt(3, 'twelve') - 0.15,
  b4: S(4) - 0.05, palau: wt(4, 'Palau') - 0.1, raft4: wt(4, 'raft') - 0.1,
  b5: S(5) - 0.05, canoe5: wt(5, 'canoe') - 0.1, stone5: wt(5, 'stone') - 0.1, never: wt(5, 'never') - 0.1, move: wt(5, 'move') - 0.1, everyone: wt(5, 'Everyone') - 0.1, remembers: wt(5, 'remembers') - 0.1, owner: wt(5, 'owner') - 0.1,
  b6: S(6) - 0.05, friend: wt(6, 'friend') - 0.1, great: wt(6, 'great') - 0.1,
  wipe1: S(7) - 0.5, voyage: wt(7, 'voyage') - 0.1, storm: wt(7, 'storm') - 0.05,
  b8: S(8) - 0.05, cut: wt(8, 'cut') - 0.05, loose: wt(8, 'loose') - 0.1, stone8: wt(8, 'stone') - 0.2, sank: wt(8, 'sank') - 0.1,
  wipe2: S(9) - 0.45, swore: wt(9, 'swore') - 0.1, magnificent: wt(9, 'magnificent') - 0.1, agreed: wt(9, 'agreed') - 0.1, counted: wt(9, 'counted') - 0.1,
  b10: S(10) - 0.05, stayed: wt(10, 'stayed') - 0.1, rich10: wt(10, 'rich') - 0.1, generations: wt(10, 'generations') - 0.1,
  wipe3: S(11) - 0.45, german: wt(11, 'German') - 0.1, chiefs: wt(11, 'chiefs') - 0.1, ignored: wt(11, 'ignored') - 0.1, orders: wt(11, 'orders') - 0.1, paths11: wt(11, 'paths') - 0.1,
  b12: S(12) - 0.05, doctor12: wt(12, 'doctor') - 0.1, officials: wt(12, 'officials') - 0.1, pay: wt(12, 'pay') - 0.1, paint: wt(12, 'paint') - 0.1, black: wt(12, 'black') - 0.1, crosses: wt(12, 'crosses') - 0.1, finest: wt(12, 'finest') - 0.1, stones12: wt(12, 'stones') - 0.1,
  b13: S(13) - 0.05, poor: wt(13, 'poor') - 0.1, people: wt(13, 'people') - 0.1, fixed: wt(13, 'fixed') - 0.1,
  b14: S(14) - 0.05, wiped: wt(14, 'wiped') - 0.1, everyone14: wt(14, 'everyone') - 0.1, rich14: wt(14, 'rich') - 0.1,
  b15: S(15) - 0.05, story: wt(15, 'story') - 0.15, money2: wt(15, 'money', 1) - 0.1, agree: wt(15, 'agree') - 0.1,
  cta: S(16) - 0.1, comment: wt(16, 'comment') - 0.15, word: wt(16, 'STONE') - 0.3, something: wt(16, 'something') - 0.15, lost: wt(16, 'lost') - 0.1, home16: wt(16, 'home') - 0.1, just: wt(16, 'Just') - 0.05,
};
T.posted = T.something - 0.35;
window.T = T;

// ───────────────────────── renderer, sky, light
const canvas = document.getElementById('gl');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: QP.get('aa') !== '0', preserveDrawingBuffer: true });
renderer.setPixelRatio(1); renderer.setSize(W, H, false);
renderer.toneMapping = THREE.NeutralToneMapping; renderer.toneMappingExposure = 1.0;
renderer.shadowMap.enabled = QP.get('sh') !== '0'; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
const scene = new THREE.Scene(); scene.fog = new THREE.Fog(0xffffff, 70, 520);
const camera = new THREE.PerspectiveCamera(35, W / H, 0.5, 2400);
const hemi = new THREE.HemisphereLight(0xffffff, 0x886644, 1.5); scene.add(hemi);
const sun = new THREE.DirectionalLight(0xffffff, 3); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); sun.shadow.bias = -0.0005; sun.shadow.normalBias = 0.3; sun.shadow.camera.near = 1; sun.shadow.camera.far = 760; scene.add(sun, sun.target);

const hx = h => { const c = new THREE.Color(h); return [c.r, c.g, c.b]; };
const P = (top, mid, hor, fog, sunC, sunI, hemS, hemG, hemI, star, glow, az, el, orb, orbS, fn, ff, wat) => ({ top: hx(top), mid: hx(mid), hor: hx(hor), fog: hx(fog), sunC: hx(sunC), sunI, hemS: hx(hemS), hemG: hx(hemG), hemI, star, glow, az, el, orb: hx(orb), orbS, fn, ff, wat: hx(wat) });
const PRE = {
  DAWN: P(0x33468A, 0xE08C8E, 0xFFCB86, 0xF2C49A, 0xFFB878, 2.7, 0x9AAEE6, 0x7A8A6A, 1.3, 0.12, 0.15, 95, 10, 0xFFD9A0, 44, 80, 560, 0x2E86AE),
  MORN: P(0x4E9FDC, 0x9FD0EA, 0xFBE6BC, 0xE4E7D8, 0xFFE2B0, 3.2, 0xBFDFFF, 0x8E9C6E, 1.6, 0, 0, 70, 32, 0xFFF0C8, 40, 90, 600, 0x1C98BF),
  DAY: P(0x2F8FDA, 0x86C6EE, 0xEAF3F0, 0xDCEBEE, 0xFFF1D6, 3.5, 0xCFE8FF, 0x94A66C, 1.7, 0, 0, 32, 52, 0xFFF8E0, 38, 100, 640, 0x16A4C6),
  GOLDEN: P(0x3C7FCB, 0xF2C58A, 0xFFD79A, 0xF6CF9A, 0xFFC878, 3.2, 0xE8D2B0, 0x9A8A55, 1.5, 0, 0.1, 285, 20, 0xFFE0A0, 44, 90, 600, 0x2A8EB4),
  SUNSET: P(0x2E2F72, 0xE0707A, 0xFFB25E, 0xEE9A6A, 0xFF9050, 2.6, 0xA98AC0, 0x7A5A44, 1.25, 0.12, 0.55, 266, 8, 0xFFB060, 50, 80, 560, 0x2D6290),
  DUSK: P(0x141A4C, 0x4A3F86, 0xC06A78, 0x6A4A78, 0x93A4F4, 1.7, 0x5A62B0, 0x3A2A40, 1.15, 0.65, 0.9, 296, 36, 0xFFF4D6, 30, 70, 520, 0x1D3C6C),
  STORM: P(0x18213A, 0x2C3A50, 0x4E5C6E, 0x3C4858, 0xAABAD8, 1.8, 0x8090C0, 0x343C48, 1.4, 0, 0.6, 300, 42, 0x9AA6C0, 0.01, 34, 240, 0x2C4C60),
};
const SKY = [[0, 'MORN'], [5.0, 'MORN'], [S(3) + 1.2, 'DAY'], [S(6) - 0.9, 'DAY'], [S(6) + 0.7, 'SUNSET'], [T.wipe1 + 0.15, 'SUNSET'], [T.wipe1 + 1.0, 'STORM'], [T.wipe2 - 0.1, 'STORM'], [T.wipe2 + 0.75, 'MORN'],
  [T.wipe3 + 0.15, 'MORN'], [T.wipe3 + 1.0, 'DAY'], [T.b15 - 0.4, 'DAY'], [T.b15 + 2.4, 'GOLDEN'], [T.cta + 0.2, 'GOLDEN'], [T.something, 'GOLDEN'], [DUR + 4, 'SUNSET']];
const sky = {};
function skyAt(t) {
  let i = 0; while (i < SKY.length - 2 && t >= SKY[i + 1][0]) i++;
  const a = PRE[SKY[i][1]], b = PRE[SKY[i + 1][1]], u = sm(SKY[i][0], SKY[i + 1][0], t);
  for (const k in a) sky[k] = Array.isArray(a[k]) ? [lerp(a[k][0], b[k][0], u), lerp(a[k][1], b[k][1], u), lerp(a[k][2], b[k][2], u)] : lerp(a[k], b[k], u);
  return sky;
}
const domeG = new THREE.SphereGeometry(1900, 24, 14); domeG.setAttribute('color', new THREE.Float32BufferAttribute(new Float32Array(domeG.attributes.position.count * 3), 3));
const dome = new THREE.Mesh(domeG, new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide, fog: false, depthWrite: false, toneMapped: false })); dome.renderOrder = -10; scene.add(dome);
function paintSky(s) {
  const p = domeG.attributes.position, c = domeG.attributes.color;
  for (let i = 0; i < p.count; i++) {
    const y = p.getY(i) / 1900; let r, g, b;
    if (y <= 0) { r = s.hor[0]; g = s.hor[1]; b = s.hor[2]; }
    else if (y < 0.25) { const u = y / 0.25; r = lerp(s.hor[0], s.mid[0], u); g = lerp(s.hor[1], s.mid[1], u); b = lerp(s.hor[2], s.mid[2], u); }
    else { const u = Math.min(1, (y - 0.25) / 0.6); r = lerp(s.mid[0], s.top[0], u); g = lerp(s.mid[1], s.top[1], u); b = lerp(s.mid[2], s.top[2], u); }
    c.setXYZ(i, r, g, b);
  }
  c.needsUpdate = true;
}
const starG = new THREE.BufferGeometry(); { const a = []; for (let i = 0; i < 700; i++) { const u = R(), th = R() * Math.PI * 2, y = 0.04 + 0.96 * u, r = Math.sqrt(1 - y * y); a.push(r * Math.cos(th) * 1700, y * 1700, r * Math.sin(th) * 1700); } starG.setAttribute('position', new THREE.Float32BufferAttribute(a, 3)); }
const starM = new THREE.PointsMaterial({ color: 0xffffff, size: 2.6, sizeAttenuation: false, transparent: true, fog: false, depthWrite: false, toneMapped: false });
const stars = new THREE.Points(starG, starM); scene.add(stars);
function radial(inner, outer) { const cv = document.createElement('canvas'); cv.width = cv.height = 128; const g = cv.getContext('2d'); const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, inner); gr.addColorStop(1, outer); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); const tx = new THREE.CanvasTexture(cv); tx.colorSpace = THREE.SRGBColorSpace; return tx; }
const orbM = new THREE.MeshBasicMaterial({ color: 0xffffff, fog: false, toneMapped: false, depthWrite: false });
const orb = new THREE.Mesh(new THREE.CircleGeometry(1, 28), orbM); scene.add(orb);
const haloM = new THREE.MeshBasicMaterial({ map: radial('rgba(255,255,255,0.55)', 'rgba(255,255,255,0)'), transparent: true, fog: false, toneMapped: false, depthWrite: false, blending: THREE.AdditiveBlending });
const halo = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), haloM); scene.add(halo);

// ───────────────────────── the island, the lagoon and the reef
const HS = [16, -6.6, 31];                        // the sunken stone on its sandy shelf (hook + legend)
function islandQ(x, z) { const dx = x / 100, dz = (z + 60) / 64, a = Math.atan2(dz, dx); return Math.hypot(dx, dz) * (1 + 0.05 * Math.sin(3 * a + 1.3) + 0.035 * Math.sin(5 * a + 0.4)); }
function terrainY(x, z) {
  const q = islandQ(x, z); let y;
  if (q <= 1.0) {
    y = lerp(0.3, 0.95, sm(1.0, 0.93, q)) + 0.12 * Math.sin(x * 0.21) * Math.sin(z * 0.17) * sm(0.97, 0.9, q);
    const hm = sm(-36, -64, z) * sm(0.97, 0.7, q), hill = (3.4 + 2.2 * Math.sin(x * 0.045 + 1.0) + 1.6 * Math.sin(z * 0.06 + x * 0.025) + 0.9 * Math.sin((x - z) * 0.11)) * 2.3;
    y += hm * Math.max(0, hill);
  } else {
    y = lerp(0.3, -1.5, sm(1.0, 1.06, q)) + 1.05 * Math.exp(-Math.pow((q - 1.30) / 0.028, 2));
    y = lerp(y, -14, sm(1.32, 1.56, q));
  }
  const dh = Math.hypot(x - HS[0], z - HS[2]); y = lerp(HS[1] - 0.05, y, sm(5, 11, dh));
  return y;
}
const groundY = terrainY;
{
  const g = new THREE.PlaneGeometry(460, 320, 184, 128).rotateX(-Math.PI / 2).translate(0, 0, -40).toNonIndexed();
  const p = g.attributes.position, col = new Float32Array(p.count * 3), cA = new THREE.Color(), cB = new THREE.Color();
  for (let i = 0; i < p.count; i += 3) {
    let mx = 0, mz = 0, my = 0;
    for (let k = 0; k < 3; k++) { const x = p.getX(i + k), z = p.getZ(i + k), y = terrainY(x, z); p.setY(i + k, y); mx += x / 3; mz += z / 3; my += y / 3; }
    const n = R(), q = islandQ(mx, mz);
    if (my > 0.55 && q < 0.985) { cA.set(my > 3 ? 0x4F8F4A : 0x6FA85A); cB.set(0x5E9A4E); cA.lerp(cB, n * 0.6); cA.offsetHSL(0, 0, (n - 0.5) * 0.04); }
    else if (my > -0.25) { cA.set(0xEBD9A8); cA.offsetHSL(0, 0, (n - 0.5) * 0.03); }
    else if (my > -2.2) { cA.set(q > 1.27 && q < 1.33 ? (n < 0.5 ? 0xD99A86 : 0xC9B07A) : 0xE6DAB0); cA.offsetHSL(0, 0, (n - 0.5) * 0.04); }
    else if (Math.hypot(mx - HS[0], mz - HS[2]) < 8.5) { cA.set(0xE2D4A8); cA.offsetHSL(0, 0, (n - 0.5) * 0.04); }
    else { cA.set(0xD2C496); cB.set(0x1F4C68); cA.lerp(cB, c01((-my - 2.2) / 10)); cA.offsetHSL(0, 0, (n - 0.5) * 0.03); }
    for (let k = 0; k < 3; k++) { col[(i + k) * 3] = cA.r; col[(i + k) * 3 + 1] = cA.g; col[(i + k) * 3 + 2] = cA.b; }
  }
  g.setAttribute('color', new THREE.BufferAttribute(col, 3)); g.computeVertexNormals();
  const land = new THREE.Mesh(g, MAT); land.receiveShadow = true; scene.add(land);
}
const deep = new THREE.Mesh(new THREE.PlaneGeometry(5000, 5000).rotateX(-Math.PI / 2), new THREE.MeshLambertMaterial({ color: 0x174866 })); deep.position.y = -15.5; scene.add(deep);
// the sea: one wave sheet that follows the camera on a fixed grid (so the facets never swim)
const WSEG = 150, WSZ = 1500, WST = WSZ / WSEG;
const waterG = new THREE.PlaneGeometry(WSZ, WSZ, WSEG, WSEG).rotateX(-Math.PI / 2);
const WX = Float32Array.from({ length: waterG.attributes.position.count }, (_, i) => waterG.attributes.position.getX(i)), WZ = Float32Array.from({ length: waterG.attributes.position.count }, (_, i) => waterG.attributes.position.getZ(i));
const waterM = new THREE.MeshPhongMaterial({ color: 0x1AA3C4, emissive: 0x0A3A50, emissiveIntensity: 0.3, specular: 0xBFEFFF, shininess: 70, flatShading: true, transparent: true, opacity: 0.72 });
const water = new THREE.Mesh(waterG, waterM); water.receiveShadow = true; water.frustumCulled = false; scene.add(water);
let WK = 0.12;   // wave height (calm lagoon … storm)
const waveY = (x, z, t) => WK * (0.55 * Math.sin(x * 0.06 + t * 1.1) + 0.45 * Math.sin(z * 0.075 - t * 0.9 + x * 0.02) + 0.3 * Math.sin((x + z) * 0.11 + t * 1.7));
function updateWater(t, cx, cz) {
  const ox = Math.round(cx / WST) * WST, oz = Math.round(cz / WST) * WST; water.position.set(ox, 0, oz);
  const p = waterG.attributes.position; for (let i = 0; i < p.count; i++) p.setY(i, waveY(ox + WX[i], oz + WZ[i], t)); p.needsUpdate = true;
}
const glints = []; { const gm = new THREE.MeshBasicMaterial({ color: 0xE6F8FF, transparent: true, opacity: 0.55 }); for (let i = 0; i < 40; i++) { const m = new THREE.Mesh(new THREE.BoxGeometry(0.8 + R() * 1.3, 0.02, 0.09), gm); m.userData = { x: -40 + R() * 80, z: 6 + R() * 44, v: 0.5 + R() * 0.7 }; scene.add(m); glints.push(m); } }
// surf on the reef crest (a ring of white bars)
const surfM = new THREE.MeshBasicMaterial({ color: 0xF4FBFF, transparent: true, opacity: 0.7 });
const surf = (() => { const b = new GB(); for (let i = 0; i < 260; i++) { const a = -0.15 + i / 260 * (Math.PI + 0.3), x = Math.cos(a) * 100 * 1.30, z = -60 + Math.sin(a) * 64 * 1.30; const q = islandQ(x, z), k = 1.30 / q; b.box(2.6, 0.06, 0.5 + R() * 0.4, 0xffffff, x * k + (R() - .5), 0.1, -60 + (z + 60) * k, 0, -a + Math.PI / 2, 0); } return new THREE.Mesh(b.geo(), surfM); })(); scene.add(surf);

// ───────────────────────── the village
const world = new GB();
const stat = [];                         // camera-check boxes [x0, x1, z0, z1, y1, name]
const addHut = (x, z, w, d, ry = 0, o = {}) => { const m = hut(w, d, o), y = o.y ?? groundY(x, z) - 0.15; m.position.set(x, y, z); m.rotation.y = ry; scene.add(m); const r = Math.max(w, d) / 2 + 1.2; stat.push([x - r, x + r, z - r, z + r, y + m.userData.h, 'hut@' + x + ',' + z]); return m; };
const FALUW = [-17, 4.6], FH = [13, -9];
const faluw = addHut(FALUW[0], FALUW[1], 7.4, 5.0, 0, { ph: 1.4, y: -0.1, rh: 4.9, roof: 0x8A7444 });
const FTOP = -0.1 + 1.4;
const famHouse = addHut(FH[0], FH[1], 4.6, 3.6, 0);
addHut(-12.5, -15, 4.2, 3.4, 0.25); addHut(-24, -19, 4.4, 3.6, -0.2); addHut(-6, -31, 4.0, 3.2, 0.1); addHut(11, -26, 4.4, 3.4, -0.15); addHut(27, -14, 4.0, 3.2, 0.3); addHut(31, -1.5, 3.8, 3.0, -0.4);
// main path (beach → north) — always intact
const SLAB = new THREE.BoxGeometry(0.98, 0.14, 0.86);
const slabM = new THREE.MeshLambertMaterial({ color: 0xBDB7A7 });
const MAIN = []; for (let z = 3.4; z > -27; z -= 0.95) for (const x of [-0.52, 0.52]) MAIN.push([x + Math.sin(z * 0.2) * 0.25 + (R() - .5) * 0.06, z + (R() - .5) * 0.05, (R() - .5) * 0.14]);
const mainMesh = new THREE.InstancedMesh(SLAB, slabM, MAIN.length); mainMesh.receiveShadow = true;
MAIN.forEach(([x, z, r], i) => { mainMesh.setMatrixAt(i, M(x, groundY(x, z) + 0.05, z, 0, r, 0)); mainMesh.setColorAt(i, new THREE.Color().setHSL(0.11, 0.08, 0.66 + (R() - .5) * 0.08)); }); scene.add(mainMesh);
// west path (faluw → the German station): broken under German rule, repaired at "fixed"
const WP = [[-11, -1.0], [-24, -4.0], [-38, -9.2], [-50, -14.0]];
const WEST = []; { const rr = rng(77); for (let k = 0; k < WP.length - 1; k++) { const [x0, z0] = WP[k], [x1, z1] = WP[k + 1], L = Math.hypot(x1 - x0, z1 - z0), n = Math.floor(L / 0.95), ux = (x1 - x0) / L, uz = (z1 - z0) / L, ry = Math.atan2(-uz, ux); for (let i = 0; i < n; i++) for (const sd of [-0.52, 0.52]) { const x = x0 + ux * i * 0.95 - uz * sd, z = z0 + uz * i * 0.95 + ux * sd; WEST.push({ x, z, ry, d: Math.hypot(x - WP[0][0], z - WP[0][1]), bx: x + (rr() - .5) * 2.6, bz: z + (rr() - .5) * 2.6, brx: (rr() - .5) * 0.9, bry: rr() * 3, brz: (rr() - .5) * 0.9, by: -0.05 + rr() * 0.12, gone: rr() < 0.18 }); } } }
const westMesh = new THREE.InstancedMesh(SLAB, slabM, WEST.length); westMesh.receiveShadow = true; westMesh.castShadow = true; WEST.forEach((s, i) => westMesh.setColorAt(i, new THREE.Color().setHSL(0.11, 0.08, 0.64 + (R() - .5) * 0.08))); scene.add(westMesh);
const DMAX = Math.max(...WEST.map(s => s.d));
const fixT = s => T.people + 0.05 + (s.d / DMAX) * 1.35;
// palms, trees
const palms = []; const addPalm = (x, z, h) => { const m = palm(h, R); m.position.set(x, groundY(x, z) - 0.1, z); m.rotation.y = R() * 6.28; m.userData.ph = R() * 6.28; scene.add(m); palms.push(m); };
for (const [x, z, h] of [[6.5, -5.5, 8.2], [-4.5, -9, 7.0], [19, 0.5, 7.8], [24, -6, 8.6], [-9, -6.5, 8.0], [9, -15, 7.6], [17, -18, 8.4], [-16, -22, 7.8], [3.5, -20, 7.2], [-42, -2.5, 7.6], [-47, -7.5, 8.2], [-22, -13.5, 7.4], [36, -6, 8.0], [42, -10, 7.2], [-52, -6, 7.6], [-44, -19, 7.0], [21, -27, 8.0], [34, 1.0, 6.8], [-58, -12, 7.8], [46, -2, 7.4]]) addPalm(x, z, h);
const trees = []; { const rr = rng(31); for (let i = 0; i < 60; i++) { const x = (rr() - 0.5) * 170, z = -30 - rr() * 70, q = islandQ(x, z); if (q > 0.93 || (Math.abs(x) < 34 && z > -34)) continue; const m = bushTree(5 + rr() * 3, rr); m.position.set(x, groundY(x, z) - 0.1, z); m.rotation.y = rr() * 6; scene.add(m); trees.push(m); } }
// the German station (pops up under German rule)
const station = house(7.2, 4.4, 6.0, { color: 0xF4F0E6, roof: 0xB4523E, trim: 0xFFFFFF, chim: 0xD8D0C0, door: 0x2E4A6A, rand: rng(5) }); station.position.set(-55, groundY(-55, -19) - 0.1, -19); station.rotation.y = 0.78; scene.add(station);
stat.push([-60, -50, -24, -14, 8, 'station']);
// clouds + Palau's rock islands (far west, seen on the way in)
const clouds = []; for (let i = 0; i < 16; i++) { const m = cloud(R); const far = i >= 9; m.position.set(far ? -420 + R() * 220 : -170 + i * 44 + R() * 20, 46 + R() * 26, far ? 40 + R() * 260 : -160 + R() * 300); m.scale.setScalar(1.6 + R() * 1.6); m.userData.x0 = m.position.x; scene.add(m); clouds.push(m); }
const wipeClouds = []; for (const [x, y, z, k] of [[-168, 84, 102, 1.7], [-148, 92, 94, 1.4], [-178, 76, 84, 1.5], [-190, 70, 116, 1.6], [-207, 77, 126, 1.5], [-182, 64, 108, 1.3], [-222, 66, 134, 1.4], [-156, 86, 52, 1.7], [-138, 93, 48, 1.3], [-168, 78, 66, 1.5], [-182, 68, 84, 1.6], [-197, 61, 93, 1.4], [-171, 74, 76, 1.3], [-205, 55, 104, 1.5], [-26, 87, -6, 1.7], [-10, 93, -12, 1.4], [-34, 80, 8, 1.5]]) { const m = cloud(R); m.position.set(x, y, z); m.scale.setScalar(k); m.userData.x0 = x; m.userData.fixed = true; scene.add(m); clouds.push(m); }
const isles = []; for (const [x, z, r, h] of [[-112, 132, 5, 7], [-122, 120, 3.5, 5.5], [-104, 146, 4, 6], [-130, 140, 6, 8.5], [-96, 126, 2.6, 4]]) { const m = rockIsle(r, h, R); m.position.set(x, -0.6, z); scene.add(m); isles.push(m); }

// ───────────────────────── stone money (fei)
const FEI = [];   // { m, R, x, z, ry }
const addFei = (Rr, x, z, ry = 0, o = {}) => { const m = fei(Rr, { rand: R, ...o }); const y = o.y ?? groundY(x, z) - 0.12; m.position.set(x, y, z); m.rotation.y = ry; scene.add(m); const e = { m, R: Rr, x, z, ry, y }; FEI.push(e); stat.push([x - Rr * 0.6, x + Rr * 0.6, z - Rr * 0.6, z + Rr * 0.6, y + 2 * Rr, 'fei@' + x.toFixed(0) + ',' + z.toFixed(0)]); return e; };
for (const [x, z, Rr] of [[-2.8, -3.5, 0.75], [2.9, -4.5, 0.95], [-2.9, -7.4, 1.1], [3.0, -8.6, 0.8], [-3.0, -11.6, 0.9], [3.1, -12.8, 1.2], [-3.1, -15.6, 1.25], [3.1, -17.0, 1.0]]) addFei(Rr, x, z, x < 0 ? 0 : Math.PI);
const GIANT = addFei(1.85, -4.2, -21.2, 0.12);
const PAYS = addFei(1.05, 6.0, -2.2, -Math.PI / 2);                    // the buyer's stone (faces the sea)
const FIN = [[-27, -8.2], [-32, -10.2], [-37, -12.6]].map(([x, z], i) => addFei([1.45, 1.6, 1.4][i], x, z, Math.atan2(-0.93, -0.37)));   // the finest stones, facing the west path
for (const [x, z, Rr, ry] of [[-21.5, 2.6, 0.9, 0.4], [-13, 1.4, 0.7, -0.3], [-8.5, -12.2, 0.85, 0.2], [8.8, -21.5, 1.0, 2.6]]) addFei(Rr, x, z, ry);
// the sunken stone (hook) — centred geometry so it can rise, turn upright and come home in the legend
const sunkG = feiGeo(1.7, { lying: true, rand: R }); sunkG.translate(0, -1.7 * 0.15, 0);
const sunkM = new THREE.MeshLambertMaterial({ vertexColors: true, emissive: 0xFFB24A, emissiveIntensity: 0 });
const sunk = new THREE.Mesh(sunkG, sunkM); sunk.castShadow = true; scene.add(sunk);
const SUNK_TH = 1.7 * 0.15;
// weeds + fish around it
const weeds = new GB(); { const rr = rng(9); for (let i = 0; i < 26; i++) { const a = rr() * 6.28, r = 2.6 + rr() * 3.8, x = HS[0] + Math.cos(a) * r, z = HS[2] + Math.sin(a) * r; weeds.cone(0.18, 1.0 + rr() * 1.4, 4, rr() < 0.5 ? 0x3E8A5A : 0x6A9A4A, x, terrainY(x, z) + 0.5, z, (rr() - .5) * 0.3, 0, (rr() - .5) * 0.3); } }
scene.add(weeds.mesh());
const fishM = new THREE.MeshLambertMaterial({ color: 0xffffff, emissive: 0x332200, emissiveIntensity: 0.2 }); const fishMesh = new THREE.InstancedMesh(FISH, fishM, 9); fishMesh.frustumCulled = false; scene.add(fishMesh);
const FSH = Array.from({ length: 9 }, (_, i) => ({ r: 3 + (i % 3) * 1.4, y: -5.2 + (i % 4) * 0.35, ph: i * 0.7 + R(), w: (i % 2 ? 0.5 : -0.42) * (0.8 + R() * 0.4) }));
for (let i = 0; i < 9; i++) fishMesh.setColorAt(i, new THREE.Color([0xFFD24A, 0x5AC8FA, 0xFF8A5A][i % 3]));

// ───────────────────────── boats
const flo = (m, x, z, t, yo = 0, ry = 0, k = 1) => { const h = waveY(x, z, t), hx1 = waveY(x + 1.5, z, t), hz1 = waveY(x, z + 1.5, t); m.position.set(x, h + yo, z); m.rotation.set(0, 0, 0); m.rotation.order = 'YXZ'; m.rotation.y = ry; m.rotation.x = Math.atan((hz1 - h) / 1.5) * k; m.rotation.z = -Math.atan((hx1 - h) / 1.5) * k; };
// arrival in the lagoon (S4) — a canoe towing a raft with a stone
const arrC = canoe({ trim: 0xE8D9B0 }), arrR = raft(5.0, 2.8), arrS = fei(1.15, { rand: R }); scene.add(arrC, arrR); arrR.add(arrS); arrS.position.set(0, 0.3, 0); arrS.rotation.y = Math.PI / 2;
const arrCrew = [0, 1].map(i => { const p = person({ bare: true, skin: SKIN[1 + i], robe: [0xD9664A, 0xE09A2B][i], hair: 0x241A14, s: 0.86 }); arrC.add(p); p.position.set(i ? -1.1 : 0.9, 0.3, 0); return p; });
const ropeM = new THREE.MeshLambertMaterial({ color: 0x5A4632 });
const rope1 = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 1, 4), ropeM), rope2 = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 1, 4), ropeM); scene.add(rope1, rope2);
const _ra = new THREE.Vector3(), _rb = new THREE.Vector3(), _up = new THREE.Vector3(0, 1, 0), _dir = new THREE.Vector3();
function setRope(r, a, b, on) { r.visible = on; if (!on) return; _ra.set(...a); _rb.set(...b); _dir.subVectors(_rb, _ra); const L = _dir.length(); r.position.copy(_ra).addScaledVector(_dir, 0.5); r.quaternion.setFromUnitVectors(_up, _dir.normalize()); r.scale.set(1, L, 1); }
const ARR = { a: [40, 50], b: [21, 13.5], t0: T.b4 - 1.0, t1: T.b5 + 1.2 };
const arrPos = t => { const v = seg(t, ARR.t0, ARR.t1), u = 1 - (1 - v) * (1 - v); return [lerp(ARR.a[0], ARR.b[0], u), lerp(ARR.a[1], ARR.b[1], u), Math.atan2(-(ARR.b[1] - ARR.a[1]), ARR.b[0] - ARR.a[0])]; };
// beached canoe for the payment (S5) and the crew's canoe (S9)
const payC = canoe({ noSail: true, trim: 0x2FA39A }); scene.add(payC);
const crewC = canoe({ trim: 0xB8383B }); scene.add(crewC);
// the storm, long ago (far out at sea)
const SL = [-330, 0, 150];
const stC = canoe({ trim: 0xB8383B, sail: 0xD8C79A }), stR = raft(6.6, 4.4); scene.add(stC, stR);
const stCrew = [0, 1, 2].map(i => { const p = person({ bare: true, skin: SKIN[i + 1], robe: [0xD9664A, 0x2F6FB8, 0xE09A2B][i], hair: 0x241A14, s: 0.86 }); stC.add(p); p.position.set(1.3 - i * 1.15, 0.3, 0); return p; });
const great = new THREE.Mesh(feiGeo(1.9, { rand: R }).translate(0, -1.9, 0), MAT); great.castShadow = true; scene.add(great);   // centred at its middle
const ST = { cut: T.cut + 0.08, tip: T.stone8 - 0.15, splash: T.stone8 + 0.42 };
function stormRaft(t) {   // raft position (x, z, yaw) far at sea
  const tt = t - T.wipe1; let x = SL[0] + tt * 0.55, z = SL[2], yaw = 0;
  if (t > ST.cut) { const d = t - ST.cut; x -= d * d * 0.35 + d * 0.5; yaw = -0.35 * sm(0, 2.6, d); z += d * 0.4; }
  return [x, z, yaw];
}
function stormCanoe(t) { const [x, z] = stormRaft(Math.min(t, ST.cut)); const d = Math.max(0, t - ST.cut); return [x + 9.6 + d * 1.2 + d * d * 0.25, z - 0.4 - d * 0.3, 0]; }
// lightning bolts (thin emissive boxes)
const boltM = new THREE.MeshBasicMaterial({ color: 0xE8F0FF, transparent: true, opacity: 0, fog: false, toneMapped: false });
const BOLT = [T.storm + 0.1, T.loose - 0.35, T.sank + 0.25];
const bolts = BOLT.map((tb, k) => { const b = new GB(); let x = 0, y = 70; const rr = rng(40 + k); while (y > 0) { const nx = x + (rr() - .5) * 9, ny = y - 6 - rr() * 5; const L = Math.hypot(nx - x, ny - y); b.box(0.5, L, 0.5, 0xffffff, (x + nx) / 2, (y + ny) / 2, 0, 0, 0, Math.atan2(nx - x, ny - y) * -1); x = nx; y = ny; } const m = new THREE.Mesh(b.geo(), boltM.clone()); scene.add(m); return m; });
const lightK = t => BOLT.reduce((a, tb) => Math.max(a, Math.exp(-Math.pow((t - tb) / 0.07, 2)) + 0.5 * Math.exp(-Math.pow((t - tb - 0.2) / 0.05, 2))), 0);
// rain (line streaks around the camera target)
const RN = 1400, rainG = new THREE.BufferGeometry(); rainG.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(RN * 6), 3));
const rain = new THREE.LineSegments(rainG, new THREE.LineBasicMaterial({ color: 0xC4CEDF, transparent: true, opacity: 0, depthWrite: false })); rain.frustumCulled = false; scene.add(rain);
const RD = Array.from({ length: RN }, () => [R(), R(), R(), 0.7 + R() * 0.6]);
const foamM = new THREE.MeshBasicMaterial({ color: 0xE8F2FA, transparent: true, opacity: 0.55, fog: true });
const FOAM = Array.from({ length: 150 }, () => ({ x: (R() - 0.5) * 120, z: (R() - 0.5) * 90, w: 0.8 + R() * 2.2, ph: R() * 6.28 }));
const foam = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 0.03, 0.22), foamM, FOAM.length); foam.frustumCulled = false; scene.add(foam);
// splash + bubbles
const splashM = new THREE.MeshBasicMaterial({ color: 0xF2FAFF, transparent: true, opacity: 0.85, fog: false });
const SPL = Array.from({ length: 64 }, () => ({ a: R() * 6.28, v: 1.5 + R() * 4.0, h: 2.5 + R() * 4.5, s: 0.05 + R() * 0.09 }));
const splash = SPL.map(() => { const m = new THREE.Mesh(new THREE.IcosahedronGeometry(1, 0), splashM); scene.add(m); return m; });

// ───────────────────────── people
const CAST = [];   // { m, show(t) }
const P0 = (o, x, z, ry, show, y) => { const m = person(o); m.position.set(x, y ?? groundY(x, z), z); m.rotation.y = ry; scene.add(m); const c = { m, x, z, ry, y: m.position.y, show, ph: R() * 6.28 }; CAST.push(c); return c; };
const FACE = { s: -Math.PI / 2, n: Math.PI / 2, e: 0, w: Math.PI };
const VIL = (i, extra = {}) => ({ bare: true, skin: SKIN[1 + (i % 4)], robe: [0xD9664A, 0xE09A2B, 0x7A4FA0, 0x2FA39A, 0xB8383B, 0xE9C46A, 0x4C9A62][i % 7], hair: [0x1E1712, 0x2A1E16, 0x3A2A1E][i % 3], flower: i % 3 === 1 ? 0xFF6F91 : undefined, s: 0.98 + (i % 3) * 0.03, ...extra });
const always = () => true;
// the family today (beach, in front of their house) — hook and legend
const famNow = [[11.6, -4.4, 0], [13.2, -4.0, 1], [14.6, -4.5, 2]].map(([x, z, i]) => P0(VIL(i + 3, i === 2 ? { s: 0.68 } : {}), x, z, FACE.s, t => t < T.b5 - 0.5 || t > T.b15 + 2.5));
// the doctor
const doc = P0({ robe: 0xF3EFE6, skin: 0xF0CDAE, helmet: 0xF7F2E6, s: 1.02 }, 0.5, 4.6, FACE.n, t => (t > 6.0 && t < T.b4 + 1.2) || (t > T.b6 - 1.0 && t < T.wipe1 + 0.6));
const docPos = t => { if (t > T.b6 - 1.0) return [-1.2, 2.5, FACE.s - 0.5, groundY(-1.2, 2.5)]; const u = seg(t, 6.6, T.twelve - 0.4), x = u < 0.82 ? 0.55 : lerp(0.55, -1.7, (u - 0.82) / 0.18), z = lerp(4.4, -20.4, u); return [x, z, u < 0.82 ? FACE.n : lerp(FACE.n, FACE.w, (u - 0.82) / 0.18), groundY(x, z)]; };
const friend = P0({ bare: true, skin: SKIN[2], robe: 0x7A4FA0, hair: 0xD8D2C4, s: 0.97 }, -2.3, 1.1, FACE.s + 0.25, t => t > T.b6 - 1.0 && t < T.wipe1 + 0.6);
const armG = new THREE.BoxGeometry(0.13, 0.66, 0.13).translate(0, -0.3, 0), arm = new THREE.Mesh(armG, new THREE.MeshLambertMaterial({ color: SKIN[2] })); arm.position.set(0, 1.12, 0.27); friend.m.add(arm);
// the payment (S5)
const buyer = P0(VIL(3, { robe: 0x2F6FB8 }), 3.8, 1.0, FACE.e, t => t > T.b4 - 1.5 && t < T.b6 + 0.4);
const seller = P0(VIL(4, { robe: 0xD94A3A }), 8.2, 1.3, FACE.w, t => t > T.b4 - 1.5 && t < T.b6 + 0.4);
const payV = [[3.2, -4.6], [5.0, -5.8], [7.0, -5.0], [8.9, -4.0], [4.0, -7.6], [7.9, -7.8]].map(([x, z], i) => P0(VIL(i), x, z, Math.atan2(-(1.5 - z), 6 - x), t => t > T.b4 - 1.5 && t < T.b6 + 0.4));
const BUB_T = payV.map((v, i) => T.everyone + 0.15 + i * 0.27);
// crew + listeners (S9, long ago) and the generations (S10)
const crew = [[4.0, 4.2], [5.6, 4.6], [7.2, 4.2]].map(([x, z], i) => P0(VIL(i, { robe: [0xD9664A, 0x2F6FB8, 0xE09A2B][i] }), x, z, FACE.n, t => t > T.wipe2 + 0.4 && t < T.b10 + 0.9));
const lis = [[1.4, -1.2], [3.6, -2.6], [6.2, -2.9], [8.8, -2.2], [10.6, -0.4], [0.2, 1.2]].map(([x, z], i) => P0(VIL(i + 2), x, z, Math.atan2(-(4.3 - z), 5.6 - x), t => t > T.wipe2 + 0.4 && t < T.b10 + 0.9));
const GEN_T = [T.stayed, T.rich10 + 0.2, T.generations + 0.15];
const gens = [[10.2, -4.4, { hair: 0xDAD4C6, robe: 0x7A4FA0 }], [11.8, -4.1, { robe: 0xD9664A }], [13.3, -4.4, { s: 0.7, robe: 0xE9C46A }]].map(([x, z, o], i) => P0(VIL(i + 1, o), x, z, FACE.s, t => t > GEN_T[i] - 0.05 && t < T.wipe3 + 0.4));
// German rule (S11–S14)
const GS = t => t > T.wipe3 + 0.45 && t < T.b15 + 3.2;
const chiefs = [[-19.0, -0.4], [-20.7, 0.2]].map(([x, z], i) => P0(VIL(i + 5, { sash: 0xF7B500, robe: [0xB8383B, 0x3B4A9A][i], s: 1.05 }), x, z, FACE.n, GS));
const offs = [0, 1, 2].map(i => P0({ robe: 0xF2EFE6, skin: [0xF0CDAE, 0xE8C2A0, 0xEFC6A4][i], helmet: 0xF7F2E6, sash: 0x2E3A4F, s: 1.03 }, -26, -7, 0, GS));
const OFF_T0 = T.wipe3 + 1.0, OFF_T1 = T.chiefs + 0.2;
const OFF_A = [[-25.0, -6.6], [-26.6, -7.4], [-28.0, -8.0]], OFF_B = [[-19.3, -4.3], [-20.9, -5.0], [-22.4, -5.7]];
const paintAt = i => { const f = FIN[i]; return [f.x - 0.348 * 1.0 + 0.938 * 1.5, f.z + 0.938 * 1.0 + 0.348 * 1.5]; };
const offRoute = (i, t) => {   // walk in to the chiefs, hand over the orders, then walk to the finest stones and paint one each
  const u0 = eio(seg(t, OFF_T0, OFF_T1)), a = OFF_A[i], b = OFF_B[i];
  let x = lerp(a[0], b[0], u0), z = lerp(a[1], b[1], u0), ry = u0 < 1 && u0 > 0 ? Math.atan2(-(b[1] - a[1]), b[0] - a[0]) : FACE.s;
  if (t > OFF_T1) ry = FACE.s;
  const c = paintAt(i), u1 = eio(seg(t, T.b12 + 0.15 + i * 0.12, T.paint - 0.2 + i * 0.25)); x = lerp(x, c[0], u1); z = lerp(z, c[1], u1);
  if (u1 > 0 && u1 < 1) ry = Math.atan2(-(c[1] - b[1]), c[0] - b[0]); else if (u1 >= 1) ry = Math.atan2(-(FIN[i].z - c[1]), FIN[i].x - c[0]);
  return [x, z, ry];
};
const workers = [[-23.0, -0.6], [-26.6, -1.6], [-30.4, -3.4], [-20.0, 0.2], [-34.2, -5.0]].map(([x, z], i) => P0(VIL(i + 1), x, z, Math.atan2(-(-9.5 - z), -31 - x), GS));
const WORK_DEST = [[-40.6, -8.7], [-44.6, -11.4], [-48.6, -13.6], [-37.4, -7.4], [-52.0, -15.0]];
// (ambient folk)
P0(VIL(5), -10.5, -10.8, 0.6, t => !(t > T.wipe1 && t < T.wipe2 + 0.4)); P0(VIL(6, { s: 0.7 }), -8.8, -11.6, 0.9, t => !(t > T.wipe1 && t < T.wipe2 + 0.4)); P0(VIL(0), 21.5, -9.5, 2.2, always);
// the black crosses (two painted strokes on each of the finest stones)
const crossM = new THREE.MeshBasicMaterial({ color: 0x16161C });
const CROSS_T = [T.black, T.crosses + 0.1, T.finest + 0.15];
const STROKE = new THREE.BoxGeometry(0.03, 0.2, 1).translate(0, 0, 0.5);
const crosses = FIN.map((f, i) => { const g = new THREE.Group(), L = f.R * 0.82, off = feiFace(f.R, f.R * 0.3) + 0.03, cy = f.R * 1.42;
  const strokes = [[Math.PI / 4, -1], [3 * Math.PI / 4, 1]].map(([th, sz]) => { const st = new THREE.Mesh(STROKE, crossM); st.position.set(off, cy + 0.354 * L, sz * 0.354 * L); st.rotation.set(th, 0, 0); st.userData = { th, sz }; g.add(st); return st; });
  f.m.add(g); g.userData = { strokes, L, off, cy }; return g; });
// brush in the official's hand
const brush = new GB().cyl(0.04, 0.04, 0.7, 5, 0x8A5A34, 0, 0.35, 0).box(0.14, 0.16, 0.1, 0x16161C, 0, 0.0, 0).mesh(); scene.add(brush);
// the order papers
const paperM = new THREE.MeshLambertMaterial({ color: 0xFBF6E8, side: THREE.DoubleSide }); const papers = [0, 1].map(() => { const m = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.02, 0.36), paperM); scene.add(m); return m; });
const PAPER_T = [T.orders - 0.3, T.paths11 - 0.1];
// the ghost of the lost stone (what everyone agreed still counted)
const ghostM = new THREE.MeshBasicMaterial({ color: 0xFFE7B0, transparent: true, opacity: 0, depthWrite: false, toneMapped: false });
const ghaloM = new THREE.MeshBasicMaterial({ map: radial('rgba(255,214,130,0.75)', 'rgba(255,190,90,0)'), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false, opacity: 0 });
const ghalo = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), ghaloM); scene.add(ghalo);
const ghost = new THREE.Mesh(feiGeo(1.9, { rand: R }).translate(0, -1.9, 0), ghostM); scene.add(ghost);
const GH_A = [5.6, 4.4, 1.6], GH_B = [16.3, 0.5, -4.7];
// glow for the rising stone
const glowM = new THREE.MeshBasicMaterial({ map: radial('rgba(255,210,120,0.85)', 'rgba(255,170,60,0)'), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false, opacity: 0 });
const glow = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), glowM); scene.add(glow);
const sparkT = (() => { const cv = document.createElement('canvas'); cv.width = cv.height = 64; const g = cv.getContext('2d'); g.translate(32, 32); g.fillStyle = '#fff'; for (let k = 0; k < 2; k++) { g.rotate(Math.PI / 2 * k); g.beginPath(); g.moveTo(0, -30); g.quadraticCurveTo(3, -3, 30, 0); g.quadraticCurveTo(3, 3, 0, 30); g.quadraticCurveTo(-3, 3, -30, 0); g.quadraticCurveTo(-3, -3, 0, -30); g.fill(); } const tx = new THREE.CanvasTexture(cv); tx.colorSpace = THREE.SRGBColorSpace; return tx; })();
const sparks = []; for (let i = 0; i < 40; i++) { const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: sparkT, color: 0xFFE9A8, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false })); sp.userData = { ph: R() * 6.28, w: 3 + R() * 4, a: R() * 6.28, r: R(), h: R() }; scene.add(sp); sparks.push(sp); }
// sea birds
const birdMat = new THREE.MeshBasicMaterial({ color: 0x2A2430, side: THREE.DoubleSide });
const wingG = new THREE.BufferGeometry(); wingG.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0.1, 1.6, 0, -0.3, 1.5, 0, 0.5], 3));
const FLOCK = [{ t0: 2.0, t1: 9.5, a: [60, 18, 30], b: [-30, 22, -4] }, { t0: T.b4 - 0.4, t1: T.b5 + 2.5, a: [-30, 15, 40], b: [40, 19, 6] }, { t0: T.wipe2 + 1.0, t1: T.b10 + 1.5, a: [40, 16, 20], b: [-20, 19, -14] }, { t0: T.b15 + 0.5, t1: T.cta + 2.0, a: [-60, 26, 20], b: [50, 30, -30] }];
const birds = []; for (let i = 0; i < 9; i++) { const g = new THREE.Group(), l = new THREE.Mesh(wingG, birdMat), r = new THREE.Mesh(wingG, birdMat); r.scale.x = -1; g.add(l, r); g.userData = { l, r, ph: R() * 6 }; g.visible = false; g.scale.setScalar(0.85); scene.add(g); birds.push(g); }
function updateBirds(t) {
  const f = FLOCK.find(f => t >= f.t0 && t <= f.t1); for (const b of birds) b.visible = !!f; if (!f) return;
  const u = seg(t, f.t0, f.t1), dx = f.b[0] - f.a[0], dz = f.b[2] - f.a[2], L = Math.hypot(dx, dz), ux = dx / L, uz = dz / L;
  birds.forEach((b, i) => { const row = Math.ceil(i / 2), sd = i % 2 ? 1 : -1; b.position.set(lerp(f.a[0], f.b[0], u) - ux * row * 2.4 + uz * sd * row * 1.7, lerp(f.a[1], f.b[1], u) + Math.sin(t * 2 + b.userData.ph) * 0.5, lerp(f.a[2], f.b[2], u) - uz * row * 2.4 - ux * sd * row * 1.7); b.rotation.y = Math.atan2(ux, uz); const fl = Math.sin(t * 10 + b.userData.ph) * 0.65; b.userData.l.rotation.z = fl; b.userData.r.rotation.z = -fl; });
}

// ───────────────────────── the legend: the lost stone comes home
const LG = { rise0: T.something - 0.1, rise1: T.lost + 0.35, home0: T.lost + 0.4, home1: T.just - 0.05 };
const HOME = [16.4, groundY(16.4, 0.6), 0.6];
function sunkPose(t) {   // [x, y, z, rx, ry, glow]
  const r = eio(seg(t, LG.rise0, LG.rise1)), h = eio(seg(t, LG.home0, LG.home1));
  const x = lerp(HS[0], HOME[0], h), z = lerp(HS[2], HOME[2], h);
  const y = lerp(lerp(HS[1] + SUNK_TH, 2.1, r), HOME[1] + 1.7, h) + Math.sin(Math.PI * h) * 1.4 + (r > 0 && h < 1 ? Math.sin(t * 2.4) * 0.12 * (1 - h) : 0);
  return [x, y, z, lerp(0.08, Math.PI / 2, r), lerp(0.3, 0, r), win(t, LG.rise0, DUR + 1, 0.4, 0.1)];
}

// ───────────────────────── camera path (spherical keys around a target; `up` tilts the view so the subject sits lower in the frame)
const ARRF = (back = 0, dy = 0) => t => { const p = arrPos(t), ux = Math.cos(p[2]), uz = -Math.sin(p[2]); return [p[0] - ux * back, dy, p[1] - uz * back]; };
const SUNKF = (dy = 0) => t => { const p = sunkPose(t); return [p[0], p[1] + dy, p[2]]; };
const DOC = (dy = 1.6) => t => { const p = docPos(t); return [p[0], p[3] + dy, p[1]]; };
const RAFT = (dx = 0, dy = 0, dz = 0) => t => { const p = stormRaft(t); return [p[0] + dx, dy, p[1] + dz]; };
const CAM = [
  { t: 0, tg: [HS[0], HS[1] + 0.6, HS[2]], d: 12.5, az: 14, el: 76, up: 0 },                         // straight down at the stone on the sea floor
  { t: 3.2, tg: [HS[0], HS[1] + 0.8, HS[2] - 0.6], d: 16, az: 8, el: 68, up: 0, mv: 1 },
  { t: T.bottom + 0.1, tg: [HS[0], HS[1] + 1.0, HS[2] - 1.0], d: 21, az: 6, el: 60, up: 0 },
  { t: T.b2 + 0.1, tg: [11, 1.8, 2], d: 46, az: 10, el: 15, up: 0.06, mv: 1 },                       // rise: the island, the family on the beach
  { t: T.name + 1.0, tg: DOC(1.7), d: 12, az: 30, el: 12, up: 0.04, mv: 1 },                         // the doctor walks up from the beach
  { t: T.b3 + 0.2, tg: DOC(1.7), d: 12.5, az: 22, el: 13, up: 0.04 },
  { t: T.stone3 + 1.0, tg: [0, 1.8, -11.5], d: 14.5, az: 14, el: 14, up: 0.04, mv: 1 },             // up the avenue of stone money
  { t: T.twelve - 0.2, tg: [-3.4, 2.2, -20.8], d: 13, az: 40, el: 11, up: 0.05, mv: 1 },              // the giant, with the doctor for scale
  { t: T.b4 - 0.1, tg: [-3.4, 2.2, -21.0], d: 12.5, az: 36, el: 11, up: 0.05 },
  { t: T.b4 + 0.9, tg: [12, 2, 2], d: 34, az: 40, el: 30, up: 0.04, mv: 1 },                        // lift over the roofs…
  { t: T.palau + 0.7, tg: ARRF(3.8, 1.4), d: 19, az: 30, el: 15, up: 0.05, mv: 1 },                 // …and follow the canoe and raft in from the reef
  { t: T.b5 - 0.1, tg: ARRF(3.0, 1.4), d: 19, az: 34, el: 15, up: 0.05 },
  { t: T.canoe5 + 0.5, tg: [6.1, 1.4, -0.8], d: 21, az: 16, el: 16, up: 0.04, mv: 1 },             // the payment on the beach
  { t: T.everyone, tg: [6.0, 1.4, -1.6], d: 22, az: 12, el: 19, up: 0.04 },
  { t: T.b6 - 0.2, tg: [5.8, 1.4, -2.2], d: 23, az: 10, el: 20, up: 0.04 },
  { t: T.b6 + 0.9, tg: [-1.7, 1.5, 1.9], d: 8.5, az: -80, el: 8, up: 0.1, mv: 1 },                   // the doctor and his friend, at sunset
  { t: T.great + 0.2, tg: [-1.7, 1.6, 2.0], d: 8, az: -88, el: 7, up: 0.12 },
  { t: T.wipe1, tg: [3, 6, 9], d: 12, az: -150, el: 18, up: 0.2, mv: 1 },
  { t: T.wipe1 + 0.5, tg: [-160, 80, 90], d: 40, az: -200, el: -40, up: 0, mv: 1 },                   // sky wipe → long ago, at sea
  { t: T.wipe1 + 1.35, tg: RAFT(3.0, 2.6, -0.6), d: 17, az: -58, el: 15, up: 0.05, mv: 1 },
  { t: T.storm, tg: RAFT(3.4, 2.4, -0.6), d: 16, az: -62, el: 14, up: 0.05 },
  { t: T.cut - 0.3, tg: RAFT(3.6, 2.2, -0.4), d: 14.5, az: -66, el: 15, up: 0.04, mv: 1 },
  { t: T.loose + 0.4, tg: RAFT(0.8, 1.9, -1.4), d: 14, az: -60, el: 17, up: 0.03, mv: 1 },
  { t: T.sank + 0.2, tg: RAFT(-0.4, 0.2, -3.4), d: 13, az: -52, el: 25, up: 0.0, mv: 1 },
  { t: T.wipe2, tg: RAFT(-0.4, -0.6, -3.8), d: 12.5, az: -50, el: 29, up: 0.0 },
  { t: T.wipe2 + 0.5, tg: [-150, 80, 60], d: 40, az: 60, el: -40, up: 0, mv: 1 },                     // sky wipe → back home
  { t: T.wipe2 + 1.35, tg: [5.6, 2.4, 1.6], d: 19, az: 72, el: 12, up: 0.06, mv: 1 },
  { t: T.magnificent + 0.3, tg: [5.6, 2.8, 1.6], d: 19.5, az: 64, el: 13, up: 0.07 },
  { t: T.b10 - 0.1, tg: [6.5, 2.4, 0.6], d: 20, az: 58, el: 14, up: 0.06 },
  { t: T.b10 + 0.9, tg: [13.3, 1.9, -4.8], d: 21, az: 8, el: 12, up: 0.07, mv: 1 },                  // the family, rich for generations
  { t: T.wipe3, tg: [13.4, 2.0, -5.0], d: 20, az: 4, el: 12, up: 0.07 },
  { t: T.wipe3 + 0.5, tg: [-20, 80, 0], d: 40, az: 30, el: -40, up: 0, mv: 1 },                        // sky wipe → German rule
  { t: T.wipe3 + 1.35, tg: [-33, 2.2, -8.5], d: 34, az: 60, el: 16, up: 0.05, mv: 1 },
  { t: T.chiefs, tg: [-20.2, 1.9, -2.4], d: 17.5, az: 75, el: 12, up: 0.05, mv: 1 },               // the orders, ignored
  { t: T.paths11 + 0.75, tg: [-20.0, 1.9, -2.4], d: 16.5, az: 78, el: 12, up: 0.05 },
  { t: T.b12 + 0.9, tg: [-27, 2, -5], d: 22, az: 10, el: 40, up: 0.04, mv: 1 },                        // lift over the men's house roof
  { t: T.paint - 0.35, tg: [FIN[0].x + 0.6, 2.2, FIN[0].z + 1.1], d: 14, az: -10, el: 11, up: 0.05, mv: 1 },   // the crosses, one stone at a time
  { t: CROSS_T[0] + 0.4, tg: [FIN[0].x - 0.3, 2.2, FIN[0].z + 0.8], d: 14, az: -9, el: 11, up: 0.05 },
  { t: CROSS_T[1] + 0.15, tg: [FIN[1].x + 0.6, 2.2, FIN[1].z + 1.1], d: 14.5, az: -8, el: 11, up: 0.05, mv: 1 },
  { t: CROSS_T[1] + 0.55, tg: [FIN[1].x - 0.2, 2.2, FIN[1].z + 0.8], d: 14.5, az: -8, el: 11, up: 0.05 },
  { t: CROSS_T[2] + 0.15, tg: [FIN[2].x + 0.6, 2.2, FIN[2].z + 1.1], d: 15, az: -6, el: 12, up: 0.05, mv: 1 },
  { t: CROSS_T[2] + 0.5, tg: [FIN[2].x + 0.3, 2.2, FIN[2].z + 1.0], d: 15, az: -6, el: 12, up: 0.05 },
  { t: T.stones12 + 1.2, tg: [FIN[1].x + 0.2, 2.2, FIN[1].z + 0.6], d: 24, az: 4, el: 15, up: 0.05, mv: 1 },
  { t: T.people - 0.2, tg: [-39, 1.4, -9.8], d: 27, az: 36, el: 24, up: 0.04, mv: 1 },                // the paths repaired
  { t: T.b14 + 0.2, tg: [-39, 1.4, -10], d: 26, az: 32, el: 23, up: 0.04 },
  { t: T.wiped + 0.2, tg: [FIN[1].x + 0.4, 2.0, FIN[1].z + 0.8], d: 19, az: 16, el: 13, up: 0.05, mv: 1 },
  { t: T.b15 + 0.2, tg: [FIN[1].x + 0.6, 2.0, FIN[1].z + 0.9], d: 21, az: 18, el: 15, up: 0.05 },
  { t: T.b15 + 2.6, tg: [-4, 3, -24], d: 150, az: 16, el: 25, up: 0.2, mv: 3 },                        // crane up over the island at golden hour
  { t: T.comment, tg: [2, 2, -18], d: 146, az: 14, el: 24, up: 0.2 },
  { t: T.something - 0.2, tg: SUNKF(0), d: 30, az: 12, el: 24, up: -0.05, mv: 1 },                  // the stone rises and comes home (camera follows it)
  { t: LG.home1, tg: SUNKF(0), d: 25, az: 10, el: 19, up: -0.05 },
  { t: DUR + 0.5, tg: SUNKF(0), d: 24, az: 8, el: 18, up: -0.05 },
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
  camera.position.set(cx, Math.max(tg[1] + d * Math.sin(el) + wob[1], Math.max(groundY(cx, cz), 0) + 1.6), cz);
  camera.lookAt(tg[0], tg[1] + up * d, tg[2]); camera.updateMatrixWorld();
  camTg.set(tg[0], tg[1], tg[2]); camD = d;
}

// ───────────────────────── overlay (captions, stamps, labels)
const ui = document.getElementById('ui'); const _v = new THREE.Vector3();
function proj(x, y, z) { _v.set(x, y, z).project(camera); return [(_v.x * 0.5 + 0.5) * W, (-_v.y * 0.5 + 0.5) * H, _v.z < 1]; }
function mk(cls, html = '') { const e = document.createElement('div'); e.className = 'abs ' + cls; e.innerHTML = html; e.style.opacity = 0; ui.appendChild(e); return e; }
function put(e, x, y, o = 1, sc = 1, ax = '-50%', ay = '-50%') { e.style.opacity = o.toFixed(3); if (o <= 0.001) return; e.style.transform = `translate(${x.toFixed(1)}px,${y.toFixed(1)}px) translate(${ax},${ay}) scale(${sc.toFixed(3)})`; }
const pop = (t, t0, d = 0.32) => t < t0 ? 0 : 0.82 + 0.18 * back(seg(t, t0, t0 + d));
const clampX = (x, m = 200) => Math.min(W - m, Math.max(m, x));
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
const yearEl = mk('year', '2026'), subEl = mk('sub', 'Yap · a true money story');
const chip = mk('chip', '');
const nameEl = mk('name', '<div class="n">William Furness</div><div class="r">American doctor · 1903</div>');
const moneyTag = mk('tag am', 'their money ↓');
const meas = mk('meas', '<div class="bar"></div><div class="lb">12 ft<small>≈ 3.7 m</small></div>'); const measBar = meas.querySelector('.bar');
const route = mk('route', '<div class="line"></div><div class="fill"></div><div class="nd" style="left:40px"></div><div class="nd" style="left:720px"></div><div class="dot"></div><div class="lb" style="left:40px">PALAU</div><div class="lb" style="left:720px">YAP</div>');
const routeFill = route.querySelector('.fill'), routeDot = route.querySelector('.dot');
const ownerTag = mk('tag', 'owner <span class="pd"></span>'); const ownerDot = ownerTag.querySelector('.pd');
const bubs = payV.map(() => mk('bub', '✓ <span class="pd"></span>'));
const swore = mk('tag am', '“magnificent!”');
const counts = mk('tag', 'still counts <b>✓</b>');
const gensEl = mk('pips', 'generations &nbsp;<i></i><i></i><i></i>');
const ign = chiefs.map(() => mk('tag grey', 'ignored'));
const claimed = mk('tag grey', 'claimed by the government');
const fixedTag = mk('tag', 'paths fixed <b>✓</b>');
const paid = mk('tag am', 'fine paid ✓');
const title = mk('title', '<div class="s">THE STORY OF</div><div class="n">The Island of\n<em>Stone Money</em></div>');
const lesson = mk('lesson', 'Money is what\n<em>we all agree on</em>.');
const legend = mk('chip', 'an old sailors’ legend');
const cbox = mk('cbox', '<span class="in"></span><span class="post">Post</span>'); const cIn = cbox.querySelector('.in'), cPost = cbox.querySelector('.post');
const quip = mk('tag am', 'just not twelve feet wide');
const foot = document.getElementById('foot');
foot.textContent = 'Told from W. H. Furness, The Island of Stone Money (1910), as quoted by M. Friedman (1991)\nIt is his account; anthropologists say Western retellings simplify how the stones were used.';
const setTxt = (e, s) => { if (e.textContent !== s) e.textContent = s; };
const setHTML = (e, s) => { if (e._h !== s) { e._h = s; e.innerHTML = s; } };
const DOT_B = '#4A8FE0', DOT_R = '#E5533D';

function updateUI(t) {
  updateCaption(t);
  foot.style.opacity = (0.95 * seg(t, 0.8, 1.4) * (1 - seg(t, T.cta, T.cta + 0.3) * 0.45)).toFixed(3);
  // 1 — the year rolls back; their money
  { const u = eo(seg(t, 0.05, 1.25)); setTxt(yearEl, String(Math.round(lerp(2026, 1903, u)))); const o = win(t, -1, T.rich1 + 0.2, 0.5, 0.3); put(yearEl, W / 2, 640, o, 1 + 0.06 * (1 - u)); put(subEl, W / 2, 780, o * seg(t, 0.9, 1.3)); }
  { const p = proj(HS[0] + 1.2, HS[1] + 2.6, HS[2]); put(moneyTag, clampX(p[0], 200), Math.min(1450, Math.max(600, p[1])), win(t, T.rich1 + 0.35, T.sea + 0.5, 0.25, 0.3), pop(t, T.rich1 + 0.35)); }
  // 2 — the doctor
  { const p = docPos(t), q = proj(p[0], p[3] + 3.2, p[1]); put(nameEl, clampX(q[0], 300), Math.max(600, q[1]), win(t, T.name, T.b3 - 0.2, 0.3, 0.3), pop(t, T.name)); }
  // chips
  let ct = '', co = 0, cp = 0;
  const CH = [[T.name - 0.1, T.b3 - 0.25, '1903 · Yap, western Pacific'], [T.b3 + 0.1, T.b4 - 0.2, 'stone money · called rai'], [T.b5 + 0.2, T.b6 - 0.25, 'a canoe for a stone'], [T.friend, T.wipe1 + 0.25, 'what a friend told him'], [T.wipe1 + 0.6, T.b8 - 0.15, 'long ago · at sea'], [T.b8 + 0.1, T.wipe2 + 0.3, 'a storm on the way home'],
    [T.wipe2 + 0.7, T.b10 - 0.15, 'back home'], [T.b10 + 0.1, T.wipe3 + 0.3, 'rich, for generations'], [T.german - 0.1, T.b12 - 0.15, 'German rule · from 1899'], [T.b12 + 0.05, T.b13 - 0.15, 'as the doctor wrote it'], [T.b13 + 0.05, T.b14 - 0.15, 'suddenly poor'], [T.b14 + 0.05, T.story - 0.3, 'the fine, paid']];
  for (const [a, b, s] of CH) { const o = win(t, a, b, 0.22, 0.22); if (o > co) { co = o; ct = s; cp = pop(t, a); } }
  if (ct) setTxt(chip, ct); put(chip, W / 2, 472, co, cp);
  // 3 — twelve feet
  { const g = GIANT, a = proj(g.x + 0.4, g.y + 2 * g.R, g.z + 0.9), b = proj(g.x + 0.4, g.y, g.z + 0.9), o = win(t, T.twelve - 0.1, T.b4 - 0.25, 0.25, 0.25); const h = Math.max(20, b[1] - a[1]); measBar.style.height = h.toFixed(1) + 'px'; put(meas, Math.max(250, a[0] - 70), a[1], o, 1, '-100%', '0%'); }
  // 4 — Palau → Yap
  { const o = win(t, T.b4 + 0.1, T.b5 - 0.1, 0.3, 0.25), u = lerp(0.05, 1, eio(seg(t, T.b4 + 0.2, T.raft4 + 0.4))); routeFill.style.width = (680 * u).toFixed(1) + 'px'; routeDot.style.left = (40 + 680 * u).toFixed(1) + 'px'; put(route, W / 2, 500, o, 1); }
  // 5 — the owner changes; everyone remembers
  { const p = proj(PAYS.x, PAYS.y + 2 * PAYS.R + 0.7, PAYS.z), sw = t > T.never + 0.15; ownerDot.style.background = sw ? DOT_R : DOT_B; put(ownerTag, p[0], p[1], win(t, T.b5 + 0.25, T.b6 - 0.1, 0.25, 0.25), pop(t, T.b5 + 0.25) * (1 + 0.12 * win(t, T.never + 0.15, T.never + 0.45, 0.08, 0.2))); }
  payV.forEach((v, i) => { const p = proj(v.m.position.x, v.m.position.y + 2.55, v.m.position.z); bubs[i].querySelector('.pd').style.background = DOT_R; put(bubs[i], p[0], p[1], p[2] ? win(t, BUB_T[i], T.b6 - 0.15, 0.15, 0.25) : 0, pop(t, BUB_T[i])); });
  // 9 — they swore; it still counts
  { const p = proj(5.6, 3.6, 4.4); put(swore, clampX(p[0], 220), Math.max(600, p[1]), win(t, T.magnificent, T.agreed - 0.15, 0.2, 0.25), pop(t, T.magnificent)); }
  { const g = ghostPos(t), p = proj(g[0], g[1] + 2.5, g[2]); put(counts, clampX(p[0], 200), Math.max(600, p[1]), win(t, T.counted, T.b10 + 0.6, 0.2, 0.25), pop(t, T.counted)); }
  { const n = GEN_T.filter(g => t > g).length; [...gensEl.querySelectorAll('i')].forEach((e, i) => { const c = i < n ? 'on' : ''; if (e.className !== c) e.className = c; }); put(gensEl, W / 2, 552, win(t, T.stayed - 0.1, T.wipe3 + 0.2, 0.2, 0.2), 1); }
  // 11 — ignored
  chiefs.forEach((c, i) => { const p = proj(c.m.position.x, c.m.position.y + 2.6, c.m.position.z), t0 = [T.ignored + 0.5, T.paths11 + 0.35][i]; put(ign[i], clampX(p[0], 160), Math.max(600, p[1]), p[2] ? win(t, t0, T.paths11 + 0.8, 0.2, 0.2) : 0, pop(t, t0)); });
  // 12 — claimed
  { const f = FIN[1], p = proj(f.x, f.y + 2 * f.R + 0.9, f.z); put(claimed, clampX(p[0], 250), Math.max(600, p[1]), win(t, T.stones12 + 0.05, T.b13 + 0.5, 0.2, 0.25), pop(t, T.stones12 + 0.05)); }
  // 13 — fixed; 14 — paid
  { const p = proj(-41, 2.6, -11); put(fixedTag, p[0], p[1], win(t, T.fixed + 0.9, T.b14 + 0.3, 0.2, 0.25), pop(t, T.fixed + 0.9)); }
  { const f = FIN[1], p = proj(f.x, f.y + 2 * f.R + 0.9, f.z); put(paid, clampX(p[0], 200), Math.max(600, p[1]), win(t, T.wiped + 0.35, T.story - 0.2, 0.2, 0.3), pop(t, T.wiped + 0.35)); }
  // 15 — title and lesson; 16 — legend
  put(title, W / 2, 640, win(t, T.story, T.cta - 0.1, 0.4, 0.3), 0.94 + 0.06 * eo(seg(t, T.story, T.story + 0.6)));
  put(lesson, W / 2, 1180, win(t, T.money2, T.cta - 0.15, 0.3, 0.25), pop(t, T.money2));
  put(legend, W / 2, 472, seg(t, T.cta + 0.1, T.cta + 0.4), pop(t, T.cta + 0.1));
  { const n = Math.min(5, Math.floor(c01((t - T.word) / 0.55) * 5.001)), typed = 'STONE'.slice(0, n), caret = (n < 5 || Math.floor(t * 2.4) % 2) && t < T.posted ? '<i></i>' : '';
    setHTML(cIn, typed ? `<b>${typed}</b>${caret}` : `<em>Add a comment…</em>${caret}`); const sent = t > T.posted; const pc = sent ? 'post on sent' : n === 5 ? 'post on' : 'post'; if (cPost.className !== pc) cPost.className = pc; setTxt(cPost, sent ? 'Posted ✓' : 'Post');
    put(cbox, W / 2, 1210, seg(t, T.comment, T.comment + 0.3), pop(t, T.comment) * (1 + 0.06 * win(t, T.posted, T.posted + 0.3, 0.08, 0.2))); }
  put(quip, W / 2, 1330, seg(t, T.just, T.just + 0.2), pop(t, T.just));
}
function ghostPos(t) { const u = eio(seg(t, T.b10 + 0.1, T.stayed + 0.5)); return [lerp(GH_A[0], GH_B[0], u), lerp(GH_A[1], GH_B[1] + 1.9, u), lerp(GH_A[2], GH_B[2], u)]; }

// ───────────────────────── one frame
const hopY = (hops, t, h = 0.5) => { let y = 0; for (const t0 of hops) { const u = (t - t0) / 0.38; if (u > 0 && u < 1) y = Math.max(y, Math.sin(u * Math.PI) * h); } return y; };
const _m4 = new THREE.Matrix4(), _q = new THREE.Quaternion(), _e = new THREE.Euler(), _p = new THREE.Vector3(), _s = new THREE.Vector3();
function renderAt(t) {
  const s = skyAt(t), night = s.glow, lk = (t > T.wipe1 + 0.5 && t < T.wipe2 + 0.6) ? lightK(t) : 0;
  paintSky(lk > 0.01 ? { ...s, top: s.top.map((v, i) => lerp(v, [0.42, 0.46, 0.58][i], lk * 0.45)), mid: s.mid.map((v, i) => lerp(v, [0.5, 0.55, 0.66][i], lk * 0.45)), hor: s.hor.map((v, i) => lerp(v, [0.6, 0.64, 0.74][i], lk * 0.35)) } : s);
  scene.fog.color.setRGB(...s.fog); scene.fog.near = s.fn; scene.fog.far = s.ff;
  hemi.color.setRGB(...s.hemS); hemi.groundColor.setRGB(...s.hemG); hemi.intensity = s.hemI + lk * 1.1;
  sun.color.setRGB(...s.sunC); sun.intensity = s.sunI;
  const az = s.az * Math.PI / 180, el = s.el * Math.PI / 180, sd = [Math.cos(el) * Math.sin(az), Math.sin(el), Math.cos(el) * Math.cos(az)];
  starM.opacity = s.star * 0.9; stars.visible = s.star > 0.01;
  waterM.color.setRGB(...s.wat); waterM.emissive.setRGB(s.wat[0] * 0.3, s.wat[1] * 0.35, s.wat[2] * 0.4); surfM.opacity = 0.55 + 0.2 * Math.sin(t * 2.1);
  const storm = t > T.wipe1 + 0.45 && t < T.wipe2 + 0.55;
  WK = storm ? lerp(0.35, 1.25, sm(T.voyage - 0.4, T.storm + 0.5, t)) : 0.12;
  waterM.opacity = storm ? 0.86 : t < 7 ? lerp(0.4, 0.72, sm(3.5, 6.5, t)) : (t > T.something - 0.6 ? 0.66 : 0.72);

  setCamera(t);
  updateWater(t, camera.position.x, camera.position.z);

  // people
  for (const c of CAST) { const on = c.show(t); c.m.visible = on; if (!on) continue; c.m.position.set(c.x, c.y, c.z); c.m.rotation.set(0, c.ry, 0); c.m.scale.y = 1; }
  { const p = docPos(t), walk = t > 6.6 && t < T.twelve - 0.4; doc.m.position.set(p[0], p[3] + (walk ? Math.abs(Math.sin(t * 7.5)) * 0.08 : 0), p[1]); doc.m.rotation.y = p[2]; }
  friend.m.rotation.y = FACE.s + 0.25; arm.rotation.set(0, 0, lerp(0, 2.05, eio(seg(t, T.friend + 0.3, T.friend + 0.8))) * (1 - seg(t, T.wipe1 - 0.2, T.wipe1 + 0.2)));
  famNow.forEach((c, i) => { c.m.position.y = c.y + hopY([T.home16 + 0.1 + i * 0.12, T.home16 + 0.55 + i * 0.12], t); });
  // payment: the canoe goes to the buyer, the stone stays; everyone remembers
  { const u = eio(seg(t, T.stone5 + 0.25, T.never + 0.1)); const x = lerp(9.0, 4.4, u), z = 4.3; payC.visible = t > T.b4 - 1.5 && t < T.b6 + 0.4; payC.position.set(x, Math.max(groundY(x, z), waveY(x, z, t)) + 0.05, z); payC.rotation.set(0, Math.PI, 0.02);
    buyer.m.position.y = buyer.y + hopY([T.stone5 + 0.05, T.never + 0.25], t, 0.4); seller.m.position.y = seller.y + hopY([T.stone5 + 0.05], t, 0.4);
    PAYS.m.position.y = PAYS.y + hopY([T.stone5 - 0.05], t, 0.25) * 0.6;
    payV.forEach((v, i) => { v.m.position.y = v.y + hopY([BUB_T[i] - 0.05], t, 0.3); }); }
  // arrival canoe + raft
  { const on = t > ARR.t0 - 0.2 && t < T.b6 + 0.4; arrC.visible = arrR.visible = on; rope1.visible = false;
    if (on) { const [x, z, yaw] = arrPos(t), ux = Math.cos(yaw), uz = -Math.sin(yaw); flo(arrC, x, z, t, 0.05, yaw, 0.6); const rx = x - ux * 7.6, rz = z - uz * 7.6; flo(arrR, rx, rz, t, 0.0, yaw, 0.6); setRope(rope1, [x - ux * 2.3, 0.45 + waveY(x, z, t), z - uz * 2.3], [rx + ux * 2.5, 0.35 + waveY(rx, rz, t), rz + uz * 2.5], true); } }
  // crew canoe (long ago, beached)
  { crewC.visible = t > T.wipe2 + 0.4 && t < T.wipe3 + 0.4; crewC.position.set(1.4, Math.max(groundY(1.4, 6.4), 0.02) + 0.05, 6.4); crewC.rotation.set(0, 0.4, 0.03); }
  crew.forEach((c, i) => { c.m.position.y = c.y + hopY([T.swore + i * 0.18, T.magnificent + 0.1 + i * 0.15], t, 0.45); });
  lis.forEach((c, i) => { const nod = Math.sin(c01((t - T.agreed - i * 0.09) / 0.5) * Math.PI) * 0.22; c.m.rotation.z = -nod; c.m.position.y = c.y + hopY([T.counted + 0.1 + i * 0.08], t, 0.3); });
  gens.forEach((c, i) => { const k = back(seg(t, GEN_T[i], GEN_T[i] + 0.35)); c.m.scale.setScalar(Math.max(0.001, k)); c.m.position.y = c.y + hopY([T.wipe3 - 0.9 + i * 0.1], t, 0.3); });
  // the ghost stone
  { const o = win(t, T.magnificent - 0.05, T.wipe3 + 0.35, 0.5, 0.3), g = ghostPos(t), gr = back(seg(t, T.magnificent - 0.05, T.magnificent + 0.5)); ghost.visible = ghalo.visible = o > 0.01; ghostM.opacity = o * (0.58 + 0.06 * Math.sin(t * 3)); ghaloM.opacity = o * 0.6; ghalo.position.set(g[0], g[1], g[2]); ghalo.scale.setScalar(5.6 * Math.max(0.001, gr)); ghalo.lookAt(camera.position); ghost.position.set(g[0], g[1], g[2]); ghost.rotation.set(0, Math.PI / 2 + 0.25 * Math.sin(t * 0.6) * (1 - seg(t, T.b10, T.stayed + 0.5)), 0); ghost.scale.setScalar(Math.max(0.001, gr) * lerp(1, 0.9, seg(t, T.b10, T.stayed + 0.5))); }
  // German rule: the station pops up, officials walk, orders fly, chiefs turn away
  { const k = t < T.wipe3 + 0.6 ? 0.001 : back(seg(t, T.wipe3 + 0.9, T.wipe3 + 1.35)); station.scale.set(1, Math.max(0.001, k), 1); station.visible = k > 0.002; }
  offs.forEach((o, i) => { const [x, z, ry] = offRoute(i, t), walking = (t > OFF_T0 && t < OFF_T1) || (t > T.b12 + 0.15 + i * 0.12 && t < T.paint - 0.2 + i * 0.25); o.m.position.set(x, groundY(x, z) + (walking ? Math.abs(Math.sin(t * 8 + i)) * 0.08 : 0), z); o.m.rotation.y = ry; });
  chiefs.forEach((c, i) => { const tt = [T.ignored + 0.35, T.paths11 + 0.2][i]; c.m.rotation.y = lerp(FACE.n, FACE.s + 0.5, eio(seg(t, tt, tt + 0.35))); c.m.position.y = c.y + hopY([T.rich14 + 0.05 + i * 0.12], t, 0.4); });
  papers.forEach((m, i) => { const t0 = PAPER_T[i], u = (t - t0) / 0.55; if (u <= 0 || u >= 1.6 || !GS(t)) { m.visible = false; return; } m.visible = true; const o = offRoute(i, t0), c = chiefs[i].m.position, uu = c01(u); m.position.set(lerp(o[0], c.x, uu), lerp(1.5, 1.3, uu) + 1.0 * Math.sin(Math.PI * uu) - (u > 1 ? (u - 1) * 2.0 : 0), lerp(o[1], c.z - 0.5, uu)); m.rotation.set(Math.sin(t * 9) * 0.5, t * 4, u > 1 ? (u - 1) * 3 : 0); m.visible = u < 1.45; });
  // workers: slump, rush to the path, hop when rich again
  workers.forEach((c, i) => { const go = eio(seg(t, T.people - 0.15 + i * 0.08, T.fixed + 0.3 + i * 0.08)), back2 = eio(seg(t, T.wiped - 0.5, T.wiped + 0.3)); const d = WORK_DEST[i], x = lerp(lerp(c.x, d[0], go), c.x + 0.8, back2), z = lerp(lerp(c.z, d[1], go), c.z - 0.8, back2);
    const slump = win(t, T.poor - 0.1, T.people, 0.25, 0.3); c.m.scale.y = 1 - 0.12 * slump; c.m.rotation.y = go > 0 && go < 1 ? Math.atan2(-(d[1] - c.z), d[0] - c.x) : back2 > 0 ? Math.atan2(-(-9.5 - z), -31 - x) : c.ry;
    c.m.position.set(x, groundY(x, z) + (go > 0 && go < 1 ? Math.abs(Math.sin(t * 9 + i)) * 0.12 : 0) + hopY([T.rich14 + 0.08 * i, T.rich14 + 0.5 + 0.06 * i], t, 0.45) + hopY([T.fixed + 0.5 + i * 0.07], t, 0.25), z); });
  // the west path: intact → broken (German rule) → fixed, slab by slab
  { const broken = t > T.wipe3 + 0.4; WEST.forEach((s, i) => { const f = broken ? eio(seg(t, fixT(s), fixT(s) + 0.38)) : 1, k = 1 - f, arc = Math.sin(Math.PI * f) * 0.9;
      const x = lerp(s.bx, s.x, f), z = lerp(s.bz, s.z, f), y = groundY(x, z) + 0.05 + k * s.by + arc, sc = s.gone ? Math.max(0.001, f > 0 ? f : 0) : 1;
      _p.set(x, y, z); _e.set(s.brx * k, s.ry + s.bry * k, s.brz * k); _q.setFromEuler(_e); _s.set(sc, sc, sc); westMesh.setMatrixAt(i, _m4.compose(_p, _q, _s)); }); westMesh.instanceMatrix.needsUpdate = true; }
  // the crosses: painted stroke by stroke, then wiped away
  crosses.forEach((g, i) => { const t0 = CROSS_T[i], wipe = seg(t, T.wiped - 0.05 + i * 0.12, T.wiped + 0.35 + i * 0.12); g.visible = wipe < 1 && GS(t);
    g.userData.strokes.forEach((st, k) => { const u = seg(t, t0 + k * 0.17, t0 + k * 0.17 + 0.2); st.visible = u > 0; st.scale.set(1, Math.max(0.001, 1 - wipe), Math.max(0.001, u * g.userData.L)); }); });
  { const job = [[CROSS_T[0] - 0.35, CROSS_T[0] + 0.5, 0], [CROSS_T[1] - 0.3, CROSS_T[1] + 0.5, 1], [CROSS_T[2] - 0.3, CROSS_T[2] + 0.5, 2]].find(([a, b]) => t > a && t < b); brush.visible = !!job && GS(t);
    if (job) { const i = job[2], g = crosses[i], f = FIN[i], t0 = CROSS_T[i], k = t < t0 + 0.17 ? 0 : 1, u = seg(t, t0 + k * 0.17, t0 + k * 0.17 + 0.2), st = g.userData.strokes[k], L = g.userData.L, th = st.userData.th;
      _p.set(g.userData.off + 0.12, st.position.y - Math.sin(th) * L * u, st.position.z + Math.cos(th) * L * u); f.m.updateMatrixWorld(); _p.applyMatrix4(f.m.matrixWorld); if (t < t0) _p.y += 0.4 * (1 - seg(t, job[0], t0));
      brush.position.copy(_p); brush.rotation.set(0.2, f.ry, 0.5 + Math.sin(t * 14) * 0.15); } }
  // storm at sea
  { const on = storm; stC.visible = stR.visible = great.visible = on; rope2.visible = false; rain.visible = on; bolts.forEach((b, k) => { b.visible = on && Math.abs(t - BOLT[k]) < 0.3; b.material.opacity = c01(lightK(t) * 1.4) * (Math.abs(t - BOLT[k]) < 0.3 ? 1 : 0); b.position.set(stormRaft(BOLT[k])[0] + [-30, 40, -10][k], 0, SL[2] - 140 + [0, -20, 10][k]); });
    if (on) {
      const [rx, rz, yaw] = stormRaft(t), [cx, cz] = stormCanoe(t);
      flo(stC, cx, cz, t, 0.05, 0.05, 0.9); flo(stR, rx, rz, t, 0.0, yaw, 0.9);
      if (t < ST.cut) setRope(rope2, [cx - 2.4, 0.5 + waveY(cx, cz, t), cz], [rx + 3.2, 0.4 + waveY(rx, rz, t), rz], true);
      stCrew.forEach((p, i) => { p.position.y = 0.3 + hopY([ST.cut - 0.25 + i * 0.1], t, 0.35); });
      // the great stone: upright on the raft (facing the camera behind it) → the raft tips, the wheel rolls off its side → splash → it sinks
      const tilt = win(t, T.loose - 0.2, T.wipe2 + 1, 0.8, 0.1); stR.rotation.x -= 0.2 * tilt;
      const tip = seg(t, ST.tip, ST.splash), dist = 3.9 * tip * tip, drop = Math.max(0, dist - 2.1), sink = seg(t, ST.splash, T.wipe2 + 0.7);
      const top = stR.position.y + 0.36 + 1.9 - 0.2 * tilt * Math.min(dist, 2.1) * 0.5;
      const gx = rx - 0.4, gz = rz - dist - sink * 0.9, gy = sink > 0 ? lerp(0.5, -10, Math.pow(sink, 1.25)) : top - drop * drop * 3.5;
      great.position.set(gx, gy, gz); great.rotation.order = 'ZYX'; great.rotation.set(-dist / 1.9 + stR.rotation.x * (1 - tip) - sink * 0.8, yaw, stR.rotation.z * (1 - tip) + sink * 1.1);
      great.visible = gy > -9.5;
      SPL.forEach((sp, k) => { const m = splash[k], u = (t - ST.splash) / 0.9; if (u <= 0 || u >= 1) { m.visible = false; return; } m.visible = true; const r = sp.v * u; m.position.set(gx + Math.cos(sp.a) * r, waveY(gx, rz - 3.4, t) + sp.h * 4 * u * (1 - u) * 0.6, rz - 3.4 + Math.sin(sp.a) * r); m.scale.setScalar(sp.s * (1 - u * 0.6)); });
      // rain around the camera target
      const rk = sm(T.voyage - 0.6, T.storm, t) * 0.85, a = rainG.attributes.position; rain.material.opacity = rk * 0.6;
      for (let i = 0; i < RN; i++) { const d = RD[i], ph = (t * 1.6 * d[3] + d[1]) % 1, x = camTg.x - 18 + d[0] * 36, z = camTg.z - 14 + d[2] * 30, y = 22 - ph * 24; a.setXYZ(i * 2, x, y, z); a.setXYZ(i * 2 + 1, x + 0.35, y - 1.3, z + 0.12); }
      a.needsUpdate = true;
      FOAM.forEach((f, i) => { const x = SL[0] + 40 + f.x + ((t * 1.5 + f.ph * 3) % 8), z = SL[2] + f.z, k = 0.6 + 0.4 * Math.sin(t * 1.3 + f.ph); _p.set(x, waveY(x, z, t) + 0.05, z); _e.set(0, f.ph, 0); _q.setFromEuler(_e); _s.set(f.w * k, 1, 1); foam.setMatrixAt(i, _m4.compose(_p, _q, _s)); }); foam.instanceMatrix.needsUpdate = true;
    } else SPL.forEach((sp, k) => splash[k].visible = false);
    foam.visible = on;
  }
  // the sunken stone (and the legend: it rises and comes home)
  { const [x, y, z, rx, ry, gl] = sunkPose(t); sunk.position.set(x, y, z); sunk.rotation.set(rx, ry, 0); sunkM.emissiveIntensity = 0.55 * gl; glow.visible = gl > 0.01; glowM.opacity = gl * (0.75 + 0.15 * Math.sin(t * 5)); glow.position.set(x, y, z); glow.scale.setScalar(8 + 1.5 * Math.sin(t * 3)); glow.lookAt(camera.position); }
  { for (let i = 0; i < 9; i++) { const f = FSH[i], a = f.ph + t * f.w, x = HS[0] + Math.cos(a) * f.r, z = HS[2] + Math.sin(a) * f.r, y = f.y + Math.sin(t * 1.3 + i) * 0.15; _p.set(x, y, z); _e.set(0, -a + (f.w > 0 ? -Math.PI / 2 : Math.PI / 2), Math.sin(t * 6 + i) * 0.1); _q.setFromEuler(_e); _s.setScalar(0.9); fishMesh.setMatrixAt(i, _m4.compose(_p, _q, _s)); } fishMesh.instanceMatrix.needsUpdate = true; fishMesh.visible = t < T.wipe1 || t > T.wipe2; }
  // palms, clouds, glints
  for (const p of palms) p.rotation.z = Math.sin(t * 1.25 + p.userData.ph) * 0.045;
  for (const c of clouds) { c.position.x = c.userData.x0 + (c.userData.fixed ? 0 : t * 1.1); c.material.opacity = storm ? 0.95 : 0.9 - 0.5 * night; const k0 = lerp(1, 0.36, c01((3.2 - s.sunI) / 1.4) * (t > T.wipe1 - 0.5 && t < T.wipe2 + 1.2 ? 1 : 0)), k = c.userData.fixed ? Math.max(k0, 0.8) : k0; c.material.color.setRGB(lerp(s.hor[0], 1, 0.55) * k, lerp(s.hor[1], 1, 0.55) * k, lerp(s.hor[2], 1, 0.55) * k * 1.05); c.material.emissive.setRGB(c.material.color.r * 0.35, c.material.color.g * 0.35, c.material.color.b * 0.35); }
  for (const g of glints) { g.visible = !storm; g.position.set(g.userData.x + ((t * g.userData.v * 2) % 6) - 3, waveY(g.userData.x, g.userData.z, t) + 0.03, g.userData.z); g.scale.x = 0.5 + 0.5 * Math.abs(Math.sin(t * 1.7 + g.userData.z)); }
  // sparkles
  { let k = 0; const put3 = (x, y, z, sz, on) => { const sp = sparks[k++]; if (!sp) return; const tw = Math.pow(Math.abs(Math.sin(t * sp.userData.w + sp.userData.ph)), 3); sp.position.set(x, y, z); sp.scale.setScalar(sz * (0.25 + tw)); sp.material.opacity = on * (0.25 + 0.75 * tw); sp.visible = on > 0.01; };
    const sp1 = win(t, T.rich1, 7.0, 0.3, 0.4); for (let i = 0; i < 6; i++) { const a = i * 1.05 + t * 0.3; put3(HS[0] + Math.cos(a) * 1.6, HS[1] + 0.8 + (i % 3) * 0.3, HS[2] + Math.sin(a) * 1.6, 0.9, sp1); }
    const g = ghostPos(t), sp2 = win(t, T.magnificent, T.wipe3 + 0.3, 0.3, 0.3); for (let i = 0; i < 8; i++) { const a = i * 0.785 + t * 0.5; put3(g[0] + Math.cos(a) * 2.1, g[1] + Math.sin(a) * 2.1, g[2] + 0.4, 0.8, sp2); }
    const sp3 = Math.max(win(t, T.wiped - 0.1, T.wiped + 0.9, 0.1, 0.4), win(t, T.rich14, T.b15 + 0.8, 0.2, 0.5)); for (let i = 0; i < 9; i++) { const f = FIN[i % 3], a = i * 2.1 + t * 0.7; put3(f.x + Math.cos(a) * 0.9, f.y + f.R * 2 + 0.2 + (i % 2) * 0.4, f.z + Math.sin(a) * 0.9, 0.9, sp3); }
    const [x, y, z] = sunkPose(t), sp4 = win(t, LG.rise0, DUR + 1, 0.3, 0.1); for (let i = 0; i < 12; i++) { const a = i * 0.52 + t * 0.8, r = 1.6 + (i % 3) * 0.6; put3(x + Math.cos(a) * r, y + Math.sin(a * 1.3) * 1.4, z + Math.sin(a) * r * 0.6, 1.0, sp4); }
    while (k < sparks.length) sparks[k++].visible = false; }

  updateBirds(t);
  dome.position.copy(camera.position); stars.position.copy(camera.position);
  orb.visible = halo.visible = s.orbS > 0.5;
  orb.position.set(camera.position.x + sd[0] * 1600, camera.position.y + sd[1] * 1600, camera.position.z + sd[2] * 1600); orb.scale.setScalar(s.orbS * 2); orb.lookAt(camera.position); orbM.color.setRGB(...s.orb);
  halo.position.copy(orb.position); halo.scale.setScalar(s.orbS * 13); halo.lookAt(camera.position); haloM.color.setRGB(...s.orb); haloM.opacity = 0.75;
  const S2 = Math.min(150, Math.max(18, camD * 0.85));
  sun.target.position.copy(camTg); sun.position.set(camTg.x + sd[0] * 340, camTg.y + sd[1] * 340, camTg.z + sd[2] * 340);
  const sc = sun.shadow.camera; sc.left = -S2; sc.right = S2; sc.top = S2; sc.bottom = -S2; sc.updateProjectionMatrix();
  renderer.render(scene, camera);
  updateUI(t);
}
window.camCheck = () => {
  const out = []; let cur = null;
  for (let f = 0; f < Math.ceil(DUR * 30); f++) {
    const t = f / 30; setCamera(t); const c = camera.position; let hit = null;
    for (const [x0, x1, z0, z1, y1, nm] of stat) if (c.x > x0 - 0.9 && c.x < x1 + 0.9 && c.z > z0 - 0.9 && c.z < z1 + 0.9 && c.y < y1 + 0.9) { hit = nm; break; }
    const storm = t > T.wipe1 + 0.45 && t < T.wipe2 + 0.55; WK = storm ? 1.25 : 0.12;
    if (!hit && c.y < Math.max(0, groundY(c.x, c.z)) + 1.2) hit = 'ground/sea';
    if (!hit && storm && c.y < 2.4) hit = 'waves';
    if (hit) { if (cur && cur[2] === hit && f - cur[1] <= 1) cur[1] = f; else { cur = [f, f, hit]; out.push(cur); } }
  }
  return out.map(([a, b, n]) => `${(a / 30).toFixed(2)}-${(b / 30).toFixed(2)}s ${n}`);
};
window.renderAt = renderAt; window.__dbg = { offs, chiefs, workers, doc, friend, camera, great, stR, stC };
window.CUES = {
  T, DUR, sent: TIM.sentences.map(s => s.s), typing: [0, 1, 2, 3, 4].map(i => +(T.word + (i + 0.5) * 0.11).toFixed(3)),
  bubbles: BUB_T.map(x => +x.toFixed(3)), slabs: [...new Set(WEST.map(s => +(fixT(s) + 0.38).toFixed(2)))].sort((a, b) => a - b), crosses: CROSS_T.flatMap(t0 => [t0, t0 + 0.17]).map(x => +x.toFixed(3)),
  bolts: BOLT.map(x => +x.toFixed(3)), cut: +ST.cut.toFixed(3), tip: +ST.tip.toFixed(3), splash: +ST.splash.toFixed(3), gens: GEN_T.map(x => +x.toFixed(3)), papers: PAPER_T.map(x => +(x + 0.55).toFixed(3)),
  station: +(T.wipe3 + 0.9).toFixed(3), rise: [LG.rise0, LG.rise1, LG.home0, LG.home1].map(x => +x.toFixed(3)), arrive: +ARR.t1.toFixed(3),
};
document.fonts.ready.then(() => Promise.all(['700 64px Figtree', '900 190px Fraunces', '800 30px JBM', '700 22px Inter', '700 78px Fraunces', '800 54px Figtree', '600 34px Figtree', '500 18px Inter'].map(f => document.fonts.load(f)))).then(() => { renderAt(0); window.__ready = true; });
