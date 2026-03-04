import React from "react";
import { StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { COLORS } from "../../utils/theme";
import ParticleBackground from "../game/ParticleBackground";

export default function ScreenBackground({
  children,
  scanline = false,
}: {
  children: React.ReactNode;
  scanline?: boolean;
}) {
  return (
    <View style={styles.root}>
      <LinearGradient colors={[COLORS.bgTop, COLORS.bgBottom]} style={StyleSheet.absoluteFill} />
      <ParticleBackground />
      {scanline ? <View pointerEvents="none" style={styles.scanline} /> : null}
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bgBottom },
  content: { flex: 1 },
  scanline: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0.35,
    backgroundColor: "transparent",
  },
});

