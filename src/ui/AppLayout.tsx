import { Outlet, useNavigation } from "react-router-dom";
import CartOverview from "../features/cart/CartOverview";
import Header from "./Header";
import Loader from "./Loader";

function AppLayout() {
  const navgiation = useNavigation();

  const isLoading = navgiation.state === "loading";
  return (
    <div className="grid grid-rows-[auto_1fr_aut] h-screen">
      {isLoading && <Loader />}
      <Header />
      <div className="overflow-scroll">
        <main className="max-w-3xl mx-auto">
          <Outlet />
        </main>
      </div>
      <CartOverview />
    </div>
  );
}

export default AppLayout;
