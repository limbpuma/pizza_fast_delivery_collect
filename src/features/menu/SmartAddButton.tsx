import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { getCurrentQuantityById, addItem, increaseItemQuantity, decreaseItemQuantity, deleteItem } from '../cart/cartSlice';
import { getProductType, createQuickAddItem } from '../../utils/productHelpers';

interface SmartAddButtonProps {
  pizza: any;
  onSizeModalOpen: () => void;
}

function SmartAddButton({ pizza, onSizeModalOpen }: SmartAddButtonProps) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { id, name } = pizza;
  const currentQuantity = useSelector(getCurrentQuantityById(id));
  const [isQuickAdding, setIsQuickAdding] = useState(false);
  
  const productType = getProductType(pizza);
  const isInCart = currentQuantity > 0;

  const handleQuickAdd = async () => {
    setIsQuickAdding(true);
    
    if (isInCart) {
      // If already in cart, just increase quantity
      dispatch(increaseItemQuantity(id));
    } else {
      // If not in cart, add new item
      const quickItem = createQuickAddItem(pizza);
      dispatch(addItem(quickItem));
    }
    
    // Brief feedback animation
    await new Promise(resolve => setTimeout(resolve, 300));
    setIsQuickAdding(false);
  };
  const handleAddClick = () => {
    if (productType.quickAddEnabled && !productType.needsSizeSelection) {
      handleQuickAdd();
    } else {
      onSizeModalOpen();
    }
  };

  // For Quick Add products that are in cart, show quantity controls
  if (productType.quickAddEnabled && isInCart) {
    return (
      <div className="flex items-center gap-1">
        {/* Decrement/Delete Button */}
        {currentQuantity === 1 ? (
          <button
            onClick={() => dispatch(deleteItem(id))}
            className="w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-all duration-200"
            title={t('buttons.delete')}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>        ) : (
          <button
            onClick={() => dispatch(decreaseItemQuantity(id))}
            className="w-8 h-8 rounded-full bg-gray-400 hover:bg-gray-500 text-white flex items-center justify-center transition-all duration-200"
            title={t('buttons.decrease')}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
        )}
        
        {/* Quantity Display */}
        <span className="w-8 text-center font-semibold text-gray-900">{currentQuantity}</span>
        
        {/* Increment Button */}
        <button
          onClick={handleQuickAdd}
          disabled={isQuickAdding}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
            isQuickAdding 
              ? 'bg-green-500 scale-110' 
              : 'bg-blue-500 hover:bg-blue-600'
          } text-white`}
          title={t('buttons.increase')}
        >
          {isQuickAdding ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          )}
          
          {isQuickAdding && (
            <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-75"></div>
          )}
        </button>
      </div>
    );
  }

  // For products not in cart or that need size selection
  return (
    <button
      onClick={handleAddClick}
      disabled={isQuickAdding}
      className={`relative w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
        isQuickAdding 
          ? 'bg-green-500 scale-110' 
          : productType.quickAddEnabled 
            ? 'bg-blue-500 hover:bg-blue-600' 
            : 'bg-orange-500 hover:bg-orange-600'
      } text-white`}
      aria-label={
        productType.quickAddEnabled 
          ? t('menu.quickAdd', { default: 'Quick Add' })
          : t('menu.selectSize')
      }
      title={
        productType.quickAddEnabled 
          ? `Quick Add ${name}` 
          : `Select size for ${name}`
      }
    >
      {isQuickAdding ? (
        // Success checkmark animation
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ) : productType.quickAddEnabled ? (
        // Quick add icon (shopping cart)
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m-2.4 2h0m2 6v0m0 0h10M7 13v8a2 2 0 002 2h6a2 2 0 002-2v-8m-10 0V9a2 2 0 012-2h6a2 2 0 012 2v4.01" />
        </svg>
      ) : (
        // Size selection icon (plus)
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      )}
      
      {/* Quick add feedback pulse */}
      {isQuickAdding && (
        <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-75"></div>
      )}
    </button>
  );
}

export default SmartAddButton;
