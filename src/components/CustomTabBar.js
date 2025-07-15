import React from 'react';
import {
  View,
  TouchableNativeFeedback,
  Text,
  StyleSheet,
  Image,
  Platform,
} from 'react-native';
import Colors from '../constants/Colors';
import {getSafeAreaMode} from '../contexts/SafeAreaSlice';
import {useSelector} from 'react-redux';

const CustomTabBar = ({
  state,
  descriptors,
  navigation,
  theme,
  currentTheme,
}) => {
  const appTheme = useSelector(state => state.appthemes);
  const icons = {
    Home:
      currentTheme == 'dark'
        ? require('../assets/images/ico_show_active.png')
        : require('../assets/images/ico_show_black.png'),
    Search:
      currentTheme == 'dark'
        ? require('../assets/images/iconamoon_searchTabbar.png')
        : require('../assets/images/icon_search_black.png'),
    MyVideo:
      currentTheme == 'dark'
        ? require('../assets/images/ico_video.png')
        : require('../assets/images/icon_vedio_black.png'),
    Music:
      currentTheme == 'dark'
        ? require('../assets/images/ico_music_inactive.png')
        : require('../assets/images/ico_music_black.png'),
    MySpace:
      currentTheme == 'dark'
        ? require('../assets/images/ico_WorkSpace.png')
        : require('../assets/images/icon_profile_black.png'),
  };

  const iconsSelected = {
    Home: require('../assets/images/ico_show_active.png'),
    Search: require('../assets/images/icon_search_selected.png'),
    MyVideo: require('../assets/images/icon_vedio.png'),
    Music: require('../assets/images/ico_music_active.png'),
    MySpace: require('../assets/images/icon_profile_selected.png'),
  };

  const lbl = {
    Home: 'Show',
    Search: 'Search',
    MyVideo: 'My Video',
    MySpace: 'My Space',
    Music: 'Music',
  };
  const insets = useSelector(getSafeAreaMode);

  return (
    <View
      style={{
        ...styles.container(insets),
        backgroundColor: theme('tabbar_background'),
      }}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <View
            style={{
              borderRadius: 40,
              overflow: 'hidden', // Ensures ripple is clipped to border radius
              flex: 1,
            }}>
            <TouchableNativeFeedback
              background={TouchableNativeFeedback.Ripple(
                appTheme?.themeColor,
                false,
              )}
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? {selected: true} : {}}
              onPress={onPress}>
              <View
                style={[
                  styles.tab,
                  isFocused && {backgroundColor: appTheme?.themeColor, borderRadius: 40},
                ]}>
                <Image
                  source={
                    isFocused ? iconsSelected[route.name] : icons[route.name]
                  }
                  style={styles.icon}
                  resizeMode="contain"
                />
                {isFocused && (
                  <Text style={[styles.label, {color: theme('white_text')}]}>
                    {lbl[route.name]}
                  </Text>
                )}
              </View>
            </TouchableNativeFeedback>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: insets => {
    return {
      flexDirection: 'row',
      paddingVertical: 15,
      paddingHorizontal: 12,
      paddingBottom: insets.bottom + 15,
      borderTopRightRadius: 15,
      borderTopLeftRadius: 15,
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
    };
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 5,
    padding: 7,
  },

  icon: {
    width: 16,
    height: 16,
  },
  label: {
    fontSize: 10,
    fontFamily: 'Quicksand-Medium',
    marginTop: Platform.OS == 'android' ? -2 : 0,
  },
});

export default CustomTabBar;
