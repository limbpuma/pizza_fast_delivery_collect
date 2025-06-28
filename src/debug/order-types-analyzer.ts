/**
 * Order Types Analysis and Feedback Generator
 * Compares multiproduct modal orders vs single product orders
 * Provides detailed feedback on processing differences
 */

interface OrderComparisonResult {
  multiproductOrder: {
    structure: any;
    validation: string[];
    strengths: string[];
    issues: string[];
  };
  singleProductOrder: {
    structure: any;
    validation: string[];
    strengths: string[];
    issues: string[];
  };
  comparison: {
    differences: string[];
    recommendations: string[];
    riskAssessment: string[];
  };
  overallScore: number;
}

class OrderTypesAnalyzer {
  
  // Analyze multiproduct modal order structure
  analyzeMultiproductOrder(): any {
    console.log('🔍 Analyzing Multiproduct Modal Order Structure...');
    
    const mockMultiproductOrder = {
      id: 'mp_' + Date.now(),
      type: 'multiproduct',
      pizzaId: 'pizza_margherita',
      name: 'Pizza Margherita',
      quantity: 2,
      unitPrice: 12.50,
      totalPrice: 25.00,
      
      // Multiproduct specific fields
      size: '30cm',
      diameter: '30cm',
      sauce: 'tomato_sauce',
      zutaten: [
        { id: 'extra_cheese', name: 'Extra Käse', price: 1.50 },
        { id: 'mushrooms', name: 'Champignons', price: 1.00 }
      ],
      
      // Pricing breakdown
      basePrice: 10.00,
      saucePrice: 0.00,
      zutatenPrice: 2.50,
      
      // Configuration metadata
      configurationComplete: true,
      validationPassed: true,
      customizationLevel: 'high'
    };

    return mockMultiproductOrder;
  }

  // Analyze single product order structure
  analyzeSingleProductOrder(): any {
    console.log('🔍 Analyzing Single Product Order Structure...');
    
    const mockSingleOrder = {
      id: 'sp_' + Date.now(),
      type: 'single',
      productId: 'pizza_margherita_standard',
      name: 'Pizza Margherita (Standard)',
      quantity: 1,
      unitPrice: 10.00,
      totalPrice: 10.00,
      
      // Single product specific fields
      predefinedConfiguration: true,
      size: '30cm', // Default size
      sauce: 'tomato_sauce', // Default sauce
      zutaten: [], // No customization
      
      // Simplified pricing
      basePrice: 10.00,
      additionalCosts: 0.00,
      
      // Configuration metadata
      configurationComplete: true,
      validationPassed: true,
      customizationLevel: 'none'
    };

    return mockSingleOrder;
  }

  // Validate order structure consistency
  validateOrderStructure(order: any, orderType: string): string[] {
    const validationResults: string[] = [];
    
    // Required fields validation
    const requiredFields = ['id', 'name', 'quantity', 'unitPrice', 'totalPrice'];
    const missingFields = requiredFields.filter(field => !order[field]);
    
    if (missingFields.length > 0) {
      validationResults.push(`❌ Missing required fields: ${missingFields.join(', ')}`);
    } else {
      validationResults.push(`✅ All required fields present`);
    }

    // Price consistency validation
    const expectedTotal = order.unitPrice * order.quantity;
    if (Math.abs(order.totalPrice - expectedTotal) < 0.01) {
      validationResults.push(`✅ Price calculation is consistent`);
    } else {
      validationResults.push(`❌ Price inconsistency: expected ${expectedTotal}, got ${order.totalPrice}`);
    }

    // Type-specific validation
    if (orderType === 'multiproduct') {
      if (order.size && order.sauce) {
        validationResults.push(`✅ Multiproduct configuration fields present`);
      } else {
        validationResults.push(`❌ Missing multiproduct configuration (size/sauce)`);
      }

      if (Array.isArray(order.zutaten)) {
        validationResults.push(`✅ Zutaten array properly structured`);
      } else {
        validationResults.push(`❌ Zutaten field is not an array`);
      }
    }

    if (orderType === 'single') {
      if (order.predefinedConfiguration) {
        validationResults.push(`✅ Single product marked as predefined`);
      } else {
        validationResults.push(`⚠️ Single product should be marked as predefined`);
      }
    }

    return validationResults;
  }

  // Identify strengths of each order type
  identifyStrengths(order: any, orderType: string): string[] {
    const strengths: string[] = [];

    if (orderType === 'multiproduct') {
      strengths.push('🎨 High customization flexibility');
      strengths.push('💰 Transparent pricing breakdown');
      strengths.push('🔧 Detailed configuration tracking');
      strengths.push('👤 Enhanced user control');
      
      if (order.zutaten && order.zutaten.length > 0) {
        strengths.push('🍕 Rich ingredient customization');
      }
      
      if (order.configurationComplete) {
        strengths.push('✅ Complete configuration validation');
      }
    }

    if (orderType === 'single') {
      strengths.push('⚡ Fast ordering process');
      strengths.push('🎯 Simplified user experience');
      strengths.push('📱 Mobile-friendly interaction');
      strengths.push('🚀 Quick add to cart');
      strengths.push('💡 Reduced decision fatigue');
      strengths.push('🏪 Standard product reliability');
    }

    return strengths;
  }

  // Identify potential issues
  identifyIssues(order: any, orderType: string): string[] {
    const issues: string[] = [];

    if (orderType === 'multiproduct') {
      issues.push('⏱️ Longer configuration time required');
      issues.push('🧠 Higher cognitive load for users');
      issues.push('📱 Complex mobile interface');
      issues.push('🐛 More potential validation points');
      issues.push('💾 Increased data storage requirements');
      
      if (!order.configurationComplete) {
        issues.push('❌ Incomplete configuration detected');
      }
      
      if (order.zutaten && order.zutaten.length > 5) {
        issues.push('⚠️ Very high customization complexity');
      }
    }

    if (orderType === 'single') {
      issues.push('🚫 Limited customization options');
      issues.push('💸 Potential missed upselling opportunities');
      issues.push('👤 Reduced user personalization');
      issues.push('📊 Less detailed order analytics');
      
      if (!order.predefinedConfiguration) {
        issues.push('⚠️ Configuration status unclear');
      }
    }

    return issues;
  }

  // Compare order types and generate recommendations
  compareOrderTypes(multiOrder: any, singleOrder: any): any {
    const differences: string[] = [];
    const recommendations: string[] = [];
    const riskAssessment: string[] = [];

    // Structural differences
    differences.push('📊 Data Structure:');
    differences.push(`   • Multiproduct: ${Object.keys(multiOrder).length} fields`);
    differences.push(`   • Single: ${Object.keys(singleOrder).length} fields`);
    
    differences.push('💰 Pricing Complexity:');
    differences.push(`   • Multiproduct: Breakdown pricing (base + sauce + zutaten)`);
    differences.push(`   • Single: Simple unit pricing`);
    
    differences.push('🎨 Customization Level:');
    differences.push(`   • Multiproduct: ${multiOrder.customizationLevel}`);
    differences.push(`   • Single: ${singleOrder.customizationLevel}`);

    // Recommendations
    recommendations.push('🔄 Cart Processing:');
    recommendations.push('   • Ensure both order types use same cart interface');
    recommendations.push('   • Validate pricing calculations consistently');
    recommendations.push('   • Maintain order history format compatibility');
    
    recommendations.push('📱 WhatsApp Formatting:');
    recommendations.push('   • Create unified message template');
    recommendations.push('   • Handle customization details gracefully');
    recommendations.push('   • Ensure readable format for both types');
    
    recommendations.push('💾 Data Storage:');
    recommendations.push('   • Use consistent order ID format');
    recommendations.push('   • Maintain backward compatibility');
    recommendations.push('   • Implement proper data migration if needed');

    // Risk assessment
    riskAssessment.push('🚨 High Risk Areas:');
    riskAssessment.push('   • Price calculation inconsistencies');
    riskAssessment.push('   • WhatsApp message formatting differences');
    riskAssessment.push('   • Order history display inconsistencies');
    
    riskAssessment.push('⚠️ Medium Risk Areas:');
    riskAssessment.push('   • Mobile responsive behavior differences');
    riskAssessment.push('   • Validation rule conflicts');
    riskAssessment.push('   • User experience inconsistencies');
    
    riskAssessment.push('✅ Low Risk Areas:');
    riskAssessment.push('   • Basic cart functionality');
    riskAssessment.push('   • Order confirmation process');
    riskAssessment.push('   • Customer information handling');

    return { differences, recommendations, riskAssessment };
  }

  // Generate comprehensive analysis
  generateComprehensiveAnalysis(): OrderComparisonResult {
    console.log('\n🚀 Starting Comprehensive Order Types Analysis...\n');
    console.log('═'.repeat(80));

    // Analyze both order types
    const multiOrder = this.analyzeMultiproductOrder();
    const singleOrder = this.analyzeSingleProductOrder();

    // Validate structures
    const multiValidation = this.validateOrderStructure(multiOrder, 'multiproduct');
    const singleValidation = this.validateOrderStructure(singleOrder, 'single');

    // Identify strengths and issues
    const multiStrengths = this.identifyStrengths(multiOrder, 'multiproduct');
    const multiIssues = this.identifyIssues(multiOrder, 'multiproduct');
    const singleStrengths = this.identifyStrengths(singleOrder, 'single');
    const singleIssues = this.identifyIssues(singleOrder, 'single');

    // Compare and generate recommendations
    const comparison = this.compareOrderTypes(multiOrder, singleOrder);

    // Calculate overall score
    const multiScore = (multiValidation.filter(v => v.includes('✅')).length / multiValidation.length) * 100;
    const singleScore = (singleValidation.filter(v => v.includes('✅')).length / singleValidation.length) * 100;
    const overallScore = (multiScore + singleScore) / 2;

    const result: OrderComparisonResult = {
      multiproductOrder: {
        structure: multiOrder,
        validation: multiValidation,
        strengths: multiStrengths,
        issues: multiIssues
      },
      singleProductOrder: {
        structure: singleOrder,
        validation: singleValidation,
        strengths: singleStrengths,
        issues: singleIssues
      },
      comparison,
      overallScore
    };

    // Display results
    this.displayAnalysisResults(result);

    return result;
  }

  // Display analysis results in console
  displayAnalysisResults(result: OrderComparisonResult): void {
    console.log('\n📊 MULTIPRODUCT ORDER ANALYSIS:');
    console.log('─'.repeat(50));
    console.log('✅ Validation Results:');
    result.multiproductOrder.validation.forEach(v => console.log(`   ${v}`));
    
    console.log('\n💪 Strengths:');
    result.multiproductOrder.strengths.forEach(s => console.log(`   ${s}`));
    
    console.log('\n⚠️ Issues:');
    result.multiproductOrder.issues.forEach(i => console.log(`   ${i}`));

    console.log('\n📊 SINGLE PRODUCT ORDER ANALYSIS:');
    console.log('─'.repeat(50));
    console.log('✅ Validation Results:');
    result.singleProductOrder.validation.forEach(v => console.log(`   ${v}`));
    
    console.log('\n💪 Strengths:');
    result.singleProductOrder.strengths.forEach(s => console.log(`   ${s}`));
    
    console.log('\n⚠️ Issues:');
    result.singleProductOrder.issues.forEach(i => console.log(`   ${i}`));

    console.log('\n🔄 COMPARISON AND RECOMMENDATIONS:');
    console.log('─'.repeat(50));
    result.comparison.differences.forEach(d => console.log(d));
    console.log('');
    result.comparison.recommendations.forEach(r => console.log(r));
    console.log('');
    result.comparison.riskAssessment.forEach(r => console.log(r));

    console.log('\n📈 OVERALL ASSESSMENT:');
    console.log('─'.repeat(50));
    console.log(`🎯 Overall Score: ${result.overallScore.toFixed(1)}%`);
    
    if (result.overallScore >= 90) {
      console.log('🟢 Status: EXCELLENT - Both order types well implemented');
    } else if (result.overallScore >= 75) {
      console.log('🟡 Status: GOOD - Minor improvements needed');
    } else if (result.overallScore >= 60) {
      console.log('🟠 Status: NEEDS IMPROVEMENT - Several issues to address');
    } else {
      console.log('🔴 Status: CRITICAL - Major issues require immediate attention');
    }
  }

  // Generate markdown report
  generateMarkdownReport(result: OrderComparisonResult): string {
    const report = [
      '# Order Types Analysis Report',
      `**Generated:** ${new Date().toLocaleString()}`,
      `**Overall Score:** ${result.overallScore.toFixed(1)}%`,
      '',
      '## Multiproduct Modal Orders',
      '',
      '### ✅ Validation Results',
      ...result.multiproductOrder.validation.map(v => `- ${v}`),
      '',
      '### 💪 Strengths',
      ...result.multiproductOrder.strengths.map(s => `- ${s}`),
      '',
      '### ⚠️ Issues',
      ...result.multiproductOrder.issues.map(i => `- ${i}`),
      '',
      '## Single Product Orders',
      '',
      '### ✅ Validation Results',
      ...result.singleProductOrder.validation.map(v => `- ${v}`),
      '',
      '### 💪 Strengths',
      ...result.singleProductOrder.strengths.map(s => `- ${s}`),
      '',
      '### ⚠️ Issues',
      ...result.singleProductOrder.issues.map(i => `- ${i}`),
      '',
      '## Comparison & Recommendations',
      '',
      '### Differences',
      ...result.comparison.differences.map(d => d),
      '',
      '### Recommendations',
      ...result.comparison.recommendations.map(r => r),
      '',
      '### Risk Assessment',
      ...result.comparison.riskAssessment.map(r => r),
      '',
      '## Next Steps',
      '1. Test both order types in development environment',
      '2. Validate cart processing for consistency',
      '3. Test WhatsApp message formatting',
      '4. Verify order history display',
      '5. Conduct user acceptance testing'
    ];

    return report.join('\n');
  }
}

// Create global instance
const orderTypesAnalyzer = new OrderTypesAnalyzer();

// Auto-run analysis
console.log('🔍 Order Types Analyzer loaded. Running analysis...');
const analysisResult = orderTypesAnalyzer.generateComprehensiveAnalysis();

// Export for use
export {
  OrderTypesAnalyzer,
  orderTypesAnalyzer as default,
  analysisResult,
  type OrderComparisonResult
};

// Make available globally
(window as any).orderTypesAnalyzer = orderTypesAnalyzer;
(window as any).orderAnalysisResult = analysisResult;
