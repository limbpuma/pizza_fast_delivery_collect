// German market pizza information - Normativas alemanas LMIV
// Información nutricional y alérgenos según regulación 1169/2011

export interface GermanPizzaInfo {
  id: number;
  // Información nutricional (obligatoria LMIV)
  nutritionalInfo: {
    calories: number; // kcal por 100g
    caloriesPerPizza: number; // kcal por pizza completa
    fats: number; // gramos por 100g
    carbs: number; // gramos por 100g
    proteins: number; // gramos por 100g
    salt: number; // gramos por 100g
  };
  
  // Alérgenos (obligatorio destacar)
  allergens: string[]; // Lista de alérgenos presentes
  
  // Especificaciones del producto
  weight: number; // Peso en gramos
  diameter: number; // Diámetro en cm
  pricePerHundredGrams: number; // €/100g para comparación
  
  // Categorización alemana
  category: 'vegetarisch' | 'vegan' | 'fleisch' | 'meeresfrüchte' | 'klassisch';
  spicyLevel?: 1 | 2 | 3; // Nivel de picante (opcional)
  isPopular?: boolean; // Pizza popular (para destacar)
}

// Base de datos de información alemana para pizzas
export const germanPizzaDatabase: Record<number, GermanPizzaInfo> = {
  1: { // Margherita
    id: 1,
    nutritionalInfo: {
      calories: 250,
      caloriesPerPizza: 750,
      fats: 8.5,
      carbs: 35.2,
      proteins: 12.1,
      salt: 1.8
    },
    allergens: ['Gluten', 'Milch'],
    weight: 300,
    diameter: 32,
    pricePerHundredGrams: 4.00,
    category: 'vegetarisch',
    isPopular: true
  },
  2: { // Capricciosa
    id: 2,
    nutritionalInfo: {
      calories: 285,
      caloriesPerPizza: 855,
      fats: 11.2,
      carbs: 33.8,
      proteins: 15.7,
      salt: 2.1
    },
    allergens: ['Gluten', 'Milch'],
    weight: 380,
    diameter: 32,
    pricePerHundredGrams: 3.68,
    category: 'fleisch'
  },
  3: { // Romana
    id: 3,
    nutritionalInfo: {
      calories: 295,
      caloriesPerPizza: 885,
      fats: 12.4,
      carbs: 32.1,
      proteins: 17.2,
      salt: 2.3
    },
    allergens: ['Gluten', 'Milch'],
    weight: 350,
    diameter: 32,
    pricePerHundredGrams: 4.29,
    category: 'fleisch',
    isPopular: true
  },
  4: { // Prosciutto e Rucola
    id: 4,
    nutritionalInfo: {
      calories: 310,
      caloriesPerPizza: 930,
      fats: 13.8,
      carbs: 30.5,
      proteins: 18.9,
      salt: 2.2
    },
    allergens: ['Gluten', 'Milch'],
    weight: 360,
    diameter: 32,
    pricePerHundredGrams: 4.44,
    category: 'fleisch'
  },
  5: { // Diavola
    id: 5,
    nutritionalInfo: {
      calories: 320,
      caloriesPerPizza: 960,
      fats: 14.5,
      carbs: 31.2,
      proteins: 16.8,
      salt: 2.5
    },
    allergens: ['Gluten', 'Milch'],
    weight: 340,
    diameter: 32,
    pricePerHundredGrams: 4.71,
    category: 'fleisch',
    spicyLevel: 2
  },
  6: { // Vegetale
    id: 6,
    nutritionalInfo: {
      calories: 230,
      caloriesPerPizza: 690,
      fats: 7.2,
      carbs: 36.8,
      proteins: 10.5,
      salt: 1.6
    },
    allergens: ['Gluten', 'Milch'],
    weight: 320,
    diameter: 32,
    pricePerHundredGrams: 4.06,
    category: 'vegetarisch',
    isPopular: true
  },
  7: { // Napoli
    id: 7,
    nutritionalInfo: {
      calories: 265,
      caloriesPerPizza: 795,
      fats: 9.1,
      carbs: 34.7,
      proteins: 13.2,
      salt: 1.9
    },
    allergens: ['Gluten', 'Milch'],
    weight: 330,
    diameter: 32,
    pricePerHundredGrams: 4.85,
    category: 'vegetarisch'
  },
  8: { // Siciliana
    id: 8,
    nutritionalInfo: {
      calories: 290,
      caloriesPerPizza: 870,
      fats: 11.8,
      carbs: 32.4,
      proteins: 14.7,
      salt: 3.2
    },
    allergens: ['Gluten', 'Milch', 'Fisch'],
    weight: 345,
    diameter: 32,
    pricePerHundredGrams: 4.64,
    category: 'meeresfrüchte'
  },
  9: { // Pepperoni
    id: 9,
    nutritionalInfo: {
      calories: 315,
      caloriesPerPizza: 945,
      fats: 14.2,
      carbs: 30.8,
      proteins: 16.5,
      salt: 2.4
    },
    allergens: ['Gluten', 'Milch'],
    weight: 335,
    diameter: 32,
    pricePerHundredGrams: 4.18,
    category: 'fleisch',
    spicyLevel: 1,
    isPopular: true
  },
  10: { // Hawaiian
    id: 10,
    nutritionalInfo: {
      calories: 275,
      caloriesPerPizza: 825,
      fats: 9.8,
      carbs: 35.1,
      proteins: 14.3,
      salt: 2.0
    },
    allergens: ['Gluten', 'Milch'],
    weight: 355,
    diameter: 32,
    pricePerHundredGrams: 4.23,
    category: 'fleisch'
  },
  11: { // Spinach and Mushroom
    id: 11,
    nutritionalInfo: {
      calories: 240,
      caloriesPerPizza: 720,
      fats: 8.1,
      carbs: 35.9,
      proteins: 11.8,
      salt: 1.7
    },
    allergens: ['Gluten', 'Milch'],
    weight: 325,
    diameter: 32,
    pricePerHundredGrams: 4.62,
    category: 'vegetarisch'
  },
  12: { // Mediterranean
    id: 12,
    nutritionalInfo: {
      calories: 280,
      caloriesPerPizza: 840,
      fats: 10.5,
      carbs: 33.2,
      proteins: 12.9,
      salt: 2.1
    },
    allergens: ['Gluten', 'Milch'],
    weight: 370,
    diameter: 32,
    pricePerHundredGrams: 4.32,
    category: 'vegetarisch'
  },
  13: { // Greek
    id: 13,
    nutritionalInfo: {
      calories: 295,
      caloriesPerPizza: 885,
      fats: 12.7,
      carbs: 31.8,
      proteins: 15.1,
      salt: 2.8
    },
    allergens: ['Gluten', 'Milch'],
    weight: 365,
    diameter: 32,
    pricePerHundredGrams: 4.38,
    category: 'vegetarisch'
  },
  14: { // Abruzzese
    id: 14,
    nutritionalInfo: {
      calories: 305,
      caloriesPerPizza: 915,
      fats: 13.1,
      carbs: 30.9,
      proteins: 17.8,
      salt: 2.2
    },
    allergens: ['Gluten', 'Milch'],
    weight: 355,
    diameter: 32,
    pricePerHundredGrams: 4.51,
    category: 'fleisch'
  },
  15: { // Pesto Chicken
    id: 15,
    nutritionalInfo: {
      calories: 325,
      caloriesPerPizza: 975,
      fats: 15.2,
      carbs: 28.7,
      proteins: 19.4,
      salt: 2.1
    },
    allergens: ['Gluten', 'Milch', 'Nüsse'],
    weight: 375,
    diameter: 32,
    pricePerHundredGrams: 4.27,
    category: 'fleisch'
  },
  16: { // Eggplant Parmesan
    id: 16,
    nutritionalInfo: {
      calories: 255,
      caloriesPerPizza: 765,
      fats: 9.3,
      carbs: 34.1,
      proteins: 13.7,
      salt: 1.9
    },
    allergens: ['Gluten', 'Milch'],
    weight: 340,
    diameter: 32,
    pricePerHundredGrams: 4.41,
    category: 'vegetarisch'
  },
  17: { // Roasted Veggie
    id: 17,
    nutritionalInfo: {
      calories: 235,
      caloriesPerPizza: 705,
      fats: 7.8,
      carbs: 36.5,
      proteins: 10.2,
      salt: 1.5
    },
    allergens: ['Gluten', 'Milch'],
    weight: 350,
    diameter: 32,
    pricePerHundredGrams: 4.29,
    category: 'vegetarisch'
  },
  18: { // Tofu and Mushroom
    id: 18,
    nutritionalInfo: {
      calories: 220,
      caloriesPerPizza: 660,
      fats: 6.9,
      carbs: 35.8,
      proteins: 12.4,
      salt: 1.4
    },
    allergens: ['Gluten', 'Milch', 'Soja'],
    weight: 330,
    diameter: 32,
    pricePerHundredGrams: 4.55,
    category: 'vegan'
  }
};

// Función helper para obtener información alemana
export function getGermanPizzaInfo(pizzaId: number): GermanPizzaInfo | null {
  return germanPizzaDatabase[pizzaId] || null;
}

// Función helper para categorías en alemán
export function getCategoryInGerman(category: string): string {
  const categories = {
    'vegetarisch': 'Vegetarisch',
    'vegan': 'Vegan',
    'fleisch': 'Mit Fleisch',
    'meeresfrüchte': 'Meeresfrüchte',
    'klassisch': 'Klassisch'
  };
  return categories[category as keyof typeof categories] || category;
}

// Función helper para alérgenos con iconos
export function getAllergenIcon(allergen: string): string {
  const icons = {
    'Gluten': '🌾',
    'Milch': '🥛',
    'Fisch': '🐟',
    'Nüsse': '🥜',
    'Soja': '🫘',
    'Eier': '🥚',
    'Senf': '🌭',
    'Sellerie': '🥬'
  };
  return icons[allergen as keyof typeof icons] || '⚠️';
}
