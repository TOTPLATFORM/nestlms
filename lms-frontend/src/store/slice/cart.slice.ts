import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export type CartType = {
  cartInfo: any;
};

const initialState: CartType = {
  cartInfo: null,
};

export const cartSlice = createSlice({
  name: "cartInfo",
  initialState,
  reducers: {
    setCart: (state, action: PayloadAction<any>) => {
      state.cartInfo = action.payload;
    },

    clearCart: (state) => {
      state.cartInfo = null;
    },
  },
});

export const { setCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
