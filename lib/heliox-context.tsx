import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export interface ConversationHistory {
  toolId: string;
  toolName: string;
  messages: ChatMessage[];
  lastUpdated: number;
}

interface HelioxContextType {
  favorites: string[];
  toggleFavorite: (toolId: string) => void;
  isFavorite: (toolId: string) => boolean;
  recentTools: string[];
  addRecentTool: (toolId: string) => void;
  conversations: Record<string, ConversationHistory>;
  saveConversation: (toolId: string, toolName: string, messages: ChatMessage[]) => void;
  getConversation: (toolId: string) => ChatMessage[];
  clearConversation: (toolId: string) => void;
}

const HelioxContext = createContext<HelioxContextType | null>(null);

const FAVORITES_KEY = "@heliox_favorites";
const RECENT_KEY = "@heliox_recent";
const CONVERSATIONS_KEY = "@heliox_conversations";

export function HelioxProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recentTools, setRecentTools] = useState<string[]>([]);
  const [conversations, setConversations] = useState<Record<string, ConversationHistory>>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [favs, recent, convs] = await Promise.all([
        AsyncStorage.getItem(FAVORITES_KEY),
        AsyncStorage.getItem(RECENT_KEY),
        AsyncStorage.getItem(CONVERSATIONS_KEY),
      ]);
      if (favs) setFavorites(JSON.parse(favs));
      if (recent) setRecentTools(JSON.parse(recent));
      if (convs) setConversations(JSON.parse(convs));
    } catch (e) {
      console.error("Error loading Heliox data:", e);
    }
  };

  const toggleFavorite = useCallback(async (toolId: string) => {
    setFavorites((prev) => {
      const next = prev.includes(toolId) ? prev.filter((id) => id !== toolId) : [...prev, toolId];
      AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const isFavorite = useCallback((toolId: string) => favorites.includes(toolId), [favorites]);

  const addRecentTool = useCallback(async (toolId: string) => {
    setRecentTools((prev) => {
      const filtered = prev.filter((id) => id !== toolId);
      const next = [toolId, ...filtered].slice(0, 10);
      AsyncStorage.setItem(RECENT_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const saveConversation = useCallback(
    async (toolId: string, toolName: string, messages: ChatMessage[]) => {
      setConversations((prev) => {
        const next = {
          ...prev,
          [toolId]: { toolId, toolName, messages, lastUpdated: Date.now() },
        };
        AsyncStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(next));
        return next;
      });
    },
    []
  );

  const getConversation = useCallback(
    (toolId: string): ChatMessage[] => conversations[toolId]?.messages ?? [],
    [conversations]
  );

  const clearConversation = useCallback(async (toolId: string) => {
    setConversations((prev) => {
      const next = { ...prev };
      delete next[toolId];
      AsyncStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return (
    <HelioxContext.Provider
      value={{
        favorites,
        toggleFavorite,
        isFavorite,
        recentTools,
        addRecentTool,
        conversations,
        saveConversation,
        getConversation,
        clearConversation,
      }}
    >
      {children}
    </HelioxContext.Provider>
  );
}

export function useHeliox() {
  const ctx = useContext(HelioxContext);
  if (!ctx) throw new Error("useHeliox must be used within HelioxProvider");
  return ctx;
}
