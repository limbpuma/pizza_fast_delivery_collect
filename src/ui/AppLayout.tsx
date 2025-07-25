import { useState } from "react";
import { Outlet, useNavigation } from "react-router-dom";
import CartSidebar from "../features/cart/CartSidebar";
import CartToggle from "../features/cart/CartToggle";
import Header from "./Header";
import Footer from "./Footer";
import Loader from "./Loader";
import CookieBanner from "./CookieBanner";

function AppLayout() {
  const navigation = useNavigation();
  const [isCartOpen, setIsCartOpen] = useState(false);

  const isLoading = navigation.state === "loading";

  const handleOpenCart = () => setIsCartOpen(true);
  const handleCloseCart = () => setIsCartOpen(false);

  return (
    <div className="min-h-screen flex flex-col">
      {isLoading && <Loader />}
      
      <Header />
      
      <div className="flex-1">
        <main className="max-w-3xl mx-auto">
          <Outlet />
        </main>      </div>

      {/* New Cart System */}
      <CartToggle onOpenCart={handleOpenCart} />
      <CartSidebar isOpen={isCartOpen} onClose={handleCloseCart} />
        {/* EU Compliance Footer */}
      <Footer />
      
      {/* TTDSG § 25 Compliant Cookie Banner */}
      <CookieBanner />
    </div>
  );
}

export default AppLayout;
