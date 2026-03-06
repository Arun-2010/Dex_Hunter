import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import type { MainTabParamList } from "./types";
import HomeScreen from "../screens/HomeScreen";
import ARGameplayScreen from "../screens/ARGameplayScreen";
import ProfileScreen from "../screens/ProfileScreen";
import ClaimScreen from "../screens/ClaimScreen";

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#00FFA3",
        tabBarInactiveTintColor: "rgba(255,255,255,0.55)",
        tabBarStyle: {
          backgroundColor: "rgba(5,8,20,0.9)",
          borderTopColor: "rgba(123,92,255,0.25)",
          borderTopWidth: 1,
          height: 68,
        },
        tabBarIcon: ({ color, size, focused }) => {
          let name: keyof typeof Ionicons.glyphMap = "home";
          if (route.name === "Home") name = focused ? "home" : "home-outline";
          if (route.name === "Hunt") name = focused ? "aperture" : "aperture-outline";
          if (route.name === "Claim") name = focused ? "gift" : "gift-outline";
          if (route.name === "Profile") name = focused ? "person" : "person-outline";
          return <Ionicons name={name} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Hunt" component={ARGameplayScreen} />
      <Tab.Screen name="Claim" component={ClaimScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

