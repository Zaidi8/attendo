import { firebaseAuth, firebaseDb } from '@/services/firebase';

import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  deleteUser,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithCredential,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { deleteDoc, doc, serverTimestamp, setDoc } from '@react-native-firebase/firestore';

import { env } from '@/config/env';

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

/** Sign in a teacher with Google. Requires the Google provider to be enabled in
 *  the Firebase console and EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID to be set; throws
 *  a Google Sign-In error otherwise (mapped in useAuth/errors). Configure is
 *  idempotent, so it runs on each call. */
export function configureGoogleSignIn(): void {
  if (!env.googleWebClientId) return;
  GoogleSignin.configure({ webClientId: env.googleWebClientId });
}

export async function signInWithGoogle(): Promise<AuthUser> {
  configureGoogleSignIn();
  if (!env.googleWebClientId) {
    throw new Error('google/not-configured: Google Sign-In is not configured.');
  }

  // Android requires an up-to-date Google Play Services install; the library
  // shows its supported update dialog when showPlayServicesUpdateDialog is set.
  const playServicesAvailable = await GoogleSignin.hasPlayServices({
    showPlayServicesUpdateDialog: true,
  });
  if (!playServicesAvailable) {
    throw new Error('google/play-services-unavailable');
  }

  const signInResult = await GoogleSignin.signIn();
  if (signInResult.type === 'cancelled') {
    throw new Error('google/sign-in-cancelled');
  }

  const idToken = signInResult.data.idToken;
  if (!idToken) {
    throw new Error('google/no-id-token: Google did not return an ID token.');
  }

  const googleCredential = GoogleAuthProvider.credential(idToken);
  const credential = await signInWithCredential(firebaseAuth(), googleCredential);
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
  const user = credential.user;
  const profileRef = doc(firebaseDb(), 'users', user.uid);

  try {
    await updateProfile(user, { displayName: fullName });

    await setDoc(
      profileRef,
      {
        uid: user.uid,
        displayName: fullName,
        email,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
  } catch (error) {
    try {
      await deleteDoc(profileRef);
    } catch {
      // document was never written; nothing to clean up
    }
    try {
      await deleteUser(user);
    } catch {
      await signOut(firebaseAuth());
    }
    throw error;
  }

  return { uid: user.uid, email, displayName: fullName };
}

/** Sign the current teacher out of both Firebase and the native Google SDK, so
 *  a later Google login shows the account chooser instead of reusing the
 *  retained account (issue #6). Google cleanup is best-effort: Firebase
 *  logout still runs when it fails. */
export async function signOutUser(): Promise<void> {
  try {
    await GoogleSignin.signOut();
  } catch {
    // No native Google session to clear (e.g. signed in with email) — continue.
  }
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
