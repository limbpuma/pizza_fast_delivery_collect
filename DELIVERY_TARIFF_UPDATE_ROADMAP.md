# 🚚 DELIVERY TARIFF UPDATE - IMPLEMENTATION ROADMAP

> **Branch:** `lim1712/update-tarif-delivery`  
> **Priority:** 🚨 CRITICAL  
> **Estimated Time:** 4-6 days  

## 📋 OVERVIEW

This roadmap outlines the step-by-step implementation of the new delivery tariff system that addresses critical security vulnerabilities and UX issues in the current postal code (PLZ) validation and pricing flow.

### 🎯 OBJECTIVES
- ✅ Implement secure PLZ-based pricing from the start
- ✅ Prevent price manipulation vulnerabilities  
- ✅ Improve user experience with transparent pricing
- ✅ Add safe PLZ change functionality in checkout

## 🔒 NUEVO FLUJO SEGURO DE TARIFAS

### Flujo Actual (PROBLEMÁTICO):
```
1. Usuario ingresa PLZ en Home → Accede al menú
2. Usuario navega y agrega productos al carrito
3. Usuario va al checkout → VUELVE A INGRESAR PLZ (DUPLICADO)
4. Precio se calcula en checkout → RIESGO DE MANIPULACIÓN
```

### Nuevo Flujo Seguro (IMPLEMENTAR):
```
1. Usuario ingresa PLZ en Home → VALIDACIÓN INMEDIATA + MOSTRAR PRECIOS
2. Redux guarda PLZ + tarifa + BLOQUEO DE SESIÓN
3. Usuario navega con precios DINÁMICOS basados en PLZ
4. Cart muestra precio correcto SIEMPRE
5. Checkout SIN duplicación de PLZ → Validación de consistencia
6. Opción segura de cambio de PLZ con advertencias
```

### 🔐 Características del Nuevo Flujo:
- **Sesión Bloqueada**: Una vez que el usuario accede al menú, su PLZ queda bloqueado
- **Precios Dinámicos**: Todos los componentes muestran precios basados en la tarifa del PLZ
- **Validación Consistente**: Checkout valida que el PLZ no haya cambiado maliciosamente
- **Cambio Seguro**: Modal específico para cambiar PLZ con advertencias y confirmación
- **Estado Centralizado**: Redux como única fuente de verdad para PLZ y tarifa

---

## � COMPREHENSIVE IMPLEMENTATION PHASES

### PHASE 1: Core Infrastructure Setup
**Priority: CRITICAL** | **Effort: 2-3 days**

#### Step 1.1: Create Delivery Configuration System
**File**: `src/utils/deliveryTariffs.ts`
```typescript
// Delivery tariff configuration with PLZ mapping
export interface DeliveryTariff {
  id: string;
  name: string;
  basePrice: number;
  freeDeliveryThreshold: number;
  zones: string[]; // PLZ codes
  isActive: boolean;
}

export const DELIVERY_TARIFFS: DeliveryTariff[] = [
  {
    id: 'zone-a',
    name: 'Zone A - Campus Area',
    basePrice: 2.50,
    freeDeliveryThreshold: 15.00,
    zones: ['12345', '12346', '12347'],
    isActive: true
  },
  {
    id: 'zone-b', 
    name: 'Zone B - Extended Area',
    basePrice: 3.90,
    freeDeliveryThreshold: 20.00,
    zones: ['12348', '12349'],
    isActive: true
  }
];

export function getTariffByPLZ(plz: string): DeliveryTariff | null {
  return DELIVERY_TARIFFS.find(tariff => 
    tariff.isActive && tariff.zones.includes(plz)
  ) || null;
}

export function calculateDeliveryFee(
  plz: string, 
  cartTotal: number
): { fee: number; isFree: boolean; tariff: DeliveryTariff | null } {
  const tariff = getTariffByPLZ(plz);
  
  if (!tariff) {
    return { fee: 0, isFree: false, tariff: null };
  }
  
  const isFree = cartTotal >= tariff.freeDeliveryThreshold;
  const fee = isFree ? 0 : tariff.basePrice;
  
  return { fee, isFree, tariff };
}
```

#### Step 1.2: Refactor PLZ Validation 
**File**: `src/utils/deliveryZones.ts`
```typescript
import { getTariffByPLZ } from './deliveryTariffs';

export interface PLZValidationResult {
  isValid: boolean;
  plz: string;
  tariff: DeliveryTariff | null;
  error?: string;
}

export function validatePLZ(plz: string): PLZValidationResult {
  // Clean PLZ input
  const cleanPLZ = plz.replace(/\s/g, '');
  
  // Basic format validation
  if (!/^\d{5}$/.test(cleanPLZ)) {
    return {
      isValid: false,
      plz: cleanPLZ,
      tariff: null,
      error: 'PLZ must be 5 digits'
    };
  }
  
  // Check if PLZ is in delivery area
  const tariff = getTariffByPLZ(cleanPLZ);
  
  if (!tariff) {
    return {
      isValid: false,
      plz: cleanPLZ,
      tariff: null,
      error: 'Delivery not available for this PLZ'
    };
  }
  
  return {
    isValid: true,
    plz: cleanPLZ,
    tariff
  };
}
```

#### Step 1.3: Create TypeScript Interfaces
**File**: `src/types/delivery.ts`
```typescript
export interface DeliverySession {
  plz: string;
  tariff: DeliveryTariff;
  isLocked: boolean;
  lockedAt: Date;
  deliveryFee: number;
  isFreeDelivery: boolean;
}

export interface PLZChangeRequest {
  newPLZ: string;
  reason: 'user_initiated' | 'error_correction';
  confirmedWarnings: boolean;
}

export type DeliveryValidationError = 
  | 'INVALID_FORMAT'
  | 'NOT_IN_DELIVERY_AREA'
  | 'SESSION_LOCKED'
  | 'SECURITY_VIOLATION';
```

### PHASE 2: Redux State Management
**Priority: CRITICAL** | **Effort: 1-2 days**

#### Step 2.1: Update User Slice for Delivery Session
**File**: `src/features/user/userSlice.ts`
```typescript
import { DeliverySession, PLZChangeRequest } from '../../types/delivery';

interface UserState {
  // existing state...
  deliverySession: DeliverySession | null;
  plzHistory: string[];
}

// Actions
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // existing reducers...
    
    initializeDeliverySession: (state, action: PayloadAction<{
      plz: string;
      tariff: DeliveryTariff;
    }>) => {
      state.deliverySession = {
        plz: action.payload.plz,
        tariff: action.payload.tariff,
        isLocked: true,
        lockedAt: new Date(),
        deliveryFee: action.payload.tariff.basePrice,
        isFreeDelivery: false
      };
      state.plzHistory.push(action.payload.plz);
    },
    
    updateDeliveryFee: (state, action: PayloadAction<{
      fee: number;
      isFree: boolean;
    }>) => {
      if (state.deliverySession) {
        state.deliverySession.deliveryFee = action.payload.fee;
        state.deliverySession.isFreeDelivery = action.payload.isFree;
      }
    },
    
    requestPLZChange: (state, action: PayloadAction<PLZChangeRequest>) => {
      // Handle PLZ change request with validation
      if (state.deliverySession && action.payload.confirmedWarnings) {
        state.deliverySession.isLocked = false;
      }
    },
    
    clearDeliverySession: (state) => {
      state.deliverySession = null;
    }
  }
});
```

### PHASE 3: Component Integration
**Priority: HIGH** | **Effort: 3-4 days**

#### Step 3.1: Update CreateUser Component
**File**: `src/features/user/CreateUser.tsx`
```typescript
// Key changes:
// 1. Remove duplicate PLZ logic if coming from locked session
// 2. Integrate with delivery session state
// 3. Add session lock after successful PLZ validation

const CreateUser = () => {
  const dispatch = useAppDispatch();
  const { deliverySession } = useAppSelector(state => state.user);
  
  // If session exists and is locked, skip PLZ input
  if (deliverySession?.isLocked) {
    return <div>Session already active for PLZ: {deliverySession.plz}</div>;
  }
  
  const handlePLZSubmit = async (plz: string) => {
    const validation = validatePLZ(plz);
    
    if (validation.isValid && validation.tariff) {
      dispatch(initializeDeliverySession({
        plz: validation.plz,
        tariff: validation.tariff
      }));
      
      // Navigate to menu with locked session
      navigate('/menu');
    }
  };
  
  // Component JSX...
};
```

#### Step 3.2: Make Cart Components PLZ-Aware
**File**: `src/features/cart/CartSidebar.tsx`
```typescript
// Add delivery info display and dynamic pricing
const CartSidebar = () => {
  const { deliverySession } = useAppSelector(state => state.user);
  const cartTotal = useAppSelector(selectCartTotal);
  
  useEffect(() => {
    if (deliverySession && cartTotal) {
      const { fee, isFree } = calculateDeliveryFee(
        deliverySession.plz, 
        cartTotal
      );
      
      dispatch(updateDeliveryFee({ fee, isFree }));
    }
  }, [cartTotal, deliverySession?.plz]);
  
  return (
    <div>
      {/* Cart items */}
      
      {deliverySession && (
        <div className="delivery-info">
          <p>Delivery to: {deliverySession.plz}</p>
          <p>Zone: {deliverySession.tariff.name}</p>
          <p>Fee: {deliverySession.isFreeDelivery ? 'FREE' : `€${deliverySession.deliveryFee}`}</p>
          {!deliverySession.isFreeDelivery && (
            <p>Free delivery at €{deliverySession.tariff.freeDeliveryThreshold}</p>
          )}
        </div>
      )}
    </div>
  );
};
```

#### Step 3.3: Update CartSummary for Dynamic Pricing
**File**: `src/features/cart/CartSummary.tsx`
```typescript
const CartSummary = () => {
  const { deliverySession } = useAppSelector(state => state.user);
  const cartTotal = useAppSelector(selectCartTotal);
  
  const finalTotal = cartTotal + (deliverySession?.deliveryFee || 0);
  
  return (
    <div className="cart-summary">
      <div>Subtotal: €{cartTotal.toFixed(2)}</div>
      {deliverySession && (
        <div>
          Delivery ({deliverySession.tariff.name}): 
          {deliverySession.isFreeDelivery ? 'FREE' : `€${deliverySession.deliveryFee.toFixed(2)}`}
        </div>
      )}
      <div className="total">Total: €{finalTotal.toFixed(2)}</div>
    </div>
  );
};
```

### PHASE 4: Secure Checkout Implementation
**Priority: CRITICAL** | **Effort: 2-3 days**

#### Step 4.1: Remove Duplicate PLZ from CheckoutForm
**File**: `src/features/order/CheckoutForm.tsx`
```typescript
const CheckoutForm = () => {
  const { deliverySession } = useAppSelector(state => state.user);
  
  // Security validation on component mount
  useEffect(() => {
    if (!deliverySession?.isLocked) {
      // Redirect to PLZ entry - session compromised
      navigate('/');
      toast.error('Please enter your postal code first');
      return;
    }
    
    // Additional security: validate session integrity
    const sessionAge = Date.now() - new Date(deliverySession.lockedAt).getTime();
    if (sessionAge > 30 * 60 * 1000) { // 30 minutes
      dispatch(clearDeliverySession());
      navigate('/');
      toast.error('Session expired, please start again');
    }
  }, [deliverySession]);
  
  return (
    <form>
      {/* Remove PLZ input field completely */}
      
      {/* Display locked delivery info */}
      <div className="delivery-locked-info">
        <h3>Delivery Information</h3>
        <p>Postal Code: {deliverySession?.plz}</p>
        <p>Delivery Zone: {deliverySession?.tariff.name}</p>
        <p>Delivery Fee: €{deliverySession?.deliveryFee.toFixed(2)}</p>
        
        <button 
          type="button" 
          onClick={() => setShowPLZChangeModal(true)}
          className="text-blue-600 underline"
        >
          Change postal code
        </button>
      </div>
      
      {/* Rest of checkout form */}
    </form>
  );
};
```

#### Step 4.2: Create PLZ Change Modal
**File**: `src/ui/PLZChangeModal.tsx`
```typescript
interface PLZChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPLZ: string;
  currentTariff: DeliveryTariff;
}

const PLZChangeModal: React.FC<PLZChangeModalProps> = ({
  isOpen, onClose, currentPLZ, currentTariff
}) => {
  const [newPLZ, setNewPLZ] = useState('');
  const [warnings, setWarnings] = useState<string[]>([]);
  const [acknowledgedWarnings, setAcknowledgedWarnings] = useState(false);
  
  const dispatch = useAppDispatch();
  
  const handlePLZChange = (plz: string) => {
    setNewPLZ(plz);
    
    const validation = validatePLZ(plz);
    const warnings = [];
    
    if (!validation.isValid) {
      warnings.push(validation.error || 'Invalid postal code');
    } else if (validation.tariff) {
      // Compare tariffs and warn about changes
      if (validation.tariff.basePrice > currentTariff.basePrice) {
        warnings.push(`Delivery fee will increase from €${currentTariff.basePrice} to €${validation.tariff.basePrice}`);
      }
      
      if (validation.tariff.freeDeliveryThreshold > currentTariff.freeDeliveryThreshold) {
        warnings.push(`Free delivery threshold will increase from €${currentTariff.freeDeliveryThreshold} to €${validation.tariff.freeDeliveryThreshold}`);
      }
    }
    
    setWarnings(warnings);
  };
  
  const handleConfirm = () => {
    if (warnings.length > 0 && !acknowledgedWarnings) {
      toast.error('Please acknowledge the warnings');
      return;
    }
    
    const validation = validatePLZ(newPLZ);
    if (validation.isValid && validation.tariff) {
      dispatch(initializeDeliverySession({
        plz: validation.plz,
        tariff: validation.tariff
      }));
      
      onClose();
      toast.success('Postal code updated successfully');
    }
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="plz-change-modal">
        <h2>Change Delivery Postal Code</h2>
        <p>Current: {currentPLZ} - {currentTariff.name}</p>
        
        <input 
          value={newPLZ}
          onChange={(e) => handlePLZChange(e.target.value)}
          placeholder="Enter new postal code"
          className="w-full p-2 border rounded"
        />
        
        {warnings.length > 0 && (
          <div className="warnings bg-yellow-50 p-3 mt-3 rounded">
            <h4>⚠️ Important Changes:</h4>
            <ul>
              {warnings.map((warning, index) => (
                <li key={index}>{warning}</li>
              ))}
            </ul>
            
            <label className="flex items-center mt-2">
              <input 
                type="checkbox"
                checked={acknowledgedWarnings}
                onChange={(e) => setAcknowledgedWarnings(e.target.checked)}
              />
              <span className="ml-2">I understand these changes</span>
            </label>
          </div>
        )}
        
        <div className="flex gap-2 mt-4">
          <button onClick={onClose} className="btn-secondary">Cancel</button>
          <button onClick={handleConfirm} className="btn-primary">Confirm Change</button>
        </div>
      </div>
    </Modal>
  );
};
```

### PHASE 5: Testing & Validation
**Priority: HIGH** | **Effort: 2-3 days**

#### Step 5.1: Unit Tests for Core Functions
**File**: `src/utils/__tests__/deliveryTariffs.test.ts`
```typescript
describe('Delivery Tariffs', () => {
  test('should calculate correct delivery fee', () => {
    const result = calculateDeliveryFee('12345', 10.00);
    expect(result.fee).toBe(2.50);
    expect(result.isFree).toBe(false);
  });
  
  test('should apply free delivery when threshold met', () => {
    const result = calculateDeliveryFee('12345', 20.00);
    expect(result.fee).toBe(0);
    expect(result.isFree).toBe(true);
  });
  
  test('should handle invalid PLZ', () => {
    const result = calculateDeliveryFee('99999', 10.00);
    expect(result.tariff).toBe(null);
  });
});
```

#### Step 5.2: Integration Tests
**File**: `src/features/__tests__/deliveryFlow.test.tsx`
```typescript
describe('Delivery Flow Integration', () => {
  test('should lock session after PLZ validation', () => {
    // Test complete flow from PLZ entry to checkout
  });
  
  test('should prevent direct checkout access without PLZ', () => {
    // Test security measures
  });
  
  test('should update delivery fee when cart changes', () => {
    // Test dynamic pricing
  });
});
```

### PHASE 6: Deployment & Monitoring
**Priority: MEDIUM** | **Effort: 1-2 days**

#### Step 6.1: Analytics Integration
**File**: `src/utils/analytics.ts`
```typescript
export function trackDeliveryEvent(event: string, data: any) {
  // Track delivery-related events
  analytics.track(`delivery_${event}`, {
    ...data,
    timestamp: new Date().toISOString()
  });
}

// Events to track:
// - plz_entered
// - session_locked
// - delivery_fee_calculated
// - plz_changed
// - checkout_completed
```

---

## ✅ SUCCESS CRITERIA & IMPLEMENTATION CHECKLIST

### 🎯 Technical Success Criteria

#### Security Requirements
- [ ] ✅ **No Price Manipulation**: Users cannot modify delivery fees through client-side manipulation
- [ ] ✅ **Session Integrity**: PLZ remains locked throughout the shopping session
- [ ] ✅ **Validation Consistency**: All pricing calculations use the same validation logic
- [ ] ✅ **Secure PLZ Changes**: PLZ modifications require explicit user confirmation with warnings

#### User Experience Requirements  
- [ ] ✅ **Single PLZ Entry**: Users enter PLZ only once at the beginning
- [ ] ✅ **Dynamic Pricing**: All components show prices based on selected PLZ
- [ ] ✅ **Transparent Fees**: Delivery costs visible immediately after PLZ validation
- [ ] ✅ **Free Delivery Progress**: Clear indication of progress toward free delivery
- [ ] ✅ **PLZ Change Option**: Safe way to modify delivery address if needed

#### Performance Requirements
- [ ] ✅ **Fast PLZ Validation**: < 100ms response time for PLZ lookup
- [ ] ✅ **Instant Price Updates**: Real-time cart total updates when items added/removed
- [ ] ✅ **Minimal Re-renders**: Optimized React components to prevent unnecessary updates

### 🔍 Testing Checklist

#### Unit Tests
- [ ] ✅ **Tariff Configuration**: Test all PLZ-to-tariff mappings
- [ ] ✅ **Price Calculation**: Test delivery fee calculations for all scenarios
- [ ] ✅ **PLZ Validation**: Test format validation and zone checking
- [ ] ✅ **Free Delivery Logic**: Test threshold calculations

#### Integration Tests  
- [ ] ✅ **Complete User Flow**: Test PLZ entry → menu → cart → checkout
- [ ] ✅ **Session Management**: Test session locking and expiration
- [ ] ✅ **PLZ Change Flow**: Test PLZ modification with warnings
- [ ] ✅ **Cart Updates**: Test dynamic pricing updates

#### Security Tests
- [ ] ✅ **Price Manipulation**: Attempt to modify delivery fees via dev tools
- [ ] ✅ **Session Hijacking**: Test session integrity under various scenarios
- [ ] ✅ **Direct URL Access**: Test checkout access without valid session

#### User Acceptance Tests
- [ ] ✅ **Mobile Usability**: Test complete flow on mobile devices
- [ ] ✅ **Error Handling**: Test invalid PLZ entries and error messages
- [ ] ✅ **Edge Cases**: Test boundary conditions (exact threshold amounts, etc.)

### 📊 Monitoring & Analytics

#### Key Metrics to Track
- [ ] ✅ **PLZ Validation Success Rate**: % of successful PLZ entries
- [ ] ✅ **Session Completion Rate**: % of users who complete orders after PLZ entry
- [ ] ✅ **PLZ Change Frequency**: How often users modify their PLZ
- [ ] ✅ **Checkout Drop-off**: Identify where users abandon the process
- [ ] ✅ **Average Delivery Fee**: Monitor revenue impact

#### Performance Monitoring
- [ ] ✅ **PLZ Lookup Performance**: Response time for tariff calculations
- [ ] ✅ **Cart Update Performance**: Time for price recalculations
- [ ] ✅ **Page Load Times**: Impact on overall application performance

### 🚀 Deployment Strategy

#### Pre-Deployment Checklist
- [ ] ✅ **Code Review**: Peer review of all security-critical components
- [ ] ✅ **Security Audit**: Review of session management and validation logic
- [ ] ✅ **Performance Testing**: Load testing of PLZ validation endpoints
- [ ] ✅ **Documentation**: Update user guides and technical documentation

#### Rollout Plan
1. **Phase 1**: Deploy to staging environment for internal testing
2. **Phase 2**: Limited rollout to 10% of users for monitoring
3. **Phase 3**: Gradual rollout to 50% of users
4. **Phase 4**: Full deployment after monitoring success metrics

#### Rollback Plan
- [ ] ✅ **Feature Flags**: Ability to quickly disable new flow
- [ ] ✅ **Database Backup**: Snapshot before deployment
- [ ] ✅ **Monitoring Alerts**: Automated alerts for errors or performance degradation

---

## 🚨 CRITICAL ISSUES TO RESOLVE

### 🔴 Security Vulnerabilities
1. **Price Manipulation Risk**: Current checkout allows users to potentially modify delivery fees
2. **Duplicate PLZ Input**: Users enter PLZ twice, creating inconsistency opportunities
3. **Session State Vulnerability**: No protection against malicious PLZ changes during checkout
4. **Validation Bypass**: Possible to access checkout without proper PLZ validation

### 🔶 User Experience Issues  
1. **Confusing Duplicate Input**: Users must enter PLZ again in checkout form
2. **Unclear Pricing**: Delivery costs not visible until final checkout step
3. **No PLZ Change Option**: Users cannot safely modify delivery address
4. **Missing Free Delivery Progress**: No indication of progress toward free delivery

### 🔸 Technical Debt
1. **Inconsistent State Management**: PLZ stored in multiple places  
2. **Hardcoded Delivery Logic**: Pricing logic scattered across components
3. **Missing Type Safety**: No TypeScript interfaces for delivery data
4. **No Analytics**: Missing tracking for delivery-related user behavior

---

## 🛠️ DEVELOPMENT PATTERNS & BEST PRACTICES

### 🔐 Security-First Development
```typescript
// Always validate session integrity
const validateDeliverySession = (session: DeliverySession | null) => {
  if (!session?.isLocked) {
    throw new SecurityError('Invalid delivery session');
  }
  
  const sessionAge = Date.now() - new Date(session.lockedAt).getTime();
  if (sessionAge > SESSION_TIMEOUT) {
    throw new SecurityError('Session expired');
  }
  
  return true;
};

// Use session validation in all pricing components
const useSecureDeliveryData = () => {
  const session = useAppSelector(state => state.user.deliverySession);
  
  useEffect(() => {
    validateDeliverySession(session);
  }, [session]);
  
  return session;
};
```

### 📊 State Management Patterns
```typescript
// Centralized delivery state management
interface DeliveryState {
  session: DeliverySession | null;
  priceCalculation: DeliveryCalculation | null;
  isLoading: boolean;
  error: string | null;
}

// Use selectors for consistent data access
export const selectDeliveryFee = createSelector(
  [(state: RootState) => state.user.deliverySession],
  (session) => session?.deliveryFee ?? 0
);

export const selectIsFreeDelivery = createSelector(
  [(state: RootState) => state.user.deliverySession],
  (session) => session?.isFreeDelivery ?? false
);
```

### 🔄 Component Integration Patterns
```typescript
// HOC for delivery-aware components
const withDeliverySession = <P extends object>(
  Component: React.ComponentType<P>
) => {
  return (props: P) => {
    const session = useSecureDeliveryData();
    
    if (!session) {
      return <Navigate to="/plz-entry" replace />;
    }
    
    return <Component {...props} deliverySession={session} />;
  };
};

// Custom hook for delivery calculations
const useDeliveryCalculation = (cartTotal: number) => {
  const session = useSecureDeliveryData();
  
  return useMemo(() => {
    if (!session) return null;
    
    return calculateDeliveryFee(session.plz, cartTotal);
  }, [session?.plz, cartTotal]);
};
```

### 🎯 Error Handling Patterns
```typescript
// Centralized error handling for delivery operations
export class DeliveryError extends Error {
  constructor(
    message: string,
    public code: DeliveryValidationError,
    public plz?: string
  ) {
    super(message);
    this.name = 'DeliveryError';
  }
}

// Error boundary for delivery components
const DeliveryErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  return (
    <ErrorBoundary
      fallback={<DeliveryErrorFallback />}
      onError={(error) => {
        if (error instanceof DeliveryError) {
          trackDeliveryEvent('error', {
            code: error.code,
            plz: error.plz,
            message: error.message
          });
        }
      }}
    >
      {children}
    </ErrorBoundary>
  );
};
```

### 📱 Responsive Design Patterns
```typescript
// Mobile-first delivery components
const DeliveryInfo: React.FC = () => {
  const session = useSecureDeliveryData();
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  return (
    <div className={cn(
      "delivery-info",
      isMobile ? "compact-layout" : "detailed-layout"
    )}>
      {isMobile ? (
        <CompactDeliveryDisplay session={session} />
      ) : (
        <DetailedDeliveryDisplay session={session} />
      )}
    </div>
  );
};
```

---

## 📋 DEVELOPMENT WORKFLOW

### 🔄 Branch Strategy
```bash
# Main development branch
git checkout -b lim1712/update-tarif-delivery

# Feature branches for each phase
git checkout -b feature/delivery-tariff-config
git checkout -b feature/redux-state-management  
git checkout -b feature/component-integration
git checkout -b feature/secure-checkout
git checkout -b feature/testing-validation
```

### ✅ Code Review Checklist
- [ ] **Security**: All delivery calculations use centralized validation
- [ ] **Performance**: No unnecessary re-renders or expensive calculations
- [ ] **Type Safety**: All delivery data properly typed
- [ ] **Error Handling**: Proper error boundaries and user feedback
- [ ] **Testing**: Unit and integration tests cover new functionality
- [ ] **Documentation**: Code comments and updated documentation

### 🧪 Testing Strategy
```typescript
// Test structure for delivery functionality
describe('Delivery System', () => {
  describe('Tariff Configuration', () => {
    // Test tariff lookup and calculations
  });
  
  describe('PLZ Validation', () => {
    // Test validation logic and error cases
  });
  
  describe('Session Management', () => {
    // Test session locking and security
  });
  
  describe('Component Integration', () => {
    // Test React component behavior
  });
  
  describe('Security', () => {
    // Test for vulnerabilities and edge cases
  });
});
```

---

### **📍 STEP 1: Home Page - PLZ Collection & Validation**
```
Usuario en Home → Ingresa PLZ → Validación inmediata → Muestra tarifas reales → Lock session
```
**Resultado:** PLZ validado + tarifa cargada + session bloqueada

### **🛒 STEP 2: Menu & Cart - Pricing Dinámico**
```
Menu navigation → Cart sidebar (PLZ-aware) → Precios dinámicos → Free delivery progress
```
**Resultado:** Precios consistentes basados en PLZ inicial

### **✅ STEP 3: Checkout - Validación Final**
```
Checkout form (sin PLZ input) → Validación de consistencia → Opción de cambio PLZ
```
**Resultado:** Checkout simplificado con precios garantizados

### **🔄 STEP 4: PLZ Change Flow (Opcional)**
```
Button "Cambiar PLZ" → Modal comparison → Confirmación → Redirect a cart
```
**Resultado:** Cambio controlado y seguro de zona de entrega

---

## 🏗️ IMPLEMENTATION PHASES

### 🔴 **PHASE 1: CRITICAL SECURITY & CORE FUNCTIONALITY**
*Estimated: 2.5 days*

#### 1.1 Create Delivery Tariff Configuration
- [ ] **File:** `src/utils/deliveryTariffs.ts`
- [ ] **Task:** Implement tariff configuration with new pricing structure
- [ ] **Dependencies:** None
- [ ] **Testing:** Unit tests for tariff calculations

**🔧 Development Guide:**
```typescript
// deliveryTariffs.ts - CORE CONFIGURATION
export interface DeliveryTariff {
  plz: string[];
  mindestbestellwert: number;
  lieferkosten: number;
  lieferkosten_entfallen_ab: number;
}

export const DELIVERY_TARIFFS: DeliveryTariff[] = [
  {
    plz: ["44149"],
    mindestbestellwert: 12.00,
    lieferkosten: 0.00,
    lieferkosten_entfallen_ab: 0.00
  },
  // ... resto de tarifas según especificación
];

// Función de búsqueda optimizada
export const findTariffByPLZ = (plz: string): DeliveryTariff | null => {
  return DELIVERY_TARIFFS.find(tariff => 
    tariff.plz.includes(plz.trim())
  ) || null;
};
```

#### 1.2 Update Delivery Zone Validation
- [ ] **File:** `src/utils/deliveryZones.ts` 
- [ ] **Task:** Replace hardcoded zones with tariff-based validation
- [ ] **Dependencies:** 1.1 completed
- [ ] **Testing:** Validate all PLZ codes work correctly

**🔧 Development Guide:**
```typescript
// deliveryZones.ts - SIMPLIFIED VALIDATION
import { DELIVERY_TARIFFS } from './deliveryTariffs';

export function isValidDeliveryZone(postalCode: string): boolean {
  if (!postalCode?.trim()) return false;
  
  const cleanedCode = postalCode.trim();
  return DELIVERY_TARIFFS.some(tariff => 
    tariff.plz.includes(cleanedCode)
  );
}

// Nueva función para obtener todas las zonas
export function getAllDeliveryZones(): string[] {
  return DELIVERY_TARIFFS.flatMap(tariff => tariff.plz)
    .filter(plz => plz !== 'abholung');
}
```

#### 1.3 Implement Delivery Pricing Calculator
- [ ] **File:** `src/utils/deliveryPricing.ts` (NEW)
- [ ] **Task:** Create comprehensive pricing calculation functions
- [ ] **Dependencies:** 1.1 completed
- [ ] **Testing:** Test all pricing scenarios including edge cases

**🔧 Development Guide:**
```typescript
// deliveryPricing.ts - CORE BUSINESS LOGIC
import { DeliveryTariff, findTariffByPLZ } from './deliveryTariffs';

export interface DeliveryCalculation {
  tariff: DeliveryTariff;
  deliveryFee: number;
  isFreeDelivery: boolean;
  meetsMinimum: boolean;
  missingAmount: number;
  progressToFreeDelivery: number;
}

export function calculateDeliveryPrice(plz: string, subtotal: number): DeliveryCalculation {
  const tariff = findTariffByPLZ(plz);
  
  if (!tariff) {
    throw new Error(`No tariff found for PLZ: ${plz}`);
  }

  const meetsMinimum = subtotal >= tariff.mindestbestellwert;
  const isFreeDelivery = subtotal >= tariff.lieferkosten_entfallen_ab;
  const deliveryFee = isFreeDelivery ? 0 : tariff.lieferkosten;
  
  return {
    tariff,
    deliveryFee,
    isFreeDelivery,
    meetsMinimum,
    missingAmount: Math.max(0, tariff.mindestbestellwert - subtotal),
    progressToFreeDelivery: Math.min(100, (subtotal / tariff.lieferkosten_entfallen_ab) * 100)
  };
}

export function getTariffByPLZ(plz: string): DeliveryTariff {
  const tariff = findTariffByPLZ(plz);
  if (!tariff) {
    throw new Error(`Invalid PLZ for delivery: ${plz}`);
  }
  return tariff;
}
```

#### 1.4 Create TypeScript Interfaces
- [ ] **File:** `src/types/delivery.ts` (NEW)
- [ ] **Task:** Define comprehensive TypeScript interfaces
- [ ] **Dependencies:** 1.1 completed
- [ ] **Testing:** Type safety validation

**🔧 Development Guide:**
```typescript
// delivery.ts - TYPESCRIPT DEFINITIONS
export interface DeliveryTariff {
  plz: string[];
  mindestbestellwert: number;
  lieferkosten: number;
  lieferkosten_entfallen_ab: number;
}

export interface DeliveryCalculation {
  tariff: DeliveryTariff;
  deliveryFee: number;
  isFreeDelivery: boolean;
  meetsMinimum: boolean;
  missingAmount: number;
  progressToFreeDelivery: number;
}

export interface PLZChangeEvent {
  originalPLZ: string;
  newPLZ: string;
  changeReason: 'correction' | 'cheaper_delivery' | 'address_change';
  impactOnTotal: number;
  cartAdjustmentNeeded: boolean;
  timestamp: string;
}

export interface TariffComparison {
  current: DeliveryCalculation;
  new: DeliveryCalculation;
  priceIncrease: number;
  warnings: string[];
  canProceed: boolean;
}
```

#### 1.5 Secure PLZ Storage in Redux
- [ ] **File:** `src/features/user/userSlice.ts`
- [ ] **Task:** Add tariff data and session lock to user state
- [ ] **Dependencies:** 1.3, 1.4 completed
- [ ] **Testing:** State persistence and validation

**🔧 Development Guide:**
```typescript
// userSlice.ts - REDUX STATE MANAGEMENT
import { DeliveryTariff } from '../../types/delivery';

interface UserState {
  username: string;
  postalCode: string;
  deliveryTariff: DeliveryTariff | null;  // ✅ NUEVO
  sessionLocked: boolean;                  // ✅ NUEVO
  plzChangeCount: number;                  // ✅ NUEVO
  // ...existing fields
}

const initialState: UserState = {
  username: "",
  postalCode: "",
  deliveryTariff: null,
  sessionLocked: false,
  plzChangeCount: 0,
  // ...existing fields
};

// ✅ NUEVAS ACTIONS
reducers: {
  updatePostalCodeWithTariff(state, action) {
    const { postalCode, tariff } = action.payload;
    state.postalCode = postalCode;
    state.deliveryTariff = tariff;
    state.sessionLocked = true; // Lock inmediatamente
  },
  
  changePLZ(state, action) {
    const { postalCode, tariff } = action.payload;
    state.postalCode = postalCode;
    state.deliveryTariff = tariff;
    state.plzChangeCount += 1;
  },
  
  resetSession(state) {
    state.sessionLocked = false;
    state.plzChangeCount = 0;
    state.deliveryTariff = null;
  }
}
```

#### 1.6 Update Home PLZ Input with Real Pricing
- [ ] **File:** `src/features/user/CreateUser.tsx`
- [ ] **Task:** Show delivery cost and minimum order immediately
- [ ] **Dependencies:** 1.3, 1.5 completed
- [ ] **Testing:** User can see costs before proceeding

**🔧 Development Guide:**
```typescript
// CreateUser.tsx - ENHANCED PLZ INPUT
import { calculateDeliveryPrice, getTariffByPLZ } from '../../utils/deliveryPricing';
import { updatePostalCodeWithTariff } from './userSlice';

function CreateUser() {
  const [plzInfo, setPlzInfo] = useState<DeliveryCalculation | null>(null);
  const [plzError, setPlzError] = useState("");
  
  const handlePLZChange = (plz: string) => {
    setPostalCode(plz);
    
    if (plz.length === 5) {
      try {
        const tariff = getTariffByPLZ(plz);
        const calculation = calculateDeliveryPrice(plz, 0); // 0 para mostrar info base
        setPlzInfo(calculation);
        setPlzError("");
      } catch (error) {
        setPlzInfo(null);
        setPlzError("Diese PLZ wird nicht beliefert");
      }
    }
  };

  const handleSubmit = () => {
    if (plzInfo) {
      dispatch(updatePostalCodeWithTariff({
        postalCode,
        tariff: plzInfo.tariff
      }));
      navigate("/menu");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* PLZ Input */}
      <input 
        value={postalCode}
        onChange={(e) => handlePLZChange(e.target.value)}
        placeholder="44149"
      />
      
      {/* ✅ NUEVO: Información de tarifa en tiempo real */}
      {plzInfo && (
        <div className="bg-green-50 p-3 rounded-lg mt-2">
          <p className="text-green-800 font-medium">
            ✅ Liefergebiet bestätigt
          </p>
          <div className="text-sm text-green-700 mt-1">
            <p>📦 Mindestbestellwert: €{plzInfo.tariff.mindestbestellwert}</p>
            <p>🚚 Lieferkosten: €{plzInfo.tariff.lieferkosten}</p>
            {plzInfo.tariff.lieferkosten_entfallen_ab > 0 && (
              <p>🎉 Kostenlose Lieferung ab €{plzInfo.tariff.lieferkosten_entfallen_ab}</p>
            )}
          </div>
        </div>
      )}
    </form>
  );
}
```

#### 1.7 Lock PLZ During Session
- [ ] **File:** `src/features/user/CreateUser.tsx`
- [ ] **Task:** Prevent PLZ changes once menu is accessed
- [ ] **Dependencies:** 1.5 completed
- [ ] **Testing:** Ensure session security

**🔧 Development Guide:**
```typescript
// CreateUser.tsx - SESSION PROTECTION
function CreateUser() {
  const sessionLocked = useSelector(state => state.user.sessionLocked);
  
  // ✅ NUEVO: Redirect si session ya está bloqueada
  useEffect(() => {
    if (sessionLocked) {
      navigate("/menu");
    }
  }, [sessionLocked, navigate]);

  // ✅ NUEVO: Prevenir navegación back después de lock
  const handleMenuNavigation = () => {
    // Session se bloquea cuando se accede al menu
    dispatch(updatePostalCodeWithTariff({
      postalCode,
      tariff: plzInfo.tariff
    }));
    navigate("/menu", { replace: true }); // replace previene back
  };
}
```

#### 1.8 Update Cart Sidebar Dynamic Pricing
- [ ] **File:** `src/features/cart/CartSidebar.tsx`
- [ ] **Task:** Pass PLZ context to cart header for delivery mode selection
- [ ] **Dependencies:** 1.3, 1.5 completed
- [ ] **Testing:** Cart sidebar reflects correct delivery zones

**🔧 Development Guide:**
```typescript
// CartSidebar.tsx - PLZ AWARENESS
function CartSidebar({ isOpen, onClose }) {
  const userPLZ = useSelector(state => state.user.postalCode);
  const deliveryTariff = useSelector(state => state.user.deliveryTariff);
  
  return (
    <div className="cart-sidebar">
      <CartHeader 
        deliveryMode={deliveryMode}
        onDeliveryModeChange={setDeliveryMode}
        userPLZ={userPLZ}                    // ✅ NUEVO
        deliveryTariff={deliveryTariff}      // ✅ NUEVO
        onClose={onClose}
      />
      {/* Rest of sidebar */}
    </div>
  );
}
```

#### 1.9 Update Cart Summary with Dynamic Pricing
- [ ] **File:** `src/features/cart/CartSummary.tsx`
- [ ] **Task:** Replace hardcoded 0.99 and fix free delivery logic
- [ ] **Dependencies:** 1.3, 1.5 completed
- [ ] **Testing:** Cart shows correct delivery fees and progress

**🔧 Development Guide:**
```typescript
// CartSummary.tsx - DYNAMIC PRICING CALCULATION
import { calculateDeliveryPrice } from '../../utils/deliveryPricing';

function CartSummary({ deliveryMode, onCheckout }) {
  const totalCartPrice = useSelector(getTotalCartPrice);
  const userPLZ = useSelector(state => state.user.postalCode);
  const deliveryTariff = useSelector(state => state.user.deliveryTariff);
  
  // ✅ NUEVO: Cálculo dinámico de tarifas
  const deliveryCalculation = useMemo(() => {
    if (deliveryMode === 'delivery' && userPLZ && deliveryTariff) {
      return calculateDeliveryPrice(userPLZ, totalCartPrice);
    }
    return null;
  }, [deliveryMode, userPLZ, totalCartPrice, deliveryTariff]);

  // ✅ REEMPLAZA hardcoded values
  const subtotal = totalCartPrice;
  const deliveryFee = deliveryCalculation?.deliveryFee || 0;
  const serviceFee = Math.round(subtotal * 0.025 * 100) / 100;
  const finalServiceFee = Math.min(serviceFee, 0.99);
  const total = subtotal + deliveryFee + finalServiceFee;

  return (
    <div className="cart-summary">
      {/* ✅ NUEVO: Progress bar dinámico */}
      {deliveryMode === 'delivery' && deliveryCalculation && (
        <div className="delivery-progress">
          <div className="progress-info">
            {deliveryCalculation.isFreeDelivery ? (
              <span className="text-green-600">🎉 Kostenlose Lieferung!</span>
            ) : (
              <span>
                🚚 Noch €{(deliveryCalculation.tariff.lieferkosten_entfallen_ab - subtotal).toFixed(2)} 
                für kostenlose Lieferung
              </span>
            )}
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${deliveryCalculation.progressToFreeDelivery}%` }}
            />
          </div>
        </div>
      )}

      {/* Pricing breakdown */}
      <div className="pricing-details">
        <div>Zwischensumme: €{subtotal.toFixed(2)}</div>
        
        {deliveryMode === 'delivery' && (
          <div>
            Lieferkosten: €{deliveryFee.toFixed(2)}
            {deliveryCalculation?.isFreeDelivery && (
              <span className="text-green-600 ml-2">(Gespart!)</span>
            )}
          </div>
        )}
        
        <div>Service: €{finalServiceFee.toFixed(2)}</div>
        <div className="total">Gesamt: €{total.toFixed(2)}</div>
      </div>
    </div>
  );
}
```

#### 1.10 Update Cart Header with PLZ Awareness
- [ ] **File:** `src/features/cart/CartHeader.tsx`
- [ ] **Task:** Disable delivery mode if no PLZ selected or invalid zone
- [ ] **Dependencies:** 1.5, 1.8 completed
- [ ] **Testing:** Delivery/collection toggle works correctly

**🔧 Development Guide:**
```typescript
// CartHeader.tsx - PLZ-AWARE DELIVERY TOGGLE
function CartHeader({ deliveryMode, onDeliveryModeChange, userPLZ, deliveryTariff, onClose }) {
  const canDelivery = userPLZ && deliveryTariff;
  
  return (
    <div className="cart-header">
      <div className="delivery-tabs">
        {/* Collection always available */}
        <button
          onClick={() => onDeliveryModeChange('collection')}
          className={deliveryMode === 'collection' ? 'active' : ''}
        >
          🏪 Abholung
        </button>

        {/* ✅ NUEVO: Delivery conditional */}
        <button
          onClick={() => canDelivery && onDeliveryModeChange('delivery')}
          disabled={!canDelivery}
          className={`
            ${deliveryMode === 'delivery' ? 'active' : ''} 
            ${!canDelivery ? 'disabled' : ''}
          `}
        >
          🚚 Lieferung
          {userPLZ && (
            <span className="plz-info">({userPLZ})</span>
          )}
        </button>
      </div>

      {/* ✅ NUEVO: PLZ requirement message */}
      {!canDelivery && (
        <div className="plz-required-message">
          <p className="text-orange-600 text-sm">
            📍 PLZ eingeben für Lieferung
          </p>
          <button 
            onClick={() => {
              onClose();
              // Navigate to home to enter PLZ
            }}
            className="text-orange-600 underline text-sm"
          >
            PLZ eingeben
          </button>
        </div>
      )}
    </div>
  );
}
```

#### 1.11 Secure Checkout Validation
- [ ] **File:** `src/features/order/CheckoutForm.tsx`
- [ ] **Task:** Validate PLZ hasn't changed and pricing is consistent
- [ ] **Dependencies:** 1.3, 1.5 completed
- [ ] **Testing:** Prevent price manipulation and duplicate PLZ input

**🔧 Development Guide:**
```typescript
// CheckoutForm.tsx - SECURE VALIDATION & PLZ REMOVAL
function CheckoutForm() {
  const userPLZ = useSelector(state => state.user.postalCode);
  const deliveryTariff = useSelector(state => state.user.deliveryTariff);
  const cartTotalPrice = useSelector(getTotalCartPrice);
  
  // ✅ NUEVO: Validación de seguridad
  useEffect(() => {
    if (!userPLZ || !deliveryTariff) {
      // Redirect a home si no hay PLZ válido
      navigate('/', { replace: true });
      return;
    }
    
    // Validar que la tarifa sigue siendo válida
    try {
      const currentTariff = getTariffByPLZ(userPLZ);
      if (JSON.stringify(currentTariff) !== JSON.stringify(deliveryTariff)) {
        console.warn('Tariff mismatch detected, refreshing...');
        // Update tariff in Redux
        dispatch(updatePostalCodeWithTariff({
          postalCode: userPLZ,
          tariff: currentTariff
        }));
      }
    } catch (error) {
      console.error('PLZ validation failed:', error);
      navigate('/', { replace: true });
    }
  }, [userPLZ, deliveryTariff, navigate, dispatch]);

  // ✅ NUEVO: Cálculo de precios con validación
  const pricingCalculation = useMemo(() => {
    if (deliveryMode === 'delivery' && userPLZ) {
      return calculateDeliveryPrice(userPLZ, cartTotalPrice);
    }
    return null;
  }, [deliveryMode, userPLZ, cartTotalPrice]);

  // ✅ REEMPLAZA cálculos hardcoded
  const subtotal = cartTotalPrice;
  const deliveryFee = pricingCalculation?.deliveryFee || 0;
  const serviceFee = Math.round(subtotal * 0.025 * 100) / 100;
  const finalServiceFee = Math.min(serviceFee, 0.99);
  const total = subtotal + deliveryFee + finalServiceFee;

  return (
    <div className="checkout-form">
      {/* ❌ ELIMINADO: PLZ input field (lines 440-460) */}
      
      {/* ✅ NUEVO: PLZ display con opción de cambio */}
      <div className="plz-display">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm text-gray-600">📍 Liefergebiet:</span>
              <span className="font-semibold text-gray-900 ml-2">{userPLZ}</span>
            </div>
            <button 
              onClick={() => setShowPLZChangeModal(true)}
              className="text-blue-600 text-sm underline hover:text-blue-800"
            >
              PLZ ändern
            </button>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Lieferkosten: €{deliveryFee.toFixed(2)} • 
            Mindestbestellwert: €{deliveryTariff?.mindestbestellwert || 0}
          </div>
        </div>
      </div>

      {/* Rest of form without PLZ input */}
      <form onSubmit={handleSubmit}>
        {/* Customer info, address (if delivery), payment */}
      </form>
    </div>
  );
}
```

---

### 🟡 **PHASE 2: UX IMPROVEMENTS & PLZ CHANGE FUNCTIONALITY**
*Estimated: 2 days*

#### 2.1 Remove Duplicate PLZ Input from Checkout
- [ ] **File:** `src/features/order/CheckoutForm.tsx`
- [ ] **Task:** Remove PLZ input field, use Redux state only
- [ ] **Dependencies:** Phase 1 completed
- [ ] **Testing:** Checkout form works without PLZ input

**🔧 Development Guide:**
```typescript
// CheckoutForm.tsx - CLEAN UP DUPLICATE PLZ INPUT
// ❌ REMOVE: Lines 440-460 (PLZ input field)
// ❌ REMOVE: PLZ validation in form validation
// ❌ REMOVE: PLZ error handling in form errors

// ✅ KEEP: Only address input for delivery mode
{deliveryMode === 'delivery' && (
  <div className="delivery-address">
    <input
      type="text"
      value={formData.address}
      onChange={(e) => handleInputChange('address', e.target.value)}
      placeholder="Straße und Hausnummer"
    />
    {/* City is fixed to Dortmund, PLZ comes from Redux */}
    <input
      type="text"
      value="Dortmund"
      readOnly
      className="bg-gray-50"
    />
  </div>
)}
```

#### 2.2 PLZ Change Button in Checkout
- [ ] **File:** `src/features/order/CheckoutForm.tsx`
- [ ] **Task:** Add "PLZ ändern" button with current PLZ display
- [ ] **Dependencies:** 2.1 completed
- [ ] **Testing:** Button triggers change flow correctly

**🔧 Development Guide:**
```typescript
// CheckoutForm.tsx - PLZ CHANGE BUTTON
function CheckoutForm() {
  const [showPLZChangeModal, setShowPLZChangeModal] = useState(false);
  
  return (
    <div>
      {/* PLZ Display Section */}
      <div className="plz-section">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h3 className="font-medium">Liefergebiet</h3>
            <p className="text-sm text-gray-600">
              📍 {userPLZ} • €{deliveryFee.toFixed(2)} Lieferkosten
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowPLZChangeModal(true)}
            className="px-4 py-2 text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50"
          >
            PLZ ändern
          </button>
        </div>
      </div>

      {/* PLZ Change Modal */}
      {showPLZChangeModal && (
        <PLZChangeModal
          currentPLZ={userPLZ}
          currentCartTotal={cartTotalPrice}
          onClose={() => setShowPLZChangeModal(false)}
          onConfirm={handlePLZChange}
        />
      )}
    </div>
  );
}
```

#### 2.3 PLZ Change Modal Component
- [ ] **File:** `src/ui/PLZChangeModal.tsx` (NEW)
- [ ] **Task:** Create modal for safe PLZ changes
- [ ] **Dependencies:** 2.2 completed
- [ ] **Testing:** Modal validation and user flow

**🔧 Development Guide:**
```typescript
// PLZChangeModal.tsx - SAFE PLZ CHANGE INTERFACE
interface PLZChangeModalProps {
  currentPLZ: string;
  currentCartTotal: number;
  onClose: () => void;
  onConfirm: (newPLZ: string) => void;
}

function PLZChangeModal({ currentPLZ, currentCartTotal, onClose, onConfirm }) {
  const [newPLZ, setNewPLZ] = useState('');
  const [validation, setValidation] = useState<TariffComparison | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const validateNewPLZ = async (plz: string) => {
    if (plz.length !== 5) return;
    
    setIsValidating(true);
    try {
      // Get current and new tariff calculations
      const currentCalc = calculateDeliveryPrice(currentPLZ, currentCartTotal);
      const newCalc = calculateDeliveryPrice(plz, currentCartTotal);
      
      const comparison: TariffComparison = {
        current: currentCalc,
        new: newCalc,
        priceIncrease: newCalc.deliveryFee - currentCalc.deliveryFee,
        warnings: generateWarnings(currentCalc, newCalc, currentCartTotal),
        canProceed: newCalc.meetsMinimum
      };
      
      setValidation(comparison);
    } catch (error) {
      setValidation(null);
      // Show error
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>PLZ ändern</h2>
        
        {/* PLZ Input */}
        <input
          type="text"
          value={newPLZ}
          onChange={(e) => {
            setNewPLZ(e.target.value);
            validateNewPLZ(e.target.value);
          }}
          placeholder="Neue PLZ eingeben"
          maxLength={5}
        />

        {/* Validation Result */}
        {validation && (
          <TariffComparison 
            comparison={validation}
            currentCartTotal={currentCartTotal}
          />
        )}

        {/* Actions */}
        <div className="modal-actions">
          <button onClick={onClose}>Abbrechen</button>
          <button 
            onClick={() => onConfirm(newPLZ)}
            disabled={!validation?.canProceed}
            className="primary"
          >
            PLZ ändern
          </button>
        </div>
      </div>
    </div>
  );
}
```

#### 2.4 Tariff Comparison UI
- [ ] **File:** `src/ui/TariffComparison.tsx` (NEW)
- [ ] **Task:** Show old vs new pricing before confirmation
- [ ] **Dependencies:** 2.3 completed
- [ ] **Testing:** All comparison scenarios display correctly

**🔧 Development Guide:**
```typescript
// TariffComparison.tsx - VISUAL TARIFF COMPARISON
interface TariffComparisonProps {
  comparison: TariffComparison;
  currentCartTotal: number;
}

function TariffComparison({ comparison, currentCartTotal }) {
  const { current, new: newCalc, priceIncrease, warnings, canProceed } = comparison;

  return (
    <div className="tariff-comparison">
      {/* Price Comparison Table */}
      <div className="comparison-table">
        <div className="comparison-header">
          <div>Aktuell</div>
          <div>Neu</div>
        </div>
        
        <div className="comparison-row">
          <div>
            <span className="plz">PLZ {current.tariff.plz[0]}</span>
            <span className="price">€{current.deliveryFee.toFixed(2)}</span>
          </div>
          <div>
            <span className="plz">PLZ {newCalc.tariff.plz[0]}</span>
            <span className={`price ${priceIncrease > 0 ? 'increase' : priceIncrease < 0 ? 'decrease' : ''}`}>
              €{newCalc.deliveryFee.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Price Impact */}
        {priceIncrease !== 0 && (
          <div className={`price-impact ${priceIncrease > 0 ? 'negative' : 'positive'}`}>
            {priceIncrease > 0 ? (
              <span>📈 Lieferkosten steigen um €{priceIncrease.toFixed(2)}</span>
            ) : (
              <span>📉 Lieferkosten sinken um €{Math.abs(priceIncrease).toFixed(2)}</span>
            )}
          </div>
        )}
      </div>

      {/* Minimum Order Validation */}
      {!newCalc.meetsMinimum && (
        <div className="warning-box">
          <h4>⚠️ Mindestbestellwert nicht erreicht</h4>
          <p>
            Neue PLZ benötigt mindestens €{newCalc.tariff.mindestbestellwert.toFixed(2)}.
            Aktuell: €{currentCartTotal.toFixed(2)}
          </p>
          <p>Fehlend: €{newCalc.missingAmount.toFixed(2)}</p>
        </div>
      )}

      {/* Warnings */}
      {warnings.length > 0 && (
        <div className="warnings-list">
          {warnings.map((warning, index) => (
            <div key={index} className="warning-item">
              ⚠️ {warning}
            </div>
          ))}
        </div>
      )}

      {/* Free Delivery Impact */}
      <div className="free-delivery-comparison">
        <div>
          <span>Kostenlose Lieferung ab:</span>
        </div>
        <div className="comparison-row">
          <div>€{current.tariff.lieferkosten_entfallen_ab.toFixed(2)}</div>
          <div>€{newCalc.tariff.lieferkosten_entfallen_ab.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
}
```

#### 2.5 Smart PLZ Change Warnings
- [ ] **File:** `src/utils/plzChangeValidation.ts` (NEW)
- [ ] **Task:** Generate contextual warnings for PLZ changes
- [ ] **Dependencies:** 2.4 completed
- [ ] **Testing:** Warning logic for all edge cases

**🔧 Development Guide:**
```typescript
// plzChangeValidation.ts - INTELLIGENT WARNING SYSTEM
export function generateWarnings(
  currentCalc: DeliveryCalculation,
  newCalc: DeliveryCalculation,
  cartTotal: number
): string[] {
  const warnings: string[] = [];

  // Price increase warning
  if (newCalc.deliveryFee > currentCalc.deliveryFee) {
    warnings.push(
      `Lieferkosten steigen von €${currentCalc.deliveryFee.toFixed(2)} auf €${newCalc.deliveryFee.toFixed(2)}`
    );
  }

  // Minimum order warning
  if (!newCalc.meetsMinimum) {
    warnings.push(
      `Mindestbestellwert von €${newCalc.tariff.mindestbestellwert.toFixed(2)} nicht erreicht`
    );
  }

  // Free delivery threshold impact
  if (newCalc.tariff.lieferkosten_entfallen_ab > currentCalc.tariff.lieferkosten_entfallen_ab) {
    warnings.push(
      `Höherer Mindestbetrag für kostenlose Lieferung: €${newCalc.tariff.lieferkosten_entfallen_ab.toFixed(2)}`
    );
  }

  // Loss of free delivery
  if (currentCalc.isFreeDelivery && !newCalc.isFreeDelivery) {
    warnings.push('Kostenlose Lieferung geht verloren');
  }

  return warnings;
}

export function validatePLZChange(
  currentPLZ: string,
  newPLZ: string,
  cartTotal: number
): { canProceed: boolean; blocking?: string; warnings: string[] } {
  try {
    const currentCalc = calculateDeliveryPrice(currentPLZ, cartTotal);
    const newCalc = calculateDeliveryPrice(newPLZ, cartTotal);
    
    const warnings = generateWarnings(currentCalc, newCalc, cartTotal);
    
    // Blocking conditions
    if (!newCalc.meetsMinimum) {
      return {
        canProceed: false,
        blocking: `Mindestbestellwert €${newCalc.tariff.mindestbestellwert.toFixed(2)} nicht erreicht`,
        warnings
      };
    }

    return {
      canProceed: true,
      warnings
    };
  } catch (error) {
    return {
      canProceed: false,
      blocking: 'PLZ nicht im Liefergebiet',
      warnings: []
    };
  }
}
```

#### 2.6 Cart Redirect After PLZ Change
- [ ] **File:** `src/features/order/CheckoutForm.tsx`
- [ ] **Task:** Redirect to cart to show updated pricing
- [ ] **Dependencies:** 2.3, 2.5 completed
- [ ] **Testing:** Smooth user flow after PLZ change

**🔧 Development Guide:**
```typescript
// CheckoutForm.tsx - PLZ CHANGE HANDLER
function CheckoutForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handlePLZChange = async (newPLZ: string) => {
    try {
      // Validate new PLZ
      const newTariff = getTariffByPLZ(newPLZ);
      
      // Update Redux state
      dispatch(changePLZ({
        postalCode: newPLZ,
        tariff: newTariff
      }));

      // Show success message
      toast.success(`PLZ geändert zu ${newPLZ}`);
      
      // Close modal
      setShowPLZChangeModal(false);
      
      // Redirect to cart to show new pricing
      setTimeout(() => {
        navigate('/cart', { 
          state: { 
            message: 'PLZ wurde geändert. Bitte überprüfen Sie die neuen Preise.',
            openCart: true 
          }
        });
      }, 500);
      
    } catch (error) {
      toast.error('Fehler beim Ändern der PLZ');
    }
  };

  return (
    // ... component JSX
  );
}
```

#### 2.7 Enhanced Cart Protection
- [ ] **File:** `src/features/cart/CartHeader.tsx`
- [ ] **Task:** Show PLZ requirement message when no valid PLZ
- [ ] **Dependencies:** Phase 1 completed
- [ ] **Testing:** Clear messaging for PLZ requirement

**🔧 Development Guide:**
```typescript
// CartHeader.tsx - ENHANCED PLZ PROTECTION
function CartHeader({ deliveryMode, onDeliveryModeChange, userPLZ, deliveryTariff, onClose }) {
  const navigate = useNavigate();
  
  const handlePLZRequired = () => {
    onClose(); // Close cart
    navigate('/', { 
      state: { 
        message: 'Bitte geben Sie Ihre PLZ ein, um Lieferoptionen zu sehen.' 
      }
    });
  };

  return (
    <div className="cart-header">
      {/* Mode Selection */}
      <div className="mode-selector">
        <button
          onClick={() => onDeliveryModeChange('collection')}
          className={deliveryMode === 'collection' ? 'active' : ''}
        >
          🏪 Abholung
          <span className="estimate">~15 Min</span>
        </button>

        <button
          onClick={() => userPLZ ? onDeliveryModeChange('delivery') : null}
          disabled={!userPLZ}
          className={`
            ${deliveryMode === 'delivery' ? 'active' : ''} 
            ${!userPLZ ? 'disabled' : ''}
          `}
        >
          🚚 Lieferung
          {userPLZ && <span className="plz">({userPLZ})</span>}
          {userPLZ && <span className="estimate">~30 Min</span>}
        </button>
      </div>

      {/* PLZ Required Message */}
      {!userPLZ && (
        <div className="plz-required">
          <div className="message-box">
            <h4>📍 PLZ für Lieferung benötigt</h4>
            <p>Geben Sie Ihre Postleitzahl ein, um Lieferoptionen und Preise zu sehen.</p>
            <button 
              onClick={handlePLZRequired}
              className="plz-button"
            >
              PLZ eingeben
            </button>
          </div>
        </div>
      )}

      {/* Delivery Info */}
      {userPLZ && deliveryTariff && deliveryMode === 'delivery' && (
        <div className="delivery-info">
          <div className="info-row">
            <span>Mindestbestellwert:</span>
            <span>€{deliveryTariff.mindestbestellwert.toFixed(2)}</span>
          </div>
          <div className="info-row">
            <span>Lieferkosten:</span>
            <span>€{deliveryTariff.lieferkosten.toFixed(2)}</span>
          </div>
          {deliveryTariff.lieferkosten_entfallen_ab > 0 && (
            <div className="info-row free-delivery">
              <span>Kostenlos ab:</span>
              <span>€{deliveryTariff.lieferkosten_entfallen_ab.toFixed(2)}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
```

---

## 🚨 CRITICAL ISSUES DISCOVERED

### **Issue 1: Duplicate PLZ Input Problem**
- **Location:** `CheckoutForm.tsx` lines 440-460
- **Problem:** PLZ is collected in Home, but also in Checkout form
- **Risk:** User confusion, data inconsistency, price manipulation
- **Solution:** Remove PLZ input from checkout, use Redux state only

### **Issue 2: Cart Flow PLZ Disconnect**
- **Location:** `CartHeader.tsx` delivery mode selection
- **Problem:** User can select delivery mode without valid PLZ
- **Risk:** Wrong pricing shown, invalid delivery selection
- **Solution:** Disable delivery option if no valid PLZ in Redux

### **Issue 3: Free Delivery Logic Error**
- **Location:** `CartSummary.tsx` lines 34-48
- **Problem:** Hardcoded €12 free delivery threshold
- **Risk:** Wrong free delivery calculation for different PLZ zones
- **Solution:** Use dynamic threshold from tariff configuration

### **Issue 4: Session State Vulnerability**
- **Location:** `userSlice.ts` lacks session protection
- **Problem:** No mechanism to prevent PLZ manipulation mid-session
- **Risk:** Price circumvention, security breach
- **Solution:** Add sessionLocked and plzChangeCount to state

---

## 🧪 TESTING STRATEGY

### Unit Tests Required:
- [ ] Tariff calculation functions
- [ ] PLZ validation logic  
- [ ] Price comparison calculations
- [ ] State management actions

### Integration Tests Required:
- [ ] Complete user flow from PLZ input to checkout
- [ ] PLZ change flow end-to-end
- [ ] Error handling scenarios
- [ ] Mobile responsiveness

### Edge Cases to Test:
- [ ] Invalid PLZ codes
- [ ] Orders below minimum threshold for different PLZ zones
- [ ] PLZ changes that break minimum order requirements
- [ ] Multiple PLZ changes in same session (abuse prevention)
- [ ] Network failures during validation
- [ ] User tries to access cart without PLZ selection
- [ ] Direct navigation to checkout without PLZ
- [ ] Browser refresh with cart items but no PLZ
- [ ] Free delivery threshold changes between PLZ zones
- [ ] Collection mode vs delivery mode pricing differences

---

## 🚀 DEPLOYMENT CHECKLIST

### Pre-Deployment:
- [ ] All tests passing
- [ ] Code review completed
- [ ] Tariff configuration verified with business
- [ ] Backup plan for rollback prepared

### Post-Deployment:
- [ ] Monitor for pricing calculation errors
- [ ] Track user behavior with new PLZ flow
- [ ] Verify no security vulnerabilities
- [ ] Customer support briefed on changes

---

## 🔧 TECHNICAL SPECIFICATIONS

### New Tariff Structure:
```json
[
  {
    "plz": ["44149"],
    "mindestbestellwert": 12.00,
    "lieferkosten": 0.00,
    "lieferkosten_entfallen_ab": 0.00
  },
  {
    "plz": ["44225", "44227"],
    "mindestbestellwert": 12.00,
    "lieferkosten": 1.00,
    "lieferkosten_entfallen_ab": 50.00
  },
  {
    "plz": ["44369", "44379"],
    "mindestbestellwert": 15.00,
    "lieferkosten": 1.00,
    "lieferkosten_entfallen_ab": 50.00
  },
  {
    "plz": ["44135", "44139", "44388", "44147", "44137"],
    "mindestbestellwert": 19.99,
    "lieferkosten": 1.50,
    "lieferkosten_entfallen_ab": 50.00
  },
  {
    "plz": ["44143", "44141", "44145", "44229"],
    "mindestbestellwert": 30.00,
    "lieferkosten": 2.00,
    "lieferkosten_entfallen_ab": 60.00
  },
  {
    "plz": ["44359", "44357", "44265", "44263"],
    "mindestbestellwert": 30.00,
    "lieferkosten": 2.00,
    "lieferkosten_entfallen_ab": 60.00
  },
  {
    "plz": ["abholung"],
    "mindestbestellwert": 0.00,
    "lieferkosten": 0.00,
    "lieferkosten_entfallen_ab": 0.00
  }
]
```

### State Management:
```typescript
interface UserState {
  username: string;
  postalCode: string;
  deliveryTariff: DeliveryTariff | null;
  plzChangeCount: number;
  sessionLocked: boolean;
}
```

---

## ⚠️ RISK MITIGATION

### High-Risk Areas:
1. **Duplicate PLZ Input**: Remove from checkout to prevent data inconsistency
2. **Price Calculation Bugs**: Thorough testing of all tariff scenarios
3. **State Synchronization**: Ensure Redux state consistency across components
4. **PLZ Validation**: Handle edge cases in postal codes
5. **User Experience**: Prevent confusion during PLZ changes
6. **Cart Flow Protection**: Ensure valid PLZ before delivery mode selection
7. **Free Delivery Logic**: Dynamic thresholds based on PLZ zone

### Rollback Plan:
- Keep current hardcoded pricing as fallback
- Feature flags for gradual rollout
- Quick revert capabilities for critical issues
- Separate deployment of Phase 1 (security) vs Phase 2 (UX)

### Security Considerations:
- Session lock prevents mid-session PLZ manipulation
- Redux state validation at component level
- Price calculation verification in checkout
- Audit trail for PLZ changes

---

## 📞 STAKEHOLDER COMMUNICATION

### Business Team:
- [ ] Confirm new tariff rates are correct
- [ ] Review minimum order requirements
- [ ] Approve free delivery thresholds

### Customer Support:
- [ ] Brief on new PLZ change functionality  
- [ ] Provide troubleshooting guide
- [ ] Update FAQ with new pricing info

### Development Team:
- [ ] Code review assignments
- [ ] Testing responsibilities
- [ ] Deployment coordination

---

## 📊 SUCCESS METRICS

### Technical Metrics:
- Zero pricing calculation errors
- < 100ms tariff lookup time
- < 2% user session issues

### Business Metrics:
- Reduced cart abandonment rate
- Improved conversion from cart to checkout
- Decreased customer support tickets about pricing

### User Experience Metrics:
- PLZ change completion rate > 90%
- User satisfaction with pricing transparency
- Mobile usability scores

---

**Last Updated:** June 24, 2025  
**Next Review:** Upon Phase 1 completion  
**Document Owner:** lim1712  

---

> 💡 **Pro Tip:** Complete each phase fully before moving to the next. Phase 1 addresses critical security issues and must be thoroughly tested before implementing UX improvements in Phase 2.
