import { Stack } from 'expo-router';

/**
 * `(app)` route group: authenticated screens. Reachable only when signed in
 * (guarded in the root layout). Kept as a thin Stack definition; feature
 * screens are added in their respective sprints.
 */
export default function AppLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
