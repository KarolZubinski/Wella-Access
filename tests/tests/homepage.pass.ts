import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'fs';
import path from 'path';
import { createHtmlReport } from 'axe-html-reporter';

test.only('a11y report with screenshot + HTML dump', async ({ page }, testInfo) => {
  await page.goto('https://www.wella.com/professional/en-EN');

    // Kliknij baner cookies (jeśli widoczny)
  const cookieAcceptBtn = page.locator('#onetrust-accept-btn-handler');
  if (await cookieAcceptBtn.isVisible()) {
    await cookieAcceptBtn.click();
    await page.waitForTimeout(1000); // poczekaj chwilę na zniknięcie banera
  }

  const results = await new AxeBuilder({ page }).analyze();

const reportDir = 'axe-reports';
fs.mkdirSync(reportDir, { recursive: true });

const htmlReportPath = path.join(reportDir, 'report.html');
createHtmlReport({
  results,
  options: {
    outputDir: reportDir,
    reportFileName: 'report.html',
  },
});

const screenshotPath = path.join(reportDir, 'page.png');
await page.screenshot({ path: screenshotPath, fullPage: true });

const htmlDumpPath = path.join(reportDir, 'page.html');
const htmlContent = await page.content();
fs.writeFileSync(htmlDumpPath, htmlContent);

// Zaloguj błędy
for (const v of results.violations) {
  console.log(`❌ ${v.help}: ${v.helpUrl}`);
  for (const node of v.nodes) {
    console.log(`→ ${node.html}`);
  }
}

// Załączniki Playwright
testInfo.attach('a11y-report', { path: htmlReportPath, contentType: 'text/html' });
testInfo.attach('screenshot', { path: screenshotPath, contentType: 'image/png' });
testInfo.attach('page-html', { path: htmlDumpPath, contentType: 'text/html' });

// Ostrzeżenie, jeśli są błędy
if (results.violations.length > 0) {
  console.warn(`🔎 Found ${results.violations.length} accessibility issues. See HTML report for details.`);
}
  // expect(results.violations.length).toBe(0);
  });
