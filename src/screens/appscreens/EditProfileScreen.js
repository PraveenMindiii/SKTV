import {
  View,
  Text,
  ScrollView,
  StatusBar,
  Image,
  Keyboard,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from 'react-native';
import {useCallback, useEffect, useRef, useState} from 'react';
import Colors from '../../constants/Colors';
import HeadersAppScreen from '../../components/HeadersAppScreen';
import PrimarySuccessButton from '../../components/PrimarySuccessButton';
import AuthTextInputField from '../../components/AuthTextInputFiled';
import CustomCountrycodeWithPhoneNumber from '../../components/CustomCountrycodeWithPhoneNumber';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {
  ValidateEmail,
  ValidateFirstName,
  ValidateLastName,
  ValidatePhoneNumber,
} from '../../utils/Validations';
import useTranslate from '../../hooks/useTranslate';
import {useDispatch, useSelector} from 'react-redux';
import {UPDATEPROFILE} from '../../services/ApiEndPoints';
import LoadingOverlay from '../../components/LoadingOverlay';
import {post} from '../../services/ApiInstance';
import {logout, login} from '../../contexts/AuthSlice';
import {getSafeAreaMode} from '../../contexts/SafeAreaSlice';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {getThemeMode} from '../../contexts/ThemeSlice';

const EditProfileScreen = ({navigation}) => {
  const insets = useSelector(getSafeAreaMode);
  const insetss = useSafeAreaInsets();
  const currentTheme = useSelector(getThemeMode);
  const {t} = useTranslate();
  const [modalVisible, setModalVisible] = useState(false);
  const lastNameRef = useRef(null);
  const emailRef = useRef(null);
  const phoneNumberRef = useRef(null);
  const [firstName, setFirstName] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const [emailErrorText, setEmailErrorText] = useState('');
  const [firstNameErrorText, setFirstNameErrorText] = useState('');
  const [lastNameErrorText, setLastNameErrorText] = useState('');
  const [phoneNumberErrorText, setPhoneNumberErrorText] = useState('');
  const [loading, setLoading] = useState(false);
  const {user} = useSelector(state => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user?.fullname) {
      setFirstName(user?.fullname);
    }
    if (user?.email) {
      setEmail(user?.email);
    }
  }, [user?.fullname]);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const callUpdateProfile = useCallback(async () => {
    setLoading(true);

    try {
      const response = await post({
        url: UPDATEPROFILE,
        params: {
          fullname: firstName.trim(),
          profileImage: profilePic
            ? profilePic
            : user?.profileImg
            ? user?.profileImg
            : '',
        },
        token: user?.token,
      });

      if (response?.code == 200) {
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error Logging in', error);
    } finally {
      setLoading(false);
    }
  }, [firstName, profilePic, user?.profileImg, user?.token]);

  const handleSuccessButton = () => {
    console.log('Coming in the handle save ');

    const isFirstNameValid = ValidateFirstName(firstName);
    const isEmailValid = ValidateEmail(email);
    if (!isFirstNameValid.isValid) {
      setFirstNameErrorText(isFirstNameValid.message);
      return;
    }

    if (!isEmailValid.isValid) {
      console.log('Coming in this block');

      setEmailErrorText(isEmailValid.message);
      return;
    }

    callUpdateProfile();
  };

  const openCamera = async () => {
    try {
      const result = await launchCamera({
        mediaType: 'photo',
        includeBase64: true,
      });
      if (result.didCancel) {
        console.log('User cancelled image picker');
      } else if (result.errorCode) {
        console.log('ImagePicker Error: ', result.errorMessage);
      } else {
        const imageUri = result.assets[0].uri;
        // Handle the image URI, e.g., display it or upload it
        setProfilePic(imageUri);
        setModalVisible(false);
      }
    } catch (error) {
      console.log('error --->>>', error);
    }
  };

  const openGallery = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      includeBase64: true,
    });
    if (result.didCancel) {
      console.log('User cancelled image picker');
    } else if (result.errorCode) {
      console.log('ImagePicker Error: ', result.errorMessage);
    } else {
      const imageUri = result.assets[0].uri;
      // Handle the image URI, e.g., display it or upload it

      setProfilePic(imageUri);
      setModalVisible(false);
    }
  };

  return (
    <ScrollView
      bounces={false}
      contentContainerStyle={{
        flexGrow: 1,
        backgroundColor:
          currentTheme == 'dark' ? Colors.screen_bgcolor : Colors.white,
      }}>
      <StatusBar
        backgroundColor="transparent"
        translucent
        barStyle="light-content"
      />

      <LoadingOverlay loading={loading} />

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.optionBtn} onPress={openCamera}>
              <Text
                style={[
                  styles.optionText,
                  {
                    color: modalVisible
                      ? Colors.app_primary_color
                      : Colors.white,
                  },
                ]}>
                {t('OPEN_CAMERA')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionBtn} onPress={openGallery}>
              <Text
                style={[
                  styles.optionText,
                  {
                    color: modalVisible
                      ? Colors.app_primary_color
                      : Colors.white,
                  },
                ]}>
                {t('OPEN_GALLERY')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.optionBtn,
                {backgroundColor: Colors.blankContainer},
              ]}
              onPress={() => setModalVisible(false)}>
              <Text style={[styles.optionText, {color: '#000'}]}>{t('Cancel')}</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
      <View
        style={{
          paddingTop: insets.top,
          flex: 1,
          paddingBottom: insets.bottom + 20,
        }}>
        <View style={{justifyContent: 'space-between', flex: 1,}}>
          <View>
            <HeadersAppScreen
              TitleName={t('EDITPROFILE')}
              onPress={handleGoBack}
            />
            <View
              style={{
                alignItems: 'center',
                marginTop: 30,
              }}>
              <Image
                style={{
                  height: 165,
                  width: 165,
                  borderRadius: 24,
                }}
                resizeMode="cover"
                source={
                  profilePic
                    ? {uri: profilePic}
                    : user?.profileImg
                    ? {uri: user?.profileImg}
                    : require('../../assets/images/img_default_user.png')
                }
              />

              <TouchableOpacity
                onPress={() => {
                  setModalVisible(true);
                }}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 30,
                  flexDirection: 'row',
                  gap: 8,
                  paddingVertical: 7,
                  paddingHorizontal: 10,
                  borderRadius: 6,
                  borderWidth: 1,
                  borderColor: Colors.app_primary_color,
                }}>
                <Text
                  style={{
                    fontFamily: 'Quicksand-SemiBold',
                    fontSize: 16,
                    color: Colors.app_primary_color,
                  }}>
                  {t('CHANGEPROFILE')}
                </Text>
                <Image
                  style={{height: 20, width: 20}}
                  source={require('../../assets/images/tabler_camera.png')}
                />
              </TouchableOpacity>
            </View>

            <View style={{marginTop: 25}}>
              <AuthTextInputField
                ImageValue={require('../../assets/images/ico_user.png')}
                value={firstName}
                placeholder={t('FULLNAME')}
                ref={null}
                placeholderTextColor={'#677D7D'}
                keyboardType="default"
                returnKeyType="next"
                onSubmitEditing={() => emailRef?.current?.focus()}
                maxLength={30}
                onChangeText={text => {
                  setEmailErrorText('');
                  setFirstNameErrorText('');
                  const filteredText = text.replace(/[^A-Za-z\s]/g, '');
                  setFirstName(filteredText);
                }} 
                errorMessage={t(firstNameErrorText)}
                blurOnSubmit={false}
              />
              {/* <View style={{height: 25}} />
              <AuthTextInputField
                ImageValue={require('../../assets/images/ico_user.png')}
                value={lastName}
                ref={lastNameRef}
                placeholder={t('Last name')}
                placeholderTextColor={'#677D7D'}
                keyboardType="default"
                returnKeyType="next"
                onSubmitEditing={() => emailRef?.current?.focus()}
                maxLength={30}
                onChangeText={setLastName}
                errorMessage={lastNameErrorText}
                blurOnSubmit={false}
              /> */}

              <View style={{height: 25}} />

              <AuthTextInputField
                ImageValue={require('../../assets/images/ico_email.png')}
                value={email}
                ref={emailRef}
                placeholder={'chrish.evansh@gmail.com'}
                placeholderTextColor={'#677D7D'}
                keyboardType="email"
                returnKeyType="done"
                // onSubmitEditing={() => phoneNumberRef?.current?.focus()}
                maxLength={30}
                editable={false}
                // onChangeText={text => {
                //   setEmailErrorText('');
                //   setFirstNameErrorText('');
                //   setEmail(text);
                // }}
                errorMessage={t(emailErrorText)}
                blurOnSubmit={false}
              />
              <View style={{height: 25}} />
              {/* <AuthTextInputField
              ImageValue={require('../../assets/images/ico_email.png')}
              value={email}
              ref={emailRef}
              placeholder={t('EMAIL')}
              placeholderTextColor={'#677D7D'}
              maxLength={30}
              onChangeText={setEmail}
              blurOnSubmit={false}
              editable={false}
            /> */}
            </View>
          </View>

          <View style={{marginHorizontal: 15, marginTop: 25}}>
            <PrimarySuccessButton
              onPress={() => {
                handleSuccessButton();
              }}
              title={t('SAVE')}
              backgroundColor="#4BB7B7"
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // for demo
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  openButton: {
    fontSize: 18,
    color: 'blue',
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContainer: {
    backgroundColor: '#202121',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  optionBtn: {
    paddingVertical: 10,
    alignItems: 'center',

    borderRadius: 10,
    marginBottom: 10,
  },
  optionText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
