import { ScreenContainer } from "@/components/screen-container";
import { useAuth } from "@/hooks/use-auth";
import { useColors } from "@/hooks/use-colors";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import * as Auth from "@/lib/_core/auth";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const colors = useColors();
  const { isAuthenticated, loading } = useAuth({ autoFetch: false });
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    if (isAuthenticated && !loading) {
      router.replace("/(tabs)");
    }
  }, [isAuthenticated, loading]);

  const handleLogin = async () => {
    try {
      setIsLoggingIn(true);
      const authUrl = `${process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000"}/auth/login`;
      const redirectUrl = Linking.createURL("oauth/callback");

      const result = await WebBrowser.openAuthSessionAsync(
        `${authUrl}?redirect_uri=${encodeURIComponent(redirectUrl)}`,
        redirectUrl
      );

      if (result.type === "success") {
        const url = new URL(result.url);
        const token = url.searchParams.get("token");

        if (token) {
          await Auth.setSessionToken(token);
          router.replace("/(tabs)");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Erreur", "La connexion a échoué. Réessayez.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  if (loading) {
    return (
      <ScreenContainer>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer containerClassName="bg-background">
      <View style={styles.container}>
        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.heroIcon}>🤖</Text>
          <Text style={[styles.heroTitle, { color: colors.foreground }]}>
            Heliox AI
          </Text>
          <Text style={[styles.heroSubtitle, { color: colors.muted }]}>
            Votre univers IA, tout-en-un
          </Text>
        </View>

        {/* Features */}
        <View style={styles.features}>
          {[
            { icon: "⭐", title: "25+ Outils IA", desc: "Musique, écriture, jeux, création..." },
            { icon: "☁️", title: "Synchronisation", desc: "Vos données sur tous vos appareils" },
            { icon: "❤️", title: "Favoris Personnels", desc: "Sauvegardez vos outils préférés" },
          ].map((feature, i) => (
            <View key={i} style={styles.featureItem}>
              <Text style={styles.featureIcon}>{feature.icon}</Text>
              <View>
                <Text style={[styles.featureTitle, { color: colors.foreground }]}>
                  {feature.title}
                </Text>
                <Text style={[styles.featureDesc, { color: colors.muted }]}>
                  {feature.desc}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* CTA */}
        <View style={styles.cta}>
          <Pressable
            style={({ pressed }) => [
              styles.loginBtn,
              { backgroundColor: colors.primary },
              pressed && { opacity: 0.85 },
            ]}
            onPress={handleLogin}
            disabled={isLoggingIn}
          >
            {isLoggingIn ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.loginBtnText}>Se connecter avec Manus</Text>
            )}
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.skipBtn,
              pressed && { opacity: 0.7 },
            ]}
            onPress={() => router.replace("/(tabs)")}
            disabled={isLoggingIn}
          >
            <Text style={[styles.skipBtnText, { color: colors.primary }]}>
              Continuer sans connexion
            </Text>
          </Pressable>

          <Text style={[styles.disclaimer, { color: colors.muted }]}>
            Connectez-vous pour synchroniser vos favoris et votre historique sur tous vos appareils.
          </Text>
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
    justifyContent: "space-between",
  },
  hero: {
    alignItems: "center",
    gap: 12,
    marginTop: 40,
  },
  heroIcon: {
    fontSize: 64,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: "800",
  },
  heroSubtitle: {
    fontSize: 16,
  },
  features: {
    gap: 16,
  },
  featureItem: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
  },
  featureIcon: {
    fontSize: 24,
    width: 32,
    textAlign: "center",
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 2,
  },
  featureDesc: {
    fontSize: 13,
  },
  cta: {
    gap: 12,
  },
  loginBtn: {
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  loginBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  skipBtn: {
    paddingVertical: 12,
    alignItems: "center",
  },
  skipBtnText: {
    fontSize: 15,
    fontWeight: "600",
  },
  disclaimer: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 8,
  },
});
