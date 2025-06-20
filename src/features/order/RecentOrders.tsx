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
  const [selectedOrder, setSelectedOrder] = useState<SavedOrder | null>(null);
  const [showReorderConfirm, setShowReorderConfirm] = useState<SavedOrder | null>(null);

  // Load orders on component mount
  useEffect(() => {
    const loadOrders = async () => {
      try {
        // Initialize cache (clean old orders, migrate data)
        initializeOrderCache();
        
        // Load recent orders
        const recentOrders = getRecentOrders();
        setOrders(recentOrders);
      } catch (error) {
        console.error('Error loading orders:', error);
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

      // Navigate to cart with delivery mode from the order
      navigate('/cart', {
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
        <div className="px-4 py-6 max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <LinkButton to="/menu">&larr; {t('common.backToMenu')}</LinkButton>
          </div>

          {/* Loading skeleton */}
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white rounded-lg p-6 border border-gray-200">
                  <div className="h-4 bg-gray-200 rounded w-32 mb-3"></div>
                  <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 py-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <LinkButton to="/menu">&larr; {t('common.backToMenu')}</LinkButton>
        </div>

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {t('orders.title')}
          </h1>
          
          {/* Statistics */}
          {orders.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
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
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {t('orders.empty.title')}
            </h3>
            <p className="text-gray-600 mb-6">
              {t('orders.empty.description')}
            </p>
            <button
              onClick={() => navigate('/menu')}
              className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              {t('orders.empty.action')}
            </button>
          </div>
        ) : (
          // Orders Grid
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {t('orders.reorder.confirmTitle')}
              </h3>
              <p className="text-gray-600 mb-6">
                {t('orders.reorder.confirmMessage', { orderNumber: showReorderConfirm.orderNumber })}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowReorderConfirm(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  {t('orders.reorder.cancel')}
                </button>
                <button
                  onClick={confirmReorder}
                  className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
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
