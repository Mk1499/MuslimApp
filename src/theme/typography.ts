/**
 * Cairo font family names map to the bundled TTF filenames
 * (src/assets/fonts/Cairo-*.ttf) registered via react-native.config.js.
 */
export const fontFamily = {
  regular: 'Cairo-Regular',
  medium: 'Cairo-Medium',
  semiBold: 'Cairo-SemiBold',
  bold: 'Cairo-Bold',
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

export const lineHeight = {
  tight: 1.25,
  normal: 1.4,
  relaxed: 1.6,
} as const;

export type FontFamilyToken = keyof typeof fontFamily;
