import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getTotalCartPrice, getTotalCartQuantity } from "./cartSlice";
import { formatCurrency } from "../../utils/helpers";

function CartOverview() {
  const cartTotalPrice = useSelector(getTotalCartPrice);
  const cartTotalQuantity = useSelector(getTotalCartQuantity);

  if (!cartTotalQuantity) return null;

  return (
    <div className=" bg-stone-800 text-stone-200 uppercase px-4 py-4 sm:px-6 flex items-center justify-between">
      <p className=" font-semibold text-stone-300 space-x-4 sm:space-x-6 ">
        <span>{cartTotalQuantity} pizzas</span>
        <span>{formatCurrency(cartTotalPrice)}</span>
      </p>
      <Link to="/cart">Open cart &rarr;</Link>
    </div>
  );
}

export default CartOverview;
