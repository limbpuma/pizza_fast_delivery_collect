import { useLoaderData } from "react-router-dom";
import { getMenu } from "../../services/apiRestaurant";
import MenuItem from "./MenuItem";
import { useTranslation } from 'react-i18next';

function Menu() {
  const { t } = useTranslation();
  const menu = useLoaderData() as any[];
  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
        {t('menu.title')}
      </h2>
      
      {/* Modern Grid Layout for Pizza Cards */}
      <div className="menu-grid">
        <ul className="space-y-6">
          {menu.map((pizza: any) => (
            <MenuItem pizza={pizza} key={pizza.id} />
          ))}
        </ul>
      </div>
    </div>
  );
}
export async function loader() {
  const menu = await getMenu();

  return menu;
}
export default Menu;
