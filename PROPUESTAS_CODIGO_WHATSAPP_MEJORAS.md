# 🔧 Propuestas de Implementación - Integración WhatsApp
**Rama:** `lim1712/revision-integracion-whatsapp`  
**Enfoque:** Código propuesto para mejoras específicas

## 📋 Tabla de Contenidos
1. [WhatsApp Service Completo](#whatsapp-service-completo)
2. [Modal de Confirmación](#modal-de-confirmación)
3. [Sistema de Fallbacks](#sistema-de-fallbacks)
4. [Tipos y Interfaces](#tipos-y-interfaces)
5. [Hooks Personalizados](#hooks-personalizados)
6. [Componentes de UI](#componentes-de-ui)

---

## 1. 🏗️ WhatsApp Service Completo

### `src/services/whatsappService.ts`

```typescript
import { OrderData, WhatsAppResult, MessageTemplate, PlatformInfo } from '../types/whatsapp';
import { formatCurrency } from '../utils/helpers';

export class WhatsAppService {
  private static readonly RESTAURANT_PHONE = '+4917645754360';
  private static readonly MAX_MESSAGE_LENGTH = 4096; // Límite de WhatsApp
  private static readonly WEB_WHATSAPP_URL = 'https://web.whatsapp.com/send';
  private static readonly MOBILE_WHATSAPP_URL = 'https://wa.me';

  /**
   * Detecta la plataforma y capacidades del dispositivo
   */
  private static detectPlatform(): PlatformInfo {
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobile = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(userAgent);
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    const isAndroid = /android/.test(userAgent);
    
    return {
      isMobile,
      isIOS,
      isAndroid,
      isDesktop: !isMobile,
      supportsDeepLink: isMobile,
      preferredMethod: isMobile ? 'native' : 'web'
    };
  }

  /**
   * Genera el mensaje de WhatsApp formatado
   */
  static formatOrderMessage(orderData: OrderData, locale: string = 'de'): string {
    const {
      orderNumber,
      customer,
      phone,
      deliveryMode,
      address,
      cart,
      pricing,
      paymentMethod,
      specialInstructions
    } = orderData;

    // Traducción dinámica de textos clave
    const texts = this.getLocalizedTexts(locale);
    
    // Cabecera del mensaje
    let message = `🍕 *${texts.restaurantName}*\n\n`;
    message += `📋 *${texts.orderNumber}* #${orderNumber}\n`;
    message += `📞 *${texts.phone}* ${phone}\n`;
    message += `👤 *${texts.customer}* ${customer}\n`;

    // Información de dirección (solo para delivery)
    if (deliveryMode === 'delivery' && address) {
      const fullAddress = `${address.street}, ${address.postalCode} ${address.city}, Deutschland`;
      const googleMapsUrl = `https://maps.google.com/?q=${encodeURIComponent(fullAddress)}`;
      
      message += `\n📍 *${texts.deliveryAddress}*\n`;
      message += `${fullAddress}\n`;
      message += `🗺️ Google Maps: ${googleMapsUrl}\n`;
    }

    // Productos del pedido
    message += `\n🛒 *${texts.products}*\n`;
    cart.forEach((item: any) => {
      const productLine = `${item.quantity}× ${texts.productNumber} ${item.pizzaId} ${item.name}`;
      const sizeLine = item.size && item.size !== 'standard' ? ` (${item.size})` : '';
      const priceLine = ` - ${formatCurrency(item.totalPrice)}`;
      message += `${productLine}${sizeLine}${priceLine}\n`;
    });

    // Resumen de precios
    message += `\n💰 *${texts.summary}*\n`;
    message += `${texts.subtotal} ${formatCurrency(pricing.subtotal)}\n`;
    
    if (deliveryMode === 'delivery' && pricing.deliveryFee > 0) {
      message += `${texts.delivery} ${formatCurrency(pricing.deliveryFee)}\n`;
    }
    
    message += `*${texts.total} ${formatCurrency(pricing.total)}*\n`;

    // Información de tipo y pago
    const deliveryType = deliveryMode === 'delivery' ? texts.deliveryType : texts.collectionType;
    const paymentType = paymentMethod === 'cash' ? texts.paymentCash : texts.paymentCard;
    
    message += `\n🚀 *${texts.type}* ${deliveryType}\n`;
    message += `💳 *${texts.payment}* ${paymentType}\n`;

    // Instrucciones especiales
    if (specialInstructions?.trim()) {
      message += `\n📝 ${texts.specialInstructions} ${specialInstructions}\n`;
    }

    // Footer
    message += `\n---\n⏰ ${texts.processing}`;

    // Verificar longitud y truncar si es necesario
    if (message.length > this.MAX_MESSAGE_LENGTH) {
      message = this.truncateMessage(message);
    }

    return message;
  }

  /**
   * Genera la URL de WhatsApp optimizada por plataforma
   */
  private static generateWhatsAppUrl(message: string, platform: PlatformInfo): string {
    const encodedMessage = encodeURIComponent(message);
    const phoneNumber = this.RESTAURANT_PHONE.replace('+', '');

    if (platform.isMobile && platform.supportsDeepLink) {
      // URL para apps nativas móviles
      return `${this.MOBILE_WHATSAPP_URL}/${phoneNumber}?text=${encodedMessage}`;
    } else {
      // URL para WhatsApp Web (desktop o fallback)
      return `${this.WEB_WHATSAPP_URL}?phone=${phoneNumber}&text=${encodedMessage}`;
    }
  }

  /**
   * Intenta abrir WhatsApp con protocolo nativo
   */
  private static async tryNativeApp(url: string): Promise<boolean> {
    return new Promise((resolve) => {
      const platform = this.detectPlatform();
      
      if (!platform.supportsDeepLink) {
        resolve(false);
        return;
      }

      // Crear iframe invisible para intentar deep link
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = url;
      
      let resolved = false;
      const timeout = setTimeout(() => {
        if (!resolved) {
          resolved = true;
          document.body.removeChild(iframe);
          resolve(false);
        }
      }, 2000);

      iframe.onload = () => {
        if (!resolved) {
          resolved = true;
          clearTimeout(timeout);
          document.body.removeChild(iframe);
          resolve(true);
        }
      };

      document.body.appendChild(iframe);
    });
  }

  /**
   * Abre WhatsApp Web como fallback
   */
  private static async tryWebVersion(url: string): Promise<boolean> {
    try {
      const newWindow = window.open(url, '_blank');
      return !!newWindow;
    } catch (error) {
      console.error('Error opening WhatsApp Web:', error);
      return false;
    }
  }

  /**
   * Maneja fallbacks cuando WhatsApp no está disponible
   */
  private static handleFallback(orderData: OrderData): WhatsAppResult {
    const message = this.formatOrderMessage(orderData);
    
    // Copiar al portapapeles como fallback
    if (navigator.clipboard) {
      navigator.clipboard.writeText(message).catch(console.error);
    }

    return {
      success: false,
      method: 'fallback',
      message,
      alternativeActions: [
        {
          type: 'copy_clipboard',
          label: 'Mensaje copiado al portapapeles',
          action: () => navigator.clipboard?.writeText(message)
        },
        {
          type: 'phone_call',
          label: 'Llamar al restaurante',
          action: () => window.open(`tel:${this.RESTAURANT_PHONE}`)
        },
        {
          type: 'email',
          label: 'Enviar por email',
          action: () => window.open(`mailto:info@campus-pizza.de?subject=Pedido ${orderData.orderNumber}&body=${encodeURIComponent(message)}`)
        }
      ]
    };
  }

  /**
   * Maneja errores específicos
   */
  private static handleError(error: any, orderData: OrderData): WhatsAppResult {
    console.error('WhatsApp Service Error:', error);
    
    return {
      success: false,
      method: 'error',
      error: error.message,
      alternativeActions: this.handleFallback(orderData).alternativeActions
    };
  }

  /**
   * Método principal para enviar pedido
   */
  static async sendOrder(orderData: OrderData): Promise<WhatsAppResult> {
    try {
      const platform = this.detectPlatform();
      const message = this.formatOrderMessage(orderData);
      const url = this.generateWhatsAppUrl(message, platform);

      // Estrategia de envío por prioridad
      if (platform.preferredMethod === 'native') {
        if (await this.tryNativeApp(url)) {
          return { 
            success: true, 
            method: 'native',
            platform: platform.isIOS ? 'ios' : 'android'
          };
        }
      }

      // Fallback a web
      if (await this.tryWebVersion(url)) {
        return { 
          success: true, 
          method: 'web',
          platform: 'web'
        };
      }

      // Último recurso: fallback manual
      return this.handleFallback(orderData);

    } catch (error) {
      return this.handleError(error, orderData);
    }
  }

  /**
   * Valida que WhatsApp esté disponible
   */
  static async isWhatsAppAvailable(): Promise<boolean> {
    const platform = this.detectPlatform();
    
    if (platform.isMobile) {
      // En móvil, asumir que WhatsApp está disponible
      return true;
    } else {
      // En desktop, verificar acceso a WhatsApp Web
      try {
        const response = await fetch('https://web.whatsapp.com', { 
          mode: 'no-cors',
          cache: 'no-cache'
        });
        return true;
      } catch {
        return false;
      }
    }
  }

  /**
   * Obtiene textos localizados
   */
  private static getLocalizedTexts(locale: string) {
    const texts = {
      de: {
        restaurantName: 'Restaurant CAMPUS - Neue Bestellung',
        orderNumber: 'Bestellung',
        phone: 'Telefon:',
        customer: 'Kunde:',
        deliveryAddress: 'Lieferadresse:',
        products: 'Produkte:',
        productNumber: 'Nr.',
        summary: 'Zusammenfassung:',
        subtotal: 'Zwischensumme:',
        delivery: 'Lieferung:',
        total: 'Gesamt:',
        type: 'Typ:',
        payment: 'Zahlung:',
        deliveryType: 'Lieferung nach Hause',
        collectionType: 'Abholung im Geschäft',
        paymentCash: 'Bargeld',
        paymentCard: 'Karte',
        specialInstructions: 'Besondere Hinweise:',
        processing: 'Bestellung wird bearbeitet...'
      },
      en: {
        restaurantName: 'Restaurant CAMPUS - New Order',
        orderNumber: 'Order',
        phone: 'Phone:',
        customer: 'Customer:',
        deliveryAddress: 'Delivery Address:',
        products: 'Products:',
        productNumber: 'No.',
        summary: 'Summary:',
        subtotal: 'Subtotal:',
        delivery: 'Delivery:',
        total: 'Total:',
        type: 'Type:',
        payment: 'Payment:',
        deliveryType: 'Home delivery',
        collectionType: 'Store pickup',
        paymentCash: 'Cash',
        paymentCard: 'Card',
        specialInstructions: 'Special instructions:',
        processing: 'Processing order...'
      }
    };

    return texts[locale as keyof typeof texts] || texts.de;
  }

  /**
   * Trunca mensaje si excede límite de caracteres
   */
  private static truncateMessage(message: string): string {
    const maxLength = this.MAX_MESSAGE_LENGTH - 100; // Buffer para texto adicional
    
    if (message.length <= maxLength) {
      return message;
    }

    const truncated = message.substring(0, maxLength);
    const lastNewline = truncated.lastIndexOf('\n');
    
    return truncated.substring(0, lastNewline) + '\n\n[...Mensaje truncado por longitud...]';
  }
}

export default WhatsAppService;
```

---

## 2. 🎯 Modal de Confirmación

### `src/components/WhatsAppConfirmationModal.tsx`

```typescript
import React, { useState } from 'react';
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
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.479 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.867-2.031-.966-.272-.099-.47-.149-.669.149-.198.297-.768.966-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
              {t('whatsapp.confirmOrder', { default: 'Confirmar Pedido WhatsApp' })}
            </h2>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 transition-colors"
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
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              {t('checkout.orderSummary', { default: 'Resumen del Pedido' })}
            </h3>
            
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">
                  {t('checkout.orderNumber', { default: 'N° Pedido:' })}
                </span>
                <span className="font-medium">#{orderData.orderNumber}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">
                  {t('checkout.customer', { default: 'Cliente:' })}
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
              className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition-colors"
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
                ? t('whatsapp.hidePreview', { default: 'Ocultar vista previa' })
                : t('whatsapp.showPreview', { default: 'Ver vista previa del mensaje' })
              }
            </button>
            
            {showPreview && (
              <div className="mt-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="text-sm font-medium text-green-800 mb-2">
                  {t('whatsapp.messagePreview', { default: 'Mensaje que se enviará:' })}
                </h4>
                <pre className="text-sm text-green-700 whitespace-pre-wrap font-mono">
                  {whatsappMessage}
                </pre>
              </div>
            )}
          </div>

          {/* Important Notes */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">
                  {t('whatsapp.importantNote', { default: 'Importante:' })}
                </p>
                <ul className="space-y-1 text-blue-700">
                  <li>• {t('whatsapp.note1', { default: 'Se abrirá WhatsApp automáticamente' })}</li>
                  <li>• {t('whatsapp.note2', { default: 'Envía el mensaje tal como aparece' })}</li>
                  <li>• {t('whatsapp.note3', { default: 'El restaurante confirmará tu pedido' })}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex flex-col-reverse sm:flex-row gap-3">
            <button
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {t('common.cancel', { default: 'Cancelar' })}
            </button>
            
            <button
              onClick={onEdit}
              disabled={isLoading}
              className="flex-1 px-4 py-2 text-orange-700 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {t('common.edit', { default: 'Editar Pedido' })}
            </button>
            
            <button
              onClick={handleConfirm}
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {t('common.sending', { default: 'Enviando...' })}
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.479 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
                  </svg>
                  {t('whatsapp.sendOrder', { default: 'Enviar por WhatsApp' })}
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
```

---

## 3. 🔧 Hook Personalizado para WhatsApp

### `src/hooks/useWhatsAppIntegration.ts`

```typescript
import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import WhatsAppService from '../services/whatsappService';
import { OrderData, WhatsAppResult } from '../types/whatsapp';

interface UseWhatsAppIntegrationReturn {
  // Estados
  isModalOpen: boolean;
  isLoading: boolean;
  result: WhatsAppResult | null;
  error: string | null;
  
  // Acciones
  openConfirmation: () => void;
  closeConfirmation: () => void;
  sendOrder: (orderData: OrderData) => Promise<WhatsAppResult>;
  reset: () => void;
  
  // Utilidades
  isWhatsAppAvailable: () => Promise<boolean>;
  formatPreviewMessage: (orderData: OrderData) => string;
}

export function useWhatsAppIntegration(): UseWhatsAppIntegrationReturn {
  const { i18n } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<WhatsAppResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const openConfirmation = useCallback(() => {
    setIsModalOpen(true);
    setError(null);
    setResult(null);
  }, []);

  const closeConfirmation = useCallback(() => {
    setIsModalOpen(false);
    setError(null);
  }, []);

  const sendOrder = useCallback(async (orderData: OrderData): Promise<WhatsAppResult> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const whatsappResult = await WhatsAppService.sendOrder(orderData);
      setResult(whatsappResult);
      
      if (!whatsappResult.success) {
        setError(whatsappResult.error || 'Failed to send WhatsApp message');
      }
      
      return whatsappResult;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      
      const failureResult: WhatsAppResult = {
        success: false,
        method: 'error',
        error: errorMessage
      };
      setResult(failureResult);
      
      return failureResult;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setIsModalOpen(false);
    setIsLoading(false);
    setResult(null);
    setError(null);
  }, []);

  const isWhatsAppAvailable = useCallback(async (): Promise<boolean> => {
    try {
      return await WhatsAppService.isWhatsAppAvailable();
    } catch {
      return false;
    }
  }, []);

  const formatPreviewMessage = useCallback((orderData: OrderData): string => {
    return WhatsAppService.formatOrderMessage(orderData, i18n.language);
  }, [i18n.language]);

  return {
    // Estados
    isModalOpen,
    isLoading,
    result,
    error,
    
    // Acciones
    openConfirmation,
    closeConfirmation,
    sendOrder,
    reset,
    
    // Utilidades
    isWhatsAppAvailable,
    formatPreviewMessage
  };
}

export default useWhatsAppIntegration;
```

---

## 4. 📝 Tipos y Interfaces

### `src/types/whatsapp.ts`

```typescript
export interface OrderData {
  orderNumber: string;
  timestamp: string;
  customer: string;
  phone: string;
  deliveryMode: 'delivery' | 'collection';
  address?: {
    street: string;
    houseNumber: string;
    postalCode: string;
    city: string;
  };
  paymentMethod: 'cash' | 'card';
  specialInstructions?: string;
  cart: CartItem[];
  pricing: {
    subtotal: number;
    deliveryFee: number;
    serviceFee: number;
    total: number;
  };
}

export interface CartItem {
  pizzaId: string;
  name: string;
  quantity: number;
  size?: string;
  ingredients?: string[];
  totalPrice: number;
}

export interface WhatsAppResult {
  success: boolean;
  method: 'native' | 'web' | 'fallback' | 'error';
  platform?: 'ios' | 'android' | 'web';
  error?: string;
  message?: string;
  alternativeActions?: AlternativeAction[];
}

export interface AlternativeAction {
  type: 'copy_clipboard' | 'phone_call' | 'email' | 'sms';
  label: string;
  action: () => void;
  icon?: string;
}

export interface PlatformInfo {
  isMobile: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  isDesktop: boolean;
  supportsDeepLink: boolean;
  preferredMethod: 'native' | 'web';
}

export interface MessageTemplate {
  restaurantName: string;
  orderNumber: string;
  phone: string;
  customer: string;
  deliveryAddress: string;
  products: string;
  summary: string;
  subtotal: string;
  delivery: string;
  total: string;
  type: string;
  payment: string;
  deliveryType: string;
  collectionType: string;
  paymentCash: string;
  paymentCard: string;
  specialInstructions: string;
  processing: string;
}

export interface WhatsAppConfig {
  restaurantPhone: string;
  messageTemplates: Record<string, MessageTemplate>;
  maxMessageLength: number;
  fallbackMethods: {
    copyToClipboard: boolean;
    phoneCall: boolean;
    email: boolean;
    sms: boolean;
  };
}
```

---

## 5. 🎯 Componente de Resultado

### `src/components/WhatsAppResultModal.tsx`

```typescript
import React from 'react';
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
```

---

## 6. 🔧 Integración en CheckoutForm

### Modificaciones sugeridas para `CheckoutForm.tsx`

```typescript
// Importaciones adicionales
import { useWhatsAppIntegration } from '../../hooks/useWhatsAppIntegration';
import WhatsAppConfirmationModal from '../../components/WhatsAppConfirmationModal';
import WhatsAppResultModal from '../../components/WhatsAppResultModal';

// Dentro del componente CheckoutForm
function CheckoutForm() {
  // ... existing code ...
  
  // WhatsApp integration hook
  const {
    isModalOpen,
    isLoading: isWhatsAppLoading,
    result: whatsAppResult,
    openConfirmation,
    closeConfirmation,
    sendOrder: sendWhatsAppOrder,
    reset: resetWhatsApp
  } = useWhatsAppIntegration();

  // Estado para resultado modal
  const [showResultModal, setShowResultModal] = useState(false);

  // Modificar handleSubmit para usar el nuevo flujo
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    // Preparar datos del pedido
    const orderData = {
      orderNumber: generateOrderNumber(),
      timestamp: new Date().toISOString(),
      customer: formData.customer,
      phone: formData.phone,
      deliveryMode,
      address: deliveryMode === 'delivery' ? {
        street: formData.address || '',
        houseNumber: '',
        postalCode: formData.postalCode || '',
        city: formData.city || 'Dortmund'
      } : undefined,
      paymentMethod: formData.paymentMethod,
      specialInstructions: formData.specialInstructions,
      cart: cart,
      pricing: {
        subtotal,
        deliveryFee,
        serviceFee: 0,
        total
      }
    };

    // Guardar en cache primero
    saveOrder(orderData);
    
    // Abrir modal de confirmación en lugar de enviar directamente
    openConfirmation();
  };

  // Manejar confirmación de WhatsApp
  const handleWhatsAppConfirm = async (result: WhatsAppResult) => {
    closeConfirmation();
    
    if (result.success) {
      // Limpiar carrito y navegar a confirmación
      dispatch(clearCart());
      navigate('/order-confirmation', { 
        state: { 
          orderNumber: generateOrderNumber(),
          deliveryMode,
          estimatedTime: deliveryMode === 'delivery' ? '30-45 min' : '15-20 min'
        },
        replace: true
      });
    } else {
      // Mostrar modal de resultado con opciones alternativas
      setShowResultModal(true);
    }
  };

  // ... existing JSX with modifications to submit button ...

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ... existing content ... */}
      
      {/* Modificar el botón de submit */}
      <button
        type="submit"
        disabled={isSubmitting || !meetsMinimum || isWhatsAppLoading}
        className={`w-full font-semibold py-4 px-6 rounded-full transition-all duration-200 transform ${
          meetsMinimum && !isSubmitting && !isWhatsAppLoading
            ? 'bg-orange-500 hover:bg-orange-600 text-white hover:scale-[1.02]'
            : 'bg-gray-400 text-white cursor-not-allowed'
        }`}
      >
        {isSubmitting || isWhatsAppLoading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
            {t('common.processing', { default: 'Processing...' })}
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.479 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654z"/>
            </svg>
            {t('checkout.placeOrder', { default: 'Confirmar Pedido WhatsApp' })}
          </div>
        )}
      </button>

      {/* Modales de WhatsApp */}
      <WhatsAppConfirmationModal
        orderData={/* orden actual */}
        isOpen={isModalOpen}
        onConfirm={handleWhatsAppConfirm}
        onCancel={closeConfirmation}
        onEdit={() => {
          closeConfirmation();
          // Opcionalmente scroll a la sección que quiera editar
        }}
      />

      <WhatsAppResultModal
        result={whatsAppResult}
        isOpen={showResultModal}
        onClose={() => {
          setShowResultModal(false);
          resetWhatsApp();
        }}
        onRetry={() => {
          setShowResultModal(false);
          openConfirmation();
        }}
      />
    </div>
  );
}
```

---

## 🎯 Resumen de Beneficios

### **Mejoras Implementadas:**
1. ✅ **Servicio WhatsApp modular y robusto**
2. ✅ **Modal de confirmación con vista previa**
3. ✅ **Sistema de fallbacks automáticos**
4. ✅ **Detección de plataforma inteligente**
5. ✅ **Manejo de errores específicos**
6. ✅ **Hook personalizado reutilizable**
7. ✅ **Tipos TypeScript completos**

### **Impacto en UX:**
- 🎯 Confianza del usuario aumentada
- 🎯 Transparencia total del proceso
- 🎯 Opciones de recuperación robustas
- 🎯 Experiencia más profesional

### **Mantenibilidad:**
- 🔧 Código modular y reutilizable
- 🔧 Fácil testing individual de componentes
- 🔧 Escalabilidad para futuras mejoras
- 🔧 Documentación integrada

Esta implementación proporciona una base sólida para una integración WhatsApp de nivel profesional que puede manejar múltiples escenarios y proporcionar una experiencia excepcional al usuario.
