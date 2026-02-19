import { useEffect } from "react";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "@/providers/AuthProvider";
import { Colors } from "@/lib/constants";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <AuthProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: Colors.white },
          headerTintColor: Colors.text,
          headerTitleStyle: { fontWeight: "700" },
          contentStyle: { backgroundColor: Colors.background },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="create-game"
          options={{
            presentation: "modal",
            title: "Create Game",
          }}
        />
        <Stack.Screen
          name="game/[id]"
          options={{
            title: "Game Details",
          }}
        />
        <Stack.Screen name="+not-found" />
      </Stack>
    </AuthProvider>
  );
}
