import React, { Component } from "react";
import { LogBox, Platform, Linking } from "react-native";
import { Provider } from "react-redux";
import AppNavigator from "./navigator/AppNavigator";
import store from "./store";
import Update from "./page/updateApp/update";
import SplashScreen from "react-native-splash-screen";
import ShareLinking from "./util/ShareLinking";
import _updateConfig from "../update.json";
const { appKey } = _updateConfig[Platform.OS];

class App extends Component {
  render() {
    LogBox.ignoreAllLogs();
    return (
      <Provider store={store}>
        <AppNavigator />
      </Provider>
    );
  }
}

export default Update(ShareLinking(App), { appKey });
