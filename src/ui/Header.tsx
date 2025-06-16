import { Link } from "react-router-dom";
import SearchOrder from "../features/order/SearchOrder";
import Username from "../features/user/Username";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from 'react-i18next';

function Header() {
  const { t } = useTranslation();

  return (
    <header
      className="bg-yellow-400 uppercase border-b border-stone-200 
    px-4 py-3 sm:px-6 flex items-center justify-between font-pizza"
    >
      <Link to="/" className=" tracking-widest">
        {t('header.title')}
      </Link>

      <div className="flex items-center gap-4">
        <SearchOrder />
        <LanguageSwitcher />
        <Username />
      </div>
    </header>
  );
}

export default Header;
