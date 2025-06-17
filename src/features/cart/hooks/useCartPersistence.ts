import { useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { getCart } from '../cartSlice';

interface CartCache {
  version: string;
  userId?: string;
  sessionId: string;
  items: any[];
  preferences: {
    deliveryMode: string;
    lastAddress?: string;
  };
  metadata: {
    createdAt: number;
    lastUpdated: number;
    expiresAt: number;
    viewCount: number;
  };
}

const CART_STORAGE_KEY = 'campus_pizza_cart_v2';
const CART_SESSION_KEY = 'campus_pizza_session';
const CACHE_VERSION = '2.0.0';

// TTL Configuration
const TTL_ANONYMOUS = 24 * 60 * 60 * 1000; // 24 hours
const TTL_USER = 7 * 24 * 60 * 60 * 1000; // 7 days

export function useCartPersistence(userId?: string) {
  const cart = useSelector(getCart);

  // Generate or get session ID
  const getSessionId = useCallback((): string => {
    let sessionId = sessionStorage.getItem(CART_SESSION_KEY);
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem(CART_SESSION_KEY, sessionId);
    }
    return sessionId;
  }, []);

  // Save cart to localStorage
  const saveCart = useCallback((cartItems: any[], deliveryMode: string = 'delivery') => {
    try {
      const now = Date.now();
      const ttl = userId ? TTL_USER : TTL_ANONYMOUS;
      
      const cartCache: CartCache = {
        version: CACHE_VERSION,
        userId,
        sessionId: getSessionId(),
        items: cartItems,
        preferences: {
          deliveryMode,
          lastAddress: undefined // TODO: Get from user preferences
        },
        metadata: {
          createdAt: now,
          lastUpdated: now,
          expiresAt: now + ttl,
          viewCount: 1
        }
      };

      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartCache));
      console.log('Cart saved to localStorage:', cartCache);
    } catch (error) {
      console.error('Failed to save cart to localStorage:', error);
    }
  }, [userId, getSessionId]);

  // Load cart from localStorage
  const loadCart = useCallback((): CartCache | null => {
    try {
      const cached = localStorage.getItem(CART_STORAGE_KEY);
      if (!cached) return null;

      const cartCache: CartCache = JSON.parse(cached);
      
      // Version check
      if (cartCache.version !== CACHE_VERSION) {
        console.log('Cart cache version mismatch, clearing...');
        clearCart();
        return null;
      }

      // Expiry check
      const now = Date.now();
      if (cartCache.metadata.expiresAt < now) {
        console.log('Cart cache expired, clearing...');
        clearCart();
        return null;
      }

      // Update view count and last access
      cartCache.metadata.viewCount += 1;
      cartCache.metadata.lastUpdated = now;
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartCache));

      console.log('Cart loaded from localStorage:', cartCache);
      return cartCache;
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error);
      clearCart();
      return null;
    }
  }, []);

  // Clear cart cache
  const clearCart = useCallback(() => {
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
      console.log('Cart cache cleared');
    } catch (error) {
      console.error('Failed to clear cart cache:', error);
    }
  }, []);

  // Restore cart (to be used by Redux)
  const restoreCart = useCallback(() => {
    const cached = loadCart();
    return cached?.items || [];
  }, [loadCart]);

  // Check if cache is valid
  const isCacheValid = useCallback((): boolean => {
    try {
      const cached = localStorage.getItem(CART_STORAGE_KEY);
      if (!cached) return false;

      const cartCache: CartCache = JSON.parse(cached);
      const now = Date.now();
      
      return cartCache.version === CACHE_VERSION && cartCache.metadata.expiresAt > now;
    } catch {
      return false;
    }
  }, []);

  // Auto-save cart when it changes
  useEffect(() => {
    if (cart && cart.length > 0) {
      saveCart(cart);
    }
  }, [cart, saveCart]);

  // Cleanup expired caches on mount
  useEffect(() => {
    const cleanupExpiredCaches = () => {
      try {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
          if (key.startsWith('campus_pizza_cart_')) {
            try {
              const cached = JSON.parse(localStorage.getItem(key) || '{}');
              if (cached.metadata && cached.metadata.expiresAt < Date.now()) {
                localStorage.removeItem(key);
                console.log(`Cleaned up expired cache: ${key}`);
              }
            } catch {
              // Invalid cache entry, remove it
              localStorage.removeItem(key);
            }
          }
        });
      } catch (error) {
        console.error('Failed to cleanup expired caches:', error);
      }
    };

    cleanupExpiredCaches();
  }, []);

  return {
    saveCart,
    loadCart,
    clearCart,
    restoreCart,
    isCacheValid,
    sessionId: getSessionId()
  };
}
