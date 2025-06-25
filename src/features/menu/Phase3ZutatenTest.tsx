// Test file for Phase 3 - Zutaten System
// This file can be used to test the new zutaten components in isolation

import { useState } from 'react';
import { 
  ZutatenPreview, 
  ZutatenExpanded, 
  ZutatenCategory,
  mockZutatenData,
  categorizeZutaten,
  getPopularZutaten,
  type ZutatenSelection 
} from './components/zutaten';

function Phase3ZutatenTest() {
  const [selectedZutaten, setSelectedZutaten] = useState<ZutatenSelection>({});
  const [showExpanded, setShowExpanded] = useState(false);

  const handleZutatenChange = (zutatId: string, selected: boolean) => {
    setSelectedZutaten(prev => ({
      ...prev,
      [zutatId]: selected
    }));
  };

  const selectedCount = Object.values(selectedZutaten).filter(Boolean).length;
  const totalPrice = mockZutatenData
    .filter(zutat => selectedZutaten[zutat.id])
    .reduce((sum, zutat) => sum + zutat.price, 0);

  const categorizedData = categorizeZutaten(mockZutatenData);
  const popularZutaten = getPopularZutaten(3);

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8 bg-white">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Phase 3 - Zutaten System Test
      </h1>

      {/* Current Selection Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium mb-2">Current Selection:</h3>
        <p className="text-sm">Selected: {selectedCount} ingredients</p>
        <p className="text-sm">Total Price: +{totalPrice.toFixed(2)}€</p>
        {selectedCount > 0 && (
          <div className="mt-2">
            <p className="text-sm font-medium">Selected ingredients:</p>
            <ul className="text-xs text-gray-600 mt-1">
              {mockZutatenData
                .filter(zutat => selectedZutaten[zutat.id])
                .map(zutat => (
                  <li key={zutat.id}>
                    {zutat.name} (+{zutat.price.toFixed(2)}€)
                  </li>
                ))}
            </ul>
          </div>
        )}
      </div>

      {/* Component Toggle */}
      <div className="flex gap-4">
        <button
          onClick={() => setShowExpanded(false)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            !showExpanded 
              ? 'bg-orange-500 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Preview Mode
        </button>
        <button
          onClick={() => setShowExpanded(true)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            showExpanded 
              ? 'bg-orange-500 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Expanded Mode
        </button>
      </div>

      {/* Main Component */}
      <div className="border border-gray-200 rounded-lg p-6">
        {showExpanded ? (
          <ZutatenExpanded
            availableZutaten={mockZutatenData}
            selectedZutaten={selectedZutaten}
            onZutatenChange={handleZutatenChange}
            onShowLess={() => setShowExpanded(false)}
            searchable={true}
          />
        ) : (
          <ZutatenPreview
            availableZutaten={mockZutatenData}
            selectedZutaten={selectedZutaten}
            onZutatenChange={handleZutatenChange}
            onShowMore={() => setShowExpanded(true)}
            maxPreviewItems={3}
          />
        )}
      </div>

      {/* Individual Category Test */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Individual Category Components:</h2>
        
        {/* Popular Items Category */}
        <ZutatenCategory
          category={{
            category: 'gemüse',
            label: 'Popular Test Items',
            items: popularZutaten,
            isExpanded: true
          }}
          selectedZutaten={selectedZutaten}
          onZutatenChange={handleZutatenChange}
          isCollapsible={true}
        />

        {/* Meat Category */}
        {categorizedData.fleisch && (
          <ZutatenCategory
            category={{
              category: 'fleisch',
              label: 'Fleisch & Wurst',
              items: categorizedData.fleisch,
              isExpanded: false
            }}
            selectedZutaten={selectedZutaten}
            onZutatenChange={handleZutatenChange}
            isCollapsible={true}
          />
        )}
      </div>

      {/* Statistics */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-medium mb-2">System Statistics:</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p>Total Ingredients: {mockZutatenData.length}</p>
            <p>Categories: {Object.keys(categorizedData).length}</p>
            <p>Popular Items: {popularZutaten.length}</p>
          </div>
          <div>
            <p>Selected: {selectedCount}</p>
            <p>Total Extra Cost: +{totalPrice.toFixed(2)}€</p>
            <p>Vegan Options: {mockZutatenData.filter(z => z.isVegan).length}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <button
          onClick={() => setSelectedZutaten({})}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          Clear All
        </button>
        <button
          onClick={() => {
            const allPopular: { [key: string]: boolean } = {};
            popularZutaten.forEach(zutat => {
              allPopular[zutat.id] = true;
            });
            setSelectedZutaten(allPopular);
          }}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          Select Popular
        </button>
      </div>
    </div>
  );
}

export default Phase3ZutatenTest;
