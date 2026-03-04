import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { BlurView } from "expo-blur";

import { COLORS } from "../../utils/theme";

export default function GlassCard({
  children,
  style,
  glow = "none",
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  glow?: "green" | "purple" | "none";
}) {
  const glowStyle =
    glow === "green"
      ? styles.glowGreen
      : glow === "purple"
        ? styles.glowPurple
        : null;

  return (
    <View style={[styles.wrap, glowStyle, style]}>
      <BlurView intensity={26} tint="dark" style={styles.blur}>
        <View style={styles.inner}>{children}</View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    backgroundColor: COLORS.glass,
  },
  blur: {
    borderRadius: 20,
  },
  inner: {
    padding: 16,
  },
  glowGreen: {
    borderColor: "rgba(0,255,163,0.35)",
    shadowColor: COLORS.neonGreen,
    shadowOpacity: 0.35,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 0 },
  },
  glowPurple: {
    borderColor: "rgba(123,92,255,0.35)",
    shadowColor: COLORS.electricPurple,
    shadowOpacity: 0.35,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 0 },
  },
});
