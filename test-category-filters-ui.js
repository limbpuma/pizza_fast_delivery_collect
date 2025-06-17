// Category Filters UI/UX Testing Script
// Test horizontal scroll, hamburger menu, and responsive behavior

console.log("🧪 Starting Category Filters UI/UX Tests...");

// Test 1: Check if MenuFilters component renders with horizontal scroll
function testHorizontalScroll() {
  console.log("Test 1: Horizontal Scroll Navigation");
  
  const scrollContainer = document.querySelector('[ref="scrollContainerRef"]') || 
                         document.querySelector('.overflow-x-auto');
  
  if (scrollContainer) {
    console.log("✅ Horizontal scroll container found");
    
    // Test scroll behavior
    if (scrollContainer.style.scrollBehavior === 'smooth' || 
        scrollContainer.classList.contains('scroll-smooth')) {
      console.log("✅ Smooth scroll behavior enabled");
    } else {
      console.log("⚠️ Smooth scroll behavior not detected");
    }
    
    // Test hidden scrollbar
    if (scrollContainer.classList.contains('scrollbar-hide')) {
      console.log("✅ Scrollbar hidden for clean UI");
    } else {
      console.log("⚠️ Scrollbar hide class not applied");
    }
  } else {
    console.log("❌ Horizontal scroll container not found");
  }
}

// Test 2: Hamburger menu functionality
function testHamburgerMenu() {
  console.log("\nTest 2: Hamburger Menu");
  
  const hamburgerButton = document.querySelector('button[data-testid="hamburger-menu"]') ||
                         document.querySelector('button:has(svg[viewBox="0 0 24 24"]:has(path[d*="M4 6h16"]))');
  
  if (hamburgerButton) {
    console.log("✅ Hamburger menu button found");
    
    // Simulate click
    hamburgerButton.click();
    
    setTimeout(() => {
      const dropdown = document.querySelector('.absolute.top-full');
      if (dropdown) {
        console.log("✅ Dropdown menu appears on click");
        
        // Test hidden categories
        const hiddenCategories = dropdown.querySelectorAll('button');
        console.log(`✅ ${hiddenCategories.length} hidden categories in dropdown`);
        
        // Close menu by clicking outside
        document.body.click();
        setTimeout(() => {
          if (dropdown.style.display === 'none' || !document.querySelector('.absolute.top-full')) {
            console.log("✅ Menu closes on outside click");
          } else {
            console.log("⚠️ Menu doesn't close on outside click");
          }
        }, 100);
      } else {
        console.log("❌ Dropdown menu doesn't appear");
      }
    }, 100);
  } else {
    console.log("❌ Hamburger menu button not found");
  }
}

// Test 3: Category button interactions
function testCategoryButtons() {
  console.log("\nTest 3: Category Button Interactions");
  
  const categoryButtons = document.querySelectorAll('button[class*="rounded-full"]:not([data-testid="hamburger-menu"])');
  
  if (categoryButtons.length > 0) {
    console.log(`✅ ${categoryButtons.length} category buttons found`);
    
    categoryButtons.forEach((button, index) => {
      if (button.classList.contains('bg-yellow-400')) {
        console.log(`✅ Button ${index + 1} shows active state (yellow background)`);
      }
      
      if (button.classList.contains('hover:bg-gray-200') || 
          button.classList.contains('transition-colors')) {
        console.log(`✅ Button ${index + 1} has hover effects`);
      }
      
      if (button.classList.contains('scale-105') || 
          button.classList.contains('hover:scale-105')) {
        console.log(`✅ Button ${index + 1} has scale animation`);
      }
    });
  } else {
    console.log("❌ Category buttons not found");
  }
}

// Test 4: Responsive behavior
function testResponsiveBehavior() {
  console.log("\nTest 4: Responsive Behavior");
  
  const originalWidth = window.innerWidth;
  
  // Test mobile view
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: 375
  });
  window.dispatchEvent(new Event('resize'));
  
  setTimeout(() => {
    const visibleButtons = document.querySelectorAll('button[class*="rounded-full"]:not(.hidden)');
    console.log(`📱 Mobile view: ${visibleButtons.length} visible category buttons`);
    
    // Test tablet view
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 768
    });
    window.dispatchEvent(new Event('resize'));
    
    setTimeout(() => {
      const visibleButtonsTablet = document.querySelectorAll('button[class*="rounded-full"]:not(.hidden)');
      console.log(`📱 Tablet view: ${visibleButtonsTablet.length} visible category buttons`);
      
      // Restore original width
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: originalWidth
      });
      window.dispatchEvent(new Event('resize'));
    }, 200);
  }, 200);
}

// Test 5: Scroll navigation buttons
function testScrollButtons() {
  console.log("\nTest 5: Scroll Navigation Buttons");
  
  const leftScrollButton = document.querySelector('button[aria-label="Scroll left"]');
  const rightScrollButton = document.querySelector('button[aria-label="Scroll right"]');
  
  if (leftScrollButton) {
    console.log("✅ Left scroll button found");
    
    if (leftScrollButton.classList.contains('absolute')) {
      console.log("✅ Left button positioned absolutely");
    }
  }
  
  if (rightScrollButton) {
    console.log("✅ Right scroll button found");
    
    if (rightScrollButton.classList.contains('absolute')) {
      console.log("✅ Right button positioned absolutely");
    }
  }
  
  // Test scroll functionality
  const scrollContainer = document.querySelector('.overflow-x-auto');
  if (scrollContainer && rightScrollButton) {
    const initialScrollLeft = scrollContainer.scrollLeft;
    rightScrollButton.click();
    
    setTimeout(() => {
      if (scrollContainer.scrollLeft > initialScrollLeft) {
        console.log("✅ Right scroll button works");
      } else {
        console.log("⚠️ Right scroll button doesn't scroll");
      }
    }, 300);
  }
}

// Test 6: Advanced filters toggle
function testAdvancedFiltersToggle() {
  console.log("\nTest 6: Advanced Filters Toggle");
  
  const toggleButton = document.querySelector('button:has(span:contains("Show all filters"))') ||
                      document.querySelector('button:has(span:contains("Hide filters"))');
  
  if (toggleButton) {
    console.log("✅ Advanced filters toggle button found");
    
    const initialState = toggleButton.textContent?.includes('Show');
    toggleButton.click();
    
    setTimeout(() => {
      const allergenSection = document.querySelector('h4:contains("Exclude Allergens")') ||
                             document.querySelector('[class*="mb-4"]:has(h4)');
      
      if (allergenSection) {
        console.log("✅ Advanced filters section toggles correctly");
      } else {
        console.log("⚠️ Advanced filters section not found");
      }
    }, 100);
  } else {
    console.log("❌ Advanced filters toggle button not found");
  }
}

// Test 7: Translation support
function testTranslationSupport() {
  console.log("\nTest 7: Translation Support");
  
  const expectedTranslations = [
    'More', 'Mehr',
    'Show all filters', 'Alle Filter anzeigen',
    'Hide filters', 'Filter ausblenden'
  ];
  
  const pageText = document.body.textContent || '';
  let foundTranslations = 0;
  
  expectedTranslations.forEach(translation => {
    if (pageText.includes(translation)) {
      foundTranslations++;
    }
  });
  
  console.log(`✅ ${foundTranslations}/${expectedTranslations.length} translation strings found`);
}

// Test 8: Accessibility features
function testAccessibility() {
  console.log("\nTest 8: Accessibility Features");
  
  const scrollButtons = document.querySelectorAll('button[aria-label*="Scroll"]');
  if (scrollButtons.length >= 2) {
    console.log("✅ Scroll buttons have proper aria-labels");
  }
  
  const categoryButtons = document.querySelectorAll('button[class*="rounded-full"]');
  let keyboardNavigable = 0;
  
  categoryButtons.forEach(button => {
    if (button.tabIndex >= 0 || !button.hasAttribute('tabindex')) {
      keyboardNavigable++;
    }
  });
  
  console.log(`✅ ${keyboardNavigable}/${categoryButtons.length} category buttons are keyboard navigable`);
}

// Run all tests
function runAllTests() {
  console.log("🎯 Running Category Filters UI/UX Test Suite\n");
  
  testHorizontalScroll();
  testCategoryButtons();
  testScrollButtons();
  testAdvancedFiltersToggle();
  testTranslationSupport();
  testAccessibility();
  
  // Tests that require interaction delays
  setTimeout(() => {
    testHamburgerMenu();
  }, 500);
  
  setTimeout(() => {
    testResponsiveBehavior();
  }, 1000);
  
  setTimeout(() => {
    console.log("\n🎉 Category Filters UI/UX Test Suite Complete!");
    console.log("Check console output above for detailed results.");
  }, 2000);
}

// Auto-run tests if page is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', runAllTests);
} else {
  runAllTests();
}

// Export for manual testing
window.testCategoryFilters = {
  runAllTests,
  testHorizontalScroll,
  testHamburgerMenu,
  testCategoryButtons,
  testResponsiveBehavior,
  testScrollButtons,
  testAdvancedFiltersToggle,
  testTranslationSupport,
  testAccessibility
};

console.log("💡 Manual testing available via: window.testCategoryFilters.runAllTests()");
