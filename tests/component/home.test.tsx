import { fireEvent, render, screen } from '@testing-library/react-native';

import AppIndex from '../../app/(app)/index';

const mockSignOut = jest.fn();
jest.mock('@/features/auth/useAuth', () => ({
  useAuth: () => ({
    user: { uid: 'u1', email: 'a@b.com', displayName: 'Ada' },
    signOut: mockSignOut,
  }),
}));

describe('AppIndex (home)', () => {
  beforeEach(() => {
    mockSignOut.mockReset();
  });

  it('renders the signed-in teacher welcome', async () => {
    await render(<AppIndex />);
    expect(screen.getByText('Welcome, Ada')).toBeOnTheScreen();
  });

  it('calls signOut when the logout button is pressed', async () => {
    mockSignOut.mockResolvedValue(undefined);
    await render(<AppIndex />);

    await fireEvent.press(screen.getByTestId('logout-button'));

    expect(mockSignOut).toHaveBeenCalled();
  });

  it('blocks duplicate presses while signing out', async () => {
    let resolveSignOut: () => void = () => {};
    mockSignOut.mockImplementation(
      () => new Promise<void>((resolve) => (resolveSignOut = resolve)),
    );
    await render(<AppIndex />);

    const firstPress = fireEvent.press(screen.getByTestId('logout-button'));

    expect(await screen.findByText('Logging out…')).toBeOnTheScreen();
    expect(screen.getByTestId('logout-button')).toBeDisabled();

    await fireEvent.press(screen.getByTestId('logout-button'));
    expect(mockSignOut).toHaveBeenCalledTimes(1);

    resolveSignOut();
    await firstPress;
  });

  it('surfaces a friendly error and re-enables logout when sign-out fails', async () => {
    mockSignOut.mockRejectedValue(new Error('Something went wrong. Please try again.'));
    await render(<AppIndex />);

    await fireEvent.press(screen.getByTestId('logout-button'));

    expect(await screen.findByText('Something went wrong. Please try again.')).toBeOnTheScreen();
    expect(screen.getByTestId('logout-button')).toBeEnabled();
  });
});