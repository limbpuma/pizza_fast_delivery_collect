import { useTranslation } from 'react-i18next';
import { formatCurrency } from '../../../../utils/helpers';
import { ZutatenPreviewProps } from './types';

function ZutatenPreview({ 
  availableZutaten, 
  selectedZutaten, 
  onZutatenChange, 
  onShowMore,
  maxPreviewItems = 3 
}: ZutatenPreviewProps) {
  const { t } = useTranslation();

  // Get popular items for preview
  const popularZutaten = availableZutaten
    .filter(zutat => zutat.isPopular)
    .slice(0, maxPreviewItems);

  const handleZutatenToggle = (zutatId: string) => {
    const isCurrentlySelected = selectedZutaten[zutatId] || false;
    onZutatenChange(zutatId, !isCurrentlySelected);
  };

  const selectedCount = Object.values(selectedZutaten).filter(Boolean).length;
  const totalAvailable = availableZutaten.length;

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-semibold text-gray-900 text-sm sm:text-base">
            {t('menu.extraIngredients', { default: 'Extra Zutaten' })}
          </h4>
          {selectedCount > 0 && (
            <p className="text-xs sm:text-sm text-gray-600">
              {t('menu.selectedIngredients', { 
                count: selectedCount, 
                default: `${selectedCount} ausgewählt` 
              })}
            </p>
          )}
        </div>
        
        <button
          onClick={onShowMore}
          className="text-sm text-orange-600 hover:text-orange-700 font-medium underline decoration-dotted underline-offset-2 transition-colors"
        >
          {t('menu.showAllIngredients', { 
            total: totalAvailable, 
            default: `Alle ${totalAvailable} anzeigen` 
          })}
        </button>
      </div>

      {/* Popular Ingredients Preview */}
      <div className="space-y-2">
        {popularZutaten.map((zutat) => {
          const isSelected = selectedZutaten[zutat.id] || false;
          const isFree = zutat.price === 0;
          
          return (
            <label
              key={zutat.id}
              className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                isSelected
                  ? 'border-orange-500 bg-orange-50 ring-1 ring-orange-200'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {/* Checkbox */}
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleZutatenToggle(zutat.id)}
                  className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500 focus:ring-2"
                  aria-describedby={`zutat-${zutat.id}-description`}
                />
                
                {/* Ingredient Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900 text-sm sm:text-base">
                      {zutat.name}
                    </span>
                    
                    {/* Badges */}
                    <div className="flex gap-1">
                      {zutat.isVegan && (
                        <span className="inline-block px-1.5 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                          {t('menu.vegan', { default: 'Vegan' })}
                        </span>
                      )}
                      {zutat.isVegetarian && !zutat.isVegan && (
                        <span className="inline-block px-1.5 py-0.5 bg-green-50 text-green-600 text-xs rounded-full font-medium">
                          {t('menu.vegetarian', { default: 'Vegetarisch' })}
                        </span>
                      )}
                      {zutat.category === 'premium' && (
                        <span className="inline-block px-1.5 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full font-medium">
                          {t('menu.premium', { default: 'Premium' })}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {zutat.description && (
                    <p 
                      id={`zutat-${zutat.id}-description`}
                      className="text-xs sm:text-sm text-gray-500 mt-1"
                    >
                      {zutat.description}
                    </p>
                  )}
                </div>
                
                {/* Price */}
                <div className="text-right flex-shrink-0">
                  {isFree ? (
                    <span className="text-green-600 text-sm font-medium">
                      {t('menu.free', { default: 'Kostenlos' })}
                    </span>
                  ) : (
                    <span className="text-orange-600 font-semibold text-sm sm:text-base">
                      + {formatCurrency(zutat.price)}
                    </span>
                  )}
                </div>
              </div>
            </label>
          );
        })}
      </div>

      {/* Show More Button (Alternative) */}
      {popularZutaten.length < totalAvailable && (
        <button
          onClick={onShowMore}
          className="w-full mt-3 p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-orange-300 hover:text-orange-600 transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="text-sm font-medium">
            {t('menu.addMoreIngredients', { 
              remaining: totalAvailable - popularZutaten.length,
              default: `${totalAvailable - popularZutaten.length} weitere Zutaten hinzufügen` 
            })}
          </span>
        </button>
      )}
    </div>
  );
}

export default ZutatenPreview;
