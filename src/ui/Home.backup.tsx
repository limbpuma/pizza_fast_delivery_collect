import { useSelector } from "react-redux";
import CreateUser from "../features/user/CreateUser";
import Button from "./Button";
import { useTranslation } from 'react-i18next';

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
          </p>

          {/* Fast Features - Icon + Text */}
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
          </div>

          {/* User Input/CTA Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
            {username === "" ? (
              <CreateUser />
            ) : (
              <div className="space-y-4">
                <p className="text-gray-600">
                  {t('user.greeting', { name: username })}
                </p>
                <Button to="/menu" type="primary">
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                    {t('home.cta')}
                  </span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats - Minimal and Fast */}
      <div className="border-t border-gray-200 bg-gray-50 py-4">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex justify-center gap-8 text-sm text-gray-600">
            <div className="text-center">
              <div className="font-bold text-yellow-600">15-30</div>
              <div>{t('stats.minutes')}</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-green-600">6</div>
              <div>{t('stats.zones')}</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-blue-600">24/7</div>
              <div>{t('stats.service')}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
