// The Slow Billions — low-poly storybook scene (deterministic: window.renderAt(t) draws the frame for time t)
// Mon 16 Nov 2026: Warren Buffett, 96, gave about $5.5 billion of Berkshire Hathaway stock (9,225,000 Class B shares) to four family foundations,
// about four times his Thanksgiving 2025 gift (CBS News, AP, CNBC, Fortune, Yahoo Finance). More than $160 billion of shares remain, set to go
// to the same four foundations by 31 Dec 2034 (Fortune, Yahoo Finance, CEOWORLD). His Thanksgiving letter: kindness "compounds, and at a better
// rate than anything Charlie and I ever bought". The mechanism: first stock at 11, 96 now; Berkshire keeps its profits; its per-share market value
// rose 19.9% a year 1965-2024 (overall 5,502,284%: $1,000 -> about $55 million; Berkshire's 2024 letter): on average a doubling about every
// four years, so the biggest gains came last. The world: an Omaha street in late autumn, his house with a porch, four columned foundation
// buildings, and behind them a row of coin towers (1965 -> 2024) that double from one coin to a giant.
import * as THREE from 'three';
import { SKIN, MAT, GOLD, rng, GB, person, cloud, house, lamp, BIGCOIN, CERT, bank, tower, car, coinTowerGeo, porch, autumnTree } from './kit.js';

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
  hookEnd: TIM.big ? 1.5 : TIM.hook ? E(1) + 0.15 : 0,  // the hook card (script.py HOOK): 0-1.5 s when there is a big number, else until the hook sentence ends
  bigIn: TIM.big ? 1.5 : 0, bigOut: TIM.big ? 3.0 : 0,   // the big number (script.py BIG): 1.5-3 s (Keith, 22 Nov 2026)
  small: wt(1, 'small') - 0.1, part: wt(1, 'part') - 0.1,
  b2: S(2) - 0.05, n160: wt(2, '160') - 0.1, follow: wt(2, 'follow') - 0.1, y2034: wt(2, '2034') - 0.1,
  b3: S(3) - 0.05, how: wt(3, 'how') - 0.1, person: wt(3, 'person') - 0.1, give3: wt(3, 'give') - 0.1,
  b4: S(4) - 0.05, warren: wt(4, 'warren') - 0.1, first: wt(4, 'first') - 0.1, stock: wt(4, 'stock') - 0.1, n11: wt(4, '11') - 0.1, n96: wt(4, '96') - 0.1, now4: wt(4, 'now') - 0.1,
  b5: S(5) - 0.05, company: wt(5, 'company') - 0.1, kept: wt(5, 'kept') - 0.1, profits: wt(5, 'profits') - 0.1, used: wt(5, 'used') - 0.1, earn: wt(5, 'earn') - 0.1, year5: wt(5, 'year') - 0.1,
  b6: S(6) - 0.05, thousand: wt(6, 'thousand') - 0.1, charge: wt(6, 'charge') - 0.1, grew: wt(6, 'grew') - 0.1, n55: wt(6, '55') - 0.1, million: wt(6, 'million') - 0.1,
  b7: S(7) - 0.05, compounding: wt(7, 'compounding') - 0.1, growth1: wt(7, 'growth') - 0.1, top: wt(7, 'top') - 0.1, growth2: wt(7, 'growth', 1) - 0.1,
  b8: S(8) - 0.05, average: wt(8, 'average') - 0.1, doubled: wt(8, 'doubled') - 0.1, four: wt(8, 'four') - 0.1, biggest: wt(8, 'biggest') - 0.1, last: wt(8, 'last') - 0.1,
  b9: S(9) - 0.05, now9: wt(9, 'now') - 0.1, giving: wt(9, 'giving') - 0.1, away9: wt(9, 'away') - 0.1,
  b10: S(10) - 0.05, letter: wt(10, 'letter') - 0.1, kindness: wt(10, 'kindness') - 0.1, compounds: wt(10, 'compounds') - 0.1, faster: wt(10, 'faster') - 0.1, bought: wt(10, 'bought') - 0.1,
  b11: S(11) - 0.05, over: wt(11, 'over') - 0.1,
  b12: S(12) - 0.05, story: wt(12, 'story') - 0.15, billions: wt(12, 'billions') - 0.1, time12: wt(12, 'time') - 0.1, lifting: wt(12, 'lifting') - 0.1,
  cta: S(13) - 0.1, would: wt(13, 'would') - 0.1, comment: wt(13, 'comment') - 0.15, giveW: wt(13, 'give', 1) - 0.2, keepW: wt(13, 'keep', 1) - 0.1,
};
T.sinkA = T.first; T.sinkB = T.n96 + 0.2;                  // rewind: the towers sink while he remembers 1942
T.boy = T.first - 0.05;                                     // the boy with his first share
T.riseA = T.grew - 0.15; T.riseB = T.million + 0.15;        // the towers rise again, one coin to a giant (1965 -> 2024)
T.ghostA = T.growth1 - 0.3; T.ghostB = T.top + 0.35;       // growth on top of growth: a copy of a tower drops onto it
T.wipe = T.b9 - 0.2;                                        // sky wipe: the past -> this Thanksgiving
T.streamOn = T.giving - 0.5;                                // the gift streams again
T.treeA = T.compounds; T.treeStep = 0.36;                   // kindness compounds: trees sprout in doubling waves
T.postA = T.giveW + 0.75; T.postB = T.keepW + 0.7;
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
  GOLDEN: P(0xE3955A, 0xFFC88C, 0xFFE6BC, 0xFADDB4, 0xFFD49C, 2.6, 0xFFE8C4, 0x9A7A5A, 1.45, 0, 0.12, -58, 17, 0xFFF0C8, 46, 230, 1150),
  SEPIA: P(0x6E5640, 0xC9A274, 0xF0D6A6, 0xDCC096, 0xFFE2B4, 2.2, 0xF4E0BC, 0x8A6A4A, 1.45, 0, 0.05, -40, 30, 0xFFF0D2, 38, 140, 850),
  DAY: P(0x2F86D2, 0x8CC4EA, 0xE6EEF2, 0xD8E2EA, 0xFFF1DC, 2.4, 0xCFE4FF, 0x9AA6B4, 1.45, 0, 0, 30, 40, 0xFFF8E0, 38, 160, 900),
  SUNSET: P(0x2E2F72, 0xE0707A, 0xFFB25E, 0xEE9A6A, 0xFF9050, 2.4, 0xB49AC8, 0x7A6A7A, 1.3, 0.12, 0.6, -70, 11, 0xFFB060, 50, 130, 800),
  DUSK: P(0x10184A, 0x3E3A86, 0xB0687E, 0x5E4A7A, 0x93A4F4, 1.6, 0x5A66B8, 0x3A3A56, 1.2, 0.65, 0.92, -40, 36, 0xFFF4D6, 30, 110, 700),
};
const SKY = [[0, 'GOLDEN'], [T.first - 0.15, 'GOLDEN'], [T.first + 0.3, 'SEPIA'], [T.n96 - 0.1, 'SEPIA'], [T.n96 + 0.5, 'GOLDEN'], [T.b5, 'GOLDEN'], [T.kept + 0.2, 'DAY'],
  [T.wipe + 0.3, 'DAY'], [T.wipe + 0.75, 'GOLDEN'], [T.b11, 'GOLDEN'], [T.b12 + 0.4, 'SUNSET'], [T.cta + 0.4, 'DUSK'], [DUR + 2, 'DUSK']];
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
const HOME = [0, 10];                                       // his house (front and porch toward +z, the street)
const MAN = [2.3, 0.75, 16.2], BOY = [-0.7, 0, 19.9];      // Buffett on the porch; the boy of 1942 on the path
const FND = [[-36, -24], [-13, -32], [13, -32], [36, -24]]; // the four family foundations, facing the house
const ROWZ = -78, NT = 16, TX = i => -150 + 10 * i, HMAX = 64; // the row of coin towers, 1965 (far left) -> 2024 (the giant, right behind the foundations)
const TH = i => Math.max(0.34, HMAX * Math.pow(2, i - (NT - 1)));
const CO = [-150, -100];                                    // his company (just behind the start of the row)
const stat = [];

// ───────────────────────── ground, streets, lawns
const ground = new THREE.Mesh(new THREE.PlaneGeometry(2400, 2400).rotateX(-Math.PI / 2), new THREE.MeshLambertMaterial({ color: 0xBDB474 })); ground.receiveShadow = true; scene.add(ground);
const flat = new GB();
flat.box(320, 0.05, 10, 0x6E6A66, 0, 0.025, 28); for (let x = -150; x < 150; x += 8) flat.box(3.2, 0.06, 0.35, 0xEDE3C8, x, 0.04, 28);                  // the street and its centre line
flat.box(320, 0.06, 2.4, 0xD8D0BC, 0, 0.03, 21.8); flat.box(320, 0.06, 2.4, 0xD8D0BC, 0, 0.03, 34.2);                                                // pavements
flat.box(2.2, 0.065, 4.4, 0xD8D0BC, -1.0, 0.032, 19.4);                                                                                       // his front path
flat.box(46, 0.05, 30, 0x9FAE62, 0, 0.026, -28); flat.box(2.6, 0.06, 32, 0xD8D0BC, 0, 0.035, -6);                                            // the green by the foundations, a path to it
flat.box(178, 0.05, 22, 0xB7A86E, -72, 0.027, ROWZ);                                                                                          // the long field of the coin towers
const flatM = flat.mesh(); flatM.castShadow = false; scene.add(flatM);

// ───────────────────────── the town: houses along the street, autumn trees, lamps, parked cars
const HOUSES = [];
{ const hr = rng(1958), COL = [0xB8644A, 0xD9C39A, 0x8FB3C2, 0xE4DED2, 0x6A8AA4, 0xC98A5A, 0xA4604E, 0xD8B07A];
  for (const [z, f] of [[10, 1], [47, -1], [-8, 1]]) for (let x = -150; x <= 150; x += 21) {
    if (f === 1 && z === 10 && Math.abs(x) < 12) continue;                  // his own house goes here
    if (z === -8 && Math.abs(x) < 52) continue;                             // the green and the foundations
    if (hr() < 0.12) continue;
    const w = 8 + hr() * 3, h = 5 + hr() * 2.4, d = 7.5 + hr() * 2;
    const m = house(w, h, d, { rand: hr, color: COL[Math.floor(hr() * COL.length)], roof: [0x5A5E6C, 0x6A4A3E, 0x4E5A4A][Math.floor(hr() * 3)], front: f });
    const xx = x + (hr() - 0.5) * 4; m.position.set(xx, 0, z + (hr() - 0.5) * 2); scene.add(m); HOUSES.push(m); stat.push([xx - w / 2 - 0.6, xx + w / 2 + 0.6, z - d / 2 - 0.6, z + d / 2 + 0.6, h + 3.5, 'house']);
  }
}
const winM = new THREE.MeshBasicMaterial({ color: 0xFFC866, transparent: true, opacity: 0, toneMapped: false });
{ const g = new GB(), v = new THREE.Vector3(), wr = rng(77); for (const h of HOUSES) { h.updateMatrixWorld(true); for (const [wx, wy, wz] of h.userData.win || []) if (wr() < 0.55) { h.localToWorld(v.set(wx, wy, wz)); g.box(0.56, 0.86, 0.06, 0xFFFFFF, v.x, v.y, v.z); } } scene.add(new THREE.Mesh(g.geo(), winM)); }
{ const tr = rng(4), spots = [];
  for (let i = 0; i < 170; i++) { const x = -160 + tr() * 320, z = -120 + tr() * 200; spots.push([x, z]); }
  for (const [x, z] of spots) {
    if (Math.abs(z - 28) < 9 || (Math.abs(x) < 30 && z > -48 && z < 22) || (Math.abs(z - ROWZ) < 16 && x > -166 && x < 16) || Math.hypot(x - CO[0], z - CO[1]) < 14 || (Math.abs(x) < 36 && z > 17 && z < 90)) continue;
    if (stat.some(s => x > s[0] - 2 && x < s[1] + 2 && z > s[2] - 2 && z < s[3] + 2)) continue;
    const m = autumnTree(5 + tr() * 4, tr); m.position.set(x, 0, z); m.rotation.y = tr() * 6.28; scene.add(m);
  }
  for (const [x, z] of [[-11, 4], [11, 3], [-24, 2], [22, 0], [-16, -12], [17, -14]]) { const m = autumnTree(6.5, tr); m.position.set(x, 0, z); scene.add(m); stat.push([x - 2.2, x + 2.2, z - 2.2, z + 2.2, 8, 'tree']); }
}
const lampHeads = new GB();
for (let x = -140; x <= 140; x += 28) { const l = lamp(6.2); l.position.set(x + 6, 0, 22.6); l.rotation.y = -Math.PI / 2; scene.add(l); const hv = new THREE.Vector3(1.25, 6.02, 0); l.updateMatrixWorld(true); l.localToWorld(hv); lampHeads.box(0.6, 0.12, 0.36, 0xFFFFFF, hv.x, hv.y, hv.z); }
const lampM = new THREE.MeshLambertMaterial({ color: 0xFFF1C8, emissive: 0xFFD27A, emissiveIntensity: 0 }); scene.add(new THREE.Mesh(lampHeads.geo(), lampM));
for (const [x, z, c] of [[-30, 25.5, 0x8A3A3A], [44, 25.5, 0x3B6FA8], [-70, 30.5, 0xE2D6B8], [86, 30.5, 0x4E7A3E]]) { const m = car(c); m.position.set(x, 0, z); m.rotation.y = z < 28 ? 0 : Math.PI; scene.add(m); }

// ───────────────────────── his house: a plain two-storey house with a porch (he still lives in the house he bought in 1958)
const home = house(11, 6.8, 9, { rand: rng(1958), color: 0xE6DCC6, roof: 0x5E544E, trim: 0xFFFFFF, chim: 0x9A5A44, door: 0x2E3A4F, front: 1 }); home.position.set(HOME[0], 0, HOME[1]); scene.add(home);
const homePorch = porch(8.4, 2.6, { roof: 0x5E544E }); homePorch.position.set(HOME[0], 0, HOME[1] + 4.5 + 1.3); scene.add(homePorch);
stat.push([HOME[0] - 6.2, HOME[0] + 6.2, HOME[1] - 5.2, HOME[1] + 7.4, 10.4, 'his house']);
const homeWinM = new THREE.MeshBasicMaterial({ color: 0xFFC866, transparent: true, opacity: 0, toneMapped: false });
{ const g = new GB(), v = new THREE.Vector3(); home.updateMatrixWorld(true); for (const [wx, wy, wz] of home.userData.win || []) { home.localToWorld(v.set(wx, wy, wz)); g.box(0.56, 0.86, 0.06, 0xFFFFFF, v.x, v.y, v.z); } scene.add(new THREE.Mesh(g.geo(), homeWinM)); }
const man = person({ robe: 0x2B3550, skin: SKIN[4], short: 0xF2F2EE, shirt: 0xFFFFFF, tie: 0xB8383B, s: 1.08 }); man.position.set(MAN[0], MAN[1], MAN[2]); man.rotation.y = -Math.PI / 2 + 0.25; scene.add(man);
const boy = person({ robe: 0x5E7A46, skin: SKIN[4], bigHat: true, hat: 0x6A5040, s: 0.72 }); boy.position.set(BOY[0], 0, BOY[2]); boy.rotation.y = -Math.PI / 2 - 0.2; boy.visible = false; scene.add(boy);
const certM = new THREE.MeshLambertMaterial({ vertexColors: true, emissive: 0xFFB84A, emissiveIntensity: 0 });
const cert = new THREE.Mesh(CERT, certM); cert.scale.setScalar(0.62); cert.visible = false; scene.add(cert);
const certGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: radial('rgba(255,210,120,0.9)', 'rgba(255,170,60,0)'), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false })); certGlow.visible = false; scene.add(certGlow);
const qM = new THREE.MeshBasicMaterial({ color: 0xFFC84A, toneMapped: false }), qMesh = (() => { const b = new GB(); b.add(new THREE.TorusGeometry(0.42, 0.13, 6, 14, Math.PI * 1.35), 0xFFFFFF, new THREE.Matrix4().makeRotationZ(-0.65).setPosition(0, 0.55, 0)); b.box(0.24, 0.42, 0.2, 0xFFFFFF, 0.02, -0.05, 0); b.box(0.26, 0.26, 0.2, 0xFFFFFF, 0.02, -0.55, 0); return new THREE.Mesh(b.geo(), qM); })(); scene.add(qMesh);

// ───────────────────────── the four family foundations (columned buildings around the green)
const FTOP = [];
FND.forEach(([x, z], i) => { const g = bank(); g.scale.setScalar(0.5); g.position.set(x, 0, z); g.rotation.y = Math.atan2(HOME[0] - x, HOME[1] - z); scene.add(g); g.updateMatrixWorld(true);
  const v = new THREE.Vector3(0, 9, 4); g.localToWorld(v); FTOP.push([v.x, v.y, v.z]); stat.push([x - 7.5, x + 7.5, z - 7.5, z + 7.5, 9, 'foundation']); });
const fGlowM = new THREE.MeshBasicMaterial({ color: 0xFFD27A, transparent: true, opacity: 0, toneMapped: false, depthWrite: false, blending: THREE.AdditiveBlending });
const fGlows = FND.map(([x, z]) => { const m = new THREE.Mesh(new THREE.CircleGeometry(8.5, 28).rotateX(-Math.PI / 2), fGlowM); m.position.set(x, 0.12, z); scene.add(m); return m; });

// ───────────────────────── his company (left end of the row): an office that keeps its profits and grows
const company = tower(8, 9, 8, { rand: rng(1965), color: 0xD8CBB0, lobby: true }); company.position.set(CO[0], 0, CO[1]); scene.add(company);
stat.push([CO[0] - 4.8, CO[0] + 4.8, CO[1] - 4.8, CO[1] + 4.8, 17, 'company']);

// ───────────────────────── the coin towers: tower i (1965 + ~4i) is twice tower i-1; they sink in the rewind and rise again
const towerM = new THREE.MeshLambertMaterial({ vertexColors: true, color: 0xF7B500, emissive: 0xA86A00, emissiveIntensity: 0.45 });
const TOW = []; for (let i = 0; i < NT; i++) { const h = TH(i), r = 2.5; const m = new THREE.Mesh(coinTowerGeo(r, h, h < 1 ? h : 0.62), towerM); m.castShadow = true; m.receiveShadow = true; m.position.set(TX(i), 0, ROWZ); scene.add(m); TOW.push({ m, h, x: TX(i) }); stat.push([TX(i) - 3.2, TX(i) + 3.2, ROWZ - 3.2, ROWZ + 3.2, h + 1.5, 'tower ' + i]); }
const padM = new THREE.MeshLambertMaterial({ color: 0x9A8A62 });
{ const g = new GB(); for (let i = 0; i < NT; i++) g.cyl(3.3, 3.5, 0.3, 18, 0xFFFFFF, TX(i), 0.15, ROWZ); const m = new THREE.Mesh(g.geo(), padM); m.receiveShadow = true; scene.add(m); }
const riseAt = i => T.riseA + (i / (NT - 1)) * (T.riseB - T.riseA - 0.55);
function towerK(i, t) {   // 1 = standing, 0 = sunk below the field
  if (t < T.sinkA) return 1;
  if (i === 0 && t > T.thousand - 0.15) return eo(seg(t, T.thousand - 0.15, T.thousand + 0.25));   // the first $1,000 appears when it is said
  if (t < T.riseA) return 1 - eio(seg(t, T.sinkA + i * 0.03, T.sinkB));
  return eo(seg(t, riseAt(i), riseAt(i) + 0.55));
}
// growth on top of growth: a copy of tower 12 drops onto it (then it matches tower 13 beside it)
const ghostM = new THREE.MeshLambertMaterial({ vertexColors: true, color: 0xFFD36A, emissive: 0xC88A10, emissiveIntensity: 0.6, transparent: true, opacity: 0.85 });
const ghost = new THREE.Mesh(coinTowerGeo(2.5, TH(12), 0.62), ghostM); ghost.visible = false; scene.add(ghost);

// ───────────────────────── coins: the gift streams from the top of the giant tower to the four foundations; the company's loop
const COINM = new THREE.MeshLambertMaterial({ color: 0xF7B500, emissive: 0xB87A10, emissiveIntensity: 0.7 });
const COING = BIGCOIN(0.72, 0.2), NC = 260;
const coins = new THREE.InstancedMesh(COING, COINM, NC); coins.castShadow = true; coins.frustumCulled = false; scene.add(coins);
const CR = Array.from({ length: NC }, (_, i) => { const rr = rng(700 + i); return { f: i % 4, ph: rr(), sp: 0.32 + rr() * 0.12, jx: (rr() - .5) * 6, jz: (rr() - .5) * 5, rs: 3 + rr() * 5, rp: rr() * 6 }; });
const GTOP = [TX(NT - 1), HMAX + 0.6, ROWZ];
function bez(p0, p1, p2, p3, u) { const a = (1 - u) ** 3, b = 3 * (1 - u) ** 2 * u, d = 3 * (1 - u) * u * u, e = u ** 3; return [a * p0[0] + b * p1[0] + d * p2[0] + e * p3[0], a * p0[1] + b * p1[1] + d * p2[1] + e * p3[1], a * p0[2] + b * p1[2] + d * p2[2] + e * p3[2]]; }
const streamPt = (f, u, jx = 0, jz = 0) => { const q = FTOP[f]; return bez(GTOP, [lerp(GTOP[0], q[0], 0.2) + jx, GTOP[1] + 18, lerp(GTOP[2], q[2], 0.15) + jz], [q[0] + (q[0] - GTOP[0]) * 0.12 + jx, q[1] + 28, q[2] - 8 + jz], q, u); };
const streamK = t => t < T.b4 ? 1 - seg(t, T.b3 + 0.6, T.b4) : seg(t, T.streamOn, T.streamOn + 0.6);
const _m4 = new THREE.Matrix4(), _q = new THREE.Quaternion(), _e = new THREE.Euler(), _p = new THREE.Vector3(), _s = new THREE.Vector3();
const LOOPN = 30, loopK = t => win(t, T.kept - 0.2, T.b6 + 0.2, 0.3, 0.4);
const COMPTOP = () => 9 * company.scale.y + 0.6;

// ───────────────────────── kindness compounds: trees sprout around the foundations in doubling waves (1, 2, 4 … 128)
const NTREE = 255, TREEW = 8;
const treeGeos = [0, 1, 2].map(k => autumnTree(4.6, rng(30 + k), { green: true }).geometry);
const TREES = []; { const tr = rng(2026);
  for (let w = 0; w < TREEW; w++) { const n = 2 ** w; for (let k = 0; k < n; k++) { let x, z, tries = 0;
    do { const a = tr() * Math.PI * 2, r = 9 + w * 11 + tr() * 10; x = Math.cos(a) * r * 1.35; z = -28 + Math.sin(a) * r * 0.9; tries++; }
    while (tries < 30 && (Math.abs(z - 28) < 8 || stat.some(s => x > s[0] - 1.5 && x < s[1] + 1.5 && z > s[2] - 1.5 && z < s[3] + 1.5) || Math.hypot(x - HOME[0], z - HOME[1]) < 11));
    TREES.push({ x, z, w, t: T.treeA + w * T.treeStep + tr() * 0.25, g: Math.floor(tr() * 3), s: 0.8 + tr() * 0.5, ry: tr() * 6.28 }); } } }
const treeMeshes = treeGeos.map((g, k) => { const m = new THREE.InstancedMesh(g, MAT, TREES.filter(q => q.g === k).length); m.castShadow = true; m.frustumCulled = false; scene.add(m); return m; });

// ───────────────────────── falling leaves, clouds, sparkles
const NLF = 900, leafG = new THREE.BufferGeometry(); leafG.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(NLF * 3), 3));
{ const cl = new Float32Array(NLF * 3), lr = rng(11); const P3 = [[0.93, 0.55, 0.18], [0.85, 0.38, 0.17], [0.95, 0.71, 0.27], [0.78, 0.31, 0.18]]; for (let i = 0; i < NLF; i++) { const c = P3[Math.floor(lr() * 4)]; cl.set(c, i * 3); } leafG.setAttribute('color', new THREE.Float32BufferAttribute(cl, 3)); }
const leaves = new THREE.Points(leafG, new THREE.PointsMaterial({ vertexColors: true, size: 0.6, transparent: true, opacity: 0.95, depthWrite: false, map: radial('rgba(255,255,255,1)', 'rgba(255,255,255,0)') })); leaves.frustumCulled = false; scene.add(leaves);
const LF = []; { const sr = rng(4242); for (let i = 0; i < NLF; i++) LF.push([sr(), sr(), sr(), 0.5 + sr() * 0.8, sr() * 6.28]); }
const clouds = []; for (let i = 0; i < 16; i++) { const m = cloud(R); m.position.set(-420 + R() * 840, 120 + R() * 40, -600 + R() * 380); m.scale.setScalar(2.2 + R() * 2.2); m.userData.x0 = m.position.x; scene.add(m); clouds.push(m); }
const sparkT = (() => { const cv = document.createElement('canvas'); cv.width = cv.height = 64; const g = cv.getContext('2d'); g.translate(32, 32); g.fillStyle = '#fff'; for (let k = 0; k < 2; k++) { g.rotate(Math.PI / 2 * k); g.beginPath(); g.moveTo(0, -30); g.quadraticCurveTo(3, -3, 30, 0); g.quadraticCurveTo(3, 3, 0, 30); g.quadraticCurveTo(-3, 3, -30, 0); g.quadraticCurveTo(-3, -3, 0, -30); g.fill(); } const tx = new THREE.CanvasTexture(cv); tx.colorSpace = THREE.SRGBColorSpace; return tx; })();
const sparks = []; for (let i = 0; i < 80; i++) { const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: sparkT, color: 0xFFE9A8, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false })); sp.userData = { ph: R() * 6.28, w: 3 + R() * 4, dx: (R() - 0.5) * 2, dz: (R() - 0.5) * 2 }; scene.add(sp); sparks.push(sp); }

// ───────────────────────── camera path (spherical keys around a target; `up` tilts the view so the subject sits lower in the frame)
const CAM = [
  { t: 0, tg: [0, 22, -34], d: 175, az: -8, el: 11, up: 0.04 },                                     // the cover: his house, the foundations, the giant coin tower behind and the gift streaming
  { t: T.bigOut, tg: [0, 22, -36], d: 168, az: -6, el: 11, up: 0.04, mv: 1 },
  { t: T.part + 0.35, tg: [0, 30, -60], d: 150, az: -4, el: 9, up: 0.03, mv: 1 },                   // the small part: the giant tower behind the stream
  { t: T.n160 + 0.4, tg: [0, 40, -76], d: 100, az: -14, el: 7, up: 0.02, mv: 1 },                   // up the giant: more than $160 billion
  { t: T.y2034 + 0.3, tg: [0, 18, -46], d: 132, az: -10, el: 15, up: 0.02, mv: 1 },                 // the streams to the foundations, by 2034
  { t: T.how + 0.25, tg: [0, 5, 12], d: 44, az: 12, el: 14, up: 0.03, mv: 1 },                      // his house: how?
  { t: T.give3 + 0.3, tg: [0, 4.5, 13], d: 36, az: 8, el: 12, up: 0.02 },
  { t: T.warren + 0.25, tg: [0.6, 2.0, 18.2], d: 23, az: 5, el: 9, up: 0.0, mv: 1 },               // the porch: Warren Buffett; the boy of 1942
  { t: T.now4 + 0.2, tg: [0.8, 2.0, 18.2], d: 21, az: -4, el: 8, up: 0.0 },
  { t: T.b5 + 0.35, tg: [-76, 26, -42], d: 80, az: 18, el: 32, up: 0.0, mv: 2 },                    // crane over the roofs...
  { t: T.profits + 0.1, tg: [-151, 9, -99], d: 46, az: 26, el: 14, up: 0.02, mv: 3 },               // ...down to his company
  { t: T.year5 + 0.2, tg: [-151, 10, -99], d: 40, az: 32, el: 12, up: 0.02 },
  { t: T.thousand + 0.45, tg: [TX(0), 1.6, ROWZ], d: 17, az: -28, el: 14, up: 0.0, mv: 1 },        // one coin: $1,000 in 1965
  { t: T.grew + 0.3, tg: [-122, 8, ROWZ], d: 62, az: -52, el: 12, up: 0.03, mv: 1 },                // pull back as the towers rise...
  { t: T.million + 0.45, tg: [-42, 26, ROWZ], d: 152, az: -54, el: 10, up: 0.03, mv: 1 },           // ...along the whole row to the giant: about $55 million
  { t: T.compounding + 0.3, tg: [TX(12) + 2, 10, ROWZ], d: 50, az: -30, el: 10, up: 0.02, mv: 1 }, // towers 11-13: growth on top of growth
  { t: T.growth2 + 0.45, tg: [TX(12) + 3, 11, ROWZ], d: 46, az: -24, el: 10, up: 0.02 },
  { t: T.doubled + 0.25, tg: [-34, 20, ROWZ], d: 136, az: -48, el: 8, up: 0.03, mv: 1 },             // the row: ×2 every four years
  { t: T.biggest + 0.1, tg: [-16, 28, ROWZ], d: 104, az: -44, el: 7, up: 0.03, mv: 1 },
  { t: T.last + 0.55, tg: [0, 50, ROWZ], d: 84, az: -30, el: 5, up: 0.03, mv: 1 },                  // up the giant: the biggest gains came last
  { t: T.wipe, tg: [0, 58, ROWZ], d: 76, az: -26, el: 5, up: 0.04 },
  { t: T.wipe + 0.4, tg: [0, 130, -55], d: 40, az: 0, el: -40, up: 0, mv: 1 },                      // sky wipe: the past -> this Thanksgiving
  { t: T.giving + 0.35, tg: [0, 8, -28], d: 104, az: -8, el: 24, up: 0.0, mv: 3 },                  // down over the foundations: the gift streams
  { t: T.kindness + 0.2, tg: [0, 5, -30], d: 92, az: -4, el: 26, up: 0.0, mv: 1 },                  // kindness compounds: trees sprout
  { t: T.bought + 0.35, tg: [0, 5, -28], d: 104, az: 6, el: 28, up: 0.0 },
  { t: T.over + 0.5, tg: [0, 14, -36], d: 150, az: -6, el: 20, up: 0.04, mv: 1 },                   // crane up
  { t: T.story + 1.0, tg: [0, 22, -34], d: 178, az: -8, el: 11, up: 0.05, mv: 3 },                  // the town at sunset: the title
  { t: T.cta - 0.2, tg: [0, 22, -34], d: 170, az: -6, el: 11, up: 0.05 },
  { t: T.would + 0.4, tg: [0, 4.5, 13], d: 40, az: 10, el: 12, up: 0.03, mv: 1 },                    // down to his porch at dusk: give it or keep it?
  { t: DUR + 0.5, tg: [0, 4.5, 13], d: 35, az: 4, el: 11, up: 0.03 },
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
.card em{font-style:normal;color:#FFC84A;} .card small{display:block;margin-top:8px;font:600 18px/1 'Inter',sans-serif;letter-spacing:.08em;color:rgba(255,255,255,.6);}
.plan{text-align:center;font:800 34px/1 'Inter',sans-serif;color:#fff;background:rgba(8,10,26,.9);border:2px solid rgba(255,225,160,.65);padding:22px 30px 20px;border-radius:24px;box-shadow:0 14px 40px rgba(5,7,20,.5);}
.plan .r{display:flex;align-items:center;justify-content:center;gap:22px;} .plan .p{font:800 36px/1 'JBM',monospace;background:#F4F2EC;color:#1C1300;border-radius:12px;padding:12px 16px;} .plan .p.hot{background:#F7A600;}
.plan .a{color:#FFC84A;font:800 40px/1 'Figtree',sans-serif;} .plan .n{margin-top:16px;font:900 50px/1 'JBM',monospace;color:#FFC84A;letter-spacing:-1px;} .plan .s{margin-top:12px;font:600 19px/1 'Inter',sans-serif;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.7);}
.x2{font:900 40px/1 'JBM',monospace;color:#1C1300;background:#F7A600;padding:8px 14px 6px;border-radius:12px;box-shadow:0 6px 18px rgba(5,7,20,.45);}
.worth .row .v0{color:#fff;} .worth .src{margin-top:16px;font:500 18px/1 'Inter',sans-serif;letter-spacing:.05em;color:rgba(255,255,255,.6);}
.letter .tx{font-size:42px;min-height:156px;} .letter .tx em{font-style:normal;color:#A0521E;}
.hookbg{width:1080px;height:820px;background:radial-gradient(ellipse 62% 44% at 50% 50%,rgba(12,8,20,.76) 0%,rgba(12,8,20,.56) 55%,rgba(12,8,20,0) 100%);}
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
const hookBg = TIM.hook ? mk('hookbg', '') : null;   // a soft dark glow behind the hook card so the cover reads over the bright golden sky
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
const tagGift = mk('tag am', 'this gift · <b>$5.5B</b>'), tagRest = mk('tag', 'his shares left · <b>$160B+</b>'), tagFnd = mk('tag', '4 family foundations');
const plan = mk('plan', `<div class="r"><span class="p">16 NOV 2026</span><span class="a">→</span><span class="p hot">31 DEC 2034</span></div><div class="n">$160B+ TO GO</div><div class="s">all his Berkshire shares → 4 family foundations</div>`);
const nameEl = mk('name', '<div class="n">Warren Buffett</div><div class="r">Berkshire Hathaway</div>');
const tagBoy = mk('tag am', 'first stock · age <b>11</b>');
const route = mk('route', '<div class="line"></div><div class="fill"></div><div class="nd" style="left:40px"></div><div class="nd" style="left:720px"></div><div class="dot"></div><div class="lb" style="left:40px">1942 · AGE 11</div><div class="lb" style="left:720px">2026 · AGE 96</div>');
const routeFill = route.querySelector('.fill'), routeDot = route.querySelector('.dot');
const tagCo = mk('tag', 'his company'), loopC = mk('loopc', 'profits<span class="arr">→</span>kept<span class="arr">→</span>more profits');
const tagOne = mk('tag am', '<b>$1,000</b> · 1965'), tag2024 = mk('tag am', 'about <b>$55M</b> · 2024');
const worth = mk('worth', '<div class="t">Berkshire stock · 1965 → 2024</div><div class="row"><span class="v0">$1,000</span><span class="arr">→</span><span class="v1">$1,000</span></div><div class="bar"><div class="fill"></div></div><div class="src">its own yearly table · 19.9% a year</div>');
const worthV = worth.querySelector('.v1'), worthFill = worth.querySelector('.fill');
const tagX2 = Array.from({ length: NT - 1 }, () => mk('x2', '×2'));
const tagYr0 = mk('tag grey', '1965'), tagYr1 = mk('tag grey', '2024'), tagLast = mk('tag am', 'each doubling > all before it');
const letter = mk('letter', '<div class="h">Thanksgiving letter · 16 Nov 2026</div><div class="tx"></div><div class="sg">— Warren Buffett, on kindness</div>'); const letterTx = letter.querySelector('.tx');
const LETTER = '“…it compounds, and at a better rate than anything Charlie and I ever bought.”';
const tagTrees = mk('tag am', 'kindness · <b>×2</b>');
const title = mk('title', '<div class="s">THE STORY OF</div><div class="n">The Slow\n<em>Billions</em></div>');
const lesson = mk('lesson', `Time did the\n<em>heavy lifting</em>.`);
const ctaChip = mk('chip am', 'what about you?');
const boxes = [0, 1].map(() => { const e = mk('cbox', '<span class="in"></span><span class="post">Post</span>'); return { e, inn: e.querySelector('.in'), post: e.querySelector('.post') }; });
const foot = document.getElementById('foot');
foot.textContent = "Gift: CBS News, Fortune, AP, CNBC (16 Nov 2026) · $160B+ by 2034: Fortune, Yahoo Finance\n$1,000 → about $55M: Berkshire stock 1964–2024, its 2024 letter · simplified · not advice";
const setTxt = (e, s) => { if (e.textContent !== s) e.textContent = s; };
const setHTML = (e, s) => { if (e._h !== s) { e._h = s; e.innerHTML = s; } };
const p3 = (p, o = 1) => { const q = proj(p[0], p[1], p[2]); return [q[0], q[1], q[2] ? o : 0]; };
const money = v => v >= 1e6 ? '$' + Math.round(v).toLocaleString('en-US') : '$' + Math.round(v).toLocaleString('en-US');

function updateUI(t) {
  updateCaption(t);
  foot.style.opacity = (0.95 * seg(t, 3.0, 3.6) * (1 - seg(t, T.cta, T.cta + 0.3) * 0.45)).toFixed(3);
  // 1 — the hook card (0-1.5 s, the cover), then the big number (1.5-3 s)
  if (hookBg) put(hookBg, W / 2, 640, 1 - seg(t, T.hookEnd - 0.05, T.hookEnd + 0.2));
  if (hookEl) { const out = seg(t, T.hookEnd, T.hookEnd + (TIM.big ? 0.22 : 0.3)); put(hookEl, W / 2, 640 - 40 * eo(out), 1 - out, 1 + 0.035 * seg(t, 0, T.hookEnd) + 0.06 * out); }
  if (bigEl) { const o = win(t, T.bigIn, T.bigOut - 0.05, 0.15, 0.25), u = eo(seg(t, T.bigIn + 0.05, T.bigIn + 0.7)), land = seg(t, T.bigIn + 0.7, T.bigIn + 1.0), sh = (1 - land) * (land > 0 ? 1 : 0);
    bigBg.style.opacity = (0.92 * o).toFixed(3); setHTML(BIGN.v, bigText(u)); BIGN.line.style.strokeDashoffset = (BIGN.len * (1 - eo(seg(t, T.bigIn, T.bigIn + 0.9)))).toFixed(1);
    put(bigEl, W / 2 + Math.sin(t * 90) * 7 * sh, 860 + Math.cos(t * 77) * 5 * sh, o, pop(t, T.bigIn, 0.4) * (1 + 0.05 * Math.sin(Math.PI * land))); }
  // chips (one line at the top that says where we are)
  let ct = '', co = 0, cp = 0;
  const CH = [[T.bigOut + 0.05, T.b2 - 0.1, 'Omaha · Thanksgiving 2026'], [T.b2 + 0.05, T.b3 - 0.1, "Buffett's plan"], [T.b3 + 0.05, T.b4 - 0.1, 'his house in Omaha'],
    [T.b4 + 0.05, T.b5 - 0.1, '1942 → 2026'], [T.kept, T.b6 - 0.1, 'Berkshire Hathaway'], [T.b6 + 0.05, T.b7 - 0.1, '1965 → 2024'], [T.b7 + 0.05, T.b8 - 0.1, 'compounding'],
    [T.b8 + 0.05, T.wipe + 0.1, 'on average'], [T.wipe + 0.8, T.b11 - 0.1, 'this Thanksgiving · 16 Nov 2026'], [T.b11 + 0.05, T.b12 - 0.1, 'as of 26 Nov 2026']];
  for (const [a, b, s] of CH) { const o = win(t, a, b, 0.22, 0.22); if (o > co) { co = o; ct = s; cp = pop(t, a); } }
  if (ct) setTxt(chip, ct); put(chip, W / 2, 472, co, cp);
  // 1-2 — the gift, the rest, the foundations, the plan
  { const q = streamPt(0, 0.8), p = p3(q, win(t, T.small, T.b2 + 0.4, 0.25, 0.3)); put(tagGift, clampX(p[0], 220), clampY(p[1] + 40, 760, 1400), p[2], pop(t, T.small)); }
  { const p = p3([GTOP[0], GTOP[1] + 4, GTOP[2]], win(t, T.part, T.y2034 - 0.2, 0.25, 0.3)); put(tagRest, clampX(p[0], 230), clampY(p[1], 640, 1300), p[2], pop(t, T.part)); }
  { const p = p3([0, 12, -30], win(t, T.follow, T.b3 + 0.2, 0.25, 0.3)); put(tagFnd, clampX(p[0], 230), clampY(p[1], 640, 1180), p[2], pop(t, T.follow)); }
  put(plan, W / 2, 1390, win(t, T.y2034 - 0.1, T.b3 + 0.35, 0.25, 0.3), pop(t, T.y2034 - 0.1));
  // 4 — Warren Buffett; the boy with his first share; 1942 -> 2026
  { const p = p3([MAN[0], MAN[1] + 3.0, MAN[2]], win(t, T.warren, T.b5 - 0.05, 0.3, 0.3)); put(nameEl, clampX(p[0], 340), clampY(p[1] - 30, 600, 1000), p[2], pop(t, T.warren)); }
  { const p = p3([BOY[0], 2.4, BOY[2]], win(t, T.stock, T.n96 - 0.05, 0.25, 0.25)); put(tagBoy, clampX(p[0], 220), clampY(p[1], 900, 1300), p[2], pop(t, T.stock)); }
  { const o = win(t, T.n11 - 0.15, T.b5 + 0.1, 0.25, 0.3), u = eio(seg(t, T.n11, T.n96 + 0.15)); routeFill.style.width = (680 * u).toFixed(1) + 'px'; routeDot.style.left = (40 + 680 * u).toFixed(1) + 'px'; put(route, W / 2, 1360, o, pop(t, T.n11 - 0.15)); }
  // 5 — his company keeps its profits
  { const p = p3([CO[0], COMPTOP() + 2.6, CO[1]], win(t, T.kept - 0.1, T.b6 + 0.1, 0.25, 0.3)); put(tagCo, clampX(p[0], 220), clampY(p[1], 620, 1300), p[2], pop(t, T.kept - 0.1)); }
  put(loopC, W / 2, 1380, win(t, T.kept + 0.05, T.b6 + 0.05, 0.25, 0.3), pop(t, T.kept + 0.05));
  // 6 — $1,000 -> about $55 million
  { const p = p3([TX(0), 2.2, ROWZ], win(t, T.thousand, T.grew - 0.3, 0.25, 0.25)); put(tagOne, clampX(p[0], 220), clampY(p[1], 620, 1400), p[2], pop(t, T.thousand)); }
  { const k = towerK(NT - 1, t), p = p3([GTOP[0], HMAX * k + 4, GTOP[2]], win(t, T.n55, T.b7 + 0.1, 0.25, 0.3)); put(tag2024, clampX(p[0], 250), clampY(p[1], 620, 1300), p[2], pop(t, T.n55)); }
  { const o = win(t, T.grew - 0.1, T.b7 + 0.1, 0.25, 0.3), u = c01((t - T.riseA) / (T.million + 0.1 - T.riseA)), v = 1000 * Math.pow(55023.84, eio(u));
    setTxt(worthV, u >= 1 ? 'about $55M' : money(v)); worthFill.style.width = (560 * Math.pow(c01(u), 3)).toFixed(1) + 'px'; put(worth, W / 2, 1360, o, pop(t, T.grew - 0.1)); }
  // 7-8 — ×2 at every step; 1965 and 2024; the last doubling
  tagX2.forEach((e, k) => { const i = k + 1, t0 = T.doubled + 0.05 + k * 0.075, o = win(t, t0, T.b9 - 0.3, 0.15, 0.3) * (i >= 6 ? 1 : 0.0), h = TH(i) * towerK(i, t);
    const p = p3([TX(i) - 5, Math.max(h, TH(i - 1)) + 2.2 + i * 0.05, ROWZ], o); put(e, p[0], clampY(p[1], 620, 1420), p[2] * (p[0] > 60 && p[0] < W - 60 ? 1 : 0), pop(t, t0) * 0.85); });
  { const p = p3([TX(0), 1.2, ROWZ + 5], win(t, T.doubled, T.biggest + 0.2, 0.25, 0.3)); put(tagYr0, clampX(p[0], 120), clampY(p[1], 620, 1440), p[2], pop(t, T.doubled)); }
  { const p = p3([TX(NT - 1), 1.2, ROWZ + 5], win(t, T.doubled, T.wipe, 0.25, 0.3)); put(tagYr1, clampX(p[0], 120), clampY(p[1], 620, 1440), p[2], pop(t, T.doubled)); }
  { const p = p3([GTOP[0] - 3, HMAX * 0.72, GTOP[2]], win(t, T.biggest, T.wipe + 0.1, 0.25, 0.25)); put(tagLast, clampX(p[0], 290), clampY(p[1], 640, 1300), p[2], pop(t, T.biggest)); }
  // 10 — the letter; the trees
  { const o = win(t, T.letter - 0.05, T.b11 + 0.15, 0.3, 0.3), n = Math.min(LETTER.length, Math.floor(c01((t - T.letter - 0.15) / (T.bought - T.letter - 0.2)) * (LETTER.length + 0.001)));
    const s = LETTER.slice(0, n).replace('compounds', '<em>compounds</em>').replace('better rate', '<em>better rate</em>'), caret = n < LETTER.length || Math.floor(t * 2.4) % 2 ? '<i></i>' : '';
    setHTML(letterTx, s + caret); put(letter, W / 2, 1255, o, pop(t, T.letter - 0.05)); }
  { const p = p3([-20, 9, -46], win(t, T.compounds + 0.3, T.b11 + 0.2, 0.25, 0.3)); put(tagTrees, clampX(p[0], 220), clampY(p[1], 640, 980), p[2], pop(t, T.compounds + 0.3)); }
  // 12 — title and lesson; 13 — the question
  put(title, W / 2, 640, win(t, T.story, T.cta - 0.1, 0.4, 0.3), 0.94 + 0.06 * eo(seg(t, T.story, T.story + 0.6)));
  put(lesson, W / 2, 1180, win(t, T.time12, T.cta - 0.15, 0.3, 0.25), pop(t, T.time12));
  put(ctaChip, W / 2, 472, seg(t, T.would, T.would + 0.3), pop(t, T.would));
  [[T.giveW, 'GIVE', T.postA], [T.keepW, 'KEEP', T.postB]].forEach(([t0, word, tp], i) => {
    const bx = boxes[i], L = word.length, n = Math.min(L, Math.floor(c01((t - t0) / (0.1 * L)) * (L + 0.001))), typed = word.slice(0, n), caret = (n < L || Math.floor(t * 2.4) % 2) && t < tp ? '<i></i>' : '';
    setHTML(bx.inn, typed ? `<b>${typed}</b>${caret}` : `<em>Add a comment…</em>${caret}`); const sent = t > tp; const pc = sent ? 'post on sent' : n === L ? 'post on' : 'post'; if (bx.post.className !== pc) bx.post.className = pc; setTxt(bx.post, sent ? 'Posted ✓' : 'Post');
    const ts = i ? T.keepW - 0.35 : T.comment; put(bx.e, W / 2, 1300 + i * 132, seg(t, ts, ts + 0.3), pop(t, ts) * (1 + 0.06 * win(t, tp, tp + 0.3, 0.08, 0.2)));
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
  winM.opacity = c01(night * 1.1); homeWinM.opacity = c01(0.25 + night); lampM.emissiveIntensity = night * 1.4; COINM.emissiveIntensity = 0.7 + 0.5 * night; towerM.emissiveIntensity = 0.45 + 0.35 * night;
  // the towers: standing (now), sinking in the rewind, rising again 1965 -> 2024
  TOW.forEach((q, i) => { const k = towerK(i, t); q.m.position.y = -q.h * (1 - k) - (k < 0.002 ? 1 : 0); q.m.visible = k > 0.002; });
  { const on = t > T.ghostA && t < T.b8 + 0.6, u = eio(seg(t, T.ghostA, T.ghostB)), h = TH(12); ghost.visible = on; ghost.position.set(TX(12), h + lerp(16, 0, u) + hopY([T.ghostB], t, 0.3), ROWZ); ghostM.opacity = 0.9 * (1 - seg(t, T.b8 + 0.2, T.b8 + 0.6)); }
  // his company grows as it keeps its profits
  company.scale.y = 1 + 0.55 * eio(seg(t, T.used, T.year5 + 0.6));
  // the boy of 1942 with his first share; the man on the porch
  { const k = win(t, T.boy, T.n96 + 0.1, 0.3, 0.35); boy.visible = k > 0.01; boy.scale.setScalar(0.72 * Math.max(0.001, back(c01(k)))); boy.position.y = hopY([T.stock + 0.05], t, 0.25);
    cert.visible = certGlow.visible = boy.visible; const hy = 1.25 + 0.6 * eo(seg(t, T.stock, T.stock + 0.4)); cert.position.set(BOY[0] + 0.5, hy, BOY[2] + 0.35); cert.rotation.set(-1.2, 0.2, 0.1 * Math.sin(t * 2)); certM.emissiveIntensity = 0.6 * win(t, T.stock, T.n96, 0.3, 0.3);
    certGlow.position.set(BOY[0] + 0.5, hy, BOY[2] + 0.45); certGlow.scale.setScalar(1.5 * k); certGlow.material.opacity = 0.7 * win(t, T.stock, T.n96, 0.3, 0.3); }
  man.position.y = MAN[1] + hopY([T.n96 + 0.05, T.postA + 0.1], t, 0.18);
  { const o = win(t, T.how - 0.05, T.b4 + 0.2, 0.25, 0.3); qMesh.visible = o > 0.01; qMesh.position.set(HOME[0] + 2.8, 9.6 + 0.25 * Math.sin(t * 3), HOME[1] + 7.5); qMesh.quaternion.copy(camera.quaternion); qMesh.scale.setScalar(Math.max(0.001, o * back(seg(t, T.how - 0.05, T.how + 0.3))) * 2.4); }
  fGlowM.opacity = 0.35 * Math.max(win(t, T.follow, T.b3 + 0.3, 0.3, 0.4), win(t, T.giving, T.b11 + 0.4, 0.4, 0.5)) * (0.75 + 0.25 * Math.sin(t * 4));
  // coins: the gift streams to the foundations; the company's loop (profits flying up and back in)
  { let n = 0; const sk = streamK(t), lk = loopK(t);
    for (let i = 0; i < NC; i++) { const c = CR[i]; let p = null, sc = 1;
      if (i < 200) { if (sk > 0.01 && c.ph < sk * 0.8 + 0.02) { const u = (t * c.sp + c.ph) % 1; p = streamPt(c.f, u, c.jx * Math.sin(u * Math.PI), c.jz * Math.sin(u * Math.PI)); sc = 1 + 0.7 * c01((camera.position.distanceTo(_p.set(p[0], p[1], p[2])) - 60) / 180); } }
      else if (lk > 0.01 && i - 200 < LOOPN) { const j = i - 200, u = ((t * 0.9 + j / LOOPN) % 1), a = c.rp + j, top = COMPTOP(); p = [CO[0] + Math.cos(a) * c.rs * Math.sin(u * Math.PI), top + Math.sin(u * Math.PI) * 9, CO[1] + Math.sin(a) * c.rs * Math.sin(u * Math.PI) * 0.6]; sc = lk; }
      if (!p) continue; _e.set(t * 3 + c.rp, c.rp, t * 2); _q.setFromEuler(_e); _p.set(p[0], p[1], p[2]); _s.setScalar(Math.max(0.001, sc)); coins.setMatrixAt(n++, _m4.compose(_p, _q, _s)); }
    coins.count = n; coins.instanceMatrix.needsUpdate = true; }
  // kindness compounds: the trees sprout in doubling waves and stay
  { const cnt = [0, 0, 0]; for (const q of TREES) { const k = back(seg(t, q.t, q.t + 0.4)); if (k <= 0.001) continue; _p.set(q.x, 0, q.z); _e.set(0, q.ry, 0); _q.setFromEuler(_e); _s.setScalar(q.s * k); treeMeshes[q.g].setMatrixAt(cnt[q.g]++, _m4.compose(_p, _q, _s)); }
    treeMeshes.forEach((m, k) => { m.count = cnt[k]; m.instanceMatrix.needsUpdate = true; }); }
  // falling leaves around wherever the camera looks
  { const a = leafG.attributes.position, span = Math.max(40, Math.min(240, camD * 1.3)), cx = camTg.x, cz = camTg.z, cy = camTg.y;
    for (let i = 0; i < NLF; i++) { const q = LF[i], fall = ((q[1] - t * 0.035 * q[3]) % 1 + 1) % 1; a.setXYZ(i, cx + (q[0] - 0.5) * span + Math.sin(t * 0.9 + q[4]) * 1.6, cy - span * 0.2 + fall * span * 0.55, cz + (q[2] - 0.5) * span + Math.cos(t * 0.7 + q[4]) * 1.2); }
    a.needsUpdate = true; leaves.material.size = 0.45 + camD * 0.005; leaves.material.opacity = 0.9 * (1 - 0.6 * seg(t, T.kept, T.kept + 0.5) * (1 - seg(t, T.wipe + 0.4, T.wipe + 0.8))); }
  for (const c of clouds) { c.position.x = c.userData.x0 + t * 1.2; c.material.opacity = 0.85 - 0.45 * night; const k = lerp(1.0, 0.5, night); c.material.color.setRGB(lerp(s.hor[0], 1, 0.75) * k, lerp(s.hor[1], 1, 0.75) * k, lerp(s.hor[2], 1, 0.75) * k * 1.04); c.material.emissive.setRGB(c.material.color.r * 0.55, c.material.color.g * 0.55, c.material.color.b * 0.55); }
  // sparkles: on the giant tower, on the first coin, on new trees, on the posted comments
  { let k = 0; const put3 = (x, y, z, sz, on, col) => { const sp = sparks[k++]; if (!sp) return; const tw = Math.pow(Math.abs(Math.sin(t * sp.userData.w + sp.userData.ph)), 3); sp.position.set(x, y, z); sp.scale.setScalar(sz * (0.25 + tw)); sp.material.opacity = on * (0.3 + 0.7 * tw); sp.material.color.setHex(col); sp.visible = on > 0.01; };
    const s1 = Math.max(win(t, -1, T.b3 + 0.3, 0.1, 0.4), win(t, T.last - 0.3, T.b11, 0.3, 0.4)) * towerK(NT - 1, t); for (let i = 0; i < 20; i++) { const sp = sparks[i].userData; put3(GTOP[0] + sp.dx * 3.2, 8 + Math.abs(sp.dz) * (HMAX - 8), GTOP[2] + 3.2 * Math.sign(sp.dz || 1), 3.2, s1, 0xFFE9A8); }
    const s2 = win(t, T.thousand - 0.1, T.grew + 0.3, 0.3, 0.3); for (let i = 0; i < 10; i++) { const sp = sparks[20 + i].userData; put3(TX(0) + sp.dx * 1.6, 0.9 + Math.abs(sp.dz) * 1.0, ROWZ + sp.dz * 1.6, 0.42, s2, 0xFFE9A8); }
    const s3 = win(t, T.treeA, T.b12, 0.3, 0.6); for (let i = 0; i < 30; i++) { const q = TREES[(i * 37) % TREES.length]; put3(q.x, 3 + (i % 3), q.z, 2.0, s3 * (t > q.t ? 1 : 0), 0xFFF2B0); }
    const s4 = win(t, T.postA, DUR + 1, 0.4, 0.1); for (let i = 0; i < 16; i++) { const ph = (t * 0.35 + i / 16) % 1, a = i * 2.4; put3(HOME[0] + Math.cos(a) * (4 + ph * 3), 2 + ph * 9, HOME[1] + 6 + Math.sin(a) * 1.5, 0.7 + 0.4 * (1 - ph), s4 * Math.sin(ph * Math.PI), 0xFFE9A8); }
    while (k < sparks.length) sparks[k++].visible = false; }
  dome.position.copy(camera.position); stars.position.copy(camera.position);
  orb.visible = halo.visible = s.orbS > 0.5 && s.star < 0.9;
  orb.position.set(camera.position.x + sd[0] * 1800, camera.position.y + sd[1] * 1800, camera.position.z + sd[2] * 1800); orb.scale.setScalar(s.orbS * 2); orb.lookAt(camera.position); orbM.color.setRGB(...s.orb);
  halo.position.copy(orb.position); halo.scale.setScalar(s.orbS * 13); halo.lookAt(camera.position); haloM.color.setRGB(...s.orb); haloM.opacity = 0.75;
  const S2 = Math.min(190, Math.max(14, camD * 0.85));
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
  rise: Array.from({ length: NT }, (_, i) => +riseAt(i).toFixed(3)),
  x2: Array.from({ length: NT - 1 }, (_, k) => +(T.doubled + 0.05 + k * 0.075).toFixed(3)).slice(5),
  trees: Array.from({ length: TREEW }, (_, w) => +(T.treeA + w * T.treeStep).toFixed(3)),
  letter: Array.from({ length: 24 }, (_, k) => +(T.letter + 0.15 + k * (T.bought - T.letter - 0.2) / 24).toFixed(3)),
  typingA: [0, 1, 2, 3].map(i => +(T.giveW + (i + 0.5) * 0.1).toFixed(3)), typingB: [0, 1, 2, 3].map(i => +(T.keepW + (i + 0.5) * 0.1).toFixed(3)),
  postA: +T.postA.toFixed(3), postB: +T.postB.toFixed(3),
};
document.fonts.ready.then(() => Promise.all(['700 64px Figtree', '900 190px Fraunces', '800 30px JBM', '700 22px Inter', '700 78px Fraunces', '800 54px Figtree', '600 34px Figtree', '500 18px Inter', '900 128px JBM', '800 46px Inter', '900 150px Figtree', '900 112px Fraunces', '800 172px JBM', '700 34px Figtree', '800 92px JBM', '900 64px Figtree', '800 70px JBM', '800 54px JBM', '800 28px JBM', '800 34px Inter', '900 96px JBM', '700 50px Fraunces', '900 40px JBM', '800 36px JBM', '900 50px JBM'].map(f => document.fonts.load(f)))).then(() => { fitHook(); renderAt(0); window.__ready = true; });
