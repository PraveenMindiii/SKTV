import CountryPicker from 'react-native-country-picker-modal';

const AuthCountryPickerModel = ({ countryCode, onClose, visible, onSelect }) => {
  return (
    <CountryPicker
      withCallingCode
      withFlag
      withFilter
      withAlphaFilter
      withFlagButton={false}
      visible={visible}
      countryCode={countryCode}
      onClose={onClose}
      onSelect={onSelect}
    />
  );
};

export default AuthCountryPickerModel;
