import {View, Text, TouchableOpacity, StyleSheet, Keyboard} from 'react-native';
import React, {useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {login} from '../../contexts/AuthSlice';
import useTranslate from '../../hooks/useTranslate';
import Colors from '../../constants/Colors';
import AuthBackgroundView from '../../components/AuthBackgroundView';
import AuthTextInputField from '../../components/AuthTextInputFiled';
import PrimarySuccessButton from '../../components/PrimarySuccessButton';
import CustomCountrycodeWithPhoneNumber from '../../components/CustomCountrycodeWithPhoneNumber';
import {
  ValidateConfirmPassword,
  ValidateEmail,
  ValidateFirstName,
  ValidateFullName,
  ValidateLastName,
  ValidatePhoneNumber,
  ValidateSignUpPassword,
} from '../../utils/Validations';
import useTheme from '../../hooks/useTheme';
import {getThemeMode} from '../../contexts/ThemeSlice';
import { getSafeAreaMode } from '../../contexts/SafeAreaSlice';

const SignupScreen = ({navigation}) => {
  const {theme} = useTheme();
 
  const dispatch = useDispatch();
  const {t} = useTranslate();
  const insets = useSelector(getSafeAreaMode);
  const background = theme('background');
  const lastNameRef = useRef(null);
  const emailRef = useRef(null);
  const phoneNumberRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmpasswordRef = useRef(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmpassword, setconfirmpassword] = useState('');
  const [emailErrorText, setEmailErrorText] = useState('');
  const [firstNameErrorText, setFirstNameErrorText] = useState('');
  const [lastNameErrorText, setLastNameErrorText] = useState('');
  const [phoneNumberErrorText, setPhoneNumberErrorText] = useState('');
  const [passwordErrorText, setPasswordErrorText] = useState('');
  const [confirmPasswordErrorText, setConfirmPasswordErrorText] = useState('');
  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleSuccessButton = () => {
    const isFirstNameValid = ValidateFirstName(firstName);
    const isLastNameValid = ValidateLastName(lastName);
    const isEmailValid = ValidateEmail(email);
    const isPhoneNumberValid = ValidatePhoneNumber(phoneNumber);
    const isPasswordValid = ValidateSignUpPassword(password);
    const isConfirmPasswordValid = ValidateConfirmPassword(
      password,
      confirmpassword,
    );

    if (!isFirstNameValid.isValid) {
      setFirstNameErrorText(isFirstNameValid.message);
      return;
    }

    if (!isLastNameValid.isValid) {
      setLastNameErrorText(isLastNameValid.message);
      return;
    }
    if (!isEmailValid.isValid) {
      setEmailErrorText(isEmailValid.message);
      return;
    }
    if (!isPhoneNumberValid.isValid) {
      setPhoneNumberErrorText(isPhoneNumberValid.message);
      return;
    }

    if (!isPasswordValid.isValid) {
      setPasswordErrorText(isPasswordValid.message);
      return;
    }

    if (!isConfirmPasswordValid.isValid) {
      setConfirmPasswordErrorText(isConfirmPasswordValid.message);
      return;
    }
    handleLogin();
  };

  const handleLogin = () => {
    dispatch(
      login({
        id: 'XYZ',
        username: 'vandana',
        email: 'vandana.mindiii@gmail.com',
        firstName: 'Vandana',
        lastName: 'Lashkar',
        gender: 'female',
        image: 'data?.data.picture',
        accessToken: 'hudhHHGuefjksdhf34545345hkshfkds',
        refreshToken: 'hudhHHGuefjksdhf34545345hkshfkds',
      }),
    );
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
          AuthHeadingText={t('SIGNUPHEADING')}
          AuthSubHeadingText={t('SIGNUPSUBHEADING')}
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
                ImageValue={require('../../assets/images/ico_user.png')}
                value={firstName}
                placeholder={t('FIRSTNAME')}
                ref={null}
                placeholderTextColor={'#677D7D'}
                keyboardType={'default'}
                returnKeyType={'next'}
                onSubmitEditing={() => lastNameRef?.current?.focus()}
                maxLength={30}
                onChangeText={setFirstName}
                errorMessage={firstNameErrorText}
                blurOnSubmit={false}
              />
              <View style={{height: 25}} />
              <AuthTextInputField
                ImageValue={require('../../assets/images/ico_user.png')}
                value={lastName}
                ref={lastNameRef}
                placeholder={t('LASTNAME')}
                placeholderTextColor={'#677D7D'}
                keyboardType={'default'}
                returnKeyType={'next'}
                onSubmitEditing={() => emailRef?.current?.focus()}
                maxLength={30}
                onChangeText={setLastName}
                errorMessage={lastNameErrorText}
                blurOnSubmit={false}
              />
              <View style={{height: 25}} />
              <AuthTextInputField
                ImageValue={require('../../assets/images/ico_email.png')}
                value={email}
                ref={emailRef}
                placeholder={t('EMAIL')}
                placeholderTextColor={'#677D7D'}
                keyboardType={'email-address'}
                returnKeyType={'next'}
                errorMessage={emailErrorText}
                onSubmitEditing={() => phoneNumberRef?.current?.focus()}
                maxLength={30}
                onChangeText={setEmail}
                blurOnSubmit={false}
              />

              <View style={{height: 25}} />

              <CustomCountrycodeWithPhoneNumber
                value={phoneNumber}
                ref={phoneNumberRef}
                placeholder={t('Phone number')}
                onSubmitEditing={() => {
                  passwordRef?.current?.focus();
                }}
                maxLength={15}
                onChangeText={setPhoneNumber}
                blurOnSubmit={false}
                errorMessage={phoneNumberErrorText}
                returnKeyType={'next'}
              />

              <View style={{height: 25}} />

              <AuthTextInputField
                ImageValue={require('../../assets/images/ico_password.png')}
                value={password}
                ref={passwordRef}
                placeholder={t('PASSWORD')}
                secureTextEntry={true}
                isPassword={true}
                placeholderTextColor={'#677D7D'}
                keyboardType={'default'}
                returnKeyType={'next'}
                onSubmitEditing={() => {
                  confirmpasswordRef?.current?.focus();
                }}
                maxLength={30}
                onChangeText={setPassword}
                errorMessage={passwordErrorText}
                blurOnSubmit={false}
              />
              <View style={{height: 25}} />
              <AuthTextInputField
                ImageValue={require('../../assets/images/ico_password.png')}
                value={confirmpassword}
                ref={confirmpasswordRef}
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
                onChangeText={setconfirmpassword}
                errorMessage={confirmPasswordErrorText}
                blurOnSubmit={true}
              />

              <View style={{height: 25}} />
              <View style={{marginHorizontal: 15}}>
                <PrimarySuccessButton
                  title={t('SIGNUP')}
                  backgroundColor="#4BB7B7"
                  onPress={handleSuccessButton}
                />
              </View>
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignSelf: 'center',
                paddingVertical: insets.bottom + 10,
              }}>
              <Text style={[styles.signUpText , {color : theme('sub_heading')}]}>
                {t('ALREADY_HAVE_AN_ACCOUNT')}
              </Text>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => navigation.navigate('SignupScreen')}>
                <Text style={[styles.signUpLink , {color : theme('app_secondary_color')}]}> {t('Login')}</Text>
              </TouchableOpacity>
              <View style={{height: 20}} />
            </View>
          </View>
        </AuthBackgroundView>
      </View>
    </View>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
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
