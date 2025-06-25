import { Link } from "react-router-dom";
import Username from "../features/user/Username";
import LanguageSwitcher from "./LanguageSwitcher";
import RestaurantStatusBanner from "./RestaurantStatusBanner";
import { useTranslation } from 'react-i18next';

function Header() {
  const { t } = useTranslation();

  return (
    <>
      <header className="border-b border-orange-600 shadow-lg bg-gradient-to-r from-orange-500 to-red-500">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo/Brand */}
            <Link 
              to="/" 
              className="flex items-center space-x-2 text-white transition-colors duration-200 hover:text-orange-100"
            >
              <div className="flex items-center justify-center w-8 h-8 bg-white rounded-full">
                <span className="text-lg font-bold text-orange-500">🍕</span>
              </div>
              <span className="text-xl font-bold tracking-wide uppercase font-pizza">
                {t('header.title')}
              </span>
            </Link>

            {/* Navigation */}
            <nav className="items-center hidden space-x-8 md:flex">
              <Link 
                to="/" 
                className="font-medium text-white transition-colors duration-200 hover:text-orange-100"
              >
                {t('navigation.menu', { default: 'Menu' })}
              </Link>
              <Link 
                to="/my-orders" 
                className="font-medium text-white transition-colors duration-200 hover:text-orange-100"
              >
                {t('navigation.myOrders')}
              </Link>
              <Link 
                to="/modal-test" 
                className="px-2 py-1 text-sm font-medium text-white transition-colors duration-200 bg-green-600 rounded hover:text-orange-100"
                title="Test Advanced Pizza Modal (Phase 3)"
              >
                🧪 Modal Test
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
        <div className="bg-orange-600 border-t border-orange-600 md:hidden">
          <div className="px-4 py-2 space-x-6">
            <Link 
              to="/" 
              className="text-sm font-medium text-white transition-colors duration-200 hover:text-orange-100"
            >
              {t('navigation.menu', { default: 'Menu' })}
            </Link>
            <Link 
              to="/my-orders" 
              className="text-sm font-medium text-white transition-colors duration-200 hover:text-orange-100"
            >
              {t('navigation.myOrders')}
            </Link>
          </div>
        </div>
      </header>

      {/* Restaurant Status Banner */}
      <RestaurantStatusBanner />
    </>
  );
}

export default Header;
