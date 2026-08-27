// Firebase access for Attendo (React Native Firebase, modular API).
//
// React Native Firebase auto-initializes the default app at launch from the
// native google-services.json / GoogleService-Info.plist, so there is NO manual
// initializeApp() with client keys here. These accessors return the modular
// Auth / Firestore instances; return types are inferred from the SDK.
//
// Firestore is the cloud source of truth and provides offline persistence and
// synchronization out of the box — do not build a custom sync engine.

import { getApp } from '@react-native-firebase/app';
import { connectAuthEmulator, getAuth } from '@react-native-firebase/auth';
import { connectFirestoreEmulator, getFirestore } from '@react-native-firebase/firestore';

import { env } from '@/config/env';

/** The default Firebase app (auto-initialized from native config). */
export function firebaseApp() {
  return getApp();
}

/** Firebase Authentication instance. */
export function firebaseAuth() {
  return getAuth(firebaseApp());
}

/** Cloud Firestore instance. */
export function firebaseDb() {
  return getFirestore(firebaseApp());
}

let emulatorsConnected = false;

/**
 * Route Auth + Firestore to the local Firebase emulators. Call once during app
 * startup. No-op unless running in dev with EXPO_PUBLIC_USE_FIREBASE_EMULATOR
 * enabled. Ports mirror firebase.json.
 */
export function connectFirebaseEmulators(): void {
  if (emulatorsConnected) return;
  if (!(__DEV__ && env.useFirebaseEmulator)) return;

  connectAuthEmulator(firebaseAuth(), `http://${env.firebaseEmulatorHost}:9099`);
  connectFirestoreEmulator(firebaseDb(), env.firebaseEmulatorHost, 8080);
  emulatorsConnected = true;
}
