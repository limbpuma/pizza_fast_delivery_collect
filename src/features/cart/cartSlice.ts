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
    },    deleteItem(state, action) {
      state.cart = state.cart.filter((item) => item.pizzaId !== action.payload);
    },
    increaseItemQuantity(state, action) {
      const item = state.cart.find((item) => item.pizzaId === action.payload);

      if (!item) return;

      item.quantity++;
      item.totalPrice = item.quantity * item.unitPrice;
    },
    decreaseItemQuantity(state, action) {
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
    // New methods for handling multi-size pizzas
    decreaseAnyItemByPizzaId(state, action) {
      // Find the first item with this pizzaId (any size)
      const items = state.cart.filter((item: CartItem) => item.pizzaId === action.payload);
      if (items.length === 0) return;
      
      // Take the first item found
      const item = items[0];
      
      if (item.quantity > 1) {
        item.quantity--;
        item.totalPrice = item.quantity * item.unitPrice;
      } else {
        // Remove this specific item completely
        state.cart = state.cart.filter((cartItem: CartItem) => cartItem !== item);
      }
    },    deleteAllItemsByPizzaId(state, action) {
      state.cart = state.cart.filter((item: CartItem) => item.pizzaId !== action.payload);
    },
    // Methods for handling specific cart items by pizzaId and size
    increaseSpecificItem(state, action) {
      const { pizzaId, size } = action.payload;
      const item = state.cart.find((item: CartItem) => 
        item.pizzaId === pizzaId && item.size === size
      );
      
      if (item) {
        item.quantity++;
        item.totalPrice = item.quantity * item.unitPrice;
      }
    },
    decreaseSpecificItem(state, action) {
      const { pizzaId, size } = action.payload;
      const item = state.cart.find((item: CartItem) => 
        item.pizzaId === pizzaId && item.size === size
      );
      
      if (!item) return;
      
      if (item.quantity > 1) {
        item.quantity--;
        item.totalPrice = item.quantity * item.unitPrice;
      } else {
        // Remove this specific item completely
        state.cart = state.cart.filter((cartItem: CartItem) => 
          !(cartItem.pizzaId === pizzaId && cartItem.size === size)
        );
      }
    },
    deleteSpecificItem(state, action) {
      const { pizzaId, size } = action.payload;
      state.cart = state.cart.filter((item: CartItem) => 
        !(item.pizzaId === pizzaId && item.size === size)
      );
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
  decreaseAnyItemByPizzaId,
  deleteAllItemsByPizzaId,
  increaseSpecificItem,
  decreaseSpecificItem,
  deleteSpecificItem,
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

// New selectors for multi-size pizza support
export const getTotalQuantityByPizzaId = (id: number) => (state: any) =>
  state.cart.cart
    .filter((item: CartItem) => item.pizzaId === id)
    .reduce((total: number, item: CartItem) => total + item.quantity, 0);

export const getItemsByPizzaId = (id: number) => (state: any) =>
  state.cart.cart.filter((item: CartItem) => item.pizzaId === id);

export const hasAnyItemByPizzaId = (id: number) => (state: any) =>
  state.cart.cart.some((item: CartItem) => item.pizzaId === id);

// Get quantity of a specific item by pizzaId and size
export const getSpecificItemQuantity = (pizzaId: number, size?: string) => (state: any) => {
  const item = state.cart.cart.find((item: CartItem) => 
    item.pizzaId === pizzaId && item.size === size
  );
  return item?.quantity ?? 0;
};
