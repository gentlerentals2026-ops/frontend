import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: []
};

const normalizeQuantity = (value, fallback = 1) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const cartState = createSlice({
  name: "cartState",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const existingItem = state.items.find((item) => item._id === product._id);
      const maxQuantity = normalizeQuantity(product.quantityAvailable, 1);

      if (existingItem) {
        existingItem.quantity = Math.min(existingItem.quantity + 1, maxQuantity);
        return;
      }

      state.items.push({
        _id: product._id,
        slug: product.slug,
        title: product.title,
        price: Number(product.price) || 0,
        imageUrl: product.imageUrl,
        quantityAvailable: maxQuantity,
        quantity: 1
      });
    },
    incrementCartItem: (state, action) => {
      const item = state.items.find((cartItem) => cartItem._id === action.payload);

      if (!item) {
        return;
      }

      item.quantity = Math.min(item.quantity + 1, normalizeQuantity(item.quantityAvailable, 1));
    },
    decrementCartItem: (state, action) => {
      const item = state.items.find((cartItem) => cartItem._id === action.payload);

      if (!item) {
        return;
      }

      if (item.quantity <= 1) {
        state.items = state.items.filter((cartItem) => cartItem._id !== action.payload);
        return;
      }

      item.quantity -= 1;
    },
    removeCartItem: (state, action) => {
      state.items = state.items.filter((item) => item._id !== action.payload);
    },
    clearCart: (state) => {
      state.items = [];
    }
  }
});

export const { addToCart, incrementCartItem, decrementCartItem, removeCartItem, clearCart } = cartState.actions;

export default cartState.reducer;
