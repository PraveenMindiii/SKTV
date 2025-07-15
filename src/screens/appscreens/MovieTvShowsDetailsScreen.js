import {
  View,
  Text,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
  Pressable,
  Platform,
  StyleSheet,
  TouchableNativeFeedback,
  ActivityIndicator,
} from 'react-native';
import {useCallback, useEffect, useRef, useState} from 'react';
import Colors from '../../constants/Colors';
import LinearGradient from 'react-native-linear-gradient';
import LoadingOverlay from '../../components/LoadingOverlay';
import apiInstance from '../../services/ApiInstance';
import {ConstValues} from '../../constants/ConstValues';
import Orientation from 'react-native-orientation-locker';
import DropdownComponent from '../../components/DropdownComponent';
import {FlatList} from 'react-native-gesture-handler';
import FastImage from 'react-native-fast-image';
import DetailsComponent from '../../components/DetailsComponent';
import ImageWithLoading from '../../components/ImageWithLoading';
import useTheme from '../../hooks/useTheme';
import {useSelector} from 'react-redux';
import {getThemeMode} from '../../contexts/ThemeSlice';
import useTranslate from '../../hooks/useTranslate';
import {getSafeAreaMode} from '../../contexts/SafeAreaSlice';

const window = Dimensions.get('screen');
const PAGE_WIDTH = window.width;

const MovieTvShowsDetailsScreen = ({navigation, route}) => {
  const insets = useSelector(getSafeAreaMode);
  const {theme} = useTheme();
  const {t} = useTranslate();
  const play = t('PLAY');
  const episode = t('EPISODES');
  const detail = t('Detail');
  const readmore = t('READMORE');
  const readless = t('READLESS');
  const cast = t('CAST');
  const genres = t('GENRES');
  const crew = t('CREW');
  const headingColor = theme('heading');
  const backgroundColor = theme('background');
  const episodeTextColor = theme('episodes_text_color');
  const [expanded, setExpanded] = useState(false);
  const [showReadMore, setShowReadMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dataOfMoviesAndTvShows, setDataOfMoviesAndTvShows] = useState();
  const [selectedTab, setSelectedTab] = useState('episodes');
  const [selectedSeason, setSelectedSeason] = useState([]);
  const currentTheme = useSelector(getThemeMode);
  const [pageNo, setPageNo] = useState(1);
  const [episodesData, setEpisodesData] = useState([]);
  const [loadMoreLoader, setLoadMoreLoader] = useState(false);
  const [loadMore, setLoadMore] = useState(true);
  const [listKey, setListKey] = useState(0);
 const appTheme = useSelector(state => state.appthemes);
  const [lastTriggeredOffset, setLastTriggeredOffset] = useState(0);
  const screenHeight = Dimensions.get('window').height;

  useEffect(() => {
    callGetContentDetails();
  }, []);

  useEffect(() => {
    setEpisodesData([]);
    setPageNo(1);
    setLoadMoreLoader(true);
    if (selectedSeason?.season_id) {
      console.log('Coming in this poriton');
      callGetEpisodesData(selectedSeason.season_id, 1);
    }
  }, [selectedSeason]);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const callGetContentDetails = useCallback(async () => {
    setLoading(true);
    try {
      const contentId = route?.params?._id;
      console.log('content_id:', contentId);

      const url = `/content/${contentId}/contentDetail`;

      const response = await apiInstance.get(url, {
        params: {id: contentId},
      });

      console.log(
        'response of the content detail ------>',
        response.data.data[0],
      );

      if (response.status === 200) {
        setDataOfMoviesAndTvShows(response.data.data[0]);
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

  // const onScroll = event => {
  //   const {
  //     contentOffset: {y},
  //   } = event.nativeEvent;

  //   // Trigger every time scroll crosses next multiple of 50% screen height (0.5 * screenHeight)
  //   const triggerThreshold = 0.8 * screenHeight;

  //   // Check if scrolled past next multiple of triggerThreshold
  //   if (y >= lastTriggeredOffset + triggerThreshold) {
  //     const nextTrigger = lastTriggeredOffset + triggerThreshold;

  //     setLastTriggeredOffset(nextTrigger);
  //     console.log('On scroll reached');

  //     if (loadMore) {
  //       console.log('Api condition reached');

  //       setPageNo(pageNo + 1);
  //       callGetEpisodesData(selectedSeason.season_id, pageNo + 1); // load next page
  //     }
  //   }
  // };

  const [isThrottled, setIsThrottled] = useState(false); // prevents repeated calls

  const onScroll = event => {
    const {
      contentOffset: {y},
    } = event.nativeEvent;

    const triggerThreshold = 0.8 * screenHeight;

    // Trigger only if not throttled and crossed threshold
    if (y >= lastTriggeredOffset + triggerThreshold && !isThrottled) {
      const nextTrigger = lastTriggeredOffset + triggerThreshold;
      setLastTriggeredOffset(nextTrigger);

      console.log('On scroll reached');

      if (loadMore) {
        console.log('API condition reached');

        setIsThrottled(true); // block further triggers
        setTimeout(() => {
          setPageNo(prev => {
            const nextPage = prev + 1;
            callGetEpisodesData(selectedSeason.season_id, nextPage); // call API with delayed next page
            return nextPage;
          });
          setIsThrottled(false); // allow next scroll trigger after 3 sec
        }, 2000); // 3 seconds delay
      }
    }
  };

  const callGetEpisodesData = useCallback(async (seasonId, page) => {
    console.log('Coming in the episodes api', seasonId);

    if (page == 1) {
      setLoading(true);
    }

    try {
      if (!seasonId) return;
      console.log('Try block reahced');

      const url = `/content/${route.params._id}/season/${seasonId}/episodes`;
      console.log('Url created ------->', url);

      const response = await apiInstance.get(url, {
        params: {
          page_no: page,
        },
      });

      console.log('Response is ---------->', response);

      if (response?.status == 200) {
        console.log('Coming in the success block');

        const newEpisodes = response?.data?.data?.episodes || [];
        console.log('New episodes length', newEpisodes.length);

        if (newEpisodes.length < 30) {
          setLoadMore(false);
        } else {
          setLoadMore(true);
        }
        setLoadMoreLoader(true);
        console.log('page is ------>', page);

        if (page == 1) {
          console.log('Page 1 condition');

          setEpisodesData(newEpisodes);
          setListKey(prev => prev + 1);
        } else {
          setEpisodesData(prev => [...prev, ...newEpisodes]);
        }
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

  const onSeasonChangeHandler = season => {
    console.log('Season is ----->', season.season_id);

    setSelectedSeason(season);
    //to work here
  };

  const renderItemOfEpisodes = ({item}) => (
    <Pressable
      onPress={() => {
        Orientation.lockToLandscape();
        setTimeout(() => {
          navigation.navigate('PlayerScreen', {
            videoUrl: item?.watch_link,
          });
        }, 200);
      }}
      style={{
        paddingVertical: 8,
        flexDirection: 'row',
      }}>
      <View
        style={{
          position: 'relative',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <ImageWithLoading
          source={{
            uri: item.episode_banner,
            priority: FastImage.priority.normal,
          }}
          style={styles.moviePosterImage}
          resizeMode={FastImage.resizeMode.cover}
        />

        <Image
          source={require('../../assets/images/acticon_play.png')}
          style={{width: 25, height: 25, position: 'absolute', zIndex: 10}}
        />
      </View>
      <View
        style={{
          marginHorizontal: 12,
          flex: 1,
          justifyContent: 'center',
          gap: 5,
        }}>
        <Text
          style={{
            flexShrink: 1,
            flexWrap: 'wrap',
            color: headingColor,
            fontSize: 12,
            fontFamily: 'Quicksand-Bold',
          }}>
          {item?.episode_name}
        </Text>

        <View style={{flexDirection: 'row', alignItems: 'center', gap: 7}}>
          <View style={{flexDirection: 'row', gap: 3}}>
            <Text
              style={{
                fontFamily: 'Quicksand-Bold',
                fontSize: 13,
                color: episodeTextColor,
              }}>
              {'E' + item?.episode_no}
            </Text>
            <Text
              style={{
                fontFamily: 'Quicksand-Bold',
                fontSize: 13,
                color: episodeTextColor,
              }}>
              {'S' + selectedSeason.season}
            </Text>
          </View>

          <View
            style={{
              height: 3,
              width: 3,
              backgroundColor: episodeTextColor,
              borderRadius: 2,
              marginTop: Platform.OS == 'android' ? 4 : 0,
            }}
          />

          <Text
            style={{
              fontFamily: 'Quicksand-Bold',
              fontSize: 13,
              color: episodeTextColor,
            }}>
            {formatDuration(item?.episode_length_min)}
          </Text>
        </View>
      </View>
    </Pressable>
  );

  const formatDuration = minutes => {
    if (!minutes || isNaN(minutes) || minutes <= 0) return 'N/A';

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    let result = '';
    if (hours > 0) result += `${hours}h`;
    if (remainingMinutes > 0)
      result += `${hours > 0 ? ' ' : ''}${remainingMinutes}m`;

    return result;
  };
  return (
    <ScrollView
      onScroll={onScroll}
      scrollEventThrottle={16}
      bounces={false}
      contentContainerStyle={{
        flexGrow: 1,
        backgroundColor: backgroundColor,
      }}>
      {dataOfMoviesAndTvShows && (
        <View
          style={{
            backgroundColor: backgroundColor,
            paddingBottom: insets.bottom,
          }}>
          <LoadingOverlay loading={loading} />
          <View>
            <Pressable
              onPress={handleGoBack}
              style={{
                position: 'absolute',
                zIndex: 10,
                left: ConstValues.screenHorizontalPadding,
                top: insets.top + ConstValues.screenHorizontalPadding,
              }}>
              <Image
                style={styles.languageImage}
                source={
                  currentTheme === 'light'
                    ? require('../../assets/images/icon_lightfill_Back.png')
                    : require('../../assets/images/ico_cover_back.png')
                }
              />
            </Pressable>
            <LinearGradient
              colors={
                currentTheme == 'dark'
                  ? [
                      'rgba(0,0,0,0)',
                      'rgba(0,0,0,0)',
                      'rgba(0,0,0,0)',
                      '#11111110',
                      '#11111120',
                      '#11111130',
                      '#11111140',
                      '#11111150',
                      backgroundColor,
                    ]
                  : [
                      'rgba(0,0,0,0)',
                      'rgba(0,0,0,0)',
                      'rgba(0,0,0,0)',
                      '#ffffff10',
                      '#ffffff20',
                      '#ffffff30',
                      '#ffffff40',
                      '#ffffff50',
                      backgroundColor,
                    ]
              }
              style={{
                flex: 1,
                width: '100%',
                height: '100%',
                position: 'absolute',
                zIndex: 5,
              }}></LinearGradient>
            <ImageWithLoading
              style={{
                width: PAGE_WIDTH,
                aspectRatio: 8 / 9,
              }}
              source={{uri: dataOfMoviesAndTvShows?.poster_path}}
            />
          </View>

          <View style={{margin: 15}}>
            {dataOfMoviesAndTvShows?.is_trending && (
              <View
                style={{
                  backgroundColor: Colors.app_primary_color,
                  padding: 9,
                  width: '25%',
                  borderRadius: 2,
                  marginBottom: 10,
                }}>
                <Text
                  style={{
                    color: headingColor,
                    fontFamily: 'Quicksand-Medium',
                    fontSize: 12,
                  }}>
                  On Trending
                </Text>
              </View>
            )}

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
                marginBottom: 8,
              }}>
              <Text
                style={{
                  color: headingColor,
                  fontFamily: 'Quicksand-Medium',
                  fontSize: 20,
                }}>
                {dataOfMoviesAndTvShows?.title}
              </Text>
              {dataOfMoviesAndTvShows?.HDR && (
                <Text
                  style={{
                    color: headingColor,
                    fontFamily: 'Quicksand-Regular',
                    fontSize: 12,
                  }}>
                  HDR
                </Text>
              )}

              {dataOfMoviesAndTvShows?.rating && (
                <Text
                  style={{
                    color: headingColor,
                    fontFamily: 'Quicksand-Regular',
                    fontSize: 12,
                    marginTop: 7,
                  }}>
                  {dataOfMoviesAndTvShows?.rating}
                </Text>
              )}
            </View>

            <View style={{flexDirection: 'row', gap: 6, alignItems: 'center'}}>
              <Text
                style={{
                  color: headingColor,
                  fontFamily: 'Quicksand-Regular',
                  fontSize: 14,
                }}>
                {dataOfMoviesAndTvShows?.release_date
                  ? new Date(dataOfMoviesAndTvShows.release_date).getFullYear()
                  : 'N/A'}
              </Text>
              <View
                style={{
                  height: 4,
                  width: 4,
                  backgroundColor: headingColor,
                  borderRadius: 2,
                  marginTop: Platform.OS == 'android' ? 4 : 0,
                }}
              />

              <Text
                style={{
                  color: headingColor,
                  fontFamily: 'Quicksand-Regular',
                  fontSize: 14,
                }}>
                {dataOfMoviesAndTvShows?.content_type === 'movie'
                  ? formatDuration(dataOfMoviesAndTvShows.movie_length_min)
                  : dataOfMoviesAndTvShows?.season_count === 1
                  ? '1 Season'
                  : `${dataOfMoviesAndTvShows?.season_count} Seasons`}
              </Text>
            </View>
          </View>
          {dataOfMoviesAndTvShows?.content_type === 'movie' ? (
            <View
              style={{
                borderRadius: 10,
                overflow: 'hidden',
                flex: 1,
                width: '92%',
                alignSelf: 'center',
              }}>
              <TouchableNativeFeedback
                background={TouchableNativeFeedback.Ripple(
                  Colors.bg_color,
                  false,
                )}
                style={styles.button}
                onPress={() => {
                  Orientation.lockToLandscape();
                  setTimeout(() => {
                    navigation.navigate('PlayerScreen', {
                      videoUrl: dataOfMoviesAndTvShows?.movie_watch_link,
                    });
                  }, 200);
                }}>
                <View style={[styles.button, {backgroundColor: appTheme?.themeColor}]}>
                  <Image
                    source={require('../../assets/images/ico_play.png')}
                    style={{height: 24, width: 24}}
                  />
                  <Text style={styles.text}>{play}</Text>
                </View>
              </TouchableNativeFeedback>
            </View>
          ) : null}

          <View style={{marginHorizontal: 15, marginTop: 10}}>
            <Text
              style={{
                fontFamily: 'Quicksand-Regular',
                fontSize: 14,
                opacity: 0,
                position: 'absolute',
                zIndex: -1,
              }}
              onTextLayout={e => {
                if (e.nativeEvent.lines.length > 2 && !showReadMore) {
                  setShowReadMore(true);
                }
              }}>
              {dataOfMoviesAndTvShows?.overview}
            </Text>
            <Text
              style={{
                color: headingColor,
                fontFamily: 'Quicksand-Regular',
                fontSize: 14,
              }}
              numberOfLines={expanded ? undefined : 2}>
              {dataOfMoviesAndTvShows?.overview}
            </Text>

            {showReadMore && (
              <Pressable onPress={() => setExpanded(prev => !prev)}>
                <Text
                  style={{
                    color: headingColor,
                    fontFamily: 'Quicksand-SemiBold',
                    fontSize: 14,
                  }}>
                  {expanded ? readless : readmore}
                </Text>
              </Pressable>
            )}
          </View>

          <View style={{margin: 15}}>
            <View style={{flexDirection: 'row', gap: 30}}>
              {dataOfMoviesAndTvShows?.content_type === 'tvShow' ? (
                <TouchableOpacity
                  onPress={() => setSelectedTab('episodes')}
                  activeOpacity={1}>
                  <Text
                    style={{
                      color:
                        selectedTab === 'episodes' ? headingColor : '#677D7D',
                      fontFamily: 'Quicksand-Regular',
                      fontSize: 14,
                    }}>
                    {episode}
                  </Text>
                </TouchableOpacity>
              ) : null}

              <TouchableOpacity
                onPress={() => setSelectedTab('detail')}
                activeOpacity={1}>
                <Text
                  style={{
                    color:
                      selectedTab === 'detail' ||
                      dataOfMoviesAndTvShows.content_type === 'movie'
                        ? headingColor
                        : '#677D7D',
                    fontFamily: 'Quicksand-Regular',
                    fontSize: 14,
                  }}>
                  {detail}
                </Text>
              </TouchableOpacity>
            </View>

            <View
              style={{
                height: 1,
                width: '100%',
                backgroundColor: '#3C3C3C',
                marginTop: 10,
              }}
            />

            <View style={{marginTop: 12}}>
              {selectedTab === 'detail' ||
              dataOfMoviesAndTvShows.content_type === 'movie' ? (
                <>
                  <DetailsComponent
                    label={cast}
                    detail={
                      dataOfMoviesAndTvShows?.cast
                        ?.map(item => item.name)
                        .join(', ') || 'N/A'
                    }
                  />

                  <View style={{height: 10}} />

                  <DetailsComponent
                    label={genres}
                    detail={
                      dataOfMoviesAndTvShows?.genres
                        ?.map(item => item.name)
                        .join(', ') || 'N/A'
                    }
                  />

                  <View style={{height: 10}} />
                  <DetailsComponent
                    label={crew}
                    detail={
                      dataOfMoviesAndTvShows?.crew
                        ?.map(item => item.name)
                        .join(', ') || 'N/A'
                    }
                  />
                </>
              ) : (
                // Episodes View - Blank Red View
                dataOfMoviesAndTvShows?.seasons && (
                  <View>
                    <DropdownComponent
                      data={dataOfMoviesAndTvShows?.seasons}
                      onClickCallback={onSeasonChangeHandler}
                    />
                    <FlatList
                      key={listKey}
                      contentContainerStyle={{marginTop: 8}}
                      data={episodesData}
                      renderItem={renderItemOfEpisodes}
                      keyExtractor={(item, index) => index.toString()}
                      // onEndReached={() => {
                      //   if (loadMore) {
                      //     setPageNo(pageNo + 1);
                      //     callGetEpisodesData(
                      //       selectedSeason.season_id,
                      //       pageNo + 1,
                      //     ); // load next page
                      //   }
                      // }}
                      // onEndReachedThreshold={0.5} // trigger when 50% from bottom
                      ListFooterComponent={
                        loadMore && loadMoreLoader ? (
                          <View
                            style={{
                              paddingVertical: 20,
                            }}>
                            <ActivityIndicator size="large" color="#4BB7B7" />
                          </View>
                        ) : null
                      }
                    />
                  </View>
                )
              )}
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

export default MovieTvShowsDetailsScreen;
const styles = StyleSheet.create({
  button: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  text: {
    padding: 12,
    color: Colors.white,
    fontFamily: 'Quicksand-SemiBold',
    fontSize: 18,
  },
  languageImage: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  dropdown: {
    width: '50%',
    backgroundColor: '#4A4A4A',
    borderRadius: 4,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  selectedTextStyle: {
    fontSize: 16,
    color: Colors.white,
    backgroundColor: '#4A4A4A',
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  moviePosterImage: {
    width: 120,
    aspectRatio: 16 / 9,
    borderRadius: 8,
    resizeMode: 'cover',
    backgroundColor: 'black',
  },
});
