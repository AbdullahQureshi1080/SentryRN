/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  Button,
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TouchableOpacity,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';

import Config from 'react-native-config';

import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: Config.SENTRY_SECRET_KEY,
  tracesSampleRate: 1.0,
});

const Section = ({children, title}) => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};

const CustomButton = ({name, style, onPress}) => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <TouchableOpacity
      style={[
        styles.buttonContainer,
        style,
        {backgroundColor: isDarkMode ? Colors.white : Colors.black},
      ]}
      onPress={onPress}>
      <Text
        style={[
          styles.buttonText,
          {color: isDarkMode ? Colors.black : Colors.white},
        ]}>
        {name}
      </Text>
    </TouchableOpacity>
  );
};

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
  };

  const throwNewError = () => {
    try {
      throw new Error('My Second Sentry error!');
    } catch (error) {
      console.log('Error', error);
    }
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="Sentry RN"></Section>

          <CustomButton
            style={styles.button}
            name={'Throw Error'}
            onPress={() => {
              throwNewError();
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  buttonContainer: {
    alignSelf: 'center',
    width: Dimensions.get('screen').width / 2.8,
    backgroundColor: Colors.white,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 5,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 18,
  },
});

export default Sentry.wrap(App);
