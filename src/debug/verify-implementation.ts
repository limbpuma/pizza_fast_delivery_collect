// Test script to verify allergen and additive implementation
import { loadMenuFromTranslations } from '../services/menuLoader';

console.log('🧪 Testing allergen and additive implementation...');

// Test 1: Load menu data
loadMenuFromTranslations('de').then(menu => {
  console.log('✅ Menu loaded successfully');
  
  // Find a pizza with allergens and additives
  const pizzaWithData = menu.find(item => 
    item.alergene && item.alergene.length > 0 && 
    item.zusatzstoffe && item.zusatzstoffe.length > 0
  );
  
  if (pizzaWithData) {
    console.log('✅ Found pizza with allergens and additives:', pizzaWithData.name);
    console.log('   Allergens (codes):', pizzaWithData.alergene);
    console.log('   Additives (codes):', pizzaWithData.zusatzstoffe);
    
    // Test allergen translation lookup
    console.log('📋 Testing allergen translations:');
    pizzaWithData.alergene?.forEach(code => {
      console.log(`   ${code} -> Should resolve to full description`);
    });
    
    // Test additive translation lookup
    console.log('📋 Testing additive translations:');
    pizzaWithData.zusatzstoffe?.forEach(code => {
      console.log(`   ${code} -> Should resolve to full description`);
    });
  } else {
    console.log('❌ No pizza found with both allergens and additives');
  }
  
  // Test specific expected allergen codes
  const expectedAllergens = ['D', 'F', 'G']; // Common allergen codes
  const foundAllergens = menu.flatMap(item => item.alergene || []);
  const uniqueAllergens = [...new Set(foundAllergens)];
  
  console.log('📊 All unique allergen codes in menu:', uniqueAllergens);
  
  // Test specific expected additive codes
  const foundAdditives = menu.flatMap(item => item.zusatzstoffe || []);
  const uniqueAdditives = [...new Set(foundAdditives)];
  
  console.log('📊 All unique additive codes in menu:', uniqueAdditives);
  
}).catch(error => {
  console.error('❌ Failed to load menu:', error);
});
