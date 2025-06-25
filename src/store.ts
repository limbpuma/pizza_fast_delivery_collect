import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/user/userSlice";
import cartReducer from "./features/cart/cartSlice";
import deliveryReducer from "./features/delivery/deliverySlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    cart: cartReducer,
    delivery: deliveryReducer,
  },
});

export default store;
