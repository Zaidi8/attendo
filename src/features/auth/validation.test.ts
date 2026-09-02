import { type ZodError } from 'zod';

import { forgotPasswordSchema, loginSchema, signupSchema } from './validation';

/** Pull the first validation message for a given field from a Zod error. */
function messageFor(error: ZodError, field: string): string | undefined {
  return error.issues.find((issue) => issue.path[0] === field)?.message;
}

describe('loginSchema', () => {
  it('accepts a valid email and password', () => {
    const result = loginSchema.safeParse({ email: 'teacher@school.edu', password: 'secret1' });
    expect(result.success).toBe(true);
  });

  it('requires an email', () => {
    const result = loginSchema.safeParse({ email: '', password: 'secret1' });
    expect(result.success).toBe(false);
    if (!result.success) expect(messageFor(result.error, 'email')).toBe('Email is required');
  });

  it('rejects a malformed email', () => {
    const result = loginSchema.safeParse({ email: 'not-an-email', password: 'secret1' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(messageFor(result.error, 'email')).toBe('Enter a valid email address');
    }
  });

  it('requires a password', () => {
    const result = loginSchema.safeParse({ email: 'teacher@school.edu', password: '' });
    expect(result.success).toBe(false);
    if (!result.success) expect(messageFor(result.error, 'password')).toBe('Password is required');
  });

  it('trims surrounding whitespace from the email', () => {
    const result = loginSchema.safeParse({ email: '  teacher@school.edu  ', password: 'secret1' });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.email).toBe('teacher@school.edu');
  });
});

describe('signupSchema', () => {
  const valid = {
    fullName: 'Ada Teacher',
    email: 'ada@school.edu',
    password: 'secret1',
    confirmPassword: 'secret1',
  };

  it('accepts a fully valid signup', () => {
    expect(signupSchema.safeParse(valid).success).toBe(true);
  });

  it('requires a full name', () => {
    const result = signupSchema.safeParse({ ...valid, fullName: '   ' });
    expect(result.success).toBe(false);
    if (!result.success) expect(messageFor(result.error, 'fullName')).toBe('Full name is required');
  });

  it('rejects a password shorter than 6 characters', () => {
    const result = signupSchema.safeParse({ ...valid, password: 'abc', confirmPassword: 'abc' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(messageFor(result.error, 'password')).toBe('Password must be at least 6 characters');
    }
  });

  it('reports mismatched confirmation on the confirmPassword field', () => {
    const result = signupSchema.safeParse({ ...valid, confirmPassword: 'different' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(messageFor(result.error, 'confirmPassword')).toBe('Passwords do not match');
    }
  });
});

describe('forgotPasswordSchema', () => {
  it('accepts a valid email', () => {
    expect(forgotPasswordSchema.safeParse({ email: 'ada@school.edu' }).success).toBe(true);
  });

  it('rejects a malformed email', () => {
    const result = forgotPasswordSchema.safeParse({ email: 'nope' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(messageFor(result.error, 'email')).toBe('Enter a valid email address');
    }
  });
});
