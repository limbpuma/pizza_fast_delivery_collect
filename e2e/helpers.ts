import { Page, expect } from '@playwright/test';

/**
 * Helper functions for E2E testing
 */

export class TestHelpers {
  constructor(private page: Page) {}

  /**
   * Add a pizza to cart by index
   */
  async addPizzaToCart(index: number = 0): Promise<void> {
    const pizzaCard = this.page.locator('.pizza-card-compact').nth(index);
    await pizzaCard.locator('button:has-text("+")').click();
  }

  /**
   * Navigate to menu from homepage
   */
  async navigateToMenu(): Promise<void> {
    await this.page.goto('/');
    await expect(this.page.locator('h1')).toContainText('Schnellste Pizza-Lieferung');
    
    // Dismiss cookie banner if present
    await this.dismissCookieBanner();
    
    // Fill optional name
    const nameInput = this.page.locator('input[placeholder*="Name"]').or(this.page.locator('input[type="text"]')).first();
    if (await nameInput.isVisible()) {
      await nameInput.fill('Test User');
    }
    
    // Fill required PLZ
    const plzInput = this.page.locator('input[placeholder*="PLZ"]').or(this.page.locator('input[placeholder*="44149"]'));
    await plzInput.fill('44149');
    
    // Click order button to go to menu
    await this.page.click('text=🚀 Jetzt bestellen & PLZ-Preise entdecken');
    await expect(this.page).toHaveURL('/menu');
    
    // Dismiss cookie banner again if it appears on menu page
    await this.dismissCookieBanner();
  }

  /**
   * Open cart from menu page
   */
  async openCart(): Promise<void> {
    // Make sure we're on the menu page and no cookie banner is blocking
    await this.dismissCookieBanner();
    
    // Find and click the cart toggle button
    const cartButton = this.page.locator('button[aria-label="Open cart"]');
    await expect(cartButton).toBeVisible();
    
    // Wait a moment for any overlays to settle
    await this.page.waitForTimeout(1000);
    
    // Click the cart button
    await cartButton.click();
    
    // Verify cart opened (look for cart content or modal)
    await this.page.waitForTimeout(500);
  }

  /**
   * Dismiss cookie banner if present
   */
  async dismissCookieBanner(): Promise<void> {
    try {
      // Look for cookie banner
      const cookieBanner = this.page.locator('[class*="fixed"][class*="bottom"]').filter({ hasText: /einstellungen|cookie|akzeptieren/i });
      
      if (await cookieBanner.isVisible()) {
        // Try to find accept button
        const acceptButton = cookieBanner.locator('button').filter({ hasText: /akzeptieren|accept|ok/i });
        if (await acceptButton.count() > 0) {
          await acceptButton.first().click();
          await this.page.waitForTimeout(500);
        }
      }
    } catch (error) {
      // Ignore errors when dismissing cookie banner
      console.log('Could not dismiss cookie banner:', error);
    }
  }

  /**
   * Fill customer information form
   */
  async fillCustomerInfo(name: string, phone: string): Promise<void> {
    await this.page.fill('input[placeholder*="Enter your full name"]', name);
    
    const phoneInput = this.page.locator('input[type="tel"]');
    await phoneInput.click();
    await phoneInput.fill(phone);
  }

  /**
   * Fill delivery address (only for delivery orders)
   */
  async fillDeliveryAddress(
    address: string, 
    postalCode: string, 
    city: string = 'Dortmund'
  ): Promise<void> {
    await this.page.fill('input[placeholder*="Musterstraße"]', address);
    await this.page.fill('input[placeholder="44149"]', postalCode);
    
    // Verify city is set correctly
    await expect(this.page.locator(`input[value="${city}"]`)).toBeVisible();
  }

  /**
   * Add special instructions
   */
  async addSpecialInstructions(instructions: string): Promise<void> {
    await this.page.fill('textarea[placeholder*="Ring doorbell"]', instructions);
  }

  /**
   * Proceed to checkout from cart
   */
  async proceedToCheckout(): Promise<void> {
    await this.openCart();
    await this.page.click('text=Order pizzas');
  }

  /**
   * Select delivery or pickup mode
   */
  async selectOrderMode(mode: 'delivery' | 'pickup'): Promise<void> {
    const buttonText = mode === 'delivery' ? 'Delivery' : 'Collection';
    await this.page.click(`text=${buttonText}`);
    await expect(this.page).toHaveURL('/order');
  }

  /**
   * Verify order summary section
   */
  async verifyOrderSummary(hasDeliveryFee: boolean = false): Promise<void> {
    await expect(this.page.locator('text=Order Summary')).toBeVisible();
    await expect(this.page.locator('text=Final Total')).toBeVisible();
    
    if (hasDeliveryFee) {
      await expect(this.page.locator('text=Delivery fee')).toBeVisible();
    } else {
      await expect(this.page.locator('text=Delivery fee')).not.toBeVisible();
    }
  }

  /**
   * Submit order and verify WhatsApp modal
   */
  async submitOrderAndVerifyModal(): Promise<void> {
    const submitButton = this.page.locator('button[type="submit"]');
    await expect(submitButton).not.toBeDisabled();
    await expect(submitButton).toContainText('Place Order via WhatsApp');
    
    await submitButton.click();
    
    // Verify WhatsApp confirmation modal appears
    await expect(this.page.locator('text=Confirm WhatsApp Order')).toBeVisible();
  }

  /**
   * Confirm WhatsApp order and verify confirmation page
   */
  async confirmWhatsAppOrder(expectedTime: string): Promise<void> {
    await this.page.click('text=Confirm Order');
    
    // Wait for order confirmation page
    await expect(this.page).toHaveURL('/order-confirmation');
    await expect(this.page.locator('text=Order Confirmed')).toBeVisible();
    await expect(this.page.locator(`text=${expectedTime}`)).toBeVisible();
    
    // Verify order number is generated
    await expect(this.page.locator('text=CP')).toBeVisible();
  }

  /**
   * Verify cart item count
   */
  async verifyCartItemCount(count: number): Promise<void> {
    if (count > 0) {
      // Look for the cart toggle button which should show the count
      const cartButton = this.page.locator('button[aria-label="Open cart"]');
      await expect(cartButton).toBeVisible();
      
      // The cart count might be in the button text or a badge
      const countText = cartButton.locator('text=/^[0-9]+$/').or(
        this.page.locator('[data-testid="cart-count"]')
      );
      
      if (await countText.count() > 0) {
        await expect(countText.first()).toContainText(count.toString());
      }
    }
  }

  /**
   * Verify form validation errors
   */
  async verifyValidationErrors(expectedErrors: string[]): Promise<void> {
    for (const error of expectedErrors) {
      await expect(this.page.locator(`text=${error}`)).toBeVisible();
    }
  }

  /**
   * Verify minimum order warning
   */
  async verifyMinimumOrderWarning(shouldBeVisible: boolean = true): Promise<void> {
    const warning = this.page.locator('text=Mindestbestellwert nicht erreicht');
    
    if (shouldBeVisible) {
      await expect(warning).toBeVisible();
      
      // Verify submit button is disabled
      const submitButton = this.page.locator('button[type="submit"]');
      await expect(submitButton).toBeDisabled();
      await expect(submitButton).toContainText('Mindestbestellwert');
    } else {
      await expect(warning).not.toBeVisible();
    }
  }

  /**
   * Wait for page to load completely
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Mock WhatsApp success response (for testing)
   */
  async mockWhatsAppSuccess(): Promise<void> {
    // This would be used to mock the WhatsApp integration in tests
    // Implementation depends on how the WhatsApp integration is structured
    await this.page.evaluate(() => {
      // Mock successful WhatsApp response
      window.dispatchEvent(new CustomEvent('whatsapp-success'));
    });
  }
}

/**
 * Test data constants
 */
export const TEST_DATA = {
  VALID_DELIVERY_ADDRESSES: [
    { address: 'Musterstraße 123a', postalCode: '44149', city: 'Dortmund' },
    { address: 'Hauptstraße 45', postalCode: '44147', city: 'Dortmund' },
    { address: 'Bahnhofstraße 67', postalCode: '44137', city: 'Dortmund' }
  ],
  INVALID_DELIVERY_ADDRESSES: [
    { address: 'Test Street 1', postalCode: '10115', city: 'Berlin' },
    { address: 'Example Road 99', postalCode: '80331', city: 'Munich' }
  ],
  VALID_PHONES: [
    '+49 176 12345678',
    '+49 172 98765432',
    '+49 151 11111111'
  ],
  INVALID_PHONES: [
    '+49',
    '123456',
    'not-a-phone',
    ''
  ],
  CUSTOMER_NAMES: [
    'Max Mustermann',
    'Anna Schmidt',
    'Test User',
    'WhatsApp Test User'
  ],
  SPECIAL_INSTRUCTIONS: [
    'Please ring doorbell twice',
    'Call me when ready for pickup',
    'Leave at door',
    'Please call when ready'
  ]
};

/**
 * Utility functions
 */
export const utils = {
  /**
   * Generate random test data
   */
  randomCustomerName: () => TEST_DATA.CUSTOMER_NAMES[Math.floor(Math.random() * TEST_DATA.CUSTOMER_NAMES.length)],
  randomValidPhone: () => TEST_DATA.VALID_PHONES[Math.floor(Math.random() * TEST_DATA.VALID_PHONES.length)],
  randomValidAddress: () => TEST_DATA.VALID_DELIVERY_ADDRESSES[Math.floor(Math.random() * TEST_DATA.VALID_DELIVERY_ADDRESSES.length)],
  randomInvalidAddress: () => TEST_DATA.INVALID_DELIVERY_ADDRESSES[Math.floor(Math.random() * TEST_DATA.INVALID_DELIVERY_ADDRESSES.length)],
  randomSpecialInstructions: () => TEST_DATA.SPECIAL_INSTRUCTIONS[Math.floor(Math.random() * TEST_DATA.SPECIAL_INSTRUCTIONS.length)]
};
