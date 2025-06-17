import { useSelector } from "react-redux";
import { formatCurrency } from "../../utils/helpers";
import DeleteItem from "./DeleteItem";
import UpdateItemQuantity from "./UpdateItemQuantity";
import { getSpecificItemQuantity, CartItem as CartItemType } from "./cartSlice";

interface CartItemProps {
  item: CartItemType;
  compact?: boolean;
}

function CartItem({ item, compact = false }: CartItemProps) {
  const { pizzaId, name, quantity, totalPrice, size } = item;

  // Get the specific quantity for this exact item (pizzaId + size combination)
  const currentQuantity = useSelector(getSpecificItemQuantity(pizzaId, size));

  if (compact) {
    // Compact layout for sidebar
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-3">
        <div className="flex items-start gap-3">
          {/* Item image placeholder */}
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-lg">🍕</span>
          </div>
          
          {/* Item details */}
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-gray-900 text-sm truncate">
              {name}
            </h4>
            {size && (
              <p className="text-xs text-gray-500 mt-1">
                Size: {size}
              </p>
            )}
            <div className="flex items-center justify-between mt-2">
              <span className="font-semibold text-gray-900">
                {formatCurrency(totalPrice)}
              </span>
              
              <div className="flex items-center gap-2">
                <UpdateItemQuantity 
                  pizzaId={pizzaId} 
                  size={size}
                  currentQuantity={currentQuantity}
                  compact={true}
                />
                <DeleteItem 
                  pizzaId={pizzaId} 
                  size={size}
                  compact={true}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Original layout for full cart page
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
