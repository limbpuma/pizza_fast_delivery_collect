import { useTranslation } from 'react-i18next';
import { SavedOrder, getRelativeTime } from '../../utils/orderCache';
import { formatCurrency } from '../../utils/helpers';

interface OrderHistoryItemProps {
  order: SavedOrder;
  onReorder: () => void;
  onViewDetails: () => void;
}

function OrderHistoryItem({ order, onReorder, onViewDetails }: OrderHistoryItemProps) {
  const { t } = useTranslation();

  // Format the order date
  const relativeTime = getRelativeTime(order.timestamp, t);

  // Get order items count
  const itemCount = order.cart.reduce((sum, item) => sum + item.quantity, 0);

  // Get status color and icon
  const getStatusDisplay = (status?: string) => {
    switch (status) {
      case 'confirmed':
        return {
          color: 'text-blue-600 bg-blue-100',
          icon: '✅',
          text: t('orders.item.status.confirmed')
        };
      case 'preparing':
        return {
          color: 'text-yellow-600 bg-yellow-100',
          icon: '👨‍🍳',
          text: t('orders.item.status.preparing')
        };
      case 'delivered':
        return {
          color: 'text-green-600 bg-green-100',
          icon: '🚚',
          text: t('orders.item.status.delivered')
        };
      case 'completed':
        return {
          color: 'text-green-600 bg-green-100',
          icon: '✅',
          text: t('orders.item.status.completed')
        };
      default:
        return {
          color: 'text-gray-600 bg-gray-100',
          icon: '⏳',
          text: t('orders.item.status.pending')
        };
    }
  };

  const statusDisplay = getStatusDisplay(order.status);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* Order Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-900">
            {t('orders.item.orderNumber', { number: order.orderNumber.replace('CP', '') })}
          </h3>
          <p className="text-sm text-gray-600">
            {t('orders.item.orderedOn', { date: relativeTime })}
          </p>
        </div>
        
        {/* Status Badge */}
        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusDisplay.color}`}>
          <span>{statusDisplay.icon}</span>
          {statusDisplay.text}
        </span>
      </div>

      {/* Order Summary */}
      <div className="mb-4">
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            {t('orders.item.items', { count: itemCount })}
          </span>
          
          <span className="flex items-center gap-1">
            {order.deliveryMode === 'delivery' ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 17l4 4 4-4m-4-5v9" />
                </svg>
                {t('cart.delivery')}
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7l4-4 4 4m-4-5v9" />
                </svg>
                {t('cart.collection')}
              </>
            )}
          </span>

          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {order.paymentMethod === 'cash' ? t('checkout.cash') : t('checkout.card')}
          </span>
        </div>

        {/* Products Preview */}
        <div className="text-sm text-gray-700 mb-3">          {order.cart.slice(0, 2).map((item, index) => (
            <div key={index} className="flex justify-between">
              <span>                <span className="text-xs text-gray-500 mr-1">
                  {t('menu.productNumber', { number: item.pizzaId })}
                </span>
                {item.quantity}× {item.name}
              </span>
              <span>{formatCurrency(item.totalPrice)}</span>
            </div>
          ))}
          {order.cart.length > 2 && (
            <div className="text-xs text-gray-500 mt-1">
              +{order.cart.length - 2} more items...
            </div>
          )}
        </div>

        {/* Total */}
        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
          <span className="font-semibold text-gray-900">
            {t('orders.item.total', { amount: formatCurrency(order.pricing.total) })}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={onViewDetails}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
        >
          {t('orders.item.actions.viewDetails')}
        </button>
        <button
          onClick={onReorder}
          className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors text-sm font-medium"
        >
          {t('orders.item.actions.reorder')}
        </button>
      </div>
    </div>
  );
}

export default OrderHistoryItem;
