/**
 * 🧪 MANUAL TEST RUNNER - Delivery Tariff Configuration System
 * 
 * This script manually tests our delivery tariff system
 * without requiring Jest, ensuring our implementation works correctly
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
  validateTariffConfiguration
} from './deliveryTariffs.js';

// Simple test helper
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

function assertFalse(condition: boolean, testName: string) {
  console.log(`${!condition ? '✅' : '❌'} ${testName}`);
  return !condition;
}

function assertNotNull(value: any, testName: string) {
  const passed = value !== null && value !== undefined;
  console.log(`${passed ? '✅' : '❌'} ${testName}`);
  return passed;
}

function runTests() {
  console.log('🚚 DELIVERY TARIFF CONFIGURATION SYSTEM - MANUAL TESTS');
  console.log('='.repeat(60));
  
  let totalTests = 0;
  let passedTests = 0;

  // Test helper function
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
  // CONFIGURATION VALIDATION TESTS
  // ===============================
  
  console.log('\n📋 Configuration Validation Tests:');
  console.log('-'.repeat(40));

  test(() => {
    const validation = validateTariffConfiguration();
    return assertTrue(validation.isValid, 'Configuration should be valid') &&
           assertEqual(validation.errors.length, 0, 'Should have no errors');
  }, 'Configuration validation');

  test(() => {
    return assertTrue(DELIVERY_TARIFFS.length > 0, 'Should have tariff configurations');
  }, 'Tariff configurations exist');

  // ===============================
  // PLZ LOOKUP TESTS
  // ===============================

  console.log('\n🔍 PLZ Lookup Tests:');
  console.log('-'.repeat(40));

  test(() => {
    const tariff = getTariffByPLZ('44149');
    return assertNotNull(tariff, 'Campus PLZ should return tariff') &&
           assertEqual(tariff?.id, 'campus-free', 'Campus PLZ should return campus-free tariff') &&
           assertEqual(tariff?.lieferkosten, 0, 'Campus area should have free delivery');
  }, 'Campus area PLZ lookup (44149)');

  test(() => {
    const tariff = getTariffByPLZ('44225');
    return assertNotNull(tariff, 'Standard zone PLZ should return tariff') &&
           assertEqual(tariff?.id, 'zone-a-standard', 'Should return zone-a-standard') &&
           assertEqual(tariff?.lieferkosten, 1.00, 'Standard zone should have 1.00 delivery cost');
  }, 'Standard zone PLZ lookup (44225)');

  test(() => {
    const tariff = getTariffByPLZ('44135');
    return assertNotNull(tariff, 'Premium zone PLZ should return tariff') &&
           assertEqual(tariff?.id, 'zone-c-premium', 'Should return zone-c-premium') &&
           assertEqual(tariff?.mindestbestellwert, 19.99, 'Premium zone should have 19.99 minimum');
  }, 'Premium zone PLZ lookup (44135)');

  test(() => {
    const tariff = getTariffByPLZ('abholung');
    return assertNotNull(tariff, 'Pickup PLZ should return tariff') &&
           assertEqual(tariff?.id, 'pickup-zone', 'Should return pickup-zone') &&
           assertEqual(tariff?.lieferkosten, 0, 'Pickup should have no delivery cost');
  }, 'Pickup zone PLZ lookup (abholung)');

  test(() => {
    const tariff = getTariffByPLZ('99999');
    return assertEqual(tariff, null, 'Invalid PLZ should return null');
  }, 'Invalid PLZ lookup (99999)');

  test(() => {
    const tariff = getTariffByPLZ('  44149  ');
    return assertEqual(tariff?.id, 'campus-free', 'Should handle PLZ with whitespace');
  }, 'PLZ with whitespace');

  // ===============================
  // DELIVERY FEE CALCULATION TESTS
  // ===============================

  console.log('\n💰 Delivery Fee Calculation Tests:');
  console.log('-'.repeat(40));

  test(() => {
    const result = calculateDeliveryFee('44149', 15.00);
    return assertEqual(result.fee, 0, 'Campus area should have no fee') &&
           assertTrue(result.isFree, 'Campus area should have free delivery') &&
           assertTrue(result.meetsMinimum, 'Should meet minimum with 15.00');
  }, 'Campus area calculation (44149, 15.00)');

  test(() => {
    const result = calculateDeliveryFee('44225', 25.00);
    return assertEqual(result.fee, 1.00, 'Standard zone should have 1.00 fee') &&
           assertFalse(result.isFree, 'Should not be free under threshold') &&
           assertTrue(result.meetsMinimum, 'Should meet minimum with 25.00');
  }, 'Standard zone below free threshold (44225, 25.00)');

  test(() => {
    const result = calculateDeliveryFee('44225', 50.00);
    return assertEqual(result.fee, 0, 'Should be free at threshold') &&
           assertTrue(result.isFree, 'Should be free delivery') &&
           assertTrue(result.meetsMinimum, 'Should meet minimum');
  }, 'Standard zone at free threshold (44225, 50.00)');

  test(() => {
    const result = calculateDeliveryFee('44135', 10.00);
    return assertFalse(result.meetsMinimum, 'Should not meet premium minimum') &&
           assertEqual(result.missingAmount, 9.99, 'Should calculate missing amount correctly') &&
           assertEqual(result.fee, 1.50, 'Premium zone should have 1.50 fee');
  }, 'Premium zone below minimum (44135, 10.00)');

  test(() => {
    const result = calculateDeliveryFee('44143', 60.00);
    return assertEqual(result.fee, 0, 'Far zone should be free at 60.00') &&
           assertTrue(result.isFree, 'Should be free delivery') &&
           assertTrue(result.meetsMinimum, 'Should meet minimum');
  }, 'Far zone free delivery (44143, 60.00)');

  test(() => {
    const result = calculateDeliveryFee('99999', 20.00);
    return assertEqual(result.fee, 0, 'Invalid PLZ should return 0 fee') &&
           assertEqual(result.tariff, null, 'Invalid PLZ should return null tariff') &&
           assertFalse(result.meetsMinimum, 'Invalid PLZ should not meet minimum');
  }, 'Invalid PLZ calculation (99999, 20.00)');

  // ===============================
  // VALIDATION TESTS
  // ===============================

  console.log('\n✅ Validation Tests:');
  console.log('-'.repeat(40));

  test(() => {
    return assertTrue(isValidDeliveryZone('44149'), 'Campus PLZ should be valid') &&
           assertTrue(isValidDeliveryZone('44225'), 'Standard PLZ should be valid') &&
           assertTrue(isValidDeliveryZone('abholung'), 'Pickup should be valid') &&
           assertFalse(isValidDeliveryZone('99999'), 'Invalid PLZ should not be valid') &&
           assertFalse(isValidDeliveryZone(''), 'Empty PLZ should not be valid');
  }, 'PLZ validation');

  test(() => {
    const zones = getAllDeliveryZones();
    return assertTrue(zones.length > 0, 'Should return delivery zones') &&
           assertTrue(zones.includes('44149'), 'Should include campus PLZ') &&
           assertFalse(zones.includes('abholung'), 'Should not include pickup PLZ');
  }, 'Get all delivery zones');

  // ===============================
  // PROGRESS CALCULATION TESTS
  // ===============================

  console.log('\n📊 Progress Calculation Tests:');
  console.log('-'.repeat(40));

  test(() => {
    const progress25 = calculateFreeDeliveryProgress('44225', 25.00);
    const progress0 = calculateFreeDeliveryProgress('44225', 0);
    const progress50 = calculateFreeDeliveryProgress('44225', 50.00);
    
    return assertEqual(progress25, 50, 'Progress at 25/50 should be 50%') &&
           assertEqual(progress0, 0, 'Progress at 0 should be 0%') &&
           assertEqual(progress50, 100, 'Progress at threshold should be 100%');
  }, 'Free delivery progress calculation');

  test(() => {
    const progressCampus = calculateFreeDeliveryProgress('44149', 15.00);
    return assertEqual(progressCampus, 100, 'Campus area should always be 100%');
  }, 'Campus area progress (always free)');

  // ===============================
  // DISPLAY INFO TESTS
  // ===============================

  console.log('\n🖥️ Display Info Tests:');
  console.log('-'.repeat(40));

  test(() => {
    const info = getDeliveryDisplayInfo('44149', 15.00);
    return assertEqual(info.zoneName, 'Campus Area - Free Delivery', 'Campus zone name') &&
           assertEqual(info.deliveryFee, '0.00', 'Campus delivery fee should be 0.00') &&
           assertTrue(info.isFreeDelivery, 'Campus should show free delivery') &&
           assertEqual(info.progressToFree, 100, 'Campus progress should be 100%');
  }, 'Campus area display info');

  test(() => {
    const info = getDeliveryDisplayInfo('44225', 25.00);
    return assertEqual(info.zoneName, 'Zone A - Standard Delivery', 'Standard zone name') &&
           assertEqual(info.deliveryFee, '1.00', 'Standard delivery fee should be 1.00') &&
           assertFalse(info.isFreeDelivery, 'Should not show free delivery') &&
           assertEqual(info.progressToFree, 50, 'Progress should be 50%');
  }, 'Standard zone display info');

  test(() => {
    const info = getDeliveryDisplayInfo('99999', 20.00);
    return assertEqual(info.zoneName, 'Unknown Zone', 'Invalid PLZ should show Unknown Zone') &&
           assertFalse(info.isFreeDelivery, 'Invalid PLZ should not show free delivery') &&
           assertFalse(info.meetsMinimum, 'Invalid PLZ should not meet minimum');
  }, 'Invalid PLZ display info');

  // ===============================
  // EDGE CASES & SECURITY TESTS
  // ===============================

  console.log('\n🛡️ Edge Cases & Security Tests:');
  console.log('-'.repeat(40));

  test(() => {
    // Test null/undefined safety
    const tariff1 = getTariffByPLZ(null as any);
    const tariff2 = getTariffByPLZ(undefined as any);
    const result = calculateDeliveryFee('', 0);
    
    return assertEqual(tariff1, null, 'Null input should return null') &&
           assertEqual(tariff2, null, 'Undefined input should return null') &&
           assertNotNull(result, 'Empty PLZ calculation should not crash');
  }, 'Null/undefined input safety');

  test(() => {
    const result1 = calculateDeliveryFee('44225', 999999);
    const result2 = calculateDeliveryFee('44225', -10);
    
    return assertTrue(result1.meetsMinimum, 'Large numbers should work') &&
           assertTrue(result1.isFree, 'Large numbers should trigger free delivery') &&
           assertFalse(result2.meetsMinimum, 'Negative numbers should not meet minimum');
  }, 'Large and negative number handling');

  // ===============================
  // RESULTS SUMMARY
  // ===============================

  console.log('\n🎯 Test Results Summary:');
  console.log('='.repeat(60));
  console.log(`Total Tests: ${totalTests}`);
  console.log(`Passed: ${passedTests}`);
  console.log(`Failed: ${totalTests - passedTests}`);
  console.log(`Success Rate: ${Math.round((passedTests / totalTests) * 100)}%`);
  
  if (passedTests === totalTests) {
    console.log('\n🎉 ALL TESTS PASSED! ✅');
    console.log('The delivery tariff configuration system is working correctly.');
  } else {
    console.log('\n⚠️ SOME TESTS FAILED! ❌');
    console.log('Please review the failed tests and fix any issues.');
  }

  return passedTests === totalTests;
}

// Run the tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests();
}

export { runTests };
