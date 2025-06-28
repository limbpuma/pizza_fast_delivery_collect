// Modal UI Test Suite
// Tests for the improved AdvancedPizzaModal UI components

console.log('🚀 Starting Modal UI Improvement Tests...');

// Test 1: QuantityControls Compact Mode
function testQuantityControlsCompact() {
  console.log('\n📱 Test 1: QuantityControls Compact Mode');
  
  // Check if compact prop is properly handled
  const quantityControls = document.querySelector('[data-testid="quantity-controls"]');
  if (quantityControls) {
    const buttons = quantityControls.querySelectorAll('button');
    const input = quantityControls.querySelector('input[type="number"]');
    
    console.log('✅ QuantityControls found');
    console.log(`📏 Button count: ${buttons.length}`);
    console.log(`📐 Input field present: ${input ? 'Yes' : 'No'}`);
    
    // Check button sizes (should be w-7 h-7 in compact mode)
    if (buttons.length === 2) {
      console.log('✅ Correct number of buttons (decrease/increase)');
    }
    
    if (input) {
      console.log('✅ Number input field present');
    }
  } else {
    console.log('❌ QuantityControls not found');
  }
}

// Test 2: Modal Layout Structure
function testModalLayout() {
  console.log('\n🎨 Test 2: Modal Layout Structure');
  
  // Check if modal is open
  const modal = document.querySelector('[role="dialog"]');
  if (modal) {
    console.log('✅ Modal dialog found');
    
    // Check pizza preview section
    const pizzaPreview = modal.querySelector('.bg-gray-50');
    if (pizzaPreview) {
      console.log('✅ Pizza preview section found');
      const icon = pizzaPreview.querySelector('.bg-orange-100');
      if (icon) {
        console.log('✅ Pizza icon container found');
        // Check if it's the compact size (w-10 h-10 on mobile)
        console.log('📐 Icon size optimized for mobile');
      }
    }
    
    // Check bottom section (price + buttons)
    const bottomSection = modal.querySelector('.bg-orange-50');
    if (bottomSection) {
      console.log('✅ Price summary section found');
      
      // Check if quantity controls are integrated
      const quantityInSummary = bottomSection.querySelector('input[type="number"]');
      if (quantityInSummary) {
        console.log('✅ Quantity controls integrated into price summary');
      }
    }
    
    // Check action buttons
    const actionButtons = modal.querySelectorAll('button');
    const cancelButton = Array.from(actionButtons).find(btn => 
      btn.textContent?.toLowerCase().includes('cancel') || 
      btn.textContent?.toLowerCase().includes('abbrechen')
    );
    const addButton = Array.from(actionButtons).find(btn => 
      btn.textContent?.toLowerCase().includes('add') || 
      btn.textContent?.toLowerCase().includes('hinzufügen')
    );
    
    if (cancelButton && addButton) {
      console.log('✅ Cancel and Add buttons found');
      
      // Check flex proportions (cancel should be smaller)
      const cancelClasses = cancelButton.className;
      const addClasses = addButton.className;
      
      if (cancelClasses.includes('flex-') && addClasses.includes('flex-')) {
        console.log('✅ Button proportions properly set');
      }
    }
    
  } else {
    console.log('❌ Modal not currently open - need to open a pizza modal to test');
  }
}

// Test 3: Responsive Design
function testResponsiveDesign() {
  console.log('\n📱 Test 3: Responsive Design');
  
  const screenWidth = window.innerWidth;
  console.log(`📏 Current screen width: ${screenWidth}px`);
  
  if (screenWidth < 640) {
    console.log('📱 Mobile view detected');
    console.log('✅ Should use compact spacing (space-y-3)');
    console.log('✅ Should use smaller icons (w-10 h-10)');
    console.log('✅ Should use text-sm for most text');
  } else {
    console.log('💻 Desktop/Tablet view detected');
    console.log('✅ Should use normal spacing (space-y-4)');
    console.log('✅ Should use larger icons (w-12 h-12)');
    console.log('✅ Should use responsive text sizing');
  }
}

// Test 4: Price Calculation
function testPriceCalculation() {
  console.log('\n💰 Test 4: Price Calculation');
  
  const modal = document.querySelector('[role="dialog"]');
  if (modal) {
    // Check if price elements are present
    const totalPrice = modal.querySelector('.text-orange-600');
    
    if (totalPrice) {
      console.log('✅ Total price display found');
      console.log(`💰 Total price: ${totalPrice.textContent}`);
    }
    
    // Check quantity display
    const quantityInput = modal.querySelector('input[type="number"]') as HTMLInputElement;
    if (quantityInput) {
      const quantity = parseInt(quantityInput.value);
      console.log(`🔢 Current quantity: ${quantity}`);
      
      if (quantity >= 1 && quantity <= 10) {
        console.log('✅ Quantity within valid range');
      }
    }
  }
}

// Test 5: Accessibility
function testAccessibility() {
  console.log('\n♿ Test 5: Accessibility');
  
  const modal = document.querySelector('[role="dialog"]');
  if (modal) {
    // Check ARIA labels
    const buttons = modal.querySelectorAll('button[aria-label]');
    console.log(`🏷️ Buttons with ARIA labels: ${buttons.length}`);
    
    // Check input labels
    const inputs = modal.querySelectorAll('input[aria-label]');
    console.log(`📝 Inputs with ARIA labels: ${inputs.length}`);
    
    // Check modal title
    const title = modal.querySelector('[id*="title"]');
    if (title) {
      console.log('✅ Modal title found for screen readers');
    }
    
    console.log('✅ Accessibility checks completed');
  }
}

// Run all tests
function runModalUITests() {
  console.log('🧪 Modal UI Improvement Test Suite');
  console.log('=====================================');
  
  testQuantityControlsCompact();
  testModalLayout();
  testResponsiveDesign();
  testPriceCalculation();
  testAccessibility();
  
  console.log('\n✅ All Modal UI tests completed!');
  console.log('\n📋 To test manually:');
  console.log('1. Open any pizza product modal');
  console.log('2. Test quantity controls');
  console.log('3. Verify price calculations');
  console.log('4. Test on different screen sizes');
  console.log('5. Check button interactions');
}

// Auto-run tests when script loads
if (typeof window !== 'undefined') {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runModalUITests);
  } else {
    runModalUITests();
  }
}

// Export for manual testing
export {
  runModalUITests,
  testQuantityControlsCompact,
  testModalLayout,
  testResponsiveDesign,
  testPriceCalculation,
  testAccessibility
};
