/**
 * Debug script to test menu data loading
 */
import { getMenu } from './services/menuLoader';

export async function testMenuData() {
  try {
    console.log('🧪 Starting menu data test...');
    
    const menuItems = await getMenu('de');
    
    console.log(`📊 Total items loaded: ${menuItems.length}`);
    
    // Test specific items
    const item1 = menuItems.find(item => item.id === 1);
    const item138 = menuItems.find(item => item.id === 138);
    
    if (item1) {
      console.log('🔍 Item 1 (Mozzarellasticks):', {
        name: item1.name,
        allergens: item1.allergens,
        additives: item1.additives,
        category: item1.category
      });
    }
    
    if (item138) {
      console.log('🔍 Item 138 (Fleischgerichte Angebot):', {
        name: item138.name,
        allergens: item138.allergens,
        additives: item138.additives,
        category: item138.category
      });
    }
    
    // Count items with allergens/additives
    const itemsWithAllergens = menuItems.filter(item => item.allergens && item.allergens.length > 0);
    const itemsWithAdditives = menuItems.filter(item => item.additives && item.additives.length > 0);
    
    console.log(`🧪 Items with allergens: ${itemsWithAllergens.length}`);
    console.log(`🧪 Items with additives: ${itemsWithAdditives.length}`);
    
    // Show first few items with allergens
    if (itemsWithAllergens.length > 0) {
      console.log('📋 First 3 items with allergens:', 
        itemsWithAllergens.slice(0, 3).map(item => ({
          id: item.id,
          name: item.name,
          allergens: item.allergens
        }))
      );
    }
    
    return { success: true, itemsCount: menuItems.length };
    
  } catch (error) {
    console.error('❌ Menu test failed:', error);
    return { success: false, error };
  }
}

// Auto-run when imported
testMenuData();
