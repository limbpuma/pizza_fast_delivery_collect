// Product type detection for Real Campus Restaurant Menu
export interface ProductType {
  needsSizeSelection: boolean;
  category: 'pizza' | 'snack' | 'beverage' | 'dessert' | 'salad' | 'bread' | 'pasta' | 'meat' | 'fish' | 'kids' | 'special' | 'other';
  quickAddEnabled: boolean;
}

// Categories that support multiple sizes (Pizza categories)
const MULTI_SIZE_CATEGORIES = [
  'Pizzen Vegetarisch',
  'Pizzen mit Fleisch', 
  'Pizzen mit Fisch'
];

// Categories that are always Quick Add (Single size)
const QUICK_ADD_CATEGORIES = [
  'Snacks',           // ⚡ Always single size
  'Getränke',         // ⚡ Always single size  
  'Salate',           // ⚡ Always single size
  'Desserts',         // ⚡ Always single size
  'Fladenbrot',       // ⚡ Always single size
  'Baguettes',        // ⚡ Always single size
  'Für die Kleinen',  // ⚡ Always single size
  'Tagesangebote'     // ⚡ Always single size
];

// Categories that need individual product analysis
const MIXED_CATEGORIES = [
  'Nudeln',           // 🤔 Some might be single, some multi
  'Vegetarisch',      // 🤔 Some might be single, some multi
  'Fleisch',          // 🤔 Some might be single, some multi
  'Fisch',            // 🤔 Some might be single, some multi
  'Schnitzel'         // 🤔 Probably single size
];

/**
 * Determines product type based on REAL Campus menu data structure
 */
export function getProductType(product: any): ProductType {
  const kategorie = product.kategorie || product.category || '';
  const preis = product.preis || product.price;
  const name = product.artikel || product.name || '';
  
  // Check if price structure indicates multi-size (object with size keys)
  const hasMultipleSizes = typeof preis === 'object' && preis !== null;
  
  // Override: Products with explicit size info are multi-size
  if (product.sizes && Object.keys(product.sizes).length > 1) {
    return {
      needsSizeSelection: true,
      category: mapCategoryToEnum(kategorie),
      quickAddEnabled: false
    };
  }
  
  // Pizza categories - always multi-size by menu design
  if (MULTI_SIZE_CATEGORIES.includes(kategorie)) {
    return {
      needsSizeSelection: true,
      category: 'pizza',
      quickAddEnabled: false
    };
  }
  
  // Quick Add categories - always single size
  if (QUICK_ADD_CATEGORIES.includes(kategorie)) {
    const category = mapCategoryToEnum(kategorie);
    return {
      needsSizeSelection: false,
      category,
      quickAddEnabled: true
    };
  }
  
  // Mixed categories - analyze individual product
  if (MIXED_CATEGORIES.includes(kategorie)) {
    if (hasMultipleSizes) {
      return {
        needsSizeSelection: true,
        category: mapCategoryToEnum(kategorie),
        quickAddEnabled: false
      };
    } else {
      return {
        needsSizeSelection: false,
        category: mapCategoryToEnum(kategorie),
        quickAddEnabled: true
      };
    }
  }
  
  // Legacy fallback for mock data - check keywords in name
  if (!kategorie && name) {
    const lowerName = name.toLowerCase();
    const isKnownQuickAdd = ['coca', 'water', 'tiramisu', 'garlic', 'salad'].some(keyword => 
      lowerName.includes(keyword)
    );
    
    if (isKnownQuickAdd) {
      return {
        needsSizeSelection: false,
        category: 'other',
        quickAddEnabled: true
      };
    }
  }
  
  // Default fallback - analyze price structure
  if (hasMultipleSizes) {
    return {
      needsSizeSelection: true,
      category: 'other',
      quickAddEnabled: false
    };
  } else {
    return {
      needsSizeSelection: false,
      category: 'other',
      quickAddEnabled: true
    };
  }
}

/**
 * Maps German categories to internal enum values
 */
function mapCategoryToEnum(kategorie: string): ProductType['category'] {
  const categoryMap: Record<string, ProductType['category']> = {
    'Snacks': 'snack',
    'Getränke': 'beverage',
    'Salate': 'salad',
    'Desserts': 'dessert',
    'Fladenbrot': 'bread',
    'Baguettes': 'bread',
    'Für die Kleinen': 'kids',
    'Nudeln': 'pasta',
    'Vegetarisch': 'other',
    'Fleisch': 'meat',
    'Fisch': 'fish',
    'Schnitzel': 'meat',
    'Tagesangebote': 'special',
    'Pizzen Vegetarisch': 'pizza',
    'Pizzen mit Fleisch': 'pizza',
    'Pizzen mit Fisch': 'pizza'
  };
  
  return categoryMap[kategorie] || 'other';
}

/**
 * Quick add item creation for real menu products
 */
export function createQuickAddItem(product: any) {
  // Handle both real menu format and processed format
  const id = product.artikelNr || product.id;
  const name = product.artikel || product.name;
  const price = product.preis || product.unitPrice;
  
  // Parse price from German format "7,50 €" to number if it's a string
  const unitPrice = typeof price === 'string' 
    ? parseFloat(price.replace('€', '').replace(',', '.').trim())
    : price;
  
  return {
    pizzaId: id,
    name: name,
    quantity: 1,
    unitPrice,
    totalPrice: unitPrice,
    size: 'standard',
    isQuickAdd: true
  };
}

/**
 * Extract categories for filtering from real menu data
 */
export function extractCategoriesFromMenu(menuData: any[]) {
  const categoriesSet = new Set<string>();
  
  menuData.forEach(item => {
    if (item.kategorie) {
      categoriesSet.add(item.kategorie);
    }
  });
  
  return Array.from(categoriesSet).sort();
}
