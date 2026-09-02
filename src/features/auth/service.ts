import { firebaseAuth, firebaseDb } from '@/services/firebase';

import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from '@react-native-firebase/auth';
import { doc, serverTimestamp, setDoc } from '@react-native-firebase/firestore';

import type { AuthUser } from './types';

/** Minimal Firebase user shape we read — avoids importing Firebase types here. */
interface FirebaseUserLike {
  uid: string;
  email: string | null;
  displayName: string | null;
}

function toAuthUser(user: FirebaseUserLike): AuthUser {
  return { uid: user.uid, email: user.email, displayName: user.displayName };
}

/** Sign in an existing teacher with email + password. Throws the raw Firebase
 *  error so the caller (useAuth) can map it to a friendly message. */
export async function signIn(email: string, password: string): Promise<AuthUser> {
  const credential = await signInWithEmailAndPassword(firebaseAuth(), email, password);
  return toAuthUser(credential.user);
}

/** Create a teacher account, set the display name, and seed the profile doc at
 *  `users/{uid}` (permitted by firestore.rules for the owning UID). */
export async function signUp(
  fullName: string,
  email: string,
  password: string,
): Promise<AuthUser> {
  const credential = await createUserWithEmailAndPassword(firebaseAuth(), email, password);
  await updateProfile(credential.user, { displayName: fullName });

  const profileRef = doc(firebaseDb(), 'users', credential.user.uid);
  await setDoc(
    profileRef,
    {
      uid: credential.user.uid,
      displayName: fullName,
      email,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );

  return { uid: credential.user.uid, email, displayName: fullName };
}

/** Sign the current teacher out. */
export async function signOutUser(): Promise<void> {
  await signOut(firebaseAuth());
}

/** Send a password-reset email. */
export async function sendPasswordReset(email: string): Promise<void> {
  await sendPasswordResetEmail(firebaseAuth(), email);
}

/** Subscribe to auth-state changes (persistent session restore lives here).
 *  Returns Firebase's unsubscribe handle. */
export function subscribeToAuthState(callback: (user: AuthUser | null) => void): () => void {
  return onAuthStateChanged(firebaseAuth(), (user) => {
    callback(user ? toAuthUser(user) : null);
  });
}
