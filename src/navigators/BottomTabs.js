
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/appscreens/HomeScreen';
import SearchScreen from '../screens/appscreens/SearchScreen';
import VideoScreen from '../screens/appscreens/VideoScreen';
import MySpaceScreen from '../screens/appscreens/MySpaceScreen';
import CustomTabBar from '../components/CustomTabBar';
import useTheme from '../hooks/useTheme';
import { useSelector } from 'react-redux';
import { getThemeMode } from '../contexts/ThemeSlice';
import MusicScreen from '../screens/appscreens/MusicScreen';
const BottomTabs = () => {
  const Tab = createBottomTabNavigator();
    const {theme} = useTheme();
  const currentTheme = useSelector(getThemeMode);
  return (
    <Tab.Navigator
      screenOptions={{headerShown: false}}
      tabBar={props => <CustomTabBar theme = {theme} currentTheme = {currentTheme} {...props} />}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="MyVideo" component={VideoScreen} />
      <Tab.Screen name="Music" component={MusicScreen} />
      <Tab.Screen name="MySpace" component={MySpaceScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabs;
