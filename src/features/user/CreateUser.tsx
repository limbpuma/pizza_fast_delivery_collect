import { useState } from "react";
import Button from "../../ui/Button";
import { useDispatch } from "react-redux";
import { updateName, updatePLZWithSession } from "./userSlice";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { validatePLZ } from "../../utils/deliveryZones";

function CreateUser() {
  const { t } = useTranslation();
  const [username, setUsername] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [deliveryError, setDeliveryError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    
    // Make name optional, default to "Guest" if empty
    const finalUsername = username.trim() || "Guest";
    
    if (!postalCode) return;

    // Validate PLZ using the enhanced validation
    const validation = validatePLZ(postalCode);
    
    if (!validation.isValid) {
      setDeliveryError(validation.error || t('user.deliveryError'));
      return;
    }

    // Clear any previous error
    setDeliveryError("");
    
    // Save user data using enhanced PLZ action and navigate
    dispatch(updateName(finalUsername));
    dispatch(updatePLZWithSession({ 
      plz: postalCode, 
      source: 'user_input' 
    }) as any);
    navigate("/menu");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {t('user.welcome')}
        </h2>
        <p className="text-sm text-gray-600">
          {t('user.subtitle')}
        </p>
      </div>

      <div className="space-y-4">        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('user.nameLabel')}
          </label>
          <input
            type="text"
            placeholder={t('user.namePlaceholder')}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
          />
        </div>
          <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('user.postalCodeLabel')}
          </label>
          <input
            type="text"
            placeholder={t('user.postalCodePlaceholder')}
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
            maxLength={5}
            pattern="[0-9]{5}"
            required
          />
          <p className="mt-1 text-xs text-gray-500">
            {t('user.deliveryAreas')}
          </p>
        </div>
      </div>

      {deliveryError && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          <p className="text-sm font-medium">{deliveryError}</p>
          <p className="text-xs mt-1 text-red-600">
            {t('user.deliveryZoneInfo')}
          </p>
        </div>
      )}      <div className="text-center">
        <Button type="primary" disabled={!postalCode || !!deliveryError}>
          <span className="flex items-center gap-2">
            <span>{t('user.startOrdering')}</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </span>
        </Button>
      </div>
    </form>
  );
}

export default CreateUser;
