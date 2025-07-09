import React, {useState} from 'react';
import useTheme from '../../hooks/useTheme';
import {getThemeMode} from '../../contexts/ThemeSlice';
import {
  ScrollView,
  StatusBar,
  Pressable,
  View,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  Modal,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import SelectLanguageModel from '../../components/SelectLanguageModel';
import {ConstValues} from '../../constants/ConstValues';
import Colors from '../../constants/Colors';
import useTranslate from '../../hooks/useTranslate';
import {OtpInput} from 'react-native-otp-entry';
import {login} from '../../contexts/AuthSlice';
import PrimarySuccessButton from '../../components/PrimarySuccessButton';
import ManualOtpInput from '../../components/ManualOTPInput';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import { getSafeAreaMode } from '../../contexts/SafeAreaSlice';

const PinScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const {theme} = useTheme();
  const currentTheme = useSelector(getThemeMode);
  const background = theme('background');
  const heading = theme('heading');
  const insets = useSelector(getSafeAreaMode);
  const [isLangugeVisibleModel, setIsLangugeVisibleModel] = useState(false);
  const [isResetModalVisible, setIsResetModalVisible] = useState(false);
  const [otp, setOtp] = useState('');
  const {t} = useTranslate();

  const getOtpCallBack = otp => {
    setOtp(otp);
  };
  const handleOtpChange = value => {
    setOtp(value);
    console.log('OTP entered so far:', value);
  };

  // const handleOtpFilled = value => {
  //   // You can verify OTP here directly
  //   if (otp == 1234) {
  //     dispatch(
  //       login({
  //         id: 'XYZ',
  //         username: 'guest',
  //         email: 'Guest@xyz.com',
  //         firstName: 'Guest',
  //         lastName: 'User',
  //         gender: 'N/A',
  //         image: 'N/A',
  //         accessToken: 'N/A',
  //         refreshToken: 'N/A',
  //       }),
  //     );
  //   } else {
  //     alert("Pin is empty or incorrect!")
  //   }
  // };

  const handleOtpFilled = value => {
    if (!otp || otp.trim() === '') {
      alert('Please enter pin');
    } else if (otp?.length < 4 || otp !== '1234') {
      alert('Pin is incorrect!');
    } else {
      dispatch(
        login({
          id: 'XYZ',
          username: 'guest',
          email: 'Guest@xyz.com',
          firstName: 'Guest',
          lastName: 'User',
          gender: 'N/A',
          image: 'N/A',
          accessToken: 'N/A',
          refreshToken: 'N/A',
        }),
      );
    }
  };

  return (
    <KeyboardAwareScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        flexGrow: 1,
        backgroundColor: '#111111',
      }}>
      {/* <StatusBar
        backgroundColor={background}
        translucent={false}
        barStyle={currentTheme === 'light' ? 'dark-content' : 'light-content'}
      /> */}

      <StatusBar
        backgroundColor={'#111111'}
        translucent={false}
        barStyle={'light-content'}
      />

      <Modal
        visible={isResetModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalText}>{t('RESET_PIN')}</Text>

            <View
              style={{
                width: 21,
                height: 2,
                alignSelf: 'center',
                backgroundColor: Colors.textGray,
              }}
            />
            <Text
              style={{
                textAlign: 'center',
                fontSize: 16,
                fontFamily: 'Poppins-Bold',
                marginTop: 20,
              }}>
              {t('FOR_RESETTING_PIN')}
            </Text>

            <View style={{width: '100%', marginTop: 30}}>
              <PrimarySuccessButton
                title={t('OK')}
                backgroundColor="#4BB7B7"
                onPress={() => {
                  setIsResetModalVisible(false);
                }}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* <SelectLanguageModel
        visible={isLangugeVisibleModel}
        onClose={() => setIsLangugeVisibleModel(false)}
        title={'Select Language'}
      /> */}

      <View
        style={{
          justifyContent: 'space-between',
          flex: 1,
          backgroundColor: '#111111',
        }}>
        <View>
          <View style={{marginTop: 30, paddingLeft: 20}}>
            <View
              style={{
                flexDirection: 'column',
                alignItems: 'flex-start',
              }}>
              <TouchableOpacity
                style={{width: 24, height: 24, marginRight: 50}}
                onPress={() => {
                  navigation.goBack();
                }}
                activeOpacity={1}>
                <Image
                  style={{height: 25, width: 25}}
                  source={
                    currentTheme === 'light'
                      ? require('../../assets/images/icon_light_back.png')
                      : require('../../assets/images/ico_backbtn.png')
                  }
                />
              </TouchableOpacity>
              <View style={{ width: 200, alignSelf: "center", marginTop: -25}}>
                <Text
                  style={{
                    fontSize: 30,
                    fontFamily: 'Quicksand-Bold',
                    color: '#FFFFFF',
                    textAlign: 'center',
                    flexWrap: 'wrap',
                  }}>
                  {t('WELCOME_TO_SCENEKEY').toUpperCase()}
                </Text>
              </View>

              {/* <Pressable
                onPress={() => {
                  setIsLangugeVisibleModel(true);
                }}
                style={{
                  position: 'absolute',
                  zIndex: 10,
                  right: ConstValues.screenHorizontalPadding,
                  top: insets.top + ConstValues.screenHorizontalPadding,
                }}>
                <Image
                  style={styles.languageImage}
                  source={require('../../assets/images/ico_earth.png')}
                />
              </Pressable> */}
            </View>

            <View style={{flexDirection: 'column'}}>
              <Text style={styles.welcomeText}>{t('WELCOME_TO_SCENEKEY')}</Text>
              <Text style={styles.welcomeTextSubheading}>
                {t('YOUR_KEYS_TO')}
              </Text>
            </View>

            <Image
              style={{
                width: 180,
                height: 180,
                resizeMode: 'cover',
                marginTop: 35,
                alignSelf: 'center',
              }}
              source={require('../../assets/images/ico_OTP.png')}
            />
            <Text style={styles.pinText}>{t('PIN_NUMBER')}</Text>
          </View>

          {/* <OTPTextView/> */}
          <View style={{alignSelf: 'center', width: 240, marginTop: 25}}>
            {/* <OtpInput
              numberOfDigits={4}
              placeholder="X"
              focusColor=""
              focusStickBlinkingDuration={500}
              onTextChange={handleOtpChange}
              autoFocus={false}
              containerStyle={{
                justifyContent: 'space-between',
                width: 50,
                height: 50,
              }}
              inputFieldStyles={{
                borderRadius: 10,
                borderColor: '#D4D4D4',
                borderWidth: 1,
                fontSize: 20,
              }}
              theme={{
                containerStyle: styles.container,
                pinCodeContainerStyle: {width: 50, height: 50},
                pinCodeTextStyle: {
                  fontSize: 20,
                  fontFamily: 'Poppins-Regular',
                  justifyContent: 'center',
                  alignItems: 'center',
                  color: Colors.black,
                },
              }}
            /> */}

            <ManualOtpInput sendOtp={getOtpCallBack} />
          </View>
        </View>

        <View style={{marginHorizontal: 45, marginBottom: 40, rowGap: 35}}>
          <PrimarySuccessButton
            title={t('LOGIN')}
            backgroundColor="#4BB7B7"
            onPress={() => {
              handleOtpFilled();
            }}
          />

          <TouchableOpacity
            onPress={() => {
              setIsResetModalVisible(!isResetModalVisible);
            }}
            style={{alignSelf: 'center'}}>
            <Text style={styles.ResetPinText}>{t('RESET_PIN')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default PinScreen;

const styles = StyleSheet.create({
  welcomeHeading: {
    color: Colors.white,
    paddingTop: 11,
    paddingHorizontal: 20,
    fontFamily: 'Quicksand-SemiBold',
    fontSize: 30,
  },

  welcomeSubHeading: {
    color: Colors.white,
    paddingTop: 11,
    paddingHorizontal: 20,
    fontFamily: 'Quicksand-Light',
    fontSize: 15,
  },
  languageImage: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  welcomeText: {
    fontFamily: 'Poppins-Bold',
    color: Colors.sub_heading,
    fontSize: 26,
    alignSelf: 'flex-start',
    marginTop: 20,
  },

  pinText: {
    fontFamily: 'Poppins-Medium',
    color: Colors.heading,
    fontSize: 19,
    alignSelf: 'center',
    marginTop: 45,
  },

  ResetPinText: {
    fontFamily: 'Poppins-Bold',
    color: Colors.heading,
    fontSize: 13,
    alignSelf: 'center',
    textDecorationLine: 'underline',
  },

  welcomeTextSubheading: {
    fontFamily: 'Poppins-Bold',
    color: Colors.textGray,
    fontSize: 13,
    alignSelf: 'flex-start',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    width: 320,
    paddingVertical: 25,
    alignItems: 'center',
    elevation: 5, // for Android shadow
  },
  modalText: {
    fontFamily: 'Poppins-Bold',
    color: Colors.textGray,
    fontSize: 18,
    marginBottom: 7,
  },
  button: {
    backgroundColor: 'black',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
});
