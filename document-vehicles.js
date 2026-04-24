const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    // Navigate to vehicles page
    await page.goto('http://localhost:3000/vehicles');
    await page.waitForLoadState('networkidle');
    
    // Step 2: Type "apex" in search box
    console.log('Step 2: Typing "apex" in search box...');
    await page.fill('input[placeholder*="Search vehicles"]', 'apex');
    await page.waitForTimeout(1000); // Wait for search results
    await page.screenshot({ path: 'vehicles-02-search-apex.png', fullPage: true });
    
    // Step 3: Clear search and click Sports category
    console.log('Step 3: Clearing search and selecting Sports category...');
    await page.fill('input[placeholder*="Search vehicles"]', '');
    await page.waitForTimeout(500);
    await page.check('input[type="checkbox"][value="Sports"], label:has-text("Sports") input[type="checkbox"]');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'vehicles-03-category-sports.png', fullPage: true });
    
    // Step 4: Add price range filters
    console.log('Step 4: Adding price range filters...');
    // Try different possible selectors for range inputs
    const rangeSelectors = [
      'input[placeholder*="min"], input[placeholder*="Min"]',
      'input[type="number"]:first-of-type',
      '.filters input[type="number"]:first-of-type',
      '[data-testid*="min"] input, [data-testid*="range"] input:first-of-type'
    ];
    
    let minInput = null;
    for (const selector of rangeSelectors) {
      try {
        minInput = await page.locator(selector).first();
        if (await minInput.count() > 0) break;
      } catch (e) {
        continue;
      }
    }
    
    if (minInput && await minInput.count() > 0) {
      await minInput.fill('60');
    }
    
    const maxSelectors = [
      'input[placeholder*="max"], input[placeholder*="Max"]',
      'input[type="number"]:last-of-type',
      '.filters input[type="number"]:last-of-type',
      '[data-testid*="max"] input, [data-testid*="range"] input:last-of-type'
    ];
    
    let maxInput = null;
    for (const selector of maxSelectors) {
      try {
        maxInput = await page.locator(selector).last();
        if (await maxInput.count() > 0) break;
      } catch (e) {
        continue;
      }
    }
    
    if (maxInput && await maxInput.count() > 0) {
      await maxInput.fill('500');
    }
    
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'vehicles-04-range-filter.png', fullPage: true });
    
    // Step 5: Click Reset button
    console.log('Step 5: Clicking Reset button...');
    const resetSelectors = [
      'button:has-text("Reset")',
      'button:has-text("reset")',
      'button[type="reset"]',
      '.reset-button',
      '[data-testid*="reset"]'
    ];
    
    let resetClicked = false;
    for (const selector of resetSelectors) {
      try {
        const resetBtn = page.locator(selector);
        if (await resetBtn.count() > 0) {
          await resetBtn.click();
          resetClicked = true;
          break;
        }
      } catch (e) {
        continue;
      }
    }
    
    if (!resetClicked) {
      console.log('Reset button not found, trying to clear manually...');
      await page.uncheck('input[type="checkbox"]:checked');
      await page.fill('input[type="number"]', '');
    }
    
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'vehicles-05-reset.png', fullPage: true });
    
    console.log('All screenshots captured successfully!');
    
  } catch (error) {
    console.error('Error during automation:', error);
  } finally {
    await browser.close();
  }
})();
