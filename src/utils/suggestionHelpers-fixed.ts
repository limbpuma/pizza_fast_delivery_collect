// Cart Suggestions Helper Functions
// Handles conversion between suggestion objects and product format for SmartAddButton compatibility

export interface SuggestionProduct {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: 'beverage' | 'appetizer' | 'dessert' | 'pizza';
  unitPrice: number;
  quickAddEnabled: boolean;
  needsSizeSelection: boolean;
  // Optional fields for pre-configured pizzas
  pizzaId?: number;
  size?: string;
  diameter?: number;
}

// Refined Quick Add products specifically for Cart Suggestions
// Only products that work well with single-click add to cart
export const SUGGESTION_QUICK_ADD_PRODUCTS: SuggestionProduct[] = [
  // Beverages (High Priority - Universal appeal)
  {
    id: 'coca-cola-1l',
    name: 'Coca-Cola 1,0l',
    description: 'Refreshing classic cola',
    price: 3.84,
    category: 'beverage',
    unitPrice: 3.84,
    quickAddEnabled: true,
    needsSizeSelection: false
  },
  {
    id: 'sparkling-water',
    name: 'Sparkling Water 0,5l',
    description: 'Fresh sparkling mineral water',
    price: 2.50,
    category: 'beverage',
    unitPrice: 2.50,
    quickAddEnabled: true,
    needsSizeSelection: false
  },
  {
    id: 'red-bull-energy',
    name: 'Red Bull 0,25l',
    description: 'Energy drink for an extra boost',
    price: 3.49,
    category: 'beverage',
    unitPrice: 3.49,
    quickAddEnabled: true,
    needsSizeSelection: false
  },
  {
    id: 'orange-juice-fresh',
    name: 'Fresh Orange Juice 0,3l',
    description: 'Freshly squeezed orange juice',
    price: 4.20,
    category: 'beverage',
    unitPrice: 4.20,
    quickAddEnabled: true,
    needsSizeSelection: false
  },
  {
    id: 'espresso-double',
    name: 'Espresso Double',
    description: 'Strong Italian coffee for energy boost',
    price: 3.20,
    category: 'beverage',
    unitPrice: 3.20,
    quickAddEnabled: true,
    needsSizeSelection: false
  },
  
  // Appetizers (Perfect complements)
  {
    id: 'garlic-bread-special',
    name: 'Garlic Bread',
    description: 'Crispy bread with garlic butter and herbs',
    price: 4.50,
    category: 'appetizer',
    unitPrice: 4.50,
    quickAddEnabled: true,
    needsSizeSelection: false
  },
  {
    id: 'stuffed-pizza-buns-gouda',
    name: 'Stuffed Pizza Buns with Gouda (6 pieces)',
    description: 'Crispy buns filled with melted Gouda cheese',
    price: 6.00,
    category: 'appetizer',
    unitPrice: 6.00,
    quickAddEnabled: true,
    needsSizeSelection: false
  },
  {
    id: 'buffalo-wings-6pc',
    name: 'Buffalo Wings (6 pieces)',
    description: 'Spicy chicken wings with blue cheese dip',
    price: 7.90,
    category: 'appetizer',
    unitPrice: 7.90,
    quickAddEnabled: true,
    needsSizeSelection: false
  },
  {
    id: 'caesar-salad-regular',
    name: 'Caesar Salad',
    description: 'Fresh romaine lettuce, parmesan, croutons',
    price: 8.90,
    category: 'appetizer',
    unitPrice: 8.90,
    quickAddEnabled: true,
    needsSizeSelection: false
  },
  {
    id: 'mozzarella-sticks-6pc',
    name: 'Mozzarella Sticks (6 pieces)',
    description: 'Crispy breaded mozzarella with marinara dip',
    price: 6.90,
    category: 'appetizer',
    unitPrice: 6.90,
    quickAddEnabled: true,
    needsSizeSelection: false
  },
  {
    id: 'focaccia-rosemary',
    name: 'Rosemary Focaccia',
    description: 'Italian flatbread with rosemary and olive oil',
    price: 5.50,
    category: 'appetizer',
    unitPrice: 5.50,
    quickAddEnabled: true,
    needsSizeSelection: false
  },
  
  // Desserts (Perfect meal completion)
  {
    id: 'tiramisu-classic',
    name: 'Tiramisu',
    description: 'Classic Italian coffee dessert with mascarpone',
    price: 5.50,
    category: 'dessert',
    unitPrice: 5.50,
    quickAddEnabled: true,
    needsSizeSelection: false
  },
  {
    id: 'gelato-3-scoops',
    name: 'Gelato (3 scoops)',
    description: 'Vanilla, chocolate & strawberry Italian gelato',
    price: 4.90,
    category: 'dessert',
    unitPrice: 4.90,
    quickAddEnabled: true,
    needsSizeSelection: false
  },
  {
    id: 'chocolate-brownie',
    name: 'Chocolate Brownie',
    description: 'Warm brownie with vanilla ice cream',
    price: 6.50,
    category: 'dessert',
    unitPrice: 6.50,
    quickAddEnabled: true,
    needsSizeSelection: false
  },

  // Pre-configured Popular Pizzas (Normal size, no extras)
  {
    id: 'pizza-margherita-normal',
    name: 'Pizza Margherita (Normal 32cm)',
    description: 'Classic tomato, mozzarella, basil - Normal size',
    price: 10.50,
    category: 'pizza',
    unitPrice: 10.50,
    quickAddEnabled: true,
    needsSizeSelection: false,
    pizzaId: 1,
    size: 'medium',
    diameter: 32
  },
  {
    id: 'pizza-pepperoni-normal',
    name: 'Pizza Pepperoni (Normal 32cm)',
    description: 'Tomato, mozzarella, spicy pepperoni - Normal size',
    price: 12.90,
    category: 'pizza',
    unitPrice: 12.90,
    quickAddEnabled: true,
    needsSizeSelection: false,
    pizzaId: 3,
    size: 'medium',
    diameter: 32
  }
];

/**
 * Converts a suggestion product to format compatible with SmartAddButton
 * Ensures all required fields are present and properly typed
 * FORCES Quick Add behavior regardless of automatic detection
 */
export function convertSuggestionToProduct(suggestion: SuggestionProduct): any {
  const baseProduct = {
    id: suggestion.id,
    name: suggestion.name,
    unitPrice: suggestion.unitPrice,
    description: suggestion.description,
    category: suggestion.category,
    
    // FORCE Quick Add characteristics for ALL suggestions
    needsSizeSelection: false,
    quickAddEnabled: true,
    
    // Ensure compatibility with SmartAddButton expectations
    ingredients: ['quick-add-suggestion'], // Special marker to force Quick Add detection
    sizes: ['standard'], // Default size for quick add
    
    // Additional fields that may be expected
    price: suggestion.price, // Alias for unitPrice
    image: null, // No images needed for suggestions
    allergens: [], // Empty for simplicity
    
    // Meta flags
    isRecommendation: true,
    source: 'cart-suggestions',
    
    // OVERRIDE: Force Quick Add detection by adding specific keywords
    quickAddOverride: true // Special flag for suggestions
  };

  // For pre-configured pizzas, add pizza-specific fields
  if (suggestion.category === 'pizza' && suggestion.pizzaId) {
    return {
      ...baseProduct,
      pizzaId: suggestion.pizzaId,
      size: suggestion.size || 'medium',
      diameter: suggestion.diameter || 32,
      name: suggestion.name // Already includes size info
    };
  }

  return baseProduct;
}

/**
 * Checks if a suggestion is a Quick Add compatible product
 * All products in SUGGESTION_QUICK_ADD_PRODUCTS should return true
 */
export function isQuickAddSuggestion(suggestion: SuggestionProduct): boolean {
  const quickAddCategories = ['beverage', 'appetizer', 'dessert', 'pizza'];
  return quickAddCategories.includes(suggestion.category) && suggestion.quickAddEnabled;
}

/**
 * Filters suggestions based on what's already in the cart
 * Prevents suggesting items that are already present
 */
export function filterAvailableSuggestions(
  allSuggestions: SuggestionProduct[],
  cartItems: any[]
): SuggestionProduct[] {
  const cartProductIds = cartItems.map(item => item.pizzaId?.toString() || item.id?.toString());
  
  return allSuggestions.filter(suggestion => 
    !cartProductIds.includes(suggestion.id.toString()) &&
    isQuickAddSuggestion(suggestion)
  );
}

/**
 * Smart context matching for cart-aware recommendations
 * Returns true if product makes sense given current cart state
 */
export function matchesCartContext(
  product: SuggestionProduct, 
  cartAnalysis: any
): boolean {
  // Always suggest pizzas predefinidas as popular options
  if (product.category === 'pizza') {
    return true;
  }
  
  // Priority 1: Fill missing beverage
  if (product.category === 'beverage' && !cartAnalysis.hasBeverage) {
    return true;
  }
  
  // Priority 2: Add appetizers for pizza/pasta orders
  if (product.category === 'appetizer' && !cartAnalysis.hasAppetizer) {
    if (cartAnalysis.hasPizza || cartAnalysis.hasPasta) {
      return true;
    }
  }
  
  // Priority 3: Suggest desserts for higher value orders
  if (product.category === 'dessert' && !cartAnalysis.hasDessert) {
    if (cartAnalysis.totalValue > 15) {
      return true;
    }
  }
  
  // Priority 4: Popular appetizers (always show some variety)
  if (product.category === 'appetizer' && ['garlic-bread-special', 'buffalo-wings-6pc'].includes(product.id)) {
    return true;
  }
  
  // Priority 5: Popular beverages (always show some variety)
  if (product.category === 'beverage' && ['coca-cola-1l', 'orange-juice-fresh'].includes(product.id)) {
    return true;
  }
  
  // Priority 6: Weekend specials
  if (cartAnalysis.isWeekend && product.category === 'appetizer') {
    return true;
  }
  
  // Priority 7: Lunch time beverages
  if (cartAnalysis.isLunchTime && product.category === 'beverage') {
    return true;
  }
  
  // Default: Show variety for empty cart
  if (cartAnalysis.itemCount === 0) {
    // Show variety across categories
    return ['beverage', 'appetizer', 'pizza'].includes(product.category);
  }
  
  // Fallback: Show some variety always
  return ['pizza-margherita-normal', 'coca-cola-1l', 'buffalo-wings-6pc'].includes(product.id);
}

/**
 * Get emoji representation for product category
 * Used in CartSuggestions display
 */
export function getSuggestionEmoji(category: string): string {
  const emojis = {
    beverage: '🥤',
    appetizer: '🥖',
    dessert: '🍰',
    pizza: '🍕',
    other: '🍽️'
  };
  
  return emojis[category as keyof typeof emojis] || emojis.other;
}

/**
 * Generate smart suggestions based on cart analysis
 * Replaces the mock data generation in useCartSuggestions
 */
export function generateSmartSuggestions(cartAnalysis: any): {
  haveYouSeen: SuggestionProduct[];
  didYouForget: SuggestionProduct[];
} {
  const availableProducts = filterAvailableSuggestions(
    SUGGESTION_QUICK_ADD_PRODUCTS,
    cartAnalysis.cartItems || []
  );
  
  // "Have you seen..." - Popular items based on context
  const haveYouSeen = availableProducts
    .filter(product => matchesCartContext(product, cartAnalysis))
    .slice(0, 3);
  
  // "Did you forget?" - Essential missing items
  const didYouForget = availableProducts
    .filter(product => {
      // Essential items based on cart gaps
      if (product.category === 'beverage' && !cartAnalysis.hasBeverage) return true;
      if (product.category === 'appetizer' && cartAnalysis.hasPizza && !cartAnalysis.hasAppetizer) return true;
      return false;
    })
    .slice(0, 2);
  
  return { haveYouSeen, didYouForget };
}
