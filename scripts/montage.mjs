// Visual QA helper: node scripts/montage.mjs <out.png> <w> <img1> <img2> ...  (side by side, each resized to width w)
import sharp from "sharp";
const [out, w, ...files] = process.argv.slice(2);
const width = Number(w);
const bufs = await Promise.all(files.map((f) => sharp(f).resize({ width }).toBuffer({ resolveWithObject: true })));
const h = Math.max(...bufs.map((b) => b.info.height));
await sharp({ create: { width: width * bufs.length + 10 * (bufs.length - 1), height: h, channels: 3, background: "#888" } })
  .composite(bufs.map((b, i) => ({ input: b.data, left: i * (width + 10), top: 0 })))
  .png()
  .toFile(out);
console.log("ok", out);
