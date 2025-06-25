/**
 * 🧪 DELIVERY TARIFF CALCULATION TEST
 * 
 * Test suite to verify the new tariff calculation system
 * Tests various PLZ codes and order amounts to ensure correct pricing
 * 
 * @version 1.0.0
 * @created June 25, 2025
 */

import { 
  getTariffByPLZ, 
  calculateDeliveryFee, 
  getDeliveryDisplayInfo,
  validateTariffConfiguration 
} from './src/utils/deliveryTariffs';

// Test scenarios based on new tariff configuration
const TEST_SCENARIOS = [
  // Zone 1 - Campus Area (FREE)
  {
    plz: '44149',
    orderAmount: 15.00,
    expectedZone: 'Zone 1 - Campus Area (FREE)',
    expectedMinimum: 12.00,
    expectedDeliveryFee: 0.00,
    expectedMeetsMinimum: true,
    expectedIsFree: true
  },
  {
    plz: '44149',
    orderAmount: 10.00,
    expectedZone: 'Zone 1 - Campus Area (FREE)',
    expectedMinimum: 12.00,
    expectedDeliveryFee: 0.00,
    expectedMeetsMinimum: false,
    expectedIsFree: true
  },

  // Zone 2A - Close Areas (1€ fee, free at 50€)
  {
    plz: '44225',
    orderAmount: 25.00,
    expectedZone: 'Zone 2A - Close Areas',
    expectedMinimum: 12.00,
    expectedDeliveryFee: 1.00,
    expectedMeetsMinimum: true,
    expectedIsFree: false
  },
  {
    plz: '44227',
    orderAmount: 55.00,
    expectedZone: 'Zone 2A - Close Areas',
    expectedMinimum: 12.00,
    expectedDeliveryFee: 0.00,
    expectedMeetsMinimum: true,
    expectedIsFree: true
  },
  {
    plz: '44225',
    orderAmount: 8.00,
    expectedZone: 'Zone 2A - Close Areas',
    expectedMinimum: 12.00,
    expectedDeliveryFee: 1.00,
    expectedMeetsMinimum: false,
    expectedIsFree: false
  },

  // Zone 2B - Mid Areas (1€ fee, free at 50€)
  {
    plz: '44369',
    orderAmount: 20.00,
    expectedZone: 'Zone 2B - Mid Areas',
    expectedMinimum: 15.00,
    expectedDeliveryFee: 1.00,
    expectedMeetsMinimum: true,
    expectedIsFree: false
  },
  {
    plz: '44379',
    orderAmount: 12.00,
    expectedZone: 'Zone 2B - Mid Areas',
    expectedMinimum: 15.00,
    expectedDeliveryFee: 1.00,
    expectedMeetsMinimum: false,
    expectedIsFree: false
  },

  // Zone 3A - Extended Areas (1.50€ fee, free at 50€)
  {
    plz: '44135',
    orderAmount: 25.00,
    expectedZone: 'Zone 3A - Extended Areas',
    expectedMinimum: 19.99,
    expectedDeliveryFee: 1.50,
    expectedMeetsMinimum: true,
    expectedIsFree: false
  },
  {
    plz: '44139',
    orderAmount: 15.00,
    expectedZone: 'Zone 3A - Extended Areas',
    expectedMinimum: 19.99,
    expectedDeliveryFee: 1.50,
    expectedMeetsMinimum: false,
    expectedIsFree: false
  },
  {
    plz: '44147',
    orderAmount: 55.00,
    expectedZone: 'Zone 3A - Extended Areas',
    expectedMinimum: 19.99,
    expectedDeliveryFee: 0.00,
    expectedMeetsMinimum: true,
    expectedIsFree: true
  },

  // Zone 3B - Far Areas (2€ fee, free at 60€)
  {
    plz: '44143',
    orderAmount: 35.00,
    expectedZone: 'Zone 3B - Far Areas',
    expectedMinimum: 30.00,
    expectedDeliveryFee: 2.00,
    expectedMeetsMinimum: true,
    expectedIsFree: false
  },
  {
    plz: '44141',
    orderAmount: 25.00,
    expectedZone: 'Zone 3B - Far Areas',
    expectedMinimum: 30.00,
    expectedDeliveryFee: 2.00,
    expectedMeetsMinimum: false,
    expectedIsFree: false
  },
  {
    plz: '44229',
    orderAmount: 65.00,
    expectedZone: 'Zone 3B - Far Areas',
    expectedMinimum: 30.00,
    expectedDeliveryFee: 0.00,
    expectedMeetsMinimum: true,
    expectedIsFree: true
  },

  // Zone 4 - Outer Areas (2€ fee, free at 60€)
  {
    plz: '44359',
    orderAmount: 35.00,
    expectedZone: 'Zone 4 - Outer Areas',
    expectedMinimum: 30.00,
    expectedDeliveryFee: 2.00,
    expectedMeetsMinimum: true,
    expectedIsFree: false
  },
  {
    plz: '44357',
    orderAmount: 70.00,
    expectedZone: 'Zone 4 - Outer Areas',
    expectedMinimum: 30.00,
    expectedDeliveryFee: 0.00,
    expectedMeetsMinimum: true,
    expectedIsFree: true
  },

  // Pickup
  {
    plz: 'abholung',
    orderAmount: 5.00,
    expectedZone: 'Pickup - Restaurant Collection',
    expectedMinimum: 0.00,
    expectedDeliveryFee: 0.00,
    expectedMeetsMinimum: true,
    expectedIsFree: true
  }
];

/**
 * Run comprehensive test suite
 */
function runDeliveryTariffTests() {
  console.log('🧪 STARTING DELIVERY TARIFF CALCULATION TESTS');
  console.log('='.repeat(60));
  
  // First, validate tariff configuration
  console.log('\n📋 VALIDATING TARIFF CONFIGURATION...');
  const validation = validateTariffConfiguration();
  
  if (!validation.isValid) {
    console.error('❌ CONFIGURATION VALIDATION FAILED:');
    validation.errors.forEach(error => console.error(`   - ${error}`));
    return false;
  }
  
  if (validation.warnings.length > 0) {
    console.warn('⚠️  CONFIGURATION WARNINGS:');
    validation.warnings.forEach(warning => console.warn(`   - ${warning}`));
  }
  
  console.log('✅ Configuration validation passed');
  
  // Run test scenarios
  console.log('\n🎯 RUNNING TEST SCENARIOS...');
  let passedTests = 0;
  let failedTests = 0;
  
  TEST_SCENARIOS.forEach((scenario, index) => {
    console.log(`\n--- Test ${index + 1}: PLZ ${scenario.plz}, Order: €${scenario.orderAmount} ---`);
    
    try {
      // Get tariff
      const tariff = getTariffByPLZ(scenario.plz);
      if (!tariff) {
        console.error(`❌ No tariff found for PLZ ${scenario.plz}`);
        failedTests++;
        return;
      }
      
      // Calculate delivery fee
      const calculation = calculateDeliveryFee(scenario.plz, scenario.orderAmount);
      
      // Get display info
      const displayInfo = getDeliveryDisplayInfo(scenario.plz, scenario.orderAmount);
      
      // Verify results
      const tests = [
        {
          name: 'Zone Name',
          actual: tariff.name,
          expected: scenario.expectedZone,
          passed: tariff.name === scenario.expectedZone
        },
        {
          name: 'Minimum Order',
          actual: tariff.mindestbestellwert,
          expected: scenario.expectedMinimum,
          passed: Math.abs(tariff.mindestbestellwert - scenario.expectedMinimum) < 0.01
        },
        {
          name: 'Delivery Fee',
          actual: calculation.fee,
          expected: scenario.expectedDeliveryFee,
          passed: Math.abs(calculation.fee - scenario.expectedDeliveryFee) < 0.01
        },
        {
          name: 'Meets Minimum',
          actual: calculation.meetsMinimum,
          expected: scenario.expectedMeetsMinimum,
          passed: calculation.meetsMinimum === scenario.expectedMeetsMinimum
        },
        {
          name: 'Is Free Delivery',
          actual: calculation.isFree,
          expected: scenario.expectedIsFree,
          passed: calculation.isFree === scenario.expectedIsFree
        }
      ];
      
      let testPassed = true;
      tests.forEach(test => {
        if (test.passed) {
          console.log(`   ✅ ${test.name}: ${test.actual}`);
        } else {
          console.error(`   ❌ ${test.name}: Expected ${test.expected}, got ${test.actual}`);
          testPassed = false;
        }
      });
      
      // Additional info
      console.log(`   📊 Missing for minimum: €${calculation.missingAmount.toFixed(2)}`);
      console.log(`   📈 Progress to free delivery: ${displayInfo.progressToFree}%`);
      
      if (testPassed) {
        passedTests++;
        console.log('   🎉 TEST PASSED');
      } else {
        failedTests++;
        console.log('   💥 TEST FAILED');
      }
      
    } catch (error) {
      console.error(`   💥 TEST ERROR: ${error.message}`);
      failedTests++;
    }
  });
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 TEST SUMMARY');
  console.log(`✅ Passed: ${passedTests}`);
  console.log(`❌ Failed: ${failedTests}`);
  console.log(`📈 Success Rate: ${((passedTests / (passedTests + failedTests)) * 100).toFixed(1)}%`);
  
  if (failedTests === 0) {
    console.log('\n🎉 ALL TESTS PASSED! The tariff calculation system is working correctly.');
    return true;
  } else {
    console.log('\n💥 SOME TESTS FAILED! Please review the configuration and calculations.');
    return false;
  }
}

// Export for use in other modules
export {
  runDeliveryTariffTests,
  TEST_SCENARIOS
};

// If run directly (for Node.js testing)
if (typeof window === 'undefined') {
  runDeliveryTariffTests();
}
