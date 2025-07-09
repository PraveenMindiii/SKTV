import React, {useState} from 'react';
import {View, Text, Pressable} from 'react-native';
import useTheme from '../hooks/useTheme';
import useTranslate from '../hooks/useTranslate';

const DetailsComponent = ({label, detail}) => {
  const {t} = useTranslate();
  const [expanded, setExpanded] = useState(false);
  const [showReadMore, setShowReadMore] = useState(false);
   const {theme} = useTheme();
   const viewBackgroundColor = theme('view_background');
   const lblColor = theme('lbl_color');
   const lblMoreColor = theme('lblMore_color');
   const more = t('MORE')
   const less = t('LESS')
  return (
    <View
      style={{
        width: '100%',
        backgroundColor: viewBackgroundColor,
        padding: 10,
        flexDirection: 'row',
        gap: 10,
      }}>
      <Text
        style={{
          fontSize: 12,
          fontFamily: 'Quicksand-Bold',
          color: lblColor,
        }}>
        {label}
      </Text>
      <View style={{flex: 1}}>
   
        <Text
          style={{
            fontSize: 12,
            fontFamily: 'Quicksand-Regular',
            color: lblColor,
            marginLeft: 2,
     
          }}
          numberOfLines={expanded ? undefined : 1}>
          {detail}

         
        </Text>

        <Text
          style={{
            fontSize: 12,
            fontFamily: 'Quicksand-Regular',
            marginLeft: 2,
            opacity: 0,
            position: 'absolute',
            zIndex: -1,
            backgroundColor : 'blue'
          }}
          onTextLayout={e => {
            if (e.nativeEvent.lines.length > 1 && !showReadMore) {
              setShowReadMore(true);
            }
          }}>
          {detail}
        </Text>
          {showReadMore && (
          <Pressable onPress={() => setExpanded(prev => !prev)} style = {{}}>
            <Text
              style={{
                 color: lblMoreColor,
                fontFamily: 'Quicksand-SemiBold',
                fontSize: 12,
              }}>
              {expanded ? less : more}
            </Text>
          </Pressable>
        )}
        
      </View>
    </View>
  );
};

export default DetailsComponent;
