/**
 * 🚚 DELIVERY ZONES VALIDATION SYSTEM
 * 
 * Refactored to use the new tariff-based delivery system
 * Maintains backward compatibility while adding enhanced functionality
 * 
 * @version 2.0.0 - Refactored for tariff system
 * @created June 24, 2025
 * @phase Phase 1, Step 1.2 - PLZ Validation Refactor
 */

import { 
  getTariffByPLZ, 
  getAllDeliveryZones as getTariffDeliveryZones,
  isValidDeliveryZone as isTariffValidDeliveryZone,
  type DeliveryTariff 
} from './deliveryTariffs.js';

// ===============================
// LEGACY COMPATIBILITY
// ===============================

/**
 * @deprecated Use getAllDeliveryZones() from deliveryTariffs.ts instead
 * Legacy delivery zones - kept for backward compatibility
 * This will be removed in Phase 2
 */
export const DELIVERY_ZONES = [
  '44149', // Campus area - free delivery
  '44147', // Premium zone
  '44227', // Standard zone  
  '44225', // Standard zone
  '44137', // Premium zone
  '44135', // Premium zone
] as const;

// ===============================
// ENHANCED VALIDATION INTERFACE
// ===============================

/**
 * Enhanced PLZ validation result with tariff information
 */
export interface PLZValidationResult {
  /** Whether the PLZ is valid for delivery */
  isValid: boolean;
  /** Cleaned postal code */
  plz: string;
  /** Associated delivery tariff (null if invalid) */
  tariff: DeliveryTariff | null;
  /** Zone name for display */
  zoneName: string;
  /** Error message if validation failed */
  error?: string;
  /** Warning message for user */
  warning?: string;
}

/**
 * Delivery zone information for display
 */
export interface DeliveryZoneInfo {
  /** Postal code */
  plz: string;
  /** Zone display name */
  zoneName: string;
  /** Minimum order value */
  minimumOrder: number;
  /** Base delivery cost */
  deliveryCost: number;
  /** Free delivery threshold */
  freeDeliveryThreshold: number;
  /** Whether this is a pickup zone */
  isPickupZone: boolean;
}

// ===============================
// CORE VALIDATION FUNCTIONS
// ===============================

/**
 * Enhanced postal code validation with detailed results
 * Replaces the simple boolean validation with comprehensive information
 * 
 * @param postalCode - The postal code to validate
 * @returns Enhanced validation result with tariff information
 */
export function validatePLZ(postalCode: string): PLZValidationResult {
  // Handle empty or null input
  if (!postalCode?.trim()) {
    return {
      isValid: false,
      plz: '',
      tariff: null,
      zoneName: 'Unknown',
      error: 'Postal code is required'
    };
  }

  // Clean the postal code
  const cleanedPLZ = postalCode.trim().replace(/\s+/g, '');

  // Validate format for German postal codes
  if (!/^\d{5}$/.test(cleanedPLZ) && cleanedPLZ.toLowerCase() !== 'abholung') {
    return {
      isValid: false,
      plz: cleanedPLZ,
      tariff: null,
      zoneName: 'Invalid Format',
      error: 'Postal code must be exactly 5 digits'
    };
  }

  // Get tariff information
  const tariff = getTariffByPLZ(cleanedPLZ);

  if (!tariff) {
    return {
      isValid: false,
      plz: cleanedPLZ,
      tariff: null,
      zoneName: 'Not Covered',
      error: 'Delivery not available for this postal code',
      warning: 'You can still pick up your order at our restaurant'
    };
  }

  return {
    isValid: true,
    plz: cleanedPLZ,
    tariff,
    zoneName: tariff.name
  };
}

/**
 * Simple validation function - maintains backward compatibility
 * 
 * @param postalCode - The postal code to validate
 * @returns boolean - true if delivery is available
 */
export function isValidDeliveryZone(postalCode: string): boolean {
  // Use the new tariff-based validation
  return isTariffValidDeliveryZone(postalCode);
}

/**
 * Enhanced delivery zones with tariff information
 * Replaces the simple array with comprehensive zone data
 * 
 * @param includePickup - Whether to include pickup option
 * @returns Array of delivery zone information
 */
export function getDeliveryZones(includePickup: boolean = false): DeliveryZoneInfo[] {
  const zones: DeliveryZoneInfo[] = [];
  const deliveryPLZs = getTariffDeliveryZones();

  // Add all delivery zones
  deliveryPLZs.forEach(plz => {
    const tariff = getTariffByPLZ(plz);
    if (tariff) {
      zones.push({
        plz,
        zoneName: tariff.name,
        minimumOrder: tariff.mindestbestellwert,
        deliveryCost: tariff.lieferkosten,
        freeDeliveryThreshold: tariff.lieferkosten_entfallen_ab,
        isPickupZone: false
      });
    }
  });

  // Add pickup option if requested
  if (includePickup) {
    const pickupTariff = getTariffByPLZ('abholung');
    if (pickupTariff) {
      zones.push({
        plz: 'abholung',
        zoneName: pickupTariff.name,
        minimumOrder: pickupTariff.mindestbestellwert,
        deliveryCost: pickupTariff.lieferkosten,
        freeDeliveryThreshold: pickupTariff.lieferkosten_entfallen_ab,
        isPickupZone: true
      });
    }
  }

  return zones.sort((a, b) => {
    // Pickup zones last
    if (a.isPickupZone !== b.isPickupZone) {
      return a.isPickupZone ? 1 : -1;
    }
    // Sort by delivery cost (free first)
    if (a.deliveryCost !== b.deliveryCost) {
      return a.deliveryCost - b.deliveryCost;
    }
    // Sort by PLZ
    return a.plz.localeCompare(b.plz);
  });
}

/**
 * Legacy function - returns simple array of postal codes
 * @deprecated Use getDeliveryZones() for enhanced information
 * @returns Array of postal codes (for backward compatibility)
 */
export function getDeliveryZonesList(): string[] {
  return getTariffDeliveryZones();
}

// ===============================
// ZONE GROUPING & CATEGORIZATION
// ===============================

/**
 * Groups delivery zones by their characteristics
 * Useful for UI display and user selection
 */
export function getDeliveryZonesByCategory() {
  const zones = getDeliveryZones(false);
  
  return {
    free: zones.filter(zone => zone.deliveryCost === 0 && !zone.isPickupZone),
    standard: zones.filter(zone => zone.deliveryCost > 0 && zone.deliveryCost <= 1.50),
    premium: zones.filter(zone => zone.deliveryCost > 1.50),
    pickup: zones.filter(zone => zone.isPickupZone)
  };
}

/**
 * Gets zones sorted by delivery cost (ascending)
 * Useful for price comparison displays
 */
export function getDeliveryZonesByCost(): DeliveryZoneInfo[] {
  return getDeliveryZones(true).sort((a, b) => {
    if (a.isPickupZone && !b.isPickupZone) return 1;
    if (!a.isPickupZone && b.isPickupZone) return -1;
    return a.deliveryCost - b.deliveryCost;
  });
}

// ===============================
// SEARCH & SUGGESTION FUNCTIONS
// ===============================

/**
 * Finds the closest delivery zones to a given PLZ
 * Useful for suggesting alternatives when a PLZ is not covered
 * 
 * @param targetPLZ - The PLZ to find alternatives for
 * @param maxSuggestions - Maximum number of suggestions to return
 * @returns Array of suggested zones
 */
export function suggestNearbyDeliveryZones(
  targetPLZ: string, 
  maxSuggestions: number = 3
): DeliveryZoneInfo[] {
  if (!targetPLZ || !/^\d{5}$/.test(targetPLZ.trim())) {
    return [];
  }

  const target = parseInt(targetPLZ.trim());
  const zones = getDeliveryZones(false);

  // Calculate distance (simple numeric difference for PLZ)
  const withDistance = zones
    .map(zone => ({
      ...zone,
      distance: Math.abs(parseInt(zone.plz) - target)
    }))
    .filter(zone => zone.distance > 0) // Exclude exact matches
    .sort((a, b) => a.distance - b.distance);

  return withDistance.slice(0, maxSuggestions);
}

/**
 * Searches for delivery zones by partial PLZ or name
 * Useful for autocomplete functionality
 * 
 * @param query - Search query (partial PLZ or zone name)
 * @returns Array of matching zones
 */
export function searchDeliveryZones(query: string): DeliveryZoneInfo[] {
  if (!query?.trim()) {
    return [];
  }

  const searchTerm = query.trim().toLowerCase();
  const zones = getDeliveryZones(true);

  return zones.filter(zone => 
    zone.plz.includes(searchTerm) ||
    zone.zoneName.toLowerCase().includes(searchTerm)
  );
}

// ===============================
// UTILITY FUNCTIONS
// ===============================

/**
 * Checks if a PLZ is in a premium delivery zone
 * (Higher delivery cost and minimum order)
 */
export function isPremiumDeliveryZone(plz: string): boolean {
  const validation = validatePLZ(plz);
  return validation.isValid && 
         validation.tariff !== null && 
         validation.tariff.lieferkosten >= 1.50;
}

/**
 * Checks if a PLZ qualifies for free delivery
 */
export function isFreeDeliveryZone(plz: string): boolean {
  const validation = validatePLZ(plz);
  return validation.isValid && 
         validation.tariff !== null && 
         validation.tariff.lieferkosten === 0;
}

/**
 * Gets delivery zone statistics for analytics
 */
export function getDeliveryZoneStats() {
  const zones = getDeliveryZones(false);
  const categories = getDeliveryZonesByCategory();

  return {
    totalZones: zones.length,
    freeZones: categories.free.length,
    standardZones: categories.standard.length,
    premiumZones: categories.premium.length,
    averageDeliveryCost: zones.reduce((sum, zone) => sum + zone.deliveryCost, 0) / zones.length,
    averageMinimumOrder: zones.reduce((sum, zone) => sum + zone.minimumOrder, 0) / zones.length,
    priceRange: {
      min: Math.min(...zones.map(z => z.deliveryCost)),
      max: Math.max(...zones.map(z => z.deliveryCost))
    }
  };
}

// ===============================
// MIGRATION HELPERS
// ===============================

/**
 * Development helper to compare old vs new validation results
 * Should be removed after migration is complete
 */
export function compareValidationMethods(plz: string) {
  const cleanPLZ = plz.trim();
  const oldResult = (DELIVERY_ZONES as readonly string[]).includes(cleanPLZ);
  const newResult = validatePLZ(plz);

  return {
    plz: cleanPLZ,
    oldMethod: oldResult,
    newMethod: newResult.isValid,
    matches: oldResult === newResult.isValid,
    tariffInfo: newResult.tariff ? {
      id: newResult.tariff.id,
      cost: newResult.tariff.lieferkosten,
      minimum: newResult.tariff.mindestbestellwert
    } : null
  };
}

// ===============================
// EXPORTS
// ===============================

const deliveryZonesAPI = {
  // New enhanced functions
  validatePLZ,
  getDeliveryZones,
  getDeliveryZonesByCategory,
  getDeliveryZonesByCost,
  suggestNearbyDeliveryZones,
  searchDeliveryZones,
  isPremiumDeliveryZone,
  isFreeDeliveryZone,
  getDeliveryZoneStats,
  
  // Legacy compatibility functions
  isValidDeliveryZone,
  getDeliveryZonesList,
  
  // Legacy data (deprecated)
  DELIVERY_ZONES
};

export default deliveryZonesAPI;
