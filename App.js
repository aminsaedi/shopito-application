import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import AppLoading from "expo-app-loading";
import { NavigationContainer } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { StyleSheet, Text, View } from "react-native";

import AuthContext from "./app/auth/context";
import authStorage from "./app/auth/storage";
import navigationTheme from "./app/navigation/navigationTheme";

import OfflineNotice from "./app/components/modules/OfflineNotice";
import WelcomeScreen from "./app/Screens/WelcomeScreen";
import AuthNavigator from './app/navigation/AuthNavigator';
import AppNavigator from "./app/navigation/AppNavigator";

const customFonts = {
  bKoodak: require("./app/assets/fonts/bKoodak.ttf"),
};

export default function App() {
  const [user, setUser] = useState();
  const [isReady, setIsReady] = useState(false);
  const [isLoaded] = useFonts(customFonts);
  const restoreUser = async () => {
    const user = await authStorage.getUser();
    if (user) setUser(user);
  };
  if (!isReady || !isLoaded)
    return (
      <AppLoading
        startAsync={restoreUser}
        onFinish={() => setIsReady(true)}
        onError={() => console.log("Error loading app")}
      />
    );
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <OfflineNotice />
      <NavigationContainer theme={navigationTheme}>
        {user ? <AppNavigator /> : <AuthNavigator />}
      </NavigationContainer>
    </AuthContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
