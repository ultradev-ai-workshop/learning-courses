import { defineConfig } from "@playwright/test";

const port = process.env.PORT ?? "3000";

export default defineConfig({
  testDir: "./e2e",
  use: { baseURL: `http://localhost:${port}`, channel: "chrome" },
  // Uncomment to let Playwright build and start the app itself:
  // webServer: { command: "npm run build && npm run start", url: "http://localhost:3000", reuseExistingServer: true },
});
