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
import { useOrderSubmission } from "./hooks/useOrderSubmission";
import { useSocialProof } from "../../hooks/useSocialProof";
import RestaurantStatusBanner from "../../ui/RestaurantStatusBanner";
import { calculateDeliveryFee } from "../../utils/deliveryTariffs";
import { 
  selectUser
} from '../user/userSlice';
// WhatsApp Integration imports
import { useWhatsAppIntegration } from '../../hooks/useWhatsAppIntegration';
import { WhatsAppConfirmationModal } from '../../ui/WhatsAppConfirmationModal';
import { WhatsAppResultModal } from '../../ui/WhatsAppResultModal';
import { OrderData, WhatsAppResult } from '../../types/whatsapp';

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
  const user = useSelector(selectUser);

  // Social proof hook for dynamic content
  const { socialProof, isLoading } = useSocialProof();

  // Calculate delivery fees using the tariff system
  const userPLZ = user.postalCode || user.plz;
  const deliveryCalculation = deliveryMode === 'delivery' && userPLZ 
    ? calculateDeliveryFee(userPLZ, cartTotalPrice)
    : calculateDeliveryFee('abholung', cartTotalPrice);

  // Calculate fees with dynamic delivery pricing
  const subtotal = cartTotalPrice;
  const deliveryFee = deliveryCalculation.fee;
  
  // No service fee for better customer experience
  const total = subtotal + deliveryFee;

  // Minimum order validation
  const meetsMinimum = deliveryCalculation.meetsMinimum;
  const missingAmount = deliveryCalculation.missingAmount;
  const currentTariff = deliveryCalculation.tariff;

  // Order submission protection (variables kept for future use)
  const { isSubmitting, startSubmission: _startSubmission, endSubmission: _endSubmission } = useOrderSubmission({ timeout: 10000 });
  
  // WhatsApp integration hook
  const {
    isModalOpen: isWhatsAppModalOpen,
    isLoading: _isWhatsAppLoading,
    result: whatsAppResult,
    openConfirmation: openWhatsAppConfirmation,
    closeConfirmation: closeWhatsAppConfirmation,
    sendOrder: _sendWhatsAppOrder,
    reset: resetWhatsApp
  } = useWhatsAppIntegration();

  // Estado para modal de resultado
  const [showWhatsAppResultModal, setShowWhatsAppResultModal] = useState(false);
  const [currentOrderData, setCurrentOrderData] = useState<OrderData | null>(null);
  const [formData, setFormData] = useState<FormData>({
    customer: '',
    phone: '+49',
    address: '',
    postalCode: '',
    city: 'Dortmund',
    paymentMethod: 'cash',
    specialInstructions: ''  });

  const [errors, setErrors] = useState<FormErrors>({});

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
  };

  // Create WhatsApp message (reserved for future customization)
  // @ts-ignore - Function reserved for future use
  const _createWhatsAppMessage = (orderNumber: string): string => {
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

    // Add delivery zone info for delivery orders
    const deliveryZoneInfo = deliveryMode === 'delivery' && currentTariff 
      ? `\n🗺️ *Delivery Zone:* ${currentTariff.name} (PLZ: ${userPLZ})`
      : '';

    return `🍕 *${t('checkout.whatsappMessage.title')}*

📋 *${t('checkout.whatsappMessage.orderNumber', { orderNumber })}*
📞 *${t('checkout.whatsappMessage.phone', { phone: formData.phone })}*

👤 *${t('checkout.whatsappMessage.customer')}* ${formData.customer}${addressInfo}${deliveryZoneInfo}

🛒 *${t('checkout.whatsappMessage.products')}*
${orderItems}

💰 *${t('checkout.whatsappMessage.summary')}*
${t('checkout.whatsappMessage.subtotal', { amount: formatCurrency(subtotal) })}
${deliveryMode === 'delivery' ? `${t('checkout.whatsappMessage.delivery', { amount: formatCurrency(deliveryFee) })}\n` : ''}*${t('checkout.whatsappMessage.total', { amount: formatCurrency(total) })}*

🚀 *${t('checkout.whatsappMessage.type', { type: deliveryTypeText })}*
💳 *${t('checkout.whatsappMessage.payment', { method: paymentMethodText })}*${specialInstructionsText}

---
⏰ ${t('common.processing')}`;
  };

  // Generate order data helper
  const createOrderData = (orderNumber: string): OrderData => {
    return {
      orderNumber,
      timestamp: new Date().toISOString(),
      customer: formData.customer,
      phone: formData.phone,
      deliveryMode,
      address: deliveryMode === 'delivery' ? {
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
        serviceFee: 0,
        total
      }
    };
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    // Prevent multiple submissions
    if (isSubmitting) return;

    // Generate order number and create order data
    const orderNumber = generateOrderNumber();
    const orderData = createOrderData(orderNumber);

    // Save current order data for modal use
    setCurrentOrderData(orderData);

    // Save to cache first (to prevent duplicates)
    saveOrder(orderData);
    
    // Open WhatsApp confirmation modal
    openWhatsAppConfirmation();
  };

  // Handle WhatsApp confirmation
  const handleWhatsAppConfirm = async (result: WhatsAppResult) => {
    closeWhatsAppConfirmation();
    
    if (result.success) {
      // Clear cart and navigate to confirmation
      dispatch(clearCart());
      
      // Small delay to ensure state is updated
      await new Promise(resolve => setTimeout(resolve, 100));
      
      navigate('/order-confirmation', { 
        state: { 
          orderNumber: 'CP' + Date.now().toString().slice(-6),
          deliveryMode,
          estimatedTime: deliveryMode === 'delivery' ? '30-45 min' : '15-20 min'
        },
        replace: true
      });
    } else {
      // Show result modal with alternatives
      setShowWhatsAppResultModal(true);
    }
  };

  // Handle result modal close
  const handleResultModalClose = () => {
    setShowWhatsAppResultModal(false);
    resetWhatsApp();
  };

  // Handle retry
  const handleWhatsAppRetry = () => {
    setShowWhatsAppResultModal(false);
    openWhatsAppConfirmation();
  };

  // Redirect if cart is empty
  if (!cart.length) return <EmptyCart />;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl px-4 py-6 mx-auto">
        {/* Header */}
        <div className="mb-6">
          <LinkButton to="/menu">&larr; {t('common.backToMenu', { default: 'Back to Menu' })}</LinkButton>
        </div>

        <div className="mb-8">
          <h1 className="mb-2 text-2xl font-bold text-gray-900">
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
        </div>        {/* Dynamic Restaurant Status & Social Proof */}
        <RestaurantStatusBanner />
        
        {/* Additional Social Proof Banner */}
        <div className="p-4 mb-6 border border-gray-200 shadow-sm bg-white/90 backdrop-blur-sm rounded-xl">          <div className="flex items-center justify-center gap-4 text-sm text-gray-700">
            <div className="flex items-center gap-2">
              <span className="text-green-500">👥</span>
              <span className={`transition-all duration-300 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
                {socialProof.isRestaurantOpen && socialProof.orderingCount > 0 
                  ? t('home.socialProof.ordering', { count: socialProof.orderingCount })
                  : socialProof.isRestaurantOpen
                    ? t('home.socialProof.viewing', { count: socialProof.viewingCount })
                    : t('home.socialProof.viewingClosed', { count: socialProof.viewingCount })
                }
              </span>
            </div>
            <div className="w-px h-4 bg-gray-300"></div>
            <div className="flex items-center gap-2">
              <span className="text-yellow-500">⭐</span>
              <span className={`transition-all duration-300 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
                {t('home.socialProof.reviews', { rating: socialProof.rating, count: socialProof.reviewCount })}
              </span>
            </div>
          </div>
          
          {/* Recent order indicator */}
          <div className="mt-2 text-center">
            <span className="text-xs text-gray-500">
              📍 {t('socialProof.recentOrder', { time: socialProof.recentOrderTime })}
            </span>
          </div>
          
          {/* Urgency message */}
          {socialProof.urgencyMessage && (
            <div className="mt-2 text-center">
              <span className="px-2 py-1 text-xs text-orange-600 rounded-full bg-orange-50">
                🔥 {socialProof.urgencyMessage.count 
                  ? t(socialProof.urgencyMessage.key, { count: socialProof.urgencyMessage.count })
                  : t(socialProof.urgencyMessage.key)
                }
              </span>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="p-6 mb-6 bg-white border border-gray-200 rounded-lg shadow-sm">
          <h3 className="flex items-center gap-2 mb-4 font-semibold text-gray-900">
            <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            {t('checkout.orderSummary', { default: 'Order Summary' })}
          </h3>
          
          <div className="space-y-3">            {cart.map((item: any) => (
              <div key={`${item.pizzaId}-${item.size || 'default'}`} className="flex items-center justify-between py-2">
                <div className="flex-1">                  <div className="flex items-center justify-between">
                    <div className="font-medium text-gray-900">
                      <span className="mr-1 text-sm text-gray-500">
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

          <div className="pt-4 mt-4 border-t border-gray-200">
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
              
              
              <div className="pt-2 border-t border-gray-200">
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-gray-900">{t('checkout.total', { default: 'Total' })}</span>
                  <span className="text-orange-600">{formatCurrency(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Information Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h3 className="flex items-center gap-2 mb-4 font-semibold text-gray-900">
              <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {t('checkout.customerInfo', { default: 'Customer Information' })}
            </h3>
            
            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
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
                <label className="block mb-2 text-sm font-medium text-gray-700">
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
            <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
              <h3 className="flex items-center gap-2 mb-4 font-semibold text-gray-900">
                <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {t('checkout.deliveryAddress', { default: 'Delivery Address' })}
              </h3>
                <div className="space-y-4">
                {/* Address */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
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
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
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
                    <label className="block mb-2 text-sm font-medium text-gray-700">
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
                <div className="p-4 border border-orange-200 rounded-lg bg-orange-50">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="mb-1 font-medium text-orange-800">
                        {t('checkout.deliveryZones', { default: 'Delivery Zones:' })}
                      </p>
                      <p className="text-sm text-orange-700">44149, 44147, 44137, 44135, 44139, 44388, 44145, 44143, 44141, 44229, 44225, 44227, 44369, 44379, 44357, 44359, 44265, 44263</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Payment Method */}
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h3 className="flex items-center gap-2 mb-4 font-semibold text-gray-900">
              <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {t('checkout.paymentMethod', { default: 'Payment Method' })}
            </h3>
            
            <div className="space-y-3">
              <label className="flex items-center p-4 transition-colors border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
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
              
              <label className="flex items-center p-4 transition-colors border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
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
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h3 className="flex items-center gap-2 mb-4 font-semibold text-gray-900">
              <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              {t('checkout.specialInstructions', { default: 'Special Instructions' })} 
              <span className="text-sm font-normal text-gray-500">({t('common.optional', { default: 'optional' })})</span>
            </h3>
            
            <textarea
              value={formData.specialInstructions}
              onChange={(e) => handleInputChange('specialInstructions', e.target.value)}
              className="w-full px-4 py-3 transition-colors border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
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

          {/* Minimum Order Validation */}
          {!meetsMinimum && currentTariff && (
            <div className="p-4 mb-6 border border-red-200 rounded-lg bg-red-50">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium text-red-800">
                  ⚠️ Mindestbestellwert nicht erreicht
                </span>
              </div>
              <p className="text-xs text-red-600">
                Mindestbestellwert: €{currentTariff.mindestbestellwert.toFixed(2)} 
                • Noch €{missingAmount.toFixed(2)} erforderlich
              </p>
              <div className="mt-2">
                <LinkButton to="/menu">
                  → Weitere Artikel hinzufügen
                </LinkButton>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="mb-6">
              <div className="flex items-center justify-between p-4 rounded-lg bg-orange-50">
                <span className="font-semibold text-orange-900">
                  {t('checkout.finalTotal', { default: 'Final Total' })}
                </span>
                <span className="text-2xl font-bold text-orange-600">{formatCurrency(total)}</span>
              </div>
            </div>            <button
              type="submit"
              disabled={isSubmitting || !meetsMinimum}
              className={`w-full font-semibold py-4 px-6 rounded-full transition-all duration-200 transform ${
                meetsMinimum && !isSubmitting
                  ? 'bg-orange-500 hover:bg-orange-600 text-white hover:scale-[1.02]'
                  : 'bg-gray-400 text-white cursor-not-allowed'
              } disabled:hover:scale-100 disabled:cursor-not-allowed`}
              onClick={(e) => {
                // Additional protection against double clicks and minimum order validation
                if (isSubmitting || !meetsMinimum) {
                  e.preventDefault();
                  e.stopPropagation();
                  if (isSubmitting) {
                    console.log('⚠️ Button click ignored - submission in progress');
                  } else {
                    console.log('⚠️ Button click ignored - minimum order not met');
                  }
                  return;
                }
              }}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                  {t('common.processing', { default: 'Processing...' })}
                </div>
              ) : !meetsMinimum ? (
                <div className="flex items-center justify-center gap-2">
                  <span>❌</span>
                  <span>
                    Mindestbestellwert: €{currentTariff?.mindestbestellwert.toFixed(2) || '0.00'}
                  </span>
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

        {/* WhatsApp Integration Modals */}
        {currentOrderData && (
          <WhatsAppConfirmationModal
            isOpen={isWhatsAppModalOpen}
            onCancel={closeWhatsAppConfirmation}
            onEdit={closeWhatsAppConfirmation}
            onConfirm={handleWhatsAppConfirm}
            orderData={currentOrderData}
          />
        )}

        <WhatsAppResultModal
          isOpen={showWhatsAppResultModal}
          onClose={handleResultModalClose}
          onRetry={handleWhatsAppRetry}
          result={whatsAppResult}
        />
      </div>
    </div>
  );
}

export default CheckoutForm;
