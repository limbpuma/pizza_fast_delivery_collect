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

  // Add dynamic beverages that complement pizza
  suggestions.push(
    {
      id: 'beer-estrella-galicia',
      name: 'Beer Estrella Galicia 0,33l',
      price: 3.20,
      category: 'beverage',
      emoji: '🍺',
      source: 'dynamic',
      isPopular: true,
      description: 'Premium Spanish beer, perfect with pizza'
    },
    {
      id: 'orange-juice-fresh',
      name: 'Fresh Orange Juice 0,5l',
      price: 3.90,
      category: 'beverage',
      emoji: '🍊',
      source: 'dynamic',
      description: 'Freshly squeezed orange juice'
    },
    {
      id: 'espresso-double',
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
      id: 'stuffed-pizza-buns-gouda',
      name: 'Stuffed Pizza Buns with Gouda (6 pieces)',
      price: 6.00,
      category: 'appetizer',
      emoji: '🧀',
      source: 'dynamic',
      isPopular: true,
      description: 'Crispy buns filled with melted Gouda cheese'
    },
    {
      id: 'buffalo-wings-6pc',
      name: 'Buffalo Wings (6 pieces)',
      price: 7.90,
      category: 'appetizer',
      emoji: '🍗',
      source: 'dynamic',
      isPopular: true,
      description: 'Spicy chicken wings with buffalo sauce'
    },
    {
      id: 'mozzarella-sticks-6pc',
      name: 'Mozzarella Sticks (6 pieces)',
      price: 6.90,
      category: 'appetizer',
      emoji: '🧄',
      source: 'dynamic',
      description: 'Crispy breaded mozzarella with marinara dip'
    },
    {
      id: 'focaccia-rosemary',
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
      id: 'gelato-3-scoops',
      name: 'Gelato (3 scoops)',
      price: 4.90,
      category: 'dessert',
      emoji: '🍨',
      source: 'dynamic',
      description: 'Vanilla, chocolate & strawberry Italian gelato'
    },
    {
      id: 'chocolate-brownie',
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
        id: `pizza-${pizzaId}-normal`,
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
  
  // Convert cart analysis format
  const cartContext = {
    hasBeverage: cartAnalysis.hasBeverage || false,
    hasAppetizer: cartAnalysis.hasAppetizer || false,
    hasDessert: cartAnalysis.hasDessert || false,
    hasPizza: cartAnalysis.hasPizza || false,
    itemCount: cartAnalysis.itemCount || 0,
    totalValue: cartAnalysis.totalValue || 0
  };

  // "Have you seen..." - Popular and trending items
  const haveYouSeen = filterAdvancedSuggestions(allSuggestions, cartContext, 'seen');
  
  // "Did you forget..." - Context-aware complementary items
  const didYouForget = filterAdvancedSuggestions(allSuggestions, cartContext, 'forgot');

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
        ['beer-estrella-galicia', 'buffalo-wings-6pc', 'mock-102'].includes(product.id)
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
        ['pizza-1-normal', 'mock-101', 'buffalo-wings-6pc'].includes(p.id)
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
      id: suggestion.pizzaId,
      name: suggestion.name,
      unitPrice: suggestion.price,
      ingredients: getDefaultIngredientsForPizza(suggestion.pizzaId),
      soldOut: false,
      imageUrl: `https://images.unsplash.com/photo-pizza-${suggestion.pizzaId}?w=400`,
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
        // Override with suggestion data
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
    id: suggestion.id,
    name: suggestion.name,
    unitPrice: suggestion.price,
    ingredients: [suggestion.description || suggestion.name],
    soldOut: false,
    imageUrl: `https://images.unsplash.com/photo-${suggestion.category}?w=400`,
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
