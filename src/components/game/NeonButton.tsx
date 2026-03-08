import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { COLORS } from "../../utils/theme";

export default function NeonButton({
  title,
  onPress,
  variant = "green",
  fullWidth,
  disabled,
  left,
}: {
  title: string;
  onPress?: () => void;
  variant?: "green" | "purple" | "danger";
  fullWidth?: boolean;
  disabled?: boolean;
  left?: React.ReactNode;
}) {
  const c =
    variant === "green" ? COLORS.neonGreen : variant === "purple" ? COLORS.electricPurple : COLORS.dangerRed;

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.btn,
        fullWidth ? styles.full : null,
        { borderColor: `${c}55`, backgroundColor: `${c}1A`, shadowColor: c },
        disabled ? styles.disabled : null,
      ]}
    >
      <View style={styles.row}>
        {left ? <View style={styles.left}>{left}</View> : null}
        <Text style={[styles.text, { color: c }]}>{title}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    borderWidth: 1,
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowOpacity: 0.35,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 0 },
  },
  full: { width: "100%" },
  disabled: { opacity: 0.45 },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10 },
  left: { marginRight: 2 },
  text: {
    fontSize: 14,
    letterSpacing: 1.8,
    fontWeight: "800",
    textTransform: "uppercase",
  },
});
