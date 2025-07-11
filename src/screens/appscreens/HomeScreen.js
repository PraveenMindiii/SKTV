import {
  View,
  StatusBar,
  ScrollView,
  StyleSheet,
  FlatList,
  Pressable,
  Text,
  SectionList,
  TouchableNativeFeedback,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import CustomSearchBar from '../../components/CustomSearchBar';
import {ConstValues} from '../../constants/ConstValues';
import ImageCarousel from '../../components/ImageCarousel';
import apiInstance from '../../services/ApiInstance';
import {
  CATEGORYCONTENTLIST,
  FEATUREDCONTENTENDPOINT,
  GENRELISTENDPOINT,
} from '../../services/ApiEndPoints';
import Colors from '../../constants/Colors';
import FastImage from 'react-native-fast-image';
import LoadingOverlay from '../../components/LoadingOverlay';
import CommonTabButton from '../../components/CommonTabButton';
import ImageWithLoading from '../../components/ImageWithLoading';
import useTranslate from '../../hooks/useTranslate';
import {useSelector} from 'react-redux';
import {getThemeMode} from '../../contexts/ThemeSlice';
import useTheme from '../../hooks/useTheme';
import { getSafeAreaMode } from '../../contexts/SafeAreaSlice';

const HomeScreen = ({navigation}) => {
  const {t} = useTranslate();
  const {theme} = useTheme();
  const currentTheme = useSelector(getThemeMode);
  const headingColor = theme('heading');
  const [activeTab, setActiveTab] = useState('movie');
  const insets = useSelector(getSafeAreaMode);
  const flatListRefs = useRef({}); // Holds refs to all horizontal FlatLists
  const [arrFeaturedContent, setArrFeaturedContent] = useState([]);
  const [arrCategoryOfShow, setArrCategoryOfShow] = useState();
  const [categoryContentList, setCategoryContentList] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [loading, setLoading] = useState(true);
const [seeMore, setSeeMore] = useState(t('SEE_MORE'));
  

  useEffect(() => {
    callGetFeaturedContent();
  }, []);
  useEffect(() => {
    callGetGenre();
  }, [activeTab]);
  useEffect(() => {
    callGetCategoryContentList(selectedGenre);
  }, [selectedGenre]);

  const onClickGenre = useCallback(
    (item, index) => {
      setSelectedGenre(item.name);
      setArrCategoryOfShow(prev => {
        const updated = prev.map((genre, i) => ({
          ...genre,
          isSelected: i === index,
        }));
        return updated;
      });
    },
    [setSelectedGenre, setArrCategoryOfShow],
  );

  const callGetFeaturedContent = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiInstance.get(FEATUREDCONTENTENDPOINT);

      if (response.status === 200) {
        setArrFeaturedContent(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching featured content:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const callGetGenre = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiInstance.get(GENRELISTENDPOINT, {
        params: {genre_type: activeTab},
      });

      if (response.status === 200) {
        const genreList = [...response.data.data];
        genreList.unshift({
          _id: '',
          genre_type: '',
          name: '',
          genre_id: '',
          isSelected: true,
        });

        setArrCategoryOfShow(genreList);
        callGetCategoryContentList('');
        setSelectedGenre('');
      } else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    } finally {
    }
  }, [activeTab, callGetCategoryContentList]);

  const handleNavigation = _id => {
    navigation.navigate('MovieTvShowsDetailsScreen', {
      _id: _id,
    });
  };

  const callGetCategoryContentList = useCallback(
    async content => {
      setLoading(true);
      try {
        const response = await apiInstance.get(CATEGORYCONTENTLIST, {
          params: {content_type: activeTab, genre: content},
        });

        if (response.status === 200 && Array.isArray(response.data.data)) {
          console.log('------->>>>', JSON.stringify(response.data));

          const structuredData = transformGenresForSectionList(
            response.data.data,
          );

          setCategoryContentList(structuredData);
          Object.values(flatListRefs.current).forEach(ref => {
            if (ref?.scrollToOffset) {
              ref.scrollToOffset({offset: 0, animated: true});
            }
          });
        }
      } catch (error) {
        console.error('Error fetching category content list:', error);
      } finally {
        setLoading(false);
      }
    },
    [activeTab],
  );

  const transformGenresForSectionList = apiData => {
    return apiData
      .filter(genreItem => genreItem.contents && genreItem.contents.length > 0)
      .map(genreItem => ({
        title: genreItem.genre,
        data: [genreItem.contents],
      }));
  };

  const renderItemOfCategoryOfShows = useCallback(
    ({item, index}) => (
      <GenreItem item={item} index={index} onPress={handleGenrePress} />
    ),
    [handleGenrePress],
  );

  const GenreItem = React.memo(({item, index, onPress}) => {
    return (
      <View
        style={{
          borderRadius: 10,
          overflow: 'hidden', // Ensures ripple is clipped to border radius
          flex: 1,
        }}>
        <TouchableNativeFeedback
          background={TouchableNativeFeedback.Ripple(
            Colors.app_primary_color,
            false,
          )}
          onPress={() => onPress(item, index)}>
          <View>
            <Text style={[styles.text, item.isSelected && styles.activeText]}>
              {item.name || 'All'}
            </Text>
          </View>
        </TouchableNativeFeedback>
      </View>
    );
  });

  const handleGenrePress = useCallback(
    (item, index) => {
      onClickGenre(item, index);
    },
    [onClickGenre],
  );

  const renderContentHeader = useCallback(
    ({section: {title}}) => (
      <View
        style={{
          flexDirection: 'row',
          flex: 1,
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingLeft: ConstValues.screenHorizontalPadding,
          paddingRight: 10,
          marginTop: 15,
          marginBottom: 5,
        }}>
        <Text
          numberOfLines={1}
          style={[styles.sectionHeader, {color: headingColor}]}>
          {title}
        </Text>

        <Pressable
          onPress={() => {
            navigation.navigate('SeeMoreDataScreen', {
              contentType: activeTab,
              genre: title,
            });
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              numberOfLines={1}
              style={{...styles.seemoreTest, color: headingColor}}>
              {'See more'}
            </Text>
            <Image
              source={
                currentTheme === 'light'
                  ? require('../../assets/images/icon_light_arrow.png')
                  : require('../../assets/images/icon_seemore.png')
              }
              style={{
                height: 10,
                width: 10,
                resizeMode: 'contain',
                marginLeft: 2,
                marginTop: Platform.OS == 'android' ? 4 : 0,
              }}
            />
          </View>
        </Pressable>
      </View>
    ),
    [activeTab, headingColor],
  );

  const renderHorizontalContentList = ({item, index, section}) => {
    const sectionKey = section.title || section.id || index; // ensure uniqueness

    return (
      <FlatList
        contentContainerStyle={{
          paddingLeft: ConstValues.screenHorizontalPadding,
        }}
        ref={ref => {
          if (ref) flatListRefs.current[sectionKey] = ref;
        }}
        data={item}
        horizontal
        initialNumToRender={5}
        windowSize={5}
        removeClippedSubviews={true}
        showsHorizontalScrollIndicator={false}
        keyExtractor={movie => movie.content_id?.toString()}
        renderItem={({item}) => (
          <HorizontalItem item={item} onPress={handleNavigation} />
        )}
      />
    );
  };

  const HorizontalItem = React.memo(({item, onPress}) => (
    <Pressable
      onPress={() => {        
        onPress(item._id);
      }}
      style={{
        marginRight: 15,
        width: 130,
      }}>
      <ImageWithLoading
        source={{uri: item.poster_path, priority: FastImage.priority.normal}}
        style={styles.moviePosterImage}
        resizeMode={FastImage.resizeMode.cover}
      />
      <Text
        style={[styles.moviePosterText, {color: theme('heading')}]}
        numberOfLines={1}>
        {item.title}
      </Text>
    </Pressable>
  ));

  return (
    <>
      <LoadingOverlay loading={loading} />
      <View style={{flex: 1, backgroundColor: theme('background')}}>
        <ScrollView
          bounces={false}
          contentContainerStyle={{
            flexGrow: 1,
            backgroundColor: theme('background'),
            paddingBottom: insets.bottom + 100,
          }}>
          <StatusBar
            backgroundColor={theme('background')}
            translucent={false}
            barStyle={
              currentTheme === 'light' ? 'dark-content' : 'light-content'
            }
          />

          <View style={{paddingTop: insets.top, flex : 1}}>
            <View style={styles.header}>
              <View style={{flex: 1, position: 'relative'}}>
                <TouchableOpacity
                  activeOpacity={1}
                  style={{
                    position: 'absolute',
                    zIndex: 10,
                    width: '100%',
                    height: '100%',
                  }}
                  onPress={() => {
                    navigation.navigate('SearchScreen', {showBackButton: true});
                  }}
                />
                <CustomSearchBar />
              </View>
              <View>
                <FastImage
                  style={styles.notificationIcon}
                  source={
                    currentTheme == 'dark'
                      ? require('../../assets/images/ico_notification.png')
                      : require('../../assets/images/icon_Notifi_light.png')
                  }
                  resizeMode={FastImage.resizeMode.contain}
                />
              </View>
            </View>
            {arrFeaturedContent.length > 0 ? (
              <View style={{marginVertical: 20}}>
                <ImageCarousel
                  data={arrFeaturedContent}
                  handleOnPressBanner={handleNavigation}
                />
              </View>
            ) : (
              <View style={{height: 20}} />
            )}

            <View
              style={{
                ...styles.tabContainer,
                width: ConstValues.deviceWidth * 0.6,
              }}>
              <CommonTabButton
                label={t('MOVIES')}
                isActive={activeTab === 'movie'}
                onPressHandler={() => {
                  setActiveTab('movie');
                }}
                themeBackground={theme('background')}
                themeText={theme('heading')}
              />

              <CommonTabButton
                label={t('TV_SHOWS')}
                isActive={activeTab === 'tvShow'}
                onPressHandler={() => {
                  setActiveTab('tvShow');
                }}
                themeBackground={theme('background')}
                themeText={theme('heading')}
              />
            </View>

            <View style={styles.genreContainer}>
              {arrCategoryOfShow && <View style={styles.verticalBar} />}
              <FlatList
                data={arrCategoryOfShow}
                renderItem={renderItemOfCategoryOfShows}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={item => item._id.toString()}
                contentContainerStyle={{paddingRight: 16}} // optional UI tweak
              />
            </View>
            {categoryContentList.length > 0 ? (
              <SectionList
                contentContainerStyle={{}}
                sections={categoryContentList}
                keyExtractor={(item, index) => index.toString()}
                renderSectionHeader={renderContentHeader}
                renderItem={renderHorizontalContentList}
                initialNumToRender={5}
                windowSize={5}
                removeClippedSubviews={true}
              />
            ) : (
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: "center",
                }}>
                <Text
                  style={{
                    color: 'white',
                    fontFamily: 'Quicksand-Regular',
                    fontSize: 18,
                  }}>
                  {'No record found'}
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
    alignItems: 'center',
    paddingHorizontal: ConstValues.screenHorizontalPadding,
  },
  notificationIcon: {
    height: 40,
    width: 40,
  },
  text: {
    color: '#8F8F8F',
    fontSize: 14,
    fontFamily: 'Quicksand-Regular',
    paddingHorizontal: 5,
    marginTop: Platform.OS == 'android' ? -3 : 0,
  },
  activeText: {
    color: '#42A3A3',
    fontFamily: 'Quicksand-SemiBold',
  },

  verticalBar: {
    width: 2,
    height: 25,
    backgroundColor: '#42A3A3',
    marginRight: 6,
  },

  sectionHeader: {
    fontSize: 22,
    fontFamily: 'Quicksand-SemiBold',
    alignSelf: 'center',
    marginTop: Platform.OS == 'android' ? -4 : 0,
  },
  seemoreTest: {
    fontSize: 12,
    fontFamily: 'Quicksand-Medium',
  },
  moviePosterText: {
    fontSize: 10,
    fontFamily: 'Quicksand-SemiBold',
    marginTop: 5,
    paddingHorizontal: 5,
  },
  moviePosterImage: {
    width: 130,
    aspectRatio: 2 / 3,
    borderRadius: 8,
    resizeMode: 'cover',
    backgroundColor: 'black',
  },
  tabContainer: {
    borderColor: '#42A3A3',
    borderWidth: 1,
    justifyContent: 'space-between',
    padding: 2,
    alignSelf: 'center',
    flexDirection: 'row',
    borderRadius: 25,
  },
  genreContainer: {
    marginTop: 10,
    marginLeft: 15,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
});
