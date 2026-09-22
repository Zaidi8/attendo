import { z } from 'zod';

/**
 * Zod schemas for the auth forms. Client validation is UX only — never the
 * security boundary (CLAUDE.md). `.trim()` normalises the email before it
 * reaches Firebase; the `.min(1)` checks are declared before `.email()` so an
 * empty field reports "required" rather than "invalid".
 */
const email = z.string().trim().min(1, 'Email is required').email('Enter a valid email address');

export const loginSchema = z.object({
  email,
  password: z.string().min(1, 'Password is required'),
});

export const signupSchema = z
  .object({
    fullName: z.string().trim().min(1, 'Full name is required'),
    email,
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const forgotPasswordSchema = z.object({ email });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type SignupFormValues = z.infer<typeof signupSchema>;
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
