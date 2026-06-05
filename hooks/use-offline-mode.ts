import { useEffect, useState } from "react";
import { useNetInfo } from "@react-native-community/netinfo";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function useOfflineMode() {
  const netInfo = useNetInfo();
  const [isOffline, setIsOffline] = useState(false);
  const [cachedTools, setCachedTools] = useState<string[]>([]);

  useEffect(() => {
    const isConnected = netInfo.isConnected && netInfo.isInternetReachable;
    setIsOffline(!isConnected);
  }, [netInfo.isConnected, netInfo.isInternetReachable]);

  useEffect(() => {
    loadCachedTools();
  }, []);

  const loadCachedTools = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const offlineKeys = keys.filter((k) => k.startsWith("offline_cache_"));
      const tools = offlineKeys.map((k) => k.replace("offline_cache_", ""));
      setCachedTools(tools);
    } catch (error) {
      console.error("Failed to load cached tools:", error);
    }
  };

  const cacheToolResponse = async (toolId: string, response: string) => {
    try {
      const key = `offline_cache_${toolId}`;
      const data = {
        response,
        timestamp: new Date().toISOString(),
      };
      await AsyncStorage.setItem(key, JSON.stringify(data));
      await loadCachedTools();
    } catch (error) {
      console.error("Failed to cache tool response:", error);
    }
  };

  const getCachedToolResponse = async (toolId: string) => {
    try {
      const key = `offline_cache_${toolId}`;
      const data = await AsyncStorage.getItem(key);
      if (!data) return null;

      const parsed = JSON.parse(data);
      return parsed.response;
    } catch (error) {
      console.error("Failed to get cached tool response:", error);
      return null;
    }
  };

  const clearCache = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const offlineKeys = keys.filter((k) => k.startsWith("offline_cache_"));
      await AsyncStorage.multiRemove(offlineKeys);
      setCachedTools([]);
    } catch (error) {
      console.error("Failed to clear cache:", error);
    }
  };

  return {
    isOffline,
    cachedTools,
    cacheToolResponse,
    getCachedToolResponse,
    clearCache,
  };
}
