import { SavedOrder, getRecentOrders as getRecentOrdersOriginal, saveOrder as saveOrderOriginal } from '../utils/orderCache';
import cookieConsentService from '../services/cookieConsent';

/**
 * TTDSG § 25 compliant order cache utilities
 * Only access order history if user has consented to functional cookies
 */

/**
 * Get recent orders - respects cookie consent
 */
export const getRecentOrders = (): SavedOrder[] => {
  if (cookieConsentService.isCategoryAllowed('functional')) {
    return getRecentOrdersOriginal();
  }
  return [];
};

/**
 * Save order - respects cookie consent
 */
export const saveOrder = (order: SavedOrder): boolean => {
  if (cookieConsentService.isCategoryAllowed('functional')) {
    saveOrderOriginal(order);
    return true;
  }
  return false; // Indicate save was not performed due to consent
};

/**
 * Clear order history - always allowed (user action)
 */
export const clearOrderHistory = (): void => {
  try {
    localStorage.setItem('campusPizzaOrders', JSON.stringify([]));
    console.log('Order history cleared by user');
  } catch (error) {
    console.warn('Failed to clear order history:', error);
  }
};

/**
 * Clear order history due to consent withdrawal
 */
export const clearOrderHistoryOnConsentWithdrawal = (): void => {
  if (!cookieConsentService.isCategoryAllowed('functional')) {
    try {
      localStorage.removeItem('campusPizzaOrders');
      console.log('Order history cleared due to consent withdrawal');
    } catch (error) {
      console.warn('Failed to clear order history:', error);
    }
  }
};
