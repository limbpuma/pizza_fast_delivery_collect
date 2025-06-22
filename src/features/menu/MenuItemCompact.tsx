import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { formatCurrency } from '../../utils/helpers';
import { getCurrentQuantityById, addItem, decreaseItemQuantity, deleteItem, decreaseAnyItemByPizzaId, getTotalQuantityByPizzaId } from '../cart/cartSlice';
import { getGermanPizzaInfo, getCategoryInGerman } from '../../data/germanPizzaInfo';
// MIGRATION: Use new product detection system with real menu data support
import { getProductType, createQuickAddItem } from '../../utils/productDetection';
import PizzaDetailsModal from './PizzaDetailsModal';
import PizzaSizeModal from './PizzaSizeModal';

interface MenuItemCompactProps {
  pizza: any;
}

function MenuItemCompact({ pizza }: MenuItemCompactProps) {  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { id, name, unitPrice, ingredients, soldOut, sizes } = pizza;
  const currentQuantity = useSelector(getCurrentQuantityById(id));
  const totalPizzaQuantity = useSelector(getTotalQuantityByPizzaId(id));  const [showDetailsModal, setShowDetailsModal] = useState(false);  const [showSizeModal, setShowSizeModal] = useState(false);
  const [isQuickAdding, setIsQuickAdding] = useState(false);
  
  // Only get German pizza info for actual pizzas (not baguettes, snacks, etc.)
  // Check if category contains 'Pizza' (case-insensitive) for better reliability
  const isPizza = pizza.category?.toLowerCase().includes('pizza') || false;
  const germanInfo = isPizza ? getGermanPizzaInfo(id) : null;
  
  const isInCart = currentQuantity > 0;const ingredientsList = Array.isArray(ingredients) ? ingredients : [];
  
  // Determine product type for smart add behavior
  const productType = getProductType(pizza);

  // Use the new selector for total pizza quantity (all sizes combined)
  const displayQuantity = productType.needsSizeSelection ? totalPizzaQuantity : currentQuantity;  // Calculate display price for multi-size products
  const getDisplayPrice = () => {
    if (productType.needsSizeSelection && sizes) {
      // For multi-size products, show the lowest price with "from" indicator
      const priceValues = Object.values(sizes) as number[];
      const lowestPrice = Math.min(...priceValues);
      console.log(`🍕 MULTI-SIZE: ${name} - sizes:`, sizes, 'lowest:', lowestPrice);
      return { price: lowestPrice, isFromPrice: true };
    }
    // For single-size products, show the unit price
    console.log(`⚡ SINGLE-SIZE: ${name} - unitPrice:`, unitPrice);
    return { price: unitPrice, isFromPrice: false };
  };

  const { price: displayPrice, isFromPrice } = getDisplayPrice();
  
  // Debug logs
  console.log(`📊 ${name} (ID: ${id}):`, {
    productType,
    sizes,
    unitPrice,
    displayPrice,
    isFromPrice
  });const handleAddClick = async () => {
    if (productType.quickAddEnabled && !productType.needsSizeSelection) {
      // Quick Add - always use addItem (it will increment if exists)
      setIsQuickAdding(true);
      
      const quickItem = createQuickAddItem(pizza);
      dispatch(addItem(quickItem));
      
      // Brief feedback animation
      await new Promise(resolve => setTimeout(resolve, 300));
      setIsQuickAdding(false);
    } else {
      // Pizza products - always open size selection modal
      // This allows adding different sizes or configurations
      setShowSizeModal(true);
    }
  };  const handleDecrement = () => {
    if (productType.quickAddEnabled) {
      // Quick Add products - use regular decrement logic
      if (currentQuantity === 1) {
        dispatch(deleteItem(id));
      } else {
        dispatch(decreaseItemQuantity(id));
      }
    } else {
      // Pizza products - use the new method to decrement any item with this pizzaId
      dispatch(decreaseAnyItemByPizzaId(id));
    }
  };

  const handleDetailsClick = () => {
    setShowDetailsModal(true);
  };

  return (
    <>      <div className="pizza-card-compact bg-white rounded-lg border border-gray-200 hover:shadow-lg hover:border-orange-300 transition-all duration-200 p-4 group">
        <div className="flex flex-col gap-3">
          

          {/* Pizza Info */}
          <div className="flex-1 min-w-0"><div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 text-base leading-tight mb-1 truncate">
                  <span className="text-sm text-gray-500 mr-1">
                    {t('menu.productNumber', { number: id })}
                  </span>
                  {name}

                </h3>

                
                <div className="flex items-center gap-2 mb-1">
                {/* Popular Badge */} {/* Popular and Spicy Level Badges */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
               {/* Enhanced Popular Badge */}
                {germanInfo?.isPopular && (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full border-2 border-white shadow-lg animate-pulse">
                  🔥 Popular
                </span>
                )}
                            {/* Spicy Level */}
                {germanInfo?.spicyLevel && (
                <div className="flex">
                  {Array.from({ length: germanInfo.spicyLevel }, (_, i) => (
                    <span key={i} className="text-red-500 text-sm">🌶️</span>
                  ))}
                </div>
                )}
                </div>
                </div>                {/* Category Badge */}
                {germanInfo && (
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                    germanInfo.category === 'vegan' ? 'bg-green-100 text-green-700' :
                    germanInfo.category === 'vegetarisch' ? 'bg-green-50 text-green-600' :
                    germanInfo.category === 'fleisch' ? 'bg-red-50 text-red-600' :
                    germanInfo.category === 'meeresfrüchte' ? 'bg-blue-50 text-blue-600' :
                    germanInfo.category === 'klassisch' ? 'bg-yellow-50 text-yellow-700' :
                    germanInfo.category === 'spezial' ? 'bg-purple-50 text-purple-600' :
                    germanInfo.category === 'scharf' ? 'bg-red-100 text-red-700' :
                    germanInfo.category === 'käse' ? 'bg-orange-50 text-orange-600' :
                    germanInfo.category === 'premium' ? 'bg-amber-50 text-amber-700' :
                    germanInfo.category === 'gesund' ? 'bg-emerald-50 text-emerald-600' :
                    'bg-gray-50 text-gray-600'
                  }`}>
                    {getCategoryInGerman(germanInfo.category)}
                  </span>
                )}

              </div>

              </div>
            </div>

            {/* Ingredients - Limited to 2 lines */}
            <p className="text-sm text-gray-600 line-clamp-2 mb-3">
              {ingredientsList.join(', ')}
            </p>

            {/* Bottom Row: Item Info, Price, Add Button */}
            <div className="flex items-center justify-between">
              <button
                onClick={handleDetailsClick}
                className="text-sm text-orange-600 hover:text-orange-700 font-medium underline decoration-dotted underline-offset-2 transition-colors"
              >
                {t('menu.itemInfo')}
              </button>

              <div className="flex items-center gap-3">
                {/* Price */}                <div className="text-right">
                  {!soldOut ? (
                    <>
                      <div className="font-bold text-gray-900">
                        {isFromPrice ? t('menu.from') + ' ' : ''}{formatCurrency(displayPrice)}
                      </div>
                      {germanInfo && (
                        <div className="text-xs text-gray-500">
                          {t('menu.priceComparison', { 
                            price: formatCurrency(germanInfo.pricePerHundredGrams) 
                          })}
                        </div>
                      )}
                    </>
                  ) : (
                    <span className="text-sm font-medium text-gray-500">
                      {t('menu.soldOut')}
                    </span>
                  )}
                </div>                {/* Cart Controls or Add Button - Number inside button style */}
                {!soldOut && (
                  <div className="flex items-center gap-2">                    {/* Products with quantity in cart - show decrement button (both Quick Add and Pizza) */}
                    {((productType.quickAddEnabled && isInCart) || (!productType.quickAddEnabled && displayQuantity > 0)) && (
                      <button
                        onClick={handleDecrement}
                        className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 ${
                          (productType.quickAddEnabled ? currentQuantity : displayQuantity) === 1 
                            ? 'bg-red-500 hover:bg-red-600' 
                            : 'bg-gray-400 hover:bg-gray-500'
                        } text-white`}
                        title={(productType.quickAddEnabled ? currentQuantity : displayQuantity) === 1 ? t('buttons.delete') : t('buttons.remove')}
                      >
                        {(productType.quickAddEnabled ? currentQuantity : displayQuantity) === 1 ? (
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        ) : (
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        )}
                      </button>
                    )}

                    {/* Main Add Button - Shows + or quantity number inside (for both Quick Add and Pizza) */}
                    <button
                      onClick={handleAddClick}
                      disabled={isQuickAdding}
                      className={`relative w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 font-semibold text-sm ${
                        isQuickAdding 
                          ? 'bg-green-500 scale-110' 
                          : productType.quickAddEnabled 
                            ? 'bg-blue-500 hover:bg-blue-600' 
                            : 'bg-orange-500 hover:bg-orange-600'
                      } text-white`}
                      aria-label={
                        productType.quickAddEnabled 
                          ? t('menu.quickAdd', { default: 'Quick Add' })
                          : t('menu.selectSize')
                      }                      title={
                        productType.quickAddEnabled 
                          ? `Quick Add ${name}` 
                          : (productType.quickAddEnabled ? isInCart : displayQuantity > 0)
                            ? `Add another ${name}` 
                            : `Select size for ${name}`
                      }
                    >
                      {isQuickAdding ? (
                        // Success checkmark animation
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        // Show quantity number if in cart (for both types), + if not
                        (productType.quickAddEnabled ? isInCart : displayQuantity > 0) 
                          ? (productType.quickAddEnabled ? currentQuantity : displayQuantity)
                          : '+'
                      )}
                      
                      {/* Quick add feedback pulse */}
                      {isQuickAdding && (
                        <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-75"></div>
                      )}
                    </button>
                    
                    {/* Product type badge for development */}
                    {typeof window !== 'undefined' && window.location.hostname === 'localhost' && (
                      <span className="text-xs text-gray-400 ml-1">
                        {productType.quickAddEnabled ? '⚡' : '🍕'}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <PizzaDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        pizza={pizza}
        onAddToCart={handleAddClick}
      />

      <PizzaSizeModal
        isOpen={showSizeModal}
        onClose={() => setShowSizeModal(false)}
        pizza={pizza}
      />
    </>
  );
}

export default MenuItemCompact;
