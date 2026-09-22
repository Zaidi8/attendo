import { fireEvent, render, screen } from '@testing-library/react-native';

import LoginScreen from '../../app/(auth)/login';

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn(), back: jest.fn() }),
}));

const mockSignIn = jest.fn();
jest.mock('@/features/auth/useAuth', () => ({
  useAuth: () => ({ signIn: mockSignIn }),
}));

describe('LoginScreen', () => {
  beforeEach(() => {
    mockSignIn.mockReset();
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
});
