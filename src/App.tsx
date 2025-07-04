import { RouterProvider, createBrowserRouter } from "react-router-dom";

import Home from "./ui/Home";
import Menu, { loader as menuLoader } from "./features/menu/Menu";
import Order, { loader as orderLoader } from "./features/order/Order";
import CheckoutForm from "./features/order/CheckoutForm";
import OrderConfirmation from "./features/order/OrderConfirmation";
import RecentOrders from "./features/order/RecentOrders";
import AppLayout from "./ui/AppLayout";
import { action as updateOrderAction } from "./features/order/UpdateOrder";
import Error from "./ui/Error";
// Legal Pages
import ImpressumPage from "./pages/legal/ImpressumPage";
import DatenschutzPage from "./pages/legal/DatenschutzPage";
import AGBPage from "./pages/legal/AGBPage";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <Error />,
    children: [      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/menu",
        element: <Menu />,
        loader: menuLoader,
        errorElement: <Error />,
      },      {
        path: "/checkout",
        element: <CheckoutForm />,
      },
      {
        path: "/my-orders",
        element: <RecentOrders />,
      },{
        path: "/order-confirmation",
        element: <OrderConfirmation />,
      },
      {
        path: "/impressum",
        element: <ImpressumPage />,
      },
      {
        path: "/imprint",
        element: <ImpressumPage />,
      },
      {
        path: "/datenschutz",
        element: <DatenschutzPage />,
      },
      {
        path: "/privacy",
        element: <DatenschutzPage />,
      },
      {
        path: "/agb",
        element: <AGBPage />,
      },
      {
        path: "/terms",
        element: <AGBPage />,
      },
      {
        path: "/order/:orderId",
        element: <Order />,
        loader: orderLoader,
        errorElement: <Error />,
        action: updateOrderAction,
      },
    ],
  },
], {
  future: {
    // React Router v7 Future Flags - Suppress all deployment warnings
    v7_startTransition: true,
    v7_relativeSplatPath: true,
    v7_fetcherPersist: true,
    v7_normalizeFormMethod: true,
    v7_partialHydration: true,
    v7_skipActionErrorRevalidation: true,
  },
} as any);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
