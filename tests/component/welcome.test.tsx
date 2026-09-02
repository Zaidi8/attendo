import { fireEvent, render, screen } from '@testing-library/react-native';

import WelcomeScreen from '../../app/(auth)/welcome';

const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

describe('WelcomeScreen', () => {
  beforeEach(() => {
    mockPush.mockReset();
  });

  it('renders the brand, value proposition and actions', async () => {
    await render(<WelcomeScreen />);

    expect(screen.getByText('Attendance made simple.')).toBeOnTheScreen();
    expect(
      screen.getByText('Manage classes, students and attendance in one simple place.'),
    ).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Get Started' })).toBeOnTheScreen();
    expect(screen.getByRole('link', { name: 'Already have an account? Log in' })).toBeOnTheScreen();
  });

  it('routes to login from Get Started', async () => {
    await render(<WelcomeScreen />);
    await fireEvent.press(screen.getByRole('button', { name: 'Get Started' }));
    expect(mockPush).toHaveBeenCalledWith('/login');
  });

  it('routes to login from the Log in link', async () => {
    await render(<WelcomeScreen />);
    await fireEvent.press(screen.getByRole('link', { name: 'Already have an account? Log in' }));
    expect(mockPush).toHaveBeenCalledWith('/login');
  });
});
