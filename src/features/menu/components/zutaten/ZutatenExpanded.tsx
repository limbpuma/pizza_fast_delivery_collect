import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ZutatenExpandedProps } from './types';
import { categorizeZutaten, categoryLabels } from './mockData';
import ZutatenCategory from './ZutatenCategory';

function ZutatenExpanded({ 
  availableZutaten, 
  selectedZutaten, 
  onZutatenChange, 
  onShowLess,
  searchable = true
}: ZutatenExpandedProps) {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['fleisch', 'käse', 'gemüse']));

  // Filter ingredients by search term
  const filteredZutaten = useMemo(() => {
    if (!searchTerm.trim()) return availableZutaten;
    
    const term = searchTerm.toLowerCase();
    return availableZutaten.filter(zutat => 
      zutat.name.toLowerCase().includes(term) ||
      zutat.description?.toLowerCase().includes(term) ||
      categoryLabels[zutat.category]?.toLowerCase().includes(term)
    );
  }, [availableZutaten, searchTerm]);

  // Categorize filtered ingredients
  const categorizedZutaten = useMemo(() => {
    const categorized = categorizeZutaten(filteredZutaten);
    
    // Convert to array of category groups
    const categoryOrder = ['fleisch', 'käse', 'gemüse', 'meeresfrüchte', 'gewürze', 'saucen', 'premium', 'vegan'];
    
    return categoryOrder
      .filter(categoryKey => categorized[categoryKey] && categorized[categoryKey].length > 0)
      .map(categoryKey => ({
        category: categoryKey as any,
        label: categoryLabels[categoryKey] || categoryKey,
        items: categorized[categoryKey] || [],
        isExpanded: expandedCategories.has(categoryKey)
      }));
  }, [filteredZutaten, expandedCategories]);

  const selectedCount = Object.values(selectedZutaten).filter(Boolean).length;
  const totalPrice = availableZutaten
    .filter(zutat => selectedZutaten[zutat.id])
    .reduce((sum, zutat) => sum + zutat.price, 0);

  const handleExpandAll = () => {
    const allCategories = categorizedZutaten.map(cat => cat.category);
    setExpandedCategories(new Set(allCategories));
  };

  const handleCollapseAll = () => {
    setExpandedCategories(new Set());
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  return (
    <div className="space-y-4">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={onShowLess}
          className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm">{t('menu.showLess', { default: 'Weniger anzeigen' })}</span>
        </button>
        
        <div className="text-right">
          <h4 className="font-semibold text-gray-900 text-sm sm:text-base">
            {t('menu.allIngredients', { default: 'Alle Zutaten' })}
          </h4>
          {selectedCount > 0 && (
            <p className="text-xs sm:text-sm text-gray-600">
              {selectedCount} {t('menu.selected', { default: 'ausgewählt' })} 
              {totalPrice > 0 && ` • +${totalPrice.toFixed(2)}€`}
            </p>
          )}
        </div>
      </div>

      {/* Search Bar */}
      {searchable && (
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('menu.searchIngredients', { default: 'Zutaten suchen...' })}
            className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 text-sm"
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      )}

      {/* Category Controls */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex gap-2">
          <button
            onClick={handleExpandAll}
            className="text-orange-600 hover:text-orange-700 font-medium transition-colors"
          >
            {t('menu.expandAll', { default: 'Alle öffnen' })}
          </button>
          <span className="text-gray-400">|</span>
          <button
            onClick={handleCollapseAll}
            className="text-gray-600 hover:text-gray-700 font-medium transition-colors"
          >
            {t('menu.collapseAll', { default: 'Alle schließen' })}
          </button>
        </div>
        
        <span className="text-gray-500">
          {categorizedZutaten.length} {t('menu.categories', { default: 'Kategorien' })} • 
          {filteredZutaten.length} {t('menu.items', { default: 'Artikel' })}
        </span>
      </div>

      {/* Search Results Info */}
      {searchTerm && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            {filteredZutaten.length === 0 ? (
              <>
                {t('menu.noSearchResults', { 
                  term: searchTerm, 
                  default: `Keine Ergebnisse für "${searchTerm}"` 
                })}
              </>
            ) : (
              <>
                {t('menu.searchResults', { 
                  count: filteredZutaten.length, 
                  term: searchTerm,
                  default: `${filteredZutaten.length} Ergebnisse für "${searchTerm}"` 
                })}
              </>
            )}
          </p>
        </div>
      )}

      {/* Categories */}
      <div className="space-y-3">
        {categorizedZutaten.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p className="text-sm font-medium">
              {t('menu.noIngredientsFound', { default: 'Keine Zutaten gefunden' })}
            </p>
            <p className="text-xs mt-1">
              {t('menu.tryDifferentSearch', { default: 'Versuchen Sie einen anderen Suchbegriff' })}
            </p>
          </div>
        ) : (
          categorizedZutaten.map((categoryGroup) => (
            <ZutatenCategory
              key={categoryGroup.category}
              category={categoryGroup}
              selectedZutaten={selectedZutaten}
              onZutatenChange={onZutatenChange}
              isCollapsible={true}
            />
          ))
        )}
      </div>

      {/* Summary Footer */}
      {selectedCount > 0 && (
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-3 sm:p-4 rounded-t-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">
                {selectedCount} {t('menu.ingredientsSelected', { default: 'Zutaten ausgewählt' })}
              </p>
              {totalPrice > 0 && (
                <p className="text-sm text-gray-600">
                  {t('menu.additionalCost', { price: totalPrice.toFixed(2), default: `Zusätzlich: +${totalPrice.toFixed(2)}€` })}
                </p>
              )}
            </div>
            
            <button
              onClick={onShowLess}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors text-sm"
            >
              {t('menu.continue', { default: 'Weiter' })}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ZutatenExpanded;
