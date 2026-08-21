import React from 'react';
import LinearGradient, {
  LinearGradientProps,
} from 'react-native-linear-gradient';
import { useTheme } from '../../theme';

export type GradientColorToken = keyof ReturnType<typeof useTheme>['gradient'];

type GradientPreset = GradientColorToken;

export type AppGradientProps = Omit<LinearGradientProps, 'colors'> & {
  /** Named gradient token from the theme - ignored when `colors` is given. */
  preset?: GradientPreset;
  /** Explicit color stops override the themed preset (escape hatch only). */
  colors?: [string, string, ...string[]];
};

export function AppGradient({
  preset = 'hero',
  colors,
  style,
  ...rest
}: AppGradientProps): React.JSX.Element {
  const theme = useTheme();

  return (
    <LinearGradient
      colors={colors ?? theme.gradient[preset]}
      style={style}
      {...rest}
    />
  );
}
