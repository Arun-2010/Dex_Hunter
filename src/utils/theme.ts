export const COLORS = {
  bgTop: "#0A0F2C",
  bgBottom: "#050814",
  neonGreen: "#00FFA3",
  electricPurple: "#7B5CFF",
  dangerRed: "#FF3B3B",
  text: "rgba(255,255,255,0.92)",
  textMuted: "rgba(255,255,255,0.65)",
  glass: "rgba(255,255,255,0.06)",
  glassBorder: "rgba(255,255,255,0.14)",
};

export function categoryColor(category: "SAFE" | "SUSPICIOUS" | "SCAM") {
  if (category === "SAFE") return COLORS.neonGreen;
  if (category === "SUSPICIOUS") return "#FFD166";
  return COLORS.dangerRed;
}

