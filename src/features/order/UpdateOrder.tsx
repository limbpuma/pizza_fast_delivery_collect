import { useFetcher } from "react-router-dom";
import Button from "../../ui/Button";
import { updateOrder } from "../../services/apiRestaurant";
import { useTranslation } from 'react-i18next';

function UpdateOrder() {
  const { t } = useTranslation();
  const fetcher = useFetcher();
  return (
    <fetcher.Form method="PATCH" className="text-right">
      <Button type="primary">{t('order.status.makePriority')}</Button>
    </fetcher.Form>
  );
}

export default UpdateOrder;

export async function action({
  params,
}: {
  params: any;
}) {
  const data = { priority: true };

  await updateOrder(params.orderId, data);

  return null;
}
