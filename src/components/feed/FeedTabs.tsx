import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Colors, FontSize, Spacing, BorderRadius } from "@/lib/constants";

interface FeedTabsProps {
  active: "upcoming" | "my";
  onChange: (tab: "upcoming" | "my") => void;
}

export function FeedTabs({ active, onChange }: FeedTabsProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.tab, active === "upcoming" && styles.activeTab]}
        onPress={() => onChange("upcoming")}
      >
        <Text style={[styles.text, active === "upcoming" && styles.activeText]}>
          Upcoming
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, active === "my" && styles.activeTab]}
        onPress={() => onChange("my")}
      >
        <Text style={[styles.text, active === "my" && styles.activeText]}>
          My Games
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    padding: 3,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  activeTab: {
    backgroundColor: Colors.white,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  text: {
    fontSize: FontSize.sm,
    fontWeight: "600",
    color: Colors.textSecondary,
  },
  activeText: {
    color: Colors.primary,
  },
});
