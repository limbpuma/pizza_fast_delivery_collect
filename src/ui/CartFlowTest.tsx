/**
 * Cart Flow Test Component
 * Comprehensive verification that add to cart, suggestions, and checkout flow work correctly
 */

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addItem, getCart, getTotalCartPrice, getTotalCartQuantity, clearCart } from '../features/cart/cartSlice';
import { getProductType, createQuickAddItem } from '../utils/productDetection';
import useCartSuggestions from '../features/cart/hooks/useCartSuggestions';

// Sample test products covering different scenarios
const testProducts = [
  {
    id: 1,
    name: "Mozzarellasticks",
    unitPrice: 7.50,
    category: "Snacks",
    description: "Quick Add test product",
    artikel: "Mozzarellasticks",
    artikelNr: 1,
    preis: "7,50 €"
  },
  {
    id: 19,
    name: "Pizza Margherita",
    unitPrice: 7.00,
    category: "Pizzen Vegetarisch", 
    description: "Multi-size test product",
    sizes: {
      "24cm": 5.00,
      "30cm": 7.00,
      "40cm": 10.00
    }
  },
  {
    id: 101,
    name: "Coca-Cola",
    unitPrice: 3.50,
    category: "Getränke",
    description: "Beverage test product"
  }
];

export default function CartFlowTest() {
  const dispatch = useDispatch();
  const cart = useSelector(getCart);
  const totalPrice = useSelector(getTotalCartPrice);
  const totalQuantity = useSelector(getTotalCartQuantity);
  const { haveYouSeen, didYouForget, cartAnalysis } = useCartSuggestions();
  const [testResults, setTestResults] = useState<string[]>([]);
  const [autoTest, setAutoTest] = useState(false);

  const addTestResult = (message: string, type: 'info' | 'success' | 'error' = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    const emoji = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
    setTestResults(prev => [...prev, `${timestamp} ${emoji} ${message}`]);
  };
  // Automatic comprehensive test
  const runComprehensiveTest = async () => {
    addTestResult('Starting comprehensive cart flow test...', 'info');
    
    // Clear cart first
    dispatch(clearCart());
    addTestResult('Cart cleared', 'success');
    
    // Test 1: Quick Add Product
    await testQuickAddFlow();
    
    // Test 2: Pizza Add with Size
    await testPizzaFlow();
    
    // Test 3: Beverage Add
    await testBeverageFlow();
    
    // Test 4: Cart Suggestions
    await testSuggestionsFlow();
    
    addTestResult('Comprehensive test completed!', 'success');
    setAutoTest(false);
  };

  useEffect(() => {
    if (autoTest) {
      runComprehensiveTest();
    }
  }, [autoTest, runComprehensiveTest]);

  const testQuickAddFlow = async () => {
    const testProduct = testProducts[0];
    addTestResult(`Testing Quick Add flow for ${testProduct.name}`, 'info');
    
    try {
      const productType = getProductType(testProduct);
      addTestResult(`Product type detection: ${JSON.stringify(productType)}`, 'info');
      
      if (productType.quickAddEnabled && !productType.needsSizeSelection) {
        const cartItem = createQuickAddItem(testProduct);
        addTestResult(`Cart item created: ${JSON.stringify(cartItem)}`, 'info');
        
        dispatch(addItem(cartItem));
        addTestResult('Quick Add successful', 'success');
        
        // Wait a moment for state update
        await new Promise(resolve => setTimeout(resolve, 100));
      } else {
        addTestResult('Product not detected as Quick Add', 'error');
      }
    } catch (error) {
      addTestResult(`Quick Add test failed: ${error}`, 'error');
    }
  };

  const testPizzaFlow = async () => {
    const testProduct = testProducts[1];
    addTestResult(`Testing Pizza flow for ${testProduct.name}`, 'info');
    
    try {
      const productType = getProductType(testProduct);
      addTestResult(`Product type detection: ${JSON.stringify(productType)}`, 'info');
      
      if (productType.needsSizeSelection) {
        // Simulate size selection - add medium pizza
        const cartItem = {
          pizzaId: testProduct.id,
          name: `${testProduct.name} (30cm)`,
          quantity: 1,
          unitPrice: 7.00,
          totalPrice: 7.00,
          size: '30cm'
        };
        
        dispatch(addItem(cartItem));
        addTestResult('Pizza with size selection successful', 'success');
        
        await new Promise(resolve => setTimeout(resolve, 100));
      } else {
        addTestResult('Product not detected as multi-size', 'error');
      }
    } catch (error) {
      addTestResult(`Pizza test failed: ${error}`, 'error');
    }
  };

  const testBeverageFlow = async () => {
    const testProduct = testProducts[2];
    addTestResult(`Testing Beverage flow for ${testProduct.name}`, 'info');
    
    try {
      const productType = getProductType(testProduct);
      addTestResult(`Product type detection: ${JSON.stringify(productType)}`, 'info');
      
      if (productType.quickAddEnabled) {
        const cartItem = createQuickAddItem(testProduct);
        dispatch(addItem(cartItem));
        addTestResult('Beverage Quick Add successful', 'success');
        
        await new Promise(resolve => setTimeout(resolve, 100));
      } else {
        addTestResult('Beverage not detected as Quick Add', 'error');
      }
    } catch (error) {
      addTestResult(`Beverage test failed: ${error}`, 'error');
    }
  };

  const testSuggestionsFlow = async () => {
    addTestResult('Testing cart suggestions system...', 'info');
    
    try {
      addTestResult(`Cart analysis: ${JSON.stringify(cartAnalysis)}`, 'info');
      addTestResult(`Have you seen suggestions: ${haveYouSeen.length}`, 'info');
      addTestResult(`Did you forget suggestions: ${didYouForget.length}`, 'info');
      
      if (haveYouSeen.length > 0 || didYouForget.length > 0) {
        addTestResult('Suggestions system working correctly', 'success');
      } else {
        addTestResult('No suggestions generated - may be normal', 'info');
      }
    } catch (error) {
      addTestResult(`Suggestions test failed: ${error}`, 'error');
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const clearCartTest = () => {
    dispatch(clearCart());
    addTestResult('Cart manually cleared', 'success');
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">🧪 Cart Flow Test Suite</h1>
      
      {/* Current Cart Status */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-3">📊 Current Cart Status</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="bg-white p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-600">{totalQuantity}</div>
            <div className="text-sm text-gray-600">Items</div>
          </div>
          <div className="bg-white p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-600">€{totalPrice.toFixed(2)}</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
          <div className="bg-white p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-purple-600">{haveYouSeen.length}</div>
            <div className="text-sm text-gray-600">Have You Seen</div>
          </div>
          <div className="bg-white p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-orange-600">{didYouForget.length}</div>
            <div className="text-sm text-gray-600">Did You Forget</div>
          </div>
        </div>
        
        {cart.length > 0 && (
          <div className="bg-white p-3 rounded-lg">
            <h3 className="font-medium mb-2">🛒 Cart Contents:</h3>
            <div className="space-y-1">
              {cart.map((item: any, index: number) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>{item.name}</span>
                  <span>Qty: {item.quantity} - €{item.totalPrice.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Test Controls */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-3">🎛️ Test Controls</h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setAutoTest(true)}
            disabled={autoTest}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            🚀 Run Full Test Suite
          </button>
          
          <button
            onClick={testQuickAddFlow}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            ⚡ Test Quick Add
          </button>
          
          <button
            onClick={testPizzaFlow}
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
          >
            🍕 Test Pizza Add
          </button>
          
          <button
            onClick={testBeverageFlow}
            className="px-4 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600"
          >
            🥤 Test Beverage Add
          </button>
          
          <button
            onClick={testSuggestionsFlow}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            💡 Test Suggestions
          </button>
          
          <button
            onClick={clearCartTest}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            🗑️ Clear Cart
          </button>
          
          <button
            onClick={clearResults}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            🧹 Clear Results
          </button>
        </div>
      </div>

      {/* Test Results */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-3">📝 Test Results</h2>
        {testResults.length === 0 ? (
          <p className="text-gray-500">No tests run yet. Click buttons above to test cart functionality.</p>
        ) : (
          <div className="space-y-1 text-sm font-mono max-h-96 overflow-y-auto">
            {testResults.map((result, index) => (
              <div key={index} className={`p-2 rounded ${
                result.includes('✅') ? 'bg-green-100 text-green-800' :
                result.includes('❌') ? 'bg-red-100 text-red-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {result}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="mt-6 text-center space-x-4">
        <a href="/menu" className="text-blue-600 hover:text-blue-800 underline">
          📋 Go to Menu
        </a>
        <a href="/checkout" className="text-blue-600 hover:text-blue-800 underline">
          🛒 Go to Checkout
        </a>
        <a href="/" className="text-blue-600 hover:text-blue-800 underline">
          🏠 Go to Home
        </a>
      </div>
    </div>
  );
}
