/**
 * Post-export fixes.
 *
 * 1. Windows only: Next 16 builds segment-prefetch filenames with `path.join`, so on
 *    Windows they end up as nested folders (`__next.!X/zapys/__PAGE__.txt`) instead of
 *    `__next.!X.zapys.__PAGE__.txt`, and the client router gets 404s. We flatten them.
 *    Linux builds (GitHub Actions) are already correct — this is a no-op there.
 * 2. Removes original photos from out/images (only optimized _opt variants are served).
 */
import { readdir, rename, rm, stat, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const OUT = path.resolve(import.meta.dirname, "..", "out");

async function walkDirs(dir, visit) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name === "_next") continue;
    const full = path.join(dir, entry.name);
    if (entry.name.startsWith("__next.")) await visit(full);
    else await walkDirs(full, visit);
  }
}

async function listFiles(dir, base = dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await listFiles(full, base)));
    else out.push(path.relative(base, full));
  }
  return out;
}

let flattened = 0;
await walkDirs(OUT, async (segDir) => {
  const parent = path.dirname(segDir);
  const prefix = path.basename(segDir);
  for (const rel of await listFiles(segDir)) {
    const flat = `${prefix}.${rel.split(path.sep).join(".")}`;
    await rename(path.join(segDir, rel), path.join(parent, flat));
    flattened++;
  }
  await rm(segDir, { recursive: true, force: true });
});

// Drop originals: they can be many MB and are never referenced
const imagesDir = path.join(OUT, "images");
let removed = 0;
try {
  for (const entry of await readdir(imagesDir, { withFileTypes: true })) {
    if (entry.isFile() && /\.(jpe?g|png|tiff?|webp|avif)$/i.test(entry.name)) {
      await rm(path.join(imagesDir, entry.name));
      removed++;
    }
  }
} catch {
  await mkdir(imagesDir, { recursive: true });
}

void stat;
// GitHub Pages: never run Jekyll (it would hide the _next folder)
await writeFile(path.join(OUT, ".nojekyll"), "");
console.log(`[postbuild] flattened ${flattened} segment file(s), removed ${removed} original image(s)`);
