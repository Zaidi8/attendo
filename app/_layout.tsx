import '../global.css';

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider, useAuth } from '@/features/auth/useAuth';

/**
 * Root layout for the Attendo app.
 *
 * AuthProvider wraps the whole tree so auth state and actions are available.
 * <Stack.Protected> centralises the navigation guards (development-plan.md §7):
 * unauthenticated users land on `(auth)`, authenticated users on `(app)`, and
 * deep links to the wrong group redirect automatically. The native splash
 * (app.json) stays visible until auth state resolves, so we render nothing
 * while `initializing` to avoid a flash of the wrong screen.
 */
function RootNavigator() {
  const { user, initializing } = useAuth();

  if (initializing) {
    return null;
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
