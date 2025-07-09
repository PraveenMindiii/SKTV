import {View, Keyboard} from 'react-native';
import React, {useRef, useState} from 'react';
import useTranslate from '../../hooks/useTranslate';
import Colors from '../../constants/Colors';
import AuthBackgroundView from '../../components/AuthBackgroundView';
import AuthTextInputField from '../../components/AuthTextInputFiled';
import PrimarySuccessButton from '../../components/PrimarySuccessButton';
import { ValidateEmail } from '../../utils/Validations';
import useTheme from '../../hooks/useTheme';
const ForgotPasswordScreen = ({navigation}) => {
  const {t} = useTranslate();
  const {theme} = useTheme();
    const background = theme('background');
  const handleGoBack = () => {
    navigation.goBack();
  };

  const [email, setEmail] = useState('');
   const [emailErrorText, setEmailErrorText] = useState("");
   const handleSuccessButton = () => {
      const isEmailValid = ValidateEmail(email);
      if (!isEmailValid.isValid) {
        setEmailErrorText(isEmailValid.message);
        return;
      }
      setEmailErrorText('');
      navigation.navigate('ResetPasswordScreen')
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
          AuthHeadingText={t('FORGOT_PASSWORD_HEADING')}
          AuthSubHeadingText={t('FORGOT_PASSWORD_SUBHEADING')}
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
                returnKeyType={'done'}
                maxLength={30}
                onChangeText={setEmail}
                errorMessage={emailErrorText}
                blurOnSubmit={false}
                onSubmitEditing={() => Keyboard?.dismiss()}
              />

              <View style={{height: 50}} />
               <View style = {{marginHorizontal : 15}}>
              <PrimarySuccessButton
                title={t('SUBMIT')}
                backgroundColor="#4BB7B7"
                onPress={handleSuccessButton}
              />
              </View>
            </View>
          </View>
        </AuthBackgroundView>
      </View>
    </View>
  );
};

export default ForgotPasswordScreen;
