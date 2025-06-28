// Real Zutaten (Ingredients) Data based on Campus Pizza Menu
import { ZutatOption } from './types';

export const realZutatenData: ZutatOption[] = [
  // 🧀 KÄSE (Cheese)
  {
    id: 'mozzarella',
    name: 'Mozzarella',
    price: 0.50,
    category: 'käse',
    isPopular: true,
    isVegetarian: true,
    description: 'Extra Mozzarella Käse',
    allergens: ['Milch'],
    nutritionalInfo: {
      calories: 280,
      protein: 22,
      fat: 17,
      carbs: 3
    }
  },
  {
    id: 'käse',
    name: 'Käse',
    price: 1.00,
    category: 'käse',
    isVegetarian: true,
    description: 'Extra Käse',
    allergens: ['Milch'],
    nutritionalInfo: {
      calories: 300,
      protein: 24,
      fat: 20,
      carbs: 2
    }
  },
  {
    id: 'schafskäse',
    name: 'Schafskäse',
    price: 0.50,
    category: 'käse',
    isVegetarian: true,
    description: 'Cremiger Schafskäse',
    allergens: ['Milch'],
    nutritionalInfo: {
      calories: 265,
      protein: 14,
      fat: 21,
      carbs: 4
    }
  },

  // 🥩 FLEISCH (Meat)
  {
    id: 'salami',
    name: 'Salami',
    price: 0.50,
    category: 'fleisch',
    isPopular: true,
    description: 'Würzige italienische Salami',
    allergens: [],
    nutritionalInfo: {
      calories: 336,
      protein: 19,
      fat: 28,
      carbs: 1
    }
  },
  {
    id: 'vorderschinken',
    name: 'Vorderschinken, gekocht',
    price: 0.50,
    category: 'fleisch',
    isPopular: true,
    description: 'Zarter gekochter Vorderschinken',
    allergens: [],
    nutritionalInfo: {
      calories: 145,
      protein: 21,
      fat: 6,
      carbs: 0
    }
  },
  {
    id: 'hähnchenfleisch',
    name: 'Hähnchenfleisch',
    price: 0.50,
    category: 'fleisch',
    description: 'Zartes gegrilltes Hähnchenfleisch',
    allergens: [],
    nutritionalInfo: {
      calories: 165,
      protein: 31,
      fat: 4,
      carbs: 0
    }
  },
  {
    id: 'gyros',
    name: 'Gyros',
    price: 0.50,
    category: 'fleisch',
    description: 'Würziges griechisches Gyrosfleisch',
    allergens: [],
    nutritionalInfo: {
      calories: 190,
      protein: 26,
      fat: 8,
      carbs: 2
    }
  },
  {
    id: 'hackfleisch',
    name: 'Hackfleisch',
    price: 0.50,
    category: 'fleisch',
    description: 'Gewürztes Rinderhackfleisch',
    allergens: [],
    nutritionalInfo: {
      calories: 254,
      protein: 26,
      fat: 15,
      carbs: 0
    }
  },

  // 🦐 MEERESFRÜCHTE (Seafood)
  {
    id: 'thunfisch',
    name: 'Thunfisch',
    price: 0.50,
    category: 'meeresfrüchte',
    isPopular: true,
    description: 'Hochwertiger Thunfisch',
    allergens: ['Fisch'],
    nutritionalInfo: {
      calories: 132,
      protein: 28,
      fat: 1,
      carbs: 0
    }
  },
  {
    id: 'krabben',
    name: 'Krabben',
    price: 1.00,
    category: 'meeresfrüchte',
    description: 'Frische Nordseekrabben',
    allergens: ['Krebstiere'],
    nutritionalInfo: {
      calories: 97,
      protein: 18,
      fat: 1,
      carbs: 1
    }
  },
  {
    id: 'calamaris',
    name: 'Calamaris',
    price: 0.50,
    category: 'meeresfrüchte',
    description: 'Zarte Tintenfischringe',
    allergens: ['Weichtiere'],
    nutritionalInfo: {
      calories: 175,
      protein: 15,
      fat: 7,
      carbs: 8
    }
  },
  {
    id: 'muscheln',
    name: 'Muscheln',
    price: 0.50,
    category: 'meeresfrüchte',
    description: 'Frische Miesmuscheln',
    allergens: ['Weichtiere'],
    nutritionalInfo: {
      calories: 86,
      protein: 12,
      fat: 2,
      carbs: 4
    }
  },
  {
    id: 'sardellen',
    name: 'Sardellen',
    price: 0.50,
    category: 'meeresfrüchte',
    description: 'Mediterrane Sardellen',
    allergens: ['Fisch'],
    nutritionalInfo: {
      calories: 131,
      protein: 20,
      fat: 5,
      carbs: 0
    }
  },

  // 🥬 GEMÜSE (Vegetables)
  {
    id: 'paprika',
    name: 'Paprika',
    price: 0.50,
    category: 'gemüse',
    isPopular: true,
    isVegan: true,
    isVegetarian: true,
    description: 'Frische bunte Paprikastreifen',
    allergens: [],
    nutritionalInfo: {
      calories: 31,
      protein: 1,
      fat: 0,
      carbs: 7
    }
  },
  {
    id: 'zwiebeln',
    name: 'Zwiebeln',
    price: 0.50,
    category: 'gemüse',
    isPopular: true,
    isVegan: true,
    isVegetarian: true,
    description: 'Frische rote Zwiebeln',
    allergens: [],
    nutritionalInfo: {
      calories: 40,
      protein: 1,
      fat: 0,
      carbs: 9
    }
  },
  {
    id: 'champignons',
    name: 'Champignons, frisch',
    price: 0.50,
    category: 'gemüse',
    isPopular: true,
    isVegan: true,
    isVegetarian: true,
    description: 'Frische weiße Champignons',
    allergens: [],
    nutritionalInfo: {
      calories: 22,
      protein: 3,
      fat: 0,
      carbs: 3
    }
  },
  {
    id: 'tomaten',
    name: 'Tomaten, frisch',
    price: 0.50,
    category: 'gemüse',
    isVegan: true,
    isVegetarian: true,
    description: 'Saftige Cherrytomaten',
    allergens: [],
    nutritionalInfo: {
      calories: 18,
      protein: 1,
      fat: 0,
      carbs: 4
    }
  },
  {
    id: 'spinat',
    name: 'Spinat',
    price: 0.50,
    category: 'gemüse',
    isVegan: true,
    isVegetarian: true,
    description: 'Frischer Blattspinat',
    allergens: [],
    nutritionalInfo: {
      calories: 23,
      protein: 3,
      fat: 0,
      carbs: 4
    }
  },
  {
    id: 'zucchini',
    name: 'Zucchini',
    price: 0.50,
    category: 'gemüse',
    isVegan: true,
    isVegetarian: true,
    description: 'Gegrillte Zucchinischeiben',
    allergens: [],
    nutritionalInfo: {
      calories: 17,
      protein: 1,
      fat: 0,
      carbs: 3
    }
  },
  {
    id: 'broccoli',
    name: 'Broccoli',
    price: 0.50,
    category: 'gemüse',
    isVegan: true,
    isVegetarian: true,
    description: 'Frische Broccoliröschen',
    allergens: [],
    nutritionalInfo: {
      calories: 34,
      protein: 3,
      fat: 0,
      carbs: 7
    }
  },
  {
    id: 'spargel',
    name: 'Spargel',
    price: 0.50,
    category: 'gemüse',
    isVegan: true,
    isVegetarian: true,
    description: 'Zarter grüner Spargel',
    allergens: [],
    nutritionalInfo: {
      calories: 20,
      protein: 2,
      fat: 0,
      carbs: 4
    }
  },
  {
    id: 'mais',
    name: 'Mais',
    price: 0.50,
    category: 'gemüse',
    isVegan: true,
    isVegetarian: true,
    description: 'Süße Maiskörner',
    allergens: [],
    nutritionalInfo: {
      calories: 86,
      protein: 3,
      fat: 1,
      carbs: 19
    }
  },
  {
    id: 'ananas',
    name: 'Ananas',
    price: 0.50,
    category: 'gemüse',
    isVegan: true,
    isVegetarian: true,
    description: 'Süße Ananasscheiben',
    allergens: [],
    nutritionalInfo: {
      calories: 50,
      protein: 1,
      fat: 0,
      carbs: 13
    }
  },
  {
    id: 'artischocken',
    name: 'Artischocken',
    price: 0.50,
    category: 'gemüse',
    isVegan: true,
    isVegetarian: true,
    description: 'Marinierte Artischockenherzen',
    allergens: [],
    nutritionalInfo: {
      calories: 47,
      protein: 3,
      fat: 0,
      carbs: 11
    }
  },

  // 🌿 GEWÜRZE (Spices & Herbs)
  {
    id: 'basilikum',
    name: 'Basilikum',
    price: 0.50,
    category: 'gewürze',
    isPopular: true,
    isVegan: true,
    isVegetarian: true,
    description: 'Frisches italienisches Basilikum',
    allergens: [],
    nutritionalInfo: {
      calories: 22,
      protein: 3,
      fat: 1,
      carbs: 2
    }
  },
  {
    id: 'knoblauch',
    name: 'Knoblauch, frisch',
    price: 0.50,
    category: 'gewürze',
    isVegan: true,
    isVegetarian: true,
    description: 'Frischer gehackter Knoblauch',
    allergens: [],
    nutritionalInfo: {
      calories: 149,
      protein: 6,
      fat: 0,
      carbs: 33
    }
  },
  {
    id: 'jalapeños',
    name: 'Jalapeños',
    price: 0.50,
    category: 'gewürze',
    isVegan: true,
    isVegetarian: true,
    description: 'Scharfe Jalapeño-Scheiben',
    allergens: [],
    nutritionalInfo: {
      calories: 29,
      protein: 1,
      fat: 0,
      carbs: 6
    }
  },
  {
    id: 'peperoni',
    name: 'Peperoni',
    price: 0.50,
    category: 'gewürze',
    isVegan: true,
    isVegetarian: true,
    description: 'Scharfe Peperoni',
    allergens: [],
    nutritionalInfo: {
      calories: 40,
      protein: 2,
      fat: 0,
      carbs: 9
    }
  },
  {
    id: 'oliven',
    name: 'Oliven',
    price: 0.50,
    category: 'gewürze',
    isVegan: true,
    isVegetarian: true,
    description: 'Mediterrane schwarze Oliven',
    allergens: [],
    nutritionalInfo: {
      calories: 115,
      protein: 1,
      fat: 11,
      carbs: 6
    }
  },
  {
    id: 'kapern',
    name: 'Kapern',
    price: 0.50,
    category: 'gewürze',
    isVegan: true,
    isVegetarian: true,
    description: 'Mediterrane Kapern',
    allergens: [],
    nutritionalInfo: {
      calories: 23,
      protein: 2,
      fat: 1,
      carbs: 5
    }
  },

  // 🍳 PREMIUM (Premium Ingredients)
  {
    id: 'ei',
    name: 'Ei',
    price: 1.00,
    category: 'premium',
    isVegetarian: true,
    description: 'Frisches Hühnerei',
    allergens: ['Eier'],
    nutritionalInfo: {
      calories: 155,
      protein: 13,
      fat: 11,
      carbs: 1
    }
  },
  {
    id: 'sauce-hollandaise',
    name: 'Sauce Hollandaise',
    price: 1.00,
    category: 'premium',
    isVegetarian: true,
    description: 'Cremige Sauce Hollandaise',
    allergens: ['Eier', 'Milch'],
    nutritionalInfo: {
      calories: 568,
      protein: 9,
      fat: 60,
      carbs: 2
    }
  }
];

// Real Saucen (Sauces) Data based on Campus Pizza Menu
export const realSaucenData = [
  {
    id: 'tomatensauce',
    name: 'Tomatensauce',
    price: 0.00,
    isDefault: true,
    description: 'Klassische italienische Tomatensauce',
    allergens: [],
    isVegan: true,
    isVegetarian: true
  },
  {
    id: 'sauce-hollandaise-sauce',
    name: 'Sauce Hollandaise',
    price: 1.00,
    description: 'Cremige Sauce Hollandaise als Basis',
    allergens: ['Eier', 'Milch'],
    isVegetarian: true
  }
];

// Helper function to get popular ingredients
export const getPopularZutaten = (): ZutatOption[] => {
  return realZutatenData.filter(zutat => zutat.isPopular);
};

// Helper function to get ingredients by category
export const getZutatenByCategory = (category: string): ZutatOption[] => {
  return realZutatenData.filter(zutat => zutat.category === category);
};

// Helper function to categorize all ingredients
export const getCategorizedZutaten = () => {
  const categories = {
    fleisch: getZutatenByCategory('fleisch'),
    käse: getZutatenByCategory('käse'),
    gemüse: getZutatenByCategory('gemüse'),
    meeresfrüchte: getZutatenByCategory('meeresfrüchte'),
    gewürze: getZutatenByCategory('gewürze'),
    premium: getZutatenByCategory('premium')
  };
  
  return categories;
};

export default realZutatenData;
