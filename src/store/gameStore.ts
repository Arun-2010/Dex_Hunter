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
      signOut: () => set({ isAuthed: false }),

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
        set({
          capturedTokens: [token, ...state.capturedTokens],
          totalCaptures: state.totalCaptures + 1,
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
      }),
    }
  )
);
