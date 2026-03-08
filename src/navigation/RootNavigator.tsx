import React, { useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import type { RootStackParamList } from "./types";
import SplashScreen from "../screens/SplashScreen";
import AuthScreen from "../screens/AuthScreen";
import MainTabs from "./MainTabs";
import CoinDetailScreen from "../screens/CoinDetailScreen";
import { useGameStore } from "../store/gameStore";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const { boot, isAuthed } = useGameStore();

  useEffect(() => {
    boot();
  }, [boot]);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      {!isAuthed ? (
        <Stack.Screen name="Auth" component={AuthScreen} />
      ) : (
        <>
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen
            name="CoinDetail"
            component={CoinDetailScreen}
            options={{ presentation: "modal" }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

