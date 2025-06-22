import { useTranslation } from 'react-i18next';

interface AllergensDisplayProps {
  allergens: string[];
  compact?: boolean;
}

function AllergensDisplay({ allergens, compact = false }: AllergensDisplayProps) {
  const { t } = useTranslation();

  // Function to get allergen description from translation
  const getAllergenDescription = (code: string): string => {
    try {
      return t(`allergene_legende.${code}`, { defaultValue: code });
    } catch {
      return code;
    }
  };

  if (!allergens.length) {
    return null;
  }

  if (compact) {
    return (
      <div className="flex items-center gap-1">
        <span className="text-xs text-red-600 font-medium">⚠️</span>
        <span className="text-xs text-red-600 font-medium">
          {allergens.map(code => getAllergenDescription(code)).join(', ')}
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
        {allergens.map((allergenCode, index) => {
          const description = getAllergenDescription(allergenCode);
          return (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-2 py-1 bg-red-50 border border-red-200 rounded-full text-xs text-red-700 font-medium"
              role="alert"
              aria-label={`Allergen: ${description}`}
            >
              <span className="text-sm" role="img" aria-hidden="true">
                ⚠️
              </span>
              {description}
            </span>
          );
        })}
      </div>
    </div>
  );
}

export default AllergensDisplay;
