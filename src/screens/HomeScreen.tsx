import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";

import ScreenBackground from "../components/layout/ScreenBackground";
import HUDBar from "../components/game/HUDBar";
import GlassCard from "../components/game/GlassCard";
import XPBar from "../components/game/XPBar";
import NeonButton from "../components/game/NeonButton";
import { COLORS } from "../utils/theme";
import { useGameStore } from "../store/gameStore";
import type { MainTabParamList } from "../navigation/types";

export default function HomeScreen() {
  const navigation = useNavigation<BottomTabNavigationProp<MainTabParamList, "Home">>();
  const { username, claimDailyLogin, streak, totalCaptures, totalScans, accuracy, level } = useGameStore();
  const [daily, setDaily] = useState(false);

  useEffect(() => {
    const claimed = claimDailyLogin();
    setDaily(claimed);
  }, [claimDailyLogin]);

  return (
    <ScreenBackground>
      <HUDBar />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.hi}>Welcome back,</Text>
            <Text style={styles.name}>{username}</Text>
            <Text style={styles.subtitle}>Your next level is closer than you think.</Text>
          </View>
          <View style={styles.levelBadge}>
            <Ionicons name="diamond" size={18} color={COLORS.electricPurple} />
            <Text style={styles.levelText}>LVL {level}</Text>
          </View>
        </View>

        {daily ? (
          <GlassCard glow="green" style={{ marginTop: 14 }}>
            <View style={styles.rowBetween}>
              <View style={styles.row}>
                <Ionicons name="calendar" size={18} color={COLORS.neonGreen} />
                <View style={{ marginLeft: 10 }}>
                  <Text style={styles.cardTitle}>Daily login claimed</Text>
                  <Text style={styles.cardSub}>+5 XP • streak {streak} days</Text>
                </View>
              </View>
              <Text style={styles.reward}>+5</Text>
            </View>
          </GlassCard>
        ) : null}

        <View style={{ marginTop: 16 }}>
          <GlassCard glow="purple">
            <Text style={styles.section}>PROGRESS</Text>
            <XPBar />
            <View style={{ height: 14 }} />
            <View style={styles.statsRow}>
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
        </View>

        <View style={{ marginTop: 18, gap: 12 }}>
          <NeonButton
            title="Start AR Hunt"
            fullWidth
            onPress={() => navigation.navigate("Hunt")}
            left={<Ionicons name="aperture" size={18} color={COLORS.neonGreen} />}
          />
        </View>

        <View style={{ height: 28 }} />
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 120 },
  heroRow: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" },
  hi: { color: COLORS.textMuted, fontSize: 13, letterSpacing: 1.2 },
  name: { color: COLORS.text, fontSize: 30, fontWeight: "900" },
  subtitle: { color: COLORS.textMuted, marginTop: 6, lineHeight: 18 },
  levelBadge: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(123,92,255,0.28)",
    backgroundColor: "rgba(123,92,255,0.12)",
    alignItems: "center",
    gap: 6,
  },
  levelText: { color: COLORS.text, fontSize: 12, fontWeight: "900", letterSpacing: 1.2 },
  section: { color: COLORS.textMuted, fontSize: 11, letterSpacing: 2.2, fontWeight: "900", marginBottom: 10 },
  statsRow: { flexDirection: "row", justifyContent: "space-between" },
  stat: { alignItems: "center", flex: 1 },
  statNum: { color: COLORS.text, fontSize: 18, fontWeight: "900" },
  statLabel: { color: COLORS.textMuted, marginTop: 2, fontSize: 11, letterSpacing: 1.1 },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  row: { flexDirection: "row", alignItems: "center" },
  cardTitle: { color: COLORS.text, fontSize: 14, fontWeight: "900" },
  cardSub: { color: COLORS.textMuted, marginTop: 2, fontSize: 12 },
  reward: { color: COLORS.neonGreen, fontSize: 18, fontWeight: "900" },
});

