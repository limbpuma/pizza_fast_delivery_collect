import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getSocialProofData, getDynamicFeatures, getContextualTrustMessage, getDynamicDeliveryTime } from '../utils/socialProof';

export function SocialProofDemo() {
  const { t } = useTranslation();
  const [data, setData] = useState(() => ({
    socialProof: getSocialProofData(),
    features: getDynamicFeatures(),
    trustMessage: getContextualTrustMessage(),
    deliveryTime: getDynamicDeliveryTime(),
  }));

  const [demoMode, setDemoMode] = useState(false);

  useEffect(() => {
    if (!demoMode) return;

    const interval = setInterval(() => {
      setData({
        socialProof: getSocialProofData(),
        features: getDynamicFeatures(),
        trustMessage: getContextualTrustMessage(),
        deliveryTime: getDynamicDeliveryTime(),
      });
    }, 2000); // Update every 2 seconds in demo mode

    return () => clearInterval(interval);
  }, [demoMode]);

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg p-4 shadow-lg max-w-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm">🔥 Social Proof Demo</h3>
        <button
          onClick={() => setDemoMode(!demoMode)}
          className={`px-2 py-1 rounded text-xs ${
            demoMode 
              ? 'bg-green-100 text-green-700' 
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          {demoMode ? 'Live' : 'Start'}
        </button>
      </div>
      
      <div className="space-y-2 text-xs">
        <div>
          <strong>Ordering:</strong> {data.socialProof.orderingCount} people
        </div>
        <div>
          <strong>Rating:</strong> {data.socialProof.rating}★ ({data.socialProof.reviewCount}+)
        </div>
        <div>
          <strong>Delivery:</strong> {data.deliveryTime.message}
        </div>
        <div>
          <strong>Features:</strong>
          <div className="flex gap-1 mt-1">
            {data.features.map((feature, i) => (
              <span key={i} className="text-xs">
                {feature.icon}
              </span>
            ))}
          </div>
        </div>
        {data.socialProof.urgencyMessage && (
          <div className="bg-orange-50 p-2 rounded">
            <strong>Urgency:</strong> {
              data.socialProof.urgencyMessage.count 
                ? t(data.socialProof.urgencyMessage.key, { count: data.socialProof.urgencyMessage.count })
                : t(data.socialProof.urgencyMessage.key)
            }
          </div>
        )}
        {data.trustMessage.specialOfferKey && (
          <div className="bg-blue-50 p-2 rounded">
            <strong>Special:</strong> {t(data.trustMessage.specialOfferKey)}
          </div>
        )}
      </div>
    </div>
  );
}

export default SocialProofDemo;
