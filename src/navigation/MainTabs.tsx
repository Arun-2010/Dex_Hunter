import React from "react";
import { View, StyleSheet, Text, SafeAreaView } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import Animated, { useAnimatedStyle, withSpring } from "react-native-reanimated";

import type { MainTabParamList } from "./types";
import HomeScreen from "../screens/HomeScreen";
import ARGameplayScreen from "../screens/ARGameplayScreen";
import ProfileScreen from "../screens/ProfileScreen";
import ClaimScreen from "../screens/ClaimScreen";
import { useGameStore } from "../store/gameStore";

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTabs() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarShowLabel: false,
            tabBarActiveTintColor: "#00FFA3",
            tabBarInactiveTintColor: "rgba(255,255,255,0.4)",
            tabBarStyle: {
              backgroundColor: "rgba(10,15,44,0.85)",
              borderTopColor: "rgba(0,255,163,0.3)",
              borderTopWidth: 1,
              height: 80,
              paddingBottom: 8,
              paddingTop: 8,
              borderRadius: 25,
              marginHorizontal: 20,
              marginBottom: 20,
              borderWidth: 1,
              borderColor: "rgba(123,92,255,0.4)",
              shadowColor: "#00FFA3",
              shadowOffset: { width: 0, height: -4 },
              shadowOpacity: 0.3,
              shadowRadius: 12,
              elevation: 8,
            },
            tabBarItemStyle: {
              paddingVertical: 5,
            },
            tabBarIcon: ({ color, size, focused }) => {
              let name: keyof typeof Ionicons.glyphMap = "home";
              let label = "";
              if (route.name === "Home") { name = focused ? "home" : "home-outline"; label = "Home"; }
              if (route.name === "Hunt") { name = focused ? "aperture" : "aperture-outline"; label = "Hunt"; }
              if (route.name === "Claim") { name = focused ? "gift" : "gift-outline"; label = "Rewards"; }
              if (route.name === "Profile") { name = focused ? "person" : "person-outline"; label = "Profile"; }

              if (route.name !== "Claim") {
                return (
                  <View style={styles.tabItem}>
                    <Animated.View style={styles.iconContainer}>
                      <View style={styles.iconWrapper}>
                        <Ionicons name={name} size={22} color={color} />
                      </View>
                    </Animated.View>
                    <Text style={[styles.tabLabel, { color, opacity: focused ? 1 : 0.6 }]}>
                      {label}
                    </Text>
                  </View>
                );
              }

              const { tokenCounts, claimedRewards } = useGameStore();
              const REQUIRED_TOKENS = 5;
              const hasRewardReady =
                Object.values(tokenCounts).some((count) => count >= REQUIRED_TOKENS) && 
                !Object.entries(tokenCounts).some(([symbol, count]) => 
                  count >= REQUIRED_TOKENS && claimedRewards.some(reward => reward.tokenSymbol === symbol)
                );

              return (
                <View style={styles.tabItem}>
                  <Animated.View style={styles.iconContainer}>
                    <View style={styles.iconWrapper}>
                      <Ionicons name={name} size={22} color={color} />
                    </View>
                    {hasRewardReady && <View style={styles.badgeDot} />}
                  </Animated.View>
                  <Text style={[styles.tabLabel, { color, opacity: focused ? 1 : 0.6 }]}>
                    {label}
                  </Text>
                </View>
              );
            },
          })}
        >
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Hunt" component={ARGameplayScreen} />
          <Tab.Screen name="Claim" component={ClaimScreen} />
          <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "rgb(5,8,20)", // Match app background
  },
  container: {
    flex: 1,
    backgroundColor: "rgb(5,8,20)", // Match app background
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    gap: 4,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    position: "relative",
  },
  activeIconContainer: {
    backgroundColor: "rgba(0,255,163,0.2)",
    borderWidth: 1,
    borderColor: "rgba(0,255,163,0.4)",
    shadowColor: "#00FFA3",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 4,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  iconWrapper: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
  iconWrap: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeDot: {
    position: "absolute",
    top: 2,
    right: 2,
    width: 6,
    height: 6,
    borderRadius: 999,
    backgroundColor: "#00FFA3",
  },
});

