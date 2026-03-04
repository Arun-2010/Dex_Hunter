import React, { useMemo, useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from "react-native";
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
  const { signIn } = useGameStore();
  const [name, setName] = useState("");

  const placeholder = useMemo(() => (Math.random() > 0.5 ? "CyberHunter" : "NeonSlayer"), []);

  return (
    <ScreenBackground>
      <KeyboardAvoidingView
        style={styles.root}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.header}>
          <View style={styles.badge}>
            <Ionicons name="shield-checkmark" size={16} color={COLORS.neonGreen} />
            <Text style={styles.badgeText}>SECURE LOGIN (MOCK)</Text>
          </View>
          <Text style={styles.title}>Enter the Grid</Text>
          <Text style={styles.sub}>
            Create your hunter ID. Daily login rewards XP.{"\n"}No wallet required (yet).
          </Text>
        </View>

        <GlassCard glow="purple" style={styles.card}>
          <Text style={styles.label}>HUNTER ID</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder={placeholder}
            placeholderTextColor="rgba(255,255,255,0.35)"
            style={styles.input}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="done"
            onSubmitEditing={() => {
              signIn(name);
              navigation.replace("Main");
            }}
          />
          <View style={{ height: 14 }} />
          <NeonButton
            title="Start Hunt"
            onPress={() => {
              signIn(name);
              navigation.replace("Main");
            }}
            fullWidth
            left={<Ionicons name="flash" size={18} color={COLORS.neonGreen} />}
          />
          <Text style={styles.hint}>By continuing you accept the simulation protocol.</Text>
        </GlassCard>
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
  input: {
    marginTop: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    backgroundColor: "rgba(0,0,0,0.18)",
    color: COLORS.text,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  hint: { marginTop: 12, color: "rgba(255,255,255,0.45)", fontSize: 12, textAlign: "center" },
});

