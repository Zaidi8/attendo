import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FormTextInput } from '@/components/ui/FormTextInput';
import { AppIcon } from '@/components/ui/AppIcon';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { useAuth } from '@/features/auth/useAuth';
import { loginSchema, type LoginFormValues } from '@/features/auth/validation';

/**
 * Login screen (Stitch: "Login Screen"). Collects email + password, calls
 * useAuth().signIn, and surfaces any Firebase error as an inline banner. A
 * "Forgot password?" link routes to the reset flow; "Sign Up" routes to account
 * creation. On success the authenticated navigation guard redirects to (app).
 */
export default function LoginScreen() {
  const { signIn } = useAuth();
  const router = useRouter();
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      await signIn(values.email, values.password);
      // Navigation to the authenticated area happens reactively via the guard.
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Something went wrong.';
      setError('root', { message });
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerClassName="flex-grow items-center justify-center px-4 py-6"
          keyboardShouldPersistTaps="handled"
        >
          <View className="w-full max-w-md rounded-xl border border-border bg-surface p-8">
            <View className="mb-4 items-center">
              <View className="mb-4 h-16 w-16 items-center justify-center rounded-xl bg-primary-fixed">
                <AppIcon name="school" size={32} color="#1a2b3c" accessibilityLabel="Attendo logo" />
              </View>
              <Text className="text-center text-headline font-semibold text-primary">
                Welcome back
              </Text>
              <Text className="mt-1 text-center text-body-sm text-muted">
                Please enter your credentials to access your dashboard.
              </Text>
            </View>

            {errors.root?.message ? (
              <View
                className="mb-4 rounded-lg border border-absent bg-absent/10 p-3"
                accessibilityRole="alert"
              >
                <Text className="text-body-sm text-absent">{errors.root.message}</Text>
              </View>
            ) : null}

            <View className="gap-5">
              <Controller
                control={control}
                name="email"
                render={({ field }) => (
                  <FormTextInput
                    label="Email"
                    icon="mail"
                    placeholder="name@university.edu"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    textContentType="emailAddress"
                    returnKeyType="next"
                    error={errors.email?.message}
                    value={field.value}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
                    testID="login-email"
                  />
                )}
              />
              <Controller
                control={control}
                name="password"
                render={({ field }) => (
                  <FormTextInput
                    label="Password"
                    icon="lock"
                    placeholder="••••••••"
                    secure
                    autoCapitalize="none"
                    autoComplete="current-password"
                    textContentType="password"
                    returnKeyType="done"
                    onSubmitEditing={handleSubmit(onSubmit)}
                    error={errors.password?.message}
                    value={field.value}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
                    testID="login-password"
                  />
                )}
              />

              <View className="mt-1 items-end">
                <Pressable
                  onPress={() => router.push('/forgot-password')}
                  accessibilityRole="link"
                  accessibilityLabel="Forgot password?"
                  hitSlop={8}
                  testID="forgot-password-link"
                >
                  <Text className="py-2 text-caption text-secondary">Forgot password?</Text>
                </Pressable>
              </View>

              <View className="pt-1">
                <PrimaryButton
                  label="Log In"
                  loading={isSubmitting}
                  onPress={handleSubmit(onSubmit)}
                  testID="login-submit"
                />
              </View>
            </View>
          </View>
        </ScrollView>

        <View className="border-t border-border bg-surface p-4">
          <Text className="text-center text-body-sm text-muted">
            Don’t have an account?{' '}
            <Text
              onPress={() => router.push('/signup')}
              accessibilityRole="link"
              accessibilityLabel="Sign Up"
              className="font-semibold text-secondary"
            >
              Sign Up
            </Text>
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
