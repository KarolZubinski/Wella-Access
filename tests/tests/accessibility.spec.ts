import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'fs';
import path from 'path';
import { createHtmlReport } from 'axe-html-reporter';

test('a11y report with screenshot + HTML dump', async ({ page }, testInfo) => {
  await page.goto('https://www.wella.com/professional/en-EN');

  const results = await new AxeBuilder({ page }).analyze();

  const reportDir = path.resolve('axe-reports');
  fs.mkdirSync(reportDir, { recursive: true });

  const htmlReportPath = path.join(reportDir, 'report.html');
  createHtmlReport({
    results,
    options: {
      outputDir: reportDir,
      reportFileName: 'report.html',
      reportTitle: 'Playwright Accessibility Report',
    },
  });

  // Zrzut ekranu
  const screenshotPath = path.join(reportDir, 'page.png');
  await page.screenshot({ path: screenshotPath, fullPage: true });

  // Dump HTML
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

  // Dodaj załączniki do raportu Playwright
  testInfo.attach('a11y-report', { path: htmlReportPath, contentType: 'text/html' });
  testInfo.attach('screenshot', { path: screenshotPath, contentType: 'image/png' });
  testInfo.attach('page-html', { path: htmlDumpPath, contentType: 'text/html' });

  expect(results.violations.length).toBe(0);
});
