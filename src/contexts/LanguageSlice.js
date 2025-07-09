import { createSlice } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import en from "../locales/en.json";
import sp from "../locales/sp.json";
import cn from "../locales/cn.json";
import fr from "../locales/fr.json";
const LANG_KEY = "APP_LANGUAGE";

const translations = {
  en: en,
  es: sp,
  cn: cn,
  fr: fr
};

const initialState = {
  currentLanguage: "en",
  dictionary: translations["en"],
};

const initializeLanguageState = async () => {
  try {
    const savedLang = await AsyncStorage.getItem(LANG_KEY);
    const language = savedLang || "en";
    return {
      currentLanguage: language,
      dictionary: translations[language],
    };
  } catch (error) {
    console.error("Failed to load language from AsyncStorage:", error);
    return initialState;
  }
};

const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    setLanguage: (state, action) => {
      const lang = action.payload;
      state.currentLanguage = lang;
      state.dictionary = translations[lang];
      AsyncStorage.setItem(LANG_KEY, lang);
    },
    setLanguageState: (state, action) => {
      state.currentLanguage = action.payload.currentLanguage;
      state.dictionary = action.payload.dictionary;
    },
  },
});

export const initializeLang = () => async (dispatch) => {
  const langState = await initializeLanguageState();
  dispatch(setLanguageState(langState));
};

export const translate = (key) => (state) =>
  state.language.dictionary[key] || key;

export const getCurrentLanguage = (state) =>
  state.language.currentLanguage;

export const { setLanguage, setLanguageState } = languageSlice.actions;
export default languageSlice.reducer;