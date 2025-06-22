import { useState } from 'react';
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
  const handleAddToCart = async () => {
    if (!selectedSize) return;
    
    setIsAdding(true);
    
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

    // Simulate brief loading for UX
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setIsAdding(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('menu.selectSize')} size="md">
      <div className="p-6">        {/* Pizza Preview */}
        <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="w-16 h-16 rounded-lg bg-orange-100 flex items-center justify-center">
            <span className="text-2xl">🍕</span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{name}</h3>
            <p className="text-sm text-gray-600 line-clamp-2">
              {Array.isArray(ingredients) ? ingredients.join(', ') : ''}
            </p>
          </div>
        </div>        {/* Size Options */}
        <div className="space-y-3 mb-6">
          <h4 className="font-semibold text-gray-900 mb-3">{t('menu.availableSizes')}</h4>
          
          {availableSizes.map((size: PizzaSize) => {
            const price = size.price;
            const weight = calculateWeight(size);
            const isSelected = selectedSize?.size === size.size;
            
            return (
              <button
                key={size.size}
                onClick={() => setSelectedSize(size)}
                className={`w-full p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                  isSelected
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      isSelected ? 'border-orange-500' : 'border-gray-300'
                    }`}>
                      {isSelected && (
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      )}
                    </div>
                    
                    <div>
                      <div className="font-medium text-gray-900">{size.label}</div>
                      {weight && (
                        <div className="text-sm text-gray-500">
                          ca. {weight}g
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">
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
        </div>        {/* Selected Size Summary */}
        {selectedSize && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">
                  {name} ({selectedSize.label})
                </div>
                <div className="text-sm text-gray-600">
                  {calculateWeight(selectedSize)}g • ⌀{selectedSize.diameter}
                </div>
              </div>
              <div className="text-xl font-bold text-gray-900">
                {formatCurrency(selectedSize.price)}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            {t('common.cancel')}
          </button>
          
          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className="flex-1 px-6 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            {isAdding ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                {t('menu.adding')}
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                {t('menu.addToBasket')}
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default PizzaSizeModal;
