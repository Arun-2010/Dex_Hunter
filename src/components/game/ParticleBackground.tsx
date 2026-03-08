import React, { useMemo, useEffect, useRef } from "react";
import { Dimensions, StyleSheet, View, Animated } from "react-native";

import { COLORS } from "../../utils/theme";

const { width, height } = Dimensions.get("window");

type Dot = { x: number; y: number; size: number; color: string; alpha: number };

export default function ParticleBackground() {
  const animatedDots = useRef<Animated.Value[]>([]);

  const dots = useMemo<Dot[]>(
    () =>
      Array.from({ length: 34 }).map((_, idx) => {
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

  useEffect(() => {
    // Initialize animated values if not already done
    if (animatedDots.current.length === 0) {
      animatedDots.current = dots.map(() => new Animated.Value(Math.random()));
    }

    // Create animation loops for each dot
    const animations = animatedDots.current.map((animValue, index) => {
      if (!animValue) return null; // Skip if not initialized
      
      const dot = dots[index];
      const duration = 15000 + Math.random() * 10000; // 15-25 seconds per cycle
      const delay = Math.random() * 5000; // Random start delay

      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(animValue, {
            toValue: 1,
            duration: duration / 2,
            useNativeDriver: false,
          }),
          Animated.timing(animValue, {
            toValue: 0,
            duration: duration / 2,
            useNativeDriver: false,
          }),
        ])
      );
    }).filter(Boolean); // Remove null values

    // Start all animations
    animations.forEach(anim => anim?.start());

    return () => {
      // Cleanup animations
      animations.forEach(anim => anim?.stop());
    };
  }, []);

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {dots.map((d, idx) => {
        const animValue = animatedDots.current[idx];
        if (!animValue) {
          // Fallback to static position if animation not ready
          return (
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
          );
        }

        const animatedX = animValue.interpolate({
          inputRange: [0, 1],
          outputRange: [d.x, d.x + (Math.random() - 0.5) * 60], // Smaller movement range
        });

        const animatedY = animValue.interpolate({
          inputRange: [0, 1],
          outputRange: [d.y, d.y + (Math.random() - 0.5) * 40], // Smaller movement range
        });

        return (
          <Animated.View
            key={idx}
            style={[
              styles.dot,
              {
                left: animatedX,
                top: animatedY,
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
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  dot: {
    position: "absolute",
  },
});
