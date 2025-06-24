import { useTranslation } from 'react-i18next';
import { DynamicFeature } from '../utils/socialProof';

interface DynamicFeaturesProps {
  features: DynamicFeature[];
  className?: string;
}

export function DynamicFeatures({ features, className = "" }: DynamicFeaturesProps) {
  const { t } = useTranslation();

  return (
    <div className={`flex flex-wrap sm:flex-nowrap justify-center gap-4 text-sm sm:text-base ${className}`}>
      {features.map((feature, index) => (
        <div key={index} className={`flex items-center gap-2 ${feature.color} transition-all duration-300`}>
          <span className="text-lg">{feature.icon}</span>
          <span>{t(feature.textKey)}</span>
        </div>
      ))}
    </div>
  );
}

export default DynamicFeatures;
