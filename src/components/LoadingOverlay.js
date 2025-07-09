import React, { useEffect, useRef } from 'react';
import { Animated, View, ActivityIndicator, StatusBar } from 'react-native';
import Colors from '../constants/Colors';

const LoadingOverlay = ({ loading }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (loading) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [loading]);

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" />
      {loading && (
        <Animated.View
          pointerEvents="auto"
          style={{
            position: 'absolute',
            zIndex: 10,
            left: 0,
            right: 0,
            bottom: 0,
            top: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
            opacity: fadeAnim,
          }}
        >
          <ActivityIndicator size="large" color={Colors.app_primary_color} />
        </Animated.View>
      )}
    </>
  );
};

export default LoadingOverlay;
