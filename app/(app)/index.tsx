import { useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '@/features/auth/useAuth';

/**
 * Authenticated home (Sprint 1 placeholder). Confirms the auth flow landed in
 * the protected `(app)` area and exposes logout. Replaced by the dashboard in
 * Sprint 7.
 */
export default function AppIndex() {
  const { user, signOut } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState<string | null>(null);

  const onSignOut = async () => {
    if (isSigningOut) return;
    setSignOutError(null);
    setIsSigningOut(true);
    try {
      await signOut();
    } catch (error) {
      setSignOutError(error instanceof Error ? error.message : 'Something went wrong.');
      setIsSigningOut(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center px-4">
        <Text className="text-headline font-semibold text-foreground">
          Welcome{user?.displayName ? `, ${user.displayName}` : ''}
        </Text>
        <Text className="mt-1 text-body-sm text-muted">Dashboard arrives in a later sprint.</Text>

        {signOutError ? (
          <View
            className="mt-4 rounded-lg border border-absent bg-absent/10 p-3"
            accessibilityRole="alert"
            testID="logout-error"
          >
            <Text className="text-body-sm text-absent">{signOutError}</Text>
          </View>
        ) : null}

        <TouchableOpacity
          onPress={onSignOut}
          disabled={isSigningOut}
          accessibilityRole="button"
          accessibilityLabel="Log out"
          accessibilityState={{ disabled: isSigningOut, busy: isSigningOut }}
          activeOpacity={0.6}
          className="mt-6 flex-row items-center gap-2 rounded-lg border border-border px-5 py-3"
          testID="logout-button"
        >
          {isSigningOut ? (
            <ActivityIndicator size="small" color="#1a2b3c" testID="logout-spinner" />
          ) : null}
          <Text className="text-body font-semibold text-foreground">
            {isSigningOut ? 'Logging out…' : 'Log out'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
