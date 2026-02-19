import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { Colors, FontSize, Spacing, BorderRadius } from "@/lib/constants";
import { formatGameTime } from "@/lib/datetime";
import type { GameWithLocation } from "@/types/database";

interface PinCalloutProps {
  game: GameWithLocation;
}

export function PinCallout({ game }: PinCalloutProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => router.push(`/game/${game.id}`)}
    >
      <Text style={styles.sport}>
        {game.sport === "pickleball" ? "🏓 Pickleball" : "🔵 Spikeball"}
      </Text>
      <Text style={styles.time}>{formatGameTime(game.starts_at)}</Text>
      <Text style={styles.players}>
        {game.current_players}/{game.max_players} players
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.sm,
    minWidth: 150,
  },
  sport: {
    fontSize: FontSize.sm,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 2,
  },
  time: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  players: {
    fontSize: FontSize.xs,
    color: Colors.primary,
    fontWeight: "600",
  },
});
