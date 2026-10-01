const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  const ancestors = await page.evaluate(() => {
    const aside = document.querySelector('aside');
    let el = aside.parentElement;
    const list = [];
    while (el) {
      const s = window.getComputedStyle(el);
      list.push({
        tag: el.tagName,
        id: el.id,
        className: el.className,
        transform: s.transform,
        filter: s.filter,
        perspective: s.perspective,
        position: s.position,
        height: s.height,
        scrollHeight: el.scrollHeight,
      });
      el = el.parentElement;
    }
    return list;
  });

  console.log('Ancestors:', JSON.stringify(ancestors, null, 2));
  await browser.close();
})();
