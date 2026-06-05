import React, { useRef, useEffect, useState } from "react";
import { View, Text, ScrollView, TextInput, Pressable, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInUp, FadeInDown, useSharedValue, withSpring } from "react-native-reanimated";
import { AdvancedMediaInput } from "./advanced-media-input";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface FuturisticChatProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
}

export function FuturisticChat({ messages, isLoading, onSendMessage }: FuturisticChatProps) {
  const [inputValue, setInputValue] = useState("");
  const [showMediaInput, setShowMediaInput] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const messageScale = useSharedValue(0.95);

  const handleImageSelected = (uri: string) => {
    const message = `[Image: ${uri}]`;
    onSendMessage(message);
  };

  const handleLinkAdded = (url: string) => {
    const message = `[Lien: ${url}]`;
    onSendMessage(message);
  };

  useEffect(() => {
    messageScale.value = withSpring(1);
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const handleSend = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue("");
    }
  };

  return (
    <View className="flex-1 bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950">
      {/* Animated background grid */}
      <View className="absolute inset-0 opacity-10">
        <View className="flex-1 border-l border-cyan-500/20" />
        <View className="flex-1 border-r border-purple-500/20" />
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        className="flex-1 px-4 py-6"
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {messages.length === 0 && (
          <Animated.View entering={FadeInUp.delay(200)} className="flex-1 justify-center items-center py-12">
            <View className="items-center gap-4">
              <View className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 opacity-20 justify-center items-center">
                <Text className="text-4xl">✨</Text>
              </View>
              <Text className="text-lg font-bold text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text">
                Commencez une conversation
              </Text>
              <Text className="text-sm text-purple-300/60 text-center max-w-xs">
                Posez une question à l'IA et regardez la magie opérer
              </Text>
            </View>
          </Animated.View>
        )}

        {messages.map((message, index) => (
          <Animated.View
            key={message.id}
            entering={FadeInUp.delay(index * 50)}
            className={cn("mb-4", message.role === "user" ? "items-end" : "items-start")}
          >
            {message.role === "assistant" && (
              <View className="flex-row items-center gap-2 mb-2">
                <View className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 justify-center items-center">
                  <Text className="text-xs font-bold text-white">AI</Text>
                </View>
                <Text className="text-xs text-purple-300/60">Heliox AI</Text>
              </View>
            )}

            <LinearGradient
              colors={
                message.role === "user"
                  ? ["rgba(139, 92, 246, 0.3)", "rgba(59, 130, 246, 0.2)"]
                  : ["rgba(34, 197, 94, 0.1)", "rgba(59, 130, 246, 0.1)"]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className={cn(
                "rounded-2xl px-4 py-3 max-w-xs border",
                message.role === "user"
                  ? "border-purple-500/40 bg-purple-900/20 rounded-br-none"
                  : "border-cyan-500/40 bg-cyan-900/10 rounded-bl-none"
              )}
            >
              <Text
                className={cn(
                  "text-base leading-6",
                  message.role === "user" ? "text-purple-100" : "text-cyan-100"
                )}
              >
                {message.content}
              </Text>
            </LinearGradient>

            <Text className="text-xs text-purple-300/40 mt-1">
              {message.timestamp.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
            </Text>
          </Animated.View>
        ))}

        {isLoading && (
          <Animated.View entering={FadeInUp} className="items-start mb-4">
            <View className="flex-row items-center gap-2 mb-2">
              <View className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 justify-center items-center">
                <Text className="text-xs font-bold text-white">AI</Text>
              </View>
              <Text className="text-xs text-purple-300/60">Heliox AI</Text>
            </View>

            <LinearGradient
              colors={["rgba(34, 197, 94, 0.1)", "rgba(59, 130, 246, 0.1)"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="rounded-2xl rounded-bl-none px-4 py-3 border border-cyan-500/40 bg-cyan-900/10"
            >
              <View className="flex-row gap-1">
                <View className="w-2 h-2 rounded-full bg-cyan-400 opacity-70" />
                <View className="w-2 h-2 rounded-full bg-cyan-400 opacity-50" />
                <View className="w-2 h-2 rounded-full bg-cyan-400 opacity-30" />
              </View>
            </LinearGradient>
          </Animated.View>
        )}
      </ScrollView>

      {/* Input area */}
      <LinearGradient
        colors={["rgba(15, 23, 42, 0)", "rgba(15, 23, 42, 0.8)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        className="px-4 py-4 border-t border-purple-500/20"
      >
        <View className="flex-row gap-3 items-center">
          <Pressable
            onPress={() => setShowMediaInput(true)}
            className="p-2 active:opacity-60"
          >
            <Text className="text-2xl">📎</Text>
          </Pressable>
          <LinearGradient
            colors={["rgba(139, 92, 246, 0.2)", "rgba(59, 130, 246, 0.1)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="flex-1 rounded-full border border-purple-500/30 overflow-hidden"
          >
            <TextInput
              value={inputValue}
              onChangeText={setInputValue}
              placeholder="Écrivez votre message..."
              placeholderTextColor="rgba(139, 92, 246, 0.4)"
              className="px-4 py-3 text-purple-100"
              multiline
              maxLength={500}
            />
          </LinearGradient>

          <Pressable
            onPress={handleSend}
            disabled={isLoading || !inputValue.trim()}
            style={({ pressed }) => [
              {
                opacity: pressed ? 0.8 : 1,
                transform: [{ scale: pressed ? 0.95 : 1 }],
              },
            ]}
          >
            <LinearGradient
              colors={["#06b6d4", "#8b5cf6"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="w-12 h-12 rounded-full justify-center items-center"
            >
              {isLoading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text className="text-xl">→</Text>
              )}
            </LinearGradient>
          </Pressable>
        </View>
      </LinearGradient>

      <AdvancedMediaInput
        visible={showMediaInput}
        onClose={() => setShowMediaInput(false)}
        onImageSelected={handleImageSelected}
        onDocumentSelected={(uri, name, type) => console.log("Document:", name, type)}
        onLinkAdded={handleLinkAdded}
      />
    </View>
  );
}
