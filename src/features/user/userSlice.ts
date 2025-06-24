import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAddress } from "../../services/apiGeocoding";
import type { DeliverySession, DeliveryError } from "../../types/delivery";
import { validatePLZ } from "../../utils/deliveryZones";
import { getTariffByPLZ } from "../../utils/deliveryTariffs";

function getPosition() {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

export const fetchAddress = createAsyncThunk(
  "user/fetchAddress",
  async function () {
    const positionObj = await getPosition();
    const position = {
      latitude: (positionObj as GeolocationPosition).coords.latitude,
      longitude: (positionObj as GeolocationPosition).coords.longitude,
    };
    const addressObj = await getAddress(position);
    const address = `${addressObj?.locality}, ${addressObj?.city} ${addressObj?.postcode}, ${addressObj?.countryName}`;

    // 3) Then we return an object with the data that we are interested in
    return { position, address };
  }
);

// New async thunk for validating and updating PLZ with delivery session
export const updatePLZWithSession = createAsyncThunk(
  "user/updatePLZWithSession",
  async function (
    { plz, source }: { plz: string; source: "user_input" | "geolocation" | "checkout" },
    { rejectWithValue }
  ) {
    try {
      // Validate PLZ
      const validationResult = validatePLZ(plz);      if (!validationResult.isValid) {
        return rejectWithValue({
          code: "INVALID_FORMAT" as const,
          message: validationResult.error || "Invalid postal code",
          timestamp: new Date(),
          recoverable: true,
        });
      }

      // Get tariff information
      const tariff = getTariffByPLZ(plz);
      
      if (!tariff) {
        return rejectWithValue({
          code: "NOT_IN_DELIVERY_AREA" as const,
          message: "Delivery not available for this postal code",
          timestamp: new Date(),
          recoverable: true,
        });
      }

      return {
        plz,
        validationResult,
        tariff,
        source,
        timestamp: Date.now(),
      };
    } catch (error) {
      return rejectWithValue({
        code: "SYSTEM_ERROR" as const,
        message: "Failed to validate postal code",
        timestamp: new Date(),
        recoverable: true,
      });
    }
  }
);

// Simple session lock interface
interface SessionLock {
  isLocked: boolean;
  lockedAt: Date;
  lockedBy: string;
  reason: string;
  canOverride: boolean;
}

interface UserState {
  // Existing fields
  username: string;
  postalCode: string;
  status: "idle" | "loading" | "error";
  position: object;
  error: string;
  address: string;
  
  // New delivery session fields
  deliverySession: DeliverySession | null;
  sessionLock: SessionLock | null;
  plzHistory: Array<{
    plz: string;
    timestamp: number;
    source: "user_input" | "geolocation" | "checkout";
    tariff?: any;
  }>;
  deliveryError: DeliveryError | null;
  
  // Preferences
  preferences: {
    rememberPLZ: boolean;
    allowGeolocation: boolean;
    preferredDeliveryTime: string | null;
  };
}

const initialState: UserState = {
  // Existing state
  username: "",
  postalCode: "",
  status: "idle",
  position: {},
  error: "",
  address: "",
  
  // New delivery session state
  deliverySession: null,
  sessionLock: null,
  plzHistory: [],
  deliveryError: null,
  
  // Default preferences
  preferences: {
    rememberPLZ: true,
    allowGeolocation: false,
    preferredDeliveryTime: null,
  },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Existing reducers
    updateName(state, action) {
      state.username = action.payload;
    },
    updatePostalCode(state, action) {
      state.postalCode = action.payload;
    },
    
    // New delivery session reducers
    createDeliverySession(state, action) {
      const { plz, tariff, source = "user_input" } = action.payload;
      
      state.deliverySession = {
        plz,
        tariff,
        isLocked: false,
        lockedAt: new Date(),
        deliveryFee: tariff.lieferkosten,
        isFreeDelivery: false,
        deliveryPreference: "not_selected" as const,
        metadata: {
          plzChangeCount: 0,
          plzHistory: [plz],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };
      
      // Add to history
      state.plzHistory.unshift({
        plz,
        timestamp: Date.now(),
        source,
        tariff,
      });
      
      // Keep only last 10 entries
      if (state.plzHistory.length > 10) {
        state.plzHistory = state.plzHistory.slice(0, 10);
      }
      
      // Clear any previous errors
      state.deliveryError = null;
    },
    
    lockDeliverySession(state, action) {
      if (state.deliverySession) {
        const { reason = "checkout_started", lockedBy = "system" } = action.payload || {};
        
        state.sessionLock = {
          isLocked: true,
          lockedAt: new Date(),
          lockedBy,
          reason,
          canOverride: false,
        };
        
        state.deliverySession.isLocked = true;
      }
    },
    
    unlockDeliverySession(state, action) {
      const { force = false } = action.payload || {};
      
      if (state.sessionLock && (force || state.sessionLock.canOverride)) {
        state.sessionLock = null;
        
        if (state.deliverySession) {
          state.deliverySession.isLocked = false;
        }
      }
    },
    
    clearDeliverySession(state) {
      state.deliverySession = null;
      state.sessionLock = null;
      state.deliveryError = null;
    },
    
    updateUserPreferences(state, action) {
      state.preferences = {
        ...state.preferences,
        ...action.payload,
      };
    },
    
    clearDeliveryError(state) {
      state.deliveryError = null;
    },
    
    // Session security actions
    validateSessionSecurity(state) {
      if (state.deliverySession) {
        const now = Date.now();
        const sessionAge = now - state.deliverySession.metadata.createdAt.getTime();
        const maxAge = 30 * 60 * 1000; // 30 minutes
        
        if (sessionAge > maxAge) {
          // Session expired
          state.deliveryError = {
            code: "SYSTEM_ERROR" as const,
            message: "Your delivery session has expired. Please select your postal code again.",
            timestamp: new Date(),
            recoverable: true,
          };
          state.deliverySession = null;
          state.sessionLock = null;
        }
      }
    },
  },
  extraReducers: (builder) =>
    builder
      // Existing async thunk handlers
      .addCase(fetchAddress.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAddress.fulfilled, (state, action) => {
        state.position = action.payload.position;
        state.address = action.payload.address;
        state.status = "idle";
      })
      .addCase(fetchAddress.rejected, (state) => {
        state.status = "error";
        state.error =
          "There was a problem getting your address. Make sure to fill this field!";
      })
      
      // New PLZ validation async thunk handlers
      .addCase(updatePLZWithSession.pending, (state) => {
        state.status = "loading";
        state.deliveryError = null;
      })
      .addCase(updatePLZWithSession.fulfilled, (state, action) => {
        const { plz, tariff, source, timestamp } = action.payload;
        
        // Update postal code
        state.postalCode = plz;
        
        // Create delivery session
        state.deliverySession = {
          plz,
          tariff,
          isLocked: false,
          lockedAt: new Date(),
          deliveryFee: tariff.lieferkosten,
          isFreeDelivery: false,
          deliveryPreference: "not_selected" as const,
          metadata: {
            plzChangeCount: 0,
            plzHistory: [plz],
            createdAt: new Date(timestamp),
            updatedAt: new Date(timestamp),
          },
        };
        
        // Add to history
        state.plzHistory.unshift({
          plz,
          timestamp,
          source,
          tariff,
        });
        
        // Keep only last 10 entries
        if (state.plzHistory.length > 10) {
          state.plzHistory = state.plzHistory.slice(0, 10);
        }
        
        state.status = "idle";
        state.deliveryError = null;
      })
      .addCase(updatePLZWithSession.rejected, (state, action) => {
        state.status = "error";
        // Handle readonly properties correctly
        const error = action.payload as any;
        state.deliveryError = {
          code: error.code,
          message: error.message,
          timestamp: error.timestamp,
          recoverable: error.recoverable,
        };
      }),
});

export const { 
  // Existing actions
  updateName, 
  updatePostalCode,
  
  // New delivery session actions
  createDeliverySession,
  lockDeliverySession,
  unlockDeliverySession,
  clearDeliverySession,
  updateUserPreferences,
  clearDeliveryError,
  validateSessionSecurity,
} = userSlice.actions;

// Selectors
export const selectUser = (state: any) => state.user;
export const selectDeliverySession = (state: any) => state.user.deliverySession;
export const selectSessionLock = (state: any) => state.user.sessionLock;
export const selectPLZHistory = (state: any) => state.user.plzHistory;
export const selectDeliveryError = (state: any) => state.user.deliveryError;
export const selectUserPreferences = (state: any) => state.user.preferences;

// Helper selectors
export const selectIsSessionLocked = (state: any) => 
  state.user.sessionLock?.isLocked || false;

export const selectCanChangePLZ = (state: any) => {
  const session = state.user.deliverySession;
  const lock = state.user.sessionLock;
  
  if (!session) return true;
  if (!lock) return true;
  
  return lock.canOverride;
};

export const selectCurrentTariff = (state: any) => 
  state.user.deliverySession?.tariff || null;

export default userSlice.reducer;
