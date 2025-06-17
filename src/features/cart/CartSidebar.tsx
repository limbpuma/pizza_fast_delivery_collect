import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getCart } from './cartSlice';
import CartHeader from './CartHeader';
import CartItem from './CartItem';
import CartSuggestions from './CartSuggestions';
import CartSummary from './CartSummary';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { t } = useTranslation();
  const cart = useSelector(getCart);
  const [deliveryMode, setDeliveryMode] = useState<'delivery' | 'collection'>('delivery');

  // Early return if not open
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40 transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className={`
        fixed top-0 right-0 h-full bg-white shadow-xl z-50
        w-full sm:w-96 md:w-[400px]
        transform transition-transform duration-300 ease-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        flex flex-col
      `}>
        {/* Header with tabs */}
        <CartHeader 
          deliveryMode={deliveryMode}
          onDeliveryModeChange={setDeliveryMode}
          onClose={onClose}
        />

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Cart Items */}
          {cart.length > 0 ? (
            <div className="p-4">
              <div className="space-y-3">
                {cart.map((item: any) => (
                  <CartItem 
                    item={item} 
                    key={`${item.pizzaId}-${item.size || 'default'}`}
                    compact={true}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center text-gray-500">
                <div className="text-6xl mb-4">🛒</div>
                <h3 className="text-lg font-medium mb-2">
                  {t('cart.empty.title')}
                </h3>
                <p className="text-sm">
                  {t('cart.empty.description', { default: 'Your basket is empty. Add some delicious items!' })}
                </p>
              </div>
            </div>
          )}

          {/* Suggestions */}
          {cart.length > 0 && (
            <CartSuggestions cartItems={cart} />
          )}
        </div>

        {/* Summary and Checkout */}
        {cart.length > 0 && (
          <CartSummary 
            deliveryMode={deliveryMode}
            onCheckout={onClose}
          />
        )}
      </div>
    </>
  );
}

export default CartSidebar;
