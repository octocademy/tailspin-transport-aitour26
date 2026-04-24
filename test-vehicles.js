const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  // Set viewport
  await page.setViewportSize({ width: 1280, height: 720 });
  
  console.log('1. Taking initial screenshot of vehicles page...');
  await page.goto('http://localhost:3000/vehicles');
  await page.waitForLoadState('networkidle');
  
  // Take initial screenshot and encode as base64
  const screenshot1 = await page.screenshot({ fullPage: true });
  console.log('Initial vehicles page screenshot (base64):');
  console.log(screenshot1.toString('base64'));
  console.log('\n' + '='.repeat(50) + '\n');
  
  console.log('2. Testing search functionality with "apex"...');
  // Find and type in search box
  const searchBox = page.locator('input[placeholder*="search"], input[type="search"], input[name*="search"], input[id*="search"]').first();
  await searchBox.fill('apex');
  await page.waitForTimeout(1000); // Wait for search results
  
  const screenshot2 = await page.screenshot({ fullPage: true });
  console.log('Search results for "apex" (base64):');
  console.log(screenshot2.toString('base64'));
  console.log('\n' + '='.repeat(50) + '\n');
  
  console.log('3. Clearing search and testing Sports category filter...');
  // Clear search
  await searchBox.clear();
  await page.waitForTimeout(500);
  
  // Look for Sports checkbox
  const sportsCheckbox = page.locator('input[type="checkbox"]').filter({ hasText: 'Sports' }).or(
    page.locator('label').filter({ hasText: 'Sports' }).locator('input[type="checkbox"]')
  ).first();
  await sportsCheckbox.check();
  await page.waitForTimeout(1000);
  
  const screenshot3 = await page.screenshot({ fullPage: true });
  console.log('Sports category filter applied (base64):');
  console.log(screenshot3.toString('base64'));
  console.log('\n' + '='.repeat(50) + '\n');
  
  console.log('4. Testing range filter...');
  // Uncheck sports first
  await sportsCheckbox.uncheck();
  await page.waitForTimeout(500);
  
  // Find min and max range inputs
  const minInput = page.locator('input[placeholder*="min"], input[name*="min"]').first();
  const maxInput = page.locator('input[placeholder*="max"], input[name*="max"]').first();
  
  await minInput.fill('500');
  await maxInput.fill('900');
  await page.waitForTimeout(1000);
  
  const screenshot4 = await page.screenshot({ fullPage: true });
  console.log('Range filter 500-900 applied (base64):');
  console.log(screenshot4.toString('base64'));
  console.log('\n' + '='.repeat(50) + '\n');
  
  console.log('5. Testing reset functionality...');
  // Find and click reset button
  const resetButton = page.locator('button').filter({ hasText: /reset/i }).first();
  await resetButton.click();
  await page.waitForTimeout(1000);
  
  const screenshot5 = await page.screenshot({ fullPage: true });
  console.log('After reset - full vehicle list (base64):');
  console.log(screenshot5.toString('base64'));
  
  await browser.close();
})();
