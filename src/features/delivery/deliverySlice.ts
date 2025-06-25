/**
 * 🚚 DELIVERY STATE SLICE
 * 
 * Redux slice for delivery system state management
 * Handles tariff caching, PLZ validation caching, and delivery zone information
 * 
 * @version 1.0.0
 * @created June 24, 2025
 * @phase Phase 2, Step 2.2 - Delivery State Slice
 */

import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type {
  DeliveryTariff,
  DeliveryError,
  PLZValidationResult,
  DeliveryZoneInfo,
  DeliveryCalculation,
} from "../../types/delivery";
import { 
  getTariffByPLZ, 
  calculateDeliveryFee, 
  DELIVERY_TARIFFS
} from "../../utils/deliveryTariffs";
import { 
  validatePLZ
} from "../../utils/deliveryZones";

// ===============================
// CACHE INTERFACES
// ===============================

interface TariffCacheEntry {
  readonly plz: string;
  readonly tariff: DeliveryTariff | null;
  readonly cachedAt: number;
  readonly isValid: boolean;
}

interface ValidationCacheEntry {
  readonly plz: string;
  readonly result: PLZValidationResult;
  readonly cachedAt: number;
  readonly isValid: boolean;
}

interface ZoneInfoCacheEntry {
  readonly plz: string;
  readonly zoneInfo: DeliveryZoneInfo | null;
  readonly cachedAt: number;
  readonly isValid: boolean;
}

interface DeliveryAnalytics {
  readonly totalLookups: number;
  readonly cacheHits: number;
  readonly cacheMisses: number;
  readonly errorCount: number;
  readonly averageResponseTime: number;
  readonly lastUpdated: number;
}

// ===============================
// DELIVERY STATE INTERFACE
// ===============================

interface DeliveryState {
  // Core state
  readonly isLoading: boolean;
  readonly error: DeliveryError | null;
  readonly lastUpdated: number;
  
  // Tariff management
  readonly allTariffs: readonly DeliveryTariff[];
  readonly activeTariff: DeliveryTariff | null;
  readonly tariffCache: Record<string, TariffCacheEntry>;
  
  // PLZ validation cache
  readonly validationCache: Record<string, ValidationCacheEntry>;
  
  // Delivery zone information cache
  readonly zoneInfoCache: Record<string, ZoneInfoCacheEntry>;
  
  // Current delivery calculation
  readonly currentCalculation: DeliveryCalculation | null;
  
  // Cache configuration
  readonly cacheSettings: {
    readonly maxCacheSize: number;
    readonly cacheExpiryMs: number;
    readonly enableAnalytics: boolean;
  };
  
  // Analytics
  readonly analytics: DeliveryAnalytics;
  
  // System status
  readonly systemStatus: {
    readonly isHealthy: boolean;
    readonly lastHealthCheck: number;
    readonly availabilityPercent: number;
  };
}

// ===============================
// INITIAL STATE
// ===============================

const initialState: DeliveryState = {
  // Core state
  isLoading: false,
  error: null,
  lastUpdated: 0,
  
  // Tariff management
  allTariffs: [],
  activeTariff: null,
  tariffCache: {},
  
  // Caches
  validationCache: {},
  zoneInfoCache: {},
  
  // Current state
  currentCalculation: null,
  
  // Cache configuration
  cacheSettings: {
    maxCacheSize: 1000,
    cacheExpiryMs: 30 * 60 * 1000, // 30 minutes
    enableAnalytics: true,
  },
  
  // Analytics
  analytics: {
    totalLookups: 0,
    cacheHits: 0,
    cacheMisses: 0,
    errorCount: 0,
    averageResponseTime: 0,
    lastUpdated: 0,
  },
  
  // System status
  systemStatus: {
    isHealthy: true,
    lastHealthCheck: Date.now(),
    availabilityPercent: 100,
  },
};

// ===============================
// ASYNC THUNKS
// ===============================

/**
 * Load all available tariffs and populate cache
 */
export const loadAllTariffs = createAsyncThunk(
  "delivery/loadAllTariffs",
  async function (_, { rejectWithValue }) {
    try {
      const startTime = performance.now();
      const tariffs = DELIVERY_TARIFFS;
      const endTime = performance.now();
      
      return {
        tariffs,
        responseTime: endTime - startTime,
        timestamp: Date.now(),
      };
    } catch (error) {
      return rejectWithValue({
        code: "SYSTEM_ERROR" as const,
        message: "Failed to load delivery tariffs",
        timestamp: new Date(),
        recoverable: true,
      });
    }
  }
);

/**
 * Get tariff for specific PLZ with caching
 */
export const getTariffWithCache = createAsyncThunk(
  "delivery/getTariffWithCache",
  async function (plz: string, { getState, rejectWithValue }) {
    try {
      const startTime = performance.now();
      const state = getState() as { delivery: DeliveryState };
      
      // Check cache first
      const cached = state.delivery.tariffCache[plz];
      const now = Date.now();
      
      if (cached && 
          cached.isValid && 
          (now - cached.cachedAt) < state.delivery.cacheSettings.cacheExpiryMs) {
        const endTime = performance.now();
        return {
          plz,
          tariff: cached.tariff,
          fromCache: true,
          responseTime: endTime - startTime,
          timestamp: now,
        };
      }
      
      // Cache miss - fetch fresh data
      const tariff = getTariffByPLZ(plz);
      const endTime = performance.now();
      
      return {
        plz,
        tariff,
        fromCache: false,
        responseTime: endTime - startTime,
        timestamp: now,
      };
    } catch (error) {
      return rejectWithValue({
        code: "SYSTEM_ERROR" as const,
        message: `Failed to get tariff for PLZ ${plz}`,
        timestamp: new Date(),
        recoverable: true,
      });
    }
  }
);

/**
 * Validate PLZ with caching
 */
export const validatePLZWithCache = createAsyncThunk(
  "delivery/validatePLZWithCache",
  async function (plz: string, { getState, rejectWithValue }) {
    try {
      const startTime = performance.now();
      const state = getState() as { delivery: DeliveryState };
      
      // Check cache first
      const cached = state.delivery.validationCache[plz];
      const now = Date.now();
      
      if (cached && 
          cached.isValid && 
          (now - cached.cachedAt) < state.delivery.cacheSettings.cacheExpiryMs) {
        const endTime = performance.now();
        return {
          plz,
          result: cached.result,
          fromCache: true,
          responseTime: endTime - startTime,
          timestamp: now,
        };
      }
      
      // Cache miss - validate fresh
      const result = validatePLZ(plz);
      const endTime = performance.now();
      
      return {
        plz,
        result,
        fromCache: false,
        responseTime: endTime - startTime,
        timestamp: now,
      };
    } catch (error) {
      return rejectWithValue({
        code: "SYSTEM_ERROR" as const,
        message: `Failed to validate PLZ ${plz}`,
        timestamp: new Date(),
        recoverable: true,
      });
    }
  }
);

/**
 * Calculate delivery fee with full context
 */
export const calculateDeliveryWithCache = createAsyncThunk(
  "delivery/calculateDeliveryWithCache",
  async function (
    { plz, orderValue }: { plz: string; orderValue: number },
    { dispatch, rejectWithValue }
  ) {
    try {
      const startTime = performance.now();
      
      // First ensure we have the tariff
      const tariffResult = await dispatch(getTariffWithCache(plz));
      
      if (getTariffWithCache.rejected.match(tariffResult)) {
        throw new Error("Failed to get tariff");
      }
      
      const { tariff } = tariffResult.payload;
      
      if (!tariff) {
        return rejectWithValue({
          code: "NOT_IN_DELIVERY_AREA" as const,
          message: `Delivery not available for PLZ ${plz}`,
          timestamp: new Date(),
          recoverable: true,
        });
      }
      
      // Calculate delivery fee
      const feeResult = calculateDeliveryFee(plz, orderValue);
      
      // Map to DeliveryCalculation interface
      const calculation: DeliveryCalculation = {
        tariff: feeResult.tariff!,
        deliveryFee: feeResult.fee,
        isFreeDelivery: feeResult.isFree,
        meetsMinimum: feeResult.meetsMinimum,
        missingAmount: feeResult.missingAmount,
        progressToFreeDelivery: tariff.lieferkosten_entfallen_ab > 0 
          ? Math.min(100, (orderValue / tariff.lieferkosten_entfallen_ab) * 100) 
          : 100,
        context: {
          cartSubtotal: orderValue,
          isPreview: false,
          calculatedAt: new Date(),
        }
      };
      
      const endTime = performance.now();
      
      return {
        plz,
        orderValue,
        calculation,
        responseTime: endTime - startTime,
        timestamp: Date.now(),
      };
    } catch (error) {
      return rejectWithValue({
        code: "SYSTEM_ERROR" as const,
        message: `Failed to calculate delivery for PLZ ${plz}`,
        timestamp: new Date(),
        recoverable: true,
      });
    }
  }
);

// ===============================
// DELIVERY SLICE
// ===============================

const deliverySlice = createSlice({
  name: "delivery",
  initialState,
  reducers: {
    // Cache management
    clearTariffCache(state) {
      state.tariffCache = {};
      state.analytics.totalLookups = 0;
      state.analytics.cacheHits = 0;
      state.analytics.cacheMisses = 0;
    },
    
    clearValidationCache(state) {
      state.validationCache = {};
    },
    
    clearZoneInfoCache(state) {
      state.zoneInfoCache = {};
    },
    
    clearAllCaches(state) {
      state.tariffCache = {};
      state.validationCache = {};
      state.zoneInfoCache = {};
      state.analytics.totalLookups = 0;
      state.analytics.cacheHits = 0;
      state.analytics.cacheMisses = 0;
    },
    
    // Cache configuration
    updateCacheSettings(state, action: PayloadAction<Partial<typeof initialState.cacheSettings>>) {
      state.cacheSettings = {
        ...state.cacheSettings,
        ...action.payload,
      };
    },
    
    // Active tariff management
    setActiveTariff(state, action: PayloadAction<DeliveryTariff | null>) {
      state.activeTariff = action.payload as any; // Cast to handle readonly properties
      state.lastUpdated = Date.now();
    },
    
    // Current calculation
    setCurrentCalculation(state, action: PayloadAction<DeliveryCalculation | null>) {
      state.currentCalculation = action.payload as any; // Cast to handle readonly properties
      state.lastUpdated = Date.now();
    },
    
    // Error handling
    clearError(state) {
      state.error = null;
    },
    
    // System health
    updateSystemHealth(state, action: PayloadAction<{ isHealthy: boolean; availabilityPercent: number }>) {
      state.systemStatus = {
        isHealthy: action.payload.isHealthy,
        lastHealthCheck: Date.now(),
        availabilityPercent: action.payload.availabilityPercent,
      };
    },
    
    // Analytics
    recordAnalytics(state, action: PayloadAction<{ 
      type: 'cache_hit' | 'cache_miss' | 'error'; 
      responseTime?: number; 
    }>) {
      const { type, responseTime = 0 } = action.payload;
      
      state.analytics.totalLookups++;
      
      if (type === 'cache_hit') {
        state.analytics.cacheHits++;
      } else if (type === 'cache_miss') {
        state.analytics.cacheMisses++;
      } else if (type === 'error') {
        state.analytics.errorCount++;
      }
      
      // Update average response time
      if (responseTime > 0) {
        const currentAvg = state.analytics.averageResponseTime;
        const totalRequests = state.analytics.totalLookups;
        state.analytics.averageResponseTime = 
          ((currentAvg * (totalRequests - 1)) + responseTime) / totalRequests;
      }
      
      state.analytics.lastUpdated = Date.now();
    },
  },
  
  extraReducers: (builder) =>
    builder
      // Load all tariffs
      .addCase(loadAllTariffs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadAllTariffs.fulfilled, (state, action) => {
        const { tariffs, responseTime, timestamp } = action.payload;
        
        state.allTariffs = tariffs as any; // Cast to handle readonly arrays
        state.isLoading = false;
        state.lastUpdated = timestamp;
        
        // Record analytics
        deliverySlice.caseReducers.recordAnalytics(state, {
          type: 'recordAnalytics',
          payload: { type: 'cache_miss', responseTime },
        });
      })
      .addCase(loadAllTariffs.rejected, (state, action) => {
        state.isLoading = false;
        const error = action.payload as any;
        state.error = {
          code: error.code,
          message: error.message,
          timestamp: error.timestamp,
          recoverable: error.recoverable,
        };
        
        deliverySlice.caseReducers.recordAnalytics(state, {
          type: 'recordAnalytics',
          payload: { type: 'error' },
        });
      })
      
      // Get tariff with cache
      .addCase(getTariffWithCache.fulfilled, (state, action) => {
        const { plz, tariff, fromCache, responseTime, timestamp } = action.payload;
        
        // Update cache
        state.tariffCache[plz] = {
          plz,
          tariff: tariff as any, // Cast to handle readonly properties
          cachedAt: timestamp,
          isValid: true,
        };
        
        // Set as active if not set
        if (!state.activeTariff && tariff) {
          state.activeTariff = tariff as any; // Cast to handle readonly properties
        }
        
        // Record analytics
        deliverySlice.caseReducers.recordAnalytics(state, {
          type: 'recordAnalytics',
          payload: { 
            type: fromCache ? 'cache_hit' : 'cache_miss', 
            responseTime 
          },
        });
        
        state.lastUpdated = timestamp;
      })
      .addCase(getTariffWithCache.rejected, (state, action) => {
        const error = action.payload as any;
        state.error = {
          code: error.code,
          message: error.message,
          timestamp: error.timestamp,
          recoverable: error.recoverable,
        };
        
        deliverySlice.caseReducers.recordAnalytics(state, {
          type: 'recordAnalytics',
          payload: { type: 'error' },
        });
      })
      
      // Validate PLZ with cache
      .addCase(validatePLZWithCache.fulfilled, (state, action) => {
        const { plz, result, fromCache, responseTime, timestamp } = action.payload;
        
        // Update cache
        state.validationCache[plz] = {
          plz,
          result: result as any, // Cast to handle readonly properties
          cachedAt: timestamp,
          isValid: true,
        };
        
        // Record analytics
        deliverySlice.caseReducers.recordAnalytics(state, {
          type: 'recordAnalytics',
          payload: { 
            type: fromCache ? 'cache_hit' : 'cache_miss', 
            responseTime 
          },
        });
        
        state.lastUpdated = timestamp;
      })
      .addCase(validatePLZWithCache.rejected, (state, action) => {
        const error = action.payload as any;
        state.error = {
          code: error.code,
          message: error.message,
          timestamp: error.timestamp,
          recoverable: error.recoverable,
        };
        
        deliverySlice.caseReducers.recordAnalytics(state, {
          type: 'recordAnalytics',
          payload: { type: 'error' },
        });
      })
      
      // Calculate delivery with cache
      .addCase(calculateDeliveryWithCache.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(calculateDeliveryWithCache.fulfilled, (state, action) => {
        const { calculation, responseTime, timestamp } = action.payload;
        
        state.currentCalculation = calculation as any; // Cast to handle readonly properties
        state.isLoading = false;
        state.lastUpdated = timestamp;
        
        // Record analytics
        deliverySlice.caseReducers.recordAnalytics(state, {
          type: 'recordAnalytics',
          payload: { type: 'cache_miss', responseTime },
        });
      })
      .addCase(calculateDeliveryWithCache.rejected, (state, action) => {
        state.isLoading = false;
        const error = action.payload as any;
        state.error = {
          code: error.code,
          message: error.message,
          timestamp: error.timestamp,
          recoverable: error.recoverable,
        };
        
        deliverySlice.caseReducers.recordAnalytics(state, {
          type: 'recordAnalytics',
          payload: { type: 'error' },
        });
      }),
});

// ===============================
// EXPORTS
// ===============================

export const {
  clearTariffCache,
  clearValidationCache,
  clearZoneInfoCache,
  clearAllCaches,
  updateCacheSettings,
  setActiveTariff,
  setCurrentCalculation,
  clearError,
  updateSystemHealth,
  recordAnalytics,
} = deliverySlice.actions;

// Selectors
export const selectDelivery = (state: any) => state.delivery;
export const selectAllTariffs = (state: any) => state.delivery.allTariffs;
export const selectActiveTariff = (state: any) => state.delivery.activeTariff;
export const selectCurrentCalculation = (state: any) => state.delivery.currentCalculation;
export const selectDeliveryError = (state: any) => state.delivery.error;
export const selectIsDeliveryLoading = (state: any) => state.delivery.isLoading;

// Cache selectors
export const selectTariffCache = (state: any) => state.delivery.tariffCache;
export const selectValidationCache = (state: any) => state.delivery.validationCache;
export const selectZoneInfoCache = (state: any) => state.delivery.zoneInfoCache;

// Analytics selectors
export const selectDeliveryAnalytics = (state: any) => state.delivery.analytics;
export const selectSystemHealth = (state: any) => state.delivery.systemStatus;

// Helper selectors
export const selectTariffByPLZ = (plz: string) => (state: any) => 
  state.delivery.tariffCache[plz]?.tariff || null;

export const selectValidationByPLZ = (plz: string) => (state: any) => 
  state.delivery.validationCache[plz]?.result || null;

export const selectCacheEfficiency = (state: any) => {
  const { cacheHits, totalLookups } = state.delivery.analytics;
  return totalLookups > 0 ? (cacheHits / totalLookups) * 100 : 0;
};

export default deliverySlice.reducer;
