/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect, useState, useRef} from 'react';
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
  TextInput,
  Alert,
  Pressable,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';

import Config from 'react-native-config';
import * as Sentry from '@sentry/react-native';

import DropDownPicker from 'react-native-dropdown-picker';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import styles from './Styles';

// Components Import
import CustomButton from './components/CustomButton';
import NewError from './components/NewError';
import CustomTextInput from './components/CustomTextInput';
import DynamicTextInput from './components/DynamicTextInput';

Sentry.init({
  dsn: Config.SENTRY_SECRET_KEY,
  tracesSampleRate: 1.0,
  attachStacktrace: true,

  environment: 'staging',
  onReady: ({didCallNativeInit}) => {
    console.log('onReady called with didCallNativeInit:', didCallNativeInit);
    Alert.alert('Sentry Initialized');
  },
  beforeSend(event) {
    console.log('BEFORE MODIFICATION: EVENT', event);
    // Modify the event here
    // if (event && event.user) {
    //   event.user = {
    //     firstname: 'Test',
    //     lastname: 'User',
    //     email: 'testusersentry@yopmail.com',
    //   };
    // }
    // console.log('AFTER MODIFICATION: EVENT', event);
    return event;
  },
});

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
  };

  const [errorMessage, setErrorMessage] = useState('');
  const [errorType, setErrorType] = useState(null);

  const [open, setOpen] = useState(false);
  const [errorStates, setErrorStates] = useState([
    {label: 'Fatal', value: 'fatal'},
    {label: 'Critical', value: 'critical'},
    {label: 'Error', value: 'error'},
    {label: 'Warning', value: 'warning'},
    {label: 'Log', value: 'log'},
    {label: 'Info', value: 'info'},
    {label: 'Debug', value: 'debug'},
  ]);

  const [contextName, setContextName] = useState(null);

  const [textValue, setTextValue] = useState('');
  const [numInputs, setNumInputs] = useState(3);
  const refInputs = useRef([textValue]);

  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [userId, setUserId] = useState(null);
  const [email, setEmail] = useState(null);

  const setInputValue = (index, value) => {
    // first, we are storing input value to refInputs array to track them
    const inputs = refInputs.current;
    inputs[index] = value;
    // we are also setting the text value to the input field onChangeText
    setTextValue(value);
  };

  const addInput = () => {
    // add a new element in our refInputs array
    refInputs.current.push('');
    // increase the number of inputs
    setNumInputs(value => value + 1);
  };

  const removeInput = i => {
    // remove from the array by index value
    refInputs.current.splice(i, 1)[0];
    // decrease the number of inputs
    setNumInputs(value => value - 1);
  };

  const captureException = err => {
    console.log('captureException:', err);
    Sentry.captureException(err);
  };

  const captureMessage = (msg, type) => {
    console.log('captureMessage:', msg, type);
    Sentry.captureMessage(msg, type);
  };

  const setCustomContext = (contextName, contextData) => {
    Sentry.setContext(contextName, contextData);
  };

  const setCustomUser = () => {
    const user = {
      firstname: firstName,
      lastname: lastName,
      email: email,
      id: userId,
    };
    if (!firstName && !lastName && !email && !userId) {
      return Alert.alert('Error', 'Add complete user data to update on sentry');
    }
    Sentry.setUser(user);
  };

  const throwNewError = errorMessage => {
    try {
      throw new Error(errorMessage);
    } catch (err) {
      if (errorType) {
        return captureMessage(errorMessage, errorType);
      }
      return captureException(err);
    }
    // throw new Error(errorMessage);
  };

  const inputs = [];
  for (let i = 0; i < numInputs; i++) {
    inputs.push(
      <DynamicTextInput
        refInputs={refInputs}
        index={i}
        removeInput={removeInput}
        setInputValue={setInputValue}
      />,
    );
  }

  const assignRandId = () => {
    let length = 24;
    var result = '';
    var characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    setUserId(result);
    return result;
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView>
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
            flex: 1,
          }}>
          <Text
            style={[
              styles.title,
              {
                color: isDarkMode ? Colors.white : Colors.black,
                fontSize: 30,
                marginVertical: 30,
              },
            ]}>
            Sentry RN
          </Text>
          <NewError
            title={'Error Message'}
            errorMessage={errorMessage}
            onChangeError={setErrorMessage}
          />
          <Text
            style={[
              {
                color: isDarkMode ? Colors.white : Colors.black,
              },
              styles.title,
            ]}>
            Error Type
          </Text>
          <DropDownPicker
            open={open}
            value={errorType}
            items={errorStates}
            setOpen={setOpen}
            setValue={setErrorType}
            setItems={setErrorStates}
            containerStyle={styles.dropdownStyle}
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainerStyle}
          />
          <CustomButton
            style={styles.button}
            name={'Clear Error Type'}
            onPress={() => {
              setErrorType(null);
            }}
          />
          <NewError
            title={'Custom Context Name'}
            errorMessage={contextName}
            onChangeError={setContextName}
          />
          <View style={styles.inputsView}>{inputs}</View>
          <CustomButton
            style={styles.button}
            name={'Set Custom Context'}
            onPress={() => {
              if (
                contextName &&
                refInputs &&
                refInputs.current &&
                refInputs.current.length
              ) {
                console.log('REFT', refInputs.current);
                let obj = {};
                for (var i = 0; i < refInputs.current.length; i++) {
                  obj = {...obj, [`contextKey${i}`]: refInputs.current[i]};
                }
                if (Object.keys(obj).length === refInputs.current.length) {
                  setCustomContext(contextName, obj);
                }
              }
            }}
          />
          <Text
            style={[
              {
                color: isDarkMode ? Colors.white : Colors.black,
                marginBottom: 20,
              },
              styles.title,
            ]}>
            User Details
          </Text>
          <CustomTextInput
            title={'First Name'}
            onChangeText={setFirstName}
            text={firstName}
          />
          <CustomTextInput
            title={'Last Name'}
            onChangeText={setLastName}
            text={lastName}
          />
          <CustomTextInput
            title={'Email'}
            onChangeText={setEmail}
            text={email}
          />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              width: '100%',
            }}>
            <CustomTextInput
              title={'User Id'}
              onChangeText={setUserId}
              text={userId}
              disabled
              width={'85%'}
            />
            <Pressable onPress={() => assignRandId()}>
              <FontAwesome5 name="id-card" size={20} color="red" />
            </Pressable>
          </View>
          <CustomButton
            style={styles.button}
            name={'Set User'}
            onPress={() => {
              setCustomUser();
            }}
          />
          <CustomButton
            style={styles.button}
            name={'Throw Error'}
            onPress={() => {
              throwNewError(errorMessage);
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Sentry.wrap(App);
