import { createSlice } from "@reduxjs/toolkit";

export const settingSlice = createSlice({
  name: "setting",
  initialState: {
    theme : "light",
  },
  reducers: {
    setTheme : (state,action)=>{
      state.theme = action.payload;
    },
  },
});

export const { setTheme } = settingSlice.actions;

export default settingSlice.reducer;