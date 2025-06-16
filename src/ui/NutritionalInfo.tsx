import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GermanPizzaInfo } from '../data/germanPizzaInfo';

interface NutritionalInfoProps {
  pizzaInfo: GermanPizzaInfo;
  isExpanded?: boolean;
}

function NutritionalInfo({ pizzaInfo, isExpanded = false }: NutritionalInfoProps) {
  const { t } = useTranslation();
  const [showDetails, setShowDetails] = useState(isExpanded);

  const { nutritionalInfo } = pizzaInfo;

  return (
    <div className="nutritional-info">
      {/* Toggle Button */}
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="flex items-center gap-2 text-xs text-blue-600 hover:text-blue-800 transition-colors"
        aria-expanded={showDetails}
      >
        <svg 
          className={`w-4 h-4 transition-transform ${showDetails ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
        {showDetails ? t('menu.hideNutrition') : t('menu.showNutrition')}
      </button>

      {/* Expanded Nutritional Details */}
      {showDetails && (
        <div className="mt-2 p-3 bg-gray-50 rounded-lg border">
          <h4 className="text-xs font-semibold text-gray-700 mb-2">
            {t('menu.nutritionalInfo')} {t('menu.per100g')}
          </h4>
          
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-600">Kalorien:</span>
              <span className="font-medium">{nutritionalInfo.calories} kcal</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">{t('menu.fats', { value: '' }).replace(': g', '')}:</span>
              <span className="font-medium">{nutritionalInfo.fats}g</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">{t('menu.carbs', { value: '' }).replace(': g', '')}:</span>
              <span className="font-medium">{nutritionalInfo.carbs}g</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">{t('menu.proteins', { value: '' }).replace(': g', '')}:</span>
              <span className="font-medium">{nutritionalInfo.proteins}g</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">{t('menu.salt', { value: '' }).replace(': g', '')}:</span>
              <span className="font-medium">{nutritionalInfo.salt}g</span>
            </div>
            
            <div className="flex justify-between font-semibold text-blue-600">
              <span>{t('menu.perPizza')}:</span>
              <span>{nutritionalInfo.caloriesPerPizza} kcal</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NutritionalInfo;
