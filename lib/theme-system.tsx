import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";

export type ThemeName = "heliox" | "ocean" | "sunset";

export interface ThemeColors {
  primary: string;
  background: string;
  surface: string;
  foreground: string;
  muted: string;
  border: string;
  success: string;
  warning: string;
  error: string;
}

export const THEMES: Record<ThemeName, ThemeColors> = {
  heliox: {
    primary: "#7C3AED",
    background: "#FFFFFF",
    surface: "#F5F5F5",
    foreground: "#11181C",
    muted: "#687076",
    border: "#E5E7EB",
    success: "#22C55E",
    warning: "#F59E0B",
    error: "#EF4444",
  },
  ocean: {
    primary: "#0EA5E9",
    background: "#FFFFFF",
    surface: "#F0F9FF",
    foreground: "#0C2340",
    muted: "#475569",
    border: "#BAE6FD",
    success: "#06B6D4",
    warning: "#F59E0B",
    error: "#EF4444",
  },
  sunset: {
    primary: "#F97316",
    background: "#FFFFFF",
    surface: "#FEF3C7",
    foreground: "#7C2D12",
    muted: "#92400E",
    border: "#FED7AA",
    success: "#EC4899",
    warning: "#F59E0B",
    error: "#DC2626",
  },
};

interface ThemeContextType {
  currentTheme: ThemeName;
  colors: ThemeColors;
  setTheme: (theme: ThemeName) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeSystemProvider({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<ThemeName>("heliox");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const saved = await AsyncStorage.getItem("@heliox_theme");
      if (saved && (saved === "heliox" || saved === "ocean" || saved === "sunset")) {
        setCurrentTheme(saved);
      }
    } catch (error) {
      console.error("Failed to load theme:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const setTheme = async (theme: ThemeName) => {
    try {
      setCurrentTheme(theme);
      await AsyncStorage.setItem("@heliox_theme", theme);
    } catch (error) {
      console.error("Failed to save theme:", error);
    }
  };

  if (isLoading) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ currentTheme, colors: THEMES[currentTheme], setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeSystem() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeSystem must be used within ThemeSystemProvider");
  }
  return context;
}
