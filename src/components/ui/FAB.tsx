import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Colors, Spacing } from "@/lib/constants";

interface FABProps {
  onPress: () => void;
}

export function FAB({ onPress }: FABProps) {
  return (
    <TouchableOpacity style={styles.fab} onPress={onPress} activeOpacity={0.8}>
      <Text style={styles.icon}>+</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    bottom: Spacing.xxl,
    right: Spacing.xxl,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    zIndex: 10,
  },
  icon: {
    color: Colors.white,
    fontSize: 28,
    fontWeight: "600",
    lineHeight: 30,
  },
});
