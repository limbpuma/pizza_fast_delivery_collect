import { test, expect } from '@playwright/test';

test.describe('Cookie Button Debug', () => {
  test('debug cookie settings button functionality', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Find the specific cookie button
    const cookieButton = page.locator('button:has-text("🍪 Cookie-Einstellungen")');
    
    console.log('🔍 Looking for cookie button...');
    const buttonCount = await cookieButton.count();
    console.log(`Found ${buttonCount} cookie buttons`);
    
    if (buttonCount > 0) {
      // Check if button is visible
      const isVisible = await cookieButton.isVisible();
      console.log(`Button visible: ${isVisible}`);
      
      // Check if button is enabled
      const isEnabled = await cookieButton.isEnabled();
      console.log(`Button enabled: ${isEnabled}`);
      
      // Get button attributes
      const buttonClass = await cookieButton.getAttribute('class');
      console.log(`Button class: ${buttonClass}`);
      
      const buttonType = await cookieButton.getAttribute('type');
      console.log(`Button type: ${buttonType}`);
      
      // Check for click handler
      const hasOnClick = await cookieButton.getAttribute('onclick');
      console.log(`Has onclick: ${hasOnClick || 'None'}`);
      
      // Try to click the button
      console.log('🖱️ Attempting to click cookie button...');
      try {
        await cookieButton.click();
        console.log('✅ Button clicked successfully');
        
        // Wait a moment to see if anything changes
        await page.waitForTimeout(2000);
        
        // Check if modal or settings panel opened
        const modal = page.locator('[role="dialog"], .modal, [class*="modal"]');
        const modalCount = await modal.count();
        console.log(`Modals found after click: ${modalCount}`);
        
        // Check for cookie settings content
        const settingsContent = page.locator('text=Cookie-Einstellungen, text=Cookie Settings, text=Notwendige Cookies');
        const settingsCount = await settingsContent.count();
        console.log(`Cookie settings content found: ${settingsCount}`);
        
        // Check current URL
        const currentUrl = page.url();
        console.log(`Current URL: ${currentUrl}`);
        
      } catch (error) {
        console.log(`❌ Error clicking button: ${error}`);
      }
      
    } else {
      console.log('❌ Cookie button not found');
      
      // Look for similar buttons
      const similarButtons = page.locator('button').filter({ hasText: /cookie|einstellungen/i });
      const similarCount = await similarButtons.count();
      console.log(`Similar buttons found: ${similarCount}`);
      
      if (similarCount > 0) {
        const buttonTexts = await similarButtons.allTextContents();
        console.log('Similar button texts:', buttonTexts);
      }
    }
    
    // Check for any JavaScript errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log(`JS Error: ${msg.text()}`);
      }
    });
  });

  test('check cookie button location in DOM', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Look for the button in footer
    const footerButton = page.locator('footer button:has-text("🍪 Cookie-Einstellungen")');
    const footerCount = await footerButton.count();
    console.log(`Cookie button in footer: ${footerCount}`);
    
    // Look for the button anywhere
    const anyButton = page.locator('button:has-text("🍪 Cookie-Einstellungen")');
    const anyCount = await anyButton.count();
    console.log(`Cookie button anywhere: ${anyCount}`);
    
    if (anyCount > 0) {
      // Get parent element info
      const parent = anyButton.locator('..');
      const parentClass = await parent.getAttribute('class');
      console.log(`Parent class: ${parentClass}`);
      
      // Get surrounding elements
      const siblings = parent.locator('button, a');
      const siblingCount = await siblings.count();
      console.log(`Sibling elements: ${siblingCount}`);
      
      if (siblingCount > 1) {
        const siblingTexts = await siblings.allTextContents();
        console.log('Sibling texts:', siblingTexts);
      }
    }
  });
});
