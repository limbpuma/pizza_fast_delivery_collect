/**
 * 🧪 TARIFF TEST PAGE
 * 
 * Dedicated page for testing tariff calculations
 * Access via /tariff-test route
 */

import React from 'react';
import TariffTestComponent from '../ui/TariffTestComponent';
import { executeComprehensiveVerification } from '../debug/comprehensive-tariff-verification';

const TariffTestPage: React.FC = () => {
  const runComprehensiveTest = () => {
    console.log('Starting comprehensive verification...');
    const results = executeComprehensiveVerification();
    console.log('Verification completed:', results);
    
    // Show alert with summary
    const { summary } = results;
    alert(`Verification Complete!\n\nTotal Tests: ${summary.total}\nPassed: ${summary.passed}\nFailed: ${summary.failed}\nSuccess Rate: ${((summary.passed / summary.total) * 100).toFixed(1)}%\n\nCheck console for detailed results.`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🧪 Tariff Calculation Test Suite
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Comprehensive testing environment for the new PLZ-based delivery tariff system.
            Test individual calculations or run the full verification suite.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              🚀 Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={runComprehensiveTest}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium"
              >
                🔍 Run Full Verification
              </button>
              <button
                onClick={() => window.open('/console', '_blank')}
                className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors font-medium"
              >
                📊 Open Console
              </button>
              <button
                onClick={() => {
                  const currentConfig = JSON.stringify({
                    campus: { plz: '44149', min: 12, fee: 0, freeAt: 0 },
                    closeAreas: { plz: ['44225', '44227'], min: 12, fee: 1, freeAt: 50 },
                    midAreas: { plz: ['44369', '44379'], min: 15, fee: 1, freeAt: 50 },
                    extendedAreas: { plz: ['44135', '44139', '44388', '44147', '44137'], min: 19.99, fee: 1.5, freeAt: 50 },
                    farAreas: { plz: ['44143', '44141', '44145', '44229'], min: 30, fee: 2, freeAt: 60 },
                    outerAreas: { plz: ['44359', '44357', '44265', '44263'], min: 30, fee: 2, freeAt: 60 },
                    pickup: { plz: 'abholung', min: 0, fee: 0, freeAt: 0 }
                  }, null, 2);
                  navigator.clipboard.writeText(currentConfig);
                  alert('Current configuration copied to clipboard!');
                }}
                className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-colors font-medium"
              >
                📋 Copy Config
              </button>
            </div>
          </div>
        </div>

        {/* Configuration Overview */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              📋 Current Configuration Overview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { zone: 'Campus (FREE)', plz: '44149', min: '€12.00', fee: '€0.00', free: 'Always' },
                { zone: 'Close Areas', plz: '44225, 44227', min: '€12.00', fee: '€1.00', free: '€50.00' },
                { zone: 'Mid Areas', plz: '44369, 44379', min: '€15.00', fee: '€1.00', free: '€50.00' },
                { zone: 'Extended Areas', plz: '44135, 44139...', min: '€19.99', fee: '€1.50', free: '€50.00' },
                { zone: 'Far Areas', plz: '44143, 44141...', min: '€30.00', fee: '€2.00', free: '€60.00' },
                { zone: 'Outer Areas', plz: '44359, 44357...', min: '€30.00', fee: '€2.00', free: '€60.00' },
                { zone: 'Pickup', plz: 'abholung', min: '€0.00', fee: '€0.00', free: 'Always' }
              ].map((config, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">{config.zone}</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div><span className="font-medium">PLZ:</span> {config.plz}</div>
                    <div><span className="font-medium">Minimum:</span> {config.min}</div>
                    <div><span className="font-medium">Fee:</span> {config.fee}</div>
                    <div><span className="font-medium">Free at:</span> {config.free}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Interactive Tester */}
        <TariffTestComponent />

        {/* Test Instructions */}
        <div className="max-w-4xl mx-auto mt-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              📝 Testing Instructions
            </h2>
            <div className="space-y-4 text-gray-600">
              <div>
                <h3 className="font-semibold text-gray-800">1. Manual Testing</h3>
                <p>Enter any PLZ code and order amount to test individual calculations.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">2. Quick Tests</h3>
                <p>Use predefined test cases to quickly verify common scenarios.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">3. Auto Testing</h3>
                <p>Enable auto-testing to continuously run random test cases.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">4. Full Verification</h3>
                <p>Run the comprehensive test suite to verify all edge cases and scenarios.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TariffTestPage;
