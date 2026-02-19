import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors } from "@/lib/constants";
import type { Sport } from "@/lib/constants";

interface GamePinProps {
  sport: Sport;
  count: number;
}

export function GamePin({ sport, count }: GamePinProps) {
  const color = sport === "pickleball" ? Colors.primary : Colors.secondary;

  return (
    <View style={[styles.pin, { backgroundColor: color }]}>
      <Text style={styles.emoji}>
        {sport === "pickleball" ? "🏓" : "🔵"}
      </Text>
      <View style={[styles.badge, { backgroundColor: color }]}>
        <Text style={styles.count}>{count}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pin: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: Colors.white,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  emoji: {
    fontSize: 18,
  },
  badge: {
    position: "absolute",
    top: -6,
    right: -6,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: Colors.white,
  },
  count: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: "700",
  },
});
