/**
 * Real Menu Suggestions System
 * Generates suggestions based on actual Campus Restaurant menu data
 * Replaces mock data with intelligent real product recommendations
 */

import { getProductType } from './productDetection';
import { getMenu } from '../services/menuLoader';

export interface RealMenuSuggestion {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  quickAddEnabled: boolean;
  needsSizeSelection: boolean;
  source: 'real-menu';
  popularity?: number;
  emoji?: string;
}

/**
 * Generate suggestions from real menu data
 */
export async function generateRealMenuSuggestions(): Promise<RealMenuSuggestion[]> {
  try {
    console.log('🔄 Generating suggestions from real Campus Restaurant menu...');
    
    const realMenu = await getMenu('de');
    const quickAddItems = realMenu.filter(item => {
      const productType = getProductType(item);
      return productType.quickAddEnabled && !productType.needsSizeSelection;
    });
    
    console.log(`✅ Found ${quickAddItems.length} Quick Add items for suggestions`);
    
    // Convert to suggestion format
    const suggestions = quickAddItems.map(item => convertToSuggestion(item));
    
    // Sort by category priority and price
    const sortedSuggestions = suggestions.sort((a, b) => {
      const categoryPriority = getCategoryPriority(a.category) - getCategoryPriority(b.category);
      if (categoryPriority !== 0) return categoryPriority;
      return a.price - b.price; // Cheaper items first within same category
    });
    
    console.log('🎯 Generated suggestions by category:', groupByCategory(sortedSuggestions));
    
    return sortedSuggestions;
    
  } catch (error) {
    console.error('❌ Failed to generate real menu suggestions:', error);
    return [];
  }
}

/**
 * Convert menu item to suggestion format
 */
function convertToSuggestion(item: any): RealMenuSuggestion {
  const productType = getProductType(item);
  
  return {
    id: item.id.toString(),
    name: item.name,
    price: item.unitPrice,
    category: item.category || productType.category,
    description: item.description || `${item.name} - ${item.category}`,
    quickAddEnabled: productType.quickAddEnabled,
    needsSizeSelection: productType.needsSizeSelection,
    source: 'real-menu',
    popularity: calculatePopularity(item),
    emoji: getCategoryEmoji(item.category || productType.category)
  };
}

/**
 * Calculate popularity score for prioritizing suggestions
 */
function calculatePopularity(item: any): number {
  let score = 0;
  
  // Lower price = higher popularity (for quick add items)
  if (item.unitPrice < 5) score += 3;
  else if (item.unitPrice < 8) score += 2;
  else score += 1;
  
  // Category-based popularity
  const categoryBonus: { [key: string]: number } = {
    'Getränke': 3,    // Beverages are very popular
    'Snacks': 2,      // Snacks are popular
    'Desserts': 2,    // Desserts are popular  
    'Salate': 1,      // Salads are moderately popular
    'Baguettes': 1    // Baguettes are moderately popular
  };
  
  score += categoryBonus[item.category] || 0;
  
  // Name-based popularity (common items)
  const name = item.name.toLowerCase();
  if (name.includes('coca') || name.includes('cola')) score += 2;
  if (name.includes('wasser') || name.includes('water')) score += 2;
  if (name.includes('tiramisu')) score += 1;
  if (name.includes('salat') || name.includes('salad')) score += 1;
  
  return score;
}

/**
 * Get category priority for sorting (lower = higher priority)
 */
function getCategoryPriority(category: string): number {
  const priorities: { [key: string]: number } = {
    'Getränke': 1,      // Highest priority
    'Snacks': 2,
    'Desserts': 3,
    'Salate': 4,
    'Baguettes': 5,
    'Fladenbrot': 6,
    'Für die Kleinen': 7,
    'Tagesangebote': 8
  };
  
  return priorities[category] || 9;
}

/**
 * Get emoji for category
 */
function getCategoryEmoji(category: string): string {
  const emojis: { [key: string]: string } = {
    'Getränke': '🥤',
    'Snacks': '🍟',
    'Desserts': '🍰',
    'Salate': '🥗',
    'Baguettes': '🥖',
    'Fladenbrot': '🍞',
    'Für die Kleinen': '👶',
    'Tagesangebote': '⭐'
  };
  
  return emojis[category] || '🍽️';
}

/**
 * Group suggestions by category for analysis
 */
function groupByCategory(suggestions: RealMenuSuggestion[]) {
  return suggestions.reduce((acc, suggestion) => {
    const category = suggestion.category;
    if (!acc[category]) acc[category] = 0;
    acc[category]++;
    return acc;
  }, {} as { [key: string]: number });
}

/**
 * Get smart suggestions based on cart analysis
 */
export function getSmartRealMenuSuggestions(
  allSuggestions: RealMenuSuggestion[], 
  cartAnalysis: any
): {
  haveYouSeen: RealMenuSuggestion[];
  didYouForget: RealMenuSuggestion[];
} {
  // Filter out items already in cart
  const cartItems = cartAnalysis.cartItems || [];
  const cartProductIds = cartItems.map((item: any) => 
    item.pizzaId?.toString() || item.id?.toString()
  );
  
  const availableSuggestions = allSuggestions.filter(suggestion => 
    !cartProductIds.includes(suggestion.id)
  );
  
  // "Have you seen..." - Popular items by category
  const haveYouSeen = availableSuggestions
    .filter(s => (s.popularity || 0) >= 3)
    .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
    .slice(0, 3);
  
  // "Did you forget..." - Essential complementary items
  const didYouForget = availableSuggestions
    .filter(suggestion => {
      // Suggest beverages if none in cart
      if (suggestion.category === 'Getränke' && !cartAnalysis.hasBeverage) return true;
      
      // Suggest desserts if pizza but no dessert
      if (suggestion.category === 'Desserts' && cartAnalysis.hasPizza && !cartAnalysis.hasDessert) return true;
      
      // Suggest snacks if main course but no appetizer
      if (suggestion.category === 'Snacks' && cartAnalysis.hasPizza && !cartAnalysis.hasAppetizer) return true;
      
      return false;
    })
    .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
    .slice(0, 3);
  
  return { haveYouSeen, didYouForget };
}

/**
 * Cache for menu suggestions to avoid repeated processing
 */
let cachedSuggestions: RealMenuSuggestion[] | null = null;

/**
 * Get cached suggestions or generate new ones
 */
export async function getCachedRealMenuSuggestions(): Promise<RealMenuSuggestion[]> {
  if (!cachedSuggestions) {
    console.log('🔄 Generating and caching real menu suggestions...');
    cachedSuggestions = await generateRealMenuSuggestions();
    console.log(`✅ Cached ${cachedSuggestions.length} real menu suggestions`);
  }
  
  return cachedSuggestions;
}

/**
 * Clear suggestions cache (useful for testing or menu updates)
 */
export function clearSuggestionsCache(): void {
  cachedSuggestions = null;
  console.log('🗑️ Cleared real menu suggestions cache');
}