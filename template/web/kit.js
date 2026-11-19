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
  const b = new GB(), robe = o.robe ?? 0x3B4A9A, skin = o.skin ?? 0x8D5E3F, hat = o.hat ?? 0xF6EFE2;
  b.cyl(0.2, 0.46, 1.15, 7, robe, 0, 0.575, 0);
  if (o.sash) b.cyl(0.3, 0.33, 0.14, 7, o.sash, 0, 0.78, 0);
  b.ball(0.28, 1, skin, 0, 1.43, 0);
  if (o.crown) { b.cyl(0.25, 0.23, 0.2, 6, C.gold, 0, 1.74, 0); for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2; b.cone(0.06, 0.16, 4, C.gold, Math.cos(a) * 0.22, 1.9, Math.sin(a) * 0.22); } }
  else if (o.bigHat) { b.ball(0.34, 1, hat, 0, 1.66, 0, 1, 0.62, 1); }
  else b.cyl(0.29, 0.31, 0.18, 7, hat, 0, 1.64, 0);
  if (o.scroll) { b.cyl(0.07, 0.07, 0.6, 6, 0xFBF3DF, 0.36, 0.95, 0, Math.PI / 2, 0, 0); b.cone(0.03, 0.42, 4, 0xFFFFFF, 0.42, 1.25, 0.18, 0, 0, -0.5); }
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
