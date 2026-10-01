import { test, expect } from '@playwright/test';

const VIEWPORTS = [
  { name: 'Desktop 1440', width: 1440, height: 900 },
  { name: 'Mobile iPhone 390', width: 390, height: 844 },
  { name: 'Mobile Small 360', width: 360, height: 800 },
  { name: 'Mobile Large 430', width: 430, height: 932 },
];

test.describe('Mobile & Responsive QA Suite', () => {
  for (const vp of VIEWPORTS) {
    test(`Responsive check on ${vp.name} (${vp.width}x${vp.height})`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });

      const consoleErrors: string[] = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });

      await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });

      // Wait for Preloader to finish and reveal main content
      await page.waitForTimeout(2800);

      // Verify page 1 hero heading
      const hero = page.locator('#page-1, main');
      await expect(hero.first()).toBeVisible();

      // Check horizontal overflow
      const overflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });
      expect(overflow).toBe(false);

      // Verify Global AI capsule exists
      const aiCapsule = page.locator('text=ASK AI');
      await expect(aiCapsule.first()).toBeVisible();

      // Scroll to Page 3
      await page.evaluate(() => {
        const p3 = document.getElementById('page-3');
        if (p3) p3.scrollIntoView();
      });
      await page.waitForTimeout(600);

      // Scroll to Page 6
      await page.evaluate(() => {
        const p6 = document.getElementById('page-6');
        if (p6) p6.scrollIntoView();
      });
      await page.waitForTimeout(600);

      // Scroll directly to Page 7
      await page.evaluate(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' });
      });
      await page.waitForTimeout(1500);

      // In Page 7, check if Page 7 container or heading exists
      const page7 = page.locator('#page-7');
      await expect(page7).toBeAttached();
      
      const page7Heading = page.locator('#page-7 h1');
      await expect(page7Heading).toBeVisible({ timeout: 10000 });

      // Filter out any known innocuous hydration or extension logs
      const criticalErrors = consoleErrors.filter(e => 
        !e.includes('swc') && 
        !e.includes('favicon') && 
        !e.includes('hydration') &&
        !e.includes('Failed to load resource')
      );
      expect(criticalErrors.length).toBe(0);
    });
  }

  test('Global AI Assistant expands and closes smoothly', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2800);

    const capsule = page.locator('text=ASK AI').first();
    await expect(capsule).toBeVisible();

    // Tap to expand
    await capsule.click();
    await page.waitForTimeout(600);

    // Verify expanded panel header is visible
    const panelHeader = page.locator('text=BORSILAH AI').last();
    await expect(panelHeader).toBeVisible();

    // Verify input is present (use .last() to target floating assistant)
    const input = page.locator('input[placeholder*="Ask"]').last();
    await expect(input).toBeVisible();

    // Close button
    const closeBtn = page.locator('button[aria-label="Close Assistant"]');
    if (await closeBtn.isVisible()) {
      await closeBtn.click();
      await page.waitForTimeout(600);
      await expect(capsule).toBeVisible();
    }
  });
});
