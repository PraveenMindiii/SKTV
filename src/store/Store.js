import {configureStore} from '@reduxjs/toolkit';
import authReducer, {initializeAuth} from '../contexts/AuthSlice';
import languageReducer, {initializeLang} from '../contexts/LanguageSlice';
import themeReducer, {initializeTheme} from '../contexts/ThemeSlice';
import safeAreaReducer from '../contexts/SafeAreaSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    language: languageReducer,
    theme: themeReducer,
    safeArea: safeAreaReducer,
  },
});

store.dispatch(initializeAuth());
store.dispatch(initializeLang());
store.dispatch(initializeTheme());
export default store;
