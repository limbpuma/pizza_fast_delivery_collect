import { useSelector } from "react-redux";
import CreateUser from "../features/user/CreateUser";
import Button from "./Button";
import { useTranslation } from 'react-i18next';

function Home() {
  const { t } = useTranslation();
  const username = useSelector((state: any) => state.user.username);

  return (
    <div className="my-10 px-4 text-center sm:my-16">
      <h1 className="mb-8 text-xl font-semibold md:text-3xl">
        {t('home.title')}
        <br />
        <span className="text-yellow-500">
          {t('home.subtitle')}
        </span>
      </h1>
      {username === "" ? (
        <CreateUser />
      ) : (
        <Button to="/menu" type="primary">
          {t('home.cta')}, {username}
        </Button>
      )}
    </div>
  );
}

export default Home;
