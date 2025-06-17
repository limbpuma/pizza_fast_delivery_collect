import { useTranslation } from 'react-i18next';

interface CartHeaderProps {
  deliveryMode: 'delivery' | 'collection';
  onDeliveryModeChange: (mode: 'delivery' | 'collection') => void;
  onClose: () => void;
}

function CartHeader({ deliveryMode, onDeliveryModeChange, onClose }: CartHeaderProps) {
  const { t } = useTranslation();

  const estimatedTimes = {
    delivery: '45-65',
    collection: '15'
  };

  return (
    <div className="bg-white border-b border-gray-200 p-4">
      {/* Header with title and close button */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          {t('cart.title', { default: 'Basket' })}
        </h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Close basket"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Delivery/Collection Tabs */}
      <div className="flex bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => onDeliveryModeChange('delivery')}
          className={`
            flex-1 flex items-center justify-center py-3 px-4 rounded-md text-sm font-medium transition-all
            ${deliveryMode === 'delivery' 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
            }
          `}
        >
          <span className="mr-2">🚚</span>
          <div className="text-left">
            <div>{t('cart.delivery', { default: 'Delivery' })}</div>
            <div className="text-xs text-gray-500">
              {estimatedTimes.delivery} {t('cart.estimatedTime', { default: 'min' })}
            </div>
          </div>
        </button>

        <button
          onClick={() => onDeliveryModeChange('collection')}
          className={`
            flex-1 flex items-center justify-center py-3 px-4 rounded-md text-sm font-medium transition-all
            ${deliveryMode === 'collection' 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
            }
          `}
        >
          <span className="mr-2">🏪</span>
          <div className="text-left">
            <div>{t('cart.collection', { default: 'Collection' })}</div>
            <div className="text-xs text-gray-500">
              {estimatedTimes.collection} {t('cart.estimatedTime', { default: 'min' })}
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}

export default CartHeader;
