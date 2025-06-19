import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import Button from '../../ui/Button';
import LinkButton from '../../ui/LinkButton';

function OrderConfirmation() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  // Get order data from navigation state
  const { orderNumber, deliveryMode, estimatedTime } = location.state || {};

  // Redirect if no order data
  useEffect(() => {
    if (!orderNumber) {
      navigate('/', { replace: true });
    }
  }, [orderNumber, navigate]);

  if (!orderNumber) {
    return null;
  }

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto text-center">
      {/* Success Icon */}
      <div className="mb-6">
        <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center">
          <svg 
            className="w-10 h-10 text-green-600" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M5 13l4 4L19 7" 
            />
          </svg>
        </div>
      </div>

      {/* Success Message */}
      <h1 className="text-2xl font-bold text-gray-900 mb-4">
        {t('orderConfirmation.title', { default: 'Order Placed Successfully!' })}
      </h1>

      <p className="text-gray-600 mb-6">
        {t('orderConfirmation.subtitle', { 
          default: 'Your order has been sent to our restaurant via WhatsApp.' 
        })}
      </p>

      {/* Order Details */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold text-green-900 mb-4">
          {t('orderConfirmation.orderDetails', { default: 'Order Details' })}
        </h2>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-green-700 font-medium">
              {t('orderConfirmation.orderNumber', { default: 'Order Number:' })}
            </span>
            <span className="text-green-900 font-bold">#{orderNumber}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-green-700 font-medium">
              {t('orderConfirmation.type', { default: 'Type:' })}
            </span>
            <span className="text-green-900">
              {deliveryMode === 'delivery' 
                ? t('orderConfirmation.delivery', { default: 'Delivery' })
                : t('orderConfirmation.collection', { default: 'Collection' })
              }
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-green-700 font-medium">
              {t('orderConfirmation.estimatedTime', { default: 'Estimated Time:' })}
            </span>
            <span className="text-green-900">{estimatedTime}</span>
          </div>
        </div>
      </div>

      {/* WhatsApp Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-center mb-2">
          <span className="text-2xl mr-2">📱</span>
          <h3 className="text-blue-900 font-semibold">
            {t('orderConfirmation.whatsappTitle', { default: 'WhatsApp Confirmation' })}
          </h3>
        </div>
        <p className="text-blue-700 text-sm">
          {t('orderConfirmation.whatsappText', { 
            default: 'Our restaurant will confirm your order and provide updates via WhatsApp. Please keep your phone nearby.' 
          })}
        </p>
      </div>

      {/* What's Next */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <h3 className="text-yellow-900 font-semibold mb-3">
          {t('orderConfirmation.whatsNext', { default: 'What\'s Next?' })}
        </h3>
        <div className="text-left space-y-2 text-sm text-yellow-800">
          <div className="flex items-start">
            <span className="text-yellow-600 mr-2">1.</span>
            <span>
              {t('orderConfirmation.step1', { 
                default: 'Our restaurant will confirm your order via WhatsApp' 
              })}
            </span>
          </div>
          <div className="flex items-start">
            <span className="text-yellow-600 mr-2">2.</span>
            <span>
              {t('orderConfirmation.step2', { 
                default: 'We\'ll start preparing your delicious food' 
              })}
            </span>
          </div>
          <div className="flex items-start">
            <span className="text-yellow-600 mr-2">3.</span>
            <span>
              {deliveryMode === 'delivery' 
                ? t('orderConfirmation.step3Delivery', { 
                    default: 'Our driver will deliver your order to your address' 
                  })
                : t('orderConfirmation.step3Collection', { 
                    default: 'We\'ll notify you when your order is ready for pickup' 
                  })
              }
            </span>
          </div>
        </div>
      </div>      {/* Action Buttons */}
      <div className="space-y-3">
        <Button 
          to="/menu" 
          type="primary"
        >
          {t('orderConfirmation.orderAgain', { default: 'Order Again' })}
        </Button>
        
        <LinkButton to="/">
          {t('orderConfirmation.backHome', { default: 'Back to Home' })}
        </LinkButton>
      </div>

      {/* Restaurant Info */}
      <div className="mt-8 pt-6 border-t border-gray-200 text-center">
        <h4 className="font-semibold text-gray-900 mb-2">
          {t('orderConfirmation.restaurantInfo', { default: 'Campus Pizza Express' })}
        </h4>
        <p className="text-sm text-gray-600">
          {t('orderConfirmation.restaurantAddress', { 
            default: 'Musterstraße 123, 44149 Dortmund' 
          })}
        </p>
        <p className="text-sm text-gray-600">
          {t('orderConfirmation.restaurantPhone', { default: 'Tel: +49 231 123 4567' })}
        </p>
      </div>
    </div>
  );
}

export default OrderConfirmation;
