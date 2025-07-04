/**
 * Dynamic Product Suggestions System
 * Replaces static SUGGESTION_QUICK_ADD_PRODUCTS with real product data
 */

import { getGermanPizzaInfo } from '../data/germanPizzaInfo';
import { mockNonPizzaItems } from '../data/mockNonPizzaItems';

export interface DynamicSuggestionProduct {
  id: string;
  name: string;
  price: number;
  category: 'beverage' | 'appetizer' | 'dessert' | 'pizza';
  emoji: string;
  // Pizza-specific fields
  pizzaId?: number;
  size?: 'klein' | 'normal' | 'gross';
  diameter?: number;
  // Source tracking
  source: 'real-pizza' | 'mock-item' | 'dynamic';
  // Additional metadata
  isPopular?: boolean;
  description?: string;
}

/**
 * Generates dynamic suggestions using real menu data
 * This creates a smarter, data-driven recommendation system
 */
export function generateDynamicSuggestions(): DynamicSuggestionProduct[] {
  const suggestions: DynamicSuggestionProduct[] = [];

  // 1. Add beverages from mockNonPizzaItems + dynamic additions
  const beverageItems = [
    // From mock data
    { mockId: 101, emoji: '🥤', name: 'Coca-Cola' },
    { mockId: 105, emoji: '💧', name: 'Sparkling Water' }
  ];

  beverageItems.forEach(({ mockId, emoji, name }) => {
    const item = mockNonPizzaItems.find(item => item.id === mockId);
    if (item) {
      suggestions.push({
        id: `mock-${item.id}`,
        name: item.name,
        price: item.unitPrice,
        category: 'beverage',
        emoji,
        source: 'mock-item',
        description: `Refreshing ${name.toLowerCase()}`
      });
    }
  });
  // Add dynamic beverages that complement pizza - using proper numeric IDs
  suggestions.push(
    {
      id: '106',
      name: 'Beer Estrella Galicia 0,33l',
      price: 3.20,
      category: 'beverage',
      emoji: '🍺',
      source: 'dynamic',
      isPopular: true,
      description: 'Premium Spanish beer, perfect with pizza'
    },
    {
      id: '107',
      name: 'Fresh Orange Juice 0,5l',
      price: 3.90,
      category: 'beverage',
      emoji: '🍊',
      source: 'dynamic',
      description: 'Freshly squeezed orange juice'
    },
    {
      id: '108',
      name: 'Double Espresso',
      price: 3.20,
      category: 'beverage',
      emoji: '☕',
      source: 'dynamic',
      description: 'Strong Italian espresso, double shot'
    }
  );

  // 2. Add appetizers from mockNonPizzaItems + dynamic additions
  const appetizerItems = [
    { mockId: 103, emoji: '🥖', name: 'Garlic Bread' },
    { mockId: 104, emoji: '🥗', name: 'Caesar Salad' }
  ];

  appetizerItems.forEach(({ mockId, emoji, name }) => {
    const item = mockNonPizzaItems.find(item => item.id === mockId);
    if (item) {
      suggestions.push({
        id: `mock-${item.id}`,
        name: item.name,
        price: item.unitPrice,
        category: 'appetizer',
        emoji,
        source: 'mock-item',
        description: `Classic ${name.toLowerCase()}`
      });
    }
  });
  // Add dynamic appetizers
  suggestions.push(
    {
      id: '109',
      name: 'Stuffed Pizza Buns with Gouda (6 pieces)',
      price: 6.00,
      category: 'appetizer',
      emoji: '🧀',
      source: 'dynamic',
      isPopular: true,
      description: 'Crispy buns filled with melted Gouda cheese'
    },
    {
      id: '110',
      name: 'Buffalo Wings (6 pieces)',
      price: 7.90,
      category: 'appetizer',
      emoji: '🍗',
      source: 'dynamic',
      isPopular: true,
      description: 'Spicy chicken wings with buffalo sauce'
    },
    {
      id: '111',
      name: 'Mozzarella Sticks (6 pieces)',
      price: 6.90,
      category: 'appetizer',
      emoji: '🧄',
      source: 'dynamic',
      description: 'Crispy breaded mozzarella with marinara dip'
    },
    {
      id: '112',
      name: 'Rosemary Focaccia',
      price: 5.50,
      category: 'appetizer',
      emoji: '🌿',
      source: 'dynamic',
      description: 'Italian flatbread with rosemary and olive oil'
    }
  );

  // 3. Add desserts from mockNonPizzaItems + dynamic additions
  const dessertItems = [
    { mockId: 102, emoji: '🍰', name: 'Tiramisu' }
  ];

  dessertItems.forEach(({ mockId, emoji, name }) => {
    const item = mockNonPizzaItems.find(item => item.id === mockId);
    if (item) {
      suggestions.push({
        id: `mock-${item.id}`,
        name: item.name,
        price: item.unitPrice,
        category: 'dessert',
        emoji,
        source: 'mock-item',
        description: `Classic Italian ${name.toLowerCase()}`
      });
    }
  });
  // Add dynamic desserts
  suggestions.push(
    {
      id: '113',
      name: 'Gelato (3 scoops)',
      price: 4.90,
      category: 'dessert',
      emoji: '🍨',
      source: 'dynamic',
      description: 'Vanilla, chocolate & strawberry Italian gelato'
    },
    {
      id: '114',
      name: 'Chocolate Brownie',
      price: 6.50,
      category: 'dessert',
      emoji: '🍫',
      source: 'dynamic',
      description: 'Warm brownie with vanilla ice cream'
    }
  );

  // 4. Add popular pizzas as predefined Normal size options using real data
  const popularPizzaIds = [1, 9]; // Margherita and Pepperoni

  popularPizzaIds.forEach(pizzaId => {
    const germanInfo = getGermanPizzaInfo(pizzaId);
    if (germanInfo && germanInfo.isPopular) {
      // Calculate Normal size price using realistic pricing
      const basePrice = pizzaId === 1 ? 10.50 : 12.90; // Margherita vs Pepperoni
        suggestions.push({
        id: pizzaId.toString(), // Use the actual pizza ID
        name: `Pizza ${pizzaId === 1 ? 'Margherita' : 'Pepperoni'} (Normal 32cm)`,
        price: basePrice,
        category: 'pizza',
        emoji: '🍕',
        pizzaId: pizzaId,
        size: 'normal',
        diameter: germanInfo.diameter,
        source: 'real-pizza',
        isPopular: true,
        description: pizzaId === 1 
          ? 'Classic tomato, mozzarella, basil - Normal size'
          : 'Tomato, mozzarella, spicy pepperoni - Normal size'
      });
    }
  });

  return suggestions;
}

/**
 * Smart size recommendation algorithm
 * Suggests optimal pizza sizes based on cart context
 */
export function getOptimalPizzaSize(cartAnalysis: any): 'klein' | 'normal' | 'gross' {
  const { itemCount, totalValue, isWeekend } = cartAnalysis;
  
  // High value order or weekend -> suggest large size
  if (totalValue > 25 || isWeekend) {
    return 'gross';
  }
  
  // Multiple items -> suggest medium size
  if (itemCount > 2) {
    return 'normal';
  }
  
  // Default to normal size (most popular)
  return 'normal';
}

/**
 * Advanced smart suggestions with multi-size integration
 * Uses real product data and intelligent filtering
 */
export function generateAdvancedSmartSuggestions(cartAnalysis: any): {
  haveYouSeen: DynamicSuggestionProduct[];
  didYouForget: DynamicSuggestionProduct[];
} {
  const allSuggestions = generateDynamicSuggestions();
  
  // Filter out items that are already in the cart
  const cartItems = cartAnalysis.cartItems || [];
  const cartProductIds = cartItems.map((item: any) => 
    item.pizzaId?.toString() || item.id?.toString()
  );
  
  // TIRAMISU DEBUG: Log cart filtering process
  console.log('🔍 TIRAMISU DEBUG: Cart filtering process:', {
    cartItemsCount: cartItems.length,
    cartItems: cartItems.map((item: any) => ({ name: item.name, id: item.id, pizzaId: item.pizzaId })),
    cartProductIds: cartProductIds,
    allSuggestionsCount: allSuggestions.length,
    allSuggestionsNames: allSuggestions.map(s => s.name)
  });
  
  const availableSuggestions = allSuggestions.filter(suggestion => {
    const isFiltered = cartProductIds.includes(suggestion.id.toString()) ||
                      cartProductIds.includes(suggestion.pizzaId?.toString());
    
    if (suggestion.name.toLowerCase().includes('tiramisu')) {
      console.log('🍰 TIRAMISU DEBUG: Filtering check for Tiramisu:', {
        suggestionId: suggestion.id,
        suggestionPizzaId: suggestion.pizzaId,
        cartProductIds: cartProductIds,
        isFilteredById: cartProductIds.includes(suggestion.id.toString()),
        isFilteredByPizzaId: cartProductIds.includes(suggestion.pizzaId?.toString()),
        finalResult: isFiltered ? 'FILTERED OUT' : 'KEPT IN SUGGESTIONS'
      });
    }
    
    return !isFiltered;
  });
  
  // TIRAMISU DEBUG: Log final filtering results
  const tiramisuInOriginal = allSuggestions.some(s => s.name.toLowerCase().includes('tiramisu'));
  const tiramisuInFiltered = availableSuggestions.some(s => s.name.toLowerCase().includes('tiramisu'));
  
  console.log('🎯 TIRAMISU DEBUG: Final filtering results:', {
    originalCount: allSuggestions.length,
    filteredCount: availableSuggestions.length,
    itemsRemoved: allSuggestions.length - availableSuggestions.length,
    tiramisuInOriginal,
    tiramisuInFiltered,
    tiramisuCorrectlyFiltered: tiramisuInOriginal && !tiramisuInFiltered
  });
  
  // Convert cart analysis format
  const cartContext = {
    hasBeverage: cartAnalysis.hasBeverage || false,
    hasAppetizer: cartAnalysis.hasAppetizer || false,
    hasDessert: cartAnalysis.hasDessert || false,
    hasPizza: cartAnalysis.hasPizza || false,
    itemCount: cartAnalysis.itemCount || 0,
    totalValue: cartAnalysis.totalValue || 0
  };
  // "Have you seen..." - Popular and trending items (using filtered suggestions)
  const haveYouSeen = filterAdvancedSuggestions(availableSuggestions, cartContext, 'seen');
  
  // "Did you forget..." - Context-aware complementary items (using filtered suggestions)
  const didYouForget = filterAdvancedSuggestions(availableSuggestions, cartContext, 'forgot');

  return {
    haveYouSeen: haveYouSeen.slice(0, 4),
    didYouForget: didYouForget.slice(0, 3)
  };
}

/**
 * Advanced filtering logic for different suggestion contexts
 */
function filterAdvancedSuggestions(
  products: DynamicSuggestionProduct[],
  cartContext: any,
  context: 'seen' | 'forgot'
): DynamicSuggestionProduct[] {
  
  if (context === 'seen') {
    // "Have you seen..." focuses on popular and trending items
    return products
      .filter(product => 
        product.isPopular || 
        product.category === 'pizza' ||
        ['106', '110', 'mock-102'].includes(product.id)
      )
      .sort((a, b) => {
        // Prioritize popular items
        if (a.isPopular && !b.isPopular) return -1;
        if (!a.isPopular && b.isPopular) return 1;
        // Then by category preference
        const categoryOrder = { pizza: 0, beverage: 1, appetizer: 2, dessert: 3 };
        return categoryOrder[a.category] - categoryOrder[b.category];
      });
  }

  if (context === 'forgot') {
    // "Did you forget..." focuses on complementary items
    const suggestions: DynamicSuggestionProduct[] = [];
    
    // If cart has pizza but no beverage, prioritize beverages
    if (cartContext.hasPizza && !cartContext.hasBeverage) {
      suggestions.push(...products.filter(p => p.category === 'beverage'));
    }
    
    // If cart has pizza but no appetizer, suggest appetizers
    if (cartContext.hasPizza && !cartContext.hasAppetizer) {
      suggestions.push(...products.filter(p => p.category === 'appetizer'));
    }
    
    // If cart value > €15 but no dessert, suggest desserts
    if (cartContext.totalValue > 15 && !cartContext.hasDessert) {
      suggestions.push(...products.filter(p => p.category === 'dessert'));
    }
    
    // If empty cart, suggest variety starters
    if (cartContext.itemCount === 0) {
      suggestions.push(...products.filter(p => 
        ['1', 'mock-101', '110'].includes(p.id)
      ));
    }
    
    return suggestions;
  }

  return products;
}

/**
 * Convert dynamic suggestion to cart product format
 * Handles both pizza and non-pizza items with proper typing
 */
export function convertDynamicSuggestionToProduct(suggestion: DynamicSuggestionProduct): any {
  if (suggestion.category === 'pizza' && suggestion.pizzaId) {
    // For real pizzas, use the pizza data
    const germanInfo = getGermanPizzaInfo(suggestion.pizzaId);
    
    return {
      id: suggestion.pizzaId,      name: suggestion.name,
      unitPrice: suggestion.price,
      ingredients: getDefaultIngredientsForPizza(suggestion.pizzaId),
      soldOut: false,
      // Additional pizza data
      size: suggestion.size || 'normal',
      diameter: suggestion.diameter || 32,
      germanInfo,
      // Source tracking
      source: suggestion.source,
      isQuickAdd: true,
      needsSizeSelection: false // Predefined size
    };
  }
  // For non-pizza items
  if (suggestion.source === 'mock-item') {
    // Use original mock item data
    const mockId = parseInt(suggestion.id.replace('mock-', ''));
    const mockItem = mockNonPizzaItems.find(item => item.id === mockId);
    
    if (mockItem) {
      return {
        ...mockItem,
        // Keep the string ID to maintain consistency with filtering
        id: suggestion.id, // Keep 'mock-102' instead of converting to 102
        name: suggestion.name,
        unitPrice: suggestion.price,
        category: suggestion.category,
        emoji: suggestion.emoji,
        source: suggestion.source,
        isQuickAdd: true,
        needsSizeSelection: false
      };
    }
  }

  // For dynamic items, create synthetic product
  return {
    id: suggestion.id,    name: suggestion.name,
    unitPrice: suggestion.price,
    ingredients: [suggestion.description || suggestion.name],
    soldOut: false,
    category: suggestion.category,
    emoji: suggestion.emoji,
    description: suggestion.description,
    source: suggestion.source,
    isQuickAdd: true,
    needsSizeSelection: false
  };
}

/**
 * Get default ingredients for pizza IDs
 */
function getDefaultIngredientsForPizza(pizzaId: number): string[] {
  switch (pizzaId) {
    case 1: // Margherita
      return ['tomato sauce', 'mozzarella', 'fresh basil'];
    case 9: // Pepperoni
      return ['tomato sauce', 'mozzarella', 'spicy pepperoni'];
    default:
      return ['tomato sauce', 'mozzarella'];
  }
}

/**
 * Generate consistent suggestions (deterministic algorithm)
 * Same cart state always produces same suggestions
 */
export function generateConsistentSuggestions(cartAnalysis: any): {
  haveYouSeen: DynamicSuggestionProduct[];
  didYouForget: DynamicSuggestionProduct[];
} {  // Use cart state to determine suggestions consistently
  const suggestions = generateAdvancedSmartSuggestions(cartAnalysis);
  
  // Ensure same cart always shows same suggestions
  return {
    haveYouSeen: suggestions.haveYouSeen.sort((a, b) => a.id.localeCompare(b.id)),
    didYouForget: suggestions.didYouForget.sort((a, b) => a.id.localeCompare(b.id))
  };
}
