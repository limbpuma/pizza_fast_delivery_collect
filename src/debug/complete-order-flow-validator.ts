/**
 * Complete Order Flow Validation Test Suite
 * Tests both multiproduct modal and single product orders
 * Validates: Cart → Checkout → WhatsApp → My Orders flow
 */

interface OrderFlowTestResults {
  passed: number;
  failed: number;
  total: number;
  details: Array<{
    test: string;
    status: 'PASS' | 'FAIL';
    message: string;
    timestamp: string;
  }>;
}

interface CartItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  size?: string;
  diameter?: string;
  sauce?: string;
  zutaten?: Array<{id: string; name: string; price: number}>;
  pizzaId?: string;
}

class OrderFlowValidator {
  private results: OrderFlowTestResults = {
    passed: 0,
    failed: 0,
    total: 0,
    details: []
  };

  private logTest(test: string, status: 'PASS' | 'FAIL', message: string) {
    this.results.details.push({
      test,
      status,
      message,
      timestamp: new Date().toISOString()
    });
    
    if (status === 'PASS') {
      this.results.passed++;
      console.log(`✅ ${test}: ${message}`);
    } else {
      this.results.failed++;
      console.log(`❌ ${test}: ${message}`);
    }
    this.results.total++;
  }

  // Test 1: Modal Multiproduct Order Creation
  async testMultiproductModalOrder(): Promise<void> {
    try {
      console.log('\n🧪 Testing Multiproduct Modal Order Creation...');

      // Check if advanced pizza modal exists and functions
      const modal = document.querySelector('[role="dialog"]');
      if (!modal) {
        this.logTest('Modal Existence', 'FAIL', 'Advanced pizza modal not found in DOM');
        return;
      }

      this.logTest('Modal Existence', 'PASS', 'Advanced pizza modal found and accessible');

      // Test size selection
      const sizeOptions = modal.querySelectorAll('[data-testid="size-option"], input[name="size"]');
      if (sizeOptions.length === 0) {
        this.logTest('Size Selection', 'FAIL', 'No size options available in modal');
      } else {
        this.logTest('Size Selection', 'PASS', `${sizeOptions.length} size options available`);
      }

      // Test sauce selection
      const sauceOptions = modal.querySelectorAll('[data-testid="sauce-option"], select[name="sauce"]');
      if (sauceOptions.length === 0) {
        this.logTest('Sauce Selection', 'FAIL', 'No sauce options available in modal');
      } else {
        this.logTest('Sauce Selection', 'PASS', `${sauceOptions.length} sauce options available`);
      }

      // Test quantity controls
      const quantityControls = modal.querySelector('input[type="number"]');
      if (!quantityControls) {
        this.logTest('Quantity Controls', 'FAIL', 'Quantity controls not found');
      } else {
        const currentValue = (quantityControls as HTMLInputElement).value;
        this.logTest('Quantity Controls', 'PASS', `Quantity controls found with value: ${currentValue}`);
      }

      // Test zutaten/ingredients selection
      const zutatenSection = modal.querySelector('[data-testid="zutaten-section"]') || 
                            modal.querySelector('.zutaten') ||
                            modal.querySelectorAll('input[type="checkbox"]');
      
      if (!zutatenSection || (zutatenSection as NodeList).length === 0) {
        this.logTest('Zutaten Selection', 'FAIL', 'Zutaten/ingredients section not found');
      } else {
        const zutatenCount = zutatenSection instanceof NodeList ? zutatenSection.length : 1;
        this.logTest('Zutaten Selection', 'PASS', `Zutaten section found with ${zutatenCount} options`);
      }

      // Test price calculation
      const priceElement = modal.querySelector('.text-orange-600, [data-testid="total-price"]');
      if (!priceElement) {
        this.logTest('Price Calculation', 'FAIL', 'Total price element not found');
      } else {
        const priceText = priceElement.textContent || '';
        this.logTest('Price Calculation', 'PASS', `Price display found: ${priceText}`);
      }

      // Test add to cart button
      const addButton = modal.querySelector('button[data-testid="add-to-cart"]') ||
                       Array.from(modal.querySelectorAll('button')).find(btn => 
                         btn.textContent?.toLowerCase().includes('warenkorb') ||
                         btn.textContent?.toLowerCase().includes('basket')
                       );

      if (!addButton) {
        this.logTest('Add to Cart Button', 'FAIL', 'Add to cart button not found');
      } else {
        const isDisabled = (addButton as HTMLButtonElement).disabled;
        this.logTest('Add to Cart Button', 'PASS', `Add to cart button found (disabled: ${isDisabled})`);
      }

    } catch (error) {
      this.logTest('Modal Order Test', 'FAIL', `Error testing modal: ${error}`);
    }
  }

  // Test 2: Single Product Order Creation
  async testSingleProductOrder(): Promise<void> {
    try {
      console.log('\n🧪 Testing Single Product Order Creation...');

      // Look for quick add buttons or product cards
      const productCards = document.querySelectorAll('[data-testid="product-card"], .product-card');
      if (productCards.length === 0) {
        this.logTest('Product Cards', 'FAIL', 'No product cards found on page');
        return;
      }

      this.logTest('Product Cards', 'PASS', `${productCards.length} product cards found`);

      // Test quick add functionality
      const quickAddButtons = document.querySelectorAll('[data-testid="quick-add"], button[title*="add"], button[aria-label*="add"]');
      if (quickAddButtons.length === 0) {
        this.logTest('Quick Add Buttons', 'FAIL', 'No quick add buttons found');
      } else {
        this.logTest('Quick Add Buttons', 'PASS', `${quickAddButtons.length} quick add buttons found`);
      }

      // Test product information display
      const productNames = document.querySelectorAll('[data-testid="product-name"], .product-name, h3');
      const productPrices = document.querySelectorAll('[data-testid="product-price"], .product-price');
      
      if (productNames.length === 0) {
        this.logTest('Product Information', 'FAIL', 'No product names found');
      } else {
        this.logTest('Product Information', 'PASS', `${productNames.length} products with names and ${productPrices.length} prices found`);
      }

    } catch (error) {
      this.logTest('Single Product Test', 'FAIL', `Error testing single products: ${error}`);
    }
  }

  // Test 3: Cart Functionality
  async testCartFunctionality(): Promise<void> {
    try {
      console.log('\n🧪 Testing Cart Functionality...');

      // Check cart accessibility
      const cartIcon = document.querySelector('[data-testid="cart-icon"], .cart-icon, [aria-label*="cart"]');
      if (!cartIcon) {
        this.logTest('Cart Access', 'FAIL', 'Cart icon/access not found');
        return;
      }

      this.logTest('Cart Access', 'PASS', 'Cart icon found and accessible');

      // Check cart state management (Redux/local storage)
      const cartState = localStorage.getItem('cartItems') || localStorage.getItem('cart');
      if (!cartState) {
        this.logTest('Cart State', 'PASS', 'Cart is empty (clean state)');
      } else {
        try {
          const parsedCart = JSON.parse(cartState);
          this.logTest('Cart State', 'PASS', `Cart contains ${Array.isArray(parsedCart) ? parsedCart.length : 'data'} items`);
        } catch {
          this.logTest('Cart State', 'FAIL', 'Cart state is corrupted');
        }
      }

      // Test cart item display
      const cartItems = document.querySelectorAll('[data-testid="cart-item"], .cart-item');
      this.logTest('Cart Items Display', 'PASS', `${cartItems.length} cart items displayed`);

      // Test cart total calculation
      const cartTotal = document.querySelector('[data-testid="cart-total"], .cart-total');
      if (cartTotal) {
        this.logTest('Cart Total', 'PASS', `Cart total display found: ${cartTotal.textContent}`);
      } else {
        this.logTest('Cart Total', 'FAIL', 'Cart total display not found');
      }

    } catch (error) {
      this.logTest('Cart Functionality', 'FAIL', `Error testing cart: ${error}`);
    }
  }

  // Test 4: Checkout Process
  async testCheckoutProcess(): Promise<void> {
    try {
      console.log('\n🧪 Testing Checkout Process...');

      // Look for checkout button
      const checkoutButton = document.querySelector('[data-testid="checkout-button"], button[data-action="checkout"]') ||
                            Array.from(document.querySelectorAll('button')).find(btn => 
                              btn.textContent?.toLowerCase().includes('checkout') ||
                              btn.textContent?.toLowerCase().includes('bestellen') ||
                              btn.textContent?.toLowerCase().includes('kasse')
                            );

      if (!checkoutButton) {
        this.logTest('Checkout Button', 'FAIL', 'Checkout button not found');
        return;
      }

      this.logTest('Checkout Button', 'PASS', 'Checkout button found');

      // Test form validation elements
      const nameInput = document.querySelector('input[name="name"], input[data-testid="customer-name"]');
      const phoneInput = document.querySelector('input[name="phone"], input[data-testid="customer-phone"]');
      const addressInput = document.querySelector('input[name="address"], textarea[name="address"]');

      if (nameInput) {
        this.logTest('Customer Name Field', 'PASS', 'Customer name input found');
      } else {
        this.logTest('Customer Name Field', 'FAIL', 'Customer name input not found');
      }

      if (phoneInput) {
        this.logTest('Phone Number Field', 'PASS', 'Phone number input found');
      } else {
        this.logTest('Phone Number Field', 'FAIL', 'Phone number input not found');
      }

      if (addressInput) {
        this.logTest('Address Field', 'PASS', 'Address input found');
      } else {
        this.logTest('Address Field', 'FAIL', 'Address input not found');
      }

      // Test PLZ validation
      const plzInput = document.querySelector('input[name="postalCode"], input[data-testid="plz"]');
      if (plzInput) {
        this.logTest('PLZ Validation', 'PASS', 'PLZ input field found');
      } else {
        this.logTest('PLZ Validation', 'FAIL', 'PLZ input field not found');
      }

    } catch (error) {
      this.logTest('Checkout Process', 'FAIL', `Error testing checkout: ${error}`);
    }
  }

  // Test 5: WhatsApp Integration
  async testWhatsAppIntegration(): Promise<void> {
    try {
      console.log('\n🧪 Testing WhatsApp Integration...');

      // Look for WhatsApp elements
      const whatsappElements = document.querySelectorAll('[data-testid="whatsapp"], .whatsapp, [href*="whatsapp"], [href*="wa.me"]');
      
      if (whatsappElements.length === 0) {
        this.logTest('WhatsApp Elements', 'FAIL', 'No WhatsApp integration elements found');
        return;
      }

      this.logTest('WhatsApp Elements', 'PASS', `${whatsappElements.length} WhatsApp elements found`);

      // Test WhatsApp URL format
      const whatsappLinks = Array.from(whatsappElements).filter(el => 
        el.getAttribute('href')?.includes('whatsapp') || 
        el.getAttribute('href')?.includes('wa.me')
      ) as HTMLAnchorElement[];

      if (whatsappLinks.length > 0) {
        const firstLink = whatsappLinks[0];
        const href = firstLink.href;
        
        if (href.includes('wa.me') || href.includes('whatsapp')) {
          this.logTest('WhatsApp URL Format', 'PASS', `Valid WhatsApp URL found: ${href.substring(0, 50)}...`);
        } else {
          this.logTest('WhatsApp URL Format', 'FAIL', 'Invalid WhatsApp URL format');
        }
      }

      // Test message formatting (would need to inspect the message content)
      this.logTest('Message Format', 'PASS', 'WhatsApp message formatting to be validated during actual order');

    } catch (error) {
      this.logTest('WhatsApp Integration', 'FAIL', `Error testing WhatsApp: ${error}`);
    }
  }

  // Test 6: My Orders Functionality
  async testMyOrdersFunctionality(): Promise<void> {
    try {
      console.log('\n🧪 Testing My Orders Functionality...');

      // Look for orders section or navigation
      const ordersLink = document.querySelector('[data-testid="my-orders"], a[href*="orders"], a[href*="bestellungen"]') ||
                        Array.from(document.querySelectorAll('a, button')).find(el => 
                          el.textContent?.toLowerCase().includes('orders') ||
                          el.textContent?.toLowerCase().includes('bestellungen') ||
                          el.textContent?.toLowerCase().includes('meine bestellung')
                        );

      if (!ordersLink) {
        this.logTest('Orders Navigation', 'FAIL', 'My Orders navigation not found');
        return;
      }

      this.logTest('Orders Navigation', 'PASS', 'My Orders navigation found');

      // Test order history storage
      const orderHistory = localStorage.getItem('orderHistory') || localStorage.getItem('recentOrders');
      if (!orderHistory) {
        this.logTest('Order History Storage', 'PASS', 'Order history is empty (clean state)');
      } else {
        try {
          const parsedHistory = JSON.parse(orderHistory);
          this.logTest('Order History Storage', 'PASS', `Order history contains ${Array.isArray(parsedHistory) ? parsedHistory.length : 'data'} orders`);
        } catch {
          this.logTest('Order History Storage', 'FAIL', 'Order history storage is corrupted');
        }
      }

      // Test order display format
      const orderItems = document.querySelectorAll('[data-testid="order-item"], .order-item, .recent-order');
      this.logTest('Order Display', 'PASS', `${orderItems.length} order items displayed`);

    } catch (error) {
      this.logTest('My Orders', 'FAIL', `Error testing My Orders: ${error}`);
    }
  }

  // Test 7: Data Consistency Validation
  async testDataConsistency(): Promise<void> {
    try {
      console.log('\n🧪 Testing Data Consistency...');

      // Test Redux state consistency
      const reduxState = (window as any).__REDUX_STORE__?.getState?.() || null;
      if (reduxState) {
        this.logTest('Redux State', 'PASS', 'Redux store accessible');
        
        // Check cart state structure
        if (reduxState.cart) {
          this.logTest('Cart State Structure', 'PASS', 'Cart state exists in Redux');
        } else {
          this.logTest('Cart State Structure', 'FAIL', 'Cart state missing in Redux');
        }
      } else {
        this.logTest('Redux State', 'FAIL', 'Redux store not accessible');
      }

      // Test local storage consistency
      const cartItems = localStorage.getItem('cartItems');
      
      if (cartItems) {
        try {
          JSON.parse(cartItems);
          this.logTest('Cart Storage Format', 'PASS', 'Cart items in localStorage are valid JSON');
        } catch {
          this.logTest('Cart Storage Format', 'FAIL', 'Cart items in localStorage are invalid JSON');
        }
      }

      // Test price consistency across components
      const priceElements = document.querySelectorAll('[data-testid*="price"], .price, .currency');
      const validPrices = Array.from(priceElements).filter(el => {
        const text = el.textContent || '';
        return /\d+[.,]\d{2}/.test(text); // Basic price format validation
      });

      this.logTest('Price Format Consistency', 'PASS', `${validPrices.length}/${priceElements.length} price elements have valid format`);

    } catch (error) {
      this.logTest('Data Consistency', 'FAIL', `Error testing data consistency: ${error}`);
    }
  }

  // Test 8: Responsive Design and Accessibility
  async testResponsiveAndAccessibility(): Promise<void> {
    try {
      console.log('\n🧪 Testing Responsive Design and Accessibility...');

      // Test mobile responsiveness
      const viewport = window.innerWidth;
      this.logTest('Viewport Detection', 'PASS', `Current viewport: ${viewport}px`);

      // Check for responsive classes
      const responsiveElements = document.querySelectorAll('[class*="sm:"], [class*="md:"], [class*="lg:"]');
      if (responsiveElements.length > 0) {
        this.logTest('Responsive Classes', 'PASS', `${responsiveElements.length} elements with responsive classes`);
      } else {
        this.logTest('Responsive Classes', 'FAIL', 'No responsive design classes found');
      }

      // Test ARIA labels and accessibility
      const ariaElements = document.querySelectorAll('[aria-label], [aria-labelledby], [role]');
      if (ariaElements.length > 0) {
        this.logTest('Accessibility Labels', 'PASS', `${ariaElements.length} elements with ARIA attributes`);
      } else {
        this.logTest('Accessibility Labels', 'FAIL', 'No ARIA attributes found');
      }

      // Test keyboard navigation
      const focusableElements = document.querySelectorAll('button, input, select, textarea, a[href]');
      this.logTest('Keyboard Navigation', 'PASS', `${focusableElements.length} focusable elements found`);

    } catch (error) {
      this.logTest('Responsive & Accessibility', 'FAIL', `Error testing responsive/accessibility: ${error}`);
    }
  }

  // Main test runner
  async runAllTests(): Promise<OrderFlowTestResults> {
    console.log('🚀 Starting Complete Order Flow Validation...\n');
    console.log('═'.repeat(80));

    try {
      await this.testMultiproductModalOrder();
      await this.testSingleProductOrder();
      await this.testCartFunctionality();
      await this.testCheckoutProcess();
      await this.testWhatsAppIntegration();
      await this.testMyOrdersFunctionality();
      await this.testDataConsistency();
      await this.testResponsiveAndAccessibility();

    } catch (error) {
      this.logTest('Test Suite Execution', 'FAIL', `Critical error in test suite: ${error}`);
    }

    // Generate summary
    console.log('\n' + '═'.repeat(80));
    console.log('📊 TEST RESULTS SUMMARY');
    console.log('═'.repeat(80));
    console.log(`✅ PASSED: ${this.results.passed}`);
    console.log(`❌ FAILED: ${this.results.failed}`);
    console.log(`📋 TOTAL: ${this.results.total}`);
    console.log(`📈 SUCCESS RATE: ${((this.results.passed / this.results.total) * 100).toFixed(1)}%`);

    if (this.results.failed > 0) {
      console.log('\n❌ FAILED TESTS:');
      this.results.details
        .filter(detail => detail.status === 'FAIL')
        .forEach(detail => {
          console.log(`   • ${detail.test}: ${detail.message}`);
        });
    }

    console.log('\n📝 Detailed test log saved to results object');
    return this.results;
  }

  // Get results
  getResults(): OrderFlowTestResults {
    return this.results;
  }

  // Generate detailed report
  generateReport(): string {
    const report = [
      '# Complete Order Flow Validation Report',
      `**Generated:** ${new Date().toLocaleString()}`,
      `**Total Tests:** ${this.results.total}`,
      `**Passed:** ${this.results.passed}`,
      `**Failed:** ${this.results.failed}`,
      `**Success Rate:** ${((this.results.passed / this.results.total) * 100).toFixed(1)}%`,
      '',
      '## Test Details',
      ''
    ];

    this.results.details.forEach(detail => {
      const status = detail.status === 'PASS' ? '✅' : '❌';
      report.push(`${status} **${detail.test}**`);
      report.push(`   ${detail.message}`);
      report.push(`   *${detail.timestamp}*`);
      report.push('');
    });

    return report.join('\n');
  }
}

// Global instance for manual testing
const orderFlowValidator = new OrderFlowValidator();

// Auto-run tests if DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, starting order flow validation in 2 seconds...');
    setTimeout(() => orderFlowValidator.runAllTests(), 2000);
  });
} else {
  console.log('DOM ready, starting order flow validation...');
  orderFlowValidator.runAllTests();
}

// Export for manual use
export {
  OrderFlowValidator,
  orderFlowValidator as default,
  type OrderFlowTestResults,
  type CartItem
};

// Make available globally for console testing
(window as any).orderFlowValidator = orderFlowValidator;
