import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface CountryCode {
  code: string;
  country: string;
  flag: string;
}

interface CountryCodeSelectorProps {
  selectedCode: string;
  onCodeChange: (code: string) => void;
  disabled?: boolean;
}

const COUNTRY_CODES: CountryCode[] = [
  { code: '+49', country: 'Germany', flag: '🇩🇪' },
  { code: '+34', country: 'Spain', flag: '🇪🇸' },
  { code: '+33', country: 'France', flag: '🇫🇷' },
  { code: '+39', country: 'Italy', flag: '🇮🇹' },
  { code: '+31', country: 'Netherlands', flag: '🇳🇱' },
  { code: '+32', country: 'Belgium', flag: '🇧🇪' },
  { code: '+43', country: 'Austria', flag: '🇦🇹' },
  { code: '+41', country: 'Switzerland', flag: '🇨🇭' },
  { code: '+44', country: 'United Kingdom', flag: '🇬🇧' },
  { code: '+1', country: 'United States', flag: '🇺🇸' },
];

function CountryCodeSelector({ selectedCode, onCodeChange, disabled = false }: CountryCodeSelectorProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const selectedCountry = COUNTRY_CODES.find(country => country.code === selectedCode) || COUNTRY_CODES[0];

  const handleSelect = (code: string) => {
    onCodeChange(code);
    setIsOpen(false);
  };

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className="relative">
      {/* Selected Country Display */}
      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        className={`
          flex items-center gap-2 px-3 py-3 border border-gray-300 rounded-l-lg bg-white
          hover:bg-gray-50 focus:ring-2 focus:ring-orange-500 focus:border-orange-500
          transition-colors min-w-[100px] justify-center
          ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
          ${isOpen ? 'border-orange-500 ring-2 ring-orange-500' : ''}
        `}
      >
        <span className="text-lg">{selectedCountry.flag}</span>
        <span className="font-medium text-gray-900">{selectedCountry.code}</span>
        <svg 
          className={`w-4 h-4 text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute top-full left-0 mt-1 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-64 overflow-y-auto">
            <div className="p-2">
              <div className="text-xs font-medium text-gray-500 mb-2 px-2 py-1 bg-gray-50 rounded">
                {t('checkout.selectCountryCode', { default: 'Select country code' })}
              </div>
              
              {COUNTRY_CODES.map((country) => (
                <button
                  key={country.code}
                  type="button"
                  onClick={() => handleSelect(country.code)}                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-left
                    hover:bg-orange-50 transition-colors border border-transparent
                    ${selectedCode === country.code ? 'bg-orange-50 text-orange-900 border-orange-200' : 'text-gray-900 hover:border-gray-200'}
                  `}
                >
                  <span className="text-lg">{country.flag}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium">{country.code}</div>
                    <div className="text-sm text-gray-600 truncate">{country.country}</div>
                  </div>
                  {selectedCode === country.code && (
                    <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default CountryCodeSelector;
