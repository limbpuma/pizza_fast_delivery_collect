import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

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
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [excludedAllergens, setExcludedAllergens] = useState<string[]>([]);
  const [showVegetarian, setShowVegetarian] = useState(false);
  const [showVegan, setShowVegan] = useState(false);
  const [showAllFilters, setShowAllFilters] = useState(false);
  const [showHamburgerMenu, setShowHamburgerMenu] = useState(false);
  const [visibleCategories, setVisibleCategories] = useState<number>(6);
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const categories = [
    { value: 'all', label: t('menu.filters.all') },
    { value: 'vegetarisch', label: t('menu.categories.vegetarisch') },
    { value: 'vegan', label: t('menu.categories.vegan') },
    { value: 'fleisch', label: t('menu.categories.fleisch') },
    { value: 'meeresfrüchte', label: t('menu.categories.meeresfrüchte') },
    { value: 'klassisch', label: t('menu.categories.klassisch') },
    { value: 'spezial', label: t('menu.categories.spezial') },
    { value: 'scharf', label: t('menu.categories.scharf') },
    { value: 'käse', label: t('menu.categories.käse') },
    { value: 'premium', label: t('menu.categories.premium') },
    { value: 'regional', label: t('menu.categories.regional') },
    { value: 'süß', label: t('menu.categories.süß') },
    { value: 'gesund', label: t('menu.categories.gesund') },
    { value: 'kinderfreundlich', label: t('menu.categories.kinderfreundlich') },
    { value: 'glutenfrei', label: t('menu.categories.glutenfrei') },
    { value: 'lowcarb', label: t('menu.categories.lowcarb') }
  ];

  const commonAllergens = [
    'Gluten', 'Milch', 'Eier', 'Nüsse', 'Soja', 'Weizen'
  ];

  // Check if categories overflow and need hamburger menu
  useEffect(() => {
    const checkOverflow = () => {
      const container = scrollContainerRef.current;
      if (container) {
        const hasOverflow = container.scrollWidth > container.clientWidth;
        if (hasOverflow && visibleCategories === categories.length) {
          setVisibleCategories(4); // Show fewer on mobile
        }
      }
    };

    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [categories.length, visibleCategories]);

  // Update scroll button visibility
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
      const scrollAmount = container.clientWidth * 0.8;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setShowHamburgerMenu(false);
    updateFilters(category, excludedAllergens, showVegetarian, showVegan);
  };

  const handleAllergenToggle = (allergen: string) => {
    const newExcluded = excludedAllergens.includes(allergen)
      ? excludedAllergens.filter(a => a !== allergen)
      : [...excludedAllergens, allergen];
    
    setExcludedAllergens(newExcluded);
    updateFilters(selectedCategory, newExcluded, showVegetarian, showVegan);
  };

  const updateFilters = (category: string, allergens: string[], vegetarian: boolean, vegan: boolean) => {
    onFilterChange({
      category,
      allergens,
      showVegetarian: vegetarian,
      showVegan: vegan
    });
  };

  const visibleCategoriesList = categories.slice(0, visibleCategories);
  const hiddenCategories = categories.slice(visibleCategories);
  const hasHiddenCategories = hiddenCategories.length > 0;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
      {/* Mobile-first horizontal category scroll */}
      <div className="relative">
        {/* Left scroll button */}
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors"
            aria-label="Scroll left"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Category buttons container */}
        <div 
          ref={scrollContainerRef}
          className="flex gap-2 overflow-x-auto scrollbar-hide px-4 py-4 scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {visibleCategoriesList.map(category => (
            <button
              key={category.value}
              onClick={() => handleCategoryChange(category.value)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                selectedCategory === category.value
                  ? 'bg-yellow-400 text-yellow-900 shadow-md scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
              }`}
            >
              {category.label}
            </button>
          ))}

          {/* Hamburger menu button for hidden categories */}
          {hasHiddenCategories && (
            <div className="relative flex-shrink-0">
              <button
                onClick={() => setShowHamburgerMenu(!showHamburgerMenu)}
                className={`px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-1 ${
                  showHamburgerMenu
                    ? 'bg-yellow-400 text-yellow-900'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span>{t('menu.filters.moreCategories')}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              {/* Dropdown menu for hidden categories */}
              {showHamburgerMenu && (
                <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-48">
                  {hiddenCategories.map(category => (
                    <button
                      key={category.value}
                      onClick={() => handleCategoryChange(category.value)}
                      className={`w-full text-left px-4 py-3 text-sm transition-colors hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                        selectedCategory === category.value
                          ? 'bg-yellow-50 text-yellow-900 font-medium'
                          : 'text-gray-700'
                      }`}
                    >
                      {category.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right scroll button */}
        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors"
            aria-label="Scroll right"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>

      {/* Toggle for additional filters */}
      <div className="px-4 pb-4">
        <button
          onClick={() => setShowAllFilters(!showAllFilters)}
          className="text-sm text-gray-600 hover:text-gray-800 transition-colors flex items-center gap-2"
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
        <div className="px-4 pb-4 border-t border-gray-100 pt-4">
          {/* Allergen Exclusion */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              {t('menu.filters.excludeAllergens')}
            </h4>
            <div className="flex flex-wrap gap-2">
              {commonAllergens.map(allergen => (
                <button
                  key={allergen}
                  onClick={() => handleAllergenToggle(allergen)}
                  className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                    excludedAllergens.includes(allergen)
                      ? 'bg-red-100 text-red-700 border border-red-300'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {excludedAllergens.includes(allergen) ? '✗' : '+'} {allergen}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Filters */}
          <div className="flex gap-4 flex-wrap">
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
