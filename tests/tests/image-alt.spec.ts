import { test, expect } from '@playwright/test';

test.describe('Każdy <img> musi mieć alt z treścią (nie pusty)', () => {
  test('Sprawdza brak lub pusty alt', async ({ page }) => {
    await page.goto('https://www.wella.com/professional/en-EN/home'); // <- podmień na swoją stronę

    const imagesWithoutAltText = await page.$$eval('img', imgs =>
      imgs.filter(img =>
        !img.hasAttribute('alt') ||
        img.getAttribute('alt') === null ||
        img.getAttribute('alt')?.trim().length === 0
      )
      .map(img => img.outerHTML)
    );

    if (imagesWithoutAltText.length > 0) {
      console.log('\n🛑 Obrazki bez alt lub z pustym alt:');
      imagesWithoutAltText.forEach(html => console.log(`➡️  ${html}`));
    } else {
      console.log('✅ Wszystkie obrazki mają niepusty alt.');
    }

    expect(imagesWithoutAltText.length).toBe(0);
  });
});
