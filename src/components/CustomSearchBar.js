import {View, Text, StyleSheet, TextInput, Image, Keyboard} from 'react-native';
import React from 'react';
import useTranslate from '../hooks/useTranslate';
import useTheme from '../hooks/useTheme';
import {useSelector} from 'react-redux';
import {getThemeMode} from '../contexts/ThemeSlice';

const CustomSearchBar = ({value, onChangeText, autoFocus ,inputRef}) => {
  const {t} = useTranslate();
  const {theme} = useTheme();
  const currentTheme = useSelector(getThemeMode);
  return (
    <View
      style={[
        styles.container,
        {color: theme('search_background')},
        {borderColor: theme('search_bordercolor')},
      ]}>
      <Image
        style={styles.Image}
        source={require('../assets/images/ico_search.png')}
      />
      <TextInput
        style={[styles.input,{ color: currentTheme == "light" ? "#000000" : "#FFFFFF"}]}
        value={value}
        placeholder={t('SEARCH')}
        placeholderTextColor={'#626262'}
        onChangeText={onChangeText}
       // autoFocus={autoFocus}
        ref={inputRef}
        // onSubmitEditing={() => {
        //   Keyboard.dismiss();
        // }}
      />
    </View>
  );
};

export default CustomSearchBar;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderWidth: 0.5,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    paddingHorizontal: 10,
    flex: 1,
    padding: 8,
    fontSize: 18,
    fontFamily: 'Quicksand-Regular',
  },
  Image: {
    height: 25,
    width: 25,
    resizeMode: 'contain',
    marginLeft: 15,
  },
});
