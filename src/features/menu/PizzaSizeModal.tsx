import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import Modal from '../../ui/Modal';
import { addItem } from '../cart/cartSlice';
import { formatCurrency } from '../../utils/helpers';
import { getGermanPizzaInfo } from '../../data/germanPizzaInfo';

interface PizzaSizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  pizza: any;
}

interface PizzaSize {
  size: string;
  diameter: string;
  price: number;
  label: string;
}

function PizzaSizeModal({ isOpen, onClose, pizza }: PizzaSizeModalProps) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [selectedSize, setSelectedSize] = useState<PizzaSize | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedSize(null);
      setIsAdding(false);
    }
  }, [isOpen]);

  if (!pizza) return null;

  const { id, name, unitPrice, ingredients, sizes } = pizza;
  const germanInfo = getGermanPizzaInfo(id);
  
  // Create size options from real menu data
  const createSizeOptions = (): PizzaSize[] => {
    if (!sizes || typeof sizes !== 'object') {
      // Fallback for products without multiple sizes
      return [{
        size: 'standard',
        diameter: 'Standard',
        price: unitPrice,
        label: 'Standard'
      }];
    }

    // Map real menu sizes to pizza options
    const sizeMapping: Record<string, string> = {
      '24cm': 'Klein (24cm)',
      '30cm': 'Normal (30cm)', 
      '40cm': 'Groß (40cm)'
    };

    return Object.entries(sizes).map(([diameter, price]) => ({
      size: diameter.replace('cm', ''),
      diameter,
      price: price as number,
      label: sizeMapping[diameter] || `${diameter}`
    }));
  };
  const availableSizes = createSizeOptions();
  
  // Debug log for development
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    console.log('🍕 PizzaSizeModal Debug:', {
      pizzaName: name,
      sizes: sizes,
      availableSizes: availableSizes,
      selectedSize: selectedSize
    });
  }
  
  // Set default selection to medium size if available, otherwise first option
  if (!selectedSize && availableSizes.length > 0) {
    const defaultSize = availableSizes.find(s => s.diameter === '30cm') || availableSizes[0];
    setSelectedSize(defaultSize);
  }

  const calculateWeight = (size: PizzaSize) => {
    if (!germanInfo) return null;
    const baseWeight = germanInfo.weight;
    const baseDiameter = 32;
    const currentDiameter = parseInt(size.diameter.replace('cm', '')) || baseDiameter;
    const areaMultiplier = Math.pow(currentDiameter / baseDiameter, 2);
    return Math.round(baseWeight * areaMultiplier);
  };
  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent, size: PizzaSize) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setSelectedSize(size);
    }
  };

  const handleAddToCart = async () => {
    if (!selectedSize) return;
    
    setIsAdding(true);
    
    try {
      const finalPrice = selectedSize.price;
      const sizeName = `${name} (${selectedSize.label})`;
      
      const newItem = {
        pizzaId: id,
        name: sizeName,
        quantity: 1,
        unitPrice: finalPrice,
        totalPrice: finalPrice,
        size: selectedSize.size,
        diameter: selectedSize.diameter,
      };

      dispatch(addItem(newItem));

      // Optimized loading feedback - shorter but noticeable
      await new Promise(resolve => setTimeout(resolve, 200));
      
      onClose();
    } catch (error) {
      console.error('Error adding item to cart:', error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={t('menu.selectSize')} 
      size="pizza"
      scrollable={true}
      compact={true}
      heightClass="compact"
    >
      <div className="p-4 sm:p-6">        {/* Pizza Preview - Optimized */}
        <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6 p-3 sm:p-4 bg-gray-50 rounded-lg">
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
            <span className="text-xl sm:text-2xl">🍕</span>
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{name}</h3>
            <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
              {Array.isArray(ingredients) ? ingredients.join(', ') : ''}
            </p>
          </div>
        </div>

        {/* Size Options - Mobile Optimized */}
        <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
          <h4 className="font-semibold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">{t('menu.availableSizes')}</h4>
          
          <div role="radiogroup" aria-labelledby="size-selection-label" className="space-y-2 sm:space-y-3">
            <div id="size-selection-label" className="sr-only">{t('menu.availableSizes')}</div>
          
          {availableSizes.map((size: PizzaSize) => {
            const price = size.price;
            const weight = calculateWeight(size);
            const isSelected = selectedSize?.size === size.size;
            
            return (
              <button
                key={size.size}
                onClick={() => setSelectedSize(size)}
                onKeyDown={(e) => handleKeyDown(e, size)}
                className={`w-full p-3 sm:p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                  isSelected
                    ? 'border-orange-500 bg-orange-50 ring-2 ring-orange-200'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 focus:border-orange-300 focus:ring-2 focus:ring-orange-200'
                }`}
                role="radio"
                aria-checked={isSelected}
                aria-describedby={`size-${size.size}-description`}
                tabIndex={0}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      isSelected ? 'border-orange-500' : 'border-gray-300'
                    }`}>
                      {isSelected && (
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      )}
                    </div>
                    
                    <div className="min-w-0">
                      <div className="font-medium text-gray-900 text-sm sm:text-base">{size.label}</div>
                      {weight && (
                        <div 
                          id={`size-${size.size}-description`}
                          className="text-xs sm:text-sm text-gray-500"
                        >
                          ca. {weight}g
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right flex-shrink-0">
                    <div className="font-semibold text-gray-900 text-sm sm:text-base">
                      {formatCurrency(price)}
                    </div>
                    {germanInfo && (
                      <div className="text-xs text-gray-500">
                        {formatCurrency(price * 100 / (weight || germanInfo.weight))}/100g
                      </div>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
          </div>
        </div>        {/* Selected Size Summary - Mobile Optimized */}
        {selectedSize && (
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <div className="font-medium text-gray-900 text-sm sm:text-base truncate">
                  {name} ({selectedSize.label})
                </div>
                <div className="text-xs sm:text-sm text-gray-600">
                  {calculateWeight(selectedSize)}g • ⌀{selectedSize.diameter}
                </div>
              </div>
              <div className="text-lg sm:text-xl font-bold text-gray-900 flex-shrink-0 ml-3">
                {formatCurrency(selectedSize.price)}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons - Mobile Optimized */}
        <div className="flex gap-2 sm:gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 sm:px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
          >
            {t('common.cancel')}
          </button>
          
          <button
            onClick={handleAddToCart}
            disabled={isAdding || !selectedSize}
            className="flex-1 px-4 sm:px-6 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            {isAdding ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span className="hidden sm:inline">{t('menu.adding')}</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>{t('menu.addToBasket')}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default PizzaSizeModal;
