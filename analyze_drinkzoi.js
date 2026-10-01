const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  console.log("Navigating to drinkzoi.co...");
  await page.goto('https://drinkzoi.co', { waitUntil: 'networkidle', timeout: 60000 });
  
  console.log("Taking screenshot...");
  await page.screenshot({ path: 'zoi_screenshot.png', fullPage: false });

  console.log("Analyzing page technologies...");
  const tech = await page.evaluate(() => {
    return {
      hasPixi: !!window.PIXI,
      hasThree: !!window.THREE,
      hasCurtains: !!window.Curtains,
      hasOgl: !!window.ogl || !!window.OGL,
      hasCanvas: document.querySelectorAll('canvas').length > 0,
      canvasDetails: Array.from(document.querySelectorAll('canvas')).map(c => ({
         id: c.id, 
         className: c.className, 
         style: c.getAttribute('style')
      })),
      bodyHtml: document.body.innerHTML.substring(0, 1500) // snippet
    };
  });
  
  console.log(JSON.stringify(tech, null, 2));
  
  // Try to find the hero section or the specific text "THE ULTIMATE ICED TEA"
  const heroText = await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('*')).find(e => e.textContent && e.textContent.includes('THE ULTIMATE ICED TEA'));
    return el ? el.outerHTML : 'Not found';
  });
  
  console.log("Hero Text HTML:", heroText);

  await browser.close();
})();
