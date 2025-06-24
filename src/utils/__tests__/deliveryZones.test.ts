/**
 * 🧪 UNIT TESTS - Refactored Delivery Zones System
 * 
 * Testing the refactored PLZ validation system that integrates
 * with the new tariff-based delivery configuration
 * 
 * @version 2.0.0
 * @created June 24, 2025
 * @phase Phase 1, Step 1.2 - PLZ Validation Refactor
 */

import {
  validatePLZ,
  isValidDeliveryZone,
  getDeliveryZones,
  getDeliveryZonesByCategory,
  getDeliveryZonesByCost,
  suggestNearbyDeliveryZones,
  searchDeliveryZones,
  isPremiumDeliveryZone,
  isFreeDeliveryZone,
  getDeliveryZoneStats,
  getDeliveryZonesList,
  compareValidationMethods,
  DELIVERY_ZONES,
  type PLZValidationResult,
  type DeliveryZoneInfo
} from '../deliveryZones';

describe('🚚 Refactored Delivery Zones System', () => {

  // ===============================
  // PLZ VALIDATION TESTS
  // ===============================

  describe('validatePLZ (Enhanced Validation)', () => {
    test('should return detailed validation for campus area', () => {
      const result = validatePLZ('44149');
      
      expect(result.isValid).toBe(true);
      expect(result.plz).toBe('44149');
      expect(result.tariff).not.toBeNull();
      expect(result.tariff?.id).toBe('campus-free');
      expect(result.zoneName).toBe('Campus Area - Free Delivery');
      expect(result.error).toBeUndefined();
    });

    test('should return detailed validation for standard zone', () => {
      const result = validatePLZ('44225');
      
      expect(result.isValid).toBe(true);
      expect(result.plz).toBe('44225');
      expect(result.tariff?.id).toBe('zone-a-standard');
      expect(result.zoneName).toBe('Zone A - Standard Delivery');
    });

    test('should handle invalid PLZ with detailed error', () => {
      const result = validatePLZ('99999');
      
      expect(result.isValid).toBe(false);
      expect(result.plz).toBe('99999');
      expect(result.tariff).toBeNull();
      expect(result.zoneName).toBe('Not Covered');
      expect(result.error).toBe('Delivery not available for this postal code');
      expect(result.warning).toBe('You can still pick up your order at our restaurant');
    });

    test('should handle invalid format with appropriate error', () => {
      const result = validatePLZ('abc');
      
      expect(result.isValid).toBe(false);
      expect(result.plz).toBe('abc');
      expect(result.error).toBe('Postal code must be exactly 5 digits');
    });

    test('should handle empty input', () => {
      const result = validatePLZ('');
      
      expect(result.isValid).toBe(false);
      expect(result.plz).toBe('');
      expect(result.error).toBe('Postal code is required');
    });

    test('should handle pickup zone', () => {
      const result = validatePLZ('abholung');
      
      expect(result.isValid).toBe(true);
      expect(result.plz).toBe('abholung');
      expect(result.tariff?.id).toBe('pickup-zone');
      expect(result.zoneName).toBe('Pickup - No Delivery');
    });

    test('should clean whitespace from input', () => {
      const result = validatePLZ('  44149  ');
      
      expect(result.isValid).toBe(true);
      expect(result.plz).toBe('44149');
    });
  });

  // ===============================
  // BACKWARD COMPATIBILITY TESTS
  // ===============================

  describe('isValidDeliveryZone (Legacy Compatibility)', () => {
    test('should maintain backward compatibility for valid zones', () => {
      expect(isValidDeliveryZone('44149')).toBe(true);
      expect(isValidDeliveryZone('44225')).toBe(true);
      expect(isValidDeliveryZone('44135')).toBe(true);
      expect(isValidDeliveryZone('abholung')).toBe(true);
    });

    test('should maintain backward compatibility for invalid zones', () => {
      expect(isValidDeliveryZone('99999')).toBe(false);
      expect(isValidDeliveryZone('invalid')).toBe(false);
      expect(isValidDeliveryZone('')).toBe(false);
    });

    test('should work with legacy DELIVERY_ZONES constant', () => {
      expect(Array.isArray(DELIVERY_ZONES)).toBe(true);
      expect(DELIVERY_ZONES.length).toBeGreaterThan(0);
      expect(DELIVERY_ZONES).toContain('44149');
    });
  });

  // ===============================
  // ENHANCED DELIVERY ZONES TESTS
  // ===============================

  describe('getDeliveryZones (Enhanced)', () => {
    test('should return enhanced zone information without pickup', () => {
      const zones = getDeliveryZones(false);
      
      expect(Array.isArray(zones)).toBe(true);
      expect(zones.length).toBeGreaterThan(0);
      expect(zones.every(zone => !zone.isPickupZone)).toBe(true);
      
      const campusZone = zones.find(zone => zone.plz === '44149');
      expect(campusZone).toBeDefined();
      expect(campusZone?.zoneName).toBe('Campus Area - Free Delivery');
      expect(campusZone?.deliveryCost).toBe(0);
    });

    test('should include pickup zone when requested', () => {
      const zones = getDeliveryZones(true);
      
      const pickupZone = zones.find(zone => zone.isPickupZone);
      expect(pickupZone).toBeDefined();
      expect(pickupZone?.plz).toBe('abholung');
      expect(pickupZone?.zoneName).toBe('Pickup - No Delivery');
    });

    test('should return zones sorted correctly', () => {
      const zones = getDeliveryZones(true);
      
      // Pickup zones should be last
      const pickupIndex = zones.findIndex(zone => zone.isPickupZone);
      const lastPickupIndex = zones.lastIndexOf(zones.find(zone => zone.isPickupZone)!);
      
      if (pickupIndex !== -1) {
        expect(pickupIndex).toBeGreaterThan(-1);
        // All pickup zones should be at the end
        zones.slice(pickupIndex).forEach(zone => {
          expect(zone.isPickupZone).toBe(true);
        });
      }
    });
  });

  describe('getDeliveryZonesByCategory', () => {
    test('should categorize zones correctly', () => {
      const categories = getDeliveryZonesByCategory();
      
      expect(categories).toHaveProperty('free');
      expect(categories).toHaveProperty('standard');
      expect(categories).toHaveProperty('premium');
      expect(categories).toHaveProperty('pickup');
      
      expect(Array.isArray(categories.free)).toBe(true);
      expect(Array.isArray(categories.standard)).toBe(true);
      expect(Array.isArray(categories.premium)).toBe(true);
      expect(Array.isArray(categories.pickup)).toBe(true);
    });

    test('should have campus area in free category', () => {
      const categories = getDeliveryZonesByCategory();
      
      const campusInFree = categories.free.find(zone => zone.plz === '44149');
      expect(campusInFree).toBeDefined();
    });

    test('should categorize by delivery cost correctly', () => {
      const categories = getDeliveryZonesByCategory();
      
      categories.free.forEach(zone => {
        expect(zone.deliveryCost).toBe(0);
        expect(zone.isPickupZone).toBe(false);
      });

      categories.standard.forEach(zone => {
        expect(zone.deliveryCost).toBeGreaterThan(0);
        expect(zone.deliveryCost).toBeLessThanOrEqual(1.50);
      });

      categories.premium.forEach(zone => {
        expect(zone.deliveryCost).toBeGreaterThan(1.50);
      });
    });
  });

  // ===============================
  // SEARCH & SUGGESTION TESTS
  // ===============================

  describe('suggestNearbyDeliveryZones', () => {
    test('should suggest nearby zones for valid input', () => {
      const suggestions = suggestNearbyDeliveryZones('44150', 3);
      
      expect(Array.isArray(suggestions)).toBe(true);
      expect(suggestions.length).toBeLessThanOrEqual(3);
      
      if (suggestions.length > 0) {
        expect(suggestions[0]).toHaveProperty('plz');
        expect(suggestions[0]).toHaveProperty('zoneName');
        expect(suggestions[0]).toHaveProperty('distance');
      }
    });

    test('should return empty array for invalid input', () => {
      expect(suggestNearbyDeliveryZones('abc')).toEqual([]);
      expect(suggestNearbyDeliveryZones('')).toEqual([]);
    });

    test('should not suggest exact matches', () => {
      const suggestions = suggestNearbyDeliveryZones('44149');
      
      expect(suggestions.find(s => s.plz === '44149')).toBeUndefined();
    });
  });

  describe('searchDeliveryZones', () => {
    test('should search by partial PLZ', () => {
      const results = searchDeliveryZones('441');
      
      expect(Array.isArray(results)).toBe(true);
      results.forEach(zone => {
        expect(zone.plz.includes('441')).toBe(true);
      });
    });

    test('should search by zone name', () => {
      const results = searchDeliveryZones('campus');
      
      expect(Array.isArray(results)).toBe(true);
      
      const campusZone = results.find(zone => 
        zone.zoneName.toLowerCase().includes('campus')
      );
      expect(campusZone).toBeDefined();
    });

    test('should be case insensitive', () => {
      const results1 = searchDeliveryZones('CAMPUS');
      const results2 = searchDeliveryZones('campus');
      
      expect(results1.length).toBe(results2.length);
    });

    test('should return empty array for empty query', () => {
      expect(searchDeliveryZones('')).toEqual([]);
      expect(searchDeliveryZones('   ')).toEqual([]);
    });
  });

  // ===============================
  // UTILITY FUNCTION TESTS
  // ===============================

  describe('isPremiumDeliveryZone', () => {
    test('should identify premium zones correctly', () => {
      expect(isPremiumDeliveryZone('44135')).toBe(true); // Premium zone
      expect(isPremiumDeliveryZone('44149')).toBe(false); // Campus (free)
      expect(isPremiumDeliveryZone('44225')).toBe(false); // Standard zone
      expect(isPremiumDeliveryZone('99999')).toBe(false); // Invalid
    });
  });

  describe('isFreeDeliveryZone', () => {
    test('should identify free delivery zones correctly', () => {
      expect(isFreeDeliveryZone('44149')).toBe(true); // Campus area
      expect(isFreeDeliveryZone('44225')).toBe(false); // Standard zone
      expect(isFreeDeliveryZone('99999')).toBe(false); // Invalid
    });
  });

  describe('getDeliveryZoneStats', () => {
    test('should return comprehensive statistics', () => {
      const stats = getDeliveryZoneStats();
      
      expect(stats).toHaveProperty('totalZones');
      expect(stats).toHaveProperty('freeZones');
      expect(stats).toHaveProperty('standardZones');
      expect(stats).toHaveProperty('premiumZones');
      expect(stats).toHaveProperty('averageDeliveryCost');
      expect(stats).toHaveProperty('averageMinimumOrder');
      expect(stats).toHaveProperty('priceRange');
      
      expect(typeof stats.totalZones).toBe('number');
      expect(typeof stats.averageDeliveryCost).toBe('number');
      expect(stats.priceRange).toHaveProperty('min');
      expect(stats.priceRange).toHaveProperty('max');
    });

    test('should calculate averages correctly', () => {
      const stats = getDeliveryZoneStats();
      
      expect(stats.averageDeliveryCost).toBeGreaterThanOrEqual(0);
      expect(stats.averageMinimumOrder).toBeGreaterThanOrEqual(0);
      expect(stats.priceRange.min).toBeLessThanOrEqual(stats.priceRange.max);
    });
  });

  // ===============================
  // MIGRATION & COMPATIBILITY TESTS
  // ===============================

  describe('compareValidationMethods', () => {
    test('should compare old and new validation methods', () => {
      const comparison = compareValidationMethods('44149');
      
      expect(comparison).toHaveProperty('plz');
      expect(comparison).toHaveProperty('oldMethod');
      expect(comparison).toHaveProperty('newMethod');
      expect(comparison).toHaveProperty('matches');
      expect(comparison).toHaveProperty('tariffInfo');
      
      expect(typeof comparison.oldMethod).toBe('boolean');
      expect(typeof comparison.newMethod).toBe('boolean');
    });

    test('should show tariff info for valid PLZ', () => {
      const comparison = compareValidationMethods('44149');
      
      if (comparison.newMethod) {
        expect(comparison.tariffInfo).not.toBeNull();
        expect(comparison.tariffInfo).toHaveProperty('id');
        expect(comparison.tariffInfo).toHaveProperty('cost');
        expect(comparison.tariffInfo).toHaveProperty('minimum');
      }
    });
  });

  describe('getDeliveryZonesList (Legacy)', () => {
    test('should maintain legacy function behavior', () => {
      const zones = getDeliveryZonesList();
      
      expect(Array.isArray(zones)).toBe(true);
      expect(zones.length).toBeGreaterThan(0);
      expect(zones.every(zone => typeof zone === 'string')).toBe(true);
      expect(zones).toContain('44149');
    });
  });

  // ===============================
  // EDGE CASES & ERROR HANDLING
  // ===============================

  describe('Edge Cases & Error Handling', () => {
    test('should handle null and undefined inputs safely', () => {
      expect(() => validatePLZ(null as any)).not.toThrow();
      expect(() => validatePLZ(undefined as any)).not.toThrow();
      expect(() => isValidDeliveryZone(null as any)).not.toThrow();
      
      expect(validatePLZ(null as any).isValid).toBe(false);
      expect(isValidDeliveryZone(null as any)).toBe(false);
    });

    test('should handle malformed PLZ inputs', () => {
      const testCases = ['123', '123456', 'abc12', '12 34 5', '!@#$%'];
      
      testCases.forEach(testCase => {
        const result = validatePLZ(testCase);
        expect(result.isValid).toBe(false);
        expect(result.error).toBeDefined();
      });
    });

    test('should handle very large search queries', () => {
      const largeQuery = 'a'.repeat(1000);
      expect(() => searchDeliveryZones(largeQuery)).not.toThrow();
      
      const results = searchDeliveryZones(largeQuery);
      expect(Array.isArray(results)).toBe(true);
    });
  });

  // ===============================
  // PERFORMANCE TESTS
  // ===============================

  describe('Performance', () => {
    test('should perform validation quickly', () => {
      const start = performance.now();
      
      for (let i = 0; i < 1000; i++) {
        validatePLZ('44149');
        validatePLZ('44225');
        validatePLZ('99999');
      }
      
      const end = performance.now();
      const duration = end - start;
      
      expect(duration).toBeLessThan(100); // Should complete in under 100ms
    });

    test('should handle large zone lists efficiently', () => {
      const start = performance.now();
      
      for (let i = 0; i < 100; i++) {
        getDeliveryZones(true);
        getDeliveryZonesByCategory();
        getDeliveryZoneStats();
      }
      
      const end = performance.now();
      const duration = end - start;
      
      expect(duration).toBeLessThan(200); // Should complete in under 200ms
    });
  });

  // ===============================
  // INTEGRATION WITH TARIFF SYSTEM
  // ===============================

  describe('Integration with Tariff System', () => {
    test('should use tariff data consistently', () => {
      const validation = validatePLZ('44149');
      const zones = getDeliveryZones(false);
      const campusZone = zones.find(zone => zone.plz === '44149');
      
      if (validation.isValid && validation.tariff && campusZone) {
        expect(campusZone.deliveryCost).toBe(validation.tariff.lieferkosten);
        expect(campusZone.minimumOrder).toBe(validation.tariff.mindestbestellwert);
        expect(campusZone.freeDeliveryThreshold).toBe(validation.tariff.lieferkosten_entfallen_ab);
      }
    });

    test('should maintain consistency across all functions', () => {
      const testPLZ = '44225';
      
      const validation = validatePLZ(testPLZ);
      const isValid = isValidDeliveryZone(testPLZ);
      const zones = getDeliveryZones(false);
      const zone = zones.find(z => z.plz === testPLZ);
      
      expect(validation.isValid).toBe(isValid);
      
      if (validation.isValid && zone) {
        expect(zone.zoneName).toBe(validation.zoneName);
      }
    });
  });
});
