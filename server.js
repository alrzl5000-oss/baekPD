/* 백PD 키우기 · 의존성 없는 정적 서버 (Node 내장 모듈만 사용) */
const http = require('http');
const fs   = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js'  : 'application/javascript; charset=utf-8',
  '.css' : 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png' : 'image/png',
  '.jpg' : 'image/jpeg',
  '.svg' : 'image/svg+xml',
  '.ico' : 'image/x-icon',
  '.txt' : 'text/plain; charset=utf-8'
};

const server = http.createServer((req, res) => {
  let rel;
  try { rel = decodeURIComponent(req.url.split('?')[0]); }
  catch (e) { rel = '/'; }
  if (rel === '/' || rel === '') rel = '/index.html';

  const file = path.join(ROOT, path.normalize(rel));
  if (!file.startsWith(ROOT)) { res.writeHead(403); res.end('403'); return; }

  fs.readFile(file, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found');
      return;
    }
    res.writeHead(200, {
      'Content-Type' : TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream',
      'Cache-Control': 'no-cache'
    });
    res.end(data);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log('baekPD serving on 0.0.0.0:' + PORT);
});
