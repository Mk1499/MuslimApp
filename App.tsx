import { I18nManager, StatusBar, StyleSheet } from 'react-native';
import React from 'react';
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { ThemeProvider, useTheme } from './src/theme';
import { RootNavigator } from './src/navigation/RootNavigator';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './src/i18n';

const queryClient = new QueryClient();

function App(): React.JSX.Element {
  return (
    <GestureHandlerRootView style={styles.flex}>
      <ThemeProvider>
        <SafeAreaProvider>
          <QueryClientProvider client={queryClient}>
            <ThemedApp />
          </QueryClientProvider>
        </SafeAreaProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

function ThemedApp(): React.JSX.Element {
  const theme = useTheme();

  const baseTheme = theme.mode === 'dark' ? DarkTheme : DefaultTheme;
  const navigationTheme = {
    ...baseTheme,
    dark: theme.mode === 'dark',
    colors: {
      ...baseTheme.colors,
      background: theme.background.primary,
      card: theme.card.primary,
      text: theme.text.primary,
      border: theme.divider,
      primary: theme.button.primaryBg,
    },
  };

  return (
    <NavigationContainer
      theme={navigationTheme}
      direction={I18nManager.isRTL ? 'rtl' : 'ltr'}
    >
      <StatusBar
        barStyle={theme.mode === 'dark' ? 'light-content' : 'dark-content'}
      />
      <BottomSheetModalProvider>
        <RootNavigator />
      </BottomSheetModalProvider>
    </NavigationContainer>
  );
}

export default App;

const styles = StyleSheet.create({
  flex: { flex: 1 },
});
