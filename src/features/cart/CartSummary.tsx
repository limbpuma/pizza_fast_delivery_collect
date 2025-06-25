import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import { getTotalCartPrice } from './cartSlice';
import { 
  selectUser
} from '../user/userSlice';
import { getTariffByPLZ } from '../../utils/deliveryTariffs';

interface CartSummaryProps {
  deliveryMode: 'delivery' | 'collection';
  onCheckout: () => void;
}

function CartSummary({ deliveryMode, onCheckout }: CartSummaryProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const totalCartPrice = useSelector(getTotalCartPrice);
  const user = useSelector(selectUser);

  // No delivery calculation needed as all delivery is now free

  // Handle checkout navigation
  const handleCheckout = () => {
    // Close sidebar first
    onCheckout();
    
    // Navigate to new checkout with delivery mode context
    navigate('/checkout', { state: { deliveryMode } });
  };

  // Calculate fees based on delivery mode and dynamic pricing
  const subtotal = totalCartPrice;
  
  // All delivery and service fees eliminated - everything is now free
  const total = subtotal;

  // Check mindestbestellwert validation
  const currentTariff = useMemo(() => {
    if (deliveryMode === 'delivery' && user.plz) {
      return getTariffByPLZ(user.plz);
    }
    return getTariffByPLZ('abholung'); // pickup
  }, [deliveryMode, user.plz]);

  const meetsMinimum = useMemo(() => {
    if (!currentTariff) return true;
    return subtotal >= currentTariff.mindestbestellwert;
  }, [subtotal, currentTariff]);

  const missingAmount = useMemo(() => {
    if (!currentTariff || meetsMinimum) return 0;
    return currentTariff.mindestbestellwert - subtotal;
  }, [currentTariff, meetsMinimum, subtotal]);
  return (
    <div className="bg-white border-t border-gray-200 p-4">
      {/* Minimum Order Validation */}
      {!meetsMinimum && currentTariff && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium text-red-800">
              ⚠️ Mindestbestellwert nicht erreicht
            </span>
          </div>
          <p className="text-xs text-red-600">
            Mindestbestellwert: €{currentTariff.mindestbestellwert.toFixed(2)} 
            • Noch €{missingAmount.toFixed(2)} erforderlich
          </p>
        </div>
      )}

      {/* Free Delivery Progress Bar - All deliveries now free! */}
      {deliveryMode === 'delivery' && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-green-800">
              🎉 Kostenlose Lieferung für alle!
            </span>
            <span className="text-xs text-green-600">
              Alle Zonen jetzt gratis
            </span>
          </div>
          <div className="w-full bg-green-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: '100%' }}
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
            <span className="font-medium text-green-600">Kostenlos</span>
          </div>
        )}
        
        {/* Service fee removed - now free for all customers */}
        
        <div className="border-t border-gray-200 pt-2">
          <div className="flex justify-between font-semibold">
            <span>{t('cart.total', { default: 'Total' })}</span>
            <span>{total.toFixed(2)} €</span>
          </div>
        </div>
      </div>      {/* Enhanced Checkout Button */}
      <button
        onClick={handleCheckout}
        disabled={!meetsMinimum}
        className={`w-full font-bold py-4 px-6 rounded-xl transition-all duration-200 transform ${
          meetsMinimum 
            ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white hover:scale-[1.02] shadow-lg' 
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        <div className="flex items-center justify-center gap-2">
          <span>
            {meetsMinimum 
              ? `🍕 Order Now - ${total.toFixed(2)}€` 
              : `❌ Mindestbestellwert: €${currentTariff?.mindestbestellwert.toFixed(2) || '0.00'}`
            }
          </span>
        </div>
        <div className="text-xs opacity-90 mt-1">
          {meetsMinimum 
            ? `⏱️ ${deliveryMode === 'delivery' ? 'Delivered in 25-30 min' : 'Ready in 15-20 min'}`
            : `Noch €${missingAmount.toFixed(2)} zum Minimum hinzufügen`
          }
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
