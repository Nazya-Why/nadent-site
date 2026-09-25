// Visual QA helper: node scripts/crop.mjs <in.png> <top> <height> <out.png> [left] [width]
import sharp from "sharp";
const [inp, top, height, out, left = "0", width] = process.argv.slice(2);
const meta = await sharp(inp).metadata();
const w = width ? Number(width) : meta.width - Number(left);
await sharp(inp).extract({ left: Number(left), top: Number(top), width: w, height: Math.min(Number(height), meta.height - Number(top)) }).toFile(out);
console.log("ok", out);
