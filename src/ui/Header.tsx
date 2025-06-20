import { Link } from "react-router-dom";
import Username from "../features/user/Username";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from 'react-i18next';

function Header() {
  const { t } = useTranslation();

  return (
    <header className="bg-gradient-to-r from-orange-500 to-red-500 shadow-lg border-b border-orange-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-white hover:text-orange-100 transition-colors duration-200"
          >
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-orange-500 text-lg font-bold">🍕</span>
            </div>
            <span className="font-bold text-xl tracking-wide font-pizza uppercase">
              {t('header.title')}
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-white hover:text-orange-100 transition-colors duration-200 font-medium"
            >
              {t('navigation.menu', { default: 'Menu' })}
            </Link>
            <Link 
              to="/my-orders" 
              className="text-white hover:text-orange-100 transition-colors duration-200 font-medium"
            >
              {t('navigation.myOrders')}
            </Link>
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            <Username />
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-orange-600 bg-orange-600">
        <div className="px-4 py-2 space-x-6">
          <Link 
            to="/" 
            className="text-white hover:text-orange-100 transition-colors duration-200 text-sm font-medium"
          >
            {t('navigation.menu', { default: 'Menu' })}
          </Link>
          <Link 
            to="/my-orders" 
            className="text-white hover:text-orange-100 transition-colors duration-200 text-sm font-medium"
          >
            {t('navigation.myOrders')}
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
