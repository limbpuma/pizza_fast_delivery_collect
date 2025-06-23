import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  getRestaurantStatus, 
  minutesToHoursMinutes, 
  getRandomUrgencyMessage, 
  shouldShowUrgencyMessage,
  getSpecialMessage,
  type RestaurantStatus 
} from '../utils/restaurantHours';

interface RestaurantStatusBannerProps {
  className?: string;
}

function RestaurantStatusBanner({ className = "" }: RestaurantStatusBannerProps) {
  const { t } = useTranslation();
  const [status, setStatus] = useState<RestaurantStatus | null>(null);
  const [urgencyMessage, setUrgencyMessage] = useState<string>("");
  const [specialMessage, setSpecialMessage] = useState<string | null>(null);
  const [showUrgency, setShowUrgency] = useState<boolean>(false);
  const [showSpecial, setShowSpecial] = useState<boolean>(false);

  useEffect(() => {
    const updateStatus = () => {
      const currentStatus = getRestaurantStatus();
      setStatus(currentStatus);
      
      // Update special message (weekend/holiday offers)
      const special = getSpecialMessage();
      if (special) {
        setSpecialMessage(special);
        setShowSpecial(true);
        setShowUrgency(false); // Show special message instead of urgency
      } else {
        setShowSpecial(false);
        
        // Update urgency message with dynamic chance
        if (currentStatus.isOpen && shouldShowUrgencyMessage(currentStatus)) {
          setUrgencyMessage(getRandomUrgencyMessage());
          setShowUrgency(true);
        } else {
          setShowUrgency(false);
        }
      }
    };

    // Update immediately
    updateStatus();

    // Update every minute
    const interval = setInterval(updateStatus, 60000);

    return () => clearInterval(interval);
  }, []);

  if (!status) {
    return null;
  }

  // If restaurant is closed, show simple closed message
  if (!status.isOpen) {
    const { hours, minutes } = minutesToHoursMinutes(status.timeUntilOpening);
    return (
      <div className={`bg-gray-800 text-white py-2 px-4 text-center text-sm ${className}`}>
        <span className="font-medium">
          🕐 {t('restaurant.closed')} • {t('restaurant.opensIn', { 
            hours: hours,
            minutes: minutes 
          })} ({t('restaurant.dailyHours')}: {status.openingTime} - {status.closingTime})
        </span>
      </div>
    );
  }

  // Restaurant is open - show dynamic status
  const { hours, minutes } = minutesToHoursMinutes(status.timeUntilClosing);
  const isClosingSoon = status.status === 'closing_soon';

  return (
    <div className={`${isClosingSoon ? 'bg-red-600' : 'bg-green-600'} text-white py-2 px-4 ${className}`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm">
          {/* Kitchen Timer */}
          <div className="flex items-center gap-2">
            <span className={`animate-pulse ${isClosingSoon ? 'text-yellow-300' : 'text-green-200'}`}>
              {isClosingSoon ? '⚠️' : '✅'}
            </span>
            <span className="font-medium">
              {isClosingSoon 
                ? t('restaurant.kitchenClosingSoon', { hours, minutes })
                : t('restaurant.kitchenClosesIn', { hours, minutes })
              }
            </span>
          </div>

          {/* Special Message or Urgency Message */}
          {showSpecial && specialMessage && (
            <div className="flex items-center gap-2 text-center sm:text-right">
              <span className="animate-bounce">🎉</span>
              <span className="font-medium">{specialMessage}</span>
            </div>
          )}
          
          {showUrgency && !showSpecial && (
            <div className="flex items-center gap-2 text-center sm:text-right">
              <span className="animate-bounce">🔥</span>
              <span className="font-medium">{urgencyMessage}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RestaurantStatusBanner;
