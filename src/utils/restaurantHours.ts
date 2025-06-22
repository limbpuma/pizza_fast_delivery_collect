/**
 * Restaurant Hours Management System
 * Restaurant CAMPUS - Daily 11:00 - 21:30 (including weekends and holidays)
 */

export interface RestaurantStatus {
  isOpen: boolean;
  timeUntilClosing: number; // minutes
  timeUntilOpening: number; // minutes 
  closingTime: string;
  openingTime: string;
  status: 'open' | 'closed' | 'closing_soon';
}

export interface TimeUntilClose {
  hours: number;
  minutes: number;
  totalMinutes: number;
}

// Restaurant hours configuration
const RESTAURANT_HOURS = {
  opening: { hour: 11, minute: 0 }, // 11:00
  closing: { hour: 21, minute: 30 }, // 21:30
  closingSoonThreshold: 60, // minutes - show "closing soon" warning
};

/**
 * Get the current restaurant status
 */
export function getRestaurantStatus(): RestaurantStatus {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTimeInMinutes = currentHour * 60 + currentMinute;
  
  const openingTimeInMinutes = RESTAURANT_HOURS.opening.hour * 60 + RESTAURANT_HOURS.opening.minute;
  const closingTimeInMinutes = RESTAURANT_HOURS.closing.hour * 60 + RESTAURANT_HOURS.closing.minute;
  
  const isOpen = currentTimeInMinutes >= openingTimeInMinutes && currentTimeInMinutes < closingTimeInMinutes;
  
  let timeUntilClosing = 0;
  let timeUntilOpening = 0;
  let status: 'open' | 'closed' | 'closing_soon' = 'closed';
  
  if (isOpen) {
    timeUntilClosing = closingTimeInMinutes - currentTimeInMinutes;
    status = timeUntilClosing <= RESTAURANT_HOURS.closingSoonThreshold ? 'closing_soon' : 'open';
  } else {
    // Calculate time until next opening
    if (currentTimeInMinutes < openingTimeInMinutes) {
      // Before opening today
      timeUntilOpening = openingTimeInMinutes - currentTimeInMinutes;
    } else {
      // After closing, next opening is tomorrow
      timeUntilOpening = (24 * 60) - currentTimeInMinutes + openingTimeInMinutes;
    }
  }
  
  return {
    isOpen,
    timeUntilClosing,
    timeUntilOpening,
    closingTime: formatTime(RESTAURANT_HOURS.closing.hour, RESTAURANT_HOURS.closing.minute),
    openingTime: formatTime(RESTAURANT_HOURS.opening.hour, RESTAURANT_HOURS.opening.minute),
    status
  };
}

/**
 * Convert minutes to hours and minutes
 */
export function minutesToHoursMinutes(totalMinutes: number): TimeUntilClose {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  
  return {
    hours,
    minutes,
    totalMinutes
  };
}

/**
 * Format time as HH:MM
 */
function formatTime(hour: number, minute: number): string {
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
}

/**
 * Get time-based context for dynamic messages
 */
function getTimeContext(): 'lunch' | 'afternoon' | 'dinner' | 'late' {
  const hour = new Date().getHours();
  
  if (hour >= 11 && hour < 14) return 'lunch';
  if (hour >= 14 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 20) return 'dinner';
  return 'late';
}

/**
 * Get a random urgency message based on time context
 */
export function getRandomUrgencyMessage(): string {
  const context = getTimeContext();
  const orderCount = Math.floor(Math.random() * 8) + 3; // 3-10 people
  const viewingCount = Math.floor(Math.random() * 12) + 5; // 5-16 people
  const recentOrders = Math.floor(Math.random() * 6) + 2; // 2-7 orders
  
  const contextMessages = {
    lunch: [
      `🔥 ${orderCount} people ordering lunch right now • Order now for guaranteed delivery`,
      `⚡ ${recentOrders} lunch orders placed in the last 10 minutes • Don't wait!`,
      `🍕 Lunch rush! ${viewingCount} people viewing the menu • Order before it's too late`,
      `🥗 Fresh lunch specials available • ${orderCount} people already ordered`,
      `⏰ Limited lunch delivery slots • ${recentOrders} orders just placed`
    ],
    afternoon: [
      `🍕 ${orderCount} people ordering right now • Perfect afternoon treat`,
      `⚡ ${recentOrders} orders in the last 15 minutes • Join the afternoon rush`,
      `🔥 Popular afternoon snacks selling fast • ${viewingCount} people browsing`,
      `🚀 Quick afternoon delivery • ${orderCount} people already ordering`,
      `⏰ Beat the dinner rush • ${recentOrders} smart orders just placed`
    ],
    dinner: [
      `🔥 ${orderCount} families ordering dinner • Order now for guaranteed delivery`,
      `⚡ Dinner rush! ${recentOrders} orders in the last 10 minutes`,
      `🍕 ${viewingCount} people planning dinner • Secure your order now`,
      `🏃‍♂️ High dinner demand • ${orderCount} orders being prepared`,
      `🔥 Peak dinner time • Fast delivery guaranteed for ${recentOrders} recent orders`
    ],
    late: [
      `🌙 ${orderCount} people ordering late dinner • Quick delivery available`,
      `⚡ ${recentOrders} late orders just placed • Kitchen closing soon`,
      `🍕 Last chance! ${viewingCount} people viewing menu • Order before closing`,
      `🔥 Late night special • ${orderCount} smart people already ordered`,
      `⏰ Kitchen closes soon • ${recentOrders} final orders being prepared`
    ]
  };
  
  const messages = contextMessages[context];
  return messages[Math.floor(Math.random() * messages.length)];
}

/**
 * Check if we should show urgency message (dynamic chance based on time and status)
 */
export function shouldShowUrgencyMessage(status: RestaurantStatus): boolean {
  const context = getTimeContext();
  const isWeekend = [0, 6].includes(new Date().getDay()); // Sunday = 0, Saturday = 6
  
  // Higher chance during peak hours and weekends
  let baseChance = 0.6; // 60% base chance
  
  if (context === 'lunch' || context === 'dinner') baseChance += 0.15; // +15% during peak
  if (isWeekend) baseChance += 0.1; // +10% on weekends
  if (status.status === 'closing_soon') baseChance += 0.2; // +20% when closing soon
  
  return Math.random() < Math.min(baseChance, 0.9); // Max 90% chance
}

/**
 * Get special weekend or holiday messages
 */
export function getSpecialMessage(): string | null {
  const now = new Date();
  const isWeekend = [0, 6].includes(now.getDay());
  const hour = now.getHours();
  
  if (isWeekend && hour >= 17) {
    const weekendMessages = [
      "🎉 Weekend Special: Free extra cheese on family pizzas",
      "🍕 Weekend Vibes: Perfect time for pizza with friends",
      "🔥 Weekend Deal: Order 2 pizzas, get free delivery",
      "🎊 Weekend Special: Family pack deals available"
    ];
    return weekendMessages[Math.floor(Math.random() * weekendMessages.length)];
  }
  
  // Lunch specials during weekdays
  if (!isWeekend && hour >= 11 && hour < 15) {
    const lunchSpecials = [
      "🥗 Lunch Special: Quick 20-minute delivery guarantee",
      "⚡ Business Lunch: Express delivery for office orders",
      "🍕 Midday Deal: Perfect lunch break pizza"
    ];
    
    if (Math.random() < 0.3) { // 30% chance for lunch specials
      return lunchSpecials[Math.floor(Math.random() * lunchSpecials.length)];
    }
  }
  
  return null;
}
