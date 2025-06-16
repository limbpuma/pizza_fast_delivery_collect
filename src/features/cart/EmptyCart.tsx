import LinkButton from "../../ui/LinkButton";
import { useTranslation } from 'react-i18next';

function EmptyCart() {
  const { t } = useTranslation();
  
  return (
    <div className="px-4 py-3">
      <LinkButton to="/menu">&larr; {t('cart.empty.backToMenu')}</LinkButton>

      <p className="font-semibold mt-7">
        {t('cart.empty.title')}
      </p>
    </div>
  );
}

export default EmptyCart;
