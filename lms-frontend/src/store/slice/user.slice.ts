import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export type UserType = {
  user: any;
  isLoggedIn: boolean;
  loading: boolean;
};

const initialState: UserType = {
  user: null,
  isLoggedIn: false,
  loading: true,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserType>) => {
      state.user = action.payload;
      state.isLoggedIn = true;
    },

    clearUser: (state) => {
      state.user = null;
      state.isLoggedIn = false;
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setUser, clearUser, setLoading } = userSlice.actions;
export default userSlice.reducer;
