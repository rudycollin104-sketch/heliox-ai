import { ScreenContainer } from "@/components/screen-container";
import { ToolCard } from "@/components/tool-card";
import { AI_TOOLS } from "@/constants/ai-tools";
import { useColors } from "@/hooks/use-colors";
import { useHeliox } from "@/lib/heliox-context";
import { router } from "expo-router";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

export default function FavoritesScreen() {
  const colors = useColors();
  const { favorites } = useHeliox();

  const favoriteTools = favorites
    .map((id) => AI_TOOLS.find((t) => t.id === id))
    .filter(Boolean) as typeof AI_TOOLS;

  return (
    <ScreenContainer containerClassName="bg-background">
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.foreground }]}>❤️ Mes Favoris</Text>
        <Text style={[styles.subtitle, { color: colors.muted }]}>
          {favoriteTools.length} outil{favoriteTools.length !== 1 ? "s" : ""} sauvegardé{favoriteTools.length !== 1 ? "s" : ""}
        </Text>
      </View>

      <FlatList
        data={favoriteTools}
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
            <Text style={styles.emptyIcon}>💫</Text>
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
              Aucun favori encore
            </Text>
            <Text style={[styles.emptyText, { color: colors.muted }]}>
              Ajoutez des outils IA à vos favoris en appuyant sur le cœur ❤️
            </Text>
            <Pressable
              style={[styles.exploreBtn, { backgroundColor: colors.primary }]}
              onPress={() => router.push("/(tabs)/explore" as any)}
            >
              <Text style={styles.exploreBtnText}>Explorer les outils</Text>
            </Pressable>
          </View>
        }
      />
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
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
  },
  list: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 24,
  },
  empty: {
    alignItems: "center",
    paddingTop: 80,
    paddingHorizontal: 40,
    gap: 12,
  },
  emptyIcon: { fontSize: 64 },
  emptyTitle: { fontSize: 20, fontWeight: "700", textAlign: "center" },
  emptyText: { fontSize: 14, textAlign: "center", lineHeight: 20 },
  exploreBtn: {
    marginTop: 8,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
  },
  exploreBtnText: { color: "#fff", fontWeight: "700", fontSize: 15 },
});
