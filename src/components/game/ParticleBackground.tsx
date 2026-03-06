import React, { useMemo } from "react";
import { Dimensions, StyleSheet, View } from "react-native";

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

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  dot: {
    position: "absolute",
  },
});
