import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white text-lg font-bold">🍕</span>
              </div>
              <span className="text-xl font-bold text-white">
                {t('header.title')}
              </span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
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
            <h3 className="text-lg font-semibold mb-4 text-orange-400">
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
            <h3 className="text-lg font-semibold mb-4 text-orange-400">
              {t('footer.quickLinks', { default: 'Quick Links' })}
            </h3>            <div className="space-y-2 text-sm">
              <Link 
                to="/datenschutz" 
                className="text-gray-300 hover:text-orange-400 transition-colors duration-200 block"
              >
                {t('footer.privacy', { default: 'Datenschutz' })}
              </Link>
              <Link 
                to="/agb" 
                className="text-gray-300 hover:text-orange-400 transition-colors duration-200 block"
              >
                {t('footer.terms', { default: 'AGB' })}
              </Link>
              <Link 
                to="/impressum" 
                className="text-gray-300 hover:text-orange-400 transition-colors duration-200 block"
              >
                {t('footer.imprint', { default: 'Impressum' })}
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">
              © 2025 Campus Pizza. {t('footer.allRights', { default: 'All rights reserved.' })}
            </p>            <div className="flex space-x-6 mt-4 md:mt-0">
              <button 
                onClick={() => console.log('Facebook clicked')}
                className="text-gray-400 hover:text-orange-400 transition-colors duration-200"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </button>
              <button 
                onClick={() => console.log('Instagram clicked')}
                className="text-gray-400 hover:text-orange-400 transition-colors duration-200"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.73-3.016-1.8-.568-1.07-.568-2.39 0-3.46.568-1.07 1.719-1.8 3.016-1.8s2.448.73 3.016 1.8c.568 1.07.568 2.39 0 3.46-.568 1.07-1.719 1.8-3.016 1.8z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
