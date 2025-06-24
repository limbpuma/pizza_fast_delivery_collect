import { useCallback } from 'react';
import { useCookieConsent } from '../hooks/useCookieConsent';
import * as orderCache from '../utils/orderCache';
import type { SavedOrder } from '../utils/orderCache';

/**
 * TTDSG § 25 compliant order cache utilities
 * Only stores and retrieves order data if user has consented to functional cookies
 */
export function useConsentAwareOrderCache() {
  const { isCategoryAllowed } = useCookieConsent();

  // Check if functional cookies are allowed for order history
  const canStoreOrders = isCategoryAllowed('functional');

  /**
   * Save order to cache with consent check
   */  const saveOrder = useCallback((order: SavedOrder) => {
    if (canStoreOrders) {
      orderCache.saveOrder(order);
      return true;
    } else {
      console.info('Order not saved: functional cookies not consented');
      return false;
    }
  }, [canStoreOrders]);

  /**
   * Get recent orders with consent check
   */
  const getRecentOrders = useCallback((): SavedOrder[] => {
    if (canStoreOrders) {
      return orderCache.getRecentOrders();
    } else {
      return [];
    }
  }, [canStoreOrders]);

  /**
   * Get specific order by ID with consent check
   */
  const getOrderById = useCallback((orderNumber: string): SavedOrder | null => {
    if (canStoreOrders) {
      return orderCache.getOrderById(orderNumber);
    } else {
      return null;
    }
  }, [canStoreOrders]);

  /**
   * Clear all orders with consent check
   */  const clearOrders = useCallback(() => {
    if (canStoreOrders) {
      // Clear all orders by setting empty array
      try {
        localStorage.setItem('campusPizzaOrders', JSON.stringify([]));
        return true;
      } catch (error) {
        console.error('Failed to clear orders:', error);
        return false;
      }
    } else {
      // If consent withdrawn, clear orders anyway for privacy
      try {
        localStorage.removeItem('campusPizzaOrders');
        return true;
      } catch (error) {
        console.error('Failed to clear orders:', error);
        return false;
      }
    }
  }, [canStoreOrders]);

  /**
   * Get order statistics with consent check
   */
  const getOrderStats = useCallback(() => {
    if (canStoreOrders) {
      return orderCache.getOrderStats();
    } else {
      return {
        totalOrders: 0,
        totalSpent: 0,
        averageOrder: 0,
        favoriteItems: []
      };
    }
  }, [canStoreOrders]);

  /**
   * Clean up expired orders
   */  const cleanupExpiredOrders = useCallback(() => {
    if (canStoreOrders) {
      orderCache.clearOldOrders();
      return true;
    } else {
      // If consent withdrawn, clear all orders
      try {
        localStorage.removeItem('campusPizzaOrders');
        return true;
      } catch (error) {
        console.error('Failed to cleanup orders:', error);
        return false;
      }
    }
  }, [canStoreOrders]);

  return {
    saveOrder,
    getRecentOrders,
    getOrderById,
    clearOrders,
    getOrderStats,
    cleanupExpiredOrders,
    canStoreOrders
  };
}
