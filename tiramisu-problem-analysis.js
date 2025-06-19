// 🔍 ANÁLISIS COMPLETO DEL PROBLEMA DEL TIRAMISU
console.log('🍰 TIRAMISU PROBLEM ANALYSIS');
console.log('============================\n');

// ESCENARIO REAL: Reproducir exactamente lo que pasa en la aplicación

console.log('📋 PASO 1: Tiramisu en dynamicSuggestions.ts');
console.log('============================================');

// Así aparece el Tiramisu en generateDynamicSuggestions()
const tiramisuInSuggestions = {
  id: 'mock-102',        // ← ID principal
  name: 'Tiramisu',
  price: 6.90,
  category: 'dessert',
  emoji: '🍰',
  source: 'mock-item',
  description: 'Classic Italian tiramisu',
  pizzaId: undefined     // ← CLAVE: desserts no tienen pizzaId
};

console.log('Estructura del Tiramisu en suggestions:');
console.log(JSON.stringify(tiramisuInSuggestions, null, 2));

console.log('\n📋 PASO 2: handleAddToCart en CartSuggestions.tsx');
console.log('================================================');

// Esto es lo que hace CartSuggestions.tsx línea ~45-55
const cartProduct = {
  id: tiramisuInSuggestions.id,           // 'mock-102'
  pizzaId: tiramisuInSuggestions.id,      // 'mock-102' ← PROBLEMA POTENCIAL
  name: tiramisuInSuggestions.name,       // 'Tiramisu'
  quantity: 1,
  unitPrice: tiramisuInSuggestions.price, // 6.90
  totalPrice: tiramisuInSuggestions.price,// 6.90
  size: 'standard',
  isQuickAdd: true,
  source: 'cart-suggestions'
};

console.log('Producto creado para el carrito:');
console.log(JSON.stringify(cartProduct, null, 2));

console.log('\n📋 PASO 3: Cart Analysis en useCartSuggestions.ts');
console.log('================================================');

// Simular cart con Tiramisu
const simulatedCart = [cartProduct];

// Esto es lo que hace analyzeCartContent()
const cartAnalysis = {
  cartItems: simulatedCart,
  itemCount: simulatedCart.length,
  hasDessert: simulatedCart.some(item => 
    item.name.toLowerCase().includes('tiramisu') ||
    item.name.toLowerCase().includes('dessert')
  ),
  totalValue: simulatedCart.reduce((sum, item) => sum + item.totalPrice, 0)
};

console.log('Cart Analysis generado:');
console.log(JSON.stringify(cartAnalysis, null, 2));

console.log('\n📋 PASO 4: Filtrado en generateAdvancedSmartSuggestions()');
console.log('========================================================');

// Esto es lo que hace dynamicSuggestions.ts línea ~255
const cartItems = cartAnalysis.cartItems || [];
const cartProductIds = cartItems.map(item => 
  item.pizzaId?.toString() || item.id?.toString()
);

console.log('Cart Product IDs extraídos:', cartProductIds);

// Lista de todas las sugerencias (incluyendo Tiramisu)
const allSuggestions = [
  { id: 'mock-101', name: 'Coca-Cola', category: 'beverage' },
  tiramisuInSuggestions,  // ← El Tiramisu que debe filtrarse
  { id: 'mock-103', name: 'Garlic Bread', category: 'appetizer' }
];

console.log('\nTodas las sugerencias disponibles:');
allSuggestions.forEach((s, i) => console.log(`  ${i+1}. ${s.name} (${s.id})`));

// FILTRADO - Esto es la lógica crítica
console.log('\n🔍 PROCESO DE FILTRADO:');
console.log('======================');

const availableSuggestions = allSuggestions.filter(suggestion => {
  const suggestionId = suggestion.id.toString();
  const suggestionPizzaId = suggestion.pizzaId?.toString();
  
  const isFilteredById = cartProductIds.includes(suggestionId);
  const isFilteredByPizzaId = suggestionPizzaId ? cartProductIds.includes(suggestionPizzaId) : false;
  const isFiltered = isFilteredById || isFilteredByPizzaId;
  
  if (suggestion.name.toLowerCase().includes('tiramisu')) {
    console.log(`🍰 TIRAMISU CHECK:`);
    console.log(`   - Suggestion ID: "${suggestionId}"`);
    console.log(`   - Suggestion PizzaID: ${suggestionPizzaId || 'undefined'}`);
    console.log(`   - Cart Product IDs: [${cartProductIds.join(', ')}]`);
    console.log(`   - Filtered by ID: ${isFilteredById}`);
    console.log(`   - Filtered by PizzaID: ${isFilteredByPizzaId}`);
    console.log(`   - RESULTADO: ${isFiltered ? 'FILTRADO ✅' : 'NO FILTRADO ❌'}`);
  }
  
  return !isFiltered;
});

console.log('\n📋 RESULTADO FINAL:');
console.log('==================');
console.log(`Sugerencias originales: ${allSuggestions.length}`);
console.log(`Sugerencias filtradas: ${availableSuggestions.length}`);
console.log(`Productos removidos: ${allSuggestions.length - availableSuggestions.length}`);

console.log('\nSugerencias que quedan:');
availableSuggestions.forEach((s, i) => console.log(`  ${i+1}. ${s.name}`));

const tiramisuStillPresent = availableSuggestions.some(s => s.name.toLowerCase().includes('tiramisu'));

console.log('\n🎯 DIAGNÓSTICO FINAL:');
console.log('====================');

if (tiramisuStillPresent) {
  console.log('❌ BUG CONFIRMADO: Tiramisu sigue presente en sugerencias');
  console.log('🔧 CAUSA: La lógica de filtrado tiene un error');
} else {
  console.log('✅ LÓGICA CORRECTA: Tiramisu se filtra correctamente');
  console.log('🚨 PROBLEMA: React no re-renderiza o timing issue');
}

console.log('\n📱 SIGUIENTE PASO:');
console.log('=================');
if (tiramisuStillPresent) {
  console.log('• Revisar lógica de filtrado en dynamicSuggestions.ts');
  console.log('• Verificar que cartProductIds incluya todos los IDs necesarios');
} else {
  console.log('• Revisar useCartSuggestions hook');
  console.log('• Verificar re-renderizado de CartSuggestions component');
  console.log('• Verificar timing entre Redux dispatch y React render');
}
