import { useTranslation } from 'react-i18next';

function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={() => changeLanguage('en')}
        className={`px-3 py-1 text-sm rounded ${
          i18n.language === 'en'
            ? 'bg-yellow-400 text-gray-900 font-semibold'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => changeLanguage('de')}
        className={`px-3 py-1 text-sm rounded ${
          i18n.language === 'de'
            ? 'bg-yellow-400 text-gray-900 font-semibold'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        DE
      </button>
    </div>
  );
}

export default LanguageSwitcher;
