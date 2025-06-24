/**
 * Menu category utilities for filtering
 */

/**
 * Interface for category options used in filters
 */
export interface CategoryOption {
  value: string;
  label: string;
}

/**
 * Get category options for filtering from menu data
 */
export function getCategoryOptions(menuData: any[], includeAll: boolean = true): CategoryOption[] {
  // Extract unique categories from menu items
  const categories = new Set<string>();
  
  menuData.forEach(item => {
    const category = item.category || item.kategorie;
    if (category) {
      categories.add(category);
    }
  });
  
  // Convert to category options array
  const categoryOptions: CategoryOption[] = Array.from(categories)
    .sort()
    .map(category => ({
      value: category,
      label: category
    }));
  
  // Add "All" option if requested
  if (includeAll) {
    return [
      { value: 'all', label: 'Alle Kategorien' },
      ...categoryOptions
    ];
  }
  
  return categoryOptions;
}

/**
 * Get category display name (for translation/localization)
 */
export function getCategoryDisplayName(category: string): string {
  const categoryMap: { [key: string]: string } = {
    'all': 'Alle Kategorien',
    'Pizzen Vegetarisch': 'Vegetarische Pizzen',
    'Pizzen mit Fleisch': 'Pizzen mit Fleisch',
    'Pizzen mit Fisch': 'Pizzen mit Fisch',
    'Snacks': 'Snacks',
    'Getränke': 'Getränke',
    'Salate': 'Salate',
    'Desserts': 'Desserts',
    'Baguettes': 'Baguettes',
    'Fladenbrot': 'Fladenbrot',
    'Für die Kleinen': 'Für die Kleinen',
    'Tagesangebote': 'Tagesangebote',
    'Nudeln': 'Nudeln',
    'Vegetarisch': 'Vegetarisch',
    'Fleisch': 'Fleisch',
    'Fisch': 'Fisch',
    'Schnitzel': 'Schnitzel'
  };
  
  return categoryMap[category] || category;
}