import React from 'react';
import PinScreen from '../screens/authscreens/PinScreen';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SignupScreen from '../screens/authscreens/SignupScreen';
import LoginScreen from '../screens/authscreens/LoginScreen';
import ForgotPasswordScreen from '../screens/authscreens/ForgotPasswordScreen';
import ResetPasswordScreen from '../screens/authscreens/ResetPasswordScreen';
import WelcomeScreen from '../screens/authscreens/WelcomeScreen';

const AuthNavigator = () => {
  const Stack = createNativeStackNavigator();
  
  return (
    <Stack.Navigator screenOptions={{animation: 'slide_from_right',headerShown:false}}>
      <Stack.Screen name='WelcomeScreen' component={WelcomeScreen} />
      <Stack.Screen name="PinScreen" component={PinScreen} />
      <Stack.Screen name="SignupScreen" component={SignupScreen} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen}/>
      <Stack.Screen name="ResetPasswordScreen" component={ResetPasswordScreen}/>
    </Stack.Navigator>
  );
};

export default AuthNavigator;
