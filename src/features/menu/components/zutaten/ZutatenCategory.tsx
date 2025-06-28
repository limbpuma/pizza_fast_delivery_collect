import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { formatCurrency } from '../../../../utils/helpers';
import { ZutatenCategoryProps } from './types';

function ZutatenCategory({ 
  category, 
  selectedZutaten, 
  onZutatenChange,
  isCollapsible = true 
}: ZutatenCategoryProps) {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(category.isExpanded ?? true);

  const handleZutatenToggle = (zutatId: string) => {
    const isCurrentlySelected = selectedZutaten[zutatId] || false;
    onZutatenChange(zutatId, !isCurrentlySelected);
  };

  const selectedInCategory = category.items.filter(zutat => selectedZutaten[zutat.id]).length;
  const categoryLabel = category.label; // Ya viene traducido desde ZutatenExpanded

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {/* Category Header */}
      <div className="bg-gray-50 border-b border-gray-200">
        {isCollapsible ? (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full p-3 sm:p-4 flex items-center justify-between text-left hover:bg-gray-100 transition-colors"
            aria-expanded={isExpanded}
            aria-controls={`category-${category.category}-content`}
          >
            <div className="flex items-center gap-3">
              <h5 className="font-semibold text-gray-900 text-sm sm:text-base">
                {categoryLabel}
              </h5>
              <span className="text-xs text-gray-500">
                ({category.items.length} {t('menu.items', { default: 'Artikel' })})
              </span>
              {selectedInCategory > 0 && (
                <span className="inline-block px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full font-medium">
                  {selectedInCategory} {t('menu.selected', { default: 'ausgewählt' })}
                </span>
              )}
            </div>
            
            <svg 
              className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                isExpanded ? 'rotate-180' : ''
              }`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        ) : (
          <div className="p-3 sm:p-4">
            <div className="flex items-center gap-3">
              <h5 className="font-semibold text-gray-900 text-sm sm:text-base">
                {categoryLabel}
              </h5>
              <span className="text-xs text-gray-500">
                ({category.items.length} {t('menu.items', { default: 'Artikel' })})
              </span>
              {selectedInCategory > 0 && (
                <span className="inline-block px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full font-medium">
                  {selectedInCategory} {t('menu.selected', { default: 'ausgewählt' })}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Category Content */}
      {isExpanded && (
        <div 
          id={`category-${category.category}-content`}
          className="p-3 sm:p-4 space-y-2"
        >
          {category.items.map((zutat) => {
            const isSelected = selectedZutaten[zutat.id] || false;
            const isFree = zutat.price === 0;
            
            return (
              <label
                key={zutat.id}
                className={`flex items-center p-2 sm:p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? 'border-orange-500 bg-orange-50 ring-1 ring-orange-200'
                    : 'border-gray-100 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleZutatenToggle(zutat.id)}
                    className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500 focus:ring-2"
                    aria-describedby={zutat.description ? `zutat-${zutat.id}-description` : undefined}
                  />
                  
                  {/* Ingredient Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-gray-900 text-sm">
                        {zutat.name}
                      </span>
                      
                      {/* Badges */}
                      <div className="flex gap-1">
                        {zutat.isVegan && (
                          <span className="inline-block px-1.5 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                            V
                          </span>
                        )}
                        {zutat.isVegetarian && !zutat.isVegan && (
                          <span className="inline-block px-1.5 py-0.5 bg-green-50 text-green-600 text-xs rounded-full font-medium">
                            Veg
                          </span>
                        )}
                        {zutat.category === 'premium' && (
                          <span className="inline-block px-1.5 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full font-medium">
                            ★
                          </span>
                        )}
                        {zutat.allergens && zutat.allergens.length > 0 && (
                          <span className="inline-block px-1.5 py-0.5 bg-red-50 text-red-600 text-xs rounded-full font-medium">
                            !
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {zutat.description && (
                      <p 
                        id={`zutat-${zutat.id}-description`}
                        className="text-xs text-gray-500 mt-1"
                      >
                        {zutat.description}
                      </p>
                    )}
                  </div>
                  
                  {/* Price */}
                  <div className="text-right flex-shrink-0">
                    {isFree ? (
                      <span className="text-green-600 text-xs font-medium">
                        {t('menu.free', { default: 'Frei' })}
                      </span>
                    ) : (
                      <span className="text-orange-600 font-semibold text-sm">
                        + {formatCurrency(zutat.price)}
                      </span>
                    )}
                  </div>
                </div>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ZutatenCategory;
