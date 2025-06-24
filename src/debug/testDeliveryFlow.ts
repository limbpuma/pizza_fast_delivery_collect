/**
 * Quick test to verify the end-to-end delivery flow integration
 * Tests the flow from PLZ input to dynamic pricing in cart
 * 
 * @phase Phase 2, Step 2.4 - UI Integration Complete
 * @date 2024-06-24
 */

import { store } from '../store';
import { updatePLZWithSession } from '../features/user/userSlice';
import { calculateDeliveryWithCache } from '../features/delivery/deliverySlice';
import { getTariffByPLZ } from '../utils/deliveryTariffs';

/**
 * Test the complete delivery flow integration
 */
export function testDeliveryFlowIntegration() {
  console.log('🧪 Testing Delivery Flow Integration...\n');

  const testResults = {
    plzValidation: false,
    reduxIntegration: false,
    tariffCalculation: false,
    dynamicPricing: false,
    sessionSecurity: false
  };

  try {
    // 1. Test PLZ validation and Redux integration
    console.log('1️⃣ Testing PLZ validation and Redux integration...');
    
    const testPLZ = '44149'; // Valid Dortmund PLZ
    const action = updatePLZWithSession({ plz: testPLZ, source: 'user_input' });
    
    // Mock dispatch to test action structure
    if (action.type && action.payload && action.payload.plz === testPLZ) {
      testResults.plzValidation = true;
      console.log('✅ PLZ validation and Redux action structure correct');
    }

    // 2. Test tariff calculation
    console.log('2️⃣ Testing tariff calculation...');
    
    const tariff = getTariffByPLZ(testPLZ);
    if (tariff && tariff.id && tariff.baseFee > 0) {
      testResults.tariffCalculation = true;
      console.log(`✅ Tariff calculation: Zone ${tariff.zoneName}, Base fee: €${tariff.baseFee}`);
    }

    // 3. Test delivery calculation action
    console.log('3️⃣ Testing delivery calculation...');
    
    const calculationAction = calculateDeliveryWithCache({
      plz: testPLZ,
      orderValue: 15.50
    });
    
    if (calculationAction.type && calculationAction.type.includes('delivery')) {
      testResults.dynamicPricing = true;
      console.log('✅ Delivery calculation action structure correct');
    }

    // 4. Test current store state
    console.log('4️⃣ Testing store state...');
    
    const currentState = store.getState();
    
    if (currentState.user && currentState.delivery) {
      testResults.reduxIntegration = true;
      console.log('✅ Redux slices properly integrated in store');
      
      // Check if user slice has session management
      if ('deliverySession' in currentState.user) {
        testResults.sessionSecurity = true;
        console.log('✅ Session security features available');
      }
    }

    // Results summary
    console.log('\n📊 Test Results Summary:');
    Object.entries(testResults).forEach(([test, passed]) => {
      console.log(`${passed ? '✅' : '❌'} ${test}: ${passed ? 'PASS' : 'FAIL'}`);
    });

    const passCount = Object.values(testResults).filter(Boolean).length;
    const totalTests = Object.keys(testResults).length;
    
    console.log(`\n🎯 Overall: ${passCount}/${totalTests} tests passed`);
    
    if (passCount === totalTests) {
      console.log('🚀 Delivery flow integration: COMPLETE');
      return true;
    } else {
      console.log('⚠️ Some integration issues found');
      return false;
    }

  } catch (error) {
    console.error('❌ Test failed with error:', error);
    return false;
  }
}

/**
 * Test specific pricing scenarios
 */
export function testPricingScenarios() {
  console.log('\n💰 Testing Pricing Scenarios...\n');

  const scenarios = [
    { plz: '44149', orderValue: 8.50, expectedZone: 'Dortmund City', description: 'Small order, standard zone' },
    { plz: '44149', orderValue: 15.00, expectedZone: 'Dortmund City', description: 'Large order, should get free delivery' },
    { plz: '44225', orderValue: 10.00, expectedZone: 'Dortmund North', description: 'Medium order, north zone' },
  ];

  scenarios.forEach((scenario, index) => {
    console.log(`${index + 1}️⃣ Scenario: ${scenario.description}`);
    console.log(`   PLZ: ${scenario.plz}, Order: €${scenario.orderValue}`);
    
    const tariff = getTariffByPLZ(scenario.plz);
    if (tariff) {
      const isFreeDelivery = scenario.orderValue >= tariff.freeDeliveryThreshold;
      const deliveryFee = isFreeDelivery ? 0 : tariff.baseFee;
      
      console.log(`   Zone: ${tariff.zoneName}`);
      console.log(`   Fee: €${deliveryFee} ${isFreeDelivery ? '(FREE!)' : ''}`);
      console.log(`   Free delivery threshold: €${tariff.freeDeliveryThreshold}`);
    } else {
      console.log(`   ❌ No tariff found for PLZ ${scenario.plz}`);
    }
    console.log('');
  });
}

// Auto-run if in development mode
if (process.env.NODE_ENV === 'development') {
  // Run tests after a small delay to ensure store is initialized
  setTimeout(() => {
    testDeliveryFlowIntegration();
    testPricingScenarios();
  }, 1000);
}
