import { useDispatch } from "react-redux";
import Button from "../../ui/Button";
import { deleteItem } from "./cartSlice";
import { useTranslation } from 'react-i18next';

function DeleteItem({ pizzaId }: { pizzaId: number }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  return (
    <Button type="small" onClick={() => dispatch(deleteItem(pizzaId))}>
      {t('buttons.delete')}
    </Button>
  );
}

export default DeleteItem;
