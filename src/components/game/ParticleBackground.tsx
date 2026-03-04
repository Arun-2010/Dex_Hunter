import React, { useMemo } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";

import { COLORS } from "../../utils/theme";

const { width, height } = Dimensions.get("window");

type Dot = { x: number; y: number; size: number; color: string; alpha: number };

export default function ParticleBackground() {
  const dots = useMemo<Dot[]>(
    () =>
      Array.from({ length: 34 }).map(() => {
        const isGreen = Math.random() > 0.45;
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          size: 1 + Math.random() * 2.6,
          color: isGreen ? COLORS.neonGreen : COLORS.electricPurple,
          alpha: 0.08 + Math.random() * 0.22,
        };
      }),
    []
  );

  const rot = useSharedValue(0);
  const glow = useSharedValue(0.6);

  React.useEffect(() => {
    rot.value = withRepeat(withTiming(1, { duration: 22000, easing: Easing.linear }), -1, false);
    glow.value = withRepeat(withTiming(1, { duration: 2600, easing: Easing.inOut(Easing.quad) }), -1, true);
  }, [glow, rot]);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rot.value * 360}deg` }],
    opacity: 0.75 + (glow.value - 0.6) * 0.2,
  }));

  return (
    <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, containerStyle]}>
      {dots.map((d, idx) => (
        <View
          key={idx}
          style={[
            styles.dot,
            {
              left: d.x,
              top: d.y,
              width: d.size,
              height: d.size,
              borderRadius: d.size,
              backgroundColor: d.color,
              opacity: d.alpha,
              shadowColor: d.color,
              shadowOpacity: 0.8,
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 0 },
            },
          ]}
        />
      ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  dot: {
    position: "absolute",
  },
});
