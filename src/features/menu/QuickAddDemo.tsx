import { getProductType } from '../../utils/productHelpers';

interface QuickAddDemoProps {
  menu: any[];
}

function QuickAddDemo({ menu }: QuickAddDemoProps) {

  const pizzaProducts = menu.filter(item => {
    const productType = getProductType(item);
    return !productType.quickAddEnabled;
  });

  const quickAddProducts = menu.filter(item => {
    const productType = getProductType(item);
    return productType.quickAddEnabled;
  });

  return (
    <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-6 mb-6 border border-blue-200">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        🚀 Quick Add Demo - Smart Product Detection
      </h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Pizza Products */}
        <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
          <h3 className="font-semibold text-orange-800 mb-3 flex items-center gap-2">
            🍕 Size Selection Required ({pizzaProducts.length})
          </h3>
          <p className="text-sm text-orange-700 mb-3">
            These products open size selection modal when you click the orange + button
          </p>
          <div className="space-y-2">
            {pizzaProducts.slice(0, 3).map(item => (
              <div key={item.id} className="flex items-center gap-2 text-sm">
                <span className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs">+</span>
                <span className="font-medium">{item.name}</span>
                <span className="text-orange-600">→ Modal</span>
              </div>
            ))}
            {pizzaProducts.length > 3 && (
              <p className="text-xs text-orange-600">+ {pizzaProducts.length - 3} more...</p>
            )}
          </div>
        </div>

        {/* Quick Add Products */}
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
            ⚡ Quick Add Enabled ({quickAddProducts.length})
          </h3>
          <p className="text-sm text-blue-700 mb-3">
            These products add directly to cart when you click the blue cart button
          </p>
          <div className="space-y-2">
            {quickAddProducts.map(item => (
              <div key={item.id} className="flex items-center gap-2 text-sm">
                <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">🛒</span>
                <span className="font-medium">{item.name}</span>
                <span className="text-blue-600">→ Cart</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
        <p className="text-sm text-yellow-800">
          <strong>💡 How to test:</strong> Look for different colored buttons in the menu below. 
          Orange buttons (🍕) open size modals, Blue buttons (⚡) add directly to cart with animation.
        </p>
      </div>
    </div>
  );
}

export default QuickAddDemo;
