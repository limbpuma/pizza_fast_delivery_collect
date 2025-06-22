/**
 * Test script for Real Menu Migration
 * Validates that the new product detection system works correctly with Campus Restaurant data
 */

import { getMenu, getMenuStats } from '../services/menuLoader';
import { getProductType } from '../utils/productDetection';
import { generateRealMenuSuggestions } from '../utils/realMenuSuggestions';

interface TestResult {
  totalItems: number;
  quickAddItems: number;
  multiSizeItems: number;
  categoriesFound: string[];
  sampleQuickAdd: any[];
  sampleMultiSize: any[];
  suggestionsGenerated: number;
}

/**
 * Run comprehensive test of the real menu migration
 */
export async function testRealMenuMigration(): Promise<TestResult> {
  console.log('🧪 Starting Real Menu Migration Test...');
  console.log('=' .repeat(50));
  
  try {
    // Load real menu data
    console.log('📋 Loading real Campus Restaurant menu...');
    const menuItems = await getMenu('de');
    console.log(`✅ Loaded ${menuItems.length} menu items`);
    
    // Get menu statistics
    const stats = getMenuStats('de');
    console.log('📊 Menu Statistics:', stats);
    
    // Test product type detection
    console.log('\n🔍 Testing product type detection...');
    let quickAddCount = 0;
    let multiSizeCount = 0;
    const quickAddSamples: any[] = [];
    const multiSizeSamples: any[] = [];
    
    menuItems.forEach(item => {
      const productType = getProductType(item);
      
      if (productType.quickAddEnabled && !productType.needsSizeSelection) {
        quickAddCount++;
        if (quickAddSamples.length < 5) {
          quickAddSamples.push({
            id: item.id,
            name: item.name,
            category: item.category,
            price: item.unitPrice,
            productType
          });
        }
      } else if (productType.needsSizeSelection) {
        multiSizeCount++;
        if (multiSizeSamples.length < 5) {
          multiSizeSamples.push({
            id: item.id,
            name: item.name,
            category: item.category,
            price: item.unitPrice,
            sizes: item.sizes,
            productType
          });
        }
      }
    });
    
    console.log(`✅ Quick Add Items: ${quickAddCount}`);
    console.log(`✅ Multi-Size Items: ${multiSizeCount}`);
    
    // Test suggestions generation
    console.log('\n🎯 Testing suggestions generation...');
    const suggestions = await generateRealMenuSuggestions();
    console.log(`✅ Generated ${suggestions.length} suggestions`);
    
    // Log category breakdown
    const categories = [...new Set(menuItems.map(item => item.category))];
    console.log('\n📂 Categories found:', categories);
    
    // Sample Quick Add items
    console.log('\n⚡ Sample Quick Add Items:');
    quickAddSamples.forEach(item => {
      console.log(`  - ${item.name} (${item.category}) - €${item.price.toFixed(2)}`);
    });
    
    // Sample Multi-Size items
    console.log('\n🍕 Sample Multi-Size Items:');
    multiSizeSamples.forEach(item => {
      console.log(`  - ${item.name} (${item.category}) - €${item.price.toFixed(2)}`);
      if (item.sizes) {
        console.log(`    Sizes: ${Object.keys(item.sizes).join(', ')}`);
      }
    });
    
    // Sample Suggestions
    console.log('\n💡 Sample Suggestions:');
    suggestions.slice(0, 5).forEach(suggestion => {
      console.log(`  - ${suggestion.name} (${suggestion.category}) - €${suggestion.price.toFixed(2)} ${suggestion.emoji}`);
    });
    
    console.log('\n' + '=' .repeat(50));
    console.log('✅ Real Menu Migration Test Completed Successfully!');
    
    return {
      totalItems: menuItems.length,
      quickAddItems: quickAddCount,
      multiSizeItems: multiSizeCount,
      categoriesFound: categories,
      sampleQuickAdd: quickAddSamples,
      sampleMultiSize: multiSizeSamples,
      suggestionsGenerated: suggestions.length
    };
    
  } catch (error) {
    console.error('❌ Real Menu Migration Test Failed:', error);
    throw error;
  }
}

/**
 * Run test in browser console
 */
if (typeof window !== 'undefined') {
  // @ts-ignore
  window.testRealMenuMigration = testRealMenuMigration;
  console.log('🧪 Real Menu Migration Test available in console: testRealMenuMigration()');
}
