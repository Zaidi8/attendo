import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FormTextInput } from '@/components/ui/FormTextInput';
import { PrimaryButton } from '@/components/ui/PrimaryButton';import { useAuth } from '@/features/auth/useAuth';
import { signupSchema, type SignupFormValues } from '@/features/auth/validation';

/**
 * Sign up screen (Stitch: "Sign Up Screen"). Creates a teacher account (name,
 * email, password + confirm) via useAuth().signUp. On success the navigation
 * guard routes into the authenticated area. Field errors come from Zod.
 */
export default function SignupScreen() {
  const { signUp } = useAuth();
  const router = useRouter();
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { fullName: '', email: '', password: '', confirmPassword: '' },
  });

  const onSubmit = async (values: SignupFormValues) => {
    try {
      await signUp(values.fullName, values.email, values.password);
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
        <View className="border-b border-border bg-surface px-4 py-3">
          <Text className="text-headline-sm font-bold text-primary">Attendo</Text>
        </View>

        <ScrollView
          contentContainerClassName="flex-grow px-4 py-6"
          keyboardShouldPersistTaps="handled"
        >
          <View className="mx-auto w-full max-w-md rounded-xl border border-border bg-surface p-6">
            <View className="mb-5 text-center">
              <Text className="text-center text-display font-bold tracking-tight text-primary">
                Create account
              </Text>
              <Text className="mt-1 text-center text-body-sm text-muted">
                Join Attendo to manage attendance seamlessly.
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

            <View className="gap-4">
              <Controller
                control={control}
                name="fullName"
                render={({ field }) => (
                  <FormTextInput
                    label="Full name"
                    icon="person"
                    placeholder="Prof. Anderson"
                    autoCapitalize="words"
                    autoComplete="name"
                    textContentType="name"
                    returnKeyType="next"
                    error={errors.fullName?.message}
                    value={field.value}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
                    testID="signup-fullname"
                  />
                )}
              />
              <Controller
                control={control}
                name="email"
                render={({ field }) => (
                  <FormTextInput
                    label="Email address"
                    icon="mail"
                    placeholder="anderson@university.edu"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    textContentType="emailAddress"
                    returnKeyType="next"
                    error={errors.email?.message}
                    value={field.value}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
                    testID="signup-email"
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
                    autoComplete="new-password"
                    textContentType="newPassword"
                    returnKeyType="next"
                    error={errors.password?.message}
                    value={field.value}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
                    testID="signup-password"
                  />
                )}
              />
              <Controller
                control={control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormTextInput
                    label="Confirm password"
                    icon="lock_reset"
                    placeholder="••••••••"
                    secure
                    autoCapitalize="none"
                    autoComplete="new-password"
                    textContentType="newPassword"
                    returnKeyType="done"
                    onSubmitEditing={handleSubmit(onSubmit)}
                    error={errors.confirmPassword?.message}
                    value={field.value}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
                    testID="signup-confirm"
                  />
                )}
              />
              <View className="mt-1">
                <PrimaryButton
                  label="Create Account"
                  loading={isSubmitting}
                  onPress={handleSubmit(onSubmit)}
                  testID="signup-submit"
                />
              </View>
            </View>

            <View className="mt-6 items-center">
              <TouchableOpacity
                onPress={() => router.replace('/login')}
                accessibilityRole="link"
                accessibilityLabel="Log in"
                activeOpacity={0.6}
                hitSlop={8}
              >
                <Text className="text-center text-body-sm text-muted">
                  Already have an account? <Text className="font-semibold text-secondary">Log in</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
