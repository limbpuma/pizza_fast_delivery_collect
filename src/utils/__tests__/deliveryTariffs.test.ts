/**
 * 🧪 UNIT TESTS - Delivery Tariff Configuration System
 * 
 * Testing the core business logic for PLZ-based delivery pricing
 * Ensures security and accuracy of tariff calculations
 * 
 * @version 1.0.0
 * @created June 24, 2025
 * @phase Phase 1 - Core Infrastructure
 */

import {
  DELIVERY_TARIFFS,
  getTariffByPLZ,
  calculateDeliveryFee,
  isValidDeliveryZone,
  getAllDeliveryZones,
  calculateFreeDeliveryProgress,
  getDeliveryDisplayInfo,
  validateTariffConfiguration,
  type DeliveryTariff
} from '../deliveryTariffs';

describe('🚚 Delivery Tariff Configuration System', () => {
  
  // ===============================
  // CONFIGURATION VALIDATION TESTS
  // ===============================
  
  describe('Configuration Validation', () => {
    test('should have valid tariff configuration', () => {
      const validation = validateTariffConfiguration();
      
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
      
      if (validation.warnings.length > 0) {
        console.warn('Tariff configuration warnings:', validation.warnings);
      }
    });

    test('should have all required tariff properties', () => {
      DELIVERY_TARIFFS.forEach(tariff => {
        expect(tariff).toHaveProperty('id');
        expect(tariff).toHaveProperty('name');
        expect(tariff).toHaveProperty('plz');
        expect(tariff).toHaveProperty('mindestbestellwert');
        expect(tariff).toHaveProperty('lieferkosten');
        expect(tariff).toHaveProperty('lieferkosten_entfallen_ab');
        expect(tariff).toHaveProperty('isActive');
        expect(tariff).toHaveProperty('priority');
        
        expect(typeof tariff.id).toBe('string');
        expect(typeof tariff.name).toBe('string');
        expect(Array.isArray(tariff.plz)).toBe(true);
        expect(typeof tariff.mindestbestellwert).toBe('number');
        expect(typeof tariff.lieferkosten).toBe('number');
        expect(typeof tariff.lieferkosten_entfallen_ab).toBe('number');
        expect(typeof tariff.isActive).toBe('boolean');
        expect(typeof tariff.priority).toBe('number');
      });
    });

    test('should have no negative values', () => {
      DELIVERY_TARIFFS.forEach(tariff => {
        expect(tariff.mindestbestellwert).toBeGreaterThanOrEqual(0);
        expect(tariff.lieferkosten).toBeGreaterThanOrEqual(0);
        expect(tariff.lieferkosten_entfallen_ab).toBeGreaterThanOrEqual(0);
      });
    });
  });

  // ===============================
  // PLZ LOOKUP TESTS
  // ===============================

  describe('getTariffByPLZ', () => {
    test('should return correct tariff for campus area (44149)', () => {
      const tariff = getTariffByPLZ('44149');
      
      expect(tariff).not.toBeNull();
      expect(tariff?.id).toBe('campus-free');
      expect(tariff?.lieferkosten).toBe(0);
      expect(tariff?.mindestbestellwert).toBe(12.00);
    });

    test('should return correct tariff for standard zones', () => {
      const tariff225 = getTariffByPLZ('44225');
      const tariff227 = getTariffByPLZ('44227');
      
      expect(tariff225?.id).toBe('zone-a-standard');
      expect(tariff227?.id).toBe('zone-a-standard');
      expect(tariff225?.lieferkosten).toBe(1.00);
      expect(tariff225?.lieferkosten_entfallen_ab).toBe(50.00);
    });

    test('should return correct tariff for premium zones', () => {
      const tariff = getTariffByPLZ('44135');
      
      expect(tariff?.id).toBe('zone-c-premium');
      expect(tariff?.mindestbestellwert).toBe(19.99);
      expect(tariff?.lieferkosten).toBe(1.50);
    });

    test('should return correct tariff for far zones', () => {
      const tariff = getTariffByPLZ('44143');
      
      expect(tariff?.id).toBe('zone-d-far');
      expect(tariff?.mindestbestellwert).toBe(30.00);
      expect(tariff?.lieferkosten).toBe(2.00);
      expect(tariff?.lieferkosten_entfallen_ab).toBe(60.00);
    });

    test('should handle pickup zone', () => {
      const tariff = getTariffByPLZ('abholung');
      
      expect(tariff?.id).toBe('pickup-zone');
      expect(tariff?.lieferkosten).toBe(0);
      expect(tariff?.mindestbestellwert).toBe(0);
    });

    test('should return null for invalid PLZ', () => {
      expect(getTariffByPLZ('99999')).toBeNull();
      expect(getTariffByPLZ('invalid')).toBeNull();
      expect(getTariffByPLZ('')).toBeNull();
      expect(getTariffByPLZ('   ')).toBeNull();
    });

    test('should handle PLZ with whitespace', () => {
      const tariff = getTariffByPLZ('  44149  ');
      expect(tariff?.id).toBe('campus-free');
    });

    test('should be case insensitive for pickup', () => {
      const tariff1 = getTariffByPLZ('abholung');
      const tariff2 = getTariffByPLZ('ABHOLUNG');
      const tariff3 = getTariffByPLZ('Abholung');
      
      expect(tariff1?.id).toBe('pickup-zone');
      expect(tariff2?.id).toBe('pickup-zone');
      expect(tariff3?.id).toBe('pickup-zone');
    });
  });

  // ===============================
  // DELIVERY FEE CALCULATION TESTS
  // ===============================

  describe('calculateDeliveryFee', () => {
    test('should calculate correct fee for campus area (free delivery)', () => {
      const result = calculateDeliveryFee('44149', 15.00);
      
      expect(result.fee).toBe(0);
      expect(result.isFree).toBe(true);
      expect(result.meetsMinimum).toBe(true);
      expect(result.missingAmount).toBe(0);
      expect(result.tariff?.id).toBe('campus-free');
    });

    test('should calculate correct fee for standard zone below threshold', () => {
      const result = calculateDeliveryFee('44225', 25.00);
      
      expect(result.fee).toBe(1.00);
      expect(result.isFree).toBe(false);
      expect(result.meetsMinimum).toBe(true);
      expect(result.missingAmount).toBe(0);
      expect(result.tariff?.id).toBe('zone-a-standard');
    });

    test('should calculate free delivery when threshold met', () => {
      const result = calculateDeliveryFee('44225', 50.00);
      
      expect(result.fee).toBe(0);
      expect(result.isFree).toBe(true);
      expect(result.meetsMinimum).toBe(true);
      expect(result.missingAmount).toBe(0);
    });

    test('should calculate missing amount when below minimum', () => {
      const result = calculateDeliveryFee('44135', 10.00); // Premium zone, min 19.99
      
      expect(result.meetsMinimum).toBe(false);
      expect(result.missingAmount).toBe(9.99);
      expect(result.fee).toBe(1.50);
    });

    test('should handle far zone pricing', () => {
      const result = calculateDeliveryFee('44143', 35.00); // Far zone
      
      expect(result.fee).toBe(2.00);
      expect(result.isFree).toBe(false);
      expect(result.meetsMinimum).toBe(true);
      expect(result.tariff?.id).toBe('zone-d-far');
    });

    test('should handle far zone free delivery', () => {
      const result = calculateDeliveryFee('44143', 60.00); // Far zone, free at 60
      
      expect(result.fee).toBe(0);
      expect(result.isFree).toBe(true);
      expect(result.meetsMinimum).toBe(true);
    });

    test('should handle invalid PLZ', () => {
      const result = calculateDeliveryFee('99999', 20.00);
      
      expect(result.fee).toBe(0);
      expect(result.isFree).toBe(false);
      expect(result.meetsMinimum).toBe(false);
      expect(result.tariff).toBeNull();
      expect(result.missingAmount).toBe(0);
    });

    test('should handle pickup zone', () => {
      const result = calculateDeliveryFee('abholung', 5.00);
      
      expect(result.fee).toBe(0);
      expect(result.isFree).toBe(true);
      expect(result.meetsMinimum).toBe(true);
      expect(result.missingAmount).toBe(0);
    });
  });

  // ===============================
  // VALIDATION TESTS
  // ===============================

  describe('isValidDeliveryZone', () => {
    test('should validate known delivery zones', () => {
      expect(isValidDeliveryZone('44149')).toBe(true);
      expect(isValidDeliveryZone('44225')).toBe(true);
      expect(isValidDeliveryZone('44135')).toBe(true);
      expect(isValidDeliveryZone('abholung')).toBe(true);
    });

    test('should reject invalid zones', () => {
      expect(isValidDeliveryZone('99999')).toBe(false);
      expect(isValidDeliveryZone('invalid')).toBe(false);
      expect(isValidDeliveryZone('')).toBe(false);
    });
  });

  describe('getAllDeliveryZones', () => {
    test('should return all delivery zones except pickup', () => {
      const zones = getAllDeliveryZones();
      
      expect(zones).toContain('44149');
      expect(zones).toContain('44225');
      expect(zones).toContain('44135');
      expect(zones).not.toContain('abholung');
      
      expect(zones.length).toBeGreaterThan(0);
    });

    test('should only include active zones', () => {
      const zones = getAllDeliveryZones();
      
      zones.forEach(plz => {
        const tariff = getTariffByPLZ(plz);
        expect(tariff?.isActive).toBe(true);
      });
    });
  });

  // ===============================
  // PROGRESS CALCULATION TESTS
  // ===============================

  describe('calculateFreeDeliveryProgress', () => {
    test('should calculate correct progress for standard zone', () => {
      expect(calculateFreeDeliveryProgress('44225', 25.00)).toBe(50); // 25/50 * 100
      expect(calculateFreeDeliveryProgress('44225', 0)).toBe(0);
      expect(calculateFreeDeliveryProgress('44225', 50.00)).toBe(100);
      expect(calculateFreeDeliveryProgress('44225', 75.00)).toBe(100); // Capped at 100
    });

    test('should handle campus area (already free)', () => {
      expect(calculateFreeDeliveryProgress('44149', 15.00)).toBe(100);
    });

    test('should handle far zones', () => {
      expect(calculateFreeDeliveryProgress('44143', 30.00)).toBe(50); // 30/60 * 100
      expect(calculateFreeDeliveryProgress('44143', 60.00)).toBe(100);
    });

    test('should handle invalid PLZ', () => {
      expect(calculateFreeDeliveryProgress('99999', 25.00)).toBe(100);
    });
  });

  // ===============================
  // DISPLAY INFO TESTS
  // ===============================

  describe('getDeliveryDisplayInfo', () => {
    test('should format display info correctly for campus area', () => {
      const info = getDeliveryDisplayInfo('44149', 15.00);
      
      expect(info.zoneName).toBe('Campus Area - Free Delivery');
      expect(info.deliveryFee).toBe('0.00');
      expect(info.isFreeDelivery).toBe(true);
      expect(info.meetsMinimum).toBe(true);
      expect(info.progressToFree).toBe(100);
    });

    test('should format display info correctly for standard zone', () => {
      const info = getDeliveryDisplayInfo('44225', 25.00);
      
      expect(info.zoneName).toBe('Zone A - Standard Delivery');
      expect(info.deliveryFee).toBe('1.00');
      expect(info.freeDeliveryThreshold).toBe('50.00');
      expect(info.isFreeDelivery).toBe(false);
      expect(info.meetsMinimum).toBe(true);
      expect(info.progressToFree).toBe(50);
    });

    test('should handle below minimum order', () => {
      const info = getDeliveryDisplayInfo('44135', 10.00); // Premium zone, min 19.99
      
      expect(info.meetsMinimum).toBe(false);
      expect(info.missingForMinimum).toBe('9.99');
    });

    test('should handle invalid PLZ gracefully', () => {
      const info = getDeliveryDisplayInfo('99999', 20.00);
      
      expect(info.zoneName).toBe('Unknown Zone');
      expect(info.deliveryFee).toBe('0.00');
      expect(info.isFreeDelivery).toBe(false);
      expect(info.meetsMinimum).toBe(false);
    });
  });

  // ===============================
  // EDGE CASES & SECURITY TESTS
  // ===============================

  describe('Edge Cases & Security', () => {
    test('should handle null and undefined inputs safely', () => {
      expect(() => getTariffByPLZ(null as any)).not.toThrow();
      expect(() => getTariffByPLZ(undefined as any)).not.toThrow();
      expect(() => calculateDeliveryFee('', 0)).not.toThrow();
      expect(() => calculateDeliveryFee('44149', -10)).not.toThrow();
    });

    test('should handle very large numbers', () => {
      const result = calculateDeliveryFee('44149', 999999);
      expect(result.meetsMinimum).toBe(true);
      expect(result.isFree).toBe(true);
    });

    test('should handle zero and negative cart totals', () => {
      const result1 = calculateDeliveryFee('44225', 0);
      expect(result1.meetsMinimum).toBe(false);
      expect(result1.missingAmount).toBe(12.00);
      
      const result2 = calculateDeliveryFee('44225', -10);
      expect(result2.meetsMinimum).toBe(false);
      expect(result2.missingAmount).toBe(22.00);
    });

    test('should maintain immutability of tariff configuration', () => {
      const originalTariffs = [...DELIVERY_TARIFFS];
      
      // Attempt to modify (should not affect original)
      const tariff = getTariffByPLZ('44149');
      if (tariff) {
        (tariff as any).lieferkosten = 999;
      }
      
      // Verify original is unchanged
      const freshTariff = getTariffByPLZ('44149');
      expect(freshTariff?.lieferkosten).toBe(0);
      expect(DELIVERY_TARIFFS).toEqual(originalTariffs);
    });
  });

  // ===============================
  // PERFORMANCE TESTS
  // ===============================

  describe('Performance', () => {
    test('should perform PLZ lookup quickly', () => {
      const start = performance.now();
      
      for (let i = 0; i < 1000; i++) {
        getTariffByPLZ('44149');
        getTariffByPLZ('44225');
        getTariffByPLZ('99999'); // Invalid
      }
      
      const end = performance.now();
      const duration = end - start;
      
      expect(duration).toBeLessThan(100); // Should complete in under 100ms
    });

    test('should perform fee calculation quickly', () => {
      const start = performance.now();
      
      for (let i = 0; i < 1000; i++) {
        calculateDeliveryFee('44149', 15.00);
        calculateDeliveryFee('44225', 25.00);
        calculateDeliveryFee('44143', 35.00);
      }
      
      const end = performance.now();
      const duration = end - start;
      
      expect(duration).toBeLessThan(100); // Should complete in under 100ms
    });
  });
});
