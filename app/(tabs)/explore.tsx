import { ScreenContainer } from "@/components/screen-container";
import { ToolCard } from "@/components/tool-card";
import { AI_CATEGORIES, AI_TOOLS, AITool } from "@/constants/ai-tools";
import { useColors } from "@/hooks/use-colors";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function ExploreScreen() {
  const colors = useColors();
  const params = useLocalSearchParams<{ q?: string; cat?: string }>();
  const [searchQuery, setSearchQuery] = useState(params.q || "");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(params.cat || null);

  useEffect(() => {
    if (params.q) setSearchQuery(params.q);
    if (params.cat) setSelectedCategory(params.cat);
  }, [params.q, params.cat]);

  const filteredTools = useMemo(() => {
    let tools = AI_TOOLS;
    if (selectedCategory) {
      tools = tools.filter((t) => t.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      tools = tools.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }
    return tools;
  }, [selectedCategory, searchQuery]);

  return (
    <ScreenContainer containerClassName="bg-background">
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.foreground }]}>🔍 Explorer</Text>
        <Text style={[styles.subtitle, { color: colors.muted }]}>
          {AI_TOOLS.length} outils IA disponibles
        </Text>

        {/* Search */}
        <View style={[styles.searchBar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={{ color: colors.muted, fontSize: 16 }}>🔍</Text>
          <TextInput
            style={[styles.searchInput, { color: colors.foreground }]}
            placeholder="Rechercher..."
            placeholderTextColor={colors.muted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery("")}>
              <Text style={{ color: colors.muted }}>✕</Text>
            </Pressable>
          )}
        </View>

        {/* Category Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
          contentContainerStyle={styles.filterContent}
        >
          <Pressable
            style={[
              styles.filterChip,
              {
                backgroundColor: !selectedCategory ? colors.primary : colors.surface,
                borderColor: !selectedCategory ? colors.primary : colors.border,
              },
            ]}
            onPress={() => setSelectedCategory(null)}
          >
            <Text
              style={[
                styles.filterText,
                { color: !selectedCategory ? "#fff" : colors.foreground },
              ]}
            >
              Tous
            </Text>
          </Pressable>
          {AI_CATEGORIES.map((cat) => (
            <Pressable
              key={cat.id}
              style={[
                styles.filterChip,
                {
                  backgroundColor: selectedCategory === cat.id ? cat.color : colors.surface,
                  borderColor: selectedCategory === cat.id ? cat.color : colors.border,
                },
              ]}
              onPress={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
            >
              <Text style={styles.filterEmoji}>{getCategoryEmoji(cat.id)}</Text>
              <Text
                style={[
                  styles.filterText,
                  { color: selectedCategory === cat.id ? "#fff" : colors.foreground },
                ]}
              >
                {cat.name.split(" ")[0]}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Results */}
      <View style={styles.resultsHeader}>
        <Text style={[styles.resultsCount, { color: colors.muted }]}>
          {filteredTools.length} résultat{filteredTools.length !== 1 ? "s" : ""}
        </Text>
      </View>

      <FlatList
        data={filteredTools}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <ToolCard
            id={item.id}
            name={item.name}
            description={item.description}
            icon={item.icon}
            color={item.color}
            variant="list"
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🔎</Text>
            <Text style={[styles.emptyText, { color: colors.muted }]}>
              Aucun outil trouvé
            </Text>
            <Text style={[styles.emptySubtext, { color: colors.muted }]}>
              Essayez un autre terme de recherche
            </Text>
          </View>
        }
      />
    </ScreenContainer>
  );
}

function getCategoryEmoji(id: string): string {
  const map: Record<string, string> = {
    music: "🎵",
    writing: "✍️",
    gaming: "🎮",
    visual: "🎨",
    productivity: "⚡",
    education: "📚",
    health: "🏃",
    travel: "✈️",
    tech: "💻",
  };
  return map[id] || "🤖";
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 14,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    padding: 0,
  },
  filterScroll: { marginBottom: 4 },
  filterContent: { gap: 8, paddingRight: 20 },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    gap: 4,
  },
  filterEmoji: { fontSize: 14 },
  filterText: { fontSize: 13, fontWeight: "600" },
  resultsHeader: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  resultsCount: { fontSize: 13 },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  empty: {
    alignItems: "center",
    paddingTop: 60,
    gap: 8,
  },
  emptyIcon: { fontSize: 48 },
  emptyText: { fontSize: 18, fontWeight: "700" },
  emptySubtext: { fontSize: 14 },
});
