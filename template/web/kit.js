// kit.js — low-poly storybook kit (three.js). Every model: origin at ground centre, facing +x.
// One vertex-coloured material for almost everything keeps the draw calls and shader switches low.
import * as THREE from 'three';

export const C = {
  sand: 0xE9C27A, sandHi: 0xF4D9A0, sandLo: 0xD3A45E, stone: 0xEAD9B2, stone2: 0xDDC79A, ochre: 0xD9A45F, clay: 0xC98556,
  white: 0xF6EFE2, roof: 0xC9AF83, wood: 0x8A5A34, dark: 0x3F2A1D, teal: 0x2FA39A, blue: 0x3F7FBF, crimson: 0xB8383B, indigo: 0x3B4A9A,
  green: 0x4C9A62, leaf: 0x3F8F57, trunk: 0x8B6B43, camel: 0xCFA66B, camel2: 0xB98D55, gold: 0xF7B500, water: 0x2E8FB3, bread: 0xC98A3C,
};
export const SKIN = [0x5C3D2B, 0x74503A, 0x8D5E3F, 0xB07A4E, 0xC99466];
export const ROBES = [0x3B4A9A, 0xB8383B, 0x2FA39A, 0xF6EFE2, 0xE09A2B, 0x7A4FA0, 0x2F6FB8, 0x4C9A62, 0xD9664A, 0xEADFC8];

export const MAT = new THREE.MeshLambertMaterial({ vertexColors: true });
export const GOLD = new THREE.MeshLambertMaterial({ color: 0xF7B500, emissive: 0xA86A00, emissiveIntensity: 0.55 });
export const SACK = new THREE.MeshLambertMaterial({ color: 0xE2B24A, emissive: 0x8A5600, emissiveIntensity: 0.45 });
export const SACK_EMPTY = new THREE.MeshLambertMaterial({ color: 0x9C8E78 });

export function rng(seed) { let a = seed >>> 0; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
export function M(x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0, sx = 1, sy = 1, sz = 1) {
  return new THREE.Matrix4().compose(new THREE.Vector3(x, y, z), new THREE.Quaternion().setFromEuler(new THREE.Euler(rx, ry, rz)), new THREE.Vector3(sx, sy, sz));
}
// geometry builder: merges primitives into one flat-shaded, vertex-coloured mesh
export class GB {
  constructor() { this.p = []; this.c = []; }
  add(geo, color, m) {
    const g = geo.index ? geo.toNonIndexed() : geo; if (m) g.applyMatrix4(m);
    const a = g.attributes.position.array, col = new THREE.Color(color);
    for (let i = 0; i < a.length; i += 3) { this.p.push(a[i], a[i + 1], a[i + 2]); this.c.push(col.r, col.g, col.b); }
    return this;
  }
  box(w, h, d, color, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0) { return this.add(new THREE.BoxGeometry(w, h, d), color, M(x, y, z, rx, ry, rz)); }
  cyl(rt, rb, h, n, color, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0) { return this.add(new THREE.CylinderGeometry(rt, rb, h, n), color, M(x, y, z, rx, ry, rz)); }
  cone(r, h, n, color, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0) { return this.add(new THREE.ConeGeometry(r, h, n), color, M(x, y, z, rx, ry, rz)); }
  ball(r, det, color, x = 0, y = 0, z = 0, sx = 1, sy = 1, sz = 1) { return this.add(new THREE.IcosahedronGeometry(r, det), color, M(x, y, z, 0, 0, 0, sx, sy, sz)); }
  dome(r, color, x = 0, y = 0, z = 0) { return this.add(new THREE.SphereGeometry(r, 8, 4, 0, Math.PI * 2, 0, Math.PI / 2), color, M(x, y, z)); }
  geo() {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(this.p, 3)); g.setAttribute('color', new THREE.Float32BufferAttribute(this.c, 3));
    g.computeVertexNormals(); return g;
  }
  mesh(mat = MAT) { const m = new THREE.Mesh(this.geo(), mat); m.castShadow = true; m.receiveShadow = true; return m; }
}

// ───────── people
export function person(o = {}) {
  // options: robe, skin, hat, sash, crown, bigHat, scroll; 18th-century London: wig, tricorn, dress, bonnet, collar, paper, noHat
  // Silicon Valley (episode 4): toque (chef's hat), apron, shirt (colour of the shirt opening), tie, mic, cam, badge, short (short hair colour) for modern people
  // Yap, 1903 (episode 3): bare (skin-coloured chest, robe = skirt), hair, helmet (pith helmet colour), flower (hair flower colour)
  const b = new GB(), robe = o.robe ?? 0x3B4A9A, skin = o.skin ?? 0x8D5E3F, hat = o.hat ?? 0xF6EFE2;
  if (o.bare) { b.cyl(0.21, 0.3, 0.6, 7, skin, 0, 0.87, 0); b.cyl(0.3, 0.47, 0.62, 7, robe, 0, 0.31, 0); }
  else if (o.dress) b.cyl(0.2, 0.62, 1.15, 8, robe, 0, 0.575, 0); else b.cyl(0.2, 0.46, 1.15, 7, robe, 0, 0.575, 0);
  if (o.hair) { b.ball(0.3, 1, o.hair, -0.04, 1.52, 0, 1, 0.78, 1.04); if (o.flower) b.ball(0.08, 0, o.flower, 0.02, 1.62, 0.25); }
  if (o.short) b.ball(0.29, 1, o.short, -0.08, 1.56, 0, 0.92, 0.6, 1.02);   // short modern hair: leaves the face clear
  if (o.helmet) { b.ball(0.31, 1, o.helmet, 0, 1.62, 0, 1.05, 0.72, 1.05); b.cyl(0.47, 0.47, 0.04, 10, o.helmet, 0, 1.6, 0); b.cyl(0.29, 0.29, 0.05, 8, 0x8A6A3A, 0, 1.64, 0); }
  if (o.sash) b.cyl(0.3, 0.33, 0.14, 7, o.sash, 0, 0.78, 0);
  if (o.collar) b.cyl(0.22, 0.25, 0.1, 7, o.collar, 0, 1.12, 0);
  b.ball(0.28, 1, skin, 0, 1.43, 0);
  if (o.wig) { b.ball(0.32, 1, o.wig, -0.03, 1.56, 0, 1, 0.72, 1.06); b.ball(0.16, 1, o.wig, -0.06, 1.28, 0.27, 1, 1.55, 0.9); b.ball(0.16, 1, o.wig, -0.06, 1.28, -0.27, 1, 1.55, 0.9); b.ball(0.2, 1, o.wig, -0.22, 1.3, 0, 1, 1.45, 1.2); }
  if (o.crown) { b.cyl(0.25, 0.23, 0.2, 6, C.gold, 0, 1.74, 0); for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2; b.cone(0.06, 0.16, 4, C.gold, Math.cos(a) * 0.22, 1.9, Math.sin(a) * 0.22); } }
  else if (o.tricorn) { b.cone(0.5, 0.2, 3, o.tricorn, 0, 1.8 + (o.wig ? 0.04 : 0), 0, 0, Math.PI / 2, 0); b.cyl(0.21, 0.25, 0.2, 7, o.tricorn, 0, 1.86 + (o.wig ? 0.04 : 0), 0); }
  else if (o.bonnet) { b.ball(0.33, 1, o.bonnet, -0.04, 1.56, 0, 1.05, 0.72, 1.05); b.cyl(0.42, 0.42, 0.04, 9, o.bonnet, 0.02, 1.62, 0); }
  else if (o.bigHat) { b.ball(0.34, 1, hat, 0, 1.66, 0, 1, 0.62, 1); }
  else if (o.toque) { b.cyl(0.25, 0.23, 0.42, 8, 0xFFFFFF, 0, 1.8, 0); b.ball(0.33, 1, 0xFFFFFF, 0, 2.08, 0, 1, 0.7, 1); }
  else if (!o.wig && !o.noHat && !o.hair && !o.short && !o.helmet) b.cyl(0.29, 0.31, 0.18, 7, hat, 0, 1.64, 0);
  // Silicon Valley, 2026 (episode 4): shirt opening, tie, apron, a reporter's microphone, a shoulder camera, a lanyard badge
  if (o.shirt) b.box(0.07, 0.34, 0.2, o.shirt, 0.2, 1.0, 0, 0, 0, 0.12);
  if (o.tie) b.box(0.05, 0.32, 0.07, o.tie, 0.235, 0.96, 0, 0, 0, 0.12);
  if (o.apron) b.box(0.07, 0.86, 0.46, 0xFBF8F2, 0.36, 0.55, 0, 0, 0, 0.2);
  if (o.mic) { b.cyl(0.025, 0.025, 0.26, 5, 0x2A2A2A, 0.42, 1.2, 0.12, 0, 0, -0.3); b.ball(0.07, 0, 0x3A3A3A, 0.46, 1.33, 0.12); }
  if (o.cam) { b.box(0.62, 0.34, 0.3, 0x2E3238, 0.1, 1.5, 0.3); b.cyl(0.1, 0.12, 0.16, 8, 0x1A1C20, 0.46, 1.5, 0.3, 0, 0, Math.PI / 2); }
  if (o.badge) b.box(0.04, 0.16, 0.11, 0xF2F2F2, 0.24, 0.82, -0.08);
  if (o.scroll) { b.cyl(0.07, 0.07, 0.6, 6, 0xFBF3DF, 0.36, 0.95, 0, Math.PI / 2, 0, 0); b.cone(0.03, 0.42, 4, 0xFFFFFF, 0.42, 1.25, 0.18, 0, 0, -0.5); }
  if (o.paper) b.box(0.05, 0.4, 0.3, 0xFBF6E8, 0.36, 1.62, 0.18, 0, 0, -0.25);
  if (o.phone) { b.box(0.05, 0.3, 0.16, 0x22262E, 0.34, 1.42, 0.2, 0, 0, -0.2); b.box(0.06, 0.24, 0.12, 0x7FD3FF, 0.37, 1.43, 0.2, 0, 0, -0.2); b.box(0.24, 0.1, 0.1, o.robe ?? 0x3B4A9A, 0.22, 1.25, 0.2, 0, 0, 0.9); }   // episode 7: a trader looking at a phone (plain glowing screen)
  const m = b.mesh(); m.scale.setScalar(o.s ?? 1); return m;
}

// ───────── camel (legs and sacks are separate so they can move)
const LEG = new THREE.BoxGeometry(0.2, 1.4, 0.2).translate(0, -0.7, 0);
const SACKG = new THREE.IcosahedronGeometry(0.44, 1);
export function camel(o = {}) {
  const g = new THREE.Group(), col = o.color ?? C.camel, b = new GB();
  b.box(2.0, 0.86, 0.82, col, 0, 1.78, 0); b.cone(0.52, 0.75, 6, col, -0.12, 2.5, 0);
  b.box(0.34, 1.25, 0.34, col, 1.08, 2.36, 0, 0, 0, -0.5); b.box(0.66, 0.36, 0.38, col, 1.6, 2.96, 0); b.box(0.2, 0.2, 0.3, 0x3A2A1E, 1.9, 2.9, 0);
  b.box(0.1, 0.62, 0.1, col, -1.05, 1.6, 0, 0, 0, 0.25);
  b.box(1.05, 0.1, 0.96, o.cloth ?? C.crimson, -0.12, 2.24, 0); b.box(1.05, 0.5, 0.06, o.cloth ?? C.crimson, -0.12, 2.0, 0.44); b.box(1.05, 0.5, 0.06, o.cloth ?? C.crimson, -0.12, 2.0, -0.44);
  if (o.trim) { b.box(1.09, 0.08, 0.07, C.gold, -0.12, 1.78, 0.45); b.box(1.09, 0.08, 0.07, C.gold, -0.12, 1.78, -0.45); }
  const body = b.mesh(); g.add(body);
  const lm = new THREE.MeshLambertMaterial({ color: col });
  g.userData.legs = [[0.74, 0.27, 0], [0.74, -0.27, Math.PI], [-0.74, 0.27, Math.PI], [-0.74, -0.27, 0]].map(([x, z, ph]) => {
    const l = new THREE.Mesh(LEG, lm); l.position.set(x, 1.4, z); l.castShadow = true; l.userData.ph = ph; g.add(l); return l;
  });
  g.userData.sacks = [0.66, -0.66].map(z => { const s = new THREE.Mesh(SACKG, SACK); s.position.set(-0.12, 1.86, z); s.scale.set(1, 0.9, 0.82); s.castShadow = true; g.add(s); return s; });
  if (o.noSacks) g.userData.sacks.forEach(s => s.visible = false);
  g.userData.body = body;
  return g;
}

// ───────── town
export function building(w, h, d, o = {}) {
  // front (door side) faces +z when o.front = 1, -z when -1
  const b = new GB(), f = o.front ?? 1, col = o.color ?? C.stone, r = o.rand ?? Math.random;
  b.box(w, h, d, col, 0, h / 2, 0); b.box(w + 0.3, 0.34, d + 0.3, o.roof ?? C.roof, 0, h + 0.17, 0);
  for (let i = -1; i <= 1; i += 2) for (let j = -1; j <= 1; j += 2) b.box(0.5, 0.5, 0.5, o.roof ?? C.roof, i * (w / 2 - 0.1), h + 0.55, j * (d / 2 - 0.1));
  b.box(1.0, 1.8, 0.14, C.dark, (r() - 0.5) * (w - 2), 0.9, f * (d / 2 + 0.02));
  const rows = Math.max(1, Math.floor((h - 2.4) / 1.9)), cols = Math.max(1, Math.floor(w / 1.9));
  const win = [];
  for (let ry = 0; ry < rows; ry++) for (let cx = 0; cx < cols; cx++) {
    if (r() < 0.25) continue;
    const x = (cx - (cols - 1) / 2) * (w / cols), y = 2.9 + ry * 1.9;
    b.box(0.55, 0.8, 0.1, 0x5A4030, x, y, f * (d / 2 + 0.02)); win.push([x, y, f * (d / 2 + 0.09)]);
  }
  if (o.dome) { b.cyl(o.dome * 1.02, o.dome * 1.02, 0.5, 8, col, 0, h + 0.5, 0); b.dome(o.dome, o.domeColor ?? C.teal, 0, h + 0.7, 0); b.cone(0.12, 0.7, 4, C.gold, 0, h + 0.7 + o.dome + 0.25, 0); }
  if (o.awning) b.box(1.8, 0.1, 1.1, o.awning, 0, 2.25, f * (d / 2 + 0.5), f * 0.3, 0, 0);
  const m = b.mesh(); m.userData.win = win; return m;
}
export function minaret(h) {
  const b = new GB();
  b.cyl(0.85, 1.0, h * 0.62, 8, C.stone, 0, h * 0.31, 0); b.cyl(1.25, 1.1, 0.3, 8, C.stone2, 0, h * 0.62 + 0.15, 0);
  b.cyl(0.6, 0.7, h * 0.26, 8, C.white, 0, h * 0.62 + 0.3 + h * 0.13, 0); b.cyl(0.9, 0.8, 0.25, 8, C.stone2, 0, h * 0.88 + 0.42, 0);
  b.cone(0.62, h * 0.14, 8, C.teal, 0, h * 0.88 + 0.55 + h * 0.07, 0); b.ball(0.16, 0, C.gold, 0, h * 1.02 + 0.7, 0);
  return b.mesh();
}
export function stall(c1, c2, goods) {
  // counter faces +z (toward the street when placed on the north side)
  const b = new GB();
  b.box(2.6, 0.95, 1.0, C.wood, 0, 0.475, 0); b.box(2.8, 0.1, 1.2, 0xA9733F, 0, 1.0, 0);
  for (const x of [-1.25, 1.25]) for (const z of [-0.5, 0.55]) b.box(0.1, 2.5, 0.1, C.wood, x, 1.25, z);
  for (let i = 0; i < 6; i++) b.box(0.5, 0.08, 1.9, i % 2 ? c1 : c2, -1.25 + 0.25 + i * 0.5, 2.62, 0.25, 0.28, 0, 0);
  if (goods.length) for (let i = 0; i < 6; i++) b.ball(0.16, 0, goods[i % goods.length], -1.0 + i * 0.4, 1.2, -0.15 + (i % 2) * 0.22);
  return b.mesh();
}
export function palace() {
  const b = new GB();
  b.box(20, 9, 22, C.white, 12, 4.5, 0); b.box(20.5, 0.5, 22.5, C.stone2, 12, 9.25, 0);
  b.cyl(5.4, 5.4, 1.2, 10, C.white, 12, 9.9, 0); b.add(new THREE.SphereGeometry(5.2, 10, 5, 0, Math.PI * 2, 0, Math.PI / 2), C.teal, M(12, 10.5, 0)); b.cone(0.3, 1.6, 5, C.gold, 12, 16.4, 0);
  for (const z of [-9.2, 9.2]) { b.box(4.4, 13, 4.4, C.stone, 3.4, 6.5, z); b.dome(2.2, C.teal, 3.4, 13, z); b.cone(0.16, 0.9, 4, C.gold, 3.4, 15.6, z); }
  for (let i = 0; i < 4; i++) b.box(1.3, 0.42, 13 - i * 0.6, C.stone2, -1.0 + i * 1.15, 0.21 + i * 0.42, 0);      // steps (x = -1 … 2.5)
  for (let i = 0; i < 6; i++) b.cyl(0.36, 0.42, 5.2, 7, C.stone, 2.0, 1.7 + 2.6, -5.5 + i * 2.2);
  b.box(1.2, 0.7, 13.4, C.stone2, 2.0, 7.25, 0); b.box(0.2, 4.6, 3.4, C.dark, 1.95, 4.0, 0);
  for (const z of [-3.4, 3.4]) b.box(0.08, 3.2, 1.3, C.crimson, 1.55, 5.2, z);
  return b.mesh();
}
export function pyramid(R, h) { const b = new GB(); b.cone(R, h, 4, C.sandLo, 0, h / 2 - 0.8, 0, 0, Math.PI / 4, 0); b.cone(R * 0.17, h * 0.17, 4, C.sandHi, 0, h * 0.915 - 0.8 + 0.02, 0, 0, Math.PI / 4, 0); return b.mesh(); }
export function tent(col) { const b = new GB(); b.cone(2.0, 2.5, 6, C.white, 0, 1.25, 0); b.cyl(2.03, 2.03, 0.35, 6, col, 0, 0.18, 0); b.cone(0.5, 0.5, 6, col, 0, 2.6, 0); b.box(0.06, 1.3, 0.8, C.dark, 1.5, 0.6, 0, 0, 0, 0.42); return b.mesh(); }
export function palm(h, r) {
  const b = new GB(); let x = 0;
  for (let i = 0; i < 4; i++) { b.cyl(0.2 - i * 0.02, 0.24 - i * 0.02, h / 4 + 0.05, 6, C.trunk, x, h / 8 + i * h / 4, 0, 0, 0, -0.07 * i); x += 0.12 * i; }
  for (let i = 0; i < 7; i++) { const a = i / 7 * Math.PI * 2 + r() * 0.5; b.box(2.2, 0.07, 0.55, i % 2 ? C.leaf : 0x57A866, x + Math.cos(a) * 0.95, h - 0.25, Math.sin(a) * 0.95, 0, -a, -0.45); }
  b.ball(0.3, 0, 0x6F4B2A, x, h - 0.1, 0);
  return b.mesh();
}
export function boat() {
  const b = new GB();
  b.box(3.4, 0.5, 1.0, C.wood, 0, 0.1, 0); b.box(0.9, 0.5, 0.7, C.wood, 1.9, 0.2, 0, 0, 0, 0.35); b.box(0.9, 0.5, 0.7, C.wood, -1.9, 0.2, 0, 0, 0, -0.35);
  b.cyl(0.06, 0.06, 3.6, 5, C.dark, 0.2, 2.0, 0); b.add(new THREE.ConeGeometry(1.5, 3.2, 3), C.white, M(-0.35, 2.3, 0, 0, 0.5, 0, 1, 1, 0.07));
  return b.mesh();
}
export function cloud(r) {
  const b = new GB(), n = 5 + Math.floor(r() * 4);
  for (let i = 0; i < n; i++) b.ball(2.2 + r() * 2.6, 1, 0xFFFFFF, (i - n / 2) * 2.6 + r() * 1.5, r() * 1.2, (r() - 0.5) * 3, 1, 0.6, 1);
  const m = new THREE.Mesh(b.geo(), new THREE.MeshLambertMaterial({ vertexColors: true, transparent: true, opacity: 0.9 })); return m;
}
export const COIN = new THREE.CylinderGeometry(0.17, 0.17, 0.05, 8);
export const LOAF = new THREE.IcosahedronGeometry(0.2, 1);
export { SACKG };

// ───────── London, 1720 (episode 2)
// triangular prism (a pitched roof): ridge along x, length L, half-width hw, height hh, base at y = 0
export function prismGeo(L, hw, hh) {
  const x0 = -L / 2, x1 = L / 2, A = [x0, 0, -hw], B = [x0, 0, hw], Cc = [x0, hh, 0], D = [x1, 0, -hw], E = [x1, 0, hw], F = [x1, hh, 0], p = [];
  const q = (a, b, c, d) => p.push(...a, ...b, ...c, ...a, ...c, ...d);
  p.push(...A, ...B, ...Cc, ...E, ...D, ...F); q(B, E, F, Cc); q(D, A, Cc, F);
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(p, 3)); return g;
}
// Georgian town house: ridge along x; door and windows on the +z side (o.front = 1) or the -z side (-1)
export function house(w, h, d, o = {}) {
  const b = new GB(), f = o.front ?? 1, r = o.rand ?? Math.random, col = o.color ?? 0xB8644A, trim = o.trim ?? 0xF3E9D6, rh = o.pitch ?? Math.min(2.8, d * 0.42);
  b.box(w, h, d, col, 0, h / 2, 0); b.box(w + 0.12, 0.26, d + 0.12, trim, 0, h - 0.13, 0);
  b.add(prismGeo(w + 0.4, d / 2 + 0.35, rh), o.roof ?? 0x5A5E6C, M(0, h, 0));
  for (const sx of [-1, 1]) if (r() < 0.8) b.box(0.7, 1.7, 0.9, o.chim ?? 0x8C4A36, sx * (w / 2 - 0.55), h + rh * 0.5, (r() - 0.5) * 0.8);
  const dx = (r() - 0.5) * Math.max(0, w - 2.6), fz = f * (d / 2);
  b.box(1.0, 1.9, 0.14, o.door ?? [0x2E3A4F, 0x2F5A3A, 0x6B2A2A, 0x23262E][Math.floor(r() * 4)], dx, 0.95, fz + f * 0.03); b.box(1.3, 0.14, 0.26, trim, dx, 1.98, fz + f * 0.06); b.box(1.5, 0.18, 0.8, 0x9A938A, dx, 0.09, fz + f * 0.4);
  const rows = Math.max(1, Math.floor((h - 2.0) / 1.75)), cols = Math.max(1, Math.floor(w / 1.6)), win = [];
  for (let ry = 0; ry < rows; ry++) for (let cx = 0; cx < cols; cx++) {
    const x = (cx - (cols - 1) / 2) * (w / cols), y = 2.75 + ry * 1.75;
    if (ry === 0 && Math.abs(x - dx) < 1.05) continue;
    b.box(0.74, 1.04, 0.08, trim, x, y, fz + f * 0.02); b.box(0.56, 0.86, 0.1, 0x2B3140, x, y, fz + f * 0.03); win.push([x, y, fz + f * 0.1]);
  }
  if (o.sign) { b.box(0.1, 0.1, 1.3, C.dark, dx + 1.5, 3.0, fz + f * 0.65); b.box(0.12, 0.9, 1.05, o.sign, dx + 1.5, 2.45, fz + f * 0.85); b.box(0.13, 0.5, 0.6, 0xF2D27A, dx + 1.5, 2.45, fz + f * 0.85); }
  if (o.shop) { b.box(w * 0.7, 1.5, 0.16, 0xF3E9D6, 0, 1.25, fz + f * 0.05); b.box(w * 0.66, 1.3, 0.18, 0x3A4458, 0, 1.25, fz + f * 0.06); }
  const m = b.mesh(); m.userData = { win, rh, w, h, d }; return m;
}
// tall ship, bow toward +x
export function ship(o = {}) {
  const b = new GB(), hull = o.hull ?? 0x5E3A22, sail = o.sail ?? 0xF2EBD8, dk = 0x3A2616;
  b.box(8.4, 1.5, 2.7, hull, 0, 0.75, 0); b.box(1.8, 1.3, 2.0, hull, 4.9, 0.85, 0); b.box(1.0, 1.1, 1.2, hull, 6.1, 1.0, 0);
  b.box(8.6, 0.22, 2.9, 0xC9A14A, 0, 1.55, 0); b.box(2.6, 1.4, 2.7, hull, -3.6, 2.2, 0); b.box(2.7, 0.2, 2.9, 0xC9A14A, -3.6, 2.95, 0);
  b.cyl(0.07, 0.09, 4.2, 5, dk, 7.2, 2.3, 0, 0, 0, -1.15);
  for (const [x, h] of [[-1.9, 10.5], [1.0, 12.0], [3.6, 9.0]]) {
    b.cyl(0.13, 0.17, h, 6, dk, x, 1.4 + h / 2, 0);
    b.box(0.1, h * 0.25, 3.4, sail, x + 0.14, 1.4 + h * 0.37, 0); b.box(0.1, h * 0.2, 2.6, sail, x + 0.14, 1.4 + h * 0.65, 0);
    b.box(0.1, 0.1, 3.8, dk, x, 1.4 + h * 0.51, 0); b.box(0.1, 0.1, 3.0, dk, x, 1.4 + h * 0.77, 0);
    b.box(0.04, 0.34, 0.9, o.flag ?? C.crimson, x, 1.4 + h + 0.2, 0.45);
  }
  return b.mesh();
}
// a domed cathedral (west front toward -x)
export function cathedral() {
  const b = new GB(), st = 0xE8E2D0, st2 = 0xD5CCB6, lead = 0x7D978F;
  b.box(34, 9, 11, st, 0, 4.5, 0); b.box(11, 9, 30, st, 2, 4.5, 0); b.box(34.4, 0.6, 11.4, st2, 0, 9.3, 0); b.box(11.4, 0.6, 30.4, st2, 2, 9.3, 0);
  b.add(prismGeo(34, 5.6, 3.0), lead, M(0, 9.6, 0)); b.add(prismGeo(30, 5.6, 3.0), lead, M(2, 9.6, 0, 0, Math.PI / 2, 0));
  b.cyl(7.2, 7.4, 6, 16, st, 2, 12.5, 0); for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2; b.cyl(0.35, 0.35, 5.4, 6, st2, 2 + Math.cos(a) * 7.8, 12.3, Math.sin(a) * 7.8); }
  b.cyl(8.2, 8.2, 0.6, 16, st2, 2, 15.4, 0); b.cyl(6.6, 6.8, 3.4, 16, st, 2, 17.2, 0);
  b.add(new THREE.SphereGeometry(6.6, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), lead, M(2, 18.9, 0, 0, 0, 0, 1, 1.25, 1));
  b.cyl(1.3, 1.5, 3.2, 8, st, 2, 28.7, 0); b.cone(1.0, 2.2, 8, lead, 2, 31.4, 0); b.ball(0.5, 1, C.gold, 2, 32.8, 0); b.box(0.15, 1.4, 0.15, C.gold, 2, 33.8, 0); b.box(0.8, 0.15, 0.15, C.gold, 2, 33.9, 0);
  for (const z of [-4.2, 4.2]) { b.box(4.2, 15, 4.2, st, -15.5, 7.5, z); b.cyl(1.7, 2.0, 4, 8, st, -15.5, 17, z); b.cone(1.6, 3.8, 8, lead, -15.5, 20.9, z); b.ball(0.35, 0, C.gold, -15.5, 23, z); }
  for (let i = 0; i < 6; i++) b.cyl(0.42, 0.45, 6.5, 8, st2, -17.6, 3.25, -4.0 + i * 1.6);
  b.box(1.4, 1.0, 10.4, st2, -17.6, 7.0, 0); b.add(prismGeo(1.4, 5.2, 2.0), st, M(-17.6, 7.5, 0));
  return b.mesh();
}
// square stone keep with four corner turrets and lead cupolas
export function keep() {
  const b = new GB(), st = 0xE6DFCF, st2 = 0xD3CAB4, lead = 0x6F7F86;
  b.box(14, 15, 12, st, 0, 7.5, 0);
  for (let i = 0; i < 9; i++) for (const z of [-6, 6]) b.box(0.9, 0.9, 0.5, st2, -6.6 + i * 1.65, 15.45, z);
  for (let i = 0; i < 7; i++) for (const x of [-7, 7]) b.box(0.5, 0.9, 0.9, st2, x, 15.45, -5.4 + i * 1.8);
  for (const [x, z] of [[-7, -6], [7, -6], [-7, 6], [7, 6]]) { b.box(2.4, 19, 2.4, st, x, 9.5, z); b.cyl(1.1, 1.2, 0.9, 8, lead, x, 19.45, z); b.ball(1.25, 1, lead, x, 20.6, z, 1, 1.15, 1); b.cone(0.12, 1.3, 4, C.gold, x, 22.3, z); }
  for (let r = 0; r < 3; r++) for (let i = 0; i < 4; i++) for (const z of [-6.04, 6.04]) b.box(0.9, 1.6, 0.12, 0x2B3140, -4.5 + i * 3, 4 + r * 4, z);
  for (let r = 0; r < 3; r++) for (let i = 0; i < 3; i++) for (const x of [-7.04, 7.04]) b.box(0.12, 1.6, 0.9, 0x2B3140, x, 4 + r * 4, -3 + i * 3);
  return b.mesh();
}
// screw press for striking coins (frame); the turning bar is a separate mesh (pressBar)
export function press() {
  const b = new GB(), w = 0x6E4A2C, ir = 0x6A707C;
  b.box(1.9, 0.6, 1.4, w, 0, 0.3, 0); b.box(0.36, 3.0, 0.5, ir, -0.72, 1.8, 0); b.box(0.36, 3.0, 0.5, ir, 0.72, 1.8, 0); b.box(1.95, 0.5, 0.62, ir, 0, 3.35, 0); b.box(0.5, 0.2, 0.5, 0x8A8F99, 0, 0.7, 0);
  return b.mesh();
}
export function pressBar() { const b = new GB(); b.cyl(0.13, 0.13, 2.2, 6, 0x6A707C, 0, 0, 0); b.box(3.6, 0.13, 0.13, 0x6A707C, 0, 1.0, 0); b.ball(0.32, 0, 0x4A4E58, -1.85, 1.0, 0); b.ball(0.32, 0, 0x4A4E58, 1.85, 1.0, 0); return b.mesh(); }
// bare tree (trunk + branches); the leaves are a separate canopy mesh so they can change with the seasons
export function treeTrunk(h) { const b = new GB(); b.cyl(0.15, 0.24, h * 0.62, 6, C.trunk, 0, h * 0.31, 0); b.cyl(0.05, 0.09, h * 0.4, 5, C.trunk, 0.32, h * 0.66, 0.1, 0, 0, -0.55); b.cyl(0.05, 0.09, h * 0.36, 5, C.trunk, -0.28, h * 0.68, -0.1, 0.2, 0, 0.6); b.cyl(0.04, 0.07, h * 0.3, 5, C.trunk, 0, h * 0.74, 0.3, 0.6, 0, 0); return b.mesh(); }
export function canopyGeo(h, r) { const b = new GB(); for (let i = 0; i < 4; i++) b.ball(h * (0.2 + r() * 0.06), 1, 0xFFFFFF, (r() - 0.5) * h * 0.3, h * (0.78 + r() * 0.12), (r() - 0.5) * h * 0.3); return b.geo(); }
// study with the street side open (a doll's-house view): open side faces -z; desk faces the open side
export function study() {
  const b = new GB(), wall = 0xE9DCC0, wood = 0x6B4226;
  b.box(6.4, 0.24, 5.4, 0x7A5234, 0, 0.12, 0); b.box(6.4, 3.8, 0.3, wall, 0, 2.0, 2.55); b.box(0.3, 3.8, 5.4, wall, -3.05, 2.0, 0); b.box(0.3, 3.8, 5.4, wall, 3.05, 2.0, 0);
  b.box(6.6, 0.3, 5.6, 0xD8C9A8, 0, 3.95, 0); b.box(3.6, 0.03, 2.4, 0x8B3A3A, 0, 0.255, 0.3);
  b.box(1.5, 1.7, 0.1, 0xF3E9D6, 1.7, 2.3, 2.38); b.box(1.25, 1.45, 0.12, 0x1B2550, 1.7, 2.3, 2.37);
  b.box(0.5, 2.7, 2.3, wood, -2.62, 1.45, 0.8); for (let i = 0; i < 4; i++) for (let k = 0; k < 6; k++) b.box(0.3, 0.42, 0.13, [0x8B2E2E, 0x2E4A7A, 0x4C7A3A, 0xB08A3A, 0x5A3A6A][(i + k * 2) % 5], -2.45, 0.6 + i * 0.62, 0.12 + k * 0.29);
  b.box(2.6, 0.12, 1.3, wood, 0, 1.02, 0.35); for (const [x, z] of [[-1.15, -0.2], [1.15, -0.2], [-1.15, 0.9], [1.15, 0.9]]) b.box(0.12, 1.0, 0.12, wood, x, 0.5, z);
  b.box(0.95, 0.03, 0.68, 0xF6EEDA, -0.15, 1.1, 0.25); b.cyl(0.1, 0.12, 0.16, 6, 0x1A1A22, 0.55, 1.16, 0.6);
  b.box(0.7, 1.5, 0.12, wood, 0, 1.05, 1.85); b.box(0.75, 0.1, 0.72, wood, 0, 0.64, 1.5);
  b.cyl(0.15, 0.18, 0.06, 8, C.gold, 0.85, 1.11, 0.25); b.cyl(0.06, 0.06, 0.34, 6, 0xFFF6E0, 0.85, 1.31, 0.25);
  return b.mesh();
}
// a share certificate (paper) and an apple, ready for instancing
export const PAPER = new THREE.BoxGeometry(0.44, 0.02, 0.32);
export const APPLE = (() => { const b = new GB(); b.ball(0.3, 1, 0xC8282C, 0, 0, 0, 1, 0.92, 1); b.ball(0.11, 0, 0xE04848, 0.12, 0.12, 0.14); b.cyl(0.025, 0.03, 0.18, 4, 0x5A3A1E, 0, 0.32, 0); b.box(0.2, 0.03, 0.1, 0x4C9A3A, 0.1, 0.34, 0, 0, 0, 0.4); return b.geo(); })();

// ───────── Yap, 1903 (episode 3): stone money, outrigger canoe, raft, thatched house, Palau's rock islands
// fei (stone money): a limestone wheel with a hole, thicker at the hole. Standing on its rim, facing ±x (axis along x), bottom at y = 0.
export function feiGeo(R, o = {}) {
  const ri = R * (o.hole ?? 0.17), th = R * (o.th ?? 0.3), n = o.seg ?? 14;
  const pts = [[ri, -th / 2], [R * 0.6, -th * 0.4], [R * 0.93, -th * 0.27], [R, 0], [R * 0.93, th * 0.27], [R * 0.6, th * 0.4], [ri, th / 2], [ri, -th / 2]].map(([x, y]) => new THREE.Vector2(x, y));
  const g = new THREE.LatheGeometry(pts, n).toNonIndexed();
  if (o.lying) g.translate(0, th / 2, 0); else g.rotateZ(Math.PI / 2).translate(0, R, 0);
  const col = new THREE.Color(o.color ?? 0xD9D1BC), c = new THREE.Color(), r = o.rand ?? Math.random, a = [];
  for (let i = 0; i < g.attributes.position.count; i += 3) { c.copy(col).offsetHSL(0, 0, (r() - 0.5) * 0.06); for (let k = 0; k < 3; k++) a.push(c.r, c.g, c.b); }
  g.setAttribute('color', new THREE.Float32BufferAttribute(a, 3)); g.computeVertexNormals(); return g;
}
export const feiFace = (R, r, o = {}) => { const ri = R * (o.hole ?? 0.17), th = R * (o.th ?? 0.3); return r <= R * 0.6 ? lerp3(th / 2, th * 0.4, (r - ri) / (R * 0.6 - ri)) : lerp3(th * 0.4, th * 0.27, (r - R * 0.6) / (R * 0.33)); };   // half-thickness at radius r
const lerp3 = (a, b, u) => a + (b - a) * Math.max(0, Math.min(1, u));
export function fei(R, o = {}) { const m = new THREE.Mesh(feiGeo(R, o), o.mat ?? MAT); m.castShadow = true; m.receiveShadow = true; return m; }
// outrigger canoe with a crab-claw sail; bow toward +x, outrigger on the +z side; origin at the waterline
export function canoe(o = {}) {
  const b = new GB(), hull = o.hull ?? 0x6B4630, trim = o.trim ?? 0xB8383B, sail = o.sail ?? 0xE6D3A3, L = o.L ?? 4.6;
  b.box(L * 0.72, 0.5, 0.62, hull, 0, 0.05, 0); b.box(L * 0.2, 0.42, 0.5, hull, L * 0.43, 0.12, 0, 0, 0, 0.32); b.box(L * 0.2, 0.42, 0.5, hull, -L * 0.43, 0.12, 0, 0, 0, -0.32);
  b.box(L * 0.74, 0.08, 0.66, trim, 0, 0.32, 0); b.box(0.08, 0.5, 0.08, trim, L * 0.53, 0.42, 0); b.box(0.08, 0.5, 0.08, trim, -L * 0.53, 0.42, 0);
  for (const x of [-0.7, 0.7]) b.box(0.1, 0.1, 2.0, 0x8A6A44, x, 0.36, 1.0);
  b.cyl(0.13, 0.13, L * 0.6, 6, 0x7A5A3A, 0, -0.02, 2.0, 0, 0, Math.PI / 2); b.cone(0.13, 0.4, 6, 0x7A5A3A, L * 0.32, -0.02, 2.0, 0, 0, -Math.PI / 2);
  if (!o.noSail) { b.cyl(0.05, 0.06, 3.4, 5, 0x5A3E28, 0.1, 1.9, 0); b.add(new THREE.ConeGeometry(1.4, 3.3, 3), sail, M(-0.25, 2.2, 0, 0, 0.5, 0.22, 1, 1, 0.07)); }
  return b.mesh();
}
// bamboo raft (logs along x), top at y ≈ 0.3
export function raft(L = 5.2, Wd = 3.0) { const b = new GB(); const n = 9; for (let i = 0; i < n; i++) b.cyl(Wd / n / 2 * 1.05, Wd / n / 2 * 1.05, L, 6, i % 2 ? 0xC4AB66 : 0xB59A58, 0, 0.12, -Wd / 2 + (i + 0.5) * Wd / n, 0, 0, Math.PI / 2); for (const x of [-L * 0.36, 0, L * 0.36]) b.box(0.16, 0.12, Wd + 0.2, 0x7A5A3A, x, 0.3, 0); return b.mesh(); }
// Yapese house on a stone platform: steep thatched roof, ridge along x, door side +z
export function hut(w, d, o = {}) {
  const b = new GB(), st = o.stone ?? 0x98948A, wall = o.wall ?? 0x9C7A4C, roof = o.roof ?? 0x8C7646, ph = o.ph ?? 0.8, wh = o.wh ?? 1.7, rh = o.rh ?? Math.min(4.2, d * 0.95);
  b.box(w + 2.2, ph, d + 2.2, st, 0, ph / 2, 0); b.box(w + 2.3, 0.1, d + 2.3, 0xA8A398, 0, ph + 0.02, 0);
  b.box(w, wh, d, wall, 0, ph + wh / 2, 0); b.box(1.0, 1.25, 0.1, 0x3A2A1C, 0, ph + 0.63, d / 2 + 0.03);
  for (const x of [-w / 2, w / 2]) for (const z of [-d / 2, d / 2]) b.box(0.18, wh + 0.1, 0.18, 0x5A3E28, x, ph + wh / 2, z);
  b.add(prismGeo(w + 1.0, d / 2 + 0.7, rh), roof, M(0, ph + wh - 0.05, 0));
  b.add(prismGeo(w + 1.3, 0.22, 0.28), 0x6E5A34, M(0, ph + wh - 0.05 + rh - 0.12, 0));
  for (const s of [-1, 1]) b.box(0.22, 0.9, 0.22, 0x6E5A34, s * (w / 2 + 0.75), ph + wh + rh + 0.1, 0, 0, 0, -s * 0.5);
  const m = b.mesh(); m.userData = { w, d, h: ph + wh + rh }; return m;
}
// a limestone rock island (Palau): undercut white rock with a green cap
export function rockIsle(r, h, rand = Math.random) { const b = new GB(); b.cyl(r * 0.8, r * 0.55, h * 0.55, 7, 0xD8D2C2, 0, h * 0.27, 0); b.ball(r, 1, 0x3E8A50, 0, h * 0.62, 0, 1, 0.55 + rand() * 0.2, 1); b.ball(r * 0.6, 1, 0x4C9A5C, r * 0.3, h * 0.8, r * 0.2, 1, 0.6, 1); return b.mesh(); }
// a round broadleaf tree (breadfruit-like)
export function bushTree(h, rand = Math.random) { const b = new GB(); b.cyl(0.18, 0.26, h * 0.6, 6, C.trunk, 0, h * 0.3, 0); for (let i = 0; i < 3; i++) b.ball(h * (0.26 + rand() * 0.08), 1, [0x3F8F57, 0x4C9A62, 0x357F4C][i], (rand() - 0.5) * h * 0.35, h * (0.68 + rand() * 0.14), (rand() - 0.5) * h * 0.35); return b.mesh(); }
export const FISH = (() => { const b = new GB(); b.ball(0.22, 0, 0xFFFFFF, 0, 0, 0, 1.6, 0.8, 0.5); b.cone(0.16, 0.3, 3, 0xFFFFFF, -0.42, 0, 0, 0, 0, Math.PI / 2); return b.geo(); })();

// ───────── Silicon Valley, 1993–2026 (episode 4): towers, HQ, diner, cars, TV vans, chips, server racks, a storybook bakery, a ledger, a magnifier
// Lit windows share one material; the scene sets its emissiveIntensity from the night factor (day: plain glass, night: warm light).
export const WIN_LIT = new THREE.MeshLambertMaterial({ vertexColors: true, emissive: 0xFFC46A, emissiveIntensity: 0 });
export const GLASS_M = new THREE.MeshLambertMaterial({ color: 0xBFE3F2, transparent: true, opacity: 0.18, depthWrite: false });
// office tower: concrete or glass body, a band of panes on every floor of all four faces; some panes are "lit" (WIN_LIT) for the night
export function tower(w, h, d, o = {}) {
  const b = new GB(), lw = new GB(), r = o.rand ?? Math.random, col = o.color ?? 0xD9D3C6, glass = o.glass ?? 0x5E7F9A, fr = o.frame ?? 0xEEE9DE, fl = o.floor ?? 3.3, litP = o.litP ?? 0.55;
  b.box(w, h, d, col, 0, h / 2, 0); b.box(w + 0.3, 0.55, d + 0.3, fr, 0, h + 0.27, 0);
  if (o.crown) { b.box(w * 0.7, 2.2, d * 0.7, fr, 0, h + 1.6, 0); b.box(w * 0.4, 2.6, d * 0.4, col, 0, h + 3.9, 0); }
  else if (!o.bare && r() < 0.7) { b.box(w * 0.34, 1.3, d * 0.3, 0x9EA2A6, (r() - .5) * w * 0.3, h + 1.2, (r() - .5) * d * 0.3); b.box(w * 0.2, 0.9, d * 0.2, 0x8C9096, (r() - .5) * w * 0.3, h + 1.0, (r() - .5) * d * 0.3); }
  const nF = Math.max(1, Math.floor((h - 1.6) / fl));
  for (let i = 0; i < nF; i++) {
    const y = 2.0 + i * fl + fl * 0.3;
    for (const [ax, len] of [['z', w], ['x', d]]) {
      const n = Math.max(1, Math.round(len / 2.3)), pw = len / n;
      for (let k = 0; k < n; k++) for (const s of [-1, 1]) {
        const c = -len / 2 + pw * (k + 0.5), g = r() < litP ? lw : b;
        if (ax === 'z') g.box(pw - 0.32, fl * 0.56, 0.12, glass, c, y, s * (d / 2 + 0.04)); else g.box(0.12, fl * 0.56, pw - 0.32, glass, s * (w / 2 + 0.04), y, c);
      }
    }
  }
  if (o.lobby) { b.box(w * 0.6, 2.6, 0.16, 0x2E4458, 0, 1.3, d / 2 + 0.05); b.box(w * 0.7, 0.25, 1.6, fr, 0, 2.75, d / 2 + 0.8); }
  const g = new THREE.Group(); const body = b.mesh(); g.add(body);
  if (lw.p.length) { const m = new THREE.Mesh(lw.geo(), WIN_LIT); m.castShadow = true; g.add(m); }
  g.userData = { w, h, d }; return g;
}
// headquarters: a glass atrium between two lower wings; entrance (glass doors, canopy, steps) on +z; flat roof terrace on the atrium
export function hq(o = {}) {
  const r = o.rand ?? Math.random, g = new THREE.Group(), glass = 0x4E7C93, fr = 0xF1EDE4, AH = o.ah ?? 22, AW = 18, AD = 16;
  const at = tower(AW, AH, AD, { rand: r, color: 0x6D97AA, glass: 0x3F6A80, frame: fr, litP: 0.6, floor: 3.6, bare: true }); g.add(at); const RY = AH + 0.55;   // top of the tower's cap
  for (const s of [-1, 1]) { const wg = tower(16, 13, 20, { rand: r, color: 0xE4DED2, glass, frame: fr, litP: 0.55 }); wg.position.set(s * 17, 0, -1); g.add(wg); }
  const b = new GB();
  b.box(8, 3.4, 0.2, 0x26404F, 0, 1.7, AD / 2 + 0.08); for (let i = -2; i <= 2; i++) b.box(0.14, 3.4, 0.3, fr, i * 2, 1.7, AD / 2 + 0.12);
  b.box(12, 0.35, 4.2, fr, 0, 4.2, AD / 2 + 2.0); for (const x of [-5.6, 5.6]) b.box(0.3, 4.1, 0.3, fr, x, 2.05, AD / 2 + 3.9);
  b.box(12.4, 0.06, 4.4, 0xCFC7B6, 0, 0.03, AD / 2 + 2.1);                                     // entrance paving under the canopy
  b.box(AW + 0.6, 1.1, 0.2, fr, 0, RY + 0.55, AD / 2 + 0.2); b.box(AW + 0.6, 1.1, 0.2, fr, 0, RY + 0.55, -AD / 2 - 0.2); b.box(0.2, 1.1, AD + 0.6, fr, AW / 2 + 0.2, RY + 0.55, 0); b.box(0.2, 1.1, AD + 0.6, fr, -AW / 2 - 0.2, RY + 0.55, 0);   // roof railing
  b.box(AW - 0.4, 0.12, AD - 0.4, 0xB9B2A4, 0, RY + 0.06, 0);   // terrace deck
  for (const [x, z] of [[-7, -5.5], [7, -5.5], [-7, 5.5], [7, 5.5]]) { b.box(1.4, 0.8, 1.4, 0x9C8E78, x, RY + 0.4, z); b.ball(0.9, 1, 0x4C9A62, x, RY + 1.3, z); }   // planters
  const m = b.mesh(); g.add(m); g.userData = { roofY: RY + 0.12, doorZ: AD / 2 + 0.2, AW, AD }; return g;
}
// 1993 roadside diner: long and low, big windows on the front (+z), door at the +x end, a booth just inside the front windows
export function diner(o = {}) {
  const g = new THREE.Group(), b = new GB(), gl = new GB(), L = 14, D = 6.4, H = 3.7, st = o.stripe ?? 0xC8423A, wall = o.wall ?? 0xF2E6CF, fr = 0xDCDCDC;
  b.box(L + 0.4, 0.3, D + 0.4, 0x9A948A, 0, 0.15, 0);                                        // floor slab
  b.box(L, H, 0.25, wall, 0, H / 2, -D / 2);                                                  // back wall
  for (const s of [-1, 1]) b.box(0.25, H, D, wall, s * L / 2, H / 2, 0);                      // ends
  b.box(L, 0.85, 0.25, wall, 0, 0.425, D / 2); b.box(L, 0.75, 0.25, wall, 0, H - 0.375, D / 2);  // front: low wall + top band (big windows between)
  b.box(L + 0.06, 0.2, 0.3, st, 0, 0.72, D / 2 + 0.02); b.box(L + 0.06, 0.32, 0.3, st, 0, H - 0.2, D / 2 + 0.02);
  for (let i = 0; i <= 7; i++) b.box(0.16, H - 1.6, 0.3, fr, -L / 2 + 0.1 + i * (L - 0.2) / 7, 0.85 + (H - 1.6) / 2, D / 2);   // window mullions
  for (let i = 0; i < 7; i++) gl.box((L - 0.2) / 7 - 0.18, H - 1.6, 0.04, 0xffffff, -L / 2 + 0.1 + (i + 0.5) * (L - 0.2) / 7, 0.85 + (H - 1.6) / 2, D / 2 + 0.02);
  b.box(L + 1.2, 0.3, D + 1.4, 0xE9E2D2, 0, H + 0.15, 0.25); b.box(L + 1.24, 0.34, 0.3, st, 0, H + 0.15, D / 2 + 0.95);   // roof with an overhang
  b.box(1.1, 2.3, 0.1, 0x6B4A2E, L / 2 - 0.2, 1.15, D / 2 + 0.6);                           // door (in a vestibule)
  b.box(1.6, 2.6, 1.2, wall, L / 2 - 0.2, 1.3, D / 2 + 0.6 - 0.65); 
  // inside: counter with stools along the back, booths along the front windows
  b.box(L - 4, 1.05, 0.9, 0xB8B0A2, 0.6, 0.53, -D / 2 + 1.1); b.box(L - 3.9, 0.08, 1.05, 0xE0D8C8, 0.6, 1.08, -D / 2 + 1.1);
  for (let i = 0; i < 7; i++) { b.cyl(0.05, 0.05, 0.7, 5, 0x9A9A9A, -4.4 + i * 1.6, 0.35, -D / 2 + 2.0); b.cyl(0.24, 0.22, 0.12, 8, st, -4.4 + i * 1.6, 0.74, -D / 2 + 2.0); }
  const booths = [];
  for (const bx of [-3.94, 0, 3.94]) {   // one booth behind each window pane (the front benches have no backs, so you can see in)
    b.box(1.9, 0.08, 0.9, 0xE8E0CC, bx, 0.82, 1.55); b.box(0.12, 0.8, 0.12, 0x9A9A9A, bx, 0.4, 1.55);   // table
    b.box(1.9, 0.42, 0.55, st, bx, 0.45, 0.78); b.box(1.9, 1.15, 0.16, st, bx, 0.95, 0.48); b.box(1.9, 0.42, 0.55, st, bx, 0.45, 2.32);
    booths.push([bx, 1.55]);
  }
  for (let i = 0; i < 4; i++) { b.cyl(0.36, 0.36, 0.06, 8, 0xFFF1C8, -4.8 + i * 3.2, H - 0.12, 0.6); }                       // ceiling lamps
  const m = b.mesh(); g.add(m); const gm = new THREE.Mesh(gl.geo(), GLASS_M); gm.renderOrder = 2; g.add(gm);
  g.userData = { L, D, H, booths }; return g;
}
// a sign on a tall pole (the panel itself is a separate textured plane added by the scene at y = h)
export function signPole(h, pw = 4.4) { const b = new GB(); b.cyl(0.18, 0.24, h, 8, 0x8A8F96, 0, h / 2, 0); b.box(pw + 0.4, 0.3, 0.5, 0xC8423A, 0, h - 1.15, 0); b.box(pw + 0.4, 0.3, 0.5, 0xC8423A, 0, h + 1.15, 0); return b.mesh(); }
// car (bow toward +x); o.boxy = early-1990s shape
export function car(col, o = {}) {
  const b = new GB(), dk = 0x26303A, L = o.L ?? 4.3;
  b.box(L, 0.72, 1.82, col, 0, 0.68, 0); b.box(L * (o.boxy ? 0.5 : 0.46), 0.66, 1.62, col, -L * 0.05, 1.36, 0); b.box(L * (o.boxy ? 0.5 : 0.46) + 0.04, 0.46, 1.64, dk, -L * 0.05, 1.38, 0);
  b.box(0.08, 0.2, 0.36, 0xFFF4D0, L / 2 + 0.01, 0.78, 0.6); b.box(0.08, 0.2, 0.36, 0xFFF4D0, L / 2 + 0.01, 0.78, -0.6); b.box(0.08, 0.18, 0.4, 0xC8282C, -L / 2 - 0.01, 0.8, 0.6); b.box(0.08, 0.18, 0.4, 0xC8282C, -L / 2 - 0.01, 0.8, -0.6);
  for (const x of [L * 0.32, -L * 0.32]) for (const z of [0.86, -0.86]) b.cyl(0.36, 0.36, 0.26, 10, 0x1E2226, x, 0.36, z, Math.PI / 2, 0, 0);
  return b.mesh();
}
// TV news van with a satellite dish (bow toward +x)
export function van(o = {}) {
  const b = new GB(), col = o.color ?? 0xF4F2EC, st = o.stripe ?? 0x2F6FB8, dk = 0x26303A;
  b.box(5.2, 2.2, 2.1, col, -0.3, 1.4, 0); b.box(1.4, 1.5, 2.0, col, 2.9, 1.05, 0); b.box(0.9, 0.7, 1.96, dk, 3.05, 1.5, 0, 0, 0, 0.3); b.box(5.24, 0.28, 2.14, st, -0.3, 1.3, 0);
  for (const x of [2.6, -1.9]) for (const z of [0.95, -0.95]) b.cyl(0.42, 0.42, 0.3, 10, 0x1E2226, x, 0.42, z, Math.PI / 2, 0, 0);
  b.cyl(0.08, 0.1, 1.2, 6, 0x8A8F96, -1.2, 3.1, 0); b.add(new THREE.SphereGeometry(1.0, 12, 4, 0, Math.PI * 2, 0, Math.PI / 2.6), 0xE8E8E8, M(-1.2, 3.6, 0, 0, 0, -1.1, 1, 0.45, 1)); b.cyl(0.03, 0.03, 0.8, 4, 0x8A8F96, -0.8, 3.75, 0, 0, 0, -1.1);
  b.cyl(0.06, 0.08, 2.6, 6, 0x9A9A9A, 0.8, 3.8, 0.7); b.box(0.5, 0.3, 0.3, 0x3A3A3A, 0.8, 5.1, 0.7);
  return b.mesh();
}
// street lamp (the head's glow is a separate emissive mesh in the scene at y = h)
export function lamp(h = 6) { const b = new GB(); b.cyl(0.09, 0.13, h, 6, 0x5A5F66, 0, h / 2, 0); b.box(1.4, 0.1, 0.12, 0x5A5F66, 0.65, h - 0.05, 0); b.box(0.6, 0.18, 0.34, 0x4A4E54, 1.25, h - 0.18, 0); return b.mesh(); }
// a graphics chip: dark package with a silver lid and gold pins, lying flat, 1 x 1 at s = 1 (for InstancedMesh with MAT)
export const CHIP = (() => { const b = new GB(); b.box(1.0, 0.12, 1.0, 0x1F3B2E, 0, 0.06, 0); b.box(0.62, 0.08, 0.62, 0xC9CED6, 0, 0.16, 0); b.box(0.3, 0.02, 0.3, 0x9AA2AE, 0, 0.21, 0);
  for (let i = 0; i < 6; i++) for (const s of [-1, 1]) { const c = -0.375 + i * 0.15; b.box(0.08, 0.04, 0.12, 0xE2B24A, c, 0.04, s * 0.53); b.box(0.12, 0.04, 0.08, 0xE2B24A, s * 0.53, 0.04, c); }
  return b.geo(); })();
// server rack (front toward +z); its LEDs come back as a second geometry for an emissive material
export function rack() { const b = new GB(), l = new GB(); b.box(0.9, 2.3, 1.2, 0x2A2F38, 0, 1.15, 0); for (let i = 0; i < 9; i++) { b.box(0.8, 0.18, 0.04, 0x3A404C, 0, 0.3 + i * 0.22, 0.61); l.box(0.06, 0.05, 0.03, 0xffffff, -0.3 + (i % 3) * 0.08, 0.3 + i * 0.22, 0.635); l.box(0.06, 0.05, 0.03, 0xffffff, 0.28, 0.3 + i * 0.22, 0.635); } return [b.geo(), l.geo()]; }
// conveyor belt along x, top at y = 1.0
export function conveyor(L) { const b = new GB(); b.box(L, 0.16, 1.5, 0x2C2F35, 0, 1.0, 0); b.box(L, 0.22, 0.12, 0xE0A23A, 0, 1.0, 0.8); b.box(L, 0.22, 0.12, 0xE0A23A, 0, 1.0, -0.8); for (let x = -L / 2 + 0.6; x < L / 2; x += 1.6) for (const z of [0.7, -0.7]) b.box(0.14, 0.95, 0.14, 0x8A8F96, x, 0.47, z); return b.mesh(); }
// fab / data hall: a long low building whose +x side is open (a doll's-house view of the racks inside)
export function hall(L, D, H) { const b = new GB(), wall = 0xE6E1D6; b.box(L, 0.2, D, 0xB8B2A6, 0, 0.1, 0); b.box(L, H, 0.3, wall, 0, H / 2, -D / 2); b.box(L, H, 0.3, wall, 0, H / 2, D / 2); b.box(0.3, H, D, wall, -L / 2, H / 2, 0); b.box(L + 0.6, 0.4, D + 0.6, 0xCFC8BA, 0, H + 0.2, 0); for (let i = 0; i < 4; i++) b.box(1.6, 1.1, 1.6, 0x9EA2A6, -L / 2 + 3 + i * (L - 6) / 3, H + 0.95, 0); b.box(0.3, 0.8, D, wall, L / 2, H - 0.4, 0); return b.mesh(); }
// storybook bakery, doll's-house style: the front (+z) is open; oven at the back left, bread shelves at the back right, counter in front
export function bakery(o = {}) {
  const b = new GB(), wall = 0xF3E3C3, wd = 0x8A5A34, W = 9, D = 6, H = 4.2, brick = 0xB5603E;
  b.box(W, 0.2, D, 0xCFB48C, 0, 0.1, 0); b.box(W, H, 0.3, wall, 0, H / 2, -D / 2); for (const s of [-1, 1]) b.box(0.3, H, D, wall, s * W / 2, H / 2, 0);
  b.box(W, 0.9, 0.3, wall, 0, H - 0.45, D / 2); b.add(prismGeo(W + 0.8, D / 2 + 0.6, 2.4), 0xB8383B, M(0, H, 0)); b.box(0.9, 1.6, 0.9, 0x8C4A36, -W / 2 + 1.4, H + 1.6, -0.8);
  for (let i = 0; i < 9; i++) b.box(W / 9, 0.1, 1.5, i % 2 ? 0xF6EFE2 : 0xB8383B, -W / 2 + (i + 0.5) * W / 9, H - 0.95, D / 2 + 0.6, 0.35, 0, 0);   // striped awning
  b.dome(1.25, brick, -2.6, 0.2, -1.6); b.box(2.7, 0.2, 2.7, 0x8C4A36, -2.6, 0.1, -1.6); b.box(0.9, 0.7, 0.2, 0x1C120C, -2.6, 0.55, -0.42);   // oven (mouth faces +z)
  for (let i = 0; i < 3; i++) b.box(3.2, 0.1, 0.7, wd, 2.4, 0.9 + i * 0.85, -D / 2 + 0.55);                                               // shelves
  b.box(5.2, 1.0, 0.9, wd, 0.6, 0.5, 1.4); b.box(5.4, 0.1, 1.05, 0xE8D2A8, 0.6, 1.05, 1.4);                                               // counter
  const m = b.mesh(); m.userData = { W, D, H, oven: [-2.6, 0.55, -0.4], shelf: [2.4, 0.9, -D / 2 + 0.55], counter: [0.6, 1.1, 1.4] }; return m;
}
// a giant ledger: page block + two covers that open on the spine (covers are pivots: rotate z from ±π/2·0.98 closed to 0 open)
export function ledger(W = 5, Dp = 7, o = {}) {
  const g = new THREE.Group(), cov = o.cover ?? 0x7A2E2E, pg = 0xF7F0DC;
  const block = new GB(); block.box(0.5, 0.9, Dp - 0.2, cov, 0, 0.45, 0); g.add(block.mesh());
  const pivots = [-1, 1].map(s => { const p = new THREE.Group(), b = new GB(); b.box(W, 0.14, Dp, cov, s * W / 2, 0.07, 0); b.box(W - 0.3, 0.32, Dp - 0.4, pg, s * (W / 2 - 0.1), 0.3, 0); for (let i = 0; i < 8; i++) b.box(W * 0.7, 0.02, 0.12, 0xC9BFA6, s * (W / 2 - 0.2), 0.47, -Dp / 2 + 1.0 + i * 0.7); p.add(b.mesh()); p.position.set(0, 0.9, 0); g.add(p); p.userData.s = s; return p; });
  g.userData = { pivots, W, Dp }; return g;
}
// long boardroom table with chairs: seats along ±x sides facing the table, one at the +z head (index 0)
export function boardTable(n = 4, o = {}) {
  const b = new GB(), wd = o.wood ?? 0x5E3A22, ch = o.chair ?? 0x2A2E36, Lz = n * 1.5 + 1.2, seats = [];
  b.box(2.2, 0.12, Lz, wd, 0, 0.8, 0); for (const x of [-0.8, 0.8]) for (const z of [-Lz / 2 + 0.5, Lz / 2 - 0.5]) b.box(0.12, 0.8, 0.12, wd, x, 0.4, z);
  const chair = (x, z, ry) => { const c = new THREE.Matrix4().makeRotationY(ry).setPosition(x, 0, z); const cb = new GB(); cb.box(0.6, 0.1, 0.6, ch, 0, 0.5, 0); cb.box(0.1, 1.0, 0.6, ch, -0.3, 1.0, 0); cb.cyl(0.04, 0.04, 0.5, 5, 0x8A8F96, 0, 0.25, 0); const gg = cb.geo(); gg.applyMatrix4(c); const a = gg.attributes.position.array, cc = gg.attributes.color.array; for (let i = 0; i < a.length; i++) { b.p.push(a[i]); b.c.push(cc[i]); } };
  chair(0, Lz / 2 + 0.6, Math.PI / 2); seats.push([0, Lz / 2 + 0.6, -Math.PI / 2]);
  for (let i = 0; i < n; i++) { const z = -Lz / 2 + 1.1 + i * 1.5; chair(-1.55, z, 0); seats.push([-1.55, z, 0]); chair(1.55, z, Math.PI); seats.push([1.55, z, Math.PI]); }
  const m = b.mesh(); m.userData = { seats, Lz }; return m;
}
// magnifying glass, lens facing +z, handle down-right
export function magnifier() { const g = new THREE.Group(), b = new GB(); b.add(new THREE.TorusGeometry(1.6, 0.22, 8, 24), 0xE2B24A, M()); b.cyl(0.22, 0.26, 2.6, 8, 0x5E3A22, 1.6, -1.6, 0, 0, 0, Math.PI / 4); g.add(b.mesh()); const lens = new THREE.Mesh(new THREE.CircleGeometry(1.5, 24), new THREE.MeshLambertMaterial({ color: 0xCFEFFF, transparent: true, opacity: 0.35, side: THREE.DoubleSide, depthWrite: false })); g.add(lens); return g; }
// a tiny arcade spaceship: blocky (pixel) version and a smooth version, nose toward +x
export const SHIP_PIX = (() => { const b = new GB(), c = 0x7FD3FF, k = 0.22; for (const [x, y] of [[0, 0], [1, 0], [2, 0], [-1, 0], [-2, 0], [0, 1], [1, 1], [-1, 1], [0, 2], [-2, -1], [2, -1], [-2, 1], [2, 1]]) b.box(k, k, k, x === 0 && y === 2 ? 0xFFE27A : c, y * k, x * k, 0); return b.geo(); })();
export const SHIP_SMOOTH = (() => { const b = new GB(); b.cone(0.28, 1.0, 10, 0xDDE8F2, 0.25, 0, 0, 0, 0, -Math.PI / 2); b.cyl(0.28, 0.24, 0.5, 10, 0xB8C8D8, -0.45, 0, 0, 0, 0, Math.PI / 2); b.box(0.5, 0.05, 1.3, 0x7FD3FF, -0.35, 0, 0); b.box(0.3, 0.4, 0.05, 0x7FD3FF, -0.5, 0.2, 0); b.ball(0.12, 1, 0xFFE27A, 0.05, 0.16, 0, 1.4, 0.8, 0.8); b.cone(0.18, 0.4, 8, 0xFF9A3C, -0.85, 0, 0, 0, 0, Math.PI / 2); return b.geo(); })();
export const CUP = (() => { const b = new GB(); b.cyl(0.07, 0.06, 0.13, 8, 0xFAF6EE, 0, 0.065, 0); b.cyl(0.075, 0.075, 0.01, 8, 0x4A2C1A, 0, 0.125, 0); b.cyl(0.1, 0.1, 0.01, 8, 0xFAF6EE, 0, 0.005, 0); return b.geo(); })();
export const NEWS = new THREE.PlaneGeometry(0.62, 0.86);

// ───────── Bitcoin, November 2026 (episode 5): leveraged bets as dominoes, a lender's kiosk, a SELL button, a fund building, a coin
// domino geometry (for InstancedMesh with MAT): origin at the bottom centre, thin along x (falls toward +x), 2.0 wide along z, 3.4 tall.
// Gold foot = the trader's own 10 %, blue body = borrowed 90 %, white divider and pips on both faces. o.blueOnly: the blue part alone (origin at its own bottom).
export function domino(o = {}) {
  const b = new GB(), Hh = 3.4, Th = 0.5, Wd = 2.0, foot = Hh * 0.1, blue = 0x3F6FC0, gold = 0xF2B53A, pip = 0xF4F2EC, y0 = o.blueOnly ? 0 : foot, bh = Hh - foot;
  if (!o.blueOnly) b.box(Th, foot, Wd, gold, 0, foot / 2, 0);
  b.box(Th, bh, Wd, blue, 0, y0 + bh / 2, 0);
  for (const s of [-1, 1]) { const x = s * (Th / 2 + 0.006); b.box(0.02, 0.07, Wd * 0.8, pip, x, y0 + bh * 0.5, 0); for (const [py, pz] of [[0.76, -0.45], [0.76, 0.45], [0.26, 0]]) b.cyl(0.13, 0.13, 0.02, 8, pip, x, y0 + bh * py, pz, 0, 0, Math.PI / 2); }
  return b.geo();
}
// lender's kiosk, open toward +x (counter, striped awning, sign board above the window); a person can stand inside at x ≈ -0.4
export function kiosk() {
  const g = new THREE.Group(), b = new GB(), wall = 0xF2E6CF;
  b.box(0.2, 2.8, 3.2, wall, -1.4, 1.4, 0); b.box(2.9, 2.8, 0.2, wall, 0, 1.4, -1.5); b.box(2.9, 2.8, 0.2, wall, 0, 1.4, 1.5);
  b.box(0.4, 1.1, 3.0, 0x2F6FB8, 1.25, 0.55, 0); b.box(0.7, 0.12, 3.2, 0xE6DCC4, 1.25, 1.16, 0);
  b.box(3.6, 0.25, 3.8, 0xC8423A, 0.15, 2.9, 0);
  for (let i = 0; i < 6; i++) b.box(1.0, 0.08, 0.64, i % 2 ? 0xF6EFE2 : 0x2F6FB8, 1.95, 2.55, -1.6 + i * 0.64, 0, 0, -0.35);
  b.box(0.12, 0.8, 2.9, 0x2F3A55, 1.5, 3.45, 0); b.box(0.2, 0.6, 0.2, 0x5A5F66, 1.5, 3.0, -1.2); b.box(0.2, 0.6, 0.2, 0x5A5F66, 1.5, 3.0, 1.2);
  g.add(b.mesh()); return g;
}
// a big red button on a pedestal (userData.cap can be pressed down; userData.glow is a ring that pulses)
export function bigButton() {
  const g = new THREE.Group(), b = new GB();
  b.cyl(0.55, 0.7, 1.1, 10, 0x3A4048, 0, 0.55, 0); b.cyl(0.85, 0.85, 0.14, 14, 0x8A8F96, 0, 1.17, 0); g.add(b.mesh());
  const cap = new THREE.Mesh(new THREE.SphereGeometry(0.58, 16, 6, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshLambertMaterial({ color: 0xE0352B, emissive: 0x801010, emissiveIntensity: 0.6 })); cap.position.y = 1.22; cap.castShadow = true; g.add(cap);
  const glow = new THREE.Mesh(new THREE.RingGeometry(0.9, 1.3, 28).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: 0xFF5A4A, transparent: true, opacity: 0.6, depthWrite: false, toneMapped: false })); glow.position.y = 1.26; g.add(glow);
  g.userData = { cap, capY: 1.22, glow }; return g;
}
// a classical fund building facing +z: plinth, steps, eight columns, a tall frieze for a sign, a pediment; userData: door (z of the doorway), signY, signZ
export function bank() {
  const g = new THREE.Group(), b = new GB(), st = 0xEDE6D6, st2 = 0xD9D0BC, Wd = 24, D = 14, Hh = 11;
  b.box(Wd + 2, 1.0, D + 5, st2, 0, 0.5, 1.5);
  for (let i = 0; i < 3; i++) b.box(Wd - 2 - i * 0.8, 0.34, 1.0, st, 0, 1.0 + i * 0.34 + 0.17 - 1.0 + 0.34 * 0, D / 2 + 3.2 - i * 0.9);
  b.box(Wd, Hh, D, st, 0, 1 + Hh / 2, -1);
  for (let i = 0; i < 8; i++) b.cyl(0.55, 0.62, Hh - 2.6, 10, 0xF6F0E2, -Wd / 2 + 1.6 + i * (Wd - 3.2) / 7, 1 + (Hh - 2.6) / 2, D / 2 + 0.7);
  b.box(Wd + 0.8, 2.6, 2.8, st, 0, 1 + Hh - 1.3, D / 2 + 0.3);
  b.add(prismGeo(D + 2.6, (Wd + 0.8) / 2, 3.2), 0xE4DCC8, M(0, 1 + Hh, -0.5, 0, Math.PI / 2, 0));
  b.box(4.2, 5.4, 0.3, 0x3A2E24, 0, 3.7, D / 2 - 0.85); b.box(4.8, 0.3, 0.5, st2, 0, 6.5, D / 2 - 0.8);
  g.add(b.mesh()); g.userData = { door: D / 2 - 0.5, signY: 1 + Hh - 1.3, signZ: D / 2 + 1.72 }; return g;
}
// a coin with a raised rim (axis along y), white vertex colour so the material sets its colour
export function BIGCOIN(r = 0.5, th = 0.16) { const b = new GB(); b.cyl(r, r, th, 18, 0xFFFFFF, 0, 0, 0); b.cyl(r * 0.74, r * 0.74, th + 0.04, 18, 0xFFFFFF, 0, 0, 0); return b.geo(); }

// ───────── Strategy's bitcoin vault, November 2026 (episode 6): a glass vault, a round vault door, cash bundles, a list slab, a pedestal
// glass vault: stone plinth, steel frame, glass walls and roof (one transparent mesh); userData: W, D, H, floorY (top of the plinth)
export function glassVault(W = 16, D = 12, H = 9) {
  const g = new THREE.Group(), b = new GB(), gl = new GB(), st = 0x7E848E, fy = 0.6, y1 = fy + H;
  b.box(W + 1.6, fy, D + 1.6, 0xD8D0BE, 0, fy / 2, 0); b.box(W + 1.9, 0.12, D + 1.9, 0xEDE6D6, 0, fy - 0.04, 0);
  b.box(W - 0.2, 0.06, D - 0.2, 0xB9A47A, 0, fy + 0.03, 0);                                                    // the vault floor
  for (const x of [-W / 2, W / 2]) for (const z of [-D / 2, D / 2]) b.box(0.42, H, 0.42, st, x, fy + H / 2, z);   // corner posts
  for (const x of [-W / 6, W / 6]) for (const z of [-D / 2, D / 2]) b.box(0.2, H, 0.2, st, x, fy + H / 2, z);
  for (const z of [-D / 6, D / 6]) for (const x of [-W / 2, W / 2]) b.box(0.2, H, 0.2, st, x, fy + H / 2, z);
  for (const y of [fy + 0.2, y1]) { b.box(W + 0.42, 0.42, 0.42, st, 0, y, D / 2); b.box(W + 0.42, 0.42, 0.42, st, 0, y, -D / 2); b.box(0.42, 0.42, D + 0.42, st, W / 2, y, 0); b.box(0.42, 0.42, D + 0.42, st, -W / 2, y, 0); }
  for (const x of [-W / 6, W / 6]) b.box(0.24, 0.3, D, st, x, y1, 0);                                         // roof beams
  b.box(4.2, 0.5, 0.3, 0x5A5F68, 0, y1 + 0.1, -1.6); b.box(4.2, 0.5, 0.3, 0x5A5F68, 0, y1 + 0.1, 1.6); b.box(0.3, 0.5, 3.5, 0x5A5F68, -2.0, y1 + 0.1, 0); b.box(0.3, 0.5, 3.5, 0x5A5F68, 2.0, y1 + 0.1, 0);   // the hatch in the roof
  gl.box(W, H, 0.06, 0xffffff, 0, fy + H / 2, D / 2); gl.box(W, H, 0.06, 0xffffff, 0, fy + H / 2, -D / 2); gl.box(0.06, H, D, 0xffffff, W / 2, fy + H / 2, 0); gl.box(0.06, H, D, 0xffffff, -W / 2, fy + H / 2, 0);
  gl.box(W, 0.06, D / 2 - 1.75, 0xffffff, 0, y1, -(D / 4 + 0.875)); gl.box(W, 0.06, D / 2 - 1.75, 0xffffff, 0, y1, D / 4 + 0.875); gl.box(W / 2 - 2.0, 0.06, 3.5, 0xffffff, -(W / 4 + 1.0), y1, 0); gl.box(W / 2 - 2.0, 0.06, 3.5, 0xffffff, W / 4 + 1.0, y1, 0);
  const m = b.mesh(); g.add(m); const gm = new THREE.Mesh(gl.geo(), GLASS_M); gm.renderOrder = 2; g.add(gm);
  g.userData = { W, D, H, floorY: fy + 0.06 }; return g;
}
// round vault door, facing +z (the disc lies in the xy plane); the door hangs on a pivot at its -x edge (userData.pivot, rotate y to open)
export function vaultDoor(R = 2.6) {
  const g = new THREE.Group(), b = new GB(), st = 0xBFC5CC, dk = 0x5A606A;
  b.add(new THREE.TorusGeometry(R + 0.3, 0.32, 8, 28), dk, M(0, 0, 0)); g.add(b.mesh());
  const pivot = new THREE.Group(); pivot.position.set(-R - 0.3, 0, 0.35); g.add(pivot);
  const d = new GB(), cx = R + 0.3;
  d.cyl(R, R, 0.7, 28, st, cx, 0, 0, Math.PI / 2, 0, 0); d.cyl(R * 0.8, R * 0.8, 0.78, 28, 0xA9B0B8, cx, 0, 0, Math.PI / 2, 0, 0);
  for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; d.cyl(0.14, 0.14, 0.9, 8, dk, cx + Math.cos(a) * R * 0.9, Math.sin(a) * R * 0.9, 0, Math.PI / 2, 0, 0); }
  d.add(new THREE.TorusGeometry(R * 0.42, 0.08, 6, 20), dk, M(cx, 0, 0.55)); for (let i = 0; i < 3; i++) d.box(R * 0.84, 0.11, 0.11, dk, cx, 0, 0.55, 0, 0, i * Math.PI / 3); d.cyl(0.22, 0.22, 0.4, 10, dk, cx, 0, 0.5, Math.PI / 2, 0, 0);
  d.box(0.5, 0.7, 0.5, dk, 0.1, R * 0.5, -0.2); d.box(0.5, 0.7, 0.5, dk, 0.1, -R * 0.5, -0.2);                 // hinges
  pivot.add(d.mesh()); g.userData = { pivot, R }; return g;
}
// a bundle of banknotes (for InstancedMesh with MAT): green block with a paper band, 1.0 x 0.42 x 0.6, origin at its centre
export const CASH = (() => { const b = new GB(); b.box(1.0, 0.42, 0.6, 0x5E9E5A, 0, 0, 0); b.box(0.22, 0.44, 0.62, 0xF2EEE2, 0, 0, 0); b.box(0.9, 0.02, 0.5, 0x7CB874, 0, 0.215, 0); return b.geo(); })();
// a share certificate (for InstancedMesh with MAT): a thin cream sheet with an amber seal, 1.0 x 0.7
export const CERT = (() => { const b = new GB(); b.box(1.0, 0.02, 0.7, 0xFBF6E8, 0, 0, 0); b.box(0.8, 0.025, 0.06, 0xC9BFA6, 0, 0.005, -0.2); b.box(0.6, 0.025, 0.05, 0xC9BFA6, -0.1, 0.005, 0.0); b.cyl(0.11, 0.11, 0.03, 10, 0xE2A23A, 0.32, 0.01, 0.2); return b.geo(); })();
// a tall stone slab for a list (the list itself is a textured plane the scene puts on the +z face, 0.62 in front of the centre)
export function listSlab(W = 13, H = 18) { const b = new GB(); b.box(W + 2, 1.0, 4, 0xCFC7B6, 0, 0.5, 0); b.box(W, H, 1.2, 0xE9E3D6, 0, 1 + H / 2, 0); b.box(W + 0.6, 0.6, 1.5, 0xD6CEBC, 0, 1 + H + 0.3, 0); b.box(0.3, H, 1.3, 0xD6CEBC, -W / 2, 1 + H / 2, 0); b.box(0.3, H, 1.3, 0xD6CEBC, W / 2, 1 + H / 2, 0); return b.mesh(); }
// a stone pedestal, top at y = h
export function pedestal(h = 1.3, r = 0.9) { const b = new GB(); b.cyl(r * 1.25, r * 1.35, 0.25, 10, 0xD6CEBC, 0, 0.125, 0); b.cyl(r, r, h - 0.45, 10, 0xEDE6D6, 0, 0.25 + (h - 0.45) / 2, 0); b.cyl(r * 1.2, r * 1.1, 0.2, 10, 0xD6CEBC, 0, h - 0.1, 0); return b.mesh(); }

// ───────── Silver, November 2026 (episode 7): silver bars (ingots), solar panels, a factory, a savings jar
// an ingot (for InstancedMesh with a material that sets the colour): a frustum with a rectangular base L x W, height H, a shallow stamp on top; origin at its centre, long side along x
export function INGOT(L = 2.6, H = 0.66, W = 1.2) {
  const b = new GB(), m = new THREE.Matrix4().makeScale(L / Math.SQRT2, 1, W / Math.SQRT2).multiply(new THREE.Matrix4().makeRotationY(Math.PI / 4));
  b.add(new THREE.CylinderGeometry(0.84, 1, H, 4, 1), 0xFFFFFF, m);
  const m2 = new THREE.Matrix4().makeTranslation(0, H / 2, 0).multiply(new THREE.Matrix4().makeScale(L * 0.62 / Math.SQRT2, 1, W * 0.5 / Math.SQRT2)).multiply(new THREE.Matrix4().makeRotationY(Math.PI / 4));
  b.add(new THREE.CylinderGeometry(0.9, 1, 0.05, 4, 1), 0xE4E7EC, m2);
  return b.geo();
}
// a solar panel on a post: dark blue cells with a light grid, tilted toward +x; origin at the foot of the post
export function solarPanel(w = 3.4, d = 2.0) {
  const b = new GB(), tilt = 0.5, y = 1.5;
  b.cyl(0.09, 0.12, y, 6, 0x8A8F96, 0, y / 2, 0); b.box(0.5, 0.12, 0.3, 0x8A8F96, 0, y, 0);
  const P = (x, z) => [x * Math.cos(tilt), y + 0.12 + x * Math.sin(tilt), z];
  b.box(d, 0.08, w, 0x24365E, ...P(0, 0), 0, 0, tilt); b.box(d + 0.12, 0.05, w + 0.12, 0xC9CED6, ...P(0, 0).map((v, i) => i === 1 ? v - 0.05 : v), 0, 0, tilt);
  for (let i = 1; i < 4; i++) b.box(d, 0.1, 0.04, 0x8FA6C8, ...P(0, -w / 2 + i * w / 4), 0, 0, tilt);
  for (let i = 1; i < 3; i++) b.box(0.04, 0.1, w, 0x8FA6C8, ...P(-d / 2 + i * d / 3, 0), 0, 0, tilt);
  return b.mesh();
}
// a factory (front toward +x): brick-red body, sawtooth roof with glazing, a chimney, a big door; userData.door = [x, y, z] of the doorway
export function factory(L = 16, D = 12, H = 6) {
  const b = new GB(), wall = 0xC9765A, trim = 0xEDE6D6;
  b.box(L, H, D, wall, 0, H / 2, 0); b.box(L + 0.3, 0.4, D + 0.3, trim, 0, H + 0.2, 0);
  for (let i = 0; i < 4; i++) { const x = -L / 2 + (i + 0.5) * L / 4; b.add(prismGeo(D, L / 8, 2.4), 0xB9B2A6, M(x, H + 0.4, 0, 0, Math.PI / 2, 0)); b.box(0.12, 2.0, D - 0.4, 0x7FB2D0, x + L / 8 - 0.15, H + 1.4, 0, 0, 0, 0.25); }
  b.cyl(0.8, 1.0, 9, 10, 0xB25A44, -L / 2 + 2.2, H + 4.5, -D / 2 + 2.2); b.cyl(0.95, 0.95, 0.5, 10, trim, -L / 2 + 2.2, H + 8.8, -D / 2 + 2.2);
  b.box(0.3, 4.2, 4.6, 0x3A3F48, L / 2 + 0.05, 2.1, 0); b.box(0.4, 0.4, 5.2, trim, L / 2 + 0.1, 4.4, 0);
  for (const z of [-D / 2 + 1.6, D / 2 - 1.6]) b.box(0.14, 1.4, 2.2, 0x7FB2D0, L / 2 + 0.05, 3.2, z);
  const m = b.mesh(); m.userData = { door: [L / 2 + 0.2, 1.6, 0], L, D, H }; return m;
}
// a savings jar on a pedestal: glass cylinder (transparent, separate mesh) with a lid; userData: inner radius, floorY, H
export function savingsJar(R = 1.4, H = 2.8, ph = 1.2) {
  const g = new THREE.Group(), b = new GB();
  b.cyl(R * 1.35, R * 1.45, 0.25, 12, 0xD6CEBC, 0, 0.125, 0); b.cyl(R * 1.1, R * 1.1, ph - 0.45, 12, 0xEDE6D6, 0, 0.25 + (ph - 0.45) / 2, 0); b.cyl(R * 1.3, R * 1.2, 0.2, 12, 0xD6CEBC, 0, ph - 0.1, 0);
  b.cyl(R + 0.08, R + 0.08, 0.12, 16, 0xC9CED6, 0, ph + 0.06, 0); b.cyl(R * 0.75, R * 0.85, 0.3, 16, 0xE2B24A, 0, ph + H + 0.15, 0); b.box(R * 0.9, 0.06, 0.18, 0x5A4A2A, 0, ph + H + 0.31, 0);
  g.add(b.mesh()); const gl = new THREE.Mesh(new THREE.CylinderGeometry(R, R, H, 16, 1, true), GLASS_M); gl.position.y = ph + 0.12 + H / 2; gl.renderOrder = 2; g.add(gl);
  g.userData = { R, floorY: ph + 0.12, H }; return g;
}
