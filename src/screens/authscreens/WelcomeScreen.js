import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  StatusBar,
  Pressable,
} from 'react-native';
import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import useTranslate from '../../hooks/useTranslate';
import SelectLanguageModel from '../../components/SelectLanguageModel';
import PrimarySuccessButton from '../../components/PrimarySuccessButton';
import Colors from '../../constants/Colors';
import {login} from '../../contexts/AuthSlice';
import WelcomeImageCarousel from '../../components/WelcomeImageCarousel';
import {ConstValues} from '../../constants/ConstValues';
import useTheme from '../../hooks/useTheme';
import {getThemeMode} from '../../contexts/ThemeSlice';
import {getSafeAreaMode} from '../../contexts/SafeAreaSlice';

const WelcomeScreen = ({navigation}) => {
  const {theme} = useTheme();
  const currentTheme = useSelector(getThemeMode);
  const dispatch = useDispatch();
  const insets = useSelector(getSafeAreaMode);
  const [isLangugeVisibleModel, setIsLangugeVisibleModel] = useState(false);
  const {t} = useTranslate();
  const background = theme('background');
  const appTheme = useSelector(state => state.appthemes);
  const heading = theme('heading');
  const handleLoginAsaGuest = () => {
    dispatch(
      login({
        _id: '685ebb2353e0e15603969a30',
        fullname: 'Guest',
        email: 'Guest',
        password: '',
        profileImg: '',
        signupType: 'normal',
        notificationEnable: true,
        isActive: true,
        token: '',
      }),
    );
  };

  useEffect(() => {
    console.log('CUrrent theme is ----_>', currentTheme);
  }, []);
  return (
    <ScrollView
      bounces={false}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        flexGrow: 1,
        backgroundColor: background,
      }}>
      <StatusBar
        backgroundColor={'transparent'}
        translucent={true}
        barStyle={currentTheme === 'light' ? 'dark-content' : 'light-content'}
      />
      <SelectLanguageModel
        visible={isLangugeVisibleModel}
        onClose={() => setIsLangugeVisibleModel(false)}
        title={'App Language'}
      />
      <View
        style={{
          flex: 1,
          justifyContent: 'space-between',
          alignContent: 'center',
          backgroundColor: background,
          paddingBottom: insets.bottom + 20,
        }}>
        <View>
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
              source={require('../../assets/images/icon_languages.png')}
            />
          </Pressable> */}
          <WelcomeImageCarousel />
          <Text style={[styles.welcomeHeading, {color: heading}]}>
            {t('WELCOME_HEADING')}
          </Text>
          <Text style={[styles.welcomeSubHeading, {color: heading}]}>
            {t('WELCOME_SUBHEADING')}
          </Text>
        </View>
        <View style={{height: 15}} />
        <View>
          <View style={{paddingHorizontal: 15}}>
            <PrimarySuccessButton
              title={t('LOGIN')}
              backgroundColor={appTheme?.themeColor}
              onPress={() => {
                navigation.navigate('PinScreen');
              }}
            />
          </View>

          <View style={{height: 15}} />
          <View style={{paddingHorizontal: 15}}>
            <View
              style={{
                borderWidth: 1,
                borderColor: '#F9F9F9',
                borderRadius: 10,
              }}>
              <PrimarySuccessButton
                title={t('NO_PIN_ACCESS')}
                isNoPin={true}
                backgroundColor={background}
                borderColor="#F9F9F9"
                onPress={() => {
                  // navigation.navigate('SignupScreen');
                  handleLoginAsaGuest();
                }}
              />
            </View>
          </View>
          {/* <Pressable
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 10,
            }}
            onPress={handleLoginAsaGuest}>
            <Text
              style={{
                color: heading,
                fontFamily: 'Quicksand-Medium',
                fontSize: 15,
                textDecorationLine: 'underline',
              }}>
              {t('EXPLORE_AS_A_GUEST')}
            </Text>
          </Pressable> */}
        </View>
      </View>
    </ScrollView>
  );
};
export default WelcomeScreen;

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
});
