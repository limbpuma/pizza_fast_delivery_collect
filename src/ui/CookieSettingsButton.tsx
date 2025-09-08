import React from 'react';
import { useTranslation } from 'react-i18next';
import { useCookieConsent } from '../contexts/CookieConsentContext';

interface CookieSettingsButtonProps {
  className?: string;
}

/**
 * Small button to reopen cookie settings
 * Required by TTDSG § 25 for easy consent withdrawal
 */
const CookieSettingsButton: React.FC<CookieSettingsButtonProps> = ({ className = '' }) => {
  const { i18n } = useTranslation();
  const { showBannerManually } = useCookieConsent();

  // Hardcoded translations matching CookieBanner
  const translations = {
    de: {
      buttonText: "Cookie-Einstellungen"
    },
    en: {
      buttonText: "Cookie Settings"
    }
  };

  const currentLang = i18n.language === 'de' ? 'de' : 'en';
  const ct = translations[currentLang];

  return (
    <button
      onClick={showBannerManually}
      className={`text-gray-300 hover:text-orange-400 transition-colors duration-200 text-sm ${className}`}
      type="button"
    >
      🍪 {ct.buttonText}
    </button>
  );
};

export default CookieSettingsButton;
