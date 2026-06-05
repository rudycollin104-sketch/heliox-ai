import { useHeliox } from "@/lib/heliox-context";
import { cn } from "@/lib/utils";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useColors } from "@/hooks/use-colors";

interface ToolCardProps {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  variant?: "grid" | "list" | "featured";
  className?: string;
}

export function ToolCard({
  id,
  name,
  description,
  icon,
  color,
  variant = "grid",
  className,
}: ToolCardProps) {
  const colors = useColors();
  const { isFavorite, toggleFavorite } = useHeliox();
  const favorite = isFavorite(id);

  const handlePress = () => {
    router.push(`/tool/${id}` as any);
  };

  const handleFavorite = (e: any) => {
    e.stopPropagation();
    toggleFavorite(id);
  };

  if (variant === "list") {
    return (
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [
          styles.listCard,
          { backgroundColor: colors.surface, borderColor: colors.border },
          pressed && { opacity: 0.85 },
        ]}
      >
        <View style={[styles.listIcon, { backgroundColor: color + "20" }]}>
          <Text style={styles.listIconText}>{icon}</Text>
        </View>
        <View style={styles.listContent}>
          <Text style={[styles.listName, { color: colors.foreground }]} numberOfLines={1}>
            {name}
          </Text>
          <Text style={[styles.listDesc, { color: colors.muted }]} numberOfLines={2}>
            {description}
          </Text>
        </View>
        <Pressable
          onPress={handleFavorite}
          style={({ pressed }) => [styles.favoriteBtn, pressed && { opacity: 0.6 }]}
        >
          <Text style={[styles.favIcon, { color: favorite ? "#EF4444" : colors.muted }]}>
            {favorite ? "❤️" : "🤍"}
          </Text>
        </Pressable>
      </Pressable>
    );
  }

  if (variant === "featured") {
    return (
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [
          styles.featuredCard,
          { backgroundColor: color + "15", borderColor: color + "40" },
          pressed && { opacity: 0.85, transform: [{ scale: 0.97 }] },
        ]}
      >
        <View style={styles.featuredHeader}>
          <Text style={styles.featuredIcon}>{icon}</Text>
          <Pressable
            onPress={handleFavorite}
            style={({ pressed }) => [pressed && { opacity: 0.6 }]}
          >
            <Text style={styles.favIcon}>{favorite ? "❤️" : "🤍"}</Text>
          </Pressable>
        </View>
        <Text style={[styles.featuredName, { color: colors.foreground }]} numberOfLines={2}>
          {name}
        </Text>
        <Text style={[styles.featuredDesc, { color: colors.muted }]} numberOfLines={2}>
          {description}
        </Text>
        <View style={[styles.featuredDot, { backgroundColor: color }]} />
      </Pressable>
    );
  }

  // Grid variant (default)
  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.gridCard,
        { backgroundColor: colors.surface, borderColor: colors.border },
        pressed && { opacity: 0.85, transform: [{ scale: 0.97 }] },
      ]}
    >
      <View style={[styles.gridIconBg, { backgroundColor: color + "20" }]}>
        <Text style={styles.gridIcon}>{icon}</Text>
      </View>
      <Text style={[styles.gridName, { color: colors.foreground }]} numberOfLines={2}>
        {name}
      </Text>
      <Pressable
        onPress={handleFavorite}
        style={({ pressed }) => [styles.gridFav, pressed && { opacity: 0.6 }]}
      >
        <Text style={{ fontSize: 14 }}>{favorite ? "❤️" : "🤍"}</Text>
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  // List variant
  listCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 10,
    gap: 12,
  },
  listIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  listIconText: { fontSize: 24 },
  listContent: { flex: 1 },
  listName: { fontSize: 15, fontWeight: "700", marginBottom: 2 },
  listDesc: { fontSize: 13, lineHeight: 18 },
  favoriteBtn: { padding: 4 },
  favIcon: { fontSize: 18 },

  // Featured variant
  featuredCard: {
    width: 160,
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    marginRight: 12,
    position: "relative",
    overflow: "hidden",
  },
  featuredHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  featuredIcon: { fontSize: 32 },
  featuredName: { fontSize: 14, fontWeight: "700", marginBottom: 4, lineHeight: 20 },
  featuredDesc: { fontSize: 12, lineHeight: 17 },
  featuredDot: {
    position: "absolute",
    bottom: -20,
    right: -20,
    width: 60,
    height: 60,
    borderRadius: 30,
    opacity: 0.2,
  },

  // Grid variant
  gridCard: {
    flex: 1,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    minHeight: 110,
    position: "relative",
  },
  gridIconBg: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  gridIcon: { fontSize: 26 },
  gridName: { fontSize: 12, fontWeight: "700", textAlign: "center", lineHeight: 16 },
  gridFav: { position: "absolute", top: 8, right: 8 },
});
