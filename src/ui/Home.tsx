import { useSelector } from "react-redux";
import CreateUser from "../features/user/CreateUser";
import Button from "./Button";
import { useTranslation } from 'react-i18next';

function Home() {
  const { t } = useTranslation();
  const username = useSelector((state: any) => state.user.username);

  return (
    <div className="min-h-[calc(100vh-200px)] flex flex-col">
      {/* Hero Section - Ultra lightweight */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          
          {/* Dynamic Background Gradient - CSS only */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
            <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-orange-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
          </div>

          {/* Pizza Icon - Inline SVG for speed */}
          <div className="mb-6 animate-bounce">
            <svg className="w-20 h-20 mx-auto text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>

          {/* Main Title with Dynamic Gradient */}
          <h1 className="mb-4 text-4xl sm:text-5xl md:text-6xl font-bold">
            <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent animate-pulse">
              {t('home.title')}
            </span>
          </h1>

          {/* Subtitle with Typewriter Effect */}
          <p className="mb-8 text-lg sm:text-xl md:text-2xl text-gray-600 font-medium">
            <span className="border-r-2 border-yellow-500 pr-1 animate-pulse">
              {t('home.subtitle')}
            </span>
          </p>          {/* Fast Features - Icon + Text */}
          <div className="mb-8 flex justify-center gap-6 text-sm sm:text-base">
            <div className="flex items-center gap-2 text-green-600">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              <span>{t('features.fast')}</span>
            </div>
            <div className="flex items-center gap-2 text-blue-600">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"/>
              </svg>
              <span>{t('features.fresh')}</span>
            </div>
            <div className="flex items-center gap-2 text-purple-600">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span>{t('features.quality')}</span>
            </div>
          </div>          {/* Social Proof Banner */}
          <div className="mb-6 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl p-3 shadow-sm">
            <div className="flex items-center justify-center gap-4 text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <span className="text-green-500">👥</span>
                <span>{t('home.socialProof.ordering', { count: 12 })}</span>
              </div>
              <div className="w-px h-4 bg-gray-300"></div>
              <div className="flex items-center gap-2">
                <span className="text-yellow-500">⭐</span>
                <span>{t('home.socialProof.reviews', { rating: '4.8', count: 340 })}</span>
              </div>
            </div>
          </div>

          {/* User Input/CTA Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
            {username === "" ? (
              <CreateUser />            ) : (
              <div className="space-y-4">
                <p className="text-gray-600">
                  {t('user.greeting', { name: username })}
                </p>
                <Button to="/menu" type="primary">
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>                    <div className="flex flex-col items-start">
                      <span>{t('home.cta')}</span>
                      <span className="text-xs opacity-75">{t('home.deliveryTime', { minutes: 25 })}</span>
                    </div>
                  </span>
                </Button>
              </div>
            )}          </div>
        </div>
      </div>      {/* How It Works Section */}
      <div className="bg-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            🍕 {t('home.howItWorks.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">👤</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{t('home.howItWorks.step1.title')}</h3>
              <p className="text-sm text-gray-600">{t('home.howItWorks.step1.description')}</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🍕</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{t('home.howItWorks.step2.title')}</h3>
              <p className="text-sm text-gray-600">{t('home.howItWorks.step2.description')}</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{t('home.howItWorks.step3.title')}</h3>
              <p className="text-sm text-gray-600">{t('home.howItWorks.step3.description')}</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🚚</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{t('home.howItWorks.step4.title')}</h3>
              <p className="text-sm text-gray-600">{t('home.howItWorks.step4.description')}</p>
            </div>
          </div>
        </div>
      </div>      {/* FAQ Section */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            ❓ {t('home.faq.title')}
          </h2>          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">💳 {t('home.faq.question1.q')}</h3>
              <p className="text-gray-700 text-sm">{t('home.faq.question1.a')}</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">🚚 {t('home.faq.question2.q')}</h3>
              <p className="text-gray-700 text-sm">{t('home.faq.question2.a')}</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">⏰ {t('home.faq.question3.q')}</h3>
              <p className="text-gray-700 text-sm">{t('home.faq.question3.a')}</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">📱 {t('home.faq.question4.q')}</h3>
              <p className="text-gray-700 text-sm">{t('home.faq.question4.a')}</p>
            </div>
          </div></div>
      </div>

      {/* Trust & Testimonials Section */}
      <div className="bg-white py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">            <div className="text-center p-4">
              <div className="mb-3">
                <span className="text-yellow-400 text-2xl">⭐⭐⭐⭐⭐</span>
              </div>
              <p className="text-sm text-gray-700 italic mb-2">"{t('home.testimonials.customer1.text')}"</p>
              <p className="text-xs text-gray-500">- {t('home.testimonials.customer1.name')}</p>
            </div>            <div className="text-center p-4">
              <div className="mb-3">
                <span className="text-yellow-400 text-2xl">⭐⭐⭐⭐⭐</span>
              </div>
              <p className="text-sm text-gray-700 italic mb-2">"{t('home.testimonials.customer2.text')}"</p>
              <p className="text-xs text-gray-500">- {t('home.testimonials.customer2.name')}</p>
            </div>            <div className="text-center p-4">
              <div className="mb-3">
                <span className="text-yellow-400 text-2xl">⭐⭐⭐⭐⭐</span>
              </div>
              <p className="text-sm text-gray-700 italic mb-2">"{t('home.testimonials.customer3.text')}"</p>
              <p className="text-xs text-gray-500">- {t('home.testimonials.customer3.name')}</p>
            </div>
          </div>
            {/* Trust Badges */}
          <div className="mt-8 flex items-center justify-center gap-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span className="text-green-500">✅</span>
              <span>{t('home.trust.badges.customers', { count: 340 })}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-blue-500">🔒</span>
              <span>{t('home.trust.badges.secure')}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-orange-500">🚚</span>
              <span>{t('home.trust.badges.fresh')}</span>
            </div>
          </div>
        </div>
      </div>      {/* Performance Stats - Enhanced Design */}
      <div className="bg-gradient-to-r from-orange-50 via-yellow-50 to-orange-50 border-t border-orange-200 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Delivery Time */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-orange-100 hover:shadow-md transition-shadow text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-2xl font-bold text-yellow-600 mb-1">15-30</div>
              <div className="text-sm text-gray-600 font-medium">{t('stats.minutes')}</div>
              <div className="text-xs text-gray-500 mt-1">⚡ {t('stats.guaranteed', { default: 'Guaranteed fast' })}</div>
            </div>

            {/* Delivery Zones */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-green-100 hover:shadow-md transition-shadow text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="text-2xl font-bold text-green-600 mb-1">6</div>
              <div className="text-sm text-gray-600 font-medium">{t('stats.zones')}</div>
              <div className="text-xs text-gray-500 mt-1">🚚 {t('stats.coverage', { default: 'Dortmund coverage' })}</div>
            </div>

            {/* Service Availability */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-100 hover:shadow-md transition-shadow text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="text-2xl font-bold text-blue-600 mb-1">24/7</div>
              <div className="text-sm text-gray-600 font-medium">{t('stats.service')}</div>
              <div className="text-xs text-gray-500 mt-1">🍕 {t('stats.available', { default: 'Always available' })}</div>
            </div>
          </div>

          {/* Bottom CTA Bar */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              🏆 {t('stats.bottomCta', { default: 'Join 340+ satisfied customers in Dortmund' })}
            </p>
          </div>        </div>
      </div>
    </div>
  );
}

export default Home;
