import { act, fireEvent, render, screen } from '@testing-library/react-native';

import LoginScreen from '../../app/(auth)/login';

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn(), back: jest.fn() }),
}));

const mockSignIn = jest.fn();
const mockSignInWithGoogle = jest.fn();
jest.mock('@/features/auth/useAuth', () => ({
  useAuth: () => ({ signIn: mockSignIn, signInWithGoogle: mockSignInWithGoogle }),
}));

describe('LoginScreen', () => {
  beforeEach(() => {
    mockSignIn.mockReset();
    mockSignInWithGoogle.mockReset();
  });

  it('renders the login form fields and actions', async () => {
    await render(<LoginScreen />);
    expect(screen.getByText('Welcome back')).toBeOnTheScreen();
    expect(screen.getByLabelText('Email')).toBeOnTheScreen();
    expect(screen.getByLabelText('Password')).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Log In' })).toBeOnTheScreen();
  });

  it('calls signIn with the entered credentials', async () => {
    mockSignIn.mockResolvedValue(undefined);
    await render(<LoginScreen />);

    await fireEvent.changeText(screen.getByLabelText('Email'), 'teacher@university.edu');
    await fireEvent.changeText(screen.getByLabelText('Password'), 'secret1');
    await fireEvent.press(screen.getByRole('button', { name: 'Log In' }));

    expect(mockSignIn).toHaveBeenCalledWith('teacher@university.edu', 'secret1');
  });

  it('surfaces a friendly error banner when sign-in fails', async () => {
    mockSignIn.mockRejectedValue(new Error('Incorrect email or password. Please try again.'));
    await render(<LoginScreen />);

    await fireEvent.changeText(screen.getByLabelText('Email'), 'teacher@university.edu');
    await fireEvent.changeText(screen.getByLabelText('Password'), 'wrong');
    await fireEvent.press(screen.getByRole('button', { name: 'Log In' }));

    expect(
      await screen.findByText('Incorrect email or password. Please try again.'),
    ).toBeOnTheScreen();
  });

  it('shows Zod validation errors for an empty form without calling signIn', async () => {
    await render(<LoginScreen />);

    await fireEvent.press(screen.getByRole('button', { name: 'Log In' }));

    expect(await screen.findByText('Email is required')).toBeOnTheScreen();
    expect(screen.getByText('Password is required')).toBeOnTheScreen();
    expect(mockSignIn).not.toHaveBeenCalled();
  });

  it('signs in with Google when the Google button is pressed', async () => {
    mockSignInWithGoogle.mockResolvedValue(undefined);
    await render(<LoginScreen />);

    await fireEvent.press(screen.getByRole('button', { name: 'Continue with Google' }));

    expect(mockSignInWithGoogle).toHaveBeenCalledTimes(1);
  });

  it('surfaces a friendly error banner when Google sign-in fails', async () => {
    mockSignInWithGoogle.mockRejectedValue(
      new Error('Google Sign-In is not set up yet. Please try again later.'),
    );
    await render(<LoginScreen />);

    await fireEvent.press(screen.getByRole('button', { name: 'Continue with Google' }));

    expect(
      await screen.findByText('Google Sign-In is not set up yet. Please try again later.'),
    ).toBeOnTheScreen();
  });

  it('keeps the other login method blocked while one is pending', async () => {
    let resolveGoogle: (() => void) | undefined;
    mockSignInWithGoogle.mockImplementation(
      () => new Promise<void>((resolve) => (resolveGoogle = resolve)),
    );
    await render(<LoginScreen />);

    // Start Google sign-in and keep it pending. We invoke the host onClick
    // directly because fireEvent.press awaits the handler's promise, which we
    // deliberately leave unresolved until the end of the test.
    const googleButton = screen.getByRole('button', { name: 'Continue with Google' });
    await act(async () => {
      googleButton.props.onClick();
    });
    expect(mockSignInWithGoogle).toHaveBeenCalledTimes(1);

    // While Google sign-in is pending, the Log In button is disabled and
    // pressing it cannot start the email flow.
    expect(screen.getByRole('button', { name: 'Log In' })).toBeDisabled();
    await fireEvent.press(screen.getByRole('button', { name: 'Log In' }));
    expect(mockSignIn).not.toHaveBeenCalled();

    await act(async () => {
      resolveGoogle?.();
    });
  });
});
