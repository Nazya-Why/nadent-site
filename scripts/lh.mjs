// Lighthouse summary: node scripts/lh.mjs <url> <outJson> [desktop]
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
const [url, out, ff = "mobile"] = process.argv.slice(2);
const args = ["lighthouse", url, "--quiet", "--chrome-flags=--headless=new", "--output=json", `--output-path=${out}`];
if (ff === "desktop") args.push("--preset=desktop");
try {
  execFileSync("npx", args, { stdio: "ignore", shell: true, env: { ...process.env, CHROME_PATH: process.env.CHROME_PATH ?? "C:/Program Files/Google/Chrome/Application/chrome.exe" } });
} catch {
  /* chrome-launcher on Windows may fail to clean temp dirs after writing the report */
}
const r = JSON.parse(readFileSync(out, "utf8"));
console.log(Object.entries(r.categories).map(([k, v]) => `${k}: ${Math.round(v.score * 100)}`).join(" | "));
const a = r.audits;
for (const k of ["first-contentful-paint", "largest-contentful-paint", "total-blocking-time", "cumulative-layout-shift", "speed-index"]) console.log(k, a[k].displayValue);
for (const [k, v] of Object.entries(a)) {
  if (v.score !== null && v.score < 0.9 && !["informative", "notApplicable", "manual"].includes(v.scoreDisplayMode)) console.log("  ✗", k, v.displayValue ?? "");
}
