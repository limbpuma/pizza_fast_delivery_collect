import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from "react-redux";
import { clearCart, getCart, getTotalCartPrice } from "../cart/cartSlice";
import EmptyCart from "../cart/EmptyCart";
import { formatCurrency } from "../../utils/helpers";
import { isValidGermanPhone, isValidGermanPostalCode } from "../../utils/germanHelpers";
import { isValidDeliveryZone } from "../../utils/deliveryZones";
import Button from "../../ui/Button";
import LinkButton from "../../ui/LinkButton";

interface FormData {
  customer: string;
  phone: string;
  street?: string;
  houseNumber?: string;
  postalCode?: string;
  city?: string;
  paymentMethod: 'cash' | 'card';
  specialInstructions?: string;
}

interface FormErrors {
  customer?: string;
  phone?: string;
  street?: string;
  houseNumber?: string;
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
  const total = subtotal + deliveryFee + finalServiceFee;

  // Form state
  const [formData, setFormData] = useState<FormData>({
    customer: '',
    phone: '',
    street: '',
    houseNumber: '',
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
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = t('checkout.errors.phoneRequired', { default: 'Phone number is required' });
    } else if (!isValidGermanPhone(formData.phone)) {
      newErrors.phone = t('checkout.errors.phoneInvalid', { default: 'Please enter a valid German phone number' });
    }

    // Delivery-specific validation
    if (deliveryMode === 'delivery') {
      if (!formData.street?.trim()) {
        newErrors.street = t('checkout.errors.streetRequired', { default: 'Street name is required' });
      }

      if (!formData.houseNumber?.trim()) {
        newErrors.houseNumber = t('checkout.errors.houseNumberRequired', { default: 'House number is required' });
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

  // Create WhatsApp message
  const createWhatsAppMessage = (orderNumber: string): string => {
    const orderItems = cart.map((item: any) => 
      `${item.quantity}x ${item.name}${item.size && item.size !== 'standard' ? ` (${item.size})` : ''} - ${formatCurrency(item.totalPrice)}`
    ).join('\n');

    const customerInfo = deliveryMode === 'delivery' 
      ? `${formData.customer}\n${formData.street} ${formData.houseNumber}\n${formData.postalCode} ${formData.city}`
      : formData.customer;

    return `🍕 *Campus Pizza Express - Nueva Orden*

📋 *Orden #${orderNumber}*
📞 *Teléfono:* ${formData.phone}

👤 *Cliente:*
${customerInfo}

🛒 *Productos:*
${orderItems}

💰 *Resumen:*
Subtotal: ${formatCurrency(subtotal)}
${deliveryMode === 'delivery' ? `Entrega: ${formatCurrency(deliveryFee)}\n` : ''}Servicio: ${formatCurrency(finalServiceFee)}
*Total: ${formatCurrency(total)}*

🚀 *Tipo:* ${deliveryMode === 'delivery' ? 'Entrega a domicilio' : 'Recogida en tienda'}
💳 *Pago:* ${formData.paymentMethod === 'cash' ? 'Efectivo' : 'Tarjeta'}

${formData.specialInstructions ? `📝 *Instrucciones:* ${formData.specialInstructions}` : ''}

¡Gracias por tu pedido! 🙏`;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Generate order number
      const orderNumber = generateOrderNumber();

      // Save order to localStorage
      const orderData = {
        orderNumber,
        timestamp: new Date().toISOString(),
        customer: formData.customer,
        phone: formData.phone,
        deliveryMode,
        address: deliveryMode === 'delivery' ? {
          street: formData.street,
          houseNumber: formData.houseNumber,
          postalCode: formData.postalCode,
          city: formData.city
        } : null,
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

      // Save to localStorage
      const existingOrders = JSON.parse(localStorage.getItem('campusPizzaOrders') || '[]');
      existingOrders.push(orderData);
      localStorage.setItem('campusPizzaOrders', JSON.stringify(existingOrders));

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
    <div className="px-4 py-6 max-w-2xl mx-auto">
      <div className="mb-4">
        <LinkButton to="/menu">&larr; {t('common.backToMenu', { default: 'Back to Menu' })}</LinkButton>
      </div>

      <h2 className="mb-8 text-xl font-semibold">
        {deliveryMode === 'delivery' 
          ? t('checkout.titleDelivery', { default: 'Checkout - Delivery' })
          : t('checkout.titleCollection', { default: 'Checkout - Collection' })
        }
      </h2>

      {/* Order Summary */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-3">
          {t('checkout.orderSummary', { default: 'Order Summary' })}
        </h3>
        <div className="space-y-2">
          {cart.map((item: any) => (
            <div key={`${item.pizzaId}-${item.size}`} className="flex justify-between text-sm">
              <span className="text-blue-800">
                {item.quantity}x {item.name} 
                {item.size && item.size !== 'standard' && ` (${item.size})`}
              </span>
              <span className="font-medium text-blue-900">{formatCurrency(item.totalPrice)}</span>
            </div>
          ))}
          
          {/* Pricing breakdown */}
          <div className="border-t border-blue-300 pt-2 space-y-1">
            <div className="flex justify-between text-sm text-blue-700">
              <span>Subtotal:</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            {deliveryMode === 'delivery' && (
              <div className="flex justify-between text-sm text-blue-700">
                <span>Delivery fee:</span>
                <span>{formatCurrency(deliveryFee)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm text-blue-700">
              <span>Service fee (2.5%):</span>
              <span>{formatCurrency(finalServiceFee)}</span>
            </div>
            <div className="flex justify-between font-semibold text-blue-900 border-t border-blue-300 pt-1">
              <span>Total:</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer Information */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-4">
            {t('checkout.customerInfo', { default: 'Customer Information' })}
          </h3>
          
          {/* Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('checkout.name', { default: 'Full Name' })} *
            </label>
            <input
              type="text"
              value={formData.customer}
              onChange={(e) => handleInputChange('customer', e.target.value)}
              className={`input w-full ${errors.customer ? 'border-red-500' : ''}`}
              placeholder={t('checkout.namePlaceholder', { default: 'Enter your full name' })}
            />
            {errors.customer && (
              <p className="mt-1 text-sm text-red-600">{errors.customer}</p>
            )}
          </div>

          {/* Phone */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('checkout.phone', { default: 'Phone Number' })} *
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className={`input w-full ${errors.phone ? 'border-red-500' : ''}`}
              placeholder={t('checkout.phonePlaceholder', { default: '+49 xxx xxx xxxx' })}
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
            )}
          </div>
        </div>

        {/* Delivery Address (only for delivery) */}
        {deliveryMode === 'delivery' && (
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <h3 className="font-semibold text-yellow-900 mb-4">
              {t('checkout.deliveryAddress', { default: 'Delivery Address' })}
            </h3>
            
            {/* Street */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-yellow-800 mb-2">
                {t('checkout.street', { default: 'Street Name' })} *
              </label>
              <input
                type="text"
                value={formData.street}
                onChange={(e) => handleInputChange('street', e.target.value)}
                className={`input w-full ${errors.street ? 'border-red-500' : ''}`}
                placeholder={t('checkout.streetPlaceholder', { default: 'e.g. Musterstraße' })}
              />
              {errors.street && (
                <p className="mt-1 text-sm text-red-600">{errors.street}</p>
              )}
            </div>

            {/* House Number */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-yellow-800 mb-2">
                {t('checkout.houseNumber', { default: 'House Number' })} *
              </label>
              <input
                type="text"
                value={formData.houseNumber}
                onChange={(e) => handleInputChange('houseNumber', e.target.value)}
                className={`input w-full ${errors.houseNumber ? 'border-red-500' : ''}`}
                placeholder={t('checkout.houseNumberPlaceholder', { default: 'e.g. 123a' })}
              />
              {errors.houseNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.houseNumber}</p>
              )}
            </div>

            {/* Postal Code and City */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-yellow-800 mb-2">
                  {t('checkout.postalCode', { default: 'Postal Code' })} *
                </label>
                <input
                  type="text"
                  value={formData.postalCode}
                  onChange={(e) => handleInputChange('postalCode', e.target.value)}
                  className={`input w-full ${errors.postalCode ? 'border-red-500' : ''}`}
                  placeholder="44149"
                  maxLength={5}
                />
                {errors.postalCode && (
                  <p className="mt-1 text-sm text-red-600">{errors.postalCode}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-yellow-800 mb-2">
                  {t('checkout.city', { default: 'City' })}
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className="input w-full"
                  readOnly
                />
              </div>
            </div>

            {/* Delivery zones info */}
            <div className="text-sm text-yellow-700 bg-yellow-100 p-3 rounded">
              <p className="font-medium mb-1">
                {t('checkout.deliveryZones', { default: 'Delivery Zones:' })}
              </p>
              <p>44149, 44147, 44227, 44225, 44137, 44135</p>
            </div>
          </div>
        )}

        {/* Payment Method */}
        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <h3 className="font-semibold text-green-900 mb-4">
            {t('checkout.paymentMethod', { default: 'Payment Method' })}
          </h3>
          
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="radio"
                value="cash"
                checked={formData.paymentMethod === 'cash'}
                onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                className="mr-3"
              />
              <span className="text-green-800">
                {deliveryMode === 'delivery' 
                  ? t('checkout.cashOnDelivery', { default: 'Cash on delivery' })
                  : t('checkout.cashOnPickup', { default: 'Cash on pickup' })
                }
              </span>
            </label>
            
            <label className="flex items-center">
              <input
                type="radio"
                value="card"
                checked={formData.paymentMethod === 'card'}
                onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                className="mr-3"
              />
              <span className="text-green-800">
                {deliveryMode === 'delivery' 
                  ? t('checkout.cardOnDelivery', { default: 'Card on delivery' })
                  : t('checkout.cardOnPickup', { default: 'Card on pickup' })
                }
              </span>
            </label>
          </div>
        </div>

        {/* Special Instructions */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-4">
            {t('checkout.specialInstructions', { default: 'Special Instructions' })} 
            <span className="text-gray-500 font-normal"> ({t('common.optional', { default: 'optional' })})</span>
          </h3>
          
          <textarea
            value={formData.specialInstructions}
            onChange={(e) => handleInputChange('specialInstructions', e.target.value)}
            className="input w-full h-20 resize-none"
            placeholder={t('checkout.specialInstructionsPlaceholder', { 
              default: 'Ring doorbell, leave at door, etc.' 
            })}
            maxLength={200}
          />
          <p className="mt-1 text-xs text-gray-500">
            {formData.specialInstructions?.length || 0}/200
          </p>
        </div>

        {/* Submit Button */}
        <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-orange-800 font-medium">
                {t('checkout.finalTotal', { default: 'Final Total' })}
              </span>
              <span className="text-orange-900 font-bold text-lg">{formatCurrency(total)}</span>
            </div>
          </div>          <Button 
            type="primary" 
            disabled={isSubmitting}
          >
            {isSubmitting
              ? t('common.processing', { default: 'Processing...' })
              : t('checkout.placeOrder', { default: 'Place Order via WhatsApp' })
            }
          </Button>

          <p className="mt-3 text-xs text-center text-orange-600">
            {t('checkout.whatsappNote', { 
              default: 'Your order will be sent via WhatsApp to our restaurant' 
            })}
          </p>
        </div>
      </form>
    </div>
  );
}

export default CheckoutForm;
