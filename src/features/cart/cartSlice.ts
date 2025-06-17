import { createSlice } from "@reduxjs/toolkit";

export interface CartItem {
  pizzaId: number;
  name: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  size?: string; // Optional size for pizza items
}

interface CartState {
  cart: CartItem[];
}

const initialState: CartState = {
  cart: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,  reducers: {
    addItem(state, action) {
      // Check if item already exists in cart (same pizzaId and size if applicable)
      const existingItem = state.cart.find((item: CartItem) => 
        item.pizzaId === action.payload.pizzaId && 
        (action.payload.size ? item.size === action.payload.size : true)
      );
      
      if (existingItem) {
        // If item exists, increase quantity
        existingItem.quantity++;
        existingItem.totalPrice = existingItem.quantity * existingItem.unitPrice;
      } else {
        // If new item, add to cart
        state.cart.push(action.payload);
      }
    },
    deleteItem(state, action) {
      state.cart = state.cart.filter((item) => item.pizzaId !== action.payload);
    },
    increaseItemQuantity(state, action) {
      const item = state.cart.find((item) => item.pizzaId === action.payload);

      if (!item) return;

      item.quantity++;
      item.totalPrice = item.quantity * item.unitPrice;
    },    decreaseItemQuantity(state, action) {
      const item = state.cart.find((item: CartItem) => item.pizzaId === action.payload);

      if (!item) return;

      if (item.quantity > 1) {
        item.quantity--;
        item.totalPrice = item.quantity * item.unitPrice;
      } else {
        // If quantity is 1, remove the item completely
        cartSlice.caseReducers.deleteItem(state, action);
      }
    },
    clearCart(state) {
      state.cart = [];
    },
  },
});

export const {
  addItem,
  deleteItem,
  decreaseItemQuantity,
  increaseItemQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;

export const getCart = (state: any) => state.cart.cart;
export const getCurrentQuantityById = (id: number) => (state: any) =>
  state.cart.cart.find((item: CartItem) => item.pizzaId === id)?.quantity ?? 0;
export const getTotalCartQuantity = (state: any) =>
  state.cart.cart.reduce((sum: number, item: CartItem) => sum + item.quantity, 0);
export const getTotalCartPrice = (state: any) =>
  state.cart.cart.reduce((sum: number, item: CartItem) => sum + item.totalPrice, 0);
