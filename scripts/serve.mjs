/**
 * Minimal static server for the `out/` folder that behaves like GitHub Pages:
 * /path/ -> /path/index.html, unknown paths -> 404.html with status 404.
 * Usage: node scripts/serve.mjs [port]   (BASE_PATH env mirrors NEXT_PUBLIC_BASE_PATH)
 */
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { gzipSync } from "node:zlib";

const ROOT = path.resolve(import.meta.dirname, "..", "out");
const PORT = Number(process.argv[2] ?? process.env.PORT ?? 4321);
const BASE = (process.env.BASE_PATH ?? "").replace(/\/$/, "");

const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".woff2": "font/woff2",
  ".xml": "application/xml; charset=utf-8",
  ".webmanifest": "application/manifest+json",
  ".ico": "image/x-icon",
};

async function tryFile(p) {
  try {
    const s = await stat(p);
    if (s.isFile()) return p;
    if (s.isDirectory()) {
      const idx = path.join(p, "index.html");
      if ((await stat(idx)).isFile()) return idx;
    }
  } catch {
    /* not found */
  }
  return null;
}

createServer(async (req, res) => {
  let url = decodeURIComponent((req.url ?? "/").split("?")[0]);
  if (BASE && url.startsWith(BASE)) url = url.slice(BASE.length) || "/";
  const target = path.join(ROOT, url);
  if (!target.startsWith(ROOT)) {
    res.writeHead(403).end();
    return;
  }
  let file = await tryFile(target);
  if (!file && !path.extname(url)) file = await tryFile(`${target}.html`);
  if (!file) {
    const nf = await readFile(path.join(ROOT, "404.html")).catch(() => "Not found");
    res.writeHead(404, { "content-type": types[".html"] }).end(nf);
    return;
  }
  let body = await readFile(file);
  const ext = path.extname(file);
  const compressible = /.(html|js|css|json|txt|svg|xml|webmanifest)$/.test(ext);
  const gzip = compressible && /gzip/.test(req.headers["accept-encoding"] ?? "");
  if (gzip) body = gzipSync(body);
  const immutable = file.includes(`${path.sep}_next${path.sep}static`);
  res
    .writeHead(200, {
      "content-type": types[ext] ?? "application/octet-stream",
      "cache-control": immutable ? "public, max-age=31536000, immutable" : "no-cache",
      ...(gzip ? { "content-encoding": "gzip", vary: "accept-encoding" } : {}),
    })
    .end(body);
}).listen(PORT, () => console.log(`Serving out/ on http://localhost:${PORT}${BASE}/`));
