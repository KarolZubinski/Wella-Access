import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("should not have any automatically detectable WCAG A or AA violations", async ({
  page,
}, testInfo) => {
  await page.goto("https://www.wella.com/professional/en-EN");
  //   await page.goto('https://bbc.co.uk/');

  const accessibilityScanResults = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();

  await testInfo.attach("accessibility-scan-results", {
    body: JSON.stringify(accessibilityScanResults, null, 2),
    contentType: "application/json",
  });

  expect(accessibilityScanResults.violations).toEqual([]);
});
