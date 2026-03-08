import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Modal, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { COLORS } from "../../utils/theme";
import { detectInjectedWallets, type DetectedInjectedWallet } from "../../wallet/detectInjectedWallets";

export default function InjectedWalletPickerModal({
  visible,
  onClose,
  onConnected,
  title = "Select Wallet",
}: {
  visible: boolean;
  onClose: () => void;
  onConnected: (address: string) => void;
  title?: string;
}) {
  const wallets = useMemo(() => detectInjectedWallets(), [visible]);
  const [connectingId, setConnectingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!visible) {
      setConnectingId(null);
      setError(null);
    }
  }, [visible]);

  const isEmpty = wallets.length === 0;
  const isNative = Platform.OS === "ios" || Platform.OS === "android";

  const connect = async (w: DetectedInjectedWallet) => {
    try {
      setError(null);
      setConnectingId(w.id);
      const address = await w.connect();
      onConnected(address);
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to connect wallet.");
      setConnectingId(null);
    }
  };

  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable style={styles.modalCard} onPress={(e) => e.stopPropagation()}>
          <Text style={styles.modalTitle}>{title}</Text>
          <Text style={styles.modalSub}>
            {isNative
              ? "Injected wallets are only available when the app runs in a browser (for example inside the Phantom in-app browser)."
              : "Detected injected wallets on this device/browser."}
          </Text>

          <View style={{ height: 16 }} />

          {isEmpty ? (
            <View style={styles.emptyBox}>
              <Ionicons name="alert-circle-outline" size={18} color={COLORS.textMuted} />
              <Text style={styles.emptyText}>No injected wallets detected.</Text>
              {isNative ? (
                <Text style={styles.emptyHint}>
                  On mobile, open the web build of this app inside the Phantom in-app browser to connect as an injected
                  wallet. Expo Go itself cannot access apps like Phantom as injected providers.
                </Text>
              ) : (
                <Text style={styles.emptyHint}>
                  Install a wallet extension that injects a provider (e.g. Phantom or MetaMask) in your browser, then
                  reload and try again.
                </Text>
              )}
            </View>
          ) : (
            wallets.map((w) => {
              const connecting = connectingId === w.id;
              return (
                <Pressable
                  key={w.id}
                  style={[styles.modalOption, connecting ? styles.modalOptionConnecting : null]}
                  onPress={() => connect(w)}
                  disabled={!!connectingId}
                >
                  <Ionicons name="wallet" size={18} color={COLORS.neonGreen} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.modalOptionText}>{w.name}</Text>
                    <Text style={styles.modalOptionSub}>{w.kind === "solana" ? "Solana" : "Ethereum"}</Text>
                  </View>
                  {connecting ? <ActivityIndicator /> : <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />}
                </Pressable>
              );
            })
          )}

          {error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : null}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
  modalOptionConnecting: {
    opacity: 0.85,
    borderColor: "rgba(0,255,163,0.35)",
  },
  modalOptionText: { color: COLORS.text, fontWeight: "800" },
  modalOptionSub: { color: COLORS.textMuted, marginTop: 2, fontSize: 11, fontWeight: "700" },
  emptyBox: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    backgroundColor: "rgba(0,0,0,0.25)",
    padding: 14,
    alignItems: "center",
    gap: 6,
  },
  emptyText: { color: COLORS.text, fontWeight: "800" },
  emptyHint: { color: COLORS.textMuted, fontSize: 11, textAlign: "center", marginTop: 2, lineHeight: 16 },
  errorText: { color: "rgba(255,90,90,0.95)", marginTop: 12, fontSize: 12, textAlign: "center" },
});

