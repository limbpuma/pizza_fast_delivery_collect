# End-to-End Tests

This directory contains end-to-end tests for the Campus Pizza application using Playwright.

## Test Files

### 1. `delivery.spec.ts`
Tests the complete delivery flow including:
- Adding items to cart
- Filling delivery address and customer information
- Postal code validation for delivery zones
- Minimum order value validation
- WhatsApp integration modal
- Order confirmation flow

### 2. `pickup.spec.ts`
Tests the pickup (collection) flow including:
- Adding items to cart
- Customer information (no address required)
- No minimum order requirement for pickup
- Simplified checkout process
- WhatsApp integration for pickup orders
- Form validation specific to pickup

### 3. `comparison.spec.ts`
Comprehensive tests comparing delivery vs pickup flows:
- Side-by-side flow comparison
- Pricing differences (delivery fee)
- Form validation differences
- WhatsApp modal interactions
- Error handling scenarios

### 4. `helpers.ts`
Utility functions and test data for reusable test actions:
- `TestHelpers` class with common actions
- Test data constants
- Utility functions for random test data

## Running Tests

### All Tests
```bash
npm run test:e2e
```

### With UI (Visual test runner)
```bash
npm run test:e2e:ui
```

### Headed mode (see browser)
```bash
npm run test:e2e:headed
```

### Specific test files
```bash
npm run test:delivery    # Only delivery tests
npm run test:pickup      # Only pickup tests
```

### Individual test suites
```bash
npx playwright test delivery.spec.ts
npx playwright test pickup.spec.ts
npx playwright test comparison.spec.ts
```

## Test Coverage

### Delivery Flow Tests
- ✅ Complete delivery order flow
- ✅ Invalid postal code handling
- ✅ Minimum order validation
- ✅ Form validation (all required fields)
- ✅ WhatsApp integration
- ✅ Delivery fee calculation

### Pickup Flow Tests
- ✅ Complete pickup order flow
- ✅ No address requirement
- ✅ No minimum order (single item orders)
- ✅ Form validation (fewer required fields)
- ✅ WhatsApp integration
- ✅ No delivery fee

### Cross-Flow Tests
- ✅ Pricing comparison
- ✅ Form validation differences
- ✅ WhatsApp modal interactions
- ✅ Error handling scenarios

## Test Data

The tests use predefined test data from `helpers.ts`:

### Valid Delivery Zones
- 44149, 44147, 44137, 44135, 44139, 44388
- 44145, 44143, 44141, 44229, 44225, 44227
- 44369, 44379, 44357, 44359, 44265, 44263

### Test Customers
- Max Mustermann
- Anna Schmidt
- Various test users for different scenarios

### Phone Numbers
- German mobile numbers (+49 176, +49 172, +49 151)

## Prerequisites

1. **Development server must be running**:
   ```bash
   npm run dev
   ```
   Server should be available at `http://localhost:5173`

2. **Browser installation**:
   ```bash
   npx playwright install
   ```

## Test Structure

Each test follows this general pattern:

1. **Setup**: Navigate to homepage, add items to cart
2. **Mode Selection**: Choose delivery or pickup
3. **Form Filling**: Complete required customer information
4. **Validation**: Verify form validation and pricing
5. **Submission**: Submit order and test WhatsApp integration
6. **Confirmation**: Verify order confirmation flow

## Debugging Tests

### Debug mode
```bash
npx playwright test --debug
```

### Trace viewer (after failed test)
```bash
npx playwright show-trace test-results/[test-name]/trace.zip
```

### Screenshots and videos
Test failures automatically capture:
- Screenshots at point of failure
- Video recordings of test execution
- Network logs and console output

## CI/CD Integration

Tests are configured to run in CI environments with:
- Headless browser execution
- Retry logic for flaky tests
- HTML report generation
- Trace collection on failures

## Important Notes

1. **WhatsApp Integration**: Tests mock the WhatsApp integration since we can't actually open WhatsApp in automated tests
2. **Real Data**: Tests use realistic but fake data to avoid affecting real orders
3. **Postal Codes**: Only valid Dortmund postal codes are tested for delivery
4. **Timing**: Tests include proper waits for async operations
5. **Isolation**: Each test is independent and can run in any order

## Future Enhancements

- [ ] Add mobile device testing
- [ ] Test different browser engines
- [ ] Add accessibility testing
- [ ] Performance testing integration
- [ ] Visual regression testing
