/**
 * Raw color palette. Semantic per-component tokens are derived from
 * this palette in lightTheme / darkTheme - never use hex values in screens.
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

export type ThemeMode = 'light' | 'dark';

/** User-facing preference - 'system' follows the OS appearance. */
export type ThemePreference = ThemeMode | 'system';

/**
 * Design system tokens grouped by component.
 * Every group owns its colors so components stay self-contained
 * and swapping themes only touches this file.
 */
export type AppTheme = {
  mode: ThemeMode;
  /** Screen backgrounds. */
  background: { primary: string; secondary: string };
  /** Typography colors (use via AppText). */
  text: { primary: string; secondary: string; muted: string; inverse: string };
  /** Card surfaces (use via AppCard). */
  card: { primary: string; secondary: string; border: string };
  /** Text inputs (use via AppTextInput). */
  input: {
    background: string;
    border: string;
    borderFocused: string;
    placeholder: string;
    text: string;
  };
  /** Touchable buttons (use via AppTouchable variants). */
  button: {
    primaryBg: string;
    primaryText: string;
    secondaryBg: string;
    secondaryText: string;
    disabledBg: string;
    disabledText: string;
  };
  /** Bottom tab bar. */
  tabBar: { background: string; active: string; inactive: string; border: string };
  /** Status colors + soft backgrounds for badges/banners. */
  status: {
    success: string;
    successSoft: string;
    warning: string;
    warningSoft: string;
    error: string;
    errorSoft: string;
    info: string;
    infoSoft: string;
  };
  /** Brand accent highlights. */
  accent: { primary: string; soft: string };
  /** Gradient fills (use via AppGradient). */
  gradient: { hero: [string, string]; primary: [string, string]; scrim: [string, string] };
  divider: string;
  overlay: string;
};

export const lightTheme: AppTheme = {
  mode: 'light',
  background: {
    primary: palette.neutral[50],
    secondary: palette.neutral[100],
  },
  text: {
    primary: palette.neutral[900],
    secondary: palette.neutral[600],
    muted: palette.neutral[400],
    inverse: palette.neutral[0],
  },
  card: {
    primary: palette.neutral[0],
    secondary: palette.neutral[50],
    border: palette.neutral[200],
  },
  input: {
    background: palette.neutral[0],
    border: palette.neutral[300],
    borderFocused: palette.emerald[600],
    placeholder: palette.neutral[400],
    text: palette.neutral[900],
  },
  button: {
    primaryBg: palette.emerald[600],
    primaryText: palette.neutral[0],
    secondaryBg: palette.emerald[100],
    secondaryText: palette.emerald[800],
    disabledBg: palette.neutral[200],
    disabledText: palette.neutral[500],
  },
  tabBar: {
    background: palette.neutral[0],
    active: palette.emerald[600],
    inactive: palette.neutral[400],
    border: palette.neutral[200],
  },
  status: {
    success: palette.emerald[600],
    successSoft: palette.emerald[100],
    warning: palette.gold[500],
    warningSoft: palette.gold[100],
    error: '#DC2626',
    errorSoft: '#FEE2E2',
    info: '#2563EB',
    infoSoft: '#DBEAFE',
  },
  accent: {
    primary: palette.gold[600],
    soft: palette.gold[100],
  },
  gradient: {
    hero: [palette.emerald[500], palette.emerald[800]],
    primary: [palette.gold[500], palette.gold[600]],
    scrim: ['rgba(15, 23, 42, 0)', 'rgba(15, 23, 42, 0.75)'],
  },
  divider: palette.neutral[200],
  overlay: 'rgba(15, 23, 42, 0.5)',
};

export const darkTheme: AppTheme = {
  mode: 'dark',
  background: {
    primary: palette.neutral[900],
    secondary: palette.neutral[800],
  },
  text: {
    primary: palette.neutral[50],
    secondary: palette.neutral[300],
    muted: palette.neutral[500],
    inverse: palette.neutral[900],
  },
  card: {
    primary: palette.neutral[800],
    secondary: palette.neutral[700],
    border: palette.neutral[700],
  },
  input: {
    background: palette.neutral[800],
    border: palette.neutral[600],
    borderFocused: palette.emerald[400],
    placeholder: palette.neutral[500],
    text: palette.neutral[50],
  },
  button: {
    primaryBg: palette.emerald[500],
    primaryText: palette.neutral[900],
    secondaryBg: palette.emerald[900],
    secondaryText: palette.emerald[200],
    disabledBg: palette.neutral[700],
    disabledText: palette.neutral[500],
  },
  tabBar: {
    background: palette.neutral[800],
    active: palette.emerald[400],
    inactive: palette.neutral[400],
    border: palette.neutral[700],
  },
  status: {
    success: palette.emerald[400],
    successSoft: palette.emerald[900],
    warning: palette.gold[300],
    warningSoft: palette.gold[700],
    error: '#F87171',
    errorSoft: '#7F1D1D',
    info: '#60A5FA',
    infoSoft: '#1E3A8A',
  },
  accent: {
    primary: palette.gold[300],
    soft: palette.gold[700],
  },
  gradient: {
    hero: [palette.emerald[600], palette.emerald[900]],
    primary: [palette.gold[600], palette.gold[700]],
    scrim: ['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.85)'],
  },
  divider: palette.neutral[700],
  overlay: 'rgba(0, 0, 0, 0.65)',
};

export function getTheme(mode: ThemeMode): AppTheme {
  return mode === 'dark' ? darkTheme : lightTheme;
}
