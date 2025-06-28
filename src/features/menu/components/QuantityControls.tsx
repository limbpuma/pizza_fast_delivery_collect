import { useTranslation } from 'react-i18next';

interface QuantityControlsProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  compact?: boolean; // New prop for ultra-compact mode
}

function QuantityControls({ 
  quantity, 
  onQuantityChange, 
  min = 1, 
  max = 10,
  disabled = false,
  compact = false
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

  if (compact) {
    // Ultra-compact version for modals
    return (
      <div className="flex items-center border border-gray-300 rounded-md overflow-hidden bg-white shadow-sm">
        {/* Decrease Button */}
        <button
          onClick={handleDecrease}
          disabled={!canDecrease}
          className={`w-7 h-7 flex items-center justify-center transition-all duration-200 ${
            canDecrease
              ? 'text-gray-700 hover:bg-gray-100 active:bg-gray-200'
              : 'text-gray-300 cursor-not-allowed bg-gray-50'
          }`}
          aria-label={t('buttons.decrease', { default: 'Decrease quantity' })}
          type="button"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>

        {/* Quantity Input */}
        <input
          type="number"
          value={quantity}
          onChange={handleInputChange}
          disabled={disabled}
          min={min}
          max={max}
          className={`w-10 h-7 text-center text-sm font-semibold border-none bg-transparent focus:outline-none focus:ring-0 ${
            disabled ? 'text-gray-400 cursor-not-allowed' : 'text-gray-900'
          }`}
          aria-label={t('menu.quantity', { default: 'Quantity' })}
        />

        {/* Increase Button */}
        <button
          onClick={handleIncrease}
          disabled={!canIncrease}
          className={`w-7 h-7 flex items-center justify-center transition-all duration-200 ${
            canIncrease
              ? 'text-gray-700 hover:bg-gray-100 active:bg-gray-200'
              : 'text-gray-300 cursor-not-allowed bg-gray-50'
          }`}
          aria-label={t('buttons.increase', { default: 'Increase quantity' })}
          type="button"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center">
      <div className="flex items-center border border-gray-300 rounded-md overflow-hidden bg-white shadow-sm">
        {/* Decrease Button */}
        <button
          onClick={handleDecrease}
          disabled={!canDecrease}
          className={`w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center transition-all duration-200 ${
            canDecrease
              ? 'text-gray-700 hover:bg-gray-100 active:bg-gray-200'
              : 'text-gray-300 cursor-not-allowed bg-gray-50'
          }`}
          aria-label={t('buttons.decrease', { default: 'Decrease quantity' })}
          type="button"
        >
          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            className={`w-12 sm:w-14 h-8 sm:h-9 text-center text-sm sm:text-base font-semibold border-none bg-transparent focus:outline-none focus:ring-0 ${
              disabled ? 'text-gray-400 cursor-not-allowed' : 'text-gray-900'
            }`}
            aria-label={t('menu.quantity', { default: 'Quantity' })}
          />
        </div>

        {/* Increase Button */}
        <button
          onClick={handleIncrease}
          disabled={!canIncrease}
          className={`w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center transition-all duration-200 ${
            canIncrease
              ? 'text-gray-700 hover:bg-gray-100 active:bg-gray-200'
              : 'text-gray-300 cursor-not-allowed bg-gray-50'
          }`}
          aria-label={t('buttons.increase', { default: 'Increase quantity' })}
          type="button"
        >
          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {/* Compact Quantity Label */}
      <div className="ml-2 text-xs sm:text-sm text-gray-600 min-w-0">
        <div className="font-medium">{t('menu.quantity', { default: 'Anzahl' })}</div>
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
