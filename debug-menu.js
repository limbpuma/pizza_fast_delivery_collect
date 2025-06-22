// Debug script to test menu loading
import { getMenu, getMenuStats } from './src/services/menuLoader.ts';

async function testMenuLoading() {
  try {
    console.log('🔍 Testing menu loading...');
    
    // Test German menu
    const germanMenu = await getMenu('de');
    console.log('\n📋 German Menu Sample:');
    console.log('Total items:', germanMenu.length);
    
    if (germanMenu.length > 0) {
      const firstItem = germanMenu[0];
      console.log('\n🍕 First item details:');
      console.log('ID (artikelNr):', firstItem.id);
      console.log('Name (artikel):', firstItem.name);
      console.log('Category (kategorie):', firstItem.category);
      console.log('Description (beschreibung):', firstItem.description);
      console.log('Allergens (alergene):', firstItem.allergens);
      console.log('Additives (zusatzstoffe):', firstItem.additives);
      console.log('Unit Price:', firstItem.unitPrice);
      console.log('Sizes:', firstItem.sizes);
      console.log('Needs Size Selection:', firstItem.needsSizeSelection);
      console.log('Quick Add Enabled:', firstItem.quickAddEnabled);
    }
    
    // Test menu stats
    const stats = getMenuStats('de');
    console.log('\n📊 Menu Statistics:');
    console.log('Total items:', stats.totalItems);
    console.log('Categories:', stats.categories);
    console.log('Quick add items:', stats.quickAddItems);
    console.log('Multi-size items:', stats.multiSizeItems);
    console.log('Categories breakdown:', stats.categoriesBreakdown);
    
  } catch (error) {
    console.error('❌ Error testing menu:', error);
  }
}

testMenuLoading();
