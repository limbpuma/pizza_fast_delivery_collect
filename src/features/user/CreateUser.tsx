import { useState } from "react";
import Button from "../../ui/Button";
import { useDispatch } from "react-redux";
import { updateName, updatePostalCode } from "./userSlice";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { isValidDeliveryZone } from "../../utils/deliveryZones";

function CreateUser() {
  const { t } = useTranslation();
  const [username, setUsername] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [deliveryError, setDeliveryError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!username || !postalCode) return;

    // Validate delivery zone
    if (!isValidDeliveryZone(postalCode)) {
      setDeliveryError(t('user.deliveryError'));
      return;
    }

    // Clear any previous error
    setDeliveryError("");
    
    // Save user data and navigate
    dispatch(updateName(username));
    dispatch(updatePostalCode(postalCode));
    navigate("/menu");
  }
  return (
    <form onSubmit={handleSubmit}>
      <p className="mb-4 text-sm text-stone-600 md:text-base">
        {t('user.welcome')}
      </p>

      <div className="space-y-4 mb-8">
        <input
          type="text"
          placeholder={t('user.namePlaceholder')}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="input w-72"
          required
        />
        
        <input
          type="text"
          placeholder={t('user.postalCodePlaceholder')}
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
          className="input w-72"
          maxLength={5}
          pattern="[0-9]{5}"
          required
        />
      </div>

      {deliveryError && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
          <p className="text-sm">{deliveryError}</p>
          <p className="text-xs mt-2 text-red-600">
            {t('user.deliveryZoneInfo')}
          </p>
        </div>
      )}

      {username !== "" && postalCode !== "" && !deliveryError && (
        <div>
          <Button type="primary">{t('user.continueButton')}</Button>
        </div>
      )}
    </form>
  );
}

export default CreateUser;
