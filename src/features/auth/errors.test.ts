import { AUTH_ERROR_MESSAGES, mapAuthError } from './errors';

describe('mapAuthError', () => {
  it('maps invalid-email to the invalid-email message', () => {
    expect(mapAuthError({ code: 'auth/invalid-email' })).toBe(AUTH_ERROR_MESSAGES.invalidEmail);
  });

  it('collapses wrong-password to a generic credentials message (no account enumeration)', () => {
    expect(mapAuthError({ code: 'auth/wrong-password' })).toBe(
      AUTH_ERROR_MESSAGES.invalidCredentials,
    );
  });

  it('collapses user-not-found to the same credentials message', () => {
    expect(mapAuthError({ code: 'auth/user-not-found' })).toBe(
      AUTH_ERROR_MESSAGES.invalidCredentials,
    );
  });

  it('collapses invalid-credential to the same credentials message', () => {
    expect(mapAuthError({ code: 'auth/invalid-credential' })).toBe(
      AUTH_ERROR_MESSAGES.invalidCredentials,
    );
  });

  it('maps email-already-in-use to the email-in-use message', () => {
    expect(mapAuthError({ code: 'auth/email-already-in-use' })).toBe(AUTH_ERROR_MESSAGES.emailInUse);
  });

  it('maps user-disabled to the account-disabled message', () => {
    expect(mapAuthError({ code: 'auth/user-disabled' })).toBe(AUTH_ERROR_MESSAGES.accountDisabled);
  });

  it('maps weak-password to the weak-password message', () => {
    expect(mapAuthError({ code: 'auth/weak-password' })).toBe(AUTH_ERROR_MESSAGES.weakPassword);
  });

  it('maps too-many-requests to the rate-limit message', () => {
    expect(mapAuthError({ code: 'auth/too-many-requests' })).toBe(
      AUTH_ERROR_MESSAGES.tooManyRequests,
    );
  });

  it('maps network-request-failed to the network message', () => {
    expect(mapAuthError({ code: 'auth/network-request-failed' })).toBe(
      AUTH_ERROR_MESSAGES.networkError,
    );
  });

  it('maps operation-not-allowed to the operation-not-allowed message', () => {
    expect(mapAuthError({ code: 'auth/operation-not-allowed' })).toBe(
      AUTH_ERROR_MESSAGES.operationNotAllowed,
    );
  });

  it('maps a cancelled Google sign-in to a messages', () => {
    expect(mapAuthError(new Error('google/sign-in-cancelled'))).toBe(
      AUTH_ERROR_MESSAGES.signInCancelled,
    );
  });

  it('maps an unconfigured Google sign-in to a friendly message', () => {
    expect(mapAuthError(new Error('google/not-configured: Google Sign-In is not configured.'))).toBe(
      AUTH_ERROR_MESSAGES.googleNotConfigured,
    );
  });

  it('maps unavailable Google Play Services to a recovery message', () => {
    expect(mapAuthError(new Error('google/play-services-unavailable'))).toBe(
      AUTH_ERROR_MESSAGES.playServicesUnavailable,
    );
  });

  it('falls back to the generic message for an unknown code', () => {
    expect(mapAuthError({ code: 'auth/something-brand-new' })).toBe(AUTH_ERROR_MESSAGES.generic);
  });

  it('falls back to the generic message for non-object errors', () => {
    expect(mapAuthError('boom')).toBe(AUTH_ERROR_MESSAGES.generic);
    expect(mapAuthError(null)).toBe(AUTH_ERROR_MESSAGES.generic);
    expect(mapAuthError(undefined)).toBe(AUTH_ERROR_MESSAGES.generic);
    expect(mapAuthError({ noCode: true })).toBe(AUTH_ERROR_MESSAGES.generic);
  });
});
