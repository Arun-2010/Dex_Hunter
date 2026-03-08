/**
 * Jupiter API integration: tokens listed on Jupiter are treated as OK/safe;
 * tokens not found are treated as scam.
 */

const LITE_BASE = "https://lite-api.jup.ag/tokens/v2";

export type JupiterListingResult = {
  listed: boolean;
  category: "SAFE" | "SCAM";
  tokenName: string;
  symbol: string;
  riskScore: number; // 0-100, low = safe, high = scam
  reasons: string[];
};

/**
 * Check if a token is listed on Jupiter (by symbol or name).
 * Listed = SAFE, not listed = SCAM.
 */
export async function checkTokenListed(
  symbol: string,
  name?: string
): Promise<JupiterListingResult> {
  const query = (symbol || name || "").trim();
  const tokenName = name || symbol || "Unknown";
  const sym = symbol || "??";

  if (!query) {
    return {
      listed: false,
      category: "SCAM",
      tokenName,
      symbol: sym,
      riskScore: 100,
      reasons: ["No symbol or name provided."],
    };
  }

  try {
    const encoded = encodeURIComponent(query);
    const res = await fetch(`${LITE_BASE}/search?query=${encoded}`, {
      method: "GET",
      headers: { Accept: "application/json" },
    });
    if (!res.ok) {
      return {
        listed: false,
        category: "SCAM",
        tokenName,
        symbol: sym,
        riskScore: 85,
        reasons: ["Jupiter API unavailable or token not listed."],
      };
    }
    const data = await res.json();
    const list = Array.isArray(data) ? data : [];
    const listed = list.length > 0;

    if (listed) {
      const first = list[0] as { name?: string; symbol?: string };
      return {
        listed: true,
        category: "SAFE",
        tokenName: first.name ?? tokenName,
        symbol: (first.symbol ?? sym).toString(),
        riskScore: 15,
        reasons: ["Token is listed on Jupiter.", "Tradable on Solana DEX."],
      };
    }

    return {
      listed: false,
      category: "SCAM",
      tokenName,
      symbol: sym,
      riskScore: 90,
      reasons: [
        "Token is not listed on Jupiter.",
        "Not found in Jupiter's token index — treat as unverified.",
      ],
    };
  } catch {
    return {
      listed: false,
      category: "SCAM",
      tokenName,
      symbol: sym,
      riskScore: 80,
      reasons: ["Could not verify listing (network error)."],
    };
  }
}

export type JupiterTokenItem = {
  id: string;
  name: string;
  symbol: string;
  icon?: string;
  hue: number;
};

/**
 * Fetch random tokens from Jupiter (e.g. recent tokens) for game deck.
 */
export async function fetchRandomJupiterTokens(
  limit: number = 8
): Promise<JupiterTokenItem[]> {
  try {
    const res = await fetch(`${LITE_BASE}/recent`, {
      method: "GET",
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return fallbackTokens(limit);
    const data = await res.json();
    const list = Array.isArray(data) ? data : [];
    const shuffled = [...list].sort(() => Math.random() - 0.5);
    const slice = shuffled.slice(0, limit);
    const hue = () => Math.floor(Math.random() * 360);
    return slice.map((t: { id?: string; name?: string; symbol?: string }, i: number) => ({
      id: t.id ?? `jup-${Date.now()}-${i}`,
      name: String(t.name ?? "Unknown").slice(0, 24),
      symbol: String(t.symbol ?? "??").slice(0, 8),
      icon: (t as { icon?: string }).icon,
      hue: hue(),
    }));
  } catch {
    return fallbackTokens(limit);
  }
}

const MEME_FALLBACK_SYMBOLS = ["BONK", "WIF", "PEPE", "FARTCOIN", "POPCAT", "MEW", "MOG", "NEIRO", "TOSHI", "DUKO", "ACT", "GOAT", "HODL", "SLERF", "GOAT"];

/**
 * Fetch exactly 15 meme/trending coins from Jupiter for AR Hunt and Rewards.
 * Uses toptrending when available, otherwise recent tokens; fallback to known meme list.
 */
export async function fetchMemeCoins(limit: number = 15): Promise<JupiterTokenItem[]> {
  const hue = () => Math.floor(Math.random() * 360);
  const mapItem = (t: { id?: string; name?: string; symbol?: string; address?: string }, i: number): JupiterTokenItem => ({
    id: (t as { address?: string }).address ?? t.id ?? `jup-${Date.now()}-${i}`,
    name: String(t.name ?? "Unknown").slice(0, 24),
    symbol: String(t.symbol ?? "??").slice(0, 8),
    hue: hue(),
  });

  try {
    const res = await fetch(`${LITE_BASE}/toptrending?interval=24h&limit=${limit}`, {
      method: "GET",
      headers: { Accept: "application/json" },
    });
    if (res.ok) {
      const data = await res.json();
      const list = Array.isArray(data) ? data : [];
      if (list.length >= limit) {
        return list.slice(0, limit).map(mapItem);
      }
    }
  } catch {
    // ignore
  }

  try {
    const res = await fetch(`${LITE_BASE}/recent`, {
      method: "GET",
      headers: { Accept: "application/json" },
    });
    if (res.ok) {
      const data = await res.json();
      const list = Array.isArray(data) ? data : [];
      const shuffled = [...list].sort(() => Math.random() - 0.5);
      return shuffled.slice(0, limit).map(mapItem);
    }
  } catch {
    // ignore
  }

  return MEME_FALLBACK_SYMBOLS.slice(0, limit).map((symbol, i) => ({
    id: `fallback-meme-${Date.now()}-${i}`,
    name: symbol,
    symbol,
    hue: hue(),
  }));
}

function fallbackTokens(limit: number): JupiterTokenItem[] {
  const names = ["SOL", "USDC", "BONK", "JUP", "WIF", "RAY", "ORCA", "MNGO"];
  return names.slice(0, limit).map((symbol, i) => ({
    id: `fallback-${Date.now()}-${i}`,
    name: symbol,
    symbol,
    hue: Math.floor(Math.random() * 360),
  }));
}

const FAKE_PREFIXES = ["RugPull", "ScamCoin", "FakeYield", "PumpDump", "Honeypot", "FakeToken", "PhantomRug"];

/**
 * Generate a fake token (not on Jupiter) for AR hunt — will be detected as scam when checked.
 */
export function generateFakeToken(): JupiterTokenItem {
  const prefix = FAKE_PREFIXES[Math.floor(Math.random() * FAKE_PREFIXES.length)];
  const suffix = Math.floor(100 + Math.random() * 900);
  const name = `${prefix}${suffix}`;
  const symbol = `${prefix.slice(0, 3).toUpperCase()}${suffix}`.slice(0, 8);
  return {
    id: `fake-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name,
    symbol,
    hue: Math.floor(Math.random() * 360),
  };
}
