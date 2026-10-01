import { test, expect } from '@playwright/test';

// RULEBOOK §15: Playwright QA — mandatory after every build

test.describe('Borsillah Website QA', () => {
  
  test('01 — Hero section loads with correct heading', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible({ timeout: 10000 });
    await expect(h1).toContainText('Ambition');
  });

  test('02 — Progress rail is visible', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    const rail = page.locator('.progress-rail');
    await expect(rail).toBeVisible();
  });

  test('03 — All 13 sections exist in DOM', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    for (let i = 1; i <= 13; i++) {
      const section = page.locator(`[data-section="${String(i).padStart(2, '0')}"]`);
      await expect(section).toBeAttached();
    }
  });

  test('04 — Product images load (no broken src)', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    const images = page.locator('img');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const src = await images.nth(i).getAttribute('src');
      expect(src).toBeTruthy();
    }
  });

  test('05 — Scroll through sections', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    await page.waitForTimeout(1000);
    const visionSection = page.locator('#vision');
    await expect(visionSection).toBeAttached();
  });

  test('06 — Mobile viewport renders correctly', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('http://localhost:3000/');
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible({ timeout: 10000 });
    // top-meta should be hidden on mobile
    const topMeta = page.locator('.top-meta');
    await expect(topMeta).toHaveCSS('display', 'none');
  });

  test('07 — Footer renders with BORSILLAH brand name', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    const footer = page.locator('.footer-brand');
    await expect(footer).toContainText('BORSILLAH');
  });
});
