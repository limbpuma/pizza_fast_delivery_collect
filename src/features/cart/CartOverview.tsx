import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getTotalCartPrice, getTotalCartQuantity } from "./cartSlice";
import { formatCurrency } from "../../utils/helpers";
import { useTranslation } from 'react-i18next';

function CartOverview() {
  const { t } = useTranslation();
  const cartTotalPrice = useSelector(getTotalCartPrice);
  const cartTotalQuantity = useSelector(getTotalCartQuantity);

  if (!cartTotalQuantity) return null;

  const pizzaText = cartTotalQuantity === 1 ? t('common.pizza') : t('common.pizzas');

  return (
    <div className=" bg-stone-800 text-stone-200 uppercase px-4 py-4 sm:px-6 flex items-center justify-between">
      <p className=" font-semibold text-stone-300 space-x-4 sm:space-x-6 ">
        <span>{cartTotalQuantity} {pizzaText}</span>
        <span>{formatCurrency(cartTotalPrice)}</span>
      </p>
      <Link to="/cart">{t('cart.openCart')}</Link>
    </div>
  );
}

export default CartOverview;
