// Real Zutaten (Ingredients) Data - Campus Pizza Menu 2025
// Actualizado con datos reales del JSON del menú oficial
import { ZutatOption } from './types';

export const realZutatenData: ZutatOption[] = [
  // 🧀 KÄSE (Cheese)
  {
    id: 'mozzarella',
    name: 'mit Mozzarella',
    price: 0.50,
    category: 'käse',
    isPopular: true,
    isVegetarian: true,
    description: 'Extra Mozzarella Käse',
    allergens: ['Milch']
  },
  {
    id: 'käse',
    name: 'mit Käse',
    price: 1.00,
    category: 'käse',
    isPopular: true,
    isVegetarian: true,
    description: 'Extra Käse',
    allergens: ['Milch']
  },
  {
    id: 'schafskäse',
    name: 'mit Schafskäse',
    price: 0.50,
    category: 'käse',
    isVegetarian: true,
    description: 'Cremiger Schafskäse',
    allergens: ['Milch']
  },

  // 🥩 FLEISCH (Meat)
  {
    id: 'salami',
    name: 'mit Salami',
    price: 0.50,
    category: 'fleisch',
    isPopular: true,
    description: 'Würzige italienische Salami'
  },
  {
    id: 'vorderschinken',
    name: 'mit Vorderschinken, gekocht',
    price: 0.50,
    category: 'fleisch',
    isPopular: true,
    description: 'Zarter gekochter Vorderschinken'
  },
  {
    id: 'hähnchenfleisch',
    name: 'mit Hähnchenfleisch',
    price: 0.50,
    category: 'fleisch',
    description: 'Zartes gegrilltes Hähnchenfleisch'
  },
  {
    id: 'gyros',
    name: 'mit Gyros',
    price: 0.50,
    category: 'fleisch',
    description: 'Würziges griechisches Gyrosfleisch'
  },
  {
    id: 'hackfleisch',
    name: 'mit Hackfleisch',
    price: 0.50,
    category: 'fleisch',
    description: 'Gewürztes Rinderhackfleisch'
  },

  // 🦐 MEERESFRÜCHTE (Seafood)
  {
    id: 'thunfisch',
    name: 'mit Thunfisch',
    price: 0.50,
    category: 'meeresfrüchte',
    isPopular: true,
    description: 'Hochwertiger Thunfisch',
    allergens: ['Fisch']
  },
  {
    id: 'krabben',
    name: 'mit Krabben',
    price: 1.00,
    category: 'meeresfrüchte',
    description: 'Frische Nordseekrabben',
    allergens: ['Krebstiere']
  },
  {
    id: 'calamaris',
    name: 'mit Calamaris',
    price: 0.50,
    category: 'meeresfrüchte',
    description: 'Zarte Tintenfischringe',
    allergens: ['Weichtiere']
  },
  {
    id: 'muscheln',
    name: 'mit Muscheln',
    price: 0.50,
    category: 'meeresfrüchte',
    description: 'Frische Miesmuscheln',
    allergens: ['Weichtiere']
  },
  {
    id: 'sardellen',
    name: 'mit Sardellen',
    price: 0.50,
    category: 'meeresfrüchte',
    description: 'Mediterrane Sardellen',
    allergens: ['Fisch']
  },

  // 🥬 GEMÜSE (Vegetables)
  {
    id: 'paprika',
    name: 'mit Paprika',
    price: 0.50,
    category: 'gemüse',
    isPopular: true,
    isVegan: true,
    isVegetarian: true,
    description: 'Frische bunte Paprikastreifen'
  },
  {
    id: 'artischocken',
    name: 'mit Artischocken',
    price: 0.50,
    category: 'gemüse',
    isVegan: true,
    isVegetarian: true,
    description: 'Marinierte Artischockenherzen'
  },
  {
    id: 'tomaten',
    name: 'mit Tomaten, frisch',
    price: 0.50,
    category: 'gemüse',
    isVegan: true,
    isVegetarian: true,
    description: 'Saftige frische Tomaten'
  },
  {
    id: 'mais',
    name: 'mit Mais',
    price: 0.50,
    category: 'gemüse',
    isVegan: true,
    isVegetarian: true,
    description: 'Süßer Zuckermais'
  },
  {
    id: 'zwiebeln',
    name: 'mit Zwiebeln',
    price: 0.50,
    category: 'gemüse',
    isPopular: true,
    isVegan: true,
    isVegetarian: true,
    description: 'Frische rote Zwiebeln'
  },
  {
    id: 'spinat',
    name: 'mit Spinat',
    price: 0.50,
    category: 'gemüse',
    isVegan: true,
    isVegetarian: true,
    description: 'Frischer Blattspinat'
  },
  {
    id: 'zucchini',
    name: 'mit Zucchini',
    price: 0.50,
    category: 'gemüse',
    isVegan: true,
    isVegetarian: true,
    description: 'Gegrillte Zucchinischeiben'
  },
  {
    id: 'broccoli',
    name: 'mit Broccoli',
    price: 0.50,
    category: 'gemüse',
    isVegan: true,
    isVegetarian: true,
    description: 'Frischer grüner Broccoli'
  },
  {
    id: 'spargel',
    name: 'mit Spargel',
    price: 0.50,
    category: 'gemüse',
    isVegan: true,
    isVegetarian: true,
    description: 'Zarter grüner Spargel'
  },
  {
    id: 'champignons',
    name: 'mit Champignons, frisch',
    price: 0.50,
    category: 'gemüse',
    isPopular: true,
    isVegan: true,
    isVegetarian: true,
    description: 'Frische weiße Champignons'
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
  // 🌿 GEWÜRZE & KRÄUTER (Spices & Herbs)
  {
    id: 'basilikum',
    name: 'mit Basilikum',
    price: 0.50,
    category: 'gewürze',
    isPopular: true,
    isVegan: true,
    isVegetarian: true,
    description: 'Frisches italienisches Basilikum'
  },
  {
    id: 'knoblauch',
    name: 'mit Knoblauch, frisch',
    price: 0.50,
    category: 'gewürze',
    isVegan: true,
    isVegetarian: true,
    description: 'Frischer gehackter Knoblauch'
  },
  {
    id: 'jalapeños',
    name: 'mit Jalapeños',
    price: 0.50,
    category: 'gewürze',
    isVegan: true,
    isVegetarian: true,
    description: 'Scharfe Jalapeño-Scheiben'
  },
  {
    id: 'peperoni',
    name: 'mit Peperoni',
    price: 0.50,
    category: 'gewürze',
    isVegan: true,
    isVegetarian: true,
    description: 'Scharfe Peperoni'
  },
  {
    id: 'oliven',
    name: 'mit Oliven',
    price: 0.50,
    category: 'gewürze',
    isVegan: true,
    isVegetarian: true,
    description: 'Mediterrane schwarze Oliven'
  },
  {
    id: 'kapern',
    name: 'mit Kapern',
    price: 0.50,
    category: 'gewürze',
    isVegan: true,
    isVegetarian: true,
    description: 'Mediterrane Kapern'
  },

  // 🍳 PREMIUM (Premium Ingredients)
  {
    id: 'ananas',
    name: 'mit Ananas',
    price: 0.50,
    category: 'premium',
    isVegan: true,
    isVegetarian: true,
    description: 'Süße tropische Ananas'
  },
  {
    id: 'ei',
    name: 'mit Ei',
    price: 1.00,
    category: 'premium',
    isVegetarian: true,
    description: 'Frisches Hühnerei',
    allergens: ['Eier']
  },
  {
    id: 'sauce-hollandaise-zutat',
    name: 'mit Sauce Hollandaise',
    price: 1.00,
    category: 'premium',
    isVegetarian: true,
    description: 'Cremige Sauce Hollandaise als Zutat',
    allergens: ['Eier', 'Milch']
  }
];

// Real Saucen (Sauces) Data - Campus Pizza Menu 2025
// Actualizado con datos reales del JSON del menú oficial
export const realSaucenData = [
  {
    id: 'tomatensauce',
    name: 'mit Tomatensauce',
    price: 0.00,
    isDefault: true,
    description: 'Klassische italienische Tomatensauce - Basis für alle Pizzen',
    isVegan: true,
    isVegetarian: true
  },
  {
    id: 'sauce-hollandaise-sauce',
    name: 'mit Sauce Hollandaise',
    price: 1.00,
    description: 'Cremige Sauce Hollandaise als Pizza-Basis',
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

export default realZutatenData;
