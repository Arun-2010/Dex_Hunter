import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

import ScreenBackground from "../components/layout/ScreenBackground";
import { COLORS } from "../utils/theme";
import type { RootStackParamList } from "../navigation/types";
import { useGameStore } from "../store/gameStore";

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function SplashScreen() {
  const navigation = useNavigation<Nav>();
  const { isAuthed } = useGameStore();
  const [hydrated, setHydrated] = useState(() => useGameStore.persist.hasHydrated());

  const t = useSharedValue(0);

  useEffect(() => {
    const unsub = useGameStore.persist.onFinishHydration(() => setHydrated(true));
    return () => unsub();
  }, []);

  useEffect(() => {
    t.value = withTiming(1, { duration: 900, easing: Easing.out(Easing.cubic) });
    if (!hydrated) return;
    const timer = setTimeout(() => {
      navigation.replace(isAuthed ? "Main" : "Auth");
    }, 1100);
    return () => clearTimeout(timer);
  }, [hydrated, isAuthed, navigation, t]);

  const titleStyle = useAnimatedStyle(() => ({
    opacity: 0.2 + t.value * 0.8,
    transform: [{ translateY: (1 - t.value) * 14 }, { scale: 0.98 + t.value * 0.02 }],
  }));

  const barStyle = useAnimatedStyle(() => ({
    width: `${Math.round(t.value * 92)}%`,
    opacity: 0.35 + t.value * 0.65,
  }));

  return (
    <ScreenBackground>
      <View style={styles.wrap}>
        <Animated.View style={titleStyle}>
          <Text style={styles.kicker}>SOLANA DEX QUEST</Text>
          <Text style={styles.title}>
            Dex<Text style={styles.ar}>Hunter</Text>
          </Text>
          <Text style={styles.sub}>Hunt tokens, earn tickets, claim rewards.</Text>
        </Animated.View>

        <View style={styles.progress}>
          <View style={styles.progressTrack} />
          <Animated.View style={[styles.progressFill, barStyle]} />
        </View>
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 22 },
  kicker: { color: COLORS.textMuted, letterSpacing: 2.6, fontSize: 11, fontWeight: "700" },
  title: {
    marginTop: 10,
    color: COLORS.text,
    fontSize: 42,
    fontWeight: "900",
    letterSpacing: 0.5,
    textShadowColor: "rgba(0,255,163,0.25)",
    textShadowRadius: 18,
  },
  ar: { color: COLORS.electricPurple, textShadowColor: "rgba(123,92,255,0.35)" },
  sub: { marginTop: 10, color: COLORS.textMuted, fontSize: 14 },
  progress: { marginTop: 40, width: "88%", height: 10, borderRadius: 999, overflow: "hidden" },
  progressTrack: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(123,92,255,0.18)",
    borderRadius: 999,
  },
  progressFill: {
    height: "100%",
    backgroundColor: COLORS.neonGreen,
    borderRadius: 999,
    shadowColor: COLORS.neonGreen,
    shadowOpacity: 0.4,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 0 },
  },
});

