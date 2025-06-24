import { useSelector } from "react-redux";
import CreateUser from "../features/user/CreateUser";
import Button from "./Button";
import { useTranslation } from 'react-i18next';

function Home() {
  const { t } = useTranslation();
  const username = useSelector((state: any) => state.user.username);

  return (
    <div className="min-h-[calc(100vh-200px)] flex flex-col relative overflow-hidden">
      {/* Dynamic Background Gradient - Pure CSS for speed */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-orange-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      {/* Hero Section - Ultra lightweight */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          
          {/* Pizza Icon - Inline SVG for instant load */}
          <div className="mb-6 animate-bounce">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white text-4xl shadow-lg">
              🍕
            </div>
          </div>

          {/* Main Title with Dynamic Gradient */}
          <h1 className="mb-4 text-4xl sm:text-5xl md:text-6xl font-bold">
            <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
              {t('home.title')}
            </span>
          </h1>

          {/* Subtitle with border animation */}
          <p className="mb-8 text-lg sm:text-xl md:text-2xl text-gray-600 font-medium">
            <span className="border-r-2 border-yellow-500 pr-1 animate-pulse">
              {t('home.subtitle')}
            </span>
          </p>

          {/* Fast Features - Icons inline for speed */}
          <div className="mb-8 flex justify-center gap-6 text-sm sm:text-base flex-wrap">
            <div className="flex items-center gap-2 text-green-600 hover:scale-105 transition-transform">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">⚡</div>
              <span className="font-medium">15-30 min</span>
            </div>
            <div className="flex items-center gap-2 text-blue-600 hover:scale-105 transition-transform">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">🌿</div>
              <span className="font-medium">Fresh</span>
            </div>
            <div className="flex items-center gap-2 text-purple-600 hover:scale-105 transition-transform">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">⭐</div>
              <span className="font-medium">Quality</span>
            </div>
          </div>

          {/* User Input/CTA Section - Glass morphism effect */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            {username === "" ? (
              <CreateUser />
            ) : (
              <div className="space-y-4">
                <p className="text-gray-600 text-lg">
                  {t('user.greeting', { name: username })}
                </p>
                <Button to="/menu" type="primary">
                  <span className="flex items-center gap-2 justify-center">
                    <span>🚀</span>
                    {t('home.cta')}
                  </span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats - Minimal footer */}
      <div className="border-t border-gray-200/50 bg-white/70 backdrop-blur-sm py-4">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex justify-center gap-8 text-sm text-gray-600">
            <div className="text-center hover:text-yellow-600 transition-colors">
              <div className="font-bold text-xl">15-30</div>
              <div className="text-xs">Minuten</div>
            </div>
            <div className="text-center hover:text-green-600 transition-colors">
              <div className="font-bold text-xl">6</div>
              <div className="text-xs">PLZ Zonen</div>
            </div>
            <div className="text-center hover:text-blue-600 transition-colors">
              <div className="font-bold text-xl">100%</div>
              <div className="text-xs">Frisch</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
