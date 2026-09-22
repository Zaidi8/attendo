/**
 * Centralised mapping from Firebase Auth error codes to friendly, user-facing
 * messages. Screens must never surface raw Firebase errors (design.md §20).
 *
 * Sign-in failures (`wrong-password`, `user-not-found`, `invalid-credential`)
 * deliberately collapse to a single generic message so we don't reveal whether
 * an email is registered (account-enumeration protection).
 */
export const AUTH_ERROR_MESSAGES = {
  invalidEmail: 'That email address is not valid.',
  invalidCredentials: 'Incorrect email or password. Please try again.',
  accountDisabled: 'This account has been disabled. Please contact support.',
  emailInUse: 'An account already exists for that email address.',
  weakPassword: 'Please choose a stronger password (at least 6 characters).',
  tooManyRequests: 'Too many attempts. Please wait a moment and try again.',
  networkError: 'Network error. Please check your connection and try again.',
  operationNotAllowed: 'Email and password sign-in is not enabled.',
  signInCancelled: 'Sign-in was cancelled. Please try again.',
  googleNotConfigured: 'Google Sign-In is not set up yet. Please try again later.',
  generic: 'Something went wrong. Please try again.',
} as const;

const CODE_TO_MESSAGE: Record<string, string> = {
  'auth/invalid-email': AUTH_ERROR_MESSAGES.invalidEmail,
  'auth/user-disabled': AUTH_ERROR_MESSAGES.accountDisabled,
  'auth/user-not-found': AUTH_ERROR_MESSAGES.invalidCredentials,
  'auth/wrong-password': AUTH_ERROR_MESSAGES.invalidCredentials,
  'auth/invalid-credential': AUTH_ERROR_MESSAGES.invalidCredentials,
  'auth/email-already-in-use': AUTH_ERROR_MESSAGES.emailInUse,
  'auth/weak-password': AUTH_ERROR_MESSAGES.weakPassword,
  'auth/too-many-requests': AUTH_ERROR_MESSAGES.tooManyRequests,
  'auth/network-request-failed': AUTH_ERROR_MESSAGES.networkError,
  'auth/operation-not-allowed': AUTH_ERROR_MESSAGES.operationNotAllowed,
  'google/sign-in-cancelled': AUTH_ERROR_MESSAGES.signInCancelled,
  'google/not-configured': AUTH_ERROR_MESSAGES.googleNotConfigured,
  'google/no-id-token': AUTH_ERROR_MESSAGES.generic,
};

function extractCode(error: unknown): string | undefined {
  if (typeof error === 'object' && error !== null && 'code' in error) {
    const { code } = error as { code: unknown };
    if (typeof code === 'string') return code;
  }
  // Service-thrown errors (Google flow) are plain Errors whose message embeds
  // the code, e.g. "google/not-configured: ..." or just "google/sign-in-cancelled".
  if (error instanceof Error) {
    const prefixed = /^([\w./-]+):/.exec(error.message);
    if (prefixed) return prefixed[1];
    const bare = /^[\w./-]+$/.exec(error.message);
    if (bare) return bare[0];
  }
  return undefined;
}

/** Convert any thrown auth error into a safe, friendly message. */
export function mapAuthError(error: unknown): string {
  const code = extractCode(error);
  if (code && code in CODE_TO_MESSAGE) {
    return CODE_TO_MESSAGE[code];
  }
  return AUTH_ERROR_MESSAGES.generic;
}
