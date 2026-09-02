import { ActivityIndicator, Pressable, Text } from 'react-native';

export interface PrimaryButtonProps {
  /** Visible button text and accessible name. */
  label: string;
  onPress: () => void;
  /** Show a spinner and block interaction while an async action runs. */
  loading?: boolean;
  disabled?: boolean;
  accessibilityHint?: string;
  testID?: string;
}

/**
 * Strong filled primary action (design.md §4.5). Keeps a stable accessible name
 * while loading and blocks presses so a slow request can't be double-submitted.
 */
export function PrimaryButton({
  label,
  onPress,
  loading = false,
  disabled = false,
  accessibilityHint,
  testID,
}: PrimaryButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      testID={testID}
      className={`min-h-[52px] items-center justify-center rounded-[10px] bg-secondary-deep px-4 py-3.5 ${
        isDisabled ? 'opacity-60' : ''
      }`}
    >
      {loading ? (
        <ActivityIndicator color="#ffffff" />
      ) : (
        <Text className="text-body font-semibold text-surface">{label}</Text>
      )}
    </Pressable>
  );
}
