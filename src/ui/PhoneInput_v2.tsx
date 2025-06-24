import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import CountryCodeSelector from './CountryCodeSelector';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

function PhoneInput({ 
  value, 
  onChange, 
  error, 
  placeholder, 
  disabled = false,
  className = '' 
}: PhoneInputProps) {
  const { t } = useTranslation();
  
  // Parse the current phone value to extract country code and number
  const parsePhoneValue = (phoneValue: string) => {
    if (!phoneValue) return { countryCode: '+49', number: '' };
    
    // Find matching country code from the beginning of the string
    const countryCode = ['+49', '+34', '+33', '+39', '+31', '+32', '+43', '+41', '+44', '+1']
      .find(code => phoneValue.startsWith(code));
    
    if (countryCode) {
      const number = phoneValue.substring(countryCode.length).trim();
      return { countryCode, number };
    }
    
    // If no country code found, default to +49 and treat entire value as number
    return { countryCode: '+49', number: phoneValue };
  };

  // Initialize state from props
  const [isInitialized, setIsInitialized] = useState(false);
  const [countryCode, setCountryCode] = useState('+49');
  const [phoneNumber, setPhoneNumber] = useState('');

  // Initialize state only once from the incoming value
  useEffect(() => {
    if (!isInitialized) {
      const { countryCode: initialCountryCode, number: initialNumber } = parsePhoneValue(value);
      setCountryCode(initialCountryCode);
      setPhoneNumber(initialNumber);
      setIsInitialized(true);
    }
  }, [value, isInitialized]);

  const handleCountryCodeChange = (newCountryCode: string) => {
    setCountryCode(newCountryCode);
    const fullPhone = phoneNumber ? `${newCountryCode} ${phoneNumber}` : newCountryCode;
    onChange(fullPhone);
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newNumber = e.target.value.replace(/[^\d\s\-\(\)]/g, ''); // Allow only digits, spaces, dashes, parentheses
    setPhoneNumber(newNumber);
    const fullPhone = newNumber ? `${countryCode} ${newNumber}` : countryCode;
    onChange(fullPhone);
  };

  const getPlaceholder = () => {
    if (placeholder) return placeholder;
    
    switch (countryCode) {
      case '+49': return '123 456 7890';
      case '+34': return '123 456 789';
      case '+33': return '1 23 45 67 89';
      case '+39': return '123 456 7890';
      case '+31': return '6 12345678';
      case '+32': return '12 34 56 78';
      case '+43': return '123 456789';
      case '+41': return '12 345 67 89';
      case '+44': return '7123 456789';
      case '+1': return '(123) 456-7890';
      default: return 'xxx xxx xxxx';
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="flex">
        {/* Country Code Selector */}
        <CountryCodeSelector
          selectedCode={countryCode}
          onCodeChange={handleCountryCodeChange}
          disabled={disabled}
        />
        
        {/* Phone Number Input */}
        <input
          type="tel"
          value={phoneNumber}
          onChange={handlePhoneNumberChange}
          disabled={disabled}
          placeholder={getPlaceholder()}
          className={`
            flex-1 px-4 py-3 border border-l-0 rounded-r-lg
            focus:ring-2 focus:ring-orange-500 focus:border-orange-500
            transition-colors
            ${error ? 'border-red-500' : 'border-gray-300'}
            ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}
          `}
        />
      </div>
      
      {/* Error Message */}
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      
      {/* Helper Text */}
      <div className="mt-1 text-xs text-gray-500">
        {t('checkout.phoneHelper', { 
          default: 'Enter your phone number without country code' 
        })}
      </div>
    </div>
  );
}

export default PhoneInput;
