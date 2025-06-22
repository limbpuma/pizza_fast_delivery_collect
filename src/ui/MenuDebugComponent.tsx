import React, { useEffect, useState } from 'react';
import { getMenu } from '../services/menuLoader';

interface DebugResult {
  success: boolean;
  itemsCount?: number;
  item1?: any;
  item138?: any;
  allergenStats?: any;
  error?: string;
}

const MenuDebugComponent: React.FC = () => {
  const [result, setResult] = useState<DebugResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const testMenu = async () => {
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
        
        setResult({
          success: true,
          itemsCount: menuItems.length,
          item1: item1 ? {
            name: item1.name,
            allergens: item1.allergens,
            additives: item1.additives,
            category: item1.category
          } : null,
          item138: item138 ? {
            name: item138.name,
            allergens: item138.allergens,
            additives: item138.additives,
            category: item138.category
          } : null,
          allergenStats: {
            withAllergens: itemsWithAllergens.length,
            withAdditives: itemsWithAdditives.length,
            total: menuItems.length
          }
        });
        
      } catch (error) {
        console.error('❌ Menu test failed:', error);
        setResult({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      } finally {
        setLoading(false);
      }
    };

    testMenu();
  }, []);

  if (loading) {
    return (
      <div className="fixed top-4 right-4 bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded shadow-lg z-50">
        🔄 Loading menu debug test...
      </div>
    );
  }

  if (!result) return null;

  return (
    <div className="fixed top-4 right-4 bg-white border border-gray-400 text-sm px-4 py-3 rounded shadow-lg z-50 max-w-md">
      <h3 className="font-bold text-lg mb-2">🧪 Menu Debug Results</h3>
      
      {result.success ? (
        <div className="space-y-2">
          <p><strong>✅ Success!</strong> Loaded {result.itemsCount} items</p>
            {result.item1 && (
            <div className="bg-green-50 p-2 rounded">
              <p><strong>Item 1 (Mozzarellasticks):</strong> {result.item1.name}</p>
              <p><strong>Allergens:</strong> {JSON.stringify(result.item1.allergens)} 
                {result.item1.allergens && result.item1.allergens.length > 0 ? 
                  ` ✅ (${result.item1.allergens.length} found)` : ' ❌ (empty)'}
              </p>
              <p><strong>Additives:</strong> {JSON.stringify(result.item1.additives)}
                {result.item1.additives && result.item1.additives.length > 0 ? 
                  ` ✅ (${result.item1.additives.length} found)` : ' ❌ (empty)'}
              </p>
            </div>
          )}
            {result.item138 && (
            <div className="bg-yellow-50 p-2 rounded">
              <p><strong>Item 138 (Fleischgerichte):</strong> {result.item138.name}</p>
              <p><strong>Allergens:</strong> {JSON.stringify(result.item138.allergens)}
                {result.item138.allergens && result.item138.allergens.length > 0 ? 
                  ` ✅ (${result.item138.allergens.length} found)` : ' ❌ (empty - expected)'}
              </p>
              <p><strong>Additives:</strong> {JSON.stringify(result.item138.additives)}
                {result.item138.additives && result.item138.additives.length > 0 ? 
                  ` ✅ (${result.item138.additives.length} found)` : ' ❌ (empty - expected)'}
              </p>
            </div>
          )}
          
          {result.allergenStats && (
            <div className="bg-blue-50 p-2 rounded">
              <p>Items with allergens: {result.allergenStats.withAllergens}</p>
              <p>Items with additives: {result.allergenStats.withAdditives}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="text-red-600">
          <p><strong>❌ Error:</strong> {result.error}</p>
        </div>
      )}
    </div>
  );
};

export default MenuDebugComponent;
