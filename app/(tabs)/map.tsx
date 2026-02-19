import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Platform, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { useGames } from "@/hooks/useGames";
import { Colors, UF_CAMPUS_CENTER, Spacing, FontSize } from "@/lib/constants";
import type { GameWithLocation } from "@/types/database";

let MapView: any;
let Marker: any;
let Callout: any;

// react-native-maps doesn't support web
if (Platform.OS !== "web") {
  const Maps = require("react-native-maps");
  MapView = Maps.default;
  Marker = Maps.Marker;
  Callout = Maps.Callout;
}

export default function MapScreen() {
  const { games, loading } = useGames();

  if (Platform.OS === "web") {
    return (
      <View style={styles.webFallback}>
        <Text style={styles.webText}>📍 Map view is available on mobile</Text>
        <Text style={styles.webSubtext}>
          Use the Games tab to browse upcoming games
        </Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={UF_CAMPUS_CENTER}
        showsUserLocation
        showsMyLocationButton
      >
        {games.map((game) => (
          <Marker
            key={game.id}
            coordinate={{
              latitude: game.locations?.latitude ?? 0,
              longitude: game.locations?.longitude ?? 0,
            }}
            pinColor={game.sport === "pickleball" ? Colors.primary : Colors.secondary}
            onCalloutPress={() => router.push(`/game/${game.id}`)}
          >
            <Callout>
              <View style={styles.callout}>
                <Text style={styles.calloutSport}>
                  {game.sport === "pickleball" ? "🏓 Pickleball" : "🔵 Spikeball"}
                </Text>
                <Text style={styles.calloutPlayers}>
                  {game.current_players}/{game.max_players} players
                </Text>
                <Text style={styles.calloutTap}>Tap for details →</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  callout: {
    padding: Spacing.sm,
    minWidth: 140,
  },
  calloutSport: {
    fontSize: FontSize.sm,
    fontWeight: "700",
    color: Colors.text,
  },
  calloutPlayers: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  calloutTap: {
    fontSize: FontSize.xs,
    color: Colors.primary,
    fontWeight: "600",
    marginTop: 4,
  },
  webFallback: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.xxl,
  },
  webText: {
    fontSize: FontSize.lg,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  webSubtext: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    textAlign: "center",
  },
});
