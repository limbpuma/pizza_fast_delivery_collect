import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface CartSuggestionsProps {
  cartItems: any[];
}

function CartSuggestions({ cartItems }: CartSuggestionsProps) {
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState<'seen' | 'forgot'>('seen');

  // Mock suggestions data - will be replaced with real logic
  const suggestionsData = {
    seen: [
      {
        id: 'coca-cola',
        name: 'Coca-Cola 1,0l',
        description: 'Coca-Cola steht für einzigartigen Geschmack, Erfrischung und Momente voller Lebensfreude.',
        price: 3.84,
        image: '🥤'
      },
      {
        id: 'stuffed-pizza-buns-gouda',
        name: 'Stuffed Pizza Buns with Gouda (6 pieces)',
        price: 6.00,
        image: '🥖'
      },
      {
        id: 'stuffed-pizza-buns-tuna',
        name: 'Stuffed Pizza Buns with Tuna',
        price: 6.50,
        image: '🥖'
      }
    ],
    forgot: [
      {
        id: 'red-bull',
        name: 'Red Bull 0,25l',
        price: 3.49,
        image: '🏮'
      }
    ]
  };

  const currentSuggestions = suggestionsData[activeSection];

  if (currentSuggestions.length === 0) return null;

  return (
    <div className="bg-blue-50 border-t border-blue-100">
      {/* Section Headers */}
      <div className="p-4 pb-0">
        <div className="flex space-x-1">
          <button
            onClick={() => setActiveSection('seen')}
            className={`
              px-3 py-2 text-sm font-medium rounded-lg transition-colors
              ${activeSection === 'seen' 
                ? 'bg-blue-600 text-white' 
                : 'text-blue-600 hover:bg-blue-100'
              }
            `}
          >
            {t('cart.haveYouSeen', { default: 'Have you seen...' })}
          </button>
          <button
            onClick={() => setActiveSection('forgot')}
            className={`
              px-3 py-2 text-sm font-medium rounded-lg transition-colors
              ${activeSection === 'forgot' 
                ? 'bg-blue-600 text-white' 
                : 'text-blue-600 hover:bg-blue-100'
              }
            `}
          >
            {t('cart.didYouForget', { default: 'Did you forget?' })}
          </button>
        </div>
      </div>

      {/* Suggestions List */}
      <div className="p-4 space-y-3">
        {currentSuggestions.map((item) => (
          <div key={item.id} className="bg-white rounded-lg p-3 shadow-sm border border-blue-100">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{item.image}</span>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 text-sm">{item.name}</h4>
                    {item.description && (
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 ml-3">
                <span className="font-semibold text-gray-900">
                  {item.price.toFixed(2)} €
                </span>
                <button className="bg-orange-500 hover:bg-orange-600 text-white w-8 h-8 rounded-full flex items-center justify-center transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation for multiple items (future enhancement) */}
      {currentSuggestions.length > 3 && (
        <div className="flex justify-center pb-4">
          <div className="flex space-x-1">
            <button className="w-2 h-2 bg-blue-600 rounded-full"></button>
            <button className="w-2 h-2 bg-blue-300 rounded-full"></button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartSuggestions;
