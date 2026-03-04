import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Path, Text as SvgText } from "react-native-svg";
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { categoryColor, COLORS } from "../../utils/theme";

const AnimatedPath = Animated.createAnimatedComponent(Path);

export default function RiskGauge({
  score,
  size = 140,
  category,
}: {
  score: number;
  size?: number;
  category: "SAFE" | "SUSPICIOUS" | "SCAM";
}) {
  const radius = (size - 16) / 2;
  const circumference = Math.PI * radius;
  const progress = Math.max(0, Math.min(1, score / 100));
  const c = categoryColor(category);

  const dash = useSharedValue(circumference);

  useEffect(() => {
    dash.value = withTiming(circumference - progress * circumference, {
      duration: 900,
      easing: Easing.out(Easing.cubic),
    });
  }, [circumference, dash, progress]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: dash.value,
  }));

  const d = `M 8 ${size / 2} A ${radius} ${radius} 0 0 1 ${size - 8} ${size / 2}`;

  return (
    <View style={styles.wrap}>
      <Svg width={size} height={size / 2 + 12} viewBox={`0 0 ${size} ${size / 2 + 12}`}>
        <Path d={d} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="8" strokeLinecap="round" />
        <AnimatedPath
          animatedProps={animatedProps}
          d={d}
          fill="none"
          stroke={c}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
        />
        <SvgText
          x={size / 2}
          y={size / 2 - 6}
          textAnchor="middle"
          fill={c}
          fontSize="28"
          fontWeight="800"
        >
          {score}
        </SvgText>
      </Svg>
      <Text style={[styles.label, { color: c }]}>{category}</Text>
      <Text style={styles.micro}>RISK SCORE</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center" },
  label: { marginTop: 4, fontSize: 12, fontWeight: "900", letterSpacing: 2.4 },
  micro: { marginTop: 4, color: COLORS.textMuted, fontSize: 10, fontWeight: "800", letterSpacing: 2.1 },
});
