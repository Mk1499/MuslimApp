import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { getTheme, type AppTheme, type ThemeMode, type ThemePreference } from './colors';
import { useAppStore } from '../store/useAppStore';

interface ThemeContextValue {
  /** Fully resolved theme - use this everywhere for colors. */
  theme: AppTheme;
  /** Resolved scheme after applying the user preference ('system' included). */
  resolvedScheme: ThemeMode;
  /** Raw user preference stored in the app store. */
  preference: ThemePreference;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: getTheme('light'),
  resolvedScheme: 'light',
  preference: 'system',
});

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps): React.JSX.Element {
  const preference = useAppStore(state => state.themePreference);
  const systemScheme = useColorScheme();

  const resolvedScheme: ThemeMode =
    preference === 'system' ? (systemScheme ?? 'light') : preference;

  const value = useMemo(
    () => ({ theme: getTheme(resolvedScheme), resolvedScheme, preference }),
    [resolvedScheme, preference],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): AppTheme {
  return useContext(ThemeContext).theme;
}
