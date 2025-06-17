import { useMemo } from 'react';

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

function useCartSuggestions(cartItems: CartItem[]): SuggestionHookReturn {
  const suggestions = useMemo(() => {
    // Early return if no cart items
    if (!cartItems || cartItems.length === 0) {
      return {
        haveYouSeen: [],
        didYouForget: []
      };
    }

    // Analyze cart content
    const cartAnalysis = analyzeCartContent(cartItems);
    
    // Generate suggestions based on analysis
    const haveYouSeen = generatePopularSuggestions(cartAnalysis);
    const didYouForget = generateMissingSuggestions(cartAnalysis);

    return {
      haveYouSeen,
      didYouForget
    };
  }, [cartItems]);

  return suggestions;
}

function analyzeCartContent(cartItems: CartItem[]) {
  const analysis = {
    hasPizza: false,
    hasPasta: false,
    hasBeverage: false,
    hasAppetizer: false,
    hasDessert: false,
    totalValue: 0,
    itemCount: cartItems.length,
    isLunchTime: isCurrentlyLunchTime(),
    isWeekend: isCurrentlyWeekend()
  };

  cartItems.forEach(item => {
    analysis.totalValue += item.totalPrice;
    
    // Simple category detection based on name
    const itemName = item.name.toLowerCase();
    
    if (itemName.includes('pizza')) {
      analysis.hasPizza = true;
    }
    if (itemName.includes('pasta') || itemName.includes('tortellini')) {
      analysis.hasPasta = true;
    }
    if (itemName.includes('cola') || itemName.includes('beer') || itemName.includes('water')) {
      analysis.hasBeverage = true;
    }
    if (itemName.includes('bread') || itemName.includes('buns')) {
      analysis.hasAppetizer = true;
    }
  });

  return analysis;
}

function generatePopularSuggestions(analysis: any): Product[] {
  const suggestions: Product[] = [];
  
  // Popular items from mock data
  const popularItems = [
    {
      id: 'coca-cola',
      name: 'Coca-Cola 1,0l',
      description: 'Coca-Cola steht für einzigartigen Geschmack, Erfrischung und Momente voller Lebensfreude.',
      price: 3.84,
      category: 'beverage'
    },
    {
      id: 'stuffed-pizza-buns-gouda',
      name: 'Stuffed Pizza Buns with Gouda (6 pieces)',
      price: 6.00,
      category: 'appetizer'
    },
    {
      id: 'stuffed-pizza-buns-tuna',
      name: 'Stuffed Pizza Buns with Tuna',
      price: 6.50,
      category: 'appetizer'
    }
  ];

  // Add popular items if relevant
  if (analysis.hasPizza && !analysis.hasBeverage) {
    suggestions.push(popularItems[0]); // Coca-Cola
  }

  if (analysis.hasPizza && !analysis.hasAppetizer) {
    suggestions.push(popularItems[1]); // Pizza Buns
  }

  // Weekend specials
  if (analysis.isWeekend) {
    suggestions.push(popularItems[2]); // Tuna buns
  }

  return suggestions.slice(0, 3); // Limit to 3 suggestions
}

function generateMissingSuggestions(analysis: any): Product[] {
  const suggestions: Product[] = [];

  // Essential missing items
  if ((analysis.hasPizza || analysis.hasPasta) && !analysis.hasBeverage) {
    suggestions.push({
      id: 'red-bull',
      name: 'Red Bull 0,25l',
      price: 3.49,
      category: 'beverage'
    });
  }

  if (analysis.hasPasta && !analysis.hasAppetizer) {
    suggestions.push({
      id: 'garlic-bread',
      name: 'Garlic Bread',
      price: 4.50,
      category: 'appetizer'
    });
  }

  // Value-based suggestions
  if (analysis.totalValue < 15) {
    suggestions.push({
      id: 'family-combo',
      name: 'Family Pizza Combo',
      price: 24.99,
      category: 'combo'
    });
  }

  return suggestions.slice(0, 2); // Limit to 2 suggestions
}

function isCurrentlyLunchTime(): boolean {
  const hour = new Date().getHours();
  return hour >= 11 && hour <= 15;
}

function isCurrentlyWeekend(): boolean {
  const day = new Date().getDay();
  return day === 0 || day === 6; // Sunday or Saturday
}

export default useCartSuggestions;
