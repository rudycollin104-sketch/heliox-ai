import React from "react";
import { View, Text, Pressable, Share } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ChatMessage } from "@/lib/heliox-context";

interface ShareConversationPreviewProps {
  messages: ChatMessage[];
  toolName: string;
  onClose: () => void;
}

export function ShareConversationPreview({ messages, toolName, onClose }: ShareConversationPreviewProps) {
  const generatePreviewText = () => {
    const preview = messages
      .slice(-5)
      .map((m) => `${m.role === "user" ? "👤" : "🤖"} ${m.content}`)
      .join("\n\n");

    return `Conversation Heliox AI - ${toolName}\n\n${preview}\n\n💬 Partagé depuis Heliox AI`;
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: generatePreviewText(),
        title: `Conversation ${toolName} - Heliox AI`,
        url: "https://heliox-ai.app", // À remplacer par l'URL réelle
      });
    } catch (error) {
      console.error("Share error:", error);
    }
  };

  return (
    <View className="absolute inset-0 bg-black/50 justify-center items-center p-4">
      <LinearGradient
        colors={["rgba(30, 41, 59, 0.95)", "rgba(15, 23, 42, 0.95)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="w-full max-w-md rounded-2xl border border-cyan-500/30 overflow-hidden"
      >
        {/* Header */}
        <View className="px-6 py-4 border-b border-purple-500/20">
          <Text className="text-lg font-bold text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text">
            Partager la conversation
          </Text>
        </View>

        {/* Preview */}
        <View className="px-6 py-4 max-h-64">
          <Text className="text-sm text-purple-300/60 mb-3">Aperçu :</Text>
          <View className="bg-slate-900/50 rounded-lg p-3 border border-purple-500/20">
            {messages.slice(-3).map((msg, idx) => (
              <View key={idx} className="mb-2">
                <Text className="text-xs text-cyan-400 font-semibold">
                  {msg.role === "user" ? "Vous" : "Heliox AI"}
                </Text>
                <Text className="text-sm text-purple-100 line-clamp-2">{msg.content}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Actions */}
        <View className="flex-row gap-3 px-6 py-4 border-t border-purple-500/20">
          <Pressable
            onPress={onClose}
            className="flex-1 py-3 rounded-lg border border-purple-500/30 active:bg-purple-500/10"
          >
            <Text className="text-center text-purple-200 font-semibold">Annuler</Text>
          </Pressable>

          <LinearGradient
            colors={["#06b6d4", "#8b5cf6"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="flex-1 rounded-lg overflow-hidden"
          >
            <Pressable onPress={handleShare} className="py-3 active:opacity-80">
              <Text className="text-center text-white font-semibold">Partager</Text>
            </Pressable>
          </LinearGradient>
        </View>
      </LinearGradient>
    </View>
  );
}
