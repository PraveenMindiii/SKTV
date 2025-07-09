import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  Dimensions,
} from 'react-native';
import {useState} from 'react';
import AuthCountryPickerModel from './AuthCountryPickerModel';
import {ConstValues} from '../constants/ConstValues';
import useTheme from '../hooks/useTheme';

const deviceWidth = Dimensions.get('window').width;

const CustomCountrycodeWithPhoneNumber = ({
  returnKeyType,
  errorMessage,
  value,
  onChangeText,
  placeholder,
  maxLength,
  onSubmitEditing,
  ref,
  isShowError,
  ErrorMessage,
  blurOnSubmit,
}) => {
  const [isCountryPickerVisible, setIsCountryPickerVisible] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState({
    cca2: 'IN',
    callingCode: '91',
  });
     const {theme} = useTheme();
  const background = theme('textfield_background');
  const bordercolor = theme('textfield_bordercolor')
  return (
    <View
      style={{
        width: '100%',
        paddingHorizontal: ConstValues.screenHorizontalPadding,
      }}>
      <View
        style={{
          width: '100%',
          backgroundColor: background,
          borderWidth: 1,
          borderRadius: 10,
          borderColor:bordercolor,
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 2,
        }}>
        <TouchableOpacity
          onPress={() => setIsCountryPickerVisible(true)}
          activeOpacity={1}
          style={{
            justifyContent: 'center',
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          {/* Flag Show Here */}
          <Text
            style={{
              color: 'white',
              marginRight: 5,
              marginLeft: 15,
            }}>
            {selectedCountry.cca2 ? (
              <Image
                source={{
                  uri: `https://flagcdn.com/w40/${selectedCountry.cca2.toLowerCase()}.png`,
                }}
                style={{width: 25, height: 18,}}
              />
            ) : null}
          </Text>

          <Text
            style={{
              marginLeft: 5,
              fontSize: 18,
              color: '#fff',
              fontFamily: 'Quicksand-Regular',
            }}>
            {'+'}
            {selectedCountry.callingCode}
          </Text>

          <Image
            style={{
              height: 25,
              width: 25,
              marginRight: 10,
              resizeMode: 'contain',
            }}
            source={require('../assets/images/ico_dropdown.png')}
          />
        </TouchableOpacity>

        <TextInput
          value={value}
          contextMenuHidden={true}
          ref={ref}
          onSubmitEditing={onSubmitEditing}
          style={{
            fontSize: 18,
            color: '#fff',
            fontFamily: 'Quicksand-Regular',
            flex: 1,
          }}
          placeholder={placeholder}
          placeholderTextColor={'#677D7D'}
          returnKeyType={returnKeyType}
          onChangeText={onChangeText}
          keyboardType={'number-pad'}
          maxLength={maxLength}
          blurOnSubmit={blurOnSubmit}
        />
      </View>

      {errorMessage ? (
        <Text
          style={{
            color: 'red',
            fontFamily: 'Jost_400Regular',
            fontSize: 12,
            marginHorizontal: 5,
            marginTop: 2,
          }}>
          {errorMessage}
        </Text>
      ) : null}

      <AuthCountryPickerModel
        visible={isCountryPickerVisible}
        countryCode={selectedCountry.cca2}
        onClose={() => setIsCountryPickerVisible(false)}
        onSelect={val => {
          setSelectedCountry({
            cca2: val.cca2,
            callingCode: val.callingCode[0],
          });
          setIsCountryPickerVisible(false);
        }}
      />
    </View>
  );
};

export default CustomCountrycodeWithPhoneNumber;
