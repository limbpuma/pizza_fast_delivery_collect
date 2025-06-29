import { useLoaderData } from "react-router-dom";
import { useState } from "react";
import { useSelector } from "react-redux";
import { getMenu } from "../../services/apiRestaurant";
import MenuItemCompact from "./MenuItemCompact";
import MenuFilters from "./MenuFilters";
import RestaurantHeader from "./RestaurantHeader";
import { useTranslation } from 'react-i18next';
import { 
  selectCurrentTariff
} from '../user/userSlice';
import { 
  selectCurrentCalculation
} from '../delivery/deliverySlice';

function Menu() {
  const { t } = useTranslation();
  // Using real menu data with category field (processed from kategorie)
  const menu = useLoaderData() as any[];
  
  // Get delivery information for dynamic header
  const currentTariff = useSelector(selectCurrentTariff);
  const deliveryCalculation = useSelector(selectCurrentCalculation);
  
  // Calculate dynamic delivery fee and minimum order for header
  let headerDeliveryFee = "0,99"; // Default fallback
  let headerMinOrderAmount = 12.00; // Default fallback
  
  if (currentTariff && typeof currentTariff.lieferkosten === 'number') {
    headerDeliveryFee = currentTariff.lieferkosten.toFixed(2).replace('.', ',');
    headerMinOrderAmount = currentTariff.lieferkosten_entfallen_ab;
  }
  
  // If we have a specific calculation (based on order value), use that instead
  if (deliveryCalculation?.finalFee !== undefined && deliveryCalculation.finalFee !== null && typeof deliveryCalculation.finalFee === 'number') {
    headerDeliveryFee = deliveryCalculation.finalFee.toFixed(2).replace('.', ',');
  }
  
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

    // Quick filters for vegetarian/vegan - improved logic
    if (filters.showVegetarian) {
      const isVegetarian = item.category === 'Pizzen Vegetarisch' || 
                          item.category?.toLowerCase().includes('vegetarisch') ||
                          (item.category === 'Snacks' && !item.allergens?.includes('H')); // No fish allergen for snacks
      if (!isVegetarian) return false;
    }
    
    if (filters.showVegan) {
      const isVegan = item.category?.toLowerCase().includes('vegan') ||
                     (!item.allergens?.includes('D') && !item.allergens?.includes('E')); // No milk or eggs
      if (!isVegan) return false;
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
      <RestaurantHeader 
        deliveryFee={headerDeliveryFee}
        minOrderAmount={headerMinOrderAmount}
      />
      {/* Sistema de Filtros */}
        <MenuFilters onFilterChange={handleFilterChange}/>
        <div className="max-w-6xl px-4 py-6 mx-auto">
        
        
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
          <div className="py-12 text-center">
            <div className="mb-4 text-6xl">🍕</div>
            <h3 className="mb-2 text-xl font-semibold text-gray-700">
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
