import { useTranslation } from 'react-i18next';

interface UrgencyMessageProps {
  messageKey?: string;
  className?: string;
}

export function UrgencyMessage({ messageKey, className = "" }: UrgencyMessageProps) {
  const { t } = useTranslation();

  if (!messageKey) return null;

  // Extract count if present in the key
  const countMatch = messageKey.match(/{{count}}_(\d+)/);
  const actualKey = messageKey.replace(/_\d+/, '');
  const count = countMatch ? parseInt(countMatch[1]) : undefined;

  return (
    <div className={`mt-2 text-center ${className}`}>
      <span className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
        🔥 {count ? t(actualKey, { count }) : t(actualKey)}
      </span>
    </div>
  );
}

export default UrgencyMessage;
