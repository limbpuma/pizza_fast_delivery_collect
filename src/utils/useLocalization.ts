import { useTranslation } from 'react-i18next';
import { formatGermanCurrency, formatGermanDate, calcGermanDeliveryTime } from './germanHelpers';
import { formatCurrency } from './helpers';

export function useLocalization() {
  const { t, i18n } = useTranslation();
  const isGerman = i18n.language === 'de';

  const formatLocalizedCurrency = (value: number): string => {
    return isGerman ? formatGermanCurrency(value) : formatCurrency(value);
  };

  const formatLocalizedDate = (dateStr: string): string => {
    return isGerman ? formatGermanDate(dateStr) : new Date(dateStr).toLocaleString('en-US');
  };

  const calcLocalizedDeliveryTime = (estimatedDelivery: string): string => {
    return isGerman ? calcGermanDeliveryTime(estimatedDelivery) : 
      `${Math.ceil((new Date(estimatedDelivery).getTime() - new Date().getTime()) / 60000)} minutes left`;
  };

  return {
    t,
    i18n,
    isGerman,
    formatLocalizedCurrency,
    formatLocalizedDate,
    calcLocalizedDeliveryTime,
  };
}
