import { useState } from "react";
import Button from "../../ui/Button";
import { useDispatch } from "react-redux";
import { updateName } from "./userSlice";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';

function CreateUser() {
  const { t } = useTranslation();
  const [username, setUsername] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!username) return;

    dispatch(updateName(username));
    navigate("/menu");
  }

  return (
    <form onSubmit={handleSubmit}>
      <p className="mb-4 text-sm text-stone-600 md:text-base">
        {t('user.welcome')}
      </p>

      <input
        type="text"
        placeholder={t('user.namePlaceholder')}
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="input mb-8 w-72"
      />

      {username !== "" && (
        <div>
          <Button type="primary">{t('user.continueButton')}</Button>
        </div>
      )}
    </form>
  );
}

export default CreateUser;
