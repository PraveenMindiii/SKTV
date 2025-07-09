import {
  View,
  Text,
  ImageBackground,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import Colors from '../constants/Colors';
import {ConstValues} from '../constants/ConstValues';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import useTheme from '../hooks/useTheme';
import {useSelector} from 'react-redux';
import {getThemeMode} from '../contexts/ThemeSlice';
import { getSafeAreaMode } from '../contexts/SafeAreaSlice';

const AuthBackgroundView = ({
  AuthHeadingText,
  AuthSubHeadingText,
  onPress,
  children,
}) => {
  const insets = useSelector(getSafeAreaMode);
  const {theme} = useTheme();
  const currentTheme = useSelector(getThemeMode);
  const background = theme('auth_background');
  const heading = theme('heading');
  return (
    <ImageBackground
      source={require('../assets/images/background_image_transparent.png')}
      style={{flex: 1, justifyContent: 'space-between'}}
      resizeMode="cover">
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        bounces={false}
        contentContainerStyle={{
          flexGrow: 1,
        }}>
        <View
          style={{
            flexDirection: 'row',
            height: ConstValues.deviceHeight * 0.2,
            marginTop: insets.top + ConstValues.screenHorizontalPadding + 10,
            justifyContent: 'space-between',
            paddingHorizontal: ConstValues.screenHorizontalPadding,
          }}>
          <TouchableOpacity activeOpacity={1} onPress={onPress}>
            <Image
              source={
                currentTheme === 'light'
                  ? require('../assets/images/icon_light_back.png')
                  : require('../assets/images/ico_backbtn.png')
              }
              style={{height: 24, width: 24, resizeMode: 'cover'}}
            />
          </TouchableOpacity>
          <View
            style={{
              width: '70%',
            }}>
            <Text
              style={{
                fontFamily: 'Quicksand-SemiBold',
                fontSize: 30,
                color: heading,
                textAlign: 'center',
              }}>
              {AuthHeadingText}
            </Text>
          </View>
          <View style={{height: 24, width: 24}} />
        </View>

        <View
          style={{
            backgroundColor: background,
            flex: 1,
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontSize: 18,
              fontFamily: 'Quicksand-Light',
              color: heading,
              paddingTop: 20,
            }}>
            {AuthSubHeadingText}
          </Text>
          {children}
        </View>
      </KeyboardAwareScrollView>
    </ImageBackground>
  );
};

export default AuthBackgroundView;
