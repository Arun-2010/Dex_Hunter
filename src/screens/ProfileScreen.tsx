import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import ScreenBackground from "../components/layout/ScreenBackground";
import HUDBar from "../components/game/HUDBar";
import GlassCard from "../components/game/GlassCard";
import NeonButton from "../components/game/NeonButton";
import TokenCard from "../components/game/TokenCard";
import { COLORS } from "../utils/theme";
import { useGameStore } from "../store/gameStore";
import type { MainTabParamList, RootStackParamList } from "../navigation/types";

export default function ProfileScreen() {
  const navigation = useNavigation<BottomTabNavigationProp<MainTabParamList, "Profile">>();
  const { username, level, xp, accuracy, streak, totalCaptures, totalScans, capturedTokens, signOut } = useGameStore();

  return (
    <ScreenBackground>
      <HUDBar />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.sub}>Your hunter stats, trophies, and captured token inventory.</Text>

        <GlassCard glow="purple" style={{ marginTop: 16 }}>
          <View style={styles.rowBetween}>
            <View style={styles.row}>
              <View style={styles.avatar}>
                <Ionicons name="person" size={18} color={COLORS.neonGreen} />
              </View>
              <View>
                <Text style={styles.name}>{username}</Text>
                <Text style={styles.meta}>LVL {level} • {xp} XP</Text>
              </View>
            </View>
            <View style={styles.pill}>
              <Ionicons name="flame" size={14} color={COLORS.dangerRed} />
              <Text style={styles.pillText}>{streak}d</Text>
            </View>
          </View>

          <View style={{ height: 14 }} />
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statNum}>{totalScans}</Text>
              <Text style={styles.statLabel}>Scans</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statNum}>{totalCaptures}</Text>
              <Text style={styles.statLabel}>Captures</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statNum}>{accuracy}%</Text>
              <Text style={styles.statLabel}>Accuracy</Text>
            </View>
          </View>
        </GlassCard>

        <View style={{ marginTop: 14 }}>
          <GlassCard>
            <Text style={styles.section}>INVENTORY</Text>
            <Text style={styles.small}>Captured tokens from AR Hunt show up here.</Text>
            <View style={{ height: 12 }} />
            {capturedTokens.length === 0 ? (
              <View style={styles.empty}>
                <Ionicons name="aperture" size={20} color={COLORS.textMuted} />
                <Text style={styles.emptyText}>No tokens captured yet. Go hunt.</Text>
              </View>
            ) : (
              <View style={{ gap: 10 }}>
                {capturedTokens.slice(0, 12).map((t) => (
                  <TokenCard
                    key={t.id}
                    name={t.name}
                    symbol={t.symbol}
                    hue={t.imageHue}
                    riskScore={t.riskScore}
                    category={t.category}
                    onPress={() =>
                      navigation
                        .getParent<NativeStackNavigationProp<RootStackParamList>>()
                        ?.navigate("CoinDetail", { tokenId: t.id, tokenName: t.name, symbol: t.symbol })
                    }
                  />
                ))}
              </View>
            )}
          </GlassCard>
        </View>

        <View style={{ height: 16 }} />
        <NeonButton
          title="Sign out"
          variant="danger"
          fullWidth
          onPress={() => {
            signOut();
            navigation
              .getParent<NativeStackNavigationProp<RootStackParamList>>()
              ?.reset({ index: 0, routes: [{ name: "Auth" }] });
          }}
          left={<Ionicons name="log-out" size={18} color={COLORS.dangerRed} />}
        />
        <View style={{ height: 40 }} />
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 120 },
  title: { color: COLORS.text, fontSize: 26, fontWeight: "900" },
  sub: { color: COLORS.textMuted, marginTop: 8, lineHeight: 20 },
  section: { color: COLORS.textMuted, fontSize: 11, fontWeight: "900", letterSpacing: 2.2 },
  small: { color: COLORS.textMuted, marginTop: 8, lineHeight: 18 },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  row: { flexDirection: "row", alignItems: "center", gap: 10 },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(0,255,163,0.25)",
    backgroundColor: "rgba(0,255,163,0.10)",
    alignItems: "center",
    justifyContent: "center",
  },
  name: { color: COLORS.text, fontSize: 16, fontWeight: "900" },
  meta: { color: COLORS.textMuted, marginTop: 2 },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255,59,59,0.25)",
    backgroundColor: "rgba(255,59,59,0.10)",
  },
  pillText: { color: COLORS.text, fontWeight: "900" },
  statsRow: { flexDirection: "row", justifyContent: "space-between" },
  stat: { alignItems: "center", flex: 1 },
  statNum: { color: COLORS.text, fontSize: 18, fontWeight: "900" },
  statLabel: { color: COLORS.textMuted, marginTop: 2, fontSize: 11, letterSpacing: 1.1 },
  empty: { paddingVertical: 18, alignItems: "center", gap: 10 },
  emptyText: { color: COLORS.textMuted, fontWeight: "800" },
});

