import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import { getTotalCartPrice } from './cartSlice';
import { 
  selectUser
} from '../user/userSlice';
import { calculateDeliveryFee } from '../../utils/deliveryTariffs';

interface CartSummaryProps {
  deliveryMode: 'delivery' | 'collection';
  onCheckout: () => void;
}

function CartSummary({ deliveryMode, onCheckout }: CartSummaryProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const totalCartPrice = useSelector(getTotalCartPrice);
  const user = useSelector(selectUser);

  // Handle checkout navigation
  const handleCheckout = () => {
    // Close sidebar first
    onCheckout();
    
    // Navigate to new checkout with delivery mode context
    navigate('/checkout', { state: { deliveryMode } });
  };

  // Calculate fees based on delivery mode and dynamic pricing
  const subtotal = totalCartPrice;
  
  // Dynamic delivery calculation using tariff system
  const deliveryCalculation = useMemo(() => {
    const userPLZ = user.postalCode || user.plz;
    
    if (deliveryMode === 'delivery' && userPLZ) {
      return calculateDeliveryFee(userPLZ, subtotal);
    }
    return calculateDeliveryFee('abholung', subtotal);
  }, [deliveryMode, user, subtotal]);

  const deliveryFee = deliveryCalculation.fee;
  const total = subtotal + deliveryFee;

  // Use calculation results for validation
  const currentTariff = deliveryCalculation.tariff;
  const meetsMinimum = deliveryCalculation.meetsMinimum;
  const missingAmount = deliveryCalculation.missingAmount;
  return (
    <div className="p-4 bg-white border-t border-gray-200">
      {/* PLZ Required for Delivery */}
      {deliveryMode === 'delivery' && !user.postalCode && (
        <div className="p-3 mb-4 border border-yellow-200 rounded-lg bg-yellow-50">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium text-yellow-800">
              📍 PLZ erforderlich für Lieferung
            </span>
          </div>
          <p className="text-xs text-yellow-600">
            Bitte geben Sie Ihre Postleitzahl an, um Lieferkosten und Mindestbestellwert zu berechnen.
          </p>
        </div>
      )}

      {/* Minimum Order Validation */}
      {!meetsMinimum && currentTariff && (
        <div className="p-3 mb-4 border border-red-200 rounded-lg bg-red-50">
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

      {/* Delivery Fee Progress Bar */}
      {deliveryMode === 'delivery' && currentTariff && (
        <div className="p-3 mb-4 border border-blue-200 rounded-lg bg-blue-50">
          {deliveryCalculation.isFree ? (
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-green-800">
                🎉 Kostenlose Lieferung erreicht!
              </span>
              <span className="text-xs text-green-600">
                €{currentTariff.lieferkosten_entfallen_ab.toFixed(2)} erreicht
              </span>
            </div>
          ) : (
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-800">
                🚚 Kostenlose Lieferung ab €{currentTariff.lieferkosten_entfallen_ab.toFixed(2)}
              </span>
              <span className="text-xs text-blue-600">
                Noch €{(currentTariff.lieferkosten_entfallen_ab - subtotal).toFixed(2)}
              </span>
            </div>
          )}
          <div className="w-full h-2 bg-blue-200 rounded-full">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                deliveryCalculation.isFree ? 'bg-green-500' : 'bg-blue-500'
              }`}
              style={{ 
                width: `${Math.min(100, (subtotal / currentTariff.lieferkosten_entfallen_ab) * 100)}%` 
              }}
            ></div>
          </div>
        </div>
      )}

      {/* Summary Details */}
      <div className="mb-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">{t('cart.subtotal', { default: 'Subtotal' })}</span>
          <span className="font-medium">{subtotal.toFixed(2)} €</span>
        </div>
        
        {deliveryMode === 'delivery' && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">{t('cart.deliveryFee', { default: 'Delivery fee' })}</span>
            <span className={`font-medium ${deliveryFee === 0 ? 'text-green-600' : 'text-gray-900'}`}>
              {deliveryFee === 0 ? 'Kostenlos' : `€${deliveryFee.toFixed(2)}`}
            </span>
          </div>
        )}
        
        {/* No service fee for better customer experience */}
        
        <div className="pt-2 border-t border-gray-200">
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
        <div className="mt-1 text-xs opacity-90">
          {meetsMinimum 
            ? `⏱️ ${deliveryMode === 'delivery' ? 'Delivered in 25-30 min' : 'Ready in 15-20 min'}`
            : `Noch €${missingAmount.toFixed(2)} zum Minimum hinzufügen`
          }
        </div>
      </button>

      {/* Trust Signals */}
      <div className="flex items-center justify-center gap-4 mt-3 text-xs text-gray-500">
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
