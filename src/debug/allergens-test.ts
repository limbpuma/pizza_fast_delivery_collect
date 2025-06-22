import { getMenu } from '../services/menuLoader';

// Test allergens and additives display
async function testAllergensAndAdditives() {
  try {
    console.log('🧪 Testing allergens and additives...');
    
    const menuItems = await getMenu('de');
    console.log(`📋 Loaded ${menuItems.length} items`);
    
    // Test specific items
    const item1 = menuItems.find(item => item.id === 1); // Mozzarellasticks
    const item11 = menuItems.find(item => item.id === 11); // gefüllte pizzabrötchen
    
    console.log('🔍 Item 1 (Mozzarellasticks):');
    console.log('  - Allergens:', item1?.allergens);
    console.log('  - Additives:', item1?.additives);
    
    console.log('🔍 Item 11 (gefüllte pizzabrötchen):');
    console.log('  - Allergens:', item11?.allergens);
    console.log('  - Additives:', item11?.additives);
    
    // Count items with allergens/additives
    const withAllergens = menuItems.filter(item => item.allergens && item.allergens.length > 0);
    const withAdditives = menuItems.filter(item => item.additives && item.additives.length > 0);
    
    console.log(`📊 Items with allergens: ${withAllergens.length}`);
    console.log(`📊 Items with additives: ${withAdditives.length}`);
    
    console.log('✅ Test completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Auto-run the test
testAllergensAndAdditives();
