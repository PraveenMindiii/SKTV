import {View, Text, TouchableOpacity, StyleSheet, Keyboard} from 'react-native';
import React, {useRef, useState} from 'react';
import {useDispatch} from 'react-redux';
import {login} from '../../contexts/AuthSlice';
import useTranslate from '../../hooks/useTranslate';
import Colors from '../../constants/Colors';
import AuthBackgroundView from '../../components/AuthBackgroundView';
import AuthTextInputField from '../../components/AuthTextInputFiled';
import PrimarySuccessButton from '../../components/PrimarySuccessButton';
import { ValidateEmail, ValidatePassword } from '../../utils/Validations';
import useTheme from '../../hooks/useTheme';
import { getSafeAreaMode } from '../../contexts/SafeAreaSlice';

const LoginScreen = ({navigation}) => {
  const {theme} = useTheme();
   const background = theme('background');
  const dispatch = useDispatch();
  const {t} = useTranslate();
  const insets = useSelector(getSafeAreaMode);
  
  const passwordRef = useRef(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailErrorText, setEmailErrorText] = useState("");
  const [passwordErrorText, setPasswordErrorText] = useState("");

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleSuccessButton = () => {
    const isEmailValid = ValidateEmail(email);
    const isPasswordValid = ValidatePassword(password);
  
    if (!isEmailValid.isValid) {
      setEmailErrorText(isEmailValid.message);
      return;
    }
  
    if (!isPasswordValid.isValid) {
      setPasswordErrorText(isPasswordValid.message);
      return;
    }
  
    else{
      setEmailErrorText('');
      setPasswordErrorText('');
      handleLogin()
    }
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
          AuthHeadingText={t('LOGINHEADING')}
          AuthSubHeadingText={t('LOGINSUBHEADING')}
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
                ImageValue={require('../../assets/images/ico_email.png')}
                value={email}
                placeholder={t('EMAIL')}
                placeholderTextColor={'#677D7D'}
                keyboardType={'email-address'}
                returnKeyType={'next'}
                onSubmitEditing={() => passwordRef?.current?.focus()}
                maxLength={30}
                errorMessage={emailErrorText}
                onChangeText={setEmail}
                blurOnSubmit={false}
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
                errorMessage={passwordErrorText}
                keyboardType={'default'}
                returnKeyType={'done'}
                onSubmitEditing={() => {
                  Keyboard?.dismiss();
                }}
                maxLength={30}
                onChangeText={setPassword}
                blurOnSubmit={true}
              />

              <TouchableOpacity
                onPress={() => navigation.navigate('ForgotPasswordScreen')}
                activeOpacity={1}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignSelf: 'flex-end',
                  marginTop: 15,
                  marginHorizontal : 15
                }}>
                <Text
                  style={{
                    color: theme('app_secondary_color'),
                    fontSize: 18,
                    fontFamily: 'Quicksand-Medium',
                  }}>
                  {t('FORGOT_PASSWORD')}
                </Text>
              </TouchableOpacity>
              <View style={{height: 50}} />
              <View style = {{marginHorizontal : 15}}>
              <PrimarySuccessButton
                title={t('LOGIN')}
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
              <Text style={[styles.signUpText , {color : theme('sub_heading')}]}>{t('DONT_HAVE_AN_ACCOUNT')}</Text>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => navigation.navigate('SignupScreen')}>
                <Text style={[styles.signUpLink , {color : theme('app_secondary_color')}]}> {t('SIGN_UP')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </AuthBackgroundView>
      </View>
    </View>
  );
};

export default LoginScreen;

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
