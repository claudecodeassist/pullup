import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "@/providers/AuthProvider";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Colors,
  Gradient,
  FontSize,
  Spacing,
  BorderRadius,
  SPORTS,
  SKILL_LEVELS,
  UF_LOCATIONS,
  Sport,
  SkillLevel,
} from "@/lib/constants";
import { supabase } from "@/lib/supabase";

const STEPS = ["About you", "Skill", "Home court"];

export default function OnboardingScreen() {
  const { user, refreshProfile } = useAuth();
  const [step, setStep] = useState(0);
  const [displayName, setDisplayName] = useState("");
  const [sport, setSport] = useState<Sport | null>(null);
  const [skill, setSkill] = useState<SkillLevel | null>(null);
  const [locationId, setLocationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canProceed = () => {
    if (step === 0) return displayName.trim().length >= 2 && sport !== null;
    if (step === 1) return skill !== null;
    if (step === 2) return locationId !== null;
    return false;
  };

  const handleNext = async () => {
    if (step < 2) {
      setStep(step + 1);
      return;
    }

    setLoading(true);
    setError(null);

    const { error: err } = await supabase
      .from("profiles")
      .update({
        display_name: displayName.trim(),
        preferred_sport: sport,
        skill_level: skill,
        favorite_location_id: locationId,
        onboarded: true,
      })
      .eq("id", user!.id);

    setLoading(false);

    if (err) {
      setError(err.message);
      return;
    }

    await refreshProfile();
    router.replace("/(tabs)");
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.inner}>
        {/* Progress */}
        <View style={styles.progress}>
          {STEPS.map((label, i) => (
            <View key={i} style={styles.progressItem}>
              <View style={[styles.dot, i <= step && styles.dotActive]} />
              <Text
                style={[styles.dotLabel, i <= step && styles.dotLabelActive]}
              >
                {label}
              </Text>
            </View>
          ))}
        </View>

        {step === 0 && (
          <View>
            <Text style={styles.title}>What's your name?</Text>
            <Text style={styles.subtitle}>And what do you play?</Text>

            <Input
              label="Display Name"
              placeholder="e.g. Albert Gator"
              value={displayName}
              onChangeText={setDisplayName}
            />

            <Text style={styles.sectionLabel}>Preferred Sport</Text>
            <View style={styles.sportRow}>
              {SPORTS.map((s) => {
                const sel = sport === s.value;
                return (
                  <Pressable
                    key={s.value}
                    onPress={() => setSport(s.value)}
                    style={({ pressed }) => [
                      styles.sportCard,
                      sel && styles.sportCardSel,
                      pressed && { opacity: 0.8 },
                    ]}
                  >
                    {sel && (
                      <LinearGradient
                        colors={[...Gradient.brandSubtle]}
                        style={StyleSheet.absoluteFill}
                      />
                    )}
                    <Text style={styles.sportEmoji}>{s.emoji}</Text>
                    <Text
                      style={[
                        styles.sportLabel,
                        sel && styles.sportLabelSel,
                      ]}
                    >
                      {s.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}

        {step === 1 && (
          <View>
            <Text style={styles.title}>Skill level?</Text>
            <Text style={styles.subtitle}>
              No pressure — just for matching
            </Text>

            <View style={styles.chipRow}>
              {SKILL_LEVELS.map((s) => {
                const sel = skill === s.value;
                return (
                  <Pressable
                    key={s.value}
                    onPress={() => setSkill(s.value)}
                    style={[styles.chip, sel && styles.chipSel]}
                  >
                    <Text
                      style={[styles.chipText, sel && styles.chipTextSel]}
                    >
                      {s.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}

        {step === 2 && (
          <View>
            <Text style={styles.title}>Favorite spot?</Text>
            <Text style={styles.subtitle}>
              Where do you usually play?
            </Text>

            <View style={styles.chipRow}>
              {UF_LOCATIONS.map((loc) => {
                const sel = locationId === loc.id;
                return (
                  <Pressable
                    key={loc.id}
                    onPress={() => setLocationId(loc.id)}
                    style={[styles.chip, sel && styles.chipSel]}
                  >
                    <Text
                      style={[styles.chipText, sel && styles.chipTextSel]}
                    >
                      📍 {loc.name}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}

        {error && <Text style={styles.error}>{error}</Text>}

        <View style={styles.buttons}>
          {step > 0 && (
            <Button
              title="Back"
              onPress={() => setStep(step - 1)}
              variant="outline"
              style={styles.backBtn}
            />
          )}
          <Button
            title={step === 2 ? "Let's go!" : "Next"}
            onPress={handleNext}
            disabled={!canProceed()}
            loading={loading}
            size="lg"
            style={styles.nextBtn}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.dark },
  content: { flexGrow: 1 },
  inner: {
    maxWidth: 480,
    width: "100%",
    alignSelf: "center",
    padding: Spacing.xxl,
    paddingTop: 60,
  },

  progress: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: Spacing.xxxl,
    gap: Spacing.xl,
  },
  progressItem: { alignItems: "center", gap: 6 },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.darkTertiary,
  },
  dotActive: { backgroundColor: Colors.accent, width: 24 },
  dotLabel: { fontSize: 11, color: Colors.textMuted, fontWeight: "500" },
  dotLabelActive: { color: Colors.textSecondary },

  title: {
    fontSize: FontSize.xxl,
    fontWeight: "800",
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    marginBottom: Spacing.xxl,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: Spacing.md,
    marginTop: Spacing.lg,
  },

  sportRow: { flexDirection: "row", gap: Spacing.md },
  sportCard: {
    flex: 1,
    alignItems: "center",
    paddingVertical: Spacing.xl,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.darkCard,
    borderWidth: 1.5,
    borderColor: Colors.border,
    overflow: "hidden",
  },
  sportCardSel: { borderColor: Colors.accent },
  sportEmoji: { fontSize: 36, marginBottom: Spacing.sm },
  sportLabel: {
    fontSize: FontSize.md,
    fontWeight: "700",
    color: Colors.textSecondary,
  },
  sportLabelSel: { color: Colors.text },

  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.sm },
  chip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm + 2,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.darkCard,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipSel: {
    backgroundColor: Colors.accent + "18",
    borderColor: Colors.accent + "80",
  },
  chipText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontWeight: "500",
  },
  chipTextSel: { color: Colors.accent, fontWeight: "600" },

  error: {
    color: Colors.error,
    fontSize: FontSize.sm,
    textAlign: "center",
    marginTop: Spacing.md,
  },
  buttons: {
    flexDirection: "row",
    marginTop: Spacing.xxxl,
    gap: Spacing.md,
  },
  backBtn: { flex: 1 },
  nextBtn: { flex: 2 },
});
