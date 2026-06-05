import { OnboardingModal } from "@/components/onboarding-modal";
import { ScreenContainer } from "@/components/screen-container";
import { ToolCard } from "@/components/tool-card";
import { AI_CATEGORIES, AI_TOOLS, FEATURED_TOOLS } from "@/constants/ai-tools";
import { useColors } from "@/hooks/use-colors";
import { useHeliox } from "@/lib/heliox-context";
import { router } from "expo-router";
import { useRef, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function HomeScreen() {
  const colors = useColors();
  const { recentTools } = useHeliox();
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<TextInput>(null);

  const featuredTools = FEATURED_TOOLS.map((id) => AI_TOOLS.find((t) => t.id === id)).filter(
    Boolean
  ) as typeof AI_TOOLS;

  const recentToolsData = recentTools
    .map((id) => AI_TOOLS.find((t) => t.id === id))
    .filter(Boolean)
    .slice(0, 6) as typeof AI_TOOLS;

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/(tabs)/explore?q=${encodeURIComponent(searchQuery)}` as any);
    }
  };

  return (
    <ScreenContainer containerClassName="bg-background">
      <OnboardingModal />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.background }]}>
          <View style={styles.headerTop}>
            <View>
              <Text style={[styles.greeting, { color: colors.muted }]}>Bienvenue sur</Text>
              <Text style={[styles.appName, { color: colors.foreground }]}>
                Heliox{" "}
                <Text style={{ color: colors.primary }}>AI</Text>
              </Text>
            </View>
            <View style={[styles.logoContainer, { backgroundColor: colors.primary + "20" }]}>
              <Text style={styles.logoEmoji}>🤖</Text>
            </View>
          </View>

          {/* Search Bar */}
          <Pressable
            style={[styles.searchBar, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => {
              searchRef.current?.focus();
            }}
          >
            <Text style={[styles.searchIcon, { color: colors.muted }]}>🔍</Text>
            <TextInput
              ref={searchRef}
              style={[styles.searchInput, { color: colors.foreground }]}
              placeholder="Rechercher un outil IA..."
              placeholderTextColor={colors.muted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => setSearchQuery("")}>
                <Text style={{ color: colors.muted, fontSize: 16 }}>✕</Text>
              </Pressable>
            )}
          </Pressable>
        </View>

        {/* Featured Tools */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>⭐ En vedette</Text>
            <Pressable onPress={() => router.push("/(tabs)/explore" as any)}>
              <Text style={[styles.seeAll, { color: colors.primary }]}>Voir tout</Text>
            </Pressable>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            {featuredTools.map((tool) => (
              <ToolCard
                key={tool.id}
                id={tool.id}
                name={tool.name}
                description={tool.description}
                icon={tool.icon}
                color={tool.color}
                variant="featured"
              />
            ))}
          </ScrollView>
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>🗂️ Catégories</Text>
          <View style={styles.categoriesGrid}>
            {AI_CATEGORIES.map((cat) => (
              <Pressable
                key={cat.id}
                style={({ pressed }) => [
                  styles.categoryCard,
                  { backgroundColor: cat.color + "15", borderColor: cat.color + "40" },
                  pressed && { opacity: 0.8, transform: [{ scale: 0.97 }] },
                ]}
                onPress={() => router.push(`/(tabs)/explore?cat=${cat.id}` as any)}
              >
                <Text style={styles.categoryIcon}>{getCategoryEmoji(cat.id)}</Text>
                <Text style={[styles.categoryName, { color: colors.foreground }]} numberOfLines={2}>
                  {cat.name}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Recent Tools */}
        {recentToolsData.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>🕐 Récents</Text>
            {recentToolsData.map((tool) => (
              <ToolCard
                key={tool.id}
                id={tool.id}
                name={tool.name}
                description={tool.description}
                icon={tool.icon}
                color={tool.color}
                variant="list"
              />
            ))}
          </View>
        )}

        {/* Quick Access Grid */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>🚀 Accès rapide</Text>
          <View style={styles.quickGrid}>
            {AI_TOOLS.slice(0, 6).map((tool) => (
              <ToolCard
                key={tool.id}
                id={tool.id}
                name={tool.name}
                description={tool.description}
                icon={tool.icon}
                color={tool.color}
                variant="grid"
              />
            ))}
          </View>
        </View>

        {/* Stats Banner */}
        <View style={[styles.statsBanner, { backgroundColor: colors.primary + "15", borderColor: colors.primary + "30" }]}>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.primary }]}>25+</Text>
            <Text style={[styles.statLabel, { color: colors.muted }]}>Outils IA</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.primary }]}>9</Text>
            <Text style={[styles.statLabel, { color: colors.muted }]}>Catégories</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.primary }]}>∞</Text>
            <Text style={[styles.statLabel, { color: colors.muted }]}>Possibilités</Text>
          </View>
        </View>
      </ScrollView>
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
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  greeting: {
    fontSize: 14,
    marginBottom: 2,
  },
  appName: {
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  logoContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  logoEmoji: { fontSize: 26 },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
    marginBottom: 8,
  },
  searchIcon: { fontSize: 16 },
  searchInput: {
    flex: 1,
    fontSize: 15,
    padding: 0,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  seeAll: {
    fontSize: 14,
    fontWeight: "600",
  },
  horizontalScroll: {
    marginLeft: -4,
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  categoryCard: {
    width: "30%",
    aspectRatio: 1,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
    gap: 6,
  },
  categoryIcon: { fontSize: 28 },
  categoryName: {
    fontSize: 11,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 14,
  },
  quickGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  statsBanner: {
    marginHorizontal: 20,
    marginTop: 24,
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: "row",
    padding: 20,
    alignItems: "center",
    justifyContent: "space-around",
  },
  statItem: { alignItems: "center" },
  statNumber: { fontSize: 24, fontWeight: "800" },
  statLabel: { fontSize: 12, marginTop: 2 },
  statDivider: { width: 1, height: 40 },
});
