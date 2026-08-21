import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme, type AppTheme } from '../../theme';

export type IconColorToken =
  | `text.${keyof AppTheme['text']}`
  | `status.${keyof AppTheme['status']}`
  | `tabBar.${keyof AppTheme['tabBar']}`
  | 'accent.primary'
  | (string & {});

export type AppIconName = React.ComponentProps<typeof Ionicons>['name'];

interface AppIconProps {
  name: AppIconName;
  size?: number;
  /** Dot-path theme token (e.g. 'tabBar.active') or plain color string. */
  color?: IconColorToken;
}

export function AppIcon({ name, size = 24, color = 'text.primary' }: AppIconProps): React.JSX.Element {
  const theme = useTheme();

  return <Ionicons name={name} size={size} color={resolveColor(color, theme)} />;
}

function resolveColor(token: IconColorToken, theme: AppTheme): string {
  if (!token.includes('.')) {
    return token;
  }
  const [group, key] = token.split('.');
  const groups = theme as unknown as Record<string, Record<string, string>>;
  return groups[group]?.[key] ?? theme.text.primary;
}
