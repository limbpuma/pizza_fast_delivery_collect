// Test script to verify product classification
const { getProductType } = require('./src/utils/productHelpers.ts');

// Simulated pizza products (como los del menú real)
const testProducts = [
  {
    id: 1,
    name: "Margherita",
    ingredients: ["tomato", "mozzarella", "basil"],
    unitPrice: 12
  },
  {
    id: 2, 
    name: "Pepperoni",
    ingredients: ["tomato", "mozzarella", "pepperoni"],
    unitPrice: 14
  },
  {
    id: 3,
    name: "Coca Cola",
    ingredients: [],
    unitPrice: 3
  },
  {
    id: 4,
    name: "Tiramisu",
    ingredients: ["mascarpone", "coffee", "ladyfingers"],
    unitPrice: 6
  }
];

console.log("=== PRODUCT CLASSIFICATION TEST ===\n");

testProducts.forEach(product => {
  const productType = getProductType(product);
  console.log(`Product: ${product.name}`);
  console.log(`  Category: ${productType.category}`);
  console.log(`  Needs Size Selection: ${productType.needsSizeSelection}`);
  console.log(`  Quick Add Enabled: ${productType.quickAddEnabled}`);
  console.log(`  Button Color: ${productType.quickAddEnabled ? 'BLUE (Quick Add)' : 'ORANGE (Size Selection)'}\n`);
});

console.log("Expected behavior:");
console.log("- Margherita & Pepperoni: ORANGE button, open modal");
console.log("- Coca Cola & Tiramisu: BLUE button, direct add to cart");
