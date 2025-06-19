import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getTotalCartPrice } from './cartSlice';

interface CartSummaryProps {
  deliveryMode: 'delivery' | 'collection';
  onCheckout: () => void;
}

function CartSummary({ deliveryMode, onCheckout }: CartSummaryProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const totalCartPrice = useSelector(getTotalCartPrice);

  // Handle checkout navigation
  const handleCheckout = () => {
    // Close sidebar first
    onCheckout();
    
    // Navigate to new checkout with delivery mode context
    navigate('/checkout', { state: { deliveryMode } });
  };

  // Calculate fees based on delivery mode
  const subtotal = totalCartPrice;
  const deliveryFee = deliveryMode === 'delivery' ? 0.99 : 0;
  const serviceFee = Math.round(subtotal * 0.025 * 100) / 100; // 2.5% service fee
  const maxServiceFee = 0.99;
  const finalServiceFee = Math.min(serviceFee, maxServiceFee);
  const total = subtotal + deliveryFee + finalServiceFee;

  return (
    <div className="bg-white border-t border-gray-200 p-4">
      {/* Summary Details */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">{t('cart.subtotal', { default: 'Subtotal' })}</span>
          <span className="font-medium">{subtotal.toFixed(2)} €</span>
        </div>
        
        {deliveryMode === 'delivery' && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">{t('cart.deliveryFee', { default: 'Delivery fee' })}</span>
            <span className="font-medium">{deliveryFee.toFixed(2)} €</span>
          </div>
        )}
        
        <div className="flex justify-between text-sm">
          <div className="flex items-center gap-1">
            <span className="text-gray-600">{t('cart.serviceFee', { default: 'Service fee' })} 2.5%</span>
            <button className="text-gray-400 hover:text-gray-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
          <span className="font-medium">{finalServiceFee.toFixed(2)} €</span>
        </div>
        
        <div className="border-t border-gray-200 pt-2">
          <div className="flex justify-between font-semibold">
            <span>{t('cart.total', { default: 'Total' })}</span>
            <span>{total.toFixed(2)} €</span>
          </div>
        </div>
      </div>      {/* Checkout Button */}
      <button
        onClick={handleCheckout}
        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-4 px-6 rounded-lg transition-colors"
      >
        {t('cart.checkout', { default: 'Checkout', total: total.toFixed(2) })} ({total.toFixed(2)} €)
      </button>

      {/* Payment Info */}
      <div className="mt-3 text-center">
        <p className="text-xs text-gray-500">
          {t('cart.paymentInfo', { default: 'Payment: Cash or Card on delivery' })}
        </p>
      </div>
    </div>
  );
}

export default CartSummary;
