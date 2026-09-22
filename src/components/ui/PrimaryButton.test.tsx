import { fireEvent, render, screen } from '@testing-library/react-native';

import { PrimaryButton } from './PrimaryButton';

describe('PrimaryButton', () => {
  it('renders its label', async () => {
    await render(<PrimaryButton label="Log In" onPress={() => {}} />);
    expect(screen.getByText('Log In')).toBeOnTheScreen();
  });

  it('calls onPress when tapped', async () => {
    const onPress = jest.fn();
    await render(<PrimaryButton label="Log In" onPress={onPress} />);

    fireEvent.press(screen.getByRole('button', { name: 'Log In' }));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('blocks presses and reports a busy state while loading', async () => {
    const onPress = jest.fn();
    await render(<PrimaryButton label="Log In" onPress={onPress} loading />);

    const button = screen.getByRole('button', { name: 'Log In' });
    expect(button).toBeDisabled();

    fireEvent.press(button);
    expect(onPress).not.toHaveBeenCalled();
  });

  it('does not fire onPress when disabled', async () => {
    const onPress = jest.fn();
    await render(<PrimaryButton label="Continue" onPress={onPress} disabled />);

    const button = screen.getByRole('button', { name: 'Continue' });
    expect(button).toBeDisabled();

    fireEvent.press(button);
    expect(onPress).not.toHaveBeenCalled();
  });
});
