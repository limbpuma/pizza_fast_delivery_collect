// Test file for Phase 2 components
// This file can be used to test the new selection components in isolation

import { useState } from 'react';
import { SizeSelection, SauceSelection, QuantityControls, type PizzaSize, type SauceOption } from './components';

// Mock data for testing
const mockSizes: PizzaSize[] = [
  {
    size: '24',
    diameter: '24cm',
    price: 8.90,
    label: 'Klein (24cm)',
    weight: 200
  },
  {
    size: '30',
    diameter: '30cm',
    price: 12.90,
    label: 'Normal (30cm)',
    weight: 300
  },
  {
    size: '40',
    diameter: '40cm',
    price: 16.90,
    label: 'Groß (40cm)',
    weight: 450
  }
];

const mockSauces: SauceOption[] = [
  {
    id: 'tomato',
    name: 'Tomatensauce',
    price: 0,
    isDefault: true,
    description: 'Klassische Tomatensauce'
  },
  {
    id: 'bbq',
    name: 'BBQ Sauce',
    price: 1.50,
    isPremium: true,
    description: 'Rauchige BBQ-Sauce'
  },
  {
    id: 'garlic',
    name: 'Knoblauchsauce',
    price: 1.00,
    description: 'Cremige Knoblauchsauce'
  },
  {
    id: 'spicy',
    name: 'Scharfe Sauce',
    price: 1.20,
    description: 'Extra scharfe Chilisauce'
  }
];

function Phase2ComponentsTest() {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedSauce, setSelectedSauce] = useState<string>('tomato');
  const [quantity, setQuantity] = useState<number>(1);

  return (
    <div className="max-w-md mx-auto p-6 space-y-8 bg-white">
      <h1 className="text-xl font-bold text-gray-900 mb-6">
        Phase 2 Components Test
      </h1>

      {/* Size Selection Test */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Size Selection Component</h2>
        <SizeSelection
          sizes={mockSizes}
          selectedSize={selectedSize}
          onSizeChange={setSelectedSize}
          required={true}
          showPriceComparison={true}
        />
      </div>

      {/* Sauce Selection Test */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Sauce Selection Component</h2>
        <SauceSelection
          sauces={mockSauces}
          selectedSauce={selectedSauce}
          onSauceChange={setSelectedSauce}
          required={true}
        />
      </div>

      {/* Quantity Controls Test */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Quantity Controls Component</h2>
        <QuantityControls
          quantity={quantity}
          onQuantityChange={setQuantity}
          min={1}
          max={5}
        />
      </div>

      {/* Debug Info */}
      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <h3 className="font-medium mb-2">Current Selection:</h3>
        <p className="text-sm">Size: {selectedSize || 'None'}</p>
        <p className="text-sm">Sauce: {selectedSauce}</p>
        <p className="text-sm">Quantity: {quantity}</p>
      </div>
    </div>
  );
}

export default Phase2ComponentsTest;
