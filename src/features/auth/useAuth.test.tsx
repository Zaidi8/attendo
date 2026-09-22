import { act, renderHook } from '@testing-library/react-native';
import { type ReactNode } from 'react';

import { AUTH_ERROR_MESSAGES } from './errors';
import * as service from './service';
import type { AuthUser } from './types';
import { AuthProvider, useAuth } from './useAuth';

jest.mock('./service', () => ({
  subscribeToAuthState: jest.fn(),
  signIn: jest.fn(),
  signUp: jest.fn(),
  signOutUser: jest.fn(),
  sendPasswordReset: jest.fn(),
}));

const asMock = (fn: unknown): jest.Mock => fn as jest.Mock;

function Wrapper({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}

/** Wire subscribeToAuthState to a controllable emitter and return it. */
function captureAuthEmitter(): { emit: (user: AuthUser | null) => void } {
  const box = { emit: (_user: AuthUser | null) => {} };
  asMock(service.subscribeToAuthState).mockImplementation((cb: (user: AuthUser | null) => void) => {
    box.emit = cb;
    return () => {};
  });
  return box;
}

describe('AuthProvider / useAuth', () => {
  it('starts initializing, then resolves to signed-out once Firebase responds', async () => {
    const box = captureAuthEmitter();
    const { result } = await renderHook(() => useAuth(), { wrapper: Wrapper });

    expect(result.current.initializing).toBe(true);
    expect(result.current.user).toBeNull();

    await act(() => {
      box.emit(null);
    });

    expect(result.current.initializing).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it('exposes the signed-in user emitted by the auth subscription', async () => {
    const box = captureAuthEmitter();
    const { result } = await renderHook(() => useAuth(), { wrapper: Wrapper });

    const user: AuthUser = { uid: 'u1', email: 'a@b.com', displayName: 'Ada' };
    await act(() => {
      box.emit(user);
    });

    expect(result.current.user).toEqual(user);
    expect(result.current.initializing).toBe(false);
  });

  it('delegates signIn to the service', async () => {
    captureAuthEmitter();
    asMock(service.signIn).mockResolvedValue({ uid: 'u1', email: 'a@b.com', displayName: null });
    const { result } = await renderHook(() => useAuth(), { wrapper: Wrapper });

    await result.current.signIn('a@b.com', 'secret1');

    expect(service.signIn).toHaveBeenCalledWith('a@b.com', 'secret1');
  });

  it('throws a friendly message when signIn fails', async () => {
    captureAuthEmitter();
    asMock(service.signIn).mockRejectedValue({ code: 'auth/invalid-credential' });
    const { result } = await renderHook(() => useAuth(), { wrapper: Wrapper });

    await expect(result.current.signIn('a@b.com', 'x')).rejects.toThrow(
      AUTH_ERROR_MESSAGES.invalidCredentials,
    );
  });

  it('delegates signUp to the service', async () => {
    captureAuthEmitter();
    asMock(service.signUp).mockResolvedValue({ uid: 'u2', email: 'n@b.com', displayName: 'Grace' });
    const { result } = await renderHook(() => useAuth(), { wrapper: Wrapper });

    await result.current.signUp('Grace', 'n@b.com', 'secret1');

    expect(service.signUp).toHaveBeenCalledWith('Grace', 'n@b.com', 'secret1');
  });

  it('delegates signOut to the service', async () => {
    captureAuthEmitter();
    asMock(service.signOutUser).mockResolvedValue(undefined);
    const { result } = await renderHook(() => useAuth(), { wrapper: Wrapper });

    await result.current.signOut();

    expect(service.signOutUser).toHaveBeenCalled();
  });

  it('delegates sendPasswordReset to the service', async () => {
    captureAuthEmitter();
    asMock(service.sendPasswordReset).mockResolvedValue(undefined);
    const { result } = await renderHook(() => useAuth(), { wrapper: Wrapper });

    await result.current.sendPasswordReset('a@b.com');

    expect(service.sendPasswordReset).toHaveBeenCalledWith('a@b.com');
  });

  it('unsubscribes from auth state on unmount', async () => {
    const unsubscribe = jest.fn();
    asMock(service.subscribeToAuthState).mockReturnValue(unsubscribe);
    const { unmount } = await renderHook(() => useAuth(), { wrapper: Wrapper });

    await unmount();

    expect(unsubscribe).toHaveBeenCalled();
  });

  it('throws when used outside an AuthProvider', async () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    await expect(renderHook(() => useAuth())).rejects.toThrow(
      'must be used within an AuthProvider',
    );
    spy.mockRestore();
  });
});
