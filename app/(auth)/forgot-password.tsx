import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FormTextInput } from '@/components/ui/FormTextInput';
import { AppIcon } from '@/components/ui/AppIcon';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { useAuth } from '@/features/auth/useAuth';
import { forgotPasswordSchema, type ForgotPasswordFormValues } from '@/features/auth/validation';

/**
 * Forgot password screen (Stitch: "Forgot Password"). Sends a reset email via
 * useAuth().sendPasswordReset and shows a success state. "Back to Login"
 * returns to the login screen.
 */
export default function ForgotPasswordScreen() {
  const { sendPasswordReset } = useAuth();
  const router = useRouter();
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const [sent, setSent] = useState(false);

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    try {
      await sendPasswordReset(values.email);
      setSent(true);
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
          <View className="mx-auto mt-8 w-full max-w-md rounded-xl border border-border bg-surface p-8 shadow-sm">
            <View className="mb-6">
              <View className="mb-4 h-12 w-12 items-center justify-center rounded-full bg-secondary-fixed">
                <AppIcon name="lock_reset" size={24} color="#4a90e2" accessibilityLabel="Reset password" />
              </View>
              <Text className="text-display font-bold tracking-tight text-primary">
                Forgot password?
              </Text>
              <Text className="mt-1 text-body text-muted">
                Enter your email and we’ll send you a reset link.
              </Text>
            </View>

            {sent ? (
              <View
                className="rounded-lg border border-present bg-present/10 p-4"
                accessibilityRole="alert"
                testID="reset-sent"
              >
                <Text className="text-body-sm font-medium text-foreground">Reset link sent</Text>
                <Text className="mt-1 text-body-sm text-muted">
                  Check your inbox for an email with instructions to reset your password.
                </Text>
              </View>
            ) : (
              <>
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
                        label="Email address"
                        icon="mail"
                        placeholder="faculty@university.edu"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoComplete="email"
                        textContentType="emailAddress"
                        returnKeyType="done"
                        onSubmitEditing={handleSubmit(onSubmit)}
                        error={errors.email?.message}
                        value={field.value}
                        onChangeText={field.onChange}
                        onBlur={field.onBlur}
                        testID="forgot-email"
                      />
                    )}
                  />
                  <PrimaryButton
                    label="Send Reset Link"
                    loading={isSubmitting}
                    onPress={handleSubmit(onSubmit)}
                    testID="forgot-submit"
                  />
                </View>
              </>
            )}

            <View className="mt-6 border-t border-border pt-5">
              <Text
                onPress={() => router.back()}
                accessibilityRole="link"
                accessibilityLabel="Back to Login"
                className="flex-row items-center justify-center gap-1 text-center font-semibold text-secondary"
                testID="forgot-back"
              >
                <AppIcon name="arrow_back" size={16} color="#4a90e2" /> Back to Login
              </Text>
            </View>
          </View>

          <Text className="mt-8 text-center text-caption text-muted">
            Secure Institutional Portal
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
