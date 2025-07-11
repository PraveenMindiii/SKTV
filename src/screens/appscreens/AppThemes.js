import React, {useState} from 'react';
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import HeadersAppScreen from '../../components/HeadersAppScreen';
import {getThemeMode} from '../../contexts/ThemeSlice';
import useTranslate from '../../hooks/useTranslate';
import {useSelector} from 'react-redux';
import {getSafeAreaMode} from '../../contexts/SafeAreaSlice';
import {Colors} from 'react-native/Libraries/NewAppScreen';

const img_theme = require('../../assets/images/img_theme_green.png');
const AppThemes = ({navigation}) => {
  const {t} = useTranslate();
  const insets = useSelector(getSafeAreaMode);
  const currentDarkMode = useSelector(getThemeMode);
  const [selectedIndex, setSelectedIndex] = useState();
  const [appliedTheme, setAppliedTheme] = useState(0);

  const handleGoBack = () => {
    navigation.goBack();
  };
  return (
    <View
      style={{
        flex: 1,
        paddingTop: insets.top - 30,
        paddingBottom: insets.bottom + 20,
        backgroundColor: currentDarkMode == 'dark' ? '#111111' : Colors.white,
      }}>
      <StatusBar
        backgroundColor={currentDarkMode == 'dark' ? '#111111' : Colors.white}
        translucent={false}
        barStyle={
          currentDarkMode === 'light' ? 'dark-content' : 'light-content'
        }
      />

      {selectedIndex >= 0 && (
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            zIndex: 20,
            width: '100%',
            borderWidth: 0.5,
          }}>
          {/* <Pressable style={styles.backdrop} onPress={() => setSelectedIndex(-1)} /> */}

          <View
            style={[
              styles.bottomView,
              {
                backgroundColor:
                  currentDarkMode == 'light' ? '#000000' : Colors.white,
              },
            ]}>
            <TouchableOpacity
              style={styles.applyButton}
              onPress={() => {
                setAppliedTheme(selectedIndex);
                setSelectedIndex(-1);
              }}>
              <Text style={{color: 'white'}}>Apply Theme</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      
      <HeadersAppScreen TitleName={t('THEMES')} onPress={handleGoBack} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{height: 15}} />
        <View style={{paddingHorizontal: 15, flex: 1}}>
          <CommonView
            themeColor={'Default Theme'}
            themeVarient={'Tesla'}
            appliedTheme={appliedTheme == 0}
            isChecked={selectedIndex == 0}
            currentDarkMode={currentDarkMode}
            language={t}
            onSelect={() => {
              if (selectedIndex == 0) {
                setSelectedIndex(-1);
              } else {
                setSelectedIndex(0);
              }
            }}
          />
          <View style={{height: 20}} />
          <CommonView
            themeColor={'Purple Theme'}
            themeVarient={'Vogue'}
            appliedTheme={appliedTheme == 1}
            isChecked={selectedIndex == 1}
            currentDarkMode={currentDarkMode}
            language={t}
            onSelect={() => {
              if (selectedIndex == 1) {
                setSelectedIndex(-1);
              } else {
                setSelectedIndex(1);
              }
            }}
          />
          <View style={{height: 20}} />
          <CommonView
            themeColor={'Black'}
            themeVarient={'Power'}
            appliedTheme={appliedTheme == 2}
            isChecked={selectedIndex == 2}
            currentDarkMode={currentDarkMode}
            language={t}
            onSelect={() => {
              if (selectedIndex == 2) {
                setSelectedIndex(-1);
              } else {
                setSelectedIndex(2);
              }
            }}
          />
          <View style={{height: 20}} />
          <CommonView
            themeColor={'Military'}
            themeVarient={'Defender'}
            appliedTheme={appliedTheme == 3}
            isChecked={selectedIndex == 3}
            currentDarkMode={currentDarkMode}
            language={t}
            onSelect={() => {
              if (selectedIndex == 3) {
                setSelectedIndex(-1);
              } else {
                setSelectedIndex(3);
              }
            }}
          />
          <View style={{height: 20}} />
          <CommonView
            themeColor={'Latin America'}
            themeVarient={'Festival'}
            appliedTheme={appliedTheme == 4}
            isChecked={selectedIndex == 4}
            currentDarkMode={currentDarkMode}
            language={t}
            onSelect={() => {
              if (selectedIndex == 4) {
                setSelectedIndex(-1);
              } else {
                setSelectedIndex(4);
              }
            }}
          />
          <View style={{height: 50}} />
        </View>
      </ScrollView>
    </View>
  );
};

export default AppThemes;

const CommonView = ({
  themeColor,
  themeVarient,
  appliedTheme,
  isChecked,
  onSelect,
  currentDarkMode,
  language,
}) => {
  return (
    <View style={{}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Text
          style={{
            color: currentDarkMode == 'light' ? '#000000' : Colors.white,
            fontSize: 15,
            fontFamily: 'Poppins-Bold',
            fontWeight: '500',
          }}>
          {themeColor}
          <Text
            style={{
              color: currentDarkMode == 'light' ? '#626262' : '#F2F2F2 ',
              fontSize: 15,
              fontFamily: 'Poppins-Medium',
              fontWeight: '500',
            }}>
            {'-'}({themeVarient})
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
        {[1, 2, 3]?.map(item => (
          <Image
            source={img_theme}
            style={{
              width: '31%',
              aspectRatio: 2 / 3,
              resizeMode: 'contain',
            }}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  openButton: {
    fontSize: 18,
    padding: 10,
    backgroundColor: '#111',
    color: 'white',
    borderRadius: 8,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'green',
  },
  bottomView: {
    paddingHorizontal: 20,
    paddingVertical: 35,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    elevation: 10,
  },
  applyButton: {
    backgroundColor: '#111',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
});
