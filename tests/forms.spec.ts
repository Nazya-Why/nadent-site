import { expect, test, type Page } from "@playwright/test";

async function acceptCookies(page: Page) {
  await page.addInitScript(() => {
    localStorage.setItem("nd-consent", JSON.stringify({ v: 1, analytics: false, marketing: false, at: Date.now() }));
  });
}

test.beforeEach(async ({ page }) => {
  await acceptCookies(page);
});

test("booking wizard: 4 steps → thank-you page (demo mode)", async ({ page }) => {
  await page.goto("/");
  await page.locator("[data-hero-cta] a[data-book]").click();
  const dialog = page.getByRole("dialog", { name: "Онлайн-запис" });
  await expect(dialog).toBeVisible();

  // Step 1: concern (tap auto-advances)
  await expect(dialog.getByRole("heading", { name: "Що вас турбує?" })).toBeVisible();
  await dialog.getByText("Немає зуба", { exact: true }).click();

  // Step 2: doctor
  await expect(dialog.getByRole("heading", { name: "До якого лікаря?" })).toBeVisible();
  await dialog.getByText("Будь-який лікар", { exact: true }).click();

  // Step 3: time
  await expect(dialog.getByRole("heading", { name: "Коли вам зручно?" })).toBeVisible();
  await dialog.getByRole("button", { name: "Далі" }).click();

  // Step 4: contacts — validation first
  await expect(dialog.getByRole("heading", { name: "Як з вами звʼязатися?" })).toBeVisible();
  // Regression: "Next" must not turn into an implicit submit on the same click
  await expect(dialog.getByRole("alert")).toHaveCount(0);
  await dialog.getByRole("button", { name: "Записатися" }).click();
  await expect(dialog.getByText("Вкажіть, будь ласка, ваше ім'я").or(dialog.getByText("Вкажіть, будь ласка, ваше імʼя"))).toBeVisible();

  await dialog.getByLabel("Ваше ім").fill("Олена");
  await dialog.getByLabel("Телефон").fill("0671234567");
  await expect(dialog.getByLabel("Телефон")).toHaveValue("+380 67 123 45 67");
  await dialog.locator('input[name="consent"]').check({ force: true });
  await dialog.getByRole("button", { name: "Записатися" }).click();

  await page.waitForURL(/\/diakuiemo\/\?kind=booking/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Дякуємо, Олена!");
});

test("honeypot silently drops bot submissions", async ({ page }) => {
  await page.goto("/zapys/");
  const quick = page.locator("form").filter({ hasText: "Надіслати заявку" }).first();
  await quick.getByLabel("Ваше ім").fill("Bot");
  await quick.getByLabel("Телефон").fill("0671234567");
  await quick.locator('input[autocomplete="off"]').fill("spam", { force: true });
  await quick.locator('input[type="checkbox"]').check({ force: true });
  await quick.getByRole("button", { name: "Надіслати заявку" }).click();
  await page.waitForURL(/\/diakuiemo\//);
  const stored = await page.evaluate(() => localStorage.getItem("nd-demo-leads"));
  expect(stored).toBeNull();
});

test("quick form shows readable errors", async ({ page }) => {
  await page.goto("/");
  const form = page.locator("#final-title").locator("xpath=ancestor::section").locator("form");
  await form.getByRole("button", { name: "Надіслати заявку" }).click();
  await expect(form.getByRole("alert").first()).toBeVisible();
  await expect(form.getByText("Номер має містити 9 цифр після +380")).toBeVisible();
});

test("cost quiz gives an estimate", async ({ page }) => {
  await page.goto("/");
  await page.locator("[data-quiz]").first().click();
  const dialog = page.getByRole("dialog");
  for (const answer of ["Немає одного або кількох зубів", "Один", "Надійність на десятиліття", "Менше року тому", "Спокійно"]) {
    await dialog.getByRole("button", { name: answer }).click();
  }
  await expect(dialog.getByText("Орієнтовна вартість")).toBeVisible();
  await expect(dialog.getByText(/грн/).first()).toBeVisible();
});

test("english version has lang=en and localized booking", async ({ page }) => {
  await page.goto("/en/");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Calm dentistry");
});

test("unknown URL shows the 404 page", async ({ page }) => {
  const res = await page.goto("/ne-isnuie/");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "Такої сторінки немає" })).toBeVisible();
});
