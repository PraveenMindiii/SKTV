import React, {useRef, useState} from 'react';
import {View, TextInput, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {getThemeMode} from '../contexts/ThemeSlice';
import { useSelector } from 'react-redux';

const ManualOtpInput = ({sendOtp}) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']); // 6-digit OTP
  const inputs = useRef([]);
  const [showPin, setShowPin] = useState(true)
  const currentTheme = useSelector(getThemeMode);
  const appTheme = useSelector(state => state.appthemes)

  const handleChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    sendOtp(newOtp.join(''));

    // Auto focus next input
    if (text && index < otp.length - 1) {
      inputs?.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace') {
      const newOtp = [...otp];

      if (newOtp[index] === '' && index > 0) {
        // Focus previous input
        inputs.current[index - 1]?.focus();
      } else {
        newOtp[index] = '';
        setOtp(newOtp);

        if (index > 0) {
          setTimeout(() => inputs.current[index - 1]?.focus(), 0);
        }
      }
    }
  };

  return (
    <View style={[styles.container, {backgroundColor: currentTheme == "dark" ? '#1C1D23' : "#FFFFFF"}]}>
      {otp.map((value, index) => (
        <TextInput
          key={index}
          value={value}
          placeholder="X"
          placeholderTextColor="#8C8C8C"
          keyboardType="number-pad"
          maxLength={1}
          onChangeText={text => {
            const filteredNumber = text.replace(/[^0-9]/g, '');
            handleChange(filteredNumber, index);
          }}
          onKeyPress={e => handleKeyPress(e, index)}
          ref={ref => {
            if (ref) {
              inputs.current[index] = ref;
            }
          }}
          style={[styles.input, {color: currentTheme == 'dark' ? '#FFFFFF' : '#000000'}]}
          secureTextEntry={showPin}
        />
      ))}
      <TouchableOpacity
      onPress={()=>{
        setShowPin(!showPin)
      }}
      activeOpacity={1}
        style={{
          height: '100%',
          backgroundColor: appTheme?.themeColor,
          borderWidth: 0.3,
          borderColor: '#394848',
          justifyContent:"center",
          alignItems:"center",
          flex:1
        }}>
          <Image style={{
            height:18,
            width:18,
            resizeMode:"contain"
          }} source={showPin ? require('../assets/images/open_eye_icon.png'):require('../assets/images/close_eye_icon.png')} />
        </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '99.5%',
    // backgroundColor:"red",
    flex: 1,
    height: 50,
    borderWidth: 0.3,
    borderRadius: 5,
    overflow: 'hidden',
    borderColor: '#394848',
    // justifyContent:"space-between"
  },
  input: {
    width: '14.8%',
    height: '100%',
    // marginHorizontal: 5,
    borderWidth: 0.3,
    borderColor: '#394848',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ManualOtpInput;
