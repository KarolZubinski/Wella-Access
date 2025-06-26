import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Test obrazków bez alt', () => {
  test.only('Wszystkie <img> mają atrybut alt', async ({ page }) => {
    await page.goto('https://www.wella.com/professional/en-EN'); // <- Zmień na własną stronę

    const results = await new AxeBuilder({ page })
      .include('body') // testujemy tylko body strony
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    const altViolations = results.violations.filter(v => v.id === 'image-alt');

    if (altViolations.length > 0) {
      console.log('\n🛑 Znaleziono obrazki bez atrybutu alt:');
      altViolations.forEach(v => {
        v.nodes.forEach(node => {
          console.log(`➡️  ${node.html}`);
        });
      });
    } else {
      console.log('✅ Wszystkie obrazki mają atrybut alt.');
    }

    expect(altViolations.length).toBe(0);
  });
});
