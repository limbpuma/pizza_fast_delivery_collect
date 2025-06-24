/**
 * 🧪 MANUAL TEST RUNNER - Refactored Delivery Zones System
 * 
 * This script manually tests the refactored delivery zones system
 * ensuring backward compatibility and new enhanced functionality
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
  isPremiumDeliveryZone,
  isFreeDeliveryZone,
  getDeliveryZoneStats,
  compareValidationMethods,
  DELIVERY_ZONES
} from './deliveryZones.js';

// Simple test helpers
function assertEqual(actual: any, expected: any, testName: string) {
  const passed = JSON.stringify(actual) === JSON.stringify(expected);
  console.log(`${passed ? '✅' : '❌'} ${testName}`);
  if (!passed) {
    console.log(`   Expected: ${JSON.stringify(expected)}`);
    console.log(`   Actual: ${JSON.stringify(actual)}`);
  }
  return passed;
}

function assertTrue(condition: boolean, testName: string) {
  console.log(`${condition ? '✅' : '❌'} ${testName}`);
  return condition;
}

function assertNotNull(value: any, testName: string) {
  const passed = value !== null && value !== undefined;
  console.log(`${passed ? '✅' : '❌'} ${testName}`);
  return passed;
}

function runRefactoredTests() {
  console.log('🚚 REFACTORED DELIVERY ZONES SYSTEM - MANUAL TESTS');
  console.log('='.repeat(65));
  
  let totalTests = 0;
  let passedTests = 0;

  const test = (testFn: () => boolean, testName: string) => {
    totalTests++;
    try {
      if (testFn()) {
        passedTests++;
      }
    } catch (error) {
      console.log(`❌ ${testName} - ERROR: ${error}`);
    }
  };

  // ===============================
  // ENHANCED PLZ VALIDATION TESTS
  // ===============================
  
  console.log('\n🔍 Enhanced PLZ Validation Tests:');
  console.log('-'.repeat(50));

  test(() => {
    const result = validatePLZ('44149');
    return assertTrue(result.isValid, 'Campus PLZ should be valid') &&
           assertEqual(result.plz, '44149', 'Should return cleaned PLZ') &&
           assertNotNull(result.tariff, 'Should return tariff info') &&
           assertEqual(result.zoneName, 'Campus Area - Free Delivery', 'Should return correct zone name');
  }, 'Enhanced validation for campus area (44149)');

  test(() => {
    const result = validatePLZ('44225');
    return assertTrue(result.isValid, 'Standard PLZ should be valid') &&
           assertEqual(result.tariff?.id, 'zone-a-standard', 'Should return standard zone tariff');
  }, 'Enhanced validation for standard zone (44225)');

  test(() => {
    const result = validatePLZ('99999');
    return assertTrue(!result.isValid, 'Invalid PLZ should not be valid') &&
           assertEqual(result.tariff, null, 'Should return null tariff') &&
           assertEqual(result.error, 'Delivery not available for this postal code', 'Should return appropriate error');
  }, 'Enhanced validation for invalid PLZ (99999)');

  test(() => {
    const result = validatePLZ('');
    return assertTrue(!result.isValid, 'Empty PLZ should not be valid') &&
           assertEqual(result.error, 'Postal code is required', 'Should return required error');
  }, 'Enhanced validation for empty PLZ');

  test(() => {
    const result = validatePLZ('abholung');
    return assertTrue(result.isValid, 'Pickup should be valid') &&
           assertEqual(result.tariff?.id, 'pickup-zone', 'Should return pickup tariff');
  }, 'Enhanced validation for pickup (abholung)');

  test(() => {
    const result = validatePLZ('  44149  ');
    return assertTrue(result.isValid, 'Should handle whitespace') &&
           assertEqual(result.plz, '44149', 'Should clean whitespace');
  }, 'PLZ validation with whitespace');

  // ===============================
  // BACKWARD COMPATIBILITY TESTS
  // ===============================

  console.log('\n🔄 Backward Compatibility Tests:');
  console.log('-'.repeat(50));

  test(() => {
    return assertTrue(isValidDeliveryZone('44149'), 'Legacy function should work for campus') &&
           assertTrue(isValidDeliveryZone('44225'), 'Legacy function should work for standard') &&
           assertTrue(!isValidDeliveryZone('99999'), 'Legacy function should reject invalid PLZ');
  }, 'Legacy isValidDeliveryZone function');

  test(() => {
    return assertTrue(Array.isArray(DELIVERY_ZONES), 'Legacy DELIVERY_ZONES should be array') &&
           assertTrue(DELIVERY_ZONES.length > 0, 'Legacy array should have entries') &&
           assertTrue(DELIVERY_ZONES.includes('44149'), 'Legacy array should include campus PLZ');
  }, 'Legacy DELIVERY_ZONES constant');

  // ===============================
  // ENHANCED FEATURES TESTS
  // ===============================

  console.log('\n✨ Enhanced Features Tests:');
  console.log('-'.repeat(50));

  test(() => {
    const zones = getDeliveryZones(false);
    const campusZone = zones.find(zone => zone.plz === '44149');
    
    return assertTrue(Array.isArray(zones), 'Should return array of zones') &&
           assertNotNull(campusZone, 'Should include campus zone') &&
           assertEqual(campusZone?.deliveryCost, 0, 'Campus should have free delivery') &&
           assertTrue(zones.every(zone => !zone.isPickupZone), 'Should not include pickup when excluded');
  }, 'Enhanced getDeliveryZones without pickup');

  test(() => {
    const zones = getDeliveryZones(true);
    const pickupZone = zones.find(zone => zone.isPickupZone);
    
    return assertNotNull(pickupZone, 'Should include pickup when requested') &&
           assertEqual(pickupZone?.plz, 'abholung', 'Pickup zone should have correct PLZ');
  }, 'Enhanced getDeliveryZones with pickup');

  test(() => {
    const categories = getDeliveryZonesByCategory();
    
    return assertNotNull(categories.free, 'Should have free category') &&
           assertNotNull(categories.standard, 'Should have standard category') &&
           assertNotNull(categories.premium, 'Should have premium category') &&
           assertTrue(categories.free.some(zone => zone.plz === '44149'), 'Campus should be in free category');
  }, 'Zone categorization');

  test(() => {
    return assertTrue(isFreeDeliveryZone('44149'), 'Campus should be free delivery zone') &&
           assertTrue(!isFreeDeliveryZone('44225'), 'Standard zone should not be free') &&
           assertTrue(isPremiumDeliveryZone('44135'), 'Premium zone should be identified correctly');
  }, 'Zone type identification');

  test(() => {
    const stats = getDeliveryZoneStats();
    
    return assertNotNull(stats.totalZones, 'Should have total zones count') &&
           assertNotNull(stats.averageDeliveryCost, 'Should have average cost') &&
           assertNotNull(stats.priceRange, 'Should have price range') &&
           assertTrue(stats.totalZones > 0, 'Should have positive zone count');
  }, 'Delivery zone statistics');

  // ===============================
  // MIGRATION COMPATIBILITY TESTS
  // ===============================

  console.log('\n🔄 Migration Compatibility Tests:');
  console.log('-'.repeat(50));

  test(() => {
    const testPLZs = ['44149', '44225', '44135', '99999'];
    let allMatch = true;
    
    testPLZs.forEach(plz => {
      const comparison = compareValidationMethods(plz);
      if (!comparison.matches) {
        console.log(`   Mismatch for ${plz}: old=${comparison.oldMethod}, new=${comparison.newMethod}`);
        allMatch = false;
      }
    });
    
    return assertTrue(allMatch, 'Old and new validation methods should match for known PLZ codes');
  }, 'Migration validation comparison');

  // ===============================
  // INTEGRATION WITH TARIFF SYSTEM
  // ===============================

  console.log('\n🔗 Integration with Tariff System Tests:');
  console.log('-'.repeat(50));

  test(() => {
    const validation = validatePLZ('44225');
    const zones = getDeliveryZones(false);
    const zone = zones.find(z => z.plz === '44225');
    
    if (validation.isValid && validation.tariff && zone) {
      return assertEqual(zone.deliveryCost, validation.tariff.lieferkosten, 'Zone cost should match tariff') &&
             assertEqual(zone.minimumOrder, validation.tariff.mindestbestellwert, 'Minimum order should match tariff') &&
             assertEqual(zone.freeDeliveryThreshold, validation.tariff.lieferkosten_entfallen_ab, 'Free delivery threshold should match tariff');
    }
    return false;
  }, 'Consistency between validation and zone data');

  test(() => {
    const legacyValid = isValidDeliveryZone('44149');
    const enhancedValidation = validatePLZ('44149');
    
    return assertEqual(legacyValid, enhancedValidation.isValid, 'Legacy and enhanced validation should agree');
  }, 'Consistency between legacy and enhanced validation');

  // ===============================
  // ERROR HANDLING TESTS
  // ===============================

  console.log('\n🛡️ Error Handling Tests:');
  console.log('-'.repeat(50));

  test(() => {
    const nullResult = validatePLZ(null as any);
    const undefinedResult = validatePLZ(undefined as any);
    
    return assertTrue(!nullResult.isValid, 'Null input should be invalid') &&
           assertTrue(!undefinedResult.isValid, 'Undefined input should be invalid');
  }, 'Null and undefined input handling');

  test(() => {
    const invalidFormats = ['123', '123456', 'abc12', '!@#$%'];
    
    return invalidFormats.every(format => {
      const result = validatePLZ(format);
      return !result.isValid && result.error === 'Postal code must be exactly 5 digits';
    });
  }, 'Invalid format handling');

  // ===============================
  // RESULTS SUMMARY
  // ===============================

  console.log('\n🎯 Test Results Summary:');
  console.log('='.repeat(65));
  console.log(`Total Tests: ${totalTests}`);
  console.log(`Passed: ${passedTests}`);
  console.log(`Failed: ${totalTests - passedTests}`);
  console.log(`Success Rate: ${Math.round((passedTests / totalTests) * 100)}%`);
  
  if (passedTests === totalTests) {
    console.log('\n🎉 ALL TESTS PASSED! ✅');
    console.log('The refactored delivery zones system is working correctly.');
    console.log('✅ Backward compatibility maintained');
    console.log('✅ Enhanced functionality working');
    console.log('✅ Integration with tariff system successful');
  } else {
    console.log('\n⚠️ SOME TESTS FAILED! ❌');
    console.log('Please review the failed tests and fix any issues.');
  }

  return passedTests === totalTests;
}

// Run the tests if this file is executed directly
if (typeof window === 'undefined') {
  runRefactoredTests();
}

export { runRefactoredTests };
