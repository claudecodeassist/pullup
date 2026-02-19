import { useState } from "react";
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/providers/AuthProvider";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { otpSchema, type OtpForm } from "@/lib/validators";
import { Colors, FontSize, Spacing } from "@/lib/constants";

export default function VerifyScreen() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const { verifyOtp } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<OtpForm>({
    resolver: zodResolver(otpSchema),
    defaultValues: { token: "" },
  });

  const onSubmit = async (data: OtpForm) => {
    if (!email) return;
    setError(null);
    setLoading(true);

    const { error: err } = await verifyOtp(email, data.token);
    setLoading(false);

    if (err) {
      setError(err.message);
      return;
    }

    router.replace("/");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Check your email</Text>
        <Text style={styles.subtitle}>
          We sent a 6-digit code to{"\n"}
          <Text style={styles.email}>{email}</Text>
        </Text>

        <Controller
          control={control}
          name="token"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Verification Code"
              placeholder="123456"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.token?.message}
              keyboardType="number-pad"
              maxLength={6}
              style={styles.otpInput}
            />
          )}
        />

        {error && <Text style={styles.error}>{error}</Text>}

        <Button
          title="Verify"
          onPress={handleSubmit(onSubmit)}
          size="lg"
          loading={loading}
        />

        <Button
          title="Back to login"
          onPress={() => router.back()}
          variant="ghost"
          style={styles.backBtn}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    padding: Spacing.xxl,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: "800",
    color: Colors.text,
    textAlign: "center",
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: Spacing.xxxl,
    lineHeight: 22,
  },
  email: {
    fontWeight: "700",
    color: Colors.text,
  },
  otpInput: {
    textAlign: "center",
    fontSize: FontSize.xxl,
    letterSpacing: 8,
  },
  error: {
    color: Colors.error,
    fontSize: FontSize.sm,
    textAlign: "center",
    marginBottom: Spacing.md,
  },
  backBtn: {
    marginTop: Spacing.md,
  },
});
