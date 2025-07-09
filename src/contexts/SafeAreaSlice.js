// redux/slices/safeAreaSlice.js
import { createSlice } from '@reduxjs/toolkit';

const SafeAreaSlice = createSlice({
  name: 'safeArea',
  initialState: {
    insets: {top: 48, right: 0, bottom: 0, left: 0},
  },
  reducers: {
    setSafeAreaInsets: (state, action) => {
      state.insets = action.payload;
    },
  },
});

export const { setSafeAreaInsets } = SafeAreaSlice.actions;
export const getSafeAreaMode = state => state.safeArea.insets;
export default SafeAreaSlice.reducer;
