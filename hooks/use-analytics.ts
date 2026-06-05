import { useEffect, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface ToolUsage {
  toolId: string;
  startTime: number;
  endTime?: number;
}

export function useAnalytics() {
  const currentToolRef = useRef<ToolUsage | null>(null);

  useEffect(() => {
    return () => {
      // Cleanup: save any ongoing tool usage
      if (currentToolRef.current && !currentToolRef.current.endTime) {
        saveToolUsage();
      }
    };
  }, []);

  const startToolUsage = (toolId: string) => {
    currentToolRef.current = {
      toolId,
      startTime: Date.now(),
    };
  };

  const endToolUsage = async () => {
    if (!currentToolRef.current) return;

    currentToolRef.current.endTime = Date.now();
    await saveToolUsage();
    currentToolRef.current = null;
  };

  const saveToolUsage = async () => {
    if (!currentToolRef.current) return;

    const { toolId, startTime, endTime } = currentToolRef.current;
    const timeSpent = Math.round((endTime || Date.now() - startTime) / 1000); // en secondes

    try {
      const key = `analytics_${toolId}`;
      const existing = await AsyncStorage.getItem(key);
      const data = existing ? JSON.parse(existing) : { usageCount: 0, totalTimeSpent: 0 };

      data.usageCount += 1;
      data.totalTimeSpent += timeSpent;
      data.lastUsed = new Date().toISOString();

      await AsyncStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error("Failed to save analytics:", error);
    }
  };

  const getToolStats = async (toolId: string) => {
    try {
      const key = `analytics_${toolId}`;
      const data = await AsyncStorage.getItem(key);
      return data ? JSON.parse(data) : { usageCount: 0, totalTimeSpent: 0, lastUsed: null };
    } catch (error) {
      console.error("Failed to get tool stats:", error);
      return { usageCount: 0, totalTimeSpent: 0, lastUsed: null };
    }
  };

  const getAllStats = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const analyticsKeys = keys.filter((k) => k.startsWith("analytics_"));
      const stats: Record<string, any> = {};

      for (const key of analyticsKeys) {
        const toolId = key.replace("analytics_", "");
        const data = await AsyncStorage.getItem(key);
        if (data) stats[toolId] = JSON.parse(data);
      }

      return stats;
    } catch (error) {
      console.error("Failed to get all stats:", error);
      return {};
    }
  };

  return {
    startToolUsage,
    endToolUsage,
    getToolStats,
    getAllStats,
  };
}
