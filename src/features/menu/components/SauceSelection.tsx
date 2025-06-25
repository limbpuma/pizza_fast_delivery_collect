import { useTranslation } from 'react-i18next';
import { formatCurrency } from '../../../utils/helpers';

export interface SauceOption {
  id: string;
  name: string;
  price: number;
  isDefault?: boolean;
  isPremium?: boolean;
  description?: string;
}

interface SauceSelectionProps {
  sauces: SauceOption[];
  selectedSauce: string;
  onSauceChange: (sauceId: string) => void;
  required?: boolean;
}

function SauceSelection({ 
  sauces, 
  selectedSauce, 
  onSauceChange, 
  required = true 
}: SauceSelectionProps) {
  const { t } = useTranslation();

  const handleKeyDown = (event: React.KeyboardEvent, sauce: SauceOption) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSauceChange(sauce.id);
    }
  };

  return (
    <div className="space-y-2 sm:space-y-3">
      <div className="flex items-center gap-2">
        <h4 className="font-semibold text-gray-900 text-sm sm:text-base">
          {t('menu.selectSauce', { default: 'Sauce auswählen' })}
        </h4>
        {required && (
          <span className="text-red-500 text-sm" aria-label="Required field">*</span>
        )}
      </div>
      
      <div role="radiogroup" aria-labelledby="sauce-selection-label" className="space-y-2">
        <div id="sauce-selection-label" className="sr-only">{t('menu.selectSauce')}</div>
        
        {sauces.map((sauce: SauceOption) => {
          const isSelected = selectedSauce === sauce.id;
          const isFree = sauce.price === 0;
          
          return (
            <button
              key={sauce.id}
              onClick={() => onSauceChange(sauce.id)}
              onKeyDown={(e) => handleKeyDown(e, sauce)}
              className={`w-full p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                isSelected
                  ? 'border-orange-500 bg-orange-50 ring-2 ring-orange-200'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 focus:border-orange-300 focus:ring-2 focus:ring-orange-200'
              }`}
              role="radio"
              aria-checked={isSelected}
              aria-describedby={sauce.description ? `sauce-${sauce.id}-description` : undefined}
              tabIndex={0}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    isSelected ? 'border-orange-500' : 'border-gray-300'
                  }`}>
                    {isSelected && (
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    )}
                  </div>
                  
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <div className="font-medium text-gray-900 text-sm sm:text-base">
                        {sauce.name}
                      </div>
                      
                      {/* Badges */}
                      <div className="flex gap-1">
                        {sauce.isDefault && (
                          <span className="inline-block px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                            {t('menu.default', { default: 'Standard' })}
                          </span>
                        )}
                        {sauce.isPremium && (
                          <span className="inline-block px-1.5 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full font-medium">
                            {t('menu.premium', { default: 'Premium' })}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {sauce.description && (
                      <div 
                        id={`sauce-${sauce.id}-description`}
                        className="text-xs sm:text-sm text-gray-500 mt-1"
                      >
                        {sauce.description}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="text-right flex-shrink-0">
                  <div className="font-semibold text-gray-900 text-sm sm:text-base">
                    {isFree ? (
                      <span className="text-green-600 text-sm">
                        {t('menu.free', { default: 'Kostenlos' })}
                      </span>
                    ) : (
                      <span className="text-orange-600">
                        + {formatCurrency(sauce.price)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
      
      {/* Required field help text */}
      {required && !selectedSauce && (
        <div className="text-xs text-red-600 mt-1 flex items-center gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          {t('menu.sauceRequired', { default: 'Bitte wählen Sie eine Sauce aus.' })}
        </div>
      )}
    </div>
  );
}

export default SauceSelection;
