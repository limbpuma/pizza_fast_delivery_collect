/**
 * 📐 DELIVERY SYSTEM TYPESCRIPT INTERFACES
 * 
 * Comprehensive TypeScript interfaces for the delivery tariff system
 * Consolidates all types for tariffs, validation, zones, and calculations
 * 
 * @version 1.0.0
 * @created June 24, 2025
 * @phase Phase 1, Step 1.3 - TypeScript Interfaces
 */

// ===============================
// CORE DELIVERY INTERFACES
// ===============================

/**
 * Core delivery tariff configuration
 * Defines pricing and rules for each delivery zone
 */
export interface DeliveryTariff {
  /** Unique identifier for the tariff zone */
  readonly id: string;
  /** Human-readable name for the delivery zone */
  readonly name: string;
  /** List of postal codes covered by this tariff */
  readonly plz: readonly string[];
  /** Minimum order value required for delivery (in EUR) */
  readonly mindestbestellwert: number;
  /** Base delivery cost for this zone (in EUR) */
  readonly lieferkosten: number;
  /** Order value threshold for free delivery (in EUR) */
  readonly lieferkosten_entfallen_ab: number;
  /** Whether this tariff is currently active */
  readonly isActive: boolean;
  /** Priority for overlapping zones (higher = more specific) */
  readonly priority: number;
}

/**
 * Result of delivery fee calculation
 * Contains all information needed for pricing display and logic
 */
export interface DeliveryCalculation {
  /** The tariff used for calculation */
  readonly tariff: DeliveryTariff;
  /** Final delivery fee amount (in EUR) */
  readonly deliveryFee: number;
  /** Whether delivery is free for this order */
  readonly isFreeDelivery: boolean;
  /** Whether the order meets the minimum value requirement */
  readonly meetsMinimum: boolean;
  /** Amount missing to reach minimum order value (in EUR) */
  readonly missingAmount: number;
  /** Progress toward free delivery threshold (0-100%) */
  readonly progressToFreeDelivery: number;
  /** Additional context for display */
  readonly context: DeliveryCalculationContext;
}

/**
 * Additional context for delivery calculations
 */
export interface DeliveryCalculationContext {
  /** Cart subtotal used in calculation */
  readonly cartSubtotal: number;
  /** Whether the calculation is for preview or final checkout */
  readonly isPreview: boolean;
  /** Timestamp of calculation */
  readonly calculatedAt: Date;
  /** Any applicable discounts or promotions */
  readonly discounts?: DeliveryDiscount[];
}

/**
 * Delivery discount information
 */
export interface DeliveryDiscount {
  /** Unique discount identifier */
  readonly id: string;
  /** Discount name/description */
  readonly name: string;
  /** Discount amount (in EUR) */
  readonly amount: number;
  /** Discount type */
  readonly type: 'fixed' | 'percentage' | 'free_delivery';
  /** Whether the discount is active */
  readonly isActive: boolean;
}

// ===============================
// PLZ VALIDATION INTERFACES
// ===============================

/**
 * Enhanced PLZ validation result with comprehensive information
 */
export interface PLZValidationResult {
  /** Whether the PLZ is valid for delivery */
  readonly isValid: boolean;
  /** Cleaned and normalized postal code */
  readonly plz: string;
  /** Associated delivery tariff (null if invalid) */
  readonly tariff: DeliveryTariff | null;
  /** Human-readable zone name */
  readonly zoneName: string;
  /** Error message if validation failed */
  readonly error?: string;
  /** Warning message for user awareness */
  readonly warning?: string;
  /** Additional validation metadata */
  readonly metadata: PLZValidationMetadata;
}

/**
 * Metadata for PLZ validation process
 */
export interface PLZValidationMetadata {
  /** Original input before cleaning */
  readonly originalInput: string;
  /** Validation timestamp */
  readonly validatedAt: Date;
  /** Validation method used */
  readonly method: 'tariff_lookup' | 'legacy_validation';
  /** Processing time in milliseconds */
  readonly processingTime?: number;
}

/**
 * PLZ validation options
 */
export interface PLZValidationOptions {
  /** Whether to include pickup zones in validation */
  readonly includePickup: boolean;
  /** Whether to perform strict format validation */
  readonly strictFormat: boolean;
  /** Whether to return suggestions for invalid PLZ */
  readonly includeSuggestions: boolean;
  /** Maximum number of suggestions to return */
  readonly maxSuggestions: number;
}

// ===============================
// DELIVERY ZONE INTERFACES
// ===============================

/**
 * Comprehensive delivery zone information for display and logic
 */
export interface DeliveryZoneInfo {
  /** Postal code */
  readonly plz: string;
  /** Human-readable zone name */
  readonly zoneName: string;
  /** Zone category for organization */
  readonly category: DeliveryZoneCategory;
  /** Minimum order value (in EUR) */
  readonly minimumOrder: number;
  /** Base delivery cost (in EUR) */
  readonly deliveryCost: number;
  /** Free delivery threshold (in EUR) */
  readonly freeDeliveryThreshold: number;
  /** Whether this is a pickup zone */
  readonly isPickupZone: boolean;
  /** Zone priority for sorting and selection */
  readonly priority: number;
  /** Additional zone metadata */
  readonly metadata: DeliveryZoneMetadata;
}

/**
 * Delivery zone categories
 */
export type DeliveryZoneCategory = 'free' | 'standard' | 'premium' | 'pickup';

/**
 * Metadata for delivery zones
 */
export interface DeliveryZoneMetadata {
  /** Estimated delivery time in minutes */
  readonly estimatedDeliveryTime?: number;
  /** Geographic coverage description */
  readonly coverage?: string;
  /** Special instructions or notes */
  readonly notes?: string;
  /** Whether zone supports special services */
  readonly specialServices?: DeliverySpecialService[];
}

/**
 * Special delivery services
 */
export interface DeliverySpecialService {
  /** Service identifier */
  readonly id: string;
  /** Service name */
  readonly name: string;
  /** Additional cost for service (in EUR) */
  readonly additionalCost: number;
  /** Whether service is available */
  readonly isAvailable: boolean;
}

/**
 * Grouped delivery zones by category
 */
export interface DeliveryZonesByCategory {
  /** Zones with free delivery */
  readonly free: readonly DeliveryZoneInfo[];
  /** Standard delivery zones */
  readonly standard: readonly DeliveryZoneInfo[];
  /** Premium delivery zones */
  readonly premium: readonly DeliveryZoneInfo[];
  /** Pickup zones */
  readonly pickup: readonly DeliveryZoneInfo[];
}

// ===============================
// DELIVERY SESSION INTERFACES
// ===============================

/**
 * Delivery session state for user experience
 * Tracks PLZ selection and delivery preferences throughout the session
 */
export interface DeliverySession {
  /** Selected postal code */
  readonly plz: string;
  /** Associated delivery tariff */
  readonly tariff: DeliveryTariff;
  /** Whether the session is locked (prevents PLZ changes) */
  readonly isLocked: boolean;
  /** Timestamp when session was locked */
  readonly lockedAt: Date;
  /** Current delivery fee for the session */
  readonly deliveryFee: number;
  /** Whether current order qualifies for free delivery */
  readonly isFreeDelivery: boolean;
  /** Delivery preference (delivery vs pickup) */
  readonly deliveryPreference: DeliveryPreference;
  /** Session metadata */
  readonly metadata: DeliverySessionMetadata;
}

/**
 * Delivery preference options
 */
export type DeliveryPreference = 'delivery' | 'pickup' | 'not_selected';

/**
 * Metadata for delivery sessions
 */
export interface DeliverySessionMetadata {
  /** Number of PLZ changes in this session */
  readonly plzChangeCount: number;
  /** History of PLZ selections */
  readonly plzHistory: readonly string[];
  /** Session creation timestamp */
  readonly createdAt: Date;
  /** Last update timestamp */
  readonly updatedAt: Date;
  /** User agent information */
  readonly userAgent?: string;
  /** Geographic location (if available) */
  readonly location?: GeographicLocation;
}

/**
 * Geographic location information
 */
export interface GeographicLocation {
  /** Latitude coordinate */
  readonly latitude: number;
  /** Longitude coordinate */
  readonly longitude: number;
  /** Location accuracy in meters */
  readonly accuracy?: number;
  /** Address information */
  readonly address?: AddressInfo;
}

/**
 * Address information
 */
export interface AddressInfo {
  /** Street address */
  readonly street?: string;
  /** City name */
  readonly city?: string;
  /** State/region */
  readonly state?: string;
  /** Country code */
  readonly country?: string;
  /** Full formatted address */
  readonly formatted?: string;
}

// ===============================
// PLZ CHANGE REQUEST INTERFACES
// ===============================

/**
 * Request to change PLZ during an active session
 */
export interface PLZChangeRequest {
  /** New postal code to switch to */
  readonly newPLZ: string;
  /** Reason for the change */
  readonly reason: PLZChangeReason;
  /** Whether user has confirmed any warnings */
  readonly confirmedWarnings: boolean;
  /** Current cart total for impact calculation */
  readonly currentCartTotal: number;
  /** Timestamp of the request */
  readonly requestedAt: Date;
  /** Additional context */
  readonly context?: PLZChangeContext;
}

/**
 * Reasons for PLZ change
 */
export type PLZChangeReason = 
  | 'user_initiated'      // User manually changed PLZ
  | 'error_correction'    // Correcting a mistake
  | 'address_change'      // Delivery address changed
  | 'system_suggestion'   // System suggested a change
  | 'location_detection'; // Auto-detected location

/**
 * Context for PLZ change requests
 */
export interface PLZChangeContext {
  /** Previous PLZ before change */
  readonly previousPLZ: string;
  /** Whether change affects current cart pricing */
  readonly affectsPricing: boolean;
  /** Whether change affects delivery availability */
  readonly affectsAvailability: boolean;
  /** User confirmation messages */
  readonly confirmationMessages?: readonly string[];
}

/**
 * Result of PLZ change request processing
 */
export interface PLZChangeResult {
  /** Whether the change was successful */
  readonly success: boolean;
  /** Updated delivery session (if successful) */
  readonly updatedSession?: DeliverySession;
  /** Comparison between old and new tariffs */
  readonly tariffComparison?: TariffComparison;
  /** Any errors that occurred */
  readonly errors?: readonly string[];
  /** Warnings for user awareness */
  readonly warnings?: readonly string[];
}

/**
 * Comparison between two delivery tariffs
 */
export interface TariffComparison {
  /** Previous tariff */
  readonly previous: DeliveryTariff;
  /** New tariff */
  readonly new: DeliveryTariff;
  /** Changes in pricing */
  readonly changes: TariffChanges;
  /** Impact on current order */
  readonly orderImpact: OrderImpact;
}

/**
 * Changes between tariffs
 */
export interface TariffChanges {
  /** Change in delivery cost (positive = increase) */
  readonly deliveryCostChange: number;
  /** Change in minimum order (positive = increase) */
  readonly minimumOrderChange: number;
  /** Change in free delivery threshold (positive = increase) */
  readonly freeDeliveryThresholdChange: number;
  /** Whether zone category changed */
  readonly categoryChanged: boolean;
}

/**
 * Impact on current order from tariff change
 */
export interface OrderImpact {
  /** New delivery fee for current order */
  readonly newDeliveryFee: number;
  /** Change in total order cost */
  readonly totalCostChange: number;
  /** Whether order still meets minimum */
  readonly stillMeetsMinimum: boolean;
  /** Whether free delivery status changed */
  readonly freeDeliveryStatusChanged: boolean;
  /** New progress toward free delivery */
  readonly newFreeDeliveryProgress: number;
}

// ===============================
// STATISTICS & ANALYTICS INTERFACES
// ===============================

/**
 * Comprehensive delivery zone statistics
 */
export interface DeliveryZoneStats {
  /** Total number of delivery zones */
  readonly totalZones: number;
  /** Number of free delivery zones */
  readonly freeZones: number;
  /** Number of standard delivery zones */
  readonly standardZones: number;
  /** Number of premium delivery zones */
  readonly premiumZones: number;
  /** Average delivery cost across all zones */
  readonly averageDeliveryCost: number;
  /** Average minimum order across all zones */
  readonly averageMinimumOrder: number;
  /** Price range information */
  readonly priceRange: PriceRange;
  /** Coverage statistics */
  readonly coverage: CoverageStats;
}

/**
 * Price range information
 */
export interface PriceRange {
  /** Minimum delivery cost */
  readonly min: number;
  /** Maximum delivery cost */
  readonly max: number;
  /** Most common delivery cost */
  readonly mode: number;
  /** Median delivery cost */
  readonly median: number;
}

/**
 * Coverage statistics
 */
export interface CoverageStats {
  /** Total number of postal codes covered */
  readonly totalPLZCovered: number;
  /** Geographic coverage area (if available) */
  readonly coverageArea?: number;
  /** Population coverage estimate */
  readonly populationCoverage?: number;
}

// ===============================
// ERROR & VALIDATION INTERFACES
// ===============================

/**
 * Delivery validation error types
 */
export type DeliveryValidationError = 
  | 'INVALID_FORMAT'      // PLZ format is invalid
  | 'NOT_IN_DELIVERY_AREA' // PLZ not covered
  | 'SESSION_LOCKED'      // Session prevents changes
  | 'SECURITY_VIOLATION'  // Security check failed
  | 'MINIMUM_NOT_MET'     // Order below minimum
  | 'SYSTEM_ERROR'        // Internal system error
  | 'NETWORK_ERROR';      // Network connectivity issue

/**
 * Delivery system error with context
 */
export interface DeliveryError {
  /** Error code for programmatic handling */
  readonly code: DeliveryValidationError;
  /** Human-readable error message */
  readonly message: string;
  /** Additional error context */
  readonly context?: DeliveryErrorContext;
  /** Timestamp when error occurred */
  readonly timestamp: Date;
  /** Whether error is recoverable */
  readonly recoverable: boolean;
}

/**
 * Context for delivery errors
 */
export interface DeliveryErrorContext {
  /** PLZ that caused the error */
  readonly plz?: string;
  /** Function/operation where error occurred */
  readonly operation?: string;
  /** Additional data for debugging */
  readonly debugInfo?: Record<string, any>;
  /** Suggested recovery actions */
  readonly recoveryActions?: readonly string[];
}

// ===============================
// SEARCH & SUGGESTION INTERFACES
// ===============================

/**
 * PLZ search and suggestion options
 */
export interface PLZSearchOptions {
  /** Search query (partial PLZ or zone name) */
  readonly query: string;
  /** Maximum number of results */
  readonly maxResults: number;
  /** Whether to include pickup zones */
  readonly includePickup: boolean;
  /** Search algorithm preference */
  readonly algorithm: 'fuzzy' | 'exact' | 'prefix';
}

/**
 * PLZ search result
 */
export interface PLZSearchResult {
  /** Matching delivery zones */
  readonly matches: readonly DeliveryZoneInfo[];
  /** Suggested alternatives */
  readonly suggestions: readonly DeliveryZoneInfo[];
  /** Search metadata */
  readonly metadata: SearchMetadata;
}

/**
 * Search operation metadata
 */
export interface SearchMetadata {
  /** Original search query */
  readonly query: string;
  /** Number of results found */
  readonly resultCount: number;
  /** Search execution time */
  readonly executionTime: number;
  /** Search algorithm used */
  readonly algorithm: string;
}

// ===============================
// DISPLAY & UI INTERFACES
// ===============================

/**
 * Formatted delivery information for UI display
 */
export interface DeliveryDisplayInfo {
  /** Zone display name */
  readonly zoneName: string;
  /** Formatted delivery fee (e.g., "1.50" or "FREE") */
  readonly deliveryFee: string;
  /** Formatted free delivery threshold */
  readonly freeDeliveryThreshold: string;
  /** Formatted minimum order amount */
  readonly minimumOrder: string;
  /** Whether delivery is free */
  readonly isFreeDelivery: boolean;
  /** Whether order meets minimum requirement */
  readonly meetsMinimum: boolean;
  /** Formatted missing amount for minimum */
  readonly missingForMinimum: string;
  /** Progress percentage toward free delivery */
  readonly progressToFree: number;
  /** Additional display metadata */
  readonly displayMetadata: DisplayMetadata;
}

/**
 * Metadata for display information
 */
export interface DisplayMetadata {
  /** Currency symbol to use */
  readonly currency: string;
  /** Locale for formatting */
  readonly locale: string;
  /** Formatting precision */
  readonly precision: number;
  /** Whether to show detailed breakdown */
  readonly showBreakdown: boolean;
}

// ===============================
// CONFIGURATION INTERFACES
// ===============================

/**
 * Delivery system configuration
 */
export interface DeliverySystemConfig {
  /** Default validation options */
  readonly defaultValidationOptions: PLZValidationOptions;
  /** Session configuration */
  readonly sessionConfig: SessionConfig;
  /** Display configuration */
  readonly displayConfig: DisplayConfig;
  /** Performance configuration */
  readonly performanceConfig: PerformanceConfig;
}

/**
 * Session management configuration
 */
export interface SessionConfig {
  /** Session timeout in milliseconds */
  readonly sessionTimeout: number;
  /** Maximum PLZ changes per session */
  readonly maxPLZChanges: number;
  /** Whether to enable session locking */
  readonly enableSessionLocking: boolean;
  /** Whether to track PLZ history */
  readonly trackPLZHistory: boolean;
}

/**
 * Display configuration
 */
export interface DisplayConfig {
  /** Default currency */
  readonly defaultCurrency: string;
  /** Default locale */
  readonly defaultLocale: string;
  /** Number formatting precision */
  readonly precision: number;
  /** Whether to show zone categories */
  readonly showCategories: boolean;
}

/**
 * Performance configuration
 */
export interface PerformanceConfig {
  /** Cache TTL in milliseconds */
  readonly cacheTTL: number;
  /** Maximum search results */
  readonly maxSearchResults: number;
  /** Performance monitoring enabled */
  readonly performanceMonitoring: boolean;
}

// ===============================
// UTILITY TYPE DEFINITIONS
// ===============================

/**
 * Utility type for partial delivery calculations
 */
export type PartialDeliveryCalculation = Partial<DeliveryCalculation>;

/**
 * Utility type for required delivery info
 */
export type RequiredDeliveryInfo = Required<Pick<DeliveryZoneInfo, 'plz' | 'zoneName' | 'deliveryCost'>>;

/**
 * Utility type for PLZ validation without metadata
 */
export type SimplePLZValidation = Omit<PLZValidationResult, 'metadata'>;

/**
 * Utility type for delivery session state updates
 */
export type DeliverySessionUpdate = Partial<Pick<DeliverySession, 'deliveryFee' | 'isFreeDelivery' | 'deliveryPreference'>>;

// ===============================
// EXPORT COLLECTIONS
// ===============================

/**
 * All core delivery interfaces
 */
export type CoreDeliveryInterfaces = {
  DeliveryTariff: DeliveryTariff;
  DeliveryCalculation: DeliveryCalculation;
  PLZValidationResult: PLZValidationResult;
  DeliveryZoneInfo: DeliveryZoneInfo;
  DeliverySession: DeliverySession;
};

/**
 * All validation-related interfaces
 */
export type ValidationInterfaces = {
  PLZValidationResult: PLZValidationResult;
  PLZValidationOptions: PLZValidationOptions;
  PLZValidationMetadata: PLZValidationMetadata;
  DeliveryError: DeliveryError;
};

/**
 * All display-related interfaces
 */
export type DisplayInterfaces = {
  DeliveryDisplayInfo: DeliveryDisplayInfo;
  DisplayMetadata: DisplayMetadata;
  DeliveryZonesByCategory: DeliveryZonesByCategory;
};

// ===============================
// DEFAULT CONFIGURATIONS
// ===============================

/**
 * Default PLZ validation options
 */
export const DEFAULT_PLZ_VALIDATION_OPTIONS: PLZValidationOptions = {
  includePickup: false,
  strictFormat: true,
  includeSuggestions: true,
  maxSuggestions: 3
} as const;

/**
 * Default delivery system configuration
 */
export const DEFAULT_DELIVERY_SYSTEM_CONFIG: DeliverySystemConfig = {
  defaultValidationOptions: DEFAULT_PLZ_VALIDATION_OPTIONS,
  sessionConfig: {
    sessionTimeout: 30 * 60 * 1000, // 30 minutes
    maxPLZChanges: 5,
    enableSessionLocking: true,
    trackPLZHistory: true
  },
  displayConfig: {
    defaultCurrency: 'EUR',
    defaultLocale: 'de-DE',
    precision: 2,
    showCategories: true
  },
  performanceConfig: {
    cacheTTL: 5 * 60 * 1000, // 5 minutes
    maxSearchResults: 20,
    performanceMonitoring: true
  }
} as const;
