import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import GlassCard from "./GlassCard";
import { categoryColor, COLORS } from "../../utils/theme";

export default function TokenCard({
  name,
  symbol,
  riskScore,
  category,
  hue = 160,
  onPress,
}: {
  name: string;
  symbol: string;
  riskScore?: number;
  category?: "SAFE" | "SUSPICIOUS" | "SCAM";
  hue?: number;
  onPress?: () => void;
}) {
  const c = category ? categoryColor(category) : COLORS.textMuted;
  return (
    <Pressable onPress={onPress}>
      <GlassCard glow={category === "SAFE" ? "green" : "none"}>
        <View style={styles.row}>
          <View
            style={[
              styles.coin,
              {
                borderColor: `hsla(${hue}, 80%, 55%, 0.35)`,
                backgroundColor: `hsla(${hue}, 80%, 45%, 0.18)`,
              },
            ]}
          >
            <Text style={[styles.coinText, { color: `hsl(${hue} 80% 75%)` }]}>{symbol.slice(0, 2)}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.name} numberOfLines={1}>
              {name}
            </Text>
            <Text style={styles.sym}>${symbol}</Text>
          </View>
          {typeof riskScore === "number" ? (
            <View style={{ alignItems: "flex-end" }}>
              <Text style={[styles.score, { color: c }]}>{riskScore}</Text>
              {category ? <Text style={[styles.cat, { color: c }]}>{category}</Text> : null}
            </View>
          ) : null}
        </View>
      </GlassCard>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 12 },
  coin: {
    width: 44,
    height: 44,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "rgba(0,0,0,1)",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
  },
  coinText: { fontWeight: "900", letterSpacing: 1.2 },
  name: { color: COLORS.text, fontSize: 14, fontWeight: "900" },
  sym: { color: COLORS.textMuted, marginTop: 2, fontSize: 12, letterSpacing: 1.1 },
  score: { fontSize: 18, fontWeight: "900" },
  cat: { fontSize: 10, fontWeight: "900", letterSpacing: 1.8 },
});
