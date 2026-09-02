import MaterialIcons, { type MaterialIconsIconName } from '@react-native-vector-icons/material-icons';

/**
 * Icon used across Attendo, mapping the Material Symbols glyphs used in the
 * Stitch design (e.g. `lock_reset`, `visibility_off`) onto the matching
 * Material Icons glyph shipped by @react-native-vector-icons/material-icons.
 *
 * Material Symbols names use underscores; Material Icons names use hyphens, so
 * this thin adaptor keeps the app code close to the approved design.
 */
export type AppIconName =
  | 'school'
  | 'mail'
  | 'lock'
  | 'lock_reset'
  | 'visibility'
  | 'visibility_off'
  | 'person'
  | 'arrow_back'
  | 'logout'
  | 'menu_book'
  | 'assignment';

const glyphs: Record<AppIconName, MaterialIconsIconName> = {
  school: 'school',
  mail: 'mail',
  lock: 'lock',
  lock_reset: 'lock-reset',
  visibility: 'visibility',
  visibility_off: 'visibility-off',
  person: 'person',
  arrow_back: 'arrow-back',
  logout: 'logout',
  menu_book: 'menu-book',
  assignment: 'assignment',
};

export interface AppIconProps {
  /** Material Symbols glyph name from the approved design. */
  name: AppIconName;
  size?: number;
  /** Icon tint; falls back to the design's secondary blue. */
  color?: string;
  /** Accessible name for icon-only controls. */
  accessibilityLabel?: string;
  testID?: string;
}

/**
 * Single colour vector icon matching the Material Symbols set in the Stitch
 * designs. Render-only; tap behaviour lives on the parent Pressable.
 */
export function AppIcon({ name, size = 20, color, accessibilityLabel, testID }: AppIconProps) {
  return (
    <MaterialIcons
      name={glyphs[name]}
      size={size}
      color={color}
      accessibilityLabel={accessibilityLabel}
      testID={testID}
    />
  );
}