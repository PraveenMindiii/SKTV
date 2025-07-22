import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
  Platform,
  Alert,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {logout, login} from '../../contexts/AuthSlice';
import Colors from '../../constants/Colors';
import SelectLanguageModel from '../../components/SelectLanguageModel';
import {setTheme, getThemeMode} from '../../contexts/ThemeSlice';
import useTheme from '../../hooks/useTheme';
import useTranslate from '../../hooks/useTranslate';
import {MYPROFILE} from '../../services/ApiEndPoints';
import apiInstance, {get} from '../../services/ApiInstance';
import {useFocusEffect} from '@react-navigation/native';
import {getSafeAreaMode} from '../../contexts/SafeAreaSlice';
import {updateAppTheme} from '../../contexts/AppThemesSlice';

const MySpaceScreen = ({navigation}) => {
  const {theme} = useTheme();
  const {t} = useTranslate();
  const insets = useSelector(getSafeAreaMode);
  const dispatch = useDispatch();
  const currentTheme = useSelector(getThemeMode);
  const {user} = useSelector(state => state.auth);
  const [isLangugeVisibleModel, setIsLangugeVisibleModel] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({});
  const [isToken, setIsToken] = useState(user?.token);
  const appTheme = useSelector(state => state.appthemes);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(
      updateAppTheme({
        themeName: 'Default Theme',
        themeSubName: 'Tesla',
        themeColor: '#42A3A3',
        // themeBackgroundColor:string,
        themeGradientColorOne: 'rgba(73, 218, 218, 1)',
        themeGadientColorSecond: 'rgba(66, 163, 163, 1)',
      }),
    );
  };

  useFocusEffect(
    useCallback(() => {
      console.log('User data is ---->', user?.token);
      console.log('Profile pic', user?.profileImg);

      if (isToken) {
        callGetMyProfile();
        setIsToken(true);
      }

      return () => {
        // Optional cleanup code here
      };
    }, []),
  );

  const callGetMyProfile = useCallback(async () => {
    setLoading(true);

    try {
      const response = await get({
        url: MYPROFILE,
        params: '',
        token: user?.token,
      });

      console.log('response get my profile', response);

      if (response?.code === 200) {
        let data = response?.data;
        // console.log('data is ---->', data);
        setUserData(data);
        dispatch(login({...data, token: user?.token}));
      }
    } catch (error) {
      console.error('Error Logging in', error);
    } finally {
      setLoading(false);
    }
  }, [user?.token]);

  const toggleTheme = () => {
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    dispatch(setTheme(newTheme));
  };
  return (
    <ScrollView
      bounces={false}
      contentContainerStyle={{
        flexGrow: 1,
        backgroundColor: theme('background'),
      }}>
      <StatusBar
        backgroundColor={theme('second_background')}
        translucent={false}
        barStyle={currentTheme === 'light' ? 'dark-content' : 'light-content'}
      />
      <SelectLanguageModel
        visible={isLangugeVisibleModel}
        onClose={() => setIsLangugeVisibleModel(false)}
        title={t('App_Language')}
      />
      <View style={{paddingBottom: insets.bottom + 60}}>
        <View
          style={{
            flex: 1,
            backgroundColor: theme('second_background'),

            paddingTop: insets.top + 30,
            borderBottomRightRadius: 30,
            borderBottomLeftRadius: 30,
          }}>
          <View
            style={{
              marginHorizontal: 15,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <View style={{height: 80, width: 80}}>
              <Image
                source={
                  userData?.profileImg
                    ? {uri: userData?.profileImg}
                    : require('../../assets/images/img_default_user.png')
                }
                style={{
                  height: '100%',
                  width: '100%',
                  resizeMode: 'cover',
                  borderRadius: 15,
                }}
              />
            </View>

            {isToken && (
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                  navigation.navigate('EditProfileScreen');
                }}
                style={{
                  flexDirection: 'row',
                  gap: 10,
                }}>
                <Text
                  style={{
                    color: theme('sub_heading'),
                    fontFamily: 'Quicksand-SemiBold',
                    fontSize: 14,
                  }}>
                  {t('EDITPROFILE')}
                </Text>
                <View style={{height: 24, width: 24}}>
                  <Image
                    style={{height: 20, width: 20, resizeMode: 'contain'}}
                    source={
                      currentTheme === 'light'
                        ? require('../../assets/images/icon_light_edit.png')
                        : require('../../assets/images/ico_edit.png')
                    }
                  />
                </View>
              </TouchableOpacity>
            )}
          </View>

          <View style={{marginTop: 20, marginBottom: 20, marginHorizontal: 15}}>
            <Text
              style={{
                color: theme('heading'),
                fontFamily: 'Quicksand-SemiBold',
                fontSize: 24,
              }}>
              {userData?.fullname ? userData?.fullname : user?.fullname}
            </Text>
            <Text
              style={{
                color: theme('light_text_color'),
                fontFamily: 'Quicksand-Regular',
                fontSize: 14,
              }}>
              {userData?.email ? userData?.email : user?.email}
            </Text>
            {/* <Text
              style={{
                color: theme('app_secondary_color'),
                fontFamily: 'Quicksand-Medium',
                fontSize: 14,
              }}>
              +1 968 558 6856
            </Text> */}
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 20,
              marginHorizontal: 15,
              backgroundColor: theme('container_background'),
              padding: 15,
              alignItems: 'center',
              borderRadius: 9,
            }}>
            <View style={{gap: 8}}>
              <Text
                style={{
                  color: theme('heading'),
                  fontFamily: 'Quicksand-Medium',
                  fontSize: 16,
                }}>
                Monthly
              </Text>
              <Text
                style={{
                  color: theme('light_text_color'),
                  fontFamily: 'Quicksand-Regular',
                  fontSize: 12,
                }}>
                Expiry : 15/04/2025
              </Text>
            </View>
            <View>
              <Text
                style={{
                  color: appTheme?.themeColor,
                  fontFamily: 'Quicksand-Medium',
                  fontSize: 16,
                }}>
                Basic Plan
              </Text>
            </View>
          </View>
        </View>

        <View
          style={{
            backgroundColor: theme('background'),
            justifyContent: 'space-between',
            flex: 1,
          }}>
          <View style={{padding: 15, paddingTop: 20}}>
            <TouchableOpacity
              style={{flexDirection: 'row', justifyContent: 'space-between'}}
              activeOpacity={1}>
              <View style={{flexDirection: 'row', gap: 15}}>
                <Image
                  style={{height: 20, width: 20, resizeMode: 'contain'}}
                  source={
                    currentTheme === 'light'
                      ? require('../../assets/images/icon_light_user.png')
                      : require('../../assets/images/ico_WorkSpace.png')
                  }
                />
                <Text
                  style={{
                    color: theme('heading'),
                    fontFamily: 'Quicksand-Medium',
                    fontSize: 14,
                  }}>
                  {t('ACCOUNTSETTING')}
                </Text>
              </View>
              <View>
                <Image
                  style={{height: 20, width: 10, resizeMode: 'contain'}}
                  source={
                    currentTheme === 'light'
                      ? require('../../assets/images/icon_light_arrow.png')
                      : require('../../assets/images/ico_arrow.png')
                  }
                />
              </View>
            </TouchableOpacity>
            <View
              style={{
                height: 0.5,
                backgroundColor: Colors.blankView,
                marginTop: 15,
              }}
            />

            {/* <TouchableOpacity
              onPress={() => {
                setIsLangugeVisibleModel(true);
              }}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingTop: 15,
              }}
              activeOpacity={1}>
              <View style={{flexDirection: 'row', gap: 15}}>
                <Image
                  style={{height: 20, width: 20, resizeMode: 'contain'}}
                  source={
                    currentTheme === 'light'
                      ? require('../../assets/images/icon_light_language.png')
                      : require('../../assets/images/ico_language.png')
                  }
                />
                <Text
                  style={{
                    color: theme('heading'),
                    fontFamily: 'Quicksand-Medium',
                    fontSize: 14,
                  }}>
                  {t('APPLANGUAGE')}
                </Text>
              </View>
              <View>
                <Image
                  style={{height: 20, width: 10, resizeMode: 'contain'}}
                  source={
                    currentTheme === 'light'
                      ? require('../../assets/images/icon_light_arrow.png')
                      : require('../../assets/images/ico_arrow.png')
                  }
                />
              </View>
            </TouchableOpacity>

            <View
              style={{
                height: 0.5,
                backgroundColor: Colors.blankView,
                marginTop: 15,
              }}
            /> */}

            {user?.token && (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('AppThemes');
                }}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingTop: 15,
                }}
                activeOpacity={1}>
                <View style={{flexDirection: 'row', gap: 15}}>
                  <Image
                    style={{height: 20, width: 20, resizeMode: 'contain', tintColor: currentTheme === 'light' ? "#111111" : "#FFFFFF"}}
                    source={ require('../../assets/images/ico_theme.png')
                    }
                  />
                  <Text
                    style={{
                      color: theme('heading'),
                      fontFamily: 'Quicksand-Medium',
                      fontSize: 14,
                    }}>
                    {t('THEMES')}
                  </Text>
                </View>
                <View>
                  <Image
                    style={{height: 20, width: 10, resizeMode: 'contain'}}
                    source={
                      currentTheme === 'light'
                        ? require('../../assets/images/icon_light_arrow.png')
                        : require('../../assets/images/ico_arrow.png')
                    }
                  />
                </View>
              </TouchableOpacity>
            )}
            {user?.token && (
              <View
                style={{
                  height: 0.5,
                  backgroundColor: Colors.blankView,
                  marginTop: 15,
                }}
              />
            )}
            <TouchableOpacity
              onPress={toggleTheme}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingTop: 15,
              }}
              activeOpacity={1}>
              <View style={{flexDirection: 'row', gap: 15}}>
                <Image
                  style={{height: 20, width: 20, resizeMode: 'contain'}}
                  source={
                    currentTheme === 'light'
                      ? require('../../assets/images/gg_dark-mode.png')
                      : require('../../assets/images/ico_dark-mode.png') // Light mode icon agar hai toh
                  }
                />
                <Text
                  style={{
                    color: theme('heading'),
                    fontFamily: 'Quicksand-Medium',
                    fontSize: 14,
                  }}>
                  {t('LIGHTMODE')}
                </Text>
              </View>
              <View>
                <Image
                  style={{
                    height: 30,
                    width: 30,
                    resizeMode: 'contain',
                    tintColor: appTheme?.tintColor,
                  }}
                  source={
                    currentTheme === 'light'
                      ? require('../../assets/images/ico_lightmode_on.png')
                      : require('../../assets/images/ico_lightmode_off.png')
                  }
                />
              </View>
            </TouchableOpacity>
            <View
              style={{
                height: 0.5,
                backgroundColor: Colors.blankView,
                marginTop: 10,
              }}
            />

            <TouchableOpacity
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingTop: 15,
              }}
              activeOpacity={1}>
              <View style={{flexDirection: 'row', gap: 15}}>
                <Image
                  style={{height: 20, width: 20, resizeMode: 'contain'}}
                  source={
                    currentTheme === 'light'
                      ? require('../../assets/images/icon_light_help-.png')
                      : require('../../assets/images/ico_help.png')
                  }
                />

                <Text
                  style={{
                    color: theme('heading'),
                    fontFamily: 'Quicksand-Medium',
                    fontSize: 14,
                  }}>
                  {t('HELPSUPPORT')}
                </Text>
              </View>
              <View>
                <Image
                  style={{height: 20, width: 10, resizeMode: 'contain'}}
                  source={
                    currentTheme === 'light'
                      ? require('../../assets/images/icon_light_arrow.png')
                      : require('../../assets/images/ico_arrow.png')
                  }
                />
              </View>
            </TouchableOpacity>
          </View>

          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              paddingBottom: insets.bottom + 50,
              paddingTop: 50,
              paddingBottom: 50,
            }}>
            <TouchableOpacity
              onPress={() => {
                Alert.alert(
                  '',
                  'Are you sure you want to logout?',
                  [
                    {
                      text: 'Cancel',
                      onPress: () => console.log('Cancel Pressed'),
                      style: 'cancel',
                    },
                    {
                      text: 'OK',
                      onPress: () => {
                        handleLogout();
                      },
                    },
                  ],
                  {cancelable: false},
                );
              }}
              activeOpacity={1}>
              <Text
                style={{
                  color: appTheme?.themeColor,
                  fontFamily: 'Quicksand-Medium',
                  fontSize: 16,
                }}>
                {t('LOGOUT')}
              </Text>
            </TouchableOpacity>

            <View
              style={{
                flexDirection: 'row',
                gap: 10,
                justifyContent: 'center',
                alignItems: 'center',

                marginHorizontal: 15,
              }}>
              <Text
                style={{
                  color: theme('subText'),
                  fontFamily: 'Quicksand-Medium',
                  fontSize: 13,
                }}>
                {t('TERMSCONDITION')}
              </Text>

              <View
                style={{
                  width: 1,
                  height: 12,
                  backgroundColor: '#8F8F8F',
                  marginTop: Platform.OS == 'android' ? 5 : 2,
                }}
              />

              <Text
                style={{
                  color: '#8F8F8F',
                  fontFamily: 'Quicksand-Medium',
                  fontSize: 13,
                }}>
                {t('PRIVACYPOLICY')}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default MySpaceScreen;
