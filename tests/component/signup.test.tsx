import { fireEvent, render, screen } from '@testing-library/react-native';

import SignupScreen from '../../app/(auth)/signup';

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn(), back: jest.fn() }),
}));

const mockSignUp = jest.fn();
jest.mock('@/features/auth/useAuth', () => ({
  useAuth: () => ({ signUp: mockSignUp }),
}));

describe('SignupScreen', () => {
  beforeEach(() => {
    mockSignUp.mockReset();
  });

  it('renders all sign-up fields and the submit action', async () => {
    await render(<SignupScreen />);
    expect(screen.getByText('Create account')).toBeOnTheScreen();
    expect(screen.getByLabelText('Full name')).toBeOnTheScreen();
    expect(screen.getByLabelText('Email address')).toBeOnTheScreen();
    expect(screen.getByLabelText('Password')).toBeOnTheScreen();
    expect(screen.getByLabelText('Confirm password')).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Create Account' })).toBeOnTheScreen();
  });

  it('calls signUp with the entered name, email and password', async () => {
    mockSignUp.mockResolvedValue(undefined);
    await render(<SignupScreen />);

    await fireEvent.changeText(screen.getByLabelText('Full name'), 'Grace Teacher');
    await fireEvent.changeText(screen.getByLabelText('Email address'), 'grace@university.edu');
    await fireEvent.changeText(screen.getByLabelText('Password'), 'secret1');
    await fireEvent.changeText(screen.getByLabelText('Confirm password'), 'secret1');
    await fireEvent.press(screen.getByRole('button', { name: 'Create Account' }));

    expect(mockSignUp).toHaveBeenCalledWith('Grace Teacher', 'grace@university.edu', 'secret1');
  });

  it('reports a mismatch between password and confirm password without calling signUp', async () => {
    await render(<SignupScreen />);

    await fireEvent.changeText(screen.getByLabelText('Full name'), 'Grace Teacher');
    await fireEvent.changeText(screen.getByLabelText('Email address'), 'grace@university.edu');
    await fireEvent.changeText(screen.getByLabelText('Password'), 'secret1');
    await fireEvent.changeText(screen.getByLabelText('Confirm password'), 'secret2');
    await fireEvent.press(screen.getByRole('button', { name: 'Create Account' }));

    expect(await screen.findByText('Passwords do not match')).toBeOnTheScreen();
    expect(mockSignUp).not.toHaveBeenCalled();
  });

  it('surfaces a friendly error banner when account creation fails', async () => {
    mockSignUp.mockRejectedValue(new Error('An account already exists for that email address.'));
    await render(<SignupScreen />);

    await fireEvent.changeText(screen.getByLabelText('Full name'), 'Grace Teacher');
    await fireEvent.changeText(screen.getByLabelText('Email address'), 'grace@university.edu');
    await fireEvent.changeText(screen.getByLabelText('Password'), 'secret1');
    await fireEvent.changeText(screen.getByLabelText('Confirm password'), 'secret1');
    await fireEvent.press(screen.getByRole('button', { name: 'Create Account' }));

    expect(
      await screen.findByText('An account already exists for that email address.'),
    ).toBeOnTheScreen();
  });
});
