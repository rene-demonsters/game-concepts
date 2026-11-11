#!/usr/bin/env node
// Tiny dependency-free static server for the prototype.
// Serves make-yourself-at-home/ (so ../art works) and picks the first free port from 8081.
// Usage: node serve.mjs [startPort]
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const startPort = Number(process.argv[2] || process.env.PORT || 8081);
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.json': 'application/json', '.md': 'text/markdown; charset=utf-8' };

const server = http.createServer((req, res) => {
  let url = decodeURIComponent((req.url || '/').split('?')[0]);
  if (url === '/' || url === '/prototype') { res.writeHead(302, { Location: '/prototype/' }); return res.end(); }
  if (url.endsWith('/')) url += 'index.html';
  const file = path.resolve(root, '.' + url);
  if (!file.startsWith(root + path.sep)) { res.writeHead(403); return res.end('Forbidden'); }
  fs.stat(file, (err, st) => {
    if (err || !st.isFile()) { res.writeHead(404, { 'Content-Type': 'text/plain' }); return res.end('Not found'); }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    fs.createReadStream(file).pipe(res);
  });
});

function listen(port, tries = 0) {
  server.once('error', (e) => {
    if (e.code === 'EADDRINUSE' && tries < 30) listen(port + 1, tries + 1);
    else { console.error(e.message); process.exit(1); }
  });
  server.listen(port, '127.0.0.1', () => {
    console.log(`Make Yourself at Home prototype: http://localhost:${port}/prototype/`);
    console.log('Press Ctrl+C to stop.');
  });
}
listen(startPort);
