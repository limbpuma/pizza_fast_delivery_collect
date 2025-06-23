import { useState, useEffect } from 'react';
import { CookieConsent } from '../types/cookies';
import cookieConsentService from '../services/cookieConsent';

interface UseCookieConsentReturn {
  hasConsent: boolean;
  showBanner: boolean;
  consent: CookieConsent | null;
  acceptAll: () => void;
  acceptEssential: () => void;
  setPreferences: (categories: Record<string, boolean>) => void;
  clearConsent: () => void;
  isCategoryAllowed: (category: string) => boolean;
  showBannerManually: () => void;
}

/**
 * React hook for cookie consent management
 * Provides reactive access to cookie consent state
 */
export const useCookieConsent = (): UseCookieConsentReturn => {
  const [hasConsent, setHasConsent] = useState(cookieConsentService.hasConsent());
  const [showBanner, setShowBanner] = useState(!cookieConsentService.hasConsent() || cookieConsentService.needsRenewal());
  const [consent, setConsent] = useState(cookieConsentService.getConsent());

  useEffect(() => {
    // Subscribe to consent changes
    const unsubscribe = cookieConsentService.subscribe((newConsent) => {
      setConsent(newConsent);
      setHasConsent(newConsent !== null);
      setShowBanner(newConsent === null || cookieConsentService.needsRenewal());
    });

    // Initial state check
    setHasConsent(cookieConsentService.hasConsent());
    setShowBanner(!cookieConsentService.hasConsent() || cookieConsentService.needsRenewal());

    return unsubscribe;
  }, []);

  const acceptAll = () => {
    cookieConsentService.acceptAll();
    setShowBanner(false);
  };

  const acceptEssential = () => {
    cookieConsentService.acceptEssential();
    cookieConsentService.cleanupStorage(); // Remove functional storage
    setShowBanner(false);
  };

  const setPreferences = (categories: Record<string, boolean>) => {
    cookieConsentService.setPreferences(categories);
    if (!categories.functional) {
      cookieConsentService.cleanupStorage();
    }
    setShowBanner(false);
  };

  const clearConsent = () => {
    cookieConsentService.clearConsent();
    cookieConsentService.cleanupStorage();
    setShowBanner(true);
  };

  const isCategoryAllowed = (category: string) => {
    return cookieConsentService.isCategoryAllowed(category);
  };

  const showBannerManually = () => {
    setShowBanner(true);
  };

  return {
    hasConsent,
    showBanner,
    consent,
    acceptAll,
    acceptEssential,
    setPreferences,
    clearConsent,
    isCategoryAllowed,
    showBannerManually
  };
};
