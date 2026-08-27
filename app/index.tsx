import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/**
 * Placeholder entry screen for Sprint 0.
 *
 * Confirms the router, NativeWind styling, and design tokens are wired.
 * Replaced by the real auth/onboarding entry flow starting in Sprint 1.
 */
export default function Index() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center px-4">
        <Text className="text-2xl font-bold text-foreground">Attendo</Text>
        <Text className="mt-2 text-base text-muted">Project bootstrap complete.</Text>
      </View>
    </SafeAreaView>
  );
}
