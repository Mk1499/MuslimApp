import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Foundation from 'react-native-vector-icons/Foundation';
import { createIconSet } from 'react-native-vector-icons';

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
  as?:
    | 'Ionicons'
    | 'AntDesign'
    | 'MaterialIcons'
    | 'MaterialCommunityIcons'
    | 'FontAwesome'
    | 'FontAwesome5'
    | 'Entypo'
    | 'Feather'
    | 'EvilIcons'
    | 'Foundation';
}

export function AppIcon({
  name,
  size = 24,
  color = 'text.primary',
  as = 'Ionicons',
}: AppIconProps): React.JSX.Element {
  const theme = useTheme();

  if (as === 'AntDesign') {
    return (
      <AntDesign name={name} size={size} color={resolveColor(color, theme)} />
    );
  } else if (as === 'MaterialIcons') {
    return (
      <MaterialIcons
        name={name}
        size={size}
        color={resolveColor(color, theme)}
      />
    );
  } else if (as === 'MaterialCommunityIcons') {
    return (
      <MaterialCommunityIcons
        name={name}
        size={size}
        color={resolveColor(color, theme)}
      />
    );
  } else if (as === 'FontAwesome') {
    return (
      <FontAwesome name={name} size={size} color={resolveColor(color, theme)} />
    );
  } else if (as === 'FontAwesome5') {
    return (
      <FontAwesome5
        name={name}
        size={size}
        color={resolveColor(color, theme)}
      />
    );
  } else if (as === 'Entypo') {
    return (
      <Entypo name={name} size={size} color={resolveColor(color, theme)} />
    );
  } else if (as === 'Feather') {
    return (
      <Feather name={name} size={size} color={resolveColor(color, theme)} />
    );
  } else if (as === 'EvilIcons') {
    return (
      <EvilIcons name={name} size={size} color={resolveColor(color, theme)} />
    );
  } else if (as === 'Foundation') {
    return (
      <Foundation name={name} size={size} color={resolveColor(color, theme)} />
    );
  }

  return (
    <Ionicons name={name} size={size} color={resolveColor(color, theme)} />
  );
}

function resolveColor(token: IconColorToken, theme: AppTheme): string {
  if (!token.includes('.')) {
    return token;
  }
  const [group, key] = token.split('.');
  const groups = theme as unknown as Record<string, Record<string, string>>;
  return groups[group]?.[key] ?? theme.text.primary;
}
