// Test script to simulate corrupted order data
// Run this in browser console to test error handling

export function simulateCorruptedData() {
  // Set corrupted JSON data
  localStorage.setItem('campusPizzaOrders', '{invalid json data');
  console.log('✅ Corrupted data set. Refresh /my-orders to test error handling.');
}

export function simulateInvalidStructure() {
  // Set invalid data structure
  localStorage.setItem('campusPizzaOrders', '{"not": "an array"}');
  console.log('✅ Invalid structure set. Refresh /my-orders to test error handling.');
}

export function simulateMalformedOrders() {
  // Set malformed orders
  const badOrders = [
    { orderNumber: null, timestamp: 'invalid-date' },
    'not an object',
    { orderNumber: 'TEST-001' } // missing timestamp
  ];
  localStorage.setItem('campusPizzaOrders', JSON.stringify(badOrders));
  console.log('✅ Malformed orders set. Refresh /my-orders to test error handling.');
}

export function clearTestData() {
  localStorage.removeItem('campusPizzaOrders');
  console.log('✅ Test data cleared.');
}

// For testing in browser console
(window as any).orderErrorTest = {
  simulateCorruptedData,
  simulateInvalidStructure,
  simulateMalformedOrders,
  clearTestData
};
