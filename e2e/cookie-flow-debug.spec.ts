import { test, expect } from '@playwright/test';

test.describe('Cookie Button Detailed Debug', () => {
  test('test complete cookie flow step by step', async ({ page }) => {
    console.log('🚀 Starting cookie flow test...');
    
    // Navigate to homepage
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    console.log('✅ Page loaded');
    
    // Check initial cookie banner state
    const initialBanner = page.locator('[class*="fixed"][class*="bottom"]').filter({ 
      hasText: /cookie|einstellungen|akzeptieren/i 
    });
    const initialBannerCount = await initialBanner.count();
    console.log(`Initial cookie banner count: ${initialBannerCount}`);
    
    if (initialBannerCount > 0) {
      console.log('🍪 Cookie banner is initially visible');
      
      // Try to accept cookies first to clear the banner
      const acceptButton = initialBanner.locator('button').filter({ 
        hasText: /akzeptieren|accept|alle/i 
      });
      
      if (await acceptButton.count() > 0) {
        console.log('🔄 Accepting cookies to clear initial banner...');
        await acceptButton.first().click();
        await page.waitForTimeout(1000);
      }
    }
    
    // Now test the footer button
    console.log('🔍 Looking for footer cookie button...');
    const footerButton = page.locator('footer button:has-text("🍪 Cookie-Einstellungen")');
    await expect(footerButton).toBeVisible();
    console.log('✅ Footer cookie button found and visible');
    
    // Take screenshot before click
    await page.screenshot({ path: 'before-cookie-click.png' });
    
    // Click the footer button
    console.log('🖱️ Clicking footer cookie button...');
    await footerButton.click();
    
    // Wait for any changes
    await page.waitForTimeout(2000);
    
    // Take screenshot after click
    await page.screenshot({ path: 'after-cookie-click.png' });
    
    // Check if banner appeared
    const bannerAfterClick = page.locator('[class*="fixed"][class*="bottom"]').filter({ 
      hasText: /cookie|einstellungen|akzeptieren/i 
    });
    const bannerAfterCount = await bannerAfterClick.count();
    console.log(`Cookie banner count after click: ${bannerAfterCount}`);
    
    if (bannerAfterCount > 0) {
      console.log('✅ Cookie banner appeared after clicking footer button');
      
      // Check banner content
      const bannerText = await bannerAfterClick.first().textContent();
      console.log(`Banner content: ${bannerText?.substring(0, 100)}...`);
      
      // Look for settings button in banner
      const settingsInBanner = bannerAfterClick.locator('button').filter({ 
        hasText: /einstellungen|settings|anpassen/i 
      });
      const settingsCount = await settingsInBanner.count();
      console.log(`Settings buttons in banner: ${settingsCount}`);
      
      if (settingsCount > 0) {
        console.log('🔧 Clicking settings button in banner...');
        await settingsInBanner.first().click();
        await page.waitForTimeout(2000);
        
        // Take screenshot after settings click
        await page.screenshot({ path: 'after-settings-click.png' });
        
        // Check for modal or settings panel
        const modal = page.locator('[role="dialog"], .modal, [class*="modal"], [class*="overlay"]');
        const modalCount = await modal.count();
        console.log(`Modals after settings click: ${modalCount}`);
        
        if (modalCount > 0) {
          console.log('✅ Settings modal opened');
          
          // Look for cookie categories
          const categories = page.locator('text').filter({ 
            hasText: /notwendig|funktional|analytisch|marketing|necessary|functional|analytics/i 
          });
          const categoryCount = await categories.count();
          console.log(`Cookie categories found: ${categoryCount}`);
          
          // Look for toggles/checkboxes
          const toggles = page.locator('input[type="checkbox"], button[role="switch"]');
          const toggleCount = await toggles.count();
          console.log(`Cookie toggles found: ${toggleCount}`);
        }
      }
      
    } else {
      console.log('❌ Cookie banner did not appear after clicking footer button');
      
      // Check console for errors
      const logs: string[] = [];
      page.on('console', msg => {
        logs.push(`${msg.type()}: ${msg.text()}`);
      });
      
      // Check for any visible modals
      const allModals = page.locator('[role="dialog"], .modal, [class*="modal"], [class*="overlay"], [class*="popup"]');
      const allModalCount = await allModals.count();
      console.log(`All modals found: ${allModalCount}`);
      
      if (allModalCount > 0) {
        for (let i = 0; i < allModalCount; i++) {
          const modalText = await allModals.nth(i).textContent();
          console.log(`Modal ${i + 1} content: ${modalText?.substring(0, 100)}...`);
        }
      }
    }
    
    console.log('🏁 Cookie flow test completed');
  });
});
