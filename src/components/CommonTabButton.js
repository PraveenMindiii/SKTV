import {View, Text, TouchableNativeFeedback, StyleSheet} from 'react-native';
import React from 'react';
import Colors from '../constants/Colors';
import {useSelector} from 'react-redux';

const CommonTabButton = ({
  label,
  onPressHandler,
  isActive,
  themeText,
  themeBackground,
}) => {
  const appTheme = useSelector(state => state.appthemes);
  return (
    <View
      style={{
        borderRadius: 25,
        overflow: 'hidden', // Ensures ripple is clipped to border radius
        flex: 1,
        width: '50%',
      }}>
      <TouchableNativeFeedback
        background={TouchableNativeFeedback.Ripple(
          appTheme?.themeColor,
          false,
        )}
        onPress={() => {
          onPressHandler();
        }}>
        <View
          style={{
            ...styles.tab,
            backgroundColor: isActive ? appTheme?.themeColor : themeBackground,
          }}>
          <Text
            style={{...styles.tabText, color: isActive ? 'white' : themeText}}>
            {label}
          </Text>
        </View>
      </TouchableNativeFeedback>
    </View>
  );
};

export default CommonTabButton;

const styles = StyleSheet.create({
  tab: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    padding: 5,
    borderRadius: 25,
  },
  tabText: {
    color: '#fff',
    fontSize: 13,
    fontFamily: 'Quicksand-Medium',
  },
});
