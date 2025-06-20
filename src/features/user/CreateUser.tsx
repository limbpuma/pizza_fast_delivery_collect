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
    
    // Make name optional, default to "Guest" if empty
    const finalUsername = username.trim() || "Guest";
    
    if (!postalCode) return;

    // Validate delivery zone
    if (!isValidDeliveryZone(postalCode)) {
      setDeliveryError(t('user.deliveryError'));
      return;
    }

    // Clear any previous error
    setDeliveryError("");
    
    // Save user data and navigate
    dispatch(updateName(finalUsername));
    dispatch(updatePostalCode(postalCode));
    navigate("/menu");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {t('user.welcome')}
        </h2>
        <p className="text-sm text-gray-600">
          Enter your postal code to start ordering delicious pizza! 🍕
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Name (optional)
          </label>
          <input
            type="text"
            placeholder="Your name or 'Guest'"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Postal Code *
          </label>
          <input
            type="text"
            placeholder="e.g. 44149"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
            maxLength={5}
            pattern="[0-9]{5}"
            required
          />
          <p className="mt-1 text-xs text-gray-500">
            We deliver to: 44149, 44147, 44227, 44225, 44137, 44135
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
      )}

      <div className="text-center">
        <Button type="primary" disabled={!postalCode || !!deliveryError}>
          <span className="flex items-center gap-2">
            <span>🍕 Start Ordering</span>
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
