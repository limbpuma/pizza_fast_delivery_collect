import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useCartSuggestions } from './hooks/useCartSuggestions';
import { addItem, getCart } from './cartSlice';

function CartSuggestions() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const cart = useSelector(getCart);
  const [activeSection, setActiveSection] = useState<'seen' | 'forgot'>('seen');
  const [forceUpdate, setForceUpdate] = useState(0);
  
  // Use the smart suggestions hook
  const { haveYouSeen, didYouForget } = useCartSuggestions();
  
  // TIRAMISU FIX: Force component re-render when cart changes
  useEffect(() => {
    console.log('🔄 CartSuggestions: Cart changed, forcing component update', {
      cartLength: cart.length,
      cartItems: cart.map((item: any) => item.name)
    });
    setForceUpdate(prev => prev + 1);
  }, [cart]);
  
  // TIRAMISU DEBUG: Log component renders and suggestions
  console.log('🔄 CartSuggestions component rendered (update #' + forceUpdate + '):', {
    haveYouSeenCount: haveYouSeen.length,
    didYouForgetCount: didYouForget.length,
    haveYouSeenNames: haveYouSeen.map(s => s.name),
    didYouForgetNames: didYouForget.map(s => s.name),
    hasTiramisuInSeen: haveYouSeen.some(s => s.name.toLowerCase().includes('tiramisu')),
    hasTiramisuInForgot: didYouForget.some(s => s.name.toLowerCase().includes('tiramisu'))
  });
  // Handle adding suggestion to cart
  const handleAddToCart = (item: any) => {
    try {
      console.log('🛒 TIRAMISU DEBUG: Adding item to cart from suggestions:', {
        itemName: item.name,
        itemId: item.id,
        isTiramisu: item.name.toLowerCase().includes('tiramisu')
      });
        // Convert the suggestion to a cart-compatible product
      const cartProduct = {
        id: item.id,
        pizzaId: item.id, // Use id as pizzaId for cart compatibility
        name: item.name,
        quantity: 1,
        unitPrice: item.price,
        totalPrice: item.price,
        size: 'standard', // Default size for suggestions
        isQuickAdd: true,
        source: 'cart-suggestions'
      };
      
      console.log('🛒 TIRAMISU DEBUG: Cart product structure:', cartProduct);
      
      // Add to cart using Redux
      dispatch(addItem(cartProduct));
      
      console.log('✅ TIRAMISU DEBUG: Item dispatched to Redux store:', item.name);
      console.log('⏳ TIRAMISU DEBUG: Waiting for component re-render with updated suggestions...');
    } catch (error) {
      console.error('❌ Error adding to cart:', error);
    }
  };

  // Get current suggestions based on active section
  const currentSuggestions = activeSection === 'seen' ? haveYouSeen : didYouForget;

  // Don't render if no suggestions
  if (currentSuggestions.length === 0 && haveYouSeen.length === 0 && didYouForget.length === 0) {
    return null;
  }

  return (
    <div className="bg-blue-50 border-t border-blue-100">
      {/* Section Headers */}
      <div className="p-4 pb-0">
        <div className="flex space-x-1">
          {haveYouSeen.length > 0 && (
            <button
              onClick={() => setActiveSection('seen')}
              className={`
                px-3 py-2 text-sm font-medium rounded-lg transition-colors
                ${activeSection === 'seen' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-blue-600 hover:bg-blue-100'
                }
              `}
            >
              {t('cart.haveYouSeen', { default: 'Have you seen...' })}
            </button>
          )}
          {didYouForget.length > 0 && (
            <button
              onClick={() => setActiveSection('forgot')}
              className={`
                px-3 py-2 text-sm font-medium rounded-lg transition-colors
                ${activeSection === 'forgot' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-blue-600 hover:bg-blue-100'
                }
              `}
            >
              {t('cart.didYouForget', { default: 'Did you forget?' })}
            </button>
          )}
        </div>
      </div>

      {/* Suggestions List */}
      <div className="p-4 space-y-3">
        {currentSuggestions.map((item) => (
          <div key={item.id} className="bg-white rounded-lg p-3 shadow-sm border border-blue-100">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">
                    {getSuggestionEmoji(item.category || 'other')}
                  </span>                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900 text-sm">
                        <span className="text-xs text-gray-500 mr-1">
                          {t('menu.productNumber', { number: item.id })}
                        </span>
                        {item.name}
                      </h4>
                    </div>
                    {item.description && (
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 ml-3">
                <span className="font-semibold text-gray-900">
                  {item.price.toFixed(2)} €
                </span>                <button 
                  className="bg-orange-500 hover:bg-orange-600 text-white w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                  onClick={() => handleAddToCart(item)}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation for multiple items (future enhancement) */}
      {currentSuggestions.length > 3 && (
        <div className="flex justify-center pb-4">
          <div className="flex space-x-1">
            <button className="w-2 h-2 bg-blue-600 rounded-full"></button>
            <button className="w-2 h-2 bg-blue-300 rounded-full"></button>
          </div>
        </div>
      )}
    </div>
  );
}

function getSuggestionEmoji(category: string): string {
  const emojis = {
    beverage: '🥤',
    appetizer: '🥖',
    combo: '🍕',
    dessert: '🍰',
    other: '🍽️'
  };
  
  return emojis[category as keyof typeof emojis] || emojis.other;
}

export default CartSuggestions;
