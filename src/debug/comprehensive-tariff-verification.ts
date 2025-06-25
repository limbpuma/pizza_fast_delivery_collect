/**
 * 🔍 COMPREHENSIVE TARIFF VERIFICATION SYSTEM
 * 
 * This script performs live verification of the tariff calculation system
 * Tests all edge cases and validates UI behavior
 * 
 * @version 1.0.0
 * @created June 25, 2025
 */

import { 
  getTariffByPLZ, 
  calculateDeliveryFee, 
  getDeliveryDisplayInfo,
  validateTariffConfiguration
} from '../utils/deliveryTariffs';

// Comprehensive test suite
const COMPREHENSIVE_TEST_CASES = [
  // Campus Area Tests
  {
    category: 'Campus Area (Zone 1)',
    tests: [
      { plz: '44149', amount: 12.00, description: 'Exact minimum' },
      { plz: '44149', amount: 11.99, description: 'Below minimum by 1 cent' },
      { plz: '44149', amount: 15.00, description: 'Above minimum' },
      { plz: '44149', amount: 100.00, description: 'High amount' }
    ]
  },
  
  // Close Areas Tests (Zone 2A)
  {
    category: 'Close Areas (Zone 2A)',
    tests: [
      { plz: '44225', amount: 12.00, description: 'Exact minimum' },
      { plz: '44225', amount: 11.99, description: 'Below minimum' },
      { plz: '44225', amount: 25.00, description: 'Mid range with fee' },
      { plz: '44225', amount: 50.00, description: 'Exact free delivery threshold' },
      { plz: '44225', amount: 50.01, description: 'Above free delivery threshold' },
      { plz: '44227', amount: 30.00, description: 'Different PLZ same zone' }
    ]
  },
  
  // Mid Areas Tests (Zone 2B)
  {
    category: 'Mid Areas (Zone 2B)',
    tests: [
      { plz: '44369', amount: 15.00, description: 'Exact minimum' },
      { plz: '44369', amount: 14.99, description: 'Below minimum' },
      { plz: '44369', amount: 25.00, description: 'Mid range with fee' },
      { plz: '44369', amount: 50.00, description: 'Free delivery threshold' },
      { plz: '44379', amount: 20.00, description: 'Different PLZ same zone' }
    ]
  },
  
  // Extended Areas Tests (Zone 3A)
  {
    category: 'Extended Areas (Zone 3A)',
    tests: [
      { plz: '44135', amount: 19.99, description: 'Exact minimum' },
      { plz: '44135', amount: 19.98, description: 'Below minimum' },
      { plz: '44135', amount: 30.00, description: 'Mid range with fee' },
      { plz: '44135', amount: 50.00, description: 'Free delivery threshold' },
      { plz: '44139', amount: 25.00, description: 'Different PLZ same zone' },
      { plz: '44147', amount: 40.00, description: 'Former campus PLZ now extended' }
    ]
  },
  
  // Far Areas Tests (Zone 3B)
  {
    category: 'Far Areas (Zone 3B)',
    tests: [
      { plz: '44143', amount: 30.00, description: 'Exact minimum' },
      { plz: '44143', amount: 29.99, description: 'Below minimum' },
      { plz: '44143', amount: 45.00, description: 'Mid range with fee' },
      { plz: '44143', amount: 60.00, description: 'Exact free delivery threshold' },
      { plz: '44143', amount: 60.01, description: 'Above free delivery threshold' },
      { plz: '44229', amount: 35.00, description: 'Different PLZ same zone' }
    ]
  },
  
  // Outer Areas Tests (Zone 4)
  {
    category: 'Outer Areas (Zone 4)',
    tests: [
      { plz: '44359', amount: 30.00, description: 'Exact minimum' },
      { plz: '44359', amount: 29.99, description: 'Below minimum' },
      { plz: '44359', amount: 45.00, description: 'Mid range with fee' },
      { plz: '44359', amount: 60.00, description: 'Free delivery threshold' },
      { plz: '44357', amount: 70.00, description: 'Above free delivery' }
    ]
  },
  
  // Pickup Tests
  {
    category: 'Pickup (Abholung)',
    tests: [
      { plz: 'abholung', amount: 0.00, description: 'Zero amount' },
      { plz: 'abholung', amount: 5.00, description: 'Small amount' },
      { plz: 'abholung', amount: 50.00, description: 'Large amount' }
    ]
  },
  
  // Edge Cases
  {
    category: 'Edge Cases',
    tests: [
      { plz: '99999', amount: 20.00, description: 'Invalid PLZ' },
      { plz: '', amount: 20.00, description: 'Empty PLZ' },
      { plz: '44149', amount: 0, description: 'Zero amount campus' },
      { plz: '44225', amount: 0.01, description: 'Minimal amount' }
    ]
  }
];

interface TestResult {
  category: string;
  description: string;
  plz: string;
  amount: number;
  tariff: any;
  calculation: any;
  displayInfo: any;
  passed: boolean;
  issues: string[];
  recommendations: string[];
}

/**
 * Execute comprehensive verification
 */
function executeComprehensiveVerification(): {
  results: TestResult[];
  summary: {
    total: number;
    passed: number;
    failed: number;
    issues: string[];
    recommendations: string[];
  };
} {
  console.log('🔍 STARTING COMPREHENSIVE TARIFF VERIFICATION');
  console.log('='.repeat(70));
  
  const results: TestResult[] = [];
  const allIssues: string[] = [];
  const allRecommendations: string[] = [];
  
  // First validate configuration
  console.log('\n📋 VALIDATING CONFIGURATION...');
  const configValidation = validateTariffConfiguration();
  
  if (!configValidation.isValid) {
    console.error('❌ CRITICAL: Configuration validation failed!');
    configValidation.errors.forEach(error => {
      console.error(`   - ${error}`);
      allIssues.push(`Config Error: ${error}`);
    });
  }
  
  if (configValidation.warnings.length > 0) {
    console.warn('⚠️  Configuration warnings:');
    configValidation.warnings.forEach(warning => {
      console.warn(`   - ${warning}`);
      allRecommendations.push(`Config Warning: ${warning}`);
    });
  }
  
  // Execute test cases
  COMPREHENSIVE_TEST_CASES.forEach(category => {
    console.log(`\n📂 TESTING: ${category.category}`);
    console.log('-'.repeat(50));
    
    category.tests.forEach(test => {
      const result: TestResult = {
        category: category.category,
        description: test.description,
        plz: test.plz,
        amount: test.amount,
        tariff: null,
        calculation: null,
        displayInfo: null,
        passed: true,
        issues: [],
        recommendations: []
      };
      
      try {
        // Get tariff
        result.tariff = getTariffByPLZ(test.plz);
        
        // Calculate delivery fee
        result.calculation = calculateDeliveryFee(test.plz, test.amount);
        
        // Get display info
        result.displayInfo = getDeliveryDisplayInfo(test.plz, test.amount);
        
        // Validate results
        const validation = validateTestResult(test, result);
        result.passed = validation.passed;
        result.issues = validation.issues;
        result.recommendations = validation.recommendations;
        
        // Log result
        const status = result.passed ? '✅' : '❌';
        console.log(`  ${status} ${test.description} (PLZ: ${test.plz}, €${test.amount})`);
        
        if (!result.passed) {
          result.issues.forEach(issue => {
            console.error(`     ❌ ${issue}`);
            allIssues.push(`${category.category}: ${issue}`);
          });
        }
        
        if (result.recommendations.length > 0) {
          result.recommendations.forEach(rec => {
            console.warn(`     💡 ${rec}`);
            allRecommendations.push(`${category.category}: ${rec}`);
          });
        }
        
      } catch (error: unknown) {
        result.passed = false;
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        result.issues.push(`Execution error: ${errorMessage}`);
        console.error(`  ❌ ${test.description}: ERROR - ${errorMessage}`);
        allIssues.push(`${category.category}: Execution error - ${errorMessage}`);
      }
      
      results.push(result);
    });
  });
  
  // Generate summary
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  
  console.log('\n' + '='.repeat(70));
  console.log('📊 VERIFICATION SUMMARY');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${((passed / results.length) * 100).toFixed(1)}%`);
  
  if (allIssues.length > 0) {
    console.log('\n🚨 CRITICAL ISSUES FOUND:');
    allIssues.forEach(issue => console.error(`  - ${issue}`));
  }
  
  if (allRecommendations.length > 0) {
    console.log('\n💡 RECOMMENDATIONS:');
    allRecommendations.forEach(rec => console.warn(`  - ${rec}`));
  }
  
  return {
    results,
    summary: {
      total: results.length,
      passed,
      failed,
      issues: allIssues,
      recommendations: allRecommendations
    }
  };
}

/**
 * Validate individual test result
 */
function validateTestResult(test: any, result: TestResult): {
  passed: boolean;
  issues: string[];
  recommendations: string[];
} {
  const issues: string[] = [];
  const recommendations: string[] = [];
  
  // Check if tariff found for valid PLZ
  if (['99999', ''].includes(test.plz)) {
    if (result.tariff !== null) {
      issues.push('Should not find tariff for invalid PLZ');
    }
  } else if (test.plz !== 'abholung' && !result.tariff) {
    issues.push('No tariff found for valid PLZ');
  }
  
  // Validate calculation consistency
  if (result.tariff && result.calculation) {
    // Check minimum order validation
    const shouldMeetMinimum = test.amount >= result.tariff.mindestbestellwert;
    if (result.calculation.meetsMinimum !== shouldMeetMinimum) {
      issues.push(`Minimum validation incorrect: expected ${shouldMeetMinimum}, got ${result.calculation.meetsMinimum}`);
    }
    
    // Check fee calculation
    const expectedFee = (test.amount >= result.tariff.lieferkosten_entfallen_ab) ? 0 : result.tariff.lieferkosten;
    if (Math.abs(result.calculation.fee - expectedFee) > 0.01) {
      issues.push(`Fee calculation incorrect: expected €${expectedFee}, got €${result.calculation.fee}`);
    }
    
    // Check free delivery logic
    const shouldBeFree = (test.amount >= result.tariff.lieferkosten_entfallen_ab) || result.tariff.lieferkosten === 0;
    if (result.calculation.isFree !== shouldBeFree) {
      issues.push(`Free delivery logic incorrect: expected ${shouldBeFree}, got ${result.calculation.isFree}`);
    }
  }
  
  // Validate display info consistency
  if (result.displayInfo && result.calculation) {
    if (parseFloat(result.displayInfo.deliveryFee) !== result.calculation.fee) {
      issues.push('Display info delivery fee inconsistent with calculation');
    }
    
    if (result.displayInfo.meetsMinimum !== result.calculation.meetsMinimum) {
      issues.push('Display info minimum validation inconsistent');
    }
  }
  
  // Performance recommendations
  if (result.tariff && test.amount > 0) {
    if (result.tariff.mindestbestellwert > 25) {
      recommendations.push('High minimum order value may reduce conversion');
    }
    
    if (result.tariff.lieferkosten > 2) {
      recommendations.push('High delivery fee may impact customer satisfaction');
    }
    
    if (result.tariff.lieferkosten_entfallen_ab > 60) {
      recommendations.push('High free delivery threshold may be hard to reach');
    }
  }
  
  return {
    passed: issues.length === 0,
    issues,
    recommendations
  };
}

/**
 * Generate improvement suggestions
 */
function generateImprovementSuggestions(verificationResult: any): string[] {
  const suggestions: string[] = [];
  
  // Analyze failure patterns - could be used for detailed analysis
  // const failedTests = verificationResult.results.filter((r: TestResult) => !r.passed);
  
  // Configuration improvements
  if (verificationResult.summary.issues.some((issue: string) => issue.includes('Config'))) {
    suggestions.push('Fix configuration validation errors before deployment');
  }
  
  // Fee structure improvements
  if (verificationResult.summary.recommendations.some((rec: string) => rec.includes('High delivery fee'))) {
    suggestions.push('Consider reducing delivery fees to improve customer satisfaction');
  }
  
  if (verificationResult.summary.recommendations.some((rec: string) => rec.includes('High minimum'))) {
    suggestions.push('Review minimum order values - consider regional economic factors');
  }
  
  // Logic improvements
  if (verificationResult.summary.issues.some((issue: string) => issue.includes('calculation'))) {
    suggestions.push('Review and fix calculation logic inconsistencies');
  }
  
  // UI/UX improvements
  if (verificationResult.summary.issues.some((issue: string) => issue.includes('Display'))) {
    suggestions.push('Fix display info inconsistencies for better user experience');
  }
  
  // Performance improvements
  if (verificationResult.summary.failed > verificationResult.summary.total * 0.1) {
    suggestions.push('High failure rate detected - comprehensive review recommended');
  }
  
  return suggestions;
}

// Export for use
export {
  executeComprehensiveVerification,
  generateImprovementSuggestions,
  COMPREHENSIVE_TEST_CASES
};

// Browser console execution
if (typeof window !== 'undefined') {
  (window as any).runTariffVerification = executeComprehensiveVerification;
  console.log('🔍 Tariff verification available: runTariffVerification()');
}
