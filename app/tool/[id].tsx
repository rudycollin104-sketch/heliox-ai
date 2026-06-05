import { ShareMenu } from "@/components/share-menu";
import { StreamingResponse } from "@/components/streaming-response";
import { ScreenContainer } from "@/components/screen-container";
import { getToolById } from "@/constants/ai-tools";
import { useColors } from "@/hooks/use-colors";
import { ChatMessage, useHeliox } from "@/lib/heliox-context";
import { trpc } from "@/lib/trpc";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function ToolScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const tool = getToolById(id);
  const { isFavorite, toggleFavorite, addRecentTool, saveConversation, getConversation, clearConversation } = useHeliox();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const chatMutation = trpc.ai.chat.useMutation();

  useEffect(() => {
    if (tool) {
      addRecentTool(tool.id);
      const saved = getConversation(tool.id);
      if (saved.length > 0) {
        setMessages(saved);
      }
    }
  }, [tool?.id]);

  useEffect(() => {
    if (tool) {
      saveConversation(tool.id, tool.name, messages);
    }
  }, [messages]);

  if (!tool) {
    return (
      <ScreenContainer>
        <View style={styles.notFound}>
          <Text style={[styles.notFoundText, { color: colors.foreground }]}>Outil introuvable</Text>
          <Pressable onPress={() => router.back()}>
            <Text style={{ color: colors.primary }}>Retour</Text>
          </Pressable>
        </View>
      </ScreenContainer>
    );
  }

  const favorite = isFavorite(tool.id);

  const handleSend = async () => {
    const text = inputText.trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: Date.now(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputText("");
    setIsLoading(true);
    setIsStreaming(true);

    try {
      const result = await chatMutation.mutateAsync({
        toolId: tool.id,
        systemPrompt: tool.systemPrompt,
        messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
      });

      if (result && result.content) {
        const content = result.content;
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: content,
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error("Chat error:", error);
      Alert.alert("Erreur", "Impossible de contacter l'IA. Réessayez.");
    } finally {
      setIsStreaming(false);
      setStreamingContent("");
      setIsLoading(false);
    }

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleClearHistory = () => {
    Alert.alert("Effacer l'historique", "Êtes-vous sûr ?", [
      { text: "Annuler", onPress: () => {} },
      {
        text: "Effacer",
        onPress: () => {
          clearConversation(tool.id);
          setMessages([]);
        },
      },
    ]);
  };

  return (
    <ScreenContainer containerClassName="bg-background">
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          <Pressable onPress={() => router.back()} style={({ pressed }) => pressed && { opacity: 0.6 }}>
            <Text style={[styles.backBtn, { color: colors.primary }]}>← Retour</Text>
          </Pressable>
          <View style={styles.titleContainer}>
            <Text style={[styles.title, { color: colors.foreground }]}>{tool.name}</Text>
            <Text style={[styles.subtitle, { color: colors.muted }]}>{tool.category}</Text>
          </View>
          <View style={styles.actions}>
            <Pressable
              onPress={() => toggleFavorite(tool.id)}
              style={({ pressed }) => pressed && { opacity: 0.6 }}
            >
              <Text style={styles.favoriteBtn}>{favorite ? "❤️" : "🤍"}</Text>
            </Pressable>
            <Pressable onPress={() => setShowShareMenu(true)} style={({ pressed }) => pressed && { opacity: 0.6 }}>
              <Text style={styles.shareBtn}>📤</Text>
            </Pressable>
          </View>
        </View>

        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View
              style={[
                styles.messageBubble,
                item.role === "user"
                  ? { alignSelf: "flex-end", backgroundColor: colors.primary }
                  : { alignSelf: "flex-start", backgroundColor: colors.surface },
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  { color: item.role === "user" ? "#fff" : colors.foreground },
                ]}
              >
                {item.content}
              </Text>
            </View>
          )}
          contentContainerStyle={styles.messagesList}
          scrollEnabled={true}
          ListFooterComponent={
            isStreaming ? (
              <View style={styles.streamingContainer}>
                <View style={[styles.messageBubble, { backgroundColor: colors.surface, alignSelf: "flex-start" }]}>
                  <Text style={[styles.messageText, { color: colors.foreground }]}>{streamingContent}</Text>
                  <ActivityIndicator size="small" color={colors.primary} style={styles.loadingIndicator} />
                </View>
              </View>
            ) : null
          }
        />

        {/* Input */}
        <View style={[styles.inputContainer, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.surface,
                color: colors.foreground,
                borderColor: colors.border,
              },
            ]}
            placeholder="Écrivez votre message..."
            placeholderTextColor={colors.muted}
            value={inputText}
            onChangeText={setInputText}
            multiline
            editable={!isLoading}
          />
          <Pressable
            onPress={handleSend}
            disabled={isLoading || !inputText.trim()}
            style={({ pressed }) => [
              styles.sendBtn,
              { backgroundColor: colors.primary },
              (pressed || isLoading) && { opacity: 0.7 },
            ]}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.sendBtnText}>Envoyer</Text>
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>

      <ShareMenu
        visible={showShareMenu}
        onClose={() => setShowShareMenu(false)}
        conversationTitle={`${tool.name} - ${new Date().toLocaleDateString()}`}
        conversationText={messages.map((m) => `${m.role === 'user' ? 'Vous' : 'IA'}: ${m.content}`).join('\n\n')}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    gap: 12,
  },
  backBtn: {
    fontSize: 16,
    fontWeight: "600",
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 12,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  favoriteBtn: {
    fontSize: 20,
  },
  shareBtn: {
    fontSize: 20,
  },
  messagesList: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  messageBubble: {
    maxWidth: "85%",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  streamingContainer: {
    marginTop: 8,
  },
  loadingIndicator: {
    marginTop: 8,
  },
  inputContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    gap: 8,
    alignItems: "flex-end",
  },
  input: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    maxHeight: 100,
    fontSize: 14,
  },
  sendBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 70,
  },
  sendBtnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  notFound: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  notFoundText: {
    fontSize: 18,
    fontWeight: "700",
  },
});
