import { ZutatOption } from './types';

// Mock data for 32+ Zutaten with realistic German pizza ingredients
export const mockZutatenData: ZutatOption[] = [
  // Fleisch (Meat) - Popular items
  {
    id: 'salami',
    name: 'Salami',
    price: 1.50,
    category: 'fleisch',
    isPopular: true,
    description: 'Klassische italienische Salami'
  },
  {
    id: 'schinken',
    name: 'Schinken',
    price: 1.80,
    category: 'fleisch',
    isPopular: true,
    description: 'Geräucherter Kochschinken'
  },
  {
    id: 'pepperoni',
    name: 'Pepperoni',
    price: 1.70,
    category: 'fleisch',
    isPopular: true,
    description: 'Scharfe Pepperoni-Wurst'
  },
  {
    id: 'hackfleisch',
    name: 'Hackfleisch',
    price: 2.00,
    category: 'fleisch',
    description: 'Gewürztes Rinderhackfleisch'
  },
  {
    id: 'speck',
    name: 'Speck',
    price: 1.90,
    category: 'fleisch',
    description: 'Knuspriger Bacon'
  },
  {
    id: 'haehnchen',
    name: 'Hähnchen',
    price: 2.20,
    category: 'fleisch',
    description: 'Gegrillte Hähnchenstreifen'
  },

  // Käse (Cheese)
  {
    id: 'mozzarella-extra',
    name: 'Extra Mozzarella',
    price: 1.20,
    category: 'käse',
    isPopular: true,
    isVegetarian: true,
    description: 'Zusätzlicher Mozzarella'
  },
  {
    id: 'gorgonzola',
    name: 'Gorgonzola',
    price: 2.50,
    category: 'käse',
    isVegetarian: true,
    description: 'Cremiger Blauschimmelkäse'
  },
  {
    id: 'parmesan',
    name: 'Parmesan',
    price: 1.80,
    category: 'käse',
    isVegetarian: true,
    description: 'Gereifter Parmesankäse'
  },
  {
    id: 'feta',
    name: 'Feta',
    price: 2.00,
    category: 'käse',
    isVegetarian: true,
    description: 'Griechischer Schafskäse'
  },
  {
    id: 'ricotta',
    name: 'Ricotta',
    price: 1.60,
    category: 'käse',
    isVegetarian: true,
    description: 'Frischer italienischer Ricotta'
  },

  // Gemüse (Vegetables) - Popular items
  {
    id: 'pilze',
    name: 'Champignons',
    price: 1.00,
    category: 'gemüse',
    isPopular: true,
    isVegan: true,
    isVegetarian: true,
    description: 'Frische Champignons'
  },
  {
    id: 'paprika',
    name: 'Paprika',
    price: 1.20,
    category: 'gemüse',
    isVegan: true,
    isVegetarian: true,
    description: 'Bunte Paprikastreifen'
  },
  {
    id: 'zwiebeln',
    name: 'Zwiebeln',
    price: 0.80,
    category: 'gemüse',
    isVegan: true,
    isVegetarian: true,
    description: 'Rote Zwiebeln'
  },
  {
    id: 'tomaten',
    name: 'Cocktailtomaten',
    price: 1.30,
    category: 'gemüse',
    isVegan: true,
    isVegetarian: true,
    description: 'Frische Cocktailtomaten'
  },
  {
    id: 'oliven-schwarz',
    name: 'Schwarze Oliven',
    price: 1.40,
    category: 'gemüse',
    isVegan: true,
    isVegetarian: true,
    description: 'Mediterrane schwarze Oliven'
  },
  {
    id: 'oliven-gruen',
    name: 'Grüne Oliven',
    price: 1.40,
    category: 'gemüse',
    isVegan: true,
    isVegetarian: true,
    description: 'Grüne Oliven mit Kräutern'
  },
  {
    id: 'spinat',
    name: 'Spinat',
    price: 1.50,
    category: 'gemüse',
    isVegan: true,
    isVegetarian: true,
    description: 'Frischer Blattspinat'
  },
  {
    id: 'artischocken',
    name: 'Artischocken',
    price: 2.20,
    category: 'gemüse',
    isVegan: true,
    isVegetarian: true,
    description: 'Eingelegte Artischockenherzen'
  },
  {
    id: 'rucula',
    name: 'Rucola',
    price: 1.80,
    category: 'gemüse',
    isVegan: true,
    isVegetarian: true,
    description: 'Frischer Rucola'
  },
  {
    id: 'zucchini',
    name: 'Zucchini',
    price: 1.60,
    category: 'gemüse',
    isVegan: true,
    isVegetarian: true,
    description: 'Gegrillte Zucchini'
  },

  // Meeresfrüchte (Seafood)
  {
    id: 'thunfisch',
    name: 'Thunfisch',
    price: 2.80,
    category: 'meeresfrüchte',
    description: 'Thunfisch in Olivenöl'
  },
  {
    id: 'garnelen',
    name: 'Garnelen',
    price: 3.50,
    category: 'meeresfrüchte',
    description: 'Frische Garnelen'
  },
  {
    id: 'anchovis',
    name: 'Anchovis',
    price: 2.20,
    category: 'meeresfrüchte',
    description: 'Salzige Anchovis-Filets'
  },
  {
    id: 'muscheln',
    name: 'Muscheln',
    price: 3.20,
    category: 'meeresfrüchte',
    description: 'Frische Miesmuscheln'
  },

  // Gewürze & Kräuter (Spices & Herbs)
  {
    id: 'oregano',
    name: 'Oregano',
    price: 0.50,
    category: 'gewürze',
    isVegan: true,
    isVegetarian: true,
    description: 'Italienischer Oregano'
  },
  {
    id: 'basilikum',
    name: 'Basilikum',
    price: 1.00,
    category: 'gewürze',
    isVegan: true,
    isVegetarian: true,
    description: 'Frisches Basilikum'
  },
  {
    id: 'knoblauch',
    name: 'Knoblauch',
    price: 0.80,
    category: 'gewürze',
    isVegan: true,
    isVegetarian: true,
    description: 'Frischer Knoblauch'
  },
  {
    id: 'chili',
    name: 'Chili',
    price: 0.60,
    category: 'gewürze',
    isVegan: true,
    isVegetarian: true,
    description: 'Scharfe Chilischoten'
  },
  {
    id: 'rosmarin',
    name: 'Rosmarin',
    price: 0.70,
    category: 'gewürze',
    isVegan: true,
    isVegetarian: true,
    description: 'Frischer Rosmarin'
  },

  // Extra Saucen
  {
    id: 'sauce-pesto',
    name: 'Pesto',
    price: 1.50,
    category: 'saucen',
    isVegetarian: true,
    description: 'Basilikum-Pesto'
  },
  {
    id: 'sauce-hollandaise',
    name: 'Sauce Hollandaise',
    price: 1.80,
    category: 'saucen',
    isVegetarian: true,
    description: 'Cremige Hollandaise'
  },

  // Premium & Vegan
  {
    id: 'trueffel',
    name: 'Trüffel',
    price: 8.00,
    category: 'premium',
    isVegetarian: true,
    description: 'Schwarze Trüffel (saisonal)'
  },
  {
    id: 'bueffelmozzarella',
    name: 'Büffelmozzarella',
    price: 3.50,
    category: 'premium',
    isVegetarian: true,
    description: 'Original italienischer Büffelmozzarella'
  },
  {
    id: 'vegan-cheese',
    name: 'Veganer Käse',
    price: 2.50,
    category: 'vegan',
    isVegan: true,
    isVegetarian: true,
    description: 'Pflanzlicher Käseersatz'
  },
  {
    id: 'vegan-salami',
    name: 'Vegane Salami',
    price: 2.80,
    category: 'vegan',
    isVegan: true,
    isVegetarian: true,
    description: 'Pflanzliche Salamialternative'
  }
];

// Helper function to get popular ingredients (for preview)
export const getPopularZutaten = (maxItems: number = 3): ZutatOption[] => {
  return mockZutatenData
    .filter(zutat => zutat.isPopular)
    .slice(0, maxItems);
};

// Helper function to categorize ingredients
export const categorizeZutaten = (zutaten: ZutatOption[]): Record<string, ZutatOption[]> => {
  return zutaten.reduce((acc, zutat) => {
    if (!acc[zutat.category]) {
      acc[zutat.category] = [];
    }
    acc[zutat.category].push(zutat);
    return acc;
  }, {} as Record<string, ZutatOption[]>);
};

// Category labels in German
export const categoryLabels: Record<string, string> = {
  fleisch: 'Fleisch & Wurst',
  käse: 'Käse',
  gemüse: 'Gemüse & Oliven',
  meeresfrüchte: 'Meeresfrüchte',
  gewürze: 'Gewürze & Kräuter',
  saucen: 'Extra Saucen',
  premium: 'Premium Zutaten',
  vegan: 'Vegane Alternativen'
};
