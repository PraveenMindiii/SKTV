import {View, Text, StyleSheet, Image, FlatList, Pressable} from 'react-native';
import {useState} from 'react';
import Colors from '../constants/Colors';
import {useDispatch, useSelector} from 'react-redux';
import {getCurrentLanguage, setLanguage} from '../contexts/LanguageSlice';
import {ConstValues} from '../constants/ConstValues';
import useTheme from '../hooks/useTheme';
import {useEffect} from 'react';
import {getThemeMode} from '../contexts/ThemeSlice';
import {getSafeAreaMode} from '../contexts/SafeAreaSlice';

const SelectLanguageModel = ({visible, onClose, title}) => {
  const {theme} = useTheme();
  const currentTheme = useSelector(getThemeMode);

  const currentLang = useSelector(getCurrentLanguage);
  const insets = useSelector(getSafeAreaMode);
  const dispatch = useDispatch();
  const langBackground = theme('language_background');
  const heading = theme('heading');
  const [arrLanguage, setArrLanguage] = useState([
    {key: 'en', title: 'English'},
    {key: 'cn', title: 'Chinese'},
    {key: 'es', title: 'Spanish'},
    {key: 'fr', title: 'French'},
  ]);

  useEffect(() => {
    console.log('Background is ', langBackground);
  });

  const renderItemOfLanguage = ({item, index}) => (
    <Pressable
      style={{flexDirection: 'row', gap: 15, paddingTop: 15}}
      onPress={() => {
        dispatch(setLanguage(item.key));

        onClose();
      }}>
      {item.key == currentLang ? (
        <Image
          style={styles.imgClose}
          source={require('../assets/images/ico_imgcheck.png')}
        />
      ) : (
        <View style={styles.imgClose} />
      )}

      <Text style={[styles.textLang, {color: heading}]}>{item.title}</Text>
    </Pressable>
  );
  return (
    visible && (
      <Pressable onPress={onClose} style={styles.overlay}>
        <Pressable
          style={[
            styles.modalContainer(insets),
            {backgroundColor: langBackground},
          ]}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={[styles.title, {color: heading}]}>{title}</Text>
            <Pressable onPress={onClose}>
              {currentTheme === 'light' ? (
                <Image
                  style={styles.imgClose}
                  source={require('../assets/images/ico_cross_black.png')}
                />
              ) : (
                <Image
                  style={styles.imgClose}
                  source={require('../assets/images/ico_cross_white.png')}
                />
              )}
            </Pressable>
          </View>
          <View>
            <FlatList data={arrLanguage} renderItem={renderItemOfLanguage} />
          </View>
          <View style={{height: 25}} />
        </Pressable>
      </Pressable>
    )
  );
};

export default SelectLanguageModel;
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
    alignItems: 'center',
    position: 'absolute',
    zIndex: 99,
  },
  modalContainer: insets => {
    return {
      width: '100%',
      paddingHorizontal: ConstValues.screenHorizontalPadding,
      paddingTop: 20,
      borderTopEndRadius: 20,
      borderTopStartRadius: 20,
      paddingBottom: insets.bottom + 50,
    };
  },
  title: {
    fontSize: 18,
    fontFamily: 'Quicksand-Medium',
    marginBottom: 10,
  },

  imgClose: {
    height: 25,
    width: 25,
    resizeMode: 'cover',
  },
  textLang: {
    fontSize: 18,
    fontFamily: 'Quicksand-Medium',
  },
});
