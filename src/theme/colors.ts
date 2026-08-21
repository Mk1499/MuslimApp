/**
 * Raw color palette. Semantic app tokens (background, text, primary...)
 * are derived from this palette in lightTheme / darkTheme.
 */
export const palette = {
  emerald: {
    50: '#ECFDF5',
    100: '#D1FAE5',
    200: '#A7F3D0',
    300: '#6EE7B7',
    400: '#34D399',
    500: '#10B981',
    600: '#059669',
    700: '#047857',
    800: '#065F46',
    900: '#064E3B',
  },
  gold: {
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    500: '#F59E0B',
    600: '#D97706',
    700: '#B45309',
  },
  neutral: {
    0: '#FFFFFF',
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
  },
} as const;

export type AppTheme = {
  mode: 'light' | 'dark';
  background: string;
  surface: string;
  surfaceMuted: string;
  text: string;
  textMuted: string;
  border: string;
  primary: string;
  primarySoft: string;
  onPrimary: string;
  accent: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  tabBarBackground: string;
  tabBarActive: string;
  tabBarInactive: string;
};

export const lightTheme: AppTheme = {
  mode: 'light',
  background: palette.neutral[50],
  surface: palette.neutral[0],
  surfaceMuted: palette.neutral[100],
  text: palette.neutral[900],
  textMuted: palette.neutral[500],
  border: palette.neutral[200],
  primary: palette.emerald[600],
  primarySoft: palette.emerald[100],
  onPrimary: palette.neutral[0],
  accent: palette.gold[600],
  success: palette.emerald[500],
  warning: palette.gold[500],
  error: '#DC2626',
  info: '#2563EB',
  tabBarBackground: palette.neutral[0],
  tabBarActive: palette.emerald[600],
  tabBarInactive: palette.neutral[400],
};

export const darkTheme: AppTheme = {
  mode: 'dark',
  background: palette.neutral[900],
  surface: palette.neutral[800],
  surfaceMuted: palette.neutral[700],
  text: palette.neutral[50],
  textMuted: palette.neutral[400],
  border: palette.neutral[700],
  primary: palette.emerald[400],
  primarySoft: palette.emerald[900],
  onPrimary: palette.neutral[900],
  accent: palette.gold[300],
  success: palette.emerald[400],
  warning: palette.gold[300],
  error: '#F87171',
  info: '#60A5FA',
  tabBarBackground: palette.neutral[800],
  tabBarActive: palette.emerald[400],
  tabBarInactive: palette.neutral[400],
};
