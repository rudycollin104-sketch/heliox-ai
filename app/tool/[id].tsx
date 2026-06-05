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

  const chatMutation = trpc.ai.chat.useMutation({
    onSuccess: (data) => {
      setStreamingContent(data.content || "");
      setIsStreaming(false);
    },
    onError: (error) => {
      Alert.alert("Erreur", "Impossible de générer la réponse");
      setIsStreaming(false);
    },
  });

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
    if (messages.length > 0 && tool) {
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

    try {
      setIsStreaming(true);
      setStreamingContent("");

      const result = await chatMutation.mutateAsync({
        toolId: tool.id,
        systemPrompt: tool.systemPrompt,
        messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
      });

      const content = result.content;
      setStreamingContent(content);
      
      setTimeout(() => {
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: content,
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
        setIsStreaming(false);
        setStreamingContent("");
      }, Math.min(content.length * 8, 2000));
    } catch (error) {
      Alert.alert("Erreur", "Impossible de contacter l'IA. Réessayez.");
      setIsStreaming(false);
    } finally {
      setIsLoading(false);
    }

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleSuggestion = (suggestion: string) => {
    setInputText(suggestion);
  };

  const handleClear = () => {
    Alert.alert("Nouvelle conversation", "Voulez-vous effacer cette conversation ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Effacer",
        style: "destructive",
        onPress: () => {
          setMessages([]);
          clearConversation(tool.id);
        },
      },
    ]);
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isUser = item.role === "user";
    return (
      <View style={[styles.messageRow, isUser && styles.messageRowUser]}>
        {!isUser && (
          <View style={[styles.avatar, { backgroundColor: tool.color + "30" }]}>
            <Text style={styles.avatarEmoji}>{tool.icon}</Text>
          </View>
        )}
        <View
          style={[
            styles.messageBubble,
            isUser
              ? [styles.userBubble, { backgroundColor: colors.primary }]
              : [styles.aiBubble, { backgroundColor: colors.surface, borderColor: colors.border }],
          ]}
        >
          <Text
            style={[
              styles.messageText,
              { color: isUser ? "#fff" : colors.foreground },
            ]}
          >
            {item.content}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <ScreenContainer containerClassName="bg-background" edges={["top", "left", "right"]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <Pressable
          style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.6 }]}
          onPress={() => router.back()}
        >
          <Text style={[styles.backIcon, { color: colors.primary }]}>←</Text>
        </Pressable>

        <View style={[styles.toolInfo]}>
          <View style={[styles.toolIconSmall, { backgroundColor: tool.color + "20" }]}>
            <Text style={styles.toolIconEmoji}>{tool.icon}</Text>
          </View>
          <View style={styles.toolTitleContainer}>
            <Text style={[styles.toolName, { color: colors.foreground }]} numberOfLines={1}>
              {tool.name}
            </Text>
            <Text style={[styles.toolCategory, { color: colors.muted }]} numberOfLines={1}>
              {tool.description}
            </Text>
          </View>
        </View>

        <View style={styles.headerActions}>
          <Pressable
            style={({ pressed }) => [styles.headerBtn, pressed && { opacity: 0.6 }]}
            onPress={() => toggleFavorite(tool.id)}
          >
            <Text style={styles.headerBtnIcon}>{favorite ? "❤️" : "🤍"}</Text>
          </Pressable>
          {messages.length > 0 && (
            <>
              <Pressable
                style={({ pressed }) => [styles.headerBtn, pressed && { opacity: 0.6 }]}
                onPress={() => setShowShareMenu(true)}
              >
                <Text style={styles.headerBtnIcon}>🔗</Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [styles.headerBtn, pressed && { opacity: 0.6 }]}
                onPress={handleClear}
              >
                <Text style={styles.headerBtnIcon}>🗑️</Text>
              </Pressable>
            </>
          )}
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
      >
        {/* Messages */}
        {messages.length === 0 ? (
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={styles.emptyContainer}
            showsVerticalScrollIndicator={false}
          >
            {/* Welcome */}
            <View style={[styles.welcomeCard, { backgroundColor: tool.color + "15", borderColor: tool.color + "30" }]}>
              <Text style={styles.welcomeIcon}>{tool.icon}</Text>
              <Text style={[styles.welcomeTitle, { color: colors.foreground }]}>{tool.name}</Text>
              <Text style={[styles.welcomeDesc, { color: colors.muted }]}>{tool.description}</Text>
            </View>

            {/* Suggestions */}
            <Text style={[styles.suggestionsTitle, { color: colors.muted }]}>
              💡 Suggestions pour commencer
            </Text>
            {tool.suggestions.map((suggestion, index) => (
              <Pressable
                key={index}
                style={({ pressed }) => [
                  styles.suggestionChip,
                  { backgroundColor: colors.surface, borderColor: colors.border },
                  pressed && { opacity: 0.7, transform: [{ scale: 0.98 }] },
                ]}
                onPress={() => handleSuggestion(suggestion)}
              >
                <Text style={[styles.suggestionText, { color: colors.foreground }]}>
                  {suggestion}
                </Text>
                <Text style={{ color: colors.primary, fontSize: 16 }}>→</Text>
              </Pressable>
            ))}
          </ScrollView>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={renderMessage}
            contentContainerStyle={styles.messagesList}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
            ListFooterComponent={
              isLoading || isStreaming ? (
                <View style={styles.loadingRow}>
                  <View style={[styles.avatar, { backgroundColor: tool.color + "30" }]}>
                    <Text style={styles.avatarEmoji}>{tool.icon}</Text>
                  </View>
                  <View style={[styles.messageBubble, styles.aiBubble, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    {isStreaming && streamingContent ? (
                      <StreamingResponse content={streamingContent} isStreaming={true} color={colors.foreground} />
                    ) : (
                      <>
                        <ActivityIndicator size="small" color={tool.color} />
                        <Text style={[styles.loadingText, { color: colors.muted }]}>En train de réfléchir...</Text>
                      </>
                    )}
                  </View>
                </View>
              ) : null
            }
          />
        )}

        {/* Input */}
        <View style={[styles.inputContainer, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
          <View style={[styles.inputRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <TextInput
              style={[styles.textInput, { color: colors.foreground }]}
              placeholder={tool.placeholder}
              placeholderTextColor={colors.muted}
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={2000}
              returnKeyType="default"
            />
            <Pressable
              style={({ pressed }) => [
                styles.sendBtn,
                { backgroundColor: inputText.trim() && !isLoading ? colors.primary : colors.border },
                pressed && { opacity: 0.8 },
              ]}
              onPress={handleSend}
              disabled={!inputText.trim() || isLoading}
            >
              <Text style={styles.sendIcon}>↑</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>

      <ShareMenu
        visible={showShareMenu}
        onClose={() => setShowShareMenu(false)}
        conversationTitle={tool?.name || "Conversation"}
        conversationText={messages.map((m) => `${m.role === "user" ? "Vous" : tool?.name || "IA"}: ${m.content}`).join("\n\n")}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  notFound: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  notFoundText: { fontSize: 18, fontWeight: "700" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    gap: 10,
  },
  backBtn: { padding: 4 },
  backIcon: { fontSize: 24, fontWeight: "600" },
  toolInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  toolIconSmall: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  toolIconEmoji: { fontSize: 20 },
  toolTitleContainer: { flex: 1 },
  toolName: { fontSize: 15, fontWeight: "700" },
  toolCategory: { fontSize: 11, marginTop: 1 },
  headerActions: { flexDirection: "row", gap: 4 },
  headerBtn: { padding: 6 },
  headerBtnIcon: { fontSize: 20 },
  emptyContainer: {
    padding: 20,
    paddingBottom: 40,
    gap: 12,
  },
  welcomeCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 24,
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  welcomeIcon: { fontSize: 48 },
  welcomeTitle: { fontSize: 20, fontWeight: "800", textAlign: "center" },
  welcomeDesc: { fontSize: 14, textAlign: "center", lineHeight: 20 },
  suggestionsTitle: { fontSize: 13, fontWeight: "600", marginBottom: 4 },
  suggestionChip: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 8,
  },
  suggestionText: { flex: 1, fontSize: 14, lineHeight: 20 },
  messagesList: {
    padding: 16,
    paddingBottom: 8,
    gap: 12,
  },
  messageRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    marginBottom: 12,
  },
  messageRowUser: {
    flexDirection: "row-reverse",
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  avatarEmoji: { fontSize: 18 },
  messageBubble: {
    maxWidth: "78%",
    padding: 12,
    borderRadius: 16,
  },
  userBubble: {
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    borderWidth: 1,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  loadingRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    marginBottom: 12,
  },
  loadingBubble: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    gap: 8,
  },
  loadingText: { fontSize: 14 },
  inputContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 0.5,
    paddingBottom: 20,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    borderRadius: 20,
    borderWidth: 1,
    paddingLeft: 16,
    paddingRight: 6,
    paddingVertical: 6,
    gap: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    maxHeight: 120,
    paddingVertical: 6,
    lineHeight: 22,
  },
  sendBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  sendIcon: { color: "#fff", fontSize: 18, fontWeight: "700" },
});
