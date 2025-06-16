import { useState } from 'react';
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

  const categories = [
    { value: 'all', label: t('menu.filters.all') },
    { value: 'vegetarisch', label: t('menu.categories.vegetarisch') },
    { value: 'vegan', label: t('menu.categories.vegan') },
    { value: 'fleisch', label: t('menu.categories.fleisch') },
    { value: 'meeresfrüchte', label: t('menu.categories.meeresfrüchte') },
    { value: 'klassisch', label: t('menu.categories.klassisch') }
  ];

  const commonAllergens = [
    'Gluten', 'Milch', 'Eier', 'Nüsse', 'Soja', 'Weizen'
  ];

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
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

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {t('menu.filters.title')}
      </h3>
      
      {/* Category Filters */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">
          {t('menu.filters.category')}
        </h4>
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category.value}
              onClick={() => handleCategoryChange(category.value)}
              className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category.value
                  ? 'bg-yellow-400 text-yellow-900'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

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
      <div className="flex gap-4">
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
  );
}

export default MenuFilters;
