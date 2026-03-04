import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { COLORS } from "../../utils/theme";
import { useGameStore } from "../../store/gameStore";

export default function HUDBar() {
  const insets = useSafeAreaInsets();
  const { level, xp, totalCaptures } = useGameStore();
  const xpInLevel = xp % 100;

  return (
    <View style={[styles.wrap, { paddingTop: Math.max(insets.top, 10) }]}>
      <View style={styles.left}>
        <View style={styles.iconBox}>
          <Ionicons name="shield-checkmark" size={16} color={COLORS.neonGreen} />
        </View>
        <View>
          <Text style={styles.lvl}>LVL {level}</Text>
          <View style={styles.miniTrack}>
            <View style={[styles.miniFill, { width: `${xpInLevel}%` }]} />
          </View>
        </View>
      </View>

      <View style={styles.right}>
        <View style={styles.xpRow}>
          <Ionicons name="flash" size={14} color={COLORS.electricPurple} />
          <Text style={[styles.hud, { color: COLORS.electricPurple }]}>{xp} XP</Text>
        </View>
        <View style={styles.pill}>
          <Text style={[styles.hud, { color: COLORS.neonGreen }]}>{totalCaptures} 🪙</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 16,
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(5,8,20,0.55)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(123,92,255,0.18)",
  },
  left: { flexDirection: "row", gap: 10, alignItems: "center" },
  iconBox: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: "rgba(0,255,163,0.10)",
    borderWidth: 1,
    borderColor: "rgba(0,255,163,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  lvl: { color: COLORS.neonGreen, fontSize: 11, fontWeight: "900", letterSpacing: 1.6 },
  miniTrack: {
    marginTop: 4,
    width: 78,
    height: 5,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.08)",
    overflow: "hidden",
  },
  miniFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: COLORS.neonGreen,
    shadowColor: COLORS.neonGreen,
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
  },
  right: { flexDirection: "row", alignItems: "center", gap: 10 },
  xpRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  hud: { color: COLORS.textMuted, fontSize: 11, fontWeight: "900", letterSpacing: 1.2 },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(0,255,163,0.08)",
    borderWidth: 1,
    borderColor: "rgba(0,255,163,0.18)",
  },
});
