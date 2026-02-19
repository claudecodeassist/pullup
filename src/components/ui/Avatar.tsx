import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors, BorderRadius, FontSize } from "@/lib/constants";

interface AvatarProps {
  name: string | null;
  size?: number;
}

export function Avatar({ name, size = 40 }: AvatarProps) {
  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
      ]}
    >
      <Text style={[styles.text, { fontSize: size * 0.4 }]}>{initials}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: Colors.white,
    fontWeight: "700",
  },
});
