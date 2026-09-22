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

import {
  sendPasswordReset,
  signIn,
  signInWithGoogle,
  signOutUser,
  signUp,
  subscribeToAuthState,
} from './service';
import type { AuthUser } from './types';

jest.mock('@/services/firebase', () => ({
  firebaseAuth: jest.fn(),
  firebaseDb: jest.fn(),
}));

jest.mock('@react-native-firebase/auth', () => ({
  GoogleAuthProvider: { credential: jest.fn() },
  createUserWithEmailAndPassword: jest.fn(),
  deleteUser: jest.fn(),
  onAuthStateChanged: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
  signInWithCredential: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  updateProfile: jest.fn(),
}));

jest.mock('@react-native-firebase/firestore', () => ({
  deleteDoc: jest.fn(),
  doc: jest.fn(),
  serverTimestamp: jest.fn(),
  setDoc: jest.fn(),
}));

jest.mock('@react-native-google-signin/google-signin', () => ({
  GoogleSignin: {
    configure: jest.fn(),
    signIn: jest.fn(),
    hasPlayServices: jest.fn(),
  },
}));

const googleWebClientIdHolder: { value: string } = { value: '' };
jest.mock('@/config/env', () => ({
  env: {
    get googleWebClientId() {
      return googleWebClientIdHolder.value;
    },
  },
}));

const asMock = (fn: unknown): jest.Mock => fn as jest.Mock;

const mockAuthInstance = { id: 'auth-instance' };
const mockDbInstance = { id: 'db-instance' };
const mockDocRef = { path: 'users/uid' };

beforeEach(() => {
  asMock(firebaseAuth).mockReturnValue(mockAuthInstance);
  asMock(firebaseDb).mockReturnValue(mockDbInstance);
  asMock(doc).mockReturnValue(mockDocRef);
  asMock(serverTimestamp).mockReturnValue('SERVER_TS');
});

describe('signIn', () => {
  it('calls Firebase with the auth instance, email and password', async () => {
    asMock(signInWithEmailAndPassword).mockResolvedValue({
      user: { uid: 'u1', email: 'a@b.com', displayName: 'Ada' },
    });
    await signIn('a@b.com', 'secret1');
    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(mockAuthInstance, 'a@b.com', 'secret1');
  });

  it('maps the Firebase user to a domain AuthUser (dropping extra fields)', async () => {
    asMock(signInWithEmailAndPassword).mockResolvedValue({
      user: { uid: 'u1', email: 'a@b.com', displayName: 'Ada', refreshToken: 'secret' },
    });
    const user = await signIn('a@b.com', 'secret1');
    expect(user).toEqual({ uid: 'u1', email: 'a@b.com', displayName: 'Ada' });
  });

  it('propagates Firebase errors unchanged (mapping happens at the hook)', async () => {
    const failure = { code: 'auth/invalid-credential' };
    asMock(signInWithEmailAndPassword).mockRejectedValue(failure);
    await expect(signIn('a@b.com', 'x')).rejects.toBe(failure);
  });
});

describe('signInWithGoogle', () => {
  beforeEach(() => {
    googleWebClientIdHolder.value = 'web-client-a';
    asMock(GoogleSignin.configure).mockClear();
    asMock(GoogleSignin.signIn).mockClear();
    asMock(signInWithCredential).mockClear();
    asMock(GoogleAuthProvider.credential).mockClear();
  });

  it('throws a friendly error when the web client id is not configured', async () => {
    googleWebClientIdHolder.value = '';
    await expect(signInWithGoogle()).rejects.toThrow('google/not-configured');
    expect(GoogleSignin.signIn).not.toHaveBeenCalled();
  });

  it('maps a cancelled Google dialog to a sign-in-cancelled error', async () => {
    asMock(GoogleSignin.signIn).mockResolvedValue({ type: 'cancelled' });

    await expect(signInWithGoogle()).rejects.toThrow('google/sign-in-cancelled');
    expect(signInWithCredential).not.toHaveBeenCalled();
  });

  it('exchanges the Google ID token for a Firebase credential and maps the user', async () => {
    asMock(GoogleSignin.signIn).mockResolvedValue({
      type: 'success',
      data: { user: { id: 'g1' }, idToken: 'gt-123', scopes: [] },
    });
    asMock(GoogleAuthProvider.credential).mockReturnValue({
      providerId: 'google.com',
      token: 'gt-123',
    } as never);
    asMock(signInWithCredential).mockResolvedValue({
      user: { uid: 'g1', email: 'g@b.com', displayName: 'Grace' },
    } as never);

    const user = await signInWithGoogle();

    expect(GoogleSignin.configure).toHaveBeenCalledWith({ webClientId: 'web-client-a' });
    expect(GoogleAuthProvider.credential).toHaveBeenCalledWith('gt-123');
    expect(signInWithCredential).toHaveBeenCalledWith(mockAuthInstance, {
      providerId: 'google.com',
      token: 'gt-123',
    });
    expect(user).toEqual({ uid: 'g1', email: 'g@b.com', displayName: 'Grace' });
  });
});

describe('signUp', () => {
  it('creates the account, sets the display name, and writes the profile doc', async () => {
    const createdUser = { uid: 'u2', email: 'new@b.com', displayName: null };
    asMock(createUserWithEmailAndPassword).mockResolvedValue({ user: createdUser });
    asMock(updateProfile).mockResolvedValue(undefined);
    asMock(setDoc).mockResolvedValue(undefined);

    const result = await signUp('Grace Teacher', 'new@b.com', 'secret1');

    expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
      mockAuthInstance,
      'new@b.com',
      'secret1',
    );
    expect(updateProfile).toHaveBeenCalledWith(createdUser, { displayName: 'Grace Teacher' });
    expect(doc).toHaveBeenCalledWith(mockDbInstance, 'users', 'u2');

    const [ref, payload] = asMock(setDoc).mock.calls[0];
    expect(ref).toBe(mockDocRef);
    expect(payload).toMatchObject({
      uid: 'u2',
      displayName: 'Grace Teacher',
      email: 'new@b.com',
      createdAt: 'SERVER_TS',
    });

    expect(result).toEqual({ uid: 'u2', email: 'new@b.com', displayName: 'Grace Teacher' });
  });

  it('deletes the profile and auth user when the profile write fails, then rethrows', async () => {
    const createdUser = { uid: 'u2', email: 'new@b.com', displayName: null };
    asMock(createUserWithEmailAndPassword).mockResolvedValue({ user: createdUser });
    asMock(updateProfile).mockResolvedValue(undefined);
    const failure = { code: 'permission-denied' };
    asMock(setDoc).mockRejectedValue(failure);
    asMock(deleteDoc).mockResolvedValue(undefined);
    asMock(deleteUser).mockResolvedValue(undefined);

    await expect(signUp('Grace Teacher', 'new@b.com', 'secret1')).rejects.toBe(failure);

    expect(deleteDoc).toHaveBeenCalledWith(mockDocRef);
    expect(deleteUser).toHaveBeenCalledWith(createdUser);
    expect(signOut).not.toHaveBeenCalled();
  });

  it('compensates when updating the display name fails', async () => {
    const createdUser = { uid: 'u2', email: 'new@b.com', displayName: null };
    asMock(createUserWithEmailAndPassword).mockResolvedValue({ user: createdUser });
    const failure = { code: 'auth/network-request-failed' };
    asMock(updateProfile).mockRejectedValue(failure);
    asMock(deleteDoc).mockResolvedValue(undefined);
    asMock(deleteUser).mockResolvedValue(undefined);

    await expect(signUp('Grace Teacher', 'new@b.com', 'secret1')).rejects.toBe(failure);

    expect(setDoc).not.toHaveBeenCalled();
    expect(deleteDoc).toHaveBeenCalledWith(mockDocRef);
    expect(deleteUser).toHaveBeenCalledWith(createdUser);
  });

  it('falls back to signing out when deleting the created user fails', async () => {
    const createdUser = { uid: 'u2', email: 'new@b.com', displayName: null };
    asMock(createUserWithEmailAndPassword).mockResolvedValue({ user: createdUser });
    asMock(updateProfile).mockResolvedValue(undefined);
    const failure = { code: 'permission-denied' };
    asMock(setDoc).mockRejectedValue(failure);
    asMock(deleteDoc).mockResolvedValue(undefined);
    asMock(deleteUser).mockRejectedValue({ code: 'auth/requires-recent-login' });
    asMock(signOut).mockResolvedValue(undefined);

    await expect(signUp('Grace Teacher', 'new@b.com', 'secret1')).rejects.toBe(failure);

    expect(deleteUser).toHaveBeenCalledWith(createdUser);
    expect(signOut).toHaveBeenCalledWith(mockAuthInstance);
  });
});

describe('signOutUser', () => {
  it('signs out of the auth instance', async () => {
    asMock(signOut).mockResolvedValue(undefined);
    await signOutUser();
    expect(signOut).toHaveBeenCalledWith(mockAuthInstance);
  });
});

describe('sendPasswordReset', () => {
  it('requests a reset email for the address', async () => {
    asMock(sendPasswordResetEmail).mockResolvedValue(undefined);
    await sendPasswordReset('a@b.com');
    expect(sendPasswordResetEmail).toHaveBeenCalledWith(mockAuthInstance, 'a@b.com');
  });
});

describe('subscribeToAuthState', () => {
  it('emits a mapped AuthUser when Firebase reports a signed-in user', () => {
    let captured: ((user: unknown) => void) | undefined;
    asMock(onAuthStateChanged).mockImplementation(
      (_auth: unknown, cb: (user: unknown) => void) => {
        captured = cb;
        return () => {};
      },
    );

    const received: (AuthUser | null)[] = [];
    subscribeToAuthState((user) => received.push(user));
    captured?.({ uid: 'u3', email: 'c@d.com', displayName: 'Carol', refreshToken: 'x' });

    expect(received[0]).toEqual({ uid: 'u3', email: 'c@d.com', displayName: 'Carol' });
  });

  it('emits null when Firebase reports no user', () => {
    let captured: ((user: unknown) => void) | undefined;
    asMock(onAuthStateChanged).mockImplementation(
      (_auth: unknown, cb: (user: unknown) => void) => {
        captured = cb;
        return () => {};
      },
    );

    const received: (AuthUser | null)[] = [];
    subscribeToAuthState((user) => received.push(user));
    captured?.(null);

    expect(received[0]).toBeNull();
  });

  it('returns the unsubscribe handle from Firebase', () => {
    const unsubscribe = jest.fn();
    asMock(onAuthStateChanged).mockReturnValue(unsubscribe);
    expect(subscribeToAuthState(() => {})).toBe(unsubscribe);
  });
});
