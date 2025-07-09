import {View, Text, StyleSheet, Image, Pressable} from 'react-native';
import Colors from '../constants/Colors';

import {ConstValues} from '../constants/ConstValues';


const OpenCameraGallery = ({visible, onClose, title}) => {
  return (
    visible && (
      <Pressable onPress={onClose} style={styles.overlay}>
        <Pressable style={styles.modalContainer}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={styles.title}>{title}</Text>
            <Pressable onPress={onClose}>
              <Image
                style={styles.imgClose}
                source={require('../assets/images/ico_cancel.png')}
              />
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    )
  );
};

export default OpenCameraGallery;
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
    alignItems: 'center',
    position: 'absolute',
    zIndex: 99,
  },
  modalContainer: {
  
      width: '100%',
      backgroundColor: Colors.white,
      paddingHorizontal: ConstValues.screenHorizontalPadding,
      paddingTop: 20,
      borderTopEndRadius: 20,
      borderTopStartRadius: 20,
      paddingBottom: 20,
      backgroundColor: Colors.bg_color,

  },
  title: {
    fontSize: 18,
    fontFamily: 'Quicksand-Medium',
    marginBottom: 10,
    color: Colors.white,
  },

  imgClose: {
    height: 25,
    width: 25,
    resizeMode: 'cover',
  },
  textLang: {
    fontSize: 18,
    color: Colors.white,
    fontFamily: 'Quicksand-Medium',
  },
});
