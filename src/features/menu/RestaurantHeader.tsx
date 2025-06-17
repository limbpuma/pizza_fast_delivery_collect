import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface RestaurantHeaderProps {
  restaurantName?: string;
  rating?: number;
  reviewCount?: number;
  minOrderAmount?: number;
  deliveryFee?: string;
  deliveryTime?: string;
  heroImage?: string;
}

function RestaurantHeader({
  restaurantName = "Campus Pizza Restaurant",
  rating = 4.6,
  reviewCount = 810,
  minOrderAmount = 12.00,
  deliveryFee = "0,99",
  deliveryTime = "25-40",
  heroImage = "/images/restaurant-hero.svg"
}: RestaurantHeaderProps) {
  const { t } = useTranslation();
  const [showAboutModal, setShowAboutModal] = useState(false);

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <>
        {[...Array(fullStars)].map((_, i) => (
          <span key={`full-${i}`} className="text-yellow-400">★</span>
        ))}
        {hasHalfStar && <span className="text-yellow-400">☆</span>}
        {[...Array(emptyStars)].map((_, i) => (
          <span key={`empty-${i}`} className="text-gray-300">★</span>
        ))}
      </>
    );
  };

  return (
    <>
      {/* Hero Image Section */}
      <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
        <img
          src={heroImage}
          alt={restaurantName}
          className="w-full h-full object-cover"
        />
        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Restaurant logo/badge (optional) */}
        <div className="absolute bottom-4 left-4 bg-white rounded-lg p-2 shadow-lg">
          <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">🍕</span>
          </div>
        </div>
      </div>

      {/* Restaurant Information Section */}
      <div className="bg-white px-4 py-6 shadow-sm">
        <div className="max-w-6xl mx-auto">
          {/* Header with name and About button */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {restaurantName}
              </h1>
              
              {/* Rating and reviews */}
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center gap-1">
                  {renderStars(rating)}
                  <span className="ml-2 font-semibold text-gray-900">
                    {rating.toFixed(1)}
                  </span>
                  <span className="text-gray-600">
                    ({reviewCount.toLocaleString()}+)
                  </span>
                </div>
              </div>

              {/* Delivery info */}
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <span className="text-gray-500">💵</span>
                  <span>
                    {t('restaurant.minOrder')} {minOrderAmount.toFixed(2)} €
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-gray-500">🚚</span>
                  <span>{deliveryFee} €</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-gray-500">⏱️</span>
                  <span>{deliveryTime} min</span>
                </div>
              </div>
            </div>

            {/* About Us button */}
            <button
              onClick={() => setShowAboutModal(true)}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors bg-gray-100 hover:bg-gray-200 rounded-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">{t('restaurant.aboutUs')}</span>
            </button>
          </div>

          {/* Promo banner (if any) */}
          <div className="bg-yellow-100 border border-yellow-300 rounded-lg px-4 py-3 inline-block">
            <div className="flex items-center gap-2">
              <span className="text-yellow-600">🎉</span>
              <span className="text-yellow-800 font-medium text-sm">
                5% Rabatt auf alle Familien-Pizzen
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* About Modal */}
      {showAboutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setShowAboutModal(false)}
          />
          
          {/* Modal content */}
          <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {t('restaurant.aboutUs')}
              </h2>
              <button
                onClick={() => setShowAboutModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal body */}
            <div className="p-6">
              {/* Map placeholder */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  {t('restaurant.location')}
                </h3>
                <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center border">
                  <div className="text-center text-gray-600">
                    <div className="text-4xl mb-2">🗺️</div>
                    <p className="text-sm">
                      Interactive map would be integrated here<br/>
                      (Google Maps / OpenStreetMap)
                    </p>
                  </div>
                </div>
                <div className="mt-3 text-sm text-gray-600">
                  <p><strong>{t('restaurant.address')}:</strong></p>
                  <p>Campus Straße 123</p>
                  <p>44149 Dortmund, Deutschland</p>
                </div>
              </div>

              {/* Business information */}
              <div className="space-y-6">
                {/* About section */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    {t('restaurant.aboutTitle')}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {t('restaurant.aboutDescription')}
                  </p>
                </div>

                {/* Delivery times */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    {t('restaurant.deliveryTimes')}
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>{t('restaurant.monday')}</span>
                      <span>10:00 - 23:30</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('restaurant.tuesday')}</span>
                      <span>10:00 - 23:30</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('restaurant.wednesday')}</span>
                      <span>10:00 - 23:30</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('restaurant.thursday')}</span>
                      <span>10:00 - 23:30</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('restaurant.friday')}</span>
                      <span>10:00 - 01:30</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('restaurant.saturday')}</span>
                      <span>10:00 - 01:30</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('restaurant.sunday')}</span>
                      <span>12:00 - 23:30</span>
                    </div>
                  </div>
                </div>

                {/* Contact info */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    {t('restaurant.contact')}
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span>📞</span>
                      <span>+49 231 123 4567</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>✉️</span>
                      <span>info@campuspizza.de</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>🌐</span>
                      <span>www.campuspizza.de</span>
                    </div>
                  </div>
                </div>

                {/* Delivery info */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    {t('restaurant.deliveryInfo')}
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p><strong>{t('restaurant.minOrderAmount')}:</strong> {minOrderAmount.toFixed(2)} €</p>
                    <p><strong>{t('restaurant.deliveryFee')}:</strong> {deliveryFee} €</p>
                    <p><strong>{t('restaurant.deliveryTime')}:</strong> {deliveryTime} {t('restaurant.minutes')}</p>
                    <p><strong>{t('restaurant.paymentMethods')}:</strong> {t('restaurant.acceptedPayments')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default RestaurantHeader;
