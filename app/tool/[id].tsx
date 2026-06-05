import { FuturisticChat } from "@/components/futuristic-chat";
import { ShareMenu } from "@/components/share-menu";
import { getToolById } from "@/constants/ai-tools";
import { ChatMessage, useHeliox } from "@/lib/heliox-context";
import { trpc } from "@/lib/trpc";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function ToolScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const tool = getToolById(id);
  const { isFavorite, toggleFavorite, addRecentTool, saveConversation, getConversation, clearConversation } = useHeliox();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [favorite, setFavorite] = useState(false);

  const chatMutation = trpc.ai.chat.useMutation();

  useEffect(() => {
    if (tool) {
      addRecentTool(tool.id);
      const saved = getConversation(tool.id);
      if (saved.length > 0) {
        setMessages(saved);
      }
      setFavorite(isFavorite(tool.id));
    }
  }, [tool?.id]);

  const handleSend = async (text: string) => {
    if (!text.trim() || !tool) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: Date.now(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const result = await chatMutation.mutateAsync({
        toolId: tool.id,
        systemPrompt: tool.systemPrompt,
        messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
      });

      if (result && result.content) {
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: result.content,
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
        if (tool) {
          saveConversation(tool.id, tool.name, [...newMessages, assistantMessage]);
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      Alert.alert("Erreur", "Impossible de contacter l'IA. Réessayez.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    Alert.alert("Effacer l'historique", "Êtes-vous sûr ?", [
      { text: "Annuler", onPress: () => {} },
      {
        text: "Effacer",
        onPress: () => {
          if (tool) {
            clearConversation(tool.id);
            setMessages([]);
          }
        },
      },
    ]);
  };

  if (!tool) {
    return (
      <View className="flex-1 justify-center items-center bg-slate-950">
        <Text className="text-white">Outil non trouvé</Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
      {/* Header futuriste */}
      <LinearGradient
        colors={["rgba(15, 23, 42, 0.95)", "rgba(88, 28, 135, 0.3)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="flex-row items-center justify-between px-4 py-4 border-b border-purple-500/20"
      >
        <View className="flex-row items-center gap-3 flex-1">
          <Pressable onPress={() => router.back()} className="p-2 active:opacity-60">
            <Text className="text-2xl text-cyan-400">←</Text>
          </Pressable>
          <View className="flex-1">
            <Text className="text-lg font-bold text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text">
              {tool.name}
            </Text>
            <Text className="text-xs text-purple-300/60">{tool.category}</Text>
          </View>
        </View>

        <View className="flex-row gap-2">
          <Pressable
            onPress={() => {
              toggleFavorite(tool.id);
              setFavorite(!favorite);
            }}
            className="p-2 active:opacity-60"
          >
            <Text className="text-xl">{favorite ? "❤️" : "🤍"}</Text>
          </Pressable>
          <Pressable onPress={() => setShowShareMenu(!showShareMenu)} className="p-2 active:opacity-60">
            <Text className="text-xl text-cyan-400">⋮</Text>
          </Pressable>
        </View>
      </LinearGradient>

      {/* Chat futuriste */}
      <FuturisticChat
        messages={messages.map((msg) => ({
          id: msg.id,
          role: msg.role,
          content: msg.content,
          timestamp: new Date(msg.timestamp),
        }))}
        isLoading={isLoading}
        onSendMessage={handleSend}
      />

      {/* Share menu */}
      {showShareMenu && (
        <View className="absolute bottom-0 right-0 bg-slate-900 border border-purple-500/30 rounded-lg m-4 overflow-hidden">
          <Pressable
            onPress={() => {
              handleClearHistory();
              setShowShareMenu(false);
            }}
            className="px-4 py-3 border-b border-purple-500/20 active:bg-purple-500/20"
          >
            <Text className="text-purple-200">Effacer l'historique</Text>
          </Pressable>
          <Pressable onPress={() => setShowShareMenu(false)} className="px-4 py-3 active:bg-purple-500/20">
            <Text className="text-purple-200">Fermer</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
