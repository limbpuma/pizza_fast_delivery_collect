// Product type detection and Quick Add logic
export interface ProductType {
  needsSizeSelection: boolean;
  category: 'pizza' | 'beverage' | 'dessert' | 'appetizer' | 'other';
  quickAddEnabled: boolean;
}

// Keywords that indicate quick add products
const QUICK_ADD_KEYWORDS = [
  'coca',
  'pepsi',
  'water',
  'beer',
  'wine',
  'tiramisu',
  'gelato',
  'bruschetta',
  'garlic bread',
  'salad',
  'wings',
  'nuggets'
];

/**
 * Determines if a product needs size selection or can use quick add
 */
export function getProductType(product: any): ProductType {
  const name = product.name?.toLowerCase() || '';
  const ingredients = Array.isArray(product.ingredients) 
    ? product.ingredients.join(' ').toLowerCase() 
    : '';
  
  const searchText = `${name} ${ingredients}`;
  
  // Check if it's explicitly a quick-add product (beverages, desserts, etc.)
  const isQuickAdd = QUICK_ADD_KEYWORDS.some(keyword => 
    searchText.includes(keyword)
  );
  
  // If it's explicitly a quick-add product, return early
  if (isQuickAdd) {
    let category: ProductType['category'] = 'other';
    
    if (searchText.includes('coca') || searchText.includes('water') || searchText.includes('beer') || searchText.includes('pepsi')) {
      category = 'beverage';
    } else if (searchText.includes('tiramisu') || searchText.includes('gelato') || searchText.includes('dessert')) {
      category = 'dessert';
    } else if (searchText.includes('bruschetta') || searchText.includes('garlic') || searchText.includes('wings') || searchText.includes('salad')) {
      category = 'appetizer';
    }
    
    return {
      needsSizeSelection: false,
      category,
      quickAddEnabled: true
    };
  }
  
  // For all other products (including all pizzas from the restaurant menu),
  // require size selection by default
  let category: ProductType['category'] = 'pizza'; // Default to pizza for restaurant items
  
  // Only override category if we have specific indicators
  if (searchText.includes('calzone')) {
    category = 'pizza';
  }
  
  return {
    needsSizeSelection: true,
    category,
    quickAddEnabled: false
  };
}

/**
 * Quick add item directly to cart without modal
 */
export function createQuickAddItem(product: any) {
  return {
    pizzaId: product.id,
    name: product.name,
    quantity: 1,
    unitPrice: product.unitPrice,
    totalPrice: product.unitPrice,
    size: 'standard', // Default size for non-pizza items
    isQuickAdd: true
  };
}
