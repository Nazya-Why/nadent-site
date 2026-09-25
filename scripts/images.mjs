/**
 * Image pipeline for the static export.
 *
 * Put an original photo into public/images/ named after its ImageSlot id
 * (e.g. public/images/hero-desktop.jpg). This script creates AVIF + WebP
 * variants in public/images/_opt/ and writes src/generated/images.json, which
 * ImageSlot reads to switch from the placeholder to the real photo.
 *
 * Runs automatically before `dev` and `build`.
 */
import { readdir, mkdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const SRC_DIR = path.join(ROOT, "public", "images");
const OUT_DIR = path.join(SRC_DIR, "_opt");
const MANIFEST = path.join(ROOT, "src", "generated", "images.json");
const WIDTHS = [360, 480, 640, 828, 1080, 1280, 1600, 1920, 2560];
const EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".tif", ".tiff"]);

async function exists(file) {
  try {
    return await stat(file);
  } catch {
    return null;
  }
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  await mkdir(path.dirname(MANIFEST), { recursive: true });

  const files = (await readdir(SRC_DIR, { withFileTypes: true }))
    .filter((d) => d.isFile() && EXT.has(path.extname(d.name).toLowerCase()))
    .map((d) => d.name);

  const manifest = {};
  let generated = 0;

  for (const file of files) {
    const id = path.basename(file, path.extname(file));
    const input = path.join(SRC_DIR, file);
    const srcStat = await stat(input);
    const image = sharp(input, { failOn: "none" }).rotate();
    const meta = await image.metadata();
    const w = meta.autoOrient?.width ?? meta.width;
    const h = meta.autoOrient?.height ?? meta.height;
    if (!w || !h) continue;

    const widths = WIDTHS.filter((x) => x < w).concat(w > WIDTHS.at(-1) ? [WIDTHS.at(-1)] : [w]);
    const unique = [...new Set(widths)].sort((a, b) => a - b);

    for (const width of unique) {
      for (const format of ["avif", "webp"]) {
        const out = path.join(OUT_DIR, `${id}-${width}.${format}`);
        const outStat = await exists(out);
        if (outStat && outStat.mtimeMs >= srcStat.mtimeMs) continue;
        const pipeline = sharp(input, { failOn: "none" }).rotate().resize({ width, withoutEnlargement: true });
        await (format === "avif"
          ? pipeline.avif({ quality: 52, effort: 5 })
          : pipeline.webp({ quality: 76, effort: 5 })
        ).toFile(out);
        generated++;
      }
    }

    const blurBuf = await sharp(input, { failOn: "none" }).rotate().resize(16).webp({ quality: 40 }).toBuffer();
    manifest[id] = {
      w,
      h,
      widths: unique,
      blur: `data:image/webp;base64,${blurBuf.toString("base64")}`,
    };
  }

  await writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
  console.log(`[images] ${Object.keys(manifest).length} source image(s), ${generated} variant(s) generated`);
}

main().catch((err) => {
  console.error("[images] failed:", err);
  process.exit(1);
});
