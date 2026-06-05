import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useSearch } from "@/hooks/use-search";
import { router } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  TextInput,
  View,
  Text,
} from "react-native";
import { ToolCard } from "@/components/tool-card";

export default function SearchScreen() {
  const colors = useColors();
  const [query, setQuery] = useState("");
  const results = useSearch(query);

  return (
    <ScreenContainer containerClassName="bg-background">
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [pressed && { opacity: 0.6 }]}
        >
          <Text style={[styles.backBtn, { color: colors.primary }]}>← Retour</Text>
        </Pressable>

        <TextInput
          style={[
            styles.searchInput,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              color: colors.foreground,
            },
          ]}
          placeholder="Rechercher un outil..."
          placeholderTextColor={colors.muted}
          value={query}
          onChangeText={setQuery}
          autoFocus
        />
      </View>

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.toolWrapper}>
            <ToolCard
              id={item.id}
              name={item.name}
              description={item.description}
              icon={item.icon}
              color={item.color}
              variant="list"
            />
          </View>
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          query ? (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyIcon]}>🔍</Text>
              <Text style={[styles.emptyText, { color: colors.foreground }]}>
                Aucun outil trouvé
              </Text>
              <Text style={[styles.emptyDesc, { color: colors.muted }]}>
                Essayez une autre recherche
              </Text>
            </View>
          ) : null
        }
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  backBtn: {
    fontSize: 16,
    fontWeight: "600",
  },
  searchInput: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  toolWrapper: {
    marginBottom: 12,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    gap: 12,
  },
  emptyIcon: {
    fontSize: 48,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "700",
  },
  emptyDesc: {
    fontSize: 14,
  },
});
