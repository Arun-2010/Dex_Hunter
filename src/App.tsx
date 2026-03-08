import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { enableScreens } from "react-native-screens";
import { SafeAreaProvider } from "react-native-safe-area-context";

import RootNavigator from "./navigation/RootNavigator";

enableScreens(true);

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <RootNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
