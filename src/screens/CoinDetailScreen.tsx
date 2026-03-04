import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RouteProp } from "@react-navigation/native";

import ScreenBackground from "../components/layout/ScreenBackground";
import GlassCard from "../components/game/GlassCard";
import NeonButton from "../components/game/NeonButton";
import RiskGauge from "../components/game/RiskGauge";
import { COLORS, categoryColor } from "../utils/theme";
import { checkTokenListed, type JupiterListingResult } from "../services/jupiterService";
import type { RootStackParamList } from "../navigation/types";

export default function CoinDetailScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, "CoinDetail">>();
  const route = useRoute<RouteProp<RootStackParamList, "CoinDetail">>();

  const tokenName: string = route.params?.tokenName ?? "Unknown Token";
  const symbol: string = route.params?.symbol ?? "TOKN";

  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<JupiterListingResult | null>(null);

  const headerColor = useMemo(
    () => (result ? categoryColor(result.category as "SAFE" | "SUSPICIOUS" | "SCAM") : COLORS.electricPurple),
    [result]
  );

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    checkTokenListed(symbol, tokenName)
      .then((r) => {
        if (!mounted) return;
        setResult(r);
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [tokenName, symbol]);

  return (
    <ScreenBackground>
      <View style={styles.topBar}>
        <NeonButton
          title="Close"
          variant="purple"
          onPress={() => navigation.goBack()}
          left={<Ionicons name="close" size={18} color={COLORS.electricPurple} />}
        />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.kicker}>COIN INTEL</Text>
        <Text style={styles.title}>
          {tokenName} <Text style={[styles.symbol, { color: headerColor }]}>${symbol}</Text>
        </Text>
        <Text style={styles.sub}>
          Verified via Jupiter: listed = safe, not listed = scam.
        </Text>

        <GlassCard glow={result?.category === "SAFE" ? "green" : "none"} style={{ marginTop: 16 }}>
          <Text style={styles.section}>JUPITER LISTING CHECK</Text>
          {loading ? (
            <View style={styles.loading}>
              <ActivityIndicator size="large" color={COLORS.neonGreen} />
              <Text style={styles.loadingText}>Checking Jupiter token index…</Text>
            </View>
          ) : result ? (
            <>
              <View style={{ alignItems: "center", marginTop: 6 }}>
                <RiskGauge
                  score={result.riskScore}
                  category={result.category as "SAFE" | "SUSPICIOUS" | "SCAM"}
                />
                <Text style={styles.verdict}>
                  {result.listed ? (
                    <Text style={{ color: COLORS.neonGreen, fontWeight: "900" }}>Listed — OK</Text>
                  ) : (
                    <Text style={{ color: COLORS.dangerRed, fontWeight: "900" }}>Not listed — Scam</Text>
                  )}
                </Text>
              </View>
              <View style={{ height: 10 }} />
              <Text style={styles.section}>WHY</Text>
              <View style={{ marginTop: 8, gap: 8 }}>
                {result.reasons.map((r, i) => (
                  <View key={`${i}-${r}`} style={styles.reasonRow}>
                    <View
                      style={[
                        styles.dot,
                        {
                          backgroundColor:
                            result.category === "SAFE" ? COLORS.neonGreen : COLORS.dangerRed,
                        },
                      ]}
                    />
                    <Text style={styles.reason}>{r}</Text>
                  </View>
                ))}
              </View>
            </>
          ) : null}
        </GlassCard>

        <View style={{ height: 26 }} />
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  topBar: { paddingHorizontal: 16, paddingTop: 16, alignItems: "flex-end" },
  content: { paddingHorizontal: 16, paddingTop: 6, paddingBottom: 40 },
  kicker: { color: COLORS.textMuted, letterSpacing: 2.6, fontSize: 11, fontWeight: "900" },
  title: { color: COLORS.text, fontSize: 26, fontWeight: "900", marginTop: 8 },
  symbol: { fontWeight: "900" },
  sub: { color: COLORS.textMuted, marginTop: 10, lineHeight: 20 },
  section: { color: COLORS.textMuted, fontSize: 11, fontWeight: "900", letterSpacing: 2.2 },
  loading: { paddingVertical: 22, alignItems: "center", gap: 10 },
  loadingText: { color: COLORS.textMuted, fontWeight: "800", letterSpacing: 1.2 },
  verdict: { marginTop: 10, textAlign: "center" },
  reasonRow: { flexDirection: "row", gap: 10, alignItems: "flex-start" },
  dot: { width: 7, height: 7, borderRadius: 7, marginTop: 6 },
  reason: { flex: 1, color: "rgba(255,255,255,0.82)", lineHeight: 18 },
});
