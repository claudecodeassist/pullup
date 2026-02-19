import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Colors, BorderRadius, FontSize, Spacing } from "@/lib/constants";

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
}

export function Chip({ label, selected = false, onPress }: ChipProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.chip, selected && styles.selected]}
      activeOpacity={0.7}
    >
      <Text style={[styles.text, selected && styles.selectedText]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: Spacing.sm,
  },
  selected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  text: {
    fontSize: FontSize.sm,
    color: Colors.text,
    fontWeight: "500",
  },
  selectedText: {
    color: Colors.white,
  },
});
