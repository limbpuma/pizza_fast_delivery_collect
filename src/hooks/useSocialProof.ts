import { useState, useEffect } from 'react';
import { 
  getSocialProofData, 
  getDynamicFeatures, 
  getContextualTrustMessage,
  getDynamicDeliveryTime,
  SocialProofData,
  DynamicFeature 
} from '../utils/socialProof';

export interface UseSocialProofReturn {
  socialProof: SocialProofData;
  features: DynamicFeature[];  trustMessage: {
    customers: string;
    timeContextKey: string;
    specialOfferKey?: string;
  };
  deliveryTime: {
    estimatedMinutes: number;
    message: string;
    urgency: 'low' | 'medium' | 'high';
  };
  isLoading: boolean;
}

/**
 * Hook for managing dynamic social proof data
 * Updates every 2 minutes to keep content fresh
 */
export function useSocialProof(): UseSocialProofReturn {
  const [socialProof, setSocialProof] = useState<SocialProofData>(() => getSocialProofData());
  const [features, setFeatures] = useState<DynamicFeature[]>(() => getDynamicFeatures());
  const [trustMessage, setTrustMessage] = useState(() => getContextualTrustMessage());
  const [deliveryTime, setDeliveryTime] = useState(() => getDynamicDeliveryTime());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Update social proof data every 2 minutes
    const interval = setInterval(() => {
      setIsLoading(true);
      
      // Simulate slight loading delay for smooth transitions
      setTimeout(() => {
        setSocialProof(getSocialProofData());
        setFeatures(getDynamicFeatures());
        setTrustMessage(getContextualTrustMessage());
        setDeliveryTime(getDynamicDeliveryTime());
        setIsLoading(false);
      }, 200);
    }, 2 * 60 * 1000); // 2 minutes

    // Also update on component mount after a short delay
    const initialUpdate = setTimeout(() => {
      setSocialProof(getSocialProofData());
      setFeatures(getDynamicFeatures());
      setTrustMessage(getContextualTrustMessage());
      setDeliveryTime(getDynamicDeliveryTime());
    }, 1000);

    return () => {
      clearInterval(interval);
      clearTimeout(initialUpdate);
    };
  }, []);

  return {
    socialProof,
    features,
    trustMessage,
    deliveryTime,
    isLoading,
  };
}
