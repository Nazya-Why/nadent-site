// Perf probe: load a page with 4x CPU throttle, summarise style/layout work from a Chrome trace.
import { chromium } from "@playwright/test";
const url = process.argv[2] ?? "http://localhost:4321/";
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 412, height: 823 }, deviceScaleFactor: 2.6, isMobile: true, hasTouch: true });
const page = await ctx.newPage();
if (process.env.OVERRIDE_CSS) {
  await page.addInitScript((css) => {
    document.addEventListener("DOMContentLoaded", () => {
      const st = document.createElement("style");
      st.textContent = css;
      document.head.appendChild(st);
    });
    const st = document.createElement("style");
    st.textContent = css;
    document.documentElement.appendChild(st);
  }, process.env.OVERRIDE_CSS);
}
const cdp = await ctx.newCDPSession(page);
await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
await browser.startTracing(page, { categories: ["devtools.timeline", "disabled-by-default-devtools.timeline"] });
await page.goto(url, { waitUntil: "load" });
await page.waitForTimeout(3000);
const buf = await browser.stopTracing();
const events = JSON.parse(buf.toString()).traceEvents;
const sum = {};
for (const e of events) {
  if (e.ph !== "X" || !e.dur) continue;
  if (["UpdateLayoutTree", "Layout", "Paint", "PrePaint", "Layerize", "EvaluateScript", "FunctionCall", "ParseHTML", "HitTest", "RecalculateStyles"].includes(e.name)) {
    sum[e.name] ??= { n: 0, ms: 0, max: 0 };
    sum[e.name].n++;
    sum[e.name].ms += e.dur / 1000;
    sum[e.name].max = Math.max(sum[e.name].max, e.dur / 1000);
  }
}
for (const [k, v] of Object.entries(sum)) console.log(k.padEnd(18), String(v.n).padStart(5), "calls", v.ms.toFixed(0).padStart(6), "ms  max", v.max.toFixed(0));
const big = events.filter((e) => e.name === "UpdateLayoutTree" && e.dur > 50000).slice(0, 5);
for (const e of big) console.log("style", (e.dur / 1000).toFixed(0), "ms elements:", e.args?.elementCount, e.args?.beginData?.stackTrace?.[0]?.url?.slice(-30) ?? "");
const lay = events.filter((e) => e.name === "Layout" && e.dur > 50000).slice(0, 5);
for (const e of lay) console.log("layout", (e.dur / 1000).toFixed(0), "ms dirty:", e.args?.beginData?.dirtyObjects, "/", e.args?.beginData?.totalObjects, e.args?.beginData?.stackTrace?.[0]?.functionName ?? "");
console.log("DOM nodes:", await page.evaluate(() => document.getElementsByTagName("*").length));
await browser.close();
