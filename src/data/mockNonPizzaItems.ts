// Mock data for non-pizza items to test Quick Add functionality
export const mockNonPizzaItems = [
  {
    id: 101,
    name: "Coca-Cola",
    unitPrice: 3.50,
    ingredients: ["Carbonated water", "Sugar", "Natural flavors"],    soldOut: false
  },
  {
    id: 102,
    name: "Tiramisu",
    unitPrice: 6.90,
    ingredients: ["Mascarpone", "Coffee", "Ladyfingers", "Cocoa"],    soldOut: false
  },
  {
    id: 103,
    name: "Garlic Bread",
    unitPrice: 4.50,
    ingredients: ["Fresh bread", "Garlic", "Butter", "Herbs"],    soldOut: false
  },
  {
    id: 104,
    name: "Caesar Salad",
    unitPrice: 8.90,
    ingredients: ["Romaine lettuce", "Parmesan", "Croutons", "Caesar dressing"],    soldOut: false
  },
  {
    id: 105,
    name: "Sparkling Water",
    unitPrice: 2.50,
    ingredients: ["Carbonated mineral water"],    soldOut: false
  }
];

// Add these items to the existing pizza menu for testing
export function enhanceMenuWithNonPizzaItems(existingMenu: any[]) {
  return [...existingMenu, ...mockNonPizzaItems];
}
