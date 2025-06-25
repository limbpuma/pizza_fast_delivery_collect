import { useTranslation } from 'react-i18next';

interface QuantityControlsProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
}

function QuantityControls({ 
  quantity, 
  onQuantityChange, 
  min = 1, 
  max = 10,
  disabled = false 
}: QuantityControlsProps) {
  const { t } = useTranslation();

  const handleDecrease = () => {
    if (quantity > min && !disabled) {
      onQuantityChange(quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (quantity < max && !disabled) {
      onQuantityChange(quantity + 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= min && value <= max) {
      onQuantityChange(value);
    }
  };

  const canDecrease = quantity > min && !disabled;
  const canIncrease = quantity < max && !disabled;

  return (
    <div className="flex items-center justify-center">
      <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
        {/* Decrease Button */}
        <button
          onClick={handleDecrease}
          disabled={!canDecrease}
          className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center transition-all duration-200 ${
            canDecrease
              ? 'text-gray-700 hover:bg-gray-100 active:bg-gray-200'
              : 'text-gray-300 cursor-not-allowed bg-gray-50'
          }`}
          aria-label={t('buttons.decrease', { default: 'Decrease quantity' })}
          type="button"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>

        {/* Quantity Input */}
        <div className="flex items-center justify-center min-w-0">
          <input
            type="number"
            value={quantity}
            onChange={handleInputChange}
            disabled={disabled}
            min={min}
            max={max}
            className={`w-16 sm:w-20 h-10 sm:h-12 text-center text-base sm:text-lg font-semibold border-none bg-transparent focus:outline-none focus:ring-0 ${
              disabled ? 'text-gray-400 cursor-not-allowed' : 'text-gray-900'
            }`}
            aria-label={t('menu.quantity', { default: 'Quantity' })}
          />
        </div>

        {/* Increase Button */}
        <button
          onClick={handleIncrease}
          disabled={!canIncrease}
          className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center transition-all duration-200 ${
            canIncrease
              ? 'text-gray-700 hover:bg-gray-100 active:bg-gray-200'
              : 'text-gray-300 cursor-not-allowed bg-gray-50'
          }`}
          aria-label={t('buttons.increase', { default: 'Increase quantity' })}
          type="button"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {/* Quantity Label */}
      <div className="ml-3 text-sm text-gray-600 min-w-0">
        <div>{t('menu.quantity', { default: 'Menge' })}</div>
        {max !== Infinity && (
          <div className="text-xs text-gray-500">
            {t('menu.maxQuantity', { max, default: `Max. ${max}` })}
          </div>
        )}
      </div>
    </div>
  );
}

export default QuantityControls;
