import { useDispatch } from "react-redux";
import Button from "../../ui/Button";
import { deleteSpecificItem } from "./cartSlice";
import { useTranslation } from 'react-i18next';

interface DeleteItemProps {
  pizzaId: number;
  size?: string;
  compact?: boolean;
}

function DeleteItem({ pizzaId, size, compact = false }: DeleteItemProps) {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const handleDelete = () => {
    dispatch(deleteSpecificItem({ pizzaId, size }));
  };

  if (compact) {
    return (
      <button
        onClick={handleDelete}
        className="w-6 h-6 bg-red-100 hover:bg-red-200 text-red-600 rounded-full flex items-center justify-center transition-colors"
        aria-label={t('buttons.delete')}
      >
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    );
  }

  return (
    <Button type="small" onClick={handleDelete}>
      {t('buttons.delete')}
    </Button>
  );
}

export default DeleteItem;
