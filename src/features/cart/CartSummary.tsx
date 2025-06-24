import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { getTotalCartPrice } from './cartSlice';
import { 
  selectUser, 
  selectCurrentTariff
} from '../user/userSlice';
import { 
  selectCurrentCalculation,
  calculateDeliveryWithCache
} from '../delivery/deliverySlice';

interface CartSummaryProps {
  deliveryMode: 'delivery' | 'collection';
  onCheckout: () => void;
}

function CartSummary({ deliveryMode, onCheckout }: CartSummaryProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const totalCartPrice = useSelector(getTotalCartPrice);
  const user = useSelector(selectUser);
  const currentTariff = useSelector(selectCurrentTariff);
  const deliveryCalculation = useSelector(selectCurrentCalculation);

  // Trigger delivery calculation when cart price changes and we're in delivery mode
  useEffect(() => {
    if (deliveryMode === 'delivery' && user.plz && totalCartPrice > 0) {
      dispatch(calculateDeliveryWithCache({
        plz: user.plz,
        orderValue: totalCartPrice
      }) as any);
    }
  }, [dispatch, deliveryMode, user.plz, totalCartPrice]);

  // Handle checkout navigation
  const handleCheckout = () => {
    // Close sidebar first
    onCheckout();
    
    // Navigate to new checkout with delivery mode context
    navigate('/checkout', { state: { deliveryMode } });
  };

  // Calculate fees based on delivery mode and dynamic pricing
  const subtotal = totalCartPrice;
  
  // Use dynamic delivery fee from calculation, fallback to tariff, then hardcoded
  let deliveryFee = 0;
  let freeDeliveryThreshold = 12; // Default fallback
  
  if (deliveryMode === 'delivery') {
    if (deliveryCalculation?.finalFee !== undefined) {
      deliveryFee = deliveryCalculation.finalFee;
      freeDeliveryThreshold = deliveryCalculation.freeDeliveryThreshold || 12;
    } else if (currentTariff) {
      deliveryFee = currentTariff.baseFee;
      freeDeliveryThreshold = currentTariff.freeDeliveryThreshold;
    } else {
      deliveryFee = 0.99; // Ultimate fallback
    }
  }
  
  const serviceFee = Math.round(subtotal * 0.025 * 100) / 100; // 2.5% service fee
  const maxServiceFee = 0.99;
  const finalServiceFee = Math.min(serviceFee, maxServiceFee);
  const total = subtotal + deliveryFee + finalServiceFee;
  return (
    <div className="bg-white border-t border-gray-200 p-4">
      {/* Free Delivery Progress Bar */}
      {deliveryMode === 'delivery' && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-green-800">
              {subtotal >= freeDeliveryThreshold ? '🎉 Free delivery unlocked!' : `🚚 Free delivery at ${freeDeliveryThreshold}€`}
            </span>
            <span className="text-xs text-green-600">
              {subtotal >= freeDeliveryThreshold ? `Saved ${deliveryFee.toFixed(2)}€` : `${(freeDeliveryThreshold - subtotal).toFixed(2)}€ to go`}
            </span>
          </div>
          <div className="w-full bg-green-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min((subtotal / freeDeliveryThreshold) * 100, 100)}%` }}
            ></div>
          </div>
        </div>
      )}

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
      </div>      {/* Enhanced Checkout Button */}
      <button
        onClick={handleCheckout}
        className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
      >
        <div className="flex items-center justify-center gap-2">
          <span>🍕 Order Now - {total.toFixed(2)}€</span>
        </div>
        <div className="text-xs opacity-90 mt-1">
          ⏱️ {deliveryMode === 'delivery' ? 'Delivered in 25-30 min' : 'Ready in 15-20 min'}
        </div>
      </button>

      {/* Trust Signals */}
      <div className="mt-3 flex items-center justify-center gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <span>💰</span>
          <span>Cash/Card</span>
        </div>
        <div className="flex items-center gap-1">
          <span>📱</span>
          <span>WhatsApp updates</span>
        </div>
        <div className="flex items-center gap-1">
          <span>🔒</span>
          <span>Secure</span>
        </div>
      </div>
    </div>
  );
}

export default CartSummary;
