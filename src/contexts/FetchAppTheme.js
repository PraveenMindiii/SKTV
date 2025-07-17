import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import DeviceInfo from 'react-native-device-info';
import {setDeviceInfo, setLoading} from '../context/deviceSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {updateUserData} from '../context/userSlice';
import {updateAppTheme} from './AppThemesSlice';


export const fetchAppTheme = async (dispatch) => {
    console.log("Function called");
    
  try {
    const theme = await AsyncStorage.getItem('app_theme');
    console.log("Theme is -=------>", theme);
    
    if (theme) {
        console.log("Saved theme is ------>", theme);
        
      dispatch(updateAppTheme(JSON.parse(theme)));
    }
  } catch (error) {
    console.error('Error fetching theme:', error);
  }
};
