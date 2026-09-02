import { fireEvent, render, screen } from '@testing-library/react-native';

import ForgotPasswordScreen from '../../app/(auth)/forgot-password';

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn(), back: jest.fn() }),
}));

const mockSendPasswordReset = jest.fn();
jest.mock('@/features/auth/useAuth', () => ({
  useAuth: () => ({ sendPasswordReset: mockSendPasswordReset }),
}));

describe('ForgotPasswordScreen', () => {
  beforeEach(() => {
    mockSendPasswordReset.mockReset();
  });

  it('renders the reset form', async () => {
    await render(<ForgotPasswordScreen />);
    expect(screen.getByText('Forgot password?')).toBeOnTheScreen();
    expect(screen.getByLabelText('Email address')).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Send Reset Link' })).toBeOnTheScreen();
  });

  it('sends a reset link for the entered email', async () => {
    mockSendPasswordReset.mockResolvedValue(undefined);
    await render(<ForgotPasswordScreen />);

    await fireEvent.changeText(screen.getByLabelText('Email address'), 'faculty@university.edu');
    await fireEvent.press(screen.getByRole('button', { name: 'Send Reset Link' }));

    expect(mockSendPasswordReset).toHaveBeenCalledWith('faculty@university.edu');
  });

  it('shows a success state after sending', async () => {
    mockSendPasswordReset.mockResolvedValue(undefined);
    await render(<ForgotPasswordScreen />);

    await fireEvent.changeText(screen.getByLabelText('Email address'), 'faculty@university.edu');
    await fireEvent.press(screen.getByRole('button', { name: 'Send Reset Link' }));

    expect(await screen.findByText('Reset link sent')).toBeOnTheScreen();
  });

  it('surfaces a friendly error when the reset request fails', async () => {
    mockSendPasswordReset.mockRejectedValue(new Error('That email address is not valid.'));
    await render(<ForgotPasswordScreen />);

    await fireEvent.changeText(screen.getByLabelText('Email address'), 'faculty@university.edu');
    await fireEvent.press(screen.getByRole('button', { name: 'Send Reset Link' }));

    expect(await screen.findByText('That email address is not valid.')).toBeOnTheScreen();
  });
});
