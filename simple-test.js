// Simple Test - Verificación de Lógica Core
console.log("🔍 TESTING CORE LOGIC");

// Test 1: Verificar que el selector getTotalQuantityByPizzaId funciona
const mockCart = [
    { pizzaId: 1, quantity: 1, size: "small" },
    { pizzaId: 1, quantity: 2, size: "medium" },
    { pizzaId: 2, quantity: 1, size: "medium" }
];

const mockState = { cart: { cart: mockCart } };

// Simular getTotalQuantityByPizzaId
const getTotalQuantityByPizzaId = (id) => (state) =>
    state.cart.cart
        .filter(item => item.pizzaId === id)
        .reduce((total, item) => total + item.quantity, 0);

const totalForPizza1 = getTotalQuantityByPizzaId(1)(mockState);
const totalForPizza2 = getTotalQuantityByPizzaId(2)(mockState);

console.log(`Pizza 1 total: ${totalForPizza1} (expected: 3)`);
console.log(`Pizza 2 total: ${totalForPizza2} (expected: 1)`);

// Test 2: Verificar unique keys
const cartItems = [
    { pizzaId: 1, size: "small" },
    { pizzaId: 1, size: "medium" },
    { pizzaId: 2, size: "medium" }
];

const keys = cartItems.map(item => `${item.pizzaId}-${item.size || 'default'}`);
console.log("Generated keys:", keys);
console.log("Are all keys unique?", keys.length === new Set(keys).size);

console.log("✅ Core logic tests completed");
