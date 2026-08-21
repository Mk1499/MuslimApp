import { StyleSheet, Text, type TextProps, type TextStyle } from 'react-native';
import React from 'react';
import {
  fontFamily,
  fontSize,
  lineHeight,
  useTheme,
  type AppTheme,
  type FontFamilyToken,
} from '../../theme';

export type AppTextVariant = 'display' | 'title' | 'subtitle' | 'body' | 'caption';

export type TextColorToken =
  | keyof AppTheme['text']
  | keyof AppTheme['status']
  | keyof AppTheme['button'];

const variantStyles: Record<AppTextVariant, TextStyle> = {
  display: {
    fontSize: fontSize.display,
    lineHeight: Math.round(fontSize.display * lineHeight.tight),
    fontFamily: fontFamily.bold,
  },
  title: {
    fontSize: fontSize.xxl,
    lineHeight: Math.round(fontSize.xxl * lineHeight.tight),
    fontFamily: fontFamily.semiBold,
  },
  subtitle: {
    fontSize: fontSize.lg,
    lineHeight: Math.round(fontSize.lg * lineHeight.normal),
    fontFamily: fontFamily.medium,
  },
  body: {
    fontSize: fontSize.md,
    lineHeight: Math.round(fontSize.md * lineHeight.normal),
    fontFamily: fontFamily.regular,
  },
  caption: {
    fontSize: fontSize.sm,
    lineHeight: Math.round(fontSize.sm * lineHeight.relaxed),
    fontFamily: fontFamily.regular,
  },
};

interface AppTextProps extends Omit<TextProps, 'style'> {
  variant?: AppTextVariant;
  /** Semantic color key resolved against the active theme. */
  color?: TextColorToken;
  /** Overrides the variant default font family. */
  weight?: FontFamilyToken;
  style?: TextStyle | (TextStyle | undefined)[];
}

export function AppText({
  variant = 'body',
  color = 'primary',
  weight,
  style,
  ...rest
}: AppTextProps): React.JSX.Element {
  const theme = useTheme();

  return (
    <Text
      {...rest}
      style={[
        styles.base,
        variantStyles[variant],
        { color: resolveTextColor(color, theme) },
        weight ? { fontFamily: fontFamily[weight] } : null,
        style,
      ]}
    />
  );
}

function resolveTextColor(token: TextColorToken, theme: AppTheme): string {
  if (token in theme.text) {
    return theme.text[token as keyof AppTheme['text']];
  }
  if (token in theme.status) {
    return theme.status[token as keyof AppTheme['status']];
  }
  return theme.button[token as keyof AppTheme['button']];
}

const styles = StyleSheet.create({
  base: {},
});
