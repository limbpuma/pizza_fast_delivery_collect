import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useCookieConsent } from '../hooks/useCookieConsent';

function Footer() {
  const { t, i18n } = useTranslation();
  const { showBannerManually } = useCookieConsent();

  const handleCookieSettings = () => {
    showBannerManually();
  };

  return (
    <footer className="mt-auto text-white bg-gray-900">
      <div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center mb-4 space-x-2">
              <div className="flex items-center justify-center w-8 h-8 bg-orange-500 rounded-full">
                <span className="text-lg font-bold text-white">🍕</span>
              </div>
              <span className="text-xl font-bold text-white">
                {t('header.title')}
              </span>
            </div>
            <p className="max-w-md mb-4 text-gray-300">
              {t('footer.description', { 
                default: 'Authentic Italian pizza delivered fresh to your door. Made with the finest ingredients and traditional recipes.' 
              })}
            </p>
            <div className="text-sm text-gray-400">
              <p>{t('footer.serviceArea', { default: 'Delivery service in Dortmund and surrounding areas' })}</p>
              <p className="mt-1">{t('footer.deliveryTime', { default: 'Average delivery time: 25-35 minutes' })}</p>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-orange-400">
              {t('footer.contact', { default: 'Contact' })}
            </h3>
            <div className="space-y-2 text-sm text-gray-300">
              <p>{t('footer.phone', { default: 'Phone: +49 231 123 456' })}</p>
              <p>{t('footer.email', { default: 'Email: info@campuspizza.de' })}</p>
              <p>{t('footer.address', { default: 'Address: Campus Street 123, 44227 Dortmund' })}</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-orange-400">
              {t('footer.quickLinks', { default: 'Quick Links' })}
            </h3>            <div className="space-y-2 text-sm">
              <Link 
                to="/datenschutz" 
                className="block text-gray-300 transition-colors duration-200 hover:text-orange-400"
              >
                {t('footer.privacy', { default: 'Datenschutz' })}
              </Link>
              <Link 
                to="/agb" 
                className="block text-gray-300 transition-colors duration-200 hover:text-orange-400"
              >
                {t('footer.terms', { default: 'AGB' })}
              </Link>              <Link 
                to="/impressum" 
                className="block text-gray-300 transition-colors duration-200 hover:text-orange-400"
              >
                {t('footer.imprint', { default: 'Impressum' })}              </Link>
              <button
                onClick={handleCookieSettings}
                className="block text-sm text-gray-300 transition-colors duration-200 hover:text-orange-400"
                type="button"
              >
                🍪 {i18n.language === 'de' ? 'Cookie-Einstellungen' : 'Cookie Settings'}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-8 border-t border-gray-800">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <p className="text-sm text-gray-400">
              © 2025 Campus Pizza. {t('footer.allRights', { default: 'All rights reserved.' })}
            </p>            <div className="flex mt-4 space-x-6 md:mt-0">
              {/* Social media buttons can be added here in the future */}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
