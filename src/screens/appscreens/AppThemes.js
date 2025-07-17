import React, {useCallback, useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
// import { getThemeMode } from "../../contexts/ThemeSlice";
// import useTranslate from "../../hooks/useTranslate";
// import { useSelector } from "react-redux";
// import { getSafeAreaMode } from "../../contexts/SafeAreaSlice";
// import { Colors } from "react-native/Libraries/NewAppScreen";
import {CommonHeader} from '../../components/CommonHeader';
import {useTranslation} from 'react-i18next';
import useTranslate from '../../hooks/useTranslate';
import {updateAppTheme} from '../../contexts/AppThemesSlice';
import {useDispatch, useSelector} from 'react-redux';
import {GETTHEMESLIST} from '../../services/ApiEndPoints';
import {useFocusEffect} from '@react-navigation/native';
import LoadingOverlay from '../../components/LoadingOverlay';
import apiInstance, {get, put} from '../../services/ApiInstance';
import AsyncStorage from '@react-native-async-storage/async-storage';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

// Theme list
const arrThemeImages = {
  teslaImages: [
    require('../../assets/images/themes/img_theme_tesla0.png'),
    require('../../assets/images/themes/img_theme_tesla1.png'),
    require('../../assets/images/themes/img_theme_tesla2.png'),
  ],
  vogueImages: [
    require('../../assets/images/themes/img_theme_vogue0.png'),
    require('../../assets/images/themes/img_theme_vogue1.png'),
    require('../../assets/images/themes/img_theme_vogue2.png'),
  ],
  powerImages: [
    require('../../assets/images/themes/img_theme_power0.png'),
    require('../../assets/images/themes/img_theme_power1.png'),
    require('../../assets/images/themes/img_theme_power2.png'),
  ],
  defenderImages: [
    require('../../assets/images/themes/img_theme_defender0.png'),
    require('../../assets/images/themes/img_theme_defender1.png'),
    require('../../assets/images/themes/img_theme_defender2.png'),
  ],
  festivalImages: [
    require('../../assets/images/themes/img_theme_festival0.png'),
    require('../../assets/images/themes/img_theme_festival1.png'),
    require('../../assets/images/themes/img_theme_festival2.png'),
  ],
};

const AppThemes = ({navigation}) => {
  const {t} = useTranslate();
  // const insets = useSelector(getSafeAreaMode);
  const currentDarkMode = 'dark';
  const [selectedIndex, setSelectedIndex] = useState();
  const [appliedTheme, setAppliedTheme] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const dispatch = useDispatch();
  const {user} = useSelector(state => state.auth);
  const appTheme = useSelector(state => state.appthemes);
  const [loading, setLoading] = useState(false);
  const [themeList, setThemeList] = useState([]);

  useEffect(() => {
    if (user?.token) {
      callGetThemesList();
    }
  }, [user?.token]);

  // useEffect(() => {
  //   for (let theme in themeList) {
  //     if (theme?.themeId == appTheme?.themeId) {
  //       setAppliedTheme(theme.id);
  //     } else {
  //       setAppliedTheme(0);
  //     }
  //   }
  // }, [themeList]);

  const handleShowImage = img => {
    setSelectedIndex(-1)
    setIsModalVisible(true);
    setShowImage(img);
  };

  const obj = {
    '#49DADA': arrThemeImages.teslaImages,
    '#7F029A': arrThemeImages.vogueImages,
    '#000000': arrThemeImages.powerImages,
    '#2C5F34': arrThemeImages.defenderImages,
    '#E9C945': arrThemeImages.festivalImages,
  };

  const callGetThemesList = useCallback(async () => {
    if (!user?.token) return;
    setLoading(true);

    try {
      const response = await get({
        url: GETTHEMESLIST,
        params: '',
        token: user?.token,
      });

      if (response?.code === 200) {
        let data = response?.data;
        let updatedArr = data.map((item, index) => {
          const parts = item.title.split('-');
          return {
            id: index,
            themeId: item._id,
            themeTitle: parts[0],
            themeVarient: parts[1],
            themeColor: item.colourCode,
            images: obj[item?.colourCode] ? obj[item?.colourCode] : '',
            // item.colourCode == '#49DADA'
            //   // ? arrThemeImages.teslaImages
            //   // : item.colourCode == '#7F029A'
            //   // ? arrThemeImages.vogueImages
            //   // : item.colourCode == '#000000'
            //   // ? arrThemeImages.powerImages
            //   // : item.colourCode == '#2C5F34'
            //   // ? arrThemeImages.defenderImages
            //   // : item.colourCode == '#E9C945'
            //   // ? arrThemeImages.festivalImages
            //   : '',
            themeGradientColor: item?.gradientCode ? item?.gradientCode : '',
          };
        });

        const tempArr = updatedArr.filter(item => item.images != '');
        setThemeList(tempArr);
        for (let i in tempArr) {
          if (tempArr[i]?.themeColor == `${appTheme?.themeColor}`) {
            setAppliedTheme(tempArr[i]?.id);
            break;
          } else {
            setAppliedTheme(0);
          }
        }
      }
    } catch (error) {
      console.error('Error Logging in', error);
    } finally {
      setLoading(false);
    }
  }, [user?.token]);

  const callUpdateUserTheme = useCallback(async themeId => {
    setLoading(true);

    try {
      const url = `/themes/changeUserTheme/${themeId}`;

      const response = await put(
        {
        url: url,
        params: {id: themeId},
        token: user?.token,
      });


      if (response.status === 200) {
      }
    } catch (error) {
      if (error.response) {
        console.log(
          'Backend Error Response:',
          JSON.stringify(error.response.data),
        );
      }
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <>
      <LoadingOverlay loading={loading} />
      <View style={{flex: 1}}>
        {/* Modal */}
        {selectedIndex >= 0 && (
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              zIndex: 20,
              width: '100%',
              borderWidth: 0.5,
            }}>
            <View
              style={[
                styles.bottomView,
                {
                  backgroundColor: '#000000',
                },
              ]}>
              <TouchableOpacity
                style={styles.applyButton}
                onPress={async () => {
                  setAppliedTheme(selectedIndex);
                  // dispatch(updateAppTheme(themeList[selectedIndex]));
                  dispatch(
                    updateAppTheme({
                      themeName: themeList[selectedIndex].themeTitle,
                      themeSubName: themeList[selectedIndex].themeVarient,
                      themeColor: themeList[selectedIndex].themeColor,
                      themeGradientColorOne:
                        themeList[selectedIndex].themeColor,
                      themeGadientColorSecond: themeList[selectedIndex]
                        .gradientCode
                        ? themeList[selectedIndex].themeColor
                        : themeList[selectedIndex].themeColor,
                    }),
                  );

                  callUpdateUserTheme(themeList[selectedIndex].themeId);
                  try {
                    await AsyncStorage.setItem(
                      'app_theme',
                      JSON.stringify({
                        themeName: themeList[selectedIndex].themeTitle,
                        themeSubName: themeList[selectedIndex].themeVarient,
                        themeColor: themeList[selectedIndex].themeColor,
                        themeGradientColorOne:
                          themeList[selectedIndex].themeColor,
                        themeGadientColorSecond: themeList[selectedIndex]
                          .gradientCode
                          ? themeList[selectedIndex].themeColor
                          : themeList[selectedIndex].themeColor,
                      }),
                    );
                    console.log('Theme saved to AsyncStorage');
                  } catch (error) {
                    console.error('Failed to save theme:', error);
                  }
                  setSelectedIndex(-1);
                }}>
                <Text
                  style={{
                    color: '#000000',
                    fontFamily: 'Poppins-Bold',
                    fontSize: 15,
                  }}>
                  {/* {t('Apply_theme') || 'Apply Theme'} */}
                  {'Apply Theme'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <Modal visible={isModalVisible} transparent statusBarTranslucent>
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              source={showImage}
              style={{
                // width: screenWidth * 0.9,
                // height: screenHeight * 0.85,
                // aspectRatio: 0.55,
                resizeMode: 'contain',
                borderRadius: 30,
              }}
            />
            <TouchableOpacity
              onPress={() => {
                setIsModalVisible(false);
              }}
              style={{marginTop: 25}}>
              <Image
                style={{height: 40, width: 40, resizeMode: 'contain'}}
                source={require('../../assets/images/cancle_icon.png')}
              />
            </TouchableOpacity>
          </View>
        </Modal>

        {/* Main container */}
        <View
          style={{
            flex: 1,
            paddingBottom: 50,
            marginTop: 0,
            backgroundColor: '#FFFFFF',
            paddingHorizontal: 15,
          }}>
          {/* Status bar */}
          <StatusBar
            backgroundColor="#FFFFFF"
            translucent={true}
            barStyle="dark-content"
          />

          {/* Top back button and heading */}
          <CommonHeader
            title={t('themes')}
            onLeftPress={() => {
              navigation?.goBack();
            }}
          />

          {/* Flat list for all themes */}
          <FlatList
            data={themeList}
            keyExtractor={item => item?.id?.toString()}
            contentContainerStyle={{paddingVertical: 15, paddingBottom: 50}}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={{height: 20}} />}
            renderItem={({item}) => (
              <CommonView
                themeTitle={item?.themeTitle}
                themeVarient={item.themeVarient}
                appliedTheme={appliedTheme === item.id}
                isChecked={selectedIndex === item.id}
                currentDarkMode={currentDarkMode}
                language={t}
                images={item.images}
                showImage={handleShowImage}
                onSelect={() => {
                  if (selectedIndex === item.id) {
                    setSelectedIndex(-1);
                  } else {
                    setSelectedIndex(item.id);
                  }
                }}
              />
            )}
          />
        </View>
      </View>
    </>
  );
};

export default AppThemes;

const CommonView = ({
  themeTitle,
  themeVarient,
  appliedTheme,
  isChecked,
  onSelect,
  showImage,
  language,
  images,
}) => {
  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Text
          style={{
            color: '#000000',
            fontSize: 15,
            fontFamily: 'Poppins-Bold',
            fontWeight: '500',
          }}>
          {themeTitle}
          <Text
            style={{
              color: '#626262',
              fontSize: 15,
              fontFamily: 'Poppins-Medium',
              fontWeight: '500',
            }}>
            {' - '}
            {themeVarient}
          </Text>
        </Text>
        {appliedTheme ? (
          <Text
            style={{
              color: '#06841C',
              fontSize: 15,
              fontFamily: 'Poppins-Bold',
              fontWeight: '500',
            }}>
            {language('APPLIED')}
          </Text>
        ) : (
          <TouchableOpacity
            activeOpacity={1}
            onPress={onSelect}
            style={{
              height: 23,
              width: 23,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              source={
                isChecked
                  ? require('../../assets/images/active_circle_icon.png')
                  : require('../../assets/images/inactive_circle_icon.png')
              }
              style={{
                height: 20,
                width: 20,
                resizeMode: 'contain',
              }}
            />
          </TouchableOpacity>
        )}
      </View>
      <View style={{height: 10}} />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        {images?.map((img, index) => (
          <TouchableOpacity
            onPress={() => {
              showImage(images[index]);
            }}
            style={{
              width: '31%',
              aspectRatio: 2 / 3,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              key={index}
              source={img}
              style={{
                width: '100%',
                height: '100%',
                resizeMode: 'contain',
              }}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomView: {
    paddingHorizontal: 20,
    paddingVertical: 35,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    elevation: 10,
  },
  applyButton: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
});
