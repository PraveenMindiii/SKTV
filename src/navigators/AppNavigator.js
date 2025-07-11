import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import BottomTabs from '../navigators/BottomTabs';
import PlayerScreen from '../screens/appscreens/PlayerScreen';
import EditProfileScreen from '../screens/appscreens/EditProfileScreen';
import SeeMoreDataScreen from '../screens/appscreens/SeeMoreDataScreen';
import MovieTvShowsDetailsScreen from '../screens/appscreens/MovieTvShowsDetailsScreen';
import SearchScreen from '../screens/appscreens/SearchScreen';
import AppThemes from '../screens/appscreens/AppThemes';

const AppNavigator = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="BottomTabs" component={BottomTabs} />
      <Stack.Screen name="PlayerScreen" component={PlayerScreen} />
      <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
      <Stack.Screen name="SeeMoreDataScreen" component={SeeMoreDataScreen} />
      <Stack.Screen
        name="MovieTvShowsDetailsScreen"
        component={MovieTvShowsDetailsScreen}
      />
      <Stack.Screen name="SearchScreen" component={SearchScreen} />
       <Stack.Screen name="AppThemes" component={AppThemes} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
