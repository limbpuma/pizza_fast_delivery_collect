import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCookieConsent } from '../hooks/useCookieConsent';
import Button from './Button';
import Modal from './Modal';

interface CookieBannerProps {
  className?: string;
}

/**
 * TTDSG § 25 compliant cookie banner for Restaurant CAMPUS
 * Lightweight design optimized for mobile pizza ordering
 */
const CookieBanner: React.FC<CookieBannerProps> = ({ className = '' }) => {
  const { i18n } = useTranslation();
  const { 
    showBanner, 
    acceptAll, 
    acceptEssential, 
    setPreferences 
  } = useCookieConsent();
  
  const [showPreferences, setShowPreferences] = useState(false);
  const [functionalEnabled, setFunctionalEnabled] = useState(true);

  if (!showBanner) return null;

  const handleCustomize = () => {
    setShowPreferences(true);
  };

  const handleSavePreferences = () => {
    setPreferences({
      functional: functionalEnabled
    });
    setShowPreferences(false);
  };

  // Hardcoded translations for now until we fix the JSON structure
  const translations = {
    de: {
      banner: {
        title: "🍪 Diese Website speichert Daten lokal",
        message: "Wir verwenden lokale Speicherung für Warenkorb und Einstellungen. Essentielle Speicherung ist für Grundfunktionen erforderlich, funktionale Speicherung verbessert Ihre Erfahrung.",
        acceptAll: "Alle akzeptieren",
        acceptEssential: "Nur essenzielle",
        customize: "Einstellungen anpassen",
        policyLink: "Mehr in unserer Datenschutzerklärung"
      },
      preferences: {
        title: "Cookie-Einstellungen",
        description: "Wählen Sie, welche Kategorien von Cookies Sie zulassen möchten:",
        essential: {
          title: "Essentielle Cookies",
          description: "Erforderlich für Grundfunktionen wie Warenkorb, Session-Verwaltung und Spracheinstellungen. Diese können nicht deaktiviert werden.",
          items: "Warenkorb-Status, Session-Sicherheit, Spracherkennung"
        },
        functional: {
          title: "Funktionale Cookies",
          description: "Verbessern Ihre Benutzererfahrung durch Speicherung von Bestellhistorie und Benutzerpräferenzen (7-30 Tage).",
          items: "Bestellhistorie, Warenkorb-Persistierung, Lieferpräferenzen"
        },
        save: "Einstellungen speichern",
        cancel: "Abbrechen"
      },
      common: {
        required: "Erforderlich",
        enabled: "Aktiviert",
        disabled: "Deaktiviert"
      }
    },
    en: {
      banner: {
        title: "🍪 This website stores data locally",
        message: "We use local storage for shopping cart and settings. Essential storage is required for basic functions, functional storage improves your experience.",
        acceptAll: "Accept All",
        acceptEssential: "Essential Only",
        customize: "Customize Settings",
        policyLink: "More in our Privacy Policy"
      },
      preferences: {
        title: "Cookie Settings",
        description: "Choose which categories of cookies you want to allow:",
        essential: {
          title: "Essential Cookies",
          description: "Required for basic functions like shopping cart, session management, and language settings. These cannot be disabled.",
          items: "Shopping cart status, session security, language detection"
        },
        functional: {
          title: "Functional Cookies",
          description: "Improve your user experience by storing order history and user preferences (7-30 days).",
          items: "Order history, cart persistence, delivery preferences"
        },
        save: "Save Settings",
        cancel: "Cancel"
      },
      common: {
        required: "Required",
        enabled: "Enabled",
        disabled: "Disabled"
      }
    }
  };

  const currentLang = i18n.language === 'de' ? 'de' : 'en';
  const ct = translations[currentLang];

  const PreferencesModal = () => (
    <Modal 
      isOpen={showPreferences} 
      onClose={() => setShowPreferences(false)}
      title={ct.preferences.title}
    >
      <div className="space-y-6">
        <p className="text-gray-600 text-sm">
          {ct.preferences.description}
        </p>

        {/* Essential Cookies - Always enabled */}
        <div className="border border-gray-200 rounded-lg p-4 bg-green-50">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-green-800">
              {ct.preferences.essential.title}
            </h3>
            <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded">
              {ct.common.required}
            </span>
          </div>
          <p className="text-sm text-green-700 mb-2">
            {ct.preferences.essential.description}
          </p>
          <p className="text-xs text-green-600">
            <strong>Items:</strong> {ct.preferences.essential.items}
          </p>
        </div>

        {/* Functional Cookies - User choice */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-gray-800">
              {ct.preferences.functional.title}
            </h3>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={functionalEnabled}
                onChange={(e) => setFunctionalEnabled(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-600">
                {functionalEnabled ? ct.common.enabled : ct.common.disabled}
              </span>
            </label>
          </div>
          <p className="text-sm text-gray-600 mb-2">
            {ct.preferences.functional.description}
          </p>
          <p className="text-xs text-gray-500">
            <strong>Items:</strong> {ct.preferences.functional.items}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            type="primary"
            onClick={handleSavePreferences}
          >
            {ct.preferences.save}
          </Button>
          <Button
            type="secondary"
            onClick={() => setShowPreferences(false)}
          >
            {ct.preferences.cancel}
          </Button>
        </div>
      </div>
    </Modal>
  );

  return (
    <>
      {/* Cookie Banner */}
      <div className={`fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg ${className}`}>
        <div className="max-w-7xl mx-auto p-4">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            {/* Banner content */}
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 mb-2 text-sm lg:text-base">
                {ct.banner.title}
              </h3>
              <p className="text-gray-600 text-xs lg:text-sm leading-relaxed">
                {ct.banner.message}
                {' '}
                <a 
                  href={`/legal/datenschutz.${currentLang}.md`}
                  className="text-blue-600 hover:text-blue-800 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {ct.banner.policyLink}
                </a>
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-2 lg:gap-3 min-w-0 lg:min-w-max">
              <Button
                type="primary"
                onClick={acceptAll}
              >
                {ct.banner.acceptAll}
              </Button>
              <Button
                type="secondary"
                onClick={acceptEssential}
              >
                {ct.banner.acceptEssential}
              </Button>
              <Button
                type="small"
                onClick={handleCustomize}
              >
                {ct.banner.customize}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Preferences Modal */}
      <PreferencesModal />
    </>
  );
};

export default CookieBanner;
