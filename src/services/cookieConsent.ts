import { 
  CookieConsent, 
  CookieCategory, 
  COOKIE_CATEGORIES, 
  CONSENT_VERSION, 
  CONSENT_STORAGE_KEY 
} from '../types/cookies';

/**
 * Cookie Consent Service - TTDSG § 25 Compliant
 * Manages cookie consent for German legal requirements
 */
class CookieConsentService {
  private consent: CookieConsent | null = null;
  private listeners: Array<(consent: CookieConsent | null) => void> = [];

  constructor() {
    this.loadConsent();
  }

  /**
   * Load existing consent from localStorage
   */
  private loadConsent(): void {
    try {
      const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Validate consent version
        if (parsed.version === CONSENT_VERSION) {
          this.consent = {
            ...parsed,
            timestamp: new Date(parsed.timestamp)
          };
        } else {
          // Clear outdated consent
          this.clearConsent();
        }
      }
    } catch (error) {
      console.warn('Failed to load cookie consent:', error);
      this.clearConsent();
    }
  }

  /**
   * Save consent to localStorage
   */
  private saveConsent(): void {
    if (this.consent) {
      try {
        localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(this.consent));
        this.notifyListeners();
      } catch (error) {
        console.error('Failed to save cookie consent:', error);
      }
    }
  }

  /**
   * Check if user has given consent
   */
  hasConsent(): boolean {
    return this.consent !== null;
  }

  /**
   * Check if specific category is allowed
   */
  isCategoryAllowed(category: string): boolean {
    if (!this.consent) return false;
    if (category === 'essential') return true; // Always allowed
    return this.consent.categories[category] === true;
  }

  /**
   * Accept all categories
   */
  acceptAll(): void {
    this.consent = {
      timestamp: new Date(),
      version: CONSENT_VERSION,
      categories: {
        essential: true,
        functional: true
      },
      userAgent: navigator.userAgent,
      language: navigator.language
    };
    this.saveConsent();
  }

  /**
   * Accept only essential cookies
   */
  acceptEssential(): void {
    this.consent = {
      timestamp: new Date(),
      version: CONSENT_VERSION,
      categories: {
        essential: true,
        functional: false
      },
      userAgent: navigator.userAgent,
      language: navigator.language
    };
    this.saveConsent();
  }

  /**
   * Set custom preferences
   */
  setPreferences(categories: Record<string, boolean>): void {
    this.consent = {
      timestamp: new Date(),
      version: CONSENT_VERSION,
      categories: {
        essential: true, // Always true
        ...categories
      },
      userAgent: navigator.userAgent,
      language: navigator.language
    };
    this.saveConsent();
  }

  /**
   * Get current consent
   */
  getConsent(): CookieConsent | null {
    return this.consent;
  }

  /**
   * Clear all consent (user withdrawal)
   */
  clearConsent(): void {
    this.consent = null;
    try {
      localStorage.removeItem(CONSENT_STORAGE_KEY);
      this.notifyListeners();
    } catch (error) {
      console.error('Failed to clear cookie consent:', error);
    }
  }

  /**
   * Get allowed categories with metadata
   */
  getAllowedCategories(): CookieCategory[] {
    const categories: CookieCategory[] = [];
    
    Object.values(COOKIE_CATEGORIES).forEach(category => {
      categories.push({
        ...category,
        enabled: this.isCategoryAllowed(category.id)
      });
    });

    return categories;
  }

  /**
   * Clean up non-essential localStorage items if not consented
   */
  cleanupStorage(): void {
    if (!this.isCategoryAllowed('functional')) {
      // Remove functional cookies if not consented
      const functionalKeys = COOKIE_CATEGORIES.functional.items;
      functionalKeys.forEach(key => {
        try {
          localStorage.removeItem(key);
        } catch (error) {
          console.warn(`Failed to remove ${key}:`, error);
        }
      });
    }
  }

  /**
   * Subscribe to consent changes
   */
  subscribe(listener: (consent: CookieConsent | null) => void): () => void {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  /**
   * Notify all listeners of consent changes
   */
  private notifyListeners(): void {
    this.listeners.forEach(listener => {
      try {
        listener(this.consent);
      } catch (error) {
        console.error('Error in consent listener:', error);
      }
    });
  }

  /**
   * Check if consent needs renewal (older than 13 months - GDPR requirement)
   */
  needsRenewal(): boolean {
    if (!this.consent) return true;
    
    const thirteenMonthsAgo = new Date();
    thirteenMonthsAgo.setMonth(thirteenMonthsAgo.getMonth() - 13);
    
    return this.consent.timestamp < thirteenMonthsAgo;
  }
}

// Export singleton instance
export const cookieConsentService = new CookieConsentService();
export default cookieConsentService;
