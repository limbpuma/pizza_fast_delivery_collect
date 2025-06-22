/**
 * Dynamic Social Proof System for Campus Pizza
 * Generates realistic and engaging social proof data
 */

export interface SocialProofData {
  orderingCount: number;
  viewingCount: number;
  rating: string;
  reviewCount: number;
  recentOrderTime: string;
  urgencyMessage?: {
    key: string;
    count?: number;
  };
}

export interface DynamicFeature {
  icon: string;
  textKey: string;
  priority: number;
  color: string;
}

// Base configuration for realistic ranges
const SOCIAL_PROOF_CONFIG = {
  ordering: {
    base: 8,
    range: 7, // 8-15 people ordering
    peakHourBonus: 5, // +5 during peak hours
    weekendBonus: 3, // +3 on weekends
  },
  viewing: {
    base: 15,
    range: 20, // 15-35 people viewing
    peakHourBonus: 10,
    weekendBonus: 5,
  },
  rating: {
    base: 4.7,
    variance: 0.2, // 4.7-4.9
  },
  reviews: {
    base: 340,
    dailyGrowth: 2, // ~2 reviews per day
  },
};

// Peak hours configuration
const PEAK_HOURS = [
  { start: 11, end: 14 }, // Lunch
  { start: 17, end: 21 }, // Dinner
];

// Dynamic features that rotate with translation keys
const DYNAMIC_FEATURES = [
  { icon: "⚡", textKey: "dynamicFeatures.fastDelivery", priority: 1, color: "text-yellow-500" },
  { icon: "🔥", textKey: "dynamicFeatures.freshQuality", priority: 2, color: "text-orange-500" },
  { icon: "✅", textKey: "dynamicFeatures.guaranteed", priority: 3, color: "text-green-500" },
  { icon: "🚚", textKey: "dynamicFeatures.freeDelivery", priority: 4, color: "text-blue-500" },
  { icon: "👨‍🍳", textKey: "dynamicFeatures.masterChef", priority: 5, color: "text-purple-500" },
  { icon: "📱", textKey: "dynamicFeatures.easyOrder", priority: 6, color: "text-indigo-500" },
  { icon: "🏆", textKey: "dynamicFeatures.bestPizza", priority: 7, color: "text-amber-500" },
  { icon: "💯", textKey: "dynamicFeatures.satisfaction", priority: 8, color: "text-emerald-500" },
];

// Urgency messages with translation keys
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const URGENCY_MESSAGES = [
  { key: "socialProof.urgencyMessages.recentOrders", countRange: [2, 5] as [number, number] },
  { key: "socialProof.urgencyMessages.highDemand", countRange: null },
  { key: "socialProof.urgencyMessages.popularTime", countRange: null },
  { key: "socialProof.urgencyMessages.viewers", countRange: [3, 8] as [number, number] },
];

/**
 * Check if current time is during peak hours
 */
function isPeakHour(): boolean {
  const now = new Date();
  const currentHour = now.getHours();
  
  return PEAK_HOURS.some(peak => 
    currentHour >= peak.start && currentHour < peak.end
  );
}

/**
 * Check if current day is weekend
 */
function isWeekend(): boolean {
  const now = new Date();
  const day = now.getDay();
  return day === 0 || day === 6; // Sunday or Saturday
}

/**
 * Generate realistic random number within range
 */
function getRandomInRange(base: number, range: number): number {
  return base + Math.floor(Math.random() * range);
}

/**
 * Get dynamic social proof data
 */
export function getSocialProofData(): SocialProofData {
  const peakBonus = isPeakHour();
  const weekendBonus = isWeekend();
  
  // Calculate ordering count
  let orderingCount = getRandomInRange(
    SOCIAL_PROOF_CONFIG.ordering.base,
    SOCIAL_PROOF_CONFIG.ordering.range
  );
  
  if (peakBonus) orderingCount += SOCIAL_PROOF_CONFIG.ordering.peakHourBonus;
  if (weekendBonus) orderingCount += SOCIAL_PROOF_CONFIG.ordering.weekendBonus;
  
  // Calculate viewing count
  let viewingCount = getRandomInRange(
    SOCIAL_PROOF_CONFIG.viewing.base,
    SOCIAL_PROOF_CONFIG.viewing.range
  );
  
  if (peakBonus) viewingCount += SOCIAL_PROOF_CONFIG.viewing.peakHourBonus;
  if (weekendBonus) viewingCount += SOCIAL_PROOF_CONFIG.viewing.weekendBonus;
  
  // Generate dynamic rating (4.7-4.9)
  const ratingBase = SOCIAL_PROOF_CONFIG.rating.base;
  const ratingVariance = SOCIAL_PROOF_CONFIG.rating.variance;
  const rating = (ratingBase + Math.random() * ratingVariance).toFixed(1);
  
  // Calculate review count with growth simulation
  const daysSinceStart = Math.floor((Date.now() - new Date('2024-01-01').getTime()) / (1000 * 60 * 60 * 24));
  const reviewCount = SOCIAL_PROOF_CONFIG.reviews.base + (daysSinceStart * SOCIAL_PROOF_CONFIG.reviews.dailyGrowth);
  
  // Generate recent order time
  const recentMinutes = Math.floor(Math.random() * 15) + 1; // 1-15 minutes ago
  const recentOrderTime = `vor ${recentMinutes} Min`;
  // Generate urgency message (30% chance)
  let urgencyMessage: { key: string; count?: number } | undefined;
  if (Math.random() < 0.3) {
    const messageTemplate = URGENCY_MESSAGES[Math.floor(Math.random() * URGENCY_MESSAGES.length)];
    if (messageTemplate.countRange) {
      const count = Math.floor(Math.random() * (messageTemplate.countRange[1] - messageTemplate.countRange[0] + 1)) + messageTemplate.countRange[0];
      urgencyMessage = { key: messageTemplate.key, count };
    } else {
      urgencyMessage = { key: messageTemplate.key };
    }
  }
  
  return {
    orderingCount,
    viewingCount,
    rating,
    reviewCount: Math.round(reviewCount),
    recentOrderTime,
    urgencyMessage,
  };
}

/**
 * Get dynamic features for rotation
 * Returns 3 features based on time and randomization
 */
export function getDynamicFeatures(): DynamicFeature[] {
  // Always include top priority features during peak hours
  let features = [...DYNAMIC_FEATURES];
  
  if (isPeakHour()) {
    // During peak hours, prioritize delivery speed and quality
    features = features.sort((a, b) => a.priority - b.priority);
  } else {
    // During off-peak, randomize more
    features = features.sort(() => Math.random() - 0.5);
  }
  
  // Return top 3 features
  return features.slice(0, 3);
}

/**
 * Get time-contextual trust badge text
 */
export function getContextualTrustMessage(): {
  customers: string;
  timeContextKey: string;
  specialOfferKey?: string;
} {
  const now = new Date();
  const hour = now.getHours();
  const isWeekendDay = isWeekend();
  
  let timeContextKey = "socialProof.timeContext.anytime";
  let specialOfferKey: string | undefined;
  
  // Time-based contextual messages
  if (hour >= 11 && hour < 14) {
    timeContextKey = "socialProof.timeContext.lunchBreak";
    if (!isWeekendDay) {
      specialOfferKey = "socialProof.specialOffers.businessLunch";
    }
  } else if (hour >= 17 && hour < 21) {
    timeContextKey = "socialProof.timeContext.dinnerTime";
    if (isWeekendDay) {
      specialOfferKey = "socialProof.specialOffers.weekendSpecial";
    }
  } else if (hour >= 21) {
    timeContextKey = "socialProof.timeContext.lastChance";
    specialOfferKey = "socialProof.specialOffers.lastCall";
  }
  
  const socialProof = getSocialProofData();
  
  return {
    customers: `${socialProof.reviewCount}+ zufriedene Kunden`,
    timeContextKey,
    specialOfferKey,
  };
}

/**
 * Generate delivery time estimate based on current conditions
 */
export function getDynamicDeliveryTime(): {
  estimatedMinutes: number;
  message: string;
  urgency: 'low' | 'medium' | 'high';
} {
  const peakBonus = isPeakHour();
  const weekendBonus = isWeekend();
  
  let baseTime = 25; // Base 25 minutes
  let urgency: 'low' | 'medium' | 'high' = 'low';
  
  // Add time during busy periods
  if (peakBonus) {
    baseTime += 5;
    urgency = 'medium';
  }
  if (weekendBonus) {
    baseTime += 5;
    urgency = 'high';
  }
  
  // Add some randomness (-5 to +10 minutes)
  const variance = Math.floor(Math.random() * 16) - 5;
  const estimatedMinutes = Math.max(15, Math.min(45, baseTime + variance));
  
  let message = `ca. ${estimatedMinutes} Min`;
  
  if (urgency === 'high') {
    message = `${estimatedMinutes}-${estimatedMinutes + 10} Min (erhöhtes Aufkommen)`;
  } else if (urgency === 'medium') {
    message = `${estimatedMinutes}-${estimatedMinutes + 5} Min`;
  }
  
  return {
    estimatedMinutes,
    message,
    urgency,
  };
}
