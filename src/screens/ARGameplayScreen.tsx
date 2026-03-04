import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Dimensions, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Accelerometer } from "expo-sensors";
import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { COLORS } from "../utils/theme";
import RadarWidget from "../components/game/RadarWidget";
import NeonButton from "../components/game/NeonButton";
import RiskGauge from "../components/game/RiskGauge";
import ScreenBackground from "../components/layout/ScreenBackground";
import CaptureAnimation from "../components/game/CaptureAnimation";
import {
  checkTokenListed,
  fetchRandomJupiterTokens,
  generateFakeToken,
  type JupiterTokenItem,
} from "../services/jupiterService";
import { useGameStore } from "../store/gameStore";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width: W, height: H } = Dimensions.get("window");

type ARToken = {
  id: string;
  name: string;
  symbol: string;
  hue: number;
  x: number;
  y: number;
  distanceM: number;
  visible: boolean;
};

type Result = Awaited<ReturnType<typeof checkTokenListed>>;

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

export default function ARGameplayScreen() {
  const insets = useSafeAreaInsets();
  const { addXP, captureToken } = useGameStore();
  const [perm, requestPerm] = useCameraPermissions();

  const [hunting, setHunting] = useState(false);
  const [tokens, setTokens] = useState<ARToken[]>([]);
  const [capturingId, setCapturingId] = useState<string | null>(null);
  const [result, setResult] = useState<{ token: ARToken; analysis: Result } | null>(null);
  const [motion, setMotion] = useState(0);
  const motionRef = useRef(0);
  const [fx, setFx] = useState<{ x: number; y: number } | null>(null);

  const spawnRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const jupiterPoolRef = useRef<JupiterTokenItem[]>([]);

  const scan = useSharedValue(0);
  useEffect(() => {
    scan.value = withRepeat(withTiming(1, { duration: 2200, easing: Easing.linear }), -1, false);
  }, [scan]);

  const scanLineStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: scan.value * (H * 0.55) }],
    opacity: 0.45 + motion * 0.25,
  }));

  useEffect(() => {
    Accelerometer.setUpdateInterval(220);
    const sub = Accelerometer.addListener((d) => {
      const m = Math.min(1, Math.abs(d.x) + Math.abs(d.y) + Math.abs(d.z - 1));
      setMotion(m);
      motionRef.current = m;
    });
    return () => sub.remove();
  }, []);

  const startHunt = useCallback(async () => {
    if (!perm?.granted) {
      const r = await requestPerm();
      if (!r.granted) return;
    }
    const pool = await fetchRandomJupiterTokens(40);
    jupiterPoolRef.current = pool.length > 0 ? pool : [];
    setHunting(true);
  }, [perm?.granted, requestPerm]);

  const stopHunt = useCallback(() => {
    setHunting(false);
    setTokens([]);
    if (spawnRef.current) clearInterval(spawnRef.current);
    spawnRef.current = null;
  }, []);

  useEffect(() => {
    if (!hunting) return;

    spawnRef.current = setInterval(() => {
      const pool = jupiterPoolRef.current;
      const useReal = Math.random() < 0.8 && pool.length > 0;
      const base = useReal
        ? pool[Math.floor(Math.random() * pool.length)]
        : generateFakeToken();
      const t: ARToken = {
        id: base.id,
        name: base.name,
        symbol: base.symbol,
        hue: base.hue,
        x: rand(28, W - 88),
        y: rand(120 + insets.top, H - 260),
        distanceM: Math.max(3, Math.round(rand(8, 120) - motionRef.current * 14)),
        visible: true,
      };
      setTokens((prev) => [...prev.filter((p) => p.visible).slice(-4), t]);
    }, 2600);

    return () => {
      if (spawnRef.current) clearInterval(spawnRef.current);
      spawnRef.current = null;
    };
  }, [hunting, insets.top]);

  const capture = useCallback(
    async (t: ARToken) => {
      if (!t.visible || capturingId) return;
      setCapturingId(t.id);
      setFx({ x: t.x + 32, y: t.y + 32 });
      setTokens((prev) => prev.map((p) => (p.id === t.id ? { ...p, visible: false } : p)));

      try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } catch {
        // no-op: haptics not available
      }

      const analysis = await checkTokenListed(t.symbol, t.name);

      captureToken({
        id: t.id,
        name: analysis.tokenName,
        symbol: analysis.symbol,
        riskScore: analysis.riskScore,
        category: analysis.category,
        capturedAt: Date.now(),
        xpEarned: 20,
        imageHue: t.hue,
      });
      addXP(20);

      setResult({ token: t, analysis });
      setCapturingId(null);
    },
    [addXP, captureToken, capturingId]
  );

  const visibleCount = useMemo(() => tokens.filter((t) => t.visible).length, [tokens]);

  if (!hunting) {
    return (
      <ScreenBackground scanline>
        <View style={styles.preContent}>
          <Text style={styles.preTitle}>AR Hunt Mode</Text>
          <Text style={styles.preSub}>
            Open your camera, detect nearby virtual tokens, tap to capture. Listed on Jupiter = safe; not listed = scam.
          </Text>
          <Text style={styles.preHint}>80% real tokens (Jupiter), 20% fake — catch the scams.</Text>
          <View style={{ height: 16 }} />
          <NeonButton
            title="Start AR Hunt"
            fullWidth
            onPress={startHunt}
            left={<Ionicons name="aperture" size={18} color={COLORS.neonGreen} />}
          />
          {!perm?.granted ? (
            <Text style={styles.preHint}>Camera permission required for the AR overlay.</Text>
          ) : (
            <Text style={styles.preHint}>Tip: capture fast — tokens despawn.</Text>
          )}
        </View>
      </ScreenBackground>
    );
  }

  return (
    <View style={styles.root}>
      <CameraView style={StyleSheet.absoluteFill} facing="back" />

      {/* HUD overlay */}
      <View style={StyleSheet.absoluteFill}>
        <View style={[styles.topHud, { paddingTop: Math.max(insets.top, 10) }]}>
          <Pressable
            onPress={stopHunt}
            style={styles.close}
          >
            <Ionicons name="close" size={18} color={COLORS.text} />
          </Pressable>
          <View style={styles.hudTitle}>
            <Ionicons name="crosshair" size={14} color={COLORS.neonGreen} />
            <Text style={styles.hudTitleText}>AR HUNT</Text>
          </View>
          <View style={styles.countPill}>
            <Text style={styles.countText}>{visibleCount} 🪙</Text>
          </View>
        </View>

        {/* Scanning frame */}
        <View pointerEvents="none" style={styles.frame}>
          <View style={[styles.corner, styles.tl]} />
          <View style={[styles.corner, styles.tr]} />
          <View style={[styles.corner, styles.bl]} />
          <View style={[styles.corner, styles.br]} />
          <Animated.View style={[styles.scanLine, scanLineStyle]} />
        </View>

        {/* Floating tokens */}
        {tokens
          .filter((t) => t.visible)
          .map((t) => (
            <ARTokenView key={t.id} token={t} onPress={() => capture(t)} />
          ))}

        {fx ? (
          <View pointerEvents="none" style={[styles.fxWrap, { left: fx.x - 70, top: fx.y - 70 }]}>
            <CaptureAnimation onDone={() => setFx(null)} />
          </View>
        ) : null}

        {/* Bottom zone */}
        <View style={[styles.bottomHud, { paddingBottom: Math.max(insets.bottom, 10) }]}>
          <RadarWidget tokenCount={visibleCount} size={86} />
          <View style={{ flex: 1, alignItems: "center" }}>
            <Text style={styles.bottomHint}>TAP TOKENS TO CAPTURE</Text>
            {capturingId ? <Text style={styles.bottomCapturing}>CAPTURING…</Text> : null}
          </View>
          <View style={{ width: 86 }} />
        </View>
      </View>

      <Modal transparent visible={!!result} animationType="fade" onRequestClose={() => setResult(null)}>
        <Pressable style={styles.modalOverlay} onPress={() => setResult(null)}>
          <Pressable style={styles.modalCard} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.modalTitle}>TOKEN CAPTURED</Text>
            {result ? (
              <>
                <Text style={styles.modalName}>{result.analysis.tokenName}</Text>
                <Text style={styles.modalSym}>${result.analysis.symbol}</Text>
                <View style={{ height: 12 }} />
                <RiskGauge score={result.analysis.riskScore} category={result.analysis.category} size={150} />
                <View style={{ height: 10 }} />
                <Text style={styles.modalXP}>+20 XP</Text>
                <View style={{ height: 14 }} />
                <NeonButton
                  title="Continue Hunt"
                  fullWidth
                  onPress={() => setResult(null)}
                  left={<Ionicons name="flash" size={18} color={COLORS.neonGreen} />}
                />
              </>
            ) : null}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

function ARTokenView({ token, onPress }: { token: ARToken; onPress: () => void }) {
  const float = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    float.value = withRepeat(withTiming(1, { duration: 1700 + Math.random() * 900, easing: Easing.inOut(Easing.quad) }), -1, true);
  }, [float]);

  const anim = useAnimatedStyle(() => ({
    transform: [{ translateY: -6 + float.value * 12 }, { scale: scale.value }],
  }));

  const pulse = useAnimatedStyle(() => ({
    opacity: 0.35 * (1 - float.value),
    transform: [{ scale: 1 + float.value * 0.8 }],
  }));

  const coinBg = useMemo(() => `hsla(${token.hue}, 85%, 55%, 0.26)`, [token.hue]);
  const coinBorder = useMemo(() => `hsla(${token.hue}, 85%, 60%, 0.45)`, [token.hue]);
  const coinText = useMemo(() => `hsl(${token.hue} 85% 78%)`, [token.hue]);

  return (
    <Animated.View entering={FadeIn} exiting={FadeOut} style={[styles.tokenWrap, { left: token.x, top: token.y }, anim]}>
      <Pressable
        onPress={async () => {
          scale.value = withSpring(1.15, { damping: 14, stiffness: 260 });
          setTimeout(() => (scale.value = withSpring(1, { damping: 14, stiffness: 260 })), 140);
          onPress();
        }}
      >
        <Animated.View pointerEvents="none" style={[styles.pulseRing, { borderColor: COLORS.neonGreen }, pulse]} />
        <View style={[styles.coin, { backgroundColor: coinBg, borderColor: coinBorder, shadowColor: coinBorder }]}>
          <Text style={[styles.coinText, { color: coinText }]}>{token.symbol.slice(0, 2)}</Text>
        </View>
        <View style={styles.dist}>
          <Text style={styles.distText}>{token.distanceM}m</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  preContent: { flex: 1, justifyContent: "center", paddingHorizontal: 18 },
  preTitle: { color: COLORS.text, fontSize: 30, fontWeight: "900" },
  preSub: { color: COLORS.textMuted, marginTop: 10, lineHeight: 20 },
  preHint: { color: "rgba(255,255,255,0.5)", marginTop: 12, textAlign: "center" },

  root: { flex: 1, backgroundColor: "black" },
  topHud: {
    paddingHorizontal: 14,
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  close: {
    width: 42,
    height: 42,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.35)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  hudTitle: { flexDirection: "row", alignItems: "center", gap: 8 },
  hudTitleText: { color: COLORS.neonGreen, fontWeight: "900", letterSpacing: 2.1, fontSize: 11 },
  countPill: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "rgba(0,255,163,0.10)",
    borderWidth: 1,
    borderColor: "rgba(0,255,163,0.18)",
  },
  countText: { color: COLORS.neonGreen, fontWeight: "900", letterSpacing: 1.2 },

  frame: {
    position: "absolute",
    left: 18,
    right: 18,
    top: 86,
    bottom: 160,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: "rgba(0,255,163,0.18)",
    backgroundColor: "rgba(0,0,0,0.06)",
    overflow: "hidden",
  },
  corner: {
    position: "absolute",
    width: 18,
    height: 18,
    borderColor: "rgba(0,255,163,0.75)",
  },
  tl: { left: 12, top: 12, borderLeftWidth: 2, borderTopWidth: 2, borderTopLeftRadius: 10 },
  tr: { right: 12, top: 12, borderRightWidth: 2, borderTopWidth: 2, borderTopRightRadius: 10 },
  bl: { left: 12, bottom: 12, borderLeftWidth: 2, borderBottomWidth: 2, borderBottomLeftRadius: 10 },
  br: { right: 12, bottom: 12, borderRightWidth: 2, borderBottomWidth: 2, borderBottomRightRadius: 10 },
  scanLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: "rgba(0,255,163,0.55)",
    shadowColor: COLORS.neonGreen,
    shadowOpacity: 0.6,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 0 },
  },

  tokenWrap: { position: "absolute", zIndex: 20 },
  pulseRing: { position: "absolute", left: -18, top: -18, right: -18, bottom: -18, borderRadius: 999, borderWidth: 1 },
  coin: {
    width: 64,
    height: 64,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    shadowOpacity: 0.35,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 0 },
  },
  coinText: { fontWeight: "900", letterSpacing: 1.4, fontSize: 14 },
  dist: { position: "absolute", left: "50%", top: 70, marginLeft: -18, width: 36, alignItems: "center" },
  distText: {
    color: COLORS.text,
    fontSize: 10,
    fontWeight: "900",
    backgroundColor: "rgba(0,0,0,0.55)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    overflow: "hidden",
  },

  bottomHud: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  bottomHint: { color: COLORS.textMuted, fontSize: 11, fontWeight: "900", letterSpacing: 1.6 },
  bottomCapturing: { marginTop: 6, color: COLORS.neonGreen, fontWeight: "900", letterSpacing: 2.1 },

  fxWrap: { position: "absolute", zIndex: 40 },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.75)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
  },
  modalCard: {
    width: "100%",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    backgroundColor: "rgba(10,15,44,0.92)",
    padding: 16,
  },
  modalTitle: { color: COLORS.neonGreen, fontWeight: "900", letterSpacing: 2.2, fontSize: 12, textAlign: "center" },
  modalName: { marginTop: 10, color: COLORS.text, fontSize: 18, fontWeight: "900", textAlign: "center" },
  modalSym: { marginTop: 2, color: COLORS.textMuted, textAlign: "center", fontWeight: "800" },
  modalXP: { textAlign: "center", color: COLORS.neonGreen, fontWeight: "900", letterSpacing: 1.4 },
});

