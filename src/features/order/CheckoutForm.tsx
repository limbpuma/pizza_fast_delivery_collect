import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from "react-redux";
import { clearCart, getCart, getTotalCartPrice } from "../cart/cartSlice";
import EmptyCart from "../cart/EmptyCart";
import { formatCurrency } from "../../utils/helpers";
import { isValidInternationalPhone, isValidGermanPostalCode } from "../../utils/germanHelpers";
import { isValidDeliveryZone } from "../../utils/deliveryZones";
import { saveOrder } from "../../utils/orderCache";
import LinkButton from "../../ui/LinkButton";
import PhoneInput from "../../ui/PhoneInput";

interface FormData {
  customer: string;
  phone: string;
  address?: string; // Combined street and house number
  postalCode?: string;
  city?: string;
  paymentMethod: 'cash' | 'card';
  specialInstructions?: string;
}

interface FormErrors {
  customer?: string;
  phone?: string;
  address?: string; // Combined address field
  postalCode?: string;
}

function CheckoutForm() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Get delivery mode from navigation state or default to 'collection'
  const deliveryMode = location.state?.deliveryMode || 'collection';
  
  const cart = useSelector(getCart);
  const cartTotalPrice = useSelector(getTotalCartPrice);

  // Calculate fees
  const subtotal = cartTotalPrice;
  const deliveryFee = deliveryMode === 'delivery' ? 0.99 : 0;
  const serviceFee = Math.round(subtotal * 0.025 * 100) / 100; // 2.5% service fee
  const maxServiceFee = 0.99;
  const finalServiceFee = Math.min(serviceFee, maxServiceFee);
  const total = subtotal + deliveryFee + finalServiceFee;  // Form state
  const [formData, setFormData] = useState<FormData>({
    customer: '',
    phone: '+49',
    address: '',
    postalCode: '',
    city: 'Dortmund',
    paymentMethod: 'cash',
    specialInstructions: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle input changes
  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Name validation
    if (!formData.customer.trim()) {
      newErrors.customer = t('checkout.errors.nameRequired', { default: 'Name is required' });
    }    // Phone validation
    if (!formData.phone.trim() || formData.phone.trim() === '+49') {
      newErrors.phone = t('checkout.errors.phoneRequired', { default: 'Phone number is required' });
    } else if (!isValidInternationalPhone(formData.phone)) {
      newErrors.phone = t('checkout.errors.phoneInvalid', { default: 'Please enter a valid phone number' });
    }    // Delivery-specific validation
    if (deliveryMode === 'delivery') {
      if (!formData.address?.trim()) {
        newErrors.address = t('checkout.errors.addressRequired', { default: 'Address is required' });
      }

      if (!formData.postalCode?.trim()) {
        newErrors.postalCode = t('checkout.errors.postalCodeRequired', { default: 'Postal code is required' });
      } else if (!isValidGermanPostalCode(formData.postalCode)) {
        newErrors.postalCode = t('checkout.errors.postalCodeInvalid', { default: 'Please enter a valid 5-digit postal code' });
      } else if (!isValidDeliveryZone(formData.postalCode)) {
        newErrors.postalCode = t('checkout.errors.postalCodeNotInZone', { 
          default: 'Sorry, we don\'t deliver to this postal code' 
        });
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Generate order number
  const generateOrderNumber = (): string => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `CP${timestamp.toString().slice(-6)}${random.toString().padStart(3, '0')}`;
  };  // Create WhatsApp message
  const createWhatsAppMessage = (orderNumber: string): string => {
    const orderItems = cart.map((item: any) => 
      `${item.quantity}x ${t('menu.productNumber', { number: item.pizzaId })} ${item.name}${item.size && item.size !== 'standard' ? ` (${item.size})` : ''} - ${formatCurrency(item.totalPrice)}`
    ).join('\n');

    const deliveryTypeText = deliveryMode === 'delivery' 
      ? t('checkout.whatsappMessage.deliveryType')
      : t('checkout.whatsappMessage.collectionType');
    
    const paymentMethodText = formData.paymentMethod === 'cash' 
      ? t('checkout.whatsappMessage.paymentCash')
      : t('checkout.whatsappMessage.paymentCard');    let addressInfo = '';
    if (deliveryMode === 'delivery' && formData.address && formData.postalCode) {
      // Format address for Google Maps - making it clickable
      const fullAddress = `${formData.address}, ${formData.postalCode} ${formData.city}, Deutschland`;
      const googleMapsUrl = `https://maps.google.com/?q=${encodeURIComponent(fullAddress)}`;
      addressInfo = `\n📍 *${t('checkout.whatsappMessage.address')}*\n${fullAddress}\n🗺️ Google Maps: ${googleMapsUrl}`;
    }

    const specialInstructionsText = formData.specialInstructions?.trim() 
      ? `\n📝 ${t('checkout.whatsappMessage.specialInstructions', { instructions: formData.specialInstructions })}`
      : '';

    return `🍕 *${t('checkout.whatsappMessage.title')}*

📋 *${t('checkout.whatsappMessage.orderNumber', { orderNumber })}*
📞 *${t('checkout.whatsappMessage.phone', { phone: formData.phone })}*

👤 *${t('checkout.whatsappMessage.customer')}* ${formData.customer}${addressInfo}

🛒 *${t('checkout.whatsappMessage.products')}*
${orderItems}

💰 *${t('checkout.whatsappMessage.summary')}*
${t('checkout.whatsappMessage.subtotal', { amount: formatCurrency(subtotal) })}
${deliveryMode === 'delivery' ? `${t('checkout.whatsappMessage.delivery', { amount: formatCurrency(deliveryFee) })}\n` : ''}${t('checkout.whatsappMessage.service', { amount: formatCurrency(finalServiceFee) })}
*${t('checkout.whatsappMessage.total', { amount: formatCurrency(total) })}*

🚀 *${t('checkout.whatsappMessage.type', { type: deliveryTypeText })}*
💳 *${t('checkout.whatsappMessage.payment', { method: paymentMethodText })}*${specialInstructionsText}

---
⏰ ${t('common.processing')}`;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Generate order number
      const orderNumber = generateOrderNumber();      // Save order to cache
      const orderData = {
        orderNumber,
        timestamp: new Date().toISOString(),
        customer: formData.customer,
        phone: formData.phone,
        deliveryMode,        address: deliveryMode === 'delivery' ? {
          street: formData.address || '',
          houseNumber: '',
          postalCode: formData.postalCode || '',
          city: formData.city || 'Dortmund'
        } : undefined,
        paymentMethod: formData.paymentMethod,
        specialInstructions: formData.specialInstructions,
        cart: cart,
        pricing: {
          subtotal,
          deliveryFee,
          serviceFee: finalServiceFee,
          total
        }
      };

      // Save to cache using proper utility
      saveOrder(orderData);

      // Create WhatsApp message
      const whatsappMessage = createWhatsAppMessage(orderNumber);
      
      // Restaurant WhatsApp number (replace with actual number)
      const restaurantPhone = '+4917645754360'; // This should be the real restaurant number
      
      // Create WhatsApp URL
      const whatsappUrl = `https://wa.me/${restaurantPhone.replace('+', '')}?text=${encodeURIComponent(whatsappMessage)}`;

      // Clear cart
      dispatch(clearCart());

      // Open WhatsApp
      window.open(whatsappUrl, '_blank');

      // Navigate to confirmation page
      navigate('/order-confirmation', { 
        state: { 
          orderNumber,
          deliveryMode,
          estimatedTime: deliveryMode === 'delivery' ? '30-45 min' : '15-20 min'
        }
      });

    } catch (error) {
      console.error('Error submitting order:', error);
      alert(t('checkout.errors.submitError', { default: 'An error occurred. Please try again.' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Redirect if cart is empty
  if (!cart.length) return <EmptyCart />;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 py-6 max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <LinkButton to="/menu">&larr; {t('common.backToMenu', { default: 'Back to Menu' })}</LinkButton>
        </div>        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {deliveryMode === 'delivery' 
              ? t('checkout.titleDelivery', { default: 'Checkout - Delivery' })
              : t('checkout.titleCollection', { default: 'Checkout - Collection' })
            }
          </h1>
          <p className="text-gray-600">
            {deliveryMode === 'delivery' 
              ? t('checkout.deliverySubtitle', { default: 'Complete your delivery details' })
              : t('checkout.collectionSubtitle', { default: 'Complete your pickup details' })
            }
          </p>
        </div>

        {/* Urgency Banner */}
        <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-400 rounded-lg">
          <div className="flex items-center gap-3">
            <span className="text-red-500 text-lg">⏰</span>
            <div>
              <p className="font-semibold text-red-800">Limited Time: Kitchen closes in 3h 27min</p>
              <p className="text-sm text-red-700">🔥 6 people ordering right now • Order now for guaranteed delivery</p>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            {t('checkout.orderSummary', { default: 'Order Summary' })}
          </h3>
          
          <div className="space-y-3">            {cart.map((item: any) => (
              <div key={`${item.pizzaId}-${item.size || 'default'}`} className="flex justify-between items-center py-2">
                <div className="flex-1">                  <div className="flex items-center justify-between">
                    <div className="font-medium text-gray-900">
                      <span className="text-sm text-gray-500 mr-1">
                        {t('menu.productNumber', { number: item.pizzaId })}
                      </span>
                      {item.quantity}× {item.name}
                      {item.size && ` (${item.size})`}
                    </div>
                  </div>
                  {item.ingredients && item.ingredients.length > 0 && (
                    <div className="text-sm text-gray-600">
                      {item.ingredients.slice(0, 3).join(', ')}
                      {item.ingredients.length > 3 && '...'}
                    </div>
                  )}
                </div>
                <div className="font-semibold text-gray-900">
                  {formatCurrency(item.totalPrice)}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 mt-4 pt-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">{t('checkout.subtotal', { default: 'Subtotal' })}</span>
                <span className="font-medium">{formatCurrency(subtotal)}</span>
              </div>
              
              {deliveryMode === 'delivery' && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{t('checkout.deliveryFee', { default: 'Delivery fee' })}</span>
                  <span className="font-medium">{formatCurrency(deliveryFee)}</span>
                </div>
              )}
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">{t('checkout.serviceFee', { default: 'Service fee' })} (2.5%)</span>
                <span className="font-medium">{formatCurrency(finalServiceFee)}</span>
              </div>
              
              <div className="border-t border-gray-200 pt-2">
                <div className="flex justify-between font-bold text-lg">
                  <span className="text-gray-900">{t('checkout.total', { default: 'Total' })}</span>
                  <span className="text-orange-600">{formatCurrency(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Information Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {t('checkout.customerInfo', { default: 'Customer Information' })}
            </h3>
            
            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('checkout.name', { default: 'Full Name' })} *
                </label>
                <input
                  type="text"
                  value={formData.customer}
                  onChange={(e) => handleInputChange('customer', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                    errors.customer ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder={t('checkout.namePlaceholder', { default: 'Enter your full name' })}
                />
                {errors.customer && (
                  <p className="mt-1 text-sm text-red-600">{errors.customer}</p>
                )}
              </div>              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('checkout.phone', { default: 'Phone Number' })} *
                </label>                <PhoneInput
                  value={formData.phone}
                  onChange={(value: string) => handleInputChange('phone', value)}
                  error={errors.phone}
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>

          {/* Delivery Address (only for delivery) */}
          {deliveryMode === 'delivery' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {t('checkout.deliveryAddress', { default: 'Delivery Address' })}
              </h3>
                <div className="space-y-4">
                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('checkout.address', { default: 'Address' })} *
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                      errors.address ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder={t('checkout.addressPlaceholder', { default: 'e.g. Musterstraße 123a' })}
                  />
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                  )}
                </div>

                {/* Postal Code and City */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('checkout.postalCode', { default: 'Postal Code' })} *
                    </label>
                    <input
                      type="text"
                      value={formData.postalCode}
                      onChange={(e) => handleInputChange('postalCode', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                        errors.postalCode ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="44149"
                      maxLength={5}
                    />
                    {errors.postalCode && (
                      <p className="mt-1 text-sm text-red-600">{errors.postalCode}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('checkout.city', { default: 'City' })}
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                      readOnly
                    />
                  </div>
                </div>

                {/* Delivery zones info */}
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="font-medium text-orange-800 mb-1">
                        {t('checkout.deliveryZones', { default: 'Delivery Zones:' })}
                      </p>
                      <p className="text-sm text-orange-700">44149, 44147, 44227, 44225, 44137, 44135</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Payment Method */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {t('checkout.paymentMethod', { default: 'Payment Method' })}
            </h3>
            
            <div className="space-y-3">
              <label className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                <input
                  type="radio"
                  value="cash"
                  checked={formData.paymentMethod === 'cash'}
                  onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                  className="mr-3 text-orange-500 focus:ring-orange-500"
                />
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span className="font-medium text-gray-900">
                    {deliveryMode === 'delivery' 
                      ? t('checkout.cashOnDelivery', { default: 'Cash on delivery' })
                      : t('checkout.cashOnPickup', { default: 'Cash on pickup' })
                    }
                  </span>
                </div>
              </label>
              
              <label className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                <input
                  type="radio"
                  value="card"
                  checked={formData.paymentMethod === 'card'}
                  onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                  className="mr-3 text-orange-500 focus:ring-orange-500"
                />
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  <span className="font-medium text-gray-900">
                    {deliveryMode === 'delivery' 
                      ? t('checkout.cardOnDelivery', { default: 'Card on delivery' })
                      : t('checkout.cardOnPickup', { default: 'Card on pickup' })
                    }
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Special Instructions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              {t('checkout.specialInstructions', { default: 'Special Instructions' })} 
              <span className="text-gray-500 font-normal text-sm">({t('common.optional', { default: 'optional' })})</span>
            </h3>
            
            <textarea
              value={formData.specialInstructions}
              onChange={(e) => handleInputChange('specialInstructions', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors resize-none"
              rows={3}
              placeholder={t('checkout.specialInstructionsPlaceholder', { 
                default: 'Ring doorbell, leave at door, etc.' 
              })}
              maxLength={200}
            />
            <p className="mt-2 text-xs text-gray-500">
              {formData.specialInstructions?.length || 0}/200
            </p>
          </div>

          {/* Submit Button */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="mb-6">
              <div className="flex justify-between items-center p-4 bg-orange-50 rounded-lg">
                <span className="font-semibold text-orange-900">
                  {t('checkout.finalTotal', { default: 'Final Total' })}
                </span>
                <span className="text-2xl font-bold text-orange-600">{formatCurrency(total)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-semibold py-4 px-6 rounded-full transition-all duration-200 transform hover:scale-[1.02] disabled:hover:scale-100 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {t('common.processing', { default: 'Processing...' })}
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  {t('checkout.placeOrder', { default: 'Place Order via WhatsApp' })}
                </div>
              )}
            </button>

            <p className="mt-4 text-xs text-center text-gray-500">
              {t('checkout.whatsappNote', { 
                default: 'Your order will be sent via WhatsApp to our restaurant' 
              })}
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CheckoutForm;
