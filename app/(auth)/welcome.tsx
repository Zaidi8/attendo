import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppIcon } from '@/components/ui/AppIcon';
import { PrimaryButton } from '@/components/ui/PrimaryButton';

/**
 * Welcome screen (Stitch: "Welcome Screen"). Entry point for unauthenticated
 * users (design.md §11: First launch → Welcome). A centred icon-composed
 * illustration, brand headline and short value proposition sit above two
 * actions: "Get Started" routes to login, and the "Already have account? Log
 * in" link does the same for returning teachers.
 */
export default function WelcomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-1 items-center justify-center bg-background px-6"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
      testID="welcome-screen"
    >
      {/* Illustration — icon composition per the Stitch design */}
      <View className="mb-10 h-72 w-72 items-center justify-center rounded-3xl border border-border bg-surface shadow-sm">
        <View className="flex-row flex-wrap items-center justify-center gap-4 px-6">
          <View
            className="h-24 w-24 items-center justify-center rounded-2xl bg-primary"
            style={{ transform: [{ rotate: '-6deg' }] }}
          >
            <AppIcon name="menu_book" size={44} color="#ffffff" />
          </View>
          <View
            className="h-24 w-24 items-center justify-center rounded-2xl bg-secondary-fixed"
            style={{ transform: [{ rotate: '5deg' }] }}
          >
            <AppIcon name="assignment" size={44} color="#1a2b3c" />
          </View>
          <View
            className="h-24 w-24 items-center justify-center rounded-2xl bg-secondary"
            style={{ transform: [{ rotate: '2deg' }] }}
          >
            <AppIcon name="school" size={44} color="#ffffff" />
          </View>
        </View>
      </View>

      {/* Typography & messaging */}
      <View className="w-full max-w-md items-center">
        <Text className="text-center text-display font-bold tracking-tight text-primary">
          Attendance made simple.
        </Text>
        <Text className="mt-4 px-4 text-center text-body text-muted">
          Manage classes, students and attendance in one simple place.
        </Text>
      </View>

      {/* Actions */}
      <View className="mt-12 w-full max-w-md">
        <View className="px-4">
          <PrimaryButton
            label="Get Started"
            onPress={() => router.push('/signup')}
            testID="welcome-get-started"
          />
        </View>

        <Pressable
          onPress={() => router.push('/login')}
          accessibilityRole="link"
          accessibilityLabel="Already have an account? Log in"
          hitSlop={8}
          className="mt-6 items-center"
          testID="welcome-login-link"
        >
          <Text className="text-body-sm text-muted">
            Already have account? <Text className="font-semibold text-secondary">Log in</Text>
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
