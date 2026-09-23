import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { mapAuthError } from './errors';
import {
  sendPasswordReset as sendPasswordResetService,
  signIn as signInService,
  signInWithGoogle as signInWithGoogleService,
  signOutUser as signOutService,
  signUp as signUpService,
  subscribeToAuthState,
} from './service';
import type { AuthUser } from './types';

export interface AuthContextValue {
  /** The signed-in teacher, or null when signed out. */
  user: AuthUser | null;
  /** True until the first auth-state response resolves (hold navigation on splash). */
  initializing: boolean;
  signIn(email: string, password: string): Promise<void>;
  signInWithGoogle(): Promise<void>;
  signUp(fullName: string, email: string, password: string): Promise<void>;
  signOut(): Promise<void>;
  sendPasswordReset(email: string): Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthState {
  user: AuthUser | null;
  initializing: boolean;
}

/** Run an auth action, converting any Firebase error into a friendly message. */
async function withFriendlyError(action: () => Promise<unknown>): Promise<void> {
  try {
    await action();
  } catch (error) {
    throw new Error(mapAuthError(error));
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null, initializing: true });

  // Restore the persisted session and track sign-in/out. RN Firebase persists
  // auth to disk, so this fires with the cached user on relaunch.
  useEffect(() => {
    const unsubscribe = subscribeToAuthState((user) => {
      setState({ user, initializing: false });
    });
    return unsubscribe;
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: state.user,
      initializing: state.initializing,
      signIn: (email, password) => withFriendlyError(() => signInService(email, password)),
      signInWithGoogle: () => withFriendlyError(() => signInWithGoogleService()),
      signUp: (fullName, email, password) =>
        withFriendlyError(() => signUpService(fullName, email, password)),
      signOut: () => withFriendlyError(() => signOutService()),
      sendPasswordReset: (email) => withFriendlyError(() => sendPasswordResetService(email)),
    }),
    [state.user, state.initializing],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
