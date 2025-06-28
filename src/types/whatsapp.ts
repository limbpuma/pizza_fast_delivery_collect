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
