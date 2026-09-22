import { Stack } from 'expo-router';

/**
 * `(auth)` route group: screens shown to unauthenticated users. The Welcome
 * screen is the first screen (design.md §11: First launch → Welcome), with
 * login, sign up, and forgot password reachable from it. Each screen renders
 * its own local header/chrome so the (auth) group stays a thin Stack
 * definition (architecture: thin route files).
 */
export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }} initialRouteName="welcome">
      <Stack.Screen name="welcome" />
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="forgot-password" />
    </Stack>
  );
}
