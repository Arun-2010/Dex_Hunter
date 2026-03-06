import React, { useMemo, useState } from "react";
import { KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import ScreenBackground from "../components/layout/ScreenBackground";
import GlassCard from "../components/game/GlassCard";
import NeonButton from "../components/game/NeonButton";
import { COLORS } from "../utils/theme";
import { useGameStore } from "../store/gameStore";
import type { RootStackParamList } from "../navigation/types";

export default function AuthScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { signIn, walletConnected, walletAddress, connectWallet } = useGameStore();
  const [pickerVisible, setPickerVisible] = useState(false);
  const [selectedWalletName, setSelectedWalletName] = useState<string | null>(null);

  const shortAddress = useMemo(() => {
    if (!walletAddress) return "";
    return `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;
  }, [walletAddress]);

  return (
    <ScreenBackground>
      <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <View style={styles.header}>
          <View style={styles.badge}>
            <Ionicons name="shield-checkmark" size={16} color={COLORS.neonGreen} />
            <Text style={styles.badgeText}>WALLET LOGIN (MOCK)</Text>
          </View>
          <Text style={styles.title}>Connect Wallet</Text>
          <Text style={styles.sub}>
            Choose a wallet provider and connect to enter DexHunter.{"\n"}No real funds move in this demo.
          </Text>
        </View>

        <GlassCard glow="purple" style={styles.card}>
          <Text style={styles.label}>CONNECT</Text>
          <View style={{ height: 14 }} />

          {!walletConnected ? (
            <>
              <NeonButton
                title="Connect Wallet"
                onPress={() => setPickerVisible(true)}
                fullWidth
                left={<Ionicons name="wallet" size={18} color={COLORS.neonGreen} />}
              />
              <Text style={styles.hint}>Required to continue. A list of injected wallets will appear.</Text>
            </>
          ) : (
            <>
              <View style={styles.connectedRow}>
                <View style={styles.dot} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.connectedTitle}>Wallet Connected</Text>
                  <Text style={styles.connectedAddr}>{shortAddress}</Text>
                </View>
              </View>
              <View style={{ height: 14 }} />
              <NeonButton
                title="Enter DexHunter"
                onPress={() => {
                  signIn(walletAddress ?? selectedWalletName ?? "WalletUser");
                  navigation.replace("Main");
                }}
                fullWidth
                left={<Ionicons name="flash" size={18} color={COLORS.neonGreen} />}
              />
              <Text style={styles.hint}>By continuing you accept the simulation protocol.</Text>
            </>
          )}
        </GlassCard>

        <Modal
          transparent
          animationType="fade"
          visible={pickerVisible}
          onRequestClose={() => setPickerVisible(false)}
        >
          <Pressable style={styles.modalOverlay} onPress={() => setPickerVisible(false)}>
            <Pressable style={styles.modalCard} onPress={(e) => e.stopPropagation()}>
              <Text style={styles.modalTitle}>Select Injected Wallet</Text>
              <Text style={styles.modalSub}>Mock list of available wallets on this device.</Text>
              <View style={{ height: 16 }} />
              {["Phantom", "Backpack", "MetaMask"].map((name) => (
                <Pressable
                  key={name}
                  style={styles.modalOption}
                  onPress={() => {
                    setSelectedWalletName(name);
                    connectWallet();
                    setPickerVisible(false);
                  }}
                >
                  <Ionicons name="wallet" size={18} color={COLORS.neonGreen} />
                  <Text style={styles.modalOptionText}>{name}</Text>
                </Pressable>
              ))}
            </Pressable>
          </Pressable>
        </Modal>
      </KeyboardAvoidingView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, paddingHorizontal: 18, justifyContent: "center" },
  header: { marginBottom: 18 },
  badge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(0,255,163,0.25)",
    backgroundColor: "rgba(0,255,163,0.08)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: 12,
  },
  badgeText: { color: COLORS.neonGreen, letterSpacing: 1.6, fontSize: 10, fontWeight: "800" },
  title: { color: COLORS.text, fontSize: 34, fontWeight: "900", letterSpacing: 0.3 },
  sub: { color: COLORS.textMuted, marginTop: 8, lineHeight: 20 },
  card: { marginTop: 10 },
  label: { color: COLORS.textMuted, letterSpacing: 2.1, fontSize: 11, fontWeight: "800" },
  hint: { marginTop: 12, color: "rgba(255,255,255,0.45)", fontSize: 12, textAlign: "center" },
  connectedRow: { marginTop: 6, flexDirection: "row", alignItems: "center", gap: 10 },
  dot: { width: 8, height: 8, borderRadius: 999, backgroundColor: COLORS.neonGreen },
  connectedTitle: { color: COLORS.text, fontWeight: "900" },
  connectedAddr: { color: COLORS.textMuted, marginTop: 2 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.75)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  modalCard: {
    width: "100%",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
    backgroundColor: "rgba(10,15,44,0.98)",
    padding: 18,
  },
  modalTitle: { color: COLORS.text, fontSize: 16, fontWeight: "900" },
  modalSub: { color: COLORS.textMuted, marginTop: 4, fontSize: 12 },
  modalOption: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  modalOptionText: { color: COLORS.text, fontWeight: "800" },
});

