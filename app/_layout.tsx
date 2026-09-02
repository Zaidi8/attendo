import '../global.css';

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppIcon } from '@/components/ui/AppIcon';
import { AuthProvider, useAuth } from '@/features/auth/useAuth';

/**
 * Root layout for the Attendo app.
 *
 * AuthProvider wraps the whole tree so auth state and actions are available.
 * <Stack.Protected> centralises the navigation guards (development-plan.md §7):
 * unauthenticated users land on `(auth)`, authenticated users on `(app)`, and
 * deep links to the wrong group redirect automatically. While the initial
 * auth-state response is pending we hold on a centred splash to avoid a flash
 * of the wrong screen.
 */
function RootNavigator() {
  const { user, initializing } = useAuth();

  if (initializing) {
    return (
      <View className="flex-1 items-center justify-center bg-secondary" testID="auth-splash">
        {/* Badge */}
        <View className="mb-8 h-[120px] w-[120px] items-center justify-center rounded-2xl bg-surface shadow-lg">
          <AppIcon name="school" size={64} color="#1a2b3c" accessibilityLabel="Attendo logo" />
        </View>

        {/* Brand */}
        <Text className="text-display font-bold text-surface">Attendo</Text>
        <Text className="mt-2 text-headline-sm text-surface/80">Attendance, simplified.</Text>

        {/* Loading dots */}
        <View className="absolute bottom-[80px] flex-row items-center gap-2">
          <View className="h-1.5 w-1.5 rounded-full bg-surface/40" />
          <View className="h-1.5 w-1.5 rounded-full bg-surface/60" />
          <View className="h-1.5 w-1.5 rounded-full bg-surface" />
        </View>
      </View>
    );
  }

  const isLoggedIn = user !== null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={isLoggedIn}>
        <Stack.Screen name="(app)" />
      </Stack.Protected>
      <Stack.Protected guard={!isLoggedIn}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <StatusBar style="dark" />
          <RootNavigator />
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
