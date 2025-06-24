import { useSelector } from "react-redux";
import { useTranslation } from 'react-i18next';

function Username() {
  const { t } = useTranslation();
  const username = useSelector((state: any) => state.user.username);

  if (!username) return null;
  return (
    <div className=" text-sm font-semibold hidden md:block">
      {t('user.greeting', { name: username })}
    </div>
  );
}

export default Username;
