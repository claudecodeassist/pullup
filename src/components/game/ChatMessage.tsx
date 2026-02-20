import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Avatar } from "@/components/ui/Avatar";
import { Colors, FontSize, Spacing, BorderRadius } from "@/lib/constants";
import { formatChatTime } from "@/lib/datetime";

interface ChatMessageProps {
  content: string;
  displayName: string | null;
  avatarUrl?: string | null;
  createdAt: string;
  isOwn: boolean;
}

export function ChatMessage({ content, displayName, avatarUrl, createdAt, isOwn }: ChatMessageProps) {
  return (
    <View style={[styles.container, isOwn && styles.ownContainer]}>
      {!isOwn && (
        <View style={styles.row}>
          <Avatar name={displayName} imageUrl={avatarUrl} size={28} />
          <View style={styles.contentCol}>
            <Text style={styles.name}>{displayName ?? "Anonymous"}</Text>
            <View style={styles.bubble}>
              <Text style={styles.text}>{content}</Text>
            </View>
            <Text style={styles.time}>{formatChatTime(createdAt)}</Text>
          </View>
        </View>
      )}
      {isOwn && (
        <View>
          <View style={[styles.bubble, styles.ownBubble]}>
            <Text style={[styles.text, styles.ownText]}>{content}</Text>
          </View>
          <Text style={[styles.time, styles.ownTime]}>{formatChatTime(createdAt)}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
    alignItems: "flex-start",
    paddingHorizontal: Spacing.lg,
  },
  ownContainer: {
    alignItems: "flex-end",
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.sm,
  },
  contentCol: {
    flexShrink: 1,
    maxWidth: "80%",
  },
  name: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginBottom: 2,
  },
  bubble: {
    backgroundColor: Colors.darkTertiary,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  ownBubble: {
    backgroundColor: Colors.accent,
  },
  text: {
    fontSize: FontSize.sm,
    color: Colors.text,
    lineHeight: 20,
  },
  ownText: {
    color: Colors.dark,
  },
  time: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 2,
  },
  ownTime: {
    marginRight: Spacing.xs,
    textAlign: "right",
  },
});
