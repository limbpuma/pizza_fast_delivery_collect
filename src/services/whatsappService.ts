import { OrderData, WhatsAppResult, PlatformInfo } from '../types/whatsapp';
import { formatCurrency } from '../utils/helpers';

export class WhatsAppService {
  private static readonly RESTAURANT_PHONE = '+4915906684411';
  private static readonly MAX_MESSAGE_LENGTH = 4096; // Límite de WhatsApp
  private static readonly WEB_WHATSAPP_URL = 'https://web.whatsapp.com/send';
  private static readonly MOBILE_WHATSAPP_URL = 'https://wa.me';
  private static readonly ANDROID_INTENT_URL = 'intent://send?phone={phone}&text={text}#Intent;scheme=whatsapp;package=com.whatsapp;end';

  /**
   * Detecta la plataforma y capacidades del dispositivo
   */
  private static detectPlatform(): PlatformInfo {
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobile = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(userAgent);
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    const isAndroid = /android/.test(userAgent);
    const isSafari = /safari/.test(userAgent) && !/chrome/.test(userAgent);
    const isChrome = /chrome/.test(userAgent);
    
    return {
      isMobile,
      isIOS,
      isAndroid,
      isDesktop: !isMobile,
      supportsDeepLink: isMobile,
      preferredMethod: isMobile ? 'native' : 'web',
      isSafari,
      isChrome
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
      if (platform.isIOS) {
        // iOS prefiere el esquema whatsapp:// para mejor compatibilidad
        return `whatsapp://send?phone=${phoneNumber}&text=${encodedMessage}`;
      } else if (platform.isAndroid) {
        // Android: intentar primero con wa.me, el intent como fallback se manejará en sendOrder
        return `${this.MOBILE_WHATSAPP_URL}/${phoneNumber}?text=${encodedMessage}`;
      } else {
        // Otros móviles
        return `${this.MOBILE_WHATSAPP_URL}/${phoneNumber}?text=${encodedMessage}`;
      }
    } else {
      // URL para WhatsApp Web (desktop o fallback)
      return `${this.WEB_WHATSAPP_URL}?phone=${phoneNumber}&text=${encodedMessage}`;
    }
  }

  /**
   * Genera URL de Android Intent como fallback adicional
   */
  private static generateAndroidIntentUrl(message: string): string {
    const encodedMessage = encodeURIComponent(message);
    const phoneNumber = this.RESTAURANT_PHONE.replace('+', '');
    return this.ANDROID_INTENT_URL
      .replace('{phone}', phoneNumber)
      .replace('{text}', encodedMessage);
  }

  /**
   * Intenta abrir WhatsApp con protocolo nativo (mejorado para mobile)
   */
  private static async tryNativeApp(url: string): Promise<boolean> {
    return new Promise((resolve) => {
      const platform = this.detectPlatform();
      
      if (!platform.supportsDeepLink) {
        resolve(false);
        return;
      }

      // Para mobile, usar window.location.href es más confiable que iframe
      if (platform.isMobile) {
        try {
          // Detectar si la página pierde foco (indica que la app se abrió)
          let hasBlurred = false;
          
          const blurHandler = () => {
            hasBlurred = true;
            document.removeEventListener('visibilitychange', visibilityHandler);
            window.removeEventListener('blur', blurHandler);
            resolve(true);
          };
          
          const visibilityHandler = () => {
            if (document.hidden) {
              hasBlurred = true;
              document.removeEventListener('visibilitychange', visibilityHandler);
              window.removeEventListener('blur', blurHandler);
              resolve(true);
            }
          };
          
          // Escuchar eventos de cambio de foco
          window.addEventListener('blur', blurHandler);
          document.addEventListener('visibilitychange', visibilityHandler);
          
          // Timeout más largo para mobile
          setTimeout(() => {
            window.removeEventListener('blur', blurHandler);
            document.removeEventListener('visibilitychange', visibilityHandler);
            resolve(hasBlurred);
          }, 3000);
          
          // Intentar abrir la app directamente
          window.location.href = url;
          
        } catch (error) {
          console.log('Error opening native app:', error);
          resolve(false);
        }
      } else {
        // Fallback al método iframe para desktop (aunque no se usará mucho)
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
      }
    });
  }

  /**
   * Abre WhatsApp Web como fallback (mejorado)
   */
  private static async tryWebVersion(url: string): Promise<boolean> {
    try {
      console.log('🌐 Opening WhatsApp Web/wa.me:', url);
      const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
      
      if (newWindow) {
        // Para mobile, cerrar la ventana original después de un delay
        // para evitar que se quede abierta
        const platform = this.detectPlatform();
        if (platform.isMobile) {
          setTimeout(() => {
            try {
              newWindow.close();
            } catch (e) {
              // Ignorar errores de cierre
            }
          }, 1000);
        }
        return true;
      }
      
      return false;
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
   * Método principal para enviar pedido (mejorado para mobile)
   */
  static async sendOrder(orderData: OrderData): Promise<WhatsAppResult> {
    try {
      const platform = this.detectPlatform();
      const message = this.formatOrderMessage(orderData);
      console.log('🔍 Platform detected:', platform);
      
      // Para móviles, intentar app nativa primero
      if (platform.preferredMethod === 'native') {
        const nativeUrl = this.generateWhatsAppUrl(message, platform);
        console.log('📱 Trying native app with URL:', nativeUrl);
        
        if (await this.tryNativeApp(nativeUrl)) {
          console.log('✅ Native app opened successfully');
          return { 
            success: true, 
            method: 'native',
            platform: platform.isIOS ? 'ios' : 'android'
          };
        }
        
        console.log('❌ Native app failed, trying web fallback');
        
        // Si falla la app nativa, intentar wa.me en nueva ventana
        const webUrl = `${this.MOBILE_WHATSAPP_URL}/${this.RESTAURANT_PHONE.replace('+', '')}?text=${encodeURIComponent(message)}`;
        console.log('🌐 Trying web fallback with URL:', webUrl);
        
        if (await this.tryWebVersion(webUrl)) {
          console.log('✅ Web version opened successfully');
          return { 
            success: true, 
            method: 'web',
            platform: 'web'
          };
        }
        
        // Para Android, intentar con Intent URL como último recurso nativo
        if (platform.isAndroid) {
          console.log('🤖 Trying Android Intent URL');
          const intentUrl = this.generateAndroidIntentUrl(message);
          if (await this.tryWebVersion(intentUrl)) {
            console.log('✅ Android Intent opened successfully');
            return { 
              success: true, 
              method: 'native',
              platform: 'android-intent'
            };
          }
        }
      } else {
        // Para desktop, usar WhatsApp Web directamente
        const url = this.generateWhatsAppUrl(message, platform);
        console.log('💻 Trying desktop WhatsApp Web:', url);
        
        if (await this.tryWebVersion(url)) {
          console.log('✅ WhatsApp Web opened successfully');
          return { 
            success: true, 
            method: 'web',
            platform: 'web'
          };
        }
      }

      // Último recurso: fallback manual
      console.log('🆘 All methods failed, using fallback');
      return this.handleFallback(orderData);

    } catch (error) {
      console.error('💥 WhatsApp Service Error:', error);
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
        await fetch('https://web.whatsapp.com', { 
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