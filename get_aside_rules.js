const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  const asideRules = await page.evaluate(() => {
    const aside = document.querySelector('aside');
    return {
      outerHTML: aside ? aside.outerHTML : null,
      top: window.getComputedStyle(aside).top,
      position: window.getComputedStyle(aside).position,
    };
  });

  console.log('asideRules:', asideRules);
  await browser.close();
})();
