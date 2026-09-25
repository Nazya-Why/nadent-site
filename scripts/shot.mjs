/**
 * Visual QA helper: full-page screenshots at several widths.
 * Usage: node scripts/shot.mjs <outDir> <path> [widths=390,1440] [--dark] [--full]
 */
import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const [outDir = "shots", pagePath = "/", widthsArg = "390,1440", ...flags] = process.argv.slice(2);
const base = process.env.SHOT_BASE ?? "http://localhost:4321";
const dark = flags.includes("--dark");
const full = flags.includes("--full");
const clipH = Number(flags.find((f) => f.startsWith("--h="))?.slice(4) ?? 0);

await mkdir(outDir, { recursive: true });
const browser = await chromium.launch();
for (const w of widthsArg.split(",").map(Number)) {
  const mobile = w < 768;
  const ctx = await browser.newContext({
    viewport: { width: w, height: mobile ? 844 : 900 },
    deviceScaleFactor: mobile ? 2 : 1,
    colorScheme: dark ? "dark" : "light",
    isMobile: mobile,
    hasTouch: mobile,
  });
  const page = await ctx.newPage();
  await page.addInitScript(() => {
    try {
      localStorage.setItem("nd-consent", JSON.stringify({ v: 1, analytics: false, marketing: false, at: Date.now() }));
    } catch {}
  });
  await page.goto(base + pagePath, { waitUntil: "networkidle" });
  // Reveal everything that animates on scroll
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 40));
    }
    document.querySelectorAll("[data-reveal],[data-reveal-lines]").forEach((el) => el.classList.add("is-in"));
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(900);
  if (flags.includes("--seg")) {
    const total = await page.evaluate(() => document.documentElement.scrollHeight);
    const vh = mobile ? 844 : 900;
    let n = 0;
    for (let y = 0; y < total; y += vh - 60) {
      await page.evaluate((yy) => window.scrollTo(0, yy), y);
      await page.waitForTimeout(350);
      const segName = `${pagePath.replace(/\W+/g, "_") || "home"}-${w}${dark ? "-dark" : ""}-s${String(n++).padStart(2, "0")}.png`;
      await page.screenshot({ path: path.join(outDir, segName) });
    }
    console.log("segments", n);
    await ctx.close();
    continue;
  }
  const name = `${pagePath.replace(/\W+/g, "_") || "home"}-${w}${dark ? "-dark" : ""}.png`;
  await page.screenshot({
    path: path.join(outDir, name),
    fullPage: full || !clipH,
    ...(clipH ? { clip: { x: 0, y: 0, width: w, height: clipH } } : {}),
  });
  console.log("saved", name);
  await ctx.close();
}
await browser.close();
