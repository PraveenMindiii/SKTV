import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

const initialState = {
  isLoggedIn: false,
  user: undefined,
};

// Define an async function to initialize the state from AsyncStorage
const initializeAuthState = async ()=> {
  try {
    const userData = await AsyncStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      return {
        isLoggedIn: true,
        user: parsedUser,
      };
    }
  } catch (error) {
    console.error("Failed to load user data:", error);
  }
  return initialState;
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
      state.isLoggedIn = true;
      AsyncStorage.setItem("user", JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = undefined;
      state.isLoggedIn = false;
      AsyncStorage.removeItem("user");
      AsyncStorage.clear();
    },
    setAuthState: (state, action) => {
      state.user = action.payload.user;
      state.isLoggedIn = action.payload.isLoggedIn;
    },
  },
});

// Initialize state on first load
export const initializeAuth = () => async (dispatch) => {
  const authState = await initializeAuthState();
  dispatch(setAuthState(authState));
};

export const { login, logout, setAuthState } = authSlice.actions;
export default authSlice.reducer;
