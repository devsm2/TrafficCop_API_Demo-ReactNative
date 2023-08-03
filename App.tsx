/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState } from 'react';
import {
  Button,
  SafeAreaView,
  StatusBar,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { Platform, NativeModules } from 'react-native';


function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [ivtScore, setIvtScore] = useState<string>('NA')

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  function getLanguage() {
    return Platform.OS === 'ios'
      ? NativeModules.SettingsManager.settings.AppleLocale ||
      NativeModules.SettingsManager.settings.AppleLanguages[0] //iOS 13
      : NativeModules.I18nManager.localeIdentifier;
  }

  function getTimeZoneOffset() {
    const date = Date.now();
    const timeZoneOffset = new Date().getTimezoneOffset();
    const minutesOffset = Math.floor(timeZoneOffset);
    return minutesOffset;
  }

  function getApplicationId() {
    return Platform.OS === 'ios'
      ? 'iOS Bundle ID'
      : 'Android Application ID'
  }

  async function makeTcApiCall(
  ) {
    let requestBody = JSON.stringify({
      appId: getApplicationId(),
      navigatorLanguage: getLanguage(),
      timezoneOffset: getTimeZoneOffset(),
    });
    
    console.log(requestBody);

    try {
      let requestBody = JSON.stringify({
        appId: getApplicationId(),
        navigatorLanguage: getLanguage(),
        timezoneOffset: getTimeZoneOffset(),
      })

      console.log(requestBody)

      const response = await fetch('https://tc.pubguru.net/v1', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Token ADD_TOKEN_HERE'
        },
        body: requestBody,
      });

      const json = await response.json();
      console.log(json);
      setIvtScore(json.ivtScore);
    } catch(error) {
      console.error(error);
    }
  }

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <View
        style={{
          backgroundColor: isDarkMode ? Colors.black : Colors.white,
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Button title="Call TrafficCop API" onPress={() => makeTcApiCall()} />
        <Text style={{ margin: 40, fontWeight: 'bold' }}>
          IVT Score
        </Text>
        <Text>
          {ivtScore}
        </Text>
      </View>
    </SafeAreaView>
  );
}

export default App;