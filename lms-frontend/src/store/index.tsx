import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userSlice from "./slice/user.slice";
import commonSlice from "./slice/common.slice";
import cartSlice from "./slice/cart.slice";

const rootReducer = combineReducers({
  userSlice: userSlice,
  cartSlice: cartSlice,
  common: commonSlice,
});

export default configureStore({
  reducer: rootReducer,
});

export type IRootState = ReturnType<typeof rootReducer>;
