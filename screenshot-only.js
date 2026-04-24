const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto('http://localhost:3000/vehicles', { waitUntil: 'networkidle' });
  
  // Take screenshot and save as base64
  const screenshot = await page.screenshot({ fullPage: true });
  console.log('SCREENSHOT_DATA:');
  console.log(screenshot.toString('base64'));
  
  await browser.close();
})();
