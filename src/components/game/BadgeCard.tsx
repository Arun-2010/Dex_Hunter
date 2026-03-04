import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import GlassCard from "./GlassCard";
import { COLORS } from "../../utils/theme";

export default function BadgeCard({
  icon,
  label,
  value,
  accent = "green",
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  accent?: "green" | "purple" | "danger";
}) {
  const c = accent === "green" ? COLORS.neonGreen : accent === "purple" ? COLORS.electricPurple : COLORS.dangerRed;
  return (
    <GlassCard style={styles.card}>
      <View style={styles.row}>
        <View style={[styles.iconBox, { borderColor: `${c}33`, backgroundColor: `${c}14` }]}>
          <Ionicons name={icon} size={16} color={c} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>{label}</Text>
          <Text style={[styles.value, { color: c }]}>{value}</Text>
        </View>
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1 },
  row: { flexDirection: "row", alignItems: "center", gap: 10 },
  iconBox: {
    width: 34,
    height: 34,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  label: { color: COLORS.textMuted, fontSize: 11, fontWeight: "900", letterSpacing: 1.2 },
  value: { marginTop: 2, fontSize: 16, fontWeight: "900" },
});

