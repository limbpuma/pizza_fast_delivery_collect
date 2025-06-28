import { useTranslation } from 'react-i18next';
import { WhatsAppResult } from '../types/whatsapp';

interface WhatsAppResultModalProps {
  result: WhatsAppResult | null;
  isOpen: boolean;
  onClose: () => void;
  onRetry?: () => void;
}

export function WhatsAppResultModal({
  result,
  isOpen,
  onClose,
  onRetry
}: WhatsAppResultModalProps) {
  const { t } = useTranslation();

  if (!isOpen || !result) return null;

  const isSuccess = result.success;
  const isError = !result.success && result.method === 'error';
  const isFallback = !result.success && result.method === 'fallback';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          {/* Success State */}
          {isSuccess && (
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {t('whatsapp.success.title', { default: '¡Enviado con éxito!' })}
              </h3>
              <p className="text-gray-600 mb-4">
                {t('whatsapp.success.description', { 
                  default: 'Tu pedido ha sido enviado por WhatsApp. El restaurante te contactará pronto.' 
                })}
              </p>
              <div className="text-sm text-gray-500">
                {t('whatsapp.success.method', { 
                  default: `Enviado vía ${result.method}`,
                  method: result.method 
                })}
                {result.platform && ` (${result.platform})`}
              </div>
            </div>
          )}

          {/* Error State */}
          {isError && (
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {t('whatsapp.error.title', { default: 'Error al enviar' })}
              </h3>
              <p className="text-gray-600 mb-4">
                {t('whatsapp.error.description', { 
                  default: 'No se pudo enviar el pedido por WhatsApp. Prueba las opciones alternativas.' 
                })}
              </p>
              {result.error && (
                <div className="text-sm text-red-600 mb-4 p-2 bg-red-50 rounded">
                  {result.error}
                </div>
              )}
            </div>
          )}

          {/* Fallback State */}
          {isFallback && (
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.348 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {t('whatsapp.fallback.title', { default: 'WhatsApp no disponible' })}
              </h3>
              <p className="text-gray-600 mb-4">
                {t('whatsapp.fallback.description', { 
                  default: 'Usa una de estas opciones alternativas para enviar tu pedido:' 
                })}
              </p>
            </div>
          )}

          {/* Alternative Actions */}
          {result.alternativeActions && result.alternativeActions.length > 0 && (
            <div className="mt-4 space-y-2">
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                {t('whatsapp.alternatives.title', { default: 'Opciones alternativas:' })}
              </h4>
              {result.alternativeActions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.action}
                  className="w-full p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3"
                >
                  <span className="text-2xl">{getActionIcon(action.type)}</span>
                  <span className="text-sm text-gray-700">{action.label}</span>
                </button>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="mt-6 flex gap-3">
            {!isSuccess && onRetry && (
              <button
                onClick={onRetry}
                className="flex-1 px-4 py-2 text-orange-700 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors"
              >
                {t('common.retry', { default: 'Reintentar' })}
              </button>
            )}
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              {t('common.close', { default: 'Cerrar' })}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function getActionIcon(type: string): string {
  const icons = {
    copy_clipboard: '📋',
    phone_call: '📞',
    email: '✉️',
    sms: '💬'
  };
  return icons[type as keyof typeof icons] || '🔗';
}

export default WhatsAppResultModal;