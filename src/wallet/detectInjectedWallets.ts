export type InjectedWalletKind = "solana" | "ethereum";

export type DetectedInjectedWallet = {
  id: string;
  name: string;
  kind: InjectedWalletKind;
  connect: () => Promise<string>;
};

type SolanaProvider = {
  isPhantom?: boolean;
  isBackpack?: boolean;
  isSolflare?: boolean;
  isGlow?: boolean;
  connect?: () => Promise<{ publicKey?: { toString?: () => string } } | void>;
  publicKey?: { toString?: () => string };
};

type EthereumProvider = {
  isMetaMask?: boolean;
  isCoinbaseWallet?: boolean;
  request?: (args: { method: string }) => Promise<unknown>;
};

function uniqById(items: DetectedInjectedWallet[]) {
  const seen = new Set<string>();
  return items.filter((i) => {
    if (seen.has(i.id)) return false;
    seen.add(i.id);
    return true;
  });
}

function safeNameFromSolanaProvider(p: SolanaProvider) {
  if (p.isPhantom) return "Phantom";
  if (p.isBackpack) return "Backpack";
  if (p.isSolflare) return "Solflare";
  if (p.isGlow) return "Glow";
  return "Solana Wallet";
}

function safeNameFromEthereumProvider(p: EthereumProvider) {
  if (p.isMetaMask) return "MetaMask";
  if (p.isCoinbaseWallet) return "Coinbase Wallet";
  return "Ethereum Wallet";
}

async function connectSolana(p: SolanaProvider) {
  if (p.connect) {
    const res = await p.connect();
    const key = (res as { publicKey?: { toString?: () => string } } | undefined)?.publicKey ?? p.publicKey;
    const addr = key?.toString?.();
    if (addr) return addr;
  }
  const addr = p.publicKey?.toString?.();
  if (addr) return addr;
  throw new Error("Unable to read Solana public key from injected provider.");
}

async function connectEthereum(p: EthereumProvider) {
  const res = await p.request?.({ method: "eth_requestAccounts" });
  const accounts = Array.isArray(res) ? (res as unknown[]) : [];
  const addr = typeof accounts[0] === "string" ? (accounts[0] as string) : "";
  if (addr) return addr;
  throw new Error("Unable to get Ethereum account from injected provider.");
}

export function detectInjectedWallets(): DetectedInjectedWallet[] {
  const w = globalThis as unknown as {
    solana?: SolanaProvider;
    phantom?: { solana?: SolanaProvider };
    ethereum?: EthereumProvider & { providers?: EthereumProvider[] };
  };

  const detected: DetectedInjectedWallet[] = [];

  const solanaProviders: SolanaProvider[] = [];
  if (w.solana) solanaProviders.push(w.solana);
  if (w.phantom?.solana) solanaProviders.push(w.phantom.solana);

  for (const p of solanaProviders) {
    detected.push({
      id: `solana:${safeNameFromSolanaProvider(p)}`,
      name: safeNameFromSolanaProvider(p),
      kind: "solana",
      connect: () => connectSolana(p),
    });
  }

  const eth = w.ethereum;
  const ethProviders = eth?.providers?.length ? eth.providers : eth ? [eth] : [];
  for (const p of ethProviders) {
    detected.push({
      id: `ethereum:${safeNameFromEthereumProvider(p)}`,
      name: safeNameFromEthereumProvider(p),
      kind: "ethereum",
      connect: () => connectEthereum(p),
    });
  }

  return uniqById(detected);
}

