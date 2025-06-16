// Delivery zones for Campus Pizza Express
// Base: 44149 Dortmund + 5 nearby postal codes

export const DELIVERY_ZONES = [
  '44149', // Dortmund Huckarde (base)
  '44147', // Dortmund Brackel
  '44227', // Dortmund Aplerbeck
  '44225', // Dortmund Hombruch
  '44137', // Dortmund Mitte
  '44135', // Dortmund Westfalenhalle
];

/**
 * Validates if a postal code is within our delivery zone
 * @param postalCode - The postal code to validate (string)
 * @returns boolean - true if we deliver to this area
 */
export function isValidDeliveryZone(postalCode: string): boolean {
  if (!postalCode) return false;
  
  // Clean the postal code (remove spaces, normalize)
  const cleanedCode = postalCode.trim().replace(/\s+/g, '');
  
  // German postal codes are exactly 5 digits
  if (!/^\d{5}$/.test(cleanedCode)) return false;
  
  return DELIVERY_ZONES.includes(cleanedCode);
}

/**
 * Get list of delivery zones for display
 * @returns array of postal codes we deliver to
 */
export function getDeliveryZones(): string[] {
  return [...DELIVERY_ZONES];
}
