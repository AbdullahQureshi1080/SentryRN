import React, {useEffect, useState, useRef} from 'react';
import {Text, useColorScheme, View, TextInput, Pressable} from 'react-native';

import styles from '../Styles';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import Entypo from 'react-native-vector-icons/Entypo';

const DynamicTextInput = ({index, refInputs, removeInput, setInputValue}) => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View key={index}>
      <Text style={[styles.title, {fontSize: 15}]}>
        Custom Context Data {index + 1}
      </Text>
      <View
        key={index}
        style={[
          {
            flexDirection: 'row',
            alignItems: 'center',
            width: '100%',
          },
        ]}>
        <TextInput
          style={[
            styles.input,
            {
              color: isDarkMode ? Colors.black : Colors.white,
              backgroundColor: isDarkMode ? Colors.white : Colors.black,
              width: '80%',
            },
          ]}
          onChangeText={value => setInputValue(index, value)}
          value={refInputs.current[index]}
        />
        {/* To remove the input */}
        <Pressable onPress={() => removeInput(index)} style={{marginLeft: 5}}>
          <Entypo name="minus" size={20} color="red" />
        </Pressable>
      </View>
    </View>
  );
};

export default DynamicTextInput;
