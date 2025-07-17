import React, {useRef, useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
  Modal,
  Dimensions,
  FlatList,
  StatusBar,
  Alert,
  StyleSheet,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import useTranslate from '../../hooks/useTranslate';
import ManualOtpInput from '../../components/ManualOTPInput';
import apiInstance from '../../services/ApiInstance';
import {VERIFYPIN} from '../../services/ApiEndPoints';
import {useDispatch, useSelector} from 'react-redux';
import {login} from '../../contexts/AuthSlice';
import LoadingOverlay from '../../components/LoadingOverlay';
import PrimarySuccessButton from '../../components/PrimarySuccessButton';
import Colors, {themes} from '../../constants/Colors';
import useTheme from '../../hooks/useTheme';
import {getThemeMode} from '../../contexts/ThemeSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {updateAppTheme} from '../../contexts/AppThemesSlice';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
const PinScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const appTheme = useSelector(state => state.appthemes);
  const {t} = useTranslate();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [isResetModalVisible, setIsResetModalVisible] = useState(false);
  const {theme} = useTheme();
  const currentTheme = useSelector(getThemeMode);
  const background = theme('background');
  const heading = theme('heading');
  const [pinEmptyAlert, setPinEmptyAlert] = useState(t('PLEASE_ENTER_PIN'));
  const [pinInvalidAlert, setPinInvalidAlert] = useState(
    t('PLEASE_ENTER_VALID_PIN'),
  );

  useEffect(() => {
    console.log('CUrrent theme is ----_>', currentTheme);
  }, []);

  const handleOtpFilled = value => {
    if (!otp || otp.trim() === '') {
      Alert.alert('Alert', pinEmptyAlert);
    } else if (otp?.length < 6) {
      alert(pinInvalidAlert);
    } else {
      callPostVerifyPin();
    }
  };
  const callPostVerifyPin = useCallback(async () => {
    setLoading(true);

    try {
      const response = await apiInstance.post(VERIFYPIN, {verifyPin: otp});

      console.log('response pin screen ----->', response?.data?.data);

      if (response.status === 200) {
        // success logic here
        let data = response?.data?.data;
        dispatch(login(data));
        const parts = data?.themes?.title.split('-');
        await AsyncStorage.setItem(
          'app_theme',
          JSON.stringify({
            themeName: parts[0],
            themeSubName: parts[1],
            themeColor: data?.themes?.colourCode,
            themeGradientColorOne: data?.themes?.colourCode,
            themeGadientColorSecond: data?.themes?.gradientCode
              ? data?.themes?.gradientCode
              : data?.themes?.colourCode,
          }),
        );
        dispatch(
          updateAppTheme({
            themeName: parts[0],
            themeSubName: parts[1],
            themeColor: data?.themes?.colourCode,
            themeGradientColorOne: data?.themes?.colourCode,
            themeGadientColorSecond: data?.themes?.gradientCode
              ? data?.themes?.gradientCode
              : data?.themes?.colourCode,
          }),
        );
      }
    } catch (error) {
      console.error('Error Logging in', error);
    } finally {
      setLoading(false);
    }
  }, [otp]);

  const getOtpCallBack = otp => {
    setOtp(otp);
  };
  return (
    <View
      style={[
        style.mainView,
        {
          backgroundColor: currentTheme == 'dark' ? '#000000' : Colors.white,
        },
      ]}>
      <StatusBar
        barStyle={currentTheme == 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={'#FFFFFF'}
      />
      <SafeAreaView />
      <LoadingOverlay loading={loading} />
      <Modal
        visible={isResetModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}>
        <View style={style.modalOverlay}>
          <View style={style.modalBox}>
            <Text style={style.modalText}>
              {t('RESET_PIN')?.replace('?', '')}
            </Text>

            <View
              style={{
                width: 25,
                height: 3,
                borderRadius: 3,
                alignSelf: 'center',
              }}
            />
            <Text
              style={{
                textAlign: 'center',
                fontSize: 16,
                fontFamily: 'Poppins-SemiBold',
                marginTop: 20,
                lineHeight: 28,
                color:
                  currentTheme == 'dark'
                    ? Colors.textGray
                    : themes.second_background,
              }}>
              {t('FOR_RESETTING_PIN')}
            </Text>

            <View style={{width: '90%', marginTop: 30, alignSelf: 'center'}}>
              <PrimarySuccessButton
                title={t('OK')}
                backgroundColor={appTheme?.themeColor}
                onPress={() => {
                  setIsResetModalVisible(false);
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
      {/* <ScrollView> */}
      <KeyboardAwareScrollView
        contentContainerStyle={{flexGrow: 1}}
        showsVerticalScrollIndicator={false}
        bounces={false}>
        <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
          <View style={{height: 35}} />
          <View style={style.keyboardInnerView}>
            <TouchableOpacity
              onPress={() => {
                navigation?.goBack();
              }}
              activeOpacity={1}
              style={{
                alignSelf: 'flex-start',
                paddingRight: 8,
                paddingVertical: 5,
              }}>
              <Image
                style={{
                  height: 16,
                  width: 16,
                  resizeMode: 'contain',
                  marginLeft: 1,
                  tintColor: currentTheme == 'dark' ? Colors.white : '#000000',
                }}
                source={require('../../assets/images/white_back_icon.png')}
              />
            </TouchableOpacity>
            <View style={style.logoView}>
              <Image
                source={require('../../assets/images/logo.png')}
                style={style.logoImage}
              />
            </View>

            <Text
              style={[
                style.welcomeText,
                {
                  color:
                    currentTheme == 'dark' ? '#FFFFFF' : themes.sub_heading,
                },
              ]}>
              {t('Welcome_SK_TV')}
            </Text>
            <Text
              style={[
                style.loginMsg,
                ,
                {
                  color: currentTheme == 'dark' ? '#F2F2F2' : '#626262',
                },
              ]}>
              {t('YOUR_KEYS_TO')}
            </Text>

            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginVertical: 40,
              }}>
              <View
                style={{
                  height: 180,
                  width: 180,
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                  borderRadius: 180,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Image
                  style={{
                    height: 180,
                    width: 180,
                    resizeMode: 'contain',
                  }}
                  source={require('../../assets/images/ico_pin.png')}
                />
              </View>
            </View>
            <Text
              style={[
                style.ValidationText,
                {
                  color: currentTheme == 'dark' ? '#BED3D3' : '#000000',
                },
              ]}>
              {t('PIN_NUMBER')}
            </Text>
            <View
              style={{
                marginTop: 15,
              }}>
              <ManualOtpInput sendOtp={getOtpCallBack} />
            </View>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {
                setIsResetModalVisible(!isResetModalVisible);
              }}
              style={{alignSelf: 'flex-end', marginTop: 18}}>
              <Text
                style={[
                  style.resetPinText,
                  {color: currentTheme == 'dark' ? '#F2F2F2' : '#626262'},
                ]}>
                {t('RESET_PIN')}
              </Text>
            </TouchableOpacity>
            <View style={{height: 90}} />
            <View
              style={{
                backgroundColor: 'white',
                padding: 0.5,
                borderRadius: 10,
              }}>
              <PrimarySuccessButton
                title={t('LOGIN')}
                backgroundColor={appTheme?.themeColor}
                onPress={handleOtpFilled}
              />
            </View>

            {/* <TouchableOpacity
            style={style.loginButton}
            activeOpacity={1}
            onPress={() => {
              handleOtpFilled();
            }}>
            <Text style={style.loginButtonText}>{t('LOGIN')}</Text>
          </TouchableOpacity> */}
            <View style={{height: 110}} />
          </View>
        </ScrollView>
      </KeyboardAwareScrollView>
      {/* </ScrollView> */}
    </View>
  );
};

const style = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: '#000000',
  },
  keyboardInnerView: {
    paddingHorizontal: 18,
    marginTop: 30,
    flex: 1,
  },
  logoView: {
    marginTop: 20,
    height: 90,
    width: 90,
    borderRadius: 100,
    backgroundColor: '#42A3A3',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  logoImage: {
    height: 45,
    width: 65,
    resizeMode: 'contain',
  },
  welcomeText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 27,
    alignSelf: 'flex-start',
    marginTop: 20,
  },
  loginMsg: {
    fontFamily: 'Poppins-Regular',
    color: '#F2F2F2',
    fontSize: 16,
    alignSelf: 'flex-start',
    marginTop: 5,
  },
  ValidationText: {
    fontFamily: 'Poppins-Medium',

    fontSize: 19,
    // marginTop: 30,
    alignSelf: 'flex-start',
  },
  loginButton: {
    height: 55,
    width: '100%',
    backgroundColor: '#42A3A3',
    marginTop: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  resetPinText: {
    fontFamily: 'Poppins-SemiBold',

    fontSize: 12,
    alignSelf: 'center',
    textDecorationLine: 'underline',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalBox: {
    backgroundColor: 'white',
    borderRadius: 12,
    width: '100%',
    paddingVertical: 30,
    alignItems: 'center',
    elevation: 5, // for Android shadow
    paddingHorizontal: 18,
  },
  modalText: {
    fontFamily: 'Poppins-SemiBold',
    color: '#2D2D2D',
    fontSize: 18,
    marginBottom: 5,
  },
});

export default PinScreen;

// import React, {useCallback, useState} from 'react';
// import {
//   Image,
//   Modal,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import {BlurView} from '@react-native-community/blur';
// import Colors from '../../constants/Colors';
// import useTranslate from '../../hooks/useTranslate';
// import ManualOtpInput from '../../components/ManualOTPInput';
// import PrimarySuccessButton from '../../components/PrimarySuccessButton';
// import {useDispatch} from 'react-redux';
// import {login} from '../../contexts/AuthSlice';
// import LoadingOverlay from '../../components/LoadingOverlay';
// import apiInstance from '../../services/ApiInstance';
// import {VERIFYPIN} from '../../services/ApiEndPoints';
// import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

// const PinScreen = ({navigation}) => {
//   const {t} = useTranslate();
//   const [otp, setOtp] = useState('');
//   const [loading, setLoading] = useState(false);

//   const getOtpCallBack = otp => {
//     setOtp(otp);
//   };

//   const [isResetModalVisible, setIsResetModalVisible] = useState(false);
//   const dispatch = useDispatch();

//   const callPostVerifyPin = useCallback(async () => {
//     setLoading(true);

//     try {
//       const response = await apiInstance.post(VERIFYPIN, {verifyPin: otp});

//       console.log('response is ----->', response);

//       if (response.status === 200) {
//         // success logic here
//         let data = response?.data?.data;
//         dispatch(login(data));
//       }
//     } catch (error) {
//       console.error('Error Logging in', error);
//     } finally {
//       setLoading(false);
//     }
//   }, [otp]);

//   const handleOtpFilled = value => {
//     if (!otp || otp.trim() === '') {
//       alert('Please enter pin');
//     } else if (otp?.length < 4) {
//       alert('Please enter valid pin!');
//     } else {
//       callPostVerifyPin();
//       //   dispatch(
//       //     login({
//       //       id: 'XYZ',
//       //       username: 'guest',
//       //       email: 'Guest@xyz.com',
//       //       firstName: 'Guest',
//       //       lastName: 'User',
//       //       gender: 'N/A',
//       //       image: 'N/A',
//       //       accessToken: 'N/A',
//       //       refreshToken: 'N/A',
//       //     }),
//       //   );
//     }
//   };

//   return (
//     <KeyboardAwareScrollView
//       style={{flex: 1, backgroundColor: '#111111'}}
//       contentContainerStyle={{flexGrow: 1}}
//       keyboardShouldPersistTaps="handled"
//       enableOnAndroid={true}>
//       <View style={{flex: 1}}>
//         <Modal
//           visible={isResetModalVisible}
//           transparent
//           animationType="fade"
//           onRequestClose={() => setVisible(false)}>
//           <View style={styles.modalOverlay}>
//             <View style={styles.modalBox}>
//               <Text style={styles.modalText}>{t('RESET_PIN')}</Text>

//               <View
//                 style={{
//                   width: 21,
//                   height: 2,
//                   alignSelf: 'center',
//                   backgroundColor: Colors.textGray,
//                 }}
//               />
//               <Text
//                 style={{
//                   textAlign: 'center',
//                   fontSize: 16,
//                   fontFamily: 'Poppins-Bold',
//                   marginTop: 20,
//                 }}>
//                 {t('FOR_RESETTING_PIN')}
//               </Text>

//               <View style={{width: '100%', marginTop: 30}}>
//                 <PrimarySuccessButton
//                   title={t('OK')}
//                   backgroundColor="#4BB7B7"
//                   onPress={() => {
//                     setIsResetModalVisible(false);
//                   }}
//                 />
//               </View>
//             </View>
//           </View>
//         </Modal>

//         <View style={{flex: 1, backgroundColor: '#111111'}}>
//           <LoadingOverlay loading={loading} />

//           <View
//             style={{
//               width: '100%',
//               flexDirection: 'row',
//               marginTop: 60,
//               paddingHorizontal: 15,
//             }}>
//             <TouchableOpacity
//               style={{width: 30, height: 30}}
//               activeOpacity={1}
//               onPress={() => {
//                 navigation.goBack();
//               }}>
//               <Image
//                 style={{width: 25, height: 25, resizeMode: 'contain'}}
//                 source={require('../../assets/images/ico_back.png')}
//               />
//             </TouchableOpacity>
//           </View>
//           <View style={{width: '100%', marginTop: -30, alignItems: 'center'}}>
//             <Text
//               style={{
//                 fontFamily: 'Quicksand-Bold',
//                 fontSize: 30,
//                 color: '#FFFFFF',
//               }}>
//               {'WELCOME TO'}
//             </Text>
//             <Text
//               style={{
//                 fontFamily: 'Quicksand-Bold',
//                 fontSize: 30,
//                 color: '#FFFFFF',
//               }}>
//               {'SCENEKEY!'}
//             </Text>
//           </View>

//           <View
//             style={{
//               flexDirection: 'row',
//               justifyContent: 'space-between',
//               marginTop: -40,
//             }}>
//             <Image
//               style={{resizeMode: 'contain', width: 150}}
//               source={require('../../assets/images/img_bg_pinscreen_left.png')}
//             />

//             <Image
//               style={{resizeMode: 'contain', width: 150}}
//               source={require('../../assets/images/img_bg_pinscreen_right.png')}
//             />
//           </View>

//           <View style={styles.blurredWrapper}>
//             {/* <BlurView
//           style={[
//             StyleSheet.absoluteFill,
//             {
//               backgroundColor: 'rgba(0, 0, 0, 0.7)',
//             },
//           ]}
//           blurType="dark" // or 'light', 'regular', etc.
//           blurAmount={10}
//           overlayColor={''}
//           reducedTransparencyFallbackColor="transparent"
//         /> */}
//             <Image
//               style={{
//                 width: 180,
//                 height: 180,
//                 resizeMode: 'cover',
//                 marginTop: 35,
//                 alignSelf: 'center',
//               }}
//               source={require('../../assets/images/ico_OTP.png')}
//             />

//             <Text style={styles.pinText}>{t('PIN_NUMBER')}</Text>

//             <ManualOtpInput sendOtp={getOtpCallBack} />

//             <View
//               style={{
//                 paddingHorizontal: 15,
//                 marginTop: 50,
//                 backgroundColor: 'transparent',
//               }}>
//               <PrimarySuccessButton
//                 title={t('LOGIN')}
//                 backgroundColor="#4BB7B7"
//                 onPress={() => {
//                   handleOtpFilled();
//                 }}
//               />
//             </View>

//             <TouchableOpacity
//               onPress={() => {
//                 setIsResetModalVisible(!isResetModalVisible);
//               }}
//               style={{alignSelf: 'center', marginTop: 20}}>
//               <Text style={styles.ResetPinText}>{t('RESET_PIN')}</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>
//     </KeyboardAwareScrollView>
//   );
// };

// export default PinScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   blurredWrapper: {
//     position: 'absolute',
//     top: '30%',
//     height: '100%',
//     width: '100%',
//   },
//   tintOverlay: {
//     flex: 1,
//     backgroundColor: '#191C2630', // 50% transparent overlay
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   pinText: {
//     fontFamily: 'Poppins-Medium',
//     color: '#BED3D3',
//     fontSize: 19,
//     alignSelf: 'center',
//     marginTop: 45,
//     marginBottom: 25,
//   },

//   ResetPinText: {
//     fontFamily: 'Poppins-Bold',
//     color: '#FFFFFF',
//     fontSize: 18,
//     alignSelf: 'center',
//     textDecorationLine: 'underline',
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.7)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalBox: {
//     backgroundColor: 'white',
//     padding: 20,
//     borderRadius: 12,
//     width: 320,
//     paddingVertical: 25,
//     alignItems: 'center',
//     elevation: 5, // for Android shadow
//   },
//   modalText: {
//     fontFamily: 'Poppins-Bold',
//     color: Colors.textGray,
//     fontSize: 18,
//     marginBottom: 7,
//   },
//   button: {
//     backgroundColor: 'black',
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     borderRadius: 8,
//   },
// });
