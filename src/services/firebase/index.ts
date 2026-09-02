import { getApp } from '@react-native-firebase/app';
import { connectAuthEmulator, getAuth } from '@react-native-firebase/auth';
import { connectFirestoreEmulator, getFirestore } from '@react-native-firebase/firestore';

import { env } from '@/config/env';

export function firebaseApp() {
  return getApp();
}

export function firebaseAuth() {
  return getAuth(firebaseApp());
}

export function firebaseDb() {
  return getFirestore(firebaseApp());
}

let emulatorsConnected = false;

export function connectFirebaseEmulators(): void {
  if (emulatorsConnected) return;
  if (!(__DEV__ && env.useFirebaseEmulator)) return;

  connectAuthEmulator(firebaseAuth(), `http://${env.firebaseEmulatorHost}:9099`);
  connectFirestoreEmulator(firebaseDb(), env.firebaseEmulatorHost, 8080);
  emulatorsConnected = true;
}
