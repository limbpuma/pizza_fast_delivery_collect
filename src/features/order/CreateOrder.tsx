import { useState } from "react";
import { Form, redirect, useActionData, useNavigation } from "react-router-dom";
import { createOrder } from "../../services/apiRestaurant";
import Button from "../../ui/Button";
import { useDispatch, useSelector } from "react-redux";
import { fetchAddress } from "../user/userSlice";
import { clearCart, getCart, getTotalCartPrice } from "../cart/cartSlice";
import EmptyCart from "../cart/EmptyCart";
import store from "../../store";
import { formatCurrency } from "../../utils/helpers";
import { useTranslation } from 'react-i18next';
import { isValidGermanPhone } from "../../utils/germanHelpers";

function CreateOrder() {
  const { t } = useTranslation();
  const [withPriority, setWithPriority] = useState(false);  const {
    username,
    status: addressStatus,
    position,
    address,
    error: errorAddress,
  } = useSelector((state: any) => state.user);

  const isLoadingAddress = addressStatus === "loading";

  const dispatch = useDispatch();

  const navgiation = useNavigation();

  const isSubmitting = navgiation.state === "submitting";

  const formErrors = useActionData() as { phone?: string } | undefined;
  const cartTotalPrice = useSelector(getTotalCartPrice);
  const priorityPrice = withPriority ? cartTotalPrice * 0.2 : 0;

  const totalPrice = cartTotalPrice + priorityPrice;

  const cart = useSelector(getCart);

  if (!cart.length) return <EmptyCart />;

  return (    <div className="px-4 py-6">
      <h2 className="mb-8 text-xl font-semibold">{t('order.title')}</h2>

      <Form method="POST">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">{t('order.firstName')}</label>
          <input
            type="text"
            name="customer"
            defaultValue={username}
            required
            className="input grow"
            placeholder={t('user.namePlaceholder')}
          />
        </div>

        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">{t('order.phone')}</label>          <div className="grow">
            <input 
              type="tel" 
              name="phone" 
              required 
              className="input w-full"
              placeholder={t('order.phone')}
            />            {formErrors?.phone && (
              <p className="mt-2 rounded-md bg-red-100 p-2 text-xs text-red-700">
                {t('order.phoneError')}
              </p>
            )}
          </div>
        </div>        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center relative">
          <label className="sm:basis-40">{t('order.address')}</label>
          <div className="grow">
            <input
              type="text"
              name="address"
              required
              disabled={isLoadingAddress}
              defaultValue={address}
              className="input w-full"
              placeholder={t('order.address')}
            />
            {addressStatus === "error" && (
              <p className="mt-2 rounded-md bg-red-100 p-2 text-xs text-red-700">
                {errorAddress}
              </p>
            )}
          </div>
          <span className="absolute right-[3px] z-50 top-[3px] md:top-[5px] md:right-[5px]">
            {!position.longtitude && !position.latitude && (              <Button
                disabled={isLoadingAddress}
                type="small"
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(fetchAddress());
                }}
              >
                {t('order.gpsButton')}
              </Button>
            )}
          </span>
        </div>

        <div className="mb-12 flex items-center gap-5">
          <input
            className="h-6 w-6 focus:outline-none focus:ring accent-yellow-400 focus:ring-yellow-400 focus:ring-offset-2"
            type="checkbox"
            name="priority"
            id="priority"
            checked={withPriority}
            onChange={(e) => setWithPriority(e.target.checked)}
          />          <label htmlFor="priority" className="font-medium">
            {t('order.priority')} <span className="text-sm text-gray-600">({t('order.priorityDescription')})</span>
          </label>
        </div>        <div>
          <input type="hidden" name="cart" value={JSON.stringify(cart)} />
          <input
            type="hidden"
            name="position"
            value={
              position.longtitude && position.latitude
                ? `${position.longtitude},${position.latitude}`
                : ""
            }
          />          <Button type="primary" disabled={isSubmitting || isLoadingAddress}>
            {isSubmitting
              ? t('common.loading')
              : t('order.orderButton', { price: formatCurrency(totalPrice) })}
          </Button>
        </div>
      </Form>
    </div>
  );
}

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();

  const data = Object.fromEntries(formData);

  const order = {
    ...data,
    cart: JSON.parse(data.cart as string),
    priority: data.priority === "true",
  } as any;  const errors: { phone?: string } = {};
  if (!isValidGermanPhone(order.phone))
    errors.phone = "INVALID_PHONE";

  if (Object.keys(errors).length > 0) return errors;

  const newOrder = await createOrder(order);
  store.dispatch(clearCart());

  console.log(newOrder);
  return redirect(`/order/${newOrder.id}`);
}

export default CreateOrder;
