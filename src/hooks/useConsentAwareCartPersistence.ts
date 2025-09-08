import { useEffect, useCallback } from 'react';
import { useCartPersistence } from '../features/cart/hooks/useCartPersistence';
import { useCookieConsent } from '../contexts/CookieConsentContext';

/**
 * TTDSG § 25 compliant cart persistence hook
 * Only persists cart data if user has consented to functional cookies
 */
export function useConsentAwareCartPersistence(userId?: string) {
  const { isCategoryAllowed } = useCookieConsent();
  const cartPersistence = useCartPersistence(userId);

  // Check if functional cookies are allowed
  const canPersistCart = isCategoryAllowed('functional');

  // Enhanced save function that respects consent
  const saveCartWithConsent = useCallback((cartItems: any[], deliveryMode: string = 'delivery') => {
    if (canPersistCart) {
      cartPersistence.saveCart(cartItems, deliveryMode);
    } else {
      // Clear any existing cart data if consent withdrawn
      try {
        localStorage.removeItem('campus_pizza_cart_v2');
      } catch (error) {
        console.warn('Failed to clear cart persistence:', error);
      }
    }
  }, [canPersistCart, cartPersistence]);

  // Enhanced load function that respects consent
  const loadCartWithConsent = useCallback(() => {
    if (canPersistCart) {
      return cartPersistence.loadCart();
    }
    return null;
  }, [canPersistCart, cartPersistence]);

  // Clean up cart data if consent is withdrawn
  useEffect(() => {
    if (!canPersistCart) {
      try {
        localStorage.removeItem('campus_pizza_cart_v2');
      } catch (error) {
        console.warn('Failed to clear cart data after consent withdrawal:', error);
      }
    }
  }, [canPersistCart]);

  return {
    ...cartPersistence,
    saveCart: saveCartWithConsent,
    loadCart: loadCartWithConsent,
    canPersist: canPersistCart
  };
}
