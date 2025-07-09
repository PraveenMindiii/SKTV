import {
  View,
  TextInput,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import React, {useState} from 'react';
import {ConstValues} from '../constants/ConstValues';
import useTheme from '../hooks/useTheme';
const AuthTextInputField = ({
  errorMessage,
  ImageValue,
  placeholder,
  returnKeyType,
  onSubmitEditing,
  keyboardType,
  placeholderTextColor,
  value,
  ref,
  isPassword = false,
  secureTextEntry = false,
  onChangeText,
  maxLength,
  editable,
  blurOnSubmit,
}) => {
  const [isSecureEntry, setIsSecureEntry] = useState(secureTextEntry);
  const {theme} = useTheme();
  const background = theme('textfield_background');
  const bordercolor = theme('textfield_bordercolor');
  const heading = theme('heading')
  return (
    <View
      style={{
        width: '100%',
        paddingHorizontal: ConstValues.screenHorizontalPadding,
      }}>
      <View
        style={{
          width: '100%',
          borderWidth: 1,
          borderRadius: 10,
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: background,
          bordercolor: bordercolor,
        }}>
        <Image style={styles.Image} source={ImageValue} />
        <TextInput
          style={{
            paddingHorizontal: 10,
            flex: 1,
            padding: 12,
            fontSize: 18,
            color: heading,
            fontFamily: 'Quicksand-Regular',
          }}
          placeholder={placeholder}
          contextMenuHidden={true}
          keyboardType={keyboardType}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          ref={ref}
          placeholderTextColor={placeholderTextColor}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={isSecureEntry}
          autoCapitalize="none"
          maxLength={maxLength}
          editable={editable}
          blurOnSubmit={blurOnSubmit}
        />

        {isPassword && (
          <TouchableOpacity
            onPress={() => setIsSecureEntry(!isSecureEntry)}
            activeOpacity={1}>
            <Image
              source={
                isSecureEntry
                  ? require('../assets/images/ico_disablePassword.png')
                  : require('../assets/images/ico_visiblePassword.png')
              }
              style={styles.icon}
            />
          </TouchableOpacity>
        )}
      </View>
      {errorMessage ? (
        <Text
          style={{
            flex: 1,
            color: 'red',
            fontFamily: 'Quicksand-Regular',
            fontSize: 12,
            marginHorizontal: 5,
            marginTop: 2,
          }}>
          {errorMessage}
        </Text>
      ) : null}
    </View>
  );
};
export default AuthTextInputField;

const styles = StyleSheet.create({
  container: {},
  input: {},
  Image: {
    height: 25,
    width: 25,
    resizeMode: 'contain',
    marginLeft: 15,
  },
  icon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    marginRight: 15,
  },
});
