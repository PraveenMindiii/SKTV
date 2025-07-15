// src/features/user/userSlice.ts
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
themeName:'Default Theme',
themeSubName:'Tesla',
themeColor:'#42A3A3',
// themeBackgroundColor:string,
themeGradientColorOne:'rgba(73, 218, 218, 1)',
themeGadientColorSecond:'rgba(66, 163, 163, 1)'
};

const appThemesSlice = createSlice({
  name: 'appthemes',
  initialState,
  reducers: {
    setAppTheme: (state, action) => {
      return { ...state, ...action.payload };
    },
    updateAppTheme: (state, action) => {
      return { ...state, ...action.payload };
    },
    setIntialAppTheme: (state, action) => {
      return { ...state, ...initialState };
    },
  },
});

export const { setAppTheme, updateAppTheme } = appThemesSlice.actions;

export default appThemesSlice.reducer;
