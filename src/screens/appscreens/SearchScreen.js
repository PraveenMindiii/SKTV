import {
  View,
  FlatList,
  StyleSheet,
  Pressable,
  Dimensions,
  ActivityIndicator,
  Text,
  StatusBar,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import Colors from '../../constants/Colors';
import CustomSearchBar from '../../components/CustomSearchBar';
import HeadersAppScreen from '../../components/HeadersAppScreen';
import apiInstance from '../../services/ApiInstance';
import {CONTENTSEARCH} from '../../services/ApiEndPoints';
import LoadingOverlay from '../../components/LoadingOverlay';
import FastImage from 'react-native-fast-image';
import ImageWithLoading from '../../components/ImageWithLoading';
import useTheme from '../../hooks/useTheme';
import { useSelector } from 'react-redux';
import { getThemeMode } from '../../contexts/ThemeSlice';
import { useFocusEffect } from '@react-navigation/native';
import { getSafeAreaMode } from '../../contexts/SafeAreaSlice';

const SearchScreen = ({navigation, route}) => {
  const inputRef = useRef(null);
   const {theme} = useTheme();
  const currentTheme = useSelector(getThemeMode);
  const [loading, setLoading] = useState(true);
  const insets = useSelector(getSafeAreaMode);
  const [arrMoviesAndTvShow, setArrMoviesAndTvShow] = useState([]);
  const [listKey, setListKey] = useState(0);
  const [pageNo, setPageNo] = useState(1);
  const [loadMore, setLoadMore] = useState(true);
  const [loadMoreLoader, setLoadMoreLoader] = useState(false);
  const [searchText, setSearchText] = useState('');
 
  useEffect(() => {
    callGetContentSearch('', 1);
  }, []);

useFocusEffect(
  useCallback(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [])
);

  const handleSearch = text => {
    setSearchText(text);
    setPageNo(1);
    debouncedSearch(text, 1);
  };

  const callGetContentSearch = useCallback(
    async (searchValue = '', pageNoParams) => {
      if (pageNoParams == 1) {
        setLoading(true);
      }

      try {
        const response = await apiInstance.get(CONTENTSEARCH, {
          params: {
            page_no: pageNoParams,
            search: searchValue,
          },
        });

        if (response.status === 200) {
          const receivedData = response.data.data ? response.data.data : [];
          console.log(
            'data here of search',
            JSON.stringify(response.data.data.length),
          );

          if (receivedData.length < 10) {
            setLoadMore(false);
          } else {
            setLoadMore(true);
          }
          setLoadMoreLoader(true);

          if (pageNoParams == 1) {
            setArrMoviesAndTvShow(receivedData);
            setListKey(prev => prev + 1);
          } else {
            setArrMoviesAndTvShow(prev => [...prev, ...receivedData]);
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

  const debouncedSearch = useCallback(debounce(callGetContentSearch, 500), []);

  const renderItemOfCategories = ({item}) => (
    <Pressable
      style={styles.itemContainer}
      activeOpacity={1}
      onPress={() => {
        handleItemTapped(item._id);
      }}>
      <ImageWithLoading
        source={{uri: item.poster_path, priority: FastImage.priority.normal}}
        style={styles.image}
        resizeMode={FastImage.resizeMode.cover}
      />
    </Pressable>
  );

  const handleItemTapped = useCallback(
    id => {
      navigation.navigate('MovieTvShowsDetailsScreen', {
        _id: id,
      });
    },
    [navigation],
  );

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    
    <View
      style={{
        flex: 1,
        backgroundColor: theme('background'),
        paddingTop: insets.top,
      }}>
      <LoadingOverlay loading={loading} />
      <StatusBar
        backgroundColor={theme('background')}
        translucent={false}
        barStyle={currentTheme === 'light' ? 'dark-content' : 'light-content'}
      />
      {route?.params?.showBackButton && (
        <HeadersAppScreen TitleName={'Search'} onPress={handleGoBack} />
      )}

      <View style={{paddingHorizontal: 15, paddingTop: 10}}>
        <CustomSearchBar
          value={searchText}
          onChangeText={handleSearch}
          // autoFocus={true}
          inputRef={inputRef}
        />
      </View>

      <View style={{marginHorizontal: 15, marginTop: 7, flex: 1}}>
        {arrMoviesAndTvShow.length != 0 ? (
          <FlatList
            key={listKey} //forces re-render of the list
            data={arrMoviesAndTvShow}
            renderItem={renderItemOfCategories}
            keyExtractor={item => item._id}
            numColumns={3}
            contentContainerStyle={{
              ...styles.flatListContainer,
              paddingBottom: route?.params?.showBackButton
                ? insets.bottom + 20
                : insets.bottom + 70,
            }}
            columnWrapperStyle={styles.row}
            showsVerticalScrollIndicator={false}
            onEndReachedThreshold={0.5}
            onEndReached={() => {
              if (loadMore) {
                setPageNo(pageNo + 1);
                callGetContentSearch(searchText, pageNo + 1);
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
                backgroundColor: currentTheme == "light" ? "#FFFFFF" : '#111111',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: currentTheme == "light" ? "#000000" : "#FFFFFF",
                  fontFamily: 'Quicksand-Regular',
                  fontSize: 18,
                }}>
                {'No record found'}
              </Text>
            </View>
          )
        )}
      </View>
    </View>
  );
};
    
export default SearchScreen;

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
    width: (Dimensions.get('window').width - 15 * 4) / 3,
    aspectRatio: 2 / 3,
    marginRight: 15,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    backgroundColor: Colors.black,
  },
});
