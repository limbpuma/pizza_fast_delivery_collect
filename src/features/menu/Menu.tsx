import { useLoaderData } from "react-router-dom";
import { getMenu } from "../../services/apiRestaurant";
import MenuItem from "./MenuItem";
import { useTranslation } from 'react-i18next';

function Menu() {
  const { t } = useTranslation();
  const menu = useLoaderData() as any[];
  return (
    <div>
      <h2 className="text-2xl font-bold text-center py-6 text-stone-800">
        {t('menu.title')}
      </h2>
      <ul className=" divide-y divide-stone-200 px-2">
        {menu.map((pizza: any) => (
          <MenuItem pizza={pizza} key={pizza.id} />
        ))}
      </ul>
    </div>
  );
}
export async function loader() {
  const menu = await getMenu();

  return menu;
}
export default Menu;
