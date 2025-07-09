import {useEffect, useState} from 'react';
import {StyleSheet, View, BackHandler, Alert, TouchableOpacity, Image} from 'react-native';
import {WebView} from 'react-native-webview';
import Colors, {themes} from '../../constants/Colors';
import Orientation from 'react-native-orientation-locker';
import LoadingOverlay from '../../components/LoadingOverlay';
import HeadersAppScreen from '../../components/HeadersAppScreen';
import useTheme from '../../hooks/useTheme';

function PlayerScreen({route, navigation}) {
  const [loading, setLoading] = useState(true);
  const {theme} = useTheme();
  const backAction = () => {
    Orientation.lockToPortrait();
    setTimeout(() => {
      navigation.goBack();
    }, 200);
    return true; // prevent default behavior
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove(); // cleanup
  }, []);

  const handleGoBack = () => {
    console.log("Coming in the back action");
    
    backAction();
  };

  return (
    <View style={styles.container} testID="player-one-container">
      <View
        style={{
          position: 'absolute',
          top: 40,
          left: 10,
          width: '100%',
          height: 40,
          zIndex: 20,
        }}>
        <View
          style={{
            width: 35,
            height: 35,
            backgroundColor: "#000",
            borderRadius: 20,
            justifyContent: "center",
            alignItems: "center"
          }}>
          {/* <HeadersAppScreen TitleName={''} onPress={handleGoBack} /> */}
          <TouchableOpacity activeOpacity={1} onPress={handleGoBack} style={{width: "100%", height: "100%", justifyContent: "center", alignItems: "center"}}>
              <Image
              style={{width: 22, height: 20}}
              source={require('../../assets/images/ico_backbtn.png')}
              />
          </TouchableOpacity>
        </View>
      </View>
      <LoadingOverlay loading={loading} />

      {route?.params?.videoUrl && (
        <WebView
          testID="player-one-webview"
          source={{uri: route?.params?.videoUrl}}
          style={{flex: 1, backgroundColor: Colors.screen_bgcolor}}
          allowsInlineMediaPlayback={true}
          mediaPlaybackRequiresUserAction={false}
          javaScriptEnabled={true}
          allowsFullscreenVideo={true}
          mixedContentMode="never"
          setSupportMultipleWindows={false}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => {
            setLoading(false);
          }}
          onShouldStartLoadWithRequest={request => {
            return request.url.startsWith('https://player.videasy.net');
          }}
          injectedJavaScript={`
                    document.body.style.userSelect = 'none'; 
                    document.body.style.webkitUserSelect = 'none'; 
                    document.body.style.msUserSelect = 'none'; 
                    document.body.style.touchAction = 'none';
                    var meta = document.createElement('meta');
                    meta.name = 'viewport';
                    meta.content = 'width=device-width, initial-scale=1.0, user-scalable=no';
                    document.getElementsByTagName('head')[0].appendChild(meta);

                    // MutationObserver to watch for DOM changes and remove "Settings" button if generated dynamically
                    const observer = new MutationObserver(() => {
                    // Here you can add any new logic you want (like removing or replacing other elements)
                    // Example: Removing all buttons containing "Settings"
                    document.querySelectorAll('button').forEach(btn => {
                    if (btn.textContent.trim() === 'Settings') {
                    btn.remove();
                    }
                    });
                    });
                    // Configuration of the observer (watch for added nodes)
                    const config = { childList: true, subtree: true };
                    // Start observing the body (or any specific container you want to observe)
                    observer.observe(document.body, config);true`}
        />
        // to Autoplay vedio put it in inject javascript
        // setTimeout(() => {
        //             // 1. Click the play button
        //             const playButton = document.querySelector('.play-icon-main')?.closest('button');
        //             if (playButton) {
        //             playButton.click();
        //             }
        //             }, 500);true;
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.screen_bgcolor,
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black', // optional translucent background
    zIndex: 1,
  },
});
export default PlayerScreen;
