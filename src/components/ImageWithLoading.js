import React, {useState} from 'react';
import {View, StyleSheet, Image} from 'react-native';
import FastImage from 'react-native-fast-image';

const ImageWithLoading = ({
  style,
  source,
  resizeMode = FastImage.resizeMode.cover,
  loaderSource = require('../assets/images/icon_pulse.gif'), // your gif path
  placeholderSource = require('../assets/images/icon_movie_placeholder.png'), // your gif path
}) => {
  return (
    <View style={[styles.container, style]}>
      <FastImage
        style={{
          position: 'absolute',
          height: '100%',
          width: '100%',
          zIndex: 50,
        }}
        source={source}
        resizeMode={resizeMode}
      />
      <View style={styles.loader}>
        <Image
          source={placeholderSource}
          style={styles.loaderGif}
          resizeMode="cover"
        />
        {/* <Image
          source={loaderSource}
          style={styles.loaderGif}
          resizeMode="contain"
        /> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  loader: {
    // ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    width: 50,
    height: 50,
  },
  loaderGif: {
    width: '100%',
    height: '100%',
  },
});

export default React.memo(ImageWithLoading, (prev, next) => {
  return (
    prev.source?.uri === next.source?.uri &&
    JSON.stringify(prev.style) === JSON.stringify(next.style)
  );
});
