/**
 * 🧪 PLZ VALIDATION TESTING SCRIPT
 * Direct testing of PLZ validation functions without UI dependencies
 */

import { validatePLZ } from '../utils/deliveryZones';
import { calculateDeliveryFee, getTariffByPLZ } from '../utils/deliveryTariffs';

interface PLZTestCase {
  plz: string;
  expectedValid: boolean;
  expectedZone?: string;
  expectedFee?: number;
  expectedMinimum?: number;
  description: string;
}

interface PLZTestResult {
  testCase: PLZTestCase;
  result: any;
  passed: boolean;
  details: string;
}

class PLZTester {
  private testCases: PLZTestCase[] = [
    // Valid PLZ cases
    {
      plz: '44149',
      expectedValid: true,
      expectedZone: 'Zone 1 - Campus Area (FREE)',
      expectedFee: 0.00,
      expectedMinimum: 12.00,
      description: 'Campus Area - Free delivery zone'
    },
    {
      plz: '44225',
      expectedValid: true,
      expectedZone: 'Zone 2A - Close Areas',
      expectedFee: 1.00,
      expectedMinimum: 12.00,
      description: 'Close area with low delivery fee'
    },
    {
      plz: '44227',
      expectedValid: true,
      expectedZone: 'Zone 2A - Close Areas', 
      expectedFee: 1.00,
      expectedMinimum: 12.00,
      description: 'Another close area'
    },
    {
      plz: '44139',
      expectedValid: true,
      expectedZone: 'Zone 3A - Extended Areas',
      expectedFee: 1.50,
      expectedMinimum: 19.99,
      description: 'Extended area with higher minimum'
    },
    {
      plz: '44143',
      expectedValid: true,
      expectedZone: 'Zone 3B - Far Areas',
      expectedFee: 2.00,
      expectedMinimum: 30.00,
      description: 'Far area with highest fees'
    },
    {
      plz: '44135',
      expectedValid: true,
      expectedZone: 'Zone 3A - Extended Areas',
      expectedFee: 1.50,
      expectedMinimum: 19.99,
      description: 'Extended area validation'
    },
    
    // Invalid PLZ cases
    {
      plz: '10115',
      expectedValid: false,
      description: 'Berlin PLZ - outside delivery area'
    },
    {
      plz: '80331',
      expectedValid: false,
      description: 'Munich PLZ - outside delivery area'
    },
    {
      plz: '4414',
      expectedValid: false,
      description: 'Invalid format - too short'
    },
    {
      plz: '44149A',
      expectedValid: false,
      description: 'Invalid format - contains letter'
    },
    {
      plz: '441499',
      expectedValid: false,
      description: 'Invalid format - too long'
    },
    {
      plz: '',
      expectedValid: false,
      description: 'Empty PLZ'
    },
    {
      plz: '99999',
      expectedValid: false,
      description: 'Valid format but non-existent area'
    }
  ];

  async runAllTests(): Promise<PLZTestResult[]> {
    console.log('🧪 STARTING PLZ VALIDATION TESTS');
    console.log('='.repeat(50));

    const results: PLZTestResult[] = [];

    for (const testCase of this.testCases) {
      const result = await this.runSingleTest(testCase);
      results.push(result);
      this.logResult(result);
    }

    this.generateSummary(results);
    return results;
  }

  private async runSingleTest(testCase: PLZTestCase): Promise<PLZTestResult> {
    try {
      // Test PLZ validation
      const validationResult = validatePLZ(testCase.plz);
      
      // Test tariff lookup
      const tariffResult = getTariffByPLZ(testCase.plz);
      
      // Test delivery fee calculation
      let feeResult = null;
      if (validationResult.isValid && tariffResult) {
        feeResult = calculateDeliveryFee(testCase.plz, 25.00); // Test with €25 order
      }

      // Check if results match expectations
      let passed = true;
      let details = '';

      // Validate basic validity
      if (validationResult.isValid !== testCase.expectedValid) {
        passed = false;
        details += `Expected valid: ${testCase.expectedValid}, got: ${validationResult.isValid}. `;
      }

      // For valid PLZ, check additional details
      if (testCase.expectedValid && validationResult.isValid) {
        if (testCase.expectedZone && validationResult.tariff?.name !== testCase.expectedZone) {
          passed = false;
          details += `Expected zone: ${testCase.expectedZone}, got: ${validationResult.tariff?.name}. `;
        }

        if (testCase.expectedFee !== undefined && validationResult.tariff?.lieferkosten !== testCase.expectedFee) {
          passed = false;
          details += `Expected fee: €${testCase.expectedFee}, got: €${validationResult.tariff?.lieferkosten}. `;
        }

        if (testCase.expectedMinimum !== undefined && validationResult.tariff?.mindestbestellwert !== testCase.expectedMinimum) {
          passed = false;
          details += `Expected minimum: €${testCase.expectedMinimum}, got: €${validationResult.tariff?.mindestbestellwert}. `;
        }
      }

      if (passed) {
        details = 'All validations passed';
      }

      return {
        testCase,
        result: {
          validation: validationResult,
          tariff: tariffResult,
          feeCalculation: feeResult
        },
        passed,
        details
      };

    } catch (error) {
      return {
        testCase,
        result: null,
        passed: false,
        details: `Error during test: ${error}`
      };
    }
  }

  private logResult(result: PLZTestResult): void {
    const emoji = result.passed ? '✅' : '❌';
    console.log(`${emoji} PLZ ${result.testCase.plz}: ${result.testCase.description}`);
    console.log(`   └─ ${result.details}`);
    
    if (result.passed && result.result?.validation?.isValid) {
      const tariff = result.result.validation.tariff;
      if (tariff) {
        console.log(`   📍 Zone: ${tariff.name}`);
        console.log(`   💰 Fee: €${tariff.lieferkosten} | Minimum: €${tariff.mindestbestellwert}`);
      }
    }
    console.log('');
  }

  private generateSummary(results: PLZTestResult[]): void {
    const total = results.length;
    const passed = results.filter(r => r.passed).length;
    const failed = results.filter(r => !r.passed).length;

    console.log('📊 PLZ TESTING SUMMARY');
    console.log('='.repeat(30));
    console.log(`📈 Total Tests: ${total}`);
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📊 Success Rate: ${(passed/total*100).toFixed(1)}%`);

    if (failed > 0) {
      console.log('\n❌ FAILED TESTS:');
      results.filter(r => !r.passed).forEach(r => {
        console.log(`   • PLZ ${r.testCase.plz}: ${r.details}`);
      });
    }
  }

  // Test specific delivery fee calculations with different order amounts
  async testDeliveryFeeCalculations(): Promise<void> {
    console.log('\n💰 DELIVERY FEE CALCULATION TESTS');
    console.log('='.repeat(40));

    const testPLZs = ['44149', '44225', '44139', '44143'];
    const testAmounts = [10.00, 15.00, 25.00, 50.00, 75.00];

    for (const plz of testPLZs) {
      console.log(`\n📍 PLZ ${plz}:`);        for (const amount of testAmounts) {
          try {
            const result = calculateDeliveryFee(plz, amount);
            const total = amount + result.fee;
            console.log(`   €${amount.toFixed(2)} → Fee: €${result.fee.toFixed(2)} | Total: €${total.toFixed(2)} | Free: ${result.isFree}`);
          } catch (error) {
            console.log(`   €${amount.toFixed(2)} → Error: ${error}`);
          }
        }
    }
  }
}

// Export for use
export default PLZTester;

// Make available in browser console for manual testing
if (typeof window !== 'undefined') {
  (window as any).PLZTester = PLZTester;
  console.log('💡 Usage: const tester = new PLZTester(); await tester.runAllTests();');
}
