import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getCart } from '../cartSlice';
import { 
  generateConsistentSuggestions, 
  DynamicSuggestionProduct,
  convertDynamicSuggestionToProduct
} from '../../../utils/dynamicSuggestions';

interface Product {
  id: string | number;
  name: string;
  price: number;
  description?: string;
  category?: string;
}

interface CartItem {
  pizzaId: number;
  name: string;
  totalPrice: number;
  quantity: number;
  size?: string;
}

interface SuggestionHookReturn {
  haveYouSeen: Product[];
  didYouForget: Product[];
}

// Updated hook using dynamic suggestions system
export function useCartSuggestions(): SuggestionHookReturn & { cartAnalysis: any; isEmpty: boolean } {
  const cart = useSelector(getCart);
  
  const cartAnalysis = useMemo(() => analyzeCartContent(cart), [cart]);
  
  const suggestions = useMemo(() => {
    // Use the new dynamic suggestions system
    const dynamicSuggestions = generateConsistentSuggestions(cartAnalysis);
    
    return {
      haveYouSeen: dynamicSuggestions.haveYouSeen.map(convertDynamicSuggestionToCartProduct),
      didYouForget: dynamicSuggestions.didYouForget.map(convertDynamicSuggestionToCartProduct)
    };
  }, [cartAnalysis]);

  return {
    ...suggestions,
    cartAnalysis,
    isEmpty: cart.length === 0
  };
}

// Convert dynamic suggestion to cart product format
function convertDynamicSuggestionToCartProduct(suggestion: DynamicSuggestionProduct): Product {
  const converted = convertDynamicSuggestionToProduct(suggestion);
  return {
    id: converted.id,
    name: converted.name,
    price: converted.unitPrice || converted.price,
    description: converted.description || suggestion.description,
    category: suggestion.category
  };
}

function analyzeCartContent(cartItems: CartItem[]) {
  const analysis = {
    hasPizza: false,
    hasPasta: false,
    hasBeverage: false,
    hasAppetizer: false,
    hasDessert: false,
    totalValue: 0,
    itemCount: cartItems ? cartItems.length : 0,
    isLunchTime: isCurrentlyLunchTime(),
    isWeekend: isCurrentlyWeekend(),
    cartItems: cartItems || [] // Include cart items for filtering
  };

  if (cartItems && cartItems.length > 0) {
    cartItems.forEach(item => {
      analysis.totalValue += item.totalPrice;
      
      // Enhanced category detection with more patterns
      const itemName = item.name.toLowerCase();
      
      if (itemName.includes('pizza')) {
        analysis.hasPizza = true;
      }
      if (itemName.includes('pasta') || itemName.includes('tortellini')) {
        analysis.hasPasta = true;
      }
      // Enhanced beverage detection
      if (itemName.includes('cola') || itemName.includes('beer') || itemName.includes('water') ||
          itemName.includes('juice') || itemName.includes('espresso') || 
          itemName.includes('drink') || itemName.includes('beverage')) {
        analysis.hasBeverage = true;
      }
      // Enhanced appetizer detection
      if (itemName.includes('bread') || itemName.includes('buns') || itemName.includes('wings') ||
          itemName.includes('salad') || itemName.includes('sticks') || itemName.includes('focaccia')) {
        analysis.hasAppetizer = true;
      }
      // Enhanced dessert detection
      if (itemName.includes('tiramisu') || itemName.includes('ice cream') || itemName.includes('brownie') ||
          itemName.includes('gelato') || itemName.includes('dessert')) {
        analysis.hasDessert = true;
      }
    });
  }

  return analysis;
}

function isCurrentlyLunchTime(): boolean {
  const hour = new Date().getHours();
  return hour >= 11 && hour <= 15;
}

function isCurrentlyWeekend(): boolean {
  const day = new Date().getDay();
  return day === 0 || day === 6; // Sunday or Saturday
}

// Export the new hook as default for easy importing
export default useCartSuggestions;
