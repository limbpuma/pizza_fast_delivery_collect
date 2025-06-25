// Types for Zutaten (Ingredients) System - Phase 3

export interface ZutatOption {
  id: string;
  name: string;
  price: number;
  category: ZutatCategory;
  isPopular?: boolean;
  isVegan?: boolean;
  isVegetarian?: boolean;
  allergens?: string[];
  description?: string;
  nutritionalInfo?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  };
}

export type ZutatCategory = 
  | 'fleisch'        // Meat
  | 'käse'           // Cheese
  | 'gemüse'         // Vegetables
  | 'meeresfrüchte'  // Seafood
  | 'gewürze'        // Spices & Herbs
  | 'saucen'         // Extra Sauces
  | 'premium'        // Premium ingredients
  | 'vegan';         // Vegan alternatives

export interface ZutatenSelection {
  [zutatId: string]: boolean;
}

export interface ZutatenCategoryGroup {
  category: ZutatCategory;
  label: string;
  items: ZutatOption[];
  isExpanded?: boolean;
}

// Props interfaces
export interface ZutatenPreviewProps {
  availableZutaten: ZutatOption[];
  selectedZutaten: ZutatenSelection;
  onZutatenChange: (zutatId: string, selected: boolean) => void;
  onShowMore: () => void;
  maxPreviewItems?: number;
}

export interface ZutatenExpandedProps {
  availableZutaten: ZutatOption[];
  selectedZutaten: ZutatenSelection;
  onZutatenChange: (zutatId: string, selected: boolean) => void;
  onShowLess: () => void;
  searchable?: boolean;
  virtualScrolling?: boolean;
}

export interface ZutatenCategoryProps {
  category: ZutatenCategoryGroup;
  selectedZutaten: ZutatenSelection;
  onZutatenChange: (zutatId: string, selected: boolean) => void;
  isCollapsible?: boolean;
}
