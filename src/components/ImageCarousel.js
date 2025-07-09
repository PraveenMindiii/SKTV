import {useEffect, useRef, useState} from 'react';
import {
  Animated,
  Dimensions,
  Image,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {ConstValues} from '../constants/ConstValues';
import Colors from '../constants/Colors';
import ImageWithLoading from './ImageWithLoading';

const ImageCarousel = ({data, handleOnPressBanner}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      // Fade out
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        // Update index after fade out
        const nextIndex = (currentIndex + 1) % data.length;
        setCurrentIndex(nextIndex);

        // Fade in
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex, data.length, fadeAnim]);

  return (
    <View
      style={{
        alignSelf: 'center',
        paddingHorizontal: ConstValues.screenHorizontalPadding,
        width: '100%',
      }}>
      <Animated.View style={{opacity: fadeAnim}}>
        <CustomItem
          key={`${data[currentIndex].id}-${currentIndex}`}
          item={data[currentIndex]}
          handleOnPressBanner={handleOnPressBanner}
        />
      </Animated.View>
      <Pressable
        onPress={() => {
          handleOnPressBanner(data[currentIndex]._id);
        }}
        style={{
          bottom: ConstValues.screenHorizontalPadding,
          right: ConstValues.screenHorizontalPadding + 16,
          backgroundColor: Colors.app_primary_color,
          position: 'absolute',
          zIndex: 99,
          borderRadius: 50,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 15,
        }}>
        <Image
          source={require('../assets/images/ico_play.png')}
          style={{height: 24, width: 24, resizeMode: 'cover'}}
        />
      </Pressable>
    </View>
  );
};

const CustomItem = ({item, handleOnPressBanner}) => {
  return (
    <View
      style={{
        overflow: 'hidden',
        width: '100%',
        alignSelf: 'center',
        borderRadius: 12,
      }}>
      <ImageWithLoading
        style={{
          width: '100%',
          aspectRatio: 11 / 9,
        }}
        source={{uri: item.poster_path, priority: FastImage.priority.normal}}
        resizeMode={FastImage.resizeMode.cover}
      />
    </View>
  );
};

export default ImageCarousel;
