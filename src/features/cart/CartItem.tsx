import { useSelector } from "react-redux";
import { formatCurrency } from "../../utils/helpers";
import DeleteItem from "./DeleteItem";
import UpdateItemQuantity from "./UpdateItemQuantity";
import { getSpecificItemQuantity, CartItem as CartItemType } from "./cartSlice";

function CartItem({ item }: { item: CartItemType }) {
  const { pizzaId, name, quantity, totalPrice, size } = item;

  // Get the specific quantity for this exact item (pizzaId + size combination)
  const currentQuantity = useSelector(getSpecificItemQuantity(pizzaId, size));

  return (
    <li className="py-3 sm:flex sm:items-center sm:justify-between">
      <p className="mb-1 sm:mb-0">
        {quantity}&times; {name}
      </p>
      <div className="flex items-center justify-between sm:gap-6">
        <p className="text-sm font-bold">{formatCurrency(totalPrice)}</p>
      </div>
      <UpdateItemQuantity 
        pizzaId={pizzaId} 
        size={size}
        currentQuantity={currentQuantity} 
      />
      <DeleteItem 
        pizzaId={pizzaId} 
        size={size}
      />
    </li>
  );
}

export default CartItem;
