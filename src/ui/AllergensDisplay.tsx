import { useTranslation } from 'react-i18next';
import { getAllergenIcon } from '../data/germanPizzaInfo';

interface AllergensDisplayProps {
  allergens: string[];
  compact?: boolean;
}

function AllergensDisplay({ allergens, compact = false }: AllergensDisplayProps) {
  const { t } = useTranslation();

  if (!allergens.length) {
    return null;
  }

  if (compact) {
    return (
      <div className="flex items-center gap-1">
        <span className="text-xs text-red-600 font-medium">⚠️</span>
        <span className="text-xs text-red-600 font-medium">
          {allergens.join(', ')}
        </span>
      </div>
    );
  }

  return (
    <div className="allergens-display">
      <div className="flex items-center gap-1 mb-1">
        <span className="text-xs font-medium text-red-700">
          {t('menu.allergens')}
        </span>
      </div>
      
      <div className="flex flex-wrap gap-1">
        {allergens.map((allergen, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-1 px-2 py-1 bg-red-50 border border-red-200 rounded-full text-xs text-red-700 font-medium"
            role="alert"
            aria-label={`Allergen: ${allergen}`}
          >
            <span className="text-sm" role="img" aria-hidden="true">
              {getAllergenIcon(allergen)}
            </span>
            {allergen}
          </span>
        ))}
      </div>
    </div>
  );
}

export default AllergensDisplay;
