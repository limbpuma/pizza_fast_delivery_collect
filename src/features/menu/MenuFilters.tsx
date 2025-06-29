import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLoaderData } from 'react-router-dom';
import { getCategoryOptions } from '../../utils/menuCategories';

interface MenuFiltersProps {
  onFilterChange: (filters: {
    category: string;
    allergens: string[];
    showVegetarian: boolean;
    showVegan: boolean;
  }) => void;
}

function MenuFilters({ onFilterChange }: MenuFiltersProps) {
  const { t } = useTranslation();
  const menu = useLoaderData() as any[];
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [excludedAllergens, setExcludedAllergens] = useState<string[]>([]);
  const [showVegetarian, setShowVegetarian] = useState(false);
  const [showVegan, setShowVegan] = useState(false);  const [showAllFilters, setShowAllFilters] = useState(false);
  const [showHamburgerMenu, setShowHamburgerMenu] = useState(false);
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  // Dynamic categories from real menu data
  const categories = getCategoryOptions(menu, true);

  const commonAllergens = [
    { code: 'D', key: 'D' }, // Milch/Lactose
    { code: 'F', key: 'F' }, // Gluten
    { code: 'E', key: 'E' }, // Eier
    { code: 'Sf', key: 'Sf' }, // Schalenfrüchte (Tree nuts)
    { code: 'C', key: 'C' }, // Soja
    { code: 'H', key: 'H' }  // Fisch
  ];

  // Function to get allergen description from translation
  const getAllergenDescription = (code: string): string => {
    return t(`allergene_legende.${code}`, { defaultValue: code });
  };

  // Update scroll button visibility based on content overflow
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      const updateScrollButtons = () => {
        setCanScrollLeft(container.scrollLeft > 0);
        setCanScrollRight(
          container.scrollLeft < container.scrollWidth - container.clientWidth
        );
      };

      updateScrollButtons();
      container.addEventListener('scroll', updateScrollButtons);
      return () => container.removeEventListener('scroll', updateScrollButtons);
    }
  }, []);
  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (container) {
      const containerWidth = container.clientWidth;
      const scrollAmount = containerWidth * 0.75; // Scroll 75% of container width
      const targetScrollLeft = direction === 'left' 
        ? Math.max(0, container.scrollLeft - scrollAmount)
        : Math.min(container.scrollWidth - containerWidth, container.scrollLeft + scrollAmount);
        
      container.scrollTo({
        left: targetScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setShowHamburgerMenu(false);
    updateFilters(category, excludedAllergens, showVegetarian, showVegan);
  };

  const handleAllergenToggle = (allergenCode: string) => {
    const newExcluded = excludedAllergens.includes(allergenCode)
      ? excludedAllergens.filter(a => a !== allergenCode)
      : [...excludedAllergens, allergenCode];
    
    setExcludedAllergens(newExcluded);
    updateFilters(selectedCategory, newExcluded, showVegetarian, showVegan);
  };  const updateFilters = (category: string, allergens: string[], vegetarian: boolean, vegan: boolean) => {
    const newFilters = {
      category,
      allergens,
      showVegetarian: vegetarian,
      showVegan: vegan
    };
    console.log('🔧 MenuFilters: Sending filter change:', newFilters);
    onFilterChange(newFilters);
  };
  
  // Show ALL categories in scroll (like hamburger menu) instead of limiting them
  const visibleCategoriesList = categories; // Changed from categories.slice(0, visibleCategories)
  return (
    <div className="mt-2 bg-white border border-gray-200 rounded-lg shadow-sm">      {/* Categories section with hamburger menu outside scroll */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile-first horizontal category scroll - Responsive container */}
        <div className="relative flex-1 min-w-0 overflow-hidden">          {/* Left scroll button - Enhanced design */}
          {canScrollLeft && (
            <button
              onClick={() => scroll('left')}
              className="absolute left-1 top-1/2 -translate-y-1/2 z-20 
                         bg-white/90 backdrop-blur-sm shadow-lg rounded-full p-2.5 
                         hover:bg-white hover:shadow-xl transition-all duration-200
                         border border-gray-200 hover:border-orange-300"
              aria-label="Scroll left"
            >
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}{/* Category buttons container - Enhanced responsive design */}
          <div 
            ref={scrollContainerRef}
            className="flex w-full gap-3 px-3 py-4 overflow-x-auto scrollbar-hide scroll-smooth sm:px-4 snap-x snap-mandatory"
            style={{ 
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none'
            }}
          >
            {visibleCategoriesList.map(category => (
              <button
                key={category.value}
                onClick={() => handleCategoryChange(category.value)}
                className={`flex-shrink-0 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap snap-start
                  border-2 shadow-sm hover:shadow-md transform hover:scale-105 
                  min-w-fit ${
                  selectedCategory === category.value
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white border-orange-500 shadow-lg scale-105'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-orange-300 hover:bg-orange-50'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>          {/* Right scroll button - Enhanced design */}
          {canScrollRight && (
            <button
              onClick={() => scroll('right')}
              className="absolute right-1 top-1/2 -translate-y-1/2 z-20 
                         bg-white/90 backdrop-blur-sm shadow-lg rounded-full p-2.5 
                         hover:bg-white hover:shadow-xl transition-all duration-200
                         border border-gray-200 hover:border-orange-300"
              aria-label="Scroll right"
            >
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>        {/* Enhanced Hamburger menu button */}
        <div className="relative flex-shrink-0 pr-2 sm:pr-4">
          <button
            onClick={() => setShowHamburgerMenu(!showHamburgerMenu)}
            className={`p-3 rounded-full transition-all duration-300 shadow-lg border-2 ${
              showHamburgerMenu
                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white border-orange-500 shadow-xl scale-105'
                : 'bg-white text-gray-700 border-gray-200 hover:border-orange-300 hover:bg-orange-50 hover:scale-105'
            }`}
            aria-label="Show all categories"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Enhanced Modal for ALL categories */}
          {showHamburgerMenu && (
            <div className="absolute right-0 z-30 mt-3 overflow-hidden bg-white border border-gray-200 shadow-2xl top-full rounded-xl min-w-72 max-h-96">
              <div className="p-1">
                <div className="sticky top-0 px-4 py-3 text-sm font-semibold text-orange-800 border-b border-orange-100 bg-gradient-to-r from-orange-50 to-red-50">
                  📂 Alle Kategorien
                </div>
                <div className="overflow-y-auto max-h-80 scrollbar-hide">
                  {categories.map(category => (
                    <button
                      key={category.value}
                      onClick={() => handleCategoryChange(category.value)}
                      className={`w-full text-left px-4 py-3 text-sm transition-all duration-200 hover:bg-gray-50 flex items-center gap-3 ${
                        selectedCategory === category.value
                          ? 'bg-gradient-to-r from-orange-50 to-red-50 text-orange-900 font-medium border-l-4 border-orange-500'
                          : 'text-gray-700 hover:text-orange-700'
                      }`}
                    >
                      <span className="flex-1">{category.label}</span>
                      {selectedCategory === category.value && (
                        <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Toggle for additional filters */}
      <div className="px-4 pb-4">
        <button
          onClick={() => setShowAllFilters(!showAllFilters)}
          className="flex items-center gap-2 text-sm text-gray-600 transition-colors hover:text-gray-800"
        >
          <span>{showAllFilters ? t('menu.filters.hideFilters') : t('menu.filters.showAllFilters')}</span>
          <svg 
            className={`w-4 h-4 transition-transform ${showAllFilters ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Additional filters (collapsible) */}
      {showAllFilters && (
        <div className="px-4 pt-4 pb-4 border-t border-gray-100">
          {/* Allergen Exclusion */}
          <div className="mb-4">
            <h4 className="mb-3 text-sm font-medium text-gray-700">
              {t('menu.filters.excludeAllergens')}
            </h4>
            <div className="flex flex-wrap gap-2">
              {commonAllergens.map(allergen => (
                <button
                  key={allergen.code}
                  onClick={() => handleAllergenToggle(allergen.code)}
                  className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                    excludedAllergens.includes(allergen.code)
                      ? 'bg-red-100 text-red-700 border border-red-300'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {excludedAllergens.includes(allergen.code) ? '✗' : '+'} {getAllergenDescription(allergen.code)}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={showVegetarian}
                onChange={(e) => {
                  setShowVegetarian(e.target.checked);
                  updateFilters(selectedCategory, excludedAllergens, e.target.checked, showVegan);
                }}
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <span className="text-green-700">🌱 {t('menu.filters.vegetarianOnly')}</span>
            </label>
            
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={showVegan}
                onChange={(e) => {
                  setShowVegan(e.target.checked);
                  updateFilters(selectedCategory, excludedAllergens, showVegetarian, e.target.checked);
                }}
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <span className="text-green-700">🌿 {t('menu.filters.veganOnly')}</span>
            </label>
          </div>
        </div>
      )}

      {/* Click outside handler for hamburger menu */}
      {showHamburgerMenu && (
        <div 
          className="fixed inset-0 z-10" 
          onClick={() => setShowHamburgerMenu(false)}
        />
      )}
    </div>
  );
}

export default MenuFilters;
