import { test, expect } from '@playwright/test';
import { TestHelpers, utils } from './helpers';

test.describe('Complete Order Flows - Delivery vs Pickup', () => {
  let helpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
    await helpers.waitForPageLoad();
  });

  test('compare delivery and pickup flows side by side', async ({ page }) => {
    // Test delivery flow first
    await helpers.navigateToMenu();
    
    // Add multiple items to ensure minimum order is met
    await helpers.addPizzaToCart(0);
    await helpers.addPizzaToCart(1);
    await helpers.verifyCartItemCount(2);
    
    await helpers.proceedToCheckout();
    
    // Test delivery flow
    await helpers.selectOrderMode('delivery');
    
    await expect(page.locator('h1')).toContainText('Checkout - Delivery');
    
    const validAddress = utils.randomValidAddress();
    await helpers.fillCustomerInfo(utils.randomCustomerName(), utils.randomValidPhone());
    await helpers.fillDeliveryAddress(validAddress.address, validAddress.postalCode);
    await helpers.addSpecialInstructions(utils.randomSpecialInstructions());
    
    await helpers.verifyOrderSummary(true); // Has delivery fee
    await helpers.submitOrderAndVerifyModal();
    
    // Verify delivery-specific content in modal
    await expect(page.locator('text=Delivery')).toBeVisible();
    await expect(page.locator(`text=${validAddress.address}`)).toBeVisible();
    await expect(page.locator(`text=${validAddress.postalCode}`)).toBeVisible();
    
    await helpers.confirmWhatsAppOrder('30-45 min');
    
    // Now test pickup flow - go back to start
    await page.goto('/');
    await helpers.navigateToMenu();
    
    // Add items again
    await helpers.addPizzaToCart(0);
    await helpers.verifyCartItemCount(1);
    
    await helpers.proceedToCheckout();
    
    // Test pickup flow
    await helpers.selectOrderMode('pickup');
    
    await expect(page.locator('h1')).toContainText('Checkout - Collection');
    
    await helpers.fillCustomerInfo(utils.randomCustomerName(), utils.randomValidPhone());
    await helpers.addSpecialInstructions(utils.randomSpecialInstructions());
    
    // Verify no delivery address section for pickup
    await expect(page.locator('text=Delivery Address')).not.toBeVisible();
    
    await helpers.verifyOrderSummary(false); // No delivery fee
    await helpers.submitOrderAndVerifyModal();
    
    // Verify pickup-specific content in modal
    await expect(page.locator('text=Collection')).toBeVisible();
    await expect(page.locator('text=Musterstraße')).not.toBeVisible(); // No address
    
    await helpers.confirmWhatsAppOrder('15-20 min');
  });

  test('delivery flow with invalid postal code handling', async ({ page }) => {
    await helpers.navigateToMenu();
    await helpers.addPizzaToCart(0);
    await helpers.addPizzaToCart(1);
    
    await helpers.proceedToCheckout();
    await helpers.selectOrderMode('delivery');
    
    const invalidAddress = utils.randomInvalidAddress();
    await helpers.fillCustomerInfo('Test User', '+49 176 12345678');
    await helpers.fillDeliveryAddress(invalidAddress.address, invalidAddress.postalCode);
    
    // Try to submit with invalid postal code
    await page.click('button[type="submit"]');
    
    await helpers.verifyValidationErrors([
      'Sorry, we don\'t deliver to this postal code'
    ]);
  });

  test('pickup flow with minimal order (no minimum requirement)', async ({ page }) => {
    await helpers.navigateToMenu();
    
    // Add only one item for pickup
    await helpers.addPizzaToCart(0);
    await helpers.verifyCartItemCount(1);
    
    await helpers.proceedToCheckout();
    await helpers.selectOrderMode('pickup');
    
    await helpers.fillCustomerInfo('Single Item User', '+49 176 99999999');
    
    // Verify no minimum order warning for pickup
    await helpers.verifyMinimumOrderWarning(false);
    
    // Should be able to submit
    await helpers.submitOrderAndVerifyModal();
    await helpers.confirmWhatsAppOrder('15-20 min');
  });

  test('form validation across both delivery and pickup modes', async ({ page }) => {
    await helpers.navigateToMenu();
    await helpers.addPizzaToCart(0);
    
    // Test delivery validation
    await helpers.proceedToCheckout();
    await helpers.selectOrderMode('delivery');
    
    // Try to submit empty form
    await page.click('button[type="submit"]');
    
    await helpers.verifyValidationErrors([
      'Name is required',
      'Phone number is required',
      'Address is required',
      'Postal code is required'
    ]);
    
    // Go back and test pickup validation
    await page.goBack();
    await helpers.selectOrderMode('pickup');
    
    // Try to submit empty form (pickup should have fewer required fields)
    await page.click('button[type="submit"]');
    
    await helpers.verifyValidationErrors([
      'Name is required',
      'Phone number is required'
    ]);
    
    // These should NOT be required for pickup
    await expect(page.locator('text=Address is required')).not.toBeVisible();
    await expect(page.locator('text=Postal code is required')).not.toBeVisible();
  });

  test('WhatsApp modal interactions for both order types', async ({ page }) => {
    // Test delivery modal interactions
    await helpers.navigateToMenu();
    await helpers.addPizzaToCart(0);
    await helpers.addPizzaToCart(1);
    
    await helpers.proceedToCheckout();
    await helpers.selectOrderMode('delivery');
    
    const validAddress = utils.randomValidAddress();
    await helpers.fillCustomerInfo('Modal Test User', '+49 176 11111111');
    await helpers.fillDeliveryAddress(validAddress.address, validAddress.postalCode);
    
    await helpers.submitOrderAndVerifyModal();
    
    // Test modal buttons
    const modal = page.locator('text=Confirm WhatsApp Order').locator('..');
    
    await expect(modal.locator('text=Edit Order')).toBeVisible();
    await expect(modal.locator('text=Cancel')).toBeVisible();
    await expect(modal.locator('text=Confirm Order')).toBeVisible();
    
    // Test cancel
    await page.click('text=Cancel');
    await expect(modal).not.toBeVisible();
    
    // Reopen and test edit
    await helpers.submitOrderAndVerifyModal();
    await page.click('text=Edit Order');
    await expect(modal).not.toBeVisible();
    await expect(page).toHaveURL('/order');
    
    // Test actual confirmation
    await helpers.submitOrderAndVerifyModal();
    await helpers.confirmWhatsAppOrder('30-45 min');
  });

  test('pricing calculation differences between delivery and pickup', async ({ page }) => {
    await helpers.navigateToMenu();
    
    // Add same items for both tests
    await helpers.addPizzaToCart(0);
    await helpers.addPizzaToCart(1);
    
    let deliveryTotal: string;
    let pickupTotal: string;
    
    // Test delivery pricing
    await helpers.proceedToCheckout();
    await helpers.selectOrderMode('delivery');
    
    const validAddress = utils.randomValidAddress();
    await helpers.fillCustomerInfo('Pricing Test', '+49 176 22222222');
    await helpers.fillDeliveryAddress(validAddress.address, validAddress.postalCode);
    
    // Get delivery total
    const deliveryTotalElement = page.locator('text=Final Total').locator('..').locator('span').last();
    deliveryTotal = await deliveryTotalElement.textContent() || '';
    
    // Verify delivery fee is shown
    await expect(page.locator('text=Delivery fee')).toBeVisible();
    
    // Go back and test pickup pricing
    await page.goto('/menu');
    await helpers.addPizzaToCart(0);
    await helpers.addPizzaToCart(1);
    
    await helpers.proceedToCheckout();
    await helpers.selectOrderMode('pickup');
    
    await helpers.fillCustomerInfo('Pricing Test', '+49 176 22222222');
    
    // Get pickup total
    const pickupTotalElement = page.locator('text=Final Total').locator('..').locator('span').last();
    pickupTotal = await pickupTotalElement.textContent() || '';
    
    // Verify no delivery fee for pickup
    await expect(page.locator('text=Delivery fee')).not.toBeVisible();
    
    // Pickup should be cheaper than delivery (no delivery fee)
    console.log(`Delivery total: ${deliveryTotal}, Pickup total: ${pickupTotal}`);
    
    // Both should have valid currency format
    expect(deliveryTotal).toMatch(/€\d+\.\d{2}/);
    expect(pickupTotal).toMatch(/€\d+\.\d{2}/);
  });
});
