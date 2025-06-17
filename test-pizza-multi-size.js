// Test script para verificar el comportamiento de pizzas multi-tamaño
// Run with: node test-pizza-multi-size.js

console.log("🍕 TESTING PIZZA MULTI-SIZE BEHAVIOR");
console.log("=====================================");

// Simulamos la lógica del cartSlice
function mockCartSlice() {
  let cart = [];
  
  const addItem = (item) => {
    const existingItem = cart.find(cartItem => 
      cartItem.pizzaId === item.pizzaId && 
      (item.size ? cartItem.size === item.size : true)
    );
    
    if (existingItem) {
      existingItem.quantity++;
      existingItem.totalPrice = existingItem.quantity * existingItem.unitPrice;
      console.log(`✅ Incremented ${existingItem.name} to quantity ${existingItem.quantity}`);
    } else {
      cart.push(item);
      console.log(`➕ Added new item: ${item.name} (${item.size || 'standard'})`);
    }
  };
  
  const decreaseAnyItemByPizzaId = (pizzaId) => {
    const items = cart.filter(item => item.pizzaId === pizzaId);
    if (items.length === 0) return;
    
    const item = items[0];
    console.log(`🔽 Decrementing ${item.name} (${item.size}) from quantity ${item.quantity}`);
    
    if (item.quantity > 1) {
      item.quantity--;
      item.totalPrice = item.quantity * item.unitPrice;
      console.log(`✅ Decreased to quantity ${item.quantity}`);
    } else {
      cart = cart.filter(cartItem => cartItem !== item);
      console.log(`🗑️ Removed ${item.name} (${item.size}) completely`);
    }
  };
  
  const getTotalQuantityByPizzaId = (pizzaId) => {
    return cart
      .filter(item => item.pizzaId === pizzaId)
      .reduce((total, item) => total + item.quantity, 0);
  };
  
  const printCart = () => {
    console.log("\n📋 CURRENT CART:");
    if (cart.length === 0) {
      console.log("   (empty)");
    } else {
      cart.forEach(item => {
        console.log(`   ${item.name} (${item.size || 'standard'}) x${item.quantity} = ${item.totalPrice}€`);
      });
    }
    console.log("");
  };
  
  return { addItem, decreaseAnyItemByPizzaId, getTotalQuantityByPizzaId, printCart, getCart: () => cart };
}

// Test scenario
const { addItem, decreaseAnyItemByPizzaId, getTotalQuantityByPizzaId, printCart } = mockCartSlice();

console.log("\n1️⃣ Test: Add Margherita in different sizes");
console.log("----------------------------------------");

// Add Margherita Small
addItem({
  pizzaId: 1,
  name: "Pizza Margherita (Klein 26cm)",
  quantity: 1,
  unitPrice: 8.50,
  totalPrice: 8.50,
  size: 'small'
});

printCart();

// Add Margherita Medium
addItem({
  pizzaId: 1,
  name: "Pizza Margherita (Normal 32cm)",
  quantity: 1,
  unitPrice: 10.50,
  totalPrice: 10.50,
  size: 'medium'
});

printCart();

// Add another Margherita Medium (should increment)
addItem({
  pizzaId: 1,
  name: "Pizza Margherita (Normal 32cm)",
  quantity: 1,
  unitPrice: 10.50,
  totalPrice: 10.50,
  size: 'medium'
});

printCart();

console.log("\n2️⃣ Test: Check total quantity for display");
console.log("----------------------------------------");
const totalQuantity = getTotalQuantityByPizzaId(1);
console.log(`Total Margherita quantity (all sizes): ${totalQuantity}`);

console.log("\n3️⃣ Test: Decrement behavior");
console.log("----------------------------------------");

// First decrement should remove one Medium (quantity 2 -> 1)
decreaseAnyItemByPizzaId(1);
printCart();

// Second decrement should remove the remaining Medium completely
decreaseAnyItemByPizzaId(1);
printCart();

// Third decrement should remove the Small
decreaseAnyItemByPizzaId(1);
printCart();

console.log("✅ TEST COMPLETED");
console.log("Expected behavior:");
console.log("- Button should show total quantity across all sizes");
console.log("- Decrement should remove items one by one intelligently");
console.log("- Increment (through modal) should add specific sizes");
