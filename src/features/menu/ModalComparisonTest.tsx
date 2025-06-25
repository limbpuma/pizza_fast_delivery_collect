import { useState } from 'react';
import PizzaSizeModal from './PizzaSizeModal';
import AdvancedPizzaModal from './AdvancedPizzaModal';

// Mock pizza data for testing
const testPizza = {
  id: 'pizza-test-1',
  name: 'Pizza Margherita',
  unitPrice: 12.90,
  category: 'Pizza',
  sizes: [
    { name: 'Klein', price: 10.90 },
    { name: 'Groß', price: 12.90 },
    { name: 'XXL', price: 16.90 }
  ],
  ingredients: ['Tomatensoße', 'Mozzarella', 'Basilikum'],
  soldOut: false
};

export default function ModalComparisonTest() {
  const [showBasicModal, setShowBasicModal] = useState(false);
  const [showAdvancedModal, setShowAdvancedModal] = useState(false);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8">
        🍕 Modal Comparison Test
      </h1>
      
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Basic Modal Test */}
        <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            🔧 Basic Pizza Modal (Phase 1)
          </h2>
          <p className="text-gray-600 mb-4">
            Optimized modal with improved mobile UX, responsive design, and accessibility features.
          </p>
          <ul className="text-sm text-gray-600 mb-6 space-y-1">
            <li>• Size selection</li>
            <li>• Price calculation</li>
            <li>• Add to cart</li>
            <li>• Mobile optimized</li>
          </ul>
          <button
            onClick={() => setShowBasicModal(true)}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-3 rounded-lg font-medium transition-colors"
          >
            Open Basic Modal
          </button>
        </div>

        {/* Advanced Modal Test */}
        <div className="border border-green-200 rounded-lg p-6 bg-green-50 shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-green-800">
            🧪 Advanced Pizza Modal (Phase 3)
          </h2>
          <p className="text-green-700 mb-4">
            Complete ingredient system with preview, categories, search, and advanced customization.
          </p>
          <ul className="text-sm text-green-700 mb-6 space-y-1">
            <li>• Size & sauce selection</li>
            <li>• 40+ ingredients (Zutaten)</li>
            <li>• Category filtering</li>
            <li>• Search functionality</li>
            <li>• Price calculation with ingredients</li>
            <li>• Progressive disclosure UX</li>
          </ul>
          <button
            onClick={() => setShowAdvancedModal(true)}
            className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-medium transition-colors"
          >
            Open Advanced Modal
          </button>
        </div>
      </div>

      {/* Feature Comparison */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Feature Comparison</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left p-2">Feature</th>
                <th className="text-center p-2 text-orange-600">Basic Modal</th>
                <th className="text-center p-2 text-green-600">Advanced Modal</th>
              </tr>
            </thead>
            <tbody className="space-y-2">
              <tr className="border-b border-gray-100">
                <td className="p-2">Size Selection</td>
                <td className="text-center p-2">✅</td>
                <td className="text-center p-2">✅</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="p-2">Sauce Selection</td>
                <td className="text-center p-2">❌</td>
                <td className="text-center p-2">✅</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="p-2">Ingredient System</td>
                <td className="text-center p-2">❌</td>
                <td className="text-center p-2">✅ (40+ options)</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="p-2">Search & Filter</td>
                <td className="text-center p-2">❌</td>
                <td className="text-center p-2">✅</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="p-2">Quantity Controls</td>
                <td className="text-center p-2">❌</td>
                <td className="text-center p-2">✅</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="p-2">Price Calculation</td>
                <td className="text-center p-2">✅ (basic)</td>
                <td className="text-center p-2">✅ (advanced)</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="p-2">Mobile Optimization</td>
                <td className="text-center p-2">✅</td>
                <td className="text-center p-2">✅</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="p-2">Accessibility</td>
                <td className="text-center p-2">✅</td>
                <td className="text-center p-2">✅</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <PizzaSizeModal
        isOpen={showBasicModal}
        onClose={() => setShowBasicModal(false)}
        pizza={testPizza}
      />

      <AdvancedPizzaModal
        isOpen={showAdvancedModal}
        onClose={() => setShowAdvancedModal(false)}
        pizza={testPizza}
      />
    </div>
  );
}
