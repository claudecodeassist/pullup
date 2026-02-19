import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { Chip } from "@/components/ui/Chip";
import { SPORTS, Sport } from "@/lib/constants";
import { Spacing } from "@/lib/constants";

interface SportFilterChipsProps {
  selected: Sport | null;
  onSelect: (sport: Sport | null) => void;
}

export function SportFilterChips({ selected, onSelect }: SportFilterChipsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <Chip
        label="All Sports"
        selected={selected === null}
        onPress={() => onSelect(null)}
      />
      {SPORTS.map((sport) => (
        <Chip
          key={sport.value}
          label={`${sport.emoji} ${sport.label}`}
          selected={selected === sport.value}
          onPress={() => onSelect(selected === sport.value ? null : sport.value)}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  content: {
    paddingHorizontal: Spacing.lg,
  },
});
