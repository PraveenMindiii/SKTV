import {View, StyleSheet, Keyboard, Platform, Alert} from 'react-native';
import React, {useRef, useState} from 'react';
import {useDispatch} from 'react-redux';
import useTranslate from '../../hooks/useTranslate';
import Colors from '../../constants/Colors';
import AuthBackgroundView from '../../components/AuthBackgroundView';
import AuthTextInputField from '../../components/AuthTextInputFiled';
import {
  ValidateConfirmPassword,
  ValidateSignUpPassword,
} from '../../utils/Validations';
import PrimarySuccessButton from '../../components/PrimarySuccessButton';
import useTheme from '../../hooks/useTheme';

const ForgotPasswordScreen = ({navigation}) => {
  const {t} = useTranslate();
  const {theme} = useTheme();
  const background = theme('background');
  const [passwordErrorText, setPasswordErrorText] = useState('');
  const [confirmPasswordErrorText, setConfirmPasswordErrorText] = useState('');
  const handleGoBack = () => {
    navigation.goBack();
  };

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const confirmPasswordRef = useRef(null);

  const handleSuccessButton = () => {
    const isPasswordValid = ValidateSignUpPassword(newPassword);
    const isConfirmPasswordValid = ValidateConfirmPassword(confirmPassword);

    if (!isPasswordValid.isValid) {
      setPasswordErrorText(isPasswordValid.message);
      return;
    }

    if (!isConfirmPasswordValid.isValid) {
      setConfirmPasswordErrorText(isConfirmPasswordValid.message);
      return;
    } else {
      setPasswordErrorText('');
      setConfirmPasswordErrorText('');
      Alert.alert('hi');
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: background,
      }}>
      <View
        style={{
          backgroundColor: background,
          flex: 1,
        }}>
        <AuthBackgroundView
          AuthHeadingText={t('RESET_PASSWORD_HEADING')}
          AuthSubHeadingText={t('RESET_PASSWORD_SUBHEADING')}
          onPress={handleGoBack}>
          <View
            style={{
              flex: 1,
              width: '100%',
              alignItems: 'center',
              paddingTop: 30,
              justifyContent: 'space-between',
            }}>
            <View>
              <AuthTextInputField
                ImageValue={require('../../assets/images/ico_password.png')}
                value={newPassword}
                ref={null}
                placeholder={t('NEW_PASSWORD')}
                secureTextEntry={true}
                isPassword={true}
                placeholderTextColor={'#677D7D'}
                keyboardType={'default'}
                returnKeyType={'next'}
                onSubmitEditing={() => {
                  confirmPasswordRef?.current?.focus();
                }}
                maxLength={30}
                onChangeText={setNewPassword}
                errorMessage={passwordErrorText}
                blurOnSubmit={false}
              />
              <View style={{height: 25}} />
              <AuthTextInputField
                ImageValue={require('../../assets/images/ico_password.png')}
                value={confirmPassword}
                ref={confirmPasswordRef}
                placeholder={t('CONFIRM_PASSWORD')}
                secureTextEntry={true}
                isPassword={true}
                placeholderTextColor={'#677D7D'}
                keyboardType={'default'}
                returnKeyType={'done'}
                onSubmitEditing={() => {
                  Keyboard?.dismiss();
                }}
                maxLength={30}
                onChangeText={setConfirmPassword}
                errorMessage={confirmPasswordErrorText}
              />
            </View>
            <View
              style={{
                paddingBottom: Platform.OS == 'android' ? 0 : 20,
                paddingHorizontal: 15,
                width: '100%',
              }}>
              <PrimarySuccessButton
                title={t('Reset Password')}
                backgroundColor="#4BB7B7"
                onPress={handleSuccessButton}
              />
              <View style={{height: 20}} />
            </View>
          </View>
        </AuthBackgroundView>
      </View>
    </View>
  );
};

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.screen_bgcolor,
  },
  signUpText: {
    fontSize: 18,
    color: '#D4D4D4',
    fontFamily: 'Quicksand-Regular',
  },
  signUpLink: {
    color: Colors.normal_text_color,
    fontSize: 18,
    fontFamily: 'Quicksand-Medium',
  },
});
