import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: {},
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const p = action.payload;
      if (state.items[p.productId]) {
        state.items[p.productId].quantity += 1;
      } else {
        state.items[p.productId] = {
          ...p,
          quantity: 1,
        };
      }
    },

    increaseQty: (state, action) => {
      const id = action.payload;
      if (state.items[id]) {
        state.items[id].quantity += 1;
      }
    },

    decreaseQty: (state, action) => {
      const id = action.payload;
      if (!state.items[id]) return;

      state.items[id].quantity -= 1;
      if (state.items[id].quantity <= 0) {
        delete state.items[id];
      }
    },

    removeFromCart: (state, action) => {
      delete state.items[action.payload];
    },

    clearCart: (state) => {
      state.items = {};
    },
  },
});

export const {
  addToCart,
  increaseQty,
  decreaseQty,
  removeFromCart,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
