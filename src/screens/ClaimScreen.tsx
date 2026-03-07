import React, { useMemo, useState } from "react";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import ScreenBackground from "../components/layout/ScreenBackground";
import HUDBar from "../components/game/HUDBar";
import GlassCard from "../components/game/GlassCard";
import NeonButton from "../components/game/NeonButton";
import { COLORS } from "../utils/theme";
import { useGameStore } from "../store/gameStore";

const REQUIRED_TOKENS = 5;

export default function ClaimScreen() {
  const [claimedTokens, setClaimedTokens] = useState<Set<string>>(new Set());
  const {
    collectedTokens,
    capturedTokens,
    allowedRewardSymbols,
    claimSubmitted,
    claimTokenReward,
    claimedRewards,
  } = useGameStore();

  const handleClaimToken = (tokenSymbol: string, tokenName: string) => {
    claimTokenReward(tokenSymbol, tokenName);
    setClaimedTokens(prev => new Set([...prev, tokenSymbol]));
  };

  const progress = Math.min(1, collectedTokens / REQUIRED_TOKENS);
  const remaining = Math.max(0, REQUIRED_TOKENS - collectedTokens);
  const claimEligible = collectedTokens >= REQUIRED_TOKENS;

  const tokenProgress = useMemo(() => {
    const map: Record<
      string,
      {
        count: number;
        name: string;
        symbol: string;
      }
    > = {};

    for (const t of capturedTokens) {
      const key = t.symbol || t.name;
      if (!map[key]) {
        map[key] = { count: 0, name: t.name, symbol: t.symbol };
      }
      map[key].count += 1;
    }

    return map;
  }, [capturedTokens]);

  const tokenProgressFiltered = useMemo(() => {
    const progress = tokenProgress;
    if (!allowedRewardSymbols || allowedRewardSymbols.length === 0) return progress;
    const set = new Set(allowedRewardSymbols.map((s) => s.toUpperCase()));
    const filtered = Object.fromEntries(
      Object.entries(progress).filter(([key]) => set.has(key.toUpperCase()))
    );
    // Remove claimed tokens from progress
    return Object.fromEntries(
      Object.entries(filtered).filter(([key]) => !claimedTokens.has(key))
    );
  }, [tokenProgress, allowedRewardSymbols, claimedTokens]);

  const statusMessage = useMemo(() => {
    if (claimSubmitted) {
      return "Sponsor will distribute rewards soon.";
    }
    if (!claimEligible) {
      return `Collect ${remaining} more tokens to unlock claim eligibility`;
    }
    return "Claim unlocked. Click Claim Status to submit your claim.";
  }, [claimEligible, claimSubmitted, remaining]);

  return (
    <ScreenBackground>
      <HUDBar />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Rewards</Text>
        <Text style={styles.sub}>Collect tokens in hunt mode and claim exclusive sponsor rewards.</Text>

        <View style={{ marginTop: 16 }}>
          <GlassCard>
            <Text style={styles.section}>TOKEN PROGRESS</Text>
            <View style={{ marginTop: 12 }}>
              {Object.keys(tokenProgressFiltered).length > 0 ? (
                Object.entries(tokenProgressFiltered).map(([key, info]) => {
                  const label = info.name || info.symbol || key;
                  const isCompleted = info.count >= REQUIRED_TOKENS;
                  return (
                    <View key={key}>
                      <View style={styles.tokenCard}>
                        <View style={styles.rowBetween}>
                          <Text style={styles.tokenName}>{label}</Text>
                          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                            {isCompleted ? (
                              <Text style={styles.tokenUnlocked}>Unlocked</Text>
                            ) : null}
                            <Text style={styles.tokenCount}>
                              {info.count} / {REQUIRED_TOKENS}
                            </Text>
                          </View>
                        </View>
                        <View style={styles.tokenProgressTrack}>
                          <View
                            style={[styles.tokenProgressFill, { width: `${Math.min(1, info.count / REQUIRED_TOKENS) * 100}%` }]}
                          />
                        </View>
                        <Text style={styles.tokenStatus}>
                          {isCompleted
                            ? "Claim unlocked for this token."
                            : `Collect ${Math.max(0, REQUIRED_TOKENS - info.count)} more to unlock claim for this token.`}
                        </Text>
                      </View>
                      {isCompleted && (
                        <View style={{ marginTop: 12 }}>
                          <GlassCard glow="green">
                            <Text style={styles.section}>CLAIM PROGRESS</Text>
                            <View style={styles.claimContent}>
                              <Text style={styles.claimTokenName}>{label}</Text>
                              <TouchableOpacity style={styles.claimButtonContainer} onPress={() => handleClaimToken(key, label)}>
                                <Ionicons name="wallet" size={16} color={COLORS.gold} />
                                <Text style={styles.claimButtonText}>Claim Status</Text>
                              </TouchableOpacity>
                              {claimedTokens.has(key) && (
                                <Text style={styles.claimMessage}>
                                  Your wallet has been added to the sponsor reward list. Please wait for distribution.
                                </Text>
                              )}
                            </View>
                          </GlassCard>
                        </View>
                      )}
                    </View>
                  );
                })
              ) : (
                <Text style={styles.small}>
                  {allowedRewardSymbols?.length
                    ? "No reward tokens captured yet. Play AR Hunt to collect from the 15 meme coins."
                    : "Start AR Hunt to load the 15 reward tokens, then capture them to see progress here."}
                </Text>
              )}
            </View>
          </GlassCard>
        </View>

        {claimedRewards.length > 0 && (
          <View style={{ marginTop: 24 }}>
            <Text style={styles.sectionTitle}>CLAIMED REWARDS</Text>
            <View style={{ marginTop: 12, gap: 12 }}>
              {claimedRewards.map((reward) => (
                <GlassCard key={reward.id} glow="green">
                  <View style={styles.claimedRewardCard}>
                    <View style={styles.claimedRewardLeft}>
                      <Text style={styles.giftIcon}>🎁</Text>
                    </View>
                    <View style={styles.claimedRewardCenter}>
                      <Text style={styles.claimedRewardTokenName}>{reward.tokenName}</Text>
                      <Text style={styles.claimedRewardMessage}>
                        Your wallet has been added to the sponsor reward list. Please wait for distribution.
                      </Text>
                    </View>
                    <View style={styles.claimedRewardRight}>
                      <View style={styles.claimedBadge}>
                        <Ionicons name="checkmark" size={12} color={COLORS.neonGreen} />
                        <Text style={styles.claimedBadgeText}>Claimed</Text>
                      </View>
                    </View>
                  </View>
                </GlassCard>
              ))}
            </View>
          </View>
        )}

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
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10 },
  metricLabel: { color: COLORS.textMuted, fontSize: 12 },
  metricValue: { color: COLORS.text, fontSize: 20, fontWeight: "900" },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  pillLocked: {
    borderColor: "rgba(255,255,255,0.18)",
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  pillReady: {
    borderColor: "rgba(0,255,163,0.35)",
    backgroundColor: "rgba(0,255,163,0.10)",
  },
  pillText: { color: COLORS.textMuted, fontSize: 11, fontWeight: "900", letterSpacing: 1.4 },
  pillTextReady: { color: COLORS.neonGreen },
  progressTrack: {
    marginTop: 8,
    width: "100%",
    height: 8,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.08)",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: COLORS.neonGreen,
    shadowColor: COLORS.neonGreen,
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
  },
  progressRow: {
    marginTop: 6,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  progressLabel: { color: COLORS.textMuted, fontSize: 11 },
  message: { color: COLORS.textMuted, marginTop: 10, lineHeight: 18 },
  small: { color: COLORS.textMuted, marginTop: 6, lineHeight: 18 },
  helper: { color: COLORS.textMuted, marginTop: 8, fontSize: 11 },
  tokenCard: { marginBottom: 10 },
  tokenName: { color: COLORS.text, fontSize: 14, fontWeight: "900" },
  tokenCount: { color: COLORS.textMuted, fontSize: 12 },
  tokenUnlocked: { color: COLORS.neonGreen, fontSize: 11, fontWeight: "900", textTransform: "uppercase" },
  tokenStatus: { color: COLORS.textMuted, fontSize: 11, marginTop: 4 },
  tokenProgressTrack: {
    marginTop: 6,
    width: "100%",
    height: 6,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.08)",
    overflow: "hidden",
  },
  tokenProgressFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: COLORS.electricPurple,
    shadowColor: COLORS.electricPurple,
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
  },
  walletRow: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 10 },
  walletIcon: {
    width: 36,
    height: 36,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,255,163,0.10)",
    borderWidth: 1,
    borderColor: "rgba(0,255,163,0.25)",
  },
  walletLabel: { color: COLORS.textMuted, fontSize: 12 },
  walletValue: { color: COLORS.text, fontSize: 14, fontWeight: "700", marginTop: 2 },
  connectedPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(0,255,163,0.35)",
    backgroundColor: "rgba(0,255,163,0.10)",
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 999,
    backgroundColor: COLORS.neonGreen,
  },
  connectedText: { color: COLORS.neonGreen, fontSize: 11, fontWeight: "900", letterSpacing: 1.4 },
  successCard: {
    marginTop: 18,
    flexDirection: "row",
    alignItems: "center",
  },
  successTitle: { color: COLORS.text, fontWeight: "900" },
  successSub: { color: COLORS.textMuted, marginTop: 2, fontSize: 12 },
  row: { flexDirection: "row", alignItems: "center" },
  celebrate: { color: COLORS.text, fontSize: 16, fontWeight: "900" },
  claimContent: { marginTop: 12 },
  claimTokenName: { color: COLORS.text, fontSize: 16, fontWeight: "900", marginBottom: 12 },
  claimButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "rgba(255, 215, 0, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(255, 215, 0, 0.4)",
    marginBottom: 12,
  },
  claimButtonText: { color: COLORS.gold, fontSize: 14, fontWeight: "900", letterSpacing: 1.2 },
  claimMessage: { color: COLORS.textMuted, fontSize: 12, lineHeight: 18, textAlign: "center" },
  sectionTitle: { color: COLORS.textMuted, fontSize: 11, fontWeight: "900", letterSpacing: 2.2, marginBottom: 8 },
  claimedRewardCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  claimedRewardLeft: {
    alignItems: "center",
    justifyContent: "center",
  },
  giftIcon: { fontSize: 24 },
  claimedRewardCenter: {
    flex: 1,
    gap: 4,
  },
  claimedRewardTokenName: { color: COLORS.text, fontSize: 14, fontWeight: "900" },
  claimedRewardMessage: { color: COLORS.textMuted, fontSize: 11, lineHeight: 16 },
  claimedRewardRight: {
    alignItems: "center",
  },
  claimedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "rgba(0,255,163,0.10)",
    borderWidth: 1,
    borderColor: "rgba(0,255,163,0.25)",
  },
  claimedBadgeText: { color: COLORS.neonGreen, fontSize: 10, fontWeight: "900", letterSpacing: 1.1 },
});

