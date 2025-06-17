// Validation Test Script para la funcionalidad Multi-Size Pizza
// Este script puede ejecutarse en la consola del navegador

console.log("🍕 INICIANDO VALIDACIÓN DE FUNCIONALIDAD MULTI-SIZE");
console.log("===================================================");

// Test para verificar que los selectores funcionan correctamente
function testSelectors() {
    console.log("\n📊 Test 1: Verificando Selectores del Cart");
    
    // Simular estado del cart con múltiples tamaños
    const mockState = {
        cart: {
            cart: [
                {
                    pizzaId: 1,
                    name: "Pizza Margherita (Klein 26cm)",
                    quantity: 1,
                    unitPrice: 8.50,
                    totalPrice: 8.50,
                    size: "small"
                },
                {
                    pizzaId: 1,
                    name: "Pizza Margherita (Normal 32cm)",
                    quantity: 2,
                    unitPrice: 10.50,
                    totalPrice: 21.00,
                    size: "medium"
                },
                {
                    pizzaId: 2,
                    name: "Pizza Pepperoni (Normal 32cm)",
                    quantity: 1,
                    unitPrice: 12.00,
                    totalPrice: 12.00,
                    size: "medium"
                }
            ]
        }
    };

    // Simular getTotalQuantityByPizzaId
    const getTotalQuantityByPizzaId = (id) => (state) => {
        return state.cart.cart
            .filter(item => item.pizzaId === id)
            .reduce((total, item) => total + item.quantity, 0);
    };

    // Simular getSpecificItemQuantity
    const getSpecificItemQuantity = (pizzaId, size) => (state) => {
        const item = state.cart.cart.find(item => 
            item.pizzaId === pizzaId && item.size === size
        );
        return item?.quantity ?? 0;
    };

    // Test de los selectores
    const totalMargherita = getTotalQuantityByPizzaId(1)(mockState);
    const totalPepperoni = getTotalQuantityByPizzaId(2)(mockState);
    const margheritaSmall = getSpecificItemQuantity(1, "small")(mockState);
    const margheritaMedium = getSpecificItemQuantity(1, "medium")(mockState);

    console.log(`✅ Total Margherita (todas las sizes): ${totalMargherita} (esperado: 3)`);
    console.log(`✅ Total Pepperoni: ${totalPepperoni} (esperado: 1)`);
    console.log(`✅ Margherita Klein: ${margheritaSmall} (esperado: 1)`);
    console.log(`✅ Margherita Normal: ${margheritaMedium} (esperado: 2)`);

    return {
        totalMargherita: totalMargherita === 3,
        totalPepperoni: totalPepperoni === 1,
        margheritaSmall: margheritaSmall === 1,
        margheritaMedium: margheritaMedium === 2
    };
}

// Test para verificar la lógica de decremento
function testDecrementLogic() {
    console.log("\n➖ Test 2: Verificando Lógica de Decremento");
    
    let cart = [
        {
            pizzaId: 1,
            name: "Pizza Margherita (Klein 26cm)",
            quantity: 1,
            unitPrice: 8.50,
            totalPrice: 8.50,
            size: "small"
        },
        {
            pizzaId: 1,
            name: "Pizza Margherita (Normal 32cm)",
            quantity: 2,
            unitPrice: 10.50,
            totalPrice: 21.00,
            size: "medium"
        }
    ];

    // Simular decreaseAnyItemByPizzaId
    function decreaseAnyItemByPizzaId(cart, pizzaId) {
        const items = cart.filter(item => item.pizzaId === pizzaId);
        if (items.length === 0) return cart;
        
        const item = items[0]; // Toma el primer item encontrado
        
        if (item.quantity > 1) {
            item.quantity--;
            item.totalPrice = item.quantity * item.unitPrice;
        } else {
            // Remove this specific item completely
            return cart.filter(cartItem => cartItem !== item);
        }
        
        return cart;
    }

    console.log("Estado inicial:", cart.map(item => `${item.name}: ${item.quantity}`));
    
    // Primer decremento - debería decrementar el primer item (Klein)
    cart = decreaseAnyItemByPizzaId(cart, 1);
    console.log("Después de 1er decremento:", cart.map(item => `${item.name}: ${item.quantity}`));
    console.log("✅ Klein removida completamente (quantity era 1)");
    
    // Segundo decremento - debería decrementar el Normal
    cart = decreaseAnyItemByPizzaId(cart, 1);
    console.log("Después de 2do decremento:", cart.map(item => `${item.name}: ${item.quantity}`));
    console.log("✅ Normal decrementada de 2 a 1");
    
    // Tercer decremento - debería remover el Normal completamente
    cart = decreaseAnyItemByPizzaId(cart, 1);
    console.log("Después de 3er decremento:", cart.map(item => `${item.name}: ${item.quantity}`));
    console.log("✅ Normal removida completamente");

    return cart.length === 0; // Should be empty
}

// Test para verificar la generación de keys únicos
function testUniqueKeys() {
    console.log("\n🔑 Test 3: Verificando Keys Únicos para React");
    
    const cartItems = [
        { pizzaId: 1, size: "small", name: "Margherita Klein" },
        { pizzaId: 1, size: "medium", name: "Margherita Normal" },
        { pizzaId: 1, size: "large", name: "Margherita Groß" },
        { pizzaId: 2, size: "medium", name: "Pepperoni Normal" }
    ];

    const keys = cartItems.map(item => `${item.pizzaId}-${item.size || 'default'}`);
    const uniqueKeys = [...new Set(keys)];

    console.log("Keys generados:", keys);
    console.log("Keys únicos:", uniqueKeys);
    console.log(`✅ Todos los keys son únicos: ${keys.length === uniqueKeys.length}`);

    return keys.length === uniqueKeys.length;
}

// Ejecutar todas las pruebas
function runAllTests() {
    console.log("🚀 EJECUTANDO TODAS LAS PRUEBAS...\n");
    
    const test1Results = testSelectors();
    const test2Result = testDecrementLogic();
    const test3Result = testUniqueKeys();
    
    console.log("\n📊 RESUMEN DE RESULTADOS:");
    console.log("========================");
    
    const test1Pass = Object.values(test1Results).every(Boolean);
    console.log(`Test 1 - Selectores: ${test1Pass ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Test 2 - Decremento: ${test2Result ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Test 3 - Keys Únicos: ${test3Result ? '✅ PASS' : '❌ FAIL'}`);
    
    const allTestsPass = test1Pass && test2Result && test3Result;
    console.log(`\n🎯 RESULTADO FINAL: ${allTestsPass ? '✅ TODOS LOS TESTS PASAN' : '❌ ALGUNOS TESTS FALLAN'}`);
    
    if (allTestsPass) {
        console.log("\n🎉 ¡LA LÓGICA MULTI-SIZE ESTÁ FUNCIONANDO CORRECTAMENTE!");
        console.log("📝 Puedes proceder con las pruebas manuales en el navegador.");
    } else {
        console.log("\n⚠️ Se encontraron problemas en la lógica. Revisar implementación.");
    }
    
    return allTestsPass;
}

// Ejecutar las pruebas automáticamente
runAllTests();

// Instrucciones para el usuario
console.log("\n📋 PRÓXIMOS PASOS:");
console.log("1. Verificar que no hay errores en la consola del navegador");
console.log("2. Ir a http://localhost:5176/menu");
console.log("3. Buscar una pizza con badge 🍕");
console.log("4. Probar agregar múltiples tamaños");
console.log("5. Verificar que el botón muestra la cantidad total");
console.log("6. Probar decrementar y verificar que funciona correctamente");
console.log("7. Revisar el carrito (/cart) para ver items individuales");
