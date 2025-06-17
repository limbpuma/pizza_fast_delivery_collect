import { useDispatch } from "react-redux";
import Button from "../../ui/Button";
import { deleteSpecificItem } from "./cartSlice";
import { useTranslation } from 'react-i18next';

function DeleteItem({ pizzaId, size }: { pizzaId: number; size?: string }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const handleDelete = () => {
    dispatch(deleteSpecificItem({ pizzaId, size }));
  };

  return (
    <Button type="small" onClick={handleDelete}>
      {t('buttons.delete')}
    </Button>
  );
}

export default DeleteItem;
