// Mock data for non-pizza items to test Quick Add functionality
export const mockNonPizzaItems = [
  {
    id: 101,
    name: "Coca-Cola",
    unitPrice: 3.50,
    ingredients: ["Carbonated water", "Sugar", "Natural flavors"],
    soldOut: false,
    imageUrl: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400"
  },
  {
    id: 102,
    name: "Tiramisu",
    unitPrice: 6.90,
    ingredients: ["Mascarpone", "Coffee", "Ladyfingers", "Cocoa"],
    soldOut: false,
    imageUrl: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400"
  },
  {
    id: 103,
    name: "Garlic Bread",
    unitPrice: 4.50,
    ingredients: ["Fresh bread", "Garlic", "Butter", "Herbs"],
    soldOut: false,
    imageUrl: "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=400"
  },
  {
    id: 104,
    name: "Caesar Salad",
    unitPrice: 8.90,
    ingredients: ["Romaine lettuce", "Parmesan", "Croutons", "Caesar dressing"],
    soldOut: false,
    imageUrl: "https://images.unsplash.com/photo-1551248429-40975aa4de74?w=400"
  },
  {
    id: 105,
    name: "Sparkling Water",
    unitPrice: 2.50,
    ingredients: ["Carbonated mineral water"],
    soldOut: false,
    imageUrl: "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=400"
  }
];

// Add these items to the existing pizza menu for testing
export function enhanceMenuWithNonPizzaItems(existingMenu: any[]) {
  return [...existingMenu, ...mockNonPizzaItems];
}
