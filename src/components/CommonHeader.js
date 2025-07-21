import React from 'react';
import { View, Image, Text, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { getThemeMode } from '../contexts/ThemeSlice';

export const CommonHeader = ({ onLeftPress, title }) => {
  const currentTheme = useSelector(getThemeMode);
  return (
    <View>
        <View style={{height:45}} />
    <View
      style={{
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <TouchableOpacity activeOpacity={1} onPress={onLeftPress}>
        <Image
          source={require('../assets/images/round_back_icon.png')}
          style={{
            height: 25,
            width: 25,
            resizeMode: 'contain',
            tintColor: currentTheme == 'dark' ? "#FFFFFF"  : '#000000',
          }}
        />
      </TouchableOpacity>
      <Text
        style={{
          fontSize: 22,
          color: '#333333',
          fontFamily: 'Poppins-Bold',
          fontWeight: '700',
          color: currentTheme == 'dark' ? "#FFFFFF"  : '#000000' 
        }}
      >
        {title}
      </Text>
      <View style={{width:25}} />
    </View>
    </View>
  );
};
