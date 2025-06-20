import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
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
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 py-6 max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <LinkButton to="/menu">&larr; {t('common.backToMenu', { default: 'Back to Menu' })}</LinkButton>
        </div>

        {/* Success Hero Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6 text-center">
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
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            {t('orderConfirmation.title', { default: 'Order Placed Successfully!' })}
          </h1>
          
          <p className="text-gray-600 mb-6">
            {t('orderConfirmation.subtitle', { 
              default: 'Your order has been sent to our restaurant via WhatsApp.' 
            })}
          </p>

          {/* Order Number Highlight */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span className="font-semibold text-orange-900">
                {t('orderConfirmation.orderNumber', { default: 'Order Number:' })}
              </span>
            </div>
            <span className="text-2xl font-bold text-orange-600">#{orderNumber}</span>
          </div>
        </div>        {/* Order Details */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            {t('orderConfirmation.orderDetails', { default: 'Order Details' })}
          </h2>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700 font-medium">
                {t('orderConfirmation.type', { default: 'Type:' })}
              </span>
              <div className="flex items-center gap-2">
                {deliveryMode === 'delivery' ? (
                  <>
                    <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2v0a2 2 0 01-2-2v-4a2 2 0 00-2-2H8z" />
                    </svg>
                    <span className="text-gray-900 font-semibold">
                      {t('orderConfirmation.delivery', { default: 'Delivery' })}
                    </span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span className="text-gray-900 font-semibold">
                      {t('orderConfirmation.collection', { default: 'Collection' })}
                    </span>
                  </>
                )}
              </div>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700 font-medium">
                {t('orderConfirmation.estimatedTime', { default: 'Estimated Time:' })}
              </span>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-gray-900 font-semibold">{estimatedTime}</span>
              </div>
            </div>
          </div>
        </div>

        {/* WhatsApp Confirmation */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                {t('orderConfirmation.whatsappTitle', { default: 'WhatsApp Confirmation' })}
              </h3>
              <p className="text-sm text-green-600">
                {t('orderConfirmation.confirmationSent', { default: 'Confirmation sent via WhatsApp' })}
              </p>
            </div>
          </div>
          <p className="text-gray-600 text-sm">
            {t('orderConfirmation.trackingInfo', { 
              default: 'You can track your order status via WhatsApp messages from our restaurant.' 
            })}
          </p>
        </div>        {/* What's Next */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            {t('orderConfirmation.whatsNext', { default: 'What\'s Next?' })}
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg">
              <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                1
              </div>
              <div className="flex-1">
                <p className="text-gray-900 font-medium">
                  {t('orderConfirmation.step1', { 
                    default: 'Our restaurant will confirm your order via WhatsApp' 
                  })}
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg">
              <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                2
              </div>
              <div className="flex-1">
                <p className="text-gray-900 font-medium">
                  {t('orderConfirmation.step2', { 
                    default: 'We\'ll start preparing your delicious food' 
                  })}
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg">
              <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                3
              </div>
              <div className="flex-1">
                <p className="text-gray-900 font-medium">
                  {deliveryMode === 'delivery' 
                    ? t('orderConfirmation.step3Delivery', { 
                        default: 'Our driver will deliver your order to your address' 
                      })
                    : t('orderConfirmation.step3Collection', { 
                        default: 'We\'ll notify you when your order is ready for pickup' 
                      })
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="space-y-3">
            <button
              onClick={() => navigate('/menu')}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 px-6 rounded-full transition-all duration-200 transform hover:scale-[1.02]"
            >
              {t('orderConfirmation.orderAgain', { default: 'Order Again' })}
            </button>
            
            <button
              onClick={() => navigate('/')}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-full transition-colors"
            >
              {t('orderConfirmation.backHome', { default: 'Back to Home' })}
            </button>
          </div>
        </div>

        {/* Restaurant Contact Info */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            {t('orderConfirmation.contactUs', { default: 'Contact Us' })}
          </h4>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span className="font-medium text-gray-900">
                {t('orderConfirmation.restaurantInfo', { default: 'Campus Pizza Express' })}
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-gray-600">
                {t('orderConfirmation.restaurantAddress', { 
                  default: 'Musterstraße 123, 44149 Dortmund' 
                })}
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span className="text-gray-600">
                {t('orderConfirmation.restaurantPhone', { default: 'Tel: +49 231 123 4567' })}
              </span>
            </div>

            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800 mb-2">
                {t('orderConfirmation.needHelp', { default: 'Need help with your order?' })}
              </p>
              <button
                onClick={() => window.open('https://wa.me/4917645754360', '_blank')}
                className="text-green-600 hover:text-green-700 font-medium text-sm flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                {t('orderConfirmation.whatsappSupport', { default: 'WhatsApp us directly' })}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirmation;
