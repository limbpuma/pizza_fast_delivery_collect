import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CookieConsent } from '../types/cookies';
import cookieConsentService from '../services/cookieConsent';

interface CookieConsentContextValue {
  hasConsent: boolean;
  showBanner: boolean;
  consent: CookieConsent | null;
  acceptAll: () => void;
  acceptEssential: () => void;
  setPreferences: (categories: Record<string, boolean>) => void;
  clearConsent: () => void;
  isCategoryAllowed: (category: string) => boolean;
  showBannerManually: () => void;
  updateCount: number;
}

const CookieConsentContext = createContext<CookieConsentContextValue | undefined>(undefined);

interface CookieConsentProviderProps {
  children: ReactNode;
}

export const CookieConsentProvider: React.FC<CookieConsentProviderProps> = ({ children }) => {
  const [hasConsent, setHasConsent] = useState(cookieConsentService.hasConsent());
  const [showBanner, setShowBanner] = useState(!cookieConsentService.hasConsent() || cookieConsentService.needsRenewal());
  const [consent, setConsent] = useState(cookieConsentService.getConsent());
  const [updateCount, setUpdateCount] = useState(0);

  useEffect(() => {
    // Subscribe to consent changes
    const unsubscribe = cookieConsentService.subscribe((newConsent) => {
      setConsent(newConsent);
      setHasConsent(newConsent !== null);
      // Auto-hide banner only when consent is actually given
      if (newConsent !== null && !cookieConsentService.needsRenewal()) {
        setShowBanner(false);
        setUpdateCount(prev => prev + 1);
      }
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
    setUpdateCount(prev => prev + 1);
  };

  const value: CookieConsentContextValue = {
    hasConsent,
    showBanner,
    consent,
    acceptAll,
    acceptEssential,
    setPreferences,
    clearConsent,
    isCategoryAllowed,
    showBannerManually,
    updateCount
  };

  return (
    <CookieConsentContext.Provider value={value}>
      {children}
    </CookieConsentContext.Provider>
  );
};

export const useCookieConsent = (): CookieConsentContextValue => {
  const context = useContext(CookieConsentContext);
  if (context === undefined) {
    throw new Error('useCookieConsent must be used within a CookieConsentProvider');
  }
  return context;
};
