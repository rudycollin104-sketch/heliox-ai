import { useFonts } from "expo-font";
import { Stack, useRootNavigationState } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import "react-native-reanimated";
import "../global.css";

import { HelioxProvider } from "@/lib/heliox-context";
import { ThemeProvider as HelioxThemeProvider } from "@/lib/theme-provider";
import { trpc, createTRPCClient } from "@/lib/trpc";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useMemo } from "react";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({});
  const { isAuthenticated, loading: authLoading } = useAuth();
  const rootNavigationState = useRootNavigationState();

  const queryClient = useMemo(() => new QueryClient(), []);
  const trpcClient = useMemo(() => createTRPCClient(), []);

  useEffect(() => {
    if (loaded && !authLoading && rootNavigationState?.key) {
      SplashScreen.hideAsync();
    }
  }, [loaded, authLoading, rootNavigationState?.key]);

  if (!loaded || authLoading) {
    return null;
  }

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <HelioxThemeProvider>
          <HelioxProvider>
            <Stack
              screenOptions={{
                headerShown: false,
              }}
            >
              <Stack.Screen name="login" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="tool/[id]" options={{ headerShown: false, presentation: "card" }} />
              <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style="auto" />
          </HelioxProvider>
        </HelioxThemeProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}
