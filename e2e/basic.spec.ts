import { test, expect } from '@playwright/test';
import { TestHelpers } from './helpers';

test.describe('Basic UI Tests', () => {
  test('can navigate to menu and open cart after dismissing cookie banner', async ({ page }) => {
    const helpers = new TestHelpers(page);
    
    // Navigate to menu
    await helpers.navigateToMenu();
    
    // Add a pizza to cart first
    const pizzaCards = page.locator('.pizza-card-compact');
    await expect(pizzaCards.first()).toBeVisible();
    
    // Find and click add button for first pizza
    const firstPizzaCard = pizzaCards.first();
    const addButton = firstPizzaCard.locator('text=+');
    await addButton.click();
    
    // Wait for cart to update
    await page.waitForTimeout(1000);
    
    // Now try to open cart
    await helpers.openCart();
    
    console.log('✅ Successfully opened cart after dismissing cookie banner');
  });

  test('homepage loads correctly', async ({ page }) => {
    await page.goto('/');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Check if the main heading is visible
    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible();
    
    // Get the actual text to see what we're working with
    const headingText = await heading.textContent();
    console.log('Homepage heading text:', headingText);
    
    // Check for key elements that should be on homepage
    const orderButton = page.locator('text=🚀 Jetzt bestellen & PLZ-Preise entdecken');
    await expect(orderButton).toBeVisible();
  });

  test('menu page loads after entering PLZ', async ({ page }) => {
    await page.goto('/');
    
    // Wait for page load
    await page.waitForLoadState('networkidle');
    
    // Fill optional name (not required)
    const nameInput = page.locator('input[placeholder*="Name"]').or(page.locator('input[type="text"]')).first();
    if (await nameInput.isVisible()) {
      await nameInput.fill('Test User');
    }
    
    // Fill required PLZ
    const plzInput = page.locator('input[placeholder*="PLZ"]').or(page.locator('input[placeholder*="44149"]'));
    await expect(plzInput).toBeVisible();
    await plzInput.fill('44149');
    
    // Click the order button
    const orderButton = page.locator('text=🚀 Jetzt bestellen & PLZ-Preise entdecken');
    await expect(orderButton).toBeVisible();
    await orderButton.click();
    
    // Verify we're on menu page
    await expect(page).toHaveURL('/menu');
  });
});
