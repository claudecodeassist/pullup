import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Colors, FontSize, Spacing, BorderRadius } from "@/lib/constants";

interface ScaleSelectorProps {
  options: { value: number | string; label: string }[];
  selected: number | string;
  onSelect: (value: any) => void;
  /** Optional label shown to left and right of the bar */
  minLabel?: string;
  maxLabel?: string;
}

export function ScaleSelector({ options, selected, onSelect, minLabel, maxLabel }: ScaleSelectorProps) {
  const selectedIdx = options.findIndex((o) => o.value === selected);
  const fillPercent = options.length > 1 ? (selectedIdx / (options.length - 1)) * 100 : 0;

  return (
    <View>
      {/* Labels row */}
      {(minLabel || maxLabel) && (
        <View style={styles.labelsRow}>
          {minLabel && <Text style={styles.edgeLabel}>{minLabel}</Text>}
          <View style={{ flex: 1 }} />
          {maxLabel && <Text style={styles.edgeLabel}>{maxLabel}</Text>}
        </View>
      )}

      {/* Track */}
      <View style={styles.track}>
        <View style={[styles.trackFill, { width: `${fillPercent}%` }]} />
      </View>

      {/* Tappable options */}
      <View style={styles.optionsRow}>
        {options.map((opt, i) => {
          const sel = opt.value === selected;
          return (
            <Pressable
              key={String(opt.value)}
              onPress={() => onSelect(opt.value)}
              style={styles.optionHit}
            >
              <View style={[styles.dot, sel && styles.dotSel, i <= selectedIdx && styles.dotFilled]} />
              <Text style={[styles.optLabel, sel && styles.optLabelSel]}>{opt.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  labelsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  edgeLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: "500",
  },
  track: {
    height: 4,
    backgroundColor: Colors.darkTertiary,
    borderRadius: 2,
    marginBottom: 2,
  },
  trackFill: {
    height: "100%",
    backgroundColor: Colors.accent,
    borderRadius: 2,
  },
  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  optionHit: {
    alignItems: "center",
    paddingVertical: Spacing.sm,
    minWidth: 32,
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.darkTertiary,
    borderWidth: 2,
    borderColor: Colors.darkTertiary,
    marginBottom: 4,
  },
  dotFilled: {
    backgroundColor: Colors.accent + "60",
    borderColor: Colors.accent + "60",
  },
  dotSel: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
    width: 18,
    height: 18,
    borderRadius: 9,
    marginBottom: 2,
  },
  optLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: "500",
  },
  optLabelSel: {
    color: Colors.accent,
    fontWeight: "700",
  },
});
