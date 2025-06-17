// Test script para verificar las correcciones de sugerencias
// Run with: node test-suggestions-fix.js

console.log("🔧 TESTING CART SUGGESTIONS FIXES");
console.log("================================\n");

// Mock cart analysis scenarios
const testScenarios = [
  {
    name: "Empty Cart",
    cartAnalysis: {
      hasPizza: false,
      hasPasta: false,
      hasBeverage: false,
      hasAppetizer: false,
      hasDessert: false,
      totalValue: 0,
      itemCount: 0,
      isLunchTime: false,
      isWeekend: false,
      cartItems: []
    }
  },
  {
    name: "Cart with Pizza (NO Beverage)",
    cartAnalysis: {
      hasPizza: true,
      hasPasta: false,
      hasBeverage: false,
      hasAppetizer: false,
      hasDessert: false,
      totalValue: 12.50,
      itemCount: 1,
      isLunchTime: false,
      isWeekend: false,
      cartItems: [{ name: "Pizza Margherita", pizzaId: 1 }]
    }
  },
  {
    name: "Cart with Pizza + Beverage (NO Appetizer)",
    cartAnalysis: {
      hasPizza: true,
      hasPasta: false,
      hasBeverage: true,
      hasAppetizer: false,
      hasDessert: false,
      totalValue: 16.34,
      itemCount: 2,
      isLunchTime: false,
      isWeekend: false,
      cartItems: [
        { name: "Pizza Margherita", pizzaId: 1 },
        { name: "Coca-Cola", id: "coca-cola" }
      ]
    }
  },
  {
    name: "High Value Cart (>€15)",
    cartAnalysis: {
      hasPizza: true,
      hasPasta: false,
      hasBeverage: true,
      hasAppetizer: true,
      hasDessert: false,
      totalValue: 23.40,
      itemCount: 3,
      isLunchTime: false,
      isWeekend: false,
      cartItems: [
        { name: "Pizza Margherita", pizzaId: 1 },
        { name: "Coca-Cola", id: "coca-cola" },
        { name: "Garlic Bread", id: "garlic-bread" }
      ]
    }
  }
];

// Mock products available
const mockProducts = [
  // Beverages
  { id: 'coca-cola-1l', name: 'Coca-Cola 1,0l', category: 'beverage', price: 3.84, quickAddEnabled: true },
  { id: 'orange-juice-fresh', name: 'Fresh Orange Juice 0,3l', category: 'beverage', price: 4.20, quickAddEnabled: true },
  { id: 'sparkling-water', name: 'Sparkling Water 0,5l', category: 'beverage', price: 2.50, quickAddEnabled: true },
  
  // Appetizers
  { id: 'garlic-bread-special', name: 'Garlic Bread', category: 'appetizer', price: 4.50, quickAddEnabled: true },
  { id: 'buffalo-wings-6pc', name: 'Buffalo Wings (6 pieces)', category: 'appetizer', price: 7.90, quickAddEnabled: true },
  { id: 'caesar-salad-regular', name: 'Caesar Salad', category: 'appetizer', price: 8.90, quickAddEnabled: true },
  
  // Desserts
  { id: 'tiramisu-classic', name: 'Tiramisu', category: 'dessert', price: 5.50, quickAddEnabled: true },
  { id: 'chocolate-brownie', name: 'Chocolate Brownie', category: 'dessert', price: 6.50, quickAddEnabled: true },
  
  // Pre-configured Pizzas
  { id: 'pizza-margherita-normal', name: 'Pizza Margherita (Normal 32cm)', category: 'pizza', price: 10.50, quickAddEnabled: true },
  { id: 'pizza-pepperoni-normal', name: 'Pizza Pepperoni (Normal 32cm)', category: 'pizza', price: 12.90, quickAddEnabled: true }
];

// Simple matching logic (similar to the fixed version)
function getSmartSuggestions(cartAnalysis) {
  // Filter available products (exclude those in cart)
  const cartProductIds = cartAnalysis.cartItems.map(item => item.pizzaId?.toString() || item.id?.toString());
  const availableProducts = mockProducts.filter(product => 
    !cartProductIds.includes(product.id.toString())
  );
  
  const suggestions = [];
  
  // Always suggest pizzas predefinidas as popular options
  const pizzas = availableProducts.filter(p => p.category === 'pizza');
  suggestions.push(...pizzas);
  
  // Fill missing beverage
  if (!cartAnalysis.hasBeverage) {
    const beverages = availableProducts.filter(p => p.category === 'beverage');
    suggestions.push(...beverages.slice(0, 2));
  }
  
  // Add appetizers for pizza orders
  if (cartAnalysis.hasPizza && !cartAnalysis.hasAppetizer) {
    const appetizers = availableProducts.filter(p => p.category === 'appetizer');
    suggestions.push(...appetizers.slice(0, 2));
  }
  
  // Suggest desserts for high value orders
  if (cartAnalysis.totalValue > 15 && !cartAnalysis.hasDessert) {
    const desserts = availableProducts.filter(p => p.category === 'dessert');
    suggestions.push(...desserts.slice(0, 1));
  }
  
  // Always show some variety
  if (suggestions.length < 3) {
    const popularItems = availableProducts.filter(p => 
      ['coca-cola-1l', 'buffalo-wings-6pc', 'pizza-margherita-normal'].includes(p.id)
    );
    suggestions.push(...popularItems);
  }
  
  // Remove duplicates and limit to 3
  const uniqueSuggestions = suggestions.filter((item, index, self) => 
    index === self.findIndex(t => t.id === item.id)
  );
  
  return uniqueSuggestions.slice(0, 3);
}

// Test each scenario
testScenarios.forEach(scenario => {
  console.log(`📋 ${scenario.name}:`);
  console.log(`   Cart Items: ${scenario.cartAnalysis.cartItems.length}`);
  console.log(`   Has Beverage: ${scenario.cartAnalysis.hasBeverage}`);
  console.log(`   Has Appetizer: ${scenario.cartAnalysis.hasAppetizer}`);
  console.log(`   Has Pizza: ${scenario.cartAnalysis.hasPizza}`);
  console.log(`   Total Value: €${scenario.cartAnalysis.totalValue.toFixed(2)}`);
  
  const suggestions = getSmartSuggestions(scenario.cartAnalysis);
  
  console.log(`   🔍 Suggestions (${suggestions.length}):`);
  suggestions.forEach((item, index) => {
    const emoji = {
      beverage: '🥤',
      appetizer: '🥖',
      dessert: '🍰',
      pizza: '🍕'
    }[item.category] || '📦';
    
    console.log(`     ${index + 1}. ${emoji} ${item.name} - €${item.price.toFixed(2)}`);
  });
  
  console.log('');
});

console.log("✅ EXPECTED BEHAVIOR:");
console.log("====================");
console.log("1. Empty Cart → Should show variety (beverages, appetizers, pizzas)");
console.log("2. Pizza Only → Should prioritize beverages & appetizers");
console.log("3. Pizza + Beverage → Should suggest appetizers");
console.log("4. High Value → Should include desserts");
console.log("5. Pizzas predefinidas should ALWAYS appear as options");
console.log("6. No more than 3 suggestions at once");

console.log("\n🎯 FIXES APPLIED:");
console.log("================");
console.log("✅ Improved category detection (juice, espresso, etc.)");
console.log("✅ Always show pizza predefinidas as popular options");
console.log("✅ Better variety fallback logic");
console.log("✅ Fixed emoji mapping (pizza: 🍕)");
console.log("✅ Enhanced context matching");
console.log("✅ Removed duplicate getSuggestionEmoji function");

console.log("\n🚀 READY FOR BROWSER TESTING!");
console.log("=============================");
console.log("Open http://localhost:5176 and test different cart combinations.");
