import { useSelector } from 'react-redux';
import { getCart, getTotalCartQuantity } from './cartSlice';

interface CartToggleProps {
  onOpenCart: () => void;
}

function CartToggle({ onOpenCart }: CartToggleProps) {
  const cart = useSelector(getCart);
  const totalQuantity = useSelector(getTotalCartQuantity);

  // Don't show if cart is empty
  if (cart.length === 0) return null;

  return (
    <button
      onClick={onOpenCart}
      className="fixed bottom-6 right-6 bg-orange-500 hover:bg-orange-600 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-105 z-30"
      aria-label="Open cart"
    >
      <div className="relative">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9" />
        </svg>
        
        {/* Quantity Badge */}
        {totalQuantity > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
            {totalQuantity > 9 ? '9+' : totalQuantity}
          </span>
        )}
      </div>
    </button>
  );
}

export default CartToggle;
