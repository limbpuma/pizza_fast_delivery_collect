import { useLoaderData } from "react-router-dom";
import { useState } from "react";
import { getMenu } from "../../services/apiRestaurant";
import MenuItemCompact from "./MenuItemCompact";
import MenuFilters from "./MenuFilters";
import { useTranslation } from 'react-i18next';
import { getGermanPizzaInfo } from "../../data/germanPizzaInfo";
import { mockNonPizzaItems } from "../../data/mockNonPizzaItems";
import QuickAddDemo from "./QuickAddDemo";

function Menu() {
  const { t } = useTranslation();
  const originalMenu = useLoaderData() as any[];
  
  // Temporalmente agregar productos no-pizza para demostrar Quick Add
  const enhancedMenu = [...originalMenu, ...mockNonPizzaItems];
  const menu = enhancedMenu;
  const [filters, setFilters] = useState({
    category: 'all',
    allergens: [] as string[],
    showVegetarian: false,
    showVegan: false
  });

  // Filtrar pizzas según los criterios seleccionados
  const filteredMenu = menu.filter(pizza => {
    const germanInfo = getGermanPizzaInfo(pizza.id);
    
    // Filtro por categoría
    if (filters.category !== 'all' && germanInfo?.category !== filters.category) {
      return false;
    }    // Filtro por alérgenos excluidos
    if (filters.allergens.length > 0 && germanInfo?.allergens) {
      const hasExcludedAllergen = filters.allergens.some((allergen: string) => 
        germanInfo.allergens.includes(allergen)
      );
      if (hasExcludedAllergen) return false;
    }

    // Filtros rápidos vegetariano/vegano
    if (filters.showVegetarian && germanInfo?.category !== 'vegetarisch' && germanInfo?.category !== 'vegan') {
      return false;
    }
    
    if (filters.showVegan && germanInfo?.category !== 'vegan') {
      return false;
    }

    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
        {t('menu.title')}
      </h2>
      
      {/* Sistema de Filtros */}
      <MenuFilters onFilterChange={setFilters} />
      
      {/* Contador de resultados */}
      <div className="mb-6 text-center text-gray-600">
        {t('menu.filters.results', { count: filteredMenu.length })}
      </div>
        {/* Modern Grid Layout for Pizza Cards */}
      <div className="menu-grid">
        <ul className="space-y-4">
          {filteredMenu.map((pizza: any) => (
            <MenuItemCompact pizza={pizza} key={pizza.id} />
          ))}
        </ul>
      </div>
        {/* Mensaje si no hay resultados */}
      {filteredMenu.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🍕</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            {t('menu.filters.noResults')}
          </h3>
          <p className="text-gray-500">
            {t('menu.filters.adjustFilters')}
          </p>
        </div>
      )}      {/* Quick Add Demo Component */}
      <QuickAddDemo menu={menu} />
    </div>
  );
}
export async function loader() {
  const menu = await getMenu();

  return menu;
}
export default Menu;
