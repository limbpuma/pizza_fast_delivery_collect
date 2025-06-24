import { useDispatch, useSelector } from "react-redux";
import Button from "../../ui/Button";
import { formatCurrency } from "../../utils/helpers";
import { addItem, getCurrentQuantityById } from "../cart/cartSlice";
import DeleteItem from "../cart/DeleteItem";
import UpdateItemQuantity from "../cart/UpdateItemQuantity";
import { useTranslation } from 'react-i18next';
import { getGermanPizzaInfo, getCategoryInGerman } from "../../data/germanPizzaInfo";
import { getProductType } from "../../utils/productDetection";
import AllergensDisplay from "../../ui/AllergensDisplay";
import AdditivesDisplay from "../../ui/AdditivesDisplay";
import NutritionalInfo from "../../ui/NutritionalInfo";

interface MenuItemProps {
  pizza: {
    id: number;
    name: string;
    unitPrice: number;
    ingredients: string[]; // API devuelve array de strings
    soldOut: boolean;
    allergens?: string[]; // Alérgenos desde JSON
    additives?: string[]; // Aditivos desde JSON
    category?: string;
    description?: string;
    sizes?: { [size: string]: number };
    needsSizeSelection?: boolean;
    quickAddEnabled?: boolean;
  };
}

function MenuItem({ pizza }: MenuItemProps) {
  const { t } = useTranslation();
  const { id, name, unitPrice, ingredients, soldOut, allergens, additives, sizes } = pizza;
  const dispatch = useDispatch();  const currentQuantity = useSelector(getCurrentQuantityById(id));
  
  // Only get German pizza info for actual pizzas (not baguettes, snacks, etc.)
  // Check if category contains 'Pizza' (case-insensitive) for better reliability
  const isPizza = pizza.category?.toLowerCase().includes('pizza') || false;
  const germanInfo = isPizza ? getGermanPizzaInfo(id) : null;
  
  // Determine product type for smart add behavior
  const productType = getProductType(pizza);
  
  const isInCart = currentQuantity > 0;

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

  function handleOnaddItem() {
    const newItem = {
      pizzaId: id,
      totalPrice: unitPrice * 1,
      unitPrice,
      name,
      quantity: 1,
    };

    dispatch(addItem(newItem));
  }  // Renderizar ingredientes - la API devuelve array de strings
  const ingredientsList = Array.isArray(ingredients) 
    ? ingredients 
    : [];

  return (    <li className="pizza-card bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-lg hover:border-yellow-300 transition-all duration-300 p-4 mb-4 group">
      <div className="flex flex-col gap-4">
        {/* Badges Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Popular Badge */}
            {germanInfo?.isPopular && (
              <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full shadow-sm animate-pulse">
                {t('menu.popular')}
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
        </div>

        {/* Pizza Information */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col h-full">            {/* Header with name and category */}
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                {/* Product name with number at the beginning */}
                <h3 className="text-lg font-semibold text-gray-900 leading-tight">
                  <span className="text-sm font-medium text-gray-500 mr-2">
                    {t('menu.productNumber', { number: id })}
                  </span>
                  {name}
                </h3>
                
                {germanInfo && (
                  <div className="flex items-center gap-2 mt-1">                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
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
                  </div>
                )}
              </div>
            </div>

            {/* Ingredients */}
            <div className="mb-3">
              <p className="text-sm text-gray-600 leading-relaxed">
                <span className="font-medium">{t('menu.ingredients')}</span>{' '}
                {ingredientsList.join(', ')}
              </p>
            </div>            {/* Allergens */}
            {allergens && allergens.length > 0 && (
              <div className="mb-3">
                <AllergensDisplay allergens={allergens} compact />
              </div>
            )}

            {/* Additives */}
            {additives && additives.length > 0 && (
              <div className="mb-3">
                <AdditivesDisplay additives={additives} compact />
              </div>
            )}

            {/* Technical Info */}
            {germanInfo && (
              <div className="flex flex-wrap gap-4 mb-3 text-xs text-gray-500">
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

            {/* Nutritional Info Component */}
            {germanInfo && (
              <div className="mb-4">
                <NutritionalInfo pizzaInfo={germanInfo} />
              </div>
            )}

            {/* Price and Actions */}
            <div className="mt-auto">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  {!soldOut ? (
                    <>                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold text-gray-900">
                          {isFromPrice ? t('menu.from') + ' ' : ''}{formatCurrency(displayPrice)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {t('menu.vatIncluded')}
                        </span>
                      </div>
                      {germanInfo && (
                        <span className="text-xs text-gray-500">
                          {t('menu.priceComparison', { 
                            price: formatCurrency(germanInfo.pricePerHundredGrams) 
                          })}
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="text-sm font-medium uppercase text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      {t('menu.soldOut')}
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                  {isInCart && (
                    <div className="flex items-center gap-2">
                      <UpdateItemQuantity
                        pizzaId={id}
                        currentQuantity={currentQuantity}
                      />
                      <DeleteItem pizzaId={id} />
                    </div>
                  )}
                  
                  {!soldOut && !isInCart && (
                    <Button type="small" onClick={handleOnaddItem}>
                      {t('menu.addToCart')}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}

export default MenuItem;
