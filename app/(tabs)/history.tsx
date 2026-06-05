import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useHeliox } from "@/lib/heliox-context";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { AI_TOOLS } from "@/constants/ai-tools";

export default function HistoryScreen() {
  const colors = useColors();
  const { conversations: helioxConversations } = useHeliox();
  const [searchText, setSearchText] = useState("");
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [isLoading] = useState(false);
  const [conversations, setConversations] = useState<any[]>([]);

  useEffect(() => {
    const convArray = Object.entries(helioxConversations).map(([toolId, messages]: [string, any]) => {
      const messageArray = Array.isArray(messages) ? messages : [];
      const tool = AI_TOOLS.find(t => t.id === toolId);
      return {
        id: toolId,
        toolId,
        toolName: tool?.name || toolId,
        title: tool?.name || toolId,
        messages: messageArray,
        messageCount: messageArray.length,
        lastMessage: messageArray[messageArray.length - 1]?.content || "",
        timestamp: new Date().toISOString(),
        updatedAt: new Date(),
      };
    });
    setConversations(convArray);
  }, [helioxConversations]);

  const filteredConversations = conversations.filter((conv) => {
    const matchesSearch = conv.title.toLowerCase().includes(searchText.toLowerCase());
    const matchesTool = !selectedTool || conv.toolId === selectedTool;
    return matchesSearch && matchesTool;
  });

  return (
    <ScreenContainer containerClassName="bg-background">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.background }]}>
          <Text style={[styles.title, { color: colors.foreground }]}>📚 Historique</Text>
        </View>

        {/* Search Bar */}
        <View style={[styles.searchContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={[styles.searchInput, { color: colors.foreground }]}
            placeholder="Rechercher une conversation..."
            placeholderTextColor={colors.muted}
            value={searchText}
            onChangeText={setSearchText}
          />
          {searchText && (
            <Pressable onPress={() => setSearchText("")}>
              <Text style={styles.clearIcon}>✕</Text>
            </Pressable>
          )}
        </View>

        {/* Tool Filters */}
        <View style={styles.filtersContainer}>
          <Text style={[styles.filterLabel, { color: colors.foreground }]}>Filtrer par outil :</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
            <Pressable
              style={({ pressed }) => [
                styles.filterChip,
                !selectedTool && { backgroundColor: colors.primary },
                selectedTool && { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 },
                pressed && { opacity: 0.7 },
              ]}
              onPress={() => setSelectedTool(null)}
            >
              <Text style={[styles.filterChipText, { color: !selectedTool ? "#fff" : colors.foreground }]}>
                Tous
              </Text>
            </Pressable>

            {AI_TOOLS.map((tool: any) => (
              <Pressable
                key={tool.id}
                style={({ pressed }) => [
                  styles.filterChip,
                  selectedTool === tool.id && { backgroundColor: colors.primary },
                  selectedTool !== tool.id && { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 },
                  pressed && { opacity: 0.7 },
                ]}
                onPress={() => setSelectedTool(tool.id)}
              >
                <Text style={[styles.filterChipText, { color: selectedTool === tool.id ? "#fff" : colors.foreground }]}>
                  {tool.icon} {tool.name}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Conversations List */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : filteredConversations.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>Aucune conversation</Text>
            <Text style={[styles.emptyDesc, { color: colors.muted }]}>
              Commencez une conversation pour la voir ici
            </Text>
          </View>
        ) : (
          <FlatList
            scrollEnabled={false}
            data={filteredConversations}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <Pressable
                style={({ pressed }) => [
                  styles.conversationCard,
                  { backgroundColor: colors.surface, borderColor: colors.border },
                  pressed && { opacity: 0.7 },
                ]}
                onPress={() => router.push(`/tool/${item.toolId}`)}
              >
                <View style={styles.cardContent}>
                  <Text style={[styles.cardTitle, { color: colors.foreground }]} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={[styles.cardMeta, { color: colors.muted }]}>
                    {item.toolName} • {item.messageCount} messages
                  </Text>
                  <Text style={[styles.cardDate, { color: colors.muted }]}>
                    {new Date(item.updatedAt).toLocaleDateString("fr-FR")}
                  </Text>
                </View>
                <Text style={styles.cardArrow}>→</Text>
              </Pressable>
            )}
            contentContainerStyle={styles.listContainer}
          />
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
  },
  searchContainer: {
    marginHorizontal: 20,
    marginVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  searchIcon: {
    fontSize: 18,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 15,
  },
  clearIcon: {
    fontSize: 18,
    fontWeight: "bold",
  },
  filtersContainer: {
    paddingHorizontal: 20,
    marginVertical: 12,
    gap: 8,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
  filterScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: "600",
  },
  loadingContainer: {
    height: 200,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyContainer: {
    height: 300,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  emptyIcon: {
    fontSize: 64,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  emptyDesc: {
    fontSize: 14,
    textAlign: "center",
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 12,
  },
  conversationCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  cardContent: {
    flex: 1,
    gap: 4,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
  },
  cardMeta: {
    fontSize: 12,
  },
  cardDate: {
    fontSize: 11,
  },
  cardArrow: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
