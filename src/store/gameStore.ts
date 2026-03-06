import { create } from 'zustand';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createJSONStorage, persist } from "zustand/middleware";

export interface CapturedToken {
  id: string;
  name: string;
  symbol: string;
  riskScore: number;
  category: 'SAFE' | 'SUSPICIOUS' | 'SCAM';
  capturedAt: number;
  xpEarned: number;
  imageHue: number;
}

export interface ScanResult {
  tokenName: string;
  riskScore: number;
  category: 'SAFE' | 'SUSPICIOUS' | 'SCAM';
  confidence: number;
  reasons: string[];
  scannedAt: number;
}

interface GameState {
  // Boot
  booted: boolean;
  boot: () => void;

  // Auth
  isAuthed: boolean;
  signIn: (name: string) => void;
  signOut: () => void;

  // User
  username: string;
  setUsername: (name: string) => void;
  
  // XP & Level
  xp: number;
  level: number;
  addXP: (amount: number) => void;
  
  // Tokens
  capturedTokens: CapturedToken[];
  captureToken: (token: CapturedToken) => void;

  // Multi-token rewards
  tokenCounts: Record<string, number>;
  allowedRewardSymbols: string[];
  setAllowedRewardSymbols: (symbols: string[]) => void;

  // Claim
  collectedTokens: number;
  claimEligible: boolean;
  walletConnected: boolean;
  walletAddress: string | null;
  claimSubmitted: boolean;
  connectWallet: () => void;
  submitClaim: () => void;
  
  // Scan history
  scanHistory: ScanResult[];
  addScanResult: (result: ScanResult) => void;
  
  // Stats
  totalScans: number;
  totalCaptures: number;
  accuracy: number;
  streak: number;
  
  // Daily login
  lastLoginDate: string | null;
  claimDailyLogin: () => boolean;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      booted: false,
      boot: () => set({ booted: true }),

      isAuthed: false,
      signIn: (name) => {
        set({ isAuthed: true, username: name?.trim() ? name.trim() : "CyberHunter" });
        get().claimDailyLogin();
      },
      signOut: () =>
        set({
          isAuthed: false,
          walletConnected: false,
          walletAddress: null,
          claimSubmitted: false,
        }),

      username: 'CyberHunter',
      setUsername: (name) => set({ username: name }),
      
      xp: 0,
      level: 1,
      addXP: (amount) => {
        const state = get();
        const newXP = state.xp + amount;
        const newLevel = Math.floor(newXP / 100) + 1;
        set({ xp: newXP, level: newLevel });
      },
      
      capturedTokens: [],
      captureToken: (token) => {
        const state = get();
        const newCollected = state.collectedTokens + 1;
        const key = token.symbol || token.name;
        const nextTokenCounts = {
          ...state.tokenCounts,
          [key]: (state.tokenCounts[key] ?? 0) + 1,
        };
        set({
          capturedTokens: [token, ...state.capturedTokens],
          totalCaptures: state.totalCaptures + 1,
          collectedTokens: newCollected,
          claimEligible: newCollected >= 5,
          tokenCounts: nextTokenCounts,
        });
      },
      
      scanHistory: [],
      addScanResult: (result) => {
        const state = get();
        const scamCount = [...state.scanHistory, result].filter(s => s.category === 'SCAM').length;
        const accuracy = state.scanHistory.length > 0 
          ? Math.round((scamCount / (state.scanHistory.length + 1)) * 100)
          : 50;
        set({
          scanHistory: [result, ...state.scanHistory],
          totalScans: state.totalScans + 1,
          accuracy,
        });
      },
      
      totalScans: 0,
      totalCaptures: 0,
      accuracy: 50,
      streak: 0,

      tokenCounts: {},
      allowedRewardSymbols: [],
      setAllowedRewardSymbols: (symbols) => set({ allowedRewardSymbols: symbols }),

      collectedTokens: 0,
      claimEligible: false,
      walletConnected: false,
      walletAddress: null,
      claimSubmitted: false,
      connectWallet: () => {
        const fakeAddress = Math.random().toString(36).slice(2, 18);
        set({
          walletConnected: true,
          walletAddress: fakeAddress,
        });
      },
      submitClaim: () => {
        const state = get();
        if (!state.walletConnected || state.collectedTokens < 5) return;
        set({
          claimSubmitted: true,
        });
      },
      
      lastLoginDate: null,
      claimDailyLogin: () => {
        const today = new Date().toDateString();
        const state = get();
        if (state.lastLoginDate === today) return false;
        set({ lastLoginDate: today, streak: state.streak + 1 });
        state.addXP(5);
        return true;
      },
    }),
    {
      name: "scamhunter-store",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        isAuthed: state.isAuthed,
        username: state.username,
        xp: state.xp,
        level: state.level,
        capturedTokens: state.capturedTokens,
        scanHistory: state.scanHistory,
        totalScans: state.totalScans,
        totalCaptures: state.totalCaptures,
        accuracy: state.accuracy,
        streak: state.streak,
        lastLoginDate: state.lastLoginDate,
        tokenCounts: state.tokenCounts,
        allowedRewardSymbols: state.allowedRewardSymbols,
        collectedTokens: state.collectedTokens,
        claimEligible: state.claimEligible,
        walletConnected: state.walletConnected,
        walletAddress: state.walletAddress,
        claimSubmitted: state.claimSubmitted,
      }),
    }
  )
);
