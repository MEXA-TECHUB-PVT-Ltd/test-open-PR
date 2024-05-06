import React, { useEffect, useState } from 'react';
import { LogBox, StatusBar, Text, View, StyleSheet } from 'react-native';
import MainStack from './src/navigations/MainStack';
import { Provider } from "react-redux";
import store from "./src/redux/store";
import NetInfo from "@react-native-community/netinfo";
import fonts from './src/theme/fonts';
import colors from './src/theme/colors';
import {StripeProvider} from '@stripe/stripe-react-native';
export default function App() {
  const [isConnected, setConnected] = useState(false)
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setConnected(state.isConnected)
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    LogBox.ignoreLogs(["VirtualizedLists should never be nested"])
    LogBox.ignoreLogs(["ViewPropTypes will be removed from React Native"])
    LogBox.ignoreLogs(["Task orphaned for request"])
    LogBox.ignoreLogs(["Sending `onAnimatedValueUpdate` with no listeners registered"])
    LogBox.ignoreLogs(["Animated: `useNativeDriver` was not specified."])
    LogBox.ignoreLogs(["Warning: componentWillMount has been renamed,"])
    LogBox.ignoreLogs(["Animated.event now requires a second"])
  }, [])

  const renderNetworkStatus = () => {
    return <>
      {
        !isConnected ?
          <View style={styles.networkContainerStyle}>
            <Text style={styles.textStyle}>
              You are offline, Check your internet connection.
            </Text>
          </View> :
          <></>}

    </>
  }

  return (
    
    <Provider store={store}>
      <View style={styles.container}>
      <StatusBar
          backgroundColor="white"
          barStyle="dark-content" // You can also set it to "dark-content"
        />
          {renderNetworkStatus()}
          <MainStack />
        </View>
    </Provider>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  networkContainerStyle: {
    backgroundColor: '#333333',
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop:40
  },
  textStyle: {
    color: 'white',
    fontFamily: fonts.fontsType.medium,
    fontSize: 14
  },

});
