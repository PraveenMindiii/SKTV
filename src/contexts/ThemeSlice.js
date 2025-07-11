import {createSlice} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {themes} from '../constants/Colors';

const THEME_KEY = 'APP_THEME';

const initialState = {
  mode: 'dark', // default
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action) => {
      const mode = action.payload;
      state.mode = mode;
      AsyncStorage.setItem(THEME_KEY, mode); // Persist to storage
    },
    setThemeState: (state, action) => {
      state.mode = action.payload;
    },
  },
});

export const initializeTheme = () => async dispatch => {
  console.log("Coming in the initialize theme block");
  
  try {
    const savedTheme = await AsyncStorage.getItem(THEME_KEY);
    const mode = savedTheme || 'dark';
    dispatch(setThemeState(mode));
  } catch (err) {
    dispatch(setThemeState('dark'));
  }
};

export const themeStyle = key => state =>
  themes[state.theme.mode][key] || 'grey';

export const {setTheme, setThemeState} = themeSlice.actions;

export const getThemeMode = state => state.theme.mode;

export default themeSlice.reducer;
