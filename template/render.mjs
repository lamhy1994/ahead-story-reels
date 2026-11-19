import { chromium } from '/opt/npm-tools/node_modules/playwright/index.mjs';
import http from 'http'; import fs from 'fs'; import path from 'path'; import { spawn } from 'child_process';
const root = path.resolve(process.env.ROOT ?? 'web');
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.woff2': 'font/woff2', '.json': 'application/json', '.css': 'text/css', '.png': 'image/png', '.jpg': 'image/jpeg' };
const srv = http.createServer((req, res) => {
  const f = path.join(root, decodeURIComponent(req.url.split('?')[0]));
  fs.readFile(f, (e, d) => { if (e) { res.writeHead(404); res.end(); return; } res.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream', 'Cache-Control': 'no-store' }); res.end(d); });
});
await new Promise(r => srv.listen(0, '127.0.0.1', r));
const port = srv.address().port;
const [mode, a1, a2, a3] = process.argv.slice(2);
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--enable-webgl', '--disable-dev-shm-usage', '--hide-scrollbars', '--font-render-hinting=none'] });
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
const errs = [];
page.on('pageerror', e => { errs.push(String(e)); console.log('PAGEERROR', String(e).slice(0, 400)); });
page.on('console', m => { const s = m.text(); if (m.type() === 'error' && !/GPU stall|404/.test(s)) console.log('console.error', s.slice(0, 300)); });
await page.goto(`http://127.0.0.1:${port}/index.html?aa=${process.env.AA ?? '1'}${process.env.QS ? '&' + process.env.QS : ''}`);
await page.waitForFunction('window.__ready===true', null, { timeout: 120000 });
const shot = () => page.screenshot({ type: 'jpeg', quality: Number(process.env.Q ?? 92) });
if (mode === 'keys') {
  const times = a1.split(',').map(Number); fs.mkdirSync(a2, { recursive: true });
  const t00 = Date.now();
  for (const t of times) { await page.evaluate(t => window.renderAt(t), t); fs.writeFileSync(`${a2}/k_${t.toFixed(2).padStart(6, '0')}.jpg`, await shot()); }
  console.log('keys', times.length, 'frames in', ((Date.now() - t00) / 1000).toFixed(1), 's =', ((Date.now() - t00) / times.length).toFixed(0), 'ms/frame; DUR', await page.evaluate('window.DUR'));
} else if (mode === 'seg') {
  const f0 = Number(a1), f1 = Number(a2), out = a3, tmp = out.replace(/\.mp4$/, '.tmp.mp4');
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', '30', '-c:v', 'mjpeg', '-i', '-', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '17', '-pix_fmt', 'yuv420p', '-r', '30', '-movflags', '+faststart', tmp], { stdio: ['pipe', 'inherit', 'inherit'] });
  const done = new Promise(r => ff.on('close', r));
  const t00 = Date.now();
  for (let f = f0; f < f1; f++) {
    await page.evaluate(t => window.renderAt(t), f / 30);
    const buf = await shot();
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if ((f - f0) % 60 === 59) console.log(out, 'frame', f, 'of', f1, ((Date.now() - t00) / (f - f0 + 1)).toFixed(0), 'ms/frame');
  }
  ff.stdin.end(); const code = await done;
  if (code === 0 && errs.length === 0) { fs.renameSync(tmp, out); console.log('SEG_OK', out, f1 - f0, 'frames', ((Date.now() - t00) / 1000).toFixed(0), 's'); } else { console.log('SEG_FAIL', out, code, errs.length); process.exitCode = 1; }
}
await browser.close(); srv.close();
