import React, {useEffect, useState, useRef} from 'react';
import {Text, useColorScheme, View, TextInput} from 'react-native';

import styles from '../Styles';
import {Colors} from 'react-native/Libraries/NewAppScreen';

const NewError = ({onChangeError, errorMessage, title}) => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.newErrorContainer}>
      <Text
        style={[
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
          styles.title,
        ]}>
        {title}
      </Text>
      <TextInput
        style={[
          styles.newErrorInput,
          {
            color: isDarkMode ? Colors.black : Colors.white,
            backgroundColor: isDarkMode ? Colors.white : Colors.black,
          },
        ]}
        onChangeText={onChangeError}
        value={errorMessage}
      />
    </View>
  );
};

export default NewError;
