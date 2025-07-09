import {View, Text, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import Colors from '../constants/Colors';
import useTheme from '../hooks/useTheme';
import {useSelector} from 'react-redux';
import {getThemeMode} from '../contexts/ThemeSlice';

const HeadersAppScreen = ({TitleName, onPress}) => {
  const {theme} = useTheme();
  const currentTheme = useSelector(getThemeMode);
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 15,
        position: 'relative',
      }}>
      {/* Back Button */}
      <TouchableOpacity style={{width: "100%", height: "100%"}} onPress={onPress} activeOpacity={1}>
        <Image
          style={{height: 25, width: 25}}
          source={
            currentTheme === 'light' ? 
            require('../assets/images/icon_light_back.png') : require('../assets/images/ico_backbtn.png')}
        />
      </TouchableOpacity>

      {/* Centered Title */}
      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          alignItems: 'center',
        }}>
        <Text
          style={{
            fontSize: 20,
            fontFamily: 'Quicksand-SemiBold',
            color: theme('heading'),
          }}>
          {TitleName}
        </Text>
      </View>
    </View>
  );
};

export default HeadersAppScreen;
