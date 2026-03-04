import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { COLORS } from "../../utils/theme";

export default function CaptureAnimation({
  size = 140,
  onDone,
}: {
  size?: number;
  onDone?: () => void;
}) {
  const t = useSharedValue(0);

  useEffect(() => {
    t.value = withTiming(1, { duration: 650, easing: Easing.out(Easing.cubic) }, (finished) => {
      if (finished && onDone) {
        runOnJS(onDone)();
      }
    });
  }, [onDone, t]);

  const ring1 = useAnimatedStyle(() => ({
    opacity: 0.65 * (1 - t.value),
    transform: [{ scale: 0.6 + t.value * 1.4 }],
  }));
  const ring2 = useAnimatedStyle(() => ({
    opacity: 0.35 * (1 - t.value),
    transform: [{ scale: 0.35 + t.value * 2.0 }],
  }));

  return (
    <View pointerEvents="none" style={[styles.wrap, { width: size, height: size }]}>
      <Animated.View style={[styles.ring, styles.ringA, ring1]} />
      <Animated.View style={[styles.ring, styles.ringB, ring2]} />
      <View style={styles.core} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center", justifyContent: "center" },
  ring: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 999,
    borderWidth: 2,
  },
  ringA: { borderColor: "rgba(0,255,163,0.65)", shadowColor: COLORS.neonGreen, shadowOpacity: 0.4, shadowRadius: 22, shadowOffset: { width: 0, height: 0 } },
  ringB: { borderColor: "rgba(123,92,255,0.55)", shadowColor: COLORS.electricPurple, shadowOpacity: 0.35, shadowRadius: 22, shadowOffset: { width: 0, height: 0 } },
  core: { width: 14, height: 14, borderRadius: 14, backgroundColor: COLORS.neonGreen, shadowColor: COLORS.neonGreen, shadowOpacity: 0.7, shadowRadius: 18, shadowOffset: { width: 0, height: 0 } },
});

