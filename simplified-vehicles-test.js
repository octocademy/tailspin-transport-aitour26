const { chromium } = require('playwright');

(async () => {
  let browser;
  let page;
  
  try {
    console.log('Launching browser...');
    browser = await chromium.launch({ headless: true });
    page = await browser.newPage();
    
    // Set viewport
    await page.setViewportSize({ width: 1280, height: 720 });
    
    console.log('\n=== TEST 1: Initial vehicles page ===');
    await page.goto('http://localhost:3000/vehicles', { waitUntil: 'networkidle' });
    console.log('✓ Page loaded successfully');
    
    // Check if search box exists
    const searchBox = await page.locator('input[placeholder*="search" i], input[type="search"], input[name*="search"], .search input').first();
    const hasSearchBox = await searchBox.count() > 0;
    console.log(`✓ Search box found: ${hasSearchBox}`);
    
    // Check if vehicle cards exist
    const vehicleCards = await page.locator('.vehicle, .card, [data-testid*="vehicle"]').count();
    console.log(`✓ Vehicle cards found: ${vehicleCards}`);
    
    console.log('\n=== TEST 2: Search functionality ===');
    if (hasSearchBox) {
      await searchBox.fill('apex');
      await page.waitForTimeout(1000);
      const resultsAfterSearch = await page.locator('.vehicle, .card, [data-testid*="vehicle"]').count();
      console.log(`✓ Search for "apex" - Results: ${resultsAfterSearch} (was ${vehicleCards})`);
    }
    
    console.log('\n=== TEST 3: Category filter ===');
    await searchBox.clear();
    await page.waitForTimeout(500);
    
    // Look for Sports checkbox
    const sportsCheckbox = await page.locator('input[type="checkbox"] + label:has-text("Sports"), label:has-text("Sports") input[type="checkbox"]').first();
    const hasSportsFilter = await sportsCheckbox.count() > 0;
    console.log(`✓ Sports category filter found: ${hasSportsFilter}`);
    
    if (hasSportsFilter) {
      await sportsCheckbox.check();
      await page.waitForTimeout(1000);
      const resultsAfterFilter = await page.locator('.vehicle, .card, [data-testid*="vehicle"]').count();
      console.log(`✓ Sports filter applied - Results: ${resultsAfterFilter}`);
    }
    
    console.log('\n=== TEST 4: Range filter ===');
    if (hasSportsFilter) {
      await sportsCheckbox.uncheck();
      await page.waitForTimeout(500);
    }
    
    // Look for price range inputs
    const minInput = await page.locator('input[placeholder*="min" i], input[name*="min"], .min input, input:near(:text("min"))').first();
    const maxInput = await page.locator('input[placeholder*="max" i], input[name*="max"], .max input, input:near(:text("max"))').first();
    
    const hasMinInput = await minInput.count() > 0;
    const hasMaxInput = await maxInput.count() > 0;
    console.log(`✓ Min range input found: ${hasMinInput}`);
    console.log(`✓ Max range input found: ${hasMaxInput}`);
    
    if (hasMinInput && hasMaxInput) {
      await minInput.fill('500');
      await maxInput.fill('900');
      await page.waitForTimeout(1000);
      const resultsAfterRange = await page.locator('.vehicle, .card, [data-testid*="vehicle"]').count();
      console.log(`✓ Range filter 500-900 applied - Results: ${resultsAfterRange}`);
    }
    
    console.log('\n=== TEST 5: Reset functionality ===');
    const resetButton = await page.locator('button:has-text("Reset"), button:has-text("Clear"), .reset').first();
    const hasReset = await resetButton.count() > 0;
    console.log(`✓ Reset button found: ${hasReset}`);
    
    if (hasReset) {
      await resetButton.click();
      await page.waitForTimeout(1000);
      const finalResults = await page.locator('.vehicle, .card, [data-testid*="vehicle"]').count();
      console.log(`✓ Reset clicked - Final results: ${finalResults}`);
    }
    
    console.log('\n=== SUMMARY ===');
    console.log('✅ Vehicle page loaded successfully');
    console.log(`✅ Search functionality: ${hasSearchBox ? 'FOUND' : 'NOT FOUND'}`);
    console.log(`✅ Category filters: ${hasSportsFilter ? 'FOUND' : 'NOT FOUND'}`);
    console.log(`✅ Range filters: ${hasMinInput && hasMaxInput ? 'FOUND' : 'NOT FOUND'}`);
    console.log(`✅ Reset button: ${hasReset ? 'FOUND' : 'NOT FOUND'}`);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
})();
