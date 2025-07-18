import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  use: {
    browserName: "chromium",
    headless: true,
  },
  reporter: [["html", { open: "on-failure" }]], // ← dodane
});
