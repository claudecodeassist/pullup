import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { router } from "expo-router";
import { Colors, FontSize, Spacing } from "@/lib/constants";
import { Avatar } from "@/components/ui/Avatar";

interface Participant {
  user_id: string;
  profiles: { display_name: string | null; avatar_url: string | null } | null;
}

interface RosterListProps {
  participants: Participant[];
  hostId: string;
}

export function RosterList({ participants, hostId }: RosterListProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Players ({participants.length})
      </Text>
      {participants.map((p) => (
        <Pressable
          key={p.user_id}
          onPress={() => router.push(`/player/${p.user_id}`)}
          style={({ pressed }) => [styles.row, pressed && { opacity: 0.7 }]}
        >
          <Avatar
            name={p.profiles?.display_name ?? null}
            imageUrl={p.profiles?.avatar_url}
            size={32}
          />
          <Text style={styles.name}>
            {p.profiles?.display_name ?? "Anonymous"}
          </Text>
          {p.user_id === hostId && (
            <View style={styles.hostBadge}>
              <Text style={styles.hostText}>HOST</Text>
            </View>
          )}
          <Text style={styles.chevron}>{"\u203A"}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: Spacing.lg,
  },
  title: {
    fontSize: FontSize.md,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.darkTertiary,
  },
  name: {
    flex: 1,
    marginLeft: Spacing.md,
    fontSize: FontSize.sm,
    color: Colors.text,
  },
  hostBadge: {
    backgroundColor: Colors.accent + "25",
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: 4,
  },
  hostText: {
    fontSize: 10,
    fontWeight: "700",
    color: Colors.accent,
  },
  chevron: {
    fontSize: 20,
    color: Colors.textMuted,
    marginLeft: Spacing.sm,
  },
});
