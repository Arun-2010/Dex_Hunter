import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { useGameStore } from "../../store/gameStore";
import { COLORS } from "../../utils/theme";

export default function XPBar() {
  const { xp, level } = useGameStore();
  const xpInLevel = xp % 100;
  const progress = xpInLevel / 100;

  return (
    <View>
      <View style={styles.row}>
        <Text style={styles.hud}>LVL {level}</Text>
        <Text style={styles.hud}>{xpInLevel}/100 XP</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${Math.round(progress * 100)}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  hud: { color: COLORS.textMuted, fontSize: 11, fontWeight: "900", letterSpacing: 1.1 },
  track: {
    height: 10,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.08)",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  fill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: COLORS.neonGreen,
    shadowColor: COLORS.neonGreen,
    shadowOpacity: 0.55,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 0 },
  },
});
