/**
 * 🧪 TARIFF TEST COMPONENT
 * 
 * Interactive component for testing tariff calculations
 * Can be added to any page for live testing
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  getTariffByPLZ, 
  calculateDeliveryFee, 
  getDeliveryDisplayInfo 
} from '../utils/deliveryTariffs';

interface TestResult {
  plz: string;
  amount: number;
  tariff: any;
  calculation: any;
  displayInfo: any;
  timestamp: Date;
}

const TariffTestComponent: React.FC = () => {
  const [testPLZ, setTestPLZ] = useState('44149');
  const [testAmount, setTestAmount] = useState(15);
  const [results, setResults] = useState<TestResult[]>([]);
  const [autoTest, setAutoTest] = useState(false);

  // Predefined test cases
  const quickTests = useMemo(() => [
    { plz: '44149', amount: 15, label: 'Campus - Normal' },
    { plz: '44149', amount: 10, label: 'Campus - Below Min' },
    { plz: '44225', amount: 25, label: 'Close - With Fee' },
    { plz: '44225', amount: 55, label: 'Close - Free' },
    { plz: '44369', amount: 20, label: 'Mid - Normal' },
    { plz: '44135', amount: 25, label: 'Extended - Normal' },
    { plz: '44143', amount: 35, label: 'Far - Normal' },
    { plz: '44359', amount: 70, label: 'Outer - Free' },
    { plz: 'abholung', amount: 5, label: 'Pickup' }
  ], []);

  const runTest = (plz: string, amount: number) => {
    try {
      const tariff = getTariffByPLZ(plz);
      const calculation = calculateDeliveryFee(plz, amount);
      const displayInfo = getDeliveryDisplayInfo(plz, amount);
      
      const result: TestResult = {
        plz,
        amount,
        tariff,
        calculation,
        displayInfo,
        timestamp: new Date()
      };
      
      setResults(prev => [result, ...prev.slice(0, 9)]);
    } catch (error) {
      console.error('Test error:', error);
    }
  };

  const runQuickTest = (test: any) => {
    setTestPLZ(test.plz);
    setTestAmount(test.amount);
    runTest(test.plz, test.amount);
  };

  const runAllTests = () => {
    quickTests.forEach((test, index) => {
      setTimeout(() => {
        runTest(test.plz, test.amount);
      }, index * 100);
    });
  };

  useEffect(() => {
    if (autoTest) {
      const interval = setInterval(() => {
        const randomTest = quickTests[Math.floor(Math.random() * quickTests.length)];
        runTest(randomTest.plz, randomTest.amount);
      }, 2000);
      
      return () => clearInterval(interval);
    }
  }, [autoTest, quickTests]);

  const getStatusColor = (result: TestResult) => {
    if (!result.tariff) return 'bg-red-100 text-red-800';
    if (!result.calculation.meetsMinimum) return 'bg-yellow-100 text-yellow-800';
    if (result.calculation.isFree) return 'bg-green-100 text-green-800';
    return 'bg-blue-100 text-blue-800';
  };

  const getStatusText = (result: TestResult) => {
    if (!result.tariff) return 'Invalid PLZ';
    if (!result.calculation.meetsMinimum) return 'Below Minimum';
    if (result.calculation.isFree) return 'Free Delivery';
    return 'With Fee';
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          🧪 Tariff Calculation Tester
        </h2>
        <p className="text-gray-600">
          Test the new tariff configuration with different PLZ codes and amounts
        </p>
      </div>

      {/* Manual Test Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            PLZ Code
          </label>
          <input
            type="text"
            value={testPLZ}
            onChange={(e) => setTestPLZ(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="e.g., 44149"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Order Amount (€)
          </label>
          <input
            type="number"
            value={testAmount}
            onChange={(e) => setTestAmount(parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            step="0.01"
            min="0"
          />
        </div>
        <div className="flex items-end">
          <button
            onClick={() => runTest(testPLZ, testAmount)}
            className="w-full bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors"
          >
            Run Test
          </button>
        </div>
      </div>

      {/* Quick Tests */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Quick Tests</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 mb-4">
          {quickTests.map((test, index) => (
            <button
              key={index}
              onClick={() => runQuickTest(test)}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-2 rounded text-sm transition-colors"
            >
              {test.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button
            onClick={runAllTests}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Run All Tests
          </button>
          <button
            onClick={() => setAutoTest(!autoTest)}
            className={`px-4 py-2 rounded transition-colors ${
              autoTest 
                ? 'bg-red-500 text-white hover:bg-red-600' 
                : 'bg-green-500 text-white hover:bg-green-600'
            }`}
          >
            {autoTest ? 'Stop Auto Test' : 'Start Auto Test'}
          </button>
          <button
            onClick={() => setResults([])}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
          >
            Clear Results
          </button>
        </div>
      </div>

      {/* Results */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Test Results ({results.length})
        </h3>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {results.map((result, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                    PLZ: {result.plz}
                  </span>
                  <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                    €{result.amount.toFixed(2)}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded ${getStatusColor(result)}`}>
                    {getStatusText(result)}
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  {result.timestamp.toLocaleTimeString()}
                </span>
              </div>
              
              {result.tariff ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                  <div>
                    <span className="text-gray-600">Zone:</span>
                    <div className="font-medium">{result.tariff.name}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Minimum:</span>
                    <div className="font-medium">€{result.tariff.mindestbestellwert.toFixed(2)}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Delivery Fee:</span>
                    <div className="font-medium">€{result.calculation.fee.toFixed(2)}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Free at:</span>
                    <div className="font-medium">€{result.tariff.lieferkosten_entfallen_ab.toFixed(2)}</div>
                  </div>
                </div>
              ) : (
                <div className="text-red-600 text-sm">
                  ❌ No tariff found for PLZ {result.plz}
                </div>
              )}
              
              {result.calculation && (
                <div className="mt-2 flex gap-4 text-xs">
                  <span className={result.calculation.meetsMinimum ? 'text-green-600' : 'text-red-600'}>
                    {result.calculation.meetsMinimum ? '✅' : '❌'} Meets Minimum
                  </span>
                  <span className={result.calculation.isFree ? 'text-green-600' : 'text-orange-600'}>
                    {result.calculation.isFree ? '🆓' : '💰'} {result.calculation.isFree ? 'Free' : 'Paid'} Delivery
                  </span>
                  {!result.calculation.meetsMinimum && (
                    <span className="text-red-600">
                      Missing: €{result.calculation.missingAmount.toFixed(2)}
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
          
          {results.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              No test results yet. Run a test to see results here.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TariffTestComponent;
