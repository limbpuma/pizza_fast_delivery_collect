import { useTranslation } from 'react-i18next';

interface AdditivesDisplayProps {
  additives: string[];
  compact?: boolean;
}

function AdditivesDisplay({ additives, compact = false }: AdditivesDisplayProps) {
  const { t } = useTranslation();

  // Function to get additive description from translation
  const getAdditiveDescription = (code: string): string => {
    try {
      return t(`zusatzstoffe_legende.${code}`, { defaultValue: code });
    } catch {
      return code;
    }
  };

  if (!additives.length) {
    return null;
  }

  if (compact) {
    return (
      <div className="flex items-center gap-1">
        <span className="text-xs text-orange-600 font-medium">🧪</span>
        <span className="text-xs text-orange-600 font-medium">
          {additives.map(code => getAdditiveDescription(code)).join(', ')}
        </span>
      </div>
    );
  }

  return (
    <div className="additives-display">
      <div className="flex items-center gap-1 mb-1">
        <span className="text-xs font-medium text-orange-700">
          {t('menu.additives', { defaultValue: 'Zusatzstoffe' })}
        </span>
      </div>
      
      <div className="flex flex-wrap gap-1">
        {additives.map((additiveCode, index) => {
          const description = getAdditiveDescription(additiveCode);
          return (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-2 py-1 bg-orange-50 border border-orange-200 rounded-full text-xs text-orange-700 font-medium"
              role="alert"
              aria-label={`Additive: ${description}`}
            >
              <span className="text-sm" role="img" aria-hidden="true">
                🧪
              </span>
              {description}
            </span>
          );
        })}
      </div>
    </div>
  );
}

export default AdditivesDisplay;
