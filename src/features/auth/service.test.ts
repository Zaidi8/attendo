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

import { sendPasswordReset, signIn, signOutUser, signUp, subscribeToAuthState } from './service';
import type { AuthUser } from './types';

jest.mock('@/services/firebase', () => ({
  firebaseAuth: jest.fn(),
  firebaseDb: jest.fn(),
}));

jest.mock('@react-native-firebase/auth', () => ({
  createUserWithEmailAndPassword: jest.fn(),
  onAuthStateChanged: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  updateProfile: jest.fn(),
}));

jest.mock('@react-native-firebase/firestore', () => ({
  doc: jest.fn(),
  serverTimestamp: jest.fn(),
  setDoc: jest.fn(),
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
