import { useTranslation } from 'react-i18next';

function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-100 border-t border-gray-200 py-6 mt-auto">
      <div className="max-w-6xl mx-auto px-4">
        {/* Legal Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <a 
            href="/privacy" 
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            {t('footer.privacy', { default: 'Privacy Policy' })}
          </a>
          <a 
            href="/terms" 
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            {t('footer.terms', { default: 'Terms & Conditions' })}
          </a>
          <a 
            href="/imprint" 
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            {t('footer.imprint', { default: 'Imprint' })}
          </a>
          <a 
            href="/cookies" 
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            {t('footer.cookies', { default: 'Cookie Settings' })}
          </a>
        </div>
        
        {/* Copyright and Additional Info */}
        <div className="text-center text-xs text-gray-500 space-y-1">
          <p>© 2025 Campus Pizza. {t('footer.allRights', { default: 'All rights reserved.' })}</p>
          <p>{t('footer.serviceArea', { default: 'Delivery service in Dortmund and surrounding areas' })}</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
