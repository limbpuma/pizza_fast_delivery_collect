import { useTranslation } from 'react-i18next';
import Modal from '../../ui/Modal';
import { getGermanPizzaInfo, getCategoryInGerman } from '../../data/germanPizzaInfo';
import AllergensDisplay from '../../ui/AllergensDisplay';
import AdditivesDisplay from '../../ui/AdditivesDisplay';
import NutritionalInfo from '../../ui/NutritionalInfo';
import { formatCurrency } from '../../utils/helpers';
import { getProductType } from '../../utils/productDetection';

interface PizzaDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  pizza: {
    id: number;
    name: string;
    unitPrice: number;
    ingredients: string[];
    allergens?: string[];
    additives?: string[];
    [key: string]: any;
  };
  onAddToCart: () => void;
}

function PizzaDetailsModal({ isOpen, onClose, pizza, onAddToCart }: PizzaDetailsModalProps) {
  const { t } = useTranslation();
    if (!pizza) return null;
    const { id, name, unitPrice, ingredients, allergens, additives, sizes } = pizza;
  
  // Only get German pizza info for actual pizzas (not baguettes, snacks, etc.)
  // Check if category contains 'Pizza' (case-insensitive) for better reliability
  const isPizza = pizza.category?.toLowerCase().includes('pizza') || false;
  const germanInfo = isPizza ? getGermanPizzaInfo(id) : null;
  
  // Determine product type for price display logic
  const productType = getProductType(pizza);
  
  // Calculate display price for multi-size products
  const getDisplayPrice = () => {
    if (productType.needsSizeSelection && sizes) {
      // For multi-size products, show the lowest price with "from" indicator
      const priceValues = Object.values(sizes) as number[];
      const lowestPrice = Math.min(...priceValues);
      return { price: lowestPrice, isFromPrice: true };
    }
    // For single-size products, show the unit price
    return { price: unitPrice, isFromPrice: false };
  };

  const { price: displayPrice, isFromPrice } = getDisplayPrice();
  const ingredientsList = Array.isArray(ingredients) ? ingredients : [];

  const handleAddToCart = () => {
    onAddToCart();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="p-6">        {/* Pizza Basic Info */}
        <div className="flex flex-col gap-6 mb-6">
          <div className="flex-1">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{name}</h3>
                {germanInfo && (                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
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
                <div className="text-right">
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {isFromPrice && (
                    <span className="text-sm font-normal text-gray-500 mr-1">
                      {t('menu.from')}
                    </span>
                  )}
                  {formatCurrency(displayPrice)}
                </div>
                <div className="text-sm text-gray-500">
                  {t('menu.vatIncluded')}
                </div>
                {germanInfo && (
                  <div className="text-xs text-gray-500">
                    {t('menu.priceComparison', { 
                      price: formatCurrency(germanInfo.pricePerHundredGrams) 
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Popular & Spicy badges */}
            <div className="flex gap-2 mb-4">
              {germanInfo?.isPopular && (
                <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full">
                  {t('menu.popular')}
                </span>
              )}
              {germanInfo?.spicyLevel && (
                <div className="flex items-center gap-1">
                  {Array.from({ length: germanInfo.spicyLevel }, (_, i) => (
                    <span key={i} className="text-red-500 text-sm">🌶️</span>
                  ))}
                </div>
              )}
            </div>

            {/* Technical Info */}
            {germanInfo && (
              <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  📏 {t('menu.diameter', { diameter: germanInfo.diameter })}
                </span>
                <span className="flex items-center gap-1">
                  ⚖️ {t('menu.weight', { weight: germanInfo.weight })}
                </span>
                <span className="flex items-center gap-1">
                  🔥 {t('menu.calories', { calories: germanInfo.nutritionalInfo.caloriesPerPizza })} {t('menu.perPizza')}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Ingredients */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-2">{t('menu.ingredients')}</h4>
          <p className="text-gray-600 leading-relaxed">
            {ingredientsList.join(', ')}
          </p>
        </div>        {/* Allergens */}
        {allergens && allergens.length > 0 && (
          <div className="mb-6">
            <AllergensDisplay allergens={allergens} />
          </div>
        )}

        {/* Additives */}
        {additives && additives.length > 0 && (
          <div className="mb-6">
            <AdditivesDisplay additives={additives} />
          </div>
        )}

        {/* Nutritional Info */}
        {germanInfo && (
          <div className="mb-6">
            <NutritionalInfo pizzaInfo={germanInfo} isExpanded={true} />
          </div>
        )}

        {/* Action Button */}
        <div className="flex justify-end pt-4 border-t border-gray-200">
          <button
            onClick={handleAddToCart}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-200 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {t('menu.addToCart')}
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default PizzaDetailsModal;
