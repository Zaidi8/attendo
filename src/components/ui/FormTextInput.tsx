import { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View, type TextInputProps } from 'react-native';

import { AppIcon, type AppIconName } from './AppIcon';

export interface FormTextInputProps extends TextInputProps {
  /** Visible label above the field (also used as the accessibility label). */
  label: string;
  /** Error message to show beneath the field and turn the border red. */
  error?: string;
  /** Show the typed value as a password (with a reveal toggle). */
  secure?: boolean;
  /** Leading icon inside the field (Material Symbols glyph name). */
  icon?: AppIconName;
  testID?: string;
}

/**
 * Labelled, single-line text input matching the Stitch auth form fields
 * (design.md §4). 44px touch target, focus border in the secondary blue,
 * red border + message when invalid. A secure input gets a reveal toggle;
 * the visible label stays the accessibility name while typing.
 */
export function FormTextInput({
  label,
  error,
  secure = false,
  icon,
  testID,
  ...props
}: FormTextInputProps) {
  const [hidden, setHidden] = useState(secure);
  const [focused, setFocused] = useState(false);

  const borderColor = error ? 'border-absent' : focused ? 'border-secondary' : 'border-border';
  const leadingPadding = icon ? 'pl-11' : 'pl-4';
  const trailingPadding = props.secureTextEntry ? 'pr-16' : 'pr-4';

  return (
    <View className="w-full">
      <Text className="mb-1 text-label font-semibold text-foreground">{label}</Text>
      <View className="relative">
        <TextInput
          {...props}
          secureTextEntry={hidden}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          accessibilityLabel={label}
          aria-invalid={error ? true : false}
          placeholderTextColor="#98a2b3"
          className={`w-full rounded-lg border bg-surface py-3 text-foreground ${leadingPadding} ${trailingPadding} ${borderColor}`}
          style={{ minHeight: 44, fontSize: 16, textAlignVertical: 'center' }}
          testID={testID}
        />
        {icon ? (
          <View className="pointer-events-none absolute left-3.5 top-0 bottom-0 justify-center">
            <AppIcon name={icon} size={20} color="#98a2b3" />
          </View>
        ) : null}
        {secure && (
          <TouchableOpacity
            onPress={() => setHidden((value) => !value)}
            accessibilityRole="button"
            accessibilityLabel={hidden ? 'Show password' : 'Hide password'}
            accessibilityHint="Toggles the password visibility"
            activeOpacity={0.5}
            className="absolute right-0 top-0 h-full justify-center px-3"
            hitSlop={8}
          >
            <AppIcon name={hidden ? 'visibility' : 'visibility_off'} size={20} color="#667085" />
          </TouchableOpacity>
        )}
      </View>
      {error ? (
        <Text className="mt-1 text-body-sm text-absent" accessibilityRole="alert">
          {error}
        </Text>
      ) : null}
    </View>
  );
}
