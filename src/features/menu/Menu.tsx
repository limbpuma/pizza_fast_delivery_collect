import { useLoaderData } from "react-router-dom";
import { useState } from "react";
import { getMenu } from "../../services/apiRestaurant";
import MenuItemCompact from "./MenuItemCompact";
import MenuFilters from "./MenuFilters";
import RestaurantHeader from "./RestaurantHeader";
import { useTranslation } from 'react-i18next';

function Menu() {
  const { t } = useTranslation();
  // Using real menu data with category field (processed from kategorie)
  const menu = useLoaderData() as any[];
  
  const [filters, setFilters] = useState({
    category: 'all',
    allergens: [] as string[],
    showVegetarian: false,
    showVegan: false
  });

  // Handle filter changes
  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };  // Filter menu items according to selected criteria
  const filteredMenu = menu.filter(item => {
    // Category filter
    if (filters.category !== 'all' && item.category !== filters.category) {
      return false;
    }
    
    // Allergen exclusion filter
    if (filters.allergens.length > 0 && item.allergens) {
      const hasExcludedAllergen = filters.allergens.some((allergen: string) => 
        item.allergens.includes(allergen)
      );
      if (hasExcludedAllergen) return false;
    }

    // Quick filters for vegetarian/vegan
    if (filters.showVegetarian && item.category !== 'Vegetarisch' && item.category !== 'Pizzen Vegetarisch') {
      return false;
    }
    
    if (filters.showVegan && !item.category?.toLowerCase().includes('vegan')) {
      return false;
    }

    return true;
  });

  // Debug: Log filtering results when category filter is active
  if (filters.category !== 'all') {
    console.log(`🔍 Filtering for category "${filters.category}":`, {
      totalItems: menu.length,
      filteredItems: filteredMenu.length,
      sampleFilteredItems: filteredMenu.slice(0, 3).map(item => ({ name: item.name, category: item.category }))
    });
  }

  return (
    <div>
      {/* Restaurant Header with hero image and info */}
      <RestaurantHeader />
      {/* Sistema de Filtros */}
        <MenuFilters onFilterChange={handleFilterChange}/>
        <div className="max-w-6xl mx-auto px-4 py-6">
        
        
        {/* Contador de resultados */}
        <div className="mb-6 text-center text-gray-600">
          {t('menu.filters.results', { count: filteredMenu.length })}
        </div>        {/* Modern Grid Layout for Menu Items */}        <div className="menu-grid">
          <ul className="space-y-4">
            {filteredMenu.map((item: any) => (
              <MenuItemCompact pizza={item} key={item.id} />
            ))}
          </ul>
        </div>
          {/* Mensaje si no hay resultados */}
        {filteredMenu.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🍕</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {t('menu.filters.noResults')}
            </h3>            <p className="text-gray-500">
              {t('menu.filters.adjustFilters')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
export async function loader() {
  const menu = await getMenu();

  return menu;
}
export default Menu;
