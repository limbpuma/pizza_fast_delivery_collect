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
  restaurantName = "Restaurant CAMPUS – Die Pizza-Profis",
  rating = 4.6,
  reviewCount = 810,
  minOrderAmount = 12.00,
  deliveryFee = "0,99",
  deliveryTime = "25-40",
  heroImage = "/campus-restaurant/campus-image2.webp"
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
          </div>          {/* Promo banner and Menu Download */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Promo banner */}
            <div className="bg-yellow-100 border border-yellow-300 rounded-lg px-4 py-3 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-yellow-600">🎉</span>
                <span className="text-yellow-800 font-medium text-sm">
                  5% Rabatt auf alle Familien-Pizzen
                </span>
              </div>
            </div>

            {/* Menu Download Banner */}
            <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg px-4 py-3 flex-1">
              <div className="flex items-center gap-3">
                {/* Restaurant Image */}
                <div className="flex-shrink-0">
                  <img
                    src="/campus-restaurant/campus-image.webp"
                    alt={restaurantName}
                    className="w-12 h-12 rounded-lg object-cover border border-orange-200"
                  />
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-orange-800 font-medium text-sm truncate">
                    {t('restaurant.downloadMenu')}
                  </p>
                  <p className="text-orange-600 text-xs">
                    {t('restaurant.printable')}
                  </p>
                </div>
                
                {/* Download Button */}
                <a
                  href="/campus-restaurant/menu-campus.pdf"
                  download="Campus-Pizza-Menu.pdf"
                  className="flex items-center gap-1 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-medium rounded-md transition-colors duration-200 shadow-sm"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  PDF
                </a>
              </div>
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
                </h3>                <div className="bg-gray-100 rounded-lg overflow-hidden border shadow-sm">
                  {/* Google Maps Embed */}
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2360.866214663491!2d7.412926576469444!3d51.49926017181135!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47b919a92ab605d5%3A0xfaf398851fc5ea33!2sRestaurant%20Campus!5e1!3m2!1sen!2sde!4v1750446127784!5m2!1sen!2sde"
                    width="100%"
                    height="300"
                    style={{ border: 0 }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Restaurant CAMPUS Location"
                    className="w-full h-75"
                  />
                </div>                <div className="mt-3 text-sm text-gray-600">
                  <p><strong>{t('restaurant.address')}:</strong></p>
                  <p>Knappenstraße 46</p>
                  <p>44149 Dortmund, Deutschland</p>
                  
                  {/* Get Directions Button */}
                  <div className="mt-3">
                    <a
                      href="https://maps.app.goo.gl/jTLcQ6XSu4apoTb3A"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-md transition-colors duration-200 shadow-sm"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{t('restaurant.getDirections')}</span>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
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
                  </h3>                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>{t('restaurant.monday')}</span>
                      <span>11:00 - 21:30</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('restaurant.tuesday')}</span>
                      <span>11:00 - 21:30</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('restaurant.wednesday')}</span>
                      <span>11:00 - 21:30</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('restaurant.thursday')}</span>
                      <span>11:00 - 21:30</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('restaurant.friday')}</span>
                      <span>11:00 - 21:30</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('restaurant.saturday')}</span>
                      <span>11:00 - 21:30</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('restaurant.sunday')}</span>
                      <span>11:00 - 21:30</span>
                    </div>
                  </div>
                </div>

                {/* Contact info */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    {t('restaurant.contact')}
                  </h3>                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span>📞</span>
                      <span>0231 - 72 56 668</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>🌐</span>
                      <span>www.restaurant-campus.de</span>
                    </div>
                  </div>
                  
                  {/* Lieferando Button */}
                  <div className="mt-4">
                    <a
                      href="https://www.lieferando.de/en/menu/restaurant-campus-dortmund"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors duration-200"
                    >                      <span>🍕</span>
                      <span>{t('restaurant.orderOnLieferando')}</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
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
