import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { OrderData, WhatsAppResult } from '../types/whatsapp';
import WhatsAppService from '../services/whatsappService';
import { formatCurrency } from '../utils/helpers';

interface WhatsAppConfirmationModalProps {
  orderData: OrderData;
  isOpen: boolean;
  onConfirm: (result: WhatsAppResult) => void;
  onCancel: () => void;
  onEdit: () => void;
}

export function WhatsAppConfirmationModal({
  orderData,
  isOpen,
  onConfirm,
  onCancel,
  onEdit
}: WhatsAppConfirmationModalProps) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  if (!isOpen) return null;

  const whatsappMessage = WhatsAppService.formatOrderMessage(orderData);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      const result = await WhatsAppService.sendOrder(orderData);
      onConfirm(result);
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      onConfirm({
        success: false,
        method: 'error',
        error: 'Failed to send message'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onCancel}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-900">
              <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.479 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.867-2.031-.966-.272-.099-.47-.149-.669.149-.198.297-.768.966-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
              {t('whatsapp.confirmOrder', { default: 'Confirm WhatsApp Order' })}
            </h2>
            <button
              onClick={onCancel}
              className="text-gray-400 transition-colors hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4 overflow-y-auto max-h-[60vh]">
          {/* Order Summary */}
          <div className="mb-6">
            <h3 className="mb-3 text-lg font-medium text-gray-900">
              {t('checkout.orderSummary', { default: 'Order Summary' })}
            </h3>
            
            <div className="p-4 space-y-2 rounded-lg bg-gray-50">
              <div className="flex justify-between">
                <span className="text-gray-600">
                  {t('checkout.orderNumber', { default: 'Order No.:' })}
                </span>
                <span className="font-medium">#{orderData.orderNumber}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">
                  {t('checkout.customer', { default: 'Customer:' })}
                </span>
                <span className="font-medium">{orderData.customer}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">
                  {t('checkout.total', { default: 'Total:' })}
                </span>
                <span className="font-bold text-orange-600">
                  {formatCurrency(orderData.pricing.total)}
                </span>
              </div>
            </div>
          </div>

          {/* Message Preview Toggle */}
          <div className="mb-6">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-2 text-sm text-blue-600 transition-colors hover:text-blue-800"
            >
              <svg 
                className={`w-4 h-4 transition-transform ${showPreview ? 'rotate-90' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              {showPreview 
                ? t('whatsapp.hidePreview', { default: 'Hide Preview' })
                : t('whatsapp.showPreview', { default: 'Show Message Preview' })
              }
            </button>
            
            {showPreview && (
              <div className="p-4 mt-3 border border-green-200 rounded-lg bg-green-50">
                <h4 className="mb-2 text-sm font-medium text-green-800">
                  {t('whatsapp.messagePreview', { default: 'Message to be sent:' })}
                </h4>
                <pre className="font-mono text-sm text-green-700 whitespace-pre-wrap">
                  {whatsappMessage}
                </pre>
              </div>
            )}
          </div>

          {/* Important Notes */}
          <div className="p-4 mb-6 border border-blue-200 rounded-lg bg-blue-50">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-sm text-blue-800">
                <p className="mb-1 font-medium">
                  {t('whatsapp.importantNote', { default: 'Important:' })}
                </p>
                <ul className="space-y-1 text-blue-700">
                  <li>• {t('whatsapp.note1', { default: 'WhatsApp will open automatically' })}</li>
                  <li>• {t('whatsapp.note2', { default: 'Send the message as shown' })}</li>
                  <li>• {t('whatsapp.note3', { default: 'The restaurant will confirm your order' })}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex flex-col-reverse gap-3 sm:flex-row">
            <button
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1 px-4 py-2 text-gray-700 transition-colors bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('common.cancel', { default: 'Cancel' })}
            </button>
            
            <button
              onClick={onEdit}
              disabled={isLoading}
              className="flex-1 px-4 py-2 text-orange-700 transition-colors border border-orange-200 rounded-lg bg-orange-50 hover:bg-orange-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('common.edit', { default: 'Edit Order' })}
            </button>
            
            <button
              onClick={handleConfirm}
              disabled={isLoading}
              className="flex items-center justify-center flex-1 gap-2 px-4 py-2 text-white transition-colors bg-green-500 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin" />
                  {t('common.sending', { default: 'Sending...' })}
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.479 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654z"/>
                  </svg>
                  {t('whatsapp.sendOrder', { default: 'Send via WhatsApp' })}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WhatsAppConfirmationModal;