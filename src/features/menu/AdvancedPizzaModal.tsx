import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import Modal from '../../ui/Modal';
import { addItem } from '../cart/cartSlice';
import { formatCurrency } from '../../utils/helpers';
import { getGermanPizzaInfo } from '../../data/germanPizzaInfo';
import { 
  SizeSelection, 
  SauceSelection, 
  QuantityControls,
  ZutatenPreview,
  ZutatenExpanded,
  type PizzaSize,
  type SauceOption,
  type ZutatenSelection
} from './components';
import { mockZutatenData } from './components/zutaten';

interface AdvancedPizzaModalProps {
  isOpen: boolean;
  onClose: () => void;
  pizza: any;
  saucesOptions?: SauceOption[];
  zutatenOptions?: any[];
}

function AdvancedPizzaModal({ isOpen, onClose, pizza, saucesOptions, zutatenOptions }: AdvancedPizzaModalProps) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  
  // State for pizza configuration
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedSauce, setSelectedSauce] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedZutaten, setSelectedZutaten] = useState<ZutatenSelection>({});
  const [showAllZutaten, setShowAllZutaten] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedSize(null);
      setSelectedSauce('');
      setQuantity(1);
      setSelectedZutaten({});
      setShowAllZutaten(false);
      setIsAdding(false);
    } else if (saucesOptions && saucesOptions.length > 0) {
      // Set default sauce when modal opens
      const defaultSauce = saucesOptions.find(s => s.isDefault) || saucesOptions[0];
      setSelectedSauce(defaultSauce.id);
    }
  }, [isOpen, saucesOptions]);

  // Set default size when component mounts and pizza changes
  useEffect(() => {
    if (pizza && pizza.sizes && !selectedSize) {
      const sizes = pizza.sizes;
      if (sizes && typeof sizes === 'object') {
        const sizeEntries = Object.entries(sizes);
        if (sizeEntries.length > 0) {
          // Try to find 30cm first, then fallback to first available
          const defaultSizeEntry = sizeEntries.find(([diameter]) => diameter === '30cm') || sizeEntries[0];
          const defaultSize = defaultSizeEntry[0].replace('cm', '');
          setSelectedSize(defaultSize);
        }
      }
    }
  }, [pizza, selectedSize]);

  if (!pizza) return null;

  const { id, name, unitPrice, ingredients, sizes } = pizza;
  const germanInfo = getGermanPizzaInfo(id);

  // Default sauce options if not provided
  const defaultSauces: SauceOption[] = [
    {
      id: 'tomato',
      name: 'Tomatensauce',
      price: 0,
      isDefault: true,
      description: 'Klassische Tomatensauce'
    },
    {
      id: 'bbq',
      name: 'BBQ Sauce',
      price: 1.50,
      isPremium: true,
      description: 'Rauchige BBQ-Sauce'
    },
    {
      id: 'garlic',
      name: 'Knoblauchsauce',
      price: 1.00,
      description: 'Cremige Knoblauchsauce'
    }
  ];

  const availableSauces = saucesOptions || defaultSauces;
  const availableZutaten = zutatenOptions || mockZutatenData;

  // Create size options from pizza data
  const createSizeOptions = (): PizzaSize[] => {
    if (!sizes || typeof sizes !== 'object') {
      return [{
        size: 'standard',
        diameter: 'Standard',
        price: unitPrice,
        label: 'Standard'
      }];
    }

    const sizeMapping: Record<string, string> = {
      '24cm': 'Klein (24cm)',
      '30cm': 'Normal (30cm)', 
      '40cm': 'Groß (40cm)'
    };

    return Object.entries(sizes).map(([diameter, price]) => {
      const baseWeight = germanInfo?.weight || 300;
      const baseDiameter = 32;
      const currentDiameter = parseInt(diameter.replace('cm', '')) || baseDiameter;
      const areaMultiplier = Math.pow(currentDiameter / baseDiameter, 2);
      const calculatedWeight = Math.round(baseWeight * areaMultiplier);

      return {
        size: diameter.replace('cm', ''),
        diameter,
        price: price as number,
        label: sizeMapping[diameter] || `${diameter}`,
        weight: calculatedWeight
      };
    });
  };

  const availableSizes = createSizeOptions();

  // Calculate total price including zutaten
  const calculateTotalPrice = (): number => {
    const selectedSizeData = availableSizes.find(s => s.size === selectedSize);
    const selectedSauceData = availableSauces.find(s => s.id === selectedSauce);
    
    if (!selectedSizeData || !selectedSauceData) return 0;
    
    const basePrice = selectedSizeData.price;
    const saucePrice = selectedSauceData.price;
    
    // Calculate zutaten price
    const zutatenPrice = availableZutaten
      .filter(zutat => selectedZutaten[zutat.id])
      .reduce((sum, zutat) => sum + zutat.price, 0);
    
    const itemTotal = (basePrice + saucePrice + zutatenPrice) * quantity;
    
    return itemTotal;
  };

  const totalPrice = calculateTotalPrice();
  const selectedSizeData = availableSizes.find(s => s.size === selectedSize);
  const selectedSauceData = availableSauces.find(s => s.id === selectedSauce);

  // Zutaten handlers
  const handleZutatenChange = (zutatId: string, selected: boolean) => {
    setSelectedZutaten(prev => ({
      ...prev,
      [zutatId]: selected
    }));
  };

  // Handle add to cart
  const handleAddToCart = async () => {
    if (!selectedSize || !selectedSauce || !selectedSizeData || !selectedSauceData) return;
    
    setIsAdding(true);
    
    try {
      const sizeName = selectedSizeData.label;
      const sauceName = selectedSauceData.name;
      
      // Build ingredient list
      const selectedZutatenList = availableZutaten
        .filter(zutat => selectedZutaten[zutat.id])
        .map(zutat => zutat.name);
      
      const ingredientSuffix = selectedZutatenList.length > 0 
        ? `, +${selectedZutatenList.join(', ')}` 
        : '';
      
      const itemName = `${name} (${sizeName}, ${sauceName}${ingredientSuffix})`;
      
      const newItem = {
        pizzaId: id,
        name: itemName,
        quantity: quantity,
        unitPrice: selectedSizeData.price + selectedSauceData.price + availableZutaten
          .filter(zutat => selectedZutaten[zutat.id])
          .reduce((sum, zutat) => sum + zutat.price, 0),
        totalPrice: totalPrice,
        size: selectedSize,
        diameter: selectedSizeData.diameter,
        sauce: selectedSauce,
        zutaten: selectedZutatenList
      };

      dispatch(addItem(newItem));

      // Brief loading feedback
      await new Promise(resolve => setTimeout(resolve, 200));
      
      onClose();
    } catch (error) {
      console.error('Error adding item to cart:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const canAddToCart = selectedSize && selectedSauce && quantity > 0;
  const selectedZutatenCount = Object.values(selectedZutaten).filter(Boolean).length;
  const zutatenPrice = availableZutaten
    .filter(zutat => selectedZutaten[zutat.id])
    .reduce((sum, zutat) => sum + zutat.price, 0);

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={t('menu.configurePizza', { default: 'Pizza konfigurieren' })} 
      size="multiStep"
      scrollable={true}
      heightClass="scroll"
    >
      <div className="space-y-4 sm:space-y-6">
        {/* Pizza Preview */}
        <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
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

        {/* Size Selection */}
        <SizeSelection
          sizes={availableSizes}
          selectedSize={selectedSize}
          onSizeChange={setSelectedSize}
          required={true}
          showPriceComparison={true}
          germanInfo={germanInfo}
        />

        {/* Sauce Selection */}
        <SauceSelection
          sauces={availableSauces}
          selectedSauce={selectedSauce}
          onSauceChange={setSelectedSauce}
          required={true}
        />

        {/* Zutaten Selection */}
        {showAllZutaten ? (
          <ZutatenExpanded
            availableZutaten={availableZutaten}
            selectedZutaten={selectedZutaten}
            onZutatenChange={handleZutatenChange}
            onShowLess={() => setShowAllZutaten(false)}
            searchable={true}
          />
        ) : (
          <ZutatenPreview
            availableZutaten={availableZutaten}
            selectedZutaten={selectedZutaten}
            onZutatenChange={handleZutatenChange}
            onShowMore={() => setShowAllZutaten(true)}
            maxPreviewItems={3}
          />
        )}

        {/* Quantity Controls */}
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-gray-900 text-sm sm:text-base">
            {t('menu.quantity', { default: 'Anzahl' })}
          </h4>
          <QuantityControls
            quantity={quantity}
            onQuantityChange={setQuantity}
            min={1}
            max={10}
            disabled={isAdding}
          />
        </div>

        {/* Price Summary */}
        {selectedSizeData && selectedSauceData && (
          <div className="bg-orange-50 rounded-lg p-3 sm:p-4 border border-orange-200">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">
                  {name} ({selectedSizeData.label})
                </span>
                <span className="font-medium">
                  {formatCurrency(selectedSizeData.price)}
                </span>
              </div>
              
              {selectedSauceData.price > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {selectedSauceData.name}
                  </span>
                  <span className="font-medium">
                    + {formatCurrency(selectedSauceData.price)}
                  </span>
                </div>
              )}
              
              {selectedZutatenCount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {selectedZutatenCount} {t('menu.extraIngredients', { default: 'Extra Zutaten' })}
                  </span>
                  <span className="font-medium">
                    + {formatCurrency(zutatenPrice)}
                  </span>
                </div>
              )}
              
              {quantity > 1 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {t('menu.quantity', { default: 'Anzahl' })}: {quantity}x
                  </span>
                  <span></span>
                </div>
              )}
              
              <div className="border-t border-orange-200 pt-2 flex justify-between">
                <span className="font-semibold text-gray-900">
                  {t('menu.total', { default: 'Gesamt' })}
                </span>
                <span className="font-bold text-orange-600 text-lg">
                  {formatCurrency(totalPrice)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 sm:gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 sm:px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
          >
            {t('common.cancel')}
          </button>
          
          <button
            onClick={handleAddToCart}
            disabled={isAdding || !canAddToCart}
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
                <span>{t('menu.addToBasket')} ({formatCurrency(totalPrice)})</span>
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default AdvancedPizzaModal;
