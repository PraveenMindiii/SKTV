import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  Dimensions,
  Text,
  StatusBar,
} from 'react-native';
import {useCallback, useEffect, useState} from 'react';
import Colors from '../../constants/Colors';
import CustomSearchBar from '../../components/CustomSearchBar';
import HeadersAppScreen from '../../components/HeadersAppScreen';
import {CATEGORYCONTENTLIST} from '../../services/ApiEndPoints';
import apiInstance from '../../services/ApiInstance';
import FastImage from 'react-native-fast-image';
import LoadingOverlay from '../../components/LoadingOverlay';
import ImageWithLoading from '../../components/ImageWithLoading';
import useTheme from '../../hooks/useTheme';
import {useSelector} from 'react-redux';
import {getThemeMode} from '../../contexts/ThemeSlice';
import { getSafeAreaMode } from '../../contexts/SafeAreaSlice';

const SeeMoreDataScreen = ({navigation, route}) => {
  const {theme} = useTheme();
  const currentTheme = useSelector(getThemeMode);
  const insets = useSelector(getSafeAreaMode);
  const [listKey, setListKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [arrItems, setArrItems] = useState([]);
  const [headerLbl, setHeaderLbl] = useState();
  const [pageNo, setPageNo] = useState(1);
  const [loadMore, setLoadMore] = useState(true);
  const [loadMoreLoader, setLoadMoreLoader] = useState(false);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    callGetCategoryContentList('', 1);
  }, []);

  const handleSearch = text => {
    setSearchText(text);
    setPageNo(1);
    debouncedSearch(text, 1);
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleNavigation = _id => {
    navigation.navigate('MovieTvShowsDetailsScreen', {
      _id: _id,
    });
  };

  const renderItemOfCategories = ({item}) => (
    <Pressable
      onPress={() => {
        handleNavigation(item._id);
      }}
      style={styles.itemContainer}>
      <ImageWithLoading
        source={{uri: item.poster_path, priority: FastImage.priority.normal}}
        style={styles.image}
        resizeMode={FastImage.resizeMode.cover}
      />
    </Pressable>
  );

  const callGetCategoryContentList = useCallback(
    async (searchValue = '', pageNoParams) => {
      const {contentType, genre} = route.params;
      setHeaderLbl(genre);
      if (pageNoParams == 1) {
        setLoading(true);
      }

      try {
        const response = await apiInstance.get(CATEGORYCONTENTLIST, {
          params: {
            content_type: contentType,
            genre: genre,
            page_no: pageNoParams,
            search: searchValue,
          },
        });

        if (response.status === 200) {
          const receivedData = response.data.data[0]?.contents
            ? response.data.data[0]?.contents
            : [];
          console.log('Length of the data is ', receivedData.length);

          if (receivedData.length < 10) {
            setLoadMore(false);
          } else {
            setLoadMore(true);
          }

          setLoadMoreLoader(true);
          if (pageNoParams == 1) {
            setArrItems(receivedData);
            setListKey(prev => prev + 1);
          } else {
            setArrItems(prev => [...prev, ...receivedData]);
          }
        }
      } catch (error) {
        console.error('Error fetching category content list:', error);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(null, args);
      }, delay);
    };
  };

  const debouncedSearch = useCallback(
    debounce(callGetCategoryContentList, 500),
    [],
  );

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme('background'),
        paddingTop: insets.top + 10,
        // paddingBottom: insets.bottom + 20,
      }}>
      <LoadingOverlay loading={loading} />
      <StatusBar
        backgroundColor={theme('background')}
        translucent={false}
        barStyle={currentTheme === 'light' ? 'dark-content' : 'light-content'}
      />
      <HeadersAppScreen TitleName={headerLbl} onPress={handleGoBack} />
      <View style={{paddingHorizontal: 15, paddingTop: 10}}>
        <CustomSearchBar
          value={searchText}
          onChangeText={value => {
            handleSearch(value);
          }}
          autoFocus={false}
        />
      </View>

      <View style={{marginHorizontal: 15, marginTop: 7, flex: 1}}>
        {arrItems.length != 0 ? (
          <FlatList
            key={listKey} // forces re-render of the list
            data={arrItems}
            renderItem={renderItemOfCategories}
            keyExtractor={item => item._id}
            numColumns={3}
            contentContainerStyle={{
              ...styles.flatListContainer,
              paddingBottom: insets.bottom + 20,
            }}
            columnWrapperStyle={styles.row}
            showsVerticalScrollIndicator={false}
            onEndReachedThreshold={0.5}
            onEndReached={() => {
              if (loadMore) {
                setPageNo(pageNo + 1);
                callGetCategoryContentList(searchText, pageNo + 1);
              }
            }}
            ListFooterComponent={
              loadMore && loadMoreLoader ? (
                <View style={{paddingVertical: 20}}>
                  <ActivityIndicator size="large" color="#4BB7B7" />
                </View>
              ) : null
            }
          />
        ) : (
          !loading && (
            <View
              style={{
                flex: 1,
                backgroundColor: '#111111',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: 'white',
                  fontFamily: 'Quicksand-Regular',
                  fontSize: 18,
                }}>
                {' '}
                {'No record found'}{' '}
              </Text>
            </View>
          )
        )}
      </View>
    </View>
  );
};

export default SeeMoreDataScreen;
const styles = StyleSheet.create({
  flatListContainer: {
    flexGrow: 1,
    paddingTop: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 15,
  },
  itemContainer: {
    width: (Dimensions.get('window').width - 15 * 4) / 3, // 3 items + 2 gaps + side padding
    aspectRatio: 2 / 3,
    marginRight: 15, // space between items
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    backgroundColor: Colors.black,
  },
});
