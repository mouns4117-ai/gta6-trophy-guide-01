// Leonida Ledger — a tiny static server for trying the guide locally.
// Serves app/ at its root on http://localhost:8080. Standard library only.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('app/', import.meta.url));
const port = Number(process.env.PORT ?? 8080);

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
};

const server = createServer(async (request, response) => {
  const path = request.url === '/' ? 'index.html' : decodeURIComponent(request.url ?? '').replace(/^\/+/, '');
  if (path.includes('..')) {
    response.writeHead(400);
    response.end('bad path');
    return;
  }
  try {
    const body = await readFile(join(root, path));
    response.writeHead(200, { 'content-type': mimeTypes[extname(path)] ?? 'application/octet-stream' });
    response.end(body);
  } catch {
    response.writeHead(404);
    response.end('not found');
  }
});

server.listen(port, () => {
  console.log('Leonida Ledger at http://localhost:' + port);
});
