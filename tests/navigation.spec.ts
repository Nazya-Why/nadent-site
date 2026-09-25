import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("nd-consent", JSON.stringify({ v: 1, analytics: false, marketing: false, at: Date.now() }));
  });
});

test("desktop mega menu opens with keyboard and closes with Escape", async ({ page, isMobile }) => {
  test.skip(isMobile, "desktop only");
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Послуги" });
  await trigger.focus();
  await page.keyboard.press("Enter");
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByRole("link", { name: /Імплантація/ }).first()).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(trigger).toBeFocused();
});

test("mobile menu opens as a dialog and navigates", async ({ page, isMobile }) => {
  test.skip(!isMobile, "mobile only");
  await page.goto("/");
  await page.getByRole("button", { name: "Відкрити меню" }).click();
  const menu = page.getByRole("dialog", { name: "Мобільна навігація" });
  await expect(menu).toBeVisible();
  await menu.getByRole("link", { name: /Болить зараз/ }).click();
  await page.waitForURL(/terminova-dopomoha/);
});

test("mobile action bar appears after the hero and offers messengers", async ({ page, isMobile }) => {
  test.skip(!isMobile, "mobile only");
  await page.goto("/");
  await page.mouse.wheel(0, 2400);
  await page.evaluate(() => window.scrollTo(0, 2400));
  const bar = page.getByRole("navigation", { name: "Мобільна навігація" }).last();
  await expect(bar.getByRole("link", { name: /Подзвонити/ })).toBeVisible();
  await bar.getByRole("button", { name: /Написати/ }).click();
  await expect(page.getByRole("dialog", { name: "Напишіть нам" }).getByRole("link", { name: /Telegram/ })).toBeVisible();
});

test("skip link moves focus to main content", async ({ page, isMobile }) => {
  test.skip(isMobile, "keyboard flow");
  await page.goto("/");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Перейти до основного вмісту" });
  await expect(skip).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#main$/);
});
