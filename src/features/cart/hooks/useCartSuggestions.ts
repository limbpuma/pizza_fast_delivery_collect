import { useMemo, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getCart } from '../cartSlice';
import { 
  getCachedRealMenuSuggestions,
  getSmartRealMenuSuggestions,
  RealMenuSuggestion 
} from '../../../utils/realMenuSuggestions';

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

// Updated hook using real menu suggestions system
export function useCartSuggestions(): SuggestionHookReturn & { cartAnalysis: any; isEmpty: boolean } {
  const cart = useSelector(getCart);
  const [realSuggestions, setRealSuggestions] = useState<RealMenuSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load real menu suggestions
  useEffect(() => {
    let isMounted = true;
    
    const loadRealSuggestions = async () => {
      try {
        console.log('🔄 Loading real menu suggestions for cart...');
        const suggestions = await getCachedRealMenuSuggestions();
        
        if (isMounted) {
          setRealSuggestions(suggestions);
          setIsLoading(false);
          console.log(`✅ Loaded ${suggestions.length} real menu suggestions for cart`);
        }
      } catch (error) {
        console.error('❌ Failed to load real menu suggestions:', error);
        if (isMounted) {
          setRealSuggestions([]);
          setIsLoading(false);
        }
      }
    };
    
    loadRealSuggestions();
    
    return () => {
      isMounted = false;
    };
  }, []);
  
  const cartAnalysis = useMemo(() => analyzeCartContent(cart), [cart]);
  
  const suggestions = useMemo(() => {
    if (isLoading || realSuggestions.length === 0) {
      return {
        haveYouSeen: [],
        didYouForget: []
      };
    }
    
    // Use real menu suggestions with smart filtering
    const smartSuggestions = getSmartRealMenuSuggestions(realSuggestions, cartAnalysis);
    
    return {
      haveYouSeen: smartSuggestions.haveYouSeen.map(convertRealSuggestionToProduct),
      didYouForget: smartSuggestions.didYouForget.map(convertRealSuggestionToProduct)
    };
  }, [realSuggestions, cartAnalysis, isLoading]);

  return {
    ...suggestions,
    cartAnalysis,
    isEmpty: cart.length === 0
  };
}

// Convert real menu suggestion to cart product format
function convertRealSuggestionToProduct(suggestion: RealMenuSuggestion): Product {
  return {
    id: suggestion.id,
    name: suggestion.name,
    price: suggestion.price,
    description: suggestion.description,
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
      
      // Enhanced category detection with German terms
      const itemName = item.name.toLowerCase();
      
      if (itemName.includes('pizza')) {
        analysis.hasPizza = true;
      }
      if (itemName.includes('pasta') || itemName.includes('nudeln') || itemName.includes('tortellini')) {
        analysis.hasPasta = true;
      }
      // Enhanced beverage detection with German terms
      if (itemName.includes('cola') || itemName.includes('bier') || itemName.includes('wasser') ||
          itemName.includes('saft') || itemName.includes('espresso') || itemName.includes('getränk') ||
          itemName.includes('drink') || itemName.includes('beverage') || itemName.includes('water')) {
        analysis.hasBeverage = true;
      }
      // Enhanced appetizer detection with German terms
      if (itemName.includes('brot') || itemName.includes('baguette') || itemName.includes('wings') ||
          itemName.includes('salat') || itemName.includes('sticks') || itemName.includes('focaccia') ||
          itemName.includes('nachos') || itemName.includes('crossies') || itemName.includes('snack')) {
        analysis.hasAppetizer = true;
      }
      // Enhanced dessert detection with German terms
      if (itemName.includes('tiramisu') || itemName.includes('eis') || itemName.includes('brownie') ||
          itemName.includes('gelato') || itemName.includes('dessert') || itemName.includes('nachtisch')) {
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
