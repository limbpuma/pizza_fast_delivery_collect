import { Link } from "react-router-dom";
import SearchOrder from "../features/order/SearchOrder";
import Username from "../features/user/Username";

function Header() {
  return (
    <header
      className="bg-yellow-400 uppercase border-b border-stone-200 
    px-4 py-3 sm:px-6 flex items-center justify-between font-pizza"
    >
      <Link to="/" className=" tracking-widest">
        Fast React Pizza co.
      </Link>

      <SearchOrder />

      <Username />
    </header>
  );
}

export default Header;
