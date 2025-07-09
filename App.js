import {NavigationContainer} from '@react-navigation/native';
import React, {useEffect} from 'react';
import SplashScreen from 'react-native-splash-screen';
import AppNavigator from './src/navigators/AppNavigator';
import AuthNavigator from './src/navigators/AuthNavigator';
import {Provider, useDispatch, useSelector} from 'react-redux';
import store from './src/store/Store';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {LogBox, View} from 'react-native';
import Colors from './src/constants/Colors';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import {setSafeAreaInsets} from './src/contexts/SafeAreaSlice';

const App = () => {
  LogBox.ignoreAllLogs(true);

  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();

  //Code for hiding splash screen
  useEffect(() => {
    SplashScreen.hide();
    //dispatch(setSafeAreaInsets(insets));
  }, []);

  const {isLoggedIn} = useSelector(state => state.auth);

  return (
    <View style={{backgroundColor: Colors.screen_bgcolor, flex: 1}}>
      <NavigationContainer>
        {isLoggedIn ? <AppNavigator /> : <AuthNavigator />}
      </NavigationContainer>
    </View>
  );
};

const ProviderWrapped = () => {
  return (
    <GestureHandlerRootView>
      <Provider store={store}>
        <SafeAreaProvider>
          <App />
        </SafeAreaProvider>
      </Provider>
    </GestureHandlerRootView>
  );
};
export default ProviderWrapped;
