import { useTranslation } from 'react-i18next';
import { SavedOrder } from '../../utils/orderCache';
import { formatCurrency, formatRelativeTime } from '../../utils/helpers';

interface OrderDetailsModalProps {
  order: SavedOrder;
  isOpen: boolean;
  onClose: () => void;
}

function OrderDetailsModal({ order, isOpen, onClose }: OrderDetailsModalProps) {
  const { t } = useTranslation();

  if (!isOpen) return null;

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'preparing':
        return 'bg-yellow-100 text-yellow-800';
      case 'delivered':
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {t('orders.details.title')}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {t('orders.details.orderNumber')}: {order.orderNumber}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Order Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">{t('orders.details.orderInfo')}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('orders.details.date')}:</span>
                  <span className="text-gray-900">{formatRelativeTime(order.timestamp)}</span>
                </div>                <div className="flex justify-between">
                  <span className="text-gray-600">{t('orders.details.type')}:</span>
                  <span className="text-gray-900">
                    {order.deliveryMode === 'delivery' ? t('orders.deliveryMode.delivery') : t('orders.deliveryMode.collection')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('orders.details.payment')}:</span>
                  <span className="text-gray-900">
                    {order.paymentMethod === 'cash' ? t('orders.paymentMethod.cash') : t('orders.paymentMethod.card')}
                  </span>
                </div>
                {order.status && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('orders.details.status')}:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {t(`orders.status.${order.status}`)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">{t('orders.details.customer')}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('checkout.name')}:</span>
                  <span className="text-gray-900">{order.customer}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('checkout.phone')}:</span>
                  <span className="text-gray-900">{order.phone}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          {order.deliveryMode === 'delivery' && order.address && (
            <div>
              <h3 className="font-medium text-gray-900 mb-2">{t('orders.details.address')}</h3>
              <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700">
                {order.address.street} {order.address.houseNumber}<br />
                {order.address.postalCode} {order.address.city}
              </div>
            </div>
          )}

          {/* Special Instructions */}
          {order.specialInstructions && (
            <div>
              <h3 className="font-medium text-gray-900 mb-2">{t('orders.details.instructions')}</h3>
              <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700">
                {order.specialInstructions}
              </div>
            </div>
          )}

          {/* Items */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">{t('orders.details.items')}</h3>
            <div className="space-y-3">
              {order.cart.map((item, index) => (                <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                  <div className="flex-1">                    <div className="font-medium text-gray-900">
                      {t('menu.productNumber', { number: item.pizzaId })} {item.name}
                    </div>
                    {item.size && (
                      <div className="text-sm text-gray-500">
                        {t('menu.size')}: {item.size}
                      </div>
                    )}
                    {item.selectedToppings && item.selectedToppings.length > 0 && (
                      <div className="text-sm text-gray-500">
                        {t('menu.toppings')}: {item.selectedToppings.join(', ')}
                      </div>
                    )}
                  </div>
                  <div className="text-right ml-4">
                    <div className="font-medium text-gray-900">
                      {item.quantity}x {formatCurrency(item.unitPrice)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatCurrency(item.totalPrice)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Summary */}
          <div className="border-t border-gray-200 pt-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">{t('cart.subtotal')}:</span>
                <span className="text-gray-900">{formatCurrency(order.pricing.subtotal)}</span>
              </div>
              {order.pricing.deliveryFee > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('checkout.deliveryFee')}:</span>
                  <span className="text-gray-900">{formatCurrency(order.pricing.deliveryFee)}</span>
                </div>
              )}
              {order.pricing.serviceFee > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('checkout.serviceFee')}:</span>
                  <span className="text-gray-900">{formatCurrency(order.pricing.serviceFee)}</span>
                </div>
              )}
              <div className="flex justify-between font-semibold text-lg border-t border-gray-200 pt-2">
                <span className="text-gray-900">{t('cart.total')}:</span>
                <span className="text-gray-900">{formatCurrency(order.pricing.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            {t('orders.close')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderDetailsModal;
