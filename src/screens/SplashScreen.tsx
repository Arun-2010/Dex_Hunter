import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View, TouchableOpacity } from "react-native";
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
  const [animDone, setAnimDone] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showBeginButton, setShowBeginButton] = useState(false);

  const t = useSharedValue(0);
  const logoScale = useSharedValue(0.8);
  const logoRotate = useSharedValue(0);
  const logoGlow = useSharedValue(0);

  useEffect(() => {
    const unsub = useGameStore.persist.onFinishHydration(() => setHydrated(true));
    return () => unsub();
  }, []);

  useEffect(() => {
    // Animate progress from 0 to 100
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2.8; // Increment by 2.8% every 30ms = 100% in ~1.1 seconds
      });
    }, 30);

    // Animate title
    t.value = withTiming(1, { duration: 2000, easing: Easing.out(Easing.cubic) });
    
    // Animate logo
    logoScale.value = withTiming(1, { duration: 1500, easing: Easing.elastic(1.2) });
    logoRotate.value = withTiming(360, { duration: 2000, easing: Easing.out(Easing.quad) });
    logoGlow.value = withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.quad) });
    
    // Show begin button after loading
    const timer = setTimeout(() => {
      setAnimDone(true);
      setShowBeginButton(true);
    }, 2000);
    
    return () => {
      clearInterval(progressInterval);
      clearTimeout(timer);
    };
  }, [t]);

  const handleBegin = () => {
    navigation.replace(isAuthed ? "Main" : "Auth");
  };

  const titleStyle = useAnimatedStyle(() => ({
    opacity: 0.2 + t.value * 0.8,
    transform: [{ translateY: (1 - t.value) * 14 }, { scale: 0.98 + t.value * 0.02 }] as any,
  }));

  const barStyle = useAnimatedStyle(() => ({
    width: `${progress}%`,
    opacity: 0.35 + t.value * 0.65,
  }));

  const logoStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: logoScale.value },
      { rotate: logoRotate.value + 'deg' },
    ] as any,
    opacity: 0.6 + logoGlow.value * 0.4,
    shadowColor: COLORS.neonGreen,
    shadowOpacity: logoGlow.value * 0.6,
    shadowRadius: 10 + logoGlow.value * 20,
    shadowOffset: { width: 0, height: 0 },
  }));

  return (
    <ScreenBackground>
      <View style={styles.wrap}>
        <Animated.Image 
          source={require("../../assets/images/image.jpeg")} 
          style={[styles.logo, logoStyle]} 
          resizeMode="contain"
        />
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
          <Text style={styles.progressText}>{progress}%</Text>
        </View>

        {showBeginButton && (
          <TouchableOpacity onPress={handleBegin}>
            <Text style={styles.beginText}>Tap to begin</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 22 },
  logo: { 
    width: 180, 
    height: 180, 
    marginBottom: 32,
    backgroundColor: 'transparent',
  },
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
  progress: { 
    marginTop: 40, 
    width: "88%", 
    height: 10, 
    borderRadius: 999, 
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
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
  progressText: {
    position: "absolute",
    color: COLORS.text,
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 1,
  },
  beginText: {
    marginTop: 20,
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: "500",
    letterSpacing: 1.5,
    opacity: 0.8,
  },
});

