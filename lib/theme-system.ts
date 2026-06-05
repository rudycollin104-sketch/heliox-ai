import { create } from "zustand";
import { persist, StorageValue } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type ThemeMode = "dark" | "light";

interface ThemeStore {
  mode: ThemeMode;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      mode: "dark",
      toggleTheme: () => set((state) => ({ mode: state.mode === "dark" ? "light" : "dark" })),
      setTheme: (mode: ThemeMode) => set({ mode }),
    }),
    {
      name: "theme-store",
      storage: {
        getItem: async (name: string) => {
          const item = await AsyncStorage.getItem(name);
          return item ? JSON.parse(item) : null;
        },
        setItem: async (name: string, value: StorageValue<ThemeStore>) => {
          await AsyncStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: async (name: string) => {
          await AsyncStorage.removeItem(name);
        },
      },
    }
  )
);

export const THEME_COLORS = {
  dark: {
    background: "#0f172a",
    surface: "#1e293b",
    foreground: "#f1f5f9",
    muted: "#94a3b8",
    border: "#334155",
    primary: "#06b6d4",
    secondary: "#8b5cf6",
  },
  light: {
    background: "#f8fafc",
    surface: "#ffffff",
    foreground: "#0f172a",
    muted: "#64748b",
    border: "#e2e8f0",
    primary: "#0891b2",
    secondary: "#7c3aed",
  },
};

export function getThemeColors(mode: ThemeMode) {
  return THEME_COLORS[mode];
}
