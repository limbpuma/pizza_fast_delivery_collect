import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { formatCurrency } from '../../utils/helpers';
import { getCurrentQuantityById, addItem } from '../cart/cartSlice';
import { getGermanPizzaInfo, getCategoryInGerman } from '../../data/germanPizzaInfo';
import { getProductType, createQuickAddItem } from '../../utils/productHelpers';
import PizzaDetailsModal from './PizzaDetailsModal';
import PizzaSizeModal from './PizzaSizeModal';
import UpdateItemQuantity from '../cart/UpdateItemQuantity';
import DeleteItem from '../cart/DeleteItem';

interface MenuItemCompactProps {
  pizza: any;
}

function MenuItemCompact({ pizza }: MenuItemCompactProps) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { id, name, unitPrice, ingredients, soldOut, imageUrl } = pizza;
  const currentQuantity = useSelector(getCurrentQuantityById(id));
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [isQuickAdding, setIsQuickAdding] = useState(false);
  
  const germanInfo = getGermanPizzaInfo(id);
  const isInCart = currentQuantity > 0;
  const ingredientsList = Array.isArray(ingredients) ? ingredients : [];
  
  // Determine product type for smart add behavior
  const productType = getProductType(pizza);

  const handleAddClick = async () => {
    if (productType.quickAddEnabled && !productType.needsSizeSelection) {
      // Quick Add - directly add to cart without modal
      setIsQuickAdding(true);
      
      const quickItem = createQuickAddItem(pizza);
      dispatch(addItem(quickItem));
      
      // Brief feedback animation
      await new Promise(resolve => setTimeout(resolve, 500));
      setIsQuickAdding(false);
    } else {
      // Traditional flow - open size selection modal
      setShowSizeModal(true);
    }
  };

  const handleDetailsClick = () => {
    setShowDetailsModal(true);
  };

  return (
    <>
      <div className="pizza-card-compact bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200 p-4">
        <div className="flex gap-4">
          {/* Pizza Image */}
          <div className="flex-shrink-0 relative">
            <img
              src={imageUrl}
              alt={name}
              className={`w-20 h-20 sm:w-24 sm:h-24 rounded-lg object-cover ${
                soldOut ? "opacity-50 grayscale" : ""
              }`}
              loading="lazy"
            />
            
            {/* Popular Badge */}
            {germanInfo?.isPopular && (
              <span className="absolute -top-1 -right-1 bg-yellow-400 text-yellow-900 text-xs font-bold px-1.5 py-0.5 rounded-full">
                {t('menu.popular')}
              </span>
            )}
            
            {/* Spicy Level */}
            {germanInfo?.spicyLevel && (
              <div className="absolute bottom-1 left-1 flex">
                {Array.from({ length: germanInfo.spicyLevel }, (_, i) => (
                  <span key={i} className="text-red-500 text-xs">🌶️</span>
                ))}
              </div>
            )}
          </div>

          {/* Pizza Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 text-base leading-tight mb-1 truncate">
                  {name}
                </h3>
                
                {/* Category Badge */}
                {germanInfo && (
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                    germanInfo.category === 'vegan' ? 'bg-green-100 text-green-700' :
                    germanInfo.category === 'vegetarisch' ? 'bg-green-50 text-green-600' :
                    germanInfo.category === 'fleisch' ? 'bg-red-50 text-red-600' :
                    germanInfo.category === 'meeresfrüchte' ? 'bg-blue-50 text-blue-600' :
                    'bg-gray-50 text-gray-600'
                  }`}>
                    {getCategoryInGerman(germanInfo.category)}
                  </span>
                )}
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
                {/* Price */}
                <div className="text-right">
                  {!soldOut ? (
                    <>
                      <div className="font-bold text-gray-900">
                        {t('menu.from')} {formatCurrency(unitPrice)}
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
                </div>                {/* Cart Controls or Add Button */}
                {isInCart ? (
                  <div className="flex items-center gap-2">
                    <UpdateItemQuantity
                      pizzaId={id}
                      currentQuantity={currentQuantity}
                    />
                    <DeleteItem pizzaId={id} />
                  </div>
                ) : (
                  !soldOut && (
                    <div className="flex items-center gap-2">
                      {/* Smart Add Button */}
                      <button
                        onClick={handleAddClick}
                        disabled={isQuickAdding}
                        className={`relative w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
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
                        }
                        title={
                          productType.quickAddEnabled 
                            ? `Quick Add ${name}` 
                            : `Select size for ${name}`
                        }
                      >
                        {isQuickAdding ? (
                          // Success checkmark animation
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : productType.quickAddEnabled ? (
                          // Quick add icon (shopping cart)
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m-2.4 2h0m2 6v0m0 0h10M7 13v8a2 2 0 002 2h6a2 2 0 002-2v-8m-10 0V9a2 2 0 012-2h6a2 2 0 012 2v4.01" />
                          </svg>
                        ) : (
                          // Size selection icon (plus)
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
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
                  )
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
