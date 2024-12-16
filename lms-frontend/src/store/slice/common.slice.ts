import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export type commomType = {
  data: any;
  loading: boolean;
};

const initialState: commomType = {
  data: {},
  loading: false,
};

export const commonSlice = createSlice({
  name: "commonSettings",
  initialState,
  reducers: {
    setSettings: (state, action: PayloadAction<commomType>) => {
      state.data = action.payload;
    },
    setSettingsLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setSettings, setSettingsLoading } = commonSlice.actions;
export default commonSlice.reducer;
