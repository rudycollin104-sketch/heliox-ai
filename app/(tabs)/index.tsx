import { ScrollView, Text, View, FlatList, Pressable, StyleSheet } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useHeliox } from "@/lib/heliox-context";
import { AI_CATEGORIES, AI_TOOLS, FEATURED_TOOLS } from "@/constants/ai-tools";
import { ToolCard } from "@/components/tool-card";
import { OnboardingModal } from "@/components/onboarding-modal";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeScreen() {
  const colors = useColors();
  const { addRecentTool } = useHeliox();
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    checkFirstLaunch();
  }, []);

  const checkFirstLaunch = async () => {
    const hasLaunched = await AsyncStorage.getItem("@heliox_launched");
    if (!hasLaunched) {
      setShowOnboarding(true);
      await AsyncStorage.setItem("@heliox_launched", "true");
    }
  };

  const featuredTools = AI_TOOLS.filter((tool) => FEATURED_TOOLS.includes(tool.id)).slice(0, 4);

  return (
    <ScreenContainer containerClassName="bg-background">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.background }]}>
          <Text style={[styles.greeting, { color: colors.foreground }]}>👋 Bienvenue</Text>
          <Text style={[styles.subtitle, { color: colors.muted }]}>Votre univers IA, tout-en-un</Text>
        </View>

        {/* Quick Stats */}
        <View style={[styles.statsCard, { backgroundColor: colors.primary + "15", borderColor: colors.primary }]}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.primary }]}>25+</Text>
            <Text style={[styles.statLabel, { color: colors.foreground }]}>Outils IA</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.primary }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.primary }]}>9</Text>
            <Text style={[styles.statLabel, { color: colors.foreground }]}>Catégories</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.primary }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.primary }]}>∞</Text>
            <Text style={[styles.statLabel, { color: colors.foreground }]}>Possibilités</Text>
          </View>
        </View>

        {/* Featured Tools */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>⭐ En Vedette</Text>
          <FlatList
            scrollEnabled={false}
            data={featuredTools}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ToolCard
                id={item.id}
                name={item.name}
                description={item.description}
                icon={item.icon}
                color={item.color}
                variant="featured"
              />
            )}
            contentContainerStyle={styles.toolsGrid}
            numColumns={2}
            columnWrapperStyle={styles.columnWrapper}
          />
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>🎨 Catégories</Text>
          <FlatList
            scrollEnabled={false}
            data={AI_CATEGORIES}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Pressable
                style={({ pressed }) => [
                  styles.categoryCard,
                  { backgroundColor: item.color + "20", borderColor: item.color },
                  pressed && { opacity: 0.7 },
                ]}
              >
                <Text style={styles.categoryIcon}>{item.icon}</Text>
                <View style={styles.categoryContent}>
                  <Text style={[styles.categoryName, { color: colors.foreground }]}>{item.name}</Text>
                  <Text style={[styles.categoryDesc, { color: colors.muted }]}>{item.description}</Text>
                </View>
              </Pressable>
            )}
            contentContainerStyle={styles.categoriesContainer}
          />
        </View>

        {/* Tips */}
        <View style={[styles.tipsCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.tipsTitle, { color: colors.foreground }]}>💡 Conseil du jour</Text>
          <Text style={[styles.tipsText, { color: colors.muted }]}>
            Utilisez les favoris pour accéder rapidement à vos outils IA préférés !
          </Text>
        </View>
      </ScrollView>

      {showOnboarding && <OnboardingModal />}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  greeting: {
    fontSize: 28,
    fontWeight: "800",
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  statsCard: {
    marginHorizontal: 20,
    marginVertical: 12,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "800",
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 40,
  },
  section: {
    paddingHorizontal: 20,
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  toolsGrid: {
    gap: 12,
  },
  columnWrapper: {
    gap: 12,
  },
  categoryCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
    gap: 12,
  },
  categoryIcon: {
    fontSize: 28,
    width: 44,
    textAlign: "center",
  },
  categoryContent: {
    flex: 1,
  },
  categoryName: {
    fontSize: 15,
    fontWeight: "700",
  },
  categoryDesc: {
    fontSize: 12,
    marginTop: 2,
  },
  categoriesContainer: {
    paddingBottom: 12,
  },
  tipsCard: {
    marginHorizontal: 20,
    marginVertical: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  tipsTitle: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 8,
  },
  tipsText: {
    fontSize: 13,
    lineHeight: 18,
  },
});
