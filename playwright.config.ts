import { defineConfig } from "@playwright/test";

// Runs against a production build: `npm run build` first, then `npm run test:overlap`.
// Uses the installed Chrome, so no browser download is needed.
export default defineConfig({
  testDir: "./e2e",
  timeout: 180_000,
  fullyParallel: true,
  workers: 2,
  reporter: [["list"]],
  use: { baseURL: "http://localhost:3105", channel: "chrome" },
  webServer: { command: "npm run start -- -p 3105", url: "http://localhost:3105", reuseExistingServer: true, timeout: 60_000 },
});
