import { useTranslation } from 'react-i18next';
import { formatCurrency } from '../../../utils/helpers';

export interface PizzaSize {
  size: string;
  diameter: string;
  price: number;
  label: string;
  weight?: number;
}

interface SizeSelectionProps {
  sizes: PizzaSize[];
  selectedSize: string | null;
  onSizeChange: (size: string) => void;
  required?: boolean;
  showPriceComparison?: boolean;
  germanInfo?: any;
}

function SizeSelection({ 
  sizes, 
  selectedSize, 
  onSizeChange, 
  required = true,
  showPriceComparison = true,
  germanInfo 
}: SizeSelectionProps) {
  const { t } = useTranslation();

  const handleKeyDown = (event: React.KeyboardEvent, size: PizzaSize) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSizeChange(size.size);
    }
  };

  return (
    <div className="space-y-2 sm:space-y-3">
      <div className="flex items-center gap-2">
        <h4 className="font-semibold text-gray-900 text-sm sm:text-base">
          {t('menu.selectSize')}
        </h4>
        {required && (
          <span className="text-red-500 text-sm" aria-label="Required field">*</span>
        )}
      </div>
      
      <div role="radiogroup" aria-labelledby="size-selection-label" className="space-y-2 sm:space-y-3">
        <div id="size-selection-label" className="sr-only">{t('menu.selectSize')}</div>
        
        {sizes.map((size: PizzaSize) => {
          const isSelected = selectedSize === size.size;
          
          return (
            <button
              key={size.size}
              onClick={() => onSizeChange(size.size)}
              onKeyDown={(e) => handleKeyDown(e, size)}
              className={`w-full p-3 sm:p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                isSelected
                  ? 'border-orange-500 bg-orange-50 ring-2 ring-orange-200'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 focus:border-orange-300 focus:ring-2 focus:ring-orange-200'
              }`}
              role="radio"
              aria-checked={isSelected}
              aria-describedby={size.weight ? `size-${size.size}-description` : undefined}
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
                  
                  <div className="min-w-0">
                    <div className="font-medium text-gray-900 text-sm sm:text-base">{size.label}</div>
                    {size.weight && (
                      <div 
                        id={`size-${size.size}-description`}
                        className="text-xs sm:text-sm text-gray-500"
                      >
                        ca. {size.weight}g
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="text-right flex-shrink-0">
                  <div className="font-semibold text-gray-900 text-sm sm:text-base">
                    {formatCurrency(size.price)}
                  </div>
                  {showPriceComparison && germanInfo && size.weight && (
                    <div className="text-xs text-gray-500">
                      {formatCurrency(size.price * 100 / size.weight)}/100g
                    </div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default SizeSelection;
