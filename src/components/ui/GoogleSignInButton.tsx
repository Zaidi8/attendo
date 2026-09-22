import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';

export interface GoogleSignInButtonProps {
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  accessibilityHint?: string;
  testID?: string;
}

/**
 * Outlined secondary action for signing in with Google (development-plan §7:
 * Google Sign-In provider). Rendered as an outlined button (design.md §4.5
 * secondary actions) with the Google "G" as a simple glyph — Material Icons has
 * no Google brand glyph, so the four-color G is drawn with plain text stacking.
 */
export function GoogleSignInButton({
  onPress,
  loading = false,
  disabled = false,
  accessibilityHint,
  testID,
}: GoogleSignInButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel="Continue with Google"
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      activeOpacity={0.7}
      testID={testID}
      className={`min-h-[52px] flex-row items-center justify-center gap-2.5 rounded-[10px] border border-border bg-surface px-4 py-3.5 ${
        isDisabled ? 'opacity-60' : ''
      }`}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#4a90e2" />
      ) : (
        <>
          <View className="flex-row" aria-hidden>
            <Text className="font-bold" style={{ color: '#4285F4' }}>
              G
            </Text>
            <Text className="-ml-0.5 font-bold" style={{ color: '#EA4335' }}>
              o
            </Text>
            <Text className="-ml-0.5 font-bold" style={{ color: '#FBBC05' }}>
              o
            </Text>
            <Text className="-ml-0.5 font-bold" style={{ color: '#4285F4' }}>
              g
            </Text>
            <Text className="-ml-0.5 font-bold" style={{ color: '#34A853' }}>
              l
            </Text>
            <Text className="-ml-0.5 font-bold" style={{ color: '#EA4335' }}>
              e
            </Text>
          </View>
          <Text className="text-body font-semibold text-foreground">Continue with Google</Text>
        </>
      )}
    </TouchableOpacity>
  );
}