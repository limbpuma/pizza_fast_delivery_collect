// Test ID: IIDSAT
import {
  calcMinutesLeft,
  formatCurrency,
} from "../../utils/helpers";
import { getOrder } from "../../services/apiRestaurant";
import { useFetcher, useLoaderData } from "react-router-dom";
import OrderItem from "./OrderItem";
import { useEffect } from "react";
import UpdateOrder from "./UpdateOrder";
import { useLocalization } from "../../utils/useLocalization";

function Order() {
  // Everyone can search for all orders, so for privacy reasons we're gonna gonna exclude names or address, these are only for the restaurant staff
  const { t, formatLocalizedDate, calcLocalizedDeliveryTime } = useLocalization();
  const order = useLoaderData() as any;

  const fetcher = useFetcher();
  useEffect(
    function () {
      if (!fetcher.data && fetcher.state === "idle") fetcher.load("/menu");
    },
    [fetcher]
  );
  const {
    id,
    status,
    priority,
    priorityPrice,
    orderPrice,
    estimatedDelivery,
    cart,
  } = order;
  const deliveryIn = calcMinutesLeft(estimatedDelivery);
  // Get German status translation
  const getStatusInGerman = (status: string) => {
    switch(status.toLowerCase()) {
      case 'preparing': return t('order.status.preparing');
      case 'delivering': return t('order.status.delivering');
      case 'delivered': return t('order.status.delivered');
      default: return status;
    }
  };

  return (
    <div className="space-y-8 px-4 py-6">
      <div className="flex flex-wrap items-center justify-between gap-2">        <h2 className="text-xl font-semibold">Bestellung #{id} {t('order.status.status')}</h2>

        <div className="space-x-2">
          {priority && (
            <span className="rounded-full bg-red-500 px-3 py-1 text-sm font-semibold uppercase tracking-wide text-red-50">
              {t('order.status.priority')}
            </span>
          )}
          <span className="rounded-full bg-green-500 px-3 py-1 text-sm font-semibold uppercase tracking-wide text-green-50">
            {getStatusInGerman(status)}
          </span>
        </div>
      </div>      <div className="flex flex-wrap items-center justify-between gap-2 bg-stone-200 px-6 py-5">
        <p className="font-medium">
          {deliveryIn >= 0
            ? calcLocalizedDeliveryTime(estimatedDelivery)
            : "Bestellung sollte bereits angekommen sein"}
        </p>        <p className="text-xs text-stone-500">
          ({t('order.status.estimatedDelivery')} {formatLocalizedDate(estimatedDelivery)})
        </p>
      </div><ul className="dive-stone-200 divide-y border-b border-t">
        {cart.map((item: any) => (
          <OrderItem
            item={item}
            isLoadingIngredients={fetcher.state === "loading"}
            key={item.pizzaId}
            ingredients={
              fetcher?.data?.find((el: any) => el.id === item.pizzaId)
                ?.ingredients ?? []
            }
          />
        ))}
      </ul>      <div className="space-y-2 bg-stone-200 px-6 py-5">
        <p className="text-sm font-medium text-stone-600">
          {t('cart.totalPrice', { price: formatCurrency(orderPrice) })}
        </p>
        {priority && (
          <p className="text-sm font-medium text-stone-600">
            {t('order.status.priority')} {formatCurrency(priorityPrice)}
          </p>
        )}
        <p className="font-bold">
          Total: {formatCurrency(orderPrice + priorityPrice)}
        </p></div>
      {!priority && <UpdateOrder />}
    </div>
  );
}
export async function loader({ params }: { params: any }) {
  const order = await getOrder(params.orderId);
  return order;
}
export default Order;
