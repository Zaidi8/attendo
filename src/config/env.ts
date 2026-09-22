// Centralized, typed access to public environment configuration.
//
// All values come from EXPO_PUBLIC_* variables, which Expo inlines into the
// client bundle at build time. These are NOT secrets — never read server-only
// secrets here. Zod-based runtime validation is introduced alongside forms in a
// later sprint; for now this provides typed, defaulted access.

export type AppEnvironment = 'dev' | 'production';

function readString(value: string | undefined, fallback: string): string {
  return value !== undefined && value.length > 0 ? value : fallback;
}

function readBoolean(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined || value.length === 0) return fallback;
  return value === 'true' || value === '1';
}

export const env = {
  /** Target Firebase environment. */
  appEnv: readString(process.env.EXPO_PUBLIC_ENV, 'dev') as AppEnvironment,
  /** Whether to route Firebase calls to local emulators (dev only). */
  useFirebaseEmulator: readBoolean(process.env.EXPO_PUBLIC_USE_FIREBASE_EMULATOR, false),
  /** Host the emulators listen on (used only when useFirebaseEmulator is true). */
  firebaseEmulatorHost: readString(process.env.EXPO_PUBLIC_FIREBASE_EMULATOR_HOST, '127.0.0.1'),
} as const;

export const isDev = env.appEnv === 'dev';
export const isProduction = env.appEnv === 'production';
