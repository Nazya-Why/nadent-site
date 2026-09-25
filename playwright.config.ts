import { defineConfig, devices } from "@playwright/test";

/** E2E tests run against the static export (`npm run build` first). */
export default defineConfig({
  testDir: "./tests",
  timeout: 30_000,
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"]],
  use: {
    baseURL: "http://localhost:4322",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "node scripts/serve.mjs 4322",
    port: 4322,
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
});
