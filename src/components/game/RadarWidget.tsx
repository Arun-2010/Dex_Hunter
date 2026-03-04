import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";

import { COLORS } from "../../utils/theme";

export default function RadarWidget({ tokenCount = 0, size = 96 }: { tokenCount?: number; size?: number }) {
  const rot = useSharedValue(0);

  React.useEffect(() => {
    rot.value = withRepeat(withTiming(1, { duration: 2400, easing: Easing.linear }), -1, false);
  }, [rot]);

  const sweepStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rot.value * 360}deg` }],
  }));

  const dots = useMemo(
    () =>
      Array.from({ length: Math.min(tokenCount, 5) }).map(() => ({
        x: 0.2 + Math.random() * 0.6,
        y: 0.2 + Math.random() * 0.6,
      })),
    [tokenCount]
  );

  return (
    <View style={[styles.wrap, { width: size, height: size, borderRadius: size / 2 }]}>
      <View style={[styles.ring, { borderRadius: size / 2 }]} />
      <View style={[styles.ring, styles.ring2, { borderRadius: size / 2 }]} />
      <View style={[styles.ring, styles.ring3, { borderRadius: size / 2 }]} />

      <View style={[styles.vLine, { height: size }]} />
      <View style={[styles.hLine, { width: size }]} />

      <Animated.View style={[styles.sweepWrap, sweepStyle]}>
        <LinearGradient
          colors={["rgba(0,255,163,0.0)", "rgba(0,255,163,0.22)"]}
          start={{ x: 0.5, y: 1 }}
          end={{ x: 0.5, y: 0 }}
          style={[styles.sweep, { height: size / 2 }]}
        />
      </Animated.View>

      {dots.map((d, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            {
              left: d.x * size,
              top: d.y * size,
            },
          ]}
        />
      ))}

      <View style={styles.centerDot} />
      <View style={styles.caption}>
        <Text style={styles.captionText}>{tokenCount} nearby</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: "rgba(0,255,163,0.04)",
    borderWidth: 1,
    borderColor: "rgba(0,255,163,0.18)",
    overflow: "hidden",
  },
  ring: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 1,
    borderColor: "rgba(0,255,163,0.18)",
  },
  ring2: {
    top: "14%",
    left: "14%",
    right: "14%",
    bottom: "14%",
    borderColor: "rgba(0,255,163,0.13)",
  },
  ring3: {
    top: "30%",
    left: "30%",
    right: "30%",
    bottom: "30%",
    borderColor: "rgba(0,255,163,0.10)",
  },
  vLine: {
    position: "absolute",
    width: 1,
    left: "50%",
    top: 0,
    backgroundColor: "rgba(0,255,163,0.10)",
  },
  hLine: {
    position: "absolute",
    height: 1,
    top: "50%",
    left: 0,
    backgroundColor: "rgba(0,255,163,0.10)",
  },
  sweepWrap: { position: "absolute", left: "50%", top: "50%" },
  sweep: {
    width: 2,
    transform: [{ translateX: -1 }, { translateY: -1 }],
    borderRadius: 2,
    shadowColor: COLORS.neonGreen,
    shadowOpacity: 0.5,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 0 },
  },
  dot: {
    position: "absolute",
    width: 6,
    height: 6,
    borderRadius: 6,
    backgroundColor: COLORS.neonGreen,
    shadowColor: COLORS.neonGreen,
    shadowOpacity: 0.6,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
  },
  centerDot: {
    position: "absolute",
    left: "50%",
    top: "50%",
    width: 6,
    height: 6,
    borderRadius: 6,
    marginLeft: -3,
    marginTop: -3,
    backgroundColor: COLORS.neonGreen,
    shadowColor: COLORS.neonGreen,
    shadowOpacity: 0.75,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
  },
  caption: { position: "absolute", left: 0, right: 0, bottom: -18, alignItems: "center" },
  captionText: { color: COLORS.neonGreen, fontSize: 10, fontWeight: "900", letterSpacing: 1.2 },
});
