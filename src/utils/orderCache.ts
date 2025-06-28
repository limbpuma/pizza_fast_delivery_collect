// Utilities for managing order cache in localStorage

export interface SavedOrder {
  orderNumber: string;
  timestamp: string;
  customer: string;
  phone: string;
  deliveryMode: 'delivery' | 'collection';
  address?: {
    street: string;
    houseNumber: string;
    postalCode: string;
    city: string;
  };
  paymentMethod: 'cash' | 'card';
  specialInstructions?: string;
  cart: any[]; // CartItem array
  pricing: {
    subtotal: number;
    deliveryFee: number;
    serviceFee: number;
    total: number;
  };
  status?: 'pending' | 'confirmed' | 'preparing' | 'delivered' | 'completed';
}

const ORDERS_STORAGE_KEY = 'campusPizzaOrders';
const MAX_ORDERS = 50;
const DAYS_TO_KEEP = 30;

/**
 * Get all recent orders from localStorage
 */
export const getRecentOrders = (): SavedOrder[] => {
  try {
    const ordersJson = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (!ordersJson) return [];
    
    // Additional safety check for empty or whitespace-only strings
    if (!ordersJson.trim()) {
      console.warn('Empty orders data found, clearing localStorage entry');
      localStorage.removeItem(ORDERS_STORAGE_KEY);
      return [];
    }
    
    let orders: SavedOrder[];
    
    try {
      orders = JSON.parse(ordersJson);
    } catch (parseError) {
      console.error('Corrupted orders data found, clearing localStorage:', parseError);
      localStorage.removeItem(ORDERS_STORAGE_KEY);
      return [];
    }
    
    // Ensure orders is an array
    if (!Array.isArray(orders)) {
      console.error('Orders data is not an array, clearing localStorage');
      localStorage.removeItem(ORDERS_STORAGE_KEY);
      return [];
    }
    
    // Sort by timestamp (most recent first)
    return orders
      .filter(order => {
        // More robust validation
        if (!order || typeof order !== 'object') return false;
        if (!order.orderNumber || !order.timestamp) return false;
        
        // Validate timestamp format
        const timestamp = new Date(order.timestamp);
        if (isNaN(timestamp.getTime())) return false;
        
        return true;
      })
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, MAX_ORDERS);
  } catch (error) {
    console.error('Critical error in getRecentOrders, clearing localStorage:', error);
    // Clear potentially corrupted data
    try {
      localStorage.removeItem(ORDERS_STORAGE_KEY);
    } catch (clearError) {
      console.error('Unable to clear localStorage:', clearError);
    }
    return [];
  }
};

/**
 * Get a specific order by order number
 */
export const getOrderById = (orderNumber: string): SavedOrder | null => {
  const orders = getRecentOrders();
  return orders.find(order => order.orderNumber === orderNumber) || null;
};

/**
 * Save a new order to localStorage
 */
export const saveOrder = (order: SavedOrder): void => {
  try {
    const existingOrders = getRecentOrders();
    
    // Check if order already exists (prevent duplicates)
    const orderExists = existingOrders.some(o => o.orderNumber === order.orderNumber);
    if (orderExists) {
      console.log('🔄 Order already exists in cache:', order.orderNumber);
      return;
    }
    
    // Additional check: prevent orders with same timestamp within 1 second
    const orderTime = new Date(order.timestamp).getTime();
    const duplicateByTime = existingOrders.some(o => {
      const existingTime = new Date(o.timestamp).getTime();
      return Math.abs(orderTime - existingTime) < 1000; // Less than 1 second apart
    });
    
    if (duplicateByTime) {
      console.log('🔄 Duplicate order detected by timestamp, skipping save');
      return;
    }
    
    // Add new order at the beginning
    const updatedOrders = [order, ...existingOrders];
    
    // Limit to MAX_ORDERS
    const limitedOrders = updatedOrders.slice(0, MAX_ORDERS);
    
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(limitedOrders));
    console.log('✅ Order saved to cache:', order.orderNumber);
  } catch (error) {
    console.error('❌ Error saving order to cache:', error);
  }
};

/**
 * Clear orders older than DAYS_TO_KEEP
 */
export const clearOldOrders = (): void => {
  try {
    const orders = getRecentOrders();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - DAYS_TO_KEEP);
    
    const recentOrders = orders.filter(order => {
      const orderDate = new Date(order.timestamp);
      return orderDate >= cutoffDate;
    });
    
    if (recentOrders.length !== orders.length) {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(recentOrders));
      console.log(`Cleaned ${orders.length - recentOrders.length} old orders`);
    }
  } catch (error) {
    console.error('Error cleaning old orders:', error);
  }
};

/**
 * Get order statistics
 */
export const getOrderStats = () => {
  const orders = getRecentOrders();
  
  if (orders.length === 0) {
    return {
      totalSpent: 0,
      orderCount: 0,
      averageOrder: 0,
      favoriteProduct: null,
      lastOrderDate: null
    };
  }
  
  const totalSpent = orders.reduce((sum, order) => sum + order.pricing.total, 0);
  const orderCount = orders.length;
  const averageOrder = totalSpent / orderCount;
  
  // Find most ordered product
  const productCounts: Record<string, { count: number; name: string; id: number }> = {};
  
  orders.forEach(order => {
    order.cart.forEach(item => {
      const key = `${item.pizzaId}-${item.name}`;
      if (!productCounts[key]) {
        productCounts[key] = { count: 0, name: item.name, id: item.pizzaId };
      }
      productCounts[key].count += item.quantity;
    });
  });
  
  const favoriteProduct = Object.values(productCounts)
    .sort((a, b) => b.count - a.count)[0] || null;
  
  const lastOrderDate = orders[0]?.timestamp || null;
  
  return {
    totalSpent,
    orderCount,
    averageOrder,
    favoriteProduct,
    lastOrderDate
  };
};

/**
 * Format relative time for order display
 */
export const getRelativeTime = (timestamp: string, t: (key: string, options?: any) => string): string => {
  const orderDate = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - orderDate.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffMins < 60) {
    return t('orders.time.minutesAgo', { count: diffMins, default: `${diffMins}m ago` });
  } else if (diffHours < 24) {
    return t('orders.time.hoursAgo', { count: diffHours, default: `${diffHours}h ago` });
  } else if (diffDays === 1) {
    return t('orders.time.yesterday', { default: 'Yesterday' });
  } else if (diffDays < 7) {
    return t('orders.time.daysAgo', { count: diffDays, default: `${diffDays}d ago` });
  } else {
    return orderDate.toLocaleDateString();
  }
};

/**
 * Clean corrupted data and migrate old formats
 */
export const migrateAndCleanOrders = (): void => {
  try {
    const ordersJson = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (!ordersJson) return;
    
    const rawOrders = JSON.parse(ordersJson);
    if (!Array.isArray(rawOrders)) return;
    
    const validOrders = rawOrders.filter(order => {
      // Basic validation
      return (
        order &&
        typeof order === 'object' &&
        order.orderNumber &&
        order.timestamp &&
        order.customer &&
        order.cart &&
        Array.isArray(order.cart) &&
        order.pricing &&
        typeof order.pricing.total === 'number'
      );
    });
    
    if (validOrders.length !== rawOrders.length) {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(validOrders));
      console.log(`Cleaned ${rawOrders.length - validOrders.length} corrupted orders`);
    }
  } catch (error) {
    console.error('Error migrating orders:', error);
    // In case of severe corruption, clear all data
    localStorage.removeItem(ORDERS_STORAGE_KEY);
  }
};

/**
 * Initialize order cache (call on app startup)
 */
export const initializeOrderCache = (): void => {
  migrateAndCleanOrders();
  clearOldOrders();
};
