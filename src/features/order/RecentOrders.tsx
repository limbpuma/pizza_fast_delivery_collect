import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearCart, addItem } from '../cart/cartSlice';
import { getRecentOrders, getOrderStats, initializeOrderCache, SavedOrder } from '../../utils/orderCache';
import { formatCurrency } from '../../utils/helpers';
import OrderHistoryItem from './OrderHistoryItem';
import OrderDetailsModal from './OrderDetailsModal';
import LinkButton from '../../ui/LinkButton';

function RecentOrders() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [orders, setOrders] = useState<SavedOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<SavedOrder | null>(null);
  const [showReorderConfirm, setShowReorderConfirm] = useState<SavedOrder | null>(null);

  // Load orders on component mount
  useEffect(() => {
    const loadOrders = async () => {
      try {
        setError(null);
        // Initialize cache (clean old orders, migrate data)
        initializeOrderCache();
        
        // Load recent orders
        const recentOrders = getRecentOrders();
        setOrders(recentOrders);
      } catch (error) {
        console.error('Error loading orders:', error);
        setError(error instanceof Error ? error.message : 'Failed to load orders');
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  // Handle reorder with confirmation
  const handleReorder = (order: SavedOrder) => {
    setShowReorderConfirm(order);
  };

  const confirmReorder = () => {
    if (!showReorderConfirm) return;

    try {
      // Clear current cart
      dispatch(clearCart());
        // Add items from the order
      showReorderConfirm.cart.forEach(item => {
        dispatch(addItem(item));
      });

      // Navigate to checkout with delivery mode from the order
      navigate('/checkout', {
        state: {
          deliveryMode: showReorderConfirm.deliveryMode,
          reorderFrom: showReorderConfirm.orderNumber
        }
      });

      setShowReorderConfirm(null);
    } catch (error) {
      console.error('Error during reorder:', error);
      alert('There was an error reordering. Please try again.');
    }
  };

  // View order details
  const handleViewDetails = (order: SavedOrder) => {
    setSelectedOrder(order);
  };

  // Get statistics
  const stats = getOrderStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl px-4 py-6 mx-auto">
          {/* Header */}
          <div className="mb-6">
            <LinkButton to="/menu">&larr; {t('common.backToMenu')}</LinkButton>
          </div>

          {/* Loading skeleton */}
          <div className="animate-pulse">
            <div className="w-64 h-8 mb-6 bg-gray-200 rounded"></div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="p-6 bg-white border border-gray-200 rounded-lg">
                  <div className="w-32 h-4 mb-3 bg-gray-200 rounded"></div>
                  <div className="w-48 h-6 mb-4 bg-gray-200 rounded"></div>
                  <div className="space-y-2">
                    <div className="w-full h-3 bg-gray-200 rounded"></div>
                    <div className="w-3/4 h-3 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl px-4 py-6 mx-auto">
          {/* Header */}
          <div className="mb-6">
            <LinkButton to="/menu">&larr; {t('common.backToMenu')}</LinkButton>
          </div>

          {/* Error message */}
          <div className="p-6 text-center border border-red-200 rounded-lg bg-red-50">
            <div className="mb-2 text-lg font-semibold text-red-600">
              {t('orders.error.title', 'Error loading orders')}
            </div>
            <div className="mb-4 text-red-700">
              {t('orders.error.message', 'We couldn\'t load your order history. This might be due to corrupted data.')}
            </div>
            <button
              onClick={() => {
                setError(null);
                setLoading(true);
                // Clear potentially corrupted data and retry
                localStorage.removeItem('campusPizzaOrders');
                const loadOrders = async () => {
                  try {
                    initializeOrderCache();
                    const recentOrders = getRecentOrders();
                    setOrders(recentOrders);
                  } catch (error) {
                    console.error('Error loading orders after reset:', error);
                    setError('Still unable to load orders. Please try again later.');
                  } finally {
                    setLoading(false);
                  }
                };
                loadOrders();
              }}
              className="px-4 py-2 text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700"
            >
              {t('orders.error.retry', 'Clear data and retry')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl px-4 py-6 mx-auto">
        {/* Header */}
        <div className="mb-6">
          <LinkButton to="/menu">&larr; {t('common.backToMenu')}</LinkButton>
        </div>

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="mb-2 text-2xl font-bold text-gray-900">
            {t('orders.title')}
          </h1>
          
          {/* Statistics */}
          {orders.length > 0 && (
            <div className="p-4 mb-6 bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="grid grid-cols-1 gap-4 text-center sm:grid-cols-3">
                <div>
                  <div className="text-2xl font-bold text-orange-600">
                    {formatCurrency(stats.totalSpent)}
                  </div>
                  <div className="text-sm text-gray-600">
                    {t('orders.stats.totalSpent', { amount: '' }).replace(': ', '')}
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-600">
                    {stats.orderCount}
                  </div>
                  <div className="text-sm text-gray-600">
                    {t('orders.stats.ordersCount', { count: stats.orderCount })}
                  </div>
                </div>
                {stats.favoriteProduct && (
                  <div>
                    <div className="text-lg font-semibold text-gray-900 truncate">
                      {stats.favoriteProduct.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {t('orders.stats.favoriteProduct', { product: '' }).replace(': ', '')}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          // Empty State
          <div className="py-12 text-center">
            <div className="flex items-center justify-center w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-medium text-gray-900">
              {t('orders.empty.title')}
            </h3>
            <p className="mb-6 text-gray-600">
              {t('orders.empty.description')}
            </p>
            <button
              onClick={() => navigate('/menu')}
              className="px-6 py-3 font-medium text-white transition-colors bg-orange-500 rounded-lg hover:bg-orange-600"
            >
              {t('orders.empty.action')}
            </button>
          </div>
        ) : (
          // Orders Grid
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {orders.map((order) => (
              <OrderHistoryItem
                key={order.orderNumber}
                order={order}
                onReorder={() => handleReorder(order)}
                onViewDetails={() => handleViewDetails(order)}
              />
            ))}
          </div>
        )}

        {/* Order Details Modal */}
        {selectedOrder && (
          <OrderDetailsModal
            order={selectedOrder}
            isOpen={true}
            onClose={() => setSelectedOrder(null)}
          />
        )}

        {/* Reorder Confirmation Modal */}
        {showReorderConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <div className="w-full max-w-md p-6 bg-white rounded-lg">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                {t('orders.reorder.confirmTitle')}
              </h3>
              <p className="mb-6 text-gray-600">
                {t('orders.reorder.confirmMessage', { orderNumber: showReorderConfirm.orderNumber })}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowReorderConfirm(null)}
                  className="flex-1 px-4 py-2 text-gray-700 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  {t('orders.reorder.cancel')}
                </button>
                <button
                  onClick={confirmReorder}
                  className="flex-1 px-4 py-2 text-white transition-colors bg-orange-500 rounded-lg hover:bg-orange-600"
                >
                  {t('orders.reorder.confirm')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default RecentOrders;
