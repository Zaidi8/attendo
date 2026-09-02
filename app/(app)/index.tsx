import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '@/features/auth/useAuth';

/**
 * Authenticated home (Sprint 1 placeholder). Confirms the auth flow landed in
 * the protected `(app)` area and exposes logout. Replaced by the dashboard in
 * Sprint 7.
 */
export default function AppIndex() {
  const { user, signOut } = useAuth();

  const onSignOut = () => {
    void signOut();
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center px-4">
        <Text className="text-headline font-semibold text-foreground">
          Welcome{user?.displayName ? `, ${user.displayName}` : ''}
        </Text>
        <Text className="mt-1 text-body-sm text-muted">Dashboard arrives in a later sprint.</Text>
        <Pressable
          onPress={onSignOut}
          accessibilityRole="button"
          accessibilityLabel="Log out"
          className="mt-6 rounded-lg border border-border px-5 py-3"
          testID="logout-button"
        >
          <Text className="text-body font-semibold text-foreground">Log out</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
