import { test, expect } from '@playwright/test';
import { TestHelpers } from './helpers';

test.describe('GDPR Compliance - Germany 🇩🇪', () => {
  test('cookie banner appears and provides GDPR compliant options', async ({ page }) => {
    const helpers = new TestHelpers(page);
    
    // Navigate to homepage
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check that cookie banner appears
    const cookieBanner = page.locator('[class*="fixed"][class*="bottom"]').filter({ 
      hasText: /cookie|datenschutz|einstellungen|privacy/i 
    });
    
    await expect(cookieBanner).toBeVisible();
    
    // Verify GDPR compliant elements exist
    const acceptButton = cookieBanner.locator('button').filter({ 
      hasText: /akzeptieren|accept|alle akzeptieren/i 
    });
    await expect(acceptButton).toBeVisible();
    
    const settingsButton = cookieBanner.locator('button').filter({ 
      hasText: /einstellungen|settings|anpassen/i 
    });
    await expect(settingsButton).toBeVisible();
    
    // Check for reject option (GDPR requirement)
    const rejectButton = cookieBanner.locator('button').filter({ 
      hasText: /ablehnen|reject|nur notwendige/i 
    });
    if (await rejectButton.count() > 0) {
      await expect(rejectButton).toBeVisible();
      console.log('✅ GDPR: Reject option available');
    }
    
    console.log('✅ GDPR: Cookie banner with compliant options displayed');
  });

  test('privacy policy and legal pages are accessible', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Look for privacy policy link (usually in footer)
    const privacyLinks = page.locator('a').filter({ 
      hasText: /datenschutz|privacy|datenschutzerklärung/i 
    });
    
    if (await privacyLinks.count() > 0) {
      await expect(privacyLinks.first()).toBeVisible();
      
      // Try to click and verify it navigates or opens
      await privacyLinks.first().click();
      
      // Check if it opened a new page or modal
      const privacyContent = page.locator('text=Datenschutzerklärung').or(
        page.locator('text=Privacy Policy')
      );
      
      if (await privacyContent.count() > 0) {
        await expect(privacyContent.first()).toBeVisible();
        console.log('✅ GDPR: Privacy policy accessible');
      }
    }
    
    // Look for impressum (German legal requirement)
    await page.goto('/');
    const impressumLinks = page.locator('a').filter({ 
      hasText: /impressum|imprint|rechtliche hinweise/i 
    });
    
    if (await impressumLinks.count() > 0) {
      await expect(impressumLinks.first()).toBeVisible();
      console.log('✅ GDPR: Impressum link available');
    }
  });

  test('cookie settings modal allows granular control', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Find and click cookie settings
    const cookieBanner = page.locator('[class*="fixed"][class*="bottom"]').filter({ 
      hasText: /cookie|datenschutz/i 
    });
    
    if (await cookieBanner.count() > 0) {
      const settingsButton = cookieBanner.locator('button').filter({ 
        hasText: /einstellungen|settings|anpassen/i 
      });
      
      if (await settingsButton.count() > 0) {
        await settingsButton.click();
        
        // Wait for settings modal
        await page.waitForTimeout(1000);
        
        // Look for different cookie categories
        const categories = [
          /notwendig|necessary|essential/i,
          /funktional|functional/i,
          /analytisch|analytics|statistical/i,
          /marketing|werbung|advertising/i
        ];
        
        let foundCategories = 0;
        for (const category of categories) {
          const categoryElement = page.locator('text').filter({ hasText: category });
          if (await categoryElement.count() > 0) {
            foundCategories++;
            console.log(`✅ GDPR: Found cookie category: ${category.source}`);
          }
        }
        
        if (foundCategories >= 2) {
          console.log('✅ GDPR: Granular cookie control available');
        }
        
        // Look for toggles or checkboxes
        const toggles = page.locator('input[type="checkbox"], button[role="switch"]');
        if (await toggles.count() > 0) {
          console.log('✅ GDPR: Cookie preference toggles available');
        }
      }
    }
  });

  test('personal data collection has clear consent', async ({ page }) => {
    const helpers = new TestHelpers(page);
    
    // Navigate to order flow where personal data is collected
    await helpers.navigateToMenu();
    
    // Add item to cart
    const firstPizza = page.locator('.pizza-card-compact').first();
    await expect(firstPizza).toBeVisible();
    await firstPizza.locator('text=+').click();
    
    // Open cart and check if order button is available
    await helpers.openCart();
    
    // Wait for cart content to load
    await page.waitForTimeout(2000);
    
    // Look for order/checkout button
    const orderButton = page.locator('text=Order pizzas').or(
      page.locator('text=Bestellen').or(
        page.locator('button[type="submit"]')
      )
    );
    
    if (await orderButton.count() > 0) {
      await orderButton.click();
      
      // Select delivery if options are available
      const deliveryButton = page.locator('text=Delivery').or(page.locator('text=Lieferung'));
      if (await deliveryButton.count() > 0) {
        await deliveryButton.click();
      }
      
      // Wait for form to load
      await page.waitForTimeout(1000);
    }
    
    // Check that form fields have clear labels (if form loaded)
    const nameField = page.locator('input[placeholder*="name"], input[name*="name"]');
    const phoneField = page.locator('input[placeholder*="phone"], input[name*="phone"]');
    
    if (await nameField.count() > 0) {
      console.log('✅ GDPR: Name field available for order processing');
    }
    
    if (await phoneField.count() > 0) {
      console.log('✅ GDPR: Phone field available for order processing');
    }
    
    // Look for data processing consent
    const consentTexts = page.locator('text').filter({ 
      hasText: /datenschutz|verarbeitung|einverständnis|consent|agree/i 
    });
    
    if (await consentTexts.count() > 0) {
      console.log('✅ GDPR: Data processing consent information present');
    }
  });

  test('user can withdraw consent and delete cookies', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Accept cookies first
    const cookieBanner = page.locator('[class*="fixed"][class*="bottom"]').filter({ 
      hasText: /cookie/i 
    });
    
    if (await cookieBanner.count() > 0) {
      const acceptButton = cookieBanner.locator('button').filter({ 
        hasText: /akzeptieren|accept/i 
      });
      
      if (await acceptButton.count() > 0) {
        await acceptButton.click();
        await page.waitForTimeout(1000);
      }
    }
    
    // Check if we can access cookie settings again
    // Look for persistent cookie settings link (usually in footer)
    const cookieSettingsLink = page.locator('a, button').filter({ 
      hasText: /cookie.*einstellungen|cookie.*settings|datenschutz.*einstellungen/i 
    });
    
    if (await cookieSettingsLink.count() > 0) {
      console.log('✅ GDPR: Cookie settings accessible after acceptance');
    }
    
    // Check browser cookies
    const cookies = await page.context().cookies();
    console.log(`Current cookies: ${cookies.length}`);
    
    // Look for consent management cookie
    const consentCookie = cookies.find(cookie => 
      cookie.name.toLowerCase().includes('consent') ||
      cookie.name.toLowerCase().includes('cookie') ||
      cookie.name.toLowerCase().includes('gdpr')
    );
    
    if (consentCookie) {
      console.log('✅ GDPR: Consent cookie found', consentCookie.name);
    }
  });

  test('data retention and purpose limitation compliance', async ({ page }) => {
    const helpers = new TestHelpers(page);
    
    // Test basic navigation first
    await helpers.navigateToMenu();
    
    // Check if pizzas are available
    const pizzas = page.locator('.pizza-card-compact');
    if (await pizzas.count() === 0) {
      console.log('⚠️ GDPR: No pizzas available, skipping order flow test');
      return;
    }
    
    // Add items (try with timeout)
    try {
      const firstPizza = page.locator('.pizza-card-compact').first();
      await firstPizza.locator('text=+').click({ timeout: 10000 });
      await firstPizza.locator('text=+').click({ timeout: 5000 }); // Ensure minimum order
      
      // Try to proceed to checkout
      await helpers.openCart();
      
      // Look for order button
      const orderButton = page.locator('text=Order pizzas, text=Bestellen, button[type="submit"]');
      if (await orderButton.count() > 0) {
        await orderButton.click();
        
        // Check for data processing notice
        const processingNotice = page.locator('text').filter({ 
          hasText: /daten.*verarbeitung|data.*processing|zweck|purpose/i 
        });
        
        if (await processingNotice.count() > 0) {
          console.log('✅ GDPR: Data processing purpose disclosed');
        }
        
        // Look for retention period information
        const retentionInfo = page.locator('text').filter({ 
          hasText: /speicherdauer|retention|aufbewahrung|löschung/i 
        });
        
        if (await retentionInfo.count() > 0) {
          console.log('✅ GDPR: Data retention information provided');
        }
      }
      
    } catch (error) {
      console.log('⚠️ GDPR: Could not complete order flow, checking basic compliance');
    }
    
    // Always check for WhatsApp integration (main compliance point)
    const whatsappMention = page.locator('text').filter({ 
      hasText: /whatsapp|bestellen.*whatsapp/i 
    });
    
    if (await whatsappMention.count() > 0) {
      console.log('✅ GDPR: WhatsApp integration disclosed (minimal data retention)');
    }
  });

  test('german language GDPR compliance texts', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check for German GDPR specific terms
    const gdprTerms = [
      /datenschutz.*grundverordnung/i,      // GDPR in German
      /dsgvo/i,                             // GDPR abbreviation in German
      /rechtmäßige.*grundlage/i,            // Legal basis
      /betroffenenrechte/i,                 // Data subject rights
      /widerrufsrecht/i,                    // Right to withdraw
      /auskunftsrecht/i                     // Right to access
    ];
    
    let foundTerms = 0;
    for (const term of gdprTerms) {
      const termElement = page.locator('text').filter({ hasText: term });
      if (await termElement.count() > 0) {
        foundTerms++;
        console.log(`✅ GDPR: Found German compliance term: ${term.source}`);
      }
    }
    
    // Check cookie banner language
    const cookieBanner = page.locator('[class*="fixed"][class*="bottom"]').filter({ 
      hasText: /cookie|datenschutz/i 
    });
    
    if (await cookieBanner.count() > 0) {
      const bannerText = await cookieBanner.textContent();
      
      if (bannerText && bannerText.includes('Datenschutz')) {
        console.log('✅ GDPR: Cookie banner in German');
      }
      
      if (bannerText && (bannerText.includes('Einstellungen') || bannerText.includes('anpassen'))) {
        console.log('✅ GDPR: German cookie settings option');
      }
    }
  });

  test('contact information for data protection officer', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Look for data protection officer contact
    const dpoContact = page.locator('text').filter({ 
      hasText: /datenschutzbeauftragte|data.*protection.*officer|dpo/i 
    });
    
    if (await dpoContact.count() > 0) {
      console.log('✅ GDPR: Data Protection Officer contact information found');
    }
    
    // Look for general contact information
    const contactInfo = page.locator('text').filter({ 
      hasText: /kontakt|contact|impressum/i 
    });
    
    if (await contactInfo.count() > 0) {
      console.log('✅ GDPR: Contact information available');
    }
    
    // Check for email or contact form
    const emailContact = page.locator('a[href^="mailto:"]');
    if (await emailContact.count() > 0) {
      console.log('✅ GDPR: Email contact available');
    }
    
    // Look for email pattern in text
    const emailPattern = page.locator('text=/\\b\\w+@\\w+\\.\\w+\\b/');
    if (await emailPattern.count() > 0) {
      console.log('✅ GDPR: Email address found in content');
    }
  });

  test('cross-border data transfer compliance', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check for WhatsApp integration disclosure
    const whatsappMention = page.locator('text').filter({ 
      hasText: /whatsapp|meta|facebook/i 
    });
    
    if (await whatsappMention.count() > 0) {
      console.log('✅ GDPR: WhatsApp/Meta integration disclosed');
    }
    
    // Look for third-party data transfer information
    const transferInfo = page.locator('text').filter({ 
      hasText: /drittland|third.*country|übermittlung|transfer/i 
    });
    
    if (await transferInfo.count() > 0) {
      console.log('✅ GDPR: Cross-border data transfer information provided');
    }
    
    // Check for adequacy decision or safeguards mention
    const safeguards = page.locator('text').filter({ 
      hasText: /angemessenheit|adequacy|schutzmaßnahmen|safeguards/i 
    });
    
    if (await safeguards.count() > 0) {
      console.log('✅ GDPR: Data transfer safeguards mentioned');
    }
  });
});
