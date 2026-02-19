import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/providers/AuthProvider";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { loginSchema, type LoginForm } from "@/lib/validators";
import { Colors, FontSize, Spacing } from "@/lib/constants";

export default function LoginScreen() {
  const { signIn, signUp } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginForm) => {
    setError(null);
    setLoading(true);

    if (isSignUp) {
      const { error: err } = await signUp(data.email, data.password);
      setLoading(false);
      if (err) {
        setError(err.message);
        return;
      }
      router.push({ pathname: "/(auth)/verify", params: { email: data.email } });
    } else {
      const { error: err } = await signIn(data.email, data.password);
      setLoading(false);
      if (err) {
        setError(err.message);
        return;
      }
      // Auth state change will trigger redirect in index.tsx
      router.replace("/");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>PullUp 🏓</Text>
          <Text style={styles.subtitle}>
            Pickup sports for UF Gators
          </Text>
        </View>

        <View style={styles.form}>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="UF Email"
                placeholder="gator@ufl.edu"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.email?.message}
                autoCapitalize="none"
                keyboardType="email-address"
                textContentType="emailAddress"
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Password"
                placeholder="At least 8 characters"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.password?.message}
                secureTextEntry
                textContentType="password"
              />
            )}
          />

          {error && <Text style={styles.error}>{error}</Text>}

          <Button
            title={isSignUp ? "Create Account" : "Sign In"}
            onPress={handleSubmit(onSubmit)}
            size="lg"
            loading={loading}
            style={styles.button}
          />

          <Button
            title={isSignUp ? "Already have an account? Sign in" : "New here? Create account"}
            onPress={() => {
              setIsSignUp(!isSignUp);
              setError(null);
            }}
            variant="ghost"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    padding: Spacing.xxl,
  },
  header: {
    alignItems: "center",
    marginBottom: Spacing.xxxl,
  },
  title: {
    fontSize: FontSize.xxxl,
    fontWeight: "800",
    color: Colors.primary,
  },
  subtitle: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
  },
  form: {
    width: "100%",
  },
  error: {
    color: Colors.error,
    fontSize: FontSize.sm,
    textAlign: "center",
    marginBottom: Spacing.md,
  },
  button: {
    marginTop: Spacing.sm,
    marginBottom: Spacing.md,
  },
});
