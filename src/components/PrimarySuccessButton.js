import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import React from 'react';
import {ConstValues} from '../constants/ConstValues';
import Colors from '../constants/Colors';
import {useSelector} from 'react-redux';
import {getThemeMode} from '../contexts/ThemeSlice';
import useTheme from '../hooks/useTheme';

const PrimarySuccessButton = ({
  title,
  backgroundColor = Colors.white,
  onPress,
  borderColor,
  isNoPin = false
}) => {
  const {theme} = useTheme();
  const heading = theme('heading');
  const currentTheme = useSelector(getThemeMode);
  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onPress}
      style={[styles.button, {backgroundColor, borderColor}]}>
      <Text
        style={[
          styles.text,
          {color: isNoPin && currentTheme == 'light' ? '#000000' : Colors.white},
        ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 10,
  },
  text: {
    padding: 12,

    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
  },
});

export default PrimarySuccessButton;
