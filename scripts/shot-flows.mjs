// Visual QA: screenshots of interactive states (booking sheet, quiz result, mega menu, mobile menu).
import { chromium, devices } from "@playwright/test";
const out = process.argv[2];
const base = process.env.SHOT_BASE ?? "http://localhost:4321";
const browser = await chromium.launch();
const seed = (p) => p.addInitScript(() => localStorage.setItem("nd-consent", JSON.stringify({ v: 1, analytics: false, marketing: false, at: Date.now() })));

for (const [label, ctxOpts] of [["desk", { viewport: { width: 1440, height: 900 } }], ["mob", { ...devices["iPhone 13"] }]]) {
  const ctx = await browser.newContext({ ...ctxOpts, colorScheme: "light" });
  const page = await ctx.newPage();
  await seed(page);
  await page.goto(base + "/", { waitUntil: "networkidle" });
  await page.locator("[data-hero-cta] a[data-book]").click();
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${out}/${label}-book1.png` });
  await page.getByRole("dialog").getByText("Хочу білі зуби", { exact: true }).click();
  await page.waitForTimeout(700);
  await page.screenshot({ path: `${out}/${label}-book2.png` });
  await page.getByRole("dialog").getByText("Будь-який лікар", { exact: true }).click();
  await page.waitForTimeout(700);
  await page.screenshot({ path: `${out}/${label}-book3.png` });
  await page.getByRole("dialog").getByRole("button", { name: "Далі" }).click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${out}/${label}-book4.png` });
  await page.keyboard.press("Escape");
  await page.waitForTimeout(600);
  await page.locator("[data-quiz]").first().click();
  for (const a of ["Колір або форма зубів", "4 і більше", "Максимальна естетика", "Більше 3 років тому", "Дуже страшно"]) {
    await page.getByRole("dialog").getByRole("button", { name: a }).click();
    await page.waitForTimeout(250);
  }
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${out}/${label}-quiz.png` });
  await page.keyboard.press("Escape");
  await page.waitForTimeout(500);
  if (label === "desk") {
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.getByRole("button", { name: "Послуги" }).click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${out}/${label}-mega.png` });
  } else {
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(300);
    await page.getByRole("button", { name: "Відкрити меню" }).click();
    await page.waitForTimeout(700);
    await page.screenshot({ path: `${out}/${label}-menu.png` });
  }
  await ctx.close();
}
await browser.close();
console.log("done");
