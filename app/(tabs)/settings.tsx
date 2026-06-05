import { ScreenContainer } from "@/components/screen-container";
import { useAuth } from "@/hooks/use-auth";
import { useColors } from "@/hooks/use-colors";
import { router } from "expo-router";
import { useHeliox } from "@/lib/heliox-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";

export default function SettingsScreen() {
  const colors = useColors();
  const { user, logout } = useAuth();
  const colorScheme = useColorScheme();
  const { favorites, recentTools, conversations } = useHeliox();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const handleLogout = async () => {
    Alert.alert(
      "Déconnexion",
      "Êtes-vous sûr de vouloir vous déconnecter ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Déconnecter",
          style: "destructive",
          onPress: async () => {
            await logout();
            router.replace("/login");
          },
        },
      ]
    );
  };

  const totalConversations = Object.keys(conversations).length;

  const handleClearHistory = () => {
    Alert.alert(
      "Effacer l'historique",
      "Voulez-vous vraiment effacer tout l'historique des conversations ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Effacer",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.removeItem("@heliox_conversations");
            Alert.alert("✅", "Historique effacé avec succès");
          },
        },
      ]
    );
  };

  const handleClearFavorites = () => {
    Alert.alert(
      "Effacer les favoris",
      "Voulez-vous vraiment supprimer tous vos favoris ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.removeItem("@heliox_favorites");
            Alert.alert("✅", "Favoris supprimés");
          },
        },
      ]
    );
  };

  return (
    <ScreenContainer containerClassName="bg-background">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.background }]}>
          <Text style={[styles.title, { color: colors.foreground }]}>⚙️ Paramètres</Text>
        </View>

        {/* Profile Card */}
        <View style={[styles.profileCard, { backgroundColor: colors.primary + "15", borderColor: colors.primary + "30" }]}>
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <Text style={styles.avatarText}>H</Text>
          </View>
          <View>
            <Text style={[styles.profileName, { color: colors.foreground }]}>Heliox AI</Text>
            <Text style={[styles.profileSub, { color: colors.muted }]}>Votre assistant IA personnel</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>📊 Statistiques</Text>
          <View style={[styles.statsGrid, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>{favorites.length}</Text>
              <Text style={[styles.statLabel, { color: colors.muted }]}>Favoris</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>{recentTools.length}</Text>
              <Text style={[styles.statLabel, { color: colors.muted }]}>Récents</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>{totalConversations}</Text>
              <Text style={[styles.statLabel, { color: colors.muted }]}>Chats</Text>
            </View>
          </View>
        </View>

        {/* Preferences */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>🎨 Préférences</Text>
          <View style={[styles.settingsGroup, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <SettingsRow
              icon="🌙"
              label="Mode sombre"
              value={colorScheme === "dark" ? "Activé" : "Désactivé"}
              colors={colors}
            />
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <SettingsRow
              icon="🔔"
              label="Notifications"
              colors={colors}
              rightElement={
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor="#fff"
                />
              }
            />
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <SettingsRow
              icon="🌍"
              label="Langue"
              value="Français"
              colors={colors}
            />
          </View>
        </View>

        {/* Data */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>🗂️ Données</Text>
          <View style={[styles.settingsGroup, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Pressable
              style={({ pressed }) => [styles.settingsRow, pressed && { opacity: 0.7 }]}
              onPress={handleClearHistory}
            >
              <Text style={styles.rowIcon}>🗑️</Text>
              <Text style={[styles.rowLabel, { color: colors.error }]}>Effacer l'historique</Text>
            </Pressable>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <Pressable
              style={({ pressed }) => [styles.settingsRow, pressed && { opacity: 0.7 }]}
              onPress={handleClearFavorites}
            >
              <Text style={styles.rowIcon}>💔</Text>
              <Text style={[styles.rowLabel, { color: colors.error }]}>Supprimer les favoris</Text>
            </Pressable>
          </View>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>ℹ️ À propos</Text>
          <View style={[styles.settingsGroup, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <SettingsRow icon="📱" label="Version" value="1.0.0" colors={colors} />
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <SettingsRow icon="🤖" label="Moteur IA" value="Heliox LLM" colors={colors} />
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <SettingsRow icon="⚡" label="Outils disponibles" value="25+" colors={colors} />
          </View>
        </View>

        {/* Account */}
        {user && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Account</Text>
            <Pressable
              style={({ pressed }) => [
                styles.logoutBtn,
                { backgroundColor: colors.error + "20", borderColor: colors.error },
                pressed && { opacity: 0.7 },
              ]}
              onPress={handleLogout}
            >
              <Text style={[styles.logoutText, { color: colors.error }]}>Logout</Text>
            </Pressable>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.muted }]}>
            Heliox AI — Votre univers IA, tout-en-un
          </Text>
          <Text style={[styles.footerVersion, { color: colors.muted }]}>v1.0.0</Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

function SettingsRow({
  icon,
  label,
  value,
  colors,
  rightElement,
  onPress,
}: {
  icon: string;
  label: string;
  value?: string;
  colors: any;
  rightElement?: React.ReactNode;
  onPress?: () => void;
}) {
  return (
    <Pressable
      style={({ pressed }) => [styles.settingsRow, pressed && onPress && { opacity: 0.7 }]}
      onPress={onPress}
    >
      <Text style={styles.rowIcon}>{icon}</Text>
      <Text style={[styles.rowLabel, { color: colors.foreground }]}>{label}</Text>
      <View style={styles.rowRight}>
        {rightElement || (
          value ? <Text style={[styles.rowValue, { color: colors.muted }]}>{value}</Text> : null
        )}
      </View>
    </Pressable>
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
  profileCard: {
    marginHorizontal: 20,
    marginBottom: 8,
    padding: 20,
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontSize: 28, fontWeight: "800", color: "#fff" },
  profileName: { fontSize: 18, fontWeight: "700" },
  profileSub: { fontSize: 13, marginTop: 2 },
  section: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
  },
  statsGrid: {
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: "row",
    padding: 20,
    alignItems: "center",
    justifyContent: "space-around",
  },
  statItem: { alignItems: "center" },
  statNumber: { fontSize: 22, fontWeight: "800" },
  statLabel: { fontSize: 12, marginTop: 2 },
  statDivider: { width: 1, height: 36 },
  settingsGroup: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  settingsRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  rowIcon: { fontSize: 20, width: 28 },
  rowLabel: { flex: 1, fontSize: 15, fontWeight: "500" },
  rowRight: { alignItems: "flex-end" },
  rowValue: { fontSize: 14 },
  divider: { height: 1, marginLeft: 56 },
  logoutBtn: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
  },
  logoutText: {
    fontSize: 15,
    fontWeight: "600",
  },
  footer: {
    alignItems: "center",
    marginTop: 32,
    gap: 4,
  },
  footerText: { fontSize: 13 },
  footerVersion: { fontSize: 12 },
});
