import { useColors } from "@/hooks/use-colors";
import { ReactNode, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, retry: () => void) => ReactNode;
}

export function ErrorBoundary({ children, fallback }: ErrorBoundaryProps) {
  const [error, setError] = useState<Error | null>(null);
  const colors = useColors();

  if (error) {
    return (
      fallback?.(error, () => setError(null)) || (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
          <View style={[styles.errorBox, { backgroundColor: colors.error + "15", borderColor: colors.error }]}>
            <Text style={[styles.errorIcon]}>⚠️</Text>
            <Text style={[styles.errorTitle, { color: colors.foreground }]}>Une erreur s'est produite</Text>
            <Text style={[styles.errorMessage, { color: colors.muted }]}>{error.message}</Text>
            <Pressable
              style={({ pressed }) => [
                styles.retryBtn,
                { backgroundColor: colors.primary },
                pressed && { opacity: 0.8 },
              ]}
              onPress={() => setError(null)}
            >
              <Text style={styles.retryText}>Réessayer</Text>
            </Pressable>
          </View>
        </View>
      )
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  errorBox: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 20,
    alignItems: "center",
    gap: 12,
  },
  errorIcon: {
    fontSize: 48,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  errorMessage: {
    fontSize: 14,
    textAlign: "center",
  },
  retryBtn: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 8,
  },
  retryText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
