const TOKEN_NAMES = [
  "SafeMoon",
  "ElonDoge",
  "ShibaRocket",
  "MetaVerse Inu",
  "CryptoGem",
  "MoonShot",
  "DiamondHands",
  "YieldFarm Pro",
  "DeFi Swap",
  "ChainLink Ultra",
  "SolanaMax",
  "AvalancheX",
  "PolygonPro",
  "ArbitrumGo",
  "OptimismPlus",
  "UniSwapV4",
  "PancakeMax",
  "CurveDAO",
  "AaveVault",
  "CompoundMax",
  "BabyDoge",
  "FlokiX",
  "PepeCoin",
  "WojackToken",
  "RektCoin",
  "RugPull Finance",
  "HoneypotDAO",
  "PumpNDump",
  "ScamSwap",
  "FakeYield",
];

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickMany(arr, count) {
  const copy = [...arr];
  copy.sort(() => Math.random() - 0.5);
  return copy.slice(0, count);
}

function makeSymbol(name) {
  return String(name).replace(/[^A-Z]/gi, "").substring(0, 4).toUpperCase() || "TOKN";
}

function simulateTokenFacts(seedName) {
  const liquidityUsd = Math.round(500 + Math.random() * 250000);
  const topHoldersPct = Math.round(8 + Math.random() * 88);
  const contractVerified = Math.random() > 0.42;
  const socialStrength = Math.round(Math.random() * 100); // 0 weak, 100 strong
  const ageDays = Math.round(1 + Math.random() * 720);

  // tiny bias: scammy-sounding names trend worse
  const name = String(seedName || pick(TOKEN_NAMES));
  const namePenalty = /rug|honeypot|pump|dump|scam|fake/i.test(name) ? 14 : 0;

  return {
    liquidityUsd,
    topHoldersPct,
    contractVerified,
    socialStrength,
    ageDays,
    namePenalty,
  };
}

function buildReasons(facts) {
  const reasons = [];

  if (facts.liquidityUsd < 10000) reasons.push("Low liquidity (thin pools → easy manipulation)");
  if (facts.topHoldersPct > 60) reasons.push("High holder concentration (whales control supply)");
  if (!facts.contractVerified) reasons.push("Unverified contract (source not published)");
  if (facts.socialStrength < 25) reasons.push("Weak social presence (low community signals)");
  if (facts.ageDays < 30) reasons.push("Very new token (limited on-chain history)");

  if (reasons.length === 0) {
    reasons.push(...pickMany([
      "Verified contract on explorer",
      "Healthy liquidity distribution",
      "Active community signals detected",
      "No obvious honeypot patterns in simulation",
      "Holder spread looks natural (no extreme clustering)",
    ], 3));
  }

  // Keep it punchy
  return reasons.slice(0, 5);
}

function scoreRisk(facts) {
  let score = 18 + Math.random() * 22; // baseline

  if (facts.liquidityUsd < 5000) score += 26;
  else if (facts.liquidityUsd < 25000) score += 16;
  else if (facts.liquidityUsd < 100000) score += 8;

  if (facts.topHoldersPct > 80) score += 28;
  else if (facts.topHoldersPct > 60) score += 18;
  else if (facts.topHoldersPct > 40) score += 10;

  if (!facts.contractVerified) score += 18;
  if (facts.socialStrength < 20) score += 16;
  else if (facts.socialStrength < 40) score += 8;

  if (facts.ageDays < 14) score += 14;
  else if (facts.ageDays < 60) score += 8;

  score += facts.namePenalty;
  score += (Math.random() - 0.5) * 10; // noise

  return Math.round(clamp(score, 0, 100));
}

function categorize(score) {
  if (score >= 70) return "SCAM";
  if (score >= 35) return "SUSPICIOUS";
  return "SAFE";
}

export function analyzeToken(token) {
  const tokenName = typeof token === "string" ? token : token?.name || token?.tokenName;
  const name = tokenName || pick(TOKEN_NAMES);
  const symbol = typeof token === "object" && token?.symbol ? token.symbol : makeSymbol(name);

  const facts = simulateTokenFacts(name);
  const riskScore = scoreRisk(facts);
  const category = categorize(riskScore);

  const confidence = Math.round(
    clamp(58 + (category === "SAFE" ? 8 : category === "SCAM" ? 14 : 10) + Math.random() * 22, 55, 97)
  );

  const reasons = buildReasons(facts);

  return new Promise((resolve) => {
    const delay = 900 + Math.random() * 1400;
    setTimeout(() => {
      resolve({ riskScore, category, confidence, reasons, tokenName: name, symbol });
    }, delay);
  });
}

export function generateRandomToken() {
  const name = pick(TOKEN_NAMES);
  const symbol = makeSymbol(name);
  const hue = Math.floor(Math.random() * 360);
  return { id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, name, symbol, hue };
}

export const LEADERBOARD_DATA = [
  { rank: 1, name: "NeonSlayer", level: 42, xp: 4200, captures: 312, accuracy: 94 },
  { rank: 2, name: "CryptoPhantom", level: 38, xp: 3800, captures: 287, accuracy: 91 },
  { rank: 3, name: "BlockHunterX", level: 35, xp: 3500, captures: 265, accuracy: 88 },
  { rank: 4, name: "DeFiNinja", level: 31, xp: 3100, captures: 231, accuracy: 86 },
  { rank: 5, name: "ChainWarden", level: 28, xp: 2800, captures: 198, accuracy: 84 },
  { rank: 6, name: "RugDetector", level: 25, xp: 2500, captures: 175, accuracy: 82 },
  { rank: 7, name: "ScamSheriff", level: 22, xp: 2200, captures: 152, accuracy: 80 },
  { rank: 8, name: "TokenGuard", level: 19, xp: 1900, captures: 134, accuracy: 78 },
  { rank: 9, name: "Web3Sentinel", level: 16, xp: 1600, captures: 112, accuracy: 75 },
  { rank: 10, name: "CyberHawk", level: 13, xp: 1300, captures: 89, accuracy: 72 },
];

