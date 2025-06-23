// Cookie consent management types for TTDSG § 25 compliance

export interface CookieCategory {
  id: 'essential' | 'functional';
  name: string;
  description: string;
  required: boolean;
  items: string[];
  enabled: boolean;
}

export interface CookieConsent {
  timestamp: Date;
  version: string;
  categories: Record<string, boolean>;
  userAgent: string;
  language: string;
}

export interface CookieBannerState {
  hasConsent: boolean;
  showBanner: boolean;
  showPreferences: boolean;
  consent: CookieConsent | null;
}

export const COOKIE_CATEGORIES: Record<string, Omit<CookieCategory, 'enabled'>> = {
  essential: {
    id: 'essential',
    name: 'Essential Cookies',
    description: 'Required for basic website functionality',
    required: true,
    items: [
      'campus_pizza_session',
      'campus_pizza_cart_essential',
      'i18next_language'
    ]
  },
  functional: {
    id: 'functional',
    name: 'Functional Cookies',
    description: 'Improve user experience and convenience',
    required: false,
    items: [
      'campus_pizza_cart_v2',
      'campusPizzaOrders',
      'campus_pizza_preferences',
      'campus_pizza_language_override'
    ]
  }
} as const;

export const CONSENT_VERSION = '1.0.0';
export const CONSENT_STORAGE_KEY = 'campus_pizza_cookie_consent';
