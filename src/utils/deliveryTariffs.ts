/**
 * 🚚 DELIVERY TARIFF CONFIGURATION SYSTEM
 * 
 * This module provides the core tariff configuration for PLZ-based delivery pricing.
 * Following security-first approach to prevent price manipulation.
 * 
 * @version 1.0.0
 * @created June 24, 2025
 * @phase Phase 1 - Core Infrastructure
 */

// ===============================
// CORE INTERFACES
// ===============================

export interface DeliveryTariff {
  /** Unique identifier for the tariff zone */
  id: string;
  /** Human-readable name for the delivery zone */
  name: string;
  /** List of postal codes covered by this tariff */
  plz: string[];
  /** Minimum order value required for delivery */
  mindestbestellwert: number;
  /** Base delivery cost for this zone */
  lieferkosten: number;
  /** Order value threshold for free delivery */
  lieferkosten_entfallen_ab: number;
  /** Whether this tariff is currently active */
  isActive: boolean;
  /** Priority for overlapping zones (higher = more specific) */
  priority: number;
}

// ===============================
// TARIFF CONFIGURATION
// ===============================

/**
 * Main delivery tariff configuration
 * TEST CONFIGURATION - New tariff structure for calculation verification
 * ⚠️ CRITICAL: Values must match legal documents (AGB/T&C)
 */
export const DELIVERY_TARIFFS: readonly DeliveryTariff[] = [
  {
    id: 'zone-1-campus',
    name: 'Zone 1 - Campus Area (FREE)',
    plz: ['44149'],
    mindestbestellwert: 12.00,
    lieferkosten: 0.00,
    lieferkosten_entfallen_ab: 0.00,
    isActive: true,
    priority: 100
  },
  {
    id: 'zone-2a-close',
    name: 'Zone 2A - Close Areas',
    plz: ['44225', '44227'],
    mindestbestellwert: 12.00,
    lieferkosten: 1.00,
    lieferkosten_entfallen_ab: 50.00,
    isActive: true,
    priority: 90
  },
  {
    id: 'zone-2b-mid',
    name: 'Zone 2B - Mid Areas',
    plz: ['44369', '44379'],
    mindestbestellwert: 15.00,
    lieferkosten: 1.00,
    lieferkosten_entfallen_ab: 50.00,
    isActive: true,
    priority: 85
  },
  {
    id: 'zone-3a-extended',
    name: 'Zone 3A - Extended Areas',
    plz: ['44135', '44139', '44388', '44147', '44137'],
    mindestbestellwert: 19.99,
    lieferkosten: 1.50,
    lieferkosten_entfallen_ab: 50.00,
    isActive: true,
    priority: 80
  },
  {
    id: 'zone-3b-far',
    name: 'Zone 3B - Far Areas',
    plz: ['44143', '44141', '44145', '44229'],
    mindestbestellwert: 30.00,
    lieferkosten: 2.00,
    lieferkosten_entfallen_ab: 60.00,
    isActive: true,
    priority: 75
  },
  {
    id: 'zone-4-outer',
    name: 'Zone 4 - Outer Areas',
    plz: ['44359', '44357', '44265', '44263'],
    mindestbestellwert: 30.00,
    lieferkosten: 2.00,
    lieferkosten_entfallen_ab: 60.00,
    isActive: true,
    priority: 70
  },
  {
    id: 'pickup',
    name: 'Pickup - Restaurant Collection',
    plz: ['abholung'],
    mindestbestellwert: 0.00,
    lieferkosten: 0.00,
    lieferkosten_entfallen_ab: 0.00,
    isActive: true,
    priority: 10
  }
] as const;

// ===============================
// CORE FUNCTIONS
// ===============================

/**
 * Finds the appropriate tariff for a given postal code
 * Uses priority-based selection for overlapping zones
 * 
 * @param plz - Postal code to lookup
 * @returns Tariff configuration or null if not found
 */
export function getTariffByPLZ(plz: string): DeliveryTariff | null {
  if (!plz?.trim()) {
    return null;
  }

  const cleanPLZ = plz.trim().toLowerCase();
  
  // Find all matching tariffs
  const matchingTariffs = DELIVERY_TARIFFS.filter(tariff => 
    tariff.isActive && tariff.plz.some(zonePLZ => 
      zonePLZ.toLowerCase() === cleanPLZ
    )
  );

  // Return highest priority match
  if (matchingTariffs.length === 0) {
    return null;
  }

  return matchingTariffs.reduce((highest, current) => 
    current.priority > highest.priority ? current : highest
  );
}

/**
 * Calculates delivery fee and determines if delivery is free
 * Core business logic for pricing calculations
 * 
 * @param plz - Postal code for delivery
 * @param cartTotal - Current cart subtotal
 * @returns Delivery calculation result
 */
export function calculateDeliveryFee(
  plz: string, 
  cartTotal: number
): {
  fee: number;
  isFree: boolean;
  tariff: DeliveryTariff | null;
  meetsMinimum: boolean;
  missingAmount: number;
} {
  const tariff = getTariffByPLZ(plz);
  
  if (!tariff) {
    return {
      fee: 0,
      isFree: false,
      tariff: null,
      meetsMinimum: false,
      missingAmount: 0
    };
  }

  const meetsMinimum = cartTotal >= tariff.mindestbestellwert;
  const isFree = cartTotal >= tariff.lieferkosten_entfallen_ab;
  const fee = isFree ? 0 : tariff.lieferkosten;
  const missingAmount = Math.max(0, tariff.mindestbestellwert - cartTotal);

  return {
    fee,
    isFree,
    tariff,
    meetsMinimum,
    missingAmount
  };
}

/**
 * Validates if a postal code is in a valid delivery area
 * 
 * @param plz - Postal code to validate
 * @returns true if delivery is available
 */
export function isValidDeliveryZone(plz: string): boolean {
  return getTariffByPLZ(plz) !== null;
}

/**
 * Gets all available postal codes for delivery
 * Excludes pickup zones
 * 
 * @returns Array of all valid delivery postal codes
 */
export function getAllDeliveryZones(): string[] {
  return DELIVERY_TARIFFS
    .filter(tariff => tariff.isActive && tariff.id !== 'pickup-zone')
    .flatMap(tariff => tariff.plz);
}

/**
 * Calculates progress toward free delivery threshold
 * 
 * @param plz - Postal code
 * @param cartTotal - Current cart total
 * @returns Progress percentage (0-100)
 */
export function calculateFreeDeliveryProgress(plz: string, cartTotal: number): number {
  const tariff = getTariffByPLZ(plz);
  
  if (!tariff || tariff.lieferkosten_entfallen_ab === 0) {
    return 100; // Already free or no threshold
  }

  const progress = (cartTotal / tariff.lieferkosten_entfallen_ab) * 100;
  return Math.min(100, Math.max(0, progress));
}

/**
 * Gets human-readable delivery information for display
 * 
 * @param plz - Postal code
 * @param cartTotal - Current cart total
 * @returns Formatted delivery information
 */
export function getDeliveryDisplayInfo(plz: string, cartTotal: number) {
  const calculation = calculateDeliveryFee(plz, cartTotal);
  
  if (!calculation.tariff) {
    return {
      zoneName: 'Unknown Zone',
      deliveryFee: '0.00',
      freeDeliveryThreshold: '0.00',
      minimumOrder: '0.00',
      isFreeDelivery: false,
      meetsMinimum: false,
      missingForMinimum: '0.00',
      progressToFree: 0
    };
  }

  const progress = calculateFreeDeliveryProgress(plz, cartTotal);

  return {
    zoneName: calculation.tariff.name,
    deliveryFee: calculation.fee.toFixed(2),
    freeDeliveryThreshold: calculation.tariff.lieferkosten_entfallen_ab.toFixed(2),
    minimumOrder: calculation.tariff.mindestbestellwert.toFixed(2),
    isFreeDelivery: calculation.isFree,
    meetsMinimum: calculation.meetsMinimum,
    missingForMinimum: calculation.missingAmount.toFixed(2),
    progressToFree: Math.round(progress)
  };
}

// ===============================
// DEVELOPMENT & DEBUG HELPERS
// ===============================

/**
 * Development helper to validate tariff configuration
 * Should only be used in development/testing
 */
export function validateTariffConfiguration(): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check for duplicate PLZ codes across tariffs
  const allPLZs = DELIVERY_TARIFFS.flatMap(t => t.plz);
  const duplicates = allPLZs.filter((plz, index) => allPLZs.indexOf(plz) !== index);
  
  if (duplicates.length > 0) {
    errors.push(`Duplicate PLZ codes found: ${duplicates.join(', ')}`);
  }

  // Check for inactive tariffs
  const inactiveTariffs = DELIVERY_TARIFFS.filter(t => !t.isActive);
  if (inactiveTariffs.length > 0) {
    warnings.push(`${inactiveTariffs.length} inactive tariffs found`);
  }

  // Check for negative values
  DELIVERY_TARIFFS.forEach(tariff => {
    if (tariff.lieferkosten < 0) {
      errors.push(`Negative delivery cost in tariff ${tariff.id}`);
    }
    if (tariff.mindestbestellwert < 0) {
      errors.push(`Negative minimum order in tariff ${tariff.id}`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

// ===============================
// EXPORTS
// ===============================

const deliveryTariffUtils = {
  DELIVERY_TARIFFS,
  getTariffByPLZ,
  calculateDeliveryFee,
  isValidDeliveryZone,
  getAllDeliveryZones,
  calculateFreeDeliveryProgress,
  getDeliveryDisplayInfo,
  validateTariffConfiguration
};

export default deliveryTariffUtils;
