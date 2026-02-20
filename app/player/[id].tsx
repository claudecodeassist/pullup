import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Avatar } from "@/components/ui/Avatar";
import { supabase } from "@/lib/supabase";
import {
  Colors,
  Gradient,
  FontSize,
  Spacing,
  BorderRadius,
} from "@/lib/constants";
import type { Profile } from "@/types/database";

export default function PlayerProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [hostedCount, setHostedCount] = useState(0);
  const [joinedCount, setJoinedCount] = useState(0);

  useEffect(() => {
    if (!id) return;

    (async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();

      if (data) setProfile(data as Profile);

      const { count: hosted } = await supabase
        .from("games")
        .select("*", { count: "exact", head: true })
        .eq("host_id", id);

      const { count: joined } = await supabase
        .from("game_participants")
        .select("*", { count: "exact", head: true })
        .eq("user_id", id)
        .eq("status", "joined");

      setHostedCount(hosted ?? 0);
      setJoinedCount(joined ?? 0);
      setLoading(false);
    })();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.accent} />
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.center}>
        <Text style={styles.notFound}>Player not found</Text>
      </View>
    );
  }

  const memberSince = new Date(profile.created_at).toLocaleDateString(
    undefined,
    { month: "long", year: "numeric" }
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.inner}>
        <View style={styles.profileCard}>
          <LinearGradient
            colors={[...Gradient.brandSubtle]}
            style={styles.profileGlow}
          />
          <Avatar
            name={profile.display_name}
            imageUrl={profile.avatar_url}
            size={80}
          />
          <Text style={styles.name}>
            {profile.display_name ?? "Player"}
          </Text>
          <Text style={styles.memberSince}>
            Member since {memberSince}
          </Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNum}>{hostedCount}</Text>
            <Text style={styles.statLabel}>Hosted</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNum}>{joinedCount}</Text>
            <Text style={styles.statLabel}>Joined</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.dark },
  content: { paddingBottom: 60 },
  inner: {
    maxWidth: 600,
    width: "100%",
    alignSelf: "center",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.dark,
  },
  notFound: {
    fontSize: FontSize.md,
    color: Colors.textMuted,
  },
  profileCard: {
    alignItems: "center",
    paddingTop: Spacing.xxxl,
    paddingBottom: Spacing.xxl,
    paddingHorizontal: Spacing.xxl,
    marginBottom: Spacing.xxl,
    position: "relative",
    overflow: "hidden",
  },
  profileGlow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  name: {
    fontSize: FontSize.xxl,
    fontWeight: "800",
    color: Colors.text,
    marginTop: Spacing.lg,
    letterSpacing: -0.5,
  },
  memberSince: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
  },
  statsRow: {
    flexDirection: "row",
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.darkCard,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.lg,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statNum: {
    fontSize: FontSize.xxl,
    fontWeight: "800",
    color: Colors.text,
  },
  statLabel: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    fontWeight: "500",
    marginTop: 2,
  },
});
