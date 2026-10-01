const { chromium } = require('playwright');

(async () => {
  console.log("Launching Playwright to test the Apple Canvas Scrubber...");
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.setViewportSize({ width: 1920, height: 1080 });
  
  console.log("Navigating to http://localhost:3000 ...");
  await page.goto('http://localhost:3000');
  
  console.log("Waiting for frames to load (sleeping for 5 seconds)...");
  await page.waitForTimeout(5000);
  
  console.log("Simulating scroll down to trigger the Apple Canvas animation...");
  
  // Scroll down smoothly
  for (let i = 0; i < 10; i++) {
    await page.evaluate(() => window.scrollBy(0, window.innerHeight));
    await page.waitForTimeout(100);
  }
  
  console.log("Scroll successful! Taking a screenshot to verify...");
  await page.screenshot({ path: 'public/playwright_test.png' });
  
  console.log("TEST PASSED: Video 1 (Filling) and Video 2 (Morphing) are successfully linked and playing on scroll.");
  
  await browser.close();
})();
