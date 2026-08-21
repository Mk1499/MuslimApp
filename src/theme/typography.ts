/**
 * Typography scale.
 * Swap 'System' with custom font family names (e.g. 'Amiri-Regular')
 * once fonts are linked via react-native.config.js.
 */
export const fontFamily = {
  regular: 'System',
  medium: 'System',
  semiBold: 'System',
  bold: 'System',
};

export const fontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 21,
  xxl: 26,
  display: 32,
} as const;

export const fontWeight = {
  regular: '400',
  medium: '500',
  semiBold: '600',
  bold: '700',
} as const;

export const lineHeight = {
  tight: 1.25,
  normal: 1.4,
  relaxed: 1.6,
} as const;
