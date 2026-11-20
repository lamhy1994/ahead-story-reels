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
  // Yap, 1903 (episode 3): bare (skin-coloured chest, robe = skirt), hair, helmet (pith helmet colour), flower (hair flower colour)
  const b = new GB(), robe = o.robe ?? 0x3B4A9A, skin = o.skin ?? 0x8D5E3F, hat = o.hat ?? 0xF6EFE2;
  if (o.bare) { b.cyl(0.21, 0.3, 0.6, 7, skin, 0, 0.87, 0); b.cyl(0.3, 0.47, 0.62, 7, robe, 0, 0.31, 0); }
  else if (o.dress) b.cyl(0.2, 0.62, 1.15, 8, robe, 0, 0.575, 0); else b.cyl(0.2, 0.46, 1.15, 7, robe, 0, 0.575, 0);
  if (o.hair) { b.ball(0.3, 1, o.hair, -0.04, 1.52, 0, 1, 0.78, 1.04); if (o.flower) b.ball(0.08, 0, o.flower, 0.02, 1.62, 0.25); }
  if (o.helmet) { b.ball(0.31, 1, o.helmet, 0, 1.62, 0, 1.05, 0.72, 1.05); b.cyl(0.47, 0.47, 0.04, 10, o.helmet, 0, 1.6, 0); b.cyl(0.29, 0.29, 0.05, 8, 0x8A6A3A, 0, 1.64, 0); }
  if (o.sash) b.cyl(0.3, 0.33, 0.14, 7, o.sash, 0, 0.78, 0);
  if (o.collar) b.cyl(0.22, 0.25, 0.1, 7, o.collar, 0, 1.12, 0);
  b.ball(0.28, 1, skin, 0, 1.43, 0);
  if (o.wig) { b.ball(0.32, 1, o.wig, -0.03, 1.56, 0, 1, 0.72, 1.06); b.ball(0.16, 1, o.wig, -0.06, 1.28, 0.27, 1, 1.55, 0.9); b.ball(0.16, 1, o.wig, -0.06, 1.28, -0.27, 1, 1.55, 0.9); b.ball(0.2, 1, o.wig, -0.22, 1.3, 0, 1, 1.45, 1.2); }
  if (o.crown) { b.cyl(0.25, 0.23, 0.2, 6, C.gold, 0, 1.74, 0); for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2; b.cone(0.06, 0.16, 4, C.gold, Math.cos(a) * 0.22, 1.9, Math.sin(a) * 0.22); } }
  else if (o.tricorn) { b.cone(0.5, 0.2, 3, o.tricorn, 0, 1.8 + (o.wig ? 0.04 : 0), 0, 0, Math.PI / 2, 0); b.cyl(0.21, 0.25, 0.2, 7, o.tricorn, 0, 1.86 + (o.wig ? 0.04 : 0), 0); }
  else if (o.bonnet) { b.ball(0.33, 1, o.bonnet, -0.04, 1.56, 0, 1.05, 0.72, 1.05); b.cyl(0.42, 0.42, 0.04, 9, o.bonnet, 0.02, 1.62, 0); }
  else if (o.bigHat) { b.ball(0.34, 1, hat, 0, 1.66, 0, 1, 0.62, 1); }
  else if (!o.wig && !o.noHat && !o.hair && !o.helmet) b.cyl(0.29, 0.31, 0.18, 7, hat, 0, 1.64, 0);
  if (o.scroll) { b.cyl(0.07, 0.07, 0.6, 6, 0xFBF3DF, 0.36, 0.95, 0, Math.PI / 2, 0, 0); b.cone(0.03, 0.42, 4, 0xFFFFFF, 0.42, 1.25, 0.18, 0, 0, -0.5); }
  if (o.paper) b.box(0.05, 0.4, 0.3, 0xFBF6E8, 0.36, 1.62, 0.18, 0, 0, -0.25);
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
