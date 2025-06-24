/**
 * Real Campus Restaurant Menu Loader
 * Loads menu data from local JSON files instead of external API
 */

import { getProductType } from '../utils/productDetection';

// Import real menu data from main translation files
import deTranslations from '../i18n/locales/de.json';
import enTranslations from '../i18n/locales/en.json';

export interface RealMenuItem {
  artikelNr: number;
  artikel: string;
  kategorie: string;
  beschreibung: string;
  preis: string | { [size: string]: string };
  zusatzstoffe: string[];
  alergene: string[];
}

export interface TranslationsWithMenu {
  menuData: RealMenuItem[];
  [key: string]: any;
}

export interface ProcessedMenuItem {
  id: number;
  name: string;
  unitPrice: number;
  ingredients: string[];
  soldOut: boolean;
  category?: string;
  description?: string;
  allergens?: string[];
  additives?: string[];
  sizes?: { [size: string]: number };
  needsSizeSelection?: boolean;
  quickAddEnabled?: boolean;
}

/**
 * Load and process real menu data
 */
export async function getMenu(language: 'de' | 'en' = 'de'): Promise<ProcessedMenuItem[]> {  try {
    console.log(`🔄 Loading real Campus Restaurant menu (${language})...`);
    
    // Select appropriate menu based on language
    const translations = language === 'de' ? deTranslations : enTranslations;
    const menuItems = (translations as TranslationsWithMenu).menuData;
    
    console.log(`📋 Processing ${menuItems.length} menu items...`);
    
    // Process each menu item
    const processedItems = menuItems.map(item => processMenuItem(item));
    
    console.log(`✅ Successfully processed ${processedItems.length} menu items`);
    console.log('📊 Categories found:', [...new Set(processedItems.map(item => item.category))]);
    
    return processedItems;
    
  } catch (error) {
    console.error('❌ Failed to load real menu data:', error);
    throw new Error('Failed to load Campus Restaurant menu data');
  }
}

/**
 * Process individual menu item from real data format to app format
 */
function processMenuItem(item: RealMenuItem): ProcessedMenuItem {
  const { artikelNr, artikel, kategorie, beschreibung, preis, zusatzstoffe, alergene } = item;
  
  // Determine if this is a multi-size product (pizza) or single-size (quick add)
  const isMultiSize = typeof preis === 'object';
  
  // Calculate unit price
  let unitPrice: number;
  let sizes: { [size: string]: number } | undefined;
  
  if (isMultiSize) {
    // Multi-size product (pizza) - use smallest size as base price
    const pricesObj = preis as { [size: string]: string };
    sizes = {};
    
    // Parse all sizes and find minimum price
    const parsedPrices = Object.entries(pricesObj).map(([size, price]) => {
      const numPrice = parseGermanPrice(price);
      sizes![size] = numPrice;
      return numPrice;
    });
    
    unitPrice = Math.min(...parsedPrices);
  } else {
    // Single-size product (quick add)
    unitPrice = parseGermanPrice(preis as string);
  }
    // Create product type detection info
  const mockProduct = {
    id: artikelNr,
    name: artikel,
    category: kategorie,
    kategorie: kategorie,
    preis: preis,
    ingredients: [beschreibung]
  };    const productType = getProductType(mockProduct);
  
  // Debug log for pizza products
  if (artikelNr >= 19 && artikelNr <= 25) {
    console.log(`🔧 PROCESSED ${artikelNr} - ${artikel}:`, {
      isMultiSize,
      unitPrice,
      sizes,
      needsSizeSelection: productType.needsSizeSelection,
      quickAddEnabled: productType.quickAddEnabled
    });
  }

  return {
    id: artikelNr,
    name: artikel,
    unitPrice,
    ingredients: [beschreibung],
    soldOut: false,
    category: kategorie,
    description: beschreibung,
    allergens: alergene,
    additives: zusatzstoffe,
    sizes: isMultiSize ? sizes : undefined,
    needsSizeSelection: productType.needsSizeSelection,
    quickAddEnabled: productType.quickAddEnabled
  };
}

/**
 * Parse German price format "7,50 €" to number
 */
function parseGermanPrice(priceStr: string): number {
  return parseFloat(priceStr.replace('€', '').replace(',', '.').trim());
}

/**
 * Get all unique categories from the menu
 */
export function getMenuCategories(language: 'de' | 'en' = 'de'): string[] {
  const translations = language === 'de' ? deTranslations : enTranslations;
  const menuItems = (translations as TranslationsWithMenu).menuData;
  
  const categories = [...new Set(menuItems.map(item => item.kategorie))];
  return categories.sort();
}

/**
 * Get menu statistics
 */
export function getMenuStats(language: 'de' | 'en' = 'de') {
  const translations = language === 'de' ? deTranslations : enTranslations;
  const menuItems = (translations as TranslationsWithMenu).menuData;
  
  const categories = getMenuCategories(language);
  const quickAddItems = menuItems.filter(item => typeof item.preis === 'string');
  const multiSizeItems = menuItems.filter(item => typeof item.preis === 'object');
  
  return {
    totalItems: menuItems.length,
    categories: categories.length,
    quickAddItems: quickAddItems.length,
    multiSizeItems: multiSizeItems.length,
    categoriesBreakdown: categories.map(cat => ({
      category: cat,
      count: menuItems.filter(item => item.kategorie === cat).length
    }))
  };
}