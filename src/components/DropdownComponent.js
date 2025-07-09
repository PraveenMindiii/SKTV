import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import Colors from '../constants/Colors';
import useTheme from '../hooks/useTheme';
import {useSelector} from 'react-redux';
import {getThemeMode} from '../contexts/ThemeSlice';

const DropdownComponent = ({data, onClickCallback}) => {
  const [value, setValue] = useState(null); // initially null
  const [isFocus, setIsFocus] = useState(false);
  const {theme} = useTheme();
  const currentTheme = useSelector(getThemeMode);
  const dropdawnBgColor = theme('dropdawn_background');
  const heading = theme('heading');
  const dropdownData = data.map(item => ({
    ...item,
    season: `${item.season}`,
    seasonLabel:
      item.season == 0
        ? item.season_name
        : `Season ${item.season} (EP ${item.episode.length})`,
  }));
  // Assuming your data is coming from an API or is already available
  useEffect(() => {
    if (data.length > 0) {
      setValue(data[0].season_id); // auto-select first item
      onClickCallback(data[0]); // call your callback if needed
    }
  }, [data]);

  return (
    <View>
      {/* {renderLabel()} */}
      <Dropdown
        style={[
          styles.dropdown,
          {backgroundColor: dropdawnBgColor},
          isFocus && {borderColor: Colors.app_primary_color},
        ]}
        data={dropdownData}
        value={value}
        labelField="seasonLabel" // now it's a string
        valueField="season_id" // can stay a number
        placeholder="Select Season"
        placeholderStyle={{color: heading}}
        selectedTextStyle={{
          color: heading,
          fontFamily: 'Quicksand-Regular',
          fontSize: 14,
        }}
        containerStyle={{
          marginTop: 10,
          borderWidth: 0,
          borderRadius: 12,
          backgroundColor: dropdawnBgColor,
        }}
        activeColor={'transparent'}
        renderItem={(item, selected) => (
          <View
            style={{
              alignItems: 'center',
              flexDirection: 'row',
              padding: 10,
              borderColor: '#515151',
              borderTopWidth:
                dropdownData[0].season_id == item.season_id ? 0 : 0.5,
            }}>
            <Text
              numberOfLines={1}
              style={{
                color: heading,
                fontFamily: 'Quicksand-SemiBold',
                fontSize: 12,
                flex: 1,
              }}>
              {item.season == 0
                ? item.season_name
                : 'Season ' +
                  item.season +
                  ' ' +
                  '(' +
                  item.episode.length +
                  ' ' +
                  'EP)'}
            </Text>
            {selected && (
              <Image
                source={
                  currentTheme === 'light'
                    ? require('../assets/images/ico_tick_light.png')
                    : require('../assets/images/ico_tick.png')
                }
                style={{height: 7, width: 10}}
              />
            )}
          </View>
        )}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={item => {
          setValue(item.season_id);
          onClickCallback(item);
          setIsFocus(false);
        }}
      />
    </View>
  );
};

export default DropdownComponent;

const styles = StyleSheet.create({
  dropdown: {
    borderColor: '#4A4A4A',
    borderWidth: 0.5,
    borderRadius: 8,
    padding: 10,
    width: '50%',
  },
});
