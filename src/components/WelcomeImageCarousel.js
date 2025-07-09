import React, {useState} from 'react';
import {Dimensions, Image, TouchableOpacity, View} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import Colors from '../constants/Colors';
import LinearGradient from 'react-native-linear-gradient';
import {useSelector} from 'react-redux';
import {getThemeMode} from '../contexts/ThemeSlice';
import useTheme from '../hooks/useTheme';

const window = Dimensions.get('screen');
const PAGE_WIDTH = window.width;

// ✅ Your static data
const data = [
  {id: '1', src: require('../assets/images/poster_one.jpeg')},
  {id: '2', src: require('../assets/images/poster_two.jpeg')},
  {id: '3', src: require('../assets/images/poster_three.jpeg')},
];

const WelcomeImageCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <View>
      <Carousel
        loop
        autoPlay
        autoPlayInterval={3000}
        data={data}
        style={{
          width: PAGE_WIDTH,
          height: (PAGE_WIDTH * 8) / 8,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        width={PAGE_WIDTH}
        onSnapToItem={index => setCurrentIndex(index)}
        renderItem={({item, index}) => (
          <CustomItem key={`${item.id}-${index}`} item={item} index={index} />
        )}
        scrollAnimationDuration={150}
        pagingEnabled
      />

      {/* Pagination Dots */}
      <View
        style={{flexDirection: 'row', justifyContent: 'center', marginTop: 5}}>
        {data.map((_, index) => (
          <View
            key={index}
            style={{
              width: 30,
              height: 5,
              borderRadius: 10,
              backgroundColor:
                currentIndex === index ? Colors.app_primary_color : '#ffffff',
              marginHorizontal: 4,
              borderWidth: 1,
            }}
          />
        ))}
      </View>
    </View>
  );
};

const CustomItem = ({item}) => {
  const currentTheme = useSelector(getThemeMode);
  const {theme} = useTheme();
  const backgroundColor = theme('background');
  return (
    <View style={{flex: 1}}>
      <LinearGradient
        colors={
          currentTheme == 'dark'
            ? [
                'rgba(0,0,0,0)',
                'rgba(0,0,0,0)',
                'rgba(0,0,0,0)',
                'rgba(0,0,0,0.1)',
                'rgba(0,0,0,0.2)',
                'rgba(0,0,0,0.3)',
                'rgba(0,0,0,0.4)',
                'rgba(0,0,0,0.5)',
                'rgba(0,0,0,1)',
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
          zIndex: 99,
        }}></LinearGradient>
      <TouchableOpacity
        activeOpacity={1}
        style={{
          flex: 1,
          overflow: 'hidden',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 8,
          backgroundColor: 'black',
        }}>
        <Image
          style={{
            width: PAGE_WIDTH,

            height: (PAGE_WIDTH * 8) / 8,
            resizeMode: 'cover',
          }}
          source={item.src}
        />
      </TouchableOpacity>
    </View>
  );
};

export default WelcomeImageCarousel;
