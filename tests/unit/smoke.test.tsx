import { render, screen } from '@testing-library/react-native';
import { Text, View } from 'react-native';

/** Minimal component used to prove the render pipeline works end to end. */
function Bootstrap() {
  return (
    <View>
      <Text>Attendo</Text>
    </View>
  );
}

describe('Sprint 0 test harness', () => {
  it('executes a trivial assertion (jest + TypeScript preset)', () => {
    expect(1 + 1).toBe(2);
  });

  it('renders a React Native component (jest-expo + RNTL + test-renderer)', async () => {
    await render(<Bootstrap />);
    expect(screen.getByText('Attendo')).toBeOnTheScreen();
  });
});
