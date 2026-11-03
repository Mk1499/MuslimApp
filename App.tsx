import { I18nManager, StatusBar, StyleSheet } from 'react-native';
import React from 'react';
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { ThemeProvider, useTheme } from './src/theme';
import { RootNavigator } from './src/navigation/RootNavigator';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './src/i18n';
import { AthanNotificationManager } from './src/features/athan/AthanNotificationManager';
import { trackScreenView } from './src/hooks/useAnalytics';

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
  const navigationRef = useNavigationContainerRef();
  const lastTrackedRouteKey = React.useRef<string | null>(null);

  const trackCurrentScreen = React.useCallback(() => {
    const route = navigationRef.getCurrentRoute();
    if (!route || route.key === lastTrackedRouteKey.current) return;

    lastTrackedRouteKey.current = route.key;
    trackScreenView(route.name);
  }, [navigationRef]);

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
      ref={navigationRef}
      theme={navigationTheme}
      direction={I18nManager.isRTL ? 'rtl' : 'ltr'}
      onReady={trackCurrentScreen}
      onStateChange={trackCurrentScreen}
    >
      <StatusBar
        barStyle={theme.mode === 'dark' ? 'light-content' : 'dark-content'}
      />
      <BottomSheetModalProvider>
        <AthanNotificationManager />
        <RootNavigator />
      </BottomSheetModalProvider>
    </NavigationContainer>
  );
}

export default App;

const styles = StyleSheet.create({
  flex: { flex: 1 },
});
