/**
 * 🧪 UI INTERACTION TESTING UTILITIES
 * Helper functions for testing user interface interactions
 */

interface UITestResult {
  element: string;
  action: string;
  success: boolean;
  details: string;
  timestamp: string;
}

class UITester {
  private results: UITestResult[] = [];

  constructor() {
    console.log('🎯 UI Testing Utilities Loaded');
  }

  // ===============================
  // DOM INTERACTION HELPERS
  // ===============================

  findElementByText(text: string, tag?: string): Element | null {
    const selector = tag ? tag : '*';
    const elements = document.querySelectorAll(selector);
    
    for (const element of elements) {
      if (element.textContent?.includes(text)) {
        return element;
      }
    }
    return null;
  }

  findButtonByText(text: string): HTMLButtonElement | null {
    const buttons = document.querySelectorAll('button');
    for (const button of buttons) {
      if (button.textContent?.includes(text)) {
        return button;
      }
    }
    return null;
  }

  findInputByPlaceholder(placeholder: string): HTMLInputElement | null {
    return document.querySelector(`input[placeholder*="${placeholder}"]`) as HTMLInputElement;
  }

  // ===============================
  // TESTING ACTIONS
  // ===============================

  async clickButton(buttonText: string): Promise<UITestResult> {
    const result: UITestResult = {
      element: `Button: "${buttonText}"`,
      action: 'click',
      success: false,
      details: '',
      timestamp: new Date().toISOString()
    };

    try {
      const button = this.findButtonByText(buttonText);
      
      if (!button) {
        result.details = 'Button not found in DOM';
        this.results.push(result);
        return result;
      }

      if (button.disabled) {
        result.details = 'Button is disabled';
        this.results.push(result);
        return result;
      }

      // Simulate click
      button.click();
      
      // Wait a moment for any state changes
      await this.wait(100);
      
      result.success = true;
      result.details = 'Button clicked successfully';
      this.results.push(result);
      return result;

    } catch (error) {
      result.details = `Error clicking button: ${error}`;
      this.results.push(result);
      return result;
    }
  }

  async fillInput(placeholder: string, value: string): Promise<UITestResult> {
    const result: UITestResult = {
      element: `Input: placeholder="${placeholder}"`,
      action: `fill with "${value}"`,
      success: false,
      details: '',
      timestamp: new Date().toISOString()
    };

    try {
      const input = this.findInputByPlaceholder(placeholder);
      
      if (!input) {
        result.details = 'Input not found in DOM';
        this.results.push(result);
        return result;
      }

      // Clear existing value and set new value
      input.value = '';
      input.value = value;
      
      // Trigger input events
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
      
      await this.wait(100);
      
      result.success = true;
      result.details = `Input filled with "${value}"`;
      this.results.push(result);
      return result;

    } catch (error) {
      result.details = `Error filling input: ${error}`;
      this.results.push(result);
      return result;
    }
  }

  // ===============================
  // VERIFICATION HELPERS
  // ===============================

  checkElementExists(selector: string): boolean {
    return document.querySelector(selector) !== null;
  }

  checkTextExists(text: string): boolean {
    return document.body.textContent?.includes(text) || false;
  }

  getCartItemCount(): number {
    // Look for cart indicators in the UI
    const cartCountElement = document.querySelector('[data-testid="cart-count"]') || 
                           document.querySelector('.cart-count') ||
                           document.querySelector('#cart-count');
    
    if (cartCountElement && cartCountElement.textContent) {
      const count = parseInt(cartCountElement.textContent);
      return isNaN(count) ? 0 : count;
    }
    
    // Fallback: count items that look like cart items
    const cartItems = document.querySelectorAll('[data-testid="cart-item"], .cart-item');
    return cartItems.length;
  }

  getCurrentURL(): string {
    return window.location.href;
  }

  // ===============================
  // UTILITIES
  // ===============================

  wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  logResult(result: UITestResult): void {
    const emoji = result.success ? '✅' : '❌';
    console.log(`${emoji} ${result.action} on ${result.element}: ${result.details}`);
  }

  logAllResults(): void {
    console.log('\n📋 UI TEST RESULTS:');
    this.results.forEach(result => this.logResult(result));
  }

  // ===============================
  // ADVANCED TESTING FLOWS
  // ===============================

  async testAddPizzaToCart(): Promise<UITestResult[]> {
    console.log('🍕 Testing: Add Pizza to Cart');
    const results: UITestResult[] = [];

    // Look for pizza items and add buttons
    const addButtons = document.querySelectorAll('button');
    const pizzaAddButton = Array.from(addButtons).find(button => 
      button.textContent?.includes('+') || 
      button.textContent?.includes('Hinzufügen') ||
      button.textContent?.includes('Add to cart')
    );

    if (pizzaAddButton) {
      const result = await this.clickButton(pizzaAddButton.textContent || 'Add button');
      results.push(result);
    } else {
      results.push({
        element: 'Pizza Add Button',
        action: 'search',
        success: false,
        details: 'No add to cart buttons found',
        timestamp: new Date().toISOString()
      });
    }

    return results;
  }

  async testNavigateToCheckout(): Promise<UITestResult[]> {
    console.log('🛒 Testing: Navigate to Checkout');
    const results: UITestResult[] = [];

    // Look for cart/checkout button
    const checkoutButton = this.findButtonByText('Checkout') || 
                          this.findButtonByText('Zur Kasse') ||
                          this.findButtonByText('Warenkorb');

    if (checkoutButton) {
      const result = await this.clickButton(checkoutButton.textContent || 'Checkout');
      results.push(result);
    } else {
      results.push({
        element: 'Checkout Button',
        action: 'search',
        success: false,
        details: 'No checkout button found',
        timestamp: new Date().toISOString()
      });
    }

    return results;
  }
}

// Make available in browser console
if (typeof window !== 'undefined') {
  (window as any).UITester = UITester;
  console.log('💡 Usage: const tester = new UITester(); await tester.testAddPizzaToCart();');
}

export default UITester;
